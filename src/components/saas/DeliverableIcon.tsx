import type { ReactNode } from "react";

// A document icon for each kind of deliverable: the same page outline every
// time, with a small mark inside that says what the document is. Drawn on a
// 24 grid with a 1.5 stroke, like the lucide page they replace, so they sit
// together as a set.

export type DocKind =
  | "lines" // a written document: brief, findings, recommendation
  | "question" // assumptions to test
  | "flow" // a flow map
  | "sketch" // sketches
  | "check" // decision notes
  | "frames" // a storyboard
  | "screen" // high-fidelity screens
  | "click" // a clickable prototype
  | "code" // a test script
  | "tickets"; // handoff specs and tickets

const INSIDE: Record<DocKind, ReactNode> = {
  lines: <path d="M8 12.5h8M8 16.5h5" />,
  question: (
    <>
      <path d="M9.8 13a2.2 2.2 0 1 1 3.4 1.9c-.8.5-1.2.9-1.2 1.7" />
      <path d="M12 18.4h.01" />
    </>
  ),
  flow: (
    <>
      <circle cx="9" cy="12.4" r="1.15" />
      <circle cx="15.2" cy="17.2" r="1.15" />
      <path d="M9 13.6v3.6h4.9" />
    </>
  ),
  sketch: (
    <>
      <path d="M8 14c1.3-2.2 2.2-2.2 3-.4s1.9 1.7 3.4-.7" />
      <path d="M8 17.6h5" />
    </>
  ),
  check: <path d="M8.6 15l2.2 2.2 4.6-4.9" />,
  frames: (
    <>
      <rect x="8" y="12" width="3.2" height="3.2" rx=".6" />
      <rect x="12.8" y="12" width="3.2" height="3.2" rx=".6" />
      <path d="M8 18h8" />
    </>
  ),
  screen: (
    <>
      <path d="M8 12.2h8" />
      <rect x="8" y="14.2" width="3.4" height="3.4" rx=".6" />
      <path d="M13 14.6h3M13 17.2h3" />
    </>
  ),
  click: (
    <>
      <rect x="8" y="12" width="3.4" height="3.4" rx=".6" />
      <path d="M12.6 13.4l1.2 4.5.9-1.8 1.8-.9Z" />
    </>
  ),
  code: (
    <>
      <path d="M10.2 12.8L8 15l2.2 2.2" />
      <path d="M13.8 12.8L16 15l-2.2 2.2" />
    </>
  ),
  tickets: (
    <>
      <path d="M8 12.6l.9.9 1.6-1.8M12.8 12.6H16" />
      <path d="M8 17.1l.9.9 1.6-1.8M12.8 17.1H16" />
    </>
  ),
};

export function DeliverableIcon({
  kind,
  className,
}: {
  kind: DocKind;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
      <path d="M14 2v4a2 2 0 0 0 2 2h4" />
      {INSIDE[kind]}
    </svg>
  );
}
