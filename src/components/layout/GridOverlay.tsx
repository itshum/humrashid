import { useEffect, useState } from "react";

type Tier = {
  name: string;
  minWidth: number;
  columns: number;
  gutter: number;
  margin: number;
};

// Keep in sync with Grid.astro's Tailwind classes.
const TIERS: Tier[] = [
  { name: "XL", minWidth: 1280, columns: 12, gutter: 32, margin: 80 },
  { name: "Desktop", minWidth: 1024, columns: 12, gutter: 24, margin: 64 },
  { name: "Tablet", minWidth: 768, columns: 8, gutter: 24, margin: 40 },
  { name: "Mobile", minWidth: 0, columns: 4, gutter: 16, margin: 20 },
];

function getTier(width: number): Tier {
  return TIERS.find((t) => width >= t.minWidth) ?? TIERS[TIERS.length - 1];
}

export function GridOverlay() {
  const [visible, setVisible] = useState(false);
  const [tier, setTier] = useState<Tier>(TIERS[TIERS.length - 1]);

  useEffect(() => {
    const update = () => setTier(getTier(window.innerWidth));
    update();
    window.addEventListener("resize", update);

    const onKey = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === "g" && !e.metaKey && !e.ctrlKey) {
        const target = e.target as HTMLElement;
        if (target.tagName === "INPUT" || target.tagName === "TEXTAREA") return;
        setVisible((v) => !v);
      }
    };
    window.addEventListener("keydown", onKey);

    return () => {
      window.removeEventListener("resize", update);
      window.removeEventListener("keydown", onKey);
    };
  }, []);

  return (
    <>
      <button
        onClick={() => setVisible((v) => !v)}
        style={{
          position: "fixed",
          bottom: 20,
          right: 20,
          zIndex: 10000,
          padding: "0.5rem 1rem",
          borderRadius: 999,
          background: visible ? "#7c3aed" : "#171717",
          color: "#fff",
          fontSize: "0.75rem",
          border: "none",
          cursor: "pointer",
          fontFamily: "ui-sans-serif, system-ui, sans-serif",
        }}
      >
        {visible ? "Hide grid (g)" : "Show grid (g)"}
      </button>

      {visible && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 9999,
            pointerEvents: "none",
          }}
        >
          <div
            style={{
              maxWidth: 1440,
              margin: "0 auto",
              height: "100%",
              display: "grid",
              gridTemplateColumns: `repeat(${tier.columns}, 1fr)`,
              gap: tier.gutter,
              paddingLeft: tier.margin,
              paddingRight: tier.margin,
            }}
          >
            {Array.from({ length: tier.columns }).map((_, i) => (
              <div
                key={i}
                style={{
                  background: "rgba(124, 58, 237, 0.08)",
                  borderLeft: "1px dashed rgba(124, 58, 237, 0.4)",
                  borderRight: "1px dashed rgba(124, 58, 237, 0.4)",
                  height: "100%",
                }}
              />
            ))}
          </div>

          <div
            style={{
              position: "fixed",
              bottom: 20,
              left: 20,
              background: "#171717",
              color: "#fff",
              fontSize: "0.7rem",
              fontFamily: "ui-monospace, monospace",
              padding: "0.5rem 0.75rem",
              borderRadius: 6,
              lineHeight: 1.5,
            }}
          >
            {tier.name} · {window.innerWidth}px · {tier.columns} col · {tier.gutter}px gutter ·{" "}
            {tier.margin}px margin
          </div>
        </div>
      )}
    </>
  );
}
