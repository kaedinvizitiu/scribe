import { env } from "cloudflare:workers";

type ScribeEnv = {
  DB: D1Database;
};

export function getD1() {
  return (env as unknown as ScribeEnv).DB;
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
    db.prepare(`CREATE TABLE IF NOT EXISTS request_limits (
      identifier TEXT NOT NULL,
      window_id INTEGER NOT NULL,
      request_count INTEGER NOT NULL DEFAULT 1,
      PRIMARY KEY (identifier, window_id)
    )`),
  ]);
  return db;
}
