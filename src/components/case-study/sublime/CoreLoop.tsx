import { useState } from "react";
import "./CoreLoop.css";

type Step = 0 | 1 | 2 | 3;
const steps = [
  { title: "Campaign list", action: "Create a new simulation from the campaign list." },
  { title: "Campaign builder", action: "Choose the audience, timing, and sample template, then launch." },
  { title: "Campaign detail", action: "Review opens, clicks, reports, and recipient results." },
  { title: "Simulations overview", action: "Compare campaigns and decide what to run next." },
] as const;

function Bar({ width = "60%" }: { width?: string }) {
  return <span className="cl-line" style={{ width }} />;
}

function ListSketch() {
  return (
    <div className="cl-ui">
      <div className="cl-ui-bar"><span>Simulations</span><span className="cl-ui-dots">•••</span></div>
      <div className="cl-ui-body">
        <div className="cl-ui-title"><strong>Campaigns</strong><span className="cl-ui-primary">＋ New campaign</span></div>
        <div className="cl-ui-table">
          <div className="cl-ui-table-head"><span>Campaign</span><span>Audience</span><span>Results</span><span>Status</span></div>
          {[0, 1, 2].map((row) => <div className="cl-ui-table-row" key={row}><Bar width={row === 1 ? "65%" : "82%"} /><Bar width="65%" /><Bar width="45%" /><span className="cl-ui-pill" /></div>)}
        </div>
      </div>
    </div>
  );
}

function BuilderSketch() {
  return (
    <div className="cl-ui">
      <div className="cl-ui-bar"><span>New campaign</span><span className="cl-ui-dots">•••</span></div>
      <div className="cl-ui-builder">
        <div className="cl-ui-form"><strong>Details</strong><Bar /><span className="cl-ui-field" /><span className="cl-ui-field cl-ui-field--short" /><strong>Audience</strong><span className="cl-ui-field" /><strong>Template</strong><span className="cl-ui-field" /></div>
        <div className="cl-ui-preview"><strong>Preview</strong><div className="cl-ui-message"><Bar width="38%" /><Bar width="82%" /><Bar width="64%" /><span /></div></div>
      </div>
    </div>
  );
}

function DetailSketch() {
  return (
    <div className="cl-ui">
      <div className="cl-ui-bar"><span>Campaign detail</span><span className="cl-ui-dots">•••</span></div>
      <div className="cl-ui-body"><div className="cl-ui-title"><strong>Sample campaign</strong><span className="cl-ui-status">Active</span></div>
        <div className="cl-ui-metrics">{["Opened", "Clicked", "Reported", "Training"].map((label) => <div key={label}><Bar width="45%" /><small>{label}</small></div>)}</div>
        <div className="cl-ui-table"><div className="cl-ui-table-head"><span>Recipient</span><span>Opened</span><span>Clicked</span><span>Reported</span></div>{[0, 1].map((row) => <div className="cl-ui-table-row" key={row}><Bar width="70%" /><Bar width="30%" /><Bar width="30%" /><Bar width="30%" /></div>)}</div>
      </div>
    </div>
  );
}

function OverviewSketch() {
  return (
    <div className="cl-ui">
      <div className="cl-ui-bar"><span>Reports / Simulations</span><span className="cl-ui-dots">•••</span></div>
      <div className="cl-ui-body"><div className="cl-ui-title"><strong>Overview</strong><span>7d&nbsp; 30d&nbsp; 90d</span></div>
        <div className="cl-ui-metrics">{["Campaigns", "Recipients", "Click rate", "Report rate"].map((label) => <div key={label}><Bar width="45%" /><small>{label}</small></div>)}</div>
        <div className="cl-ui-panels"><div><strong>Repeat clickers</strong><Bar width="80%" /><Bar width="60%" /></div><div><strong>Group results</strong><Bar width="75%" /><Bar width="54%" /></div></div>
      </div>
    </div>
  );
}

const sketches = [ListSketch, BuilderSketch, DetailSketch, OverviewSketch];

export default function CoreLoop() {
  const [active, setActive] = useState<Step>(0);
  const card = (index: Step) => {
    const Sketch = sketches[index];
    return <button type="button" className={`cl-card cl-card--${index}${active === index ? " is-active" : ""}`} aria-label={`Step ${index + 1}: ${steps[index].title}`} aria-pressed={active === index} onClick={() => setActive(index)}>
      <span className="cl-card-label"><span className="cl-number">0{index + 1}</span>{steps[index].title}</span>
      <Sketch />
    </button>;
  };
  const arrow = (className: string, target: Step, label: string, symbol: string) => <button type="button" className={`cl-arrow ${className}`} aria-label={label} onClick={() => setActive(target)}>{symbol}</button>;

  return (
    <div className="cl" aria-label="Interactive low-fidelity analyst workflow">
      <div className="cl-heading"><h3>Security Analyst User Journey</h3><p>Phishing Simulations user journey from creation to campaign analysis</p></div>
      <div className="cl-phase cl-phase--top">Build simulations</div>
      <div className="cl-grid">
        {card(0)}
        {arrow("cl-arrow--top", 1, "Next: campaign builder", "→")}
        {card(1)}
        {arrow("cl-arrow--left", 0, "Back to campaign list", "↑")}
        {arrow("cl-arrow--right", 2, "Next: campaign detail", "↓")}
        {card(3)}
        {arrow("cl-arrow--bottom", 3, "Next: simulations overview", "←")}
        {card(2)}
      </div>
      <div className="cl-summary" aria-live="polite"><span>0{active + 1} / 04 · {steps[active].title}</span><p>{steps[active].action}</p><button type="button" onClick={() => setActive(((active + 1) % 4) as Step)}>Next step <span aria-hidden="true">→</span></button></div>
    </div>
  );
}
