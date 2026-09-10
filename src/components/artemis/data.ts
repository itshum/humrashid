export type Severity = "critical" | "high" | "medium" | "low";
export type Verdict = "needs_review" | "true_positive" | "false_positive" | "benign";
export type Status = "open" | "in_progress" | "resolved" | "false_positive";
export type Source = "aws" | "okta" | "crowdstrike" | "github" | "email" | "slack";

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
    summary:
      "The Okta session token for mike.chen@co.com was replayed from a new IP nine minutes after a legitimate login, then used to authorize a new GitHub OAuth grant.",
    whySeverity:
      "Session hijacking gives the attacker standing access without needing credentials again, and the compromised session already touched source control.",
    whyVerdict:
      "Session token reuse from a second IP within the token's short validity window is not explainable by normal user behavior.",
    findings: [
      { text: "Okta session token replayed from new IP", severity: "critical" },
      { text: "New GitHub OAuth grant authorized from hijacked session", severity: "critical" },
      { text: "Original session showed normal activity, no phishing page visited", severity: "warning" },
    ],
    entities: [
      { name: "mike.chen@co.com", type: "user" },
      { name: "ci-bot-github", type: "service account" },
    ],
    observables: [{ value: "198.51.100.12", kind: "ip", detail: "Bucharest, RO · first seen today" }],
    mitre: ["T1550.004", "T1528"],
    timeline: [
      { time: "09:41", text: "Legitimate login, session token issued" },
      { time: "09:50", text: "Session token reused from 198.51.100.12" },
      { time: "09:52", text: "New GitHub OAuth grant authorized" },
      { time: "10:05", text: "Anomaly flagged, session revoked" },
    ],
    activity: [
      { actor: "AI agent", isAgent: true, text: "Case opened, severity set to critical", time: "09:53" },
      { actor: "AI agent", isAgent: true, text: "Verdict proposed: true positive", time: "09:54" },
      { actor: "Jordan Park", isAgent: false, text: "Revoked session, rotating GitHub token", time: "20m ago" },
    ],
    responseGuidance: [
      { text: "Revoke all active sessions for mike.chen" },
      { text: "Rotate compromised GitHub OAuth token" },
    ],
    created: "09:41 today",
    closed: "—",
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
    summary:
      "A newly registered domain mimicking the company's brand was detected serving a phishing-style login page. No employee clicks or credential submissions have been observed yet.",
    whySeverity:
      "Brand impersonation domains are frequently used in follow-up phishing waves; early detection before clicks occur is the narrow window to act.",
    whyVerdict: "Still correlating the domain against outbound click and mail-gateway logs.",
    findings: [
      { text: "Domain cursor-login-secure.com registered 6 hours ago", severity: "warning" },
      { text: "MX records point to a bulk email provider", severity: "warning" },
    ],
    entities: [{ name: "org-wide", type: "organization" }],
    observables: [{ value: "cursor-login-secure.com", kind: "domain", detail: "registered 6h ago · no prior history" }],
    mitre: ["T1583.001"],
    timeline: [
      { time: "1h ago", text: "Domain registration detected via threat intel feed" },
      { time: "1h ago", text: "MX and DNS records enriched" },
      { time: "55m ago", text: "No inbound mail referencing domain seen yet" },
    ],
    activity: [{ actor: "AI agent", isAgent: true, text: "Case opened, severity set to high", time: "1h ago" }],
    responseGuidance: [{ text: "Pre-emptively block domain at the mail gateway" }],
    created: "1h ago",
    closed: "—",
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
    summary:
      "svc-deploy-bot cloned 142 repositories in 55 minutes, well above its typical baseline of 2-3 clones per deploy cycle.",
    whySeverity:
      "Elevated but not yet clearly malicious - bulk cloning could indicate a CI misconfiguration or a compromised token being used to exfiltrate source.",
    whyVerdict: "Still correlating clone volume against recent CI pipeline changes and the token's usage history.",
    findings: [
      { text: "142 repository clones in 55 minutes, vs. 3/day baseline", severity: "warning" },
      { text: "All clones authenticated with the same deploy token", severity: "warning" },
    ],
    entities: [{ name: "svc-deploy-bot", type: "service account" }],
    observables: [{ value: "140.82.121.4", kind: "ip", detail: "GitHub Actions runner range · known" }],
    mitre: ["T1213"],
    timeline: [
      { time: "4h ago", text: "Clone volume crosses baseline threshold" },
      { time: "3h ago", text: "Pattern flagged by anomaly detector" },
      { time: "3h ago", text: "Case opened for review" },
    ],
    activity: [
      { actor: "AI agent", isAgent: true, text: "Case opened, severity set to medium", time: "3h ago" },
      { actor: "AI agent", isAgent: true, text: "Verdict proposed: needs review", time: "3h ago" },
    ],
    responseGuidance: [{ text: "Rotate svc-deploy-bot access token" }],
    created: "4h ago",
    closed: "—",
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
    summary:
      "admin@co.com authorized a new OAuth application (\"TeamCal Sync\") requesting calendar read access. The app is a known, low-risk integration already used by other teams.",
    whySeverity: "Standard-scope OAuth grant by an admin account, no elevated or unusual permissions requested.",
    whyVerdict:
      "The application is already authorized elsewhere in the org with an established trust history, and requested scopes match its stated purpose.",
    findings: [{ text: "OAuth app 'TeamCal Sync' granted calendar.readonly scope", severity: "warning" }],
    entities: [{ name: "admin@co.com", type: "user" }],
    timeline: [
      { time: "6h ago", text: "OAuth consent screen approved by admin@co.com" },
      { time: "6h ago", text: "App added to approved integrations list" },
    ],
    activity: [
      { actor: "AI agent", isAgent: true, text: "Case opened, severity set to low", time: "6h ago" },
      { actor: "AI agent", isAgent: true, text: "Verdict proposed: benign", time: "6h ago" },
      { actor: "system", isAgent: false, text: "Auto-resolved, no analyst action needed", time: "6h ago" },
    ],
    created: "6h ago",
    closed: "6h ago",
  },
  // Additional queue rows, styled after a Cursor-shaped tenant (one of
  // Artemis's real published customers) so the volume and source mix
  // reads like a live AI-native engineering org rather than filler text.
  {
    id: "case-8830",
    title: "Secrets committed to public repository",
    severity: "critical",
    verdict: "true_positive",
    status: "open",
    entity: "priya.raman@cursor.com",
    sources: ["github"],
    updated: "18m",
    assignee: null,
    summary:
      "priya.raman@cursor.com pushed a commit containing a live AWS access key to a public GitHub repository. The key was detected and flagged within 90 seconds of the push.",
    whySeverity:
      "A live cloud credential exposed publicly can be discovered and used by automated scrapers within minutes.",
    whyVerdict:
      "The committed string matches AWS's access key format exactly and was confirmed active against the account.",
    findings: [
      { text: "Live AWS access key committed to public repo", severity: "critical" },
      { text: "Key confirmed active, not yet used externally", severity: "critical" },
    ],
    entities: [
      { name: "priya.raman@cursor.com", type: "user" },
      { name: "cursor-labs/data-pipeline", type: "repository" },
    ],
    observables: [{ value: "AKIA...T3F2", kind: "aws key", detail: "confirmed active" }],
    mitre: ["T1552.001"],
    timeline: [
      { time: "18m ago", text: "Commit pushed with exposed key" },
      { time: "17m ago", text: "Secret scanner flagged the key" },
      { time: "16m ago", text: "Case opened, severity set to critical" },
    ],
    activity: [
      { actor: "AI agent", isAgent: true, text: "Case opened, severity set to critical", time: "16m ago" },
      { actor: "AI agent", isAgent: true, text: "Verdict proposed: true positive", time: "16m ago" },
    ],
    responseGuidance: [
      { text: "Revoke exposed AWS access key immediately" },
      { text: "Purge key from git history" },
    ],
    created: "18m ago",
    closed: "—",
  },
  {
    id: "case-8811",
    title: "Privilege escalation via misconfigured IAM policy",
    severity: "high",
    verdict: "needs_review",
    status: "open",
    entity: "svc-model-trainer",
    sources: ["aws", "crowdstrike"],
    updated: "42m",
    assignee: { name: "Jordan Park", initials: "JP" },
    summary:
      "svc-model-trainer assumed an IAM role with administrator access after a policy change widened its trust relationship beyond the training pipeline it normally runs in.",
    whySeverity:
      "Administrator-level access for a non-human identity meaningfully expands blast radius if the role's credentials are ever exposed.",
    whyVerdict:
      "Correlating the policy change against recent infrastructure-as-code commits to determine if this was an intentional but overly broad change.",
    findings: [
      { text: "IAM policy widened to allow sts:AssumeRole from any principal", severity: "critical" },
      { text: "svc-model-trainer assumed an administrator-scoped role", severity: "warning" },
    ],
    entities: [
      { name: "svc-model-trainer", type: "service account" },
      { name: "i-0f7a22b1", type: "host" },
    ],
    mitre: ["T1078.004"],
    timeline: [
      { time: "58m ago", text: "IAM policy updated via Terraform apply" },
      { time: "46m ago", text: "svc-model-trainer assumed admin role" },
      { time: "42m ago", text: "Anomaly flagged, case opened" },
    ],
    activity: [
      { actor: "AI agent", isAgent: true, text: "Case opened, severity set to high", time: "42m ago" },
      { actor: "Jordan Park", isAgent: false, text: "Reviewing Terraform diff for the policy change", time: "10m ago" },
    ],
    responseGuidance: [{ text: "Revert IAM policy to prior trust boundary" }],
    created: "58m ago",
    closed: "—",
  },
  {
    id: "case-8794",
    title: "Impossible travel login, two regions in nine minutes",
    severity: "high",
    verdict: "false_positive",
    status: "resolved",
    entity: "devon.ng@cursor.com",
    sources: ["okta"],
    updated: "1h",
    assignee: null,
    summary:
      "devon.ng@cursor.com logged in from San Francisco and then from Amsterdam nine minutes later. The Amsterdam login was confirmed to originate from a corporate VPN exit node.",
    whySeverity:
      "Impossible travel is a strong signal on its own, warranting a high initial severity until the travel can be explained.",
    whyVerdict:
      "The Amsterdam IP matches a known corporate VPN egress range this user has used before; no credential or session anomalies were found.",
    findings: [
      { text: "Login from SF, then Amsterdam 9 minutes later", severity: "warning" },
      { text: "Amsterdam IP matches known corporate VPN range", severity: "warning" },
    ],
    entities: [{ name: "devon.ng@cursor.com", type: "user" }],
    observables: [{ value: "198.51.100.77", kind: "ip", detail: "Amsterdam · corporate VPN, previously seen" }],
    timeline: [
      { time: "1h ago", text: "Login from San Francisco" },
      { time: "1h ago", text: "Login from Amsterdam VPN exit" },
      { time: "55m ago", text: "Flagged for impossible travel" },
      { time: "50m ago", text: "Verified as VPN, resolved" },
    ],
    activity: [
      { actor: "AI agent", isAgent: true, text: "Case opened, severity set to high", time: "1h ago" },
      { actor: "AI agent", isAgent: true, text: "Verdict proposed: false positive", time: "55m ago" },
      { actor: "system", isAgent: false, text: "Auto-resolved after VPN verification", time: "50m ago" },
    ],
    created: "1h ago",
    closed: "50m ago",
  },
  {
    id: "case-8772",
    title: "Suspicious OAuth grant requesting full mailbox access",
    severity: "high",
    verdict: "needs_review",
    status: "open",
    entity: "hiring-bot@cursor.com",
    sources: ["okta", "email"],
    updated: "2h",
    assignee: null,
    summary:
      "hiring-bot@cursor.com authorized a third-party OAuth app requesting full read/write access to its mailbox, a broader scope than the app's stated purpose of calendar scheduling.",
    whySeverity:
      "Full mailbox access on a shared recruiting inbox would expose candidate PII and internal hiring communication if the app is malicious or compromised.",
    whyVerdict: "Reviewing the app's publisher verification status against known scheduling-tool OAuth footprints.",
    findings: [
      { text: "OAuth scope requested: mail.readwrite (full mailbox)", severity: "warning" },
      { text: "App publisher is unverified", severity: "warning" },
    ],
    entities: [{ name: "hiring-bot@cursor.com", type: "service account" }],
    mitre: ["T1114.002"],
    timeline: [
      { time: "2h ago", text: "OAuth consent granted" },
      { time: "2h ago", text: "Scope mismatch flagged" },
      { time: "1h ago", text: "Case opened for review" },
    ],
    activity: [{ actor: "AI agent", isAgent: true, text: "Case opened, severity set to high", time: "2h ago" }],
    responseGuidance: [{ text: "Revoke OAuth grant for unverified app" }],
    created: "2h ago",
    closed: "—",
  },
  {
    id: "case-8761",
    title: "Endpoint detection: known malware signature on build host",
    severity: "high",
    verdict: "true_positive",
    status: "in_progress",
    entity: "ci-runner-04",
    sources: ["crowdstrike"],
    updated: "2h",
    assignee: { name: "Sam Osei", initials: "SO" },
    summary:
      "CrowdStrike flagged a known malware signature on ci-runner-04, associated with a supply-chain-style dependency confusion payload pulled during a build.",
    whySeverity:
      "A confirmed malware signature on a CI runner that has access to build secrets and can push artifacts is a serious foothold if left unaddressed.",
    whyVerdict:
      "Signature match confirmed against CrowdStrike's threat intelligence with high confidence; the payload traced to a malicious package published under a name similar to an internal dependency.",
    findings: [
      { text: "Known malware signature detected in build cache", severity: "critical" },
      { text: "Payload traced to typosquatted npm package", severity: "critical" },
    ],
    entities: [{ name: "ci-runner-04", type: "host" }],
    observables: [{ value: "a91f3c...e2", kind: "hash", detail: "matches known dependency-confusion payload" }],
    mitre: ["T1195.001"],
    timeline: [
      { time: "2h ago", text: "Malicious package pulled during build" },
      { time: "2h ago", text: "CrowdStrike signature match" },
      { time: "1h ago", text: "Runner isolated from network" },
    ],
    activity: [
      { actor: "AI agent", isAgent: true, text: "Case opened, severity set to high", time: "2h ago" },
      { actor: "AI agent", isAgent: true, text: "Verdict proposed: true positive", time: "2h ago" },
      { actor: "Sam Osei", isAgent: false, text: "Isolated runner, rotating build secrets", time: "45m ago" },
    ],
    responseGuidance: [
      { text: "Isolate ci-runner-04 from the network" },
      { text: "Rotate all secrets available to the runner" },
    ],
    created: "2h ago",
    closed: "—",
  },
  {
    id: "case-8744",
    title: "Slack webhook posting to unrecognized external endpoint",
    severity: "high",
    verdict: "needs_review",
    status: "open",
    entity: "svc-notify-bot",
    sources: ["slack"],
    updated: "3h",
    assignee: null,
    summary:
      "svc-notify-bot's outgoing webhook was reconfigured to post messages to a URL outside the company's known endpoint list.",
    whySeverity:
      "A hijacked notification webhook could be used to exfiltrate message content or impersonate internal alerts to employees.",
    whyVerdict: "Correlating the configuration change against recent admin activity.",
    findings: [{ text: "Webhook target URL changed to unrecognized domain", severity: "warning" }],
    entities: [{ name: "svc-notify-bot", type: "service account" }],
    observables: [{ value: "hooks.relay-svc.io", kind: "domain", detail: "first seen today" }],
    mitre: ["T1567"],
    timeline: [
      { time: "3h ago", text: "Webhook URL changed" },
      { time: "3h ago", text: "Anomaly flagged" },
    ],
    activity: [{ actor: "AI agent", isAgent: true, text: "Case opened, severity set to high", time: "3h ago" }],
    responseGuidance: [{ text: "Disable webhook pending review" }],
    created: "3h ago",
    closed: "—",
  },
  {
    id: "case-8730",
    title: "MFA fatigue: 11 push prompts in two minutes",
    severity: "medium",
    verdict: "true_positive",
    status: "in_progress",
    entity: "marcus.lee@cursor.com",
    sources: ["okta"],
    updated: "3h",
    assignee: { name: "Jordan Park", initials: "JP" },
    summary:
      "marcus.lee@cursor.com received 11 MFA push prompts within two minutes and eventually approved one, consistent with an MFA fatigue attack following a credential stuffing attempt.",
    whySeverity: "MFA fatigue is a known technique for bypassing multi-factor protection once credentials are already compromised.",
    whyVerdict:
      "The prompt volume and timing pattern match known MFA-bombing behavior, and the approving device differs from the user's usual devices.",
    findings: [
      { text: "11 MFA push prompts in 2 minutes", severity: "warning" },
      { text: "Prompt approved from an unrecognized device", severity: "critical" },
    ],
    entities: [{ name: "marcus.lee@cursor.com", type: "user" }],
    mitre: ["T1621"],
    timeline: [
      { time: "3h ago", text: "First of 11 push prompts sent" },
      { time: "3h ago", text: "Prompt approved from new device" },
      { time: "2h ago", text: "Case opened, analyst notified" },
    ],
    activity: [
      { actor: "AI agent", isAgent: true, text: "Case opened, severity set to medium", time: "3h ago" },
      { actor: "AI agent", isAgent: true, text: "Verdict proposed: true positive", time: "3h ago" },
      { actor: "Jordan Park", isAgent: false, text: "Forcing password reset and re-enrollment", time: "30m ago" },
    ],
    responseGuidance: [
      { text: "Force password reset for marcus.lee" },
      { text: "Revoke and re-enroll MFA device" },
    ],
    created: "3h ago",
    closed: "—",
  },
  {
    id: "case-8719",
    title: "Anomalous S3 bucket policy change, public read enabled",
    severity: "medium",
    verdict: "needs_review",
    status: "open",
    entity: "svc-deploy-bot",
    sources: ["aws"],
    updated: "4h",
    assignee: null,
    summary:
      "A deploy pipeline run modified an S3 bucket policy to allow public read access on a bucket that normally stays private.",
    whySeverity: "Public read on the wrong bucket can expose customer or build artifacts, though this bucket's contents are still being assessed.",
    whyVerdict: "Checking whether this matches a recent infrastructure change request or is an unintended side effect of a deploy script.",
    findings: [{ text: "Bucket policy now allows public s3:GetObject", severity: "warning" }],
    entities: [{ name: "svc-deploy-bot", type: "service account" }],
    mitre: ["T1530"],
    timeline: [
      { time: "4h ago", text: "Policy change applied during deploy" },
      { time: "4h ago", text: "Public-read anomaly flagged" },
    ],
    activity: [{ actor: "AI agent", isAgent: true, text: "Case opened, severity set to medium", time: "4h ago" }],
    responseGuidance: [{ text: "Revert bucket policy to private" }],
    created: "4h ago",
    closed: "—",
  },
  {
    id: "case-8703",
    title: "New admin role granted outside change window",
    severity: "medium",
    verdict: "needs_review",
    status: "open",
    entity: "admin@cursor.com",
    sources: ["okta", "aws"],
    updated: "5h",
    assignee: null,
    summary:
      "admin@cursor.com granted a new AWS administrator role outside the org's published change window, without a linked change ticket.",
    whySeverity: "Unscheduled admin grants are a common way privilege escalation hides inside otherwise-legitimate admin activity.",
    whyVerdict: "Waiting on confirmation from the admin about whether this was tied to an undocumented incident response action.",
    findings: [{ text: "Admin role granted with no associated change ticket", severity: "warning" }],
    entities: [{ name: "admin@cursor.com", type: "user" }],
    timeline: [
      { time: "5h ago", text: "Admin role granted" },
      { time: "5h ago", text: "Change-window mismatch flagged" },
    ],
    activity: [{ actor: "AI agent", isAgent: true, text: "Case opened, severity set to medium", time: "5h ago" }],
    responseGuidance: [{ text: "Confirm grant with admin@cursor.com" }],
    created: "5h ago",
    closed: "—",
  },
  {
    id: "case-8691",
    title: "Container escape attempt flagged on staging node",
    severity: "medium",
    verdict: "false_positive",
    status: "resolved",
    entity: "k8s-node-11",
    sources: ["crowdstrike"],
    updated: "6h",
    assignee: null,
    summary:
      "CrowdStrike flagged a syscall pattern on k8s-node-11 consistent with a container escape attempt. Investigation traced it to a security scanning job intentionally testing the cluster's isolation.",
    whySeverity: "Container escape techniques can grant host-level access from within a compromised pod, a serious risk if real.",
    whyVerdict: "The syscall pattern matches an internal security team's scheduled penetration test, confirmed against their run log.",
    findings: [
      { text: "Syscall pattern matched known escape technique", severity: "warning" },
      { text: "Traced to scheduled internal pen-test job", severity: "warning" },
    ],
    entities: [{ name: "k8s-node-11", type: "host" }],
    mitre: ["T1611"],
    timeline: [
      { time: "6h ago", text: "Syscall pattern detected" },
      { time: "6h ago", text: "Case opened" },
      { time: "5h ago", text: "Matched to internal pen-test schedule, resolved" },
    ],
    activity: [
      { actor: "AI agent", isAgent: true, text: "Case opened, severity set to medium", time: "6h ago" },
      { actor: "AI agent", isAgent: true, text: "Verdict proposed: false positive", time: "5h ago" },
    ],
    created: "6h ago",
    closed: "5h ago",
  },
  {
    id: "case-8677",
    title: "Bulk export from customer database table",
    severity: "medium",
    verdict: "needs_review",
    status: "open",
    entity: "svc-analytics-etl",
    sources: ["aws"],
    updated: "7h",
    assignee: { name: "Sam Osei", initials: "SO" },
    summary:
      "svc-analytics-etl exported a full snapshot of the customer accounts table, roughly 40x larger than its typical incremental export.",
    whySeverity: "Bulk exports of customer data warrant scrutiny even from expected service accounts, given the sensitivity of the table involved.",
    whyVerdict: "Checking whether this matches a scheduled full-refresh job or represents unusual access.",
    findings: [{ text: "Export size 40x larger than 30-day average", severity: "warning" }],
    entities: [{ name: "svc-analytics-etl", type: "service account" }],
    timeline: [
      { time: "7h ago", text: "Bulk export executed" },
      { time: "7h ago", text: "Volume anomaly flagged" },
    ],
    activity: [
      { actor: "AI agent", isAgent: true, text: "Case opened, severity set to medium", time: "7h ago" },
      { actor: "Sam Osei", isAgent: false, text: "Checking against ETL job schedule", time: "1h ago" },
    ],
    created: "7h ago",
    closed: "—",
  },
  {
    id: "case-8662",
    title: "Phishing email reported by employee, credentials entered",
    severity: "medium",
    verdict: "true_positive",
    status: "in_progress",
    entity: "alicia.moore@cursor.com",
    sources: ["email"],
    updated: "8h",
    assignee: { name: "Jordan Park", initials: "JP" },
    summary:
      "alicia.moore@cursor.com reported a phishing email impersonating IT support; investigation confirmed she entered her password on the linked credential-harvesting page before reporting it.",
    whySeverity: "Confirmed credential entry on a phishing page means the account should be treated as compromised until reset.",
    whyVerdict:
      "The reported email matches a known phishing kit, and login telemetry shows the credential was submitted before the user reported it.",
    findings: [
      { text: "Credentials submitted on phishing page", severity: "critical" },
      { text: "Email matches known phishing kit template", severity: "warning" },
    ],
    entities: [{ name: "alicia.moore@cursor.com", type: "user" }],
    observables: [{ value: "secure-cursor-it.com", kind: "domain", detail: "registered 3 days ago" }],
    mitre: ["T1566.002"],
    timeline: [
      { time: "8h ago", text: "Phishing email received" },
      { time: "8h ago", text: "Credentials submitted on fake login page" },
      { time: "7h ago", text: "Employee reported the email" },
    ],
    activity: [
      { actor: "AI agent", isAgent: true, text: "Case opened, severity set to medium", time: "8h ago" },
      { actor: "AI agent", isAgent: true, text: "Verdict proposed: true positive", time: "8h ago" },
      { actor: "Jordan Park", isAgent: false, text: "Forcing password reset", time: "30m ago" },
    ],
    responseGuidance: [{ text: "Force password reset for alicia.moore" }],
    created: "8h ago",
    closed: "—",
  },
  {
    id: "case-8649",
    title: "Repo clone from unrecognized CI runner IP range",
    severity: "medium",
    verdict: "benign",
    status: "resolved",
    entity: "svc-deploy-bot",
    sources: ["github"],
    updated: "9h",
    assignee: null,
    summary:
      "svc-deploy-bot cloned a repository from an IP range not previously seen, which turned out to be a new GitHub Actions runner pool rolled out that morning.",
    whySeverity: "Clones from unrecognized IP ranges are flagged by default until the range can be attributed.",
    whyVerdict: "The IP range was confirmed as GitHub's own published Actions runner CIDR block.",
    findings: [{ text: "Clone from previously unseen IP range", severity: "warning" }],
    entities: [{ name: "svc-deploy-bot", type: "service account" }],
    observables: [{ value: "20.205.243.0/24", kind: "ip range", detail: "GitHub Actions, confirmed" }],
    timeline: [
      { time: "9h ago", text: "Clone from new IP range" },
      { time: "9h ago", text: "Range attributed to GitHub Actions, resolved" },
    ],
    activity: [
      { actor: "AI agent", isAgent: true, text: "Case opened, severity set to medium", time: "9h ago" },
      { actor: "AI agent", isAgent: true, text: "Verdict proposed: benign", time: "9h ago" },
    ],
    created: "9h ago",
    closed: "9h ago",
  },
  {
    id: "case-8630",
    title: "Dormant service account reactivated after 90 days",
    severity: "low",
    verdict: "needs_review",
    status: "open",
    entity: "svc-legacy-billing",
    sources: ["aws"],
    updated: "10h",
    assignee: null,
    summary:
      "svc-legacy-billing, dormant for 92 days, made API calls again this morning against the deprecated billing service it was created for.",
    whySeverity: "Reactivated dormant accounts are a common persistence technique, though this one's activity matches its original stated purpose.",
    whyVerdict: "Confirming with the platform team whether the legacy billing service was intentionally reactivated.",
    findings: [{ text: "Account inactive 92 days, now active", severity: "warning" }],
    entities: [{ name: "svc-legacy-billing", type: "service account" }],
    timeline: [{ time: "10h ago", text: "First API call after 92 days dormant" }],
    activity: [{ actor: "AI agent", isAgent: true, text: "Case opened, severity set to low", time: "10h ago" }],
    created: "10h ago",
    closed: "—",
  },
  {
    id: "case-8614",
    title: "Password reset requested from new device",
    severity: "low",
    verdict: "benign",
    status: "resolved",
    entity: "noah.kim@cursor.com",
    sources: ["okta"],
    updated: "12h",
    assignee: null,
    summary:
      "noah.kim@cursor.com requested a password reset from a new personal device, completed the standard verification flow, and set a new password.",
    whySeverity: "Password resets from new devices are routine but flagged for visibility.",
    whyVerdict: "Verification flow completed normally, matching typical self-service reset behavior.",
    findings: [{ text: "Password reset completed via standard email verification", severity: "warning" }],
    entities: [{ name: "noah.kim@cursor.com", type: "user" }],
    timeline: [{ time: "12h ago", text: "Reset requested and completed" }],
    activity: [
      { actor: "AI agent", isAgent: true, text: "Case opened, severity set to low", time: "12h ago" },
      { actor: "AI agent", isAgent: true, text: "Verdict proposed: benign", time: "12h ago" },
    ],
    created: "12h ago",
    closed: "12h ago",
  },
  {
    id: "case-8599",
    title: "Slack app installed with broad workspace read scope",
    severity: "low",
    verdict: "benign",
    status: "resolved",
    entity: "it-admin@cursor.com",
    sources: ["slack"],
    updated: "14h",
    assignee: null,
    summary:
      "it-admin@cursor.com installed a Slack app (\"Standup Bot\") with workspace-wide read access to support an async standup workflow the team requested.",
    whySeverity: "Broad read scopes are flagged by default regardless of who grants them.",
    whyVerdict: "The app is a well-known, verified Slack Marketplace integration installed by an authorized admin.",
    findings: [{ text: "App granted channels:history scope workspace-wide", severity: "warning" }],
    entities: [{ name: "it-admin@cursor.com", type: "user" }],
    timeline: [{ time: "14h ago", text: "App installed by admin" }],
    activity: [
      { actor: "AI agent", isAgent: true, text: "Case opened, severity set to low", time: "14h ago" },
      { actor: "AI agent", isAgent: true, text: "Verdict proposed: benign", time: "14h ago" },
    ],
    created: "14h ago",
    closed: "14h ago",
  },
  {
    id: "case-8581",
    title: "New GitHub personal access token created, standard scope",
    severity: "low",
    verdict: "benign",
    status: "resolved",
    entity: "devon.ng@cursor.com",
    sources: ["github"],
    updated: "16h",
    assignee: null,
    summary:
      "devon.ng@cursor.com created a new personal access token scoped to repo:read, consistent with setting up a new local development environment.",
    whySeverity: "New PAT creation is routine but logged for visibility into standing credential sprawl.",
    whyVerdict: "Standard scope, matches the user's normal development activity pattern.",
    findings: [{ text: "PAT created with repo:read scope only", severity: "warning" }],
    entities: [{ name: "devon.ng@cursor.com", type: "user" }],
    timeline: [{ time: "16h ago", text: "Token created" }],
    activity: [
      { actor: "AI agent", isAgent: true, text: "Case opened, severity set to low", time: "16h ago" },
      { actor: "AI agent", isAgent: true, text: "Verdict proposed: benign", time: "16h ago" },
    ],
    created: "16h ago",
    closed: "16h ago",
  },
  {
    id: "case-8570",
    title: "Outbound traffic to low-reputation IP, auto-blocked",
    severity: "low",
    verdict: "benign",
    status: "resolved",
    entity: "corp-vpn-gateway",
    sources: ["crowdstrike"],
    updated: "18h",
    assignee: null,
    summary:
      "The corporate VPN gateway made an outbound connection to an IP with a low reputation score; CrowdStrike auto-blocked the connection before any data left the network.",
    whySeverity: "Auto-blocked connections are low severity by design since the control already worked as intended.",
    whyVerdict:
      "Connection was blocked before completion, and the destination IP's low reputation appears tied to shared hosting infrastructure rather than a known threat.",
    findings: [{ text: "Outbound connection auto-blocked at the gateway", severity: "warning" }],
    entities: [{ name: "corp-vpn-gateway", type: "host" }],
    observables: [{ value: "203.0.113.201", kind: "ip", detail: "low reputation, shared hosting" }],
    timeline: [{ time: "18h ago", text: "Connection attempted and auto-blocked" }],
    activity: [
      { actor: "AI agent", isAgent: true, text: "Case opened, severity set to low", time: "18h ago" },
      { actor: "AI agent", isAgent: true, text: "Verdict proposed: benign", time: "18h ago" },
    ],
    created: "18h ago",
    closed: "18h ago",
  },
  {
    id: "case-8553",
    title: "Scheduled AWS access key rotation completed",
    severity: "low",
    verdict: "benign",
    status: "resolved",
    entity: "svc-backup-role",
    sources: ["aws"],
    updated: "20h",
    assignee: null,
    summary: "svc-backup-role's access key was rotated as part of the org's standing 90-day rotation policy.",
    whySeverity: "Routine, policy-driven credential rotation.",
    whyVerdict: "Matches the scheduled rotation job exactly, no anomaly present.",
    findings: [{ text: "Access key rotated per 90-day policy", severity: "warning" }],
    entities: [{ name: "svc-backup-role", type: "service account" }],
    timeline: [{ time: "20h ago", text: "Key rotation job ran" }],
    activity: [
      { actor: "AI agent", isAgent: true, text: "Case opened, severity set to low", time: "20h ago" },
      { actor: "AI agent", isAgent: true, text: "Verdict proposed: benign", time: "20h ago" },
    ],
    created: "20h ago",
    closed: "20h ago",
  },
  // Further rows, added for volume and variety - still Cursor-shaped,
  // spanning more of the source and title space a real queue would.
  {
    id: "case-8542",
    title: "Terraform state file exposed in public S3 bucket",
    severity: "critical",
    verdict: "needs_review",
    status: "open",
    entity: "svc-infra-ci",
    sources: ["aws", "github"],
    updated: "22h",
    assignee: null,
    summary:
      "A Terraform state file containing database credentials and internal hostnames was found in a public S3 bucket after a CI pipeline change removed the bucket's access restrictions.",
    whySeverity: "Terraform state files routinely contain plaintext secrets; public exposure means those secrets must be treated as compromised.",
    whyVerdict: "Confirming the full blast radius of what the exposed state file contained before deciding on rotation scope.",
    findings: [
      { text: "tfstate file publicly readable for at least 6 hours", severity: "critical" },
      { text: "File contains database connection strings", severity: "critical" },
    ],
    entities: [{ name: "svc-infra-ci", type: "service account" }],
    observables: [{ value: "cursor-terraform-state", kind: "s3 bucket", detail: "public since pipeline change" }],
    mitre: ["T1552.005"],
    timeline: [
      { time: "22h ago", text: "Bucket access restriction removed" },
      { time: "20h ago", text: "Public exposure detected by scanner" },
      { time: "19h ago", text: "Case opened" },
    ],
    activity: [{ actor: "AI agent", isAgent: true, text: "Case opened, severity set to critical", time: "19h ago" }],
    responseGuidance: [
      { text: "Restore bucket access restrictions" },
      { text: "Rotate all secrets referenced in the state file" },
    ],
    created: "22h ago",
    closed: "—",
  },
  {
    id: "case-8531",
    title: "Root account login from unfamiliar ASN",
    severity: "critical",
    verdict: "needs_review",
    status: "open",
    entity: "aws-root@cursor.com",
    sources: ["aws", "okta"],
    updated: "1d",
    assignee: { name: "Jordan Park", initials: "JP" },
    summary:
      "The AWS root account logged in from an ASN never associated with the organization, bypassing the usual SSO path that root logins are meant to avoid entirely.",
    whySeverity: "Root account access carries unrestricted permissions across the entire AWS org; any unexplained root login is treated as critical by default.",
    whyVerdict: "Confirming with the account owner whether this was an emergency break-glass access or represents a compromised credential.",
    findings: [
      { text: "Root login bypassing standard SSO path", severity: "critical" },
      { text: "Source ASN never seen for this account", severity: "critical" },
    ],
    entities: [{ name: "aws-root@cursor.com", type: "user" }],
    observables: [{ value: "185.220.101.4", kind: "ip", detail: "Tor exit node range" }],
    mitre: ["T1078.004"],
    timeline: [
      { time: "1d ago", text: "Root login detected" },
      { time: "1d ago", text: "Case opened, severity set to critical" },
    ],
    activity: [
      { actor: "AI agent", isAgent: true, text: "Case opened, severity set to critical", time: "1d ago" },
      { actor: "Jordan Park", isAgent: false, text: "Attempting to reach account owner", time: "2h ago" },
    ],
    responseGuidance: [
      { text: "Rotate root account credentials" },
      { text: "Enable hardware MFA on root if not already required" },
    ],
    created: "1d ago",
    closed: "—",
  },
  {
    id: "case-8517",
    title: "Model weights exfiltrated to personal cloud storage",
    severity: "high",
    verdict: "true_positive",
    status: "in_progress",
    entity: "ravi.desai@cursor.com",
    sources: ["github", "aws"],
    updated: "1d",
    assignee: { name: "Sam Osei", initials: "SO" },
    summary:
      "ravi.desai@cursor.com downloaded a full copy of the production model weights and uploaded them to a personal Google Drive account shortly after.",
    whySeverity: "Proprietary model weights represent significant IP; movement to an unmanaged personal cloud account is a clear exfiltration path.",
    whyVerdict: "Download and upload timing, volume, and destination together confirm intentional exfiltration rather than a routine backup.",
    findings: [
      { text: "14GB model weights downloaded from S3", severity: "critical" },
      { text: "Matching upload to personal Google Drive 4 minutes later", severity: "critical" },
    ],
    entities: [{ name: "ravi.desai@cursor.com", type: "user" }],
    mitre: ["T1567.002"],
    timeline: [
      { time: "1d ago", text: "Model weights downloaded" },
      { time: "1d ago", text: "Upload to personal cloud storage detected" },
      { time: "20h ago", text: "Case opened, severity set to high" },
    ],
    activity: [
      { actor: "AI agent", isAgent: true, text: "Case opened, severity set to high", time: "20h ago" },
      { actor: "AI agent", isAgent: true, text: "Verdict proposed: true positive", time: "20h ago" },
      { actor: "Sam Osei", isAgent: false, text: "Escalated to security and legal", time: "3h ago" },
    ],
    responseGuidance: [
      { text: "Disable ravi.desai's access pending investigation" },
      { text: "Request deletion confirmation from Google Drive" },
    ],
    created: "1d ago",
    closed: "—",
  },
  {
    id: "case-8503",
    title: "Employee laptop flagged with unauthorized remote access tool",
    severity: "high",
    verdict: "needs_review",
    status: "open",
    entity: "laptop-eng-0231",
    sources: ["crowdstrike"],
    updated: "1d",
    assignee: null,
    summary: "CrowdStrike flagged installation of a remote-access tool not on the approved software list on an engineering laptop.",
    whySeverity: "Unapproved remote access tools are a common precursor to both insider misuse and third-party compromise of the endpoint.",
    whyVerdict: "Reaching out to the laptop's assigned employee to confirm whether this was self-installed for a legitimate reason.",
    findings: [{ text: "Remote access tool installed outside MDM-approved list", severity: "warning" }],
    entities: [{ name: "laptop-eng-0231", type: "host" }],
    mitre: ["T1219"],
    timeline: [{ time: "1d ago", text: "Tool installation detected" }],
    activity: [{ actor: "AI agent", isAgent: true, text: "Case opened, severity set to high", time: "1d ago" }],
    responseGuidance: [{ text: "Confirm installation with assigned employee" }],
    created: "1d ago",
    closed: "—",
  },
  {
    id: "case-8491",
    title: "Vendor SaaS breach, credential reuse check triggered",
    severity: "high",
    verdict: "needs_review",
    status: "open",
    entity: "org-wide",
    sources: ["okta", "email"],
    updated: "1d",
    assignee: null,
    summary:
      "A vendor used by the company disclosed a breach of their user database. Artemis is checking whether any employee credentials were reused between that vendor and internal systems.",
    whySeverity: "Credential reuse across a breached third party is one of the most common paths into corporate accounts.",
    whyVerdict: "Cross-referencing the disclosed breach data against internal password-change history is still in progress.",
    findings: [{ text: "Vendor breach disclosure received via threat intel feed", severity: "warning" }],
    entities: [{ name: "org-wide", type: "organization" }],
    timeline: [
      { time: "1d ago", text: "Breach disclosure received" },
      { time: "1d ago", text: "Credential reuse check started" },
    ],
    activity: [{ actor: "AI agent", isAgent: true, text: "Case opened, severity set to high", time: "1d ago" }],
    responseGuidance: [{ text: "Force password reset for any matched accounts" }],
    created: "1d ago",
    closed: "—",
  },
  {
    id: "case-8478",
    title: "API rate-limit bypass attempt from scraper-like client",
    severity: "high",
    verdict: "false_positive",
    status: "resolved",
    entity: "public-api-gateway",
    sources: ["aws"],
    updated: "1d",
    assignee: null,
    summary:
      "A client hit the public API gateway with request patterns resembling a rate-limit bypass attempt. Investigation traced it to an internal load-testing job that forgot to use its designated test API key.",
    whySeverity: "Rate-limit bypass patterns can indicate scraping or credential-stuffing infrastructure probing the API.",
    whyVerdict: "Source IP and request signature matched the internal load-testing tool's known fingerprint exactly.",
    findings: [
      { text: "Request pattern matched rate-limit bypass technique", severity: "warning" },
      { text: "Traced to internal load-testing job", severity: "warning" },
    ],
    entities: [{ name: "public-api-gateway", type: "host" }],
    timeline: [
      { time: "1d ago", text: "Anomalous request pattern detected" },
      { time: "1d ago", text: "Traced to internal load test, resolved" },
    ],
    activity: [
      { actor: "AI agent", isAgent: true, text: "Case opened, severity set to high", time: "1d ago" },
      { actor: "AI agent", isAgent: true, text: "Verdict proposed: false positive", time: "1d ago" },
    ],
    created: "1d ago",
    closed: "1d ago",
  },
  {
    id: "case-8465",
    title: "Slack export requested for entire workspace history",
    severity: "high",
    verdict: "needs_review",
    status: "open",
    entity: "it-admin@cursor.com",
    sources: ["slack"],
    updated: "2d",
    assignee: { name: "Sam Osei", initials: "SO" },
    summary:
      "A full workspace message export was requested through the Slack admin console, covering the entire history of every channel including private ones.",
    whySeverity: "A complete workspace export contains highly sensitive internal communication; if the requesting account is compromised, this is a significant exposure.",
    whyVerdict: "Confirming directly with it-admin@cursor.com whether this export was self-initiated and for what purpose.",
    findings: [{ text: "Full workspace export requested, including private channels", severity: "warning" }],
    entities: [{ name: "it-admin@cursor.com", type: "user" }],
    mitre: ["T1213.003"],
    timeline: [
      { time: "2d ago", text: "Export requested" },
      { time: "2d ago", text: "Case opened for review" },
    ],
    activity: [
      { actor: "AI agent", isAgent: true, text: "Case opened, severity set to high", time: "2d ago" },
      { actor: "Sam Osei", isAgent: false, text: "Reaching out to confirm intent", time: "4h ago" },
    ],
    responseGuidance: [{ text: "Confirm export request with it-admin" }],
    created: "2d ago",
    closed: "—",
  },
  {
    id: "case-8449",
    title: "Unusual number of failed SSH attempts on jump host",
    severity: "medium",
    verdict: "needs_review",
    status: "open",
    entity: "bastion-prod-01",
    sources: ["crowdstrike", "aws"],
    updated: "2d",
    assignee: null,
    summary:
      "bastion-prod-01 recorded 200+ failed SSH attempts across a rotating set of usernames within a 10-minute window, consistent with automated credential brute-forcing.",
    whySeverity: "Bastion hosts are the gateway to production infrastructure; sustained brute-force attempts against them warrant prompt review even without a successful login.",
    whyVerdict: "No successful authentication has been observed yet; confirming source reputation and whether rate-limiting should be tightened.",
    findings: [
      { text: "200+ failed SSH attempts in 10 minutes", severity: "warning" },
      { text: "Rotating username list, no successful auth", severity: "warning" },
    ],
    entities: [{ name: "bastion-prod-01", type: "host" }],
    observables: [{ value: "91.219.237.14", kind: "ip", detail: "known scanning infrastructure" }],
    mitre: ["T1110"],
    timeline: [
      { time: "2d ago", text: "Brute-force attempt began" },
      { time: "2d ago", text: "Case opened" },
    ],
    activity: [{ actor: "AI agent", isAgent: true, text: "Case opened, severity set to medium", time: "2d ago" }],
    responseGuidance: [{ text: "Block source IP at the network edge" }],
    created: "2d ago",
    closed: "—",
  },
  {
    id: "case-8433",
    title: "New GitHub org owner added outside change window",
    severity: "medium",
    verdict: "needs_review",
    status: "open",
    entity: "github-org-admin",
    sources: ["github"],
    updated: "2d",
    assignee: null,
    summary: "A new organization owner was added to the GitHub org outside the published change window, with no linked change ticket.",
    whySeverity: "Org owner is GitHub's highest privilege level; unscheduled grants at this level warrant review even without other signals.",
    whyVerdict: "Waiting on confirmation that this matches an approved but undocumented onboarding action.",
    findings: [{ text: "New org owner added, no change ticket linked", severity: "warning" }],
    entities: [{ name: "github-org-admin", type: "service account" }],
    timeline: [
      { time: "2d ago", text: "Owner added" },
      { time: "2d ago", text: "Change-window mismatch flagged" },
    ],
    activity: [{ actor: "AI agent", isAgent: true, text: "Case opened, severity set to medium", time: "2d ago" }],
    responseGuidance: [{ text: "Confirm new owner grant is authorized" }],
    created: "2d ago",
    closed: "—",
  },
  {
    id: "case-8420",
    title: "Spike in outbound email to free webmail domains",
    severity: "medium",
    verdict: "false_positive",
    status: "resolved",
    entity: "sales-team-alias",
    sources: ["email"],
    updated: "2d",
    assignee: null,
    summary:
      "The sales team alias sent a spike in outbound email to free webmail domains (gmail.com, yahoo.com), consistent with a legitimate outreach campaign to prospective leads rather than data exfiltration.",
    whySeverity: "Spikes in outbound mail to free webmail providers are a common exfiltration channel and are flagged by default.",
    whyVerdict: "Message content and timing match a scheduled outbound sales campaign confirmed with the marketing team.",
    findings: [
      { text: "312 emails to free webmail domains in one hour", severity: "warning" },
      { text: "Matches scheduled outreach campaign", severity: "warning" },
    ],
    entities: [{ name: "sales-team-alias", type: "service account" }],
    timeline: [
      { time: "2d ago", text: "Email spike detected" },
      { time: "2d ago", text: "Confirmed as sales campaign, resolved" },
    ],
    activity: [
      { actor: "AI agent", isAgent: true, text: "Case opened, severity set to medium", time: "2d ago" },
      { actor: "AI agent", isAgent: true, text: "Verdict proposed: false positive", time: "2d ago" },
    ],
    created: "2d ago",
    closed: "2d ago",
  },
  {
    id: "case-8406",
    title: "Lambda function modified to add outbound egress",
    severity: "medium",
    verdict: "needs_review",
    status: "open",
    entity: "svc-deploy-bot",
    sources: ["aws"],
    updated: "3d",
    assignee: { name: "Jordan Park", initials: "JP" },
    summary: "A production Lambda function's networking configuration was modified to allow outbound internet egress, which it did not previously have.",
    whySeverity: "Unexpected egress on a function that previously had none is a common pattern for establishing a covert exfiltration or command-and-control channel.",
    whyVerdict: "Reviewing the deploy history to determine whether this was an intentional configuration change.",
    findings: [{ text: "Lambda VPC config changed to allow 0.0.0.0/0 egress", severity: "warning" }],
    entities: [{ name: "svc-deploy-bot", type: "service account" }],
    mitre: ["T1090"],
    timeline: [
      { time: "3d ago", text: "Configuration change deployed" },
      { time: "3d ago", text: "Egress anomaly flagged" },
    ],
    activity: [
      { actor: "AI agent", isAgent: true, text: "Case opened, severity set to medium", time: "3d ago" },
      { actor: "Jordan Park", isAgent: false, text: "Reviewing deploy history", time: "1d ago" },
    ],
    responseGuidance: [{ text: "Revert egress configuration pending review" }],
    created: "3d ago",
    closed: "—",
  },
  {
    id: "case-8391",
    title: "Third-party Slack bot requesting admin scopes",
    severity: "medium",
    verdict: "true_positive",
    status: "in_progress",
    entity: "it-admin@cursor.com",
    sources: ["slack"],
    updated: "3d",
    assignee: { name: "Sam Osei", initials: "SO" },
    summary:
      "A third-party Slack bot installation requested admin-level scopes it did not need for its stated purpose; investigation found the bot's publisher account had itself been compromised in an unrelated incident.",
    whySeverity: "Admin-scope access from a compromised third-party integration is a supply-chain path directly into the workspace.",
    whyVerdict: "The bot's publisher was independently confirmed compromised via public disclosure, and the scope request pattern matches known malicious app behavior.",
    findings: [
      { text: "Bot requested admin scope beyond its stated function", severity: "warning" },
      { text: "Publisher account confirmed compromised", severity: "critical" },
    ],
    entities: [{ name: "it-admin@cursor.com", type: "user" }],
    mitre: ["T1195.002"],
    timeline: [
      { time: "3d ago", text: "Bot installed with admin scope" },
      { time: "3d ago", text: "Publisher compromise disclosed publicly" },
      { time: "2d ago", text: "Case opened, severity set to medium" },
    ],
    activity: [
      { actor: "AI agent", isAgent: true, text: "Case opened, severity set to medium", time: "2d ago" },
      { actor: "AI agent", isAgent: true, text: "Verdict proposed: true positive", time: "2d ago" },
      { actor: "Sam Osei", isAgent: false, text: "Removing bot and auditing its access", time: "6h ago" },
    ],
    responseGuidance: [
      { text: "Remove the bot from the workspace" },
      { text: "Audit any data the bot accessed" },
    ],
    created: "3d ago",
    closed: "—",
  },
  {
    id: "case-8377",
    title: "Stale IAM role with unused admin policy attached",
    severity: "low",
    verdict: "needs_review",
    status: "open",
    entity: "svc-legacy-billing",
    sources: ["aws"],
    updated: "3d",
    assignee: null,
    summary: "svc-legacy-billing holds an administrator-scoped IAM policy that hasn't been used in over 120 days, identified during a routine least-privilege sweep.",
    whySeverity: "Unused broad permissions are lower urgency than active misuse but still represent standing risk.",
    whyVerdict: "Awaiting confirmation from the platform team before removing the unused policy.",
    findings: [{ text: "Admin policy unused for 120+ days", severity: "warning" }],
    entities: [{ name: "svc-legacy-billing", type: "service account" }],
    timeline: [{ time: "3d ago", text: "Flagged during least-privilege sweep" }],
    activity: [{ actor: "AI agent", isAgent: true, text: "Case opened, severity set to low", time: "3d ago" }],
    responseGuidance: [{ text: "Remove unused administrator policy" }],
    created: "3d ago",
    closed: "—",
  },
  {
    id: "case-8360",
    title: "Employee enrolled a new MFA device",
    severity: "low",
    verdict: "benign",
    status: "resolved",
    entity: "priya.raman@cursor.com",
    sources: ["okta"],
    updated: "4d",
    assignee: null,
    summary: "priya.raman@cursor.com enrolled a new MFA device after a standard identity verification flow, consistent with replacing a lost phone.",
    whySeverity: "New MFA enrollments are routine but logged for visibility.",
    whyVerdict: "Verification flow completed normally, no anomalies in the enrollment session.",
    findings: [{ text: "MFA device enrolled via standard verification", severity: "warning" }],
    entities: [{ name: "priya.raman@cursor.com", type: "user" }],
    timeline: [{ time: "4d ago", text: "New device enrolled" }],
    activity: [
      { actor: "AI agent", isAgent: true, text: "Case opened, severity set to low", time: "4d ago" },
      { actor: "AI agent", isAgent: true, text: "Verdict proposed: benign", time: "4d ago" },
    ],
    created: "4d ago",
    closed: "4d ago",
  },
  {
    id: "case-8344",
    title: "GitHub Actions workflow updated to add new secret",
    severity: "low",
    verdict: "benign",
    status: "resolved",
    entity: "svc-deploy-bot",
    sources: ["github"],
    updated: "4d",
    assignee: null,
    summary: "A GitHub Actions workflow was updated to reference a new repository secret, part of a planned integration with a new deployment target.",
    whySeverity: "New secret references in CI workflows are logged for visibility given their sensitivity.",
    whyVerdict: "Change matches an open pull request for the planned deployment integration.",
    findings: [{ text: "New secret referenced in workflow file", severity: "warning" }],
    entities: [{ name: "svc-deploy-bot", type: "service account" }],
    timeline: [{ time: "4d ago", text: "Workflow file updated" }],
    activity: [
      { actor: "AI agent", isAgent: true, text: "Case opened, severity set to low", time: "4d ago" },
      { actor: "AI agent", isAgent: true, text: "Verdict proposed: benign", time: "4d ago" },
    ],
    created: "4d ago",
    closed: "4d ago",
  },
  {
    id: "case-8329",
    title: "Marketing team requested export of contact list",
    severity: "low",
    verdict: "benign",
    status: "resolved",
    entity: "growth-team-alias",
    sources: ["email"],
    updated: "5d",
    assignee: null,
    summary: "The growth team alias exported the marketing contact list to prepare a quarterly newsletter send, a recurring and pre-approved workflow.",
    whySeverity: "Data exports are logged for visibility regardless of how routine they are.",
    whyVerdict: "Matches the team's recurring quarterly export schedule.",
    findings: [{ text: "Contact list exported, matches quarterly schedule", severity: "warning" }],
    entities: [{ name: "growth-team-alias", type: "service account" }],
    timeline: [{ time: "5d ago", text: "Export completed" }],
    activity: [
      { actor: "AI agent", isAgent: true, text: "Case opened, severity set to low", time: "5d ago" },
      { actor: "AI agent", isAgent: true, text: "Verdict proposed: benign", time: "5d ago" },
    ],
    created: "5d ago",
    closed: "5d ago",
  },
  {
    id: "case-8311",
    title: "New Okta admin console session from known device",
    severity: "low",
    verdict: "benign",
    status: "resolved",
    entity: "it-admin@cursor.com",
    sources: ["okta"],
    updated: "5d",
    assignee: null,
    summary: "it-admin@cursor.com opened a new Okta admin console session from a device already registered to their account.",
    whySeverity: "Admin console sessions are logged for visibility even when unremarkable.",
    whyVerdict: "Device and location match this user's established pattern exactly.",
    findings: [{ text: "Session opened from previously registered device", severity: "warning" }],
    entities: [{ name: "it-admin@cursor.com", type: "user" }],
    timeline: [{ time: "5d ago", text: "Admin session opened" }],
    activity: [
      { actor: "AI agent", isAgent: true, text: "Case opened, severity set to low", time: "5d ago" },
      { actor: "AI agent", isAgent: true, text: "Verdict proposed: benign", time: "5d ago" },
    ],
    created: "5d ago",
    closed: "5d ago",
  },
  {
    id: "case-8296",
    title: "CrowdStrike sensor reinstalled after routine OS upgrade",
    severity: "low",
    verdict: "benign",
    status: "resolved",
    entity: "laptop-eng-0117",
    sources: ["crowdstrike"],
    updated: "6d",
    assignee: null,
    summary: "The CrowdStrike sensor on laptop-eng-0117 was automatically reinstalled after a routine OS upgrade cleared it, matching expected MDM behavior.",
    whySeverity: "Sensor reinstalls are logged for visibility to confirm endpoint coverage stays continuous.",
    whyVerdict: "Reinstall timing lines up exactly with the OS upgrade completing.",
    findings: [{ text: "Sensor reinstalled automatically post-upgrade", severity: "warning" }],
    entities: [{ name: "laptop-eng-0117", type: "host" }],
    timeline: [
      { time: "6d ago", text: "OS upgrade completed" },
      { time: "6d ago", text: "Sensor reinstalled by MDM" },
    ],
    activity: [
      { actor: "AI agent", isAgent: true, text: "Case opened, severity set to low", time: "6d ago" },
      { actor: "AI agent", isAgent: true, text: "Verdict proposed: benign", time: "6d ago" },
    ],
    created: "6d ago",
    closed: "6d ago",
  },
  {
    id: "case-8280",
    title: "Quarterly access review flagged inactive contractor account",
    severity: "low",
    verdict: "needs_review",
    status: "open",
    entity: "contractor-temp-08",
    sources: ["okta"],
    updated: "6d",
    assignee: null,
    summary: "The quarterly access review flagged contractor-temp-08 as inactive for 45 days while still holding active credentials and repository access.",
    whySeverity: "Inactive-but-active accounts are low-urgency but standing risk, commonly caught during periodic access reviews rather than active misuse.",
    whyVerdict: "Awaiting confirmation from the contractor's sponsoring manager on whether the engagement has ended.",
    findings: [{ text: "Account inactive 45 days, access still active", severity: "warning" }],
    entities: [{ name: "contractor-temp-08", type: "user" }],
    timeline: [{ time: "6d ago", text: "Flagged during quarterly access review" }],
    activity: [{ actor: "AI agent", isAgent: true, text: "Case opened, severity set to low", time: "6d ago" }],
    responseGuidance: [{ text: "Confirm contractor engagement status" }],
    created: "6d ago",
    closed: "—",
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
