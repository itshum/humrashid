// Content for the "Three phases, one idea" feature evolution grid.
// Edit freely: the component renders whatever is here. Within a cell,
// each string in `items` becomes its own line.

export type CellState = "new" | "carry" | "none";

export type PhaseId = "private" | "public" | "ga";

export interface Phase {
  id: PhaseId;
  name: string;
  goal: string;
}

export interface Cell {
  state: CellState;
  items?: string[];
}

export interface FeatureRow {
  area: string;
  cells: Record<PhaseId, Cell>;
}

export const phases: Phase[] = [
  { id: "private", name: "Private beta", goal: "Test assumptions" },
  { id: "public", name: "Public beta", goal: "Ground it in Sublime" },
  { id: "ga", name: "GA", goal: "Close the loop" },
];

export const rows: FeatureRow[] = [
  {
    area: "Builder",
    cells: {
      private: { state: "new", items: ["Three-step flow", "Name, start, duration"] },
      public: { state: "new", items: ["Delivery mode with staggered sends"] },
      ga: { state: "new", items: ["One form, no wizard", "Live preview, send test, drafts"] },
    },
  },
  {
    area: "Audience",
    cells: {
      private: { state: "new", items: ["Sublime email lists"] },
      public: { state: "new", items: ["Google Workspace and Microsoft 365 groups", "CSV upload"] },
      ga: { state: "carry" },
    },
  },
  {
    area: "Templates",
    cells: {
      private: { state: "new", items: ["A handful of static, generic templates"] },
      public: { state: "new", items: ["Dozens built from real attacks", "Most active and recently seen"] },
      ga: { state: "new", items: ["Multiple templates per campaign"] },
    },
  },
  {
    area: "Training",
    cells: {
      private: { state: "none" },
      public: { state: "none" },
      ga: { state: "new", items: ["Optional toggle", "Notice or custom quiz after a click"] },
    },
  },
  {
    area: "AI",
    cells: {
      private: { state: "none" },
      public: { state: "none" },
      ga: { state: "new", items: ["Generate from a scenario or real message", "Built-in guardrails"] },
    },
  },
  {
    area: "Reporting",
    cells: {
      private: { state: "new", items: ["Campaign list", "Per-recipient opens, clicks, reports"] },
      public: { state: "new", items: ["Repeat clickers, top targets", "Simulations dashboard, leaderboard"] },
      ga: { state: "new", items: ["Executive view", "Recommended next campaign"] },
    },
  },
];

export const stateLabels: Record<CellState, string> = {
  new: "New in this phase",
  carry: "Carried forward",
  none: "Not yet",
};
