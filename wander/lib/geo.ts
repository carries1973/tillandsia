// Derived-in-UI geo + link helpers, ported verbatim from the prototype logic.

export const HOME = { lat: 45.5762, lng: -73.549 };

export function uimg(id: string): string {
  return "https://images.unsplash.com/photo-" + id + "?auto=format&fit=crop&w=900&q=72";
}

export function ico(c: string): "rain" | "cloud" | "sun" {
  return c === "rain" ? "rain" : c === "cloud" ? "cloud" : "sun";
}

export function dist(lat: number | null, lng: number | null): number | null {
  if (lat == null || lng == null) return null;
  const R = 6371;
  const toR = (x: number) => (x * Math.PI) / 180;
  const dLa = toR(lat - HOME.lat);
  const dLo = toR(lng - HOME.lng);
  const a =
    Math.sin(dLa / 2) ** 2 +
    Math.cos(toR(HOME.lat)) * Math.cos(toR(lat)) * Math.sin(dLo / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export function km(lat: number | null, lng: number | null): string {
  const d = dist(lat, lng);
  return d == null ? "" : d < 1 ? Math.round(d * 10) / 10 + " km" : Math.round(d) + " km";
}

export function dir(lat: number | null, lng: number | null): string {
  return (
    "https://www.google.com/maps/dir/?api=1&origin=45.5762,-73.549&destination=" +
    lat +
    "," +
    lng +
    "&travelmode=transit"
  );
}

export function dirChain(
  oLat: number | null,
  oLng: number | null,
  dLat: number | null,
  dLng: number | null
): string {
  return (
    "https://www.google.com/maps/dir/?api=1&origin=" +
    oLat +
    "," +
    oLng +
    "&destination=" +
    dLat +
    "," +
    dLng +
    "&travelmode=transit"
  );
}

export function domain(u: string): string {
  try {
    return u
      .replace(/^https?:\/\//, "")
      .replace(/^www\./, "")
      .split("/")[0];
  } catch {
    return "";
  }
}

export function uber(
  oLat: number | null,
  oLng: number | null,
  dLat: number | null,
  dLng: number | null
): string {
  return (
    "https://m.uber.com/ul/?action=setPickup&pickup%5Blatitude%5D=" +
    oLat +
    "&pickup%5Blongitude%5D=" +
    oLng +
    "&dropoff%5Blatitude%5D=" +
    dLat +
    "&dropoff%5Blongitude%5D=" +
    dLng
  );
}

export function roadKm(
  oLat: number | null,
  oLng: number | null,
  dLat: number | null,
  dLng: number | null
): number {
  const R = 6371;
  const oLatN = oLat ?? 0;
  const oLngN = oLng ?? 0;
  const dLatN = dLat ?? 0;
  const dLngN = dLng ?? 0;
  const toR = (x: number) => (x * Math.PI) / 180;
  const dLa = toR(dLatN - oLatN);
  const dLo = toR(dLngN - oLngN);
  const a =
    Math.sin(dLa / 2) ** 2 +
    Math.cos(toR(oLatN)) * Math.cos(toR(dLatN)) * Math.sin(dLo / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)) * 1.35;
}

// Stylized map projection (placeholder map, per the handoff).
export function project(list: { lat: number; lng: number }[]): {
  pts: { x: number; y: number }[];
  route: string;
} {
  const W = 330,
    H = 340,
    pad = 44;
  if (!list.length) return { pts: [], route: "" };
  const las = list.map((p) => p.lat);
  const los = list.map((p) => p.lng);
  const minLa = Math.min(...las),
    maxLa = Math.max(...las),
    minLo = Math.min(...los),
    maxLo = Math.max(...los);
  const dLa = maxLa - minLa || 1,
    dLo = maxLo - minLo || 1,
    single = list.length === 1;
  const pts = list.map((p) => ({
    x: single ? W / 2 : pad + ((p.lng - minLo) / dLo) * (W - 2 * pad),
    y: single ? H / 2 : pad + ((maxLa - p.lat) / dLa) * (H - 2 * pad),
  }));
  return {
    pts,
    route: pts.map((p, i) => (i ? "L" : "M") + p.x.toFixed(1) + " " + p.y.toFixed(1)).join(" "),
  };
}

// Live countdown to the trip start (replaces the prototype's hardcoded "36 days").
export const TRIP_START = new Date("2026-08-06T00:00:00-04:00");

export function daysAway(now: Date = new Date()): number {
  const ms = TRIP_START.getTime() - now.getTime();
  return Math.max(0, Math.ceil(ms / 86400000));
}
