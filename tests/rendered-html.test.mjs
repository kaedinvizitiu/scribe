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
  assert.match(styles, /home-hero-bible-adventure/);
  assert.match(game, /30/);
  assert.match(game, /Not accepted for this question/);
  assert.match(layout, /Scribe — Daily Bible Knowledge/);
  assert.match(styles, /font-letterpress/);
  assert.doesNotMatch(`${page}${game}${layout}`, /codex-preview|SkeletonPreview/i);
});

test("includes the product pages, database, and fourteen-day content calendar", async () => {
  const [data, schema, leaderboard, library, scriptorium] = await Promise.all([
    readFile(new URL("data/game.ts", root), "utf8"),
    readFile(new URL("db/schema.ts", root), "utf8"),
    readFile(new URL("app/leaderboard/page.tsx", root), "utf8"),
    readFile(new URL("app/library/page.tsx", root), "utf8"),
    readFile(new URL("app/scriptorium/page.tsx", root), "utf8"),
  ]);
  assert.match(data, /sample-\$\{String\(index \+ 1\)/);
  assert.match(data, /pearl: \{ label: "Seventh Seal", points: 1000/);
  assert.match(schema, /dailyScores/);
  assert.match(leaderboard, /Hall of Scribes/);
  assert.match(library, /The Library/);
  assert.match(scriptorium, /The Scriptorium/);
});
