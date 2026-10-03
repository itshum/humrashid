import { useRef, useState, type KeyboardEvent } from "react";
import { cn } from "@/lib/utils";
import { principles, processIntro } from "./content";
import {
  biggerProblems,
  phases,
  sprintIntro,
  type Role,
} from "./processContent";
import { Reveal, useCaseStudyReveal } from "./CaseStudyParts";
import { DeliverableIcon } from "./DeliverableIcon";
import { PageHeader } from "./ui";

// Process: how I run a product design sprint. An interactive picture of
// the sprint (five phases laid out on the days of a week or two, each with
// what happens and what you get), then the principles behind it as plain
// text panels.

// Each phase has its own color (in processContent); the roles have theirs.
const ROLE_DOT: Record<Role, string> = {
  designer: "oklch(0.62 0.15 300)",
  pm: "oklch(0.68 0.13 155)",
  stakeholder: "oklch(0.74 0.13 70)",
};

function RolePill({ label, role }: { label: string; role: Role }) {
  return (
    <span className="inline-flex h-6 items-center gap-1.5 rounded-full px-2.5 text-xs text-foreground/75 ring-1 ring-inset ring-foreground/[0.14]">
      <span
        aria-hidden="true"
        className="size-1.5 rounded-full"
        style={{ background: ROLE_DOT[role] }}
      />
      {label}
    </span>
  );
}

function SprintGraphic() {
  const [active, setActive] = useState(0);
  const refs = useRef<Array<HTMLButtonElement | null>>([]);
  const phase = phases[active];

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const dir =
      e.key === "ArrowRight" || e.key === "ArrowDown"
        ? 1
        : e.key === "ArrowLeft" || e.key === "ArrowUp"
          ? -1
          : 0;
    if (!dir) return;
    e.preventDefault();
    const next = (active + dir + phases.length) % phases.length;
    setActive(next);
    refs.current[next]?.focus();
  };

  const tab = (i: number) => ({
    ref: (el: HTMLButtonElement | null) => {
      refs.current[i] = el;
    },
    role: "tab" as const,
    id: `sprint-tab-${phases[i].id}`,
    "aria-selected": i === active,
    "aria-controls": "sprint-panel",
    tabIndex: i === active ? 0 : -1,
    onClick: () => setActive(i),
  });

  // Blocks are grey until selected. The selected one takes its own color:
  // a tint, an outline, and its number filled in.
  const segment = (i: number) =>
    cn(
      "relative flex min-w-0 flex-col justify-between rounded-[4px] p-3 text-left outline-none transition-[background-color,box-shadow] duration-200 focus-visible:ring-2 focus-visible:ring-ring/60",
      i === active
        ? "bg-[color-mix(in_oklab,var(--hue)_13%,var(--panel))] shadow-[inset_0_0_0_1px_color-mix(in_oklab,var(--hue)_38%,var(--panel))]"
        : "bg-[var(--surface)] hover:bg-[var(--surface-2)]/70",
    );

  const num = (i: number) => (
    <span
      className={cn(
        "grid size-[18px] shrink-0 place-items-center rounded-[4px] text-[11px] tabular-nums transition-colors duration-200",
        i === active
          ? "bg-[var(--hue)] text-[var(--ink)]"
          : "bg-[var(--panel)] text-foreground/70",
      )}
    >
      {i + 1}
    </span>
  );

  // Block widths follow the days each phase takes.
  const columns = phases.map((p) => `${p.weight}fr`).join(" ");

  const hueOf = (i: number) => ({
    ["--hue" as string]: phases[i].hue,
    ["--ink" as string]: phases[i].ink,
  });

  return (
    <section aria-labelledby="sprint-title">
      <h2 id="sprint-title" className="text-sm font-medium">
        The Design Sprint
      </h2>

      <div
        role="tablist"
        aria-label="Sprint phases"
        onKeyDown={onKeyDown}
        className="mt-4"
      >
        <div className="hidden sm:block">
          {/* A thin ruler, one stretch per phase: grey, with the selected
              one in its color */}
          <div
            aria-hidden="true"
            className="mb-2 grid gap-1.5"
            style={{ gridTemplateColumns: columns }}
          >
            {phases.map((p, i) => (
              <span
                key={p.id}
                className={cn(
                  "h-[3px] rounded-full transition-colors duration-200",
                  i === active ? "bg-[var(--hue)]" : "bg-foreground/[0.1]",
                )}
                style={hueOf(i)}
              />
            ))}
          </div>
          <div className="grid gap-1.5" style={{ gridTemplateColumns: columns }}>
            {phases.map((p, i) => (
              <button
                key={p.id}
                type="button"
                {...tab(i)}
                className={cn(segment(i), "h-[104px]")}
                style={hueOf(i)}
              >
                <span className="flex flex-wrap items-center gap-x-2 gap-y-1">
                  {num(i)}
                  <span className="text-[13px] font-medium leading-tight">
                    {p.name}
                  </span>
                </span>
                <span
                  className={cn(
                    "text-xs leading-snug transition-colors duration-200",
                    i === active ? "text-foreground/80" : "text-foreground/65",
                  )}
                >
                  {p.when}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Small screens: the same phases as a list */}
        <ol className="space-y-1.5 sm:hidden">
          {phases.map((p, i) => (
            <li key={p.id}>
              <button
                type="button"
                {...tab(i)}
                className={cn(segment(i), "w-full flex-row items-center gap-3")}
                style={hueOf(i)}
              >
                {num(i)}
                <span className="min-w-0 flex-1 truncate text-[13px] font-medium">
                  {p.name}
                </span>
                <span className="text-xs text-foreground/65">
                  {p.when}
                </span>
              </button>
            </li>
          ))}
        </ol>
      </div>

      {/* What I do, what I make, and who is involved */}
      <div
        role="tabpanel"
        id="sprint-panel"
        aria-labelledby={`sprint-tab-${phase.id}`}
        className="mt-3 rounded-[4px] border border-[var(--line)] p-5 sm:p-6"
      >
        <div
          key={phase.id}
          className="saas-fade grid gap-x-10 gap-y-6 md:grid-cols-2"
        >
          <div>
            <h3 className="text-[16px] font-semibold leading-snug tracking-tight">
              {phase.goal}
            </h3>
            <ul className="mt-3 space-y-1.5 text-[14px] leading-[1.5] text-foreground/80">
              {phase.activities.map((a) => (
                <li key={a} className="flex gap-2.5 text-pretty">
                  <span
                    aria-hidden="true"
                    className="mt-[9px] size-1 shrink-0 rounded-full bg-foreground/40"
                  />
                  {a}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-xs text-foreground/65">I deliver</p>
            <ul className="mt-2 space-y-2">
              {phase.deliverables.map((d) => (
                <li key={d.title} className="flex gap-2.5">
                  <DeliverableIcon
                    kind={d.icon}
                    className="mt-[3px] size-4 shrink-0 text-foreground/65"
                  />
                  <p className="text-[14px] leading-snug">
                    <span className="font-medium">{d.title}</span>
                    <span className="text-foreground/65"> · {d.text}</span>
                  </p>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-xs text-foreground/65">Who’s involved</p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {phase.involved.map((r) => (
                <RolePill key={r.label} {...r} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function ProcessPage() {
  useCaseStudyReveal();

  return (
    <>
      <PageHeader title="Process" description={processIntro} />

      <div className="max-w-[44rem] space-y-3 text-[15px] leading-[1.7] text-foreground/80 [&_p]:text-pretty">
        {sprintIntro.map((t) => (
          <p key={t}>{t}</p>
        ))}
      </div>

      <div className="mt-9">
        <SprintGraphic />
      </div>

      <Reveal className="mt-8">
        <h2 className="text-sm font-medium">{biggerProblems.heading}</h2>
        <p className="mt-2 max-w-[44rem] text-pretty text-[14px] leading-[1.65] text-foreground/65">
          {biggerProblems.text}
        </p>
      </Reveal>

      <section
        aria-labelledby="principles-title"
        className="mt-14 border-t border-foreground/[0.08] pt-8"
      >
        <h2 id="principles-title" className="text-sm font-medium">
          What guides my design thinking
        </h2>
        <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
          {principles.map((p, i) => (
            <Reveal
              key={p.title}
              delay={(i % 2) * 70}
              className="rounded-[4px] bg-[var(--surface)] p-5"
            >
              <div>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex min-w-0 items-start gap-2.5">
                    <span
                      aria-hidden="true"
                      className="mt-px grid size-[18px] shrink-0 place-items-center rounded-[4px] bg-foreground/[0.09] text-[11px] tabular-nums text-foreground/80"
                    >
                      {i + 1}
                    </span>
                    <h3 className="text-[15px] font-medium leading-snug">
                      {p.title}
                    </h3>
                  </div>
                  <span className="shrink-0 pt-0.5 text-xs text-foreground/65">
                    {p.phase}
                  </span>
                </div>
                <p className="mt-2 text-sm leading-6 text-foreground/65">
                  {p.body}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>
    </>
  );
}
