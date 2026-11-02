import { sql } from "drizzle-orm";
import { integer, sqliteTable, text, uniqueIndex } from "drizzle-orm/sqlite-core";

export const dailyScores = sqliteTable("daily_scores", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  dateKey: text("date_key").notNull(),
  scrollId: text("scroll_id").notNull(),
  playerId: text("player_id").notNull(),
  nickname: text("nickname").notNull(),
  score: integer("score").notNull(),
  correctCount: integer("correct_count").notNull(),
  elapsedMs: integer("elapsed_ms").notNull(),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
}, (table) => [
  uniqueIndex("daily_scores_date_player_unique").on(table.dateKey, table.playerId),
]);

export const scrollApprovals = sqliteTable("scroll_approvals", {
  scrollId: text("scroll_id").primaryKey(),
  status: text("status").notNull().default("draft"),
  note: text("note").notNull().default(""),
  updatedAt: text("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const answerSuggestions = sqliteTable("answer_suggestions", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  questionId: text("question_id").notNull(),
  suggestedAnswer: text("suggested_answer").notNull(),
  playerId: text("player_id").notNull(),
  status: text("status").notNull().default("pending"),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});
