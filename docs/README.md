# Project knowledge

This folder holds product context for people and AI agents working on Habito.
The code is the source of truth for current behavior; these notes explain the
design intent, known status, and possible future work. Keep them concise and
update them when implementation or product decisions change.

- [Design and UX](./design.md) — current visual language and interaction guidance.
- [Financial books](./financial-books.md) — titles and authors for reference.
- [Backlog](./backlog.md) — possible future work, including unconfirmed ideas
  carried forward from an older plan.
- [Todo list](./todo.md) — user-approved work currently in progress or pending.
- [Original product specification](./habito_spec_v1.md) — historical v1
  product/technical plan; some details have been superseded by the current app.

## Current implementation at a glance

- Spanish-first browser app built with plain HTML, CSS, and JavaScript; no
  frontend build step or framework.
- Vercel serves the pages and API routes.
- Supabase provides authentication and database storage. The current dashboard
  persists one JSON state document per signed-in user in `user_data`; the
  schema also defines structured portfolio, asset, and objective tables.
- The dashboard supports asset and goal management, contribution planning,
  allocation/rebalancing, and an AI advisor.
- The advisor is a Vercel API route that calls OpenAI. The dashboard also gets
  the MEP exchange rate directly from dolarapi.com.
- `macro_data` is a shared table seeded with baseline values; automated market
  data refresh is not currently implemented.

