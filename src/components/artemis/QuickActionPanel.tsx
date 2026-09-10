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

// Content only - no drawer/overlay chrome. Rendered inside a Popover
// anchored to the row's chevron trigger (see CasesQueue), so it reads
// as a small card that appears from the row rather than a slide-out
// panel taking over the screen.
export function QuickActionPanel({
  caseItem,
  onOpenFullCase,
}: {
  caseItem: Case;
  onOpenFullCase: (c: Case) => void;
}) {
  const actionable = isQuickActionable(caseItem.verdict);

  return (
    <div className="flex flex-col gap-3">
      <div>
        <div className="mb-2">
          <SeverityChip severity={caseItem.severity} />
        </div>
        <div className="text-sm font-medium leading-snug">{caseItem.title}</div>
        <p className="mt-0.5 text-xs text-muted-foreground">
          {caseItem.entity} · {caseItem.sources.join(", ")}
        </p>
      </div>

      {/* Verdict detail lives here, not on the queue row - it's
          information the analyst asks for by opening the panel, not
          something that needs to compete for attention at row level. */}
      <div>
        <div className="mb-1 text-[11px] text-muted-foreground">Verdict</div>
        <VerdictBadge verdict={caseItem.verdict} />
      </div>

      <div className="rounded-md bg-muted p-3 text-xs leading-relaxed text-muted-foreground">
        {reasoningLine(caseItem)}
      </div>

      {actionable && (
        <div className="flex flex-col gap-2">
          <Button size="sm">Resolve</Button>
          <Button size="sm" variant="outline">
            Assign to me
          </Button>
        </div>
      )}

      <div>
        <Separator className="mb-3" />
        <Button
          size="sm"
          variant={actionable ? "ghost" : "default"}
          className="w-full"
          onClick={() => onOpenFullCase(caseItem)}
        >
          Open full case
        </Button>
      </div>
    </div>
  );
}
