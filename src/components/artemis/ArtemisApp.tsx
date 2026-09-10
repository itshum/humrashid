import { useState } from "react";
import { AppShell } from "./AppShell";
import { CasesQueue } from "./CasesQueue";
import { CaseDetail } from "./CaseDetail";
import type { Case, Severity } from "./data";
import "./theme.css";

type View = { name: "queue" } | { name: "detail"; caseItem: Case };

export function ArtemisApp() {
  const [view, setView] = useState<View>({ name: "queue" });
  // Lifted above CasesQueue so the sidebar's Cases sub-nav can drive
  // which severity the queue shows.
  const [severityFilter, setSeverityFilter] = useState<Severity | "all">("all");

  function goToQueue(severity: Severity | "all") {
    setSeverityFilter(severity);
    setView({ name: "queue" });
  }

  return (
    <div className="artemis-shell h-svh w-full overflow-hidden bg-background text-foreground">
      <AppShell severityFilter={severityFilter} onSelectSeverity={goToQueue}>
        {view.name === "detail" ? (
          <div className="min-h-0 flex-1 overflow-y-auto">
            <CaseDetail caseItem={view.caseItem} onBack={() => setView({ name: "queue" })} />
          </div>
        ) : (
          <div className="flex min-h-0 flex-1 flex-col gap-4 p-6">
            <div className="flex items-center justify-between">
              <h1 className="text-lg font-semibold">Cases</h1>
            </div>
            <CasesQueue
              severityFilter={severityFilter}
              onOpenFullCase={(c) => setView({ name: "detail", caseItem: c })}
            />
          </div>
        )}
      </AppShell>
    </div>
  );
}
