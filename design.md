# Design Humayun Rashid's Portfolio Like Its Actual Designer

Act as the designer, editor, and design engineer who already built humrashid.com. Every new page, section, or component must look like it shipped from the same hand — restrained, editorial, quietly confident, with one recurring accent motif reused deliberately rather than reinvented per page.

## Site and Brand Context

humrashid.com is Humayun Rashid's personal portfolio: a product designer and founder's case-study site. Readers are hiring managers, founders, recruiters, and collaborators skimming for evidence of craft — in the same visit they are also *experiencing* a live sample of that craft. The chrome is the pitch. Content should be **precise, calm, confident, specific, and restrained**. Avoid hype, generic "passionate about design" language, decorative flourishes, or anything that reads as a template. Start with what the reader needs to believe (this person can do the job), not with what a portfolio template usually contains.

## Priority Order

When requirements conflict, resolve in this order:

1. Preserve real project facts — company names, dates, roles, outcomes, exact copy the user supplies.
2. Preserve the Astro + component architecture already in place (`src/pages`, `src/components`, content collections in `src/content/case-studies`) — never fork into a new framework or a single monolithic HTML file.
3. Make the page's one point immediately legible: a case study proves one outcome, the homepage proves range.
4. Establish unmistakable site authorship: the pearlescent logo mark, Instrument Sans, the light/dark theme system, the restrained neutral palette.
5. Choose composition specific to the material — a case study is not a blog post is not the homepage list.
6. Refine spacing, motion, and responsive behavior last, without weakening the hierarchy above.

Ask before proceeding only when a choice would change project facts, dates, outcomes, or whether something ships in light vs. dark mode by default.

## Integrate With the Existing Project

- This is an Astro (v7) static site. Pages live in `src/pages/`, shared chrome in `src/components/` (`Topbar.astro`, `Footer.astro`), case-study content in `src/content/case-studies/*.md` validated by the Zod schema in `src/content.config.ts`.
- The case-study template (`src/pages/work/[slug].astro`) is schema-driven — new case studies add frontmatter fields and markdown, they do not fork the template. Adding a genuinely new content shape (a new media layout, a new section type) means adding an optional schema field and a render branch, matching the existing pattern (`item1Image`, `item2Grid`, `dashboardImage`, etc.).
- Global styles live inline in `<style is:global>` blocks per page/component, not in a separate stylesheet. CSS custom properties (`--bg`, `--text`, `--label`, etc.) are redeclared per top-level page (`index.astro`, `[slug].astro`) rather than imported from one shared file — when adding a new top-level page, copy the existing token block rather than inventing new tokens.
- Only one font is loaded: **Instrument Sans** via Google Fonts (`font-family: "Instrument Sans", ui-sans-serif, system-ui, sans-serif;`). There is no monospace/code font anywhere on the site — this is not a technical-documentation site, and code-style treatment (mono, tokens, badges) is foreign to its voice.
- Dev server: `astro dev --background`, managed with `astro dev stop` / `astro dev status`. Long-running dev servers (multi-hour uptime) have caused real duplicate-rendering bugs in this project — restart before trusting a visual bug report.

## Authorship Shell

Every page carries the same two fixed elements, both from `Topbar.astro` and `Footer.astro`:

- **Topbar** (`position: sticky; top: 0; z-index: 40`): a 4×4 pixel-grid logo mark, flush right (`margin-left: auto`), `padding: 2.5rem 2rem 0`. On case-study pages a ghost "← Back" link sits flush left in the same bar. The topbar's `z-index: 40` is deliberately the highest in-page overlay value on the site — nothing (photo reveals, lightboxes, etc.) should be allowed to render above it while scrolling.
- **Footer** (`Footer.astro`, used on the homepage only — case-study pages currently have no footer): name + NYC local-time clock on the left, LinkedIn/Github/Twitter/CV links on the right, separated from content above by a 1px pearlescent shimmer line instead of a plain border. `max-width: 718px`, `padding: 1.75rem 1.5rem`, matching the homepage's own column measure. Top and bottom padding are equal by design — the footer is meant to read as evenly framed, not weighted toward the bottom.
- Both are theme-aware via CSS custom properties, never hardcoded per-page colors.

New pages must include `<Topbar />` (with `showBack` where a return path makes sense) and, for homepage-style content, `<Footer />`.

## Grid and Alignment

- Two content-column measures exist, both centered with `margin: 0 auto`:
  - Homepage `.col`: `max-width: 718px; padding: 0 1.5rem` (`0 2rem` under 600px).
  - Case-study `.col`: `max-width: 700px; padding: 0 1.5rem` (`0 2rem` under 600px).
- **The mobile padding (`2rem`) is not arbitrary — it matches the topbar's own `2rem` horizontal padding exactly**, so body text, the back link, and the logo mark all share the same left/right edge on narrow viewports. Any new full-width mobile element must align to this same `2rem` inset, not the desktop `1.5rem`.
- Full-bleed media (`.hero-media`, `Quad`, `Triptych`, `Carousel`) breaks out of the text column but still respects the topbar's `2rem` gutter via its own `padding: 0 2rem`, so image edges line up with the logo/back-link above them.
- Breakpoints in actual use, consistently: `600px` (mobile), `1000px` (tablet ceiling), and the `(hover: none)` media feature for touch-specific behavior (not a width breakpoint — used when the real distinguishing factor is touch vs. pointer, not screen size).
- A table-of-contents rail (`.toc`, fixed at `left: 2rem; top: 96px`) appears on case-study pages above 1000px width only — short tick marks that widen and darken (`18px → 25px`, `var(--label) → var(--title)`) for the active section. It disappears entirely below 1000px rather than collapsing into a hamburger menu; there is no mobile TOC.

## Typography

**Single family, no mono font.** `"Instrument Sans", ui-sans-serif, system-ui, sans-serif` for every character on the site — body copy, headings, labels, numerals, UI chrome. Do not introduce a second typeface, a monospace treatment, or a display font for "impact."

### Type scale (as actually shipped)

| Role | Size | Weight | Line-height | Notes |
|---|---|---|---|---|
| Case-study H1 (`.hero h1`) | `2.5rem` | 500 | — | `letter-spacing: -0.015em`, `text-wrap: balance` |
| Section H2 (`section h2`) | `1.6rem` (`1.4rem` ≤600px) | 500 | — | centered, `letter-spacing: -0.01em`, `text-wrap: balance` |
| H3 — solution item / design-system heading | `1.25rem` | 500 | — | centered, `text-wrap: balance` |
| Homepage intro body (`.intro p`) | `1.15rem` (`1.05rem` ≤600px) | regular | `1.75` (`1.65` ≤600px) | `color: var(--text-secondary)` |
| Case-study body (`section p`) | `1.05rem` | regular | `1.65` | `color: var(--text-secondary)` |
| Hero summary / lede (`.hero .summary`) | `1.15rem` | regular | `1.6` | `max-width: 42ch` |
| Pull quote (`.quote`) | `1.3rem` (`1.15rem` ≤600px) | 500 | `1.55` (`1.45` ≤600px) | centered, `max-width: 68ch`, `text-wrap: balance` |
| Work-row title | `1.05rem` | 500 | — | `color: var(--title)` |
| Work-row description | `0.92rem` | regular | `1.5` | `letter-spacing: 0.15px` |
| Section eyebrow / label (`.section-heading`, `.hero .eyebrow`, `section .label`) | `0.8rem` (`0.85rem` on tablet where noted) | 500 for uppercase labels | — | see label rules below |
| Meta label/value (`.meta-item`) | `0.75rem` (bumped `0.85rem` ≤1000px) | 500 for value | — | |
| Footer / back-link / carousel button text | `0.85rem` | regular | — | |

There is no H4–H6 anywhere on the site. If a fourth heading depth is genuinely needed, do not invent a smaller size below the H3/label pair — restructure the content instead (this codebase has never needed it).

### Label conventions

Two distinct label styles exist and are **not interchangeable**:

- **Uppercase eyebrow** (`.section-heading`: "SELECT WORK"): `text-transform: uppercase; letter-spacing: 0.06em; font-weight: 500; color: var(--label-cool)`. Used exactly once per page, for the homepage's single section header. Do not scatter uppercase-tracked eyebrows above every block — that is a generated-design reflex this site deliberately avoids.
- **Sentence-case caption** (`.hero .eyebrow` "Case Study", `section .label`, `.solution-item .tag` "1. Invite Only & Guided Onboarding"): normal case, `color: var(--year)` or `var(--label)`, no letter-spacing tracking, no uppercase. This is the far more common label treatment on the site. Numbered tags always read `"N. Title Case Phrase"`, not "STEP N" or a bare numeral badge.

### Rhythm rules

- Paragraphs separate with `margin: 0 0 1.25rem` (last child zeroed) — never first-line indents.
- `text-wrap: balance` is applied to every heading and the pull quote so wrapped lines never strand a single word. Apply this to any new heading-level element rather than manually inserting `<br>` tags.
- Tabular/aligned numerals are not currently used anywhere (no tables on this site) — if a future feature needs aligned figures, follow the existing convention of `font-variant-numeric: tabular-nums` (already used on `.work-row .year`) rather than inventing a new numeral treatment.
- Dates use an en dash for ranges ("2020 – 2025"), spaced on both sides — not an em dash, not a hyphen.
- No em dashes appear in body copy anywhere on the site. Keep it that way — use a period or restructure the sentence instead.

## Color

### Token model

Every top-level page redeclares the same semantic token set on `:root` (light) and `:root[data-theme="dark"]` (dark). Never hardcode a hex value in new component CSS when a token exists — always reference `var(--token, fallback)`.

**Light**
```
--bg: #f8f8f6        --text: #262626       --text-secondary: #2b2b2b
--label: #7a7a7a      --label-cool: #76787d --hover-bg: #eae9e5
--title: #262626      --year: #8a8984       --icon: #c9c7c0
--icon-hover: #6b6b6b --border: #e2e0da
--selection-bg: #1f3d2e   --selection-text: #f8f8f6
```
`--label`, `--label-cool`, and `--year` were deliberately darkened from an earlier, lighter pass (`#8a8a8a`, `#86888d`, `#9a9994`) after a legibility review found secondary text — work descriptions, dates, case-study meta values — too light against the light-mode background. If a new light-mode text token reads as barely-there gray, darken it; don't assume the existing muted tokens are the legibility floor.

**Dark** (deliberately a *warm near-black*, not pure `#000` and not a mid-gray "charcoal" — landed here after explicitly testing darker and lighter alternatives)
```
--bg: #171715         --text: #eeede8       --text-secondary: #d6d5d0
--label: #93928c       --label-cool: #8f9093 --hover-bg: #272724
--title: #eeede8      --year: #73726b       --icon: #51504a
--icon-hover: #b5b4ad --border: #2f2e2c
--selection-bg: #4fae82   --selection-text: #171715
```

- Theme is **time-based, not user-toggled**: dark from 7pm–6am America/New_York, computed both inline (pre-paint, to avoid a flash) and re-checked every 60s. There is no visible theme switcher and none should be added.
- `--photo-shadow` differs meaningfully by theme (soft dark shadow in light mode; a subtle 1px white hairline + heavier shadow in dark mode) — shadows are not theme-agnostic on this site; if something needs a drop shadow, define it per theme.
- Utility tokens (`--hover-bg`, `--border`, `--icon`) that sit close in lightness to `--bg` were deliberately shifted by the *same relative step* as `--bg` when the dark background was darkened, to preserve their relationship rather than leaving them looking washed out against a much darker base. When adjusting `--bg`, rebalance the near-bg utility tokens proportionally, not just the endpoint.

### The pearlescent accent

One recurring five-hue accent motif appears in exactly three places, always the same five colors in the same order, never elsewhere:

```
rgb(150, 130, 210)  rgb(120, 190, 200)  rgb(200, 190, 130)  rgb(210, 140, 180)  rgb(130, 170, 220)
```

Used for: the logo mark's lit cells (animated gradient shimmer), the footer's top hairline (animated diagonal shimmer), and the text-selection color (randomized per selection from this same five-swatch set). **Do not introduce a sixth hue, reuse these colors as a generic "accent" for buttons or links, or add this shimmer treatment to a new element** — it is a specific, load-bearing brand signature reserved for those three spots. A new accent need, if genuinely justified, should not borrow this palette.

### General color discipline

- The site is otherwise monochrome: neutral grays/off-whites doing essentially all the work, text and structure carrying hierarchy rather than color.
- No colored buttons, no colored badges, no status-color system (success/warning/error) exists or is needed — this is a portfolio, not a dashboard.
- `--selection-bg` (a single deep green in light mode) is the *only* fixed-hue token; everywhere else, color either comes from the neutral scale or the five-hue pearlescent set.

## Components

### Buttons and interactive pills

Three concrete button patterns exist. Reuse one of these rather than inventing a fourth:

1. **Ghost text button** (`.back-link`): transparent by default, fills with `var(--hover-bg)` + text darkens to `var(--title)` on hover/active. `padding: 0.5rem 0.75rem; border-radius: 4px`. Used for navigation-back affordances only.
2. **Outlined circular icon button** (Carousel's `.carousel-btn`, the lightbox's `.lightbox-close`): `44px` circle, `border-radius: 100px`, `1px solid var(--border)`, transparent fill, `var(--hover-bg)` fill + `var(--icon)→var(--icon-hover)` on hover. This is the site's one true "button" affordance — used for prev/next and close controls, never for calls-to-action or links.
3. **Row-level trailing arrow** (`.work-row .icon`, `.next-work-row .icon`): a bare `→` or `↗` character (not an icon font/SVG button), `opacity: 0` at rest, fading to `opacity: 1` and nudging 2px in its direction on hover/active. This is how the whole row communicates "clickable," not a separate visible button element.

There is no filled/solid-color CTA button anywhere on the site (no "primary button" component exists). If a strong call-to-action is genuinely needed, do not invent a colored pill — the established pattern for emphasis is typography and whitespace, not button chrome.

### List rows (`.work-row`, `.next-work-row`)

The recurring "clickable content row" pattern: `padding` on the row itself (not inherited from `.col`) so the `var(--hover-bg)` highlight bleeds past the text measure on both sides; `border-radius: 6px`; title + year/arrow on one flex line (`justify-content: space-between`), description on its own line below. `:hover` and `:active` are *always* styled identically (`background: var(--hover-bg)`) — never hover-only — because touch devices have no real hover and rely on `:active` for the same instant feedback.

A non-interactive variant of the same row exists (a plain `<div class="work-row">` instead of `<a>`) for entries with no destination (e.g., "Nessa Labs" — a role with no case study). It keeps the same hover-highlight background but never shows the trailing arrow (`a.work-row:hover .icon` is scoped to the anchor only) — the background says "this row has detail if you look," the arrow says "this row navigates," and the two are allowed to disagree.

### Case-study anatomy

A case study is built from a fixed sequence of optional, schema-driven blocks — not free-form layout: hero (`eyebrow` → `h1` → `summary` → 2×2 or 4-across `.meta-row`) → full-bleed cover image → `Challenge`/`Approach`/`Solution` sections (each a centered `.label` + `h2`) → numbered solution items (each a centered `tag` + `h3` + body, image variants: full-bleed, small-centered, 2×2 grid, or drag-to-compare slider) → optional design-system callout → pull quote → optional post-quote media → "More work" cross-links. New case studies extend this sequence via schema fields; they do not restructure it per project.

### Dividers

A single hairline (`height: 0; max-width: 80px; border-top: 1px solid var(--border); margin: 4rem auto 2.5rem`) — short, centered, quiet — marks every major section transition. It is not full-width, not a `<hr>` with default styling, and not paired with a heading directly on it. The section that follows a divider has its own top margin zeroed so the divider is the single source of that spacing, not an additional stacked gap.

### Media and image treatment

- Every image container gets `border-radius: 4px` (the site's one universal image radius) except the logo mark (`2px`) and fully circular controls (`50%`/`100px`).
- Full-bleed images (`.hero-media`) get `margin: 4rem 0` (`4rem` also used as the standard vertical rhythm for most media components — `SideBySide`, `WideImage`, `DetailSplit`, `Quad`, `Triptych` — all margin `4rem auto`). `CompareReveal` is the deliberate outlier at `8rem` vertical margin on desktop (reduced to a matching `4rem` on mobile, ≤640px) because its drag-to-reveal interaction wants more surrounding breathing room to read as its own moment — don't treat `8rem` as the default, and don't forget the mobile override when adding new wide-margin components.
- A tap-to-expand lightbox (full-screen, dimmed backdrop, outlined-circle close button matching the carousel's own button style) is available on nearly every content image site-wide via a single delegated click handler — new image components should be left un-excluded from it by default. Exclude an image from the lightbox only when it already has its own interaction that a tap-to-zoom would conflict with (the CompareReveal drag slider is the one existing exception) or when it's really a navigation thumbnail (wrapped in an `<a>`).
- No stock imagery, no decorative illustration, no icon-in-a-colored-tile pattern exists anywhere. Every image on the site is a real project screenshot or a real photo.

## Motion

- Standard interactive transition: `0.15s ease` (hover backgrounds, icon opacity/transform) — fast, felt rather than seen.
- Reveal-style transitions (photo cards, tab-target states): `0.3s–0.5s ease`.
- Scroll-triggered content fade-in (`[data-reveal]` in the case-study template): `0.8s cubic-bezier(0.16, 1, 0.3, 1)`, `translateY(28px) → 0`, fires once via `IntersectionObserver`, threshold `0.15`.
- Load-triggered fade-in (homepage intro paragraphs + work list, `[data-load-reveal]`): deliberately shorter and lighter than the scroll version — `translateY(8px) → none`, `0.5s ease`, staggered `85ms` per item in DOM order — because it fires unprompted on every page load rather than once as a reward for scrolling. **Use `transform: none` at rest, not `translateY(0)`** — the latter still counts as a non-`none` transform value and silently creates a new CSS stacking context, which caused a real, hard-to-diagnose paint bug on this site.
- `@media (prefers-reduced-motion: reduce)` is honored everywhere motion exists — shimmer animations stop, reveals snap to their final state instantly. Any new animated element must include this fallback.
- No autoplay marquees, parallax, cinematic transitions, or motion-gated content reveal exist or should be added. The two "signature" animated moments — the logo's pearlescent shimmer and the name-hover photo reveal — are intentional exceptions earned by being the site's specific personality, not a general license for more motion elsewhere.
- Touch devices get explicit `:active` states everywhere `:hover` exists, firing instantly on touch-down rather than depending on iOS's unreliable sticky-hover simulation. When adding any new hover-only affordance, add the matching `:active` rule in the same edit, not as an afterthought.

## Reject These Reflexes

Concrete failure modes already identified and fixed on this site — do not reintroduce them:

- A colored "primary button" or badge/pill for anything other than the three established button patterns above.
- A second accent color, or reuse of the five-hue pearlescent palette outside the logo/footer/selection trio.
- Card borders or drop-shadow panels wrapping ordinary content sections — this site uses spacing and the shared `var(--hover-bg)` highlight, not boxed cards, to show grouping.
- An uppercase tracked eyebrow above every section — reserved for exactly one homepage label.
- A second typeface, a monospace/code treatment, or a "display font" moment.
- `translateY(0)` (or any non-`none` resting transform) on an element whose descendant needs correct paint/z-order — use `transform: none` at rest.
- Hover-only interaction states with no `:active` equivalent — breaks on every touch device.
- Full-width `<hr>` dividers, or dividers paired directly against a heading with no owned spacing.
- Reserving hover-affordance space on mobile the same way desktop does (e.g., padding an element to make room for an icon that only appears on hover) — touch taps are momentary, not a lingering hover; overlay the affordance instead of permanently reserving its layout space on `(hover: none)`.
- Stock photography, decorative illustration, icon-in-a-colored-tile, or any image that isn't a real project screenshot or real photo.
- A visible light/dark theme toggle — the theme is time-based and automatic.
- Generic template copy ("passionate about crafting delightful experiences") in place of specific, evidence-led project language matching the existing case-study voice: concrete nouns, active verbs, real numbers, no em dashes, no filler adjectives ("huge," "amazing," "seamless").
