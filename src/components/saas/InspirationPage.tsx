import { useRef, type PointerEvent } from "react";
import { cn } from "@/lib/utils";
import { prints, type Print } from "./inspirationData";
import { Reveal, useCaseStudyReveal } from "./CaseStudyParts";
import { PageHeader } from "./ui";
import type { Route } from "./data";

// Inspiration: a wall of prints in the product's own language. The photo
// is the one thing allowed to feel like an object, a print in a thin white
// mat; everything around it is the same as the rest of the site (the shell
// borders and corner radius, Inter labels, the same tags). A set of photos is a tidy stack, each print behind the
// top one lifted a step higher, with the count as a tag.

// The look of a print: thin even white mat, 4px corners, a hairline edge
// and the same small lift the panels use. Shared with the detail page.
export const PRINT_FRAME =
  "bg-white p-1.5 rounded-[4px] ring-1 ring-black/[0.08] shadow-[0_1px_2px_rgb(0_0_0/0.06)]";

// The soft drop shadow under a print, the same one the detail page uses.
// A pile's top print carries it; the prints behind it keep just the edge.
export const PRINT_SHADOW =
  "shadow-[0_1px_2px_rgb(0_0_0/0.05),0_7px_15px_-6px_rgb(0_0_0/0.15)]";

// At most this many prints show behind the top one; the tag has the count.
const MAX_BEHIND = 3;

function Photo({
  src,
  alt,
  orientation,
}: {
  src: string;
  alt: string;
  orientation: Print["orientation"];
}) {
  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      decoding="async"
      draggable={false}
      className={cn(
        "block w-full rounded-[2px] bg-neutral-200 object-cover",
        orientation === "landscape" ? "aspect-[3/2]" : "aspect-[4/5]",
      )}
    />
  );
}

// A print (or a pile) hovers: on pointer-over it rises and its shadow
// deepens, and it drifts and tilts a few degrees toward the cursor, as if
// it were floating just above the page. The behind prints of a pile move
// further than the top one, which gives the pile some depth. The motion is
// driven by CSS variables set from the pointer, so nothing re-renders.
const HOVER =
  "perspective(900px) translate3d(calc(var(--mx,0) * 7px), calc(var(--my,0) * 5px + var(--h,0) * -5px), 0) rotateX(calc(var(--my,0) * -3deg)) rotateY(calc(var(--mx,0) * 3.5deg))";

function PrintCard({ print, onOpen }: { print: Print; onOpen: () => void }) {
  const float = useRef<HTMLDivElement>(null);
  const follow = (e: PointerEvent<HTMLButtonElement>) => {
    if (e.pointerType !== "mouse" || !float.current) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const r = e.currentTarget.getBoundingClientRect();
    const x = Math.max(
      -1,
      Math.min(1, ((e.clientX - r.left) / r.width - 0.5) * 2),
    );
    const y = Math.max(
      -1,
      Math.min(1, ((e.clientY - r.top) / r.height - 0.5) * 2),
    );
    const el = float.current.style;
    el.setProperty("--mx", x.toFixed(3));
    el.setProperty("--my", y.toFixed(3));
    el.setProperty("--h", "1");
  };
  const settle = () => {
    const el = float.current?.style;
    el?.setProperty("--mx", "0");
    el?.setProperty("--my", "0");
    el?.setProperty("--h", "0");
  };
  const count = print.frames.length;
  const stack = count > 1;
  const behind = Math.min(count - 1, MAX_BEHIND);
  const width =
    print.orientation === "landscape"
      ? "w-[min(100%,300px)]"
      : "w-[min(100%,230px)]";

  return (
    <button
      type="button"
      onClick={onOpen}
      onPointerMove={follow}
      onPointerLeave={settle}
      aria-label={
        stack ? `Open ${print.label}, ${count} photos` : `Open ${print.label}`
      }
      className="group flex w-full cursor-pointer flex-col items-center justify-center rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-ring/60 focus-visible:ring-offset-8 focus-visible:ring-offset-[var(--panel)]"
    >
      <div
        ref={float}
        className={cn(
          "relative transition-transform duration-200 ease-out motion-reduce:!transform-none",
          width,
          stack && "mt-3",
        )}
        style={{ transform: HOVER }}
      >
        {Array.from({ length: behind }, (_, n) => n + 1)
          .reverse()
          .map((step) => (
            <div
              key={step}
              aria-hidden="true"
              className={cn(
                "absolute inset-0 origin-bottom transition-transform duration-300 ease-out [--k:1] group-hover:[--k:1.5] motion-reduce:transition-none",
                PRINT_FRAME,
              )}
              style={{
                transform: `translateX(calc(var(--mx, 0) * ${step * 3}px)) translateY(calc(${-7 * step}px * var(--k))) scaleX(${1 - 0.05 * step})`,
              }}
            >
              <Photo
                src={print.frames[step].src}
                alt=""
                orientation={print.orientation}
              />
            </div>
          ))}
        <div
          className={cn(
            "relative transition-shadow duration-300 group-hover:shadow-[0_2px_4px_rgb(0_0_0/0.04),0_15px_25px_-7px_rgb(0_0_0/0.19)]",
            PRINT_FRAME,
            PRINT_SHADOW,
          )}
        >
          <Photo
            src={print.frames[0].src}
            alt={print.label}
            orientation={print.orientation}
          />
        </div>
      </div>
      <span className="mt-3.5 block text-center">
        <span className="block text-[13px] font-medium">{print.label}</span>
        <span className="mt-1 block text-xs text-foreground/65">
          {monthYear(print.frames[0].exif.date)}
        </span>
      </span>
    </button>
  );
}

const monthYear = (iso: string) =>
  new Intl.DateTimeFormat("en-US", {
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(iso));

export function InspirationPage({ go }: { go: (r: Route) => void }) {
  useCaseStudyReveal();

  return (
    <>
      <PageHeader title="Inspiration" description="Images from recent trips." />
      <ul className="grid grid-cols-2 gap-x-8 gap-y-16 pt-6">
        {prints.map((p, i) => (
          <li key={p.id} className="flex">
            <Reveal
              className="group/r flex w-full justify-center"
              delay={(i % 2) * 100 + Math.min(Math.floor(i / 2), 3) * 90}
            >
              {/* Each print also settles in from slightly small as it
                  appears, so they arrive one by one, left to right, row
                  by row. */}
              <div className="w-full scale-[0.95] transition-transform duration-[650ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-[.is-revealed]/r:scale-100 motion-reduce:transition-none">
                <PrintCard
                  print={p}
                  onOpen={() => go({ section: "inspiration", slug: p.id })}
                />
              </div>
            </Reveal>
          </li>
        ))}
      </ul>
    </>
  );
}
