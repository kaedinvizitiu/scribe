import { writeFile } from "node:fs/promises";
import { QUESTIONS, normalizeAnswer } from "../data/game";

type AuditResult = {
  questionId: string;
  answerId: string;
  label: string;
  reference: string;
  pageFound: boolean;
  directWordingFound: boolean;
  matchedForm: string | null;
  error: string | null;
};

const outputPath = process.argv[2] || "/private/tmp/scribe-esv-evidence.json";
const baseQuestions = QUESTIONS.filter((question) =>
  !question.id.endsWith("-identify") && !question.id.endsWith("-example")
);
const records = baseQuestions.flatMap((question) => question.answers.map((answer) => ({ question, answer })));

const ignoredWords = new Set([
  "about", "associated", "biblical", "book", "called", "city", "from", "gate", "healing",
  "into", "jesus", "king", "miracle", "name", "named", "people", "person", "raised", "someone",
  "their", "them", "they", "with", "woman",
]);

function decodeHtml(value: string) {
  return value
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

function evidenceForms(label: string, aliases: string[]) {
  const forms = [label, ...aliases].map(normalizeAnswer).filter(Boolean);
  const distinctiveWords = forms
    .flatMap((form) => form.split(" "))
    .filter((word) => word.length >= 4 && !ignoredWords.has(word));
  return [...new Set([...forms.filter((form) => form.length >= 4), ...distinctiveWords])];
}

function passageUrl(reference: string) {
  const path = reference.replace(/–/g, "-").trim().replace(/\s+/g, "+");
  return `https://www.esv.org/${encodeURI(path)}/`;
}

async function inspectRecord(index: number): Promise<AuditResult> {
  const { question, answer } = records[index];
  try {
    const response = await fetch(passageUrl(answer.reference), {
      headers: { "User-Agent": "Scribe Bible trivia reference audit" },
      redirect: "follow",
    });
    const html = await response.text();
    const description = decodeHtml(html.match(/<meta name="description" content="([\s\S]*?)"\s*\/>/)?.[1] ?? "");
    const normalizedEvidence = normalizeAnswer(description);
    const matchedForm = evidenceForms(answer.label, answer.aliases ?? [])
      .find((form) => normalizedEvidence.includes(form)) ?? null;
    return {
      questionId: question.id,
      answerId: answer.id,
      label: answer.label,
      reference: answer.reference,
      pageFound: response.ok && Boolean(description),
      directWordingFound: Boolean(matchedForm),
      matchedForm,
      error: response.ok ? null : `HTTP ${response.status}`,
    };
  } catch (error) {
    return {
      questionId: question.id,
      answerId: answer.id,
      label: answer.label,
      reference: answer.reference,
      pageFound: false,
      directWordingFound: false,
      matchedForm: null,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

const results: AuditResult[] = new Array(records.length);
let cursor = 0;
let completed = 0;

async function worker() {
  while (cursor < records.length) {
    const index = cursor;
    cursor += 1;
    results[index] = await inspectRecord(index);
    completed += 1;
    if (completed % 50 === 0 || completed === records.length) {
      console.log(`Checked ${completed}/${records.length} accepted answers against ESV.org`);
    }
    await new Promise((resolve) => setTimeout(resolve, 350));
  }
}

await Promise.all(Array.from({ length: 4 }, worker));
await writeFile(outputPath, `${JSON.stringify({
  generatedAt: new Date().toISOString(),
  source: "https://www.esv.org/",
  answersChecked: results.length,
  pagesFound: results.filter((result) => result.pageFound).length,
  directWordingFound: results.filter((result) => result.directWordingFound).length,
  results,
}, null, 2)}\n`);

console.log(`Wrote evidence-only audit results to ${outputPath}`);
