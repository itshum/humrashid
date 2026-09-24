import { Fragment, Suspense, lazy, useEffect, useId, useRef, useState, type DragEvent, type KeyboardEvent, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { BriefcaseBusiness, Calendar, ChevronDown, ChevronLeft, ChevronRight, IdCard, Info, Mail, Phone, Search, Sparkles, SquareArrowOutUpRight, Upload, X } from "lucide-react";
import { sampleRecipient } from "./acmeMock";
import "./CampaignBuilder.css";

const AiGenerateModal = lazy(() => import("./AiGenerateModal"));

// The GA campaign builder, rebuilt 1:1 from the product. It's drawn on a
// fixed 1200 x 844 canvas and scaled to its container (see the --px unit
// in CampaignBuilder.css), so it reads like a screenshot at any width.

export interface BuilderTemplate {
  id: string;
  name: string;
  alias: string;
  email: string;
  subject: string;
  avatar: "acme" | string;
  body: string[];
  cta: string;
  ctaStyle: "brand" | "dark";
}

export const builderTemplates: BuilderTemplate[] = [
  {
    id: "password",
    name: "Sample Template A",
    alias: "Demo Sender A",
    email: "sender-a@acmecorp.example",
    subject: "Training simulation preview A",
    avatar: "A",
    body: ["Placeholder content for fictional sample layout A."],
    cta: "Demo action",
    ctaStyle: "brand",
  },
  {
    id: "mfa",
    name: "Sample Template B",
    alias: "Demo Sender B",
    email: "sender-b@acmecorp.example",
    subject: "Training simulation preview B",
    avatar: "B",
    body: ["Placeholder content for fictional sample layout B."],
    cta: "Demo action",
    ctaStyle: "dark",
  },
];

type LibraryEntry = { id: string; name: string; category: "Credential Phishing" | "BEC / Fraud" | "Callback Phishing"; group: "Most active in your Sublime environment" | "Recently Seen" | "All Templates" };
const libraryEntries: LibraryEntry[] = [
  { id: "account", name: "Sample Account Reset", category: "Credential Phishing", group: "Most active in your Sublime environment" },
  { id: "workspace", name: "Sample Workspace Sign-In Notice", category: "Credential Phishing", group: "Most active in your Sublime environment" },
  { id: "portal", name: "Sample Portal Access Notice", category: "Credential Phishing", group: "Most active in your Sublime environment" },
  { id: "invoice", name: "Sample Invoice Approval", category: "BEC / Fraud", group: "Most active in your Sublime environment" },
  { id: "signature", name: "Sample Document Signature", category: "Credential Phishing", group: "Most active in your Sublime environment" },
  { id: "mfa", name: "Sample Template B", category: "Credential Phishing", group: "Recently Seen" },
  { id: "password", name: "Sample Template A", category: "BEC / Fraud", group: "Recently Seen" },
  { id: "shared-file", name: "Sample Shared Document", category: "Credential Phishing", group: "Recently Seen" },
  { id: "callback", name: "Sample Support Callback", category: "Callback Phishing", group: "Recently Seen" },
  { id: "policy", name: "Sample Policy Acknowledgment", category: "Credential Phishing", group: "Recently Seen" },
  { id: "gift", name: "Sample Gift Card Request", category: "BEC / Fraud", group: "All Templates" },
  { id: "benefits", name: "Sample Benefits Deadline", category: "Credential Phishing", group: "All Templates" },
  { id: "payroll", name: "Sample Payroll Change", category: "BEC / Fraud", group: "All Templates" },
  { id: "question", name: "Sample Executive Question", category: "BEC / Fraud", group: "All Templates" },
  { id: "vendor", name: "Sample Vendor Update", category: "BEC / Fraud", group: "All Templates" },
];

function templateFromLibrary(entry: LibraryEntry): BuilderTemplate {
  return builderTemplates.find((template) => template.id === entry.id) ?? {
    id: entry.id,
    name: entry.name,
    alias: "Demo Sender",
    email: "sender@acmecorp.example",
    subject: `Training simulation preview: ${entry.name}`,
    avatar: "D",
    body: ["Placeholder content for a fictional training email."],
    cta: "Demo action",
    ctaStyle: "brand",
  };
}

const sendDate = "Sep 29, 2026, 9:00 AM";

export type View = "template" | "user";

function tagValues(t: BuilderTemplate): Record<string, string> {
  return {
    recipient_first_name: sampleRecipient.firstName,
    recipient_email_address: sampleRecipient.email,
    sender_alias: t.alias,
    sender_email: t.email,
    date: sendDate,
    company_name: "Acme Corp",
  };
}

// {{tags}} render as code chips in the template view and as real values
// in the user view.
export function Tagged({ text, view, t }: { text: string; view: View; t: BuilderTemplate }) {
  const values = tagValues(t);
  const parts = text.split(/(\{\{[^}]+\}\})/g);
  return (
    <>
      {parts.map((part, i) => {
        if (!part.startsWith("{{")) return <Fragment key={i}>{part}</Fragment>;
        const key = part.slice(2, -2);
        return view === "template" ? (
          <code key={i} className="cb-tag">
            {part}
          </code>
        ) : (
          <Fragment key={i}>{values[key] ?? part}</Fragment>
        );
      })}
    </>
  );
}

export function Label({ children, required, info }: { children: ReactNode; required?: boolean; info?: boolean }) {
  return (
    <span className="cb-label">
      {children}
      {required && (
        <span className="cb-req" aria-hidden="true">
          *
        </span>
      )}
      {info && <Info className="cb-info" aria-hidden="true" strokeWidth={1.5} />}
    </span>
  );
}

export function Box({ children, icon, className = "" }: { children: ReactNode; icon?: ReactNode; className?: string }) {
  return (
    <span className={`cb-input ${className}`}>
      <span className="cb-input-value">{children}</span>
      {icon}
    </span>
  );
}

export const chevron = <ChevronDown className="cb-input-icon" aria-hidden="true" strokeWidth={2} />;

const listOptions = ["finance", "sales", "marketing", "support", "engineering", "operations", "human resources"];
const timeOptions = Array.from({ length: 48 }, (_, index) => {
  const hour = Math.floor(index / 2);
  return `${String(hour).padStart(2, "0")}:${index % 2 ? "30" : "00"}`;
});
const durationOptions = [
  { value: "4", label: "4 hours" },
  { value: "8", label: "8 hours" },
  { value: "12", label: "12 hours" },
  { value: "24", label: "1 day" },
  { value: "48", label: "2 days" },
  { value: "120", label: "5 days" },
  { value: "336", label: "2 weeks" },
  { value: "672", label: "4 weeks" },
  { value: "1008", label: "6 weeks" },
];
const deliveryOptions = [
  { value: "immediate", label: "Send immediately" },
  { value: "business", label: "Business hours · Monday to Friday" },
  { value: "weekends", label: "Send on weekends" },
];
const audienceOptions = [
  { value: "lists", label: "Sublime Lists" },
  { value: "csv", label: "Upload CSV" },
];

function dateLabel(value: string) {
  const [year, month, day] = value.split("-").map(Number);
  return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(new Date(year, month - 1, day));
}

function dateValue(year: number, month: number, day: number) {
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

function localDate(value: string) {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day);
}

function scheduleTime(value: string) {
  const [hour, minute] = value.split(":").map(Number);
  return new Intl.DateTimeFormat("en-US", { hour: "numeric", minute: "2-digit", hour12: true }).format(new Date(2026, 0, 1, hour, minute));
}

export function SelectField({ id, value, onChange, options, className = "", ariaLabel, placeholder }: {
  id: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  className?: string;
  ariaLabel?: string;
  placeholder?: string;
}) {
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const close = (event: PointerEvent) => { if (root.current && !root.current.contains(event.target as Node)) setOpen(false); };
    document.addEventListener("pointerdown", close);
    return () => document.removeEventListener("pointerdown", close);
  }, [open]);

  function onKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    if (event.key === "Escape") { setOpen(false); return; }
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      if (!open) { setOpen(true); return; }
      const current = options.findIndex((item) => item.value === value);
      const next = current < 0 ? (event.key === "ArrowDown" ? 0 : options.length - 1) : (current + (event.key === "ArrowDown" ? 1 : -1) + options.length) % options.length;
      onChange(options[next].value);
    }
  }

  return (
    <div ref={root} className={`cb-select-wrap ${value ? "" : "is-empty "}${className}`}>
      <button id={id} type="button" className="cb-select-trigger" aria-label={ariaLabel} aria-haspopup="listbox" aria-expanded={open} onClick={() => setOpen((current) => !current)} onKeyDown={onKeyDown}>
        <span>{options.find((item) => item.value === value)?.label ?? placeholder}</span>
        <ChevronDown className="cb-input-icon" aria-hidden="true" strokeWidth={2} />
      </button>
      {open && <div className="cb-select-menu" role="listbox" aria-label={ariaLabel ?? "Options"}>
        {options.map((item) => <button type="button" role="option" aria-selected={item.value === value} key={item.value} onClick={() => { onChange(item.value); setOpen(false); }}>{item.label}</button>)}
      </div>}
    </div>
  );
}

export function EmailPreview({ t, view }: { t: BuilderTemplate; view: View }) {
  return (
    <div className="cb-email">
      <div className="cb-email-meta">
        <p>
          <Tagged text="{{sender_alias}}" view={view} t={t} />
        </p>
        <p>
          <Tagged text="{{sender_email}}" view={view} t={t} />
          <span className="cb-dot" aria-hidden="true">
            ·
          </span>
          <Tagged text="{{date}}" view={view} t={t} />
        </p>
        <p className="cb-email-subject">
          <span className="cb-muted">Subject:</span> <Tagged text={t.subject} view={view} t={t} />
        </p>
      </div>
      <div className="cb-email-body">
        <div className="cb-email-from">
          <span className="cb-avatar" aria-hidden="true">{t.avatar}</span>
          <span className="cb-email-sender">{t.alias}</span>
        </div>
        <p>
          Hi <Tagged text="{{recipient_first_name}}" view={view} t={t} />,
        </p>
        {t.body.map((p) => (
          <p key={p}>
            <Tagged text={p} view={view} t={t} />
          </p>
        ))}
        <span className={`cb-cta cb-cta--${t.ctaStyle}`}>{t.cta}</span>
      </div>
      <p className="cb-email-foot">
        This email was sent to <Tagged text="{{recipient_email_address}}" view={view} t={t} /> by{" "}
        <Tagged text="{{sender_alias}}" view={view} t={t} />.
      </p>
    </div>
  );
}

export default function CampaignBuilder({ fit = false }: { fit?: boolean }) {
  const [templateId, setTemplateId] = useState("password");
  const [templates, setTemplates] = useState<BuilderTemplate[]>(builderTemplates);
  const [libraryOpen, setLibraryOpen] = useState(false);
  const [libraryQuery, setLibraryQuery] = useState("");
  const [librarySelection, setLibrarySelection] = useState<string[]>(["password", "mfa"]);
  const [generateOpen, setGenerateOpen] = useState(false);
  const [testOpen, setTestOpen] = useState(false);
  const [testAddresses, setTestAddresses] = useState("");
  const [testError, setTestError] = useState("");
  const [testSent, setTestSent] = useState<{ count: number; template: string } | null>(null);
  const [view, setView] = useState<View>("template");
  const [training, setTraining] = useState(true);
  const [campaignName, setCampaignName] = useState("Sample campaign");
  const [startDate, setStartDate] = useState("2026-09-29");
  const [calendarMonth, setCalendarMonth] = useState(new Date(2026, 8, 1));
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [startTime, setStartTime] = useState("09:00");
  const [durationHours, setDurationHours] = useState("336");
  const [deliveryMode, setDeliveryMode] = useState("immediate");
  const [audienceType, setAudienceType] = useState("lists");
  const [selectedLists, setSelectedLists] = useState(["finance", "sales", "marketing"]);
  const [listsOpen, setListsOpen] = useState(false);
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [csvError, setCsvError] = useState("");
  const [dragging, setDragging] = useState(false);
  const [reviewOpen, setReviewOpen] = useState(false);
  const [reviewError, setReviewError] = useState("");
  const [launched, setLaunched] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);
  const nameInput = useRef<HTMLInputElement>(null);
  const builderRoot = useRef<HTMLDivElement>(null);
  const testPopover = useRef<HTMLDivElement>(null);
  const testInput = useRef<HTMLInputElement>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const testToastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const t = templates.find((x) => x.id === templateId) ?? templates[0] ?? builderTemplates[0];
  const uid = useId();
  const [calendarYear, calendarMonthIndex] = [calendarMonth.getFullYear(), calendarMonth.getMonth()];
  const firstWeekday = new Date(calendarYear, calendarMonthIndex, 1).getDay();
  const daysInMonth = new Date(calendarYear, calendarMonthIndex + 1, 0).getDate();
  const endDate = localDate(startDate);
  const [startHour, startMinute] = startTime.split(":").map(Number);
  endDate.setHours(startHour + Number(durationHours), startMinute);
  const endLabel = new Intl.DateTimeFormat("en-US", { month: "long", day: "numeric", year: "numeric" }).format(endDate);
  const endTimeLabel = new Intl.DateTimeFormat("en-US", { hour: "numeric", minute: "2-digit", hour12: true }).format(endDate);
  const deliveryLabel = deliveryMode === "business" ? "Business hours, Monday to Friday" : deliveryMode === "weekends" ? "Send on weekends" : "Send immediately";
  const durationLabel = durationOptions.find((item) => item.value === durationHours)?.label;
  const libraryGroups = ["Most active in your Sublime environment", "Recently Seen", "All Templates"] as const;

  function showBuilderForDialog() {
    const rect = builderRoot.current?.getBoundingClientRect();
    if (!rect) return;
    const top = Math.max(8, (window.innerHeight - rect.height) / 2);
    window.scrollBy({ top: rect.top - top, behavior: "auto" });
  }

  function openLibrary() {
    setLibrarySelection(templates.filter((template) => !template.id.startsWith("generated-")).map((template) => template.id));
    setLibraryQuery("");
    setLibraryOpen(true);
    showBuilderForDialog();
  }

  function openGenerate() {
    setGenerateOpen(true);
    showBuilderForDialog();
  }

  function addGeneratedTemplate(template: BuilderTemplate) {
    setTemplates((current) => [...current, template]);
    setTemplateId(template.id);
    setReviewError("");
    setGenerateOpen(false);
  }

  function toggleLibrary(id: string) {
    setLibrarySelection((current) => current.includes(id) ? current.filter((entry) => entry !== id) : [...current, id]);
  }

  function addFromLibrary() {
    const next = [
      ...libraryEntries.filter((entry) => librarySelection.includes(entry.id)).map(templateFromLibrary),
      ...templates.filter((template) => template.id.startsWith("generated-")),
    ];
    if (!next.length) return;
    setTemplates(next);
    if (!next.some((entry) => entry.id === templateId)) setTemplateId(next[0].id);
    setLibraryOpen(false);
  }

  function removeTemplate(id: string) {
    const remaining = templates.filter((template) => template.id !== id);
    setTemplates(remaining);
    if (templateId === id) setTemplateId(remaining[0]?.id ?? "");
  }

  useEffect(() => () => {
    if (toastTimer.current) clearTimeout(toastTimer.current);
    if (testToastTimer.current) clearTimeout(testToastTimer.current);
  }, []);

  useEffect(() => {
    if (!testOpen) return;
    testInput.current?.focus();
    function dismiss(event: PointerEvent) {
      if (!testPopover.current?.contains(event.target as Node)) setTestOpen(false);
    }
    function escape(event: globalThis.KeyboardEvent) {
      if (event.key === "Escape") setTestOpen(false);
    }
    document.addEventListener("pointerdown", dismiss);
    document.addEventListener("keydown", escape);
    return () => {
      document.removeEventListener("pointerdown", dismiss);
      document.removeEventListener("keydown", escape);
    };
  }, [testOpen]);

  function sendTest(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const addresses = [...new Set(testAddresses.split(/[\s,;]+/).map((address) => address.trim()).filter(Boolean))];
    if (!addresses.length) {
      setTestError("Enter at least one email address.");
      testInput.current?.focus();
      return;
    }
    if (addresses.some((address) => !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(address))) {
      setTestError("Check the email addresses and separate them with commas.");
      testInput.current?.focus();
      return;
    }
    setTestError("");
    setTestOpen(false);
    setTestSent({ count: addresses.length, template: t.name });
    if (testToastTimer.current) clearTimeout(testToastTimer.current);
    testToastTimer.current = setTimeout(() => setTestSent(null), 6000);
  }

  function openReview() {
    if (!campaignName.trim()) {
      setReviewError("Enter a campaign name before reviewing.");
      nameInput.current?.focus();
      return;
    }
    if (audienceType === "lists" && selectedLists.length === 0) {
      setReviewError("Select at least one Sublime list before reviewing.");
      return;
    }
    if (audienceType === "csv" && !csvFile) {
      setReviewError("Choose a CSV audience before reviewing.");
      return;
    }
    if (templates.length === 0) {
      setReviewError("Add at least one template before reviewing.");
      return;
    }
    setReviewError("");
    setReviewOpen(true);
    showBuilderForDialog();
  }

  function launchCampaign() {
    setReviewOpen(false);
    setLaunched(true);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setLaunched(false), 7000);
  }

  function acceptCsv(file?: File) {
    if (!file) return;
    if (!/\.csv$/i.test(file.name)) {
      setCsvError("Choose a .csv file to preview this audience.");
      return;
    }
    setCsvFile(file);
    setCsvError("");
  }

  function dropCsv(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setDragging(false);
    acceptCsv(event.dataTransfer.files[0]);
  }

  function toggleList(name: string) {
    setSelectedLists((current) => current.includes(name) ? current.filter((item) => item !== name) : [...current, name]);
  }

  return (
    <div ref={builderRoot} className={`cb${fit ? " cb--fit" : ""}`}>
      <div className="cb-app">
        <div className="cb-crumbs">
          <span className="cb-crumb">Phishing Simulations</span>
        </div>

        <div className="cb-head">
          <h4 className="cb-title">New Campaign</h4>
          <div className="cb-actions">
            <span className="cb-btn cb-btn--text">Cancel</span>
            <span className="cb-btn">Save Draft</span>
            <span className="cb-actions-sep" />
            <div className="cb-test-wrap" ref={testPopover}>
              <button type="button" className="cb-btn cb-btn--test" aria-expanded={testOpen} aria-controls={`${uid}-test-popover`} onClick={() => { setTestOpen((open) => !open); setTestError(""); }}>Send Test</button>
              {testOpen && <div className="cb-test-popover" id={`${uid}-test-popover`} role="dialog" aria-labelledby={`${uid}-test-title`}>
                <form onSubmit={sendTest} noValidate>
                  <h5 id={`${uid}-test-title`}>Send test preview</h5>
                  <p>Send a preview of the selected template to these addresses before sharing it with your organization.</p>
                  <span className="cb-test-template">Template: <strong>{t.name}</strong></span>
                  <label htmlFor={`${uid}-test-addresses`}>Email addresses</label>
                  <input ref={testInput} id={`${uid}-test-addresses`} type="text" inputMode="email" autoComplete="email" placeholder="name@example.com, another@example.com" value={testAddresses} aria-invalid={!!testError} aria-describedby={`${uid}-test-help${testError ? ` ${uid}-test-error` : ""}`} onChange={(event) => { setTestAddresses(event.target.value); setTestError(""); }} />
                  <small id={`${uid}-test-help`}>Separate multiple addresses with commas.</small>
                  {testError && <span className="cb-test-error" id={`${uid}-test-error`} role="alert">{testError}</span>}
                  <div className="cb-test-footer"><button type="button" onClick={() => setTestOpen(false)}>Cancel</button><button type="submit" disabled={!templates.length}>Send</button></div>
                </form>
              </div>}
            </div>
            <button type="button" className="cb-btn cb-btn--primary" onClick={openReview}>Review &amp; Launch</button>
          </div>
        </div>

        <div className="cb-body">
          <div className="cb-form">
            {reviewError && <p className="cb-review-error" role="alert">{reviewError}</p>}
            <div className="cb-field">
              <label htmlFor={`${uid}-name`}><Label required>Name</Label></label>
              <input ref={nameInput} id={`${uid}-name`} className="cb-text-input" value={campaignName} onChange={(event) => { setCampaignName(event.target.value); setReviewError(""); }} />
            </div>

            <div className="cb-field">
              <Label required info>
                Start
              </Label>
              <div className="cb-row">
                <div className="cb-date-control">
                  <button type="button" className="cb-picker-button" aria-label="Start date" aria-expanded={calendarOpen} onClick={() => setCalendarOpen((open) => !open)}>
                    <span>{dateLabel(startDate)}</span><Calendar className="cb-input-icon" aria-hidden="true" strokeWidth={2} />
                  </button>
                  {calendarOpen && (
                    <div className="cb-calendar" role="group" aria-label="Choose start date">
                      <div className="cb-calendar-head">
                        <button type="button" aria-label="Previous month" onClick={() => setCalendarMonth(new Date(calendarYear, calendarMonthIndex - 1, 1))}><ChevronLeft /></button>
                        <strong>{new Intl.DateTimeFormat("en-US", { month: "long", year: "numeric" }).format(calendarMonth)}</strong>
                        <button type="button" aria-label="Next month" onClick={() => setCalendarMonth(new Date(calendarYear, calendarMonthIndex + 1, 1))}><ChevronRight /></button>
                      </div>
                      <div className="cb-calendar-grid">
                        {(["S", "M", "T", "W", "T", "F", "S"] as const).map((day, index) => <span className="cb-calendar-weekday" key={index}>{day}</span>)}
                        {Array.from({ length: firstWeekday }, (_, index) => <span key={`blank-${index}`} />)}
                        {Array.from({ length: daysInMonth }, (_, index) => {
                          const value = dateValue(calendarYear, calendarMonthIndex, index + 1);
                          return <button key={value} type="button" aria-label={dateLabel(value)} aria-pressed={startDate === value} onClick={() => { setStartDate(value); setCalendarOpen(false); }}>{index + 1}</button>;
                        })}
                      </div>
                    </div>
                  )}
                </div>
                <SelectField id={`${uid}-time`} ariaLabel="Start time" className="cb-time" value={startTime} onChange={setStartTime} options={timeOptions.map((time) => ({ value: time, label: time }))} />
              </div>
            </div>

            <div className="cb-field">
              <label htmlFor={`${uid}-duration`}><Label required info>
                Duration
              </Label></label>
              <SelectField id={`${uid}-duration`} ariaLabel="Duration" value={durationHours} onChange={setDurationHours} options={durationOptions} />
            </div>

            <div className="cb-field">
              <label htmlFor={`${uid}-delivery`}><Label required info>
                Delivery Mode
              </Label></label>
              <SelectField id={`${uid}-delivery`} ariaLabel="Delivery Mode" value={deliveryMode} onChange={setDeliveryMode} options={deliveryOptions} />
            </div>

            <hr className="cb-rule" />

            <h5 className="cb-section">Audience</h5>

            <div className="cb-field">
              <label htmlFor={`${uid}-audience`}><Label required>Audience Type</Label></label>
              <SelectField id={`${uid}-audience`} ariaLabel="Audience Type" value={audienceType} onChange={(value) => { setAudienceType(value); setListsOpen(false); setReviewError(""); }} options={audienceOptions} />
            </div>

            {audienceType === "lists" ? <div className="cb-field">
              <div className="cb-label-row">
                <span className="cb-label cb-label--lg">
                  Lists
                  <span className="cb-req" aria-hidden="true">
                    *
                  </span>
                </span>
                <button type="button" className="cb-link" onClick={() => setListsOpen(true)}>
                  View All Lists
                  <SquareArrowOutUpRight aria-hidden="true" strokeWidth={2} />
                </button>
              </div>
              <div className="cb-list-picker">
                <div className="cb-multi-control">
                  <span className="cb-selected-lists">
                    {selectedLists.length ? selectedLists.map((name) => <span key={name} className="cb-chip">{name}<button type="button" aria-label={`Remove ${name}`} onClick={() => toggleList(name)}><X aria-hidden="true" strokeWidth={2} /></button></span>) : <span className="cb-placeholder">Select lists</span>}
                  </span>
                  <button type="button" className="cb-list-toggle" aria-label="Choose lists" aria-expanded={listsOpen} onClick={() => setListsOpen((open) => !open)}><ChevronDown className="cb-input-icon" aria-hidden="true" /></button>
                </div>
                {listsOpen && <div className="cb-list-options" role="group" aria-label="Available Sublime lists">
                  {listOptions.map((name) => <label key={name} className="cb-list-option"><input type="checkbox" checked={selectedLists.includes(name)} onChange={() => toggleList(name)} /><span>{name}</span></label>)}
                </div>}
              </div>
            </div> : <div className="cb-field">
              <Label required>CSV audience</Label>
              <input ref={fileInput} className="cb-visually-hidden" type="file" accept=".csv,text/csv" aria-label="Upload audience CSV" onChange={(event) => acceptCsv(event.target.files?.[0])} />
              <div className={`cb-dropzone${dragging ? " is-dragging" : ""}`} onDragOver={(event) => { event.preventDefault(); setDragging(true); }} onDragLeave={() => setDragging(false)} onDrop={dropCsv}>
                <Upload aria-hidden="true" strokeWidth={1.6} />
                {csvFile ? <><strong>{csvFile.name}</strong><span>{(csvFile.size / 1024).toFixed(1)} KB · CSV selected</span><button type="button" onClick={() => { setCsvFile(null); if (fileInput.current) fileInput.current.value = ""; }}>Remove file</button></> : <><strong>Drop a CSV here</strong><span>or choose a file from your device</span><button type="button" onClick={() => fileInput.current?.click()}>Choose CSV file</button></>}
              </div>
              {csvError && <p className="cb-field-error" role="alert">{csvError}</p>}
            </div>}

            <hr className="cb-rule" />

            <h5 className="cb-section">
              Templates
              <Info className="cb-info" aria-hidden="true" strokeWidth={1.5} />
            </h5>
            <div className="cb-small-btns">
              <button type="button" className="cb-small-btn" onClick={openGenerate}>
                <Sparkles strokeWidth={1.75} />
                Generate
              </button>
              <button type="button" className="cb-small-btn" onClick={openLibrary}>Add From Library</button>
            </div>
            <div className="cb-list" role="radiogroup" aria-label="Templates">
              {templates.map((x) => (
                <div key={x.id} className="cb-list-row" data-selected={x.id === templateId}>
                  <button type="button" role="radio" aria-checked={x.id === templateId} className="cb-list-select" onClick={() => setTemplateId(x.id)}>
                    <Mail aria-hidden="true" strokeWidth={1.5} />
                    <span>{x.name}</span>
                  </button>
                  <button type="button" className="cb-list-remove" aria-label={`Remove ${x.name}`} onClick={() => removeTemplate(x.id)}><X aria-hidden="true" /></button>
                </div>
              ))}
              {templates.length === 0 && <p className="cb-list-empty">No templates selected. Add one from the library.</p>}
            </div>

            <hr className="cb-rule" />

            <h5 className="cb-section">
              Notice &amp; training
              <Info className="cb-info" aria-hidden="true" strokeWidth={1.5} />
            </h5>
            <div className="cb-field">
              <Label required>Notice Page</Label>
              <Box icon={chevron}>Default training notice</Box>
            </div>
            <div className="cb-toggle-row">
              <button
                type="button"
                role="switch"
                aria-checked={training}
                aria-labelledby={`${uid}-training`}
                className="cb-switch"
                onClick={() => setTraining((v) => !v)}
              >
                <span className="cb-switch-thumb" />
              </button>
              <span className="cb-toggle-text">
                <span id={`${uid}-training`} className="cb-toggle-label">
                  Training
                </span>
                <span className="cb-muted">
                  {training ? "Employees who click take a 4-question quiz" : "Employees who click see the notice only"}
                </span>
              </span>
            </div>
          </div>

          <div className="cb-preview">
            {templates.length > 0 ? <div className="cb-preview-inner" aria-live="polite">
              <h5 className="cb-preview-title">{t.name}</h5>

              <div className="cb-row cb-row--even">
                <div className="cb-field">
                  <Label required>Sender Alias</Label>
                  <Box className="cb-input--white">{t.alias}</Box>
                </div>
                <div className="cb-field">
                  <Label required>Sender Email</Label>
                  <Box className="cb-input--white">{t.email}</Box>
                </div>
              </div>
              <div className="cb-field">
                <Label required>Subject</Label>
                <Box className="cb-input--white">{t.subject}</Box>
              </div>

              <div className="cb-card">
                <div className="cb-tabs" role="tablist" aria-label="Preview as">
                  <button
                    type="button"
                    role="tab"
                    aria-selected={view === "template"}
                    className="cb-tab"
                    onClick={() => setView("template")}
                  >
                    Template View
                  </button>
                  <button
                    type="button"
                    role="tab"
                    aria-selected={view === "user"}
                    className="cb-tab"
                    onClick={() => setView("user")}
                  >
                    User View
                  </button>
                </div>
                <EmailPreview t={t} view={view} />
              </div>
            </div> : <div className="cb-preview-empty">Add a template to see its preview.</div>}
          </div>
        </div>
      </div>
      {generateOpen && <div className="cb-review-overlay cb-generate-overlay" onKeyDown={(event) => { if (event.key === "Escape") setGenerateOpen(false); }} onMouseDown={(event) => { if (event.target === event.currentTarget) setGenerateOpen(false); }}>
        <Suspense fallback={<div className="cb-generate-loading" role="status">Opening template generator…</div>}>
          <AiGenerateModal onClose={() => setGenerateOpen(false)} onUse={addGeneratedTemplate} />
        </Suspense>
      </div>}
      {reviewOpen && <div className="cb-review-overlay" onKeyDown={(event) => { if (event.key === "Escape") setReviewOpen(false); }} onMouseDown={(event) => { if (event.target === event.currentTarget) setReviewOpen(false); }}>
        <section className="cb-review-modal" role="dialog" aria-modal="true" aria-labelledby={`${uid}-review-title`}>
          <div className="cb-review-header">
            <h4 id={`${uid}-review-title`}>Review &amp; Launch Campaign</h4>
            <button type="button" aria-label="Close review" autoFocus onClick={() => setReviewOpen(false)}><X aria-hidden="true" /></button>
          </div>
          <div className="cb-review-content">
            <p className="cb-review-intro">Simulation emails will begin sending according to your delivery settings. Results are tracked through 11:59 PM on the end date.</p>
            <div className="cb-review-summary">
              <h5>Campaign settings</h5>
              <div className="cb-review-row"><span>Campaign</span><strong>{campaignName.trim()}</strong></div>
              <div className="cb-review-row"><span>Schedule</span><strong>{new Intl.DateTimeFormat("en-US", { month: "long", day: "numeric", year: "numeric" }).format(localDate(startDate))} at {scheduleTime(startTime)} <span className="cb-review-arrow">→</span> {endLabel}{Number(durationHours) < 24 ? ` at ${endTimeLabel}` : ""} <small>· {durationLabel}</small></strong></div>
              <div className="cb-review-row"><span>Delivery</span><strong>{deliveryLabel}</strong></div>
              <div className="cb-review-row"><span>Recipients</span><strong>{audienceType === "csv" ? <>{csvFile?.name} <small>· Uploaded CSV</small></> : <>{selectedLists.join(", ")} <small>· {selectedLists.length} {selectedLists.length === 1 ? "list" : "lists"}</small></>}</strong></div>
              <h5>Templates</h5>
              <div className="cb-review-row"><span>Templates</span><strong>{templates.map((item) => item.name).join(", ")}<small className="cb-review-secondary">{templates.length === 1 ? "Each recipient receives this sample template." : `Each recipient is randomly assigned 1 of ${templates.length} sample templates.`}</small></strong></div>
              <h5>Training</h5>
              <div className="cb-review-row"><span>Post-click</span><strong>{training ? "On, show training after a simulated click" : "Off, show the notice only"}</strong></div>
              <div className="cb-review-row"><span>Headline</span><strong>This was a phishing simulation</strong></div>
            </div>
          </div>
          <div className="cb-review-footer">
            <button type="button" className="cb-review-back" onClick={() => setReviewOpen(false)}>Back</button>
            <button type="button" className="cb-review-launch" onClick={launchCampaign}>Launch Campaign <span aria-hidden="true">→</span></button>
          </div>
        </section>
      </div>}
      {libraryOpen && <div className="cb-review-overlay" onKeyDown={(event) => { if (event.key === "Escape") setLibraryOpen(false); }} onMouseDown={(event) => { if (event.target === event.currentTarget) setLibraryOpen(false); }}>
        <section className="cb-library-modal" role="dialog" aria-modal="true" aria-labelledby={`${uid}-library-title`}>
          <div className="cb-review-header"><h4 id={`${uid}-library-title`}>Add From Library</h4><button type="button" aria-label="Close library" onClick={() => setLibraryOpen(false)}><X aria-hidden="true" /></button></div>
          <div className="cb-library-content">
            <p>Choose existing templates to add to this campaign.</p>
            <label className="cb-library-search"><Search aria-hidden="true" /><input type="search" value={libraryQuery} onChange={(event) => setLibraryQuery(event.target.value)} placeholder="Search templates" aria-label="Search templates" /></label>
            {libraryGroups.map((group) => {
              const entries = libraryEntries.filter((entry) => entry.group === group && entry.name.toLowerCase().includes(libraryQuery.trim().toLowerCase()));
              if (!entries.length) return null;
              return <div className="cb-library-group" key={group}>
                <h5>{group} ({group === "All Templates" ? libraryEntries.length : entries.length})</h5>
                {entries.map((entry) => <label key={entry.id} className="cb-library-row">
                  <input type="checkbox" checked={librarySelection.includes(entry.id)} onChange={() => toggleLibrary(entry.id)} />
                  <span className="cb-library-name">{entry.name}</span>
                  <span className="cb-library-category">{entry.category === "Credential Phishing" ? <IdCard aria-hidden="true" /> : entry.category === "BEC / Fraud" ? <BriefcaseBusiness aria-hidden="true" /> : <Phone aria-hidden="true" />}{entry.category}</span>
                </label>)}
              </div>;
            })}
            {!libraryEntries.some((entry) => entry.name.toLowerCase().includes(libraryQuery.trim().toLowerCase())) && <p className="cb-library-empty">No templates match that search.</p>}
          </div>
          <div className="cb-library-footer"><button type="button" disabled={!librarySelection.length} onClick={addFromLibrary}>Add{librarySelection.length ? ` (${librarySelection.length})` : ""}</button></div>
        </section>
      </div>}
      {launched && createPortal(<div className="cb-success-toast" role="status"><span className="cb-success-mark" aria-hidden="true">✓</span><span><strong>Campaign Created</strong><small>{campaignName.trim()} is scheduled to send.</small></span><button type="button" aria-label="Dismiss confirmation" onClick={() => setLaunched(false)}><X aria-hidden="true" /></button></div>, document.body)}
      {testSent && createPortal(<div className="cb-success-toast cb-test-toast" role="status"><span className="cb-success-mark" aria-hidden="true">✓</span><span><strong>Test preview sent</strong><small>{testSent.template} · {testSent.count} {testSent.count === 1 ? "address" : "addresses"}</small></span><button type="button" aria-label="Dismiss test confirmation" onClick={() => setTestSent(null)}><X aria-hidden="true" /></button></div>, document.body)}
    </div>
  );
}
