import { useMemo, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { cases, severityCounts, severityOrder, sortCases, type Case, type Severity } from "./data";
import { SeverityChip, VerdictBadge } from "./badges";
import { SourceIcons } from "./SourceIcons";
import { AssigneeAvatar } from "./AssigneeAvatar";

const statusLabel: Record<Case["status"], string> = {
  open: "open",
  in_progress: "in progress",
  resolved: "resolved",
  false_positive: "false positive",
};

const secondaryFilters = ["verdict", "status", "source", "assignee"] as const;

export function CasesQueue({ onSelectCase }: { onSelectCase: (c: Case) => void }) {
  const [severityFilter, setSeverityFilter] = useState<Severity | "all">("all");

  const rows = useMemo(() => {
    const filtered =
      severityFilter === "all" ? cases : cases.filter((c) => c.severity === severityFilter);
    return sortCases(filtered);
  }, [severityFilter]);

  return (
    <div className="rounded-xl border bg-card overflow-hidden">
      {/* Primary filter row: severity toggle pills */}
      <div className="flex flex-wrap items-center gap-2 border-b p-3">
        <button
          type="button"
          onClick={() => setSeverityFilter("all")}
          className="focus-visible:outline-none"
        >
          <Badge variant={severityFilter === "all" ? "default" : "outline"} className="cursor-pointer px-3.5 py-1">
            all · {severityCounts.all.toLocaleString()}
          </Badge>
        </button>
        {severityOrder.map((severity) => (
          <button
            key={severity}
            type="button"
            onClick={() => setSeverityFilter(severity)}
            className="focus-visible:outline-none"
          >
            <Badge
              variant={severityFilter === severity ? "default" : "outline"}
              className="cursor-pointer px-3.5 py-1"
            >
              {severity} · {severityCounts[severity].toLocaleString()}
            </Badge>
          </button>
        ))}
      </div>

      {/* Secondary filter row: lower-weight dropdown filters */}
      <div className="flex flex-wrap items-center gap-2 border-b p-2 px-3">
        {secondaryFilters.map((filter) => (
          <button
            key={filter}
            type="button"
            className="rounded-md border px-2.5 py-1 text-[11px] text-muted-foreground hover:bg-muted focus-visible:outline-none"
          >
            {filter} ▾
          </button>
        ))}
        <span className="ml-auto text-[11px] text-muted-foreground">
          sorted by severity, then needs review, then recency
        </span>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-8"></TableHead>
            <TableHead className="w-28">signal</TableHead>
            <TableHead>case</TableHead>
            <TableHead className="w-40">entity</TableHead>
            <TableHead className="w-16">sources</TableHead>
            <TableHead className="w-24">status</TableHead>
            <TableHead className="w-16">updated</TableHead>
            <TableHead className="w-10"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((c) => (
            <TableRow
              key={c.id}
              className="cursor-pointer"
              onClick={() => onSelectCase(c)}
            >
              <TableCell onClick={(e) => e.stopPropagation()}>
                <input type="checkbox" aria-label={`Select ${c.id}`} />
              </TableCell>
              <TableCell>
                <div className="flex flex-col items-start gap-1">
                  <SeverityChip severity={c.severity} />
                  <VerdictBadge verdict={c.verdict} />
                </div>
              </TableCell>
              <TableCell className="max-w-0 truncate font-medium">{c.title}</TableCell>
              <TableCell className="max-w-0 truncate text-muted-foreground">
                {c.entity}
              </TableCell>
              <TableCell>
                <SourceIcons sources={c.sources} />
              </TableCell>
              <TableCell className="text-muted-foreground">{statusLabel[c.status]}</TableCell>
              <TableCell className="text-muted-foreground">{c.updated}</TableCell>
              <TableCell>
                <AssigneeAvatar assignee={c.assignee} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
