import { useEffect, useMemo, useState } from "react";
import { ChevronRightIcon } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
  sortCases,
  type Case,
  type Severity,
  type Verdict,
  type Status,
  type Source,
} from "./data";
import { SeverityChip, StatusPill, statusLabel, verdictLabel } from "./badges";
import { SourceIcons, sourceLabel } from "./SourceIcons";
import { FilterDropdown } from "./FilterDropdown";
import { QuickActionPanel } from "./QuickActionPanel";
import { BulkActionBar } from "./BulkActionBar";
import { Tip } from "./Tip";

const columnHelp: Record<string, string> = {
  Signal: "AI-assessed severity — open the row for the verdict and more detail",
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

const PAGE_SIZE = 15;

export function CasesQueue({
  severityFilter,
  onOpenFullCase,
}: {
  severityFilter: Severity | "all";
  onOpenFullCase: (c: Case) => void;
}) {
  const [verdictFilter, setVerdictFilter] = useState<Set<Verdict>>(new Set());
  const [statusFilter, setStatusFilter] = useState<Set<Status>>(new Set());
  const [sourceFilter, setSourceFilter] = useState<Set<Source>>(new Set());
  const [assigneeFilter, setAssigneeFilter] = useState<Set<string>>(new Set());
  const [page, setPage] = useState(1);
  const [openPanelId, setOpenPanelId] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

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

  // Severity is now selected from the sidebar, outside this
  // component, so reset pagination whenever it changes rather than
  // only when a local handler drives it.
  useEffect(() => {
    setPage(1);
  }, [severityFilter]);

  function withReset<T>(setter: (v: Set<T>) => void) {
    return (v: Set<T>) => {
      setter(v);
      setPage(1);
    };
  }

  function toggleRow(id: string) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  const allPageSelected = pageRows.length > 0 && pageRows.every((c) => selectedIds.has(c.id));

  function toggleAllOnPage() {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (allPageSelected) {
        pageRows.forEach((c) => next.delete(c.id));
      } else {
        pageRows.forEach((c) => next.add(c.id));
      }
      return next;
    });
  }

  const selectedCases = cases.filter((c) => selectedIds.has(c.id));

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-lg border bg-card">
      {/* Severity is filtered from the Cases sub-nav in the sidebar
          now, so this row is just the lower-weight filters (or the
          bulk action bar when rows are selected), flush at the top. */}
      {selectedCases.length > 0 ? (
        <BulkActionBar
          selectedCases={selectedCases}
          onResolve={() => setSelectedIds(new Set())}
          onAssignToMe={() => setSelectedIds(new Set())}
          onClear={() => setSelectedIds(new Set())}
        />
      ) : (
        <div className="flex flex-wrap items-center gap-2 border-b p-2 px-3">
          <FilterDropdown label="Verdict" options={verdictOptions} selected={verdictFilter} onChange={withReset(setVerdictFilter)} />
          <FilterDropdown label="Status" options={statusOptions} selected={statusFilter} onChange={withReset(setStatusFilter)} />
          <FilterDropdown label="Source" options={sourceOptions} selected={sourceFilter} onChange={withReset(setSourceFilter)} />
          <FilterDropdown label="Assignee" options={assigneeOptions} selected={assigneeFilter} onChange={withReset(setAssigneeFilter)} />
          <span className="ml-auto text-[11px] text-muted-foreground">
            sorted by severity, then needs review, then recency
          </span>
        </div>
      )}

      <div className="flex-1 overflow-y-auto">
        <Table className="table-fixed">
          <TableHeader className="sticky top-0 z-10 bg-muted">
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-8">
                <Tip label="Select all on page">
                  <input
                    type="checkbox"
                    aria-label="Select all on page"
                    checked={allPageSelected}
                    onChange={toggleAllOnPage}
                  />
                </Tip>
              </TableHead>
              {(
                [
                  ["Signal", "w-28"],
                  ["Case", "min-w-40"],
                  ["Entity", "w-52"],
                  ["Sources", "w-20"],
                  ["Status", "w-28"],
                  ["Updated", "w-16"],
                ] as const
              ).map(([col, width]) => (
                <TableHead key={col} className={width}>
                  <Tip label={columnHelp[col]}>
                    <span className="cursor-default">{col}</span>
                  </Tip>
                </TableHead>
              ))}
              <TableHead className="w-8"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pageRows.map((c) => (
              <TableRow
                key={c.id}
                className="group cursor-pointer"
                data-selected={selectedIds.has(c.id)}
                onClick={() => onOpenFullCase(c)}
              >
                <TableCell onClick={(e) => e.stopPropagation()}>
                  <Tip label="Select case">
                    <input
                      type="checkbox"
                      aria-label={`Select ${c.id}`}
                      checked={selectedIds.has(c.id)}
                      onChange={() => toggleRow(c.id)}
                    />
                  </Tip>
                </TableCell>
                <TableCell>
                  <SeverityChip severity={c.severity} />
                </TableCell>
                <TableCell className="truncate font-medium">{c.title}</TableCell>
                <TableCell className="truncate text-muted-foreground">{c.entity}</TableCell>
                <TableCell>
                  <SourceIcons sources={c.sources} />
                </TableCell>
                <TableCell>
                  <StatusPill status={c.status} />
                </TableCell>
                <TableCell className="text-muted-foreground">{c.updated}</TableCell>
                <TableCell onClick={(e) => e.stopPropagation()}>
                  <Popover
                    open={openPanelId === c.id}
                    onOpenChange={(open) => setOpenPanelId(open ? c.id : null)}
                  >
                    <Tip label="Quick actions">
                      <PopoverTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          aria-label={`Quick actions for ${c.id}`}
                          className={
                            openPanelId === c.id
                              ? "opacity-100"
                              : "opacity-0 focus-visible:opacity-100 group-hover:opacity-100"
                          }
                        >
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
                <TableCell colSpan={8} className="h-24 text-center text-sm text-muted-foreground">
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
