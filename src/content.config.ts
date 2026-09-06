import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const caseStudies = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/case-studies" }),
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    // Shorter one-liner for cross-links (the homepage list, the "More
    // work" row at the bottom of other case studies) - falls back to
    // `summary` when unset, since the full summary works fine there
    // for case studies that don't need a punchier version.
    shortSummary: z.string().optional(),
    company: z.string(),
    role: z.string(),
    timeframe: z.string(),
    teamSize: z.string().optional(),
    coverImage: z.string().optional(),
    coverImageAlt: z.string().optional(),
    challengeHeading: z.string().optional(),
    problem: z.string(),
    challengeImage: z.string().optional(),
    challengeImageAlt: z.string().optional(),
    // Standalone image rendered after solution item 01 specifically -
    // not tied to the Challenge section despite similar naming above.
    dashboardImage: z.string().optional(),
    dashboardImageAlt: z.string().optional(),
    approachHeading: z.string().optional(),
    approach: z.string(),
    // Full-width row of images (any count) right after the Approach
    // section, before navSystemImage/approachGallery/wideImage.
    approachGrid: z
      .array(
        z.object({
          src: z.string(),
          alt: z.string(),
        })
      )
      .optional(),
    // Full-bleed image right after the Approach section, before
    // approachGallery/wideImage.
    navSystemImage: z
      .object({
        src: z.string(),
        alt: z.string(),
      })
      .optional(),
    approachGallery: z
      .array(
        z.object({
          src: z.string(),
          alt: z.string(),
        })
      )
      .optional(),
    wideImage: z
      .object({
        src: z.string(),
        alt: z.string(),
      })
      .optional(),
    solutionLabel: z.string().optional(),
    solutionHeading: z.string().optional(),
    solutionItems: z
      .array(
        z.object({
          tag: z.string(),
          heading: z.string(),
          body: z.string(),
          image: z.string().optional(),
          imageAlt: z.string().optional(),
          // Default (unset) = full-bleed, matching the cover image.
          // "small" = centered within the text column instead.
          imageSize: z.enum(["default", "small"]).optional(),
          // Renders this item's image inside a drag-to-reveal slider
          // against this wireframe image instead of a plain image.
          // Reusable across case studies - just supply a wireframe
          // asset in the same aspect ratio as `image`.
          compareWireframe: z
            .object({
              src: z.string(),
              alt: z.string().optional(),
            })
            .optional(),
        })
      )
      .optional(),
    triptych: z.array(z.object({ src: z.string(), alt: z.string() })).length(3).optional(),
    // Full-bleed 2x2 grid rendered after solution item 02 (developer
    // experience).
    devGrid: z.array(z.object({ src: z.string(), alt: z.string() })).length(4).optional(),
    // Full-bleed image right after solution item 02.
    item1Image: z.string().optional(),
    item1ImageAlt: z.string().optional(),
    // Full-width drag-to-reveal slider (wireframe vs. final image)
    // rendered after solution item 02, alongside devGrid.
    item1Compare: z
      .object({
        image: z.string(),
        imageAlt: z.string().optional(),
        wireframe: z.object({
          src: z.string(),
          alt: z.string().optional(),
        }),
      })
      .optional(),
    // Wide (not full-bleed) image right after solution item 03,
    // rendered via the WideImage component.
    item2WideImage: z
      .object({
        src: z.string(),
        alt: z.string().optional(),
      })
      .optional(),
    // Full-width row of images (any count) right after item2WideImage,
    // still within the solution item 03 slot.
    item2Grid: z
      .array(
        z.object({
          src: z.string(),
          alt: z.string(),
        })
      )
      .optional(),
    // Full-bleed image right after solution item 04.
    item3Image: z.string().optional(),
    item3ImageAlt: z.string().optional(),
    // Full-width row of images (any count) right after solution item
    // 05, immediately before the quote.
    item4Grid: z.array(z.object({ src: z.string(), alt: z.string() })).optional(),
    // Standalone text section (+ optional slideshow) right after
    // item2Grid, still within the solution item 03 slot.
    dataSectionLabel: z.string().optional(),
    dataSectionHeading: z.string().optional(),
    dataSectionBody: z.string().optional(),
    dataGallery: z
      .array(
        z.object({
          src: z.string(),
          alt: z.string(),
        })
      )
      .optional(),
    designSystemLabel: z.string().optional(),
    designSystemHeading: z.string().optional(),
    designSystemBody: z.string().optional(),
    designSystemImage: z
      .object({
        src: z.string(),
        alt: z.string(),
      })
      .optional(),
    sideBySide: z
      .object({
        left: z.object({ src: z.string(), alt: z.string() }),
        right: z.object({ src: z.string(), alt: z.string() }),
      })
      .optional(),
    detailSplit: z
      .object({
        main: z.object({ src: z.string(), alt: z.string() }),
        detail: z.object({ src: z.string(), alt: z.string() }),
      })
      .optional(),
    quote: z
      .object({
        text: z.string(),
        attribution: z.string(),
      })
      .optional(),
    // Full-width row of images (any count) right after the quote.
    postQuoteGrid: z
      .array(
        z.object({
          src: z.string(),
          alt: z.string(),
        })
      )
      .optional(),
    outcomeHeading: z.string().optional(),
    outcome: z.string(),
    whatIdDoDifferently: z.string().optional(),
    order: z.number(),
    draft: z.boolean().default(true),
  }),
});

const ideas = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/ideas" }),
  schema: z.object({
    title: z.string(),
    excerpt: z.string(),
    date: z.coerce.date(),
    draft: z.boolean().default(true),
  }),
});

// Atrium - a growing library of books, long-form articles, and site
// resources (see src/pages/apps/atrium/). Discriminated on `type`
// since each kind needs different metadata (a book's author/purchase
// link vs. an article's source/URL) but shares the same rating,
// cover, and markdown-body-as-synopsis structure.
const atriumShared = {
  title: z.string(),
  dateAdded: z.coerce.date(),
  // A short 1-2 sentence teaser shown on the grid card - distinct from
  // the markdown body, which is the longer synopsis/take shown on the
  // detail page.
  blurb: z.string(),
  // A flat hex color the placeholder cover is generated from until
  // real cover art is added.
  coverColor: z.string(),
  // Real cover art (an external URL or a path under public/), used in
  // place of the procedural placeholder once available. Optional so
  // entries can be added before art exists.
  coverImage: z.string().optional(),
  // When an entry has no real cover art, `coverImage` can instead hold
  // a decorative background (e.g. a Greco-Roman painting, picked at
  // random from public/atrium-art/) - this flags that case so the
  // title still renders on top, scrimmed for legibility, the same way
  // it would over a flat coverColor.
  showTitleOverlay: z.boolean().optional(),
  // Attribution for a decorative painting standing in as coverImage -
  // rendered as a small caption under the cover in the modal only
  // (the grid card stays clean/small). Unrelated to authorship of the
  // book/article/site itself.
  artCredit: z
    .object({
      title: z.string(),
      artist: z.string(),
      year: z.string(),
      note: z.string().optional(),
    })
    .optional(),
  draft: z.boolean().default(true),
};

const atrium = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/atrium" }),
  schema: z.discriminatedUnion("type", [
    z.object({
      type: z.literal("book"),
      ...atriumShared,
      rating: z.number().min(0).max(5),
      author: z.string(),
      publishDate: z.coerce.date().optional(),
      pageCount: z.number().optional(),
      genre: z.string().optional(),
      // NYC independent bookstores only - never Amazon.
      purchaseUrl: z.string().url().optional(),
      purchaseStore: z.string().optional(),
    }),
    z.object({
      type: z.literal("article"),
      ...atriumShared,
      rating: z.number().min(0).max(5),
      sourceName: z.string(),
      articleUrl: z.string().url(),
      readTime: z.string().optional(),
      articleAuthor: z.string().optional(),
      datePublished: z.coerce.date().optional(),
    }),
    z.object({
      type: z.literal("site"),
      ...atriumShared,
      // No rating for sites - a category tag instead, for browsing/
      // filtering as the library grows.
      category: z.string(),
      siteName: z.string(),
      siteUrl: z.string().url(),
      tagline: z.string().optional(),
    }),
  ]),
});

export const collections = { caseStudies, ideas, atrium };
