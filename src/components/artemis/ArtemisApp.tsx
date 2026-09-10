import { useState } from "react";
import { AppShell } from "./AppShell";
import { CasesQueue } from "./CasesQueue";
import { QuickActionPanel } from "./QuickActionPanel";
import { CaseDetail } from "./CaseDetail";
import type { Case } from "./data";
import "./theme.css";

type View = { name: "queue" } | { name: "detail"; caseItem: Case };

export function ArtemisApp() {
  const [view, setView] = useState<View>({ name: "queue" });
  const [panelCase, setPanelCase] = useState<Case | null>(null);

  return (
    <div className="artemis-shell h-svh w-full overflow-hidden bg-background text-foreground">
      <AppShell>
        {view.name === "detail" ? (
          <div className="min-h-0 flex-1 overflow-y-auto">
            <CaseDetail caseItem={view.caseItem} onBack={() => setView({ name: "queue" })} />
          </div>
        ) : (
          <div className="flex min-h-0 flex-1 flex-col gap-4 p-6">
            <div className="flex items-center justify-between">
              <h1 className="text-lg font-semibold">Cases</h1>
            </div>
            <CasesQueue onSelectCase={setPanelCase} />
          </div>
        )}
      </AppShell>
      <QuickActionPanel
        caseItem={panelCase}
        onOpenChange={(open) => {
          if (!open) setPanelCase(null);
        }}
        onOpenFullCase={(c) => {
          setPanelCase(null);
          setView({ name: "detail", caseItem: c });
        }}
      />
    </div>
  );
}
