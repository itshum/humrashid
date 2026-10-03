import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { Tooltip } from "radix-ui";
import { cn } from "@/lib/utils";
import { initReveal } from "../../scripts/reveal";
import "../../styles/reveal.css";

// Layout pieces shared by the case studies written natively for the shell
// (Pack, PPVP): a small eyebrow, a readable prose column, a section block,
// the sticky "On this page" index, a staggered list, and a numbered
// workflow section.

// A small label above a heading. A number gets a chip, the "Case study"
// label carries Pack's own logo, and the rest are plain text.
export function Eyebrow({
  children,
  n,
  logo,
  logoMask,
}: {
  children: ReactNode;
  n?: string;
  logo?: string;
  logoMask?: boolean;
}) {
  return (
    <p className="flex items-center gap-2 text-[13px] font-medium text-foreground/60">
      {n && (
        <span className="grid size-[18px] place-items-center rounded-[4px] bg-[var(--surface-2)] text-[11px] tabular-nums text-foreground/70">
          {n}
        </span>
      )}
      {logo && logoMask ? (
        <span
          aria-hidden="true"
          className="block size-[18px] bg-foreground/80"
          style={{
            maskImage: `url(${logo})`,
            WebkitMaskImage: `url(${logo})`,
            maskSize: "contain",
            WebkitMaskSize: "contain",
            maskRepeat: "no-repeat",
            WebkitMaskRepeat: "no-repeat",
            maskPosition: "center",
            WebkitMaskPosition: "center",
          }}
        />
      ) : logo ? (
        <img
          src={logo}
          alt=""
          aria-hidden="true"
          className="size-[18px] rounded-[4px]"
        />
      ) : null}
      {children}
    </p>
  );
}

export function Prose({ children }: { children: ReactNode }) {
  return (
    <div className="max-w-[44rem] space-y-4 text-[16px] leading-[1.7] text-foreground/80 [&_p]:text-pretty">
      {children}
    </div>
  );
}

export function Block({
  id,
  className,
  children,
}: {
  id: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-title`}
      className={cn("scroll-mt-8 pt-14", className)}
    >
      {children}
    </section>
  );
}

// Scroll reveal, the same as the live site (src/styles/reveal.css and
// src/scripts/reveal.ts): a block fades in with a small lift as it nears
// the fold. This is the default for every case study template. Put
// `data-reveal` on a block (or wrap it in <Reveal>), and call the hook
// once at the top of the case study. The shared parts (Figure, ShotTabs,
// ShotGrid, Compare, Workflow) already do the first part.
export function useCaseStudyReveal() {
  useEffect(() => initReveal(), []);
}

// A wrapper whose class never changes, so React can't wipe the
// `is-revealed` class the script adds. `delay` staggers siblings.
export function Reveal({
  children,
  className,
  delay,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <div
      data-reveal
      className={className}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </div>
  );
}

export type NavEntry = { id: string; label: string; group?: string };

export function Toc({
  nav,
  scroller,
}: {
  nav: NavEntry[];
  scroller: React.RefObject<HTMLDivElement | null>;
}) {
  const [current, setCurrent] = useState(nav[0].id);
  // The index stays out of the way through the title, summary, hero and
  // the start of the first section, and fades in once that section's
  // heading has scrolled up to the top of the panel.
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const root = scroller.current;
    if (!root) return;
    let frame = 0;
    const check = () => {
      frame = 0;
      const first = document.getElementById(nav[0].id);
      if (!first) return setShown(true);
      const box = root.getBoundingClientRect();
      setShown(first.getBoundingClientRect().top - box.top < 80);
    };
    const onScroll = () => {
      if (document.hidden) check();
      else if (!frame) frame = requestAnimationFrame(check);
    };
    check();
    root.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      root.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [nav, scroller]);

  // Follow whichever section is crossing the upper part of the panel.
  useEffect(() => {
    const root = scroller.current;
    if (!root) return;
    const io = new IntersectionObserver(
      (entries) => {
        const hit = entries
          .filter((e) => e.isIntersecting)
          .sort(
            (a, b) => a.boundingClientRect.top - b.boundingClientRect.top,
          )[0];
        if (hit) setCurrent(hit.target.id);
      },
      { root, rootMargin: "-12% 0px -70% 0px", threshold: 0 },
    );
    nav.forEach((n) => {
      const el = document.getElementById(n.id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, [nav, scroller]);

  const jump = (id: string) => {
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    document.getElementById(id)?.scrollIntoView({
      behavior: reduce ? "auto" : "smooth",
      block: "start",
    });
  };

  // A column of short lines, one per section, and nothing else: the
  // section you are in is a longer, darker line, and every line names
  // itself in a tooltip on hover. It takes a 28px column, so the page
  // itself gets the room.
  return (
    <Tooltip.Provider delayDuration={120} skipDelayDuration={300}>
      <nav
        aria-label="On this page"
        aria-hidden={!shown}
        className={cn(
          "sticky top-9 flex flex-col items-end transition-opacity duration-300 motion-reduce:transition-none",
          shown ? "opacity-100" : "pointer-events-none opacity-0",
        )}
      >
        {nav.map((n, i) => {
          const on = current === n.id;
          const label = (
            <button
              type="button"
              onClick={() => jump(n.id)}
              aria-current={on ? "location" : undefined}
              aria-label={n.label}
              className="group relative flex h-4 w-7 items-center justify-end rounded-sm outline-none focus-visible:ring-2 focus-visible:ring-ring/60"
            >
              <span
                aria-hidden="true"
                className={cn(
                  "block h-[2px] rounded-full transition-[width,background-color] duration-200 ease-out motion-reduce:transition-none",
                  on
                    ? "w-5 bg-foreground"
                    : "w-3 bg-foreground/20 group-hover:w-4 group-hover:bg-foreground/55 group-focus-visible:bg-foreground/55",
                )}
              />
            </button>
          );
          return (
            <div key={n.id} className={cn(n.group && i > 0 && "mt-1.5")}>
              <Tooltip.Root>
                <Tooltip.Trigger asChild>{label}</Tooltip.Trigger>
                <Tooltip.Portal>
                  <Tooltip.Content
                    side="left"
                    sideOffset={10}
                    className="saas z-50 rounded-md bg-[var(--panel)] px-2.5 py-1.5 text-xs font-medium text-foreground shadow-[0_8px_30px_rgb(0_0_0/0.16)] ring-1 ring-foreground/[0.1] data-[state=delayed-open]:animate-in data-[state=delayed-open]:fade-in-0 data-[state=instant-open]:animate-in data-[state=instant-open]:fade-in-0"
                  >
                    {n.label}
                  </Tooltip.Content>
                </Tooltip.Portal>
              </Tooltip.Root>
            </div>
          );
        })}
      </nav>
    </Tooltip.Provider>
  );
}

// Children inside a Stagger arrive one after another, left to right,
// the first time it scrolls into view. It is armed (children hidden)
// only once script has run, so the content is never stranded invisible,
// and not at all with reduced motion or in a page that can't animate.
export function Stagger({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  const ref = useRef<HTMLOListElement>(null);
  const [state, setState] = useState<"idle" | "armed" | "seen">("idle");

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      document.hidden
    ) {
      setState("seen");
      return;
    }
    setState("armed");
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setState("seen");
        io.disconnect();
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.15 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <ol ref={ref} data-state={state} className={cn("group/stagger", className)}>
      {children}
    </ol>
  );
}

export function Workflow({
  id,
  n,
  label,
  heading,
  body,
  first = false,
  children,
}: {
  id: string;
  n: string;
  label: string;
  heading: string;
  body: string[];
  // The first one follows the "The work" heading closely; the rest are
  // spaced further apart.
  first?: boolean;
  children: ReactNode;
}) {
  return (
    <Block id={id} className={first ? "pt-12" : "pt-20"}>
      <Reveal>
        <Eyebrow n={n}>{label}</Eyebrow>
        <h3
          id={`${id}-title`}
          className="mt-2.5 max-w-[40rem] text-balance text-[20px] font-semibold leading-snug tracking-tight"
        >
          {heading}
        </h3>
        <div className="mt-3">
          <Prose>
            {body.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </Prose>
        </div>
      </Reveal>
      {children}
    </Block>
  );
}
