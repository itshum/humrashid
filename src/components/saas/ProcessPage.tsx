import {
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
} from "react";
import { cn } from "@/lib/utils";
import { principles, processIntro } from "./content";
import {
  biggerProblems,
  phases,
  sprintIntro,
  type Role,
} from "./processContent";
import { Reveal, Stagger, useCaseStudyReveal } from "./CaseStudyParts";
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
  user: "oklch(0.68 0.12 225)",
  leadership: "oklch(0.7 0.15 8)",
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

// Each line of the panel arrives a beat after the one before it.
const step = (n: number) => ({ ["--i" as string]: n }) as CSSProperties;

function SprintGraphic() {
  const [active, setActive] = useState(0);
  const desk = useRef<Array<HTMLButtonElement | null>>([]);
  const mob = useRef<Array<HTMLButtonElement | null>>([]);
  const phase = phases[active];

  // The bar above the blocks glides to the selected one.
  const track = useRef<HTMLDivElement>(null);
  const [bar, setBar] = useState<{ left: number; width: number } | null>(null);
  useLayoutEffect(() => {
    const place = () => {
      const el = desk.current[active];
      if (el && el.offsetWidth)
        setBar({ left: el.offsetLeft, width: el.offsetWidth });
    };
    place();
    const ro = new ResizeObserver(place);
    if (track.current) ro.observe(track.current);
    return () => ro.disconnect();
  }, [active]);

  // The panel eases to the height of what it holds.
  const body = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState<number | undefined>();
  useLayoutEffect(() => {
    const el = body.current;
    if (!el) return;
    const measure = () => setHeight(el.offsetHeight);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

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
    // Focus whichever copy of the control is on screen.
    const shown = [desk.current[next], mob.current[next]].find(
      (b) => b && b.offsetParent !== null,
    );
    shown?.focus();
  };

  const tab = (i: number, group: typeof desk) => ({
    ref: (el: HTMLButtonElement | null) => {
      group.current[i] = el;
    },
    role: "tab" as const,
    id: `sprint-${group === desk ? "tab" : "mtab"}-${phases[i].id}`,
    "aria-selected": i === active,
    "aria-controls": "sprint-panel",
    tabIndex: i === active ? 0 : -1,
    onClick: () => setActive(i),
  });

  // Blocks are grey until selected. The selected one takes its own color:
  // a tint, an outline, and its number filled in.
  const segment = (i: number) =>
    cn(
      "relative flex min-w-0 flex-col justify-between rounded-[4px] p-3 text-left outline-none transition-[background-color,box-shadow,transform] duration-300 ease-out active:scale-[0.985] motion-reduce:transition-none focus-visible:ring-2 focus-visible:ring-ring/60",
      i === active
        ? "bg-[color-mix(in_oklab,var(--hue)_13%,var(--panel))] shadow-[inset_0_0_0_1px_color-mix(in_oklab,var(--hue)_38%,var(--panel))]"
        : "bg-[var(--surface)] hover:bg-[var(--surface-2)]/70",
    );

  const num = (i: number) => (
    <span
      className={cn(
        "grid size-[18px] shrink-0 place-items-center rounded-[4px] text-[11px] tabular-nums transition-colors duration-300",
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
          {/* A thin ruler, one stretch per phase in grey, with one bar in the
              selected phase's color that glides between them */}
          <div aria-hidden="true" className="relative mb-2">
            <div
              className="grid gap-1.5"
              style={{ gridTemplateColumns: columns }}
            >
              {phases.map((p) => (
                <span
                  key={p.id}
                  className="h-[3px] rounded-full bg-foreground/[0.1]"
                />
              ))}
            </div>
            {bar && (
              <span
                className="absolute left-0 top-0 h-[3px] rounded-full transition-[transform,width,background-color] duration-[480ms] ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none"
                style={{
                  width: bar.width,
                  transform: `translateX(${bar.left}px)`,
                  backgroundColor: phase.hue,
                }}
              />
            )}
          </div>
          <div
            ref={track}
            className="relative grid gap-1.5"
            style={{ gridTemplateColumns: columns }}
          >
            {phases.map((p, i) => (
              <button
                key={p.id}
                type="button"
                {...tab(i, desk)}
                className={cn(segment(i), "h-[84px]")}
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
                    "text-xs leading-snug transition-colors duration-300",
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
                {...tab(i, mob)}
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
        aria-label={phase.name}
        className="mt-2.5 overflow-hidden rounded-[4px] border border-[var(--line)] transition-[height] duration-[420ms] ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none"
        style={{ height: height === undefined ? undefined : height + 2 }}
      >
        <div ref={body} className="p-4 sm:p-5">
          <div
            key={phase.id}
            className="grid gap-x-8 gap-y-5 md:grid-cols-2"
          >
            <div>
              <h3
                className="saas-enter text-[15px] font-semibold leading-snug tracking-tight"
                style={step(0)}
              >
                {phase.goal}
              </h3>
              <ul className="mt-2.5 space-y-1 text-[14px] leading-[1.5] text-foreground/80">
                {phase.activities.map((a, n) => (
                  <li
                    key={a}
                    className="saas-enter flex gap-2.5 text-pretty"
                    style={step(n + 1)}
                  >
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
              <p
                className="saas-enter text-xs text-foreground/65"
                style={step(1)}
              >
                I deliver
              </p>
              <ul className="mt-2 space-y-1.5">
                {phase.deliverables.map((d, n) => (
                  <li
                    key={d.title}
                    className="saas-enter flex gap-2.5"
                    style={step(n + 2)}
                  >
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
              <p
                className="saas-enter mt-3.5 text-xs text-foreground/65"
                style={step(phase.deliverables.length + 2)}
              >
                Who’s involved
              </p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {phase.involved.map((r, n) => (
                  <span
                    key={r.label}
                    className="saas-enter"
                    style={step(phase.deliverables.length + 3 + n)}
                  >
                    <RolePill {...r} />
                  </span>
                ))}
              </div>
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

      <div className="-mt-2 max-w-[44rem] space-y-2 text-[15px] leading-[1.6] text-foreground/80 [&_p]:text-pretty">
        {sprintIntro.map((t) => (
          <p key={t}>{t}</p>
        ))}
      </div>

      <div className="mt-7">
        <SprintGraphic />
      </div>

      <Reveal className="mt-6">
        <h2 className="text-sm font-medium">{biggerProblems.heading}</h2>
        <p className="mt-1.5 max-w-[44rem] text-pretty text-[14px] leading-[1.6] text-foreground/65">
          {biggerProblems.text}
        </p>
      </Reveal>

      <section
        aria-labelledby="principles-title"
        className="mt-10 border-t border-foreground/[0.08] pt-6"
      >
        <h2 id="principles-title" className="text-sm font-medium">
          What guides my design thinking
        </h2>
        {/* One panel after another, left to right, row by row, as it
            scrolls into view */}
        <Stagger className="mt-3 grid grid-cols-1 gap-2.5 md:grid-cols-2">
          {principles.map((p, i) => (
            <li
              key={p.title}
              style={{ transitionDelay: `${i * 110}ms` }}
              className="rounded-[4px] bg-[var(--surface)] p-4 transition-[opacity,transform] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-data-[state=armed]/stagger:-translate-x-3 group-data-[state=armed]/stagger:opacity-0 motion-reduce:transition-none"
            >
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
              <p className="mt-1.5 text-sm leading-[1.55] text-foreground/65">
                {p.body}
              </p>
            </li>
          ))}
        </Stagger>
      </section>
    </>
  );
}
