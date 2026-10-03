// The Sublime Security case study, restructured for the product shell.
// The words are the ones on the standalone page
// (src/pages/work/sublime-security.astro), with typographic apostrophes;
// captions come from what each visual shows.

import type { Shot } from "../pack/packContent";

const IMG = "/case-studies/sublime-security";

export const sublime = {
  title: "Dynamic Phishing Simulations",
  summary:
    "Turning a standalone phishing test into a product built on the attacks each customer actually faces.",
  meta: [
    { label: "Company", value: "Sublime Security" },
    { label: "Role", value: "Lead Product Designer" },
    { label: "Team", value: "PM, EM, 2 engineers, ML team" },
    { label: "Year", value: "2025 – 2026" },
  ],
  hero: {
    src: `${IMG}/home-preview.webp`,
    alt: "The Phishing Simulation Overview report, with repeat clickers and the group leaderboard below it",
    width: 3440,
    height: 2080,
  },
  brief: [
    {
      label: "The problem",
      text: "Customers paid for a separate tool to run phishing simulations, disconnected from the attacks actually hitting their inboxes.",
    },
    {
      label: "The approach",
      text: "Keep the builder lean, and put the depth in the results.",
    },
    {
      label: "The work",
      text: "Three phases, from private beta to GA, each tying campaigns closer to the real attacks Sublime sees.",
    },
    {
      label: "The result",
      text: "A top-three roadmap priority, expected to contribute to ARR and win new deals.",
    },
  ],

  challenge: {
    heading:
      "Customers were paying for a second tool to test what Sublime already knew",
    paragraphs: [
      "Security teams run phishing simulations to learn who will fall for a phish before an attacker does. Our customers were already running them, just not in Sublime. They paid for a separate tool that sent generic templates on a quarterly calendar, disconnected from the attacks actually hitting their inboxes. It was one of our most requested features.",
      "The strategic case was clear. Sublime sits inside the email stack, so it already knows which attacks each customer faces. A third-party app had to guess. Our detections close gaps in the filter. Simulations could close gaps in people, using the same data.",
      "I led design from first concept through private beta, public beta, and GA readiness, partnering closely with our PM, engineering, and ML team.",
    ],
  },

  approach: {
    heading: "Keep the builder lean. Put the depth in the results.",
    paragraphs: [
      "I set one goal early: an analyst should be able to launch a campaign as quickly as possible, even though every campaign needs several steps with their own settings.",
      "I also got an important assumption wrong. I expected analysts to want deep control, even an editor to redesign the phishing email. Early prototypes with beta customers proved otherwise. Analysts don’t want to design emails. They want to know who in their organization is most likely to fall for a phish, and what to do about it.",
      "That reframe set the strategy for every phase: keep the builder lean, and put the depth into results.",
    ],
  },

  phasesHeading: "Three phases, one idea",
  phasesIntro:
    "Each phase tied campaigns more closely to the real attacks Sublime sees.",
  phasesCaption:
    "What shipped in each phase, and what was added toward GA.",

  phase1: {
    n: "01",
    label: "Phase 1 · Private beta",
    heading: "Validate the core loop",
    body: [
      "Private beta was scoped deliberately small: a three-step builder (details, audience, template), a handful of static templates, and per-recipient reporting, shipped to a few trusted customers. The goal was to prove the core loop before building the full vision.",
    ],
    caption: "The private beta loop: build, send, read results.",
    after:
      "The biggest gap was intentional. Templates were generic and isolated from Sublime’s attack data. Closing that gap defined the next phase.",
  },

  phase2: {
    n: "02",
    label: "Phase 2 · Public beta",
    heading: "Ground it in Sublime",
    body: [
      "This is where simulations became Sublime’s own. Every template traced back to a detection rule, so the picker could lead with the attacks most active in each customer’s environment.",
    ],
    ttpCaption:
      "Every template maps to a detection rule, so prevalence data can rank what to simulate.",
    beforeCaption: "Before: a flat, generic list",
    afterCaption: "After: grouped by what’s active in your environment",
    after: [
      "We also shipped what beta customers asked for: staggered sends, so employees can’t warn each other at the water cooler. Plus, support for Sublime lists, Google Workspace, and Microsoft 365.",
      "Reporting started answering “What do I do with this information?” I added repeat clickers, the people who fall for more than one simulation, and a leaderboard of the most vulnerable and safest groups. It would have been easy to bolt on panels. Instead, customer conversations and prototypes decided what earned a spot.",
    ],
    resultsCaption:
      "Campaign results can be read by person or by team. Repeat clickers shows who fell for more than one simulation, and the group leaderboard ranks teams by click rate, flagging the most vulnerable and the safest.",
  },

  phase3: {
    n: "03",
    label: "Phase 3 · GA",
    heading: "Close the loop without breaking the flow",
    body: [
      "GA added training simulations (a separate but related product we were launching) and AI template personalization. Both made the product complete, but both threatened to bury the builder with more complexity and functionality.",
    ],
    shots: [
      {
        id: "studio",
        label: "Design Studio",
        src: `${IMG}/slide-design-studio.webp`,
        alt: "Prototype workspace canvas with GA builds, explorations and archived versions grouped by phase",
        caption:
          "Design Studio, our internal prototype workspace. Every screen and feature was prototyped extensively, GA build included, with every explored and archived version laid out on one free-flowing canvas, grouped by iteration and phase.",
        width: 2000,
        height: 1613,
      },
      {
        id: "list",
        label: "Campaign list",
        src: `${IMG}/slide-campaign-list.webp`,
        alt: "Phishing Simulations campaign list with audience, recipients, send date, open rate, click rate and status",
        caption:
          "The campaign list, where analysts start. Every simulation lives here with its status and high-level results, and new campaigns begin from the same page.",
        width: 2000,
        height: 1314,
      },
      {
        id: "detail",
        label: "Campaign details",
        src: `${IMG}/slide-campaign-detail.webp`,
        alt: "Campaign detail page with open, click and report rates, the template used, and a per-recipient results table",
        caption:
          "Campaign details, where analysts see how a simulation actually performed: open, click and report rates, the template used, and results for every recipient.",
        width: 1642,
        height: 1420,
      },
    ] satisfies Shot[],

    steps: {
      heading: "Adding a product without adding a step",
      paragraphs: [
        "Training was its own product, with its own settings, and it had to live inside the builder. Three steps were about to become four, and keeping the builder intuitive for analysts was at risk.",
        "With my PM, I pulled three levers: cut scope, reduce steps, and consolidate. I explored numerous iterations and ways to navigate the steps before realizing that the steps were the problem. I dropped the wizard builder for a single form with a live preview, and made training an optional toggle for security analysts.",
      ],
      wireCaption: "Low-fidelity builder",
      navCaption: "Stage navigation variants",
      builderCaption:
        "Every campaign setting lives on one form, with the email previewed live beside it. Switching templates updates the sender, subject, and body together, and the preview shows dynamic tags or the values an employee will see.",
      trainingCaption:
        "Employees who click on a phishing link land on a security notice that tells them it was a test and that their data is safe. Turning on training as a feature opens a multiple-choice question course from the same page, without adding a step to the builder.",
    },

    ai: {
      heading: "AI that doesn’t feel bolted on",
      paragraphs: [
        "With the ML team, we built an engine that generates templates from each customer’s own threat data, starting from a scenario or a real attack Sublime caught.",
        "My first design gave AI its own template manager, with filters and metadata. I was wrong again, for the same reason. Generation wasn’t a new experience; it was another way to pick a template. I folded it into the existing picker, with refinements that appear only after an attack type is chosen, and a promise of a template in 30 seconds or less.",
      ],
      caption:
        "Generate from a real message in the customer’s environment or from a scenario, refine it, and watch the email fill in. Sender details stay editable, but the body only changes by regenerating.",
    },

    guardrails: {
      heading: "A phishing generator that can’t phish",
      intro:
        "A tool that writes convincing phishing emails can’t become a real phishing tool. So I designed the guardrails into the interaction model:",
      items: [
        {
          title: "No copying",
          text: "Generated emails reuse an attack’s structure, never its words.",
        },
        {
          title: "No real people",
          text: "Names and company details are sanitized and only appear as variables.",
        },
        {
          title: "No free-text editing",
          text: "The email body changes through regeneration, never direct editing.",
        },
        {
          title: "Graceful fallback",
          text: "Thin detection history switches off environment-based options.",
        },
      ],
    },

    dashboard: {
      heading: "A dashboard for leadership",
      paragraphs: [
        "In GA, all of this came together in a dashboard that answers the question executives routinely ask: is our phishing simulation program actually working? Security teams get a macro view of campaign reach and click and report rates for any period, then drill into a team or an individual to see the impact. The data also drives action: a recommended next campaign, with templates generated from the threats we’ve seen in their environment. That closed the loop. Analysts build campaigns, read the results, and now see the whole program and what to do next.",
      ],
      caption:
        "An org-level read on how well simulations are working. Analysts use it to plan the next campaign, and executives use it to track the company’s security posture over time.",
    },
  },

  learned: {
    heading: "Less control, closer to the flow",
    paragraphs: [
      "Twice, my instinct was to give analysts more control in a separate space. Both times, the better answer was less, inside the flow they already knew. Analysts don’t want another tool to master. They want the answer.",
    ],
  },

  outcome: {
    heading: "A top-three roadmap priority",
    paragraphs: [
      "Simulations was a top-three roadmap priority, expected to contribute to ARR, win new deals, and keep customers from buying a separate tool. It also made Sublime stickier: the same data that stops attacks now tests and trains the people who might fall for them. I left shortly before GA, so post-launch numbers aren’t mine to share.",
    ],
  },
};
