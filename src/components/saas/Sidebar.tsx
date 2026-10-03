import { useEffect, useState } from "react";
import { ChevronRight, Moon, Sun } from "lucide-react";
import { Tooltip } from "radix-ui";
import { cn } from "@/lib/utils";
import { ProfileMenu } from "./ProfileMenu";
import { caseStudies, primaryNav, type NavItem, type Route, type SectionId, type WorkItem } from "./data";

// Four-by-four pixel grid, the same mark as the site's logo, in the
// site's pastel palette.
const MARK_CELLS: Array<string | null> = [
  "#c9a0dc", null, "#d9cf8a", null,
  "#8fb4e8", "#c9a0dc", "#8fb4e8", "#a9d8de",
  "#8fb4e8", null, "#8fb4e8", null,
  "#c9a0dc", null, "#d9cf8a", "#8fb4e8",
];

function LogoMark() {
  return (
    <svg viewBox="0 0 26 26" className="size-7 shrink-0" aria-hidden="true">
      {MARK_CELLS.map((fill, i) => (
        <rect
          key={i}
          x={3 + (i % 4) * 5}
          y={3 + Math.floor(i / 4) * 5}
          width="3.5"
          height="3.5"
          rx="0.8"
          fill={fill ?? "currentColor"}
          opacity={fill ? 1 : 0.18}
        />
      ))}
    </svg>
  );
}

const rowBase =
  "group relative flex h-8 w-full items-center gap-2.5 rounded-md px-2 text-left text-[13px] outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring/60";
const rowIdle = "text-foreground/70 hover:bg-foreground/[0.05] hover:text-foreground";
const rowActive = "bg-foreground/[0.07] font-medium text-foreground";

// A project's mark in a fixed 14px slot: its logo, a one-color logo drawn
// in the text color, or (with no logo) the colored dot. The same slot for
// all of them keeps the labels lined up.
function ProjectMark({ w }: { w: WorkItem }) {
  return (
    <span aria-hidden="true" className="grid size-3.5 shrink-0 place-items-center">
      {w.icon && w.iconMask ? (
        <span
          className="block size-3.5 bg-current"
          style={{
            maskImage: `url(${w.icon})`,
            WebkitMaskImage: `url(${w.icon})`,
            maskSize: "contain",
            WebkitMaskSize: "contain",
            maskRepeat: "no-repeat",
            WebkitMaskRepeat: "no-repeat",
            maskPosition: "center",
            WebkitMaskPosition: "center",
          }}
        />
      ) : w.icon ? (
        <img src={w.icon} alt="" className="size-3.5 rounded-[3px] object-contain" />
      ) : (
        <span className="size-2.5 rounded-[3px]" style={{ background: w.tone }} />
      )}
    </span>
  );
}

// Light and dark switch. The shell follows New York time until you
// choose; the choice is stored under "site-theme" (the framed case
// studies read the same key) and the root class is the source of truth,
// so the button also tracks the clock's own changes.
function ThemeToggle({ tip = false }: { tip?: boolean }) {
  const [dark, setDark] = useState(false);
  useEffect(() => {
    const root = document.documentElement;
    const read = () => setDark(root.classList.contains("dark"));
    read();
    const obs = new MutationObserver(read);
    obs.observe(root, { attributes: true, attributeFilter: ["class"] });
    return () => obs.disconnect();
  }, []);

  const toggle = () => {
    const next = !document.documentElement.classList.contains("dark");
    document.documentElement.classList.toggle("dark", next);
    try {
      localStorage.setItem("site-theme", next ? "dark" : "light");
    } catch {}
  };

  const Icon = dark ? Sun : Moon;
  const label = dark ? "Light mode" : "Dark mode";
  const button = (
    <button
      type="button"
      onClick={toggle}
      aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
      title={tip ? undefined : label}
      className="ml-auto grid size-8 shrink-0 place-items-center rounded-md text-foreground/55 outline-none transition-colors hover:bg-foreground/[0.07] hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/60"
    >
      <Icon className="size-[15px]" strokeWidth={1.75} />
    </button>
  );
  return tip ? <RailTip label={label}>{button}</RailTip> : button;
}

function ActiveMarker() {
  return <span aria-hidden="true" className="absolute -left-2 top-1.5 h-5 w-0.5 rounded-full bg-foreground" />;
}

function NavButton({ item, active, onGo }: { item: NavItem; active: boolean; onGo: (r: Route) => void }) {
  const Icon = item.icon;
  return (
    <button
      type="button"
      onClick={() => onGo({ section: item.id })}
      aria-current={active ? "page" : undefined}
      className={cn(rowBase, active ? rowActive : rowIdle)}
    >
      {active && <ActiveMarker />}
      <Icon className={cn("size-[17px] shrink-0", active ? "text-foreground" : "text-foreground/55 group-hover:text-foreground/80")} />
      <span className="truncate">{item.label}</span>
    </button>
  );
}

// Work is a toggle group: the row opens the Work page, the chevron
// expands the case studies underneath. It starts open, and opens again
// by itself whenever you land anywhere inside Work.
function WorkGroup({ item, route, onGo }: { item: NavItem; route: Route; onGo: (r: Route) => void }) {
  const inWork = route.section === "work";
  const [open, setOpen] = useState(true);
  useEffect(() => {
    if (inWork) setOpen(true);
  }, [inWork]);

  const Icon = item.icon;
  const onIndex = inWork && !route.slug;

  return (
    <div>
      <div className="relative flex items-center">
        <button
          type="button"
          onClick={() => onGo({ section: "work" })}
          aria-current={onIndex ? "page" : undefined}
          className={cn(rowBase, "pr-8", onIndex ? rowActive : rowIdle)}
        >
          {onIndex && <ActiveMarker />}
          <Icon className={cn("size-[17px] shrink-0", onIndex ? "text-foreground" : "text-foreground/55 group-hover:text-foreground/80")} />
          <span className="truncate">{item.label}</span>
        </button>
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          aria-controls="sidebar-case-studies"
          aria-label={open ? "Collapse case studies" : "Expand case studies"}
          className="absolute right-1 grid size-6 place-items-center rounded text-foreground/50 outline-none transition-colors hover:bg-foreground/[0.07] hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/60"
        >
          <ChevronRight className={cn("size-3.5 transition-transform duration-150", open && "rotate-90")} strokeWidth={2} />
        </button>
      </div>

      {open && (
        <ul id="sidebar-case-studies" className="ml-[15px] mt-0.5 space-y-0.5 border-l border-foreground/[0.1] pl-2.5">
          {caseStudies.map((w) => {
            const active = inWork && route.slug === w.slug;
            return (
              <li key={w.slug}>
                <button
                  type="button"
                  onClick={() => onGo({ section: "work", slug: w.slug })}
                  aria-current={active ? "page" : undefined}
                  className={cn(rowBase, "h-7", active ? rowActive : rowIdle)}
                >
                  <ProjectMark w={w} />
                  <span className="truncate">{w.name}</span>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

// The collapsed sidebar: the same marks and icons in a narrow rail, with
// each label in a tooltip. Case studies stay out of it; Work opens the
// index.
function RailTip({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <Tooltip.Root>
      <Tooltip.Trigger asChild>{children}</Tooltip.Trigger>
      <Tooltip.Portal>
        <Tooltip.Content
          side="right"
          sideOffset={10}
          className="saas z-50 rounded-md bg-[var(--panel)] px-2.5 py-1.5 text-xs font-medium text-foreground shadow-[0_8px_30px_rgb(0_0_0/0.16)] ring-1 ring-foreground/[0.1] data-[state=delayed-open]:animate-in data-[state=delayed-open]:fade-in-0 data-[state=instant-open]:animate-in data-[state=instant-open]:fade-in-0"
        >
          {label}
        </Tooltip.Content>
      </Tooltip.Portal>
    </Tooltip.Root>
  );
}

function Rail({ route, onGo }: { route: Route; onGo: (r: Route) => void }) {
  return (
    <div className="flex h-full min-h-0 flex-col items-center">
      <div className="pt-3">
        <RailTip label="Humayun Rashid">
          <button
            type="button"
            onClick={() => onGo({ section: "home" })}
            aria-label="Humayun Rashid, home"
            className="grid size-10 place-items-center rounded-md outline-none transition-colors hover:bg-foreground/[0.05] focus-visible:ring-2 focus-visible:ring-ring/60"
          >
            <LogoMark />
          </button>
        </RailTip>
      </div>

      <nav aria-label="Primary" className="flex flex-1 flex-col items-center gap-0.5 overflow-y-auto pt-5">
        {primaryNav.map((item) => {
          const Icon = item.icon;
          const on = route.section === item.id;
          return (
            <RailTip key={item.id} label={item.label}>
              <button
                type="button"
                onClick={() => onGo({ section: item.id })}
                aria-current={on ? "page" : undefined}
                aria-label={item.label}
                className={cn("group relative grid size-10 place-items-center rounded-md outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring/60", on ? rowActive : rowIdle)}
              >
                {on && <span aria-hidden="true" className="absolute -left-2 top-2.5 h-5 w-0.5 rounded-full bg-foreground" />}
                <Icon className={cn("size-[18px]", on ? "text-foreground" : "text-foreground/55 group-hover:text-foreground/80")} />
              </button>
            </RailTip>
          );
        })}
      </nav>

      <div className="flex flex-col items-center gap-1 border-t border-foreground/[0.07] px-2 py-3">
        <ProfileMenu onGo={onGo} compact />
        <ThemeToggle tip />
      </div>
    </div>
  );
}

export function Sidebar({ route, onGo, collapsed = false }: { route: Route; onGo: (r: Route) => void; collapsed?: boolean }) {
  const active = (id: SectionId) => route.section === id;
  if (collapsed)
    return (
      <Tooltip.Provider delayDuration={150} skipDelayDuration={300}>
        <Rail route={route} onGo={onGo} />
      </Tooltip.Provider>
    );
  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="p-3 pb-2">
        <button
          type="button"
          onClick={() => onGo({ section: "home" })}
          className="flex w-full items-center gap-2.5 rounded-md p-1 text-left outline-none transition-colors hover:bg-foreground/[0.05] focus-visible:ring-2 focus-visible:ring-ring/60"
        >
          <LogoMark />
          <span className="min-w-0 truncate text-[13px] font-medium">Humayun Rashid</span>
        </button>
      </div>

      <nav aria-label="Primary" className="flex-1 overflow-y-auto px-3 pb-3 pt-5">
        <div className="space-y-0.5">
          {primaryNav.map((item) =>
            item.id === "work" ? (
              <WorkGroup key={item.id} item={item} route={route} onGo={onGo} />
            ) : (
              <NavButton key={item.id} item={item} active={active(item.id)} onGo={onGo} />
            ),
          )}
        </div>
      </nav>

      <div className="border-t border-foreground/[0.07] p-3">
        <div className="flex items-center gap-1">
          <ProfileMenu onGo={onGo} />
          <ThemeToggle />
        </div>
      </div>
    </div>
  );
}
