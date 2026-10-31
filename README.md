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

## API and data sources
Habito intentionally keeps its external dependencies small and easy to understand. The app mainly combines browser state, Supabase storage, and a few external providers for market and AI context.

### Internal API endpoints

#### `GET /api/config`
Purpose:
- Exposes the public Supabase URL and anon key to the browser.
- Used by [js/auth.js](./js/auth.js) to initialize the frontend client.

Environment variables required:
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`

Response example:
```json
{
  "supabaseUrl": "https://xyz.supabase.co",
  "supabaseAnonKey": "public-anon-key"
}
```

#### `POST /api/advisor`
Purpose:
- Validates the signed-in user session with Supabase
- Sends the current portfolio context to OpenAI
- Returns a portfolio analysis and follow-up answers for the Advisor screen

Headers:
- `Authorization: Bearer <Supabase access token>`

Body examples:
```json
{
  "system": "Sos un analista financiero...",
  "messages": [
    { "role": "user", "content": "Generá la Ficha del inversor..." }
  ]
}
```

Follow-up payload:
```json
{
  "type": "follow-up",
  "questionId": "risk",
  "context": "Perfil y cartera del usuario..."
}
```

Supported follow-up questions:
- `risk`
- `asset`
- `diversification`

Environment variables required:
- `OPENAI_API_KEY`
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `OPENAI_MODEL` (optional)

#### `POST /api/macro`
Purpose:
- Refreshes the shared finance indicators from the configured external sources
- Updates the `macro_data` table in Supabase with the newest values for the dashboard

Headers:
- `Authorization: Bearer <Supabase access token>`

Environment variables required:
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `FRED_API_KEY` (optional, required for FRED fetches)

### External data sources in use
- `Supabase` — app auth and database layer for `user_data`, `portfolios`, `assets`, `objectives`, and `macro_data`
- `https://dolarapi.com/v1/dolares/bolsa` — live USD/Bolsa rate used in the dashboard
- `https://api.openai.com/v1/chat/completions` — main advisor responses
- `https://api.openai.com/v1/responses` — research-style advisor follow-ups with web search support
- `https://fonts.googleapis.com` — web font loading for the UI

### Planned macro / finance sources
These are the sources already discussed for future indicators, but they are not all implemented yet:
- `https://argentinadatos.com/docs` — Argentina macro data such as inflation and country risk
- `https://www.byma.com.ar/byma-apis` — Argentine market data
- `https://fred.stlouisfed.org/` — US macro indicators and treasury rates
- `https://finance.yahoo.com/` — stock and index pricing
- `https://www.bcra.gob.ar/apis-banco-central/` — central bank data
- `https://www.oilpriceapi.com/` — commodity / oil indicator feeds

### Data flow summary
1. The browser loads [js/auth.js](./js/auth.js) and calls `GET /api/config` to get the public Supabase config.
2. The app connects to Supabase Auth and reads/writes user data and portfolio records.
3. The dashboard fetches the live USD rate from `dolarapi.com` for conversions and totals.
4. When the user asks for portfolio advice, the app calls `POST /api/advisor`.
5. The backend validates the current session and sends the portfolio context to OpenAI.
6. The advisor returns structured analysis and follow-up answers in Spanish.

### Notes
- The app uses a small, explicit API surface on purpose.
- The data model is intentionally simple: static frontend, Supabase for persistence, and a few external providers for market and AI context.

## Documentation
See [docs/README.md](./docs/README.md) for the current project documentation index.
