import { cn } from "@/lib/utils";
import "./LibraryFinal.css";

// A compact version of the final template library. The list
// scrolls inside the modal so its outer height matches the Before sketch.
type Category = "Identity" | "Business process" | "Document share" | "Support";
type Entry = { name: string; category: Category };

const templates: Entry[] = [
  { name: "Account access", category: "Identity" },
  { name: "Sign-in activity", category: "Identity" },
  { name: "Security settings", category: "Identity" },
  { name: "Team request", category: "Business process" },
  { name: "Shared document", category: "Document share" },
  { name: "Help desk", category: "Support" },
  { name: "Payment process", category: "Business process" },
  { name: "Project file", category: "Document share" },
  { name: "Device support", category: "Support" },
  { name: "Policy update", category: "Business process" },
  { name: "Benefits process", category: "Business process" },
  { name: "Payroll process", category: "Business process" },
  { name: "Invoice process", category: "Business process" },
  { name: "Workspace access", category: "Identity" },
  { name: "Account review", category: "Identity" },
  { name: "File review", category: "Document share" },
  { name: "Scheduling", category: "Business process" },
  { name: "Service request", category: "Support" },
  { name: "Profile change", category: "Identity" },
  { name: "Access request", category: "Identity" },
  { name: "Team announcement", category: "Business process" },
  { name: "Document approval", category: "Document share" },
  { name: "Operations update", category: "Business process" },
  { name: "Support ticket", category: "Support" },
  { name: "Training reminder", category: "Business process" },
];

const sections = [
  { heading: "Most active in your environment", entries: templates.slice(0, 5) },
  { heading: "Recently seen", entries: templates.slice(5, 10) },
  { heading: "All templates", entries: templates },
];

export default function LibraryFinal() {
  return (
<div className="lf-stage" role="img" aria-label="Final template library with a search field, fictional templates grouped by activity, category labels, and an Add button">
  <div className="lf-modal" aria-hidden="true">
    <div className="lf-head">
      <span className="lf-title">Add From Library</span>
      <span className="lf-close"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12" /></svg></span>
    </div>
    <div className="lf-body">
      <p>Choose existing templates to add to this campaign.</p>
      <div className="lf-search">
        <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.7"><circle cx="8.5" cy="8.5" r="5.6"/><path d="m13 13 4.5 4.5"/></svg>
        <span>Search templates</span>
      </div>
      <div className="lf-scroll">
        {sections.map((section) => (
          <div className="lf-section">
            <p className="lf-section-title">{section.heading} ({section.entries.length})</p>
            {section.entries.map((entry, index) => (
              <div className="lf-row">
                <span className={cn("lf-check", index === 0 && section.heading === "Recently seen" && "is-checked")}>
                  {index === 0 && section.heading === "Recently seen" && <span>✓</span>}
                </span>
                <span className="lf-name">{entry.name}</span>
                <span className="lf-category">{entry.category}</span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
    <div className="lf-foot"><span className="lf-add">Add</span></div>
  </div>
</div>
  );
}
