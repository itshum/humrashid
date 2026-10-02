import { useEffect, useRef, useState, type KeyboardEvent, type PointerEvent, type ReactNode } from "react";
import { Dialog } from "radix-ui";
import { Maximize2, X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Shot } from "./packContent";

// Building blocks for the long-form case study layout.

/* ----------------------------- Lightbox ---------------------------- */

// Dense UI screenshots are hard to read at column width, so every one
// can open at full size.
export function Expandable({ src, alt, children }: { src: string; alt: string; children: ReactNode }) {
  return (
    <Dialog.Root>
      <div className="group relative">
        {children}
        <Dialog.Trigger asChild>
          <button
            type="button"
            aria-label={`Expand image: ${alt}`}
            className="absolute right-2.5 top-2.5 grid size-7 place-items-center rounded-[4px] bg-black/55 text-white opacity-0 outline-none backdrop-blur transition-opacity hover:bg-black/70 focus-visible:opacity-100 focus-visible:ring-2 focus-visible:ring-white group-hover:opacity-100 [@media(hover:none)]:opacity-100"
          >
            <Maximize2 className="size-3.5" aria-hidden="true" />
          </button>
        </Dialog.Trigger>
      </div>
      <Dialog.Portal>
        <Dialog.Overlay className="saas fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=open]:fade-in-0" />
        <Dialog.Content
          aria-describedby={undefined}
          className="saas fixed inset-0 z-50 grid place-items-center p-4 outline-none sm:p-8"
          onClick={(e) => e.target === e.currentTarget && e.currentTarget.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }))}
        >
          <Dialog.Title className="sr-only">{alt}</Dialog.Title>
          <img src={src} alt={alt} className="max-h-full max-w-full rounded-[4px] object-contain shadow-2xl" />
          <Dialog.Close
            aria-label="Close"
            className="absolute right-4 top-4 grid size-9 place-items-center rounded-[4px] bg-white/15 text-white outline-none backdrop-blur hover:bg-white/25 focus-visible:ring-2 focus-visible:ring-white"
          >
            <X className="size-4" aria-hidden="true" />
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

/* --------------------------- Single figure ------------------------- */

export function Figure({
  src,
  alt,
  caption,
  width,
  height,
  className,
}: {
  src: string;
  alt: string;
  caption: string;
  width: number;
  height: number;
  className?: string;
}) {
  return (
    <figure className={className}>
      <Expandable src={src} alt={alt}>
        <img
          src={src}
          alt={alt}
          width={width}
          height={height}
          loading="lazy"
          className="h-auto w-full rounded-[4px] border border-[var(--line)]"
        />
      </Expandable>
      <figcaption className="mt-2.5 max-w-[44rem] text-[13px] leading-[1.45] text-foreground/55">{caption}</figcaption>
    </figure>
  );
}

/* ------------------------------- Tabs ------------------------------ */

// A set of related screens, one at a time at a readable size, in a
// fixed-height frame so switching never shifts the page.
export function ShotTabs({ id, label, shots }: { id: string; label: string; shots: Shot[] }) {
  const [active, setActive] = useState(0);
  const refs = useRef<Array<HTMLButtonElement | null>>([]);
  const shot = shots[active];

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const dir = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
    if (!dir) return;
    e.preventDefault();
    const next = (active + dir + shots.length) % shots.length;
    setActive(next);
    refs.current[next]?.focus();
  };

  return (
    <figure className="mt-8">
      <div role="tablist" aria-label={label} onKeyDown={onKeyDown} className="flex flex-wrap gap-1">
        {shots.map((s, i) => (
          <button
            key={s.id}
            ref={(el) => {
              refs.current[i] = el;
            }}
            role="tab"
            id={`${id}-tab-${s.id}`}
            aria-selected={i === active}
            aria-controls={`${id}-panel`}
            tabIndex={i === active ? 0 : -1}
            onClick={() => setActive(i)}
            className={cn(
              "h-8 rounded-[4px] px-3 text-[13px] outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring/60",
              i === active ? "bg-[var(--surface-2)] font-medium text-foreground" : "text-foreground/55 hover:bg-[var(--surface)] hover:text-foreground",
            )}
          >
            {s.label}
          </button>
        ))}
      </div>

      <div
        role="tabpanel"
        id={`${id}-panel`}
        aria-labelledby={`${id}-tab-${shot.id}`}
        className="mt-3 rounded-[4px] border border-[var(--line)] bg-[var(--surface)] p-3 sm:p-4"
      >
        <Expandable src={shot.src} alt={shot.alt}>
          {/* A fixed-height flex box: its height is definite, so the image's
              max-h-full really does stop it at the frame (in a grid cell it
              sized itself to the image and spilled out). */}
          <div className="flex h-[min(62vw,520px)] min-h-[260px] items-center justify-center overflow-hidden">
            <img
              key={shot.id}
              src={shot.src}
              alt={shot.alt}
              loading="lazy"
              className="saas-fade h-auto max-h-full w-auto min-h-0 max-w-full rounded-[4px] border border-[var(--line)] object-contain"
            />
          </div>
        </Expandable>
      </div>
      <figcaption className="mt-2.5 max-w-[44rem] text-[13px] leading-[1.45] text-foreground/55" aria-live="polite">
        {shot.caption}
      </figcaption>
    </figure>
  );
}

/* ------------------------------ Compare ---------------------------- */

// Drag, or use the arrow keys, to wipe from one version to the other.
export function Compare({
  before,
  after,
  alt,
  caption,
}: {
  before: { src: string; label: string };
  after: { src: string; label: string };
  alt: string;
  caption: string;
}) {
  const [pos, setPos] = useState(50);
  const box = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  const move = (clientX: number) => {
    const r = box.current?.getBoundingClientRect();
    if (!r) return;
    setPos(Math.min(100, Math.max(0, ((clientX - r.left) / r.width) * 100)));
  };
  const onDown = (e: PointerEvent<HTMLDivElement>) => {
    dragging.current = true;
    e.currentTarget.setPointerCapture(e.pointerId);
    move(e.clientX);
  };

  // A small nudge when it scrolls into view, so it reads as draggable.
  useEffect(() => {
    const el = box.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    const io = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      io.disconnect();
      const t0 = performance.now();
      const tick = (now: number) => {
        const t = Math.min((now - t0) / 1400, 1);
        setPos(50 + 14 * Math.sin(t * Math.PI * 2) * (1 - t));
        if (t < 1) raf = requestAnimationFrame(tick);
        else setPos(50);
      };
      raf = requestAnimationFrame(tick);
    });
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <figure className="mt-8">
      <div
        ref={box}
        onPointerDown={onDown}
        onPointerMove={(e) => dragging.current && move(e.clientX)}
        onPointerUp={() => (dragging.current = false)}
        onPointerCancel={() => (dragging.current = false)}
        className="relative aspect-[2760/1500] w-full cursor-ew-resize touch-pan-y select-none overflow-hidden rounded-[4px] border border-[var(--line)] focus-within:ring-2 focus-within:ring-ring/60"
      >
        <img src={after.src} alt={alt} loading="lazy" draggable={false} className="absolute inset-0 size-full object-cover" />
        <img
          src={before.src}
          alt=""
          aria-hidden="true"
          draggable={false}
          className="absolute inset-0 size-full object-cover"
          style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}
        />
        <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 w-px bg-white/90 shadow-[0_0_0_1px_rgba(0,0,0,0.25)]" style={{ left: `${pos}%` }}>
          <span className="absolute left-1/2 top-1/2 grid size-8 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-white text-black shadow-md ring-1 ring-black/10">
            <svg viewBox="0 0 20 20" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
              <path d="M7.5 5 3 10l4.5 5M12.5 5 17 10l-4.5 5" />
            </svg>
          </span>
        </div>
        <span className="pointer-events-none absolute left-2.5 top-2.5 rounded-[3px] bg-black/60 px-2 py-0.5 text-[11px] font-medium text-white backdrop-blur" style={{ opacity: pos > 14 ? 1 : 0, transition: "opacity 150ms" }}>
          {before.label}
        </span>
        <span className="pointer-events-none absolute right-2.5 top-2.5 rounded-[3px] bg-black/60 px-2 py-0.5 text-[11px] font-medium text-white backdrop-blur" style={{ opacity: pos < 86 ? 1 : 0, transition: "opacity 150ms" }}>
          {after.label}
        </span>
        <input
          type="range"
          min={0}
          max={100}
          value={Math.round(pos)}
          onChange={(e) => setPos(Number(e.target.value))}
          aria-label={`Compare: ${before.label} to ${after.label}`}
          className="sr-only"
        />
      </div>
      <figcaption className="mt-2.5 max-w-[44rem] text-[13px] leading-[1.45] text-foreground/55">{caption}</figcaption>
    </figure>
  );
}
