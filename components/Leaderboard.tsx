"use client";

import { useEffect, useState } from "react";
import { getPacificDateKey } from "../data/game";

type Entry = { nickname: string; score: number; correctCount: number; elapsedMs: number };

export function Leaderboard() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [message, setMessage] = useState("Opening today’s register…");

  useEffect(() => {
    fetch(`/api/leaderboard?date=${encodeURIComponent(getPacificDateKey())}`)
      .then((response) => response.ok ? response.json() : Promise.reject())
      .then((payload: { entries?: Entry[] }) => {
        setEntries(payload.entries ?? []);
        setMessage(payload.entries?.length ? "" : "No completed Scrolls yet today. You could be first.");
      })
      .catch(() => setMessage("The global register will become available when the database is connected."));
  }, []);

  return (
    <div className="leaderboard-table">
      <div className="leaderboard-head"><span>Rank</span><span>Reader</span><span>Answered</span><span>Illumination</span></div>
      {entries.map((entry, index) => (
        <div className="leaderboard-row" key={`${entry.nickname}-${index}`}>
          <strong>{String(index + 1).padStart(2, "0")}</strong>
          <span>{entry.nickname}</span>
          <span>{entry.correctCount}/7</span>
          <b>{entry.score.toLocaleString()}</b>
        </div>
      ))}
      {message ? <p className="empty-message">{message}</p> : null}
    </div>
  );
}
