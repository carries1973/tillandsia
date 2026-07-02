"use client";

import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import { css } from "@/lib/wander/css";
import { Img } from "./Img";
import * as geo from "@/lib/wander/geo";
import { MODEL, SENS, OUT, BK, wowImgId, type Day, type Segment } from "@/lib/wander/trip";
import {
  defaultState,
  loadPersisted,
  persist,
  type WanderState,
} from "@/lib/wander/state";
import * as I from "./icons";

export default function Wander() {
  const [state, setStateRaw] = useState<WanderState>(defaultState);
  const [mounted, setMounted] = useState(false);
  const [away, setAway] = useState<number | null>(null);

  useEffect(() => {
    setStateRaw((s) => ({ ...s, ...loadPersisted() }));
    setAway(geo.daysAway());
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) persist(state);
  }, [state, mounted]);

  const setState = useCallback(
    (patch: Partial<WanderState> | ((prev: WanderState) => Partial<WanderState>)) => {
      setStateRaw((prev) => ({
        ...prev,
        ...(typeof patch === "function" ? patch(prev) : patch),
      }));
    },
    []
  );

  const segIndex = useMemo(() => {
    const idx: Record<string, { seg: Segment; day: Day }> = {};
    MODEL.days.forEach((d) => d.segments.forEach((s) => (idx[s.id] = { seg: s, day: d })));
    return idx;
  }, []);

  const S = state;
  const M = MODEL;
  const idxOf = (seg: Segment) => (S.swaps[seg.id] != null ? S.swaps[seg.id] : 0);
  const cur = (seg: Segment) => seg.options[idxOf(seg)];
  const dayById = (id: string) => M.days.find((d) => d.id === id)!;
  const wOf = (d: Day) => (S.weather[d.id] === "alt" ? d.weather.alt : d.weather.def);
  const openDay = (id: string) => () =>
    setState({ tab: "trip", itinScreen: "day", dayId: id, mapDayId: id, placeSegId: null, sheetSegId: null });
  const openPlace = (id: string) => () => {
    const rec = segIndex[id];
    setState({ placeSegId: id, sheetSegId: null, dayId: rec ? rec.day.id : S.dayId });
  };

  const placeOpen = !!S.placeSegId;
  const sheetOpen = !!S.sheetSegId;
  const showHome = S.tab === "trip" && S.itinScreen === "home" && !placeOpen && !sheetOpen;
  const showDay = S.tab === "trip" && S.itinScreen === "day" && !placeOpen && !sheetOpen;
  const showExplore = S.tab === "explore" && !placeOpen && !sheetOpen;
  const showMap = S.tab === "map" && !placeOpen && !sheetOpen;
  const showPrep = S.tab === "prep" && !placeOpen && !sheetOpen;
  const showNav = !placeOpen && !sheetOpen;

  // ---- shared derived collections ----
  const allOpts = useMemo(() => {
    const out: { seg: Segment; day: Day }[] = [];
    M.days.forEach((d) => d.segments.forEach((seg) => out.push({ seg, day: d })));
    return out;
  }, [M]);

  // ============================ HOME ============================
  function renderHome() {
    const totalStops = M.days.reduce((n, d) => n + d.segments.length, 0);
    const awayLabel = away == null ? "" : ` · ${away} day${away === 1 ? "" : "s"} away`;
    const fSeg = M.days[0].segments[0];
    const catList = ["Dining", "Art & Culture", "Markets", "Cafés", "Outdoors"];
    const catIcon: Record<string, string> = {
      Dining: "🍽",
      "Art & Culture": "🎨",
      Markets: "🥬",
      "Cafés": "☕",
      Outdoors: "🌳",
    };
    const countCat = (c: string) => allOpts.filter((x) => cur(x.seg).cat === c).length;

    return (
      <div className="scroll" style={css("height:100%;overflow-y:auto;padding:0 0 104px")}>
        {/* hero */}
        <div style={css("position:relative;height:376px")}>
          <Img
            src={geo.uimg(M.days[0].hero)}
            seed="arrivalHero"
            alt="Montréal skyline"
            style={css("width:100%;height:100%;object-fit:cover;display:block")}
          />
          <div style={css("position:absolute;inset:0;background:linear-gradient(180deg,rgba(24,27,51,.55) 0%,rgba(24,27,51,.12) 30%,rgba(24,27,51,.32) 62%,rgba(24,27,51,.92) 100%)")} />
          <div style={css("position:absolute;top:54px;left:22px;right:22px;display:flex;justify-content:space-between;align-items:center")}>
            <div style={css("font-size:11px;letter-spacing:2.6px;font-weight:600;color:rgba(255,255,255,.9)")}>YOUR ITINERARY</div>
            <button
              onClick={() => setState({ tab: "explore", exploreSaved: true, exploreCat: "All", query: "", placeSegId: null, sheetSegId: null })}
              aria-label="View saved places"
              style={css("width:38px;height:38px;border:none;border-radius:100px;background:rgba(255,255,255,.16);backdrop-filter:blur(8px);display:flex;align-items:center;justify-content:center;cursor:pointer")}
            >
              <I.Heart size={18} color="#fff" sw={1.9} />
            </button>
          </div>
          <div style={css("position:absolute;left:22px;right:22px;bottom:22px;color:#fff")}>
            <div style={css("display:flex;align-items:center;gap:7px;font-size:13px;font-weight:500;color:rgba(255,255,255,.9)")}>
              <I.PinFill size={14} /> Québec, Canada
            </div>
            <div style={css("font-family:'Newsreader',serif;font-size:60px;font-weight:500;letter-spacing:-1px;line-height:.94;margin-top:8px")}>Montréal</div>
            <div style={css("font-size:14px;font-weight:500;color:rgba(255,255,255,.92);margin-top:12px")}>Aug 6 – 9, 2026{awayLabel}</div>
          </div>
        </div>

        {/* stats bar */}
        <div style={css("margin:-30px 18px 0;position:relative;background:#fff;border-radius:18px;padding:6px;display:flex;box-shadow:0 20px 40px -26px rgba(24,27,51,.6)")}>
          {[
            { value: "4", label: "Days", divider: true },
            { value: String(totalStops), label: "Stops", divider: true },
            { value: "100%", label: "GF-verified", divider: false },
          ].map((st, i) => (
            <div key={i} style={{ ...css("flex:1;text-align:center;padding:12px 4px"), borderRight: st.divider ? "1px solid #EEECE3" : "none" }}>
              <div style={css("font-family:'Newsreader',serif;font-size:24px;font-weight:500;color:#1E2447;line-height:1")}>{st.value}</div>
              <div style={css("font-size:10.5px;font-weight:600;letter-spacing:.4px;color:#9A9EAD;margin-top:5px;text-transform:uppercase")}>{st.label}</div>
            </div>
          ))}
        </div>

        {/* celiac assurance */}
        <div style={css("margin:16px 18px 0;background:#EAF0E7;border-radius:14px;padding:14px 15px")}>
          <div style={css("display:flex;align-items:flex-start;gap:10px")}>
            <div style={css("width:30px;height:30px;border-radius:100px;background:#6E8B6A;display:flex;align-items:center;justify-content:center;flex:none")}>
              <I.Check size={15} color="#fff" sw={2.6} />
            </div>
            <div style={css("font-size:12.5px;line-height:1.45;color:#3E5539;font-weight:500")}>
              Every <b style={{ fontWeight: 700 }}>meal</b> resolves to a <b style={{ fontWeight: 700 }}>dedicated gluten-free kitchen</b>, each with a named backup. Aesthetic cafés are coffee &amp; photos only — never a meal.
            </div>
          </div>
          <div style={css("display:flex;gap:7px;margin-top:12px;flex-wrap:wrap")}>
            <span style={css("display:inline-flex;align-items:center;gap:4px;background:#DCE7D6;color:#4A6544;font-size:10.5px;font-weight:700;padding:4px 9px;border-radius:100px")}>
              <I.Check size={10} color="#6E8B6A" sw={3} />Dedicated GF
            </span>
            <span style={css("display:inline-flex;align-items:center;gap:4px;background:#F3ECDD;color:#8A6D34;font-size:10.5px;font-weight:700;padding:4px 9px;border-radius:100px")}>Confirm prep</span>
            <span style={css("display:inline-flex;align-items:center;gap:4px;background:#EDECE6;color:#7A7E90;font-size:10.5px;font-weight:700;padding:4px 9px;border-radius:100px")}>Coffee only</span>
          </div>
        </div>

        {/* next up */}
        <div onClick={openDay("aug6")} style={css("margin:14px 18px 0;background:#1E2447;border-radius:16px;padding:15px 16px;cursor:pointer")}>
          <div style={css("display:flex;align-items:center;gap:7px;color:#C9B78C;font-size:10px;letter-spacing:1.6px;font-weight:700")}>
            <I.Clock size={12} />NEXT UP · {away == null ? "Trip ahead" : `Trip begins in ${away} days`}
          </div>
          <div style={css("display:flex;justify-content:space-between;align-items:flex-end;margin-top:11px")}>
            <div>
              <div style={css("font-family:'Newsreader',serif;font-size:21px;font-weight:500;color:#fff;line-height:1")}>{cur(fSeg).name}</div>
              <div style={css("font-size:12.5px;color:rgba(255,255,255,.7);margin-top:5px;font-weight:500")}>Thu · {fSeg.time}</div>
            </div>
            <I.ChevronR size={16} />
          </div>
          <div style={css("margin-top:11px;padding-top:11px;border-top:1px solid rgba(255,255,255,.12);color:rgba(255,255,255,.72);font-size:12px;font-weight:500")}>First Leave-By 5:15 PM, right after check-in</div>
        </div>

        {/* category filters */}
        <div style={css("display:flex;justify-content:space-between;align-items:baseline;padding:26px 20px 0")}>
          <span style={css("font-family:'Newsreader',serif;font-size:22px;font-weight:500")}>Browse by interest</span>
        </div>
        <div className="scroll" style={css("display:flex;gap:9px;overflow-x:auto;padding:14px 20px 4px")}>
          {catList.map((c) => (
            <div
              key={c}
              onClick={() => setState({ tab: "explore", exploreCat: c, query: "", exploreSaved: false, placeSegId: null, sheetSegId: null })}
              style={css("flex:none;display:flex;align-items:center;gap:7px;background:#fff;border:1px solid #ECEAE2;padding:9px 14px;border-radius:12px;cursor:pointer;box-shadow:0 4px 14px -12px rgba(24,27,51,.5)")}
            >
              <span style={css("font-size:15px")}>{catIcon[c] || "•"}</span>
              <span style={css("font-size:13px;font-weight:600;color:#3A3E55")}>{c}</span>
              <span style={css("font-size:12px;font-weight:600;color:#B0B3C0")}>{countCat(c)}</span>
            </div>
          ))}
        </div>

        {/* signature moments */}
        <div style={css("padding:26px 20px 0")}>
          <span style={css("font-family:'Newsreader',serif;font-size:22px;font-weight:500")}>Signature moments</span>
          <div style={css("font-size:12.5px;color:#9A9EAD;margin-top:3px;font-weight:500")}>One unforgettable thing each day.</div>
        </div>
        <div className="scroll" style={css("display:flex;gap:14px;overflow-x:auto;padding:15px 20px 6px")}>
          {M.days.map((d) => (
            <div key={d.id} onClick={openDay(d.id)} style={css("flex:none;width:236px;border-radius:18px;overflow:hidden;position:relative;box-shadow:0 16px 32px -22px rgba(24,27,51,.6);cursor:pointer")}>
              <div style={css("position:relative;height:290px")}>
                <Img src={geo.uimg(wowImgId(d.wow.key))} seed={"wow-" + d.id} alt={d.wow.title} style={css("width:100%;height:100%;object-fit:cover;display:block")} />
                <div style={css("position:absolute;inset:0;background:linear-gradient(180deg,rgba(24,27,51,0) 38%,rgba(24,27,51,.9) 100%)")} />
                <div style={css("position:absolute;top:14px;left:14px;font-size:11px;letter-spacing:1.6px;font-weight:600;color:rgba(255,255,255,.92)")}>{d.weekday.toUpperCase()}</div>
                <div style={css("position:absolute;left:16px;right:16px;bottom:16px")}>
                  <div style={css("font-family:'Newsreader',serif;font-size:21px;font-weight:500;color:#fff;line-height:1.15")}>{d.wow.title}</div>
                  <div style={css("font-size:12px;color:rgba(255,255,255,.82);margin-top:6px;font-weight:500;line-height:1.4")}>{d.wow.sub}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* day by day */}
        <div style={css("padding:28px 20px 0")}>
          <span style={css("font-family:'Newsreader',serif;font-size:22px;font-weight:500")}>Day by day</span>
        </div>
        {M.days.map((d) => (
          <div key={d.id} onClick={openDay(d.id)} style={css("margin:14px 18px 0;background:#fff;border-radius:18px;overflow:hidden;box-shadow:0 14px 30px -24px rgba(24,27,51,.55);cursor:pointer;display:flex")}>
            <div style={css("position:relative;width:118px;flex:none")}>
              <Img src={geo.uimg(d.hero)} seed={"day-" + d.id} alt={d.weekday} style={css("width:118px;height:100%;object-fit:cover;display:block")} />
              <div style={css("position:absolute;top:10px;left:10px;background:rgba(255,255,255,.94);border-radius:10px;padding:5px 8px;text-align:center")}>
                <div style={css("font-size:9px;font-weight:700;color:#9A9EAD;letter-spacing:.6px")}>{d.month}</div>
                <div style={css("font-size:19px;font-weight:700;line-height:1;color:#1E2447")}>{d.dayNum}</div>
              </div>
            </div>
            <div style={css("flex:1;min-width:0;padding:14px 15px")}>
              <div style={css("display:flex;justify-content:space-between;align-items:center")}>
                <span style={css("font-size:11px;letter-spacing:1.4px;font-weight:700;color:#9A9EAD;text-transform:uppercase")}>{d.weekday}</span>
                <span style={css("display:flex;align-items:center;gap:4px;font-size:11.5px;font-weight:600;color:#5B6076")}>{wOf(d).label}</span>
              </div>
              <div style={css("font-size:14.5px;font-weight:600;line-height:1.32;margin-top:7px;color:#2A2E48")}>{d.title}</div>
              <div style={css("display:flex;align-items:center;gap:12px;margin-top:11px;font-size:12px;color:#9A9EAD;font-weight:500")}>
                <span>{d.segments.length} stops</span>
                <span style={css("width:3px;height:3px;border-radius:100px;background:#CFD2DB")} />
                <span>{d.walk}</span>
                <span style={css("width:3px;height:3px;border-radius:100px;background:#CFD2DB")} />
                <span>{d.cost}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // ============================ DAY ============================
  function renderDay() {
    const d = dayById(S.dayId);
    const dw = wOf(d);
    const dic = geo.ico(dw.cond);
    const wAlt = S.weather[d.id] === "alt";
    const c = d.contingency;
    const bannerApplied = wAlt && c && c.segId ? S.swaps[c.segId] === c.optIdx : false;
    const showBanner = wAlt && !!c;

    return (
      <div className="scroll" style={css("height:100%;overflow-y:auto;padding:52px 0 104px")}>
        <div style={css("padding:4px 20px 0")}>
          <div onClick={() => setState({ itinScreen: "home" })} style={css("display:inline-flex;align-items:center;gap:6px;color:#1E2447;font-size:13.5px;font-weight:600;cursor:pointer")}>
            <I.ChevronL w={8} h={14} color="#1E2447" sw={2.2} />All days
          </div>
          <div style={css("display:flex;justify-content:space-between;align-items:flex-end;gap:12px;margin-top:15px")}>
            <div>
              <div style={css("font-size:11px;letter-spacing:1.8px;font-weight:700;color:#9A9EAD;text-transform:uppercase")}>{d.weekday}</div>
              <div style={css("font-family:'Newsreader',serif;font-size:38px;font-weight:500;letter-spacing:-.5px;line-height:1;margin-top:4px")}>{d.dateLong}</div>
            </div>
            <div onClick={() => setState((st) => ({ weather: { ...st.weather, [d.id]: st.weather[d.id] === "alt" ? "def" : "alt" } }))} style={css("display:flex;align-items:center;gap:7px;background:#fff;padding:9px 13px;border-radius:12px;cursor:pointer;box-shadow:0 6px 16px -12px rgba(24,27,51,.5)")}>
              {dic === "sun" && <I.WeatherSun size={17} />}
              {dic === "cloud" && <I.WeatherCloud w={18} h={16} />}
              {dic === "rain" && <I.WeatherRain size={18} />}
              <span style={css("font-size:13px;font-weight:600;color:#4A4F66")}>{dw.label}</span>
            </div>
          </div>
          <div style={css("font-size:14px;line-height:1.5;color:#5B6076;margin-top:12px;font-weight:400")}>{d.title}</div>
        </div>

        {/* signature moment banner */}
        <div style={css("margin:18px 18px 0;border-radius:18px;overflow:hidden;position:relative;box-shadow:0 16px 32px -24px rgba(24,27,51,.6)")}>
          <Img src={geo.uimg(wowImgId(d.wow.key))} seed={"wowb-" + d.id} alt={d.wow.title} style={css("width:100%;height:184px;object-fit:cover;display:block")} />
          <div style={css("position:absolute;inset:0;background:linear-gradient(180deg,rgba(24,27,51,.06) 0%,rgba(24,27,51,.8) 100%)")} />
          <div style={css("position:absolute;left:16px;right:16px;bottom:15px")}>
            <div style={css("display:inline-flex;align-items:center;gap:6px;color:#E4D3A6;font-size:10px;letter-spacing:1.8px;font-weight:700")}>
              <I.SigStar size={11} />SIGNATURE MOMENT
            </div>
            <div style={css("font-family:'Newsreader',serif;font-size:22px;font-weight:500;color:#fff;margin-top:7px;line-height:1.15")}>{d.wow.title}</div>
            <div style={css("font-size:12.5px;color:rgba(255,255,255,.85);margin-top:5px;line-height:1.45")}>{d.wow.blurb}</div>
          </div>
        </div>

        {/* weather-adaptive banner */}
        {showBanner && c && (
          <div style={css("margin:14px 18px 0;background:#EAEEF4;border:1px solid #D3DCE7;border-radius:14px;padding:14px 15px")}>
            <div style={css("display:flex;align-items:center;gap:7px;color:#3D566E")}>
              <I.WeatherRain size={15} />
              <span style={css("font-size:10.5px;letter-spacing:1.4px;font-weight:700")}>WEATHER-ADAPTIVE</span>
            </div>
            <div style={css("font-size:13.5px;line-height:1.5;color:#3D4C5E;margin-top:7px")}>{c.text}</div>
            {c.segId &&
              (bannerApplied ? (
                <div style={css("display:inline-flex;align-items:center;gap:6px;margin-top:11px;font-size:13px;font-weight:700;color:#3D566E")}>
                  <I.Check size={15} color="#3D566E" sw={2.6} />Swap applied
                </div>
              ) : (
                <div onClick={() => setState((st) => ({ swaps: { ...st.swaps, [c.segId as string]: c.optIdx as number } }))} style={css("display:inline-block;margin-top:11px;background:#3D566E;color:#fff;font-size:13px;font-weight:600;padding:9px 15px;border-radius:100px;cursor:pointer")}>
                  {c.applyLabel}
                </div>
              ))}
          </div>
        )}

        {/* timeline */}
        <div style={css("padding:20px 18px 0")}>
          {d.segments.map((seg, i) => {
            const p = cur(seg);
            const dl = p.diet.level;
            const saved = !!S.saved[seg.id];
            const isMeal = ["DINNER", "BREAKFAST", "LUNCH", "GF TREAT"].indexOf(p.catLabel) >= 0;
            let bk = "";
            if (seg.options.length > 1) {
              const a = seg.options.find((o, j) => j !== idxOf(seg) && o.diet && o.diet.level === "safe") || seg.options.find((o, j) => j !== idxOf(seg));
              bk = a ? a.name : "";
            } else {
              bk = BK[seg.id] || "";
            }
            const sensory = SENS[p.catLabel] || "";
            const outdoor = !!OUT[p.catLabel];
            const showConnector = i > 0 && !!seg.transit;
            const pp = i > 0 ? cur(d.segments[i - 1]) : null;
            const uberUrl = pp && pp.lat != null ? geo.uber(pp.lat, pp.lng, p.lat, p.lng) : geo.uber(geo.HOME.lat, geo.HOME.lng, p.lat, p.lng);
            const dirUrl = pp && pp.lat != null ? geo.dirChain(pp.lat, pp.lng, p.lat, p.lng) : geo.dir(p.lat, p.lng);

            return (
              <div key={seg.id}>
                {showConnector && (
                  <div style={css("display:flex;align-items:center;gap:9px;padding:3px 4px 3px 12px;margin:3px 0")}>
                    <I.Transit size={15} />
                    <span style={css("flex:1;font-size:12px;font-weight:500;color:#9A9EAD")}>{seg.transit!.label}</span>
                    <a href={uberUrl} target="_blank" rel="noopener" style={css("text-decoration:none;display:inline-flex;align-items:center;gap:4px;background:#1E2447;color:#fff;font-size:10px;font-weight:700;letter-spacing:.3px;padding:4px 9px;border-radius:100px")}>
                      <I.UberCar size={10} />UBER
                    </a>
                  </div>
                )}

                <div style={{ ...css("background:#fff;border-radius:18px;overflow:hidden;box-shadow:0 10px 24px -20px rgba(24,27,51,.55);margin-bottom:12px"), border: seg.isAnchor ? "1.5px solid #DAD0AE" : "1.5px solid transparent" }}>
                  <div onClick={openPlace(seg.id)} style={css("cursor:pointer")}>
                    <div style={css("position:relative;height:150px")}>
                      <Img src={p.img} seed={p.seed + "-" + seg.id} alt={p.name} style={css("width:100%;height:100%;object-fit:cover;display:block")} />
                      <div style={css("position:absolute;inset:0;background:linear-gradient(180deg,rgba(24,27,51,.35) 0%,rgba(24,27,51,0) 40%,rgba(24,27,51,.15) 100%)")} />
                      <div style={css("position:absolute;top:12px;left:12px;display:flex;gap:7px;align-items:center")}>
                        <span style={css("background:rgba(24,27,51,.82);backdrop-filter:blur(4px);color:#fff;font-size:12px;font-weight:700;padding:5px 10px;border-radius:100px")}>{seg.time}</span>
                        {seg.isAnchor && <span style={css("background:#C9B78C;color:#241E10;font-size:9px;letter-spacing:.7px;font-weight:700;padding:5px 9px;border-radius:100px")}>{seg.anchorLabel}</span>}
                      </div>
                      <div onClick={(e) => { e.stopPropagation(); setState((st) => ({ saved: { ...st.saved, [seg.id]: !st.saved[seg.id] } })); }} style={css("position:absolute;top:10px;right:10px;width:34px;height:34px;border-radius:100px;background:rgba(255,255,255,.9);backdrop-filter:blur(4px);display:flex;align-items:center;justify-content:center;cursor:pointer")}>
                        {saved ? <I.Heart size={16} color="#B5484E" fill="#B5484E" /> : <I.Heart size={16} color="#6B7085" sw={1.9} />}
                      </div>
                    </div>
                    <div style={css("padding:13px 15px 3px")}>
                      <div style={css("font-size:10px;font-weight:700;letter-spacing:1px;color:#A9974F")}>{p.catLabel}</div>
                      <div style={css("font-family:'Newsreader',serif;font-size:20px;font-weight:500;line-height:1.12;margin-top:3px")}>{p.name}</div>
                      <div style={css("display:flex;align-items:center;gap:11px;margin-top:9px;flex-wrap:wrap")}>
                        {p.ratingLabel && (
                          <span style={css("display:inline-flex;align-items:center;gap:4px;font-size:12.5px;font-weight:600;color:#20233C")}>
                            <I.Star size={13} />{p.ratingLabel}
                          </span>
                        )}
                        <span style={css("display:inline-flex;align-items:center;gap:4px;font-size:12px;font-weight:500;color:#9A9EAD")}>
                          <I.PinOutline size={12} />{geo.km(p.lat, p.lng)}
                        </span>
                      </div>
                      <div style={css("display:flex;flex-wrap:wrap;gap:6px;margin-top:10px")}>
                        {p.match && <span style={css("display:inline-flex;align-items:center;gap:4px;background:#EEEFF5;color:#464C6B;font-size:10.5px;font-weight:600;padding:4px 9px;border-radius:100px")}>{p.match}</span>}
                        {dl === "safe" && (
                          <span style={css("display:inline-flex;align-items:center;gap:4px;background:#EAF0E7;color:#4A6544;font-size:10.5px;font-weight:600;padding:4px 9px;border-radius:100px")}>
                            <I.Check size={10} color="#6E8B6A" sw={3} />{p.dietLabel}
                          </span>
                        )}
                        {dl === "caution" && (
                          <span style={css("display:inline-flex;align-items:center;gap:4px;background:#F3ECDD;color:#8A6D34;font-size:10.5px;font-weight:600;padding:4px 9px;border-radius:100px")}>
                            <I.Caution size={11} color="#A9974F" sw={2.4} />{p.dietLabel}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  {isMeal && bk && (
                    <div style={css("display:flex;align-items:center;gap:6px;margin:11px 15px 0;font-size:11.5px;color:#4A6544;font-weight:600")}>
                      <I.ShieldCheck size={13} color="#6E8B6A" sw={2} />Backup: {bk}
                    </div>
                  )}
                  {sensory && (
                    <div style={css("display:flex;align-items:center;gap:6px;margin:8px 15px 0;font-size:11px;color:#9A9EAD;font-weight:500")}>
                      <I.Pulse size={12} />{sensory}{outdoor ? " · outdoor, Aug heat" : ""}
                    </div>
                  )}
                  {seg.leaveBy && (
                    <div style={css("display:flex;align-items:center;gap:7px;margin:11px 15px 0;background:#1E2447;color:#fff;padding:8px 12px;border-radius:11px")}>
                      <I.Clock size={14} />
                      <span style={css("font-size:12.5px;font-weight:600")}>Leave by {seg.leaveBy}</span>
                    </div>
                  )}
                  <div style={css("display:flex;gap:8px;padding:12px 15px 14px")}>
                    <a href={dirUrl} target="_blank" rel="noopener" style={css("flex:1;text-decoration:none;display:flex;align-items:center;justify-content:center;gap:6px;background:#F1F0F6;color:#2A2E48;font-size:12.5px;font-weight:600;padding:9px;border-radius:10px")}>
                      <I.Navigation size={14} />Directions
                    </a>
                    {seg.options.length > 1 && (
                      <div onClick={(e) => { e.stopPropagation(); setState({ sheetSegId: seg.id }); }} style={css("flex:1;display:flex;align-items:center;justify-content:center;gap:6px;background:#1E2447;color:#fff;font-size:12.5px;font-weight:600;padding:9px;border-radius:10px;cursor:pointer")}>
                        <I.Swap size={14} />Swap · {seg.options.length}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // ============================ EXPLORE ============================
  function renderExplore() {
    const catList = ["Dining", "Art & Culture", "Markets", "Cafés", "Outdoors"];
    const cats = ["All", ...catList, "Anchors"];
    const q = S.query.trim().toLowerCase();
    let items = allOpts.filter((x) => {
      const p = cur(x.seg);
      if (S.exploreSaved && !S.saved[x.seg.id]) return false;
      if (S.exploreCat !== "All") {
        if (S.exploreCat === "Anchors") {
          if (!x.seg.isAnchor) return false;
        } else if (p.cat !== S.exploreCat) return false;
      }
      if (q) {
        const hay = (p.name + " " + p.neigh + " " + p.catLabel + " " + p.match).toLowerCase();
        if (hay.indexOf(q) < 0) return false;
      }
      return true;
    });
    const seen: Record<string, number> = {};
    items = items.filter((x) => {
      const k = cur(x.seg).name;
      if (seen[k]) return false;
      seen[k] = 1;
      return true;
    });

    return (
      <div className="scroll" style={css("height:100%;overflow-y:auto;padding:52px 0 104px")}>
        <div style={css("padding:6px 20px 0")}>
          <div style={css("font-family:'Newsreader',serif;font-size:32px;font-weight:500;letter-spacing:-.4px")}>Explore</div>
          <div style={css("font-size:13px;color:#9A9EAD;margin-top:3px;font-weight:500")}>Every stop across your four days.</div>
        </div>
        <div style={css("margin:15px 20px 0;background:#fff;border-radius:14px;padding:12px 14px;display:flex;align-items:center;gap:10px;box-shadow:0 8px 20px -16px rgba(24,27,51,.5)")}>
          <I.Search size={17} />
          <input value={S.query} onChange={(e) => setState({ query: e.target.value })} placeholder="Search places, food, neighbourhoods…" aria-label="Search places" style={css("flex:1;font-size:14px;color:#20233C")} />
          {S.query.length > 0 && <div onClick={() => setState({ query: "" })} style={css("cursor:pointer;color:#B0B3C0;font-size:18px;line-height:1")}>×</div>}
        </div>
        <div className="scroll" style={css("display:flex;gap:8px;overflow-x:auto;padding:13px 20px 4px")}>
          {cats.map((c) => {
            const active = S.exploreCat === c;
            return (
              <div key={c} onClick={() => setState({ exploreCat: c })} style={active ? css("flex:none;background:#1E2447;color:#fff;font-size:12.5px;font-weight:600;padding:8px 14px;border-radius:100px;cursor:pointer") : css("flex:none;background:#fff;color:#5B6076;font-size:12.5px;font-weight:600;padding:8px 14px;border-radius:100px;cursor:pointer;border:1px solid #ECEAE2")}>
                {c}
              </div>
            );
          })}
        </div>
        <div style={css("display:flex;align-items:center;justify-content:space-between;padding:16px 20px 6px")}>
          <span style={css("font-size:12px;font-weight:600;color:#9A9EAD")}>{items.length} place{items.length === 1 ? "" : "s"}</span>
          <div onClick={() => setState((st) => ({ exploreSaved: !st.exploreSaved }))} style={css("display:flex;align-items:center;gap:6px;cursor:pointer")}>
            <I.Heart size={14} color={S.exploreSaved ? "#B5484E" : "#6B7085"} fill={S.exploreSaved ? "#B5484E" : "none"} sw={1.9} />
            <span style={{ ...css("font-size:12.5px;font-weight:600"), color: S.exploreSaved ? "#B5484E" : "#5B6076" }}>Saved</span>
          </div>
        </div>
        <div style={css("padding:2px 20px 0")}>
          {items.length === 0 && <div style={css("text-align:center;color:#9A9EAD;font-size:13.5px;padding:50px 20px;font-weight:500")}>Nothing matches yet — try another interest or search term.</div>}
          {items.map((x) => {
            const p = cur(x.seg);
            return (
              <div key={x.seg.id} onClick={openPlace(x.seg.id)} style={css("display:flex;gap:12px;background:#fff;border-radius:16px;padding:10px;margin-bottom:11px;box-shadow:0 8px 20px -18px rgba(24,27,51,.5);cursor:pointer")}>
                <Img src={p.img} seed={p.seed + "-ex-" + x.seg.id} alt={p.name} style={css("width:78px;height:78px;border-radius:11px;object-fit:cover;flex:none;display:block")} />
                <div style={css("flex:1;min-width:0;padding-top:2px")}>
                  <div style={css("display:flex;justify-content:space-between;align-items:flex-start;gap:8px")}>
                    <div style={css("font-size:10px;font-weight:700;letter-spacing:.8px;color:#A9974F")}>{p.catLabel}</div>
                    {!!S.saved[x.seg.id] && <I.Heart size={15} color="#B5484E" fill="#B5484E" />}
                  </div>
                  <div style={css("font-family:'Newsreader',serif;font-size:17px;font-weight:500;line-height:1.12;margin-top:2px")}>{p.name}</div>
                  <div style={css("display:flex;align-items:center;gap:10px;margin-top:7px")}>
                    {p.ratingLabel && (
                      <span style={css("display:inline-flex;align-items:center;gap:3px;font-size:12px;font-weight:600;color:#20233C")}>
                        <I.Star size={12} />{p.ratingLabel}
                      </span>
                    )}
                    <span style={css("font-size:11.5px;font-weight:500;color:#9A9EAD")}>{x.day.weekday} · {x.seg.time}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // ============================ MAP ============================
  function renderMap() {
    const mdd = dayById(S.mapDayId);
    const mapPts = mdd.segments.map((seg) => ({ seg, p: cur(seg) })).filter((x) => x.p.lat != null && x.p.catLabel !== "FLIGHT");
    const proj = geo.project(mapPts.map((x) => ({ lat: x.p.lat as number, lng: x.p.lng as number })));
    const pins = mapPts.map((x, i) => {
      const px = proj.pts[i].x;
      const py = proj.pts[i].y;
      return {
        x: px,
        cy: py - 6,
        ty: py - 1,
        tail: "M" + (px - 6) + " " + (py - 1) + " L" + (px + 6) + " " + (py - 1) + " L" + px + " " + (py + 9) + " Z",
        n: i + 1,
        name: x.p.name,
        time: x.seg.time,
        img: x.p.img,
        seed: x.p.seed + "-map-" + x.seg.id,
        dirUrl: geo.dir(x.p.lat, x.p.lng),
        segId: x.seg.id,
      };
    });

    return (
      <div className="scroll" style={css("height:100%;overflow-y:auto;padding:52px 0 104px")}>
        <div style={css("padding:6px 20px 0")}>
          <div style={css("font-family:'Newsreader',serif;font-size:32px;font-weight:500;letter-spacing:-.4px")}>Trip map</div>
          <div style={css("font-size:13px;color:#9A9EAD;margin-top:3px;font-weight:500")}>Routed, one day at a time.</div>
        </div>
        <div className="scroll" style={css("display:flex;gap:8px;overflow-x:auto;padding:15px 20px 4px")}>
          {M.days.map((dd) => {
            const active = dd.id === S.mapDayId;
            return (
              <div key={dd.id} onClick={() => setState({ mapDayId: dd.id })} style={active ? css("flex:none;background:#1E2447;color:#fff;font-size:12.5px;font-weight:600;padding:9px 16px;border-radius:100px;cursor:pointer") : css("flex:none;background:#fff;color:#5B6076;font-size:12.5px;font-weight:600;padding:9px 16px;border-radius:100px;cursor:pointer;border:1px solid #ECEAE2")}>
                {dd.weekday.slice(0, 3)} {dd.dayNum}
              </div>
            );
          })}
        </div>
        <div style={css("margin:12px 18px 0;border-radius:20px;overflow:hidden;box-shadow:0 14px 30px -22px rgba(24,27,51,.6)")}>
          <svg viewBox="0 0 330 340" style={css("width:100%;display:block")}>
            <defs>
              <pattern id="gm" width="30" height="30" patternUnits="userSpaceOnUse">
                <path d="M30 0H0V30" fill="none" stroke="rgba(110,120,150,.12)" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="330" height="340" fill="#EDEAE2" />
            <rect width="330" height="340" fill="url(#gm)" />
            <path d="M-10 250 Q 130 205 210 250 T 350 235" fill="none" stroke="rgba(120,140,170,.25)" strokeWidth="20" />
            <path d="M120 -10 L150 360" stroke="rgba(200,200,205,.6)" strokeWidth="7" fill="none" />
            <path d={proj.route} fill="none" stroke="#1E2447" strokeWidth="2.4" strokeDasharray="1 7" strokeLinecap="round" />
            {pins.map((p) => (
              <g key={p.segId} onClick={openPlace(p.segId)} style={css("cursor:pointer")}>
                <circle cx={p.x} cy={p.cy} r="15" fill="#1E2447" />
                <path d={p.tail} fill="#1E2447" />
                <text x={p.x} y={p.ty} textAnchor="middle" fontFamily="DM Sans, sans-serif" fontSize="14" fontWeight="700" fill="#fff">{p.n}</text>
              </g>
            ))}
          </svg>
        </div>
        <div style={css("padding:16px 20px 0;font-size:11px;letter-spacing:1.2px;font-weight:700;color:#A9974F")}>{(mdd.weekday + " · " + mdd.dateLong).toUpperCase()}</div>
        <div style={css("padding:4px 20px 0")}>
          {pins.map((p) => (
            <div key={p.segId} style={css("display:flex;align-items:center;gap:12px;background:#fff;border-radius:14px;padding:9px;margin-top:9px;box-shadow:0 8px 20px -18px rgba(24,27,51,.5)")}>
              <div style={css("width:26px;height:26px;border-radius:100px;background:#1E2447;color:#fff;font-size:12.5px;font-weight:700;display:flex;align-items:center;justify-content:center;flex:none")}>{p.n}</div>
              <Img src={p.img} seed={p.seed} alt={p.name} style={css("width:42px;height:42px;border-radius:10px;object-fit:cover;flex:none")} />
              <div style={css("flex:1;min-width:0")} onClick={openPlace(p.segId)}>
                <div style={css("font-family:'Newsreader',serif;font-size:16px;font-weight:500;line-height:1.1")}>{p.name}</div>
                <div style={css("font-size:11px;font-weight:600;letter-spacing:.4px;color:#A9974F;margin-top:3px")}>{p.time}</div>
              </div>
              <a href={p.dirUrl} target="_blank" rel="noopener" aria-label={"Directions to " + p.name} style={css("width:34px;height:34px;border-radius:100px;background:#F1F0F6;display:flex;align-items:center;justify-content:center;flex:none;text-decoration:none")}>
                <I.Navigation size={15} />
              </a>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ============================ PLAN (prep) ============================
  function renderPrep() {
    const filt = M.budget.rows.filter((r) => S.budgetCat === "All" || r.cat === S.budgetCat);
    const filtTotal = filt.reduce((n, r) => n + r.amount, 0);
    let run = 0;
    const budgetRows = filt.map((r) => {
      run += r.amount;
      return { label: r.label, amount: r.amount === 0 ? "Free" : "$" + r.amount, running: "$" + run };
    });
    const resIds = Object.keys(S.reserved).filter((k) => S.reserved[k]);
    const reservations = resIds
      .map((id) => {
        const rec = segIndex[id];
        if (!rec) return null;
        const p = cur(rec.seg);
        return { id, name: p.name, day: rec.day.weekday, time: rec.seg.time, img: p.img, seed: p.seed + "-res-" + id, status: p.book || p.web ? "Booking link saved" : "Personal note" };
      })
      .filter(Boolean) as { id: string; name: string; day: string; time: string; img: string; seed: string; status: string }[];

    return (
      <div className="scroll" style={css("height:100%;overflow-y:auto;padding:52px 0 104px")}>
        <div style={css("padding:6px 20px 0")}>
          <div style={css("font-family:'Newsreader',serif;font-size:32px;font-weight:500;letter-spacing:-.4px")}>Plan</div>
          <div style={css("font-size:13px;color:#9A9EAD;margin-top:3px;font-weight:500")}>Your trip command centre.</div>
        </div>

        {/* budget */}
        <div style={css("padding:22px 20px 0;display:flex;align-items:baseline;justify-content:space-between")}>
          <span style={css("font-family:'Newsreader',serif;font-size:21px;font-weight:500")}>Budget</span>
          <span style={css("font-family:'Newsreader',serif;font-size:24px;font-weight:500;color:#1E2447")}>${filtTotal}</span>
        </div>
        <div className="scroll" style={css("display:flex;gap:7px;overflow-x:auto;padding:11px 20px 4px")}>
          {["All", "Transport", "Food", "Activities"].map((c) => {
            const active = S.budgetCat === c;
            return (
              <div key={c} onClick={() => setState({ budgetCat: c })} style={active ? css("flex:none;background:#1E2447;color:#fff;font-size:12px;font-weight:600;padding:7px 13px;border-radius:100px;cursor:pointer") : css("flex:none;background:#fff;color:#5B6076;font-size:12px;font-weight:600;padding:7px 13px;border-radius:100px;cursor:pointer;border:1px solid #ECEAE2")}>
                {c}
              </div>
            );
          })}
        </div>
        <div style={css("margin:9px 18px 0;background:#fff;border-radius:15px;padding:4px 16px;box-shadow:0 8px 20px -18px rgba(24,27,51,.5)")}>
          {budgetRows.map((r, i) => (
            <div key={i} style={css("display:flex;align-items:center;gap:10px;padding:12px 0;border-bottom:1px solid #F1EFE7")}>
              <div style={css("flex:1;min-width:0")}>
                <div style={css("font-size:13.5px;font-weight:500;color:#31344C")}>{r.label}</div>
                <div style={css("font-size:10.5px;color:#A9974F;font-weight:600;margin-top:2px")}>Running total · {r.running}</div>
              </div>
              <div style={css("font-size:14px;font-weight:700;color:#1E2447")}>{r.amount}</div>
            </div>
          ))}
          <div style={css("font-size:11.5px;color:#9A9EAD;padding:11px 0;font-weight:500")}>{M.budget.note}</div>
        </div>

        {/* reservations */}
        <div style={css("padding:24px 20px 0")}>
          <span style={css("font-family:'Newsreader',serif;font-size:21px;font-weight:500")}>Reservations</span>
        </div>
        {reservations.length === 0 && (
          <div style={css("margin:11px 18px 0;background:#fff;border-radius:15px;padding:20px 16px;box-shadow:0 8px 20px -18px rgba(24,27,51,.5);display:flex;gap:12px;align-items:center")}>
            <div style={css("width:34px;height:34px;border-radius:100px;background:#F1F0F6;display:flex;align-items:center;justify-content:center;flex:none")}>
              <I.Calendar size={17} />
            </div>
            <div style={css("font-size:12.5px;line-height:1.5;color:#7A7E90;font-weight:500")}>
              Nothing reserved yet. Tap <b style={{ color: "#31344C" }}>Reserve</b> on any stop and it lands here with its booking link.
            </div>
          </div>
        )}
        <div style={css("padding:2px 18px 0")}>
          {reservations.map((r) => (
            <div key={r.id} style={css("display:flex;gap:12px;background:#fff;border-radius:15px;padding:10px;margin-top:9px;box-shadow:0 8px 20px -18px rgba(24,27,51,.5)")}>
              <Img src={r.img} seed={r.seed} alt={r.name} style={css("width:60px;height:60px;border-radius:11px;object-fit:cover;flex:none")} />
              <div style={css("flex:1;min-width:0")} onClick={openPlace(r.id)}>
                <div style={css("font-family:'Newsreader',serif;font-size:16px;font-weight:500;line-height:1.1")}>{r.name}</div>
                <div style={css("font-size:11.5px;color:#9A9EAD;font-weight:500;margin-top:4px")}>{r.day} · {r.time}</div>
                <div style={css("display:inline-flex;align-items:center;gap:4px;margin-top:6px;font-size:10.5px;font-weight:700;color:#4A6544;background:#EAF0E7;padding:3px 8px;border-radius:100px")}>
                  <I.Check size={10} color="#6E8B6A" sw={3} />{r.status}
                </div>
              </div>
              <div onClick={(e) => { e.stopPropagation(); setState((st) => { const n = { ...st.reserved }; delete n[r.id]; return { reserved: n }; }); }} style={css("cursor:pointer;color:#C2C7D0;padding:4px;flex:none")}>
                <I.X size={16} />
              </div>
            </div>
          ))}
        </div>

        {/* optional ideas */}
        <div style={css("padding:24px 20px 0")}>
          <span style={css("font-family:'Newsreader',serif;font-size:21px;font-weight:500")}>Optional ideas</span>
          <div style={css("font-size:12.5px;color:#9A9EAD;margin-top:3px;font-weight:500")}>Extra stops to swap in if you have time.</div>
        </div>
        <div style={css("padding:12px 18px 0")}>
          {M.optionalIdeas.map((o) => {
            const saved = !!S.savedOpt[o.name];
            return (
              <div key={o.name} style={css("background:#fff;border-radius:16px;overflow:hidden;margin-bottom:11px;box-shadow:0 8px 20px -18px rgba(24,27,51,.5)")}>
                <div style={css("display:flex")}>
                  <Img src={o.img} seed={o.seed} alt={o.name} style={css("width:92px;min-height:100%;object-fit:cover;flex:none")} />
                  <div style={css("flex:1;min-width:0;padding:12px 13px")}>
                    <div style={css("display:flex;align-items:center;gap:7px")}>
                      <span style={css("font-size:10px;font-weight:700;letter-spacing:.8px;color:#A9974F")}>{o.cat}</span>
                      <span style={css("font-size:10px;font-weight:600;color:#9A9EAD")}>· {o.weather}</span>
                    </div>
                    <div style={css("font-family:'Newsreader',serif;font-size:17px;font-weight:500;line-height:1.1;margin-top:3px")}>{o.name}</div>
                    <div style={css("font-size:12px;line-height:1.45;color:#5B6076;margin-top:5px")}>{o.why}</div>
                  </div>
                </div>
                <div style={css("display:flex;gap:8px;padding:0 13px 12px")}>
                  {saved ? (
                    <div onClick={() => setState((st) => ({ savedOpt: { ...st.savedOpt, [o.name]: !st.savedOpt[o.name] } }))} style={css("flex:1;display:flex;align-items:center;justify-content:center;gap:6px;background:#EAF0E7;color:#4A6544;font-size:12px;font-weight:700;padding:9px;border-radius:10px;cursor:pointer")}>
                      <I.Check size={13} color="#4A6544" sw={2.6} />Shortlisted
                    </div>
                  ) : (
                    <div onClick={() => setState((st) => ({ savedOpt: { ...st.savedOpt, [o.name]: !st.savedOpt[o.name] } }))} style={css("flex:1;display:flex;align-items:center;justify-content:center;gap:6px;background:#F1F0F6;color:#2A2E48;font-size:12px;font-weight:600;padding:9px;border-radius:10px;cursor:pointer")}>
                      <I.Plus size={13} />Shortlist
                    </div>
                  )}
                  <a href={geo.dir(o.lat, o.lng)} target="_blank" rel="noopener" style={css("flex:1;text-decoration:none;display:flex;align-items:center;justify-content:center;gap:6px;background:#1E2447;color:#fff;font-size:12px;font-weight:600;padding:9px;border-radius:10px")}>
                    <I.Navigation size={13} color="#C9B78C" />Directions
                  </a>
                </div>
              </div>
            );
          })}
        </div>

        {/* contingencies */}
        <div style={css("padding:24px 20px 0")}>
          <span style={css("font-family:'Newsreader',serif;font-size:21px;font-weight:500")}>If plans change</span>
        </div>
        <div style={css("padding:12px 18px 0")}>
          {M.contingencies.map((c, i) => (
            <div key={i} style={css("background:#fff;border-radius:14px;padding:13px 15px;margin-bottom:9px;box-shadow:0 8px 20px -18px rgba(24,27,51,.5)")}>
              <div style={css("font-size:11px;font-weight:700;letter-spacing:.5px;color:#A9974F")}>{c.trigger}</div>
              <div style={css("font-size:13px;line-height:1.5;color:#4A4F5C;margin-top:5px;font-weight:400")}>{c.text}</div>
            </div>
          ))}
        </div>

        {/* getting around */}
        <div style={css("padding:24px 20px 0")}>
          <span style={css("font-family:'Newsreader',serif;font-size:21px;font-weight:500")}>Getting around</span>
          <div style={css("font-size:12.5px;color:#9A9EAD;margin-top:3px;font-weight:500")}>Every transit option, with real fares.</div>
        </div>
        <div style={css("margin:12px 18px 0;background:#fff;border-radius:15px;padding:2px 16px;box-shadow:0 8px 20px -18px rgba(24,27,51,.5)")}>
          {M.transitInfo.rows.map((t, i) => (
            <div key={i} style={css("padding:13px 0;border-bottom:1px solid #F1EFE7")}>
              <div style={css("font-size:12.5px;font-weight:700;color:#1E2447")}>{t.mode}</div>
              <div style={css("font-size:12.5px;line-height:1.5;color:#5B6076;margin-top:4px")}>{t.detail}</div>
            </div>
          ))}
          <div style={css("font-size:11px;color:#9A9EAD;padding:12px 0;font-weight:500")}>{M.transitInfo.verified}</div>
        </div>

        {/* celiac promise */}
        <div style={css("margin:16px 18px 0;background:#EAF0E7;border:1px solid #D2E0CC;border-radius:16px;padding:16px")}>
          <div style={css("display:flex;align-items:center;gap:7px;color:#4A6544")}>
            <I.Check size={14} color="#6E8B6A" sw={2.6} />
            <span style={css("font-size:10.5px;letter-spacing:1.4px;font-weight:700")}>CELIAC PROMISE</span>
          </div>
          <div style={css("font-size:13.5px;line-height:1.55;color:#3E5539;margin-top:8px")}>{M.prep.note}</div>
        </div>

        {/* bookings & reminders */}
        <div style={css("padding:24px 20px 0")}>
          <span style={css("font-family:'Newsreader',serif;font-size:21px;font-weight:500")}>Bookings &amp; reminders</span>
        </div>
        <div style={css("padding:11px 18px 0")}>
          {M.prep.actions.map((a) => {
            const done = !!S.actionsDone[a.id];
            return (
              <div key={a.id} onClick={() => setState((st) => ({ actionsDone: { ...st.actionsDone, [a.id]: !st.actionsDone[a.id] } }))} style={css("display:flex;align-items:flex-start;gap:12px;background:#fff;border-radius:14px;padding:14px;margin-bottom:9px;box-shadow:0 8px 20px -18px rgba(24,27,51,.5);cursor:pointer")}>
                {done ? (
                  <div style={css("width:22px;height:22px;border-radius:7px;background:#1E2447;flex:none;display:flex;align-items:center;justify-content:center")}>
                    <I.Check size={13} color="#fff" sw={3} />
                  </div>
                ) : (
                  <div style={css("width:22px;height:22px;border-radius:7px;border:2px solid #D2D4DE;flex:none")} />
                )}
                <div style={css("flex:1;min-width:0")}>
                  <div style={{ ...css("font-size:14px;line-height:1.4;font-weight:500"), color: done ? "#A2A6B4" : "#31344C", textDecoration: done ? "line-through" : "none" }}>{a.task}</div>
                  <div style={css("font-size:11.5px;font-weight:700;color:#A9974F;margin-top:3px")}>{a.lead}</div>
                </div>
              </div>
            );
          })}
        </div>

        {/* packing list */}
        <div style={css("padding:20px 20px 0")}>
          <span style={css("font-family:'Newsreader',serif;font-size:21px;font-weight:500")}>Packing list</span>
        </div>
        {M.prep.packing.map((g) => (
          <div key={g.group} style={css("margin:11px 18px 0;background:#fff;border-radius:15px;padding:15px 16px;box-shadow:0 8px 20px -18px rgba(24,27,51,.5)")}>
            <div style={css("font-size:10.5px;letter-spacing:1.2px;font-weight:700;color:#A9974F")}>{g.group}</div>
            <div style={css("margin-top:9px")}>
              {g.items.map((it) => {
                const done = !!S.packDone[it.id];
                return (
                  <div key={it.id} onClick={() => setState((st) => ({ packDone: { ...st.packDone, [it.id]: !st.packDone[it.id] } }))} style={css("display:flex;align-items:center;gap:11px;padding:7px 0;cursor:pointer")}>
                    {done ? (
                      <div style={css("width:19px;height:19px;border-radius:100px;background:#1E2447;flex:none;display:flex;align-items:center;justify-content:center")}>
                        <I.Check size={11} color="#fff" sw={3.2} />
                      </div>
                    ) : (
                      <div style={css("width:19px;height:19px;border-radius:100px;border:2px solid #D2D4DE;flex:none")} />
                    )}
                    <span style={{ ...css("font-size:13.5px;font-weight:500"), color: done ? "#A2A6B4" : "#4A4F5C", textDecoration: done ? "line-through" : "none" }}>{it.text}</span>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    );
  }

  // ============================ PLACE DETAIL ============================
  function renderPlace() {
    if (!S.placeSegId || !segIndex[S.placeSegId]) return null;
    const rec = segIndex[S.placeSegId];
    const seg = rec.seg;
    const p = cur(seg);
    const dl = p.diet.level;
    const saved = !!S.saved[seg.id];
    const reserved = !!S.reserved[seg.id];
    const bookUrl = p.book || p.web || "";
    const isMeal = ["DINNER", "BREAKFAST", "LUNCH", "GF TREAT"].indexOf(p.catLabel) >= 0;
    let backupName = "";
    if (seg.options.length > 1) {
      const a = seg.options.find((o, j) => j !== idxOf(seg) && o.diet && o.diet.level === "safe") || seg.options.find((o, j) => j !== idxOf(seg));
      backupName = a ? a.name : "";
    } else {
      backupName = BK[seg.id] || "";
    }
    const srcLabel = p.source || (p.web ? geo.domain(p.web) : "");
    const gIdx = rec.day.segments.indexOf(seg);
    const gFrom = gIdx > 0 ? cur(rec.day.segments[gIdx - 1]) : { lat: geo.HOME.lat, lng: geo.HOME.lng, name: "your base (Radisson)" };
    const gFromName = gIdx > 0 ? cur(rec.day.segments[gIdx - 1]).name : "your base (Radisson)";
    const gKm = p.lat != null && gFrom.lat != null ? geo.roadKm(gFrom.lat, gFrom.lng, p.lat, p.lng) : 0;
    const gAir = (p.lat != null && Math.abs(p.lat - 45.4706) < 0.02) || (gFrom.lat != null && Math.abs(gFrom.lat - 45.4706) < 0.02);
    const gh = {
      fromName: gFromName,
      transitUrl: geo.dirChain(gFrom.lat as number, gFrom.lng as number, p.lat, p.lng),
      transitFare: "$3.75 single · covered by your 3-day pass",
      walkable: gKm > 0.05 && gKm < 0.9,
      walkTime: "≈ " + Math.max(3, Math.round(gKm * 12)) + " min walk",
      uberUrl: geo.uber(gFrom.lat as number, gFrom.lng as number, p.lat, p.lng),
      uberTime: gAir ? "≈ 35–40 min" : "≈ " + Math.max(6, Math.round(gKm * 2)) + " min",
      uberCost: gAir ? "≈ $65–80 metered" : "≈ $" + Math.round(4.1 + 2.05 * gKm) + " (meter est.)",
      note: "Transit time is live in Maps; taxi/Uber costs are meter-rate estimates. Fares verified Jul 1, 2026.",
    };
    const access = p.catLabel === "FLIGHT" ? "" : "Step-free access";
    const hasGoodToKnow = p.catLabel !== "FLIGHT";
    const hasGetHere = p.catLabel !== "FLIGHT";
    const toggleReserve = () => setState((st) => ({ reserved: { ...st.reserved, [seg.id]: !st.reserved[seg.id] } }));

    return (
      <div style={css("position:absolute;inset:0;z-index:40;background:#F7F5F0;display:flex;flex-direction:column")}>
        <div className="scroll" style={css("flex:1;overflow-y:auto")}>
          <div style={css("position:relative;height:304px")}>
            <Img src={p.img} seed={p.seed + "-" + seg.id} alt={p.name} style={css("width:100%;height:100%;object-fit:cover;display:block")} />
            <div style={css("position:absolute;inset:0;background:linear-gradient(180deg,rgba(24,27,51,.32) 0%,rgba(24,27,51,0) 32%,rgba(24,27,51,.72) 100%)")} />
            <button onClick={() => setState({ placeSegId: null })} aria-label="Close" style={css("position:absolute;top:52px;left:16px;width:40px;height:40px;border:none;border-radius:100px;background:rgba(255,255,255,.92);display:flex;align-items:center;justify-content:center;cursor:pointer")}>
              <I.ChevronL w={9} h={16} color="#1E2447" sw={2.4} />
            </button>
            <button onClick={() => setState((st) => ({ saved: { ...st.saved, [seg.id]: !st.saved[seg.id] } }))} aria-label={saved ? "Remove from saved" : "Save place"} style={css("position:absolute;top:52px;right:16px;width:40px;height:40px;border:none;border-radius:100px;background:rgba(255,255,255,.92);display:flex;align-items:center;justify-content:center;cursor:pointer")}>
              {saved ? <I.Heart size={19} color="#B5484E" fill="#B5484E" /> : <I.Heart size={19} color="#1E2447" sw={1.9} />}
            </button>
            <div style={css("position:absolute;left:20px;right:20px;bottom:18px")}>
              <div style={css("font-size:10.5px;font-weight:700;letter-spacing:1px;color:rgba(255,255,255,.86)")}>{p.catLabel}</div>
              <div style={css("font-family:'Newsreader',serif;font-size:30px;font-weight:500;color:#fff;margin-top:5px;line-height:1.06;letter-spacing:-.3px")}>{p.name}</div>
              <div style={css("font-size:13px;color:rgba(255,255,255,.86);margin-top:6px;font-weight:500")}>{p.neigh} · {geo.km(p.lat, p.lng) || "in the city"} from base</div>
            </div>
          </div>

          <div style={css("padding:16px 20px 34px")}>
            <div style={css("display:flex;flex-wrap:wrap;gap:8px")}>
              {p.ratingLabel && (
                <span style={css("display:inline-flex;align-items:center;gap:5px;background:#fff;color:#20233C;font-size:12.5px;font-weight:600;padding:7px 11px;border-radius:100px;box-shadow:0 4px 12px -10px rgba(24,27,51,.5)")}>
                  <I.Star size={12} />{p.ratingLabel}
                </span>
              )}
              {dl === "safe" && (
                <span style={css("display:inline-flex;align-items:center;gap:5px;background:#EAF0E7;color:#4A6544;font-size:12.5px;font-weight:600;padding:7px 11px;border-radius:100px")}>
                  <I.Check size={12} color="#6E8B6A" sw={2.8} />{p.dietLabel}
                </span>
              )}
              {dl === "caution" && (
                <span style={css("display:inline-flex;align-items:center;gap:5px;background:#F3ECDD;color:#8A6D34;font-size:12.5px;font-weight:600;padding:7px 11px;border-radius:100px")}>
                  <I.Caution size={13} color="#A9974F" sw={2.2} />{p.dietLabel}
                </span>
              )}
            </div>

            {p.match && (
              <div style={css("display:inline-flex;align-items:center;gap:6px;background:#EEEFF5;color:#464C6B;font-size:12px;font-weight:600;padding:8px 12px;border-radius:11px;margin-top:14px")}>
                <I.SigStar size={13} color="#8891B0" />{p.match}
              </div>
            )}

            <div style={css("margin-top:18px")}>
              <div style={css("font-size:11px;letter-spacing:1px;font-weight:700;color:#A9974F")}>WHY THIS EARNS THE SLOT</div>
              <div style={css("font-size:15px;line-height:1.55;color:#31344C;margin-top:9px;font-weight:400;text-wrap:pretty")}>{p.why}</div>
            </div>

            {p.dietNote && (
              <div style={css("margin-top:16px;background:#F3ECDD;border-radius:13px;padding:14px 15px")}>
                <div style={css("font-size:10.5px;letter-spacing:1px;font-weight:700;color:#8A6D34")}>DIETARY SAFETY</div>
                <div style={css("font-size:13.5px;line-height:1.55;color:#6E5628;margin-top:6px")}>{p.dietNote}</div>
              </div>
            )}

            {p.review && (
              <div style={css("margin-top:18px")}>
                <div style={css("font-size:11px;letter-spacing:1px;font-weight:700;color:#9A9EAD")}>WHAT PEOPLE SAY</div>
                <div style={css("font-size:13.5px;line-height:1.55;color:#5B6076;margin-top:8px")}>{p.review}</div>
              </div>
            )}

            {(p.hours || p.price) && (
              <div style={css("display:flex;gap:10px;margin-top:18px")}>
                {p.hours && (
                  <div style={css("flex:1;background:#fff;border-radius:13px;padding:12px 13px;box-shadow:0 4px 14px -12px rgba(24,27,51,.5)")}>
                    <div style={css("font-size:9.5px;letter-spacing:.8px;font-weight:700;color:#A9974F")}>HOURS</div>
                    <div style={css("font-size:12.5px;font-weight:500;color:#31344C;margin-top:5px;line-height:1.35")}>{p.hours}</div>
                  </div>
                )}
                {p.price && (
                  <div style={css("flex:1;background:#fff;border-radius:13px;padding:12px 13px;box-shadow:0 4px 14px -12px rgba(24,27,51,.5)")}>
                    <div style={css("font-size:9.5px;letter-spacing:.8px;font-weight:700;color:#A9974F")}>PRICE</div>
                    <div style={css("font-size:12.5px;font-weight:500;color:#31344C;margin-top:5px;line-height:1.35")}>{p.price}</div>
                  </div>
                )}
              </div>
            )}

            {hasGoodToKnow && (
              <div style={css("margin-top:16px")}>
                <div style={css("font-size:11px;letter-spacing:1px;font-weight:700;color:#A9974F")}>GOOD TO KNOW</div>
                <div style={css("display:flex;flex-wrap:wrap;gap:8px;margin-top:9px")}>
                  {SENS[p.catLabel] && (
                    <span style={css("display:inline-flex;align-items:center;gap:5px;background:#fff;color:#4A4F66;font-size:12px;font-weight:600;padding:7px 11px;border-radius:100px;box-shadow:0 4px 12px -10px rgba(24,27,51,.5)")}>
                      <I.Pulse size={12} color="#8891B0" />{SENS[p.catLabel]}
                    </span>
                  )}
                  {!!OUT[p.catLabel] && (
                    <span style={css("display:inline-flex;align-items:center;gap:5px;background:#fff;color:#4A4F66;font-size:12px;font-weight:600;padding:7px 11px;border-radius:100px;box-shadow:0 4px 12px -10px rgba(24,27,51,.5)")}>
                      <I.SunSmall size={12} />Outdoor · Aug sun &amp; humidity
                    </span>
                  )}
                  {access && (
                    <span style={css("display:inline-flex;align-items:center;gap:5px;background:#fff;color:#4A4F66;font-size:12px;font-weight:600;padding:7px 11px;border-radius:100px;box-shadow:0 4px 12px -10px rgba(24,27,51,.5)")}>
                      <I.Access size={12} />{access}
                    </span>
                  )}
                </div>
              </div>
            )}

            {hasGetHere && (
              <div style={css("margin-top:18px")}>
                <div style={css("font-size:11px;letter-spacing:1px;font-weight:700;color:#A9974F")}>GETTING HERE · FROM {gh.fromName}</div>
                <div style={css("margin-top:9px;background:#fff;border-radius:14px;padding:2px 15px;box-shadow:0 4px 14px -12px rgba(24,27,51,.5)")}>
                  <a href={gh.transitUrl} target="_blank" rel="noopener" style={css("text-decoration:none;display:flex;align-items:center;gap:12px;padding:13px 0;border-bottom:1px solid #F1EFE7")}>
                    <div style={css("width:34px;height:34px;border-radius:10px;background:#EEF0F6;display:flex;align-items:center;justify-content:center;flex:none")}>
                      <I.Transit size={17} color="#2A2E48" sw={1.9} />
                    </div>
                    <div style={css("flex:1;min-width:0")}>
                      <div style={css("font-size:13.5px;font-weight:600;color:#20233C")}>Transit · live route</div>
                      <div style={css("font-size:11.5px;color:#9A9EAD;margin-top:1px")}>{gh.transitFare}</div>
                    </div>
                    <I.ChevronR size={15} color="#C2C7D0" sw={2} />
                  </a>
                  {gh.walkable && (
                    <a href={gh.transitUrl} target="_blank" rel="noopener" style={css("text-decoration:none;display:flex;align-items:center;gap:12px;padding:13px 0;border-bottom:1px solid #F1EFE7")}>
                      <div style={css("width:34px;height:34px;border-radius:10px;background:#EAF0E7;display:flex;align-items:center;justify-content:center;flex:none")}>
                        <I.Walk size={17} />
                      </div>
                      <div style={css("flex:1;min-width:0")}>
                        <div style={css("font-size:13.5px;font-weight:600;color:#20233C")}>Walk</div>
                        <div style={css("font-size:11.5px;color:#9A9EAD;margin-top:1px")}>{gh.walkTime}</div>
                      </div>
                    </a>
                  )}
                  <a href={gh.uberUrl} target="_blank" rel="noopener" style={css("text-decoration:none;display:flex;align-items:center;gap:12px;padding:13px 0")}>
                    <div style={css("width:34px;height:34px;border-radius:10px;background:#1E2447;display:flex;align-items:center;justify-content:center;flex:none")}>
                      <I.UberCar size={17} color="#C9B78C" sw={1.9} cy={18.5} r={1.2} seat="M5 16h14M6.5 16l1.2-5h8.6l1.2 5M9 11l.8-3h4.4l.8 3" />
                    </div>
                    <div style={css("flex:1;min-width:0")}>
                      <div style={css("font-size:13.5px;font-weight:600;color:#20233C")}>Uber · {gh.uberTime}</div>
                      <div style={css("font-size:11.5px;color:#9A9EAD;margin-top:1px")}>{gh.uberCost}</div>
                    </div>
                    <span style={css("background:#1E2447;color:#fff;font-size:11px;font-weight:700;padding:6px 12px;border-radius:100px")}>Open</span>
                  </a>
                </div>
                <div style={css("font-size:11px;color:#9A9EAD;margin-top:7px;line-height:1.45")}>{gh.note}</div>
              </div>
            )}

            {isMeal && backupName && (
              <div style={css("margin-top:16px;display:flex;align-items:center;gap:11px;background:#fff;border-radius:13px;padding:12px 14px;box-shadow:0 4px 14px -12px rgba(24,27,51,.5)")}>
                <div style={css("width:30px;height:30px;border-radius:9px;background:#EAF0E7;display:flex;align-items:center;justify-content:center;flex:none")}>
                  <I.ShieldCheck size={15} color="#6E8B6A" sw={2} />
                </div>
                <div style={css("flex:1;min-width:0")}>
                  <div style={css("font-size:9.5px;letter-spacing:.8px;font-weight:700;color:#A9974F")}>SAFE BACKUP IF NEEDED</div>
                  <div style={css("font-size:14px;font-weight:600;color:#31344C;margin-top:2px")}>{backupName}</div>
                </div>
              </div>
            )}

            {p.uncertainty && (
              <div style={css("margin-top:12px;background:#F3ECDD;border-radius:13px;padding:12px 14px;display:flex;gap:9px")}>
                <I.Caution size={16} color="#C08A2B" sw={2} style={css("flex:none;margin-top:1px")} />
                <div style={css("font-size:12.5px;line-height:1.5;color:#8A6D34;font-weight:500")}>{p.uncertainty}</div>
              </div>
            )}

            {reserved && (
              <div style={css("margin-top:16px;background:#EAF0E7;border:1px solid #CADCC3;border-radius:14px;padding:14px 15px;display:flex;align-items:center;gap:12px")}>
                <div style={css("width:34px;height:34px;border-radius:100px;background:#6E8B6A;display:flex;align-items:center;justify-content:center;flex:none")}>
                  <I.Check size={17} color="#fff" sw={2.6} />
                </div>
                <div style={css("flex:1")}>
                  <div style={css("font-size:14px;font-weight:700;color:#3E5539")}>Reservation noted</div>
                  <div style={css("font-size:12px;color:#5E7358;margin-top:2px")}>Added to your trip · {rec.day.weekday}, {seg.time}</div>
                </div>
                <div onClick={toggleReserve} style={css("cursor:pointer;color:#7C9276;font-size:12.5px;font-weight:600")}>Undo</div>
              </div>
            )}

            <div style={css("display:flex;gap:9px;margin-top:16px")}>
              <a href={geo.dir(p.lat, p.lng)} target="_blank" rel="noopener" style={css("flex:1;text-decoration:none;text-align:center;background:#1E2447;color:#fff;font-size:13.5px;font-weight:600;padding:14px;border-radius:13px;display:flex;align-items:center;justify-content:center;gap:7px")}>
                <I.Navigation size={15} color="#C9B78C" />Directions
              </a>
              {bookUrl &&
                (reserved ? (
                  <div onClick={() => { if (bookUrl) window.open(bookUrl, "_blank", "noopener"); }} style={css("flex:1;text-align:center;background:#EEECE4;color:#8A7A55;font-size:13.5px;font-weight:600;padding:14px;border-radius:13px;cursor:pointer")}>Reserved ✓</div>
                ) : (
                  <a href={bookUrl} target="_blank" rel="noopener" onClick={toggleReserve} style={css("flex:1;text-decoration:none;text-align:center;background:#C9B78C;color:#241E10;font-size:13.5px;font-weight:700;padding:14px;border-radius:13px")}>Reserve</a>
                ))}
            </div>
            {(p.web || p.menu) && (
              <div style={css("display:flex;gap:9px;margin-top:9px")}>
                {p.web && <a href={p.web} target="_blank" rel="noopener" style={css("flex:1;text-decoration:none;text-align:center;background:#fff;color:#2A2E48;font-size:13px;font-weight:600;padding:12px;border-radius:12px;box-shadow:0 4px 14px -12px rgba(24,27,51,.5)")}>Website</a>}
                {p.menu && <a href={p.menu} target="_blank" rel="noopener" style={css("flex:1;text-decoration:none;text-align:center;background:#fff;color:#2A2E48;font-size:13px;font-weight:600;padding:12px;border-radius:12px;box-shadow:0 4px 14px -12px rgba(24,27,51,.5)")}>Menu</a>}
              </div>
            )}

            {seg.options.length > 1 && (
              <div onClick={() => setState({ sheetSegId: seg.id, placeSegId: null })} style={css("margin-top:14px;display:flex;align-items:center;justify-content:center;gap:7px;border:1.5px solid #DAD6C7;color:#8A7A55;padding:13px;border-radius:13px;cursor:pointer;font-size:13.5px;font-weight:700")}>
                <I.Swap size={15} color="#8A7A55" sw={2.2} />See ranked alternatives
              </div>
            )}

            <div style={css("margin-top:18px;padding-top:14px;border-top:1px solid #ECEAE2;display:flex;align-items:center;gap:8px;color:#9A9EAD")}>
              <I.ShieldCheck size={13} color="#6E8B6A" sw={2} />
              <span style={css("font-size:11.5px;font-weight:500")}>Verified {p.verifiedOn}{srcLabel ? " · source: " + srcLabel : ""}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ============================ SWAP SHEET ============================
  function renderSheet() {
    if (!S.sheetSegId || !segIndex[S.sheetSegId]) return null;
    const seg = segIndex[S.sheetSegId].seg;
    const ci = idxOf(seg);
    return (
      <div style={css("position:absolute;inset:0;z-index:50")}>
        <div onClick={() => setState({ sheetSegId: null })} style={css("position:absolute;inset:0;background:rgba(18,20,38,.55)")} />
        <div className="scroll" style={css("position:absolute;left:0;right:0;bottom:0;max-height:84%;overflow-y:auto;background:#F7F5F0;border-radius:26px 26px 0 0;padding:12px 20px 32px;box-shadow:0 -14px 40px -12px rgba(18,20,38,.5)")}>
          <div style={css("width:42px;height:4.5px;border-radius:100px;background:#D6D3CA;margin:2px auto 15px")} />
          <div style={css("display:inline-flex;align-items:center;gap:6px;background:#EEEFF5;color:#464C6B;font-size:10.5px;font-weight:700;letter-spacing:.8px;padding:5px 10px;border-radius:100px")}>
            <I.Swap size={11} color="#464C6B" sw={2.2} />RANKED ALTERNATIVES
          </div>
          <div style={css("font-family:'Newsreader',serif;font-size:24px;font-weight:500;line-height:1.12;margin-top:9px")}>{seg.optionMeta ? seg.optionMeta.need : "Alternatives"}</div>
          <div style={css("font-size:13px;line-height:1.5;color:#6B7085;margin-top:7px")}>{seg.optionMeta ? seg.optionMeta.notes : ""}</div>
          <div style={css("margin-top:15px")}>
            {seg.options.map((p, i) => {
              const dl = p.diet.level;
              const isCur = i === ci;
              return (
                <div key={i} onClick={() => setState((st) => ({ swaps: { ...st.swaps, [seg.id]: i }, sheetSegId: null }))} style={{ ...css("background:#fff;border-radius:16px;overflow:hidden;margin-bottom:11px;cursor:pointer;box-shadow:0 8px 22px -18px rgba(24,27,51,.5);display:flex"), border: `2px solid ${isCur ? "#C9B78C" : "#FFFFFF"}` }}>
                  <Img src={p.img} seed={p.seed + "-opt" + i} alt={p.name} style={css("width:92px;min-height:100%;object-fit:cover;flex:none;display:block")} />
                  <div style={css("flex:1;min-width:0;padding:12px 13px")}>
                    <div style={css("display:flex;align-items:center;gap:8px")}>
                      <div style={{ ...css("width:22px;height:22px;border-radius:100px;font-size:12px;font-weight:700;display:flex;align-items:center;justify-content:center;flex:none"), background: isCur ? "#C9B78C" : "#F0EEE6", color: isCur ? "#241E10" : "#9A9EAD" }}>{i + 1}</div>
                      <span style={css("font-family:'Newsreader',serif;font-size:16.5px;font-weight:500;line-height:1.1")}>{p.name}</span>
                      {isCur && <span style={css("font-size:8.5px;letter-spacing:.5px;font-weight:700;color:#4A6544;background:#E4EDE0;padding:3px 7px;border-radius:100px;flex:none")}>IN PLAN</span>}
                    </div>
                    <div style={css("font-size:12.5px;line-height:1.45;color:#5B6076;margin-top:8px")}>{p.tradeoff}</div>
                    <div style={css("display:flex;flex-wrap:wrap;gap:6px;margin-top:9px")}>
                      {p.ratingLabel && (
                        <span style={css("display:inline-flex;align-items:center;gap:3px;font-size:11.5px;font-weight:600;color:#20233C")}>
                          <I.Star size={11} />{p.ratingLabel}
                        </span>
                      )}
                      {dl === "safe" && (
                        <span style={css("display:inline-flex;align-items:center;gap:4px;background:#EAF0E7;color:#4A6544;font-size:10.5px;font-weight:600;padding:3px 8px;border-radius:100px")}>
                          <I.Check size={10} color="#6E8B6A" sw={3} />{p.dietLabel}
                        </span>
                      )}
                      {dl === "caution" && (
                        <span style={css("display:inline-flex;align-items:center;gap:4px;background:#F3ECDD;color:#8A6D34;font-size:10.5px;font-weight:600;padding:3px 8px;border-radius:100px")}>
                          <I.Caution size={11} color="#A9974F" sw={2.4} />{p.dietLabel}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // ============================ NAV ============================
  function renderNav() {
    const item = (
      active: boolean,
      label: string,
      onClick: () => void,
      activeIcon: ReactNode,
      inactiveIcon: ReactNode
    ) => (
      <div onClick={onClick} style={css("flex:1;display:flex;flex-direction:column;align-items:center;gap:4px;cursor:pointer")}>
        {active ? activeIcon : inactiveIcon}
        <span style={{ ...css("font-size:10px"), fontWeight: active ? 700 : 600, color: active ? "#1E2447" : "#A2A6B4" }}>{label}</span>
      </div>
    );
    return (
      <div style={css("flex:none;position:relative;z-index:30;display:flex;padding:9px 12px 24px;background:rgba(247,245,240,.94);backdrop-filter:blur(16px);border-top:1px solid #E7E4DB")}>
        {item(
          S.tab === "trip",
          "Trip",
          () => setState({ tab: "trip", placeSegId: null, sheetSegId: null }),
          <svg width="23" height="23" viewBox="0 0 24 24" fill="#1E2447" aria-hidden="true"><path d="M4 4h16a1 1 0 0 1 1 1v3H3V5a1 1 0 0 1 1-1zM3 10h18v9a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-9zm4 3v4h4v-4H7z" /></svg>,
          <svg width="23" height="23" viewBox="0 0 24 24" fill="none" stroke="#A2A6B4" strokeWidth="1.9" strokeLinejoin="round" aria-hidden="true"><rect x="3" y="4" width="18" height="16" rx="1.5" /><path d="M3 9h18M7 13h4v4H7z" /></svg>
        )}
        {item(
          S.tab === "explore",
          "Explore",
          () => setState({ tab: "explore", placeSegId: null, sheetSegId: null }),
          <svg width="23" height="23" viewBox="0 0 24 24" fill="none" stroke="#1E2447" strokeWidth="2.2" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="M21 21l-4-4" strokeLinecap="round" /></svg>,
          <svg width="23" height="23" viewBox="0 0 24 24" fill="none" stroke="#A2A6B4" strokeWidth="1.9" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="M21 21l-4-4" strokeLinecap="round" /></svg>
        )}
        {item(
          S.tab === "map",
          "Map",
          () => setState({ tab: "map", placeSegId: null, sheetSegId: null }),
          <svg width="23" height="23" viewBox="0 0 24 24" fill="#1E2447" aria-hidden="true"><path d="M9 3L3 5v16l6-2 6 2 6-2V3l-6 2-6-2z" /></svg>,
          <svg width="23" height="23" viewBox="0 0 24 24" fill="none" stroke="#A2A6B4" strokeWidth="1.9" strokeLinejoin="round" aria-hidden="true"><path d="M9 3L3 5v16l6-2 6 2 6-2V3l-6 2-6-2z" /><path d="M9 3v16M15 5v16" /></svg>
        )}
        {item(
          S.tab === "prep",
          "Plan",
          () => setState({ tab: "prep", placeSegId: null, sheetSegId: null }),
          <svg width="23" height="23" viewBox="0 0 24 24" fill="#1E2447" aria-hidden="true"><path d="M8 4h8v3H8zM6 6h1v2h10V6h1a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1zm2.5 7h7v-1.6h-7zm0 4h5v-1.6h-5z" /></svg>,
          <svg width="23" height="23" viewBox="0 0 24 24" fill="none" stroke="#A2A6B4" strokeWidth="1.9" strokeLinejoin="round" aria-hidden="true"><rect x="5" y="5" width="14" height="16" rx="1.5" /><path d="M9 4h6v3H9z" /><path d="M8.5 12h7M8.5 16h5" strokeLinecap="round" /></svg>
        )}
      </div>
    );
  }

  // ============================ SHELL ============================
  return (
    <div style={css("min-height:100vh;width:100%;display:flex;align-items:center;justify-content:center;background:#181B33")}>
      <div
        style={css(
          "width:100%;max-width:430px;height:100vh;max-height:932px;position:relative;overflow:hidden;display:flex;flex-direction:column;background:#F7F5F0;color:#20233C;box-shadow:0 30px 80px -30px rgba(0,0,0,.6)"
        )}
      >
        <div style={css("flex:1;min-height:0;position:relative;overflow:hidden")}>
          {mounted && (
            <>
              {showHome && renderHome()}
              {showDay && renderDay()}
              {showExplore && renderExplore()}
              {showMap && renderMap()}
              {showPrep && renderPrep()}
              {placeOpen && renderPlace()}
              {sheetOpen && renderSheet()}
            </>
          )}
        </div>
        {mounted && showNav && renderNav()}
      </div>
    </div>
  );
}
