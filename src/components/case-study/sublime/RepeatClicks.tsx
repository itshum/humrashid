import { useEffect, useId, useRef, useState } from "react";
import { repeatClickers, type RepeatClicker } from "./acmeMock";
import "./sublimeDemo.css";
import "./RepeatClicks.css";

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
      className="rc-more"
      ref={wrapRef}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        type="button"
        className="rc-more-btn"
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
      <span id={id} role="tooltip" className="rc-pop" hidden={!open}>
        <span className="rc-pop-label">Also clicked</span>
        {others.map((c) => (
          <span key={c} className="rc-pop-item">
            {c}
          </span>
        ))}
      </span>
    </span>
  );
}

export default function RepeatClicks() {
  return (
    <div className="sd rc">
      <div className="sd-frame">
        <div className="rc-head">
          <div>
            <p className="rc-title">Repeat clickers</p>
            <p className="rc-sub">People who clicked in more than one simulation</p>
          </div>
          <span className="sd-tag">{repeatClickers.length} people</span>
        </div>
        <div className="rc-scroll">
          <table className="rc-table">
            <thead>
              <tr>
                <th scope="col">Recipient</th>
                <th scope="col">Group</th>
                <th scope="col" className="rc-num">
                  Clicks
                </th>
                <th scope="col">Campaigns</th>
              </tr>
            </thead>
            <tbody>
              {repeatClickers.map((p) => (
                <tr key={p.email}>
                  <td>
                    <span className="rc-name">{p.name}</span>
                    <span className="rc-email">{p.email}</span>
                  </td>
                  <td>{p.group}</td>
                  <td className="rc-num">{p.campaigns.length}</td>
                  <td>
                    <span className="rc-campaigns">
                      <span className="rc-latest">{p.campaigns[0]}</span>
                      {p.campaigns.length > 1 && <MoreCampaigns person={p} />}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
