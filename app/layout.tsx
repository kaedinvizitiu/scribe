import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, IM_Fell_English_SC, Inter } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const display = Cormorant_Garamond({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const sans = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const letterpress = IM_Fell_English_SC({
  variable: "--font-letterpress",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: { default: "Scribe — Daily Bible Knowledge", template: "%s · Scribe" },
  description: "Seven questions from across Scripture. One daily illuminated scroll.",
  applicationName: "Scribe",
  openGraph: {
    title: "Scribe — Seven questions. One daily scroll.",
    description: "A daily open-answer Bible knowledge game.",
    type: "website",
    images: [{ url: "/og.png", width: 1730, height: 907, alt: "Scribe — Seven questions. One daily scroll." }],
  },
  twitter: { card: "summary_large_image", images: ["/og.png"] },
  icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
};

export const viewport: Viewport = {
  themeColor: "#171b24",
  colorScheme: "light",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${display.variable} ${letterpress.variable} ${sans.variable}`}>
        <header className="site-header">
          <Link className="brand" href="/" aria-label="Scribe home"><span>S</span><strong>SCRIBE</strong></Link>
          <nav aria-label="Primary navigation">
            <Link href="/">Today</Link>
            <Link href="/leaderboard">Hall of Scribes</Link>
          </nav>
          <Link className="header-mark" href="/scriptorium" aria-label="Open the Scriptorium">✦</Link>
        </header>
        {children}
      </body>
    </html>
  );
}
