"use client";

import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import {
  AcceptedAnswer,
  DailyScroll,
  TIERS,
  Tier,
  findCorrectionSuggestion,
  getPacificDateKey,
  matchAnswer,
  questionsForScroll,
  rejectedAnswerMessage,
} from "../data/game";
import { apiUrl, siteHref } from "../lib/browser-paths";

type RoundResult = {
  questionId: string;
  answer: AcceptedAnswer | null;
  typedAnswer: string;
  elapsedMs: number;
};

type Stage = "welcome" | "playing" | "reveal" | "results";

const tierOrder: Tier[] = ["ink", "bronze", "silver", "gold", "pearl"];

const scoreRoles = [
  { ceiling: 500, name: "Became Mormon", note: "Somewhere along the journey, the scroll took an unexpected detour." },
  { ceiling: 1000, name: "Did Not Reach Heaven", note: "A valiant attempt, but the gate remains just ahead." },
  { ceiling: 1400, name: "Knocking at the Gate", note: "Close enough to hear the choir warming up." },
  { ceiling: 1800, name: "Purgatory", note: "Not lost, not finished—decidedly in the waiting room." },
  { ceiling: 3000, name: "Reached Heaven", note: "The trumpets sound. Today’s scroll has been conquered." },
  { ceiling: Number.POSITIVE_INFINITY, name: "Final Meeting with Charles Spurgeon", note: "An alarmingly complete knowledge of Scripture. Spurgeon is ready for the conversation." },
] as const;

function scoreRole(total: number) {
  return scoreRoles.find((role) => total < role.ceiling) ?? scoreRoles[scoreRoles.length - 1];
}

function createPlayerId() {
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `scribe-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function clockNow() {
  return Date.now();
}

export function ScribeGame({ scroll }: { scroll: DailyScroll }) {
  const questions = useMemo(() => questionsForScroll(scroll), [scroll]);
  const [stage, setStage] = useState<Stage>("welcome");
  const [questionIndex, setQuestionIndex] = useState(0);
  const [seconds, setSeconds] = useState(30);
  const [value, setValue] = useState("");
  const [feedback, setFeedback] = useState("");
  const [cooldown, setCooldown] = useState(false);
  const [results, setResults] = useState<RoundResult[]>([]);
  const [nickname, setNickname] = useState("Reader");
  const [rankMessage, setRankMessage] = useState("Your result will join today’s register.");
  const [restoredToday, setRestoredToday] = useState(false);
  const startedAt = useRef(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const question = questions[questionIndex];
  const currentResult = results[results.length - 1];
  const total = results.reduce(
    (sum, result) => sum + (result.answer ? TIERS[result.answer.tier].points : 0),
    0,
  );
  const role = scoreRole(total);

  useEffect(() => {
    const savedName = localStorage.getItem("scribe:nickname");
    if (savedName) window.setTimeout(() => setNickname(savedName), 0);

    const resultKey = `scribe:result:${getPacificDateKey()}`;
    const savedResult = localStorage.getItem(resultKey);
    if (!savedResult) return;

    try {
      const parsed = JSON.parse(savedResult) as {
        scrollId?: string;
        nickname?: string;
        results?: RoundResult[];
      };
      const isComplete = parsed.scrollId === scroll.id
        && Array.isArray(parsed.results)
        && parsed.results.length === questions.length
        && parsed.results.every((result) =>
          typeof result?.questionId === "string"
          && typeof result?.typedAnswer === "string"
          && typeof result?.elapsedMs === "number"
          && (result.answer === null || (result.answer && result.answer.tier in TIERS)),
        );

      if (!isComplete) return;
      window.setTimeout(() => {
        setResults(parsed.results!);
        setQuestionIndex(questions.length - 1);
        setNickname(parsed.nickname?.trim().slice(0, 24) || savedName || "Reader");
        setRankMessage("Today’s score was restored from this browser.");
        setRestoredToday(true);
        setStage("results");
      }, 0);
    } catch {
      localStorage.removeItem(resultKey);
    }
  }, [questions.length, scroll.id]);

  useEffect(() => {
    if (stage !== "playing") return;
    window.setTimeout(() => inputRef.current?.focus(), 80);
  }, [questionIndex, stage]);

  useEffect(() => {
    if (stage !== "playing") return;
    const interval = window.setInterval(() => {
      const remaining = Math.max(0, 30 - Math.floor((clockNow() - startedAt.current) / 1000));
      setSeconds(remaining);
      if (remaining === 0) {
        window.clearInterval(interval);
        setResults((items) => [
          ...items,
          { questionId: question.id, answer: null, typedAnswer: value, elapsedMs: 30_000 },
        ]);
        setStage("reveal");
      }
    }, 150);
    return () => window.clearInterval(interval);
  }, [question, stage, value]);

  function begin() {
    const trimmed = nickname.trim().slice(0, 24) || "Reader";
    localStorage.setItem("scribe:nickname", trimmed);
    setNickname(trimmed);
    setQuestionIndex(0);
    setResults([]);
    setSeconds(30);
    setValue("");
    setFeedback("");
    startedAt.current = clockNow();
    setStage("playing");
  }

  function submit(event: FormEvent) {
    event.preventDefault();
    if (!question || cooldown || !value.trim()) return;
    const accepted = matchAnswer(question, value);
    if (!accepted) {
      const correction = findCorrectionSuggestion(question, value);
      setFeedback(correction
        ? `Almost — did you mean “${correction.label}”? Type the corrected answer and submit again.`
        : rejectedAnswerMessage(question, value));
      setCooldown(true);
      window.setTimeout(() => setCooldown(false), 550);
      window.setTimeout(() => inputRef.current?.focus(), 560);
      return;
    }

    setResults((items) => [
      ...items,
      {
        questionId: question.id,
        answer: accepted,
        typedAnswer: value,
        elapsedMs: Math.min(30_000, clockNow() - startedAt.current),
      },
    ]);
    setStage("reveal");
  }

  function nextQuestion() {
    if (questionIndex >= questions.length - 1) {
      setStage("results");
      void submitScore();
      return;
    }
    setQuestionIndex((index) => index + 1);
    setSeconds(30);
    setValue("");
    setFeedback("");
    startedAt.current = clockNow();
    setStage("playing");
  }

  async function submitScore() {
    let playerId = localStorage.getItem("scribe:player-id");
    if (!playerId) {
      playerId = createPlayerId();
      localStorage.setItem("scribe:player-id", playerId);
    }

    localStorage.setItem(
      `scribe:result:${getPacificDateKey()}`,
      JSON.stringify({ scrollId: scroll.id, nickname, total, results }),
    );

    try {
      const response = await fetch(apiUrl("/api/leaderboard"), {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          nickname,
          playerId,
          dateKey: getPacificDateKey(),
          scrollId: scroll.id,
          answers: results.map((result) => ({
            questionId: result.questionId,
            answerId: result.answer?.id ?? null,
            elapsedMs: result.elapsedMs,
          })),
        }),
      });
      if (!response.ok) throw new Error("score unavailable");
      const payload = (await response.json()) as { rank?: number; players?: number };
      setRankMessage(
        payload.rank && payload.players
          ? `#${payload.rank} of ${payload.players} readers today`
          : "Your score is recorded in today’s register.",
      );
    } catch {
      setRankMessage("Saved on this device; the global register is unavailable in preview.");
    }

  }

  async function shareResult() {
    const marks = results
      .map((result) => (result.answer ? TIERS[result.answer.tier].symbol : "○"))
      .join(" ");
    const text = `SCRIBE · ${scroll.title}\n${marks}\n${total.toLocaleString()} points · ${results.filter((r) => r.answer).length}/7 answered\nRole: ${role.name}`;
    if (navigator.share) {
      await navigator.share({ title: "My Scribe result", text });
    } else {
      await navigator.clipboard.writeText(text);
      setRankMessage("Spoiler-free result copied to your clipboard.");
    }
  }

  if (stage === "welcome") {
    return (
      <main className="game-shell welcome-shell">
        <div className="ambient-mark ambient-mark-one" aria-hidden="true">S</div>
        <div className="ambient-mark ambient-mark-two" aria-hidden="true">✦</div>
        <section className="welcome-card" aria-labelledby="welcome-title">
          <div className="welcome-scene" aria-hidden="true">
            <div className="scene-caption"><span>Tonight’s passage awaits</span><strong>{scroll.title}</strong></div>
          </div>
          <div className="welcome-content">
            <div className="quest-kicker"><span>✦</span> Daily Scripture Quest <span>✦</span></div>
            <div className="eyebrow">Today’s Scroll</div>
            <h1 id="welcome-title">Enter the<br /><em>Scriptorium.</em></h1>
            <p className="welcome-copy">
              Seven open-answer challenges from all 66 books. Familiar answers begin as mustard seeds; the rarest unlock the seventh seal.
            </p>
            <div className="tier-legend" aria-label="Answer ranks from Mustard Seed to Seventh Seal">
              {tierOrder.map((tier) => <span className={`legend-${tier}`} key={tier}>{TIERS[tier].symbol}<small>{TIERS[tier].label}</small></span>)}
            </div>
            <div className="daily-meta">
              <div><span>Today</span><strong>{getPacificDateKey().replaceAll("-", ".")}</strong></div>
              <div><span>Trials</span><strong>7</strong></div>
              <div><span>Clock</span><strong>30 sec</strong></div>
            </div>
            <label className="nickname-field">
              <span>Your name in the register</span>
              <input
                value={nickname}
                onChange={(event) => setNickname(event.target.value)}
                maxLength={24}
                autoComplete="nickname"
              />
            </label>
            <button className="primary-button quest-button" onClick={begin}>
              <span className="button-seal" aria-hidden="true">S</span>
              Unroll today’s quest
              <span aria-hidden="true">→</span>
            </button>
            <p className="welcome-note">One ranked journey per device · New quest at midnight Pacific</p>
          </div>
        </section>
      </main>
    );
  }

  if (stage === "playing" && question) {
    return (
      <main className="game-shell play-shell">
        <LiveScore total={total} />
        <section className="question-card" aria-live="polite">
          <header className="question-header">
            <div>
              <span className="eyebrow">Question {questionIndex + 1} of 7</span>
              <span className="category-label">{question.category}</span>
            </div>
            <div className={`timer ${seconds <= 8 ? "timer-urgent" : ""}`} aria-label={`${seconds} seconds remaining`}>
              <span>{seconds}</span><small>SEC</small>
            </div>
          </header>
          <div className="timer-track" aria-hidden="true"><span style={{ width: `${(seconds / 30) * 100}%` }} /></div>
          <div className="question-body">
            <div className="question-number" aria-hidden="true">{String(questionIndex + 1).padStart(2, "0")}</div>
            <h1>{question.prompt}</h1>
            <p>Enter any answer that fits. You may keep trying until time expires.</p>
            <form onSubmit={submit} className="answer-form">
              <input
                ref={inputRef}
                value={value}
                onChange={(event) => { setValue(event.target.value); setFeedback(""); }}
                placeholder="Type your answer…"
                aria-label="Your answer"
                disabled={cooldown}
                autoComplete="off"
                spellCheck="false"
              />
              <button type="submit" disabled={cooldown || !value.trim()}>Submit</button>
            </form>
            <div className="feedback" role="status">{feedback}</div>
          </div>
          <Progress current={questionIndex} results={results} />
        </section>
      </main>
    );
  }

  if (stage === "reveal" && question && currentResult) {
    const accepted = currentResult.answer;
    return (
      <main className="game-shell reveal-shell">
        <LiveScore total={total} />
        <section key={`${question.id}-${accepted?.id ?? "missed"}`} className={`reveal-card ${accepted ? `tier-${accepted.tier}` : "tier-missed"}`}>
          <header>
            <span className="eyebrow">Question {questionIndex + 1} complete</span>
            <span className="reveal-category">{question.category}</span>
          </header>
          {accepted ? (
            <>
              <div className="accepted-flourish" aria-hidden="true"><span>Answer accepted</span></div>
              <div className="tier-celebration" aria-hidden="true">
                <i className="burst burst-1" /><i className="burst burst-2" /><i className="burst burst-3" /><i className="burst burst-4" />
                <b className="spark spark-1">✦</b><b className="spark spark-2">•</b><b className="spark spark-3">✦</b><b className="spark spark-4">•</b>
                <div className="tier-medallion">{TIERS[accepted.tier].symbol}</div>
              </div>
              <p className="earned-tier-kicker">You earned</p>
              <h1 className="earned-tier-name">{TIERS[accepted.tier].label}</h1>
              <div className="score-ribbon">
                <strong>Tier unlocked</strong>
                <span>+{TIERS[accepted.tier].points.toLocaleString()} points</span>
              </div>
              <div className="accepted-answer-card">
                <span>Your accepted answer</span>
                <strong>{accepted.label}</strong>
              </div>
              <p className="answer-note">{accepted.note}</p>
              <p className="reference">{accepted.reference} <span>ESV reference</span></p>
            </>
          ) : (
            <>
              <div className="tier-medallion" aria-hidden="true">○</div>
              <p className="your-answer">Time expired</p>
              <h1>No accepted answer</h1>
              <div className="score-ribbon"><strong>Unscored</strong><span>0 points</span></div>
              <p className="answer-note">The page remains open for what you discover next.</p>
            </>
          )}

          <div className="answer-scale">
            <div className="scale-title"><span>Answer scale</span><small>Examples from {question.answers.length} accepted answers</small></div>
            <div className="tier-grid">
              {tierOrder.map((tier) => {
                const examples = question.answers.filter((item) => item.tier === tier).slice(0, 2);
                return (
                  <div className={`tier-example tier-example-${tier}`} key={tier}>
                    <span>{TIERS[tier].label} · {TIERS[tier].points}</span>
                    <strong>{examples.map((item) => item.label).join(" · ") || "—"}</strong>
                  </div>
                );
              })}
            </div>
          </div>
          <details className="accepted-catalog">
            <summary>View all {question.answers.length} accepted answers</summary>
            <div>{tierOrder.map((tier) => (
              <p key={tier}><strong>{TIERS[tier].label}</strong><span>{question.answers.filter((item) => item.tier === tier).map((item) => item.label).join(" · ") || "—"}</span></p>
            ))}</div>
          </details>
          <button className="primary-button" onClick={nextQuestion}>
            {questionIndex === questions.length - 1 ? "Complete the scroll" : "Next question"} <span>→</span>
          </button>
        </section>
      </main>
    );
  }

  return (
    <main className="game-shell results-shell">
      <section className="results-card">
        <div className="eyebrow">{restoredToday ? "Today’s scroll restored" : "Scroll completed"}</div>
        <h1>Today’s final score</h1>
        <div className="final-score" aria-label={`${total.toLocaleString()} points`}><strong>{total.toLocaleString()}</strong><span>points</span></div>
        <div className="role-reveal" aria-live="polite">
          <span>Your appointed role</span>
          <div className="role-ornament" aria-hidden="true">✦</div>
          <strong>{role.name}</strong>
          <p>{role.note}</p>
        </div>
        <p className="results-intro">
          {restoredToday
            ? "Your completed score and answers were restored. A new scroll arrives at midnight Pacific."
            : "Your score and all seven answers are recorded below."}
        </p>
        <div className="result-marks" aria-label="Your seven answer tiers">
          {results.map((result, index) => (
            <span className={result.answer ? `mark-${result.answer.tier}` : "mark-missed"} key={`${result.questionId}-${index}`}>
              {result.answer ? TIERS[result.answer.tier].symbol : "○"}
            </span>
          ))}
        </div>
        <p className="rank-message">{rankMessage}</p>
        <div className="result-actions">
          <button className="primary-button" onClick={() => void shareResult()}>Share result <span>↗</span></button>
          <a className="secondary-button" href={siteHref("/leaderboard")}>Hall of Scribes</a>
        </div>
        <div className="results-list">
          {results.map((result, index) => {
            const resultQuestion = questions.find((item) => item.id === result.questionId);
            return (
              <div key={`${result.questionId}-detail`}>
                <span>{index + 1}</span>
                <p>{resultQuestion?.prompt}<strong>{result.answer?.label ?? "Unanswered"}</strong></p>
                <b>{result.answer ? `+${TIERS[result.answer.tier].points}` : "0"}</b>
              </div>
            );
          })}
        </div>
      </section>
    </main>
  );
}

function LiveScore({ total }: { total: number }) {
  return (
    <aside className="live-score-hud" aria-live="polite" aria-label={`Current score ${total.toLocaleString()} points`}>
      <span>Scroll score</span>
      <strong key={total}>{total.toLocaleString()}</strong>
      <small>points</small>
    </aside>
  );
}

function Progress({ current, results }: { current: number; results: RoundResult[] }) {
  return (
    <footer className="question-progress" aria-label={`Question ${current + 1} of 7`}>
      {Array.from({ length: 7 }, (_, index) => {
        const result = results[index];
        const className = index === current
          ? "current"
          : result?.answer
            ? `complete complete-${result.answer.tier}`
            : result
              ? "complete missed"
              : "";
        return <span className={className} key={index}>{index + 1}</span>;
      })}
    </footer>
  );
}
