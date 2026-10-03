import { useEffect, useMemo, useRef, useState, type KeyboardEvent, type PointerEvent, type ReactNode } from "react";
import { CloudSun } from "lucide-react";
import { cn } from "@/lib/utils";
import { COMMIT_WEEKS, RANGES, commitLevel, daysAgo, getCommitHistory, getRunDays, type Range } from "./homeData";

// Three small data panels for Home. Each has a label, one headline
// number, and its own way of drawing the data, with motion on range
// change and on hover. Running and commits follow the 7 / 30 / 60 day
// switch; the clock panel is live and ignores it.

/* ---------------------------- shared bits -------------------------- */

const prefersReducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Eases a number toward its target (the headline figures count up on
// a range change). Skips the animation when motion is off, and when
// the page is hidden, where animation frames never run.
function useCountUp(target: number) {
  const [value, setValue] = useState(target);
  const from = useRef(target);
  useEffect(() => {
    if (document.hidden || prefersReducedMotion()) {
      from.current = target;
      setValue(target);
      return;
    }
    const start = from.current;
    const t0 = performance.now();
    let raf = 0;
    const step = (now: number) => {
      const p = Math.min((now - t0) / 550, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      const next = start + (target - start) * eased;
      from.current = next;
      setValue(next);
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [target]);
  return value;
}

// Pointer and keyboard scrubbing across `n` evenly spaced columns of a
// 300-unit-wide drawing. `idx` is the column under the pointer (or the
// one the arrow keys landed on), null when idle.
function useScrub(n: number, colW: number) {
  const [raw, setIdx] = useState<number | null>(null);
  // A new range has a different number of columns, so any hover from
  // the old one is stale; drop it.
  useEffect(() => setIdx(null), [n]);
  const idx = raw !== null && raw < n ? raw : null;
  const x0 = (300 - n * colW) / 2;
  const onPointerMove = (e: PointerEvent<SVGSVGElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width) * 300;
    setIdx(Math.min(n - 1, Math.max(0, Math.floor((x - x0) / colW))));
  };
  const onKeyDown = (e: KeyboardEvent<SVGSVGElement>) => {
    if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
      e.preventDefault();
      const d = e.key === "ArrowLeft" ? -1 : 1;
      setIdx((i) => Math.min(n - 1, Math.max(0, (i ?? n - 1) + d)));
    } else if (e.key === "Escape") setIdx(null);
  };
  return {
    idx,
    x0,
    handlers: { onPointerMove, onPointerLeave: () => setIdx(null), onBlur: () => setIdx(null), onKeyDown },
  };
}

/* --------------------------- source credits ------------------------ */

// Where each panel's data comes from. The logos are small, single-color
// marks that follow the text color. The GitHub mark is the same one the
// site footer uses; the Weather Channel entry uses a neutral weather
// glyph until its official logo asset is dropped in.
type Mark = (props: { className?: string }) => ReactNode;

const StravaMark: Mark = ({ className }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
    <path d="M15.387 17.944l-2.089-4.116h-3.065L15.387 24l5.15-10.172h-3.066m-7.008-5.599l2.836 5.598h4.172L10.463 0l-7 13.828h4.169" />
  </svg>
);

const GitHubMark: Mark = ({ className }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
  </svg>
);

const WeatherMark: Mark = ({ className }) => <CloudSun className={className} strokeWidth={1.75} aria-hidden="true" />;

const SOURCES = {
  strava: { name: "Strava", href: "https://www.strava.com", Mark: StravaMark },
  github: { name: "GitHub", href: "https://github.com", Mark: GitHubMark },
  weather: { name: "The Weather Channel", href: "https://weather.com", Mark: WeatherMark },
} as const;

function SourceCredit({ source }: { source: keyof typeof SOURCES }) {
  const { name, href, Mark } = SOURCES[source];
  return (
    <p className="mt-4 flex items-center gap-1.5 border-t border-foreground/[0.07] pt-3 text-[11px] text-foreground/45">
      <Mark className="size-3 shrink-0" />
      <span>
        Sourced from{" "}
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-[2px] text-foreground/65 underline-offset-2 outline-none transition-colors hover:text-foreground hover:underline focus-visible:text-foreground focus-visible:underline"
        >
          {name}
        </a>
      </span>
    </p>
  );
}

function Panel({
  title,
  badge,
  live,
  value,
  caption,
  source,
  children,
}: {
  title: string;
  badge?: string;
  // A live data source: the badge turns green with a pulsing dot.
  live?: boolean;
  source: keyof typeof SOURCES;
  value: ReactNode;
  caption: string;
  children: ReactNode;
}) {
  return (
    <section
      aria-label={title}
      className="flex min-h-[250px] flex-col rounded-xl bg-[var(--panel)] p-5 ring-1 ring-foreground/[0.1] transition-shadow hover:ring-foreground/[0.16]"
    >
      <header className="flex items-center justify-between gap-3">
        <h2 className="text-[13px] font-medium text-foreground/70">{title}</h2>
        {badge &&
          (live ? (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/15 px-2 py-0.5 text-[11px] font-medium text-emerald-700 dark:text-emerald-300">
              <span aria-hidden="true" className="relative flex size-1.5">
                <span className="saas-ping absolute inset-0 rounded-full bg-emerald-500" />
                <span className="relative size-1.5 rounded-full bg-emerald-500" />
              </span>
              {badge}
            </span>
          ) : (
            <span className="rounded-full bg-foreground/[0.06] px-2 py-0.5 text-[11px] text-foreground/50">{badge}</span>
          ))}
      </header>
      <p className="mt-3 text-[28px] font-semibold leading-none tracking-tight tabular-nums">{value}</p>
      <p className="mt-1.5 h-4 truncate text-xs text-foreground/50" aria-live="polite">
        {caption}
      </p>
      <div className="mt-auto pt-4">{children}</div>
      <SourceCredit source={source} />
    </section>
  );
}

/* ---------------------- range switch (7 / 30 / 60) ------------------ */

function RangeSwitch({ value, onChange }: { value: Range; onChange: (r: Range) => void }) {
  const i = RANGES.indexOf(value);
  return (
    <div role="group" aria-label="Date range for running and commits" className="relative inline-flex rounded-lg bg-foreground/[0.06] p-0.5">
      {/* The thumb slides under the active option. */}
      <span
        aria-hidden="true"
        className="absolute left-0.5 top-0.5 h-6 w-11 rounded-md bg-[var(--panel)] shadow-[0_1px_2px_rgb(0_0_0/0.08)] ring-1 ring-foreground/[0.06] transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]"
        style={{ transform: `translateX(${i * 100}%)` }}
      />
      {RANGES.map((r) => (
        <button
          key={r}
          type="button"
          aria-pressed={value === r}
          onClick={() => onChange(r)}
          className={cn(
            "relative z-10 h-6 w-11 rounded-md text-[12px] outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring/60",
            value === r ? "font-medium text-foreground" : "text-foreground/50 hover:text-foreground/80",
          )}
        >
          {r}d
        </button>
      ))}
    </div>
  );
}

/* --------------------------------- Running ------------------------- */

const RUN = "#e8743b";

// Each day is a column of dots, one dot per mile (the last dot partly
// filled for a fraction). Dots pop in with a stagger when the range
// changes; hovering a column lights it up and reads out the day.
const DOW = ["Su", "M", "T", "W", "Th", "F", "S"];

// Today's weekday in the visitor's own time zone. Read after mount, so
// the server and first client render agree (no labels yet).
function useTodayDow() {
  const [dow, setDow] = useState<number | null>(null);
  useEffect(() => setDow(new Date().getDay()), []);
  return dow;
}

function RunningPanel({ range }: { range: Range }) {
  const days = useMemo(() => getRunDays(range), [range]);
  const dow = useTodayDow();
  const total = days.reduce((s, m) => s + m, 0);
  const shown = useCountUp(total);
  const rows = Math.max(1, Math.ceil(Math.max(...days)));
  const colW = Math.min(300 / range, 36);
  const H = 84; // the dots
  const VH = H + 26; // plus the axis and its labels
  const d = Math.min(colW * 0.72, (H / rows) * 0.78);
  const { idx, x0, handlers } = useScrub(range, colW);
  // Weekday (0 = Sunday) of column c: today is the last column.
  const weekday = (c: number) => (((dow ?? 0) - (range - 1 - c)) % 7 + 7) % 7;

  const readout =
    idx === null ? `Daily miles, last ${range} days` : `${daysAgo(idx, range)}: ${days[idx] ? `${days[idx]} mi` : "rest day"}`;

  return (
    <Panel
      title="Running miles"
      source="strava"
      badge="Sample data"
      value={
        <>
          {shown.toFixed(1)} <span className="text-base font-medium text-foreground/50">mi</span>
        </>
      }
      caption={readout}
    >
      <svg
        key={range}
        viewBox={`0 0 300 ${VH}`}
        className="w-full touch-none outline-none focus-visible:ring-2 focus-visible:ring-ring/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--panel)] rounded"
        role="slider"
        tabIndex={0}
        aria-label={`Miles per day, last ${range} days`}
        aria-valuemin={0}
        aria-valuemax={range - 1}
        aria-valuenow={idx ?? range - 1}
        aria-valuetext={readout}
        {...handlers}
      >
        {days.map((miles, c) => {
          const cx = x0 + c * colW + colW / 2;
          const lit = idx === null || idx === c;
          const full = Math.floor(miles);
          const frac = miles - full;
          return (
            <g key={c} style={{ opacity: lit ? 1 : 0.35, transition: "opacity 160ms ease" }}>
              {miles === 0 ? (
                <circle cx={cx} cy={H - d / 2} r={Math.max(d * 0.18, 0.7)} fill="currentColor" fillOpacity="0.2" />
              ) : (
                Array.from({ length: full + (frac > 0.05 ? 1 : 0) }, (_, r) => (
                  <circle
                    key={r}
                    className="saas-pop"
                    cx={cx}
                    cy={H - d / 2 - r * (H / rows)}
                    r={d / 2}
                    fill={RUN}
                    fillOpacity={r === full ? 0.25 + 0.75 * frac : idx === c ? 1 : 0.85}
                    style={{ animationDelay: `${c * 14 + r * 24}ms` }}
                  />
                ))
              )}
            </g>
          );
        })}

        {/* The axis: a baseline, a tick per day, and weekday letters. On
            the longer ranges only Mondays are marked, so the weeks read. */}
        <path d={`M${x0} ${H + 7}H${x0 + range * colW}`} stroke="currentColor" strokeOpacity="0.16" strokeWidth="1" />
        {dow !== null &&
          days.map((_, c) => {
            const cx = x0 + c * colW + colW / 2;
            const wd = weekday(c);
            const today = c === range - 1;
            const marked = range <= 7 || wd === 1 || today;
            const lit = idx === c;
            return (
              <g key={c}>
                <path
                  d={`M${cx} ${H + 7}v${marked ? 4 : 2}`}
                  stroke={today ? RUN : "currentColor"}
                  strokeOpacity={today ? 0.9 : marked ? 0.32 : 0.16}
                  strokeWidth="1"
                />
                {(range <= 7 || wd === 1) && (
                  <text
                    x={cx}
                    y={H + 22}
                    textAnchor="middle"
                    fontSize="9.5"
                    fontFamily="Inter, sans-serif"
                    fontWeight={today || lit ? 600 : 400}
                    fill={today ? RUN : "currentColor"}
                    fillOpacity={today ? 1 : lit ? 0.9 : 0.45}
                  >
                    {range <= 7 ? DOW[wd] : "Mon"}
                  </text>
                )}
              </g>
            );
          })}
      </svg>
    </Panel>
  );
}

/* ---------------------------------- Commits ------------------------ */

const GREEN = "#4fae82";
const LEVEL_OPACITY = [0.07, 0.3, 0.52, 0.76, 1];

// GitHub's contribution graph: 26 weeks, a column per week. The grid is
// always full; the range switch lights up the most recent 7, 30 or 60
// days (the rest dims back), and the lit cells pop in as a wave. Hover
// or arrow-key across it to read out any day.
function CommitsPanel({ range }: { range: Range }) {
  const history = useMemo(getCommitHistory, []);
  const total = history.length;
  const first = total - range;
  const inRange = history.slice(first);
  const sum = inRange.reduce((s, c) => s + c, 0);
  const active = inRange.filter((c) => c > 0).length;
  const shown = useCountUp(sum);
  const [hover, setHover] = useState<number | null>(null);

  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    const col = Math.min(COMMIT_WEEKS - 1, Math.max(0, Math.floor(((e.clientX - r.left) / r.width) * COMMIT_WEEKS)));
    const row = Math.min(6, Math.max(0, Math.floor(((e.clientY - r.top) / r.height) * 7)));
    setHover(col * 7 + row);
  };
  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const step = { ArrowLeft: -7, ArrowRight: 7, ArrowUp: -1, ArrowDown: 1 }[e.key as "ArrowLeft"];
    if (step) {
      e.preventDefault();
      setHover((h) => Math.min(total - 1, Math.max(0, (h ?? total - 1) + step)));
    } else if (e.key === "Escape") setHover(null);
  };

  const readout =
    hover === null
      ? `Last ${range} days, ${active} active`
      : `${daysAgo(hover, total)}: ${history[hover] === 0 ? "no commits" : `${history[hover]} commit${history[hover] === 1 ? "" : "s"}`}`;

  return (
    <Panel title="GitHub commits" source="github" badge="Sample data" value={Math.round(shown).toLocaleString("en-US")} caption={readout}>
      <div
        key={range}
        role="slider"
        tabIndex={0}
        aria-label={`Commits per day, 26 weeks, last ${range} days highlighted`}
        aria-valuemin={0}
        aria-valuemax={total - 1}
        aria-valuenow={hover ?? total - 1}
        aria-valuetext={readout}
        onPointerMove={onPointerMove}
        onPointerLeave={() => setHover(null)}
        onBlur={() => setHover(null)}
        onKeyDown={onKeyDown}
        className="grid touch-none grid-flow-col grid-rows-7 gap-[3px] rounded outline-none focus-visible:ring-2 focus-visible:ring-ring/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--panel)]"
        style={{ gridTemplateColumns: `repeat(${COMMIT_WEEKS}, minmax(0, 1fr))` }}
      >
        {history.map((count, i) => {
          const lit = i >= first;
          const level = commitLevel(count);
          // Wave: cells nearest today pop first, fanning back in time.
          const delay = lit ? Math.min((total - 1 - i) * 3, 420) : 0;
          return (
            <span
              key={i}
              aria-hidden="true"
              className={cn(
                "aspect-square rounded-[2px] transition-[opacity,box-shadow] duration-150",
                lit && "saas-pop",
                hover === i && "shadow-[0_0_0_1.5px_var(--panel),0_0_0_3px_currentColor]",
              )}
              style={{
                background: level === 0 ? "currentColor" : GREEN,
                opacity: level === 0 ? (lit ? 0.09 : 0.04) : lit ? LEVEL_OPACITY[level] : LEVEL_OPACITY[level] * 0.22,
                animationDelay: `${delay}ms`,
              }}
            />
          );
        })}
      </div>
    </Panel>
  );
}

/* --------------------------- New York City, now ------------------------- */

// The site's own clock. It flips to dark from 7pm to 6am New York time
// (the rule Topbar.astro uses for the theme). This draws the whole day
// as a sun-height curve: above the line the site is light, below it
// dark, with a sun or moon riding the curve at the current time. Move
// across the panel to scrub the day; letting go glides back to now.

const DAY_START = 6;
const DAY_END = 19;
const W = 300;
const HORIZON = 46;
const AMP = 30;

// Height of the sun (positive) or moon (negative) at hour `h`: zero at
// the 6 AM and 7 PM theme flips.
function altitude(h: number) {
  if (h >= DAY_START && h < DAY_END) return Math.sin((Math.PI * (h - DAY_START)) / (DAY_END - DAY_START));
  const into = h >= DAY_END ? h - DAY_END : h + (24 - DAY_END);
  return -Math.sin((Math.PI * into) / (24 - (DAY_END - DAY_START)));
}

const px = (h: number) => (h / 24) * W;
const py = (h: number) => HORIZON - AMP * altitude(h);

const CURVE = Array.from({ length: 97 }, (_, i) => {
  const h = (i / 96) * 24;
  return `${i === 0 ? "M" : "L"}${px(h).toFixed(1)} ${py(h).toFixed(1)}`;
}).join("");

function nycHours() {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/New_York",
    hour: "numeric",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(new Date());
  const h = Number(parts.find((p) => p.type === "hour")?.value ?? 0) % 24;
  const m = Number(parts.find((p) => p.type === "minute")?.value ?? 0);
  return h + m / 60;
}

function clock(h: number) {
  const total = Math.round(h * 60) % (24 * 60);
  const hh = Math.floor(total / 60);
  const mm = total % 60;
  return `${((hh + 11) % 12) + 1}:${String(mm).padStart(2, "0")} ${hh < 12 ? "AM" : "PM"}`;
}

function NycPanel() {
  const [now, setNow] = useState<number | null>(null);
  const [scrub, setScrub] = useState<number | null>(null);
  useEffect(() => {
    const tick = () => setNow(nycHours());
    tick();
    const id = window.setInterval(tick, 30_000);
    return () => window.clearInterval(id);
  }, []);

  const h = scrub ?? now;
  const day = h !== null && h >= DAY_START && h < DAY_END;
  const readHour = (clientX: number, el: SVGSVGElement) => {
    const r = el.getBoundingClientRect();
    return Math.min(23.99, Math.max(0, ((clientX - r.left) / r.width) * 24));
  };
  const onKeyDown = (e: KeyboardEvent<SVGSVGElement>) => {
    if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
      e.preventDefault();
      setScrub((s) => Math.min(23.99, Math.max(0, (s ?? now ?? 12) + (e.key === "ArrowLeft" ? -0.5 : 0.5))));
    } else if (e.key === "Escape") setScrub(null);
  };

  const caption =
    h === null
      ? "Reading the clock"
      : scrub !== null
        ? `The site is ${day ? "light" : "dark"} at this hour`
        : day
          ? `Light until ${clock(DAY_END)}`
          : `Dark until ${clock(DAY_START)}`;

  return (
    <Panel title="New York City, now" source="weather" badge={scrub !== null ? "Scrubbing" : "Live"} live={scrub === null} value={h === null ? "—" : clock(h)} caption={caption}>
      <svg
        viewBox={`0 0 ${W} 84`}
        className="w-full touch-none rounded outline-none focus-visible:ring-2 focus-visible:ring-ring/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--panel)]"
        role="slider"
        tabIndex={0}
        aria-label="Time of day in New York"
        aria-valuemin={0}
        aria-valuemax={24}
        aria-valuenow={h === null ? undefined : Math.round(h * 10) / 10}
        aria-valuetext={h === null ? undefined : `${clock(h)}, the site is ${day ? "light" : "dark"}`}
        onPointerMove={(e) => setScrub(readHour(e.clientX, e.currentTarget))}
        onPointerLeave={() => setScrub(null)}
        onBlur={() => setScrub(null)}
        onKeyDown={onKeyDown}
      >
        {/* Night zones, where the site is dark */}
        <rect x="0" y="0" width={px(DAY_START)} height="70" fill="currentColor" fillOpacity="0.045" />
        <rect x={px(DAY_END)} y="0" width={W - px(DAY_END)} height="70" fill="currentColor" fillOpacity="0.045" />
        <path d={`M0 ${HORIZON}H${W}`} stroke="currentColor" strokeOpacity="0.16" strokeWidth="1" />
        {[DAY_START, DAY_END].map((hr) => (
          <path key={hr} d={`M${px(hr)} 6V70`} stroke="currentColor" strokeOpacity="0.14" strokeWidth="1" strokeDasharray="2 3" />
        ))}
        <path d={CURVE} fill="none" stroke="currentColor" strokeOpacity="0.28" strokeWidth="1.4" strokeLinecap="round" />
        {/* Daylight stretch of the curve, warm */}
        <path
          d={Array.from({ length: 53 }, (_, i) => {
            const hr = DAY_START + (i / 52) * (DAY_END - DAY_START);
            return `${i === 0 ? "M" : "L"}${px(hr).toFixed(1)} ${py(hr).toFixed(1)}`;
          }).join("")}
          fill="none"
          stroke="#d6a24f"
          strokeOpacity="0.85"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
        {/* The sun or moon, riding the curve */}
        {h !== null && (
          <g
            style={{
              transform: `translate(${px(h)}px, ${py(h)}px)`,
              transition: "transform 260ms cubic-bezier(0.22, 1, 0.36, 1)",
            }}
          >
            {day ? (
              <>
                <circle r="11" fill="#d6a24f" fillOpacity="0.18" className="saas-breathe" />
                <circle r="5.2" fill="#d6a24f" />
              </>
            ) : (
              <>
                <circle r="11" fill="currentColor" fillOpacity="0.07" className="saas-breathe" />
                <path d="M2.4-5.6A6 6 0 1 0 5.6 2.6 4.8 4.8 0 0 1 2.4-5.6z" fill="currentColor" fillOpacity="0.72" />
              </>
            )}
          </g>
        )}
        {/* Where "now" is, while scrubbing somewhere else */}
        {scrub !== null && now !== null && (
          <circle cx={px(now)} cy={py(now)} r="2.4" fill="currentColor" fillOpacity="0.35" />
        )}
        {[
          { hr: DAY_START, t: "6 AM" },
          { hr: DAY_END, t: "7 PM" },
        ].map(({ hr, t }) => (
          <text key={hr} x={px(hr)} y="82" textAnchor="middle" fontSize="9" fill="currentColor" fillOpacity="0.4" fontFamily="Inter, sans-serif">
            {t}
          </text>
        ))}
      </svg>
    </Panel>
  );
}

/* --------------------------------- Home row ------------------------- */

export function HomePanels({ className }: { className?: string }) {
  const [range, setRange] = useState<Range>(7);
  return (
    <div className={className}>
      <div className="mb-3 flex items-center justify-between">
        <p className="text-[13px] text-foreground/50">Activity</p>
        <RangeSwitch value={range} onChange={setRange} />
      </div>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <CommitsPanel range={range} />
        <RunningPanel range={range} />
        <NycPanel />
      </div>
    </div>
  );
}
