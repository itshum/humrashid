import { Fragment, useId, useState, type ReactNode } from "react";
import { Calendar, ChevronDown, Info, Mail, Sparkles, SquareArrowOutUpRight, X } from "lucide-react";
import { company, sampleRecipient } from "./acmeMock";
import "./CampaignBuilder.css";

// The GA campaign builder, rebuilt 1:1 from the product. It's drawn on a
// fixed 1200 x 844 canvas and scaled to its container (see the --px unit
// in CampaignBuilder.css), so it reads like a screenshot at any width.

interface BuilderTemplate {
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

const templates: BuilderTemplate[] = [
  {
    id: "password",
    name: "Acme Password Expiry",
    alias: "Acme IT",
    email: "it@acmecorp-accounts.example",
    subject: "{{recipient_first_name}}, your Acme password expires today",
    avatar: "acme",
    body: [
      `Your ${company.name} network password expires at 5:00 PM today. After that, you won't be able to sign in to email, Slack, or the VPN.`,
      "Keep your current password by confirming it below. It only takes a moment.",
    ],
    cta: "Keep current password",
    ctaStyle: "brand",
  },
  {
    id: "mfa",
    name: "IT Helpdesk MFA Re-Enroll",
    alias: "Acme IT Helpdesk",
    email: "helpdesk@acme-it-support.example",
    subject: "{{recipient_first_name}}, re-enroll in MFA before Friday",
    avatar: "IT",
    body: [
      `We're moving ${company.name} to a new multi-factor authentication app. Accounts that aren't re-enrolled by Friday will be locked until IT can verify them.`,
      "Re-enrolling takes about two minutes.",
    ],
    cta: "Re-enroll now",
    ctaStyle: "dark",
  },
];

const sendDate = "Sep 29, 2026, 9:00 AM";

type View = "template" | "user";

function tagValues(t: BuilderTemplate): Record<string, string> {
  return {
    recipient_first_name: sampleRecipient.firstName,
    recipient_email_address: sampleRecipient.email,
    sender_alias: t.alias,
    sender_email: t.email,
    date: sendDate,
  };
}

// {{tags}} render as code chips in the template view and as real values
// in the user view.
function Tagged({ text, view, t }: { text: string; view: View; t: BuilderTemplate }) {
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

// Fictional Acme Corp logo mark: a simple peak on the brand orange.
function AcmeMark() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path fill="#fff" d="M12 5.5 19 18.5h-3.4L12 11.6l-3.6 6.9H5z" />
    </svg>
  );
}

function Label({ children, required, info }: { children: ReactNode; required?: boolean; info?: boolean }) {
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

function Box({ children, icon, className = "" }: { children: ReactNode; icon?: ReactNode; className?: string }) {
  return (
    <span className={`cb-input ${className}`}>
      <span className="cb-input-value">{children}</span>
      {icon}
    </span>
  );
}

const chevron = <ChevronDown className="cb-input-icon" aria-hidden="true" strokeWidth={2} />;

function EmailPreview({ t, view }: { t: BuilderTemplate; view: View }) {
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
          {t.avatar === "acme" ? (
            <span className="cb-avatar cb-avatar--acme">
              <AcmeMark />
            </span>
          ) : (
            <span className="cb-avatar" aria-hidden="true">
              {t.avatar}
            </span>
          )}
          <span className="cb-email-sender">{t.alias}</span>
        </div>
        <p>
          Hi <Tagged text="{{recipient_first_name}}" view={view} t={t} />,
        </p>
        {t.body.map((p) => (
          <p key={p}>{p}</p>
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
  const [view, setView] = useState<View>("template");
  const [training, setTraining] = useState(true);
  const t = templates.find((x) => x.id === templateId) ?? templates[0];
  const uid = useId();

  return (
    <div className={`cb${fit ? " cb--fit" : ""}`}>
      <div className="cb-app">
        <div className="cb-crumbs">
          <span className="cb-crumb">Phishing Simulations</span>
        </div>

        <div className="cb-head">
          <h4 className="cb-title">New Campaign</h4>
          {/* Shown for layout; not wired up in this demo. */}
          <div className="cb-actions" aria-hidden="true">
            <span className="cb-btn cb-btn--text">Cancel</span>
            <span className="cb-btn">Save Draft</span>
            <span className="cb-actions-sep" />
            <span className="cb-btn">Send Test (2)</span>
            <span className="cb-btn cb-btn--primary">Review &amp; Launch</span>
          </div>
        </div>

        <div className="cb-body">
          <div className="cb-form">
            <div className="cb-field">
              <Label required>Name</Label>
              <Box>Q3 Password Expiry</Box>
            </div>

            <div className="cb-field">
              <Label required info>
                Start
              </Label>
              <div className="cb-row">
                <Box className="cb-date" icon={<Calendar className="cb-input-icon" aria-hidden="true" strokeWidth={2} />}>
                  Sep 29, 2026
                </Box>
                <Box className="cb-time" icon={chevron}>
                  9:00 AM
                </Box>
              </div>
            </div>

            <div className="cb-field">
              <Label required info>
                Duration
              </Label>
              <Box icon={chevron}>2 weeks</Box>
            </div>

            <div className="cb-field">
              <Label required info>
                Delivery Mode
              </Label>
              <Box icon={chevron}>Send immediately</Box>
            </div>

            <hr className="cb-rule" />

            <h5 className="cb-section">Audience</h5>

            <div className="cb-field">
              <Label required>Audience Type</Label>
              <Box icon={chevron}>Sublime Lists</Box>
            </div>

            <div className="cb-field">
              <div className="cb-label-row">
                <span className="cb-label cb-label--lg">
                  Lists
                  <span className="cb-req" aria-hidden="true">
                    *
                  </span>
                </span>
                <span className="cb-link">
                  View All Lists
                  <SquareArrowOutUpRight aria-hidden="true" strokeWidth={2} />
                </span>
              </div>
              <Box className="cb-multi" icon={chevron}>
                {["finance", "sales", "marketing"].map((l) => (
                  <span key={l} className="cb-chip">
                    {l}
                    <X aria-hidden="true" strokeWidth={2} />
                  </span>
                ))}
              </Box>
            </div>

            <hr className="cb-rule" />

            <h5 className="cb-section">
              Templates
              <Info className="cb-info" aria-hidden="true" strokeWidth={1.5} />
            </h5>
            <div className="cb-small-btns" aria-hidden="true">
              <span className="cb-small-btn">
                <Sparkles strokeWidth={1.75} />
                Generate
              </span>
              <span className="cb-small-btn">Add From Library</span>
            </div>
            <div className="cb-list" role="radiogroup" aria-label="Templates">
              {templates.map((x) => (
                <button
                  key={x.id}
                  type="button"
                  role="radio"
                  aria-checked={x.id === templateId}
                  className="cb-list-row"
                  onClick={() => setTemplateId(x.id)}
                >
                  <Mail aria-hidden="true" strokeWidth={1.5} />
                  {x.name}
                </button>
              ))}
            </div>

            <hr className="cb-rule" />

            <h5 className="cb-section">
              Notice &amp; training
              <Info className="cb-info" aria-hidden="true" strokeWidth={1.5} />
            </h5>
            <div className="cb-field">
              <Label required>Notice Page</Label>
              <Box icon={chevron}>Sublime default notice</Box>
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
                  {training ? "Employees who click take a 5-question quiz" : "Employees who click see the notice only"}
                </span>
              </span>
            </div>
          </div>

          <div className="cb-preview">
            <div className="cb-preview-inner" aria-live="polite">
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
