import assert from "node:assert/strict";
import { DAILY_SCROLLS, QUESTIONS, TIERS, questionsForScroll } from "../data/game";

assert.equal(DAILY_SCROLLS.length, 365, "2027 must contain 365 dated scrolls");
assert.equal(DAILY_SCROLLS[0].dateKey, "2027-01-01");
assert.equal(DAILY_SCROLLS.at(-1)?.dateKey, "2027-12-31");
assert.equal(new Set(DAILY_SCROLLS.map((scroll) => scroll.id)).size, 365, "scroll IDs must be unique");
assert.equal(new Set(DAILY_SCROLLS.map((scroll) => scroll.title)).size, 365, "scroll titles must be unique");
assert.equal(new Set(QUESTIONS.map((question) => question.id)).size, QUESTIONS.length, "question IDs must be unique");

const scheduledIds = new Set<string>();
const scheduledDays = new Map<string, number[]>();
const scheduledFamilyDays = new Map<string, number[]>();
let scheduledPrompts = 0;

const familyId = (questionId: string) => questionId.replace(/-(identify|example)$/, "");

for (const [dayIndex, scroll] of DAILY_SCROLLS.entries()) {
  assert.match(scroll.dateKey, /^2027-\d{2}-\d{2}$/);
  assert.equal(scroll.questionIds.length, 7, `${scroll.id} must schedule seven prompts`);
  assert.equal(new Set(scroll.questionIds).size, 7, `${scroll.id} repeats a prompt`);
  assert.equal(scroll.deepQuestionId, scroll.questionIds[6], `${scroll.id} niche slot must be last`);
  assert.equal(questionsForScroll(scroll).length, 7, `${scroll.id} contains an unknown prompt`);
  scroll.questionIds.forEach((id) => {
    scheduledIds.add(id);
    scheduledDays.set(id, [...(scheduledDays.get(id) ?? []), dayIndex]);
    const family = familyId(id);
    scheduledFamilyDays.set(family, [...(scheduledFamilyDays.get(family) ?? []), dayIndex]);
  });
  scheduledPrompts += scroll.questionIds.length;
}

assert.equal(scheduledPrompts, 2_555, "the year must contain 2,555 scheduled prompt slots");
assert.equal(scheduledIds.size, QUESTIONS.length, "every curated prompt must appear during 2027");
for (const [questionId, days] of scheduledDays) {
  const gaps = days.slice(1).map((day, index) => day - days[index]);
  assert.ok(Math.min(...gaps) >= 30, `${questionId} repeats within 30 days`);
}

// Different wording should not make the same subject feel like a back-to-back repeat.
// Seven prompts per day across 90 families makes a 30-day family cooldown impossible,
// but the calendar can and should keep every underlying subject at least 12 days apart.
for (const [family, days] of scheduledFamilyDays) {
  const gaps = days.slice(1).map((day, index) => day - days[index]);
  assert.ok(Math.min(...gaps) >= 12, `${family} topic repeats within 12 days`);
}

for (const question of QUESTIONS) {
  assert.ok(question.answers.length >= 5, `${question.id} needs at least five ranked answers`);
  assert.equal(new Set(question.answers.map((answer) => answer.id)).size, question.answers.length, `${question.id} repeats an answer ID`);
  for (const tier of Object.keys(TIERS)) {
    assert.ok(question.answers.some((answer) => answer.tier === tier), `${question.id} has no ${tier} answer`);
  }
  for (const answer of question.answers) {
    assert.ok(answer.reference.trim(), `${question.id}/${answer.id} needs a Scripture reference`);
    assert.ok(answer.note.trim(), `${question.id}/${answer.id} needs an explanation`);
  }
}

console.log(`Validated ${DAILY_SCROLLS.length} daily scrolls, ${scheduledPrompts} scheduled prompts, ${QUESTIONS.length} curated prompt sets, and ${QUESTIONS.reduce((sum, question) => sum + question.answers.length, 0)} ranked answers.`);
