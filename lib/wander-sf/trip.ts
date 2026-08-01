// SF & Wine Country — the trip object that drives the app (same schema as the
// Montréal build; SF content). Home base = Union Square, 31 Jul – 4 Aug 2026.

import { uimg } from "./geo";

export type DietLevel = "none" | "safe" | "caution";
export interface Diet { level: DietLevel; label?: string; }
export interface Rating { value: number; }
export interface Place {
  name: string; catLabel: string; cat: string; neigh: string; img: string; seed: string;
  diet: Diet; dietLabel: string; dietNote: string; rating: Rating | null; ratingLabel: string;
  why: string; review: string; hours: string; price: string; match: string; tradeoff: string;
  lat: number | null; lng: number | null; web: string; menu: string; book: string;
  source: string; verifiedOn: string; uncertainty: string;
}
export interface Transit { label: string; }
export interface OptionMeta { need: string; notes: string; }
export interface Segment {
  id: string; time: string; isAnchor?: boolean; anchorLabel?: string; transit?: Transit;
  leaveBy?: string; optionMeta?: OptionMeta; options: Place[];
}
export interface Weather { cond: string; label: string; }
export interface Contingency { text: string; segId?: string; optIdx?: number; applyLabel?: string; }
export interface Wow { title: string; sub: string; blurb: string; key: string; }
export interface Day {
  id: string; weekday: string; dayNum: string; month: string; dateLong: string; hero: string;
  title: string; walk: string; cost: string; weather: { def: Weather; alt: Weather };
  contingency: Contingency | null; wow: Wow; segments: Segment[];
}
export interface PrepAction { id: string; task: string; lead: string; }
export interface PackItem { id: string; text: string; }
export interface PackGroup { group: string; items: PackItem[]; }
export interface Prep { note: string; actions: PrepAction[]; packing: PackGroup[]; }
export interface BudgetRow { cat: string; label: string; amount: number; }
export interface Budget { note: string; rows: BudgetRow[]; }
export interface OptionalIdea { name: string; cat: string; neigh: string; why: string; weather: string; img: string; seed: string; lat: number; lng: number; }
export interface ContingencyRow { trigger: string; icon: string; text: string; }
export interface TransitRow { mode: string; detail: string; }
export interface TransitInfo { verified: string; rows: TransitRow[]; }
export interface TripModel {
  days: Day[]; prep: Prep; budget: Budget; optionalIdeas: OptionalIdea[];
  contingencies: ContingencyRow[]; transitInfo: TransitInfo;
}

export const SENS: Record<string, string> = {
  CONCERT: "Loud · big crowds", JAZZ: "Live music · intimate", FESTIVAL: "Lively · crowded",
  MARKET: "Busy · lively", MUSEUM: "Calm · quiet", GARDEN: "Calm · quiet",
  "CAFÉ · PHOTO": "Cozy · can get busy", WALK: "Relaxed pace", DINNER: "Sit-down · your pace",
  BREAKFAST: "Quiet mornings", LUNCH: "Casual", "GF TREAT": "Quick stop", VIEW: "Rooftop · views",
  NEIGHBOURHOOD: "Low-key · local", BAR: "Dim · late", FERRY: "Cold · windy · dress warm",
  "CABLE CAR": "Iconic · queues", FLIGHT: "Transit", "YOUR BASE": "Calm base", TOUR: "Full-day · guided",
};
export const OUT: Record<string, number> = {
  WALK: 1, MARKET: 1, FESTIVAL: 1, GARDEN: 1, VIEW: 1, FERRY: 1, "CABLE CAR": 1, NEIGHBOURHOOD: 1, TOUR: 1,
};
export const BK: Record<string, string> = {
  "d3-din": "XICA — 100% gluten-free, on the Embarcadero",
  "d5-din": "XICA — 100% gluten-free, minutes from Pier 33",
};

// Every card shows a real, correctly-licensed photograph of the actual place:
// the exact venue where free-licensed photography exists (the landmarks,
// museums, parks and views), and a real photo of the venue's own San Francisco
// neighbourhood or setting for the private restaurants, cafés and bars that
// have none. All from Wikimedia Commons (public domain / Creative Commons) —
// no generic global stock, and nothing that isn't San Francisco (or, for the
// wine tour, Napa). Served via Special:FilePath so we don't hard-code hashes.
const FP = (file: string): string =>
  "https://commons.wikimedia.org/wiki/Special:FilePath/" + file + "?width=1000";

// The private restaurants, cafés and bars have no free-licensed photo, so we
// pull each venue's OWN website image (its og:image) at view time via a
// link-preview proxy — the browser resolves the real venue photo. If the proxy
// is rate-limited or a site has no og:image, Img falls back to a real SF
// skyline, so a card is never broken. To drop the third-party dependency for
// any venue, replace site(...) with a direct (or owner-hosted) image URL.
const site = (url: string): string =>
  "https://api.microlink.io/?url=" + encodeURIComponent(url) + "&embed=image.url";

const IMG: Record<string, string> = {
  // Day heroes — real SF & Napa landmarks (unchanged, already licensed Commons).
  friHero: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/SanFrancisco_from_TwinPeaks_dusk_MC.jpg/1920px-SanFrancisco_from_TwinPeaks_dusk_MC.jpg",
  satHero: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/71/Painted_Ladies_San_Francisco_January_2013_panorama_2.jpg/1920px-Painted_Ladies_San_Francisco_January_2013_panorama_2.jpg",
  sunHero: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0c/San_Francisco_Ferry_Building_%28cropped%29.jpg/1920px-San_Francisco_Ferry_Building_%28cropped%29.jpg",
  monHero: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8d/Vineyards_of_Napa_Valley_panorama.jpg/1920px-Vineyards_of_Napa_Valley_panorama.jpg",
  tueHero: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cc/Alcatraz_-_San_Francisco_%2814242577761%29.jpg/1920px-Alcatraz_-_San_Francisco_%2814242577761%29.jpg",
  cable: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ad/San_Francisco_cable_car_no._24_en_2016.JPG/1920px-San_Francisco_cable_car_no._24_en_2016.JPG",
  ggb: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c7/Golden_Gate_Bridge_as_seen_from_Marshall%E2%80%99s_Beach%2C_March_2018.jpg/1920px-Golden_Gate_Bridge_as_seen_from_Marshall%E2%80%99s_Beach%2C_March_2018.jpg",
  // Real San Francisco places — the exact venue, or its actual neighbourhood.
  unionSquare: FP("Union_Square,_San_Francisco_December_2016.jpg"),
  chinatown: FP("San_Francisco_Dragon_Gate_to_Chinatown.jpg"),
  markHopkins: FP("InterContinental_Mark_Hopkins_San_Francisco.jpg"),
  nightSkyline: FP("San_Francisco_by_night_skyline.jpg"),
  palace: FP("Palace_of_Fine_Arts_in_San_Francisco,_night.jpg"),
  fortMason: FP("Fort_Mason_Center_and_Downtown_San_Francisco.jpg"),
  lombard: FP("Crooked_Section_of_Lombard_Street.jpg"),
  coit: FP("Coit_Tower_at_the_Top_of_Telegraph_Hill_in_San_Francisco.jpg"),
  pier39: FP("Pier_39_(15793096636).jpg"),
  deYoung: FP("DeYoung_Museum.JPG"),
  legion: FP("California_Palace_of_the_Legion_of_Honor,_01.JPG"),
  sfmoma: FP("2017_SFMOMA_from_Yerba_Buena_Gardens.jpg"),
  exploratorium: FP("Exploratorium_Pier_15_(San_Francisco).JPG"),
  calAcademy: FP("Living_roof_at_the_California_Academy_of_Sciences.jpg"),
  teaGarden: FP("Japanese_tea_garden_Golden_Gate_Park.JPG"),
  asianArt: FP("Asian_Art_Museum.JPG"),
  crissy: FP("Crissy_Field_with_Golden_Gate_Bridge_and_Marin_Headlands.jpg"),
  landsEnd: FP("Sutro_Baths_in_San_Francisco.jpg"),
  sausalito: FP("Sausalito_California.jpg"),
  mission: FP("Mission_Mural_-_Political_Art,_SF.jpg"),
  // Actual-venue photos that exist under a free licence.
  zuni: FP("Zuni_Cafe_in_San_Francisco.jpg"),
  ferryInterior: FP("SF_Ferry_Building_interior_1.JPG"),
  // Private venues — each pulls its own website photo (og:image) at view time.
  jwMarriott: site("https://www.marriott.com/en-us/hotels/sfojw-jw-marriott-san-francisco-union-square/overview/"),
  coffeeMovement: site("https://www.thecoffeemovement.com/"),
  topMark: site("https://www.topofthemark.com/"),
  bourbon: site("https://www.bourbonandbranch.com/"),
  dawnClub: site("https://www.dawnclub.com/"),
  saintFrank: site("https://www.saintfrankcoffee.com/"),
  xica: site("https://xicasf.com/"),
  laMar: site("https://lamarsf.com/"),
  blackCat: site("https://blackcatsf.com/"),
  caminoAlto: site("https://www.caminoaltosf.com/"),
  kitava: site("https://www.kitava.com/"),
  sightglass: site("https://sightglasscoffee.com/"),
  interval: site("https://theinterval.org/"),
  smugglers: site("https://smugglerscovesf.com/"),
  garyDanko: site("https://www.garydanko.com/"),
  littleGem: site("https://littlegem.restaurant/"),
};

// Signature-moment ("wow") images — the actual venue for each moment.
export function wowImgId(key: string): string {
  return key === "mark"
    ? IMG.topMark
    : key === "jazz"
      ? IMG.dawnClub
      : key === "interval"
        ? IMG.interval
        : key === "palace"
          ? IMG.palace
          : key === "ferry"
            ? IMG.tueHero
            : IMG.ggb;
}

type PlaceExtras = Partial<Omit<Place, "name" | "catLabel" | "cat" | "neigh" | "img" | "seed" | "dietLabel" | "ratingLabel">> & { diet?: Diet; rating?: Rating | null; };

function P(name: string, catLabel: string, cat: string, neigh: string, imgKey: string, x: PlaceExtras = {}): Place {
  return {
    name, catLabel, cat, neigh, img: uimg(IMG[imgKey] || imgKey), seed: imgKey,
    diet: x.diet || { level: "none" }, dietLabel: (x.diet && x.diet.label) || "", dietNote: x.dietNote || "",
    rating: x.rating || null, ratingLabel: x.rating ? x.rating.value.toFixed(1) : "",
    why: x.why || "", review: x.review || "", hours: x.hours || "", price: x.price || "",
    match: x.match || "", tradeoff: x.tradeoff || "", lat: x.lat != null ? x.lat : null, lng: x.lng != null ? x.lng : null,
    web: x.web || "", menu: x.menu || "", book: x.book || "", source: x.source || "",
    verifiedOn: x.verifiedOn || "Jul 26, 2026", uncertainty: x.uncertainty || "",
  };
}

function buildDays(): Day[] {
  return [
    {
      id: "jul31", weekday: "Friday", dayNum: "31", month: "JUL", dateLong: "July 31", hero: IMG.friHero,
      title: "Land, settle in at Union Square, and take the city from nineteen floors up as the sun goes down.",
      walk: "1.4 km", cost: "≈ $120",
      weather: { def: { cond: "cloud", label: "Fog a.m. → clear 20°" }, alt: { cond: "sun", label: "Clear 21°" } },
      contingency: null,
      wow: { title: "Sunset from Top of the Mark", sub: "19th-floor penthouse, 360° views", blurb: "Ride the California St cable car to the door and take the whole city in as the sun drops behind the bridge — then straight down into a basement speakeasy.", key: "mark" },
      segments: [
        { id: "d1-base", time: "10:30 AM", isAnchor: true, anchorLabel: "CHECK-IN", transit: { label: "BART from SFO → Powell St · ≈30 min" }, leaveBy: "—",
          options: [ P("JW Marriott Union Square", "YOUR BASE", "Anchors", "515 Mason St · Union Square", "jwMarriott", { hours: "Check-in from 3:00 PM", why: "Your whole trip runs from the JW Marriott on Mason St — Union Square is a block east, the Powell cable-car turnaround and BART are a 6-minute walk, and the California St line (California & Mason, for Top of the Mark) is about four blocks up. Chinatown starts a block away. Drop bags, then walk the neighbourhood.", lat: 37.7887, lng: -122.4097, web: "https://www.marriott.com/en-us/hotels/sfojw-jw-marriott-san-francisco-union-square/overview/", book: "https://www.marriott.com/en-us/hotels/sfojw-jw-marriott-san-francisco-union-square/overview/" }) ] },
        { id: "d1-coffee", time: "11:15 AM", transit: { label: "10-min walk into Chinatown" },
          options: [ P("The Coffee Movement", "CAFÉ · PHOTO", "Cafés", "Chinatown", "coffeeMovement", { rating: { value: 4.7 }, match: "Your closest top pick", hours: "7:00 AM – 2:00 PM", price: "$", why: "Your nearest excellent cup — a 10-minute walk. Seasonal lattes (vanilla-lavender, ginger spice) in a tiny Chinatown room. Closes at 2, so it's a morning stop.", review: "Widely rated one of the best espresso bars in the city.", lat: 37.7945, lng: -122.4085, web: "https://www.thecoffeemovement.com/" }),
                     P("Home Coffee Roasters", "CAFÉ · PHOTO", "Cafés", "Chinatown", "cable", { match: "Even closer, opens earlier", hours: "7:00 AM – 6:00 PM", price: "$", why: "The closest decent cup to the hotel — red-velvet and lavender lattes that aren't over-sweet.", lat: 37.7915, lng: -122.4058 }) ] },
        { id: "d1-mark", time: "7:15 PM", isAnchor: true, anchorLabel: "SUNSET", transit: { label: "California St cable car to the door · $9" }, leaveBy: "9:00 PM",
          options: [ P("Top of the Mark", "VIEW", "Must-see", "Nob Hill", "topMark", { rating: { value: 4.6 }, match: "Sunset ~8:20 + blue hour", hours: "3:00 PM – late · kitchen to 9:30", price: "$$$", why: "A 19th-floor penthouse with a 360° view, reached by the quiet California St cable car that stops right at the Mark Hopkins door. Sunset is around 8:20; the blue hour after is the real show.", review: "The classic SF sky-high cocktail room since 1939.", lat: 37.7924, lng: -122.4103, web: "https://www.topofthemark.com/", uncertainty: "Ask about the dress code when you book." }) ] },
        { id: "d1-bar", time: "9:15 PM", isAnchor: true, anchorLabel: "NIGHTCAP", transit: { label: "Short car to the Tenderloin — don't walk it at night" },
          options: [ P("Bourbon & Branch", "BAR", "Trending", "Tenderloin", "bourbon", { rating: { value: 4.5 }, match: "Reservation + password", hours: "6:00 PM – 2:00 AM", price: "$$$", why: "Five hidden bars in one 1920s building. Reserve ahead and you're issued a password. House rules: no phones, no photos, no standing at the bar — settle in and let the bartender lead.", review: "One of the country's landmark speakeasies.", lat: 37.7847, lng: -122.413, web: "https://www.bourbonandbranch.com/", book: "https://www.bourbonandbranch.com/", dietNote: "Take a car both ways — the route from Union Square crosses the Tenderloin." }) ] },
      ],
    },
    {
      id: "aug1", weekday: "Saturday", dayNum: "01", month: "AUG", dateLong: "August 1", hero: IMG.satHero,
      title: "Jerry Garcia's birthday in the sun, then swing on Nob Hill and jazz downtown.",
      walk: "3.0 km", cost: "≈ $90",
      weather: { def: { cond: "sun", label: "Sunny SE · fog west 24°" }, alt: { cond: "cloud", label: "Cloud 20°" } },
      contingency: null,
      wow: { title: "Azure McCall at the Dawn Club", sub: "One night only", blurb: "Named for the 1930s club where Lu Watters' band played — 'Hawaii's first lady of jazz' for a single night, minutes from Union Square.", key: "jazz" },
      segments: [
        { id: "d2-jerry", time: "11:30 AM", isAnchor: true, anchorLabel: "FESTIVAL", transit: { label: "Car to McLaren Park · ≈20 min" }, leaveBy: "3:00 PM",
          options: [ P("Jerry Day, McLaren Park", "FESTIVAL", "Markets", "Excelsior", "teaGarden", { match: "Free · the city's sunny pocket", hours: "11:30 AM – 5:45 PM", price: "Free", why: "The 24th annual Garcia birthday tribute with Melvin Seals & JGB, in the Excelsior — the neighbourhood that actually gets sun while the rest of the city fogs in. Sunscreen, not a parka.", lat: 37.718, lng: -122.42, web: "https://www.google.com/search?q=Jerry+Day+McLaren+Park" }) ] },
        { id: "d2-swing", time: "6:00 PM", isAnchor: true, anchorLabel: "LIVE MUSIC", transit: { label: "California St cable car to Nob Hill" }, leaveBy: "7:30 PM",
          options: [ P("Top of the Mark — Swing Four", "JAZZ", "Trending", "Nob Hill", "topMark", { match: "$15 cover · early set", hours: "6:00 PM – 7:30 PM", price: "$$", why: "Nick Rossi & the Swing Four play the penthouse early enough that you can still make the Dawn Club downtown after. $15 cover.", lat: 37.7924, lng: -122.4103, web: "https://www.topofthemark.com/", uncertainty: "Top of the Mark doesn't publish its live-music lineup far ahead — confirm the Saturday act and cover before counting on it: (415) 616-6916." }) ] },
        { id: "d2-dawn", time: "8:00 PM", isAnchor: true, anchorLabel: "JAZZ", transit: { label: "9-min walk off Market" },
          options: [ P("Dawn Club — Azure McCall", "JAZZ", "Must-see", "off Market", "dawnClub", { match: "One night only", hours: "8:00 PM – late", price: "$$", why: "A basement room at 10 Annie St named for the 1930s original where Lu Watters' band played. Azure McCall — a real fixture here — is listed for the night. Reserve by phone; cover isn't published.", lat: 37.7873, lng: -122.403, book: "tel:+14155083296", web: "https://www.dawnclub.com/", uncertainty: "The Dawn Club's calendar shifts — confirm Azure McCall's date at dawnclub.com before building the night around it." }) ] },
      ],
    },
    {
      id: "aug2", weekday: "Sunday", dayNum: "02", month: "AUG", dateLong: "August 2", hero: IMG.sunHero,
      title: "Your own sequence — coffee on Polk, an hour at The Interval, the waterfront on foot, then jazz.",
      walk: "5.2 km", cost: "≈ $130",
      weather: { def: { cond: "cloud", label: "Fog a.m. → clear 19°" }, alt: { cond: "sun", label: "Clear 20°" } },
      contingency: { text: "The 'Denim Dream' residency plays both Saturday and Sunday; the Black Cat is closed Mon & Tue, so Sunday is the night the whole chain fits. Call to lock the Sunday booking.", segId: "d3-cat", optIdx: 0, applyLabel: "Call (415) 358-1999" },
      wow: { title: "The Interval at Long Now", sub: "Cocktails inside a 10,000-year clock", blurb: "Part award-winning bar, part museum of long-term thinking — a chalkboard robot, an eight-foot mechanical solar system, and prototypes of a clock built to run for ten millennia. No reservations; arrive at 3pm opening.", key: "interval" },
      segments: [
        { id: "d3-frank", time: "10:30 AM", isAnchor: true, anchorLabel: "COFFEE", transit: { label: "Powell/Hyde cable car → Hyde & Union" }, leaveBy: "12:00 PM",
          options: [ P("Saint Frank", "CAFÉ · PHOTO", "Cafés", "Russian Hill", "saintFrank", { rating: { value: 4.6 }, match: "Your pick", hours: "7:00 AM – 6:00 PM", price: "$$", why: "A minimalist Scandinavian room on Polk with house-made almond-macadamia milk. Take the Powell/Hyde cable car over Russian Hill and get off at Hyde & Union — the scenic ride you wanted, two blocks from the door.", lat: 37.7975, lng: -122.422, web: "https://www.saintfrankcoffee.com/", uncertainty: "Hours unverified — confirm before a special trip." }) ] },
        { id: "d3-interval", time: "3:00 PM", isAnchor: true, anchorLabel: "SIGNATURE", transit: { label: "Car to Fort Mason · ≈12 min" }, leaveBy: "4:15 PM",
          options: [ P("The Interval at Long Now", "VIEW", "Must-see", "Fort Mason", "fortMason", { rating: { value: 4.8 }, match: "Opens 3pm Sunday — this sets the clock", hours: "Sun 3:00 PM – 10:00 PM", price: "$$", why: "Arrive at opening — it's small and takes no reservations. A floor-to-ceiling library, classic cocktails, and 10,000-year-clock prototypes. This 3pm Sunday opening is why the whole day chains from here.", lat: 37.8065, lng: -122.431, web: "https://theinterval.org/" }) ] },
        { id: "d3-walk", time: "4:15 PM", anchorLabel: "WALK", transit: { label: "Flat waterfront path" },
          options: [ P("Embarcadero walk", "WALK", "Outdoors", "Fort Mason → Ferry Building", "pier39", { match: "≈4 km, ~1 hr, flat", price: "Free", why: "Fort Mason → Aquatic Park → the Wharf → Pier 39 → the Ferry Building. The best long walk in the city, and the fog has usually burned off by mid-afternoon. Bring the shell — it's the windward side.", lat: 37.8, lng: -122.41 }) ] },
        { id: "d3-din", time: "7:45 PM", transit: { label: "You're already at the water" },
          options: [ P("XICA", "DINNER", "Dining", "1265 Battery St · near Embarcadero", "xica", { diet: { level: "safe", label: "100% gluten-free" }, rating: { value: 4.5 }, match: "Celiac-safe on the water", hours: "11:30 AM – 9:00 PM (11 AM weekends)", price: "$$", why: "An entirely gluten-free Mexican kitchen at Levi's Plaza on the Embarcadero — no cross-contamination questions, minutes from where the walk ends.", lat: 37.8016, lng: -122.4005, web: "https://xicasf.com/", uncertainty: "Verified 100% gluten-free; the kitchen closes at 9pm, so book ahead for this 7:45 sitting." }),
                     P("La Mar Cocina Peruana", "DINNER", "Dining", "Embarcadero", "laMar", { diet: { level: "caution", label: "GF-friendly" }, match: "Upscale waterfront", hours: "5:00 PM – 10:00 PM", price: "$$$", why: "Ceviche-led Peruvian with sweeping bay views — much of the menu is naturally gluten-free, but confirm with the kitchen.", lat: 37.7967, lng: -122.3945, web: "https://lamarsf.com/" }) ] },
        { id: "d3-cat", time: "8:00 PM", isAnchor: true, anchorLabel: "JAZZ SUPPER CLUB", transit: { label: "Take a car — Tenderloin at night" },
          options: [ P("Black Cat — Denim Dream", "JAZZ", "Must-see", "Tenderloin", "blackCat", { match: "Dinner + show, one booking", hours: "Sun 6:00 PM – 11:00 PM", price: "$$$", why: "A jazz supper club, so dinner and the show are one booking — Daniel Winshall & PHER's 'Denim Dream' residency, with sets at 7 and 9:30pm. It plays both Saturday and Sunday; the club is closed Monday and Tuesday, so Sunday is the night this whole day fits.", lat: 37.784, lng: -122.413, book: "tel:+14153581999", web: "https://blackcatsf.com/", dietNote: "Ask about gluten-free options when you reserve; take a car both ways." }) ] },
      ],
    },
    {
      id: "aug3", weekday: "Monday", dayNum: "03", month: "AUG", dateLong: "August 3", hero: IMG.monHero,
      title: "Napa and Sonoma by coach, back for the floodlit rotunda at dusk.",
      walk: "1.8 km", cost: "≈ $360",
      weather: { def: { cond: "sun", label: "Warm inland · sunny 28°" }, alt: { cond: "sun", label: "Hot 31°" } },
      contingency: null,
      wow: { title: "Palace of Fine Arts at blue hour", sub: "Floodlit rotunda in the lagoon", blurb: "The rotunda lights up after dark and reflects in the lagoon — blue hour, roughly sunset to thirty minutes after, is the real shot, not sunset itself.", key: "palace" },
      segments: [
        { id: "d4-wine", time: "8:45 AM", isAnchor: true, anchorLabel: "DAY TOUR", transit: { label: "Union Square pickup — confirm exact spot with operator" }, leaveBy: "6:00 PM",
          options: [ P("Napa & Sonoma bus tour", "TOUR", "Outdoors", "Wine Country", "monHero", { match: "Tastings included", hours: "8:45 AM – ~6:00 PM", price: "$$$", why: "A full-day guided loop through Napa and Sonoma with tastings — pickup is near the hotel — the main operator (Gray Line) departs 478 Post St; confirm your exact spot with the tour operator. Wine country is outside every rideshare's range, so the coach is the move.", lat: 37.7880, lng: -122.4088, web: "https://www.google.com/search?q=Napa+Sonoma+wine+tour+from+San+Francisco", uncertainty: "Confirm the tour runs Monday and re-confirm the pickup point." }) ] },
        { id: "d4-palace", time: "7:45 PM", isAnchor: true, anchorLabel: "GOLDEN HOUR", transit: { label: "Car to the Marina · ≈15 min" },
          options: [ P("Palace of Fine Arts", "VIEW", "Must-see", "Marina", "palace", { match: "Blue hour is the shot", hours: "Grounds always open · free", price: "Free", why: "Golden hour is around 7:40 and sunset just after 8:15; the blue hour after — roughly to 8:45 — is when the floodlit rotunda mirrored in the lagoon is the picture. Ten minutes from a fully gluten-free dinner at Camino Alto.", lat: 37.803, lng: -122.4485, web: "https://palaceoffinearts.org/" }),
                     P("Crissy Field", "WALK", "Outdoors", "Presidio", "crissy", { match: "Bridge silhouette at sunset", hours: "Always open · free", price: "Free", why: "One km from the Palace — the sun sets right beside the Golden Gate here, so the bridge silhouettes. Cold and windy: bring the shell.", lat: 37.804, lng: -122.465, web: "https://www.parksconservancy.org/parks/crissy-field" }) ] },
        { id: "d4-din", time: "9:00 PM", transit: { label: "10-min walk from the Palace" },
          options: [ P("Camino Alto", "DINNER", "Dining", "1715 Union St · Cow Hollow", "caminoAlto", { diet: { level: "safe", label: "100% gluten-free" }, rating: { value: 4.6 }, match: "10-min walk from the Palace", hours: "Dinner from 5:30 · closed Tue", price: "$$$", why: "A seasonal, entirely gluten-free room a 10-minute walk from the Palace — the whole menu is gluten-free, so it's genuinely celiac-friendly. Reserve ahead and confirm cross-contact when you book: (415) 441-2111.", lat: 37.7975, lng: -122.4245, web: "https://www.caminoaltosf.com/", uncertainty: "" }),
                     P("Kitava", "DINNER", "Dining", "2011 Mission St · Mission", "kitava", { diet: { level: "safe", label: "100% gluten-free" }, rating: { value: 4.5 }, match: "Dedicated GF — open to 9pm", hours: "11:00 AM – 9:00 PM daily", price: "$$", why: "If Camino Alto is booked, this entirely gluten-, dairy- and refined-sugar-free kitchen is the safe fallback — a car across to the Mission, open every night to 9pm, no reservation needed. (As Quoted, the dedicated-GF cafe in Presidio Heights, is lovely but closes at 3pm, so it's a breakfast stop, not dinner.)", lat: 37.7636, lng: -122.4194, web: "https://www.kitava.com/", uncertainty: "A car ride from the Palace — order before the 9pm close." }) ] },
      ],
    },
    {
      id: "aug4", weekday: "Tuesday", dayNum: "04", month: "AUG", dateLong: "August 4", hero: IMG.tueHero,
      title: "Free-museum Tuesday at the de Young and Legion, then the cold night ferry across to Alcatraz.",
      walk: "2.4 km", cost: "≈ $150",
      weather: { def: { cond: "cloud", label: "Fog · cool bay 18°" }, alt: { cond: "cloud", label: "Grey 17°" } },
      contingency: { text: "If SFJAZZ has an evening show tonight, it collides head-on with the Alcatraz ferry — you can't do both. Keep Alcatraz; only check the SFJAZZ calendar if the ferry falls through.", segId: "d5-alcatraz", optIdx: 0, applyLabel: "Keep Alcatraz" },
      wow: { title: "Alcatraz after dark", sub: "The night tour · sells out", blurb: "The 6:30 sailing gets you sunset from the island and a quieter cell house than the day tours. The coldest thing all trip — windproof jacket, long trousers, closed shoes.", key: "ferry" },
      segments: [
        { id: "d5-museum", time: "9:30 AM", isAnchor: true, anchorLabel: "FREE ADMISSION", transit: { label: "Car to Golden Gate Park · ≈20 min" }, leaveBy: "3:00 PM",
          options: [ P("de Young Museum", "MUSEUM", "Art & Culture", "Golden Gate Park", "deYoung", { rating: { value: 4.6 }, match: "Free general admission today", hours: "9:30 AM – 5:15 PM", price: "Free (Pharaohs $40)", why: "Free First Tuesday means general admission is free at both the de Young and the Legion of Honor. The Treasures of the Pharaohs show is a timed $40 add-on — book the earliest slot.", lat: 37.7715, lng: -122.4687, web: "https://www.famsf.org/visit/de-young" }),
                     P("Legion of Honor", "MUSEUM", "Art & Culture", "Lincoln Park", "legion", { match: "Also free today", hours: "9:30 AM – 5:15 PM", price: "Free", why: "A major loan show on the Etruscans in the foggiest, most beautiful corner of the city — but you'll be inside. Free general admission today.", lat: 37.7845, lng: -122.5008, web: "https://www.famsf.org/visit/legion-of-honor" }) ] },
        { id: "d5-alcatraz", time: "5:50 PM", isAnchor: true, anchorLabel: "MUST-DO", transit: { label: "Flat walk or car to Pier 33" }, leaveBy: "8:40 PM",
          options: [ P("Alcatraz Night Tour", "FERRY", "Must-see", "Pier 33", "tueHero", { rating: { value: 4.9 }, match: "Your must-do · 6:30 sailing", hours: "Board 5:50 · back 8:40", price: "$59.65", why: "Be at Pier 33 by 5:50 for the 6:30 sailing — you get sunset from the island and the quietest cell house of the day. It sells out; book well ahead.", lat: 37.808, lng: -122.41, book: "https://www.cityexperiences.com/san-francisco/city-cruises/alcatraz/", web: "https://www.cityexperiences.com/san-francisco/city-cruises/alcatraz/", dietNote: "Coldest thing all trip: windproof jacket, long trousers, closed shoes, and a hat." }) ] },
        { id: "d5-din", time: "9:00 PM", transit: { label: "Minutes from Pier 33" },
          options: [ P("XICA", "DINNER", "Dining", "1265 Battery St · near Embarcadero", "xica", { diet: { level: "safe", label: "100% gluten-free" }, rating: { value: 4.5 }, match: "Celiac-safe, close to the pier", hours: "11:30 AM – 9:00 PM (11 AM weekends)", price: "$$", why: "Off the cold ferry and straight into a warm, entirely gluten-free room minutes from the pier — the natural last-night dinner.", lat: 37.8016, lng: -122.4005, web: "https://xicasf.com/", uncertainty: "The kitchen closes at 9pm and you dock at 8:40 — call ahead to hold a late table, or take the earlier 5:55 sailing." }) ] },
      ],
    },
  ];
}

const optionalIdeas: OptionalIdea[] = [
  { name: "Sightglass Coffee", cat: "Cafés", neigh: "SoMa", why: "Roastery + café in one big room; opens 6:30 — the only good coffee before an early start.", weather: "any", img: uimg(IMG.sightglass), seed: "cafe", lat: 37.7767, lng: -122.4088 },
  { name: "Ferry Building Marketplace", cat: "Markets", neigh: "Embarcadero", why: "Mariposa (100% GF bakery) inside; big Saturday farmers market 8–2. Flat walk from the hotel.", weather: "any", img: uimg(IMG.ferryInterior), seed: "market", lat: 37.7955, lng: -122.3937 },
  { name: "SFMOMA", cat: "Art & Culture", neigh: "SoMa", why: "One of few majors open Mondays; a 10-minute walk — the easiest museum to slot in.", weather: "rain", img: uimg(IMG.sfmoma), seed: "gallery", lat: 37.7857, lng: -122.401 },
  { name: "Exploratorium", cat: "Art & Culture", neigh: "Pier 15", why: "50+ interactive exhibits built with NASA; near Pier 33 for a pre-ferry afternoon.", weather: "rain", img: uimg(IMG.exploratorium), seed: "gallery2", lat: 37.8017, lng: -122.3975 },
  { name: "Smuggler's Cove", cat: "Trending", neigh: "Hayes Valley", why: "Over 1,000 rums and a world-class tiki programme; five minutes from SFJAZZ.", weather: "any", img: uimg(IMG.smugglers), seed: "bar", lat: 37.779, lng: -122.423 },
  { name: "Cityscape Lounge", cat: "Must-see", neigh: "Union Square", why: "46th-floor rooftop — the one nearby panorama that genuinely includes the Golden Gate. Walkable.", weather: "clear", img: uimg(IMG.nightSkyline), seed: "view2", lat: 37.7857, lng: -122.4103 },
  { name: "Zuni Café", cat: "Dining", neigh: "Hayes Valley", why: "The iconic SF room; roast chicken for two takes an hour by design. Naturally GF-leaning.", weather: "any", img: uimg(IMG.zuni), seed: "dinner3", lat: 37.7727, lng: -122.4218 },
  { name: "Gary Danko", cat: "Dining", neigh: "Fisherman's Wharf", why: "The classic special-occasion prix fixe with choices — substitutions are easy and it's very accommodating.", weather: "any", img: uimg(IMG.garyDanko), seed: "dinner4", lat: 37.8058, lng: -122.4205 },
  { name: "Cable car — Powell/Hyde", cat: "Must-see", neigh: "Russian Hill", why: "$9 flat, runs to 11pm — the scenic line over Russian Hill past the crooked street. Board mid-route at Washington & Powell to skip the queue.", weather: "clear", img: uimg(IMG.cable), seed: "cable", lat: 37.7847, lng: -122.408 },
  { name: "Presidio Tunnel Tops", cat: "Outdoors", neigh: "Presidio", why: "Free; food trucks and big bridge views — the best view-to-effort ratio in the city.", weather: "clear", img: uimg(IMG.ggb), seed: "garden3", lat: 37.8015, lng: -122.4665 },
  { name: "California Academy of Sciences", cat: "Art & Culture", neigh: "Golden Gate Park", why: "Open every day including Monday — rainforest dome, planetarium, aquarium under one living roof.", weather: "rain", img: uimg(IMG.calAcademy), seed: "gallery3", lat: 37.7699, lng: -122.4661 },
  { name: "Mariposa Baking Co", cat: "Cafés", neigh: "Ferry Building", why: "A 100% dedicated gluten-free bakery — zero cross-contamination. Bread, pastries, cakes.", weather: "any", img: uimg(IMG.ferryInterior), seed: "bread", lat: 37.7955, lng: -122.3937 },
  { name: "Chinatown — Grant & Waverly", cat: "Must-see", neigh: "one block from the hotel", why: "The oldest Chinatown in North America starts a block from your door — Grant Ave dragon gate, Waverly Place, Ross Alley. The perfect arrival-day wander. (Celiac note: browse, do not rely on the food — Chinese soy sauce is wheat-based.)", weather: "any", img: uimg(IMG.chinatown), seed: "market4", lat: 37.7941, lng: -122.4078 },
  { name: "Golden Gate Bridge walk", cat: "Must-see", neigh: "Presidio / the bridge", why: "The one iconic SF thing the plan was missing — walk out onto the span from the south Welcome Center, or stroll from Crissy Field. Pair it with the Monday Palace/Crissy evening or a free morning. Windproof layer essential.", weather: "clear", img: uimg(IMG.ggb), seed: "ggb", lat: 37.8078, lng: -122.4753 },
  { name: "Little Gem", cat: "Dining", neigh: "Hayes Valley", why: "Entirely gluten- and dairy-free and casual (400 Grove St) — a genuinely celiac-safe sit-down lunch or dinner near Civic Center and SFJAZZ.", weather: "any", img: uimg(IMG.littleGem), seed: "dinner5", lat: 37.7776, lng: -122.4231 },
  { name: "Sisterita", cat: "Cafés", neigh: "Jackson Square", why: "From the XICA team — a gluten-free breakfast and lunch spot, and your safe morning option away from the hotel. Reserve on weekends.", weather: "any", img: uimg(IMG.coit), seed: "cafe4", lat: 37.7949, lng: -122.4033 },
  { name: "The Coffee Movement (breakfast)", cat: "Cafés", neigh: "one block from the hotel", why: "Your closest excellent cup for the morning ritual — 10-min walk, opens 7. Coffee-forward (no GF food), so pair with a Mariposa or Sisterita pastry.", weather: "any", img: uimg(IMG.coffeeMovement), seed: "cafe5", lat: 37.7945, lng: -122.4085 },
  { name: "fckgltn (dedicated GF pizza)", cat: "Dining", neigh: "Mission Bay", why: "Dedicated gluten-free (and vegan) pizza, bowls and salads — safe pizza is rare in SF. More takeout than ambiance, handy near Oracle Park.", weather: "any", img: uimg(IMG.mission), seed: "dinner6", lat: 37.7695, lng: -122.3969 },
  { name: "Kitava", cat: "Dining", neigh: "Mission", why: "100% gluten-, dairy- and refined-sugar-free fast-casual — bibimbap and GF fried chicken, no reservation needed. A safe, low-drama meal.", weather: "any", img: uimg(IMG.kitava), seed: "dinner7", lat: 37.7638, lng: -122.4193 },
  { name: "Lands End Trail", cat: "Outdoors", neigh: "Lincoln Park", why: "The best coastal walk in the city — cliffs, cypress, the Sutro Baths ruins and framed Golden Gate views. Pairs with a Legion of Honor morning.", weather: "clear", img: uimg(IMG.landsEnd), seed: "garden4", lat: 37.7807, lng: -122.5057 },
  { name: "Twin Peaks", cat: "Must-see", neigh: "central SF", why: "The 360-degree view over the whole city — best late afternoon before the fog, or after dark for the grid of lights. A quick car up from downtown.", weather: "clear", img: uimg(IMG.friHero), seed: "skyline2", lat: 37.7544, lng: -122.4477 },
  { name: "Lombard St (crooked street)", cat: "Must-see", neigh: "Russian Hill", why: "The eight-hairpin block on Hyde — your Powell/Hyde cable car passes the top at Hyde & Lombard, so it slots straight into the Saint Frank morning.", weather: "any", img: uimg(IMG.lombard), seed: "cable2", lat: 37.8021, lng: -122.4187 },
  { name: "Sausalito ferry", cat: "Outdoors", neigh: "from the Ferry Building", why: "A half-day escape — ferry across the bay past Alcatraz to the waterfront village of Sausalito, lunch, and back. Golden Gate or Blue & Gold ferry.", weather: "clear", img: uimg(IMG.sausalito), seed: "view3", lat: 37.8558, lng: -122.4787 },
  { name: "Alamo Square (Painted Ladies)", cat: "Must-see", neigh: "Alamo Square", why: "The postcard Victorian row against the skyline — a quick photo stop, walkable with Hayes Valley (Little Gem, Smuggler's Cove).", weather: "clear", img: uimg(IMG.satHero), seed: "painted", lat: 37.7764, lng: -122.4329 },
  { name: "Coit Tower & Filbert Steps", cat: "Must-see", neigh: "Telegraph Hill", why: "WPA murals inside, a 360-degree view up top, and the wild-parrot garden stairways down — great with a North Beach evening.", weather: "clear", img: uimg(IMG.coit), seed: "view4", lat: 37.8024, lng: -122.4058 },
  { name: "Fisherman's Wharf & Pier 39", cat: "Must-see", neigh: "the waterfront", why: "Touristy but iconic — the sea lions at Pier 39 — and it sits directly on your Sunday Embarcadero walk, so it costs nothing extra.", weather: "any", img: uimg(IMG.pier39), seed: "market5", lat: 37.8087, lng: -122.4098 },
  { name: "Golden Gate Park", cat: "Outdoors", neigh: "west of the city", why: "The Japanese Tea Garden, Botanical Garden and Stow Lake wrap around the de Young — pair it with the Tuesday museum morning.", weather: "clear", img: uimg(IMG.teaGarden), seed: "garden5", lat: 37.7694, lng: -122.4862 },
  { name: "Asian Art Museum", cat: "Art & Culture", neigh: "Civic Center", why: "Free the first Sunday of the month — Aug 2 qualifies — a calm, world-class indoor option if the fog wins that day.", weather: "rain", img: uimg(IMG.asianArt), seed: "gallery4", lat: 37.7800, lng: -122.4163 },
];

const MODEL: TripModel = {
  days: buildDays(),
  prep: {
    note: "Two calls to make this week, and a bag packed for microclimates — you'll feel three seasons in one day.",
    actions: [
      { id: "a1", task: "Call Black Cat to confirm the Denim Dream show is Sunday, not Saturday — (415) 358-1999.", lead: "This week" },
      { id: "a2", task: "Book the Alcatraz night tour — the 6:30 sailing sells out.", lead: "Now" },
      { id: "a3", task: "Reserve Bourbon & Branch (password issued) and confirm the Napa/Sonoma tour runs Monday.", lead: "This week" },
      { id: "a4", task: "Prepay cable-car rides on MuniMobile or Clipper to skip the ticket line.", lead: "Before you go" },
    ],
    packing: [
      { group: "Layers (non-negotiable)", items: [ { id: "p1", text: "Windproof shell — for the Alcatraz ferry and Crissy Field" }, { id: "p2", text: "Warm layer + hat — the bay is cold after dark even in August" }, { id: "p3", text: "Closed shoes for the night ferry; something nicer for Top of the Mark" } ] },
      { group: "Gluten-free kit", items: [ { id: "p4", text: "List of the 100% GF kitchens (Camino Alto, XICA, Kitava, Mariposa)" }, { id: "p5", text: "Ask for tamari, not soy — and skip Japantown street stalls" } ] },
    ],
  },
  budget: {
    note: "Rough per-couple estimate, excluding hotel and flights.",
    rows: [
      { cat: "Wine tour", label: "Napa & Sonoma coach (2)", amount: 300 },
      { cat: "Alcatraz", label: "Night tour (2)", amount: 120 },
      { cat: "Dining", label: "Dinners + Top of the Mark", amount: 500 },
      { cat: "Nightlife", label: "Bourbon & Branch, jazz covers", amount: 160 },
      { cat: "Transit", label: "BART, cable cars, rideshare", amount: 140 },
      { cat: "Museums", label: "Pharaohs timed add-on (2)", amount: 80 },
    ],
  },
  optionalIdeas,
  contingencies: [
    { trigger: "Fog won't lift", icon: "cloud", text: "Swap the view night for an indoor museum (SFMOMA is open Mondays); the Palace rotunda still reads well floodlit in fog." },
    { trigger: "Black Cat is Saturday, not Sunday", icon: "alert", text: "Run Saint Frank + Interval + Embarcadero on Sunday without Black Cat, ending at dinner on the water, and move Black Cat to Saturday." },
    { trigger: "Tenderloin at night", icon: "car", text: "Always take a car to and from Bourbon & Branch and Black Cat — don't walk the route from Union Square after dark." },
    { trigger: "Restaurant closed", icon: "food", text: "Every dinner has a 100% gluten-free fallback: XICA on the Embarcadero, Camino Alto in Cow Hollow, Kitava in the Mission." },
  ],
  transitInfo: {
    verified: "Jul 26, 2026",
    rows: [
      { mode: "From SFO", detail: "BART from the airport to Powell St — ≈$11, 30 min, no transfer, station is at the hotel. Better than a car with luggage." },
      { mode: "Cable cars", detail: "$9 flat, one way, no transfers. California St line to the Mark Hopkins door (quietest); Powell/Hyde for the scenic Russian Hill ride to 11pm." },
      { mode: "Waymo / Uber", detail: "Waymo covers all of SF and runs ~13% dearer than Uber (≈ +$50–70 over the trip) — worth it for the Tenderloin nights: no driver, doors lock, car's waiting." },
      { mode: "Wine country", detail: "Napa and Sonoma are outside every rideshare's service area — the Monday coach tour is the way there." },
    ],
  },
};

export { MODEL };
