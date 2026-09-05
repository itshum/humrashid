# Chart & diagram style guide

Reference for building simple, outline-based charts/diagrams for blog
posts (and anywhere else on the site). Read this before drawing a
chart when asked — it's the on-brand default, not a decision to
re-derive from scratch each time.

## Where this came from

The visual approach (monochrome base, one reserved accent color for
the 1-2 things that matter, no shadows, thin hairline borders, small
letter-spaced caption labels, everything aligned to a 4px grid) is
adapted from the design principles behind
[cathrynlavery/diagram-design](https://github.com/cathrynlavery/diagram-design)
— a well-designed, actively maintained Claude Code skill for editorial
diagrams. Worth knowing it exists as a real option: it ships 39 full
diagram *types* (sequence, ER, Gantt, Sankey, Wardley maps, etc.) with
its own brand-onboarding flow, and could be installed as an actual
Claude Code plugin if a wider variety of diagram types is ever needed
(`/plugin marketplace add cathrynlavery/diagram-design`). What's below
is a lighter, hand-adapted version scoped to what this site actually
needs — a bar chart, a line chart, and a simple flow/process diagram —
built directly against hum-site's own tokens rather than a separate
system to maintain.

## Core rules

1. **Monochrome first, one accent.** Everything is drawn in the same
   neutral ink/label/border tones already used across the site. Color
   is reserved for the single data point, bar, or line the reader
   should notice first — never more than one or two per chart. If
   nothing deserves emphasis, don't force an accent onto something.
2. **No shadows, no gradients on chart elements.** Flat fills only.
   (The homepage's own soft photo shadow and the footer's shimmer line
   are page chrome, not chart chrome — don't borrow those here.)
3. **Hairline borders.** 1px strokes throughout — bars, nodes, axis
   lines. Never thicker unless it's the one accented element, and even
   then stay at 1-1.5px.
4. **Corners stay small.** 0px (sharp) for process/rectangle nodes,
   up to ~6-8px for pill-shaped start/end nodes. Never a large,
   friendly-rounded-card radius — that reads as UI chrome, not an
   editorial figure.
5. **Everything on a 4px grid.** Every x/y coordinate, width, height,
   and gap should be a multiple of 4. This one is non-negotiable —
   it's most of what separates a deliberate diagram from one that
   reads as generated.
6. **Generous whitespace, minimal chart-junk.** No gridlines unless a
   reader genuinely needs to trace a value back to an axis. No legend
   if the chart only has 1-2 series — label lines/bars directly
   instead.
7. **Small caps for meta labels.** Axis titles, eyebrows, and
   category labels above a chart use small, letter-spaced, uppercase
   text in the muted label color — matches the site's existing
   `.section-heading` / `.eyebrow` treatment (see homepage, Principles
   page).

## Token mapping

Use the site's real CSS custom properties wherever the chart lives
inside a page (so it tracks the time-based light/dark theme
automatically). Only bake in literal hex values for a static exported
image (e.g. an OG card) where custom properties can't apply.

| Role | Token | Light | Dark |
|---|---|---|---|
| Background / paper | `var(--bg)` | `#f6f6f3` | `#0d0d0c` |
| Ink / primary text, strokes | `var(--text)` | `#262626` | `#eeede8` |
| Muted / secondary series, captions | `var(--label)` | `#7a7a7a` | `#93928c` |
| Border / hairline | `var(--border)` | `#e0ded7` | `#252423` |
| Surface fill (bars, node fill) | `var(--hover-bg)` | `#e8e7e2` | `#1d1d1b` |
| **Accent** (the 1-2 focal elements) | `var(--selection-bg)` | `#1f3d2e` | `#4fae82` |
| Accent contrast text | `var(--selection-text)` | `#f8f8f6` | `#171715` |

The accent reuses the site's existing selection-highlight color rather
than introducing a new one — it's already the site's one deliberate
spot of color, so a chart's focal point and a text selection read as
the same brand signal rather than competing accents.

## Typography

- **Node/axis/data labels:** Instrument Sans, matching body text
  everywhere else on the site. Regular weight for values, 500 for
  emphasis.
- **Chart title (if the chart has one):** Instrument Serif italic, the
  same "one deliberate serif flourish" already used for the homepage's
  ampersand and the Principles page numerals — not Geist/a second sans
  the way the source project uses. Keeps every serif moment on the
  site consistent rather than adding a second one just for charts.
- **Small caption/eyebrow labels:** Instrument Sans, ~11-12px,
  uppercase, `letter-spacing: 0.06em`, `var(--label)` color — matches
  `.section-heading` elsewhere on the site.
- **Technical sublabels** (a port number, a field type, a literal
  value): `ui-monospace, "SF Mono", Menlo, monospace` — same monospace
  stack rendr already uses for its own technical chips, kept
  consistent site-wide rather than introducing a different mono font.

## Starting templates

Two ready-to-adapt SVGs live alongside this file:

- `example-bar-chart.svg` — categorical comparison, one accented bar.
- `example-flow-diagram.svg` — a simple 4-step process with one
  accented outcome node.

Both are built at a 4px-aligned coordinate grid, and every color is a
CSS custom property with a light-mode fallback (e.g.
`style="fill:var(--selection-bg,#1f3d2e)"`) rather than flat hex. That
means:

- Embedded **inline** in an Astro page (paste the `<svg>` markup
  directly into the template), it automatically tracks the page's real
  `:root`/`:root[data-theme="dark"]` tokens — no extra work.
- Opened or referenced as a **standalone file** (a blog post image, a
  raw `file://` open) with no ancestor defining those tokens, it falls
  back to the light-mode hex baked into each `var()` call, so it still
  renders correctly, just not theme-reactive.
- `preview.html` (alongside this file) demonstrates both themes side by
  side for both templates - it fetches each `.svg` and inlines it into
  a themed panel, since only a truly inline SVG shares CSS custom
  properties with its page (an `<object>` or `<img>` embed does not).
  Serve `chart-notes/` over HTTP to open it (`fetch()` needs http(s),
  not `file://`) - e.g. temporarily copy it into `public/` the way any
  other local-preview file gets tested, then remove it after.

## When *not* to draw a chart

Same judgment call the source project uses: before building one, ask
whether a reader would actually learn more from a chart than from one
well-written sentence or a short list. A single before/after pair, a
short list of items, or one comparison point usually doesn't earn a
chart.
