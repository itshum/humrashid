import { CheckIcon, HelpCircleIcon, XIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { Severity, Verdict } from "./data";

const severityLabel: Record<Severity, string> = {
  critical: "critical",
  high: "high",
  medium: "medium",
  low: "low",
};

const severityClass: Record<Severity, string> = {
  critical: "border-transparent bg-[var(--severity-critical-bg)] text-[var(--severity-critical-text)]",
  high: "border-transparent bg-[var(--severity-high-bg)] text-[var(--severity-high-text)]",
  medium: "border-[var(--severity-medium-border)] bg-[var(--severity-medium-bg)] text-[var(--severity-medium-text)]",
  low: "border-[var(--severity-low-border)] bg-[var(--severity-low-bg)] text-[var(--severity-low-text)]",
};

export function SeverityChip({ severity }: { severity: Severity }) {
  return <Badge className={severityClass[severity]}>{severityLabel[severity]}</Badge>;
}

export const verdictLabel: Record<Verdict, string> = {
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
