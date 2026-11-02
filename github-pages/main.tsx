import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { Leaderboard } from "../components/Leaderboard";
import { ScribeGame } from "../components/ScribeGame";
import { Scriptorium } from "../components/Scriptorium";
import { getDailyScroll } from "../data/game";
import "../app/globals.css";

function routeFromHash() {
  return window.location.hash.replace(/^#/, "") || "/";
}

function StaticApp() {
  const [route, setRoute] = useState(routeFromHash);
  useEffect(() => {
    const update = () => setRoute(routeFromHash());
    window.addEventListener("hashchange", update);
    return () => window.removeEventListener("hashchange", update);
  }, []);

  const base = import.meta.env.BASE_URL.replace(/\/$/, "");
  const navigation = (
    <header className="site-header">
      <a className="brand" href={`${base}/#/`} aria-label="Scribe home"><span>S</span><strong>SCRIBE</strong></a>
      <nav aria-label="Primary navigation">
        <a href={`${base}/#/`}>Today</a>
        <a href={`${base}/#/leaderboard`}>Hall of Scribes</a>
      </nav>
      <a className="header-mark" href={`${base}/#/scriptorium`} aria-label="Open the Scriptorium">✦</a>
    </header>
  );

  if (route === "/") return <>{navigation}<ScribeGame scroll={getDailyScroll()} /></>;
  if (route === "/leaderboard") return <>{navigation}<Page title="Hall of Scribes" copy="Today’s worldwide register, ordered by illumination and then time."><Leaderboard /></Page></>;
  if (route === "/scriptorium") return <>{navigation}<Page title="The Scriptorium" copy="Private review and approval for upcoming daily Scrolls."><Scriptorium /></Page></>;
  return <>{navigation}<Page title="Scroll not found" copy="This page could not be found."><a className="primary-button" href={`${base}/#/`}>Return to today’s quest</a></Page></>;
}

function Page({ title, copy, children }: { title: string; copy: string; children: React.ReactNode }) {
  return <main className="page-shell"><header className="page-heading"><span className="eyebrow">Scribe</span><h1>{title}</h1><p>{copy}</p></header><section className="panel-card">{children}</section></main>;
}

createRoot(document.getElementById("root")!).render(<React.StrictMode><StaticApp /></React.StrictMode>);
