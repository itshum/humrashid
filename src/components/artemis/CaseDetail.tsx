import { BotIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { SeverityChip, VerdictBadge } from "./badges";
import { SourceIcon } from "./SourceIcons";
import type { Case } from "./data";

const statusLabel: Record<Case["status"], string> = {
  open: "open",
  in_progress: "in progress",
  resolved: "resolved",
  false_positive: "false positive",
};

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <Card>
      <CardContent className="flex flex-col gap-2">
        <div className="text-[11px] text-muted-foreground">{label}</div>
        {children}
      </CardContent>
    </Card>
  );
}

export function CaseDetail({ caseItem, onBack }: { caseItem: Case; onBack: () => void }) {
  const hasDetail = Boolean(caseItem.summary);

  return (
    <div className="mx-auto max-w-4xl p-6">
      <Button variant="ghost" size="sm" className="mb-3" onClick={onBack}>
        ← back to queue
      </Button>

      <div className="overflow-hidden rounded-xl border">
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

        <div className="flex flex-col gap-3 bg-muted/10 p-4 md:flex-row">
          {/* Main column */}
          <div className="flex min-w-0 flex-1 flex-col gap-3">
            {!hasDetail && (
              <Card>
                <CardContent className="text-xs text-muted-foreground">
                  This prototype only has full investigation detail seeded for case-8841.
                </CardContent>
              </Card>
            )}

            <Section label="summary">
              <p className="text-sm leading-relaxed">
                {caseItem.summary ?? "No AI summary available for this case in the prototype."}
              </p>
            </Section>

            <Card>
              <CardContent className="flex flex-col gap-2">
                <div>
                  <span className="text-[11px] text-muted-foreground">why this severity </span>
                  <span className="text-xs leading-relaxed text-muted-foreground">
                    {caseItem.whySeverity ?? "—"}
                  </span>
                </div>
                <Separator />
                <div>
                  <span className="text-[11px] text-muted-foreground">why this verdict </span>
                  <span className="text-xs leading-relaxed text-muted-foreground">
                    {caseItem.whyVerdict ?? "—"}
                  </span>
                </div>
              </CardContent>
            </Card>

            <Section label={`findings · ${caseItem.findings?.length ?? 0}`}>
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
                <Section label="entities">
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
                <Section label="observables">
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

            <Section label="sources, mitre att&ck">
              <div className="flex flex-wrap gap-1.5">
                {caseItem.sources.map((s) => (
                  <Badge key={s} variant="outline" className="gap-1">
                    <SourceIcon source={s} />
                    {s}
                  </Badge>
                ))}
                {caseItem.mitre?.map((m) => (
                  <Badge key={m} variant="outline">
                    {m}
                  </Badge>
                ))}
              </div>
            </Section>

            <Section label="timeline">
              <div className="flex flex-col gap-1.5 text-xs">
                {caseItem.timeline?.map((t, i) => (
                  <div key={i}>
                    <span className="text-muted-foreground">{t.time}</span> {t.text}
                  </div>
                ))}
              </div>
            </Section>

            <Section label="activity">
              <div className="flex flex-col gap-2 text-xs">
                {caseItem.activity?.map((a, i) => (
                  <div key={i} className="flex items-start gap-2">
                    {a.isAgent ? (
                      <BotIcon className="mt-0.5 size-3.5 shrink-0 text-muted-foreground" />
                    ) : (
                      <Avatar className="size-4 shrink-0">
                        <AvatarFallback className="text-[8px]">
                          {a.actor
                            .split(" ")
                            .map((p) => p[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                    )}
                    <span>
                      {a.text} <span className="text-muted-foreground">· {a.time}</span>
                    </span>
                  </div>
                ))}
              </div>
            </Section>
          </div>

          {/* Sidebar */}
          <div className="flex w-full flex-col gap-3 md:w-48 md:flex-none">
            <Section label="verdict">
              <div className="flex flex-col gap-1.5">
                <Button size="sm">Confirm</Button>
                <Button size="sm" variant="outline">
                  Override
                </Button>
              </div>
            </Section>

            <Card>
              <CardContent className="flex flex-col gap-2">
                <div>
                  <div className="text-[11px] text-muted-foreground">status</div>
                  <div className="text-xs">{statusLabel[caseItem.status]}</div>
                </div>
                <div>
                  <div className="text-[11px] text-muted-foreground">assignee</div>
                  <div className="text-xs">{caseItem.assignee?.name ?? "Unassigned"}</div>
                </div>
              </CardContent>
            </Card>

            <Section label="response guidance">
              <div className="flex flex-col gap-2">
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
            </Section>

            <Card>
              <CardContent className="flex flex-col gap-1 text-[11px] text-muted-foreground">
                <div>created {caseItem.created ?? "—"}</div>
                <div>updated {caseItem.updated}</div>
                <div>closed {caseItem.closed ?? "—"}</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
