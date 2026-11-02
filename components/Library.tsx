"use client";

import { useEffect, useState } from "react";
import { DAILY_SCROLLS, getPacificDateKey } from "../data/game";

type SavedResult = { total?: number; scrollId?: string };

export function Library() {
  const [saved, setSaved] = useState<SavedResult | null>(null);
  useEffect(() => {
    const raw = localStorage.getItem(`scribe:result:${getPacificDateKey()}`);
    if (raw) window.setTimeout(() => setSaved(JSON.parse(raw)), 0);
  }, []);

  return (
    <div className="library-grid">
      {DAILY_SCROLLS.map((scroll, index) => {
        const completed = saved?.scrollId === scroll.id;
        return (
          <article className={completed ? "library-scroll completed-scroll" : "library-scroll"} key={scroll.id}>
            <span>{scroll.dateKey}</span>
            <h2>{scroll.title}</h2>
            <p>{scroll.subtitle}</p>
            <footer>{completed ? `${saved?.total?.toLocaleString()} illumination` : "2027 daily calendar"}</footer>
          </article>
        );
      })}
    </div>
  );
}
