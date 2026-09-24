import { useState } from "react";
import { BarChart3, ChevronRight, Mail, MousePointerClick, Send, ShieldCheck } from "lucide-react";
import { campaignHistory, company, featured, groups, pct, repeatClickers } from "./acmeMock";
import { GroupLeaderboard, RepeatClickers } from "./ResultsLeaderboard";
import "./sublimeDemo.css";
import "./sublimeUi.css";
import "./ExecutiveDashboard.css";

type Window = "7d" | "30d" | "60d" | "90d";
const windows: Window[] = ["7d", "30d", "60d", "90d"];
const campaignCount: Record<Window, number> = { "7d": 1, "30d": 2, "60d": 3, "90d": 4 };
const ranked = [...groups].sort((a, b) => b.clicked / b.recipients - a.clicked / a.recipients);
const mostVulnerable = ranked[0];
const repeatCount = repeatClickers.filter((person) => person.group === mostVulnerable.name).length;

export default function ExecutiveDashboard() {
  const [window, setWindow] = useState<Window>("30d");
  const [draft, setDraft] = useState(false);
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
              <button type="button" key={value} aria-pressed={window === value} onClick={() => { setWindow(value); setDraft(false); }}>{value}</button>
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

          <section className="ed-action" aria-labelledby="ed-action-title">
            <div className="ed-action-head"><h4 id="ed-action-title">Should I act on any of this?</h4><span>Recommended next step</span></div>
            <div className="ed-action-body">
              <div className="ed-action-copy">
                <span className="ed-action-kicker">Group insight · Latest campaign</span>
                <h5>{mostVulnerable.name} needs a closer look</h5>
                <p>{mostVulnerable.name} had the highest click rate in {featured.campaignName}: {pct(mostVulnerable.clicked, mostVulnerable.recipients)} of {mostVulnerable.recipients} recipients clicked. {repeatCount} people in the group clicked in multiple sample campaigns. Consider a focused follow-up for this group.</p>
              </div>
              {draft ? <p className="ed-draft" role="status">Draft preview ready for {mostVulnerable.name} · {mostVulnerable.recipients} recipients</p> : <button className="ed-action-button" type="button" onClick={() => setDraft(true)}>Create campaign for {mostVulnerable.name}</button>}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
