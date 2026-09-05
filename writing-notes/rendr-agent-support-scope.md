# Scope: agent-drivable rendr (not started — future work)

Saved 2026-09-06 at the user's request ("scope this out and save it for
future scope, don't build now"). Goal: let a user's own coding agent
(Claude Code, or any other agent) drive rendr programmatically — upload
an image, apply a preset, get a rendered file back — quickly, without a
human clicking through the UI.

## The real constraint

rendr today is 100% client-side: a static Astro page, Canvas 2D
rendering, no backend, no API. That's the right call for the
interactive tool (privacy: nothing leaves the browser), but it means
"agent talks to rendr" has no obvious entry point yet — there's no
process an agent can call into. Every option below is really a
decision about *where* the actual rendering executes.

## Options considered

**A. Headless-browser automation of the existing UI** (Playwright driving
the real page: synthetic upload, click swatches/scrubs, click Download,
intercept the blob). Zero new code path — reuses everything as-is.
Fragile (breaks on any DOM/selector change), slow (full browser boot +
page load), and it's scraping a UI rather than a real interface. Only
worth it as a stopgap if agent demand shows up before anything else is
built.

**B. Extract the core render pipeline into a DOM-independent module.**
The whole `render()` function plus the gradient/texture/preset logic is
already written against the plain Canvas 2D API — it's not tightly
coupled to the DOM beyond `HTMLCanvasElement`/`HTMLImageElement`. A
Node-compatible canvas library (`@napi-rs/canvas` is the actively
maintained option; `node-canvas` is the older one) implements a
close-enough Canvas 2D surface that this logic could run BOTH in the
browser (current UI, unchanged) and in Node (a CLI or serverless
function) from one shared source file. This is the real unlock — every
other agent-facing interface (CLI, HTTP endpoint, MCP tool) becomes
cheap once this exists, since they'd all just be thin wrappers calling
the same function. This is the piece actually worth investing in first.

**C. A small HTTP endpoint (serverless function) wrapping B.** Since
the site itself stays static (GitHub Pages), this means new
infrastructure — a Cloudflare Worker or similar, hosted separately from
the static site, exposing something like `POST /render` with
`{ imageUrl | imageBase64, background, frame, size, padding, radius,
shadow, texture, exportFormat, exportScale }` → returns the rendered
file. This is the natural interface for a *remote* agent to call, but
introduces real hosting/cost/abuse-surface decisions (arbitrary image
processing from strangers) that don't exist for the tool today.

**D. An MCP tool / Claude Skill wrapping B or C.** For "the user's own
agent" specifically (Claude Code, in a terminal, on their machine) this
is probably the actual right shape — a tool the agent can call directly
with the same preset schema, running B locally (no hosting needed at
all if the agent has Node) rather than routing through a hosted
endpoint. This is the one that best matches how the user phrased the
ask.

## Recommended phased path (when this gets picked up)

1. **Preset schema first, regardless of transport.** Define the JSON
   shape once — it's the actual contract every option above depends on.
   Maps directly onto today's `state` object: `background` (type +
   value), `container`, `size` (or literal w/h), `padding`, `radius`,
   `shadow`, `texture` + `textureSize`, `zoom`, `exportFormat`,
   `exportScale`. Version it from day one (`schemaVersion: 1`) since
   this will change.
2. **Extract the render core (Option B)** into a plain `.ts` module with
   no DOM imports beyond what a Node canvas lib can satisfy — this is
   the real engineering lift, and everything downstream is thin
   wrappers once it's done. Verify pixel-identical output between the
   browser path and the Node path before trusting it for anything.
3. **Ship the cheapest agent-facing wrapper that satisfies real demand** —
   most likely D (a local MCP tool / CLI a coding agent can shell out
   to), since C's hosting/abuse surface isn't worth taking on until
   there's evidence people actually want a *remote* API rather than a
   local one.
4. Option A (browser automation) only if agent demand shows up before
   any of the above is built and a stopgap is genuinely needed — treat
   it as throwaway, not a foundation.

## Not yet decided (revisit when this gets picked up)

- Whether the interactive tool's own "Auto" gradient (color-extracted
  from the uploaded image) is deterministic enough to expose as part of
  the preset contract, or whether agent use should require an explicit
  gradient/color choice instead.
- Rate limiting / abuse handling, only relevant if Option C ever ships.
