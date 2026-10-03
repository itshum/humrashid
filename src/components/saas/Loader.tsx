import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

// The first-visit loader: the site's 4x4 pixel mark, large, centered in
// the panel. Every lit cell carries the pearlescent gradient, drifting
// slowly at its own phase (the same shimmer as the old logo), and a few
// cells at a time fade on and off at random so the grid keeps changing
// without ever jumping.

const CELLS = 16;
// Row-major, 4 columns by 4 rows: the starting set of lit cells.
const START = [1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1, 0];

export function Loader({ leaving, still }: { leaving: boolean; still: boolean }) {
  const [lit, setLit] = useState<boolean[]>(() => START.map(Boolean));

  useEffect(() => {
    if (still) return;
    const id = window.setInterval(() => {
      setLit((cur) => {
        const next = [...cur];
        // Flip two random cells per tick, never letting the grid go
        // nearly empty or nearly full.
        for (let n = 0; n < 2; n++) {
          const i = Math.floor(Math.random() * CELLS);
          const count = next.filter(Boolean).length;
          if (next[i] && count <= 5) continue;
          if (!next[i] && count >= 11) continue;
          next[i] = !next[i];
        }
        return next;
      });
    }, 240);
    return () => window.clearInterval(id);
  }, [still]);

  return (
    <div
      role="status"
      aria-label="Loading"
      className={cn(
        "saas-loader absolute inset-0 z-10 grid place-items-center bg-[var(--panel)] transition-opacity duration-500 ease-out",
        leaving && "pointer-events-none opacity-0",
      )}
    >
      <div className="grid grid-cols-4 gap-[2.5px] sm:gap-[3px]" aria-hidden="true">
        {lit.map((on, i) => (
          <span key={i} className="relative size-[9px] overflow-hidden rounded-[2px] bg-foreground/[0.09] sm:size-[12px]">
            <span
              className={cn("saas-pixel absolute inset-0 transition-opacity duration-500 ease-in-out", on ? "opacity-100" : "opacity-0")}
              style={{ animationDelay: `-${((((i * 7) % CELLS) / CELLS) * 5).toFixed(3)}s` }}
            />
          </span>
        ))}
      </div>
    </div>
  );
}
