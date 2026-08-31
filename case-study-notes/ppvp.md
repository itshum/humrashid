# PPVP (Parri Passu Venture Partners) — case study working notes

Source (old Nessa Labs agency site, Webflow staging): https://nessa-f86ef1.webflow.io/case-studies/parri-passu-venture-partners

Status: raw material only, not ready to use. Compiled 2026-08-31 for editing.

**Assets:** all 54 images downloaded and labeled in `assets/case-studies/ppvp/` (also copied to `public/case-studies/ppvp/` for local preview). This case study has the most granular screen-by-screen asset trail of the three so far — genuinely a mobile app with a real screen flow (signup → onboarding → deal discovery → portfolio → deal detail), plus a separate admin panel.

---

## What this case study is about

PPVP is a niche venture fund investing in eCommerce/SaaS founders. Nessa designed a members-only mobile investing app giving PPVP's investors access to deal flow that's normally reserved for institutional players — plus an admin panel for the PPVP team to manage deals, investors, and content. Two clearly separable halves: the investor-facing app, and the internal admin tool.

## Facts worth keeping (verify before reuse)

- $10K average investor check size
- 5-star average app rating
- Quote from Julia Gudish Krieger (Managing Partner at PPVP) praising the research-driven design approach — short, could be reattributed like the other case studies' quotes
- Press mention: Axios Pro covered PPVP's approach to seeding early-stage commerce tech companies

## Scope of the work (paraphrased from the source, needs full rewrite for voice/structure)

**Investor-facing app:**
1. **Invite-only signup** — accredited-investor gating, Face ID, invite codes, LinkedIn import for a fast professional-profile start.
2. **Guided onboarding** — a short question flow to understand investor intent before showing them deals, so the app can personalize what surfaces first.
3. **Home / navigating opportunities** — the homepage balances "here's your portfolio" with "here's what's new" without dumping everything on one screen.
4. **Deal discovery** — a dedicated explore tab, separate from the homepage, for browsing exclusive deals.
5. **Portfolio tracking** — a tab summarizing every deal an investor has participated in, with performance data and updates.
6. **Deal detail pages** — the actual selling moment: opportunity summary, terms, pitch deck, memos, everything needed to decide, prioritizing legibility over cleverness.
7. **Extensible UI kit** — built so PPVP's team could keep shipping new features post-launch without redesigning from scratch.

**Admin panel:**
1. **Deal/content publishing** — a CMS-like view for the PPVP team to publish new deals and updates directly.
2. **Investor management** — profiles, investment history, invitation records, account status.
3. **Company/content management** — company profiles, bios, media assets kept easily updatable.
4. **Deal management** — the highest-stakes screen: pitch decks, pricing terms, closing dates, all editable via simple forms to reduce friction for non-technical staff.

## Open questions for Hum

1. This is the strongest candidate yet for the "real functioning UI rebuild" (Cursor-style interactive demo) given how granular the real screen flow is (invite → onboarding → discovery → deal detail is a genuine user journey, not just static dashboard views) — worth reconsidering priority order between Pack's dashboard and this one for that treatment?
2. Same recurring question: which 2-3 of these seven-plus app areas (plus admin panel, a whole second surface) actually show your strongest thinking? This case study has arguably too much raw material to use all of it.
3. Keep/cut/reattribute the Julia Gudish Krieger quote — same treatment as the others, or different since it's unprompted praise of the research process specifically (could tie well into an Approach section)?
4. Admin panel — full section, brief mention, or cut entirely? It's real work but may be less visually compelling than the investor-facing app for a portfolio audience.
