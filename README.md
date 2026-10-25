# Habito

Habito is a small, browser-based portfolio tracker. The pages and most of the
app run in the browser; Supabase handles sign-in and database storage, Vercel
hosts the site and its serverless API routes, and OpenAI powers the advisor.

## How the pieces fit together

1. **Pages:** [`index.html`](./index.html) is the login page and
   [`dashboard.html`](./dashboard.html) is the app. The dashboard uses plain
   JavaScript and styles from [`css/terminal.css`](./css/terminal.css); there is
   no build step.
2. **Hosting and API:** Vercel serves the static files and runs the JavaScript
   functions in [`api/`](./api/). The rewrites in [`vercel.json`](./vercel.json)
   make `/login` open the login page and `/dashboard` open the dashboard.
3. **Supabase connection:** The browser requests `/api/config`. The Vercel
   function in [`api/config.js`](./api/config.js) returns the Supabase project
   URL and public (anon) key from environment variables. The browser uses
   Supabase Auth to sign in and make database requests.
4. **User data:** The current dashboard saves its state as one JSON document
   per user in `user_data`, through [`js/data.js`](./js/data.js). The SQL schema
   also defines structured `portfolios`, `assets`, and `objectives` tables.
   Supabase Row Level Security (RLS) policies restrict user records to their
   owner.
5. **Shared indicators:** [`js/macro.js`](./js/macro.js) reads shared economic
   indicators from `macro_data`. Signed-in users can read those values, but
   regular users cannot update them; the table is seeded with example values
   by [`supabase/schema.sql`](./supabase/schema.sql).
6. **Advisor:** The dashboard sends advisor requests to `/api/advisor`. That
   serverless function checks the user's Supabase access token, then calls
   OpenAI using a key held by Vercel. News research uses OpenAI web search.
7. **Other data:** The dashboard also requests the MEP dollar rate from
   `https://dolarapi.com/v1/dolares/bolsa`.

In short: **Vercel serves the app and keeps server-side API keys; Supabase
handles accounts and saved data; OpenAI provides advisor responses.**

## Setup and deployment

1. Create a Supabase project and run [`supabase/schema.sql`](./supabase/schema.sql)
   in its SQL editor.
2. In Vercel, import this repository and add these environment variables:
   - `SUPABASE_URL` — the Supabase project URL.
   - `SUPABASE_ANON_KEY` — the Supabase public/anon key.
   - `OPENAI_API_KEY` — required for the advisor.
   - `OPENAI_MODEL` — optional; defaults are set in `api/advisor.js`.
3. Deploy from Vercel. There is no compile/build command; the HTML, CSS, and
   JavaScript files are served directly.
4. To test locally, use Vercel's local development command so `/api/config`
   and `/api/advisor` are available, and provide the same environment
   variables in the local environment.

The Supabase anon key is intended for browser use. Do not put a Supabase
service-role key or the OpenAI key in frontend files. RLS is what protects
user data when the public key is used.

## Useful files

- [`api/config.js`](./api/config.js) — gives the browser public Supabase config.
- [`api/advisor.js`](./api/advisor.js) — authenticates and proxies advisor calls.
- [`js/auth.js`](./js/auth.js) — login, logout, and session checks.
- [`js/data.js`](./js/data.js) — user data reads and saves.
- [`js/macro.js`](./js/macro.js) — shared macro indicator reads.
- [`supabase/schema.sql`](./supabase/schema.sql) — tables, seed data, and RLS.
- [`vercel.json`](./vercel.json) — friendly page routes.
