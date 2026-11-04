import { QUESTIONS, TIERS, matchAnswer, normalizeAnswer } from "../data/game";
import { CATALOG_FLOORS } from "../data/catalog-expansions";
import { AUDITED_QUESTION_IDS, REVIEWED_FAMILY_FLOORS, SCRIPTURE_REVIEW } from "../data/catalog-completions";

const baseQuestions = QUESTIONS.filter((question) =>
  !question.id.endsWith("-identify") && !question.id.endsWith("-example")
);
const failures: string[] = [];
let aliasCount = 0;
const canonicalBooks = [
  "Genesis", "Exodus", "Leviticus", "Numbers", "Deuteronomy", "Joshua", "Judges", "Ruth",
  "1 Samuel", "2 Samuel", "1 Kings", "2 Kings", "1 Chronicles", "2 Chronicles", "Ezra", "Nehemiah", "Esther",
  "Job", "Psalm", "Psalms", "Proverbs", "Ecclesiastes", "Song of Solomon", "Isaiah", "Jeremiah", "Lamentations",
  "Ezekiel", "Daniel", "Hosea", "Joel", "Amos", "Obadiah", "Jonah", "Micah", "Nahum", "Habakkuk", "Zephaniah",
  "Haggai", "Zechariah", "Malachi", "Matthew", "Mark", "Luke", "John", "Acts", "Romans", "1 Corinthians",
  "2 Corinthians", "Galatians", "Ephesians", "Philippians", "Colossians", "1 Thessalonians", "2 Thessalonians",
  "1 Timothy", "2 Timothy", "Titus", "Philemon", "Hebrews", "James", "1 Peter", "2 Peter", "1 John", "2 John",
  "3 John", "Jude", "Revelation",
];

const baseQuestionIds = new Set(baseQuestions.map((question) => question.id));
const auditedQuestionIds = new Set<string>(AUDITED_QUESTION_IDS);
const scriptureReviewedQuestionIds = new Set<string>(SCRIPTURE_REVIEW.questionIds);
for (const questionId of baseQuestionIds) {
  if (!auditedQuestionIds.has(questionId)) failures.push(`${questionId}: missing from the family-by-family audit checklist`);
}
for (const questionId of auditedQuestionIds) {
  if (!baseQuestionIds.has(questionId)) failures.push(`${questionId}: audit checklist entry has no question family`);
}
for (const questionId of baseQuestionIds) {
  if (!scriptureReviewedQuestionIds.has(questionId)) failures.push(`${questionId}: missing from the ESV Scripture-review checklist`);
}

for (const question of baseQuestions) {
  const ids = new Set<string>();
  const forms = new Map<string, string>();
  const tiers = new Set<string>();

  if (question.answers.length < 5) failures.push(`${question.id}: fewer than five accepted answers`);

  for (const answer of question.answers) {
    if (!answer.id || !answer.label || !answer.reference || !answer.note) {
      failures.push(`${question.id}: incomplete answer record for ${answer.label || "unknown"}`);
    }
    if (!canonicalBooks.some((book) => answer.reference === book || answer.reference.startsWith(`${book} `))) {
      failures.push(`${question.id}: non-canonical or malformed reference for ${answer.label}: ${answer.reference}`);
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

for (const [questionId, minimum] of Object.entries(REVIEWED_FAMILY_FLOORS)) {
  const question = baseQuestions.find((candidate) => candidate.id === questionId);
  if (!question) failures.push(`${questionId}: reviewed family is missing`);
  else if (question.answers.length < minimum) failures.push(`${questionId}: fell below its reviewed floor of ${minimum}`);
}

if (failures.length) {
  throw new Error(`Answer catalog audit failed:\n${failures.map((failure) => `- ${failure}`).join("\n")}`);
}

const answerCount = baseQuestions.reduce((total, question) => total + question.answers.length, 0);
console.log(`Audited ${baseQuestions.length} answer families, ${answerCount} ranked answers, and ${aliasCount} natural-language aliases.`);
