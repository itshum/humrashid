import { useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  ImageIcon,
  LayoutGrid,
  LayoutList,
  Lock,
  Rows3,
  Grid2x2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  apps,
  caseStudyFor,
  profile,
  work,
  type Route,
  type WorkItem,
} from "./data";
import { CaseStudyFrame } from "./CaseStudyFrame";
import { HomePanels } from "./HomePanels";
import PackCaseStudy from "./pack/PackCaseStudy";
import PpvpCaseStudy from "./ppvp/PpvpCaseStudy";
import InveterateCaseStudy from "./inveterate/InveterateCaseStudy";
import { ProfilePage } from "./ProfilePage";
import { InspirationPage } from "./InspirationPage";
import { IdeaArticle } from "./IdeaPost";
import { InspirationDetail } from "./InspirationDetail";
import { ideas, principles, principlesIntro } from "./content";
import { EmptyPanel, principleVisuals } from "./principleVisuals";
import { useWebTabs, wantsBrowserTab } from "./webTabs";
import { Cover, PageHeader, Segmented, Tag, formatDate } from "./ui";

type Go = (r: Route) => void;
export type WorkMode = "list" | "cards";

// List | Cards switch for the Work page, on the right of its heading.
export function WorkModeToggle({
  value,
  onChange,
}: {
  value: WorkMode;
  onChange: (m: WorkMode) => void;
}) {
  return (
    <Segmented
      label="View work as"
      value={value}
      onChange={onChange}
      options={[
        {
          value: "list",
          label: "List",
          icon: <LayoutList className="size-3.5" aria-hidden="true" />,
        },
        {
          value: "cards",
          label: "Cards",
          icon: <LayoutGrid className="size-3.5" aria-hidden="true" />,
        },
      ]}
    />
  );
}

function NotFound({ section, go }: { section: "work" | "ideas"; go: Go }) {
  return (
    <>
      <PageHeader
        title="Not found"
        description="That page doesn't exist in this shell yet."
      />
    </>
  );
}

/* ------------------------------ Home ------------------------------ */

function Home({ go }: { go: Go }) {
  const latest = work.find((w) => w.slug === "sublime-security")!;
  return (
    <>
      <h1 className="mt-2 text-balance text-xl font-semibold leading-[1.2] tracking-[-0.022em] sm:mt-4 sm:text-[22px]">
        Humayun Rashid is a product designer and founder in NYC
      </h1>

      <HomePanels className="mt-6" />

      {/* On wide screens the intro is exactly as wide as the first two
          panels above it: two thirds of the row, less half a gap. */}
      <section
        aria-label="About"
        className="mt-7 lg:w-[calc((200%-1.5rem)/3)] lg:max-w-full"
      >
        <p className="text-pretty text-[15px] leading-[1.6] text-foreground/80">
          {profile.intro}
        </p>
        <button
          type="button"
          onClick={() => go({ section: "profile" })}
          className="group mt-3 inline-flex items-center gap-1 rounded text-[13px] text-foreground/65 outline-none transition-colors hover:text-foreground focus-visible:text-foreground focus-visible:ring-2 focus-visible:ring-ring/60"
        >
          Profile
          <ArrowRight
            className="size-3.5 transition-transform duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-[3px] group-focus-visible:translate-x-[3px] motion-reduce:transition-none"
            aria-hidden="true"
          />
        </button>
      </section>

      {/* Latest work and recent writing side by side, the same height:
          the image takes whatever height the writing list leaves. */}
      <div className="mt-8 grid gap-x-12 gap-y-10 border-t border-foreground/[0.08] pb-2 pt-7 lg:grid-cols-2">
        <section aria-labelledby="home-latest" className="flex flex-col">
          <div className="mb-2.5 flex h-6 items-center">
            <h2 id="home-latest" className="text-sm font-medium">
              Latest work
            </h2>
          </div>
          <button
            type="button"
            onClick={() => go({ section: "work", slug: latest.slug })}
            className="group flex flex-1 flex-col rounded-lg text-left outline-none focus-visible:ring-2 focus-visible:ring-ring/60 focus-visible:ring-offset-8 focus-visible:ring-offset-[var(--panel)]"
          >
            <span className="relative block aspect-[16/10] w-full flex-1 overflow-hidden rounded-lg ring-1 ring-foreground/[0.1] lg:aspect-auto lg:min-h-[220px]">
              <img
                src={latest.cover}
                alt=""
                loading="lazy"
                className="absolute inset-0 size-full object-cover object-left-top transition-transform duration-500 ease-out group-hover:scale-[1.02] motion-reduce:transition-none"
              />
            </span>
            <span className="mt-3.5 block text-sm font-medium leading-snug tracking-[-0.011em]">
              {latest.name}
            </span>
            <span className="mt-1 block text-[13px] leading-[1.5] text-foreground/65">
              {latest.description}
            </span>
          </button>
        </section>

        <section aria-labelledby="home-writing">
          <div className="mb-2.5 flex h-6 items-center">
            <h2 id="home-writing" className="text-sm font-medium">
              Recent writing
            </h2>
          </div>
          <IdeaList items={ideas.slice(0, 3)} go={go} compact />
        </section>
      </div>
    </>
  );
}

/* ------------------------------ Work ------------------------------ */

const DASH = <span className="text-foreground/30">—</span>;

// Columns reveal as the panel widens: Project, Type, and Year always,
// then Role, Market, and finally Details and Company.
const COLS = [
  { key: "project", label: "Project", cls: "w-[16%]", show: "" },
  {
    key: "details",
    label: "Details",
    cls: "w-[21%]",
    show: "hidden xl:table-cell",
  },
  {
    key: "market",
    label: "Market",
    cls: "w-[11%]",
    show: "hidden lg:table-cell",
  },
  { key: "type", label: "Type", cls: "w-[10%]", show: "hidden sm:table-cell" },
  { key: "role", label: "Role", cls: "w-[17%]", show: "hidden md:table-cell" },
  {
    key: "company",
    label: "Company",
    cls: "w-[13%]",
    show: "hidden xl:table-cell",
  },
  { key: "year", label: "Year", cls: "w-[12%] text-right", show: "" },
] as const;

function WorkTable({ items, go }: { items: WorkItem[]; go: Go }) {
  const { open: openWeb } = useWebTabs();
  const web = (w: WorkItem) =>
    openWeb({
      id: w.slug,
      url: w.href!,
      title: w.name,
      embed: w.embed ?? false,
    });
  const cell = (key: string) => COLS.find((c) => c.key === key)!.show;
  const text = "truncate py-3 pr-4 text-foreground/65";
  return (
    <table className="w-full table-fixed border-separate border-spacing-0 text-left text-sm">
      <thead className="sticky top-0 z-10">
        <tr className="text-xs font-medium text-foreground/65">
          {COLS.map((c) => (
            <th
              key={c.key}
              scope="col"
              className={cn(
                "border-y border-[var(--line)] bg-[color-mix(in_oklab,var(--panel)_96%,var(--foreground))] py-2 pr-4 first:rounded-tl-[4px] first:border-l first:pl-3 last:rounded-tr-[4px] last:border-r last:pr-3",
                c.cls,
                c.show,
              )}
            >
              {c.label}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {items.map((w) => {
          const open = w.kind === "case-study";
          const dot = (
            <span
              aria-hidden="true"
              className="size-2.5 shrink-0 rounded-[3px]"
              style={{ background: w.tone }}
            />
          );
          return (
            <tr
              key={w.slug}
              onClick={
                open
                  ? () => go({ section: "work", slug: w.slug })
                  : w.href
                    ? () => web(w)
                    : undefined
              }
              className={cn(
                "[&>*]:border-b [&>*]:border-[var(--line)] [&>*:first-child]:border-l [&>*:last-child]:border-r",
                "last:[&>*:first-child]:rounded-bl-[4px] last:[&>*:last-child]:rounded-br-[4px]",
                (open || w.href) &&
                  "cursor-pointer hover:[&>*]:bg-foreground/[0.03]",
              )}
            >
              <th scope="row" className="py-3 pl-3 pr-4 font-medium">
                {open ? (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      go({ section: "work", slug: w.slug });
                    }}
                    className="flex max-w-full items-center gap-2.5 rounded text-left outline-none focus-visible:ring-2 focus-visible:ring-ring/60"
                  >
                    {dot}
                    <span className="truncate">{w.name}</span>
                  </button>
                ) : w.href ? (
                  <a
                    href={w.href}
                    target="_blank"
                    rel="noreferrer noopener"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (wantsBrowserTab(e)) return;
                      e.preventDefault();
                      web(w);
                    }}
                    className="group/ext flex max-w-full items-center gap-2.5 rounded outline-none focus-visible:ring-2 focus-visible:ring-ring/60"
                  >
                    {dot}
                    <span className="truncate">{w.name}</span>
                    <ArrowUpRight
                      className="size-3.5 shrink-0 text-foreground/65 transition-[transform,color] group-hover/ext:-translate-y-px group-hover/ext:translate-x-px group-hover/ext:text-foreground"
                      aria-label="Opens in a tab"
                    />
                  </a>
                ) : (
                  <span className="flex items-center gap-2.5">
                    {dot}
                    <span className="truncate">{w.name}</span>
                  </span>
                )}
              </th>
              <td className={cn(text, cell("details"))} title={w.description}>
                {w.description ?? DASH}
              </td>
              <td className={cn(text, cell("market"))}>{w.market ?? DASH}</td>
              <td className={cn("py-3 pr-4", cell("type"))}>
                <Tag tone={open ? "blue" : "amber"}>
                  {open ? "Case study" : "Experience"}
                </Tag>
              </td>
              <td className={cn(text, cell("role"))} title={w.role}>
                {w.role ?? DASH}
              </td>
              <td className={cn(text, cell("company"))}>{w.company ?? DASH}</td>
              <td className="whitespace-nowrap py-3 pl-2 pr-3 text-right tabular-nums text-foreground/65">
                {w.year ?? DASH}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

function WorkCard({ w, go }: { w: WorkItem; go: Go }) {
  const { open: openWeb } = useWebTabs();
  const open = w.kind === "case-study";
  const inner = (
    <>
      <Cover
        src={w.cover}
        alt={`${w.name} preview`}
        tone={w.tone}
        className="transition-shadow group-hover:ring-foreground/20"
      >
        {!w.cover && (
          <span
            className="absolute inset-0 grid place-items-center text-2xl font-semibold tracking-tight text-foreground/25"
            aria-hidden="true"
          >
            {w.name}
          </span>
        )}
      </Cover>
      <div className="mt-3 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="flex items-center gap-1.5 text-sm font-medium">
            {w.name}
            {w.locked && (
              <Lock
                className="size-3 text-foreground/65"
                aria-label="Password protected"
              />
            )}
            {!open && w.href && (
              <ArrowUpRight
                className="size-3.5 text-foreground/65 transition-[transform,color] group-hover:-translate-y-px group-hover:translate-x-px group-hover:text-foreground"
                aria-label="Opens in a tab"
              />
            )}
          </h3>
          <p className="mt-1 line-clamp-2 text-[13px] text-foreground/65">
            {w.description ??
              ([w.company, w.market].filter(Boolean).join(" · ") ||
                "Details to come")}
          </p>
        </div>
        {w.year && (
          <span className="shrink-0 pt-0.5 text-xs tabular-nums text-foreground/65">
            {w.year}
          </span>
        )}
      </div>
      <div className="mt-2.5">
        <Tag tone={open ? "blue" : "amber"}>
          {open ? "Case study" : "Experience"}
        </Tag>
      </div>
    </>
  );
  return open ? (
    <button
      type="button"
      onClick={() => go({ section: "work", slug: w.slug })}
      className="group flex flex-col items-stretch justify-start rounded-lg text-left outline-none focus-visible:ring-2 focus-visible:ring-ring/60 focus-visible:ring-offset-4 focus-visible:ring-offset-[var(--panel)]"
    >
      {inner}
    </button>
  ) : w.href ? (
    <a
      href={w.href}
      target="_blank"
      rel="noreferrer noopener"
      onClick={(e) => {
        if (wantsBrowserTab(e)) return;
        e.preventDefault();
        openWeb({
          id: w.slug,
          url: w.href!,
          title: w.name,
          embed: w.embed ?? false,
        });
      }}
      className="group block rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-ring/60 focus-visible:ring-offset-4 focus-visible:ring-offset-[var(--panel)]"
    >
      {inner}
    </a>
  ) : (
    <div className="group block">{inner}</div>
  );
}

function WorkIndex({
  go,
  mode,
  onMode,
}: {
  go: Go;
  mode: WorkMode;
  onMode: (m: WorkMode) => void;
}) {
  return (
    <>
      <PageHeader
        title="Work"
        description="Everything I've designed, including full case studies."
        actions={<WorkModeToggle value={mode} onChange={onMode} />}
      />
      {mode === "list" ? (
        <WorkTable items={work} go={go} />
      ) : (
        <div className="grid grid-cols-1 gap-x-6 gap-y-9 sm:grid-cols-2 xl:grid-cols-3">
          {work.map((w) => (
            <WorkCard key={w.slug} w={w} go={go} />
          ))}
        </div>
      )}
    </>
  );
}

/* ------------------------------ Ideas ----------------------------- */

function IdeaList({
  items,
  go,
  compact = false,
}: {
  items: typeof ideas;
  go: Go;
  compact?: boolean;
}) {
  return (
    <ul className={cn("-mx-4", compact ? "space-y-1" : "space-y-2")}>
      {items.map((p) => (
        <li key={p.slug}>
          <button
            type="button"
            onClick={() => go({ section: "ideas", slug: p.slug })}
            className={cn("group flex w-full items-start gap-6 rounded-lg px-4 text-left outline-none transition-colors hover:bg-foreground/[0.04] focus-visible:bg-foreground/[0.04] focus-visible:ring-2 focus-visible:ring-ring/60",
              compact ? "py-3.5" : "py-6",
            )}
          >
            <span className="min-w-0 flex-1">
              <span
                className={cn(
                  "block font-medium leading-snug",
                  compact ? "text-sm tracking-[-0.011em]" : "text-[15px]",
                )}
              >
                {p.title}
              </span>
              <span
                className={cn(
                  "block text-foreground/65",
                  compact
                    ? "mt-1 text-[13px] leading-[1.5]"
                    : "mt-1.5 text-sm",
                )}
              >
                {p.excerpt}
              </span>
            </span>
            {!compact && (
              <time
                dateTime={p.date}
                className="shrink-0 pt-0.5 text-xs tabular-nums text-foreground/65"
              >
                {formatDate(p.date)}
              </time>
            )}
            {/* The arrow only appears when the row is hovered or focused. */}
            <ArrowRight
              className="mt-0.5 size-4 shrink-0 -translate-x-1 text-foreground/65 opacity-0 transition-[opacity,transform] duration-200 group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:opacity-100 motion-reduce:transition-none [@media(hover:none)]:translate-x-0 [@media(hover:none)]:opacity-100"
              aria-hidden="true"
            />
          </button>
        </li>
      ))}
    </ul>
  );
}

function IdeasIndex({ go }: { go: Go }) {
  return (
    <>
      <PageHeader
        title="Ideas"
        description="Notes on design, product, and building."
      />
      <IdeaList items={ideas} go={go} />
    </>
  );
}

// The blog post template: back link, date, title, dek, body in a
// readable measure, and newer/older navigation at the foot.
function IdeaPost({ slug, go }: { slug: string; go: Go }) {
  const post = ideas.find((p) => p.slug === slug);
  if (!post) return <NotFound section="ideas" go={go} />;
  return <IdeaArticle post={post} go={go} />;
}

/* ------------------------------ Router ---------------------------- */

export function View({
  route,
  go,
  workMode,
  onWorkMode,
}: {
  route: Route;
  go: Go;
  workMode: WorkMode;
  onWorkMode: (m: WorkMode) => void;
}) {
  switch (route.section) {
    case "home":
      return <Home go={go} />;
    case "work":
      if (!route.slug)
        return <WorkIndex go={go} mode={workMode} onMode={onWorkMode} />;
      // Pack, PPVP and Inveterate have been redesigned natively for the shell; the others still
      // open their original pages in a frame.
      if (route.slug === "pack") return <PackCaseStudy go={go} />;
      if (route.slug === "ppvp") return <PpvpCaseStudy go={go} />;
      if (route.slug === "inveterate") return <InveterateCaseStudy go={go} />;
      return caseStudyFor(route) ? (
        <CaseStudyFrame work={caseStudyFor(route)!} go={go} />
      ) : (
        <NotFound section="work" go={go} />
      );
    case "ideas":
      return route.slug ? (
        <IdeaPost slug={route.slug} go={go} />
      ) : (
        <IdeasIndex go={go} />
      );
    case "apps":
      return <Apps />;
    case "principles":
      return <Principles />;
    case "inspiration":
      return route.slug ? (
        <InspirationDetail key={route.slug} id={route.slug} go={go} />
      ) : (
        <InspirationPage go={go} />
      );
    case "profile":
      return <ProfilePage />;
  }
}
