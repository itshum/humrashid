import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Route } from "../data";
import { Compare, Expandable, Figure, ShotTabs } from "./parts";
import { pack } from "./packContent";

// Pack, laid out for reading inside the product shell: one comfortable
// column (about 70 characters), a sticky "On this page" index that
// follows along, and every screenshot a click away from full size.

type Go = (r: Route) => void;

const NAV = [
  { id: "challenge", label: "Challenge" },
  { id: "approach", label: "Approach" },
  { id: "dashboard", label: "Dashboard", group: "Workflows" },
  { id: "developer", label: "Developer experience" },
  { id: "customizer", label: "Site customizer" },
  { id: "merchandising", label: "Merchandising" },
  { id: "design-system", label: "Design system" },
  { id: "quote", label: "In their words" },
];

const PIXEL = "#d6a24f"; // Pack's color in the work list

function Eyebrow({ children, n }: { children: ReactNode; n?: string }) {
  return (
    <p className="flex items-center gap-2 text-[13px] font-medium text-foreground/55">
      {n ? (
        <span className="grid size-[18px] place-items-center rounded-[4px] bg-[var(--surface-2)] text-[11px] tabular-nums text-foreground/70">{n}</span>
      ) : (
        <span aria-hidden="true" className="size-2.5 rounded-[3px]" style={{ background: PIXEL }} />
      )}
      {children}
    </p>
  );
}

function Prose({ children }: { children: ReactNode }) {
  return <div className="max-w-[44rem] space-y-4 text-[16px] leading-[1.7] text-foreground/80 [&_p]:text-pretty">{children}</div>;
}

function Block({ id, className, children }: { id: string; className?: string; children: ReactNode }) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className={cn("scroll-mt-8 pt-14", className)}>
      {children}
    </section>
  );
}

function Toc({ scroller }: { scroller: React.RefObject<HTMLDivElement | null> }) {
  const [current, setCurrent] = useState(NAV[0].id);

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
    NAV.forEach((n) => {
      const el = document.getElementById(n.id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, [scroller]);

  const jump = (id: string) => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    document.getElementById(id)?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
  };

  return (
    <nav aria-label="On this page" className="sticky top-8">
      <p className="mb-3 text-xs font-medium text-foreground/45">On this page</p>
      <ul className="space-y-0.5 border-l border-[var(--line)]">
        {NAV.map((n) => (
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
function Stagger({ className, children }: { className?: string; children: ReactNode }) {
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

function Workflow({
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

export default function PackCaseStudy({ go }: { go: Go }) {
  const scroller = useRef<HTMLDivElement>(null);

  return (
    <div ref={scroller} className="size-full overflow-y-auto">
      <div className="mx-auto grid max-w-[1120px] gap-x-16 px-5 pb-20 pt-9 sm:px-8 xl:grid-cols-[minmax(0,1fr)_180px]">
        <article className="min-w-0">
          {/* Header */}
          <Eyebrow>Case study</Eyebrow>
          <h1 className="mt-2.5 text-[36px] font-semibold leading-none tracking-[-0.025em] sm:text-[44px]">{pack.title}</h1>
          <p className="mt-4 max-w-[40rem] text-pretty text-[18px] leading-[1.55] text-foreground/65">{pack.summary}</p>

          <dl className="mt-7 grid grid-cols-2 gap-x-8 gap-y-3 border-y border-[var(--line)] py-4 sm:grid-cols-4">
            {pack.meta.map((m) => (
              <div key={m.label}>
                <dt className="text-xs text-foreground/50">{m.label}</dt>
                <dd className="mt-1 text-sm font-medium">{m.value}</dd>
              </div>
            ))}
          </dl>

          <Expandable src={pack.hero.src} alt={pack.hero.alt}>
            <img
              src={pack.hero.src}
              alt={pack.hero.alt}
              width={pack.hero.width}
              height={pack.hero.height}
              className="mt-7 h-auto w-full rounded-[4px] border border-[var(--line)]"
            />
          </Expandable>

          {/* In brief */}
          <div className="mt-6 rounded-[4px] border border-[var(--line)] bg-[var(--surface)] p-4 sm:p-5">
            <p className="text-xs font-medium text-foreground/50">In brief</p>
            <dl className="mt-3 divide-y divide-[var(--line)]">
              {pack.brief.map((b) => (
                <div key={b.label} className="grid gap-1 py-2.5 first:pt-0 last:pb-0 sm:grid-cols-[110px_minmax(0,1fr)] sm:gap-6">
                  <dt className="text-[13px] font-medium text-foreground/70">{b.label}</dt>
                  <dd className="text-[15px] leading-6 text-foreground/80">{b.text}</dd>
                </div>
              ))}
            </dl>
          </div>

          {/* Challenge */}
          <Block id="challenge">
            <Eyebrow>Challenge</Eyebrow>
            <h2 id="challenge-title" className="mt-2.5 max-w-[40rem] text-balance text-[26px] font-semibold leading-tight tracking-tight">
              {pack.challenge.heading}
            </h2>
            <div className="mt-4">
              <Prose>
                {pack.challenge.paragraphs.map((p) => (
                  <p key={p}>{p}</p>
                ))}
              </Prose>
            </div>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {pack.challenge.shots.map((s) => (
                <figure key={s.id}>
                  <Expandable src={s.src} alt={s.alt}>
                    <img src={s.src} alt={s.alt} loading="lazy" className="aspect-[4/3] w-full rounded-[4px] border border-[var(--line)] object-cover object-top" />
                  </Expandable>
                  <figcaption className="mt-2.5 text-[13px] leading-[1.45] text-foreground/55">{s.caption}</figcaption>
                </figure>
              ))}
            </div>
          </Block>

          {/* Approach */}
          <Block id="approach">
            <Eyebrow>Approach</Eyebrow>
            <h2 id="approach-title" className="mt-2.5 max-w-[40rem] text-balance text-[26px] font-semibold leading-tight tracking-tight">
              {pack.approach.heading}
            </h2>
            <div className="mt-4">
              <Prose>
                <p>{pack.approach.lead}</p>
              </Prose>
            </div>
            <Stagger className="mt-5 grid gap-3 sm:grid-cols-3">
              {pack.approach.patterns.map((p, i) => (
                <li
                  key={p.n}
                  style={{ transitionDelay: `${i * 130}ms` }}
                  className="rounded-[4px] border border-[var(--line)] bg-[var(--surface)] p-3.5 transition-[opacity,transform] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-data-[state=armed]/stagger:-translate-x-3 group-data-[state=armed]/stagger:opacity-0 motion-reduce:transition-none"
                >
                  <span className="text-[13px] font-semibold tabular-nums text-foreground/60">{p.n}</span>
                  <p className="mt-2 text-balance text-[15px] font-medium leading-6">{p.text}</p>
                </li>
              ))}
            </Stagger>
            <div className="mt-6">
              <Prose>
                {pack.approach.paragraphs.map((p) => (
                  <p key={p}>{p}</p>
                ))}
              </Prose>
            </div>
            <Figure className="mt-8" {...pack.approach.nav} />
          </Block>

          {/* Workflows */}
          <Block id="workflows" className="pt-16">
            <Eyebrow>The work</Eyebrow>
            <h2 id="workflows-title" className="mt-2.5 max-w-[40rem] text-balance text-[26px] font-semibold leading-tight tracking-tight">
              {pack.workflowsHeading}
            </h2>
          </Block>

          <Workflow id="dashboard" n={pack.dashboard.n} label={pack.dashboard.label} heading={pack.dashboard.heading} body={pack.dashboard.body}>
            <Compare before={pack.dashboard.before} after={pack.dashboard.after} alt={pack.dashboard.alt} caption={pack.dashboard.caption} />
          </Workflow>

          <Workflow id="developer" n={pack.developer.n} label={pack.developer.label} heading={pack.developer.heading} body={pack.developer.body}>
            <ShotTabs id="developer" label="Developer screens" shots={pack.developer.shots} />
          </Workflow>

          <Workflow id="customizer" n={pack.customizer.n} label={pack.customizer.label} heading={pack.customizer.heading} body={pack.customizer.body}>
            <ShotTabs id="customizer" label="Customizer screens" shots={pack.customizer.shots} />
          </Workflow>

          <Workflow id="merchandising" n={pack.merchandising.n} label={pack.merchandising.label} heading={pack.merchandising.heading} body={pack.merchandising.body}>
            <ShotTabs id="merchandising" label="Merchandising screens" shots={pack.merchandising.shots} />
          </Workflow>

          <Workflow id="design-system" n={pack.designSystem.n} label={pack.designSystem.label} heading={pack.designSystem.heading} body={pack.designSystem.body}>
            <Figure className="mt-8" {...pack.designSystem.figure} />
          </Workflow>

          {/* Quote */}
          <Block id="quote" className="pt-16">
            <h2 id="quote-title" className="sr-only">
              In their words
            </h2>
            <blockquote className="max-w-[44rem] border-l-2 border-foreground/80 pl-6">
              <p className="text-pretty text-[22px] font-medium leading-[1.5] tracking-tight">“{pack.quote.text}”</p>
              <footer className="mt-5 text-sm text-foreground/60">{pack.quote.attribution}</footer>
            </blockquote>
          </Block>

          {/* Next */}
          <nav aria-label="More work" className="mt-16 grid gap-3 border-t border-[var(--line)] pt-6 sm:grid-cols-2">
            <button
              type="button"
              onClick={() => go({ section: "work" })}
              className="group rounded-[4px] border border-[var(--line)] p-3.5 text-left outline-none transition-colors hover:bg-[var(--surface)] focus-visible:ring-2 focus-visible:ring-ring/60"
            >
              <span className="flex items-center gap-1.5 text-xs text-foreground/50">
                <ArrowLeft className="size-3 transition-transform group-hover:-translate-x-0.5" aria-hidden="true" /> All work
              </span>
              <span className="mt-1 block text-sm font-medium">Back to the list</span>
            </button>
            <button
              type="button"
              onClick={() => go({ section: "work", slug: "ppvp" })}
              className="group rounded-[4px] border border-[var(--line)] p-3.5 text-left outline-none transition-colors hover:bg-[var(--surface)] focus-visible:ring-2 focus-visible:ring-ring/60 sm:text-right"
            >
              <span className="flex items-center gap-1.5 text-xs text-foreground/50 sm:justify-end">
                Next case study <ArrowRight className="size-3 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
              </span>
              <span className="mt-1 block text-sm font-medium">PPVP</span>
            </button>
          </nav>
        </article>

        <aside className="hidden xl:block">
          <Toc scroller={scroller} />
        </aside>
      </div>
    </div>
  );
}
