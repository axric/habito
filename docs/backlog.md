# Habito — Backlog

**Status snapshot:** October 2026  
**Source:** Older backlog reconciled with the current repository.

This list contains future possibilities, not approved commitments. The old
phase checklist incorrectly showed several shipped features as pending and
named a Claude/Anthropic integration that is not used by the current app.
Approved or active work belongs in [todo.md](./todo.md).

## Implemented

- Supabase schema, authentication, Vercel hosting, and API routes.
- Per-user dashboard state synchronization with Supabase.
- Portfolio assets and financial objectives can be created, edited, and
  deleted.
- Portfolio allocation, monthly contribution planning, streak display, and
  three dashboard tabs (Portafolio, Objetivos, Advisor IA).
- AI portfolio analysis and follow-up questions through OpenAI, proxied by
  `/api/advisor`.
- MEP rate lookup from dolarapi.com, with manual editing.
- Shared macro indicator records and read access through Supabase.
- Mobile layout refinements, including navigation that does not cover the last
  portfolio items.

## Possible future work (not yet approved)

These items were carried forward from the previous backlog. Confirm priority
and scope before treating any as planned work.

- Automatically fetch and refresh shared macro indicators from reliable
  providers; currently `macro_data` is seeded and has no scheduled updater.
- Add investment growth projections or historical performance views.
- Add user-configurable market or portfolio notifications.
- Export portfolio data or reports (for example JSON, CSV, or PDF).
- Evaluate installable PWA and offline behavior.
- Consider onboarding templates or an English-language interface.
- Further improve and test the mobile experience across devices.

## Removed or superseded from the old plan

- The old tasks for Supabase setup, login, Vercel deployment, CRUD, and an AI
  integration are complete in the current repository.
- The proposed Anthropic/Claude integration is superseded by the OpenAI-backed
  `/api/advisor` endpoint.
- The old hard-coded sample `fam`/`per` portfolio, static alignment analysis,
  and USD reference-rate bugs refer to an earlier app and are not current
  dashboard items.
- Automated refresh of `macro_data` is not implemented; do not represent
  seeded indicators as automatically current.
