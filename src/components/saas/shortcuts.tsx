import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { Dialog } from "radix-ui";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { primaryNav, type Route, type SectionId } from "./data";

// One-letter shortcuts: press a letter anywhere (outside a text field) to
// jump to that section, "?" opens the list. The letters live here, in one
// place, and the sidebar reads them to show on hover.
export const NAV_KEYS: Partial<Record<SectionId, string>> = {
  home: "H",
  work: "W",
  ideas: "I",
  apps: "A",
  process: "P",
  inspiration: "N",
};

const KEY_TO_SECTION = Object.fromEntries(
  Object.entries(NAV_KEYS).map(([id, k]) => [k!.toLowerCase(), id as SectionId]),
);

export const OPEN_SHORTCUTS_EVENT = "saas:shortcuts";

export function Kbd({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <kbd
      className={cn(
        "inline-grid h-[18px] min-w-[18px] place-items-center rounded-[4px] px-1 font-sans text-[11px] font-normal leading-none text-foreground/65 ring-1 ring-inset ring-foreground/[0.16]",
        className,
      )}
    >
      {children}
    </kbd>
  );
}

const isMac = () => typeof navigator !== "undefined" && /Mac|iPhone|iPad/.test(navigator.platform);

type Row = { id: string; group: string; label: string; keys: string[]; run?: () => void };

export function KeyboardShortcuts({ go, onToggleSidebar }: { go: (r: Route) => void; onToggleSidebar: () => void }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const latest = useRef({ go, open });
  latest.current = { go, open };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey || e.repeat) return;
      if ((e.target as HTMLElement | null)?.closest?.('input, textarea, select, [contenteditable="true"]')) return;
      if (e.key === "?") {
        e.preventDefault();
        setOpen((o) => !o);
        return;
      }
      if (e.shiftKey || latest.current.open) return;
      // Another dialog (the drawer, a lightbox) owns the keyboard.
      if (document.querySelector('[role="dialog"]')) return;
      const id = KEY_TO_SECTION[e.key.toLowerCase()];
      if (id) {
        e.preventDefault();
        latest.current.go({ section: id });
      }
    };
    const onOpen = () => setOpen(true);
    window.addEventListener("keydown", onKey);
    window.addEventListener(OPEN_SHORTCUTS_EVENT, onOpen);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener(OPEN_SHORTCUTS_EVENT, onOpen);
    };
  }, []);

  const rows = useMemo<Row[]>(
    () => [
      ...primaryNav.map((n) => ({
        id: n.id,
        group: "Go to",
        label: n.label,
        keys: [NAV_KEYS[n.id] ?? ""],
        run: () => go({ section: n.id }),
      })),
      { id: "sidebar", group: "General", label: "Toggle sidebar", keys: [isMac() ? "⌘" : "Ctrl", "B"], run: onToggleSidebar },
      { id: "shortcuts", group: "General", label: "Show shortcuts", keys: ["?"] },
      { id: "close", group: "General", label: "Close this panel", keys: ["Esc"] },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [open],
  );

  const q = query.trim().toLowerCase();
  const shown = q
    ? rows.filter((r) => `${r.group} ${r.label}`.toLowerCase().includes(q) || r.keys.some((k) => k.toLowerCase() === q))
    : rows;
  const groups = [...new Set(shown.map((r) => r.group))];

  const choose = (r: Row) => {
    if (!r.run) return;
    setOpen(false);
    r.run();
  };

  return (
    <Dialog.Root
      open={open}
      onOpenChange={(o) => {
        setOpen(o);
        if (!o) setQuery("");
      }}
    >
      <Dialog.Portal>
        <Dialog.Overlay className="saas fixed inset-0 z-50 bg-black/25 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=closed]:animate-out data-[state=closed]:fade-out-0" />
        <Dialog.Content
          className="saas fixed left-1/2 top-[16%] z-50 w-[min(92vw,440px)] -translate-x-1/2 overflow-hidden rounded-xl bg-[var(--panel)] text-foreground shadow-[0_16px_50px_rgb(0_0_0/0.2)] ring-1 ring-foreground/[0.1] outline-none data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95"
        >
          <Dialog.Title className="sr-only">Keyboard shortcuts</Dialog.Title>
          <Dialog.Description className="sr-only">Press a letter to jump to a section. Search to filter.</Dialog.Description>

          <div className="flex items-center gap-2.5 border-b border-[var(--line)] px-4">
            <Search className="size-4 shrink-0 text-foreground/65" strokeWidth={1.75} aria-hidden="true" />
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  const first = shown.find((r) => r.run);
                  if (first) choose(first);
                }
              }}
              placeholder="Search shortcuts"
              aria-label="Search shortcuts"
              className="h-12 min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-foreground/50"
            />
            <Kbd>Esc</Kbd>
          </div>

          <div className="max-h-[min(60vh,380px)] overflow-y-auto p-2">
            {groups.length === 0 && <p className="px-3 py-8 text-center text-[13px] text-foreground/65">No shortcuts match “{query.trim()}”.</p>}
            {groups.map((g) => (
              <section key={g} aria-label={g} className="pb-1">
                <h2 className="px-3 pb-1 pt-2 text-xs font-medium text-foreground/65">{g}</h2>
                <ul>
                  {shown
                    .filter((r) => r.group === g)
                    .map((r) => (
                      <li key={r.id}>
                        <button
                          type="button"
                          onClick={() => choose(r)}
                          disabled={!r.run}
                          className="flex h-9 w-full items-center gap-3 rounded-md px-3 text-left text-[13px] outline-none transition-colors enabled:hover:bg-foreground/[0.05] enabled:focus-visible:bg-foreground/[0.05] enabled:focus-visible:ring-2 enabled:focus-visible:ring-ring/60 disabled:cursor-default"
                        >
                          <span className="min-w-0 flex-1 truncate">{r.label}</span>
                          <span className="flex items-center gap-1">
                            {r.keys.map((k) => (
                              <Kbd key={k}>{k}</Kbd>
                            ))}
                          </span>
                        </button>
                      </li>
                    ))}
                </ul>
              </section>
            ))}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
