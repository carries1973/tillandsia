# 🌿 Tillandsia — iPhone Build Checklist

Keep this open while you build. Tap each box as you go. Nothing here needs a desktop.

---

## ✅ Step 1 — Create the repo (~2 min)

- [ ] github.com (or GitHub app) → **＋** → **New repository**
- [ ] Name: `tillandsia`
- [ ] Visibility: **Private**
- [ ] ✅ Tick **Add a README** ← important (Claude Code can't start from a truly empty repo)
- [ ] **Create repository**

## ✅ Step 2 — Open a fresh Claude Code session on it

- [ ] Go to **claude.ai/code** (or the Claude app)
- [ ] **New session** → select the **`tillandsia`** repo → branch **`main`**
- [ ] Pick a network policy that **allows outbound network** (it needs npm to install Next.js + Supabase). Avoid the fully locked-down policy — it blocks `npm install`.

## ✅ Step 3 — Paste the kickoff prompt

Paste the block below as your first message. Then attach or paste `airplant-app-build-spec.md` when it asks.

```
Build "Tillandsia," a shared air-plant care PWA from the spec in this
message (I'll paste airplant-app-build-spec.md sections as needed).

Stack: Next.js (App Router) + TypeScript + Tailwind + Supabase
(Auth, Postgres, Storage, Realtime), deploy target Vercel.

Locked decisions:
- Auth: magic-link email only (simplest for my mom).
- Data stack: Supabase (not Vercel-native).
- Domain: *.vercel.app for now.
- Private household only — no public signups at launch.
- Container example images: openly-licensed/original first, AI later.

Do Phase 0 + Phase 1 ONLY:
1. Scaffold Next + Tailwind + PWA shell (manifest + service worker),
   carry the prototype design language (Bricolage Grotesque display,
   Plus Jakarta Sans body, fresh-green palette, soft rounded photo cards).
2. Write all SQL as /supabase migrations + RLS policies for the §4 data
   model (profiles, households, household_members, household_invites,
   species, specimens, observations, photos, care_tasks,
   push_subscriptions, reference_images). RLS = users access rows whose
   household_id is in their memberships.
3. Magic-link auth + Household creation + email/code invites.
4. Seed the 4 species sheets (T. bulbosa, caput-medusae, pruinosa,
   soft-rosette group) with verified taxonomy + authority per §9.
5. Field Log (specimens → observations → photos, cover photo,
   provisional-ID badge) backed by Supabase.
6. Realtime shared photo album.

Put ALL Supabase keys behind env vars. Do NOT hardcode secrets.
Create a SETUP.md listing exactly what I must do from my phone:
the Supabase project, the SQL to paste, and the env vars to set.
Open a PR when done — don't merge.
```

- [ ] Pasted the prompt
- [ ] Pasted / attached the spec when asked
- [ ] Let it run — it will open a **PR** (don't merge yet)

## ✅ Step 4 — Supabase (mobile Safari is fine)

- [ ] **supabase.com** → sign in → **New project**
- [ ] Open **Settings → API**, copy these three:
  - [ ] `NEXT_PUBLIC_SUPABASE_URL`
  - [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - [ ] `SUPABASE_SERVICE_ROLE_KEY`  ← keep this one secret
- [ ] Open **SQL Editor** → paste the migration SQL from the PR → **Run**

## ✅ Step 5 — Deploy (optional — fine to wait for desktop)

- [ ] **vercel.com** → **Import** `tillandsia` from GitHub
- [ ] Paste the 3 env vars above
- [ ] **Deploy** → you get a `*.vercel.app` link
- [ ] On iPhone Safari: open the link → Share → **Add to Home Screen**

---

## 📌 Notes

- **Push reminders are Phase 2** — they need VAPID keys + Vercel Cron + the iOS "install to home screen" step. Phase 0+1 (sharing + album + log) needs none of that, so don't let it block you.
- **Review on your phone:** the PR diff reads fine in the GitHub app; ask that session for tweaks before merging.
- **Repo cleanup later:** once you're at a desktop we can audit what it built, fix anything off, and tidy structure. Nothing is locked in.

## 🔑 Env vars cheat-sheet

| Variable | Where it comes from | Needed for |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase → Settings → API | Phase 0+1 |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase → Settings → API | Phase 0+1 |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase → Settings → API (secret) | Phase 0+1 |
| `VAPID_PUBLIC_KEY` | generate later | Phase 2 (push) |
| `VAPID_PRIVATE_KEY` | generate later | Phase 2 (push) |
| `CRON_SECRET` | you make one up | Phase 2 (cron) |
