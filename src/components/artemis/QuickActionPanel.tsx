import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SeverityChip, VerdictBadge, isQuickActionable } from "./badges";
import type { Case } from "./data";

// One-line reasoning per state, per the spec's "short, not the full AI
// narrative" rule. The prototype only has full case-8841 detail, so a
// short line is synthesized here for whichever row is quick-panel'd.
function reasoningLine(c: Case): string {
  if (c.whyVerdict) return c.whyVerdict;
  if (isQuickActionable(c.verdict)) {
    return "Reviewed against known-good context, no anomaly found.";
  }
  return "AI investigation is still gathering evidence for this case.";
}

export function QuickActionPanel({
  caseItem,
  onOpenChange,
  onOpenFullCase,
}: {
  caseItem: Case | null;
  onOpenChange: (open: boolean) => void;
  onOpenFullCase: (c: Case) => void;
}) {
  const open = caseItem !== null;
  const actionable = caseItem ? isQuickActionable(caseItem.verdict) : false;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent>
        {caseItem && (
          <>
            <SheetHeader>
              <div className="flex items-center gap-1.5">
                <SeverityChip severity={caseItem.severity} />
                <VerdictBadge verdict={caseItem.verdict} />
              </div>
              <SheetTitle>{caseItem.title}</SheetTitle>
              <p className="text-xs text-muted-foreground">
                {caseItem.entity} · {caseItem.sources.join(", ")}
              </p>
            </SheetHeader>

            <div className="px-4">
              <div className="rounded-md bg-muted p-3 text-xs leading-relaxed text-muted-foreground">
                {reasoningLine(caseItem)}
              </div>
            </div>

            {actionable && (
              <div className="flex flex-col gap-2 px-4">
                <Button>Resolve</Button>
                <Button variant="outline">Assign to me</Button>
              </div>
            )}

            <div className="mt-auto px-4 pb-4">
              <Separator className="mb-3" />
              <Button
                variant={actionable ? "ghost" : "default"}
                className="w-full"
                onClick={() => onOpenFullCase(caseItem)}
              >
                Open full case
              </Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
