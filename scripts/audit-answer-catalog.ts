import { QUESTIONS, TIERS, matchAnswer, normalizeAnswer } from "../data/game";
import { CATALOG_FLOORS } from "../data/catalog-expansions";

const baseQuestions = QUESTIONS.filter((question) =>
  !question.id.endsWith("-identify") && !question.id.endsWith("-example")
);
const failures: string[] = [];
let aliasCount = 0;

for (const question of baseQuestions) {
  const ids = new Set<string>();
  const forms = new Map<string, string>();
  const tiers = new Set<string>();

  if (question.answers.length < 5) failures.push(`${question.id}: fewer than five accepted answers`);

  for (const answer of question.answers) {
    if (!answer.id || !answer.label || !answer.reference || !answer.note) {
      failures.push(`${question.id}: incomplete answer record for ${answer.label || "unknown"}`);
    }
    if (ids.has(answer.id)) failures.push(`${question.id}: duplicate answer id ${answer.id}`);
    ids.add(answer.id);
    tiers.add(answer.tier);

    const answerForms = [answer.label, ...(answer.aliases ?? [])];
    aliasCount += answer.aliases?.length ?? 0;
    for (const form of answerForms) {
      const normalized = normalizeAnswer(form);
      const prior = forms.get(normalized);
      if (prior && prior !== answer.id) failures.push(`${question.id}: “${form}” collides with ${prior}`);
      else forms.set(normalized, answer.id);

      const matched = matchAnswer(question, form);
      if (matched?.id !== answer.id) {
        failures.push(`${question.id}: “${form}” does not resolve to ${answer.id}`);
      }
    }
  }

  for (const tier of Object.keys(TIERS)) {
    if (!tiers.has(tier)) failures.push(`${question.id}: no ${tier} answer`);
  }

  for (const suffix of ["-identify", "-example"]) {
    const variant = QUESTIONS.find((candidate) => candidate.id === `${question.id}${suffix}`);
    if (!variant) failures.push(`${question.id}: missing ${suffix.slice(1)} prompt variant`);
    else if (variant.answers.map((answer) => answer.id).join("|") !== question.answers.map((answer) => answer.id).join("|")) {
      failures.push(`${question.id}: ${suffix.slice(1)} variant has a different answer catalog`);
    }
  }
}

for (const [questionId, minimum] of Object.entries(CATALOG_FLOORS)) {
  const question = baseQuestions.find((candidate) => candidate.id === questionId);
  if (!question) failures.push(`${questionId}: expanded catalog question is missing`);
  else if (question.answers.length < minimum) {
    failures.push(`${questionId}: catalog shrank below its reviewed floor of ${minimum}`);
  }
}

if (failures.length) {
  throw new Error(`Answer catalog audit failed:\n${failures.map((failure) => `- ${failure}`).join("\n")}`);
}

const answerCount = baseQuestions.reduce((total, question) => total + question.answers.length, 0);
console.log(`Audited ${baseQuestions.length} answer families, ${answerCount} ranked answers, and ${aliasCount} natural-language aliases.`);
