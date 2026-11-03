import assert from "node:assert/strict";
import test from "node:test";
import { findCorrectionSuggestion, findQuestion, matchAnswer, rejectedAnswerMessage } from "../data/game.ts";

function answerFor(questionId, guess) {
  const question = findQuestion(questionId);
  assert.ok(question, `Missing fixture question: ${questionId}`);
  return matchAnswer(question, guess)?.label;
}

test("accepts the natural shorthand players reported", () => {
  assert.equal(answerFor("jesus-miracle", "water"), "Water into wine");
  assert.equal(answerFor("parable", "sower"), "The Sower");
});

test("ignores articles and accepts distinctive partial phrases", () => {
  assert.equal(answerFor("parable", "parable of the sower"), "The Sower");
  assert.equal(answerFor("jesus-miracle", "Bartimaeus"), "Healing Bartimaeus");
});

test("does not award points for a spelling error", () => {
  assert.equal(answerFor("prophet", "Jeremaih"), undefined);
  assert.equal(answerFor("prophet", "random answer"), undefined);
});

test("accepts uniquely identifying words even when a connecting word is missing", () => {
  assert.equal(answerFor("jesus-miracle", "coin fish mouth"), "Coin in the fish’s mouth");
  assert.equal(answerFor("biblical-water-site", "pool gibeon"), "Pool of Gibeon");
});

test("accepts broad and specific descriptions of Jesus restoring sight", () => {
  assert.equal(answerFor("jesus-miracle", "healing the blind"), "Giving sight to the blind");
  assert.equal(answerFor("jesus-miracle", "man born blind"), "Healing the man born blind");
});

test("accepts forbearance as patience in the fruit of the Spirit", () => {
  assert.equal(answerFor("fruit-of-spirit", "forbearance"), "Patience");
});

test("offers one post-submit correction without filling or accepting it", () => {
  const miracle = findQuestion("jesus-miracle");
  const priest = findQuestion("ot-priest");
  assert.ok(miracle);
  assert.ok(priest);
  assert.equal(matchAnswer(priest, "Eliezer"), undefined);
  assert.equal(findCorrectionSuggestion(priest, "Eliezer")?.label, "Eleazar");
  assert.equal(findCorrectionSuggestion(miracle, "bartim")?.label, "Healing Bartimaeus");
  assert.match(rejectedAnswerMessage(miracle, "random answer"), /Not accepted for this question/);
});

test("accepts answers added by the broad catalog review", () => {
  assert.equal(answerFor("bible-animal", "ostrich"), "Ostrich");
  assert.equal(answerFor("prophet", "Huldah"), "Huldah");
  assert.equal(answerFor("biblical-food", "wild gourds"), "Wild gourds");
  assert.equal(answerFor("romans-16-person", "Tertius"), "Tertius");
  assert.equal(answerFor("nehemiah-builder", "Baruch"), "Baruch");
});
