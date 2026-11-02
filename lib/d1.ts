import { env } from "cloudflare:workers";

type ScribeEnv = {
  DB: D1Database;
  SCRIPTORIUM_KEY?: string;
};

export function getD1() {
  return (env as unknown as ScribeEnv).DB;
}

export function getScriptoriumKey(request: Request) {
  const configured = (env as unknown as ScribeEnv).SCRIPTORIUM_KEY;
  const host = new URL(request.url).hostname;
  if (configured) return configured;
  return host === "localhost" || host === "127.0.0.1" ? "scribe-local" : null;
}

export async function ensureScribeTables() {
  const db = getD1();
  await db.batch([
    db.prepare(`CREATE TABLE IF NOT EXISTS daily_scores (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      date_key TEXT NOT NULL,
      scroll_id TEXT NOT NULL,
      player_id TEXT NOT NULL,
      nickname TEXT NOT NULL,
      score INTEGER NOT NULL,
      correct_count INTEGER NOT NULL,
      elapsed_ms INTEGER NOT NULL,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(date_key, player_id)
    )`),
    db.prepare(`CREATE INDEX IF NOT EXISTS daily_scores_date_score_idx
      ON daily_scores(date_key, score DESC, elapsed_ms ASC)`),
    db.prepare(`CREATE TABLE IF NOT EXISTS scroll_approvals (
      scroll_id TEXT PRIMARY KEY,
      status TEXT NOT NULL DEFAULT 'draft',
      note TEXT NOT NULL DEFAULT '',
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    )`),
    db.prepare(`CREATE TABLE IF NOT EXISTS answer_suggestions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      question_id TEXT NOT NULL,
      suggested_answer TEXT NOT NULL,
      player_id TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'pending',
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    )`),
    db.prepare(`CREATE TABLE IF NOT EXISTS request_limits (
      identifier TEXT NOT NULL,
      window_id INTEGER NOT NULL,
      request_count INTEGER NOT NULL DEFAULT 1,
      PRIMARY KEY (identifier, window_id)
    )`),
  ]);
  return db;
}
