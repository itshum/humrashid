import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

// Page header shared by every view: title and one-line description,
// with an optional control (a view toggle) on the right.
export function PageHeader({ title, description, actions }: { title: string; description?: string; actions?: ReactNode }) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-x-6 gap-y-4">
      <div className="min-w-0">
        <h1 className="text-xl font-semibold tracking-tight">{title}</h1>
        {description && <p className="mt-1 text-sm text-foreground/65">{description}</p>}
      </div>
      {actions}
    </div>
  );
}

// Segmented view switcher (List | Cards, Grid | Feed). Buttons with
// aria-pressed, so it reads as a toggle group to assistive tech.
export function Segmented<T extends string>({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: T;
  onChange: (v: T) => void;
  options: Array<{ value: T; label: string; icon: ReactNode }>;
}) {
  return (
    <div role="group" aria-label={label} className="inline-flex rounded-lg bg-foreground/[0.06] p-0.5">
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          aria-pressed={value === o.value}
          onClick={() => onChange(o.value)}
          className={cn(
            "inline-flex h-7 items-center gap-1.5 rounded-md px-2.5 text-[13px] outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring/60",
            value === o.value
              ? "bg-[var(--panel)] font-medium text-foreground shadow-[0_1px_2px_rgb(0_0_0/0.08)] ring-1 ring-foreground/[0.06]"
              : "text-foreground/65 hover:text-foreground",
          )}
        >
          {o.icon}
          {o.label}
        </button>
      ))}
    </div>
  );
}

// Image with a tonal fallback, so a missing photo or cover reads as an
// intentional empty slot rather than a broken image.
export function Cover({
  src,
  alt,
  tone,
  ratio = "16 / 10",
  className,
  children,
}: {
  src?: string;
  alt: string;
  tone: string;
  ratio?: string;
  className?: string;
  children?: ReactNode;
}) {
  return (
    <div
      className={cn("relative w-full overflow-hidden rounded-lg ring-1 ring-foreground/[0.08]", className)}
      style={{
        aspectRatio: ratio,
        background: `linear-gradient(135deg, color-mix(in oklab, ${tone} 38%, var(--panel)), color-mix(in oklab, ${tone} 14%, var(--panel)))`,
      }}
    >
      {src && <img src={src} alt={alt} loading="lazy" className="absolute inset-0 size-full object-cover" />}
      {children}
    </div>
  );
}

// A small outlined pill with a colored dot: indigo for case studies,
// green for experience. Text stays in the neutral text color so the dot
// carries the hue, in both themes.
const TAG_DOTS = {
  neutral: "bg-foreground/40",
  indigo: "bg-[oklch(0.56_0.15_275)] dark:bg-[oklch(0.7_0.14_275)]",
  green: "bg-[oklch(0.68_0.13_155)] dark:bg-[oklch(0.75_0.13_155)]",
} as const;

export function Tag({ children, tone = "neutral" }: { children: ReactNode; tone?: keyof typeof TAG_DOTS }) {
  return (
    <span className="inline-flex h-6 items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 text-xs text-foreground/75 ring-1 ring-inset ring-foreground/[0.14]">
      <span aria-hidden="true" className={`size-1.5 shrink-0 rounded-full ${TAG_DOTS[tone]}`} />
      {children}
    </span>
  );
}

export function formatDate(iso: string) {
  return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" }).format(
    new Date(iso),
  );
}
