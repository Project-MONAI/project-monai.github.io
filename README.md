# Project MONAI Website

This repository contains the source code and content for the Project MONAI website found at [project-monai.github.io](https://project-monai.github.io/). For more information about MONAI, visit the [Project-MONAI GitHub](https://github.com/Project-MONAI).

## Features

- Modern, responsive design using Tailwind CSS
- Component-based architecture for better maintainability
- Optimized build process for production
- Development server with hot reloading
- SEO optimizations and meta tag management
- Automated asset optimization

## Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

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

3. Start the development server:
   ```bash
   npm run dev
   ```

   Alternatively, to build and serve the site simultaneously:
   ```bash
   npm run dev:serve
   ```

The site will be available at `http://localhost:3000` with hot reloading enabled.

## Project Structure

```
project-monai.github.io/
├── components/          # Reusable HTML components
├── assets/             # Static assets (images, CSS, JS)
├── scripts/           # Build and optimization scripts
├── src/               # Source files
└── dist/              # Production build output
```

## Components

The website uses a component-based architecture. Common elements like headers, footers, and navigation are stored in the `components/` directory and included in pages using the include syntax:

```html
<!-- #include file="components/head.html" -->
<!-- #include file="components/header.html" -->
<!-- #include file="components/footer.html" -->
<!-- #include file="components/scripts.html" -->
```

## Development

### Adding New Pages

1. Create a new HTML file in the root directory
2. Use the component includes for common elements
3. Add your page-specific content
4. Update meta tags using the head component variables:
   ```html
   <script>
       document.head.innerHTML = document.head.innerHTML
           .replace('${title}', 'Your Page Title')
           .replace('${description}', 'Your page description')
           .replace('${canonical_url}', 'https://project-monai.github.io/your-page.html');
   </script>
   ```

### Modifying Components

Components are located in the `components/` directory. When modifying a component:
1. The change will automatically affect all pages using that component
2. Test the changes across multiple pages to ensure consistency
3. Run the development server to see changes in real-time

### CSS Development

The project uses Tailwind CSS with a custom configuration:

1. Development:
   ```bash
   npm run watch
   ```
   This will watch for changes and rebuild the CSS automatically.

2. Adding new styles:
   - Add custom styles in `src/css/`
   - Configure Tailwind in `tailwind.config.js`
   - Custom classes can be added to `assets/css/`

### Banner System

The website includes a flexible banner system for announcements and surveys. The banner system is integrated into the header component (`components/header.html`) and automatically appears on all pages.

#### Adding a New Banner

1. Edit `components/header.html` and add your banner to the `banners` array in the `bannerSystem()` function:
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

This will:
- Process and include all components
- Optimize images and assets
- Minify CSS and JavaScript
- Generate the production build in `dist/`

## Deployment

The site is automatically deployed to GitHub Pages when changes are pushed to the main branch.

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
