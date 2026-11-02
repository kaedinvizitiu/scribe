import { DAILY_SCROLLS, TIERS, findQuestion } from "../../../data/game";
import { ensureScribeTables } from "../../../lib/d1";

type SubmittedAnswer = { questionId?: string; answerId?: string | null; elapsedMs?: number };

function cleanNickname(value: unknown) {
  return String(value ?? "Reader").replace(/[^a-zA-Z0-9 _.-]/g, "").trim().slice(0, 24) || "Reader";
}

export async function GET(request: Request) {
  try {
    const dateKey = new URL(request.url).searchParams.get("date") ?? "";
    const db = await ensureScribeTables();
    const rows = await db.prepare(
      `SELECT nickname, score, correct_count AS correctCount, elapsed_ms AS elapsedMs
       FROM daily_scores WHERE date_key = ?
       ORDER BY score DESC, correct_count DESC, elapsed_ms ASC LIMIT 50`,
    ).bind(dateKey).all();
    return Response.json({ entries: rows.results });
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : "Leaderboard unavailable" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const payload = await request.json() as {
      nickname?: string;
      playerId?: string;
      dateKey?: string;
      scrollId?: string;
      answers?: SubmittedAnswer[];
    };
    const scroll = DAILY_SCROLLS.find((item) => item.id === payload.scrollId);
    if (!scroll || !payload.playerId || !payload.dateKey || !Array.isArray(payload.answers)) {
      return Response.json({ error: "Invalid score submission" }, { status: 400 });
    }

    let score = 0;
    let correctCount = 0;
    let elapsedMs = 0;
    for (const submitted of payload.answers.slice(0, 7)) {
      if (!submitted.questionId || !scroll.questionIds.includes(submitted.questionId)) continue;
      const question = findQuestion(submitted.questionId);
      const accepted = question?.answers.find((answer) => answer.id === submitted.answerId);
      elapsedMs += Math.max(0, Math.min(30_000, Number(submitted.elapsedMs ?? 30_000)));
      if (accepted) {
        score += TIERS[accepted.tier].points;
        correctCount += 1;
      }
    }

    const db = await ensureScribeTables();
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

    return Response.json({ score, correctCount, rank: rankRow?.rank, players: rankRow?.players });
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : "Score unavailable" }, { status: 500 });
  }
}
