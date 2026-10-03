import type { SVGProps } from "react";

// Small custom outline icons for the sidebar footer, drawn on a 24 grid
// with a 1.5 stroke and round ends: the light and dark switch (a sun with
// long and short rays, a crescent with a spark).

const base = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": true,
} as const;

export function SunIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <circle cx="12" cy="12" r="3.6" />
      <path d="M12 2.8v2M12 19.2v2M2.8 12h2M19.2 12h2" />
      <path d="M5.6 5.6l1.1 1.1M17.3 6.7l1.1-1.1M5.6 18.4l1.1-1.1M17.3 17.3l1.1 1.1" />
    </svg>
  );
}

export function MoonIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <path d="M19.6 14.6A8 8 0 0 1 9.4 4.4a8 8 0 1 0 10.2 10.2Z" />
      <path d="M17 3.2v3M15.5 4.7h3" />
    </svg>
  );
}
