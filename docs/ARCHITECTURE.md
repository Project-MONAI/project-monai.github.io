# MONAI Website Architecture

> Reviewed 2026-06-10 (full parallel audit + three-lens framework evaluation). This doc describes
> what the architecture **is**, why it stays on **Astro**, what was simplified, and what's worth
> doing next. Direction/design decisions live in `DESIGN.md`; component recipes in
> `STYLEGUIDE.md`; analytics operations in `ANALYTICS.md`.

## What this site is

A **static Astro 5 site** deployed to GitHub Pages at `https://project-monai.github.io`
(canonical URL is a hard constraint: no hosting migration, no vendor subdomains).

```
src/pages/*.astro          ~30 hand-written pages (HTML + Tailwind utilities)
src/layouts/BaseLayout     shell: BaseHead + Header + Footer + site scripts
src/components/            BaseHead (SEO/JSON-LD/GA4/agent-detect), Header, Footer
src/integrations/          md-twins.ts + llms-txt.ts  ← the crown jewels (see below)
src/styles/global.css      237 lines (was 748; purged 2026-06-10)
public/assets/js/          main.js, track.js (GA4 events), copy-buttons.js, particles.min.js
public/src/model-zoo-vue.js  the Model Zoo SPA (CDN UMD Vue 3 + vue-router, hash routing)
public/model_data.json     model catalog (refreshed by `npm run fetch-models` pre-build)
scripts/                   visual-snapshot/diff tooling (puppeteer), model-data generator
tests/                     vitest: agent-detect + md-twins (runs in CI since 2026-06-10)
```

**Load-bearing invariants** now live in `AGENTS.md` ("Load-bearing invariants"), so coding
agents see them on first contact: the `.html` URL format, integration ordering, the frozen
GA4/agent-detect bootstrap, the Tailwind glob for the Model Zoo, and the fetch-models fallback.

## Framework decision: stay on Astro (unanimous, high confidence)

Three independent evaluations (migration cost/risk, long-term maintainability, capability fit)
all concluded **stay-astro**. The short version:

1. **The site uses nothing SvelteKit differentiates on.** Zero SSR, zero stores, zero islands,
   zero `client:` directives, zero `.vue`/`.svelte` components in `src/`. It's hand-written
   pages plus inline scripts: Astro's exact home turf.
2. **Both hard constraints get worse under SvelteKit.** `.html`-suffixed routes are a one-line
   Astro config but fight SvelteKit's directory-oriented prerenderer (`core.html/+page.svelte`
   route names or post-build rename passes). And SvelteKit has no integration API, so md-twins /
   llms-txt would be rewritten as glob-based post-build scripts, losing the pages manifest. Full
   migration cost, zero capability gain, regression risk on the most valuable pipeline.
3. **Contributor fit.** Occasional medical-imaging OSS contributors can edit a `.astro` page like
   an HTML file. A framework swap raises the floor and resets DESIGN.md/STYLEGUIDE.md/AGENTS.md
   institutional knowledge for negative return.
4. The Model Zoo "Vue question" is orthogonal: it's a CDN SPA in a static shell, portable
   verbatim under any framework. It neither motivates nor blocks anything.

Eleventy / Next-static were considered lateral moves with the same `.html`/build-hook rewrites.
Revisit only if requirements change (e.g., real SSR needs, authenticated content).

## Simplifications applied (2026-06-10)

- **Removed the unused Vue integration**: `@astrojs/vue` + `vue` uninstalled, `vue()` dropped
  from `astro.config.mjs`. There were no `.vue` files; the Model Zoo (CDN UMD) is unaffected.
- **Fixed the Tailwind purge blind spot**: `./public/src/**/*.js` added to content globs.
  Before this, classes used only by the Model Zoo templates were silently purged (the featured
  cards were unstyled in production).
- **Dead weight deleted**: `countUp.min.js` (empty, unreferenced), `jsdom` + `@astrojs/check`
  devDeps, the never-queried `pages` content collection (`src/content/config.ts`).
- **global.css purged 748 → 237 lines**: pre-Astro-era orphan rules (dialog/drawer system,
  brand-angle decorations, section-heading images, etc.), each verified unreferenced first.
- **CI now runs `npm test` before build** (`.github/workflows/deploy.yml`), the only regression
  gate protecting the md-twins/agent-detect pipeline.
- `@tailwindcss/aspect-ratio` moved to devDependencies; `apps/auto3dseg` main/master URL
  mismatch fixed; STYLEGUIDE color roles corrected + de-duplicated against DESIGN.md.
- **Model Zoo re-skinned + instrumented** (light hero, forbidden blur-orbs/dot-grids removed,
  `zoo_search` / `zoo_filter` / `zoo_model_view` / `zoo_outbound` events; see ANALYTICS.md).

## Recommended next steps (not done; each needs a deliberate decision)

Ranked by value/effort:

1. **Replace Alpine.js with ~60 lines of vanilla JS**: its 4 usage points are simple
   toggle/tab/filter state. Removes an unpkg runtime dependency and a whole mental model.
   Touches Header (banner + dropdowns), getting-started tabs, tutorials filters → needs a
   careful pass + keyboard testing, not a sed.
2. **Pin/bundle the Model Zoo's Vue locally** (vendor the UMD files into `public/assets/js/`).
   Removes the unpkg availability dependency without any rewrite.
3. **Consolidate the 9 raw redirect stubs** (`apps/*`, `research/*`) into `astro.config.mjs`
   `redirects`: same meta-refresh output on GH Pages, 9 fewer files. Verify
   `format:'file'` filename parity first. (`start`/`started` keep their styled fallback pages.)
4. **Component extraction, conservatively**: `SectionHeader.astro` (~134 eyebrow+H2 call sites)
   and `CtaButton.astro` (~58 call sites, would centralize `data-track` attributes). Do after
   the v2 previews merge, not before.
5. **Harden `fetch-models`**: generate `model_data.json` in CI via `scripts/process_models.py`
   instead of curling prod.
6. Optional: convert `cite.mdx` → `.astro` and drop `@astrojs/mdx` (one page uses it).
