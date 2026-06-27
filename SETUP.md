# Tillandsia — Setup & run

Phase 1 app is built (Next.js + Supabase). Three things make it live for Mom.

## 1. Load the database (in Supabase, once)

Supabase → your project → **SQL Editor** → New query. Paste & **Run** each, in order:

1. `supabase/migrations/0001_init.sql`  ← tables + security
2. `supabase/migrations/0002_storage.sql`  ← photo storage bucket + rules
3. `supabase/seed.sql`  ← the 4 species care sheets

## 2. Turn on email sign-in (in Supabase, once)

- **Authentication → Providers → Email**: make sure it's **enabled** (magic link is on by default; you can turn *off* "Confirm password" — there is no password).
- **Authentication → URL Configuration**:
  - **Site URL**: `http://localhost:3000` (for testing now). Change to your Vercel URL after step 3.
  - **Redirect URLs** — add both:
    - `http://localhost:3000/**`
    - `https://YOUR-APP.vercel.app/**` (after deploy)

## 3. Run it

```bash
npm install
npm run dev
```

Open http://localhost:3000 → enter your email → tap the magic link in your inbox →
create the garden → **Settings** to get an invite code for Mom.

## Environment variables

Local values live in `.env.local` (gitignored). For Vercel, add the same two:

| Variable | Where to find it |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase → Settings → API → Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase → Settings → API → anon/publishable key |

`SUPABASE_SERVICE_ROLE_KEY` is **not** needed for Phase 1 — add it before Phase 2.

## Deploy for Mom (Vercel)

1. vercel.com → **Add New → Project** → import `carries1973/tillandsia`.
2. Add the two env vars above → **Deploy**.
3. Copy the `*.vercel.app` URL into Supabase **Site URL** + **Redirect URLs** (step 2).
4. Send Mom the URL. She opens it on her phone → enters her email → taps the link →
   enters the invite code from your Settings → she's in the shared garden.
   On iPhone: **Share → Add to Home Screen** so it opens like an app.

## What works in Phase 1

Magic-link sign-in · shared household + invite codes · 4 species care sheets ·
add plants · **shared photo album** with who-added-what + live updates ·
multi-photo upload (auto-shrinks big iPhone photos, converts HEIC, retries on bad signal).

**Phase 2 (next):** AI auto-sorts each photo to the right plant + watering reminders.
