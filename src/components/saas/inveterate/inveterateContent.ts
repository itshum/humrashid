// The Inveterate case study, restructured for the product shell. The words
// are the ones on the live case study (src/content/case-studies/inveterate.md),
// with typographic apostrophes; captions are written from what each image
// actually shows (several alt texts on the original page named the wrong
// screen).

import type { Shot } from "../pack/packContent";

const IMG = "/case-studies/inveterate";

export const inveterate = {
  title: "Inveterate",
  summary:
    "Taking a loyalty and membership platform from zero to one for eCommerce brands.",
  meta: [
    { label: "Company", value: "Inveterate" },
    { label: "Role", value: "Design Director" },
    { label: "Team", value: "Nessa" },
    { label: "Year", value: "2022" },
  ],
  hero: {
    src: `${IMG}/01-hero-desktop.webp`,
    alt: "The Inveterate membership dashboard on a laptop",
    width: 3600,
    height: 1850,
  },
  brief: [
    {
      label: "The problem",
      text: "Replace points programs with a premium membership, for merchants who want to launch fast and brands who want full control.",
    },
    {
      label: "The approach",
      text: "Map every place the platform has to bend, then build one system that flexes both ways.",
    },
    {
      label: "The work",
      text: "Four pieces: the brand system, data and analytics, a menu of benefits, and the program builder.",
    },
    {
      label: "The result",
      text: "8+ core benefits, 15+ integrations, and a $2.8M seed round.",
    },
  ],

  challenge: {
    heading: "Loyalty, rebuilt for a different kind of shopper",
    paragraphs: [
      "Most loyalty programs are still built around points that customers rarely redeem and brands rarely benefit from. Inveterate’s founder, Dylan Whitman, wanted to replace that model entirely with a premium membership program, closer to Amazon Prime, built specifically for independent eCommerce brands.",
      "The platform had to work for two very different audiences at once: self-serve merchants who wanted to launch a program in a few clicks, and larger enterprise brands who needed a white-glove build with full control over pricing, benefits, and branding. Same product, two very different comfort levels with software.",
      "I led design on the platform end to end, working directly with Inveterate’s product team to take the idea from a raw concept to something merchants could actually run their business on.",
    ],
    figure: {
      src: `${IMG}/07-s02-brand-personality-desktop.webp`,
      alt: "The Inveterate wordmark above two screens of the platform",
      caption:
        "The brand and the product together: a bold wordmark over the platform on a laptop and a tablet.",
      width: 1760,
      height: 1200,
    },
  },

  approach: {
    heading: "One system, built to flex two ways",
    paragraphs: [
      "We started by mapping out every place the platform needed to bend: a merchant setting up their first program in an afternoon, and an enterprise brand customizing every touchpoint of theirs.",
      "That split shaped almost every decision that followed, from the design system down to how a single benefit gets configured.",
    ],
    shots: [
      {
        id: "store",
        label: "Store details",
        src: `${IMG}/02-s01-design-system-components-desktop.webp`,
        alt: "The store details onboarding form",
        caption:
          "Setup starts with a few questions: monthly order volume, average order value, and whether the merchant works with an agency.",
      },
      {
        id: "welcome",
        label: "Welcome",
        src: `${IMG}/03-s01-ui-kit-library-desktop.webp`,
        alt: "The welcome screen and onboarding checklist",
        caption:
          "The welcome screen: a short video, a scheduled onboarding call, and a checklist to set up the company.",
      },
    ] as Shot[],
    figure: {
      src: `${IMG}/04-s01-platform-interface-elements-desktop.webp`,
      alt: "The platform kit: colors, form fields, and type",
      caption:
        "The kit: a dark palette with violet accents, form fields and controls, and the type scale.",
      width: 2760,
      height: 1500,
    },
  },

  workflowsHeading:
    "Systems and customer benefits behind the membership platform",

  brand: {
    n: "1",
    label: "Brand system",
    heading: "A product with more brand personality than B2B usually allows",
    body: [
      "Most B2B platforms play it safe. Inveterate wanted the opposite: a bold, irreverent identity that felt more like a consumer brand than backend software.",
      "We adopted their existing brand system and built a design language, logo, color system, and UI kit that carried that same attitude everywhere within the product for a cohesive and consistent merchant experience.",
    ],
    shots: [
      {
        id: "wordmark",
        label: "Wordmark",
        src: `${IMG}/10-s03-identity-application-desktop.png`,
        alt: "The Inveterate wordmark",
        caption: "The wordmark, set bold and wide, with the bloom beside it.",
      },
      {
        id: "bloom",
        label: "Bloom",
        src: `${IMG}/11-s03-marketing-collateral-desktop.png`,
        alt: "The bloom mark on violet",
        caption: "The bloom: the mark on its own, in black on violet.",
      },
      {
        id: "icons",
        label: "Icon library",
        src: `${IMG}/05-s02-brand-identity-desktop.png`,
        alt: "A grid of line icons",
        caption: "A custom line icon library, drawn to one weight.",
      },
      {
        id: "poster",
        label: "Poster",
        src: `${IMG}/06-s02-brand-design-desktop.webp`,
        alt: "The wordmark on a dark violet surface",
        caption:
          "The wordmark running down a dark violet surface, with a soft contour line behind it.",
      },
      {
        id: "ooh",
        label: "Out of home",
        src: `${IMG}/12-s03-ooh-campaign-desktop.webp`,
        alt: "Three posters on a wall",
        caption:
          "Posters in a station, three across, with the wordmark and the bloom.",
      },
      {
        id: "phone",
        label: "On a phone",
        src: `${IMG}/09-s02-brand-assets-desktop.webp`,
        alt: "A phone showing the brand on a woven chair",
        caption: "The identity on a phone, resting on a woven chair.",
      },
    ] as Shot[],
  },

  data: {
    n: "2",
    label: "Unified data and analytics",
    heading: "One dashboard for the whole membership lifecycle",
    body: [
      "Merchants needed a single place to actually understand their program: who signed up, how much they’ve spent, what’s selling, where churn is happening. We designed a unified data dashboard that pulls the entire membership lifecycle into a few clear views, so a decision that used to take a spreadsheet takes a glance instead.",
      "None of it was useful scattered across spreadsheets, so we built a suite of data tools directly into the platform, from a historical view of year-to-date sales down to which products were selling today.",
    ],
    before: {
      src: `${IMG}/inveterate-dashboard-wireframe.svg`,
      label: "Wireframe",
    },
    after: { src: `${IMG}/Inveterate-dashboard.png`, label: "Final" },
    alt: "The dashboard as a wireframe and as the final design",
    caption:
      "Drag to move from the wireframe to the final dashboard: subscribers, monthly revenue, lifetime value, and the leaderboard of top categories.",
    shots: [
      {
        id: "customers",
        label: "Customers",
        src: `${IMG}/13-s04-data-dashboard-desktop.webp`,
        alt: "A table of active customers with filters",
        caption:
          "Active customers in a filterable table, with status, spend, and dates on every row.",
      },
      {
        id: "manage",
        label: "Account tools",
        src: `${IMG}/14-s04-analytics-metrics-desktop.webp`,
        alt: "Panels for adjusting credits, birthdays, and subscriptions",
        caption:
          "Account tools for one customer: adjust credits, edit a birthday or join date, cancel a subscription, or anonymize the account.",
      },
      {
        id: "profile",
        label: "Customer profile",
        src: `${IMG}/15-s04-dashboard-drilldown-desktop.webp`,
        alt: "A customer profile with credit history",
        caption:
          "A single customer: their subscription and spend, with a credit history underneath.",
      },
      {
        id: "analytics",
        label: "Analytics",
        src: `${IMG}/18-membership-benefits-feature-desktop.webp`,
        alt: "Revenue and customer analytics",
        caption:
          "Analytics for the program: revenue, subscription, and customer metrics, each with a small trend line.",
      },
      {
        id: "new",
        label: "New customers",
        src: `${IMG}/19-tiered-benefits-structure.webp`,
        alt: "A chart of new customers over time",
        caption:
          "New customers over a chosen range, compared with the period before, and broken down by day.",
      },
      {
        id: "subs",
        label: "Members vs non-members",
        src: `${IMG}/21-program-data-analytics-desktop.webp`,
        alt: "Subscription analytics comparing members and non-members",
        caption:
          "Subscription analytics: members against non-members on average revenue, lifetime value, and time between orders.",
      },
    ] as Shot[],
  },

  benefits: {
    n: "3",
    label: "Platform benefits and features",
    heading: "A flexible menu of shopper perks",
    body: [
      "The value of a membership program comes down to what’s actually inside it. We designed a library of benefits, exclusive drops, tiered discounts, expedited shipping, referrals, store credit, each built as a modular, tiered add-on so merchants could shape a program around their own customers instead of a fixed template.",
    ],
    shots: [
      {
        id: "program",
        label: "Benefits program",
        src: `${IMG}/23-Benefits-program.png`,
        width: 2760,
        height: 1200,
        alt: "The benefits list beside a shipping benefit panel",
        caption:
          "The benefits list on the left, and the panel for configuring the selected benefit on the right.",
      },
      {
        id: "credits",
        label: "Credits",
        src: `${IMG}/17-membership-builder-customization-desktop.webp`,
        width: 1350,
        height: 1200,
        alt: "A list of credit benefits with enabled and disabled states",
        caption:
          "Credits as modular benefits: store credit, birthday, anniversary, referrals, and credits for reviews, each switched on or off.",
      },
      {
        id: "integrations",
        label: "Integrations",
        src: `${IMG}/22-third-party-integrations-desktop.webp`,
        width: 1980,
        height: 1400,
        alt: "A list of customer service integrations",
        caption:
          "Third-party integrations, grouped by category, with a connect button on each.",
      },
    ] as Shot[],
  },

  builder: {
    n: "4",
    label: "Membership program builder",
    heading: "Launch a program in weeks, not months",
    body: [
      "At the center of the platform is the builder: the tool merchants actually use to stand up a program. We designed it for real flexibility (tiered pricing, benefit activation, a custom landing page) so a brand could either launch fast through self-service or work hand-in-hand with Inveterate’s team for a fully white-glove build.",
    ],
    shots: [
      {
        id: "builder",
        label: "Benefit settings",
        src: `${IMG}/16-membership-builder-interface-desktop.webp`,
        width: 1350,
        height: 1200,
        alt: "The builder with a shipping benefit and landing page content",
        caption:
          "Configuring a benefit in the builder, next to the content blocks for the program’s landing page.",
      },
      {
        id: "landing",
        label: "Landing page",
        src: `${IMG}/24-Builder-landing-page.png`,
        width: 2760,
        height: 1500,
        alt: "The landing page builder with a live preview",
        caption:
          "The landing page builder: sections on the left, and a live preview on desktop and mobile.",
      },
    ] as Shot[],
  },

  outcome: {
    heading: "Real traction, not just a redesign",
    text: "The platform shipped with 8+ core benefits merchants could activate out of the box and 15+ third-party integrations with Shopify partners, giving both self-serve and enterprise brands a real program to launch on day one. Inveterate closed a $2.8M seed round shortly after launch.",
    stats: [
      { value: "8+", label: "Core benefits out of the box" },
      { value: "15+", label: "Shopify partner integrations" },
      { value: "$2.8M", label: "Seed round" },
    ],
  },

  quote: {
    text: "It’s rare to find a design partner who can take a raw idea with a very specific and unique vision, yet turn out a beautiful user experience that can support both our self service and enterprise customers. Every element provided by the Nessa team was purpose-driven towards providing a frictionless experience for our users, but more importantly, a scalable one.",
    attribution: "Andy Muntean, Head of Product at Inveterate",
  },
};
