import { useState } from "react";
import { campaignHistory, featured, groups, pct, repeatClickers, templateById } from "./acmeMock";
import "./sublimeDemo.css";
import "./ExecutiveDashboard.css";

const Y_MAX = 30; // percent, top of the chart
const shortName = (name: string) => name.replace(/ (portal update|approval|enrollment)$/, "").replace("shared file", "file");

const rate = (part: number, whole: number) => (part / whole) * 100;
const points = campaignHistory.map((c, i) => ({
  label: shortName(c.name),
  x: (i / (campaignHistory.length - 1)) * 100,
  clicked: rate(c.clicked, c.sent),
  reported: rate(c.reported, c.sent),
}));
const toY = (v: number) => 100 - (v / Y_MAX) * 100;
const line = (key: "clicked" | "reported") => points.map((p) => `${p.x},${toY(p[key])}`).join(" ");

const totalSent = campaignHistory.reduce((s, c) => s + c.sent, 0);
const activeCount = campaignHistory.filter((c) => c.active).length;
const latest = campaignHistory[campaignHistory.length - 1];
const first = campaignHistory[0];

const ranked = [...groups].sort((a, b) => b.clicked / b.recipients - a.clicked / a.recipients);
const worst = ranked[0];
const worstRepeat = repeatClickers.filter((p) => p.group === worst.name).length;
// The follow-up reuses the lure this group already fell for most.
const followUp = templateById("invoice");

function PerformanceChart() {
  const last = points[points.length - 1];
  return (
    <div className="ed-chart">
      <p className="sd-sr-only">
        Click rate fell from {pct(first.clicked, first.sent)} to {pct(latest.clicked, latest.sent)} across{" "}
        {campaignHistory.length} campaigns, while report rate rose from {pct(first.reported, first.sent)} to{" "}
        {pct(latest.reported, latest.sent)}.
      </p>
      <div className="ed-plot" aria-hidden="true">
        {[0, 10, 20, 30].map((t) => (
          <span key={t} className="ed-tick" style={{ top: `${toY(t)}%` }}>
            {t}%
          </span>
        ))}
        <svg viewBox="0 0 100 100" preserveAspectRatio="none">
          {[0, 10, 20, 30].map((t) => (
            <line key={t} x1="0" x2="100" y1={toY(t)} y2={toY(t)} className="ed-grid" vectorEffect="non-scaling-stroke" />
          ))}
          <polyline points={line("clicked")} className="ed-line ed-line--clicked" vectorEffect="non-scaling-stroke" />
          <polyline points={line("reported")} className="ed-line ed-line--reported" vectorEffect="non-scaling-stroke" />
        </svg>
        {points.map((p) => (
          <span key={`c-${p.label}`} className="ed-dot ed-dot--clicked" style={{ left: `${p.x}%`, top: `${toY(p.clicked)}%` }} />
        ))}
        {points.map((p) => (
          <span key={`r-${p.label}`} className="ed-dot ed-dot--reported" style={{ left: `${p.x}%`, top: `${toY(p.reported)}%` }} />
        ))}
        <span className="ed-end ed-end--reported" style={{ top: `${toY(last.reported)}%` }}>
          Reported {pct(latest.reported, latest.sent)}
        </span>
        <span className="ed-end ed-end--clicked" style={{ top: `${toY(last.clicked)}%` }}>
          Clicked {pct(latest.clicked, latest.sent)}
        </span>
        {points.map((p) => (
          <span key={`x-${p.label}`} className="ed-x" style={{ left: `${p.x}%` }}>
            {p.label}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function ExecutiveDashboard() {
  const [created, setCreated] = useState(false);

  return (
    <div className="sd ed">
      <div className="sd-frame">
        <div className="ed-head">
          <p className="ed-title">Simulations overview</p>
          <span className="sd-tag">Acme Corp</span>
        </div>

        <div className="ed-grid-layout">
          <section className="ed-panel ed-panel--performance" aria-labelledby="ed-q1">
            <h4 id="ed-q1" className="ed-q">
              How are my campaigns performing?
            </h4>
            <dl className="ed-stats">
              <div>
                <dt>Emails sent</dt>
                <dd>{totalSent.toLocaleString("en-US")}</dd>
              </div>
              <div>
                <dt>Active campaigns</dt>
                <dd>{activeCount}</dd>
              </div>
              <div>
                <dt>Total campaigns</dt>
                <dd>{campaignHistory.length}</dd>
              </div>
            </dl>
            <PerformanceChart />
          </section>

          <section className="ed-panel" aria-labelledby="ed-q2">
            <h4 id="ed-q2" className="ed-q">
              Who is most vulnerable?
            </h4>
            <p className="ed-note">Click rate by group, {featured.campaignName}</p>
            <ol className="ed-bars">
              {ranked.map((g) => {
                const r = rate(g.clicked, g.recipients);
                return (
                  <li key={g.name} className={g === worst ? "is-worst" : ""}>
                    <span className="ed-bar-label">{g.name}</span>
                    <span className="ed-bar-track" aria-hidden="true">
                      <span className="ed-bar-fill" style={{ width: `${(r / Y_MAX) * 100}%` }} />
                    </span>
                    <span className="ed-bar-value">
                      {pct(g.clicked, g.recipients)}
                      <span className="sd-sr-only">
                        , {g.clicked} of {g.recipients} clicked
                      </span>
                    </span>
                  </li>
                );
              })}
            </ol>
          </section>

          <section className="ed-panel ed-panel--action" aria-labelledby="ed-q3">
            <h4 id="ed-q3" className="ed-q">
              Should I act on any of this?
            </h4>
            <div className="ed-rec">
              <div>
                <p className="ed-rec-title">{worst.name} keeps failing</p>
                <p className="ed-rec-body">
                  {worst.name} had the highest click rate in {featured.campaignName},{" "}
                  {pct(worst.clicked, worst.recipients)}, and {worstRepeat} of its people are repeat clickers.
                  Create a campaign just for them.
                </p>
              </div>
              <div className="ed-rec-action" aria-live="polite">
                {created ? (
                  <p className="ed-rec-done sd-fade">
                    Draft saved: {worst.name} {followUp.name.toLowerCase()}, {worst.recipients} people
                  </p>
                ) : (
                  <button type="button" className="sd-btn sd-btn--primary" onClick={() => setCreated(true)}>
                    Create campaign for {worst.name}
                  </button>
                )}
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
