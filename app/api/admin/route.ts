import { DAILY_SCROLLS, questionsForScroll } from "../../../data/game";
import { ensureScribeTables, getScriptoriumKey } from "../../../lib/d1";
import { apiJson, constantTimeEqual, preflight, readLimitedJson, requestOriginAllowed } from "../../../lib/api-security";

async function authorized(request: Request) {
  const key = getScriptoriumKey(request);
  const submitted = request.headers.get("x-scriptorium-key");
  return Boolean(key && submitted && await constantTimeEqual(submitted, key));
}

export async function GET(request: Request) {
  if (!requestOriginAllowed(request)) return apiJson(request, { error: "Origin not allowed" }, 403);
  if (!await authorized(request)) return apiJson(request, { error: "Passphrase required" }, 401);
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
  return apiJson(request, { scrolls });
}

export async function POST(request: Request) {
  if (!requestOriginAllowed(request)) return apiJson(request, { error: "Origin not allowed" }, 403);
  if (!await authorized(request)) return apiJson(request, { error: "Passphrase required" }, 401);
  let payload: { scrollId?: string; status?: string; note?: string };
  try {
    payload = await readLimitedJson(request, 2_048);
  } catch {
    return apiJson(request, { error: "Invalid request body" }, 400);
  }
  if (!payload.scrollId || !DAILY_SCROLLS.some((item) => item.id === payload.scrollId)) {
    return apiJson(request, { error: "Unknown scroll" }, 400);
  }
  const status = ["draft", "review", "approved", "scheduled"].includes(payload.status ?? "") ? payload.status! : "draft";
  const db = await ensureScribeTables();
  await db.prepare(
    `INSERT INTO scroll_approvals (scroll_id, status, note, updated_at)
     VALUES (?, ?, ?, CURRENT_TIMESTAMP)
     ON CONFLICT(scroll_id) DO UPDATE SET status = excluded.status, note = excluded.note, updated_at = CURRENT_TIMESTAMP`,
  ).bind(payload.scrollId, status, String(payload.note ?? "").slice(0, 500)).run();
  return apiJson(request, { ok: true, scrollId: payload.scrollId, status });
}

export function OPTIONS(request: Request) {
  return preflight(request);
}
