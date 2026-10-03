// The sprint, as I run it on my own: one designer taking a single problem
// from a written brief to a tested prototype in one or two weeks, with
// product, engineering and others pulled in at the moments that matter.
// The schedule is laid out as ten working days.

import type { DocKind } from "./DeliverableIcon";

// Who is involved, grouped the way the page colors them.
export type Role = "designer" | "pm" | "stakeholder" | "user" | "leadership";

export interface Deliverable {
  title: string;
  text: string;
  // Which document icon it gets.
  icon: DocKind;
}

export interface Phase {
  id: string;
  name: string;
  // Its color on the schedule.
  hue: string;
  // A deep shade of the same color (the 800 to 900 range), for the number
  // on the filled chip.
  ink: string;
  // Its share of the schedule's width, about the days it takes (Decide is
  // a short session, Prototype is the longest stretch).
  weight: number;
  when: string;
  goal: string;
  activities: string[];
  deliverables: Deliverable[];
  involved: Array<{ label: string; role: Role }>;
}

export const sprintIntro = [
  "Most projects I run start the same way: a dedicated design sprint. One or two weeks, one problem, and a prototype that real users have reacted to by the end. I run it from start to finish as the lead designer, and bring product and engineering in at the moments that matter.",
  "I’ve refined it over more than a decade of shipping products, mostly in B2B SaaS and eCommerce. Here is how a sprint runs, what I make at each phase, and who I work with along the way.",
];

export const roles: Record<Role, { label: string }> = {
  designer: { label: "Designer" },
  pm: { label: "Product manager" },
  stakeholder: { label: "Stakeholders" },
  user: { label: "Users" },
  leadership: { label: "Leadership" },
};

export const phases: Phase[] = [
  {
    id: "frame",
    name: "Frame",
    hue: "oklch(0.72 0.14 150)",
    ink: "oklch(0.33 0.08 150)",
    weight: 2,
    when: "Days 1–2",
    goal: "Get the problem and the goal in writing",
    activities: [
      "Pressure-test the brief with product and engineering.",
      "Read support tickets and analytics, and talk to whoever is closest to customers.",
      "Audit the current flow and a few competitors.",
    ],
    deliverables: [
      {
        title: "One-page design brief",
        text: "The problem, the user, and how we’ll measure success",
        icon: "lines",
      },
      {
        title: "Assumptions to test",
        text: "What we’re betting on, riskiest first",
        icon: "question",
      },
    ],
    involved: [
      { label: "Designer", role: "designer" },
      { label: "Product manager", role: "pm" },
      { label: "Engineering", role: "stakeholder" },
    ],
  },
  {
    id: "map",
    name: "Map & Sketch",
    hue: "oklch(0.84 0.15 95)",
    ink: "oklch(0.39 0.08 85)",
    weight: 2,
    when: "Days 3–4",
    goal: "Find the moment worth solving, then sketch my way through it",
    activities: [
      "Map the current flow and mark where people get stuck.",
      "Choose the one moment the sprint will solve.",
      "Sketch a handful of directions on my own, fast.",
    ],
    deliverables: [
      {
        title: "User flow map",
        text: "The path today, with the pain points marked",
        icon: "flow",
      },
      {
        title: "Sketches",
        text: "A range of directions, rough on purpose",
        icon: "sketch",
      },
    ],
    involved: [
      { label: "Designer", role: "designer" },
      { label: "Product manager", role: "pm" },
    ],
  },
  {
    id: "decide",
    name: "Decide",
    hue: "oklch(0.75 0.15 55)",
    ink: "oklch(0.37 0.12 38)",
    weight: 1.3,
    when: "Day 5",
    goal: "Pick one direction with product and engineering",
    activities: [
      "Walk product and engineering through the sketches.",
      "Critique together, then weigh the trade-offs and scope.",
      "Agree on one flow to prototype, and what’s out.",
    ],
    deliverables: [
      {
        title: "Decision notes",
        text: "What we chose, what we didn’t, and why",
        icon: "check",
      },
      {
        title: "Flow to prototype",
        text: "The exact steps the prototype will cover",
        icon: "frames",
      },
    ],
    involved: [
      { label: "Designer", role: "designer" },
      { label: "Product manager", role: "pm" },
      { label: "Engineering", role: "stakeholder" },
      { label: "Leadership", role: "leadership" },
    ],
  },
  {
    id: "prototype",
    name: "Prototype",
    hue: "oklch(0.66 0.16 300)",
    ink: "oklch(0.31 0.12 300)",
    weight: 3,
    when: "Days 6–8",
    goal: "Make it real enough to react to",
    activities: [
      "Use AI to prototype fast, from low-fidelity wireframes that test the strategy to the product’s real UI.",
      "Use AI to link the screens into a clickable prototype, again as quickly as possible.",
      "Write the test tasks as I go.",
    ],
    deliverables: [
      {
        title: "High-fidelity screens",
        text: "The flow, in the product’s own design system",
        icon: "screen",
      },
      {
        title: "Clickable prototype",
        text: "Believable enough that users forget it isn’t real",
        icon: "click",
      },
      {
        title: "Test script",
        text: "The tasks and questions for the sessions",
        icon: "code",
      },
    ],
    involved: [
      { label: "Designer", role: "designer" },
      { label: "Engineering", role: "stakeholder" },
    ],
  },
  {
    id: "test",
    name: "Test & Hand Off",
    hue: "oklch(0.66 0.15 250)",
    ink: "oklch(0.31 0.1 255)",
    weight: 2,
    when: "Days 9–10",
    goal: "Test it with users, then hand it off",
    activities: [
      "Run short sessions with users, recruited through product, support, or sales.",
      "Note what worked, what confused, and what surprised.",
      "Share the findings and hand off the flow with specs and tickets.",
    ],
    deliverables: [
      {
        title: "Findings summary",
        text: "What worked, what didn’t, and what to change",
        icon: "lines",
      },
      {
        title: "Recommendation",
        text: "What to build next, in what order",
        icon: "lines",
      },
      {
        title: "Handoff specs and tickets",
        text: "The validated flow, ready for engineering",
        icon: "tickets",
      },
    ],
    involved: [
      { label: "Designer", role: "designer" },
      { label: "Product manager", role: "pm" },
      { label: "Engineering", role: "stakeholder" },
      { label: "Users", role: "user" },
    ],
  },
];

export const biggerProblems = {
  heading: "When the problem is bigger",
  text: "Bigger problems get the same loop more than once. If the flow crosses several teams, I bring them into a mapping session first. If the area is new to me, I add a research week up front. The loop doesn’t change. I\u00a0just run it again, one problem at a time.",
};
