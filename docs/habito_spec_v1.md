**HABITO**
 
Product Specification Document
 
v1.0  ·  Investment Habit Tracker  ·  PWA

> **Status note (October 2026):** This is the original product specification,
> retained as historical context, not a statement of current implementation.
> The current app is a plain HTML/CSS/JavaScript web app hosted on Vercel, uses
> Supabase Auth and cloud storage, and calls OpenAI through a serverless API.
> It does not currently have a React frontend, PWA manifest/service worker,
> offline mode, English toggle, or the local-only privacy model described
> below. See [the current project overview](./README.md),
> [design and UX](./design.md), and [backlog](./backlog.md) for current status.
> This file is in a public repository; the “Confidential” footer below is part
> of the original document and does not describe repository visibility.
> The financial descriptions and recommendations in this archived draft are
> proposals from that document, not verified financial guidance or current
> product behavior.
 
# 1. Purpose & Vision
 
**Habito** is a mobile-first savings tracker that helps regular people protect their money from inflation by investing consistently. It is not a trading tool. It is not a dashboard for experts. It is a habit-building companion for anyone who wants to start investing — regardless of experience.
 
The core question the app answers every month:
 
***"******¿Dónde pongo mis ahorros este mes?******"***
 
The app motivates through consistency, not performance. The primary metric is the savings streak — how many consecutive months the user has updated their portfolio. This builds identity as an investor over time.
 
# 2. Target Audience
 
## 2.1 Primary User (v1)
 
| **Experience** | Complete beginner — never invested before |
| --- | --- |
| **Geography** | Argentina — ARS/USD, CEDEARs, FCIs, Binance, Santander, Lemon |
| **Motivation** | Beat inflation, reach a goal, build a habit |
| **Usage** | Opens the app once a month to update balances |
| **Language** | Spanish first, English toggle available |
| **Platform** | iPhone / Android (PWA — Progressive Web App) |
 
## 2.2 Product Roadmap
 
| **v1 — Personal** | Solo use. Argentina-focused. ARS/USD. Full access, no limits. |
| --- | --- |
| **v2 — Beta** | Share with friends and family. Still Argentina-focused. Full access, no paywall. Collect feedback. |
| **v3 — Public** | Public launch. Latin America → Global. Multi-currency. Freemium model. App Store (iOS + Android). Backend + device sync. |
 
# 3. Core Principles
 
## 3.1 Habit over performance
 
The streak is the hero metric, not total return. The app celebrates consistency, not gains.
 
## 3.2 Privacy first
 
All data is stored locally on the device (localStorage). No server, no account, no login. No one — including the developer — can access user data. The only external calls are: (a) MEP rate from dolarapi.com (optional, overridable), and (b) AI advisor via Anthropic API (sends only portfolio summary, no personal identifiers).
 
## 3.3 Radical simplicity
 
No transactions, no charts in v1, no trading features. One job: track balances, show allocation vs target, tell the user where to put money this month.
 
## 3.4 Tone
 
Smart and direct. States facts. Trusts the user. No hand-holding, no emojis in data, no filler copy. Plain Spanish — no financial jargon.
 
# 4. Information Architecture
 
The app is structured as a mobile PWA with bottom navigation (3 tabs) and a persistent header.
 
## 4.1 Global Header
 
- Total portfolio in USD (large, hero)
 
- Total in ARS — small font, below USD
 
- USD/ARS MEP rate — auto-fetched, manually overridable
 
- Savings streak — 🔥 N meses — top right
 
## 4.2 Tab 1 — Portafolio
 
- Asset table: Name, Broker, Balance, % Objetivo, % Real, Rebalanceo, Aporte mensual
 
- Floating + button (bottom right) → Add asset modal
 
- Tap row → Edit asset
 
- Monthly budget input → drives "Aporte mensual" column
 
## 4.3 Tab 2 — Objetivos
 
- Goal cards with progress bar, % complete, ETA
 
- Fields: emoji, name, target amount, current saved, currency
 
- "A este ritmo, alcanzás tu objetivo en X meses"
 
- Floating + button → Add goal modal
 
## 4.4 Tab 3 — Advisor IA
 
- Primary CTA: "Analizar mi portafolio" button
 
- AI reads actual portfolio data before responding
 
- Secondary: custom question input
 
- Framing: "¿Dónde pongo mis ahorros este mes?"
 
# 5. Onboarding
 
## 5.1 First Launch
 
- App opens with pre-loaded example data (realistic Argentine portfolio)
 
- Banner: "Estos son datos de ejemplo — hacé el tuyo"
 
- CTA: "Personalizar" clears example data and triggers template selection
 
## 5.2 Allocation Templates
 
Three starter templates shown as cards:
 
- 🛡️  Conservador — FCIs, money market, bonds. Low risk.
 
- ⚖️  Moderado — Mix of FCIs, ETFs, some crypto.
 
- 🚀  Agresivo — Heavy crypto, CEDEARs, some bonds.
 
User picks one (assets pre-loaded with suggested target %) or taps "Empezar desde cero" to skip.
 
## 5.3 Guided Tour
 
Auto-triggered on first visit. Highlights 4 sections sequentially with tooltip overlay:
 
- Total en USD / ARS — "Tu patrimonio total"
 
- Tabla de activos — "Así está distribuido tu dinero"
 
- % Objetivo vs % Real — "Comparás dónde estás vs dónde querés estar"
 
- Monto a invertir — "Te decimos cuánto agregar a cada activo para rebalancear"
 
Tour can be replayed via "?" button at any time.
 
# 6. Allocation Logic
 
## 6.1 Currency Handling
 
- USD assets → stored in USD, converted to ARS using MEP rate for % calculations
 
- ARS assets → stored in ARS
 
- All allocation % calculations performed in a single unified base currency (ARS)
 
- Display: ARS assets shown in ARS; USD assets shown in USD with ARS equivalent
 
## 6.2 Column: Rebalanceo
 
Rebalanceo = (Total portfolio × Target %) − Current value
 
- Positive value → user needs to add money to this asset
 
- Negative value → asset is overweight, no action needed
 
- Zero → perfectly balanced
 
- Displayed in ARS
 
## 6.3 Column: Aporte Mensual
 
Aporte mensual = Monthly budget × Target %
 
- User enters monthly budget once (e.g. $ 500.000 ARS)
 
- Each asset receives its proportional slice of the budget
 
- Answers: "I have $X this month — where does it go?"
 
## 6.4 Target % Validation
 
Target allocations do not need to sum to 100%. A soft indicator shows the total (e.g. "Total objetivo: 97%") but no error is thrown. User retains full flexibility.
 
# 7. Habit & Streak Mechanic
 
- Streak counts consecutive months with at least one balance update
 
- Streak is lost if user skips a full calendar month
 
- Shown as: 🔥 7 meses (or "7 months" in EN mode)
 
- Completing a monthly update extends the streak
 
- Optional reminder: monthly push notification to update balances (user opt-in)
 
- Reminder copy: "Ya pasó un mes. Actualizá tus saldos."
 
# 8. Design System
 
## 8.1 Color Palette (Obsidian-inspired)
 
| **Background** | #1e1e2e — Deep dark blue-gray |
| --- | --- |
| **Surface** | #24243a — Cards and containers |
| **Surface 2** | #2a2a40 — Input fields, nav bar |
| **Border** | #35355a — Subtle dividers |
| **Text** | #cdd6f4 — Primary text (soft white) |
| **Muted** | #6c7086 — Labels, secondary info |
| **Accent** | #cba6f7 — Lavender (primary brand color) |
| **Positive** | #a6e3a1 — Soft green |
| **Negative** | #f38ba8 — Soft red |
| **Amber** | #fab387 — Soft peach / warning |
| **Blue** | #89b4fa — Links, rates |
 
## 8.2 Typography
 
| **Primary font** | Poppins (Google Fonts) — all UI text |
| --- | --- |
| **Weights used** | Light, Regular, Medium, Bold |
| **Hero numbers** | Poppins Bold 34px — Total USD |
| **Section titles** | Poppins Bold 13px |
| **Body / data** | Poppins Regular 12px |
| **Labels / meta** | Poppins Light 10px |
 
## 8.3 Number Format (Latin American Standard)
 
- Thousands separator: punto ( . )   →   $ 16.279.450
 
- Decimal separator: coma ( , )       →   u$s 2.208,57
 
- Percentage: coma ( , )               →   19,1%
 
## 8.4 Layout
 
- Mobile-first, 375px base width
 
- Bottom navigation — 3 tabs
 
- Floating action button (bottom right) — context-aware per tab
 
- Cards with subtle borders and generous padding
 
- No harsh neon colors — Obsidian palette throughout
 
# 9. Technical Stack
 
| **Platform** | Progressive Web App (PWA) |
| --- | --- |
| **Framework** | React (with hooks) |
| **Styling** | Tailwind CSS or inline CSS-in-JS |
| **Storage** | localStorage — no backend, no database |
| **Exchange rate** | dolarapi.com (MEP rate, free, no auth) |
| **AI Advisor** | Anthropic API — claude-sonnet-4-6 |
| **Hosting** | Vercel or Netlify (free tier) |
| **PWA manifest** | manifest.json + service worker for offline |
| **Font** | Poppins via Google Fonts |
 
## 9.1 Data Model
 
All data stored in localStorage under namespaced keys:
 
- habito_assets — Array of asset objects
 
- habito_goals — Array of goal objects
 
- habito_settings — MEP rate override, language, monthly budget
 
- habito_streak — Last update date + streak count
 
- habito_onboarded — Boolean, controls first-launch flow
 
## 9.2 Asset Object
 
{ id, name, broker, balance, currency, targetPct, type, updatedAt }
 
## 9.3 Goal Object
 
{ id, name, emoji, target, current, currency, createdAt }
 
# 10. Build Roadmap
 
## Sprint 1 — Core (v1 Personal)
 
- Portfolio tab with asset table
 
- Add / edit / delete asset (floating button → modal)
 
- USD/ARS conversion + MEP auto-fetch with manual override
 
- Total USD hero + ARS subtitle
 
- localStorage persistence
 
- Latin American number formatting
 
## Sprint 2 — Habit Mechanic (v1 Personal)
 
- Monthly streak counter
 
- "Monto a invertir" rebalancing column
 
- Monthly budget input → Aporte mensual column
 
- Onboarding: example data + 3 allocation templates
 
- Guided tour (4-step tooltip overlay)
 
## Sprint 3 — Goals + AI + Polish (v1 Personal)
 
- Goals tab with progress bars and ETA
 
- AI Advisor tab (single CTA + custom question)
 
- Bilingual toggle ES / EN
 
- PWA manifest + service worker (offline support)
 
- Optional monthly reminder notification
 
- Export / import data as JSON (backup)
 
## Sprint 4 — Beta (v2 Friends & Family)
 
- Feedback button (simple email or form)
 
- Bug fixes and UX improvements based on real usage
 
- Performance optimizations
 
- Shareable URL for onboarding friends easily
 
## Sprint 5 — Public Launch (v3)
 
- User accounts + authentication
 
- Backend + cloud database for device sync
 
- Freemium model: free core, Pro subscription (AI unlimited + export + sync)
 
- Payment integration: Stripe + Mercado Pago
 
- App Store submission: iOS + Android (~$200/year)
 
- Multi-currency support: BRL, CLP, MXN, EUR, and more
 
- Marketing site + landing page
 
# 11. Monetization Strategy (v3)
 
Note: No paywall during v1 (personal) or v2 (beta). Full access for all users until public launch.
 
## 11.1 Freemium Tiers
 
| **Feature** | **Habito Free** | **Habito Pro** |
| --- | --- | --- |
| Portfolio tracking | ✅ Unlimited | ✅ Unlimited |
| Goals tracker | ✅ Unlimited | ✅ Unlimited |
| Streak mechanic | ✅ | ✅ |
| MEP rate auto-fetch | ✅ | ✅ |
| AI Advisor | 5 consultas/mes | ✅ Unlimited |
| Export (JSON/CSV) | ❌ | ✅ |
| Device sync | ❌ | ✅ |
| Price | Gratis | ~u$s 3–5/mes |
 
## 11.2 Infrastructure
 
- v1–v2: Vercel/Netlify free tier — $0/month
 
- v3: Backend server (Node.js + PostgreSQL) + Vercel hosting
 
- App Store: Apple Developer Program ($99/year) + Google Play ($25 one-time)
 
- Payment: Stripe (global) + Mercado Pago (Latin America)
 
# 12. Copy & Language Guide
 
## 12.1 Tone
 
Smart and direct. States facts without hand-holding. Trusts the user to act. No emojis in data. Emojis only in empty states and onboarding.
 
## 12.2 Key Terms
 
| **Portfolio** | Portafolio |
| --- | --- |
| **Rebalance** | Rebalancear |
| **Allocation** | Distribución |
| **Target %** | % Objetivo |
| **Current %** | % Real |
| **Monthly budget** | Aporte mensual |
| **Savings streak** | Racha de ahorro |
| **Assets** | Activos |
| **Balance** | Saldo |
 
## 12.3 Empty States
 
- "Sin activos. Agregá uno para comenzar."
 
- "Sin objetivos. ¿Qué estás ahorrando?"
 
- "Agregá tus activos para obtener un análisis."
 
## 12.4 Error States
 
- "No se pudo obtener el tipo de cambio. Ingresalo manualmente."
 
- "Error al conectar con el advisor. Intentá de nuevo."
 
Habito — Product Specification v1.0  ·  Confidential