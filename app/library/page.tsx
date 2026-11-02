import { Library } from "../../components/Library";

export default function LibraryPage() {
  return (
    <main className="page-shell">
      <header className="page-heading"><span className="eyebrow">Your reading history</span><h1>The Library</h1><p>Completed Scrolls and the fourteen-day prototype calendar.</p></header>
      <section className="panel-card"><Library /></section>
    </main>
  );
}
