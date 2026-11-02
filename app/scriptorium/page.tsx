import { Scriptorium } from "../../components/Scriptorium";

export default function ScriptoriumPage() {
  return (
    <main className="page-shell">
      <header className="page-heading"><span className="eyebrow">Private administration</span><h1>The Scriptorium</h1><p>Review the questions, answer coverage, and publication status before a Scroll goes live.</p></header>
      <section className="panel-card"><Scriptorium /></section>
    </main>
  );
}
