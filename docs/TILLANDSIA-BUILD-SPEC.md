# 🌿 Tillandsia — Consolidated Build Spec & Kickoff

> One source of truth. Hand this (plus the original `airplant-app-build-spec.md`)
> to your Claude Code session. It captures every decision we've locked, the UX
> audit, and a paste-ready kickoff prompt at the end.

---

## 1. Locked decisions
- **Stack:** Next.js (App Router) + TypeScript + Tailwind + Supabase (Auth, Postgres, Storage, Realtime), deploy on Vercel.
- **Auth:** magic-link email only (simplest for Mom). No passwords.
- **Sharing:** one shared **Household** (you + Mom). All data scoped to it.
- **Privacy:** private household only — no public signups at launch.
- **Domain:** `*.vercel.app` to start.
- **Container images:** openly-licensed / original first; AI mockups later.
- **Build where:** a **fresh `tillandsia` repo** (NOT the GHL agent repo).

## 2. Visual language (carry from prototype)
- Fonts: **Bricolage Grotesque** (display) + **Plus Jakarta Sans** (body).
- Palette: fresh-green primary, warm off-white canvas, pastel care-group accents
  (bulbous = gold, rosette = blue, xeric = violet, wispy = terracotta).
- Soft rounded photo cards (≈26px), gentle shadows, photo-led.
- **Album = symmetrical uniform GRID, not staggered masonry.** Equal-width cards,
  equal photo heights, rows aligned top & bottom. (Symmetry is a hard preference.)
- Respect `prefers-reduced-motion`.

## 3. Photo attribution (Phase 1, automatic)
- Each member signs in with their own magic-link → distinct profile (name + avatar).
- Every photo/observation stamps `uploaded_by` / `created_by` = signed-in user.
- Album card shows attribution chip: avatar + name + relative time ("👩 Mom · 2d").
- "You/Mom" resolves **per-viewer** (per session), never hardcoded.
- Filters: All · 👩 Mom · 🙋 Me · 💧 Due · 🌸 Blooms.

## 4. Photo recognition & auto-sort (CORE feature)
On every upload:
1. Stamp `uploaded_by`.
2. Run a vision model (Claude vision or equivalent) comparing the new photo to each
   specimen's reference/cover photos in the household.
3. Return ranked candidates + confidence → branch:
   - **High (>90%)** → auto-file, show "Sorted into X ✓ · undo".
   - **Medium** → top 2–3 specimen chips for one-tap confirm.
   - **Low / none** → offer "＋ New plant".
4. Each confirm/correction is saved as another reference image → matches improve (active learning).

**Rules (from the audit — non-negotiable):**
- Never block the upload on recognition; photo saves immediately, sorting resolves async.
- **Below-threshold photos go to a "Needs review" tray** — never silently guessed-and-hidden.
- A visible **"N photos need confirm"** badge so corrections don't pile up invisibly.
- **Undo/re-sort always reachable** from the photo itself, not just a 5s toast.
- Same-species air plants WILL be ambiguous → expect "ask" to be common; tune threshold deliberately.
- Surface confidence honestly ("looks like Fuzzy purple — confirm?").

Data: add `photos.suggested_specimen_id`, `photos.match_confidence`, `photos.review_status`
('sorted' | 'needs_review' | 'unsorted'); reuse `reference_images` as the per-specimen training set.

## 5. Onboarding (mom-first — make-or-break)
- Invite: tap link → enter email → tap magic link → in. Zero jargon, no password.
- First run = short: "This is yours & Carrie's shared garden" → "Add your first photo."
- iOS "Add to Home Screen for reminders" prompt is **gentle & skippable** — never gate the app on it.
- Reassurance copy throughout ("No password to remember", "link keeps your garden private").

## 6. Photo-upload pipeline (the #1 action — get it right)
- **Multi-photo** upload with a queue + per-item progress.
- **Client-side downscale** before upload (responsive thumbnails; no base64 bloat).
- **HEIC → JPEG/WebP** conversion (iPhone default format).
- **Offline / flaky:** optimistic "uploading…", auto-retry, never lose a photo.

## 7. Required states (networked app, not a file)
- **Loading** → skeleton cards.
- **Empty** → guided CTA per screen ("No plants yet — add your first 🌱").
- **Error / offline** → banner + retry + "changes will sync."
- **Realtime** → new photo animates in + polite "Mom added a photo" (a11y live-region announce).

## 8. Care scheduler / Today (retention engine)
- Default `care_tasks` per species cadence, Calgary-adjusted (more misting Nov–Feb).
- **One-tap "mark watered"** (writes an observation) + **bulk** ("water all 3 bulbous").
- Distinguish task types (mist vs dunk vs soak vs fertilize).
- **Snooze / "did it already."**
- Honest overdue, **never guilt/shame** (ADHD-kind), re-engagement not punishment.
- Notifications: Web Push where supported; **in-app Today badge + calendar export** as honest fallback (esp. iOS pre-install).

## 9. Accessibility (WCAG 2.1 AA)
- Every emoji-icon + image gets `alt` / `aria-label` (a screen reader must not say "onion").
- Contrast ≥4.5:1 body / ≥3:1 large — verify white-on-light-gradient captions.
- Touch targets ≥44px (hearts, chips, nav).
- Full keyboard support + visible focus rings; dialog focus-trap + ESC.

## 10. ADHD design principles (core requirement)
- One obvious **next action** per screen — Home always answers "what now."
- **Undo everywhere.** Smart defaults > configuration (confirm beats configure).
- Chunked, tap-to-expand depth — never a wall of text.
- Gentle positive reinforcement (streaks/progress), never nagging.
- Visual calm & **symmetry**.

## 11. Settings
- Units cm/in · water-type reminder (RO for Calgary hard water) · quiet hours · per-user push opt-in.

## 12. Trust & data integrity
- Soft-delete + undo for plants/photos (two people share — don't hard-wipe what the other values).
- Last-write-wins on concurrent edits for v1, but say so; don't silently lose Mom's edit.
- Either member can **export** the shared garden (mirror the prototype import).

## 13. Lightweight analytics (household-only, privacy-respecting)
- Recognition confirm-vs-correct rate · reminder action rate · drop-off points.

## 14. Roadmap order
1. **Phase 0/1:** scaffold + data model + RLS + magic-link auth + Household + invites + species sheets (4) + Field Log + **symmetric album** + **attribution** + states.
2. **Phase 2:** recognition & auto-sort + needs-review tray + upload pipeline; scheduler + Today + reminders.
3. **Phase 3:** diagnosis wizard + size→container designer + best-in-class reference photos.
4. **Phase 4:** onboarding polish, offline queue, "Style my plant" AI mockups, settings/quiet hours.

> Note: recognition was promoted from a Phase-3 stretch to a **core Phase-2 feature** per the owner.

## 14b. Phase 2/3 LOCKED decisions
- **Recognition engine:** LLM-vision compare with **Claude Sonnet vision** (new photo + up to ~6 candidate
  reference thumbnails → "which specimen + confidence"). **No embeddings, no pgvector.** Escalate to Opus only if accuracy is insufficient.
- **Background jobs:** **Vercel** (Next.js route handlers + Vercel Cron) for BOTH the async recognition job and the reminder cron. (Not Supabase Edge Functions.)
- **Reminders:** **per-user opt-in** + **per-household quiet hours** (default 21:00–08:00 `America/Edmonton`). One vision/cron platform.
- **Container images:** **licensed/original first**; "Style my plant" AI mockups are a **Phase-4 stretch** behind the rule-engine's safe set.
- **Recognition cost:** call **only on upload**, ≤6 reference thumbnails per call; **~$5/mo soft cap** with an alert. Never re-scan the library.

## 14c. Bake into Phase 1 NOW (so no schema refactor later)
1. **Measurements on every observation** (`bulb_cm, longest_leaf_cm, span_cm, height_cm`) — the container designer needs size *history*.
2. **`photos` recognition columns** (`suggested_specimen_id, match_confidence, review_status`) — even though Phase 1 doesn't use them.
3. **`reference_images` table** (storage_path/url, source, author, license, attribution, approved, kind) — shared by recognition, container examples, best-in-class photos.
4. **Cover photo + good thumbnails per specimen** — recognition compares against these.
5. **PWA shell + service worker in Phase 0** — Web Push is impossible to add without it.
6. **Per-user timezone** (`America/Edmonton`) + **settings** (quiet hours, units cm/in, push opt-in).
7. **Background-job mechanism wired = Vercel** (per 14b) so 2A/2B have somewhere to run.
8. **Shared image pipeline** (client downscale → thumbnail + full; HEIC→JPEG) reused by album, refs, recognition.

---

## 15. Paste-ready kickoff prompt

> Build "Tillandsia," a shared air-plant care PWA. Read the attached
> `airplant-app-build-spec.md` AND `TILLANDSIA-BUILD-SPEC.md` (this file) — the
> latter has the locked decisions and overrides where they differ.
>
> Stack: Next.js App Router + TypeScript + Tailwind + Supabase (Auth, Postgres,
> Storage, Realtime), deploy Vercel.
>
> Locked: magic-link auth only; Supabase; private household; `*.vercel.app`;
> **album is a symmetrical uniform grid, not masonry**; carry the prototype's
> design language (Bricolage Grotesque + Plus Jakarta Sans, fresh-green palette,
> rounded photo cards).
>
> Phase 0 + 1 now:
> 1. Scaffold Next + Tailwind + PWA shell (manifest + service worker).
> 2. All SQL as /supabase migrations + RLS for the §4 data model. RLS = users
>    access rows whose household_id is in their memberships. **Include the §14c
>    Phase-1 hooks now** so Phase 2/3 need no schema refactor: measurement columns
>    on observations (bulb_cm, longest_leaf_cm, span_cm, height_cm);
>    photos.suggested_specimen_id + match_confidence + review_status; the
>    reference_images table (source/author/license/attribution/approved/kind);
>    per-user timezone + a settings store (quiet hours, units, push opt-in).
> 3. Magic-link auth + Household + email/code invites + **mom-first onboarding**
>    (invite → magic link → "shared garden" → add first photo; gentle, skippable
>    iOS install tip).
> 4. Seed the 4 species sheets with verified taxonomy + authority (§9 of the spec).
> 5. Field Log (specimens → observations → photos, cover photo, provisional badge).
> 6. **Symmetrical** shared album with realtime + **per-photo attribution**
>    (avatar + name + time, per-viewer; Mom/Me filters).
> 7. Required states everywhere: loading skeletons, empty CTAs, error/offline banner.
> 8. Accessibility: aria-labels on all emoji-icons/images, ≥44px targets, focus rings.
>
> Build the **photo-upload pipeline** properly: multi-photo queue, client-side
> downscale, HEIC→JPEG, optimistic + retry, never lose a photo.
>
> Put ALL secrets behind env vars. Create/extend SETUP.md with the exact phone
> steps (Supabase project, SQL to paste, env vars). Open a PR — don't merge.
>
> Then Phase 2 = recognition & auto-sort + needs-review tray + scheduler/reminders.
