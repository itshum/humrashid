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
  // Neutral preview text only. The demo never stores actionable email copy.
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
    senderName: "Demo Sender C",
    senderEmail: "sender-c@acmecorp.example",
    avatar: "C",
    subject: "Training simulation preview C",
    body: ["Sample greeting", "Placeholder content for fictional sample layout C."],
    cta: "Demo action",
    campaignName: "Q3 payroll portal update",
  },
  {
    id: "benefits",
    name: "Benefits enrollment",
    attackType: "Credential phishing",
    theme: "Benefits",
    senderName: "Demo Sender D",
    senderEmail: "sender-d@acmecorp.example",
    avatar: "D",
    subject: "Training simulation preview D",
    body: ["Sample greeting", "Placeholder content for fictional sample layout D."],
    cta: "Demo action",
    campaignName: "Q1 benefits enrollment",
  },
  {
    id: "invoice",
    name: "Invoice approval",
    attackType: "Invoice fraud",
    theme: "Accounts payable",
    senderName: "Demo Sender E",
    senderEmail: "sender-e@acmecorp.example",
    avatar: "E",
    subject: "Training simulation preview E",
    body: ["Sample greeting", "Placeholder content for fictional sample layout E."],
    cta: "Demo action",
    campaignName: "Q2 invoice approval",
  },
  {
    id: "fileshare",
    name: "Shared file from IT",
    attackType: "Malicious file share",
    theme: "IT",
    senderName: "Demo Sender F",
    senderEmail: "sender-f@acmecorp.example",
    avatar: "F",
    subject: "Training simulation preview F",
    body: ["Sample greeting", "Placeholder content for fictional sample layout F."],
    cta: "Demo action",
    campaignName: "Q2 IT shared file",
  },
];

export const templateById = (id: string) => templates.find((t) => t.id === id) ?? templates[0];

// The one campaign that flows through every component.
export const featured = templateById("payroll");

// Sample recipient for the "User view" of dynamic tags.
export const sampleRecipient = {
  firstName: "Employee",
  email: `employee-01@${company.domain}`,
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
  reported: number;
}

// Featured campaign results by group. Sums: 240 recipients, 186 opened,
// 41 clicked, 58 reported (matching the featured campaign's totals in
// campaignHistory below).
export const groups: Group[] = [
  { name: "Finance", recipients: 30, opened: 26, clicked: 9, reported: 3 },
  { name: "Sales", recipients: 48, opened: 39, clicked: 11, reported: 8 },
  { name: "Customer support", recipients: 42, opened: 33, clicked: 8, reported: 9 },
  { name: "Operations", recipients: 36, opened: 27, clicked: 5, reported: 10 },
  { name: "Marketing", recipients: 34, opened: 25, clicked: 4, reported: 10 },
  { name: "Engineering", recipients: 50, opened: 36, clicked: 4, reported: 18 },
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
    name: "Employee 01",
    email: `employee-01@${company.domain}`,
    group: "Finance",
    campaigns: [featured.campaignName, "Q2 invoice approval", "Q1 benefits enrollment"],
  },
  {
    name: "Employee 02",
    email: `employee-02@${company.domain}`,
    group: "Sales",
    campaigns: [featured.campaignName, "Q2 IT shared file", "Q1 benefits enrollment"],
  },
  {
    name: "Employee 03",
    email: `employee-03@${company.domain}`,
    group: "Finance",
    campaigns: [featured.campaignName, "Q2 invoice approval"],
  },
  {
    name: "Employee 04",
    email: `employee-04@${company.domain}`,
    group: "Customer support",
    campaigns: [featured.campaignName, "Q2 IT shared file"],
  },
];

export const pct = (part: number, whole: number) =>
  whole === 0 ? "0%" : `${((part / whole) * 100).toFixed(1).replace(/\.0$/, "")}%`;

// Always one decimal, the way Sublime's tables print rates ("58.0%").
export const pct1 = (part: number, whole: number) =>
  whole === 0 ? "0.0%" : `${((part / whole) * 100).toFixed(1)}%`;
