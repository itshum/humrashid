import { useEffect, useId, useRef, useState } from "react";
import { AtSign, MousePointerClick } from "lucide-react";
import { groups, pct1, repeatClickers, type RepeatClicker } from "./acmeMock";
import "./sublimeDemo.css";
import "./sublimeUi.css";
import "./ResultsLeaderboard.css";

type View = "people" | "groups";

const clickRate = (g: (typeof groups)[number]) => g.clicked / g.recipients;
const rankedGroups = [...groups].sort((a, b) => clickRate(b) - clickRate(a));
const mostVulnerable = rankedGroups[0];
const safest = rankedGroups[rankedGroups.length - 1];

function GroupLeaderboard() {
  return (
    <div className="su-card rl-card">
      <div className="su-card-head">
        <AtSign aria-hidden="true" strokeWidth={2} />
        <h4 className="su-card-title">Group Leaderboard</h4>
      </div>
      <div className="rl-scroll">
        <table className="rl-table">
          <colgroup>
            <col style={{ width: "43%" }} />
            <col style={{ width: "13.5%" }} />
            <col style={{ width: "14.3%" }} />
            <col style={{ width: "14.2%" }} />
            <col style={{ width: "15%" }} />
          </colgroup>
          <thead>
            <tr>
              <th scope="col">Name</th>
              <th scope="col">Recipients</th>
              <th scope="col">Open Rate</th>
              <th scope="col">Click Rate</th>
              <th scope="col">Report Rate</th>
            </tr>
          </thead>
          <tbody>
            {rankedGroups.map((g) => (
              <tr key={g.name}>
                <th scope="row">
                  <span className="rl-name">
                    {g.name}
                    {g === mostVulnerable && (
                      <span className="su-pill su-pill--vulnerable">
                        <span className="su-pill-dot" aria-hidden="true" />
                        Vulnerable
                      </span>
                    )}
                    {g === safest && (
                      <span className="su-pill su-pill--safest">
                        <span className="su-pill-dot" aria-hidden="true" />
                        Safest
                      </span>
                    )}
                  </span>
                </th>
                <td>{g.recipients}</td>
                <td>{pct1(g.opened, g.recipients)}</td>
                <td>{pct1(g.clicked, g.recipients)}</td>
                <td>{pct1(g.reported, g.recipients)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function MoreCampaigns({ person }: { person: RepeatClicker }) {
  const [open, setOpen] = useState(false);
  const id = useId();
  const wrapRef = useRef<HTMLSpanElement>(null);
  const others = person.campaigns.slice(1);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    const onPointer = (e: PointerEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointer);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointer);
    };
  }, [open]);

  return (
    <span
      className="rl-more"
      ref={wrapRef}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        type="button"
        className="su-pill rl-more-btn"
        aria-expanded={open}
        aria-describedby={id}
        aria-label={`${others.length} more ${others.length === 1 ? "campaign" : "campaigns"}`}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        // Tap focuses and opens; tapping elsewhere or Escape closes. A
        // toggle here would fight focus and emulated hover on touch.
        onClick={() => setOpen(true)}
      >
        +{others.length}
      </button>
      <span id={id} role="tooltip" className="rl-pop" hidden={!open}>
        <span className="rl-pop-label">Also clicked</span>
        {others.map((c) => (
          <span key={c} className="rl-pop-item">
            {c}
          </span>
        ))}
      </span>
    </span>
  );
}

function RepeatClickers() {
  return (
    <div className="su-card rl-card">
      <div className="su-card-head">
        <MousePointerClick aria-hidden="true" strokeWidth={2} />
        <h4 className="su-card-title">Repeat Clickers</h4>
      </div>
      <div className="rl-scroll rl-scroll--pop">
        <table className="rl-table">
          <colgroup>
            <col style={{ width: "24%" }} />
            <col style={{ width: "25%" }} />
            <col style={{ width: "9%" }} />
            <col style={{ width: "42%" }} />
          </colgroup>
          <thead>
            <tr>
              <th scope="col">Name</th>
              <th scope="col">Group</th>
              <th scope="col">Clicks</th>
              <th scope="col">Campaigns</th>
            </tr>
          </thead>
          <tbody>
            {repeatClickers.map((p) => (
              <tr key={p.email}>
                <th scope="row">{p.name}</th>
                <td>{p.group}</td>
                <td>{p.campaigns.length}</td>
                <td>
                  <span className="rl-campaigns">
                    <span className="rl-latest">{p.campaigns[0]}</span>
                    {p.campaigns.length > 1 && <MoreCampaigns person={p} />}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function ResultsLeaderboard() {
  const [view, setView] = useState<View>("people");

  return (
    <div className="sd rl">
      <div className="sd-controls">
        <div className="sd-seg" role="group" aria-label="Show results by">
          <button type="button" aria-pressed={view === "people"} onClick={() => setView("people")}>
            Repeat clickers
          </button>
          <button type="button" aria-pressed={view === "groups"} onClick={() => setView("groups")}>
            Group leaderboard
          </button>
        </div>
      </div>
      <div className="su" aria-live="polite">
        {view === "people" ? <RepeatClickers /> : <GroupLeaderboard />}
      </div>
    </div>
  );
}
