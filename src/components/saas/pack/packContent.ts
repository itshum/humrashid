// The Pack case study, restructured for the product shell. The words are
// the ones on the live case study (src/content/case-studies/pack.md),
// with typographic apostrophes; captions are written from what each
// image actually shows (several alt texts on the original page named the
// wrong screen). The unfinished "Qualitative, copy pending" outcome
// section is left out.

const IMG = "/case-studies/pack";

export interface Shot {
  id: string;
  label: string; // tab label
  src: string;
  alt: string;
  caption: string;
}

export const pack = {
  title: "Pack",
  summary: "Turning an agency’s custom commerce builds into a scalable, merchant friendly SaaS platform.",
  meta: [
    { label: "Company", value: "Pack" },
    { label: "Role", value: "Design Director" },
    { label: "Team", value: "Nessa" },
    { label: "Year", value: "2023" },
  ],
  hero: {
    src: `${IMG}/01-hero-a.webp`,
    alt: "The Pack platform’s home dashboard on a laptop",
    width: 3600,
    height: 1850,
  },
  brief: [
    { label: "The problem", text: "Pack’s custom agency work had to become a product that hundreds of merchants could use without anyone standing over their shoulder." },
    { label: "The approach", text: "Customer interviews before screens, then build less, but build it right." },
    { label: "The work", text: "Five workflows: the dashboard, developer setup, the site customizer, merchandising, and the design system." },
  ],

  challenge: {
    heading: "From bespoke builds to a real product",
    paragraphs: [
      "Pack started as an agency, building fully custom headless commerce sites for brands like Cuts and Vuori. That work was good because it was custom: a small team hand-building one storefront at a time, solving each brand’s problems directly.",
      "After closing their seed round, Pack needed to become a product. The same team, the same expertise, but now serving hundreds of merchants instead of a handful of clients. That’s a harder design problem than it sounds like. The instincts that make one-off custom work great don’t automatically translate into something a stranger can pick up and use without you standing over their shoulder.",
      "I led design on this transition, working directly with Pack’s product and engineering team, including CEO Cory Cummings, to define what “productized” actually meant for this business.",
    ],
    shots: [
      {
        id: "setup",
        label: "Account setup",
        src: `${IMG}/pack-dev-setup.png`,
        alt: "The “Setup your Pack account” checklist",
        caption: "The first screen a new merchant sees: a checklist to connect GitHub, sync products, migrate blogs, set redirects, and customize.",
      },
      {
        id: "account",
        label: "Create account",
        src: `${IMG}/pack-dev-account.png`,
        alt: "The create-account screen beside an invitation email",
        caption: "Creating an account, and the email that invites a teammate.",
      },
    ] as Shot[],
  },

  approach: {
    heading: "Interviews before screens",
    lead: "We started with customer interviews, not screens. My team and I talked to merchants who’d tried other headless platforms, to learn where they actually got stuck rather than where we assumed they would. Three patterns showed up fast:",
    patterns: [
      { n: "1", text: "Onboarding took too long." },
      { n: "2", text: "Merchandising tools felt bolted onto the commerce infrastructure instead of built for it." },
      { n: "3", text: "Every customizer on the market asked marketers to think like developers." },
    ],
    paragraphs: [
      "That research drove one of the harder calls on the project: build less, but build it right. Instead of chasing feature parity with every competitor, we prioritized the handful of workflows that would decide whether someone succeeded in their first week on the platform. Everything else could wait.",
      "From there, we ran the rhythm of a small, fast-moving design team: sketches into clickable prototypes, testing rough ideas with Pack’s team before committing engineering time, then refining based on what we learned.",
    ],
    nav: {
      src: `${IMG}/Pack-Navsystem.png`,
      alt: "Pack’s navigation in light and dark, with the organization switcher",
      caption: "The navigation system, light and dark, with the organization switcher and sync notifications.",
      width: 2756,
      height: 1760,
    },
  },

  workflowsHeading: "Designing critical workflows for merchants and developers",

  dashboard: {
    n: "1",
    label: "The dashboard",
    heading: "One place to understand the store",
    body: [
      "Store owners needed one place to understand how their storefront was actually performing: revenue, traffic, conversion, site speed. Instead of a wall of charts, we organized the dashboard around what a merchant would actually want to check on a given day. A sidebar carries across multiple storefronts, so managing more than one store never feels like starting from scratch.",
    ],
    before: { src: `${IMG}/dashboard-wireframe.svg`, label: "Wireframe" },
    after: { src: `${IMG}/03-s01-transition-desktop.webp`, label: "Final" },
    alt: "The dashboard as a wireframe and as the final design",
    caption: "Drag to move from the wireframe to the final dashboard: revenue, customers, and usage, a conversion funnel, and prompts for next steps.",
  },

  developer: {
    n: "2",
    label: "Developer experience",
    heading: "Opinion-free setup, built for developers",
    body: [
      "Modern headless builds mean wrangling a pile of apps just to get started. We stripped the setup down so developers could plug into Git with their own API keys and start building without an opinionated workflow forced on them, with real visibility into deploys and status instead of a black box.",
    ],
    shots: [
      { id: "git", label: "Git and API keys", src: `${IMG}/10-s01-git-integration-desktop.webp`, alt: "Developer settings with a connected Git repository and API keys", caption: "Developer settings: a connected Git repository, API keys, and the storefront starter variables, each one copyable." },
      { id: "deploys", label: "Deploys", src: `${IMG}/11-s01-deploy-logs-desktop.webp`, alt: "Deploy history with published and failed statuses", caption: "Deploys: auto-deploy on every change, with a history that shows what published and what failed." },
      { id: "team", label: "Team and roles", src: `${IMG}/09-s01-dev-onboarding-desktop.webp`, alt: "Members grouped by role, with a change-role menu", caption: "Members grouped by role (admin, store owner, developer), with seats, status, and per-person access." },
      { id: "profile", label: "Profile", src: `${IMG}/08-s01-collection-building-desktop.webp`, alt: "A store owner’s profile settings", caption: "A store owner’s profile: name, email, image, and password." },
    ] as Shot[],
  },

  customizer: {
    n: "3",
    label: "The site customizer",
    heading: "Merchant friendly editing, not an abstraction of it",
    body: [
      "Most WYSIWYG site builders make you choose between flexibility and simplicity, and usually fail at both. We rebuilt the customizer around a sidebar that slides out over a live preview of the actual storefront, so a marketer edits the real page, not an abstraction of it. Every component, banners, product carousels, video modules, rich text, was built to the same global system, so swapping one out never breaks the page around it.",
      "The goal was letting a marketer launch a new landing page or run an A/B test without pulling in a developer. That’s the actual measure of whether a customizer works.",
    ],
    shots: [
      { id: "edit", label: "Edit a page", src: `${IMG}/16-s02-video-module-desktop.webp`, alt: "A product page open in the customizer, with sections beside the live storefront", caption: "A product page in the customizer: its template and sections on the left, the live storefront on the right." },
      { id: "add", label: "Add a section", src: `${IMG}/14-s02-banner-slideshow-desktop.webp`, alt: "The add-section panel listing global and linked sections", caption: "Adding a section from the library, split into global sections (the same everywhere) and linked ones." },
      { id: "switch", label: "Switch pages", src: `${IMG}/13-s02-realtime-editing-desktop.webp`, alt: "The page switcher listing pages and articles", caption: "Jumping between pages and articles from the top bar, without leaving the editor." },
      { id: "media", label: "Media manager", src: `${IMG}/12-s02-customizer-sidebar-desktop.webp`, alt: "The media manager with filters and a drop zone", caption: "The media manager: search and filter the library, or drop a file in to upload." },
      { id: "publish", label: "Review and publish", src: `${IMG}/15-s02-product-carousel-desktop.webp`, alt: "Review changes and scheduled publish dialogs", caption: "Review what changed, then publish now or schedule it for later." },
    ] as Shot[],
  },

  merchandising: {
    n: "4",
    label: "Merchandising",
    heading: "Bundles in a few clicks, not a spreadsheet",
    body: [
      "Headless builds have a reputation for clunky merchandising, mostly because commerce infrastructure and merchandising tools tend to get designed separately and bolted together after the fact. We redesigned this so merchants could build product bundles and collections through intelligent, attribute-based grouping instead of manual, one-by-one setup. It’s a small change with a large effect: what used to take a spreadsheet and a developer now takes a few clicks.",
    ],
    shots: [
      { id: "groups", label: "Product groups", src: `${IMG}/07-s01-bundling-desktop.webp`, alt: "The product groups editor with subgroups and a product search", caption: "Product groups: subgroups on the left, the products inside a group in the middle, and a visual list of groups on the right." },
      { id: "catalog", label: "Product catalog", src: `${IMG}/06-s01-merchandising-desktop.webp`, alt: "The products list synced from Shopify", caption: "The product catalog, synced from Shopify, with status and quick actions on every row." },
    ] as Shot[],
  },

  designSystem: {
    n: "5",
    label: "The design system",
    heading: "One system, built to grow with the product",
    body: [
      "As Pack grew more complex, its design system hadn’t kept pace. We rebuilt it from the ground up: a custom iconography library, a refreshed color palette, bold lifestyle photography, and a new set of UI components, each considered for its own use case, flexibility, and reuse across the platform. The goal was one cohesive kit that could extend to every touchpoint as the product kept growing.",
    ],
    figure: {
      src: `${IMG}/20-s04-iconography-desktop.webp`,
      alt: "The design system: typography, components, shadows, and color",
      caption: "The kit: type scale, form and navigation components, tags and toasts, shadows, and the color ramp.",
      width: 2760,
      height: 1500,
    },
  },

  quote: {
    text: "The new Pack platform gives brands and agencies powerful front‑end tools to communicate with customers more easily. We’re incredibly proud of Nessa’s design work. Collaborating with their team allowed us to simplify the headless build process into a cutting edge software product designed for brand operators and developers.",
    attribution: "Cory Cummings, CEO at Pack",
  },
};
