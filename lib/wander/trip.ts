// The single trip object that drives the whole app. Ported verbatim from the
// prototype's build() method. In production this would be fetched/parsed from
// the "travel-agent" JSON schema; here it is the same one trip's worth of data.

import { uimg } from "./geo";

export type DietLevel = "none" | "safe" | "caution";
export interface Diet {
  level: DietLevel;
  label?: string;
}
export interface Rating {
  value: number;
}
export interface Place {
  name: string;
  catLabel: string;
  cat: string;
  neigh: string;
  img: string;
  seed: string;
  diet: Diet;
  dietLabel: string;
  dietNote: string;
  rating: Rating | null;
  ratingLabel: string;
  why: string;
  review: string;
  hours: string;
  price: string;
  match: string;
  tradeoff: string;
  lat: number | null;
  lng: number | null;
  web: string;
  menu: string;
  book: string;
  source: string;
  verifiedOn: string;
  uncertainty: string;
}
export interface Transit {
  label: string;
}
export interface OptionMeta {
  need: string;
  notes: string;
}
export interface Segment {
  id: string;
  time: string;
  isAnchor?: boolean;
  anchorLabel?: string;
  transit?: Transit;
  leaveBy?: string;
  optionMeta?: OptionMeta;
  options: Place[];
}
export interface Weather {
  cond: string;
  label: string;
}
export interface Contingency {
  text: string;
  segId?: string;
  optIdx?: number;
  applyLabel?: string;
}
export interface Wow {
  title: string;
  sub: string;
  blurb: string;
  key: string;
}
export interface Day {
  id: string;
  weekday: string;
  dayNum: string;
  month: string;
  dateLong: string;
  hero: string;
  title: string;
  walk: string;
  cost: string;
  weather: { def: Weather; alt: Weather };
  contingency: Contingency | null;
  wow: Wow;
  segments: Segment[];
}
export interface PrepAction {
  id: string;
  task: string;
  lead: string;
}
export interface PackItem {
  id: string;
  text: string;
}
export interface PackGroup {
  group: string;
  items: PackItem[];
}
export interface Prep {
  note: string;
  actions: PrepAction[];
  packing: PackGroup[];
}
export interface BudgetRow {
  cat: string;
  label: string;
  amount: number;
}
export interface Budget {
  note: string;
  rows: BudgetRow[];
}
export interface OptionalIdea {
  name: string;
  cat: string;
  neigh: string;
  why: string;
  weather: string;
  img: string;
  seed: string;
  lat: number;
  lng: number;
}
export interface ContingencyRow {
  trigger: string;
  icon: string;
  text: string;
}
export interface TransitRow {
  mode: string;
  detail: string;
}
export interface TransitInfo {
  verified: string;
  rows: TransitRow[];
}
export interface TripModel {
  days: Day[];
  prep: Prep;
  budget: Budget;
  optionalIdeas: OptionalIdea[];
  contingencies: ContingencyRow[];
  transitInfo: TransitInfo;
}

// Derived UI maps (sensory, outdoor, per-meal backup) — same as the prototype.
export const SENS: Record<string, string> = {
  FIREWORKS: "Loud · big crowds",
  CONCERT: "Loud · big crowds",
  FESTIVAL: "Lively · crowded",
  MARKET: "Busy · lively",
  MUSEUM: "Calm · quiet",
  GARDEN: "Calm · quiet",
  "CAFÉ · PHOTO": "Cozy · can get busy",
  WALK: "Relaxed pace",
  DINNER: "Sit-down · your pace",
  BREAKFAST: "Quiet mornings",
  LUNCH: "Casual",
  "GF TREAT": "Quick stop",
  NEIGHBOURHOOD: "Low-key · local",
  SHOPPING: "Lively · browse at your pace",
  INDOOR: "Calm · indoor",
  FLIGHT: "Transit",
  "YOUR BASE": "Calm base",
};
export const OUT: Record<string, number> = {
  WALK: 1,
  MARKET: 1,
  FESTIVAL: 1,
  GARDEN: 1,
  FIREWORKS: 1,
  NEIGHBOURHOOD: 1,
  SHOPPING: 1,
};
export const BK: Record<string, string> = {
  "d1-din": "La Bolo à Lolo — dedicated GF",
  "d2-bf": "Sarrasin Boulangerie — dedicated GF",
  "d3-crepe": "La Bolo à Lolo — dedicated GF",
  "d3-treat": "Le Marquis — dedicated GF",
  "d4-lunch": "Arepera du Plateau — dedicated GF",
};

const IMG: Record<string, string> = {
  arrivalHero: "1519178614-68673b201f36",
  oldport: "1513622470522-26c3c8a854bc",
  fireworks: "1498931299472-f7a63a5a1cfa",
  hotel: "1566073771259-6a8506099945",
  airport: "1436491865332-7a61a109cc05",
  latin: "1504674900247-0877df9cc836",
  croissant: "1555507036-ab1f4038808a",
  bread: "1509440159596-0249088772ff",
  gallery: "1518998053901-5348d3961a04",
  cafeGrand: "1554118811-1e0d58224f24",
  cafeCute: "1607604276583-eef5d076aa5f",
  cafeTable: "1445116572660-236099ec97a0",
  concert: "1470229722913-7c0e2dbbafd3",
  pasta: "1551183053-bf91a1d81141",
  penne: "1621996346565-e3dbc646d9a9",
  skyline: "1541447271487-09612b3f49f7",
  market: "1488459716781-31db52582fe9",
  crepe: "1519676867240-f03562e64548",
  festival: "1533174072545-7a4b6ad7a6c3",
  alley: "1533050487297-09b450131914",
  curry: "1604908176997-125f25cc6f3d",
  pavilion: "1503640538573-148065ba4904",
  forest: "1523712999610-f77fbcfc3843",
  cafeNeon: "1501339847302-ac426a4a7cbb",
};

// Wow-card image id, resolved by wow.key (matches the prototype mapping).
export function wowImgId(key: string): string {
  return key === "crepe"
    ? "1519676867240-f03562e64548"
    : key === "concert"
    ? "1470229722913-7c0e2dbbafd3"
    : key === "fireworks"
    ? "1498931299472-f7a63a5a1cfa"
    : "1503640538573-148065ba4904";
}

type PlaceExtras = Partial<Omit<Place, "name" | "catLabel" | "cat" | "neigh" | "img" | "seed" | "dietLabel" | "ratingLabel">> & {
  diet?: Diet;
  rating?: Rating | null;
};

function P(
  name: string,
  catLabel: string,
  cat: string,
  neigh: string,
  imgKey: string,
  x: PlaceExtras = {}
): Place {
  return {
    name,
    catLabel,
    cat,
    neigh,
    img: uimg(IMG[imgKey]),
    seed: imgKey,
    diet: x.diet || { level: "none" },
    dietLabel: (x.diet && x.diet.label) || "",
    dietNote: x.dietNote || "",
    rating: x.rating || null,
    ratingLabel: x.rating ? x.rating.value.toFixed(1) : "",
    why: x.why || "",
    review: x.review || "",
    hours: x.hours || "",
    price: x.price || "",
    match: x.match || "",
    tradeoff: x.tradeoff || "",
    lat: x.lat != null ? x.lat : null,
    lng: x.lng != null ? x.lng : null,
    web: x.web || "",
    menu: x.menu || "",
    book: x.book || "",
    source: x.source || "",
    verifiedOn: x.verifiedOn || "Jul 1, 2026",
    uncertainty: x.uncertainty || "",
  };
}

function buildDays(): Day[] {
  return [
    {
      id: "aug6",
      weekday: "Thursday",
      dayNum: "06",
      month: "AUG",
      dateLong: "August 6",
      hero: IMG.arrivalHero,
      title: "Land, settle into the east end, and close the night under fireworks.",
      walk: "2.1 km",
      cost: "≈ $60",
      weather: { def: { cond: "clear", label: "Clear 27°" }, alt: { cond: "cloud", label: "Cloud 23°" } },
      contingency: null,
      wow: {
        title: "Fireworks over the river",
        sub: "Free from the Jacques-Cartier Bridge",
        blurb:
          "Closing night of L’International des Feux — free from the pedestrianized bridge, minutes from the Old Port.",
        key: "fireworks",
      },
      segments: [
        {
          id: "d1-arr",
          time: "1:55 PM",
          isAnchor: true,
          anchorLabel: "ARRIVAL",
          transit: { label: "747 bus → Green line east · ≈75 min" },
          options: [
            P("Land at YUL", "FLIGHT", "Anchors", "Montréal-Trudeau", "airport", {
              hours: "Lands 1:55 PM · domestic, no customs",
              why: "A domestic arrival from Calgary means no customs — the afternoon is timed backward from the moment you land. The 747 to Berri-UQAM then the Green line home, or a curb-to-hotel car in ≈35 min.",
              lat: 45.4706,
              lng: -73.7408,
            }),
          ],
        },
        {
          id: "d1-hotel",
          time: "4:00 PM",
          isAnchor: true,
          anchorLabel: "CHECK-IN",
          transit: { label: "Green → Orange to the Old Port · ≈35 min" },
          leaveBy: "5:15 PM",
          options: [
            P("Auberge Royal Versailles", "YOUR BASE", "Anchors", "Mercier-Est", "hotel", {
              hours: "Check-in from 3:00 PM",
              why: "Your east-end base sits right on the Green line, far from downtown — so the whole trip runs hub-and-spoke: one clean ride in each morning, one clean ride back each night.",
              lat: 45.5762,
              lng: -73.549,
              web: "https://royalversailles.com",
              book: "https://royalversailles.com",
            }),
          ],
        },
        {
          id: "d1-din",
          time: "6:15 PM",
          transit: { label: "Metro + walk to the water · ≈20 min" },
          options: [
            P("Arepera du Plateau", "DINNER", "Dining", "Plateau", "latin", {
              diet: { level: "safe", label: "Dedicated GF" },
              rating: { value: 4.6 },
              match: "Celiac-safe first night",
              hours: "Dinner from 5:00 PM",
              price: "$$",
              why: "A 100% gluten-free kitchen — the safest possible first-night table. Venezuelan arepas and plantains, no cross-contamination questions while you’re still finding your feet.",
              review: "Celiac reviewers trust it completely; casual, warm and genuinely good.",
              lat: 45.517,
              lng: -73.576,
              menu: "https://www.google.com/search?q=Arepera+du+Plateau+Montreal+menu",
            }),
          ],
        },
        {
          id: "d1-port",
          time: "8:00 PM",
          transit: { label: "Walk the quays riverside · 5 min" },
          options: [
            P("Old Port evening stroll", "WALK", "Outdoors", "Vieux-Port", "oldport", {
              diet: { level: "caution", label: "Festival — don’t eat" },
              match: "Aesthetic · your pick",
              price: "Free",
              why: "The Streetfood Festival here is ambiance, not dinner — shared stalls aren’t celiac-safe. Walk it for the river light and the clock tower, then find your fireworks spot.",
              dietNote:
                "The festival’s shared fryers and stalls are not safe for celiac disease. Treat it as scenery you stroll past — dinner is already done, safely.",
              lat: 45.5075,
              lng: -73.546,
              web: "https://www.oldportofmontreal.com/",
            }),
          ],
        },
        {
          id: "d1-fw",
          time: "10:00 PM",
          isAnchor: true,
          anchorLabel: "FINALE",
          transit: { label: "Green last train ≈12:35 AM · or car ≈$30" },
          leaveBy: "10:45 PM",
          options: [
            P("Fireworks over the river", "FIREWORKS", "Outdoors", "Jacques-Cartier Bridge", "fireworks", {
              match: "Nature & views",
              hours: "10:00 PM · ≈30 min · rain or shine",
              price: "Free",
              why: "A free, spectacular finale minutes from the Old Port — best from the pedestrianized bridge, where the deck itself lights up with the show. Optional and late on a travel day, easy to skip if you’re wiped.",
              lat: 45.518,
              lng: -73.541,
              web: "https://www.sixflags.com/laronde/events/linternational-des-feux",
            }),
          ],
        },
      ],
    },

    {
      id: "aug7",
      weekday: "Friday",
      dayNum: "07",
      month: "AUG",
      dateLong: "August 7",
      hero: IMG.skyline,
      title: "A downtown day of art and aesthetic cafés, timed to the concert of the trip.",
      walk: "3.2 km",
      cost: "≈ $95",
      weather: { def: { cond: "clear", label: "Warm 28°" }, alt: { cond: "rain", label: "Showers 24°" } },
      contingency: {
        text: "Rain today? You’re already indoor-heavy — museum then arena. Take the metro, not the 12-minute walk, over to the Bell Centre.",
      },
      wow: {
        title: "Olivia Dean, live",
        sub: "The anchor of the whole trip",
        blurb: "The Art of Loving Live, with Baby Rose — doors at 7, and you’ll be inside with room to spare.",
        key: "concert",
      },
      segments: [
        {
          id: "d2-bf",
          time: "8:45 AM",
          transit: { label: "Green line downtown · ≈15 min" },
          options: [
            P("Le Marquis", "BREAKFAST", "Dining", "Old Montréal", "croissant", {
              diet: { level: "safe", label: "100% GF bakery" },
              rating: { value: 4.6 },
              match: "Gluten-free",
              price: "$",
              why: "Tops every celiac list in the city. Fuel up here, then buy extras to carry as safe snacks for the east-end mornings where nothing dedicated is close.",
              review: "Legal Nomads’ #1 GF pick — a dedicated bakery a celiac can eat through, top to bottom.",
              lat: 45.503,
              lng: -73.554,
              menu: "https://www.google.com/search?q=Le+Marquis+sans+gluten+Montreal",
            }),
          ],
        },
        {
          id: "d2-mmfa",
          time: "10:00 AM",
          transit: { label: "Walk downtown, GF lunch en route · ≈15 min" },
          options: [
            P("Musée des beaux-arts", "MUSEUM", "Art & Culture", "Golden Square Mile", "gallery", {
              rating: { value: 4.6 },
              match: "Art · your pick",
              hours: "Open 10:00–17:00 (summer Mondays too)",
              price: "Free under 25",
              why: "Anchors the day with art — a soft-preference bullseye — and it’s free for the 22-year-old. A calm, air-conditioned start before a very big night.",
              review: "Praised for a strong permanent collection and rotating shows; large enough to warrant a couple of hours.",
              lat: 45.4985,
              lng: -73.5793,
              web: "https://www.mbam.qc.ca/en/",
              book: "https://www.mbam.qc.ca/en/tickets/",
            }),
          ],
        },
        {
          id: "d2-cafe",
          time: "2:00 PM",
          transit: { label: "Walk · ≈12 min" },
          optionMeta: {
            need: "Aesthetic café stop",
            notes:
              "All three are coffee-and-photos only for celiac — drinks and pictures, never a meal. Pick by the room you want on camera.",
          },
          options: [
            P("Crew Collective & Café", "CAFÉ · PHOTO", "Cafés", "Old Montréal", "cafeGrand", {
              diet: { level: "caution", label: "Coffee & photos only" },
              rating: { value: 4.5 },
              match: "Aesthetic · your pick",
              why: "The showstopper room for the camera — a cathedral-like 1930s bank hall, one of the world’s most beautiful cafés. Coffee and photos only; it isn’t a dedicated-GF kitchen.",
              review: "Reviewers adore the vaulted hall; busy with a co-working crowd.",
              dietNote: "Not a dedicated gluten-free kitchen. Order a coffee, take the photos, eat elsewhere.",
              tradeoff: "The showstopper room — a 1930s bank hall.",
              lat: 45.5015,
              lng: -73.5588,
              web: "https://crewcollectivecafe.com/",
            }),
            P("Café Capybara", "CAFÉ · PHOTO", "Cafés", "Downtown", "cafeCute", {
              diet: { level: "caution", label: "Drinks & photos only" },
              rating: { value: 4.4 },
              match: "TikTok-viral",
              why: "The most playful, most “age-22” pick — matcha, plushies and Korean drinks. Treat it strictly as a drink-and-photo stop.",
              dietNote: "Not dedicated GF — a matcha-and-photos stop, not a meal.",
              tradeoff: "TikTok-viral and playful — best for the feed.",
              lat: 45.4905,
              lng: -73.581,
            }),
            P("Le Petit Dep", "CAFÉ · PHOTO", "Cafés", "Old Montréal", "cafeTable", {
              diet: { level: "caution", label: "Photo & coffee only" },
              rating: { value: 4.5 },
              match: "Aesthetic",
              why: "A quick, iconic aqua-green façade photo with a coffee in hand on the way through Old Montréal.",
              dietNote: "Not dedicated GF — a façade photo and a coffee.",
              tradeoff: "A fast, iconic façade shot.",
              lat: 45.5075,
              lng: -73.5525,
            }),
          ],
        },
        {
          id: "d2-din",
          time: "5:30 PM",
          transit: { label: "Walk to the Bell Centre · ≈12 min" },
          leaveBy: "6:40 PM",
          optionMeta: {
            need: "Pre-show dinner near the Bell Centre",
            notes:
              "No dedicated-GF kitchen sits at the arena. The safe play is a dedicated-GF main earlier, then something light nearby — or brief a celiac-friendly kitchen carefully.",
          },
          options: [
            P("Pre-show light bite", "DINNER", "Dining", "Griffintown", "cafeTable", {
              diet: { level: "caution", label: "Keep light — eat GF earlier" },
              match: "Concert timing",
              price: "$$",
              hours: "Reserve ≈5:30 PM",
              why: "The lowest-risk concert-night plan: get your real gluten-free meal in earlier, keep this small and close, and be at the doors by 6:45 with zero stress.",
              dietNote:
                "No arena-adjacent kitchen is dedicated GF. Eat your main meal at a dedicated spot earlier; keep this light and confirm precautions on arrival.",
              tradeoff: "Safest — pairs with a dedicated-GF main earlier.",
              lat: 45.495,
              lng: -73.562,
            }),
            P("Nora Gray", "DINNER", "Dining", "Griffintown", "pasta", {
              diet: { level: "caution", label: "Accommodating — brief kitchen" },
              rating: { value: 4.6 },
              match: "Walkable to venue",
              price: "$$$",
              hours: "Reserve",
              why: "If you want a real sit-down dinner near the venue, this is it — acclaimed Southern Italian, not a dedicated kitchen but celiac-accommodating, and a symptomatic celiac reported no reaction. Brief them clearly.",
              review: "Named among Canada’s best; the food, wine list and service draw raves.",
              dietNote: "Shared kitchen — not dedicated GF. Flag celiac clearly and confirm precautions before ordering.",
              tradeoff: "Best sit-down experience — brief the kitchen.",
              lat: 45.493,
              lng: -73.571,
              web: "https://noragray.com/",
              book: "https://noragray.com/",
            }),
            P("La Bolo à Lolo", "DINNER", "Dining", "Plateau", "penne", {
              diet: { level: "safe", label: "Dedicated & certified GF" },
              rating: { value: 5.0 },
              match: "Safest GF",
              price: "$–$$",
              hours: "Casual / takeout-style",
              why: "The safest-feeling table in the city — the owner is celiac and nothing risky is on the premises — and cheap. But it’s up in the Plateau, so you’d eat earlier and head down.",
              review: "Universally loved; handles no gluten, nuts, shellfish or pork.",
              tradeoff: "Fully dedicated & safest — but it’s in the Plateau.",
              lat: 45.527,
              lng: -73.585,
              web: "https://laboloalolo.com/",
            }),
          ],
        },
        {
          id: "d2-show",
          time: "7:00 PM",
          isAnchor: true,
          anchorLabel: "THE ANCHOR",
          transit: { label: "Walk to Peel → Green line home ≈30 min · or car ≈$38" },
          options: [
            P("Olivia Dean", "CONCERT", "Art & Culture", "Bell Centre", "concert", {
              match: "The concert",
              hours: "Doors 7:00 · show 8:00 PM",
              price: "Ticket held",
              why: "The reason for the whole trip. Everything today is engineered to land you here relaxed, safely fed and early, then get you home on the Green line or a quick car after.",
              lat: 45.4965,
              lng: -73.5694,
              web: "https://evenko.ca/en/events/bell-centre/olivia-dean",
              book: "https://evenko.ca/",
            }),
          ],
        },
      ],
    },

    {
      id: "aug8",
      weekday: "Saturday",
      dayNum: "08",
      month: "AUG",
      dateLong: "August 8",
      hero: IMG.market,
      title: "One unhurried north-central loop: market, festival, murals, Plateau.",
      walk: "6.0 km",
      cost: "≈ $70",
      weather: { def: { cond: "clear", label: "Clear 26°" }, alt: { cond: "rain", label: "Rain 21°" } },
      contingency: {
        text: "Rain moving in. Swap the afternoon for the indoor Biodôme — five ecosystems, a few Green-line stops from your base.",
        segId: "d3-mile",
        optIdx: 2,
        applyLabel: "Swap to the Biodôme",
      },
      wow: {
        title: "A crêpe you can actually eat",
        sub: "Dedicated GF, inside the market",
        blurb:
          "A dedicated gluten-free crêperie tucked inside Jean-Talon Market — buckwheat, its own cooking area, no second-guessing.",
        key: "crepe",
      },
      segments: [
        {
          id: "d3-mkt",
          time: "9:45 AM",
          transit: { label: "Green → Orange to Jean-Talon · ≈40 min" },
          options: [
            P("Marché Jean-Talon", "MARKET", "Markets", "Little Italy", "market", {
              diet: { level: "caution", label: "Produce safe · GF crêperie inside" },
              rating: { value: 4.6 },
              match: "Markets · your pick",
              hours: "Open 8:00–18:00",
              price: "Free to browse",
              why: "A markets soft-preference bullseye and the hub of the day. Browsing is free, and there’s a dedicated-GF crêperie right inside for a safe lunch.",
              review: "One of North America’s great public markets — liveliest in summer with outdoor vendors.",
              lat: 45.5365,
              lng: -73.6146,
              web: "https://www.marchespublics-mtl.com/en/markets/jean-talon-market",
            }),
          ],
        },
        {
          id: "d3-crepe",
          time: "11:30 AM",
          transit: { label: "Walk into ItalfestMTL · 8 min" },
          options: [
            P("Crêperie du Marché", "LUNCH", "Dining", "inside the market", "crepe", {
              diet: { level: "safe", label: "Dedicated GF facility" },
              rating: { value: 4.5 },
              match: "Gluten-free",
              price: "$",
              why: "A dedicated-GF crêperie with its own cooking area, right inside the market. No detour, no risk — just a proper buckwheat crêpe the celiac traveller can actually order.",
              review: "Celiac reviewers note a separate cooking area and crêpes they trust.",
              lat: 45.5358,
              lng: -73.6138,
            }),
          ],
        },
        {
          id: "d3-ital",
          time: "12:30 PM",
          transit: { label: "Walk / short metro to Mile End · ≈15 min" },
          options: [
            P("ItalfestMTL", "FESTIVAL", "Markets", "Little Italy", "festival", {
              diet: { level: "caution", label: "Street festival — caution" },
              match: "Culture",
              price: "Free",
              why: "Free, and folds into the market cluster with no detour — music, colour and crowds along Saint-Laurent.",
              dietNote: "Street-vendor food isn’t celiac-safe — enjoy the atmosphere, not the stalls.",
              lat: 45.534,
              lng: -73.614,
            }),
          ],
        },
        {
          id: "d3-mile",
          time: "2:00 PM",
          transit: { label: "Walk, GF bakery en route" },
          optionMeta: {
            need: "Saturday afternoon — shopping vs. murals vs. rain backup",
            notes:
              "Lead with the vintage-and-boutique haul along the Plateau/Mile End strip; swap in the open-air Mile End murals, or the indoor Biodôme if the weather turns.",
          },
          options: [
            P("Plateau & Mile End vintage haul", "SHOPPING", "Shopping", "Plateau / Mile End", "oldport", {
              match: "Curated vintage · her pick",
              price: "Free to browse",
              why: "The Saint-Denis / Mont-Royal / Saint-Laurent strip is the city’s best for curated independent vintage, Y2K and deadstock — very walkable and a natural mother-daughter afternoon. Hit Eva B for a huge, TikTok-famous haul (go early, it’s overwhelming), Citizen Vintage for cleaner edited quality, Annex Vintage for local makers, and Empire Exchange to trade — then drift down Saint-Denis toward Duluth for one-off shops.",
              review: "The highest concentration of vintage & secondhand in the city; Eva B can overwhelm, Citizen Vintage is pricier but quality-controlled.",
              tradeoff: "Curated vintage haul — walkable Plateau/Mile End strip.",
              lat: 45.5245,
              lng: -73.5836,
            }),
            P("Mile End murals", "WALK", "Outdoors", "Mile End", "alley", {
              match: "Offbeat · your pick",
              why: "Offbeat and photogenic — murals, ivy-draped doors and green alleys, self-guided, on the way between the market and dinner. Free, and a soft-preference bullseye.",
              dietNote: "The 24-hour bagel ovens are photogenic, but the bagels aren’t celiac-safe — a photo, not a snack.",
              tradeoff: "Open-air, offbeat and photogenic.",
              lat: 45.523,
              lng: -73.601,
            }),
            P("Montréal Biodôme", "INDOOR", "Outdoors", "Olympic District", "forest", {
              rating: { value: 4.5 },
              match: "Rain backup · near base",
              price: "Paid entry",
              why: "The rain-and-heat backup: five ecosystems under one roof, indoor and near home. Swap it in if the sky turns on the open-air walk.",
              tradeoff: "Indoor rain/heat backup, near your base.",
              uncertainty: "Verify hours & admission at espacepourlavie.ca before you go.",
              source: "espacepourlavie.ca",
              lat: 45.5595,
              lng: -73.5497,
              web: "https://espacepourlavie.ca/en",
            }),
          ],
        },
        {
          id: "d3-treat",
          time: "4:30 PM",
          transit: { label: "Walk / metro to Mont-Royal E · ≈15 min" },
          options: [
            P("Sarrasin Boulangerie", "GF TREAT", "Dining", "Mile End", "bread", {
              diet: { level: "safe", label: "100% GF bakery" },
              rating: { value: 4.6 },
              match: "Gluten-free",
              price: "$",
              why: "A dedicated-GF treat mid-wander — and another chance to stock portable, safe food for the ride back east.",
              lat: 45.523,
              lng: -73.6015,
            }),
          ],
        },
        {
          id: "d3-din",
          time: "6:30 PM",
          transit: { label: "Orange → Green home ≈40 min · or car ≈$32" },
          optionMeta: {
            need: "Saturday gluten-free dinner",
            notes: "All three are dedicated gluten-free — ranked by experience versus maximum safety.",
          },
          options: [
            P("Satu Lagi", "DINNER", "Dining", "Plateau", "curry", {
              diet: { level: "caution", label: "Dedicated GF · confirm prep" },
              rating: { value: 4.5 },
              match: "Best experience",
              price: "$$",
              hours: "Reserve",
              why: "A dedicated-GF Indo-Malay kitchen and genuinely excellent — standout satay and rendang on a lively strip. Given a Feb 2026 reaction report, confirm cross-contamination precautions on arrival.",
              review: "Celebrated for satay, fried oyster mushrooms and pandan crème brûlée; knocks are close, loud seating.",
              dietNote:
                "Dedicated GF, but a symptomatic reaction was reported in Feb 2026 despite assurances — confirm precautions, or choose La Bolo à Lolo for maximum peace of mind.",
              tradeoff: "Best experience — but confirm prep on arrival.",
              lat: 45.534,
              lng: -73.576,
              web: "https://www.satulagi.ca/",
              book: "https://www.opentable.ca/restaurant/profile/1278034",
            }),
            P("La Bolo à Lolo", "DINNER", "Dining", "Plateau", "penne", {
              diet: { level: "safe", label: "Dedicated & certified GF" },
              rating: { value: 5.0 },
              match: "Safest GF",
              price: "$–$$",
              why: "The safest-feeling pick in the city and the cheapest — celiac owner, nothing risky on site, casual and warm. Trade a lively room for total peace of mind.",
              tradeoff: "Safest-feeling and cheapest — casual.",
              lat: 45.527,
              lng: -73.585,
              web: "https://laboloalolo.com/",
            }),
            P("Arepera du Plateau", "DINNER", "Dining", "Plateau", "latin", {
              diet: { level: "safe", label: "Dedicated GF" },
              rating: { value: 4.6 },
              match: "Simple & safe",
              price: "$$",
              why: "A dedicated-GF sit-down with a simpler menu — an easy, safe fallback if you’d rather keep the night low-key.",
              tradeoff: "Dedicated, relaxed, a simpler menu.",
              lat: 45.517,
              lng: -73.576,
            }),
          ],
        },
      ],
    },

    {
      id: "aug9",
      weekday: "Sunday",
      dayNum: "09",
      month: "AUG",
      dateLong: "August 9",
      hero: IMG.forest,
      title: "A gentle near-base morning, a last safe lunch, then a clean run to the airport.",
      walk: "3.0 km",
      cost: "≈ $110",
      weather: { def: { cond: "clear", label: "Sunny 29°" }, alt: { cond: "cloud", label: "Humid 33°" } },
      contingency: {
        text: "Humid and 33° forecast. You’re already on the flat, shaded Botanical Garden — skip any Mount Royal climb and keep water close.",
      },
      wow: {
        title: "Stillness before the flight",
        sub: "The Japanese Garden",
        blurb: "Raked gravel, a tea pavilion and calm at the Botanical Garden — a few stops from your base.",
        key: "pavilion",
      },
      segments: [
        {
          id: "d4-bg",
          time: "10:00 AM",
          transit: { label: "Green line / walk · near your base" },
          optionMeta: {
            need: "Sunday near-hotel morning",
            notes: "All a few Green stops from the hotel — pick by weather and energy before the flight.",
          },
          options: [
            P("Jardin botanique", "GARDEN", "Outdoors", "Space for Life", "pavilion", {
              rating: { value: 4.7 },
              match: "Nature & views",
              hours: "Opens 9:00",
              price: "Paid entry",
              why: "Beautiful, photogenic and close to home — 20+ themed gardens including the Japanese and Chinese gardens. A low-stress, flat, shaded morning that sets the perfect final tone before the airport run.",
              review: "Regularly called one of the world’s great gardens; reviewers love the calm.",
              tradeoff: "Most beautiful — flat and shaded if it’s hot.",
              uncertainty: "Verify seasonal hours & admission at espacepourlavie.ca before you go.",
              source: "espacepourlavie.ca",
              lat: 45.5598,
              lng: -73.5636,
              web: "https://espacepourlavie.ca/en",
              book: "https://espacepourlavie.ca/en",
            }),
            P("Montréal Biodôme", "INDOOR", "Outdoors", "Space for Life", "forest", {
              rating: { value: 4.5 },
              match: "All-weather",
              price: "Paid entry",
              why: "Five ecosystems under one roof, indoor and near the hotel — the pick if the morning opens grey or wet.",
              tradeoff: "Indoor — best if it rains.",
              uncertainty: "Verify hours & admission at espacepourlavie.ca before you go.",
              source: "espacepourlavie.ca",
              lat: 45.5595,
              lng: -73.5497,
              web: "https://espacepourlavie.ca/en",
            }),
            P("Promenade Ontario", "NEIGHBOURHOOD", "Outdoors", "Hochelaga", "cafeNeon", {
              match: "Local life",
              price: "Free",
              why: "Free, low-key and closest to base — edgy cafés, street art and local life along Rue Ontario. The stroll-don’t-pay option.",
              tradeoff: "Free and closest to base.",
              lat: 45.5442,
              lng: -73.5432,
            }),
          ],
        },
        {
          id: "d4-lunch",
          time: "12:45 PM",
          transit: { label: "Metro back east for the bags · ≈30 min" },
          options: [
            P("La Bolo à Lolo", "LUNCH", "Dining", "Plateau", "penne", {
              diet: { level: "safe", label: "Dedicated & certified GF" },
              rating: { value: 5.0 },
              match: "Safest GF",
              price: "$–$$",
              why: "End on the safest, warmest GF meal of the trip — celiac owner, nothing risky on the premises, and easy on the wallet before travel.",
              review: "Universally loved; low prices and real hospitality.",
              lat: 45.527,
              lng: -73.585,
              web: "https://laboloalolo.com/",
            }),
          ],
        },
        {
          id: "d4-bags",
          time: "2:00 PM",
          transit: { label: "Near your base · check out is 11 AM" },
          options: [
            P("Stash the bags", "LUGGAGE", "Logistics", "Mercier-Est / east end", "hotel", {
              match: "Between check-out & the 7:45 flight",
              price: "≈ $6–8 / bag",
              hours: "Check out by 11 AM · collect by ≈4:45 PM",
              why: "Check out in the morning and go hands-free until the airport car. Easiest: ask the Auberge front desk to hold the bags (often free for guests). Otherwise book a Bounce spot — the most consistent reviews — near a Green-line metro; LuggageHero works too but is hit-or-miss. Collect by ≈4:45 PM for the 5:15 car.",
              tradeoff: "Front-desk hold is simplest; Bounce is the paid backup.",
              lat: 45.5762,
              lng: -73.549,
            }),
          ],
        },
        {
          id: "d4-prom",
          time: "2:45 PM",
          optionMeta: {
            need: "Sunday afternoon — calm near base, or catch Pride downtown",
            notes:
              "Default is a low-key near-hotel afternoon so you stay close to the bags and out of the parade crush. Swap in the Nacarat terrace only if catching Pride matters more than a calm run to the airport.",
          },
          transit: { label: "Walk · collect the bags by ≈4:45 PM" },
          options: [
            P("Promenade Ontario", "NEIGHBOURHOOD", "Outdoors", "Hochelaga", "cafeNeon", {
              match: "Calm · near base",
              price: "Free",
              why: "A relaxed near-hotel afternoon that keeps you close to the bags and well out of the downtown Pride-parade closures before the flight — the low-stress default.",
              tradeoff: "Calmest, closest to the bags — no downtown crush.",
              lat: 45.5442,
              lng: -73.5432,
            }),
            P("Nacarat Terrace — Pride view", "EVENT", "Trending", "Downtown (Fairmont QE)", "skyline", {
              match: "Catch Pride before the flight",
              price: "Ticketed · book ahead",
              hours: "Parade view from noon · book ahead",
              why: "The 3rd-floor terrace at Fairmont The Queen Elizabeth (900 René-Lévesque O.) with a direct parade view from noon. A table only comes with the seated “Pride BBQ” format — the standard terrace ticket is access-only, so decide which you’re booking. Wheelchair-accessible, and it moves indoors if it rains.",
              dietNote:
                "The Pride BBQ isn’t celiac-safe — eat your dedicated-GF lunch first and treat this as the view.",
              tradeoff:
                "Front-row Pride — but a downtown commitment that gives up the calm morning and tightens the airport run.",
              uncertainty:
                "Confirm which ticket you want (access-only vs seated BBQ table) and the date/time at the venue before booking.",
              lat: 45.4996,
              lng: -73.5685,
            }),
          ],
        },
        {
          id: "d4-dep",
          time: "5:15 PM",
          isAnchor: true,
          anchorLabel: "DEPARTURE",
          transit: { label: "Direct car to YUL · ≈40 min · ≈$70" },
          options: [
            P("Fly out of YUL", "FLIGHT", "Anchors", "Montréal-Trudeau", "airport", {
              hours: "Depart 7:45 PM · be at YUL by 6:15",
              why: "Montréal Pride’s parade runs Sun Aug 9 from 1 PM along René-Lévesque (St-Mathieu → Sanguinet), roughly 1–4 PM — closing the 747 airport-bus route. A direct car from the east end sidesteps all of it and gets you to YUL with buffer.",
              lat: 45.4706,
              lng: -73.7408,
            }),
          ],
        },
      ],
    },
  ];
}

const prep: Prep = {
  note: "Every meal on this trip resolves to a dedicated or verified gluten-free kitchen, with a named backup for each. Aesthetic cafés are coffee-and-photos only — never a meal.",
  actions: [
    { id: "a1", task: "Validate the 3-day STM transit pass", lead: "On arrival · Aug 7" },
    { id: "a2", task: "Reserve Satu Lagi — and confirm celiac cross-contamination prep", lead: "2 weeks out" },
    { id: "a3", task: "Book Musée des beaux-arts entry (free under 25)", lead: "1 week out" },
    { id: "a4", task: "Pre-book a direct airport car for Aug 9 to dodge the Pride parade", lead: "3 days out" },
    { id: "a5", task: "Print French celiac dining cards for every kitchen", lead: "1 week out" },
  ],
  packing: [
    {
      group: "CELIAC ESSENTIALS",
      items: [
        { id: "p1", text: "French celiac dining cards" },
        { id: "p2", text: "GF snacks from Le Marquis for east-end mornings" },
        { id: "p3", text: "A zip pouch for carried bakery food" },
      ],
    },
    {
      group: "AUGUST IN MONTRÉAL",
      items: [
        { id: "p4", text: "Light, breathable layers (humid 27–33°)" },
        { id: "p5", text: "A layer for the river breeze at the fireworks" },
        { id: "p6", text: "Comfortable walking shoes — 6 km market day" },
        { id: "p7", text: "A packable rain shell / compact umbrella" },
      ],
    },
    {
      group: "HOLD ONTO",
      items: [
        { id: "p8", text: "Olivia Dean tickets (Aug 7, doors 7 PM)" },
        { id: "p9", text: "Museum + Botanical Garden passes" },
        { id: "p10", text: "STM transit pass" },
        { id: "p11", text: "A portable battery for photo-heavy days" },
      ],
    },
  ],
};

const budget: Budget = {
  note: "For two travellers · 4 days · concert tickets excluded (already held).",
  rows: [
    { cat: "Transport", label: "747 airport passes — arrival", amount: 23 },
    { cat: "Transport", label: "3-day STM transit passes ×2", amount: 44 },
    { cat: "Transport", label: "Rideshare — concert night home", amount: 38 },
    { cat: "Transport", label: "Direct car to airport — Sunday", amount: 70 },
    { cat: "Food", label: "Thu — Arepera dinner", amount: 35 },
    { cat: "Food", label: "Fri — bakery, café & pre-show bite", amount: 85 },
    { cat: "Food", label: "Sat — market lunch, treat & dinner", amount: 80 },
    { cat: "Food", label: "Sun — dedicated-GF lunch", amount: 35 },
    { cat: "Activities", label: "Musée des beaux-arts — 1 adult (under-25 free)", amount: 31 },
    { cat: "Activities", label: "Botanical Garden ×2", amount: 44 },
    { cat: "Activities", label: "Fireworks · market · murals · festival", amount: 0 },
  ],
};

const optionalIdeas: OptionalIdea[] = [
  // ---------- MUST-SEE ----------
  {
    name: "Notre-Dame Basilica",
    cat: "Must-see",
    neigh: "Old Montréal",
    why: "The city’s jaw-dropping landmark — a vaulted deep-blue-and-gold interior lit like a night sky. Go by day, or book the AURA light-and-sound show at night. Modest dress; buy timed tickets.",
    weather: "Indoor",
    img: uimg(IMG.gallery),
    seed: "opt-notredame",
    lat: 45.5046,
    lng: -73.5566,
  },
  {
    name: "Old Montréal & Place Jacques-Cartier",
    cat: "Must-see",
    neigh: "Old Montréal",
    why: "Cobblestone streets, buskers and old-world façades — the postcard heart of the city, steps from the Old Port and easy to fold into the Thursday evening.",
    weather: "Clear",
    img: uimg(IMG.oldport),
    seed: "opt-oldmtl",
    lat: 45.5075,
    lng: -73.5527,
  },
  {
    name: "St. Joseph’s Oratory",
    cat: "Must-see",
    neigh: "Côte-des-Neiges",
    why: "Canada’s largest church, crowning Mount Royal with a huge dome and sweeping city views — grand and unexpectedly calm.",
    weather: "Any",
    img: uimg(IMG.pavilion),
    seed: "opt-oratory",
    lat: 45.4923,
    lng: -73.6176,
  },
  {
    name: "Kondiaronk Belvedere",
    cat: "Must-see",
    neigh: "Mount Royal",
    why: "The classic skyline lookout from the mountain chalet, best near sunset. It’s uphill — skip in extreme heat, but the view is the money shot.",
    weather: "Clear",
    img: uimg(IMG.skyline),
    seed: "opt-kond",
    lat: 45.504,
    lng: -73.587,
  },
  {
    name: "La Grande Roue de Montréal",
    cat: "Must-see",
    neigh: "Old Port",
    why: "A 60 m observation wheel over the river — climate-controlled cabins and the best all-in-one view of the old city; pairs beautifully with the Thursday Old Port evening.",
    weather: "Any",
    img: uimg(IMG.oldport),
    seed: "opt-roue",
    lat: 45.5088,
    lng: -73.546,
  },

  // ---------- SHOPPING ----------
  {
    name: "Sainte-Catherine St & the Underground City",
    cat: "Shopping",
    neigh: "Downtown",
    why: "The main shopping spine — Simons, the Eaton Centre, The Bay and Holt Renfrew Ogilvy — linked by 33 km of climate-controlled RÉSO tunnels. The move on a hot or rainy afternoon.",
    weather: "Indoor",
    img: uimg(IMG.skyline),
    seed: "opt-stcath",
    lat: 45.504,
    lng: -73.5693,
  },
  {
    name: "Marché Bonsecours boutiques",
    cat: "Shopping",
    neigh: "Old Montréal",
    why: "A silver-domed heritage market full of Québec designers, artisan jewellery and local labels — browse-and-buy with none of the mall.",
    weather: "Indoor",
    img: uimg(IMG.oldport),
    seed: "opt-bonsecours",
    lat: 45.5085,
    lng: -73.5516,
  },
  {
    name: "Rue Saint-Paul boutiques",
    cat: "Shopping",
    neigh: "Old Montréal",
    why: "The prettiest street in the old city — galleries, independent labels and gift shops for a slow mother-daughter browse between the cobblestones.",
    weather: "Clear",
    img: uimg(IMG.alley),
    seed: "opt-stpaul",
    lat: 45.506,
    lng: -73.553,
  },

  // ---------- TRENDING / COOL ----------
  {
    name: "Wellington Street, Verdun",
    cat: "Trending",
    neigh: "Verdun",
    why: "Named one of the coolest streets in the world — indie cafés, vintage racks and a laid-back local vibe well off the tourist track. A great half-day for the 22-year-old’s feed.",
    weather: "Clear",
    img: uimg(IMG.cafeNeon),
    seed: "opt-wellington",
    lat: 45.462,
    lng: -73.571,
  },
  {
    name: "Time Out Market Montréal",
    cat: "Trending",
    neigh: "Downtown · Eaton Centre",
    why: "A buzzy food hall of the city’s big-name chefs under one roof — go for the scene, drinks and people-watching.",
    weather: "Indoor",
    img: uimg(IMG.market),
    seed: "opt-timeout",
    lat: 45.5019,
    lng: -73.5699,
  },
  {
    name: "Terrasse Nelligan rooftop",
    cat: "Trending",
    neigh: "Old Montréal",
    why: "A rooftop terrace over the old-city rooftops — a sunset drink, the river in the distance and an easy golden-hour photo.",
    weather: "Clear",
    img: uimg(IMG.skyline),
    seed: "opt-nelligan",
    lat: 45.5065,
    lng: -73.554,
  },
  {
    name: "Nacarat Terrace — Pride view",
    cat: "Trending",
    neigh: "Downtown · Fairmont QE",
    why: "For Aug 9: the 3rd-floor terrace at Fairmont The Queen Elizabeth (900 René-Lévesque O.), with a direct parade view from noon. A table comes only with the seated “Pride BBQ” format — the standard terrace ticket is access-only, so book the one you want. Wheelchair-accessible; moves indoors if it rains. A downtown commitment that trades the calm morning for the front row.",
    weather: "Any",
    img: uimg(IMG.skyline),
    seed: "opt-nacarat",
    lat: 45.4996,
    lng: -73.5685,
  },

  // ---------- HIDDEN GEMS ----------
  {
    name: "Boulevard Saint-Laurent (“The Main”)",
    cat: "Hidden gem",
    neigh: "Plateau",
    why: "The city’s legendary dividing line — murals, record shops, late-night energy and the whole vintage cluster in one long, atmospheric walk.",
    weather: "Clear",
    img: uimg(IMG.alley),
    seed: "opt-main",
    lat: 45.516,
    lng: -73.573,
  },
  {
    name: "Atwater Market & the Lachine Canal",
    cat: "Hidden gem",
    neigh: "Saint-Henri",
    why: "A beautiful Art-Deco market hall with a canal-side path to stroll or bike — quieter and prettier than the tourist core, with produce you can safely graze.",
    weather: "Clear",
    img: uimg(IMG.market),
    seed: "opt-atwater",
    lat: 45.4795,
    lng: -73.576,
  },
  {
    name: "Parc Jean-Drapeau & the Biosphère",
    cat: "Hidden gem",
    neigh: "Île Sainte-Hélène",
    why: "An island of riverside paths and the striking geodesic-dome museum, one quick metro hop away — the best skyline-from-the-water view in the city.",
    weather: "Clear",
    img: uimg(IMG.forest),
    seed: "opt-jeandrapeau",
    lat: 45.514,
    lng: -73.533,
  },
  {
    name: "Parc La Fontaine",
    cat: "Hidden gem",
    neigh: "Plateau",
    why: "Flat, shaded green space with a pond and locals sprawled out — a gentle, low-energy pocket to slot into any hot afternoon.",
    weather: "Any",
    img: uimg(IMG.forest),
    seed: "opt-lafontaine",
    lat: 45.527,
    lng: -73.5695,
  },

  // ---------- SELF-CARE ----------
  {
    name: "Bota Bota, spa-sur-l’eau",
    cat: "Self-care",
    neigh: "Old Port",
    why: "A floating Nordic spa on a moored boat — a hot-cold water circuit and river views. The perfect mother-daughter reset; reserve ahead.",
    weather: "Any",
    img: uimg(IMG.pavilion),
    seed: "opt-bota",
    lat: 45.4986,
    lng: -73.5527,
  },
];

const contingencies: ContingencyRow[] = [
  {
    trigger: "Rain · Friday",
    icon: "rain",
    text: "Concert day is already indoor-heavy — extend the museum and take the metro (not the 12-min walk) to the Bell Centre.",
  },
  {
    trigger: "Rain · Saturday",
    icon: "rain",
    text: "The market is partly covered; swap the open-air Mile End wander for the indoor Biodôme near your base.",
  },
  {
    trigger: "Heat · Sunday",
    icon: "heat",
    text: "August humidity — favour the flat, shaded Botanical Garden over any Mount Royal climb, and keep water close.",
  },
  {
    trigger: "Tired · Thursday",
    icon: "moon",
    text: "Long travel day — the 10 PM fireworks are optional; the Old Port stroll alone is enough of an evening.",
  },
  {
    trigger: "Closure",
    icon: "lock",
    text: "Notre-Dame closes 16:30 on weekdays — do the exterior and Place d’Armes, and slot the interior into a morning.",
  },
  {
    trigger: "Pride parade · Sunday",
    icon: "flag",
    text: "Montréal Pride runs Sun Aug 9 from 1 PM along René-Lévesque (St-Mathieu → Sanguinet), roughly 1–4 PM — closing the 747 airport-bus route. Take a direct car from the east end to YUL instead. Want to catch it first? The Nacarat terrace at Fairmont QE has parade views from noon (see Optional ideas).",
  },
];

const transitInfo: TransitInfo = {
  verified: "Fares verified Jul 1, 2026 — confirm current prices at stm.info.",
  rows: [
    {
      mode: "STM metro & bus",
      detail:
        "Single fare $3.75 · 24-hour pass ≈ $11.50 · 3-day pass ≈ $22 — validate the 3-day on Aug 7 as your backbone from the east end.",
    },
    {
      mode: "747 airport bus",
      detail:
        "$11.25 (buys a 24-h pass): YUL → Berri-UQAM, then the Green line east to Radisson. ≈ 75–90 min, ≈ $22.50 for two.",
    },
    {
      mode: "Last metros",
      detail:
        "Green line ends ≈ 12:35 AM Sun–Thu and ≈ 1:30 AM Fri/Sat. “Nuit” night buses run after that.",
    },
    {
      mode: "Taxi",
      detail:
        "Meter $4.10 base + $2.05/km. Airport↔downtown is a flat $49.45 (day) / $56.70 (11 PM–5 AM); metered out to the east-end hotel runs ≈ $65–80.",
    },
    {
      mode: "Uber / Lyft",
      detail:
        "Worth it for two legs: the concert-night return (Bell Centre → hotel ≈ $35–40, ≈ 20 min) and the Aug 9 airport run (≈ $65–80, ≈ 40 min) to dodge the Pride parade.",
    },
    {
      mode: "Luggage storage",
      detail:
        "Between check-out and the evening flight, store bags with Bounce (most consistent reviews) or ask your hotel to hold them for a fee; LuggageHero works but can be hit-or-miss.",
    },
  ],
};

export const MODEL: TripModel = {
  days: buildDays(),
  prep,
  budget,
  optionalIdeas,
  contingencies,
  transitInfo,
};
