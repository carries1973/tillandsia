# KICKOFF — paste this into a Claude Code session opened in THIS repo

> You are building **Tillandsia**, a shared air-plant care PWA. This repo already
> contains the source of truth: `docs/TILLANDSIA-BUILD-SPEC.md` (locked decisions +
> UX audit), `docs/TILLANDSIA-PHASE-2-3-MAP.md`, the finished database in
> `supabase/migrations/0001_init.sql` + `supabase/seed.sql`, and the exact target
> look in `design-reference/prototype.html`. Read CLAUDE.md and the spec first.
>
> Stack: Next.js (App Router) + TypeScript + Tailwind + Supabase (Auth, Postgres,
> Storage, Realtime), deploy Vercel. Do NOT redefine the DB — match the migration.
>
> Build **Phase 0 + Phase 1** now:
> 1. Scaffold the Next.js app (`npx create-next-app@latest . --ts --tailwind --app
>    --eslint --src-dir=false`) without clobbering existing files; add `@supabase/ssr`
>    + `@supabase/supabase-js`. Wire Tailwind tokens to the prototype's design system
>    (Bricolage Grotesque + Plus Jakarta Sans, fresh-green palette, care-group hues).
> 2. PWA shell: `manifest.webmanifest` + a service worker (caches care-sheet content
>    + shell). Icons + theme-color #3f7d52.
> 3. Supabase clients (browser + server via `@supabase/ssr`) + `middleware.ts` for
>    session refresh. Read env from `.env.local` (see `.env.example`).
> 4. **Magic-link auth**: `/login` (email → magic link), `/auth/callback` route to
>    exchange the code, protected app routes.
> 5. **Household + invites + mom-first onboarding**: create household → invite by
>    email/code → "this is yours & [name]'s shared garden" → add first plant. Gentle,
>    skippable iOS "Add to Home Screen for reminders" tip.
> 6. **Species care sheets** read from the `species` table (already seeded) — hero,
>    at-a-glance vitals, full sections, sources, botanical header (binomial + authority
>    + native range + max size).
> 7. **Field Log**: specimens → observations (with the measurement fields) → photos;
>    cover photo per specimen; provisional-ID badge until confident.
> 8. **Symmetrical shared album** (uniform grid, not masonry) with Supabase Realtime
>    and **per-photo attribution** (avatar + name + relative time, resolved per-viewer;
>    All / Mom / Me / Blooms filters).
> 9. **Photo-upload pipeline**: multi-photo queue, client-side downscale, HEIC→JPEG,
>    optimistic UI + retry, never lose a photo. Store width/height + uploaded_by.
> 10. **States + a11y everywhere**: loading skeletons, empty CTAs, error/offline
>     banner; aria-labels on all icons/images, ≥44px targets, focus rings.
>
> Match `design-reference/prototype.html` for look + the tap-to-expand detail pattern.
> Keep all secrets in env vars. Verify with `npx tsc --noEmit`, `npm run dev`, and the
> browser. Open a PR — don't merge.
>
> After Phase 1: Phase 2 = recognition & auto-sort (Claude Sonnet vision) + needs-review
> tray + scheduler/Today + Web Push (per spec §14b/§14c — the schema hooks are already in place).
