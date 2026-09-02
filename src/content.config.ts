import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const caseStudies = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/case-studies" }),
  schema: z.object({
    title: z.string(),
    summary: z.string(),
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

export const collections = { caseStudies };
