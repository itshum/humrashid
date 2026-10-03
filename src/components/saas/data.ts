import {
  AppsIcon,
  HomeIcon,
  IdeasIcon,
  InspirationIcon,
  PrinciplesIcon,
  ProfileIcon,
  WorkIcon,
  type NavIcon,
} from "./icons";

// Navigation, routes, and sample records for the portfolio-as-product
// shell. Work, apps, and profile text are facts already on the live
// site; ideas and principles live in content.ts.

export type SectionId = "home" | "work" | "ideas" | "apps" | "principles" | "inspiration" | "profile";

// A route is a section plus an optional record slug (#work/pack).
export interface Route {
  section: SectionId;
  slug?: string;
}

export interface NavItem {
  id: SectionId;
  label: string;
  icon: NavIcon;
  description: string;
}

export const primaryNav: NavItem[] = [
  { id: "home", label: "Home", icon: HomeIcon, description: "A snapshot of the work, the apps, and the latest ideas." },
  { id: "work", label: "Work", icon: WorkIcon, description: "Everything I've designed, including full case studies." },
  { id: "ideas", label: "Ideas", icon: IdeasIcon, description: "Notes on design, product, and building." },
  { id: "apps", label: "Apps", icon: AppsIcon, description: "Standalone tools and apps, designed and built as experiments." },
  { id: "principles", label: "Principles", icon: PrinciplesIcon, description: "My design process, refined over more than ten years of shipping." },
  { id: "inspiration", label: "Inspiration", icon: InspirationIcon, description: "Images from recent trips." },
];

export const secondaryNav: NavItem[] = [
  { id: "profile", label: "Profile", icon: ProfileIcon, description: "Who is behind the work." },
];

export const allNav = [...primaryNav, ...secondaryNav];

const SECTIONS = new Set<string>(allNav.map((n) => n.id));

export function parseHash(hash: string): Route {
  const [section, slug] = hash.replace("#", "").split("/");
  return SECTIONS.has(section) ? { section: section as SectionId, slug: slug || undefined } : { section: "home" };
}

export function routeToHash(route: Route) {
  if (route.section === "home") return "";
  return `#${route.section}${route.slug ? `/${route.slug}` : ""}`;
}

// Optional fields are left blank (shown as an em dash) rather than
// guessed. Market comes from each project's own description; Company is
// who the work was done for or at (Nessa Lab for the case studies whose
// team was Nessa, DBNY for the agency projects).
export interface WorkItem {
  slug: string;
  name: string;
  description?: string;
  market?: string;
  company?: string;
  year?: string;
  role?: string;
  kind: "case-study" | "experience";
  cover?: string;
  // A logo to show in place of the colored dot (the project's own mark).
  // iconMask means the file is a one-color shape, drawn in the text color
  // so it works in light and dark.
  icon?: string;
  iconMask?: boolean;
  // Link to the full case study on the live site.
  href?: string;
  // For an external href: whether the site allows being shown in a frame.
  embed?: boolean;
  // Password-protected, so there is no public link from here.
  locked?: boolean;
  // Dot and placeholder color, from the site's pastel palette.
  tone: string;
}

export const work: WorkItem[] = [
  {
    slug: "sublime-security",
    name: "Sublime Security",
    description: "Led product design for email security teams to stop malicious threats.",
    market: "Cybersecurity",
    company: "Sublime Security",
    year: "2026",
    role: "Lead Product Designer",
    kind: "case-study",
    cover: "/case-studies/sublime-security/home-preview.webp",
    icon: "/case-studies/sublime-security/sublime-eye.svg",
    locked: true,
    tone: "#7c6fd6",
  },
  {
    slug: "nessa-labs",
    name: "Nessa Lab",
    description: "Founder & Design Director of a product design studio for early-stage startups.",
    market: "Design services",
    company: "Nessa Lab",
    year: "2020 – 2025",
    role: "Founder & Design Director",
    kind: "experience",
    href: "https://nessalab.com",
    // The site fails its TLS handshake right now, so it can't be framed.
    embed: false,
    tone: "#4fae82",
  },
  {
    slug: "pack",
    name: "Pack Platform",
    description: "Platform redesign for headless commerce software.",
    market: "B2B SaaS",
    company: "Nessa Lab",
    year: "2023",
    role: "Design Director",
    kind: "case-study",
    cover: "/case-studies/pack/01-hero-a.webp",
    icon: "/case-studies/pack/pack-icon.svg",
    href: "/work/pack",
    tone: "#d6a24f",
  },
  {
    slug: "ppvp",
    name: "PPVP",
    description: "Mobile app design for an investment platform for early-stage funding.",
    market: "Fintech",
    company: "Nessa Lab",
    year: "2023",
    role: "Design Director",
    kind: "case-study",
    cover: "/case-studies/ppvp/01-hero-desktop.webp",
    icon: "/case-studies/ppvp/ppvp-mark.png",
    iconMask: true,
    href: "/work/ppvp",
    tone: "#4f9fd6",
  },
  {
    slug: "inveterate",
    name: "Inveterate",
    description: "Zero to one design and launch for a loyalty and membership platform.",
    market: "Loyalty",
    company: "Nessa Lab",
    year: "2022",
    role: "Design Director",
    kind: "case-study",
    cover: "/case-studies/inveterate/01-hero-desktop.webp",
    icon: "/case-studies/inveterate/inveterate-mark.png",
    href: "/work/inveterate",
    tone: "#d66f9a",
  },
  {
    slug: "shopping-gives",
    name: "Shopping Gives",
    description: "Product strategy and design for a donation enablement platform.",
    market: "Nonprofit tech",
    year: "2021",
    kind: "experience",
    href: "https://www.shoppinggives.com/",
    embed: false,
    tone: "#6fb7c4",
  },
  // From the DBNY days. A project only gets a link while its site is
  // still up (Sonder Living, LilGadgets, and StayBoutique are offline).
  { slug: "sonder-living", name: "Sonder Living", description: "Luxury Retail", market: "eCommerce", company: "DBNY", role: "Design Lead", year: "2019", kind: "experience", tone: "#c98fd6" },
  { slug: "aloha", name: "ALOHA", description: "CPG", market: "eCommerce", company: "DBNY", role: "Design Lead", year: "2019", kind: "experience", tone: "#e0a458", href: "https://aloha.com", embed: false },
  { slug: "lilgadgets", name: "LilGadgets", description: "Electronics", market: "eCommerce", company: "DBNY", role: "Design Lead", year: "2018", kind: "experience", tone: "#5fc0a8" },
  { slug: "stayboutique", name: "StayBoutique", description: "Editorial", market: "eCommerce", company: "DBNY", role: "Design Lead", year: "2018", kind: "experience", tone: "#8c9be0" },
];

export const caseStudies = work.filter((w) => w.kind === "case-study");

// A work route that opens a case study (as opposed to the Work index).
export function caseStudyFor(route: Route) {
  return route.section === "work" && route.slug ? caseStudies.find((w) => w.slug === route.slug) : undefined;
}

export interface AppItem {
  slug: string;
  name: string;
  description: string;
  href: string;
  tone: string;
}

export const apps: AppItem[] = [
  { slug: "rendr", name: "rendr", description: "Polished backgrounds for any image to share across social.", href: "/apps/rendr", tone: "#ff6a2b" },
  { slug: "atrium", name: "Atrium", description: "A curated library of books, articles and sites worth your time.", href: "/apps/atrium", tone: "#d9c9a3" },
];

export interface Photo {
  id: string;
  ratio: string;
  tone: string;
  // Set src when the real photo exists; until then the tile is a placeholder.
  src?: string;
  alt: string;
}

// Placeholder slots for trip photos, in mixed shapes so the grid reads
// like a real photo wall. Drop files in public/inspiration and set src.
const TONES = ["#c9a0dc", "#8fb4e8", "#a9d8de", "#d9cf8a", "#e8b0c8", "#9fd1b0"];
const RATIOS = ["4 / 5", "1 / 1", "3 / 2", "4 / 5", "16 / 10", "1 / 1", "3 / 4", "3 / 2", "4 / 5", "16 / 10", "1 / 1", "3 / 4"];
export const photos: Photo[] = RATIOS.map((ratio, i) => ({
  id: `photo-${String(i + 1).padStart(2, "0")}`,
  ratio,
  tone: TONES[i % TONES.length],
  alt: `Trip photo ${i + 1} (placeholder)`,
}));

export const profile = {
  name: "Humayun Rashid",
  tagline: "Designer and founder in NYC",
  // The short version for Home: who I am and what I do, in a few lines.
  intro:
    "I design and build products for B2B SaaS and eCommerce teams, with over a decade of experience. Most recently I led design on launches like dynamic phishing simulations at Sublime Security, and before that I founded Nessa Lab, a studio for early-stage startups. Alongside client work, I build my own apps and write about design and product.",
  bio: [
    "I've spent over a decade designing and building products across B2B SaaS and eCommerce. Most recently, I was on the early design team at Sublime Security, the fastest-growing cybersecurity email startup in the US. I led design on crucial launches like quarantine digests and dynamic phishing simulations. Before that, I founded and led Nessa Lab, a studio where I advised founders and designed digital products for early-stage startups.",
    "I care about what never makes it onto the screen: the onboarding flow nobody notices, the empty state that quietly loses the user, the setting that should've been the default all along. Getting those subtle details right starts with talking to users first, understanding where they get stuck before assuming you know the fix. That's where the real work happens, and where most teams give up.",
    "Great design is deciding what to leave out.",
  ],
};
