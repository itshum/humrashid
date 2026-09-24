import { useId, useState } from "react";
import { Check, LockKeyhole, Shield } from "lucide-react";
import { company } from "./acmeMock";
import "./sublimeDemo.css";
import "./TrainingToggle.css";

// The page an employee lands on after clicking a simulation, rebuilt from
// the product's notice and training pages. The toggle switches between
// the plain notice and the notice with training assigned. The browser
// chrome and page are always light, like the product.

function NoticeIcon() {
  return (
    <span className="tt-icon" aria-hidden="true">
      <span className="tt-icon-inner">
        <svg viewBox="0 0 24 24">
          <path d="M12 2.5 4.5 5.4v5.9c0 4.7 3.2 8.9 7.5 10.2 4.3-1.3 7.5-5.5 7.5-10.2V5.4L12 2.5Z" fill="currentColor" />
          <rect x="11" y="7.2" width="2" height="6.6" rx="1" fill="#fff" />
          <circle cx="12" cy="16.4" r="1.15" fill="#fff" />
        </svg>
      </span>
    </span>
  );
}

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

      <div className="tt-frame">
        <div className="tt-bar" aria-hidden="true">
          <span className="tt-dots">
            <span />
            <span />
            <span />
          </span>
          <span className="tt-url">security.{company.domain}/simulation</span>
        </div>

        <div className="tt-page" aria-live="polite">
          <div className="tt-card">
            <NoticeIcon />
            <h4 className="tt-heading">This was a phishing simulation</h4>
            <p className="tt-copy">
              This email was part of an internal security awareness campaign. No real threat was involved and no data
              was compromised.
            </p>
            {training && (
              <p className="tt-copy sd-fade">
                Because you clicked the link, your security team has assigned a short training.
              </p>
            )}

            <ul className="tt-list">
              <li>
                <Shield aria-hidden="true" strokeWidth={1.5} />
                You clicked a link in a simulated phishing email.
              </li>
              <li>
                <LockKeyhole aria-hidden="true" strokeWidth={1.5} />
                This was a test, your account and data are safe.
              </li>
              <li>
                <Check aria-hidden="true" strokeWidth={2} />
                {training
                  ? "You have a new assigned training you need to complete."
                  : "Your response was recorded for training data only."}
              </li>
            </ul>

            {training ? (
              <div className="sd-fade">
                <span className="tt-cta">Start training · 2 min</span>
                <p className="tt-note">Closing this page leaves training incomplete and may trigger a follow-up reminder.</p>
              </div>
            ) : (
              <p className="tt-footer sd-fade">
                This simulation was conducted by your security team using Sublime Security. For questions, contact
                your security team.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
