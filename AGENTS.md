# AGENTS.md: project-monai.github.io

This is the marketing/community website for the MONAI project. It is **not** the
MONAI framework code; that lives at `Project-MONAI/MONAI`.

## Stack

- Astro 5.x (static site)
- Tailwind 3.x
- Model Zoo: a self-contained Vue 3 SPA (CDN UMD + `public/src/model-zoo-vue.js`,
  hash routing). It is NOT an Astro island; `@astrojs/vue` was removed 2026-06-10.
- Deployed to GitHub Pages from `master` via `.github/workflows/deploy.yml`
- Vitest for unit tests

## Dev setup

```bash
npm install
npm run dev          # http://localhost:3000 + LAN IP
npm run build        # outputs dist/
npm test             # vitest unit tests
```

## Code conventions

- Pages live under `src/pages/`. Default to `.astro` for new pages. `.md`/`.mdx`
  is supported but the site's existing pages use `.astro` for layout consistency.
- Every page declares a `frontmatter` const with `title`, `description`,
  `canonical`. Optional: `audience` (array of `researcher` / `engineer` /
  `clinician` / `newcomer`), `schemaType` (`Course` / `Article` / `WebPage`),
  `metaRefresh` (for redirect-style pages).
- Site visual conventions live in `docs/STYLEGUIDE.md` (component recipes) and
  `docs/DESIGN.md` (design direction, color roles, migration checklist, decision
  log). Read both before changing visual design; log notable decisions in
  DESIGN.md's decision log.
- Tailwind classes only, no per-page CSS files.
- **Asset naming**: images live in category folders with kebab-case names:
  `public/assets/img/people/<first-last>.<ext>` (headshots),
  `public/assets/img/logos/<org>.<ext>` (partner/contributor logos),
  `public/assets/img/figures/<page-or-topic>-<name>.<ext>` (figures/diagrams),
  and brand marks in `public/assets/logo/`. No spaces or CamelCase in filenames.
- Follow the Writing voice rules in DESIGN.md for all user-facing copy and docs
  (no em dashes, no marketing AI-isms).
- Inline `<script>` must use `is:inline` to bypass Vite processing.
- **Analytics instrumentation** (event schema and GA4 setup: `docs/ANALYTICS.md`):
  when adding or editing a page, tag primary CTAs with
  `data-track="cta_click" data-track-cta-id="<page>_<slug>"
  data-track-cta-dest="<href>"`, and filter buttons with
  `data-track="filter_use"` + `data-track-filter-type/-value`.
  `public/assets/js/track.js` handles the rest; the footer markdown link
  (`md_twin_click`) ships site-wide automatically.

## Load-bearing invariants (do not break these)

- `build.format: 'file'` in `astro.config.mjs` emits `core.html`-style URLs. Internal
  hrefs are literal `*.html`, and the nav-active script and md-twins both parse `.html`
  filenames. The canonical URL must stay `https://project-monai.github.io` with `.html` paths.
- Integration order in `astro.config.mjs` matters: `mdTwins()` must be registered before
  `llmsTxt()` (llms-full.txt reads the twins md-twins emits).
- `src/integrations/llms-config.json` curates which pages concatenate into `llms-full.txt`.
- The agent-detect script inlined in `BaseHead.astro` must run before gtag; treat that
  bootstrap as frozen (it has unit tests).
- Tailwind's content globs must keep `./public/src/**/*.js`, or the Model Zoo's classes
  get purged from the compiled CSS.
- After editing `public/src/model-zoo-vue.js`: run `node --check` on it, and keep both
  branches of `:class` ternaries as complete literal class strings (Tailwind scans literals).
- `npm run build` first curls `model_data.json` from the live site (fallback:
  `model_data.sample.json`); keep that fallback file.

## Build expectations

`npm run build` must produce, in `dist/`:
- One `.html` per page in `src/pages/`
- One `.md` twin per page (via `src/integrations/md-twins.ts`)
- `llms.txt`, `llms-full.txt`, `sitemap-index.xml`, `sitemap-llms.xml`,
  `robots.txt`

If any of these are missing after a build, the integration is broken.

## Testing

Vitest unit tests live under `tests/`. Run with `npm test`.

Visual regression tooling (optional, manual):
- `npm run snapshot:current` captures dist screenshots with Puppeteer.
- `npm run diff` compares against `visual-baseline/` (gitignored).

## Pointers (doc map)

- `docs/DESIGN.md`: design direction, color roles, alignment rules, decision log (canonical for "why")
- `docs/STYLEGUIDE.md`: component-level class recipes
- `docs/ARCHITECTURE.md`: stack decision (stay on Astro), simplification history, next steps
- `docs/ANALYTICS.md`: GA4 operator guide (events, dimensions, dashboards)

## What NOT to do

- Don't add inline `<style>` blocks; use Tailwind utility classes.
- Don't add `<!-- #include -->` directives; that pattern was retired with the
  Astro migration. Use Astro components.
- Don't add new build scripts under `scripts/` without a clear reason; Astro
  integrations should handle most build-time work.
- Don't bump `astro` to a major version (currently 5.x) without verifying the
  ecosystem integrations (`@astrojs/tailwind`, `@astrojs/sitemap`, `@astrojs/mdx`)
  and the custom `astro:build:done` integrations are compatible.
- Don't re-add `@astrojs/vue`; nothing uses it (the Model Zoo is a CDN SPA).
