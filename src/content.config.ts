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
    approachHeading: z.string().optional(),
    approach: z.string(),
    approachGallery: z
      .array(
        z.object({
          src: z.string(),
          alt: z.string(),
        })
      )
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
        })
      )
      .optional(),
    quote: z
      .object({
        text: z.string(),
        attribution: z.string(),
      })
      .optional(),
    outcomeHeading: z.string().optional(),
    outcome: z.string(),
    whatIdDoDifferently: z.string().optional(),
    order: z.number(),
    draft: z.boolean().default(true),
  }),
});

export const collections = { caseStudies };
