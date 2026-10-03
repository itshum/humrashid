import { useEffect, type ReactNode } from "react";
import { ArrowUpRight, Mail } from "lucide-react";
import signatureSvg from "../../assets/humayun-signature-strokes.svg?raw";
import { initReveal } from "../../scripts/reveal";
import { cn } from "@/lib/utils";
import { Reveal, useCaseStudyReveal } from "./CaseStudyParts";
import { PROFILE_LINKS, composeMail } from "./ProfileMenu";

// The Profile page, laid out like an account page in a product: a compact
// header with the portrait in a circle, then settings-style sections
// (a label and a note on the left, the content on the right). The words
// are the About page's, split into "About" and "Beyond work"; the
// signature draws itself in as it nears the screen, as on the About page.

const SIGNATURE = signatureSvg
  .replace(/<\?xml[^>]*\?>/, "")
  .replace('viewBox="0 0 1000 364"', 'viewBox="220 125 650 185"');

const ABOUT = [
  "I’ve spent over a decade designing and building products across B2B SaaS and eCommerce. Most recently, I was on the early design team at Sublime Security, the fastest-growing cybersecurity email startup in the US, where I led design on launches like Quarantine Digest and Dynamic Phishing Simulations. Before that, I founded and led Nessa Lab, a studio where I advised founders and designed digital products for early-stage startups.",
  "I’ve also built and exited digital agencies, and worked alongside founders to take their products from nothing to acquisition. That’s given me a real sense of what it takes to build something people actually use, not just design around one.",
  "I care about how things connect, and how that shapes the smallest details. The people using what I design are real, with real needs, not abstractions. That’s what draws me to the parts of a product nobody notices: the empty state that quietly loses someone, the setting that should’ve been the default all along. Getting those right starts with talking to users, understanding where they get stuck before assuming I know the fix. That’s where the real work happens, and where most teams stop looking. Great design is deciding what to leave out.",
];

const BEYOND = [
  "Beyond work, I’m an avid marathoner, usually running alongside my three-year-old Vizsla, Mars. In the kitchen, I’m reconstructing Bangladeshi classics from scratch and digging into the food science behind them. Travel is where those interests collide: I explore a city through its food, culture, and art, doing my best Anthony Bourdain impression along the way.",
];

function Section({
  title,
  note,
  divided = false,
  children,
}: {
  title: string;
  note?: string;
  divided?: boolean;
  children: ReactNode;
}) {
  return (
    <Reveal
      className={cn(
        "grid gap-x-10 gap-y-3 sm:grid-cols-[180px_minmax(0,1fr)]",
        divided ? "mt-8 border-t border-[var(--line)] pt-8" : "py-4",
      )}
    >
      <div>
        {title && <h2 className="text-[13px] font-medium">{title}</h2>}
        {note && (
          <p className="mt-1 text-xs leading-relaxed text-foreground/65">
            {note}
          </p>
        )}
      </div>
      <div className="min-w-0">{children}</div>
    </Reveal>
  );
}

const ROW =
  "group flex h-10 items-center gap-2.5 rounded-md px-2 text-[14px] outline-none transition-colors hover:bg-foreground/[0.04] focus-visible:ring-2 focus-visible:ring-ring/60";

// The arrow sits right after the handle and only shows on hover or focus
// (always on touch screens, which have no hover).
const Arrow = () => (
  <ArrowUpRight
    className="size-3.5 shrink-0 -translate-x-1 translate-y-px text-foreground/65 opacity-0 transition-[opacity,transform] duration-200 group-hover:translate-x-0 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:translate-y-0 group-focus-visible:opacity-100 motion-reduce:transition-none [@media(hover:none)]:translate-x-0 [@media(hover:none)]:opacity-100"
    aria-hidden="true"
  />
);

export function ProfilePage() {
  useCaseStudyReveal();

  // Set each stroke's length, duration and delay, then draw the signature
  // when it is nearly on screen.
  useEffect(() => {
    const root = document.querySelector<HTMLElement>(".profile-signature");
    if (!root) return;
    const speed = 0.62;
    root.querySelectorAll<SVGPathElement>("path").forEach((path) => {
      const length = path.getTotalLength();
      path.style.setProperty("--path-length", `${length}`);
      path.style.setProperty(
        "--draw-duration",
        `${Number(path.dataset.duration || 700) * speed}ms`,
      );
      path.style.setProperty(
        "--draw-delay",
        `${Number(path.dataset.delay || 0) * speed + 120}ms`,
      );
    });
    return initReveal({ selector: ".profile-signature", lookahead: 0.1 });
  }, []);

  return (
    <div className="max-w-3xl">
      {/* Account header */}
      <Reveal className="flex flex-wrap items-center gap-x-5 gap-y-4 pb-6">
        <img
          src="/about/avatar.jpg"
          alt="Portrait of Humayun Rashid"
          width="70"
          height="70"
          className="size-[70px] shrink-0 rounded-full object-cover"
        />
        <div className="min-w-0 flex-1">
          <h1 className="text-xl font-semibold tracking-tight">
            Humayun Rashid
          </h1>
          <p className="mt-0.5 text-sm text-foreground/65">
            Designer &amp; founder · New York, NY
          </p>
        </div>
      </Reveal>

      {/* One letter: every paragraph, "Stay curious," and the signature
          share a single column with the same gap between them. */}
      <Section title="About" note="Background and how I work">
        <div className="max-w-[40rem] text-[15px] leading-[1.7] text-foreground/80">
          <div className="space-y-5 [&_p]:text-pretty">
            {[...ABOUT, ...BEYOND].map((p) => (
              <p key={p}>{p}</p>
            ))}
            <p>Stay curious,</p>
          </div>
          <div
            className="profile-signature mt-4 w-[min(100%,200px)] text-foreground"
            role="img"
            aria-label="Handwritten signature of Humayun Rashid"
            dangerouslySetInnerHTML={{ __html: SIGNATURE }}
          />
        </div>
      </Section>

      <Section title="Online" note="Where to find me" divided>
        <ul className="-mx-2 grid gap-x-3 sm:grid-cols-2">
          {PROFILE_LINKS.map((l) => (
            <li key={l.label}>
              <a
                href={l.href}
                target="_blank"
                rel="noreferrer noopener"
                className={ROW}
              >
                <span className="text-foreground/65">{l.icon}</span>
                <span className="font-medium">{l.label}</span>
                <span className="min-w-0 truncate text-foreground/65">
                  {l.handle}
                </span>
                <Arrow />
              </a>
            </li>
          ))}
          <li>
            <button
              type="button"
              onClick={composeMail}
              className={cn(ROW, "w-full text-left")}
            >
              <Mail
                className="size-4 shrink-0 text-foreground/65"
                strokeWidth={1.75}
                aria-hidden="true"
              />
              <span className="font-medium">Email</span>
              <span className="min-w-0 truncate text-foreground/65">
                Say hello
              </span>
              <Arrow />
            </button>
          </li>
        </ul>
      </Section>
    </div>
  );
}
