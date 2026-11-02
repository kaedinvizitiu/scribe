import { Leaderboard } from "../../components/Leaderboard";

export default function LeaderboardPage() {
  return (
    <main className="page-shell">
      <header className="page-heading"><span className="eyebrow">Today’s register</span><h1>Hall of Scribes</h1><p>Global rankings settle by illumination, then by completion time.</p></header>
      <section className="panel-card"><Leaderboard /></section>
    </main>
  );
}
