import type { Metadata } from "next";
import { ScribeGame } from "../components/ScribeGame";
import { getDailyScroll } from "../data/game";

export const metadata: Metadata = {
  title: "Today’s Scroll",
  description: "Seven daily Bible questions. One illuminated scroll.",
};

export default function Home() {
  return <ScribeGame scroll={getDailyScroll()} />;
}
