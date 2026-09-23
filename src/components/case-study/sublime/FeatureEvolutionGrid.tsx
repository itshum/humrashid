import { useRef, useState } from "react";
import { phases, rows, stateLabels, type Cell, type PhaseId } from "./featureEvolution.data";
import "./FeatureEvolutionGrid.css";

type Filter = "all" | PhaseId;

const filters: { id: Filter; label: string }[] = [
  { id: "all", label: "All phases" },
  ...phases.map((p) => ({ id: p.id, label: p.name })),
];

function CellContent({ cell }: { cell: Cell }) {
  if (cell.state === "new" && cell.items?.length) {
    return (
      <ul className="feg-items">
        {cell.items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    );
  }
  return <span className="feg-status">{stateLabels[cell.state]}</span>;
}

export default function FeatureEvolutionGrid() {
  const [active, setActive] = useState<Filter>("all");
  const scrollRef = useRef<HTMLDivElement>(null);

  function select(id: Filter) {
    setActive(id);
    const scroller = scrollRef.current;
    if (!scroller || scroller.scrollWidth <= scroller.clientWidth) return;
    // On narrow screens the table scrolls sideways, so bring the chosen
    // phase into view instead of leaving it off-screen behind the dim.
    const header = scroller.querySelector<HTMLElement>(`th[data-phase="${id}"]`);
    const rowHeader = scroller.querySelector<HTMLElement>("tbody th");
    const left = id === "all" || !header ? 0 : header.offsetLeft - (rowHeader?.offsetWidth ?? 0) - 8;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    scroller.scrollTo({ left, behavior: reduceMotion ? "auto" : "smooth" });
  }

  const dimmed = (phase: PhaseId) => active !== "all" && active !== phase;

  return (
    <div className="feg">
      <div className="feg-filters" role="group" aria-label="Show a phase">
        {filters.map((f) => (
          <button
            key={f.id}
            type="button"
            className="feg-filter"
            aria-pressed={active === f.id}
            onClick={() => select(f.id)}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="feg-scroll" ref={scrollRef} tabIndex={0} role="region" aria-label="Features by phase">
        <table className="feg-table">
          <caption className="feg-sr-only">
            How each part of the product changed across private beta, public beta, and GA
          </caption>
          <thead>
            <tr>
              <th scope="col" className="feg-corner">
                <span className="feg-sr-only">Area</span>
              </th>
              {phases.map((p) => (
                <th
                  key={p.id}
                  scope="col"
                  data-phase={p.id}
                  className={dimmed(p.id) ? "feg-phase is-dimmed" : "feg-phase"}
                >
                  <span className="feg-phase-name">{p.name}</span>
                  <span className="feg-phase-goal">{p.goal}</span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.area}>
                <th scope="row" className="feg-area">
                  {row.area}
                </th>
                {phases.map((p) => {
                  const cell = row.cells[p.id];
                  return (
                    <td
                      key={p.id}
                      data-phase={p.id}
                      className={`feg-cell feg-cell--${cell.state}${dimmed(p.id) ? " is-dimmed" : ""}`}
                    >
                      <CellContent cell={cell} />
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ul className="feg-legend" aria-label="Legend">
        {(["new", "carry", "none"] as const).map((state) => (
          <li key={state}>
            <span className={`feg-swatch feg-cell--${state}`} aria-hidden="true" />
            {stateLabels[state]}
          </li>
        ))}
      </ul>
    </div>
  );
}
