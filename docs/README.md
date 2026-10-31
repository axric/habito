# Documentation index

This folder holds the current project context and working references for Habito.

## Current docs
- [design.md](./design.md) — current UX and product intent
- [backlog.md](./backlog.md) — ideas and future work
- [todo.md](./todo.md) — active work queue
- [financial-books.md](./financial-books.md) — reference books used for product guidance

## Project snapshot
- Frontend: static HTML/CSS/JS app hosted on Vercel
- Auth + persistence: Supabase Auth + Supabase tables
- AI advisor: /api/advisor route backed by OpenAI
- Market data: dolarapi.com for USD rate
- Portfolio model: two default user buckets — Main and 2050
- Goals can link assets across both portfolios

## API calls at a glance
The app keeps its API usage intentionally small and straightforward:
- `/api/advisor` — sends the user’s current portfolio summary to the AI service and returns structured guidance
- `dolarapi.com` — fetches the latest USD rate used in the dashboard calculations and conversions
- Supabase queries — read/write user and portfolio state such as `user_data`, asset records, and objective data
- Macro/market sources (for example ArgentinaDatos or BYMA) — can be used later for the indicators tab to provide inflation, risk country, and market snapshots

In short: the browser handles the UI, Supabase stores the app data, and a few external APIs provide market and AI context.

## Naming convention
The app currently uses two portfolio buckets:
- Main: default investing bucket for ongoing portfolio management
- 2050: long-term retirement allocation

These names are product-facing and should stay in English unless the UI is intentionally localized to Spanish for a specific screen.
