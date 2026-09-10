import { useState } from "react";
import { CasesQueue } from "./CasesQueue";
import { QuickActionPanel } from "./QuickActionPanel";
import { CaseDetail } from "./CaseDetail";
import type { Case } from "./data";

type View = { name: "queue" } | { name: "detail"; caseItem: Case };

export function ArtemisApp() {
  const [view, setView] = useState<View>({ name: "queue" });
  const [panelCase, setPanelCase] = useState<Case | null>(null);

  if (view.name === "detail") {
    return <CaseDetail caseItem={view.caseItem} onBack={() => setView({ name: "queue" })} />;
  }

  return (
    <div className="mx-auto max-w-5xl p-6">
      <h1 className="mb-4 text-lg font-semibold">Cases</h1>
      <CasesQueue onSelectCase={setPanelCase} />
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
