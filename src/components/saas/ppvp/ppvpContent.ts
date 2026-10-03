// The PPVP case study, restructured for the product shell. The words are
// the ones on the live case study (src/content/case-studies/ppvp.md),
// with typographic apostrophes; captions are written from what each
// image actually shows.

import type { Shot } from "../pack/packContent";

const IMG = "/case-studies/ppvp";

export const ppvp = {
  title: "PPVP",
  summary: "Designing an exclusive investment app for accredited investors.",
  meta: [
    { label: "Company", value: "PPVP" },
    { label: "Role", value: "Design Director" },
    { label: "Team", value: "Nessa" },
    { label: "Year", value: "2023" },
  ],
  hero: {
    src: `${IMG}/01-hero-desktop.webp`,
    alt: "The PPVP app home screen on a phone, held in hand",
    width: 2462,
    height: 1265,
  },
  brief: [
    { label: "The problem", text: "Give a fund’s own investors direct access to exclusive deal flow, in an app that feels as selective as the fund." },
    { label: "The approach", text: "Start with the design system, so every screen inherits the same quiet, editorial tone." },
    { label: "The work", text: "Five pieces: invite-only onboarding, the feed, deal discovery, a UI kit, and the admin tools." },
    { label: "The result", text: "A $10k average check size and a 5.0 average rating." },
  ],

  challenge: {
    heading: "Institutional deal flow, opened up to individual investors",
    paragraphs: [
      "Parri Passu Venture Partners backs early-stage eCommerce and SaaS founders, and wanted to give its own investors something rare: direct access to the kind of exclusive deal flow usually reserved for firms like Sequoia, Sierra, and Upfront. The plan was a members-only mobile app, invite-only from the first screen, built specifically for accredited investors.",
      "The hard part wasn’t any single screen, it was the tone. Every part of the app, from the sign-up flow to how a deal gets published, had to feel as selective and considered as the fund itself. A generic fintech UI would have undercut the entire pitch.",
      "I led design on the platform end to end: the investor-facing app, the design system underneath it, and the internal admin tools the PPVP team uses to actually run it.",
    ],
    figure: {
      src: `${IMG}/07-s01-guided-onboarding-a.webp`,
      alt: "Welcome, waitlist, and invite code screens side by side",
      caption: "The first three screens an investor meets: a welcome, a request to join the waitlist, and a place to enter an invite code.",
      width: 2691,
      height: 1463,
    },
  },

  approach: {
    heading: "An elegant system, built for trust before anything else",
    paragraphs: [
      "Since exclusivity was the entire selling point, I started with the design system rather than any one flow: a restrained, editorial type system and a quiet color palette that read as premium on sight, not after ten minutes of use.",
      "Everything downstream, sign-up, onboarding, the deal feed, the admin panel, had to inherit that same tone so the app never broke character between an investor’s first tap and a deal closing.",
    ],
    figure: {
      src: `${IMG}/05-design-ref-1.png`,
      alt: "The PPVP design system: type scale, buttons, form fields, and color",
      caption: "The foundation: a type scale, buttons and form fields, and a palette of soft pastels with a deep indigo and a near-black.",
      width: 2760,
      height: 1730,
    },
  },

  workflowsHeading: "Mechanics behind an invite-only investment platform",

  onboarding: {
    n: "1",
    label: "Invite only and guided onboarding",
    heading: "Access that has to be earned before it’s granted",
    body: [
      "Sign-up was invite-only by design, gated behind a 6-digit code, FaceID, and a direct LinkedIn import so a profile could be verified without a pile of manual fields. Anyone without a code could still request access, but the default path was always: you’re here because someone let you in.",
      "Once inside, a short set of guided onboarding questions asked about an investor’s past experience with venture deals before they ever saw an opportunity. That context mattered more than any single UI decision, it’s what let the feed personalize itself from day one instead of showing every investor the same generic list.",
    ],
    shots: [
      { id: "flow", label: "The flow", src: `${IMG}/13-s01-navigating-opportunities.webp`, alt: "Four onboarding screens in a row", caption: "The path in: request access, answer a few questions about past experience, turn on notifications, then land on the home screen." },
      { id: "welcome", label: "Welcome", src: `${IMG}/09-onboarding-screen-1.webp`, alt: "The welcome screen", caption: "The welcome screen: who PPVP backs, and a few of the companies in the portfolio." },
      { id: "waitlist", label: "Join the waitlist", src: `${IMG}/14-discovery-screen-1.webp`, alt: "The waitlist form", caption: "No invite code yet? Request access with an email, a LinkedIn connection, a name, and whether you’re an accredited investor." },
      { id: "code", label: "Invite code", src: `${IMG}/11-onboarding-screen-3.webp`, alt: "The invite code screen", caption: "A 6-digit invite code, with a way out for anyone who doesn’t have one." },
      { id: "experience", label: "Past experience", src: `${IMG}/15-discovery-screen-2.webp`, alt: "The past experience question", caption: "Step 2 of 2: past experience with venture deals, which is what personalizes the feed." },
      { id: "notifications", label: "Notifications", src: `${IMG}/16-discovery-screen-3.webp`, alt: "The push notification prompt", caption: "A prompt to turn on push notifications for new deals and portfolio updates." },
    ] as Shot[],
  },

  feed: {
    n: "2",
    label: "Core feed: opportunities",
    heading: "One feed, the right information at the right time",
    body: [
      "The home screen had one job: surface the right thing at the right moment without turning into a wall of charts. A portfolio summary sits at the top, followed by a single curated feed mixing new deals, company updates, and notes from the PPVP team, ordered by what actually needs an investor’s attention rather than by section.",
    ],
    shots: [
      { id: "home", label: "Home", src: `${IMG}/17-discovery-screen-4.webp`, alt: "The home screen with a verification prompt", caption: "Home on day one: a welcome, a prompt to finish verification, and the first deal in the feed." },
      { id: "portfolio", label: "Portfolio and deals", src: `${IMG}/18-s01-deal-discovery-1.png`, alt: "The home screen with a portfolio total and a deal", caption: "Home once an investor is in: the portfolio total and the companies they hold, then a deal with its pitch." },
      { id: "hand", label: "In hand", src: `${IMG}/19-s01-deal-discovery-2.webp`, alt: "The news feed on a phone, held in hand", caption: "The same feed on a phone, with company news alongside deals." },
    ] as Shot[],
  },

  discovery: {
    n: "3",
    label: "Deal discovery",
    heading: "Explore active deals without losing the thread",
    body: [
      "Discovery and portfolio tracking were deliberately split into two tabs instead of one crowded view: Explore for new deals available to members, and Portfolio for tracking what an investor already has money in. Opening a deal from either one leads to the same detail view, terms, pitch deck, memos, so requesting an allocation is a couple of taps, not a phone call.",
    ],
    shots: [
      { id: "portfolio", label: "Portfolio", src: `${IMG}/23-s01-deal-info-2.webp`, alt: "A portfolio total beside a list of deals", caption: "The Portfolio tab: the total, and the deals an investor is in, each with its amount and status." },
      { id: "allocate", label: "Request an allocation", src: `${IMG}/22-s01-deal-info-1.webp`, alt: "The request allocation sheet", caption: "Requesting an allocation: quick amounts from $10k to $100k, and a short reason when an investor passes." },
      { id: "confirm", label: "Confirmation", src: `${IMG}/21-s01-portfolio-2.webp`, alt: "The allocation confirmation beside the request sheets", caption: "The confirmation after a request, shown next to the sheets that lead to it." },
    ] as Shot[],
  },

  uiKit: {
    n: "4",
    label: "UI kit",
    heading: "A component system built to outlast launch",
    body: [
      "PPVP’s team was always going to keep adding features after launch, so the interface kit was built as a real system, not a one-off screen library: form fields, buttons, cards, and interaction patterns that could be recombined without a designer in the room every time.",
      "The same deal template reused across mobile and desktop contexts is a small example of the bigger idea, one component, built once, holding up everywhere it’s needed.",
    ],
    shots: [
      { id: "components", label: "Components", src: `${IMG}/27-design-ref-3.png`, alt: "Toggles, list rows, buttons, and FAQ components", caption: "Toggles, settings rows, buttons, invite and allocation controls, and a FAQ, all from the same kit." },
      { id: "template", label: "Deal template", src: `${IMG}/25-s01-ui-extensibility-1.webp`, alt: "A company page on a phone beside cards for its updates and roles", caption: "One deal template: a company’s page on a phone, with its updates and open roles as cards beside it." },
    ] as Shot[],
  },

  admin: {
    n: "5",
    label: "Admin publishing tools",
    heading: "Everything the PPVP team needs to run the platform",
    body: [
      "Behind the investor app is an admin panel that’s part CMS, part user-privilege system. The PPVP team publishes new deals, edits terms and closing dates, manages investor profiles and invitations, and pushes updates straight to the feed, all through the same simple form fields, so getting a deal live never depends on an engineer being free.",
    ],
    shots: [
      { id: "company", label: "Company profile", src: `${IMG}/29-s02-publishing-powerhouse-1.webp`, alt: "A company profile with deals, founder asks, and investor updates", caption: "A company in the admin: its deals, the founder asks, and the investor updates, each with its own create button." },
      { id: "investors", label: "Investors", src: `${IMG}/33-s02-investor-profiles-3.webp`, alt: "A table of investors with status and invited-by columns", caption: "The investor table: status, who invited each person, and when they joined, with bulk actions for selected rows." },
      { id: "filters", label: "Filter builder", src: `${IMG}/31-s02-investor-profiles-1.webp`, alt: "Filter menus for status and investment amount", caption: "Building a filter by status, who invited them, or how much they have invested." },
      { id: "invite", label: "Invite users", src: `${IMG}/41-admin-panel-screen-2.webp`, alt: "A confirmation to invite two users", caption: "Inviting people: confirm, and they receive an email with an invite code." },
      { id: "companies", label: "Companies", src: `${IMG}/47-s02-deal-management-5.webp`, alt: "A list of companies with draft and published status", caption: "Every company, with its status (draft or published), industry, and description." },
      { id: "edit", label: "Edit a company", src: `${IMG}/45-s02-deal-management-3.webp`, alt: "The edit company form", caption: "Editing a company: name, logo, industry, description, cover image, and status." },
      { id: "deal", label: "Create a deal", src: `${IMG}/49-design-ref-4.png`, alt: "The create deal form beside an investor memo editor", caption: "Creating a deal: its terms on the left, the investor memo on the right." },
      { id: "app", label: "Into the app", src: `${IMG}/51-s02-new-way-to-invest-2.webp`, alt: "The admin forms connected to the app screens they publish", caption: "What the admin publishes (left) and where it shows up in the investor app (right)." },
    ] as Shot[],
  },

  outcome: {
    heading: "Real traction with real investors",
    text: "The app launched with an average investor check size of $10k and a 5.0 average rating, holding the premium, invite-only feel through to how people actually used it, not just how it looked on the way in.",
    stats: [
      { value: "$10k", label: "Average check size" },
      { value: "5.0", label: "Average rating" },
    ],
  },

  quote: {
    text: "Nessa has done an incredible job from a design standpoint, providing us with unique and innovative designs that are rooted in research, not just aesthetics. We’ve also enjoyed working with their team; they feel like a true partner.",
    attribution: "Julia Gudish Krieger, Managing Partner at PPVP",
  },
};
