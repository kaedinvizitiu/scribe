import assert from "node:assert/strict";
import test from "node:test";
import { findQuestion, getAnswerSuggestions, matchAnswer, rejectedAnswerMessage } from "../data/game.ts";

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

test("forgives a small spelling error without accepting noise", () => {
  assert.equal(answerFor("prophet", "Jeremaih"), "Jeremiah");
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

test("suggests complete answers from partial or misspelled input", () => {
  const question = findQuestion("jesus-miracle");
  assert.ok(question);
  assert.equal(getAnswerSuggestions(question, "bartim")[0]?.label, "Healing Bartimaeus");
  assert.equal(getAnswerSuggestions(question, "heali").length, 0);
  assert.match(rejectedAnswerMessage(question, "bartim"), /Not accepted for this question/);
});
