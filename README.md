# humrashid.com

Portfolio site. Astro v7 + Tailwind v4 + shadcn/ui. See `portfolio-rebuild-brief.md` (not in this repo) for full scope, timeline, and content plan.

## Commands

| Command                   | Action                                       |
| :------------------------ | :-------------------------------------------- |
| `npm install`              | Installs dependencies                        |
| `npm run dev`               | Starts local dev server at `localhost:4321`  |
| `npm run build`             | Build production site to `./dist/`           |
| `npm run preview`           | Preview build locally                        |

## Structure

- `src/content/case-studies/` — case study markdown, schema in `src/content.config.ts`
- `src/pages/work/[slug].astro` — case study template (shared by all case studies)
- `src/pages/design-system.astro` — live token playground (colors, radius, spacing, fonts) for tuning the design system before it's finalized. **Delete or gate this route before launch** — it currently ships as a normal public page.

## Deploy

GitHub Actions (`.github/workflows/deploy.yml`) builds and deploys to GitHub Pages on every push to `main`.

**Known state as of Aug 2026:** this repo is private, and GitHub Pages requires a public repo on the free plan. The `deploy` job will fail on every push until the repo is switched to public and Pages is enabled in Settings → Pages — this is expected and deliberate (site stays private pre-launch), not a bug. Planned to flip right before the Sept 14, 2026 launch/DNS cutover. The `build` job passing is the useful signal until then.
