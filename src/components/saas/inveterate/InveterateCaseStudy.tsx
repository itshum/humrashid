import { useRef } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import type { Route } from "../data";
import { Block, Eyebrow, Prose, Toc, Workflow } from "../CaseStudyParts";
import { Compare, Expandable, Figure, ShotTabs } from "../pack/parts";
import { inveterate } from "./inveterateContent";

// Inveterate, in the same layout as Pack: one reading column, a sticky "On this
// page" index, and every screenshot a click away from full size.

type Go = (r: Route) => void;

const NAV = [
  { id: "challenge", label: "Challenge" },
  { id: "approach", label: "Approach" },
  { id: "brand", label: "Brand system", group: "The work" },
  { id: "data", label: "Data and analytics" },
  { id: "benefits", label: "Benefits" },
  { id: "builder", label: "Program builder" },
  { id: "outcome", label: "Outcome" },
  { id: "quote", label: "In their words" },
];

const H2 = "mt-2.5 max-w-[40rem] text-balance text-[26px] font-semibold leading-tight tracking-tight";

export default function InveterateCaseStudy({ go }: { go: Go }) {
  const scroller = useRef<HTMLDivElement>(null);

  return (
    <div ref={scroller} className="size-full overflow-y-auto">
      <div className="mx-auto grid max-w-[1120px] gap-x-16 px-5 pb-20 pt-9 sm:px-8 xl:grid-cols-[minmax(0,1fr)_180px]">
        <article className="min-w-0">
          {/* Header */}
          <Eyebrow logo="/case-studies/inveterate/inveterate-mark.png">
            Case study
          </Eyebrow>
          <h1 className="mt-2.5 text-[36px] font-semibold leading-none tracking-[-0.025em] sm:text-[44px]">{inveterate.title}</h1>
          <p className="mt-4 max-w-[40rem] text-pretty text-[18px] leading-[1.55] text-foreground/65">{inveterate.summary}</p>

          <dl className="mt-7 grid grid-cols-2 gap-x-8 gap-y-3 border-y border-[var(--line)] py-4 sm:grid-cols-4">
            {inveterate.meta.map((m) => (
              <div key={m.label}>
                <dt className="text-xs text-foreground/50">{m.label}</dt>
                <dd className="mt-1 text-sm font-medium">{m.value}</dd>
              </div>
            ))}
          </dl>

          <Expandable src={inveterate.hero.src} alt={inveterate.hero.alt}>
            <img
              src={inveterate.hero.src}
              alt={inveterate.hero.alt}
              width={inveterate.hero.width}
              height={inveterate.hero.height}
              className="mt-7 h-auto w-full rounded-[4px] border border-[var(--line)]"
            />
          </Expandable>

          {/* In brief */}
          <div className="mt-6 rounded-[4px] border border-[var(--line)] bg-[var(--surface)] p-4 sm:p-5">
            <p className="text-xs font-medium text-foreground/50">In brief</p>
            <dl className="mt-3 divide-y divide-[var(--line)]">
              {inveterate.brief.map((b) => (
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
            <h2 id="challenge-title" className={H2}>
              {inveterate.challenge.heading}
            </h2>
            <div className="mt-4">
              <Prose>
                {inveterate.challenge.paragraphs.map((p) => (
                  <p key={p}>{p}</p>
                ))}
              </Prose>
            </div>
            <Figure className="mt-8" {...inveterate.challenge.figure} />
          </Block>

          {/* Approach */}
          <Block id="approach">
            <Eyebrow>Approach</Eyebrow>
            <h2 id="approach-title" className={H2}>
              {inveterate.approach.heading}
            </h2>
            <div className="mt-4">
              <Prose>
                {inveterate.approach.paragraphs.map((p) => (
                  <p key={p}>{p}</p>
                ))}
              </Prose>
            </div>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {inveterate.approach.shots.map((sh) => (
                <figure key={sh.id}>
                  <Expandable src={sh.src} alt={sh.alt}>
                    <img src={sh.src} alt={sh.alt} loading="lazy" className="aspect-[9/8] w-full rounded-[4px] border border-[var(--line)] object-cover object-top" />
                  </Expandable>
                  <figcaption className="mt-2.5 text-[13px] leading-[1.45] text-foreground/55">{sh.caption}</figcaption>
                </figure>
              ))}
            </div>
            <Figure className="mt-8" {...inveterate.approach.figure} />
          </Block>

          {/* The work */}
          <Block id="work" className="pt-16">
            <Eyebrow>The work</Eyebrow>
            <h2 id="work-title" className={H2}>
              {inveterate.workflowsHeading}
            </h2>
          </Block>

          <Workflow id="brand" n={inveterate.brand.n} label={inveterate.brand.label} heading={inveterate.brand.heading} body={inveterate.brand.body}>
            <ShotTabs id="brand" label="Brand screens" shots={inveterate.brand.shots} />
          </Workflow>

          <Workflow id="data" n={inveterate.data.n} label={inveterate.data.label} heading={inveterate.data.heading} body={inveterate.data.body}>
            <Compare before={inveterate.data.before} after={inveterate.data.after} alt={inveterate.data.alt} caption={inveterate.data.caption} />
            <ShotTabs id="data" label="Data screens" shots={inveterate.data.shots} />
          </Workflow>

          <Workflow id="benefits" n={inveterate.benefits.n} label={inveterate.benefits.label} heading={inveterate.benefits.heading} body={inveterate.benefits.body}>
            <ShotTabs id="benefits" label="Benefit screens" shots={inveterate.benefits.shots} />
          </Workflow>

          <Workflow id="builder" n={inveterate.builder.n} label={inveterate.builder.label} heading={inveterate.builder.heading} body={inveterate.builder.body}>
            <ShotTabs id="builder" label="Builder screens" shots={inveterate.builder.shots} />
          </Workflow>

          {/* Outcome */}
          <Block id="outcome" className="pt-16">
            <Eyebrow>Outcome</Eyebrow>
            <h2 id="outcome-title" className={H2}>
              {inveterate.outcome.heading}
            </h2>
            <div className="mt-4">
              <Prose>
                <p>{inveterate.outcome.text}</p>
              </Prose>
            </div>
            <dl className="mt-6 grid max-w-[44rem] grid-cols-3 gap-3">
              {inveterate.outcome.stats.map((s) => (
                <div key={s.label} className="rounded-[4px] border border-[var(--line)] bg-[var(--surface)] p-4">
                  <dd className="text-[32px] font-semibold leading-none tracking-tight tabular-nums">{s.value}</dd>
                  <dt className="mt-2 text-[13px] text-foreground/55">{s.label}</dt>
                </div>
              ))}
            </dl>
          </Block>

          {/* Quote */}
          <Block id="quote" className="pt-16">
            <h2 id="quote-title" className="sr-only">
              In their words
            </h2>
            <blockquote className="max-w-[44rem] border-l-2 border-foreground/80 pl-6">
              <p className="text-pretty text-[22px] font-medium leading-[1.5] tracking-tight">“{inveterate.quote.text}”</p>
              <footer className="mt-5 text-sm text-foreground/60">{inveterate.quote.attribution}</footer>
            </blockquote>
          </Block>

          {/* Next */}
          <nav aria-label="More work" className="mt-16 grid gap-3 border-t border-[var(--line)] pt-6 sm:grid-cols-2">
            <button
              type="button"
              onClick={() => go({ section: "work", slug: "ppvp" })}
              className="group rounded-[4px] border border-[var(--line)] p-3.5 text-left outline-none transition-colors hover:bg-[var(--surface)] focus-visible:ring-2 focus-visible:ring-ring/60"
            >
              <span className="flex items-center gap-1.5 text-xs text-foreground/50">
                <ArrowLeft className="size-3 transition-transform group-hover:-translate-x-0.5" aria-hidden="true" /> Previous case study
              </span>
              <span className="mt-1 block text-sm font-medium">PPVP</span>
            </button>
            <button
              type="button"
              onClick={() => go({ section: "work" })}
              className="group rounded-[4px] border border-[var(--line)] p-3.5 text-left outline-none transition-colors hover:bg-[var(--surface)] focus-visible:ring-2 focus-visible:ring-ring/60 sm:text-right"
            >
              <span className="flex items-center gap-1.5 text-xs text-foreground/50 sm:justify-end">
                All work <ArrowRight className="size-3 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
              </span>
              <span className="mt-1 block text-sm font-medium">Back to the list</span>
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
