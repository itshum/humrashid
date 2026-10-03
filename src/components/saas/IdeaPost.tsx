import { Fragment, useRef, type ReactNode } from "react";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Block, Idea } from "./content";
import type { Route } from "./data";
import { Reveal, Toc, useCaseStudyReveal } from "./CaseStudyParts";
import { ShotTabs } from "./pack/parts";
import { formatDate } from "./ui";

// One Ideas post as an article. Text keeps the same measure as a case
// study (44rem); the title and any figures sit inside it, the section
// index appears at the edge once the first heading has scrolled up, and
// a Back button returns to the list. A post written as `blocks` can mix
// paragraphs (with *italic* and **bold**), headings, a pull quote, a list,
// a centered image, and an image slideshow.

const MEASURE = "max-w-[44rem]";

// *italic* and **bold** inside a line of text.
function Inline({ text }: { text: string }): ReactNode {
  return text.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g).map((part, i) => {
    if (part.startsWith("**"))
      return (
        <strong key={i} className="font-semibold text-foreground">
          {part.slice(2, -2)}
        </strong>
      );
    if (part.startsWith("*")) return <em key={i}>{part.slice(1, -1)}</em>;
    return <Fragment key={i}>{part}</Fragment>;
  });
}

function BlockView({ block }: { block: Block }) {
  switch (block.type) {
    case "p":
      return (
        <Reveal
          className={cn(
            MEASURE,
            "text-pretty text-[16px] leading-[1.8] text-foreground/85",
          )}
        >
          <p>
            <Inline text={block.text} />
          </p>
        </Reveal>
      );
    case "h2":
      return (
        <Reveal className={cn(MEASURE, "pt-6")}>
          <h2
            id={block.id}
            className="scroll-mt-8 text-balance text-[24px] font-semibold leading-tight tracking-tight"
          >
            {block.text}
          </h2>
        </Reveal>
      );
    case "quote":
      return (
        <Reveal className={cn(MEASURE, "py-4")}>
          <blockquote className="border-l-2 border-foreground/80 pl-6">
            <p className="text-pretty text-[22px] font-medium italic leading-[1.5] tracking-tight">
              “{block.text}”
            </p>
            {block.cite && (
              <footer className="mt-4 text-sm not-italic text-foreground/60">
                {block.cite}
              </footer>
            )}
          </blockquote>
        </Reveal>
      );
    case "list":
      return (
        <Reveal
          className={cn(
            MEASURE,
            "text-[16px] leading-[1.8] text-foreground/85",
          )}
        >
          <ul className="list-disc space-y-2 pl-6 marker:text-foreground/40">
            {block.items.map((item) => (
              <li key={item} className="pl-1">
                <Inline text={item} />
              </li>
            ))}
          </ul>
        </Reveal>
      );
    case "image":
      return (
        <Reveal className="py-2">
          <figure className="mx-auto max-w-[44rem]">
            <img
              src={block.src}
              alt={block.alt}
              loading="lazy"
              className="block w-full rounded-[4px] bg-[var(--surface-2)]"
            />
            {block.caption && (
              <figcaption className="mt-3 text-center text-[13px] leading-[1.45] text-foreground/60">
                {block.caption}
              </figcaption>
            )}
          </figure>
        </Reveal>
      );
    case "slideshow":
      return (
        <div className="py-2">
          <ShotTabs
            id={`post-${block.images[0].id}`}
            label="Slideshow"
            shots={block.images.map((im) => ({
              id: im.id,
              label: im.label,
              src: im.src,
              alt: im.alt,
              caption: im.caption,
            }))}
          />
        </div>
      );
  }
}

export function IdeaArticle({
  post,
  go,
}: {
  post: Idea;
  go: (r: Route) => void;
}) {
  useCaseStudyReveal();
  // The index scrolls with the panel, which is the nearest scroller above.
  const scroller = useRef<HTMLElement | null>(null);
  const find = (el: HTMLDivElement | null) => {
    scroller.current = el?.closest<HTMLElement>(".overflow-y-auto") ?? null;
  };
  const nav = (post.blocks ?? []).flatMap((b) =>
    b.type === "h2" ? [{ id: b.id, label: b.text }] : [],
  );

  return (
    <div ref={find} className="relative pb-24 pt-6">
      <button
        type="button"
        onClick={() => go({ section: "ideas" })}
        className="group -ml-2 mb-10 inline-flex h-8 items-center gap-1.5 rounded-md px-2 text-[13px] text-foreground/60 outline-none transition-colors hover:bg-foreground/[0.06] hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/60"
      >
        <ArrowLeft
          className="size-3.5 transition-transform duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-x-[3px] group-focus-visible:-translate-x-[3px] motion-reduce:transition-none"
          aria-hidden="true"
        />{" "}
        Back
      </button>

      <div
        className={cn(
          "grid gap-x-10",
          nav.length > 0 && "xl:grid-cols-[minmax(0,1fr)_28px]",
        )}
      >
        <article className="min-w-0">
          <header className={MEASURE}>
            <time
              dateTime={post.date}
              className="text-[13px] text-foreground/60"
            >
              {formatDate(post.date)}
            </time>
            <h1 className="mt-3 text-balance text-[34px] font-semibold leading-[1.15] tracking-tight">
              {post.title}
            </h1>
            <p className="mt-4 text-pretty text-[17px] leading-[1.6] text-foreground/60">
              {post.excerpt}
            </p>
          </header>

          <div className="mt-12 space-y-7 border-t border-foreground/[0.08] pt-12">
            {post.blocks
              ? post.blocks.map((b, i) => <BlockView key={i} block={b} />)
              : post.body.map((para) => (
                  <Reveal
                    key={para}
                    className={cn(
                      MEASURE,
                      "text-pretty text-[16px] leading-[1.8] text-foreground/85",
                    )}
                  >
                    <p>{para}</p>
                  </Reveal>
                ))}
          </div>
        </article>

        {nav.length > 0 && (
          <aside className="hidden xl:block">
            <Toc
              nav={nav}
              scroller={scroller as React.RefObject<HTMLDivElement | null>}
            />
          </aside>
        )}
      </div>
    </div>
  );
}
