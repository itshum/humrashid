import { useEffect, useRef, useState, type PointerEvent } from "react";
import { ArrowLeft, RotateCw } from "lucide-react";
import { cn } from "@/lib/utils";
import { prints, type Exif, type Frame, type Print } from "./inspirationData";
import { PRINT_FRAME, PRINT_SHADOW } from "./InspirationPage";
import type { Route } from "./data";

// One print on its own page, centered in the panel: the print, its title
// beneath it on the left with Flip on the right, then its settings in a
// small, quiet two-column box. The date is on the back of the print. "Flip" turns the print over
// to the back, where the title, date and settings are written by hand.
// A stack opens as a row of prints with the current one centered and a
// sliver of its neighbor at the edge, in a quiet inactive state (same
// photo, less color). Click it (or use the arrow keys) and the row slides
// to bring it to the center.

const MAX = { landscape: 700, portrait: 520 };
// How much of a neighbor shows at the panel's edge, and the least space
// between two prints.
// Everything on the page but the print: the shell's header, the Back row,
// the title row and the metadata box. The print takes the rest of the
// window height, so the page never needs to scroll.
const RESERVED = 330;
const MIN_GAP = 40;
const PEEK = 60;

const shortDate = (iso: string) =>
  new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(iso));

function specs(e: Exif) {
  return [
    { label: "Camera", value: e.camera },
    { label: "Lens", value: e.lens },
    { label: "Focal length", value: e.focal },
    { label: "Aperture", value: e.aperture },
    { label: "Shutter", value: `${e.shutter} s` },
    { label: "ISO", value: String(e.iso) },
  ];
}

// Resting and floating shadows for the current print. Hovering lifts it
// a few pixels while the shadow spreads, so it seems to hover.
const REST = PRINT_SHADOW;
const FLOAT =
  "group-hover/print:shadow-[0_2px_4px_rgb(0_0_0/0.04),0_15px_25px_-7px_rgb(0_0_0/0.19)]";

// The print: front is the photo, back is the handwritten note. Both faces
// are the same size, and the one turned away is hidden from keyboard and
// screen readers.
function PrintFace({
  print,
  frame,
  position,
  count,
  flipped,
  active,
}: {
  print: Print;
  frame: Frame;
  position: number;
  count: number;
  flipped: boolean;
  active: boolean;
}) {
  const e = frame.exif;
  const landscape = print.orientation === "landscape";
  const ink = '"Caveat", "Bradley Hand", "Segoe Print", cursive';

  return (
    <div
      className={cn(
        "group/print [perspective:1600px] transition-transform duration-300 ease-out motion-reduce:transition-none",
        active && "hover:-translate-y-1.5 motion-reduce:hover:translate-y-0",
      )}
    >
      <div
        className="relative transition-transform duration-[600ms] ease-[cubic-bezier(0.22,1,0.36,1)] [transform-style:preserve-3d] motion-reduce:transition-none"
        style={{ transform: flipped ? "rotateY(180deg)" : "none" }}
      >
        <div
          className={cn(
            "transition-shadow duration-300 [backface-visibility:hidden]",
            PRINT_FRAME,
            active && REST,
            active && FLOAT,
          )}
          aria-hidden={flipped}
          inert={flipped}
        >
          <img
            src={frame.src}
            alt={`${print.label}${count > 1 ? `, photo ${position + 1} of ${count}` : ""}`}
            draggable={false}
            className={cn(
              "block w-full rounded-[2px] bg-neutral-200 object-cover",
              landscape ? "aspect-[3/2]" : "aspect-[4/5]",
            )}
          />
        </div>
        <div
          className={cn(
            "absolute inset-0 flex flex-col px-8 py-9 text-[#2a2d3a] transition-shadow duration-300 [backface-visibility:hidden]",
            PRINT_FRAME,
            active && REST,
            active && FLOAT,
          )}
          style={{
            transform: "rotateY(180deg)",
            fontFamily: ink,
            backgroundColor: "#fbfaf6",
          }}
          aria-hidden={!flipped}
          inert={!flipped}
        >
          <p className="-rotate-1 text-[44px] font-semibold leading-none">
            {print.label}
          </p>
          <p className="mt-2 text-[26px] leading-none opacity-75">
            {shortDate(e.date)}
          </p>
          <div className="mt-auto space-y-1 text-[26px] leading-[1.2] opacity-90">
            <p>
              {e.camera} · {e.lens}
            </p>
            <p>
              {e.aperture} · {e.shutter} s · ISO {e.iso}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function InspirationDetail({
  id,
  go,
}: {
  id: string;
  go: (r: Route) => void;
}) {
  const print = prints.find((p) => p.id === id);
  // The position in an endless row: it only ever counts up or down, and
  // the photo shown at any position is that position modulo the count.
  const [pos, setPos] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const count = print?.frames.length ?? 0;

  useEffect(() => {
    setPos(0);
    setFlipped(false);
  }, [id]);

  const pick = (p: number) => {
    setPos(p);
    setFlipped(false);
  };

  // Drag the row with the mouse, a finger or a pen. The prints follow the
  // pointer one to one; on release the row settles on whichever print is
  // nearest, or the next one over if you flicked it. A tap with no
  // movement is left alone, so the side prints still click.
  const [dragX, setDragX] = useState(0);
  const [dragging, setDragging] = useState(false);
  const row = useRef<HTMLDivElement>(null);
  const drag = useRef({
    id: -1,
    startX: 0,
    lastX: 0,
    lastT: 0,
    v: 0,
    step: 1,
    moved: false,
    suppress: false,
  });

  const onDown = (e: PointerEvent<HTMLDivElement>) => {
    if (count < 2 || (e.pointerType === "mouse" && e.button !== 0)) return;
    const items =
      row.current?.querySelectorAll<HTMLElement>("div.absolute.top-0");
    const step =
      items && items.length >= 4
        ? items[3].getBoundingClientRect().left -
          items[2].getBoundingClientRect().left
        : 600;
    Object.assign(drag.current, {
      id: e.pointerId,
      startX: e.clientX,
      lastX: e.clientX,
      lastT: e.timeStamp,
      v: 0,
      step,
      moved: false,
    });
  };
  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    if (d.id !== e.pointerId) return;
    const dx = e.clientX - d.startX;
    if (!d.moved) {
      if (Math.abs(dx) < 6) return;
      d.moved = true;
      e.currentTarget.setPointerCapture(e.pointerId);
      setDragging(true);
    }
    const dt = Math.max(1, e.timeStamp - d.lastT);
    d.v = 0.7 * d.v + 0.3 * ((e.clientX - d.lastX) / dt);
    d.lastX = e.clientX;
    d.lastT = e.timeStamp;
    setDragX(Math.max(-d.step * 1.15, Math.min(d.step * 1.15, dx)));
  };
  const onUp = (e: PointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    if (d.id !== e.pointerId) return;
    d.id = -1;
    if (!d.moved) return;
    d.suppress = true;
    const dx = e.clientX - d.startX;
    let move = 0;
    if (Math.abs(d.v) > 0.4 || Math.abs(dx) > d.step * 0.22)
      move = (Math.abs(d.v) > 0.4 ? d.v : dx) < 0 ? 1 : -1;
    setDragging(false);
    setDragX(0);
    if (move) pick(pos + move);
  };

  useEffect(() => {
    const onKey = (ev: KeyboardEvent) => {
      if (ev.metaKey || ev.ctrlKey || ev.altKey) return;
      if (ev.key === "Escape") go({ section: "inspiration" });
      if (count < 2) return;
      if (ev.key === "ArrowRight") pick(pos + 1);
      if (ev.key === "ArrowLeft") pick(pos - 1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  if (!print) {
    return (
      <div className="py-16 text-center">
        <p className="text-sm font-medium">That print isn’t here</p>
        <button
          type="button"
          onClick={() => go({ section: "inspiration" })}
          className="mt-3 text-[13px] underline underline-offset-4"
        >
          Back to Inspiration
        </button>
      </div>
    );
  }

  const slot = ((pos % count) + count) % count;
  const frame = print.frames[slot];
  const max = MAX[print.orientation];
  const ghost =
    "inline-flex h-8 items-center gap-1.5 rounded-md px-2.5 text-[13px] text-foreground/60 outline-none transition-colors hover:bg-foreground/[0.06] hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/60";

  return (
    <div className="relative mx-auto flex min-h-0 w-full flex-1 flex-col items-center justify-center overflow-hidden pb-6 pt-14">
      <button
        type="button"
        onClick={() => go({ section: "inspiration" })}
        className="group absolute left-4 top-3 z-10 inline-flex h-8 items-center gap-1.5 rounded-md px-2 text-[13px] text-foreground/60 outline-none transition-colors hover:bg-foreground/[0.06] hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/60 sm:left-6"
      >
        <ArrowLeft
          className="size-3.5 transition-transform duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-x-[3px] group-focus-visible:-translate-x-[3px] motion-reduce:transition-none"
          aria-hidden="true"
        />{" "}
        Back
      </button>
      {/* The row of prints. The wrapper is a size container so the print
          can be as wide as the room allows, up to its maximum. The row
          never ends: the prints before and after the current one are
          drawn at their own positions (the photo at position n is photo
          n modulo the count), so going past the last photo comes round
          to the first. */}
      <div
        className={cn(
          "-my-6 w-full touch-none select-none overflow-hidden py-8 [container-type:inline-size]",
          count > 1 && (dragging ? "cursor-grabbing" : "cursor-grab"),
        )}
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerCancel={onUp}
        onClickCapture={(e) => {
          if (drag.current.suppress) {
            e.preventDefault();
            e.stopPropagation();
            drag.current.suppress = false;
          }
        }}
        role="group"
        aria-roledescription="carousel"
        aria-label={`${print.label}, ${count} ${count === 1 ? "photo" : "photos"}`}
      >
        <div
          ref={row}
          className="relative"
          style={
            {
              "--w": `max(200px, min(${max}px, calc(100cqw - ${2 * (MIN_GAP + PEEK)}px), calc((100dvh - ${RESERVED}px - 12px) * ${print.orientation === "landscape" ? 1.5 : 0.8} + 12px)))`,
              "--g": `max(${MIN_GAP}px, calc((100cqw - var(--w)) / 2 - ${PEEK}px))`,
            } as React.CSSProperties
          }
        >
          {/* Holds the row's height, since the prints are positioned over it. */}
          <div
            aria-hidden="true"
            style={{
              height:
                print.orientation === "landscape"
                  ? "calc((var(--w) - 12px) * 2 / 3 + 12px)"
                  : "calc((var(--w) - 12px) * 1.25 + 12px)",
            }}
          />
          {(count > 1 ? [-2, -1, 0, 1, 2] : [0]).map((d) => {
            const p = pos + d;
            const i = ((p % count) + count) % count;
            const active = d === 0;
            return (
              <div
                key={p}
                className={cn(
                  "absolute top-0 [left:calc(50cqw-var(--w)/2)] [width:var(--w)] transition-[opacity,filter,transform] duration-[550ms] ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none",
                  !active && "opacity-60 brightness-[1.12] saturate-[0.12]",
                )}
                style={{
                  transform: `translateX(calc(${d} * (var(--w) + var(--g)) + ${dragX}px))`,
                  transition: dragging ? "none" : undefined,
                }}
                aria-hidden={!active}
              >
                <PrintFace
                  print={print}
                  frame={print.frames[i]}
                  position={i}
                  count={count}
                  flipped={active && flipped}
                  active={active}
                />
                {!active && Math.abs(d) === 1 && (
                  <button
                    type="button"
                    onClick={() => pick(p)}
                    aria-label={`Show photo ${i + 1} of ${count}`}
                    className="absolute inset-0 cursor-pointer rounded-[4px] outline-none focus-visible:ring-2 focus-visible:ring-ring/60"
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div
        className="mt-5 flex items-center justify-between gap-4"
        style={{ width: `min(calc(100% - 40px), ${max}px)` }}
      >
        <h1 className="min-w-0 truncate text-base font-medium leading-tight tracking-tight">
          {print.label}
        </h1>
        <div className="flex shrink-0 items-center gap-1">
          {count > 1 && (
            <span
              className="mr-1 text-xs tabular-nums text-foreground/60"
              aria-live="polite"
            >
              {slot + 1} / {count}
            </span>
          )}
          <button
            type="button"
            onClick={() => setFlipped((f) => !f)}
            aria-pressed={flipped}
            className={ghost}
            title="Turn the print over"
          >
            <RotateCw className="size-3.5" aria-hidden="true" /> Flip
          </button>
        </div>
      </div>

      <div
        className="mt-6 rounded-[4px] border border-[var(--line)] px-6 py-4"
        style={{ width: `min(calc(100% - 40px), ${max}px)` }}
      >
        <dl className="grid grid-cols-2 gap-x-10 gap-y-3">
          {specs(frame.exif).map((s) => (
            <div key={s.label} className="flex items-baseline gap-3">
              <dt className="w-[72px] shrink-0 text-[11px] text-foreground/60">
                {s.label}
              </dt>
              <dd className="min-w-0 truncate text-xs tabular-nums text-foreground/65">
                {s.value}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}
