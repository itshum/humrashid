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
import type { Severity, Status, Verdict } from "./data";

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

export const statusLabel: Record<Status, string> = {
  open: "Open",
  in_progress: "In Progress",
  resolved: "Resolved",
  false_positive: "False Positive",
};

// Deliberately a plainer, lighter-weight style than the severity chip
// (no fill, no icon) - status is workflow bookkeeping, not signal, and
// shouldn't compete visually with severity/verdict for attention.
const statusClass: Record<Status, string> = {
  open: "border-sky-300 text-sky-700 dark:border-sky-800 dark:text-sky-400",
  in_progress: "border-amber-300 text-amber-700 dark:border-amber-800 dark:text-amber-400",
  resolved: "border-emerald-300 text-emerald-700 dark:border-emerald-800 dark:text-emerald-400",
  false_positive: "border-border text-muted-foreground",
};

export function StatusPill({ status }: { status: Status }) {
  return (
    <Badge variant="outline" className={statusClass[status]}>
      {statusLabel[status]}
    </Badge>
  );
}
