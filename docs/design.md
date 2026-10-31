# Design and UX notes

## Product intent
Habito is a simple, privacy-aware personal finance app for people who want to save consistently and invest with a long-term mindset.

The experience is intentionally simple:
- mobile-first
- minimal friction
- one primary goal: understand where to place monthly contributions
- low-risk, steady-growth framing

## Portfolio model
The app supports two main buckets per user:
- Main
- 2050

This split reflects a common long-term planning pattern without making the UI overly complex. Each bucket owns its own assets, goals, and budget state, but goal linking can include assets from both buckets so users keep flexibility when building a plan.

## UX principles
- Keep the interface understandable for non-experts
- Favor clear labels over dense financial terminology
- Use simple actions: add, edit, delete, save
- Keep the bottom navigation easy to tap on mobile
- Maintain consistent spacing and safe-area handling on iPhone

## Current status
- The app is Spanish-first in the UI
- English wording is acceptable for product labels such as portfolio names
- The current implementation uses Supabase-backed user state and local browser persistence for dashboard settings
- The portfolio state is scoped per user and can be restored after login
