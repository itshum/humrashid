import { ChartColumn, ChevronRight, Calendar, Download, Hand, Mail, MousePointer2, User, FishingHook } from "lucide-react";
import { campaignHistory, pct } from "./acmeMock";
import "./sublimeUi.css";
import "./SimulationOverview.css";

// Reports > Phishing Simulation Overview, sampled from the product's
// overview page. Totals come from the same Acme campaign history as
// every other demo, so the numbers agree with the tables beside it.
const campaigns = campaignHistory.length;
const sent = campaignHistory.reduce((s, c) => s + c.sent, 0);
const clicked = campaignHistory.reduce((s, c) => s + c.clicked, 0);
const reported = campaignHistory.reduce((s, c) => s + c.reported, 0);
const blocked = 12;

const stats = [
  { icon: FishingHook, tone: "sky", value: String(campaigns), label: "Total campaigns run" },
  { icon: Mail, tone: "ink", value: sent.toLocaleString("en-US"), label: "Total recipients simulated" },
  { icon: MousePointer2, tone: "blue", value: pct(clicked, sent), label: "Overall click rate" },
  { icon: User, tone: "orange", value: pct(reported, sent), label: "Overall user report rate" },
] as const;

const ranges = ["7d", "30d", "60d", "90d"];

export default function SimulationOverview() {
  return (
    <div className="su-card so">
      <div className="so-crumbs">
        <ChartColumn aria-hidden="true" strokeWidth={2} />
        <span>Reports</span>
        <ChevronRight aria-hidden="true" strokeWidth={2} className="so-crumb-sep" />
        <span className="so-crumb-current">Phishing Simulation Overview</span>
      </div>

      <div className="so-body">
        <div className="so-toolbar">
          <div className="so-summary">
            <span>
              <FishingHook aria-hidden="true" strokeWidth={2} />
              {campaigns} Campaigns Run
            </span>
            <span className="so-bullet" aria-hidden="true" />
            <span>
              <Mail aria-hidden="true" strokeWidth={2} />
              {sent.toLocaleString("en-US")} Recipients Simulated
            </span>
            <span className="so-bullet" aria-hidden="true" />
            <span>
              <Hand aria-hidden="true" strokeWidth={2} />
              {blocked} Blocked Deliveries
            </span>
          </div>
          <div className="so-actions">
            <div className="so-range" role="group" aria-label="Date range">
              {ranges.map((r) => (
                <button key={r} type="button" aria-pressed={r === "30d"}>
                  {r}
                </button>
              ))}
              <button type="button" aria-label="Custom range">
                <Calendar aria-hidden="true" strokeWidth={2} />
              </button>
            </div>
            <button type="button" className="so-download" aria-label="Download report">
              <Download aria-hidden="true" strokeWidth={2} />
            </button>
          </div>
        </div>

        <h4 className="so-title">Phishing Simulation Overview</h4>
        <p className="so-sub">Breakdown of Phishing Simulation data across all campaigns</p>

        <div className="so-stats">
          {stats.map(({ icon: Icon, tone, value, label }) => (
            <div key={label} className="so-stat">
              <span className={`so-hex so-hex--${tone}`} aria-hidden="true">
                <Icon strokeWidth={2.25} />
              </span>
              <span className="so-value">{value}</span>
              <span className="so-label">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
