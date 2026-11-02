import { TIERS, findQuestion, getDailyScroll, getPacificDateKey } from "../../../data/game";
import { ensureScribeTables } from "../../../lib/d1";
import { apiJson, preflight, readLimitedJson, requestOriginAllowed } from "../../../lib/api-security";

type SubmittedAnswer = { questionId?: string; answerId?: string | null; elapsedMs?: number };

function cleanNickname(value: unknown) {
  return String(value ?? "Reader").replace(/[^a-zA-Z0-9 _.-]/g, "").trim().slice(0, 24) || "Reader";
}

export async function GET(request: Request) {
  if (!requestOriginAllowed(request)) return apiJson(request, { error: "Origin not allowed" }, 403);
  try {
    const dateKey = new URL(request.url).searchParams.get("date") ?? "";
    if (!/^\d{4}-\d{2}-\d{2}$/.test(dateKey)) return apiJson(request, { error: "Invalid date" }, 400);
    const db = await ensureScribeTables();
    const rows = await db.prepare(
      `SELECT nickname, score, correct_count AS correctCount, elapsed_ms AS elapsedMs
       FROM daily_scores WHERE date_key = ?
       ORDER BY score DESC, correct_count DESC, elapsed_ms ASC LIMIT 50`,
    ).bind(dateKey).all();
    return apiJson(request, { entries: rows.results });
  } catch (error) {
    console.error("Leaderboard read failed", error);
    return apiJson(request, { error: "Leaderboard unavailable" }, 500);
  }
}

export function OPTIONS(request: Request) {
  return preflight(request);
}

async function rateLimited(db: D1Database, request: Request, playerId: string) {
  const forwardedIp = request.headers.get("cf-connecting-ip") ?? "local";
  const bytes = new TextEncoder().encode(`${forwardedIp}:${playerId}`);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  const identifier = Array.from(new Uint8Array(digest).slice(0, 12), (byte) => byte.toString(16).padStart(2, "0")).join("");
  const windowId = Math.floor(Date.now() / 600_000);
  await db.prepare(
    `INSERT INTO request_limits (identifier, window_id, request_count) VALUES (?, ?, 1)
     ON CONFLICT(identifier, window_id) DO UPDATE SET request_count = request_count + 1`,
  ).bind(identifier, windowId).run();
  const row = await db.prepare(
    "SELECT request_count AS count FROM request_limits WHERE identifier = ? AND window_id = ?",
  ).bind(identifier, windowId).first<{ count: number }>();
  if (Math.random() < 0.02) {
    await db.prepare("DELETE FROM request_limits WHERE window_id < ?").bind(windowId - 6).run();
  }
  return Number(row?.count ?? 0) > 12;
}

export async function POST(request: Request) {
  if (!requestOriginAllowed(request)) return apiJson(request, { error: "Origin not allowed" }, 403);
  try {
    const payload = await readLimitedJson<{
      nickname?: string;
      playerId?: string;
      dateKey?: string;
      scrollId?: string;
      answers?: SubmittedAnswer[];
    }>(request);
    const today = getPacificDateKey();
    const scroll = getDailyScroll();
    const validPlayerId = typeof payload.playerId === "string" && /^[a-zA-Z0-9-]{16,80}$/.test(payload.playerId);
    if (
      payload.scrollId !== scroll.id || payload.dateKey !== today || !validPlayerId ||
      !Array.isArray(payload.answers) || payload.answers.length !== 7
    ) {
      return apiJson(request, { error: "Invalid score submission" }, 400);
    }

    const submittedIds = payload.answers.map((item) => item.questionId);
    if (new Set(submittedIds).size !== 7 || submittedIds.some((id, index) => id !== scroll.questionIds[index])) {
      return apiJson(request, { error: "Question set does not match today’s scroll" }, 400);
    }

    const db = await ensureScribeTables();
    if (await rateLimited(db, request, payload.playerId!)) {
      return apiJson(request, { error: "Too many submissions; please try again later" }, 429);
    }

    let score = 0;
    let correctCount = 0;
    let elapsedMs = 0;
    for (const submitted of payload.answers) {
      if (!Number.isInteger(submitted.elapsedMs) || submitted.elapsedMs! < 0 || submitted.elapsedMs! > 30_000) {
        return apiJson(request, { error: "Invalid answer timing" }, 400);
      }
      const question = findQuestion(submitted.questionId);
      const accepted = question?.answers.find((answer) => answer.id === submitted.answerId);
      if (submitted.answerId !== null && !accepted) return apiJson(request, { error: "Unknown answer" }, 400);
      elapsedMs += submitted.elapsedMs!;
      if (accepted) {
        score += TIERS[accepted.tier].points;
        correctCount += 1;
      }
    }

    await db.prepare(
      `INSERT OR IGNORE INTO daily_scores
       (date_key, scroll_id, player_id, nickname, score, correct_count, elapsed_ms)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
    ).bind(
      payload.dateKey,
      scroll.id,
      String(payload.playerId).slice(0, 80),
      cleanNickname(payload.nickname),
      score,
      correctCount,
      elapsedMs,
    ).run();

    const rankRow = await db.prepare(
      `SELECT
         (SELECT COUNT(*) + 1 FROM daily_scores rival
          WHERE rival.date_key = ? AND (rival.score > mine.score OR (rival.score = mine.score AND rival.elapsed_ms < mine.elapsed_ms))) AS rank,
         (SELECT COUNT(*) FROM daily_scores WHERE date_key = ?) AS players
       FROM daily_scores mine WHERE mine.date_key = ? AND mine.player_id = ?`,
    ).bind(payload.dateKey, payload.dateKey, payload.dateKey, payload.playerId).first<{ rank: number; players: number }>();

    return apiJson(request, { score, correctCount, rank: rankRow?.rank, players: rankRow?.players });
  } catch (error) {
    if (error instanceof SyntaxError || (error instanceof Error && ["JSON_REQUIRED", "BODY_TOO_LARGE"].includes(error.message))) {
      return apiJson(request, { error: "Invalid request body" }, 400);
    }
    console.error("Score submission failed", error);
    return apiJson(request, { error: "Score unavailable" }, 500);
  }
}
