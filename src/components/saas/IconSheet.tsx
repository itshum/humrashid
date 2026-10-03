import { cn } from "@/lib/utils";
import { AppsIcon, HomeIcon, IdeasIcon, InspirationIcon, ProcessIcon, ProfileIcon, WorkIcon, type NavIcon } from "./icons";
import "./saas.css";

// A reference sheet for the navigation icon family: how each glyph is
// built, how it scales, and how it behaves in the sidebar.

const ICONS: Array<{ name: string; Icon: NavIcon; idea: string }> = [
  { name: "Home", Icon: HomeIcon, idea: "A house. The pixel is the door." },
  { name: "Work", Icon: WorkIcon, idea: "Stacked cards: this project, and the ones before it." },
  { name: "Ideas", Icon: IdeasIcon, idea: "A bulb. The pixel is the spark." },
  { name: "Apps", Icon: AppsIcon, idea: "The logo mark, quartered, with one tile filled." },
  { name: "Process", Icon: ProcessIcon, idea: "An endless loop, with the pixel at the crossing." },
  { name: "Inspiration", Icon: InspirationIcon, idea: "A photograph. The pixel is the sun." },
  { name: "Profile", Icon: ProfileIcon, idea: "A person, head and shoulders." },
];

// The 20-unit construction grid, drawn behind the large glyph.
const GRID =
  "linear-gradient(to right, color-mix(in oklab, currentColor 9%, transparent) 1px, transparent 1px), linear-gradient(to bottom, color-mix(in oklab, currentColor 9%, transparent) 1px, transparent 1px)";

function Row({ Icon, name, state }: { Icon: NavIcon; name: string; state: "idle" | "active" }) {
  const active = state === "active";
  return (
    <div
      aria-current={active ? "page" : undefined}
      className={cn(
        "group flex h-8 items-center gap-2.5 rounded-md px-2 text-[13px] transition-colors",
        active ? "bg-foreground/[0.07] font-medium text-foreground" : "text-foreground/70 hover:bg-foreground/[0.05] hover:text-foreground",
      )}
    >
      <Icon className={cn("size-[17px] shrink-0", active ? "text-foreground" : "text-foreground/65 group-hover:text-foreground/80")} />
      {name}
    </div>
  );
}

export default function IconSheet() {
  return (
    <div className="saas min-h-dvh bg-[var(--panel)] px-6 py-12 text-foreground antialiased sm:px-10">
      <div className="mx-auto max-w-5xl">
        <h1 className="text-xl font-semibold tracking-tight">Navigation icons</h1>
        <p className="mt-1 max-w-2xl text-sm text-foreground/65">
          One family, drawn on a 20 × 20 grid with a 1.6 stroke and round caps. Every glyph is a line drawing with one filled pixel,
          borrowed from the 4 × 4 logo mark. Line and fill both follow the text color.
        </p>

        <dl className="mt-6 grid grid-cols-2 gap-x-8 gap-y-3 border-y border-foreground/[0.08] py-4 text-sm sm:grid-cols-4">
          {[
            ["Grid", "20 × 20"],
            ["Stroke", "1.6, round caps and joins"],
            ["Detail", "One filled pixel, 2.8 to 6 units"],
            ["Sidebar size", "17px"],
          ].map(([k, v]) => (
            <div key={k}>
              <dt className="text-xs text-foreground/65">{k}</dt>
              <dd className="mt-0.5">{v}</dd>
            </div>
          ))}
        </dl>

        <ul className="mt-8 grid gap-4 sm:grid-cols-2">
          {ICONS.map(({ name, Icon, idea }) => (
            <li key={name} className="rounded-xl p-4 ring-1 ring-foreground/[0.1]">
              <div className="flex gap-5">
                <div
                  className="relative grid size-32 shrink-0 place-items-center rounded-lg bg-foreground/[0.03] text-foreground"
                  style={{ backgroundImage: GRID, backgroundSize: "6.4px 6.4px" }}
                >
                  <Icon className="group size-32 [&_path]:[vector-effect:non-scaling-stroke] [&_rect]:[vector-effect:non-scaling-stroke] [stroke-width:2px]" />
                  <span aria-hidden="true" className="absolute bottom-1.5 right-2 text-[10px] text-foreground/45">
                    20 grid
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <h2 className="text-sm font-medium">{name}</h2>
                  <p className="mt-1 text-[13px] text-foreground/65">{idea}</p>
                  <div className="mt-3 flex items-center gap-3 text-foreground/70">
                    {[
                      ["size-4", "16"],
                      ["size-5", "20"],
                      ["size-7", "28"],
                    ].map(([cls, label]) => (
                      <span key={label} className="group flex flex-col items-center gap-1">
                        <Icon className={cls} />
                        <span className="text-[10px] text-foreground/45">{label}</span>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-2 border-t border-foreground/[0.07] pt-3">
                <Row Icon={Icon} name={name} state="idle" />
                <Row Icon={Icon} name={name} state="active" />
              </div>
            </li>
          ))}
        </ul>
        <p className="mt-6 text-xs text-foreground/65">Hover an idle row to see the pixel pop. The right-hand row is the active state.</p>
      </div>
    </div>
  );
}
