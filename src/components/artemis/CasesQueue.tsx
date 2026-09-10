import { useMemo, useState } from "react";
import { ChevronRightIcon } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  cases,
  severityCounts,
  severityOrder,
  sortCases,
  type Case,
  type Severity,
  type Verdict,
  type Status,
  type Source,
} from "./data";
import { SeverityChip, VerdictBadge, verdictLabel } from "./badges";
import { SourceIcons, sourceLabel } from "./SourceIcons";
import { AssigneeAvatar } from "./AssigneeAvatar";
import { FilterDropdown } from "./FilterDropdown";
import { QuickActionPanel } from "./QuickActionPanel";
import { Tip } from "./Tip";

const statusLabel: Record<Case["status"], string> = {
  open: "open",
  in_progress: "in progress",
  resolved: "resolved",
  false_positive: "false positive",
};

const columnHelp: Record<string, string> = {
  Signal: "AI-assessed severity, with the verdict below it",
  Case: "AI-generated case title",
  Entity: "Primary user, host, or service account involved",
  Sources: "Connected systems the evidence came from",
  Status: "Case workflow status",
  Updated: "Time since the case last changed",
};

const verdictOptions = Object.entries(verdictLabel).map(([value, label]) => ({
  value: value as Verdict,
  label,
}));
const statusOptions = Object.entries(statusLabel).map(([value, label]) => ({
  value: value as Status,
  label,
}));
const sourceOptions = Object.entries(sourceLabel).map(([value, label]) => ({
  value: value as Source,
  label,
}));
const assigneeOptions = [
  { value: "unassigned", label: "Unassigned" },
  ...Array.from(new Set(cases.filter((c) => c.assignee).map((c) => c.assignee!.name))).map(
    (name) => ({ value: name, label: name })
  ),
];

const PAGE_SIZE = 8;

export function CasesQueue({ onOpenFullCase }: { onOpenFullCase: (c: Case) => void }) {
  const [severityFilter, setSeverityFilter] = useState<Severity | "all">("all");
  const [verdictFilter, setVerdictFilter] = useState<Set<Verdict>>(new Set());
  const [statusFilter, setStatusFilter] = useState<Set<Status>>(new Set());
  const [sourceFilter, setSourceFilter] = useState<Set<Source>>(new Set());
  const [assigneeFilter, setAssigneeFilter] = useState<Set<string>>(new Set());
  const [page, setPage] = useState(1);
  const [openPanelId, setOpenPanelId] = useState<string | null>(null);

  const rows = useMemo(() => {
    const filtered = cases.filter((c) => {
      if (severityFilter !== "all" && c.severity !== severityFilter) return false;
      if (verdictFilter.size > 0 && !verdictFilter.has(c.verdict)) return false;
      if (statusFilter.size > 0 && !statusFilter.has(c.status)) return false;
      if (sourceFilter.size > 0 && !c.sources.some((s) => sourceFilter.has(s))) return false;
      if (assigneeFilter.size > 0) {
        const key = c.assignee ? c.assignee.name : "unassigned";
        if (!assigneeFilter.has(key)) return false;
      }
      return true;
    });
    return sortCases(filtered);
  }, [severityFilter, verdictFilter, statusFilter, sourceFilter, assigneeFilter]);

  const pageCount = Math.max(1, Math.ceil(rows.length / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount);
  const pageRows = rows.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  function selectSeverity(next: Severity | "all") {
    setSeverityFilter(next);
    setPage(1);
  }

  function withReset<T>(setter: (v: Set<T>) => void) {
    return (v: Set<T>) => {
      setter(v);
      setPage(1);
    };
  }

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-xl border bg-card">
      {/* Primary filter row: severity toggle pills */}
      <div className="flex flex-wrap items-center gap-2 border-b p-3">
        <button type="button" onClick={() => selectSeverity("all")} className="focus-visible:outline-none">
          <Badge variant={severityFilter === "all" ? "default" : "outline"} className="cursor-pointer px-3.5 py-1">
            all · {severityCounts.all.toLocaleString()}
          </Badge>
        </button>
        {severityOrder.map((severity) => (
          <button
            key={severity}
            type="button"
            onClick={() => selectSeverity(severity)}
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
        <FilterDropdown label="Verdict" options={verdictOptions} selected={verdictFilter} onChange={withReset(setVerdictFilter)} />
        <FilterDropdown label="Status" options={statusOptions} selected={statusFilter} onChange={withReset(setStatusFilter)} />
        <FilterDropdown label="Source" options={sourceOptions} selected={sourceFilter} onChange={withReset(setSourceFilter)} />
        <FilterDropdown label="Assignee" options={assigneeOptions} selected={assigneeFilter} onChange={withReset(setAssigneeFilter)} />
        <span className="ml-auto text-[11px] text-muted-foreground">
          sorted by severity, then needs review, then recency
        </span>
      </div>

      <div className="flex-1 overflow-y-auto">
        <Table>
          <TableHeader className="sticky top-0 z-10 bg-muted">
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-8"></TableHead>
              {(["Signal", "Case", "Entity", "Sources", "Status", "Updated"] as const).map(
                (col) => (
                  <TableHead key={col} className={col === "Case" ? undefined : "w-24"}>
                    <Tip label={columnHelp[col]}>
                      <span className="cursor-default">{col}</span>
                    </Tip>
                  </TableHead>
                )
              )}
              <TableHead className="w-10"></TableHead>
              <TableHead className="w-8"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pageRows.map((c) => (
              <TableRow key={c.id}>
                <TableCell>
                  <Tip label="Select case">
                    <input type="checkbox" aria-label={`Select ${c.id}`} />
                  </Tip>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col items-start gap-1">
                    <SeverityChip severity={c.severity} />
                    <VerdictBadge verdict={c.verdict} />
                  </div>
                </TableCell>
                <TableCell className="max-w-0 truncate font-medium">{c.title}</TableCell>
                <TableCell className="max-w-0 truncate text-muted-foreground">{c.entity}</TableCell>
                <TableCell>
                  <SourceIcons sources={c.sources} />
                </TableCell>
                <TableCell className="text-muted-foreground">{statusLabel[c.status]}</TableCell>
                <TableCell className="text-muted-foreground">{c.updated}</TableCell>
                <TableCell>
                  <AssigneeAvatar assignee={c.assignee} />
                </TableCell>
                <TableCell>
                  <Popover
                    open={openPanelId === c.id}
                    onOpenChange={(open) => setOpenPanelId(open ? c.id : null)}
                  >
                    <Tip label="Quick actions">
                      <PopoverTrigger asChild>
                        <Button variant="ghost" size="icon-sm" aria-label={`Quick actions for ${c.id}`}>
                          <ChevronRightIcon className="size-4" />
                        </Button>
                      </PopoverTrigger>
                    </Tip>
                    <PopoverContent side="left" align="start" className="w-80">
                      <QuickActionPanel
                        caseItem={c}
                        onOpenFullCase={(caseItem) => {
                          setOpenPanelId(null);
                          onOpenFullCase(caseItem);
                        }}
                      />
                    </PopoverContent>
                  </Popover>
                </TableCell>
              </TableRow>
            ))}
            {pageRows.length === 0 && (
              <TableRow>
                <TableCell colSpan={9} className="h-24 text-center text-sm text-muted-foreground">
                  No cases match these filters
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination footer */}
      <div className="flex items-center justify-between gap-3 border-t p-3">
        <span className="text-[11px] text-muted-foreground">
          {rows.length === 0
            ? "0 cases"
            : `${(currentPage - 1) * PAGE_SIZE + 1}–${Math.min(currentPage * PAGE_SIZE, rows.length)} of ${rows.length.toLocaleString()} cases`}
        </span>
        <Pagination className="mx-0 w-auto">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                className={currentPage === 1 ? "pointer-events-none opacity-40" : "cursor-pointer"}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              />
            </PaginationItem>
            {Array.from({ length: pageCount }, (_, i) => i + 1).map((p) => (
              <PaginationItem key={p}>
                <PaginationLink
                  isActive={p === currentPage}
                  className="cursor-pointer"
                  onClick={() => setPage(p)}
                >
                  {p}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext
                className={currentPage === pageCount ? "pointer-events-none opacity-40" : "cursor-pointer"}
                onClick={() => setPage((p) => Math.min(pageCount, p + 1))}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
}
