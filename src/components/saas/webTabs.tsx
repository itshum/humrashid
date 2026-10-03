import { createContext, useContext, useState } from "react";
import { ArrowUpRight, FileText, Globe, RotateCw, X } from "lucide-react";
import { cn } from "@/lib/utils";

// External sites open as tabs inside the shell, like the browser tab in
// Cursor: a strip above the panel with the current page first, then one
// tab per site. Plenty of sites refuse to be shown inside another page
// (X-Frame-Options or frame-ancestors), and a page can't tell from the
// outside, so each tab is marked `embed` by hand after checking the
// site's headers. A refusing site gets a plain card with a button that
// opens it in the browser instead of a blank frame.

export interface WebTab {
  id: string;
  url: string;
  title: string;
  embed: boolean;
}

export const WebTabsContext = createContext<{ open: (t: WebTab) => void }>({ open: () => {} });
export const useWebTabs = () => useContext(WebTabsContext);

// A click that should still go to a real browser tab (cmd, ctrl, shift,
// or the middle button) is left to the link.
export function wantsBrowserTab(e: { metaKey: boolean; ctrlKey: boolean; shiftKey: boolean; button: number }) {
  return e.metaKey || e.ctrlKey || e.shiftKey || e.button === 1;
}

const host = (url: string) => new URL(url).host.replace(/^www\./, "");

export function TabStrip({
  pageLabel,
  tabs,
  active,
  onSelect,
  onClose,
}: {
  pageLabel: string;
  tabs: WebTab[];
  active: string | null;
  onSelect: (id: string | null) => void;
  onClose: (id: string) => void;
}) {
  const tab = "group/tab relative flex h-8 max-w-[200px] items-center gap-1.5 rounded-md px-2.5 text-[13px] outline-none transition-colors focus-within:ring-2 focus-within:ring-ring/60";
  return (
    <div role="tablist" aria-label="Open pages" className="flex h-10 shrink-0 items-center gap-1 overflow-x-auto border-b border-foreground/[0.07] px-2">
      <button
        type="button"
        role="tab"
        aria-selected={active === null}
        onClick={() => onSelect(null)}
        className={cn(tab, "shrink-0 outline-none", active === null ? "bg-foreground/[0.07] font-medium text-foreground" : "text-foreground/65 hover:bg-foreground/[0.04] hover:text-foreground")}
      >
        <FileText className="size-3.5 shrink-0" aria-hidden="true" />
        <span className="truncate">{pageLabel}</span>
      </button>
      {tabs.map((t) => (
        <div key={t.id} className={cn(tab, "pr-1", active === t.id ? "bg-foreground/[0.07] text-foreground" : "text-foreground/65 hover:bg-foreground/[0.04] hover:text-foreground")}>
          <button
            type="button"
            role="tab"
            aria-selected={active === t.id}
            onClick={() => onSelect(t.id)}
            className={cn("flex min-w-0 items-center gap-1.5 outline-none", active === t.id && "font-medium")}
          >
            <Globe className="size-3.5 shrink-0" aria-hidden="true" />
            <span className="truncate">{t.title}</span>
          </button>
          <button
            type="button"
            onClick={() => onClose(t.id)}
            aria-label={`Close ${t.title}`}
            className="grid size-5 shrink-0 place-items-center rounded text-foreground/65 outline-none transition-colors hover:bg-foreground/[0.08] hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/60"
          >
            <X className="size-3" aria-hidden="true" />
          </button>
        </div>
      ))}
    </div>
  );
}

export function WebView({ tab, visible }: { tab: WebTab; visible: boolean }) {
  const [reloads, setReloads] = useState(0);
  return (
    <div className={cn("min-h-0 flex-1 flex-col", visible ? "flex" : "hidden")} role="tabpanel" aria-label={tab.title}>
      <div className="flex h-10 shrink-0 items-center gap-2 border-b border-foreground/[0.07] px-3">
        {tab.embed && (
          <button
            type="button"
            onClick={() => setReloads((n) => n + 1)}
            aria-label="Reload"
            title="Reload"
            className="grid size-7 place-items-center rounded-md text-foreground/65 outline-none transition-colors hover:bg-foreground/[0.06] hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/60"
          >
            <RotateCw className="size-3.5" aria-hidden="true" />
          </button>
        )}
        <p className="min-w-0 flex-1 truncate rounded-md bg-foreground/[0.05] px-2.5 py-1 text-xs text-foreground/65">{host(tab.url)}</p>
        <a
          href={tab.url}
          target="_blank"
          rel="noreferrer noopener"
          className="inline-flex h-7 items-center gap-1 rounded-md px-2 text-xs text-foreground/65 outline-none transition-colors hover:bg-foreground/[0.06] hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/60"
        >
          Open in browser <ArrowUpRight className="size-3" aria-hidden="true" />
        </a>
      </div>
      {tab.embed ? (
        <iframe
          key={reloads}
          src={tab.url}
          title={tab.title}
          referrerPolicy="no-referrer"
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox"
          className="min-h-0 w-full flex-1 border-0 bg-white"
        />
      ) : (
        <div className="grid flex-1 place-items-center p-6">
          <div className="max-w-sm text-center">
            <p className="text-sm font-medium">{tab.title} can’t be shown here</p>
            <p className="mt-1.5 text-[13px] leading-relaxed text-foreground/65">
              {host(tab.url)} doesn’t allow other sites to display it, so it has to open in your browser.
            </p>
            <a
              href={tab.url}
              target="_blank"
              rel="noreferrer noopener"
              className="mt-4 inline-flex h-8 items-center gap-1.5 rounded-[5px] px-3 text-[13px] font-medium ring-1 ring-foreground/20 outline-none transition-colors hover:bg-foreground/[0.04] hover:ring-foreground/40 focus-visible:ring-2 focus-visible:ring-ring/70"
            >
              Open {host(tab.url)} <ArrowUpRight className="size-3.5" aria-hidden="true" />
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
