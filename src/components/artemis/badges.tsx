import { CheckIcon, HelpCircleIcon, XIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { Severity, Verdict } from "./data";

const severityLabel: Record<Severity, string> = {
  critical: "critical",
  high: "high",
  medium: "medium",
  low: "low",
};

// Placeholder variant mapping only, real severity colors come in the
// polish pass per the design spec's color table.
const severityVariant: Record<Severity, "destructive" | "default" | "secondary" | "outline"> = {
  critical: "destructive",
  high: "default",
  medium: "secondary",
  low: "outline",
};

export function SeverityChip({ severity }: { severity: Severity }) {
  return <Badge variant={severityVariant[severity]}>{severityLabel[severity]}</Badge>;
}

const verdictLabel: Record<Verdict, string> = {
  needs_review: "needs review",
  true_positive: "true positive",
  false_positive: "false positive",
  benign: "benign",
};

const verdictIcon: Record<Verdict, React.ComponentType<{ className?: string }>> = {
  needs_review: HelpCircleIcon,
  true_positive: CheckIcon,
  false_positive: XIcon,
  benign: CheckIcon,
};

export function VerdictBadge({ verdict }: { verdict: Verdict }) {
  const Icon = verdictIcon[verdict];
  return (
    <Badge variant="outline" className="gap-1">
      <Icon className="size-3" />
      {verdictLabel[verdict]}
    </Badge>
  );
}

export function isQuickActionable(verdict: Verdict) {
  return verdict === "false_positive" || verdict === "benign";
}
