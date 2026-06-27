# Tillandsia — Claude Code instructions

## Project
A shared air-plant care **PWA**. Frontend + backend in one Next.js app.
Stack: **Next.js (App Router) + TypeScript + Tailwind + Supabase** (Auth, Postgres,
Storage, Realtime), deployed on **Vercel**. This IS a frontend project — dev server,
PWA, and browser verification all apply.

## Source of truth
`docs/TILLANDSIA-BUILD-SPEC.md` holds every locked decision. Read it before building.
`docs/TILLANDSIA-PHASE-2-3-MAP.md` covers later phases. The database is defined in
`supabase/migrations/0001_init.sql` (+ `seed.sql`) — match the app to that schema; do
not redefine tables.

## Locked decisions (do not re-litigate)
- Auth: **magic-link email only**.
- Data/auth/storage/realtime: **Supabase**.
- Album layout: **symmetrical uniform grid, NOT masonry** (owner preference).
- Recognition (Phase 2): **Claude Sonnet vision** compare (no embeddings/pgvector).
- Background jobs + cron: **Vercel** route handlers + Vercel Cron.
- Reminders: **per-user opt-in** + **per-household quiet hours** (21:00–08:00 America/Edmonton).
- Container images: licensed/original first; AI mockups later.
- Private household only — no public signups.

## Design language
Bricolage Grotesque (display) + Plus Jakarta Sans (body); fresh-green palette; warm
off-white canvas; soft rounded photo cards. Care-group accent hues: bulbous=gold,
rosette=blue, xeric=violet, wispy=terracotta. See `design-reference/prototype.html`
for the exact look and the tap-to-expand detail pattern — match it.

## Hard requirements
- **Horticultural accuracy** (spec §9): the mesic/xeric classification and the
  "bulbous = never long-soak / dry fast / airflow" rules are load-bearing — every
  feature (scheduler, diagnosis, container designer) must respect them.
- **Accessibility** WCAG AA: aria-labels on every icon/image, ≥44px targets, focus
  rings, keyboard support, verified contrast.
- **States**: loading skeletons, empty CTAs, error/offline banners everywhere.
- **Never block a photo upload on the network** — optimistic + retry.

## How to verify
- Types: `npx tsc --noEmit`
- Dev: `npm run dev`
- Build: `npm run build`
- Use the browser/preview to confirm UI changes (this is a real frontend app).

## Working style
Present a short plan → build → verify in the browser. Keep secrets in env vars only.
