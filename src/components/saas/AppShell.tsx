import { useEffect, useRef, useState } from "react";
import { Dialog } from "radix-ui";
import { Menu, PanelLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  allNav,
  caseStudies,
  caseStudyFor,
  parseHash,
  routeToHash,
  type Route,
} from "./data";
import { ideas } from "./content";
import { prints } from "./inspirationData";
import { skipMotionWhenHidden } from "../../scripts/reveal";
import { Sidebar } from "./Sidebar";
import { Loader } from "./Loader";
import { View, type WorkMode } from "./views";
import { TabStrip, WebTabsContext, WebView, type WebTab } from "./webTabs";
import "./saas.css";

// The portfolio as a product: a sidebar on the left, a single inset
// panel on the right that swaps views. Layout from Catalyst, density
// from Linear, restraint from Cursor.
export default function AppShell() {
  const [route, setRoute] = useState<Route>({ section: "home" });
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [workMode, setWorkMode] = useState<WorkMode>("list");
  // External sites open as tabs inside the panel; null means the page.
  const [tabs, setTabs] = useState<WebTab[]>([]);
  const [activeTab, setActiveTab] = useState<string | null>(null);
  // First visit: the panel shows only the loader for a couple of seconds,
  // then the content fades in. index.astro puts `saas-intro` on <html>
  // before first paint when this browser hasn't seen it yet.
  const [intro, setIntro] = useState<"off" | "loading" | "leaving">("off");
  const menuButton = useRef<HTMLButtonElement>(null);
  const scroller = useRef<HTMLDivElement>(null);

  // Loaded in a hidden tab or a headless capture, animations never
  // advance; flag it so the drawings land in their finished state.
  useEffect(() => {
    skipMotionWhenHidden();
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    if (!root.classList.contains("saas-intro")) return;
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setIntro("loading");
    const finish = () => {
      root.classList.remove("saas-intro");
      try {
        localStorage.setItem("site3-intro-seen", "1");
      } catch {}
      setIntro("leaving");
      window.setTimeout(() => setIntro("off"), 600);
    };
    const t = window.setTimeout(finish, still ? 1000 : 2600);
    return () => window.clearTimeout(t);
  }, []);

  // Views are deep-linkable (#work), and back/forward work.
  useEffect(() => {
    setRoute(parseHash(window.location.hash));
    const onHash = () => {
      setActiveTab(null);
      setRoute(parseHash(window.location.hash));
    };
    // pushState navigation fires popstate on back/forward; typing a
    // new #hash by hand fires hashchange.
    window.addEventListener("popstate", onHash);
    window.addEventListener("hashchange", onHash);
    return () => {
      window.removeEventListener("popstate", onHash);
      window.removeEventListener("hashchange", onHash);
    };
  }, []);

  // Cmd/Ctrl+B toggles the sidebar, as in Cursor.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "b") {
        e.preventDefault();
        if (window.matchMedia("(min-width: 1024px)").matches)
          setSidebarOpen((o) => !o);
        else setDrawerOpen((o) => !o);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // An embedded case study's own back arrow asks us to close it
  // (Topbar.astro posts this when its page is inside a frame).
  useEffect(() => {
    const onMessage = (e: MessageEvent) => {
      if (
        e.origin === window.location.origin &&
        e.data?.type === "close-case-study"
      ) {
        setRoute({ section: "work" });
        window.history.pushState(null, "", "#work");
      }
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, []);

  const openWeb = (t: WebTab) => {
    setTabs((cur) => (cur.some((c) => c.id === t.id) ? cur : [...cur, t]));
    setActiveTab(t.id);
    setDrawerOpen(false);
  };
  const closeTab = (id: string) => {
    setTabs((cur) => cur.filter((c) => c.id !== id));
    setActiveTab((cur) => (cur === id ? null : cur));
  };

  const go = (next: Route) => {
    setActiveTab(null);
    setRoute(next);
    setDrawerOpen(false);
    window.history.pushState(
      null,
      "",
      routeToHash(next) || window.location.pathname,
    );
    scroller.current?.scrollTo({ top: 0 });
  };

  const section = allNav.find((n) => n.id === route.section)!;
  const study = caseStudyFor(route);
  const record =
    route.section === "work"
      ? caseStudies.find((w) => w.slug === route.slug)?.name
      : route.section === "ideas"
        ? ideas.find((p) => p.slug === route.slug)?.title
        : route.section === "inspiration"
          ? prints.find((p) => p.id === route.slug)?.label
          : undefined;
  // Starts at the page itself (the sidebar already says whose site this
  // is). Every crumb but the last is a link back to the section index.
  const deep = !!(route.slug && record);
  const openTab = tabs.find((t) => t.id === activeTab);
  const crumbs: Array<{ label: string; to?: Route }> = openTab
    ? [{ label: "Work", to: { section: "work" } }, { label: openTab.title }]
    : [
        {
          label: section.label,
          to: deep ? { section: route.section } : undefined,
        },
        ...(deep ? [{ label: record as string }] : []),
      ];
  const pageLabel = record ?? section.label;

  return (
    <WebTabsContext.Provider value={{ open: openWeb }}>
      <div className="saas fixed inset-0 flex bg-[var(--shell)] text-foreground antialiased">
        {/* Desktop sidebar */}
        {/* The width glides between the full sidebar and the icon rail while
          the two layouts trade places with a quick crossfade, each at its
          own fixed width so nothing reflows mid-slide. The hidden one is
          inert, so it can't be tabbed to or read out. */}
        <aside
          className={cn(
            "relative hidden shrink-0 overflow-hidden transition-[width] duration-[240ms] ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none lg:block",
            sidebarOpen ? "w-64" : "w-14",
          )}
          aria-label="Sidebar"
        >
          <div
            inert={!sidebarOpen}
            className={cn(
              "absolute inset-y-0 left-0 w-64 transition-opacity motion-reduce:transition-none",
              sidebarOpen
                ? "opacity-100 duration-200 delay-75"
                : "pointer-events-none opacity-0 duration-100",
            )}
          >
            <Sidebar route={route} onGo={go} />
          </div>
          <div
            inert={sidebarOpen}
            className={cn(
              "absolute inset-y-0 left-0 w-14 transition-opacity motion-reduce:transition-none",
              sidebarOpen
                ? "pointer-events-none opacity-0 duration-100"
                : "opacity-100 duration-200 delay-75",
            )}
          >
            <Sidebar route={route} onGo={go} collapsed />
          </div>
        </aside>

        {/* Mobile drawer */}
        <Dialog.Root open={drawerOpen} onOpenChange={setDrawerOpen}>
          <Dialog.Portal>
            <Dialog.Overlay className="saas fixed inset-0 z-40 bg-black/40 data-[state=closed]:animate-out data-[state=open]:animate-in data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 lg:hidden" />
            <Dialog.Content
              onCloseAutoFocus={(e) => {
                // Controlled open (no Trigger), so hand focus back by hand.
                e.preventDefault();
                menuButton.current?.focus();
              }}
              className="saas fixed inset-y-0 left-0 z-50 w-72 max-w-[85vw] bg-[var(--shell)] text-foreground shadow-xl outline-none data-[state=closed]:animate-out data-[state=open]:animate-in data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left lg:hidden"
            >
              <Dialog.Title className="sr-only">Navigation</Dialog.Title>
              <Dialog.Description className="sr-only">
                Move between sections of the portfolio.
              </Dialog.Description>
              <Sidebar route={route} onGo={go} />
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>

        {/* Right panel */}
        <main
          className="flex min-w-0 flex-1 flex-col lg:py-2 lg:pr-2"
          aria-label={section.label}
        >
          <div className="saas-panel relative flex min-h-0 flex-1 flex-col overflow-hidden bg-[var(--panel)] [&>*:not(.saas-loader)]:transition-opacity [&>*:not(.saas-loader)]:duration-500 lg:rounded-xl lg:shadow-[0_1px_2px_rgb(0_0_0/0.04)] lg:ring-1 lg:ring-foreground/[0.08]">
            {intro !== "off" && (
              <Loader
                leaving={intro === "leaving"}
                still={
                  window.matchMedia("(prefers-reduced-motion: reduce)").matches
                }
              />
            )}
            <header className="flex h-12 shrink-0 items-center gap-2 border-b border-foreground/[0.07] px-3">
              <button
                ref={menuButton}
                type="button"
                onClick={() => setDrawerOpen(true)}
                aria-label="Open navigation"
                className="grid size-8 place-items-center rounded-md text-foreground/60 outline-none transition-colors hover:bg-foreground/[0.06] hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/60 lg:hidden"
              >
                <Menu className="size-4" />
              </button>
              <button
                type="button"
                onClick={() => setSidebarOpen((o) => !o)}
                aria-label={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
                aria-pressed={!sidebarOpen}
                title="Toggle sidebar (Ctrl or Cmd + B)"
                className="hidden size-8 place-items-center rounded-md text-foreground/60 outline-none transition-colors hover:bg-foreground/[0.06] hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/60 lg:grid"
              >
                <PanelLeft className="size-4" strokeWidth={1.75} />
              </button>
              <nav
                aria-label="Breadcrumb"
                className="flex min-w-0 items-center gap-1.5 text-[13px]"
              >
                {crumbs.map((c, i) => {
                  const last = i === crumbs.length - 1;
                  return (
                    <span
                      key={c.label}
                      className={cn(
                        "flex items-center gap-1.5",
                        last ? "min-w-0" : "shrink-0",
                      )}
                    >
                      {i > 0 && (
                        <span aria-hidden="true" className="text-foreground/25">
                          /
                        </span>
                      )}
                      {c.to ? (
                        <button
                          type="button"
                          onClick={() => go(c.to!)}
                          className="-mx-1 rounded px-1 text-foreground/60 outline-none transition-colors hover:bg-foreground/[0.06] hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/60"
                        >
                          {c.label}
                        </button>
                      ) : (
                        <span
                          className={cn(
                            "truncate",
                            last ? "font-medium" : "text-foreground/60",
                          )}
                          aria-current={last ? "page" : undefined}
                        >
                          {c.label}
                        </span>
                      )}
                    </span>
                  );
                })}
              </nav>
            </header>

            {tabs.length > 0 && (
              <TabStrip
                pageLabel={pageLabel}
                tabs={tabs}
                active={activeTab}
                onSelect={setActiveTab}
                onClose={closeTab}
              />
            )}

            {/* The page stays mounted behind a web tab, so its scroll position
              and any open case study are right where they were left. */}
            <div
              className={cn(
                "min-h-0 flex-1 flex-col",
                activeTab ? "hidden" : "flex",
              )}
            >
              {study ? (
                // A case study fills the panel edge to edge and scrolls itself.
                <div className="min-h-0 flex-1">
                  <View
                    route={route}
                    go={go}
                    workMode={workMode}
                    onWorkMode={setWorkMode}
                  />
                </div>
              ) : (
                <div
                  ref={scroller}
                  className={cn(
                    "min-h-0 flex-1",
                    // A single print fits the window and never scrolls.
                    route.section === "inspiration" && route.slug
                      ? "overflow-hidden"
                      : "overflow-y-auto",
                  )}
                >
                  <div
                    className={cn(
                      "mx-auto w-full",
                      !(route.section === "inspiration" && route.slug) &&
                        "px-5 py-8 sm:px-8 sm:py-10",
                      // The Work index is a wide table, so it gets the room.
                      route.section === "work" ? "max-w-7xl" : "max-w-5xl",
                      // A single print runs edge to edge, so the next one
                      // can peek in at the panel's own edge.
                      route.section === "inspiration" &&
                        route.slug &&
                        "flex h-full max-w-none flex-col",
                    )}
                  >
                    <View
                      route={route}
                      go={go}
                      workMode={workMode}
                      onWorkMode={setWorkMode}
                    />
                  </div>
                </div>
              )}
            </div>
            {tabs.map((t) => (
              <WebView key={t.id} tab={t} visible={activeTab === t.id} />
            ))}
          </div>
        </main>
      </div>
    </WebTabsContext.Provider>
  );
}
