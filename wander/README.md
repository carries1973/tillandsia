# Wander — Montréal

A calm, premium, hyper-personalized **trip-itinerary PWA**, built from the
`design_handoff_wander_travel_app` reference. It turns a research-verified travel
plan into a live app: anchors-first scheduling, ranked swappable options with
evidence, celiac-safe dining verification, weather adaptation, a running budget,
an optional-ideas pool, a contingency matrix, and radical transparency (sources,
verified-on dates, uncertainty flags).

This is a faithful port of the HTML design prototype into a real
**Next.js (App Router) + TypeScript + Tailwind** app. The in-house DC templating
runtime from the prototype was **not** ported — only the design and behavior.

## Stack

- **Next.js 15** (App Router) + **React 19** + **TypeScript**
- **Tailwind CSS** (design tokens) with the prototype's exact inline styles
  carried over via a small `css()` string-to-style helper
- Client-side state persisted to **`localStorage`** (key `wander-mtl-v1`),
  matching the prototype's contract
- No backend required — it runs entirely in the browser as a PWA

## Screens

Bottom-tab shell (Trip · Explore · Map · Plan) plus two full-screen overlays
(place detail, swap sheet):

- **Trip / Home** — hero, trip stats, celiac assurance, next-up, browse-by-interest,
  signature moments, day-by-day
- **Day** — weather toggle (default⇄alt), signature-moment banner, weather-adaptive
  banner with one-tap swap, and the stop timeline with transit connectors
- **Place detail** — rationale, dietary safety, reviews, hours/price, getting-here
  (transit + walk + Uber), safe backup, uncertainty flags, reserve, verification footer
- **Swap sheet** — ranked alternatives; picking one updates the itinerary everywhere
- **Explore** — live search + category filter + saved-only toggle
- **Map** — stylized routed SVG map (placeholder, per handoff) + per-stop list
- **Plan** — budget with running totals, reservations, optional ideas, contingency
  matrix, transit reference, celiac promise, bookings & packing checklists

## Live vs. static

- **Live:** the "days away" countdown computes from today's date; all swap /
  save / reserve / checklist / shortlist state is interactive and persisted;
  Directions and Uber links are real deep links chained per leg.
- **Static demo values (as in the prototype):** weather labels and transit/taxi
  costs are the itinerary's verified-as-of-Jul-1-2026 figures — wire these to a
  weather + transit/rideshare API for real-time values.

## Assets

Photography uses Unsplash CDN hotlinks with a `picsum.photos` fallback — **not
licensed for production**; replace with licensed or real venue photography (the
subject→image-id mapping lives in `lib/trip.ts`). Icons are inline SVG.

## Develop

```bash
npm install
npm run dev        # http://localhost:3000
npm run typecheck  # tsc --noEmit
npm run build      # production build
```

## Data

The whole app is driven by a single trip object in `lib/trip.ts` (ported from the
prototype's `build()`). In production, feed it the "travel-agent" JSON schema —
`trip`, `places[]`, `anchors[]`, `days[].segments[]`, `option_sets[]`,
`optional_ideas[]`, `contingencies[]`, `transport_notes`, `pre_trip_actions`,
`packing_list` — and back the persisted user state with the account/trip record
instead of `localStorage`.
