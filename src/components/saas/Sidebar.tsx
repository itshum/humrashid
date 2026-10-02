import { useEffect, useState } from "react";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { caseStudies, primaryNav, secondaryNav, type NavItem, type Route, type SectionId } from "./data";

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
    <svg viewBox="0 0 26 26" className="size-7 shrink-0 rounded-md bg-foreground/[0.06]" aria-hidden="true">
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
                  <span aria-hidden="true" className="size-2.5 shrink-0 rounded-[3px]" style={{ background: w.tone }} />
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

export function Sidebar({ route, onGo }: { route: Route; onGo: (r: Route) => void }) {
  const active = (id: SectionId) => route.section === id;
  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="p-3 pb-2">
        <button
          type="button"
          onClick={() => onGo({ section: "home" })}
          className="flex w-full items-center gap-2.5 rounded-md p-1 text-left outline-none transition-colors hover:bg-foreground/[0.05] focus-visible:ring-2 focus-visible:ring-ring/60"
        >
          <LogoMark />
          <span className="min-w-0 leading-tight">
            <span className="block truncate text-[13px] font-medium">Humayun Rashid</span>
            <span className="block truncate text-xs text-foreground/50">Portfolio</span>
          </span>
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
        <nav aria-label="Secondary" className="space-y-0.5">
          {secondaryNav.map((item) => (
            <NavButton key={item.id} item={item} active={active(item.id)} onGo={onGo} />
          ))}
        </nav>
        <div className="mt-2 flex items-center gap-2.5 rounded-md p-1">
          <span className="grid size-7 shrink-0 place-items-center rounded-full bg-foreground/[0.08] text-[11px] font-medium" aria-hidden="true">
            HR
          </span>
          <span className="min-w-0 leading-tight">
            <span className="block truncate text-[13px] font-medium">Humayun Rashid</span>
            <span className="block truncate text-xs text-foreground/50">Designer and founder, NYC</span>
          </span>
        </div>
      </div>
    </div>
  );
}
