# Atrium — real 3D book render (future scope, not started)

## The ask

Replace the current CSS-3D book box in Atrium with something that
actually matches Stripe Press's render quality (see
press.stripe.com — e.g. the marbled/gold-foil "Built to Grow" and
"Maintenance: Of Everything" covers). The bar, in the user's words:
"anything short of that is a failure." If true parity turns out to be
impractical, the accepted fallback is the current flat/CSS approach,
kept draggable, but it **must** pull a real cover image from a source
instead of a procedural placeholder color — that part is non-negotiable
even in the fallback.

## What Stripe Press is actually doing (confirmed, not guessed)

Checked directly against the live site rather than assumed from the
screenshots alone:

- `press.stripe.com` renders its book art on a real `<canvas>`
  element (`class="PressHomepageCanvas"`) with a genuine WebGL/WebGL2
  context (`canvas.getContext('webgl2')` succeeds). This is **not**
  a pre-rendered image, not a CSS 3D transform trick, and not a
  sprite-sheet spin sequence — it's live 3D rendering in the browser.
- No global `THREE` on `window`, and the JS is served as a single
  heavily-bundled/minified file (`Bootstrapper-*.js`), so the exact
  rendering library (Three.js, a custom WebGL wrapper, react-three-fiber,
  etc.) isn't identifiable from the outside without deeper reverse
  engineering (unminifying the bundle, diffing against known library
  fingerprints). Three.js is the most likely candidate given how
  common it is for exactly this kind of product-render work, but that's
  an inference, not a confirmed fact.
- The visual details that make it read as "real" (cloth-weave texture
  on the cover, specular gold-foil highlights that shift with the
  rotation angle, soft directional lighting, a visible page-block with
  actual paper-edge shading) are consistent with a proper PBR
  (physically-based rendering) material setup — a base color/texture
  map, a roughness/metalness map (so the foil catches light
  differently than the cloth), probably a normal map for the woven
  cloth grain, under a real light rig (at minimum a key + fill, likely
  an HDRI environment map for the reflections on the foil).

## Two real build paths, if this gets picked up

**A. True real-time WebGL (Three.js), matching their approach**
- New dependency: `three` (plus likely `@react-three/fiber` if we want
  it to compose reasonably inside Astro/React, or plain vanilla
  Three.js to stay dependency-light like the rest of the site).
- Needs a real book *geometry* (an extruded rounded-box or a small set
  of planes for cover/spine/back/pages, built in Three.js rather than
  CSS transforms) and *materials*: a color/albedo texture (the cover
  art), a roughness map (so foil vs. cloth areas reflect differently),
  optionally a normal map for cloth grain.
- Needs a lighting setup: at minimum key + fill lights, ideally an
  HDRI environment map for realistic specular reflections on any foil
  detailing — this is most of what sells the "expensive" look in the
  reference.
- Per-book content problem: this only looks good with real,
  professionally shot or rendered cover art with actual foil/texture
  detail baked in — a flat color or a simple gradient will look cheap
  no matter how good the renderer is. So this path implies a real
  per-book asset pipeline, not just "drop in a JPEG."
- This is a genuinely large lift: new dependency, real 3D asset
  authoring knowledge (or a pipeline to generate serviceable normal/
  roughness maps from source art), and materially more render/GPU cost
  per page load than the current CSS box.

**B. Pre-rendered spin sequence (a "360 product viewer" trick)**
- Render the book once, properly, in a real 3D tool (Blender, e.g.),
  at N angles (36-72 frames is typical for a smooth drag-to-spin
  product viewer), export as a frame sequence, and on the web just
  swap/crossfade frames based on drag delta — no WebGL needed at all,
  just images.
- Much cheaper to *serve* (static images, any browser, no GPU
  requirement) but the cost moves entirely into a per-book *authoring*
  step outside the codebase: someone has to actually model/texture/
  render each book in Blender (or similar) before it can appear in
  Atrium. That's a real bottleneck against "an expansive and growing
  library" unless that render step itself gets scripted/batched
  (e.g. a Blender Python script that takes a flat cover image + spine
  width and auto-renders the sequence) — which is itself a project.
- Ruled out as the primary path unless a batchable render pipeline is
  worth building, given how much per-book manual effort it implies
  otherwise.

## Fallback (explicitly pre-approved by the user)

Keep the current hand-rolled CSS-3D box (`Book3D.astro` — real hinge-
based 6-face geometry, page-block texture, drag-to-rotate, shared
between the grid and detail page) exactly as-is, but fix the one part
that's currently fake: **wire in a real cover image source** instead of
the procedural gradient-from-a-hex-color placeholder. Concretely:

- `coverImage` already exists as an optional schema field
  (`src/content.config.ts`) and the component already prefers it over
  the procedural gradient when set — so the rendering side is already
  ready for this.
- What's missing is actually *getting* real cover images per book
  without manual sourcing for every single entry. Options to evaluate:
  - **Open Library Covers API** (free, no key, `covers.openlibrary.org`) —
    keyed by ISBN/OLID, spotty for less mainstream titles.
  - **Google Books API** (free, needs an API key for volume) — better
    hit rate, includes ISBN lookup by title+author.
  - Manual: download and commit cover images under `public/` per book
    as they're added — most reliable, zero API dependency, but fully
    manual per entry (matches the site's existing "everything is a
    git-committed file" philosophy, at the cost of doing it by hand).

## Where this leaves things

Not started. No code changed for this. When picked back up, the first
real decision is A vs. B vs. staying on the CSS box — and that decision
should probably be informed by actually finding a few real, striking
cover images to test path A/fallback against, since a mediocre source
image will make even a perfect renderer look flat.
