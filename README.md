# Scribe

Seven questions. One daily scroll.

Scribe is a browser-based daily Bible knowledge game built around seven open-answer prompts, a 30-second clock, fixed answer rankings, Scripture references, and anonymous global rankings.

## Current build

- 365 dated Daily Scroll schedules for 2027
- 270 curated prompt presentations spanning the 66-book Protestant canon
- unlimited attempts until the 30-second timer expires
- fixed Mustard Seed, Manna, Miracle, Transfiguration, and Seventh Seal scoring
- post-answer examples and ESV references
- anonymous nickname and leaderboard foundation
- midnight Pacific daily rotation

## Local development

```bash
pnpm install
pnpm run dev
```

## 2027 content calendar

The dated calendar contains 365 Daily Scrolls and 2,555 scheduled prompt slots with ranked answers, aliases, notes, and ESV references.

The 90 curated answer families produce 270 distinct prompt presentations. Automated validation prevents the same prompt presentation from returning within 30 days.
