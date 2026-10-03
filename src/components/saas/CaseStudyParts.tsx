import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

// Layout pieces shared by the case studies written natively for the shell
// (Pack, PPVP): a small eyebrow, a readable prose column, a section block,
// the sticky "On this page" index, a staggered list, and a numbered
// workflow section.

// A small label above a heading. A number gets a chip, the "Case study"
// label carries Pack's own logo, and the rest are plain text.
export function Eyebrow({ children, n, logo, logoMask }: { children: ReactNode; n?: string; logo?: string; logoMask?: boolean }) {
  return (
    <p className="flex items-center gap-2 text-[13px] font-medium text-foreground/55">
      {n && (
        <span className="grid size-[18px] place-items-center rounded-[4px] bg-[var(--surface-2)] text-[11px] tabular-nums text-foreground/70">{n}</span>
      )}
      {logo && logoMask ? (
        <span
          aria-hidden="true"
          className="block size-[18px] bg-foreground/80"
          style={{ maskImage: `url(${logo})`, WebkitMaskImage: `url(${logo})`, maskSize: "contain", WebkitMaskSize: "contain", maskRepeat: "no-repeat", WebkitMaskRepeat: "no-repeat", maskPosition: "center", WebkitMaskPosition: "center" }}
        />
      ) : logo ? (
        <img src={logo} alt="" aria-hidden="true" className="size-[18px] rounded-[4px]" />
      ) : null}
      {children}
    </p>
  );
}

export function Prose({ children }: { children: ReactNode }) {
  return <div className="max-w-[44rem] space-y-4 text-[16px] leading-[1.7] text-foreground/80 [&_p]:text-pretty">{children}</div>;
}

export function Block({ id, className, children }: { id: string; className?: string; children: ReactNode }) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className={cn("scroll-mt-8 pt-14", className)}>
      {children}
    </section>
  );
}

export type NavEntry = { id: string; label: string; group?: string };

export function Toc({ nav, scroller }: { nav: NavEntry[]; scroller: React.RefObject<HTMLDivElement | null> }) {
  const [current, setCurrent] = useState(nav[0].id);

  // Follow whichever section is crossing the upper part of the panel.
  useEffect(() => {
    const root = scroller.current;
    if (!root) return;
    const io = new IntersectionObserver(
      (entries) => {
        const hit = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
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
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    document.getElementById(id)?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
  };

  return (
    <nav aria-label="On this page" className="sticky top-8">
      <p className="mb-3 text-xs font-medium text-foreground/45">On this page</p>
      <ul className="space-y-0.5 border-l border-[var(--line)]">
        {nav.map((n) => (
          <li key={n.id}>
            {n.group && <p className="mb-1 mt-3 pl-3 text-[11px] text-foreground/40">{n.group}</p>}
            <button
              type="button"
              onClick={() => jump(n.id)}
              aria-current={current === n.id ? "location" : undefined}
              className={cn(
                "-ml-px block w-full border-l py-1 pl-3 text-left text-[13px] outline-none transition-colors focus-visible:text-foreground focus-visible:underline",
                current === n.id ? "border-foreground font-medium text-foreground" : "border-transparent text-foreground/55 hover:text-foreground",
              )}
            >
              {n.label}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}

// Children inside a Stagger arrive one after another, left to right,
// the first time it scrolls into view. It is armed (children hidden)
// only once script has run, so the content is never stranded invisible,
// and not at all with reduced motion or in a page that can't animate.
export function Stagger({ className, children }: { className?: string; children: ReactNode }) {
  const ref = useRef<HTMLOListElement>(null);
  const [state, setState] = useState<"idle" | "armed" | "seen">("idle");

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || document.hidden) {
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
  children,
}: {
  id: string;
  n: string;
  label: string;
  heading: string;
  body: string[];
  children: ReactNode;
}) {
  return (
    <Block id={id} className="pt-12">
      <Eyebrow n={n}>{label}</Eyebrow>
      <h3 id={`${id}-title`} className="mt-2.5 max-w-[40rem] text-balance text-[20px] font-semibold leading-snug tracking-tight">
        {heading}
      </h3>
      <div className="mt-3">
        <Prose>
          {body.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </Prose>
      </div>
      {children}
    </Block>
  );
}
