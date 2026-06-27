# 🌿 Tillandsia

A shared air-plant care PWA for a 2-person household garden — photos, watering
reminders, and AI photo-recognition that auto-sorts each shot to the right plant.

**Stack:** Next.js (App Router) + TypeScript + Tailwind + Supabase (Auth, Postgres,
Storage, Realtime) → Vercel.

---

## What's in this starter kit

```
supabase/
  migrations/0001_init.sql   ← full schema + RLS (Phase-1 hooks for 2/3 baked in)
  seed.sql                   ← the 4 species care sheets (verified taxonomy)
docs/
  TILLANDSIA-BUILD-SPEC.md   ← single source of truth: locked decisions + UX audit + kickoff
  TILLANDSIA-PHASE-2-3-MAP.md← what Phases 2 & 3 need + gotchas
  TILLANDSIA-PHONE-SETUP.md  ← Supabase/Vercel setup checklist
design-reference/
  prototype.html             ← the working clickable prototype (open in a browser)
  onboarding-and-review.html ← mom onboarding + needs-review tray mock
.env.example
CLAUDE.md                    ← instructions for Claude Code working in THIS repo
KICKOFF.md                   ← paste-ready prompt to generate the app in-repo
```

The **database layer is done and correct** — apply it as step 2 below. The Next.js
app code is generated *in this repo* (where it can be installed, run, and verified)
by following `KICKOFF.md`.

---

## Get it running (desktop)

### 1. Put this in your repo
```bash
# from the unzipped folder
git init && git add . && git commit -m "Tillandsia foundation: schema, seed, spec, design ref"
gh repo create tillandsia --private --source=. --push     # or create on github.com and push
```

### 2. Set up Supabase
1. supabase.com → **New project**.
2. Settings → API → copy `URL`, `anon key`, `service_role key` into `.env.local` (see `.env.example`).
3. SQL Editor → paste & run **`supabase/migrations/0001_init.sql`**, then **`supabase/seed.sql`**.
4. Auth → Providers → enable **Email (magic link)**. Add your Vercel URL to redirect allow-list later.

### 3. Generate the app
Open a Claude Code session in this repo and paste **`KICKOFF.md`**. It scaffolds the
Next.js app against the schema above, then you `npm install && npm run dev`.

### 4. Deploy
Import the repo on **vercel.com**, add the env vars, deploy. Open the `*.vercel.app`
URL on your phone → Share → **Add to Home Screen** (needed for iOS reminders later).

---

## Build order
1. **Phase 1** — auth + Household + invites + species sheets + Field Log + symmetric album + attribution. (Schema already supports it.)
2. **Phase 2** — recognition & auto-sort + needs-review tray; scheduler + Today + Web Push.
3. **Phase 3** — diagnosis wizard + container designer + best-in-class reference photos.

See `docs/TILLANDSIA-BUILD-SPEC.md` for every locked decision.
