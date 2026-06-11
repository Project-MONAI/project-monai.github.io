# Project MONAI Website

This repository contains the source code and content for the Project MONAI website found at [project-monai.github.io](https://project-monai.github.io/). For more information about MONAI, visit the [Project-MONAI GitHub](https://github.com/Project-MONAI).

## Features

- Astro 5 static-site build (one `.html` per route) with Tailwind CSS
- Model Zoo as a self-contained Vue 3 SPA (`public/src/model-zoo-vue.js`)
- LLM enablement: `.md` twin per page, `llms.txt` / `llms-full.txt`, `sitemap-llms.xml`,
  agent-aware GA4 analytics (see `docs/ANALYTICS.md`)
- Generated sitemaps and crawler-friendly `robots.txt`
- LAN-accessible dev server with HMR

## Prerequisites

- Node.js (v20 or higher)
- npm (v10 or higher)

## Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/Project-MONAI/project-monai.github.io.git
   cd project-monai.github.io
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the dev server (LAN-accessible on port 3000):
   ```bash
   npm run dev
   ```

   The site will be available at `http://localhost:3000` and on your LAN IP.

## Project Structure

```
project-monai.github.io/
├── astro.config.mjs        # Astro config (Tailwind, MDX, sitemap, md-twins, llms-txt)
├── public/                 # Static assets served as-is
│   └── src/                # Vue UMD app (model-zoo)
├── src/
│   ├── pages/              # Routes (.astro files emit *.html)
│   ├── layouts/            # BaseLayout.astro
│   ├── components/         # Header, Footer, BaseHead
│   ├── integrations/       # md-twins + llms-txt build hooks
│   └── styles/global.css   # Tailwind entry
├── scripts/                # Visual snapshot/diff tooling, model-data generator
└── docs/                   # Design, architecture, and analytics reference docs
```

## Development

### Adding New Pages

1. Create a new file in `src/pages/<name>.astro` (or under a subdirectory).
2. Use the BaseLayout pattern:
   ```astro
   ---
   import BaseLayout from '../layouts/BaseLayout.astro';
   const frontmatter = {
     title: 'Page Title | MONAI',
     description: 'Page description',
     canonical: 'https://project-monai.github.io/<name>.html',
   };
   ---
   <BaseLayout {...frontmatter}>
     <!-- Page content -->
   </BaseLayout>
   ```
3. Follow `docs/DESIGN.md` (direction, alignment and color rules) and `docs/STYLEGUIDE.md` (component recipes); see `AGENTS.md` for repo conventions and load-bearing invariants.

### Model Zoo Development

The Model Zoo page requires model data to display. During CI/CD, this data is generated from the [model-zoo repository](https://github.com/Project-MONAI/model-zoo). For local development:

1. Fetch model data:
   ```bash
   npm run fetch-models
   ```
   This downloads the latest model data from production, or falls back to sample data if unavailable.

2. The sample data file `model_data.sample.json` provides a small set of representative models for development.

3. For full model data generation (optional):
   ```bash
   pip install requests beautifulsoup4 markdown
   python scripts/process_models.py
   ```

### Banner System

The website includes a flexible banner system for announcements and surveys. The banner system lives in the Astro `Header` component (`src/components/Header.astro`) and automatically appears on all pages.

#### Adding a New Banner

1. Edit `src/components/Header.astro` and add your banner to the `banners` array in the `bannerSystem()` function:
   ```javascript
   {
       id: 'unique-banner-id',          // Unique identifier for localStorage
       message: 'Your announcement',     // Main banner text
       link: 'https://example.com',     // Optional link URL
       linkText: 'Learn more →',        // Link text
       bgColor: 'bg-brand-primary',     // Tailwind background class
       icon: 'check',                   // Icon type: 'check' or 'megaphone'
       priority: 1                      // Higher priority shows first
   }
   ```

2. Available background colors:
   - `bg-brand-primary` - Teal (default MONAI color)
   - `bg-purple-600` - Purple (for surveys/feedback)
   - `bg-blue-600` - Blue
   - `bg-green-600` - Green
   - `bg-red-600` - Red (for urgent announcements)

3. Banner features:
   - Only one banner displays at a time (highest priority non-dismissed)
   - Users can dismiss banners (stored in localStorage)
   - Header automatically adjusts position when banner is visible
   - Smooth transitions on dismiss

#### Example Banners

Version announcement:
```javascript
{
    id: 'monai-1-6',
    message: 'MONAI Core v1.6 is now available!',
    link: 'https://monai.readthedocs.io/en/stable/whatsnew_1_6.html',
    linkText: 'See what\'s new →',
    bgColor: 'bg-brand-primary',
    icon: 'check',
    priority: 2
}
```

Survey/Feedback request:
```javascript
{
    id: 'community-survey-2024',
    message: 'Help shape the future of MONAI!',
    link: 'https://survey-link.com',
    linkText: 'Take our 5-minute survey →',
    bgColor: 'bg-purple-600',
    icon: 'megaphone',
    priority: 1
}
```

## Building for Production

1. Build the site:
   ```bash
   npm run build
   ```

   This runs `npm run fetch-models` (to populate `public/model_data.json`) and then `astro build`, producing the production output in `dist/`.

## Deployment

The site is automatically deployed to GitHub Pages via the `.github/workflows/deploy.yml` workflow when changes are pushed to `master` or `main`. The workflow runs `npm ci && npm run build` and uploads `dist/` as the GitHub Pages artifact.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the Apache License 2.0 - see the [LICENSE](LICENSE) file for details.

## Support

If you need help or have questions:
1. Open an issue in this repository
