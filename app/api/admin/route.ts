import { DAILY_SCROLLS, questionsForScroll } from "../../../data/game";
import { ensureScribeTables, getScriptoriumKey } from "../../../lib/d1";

function authorized(request: Request) {
  const key = getScriptoriumKey(request);
  return Boolean(key && request.headers.get("x-scriptorium-key") === key);
}

export async function GET(request: Request) {
  if (!authorized(request)) return Response.json({ error: "Passphrase required" }, { status: 401 });
  const db = await ensureScribeTables();
  const saved = await db.prepare("SELECT scroll_id AS scrollId, status, note, updated_at AS updatedAt FROM scroll_approvals").all();
  const statusMap = new Map(saved.results.map((row) => [String(row.scrollId), row]));
  const scrolls = DAILY_SCROLLS.map((scroll) => ({
    ...scroll,
    questionCount: questionsForScroll(scroll).length,
    answerCount: questionsForScroll(scroll).reduce((sum, question) => sum + question.answers.length, 0),
    status: String(statusMap.get(scroll.id)?.status ?? "draft"),
    note: String(statusMap.get(scroll.id)?.note ?? ""),
  }));
  return Response.json({ scrolls });
}

export async function POST(request: Request) {
  if (!authorized(request)) return Response.json({ error: "Passphrase required" }, { status: 401 });
  const payload = await request.json() as { scrollId?: string; status?: string; note?: string };
  if (!payload.scrollId || !DAILY_SCROLLS.some((item) => item.id === payload.scrollId)) {
    return Response.json({ error: "Unknown scroll" }, { status: 400 });
  }
  const status = ["draft", "review", "approved", "scheduled"].includes(payload.status ?? "") ? payload.status! : "draft";
  const db = await ensureScribeTables();
  await db.prepare(
    `INSERT INTO scroll_approvals (scroll_id, status, note, updated_at)
     VALUES (?, ?, ?, CURRENT_TIMESTAMP)
     ON CONFLICT(scroll_id) DO UPDATE SET status = excluded.status, note = excluded.note, updated_at = CURRENT_TIMESTAMP`,
  ).bind(payload.scrollId, status, String(payload.note ?? "").slice(0, 500)).run();
  return Response.json({ ok: true, scrollId: payload.scrollId, status });
}
