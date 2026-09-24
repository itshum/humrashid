import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { Briefcase, Check, IdCard, Info, Mail, Phone, RotateCcw, Search, Sparkles, Trash2, X } from "lucide-react";
import { templateById } from "./acmeMock";
import { EmailPreview, Label, builderTemplates, chevron, type BuilderTemplate, type View } from "./CampaignBuilder";
import "./CampaignBuilder.css";
import "./AiGenerateStepper.css";

// The builder's Templates section with AI generation, rebuilt from the
// product: generation steps on the left, the live email preview on the
// right. Every email body here is one of the case study's existing Acme
// templates. Library entries and generated templates reuse those bodies
// and change only the name, category and sender details.

// --- Email bodies ---------------------------------------------------------

function fromAcme(id: string): BuilderTemplate {
  const a = templateById(id);
  return {
    id: a.id,
    name: a.name,
    alias: a.senderName,
    email: a.senderEmail,
    subject: a.subject.replace("{{recipient.first_name}}", "{{recipient_first_name}}"),
    avatar: a.avatar,
    // The preview adds its own greeting, and company names stay variables.
    body: a.body.slice(1).map((p) => p.replaceAll("{{company.name}}", "{{company_name}}")),
    cta: a.cta,
    ctaStyle: "dark",
  };
}

const bases: Record<string, BuilderTemplate> = {
  password: builderTemplates[0],
  mfa: builderTemplates[1],
  payroll: fromAcme("payroll"),
  benefits: fromAcme("benefits"),
  invoice: fromAcme("invoice"),
  fileshare: fromAcme("fileshare"),
};

// --- Library --------------------------------------------------------------

type Category = "cred" | "bec" | "callback";

const categories: Record<Category, { label: string; icon: ReactNode }> = {
  cred: { label: "Credential Phishing", icon: <IdCard aria-hidden="true" strokeWidth={1.75} /> },
  bec: { label: "BEC / Fraud", icon: <Briefcase aria-hidden="true" strokeWidth={1.75} /> },
  callback: { label: "Callback Phishing", icon: <Phone aria-hidden="true" strokeWidth={1.75} /> },
};

interface LibraryEntry {
  id: string;
  name: string;
  category: Category;
  base: keyof typeof bases;
}

const librarySections: { title: string; entries: LibraryEntry[] }[] = [
  {
    title: "Most active in the sample environment",
    entries: [
      { id: "sso-reset", name: "SSO Password Reset", category: "cred", base: "password" },
      { id: "suite-signin", name: "Office Suite Sign-In Alert", category: "cred", base: "password" },
      { id: "workspace-signin", name: "Workspace Sign-In Alert", category: "cred", base: "password" },
      { id: "ceo-wire", name: "CEO Urgent Wire Request", category: "bec", base: "invoice" },
      { id: "esign", name: "E-Signature Request", category: "cred", base: "fileshare" },
    ],
  },
  {
    title: "Recently Seen",
    entries: [
      { id: "mfa", name: "IT Helpdesk MFA Re-Enroll", category: "cred", base: "mfa" },
      { id: "vendor-bank", name: "Vendor Bank Detail Update", category: "bec", base: "invoice" },
      { id: "cloud-doc", name: "Cloud Shared Document", category: "cred", base: "fileshare" },
      { id: "callback", name: "IT Support Callback Notice", category: "callback", base: "mfa" },
      { id: "hr-policy", name: "HR Policy Acknowledgment", category: "cred", base: "fileshare" },
    ],
  },
  {
    title: "All Templates",
    entries: [
      { id: "open-enroll", name: "Open Enrollment Deadline", category: "cred", base: "benefits" },
      { id: "payroll-change", name: "Payroll Deposit Change", category: "bec", base: "payroll" },
      { id: "past-due", name: "Past-Due Invoice", category: "bec", base: "invoice" },
      { id: "password-expiry", name: "Password Expiry Notice", category: "cred", base: "password" },
      { id: "device-policy", name: "Device Policy Update", category: "cred", base: "fileshare" },
      { id: "missed-call", name: "Missed Call From IT", category: "callback", base: "mfa" },
    ],
  },
];

const libraryEntries = librarySections.flatMap((s) => s.entries);

// --- Generator inputs -----------------------------------------------------

const attackTypes = [
  {
    name: "Credential phishing",
    signal: "Most active",
    themes: [
      { name: "Payroll", base: "payroll" },
      { name: "Benefits", base: "benefits" },
      { name: "Password expiry", base: "password" },
      { name: "MFA re-enrollment", base: "mfa" },
    ],
  },
  { name: "Invoice fraud", signal: "Seen recently", themes: [{ name: "Accounts payable", base: "invoice" }] },
  { name: "Malicious file share", signal: "Seen recently", themes: [{ name: "IT", base: "fileshare" }] },
] as const;

const difficulties = ["Low", "Medium", "High"] as const;
const vendorScopes = ["In your environment", "Not in your environment", "Fictional"] as const;

// A made-up message link on a reserved .example domain.
const SAMPLE_MESSAGE = "https://platform.example/messages/7c1e94b2-3f0a-4d6e-b58c-2a9f41d07e63";

// The demo's "generation" is a short pause; the product promises 30s or less.
const GENERATE_MS = 2800;

interface CampaignTemplate extends BuilderTemplate {
  ai?: boolean;
  libraryId?: string;
}

type Step = 1 | 2 | 3;
type Focus = { kind: "draft" } | { kind: "list"; id: string } | null;

// --- Small pieces ---------------------------------------------------------

function Segmented<T extends string>({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: readonly T[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <div className="cb-field">
      <Label>{label}</Label>
      <div className="ag-seg" role="radiogroup" aria-label={label}>
        {options.map((o) => (
          <button key={o} type="button" role="radio" aria-checked={o === value} onClick={() => onChange(o)}>
            {o}
          </button>
        ))}
      </div>
    </div>
  );
}

function CategoryPill({ category }: { category: Category }) {
  const c = categories[category];
  return (
    <span className="ag-pill">
      {c.icon}
      {c.label}
    </span>
  );
}

function Sparkle() {
  return (
    <svg className="ag-sparkle" viewBox="0 0 64 64" aria-hidden="true">
      <defs>
        <linearGradient id="ag-spark-a" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#7fe3b3" />
          <stop offset="0.55" stopColor="#35b98a" />
          <stop offset="1" stopColor="#f2c98a" />
        </linearGradient>
      </defs>
      <path d="M26 8c1.8 11 5.9 15.2 17 17-11.1 1.8-15.2 5.9-17 17-1.8-11.1-5.9-15.2-17-17 11.1-1.8 15.2-6 17-17Z" fill="url(#ag-spark-a)" />
      <path d="M48 4c.8 4.6 2.5 6.3 7 7-4.5.8-6.2 2.5-7 7-.8-4.5-2.5-6.2-7-7 4.5-.7 6.2-2.4 7-7Z" fill="#35b98a" />
    </svg>
  );
}

// --- Add From Library modal -----------------------------------------------

function LibraryModal({
  added,
  onAdd,
  onClose,
}: {
  added: Set<string>;
  onAdd: (ids: string[]) => void;
  onClose: () => void;
}) {
  const [query, setQuery] = useState("");
  const [picked, setPicked] = useState<Set<string>>(new Set());
  const searchRef = useRef<HTMLInputElement>(null);
  const titleId = useId();
  const closeRef = useRef(onClose);
  closeRef.current = onClose;

  useEffect(() => {
    searchRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeRef.current();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  const q = query.trim().toLowerCase();
  const toggle = (id: string) =>
    setPicked((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  return (
    <div className="ag-backdrop" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className="ag-modal" role="dialog" aria-modal="true" aria-labelledby={titleId}>
        <div className="ag-modal-head">
          <h5 id={titleId}>Add From Library</h5>
          <button type="button" className="ag-icon-btn" aria-label="Close" onClick={onClose}>
            <X strokeWidth={1.75} />
          </button>
        </div>
        <div className="ag-modal-body">
          <p>Choose existing templates to add to this campaign.</p>
          <label className="cb-input ag-search">
            <Search aria-hidden="true" strokeWidth={1.75} />
            <input
              ref={searchRef}
              type="search"
              placeholder="Search templates"
              aria-label="Search templates"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </label>
          {librarySections.map((section) => {
            const entries = section.entries.filter((e) => e.name.toLowerCase().includes(q));
            if (entries.length === 0) return null;
            return (
              <div key={section.title} className="ag-lib-section">
                <p className="ag-lib-title">
                  {section.title} ({entries.length})
                </p>
                {entries.map((e) => {
                  const already = added.has(e.id);
                  const checked = already || picked.has(e.id);
                  return (
                    <label key={e.id} className={`ag-lib-row${already ? " is-added" : ""}`}>
                      <input type="checkbox" checked={checked} disabled={already} onChange={() => toggle(e.id)} />
                      <span className="ag-check" aria-hidden="true">
                        <Check strokeWidth={3} />
                      </span>
                      <span className="ag-lib-name">{e.name}</span>
                      <CategoryPill category={e.category} />
                    </label>
                  );
                })}
              </div>
            );
          })}
          {librarySections.every((s) => !s.entries.some((e) => e.name.toLowerCase().includes(q))) && (
            <p className="ag-lib-empty">No templates match "{query}".</p>
          )}
        </div>
        <div className="ag-modal-foot">
          <button
            type="button"
            className="cb-btn cb-btn--primary ag-add-btn"
            disabled={picked.size === 0}
            onClick={() => onAdd([...picked])}
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
}

// --- Main -----------------------------------------------------------------

export default function AiGenerateStepper() {
  const uid = useId();

  // Campaign templates and what the preview shows.
  const [list, setList] = useState<CampaignTemplate[]>([]);
  const [focus, setFocus] = useState<Focus>(null);
  const [view, setView] = useState<View>("template");
  const [libraryOpen, setLibraryOpen] = useState(false);
  const libraryBtnRef = useRef<HTMLButtonElement>(null);

  // Generator.
  const [genOpen, setGenOpen] = useState(true);
  const [step, setStep] = useState<Step>(1);
  const [grounded, setGrounded] = useState(true);
  const [messageId, setMessageId] = useState(SAMPLE_MESSAGE);
  const [attackIdx, setAttackIdx] = useState(0);
  const [themeIdx, setThemeIdx] = useState(0);
  const [difficulty, setDifficulty] = useState<(typeof difficulties)[number]>("Medium");
  const [vendorScope, setVendorScope] = useState<(typeof vendorScopes)[number]>("In your environment");
  const [prompt, setPrompt] = useState("");
  const [generating, setGenerating] = useState(false);
  const [draft, setDraft] = useState<CampaignTemplate | null>(null);
  const aiCount = useRef(0);
  const stepHeadingRef = useRef<HTMLHeadingElement>(null);
  const firstRender = useRef(true);

  const attack = attackTypes[attackIdx];
  const theme = attack.themes[Math.min(themeIdx, attack.themes.length - 1)];

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    stepHeadingRef.current?.focus();
  }, [step]);

  useEffect(() => {
    if (!generating) return;
    const timer = window.setTimeout(() => {
      const base = bases[theme.base];
      aiCount.current += 1;
      setDraft({ ...base, id: `ai-${aiCount.current}`, ai: true });
      setGenerating(false);
    }, GENERATE_MS);
    return () => window.clearTimeout(timer);
  }, [generating, theme.base]);

  function generate() {
    setDraft(null);
    setGenerating(true);
    setFocus({ kind: "draft" });
    setStep(3);
  }

  function addDraft() {
    if (!draft) return;
    setList((l) => [...l, draft]);
    setFocus({ kind: "list", id: draft.id });
    setDraft(null);
    setGenOpen(false);
    setStep(1);
  }

  function openGenerator() {
    setGenOpen(true);
    setStep(1);
    setDraft(null);
    setGenerating(false);
  }

  function addFromLibrary(ids: string[]) {
    const entries = libraryEntries.filter((e) => ids.includes(e.id));
    const added = entries.map((e) => ({ ...bases[e.base], id: `lib-${e.id}`, name: e.name, libraryId: e.id }));
    setList((l) => [...l, ...added]);
    if (added.length) setFocus({ kind: "list", id: added[added.length - 1].id });
    setLibraryOpen(false);
    libraryBtnRef.current?.focus();
  }

  function remove(id: string) {
    setList((l) => l.filter((x) => x.id !== id));
    if (focus?.kind === "list" && focus.id === id) setFocus(null);
  }

  // Inline edits to sender details: variables only, never the body.
  function edit(field: "alias" | "email" | "subject", value: string) {
    if (focus?.kind === "draft") setDraft((d) => (d ? { ...d, [field]: value } : d));
    else if (focus?.kind === "list") setList((l) => l.map((x) => (x.id === focus.id ? { ...x, [field]: value } : x)));
  }

  const shown: CampaignTemplate | null =
    focus?.kind === "draft" ? draft : focus?.kind === "list" ? (list.find((x) => x.id === focus.id) ?? null) : null;
  const loading = focus?.kind === "draft" && generating;
  const addedLibraryIds = new Set(list.map((x) => x.libraryId).filter((x): x is string => !!x));
  const shortId = messageId.split("/").pop() ?? messageId;

  return (
    <div className="cb">
      <div className="cb-app ag-app">
        <div className="cb-crumbs">
          <span className="cb-crumb">Phishing Simulations</span>
        </div>
        <div className="cb-head">
          <h4 className="cb-title">New Campaign</h4>
          <div className="cb-actions" aria-hidden="true">
            <span className="cb-btn cb-btn--text">Cancel</span>
            <span className="cb-btn">Save Draft</span>
            <span className="cb-actions-sep" />
            <span className="cb-btn">Send Test</span>
            <span className="cb-btn cb-btn--primary">Review &amp; Launch</span>
          </div>
        </div>

        <div className="cb-body">
          {/* Left: templates and the generation steps */}
          <div className="cb-form ag-form">
            <h5 className="cb-section">
              Templates
              <Info className="cb-info" aria-hidden="true" strokeWidth={1.5} />
            </h5>
            <div className="cb-small-btns">
              <button type="button" className="cb-small-btn" aria-pressed={genOpen} onClick={openGenerator}>
                <Sparkles strokeWidth={1.75} />
                Generate
              </button>
              <button type="button" className="cb-small-btn" ref={libraryBtnRef} onClick={() => setLibraryOpen(true)}>
                Add From Library
              </button>
            </div>
            {list.length === 0 ? (
              <div className="ag-empty-list">No templates added</div>
            ) : (
              <div className="cb-list" role="radiogroup" aria-label="Templates">
                {list.map((x) => (
                  <div key={x.id} className="ag-list-item">
                    <button
                      type="button"
                      role="radio"
                      aria-checked={focus?.kind === "list" && focus.id === x.id}
                      className="cb-list-row"
                      onClick={() => setFocus({ kind: "list", id: x.id })}
                    >
                      {x.ai ? <Sparkles aria-hidden="true" strokeWidth={1.5} /> : <Mail aria-hidden="true" strokeWidth={1.5} />}
                      {x.name}
                    </button>
                    <button type="button" className="ag-remove" aria-label={`Remove ${x.name}`} onClick={() => remove(x.id)}>
                      <Trash2 strokeWidth={1.5} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {genOpen && (
              <>
                <hr className="cb-rule" />
                <div className="ag-gen">
                  <div className="ag-gen-head">
                    <span>Generate a template with AI</span>
                    <span className="cb-muted">{step} of 3</span>
                  </div>
                  <div className="ag-bars" aria-hidden="true">
                    {[1, 2, 3].map((n) => (
                      <span key={n} className={n <= step ? "is-on" : ""} />
                    ))}
                  </div>

                  {step === 1 && (
                    <div className="ag-step">
                      <h6 ref={stepHeadingRef} tabIndex={-1}>
                        Start from a real attack
                      </h6>
                      <div className="cb-toggle-row">
                        <button
                          type="button"
                          role="switch"
                          aria-checked={grounded}
                          aria-labelledby={`${uid}-ground`}
                          className="cb-switch"
                          onClick={() => setGrounded((v) => !v)}
                        >
                          <span className="cb-switch-thumb" />
                        </button>
                        <span className="cb-toggle-text">
                          <span id={`${uid}-ground`} className="cb-toggle-label">
                            Ground in malicious email I've received
                          </span>
                          <span className="cb-muted">
                            {grounded
                              ? "Based on fictional sample data."
                              : "Generated from your inputs alone."}
                          </span>
                        </span>
                      </div>
                      {grounded && (
                        <div className="cb-field">
                          <label className="cb-label" htmlFor={`${uid}-msg`}>
                            Message ID <span className="cb-muted">(optional)</span>
                          </label>
                          <input
                            id={`${uid}-msg`}
                            className="cb-input ag-text"
                            value={messageId}
                            onChange={(e) => setMessageId(e.target.value)}
                            spellCheck={false}
                          />
                          <span className="ag-hint">Use a sample message link to preview the flow.</span>
                        </div>
                      )}
                      <div className="ag-actions">
                        <button type="button" className="cb-btn cb-btn--primary" onClick={() => setStep(2)}>
                          Next
                        </button>
                      </div>
                    </div>
                  )}

                  {step === 2 && (
                    <div className="ag-step">
                      <h6 ref={stepHeadingRef} tabIndex={-1}>
                        Refine it
                      </h6>
                      <p className="ag-summary">
                        {grounded ? (messageId.trim() ? `Grounded in message ${shortId.slice(0, 8)}` : "Grounded in your environment") : "Not grounded"}
                      </p>
                      <div className="cb-field">
                        <label className="cb-label" htmlFor={`${uid}-attack`}>
                          Attack type
                        </label>
                        <span className="cb-input ag-select">
                          <select
                            id={`${uid}-attack`}
                            value={attackIdx}
                            onChange={(e) => {
                              setAttackIdx(Number(e.target.value));
                              setThemeIdx(0);
                            }}
                          >
                            {attackTypes.map((a, i) => (
                              <option key={a.name} value={i}>
                                {a.name} ({a.signal.toLowerCase()})
                              </option>
                            ))}
                          </select>
                          {chevron}
                        </span>
                      </div>
                      <div className="cb-field">
                        <label className="cb-label" htmlFor={`${uid}-theme`}>
                          Theme
                        </label>
                        <span className="cb-input ag-select">
                          <select id={`${uid}-theme`} value={themeIdx} onChange={(e) => setThemeIdx(Number(e.target.value))}>
                            {attack.themes.map((t, i) => (
                              <option key={t.name} value={i}>
                                {t.name}
                              </option>
                            ))}
                          </select>
                          {chevron}
                        </span>
                      </div>
                      <Segmented label="Difficulty" options={difficulties} value={difficulty} onChange={setDifficulty} />
                      <Segmented label="Vendor scope" options={vendorScopes} value={vendorScope} onChange={setVendorScope} />
                      <div className="cb-field">
                        <label className="cb-label" htmlFor={`${uid}-prompt`}>
                          Prompt <span className="cb-muted">(optional)</span>
                        </label>
                        <textarea
                          id={`${uid}-prompt`}
                          className="cb-input ag-textarea"
                          rows={2}
                          placeholder="e.g. Use a generic training theme"
                          value={prompt}
                          onChange={(e) => setPrompt(e.target.value)}
                        />
                      </div>
                      <div className="ag-actions">
                        <button type="button" className="cb-btn" onClick={() => setStep(1)}>
                          Back
                        </button>
                        <button type="button" className="cb-btn cb-btn--primary" onClick={generate}>
                          <Sparkles className="ag-btn-icon" strokeWidth={1.75} aria-hidden="true" />
                          Generate
                        </button>
                      </div>
                    </div>
                  )}

                  {step === 3 && (
                    <div className="ag-step">
                      <h6 ref={stepHeadingRef} tabIndex={-1}>
                        {generating ? "Generating…" : "Your template is ready"}
                      </h6>
                      <div className="ag-tags">
                        <span className="ag-tag ag-tag--ai">AI generated</span>
                        <span className="ag-tag">{attack.name}</span>
                        <span className="ag-tag">{difficulty} difficulty</span>
                        <span className="ag-tag">Vendor: {vendorScope.toLowerCase()}</span>
                      </div>
                      <p className="ag-hint">
                        Edit the sender and subject in the preview. The body only changes by regenerating, so it can
                        never be rewritten by hand.
                      </p>
                      <div className="ag-actions">
                        <button type="button" className="cb-btn" onClick={() => setStep(2)} disabled={generating}>
                          Back
                        </button>
                        <button type="button" className="cb-btn" onClick={generate} disabled={generating}>
                          <RotateCcw className="ag-btn-icon" strokeWidth={1.75} aria-hidden="true" />
                          Regenerate
                        </button>
                        <button type="button" className="cb-btn cb-btn--primary" onClick={addDraft} disabled={generating || !draft}>
                          Add to campaign
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Right: live preview */}
          <div className="cb-preview">
            <div className="cb-preview-inner ag-preview" aria-live="polite">
              {!shown && !loading ? (
                <div className="ag-preview-empty">
                  <Mail aria-hidden="true" strokeWidth={1.25} />
                  <p>Generate a template or add one from the library to preview it here.</p>
                </div>
              ) : (
                <>
                  <h5 className="cb-preview-title">{loading ? "New AI template" : shown?.name}</h5>
                  <div className="cb-row cb-row--even">
                    <div className="cb-field">
                      <Label required>Sender Alias</Label>
                      <input
                        className="cb-input cb-input--white ag-text"
                        aria-label="Sender alias"
                        placeholder="Sender name"
                        disabled={loading}
                        value={loading ? "" : (shown?.alias ?? "")}
                        onChange={(e) => edit("alias", e.target.value)}
                      />
                    </div>
                    <div className="cb-field">
                      <Label required>Sender Email</Label>
                      <input
                        className="cb-input cb-input--white ag-text"
                        aria-label="Sender email"
                        placeholder="name@domain.example"
                        disabled={loading}
                        value={loading ? "" : (shown?.email ?? "")}
                        onChange={(e) => edit("email", e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="cb-field">
                    <Label required info>
                      Subject
                    </Label>
                    <input
                      className="cb-input cb-input--white ag-text"
                      aria-label="Subject"
                      placeholder="Hey {{recipient_first_name}}, ..."
                      disabled={loading}
                      value={loading ? "" : (shown?.subject ?? "")}
                      onChange={(e) => edit("subject", e.target.value)}
                    />
                  </div>

                  {loading ? (
                    <div className="ag-loading" role="status">
                      <Sparkle />
                      <p className="ag-loading-title">Reviewing sample data...</p>
                      <p className="ag-loading-sub">
                        We're tailoring this to the threats and brands your team actually sees. Hang tight while we put
                        the finishing touches.
                      </p>
                      <span className="ag-progress" aria-hidden="true">
                        <span />
                      </span>
                    </div>
                  ) : (
                    shown && (
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
                        <EmailPreview t={shown} view={view} />
                      </div>
                    )
                  )}
                </>
              )}
            </div>
          </div>
        </div>

        {libraryOpen && (
          <LibraryModal
            added={addedLibraryIds}
            onAdd={addFromLibrary}
            onClose={() => {
              setLibraryOpen(false);
              libraryBtnRef.current?.focus();
            }}
          />
        )}
      </div>
    </div>
  );
}
