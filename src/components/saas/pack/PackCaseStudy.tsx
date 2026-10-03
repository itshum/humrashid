import { useRef } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import type { Route } from "../data";
import { Block, Eyebrow, Prose, Stagger, Toc, Workflow } from "../CaseStudyParts";
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


export default function PackCaseStudy({ go }: { go: Go }) {
  const scroller = useRef<HTMLDivElement>(null);

  return (
    <div ref={scroller} className="size-full overflow-y-auto">
      <div className="mx-auto grid max-w-[1120px] gap-x-16 px-5 pb-20 pt-9 sm:px-8 xl:grid-cols-[minmax(0,1fr)_180px]">
        <article className="min-w-0">
          {/* Header */}
          <Eyebrow logo="/case-studies/pack/pack-icon.svg">Case study</Eyebrow>
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
          <Toc nav={NAV} scroller={scroller} />
        </aside>
      </div>
    </div>
  );
}
