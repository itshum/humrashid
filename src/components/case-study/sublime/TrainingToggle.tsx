import { useId, useState } from "react";
import { company, featured } from "./acmeMock";
import "./sublimeDemo.css";
import "./TrainingToggle.css";

export default function TrainingToggle() {
  const [training, setTraining] = useState(true);
  const labelId = useId();

  return (
    <div className="sd tt">
      <div className="sd-controls">
        <button
          type="button"
          role="switch"
          aria-checked={training}
          aria-labelledby={labelId}
          className="sd-switch"
          onClick={() => setTraining((t) => !t)}
        >
          <span className="sd-switch-track" aria-hidden="true" />
          <span id={labelId}>Assign training after a click</span>
        </button>
      </div>

      <div className="sd-frame tt-frame">
        <div className="sd-frame-bar" aria-hidden="true">
          <span className="sd-dots">
            <span />
            <span />
            <span />
          </span>
          <span className="sd-url">security.{company.domain}/simulation</span>
        </div>

        <div className="tt-page" aria-live="polite">
          <span className="sd-tag">Simulated phish</span>
          <h4 className="tt-heading">This was a phishing test</h4>
          <p className="tt-lede">
            "{featured.subject}" was a simulation sent by the {company.name} security team. No harm
            done, and nothing you entered was saved.
          </p>

          <p className="tt-label">What gave it away</p>
          <ul className="tt-tells">
            <li>
              The sender, <code>{featured.senderEmail}</code>, isn't an {company.domain} address.
            </li>
            <li>A deadline pushed you to act before thinking.</li>
            <li>It asked you to sign in from a link instead of going to the payroll site yourself.</li>
          </ul>

          {training ? (
            <div className="tt-training sd-fade">
              <div>
                <p className="tt-training-title">Your security team assigned a short training</p>
                <p className="tt-training-meta">5 questions, about 3 minutes</p>
              </div>
              <span className="sd-btn sd-btn--primary">Start training</span>
            </div>
          ) : (
            <p className="tt-done sd-fade">You can close this page.</p>
          )}
        </div>
      </div>
    </div>
  );
}
