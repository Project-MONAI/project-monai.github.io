# MONAI Website Styleguide

## Design Philosophy
**Credibility before charm. Content is the design.** Foundation-backed open-source project aesthetic (PyTorch / Hugging Face / Linux Foundation tier), not SaaS marketing. Restrained, confident, typography-led. **Light, airy surfaces**: a soft teal-tinted homepage hero carrying a subtle teal particle network, clean white/gray-50 content areas, full-colour partner logos, and consistent component patterns across all pages. Restrained, never decorative density. (Interior pages are migrating off the previous dark-hero treatment toward this lighter direction.) See `DESIGN.md` for full design context.

### Forbidden patterns (do not reintroduce)
- Gradient text (`bg-clip-text text-transparent` over a gradient); use solid colors
- Decorative blur orbs (`blur-[128px]` background elements)
- Dot-grid hero backgrounds
- Pulsing / glowing text shadows on stat numbers
- Gradient-animated card borders
- Drop-shadow glow effects on logos and cards
- Thick colored left-border stripes on callouts (`border-l-4` accent stripes)

### Allowed (intentional; do not strip in a cleanup pass)
- **Homepage hero particle network**: the vendored `particles.min.js` (Vincent Garreau, MIT), teal dots (`#00C0B5`) with low-opacity links, no hover/click interactivity, initialised only when `prefers-reduced-motion` is *not* set. Homepage hero only.
- **Full-colour partner / contributor logos**: opacity transition on hover; never `brightness-0 invert` to monochrome.
- **Teal-on-light contrast scheme**: bright `brand-primary #00C0B5` is a *fill* colour. CTA buttons use it with **near-black text** (`text-gray-900`, 7.5:1) site-wide; never white text on teal, never bright teal as small text on white. For teal **text** on light backgrounds use `brand-teal #007E76` (small labels/links, ~4.9:1) or `brand-accent #009C94` (large headings, ~3.4:1). Bright teal on dark interior heroes is fine as-is until those pages go light.

---

## Colors (from tailwind.config.js)

### Brand Colors
- **Primary**: `brand-primary` (#00C0B5) - Fill-only: CTA buttons (with near-black text), chips, accent bars, never as text
- **Teal**: `brand-teal` (#007E76) - Small teal text on light backgrounds
- **Accent**: `brand-accent` (#009C94) - Large heading accents and CTA hover
- **Secondary**: `brand-secondary` (#3E5CAD) - Indigo category accent (Core)
- **Dark**: `brand-dark` (#046483) - Deep teal category accent (Deploy)
- **Light**: `brand-light` (#e6f3f7) - Hero gradient wash

Full table with contrast ratios: see DESIGN.md → Color roles.

### Surface Colors
- **Dark**: `surface-dark` (#0B1120) - Hero/dark section backgrounds
- **Darker**: `surface-darker` (#060d1b)

### Neutral Colors
- White backgrounds for content sections
- `gray-50` for alternating section backgrounds
- `gray-100` / `gray-200` for card borders and subtle backgrounds
- `gray-300` for body text on dark backgrounds *(WCAG AA on `surface-dark`)*
- `gray-400` for **secondary** labels and metadata on dark backgrounds
- `gray-600` for body text on light backgrounds *(WCAG AA on white/gray-50)*
- `gray-500` for **secondary** labels and metadata on light backgrounds
- `gray-900` for headings on light backgrounds

---

## Typography

### Font Families
Single family across body and display. Hierarchy comes from **size, weight, and color**, not from font variation. This is intentional restraint matching the "content is the design" principle.

- **Display/Headings**: `font-display` = **Atkinson Hyperlegible** (bold, tracking-tight)
- **Body**: `font-body` = **Atkinson Hyperlegible** (regular)
- **Mono**: `font-mono` = **JetBrains Mono** (code blocks)

Both `font-display` and `font-body` resolve to Atkinson Hyperlegible. The two Tailwind aliases are kept for semantic clarity in templates; they no longer render visually distinct.

**Why Atkinson Hyperlegible:** designed by the Braille Institute for low-vision readers, with disambiguated letterforms (`g/q`, `1/l/I`, open apertures). The typeface itself embodies the "accessibility non-negotiable" principle. Foundation-backed, open-source (SIL OFL), free via Google Fonts. It is not on the 2024 AI-reflex-font list.

Weights used: **400 (regular)** and **700 (bold)** only. Avoid introducing other weights; they require re-downloading the font file and dilute the hierarchy.

### Heading Patterns
```html
<!-- Page hero title (on dark bg) -->
<!-- Use solid colors. Teal accent for a single emphasized noun or sub-line, never for the whole headline. -->
<h1 class="font-display text-4xl sm:text-5xl md:text-6xl font-bold text-white tracking-tight leading-[1.08] mb-8">
    Title Line One<br>
    <span class="text-brand-primary">Emphasized Phrase</span>
</h1>

<!-- Section title (on light bg) -->
<h2 class="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight mb-6">Section Title</h2>

<!-- Card title -->
<h3 class="text-lg font-bold text-gray-900 mb-2">Card Title</h3>
<!-- or larger card title -->
<h3 class="text-xl font-bold text-gray-900 mb-4">Card Title</h3>
```

### Section Label Pattern
Always use this above section titles (`text-brand-teal` on light backgrounds; `text-brand-primary` only on legacy dark heroes):
```html
<p class="text-sm font-semibold text-brand-teal uppercase tracking-widest mb-4">Section Label</p>
```

### Body Text
```html
<!-- On dark backgrounds -->
<p class="text-lg md:text-xl text-gray-300 max-w-2xl leading-relaxed mb-12">...</p>

<!-- On light backgrounds -->
<p class="text-lg text-gray-600 leading-relaxed">...</p>

<!-- Card descriptions -->
<p class="text-gray-600 text-sm leading-relaxed">...</p>
```

---

## Layout

### Page Structure
```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
const frontmatter = {
  title: 'MONAI - Page Title',
  description: '...',
  canonical: 'https://project-monai.github.io/<name>.html',
  // optional: audience, schemaType, metaRefresh
};
---
<BaseLayout {...frontmatter}>
  <!-- Page sections here. BaseLayout provides <head> (SEO, JSON-LD, GA4),
       Header, Footer, and the shared scripts. -->
</BaseLayout>
```

### Container
```html
<div class="container">  <!-- centered, padding 1rem -->
```

### Section Spacing
- Standard section: `py-24`
- Hero section: varies, typically `py-24 md:py-32` or `min-h-[70vh]`

### Alternating Backgrounds
Alternate between `bg-white` and `bg-gray-50` for content sections.

---

## Component Patterns

### Hero Section (Light)
Every page starts with a light gradient hero. **No decorative overlays** (the homepage particle
network is the one exception). Typography and content do the work.
```html
<section class="relative overflow-hidden bg-gradient-to-br from-white via-brand-light/40 to-white">
    <div class="container">
        <div class="py-24 md:py-32">
            <!-- h1 text-gray-900 with one text-brand-accent span; lede text-gray-600 -->
        </div>
    </div>
</section>
```

### Section Top Accent Line
Used on the first content section after hero:
```html
<div class="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand-primary/30 to-transparent"></div>
```

### Feature/Info Cards
```html
<div class="group p-8 rounded-xl border border-gray-100 hover:border-brand-primary/30 bg-white hover:shadow-lg hover:shadow-brand-primary/5 transition-all duration-300">
    <div class="w-12 h-12 rounded-xl bg-brand-primary/10 flex items-center justify-center mb-6 group-hover:bg-brand-primary/15 transition-colors">
        <svg class="w-6 h-6 text-brand-primary" ...>...</svg>
    </div>
    <h3 class="text-lg font-bold text-gray-900 mb-2">Title</h3>
    <p class="text-gray-500 text-sm leading-relaxed">Description</p>
</div>
```

### Working Group Page Cards (Initiatives/Resources)
```html
<div class="bg-white p-8 rounded-xl border border-gray-200 hover:border-brand-primary hover:shadow-lg transition-all duration-300">
    <h3 class="text-xl font-semibold text-brand-primary mb-6 pb-2 border-b border-gray-200">Card Title</h3>
    <ul class="space-y-4 text-gray-700">
        <li class="flex items-start">
            <span class="text-brand-primary mr-3">•</span>
            <span>List item text</span>
        </li>
    </ul>
</div>
```

### Bullet Point Lists (inside cards)
```html
<ul class="space-y-3">
    <li class="flex items-center gap-3 text-sm text-gray-600">
        <span class="w-1.5 h-1.5 rounded-full bg-brand-primary flex-shrink-0"></span>
        Item text
    </li>
</ul>
```

### Team/Person Cards
```html
<div class="bg-white p-8 rounded-xl border border-gray-200 hover:border-brand-primary hover:shadow-lg transition-all duration-300">
    <div class="flex flex-col items-center text-center">
        <img src="..." alt="Name" class="w-32 h-32 rounded-full object-cover mb-6 border-4 border-brand-light">
        <div>
            <p class="text-xl font-semibold text-gray-800 mb-2">Person Name</p>
            <p class="text-base text-gray-600 mb-1">Title</p>
            <p class="text-sm text-gray-600 mb-1">Organization</p>
            <p class="text-sm font-medium text-brand-primary">Role</p>
        </div>
    </div>
</div>
```

### Smaller Person Cards (Advisory Board style)
```html
<div class="flex flex-col items-center text-center">
    <div class="w-24 h-24 mb-2">
        <img src="..." alt="Name" class="w-full h-full rounded-full object-cover shadow-md">
    </div>
    <h5 class="font-medium text-gray-800">Name</h5>
    <p class="text-sm text-brand-primary">Role</p>
</div>
```

---

## Buttons & Links

### Primary CTA (filled)
```html
<a class="px-7 py-3 rounded-lg bg-brand-primary text-gray-900 font-semibold hover:bg-brand-primary/90 transition-all duration-200 flex items-center gap-2 group shadow-lg shadow-brand-primary/20" href="...">
    Button Text
    <svg class="w-4 h-4 transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
    </svg>
</a>
```

### Secondary CTA (on dark bg)
```html
<a class="px-7 py-3 rounded-lg bg-white/5 text-white font-semibold border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-200 flex items-center gap-2 group backdrop-blur-sm" href="...">
    Button Text
    <svg class="w-4 h-4 transition-transform group-hover:translate-x-0.5" ...>...</svg>
</a>
```

### Outline Button (on light bg)
```html
<a class="inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-gray-200 text-sm font-semibold text-gray-700 hover:text-brand-primary hover:border-brand-primary/30 transition-all duration-200 group" href="...">
    Button Text
    <svg class="w-4 h-4 transition-transform group-hover:translate-x-0.5" ...>...</svg>
</a>
```

### Inline Link with Arrow
On light backgrounds use `text-brand-teal` (bright `brand-primary` fails AA as small text on white).
```html
<a href="..." class="inline-flex items-center gap-2 text-sm font-semibold text-brand-teal hover:text-brand-dark group/link transition-colors">
    Link Text
    <svg class="w-4 h-4 transition-transform group-hover/link:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
    </svg>
</a>
```

### Text links inside paragraphs
```html
<a href="..." class="text-brand-primary hover:text-brand-dark transition-colors duration-300">Link text</a>
```

---

## Grid Layouts

### 3-Column Cards
```html
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
```

### 4-Column Cards
```html
<div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
```

### 2-Column Split
```html
<div class="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
```

### Person Grid (4 cols)
```html
<div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
```

---

## Interactive Patterns

### Alpine.js
Used for:
- Header mobile menu toggle and dropdowns
- Banner system
- Any show/hide interactions

### Hover Effects
- Cards: `hover:border-brand-primary/30 hover:shadow-lg hover:shadow-brand-primary/5 transition-all duration-300`
- WG Cards: `hover:border-brand-primary hover:shadow-lg transition-all duration-300`
- Buttons: `hover:bg-brand-primary/90 transition-all duration-200`
- Links: `hover:text-brand-primary transition-colors`
- Arrow icons on hover: `group-hover:translate-x-0.5` or `group-hover:translate-x-1`

---

## Working Group Page Template

All working group pages follow this structure:

1. **Hero Section** - Dark bg with gradient title, mission statement
2. **Initiatives Section** - `bg-white`, 2-col grid with Current Projects + Focus Areas
3. **Group Leads Section** - `bg-gray-50`, person cards in 3-col grid
4. **Resources Section** - `bg-white`, resource links in cards
5. **Collaboration Section** - `bg-gray-50`, ways to get involved

### WG Hero Pattern (light)
Light gradient surface, solid colors, no decorative backgrounds.
```html
<section id="hero" class="relative overflow-hidden py-24 bg-gradient-to-br from-white via-brand-light/40 to-white">
    <div class="container">
        <div class="flex flex-wrap items-center">
            <div class="w-full max-w-3xl">
                <h1 class="text-4xl md:text-5xl font-bold tracking-tight mb-8">
                    <span class="text-brand-accent">WG Name</span><br>
                    <span class="text-gray-900">Working Group</span>
                </h1>
                <p class="text-brand-teal uppercase tracking-widest text-sm font-semibold mb-4">Mission Statement</p>
                <p class="text-lg leading-relaxed text-gray-600">Mission text...</p>
            </div>
        </div>
    </div>
</section>
```

---

## SVG Icons
Use inline SVGs from Heroicons (outline style, stroke-width 1.5 or 2). Common ones:

- Arrow right: `d="M13 7l5 5m0 0l-5 5m5-5H6"`
- External link chevron: `d="M9 5l7 7-7 7"`
- Code: `d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"`
- Cloud upload: `d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"`
- Tag: `d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"`
- Users: `d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"`

---

## Tags/Badges
```html
<!-- On dark bg -->
<div class="inline-flex items-center px-4 py-2 rounded-full bg-white/5 text-brand-primary font-semibold text-sm border border-white/10 backdrop-blur-sm">
    Badge Text
</div>

<!-- On light bg -->
<span class="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium">Tag</span>

<!-- Accent tag -->
<span class="px-4 py-2 bg-brand-primary/10 text-brand-primary rounded-full text-sm font-semibold border border-brand-primary/20">Label</span>
```

---

## Stats Display
```html
<div class="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-12 border-t border-white/[0.06] pt-12">
    <div>
        <div class="font-display text-3xl md:text-4xl font-bold text-brand-primary tracking-tight">8M+</div>
        <div class="text-sm text-gray-500 mt-1.5 font-medium uppercase tracking-wider">Downloads</div>
    </div>
</div>
```

### Correct Stats Values
- Downloads / pip installs: `9.5M+`
- Research Papers / publications: `5K+`
- Pre-trained Models: `40+`
- Challenge Wins: `20+`

---

## Animations & Effects

### Scroll Reveal
Use the `reveal` class on elements to animate them in when scrolled into view. Use `reveal-stagger` on parent grids for staggered entry.
```html
<!-- Single reveal element -->
<div class="reveal">Content animates in on scroll</div>

<!-- Staggered grid children -->
<div class="grid grid-cols-3 gap-6 reveal-stagger">
    <div class="reveal">Card 1</div>
    <div class="reveal">Card 2</div>
    <div class="reveal">Card 3</div>
</div>
```
The IntersectionObserver in `scripts.html` adds the `revealed` class automatically.

### Card Hover
Use border and shadow changes only. No glowing pseudo-elements, no animated gradient borders.
```html
<div class="group p-8 rounded-xl border border-gray-100 hover:border-brand-primary/30 bg-white hover:shadow-lg hover:shadow-brand-primary/5 transition-all duration-300 reveal">
```

### Stat Display
Solid color, no pulse, no glow. The number speaks for itself.
```html
<div class="font-display text-3xl md:text-4xl font-bold text-brand-primary tracking-tight">8M+</div>
```

### Logos (contributor wall)
Full-colour logos at **full opacity, always**: no grayscale/invert filters, no opacity dimming.
Tile background shifts on hover; the logo itself does not change.
```html
<div class="p-5 rounded-xl hover:bg-gray-50 transition-colors flex items-center justify-center h-20 group">
    <img class="max-h-12 w-auto object-contain" src="logo.png">
</div>
```

---

## Dark Surfaces (components only)

**Dark section backgrounds are retired**: CTA, contributor, and "Get Involved" blocks use
`bg-white` / `bg-gray-50` per the alternation rule. The only dark surfaces are **code/terminal
cards** (see Code Block Pattern): `bg-surface-dark rounded-xl`, JetBrains Mono, keywords
`text-brand-primary`, strings/numbers `text-teal-300`.

---

## Alpine.js Tab Pattern

For content switching between related items (e.g., install commands for different frameworks):

```html
<div x-data="{ activeTab: 'tab1' }">
    <!-- Tab buttons -->
    <div class="flex rounded-lg bg-white border border-gray-200 p-1 mb-6">
        <button @click="activeTab = 'tab1'"
            :class="activeTab === 'tab1' ? 'bg-brand-primary text-white shadow-sm' : 'text-gray-600 hover:text-brand-primary'"
            class="flex-1 px-6 py-3 rounded-lg font-semibold text-sm transition-all duration-200">
            Tab 1
        </button>
        <!-- More tabs... -->
    </div>
    <!-- Tab panels -->
    <div x-show="activeTab === 'tab1'">Panel 1 content</div>
    <div x-show="activeTab === 'tab2'" x-cloak>Panel 2 content</div>
</div>
```

---

## Alpine.js Filter Pattern

For filtering cards by category (e.g., tutorials by framework/level):

```html
<div x-data="{ activeFilter: 'all' }">
    <!-- Filter pills -->
    <div class="flex flex-wrap gap-2">
        <button @click="activeFilter = 'all'"
            :class="activeFilter === 'all' ? 'bg-brand-primary text-white' : 'bg-white text-gray-700 border border-gray-200 hover:text-brand-primary hover:border-brand-primary/30'"
            class="px-6 py-3 font-semibold rounded-lg text-sm transition-all duration-300">
            All
        </button>
        <!-- More filter buttons... -->
    </div>

    <!-- Filtered cards -->
    <div x-show="activeFilter === 'all' || activeFilter === 'category1'" class="card-classes">
        Card content
    </div>
</div>
```

---

## Tutorial Card Pattern

For linking to external tutorials with framework/difficulty badges:

```html
<a href="..." target="_blank" class="group p-6 rounded-xl border border-gray-100 hover:border-brand-primary/30 bg-white hover:shadow-lg hover:shadow-brand-primary/5 transition-all duration-300 block">
    <div class="flex items-start justify-between mb-3">
        <h3 class="text-base font-bold text-gray-900 group-hover:text-brand-primary transition-colors">Tutorial Name</h3>
        <svg class="w-4 h-4 text-gray-300 group-hover:text-brand-primary flex-shrink-0 mt-1">external link icon</svg>
    </div>
    <p class="text-gray-500 text-sm leading-relaxed mb-4">Description</p>
    <div class="flex items-center gap-2">
        <span class="px-3 py-1 bg-brand-primary/10 text-brand-primary rounded-full text-xs font-semibold">Core</span>
        <span class="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium">Beginner</span>
        <span class="text-xs text-gray-400 flex items-center gap-1">Notebook icon</span>
    </div>
</a>
```

---

## Code Block Pattern

For displaying code snippets (e.g., install commands, code examples):

### Inline Code Block (light bg)
```html
<pre class="bg-gray-50 rounded-lg p-4 font-mono text-sm text-gray-700 border border-gray-200"><code>pip install monai</code></pre>
```

### Code Block (dark bg)
```html
<div class="bg-surface-dark rounded-xl p-6 overflow-x-auto">
    <pre class="font-mono text-sm"><code>
<span class="text-brand-primary">import</span> <span class="text-white">monai</span>
<span class="text-gray-500"># Comment text</span>
<span class="text-teal-300">"string value"</span>
    </code></pre>
</div>
```

---

## New Pages Checklist

When creating a new page:

1. Use `class="scroll-smooth"` on `<html>` (NOT inline style)
2. Wrap the page in `BaseLayout` (it renders head, Header, Footer, and shared scripts).
3. Fill the `frontmatter` const: title, description, canonical (BaseHead derives OG/Twitter/canonical/markdown-twin tags from it)
4. Start with a light hero (`bg-gradient-to-br from-white via-brand-light/40 to-white`, dark text; see DESIGN.md, dark heroes are legacy)
5. Use `reveal` classes for scroll-reveal animations, sparingly
6. Alternate `bg-white` and `bg-gray-50` for content sections
7. Test responsive layout at mobile (375px), tablet (768px), desktop (1280px)
8. Run `npm run build` and `npm test` to verify the page and LLM artifacts generate

---

## Key Principles

1. **Restraint over intensity**: If a visual effect doesn't convey information, remove it
2. **Consistency**: Every page uses the same hero pattern, section spacing, and card styles
3. **Hierarchy**: Section label → H2 → description → content grid
4. **Whitespace**: Generous padding (py-24 for sections, p-8 for cards)
5. **Responsive**: Always mobile-first with `sm:`, `md:`, `lg:`, `xl:` breakpoints
6. **Light, airy surfaces**: soft teal-tinted homepage hero, alternating white/gray-50 content sections (interior pages migrating off the older dark-hero pattern)
7. **Accessible**: Proper semantic HTML, alt text on images, WCAG AA contrast, `prefers-reduced-motion` respected
8. **Motion is purposeful**: `reveal` for section entry; the homepage hero particle network is the one ambient motion, disabled under `prefers-reduced-motion`
