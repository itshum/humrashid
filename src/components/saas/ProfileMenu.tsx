import { useState } from "react";
import { Popover, Tooltip } from "radix-ui";
import { ArrowUpRight, Mail } from "lucide-react";
import { cn } from "@/lib/utils";
import { profile, type Route } from "./data";
import { ProfileIcon } from "./icons";

// The profile card at the bottom of the sidebar opens a small menu: the
// profile page, then links out to my accounts.
// Brand marks are the same paths the site footer uses.

const BRAND = {
  linkedin: "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.948 1.637-1.95 3.37-1.95 3.601 0 4.267 2.37 4.267 4.91v4.93zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z",
  github: "M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12",
  x: "M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z",
};

function Brand({ d }: { d: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="size-4 shrink-0">
      <path fill="currentColor" d={d} />
    </svg>
  );
}

export const PROFILE_LINKS = [
  { label: "LinkedIn", handle: "humayunrashid", href: "https://www.linkedin.com/in/humayunrashid/", icon: <Brand d={BRAND.linkedin} /> },
  { label: "GitHub", handle: "itshum", href: "https://github.com/itshum", icon: <Brand d={BRAND.github} /> },
  { label: "X", handle: "@humrashid", href: "https://x.com/humrashid", icon: <Brand d={BRAND.x} /> },
];

const row =
  "group flex h-8 w-full items-center gap-2.5 rounded-md px-2 text-left text-[13px] text-foreground/75 outline-none transition-colors hover:bg-foreground/[0.06] hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/60";

// The address is put together on click, so it never sits in the markup
// for a scraper to read (the About page does the same).
export function composeMail() {
  window.location.href = `mailto:${["hum", "nessalab.com"].join("@")}`;
}

export function ProfileMenu({ onGo, compact = false }: { onGo: (r: Route) => void; compact?: boolean }) {
  const [open, setOpen] = useState(false);
  const button = (
      <button
        type="button"
        aria-label="Open profile menu"
        className={cn(
          "flex items-center gap-2.5 rounded-md p-1 text-left outline-none transition-colors hover:bg-foreground/[0.05] focus-visible:ring-2 focus-visible:ring-ring/60",
          compact ? "size-10 justify-center" : "min-w-0 flex-1",
          open && "bg-foreground/[0.05]",
        )}
      >
        <img src="/about/avatar.jpg" alt="" width="28" height="28" className="size-7 shrink-0 rounded-full bg-foreground/[0.08] object-cover" />
        <span className={cn("min-w-0 leading-tight", compact && "sr-only")}>
          <span className="block truncate text-[13px] font-medium">{profile.name}</span>
          <span className="block truncate text-xs text-foreground/50">Designer &amp; founder</span>
        </span>
      </button>
  );
  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      {compact ? (
        <Tooltip.Root>
          <Tooltip.Trigger asChild>
            <Popover.Trigger asChild>{button}</Popover.Trigger>
          </Tooltip.Trigger>
          {!open && (
            <Tooltip.Portal>
              <Tooltip.Content
                side="right"
                sideOffset={10}
                className="saas z-50 rounded-md bg-[var(--panel)] px-2.5 py-1.5 text-xs font-medium text-foreground shadow-[0_8px_30px_rgb(0_0_0/0.16)] ring-1 ring-foreground/[0.1] data-[state=delayed-open]:animate-in data-[state=delayed-open]:fade-in-0 data-[state=instant-open]:animate-in data-[state=instant-open]:fade-in-0"
              >
                {profile.name}
              </Tooltip.Content>
            </Tooltip.Portal>
          )}
        </Tooltip.Root>
      ) : (
        <Popover.Trigger asChild>{button}</Popover.Trigger>
      )}
      <Popover.Portal>
        <Popover.Content
          side={compact ? "right" : "top"}
          align={compact ? "end" : "start"}
          sideOffset={8}
          collisionPadding={12}
          className="saas z-50 w-64 max-w-[calc(100vw-1.5rem)] rounded-lg bg-[var(--panel)] p-1.5 text-foreground shadow-[0_8px_30px_rgb(0_0_0/0.16)] ring-1 ring-foreground/[0.1] outline-none data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95"
        >
          <button
            type="button"
            onClick={() => {
              setOpen(false);
              onGo({ section: "profile" });
            }}
            className={row}
          >
            <ProfileIcon className="size-4 shrink-0" />
            <span>Profile</span>
          </button>

          <div className="mt-1.5 border-t border-[var(--line)] pt-1.5">
            <ul>
              {PROFILE_LINKS.map((l) => (
                <li key={l.label}>
                  <a href={l.href} target="_blank" rel="noreferrer noopener" className={row}>
                    {l.icon}
                    <span>{l.label}</span>
                    <span className="ml-auto truncate text-xs text-foreground/40">{l.handle}</span>
                    <ArrowUpRight className="size-3.5 shrink-0 text-foreground/35 transition-colors group-hover:text-foreground" aria-hidden="true" />
                  </a>
                </li>
              ))}
              <li>
                <button type="button" onClick={composeMail} className={row}>
                  <Mail className="size-4 shrink-0" strokeWidth={1.75} aria-hidden="true" />
                  <span>Email</span>
                  <ArrowUpRight className="ml-auto size-3.5 shrink-0 text-foreground/35 transition-colors group-hover:text-foreground" aria-hidden="true" />
                </button>
              </li>
            </ul>
          </div>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
