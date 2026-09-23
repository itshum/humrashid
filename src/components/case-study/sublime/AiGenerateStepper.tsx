import { Fragment, useEffect, useRef, useState } from "react";
import { templates, type Template } from "./acmeMock";
import "./sublimeDemo.css";
import "./AiGenerateStepper.css";

const attackTypes = [
  { name: "Credential phishing", signal: "Most active" },
  { name: "Invoice fraud", signal: "Seen recently" },
  { name: "Malicious file share", signal: "Seen recently" },
];

const vendorScopes = ["Internal senders", "Include vendors"] as const;
const difficulties = ["Low", "Medium", "High"] as const;

// The demo's "generation" is a short pause; the product promises 30s or less.
const GENERATE_MS = 2800;

type Step = 1 | 2 | 3 | 4;

function Chips({ text }: { text: string }) {
  return (
    <>
      {text.split(/(\{\{[^}]+\}\})/g).map((part, i) =>
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

export default function AiGenerateStepper() {
  const [step, setStep] = useState<Step>(1);
  const [attackType, setAttackType] = useState<string | null>(null);
  const [themeId, setThemeId] = useState<string>("");
  const [vendorScope, setVendorScope] = useState<(typeof vendorScopes)[number]>("Internal senders");
  const [difficulty, setDifficulty] = useState<(typeof difficulties)[number]>("Medium");
  const headingRef = useRef<HTMLHeadingElement>(null);
  const firstRender = useRef(true);

  const themeOptions = templates.filter((t) => t.attackType === attackType);
  const result: Template | undefined = templates.find((t) => t.id === themeId);

  // Move focus to the new step's heading so keyboard and screen reader
  // users land on the content that just changed.
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    headingRef.current?.focus();
  }, [step]);

  useEffect(() => {
    if (step !== 3) return;
    const timer = window.setTimeout(() => setStep(4), GENERATE_MS);
    return () => window.clearTimeout(timer);
  }, [step]);

  function chooseAttackType(name: string) {
    setAttackType(name);
    setThemeId(templates.find((t) => t.attackType === name)?.id ?? "");
  }

  function startOver() {
    setAttackType(null);
    setThemeId("");
    setVendorScope("Internal senders");
    setDifficulty("Medium");
    setStep(1);
  }

  const titles: Record<Step, string> = {
    1: "Choose an attack type",
    2: "Refine it",
    3: "Generating your template",
    4: "Your template is ready",
  };

  return (
    <div className="sd ai">
      <div className="sd-frame">
        <div className="ai-head">
          <p className="ai-kicker">Generate a template with AI</p>
          <p className="ai-count">
            <span className="sd-sr-only">Step </span>
            {step} of 4
          </p>
        </div>
        <div className="ai-progress" aria-hidden="true">
          {[1, 2, 3, 4].map((n) => (
            <span key={n} className={n <= step ? "is-done" : ""} />
          ))}
        </div>

        <div className="ai-body">
          <h4 className="ai-title" ref={headingRef} tabIndex={-1}>
            {titles[step]}
          </h4>

          {step === 1 && (
            <div className="sd-fade">
              <p className="ai-help">Starting points come from attacks Sublime has seen at Acme Corp.</p>
              <fieldset className="ai-options">
                <legend className="sd-sr-only">Attack type</legend>
                {attackTypes.map((a) => (
                  <label key={a.name} className="ai-option">
                    <input
                      type="radio"
                      name="ai-attack"
                      checked={attackType === a.name}
                      onChange={() => chooseAttackType(a.name)}
                    />
                    <span className="ai-option-name">{a.name}</span>
                    <span className={a.signal === "Most active" ? "sd-tag sd-tag--accent" : "sd-tag"}>{a.signal}</span>
                  </label>
                ))}
              </fieldset>
              <div className="ai-actions">
                <button type="button" className="sd-btn sd-btn--primary" disabled={!attackType} onClick={() => setStep(2)}>
                  Next
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="sd-fade">
              <p className="ai-help">
                <span className="sd-tag">{attackType}</span>
              </p>
              <div className="ai-refine">
                <label className="ai-field">
                  <span className="ai-label">Theme</span>
                  <select value={themeId} onChange={(e) => setThemeId(e.target.value)}>
                    {themeOptions.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.theme}
                      </option>
                    ))}
                  </select>
                </label>
                <div className="ai-field">
                  <span className="ai-label" id="ai-vendor-label">
                    Vendor scope
                  </span>
                  <div className="sd-seg" role="group" aria-labelledby="ai-vendor-label">
                    {vendorScopes.map((v) => (
                      <button key={v} type="button" aria-pressed={vendorScope === v} onClick={() => setVendorScope(v)}>
                        {v}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="ai-field">
                  <span className="ai-label" id="ai-difficulty-label">
                    Difficulty
                  </span>
                  <div className="sd-seg" role="group" aria-labelledby="ai-difficulty-label">
                    {difficulties.map((d) => (
                      <button key={d} type="button" aria-pressed={difficulty === d} onClick={() => setDifficulty(d)}>
                        {d}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <div className="ai-actions">
                <button type="button" className="sd-btn" onClick={() => setStep(1)}>
                  Back
                </button>
                <button type="button" className="sd-btn sd-btn--primary" onClick={() => setStep(3)}>
                  Generate
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="ai-generating sd-fade" role="status">
              <div className="ai-bar" aria-hidden="true">
                <span style={{ animationDuration: `${GENERATE_MS}ms` }} />
              </div>
              <p className="ai-help">
                Writing your {result && (result.theme === "IT" ? "IT" : result.theme.toLowerCase())} template
                from Acme Corp's own threat data. Ready in 30 seconds or less.
              </p>
            </div>
          )}

          {step === 4 && result && (
            <div className="sd-fade">
              <div className="ai-tags">
                <span className="sd-tag sd-tag--accent">AI generated</span>
                <span className="sd-tag">{result.attackType}</span>
                <span className="sd-tag">{difficulty} difficulty</span>
                <span className="sd-tag">{vendorScope}</span>
              </div>
              <div className="ai-result">
                <div className="ai-result-head">
                  <span className="sd-avatar" aria-hidden="true">
                    {result.avatar}
                  </span>
                  <div>
                    <p className="ai-result-name">{result.name}</p>
                    <p className="ai-result-from">
                      {result.senderName}, {result.senderEmail}
                    </p>
                  </div>
                </div>
                <p className="ai-result-subject">{result.subject}</p>
                {result.body.map((p) => (
                  <p key={p} className="ai-result-body">
                    <Chips text={p} />
                  </p>
                ))}
              </div>
              <div className="ai-actions">
                <button type="button" className="sd-btn" onClick={startOver}>
                  Start over
                </button>
                <span className="sd-btn sd-btn--primary" aria-hidden="true">
                  Use in campaign
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
