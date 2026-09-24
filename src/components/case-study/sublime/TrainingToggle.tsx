import { useId, useState } from "react";
import { Check, LockKeyhole, Shield } from "lucide-react";
import { company } from "./acmeMock";
import "./sublimeDemo.css";
import "./TrainingToggle.css";

// The page an employee lands on after clicking a simulation, rebuilt from
// the product's notice and training pages. The toggle switches between
// the plain notice and the notice with training assigned. The browser
// chrome and page are always light, like the product.

const questions = [
  {
    title: "What should you check first?",
    label: "Sender details",
    sample: "Display name: Acme Support · Address: demo@outside.example",
    options: ["The sender address behind the display name", "Whether the display name sounds familiar", "Whether the message has a subject line"],
    correct: 0,
    explanation: "A familiar display name can be typed by anyone. Check the address and its domain.",
  },
  {
    title: "Which detail needs a closer look?",
    label: "Message summary",
    sample: "The fictional message claimed to be an account notice and pointed to a sign-in button.",
    options: ["The message used a short subject", "It asked you to sign in from an unexpected message", "It arrived during working hours"],
    correct: 1,
    explanation: "An unexpected sign-in request is a reason to pause and use a known route to your account.",
  },
  {
    title: "What did the button reveal?",
    label: "Button inspection",
    sample: "Button label: View account · Destination preview: portal-check.example",
    options: ["A button is safe when its label looks routine", "The destination can differ from what the label suggests", "A short destination is always trustworthy"],
    correct: 1,
    explanation: "A button label does not verify its destination. Inspect the destination before opening it.",
  },
  {
    title: "What would you do next?",
    label: "Putting it together",
    sample: "The sender address and button destination did not match the claimed account notice.",
    options: ["Use the button to see whether the page looks real", "Reply to the message for confirmation", "Report the message and open your account through a known route"],
    correct: 2,
    explanation: "Reporting helps your team investigate. A saved bookmark or known app avoids the message link.",
  },
];

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

export default function TrainingToggle({ preview = false, trainingEnabled = true }: { preview?: boolean; trainingEnabled?: boolean } = {}) {
  const [training, setTraining] = useState(trainingEnabled);
  const [stage, setStage] = useState<"notice" | "quiz" | "complete">("notice");
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const labelId = useId();
  const question = questions[questionIndex];
  const isCorrect = selected === question.correct;

  function reset() {
    setStage("notice");
    setQuestionIndex(0);
    setSelected(null);
  }

  function nextQuestion() {
    if (!isCorrect) return;
    if (questionIndex === questions.length - 1) {
      setStage("complete");
    } else {
      setQuestionIndex((index) => index + 1);
      setSelected(null);
    }
  }

  return (
    <div className={`sd tt${preview ? " tt--preview" : ""}`}>
      {!preview && <div className="sd-controls">
        <button
          type="button"
          role="switch"
          aria-checked={training}
          aria-labelledby={labelId}
          className="sd-switch"
          onClick={() => {
            setTraining((value) => !value);
            reset();
          }}
        >
          <span className="sd-switch-track" aria-hidden="true" />
          <span id={labelId}>Assign training after a click</span>
        </button>
      </div>}

      {preview && <div className="tt-preview-tabs" role="tablist" aria-label="Training preview pages">
        {(["notice", "quiz", "complete"] as const).map((page) => <button key={page} type="button" role="tab" aria-selected={stage === page} onClick={() => setStage(page)}>{page === "quiz" ? "Training" : page === "complete" ? "Completion" : "Notice"}</button>)}
      </div>}

      <div className="tt-frame">
        {!preview && <div className="tt-bar" aria-hidden="true">
          <span className="tt-dots">
            <span />
            <span />
            <span />
          </span>
          <span className="tt-url">security.{company.domain}/simulation</span>
        </div>}

        <div className="tt-page" aria-live="polite">
          {stage === "notice" && <div className="tt-card">
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
                <button className="tt-cta" type="button" onClick={() => setStage("quiz")}>Start training · 2 min</button>
                <p className="tt-note">Closing this page leaves training incomplete and may trigger a follow-up reminder.</p>
              </div>
            ) : (
              <p className="tt-footer sd-fade">
                This simulation was conducted by your security team using Sublime Security. For questions, contact
                your security team.
              </p>
            )}
          </div>}

          {stage === "quiz" && (training || preview) && (
            <div className="tt-card tt-card--quiz" key={questionIndex}>
              <div className="tt-progress-top"><span>Spot the signals</span><span>{questionIndex + 1} of {questions.length}</span></div>
              <div className="tt-progress" aria-label={`Question ${questionIndex + 1} of ${questions.length}`}>
                {questions.map((_, index) => <span key={index} className={index <= questionIndex ? "is-active" : ""} />)}
              </div>
              <h4 className="tt-heading tt-heading--quiz">{question.title}</h4>
              <div className="tt-sample">
                <span className="tt-sample-kicker">Sample email · {question.label}</span>
                <p>{question.sample}</p>
                <span className="tt-sample-note">Fictional training example</span>
              </div>
              <div className="tt-options" role="group" aria-label="Select one answer">
                {question.options.map((option, index) => (
                  <button
                    key={option}
                    type="button"
                    className={`tt-option${selected === index ? (index === question.correct ? " is-correct" : " is-incorrect") : ""}`}
                    aria-pressed={selected === index}
                    onClick={() => setSelected(index)}
                  >
                    <span className="tt-option-radio" aria-hidden="true" />
                    <span>{option}</span>
                  </button>
                ))}
              </div>
              {selected !== null && (
                <p className={`tt-feedback ${isCorrect ? "is-correct" : "is-incorrect"}`} role="status">
                  <strong>{isCorrect ? "That's right." : "Not quite. Try another answer."}</strong> {isCorrect ? question.explanation : "Look again at the highlighted message detail."}
                </p>
              )}
              <button className="tt-cta tt-next" type="button" disabled={!isCorrect} onClick={nextQuestion}>
                {questionIndex === questions.length - 1 ? "Complete training" : "Next question"}
              </button>
            </div>
          )}

          {stage === "complete" && (training || preview) && (
            <div className="tt-card tt-card--complete">
              <span className="tt-success-icon" aria-hidden="true"><Check size={28} strokeWidth={2.4} /></span>
              <span className="tt-complete-kicker">Training complete</span>
              <h4 className="tt-heading">Nice work. You spotted the signals.</h4>
              <p className="tt-copy">You reviewed the sender, the unexpected sign-in request, and the button destination in this fictional simulation.</p>
              <div className="tt-complete-summary"><Check size={17} aria-hidden="true" /> All {questions.length} questions completed</div>
              <p className="tt-copy">When a real message feels off, report it and visit the service through a route you already trust.</p>
              <button className="tt-restart" type="button" onClick={reset}>Review training again</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
