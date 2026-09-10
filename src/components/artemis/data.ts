export type Severity = "critical" | "high" | "medium" | "low";
export type Verdict = "needs_review" | "true_positive" | "false_positive" | "benign";
export type Status = "open" | "in_progress" | "resolved" | "false_positive";
export type Source = "aws" | "okta" | "crowdstrike" | "github" | "email";

export interface Finding {
  text: string;
  severity: "critical" | "warning";
}

export interface TimelineEvent {
  time: string;
  text: string;
}

export interface ActivityEntry {
  actor: string;
  isAgent: boolean;
  text: string;
  time: string;
}

export interface ResponseAction {
  text: string;
}

export interface Entity {
  name: string;
  type: string;
}

export interface Observable {
  value: string;
  kind: string;
  detail: string;
}

export interface Case {
  id: string;
  title: string;
  severity: Severity;
  verdict: Verdict;
  status: Status;
  entity: string;
  sources: Source[];
  updated: string;
  assignee: { name: string; initials: string } | null;
  // Detail-only fields (only case-8841 has full data for this prototype)
  summary?: string;
  whySeverity?: string;
  whyVerdict?: string;
  findings?: Finding[];
  entities?: Entity[];
  observables?: Observable[];
  mitre?: string[];
  timeline?: TimelineEvent[];
  activity?: ActivityEntry[];
  responseGuidance?: ResponseAction[];
  created?: string;
  closed?: string;
}

export const cases: Case[] = [
  {
    id: "case-8841",
    title: "CloudTrail logging disabled and audit logs destroyed",
    severity: "critical",
    verdict: "needs_review",
    // The spec's queue-row listing says "open" while its case-8841 detail
    // block says "in progress" (the reference mockup has the same split
    // across its two screens). One Case object backs both views here, so
    // the detail block's value wins as the per-case canonical field.
    status: "in_progress",
    entity: "lisa.wang@co.com",
    sources: ["aws", "okta"],
    updated: "12m",
    assignee: { name: "Jordan Park", initials: "JP" },
    summary:
      "At 03:14 UTC, lisa.wang@co.com disabled CloudTrail logging in the prod account, then deleted six days of audit logs from the S3 log bucket. The action followed a login from an unrecognized device in Vietnam, nine minutes after a failed MFA challenge.",
    whySeverity:
      "Disables the org's primary audit trail in production, removing the ability to investigate what happens next.",
    whyVerdict:
      "A known defense evasion technique. No prior admin history from this region, timing follows a failed MFA prompt.",
    findings: [
      { text: "CloudTrail logging disabled in prod account", severity: "critical" },
      { text: "Audit log objects deleted from S3", severity: "critical" },
      { text: "Login from new device, Hanoi VN", severity: "warning" },
      { text: "MFA challenge failed, then passed", severity: "warning" },
      { text: "Anomalous outbound transfer from EC2 instance", severity: "warning" },
    ],
    entities: [
      { name: "lisa.wang@co.com", type: "user" },
      { name: "i-0a12cd4f", type: "host" },
      { name: "svc-backup-role", type: "service account" },
    ],
    observables: [
      { value: "203.0.113.44", kind: "ip", detail: "Hanoi, VN · first seen 3mo ago" },
      { value: "silvergate-corp.onl", kind: "domain", detail: "registered 2 days ago" },
      { value: "a5f3e1...c9", kind: "hash", detail: "no prior sightings" },
    ],
    mitre: ["T1562.008", "T1070.002"],
    timeline: [
      { time: "03:02", text: "MFA challenge failed" },
      { time: "03:05", text: "MFA challenge passed, new device" },
      { time: "03:14", text: "CloudTrail logging disabled" },
      { time: "03:16", text: "S3 audit log objects deleted" },
      { time: "03:22", text: "Outbound transfer spike from EC2" },
      { time: "03:30", text: "IAM role policy modified" },
    ],
    activity: [
      { actor: "AI agent", isAgent: true, text: "Case opened, severity set to critical", time: "03:15" },
      { actor: "AI agent", isAgent: true, text: "Verdict proposed: needs review", time: "03:15" },
      { actor: "system", isAgent: false, text: "Assigned to Jordan Park", time: "9m ago" },
      { actor: "Jordan Park", isAgent: false, text: "“Escalating to IR channel, this looks real”", time: "4m ago" },
    ],
    responseGuidance: [
      { text: "Disable user lisa.wang" },
      { text: "Block IP 203.0.113.44" },
    ],
    created: "03:14 today",
    closed: "—",
  },
  {
    id: "case-7734",
    title: "Credential compromise via SSO session hijack",
    severity: "critical",
    verdict: "true_positive",
    status: "in_progress",
    entity: "mike.chen@co.com",
    sources: ["okta", "github"],
    updated: "31m",
    assignee: { name: "Jordan Park", initials: "JP" },
  },
  {
    id: "case-6122",
    title: "Brand impersonation domain registered, no clicks yet",
    severity: "high",
    verdict: "needs_review",
    status: "open",
    entity: "org-wide",
    sources: ["email"],
    updated: "1h",
    assignee: null,
  },
  {
    id: "case-5908",
    title: "Unusual repo clone volume by service account",
    severity: "medium",
    verdict: "needs_review",
    status: "open",
    entity: "svc-deploy-bot",
    sources: ["github"],
    updated: "4h",
    assignee: null,
  },
  {
    id: "case-4471",
    title: "New OAuth app authorized by admin",
    severity: "low",
    verdict: "benign",
    status: "resolved",
    entity: "admin@co.com",
    sources: ["okta"],
    updated: "6h",
    assignee: null,
  },
];

export const severityCounts = {
  all: 1842,
  critical: 12,
  high: 64,
  medium: 340,
  low: 1426,
};

export const severityOrder: Severity[] = ["critical", "high", "medium", "low"];

const severityRank: Record<Severity, number> = { critical: 0, high: 1, medium: 2, low: 3 };
const verdictNeedsReviewRank: Record<Verdict, number> = {
  needs_review: 0,
  true_positive: 1,
  false_positive: 1,
  benign: 1,
};

export function sortCases(list: Case[]): Case[] {
  return [...list].sort((a, b) => {
    if (severityRank[a.severity] !== severityRank[b.severity]) {
      return severityRank[a.severity] - severityRank[b.severity];
    }
    if (verdictNeedsReviewRank[a.verdict] !== verdictNeedsReviewRank[b.verdict]) {
      return verdictNeedsReviewRank[a.verdict] - verdictNeedsReviewRank[b.verdict];
    }
    return 0; // already recency-ordered in the seed data
  });
}
