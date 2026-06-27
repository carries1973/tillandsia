# 🌿 Tillandsia — Phase 2 & 3 Functionality Map

> Purpose: know what each later phase actually needs **before** building Phase 1,
> so we put the right hooks in early and never refactor the schema. Read the
> "⏪ Bake into Phase 1 now" section first — that's the time-saver.

---

## ⏪ Bake into Phase 1 NOW (avoids painful rework later)
These cost almost nothing in Phase 1 but are expensive to retrofit:

1. **Measurements on every observation** (`bulb_cm, longest_leaf_cm, span_cm, height_cm`).
   The container designer (3B) needs *size history* — if you don't capture it from day 1,
   there's no data when you build the feature. Make the log form ask for them (optional).
2. **`photos` recognition columns** (`suggested_specimen_id, match_confidence, review_status`).
   Add the columns even though Phase 1 doesn't use them — so Phase 2 is a behavior change, not a migration risk.
3. **`reference_images` table** (license/author/attribution/approved). Used by BOTH recognition
   training (2A) and best-in-class photos (3C) and container examples (3B). Build it once, now.
4. **Cover photo per specimen** + good thumbnails. Recognition (2A) compares against these.
5. **PWA shell + service worker** in Phase 0. Web Push (2B) is impossible to add without it.
6. **Store each user's timezone** (Calgary = `America/Edmonton`) + a `settings` area
   (quiet hours, units cm/in, push opt-in). The scheduler/reminders (2B) read these.
7. **Decide your background-job mechanism early** (Supabase Edge Functions or Vercel functions).
   Recognition (async) and reminders (cron) both need server-side jobs.
8. **Shared image pipeline** (client downscale → thumbnail + full). Album, recognition refs,
   and reference photos all reuse it. Build it once.

---

## PHASE 2A — Photo recognition & auto-sort  ⭐ (your headline ask)

**Functionality**
- On upload: stamp `uploaded_by` → run vision match vs the household's specimen reference photos → route by confidence.
- High (>~90%) → auto-file + "Sorted into X ✓ · undo". Medium → confirm chips. Low/none → "＋ New plant".
- **Needs-review tray**: everything below threshold, with a badge count; confirming there saves a new reference image (active-learning loop).
- Always-available re-sort/Move from any photo.

**Data**: `photos.suggested_specimen_id`, `match_confidence`, `review_status` ('sorted'|'needs_review'|'unsorted'); `reference_images` as the per-specimen training set. (Optional scale path: a `photo_embeddings` table with `pgvector`.)

**Two technical approaches — pick one:**
- **A. LLM vision compare (recommended start):** send the new photo + a few candidate reference thumbnails to Claude vision, ask "which specimen, and confidence?" Simple, no vector infra, good reasoning about look-alikes. ~1 call/upload.
- **B. Image embeddings + similarity:** compute a vector per photo (CLIP-style), store in `pgvector`, cosine-match. Cheaper at high volume, faster, but adds infra and is weaker at same-species nuance. Overkill for a 2-person garden — revisit only if volume explodes.

**External deps / env:** vision model API key (Anthropic) ; background job (Edge Function) ; signed storage URLs so the model can read the image.

**Decisions to lock:**
- Confidence thresholds (auto-sort vs confirm vs review).
- Max reference photos compared per call (cost vs accuracy).
- Cost ceiling per month.

**Gotchas (the time-wasters):**
- **Cold start:** a brand-new plant has no reference photos → first photos can't be matched. Flow must gracefully offer "New plant."
- **Same-species look-alikes** (two *pruinosa*) will sit in the ambiguous band a lot — *plan for "confirm" being common*, not rare.
- **Async, not inline:** never block the upload; recognition resolves in a background job and updates the photo. Build the optimistic "uploading… → sorted" UI.
- **Cost & latency** scale with #references per call — cap it.

**Effort:** Medium-High. The UI is done (prototype). The work is the async job + thresholds + the review tray.

---

## PHASE 2B — Care scheduler + Today + reminders

**Functionality**
- Auto-create `care_tasks` per species cadence when a specimen is added (bulbous: mist 3d + monthly dunk; rosette: soak 7d; etc.), **Calgary-adjusted** (more misting Nov–Feb).
- One-tap **Mark watered** → writes an observation + recomputes `next_due_at`. Bulk ("water all bulbous"). Snooze.
- **Today dashboard**: Due / Overdue / Done, household-wide. (Prototype already shows this.)
- **Web Push reminders**: Vercel Cron runs hourly → finds tasks past `next_due_at` → sends push to subscribed devices. Per-household quiet hours, per-user opt-in.
- Honest fallback: in-app due badge + "add to calendar" when push isn't available.

**Data**: `care_tasks` (type, interval_days, season_overrides jsonb, last_done_at, next_due_at, active); `push_subscriptions` (endpoint, p256dh, auth); quiet-hours + opt-in in settings.

**External deps / env:** `VAPID_PUBLIC_KEY`, `VAPID_PRIVATE_KEY`, `CRON_SECRET`; Vercel Cron; service worker (from Phase 0).

**Decisions to lock:**
- Default cadences per care_group + seasonal override rules.
- Quiet hours default; per-user vs per-household opt-in.
- Cron frequency (hourly is fine).

**Gotchas:**
- **iOS Web Push only works for an installed (Add-to-Home-Screen) PWA** (16.4+). Onboarding must prompt install; always keep the in-app badge fallback.
- **Timezone math** — compute due times in `America/Edmonton`, not UTC-naive.
- **Cron idempotency** — mark "notified" so an hourly job never double-sends.
- **Subscription churn** — endpoints expire; handle 410/expired cleanup.

**Effort:** Medium. Scheduling logic + cron + push plumbing. The dashboard UI exists.

---

## PHASE 3A — Diagnosis wizard ("what's wrong with my plant?")

**Functionality**: care-group-aware decision tree → pick plant (pulls care_group) → primary symptom → 1–2 follow-ups → most-likely cause + fix + prevention, branded by group → "log as observation." Includes the alive-vs-rot test.

**Data**: a **static JSON decision tree** keyed by `care_group` in `/content` — *no schema change*. Optional `diagnosis_logs`.

**Tech:** pure content + UI logic. **No AI required** (could add an AI "describe it / photo it" path later).

**Decisions to lock:** author the tree content (symptoms, branches, fixes) — this is the real work, and it must respect the bulbous/mesic rules (§9).

**Gotchas:** content accuracy is the whole game; keep it sourced. Low technical risk.

**Effort:** Low-Medium (mostly content authoring + a clean wizard UI with keyboard/a11y support).

---

## PHASE 3B — Size → container designer  ⭐

**Functionality**: latest measurements + care_group (+ optional aesthetic) → size class (XS–XL) → **safety-filtered** archetype matrix → Pinterest-style **masonry gallery** of safe display ideas, each card: example image, "fits your 18cm pruinosa," why it suits, watering implication, avoid-notes → "skip these for this plant" list.

**Data**: measurements from `observations` (⏪ must be captured from Phase 1); `reference_images` with `kind='container_example'` + license/attribution + approved gate.

**Tech:** a **deterministic rule engine** (`container-recommender` lib) encoding the size table + care-group constraints + archetype matrix. The safety layer (open + removable + airflow + no moss-packing; bulbous never sealed/glued) is non-negotiable code, not content.

**Image sourcing (the real bottleneck):**
- Openly-licensed (Wikimedia/Unsplash/Pexels) with attribution stored, OR original SVG/diagram mockups, OR AI renders. **Never scrape Pinterest.**
- **Stretch — "Style my plant":** feed the specimen's own photo + chosen vibe to an image model (Higgsfield connector) → bespoke mockup. Nice-to-have, gated behind the rule engine's safe set.

**Decisions to lock:** the aesthetics list; image-sourcing approach (licensed first); whether to ship the AI mockup in v1 or later.

**Gotchas:** (1) **No measurements = no feature** — that's why we capture them in Phase 1. (2) Safety rules must override aesthetics, always. (3) Licensing diligence on every example image.

**Effort:** Medium. Rule engine is straightforward; the masonry UI is the album pattern reused; image sourcing/curation is the slow part.

---

## PHASE 3C — Best-in-class reference photos

**Functionality**: each species sheet shows a verified, openly-licensed exemplar (healthy + in bloom) beside the user's own, labelled "what a thriving one looks like."

**Data**: `reference_images` (⏪ same table) with `approved` gate + license/attribution.

**Tech:** curation workflow + an admin "approve" step + visual verification before publish. Sourcing: Wikimedia Commons CC/PD first.

**Decisions to lock:** who approves; attribution display format.

**Gotchas:** license accuracy + attribution are mandatory; verify the plant is actually the right species (bloom is the ID clincher).

**Effort:** Low-Medium (mostly curation, little code — reuses `reference_images`).

---

## 🔢 Recommended build order (least waste)
1. **Phase 1** with all ⏪ hooks baked in (measurements, reference_images, recognition columns, PWA/SW, settings, timezone, image pipeline, background-job choice).
2. **2A recognition** (your headline) — async job + thresholds + review tray.
3. **2B scheduler + reminders** — cadence engine + cron + Web Push (+ iOS install prompt).
4. **3A diagnosis** — content-driven, low risk, quick win.
5. **3B container designer** — rule engine + curated images (needs the Phase-1 measurements).
6. **3C reference photos** — curation, reuses reference_images.
7. **Stretch:** "Style my plant" AI mockups; image-embedding recognition if volume demands.

## 🔑 Decisions to make now (so Phase 1 schema is final)
- Recognition: **LLM-vision compare** (recommended) vs embeddings? → sets whether you need `pgvector`.
- Background jobs: **Supabase Edge Functions** vs Vercel functions? → both 2A and 2B depend on it.
- Reminders: per-user or per-household opt-in + default quiet hours?
- Container images: licensed-first confirmed? AI mockups v1 or later?
- Cost ceiling for vision calls (drives threshold + #references-per-call).

## 💰 New env/services introduced later
- **2A:** Anthropic API key (vision) ; (optional) pgvector extension.
- **2B:** `VAPID_PUBLIC_KEY`, `VAPID_PRIVATE_KEY`, `CRON_SECRET` ; Vercel Cron.
- **3B stretch:** Higgsfield (image gen) credentials.
