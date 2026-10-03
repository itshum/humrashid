import "./BuilderWireframe.css";

// Early builder layout study. All content is dummy.
const templateRows = [68, 52, 60];

export default function BuilderWireframe() {
  return (
<div className="bw-stage" role="img" aria-label="Low-fidelity builder wireframe with campaign details, audience, and simulation training on the left, and a simple template list on the right">
  <div className="bw-window" aria-hidden="true">
    <div className="bw-head"><span>Campaign builder</span><span className="bw-head-actions"><i></i><i></i></span></div>
    <div className="bw-body">
      <div className="bw-form">
        <div className="bw-section">
          <span className="bw-section-title">Campaign details</span>
          <div className="bw-field"><span className="bw-label">Name</span><span className="bw-input"></span></div>
          <div className="bw-row">
            <div className="bw-field"><span className="bw-label">Start</span><span className="bw-input"></span></div>
            <div className="bw-field"><span className="bw-label">Duration</span><span className="bw-input"></span></div>
          </div>
        </div>
        <div className="bw-section">
          <span className="bw-section-title">Audience</span>
          <div className="bw-field"><span className="bw-label">Audience type</span><span className="bw-input"></span></div>
          <div className="bw-field"><span className="bw-label">Lists</span><span className="bw-input bw-input--chips"><i></i><i></i><i></i></span></div>
        </div>
        <div className="bw-section">
          <span className="bw-section-title">Simulation training</span>
          <div className="bw-field"><span className="bw-label">Notice page</span><span className="bw-input"></span></div>
          <div className="bw-training-row" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: "max(6px,1.75cqw)", color: "#72726f" }}><span>Assign training</span><span className="bw-toggle" style={{ display: "block", width: "5cqw", height: "2.8cqw", border: "1.5px dashed #a8a8a3", borderRadius: "99px", background: "#fff" }}></span></div>
        </div>
      </div>
      <div className="bw-list">
        <div className="bw-list-head"><span>Template list</span><span className="bw-plus">＋</span></div>
        {templateRows.map((width) => (
          <div className="bw-template-row">
            <span className="bw-box"></span>
            <span className="bw-template-lines"><i style={{ width: `${width}%` }}></i><i style={{ width: `${width - 24}%` }}></i></span>
          </div>
        ))}
        <div className="bw-add"><span>＋</span><i></i></div>
      </div>
    </div>
  </div>
</div>
  );
}
