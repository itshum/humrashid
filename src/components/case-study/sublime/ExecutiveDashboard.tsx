import { useState } from "react";
import { BarChart3, ChevronRight, Mail, MousePointerClick, Send, ShieldCheck } from "lucide-react";
import { campaignHistory, company, featured, pct } from "./acmeMock";
import { GroupLeaderboard, RepeatClickers } from "./ResultsLeaderboard";
import "./sublimeDemo.css";
import "./sublimeUi.css";
import "./ExecutiveDashboard.css";

type Window = "7d" | "30d" | "60d" | "90d";
const windows: Window[] = ["7d", "30d", "60d", "90d"];
const campaignCount: Record<Window, number> = { "7d": 1, "30d": 2, "60d": 3, "90d": 4 };

export default function ExecutiveDashboard() {
  const [window, setWindow] = useState<Window>("30d");
  const visibleCampaigns = campaignHistory.slice(-campaignCount[window]);
  const recipients = visibleCampaigns.reduce((sum, item) => sum + item.sent, 0);
  const clicks = visibleCampaigns.reduce((sum, item) => sum + item.clicked, 0);
  const reports = visibleCampaigns.reduce((sum, item) => sum + item.reported, 0);
  const metrics = [
    { label: "Total campaigns run", value: visibleCampaigns.length.toLocaleString("en-US"), icon: ShieldCheck, tone: "sky" },
    { label: "Total recipients simulated", value: recipients.toLocaleString("en-US"), icon: Mail, tone: "charcoal" },
    { label: "Overall click rate", value: pct(clicks, recipients), icon: MousePointerClick, tone: "blue" },
    { label: "Overall user report rate", value: pct(reports, recipients), icon: Send, tone: "orange" },
  ];

  return (
    <div className="sd su ed">
      <div className="sd-frame ed-shell">
        <div className="ed-breadcrumb"><BarChart3 size={15} aria-hidden="true" /><span>Reports</span><ChevronRight size={14} aria-hidden="true" /><strong>Phishing Simulation Overview</strong></div>
        <div className="ed-toolbar">
          <div className="ed-toolbar-facts"><span>{visibleCampaigns.length} campaigns run</span><i aria-hidden="true" /><span>{recipients.toLocaleString("en-US")} recipients simulated</span></div>
          <div className="ed-time" role="group" aria-label="Reporting period">
            {windows.map((value) => (
              <button type="button" key={value} aria-pressed={window === value} onClick={() => setWindow(value)}>{value}</button>
            ))}
          </div>
        </div>
        <div className="ed-content">
          <header className="ed-intro">
            <div><h4>Phishing Simulation Overview</h4><p>Breakdown of simulation data across {visibleCampaigns.length} sample {visibleCampaigns.length === 1 ? "campaign" : "campaigns"} in this view</p></div>
            <span className="ed-org">{company.name}</span>
          </header>

          <div className="ed-metrics" aria-live="polite">
            {metrics.map(({ label, value, icon: Icon, tone }) => (
              <div className="ed-metric" key={label}>
                <span className={`ed-metric-icon ed-metric-icon--${tone}`}><Icon size={15} strokeWidth={2} aria-hidden="true" /></span>
                <strong>{value}</strong>
                <span>{label}</span>
              </div>
            ))}
          </div>

          <div className="ed-results">
            <section aria-label="Repeat clickers across sample campaigns">
              <p className="ed-result-context">Across all sample campaigns</p>
              <RepeatClickers />
            </section>
            <section aria-label="Group leaderboard for latest campaign">
              <p className="ed-result-context">Latest campaign: {featured.campaignName}</p>
              <GroupLeaderboard />
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
