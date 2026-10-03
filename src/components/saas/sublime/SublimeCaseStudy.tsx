import { useRef, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import type { Route } from "../data";
import {
  Block,
  Eyebrow,
  Prose,
  Toc,
  Workflow,
  Reveal,
  useCaseStudyReveal,
} from "../CaseStudyParts";
import { ShotTabs } from "../pack/parts";
import { LatestWorkDemo } from "../LatestWorkDemo";
import { sublime } from "./sublimeContent";
import CampaignBuilder from "../../case-study/sublime/CampaignBuilder";
import AiGenerateModal from "../../case-study/sublime/AiGenerateModal";
import CoreLoop from "../../case-study/sublime/CoreLoop";
import ExecutiveDashboard from "../../case-study/sublime/ExecutiveDashboard";
import FeatureEvolutionGrid from "../../case-study/sublime/FeatureEvolutionGrid";
import ResultsLeaderboard from "../../case-study/sublime/ResultsLeaderboard";
import TrainingToggle from "../../case-study/sublime/TrainingToggle";
import BuilderNavVariants from "./BuilderNavVariants";
import BuilderWireframe from "./BuilderWireframe";
import LibraryFinal from "./LibraryFinal";
import LibraryWireframe from "./LibraryWireframe";
import TtpDiagram from "./TtpDiagram";
import "./sublimeShell.css";

// Sublime, in the same layout as Pack: one reading column, a sticky "On
// this page" index, and every screenshot a click away from full size.
// The interactive product demos from the standalone page sit on grey
// stages, captioned like the screenshots.

type Go = (r: Route) => void;

const NAV = [
  { id: "challenge", label: "Challenge" },
  { id: "approach", label: "Approach" },
  { id: "phase-1", label: "Private beta", group: "The work" },
  { id: "phase-2", label: "Public beta" },
  { id: "phase-3", label: "GA" },
  { id: "learned", label: "What I learned" },
  { id: "outcome", label: "Outcome" },
];

const H2 =
  "mt-2.5 max-w-[40rem] text-balance text-[26px] font-semibold leading-tight tracking-tight";
const H4 =
  "max-w-[40rem] text-balance text-[17px] font-semibold leading-snug tracking-tight";
const CAPTION =
  "mt-2.5 max-w-[44rem] text-[13px] leading-[1.45] text-foreground/65";

// A product demo on a grey stage, with its caption under it.
function Stage({
  children,
  caption,
  max = 1000,
  bare = false,
  className,
}: {
  children: ReactNode;
  caption: string;
  max?: number;
  // No grey panel: the demo fills the column on its own.
  bare?: boolean;
  className?: string;
}) {
  return (
    <figure data-reveal className={cn("mt-8", className)}>
      <div
        className={
          bare ? undefined : "rounded-[4px] bg-[var(--surface)] px-3 py-8 sm:px-8 sm:py-12"
        }
      >
        <div
          className="sv-demo mx-auto"
          style={bare ? undefined : { maxWidth: max }}
        >
          {children}
        </div>
      </div>
      <figcaption className={CAPTION}>{caption}</figcaption>
    </figure>
  );
}

// A drawn diagram, theme-aware, with its caption.
function Diagram({
  children,
  caption,
  className,
}: {
  children: ReactNode;
  caption: string;
  className?: string;
}) {
  return (
    <figure data-reveal className={cn("mt-8", className)}>
      <div className="sv-theme">{children}</div>
      <figcaption className={CAPTION}>{caption}</figcaption>
    </figure>
  );
}

export default function SublimeCaseStudy({ go }: { go: Go }) {
  const scroller = useRef<HTMLDivElement>(null);
  useCaseStudyReveal();
  const p3 = sublime.phase3;

  return (
    <div ref={scroller} className="size-full overflow-y-auto">
      <div className="mx-auto grid max-w-[1120px] gap-x-10 px-5 pb-32 pt-9 sm:px-8 xl:grid-cols-[minmax(0,1fr)_28px]">
        <article className="min-w-0">
          {/* Header */}
          <Eyebrow
            logo="/case-studies/sublime-security/sublime-eye.svg"
            logoMask
          >
            Case study
          </Eyebrow>
          <h1 className="mt-2.5 text-[36px] font-semibold leading-none tracking-[-0.025em] sm:text-[44px]">
            {sublime.title}
          </h1>
          <p className="mt-4 max-w-[40rem] text-pretty text-[18px] leading-[1.55] text-foreground/65">
            {sublime.summary}
          </p>

          <dl className="mt-9 grid grid-cols-2 gap-x-10 gap-y-5 sm:grid-cols-4">
            {sublime.meta.map((m) => (
              <div key={m.label}>
                <dt className="text-xs text-foreground/65">{m.label}</dt>
                <dd className="mt-1 text-sm font-medium">{m.value}</dd>
              </div>
            ))}
          </dl>

          {/* The hero plays the same demo as the Latest work card on Home:
              the figures count up, the range switches, and the tables
              scroll into view. */}
          <Reveal className="mt-9">
            <div
              role="img"
              aria-label={sublime.hero.alt}
              className="relative aspect-[3440/2080] w-full overflow-hidden rounded-[4px] bg-[#e6f6f0]"
            >
              <LatestWorkDemo zoom={0.88} top="5%" />
            </div>
          </Reveal>

          {/* In brief */}
          <div
            data-reveal
            className="mt-6 rounded-[4px] bg-foreground/[0.025] p-4 sm:p-5"
          >
            <dl className="max-w-[44rem] space-y-1">
              {sublime.brief.map((b) => (
                <div
                  key={b.label}
                  className="grid gap-1 py-2 sm:grid-cols-[110px_minmax(0,1fr)] sm:gap-6"
                >
                  <dt className="text-[13px] font-medium text-foreground/70">
                    {b.label}
                  </dt>
                  <dd className="text-[15px] leading-6 text-foreground/80">
                    {b.text}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          {/* Challenge */}
          <Block id="challenge">
            <Reveal>
              <Eyebrow>Challenge</Eyebrow>
              <h2 id="challenge-title" className={H2}>
                {sublime.challenge.heading}
              </h2>
              <div className="mt-4">
                <Prose>
                  {sublime.challenge.paragraphs.map((p) => (
                    <p key={p}>{p}</p>
                  ))}
                </Prose>
              </div>
            </Reveal>
          </Block>

          {/* Approach */}
          <Block id="approach">
            <Reveal>
              <Eyebrow>Approach</Eyebrow>
              <h2 id="approach-title" className={H2}>
                {sublime.approach.heading}
              </h2>
              <div className="mt-4">
                <Prose>
                  {sublime.approach.paragraphs.map((p) => (
                    <p key={p}>{p}</p>
                  ))}
                </Prose>
              </div>
            </Reveal>
          </Block>

          {/* The work */}
          <Block id="work" className="pt-16">
            <Reveal>
              <Eyebrow>The work</Eyebrow>
              <h2 id="work-title" className={H2}>
                {sublime.phasesHeading}
              </h2>
              <p className="mt-4 max-w-[44rem] text-[16px] leading-[1.7] text-foreground/80">
                {sublime.phasesIntro}
              </p>
            </Reveal>
            <Diagram caption={sublime.phasesCaption}>
              <FeatureEvolutionGrid />
            </Diagram>
          </Block>

          {/* Phase 1 */}
          <Workflow
            id="phase-1"
            first
            n={sublime.phase1.n}
            label={sublime.phase1.label}
            heading={sublime.phase1.heading}
            body={sublime.phase1.body}
          >
            <Stage caption={sublime.phase1.caption} bare>
              <CoreLoop />
            </Stage>
            <Reveal className="mt-8">
              <Prose>
                <p>{sublime.phase1.after}</p>
              </Prose>
            </Reveal>
          </Workflow>

          {/* Phase 2 */}
          <Workflow
            id="phase-2"
            n={sublime.phase2.n}
            label={sublime.phase2.label}
            heading={sublime.phase2.heading}
            body={sublime.phase2.body}
          >
            <Diagram caption={sublime.phase2.ttpCaption}>
              <TtpDiagram />
            </Diagram>

            <div data-reveal className="mt-8 grid gap-3 sm:grid-cols-2">
              <figure>
                <LibraryWireframe />
                <figcaption className={CAPTION}>
                  {sublime.phase2.beforeCaption}
                </figcaption>
              </figure>
              <figure>
                <LibraryFinal />
                <figcaption className={CAPTION}>
                  {sublime.phase2.afterCaption}
                </figcaption>
              </figure>
            </div>

            <Reveal className="mt-8">
              <Prose>
                {sublime.phase2.after.map((t) => (
                  <p key={t}>{t}</p>
                ))}
              </Prose>
            </Reveal>

            <Stage caption={sublime.phase2.resultsCaption} max={640}>
              <ResultsLeaderboard />
            </Stage>
          </Workflow>

          {/* Phase 3 */}
          <Workflow
            id="phase-3"
            n={p3.n}
            label={p3.label}
            heading={p3.heading}
            body={p3.body}
          >
            <ShotTabs id="ga" label="GA screens" shots={p3.shots} />

            <Reveal className="mt-14">
              <h4 className={H4}>{p3.steps.heading}</h4>
              <div className="mt-3">
                <Prose>
                  {p3.steps.paragraphs.map((t) => (
                    <p key={t}>{t}</p>
                  ))}
                </Prose>
              </div>
            </Reveal>

            <div data-reveal className="mt-8 grid gap-3 sm:grid-cols-2">
              <figure>
                <BuilderWireframe />
                <figcaption className={CAPTION}>
                  {p3.steps.wireCaption}
                </figcaption>
              </figure>
              <figure>
                <BuilderNavVariants />
                <figcaption className={CAPTION}>
                  {p3.steps.navCaption}
                </figcaption>
              </figure>
            </div>

            <Stage caption={p3.steps.builderCaption}>
              <CampaignBuilder />
            </Stage>
            <Stage caption={p3.steps.trainingCaption}>
              <TrainingToggle />
            </Stage>

            <Reveal className="mt-14">
              <h4 className={H4}>{p3.ai.heading}</h4>
              <div className="mt-3">
                <Prose>
                  {p3.ai.paragraphs.map((t) => (
                    <p key={t}>{t}</p>
                  ))}
                </Prose>
              </div>
            </Reveal>
            <Stage caption={p3.ai.caption}>
              <AiGenerateModal />
            </Stage>

            <Reveal className="mt-14">
              <h4 className={H4}>{p3.guardrails.heading}</h4>
              <p className="mt-3 max-w-[44rem] text-[16px] leading-[1.7] text-foreground/80">
                {p3.guardrails.intro}
              </p>
            </Reveal>
            <ul
              data-reveal
              className="mt-6 grid max-w-[44rem] gap-3 sm:grid-cols-2"
            >
              {p3.guardrails.items.map((g) => (
                <li
                  key={g.title}
                  className="rounded-[4px] bg-[var(--surface)] p-4"
                >
                  <p className="text-sm font-medium">{g.title}</p>
                  <p className="mt-1 text-[13px] leading-[1.5] text-foreground/65">
                    {g.text}
                  </p>
                </li>
              ))}
            </ul>

            <Reveal className="mt-14">
              <h4 className={H4}>{p3.dashboard.heading}</h4>
              <div className="mt-3">
                <Prose>
                  {p3.dashboard.paragraphs.map((t) => (
                    <p key={t}>{t}</p>
                  ))}
                </Prose>
              </div>
            </Reveal>
            <Stage caption={p3.dashboard.caption}>
              <ExecutiveDashboard />
            </Stage>
          </Workflow>

          {/* What I learned */}
          <Block id="learned" className="pt-20">
            <Reveal>
              <Eyebrow>What I learned</Eyebrow>
              <h2 id="learned-title" className={H2}>
                {sublime.learned.heading}
              </h2>
              <div className="mt-4">
                <Prose>
                  {sublime.learned.paragraphs.map((t) => (
                    <p key={t}>{t}</p>
                  ))}
                </Prose>
              </div>
            </Reveal>
          </Block>

          {/* Outcome */}
          <Block id="outcome" className="pt-16">
            <Reveal>
              <Eyebrow>Outcome</Eyebrow>
              <h2 id="outcome-title" className={H2}>
                {sublime.outcome.heading}
              </h2>
              <div className="mt-4">
                <Prose>
                  {sublime.outcome.paragraphs.map((t) => (
                    <p key={t}>{t}</p>
                  ))}
                </Prose>
              </div>
            </Reveal>
          </Block>
        </article>

        <aside className="hidden xl:block">
          <Toc nav={NAV} scroller={scroller} />
        </aside>
      </div>
    </div>
  );
}
