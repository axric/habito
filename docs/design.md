---
name: Habito
description: Mobile-first investment habit tracker for Latin American beginners. Dark, focused, encouraging.
version: 1.0.0
 
colors:
  background: "#282A36"
  background-dark: "#21222C"
  background-darker: "#191A21"
  selection: "#44475A"
  foreground: "#F8F8F2"
  muted: "#6272A4"
  purple: "#BD93F9"
  pink: "#FF79C6"
  green: "#50FA7B"
  red: "#FF5555"
  orange: "#FFB86C"
  yellow: "#F1FA8C"
  cyan: "#8BE9FD"
 
typography:
  primary:
    fontFamily: "Poppins"
    source: "Google Fonts"
  hero:
    fontFamily: "Poppins"
    fontSize: "34px"
    fontWeight: 700
    color: "{colors.foreground}"
  headline:
    fontFamily: "Poppins"
    fontSize: "16px"
    fontWeight: 700
    color: "{colors.foreground}"
  section-label:
    fontFamily: "Poppins"
    fontSize: "11px"
    fontWeight: 700
    color: "{colors.foreground}"
  body:
    fontFamily: "Poppins"
    fontSize: "12px"
    fontWeight: 400
    color: "{colors.foreground}"
  label:
    fontFamily: "Poppins"
    fontSize: "10px"
    fontWeight: 300
    color: "{colors.muted}"
  number-hero:
    fontFamily: "Poppins"
    fontSize: "34px"
    fontWeight: 700
    color: "{colors.foreground}"
  number-body:
    fontFamily: "Poppins"
    fontSize: "12px"
    fontWeight: 400
 
rounded:
  sm: "6px"
  md: "10px"
  lg: "14px"
  xl: "20px"
  full: "9999px"
 
spacing:
  xs: "4px"
  sm: "8px"
  md: "12px"
  lg: "16px"
  xl: "24px"
  xxl: "32px"
 
components:
  card:
    backgroundColor: "{colors.background-dark}"
    border: "1px solid {colors.selection}"
    rounded: "{rounded.lg}"
    padding: "12px 14px"
  card-hover:
    border: "1px solid {colors.purple}"
  button-primary:
    backgroundColor: "transparent"
    border: "1px solid {colors.purple}"
    textColor: "{colors.purple}"
    rounded: "{rounded.md}"
    padding: "10px 16px"
    fontSize: "13px"
    fontWeight: 700
  button-primary-hover:
    backgroundColor: "rgba(189,147,249,0.1)"
  button-primary-active:
    backgroundColor: "rgba(189,147,249,0.2)"
  button-fab:
    backgroundColor: "{colors.purple}"
    textColor: "{colors.background}"
    width: "44px"
    height: "44px"
    rounded: "{rounded.full}"
    fontSize: "24px"
    fontWeight: 700
  input:
    backgroundColor: "{colors.background-darker}"
    border: "1px solid {colors.selection}"
    rounded: "{rounded.sm}"
    textColor: "{colors.foreground}"
    placeholderColor: "{colors.muted}"
    padding: "8px 10px"
    fontSize: "12px"
  input-focus:
    border: "1px solid {colors.cyan}"
  nav-bar:
    backgroundColor: "{colors.background-darker}"
    border: "1px solid {colors.selection}"
    height: "56px"
    rounded: "{rounded.xl}"
  nav-item-active:
    textColor: "{colors.purple}"
    indicatorColor: "{colors.purple}"
    indicatorHeight: "3px"
    indicatorWidth: "32px"
  nav-item-inactive:
    textColor: "{colors.muted}"
  badge-positive:
    backgroundColor: "rgba(80,250,123,0.12)"
    textColor: "{colors.green}"
    border: "1px solid rgba(80,250,123,0.3)"
    rounded: "{rounded.sm}"
    padding: "2px 6px"
    fontSize: "9px"
  badge-negative:
    backgroundColor: "rgba(255,85,85,0.12)"
    textColor: "{colors.red}"
    border: "1px solid rgba(255,85,85,0.3)"
    rounded: "{rounded.sm}"
    padding: "2px 6px"
    fontSize: "9px"
  badge-warning:
    backgroundColor: "rgba(255,184,108,0.12)"
    textColor: "{colors.orange}"
    border: "1px solid rgba(255,184,108,0.3)"
    rounded: "{rounded.sm}"
    padding: "2px 6px"
    fontSize: "9px"
  badge-info:
    backgroundColor: "rgba(189,147,249,0.12)"
    textColor: "{colors.purple}"
    border: "1px solid rgba(189,147,249,0.3)"
    rounded: "{rounded.sm}"
    padding: "2px 6px"
    fontSize: "9px"
  streak-badge:
    backgroundColor: "rgba(189,147,249,0.15)"
    textColor: "{colors.purple}"
    border: "1px solid {colors.purple}"
    rounded: "{rounded.sm}"
    padding: "3px 8px"
    fontSize: "10px"
  progress-track:
    backgroundColor: "{colors.selection}"
    height: "5px"
    rounded: "{rounded.full}"
  progress-fill:
    rounded: "{rounded.full}"
    height: "5px"
  hero-card:
    backgroundColor: "{colors.background-dark}"
    border: "1px solid {colors.selection}"
    rounded: "{rounded.lg}"
    padding: "14px 16px"
  ai-card:
    backgroundColor: "rgba(189,147,249,0.06)"
    border: "1px solid rgba(189,147,249,0.25)"
    rounded: "{rounded.lg}"
    padding: "14px 16px"
  table-row:
    backgroundColor: "{colors.background-dark}"
    border: "1px solid {colors.selection}"
    rounded: "{rounded.md}"
    padding: "8px 10px"
    marginBottom: "6px"
  modal:
    backgroundColor: "{colors.background-dark}"
    border: "1px solid {colors.selection}"
    rounded: "{rounded.xl}"
    padding: "20px"
  divider:
    color: "{colors.selection}"
    height: "1px"
---
 
## Overview
 
Habito is a mobile-first savings habit tracker for Latin American beginners — specifically Argentina-focused in v1. The design must feel **trustworthy, focused, and encouraging** without being playful or gamified.
 
The UI is dark and calm. It does not shout. It does not celebrate excessively. It states facts, respects the user's intelligence, and makes financial data feel accessible rather than intimidating.
 
Primary inspiration: **Dracula color scheme** for palette. **Poppins** for warmth. **Wealthfolio** for layout restraint.
 
The emotional target: a beginner investor who opens the app once a month, sees their number, updates their balances, and feels good about being consistent — not overwhelmed.

### Current implementation (October 2026)

This design file contains both design intent and older proposed details. Where
older details below conflict with this current snapshot, follow the current app
and confirmed decisions:

- The app is Spanish-first. An English language toggle is not implemented.
- It is a browser app built with plain HTML, CSS, and JavaScript, not React.
  There is no PWA manifest or offline service worker at present.
- Users sign in with Supabase. Dashboard state is saved to Supabase per user;
  user-scoped localStorage is also used by the current dashboard. Balance
  visibility preference is saved per account and restored at login.
- The dashboard currently has Portafolio, Objetivos, and Advisor IA tabs.
  Assets and objectives can be added, edited, and deleted.
- The MEP rate is fetched from dolarapi.com and can be edited manually. Shared
  macro indicators are read from Supabase `macro_data`; scheduled refresh of
  those shared indicators is not implemented.
- The advisor is served through `/api/advisor` and uses OpenAI, not Anthropic.
- The bottom navigation is in the app's layout below scrollable content, rather
  than fixed over the last rows. Preserve bottom safe-area spacing on iPhones.
- In asset editing, keep the action order **Guardar, Cancelar, Eliminar**.

---
 
## Colors
 
The palette is rooted in the **Dracula theme** — a deep purple-gray dark background with vibrant but not harsh accent colors.
 
- **Background** (`#282A36`): Main app background. All screens use this.
- **Background Dark** (`#21222C`): Cards, containers, table rows. Slightly darker than background to create depth without harsh contrast.
- **Background Darker** (`#191A21`): Input fields, bottom nav bar, deepest layer surfaces.
- **Selection** (`#44475A`): Borders, dividers, progress track. Subtle — should feel structural, not decorative.
- **Foreground** (`#F8F8F2`): All primary text. Warm off-white, not harsh pure white.
- **Muted** (`#6272A4`): Labels, secondary info, placeholder text, inactive nav items. Should feel secondary without disappearing.
- **Purple** (`#BD93F9`): Primary accent. Used for CTAs, active nav item, streak badge, AI advisor elements. The brand color.
- **Pink** (`#FF79C6`): Highlights, streaks, special callouts. Use sparingly.
- **Green** (`#50FA7B`): Positive values, gains, goals on track, successful states.
- **Red** (`#FF5555`): Negative values, losses, overweight assets, error states.
- **Orange** (`#FFB86C`): Warnings, overweight allocation indicators, "attention needed" states.
- **Yellow** (`#F1FA8C`): Rates, exchange info, informational highlights.
- **Cyan** (`#8BE9FD`): Exchange rate display, links, input focus state.
**Semantic usage rules:**
- Never use red for anything that isn't a loss or error
- Green is reserved for positive financial outcomes — do not use for decorative purposes
- Purple is the only color used for interactive CTAs
- Never mix more than 3 accent colors in a single screen
---
 
## Typography
 
Single font family throughout: **Poppins** via Google Fonts.
 
Four weights only: Light (300), Regular (400), Medium (500), Bold (700).
 
### Scale
 
| Role | Size | Weight | Color |
|---|---|---|---|
| Hero number (total USD) | 34px | Bold | Foreground |
| Screen title | 16px | Bold | Foreground |
| Section label | 11px | Bold | Foreground |
| Asset name / card title | 13px | Bold | Foreground |
| Body / data | 12px | Regular | Foreground |
| Sub-label / broker | 10px | Regular | Muted |
| Meta / timestamp | 9px | Light | Muted |
 
### Number formatting (Latin American standard)
- Thousands separator: **punto** → `$ 16.279.450`
- Decimal separator: **coma** → `u$s 2.208,57`
- Percentage: **coma** → `19,1%`
- Currency prefix: `u$s` for USD, `$` for ARS — no space between prefix and number
### Typography rules
- Never use more than two font weights on a single screen
- Section labels always uppercase, letter-spacing 0.08em
- Hero numbers never wrap — truncate if needed with ellipsis
- Avoid italics in data contexts — use color or weight instead
---
 
## Spacing
 
Base unit: **4px**. Scale follows multiples of 4.
 
| Token | Value | Usage |
|---|---|---|
| xs | 4px | Icon gaps, inline spacing |
| sm | 8px | Compact element padding |
| md | 12px | Card internal padding (tight) |
| lg | 16px | Card internal padding (standard), screen edge margin |
| xl | 24px | Between sections |
| xxl | 32px | Between major layout blocks |
 
Screen edge margin: **16px** on all sides.
Card gap (vertical between cards): **6-8px**.
Section gap (between section label and content): **8px**.
 
---
 
## Layout
 
- **Mobile-first**: 375px base width, scales up gracefully
- **3-tab bottom navigation**: Portafolio / Objetivos / Advisor IA
- **Persistent header**: Total USD (hero) + ARS (sub-label) + MEP rate + streak badge
- **Floating Action Button (FAB)**: Bottom right, 44×44px, purple fill, context-aware per tab (hidden on AI tab)
- **Scrollable content**: Tab content scrolls independently; navigation remains
  visible below the scrollable content without covering its last items
### Header structure (top of every screen)
```
[Screen title]                    [🔥 N meses]
[Content specific to tab]
```
 
### Hero card structure (Portfolio tab)
```
TOTAL
u$s 11.545
$ 16.279.450 ARS          +2,4% este mes
```
 
### Asset row structure
```
[Asset name]     [u$s value]
[Broker]         [obj X%]  [actual Y%]
```
 
### Goal card structure
```
[emoji] [Goal name]              [target]  [N%]
[████████░░░░░░░░░░░░░░░░░]
[X saved]          [remaining: Y]
A este ritmo, alcanzás tu objetivo en N meses.
```
 
---
 
## Components
 
### Cards
Rounded corners (`14px`), subtle border (`#44475A`), background slightly darker than screen (`#21222C`). No shadows — borders do the work. Generous internal padding (`12px 14px`).
 
### Buttons
All buttons are **outlined, not filled** — except the FAB and the AI analyze CTA. This keeps the UI calm and avoids visual noise.
 
Primary CTA (AI analyze): outlined purple border, purple text, subtle purple background on hover.
 
FAB: solid purple fill, background-colored icon/text.
 
### Inputs
Dark background (`#191A21`), single-pixel border, cyan focus ring. No rounded shadow — minimal and clean. Placeholder text in muted color.
 
### Progress bars
Thin (5px height), full-width track in `#44475A`, fill color matches goal status:
- On track (>60%): Green
- Getting there (30-60%): Purple
- Early stage (<30%): Orange
### Bottom navigation
At the bottom of the app layout, below scrollable content. Keep the last content
items clear of the navigation and include device safe-area spacing. Purple
indicator bar (3px, 32px wide) under active tab. Icons + label below.
 
### Badges
Small pill-shaped labels for asset types, allocation status. Color-coded: green (positive), red (negative), orange (warning), purple (info/neutral).
 
### Streak badge
Purple outlined badge, top right of header. Flame emoji + count. E.g. `🔥 7 meses`.
 
### AI advisor card
Purple-tinted background (`rgba(189,147,249,0.06)`), purple border. Used only in AI tab. Contains response text in foreground color with muted section headers.
 
### Dividers
Single pixel, `#44475A`. Used sparingly — only to separate major sections within a card. Never between standalone cards.
 
---
 
## Motion & Interaction
 
Keep motion minimal and functional — this is a data app, not an entertainment product.
 
- **Page transitions**: None (tab switching is instant)
- **Progress bar fill**: `transition: width 0.5s ease` on mount
- **FAB**: No animation — appears/disappears with tab change
- **Card tap**: Subtle border-color change on interactive asset and goal cards.
- **Modal open**: Slide up from bottom, `0.2s ease-out`
- **Modal close**: Slide down, `0.15s ease-in`
- **Streak badge**: Static — no pulsing or animation
- **Loading state**: Animated dots on advisor requests.
---
 
## Voice & Copy
 
**Tone:** Smart, direct, no hand-holding. States facts. Trusts the user.

For financial content, keep the tone friendly and simple. Make it educational,
encourage consistent saving and thoughtful long-term investing, and explain
risks, assumptions, and uncertainty. Never promise returns or imply an
investment is risk-free. Books in `docs/financial-books.md` are reference
pointers only; attribute a claim to a book only when that claim has been
verified.
 
**Language:** Spanish-first. An English toggle is not currently implemented;
do not imply the interface is bilingual until that feature exists.
 
**Rules:**
- No emojis in data contexts — only in empty states, onboarding, and goal names
- No exclamation marks in system messages
- No financial jargon — use plain Spanish
- No pronoun (tutear or usted) — state the fact directly
### Spanish copy patterns

The English examples below are future reference only; the interface currently
supports Spanish only.
 
| Context | Spanish | English |
|---|---|---|
| Empty portfolio | "Sin activos. Agregá uno para comenzar." | "No assets. Add one to get started." |
| Empty goals | "Sin objetivos. ¿Qué estás ahorrando?" | "No goals. What are you saving for?" |
| AI empty | "Agregá tus activos para obtener un análisis." | "Add your assets to get an analysis." |
| Rate error | "No se pudo obtener el tipo de cambio. Ingresalo manualmente." | "Couldn't fetch exchange rate. Enter it manually." |
| AI error | "Error al conectar con el advisor. Intentá de nuevo." | "Couldn't connect to advisor. Try again." |
| Goal projection | "A este ritmo, alcanzás tu objetivo en N meses." | "At this rate, you'll reach your goal in N months." |
| Goal reached | "✅ Objetivo alcanzado." | "✅ Goal reached." |
| No budget set | "Definí tu aporte mensual para ver una proyección." | "Set your monthly budget to see a projection." |
| Streak extended | "Racha extendida. ¡Seguí así." | "Streak extended. Keep it up." |
 
---
 
## Do's and Don'ts
 
**Do:**
- Use purple only for interactive elements and the AI advisor
- Keep every screen to a single primary action
- Show numbers in Latin American format at all times
- Use muted color for anything secondary — never hide it completely
- Keep card borders subtle — they define structure, not decoration
- Use green/red strictly for financial positive/negative outcomes
- Keep the AI advisor framing around "¿Dónde pongo mis ahorros?"
**Don't:**
- Don't use filled buttons outside of FAB and AI CTA
- Don't add shadows — borders are sufficient
- Don't use more than 3 accent colors on a single screen
- Don't animate data — only animate UI transitions
- Don't use emojis in tables, numbers, or system messages
- Don't add charts in v1 — the table is the chart
- Don't show error states in red for anything that isn't a loss or failure
- Don't use all-caps outside of section labels
- Don't mix light and dark surfaces — maintain the Dracula dark hierarchy throughout