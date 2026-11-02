import assert from "node:assert/strict";
import test from "node:test";
import { findQuestion, matchAnswer } from "../data/game.ts";

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
