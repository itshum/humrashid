import { Button } from "@/components/ui/button";
import { isQuickActionable } from "./badges";
import type { Case } from "./data";

export function BulkActionBar({
  selectedCases,
  onResolve,
  onAssignToMe,
  onClear,
}: {
  selectedCases: Case[];
  onResolve: () => void;
  onAssignToMe: () => void;
  onClear: () => void;
}) {
  const allActionable = selectedCases.every((c) => isQuickActionable(c.verdict));
  const nonActionableCount = selectedCases.filter((c) => !isQuickActionable(c.verdict)).length;

  return (
    <div className="flex flex-wrap items-center gap-2 border-b bg-accent/40 p-2 px-3">
      <span className="text-xs font-medium">{selectedCases.length} Selected</span>
      <div className="flex items-center gap-1.5">
        <Button size="sm" disabled={!allActionable} onClick={onResolve}>
          Resolve
        </Button>
        <Button size="sm" variant="outline" disabled={!allActionable} onClick={onAssignToMe}>
          Assign To Me
        </Button>
      </div>
      {!allActionable && (
        <span className="text-[11px] text-muted-foreground">
          {nonActionableCount} selected need full review before bulk action
        </span>
      )}
      <Button size="sm" variant="ghost" className="ml-auto" onClick={onClear}>
        Clear Selection
      </Button>
    </div>
  );
}

