import { useEffect, useId, useRef, useState, type PointerEvent, type ReactNode } from "react";

// One animation per principle, drawn in the vocabulary of design tools
// (selection handles, bezier handles, spacing guides, cursors) on the
// same near-black canvas, so each story is told the way it is made.
// Each is a pure function of a story position p in [0, 1] (the start of
// the story is p = 0, the finished idea is p = 1). A hook plays p on a
// loop while the card is on screen, and moving the pointer across a card
// scrubs p directly, so the story can be driven by hand. With reduced
// motion, or when animation frames can't run (a hidden tab), it rests on
// the finished drawing.

const W = 400;
const H = 250;

const clamp = (x: number, lo = 0, hi = 1) => Math.min(hi, Math.max(lo, x));
const sm = (a: number, b: number, x: number) => {
  const t = clamp((x - a) / (b - a));
  return t * t * (3 - 2 * t);
};
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

// A small seeded generator, so scattered layouts never change.
function seeded(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/* ------------------------------ playback --------------------------- */

const CYCLE_MS = 9500;
const RISE = 0.64; // share of the loop spent building, 0 to 1
const HOLD = 0.92; // then hold on the finished drawing, then a quick reset

function useStory(offset: number) {
  const ref = useRef<HTMLDivElement>(null);
  const [p, setP] = useState(1);
  const phase = useRef(0); // 0..1 position in the loop
  const scrubbing = useRef(false);
  const last = useRef(1);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    let prev = 0;
    let visible = false;

    const set = (v: number) => {
      const r = Math.round(v * 1000) / 1000;
      if (r !== last.current) {
        last.current = r;
        setP(r);
      }
    };
    const tick = (now: number) => {
      const dt = prev ? now - prev : 0;
      prev = now;
      if (!scrubbing.current) {
        phase.current = (phase.current + dt / CYCLE_MS) % 1;
        const ph = phase.current;
        set(ph < RISE ? ph / RISE : ph < HOLD ? 1 : 1 - (ph - HOLD) / (1 - HOLD));
      }
      raf = requestAnimationFrame(tick);
    };

    // Stagger the cards so they don't all breathe in unison, and start
    // each one from the beginning of its story as it scrolls in.
    phase.current = (offset % 1) * 0;
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible && !raf) {
        prev = 0;
        raf = requestAnimationFrame(tick);
      } else if (!visible && raf) {
        cancelAnimationFrame(raf);
        raf = 0;
      }
    });
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [offset]);

  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    const x = clamp((e.clientX - r.left) / r.width);
    scrubbing.current = true;
    phase.current = x * RISE; // so letting go carries on from here
    last.current = x;
    setP(x);
  };
  const onPointerLeave = () => {
    scrubbing.current = false;
  };

  return { ref, p, handlers: { onPointerMove, onPointerLeave } };
}

function Stage({ offset, children }: { offset: number; children: (p: number) => ReactNode }) {
  const { ref, p, handlers } = useStory(offset);
  const gridId = useId().replace(/:/g, "");
  return (
    <div
      ref={ref}
      {...handlers}
      aria-hidden="true"
      className="relative size-full touch-pan-y overflow-hidden"
      style={{ background: "radial-gradient(120% 90% at 50% 38%, #17171c 0%, #0c0c0f 70%)" }}
    >
      <svg viewBox={`0 0 ${W} ${H}`} className="size-full" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <defs>
          <pattern id={`${gridId}-dots`} width="20" height="20" patternUnits="userSpaceOnUse">
            <circle cx="10" cy="10" r="0.9" fill="#fff" fillOpacity="0.09" />
          </pattern>
        </defs>
        <rect width={W} height={H} fill={`url(#${gridId}-dots)`} />
        {children(p)}
      </svg>
      {/* A hairline that shows where the story is, and that it can be scrubbed. */}
      <div className="absolute inset-x-0 bottom-0 h-px bg-white/[0.07]">
        <div className="h-full bg-white/35" style={{ width: `${p * 100}%` }} />
      </div>
    </div>
  );
}

const white = (o: number) => `rgba(255,255,255,${o})`;

/* -------- I. Show, don't tell: wireframe, refined, then clicked ----- */

const BLUE = "#4da3ff"; // selection and handles
const PINK = "#ff6fae"; // spacing guides
const FILL = "#9d8cf0"; // the finished interface

// The frame being designed.
const FX = 100;
const FY = 44;
const FW = 200;
const FH = 162;

// The cursor's flight: a cubic bezier with its two handles shown, the
// way an easing curve is edited.
const S = { x: 336, y: 226 };
const C1 = { x: 318, y: 150 };
const C2 = { x: 214, y: 232 };
const E = { x: 150, y: 188 };
const bez = (t: number) => {
  const u = 1 - t;
  return {
    x: u ** 3 * S.x + 3 * u * u * t * C1.x + 3 * u * t * t * C2.x + t ** 3 * E.x,
    y: u ** 3 * S.y + 3 * u * u * t * C1.y + 3 * u * t * t * C2.y + t ** 3 * E.y,
  };
};

function Handle({ x, y, o = 1 }: { x: number; y: number; o?: number }) {
  return <circle cx={x} cy={y} r="4.2" fill="#0d0d10" stroke="#fff" strokeWidth="1.6" opacity={o} />;
}

function Show() {
  return (
    <Stage offset={0}>
      {(p) => {
        // Each refined element lands a beat after the one before it.
        const r = (i: number) => sm(0.34 + i * 0.045, 0.52 + i * 0.045, p);
        const lo = 1 - sm(0.42, 0.7, p);
        const rx = 12 * r(0);

        // Selection: handles appear, the radius eases in, then it lets go.
        const sel = sm(0.18, 0.26, p) * (1 - sm(0.6, 0.68, p));
        const radiusHandles = sm(0.3, 0.36, p) * (1 - sm(0.56, 0.62, p));
        const guides = sm(0.52, 0.58, p) * (1 - sm(0.76, 0.84, p));

        // The prototype: cursor along the bezier, click, response.
        const fly = sm(0.62, 0.84, p);
        const cur = bez(fly);
        const path = sm(0.6, 0.66, p) * (1 - sm(0.84, 0.92, p));
        const click = clamp((p - 0.84) / 0.14);
        const press = click < 0.3 ? Math.sin((click / 0.3) * Math.PI) : 0;
        const flip = sm(0.9, 0.97, p);
        const bx = 116 + 35;
        const by = 176 + 10;

        const corner = (cx: number, cy: number, sx: number, sy: number) => ({
          x: cx + sx * (9 + rx * 0.62),
          y: cy + sy * (9 + rx * 0.62),
        });
        const corners = [
          corner(FX, FY, 1, 1),
          corner(FX + FW, FY, -1, 1),
          corner(FX, FY + FH, 1, -1),
          corner(FX + FW, FY + FH, -1, -1),
        ];

        return (
          <g transform="translate(200 126) scale(1.1) translate(-200 -126)">
            {/* Frame */}
            <rect x={FX} y={FY} width={FW} height={FH} rx={rx} fill={`rgba(255,255,255,${0.035 * r(0)})`} stroke={white(0.4 + 0.5 * r(0))} strokeWidth="1.4" />

            {/* Wireframe: placeholders with crosses, dashed text */}
            <g opacity={lo} stroke={white(0.4)} strokeWidth="1.2">
              <path d={`M${FX} 72H${FX + FW}`} />
              <rect x="116" y="50" width="16" height="16" />
              <path d="M116 50l16 16M132 50l-16 16" strokeOpacity="0.6" />
              <rect x="116" y="84" width="168" height="52" />
              <path d="M116 84l168 52M284 84L116 136" strokeOpacity="0.5" />
              <path d="M116 150H282M116 162H226" strokeDasharray="4 4" />
              <rect x="116" y="176" width="70" height="20" />
            </g>

            {/* Refined */}
            <g>
              <path d={`M${FX} 72H${FX + FW}`} stroke={white(0.28)} strokeWidth="1.2" opacity={r(1)} />
              <circle cx="124" cy="58" r={8 * r(1)} fill={white(0.85)} />
              <rect x="140" y="54.5" width={52 * r(1.5)} height="7" rx="3.5" fill={white(0.6)} />
              <circle cx="284" cy="58" r={5.5 * r(2)} stroke={white(0.6)} strokeWidth="1.3" />

              <rect x="116" y="84" width="168" height="52" rx={9 * r(3)} fill={FILL} fillOpacity={0.2 * r(3)} stroke={white(0.35 * r(3))} strokeWidth="1.2" />
              <circle cx="146" cy="104" r={8 * r(3.4)} fill={white(0.9)} />
              <path d="M118 133 L160 110 L192 126 L226 100 L282 134" stroke={white(0.55)} strokeWidth="1.4" pathLength={1} strokeDasharray="1" strokeDashoffset={1 - r(3.8)} />

              <rect x="116" y="146" width={150 * r(4.4)} height="6" rx="3" fill={white(0.75)} />
              <rect x="116" y="158" width={108 * r(4.8)} height="5" rx="2.5" fill={white(0.3)} />

              {/* The button, pressed by the click */}
              <g transform={`translate(${bx} ${by}) scale(${1 - 0.07 * press}) translate(${-bx} ${-by})`}>
                <rect x="116" y="176" width="70" height="20" rx={6 * r(5.4)} fill={FILL} opacity={r(5.4)} />
                <rect x="128" y="184.5" width={34 * r(6)} height="3" rx="1.5" fill="#0d0d10" fillOpacity="0.55" />
              </g>

              {/* A toggle the click turns on */}
              <rect x="242" y="178" width="42" height="18" rx="9" stroke={white(0.55 * r(6))} strokeWidth="1.3" fill={FILL} fillOpacity={0.9 * flip} opacity={r(6)} />
              <circle cx={lerp(252, 274, flip)} cy="187" r={6.5 * r(6)} fill="#fff" />
            </g>

            {/* Selection box, handles, and the dimension pill */}
            <g opacity={sel}>
              <rect x={FX - 4} y={FY - 4} width={FW + 8} height={FH + 8} rx={rx ? rx + 2 : 0} stroke={BLUE} strokeWidth="1.3" />
              {[
                [FX - 4, FY - 4],
                [FX + FW + 4, FY - 4],
                [FX - 4, FY + FH + 4],
                [FX + FW + 4, FY + FH + 4],
              ].map(([x, y], i) => (
                <rect key={i} x={x - 3.2} y={y - 3.2} width="6.4" height="6.4" rx="1.2" fill="#fff" stroke={BLUE} strokeWidth="1.2" />
              ))}
              <rect x="170" y={FY + FH + 9} width="60" height="13" rx="6.5" fill={BLUE} />
              <rect x="180" y={FY + FH + 14.2} width="40" height="2.6" rx="1.3" fill="#fff" fillOpacity="0.85" />
            </g>

            {/* Corner-radius handles slide in as the corners round */}
            <g opacity={radiusHandles}>
              {corners.map((c, i) => (
                <circle key={i} cx={c.x} cy={c.y} r="3.2" fill="#fff" stroke={BLUE} strokeWidth="1.2" />
              ))}
            </g>

            {/* Spacing guides, the little measurements between things */}
            <g opacity={guides} stroke={PINK} strokeWidth="1.3">
              {[
                [72, 84],
                [136, 146],
                [163, 176],
              ].map(([y0, y1]) => (
                <g key={y0}>
                  <path d={`M${FX + FW + 12} ${y0}V${y1}`} />
                  <path d={`M${FX + FW + 8} ${y0}h8M${FX + FW + 8} ${y1}h8`} />
                  <path d={`M${FX + FW} ${y0}h8M${FX + FW} ${y1}h8`} strokeOpacity="0.4" strokeDasharray="2 2" />
                </g>
              ))}
            </g>

            {/* The cursor's bezier, with its handles, as in an easing editor */}
            <g opacity={path}>
              <path d={`M${S.x} ${S.y}C${C1.x} ${C1.y} ${C2.x} ${C2.y} ${E.x} ${E.y}`} stroke="#fff" strokeOpacity="0.8" strokeWidth="1.8" strokeDasharray="1 5" />
              <path d={`M${S.x} ${S.y}L${C1.x} ${C1.y}M${E.x} ${E.y}L${C2.x} ${C2.y}`} stroke={white(0.28)} strokeWidth="1.1" />
              <Handle x={C1.x} y={C1.y} />
              <Handle x={C2.x} y={C2.y} />
              <rect x={S.x - 3} y={S.y - 3} width="6" height="6" rx="1.2" fill="#fff" />
            </g>

            {/* The click ripple */}
            {click > 0 && click < 1 && <circle cx={E.x} cy={E.y} r={click * 30} stroke="#fff" strokeOpacity={(1 - click) * 0.55} strokeWidth="1.4" />}

            {/* The cursor itself */}
            <g transform={`translate(${cur.x} ${cur.y})`} opacity={sm(0.6, 0.66, p)}>
              <path d="M0 0V15l4-3.6 3 6.6 2.6-1.2-3-6.4 5.4-.2Z" fill="#fff" stroke="#0d0d10" strokeWidth="1.1" />
            </g>
          </g>
        );
      }}
    </Stage>
  );
}

// The same dark ground with nothing on it yet.
export function EmptyPanel() {
  return <div aria-hidden="true" className="size-full" style={{ background: "radial-gradient(120% 90% at 50% 38%, #17171c 0%, #0c0c0f 70%)" }} />;
}

// Switched on so far: the first principle, for review. The others are
// added here, in order, as each one is approved.
export const principleVisuals: Array<() => ReactNode> = [Show];
