# Pack Platform — case study working notes

Source (old Nessa Labs agency site, Webflow staging): https://nessa-f86ef1.webflow.io/case-studies/pack-platform

Status: raw material only, not ready to use. Compiled 2026-08-30 for editing.

**Assets:** all 48 Pack-specific images downloaded and labeled in `assets/case-studies/pack/` (2026-08-30). High-res (2x, e.g. 3600x1850 hero, 1760x1200 dashboard shots) — sharp enough to eyedropper exact colors and rebuild layouts faithfully. **Confirmed: all dashboard/UI screenshots use Lorem Ipsum placeholder copy** — these are templated/demo states from Nessa's design work, not shipped-with-real-data screens. Fine for layout/interaction rebuild reference; don't treat any visible copy in the screenshots as real product content.

Agreed direction for the new case study narrative: center it on **"my design process and what was shipped"** — not a feature inventory. Funding figures ($6M/$3M discrepancy) are being cut entirely. The Cory Cummings quote is being **kept as-is for now** — reattribution wording to be edited later, not resolved yet.

**Primary focus (strongest design thinking, per Hum 2026-08-30):** the site builder/customizer (WYSIWYG, global components), the dashboard, and merchandising — these needed real rethinking and should anchor the narrative.
**Secondary, lighter coverage:** design system, mobile access — important but not the throughline.
**Interactive-rebuild candidate:** the dashboard — good fit for showing how the tool actually works (Cursor-style live interaction). Not being built now; revisit when we get to that case study's build phase.

---

## Problems with the raw version (per Hum, 2026-08-30)

1. **Too much copy, wrong voice.** Written from the agency's POV ("the team," "Nessa's design work"). Needs to shift to Hum's personal POV as the design director/lead designer who led the work — first person, not agency-speak.
2. **Wrong structure.** Currently reads as an agency capabilities showcase (What We Did / Outcomes / press quote / four feature sections). Needs a clearer narrative arc — closer to Patrick Morgan's case study approach: a clean Challenge → Approach → Solution shape. Not a copy of his structure, just the rough idea — a real narrative, not a feature dump.
3. Decide what to keep vs. cut — this raw version has a LOT of surface-level feature description. The new version should probably cut most of the four detailed feature sections (dashboard, merchandising, developer tools, customizer, mobile, design system) down to the 1-2 that actually demonstrate design judgment, not list everything Pack shipped.

## Facts worth keeping (verify accuracy before reusing)

- Pack = headless commerce platform for Shopify Plus brands, spun out of an agency background building custom commerce builds for DTC brands (Cuts, Vuori named).
- Nessa's engagement: agency-to-SaaS-platform transition — designing the product after Pack moved from bespoke agency builds to a productized platform.
- Stats cited on the old site (confirm before reuse — client-provided, may be dated):
  - 3 steps to connect Pack to a Shopify store
  - 40+ third-party app integrations
  - $6M seed round funding
  - 100ms route-to-route page load time
- CEO quote (Cory Cummings) crediting Nessa's design work — could be worth asking permission to reuse, or cut since it's agency-attributed, not Hum-attributed.
- Press: "Pack Raises $3m in Seed Funding" (TechCrunch) — note this figure ($3M) conflicts with the "$6M seed round" stat listed elsewhere on the same page. Flag and resolve before reuse.

## Raw content, as extracted from the live page (agency voice — needs full rewrite)

### Hero
**Pack** — "The New Standard in Headless Commerce"

### Overview
Headless commerce represents a technological advancement for high-growth merchants, enabling total frontend customization while decoupling from the platform and providing technology stack flexibility. Pack Commerce emerged from merchant frustrations after building custom commerce solutions for high-profile DTC brands including Cuts and Vuori. The team collaborated with Pack's product team to design an ultimate headless platform for Shopify Plus brands.

### What We Did
**Strategy:** Product Strategy, Discovery & User Research, Design QA
**Design:** User Experience Design, User Interface Design, Visual Web Design, Prototyping & Ideation, Design System

### Outcomes & Results
| Metric | Value |
|---|---|
| Steps to connect Pack to Shopify store | 3 |
| Third-party app integrations | 40+ |
| Seed round funding | $6M |
| Route-to-route page load time | 100ms |

### Press / quote
> "The new Pack platform gives brands and agencies powerful front-end tools to communicate with customers more easily. We're incredibly proud of Nessa's design work. Collaborating with their team allowed us to simplify the headless build process into a cutting edge software product designed for brand operators and developers."
> — Cory Cummings, CEO at Pack

Press release: "Pack Raises $3m in Seed Funding" (TechCrunch)

### Section 01 — From Agency to SaaS Platform
Pack emerged from its agency background building custom solutions for notable brands. After securing fresh funding, the team transitioned from service provider to SaaS product. The challenge involved designing an accessible platform for marketers, managers, and developers while shifting messaging from agency partner to tech platform.

The team conducted stakeholder interviews to understand merchant pain points across headless marketplace offerings. Feature sets were deduced to be pragmatic and simplified the product roadmap — prioritizing total merchant user experience over feature parity. A simplified onboarding flow was designed to guide all users through signup steps, enabling developers and marketers to get started quickly.

**Customize Everything** — The main dashboard displays vital storefront information including revenue numbers, traffic data, conversion rates, and overall site speed. Tabbed experiences allow merchants to view store data at a glance. The dashboard integrates with a multi-tabbed customizable navigation sidebar across multiple storefronts, ensuring information remains accessible.

**Product Merchandising Simplified** — Brands with headless builds commonly face primitive merchandising experiences. Competitors offered limited native product bundling and subscription options. The redesigned merchandising experience simplifies product catalog updates through intelligent grouping based on attribute collections. Merchants can painlessly create product bundles with rich metadata and build nearly infinite product group configurations, powering custom frontend experiences.

**Designed for Everyone, Built By Developers** — Modern headless builds often require wrangling multiple apps. The new experience strips down setup steps for developers to focus on building performant storefronts. Developers can plug into Git with custom API keys and build without opinionated workflows, accessing deploys and status logs for a master view of storefront builds. The new developer experience prioritizes ease of navigation, opinion-free setup, and quick entry for building.

### Section 02 — All New Site Customizer
Many WYSIWYG customizer tools offer barebones solutions. The team rethought the customizer experience from the ground up, focusing on enabling marketers to spin up landing pages and A/B test products while empowering operators to create unique brand experiences without developer involvement.

The new site customizer features rich capabilities centered on a sidebar UI that slides out showing a full site preview with real-time editing. Each component provides flexibility and easy accessibility across a growing UI library including banner slideshows, product carousels, video modules, and rich text editing.

**Global UI Components** — A large batch of custom components built into the site customizer provides total front-end flexibility. Merchants choose components and modify their storefront's look, feel, and functionality.

### Section 03 — Platform Access On The Go
Rather than creating a mobile-specific experience, the team prioritized features useful for merchants working remotely. Pack remains easily accessible for on-the-go store updates and product merchandising from mobile devices. Navigation is easily maneuvered with few finger taps.

### Section 04 — A Global Design System
As the Pack product grew more complex, designs needed to scale accordingly. A custom iconography library and fresh color scheme were designed with bold lifestyle assets and new UI components. Each component was carefully considered for use case, feature parity, flexibility, and extensibility across the platform. The global UI kit extends cohesively across all future touchpoints.

---

## Asset inventory (from live page, grouped by section)

All hosted on `cdn.prod.website-files.com/6284f50b95ff173d79dff367/...`, desktop (`-D`) and mobile (`-M`) pairs.

**Hero**
- `PCK-TOP-4@2x.webp` — hero interface shot
- `PCK-TOP-3@2x.webp` — hero interface shot (alternate)

**Press**
- Cory Cummings headshot

**Section 01 — Agency to SaaS**
- `2-D/M` — transition visual
- `3-D/M` — dashboard customization
- `4-D/M` — dashboard analytics view
- `5-D/M` — product merchandising interface
- `6-D/M` — product bundling feature
- `7-D/M` — collection building
- `8-D/M` — developer onboarding
- `9-D/M` — Git integration interface
- `10-D/M` — deploy status logs

**Section 02 — Site Customizer**
- `12-D/M` — customizer sidebar interface
- `13-D/M` — real-time page editing
- `14-D/M` — banner slideshow component
- `15-D/M` — product carousel component
- `16-D/M` — video module component
- `17-D/M` — rich text editing component

**Section 03 — Mobile**
- `18-D/M` — mobile platform navigation
- `19-D/M` — on-the-go store updates

**Section 04 — Design System**
- `20-D/M` — iconography
- `21-D/M` — color palette
- `22-D/M` — UI components library
- `23-D/M` — usage examples
- `Frame 1.webp` / `24-M` — design system framework overview

**Not pulled into this case study** (shown as related work on the page, not Pack assets): Stantt thumbnail, Inveterate thumbnail.

Full URLs available on request — not listed here to keep this file scannable; see raw WebFetch output from 2026-08-30 session if needed, or I can re-pull.

---

## Decisions (resolved 2026-08-30)

1. **Strongest work / narrative focus:** customizer (WYSIWYG, global components), dashboard, merchandising. Design system and mobile are secondary — mention, don't dwell.
2. **Quote:** keep as-is for now, reattribution wording to be edited later (not "Nessa's design work" long-term, but not rewritten yet).
3. **Funding figures:** cut entirely, not being used.
4. **Interactive rebuild:** yes, dashboard is the right candidate for a Cursor-style live-interaction treatment. Not being built yet — revisit when this case study reaches its build phase.

## Still open

- Exact final structure/section breakdown for the new copy (Challenge → Approach → Solution shape, scoped to customizer/dashboard/merchandising) — not yet drafted.
- Final wording for the reattributed quote.
