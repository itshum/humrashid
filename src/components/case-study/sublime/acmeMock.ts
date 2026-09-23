// Shared mock data for every interactive piece in the Sublime case study.
// One fictional company, one featured campaign, and counts that add up:
// group totals sum to the campaign totals, clicks never exceed opens,
// and every rate is computed from counts rather than typed in.
// Domains use the reserved .example TLD so none can be a real company.

export const company = {
  name: "Acme Corp",
  domain: "acmecorp.example",
};

export interface Template {
  id: string;
  name: string;
  attackType: string;
  theme: string;
  senderName: string;
  senderEmail: string;
  avatar: string;
  subject: string;
  // Body copy with dynamic tags in {{double.braces}}.
  body: string[];
  cta: string;
  campaignName: string;
}

export const templates: Template[] = [
  {
    id: "payroll",
    name: "Payroll portal update",
    attackType: "Credential phishing",
    theme: "Payroll",
    senderName: "Acme Payroll",
    senderEmail: "payroll@acme-payroll-portal.example",
    avatar: "AP",
    subject: "Action required: confirm your direct deposit details",
    body: [
      "Hi {{recipient.first_name}},",
      "We're moving {{company.name}} payroll to a new portal before the next pay cycle. To avoid a delay in your paycheck, confirm your direct deposit details by Friday.",
    ],
    cta: "Confirm deposit details",
    campaignName: "Q3 payroll portal update",
  },
  {
    id: "benefits",
    name: "Benefits enrollment",
    attackType: "Credential phishing",
    theme: "Benefits",
    senderName: "Acme Benefits",
    senderEmail: "benefits@acme-benefits-center.example",
    avatar: "AB",
    subject: "Open enrollment closes this week",
    body: [
      "Hi {{recipient.first_name}},",
      "Open enrollment for {{company.name}} health and dental plans closes Friday. Sign in to review your elections or your current coverage will roll over.",
    ],
    cta: "Review my elections",
    campaignName: "Q1 benefits enrollment",
  },
  {
    id: "invoice",
    name: "Invoice approval",
    attackType: "Invoice fraud",
    theme: "Accounts payable",
    senderName: "Acme Accounts Payable",
    senderEmail: "ap@acme-billing-center.example",
    avatar: "AA",
    subject: "Invoice #4471 is waiting on your approval",
    body: [
      "Hi {{recipient.first_name}},",
      "Invoice #4471 from a {{company.name}} vendor is past due and needs your approval today to avoid a late fee.",
    ],
    cta: "Review invoice",
    campaignName: "Q2 invoice approval",
  },
  {
    id: "fileshare",
    name: "Shared file from IT",
    attackType: "Malicious file share",
    theme: "IT",
    senderName: "Acme IT Service Desk",
    senderEmail: "it-desk@acme-support-files.example",
    avatar: "AI",
    subject: "A file was shared with you: 2026 device policy.pdf",
    body: [
      "Hi {{recipient.first_name}},",
      "The {{company.name}} IT team shared the updated device policy with you. Please review and acknowledge it by the end of the week.",
    ],
    cta: "Open file",
    campaignName: "Q2 IT shared file",
  },
];

export const templateById = (id: string) => templates.find((t) => t.id === id) ?? templates[0];

// The one campaign that flows through every component.
export const featured = templateById("payroll");

// Sample recipient for the "User view" of dynamic tags.
export const sampleRecipient = {
  firstName: "Jordan",
  email: `jordan.ellis@${company.domain}`,
};

export function fillTags(text: string) {
  return text
    .replaceAll("{{recipient.first_name}}", sampleRecipient.firstName)
    .replaceAll("{{company.name}}", company.name);
}

export interface Group {
  name: string;
  recipients: number;
  opened: number;
  clicked: number;
}

// Featured campaign results by group. Sums: 240 recipients, 186 opened,
// 41 clicked.
export const groups: Group[] = [
  { name: "Finance", recipients: 30, opened: 26, clicked: 9 },
  { name: "Sales", recipients: 48, opened: 39, clicked: 11 },
  { name: "Customer support", recipients: 42, opened: 33, clicked: 8 },
  { name: "Operations", recipients: 36, opened: 27, clicked: 5 },
  { name: "Marketing", recipients: 34, opened: 25, clicked: 4 },
  { name: "Engineering", recipients: 50, opened: 36, clicked: 4 },
];

export interface CampaignResult {
  name: string;
  sent: number;
  clicked: number;
  reported: number;
  active: boolean;
}

// Every campaign Acme has run, oldest first. The featured campaign's
// sent and clicked totals match the group table above.
export const campaignHistory: CampaignResult[] = [
  { name: "Q1 benefits enrollment", sent: 232, clicked: 58, reported: 30, active: false },
  { name: "Q2 invoice approval", sent: 236, clicked: 50, reported: 41, active: false },
  { name: "Q2 IT shared file", sent: 238, clicked: 47, reported: 49, active: false },
  { name: featured.campaignName, sent: 240, clicked: 41, reported: 58, active: true },
];

export interface RepeatClicker {
  name: string;
  email: string;
  group: string;
  // Most recent first. Length is their click count.
  campaigns: string[];
}

export const repeatClickers: RepeatClicker[] = [
  {
    name: "Jordan Ellis",
    email: `jordan.ellis@${company.domain}`,
    group: "Finance",
    campaigns: [featured.campaignName, "Q2 invoice approval", "Q1 benefits enrollment"],
  },
  {
    name: "Riley Park",
    email: `riley.park@${company.domain}`,
    group: "Sales",
    campaigns: [featured.campaignName, "Q2 IT shared file", "Q1 benefits enrollment"],
  },
  {
    name: "Sam Okafor",
    email: `sam.okafor@${company.domain}`,
    group: "Finance",
    campaigns: [featured.campaignName, "Q2 invoice approval"],
  },
  {
    name: "Casey Moreno",
    email: `casey.moreno@${company.domain}`,
    group: "Customer support",
    campaigns: [featured.campaignName, "Q2 IT shared file"],
  },
];

export const pct = (part: number, whole: number) =>
  whole === 0 ? "0%" : `${((part / whole) * 100).toFixed(1).replace(/\.0$/, "")}%`;
