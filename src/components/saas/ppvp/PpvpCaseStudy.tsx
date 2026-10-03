import { useRef } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import type { Route } from "../data";
import { Block, Eyebrow, Prose, Toc, Workflow } from "../CaseStudyParts";
import { Expandable, Figure, ShotTabs } from "../pack/parts";
import { ppvp } from "./ppvpContent";

// PPVP, in the same layout as Pack: one reading column, a sticky "On this
// page" index, and every screenshot a click away from full size.

type Go = (r: Route) => void;

const NAV = [
  { id: "challenge", label: "Challenge" },
  { id: "approach", label: "Approach" },
  { id: "onboarding", label: "Onboarding", group: "The work" },
  { id: "feed", label: "Core feed" },
  { id: "discovery", label: "Deal discovery" },
  { id: "ui-kit", label: "UI kit" },
  { id: "admin", label: "Admin tools" },
  { id: "outcome", label: "Outcome" },
  { id: "quote", label: "In their words" },
];

const H2 = "mt-2.5 max-w-[40rem] text-balance text-[26px] font-semibold leading-tight tracking-tight";

export default function PpvpCaseStudy({ go }: { go: Go }) {
  const scroller = useRef<HTMLDivElement>(null);

  return (
    <div ref={scroller} className="size-full overflow-y-auto">
      <div className="mx-auto grid max-w-[1120px] gap-x-16 px-5 pb-20 pt-9 sm:px-8 xl:grid-cols-[minmax(0,1fr)_180px]">
        <article className="min-w-0">
          {/* Header */}
          <Eyebrow logo="/case-studies/ppvp/ppvp-mark.png" logoMask>
            Case study
          </Eyebrow>
          <h1 className="mt-2.5 text-[36px] font-semibold leading-none tracking-[-0.025em] sm:text-[44px]">{ppvp.title}</h1>
          <p className="mt-4 max-w-[40rem] text-pretty text-[18px] leading-[1.55] text-foreground/65">{ppvp.summary}</p>

          <dl className="mt-7 grid grid-cols-2 gap-x-8 gap-y-3 border-y border-[var(--line)] py-4 sm:grid-cols-4">
            {ppvp.meta.map((m) => (
              <div key={m.label}>
                <dt className="text-xs text-foreground/50">{m.label}</dt>
                <dd className="mt-1 text-sm font-medium">{m.value}</dd>
              </div>
            ))}
          </dl>

          <Expandable src={ppvp.hero.src} alt={ppvp.hero.alt}>
            <img
              src={ppvp.hero.src}
              alt={ppvp.hero.alt}
              width={ppvp.hero.width}
              height={ppvp.hero.height}
              className="mt-7 h-auto w-full rounded-[4px] border border-[var(--line)]"
            />
          </Expandable>

          {/* In brief */}
          <div className="mt-6 rounded-[4px] border border-[var(--line)] bg-[var(--surface)] p-4 sm:p-5">
            <p className="text-xs font-medium text-foreground/50">In brief</p>
            <dl className="mt-3 divide-y divide-[var(--line)]">
              {ppvp.brief.map((b) => (
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
              {ppvp.challenge.heading}
            </h2>
            <div className="mt-4">
              <Prose>
                {ppvp.challenge.paragraphs.map((p) => (
                  <p key={p}>{p}</p>
                ))}
              </Prose>
            </div>
            <Figure className="mt-8" {...ppvp.challenge.figure} />
          </Block>

          {/* Approach */}
          <Block id="approach">
            <Eyebrow>Approach</Eyebrow>
            <h2 id="approach-title" className={H2}>
              {ppvp.approach.heading}
            </h2>
            <div className="mt-4">
              <Prose>
                {ppvp.approach.paragraphs.map((p) => (
                  <p key={p}>{p}</p>
                ))}
              </Prose>
            </div>
            <Figure className="mt-8" {...ppvp.approach.figure} />
          </Block>

          {/* The work */}
          <Block id="work" className="pt-16">
            <Eyebrow>The work</Eyebrow>
            <h2 id="work-title" className={H2}>
              {ppvp.workflowsHeading}
            </h2>
          </Block>

          <Workflow id="onboarding" n={ppvp.onboarding.n} label={ppvp.onboarding.label} heading={ppvp.onboarding.heading} body={ppvp.onboarding.body}>
            <ShotTabs id="onboarding" label="Onboarding screens" shots={ppvp.onboarding.shots} />
          </Workflow>

          <Workflow id="feed" n={ppvp.feed.n} label={ppvp.feed.label} heading={ppvp.feed.heading} body={ppvp.feed.body}>
            <ShotTabs id="feed" label="Feed screens" shots={ppvp.feed.shots} />
          </Workflow>

          <Workflow id="discovery" n={ppvp.discovery.n} label={ppvp.discovery.label} heading={ppvp.discovery.heading} body={ppvp.discovery.body}>
            <ShotTabs id="discovery" label="Deal screens" shots={ppvp.discovery.shots} />
          </Workflow>

          <Workflow id="ui-kit" n={ppvp.uiKit.n} label={ppvp.uiKit.label} heading={ppvp.uiKit.heading} body={ppvp.uiKit.body}>
            <ShotTabs id="ui-kit" label="UI kit" shots={ppvp.uiKit.shots} />
          </Workflow>

          <Workflow id="admin" n={ppvp.admin.n} label={ppvp.admin.label} heading={ppvp.admin.heading} body={ppvp.admin.body}>
            <ShotTabs id="admin" label="Admin screens" shots={ppvp.admin.shots} />
          </Workflow>

          {/* Outcome */}
          <Block id="outcome" className="pt-16">
            <Eyebrow>Outcome</Eyebrow>
            <h2 id="outcome-title" className={H2}>
              {ppvp.outcome.heading}
            </h2>
            <div className="mt-4">
              <Prose>
                <p>{ppvp.outcome.text}</p>
              </Prose>
            </div>
            <dl className="mt-6 grid max-w-[44rem] grid-cols-2 gap-3">
              {ppvp.outcome.stats.map((s) => (
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
              <p className="text-pretty text-[22px] font-medium leading-[1.5] tracking-tight">“{ppvp.quote.text}”</p>
              <footer className="mt-5 text-sm text-foreground/60">{ppvp.quote.attribution}</footer>
            </blockquote>
          </Block>

          {/* Next */}
          <nav aria-label="More work" className="mt-16 grid gap-3 border-t border-[var(--line)] pt-6 sm:grid-cols-2">
            <button
              type="button"
              onClick={() => go({ section: "work", slug: "pack" })}
              className="group rounded-[4px] border border-[var(--line)] p-3.5 text-left outline-none transition-colors hover:bg-[var(--surface)] focus-visible:ring-2 focus-visible:ring-ring/60"
            >
              <span className="flex items-center gap-1.5 text-xs text-foreground/50">
                <ArrowLeft className="size-3 transition-transform group-hover:-translate-x-0.5" aria-hidden="true" /> Previous case study
              </span>
              <span className="mt-1 block text-sm font-medium">Pack</span>
            </button>
            <button
              type="button"
              onClick={() => go({ section: "work", slug: "inveterate" })}
              className="group rounded-[4px] border border-[var(--line)] p-3.5 text-left outline-none transition-colors hover:bg-[var(--surface)] focus-visible:ring-2 focus-visible:ring-ring/60 sm:text-right"
            >
              <span className="flex items-center gap-1.5 text-xs text-foreground/50 sm:justify-end">
                Next case study <ArrowRight className="size-3 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
              </span>
              <span className="mt-1 block text-sm font-medium">Inveterate</span>
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
