# Scribe

Seven questions. One daily scroll.

Scribe is a browser-based daily Bible knowledge game built around seven open-answer prompts, a 30-second clock, fixed answer rankings, Scripture references, anonymous global rankings, and a private content-review Scriptorium.

## Current prototype

- 14 sample Daily Scroll schedules
- 21 curated question sets spanning the 66-book Protestant canon
- unlimited attempts until the 30-second timer expires
- fixed Ink, Bronze, Silver, Gold, and Pearl scoring
- post-answer examples and ESV references
- anonymous nickname and leaderboard foundation
- private Scriptorium approval workflow
- midnight Pacific daily rotation

## Local development

```bash
pnpm install
pnpm run dev
```

The local Scriptorium preview passphrase is `scribe-local`. Set a private `SCRIPTORIUM_KEY` environment value before publishing.

## Content roadmap

After the MVP rules and interface are approved, generate, validate, review, and schedule all 365 Daily Scrolls for 2027. That calendar will contain 2,555 prompts plus ranked answers, aliases, notes, and references.
