import "./LibraryWireframe.css";

// "Before": the early template library concept as a grayscale sketch.
// Row content is drawn as bars; the layout is the point.
const rows = [62, 48, 55, 40];

export default function LibraryWireframe() {
  return (
<div className="lw" role="img" aria-label="Early wireframe of the template library: search field, a plain list, and Cancel and Add to campaign buttons">
  <div className="lw-modal" aria-hidden="true">
    <div className="lw-head">
      <span>Template library</span>
      <span className="lw-x">×</span>
    </div>
    <div className="lw-body">
      <span className="lw-bar" style={{ width: "70%" }}></span>
      <div className="lw-search">Search...</div>
      <div className="lw-list">
        {
          rows.map((w) => (
            <div className="lw-row">
              <span className="lw-check" />
              <span className="lw-thumb" />
              <span className="lw-lines">
                <span className="lw-bar lw-bar--dark" style={{ width: `${w}%` }} />
                <span className="lw-bar" style={{ width: `${w - 22}%` }} />
              </span>
            </div>
          ))
        }
      </div>
    </div>
    <div className="lw-foot">
      <span className="lw-btn">Cancel</span>
      <span className="lw-btn lw-btn--dark">Add to campaign</span>
    </div>
  </div>
</div>
  );
}
