import { useState } from "react";
import { cn } from "@/lib/utils";
import type { Route, WorkItem } from "./data";

type Go = (r: Route) => void;

// The case study itself, in the panel: the real page in a frame that
// fills it. Its own back arrow tells this window to return to Work
// (Topbar.astro already posts that message when embedded).
function EmbeddedPage({ src, title }: { src: string; title: string }) {
  const [loaded, setLoaded] = useState(false);
  return (
    <div className="relative size-full">
      {!loaded && (
        <div className="absolute inset-0 space-y-4 p-10" aria-hidden="true">
          <div className="mx-auto h-3 w-24 animate-pulse rounded bg-foreground/[0.08]" />
          <div className="mx-auto h-8 w-2/3 animate-pulse rounded bg-foreground/[0.08]" />
          <div className="mx-auto h-4 w-1/2 animate-pulse rounded bg-foreground/[0.06]" />
          <div className="mt-10 aspect-[16/9] w-full animate-pulse rounded-lg bg-foreground/[0.06]" />
        </div>
      )}
      <iframe
        src={src}
        title={title}
        onLoad={() => setLoaded(true)}
        className={cn("size-full border-0 transition-opacity duration-200", loaded ? "opacity-100" : "opacity-0")}
      />
    </div>
  );
}

export function CaseStudyFrame({ work }: { work: WorkItem; go: Go }) {
  return <EmbeddedPage src={`/work/${work.slug}`} title={`${work.name} case study`} />;
}
