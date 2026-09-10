import { useEffect, useState } from "react";
import { BotIcon, CheckIcon, CircleHelpIcon, XIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { SeverityChip, VerdictBadge, severityLabel } from "./badges";
import { SourceIcon, sourceLabel } from "./SourceIcons";
import type { Case, Severity } from "./data";
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

const severityOrder: Severity[] = ["critical", "high", "medium", "low"];

// Banner background/border/text per severity, built from the same
// semantic tokens the queue's severity chips use, so the two stay
// visually consistent.
const bannerClass: Record<Severity, string> = {
  critical:
    "bg-[var(--severity-critical-bg)] border-[var(--severity-critical-border)] text-[var(--severity-critical-text)]",
  high: "bg-[var(--severity-high-bg)] border-[var(--severity-high-border)] text-[var(--severity-high-text)]",
  medium:
    "bg-[var(--severity-medium-bg)] border-[var(--severity-medium-border)] text-[var(--severity-medium-text)]",
  low: "bg-[var(--severity-low-bg)] border-[var(--severity-low-border)] text-[var(--severity-low-text)]",
};

const sectionHelp: Record<string, string> = {
  Summary: "AI-generated narrative of what happened, built from evidence correlated across sources.",
  "Severity And Verdict Reasoning": "Why the AI assigned this severity and this verdict, in its own words.",
  Findings: "The individual detections that fired and were grouped into this case.",
  Entities: "The users, hosts, and service accounts involved in this case.",
  Observables: "IPs, domains, and hashes seen in this case, enriched with threat intel.",
  "Sources And MITRE ATT&CK": "The connected systems evidence came from, and the attacker techniques this case maps to.",
  Timeline: "The incident's own chronology - the sequence of events across sources that led to this case.",
  Activity: "This case's management history - comments and status changes by analysts and the AI agent.",
  Actions: "Confirm or override the AI's verdict, and see who owns this case.",
  "Response Guidance": "Recommended response actions. Each requires an explicit approve or reject.",
};

function SectionHeader({ label, action }: { label: string; action?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between border-b px-3 py-2">
      <span className="text-xs font-semibold text-foreground">{label}</span>
      <div className="flex items-center gap-1.5">
        {action}
        {sectionHelp[label] && (
          <Tip label={sectionHelp[label]}>
            <CircleHelpIcon className="size-3.5 shrink-0 cursor-help text-muted-foreground" />
          </Tip>
        )}
      </div>
    </div>
  );
}

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
      <SectionHeader label={label} action={action} />
      <div className="p-3">{children}</div>
    </div>
  );
}

// Vertical connecting line with a dot per entry - shared by both
// Timeline (the incident's own clock) and Activity (the case's paper
// trail), each still visually distinct via their own leading icon.
function TimelineList({ items }: { items: { key: string; time: string; content: React.ReactNode; icon?: React.ReactNode }[] }) {
  return (
    <div className="flex flex-col">
      {items.map((item, i) => (
        <div key={item.key} className="relative flex gap-3">
          <div className="flex flex-col items-center">
            {item.icon ?? <span className="mt-1 size-2 shrink-0 rounded-full border-2 border-primary bg-card" />}
            {i < items.length - 1 && <span className="w-px flex-1 bg-border" />}
          </div>
          <div className={`min-w-0 text-xs ${i < items.length - 1 ? "pb-3" : ""}`}>
            <span className="text-muted-foreground">{item.time}</span> {item.content}
          </div>
        </div>
      ))}
    </div>
  );
}

// Highlights email addresses inside the AI summary as clickable
// mentions - hovering surfaces a small contact card rather than
// sending the analyst away from the page to look someone up.
function HighlightedSummary({ text, entities }: { text: string; entities: Case["entities"] }) {
  const emailRe = /[\w.+-]+@[\w-]+\.[\w.-]+/g;
  const parts = text.split(emailRe);
  const matches = text.match(emailRe) ?? [];

  return (
    <p className="text-sm leading-relaxed">
      {parts.map((part, i) => (
        <span key={i}>
          {part}
          {matches[i] && <EntityMention email={matches[i]} entities={entities} />}
        </span>
      ))}
    </p>
  );
}

function EntityMention({ email, entities }: { email: string; entities: Case["entities"] }) {
  const entity = entities?.find((e) => e.name === email);
  const name = email
    .split("@")[0]
    .split(/[._]/)
    .map((p) => p[0]?.toUpperCase() + p.slice(1))
    .join(" ");

  return (
    <HoverCard openDelay={150}>
      <HoverCardTrigger asChild>
        <button
          type="button"
          className="font-medium text-primary underline decoration-primary/40 decoration-dotted underline-offset-2 hover:decoration-solid"
        >
          {email}
        </button>
      </HoverCardTrigger>
      <HoverCardContent className="w-64">
        <div className="flex items-start gap-2.5">
          <Avatar className="size-8">
            <AvatarFallback className="text-xs">
              {name
                .split(" ")
                .map((p) => p[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <div className="text-sm font-medium">{name}</div>
            <div className="truncate text-xs text-muted-foreground">{email}</div>
            {entity && (
              <Badge variant="outline" className="mt-1">
                {entity.type}
              </Badge>
            )}
          </div>
        </div>
        <Separator className="my-2.5" />
        <div className="flex gap-1.5">
          <Button size="sm" variant="outline" className="flex-1">
            View Profile
          </Button>
          <Button size="sm" variant="outline" className="flex-1">
            Message
          </Button>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}

type VerdictAction = "idle" | "overriding" | "confirmed" | "overridden";
type GuidanceStatus = "pending" | "approved" | "rejected";

export function CaseDetail({ caseItem, onBack }: { caseItem: Case; onBack: () => void }) {
  const hasDetail = Boolean(caseItem.summary);

  const [verdictAction, setVerdictAction] = useState<VerdictAction>("idle");
  const [overrideSeverity, setOverrideSeverity] = useState<Severity>(caseItem.severity);
  const [overrideReason, setOverrideReason] = useState("");
  const [guidanceStatus, setGuidanceStatus] = useState<Record<number, GuidanceStatus>>({});

  // Reset the local review state whenever a different case is opened,
  // so leftover "confirmed" / "overriding" state doesn't leak across
  // cases in this single long-lived component instance.
  useEffect(() => {
    setVerdictAction("idle");
    setOverrideSeverity(caseItem.severity);
    setOverrideReason("");
    setGuidanceStatus({});
  }, [caseItem.id]);

  function setGuidance(i: number, status: GuidanceStatus) {
    setGuidanceStatus((prev) => ({ ...prev, [i]: status }));
  }

  return (
    <div className="mx-auto w-full max-w-[1400px] p-6">
      <Button variant="ghost" size="sm" className="mb-3" onClick={onBack}>
        ← Back To Queue
      </Button>

      {/* Header detached from the content below it, colored to match
          the case's severity so the banner itself carries the signal
          rather than relying only on the chip inside it. */}
      <div className={`mb-3 rounded-[2px] border p-4 ${bannerClass[caseItem.severity]}`}>
        <div className="mb-1.5 flex items-center gap-2">
          <SeverityChip severity={caseItem.severity} />
          <VerdictBadge verdict={caseItem.verdict} />
          <span className="ml-auto text-xs opacity-70">
            {caseItem.id} · {statusLabel[caseItem.status]}
          </span>
        </div>
        <div className="text-lg font-medium">{caseItem.title}</div>
      </div>

      <div className="flex flex-col gap-3 lg:flex-row">
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
            {caseItem.summary ? (
              <HighlightedSummary text={caseItem.summary} entities={caseItem.entities} />
            ) : (
              <p className="text-sm leading-relaxed text-muted-foreground">
                No AI summary available for this case in the prototype.
              </p>
            )}
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
            <TimelineList
              items={
                caseItem.timeline?.map((t, i) => ({
                  key: `t-${i}`,
                  time: t.time,
                  content: t.text,
                })) ?? []
              }
            />
          </Section>

          <Section label="Activity">
            <TimelineList
              items={
                caseItem.activity?.map((a, i) => ({
                  key: `a-${i}`,
                  time: a.time,
                  content: a.text,
                  icon: a.isAgent ? (
                    <Tip label="AI agent">
                      <span className="z-10 flex size-4 shrink-0 items-center justify-center rounded-full bg-muted">
                        <BotIcon className="size-2.5 text-muted-foreground" />
                      </span>
                    </Tip>
                  ) : (
                    <Tip label={a.actor}>
                      <Avatar className="z-10 size-4 shrink-0">
                        <AvatarFallback className="text-[8px]">
                          {a.actor
                            .split(" ")
                            .map((p) => p[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                    </Tip>
                  ),
                })) ?? []
              }
            />
          </Section>
        </div>

        {/* Sidebar - a single, clearly-headed "Actions" panel leads
            (verdict decision + workflow context), then the
            higher-stakes response guidance gets its own emphasized
            panel below, with metadata last and most muted. */}
        <div className="flex w-full flex-col gap-3 lg:w-72 lg:flex-none">
          <div className="overflow-hidden rounded-[2px] border border-primary/30">
            <div className="flex items-center justify-between border-b border-primary/30 bg-primary px-3 py-2">
              <span className="text-xs font-semibold text-primary-foreground">Actions</span>
              <Tip label={sectionHelp.Actions}>
                <CircleHelpIcon className="size-3.5 shrink-0 cursor-help text-primary-foreground/70" />
              </Tip>
            </div>
            <div className="flex flex-col gap-3 p-3">
              <div>
                <div className="mb-1.5 text-[11px] text-muted-foreground">Verdict</div>

                {verdictAction === "idle" && (
                  <div className="flex flex-col gap-1.5">
                    <Button
                      size="sm"
                      className="bg-blue-600 text-white hover:bg-blue-700"
                      onClick={() => setVerdictAction("confirmed")}
                    >
                      Confirm
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => setVerdictAction("overriding")}>
                      Override
                    </Button>
                  </div>
                )}

                {verdictAction === "overriding" && (
                  <div className="flex flex-col gap-2 rounded-[2px] border border-border bg-muted/40 p-2.5">
                    <div>
                      <div className="mb-1 text-[11px] text-muted-foreground">New severity</div>
                      <Select
                        value={overrideSeverity}
                        onValueChange={(v) => setOverrideSeverity(v as Severity)}
                      >
                        <SelectTrigger size="sm" className="w-full bg-background">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {severityOrder.map((s) => (
                            <SelectItem key={s} value={s}>
                              {severityLabel[s]}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <div className="mb-1 text-[11px] text-muted-foreground">Reasoning</div>
                      <Textarea
                        value={overrideReason}
                        onChange={(e) => setOverrideReason(e.target.value)}
                        placeholder="Why are you overriding this verdict?"
                        className="min-h-16 bg-background text-xs"
                      />
                    </div>
                    <div className="flex gap-1.5">
                      <Button
                        size="sm"
                        className="flex-1 bg-blue-600 text-white hover:bg-blue-700"
                        disabled={!overrideReason.trim()}
                        onClick={() => setVerdictAction("overridden")}
                      >
                        Confirm Override
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => setVerdictAction("idle")}>
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}

                {verdictAction === "confirmed" && (
                  <div className="flex items-start gap-2 rounded-[2px] border border-[var(--success-border)] bg-[var(--success-bg)] p-2.5 text-xs text-[var(--success-text)]">
                    <CheckIcon className="mt-0.5 size-3.5 shrink-0" />
                    <span>Verdict confirmed. This case is marked reviewed.</span>
                  </div>
                )}

                {verdictAction === "overridden" && (
                  <div className="flex flex-col gap-1 rounded-[2px] border border-[var(--success-border)] bg-[var(--success-bg)] p-2.5 text-xs text-[var(--success-text)]">
                    <div className="flex items-start gap-2">
                      <CheckIcon className="mt-0.5 size-3.5 shrink-0" />
                      <span>Severity overridden to {severityLabel[overrideSeverity]}.</span>
                    </div>
                    <span className="pl-5.5 text-[var(--success-text)]/80">“{overrideReason}”</span>
                  </div>
                )}
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
            <div className="flex items-center justify-between border-b border-destructive/40 bg-destructive/10 px-3 py-2">
              <span className="text-xs font-semibold text-destructive">Response Guidance</span>
              <Tip label={sectionHelp["Response Guidance"]}>
                <CircleHelpIcon className="size-3.5 shrink-0 cursor-help text-destructive/70" />
              </Tip>
            </div>
            <div className="flex flex-col gap-3 p-3">
              {caseItem.responseGuidance?.length ? (
                caseItem.responseGuidance.map((r, i) => {
                  const status = guidanceStatus[i] ?? "pending";
                  return (
                    <div key={i}>
                      <div className="mb-1 text-xs">{r.text}</div>
                      {status === "pending" && (
                        <div className="flex gap-1.5">
                          <Button
                            size="sm"
                            variant="outline"
                            className="flex-1"
                            onClick={() => setGuidance(i, "approved")}
                          >
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="flex-1 text-destructive hover:bg-destructive/10 hover:text-destructive"
                            onClick={() => setGuidance(i, "rejected")}
                          >
                            Reject
                          </Button>
                        </div>
                      )}
                      {status === "approved" && (
                        <div className="flex items-center gap-1.5 rounded-[2px] border border-[var(--success-border)] bg-[var(--success-bg)] px-2 py-1 text-[11px] text-[var(--success-text)]">
                          <CheckIcon className="size-3 shrink-0" />
                          Approved
                        </div>
                      )}
                      {status === "rejected" && (
                        <div className="flex items-center gap-1.5 rounded-[2px] border border-border bg-muted px-2 py-1 text-[11px] text-muted-foreground">
                          <XIcon className="size-3 shrink-0" />
                          Rejected
                        </div>
                      )}
                    </div>
                  );
                })
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
  );
}
