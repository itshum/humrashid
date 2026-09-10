import {
  CheckIcon,
  CircleAlertIcon,
  CircleIcon,
  HelpCircleIcon,
  OctagonAlertIcon,
  TriangleAlertIcon,
  XIcon,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { Severity, Verdict } from "./data";

export const severityLabel: Record<Severity, string> = {
  critical: "Critical",
  high: "High",
  medium: "Medium",
  low: "Low",
};

const severityClass: Record<Severity, string> = {
  critical: "border-transparent bg-[var(--severity-critical-bg)] text-[var(--severity-critical-text)]",
  high: "border-transparent bg-[var(--severity-high-bg)] text-[var(--severity-high-text)]",
  medium: "border-[var(--severity-medium-border)] bg-[var(--severity-medium-bg)] text-[var(--severity-medium-text)]",
  low: "border-[var(--severity-low-border)] bg-[var(--severity-low-bg)] text-[var(--severity-low-text)]",
};

const severityIcon: Record<Severity, React.ComponentType<{ className?: string }>> = {
  critical: OctagonAlertIcon,
  high: TriangleAlertIcon,
  medium: CircleAlertIcon,
  low: CircleIcon,
};

export function SeverityChip({ severity }: { severity: Severity }) {
  const Icon = severityIcon[severity];
  return (
    <Badge className={`gap-1 ${severityClass[severity]}`}>
      <Icon className="size-3" />
      {severityLabel[severity]}
    </Badge>
  );
}

export const verdictLabel: Record<Verdict, string> = {
  needs_review: "Needs Review",
  true_positive: "True Positive",
  false_positive: "False Positive",
  benign: "Benign",
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
