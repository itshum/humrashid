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
  photos,
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
  return (
    <>
      <h1 className="mt-4 text-balance text-xl font-semibold tracking-tight sm:mt-12 sm:text-2xl">
        Humayun Rashid is a product designer and founder in NYC
      </h1>

      <HomePanels className="mt-8" />

      {/* On wide screens the intro is exactly as wide as the first two
          panels above it: two thirds of the row, less half a gap. */}
      <section
        aria-label="About"
        className="mt-10 lg:w-[calc((200%-1rem)/3)] lg:max-w-full"
      >
        <p className="text-pretty text-[15px] leading-7 text-foreground/80">
          {profile.intro}
        </p>
        <button
          type="button"
          onClick={() => go({ section: "profile" })}
          className="group mt-5 inline-flex h-8 items-center gap-1.5 rounded-[5px] px-3 text-[13px] font-medium text-foreground outline-none ring-1 ring-foreground/20 transition-[background-color,box-shadow] hover:bg-foreground/[0.04] hover:ring-foreground/40 focus-visible:ring-2 focus-visible:ring-ring/70"
        >
          Profile
          <ArrowRight
            className="size-3.5 text-foreground/60 transition-[transform,color] duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-[3px] group-hover:text-foreground group-focus-visible:translate-x-[3px] group-focus-visible:text-foreground group-active:translate-x-1 motion-reduce:transition-none"
            aria-hidden="true"
          />
        </button>
      </section>

      <section aria-labelledby="home-writing" className="mt-14">
        <div className="mb-3 flex items-center justify-between">
          <h2 id="home-writing" className="text-sm font-medium">
            Recent writing
          </h2>
          <button
            type="button"
            onClick={() => go({ section: "ideas" })}
            className="text-[13px] text-foreground/55 hover:text-foreground"
          >
            View all
          </button>
        </div>
        <IdeaList items={ideas.slice(0, 3)} go={go} />
      </section>
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
  const text = "truncate py-3 pr-4 text-foreground/60";
  return (
    <table className="w-full table-fixed border-separate border-spacing-0 text-left text-sm">
      <thead className="sticky top-0 z-10">
        <tr className="text-xs font-medium text-foreground/50">
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
                      className="size-3.5 shrink-0 text-foreground/40 transition-[transform,color] group-hover/ext:-translate-y-px group-hover/ext:translate-x-px group-hover/ext:text-foreground"
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
              <td className="whitespace-nowrap py-3 pl-2 pr-3 text-right tabular-nums text-foreground/60">
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
                className="size-3 text-foreground/40"
                aria-label="Password protected"
              />
            )}
            {!open && w.href && (
              <ArrowUpRight
                className="size-3.5 text-foreground/40 transition-[transform,color] group-hover:-translate-y-px group-hover:translate-x-px group-hover:text-foreground"
                aria-label="Opens in a tab"
              />
            )}
          </h3>
          <p className="mt-1 line-clamp-2 text-[13px] text-foreground/55">
            {w.description ??
              ([w.company, w.market].filter(Boolean).join(" · ") ||
                "Details to come")}
          </p>
        </div>
        {w.year && (
          <span className="shrink-0 pt-0.5 text-xs tabular-nums text-foreground/45">
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

function IdeaList({ items, go }: { items: typeof ideas; go: Go }) {
  return (
    <ul className="divide-y divide-foreground/[0.07] border-y border-foreground/[0.07]">
      {items.map((p) => (
        <li key={p.slug}>
          <button
            type="button"
            onClick={() => go({ section: "ideas", slug: p.slug })}
            className="group flex w-full items-start justify-between gap-6 px-2 py-4 text-left outline-none transition-colors hover:bg-foreground/[0.03] focus-visible:ring-2 focus-visible:ring-ring/60 focus-visible:ring-inset"
          >
            <span className="min-w-0">
              <span className="block text-sm font-medium">{p.title}</span>
              <span className="mt-1 block text-[13px] text-foreground/55">
                {p.excerpt}
              </span>
            </span>
            <time
              dateTime={p.date}
              className="shrink-0 pt-0.5 text-xs tabular-nums text-foreground/45"
            >
              {formatDate(p.date)}
            </time>
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
  const i = ideas.findIndex((p) => p.slug === slug);
  if (i < 0) return <NotFound section="ideas" go={go} />;
  const post = ideas[i];
  const newer = ideas[i - 1];
  const older = ideas[i + 1];
  return (
    <>
      <article className="max-w-2xl">
        <header>
          <time dateTime={post.date} className="text-[13px] text-foreground/50">
            {formatDate(post.date)}
          </time>
          <h1 className="mt-2 text-balance text-3xl font-semibold leading-tight tracking-tight">
            {post.title}
          </h1>
          <p className="mt-3 text-pretty text-base leading-7 text-foreground/60">
            {post.excerpt}
          </p>
        </header>
        <div className="mt-8 space-y-5 border-t border-foreground/[0.08] pt-8 text-[15px] leading-7 text-foreground/85">
          {post.body.map((para) => (
            <p key={para} className="text-pretty">
              {para}
            </p>
          ))}
        </div>
        <nav
          aria-label="More ideas"
          className="mt-12 grid gap-3 border-t border-foreground/[0.08] pt-6 sm:grid-cols-2"
        >
          {newer ? (
            <button
              type="button"
              onClick={() => go({ section: "ideas", slug: newer.slug })}
              className="rounded-lg p-3 text-left outline-none ring-1 ring-foreground/[0.08] transition-colors hover:bg-foreground/[0.03] focus-visible:ring-2 focus-visible:ring-ring/60"
            >
              <span className="flex items-center gap-1 text-xs text-foreground/50">
                <ArrowLeft className="size-3" aria-hidden="true" /> Newer
              </span>
              <span className="mt-1 block text-[13px] font-medium">
                {newer.title}
              </span>
            </button>
          ) : (
            <span />
          )}
          {older && (
            <button
              type="button"
              onClick={() => go({ section: "ideas", slug: older.slug })}
              className="rounded-lg p-3 text-left outline-none ring-1 ring-foreground/[0.08] transition-colors hover:bg-foreground/[0.03] focus-visible:ring-2 focus-visible:ring-ring/60 sm:text-right"
            >
              <span className="flex items-center gap-1 text-xs text-foreground/50 sm:justify-end">
                Older <ArrowRight className="size-3" aria-hidden="true" />
              </span>
              <span className="mt-1 block text-[13px] font-medium">
                {older.title}
              </span>
            </button>
          )}
        </nav>
      </article>
    </>
  );
}

/* ------------------------- Apps / Principles ---------------------- */

function Apps() {
  return (
    <>
      <PageHeader
        title="Apps"
        description="Standalone tools and apps, designed and built as experiments."
      />
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {apps.map((a) => (
          <a
            key={a.slug}
            href={a.href}
            className="group block rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-ring/60 focus-visible:ring-offset-4 focus-visible:ring-offset-[var(--panel)]"
          >
            <Cover
              tone={a.tone}
              alt={`${a.name} preview`}
              ratio="2 / 1"
              className="transition-shadow group-hover:ring-foreground/20"
            >
              <span
                className="absolute inset-0 grid place-items-center text-3xl font-semibold tracking-tight text-foreground/30"
                aria-hidden="true"
              >
                {a.name}
              </span>
            </Cover>
            <div className="mt-3 flex items-start justify-between gap-3">
              <div>
                <h3 className="text-sm font-medium">{a.name}</h3>
                <p className="mt-1 text-[13px] text-foreground/55">
                  {a.description}
                </p>
              </div>
              <ArrowUpRight
                className="mt-0.5 size-4 shrink-0 text-foreground/40 transition-colors group-hover:text-foreground"
                aria-hidden="true"
              />
            </div>
          </a>
        ))}
      </div>
    </>
  );
}

// Each principle is a panel card: an abstract animation on a dark
// ground, then the numeral, title, and body, in a two-column grid. The
// fifth sits alone in the left column of the last row.
function Principles() {
  return (
    <>
      <PageHeader title="Principles" description={principlesIntro} />
      <ol className="grid grid-cols-1 gap-5 md:grid-cols-2">
        {principles.map((p, i) => {
          const Visual = principleVisuals[i] ?? EmptyPanel;
          return (
            <li
              key={p.num}
              className="overflow-hidden rounded-xl bg-[var(--panel)] ring-1 ring-foreground/[0.1] transition-shadow hover:ring-foreground/[0.2]"
            >
              <div className="aspect-[16/10] w-full">
                <Visual />
              </div>
              <div className="p-5">
                <p
                  className="text-[13px] tabular-nums text-foreground/40"
                  aria-hidden="true"
                >
                  {p.num}
                </p>
                <h2 className="mt-1 text-[15px] font-medium leading-snug">
                  {p.title}
                </h2>
                <p className="mt-2 text-sm leading-6 text-foreground/60">
                  {p.body}
                </p>
              </div>
            </li>
          );
        })}
      </ol>
    </>
  );
}

/* ---------------------------- Inspiration ------------------------- */

function PhotoTile({ p }: { p: (typeof photos)[number] }) {
  return (
    <Cover src={p.src} alt={p.alt} tone={p.tone} ratio={p.ratio}>
      {!p.src && (
        <span
          className="absolute inset-0 grid place-items-center text-foreground/25"
          aria-hidden="true"
        >
          <ImageIcon className="size-6" strokeWidth={1.5} />
        </span>
      )}
    </Cover>
  );
}

function Inspiration() {
  const [mode, setMode] = useState<"grid" | "feed">("grid");
  return (
    <>
      <PageHeader
        title="Inspiration"
        description="Images from recent trips."
        actions={
          <Segmented
            label="View as"
            value={mode}
            onChange={setMode}
            options={[
              {
                value: "grid",
                label: "Grid",
                icon: <Grid2x2 className="size-3.5" aria-hidden="true" />,
              },
              {
                value: "feed",
                label: "Feed",
                icon: <Rows3 className="size-3.5" aria-hidden="true" />,
              },
            ]}
          />
        }
      />
      <p className="mb-6 rounded-lg border border-dashed border-foreground/15 px-4 py-3 text-[13px] text-foreground/55">
        Placeholder tiles. Photos from recent trips will replace these.
      </p>
      {mode === "grid" ? (
        <ul className="columns-2 gap-3 md:columns-3 xl:columns-4">
          {photos.map((p) => (
            <li key={p.id} className="mb-3 break-inside-avoid">
              <PhotoTile p={p} />
            </li>
          ))}
        </ul>
      ) : (
        <ul className="mx-auto max-w-xl space-y-8">
          {photos.map((p, i) => (
            <li key={p.id}>
              <PhotoTile p={p} />
              <p className="mt-2 text-xs text-foreground/45">
                Photo {String(i + 1).padStart(2, "0")}
              </p>
            </li>
          ))}
        </ul>
      )}
    </>
  );
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
      return <Inspiration />;
    case "profile":
      return <ProfilePage />;
  }
}
