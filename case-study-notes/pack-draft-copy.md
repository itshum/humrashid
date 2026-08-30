# Pack — draft copy (v2)

Written 2026-08-30, updated 2026-08-30 with resolved decisions. Challenge → Approach → Solution structure, matches the `/concept-case-study-pack` layout skeleton. One blank remains — search for `[CONFIRM: ...]`.

---

## Context
- **Company:** Pack
- **Role:** Lead Designer & Design Director, Nessa Labs
- **Timeframe:** `[CONFIRM: exact dates — inferred ~2022 from asset metadata, not verified]`
- **Team:** 4 people at Nessa. Worked directly with Pack's CTO, CEO, Head of Product, and engineers, plus merchant customers for research conversations.

## Hero / summary line
Turning an agency's custom commerce builds into a real product, without losing what made those builds good.

## Challenge

Pack started as an agency, building fully custom headless commerce sites for brands like Cuts and Vuori. That work was good precisely because it was custom: a small team hand-building one storefront at a time, solving each brand's problems directly.

After closing their seed round, Pack needed to become a product. The same team, the same expertise, but now serving hundreds of merchants instead of a handful of clients. That's a different design problem than it sounds like. The tools that make one-off custom work great don't automatically make sense as something a stranger can pick up and use without you standing over their shoulder.

I led design on this transition, working directly with Pack's product and engineering team, including CEO Cory Cummings, to figure out what "productized" actually meant here.

## Approach

We started with interviews, not screens. My team and I talked to merchants who'd tried other headless platforms to find out where they actually got stuck, not where we assumed they would. A few patterns showed up fast: onboarding took too long, merchandising tools were an afterthought bolted onto commerce infrastructure, and every customizer we looked at asked marketers to think like developers.

That research shaped a hard call early on: build less, but build it right. Rather than chase feature parity with every competitor, we prioritized the handful of workflows that would make or break someone's first week on the platform. Everything else could come later.

From there it was the usual rhythm of a small, fast-moving design team: sketches into clickable prototypes, testing rough ideas with Pack's team before committing engineering time, then refining.

## Solution

### 01 — The site customizer
Most WYSIWYG site builders make you choose between flexibility and simplicity, usually failing at both. We rebuilt the customizer around a sidebar that slides out over a live preview of the actual storefront, so a marketer edits the real page, not an abstraction of it. Every component (banners, product carousels, video modules, rich text) was built to the same global system, so swapping one out never breaks the page around it.

The goal was letting a marketer launch a new landing page or run an A/B test without pulling in a developer. That's the actual measure of whether a customizer works.

### 02 — The dashboard
Store owners needed one place to understand how their storefront was actually performing: revenue, traffic, conversion, site speed. Rather than a wall of charts, we organized the dashboard around what a merchant would want to check on a given day, with a sidebar that carries across multiple storefronts so managing more than one store never feels like starting over.

### 03 — Merchandising
Headless builds have a reputation for clunky merchandising, mostly because commerce infrastructure and merchandising tools get designed separately and bolted together. We redesigned this so merchants could build product bundles and collections through intelligent, attribute-based grouping instead of manual, one-by-one setup. It's a small change with a big effect: what used to take a spreadsheet and a developer now takes a few clicks.

### 04 — Developer experience
Modern headless builds mean wrangling a pile of apps. We stripped the setup down so developers could plug into Git with their own API keys and start building without an opinionated workflow forced on them, with real visibility into deploys and status instead of a black box.

### Also shipped
We also shipped a global design system (custom iconography, a full component library) so Pack's design and engineering teams could keep building consistently after we handed off, and made sure the core merchant workflows (checking on a store, updating a product) worked properly on mobile, since a lot of that work happens on the go, not at a desk.

## Outcome

Qualitative, focused on how merchants and Pack's own team received the redesign (not funding/metrics). `[CONFIRM: exact copy — you said you'll work on this one directly]`

---

## Notes on this draft

- Quote (Cory Cummings) intentionally left out of the flowing copy — kept as-is for now per your call, reattribute later. Slot it in wherever reads best.
- Cut per your call: funding figures, "What We Did" service-tag list, "What I'd do differently" section.
- Restored per your call: developer experience / Git integration is back in as Solution section 04 (was cut in v1, you flagged that was wrong since dev experience mattered based on earlier conversations).
- Tone check against your voice profile: short paragraphs, leads with the point, no em dashes, avoided "seamless/leverage/robust/elevate" etc. Let me know what's off and I'll fix it plus update your writing profile.
