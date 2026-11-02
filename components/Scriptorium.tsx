"use client";

import { FormEvent, useState } from "react";
import { apiUrl } from "../lib/browser-paths";

type AdminScroll = {
  id: string;
  title: string;
  questionCount: number;
  answerCount: number;
  status: string;
  note: string;
};

export function Scriptorium() {
  const [key, setKey] = useState("");
  const [scrolls, setScrolls] = useState<AdminScroll[]>([]);
  const [message, setMessage] = useState("Enter the private passphrase to review the content calendar.");

  async function unlock(event: FormEvent) {
    event.preventDefault();
    const response = await fetch(apiUrl("/api/admin"), { headers: { "x-scriptorium-key": key } });
    if (!response.ok) {
      setMessage("That passphrase did not open the Scriptorium.");
      return;
    }
    const payload = await response.json() as { scrolls: AdminScroll[] };
    setScrolls(payload.scrolls);
    setMessage(`${payload.scrolls.length} sample Scrolls ready for review.`);
  }

  async function setStatus(scrollId: string, status: string) {
    const response = await fetch(apiUrl("/api/admin"), {
      method: "POST",
      headers: { "content-type": "application/json", "x-scriptorium-key": key },
      body: JSON.stringify({ scrollId, status }),
    });
    if (response.ok) {
      setScrolls((items) => items.map((item) => item.id === scrollId ? { ...item, status } : item));
    }
  }

  if (!scrolls.length) {
    return (
      <form className="scriptorium-login" onSubmit={unlock}>
        <div className="scriptorium-seal">S</div>
        <h2>Private review room</h2>
        <p>{message}</p>
        <input type="password" value={key} onChange={(event) => setKey(event.target.value)} placeholder="Scriptorium passphrase" />
        <button className="primary-button" type="submit">Open Scriptorium <span>→</span></button>
        <small>Local preview passphrase: <code>scribe-local</code>. Production uses a private environment secret.</small>
      </form>
    );
  }

  return (
    <div className="scriptorium-board">
      <div className="admin-summary">
        <span>{message}</span>
        <strong>{scrolls.filter((item) => item.status === "approved").length} approved</strong>
      </div>
      {scrolls.map((scroll) => (
        <article className="admin-scroll" key={scroll.id}>
          <div><span>{scroll.id}</span><h2>{scroll.title}</h2></div>
          <p>{scroll.questionCount} questions · {scroll.answerCount} ranked answers</p>
          <label>
            <span>Status</span>
            <select value={scroll.status} onChange={(event) => void setStatus(scroll.id, event.target.value)}>
              <option value="draft">Draft</option>
              <option value="review">In review</option>
              <option value="approved">Approved</option>
              <option value="scheduled">Scheduled</option>
            </select>
          </label>
        </article>
      ))}
      <aside className="year-reminder"><strong>Next milestone</strong><span>Generate, review, and schedule all 365 Scrolls for 2027 after the MVP is approved.</span></aside>
    </div>
  );
}
