# Writing / blog feature — scope

Status: scoped, not started. Build once given the go-ahead. Plan on 2-3 launch articles before shipping.

Reference: https://joshpuckett.me/on-being-an-elder — borrow the structural/UX pattern (narrow single-column essay, footnotes, minimal chrome, a plain "Writing" list at the bottom of the homepage). Do **not** copy the visual skin (serif Cormorant Garamond type) — run the same structure through Hum's own Instrument Sans design system, centered like the case studies.

## 1. Content architecture

New Astro content collection, same pattern as `caseStudies`: markdown files with frontmatter. No new dependencies needed for base rendering — Astro's built-in renderer already gives headings, bold/italic, links, blockquotes, lists, images, and syntax-highlighted code blocks (Shiki) for free.

```
src/content/writing/
  on-being-an-elder.md
  some-other-post.md
```

**Frontmatter schema** (`content.config.ts`, new `writing` collection):

```yaml
---
title: "On Being An Elder"
subtext: "Responsibilities of those who've been around"   # one-line teaser, shown in lists + <meta description>
date: 2026-08-15
updated: 2026-08-20        # optional, only if edited after publishing
draft: false               # same pattern as case studies
tags: ["career", "essays"] # optional, unused visually at launch but future-proofs filtering/related-posts
coverImage: "/writing/elder/cover.jpg"  # optional — omit entirely for a pure-text post
coverImageAlt: "..."
---

Body content in plain markdown starts here.
```

Publishing a new post = drop one `.md` file in the folder. Title, subtext, date up top; straight into markdown for the body — no positional image slots or numbered sections like the case-study schema needs, since a post is linear prose.

## 2. Routes

- `/writing/[slug].astro` — post template (dynamic route off the collection, same mechanism as `/work/[slug]`).
- `/writing/index.astro` — plain archive/listing page (title + subtext + date, newest first). Worth having from day one even with only 2-3 posts: it's the "see all posts" landing spot, an easy sitemap entry, and reuses the same row component as the homepage teaser.

## 3. Post template design

Mapped onto existing tokens, not Puckett's serif system:

- **Column**: same `.col` measure as the case-study template (700px, centered).
- **Title**: reuse case-study hero `h1` treatment (2.5rem/500), centered, `subtext` underneath in the muted `--label` style (like the case-study summary line).
- **Meta row**: date (+ reading time, cheap to compute from word count) in `--year`/`--label` grey, centered under the subtext. No Company/Role/Team grid — a post just needs the date.
- **Body typography**: `h2`/`h3` reuse the exact case-study section/solution-item heading styles (1.6rem/500 and 1.25rem/500); paragraphs reuse `section p` (1.05rem, 1.75 line-height, `--text-secondary`); add `em`/`strong` rules (new — not yet defined anywhere on the site); `blockquote` borrows the existing `.quote` treatment, left-aligned and smaller since it's inline, not a full-bleed section.
- **Images**: constrained-width, centered, rounded corners — essentially `WideImage.astro` as-is (max-width 920px, but within the 700px column it naturally reads as "sized down and centered"). No full-bleed hero-media component needed.
- **Code snippets**: fenced code blocks render via Astro's built-in Shiki highlighter — needs a `<pre>`/`<code>` style pass (padding, border-radius, font), themed via Shiki's dual-theme CSS-variable output so it flips with the existing time-based dark mode instead of fighting it.
- **Footnotes**: Puckett leans on them heavily; worth adding basic styling for markdown footnote syntax (`[^1]`) if that's a format Hum wants to write in. Nice-to-have, not a blocker.
- **Dark mode**: inherits the same `--bg`/`--text`/`--border` tokens and time-based script the case studies already use — no new theming work.
- **Topbar/logo**: shared `Topbar.astro` (back link + animated logo/easter-egg), no footer — matches the case-study template's current no-footer decision.

## 4. Homepage integration

New `<section>` directly below "Select Work," titled **"Writing"** (same `.section-heading` styling), listing posts as rows reusing the exact `.work-row` pattern already in `index.astro` — title + subtext, hover highlight, arrow icon — pointing at `/writing/[slug]` instead of `/work/[slug]`. Zero new CSS, same component pattern with a different data source. Pull the 2-3 most recent published posts (sorted by `date`); the full list lives at `/writing`.

## 5. SEO

Currently **no page on the site has Open Graph tags, Twitter card tags, canonical links, or structured data at all** — worth fixing as part of this launch:

- `og:*` + `twitter:card` meta per post (title, description = `subtext`, image = `coverImage` if present else a sensible fallback).
- `<link rel="canonical">` — `site` is already set in `astro.config.mjs` (`https://www.humrashid.com`), so this is just wiring.
- JSON-LD `Article` structured data block (headline, datePublished, dateModified, author).
- `@astrojs/sitemap` integration (one package, one config line) — auto-generates `sitemap.xml` covering `/writing/*`.
- Proper heading hierarchy enforced by the template (one `h1`, everything else `h2`/`h3`) — comes free from the design above.

## 6. LLM discoverability

- RSS feed (`@astrojs/rss`, one file) — still the most reliable machine-readable feed; a lot of LLM/aggregator crawlers consume it directly.
- `llms.txt` at the site root — emerging plain-text convention (a simple markdown index of key pages/posts) some LLM crawlers check first. Cheap to add and maintain.
- Clean semantic markdown source + the heading hierarchy above already makes posts easy for any crawler to extract cleanly.
- No paywalls/JS-gated content (already true of the static site, worth preserving).

## 7. New dependencies

Two, both official Astro integrations, both trivial: `@astrojs/sitemap`, `@astrojs/rss`. Everything else (markdown rendering, syntax highlighting, images) is already built into Astro — no MDX needed unless interactive/JSX embeds are wanted inside a post later, which doesn't fit "simple, text-based" blogging.

## 8. Assumptions made — revisit before build if wrong

- URL namespace is `/writing/...` (not `/blog/...`).
- A real `/writing` index page exists from day one, not just the homepage teaser.
- Footnote support is included but only matters if Hum actually writes with them.
- No comments, no tags UI, no related-posts, no author bio block at launch — easy to layer on later, not needed for 2-3 posts.
