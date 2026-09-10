import { BotIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { SeverityChip, VerdictBadge } from "./badges";
import { SourceIcon, sourceLabel } from "./SourceIcons";
import type { Case } from "./data";
import { Tip } from "./Tip";

const statusLabel: Record<Case["status"], string> = {
  open: "Open",
  in_progress: "In Progress",
  resolved: "Resolved",
  false_positive: "False Positive",
};

const mitreLabel: Record<string, string> = {
  "T1562.008": "Impair defenses: disable or modify cloud logs",
  "T1070.002": "Indicator removal: clear cloud logs",
};

// Every block of information lives inside the same 1px light-grey
// border / 2px radius container, with a bold sentence-case header
// separated by a hairline - modeled on Sublime's MDV layout, where
// every panel is clearly labeled rather than relying on faint muted
// caption text to carry the hierarchy.
function Section({
  label,
  action,
  children,
  className,
}: {
  label: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`rounded-[2px] border border-border bg-card ${className ?? ""}`}>
      <div className="flex items-center justify-between border-b px-3 py-2">
        <span className="text-xs font-semibold text-foreground">{label}</span>
        {action}
      </div>
      <div className="p-3">{children}</div>
    </div>
  );
}

export function CaseDetail({ caseItem, onBack }: { caseItem: Case; onBack: () => void }) {
  const hasDetail = Boolean(caseItem.summary);

  return (
    <div className="mx-auto w-full max-w-[1400px] p-6">
      <Button variant="ghost" size="sm" className="mb-3" onClick={onBack}>
        ← Back To Queue
      </Button>

      <div className="overflow-hidden rounded-[2px] border border-border">
        {/* Banner - severity color mapping deferred to the polish pass */}
        <div className="border-b bg-muted/40 p-4">
          <div className="mb-1.5 flex items-center gap-2">
            <SeverityChip severity={caseItem.severity} />
            <VerdictBadge verdict={caseItem.verdict} />
            <span className="ml-auto text-xs text-muted-foreground">
              {caseItem.id} · {statusLabel[caseItem.status]}
            </span>
          </div>
          <div className="text-base font-medium">{caseItem.title}</div>
        </div>

        <div className="flex flex-col gap-3 bg-muted/10 p-4 lg:flex-row">
          {/* Main column - ordered by what the analyst needs to judge
              first (what happened, do I believe it, what's the
              evidence) before purely record-keeping content (timeline,
              activity) at the bottom. */}
          <div className="flex min-w-0 flex-1 flex-col gap-3">
            {!hasDetail && (
              <div className="rounded-[2px] border border-border bg-card p-3 text-xs text-muted-foreground">
                This prototype only has full investigation detail seeded for case-8841.
              </div>
            )}

            <Section label="Summary">
              <p className="text-sm leading-relaxed">
                {caseItem.summary ?? "No AI summary available for this case in the prototype."}
              </p>
            </Section>

            <Section label="Severity And Verdict Reasoning">
              <div className="flex flex-col gap-2">
                <div>
                  <span className="text-[11px] text-muted-foreground">Why this severity </span>
                  <span className="text-xs leading-relaxed text-muted-foreground">
                    {caseItem.whySeverity ?? "—"}
                  </span>
                </div>
                <Separator />
                <div>
                  <span className="text-[11px] text-muted-foreground">Why this verdict </span>
                  <span className="text-xs leading-relaxed text-muted-foreground">
                    {caseItem.whyVerdict ?? "—"}
                  </span>
                </div>
              </div>
            </Section>

            <Section label="Findings" action={<Badge variant="secondary">{caseItem.findings?.length ?? 0}</Badge>}>
              <div className="flex flex-col gap-1.5">
                {caseItem.findings?.map((f, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs">
                    <span
                      className={`mt-1 size-1.5 shrink-0 rounded-full ${
                        f.severity === "critical" ? "bg-destructive" : "bg-muted-foreground"
                      }`}
                    />
                    <span>{f.text}</span>
                  </div>
                ))}
              </div>
            </Section>

            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="flex-1">
                <Section label="Entities">
                  <div className="flex flex-col gap-1.5 text-xs">
                    {caseItem.entities?.map((e) => (
                      <div key={e.name} className="flex items-center justify-between">
                        <span>{e.name}</span>
                        <span className="text-muted-foreground">{e.type}</span>
                      </div>
                    ))}
                  </div>
                </Section>
              </div>
              <div className="flex-1">
                <Section label="Observables">
                  <div className="flex flex-col gap-1.5 text-xs">
                    {caseItem.observables?.map((o) => (
                      <div key={o.value}>
                        {o.value} <span className="text-muted-foreground">· {o.detail}</span>
                      </div>
                    ))}
                  </div>
                </Section>
              </div>
            </div>

            <Section label="Sources And MITRE ATT&CK">
              <div className="flex flex-wrap gap-1.5">
                {caseItem.sources.map((s) => (
                  <Tip key={s} label={sourceLabel[s]}>
                    <Badge variant="outline" className="gap-1">
                      <SourceIcon source={s} />
                      {s}
                    </Badge>
                  </Tip>
                ))}
                {caseItem.mitre?.map((m) => (
                  <Tip key={m} label={mitreLabel[m] ?? "MITRE ATT&CK technique"}>
                    <Badge variant="outline">{m}</Badge>
                  </Tip>
                ))}
              </div>
            </Section>

            <Section label="Timeline">
              <div className="flex flex-col gap-1.5 text-xs">
                {caseItem.timeline?.map((t, i) => (
                  <div key={i}>
                    <span className="text-muted-foreground">{t.time}</span> {t.text}
                  </div>
                ))}
              </div>
            </Section>

            <Section label="Activity">
              <div className="flex flex-col gap-2 text-xs">
                {caseItem.activity?.map((a, i) => (
                  <div key={i} className="flex items-start gap-2">
                    {a.isAgent ? (
                      <Tip label="AI agent">
                        <BotIcon className="mt-0.5 size-3.5 shrink-0 text-muted-foreground" />
                      </Tip>
                    ) : (
                      <Tip label={a.actor}>
                        <Avatar className="size-4 shrink-0">
                          <AvatarFallback className="text-[8px]">
                            {a.actor
                              .split(" ")
                              .map((p) => p[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                      </Tip>
                    )}
                    <span>
                      {a.text} <span className="text-muted-foreground">· {a.time}</span>
                    </span>
                  </div>
                ))}
              </div>
            </Section>
          </div>

          {/* Sidebar - a single, clearly-headed "Actions" panel leads
              (verdict decision + workflow context), then the
              higher-stakes response guidance gets its own emphasized
              panel below, with metadata last and most muted. Modeled
              on Sublime MDV's "Review Status" panel: one bold header,
              the decision controls, then supporting context grouped
              underneath it rather than scattered across equal-weight
              cards. */}
          <div className="flex w-full flex-col gap-3 lg:w-64 lg:flex-none">
            <div className="overflow-hidden rounded-[2px] border border-primary/30">
              <div className="border-b border-primary/30 bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground">
                Actions
              </div>
              <div className="flex flex-col gap-3 p-3">
                <div>
                  <div className="mb-1.5 text-[11px] text-muted-foreground">Verdict</div>
                  <div className="flex flex-col gap-1.5">
                    <Button size="sm">Confirm</Button>
                    <Button size="sm" variant="outline">
                      Override
                    </Button>
                  </div>
                </div>
                <Separator />
                <div className="flex gap-4">
                  <div className="flex-1">
                    <div className="text-[11px] text-muted-foreground">Status</div>
                    <div className="text-xs font-medium">{statusLabel[caseItem.status]}</div>
                  </div>
                  <div className="flex-1">
                    <div className="text-[11px] text-muted-foreground">Assignee</div>
                    <div className="text-xs font-medium">{caseItem.assignee?.name ?? "Unassigned"}</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="overflow-hidden rounded-[2px] border border-destructive/40">
              <div className="border-b border-destructive/40 bg-destructive/10 px-3 py-2 text-xs font-semibold text-destructive">
                Response Guidance
              </div>
              <div className="flex flex-col gap-2 p-3">
                {caseItem.responseGuidance?.length ? (
                  caseItem.responseGuidance.map((r, i) => (
                    <div key={i}>
                      <div className="mb-1 text-xs">{r.text}</div>
                      <Button size="sm" variant="outline" className="w-full">
                        Approve
                      </Button>
                    </div>
                  ))
                ) : (
                  <span className="text-xs text-muted-foreground">No actions recommended</span>
                )}
              </div>
            </div>

            <div className="rounded-[2px] border border-border bg-card p-3">
              <div className="flex flex-col gap-1 text-[11px] text-muted-foreground">
                <div>Created {caseItem.created ?? "—"}</div>
                <div>Updated {caseItem.updated}</div>
                <div>Closed {caseItem.closed ?? "—"}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
