import { Fragment, useId, useState } from "react";
import { fillTags, groups, sampleRecipient, templateById, type Template } from "./acmeMock";
import "./sublimeDemo.css";
import "./CampaignBuilder.css";

const builderTemplates = ["payroll", "invoice", "fileshare"].map(templateById);
const audienceSize = groups.reduce((sum, g) => sum + g.recipients, 0);

type View = "template" | "user";

// Renders {{tags}} as chips in the template view, or fills them in for
// the user view.
function Tagged({ text, view }: { text: string; view: View }) {
  if (view === "user") return <>{fillTags(text)}</>;
  const parts = text.split(/(\{\{[^}]+\}\})/g);
  return (
    <>
      {parts.map((part, i) =>
        part.startsWith("{{") ? (
          <span key={i} className="sd-var">
            {part.slice(2, -2)}
          </span>
        ) : (
          <Fragment key={i}>{part}</Fragment>
        )
      )}
    </>
  );
}

function EmailPreview({ template, view, training }: { template: Template; view: View; training: boolean }) {
  return (
    <div className="cb-email" aria-live="polite">
      <div className="cb-email-head">
        <span className="sd-avatar" aria-hidden="true">
          {template.avatar}
        </span>
        <div className="cb-email-meta">
          <p className="cb-from">
            <span className="cb-from-name">{template.senderName}</span>
            <span className="cb-from-email">{template.senderEmail}</span>
          </p>
          <p className="cb-to">
            To{" "}
            {view === "template" ? (
              <span className="sd-var">recipient.email</span>
            ) : (
              sampleRecipient.email
            )}
          </p>
        </div>
      </div>
      <p className="cb-subject">{template.subject}</p>
      <div className="cb-email-body">
        {template.body.map((p) => (
          <p key={p}>
            <Tagged text={p} view={view} />
          </p>
        ))}
        <span className="sd-btn sd-btn--primary cb-cta">{template.cta}</span>
      </div>
      <p className="cb-after">
        <span className="cb-after-label">After a click</span>
        {training ? "Notice, then a 5-question training" : "Notice only"}
      </p>
    </div>
  );
}

export default function CampaignBuilder() {
  const [templateId, setTemplateId] = useState("payroll");
  const [view, setView] = useState<View>("template");
  const [training, setTraining] = useState(false);
  const template = templateById(templateId);
  const trainingId = useId();

  return (
    <div className="sd cb">
      <div className="sd-frame">
        <div className="cb-header">
          <div className="cb-title">
            <span>New campaign</span>
            <span className="sd-tag">Draft</span>
          </div>
          {/* Shown for layout; not wired up in this demo. */}
          <div className="cb-actions" aria-hidden="true">
            <span className="sd-btn">Save as draft</span>
            <span className="sd-btn">Send test</span>
            <span className="sd-btn sd-btn--primary">Review and launch</span>
          </div>
        </div>

        <div className="cb-body">
          <div className="cb-form">
            <div className="cb-field">
              <span className="cb-label">Campaign name</span>
              <span className="cb-value">{template.campaignName}</span>
            </div>

            <div className="cb-row">
              <div className="cb-field">
                <span className="cb-label">Start</span>
                <span className="cb-value">Sep 29, 9:00 AM</span>
              </div>
              <div className="cb-field">
                <span className="cb-label">Runs for</span>
                <span className="cb-value">7 days</span>
              </div>
            </div>

            <div className="cb-row">
              <div className="cb-field">
                <span className="cb-label">Delivery</span>
                <span className="cb-value">Staggered over 3 days</span>
              </div>
              <div className="cb-field">
                <span className="cb-label">Audience</span>
                <span className="cb-value">All employees, {audienceSize}</span>
              </div>
            </div>

            <fieldset className="cb-field cb-templates">
              <legend className="cb-label">Template</legend>
              {builderTemplates.map((t) => (
                <label key={t.id} className="cb-option">
                  <input
                    type="radio"
                    name="cb-template"
                    value={t.id}
                    checked={templateId === t.id}
                    onChange={() => setTemplateId(t.id)}
                  />
                  <span className="cb-option-text">
                    <span className="cb-option-name">{t.name}</span>
                    <span className="cb-option-meta">{t.attackType}</span>
                  </span>
                </label>
              ))}
            </fieldset>

            <div className="cb-training">
              <button
                type="button"
                role="switch"
                aria-checked={training}
                aria-labelledby={trainingId}
                className="sd-switch"
                onClick={() => setTraining((v) => !v)}
              >
                <span className="sd-switch-track" aria-hidden="true" />
                <span id={trainingId}>Training</span>
              </button>
              {training && <span className="cb-training-note sd-fade">5 questions after a click</span>}
            </div>
          </div>

          <div className="cb-preview">
            <div className="cb-preview-bar">
              <span className="cb-label">Live preview</span>
              <div className="sd-seg" role="group" aria-label="Preview as">
                <button type="button" aria-pressed={view === "template"} onClick={() => setView("template")}>
                  Template view
                </button>
                <button type="button" aria-pressed={view === "user"} onClick={() => setView("user")}>
                  User view
                </button>
              </div>
            </div>
            <EmailPreview template={template} view={view} training={training} />
          </div>
        </div>
      </div>
    </div>
  );
}
