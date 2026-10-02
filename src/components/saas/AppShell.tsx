import { useEffect, useRef, useState } from "react";
import { Dialog } from "radix-ui";
import { ArrowUpRight, Menu, PanelLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { allNav, caseStudies, caseStudyFor, parseHash, routeToHash, type Route } from "./data";
import { ideas } from "./content";
import { skipMotionWhenHidden } from "../../scripts/reveal";
import { Sidebar } from "./Sidebar";
import { View, WorkModeToggle, type WorkMode } from "./views";
import "./saas.css";

// The portfolio as a product: a sidebar on the left, a single inset
// panel on the right that swaps views. Layout from Catalyst, density
// from Linear, restraint from Cursor.
export default function AppShell() {
  const [route, setRoute] = useState<Route>({ section: "home" });
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [workMode, setWorkMode] = useState<WorkMode>("list");
  const menuButton = useRef<HTMLButtonElement>(null);
  const scroller = useRef<HTMLDivElement>(null);

  // Loaded in a hidden tab or a headless capture, animations never
  // advance; flag it so the drawings land in their finished state.
  useEffect(() => {
    skipMotionWhenHidden();
  }, []);

  // Views are deep-linkable (#work), and back/forward work.
  useEffect(() => {
    setRoute(parseHash(window.location.hash));
    const onHash = () => setRoute(parseHash(window.location.hash));
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
        if (window.matchMedia("(min-width: 1024px)").matches) setSidebarOpen((o) => !o);
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
      if (e.origin === window.location.origin && e.data?.type === "close-case-study") {
        setRoute({ section: "work" });
        window.history.pushState(null, "", "#work");
      }
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, []);

  const go = (next: Route) => {
    setRoute(next);
    setDrawerOpen(false);
    window.history.pushState(null, "", routeToHash(next) || window.location.pathname);
    scroller.current?.scrollTo({ top: 0 });
  };

  const section = allNav.find((n) => n.id === route.section)!;
  const study = caseStudyFor(route);
  const record =
    route.section === "work"
      ? caseStudies.find((w) => w.slug === route.slug)?.name
      : route.section === "ideas"
        ? ideas.find((p) => p.slug === route.slug)?.title
        : undefined;
  const crumbs = [section.label, ...(route.slug && record ? [record] : [])];

  return (
    <div className="saas flex h-dvh bg-[var(--shell)] text-foreground antialiased">
      {/* Desktop sidebar */}
      <aside className={cn("hidden w-64 shrink-0 lg:block", !sidebarOpen && "lg:hidden")} aria-label="Sidebar">
        <Sidebar route={route} onGo={go} />
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
            className="saas fixed inset-y-0 left-0 z-50 w-72 max-w-[85vw] bg-[var(--shell)] text-foreground shadow-xl outline-none data-[state=closed]:animate-out data-[state=open]:animate-in data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left lg:hidden">
            <Dialog.Title className="sr-only">Navigation</Dialog.Title>
            <Dialog.Description className="sr-only">Move between sections of the portfolio.</Dialog.Description>
            <Sidebar route={route} onGo={go} />
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      {/* Right panel */}
      <main className="flex min-w-0 flex-1 flex-col lg:py-2 lg:pr-2" aria-label={section.label}>
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden bg-[var(--panel)] lg:rounded-xl lg:shadow-[0_1px_2px_rgb(0_0_0/0.04)] lg:ring-1 lg:ring-foreground/[0.08]">
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
              aria-label={sidebarOpen ? "Hide sidebar" : "Show sidebar"}
              aria-pressed={!sidebarOpen}
              title="Toggle sidebar (Ctrl or Cmd + B)"
              className="hidden size-8 place-items-center rounded-md text-foreground/60 outline-none transition-colors hover:bg-foreground/[0.06] hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/60 lg:grid"
            >
              <PanelLeft className="size-4" strokeWidth={1.75} />
            </button>
            <nav aria-label="Breadcrumb" className="flex min-w-0 items-center gap-1.5 text-[13px]">
              <span className="shrink-0 text-foreground/50">Humayun Rashid</span>
              {crumbs.map((c, i) => (
                <span key={c} className="flex min-w-0 items-center gap-1.5">
                  <span aria-hidden="true" className="text-foreground/25">/</span>
                  <span
                    className={cn("truncate", i === crumbs.length - 1 ? "font-medium" : "text-foreground/50")}
                    aria-current={i === crumbs.length - 1 ? "page" : undefined}
                  >
                    {c}
                  </span>
                </span>
              ))}
            </nav>
            {route.section === "work" && !route.slug && (
              <div className="ml-auto shrink-0">
                <WorkModeToggle value={workMode} onChange={setWorkMode} />
              </div>
            )}
            {study?.href && (
              <a
                href={study.href}
                aria-label="Open page in a new tab"
                target="_blank"
                rel="noopener noreferrer"
                className="ml-auto inline-flex h-8 shrink-0 items-center gap-1 whitespace-nowrap rounded-md px-2.5 text-[13px] text-foreground/60 outline-none transition-colors hover:bg-foreground/[0.06] hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/60"
              >
                <span className="hidden sm:inline" aria-hidden="true">Open page</span>
                <ArrowUpRight className="size-3.5" aria-hidden="true" />
              </a>
            )}
          </header>

          {study ? (
            // A case study fills the panel edge to edge and scrolls itself.
            <div className="min-h-0 flex-1">
              <View route={route} go={go} workMode={workMode} />
            </div>
          ) : (
            <div ref={scroller} className="min-h-0 flex-1 overflow-y-auto">
              <div
                className={cn(
                  "mx-auto w-full px-5 py-8 sm:px-8 sm:py-10",
                  // The Work index is a wide table, so it gets the room.
                  route.section === "work" ? "max-w-7xl" : "max-w-5xl",
                )}
              >
                <View route={route} go={go} workMode={workMode} />
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
