import "./BuilderNavVariants.css";

// Navigation exploration, redrawn with fictional campaign details.
// The selected consolidated direction gets the most space in the frame.

export default function BuilderNavVariants() {
  return (
<div className="bn-stage" role="img" aria-label="Five campaign builder navigation explorations: centered steps, underline tabs, segmented control, selected consolidated toolbar, and stacked labels">
  <div className="bn-board" aria-hidden="true">
    <div className="bn-option bn-option--centered">
      <div className="bn-option-head">
        <span className="bn-label">Centered steps</span>
        <span className="bn-status"><span className="bn-check">✓</span> Draft saved</span>
      </div>
      <div className="bn-centered-nav">
        <span>Campaign</span><span className="bn-chevron">›</span>
        <span>Template</span><span className="bn-chevron">›</span>
        <strong>Training</strong>
      </div>
    </div>

    <div className="bn-option bn-option--tabs">
      <div className="bn-option-head">
        <span className="bn-label">Underline tabs</span>
        <span className="bn-status"><span className="bn-check">✓</span> Draft saved</span>
      </div>
      <div className="bn-tabs-nav">
        <span>Campaign</span><span>Template</span><strong>Training</strong>
      </div>
    </div>

    <div className="bn-option bn-option--segmented">
      <div className="bn-option-head">
        <span className="bn-label">Segmented control</span>
        <span className="bn-status"><span className="bn-check">✓</span> Draft saved</span>
      </div>
      <div className="bn-segmented-nav">
        <span>Campaign</span><span>Template</span><strong>Training</strong>
      </div>
    </div>

    <div className="bn-option bn-option--selected">
      <div className="bn-option-head">
        <span className="bn-label">Consolidated toolbar <span className="bn-picked">Selected</span></span>
        <span className="bn-actions"><span className="bn-status"><span className="bn-check">✓</span> Draft saved</span><span className="bn-cancel">Cancel</span><span className="bn-launch">Launch</span></span>
      </div>
      <div className="bn-toolbar-nav">
        <span className="bn-step"><span className="bn-step-icon">⚙</span>Campaign</span>
        <span className="bn-chevron">›</span>
        <span className="bn-step"><span className="bn-step-icon">▣</span>Template</span>
        <span className="bn-chevron">›</span>
        <strong className="bn-step bn-step--active"><span className="bn-step-icon">▰</span>Training</strong>
      </div>
    </div>

    <div className="bn-option bn-option--stacked">
      <div className="bn-option-head">
        <span className="bn-label">Stacked labels</span>
        <span className="bn-status"><span className="bn-check">✓</span> Draft saved</span>
      </div>
      <div className="bn-stacked-nav">
        <span><strong>Campaign</strong><small>Settings & audience</small></span>
        <span className="bn-chevron">›</span>
        <span><strong>Template</strong><small>Pick a template</small></span>
        <span className="bn-chevron">›</span>
        <span className="bn-stacked-active"><strong>Training</strong><small>After a click</small></span>
      </div>
    </div>
  </div>
</div>
  );
}
