import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);

test("ships the Scribe daily game instead of starter content", async () => {
  const [page, game, layout, styles] = await Promise.all([
    readFile(new URL("app/page.tsx", root), "utf8"),
    readFile(new URL("components/ScribeGame.tsx", root), "utf8"),
    readFile(new URL("app/layout.tsx", root), "utf8"),
    readFile(new URL("app/globals.css", root), "utf8"),
  ]);
  assert.match(page, /ScribeGame/);
  assert.match(game, /Seven open-answer challenges/);
  assert.match(styles, /home-hero-retro-v3\.jpg/);
  assert.match(game, /30/);
  assert.match(game, /rejectedAnswerMessage/);
  assert.match(game, /Today’s final score/);
  assert.doesNotMatch(game, /Your page is illuminated/);
  assert.match(layout, /Scribe — Daily Bible Knowledge/);
  assert.match(styles, /font-letterpress/);
  assert.doesNotMatch(`${page}${game}${layout}`, /codex-preview|SkeletonPreview/i);
});

test("includes the product pages, database, and full 2027 content calendar", async () => {
  const [data, calendar, schema, leaderboard, scriptorium] = await Promise.all([
    readFile(new URL("data/game.ts", root), "utf8"),
    readFile(new URL("data/calendar-2027.ts", root), "utf8"),
    readFile(new URL("db/schema.ts", root), "utf8"),
    readFile(new URL("app/leaderboard/page.tsx", root), "utf8"),
    readFile(new URL("app/scriptorium/page.tsx", root), "utf8"),
  ]);
  assert.match(calendar, /length: 365/);
  assert.match(calendar, /Date\.UTC\(2027/);
  assert.match(data, /pearl: \{ label: "Seventh Seal", points: 1000/);
  assert.match(schema, /dailyScores/);
  assert.match(leaderboard, /Hall of Scribes/);
  assert.match(scriptorium, /The Scriptorium/);
  assert.doesNotMatch(data, /Give one biblical example/i);
});
