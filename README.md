# Habito

Habito is a personal finance and investment tracking app focused on simple, long-term planning for people who want to build wealth without overcomplicating their decisions.

## How it works
- The frontend is a mobile-first web app served from Vercel
- Supabase handles authentication, user data, and portfolio storage
- The AI advisor route lives in `/api/advisor` and uses the configured model to review the user portfolio and provide cautious guidance
- Market data is pulled from `dolarapi.com` for the USD rate
- Each user has two default buckets: Main and 2050

## Current portfolio model
- Main: day-to-day investing / general portfolio tracking
- 2050: retirement-focused allocation and long-term goals
- Goals can link assets across both buckets, even when the user is currently viewing one portfolio

## Project structure
- `dashboard.html` — main app dashboard and UI logic
- `css/terminal.css` — styling and mobile layout
- `js/data.js` — data access for Supabase-backed user state
- `supabase/schema.sql` — database schema and RLS policies
- `api/advisor.js` — advisor API handler
- `docs/` — current project documentation and planning references

## Simple architecture summary
The app is designed to stay approachable:
- user actions happen in the web app
- portfolio and user settings are stored in Supabase
- the advisor reads the current portfolio state and produces a risk-aware response
- market and macro information is read from shared data sources, not from heavy local state

## Documentation
See [docs/README.md](./docs/README.md) for the current documentation index.
