import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { Check, RotateCcw, X } from "lucide-react";
import { templateById } from "./acmeMock";
import { EmailPreview, Label, builderTemplates, chevron, type BuilderTemplate, type View } from "./CampaignBuilder";
import "./CampaignBuilder.css";
import "./AiGenerateModal.css";

// AI template generation, rebuilt from the product's Generate Template
// modal: three steps inside the modal on the left, and only the email
// preview on the right, filling in as it generates. (AiGenerateStepper
// is the same flow inside the full builder, kept for wiring into the
// hero builder.) Every email body is one of the case study's existing
// Acme templates; generation only picks which one.

// --- Email bodies ---------------------------------------------------------

function fromAcme(id: string): BuilderTemplate {
  const a = templateById(id);
  return {
    id: a.id,
    name: a.name,
    alias: a.senderName,
    email: a.senderEmail,
    subject: a.subject,
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

// --- Inputs ---------------------------------------------------------------

const attackTypes = [
  {
    name: "Credential phishing",
    themes: [
      { name: "Password expiry", base: "password" },
      { name: "MFA re-enrollment", base: "mfa" },
      { name: "Payroll", base: "payroll" },
      { name: "Benefits", base: "benefits" },
    ],
  },
  { name: "Invoice fraud", themes: [{ name: "Accounts payable", base: "invoice" }] },
  { name: "Malicious file share", themes: [{ name: "IT", base: "fileshare" }] },
] as const;

const difficulties = ["Low", "Medium", "High"] as const;
const vendorScopes = ["In your environment", "Not in your environment", "Fictional"] as const;

// A made-up message link on a reserved .example domain.
const SAMPLE_URL = "https://platform.example/messages/7c1e94b2-3f0a-4d6e-b58c-2a9f41d07e63";

// The demo's "generation" is a short pause; the product promises 30s or less.
const GENERATE_MS = 2800;

type Source = "environment" | "scenario";
type Seed = "sample" | "specific";
type Step = 1 | 2 | 3;

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
      <div className="gm-seg" role="radiogroup" aria-label={label}>
        {options.map((o) => (
          <button key={o} type="button" role="radio" aria-checked={o === value} onClick={() => onChange(o)}>
            {o}
          </button>
        ))}
      </div>
    </div>
  );
}

function Select({
  label,
  value,
  placeholder,
  options,
  onChange,
}: {
  label: string;
  value: string;
  placeholder?: string;
  options: readonly string[];
  onChange: (v: string) => void;
}) {
  return (
    <span className={`cb-input gm-select${value ? "" : " is-empty"}`}>
      <select aria-label={label} value={value} onChange={(e) => onChange(e.target.value)}>
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
      {chevron}
    </span>
  );
}

function Sparkle({ className = "" }: { className?: string }) {
  const id = useId();
  return (
    <svg className={`gm-sparkle ${className}`} viewBox="0 0 64 64" aria-hidden="true">
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#7fe3b3" />
          <stop offset="0.55" stopColor="#35b98a" />
          <stop offset="1" stopColor="#f2c98a" />
        </linearGradient>
      </defs>
      <path d="M26 8c1.8 11 5.9 15.2 17 17-11.1 1.8-15.2 5.9-17 17-1.8-11.1-5.9-15.2-17-17 11.1-1.8 15.2-6 17-17Z" fill={`url(#${id})`} />
      <path d="M48 4c.8 4.6 2.5 6.3 7 7-4.5.8-6.2 2.5-7 7-.8-4.5-2.5-6.2-7-7 4.5-.7 6.2-2.4 7-7Z" fill="#35b98a" />
    </svg>
  );
}

function RadioCard({
  checked,
  title,
  desc,
  onSelect,
  children,
}: {
  checked: boolean;
  title: string;
  desc: string;
  onSelect: () => void;
  children?: ReactNode;
}) {
  return (
    <div className={`gm-card${checked ? " is-checked" : ""}`}>
      <button type="button" role="radio" aria-checked={checked} className="gm-card-head" onClick={onSelect}>
        <span className="gm-radio" aria-hidden="true">
          <Check strokeWidth={3} />
        </span>
        <span className="gm-card-text">
          <span className="gm-card-title">{title}</span>
          <span className="gm-card-desc">{desc}</span>
        </span>
      </button>
      {checked && children && <div className="gm-card-body">{children}</div>}
    </div>
  );
}

// --- Main -----------------------------------------------------------------

export default function AiGenerateModal() {
  const uid = useId();
  const arrowId = `gm-arrow-${uid.replace(/:/g, "")}`;
  const [step, setStep] = useState<Step>(1);
  const [source, setSource] = useState<Source>("environment");
  const [seed, setSeed] = useState<Seed>("sample");
  const [attackName, setAttackName] = useState("");
  const [url, setUrl] = useState(SAMPLE_URL);
  const [themeName, setThemeName] = useState("");
  const [difficulty, setDifficulty] = useState<(typeof difficulties)[number]>("Medium");
  const [vendorScope, setVendorScope] = useState<(typeof vendorScopes)[number]>("In your environment");
  const [prompt, setPrompt] = useState("");
  const [generating, setGenerating] = useState(false);
  const [result, setResult] = useState<BuilderTemplate | null>(null);
  const [added, setAdded] = useState(false);
  const [view, setView] = useState<View>("template");
  const headingRef = useRef<HTMLParagraphElement>(null);
  const firstRender = useRef(true);

  // A specific message carries its own attack; the demo reads it as the
  // password-expiry email.
  const fromSpecific = source === "environment" && seed === "specific";
  const attack = attackTypes.find((a) => a.name === attackName);
  const theme = attack?.themes.find((t) => t.name === themeName) ?? attack?.themes[0];
  const baseId = fromSpecific ? "password" : (theme?.base ?? "password");
  const canContinue = fromSpecific ? url.trim().length > 0 : !!attack;

  // Move focus to each new step so keyboard and screen reader users land
  // on the content that just changed.
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    headingRef.current?.focus();
  }, [step]);

  useEffect(() => {
    if (!generating) return;
    const timer = window.setTimeout(() => {
      setResult({ ...bases[baseId] });
      setGenerating(false);
    }, GENERATE_MS);
    return () => window.clearTimeout(timer);
  }, [generating, baseId]);

  function generate() {
    setResult(null);
    setAdded(false);
    setGenerating(true);
    setStep(3);
  }

  function startOver() {
    setStep(1);
    setSource("environment");
    setSeed("sample");
    setAttackName("");
    setUrl(SAMPLE_URL);
    setThemeName("");
    setPrompt("");
    setGenerating(false);
    setResult(null);
    setAdded(false);
  }

  // Inline edits to sender details: variables only, never the body.
  function edit(field: "alias" | "email" | "subject", value: string) {
    setResult((r) => (r ? { ...r, [field]: value } : r));
  }

  const attackField = (
    <div className="cb-field">
      <Label required>Attack type</Label>
      <Select
        label="Attack type"
        value={attackName}
        placeholder="Select attack type"
        options={attackTypes.map((a) => a.name)}
        onChange={(v) => {
          setAttackName(v);
          setThemeName("");
        }}
      />
    </div>
  );

  return (
    <div className="cb">
      <div className="cb-app gm-app">
        {/* Left: the Generate Template modal */}
        <div className="gm-modal" role="group" aria-labelledby={`${uid}-title`}>
          <div className="gm-modal-head">
            <h5 id={`${uid}-title`}>Generate Template</h5>
            <button type="button" className="gm-icon-btn" aria-label="Start over" onClick={startOver}>
              <X strokeWidth={1.75} />
            </button>
          </div>
          <div className="gm-bars" aria-hidden="true">
            {[1, 2, 3].map((n) => (
              <span key={n} className={n <= step ? "is-on" : ""} />
            ))}
          </div>

          <div className="gm-modal-body">
            {step === 1 && (
              <>
                <div className="gm-tabs" role="radiogroup" aria-label="Generate from">
                  {(
                    [
                      ["environment", "From My Environment"],
                      ["scenario", "From a Scenario"],
                    ] as const
                  ).map(([id, label]) => (
                    <button key={id} type="button" role="radio" aria-checked={source === id} onClick={() => setSource(id)}>
                      {label}
                    </button>
                  ))}
                </div>
                <p className="gm-lede" ref={headingRef} tabIndex={-1}>
                  {source === "environment"
                    ? "Generate a new template from messages in your org."
                    : "Generate a new template from a scenario you choose."}
                </p>
                {source === "environment" ? (
                  <div className="gm-cards" role="radiogroup" aria-label="Start from">
                    <RadioCard
                      checked={seed === "sample"}
                      title="Message sample"
                      desc="We'll use an exact match if we find one, or similar messages if not."
                      onSelect={() => setSeed("sample")}
                    >
                      {attackField}
                    </RadioCard>
                    <RadioCard
                      checked={seed === "specific"}
                      title="Specific message"
                      desc="Use a sample message link to preview the flow."
                      onSelect={() => setSeed("specific")}
                    >
                      <div className="cb-field">
                        <Label required>Message URL</Label>
                        <input
                          className="cb-input gm-text"
                          aria-label="Message URL"
                          value={url}
                          spellCheck={false}
                          onChange={(e) => setUrl(e.target.value)}
                        />
                      </div>
                    </RadioCard>
                  </div>
                ) : (
                  <div className="gm-scenario">{attackField}</div>
                )}
              </>
            )}

            {step === 2 && (
              <>
                <p className="gm-step-title" ref={headingRef} tabIndex={-1}>
                  Refine it
                </p>
                <p className="gm-summary">
                  {fromSpecific
                    ? `Remixing message ${url.split("/").pop()?.slice(0, 8) ?? ""}`
                    : `${attack?.name}, ${source === "environment" ? "from your environment" : "from a scenario"}`}
                </p>
                {!fromSpecific && attack && (
                  <div className="cb-field">
                    <Label>Theme</Label>
                    <Select
                      label="Theme"
                      value={theme?.name ?? ""}
                      options={attack.themes.map((t) => t.name)}
                      onChange={setThemeName}
                    />
                  </div>
                )}
                <Segmented label="Difficulty" options={difficulties} value={difficulty} onChange={setDifficulty} />
                <Segmented label="Vendor scope" options={vendorScopes} value={vendorScope} onChange={setVendorScope} />
                <div className="cb-field">
                  <label className="cb-label" htmlFor={`${uid}-prompt`}>
                    Prompt <span className="cb-muted">(optional)</span>
                  </label>
                  <textarea
                    id={`${uid}-prompt`}
                    className="cb-input gm-textarea"
                    rows={2}
                    placeholder="e.g. Use a generic training theme"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                  />
                </div>
              </>
            )}

            {step === 3 && (
              <>
                <p className="gm-step-title" ref={headingRef} tabIndex={-1}>
                  {generating ? "Generating your template…" : "Your template is ready"}
                </p>
                <div className="gm-tags">
                  <span className="gm-tag gm-tag--ai">AI generated</span>
                  {!fromSpecific && attack && <span className="gm-tag">{attack.name}</span>}
                  <span className="gm-tag">{difficulty} difficulty</span>
                  <span className="gm-tag">Vendor: {vendorScope.toLowerCase()}</span>
                </div>
                <div className="cb-row cb-row--even">
                  <div className="cb-field">
                    <Label required>Sender Alias</Label>
                    <input
                      className="cb-input gm-text"
                      aria-label="Sender alias"
                      disabled={!result}
                      value={result?.alias ?? ""}
                      onChange={(e) => edit("alias", e.target.value)}
                    />
                  </div>
                  <div className="cb-field">
                    <Label required>Sender Email</Label>
                    <input
                      className="cb-input gm-text"
                      aria-label="Sender email"
                      disabled={!result}
                      value={result?.email ?? ""}
                      onChange={(e) => edit("email", e.target.value)}
                    />
                  </div>
                </div>
                <div className="cb-field">
                  <Label required>Subject</Label>
                  <input
                    className="cb-input gm-text"
                    aria-label="Subject"
                    disabled={!result}
                    value={result?.subject ?? ""}
                    onChange={(e) => edit("subject", e.target.value)}
                  />
                </div>
                <p className="gm-hint">
                  Sender details are editable. The body only changes by regenerating, so it can never be rewritten by
                  hand.
                </p>
              </>
            )}
          </div>

          <div className="gm-modal-foot">
            <span className="gm-count">Step {step} of 3</span>
            <div className="gm-actions">
              {step === 1 && (
                <button type="button" className="cb-btn cb-btn--primary" disabled={!canContinue} onClick={() => setStep(2)}>
                  Next
                </button>
              )}
              {step === 2 && (
                <>
                  <button type="button" className="cb-btn" onClick={() => setStep(1)}>
                    Back
                  </button>
                  <button type="button" className="cb-btn cb-btn--primary" onClick={generate}>
                    Generate
                  </button>
                </>
              )}
              {step === 3 && (
                <>
                  <button type="button" className="cb-btn" disabled={generating} onClick={generate}>
                    <RotateCcw className="gm-btn-icon" strokeWidth={1.75} aria-hidden="true" />
                    Regenerate
                  </button>
                  <button
                    type="button"
                    className="cb-btn cb-btn--primary"
                    disabled={generating || !result || added}
                    onClick={() => setAdded(true)}
                  >
                    {added ? (
                      <>
                        <Check className="gm-btn-icon" strokeWidth={2.25} aria-hidden="true" />
                        Added
                      </>
                    ) : (
                      "Use in campaign"
                    )}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Same connector as the case study's diagrams: a hairline with a
            small filled head. */}
        <svg className={`gm-arrow${generating ? " is-active" : ""}`} viewBox="0 0 80 8" aria-hidden="true">
          <defs>
            <marker id={arrowId} viewBox="0 0 8 8" refX="7" refY="4" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M0,0 L8,4 L0,8 z" className="gm-arrowhead" />
            </marker>
          </defs>
          <line x1="0" y1="4" x2="78" y2="4" markerEnd={`url(#${arrowId})`} />
        </svg>

        {/* Right: the email preview only */}
        <div className="gm-preview" aria-live="polite">
          <div className="cb-card">
            <div className="cb-tabs" role="tablist" aria-label="Preview as">
              <button
                type="button"
                role="tab"
                aria-selected={view === "template"}
                className="cb-tab"
                disabled={!result}
                onClick={() => setView("template")}
              >
                Template View
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={view === "user"}
                className="cb-tab"
                disabled={!result}
                onClick={() => setView("user")}
              >
                User View
              </button>
            </div>
            {result ? (
              <EmailPreview t={result} view={view} />
            ) : generating ? (
              <div className="gm-loading" role="status">
                <Sparkle />
                <p className="gm-loading-title">Reviewing sample data...</p>
                <p className="gm-loading-sub">
                  We're tailoring this to the threats and brands your team actually sees. Hang tight while we put the
                  finishing touches.
                </p>
                <span className="gm-progress" aria-hidden="true">
                  <span />
                </span>
              </div>
            ) : (
              <div className="gm-idle">
                <Sparkle className="is-idle" />
                <p>Your generated template will preview here.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
