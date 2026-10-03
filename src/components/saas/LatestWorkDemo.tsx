import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { ChartColumn, ChevronRight, Calendar, Download, Hand, Mail, MousePointer2, User, FishingHook, AtSign, MousePointerClick } from "lucide-react";
import { campaignHistory, groups, pct1 } from "../case-study/sublime/acmeMock";
import "../case-study/sublime/sublimeUi.css";
import "../case-study/sublime/SimulationOverview.css";
import "../case-study/sublime/ResultsLeaderboard.css";
import "./LatestWorkDemo.css";

// The Latest work card on Home: the Sublime reporting dashboard, playing
// itself like a product demo. The pieces rise in and the figures count up,
// then a cursor switches the range to 7d (the figures change), the
// dashboard scrolls up to the tables below, the cursor opens the "+2" list
// on the first repeat clicker and rests on the most vulnerable group, then
// it scrolls back, switches to 30d and leaves, and the loop starts again.
// It plays only while on screen; with reduced motion, or a hidden tab, it
// shows the finished frame and the cursor never appears.

const DESIGN_W = 1000; // the dashboard is laid out at this width, then scaled to fit

type Range = "7d" | "30d";
const WINDOWS: Record<Range, number> = { "7d": 1, "30d": 4 };

const totals = (range: Range) => {
  const list = campaignHistory.slice(-WINDOWS[range]);
  const sent = list.reduce((s, c) => s + c.sent, 0);
  const clicked = list.reduce((s, c) => s + c.clicked, 0);
  const reported = list.reduce((s, c) => s + c.reported, 0);
  return { campaigns: list.length, sent, click: (clicked / sent) * 100, report: (reported / sent) * 100 };
};

const clickers = [
  { name: "Jordan Ellis", group: "Finance", campaigns: ["Q3 payroll portal update", "Q2 invoice approval", "Q1 benefits enrollment"] },
  { name: "Riley Park", group: "Sales", campaigns: ["Q3 payroll portal update", "Q2 IT shared file", "Q1 benefits enrollment"] },
  { name: "Sam Okafor", group: "Finance", campaigns: ["Q3 payroll portal update", "Q2 invoice approval"] },
  { name: "Casey Moreno", group: "Customer support", campaigns: ["Q3 payroll portal update", "Q2 IT shared file"] },
];

const ranked = [...groups].sort((a, b) => b.clicked / b.recipients - a.clicked / a.recipients);

// Eases a number toward its target. Starts at 0 until `active`, so the
// first reveal counts up from nothing.
function useTween(target: number, active: boolean, instant: boolean) {
  const [v, setV] = useState(0);
  const from = useRef(0);
  useEffect(() => {
    if (!active) return;
    if (instant || document.hidden) {
      from.current = target;
      setV(target);
      return;
    }
    const start = from.current;
    const t0 = performance.now();
    let raf = 0;
    const step = (now: number) => {
      const p = Math.min((now - t0) / 520, 1);
      const next = start + (target - start) * (1 - Math.pow(1 - p, 3));
      from.current = next;
      setV(next);
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [target, active, instant]);
  return v;
}

const pctText = (n: number) => `${n.toFixed(1).replace(/\.0$/, "")}%`;

// `zoom` is the dashboard's width as a share of its container (it is
// centered); `top` is how far down it starts.
export function LatestWorkDemo({ zoom = 0.84, top = "4%" }: { zoom?: number; top?: string }) {
  const root = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.4);
  const [still] = useState(
    () =>
      typeof window !== "undefined" &&
      (window.matchMedia("(prefers-reduced-motion: reduce)").matches || document.documentElement.classList.contains("motion-skip")),
  );
  const [live, setLive] = useState(false);
  const [range, setRange] = useState<Range>("30d");
  const [openRow, setOpenRow] = useState<number | null>(null);
  const [hot, setHot] = useState<string | null>(null);
  const [cursor, setCursor] = useState({ x: 0, y: 0, show: false });
  const [clicks, setClicks] = useState(0);
  // How far the dashboard has scrolled up inside the card, in screen px.
  const [scrollY, setScrollY] = useState(0);

  // Fit the dashboard to its container: `zoom` of its width, centered,
  // tucked near the top, and running off the bottom edge.
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const fit = () => setScale((el.clientWidth * zoom) / DESIGN_W);
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(el);
    return () => ro.disconnect();
  }, [zoom]);

  // The script. Runs while the card is on screen, and stops (to begin
  // again from the top of the loop) when it leaves.
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    if (still) {
      setLive(true);
      return;
    }
    let token = 0;
    let started = false;
    const sleep = (ms: number, t: number) =>
      new Promise<void>((res, rej) => window.setTimeout(() => (t === token ? res() : rej()), ms));
    const point = (sel: string) => {
      const target = el.querySelector(sel);
      if (!target) return null;
      const r = target.getBoundingClientRect();
      const b = el.getBoundingClientRect();
      return { x: r.left - b.left + r.width / 2 + 7, y: r.top - b.top + r.height / 2 + 7 };
    };
    const move = async (sel: string, t: number, wait = 900) => {
      const p = point(sel);
      if (!p) return;
      setCursor((c) => ({ x: p.x, y: p.y, show: true }));
      await sleep(wait, t);
    };
    // Scroll so `sel` fills the lower part of the card and runs off its
    // bottom edge, so no empty window shows beneath it.
    const scrollTo = async (sel: string, t: number) => {
      const target = el.querySelector(sel);
      if (!target) return;
      const r = target.getBoundingClientRect();
      const b = el.getBoundingClientRect();
      const want = Math.max(24, b.height + 14 - r.height);
      setScrollY((y) => Math.max(0, y + (r.top - b.top) - want));
      await sleep(900, t);
    };
    const tap = (t: number) => {
      if (t === token) setClicks((n) => n + 1);
    };

    const play = async (t: number) => {
      try {
        if (!started) {
          started = true;
          setLive(true);
          await sleep(1500, t);
        }
        for (;;) {
          const w = el.clientWidth;
          const h = el.clientHeight;
          setCursor({ x: w + 24, y: h * 0.7, show: false });
          await sleep(60, t);
          await move('[data-demo="r7"]', t, 760);
          tap(t);
          setRange("7d");
          await sleep(1300, t);
          await scrollTo('[data-demo="tables"]', t);
          await move('[data-demo="more0"]', t, 760);
          setOpenRow(0);
          await sleep(1500, t);
          setOpenRow(null);
          await sleep(150, t);
          await move('[data-demo="rowFinance"]', t, 760);
          setHot("Finance");
          await sleep(1100, t);
          setHot(null);
          setScrollY(0);
          await sleep(900, t);
          await move('[data-demo="r30"]', t, 760);
          tap(t);
          setRange("30d");
          await sleep(1300, t);
          setCursor((c) => ({ ...c, x: el.clientWidth + 24, show: false }));
          await sleep(1600, t);
        }
      } catch {
        /* superseded: the card scrolled away */
      }
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        token++;
        if (entry.isIntersecting && !document.hidden) {
          void play(token);
        } else {
          setOpenRow(null);
          setHot(null);
          setRange("30d");
          setScrollY(0);
          setCursor((c) => ({ ...c, show: false }));
        }
      },
      { threshold: 0.35 },
    );
    io.observe(el);
    return () => {
      token++;
      io.disconnect();
    };
  }, [still]);

  const t = totals(range);
  const campaigns = useTween(t.campaigns, live, still);
  const sent = useTween(t.sent, live, still);
  const click = useTween(t.click, live, still);
  const report = useTween(t.report, live, still);

  const stats = [
    { icon: FishingHook, tone: "sky", value: String(Math.round(campaigns)), label: "Total campaigns run" },
    { icon: Mail, tone: "ink", value: Math.round(sent).toLocaleString("en-US"), label: "Total recipients simulated" },
    { icon: MousePointer2, tone: "blue", value: pctText(click), label: "Overall click rate" },
    { icon: User, tone: "orange", value: pctText(report), label: "Overall user report rate" },
  ] as const;

  const rise = (i: number) => ({ "data-rise": "", style: { ["--i" as string]: i } }) as const;

  return (
    <div ref={root} className="lwd absolute inset-0 overflow-hidden" data-live={live} data-static={still} aria-hidden="true">
      <div
        className={cn("su absolute origin-top-left", !still && "transition-transform duration-[800ms] ease-[cubic-bezier(0.45,0,0.2,1)]")}
        style={{ width: DESIGN_W, left: `${((1 - zoom) / 2) * 100}%`, top, transform: `translateY(${-scrollY}px) scale(${scale})` }}
      >
        {/* The browser window */}
        <div className="overflow-hidden rounded-t-[10px] bg-[#fafafa] shadow-[0_1px_3px_rgba(0,0,0,0.08),0_10px_30px_rgba(0,0,0,0.08)]" style={{ minHeight: 1250 }}>
          <div className="flex h-[38px] items-center gap-3 border-b border-[#e6e6e6] bg-[#f4f4f4] px-4">
            <span className="flex gap-1.5">
              <i className="size-2.5 rounded-full bg-[#dcdcdc]" />
              <i className="size-2.5 rounded-full bg-[#dcdcdc]" />
              <i className="size-2.5 rounded-full bg-[#dcdcdc]" />
            </span>
            <span className="flex-1 text-center font-mono text-[11px] text-[#767676]">security.acmecorp.example/reports/simulations</span>
            <span className="w-[42px]" />
          </div>

          <div className="p-5">
            <div className="su-card so" {...rise(0)}>
              <div className="so-crumbs">
                <ChartColumn aria-hidden="true" strokeWidth={2} />
                <span>Reports</span>
                <ChevronRight aria-hidden="true" strokeWidth={2} className="so-crumb-sep" />
                <span>Phishing Simulation Overview</span>
              </div>
              <div className="so-body">
                <div className="so-toolbar">
                  <div className="so-summary">
                    <span>
                      <FishingHook aria-hidden="true" strokeWidth={2} />
                      {Math.round(campaigns)} {Math.round(campaigns) === 1 ? "Campaign" : "Campaigns"} Run
                    </span>
                    <span className="so-bullet" />
                    <span>
                      <Mail aria-hidden="true" strokeWidth={2} />
                      {Math.round(sent).toLocaleString("en-US")} Recipients Simulated
                    </span>
                    <span className="so-bullet" />
                    <span>
                      <Hand aria-hidden="true" strokeWidth={2} />
                      12 Blocked Deliveries
                    </span>
                  </div>
                  <div className="so-actions">
                    <div className="so-range">
                      <span data-demo="r7" data-on={range === "7d"}>7d</span>
                      <span data-demo="r30" data-on={range === "30d"}>30d</span>
                      <span>60d</span>
                      <span>90d</span>
                      <span>
                        <Calendar aria-hidden="true" strokeWidth={2} />
                      </span>
                    </div>
                    <span className="so-download">
                      <Download aria-hidden="true" strokeWidth={2} />
                    </span>
                  </div>
                </div>
                <h4 className="so-title">Phishing Simulation Overview</h4>
                <p className="so-sub">Breakdown of Phishing Simulation data across all campaigns</p>
                <div className="so-stats">
                  {stats.map(({ icon: Icon, tone, value, label }) => (
                    <div key={label} className="so-stat">
                      <span className={`so-hex so-hex--${tone}`}>
                        <Icon strokeWidth={2.25} />
                      </span>
                      <span className="so-value">{value}</span>
                      <span className="so-label">{label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div data-demo="tables" className="mt-5 grid grid-cols-[1.18fr_1fr] gap-5">
              <div className="su-card rl-card relative z-[2]" {...rise(2)}>
                <div className="su-card-head">
                  <MousePointerClick aria-hidden="true" strokeWidth={2} />
                  <h4 className="su-card-title">Repeat Clickers</h4>
                </div>
                <div className="rl-scroll">
                  <table className="rl-table">
                    <colgroup>
                      <col style={{ width: "20%" }} />
                      <col style={{ width: "28%" }} />
                      <col style={{ width: "9%" }} />
                      <col style={{ width: "43%" }} />
                    </colgroup>
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Group</th>
                        <th>Clicks</th>
                        <th>Campaigns</th>
                      </tr>
                    </thead>
                    <tbody>
                      {clickers.map((p, i) => (
                        <tr key={p.name} data-open={openRow === i} {...rise(3 + i)}>
                          <th>{p.name}</th>
                          <td>{p.group}</td>
                          <td>{p.campaigns.length}</td>
                          <td>
                            <span className="rl-campaigns">
                              <span className="rl-latest">{p.campaigns[0]}</span>
                              <span className="rl-more">
                                <span data-demo={`more${i}`} data-open={openRow === i} className="su-pill rl-more-btn">
                                  +{p.campaigns.length - 1}
                                </span>
                                <span className="rl-pop" hidden={openRow !== i}>
                                  <span className="rl-pop-label">Also clicked</span>
                                  {p.campaigns.slice(1).map((c) => (
                                    <span key={c} className="rl-pop-item">
                                      {c}
                                    </span>
                                  ))}
                                </span>
                              </span>
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="su-card rl-card" {...rise(3)}>
                <div className="su-card-head">
                  <AtSign aria-hidden="true" strokeWidth={2} />
                  <h4 className="su-card-title">Group Leaderboard</h4>
                </div>
                <div className="rl-scroll">
                  <table className="rl-table">
                    <colgroup>
                      <col style={{ width: "39%" }} />
                      <col style={{ width: "15%" }} />
                      <col style={{ width: "14%" }} />
                      <col style={{ width: "14%" }} />
                      <col style={{ width: "18%" }} />
                    </colgroup>
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Recipients</th>
                        <th>Open Rate</th>
                        <th>Click Rate</th>
                        <th>Report Rate</th>
                      </tr>
                    </thead>
                    <tbody>
                      {ranked.map((g, i) => (
                        <tr key={g.name} data-demo={g.name === "Finance" ? "rowFinance" : undefined} data-hot={hot === g.name} {...rise(4 + i)}>
                          <th>
                            <span className="rl-name">
                              {g.name}
                              {i === 0 && (
                                <span className="su-pill su-pill--vulnerable">
                                  <span className="su-pill-dot" />
                                  Vulnerable
                                </span>
                              )}
                              {i === ranked.length - 1 && (
                                <span className="su-pill su-pill--safest">
                                  <span className="su-pill-dot" />
                                  Safest
                                </span>
                              )}
                            </span>
                          </th>
                          <td>{g.recipients}</td>
                          <td>{pct1(g.opened, g.recipients)}</td>
                          <td>{pct1(g.clicked, g.recipients)}</td>
                          <td>{pct1(g.reported, g.recipients)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* The cursor lives outside the scaled dashboard so it stays a fixed,
          small size. Its tip is the point it clicks with. */}
      {!still && (
        <div
          className="lw-cursor pointer-events-none absolute left-0 top-0 z-10"
          style={{ transform: `translate(${cursor.x}px, ${cursor.y}px)`, opacity: cursor.show ? 1 : 0 }}
        >
          <span key={clicks} className={clicks ? "lw-ripple absolute left-0 top-0 size-6 rounded-full bg-[#4a7fe0]/40" : "hidden"} />
          <svg width="16" height="16" viewBox="0 0 16 16" className="relative -translate-x-[2px] -translate-y-[1.5px] drop-shadow-[0_1px_2px_rgba(0,0,0,0.25)]">
            <path d="M2 1.5l10.5 4.6-4.4 1.4-1.5 4.4z" fill="#2b2b2e" stroke="#fff" strokeWidth="1.2" strokeLinejoin="round" />
          </svg>
        </div>
      )}
    </div>
  );
}
