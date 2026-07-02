// Persisted + ephemeral UI state, mirroring the prototype's DC state and its
// localStorage contract (key `wander-mtl-v1`).

export interface WanderState {
  // ephemeral UI
  tab: "trip" | "explore" | "map" | "prep";
  itinScreen: "home" | "day";
  dayId: string;
  placeSegId: string | null;
  sheetSegId: string | null;
  mapDayId: string;
  query: string;
  exploreCat: string;
  exploreSaved: boolean;
  budgetCat: string;
  // persisted
  swaps: Record<string, number>;
  weather: Record<string, "alt" | "def">;
  saved: Record<string, boolean>;
  reserved: Record<string, boolean>;
  actionsDone: Record<string, boolean>;
  packDone: Record<string, boolean>;
  savedOpt: Record<string, boolean>;
}

export const STORAGE_KEY = "wander-mtl-v1";

export function defaultState(): WanderState {
  return {
    tab: "trip",
    itinScreen: "home",
    dayId: "aug6",
    placeSegId: null,
    sheetSegId: null,
    mapDayId: "aug6",
    query: "",
    exploreCat: "All",
    exploreSaved: false,
    budgetCat: "All",
    swaps: {},
    weather: {},
    saved: {},
    reserved: {},
    actionsDone: {},
    packDone: {},
    savedOpt: {},
  };
}

type Persisted = Pick<
  WanderState,
  "swaps" | "weather" | "saved" | "reserved" | "actionsDone" | "packDone" | "savedOpt"
>;

export function loadPersisted(): Partial<WanderState> {
  try {
    const raw = typeof window !== "undefined" ? window.localStorage.getItem(STORAGE_KEY) : null;
    if (!raw) return {};
    const o = JSON.parse(raw) as Partial<Persisted>;
    return {
      swaps: o.swaps || {},
      weather: o.weather || {},
      saved: o.saved || {},
      reserved: o.reserved || {},
      actionsDone: o.actionsDone || {},
      packDone: o.packDone || {},
      savedOpt: o.savedOpt || {},
    };
  } catch {
    return {};
  }
}

export function persist(s: WanderState): void {
  try {
    if (typeof window === "undefined") return;
    const data: Persisted = {
      swaps: s.swaps,
      weather: s.weather,
      saved: s.saved,
      reserved: s.reserved,
      actionsDone: s.actionsDone,
      packDone: s.packDone,
      savedOpt: s.savedOpt,
    };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // ignore write failures (private mode, quota, etc.)
  }
}
