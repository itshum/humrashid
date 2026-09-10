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
// panel taking over the screen. Every distinct group of information
// gets its own bordered container (1px border, 4px radius, matching
// the base --radius token) so a tight, dense card still reads as
// organized sections rather than one run-on block.
export function QuickActionPanel({
  caseItem,
  onOpenFullCase,
}: {
  caseItem: Case;
  onOpenFullCase: (c: Case) => void;
}) {
  const actionable = isQuickActionable(caseItem.verdict);

  return (
    <div className="flex flex-col gap-2">
      <div className="rounded-lg border p-2.5">
        <div className="text-sm font-medium leading-snug">{caseItem.title}</div>
        <p className="mt-0.5 text-xs text-muted-foreground">
          {caseItem.entity} · {caseItem.sources.join(", ")}
        </p>
      </div>

      {/* Severity and verdict detail live here, not on the queue row -
          this is information the analyst asks for by opening the
          panel, not something that needs to compete at row level. */}
      <div className="flex gap-1.5 rounded-lg border p-2.5">
        <div className="flex-1">
          <div className="mb-1 text-[11px] text-muted-foreground">Severity</div>
          <SeverityChip severity={caseItem.severity} />
        </div>
        <div className="flex-1">
          <div className="mb-1 text-[11px] text-muted-foreground">Verdict</div>
          <VerdictBadge verdict={caseItem.verdict} />
        </div>
      </div>

      <div className="rounded-lg border p-2.5">
        <div className="mb-1 text-[11px] text-muted-foreground">Why This Verdict</div>
        <p className="text-xs leading-relaxed text-muted-foreground">{reasoningLine(caseItem)}</p>
      </div>

      {actionable && (
        <div className="flex flex-col gap-1.5">
          <Button size="sm">Resolve</Button>
          <Button size="sm" variant="outline">
            Assign To Me
          </Button>
        </div>
      )}

      <div>
        <Separator className="mb-2" />
        <Button
          size="sm"
          variant={actionable ? "ghost" : "default"}
          className="w-full"
          onClick={() => onOpenFullCase(caseItem)}
        >
          Open Full Case
        </Button>
      </div>
    </div>
  );
}
