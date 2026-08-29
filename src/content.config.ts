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
    problem: z.string(),
    approach: z.string(),
    outcome: z.string(),
    whatIdDoDifferently: z.string().optional(),
    coverImage: z.string().optional(),
    order: z.number(),
    draft: z.boolean().default(true),
  }),
});

export const collections = { caseStudies };
