import "./TtpDiagram.css";

// How Sublime's TTP framework turns into simulation templates. Static,
// so plain inline SVG rather than a React island. Colors come from the
// site's existing pastel palette (logo cells, footer shimmer), mixed
// against the page tokens so both themes stay legible.

export default function TtpDiagram() {
  return (
<figure className="ttp">
  <div className="ttp-scroll" tabIndex={0} role="region" aria-label="TTP to template diagram">
    <svg
      viewBox="0 0 624 588"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-labelledby="ttp-title ttp-desc"
    >
      <title id="ttp-title">From TTP framework to simulation template</title>
      <desc id="ttp-desc">
        The TTP framework, tactic, technique, and procedure, splits into attack type, the goal, and
        technique, the method. Both feed a detection rule that carries both labels. Each rule is tied to
        a template, the simulation sent. Rule firings produce prevalence, which shows what is most
        active and last seen. Prevalence feeds an AI generator, which writes new templates.
      </desc>

      <defs>
        <marker id="ttp-arrow" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M0,0 L8,4 L0,8 z" className="ttp-arrowhead" />
        </marker>
        <marker id="ttp-arrow-ga" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M0,0 L8,4 L0,8 z" className="ttp-arrowhead-ga" />
        </marker>
      </defs>

      <g className="ttp-edges">
        <line x1="260" y1="76" x2="140" y2="138" markerEnd="url(#ttp-arrow)" />
        <line x1="260" y1="76" x2="380" y2="138" markerEnd="url(#ttp-arrow)" />
        <line x1="140" y1="200" x2="260" y2="262" markerEnd="url(#ttp-arrow)" />
        <line x1="380" y1="200" x2="260" y2="262" markerEnd="url(#ttp-arrow)" />
        <line x1="260" y1="324" x2="260" y2="386" markerEnd="url(#ttp-arrow)" />
        <line x1="260" y1="448" x2="260" y2="510" markerEnd="url(#ttp-arrow)" />
      </g>

      <g className="ttp-edges ttp-edges--ga">
        <path d="M360,542 H504 V512" markerEnd="url(#ttp-arrow-ga)" />
        <path d="M504,450 V418 H362" markerEnd="url(#ttp-arrow-ga)" />
      </g>

      <g className="ttp-node">
        <rect x="150" y="16" width="220" height="60" rx="4" />
        <text x="260" y="42" className="ttp-name">TTP framework</text>
        <text x="260" y="60" className="ttp-sub">Tactic, technique, procedure</text>
      </g>

      <g className="ttp-node ttp-node--attack">
        <rect x="40" y="140" width="200" height="60" rx="4" />
        <text x="140" y="166" className="ttp-name">Attack type</text>
        <text x="140" y="184" className="ttp-sub">The goal: why</text>
      </g>

      <g className="ttp-node ttp-node--technique">
        <rect x="280" y="140" width="200" height="60" rx="4" />
        <text x="380" y="166" className="ttp-name">Technique</text>
        <text x="380" y="184" className="ttp-sub">The method: how</text>
      </g>

      <g className="ttp-node">
        <rect x="160" y="264" width="200" height="60" rx="4" />
        <text x="260" y="290" className="ttp-name">Detection rule</text>
        <text x="260" y="308" className="ttp-sub">Carries both labels</text>
      </g>

      <g className="ttp-node">
        <rect x="160" y="388" width="200" height="60" rx="4" />
        <text x="260" y="414" className="ttp-name">Template</text>
        <text x="260" y="432" className="ttp-sub">The simulation sent</text>
      </g>

      <g className="ttp-node ttp-node--ga">
        <rect x="160" y="512" width="200" height="60" rx="4" />
        <text x="260" y="538" className="ttp-name">Prevalence</text>
        <text x="260" y="556" className="ttp-sub">Most active, last seen</text>
      </g>

      <g className="ttp-node ttp-node--ga">
        <rect x="412" y="450" width="184" height="60" rx="4" />
        <text x="504" y="476" className="ttp-name">AI generator</text>
        <text x="504" y="494" className="ttp-sub">Writes new templates</text>
      </g>
    </svg>
  </div>

  <ul className="ttp-legend" aria-label="Legend">
    <li><span className="ttp-swatch ttp-swatch--attack" aria-hidden="true"></span>Attack type</li>
    <li><span className="ttp-swatch ttp-swatch--technique" aria-hidden="true"></span>Technique</li>
    <li><span className="ttp-swatch ttp-swatch--ga" aria-hidden="true"></span>Added toward GA</li>
  </ul>
</figure>
  );
}
