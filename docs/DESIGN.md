# MONAI Website Design Guide

> **Living document.** This guide records the design *direction and decisions* as we roll the new
> homepage look out to the rest of the site. `STYLEGUIDE.md` is the component-level reference
> (copy-paste class recipes); this file is the *why*, the canonical patterns, and the migration
> checklist. When a decision changes, update this file and add a dated entry to the Decision Log.

---

## North star

**Light, lively, credible.** The energy of the original MONAI site (teal particle network, bright
teal brand color, full-color partner logos) combined with the rigor of the revamp (WCAG AA,
reduced-motion support, performance, LLM enablement, component consistency).

- Light, airy surfaces everywhere: **no dark section heroes** (the dark interior heroes are legacy
  and are being migrated).
- Bright teal `#00C0B5` stays the dominant brand color, used correctly (see Color roles).
- Content is the design: typography-led, restrained decoration. The homepage particle field is the
  one ambient flourish.
- Accessibility is non-negotiable: we found accessible ways to keep the bright branding rather than
  darkening the brand.

## Audiences and brand personality

(Merged from the original design brief, 2026-06-10. The brief's "dark hero" guidance is
superseded by the light direction; everything below still holds.)

Three overlapping audiences, served in this order:
1. **Academic medical-imaging researchers** evaluating MONAI for papers, grants, and challenges.
   They arrive skeptical, scanning for rigor, reproducibility, and citable credibility.
2. **Enterprise and clinical engineers** deploying MONAI into production pipelines. They need to
   trust the project's stability and governance before recommending it.
3. **Data scientists newer to medical imaging** looking for a way in: tutorials, Model Zoo,
   first inference.

Credibility reassures the first two before approachability invites the third.

Brand personality: **open, collaborative, foundational.** MONAI reads like a *project* website
(PyTorch, Hugging Face, Linux Foundation), not a *product* website; community, governance, and
contributors are first-class content. Emotional targets in priority order: trust, clarity,
belonging. Not: excitement, urgency, delight. Anti-references: startup landing pages, SaaS
product marketing, anything that looks generated from a template.

Five standing principles: credibility before charm; content is the design; restraint over
intensity; community is visible; accessibility is non-negotiable (WCAG AA minimum,
reduced motion respected, keyboard navigable, no information by color alone; the deploy
pipeline legend pairs color with a text legend for this reason).

## Writing voice

Copy and docs are written in plain, concrete sentences. No em dashes anywhere; use periods,
commas, colons, or parentheses instead. Banned phrasing: seamless, leverage, empower, unlock,
elevate, supercharge, streamline, harness, delve, cutting-edge, "transforming healthcare",
"accelerate your journey", "Whether you're X or Y", trailing ", ensuring/enabling X" tails,
and "not just X, but Y". Say what the thing does in the reader's terms. If a sentence could
appear on any product's website, cut it.

## Color roles (Scheme A: "bright teal + dark text")

| Token | Hex | Role | Contrast on white |
|---|---|---|---|
| `brand-primary` | `#00C0B5` | **Fill only.** CTA buttons (with `text-gray-900`, 7.5:1), icon chips (`/10`–`/15` tints), particle dots, card accent bars. **Never** as text on light backgrounds. | 2.3:1 as text ✗ |
| `brand-teal` | `#007E76` | Small teal **text** on light: section eyebrows, inline arrow links, link hover states. | 4.9:1 ✓ AA |
| `brand-accent` | `#009C94` | Large teal **text** on light: headline accent spans, stat `+` glyphs. Also the CTA **hover** fill (4.9:1 with `text-gray-900`). | 3.4:1 ✓ large only |
| `brand-secondary` | `#3E5CAD` | Indigo partner color: the "Train / Core" category accent. | 6.3:1 ✓ AAA |
| `brand-dark` | `#046483` | Deep teal: the "Deploy" category accent and link-hover target. **Not** a major CTA color (decided 2026-06). | ~6.6:1 ✓ |
| `brand` | `#05789e` | Particle link lines; legacy base blue. | n/a |
| `brand-light` | `#e6f3f7` | Hero gradient wash (`via-brand-light/40`). | n/a |
| `surface-dark` | `#0B1120` | **Components only** (terminal/code cards), never section backgrounds going forward. | n/a |

**Product category coding is for navigation contexts only** (decided 2026-06-10): the homepage
ecosystem cards and hero quick links, where the three products
sit side by side and the colors tell them apart (Label = `brand-primary`, Core =
`brand-secondary`, Deploy = `brand-dark` on their accent bars, icon chips, and labels).
**Inside a product page, everything uses the light teal family**: hero accent span =
`brand-accent`, icon chips = `bg-brand-primary/10` with `text-brand-primary` icons, bullet dots =
`bg-brand-primary`, step-number text = `text-brand-teal`. Inline text links stay uniform
`brand-teal` everywhere, because links must be recognizable by one consistent color.

## Canonical homepage patterns

These are the patterns to propagate to interior pages (see the migration checklist).

1. **Light hero, centered** (homepage): `bg-gradient-to-br from-white via-brand-light/40 to-white`,
   centered `text-gray-900` headline with one `text-brand-accent` accent span, centered
   `text-gray-600` subtitle and CTA row. **No terminal card on the homepage** (decided 2026-06-10:
   terminals live on the product-page heroes, which are left-aligned two-column). No page logo in
   the hero (the header already shows it).
2. **Particles are homepage-only**: vendored `particles.min.js`, teal dots / `#05789e` lines, no
   interactivity, init gated behind `prefers-reduced-motion` and deferred via `requestIdleCallback`.
   A radial white scrim (strong at center, fading outward) keeps the centered text legible while
   particles stay lively at the edges.
3. **Dark terminal/code card** (component, not a section): `bg-surface-dark rounded-2xl` with
   JetBrains Mono, keywords `text-brand-primary`, strings/numbers `text-teal-300`. Hero terminal
   cards appear on the four product pages (core, label, deploy, model-zoo) without copy buttons;
   interior code blocks keep the standard `.copy-button` pattern.
4. **Credibility band**: gray-50 strip after the hero; stats in `text-gray-900` with
   `brand-accent` `+`. Stats are **plain text, not links** (decided 2026-06-09: no good link
   targets; revisit only if a stats/methodology page exists).
5. **Section rhythm**: strictly alternate `bg-white` / `bg-gray-50`. Never two same-tone sections
   adjacent. Partner/contributor logos: **full color at full opacity, always**. No grayscale
   filters, no opacity dimming (decided 2026-06-09).
6. **Eyebrow → H2 → lede**: `text-brand-teal` uppercase eyebrow, `text-gray-900` H2,
   `text-gray-600` lede. On the homepage: hero, stats band, and Why MONAI are **centered**
   (decided 2026-06-10); Ecosystem, Community, and Success Stories stay left; Contributors is
   centered. Interior pages follow "Layout: alignment by role".
7. **CTAs**: primary = `bg-brand-primary text-gray-900 hover:bg-brand-accent`; secondary = white
   with gray border, hover hints teal. Arrow icon nudges `translate-x-0.5` on hover.
8. **Motion**: `animate-slide-up` for hero entrance, `reveal`/`reveal-stagger` for scroll entry,
   everything honors `prefers-reduced-motion`. No other animation.

## Page-type patterns

- **Product page** (core / label / deploy): light hero with teal
  eyebrow ("MONAI X · Verb"), one `brand-accent` accent span, primary CTA + Docs + GitHub, and a
  dark quick-start terminal card aside (`pip install <pkg>` + 2–4 real API lines). Then strict
  white/gray-50 alternation: capabilities cards → quick start steps → product-specific deep dive →
  citation (bibtex card) → community links. All accents in the light teal family (see "Product
  category coding" above; per-product colors were dropped from page internals 2026-06-10). Card
  grids span the full container; nested grids must not inherit a text-width cap.
- **Story listing page** (successstories): tight centered hero (no badges, no unsourced stats)
  with a context-rich lede, one featured story card (image right, text left, homepage pattern),
  then a 2-column grid of uniform compact story cards: logo row + tag chip, title, 2-line
  summary, a "Key Achievement" teal-eyebrow line, whole card clickable. One CTA at the end.
- **Case-study article extras** (piloted on mayo-case-study 2026-06-10): an "At a glance" band
  directly under the hero, REPLACING any metric band (one band, not two): open dl, centered
  eyebrow, 4-5 centered columns (Institution / Domain / MONAI components as category-color chips
  linking to product pages / Scale, holding any honest headline number / Integration standards);
  no card wrapper. Plus numbered figure cards with one consistent recipe, and a "More success
  stories" strip after the closing CTA. A key-result callout (stat-band style) is used only when
  the story has an honest standout number.
- **Long-form article** (case studies): light hero with full-color partner logos, metric band
  (`text-gray-900` numbers, `brand-accent` `+`), `brand-teal` eyebrows per section, figures keep
  captions (dark frames behind screenshots are fine), closing CTA section in the page's
  alternation color.
- **Working-group template**: light hero with H1 split `<span class="text-brand-accent">WG Name</span>
  <br><span class="text-gray-900">Working Group</span>`, `brand-teal` mission eyebrow,
  `text-gray-600` mission text; then Get Involved / Initiatives / Group Leads (role lines
  `text-brand-teal`) alternating white/gray-50.

## Analytics instrumentation (applies to every page touched)

`public/assets/js/track.js` (loaded site-wide from BaseLayout) converts `data-track` /
`data-track-*` attributes into GA4 events; `window.track(name, params)` is the imperative escape
hatch. Event schema + GA4 dashboard checklist live in `ANALYTICS.md`. When building or
editing a page:

- [ ] Primary CTAs: `data-track="cta_click" data-track-cta-id="<page>_<slug>" data-track-cta-dest="<href>"`
- [ ] Filter buttons: `data-track="filter_use" data-track-filter-type="…" data-track-filter-value="…"`
- [ ] The footer "View this page as Markdown" link ships site-wide via Footer.astro
      (`md_twin_click`); no per-page work needed.

## Layout: alignment by role (v3, "lean centered")

Centered is the default; left survives only where there is a real left/right composition
(decided 2026-06-10, supersedes the earlier left-default):

- **Centered**: any section whose content is symmetric: card grids (any column count), story
  stacks, person/logo walls, stat bands, step stacks, citations, browse/filter tools, closing
  CTAs. The header block is `text-center max-w-3xl mx-auto`; **card grids stay full container
  width** (no caps, no mx-auto on the grid); step stacks/citations keep `max-w-4xl mx-auto`.
  Every trailing link/button inside a centered section is centered too.
- **Centered heroes**: text-only heroes (homepage, tutorials, working groups, case studies).
- **Left**: heroes with a right-side artifact (the product/zoo terminal cards), genuine 2-col
  text-beside-media splits (core quick start, label active learning, about hero with image),
  and flowing long-form prose sections (case-study narrative, the HAI how-we-work doc).
- Card/list body text stays left inside cards; person avatar cards keep internal centering.

## Layout: grid widths in left-aligned sections

In a left-aligned section (header at `max-w-3xl`, no `text-center`), the **card grid spans the
full container**: no `max-w-*` cap, no `mx-auto`. Every card section then shares the same left
edge (with its header) and the same right edge (the container), and cards stretch to equal
columns. Width caps on card grids are a leftover from the old centered design; a capped grid
next to a full one creates mismatched right edges (found and fixed on the product v2 pages,
2026-06-10).

Caps remain correct for **text**, where they control line length: section intros (`max-w-3xl`),
step lists and bibtex/code blocks (`max-w-4xl`), the homepage numbered list (`max-w-6xl`).
Centered sections (a `text-center` header, e.g. closing CTAs or the Contributors wall) may keep
a centered, capped grid; centered header + centered grid is internally consistent.

## Page migration checklist (dark → light interior pages)

When converting an interior page (core, label, deploy, tutorials, WGs, …):

1. Hero `bg-surface-dark` → light hero pattern (#1 above). **No particles** on interior pages.
2. Hero text: `text-white` → `text-gray-900`; `text-gray-300` → `text-gray-600`;
   `text-brand-primary` accents → `text-brand-accent` (large) or `text-brand-teal` (small).
3. Badges/tags on dark (`bg-white/5 border-white/10`) → light equivalents
   (`bg-brand-primary/10 text-brand-teal border-brand-primary/20`).
4. Secondary CTAs on dark (`bg-white/5 text-white`) → white outline style.
5. Any remaining dark *sections* (not code blocks) → white/gray-50 per the rhythm rule.
6. Check section alternation across the whole page after the change.
7. Keep: BaseHead metadata, audience frontmatter, md-twins, reveal classes, skip links.
8. Verify AA contrast on anything recolored; spot-check at 375 / 768 / 1280 px.
9. `npm run build`: confirm the page and LLM artifacts still generate.

## What we keep from the revamp (do not regress)

- Atkinson Hyperlegible (400/700 only) + JetBrains Mono.
- LLM enablement: `llms.txt`, `llms-full.txt`, `sitemap-llms.xml`, md twins, agent detection,
  JSON-LD in `BaseHead.astro`.
- A11y: skip links, focus-visible styles, reduced-motion gating, semantic headings, alt text.
- STYLEGUIDE forbidden list: no gradient text, no blur orbs, no glow effects, no dot-grid heroes.

## Decision log

- **2026-06-11:** **Markdown twins hardened**: dev server now converts twins on the fly (same
  converter as the build), so `/core.md` works in `astro dev`; the Model Zoo page renders a
  static 42-model catalog inside `#app` at build time (Vue replaces it on mount), giving its
  twin a real body. `llms-full.txt` expanded from 6 to 12 curated pages (~89KB) including the
  zoo catalog and both case studies; `llms.txt` now lists the case studies. Excluded from
  llms-full: the 11 `wg_*` detail pages (reachable via sitemap-llms), redirects, and 404.

- **2026-06-10:** **Asset naming normalized**: 69 images moved into `img/people/`, `img/logos/`,
  `img/figures/` with kebab-case names; brand marks consolidated into `assets/logo/` (og:image
  now `assets/logo/MONAI-logo_color-large.png`); duplicate Erdal headshot deduped; the
  space-named active-learning figure renamed. Zero broken references after rebuild.

- **2026-06-10:** Zoo Spotlight links fixed (featured ids now match `model_data.json` keys;
  Auto3DSeg links out to its GitHub pipeline since it is not a Zoo bundle). At-a-glance band
  rolled out to mayo-siemens (Core + Deploy verified in its text) with a more-stories strip.
  Deploy pipeline: arrows added between stations 4-7 and a labeled "MAP handoff" down-arrow
  connects the build row to the run row.

- **2026-06-10:** **Case-study extras piloted on mayo-case-study** (at-a-glance card with
  verified Core + Deploy chips, more-stories strip; callout skipped there for lack of an honest
  number). **Success Stories page rebuilt**: hero badge and unsourced stats removed, lede
  expanded, five full-width cards replaced by one featured card + a compact 2x2 grid (page
  height roughly halved).

- **2026-06-10:** **Alignment v4**: every section header is now centered site-wide; left remains
  only for product/zoo heroes (terminal composition) and body text inside cards/prose columns
  (prose columns are themselves centered via mx-auto). Applied to core Quick Start + Auto3DSeg,
  label Active Learning, both Mayo case studies' prose sections, the HAI how-we-work doc
  (class-only), and working-groups "All Working Groups".
- **2026-06-10:** **Deploy pipeline legend restored** (from the original enterprise-features
  diagram, recolored to palette): teal = MONAI artifacts (stations 1, 3), indigo
  `brand-secondary` = MONAI Deploy subsystems (2, 5, 6, and the deep-dive trio icons), gray =
  third-party systems (4, 7). This is a sanctioned **color-as-information exception** to the
  teal-only product-page rule: a legend defines the meaning, so categorical color is data, not
  decoration. Section title shortened to "From trained model to PACS"; lede removed (the legend
  replaces it). Mayo-Siemens marketplace figure merged into its User Workflow section;
  downstream backgrounds re-alternated.

- **2026-06-10:** **Alignment v3, "lean centered"**: centered becomes the default for symmetric
  sections and text-only heroes site-wide (homepage Ecosystem/Connect/Impact, all product-page
  card sections, WG heroes + section headers, tutorials hero, about board sections, case-study
  card sections). Left survives only for real left/right compositions and long-form prose.

- **2026-06-10:** **Homepage simplified and partially centered**: hero terminal card removed
  (terminals belong on the product pages, which each carry their own), hero/stats/Why MONAI
  centered, radial legibility scrim replaces the directional one. Site-wide revalidation pass
  completed: WG pages design-only (zero copy changes per WG ownership), heading-accent and
  alignment fixes across content and product pages, hero Documentation CTAs gained cta_click
  tracking, deploy platform grids uncapped, start/started stubs re-skinned light.

- **2026-06-10:** **Working Groups promoted to the top-level nav** (between Docs and Community);
  removed from the Community dropdown; `wg_*` pages now highlight the Working Groups nav item.
  **Model Zoo hero converted to the product-page recipe**: single lede + dark `monai.bundle`
  download/load code card replacing the old illustration and three-paragraph copy. Full-headline
  accent violations fixed on working-groups and both Mayo case studies (accent marks one phrase,
  never the whole headline).
- **2026-06-10:** **getting-started page removed entirely**, along with the header "Get Started"
  chip. Each product page now carries its own quick start, which made the standalone page
  redundant. Hero and tutorials "Get Started" CTAs point to `core.html#quick-start`; the legacy
  `/start.html` and `/started.html` redirects now target the homepage; `getting-started` dropped
  from `llms-config.json` and `llms.txt`. The `install_tab` analytics event is retired.

- **2026-06-10:** **All five v2 previews merged over their originals** (core, label, deploy,
  getting-started, about); preview files and badges deleted. The whole site now runs the light
  design. Preview-page workflow (`<page>-v2` + badge, compare, merge) remains the process for
  future redesigns.

- **2026-06-10:** **Alignment-by-role adopted** (see "Layout: alignment by role"): quick-start
  stacks and citations centered on core/label/deploy v2; Model Zoo Featured + Browse centered;
  getting-started-v2 resources section moved to left + full-width grid. **Color-coding scoped
  down further**: homepage Community & Support, the header Community dropdown, and all broad
  resource sections now use uniform light-teal chips; category colors survive only where the
  three products are presented side by side. **Header Docs is now a dropdown** (Core / Label /
  Deploy docs: three separate documentation sites); footer Resources lists all three.
- **2026-06-10:** **Product-page internals unified to the light teal family** (user preference:
  "land on the lighter color"). core-v2's indigo and deploy-v2's deep-teal hero accents and icon
  chips converted to `brand-accent` / `brand-primary` / `brand-teal`. Category colors remain only
  in side-by-side navigation contexts. Also: full-width card-grid rule applied (caps removed from
  8 grids + 1 nested resources grid), label-v2 resources columns set to `items-start`.

- **2026-06-10:** **Site copy and docs de-AI-ified**: em dashes and marketing phrasing removed; the Writing voice section is now binding.
- **2026-06-10:** **Framework decision: stay on Astro** (unanimous three-lens evaluation; see
  ARCHITECTURE.md). Safe simplifications applied: unused `@astrojs/vue`+`vue` removed, Tailwind
  now scans `public/src/**/*.js` (fixes silently-purged Model Zoo styles in prod), global.css
  purged 748→237 lines, dead deps/files deleted, CI test gate added.
- **2026-06-10:** **Model Zoo re-skinned to the light design** (in place, in the Vue SPA at
  `public/src/model-zoo-vue.js`): light hero, forbidden blur-orbs/dot-grids removed, featured
  cards on gray-50, brand-teal links, primary-CTA recipe on download buttons. Instrumented with
  `zoo_search` / `zoo_filter` / `zoo_model_view` / `zoo_outbound`.
- **2026-06-10:** **ANALYTICS.md created** as the canonical GA4 operator guide (dimensions,
  toggles, key events, MP secret, Explorations, verification).
- **2026-06-09:** **Site-wide light rollout executed.** v2 previews live for core / label /
  deploy / getting-started / about (`/<page>-v2` alongside originals). Direct re-skins applied to
  tutorials, successstories, both Mayo case studies, 404, working-groups + 11 `wg_*` pages.
  `.link-hover` utility fixed to `text-brand-teal` (was an AA failure on light). Untouched:
  model-zoo (Vue SPA), cite, redirects.
- **2026-06-09:** **Analytics event layer shipped**: `track.js` delegated `data-track` listener,
  `copy_code` hook in copy-buttons.js, events `cta_click` / `install_tab` / `copy_code` /
  `filter_use` / `md_twin_click`. GA4 operator checklist in ANALYTICS.md.
- **2026-06-09:** Homepage v2 **merged into `index.astro`** with final tweaks: code card has no
  copy button and uses `resnet50` as the example model; quick-link cards stay compact
  (`max-w-3xl`); stats are plain text (no links); contributor logos full color at full opacity.
- **2026-06-09:** v2 homepage proposal (`/index-v2`): hero quick-start terminal card; particle
  legibility scrim; pipeline arrows between ecosystem cards; uniform `brand-teal` inline links;
  `hover:bg-brand-accent` on primary CTAs; Contributors section moved to white to fix the
  gray-50/gray-50 rhythm break; "shared conventions" copy duplication fixed.
- **2026-06-09:** **Scheme A adopted**: bright teal `#00C0B5` as fill with near-black text;
  new tokens `brand-teal #007E76` (small text) and `brand-accent #009C94` (large headings).
  `brand-dark` rejected as the major CTA color.
- **2026-06:** Hero MONAI logo removed (duplicated the header logo on load).
- **2026-06:** Mayo featured story uses the real Figure 3 viewer image, not a generic graphic.
- **2026-06:** Stats updated to 9.5M+ installs / 5K+ publications.
- **2026-06:** Light re-skin direction set: no dark heroes, particles back (homepage only,
  reduced-motion gated), full-color partner logos, light footer. Copy/structure kept from revamp.

## Open questions

- Particle palette: currently teal dots + blue lines; a teal + indigo two-tone was floated.
- model-zoo Vue SPA re-skin (separate effort; the Astro shell is 16 lines, the styling lives in
  the Vue app).
- Server-side `.md`/`llms.txt` analytics: shelved. A CDN/worker in front of the site would
  require giving up the canonical `project-monai.github.io` URL, which is a hard constraint.
  Revisit only if hosting ever changes (see ANALYTICS.md §6 for what the GA4 side would need).
