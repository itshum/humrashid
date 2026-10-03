import type { ComponentType, ReactNode } from "react";

// Navigation icons for the portfolio, drawn as one family.
//
// Construction: a 20 x 20 grid, 1.6 stroke, round caps and joins,
// 2-unit outer corners. Every glyph is a line drawing with exactly one
// filled "pixel": a small rounded square borrowed from the 4 x 4 logo
// mark. Stroke and fill are both currentColor, so the whole icon
// follows the text color (quiet at rest, full strength when current).
// On hover or focus the pixel gives a small pop.

export type NavIconProps = { className?: string };
export type NavIcon = ComponentType<NavIconProps>;

function Glyph({ className, children }: NavIconProps & { children: ReactNode }) {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

// The filled pixel. `pop` is how far it grows on hover.
function Pixel({
  x,
  y,
  size = 3.2,
  radius = 0.9,
  pop = 1.35,
}: {
  x: number;
  y: number;
  size?: number;
  radius?: number;
  pop?: number;
}) {
  return (
    <rect
      x={x}
      y={y}
      width={size}
      height={size}
      rx={radius}
      fill="currentColor"
      stroke="none"
      style={{ ["--pop" as string]: pop }}
      className="origin-center transition-transform duration-200 ease-[cubic-bezier(0.34,1.56,0.64,1)] [transform-box:fill-box] group-hover:scale-[var(--pop)] group-focus-visible:scale-[var(--pop)] motion-reduce:transition-none"
    />
  );
}

// A house; the pixel is the door.
export const HomeIcon: NavIcon = ({ className }) => (
  <Glyph className={className}>
    <path d="M3.2 9.4 10 3.6l6.8 5.8" />
    <path d="M4.8 8.2v7.1a1.5 1.5 0 0 0 1.5 1.5h7.4a1.5 1.5 0 0 0 1.5-1.5V8.2" />
    <Pixel x={8.4} y={11.6} />
  </Glyph>
);

// Two stacked cards, a project on top of the ones before it.
export const WorkIcon: NavIcon = ({ className }) => (
  <Glyph className={className}>
    <path d="M6.2 6.6V5.4a1.6 1.6 0 0 1 1.6-1.6h8.6A1.6 1.6 0 0 1 18 5.4v6.2a1.6 1.6 0 0 1-1.6 1.6h-1.2" />
    <rect x="2.4" y="6.6" width="12.8" height="9.8" rx="2" />
    <Pixel x={5.2} y={9.4} />
  </Glyph>
);

// A bulb; the pixel is the spark inside it.
export const IdeasIcon: NavIcon = ({ className }) => (
  <Glyph className={className}>
    <path d="M10 2.6a5.2 5.2 0 0 0-3.1 9.4c.6.5 1 1.1 1 1.8v.6h4.2v-.6c0-.7.4-1.3 1-1.8A5.2 5.2 0 0 0 10 2.6Z" />
    <path d="M8.3 16.4h3.4" />
    <Pixel x={8.4} y={6.4} />
  </Glyph>
);

// A 2 x 2 grid of app tiles, one filled in. It is the logo mark,
// quartered.
export const AppsIcon: NavIcon = ({ className }) => (
  <Glyph className={className}>
    <rect x="2.8" y="2.8" width="6" height="6" rx="1.7" />
    <rect x="11.2" y="2.8" width="6" height="6" rx="1.7" />
    <rect x="2.8" y="11.2" width="6" height="6" rx="1.7" />
    <Pixel x={11.2} y={11.2} size={6} radius={1.7} pop={1.12} />
  </Glyph>
);

// An endless loop: a process runs round again, one problem at a time. The
// pixel rests at the crossing and, on hover, travels the whole loop.
export const ProcessIcon: NavIcon = ({ className }) => (
  <Glyph className={className}>
    <path d="M10 10C8.2 7.4 6.6 6.6 5.6 6.6a3.4 3.4 0 0 0 0 6.8C6.6 13.4 8.2 12.6 10 10C11.8 7.4 13.4 6.6 14.4 6.6a3.4 3.4 0 0 1 0 6.8C13.4 13.4 11.8 12.6 10 10Z" />
    <rect
      x="8.4"
      y="8.4"
      width="3.2"
      height="3.2"
      rx="1"
      fill="currentColor"
      stroke="none"
      className="saas-loop-pixel"
    />
  </Glyph>
);

// A photograph: horizon, and the pixel as the sun.
export const InspirationIcon: NavIcon = ({ className }) => (
  <Glyph className={className}>
    <rect x="2.4" y="3.4" width="15.2" height="13.2" rx="2.4" />
    <path d="m2.6 13.6 4.2-4.2 3.6 3.6 2.2-2.2 4.8 4.8" />
    <Pixel x={11} y={5.6} size={3} />
  </Glyph>
);

// A person: an outlined head and shoulders.
export const ProfileIcon: NavIcon = ({ className }) => (
  <Glyph className={className}>
    <circle cx="10" cy="6.6" r="3.2" />
    <path d="M3.6 17c.6-3.3 3.1-5.2 6.4-5.2s5.8 1.9 6.4 5.2" />
  </Glyph>
);
