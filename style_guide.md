# MONAI Website Style Guide

## Purpose
This comprehensive style guide ensures consistency across all MONAI website pages. It defines standardized patterns for typography, layout, components, and interactions to create a cohesive user experience.

## Color Palette

### Brand Colors
- **Primary**: `brand-primary` (#00C9B5) - Main brand teal color
- **Primary Light**: `brand-light` - Lighter teal for backgrounds
- **Primary Dark**: `brand-dark` - Darker teal for emphasis

### Neutral Colors
- **Darkest Black**: `neutral-darkestblack` - Headlines and primary text
- **Light Gray**: `neutral-lightgray` - Section backgrounds
- **Gray Shades**: 
  - `gray-800` - Dark text
  - `gray-700` - Body text
  - `gray-600` - Secondary text
  - `gray-200` - Borders

### Background Patterns
- ~~Dot pattern overlay: `opacity-[0.10] bg-[radial-gradient(circle_at_1px_1px,#000_1px,transparent_0)]`~~ (Deprecated - removed from all pages)

## Typography

### Page Titles
```html
<h1 class="text-4xl font-bold text-gray-800 mb-8">Page Title</h1>
```

### Section Headings
```html
<h2 class="text-3xl font-bold text-neutral-darkestblack mb-8">Section Title</h2>
```

### Subsection Headings
```html
<h3 class="text-xl font-semibold text-brand-primary mb-6 pb-2 border-b border-neutral-200">Subsection Title</h3>
```

### Body Text
```html
<p class="text-lg leading-relaxed text-gray-700">
  Body content with comfortable line height and spacing.
</p>
```

### Small/Label Text
```html
<h4 class="uppercase text-sm font-medium text-gray-600 mb-3">LABEL TEXT</h4>
```

## Layout Structure

### Page Container
```html
<body class="flex flex-col min-h-screen">
  <!-- Header -->
  <main class="flex-grow pt-20">
    <!-- Content -->
  </main>
  <!-- Footer -->
</body>
```

### Section Spacing
- Standard sections: `py-24`
- Compact sections: `py-12`
- Hero sections: Standard padding without decorative patterns

### Container Width
```html
<div class="container">
  <!-- Centered content with responsive padding -->
</div>
```

## Component Patterns

### Hero Sections
```html
<section class="py-24 bg-brand-light">
  <div class="container">
    <h1 class="text-4xl font-bold text-gray-800 mb-8">Title</h1>
    <p class="text-lg leading-relaxed text-gray-700 max-w-3xl">
      Hero description text
    </p>
  </div>
</section>
```

### Content Cards
```html
<div class="bg-white rounded-xl shadow-md">
  <div class="border-b border-gray-200 bg-brand-dark">
    <h3 class="text-xl font-semibold text-white p-8 pb-6 text-center">Card Title</h3>
  </div>
  <div class="p-8">
    <!-- Card content -->
  </div>
</div>
```

### Interactive Cards
```html
<div class="bg-white p-8 rounded-lg border border-neutral-200 hover:border-brand-primary hover:shadow-md transition-all duration-300">
  <!-- Card content -->
</div>
```

### Person/Member Cards
```html
<div class="flex flex-col items-center text-center">
  <div class="w-24 h-24 mb-2">
    <img src="path/to/image.jpg" alt="Name" 
         class="w-full h-full rounded-full object-cover shadow-md">
  </div>
  <h5 class="font-medium text-gray-800">Name</h5>
  <p class="text-sm text-brand-primary">Title/Role</p>
</div>
```

### Person Cards (Detailed)
```html
<div class="bg-white p-8 rounded-lg border border-neutral-200 hover:border-brand-primary hover:shadow-md transition-all duration-300">
  <div class="flex flex-col items-center text-center">
    <img src="path/to/image.jpg" alt="Name" 
         class="w-32 h-32 rounded-full object-cover mb-6 border-4 border-brand-light">
    <div>
      <p class="text-xl font-semibold text-gray-800 mb-2">Full Name</p>
      <p class="text-base text-gray-600 mb-1">Title</p>
      <p class="text-sm text-gray-600 mb-1">Organization</p>
      <p class="text-sm font-medium text-brand-primary">Role in MONAI</p>
    </div>
  </div>
</div>
```

## Button Styles

### Primary Outline Button
```html
<a href="#" class="px-6 py-2.5 rounded-lg bg-white text-brand-primary border-2 border-brand-primary hover:bg-brand-light transition-colors inline-flex items-center gap-2 group">
  <span>Button Text</span>
  <svg class="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
  </svg>
</a>
```

### Text Link
```html
<a href="#" class="text-brand-primary hover:text-brand-dark transition-colors duration-300">Link Text</a>
```

## Grid Layouts

### Responsive Grid
```html
<!-- 4-column grid on large screens -->
<div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
  <!-- Grid items -->
</div>

<!-- 3-column grid -->
<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
  <!-- Grid items -->
</div>

<!-- 2-column grid -->
<div class="grid grid-cols-1 md:grid-cols-2 gap-8">
  <!-- Grid items -->
</div>
```

## List Styles

### Bulleted List
```html
<ul class="space-y-4 text-gray-700">
  <li class="flex items-start">
    <span class="text-brand-primary mr-3">•</span>
    <span>List item content</span>
  </li>
</ul>
```

## Section Backgrounds

### White Background
```html
<section class="py-24 bg-white">
```

### Light Gray Background
```html
<section class="py-24 bg-neutral-lightgray">
  <div class="container">
    <!-- Content -->
  </div>
</section>
```

### Brand Light Background
```html
<section class="py-24 bg-brand-light">
  <div class="container">
    <!-- Content -->
  </div>
</section>
```

### Subtle Brand Background
```html
<section class="py-12 bg-brand-dark/15">
```

## Spacing Guidelines

### Margin Bottom Classes
- Headings: `mb-8` for main headings, `mb-6` for subheadings, `mb-4` for smaller headings
- Paragraphs: `mb-4` between paragraphs
- Sections: `mb-12` between major content blocks

### Padding
- Cards: `p-8` for generous padding, `p-6` for compact
- Sections: `py-24` for standard, `py-12` for compact

## Responsive Design

### Breakpoints
- `sm:` - 640px and up
- `md:` - 768px and up  
- `lg:` - 1024px and up
- `xl:` - 1280px and up

### Mobile-First Approach
Always define base styles first, then add responsive modifiers:
```html
<div class="w-full lg:w-1/2">
  <!-- Full width on mobile, half width on large screens -->
</div>
```

## Animation & Transitions

### Standard Transitions
```css
transition-colors duration-300
transition-all duration-300
transition-transform duration-300
```

### Hover Effects
- Cards: `hover:border-brand-primary hover:shadow-md`
- Buttons: `hover:bg-brand-light`
- Links: `hover:text-brand-dark`
- Images: `hover:scale-105`

## Accessibility

### Image Alt Text
Always include descriptive alt text:
```html
<img src="path/to/image.jpg" alt="Descriptive text about the image">
```

### Link Context
Ensure links have meaningful text or additional context:
```html
<a href="#" aria-label="Learn more about MONAI Deploy">Learn More</a>
```

### Semantic HTML
Use appropriate HTML elements for their intended purpose:
- `<main>` for main content
- `<section>` for page sections
- `<nav>` for navigation
- `<h1>` through `<h6>` for headings in proper hierarchy

## Common Page Patterns

### Working Group Page Structure
1. Hero section with mission statement
2. Initiatives/Focus areas (2-column grid)
3. Group leads section (3-column grid)
4. Resources section
5. Collaboration opportunities

### About/Overview Page Structure
1. Hero section with main description
2. Content sections with alternating layouts
3. Team/member grids
4. Call-to-action sections

### Product Page Structure (Core, Deploy, Label)
1. Overview section
2. Features section
3. Getting started/Components section
4. Advanced features section
5. Research/Applications section
6. Citation section
7. Community/Resources section
8. Additional product-specific sections as needed

## Background Color Alternation Guidelines

### For Product Pages (3-Color Rotation)
Product pages should use a three-color rotation pattern to create visual interest:
- `bg-white` → `bg-brand-light` → `bg-neutral-lightgray` → `bg-white` (repeat)

**Example sequence:**
1. Overview: `bg-white`
2. Features: `bg-brand-light`
3. Components: `bg-neutral-lightgray`
4. Advanced: `bg-white`
5. Research: `bg-brand-light`
6. Citation: `bg-neutral-lightgray`
7. Community: `bg-white`

### For Content Pages (2-Color Alternation)
Content-focused pages (about, working-groups) should use simpler two-color alternation:
- `bg-white` → `bg-neutral-lightgray` → `bg-white` (repeat)

**Example sequence:**
1. Hero/Overview: `bg-white`
2. Main content: `bg-neutral-lightgray`
3. Additional sections: `bg-white`

### Background Color Selection Rules
1. **Never use consecutive sections with the same background color**
2. **Always maintain proper contrast** between background and text
3. **Use `bg-white` for primary content sections** (overview, getting started)
4. **Use `bg-brand-light` for feature highlights** and secondary content
5. **Use `bg-neutral-lightgray` for supporting content** and team sections
6. **Avoid the deprecated `bg-brand-dark/15`** pattern

## Implementation Notes

### CSS Classes to Avoid Mixing
- Don't mix different heading styles (e.g., `section-heading` vs inline styles)
- Use consistent spacing utilities throughout
- Avoid custom colors outside the defined palette

### File Organization
- Include server-side includes for common components:
  ```html
  <!-- #include file="components/head.html" -->
  <!-- #include file="components/header.html" -->
  <!-- #include file="components/footer.html" -->
  <!-- #include file="components/scripts.html" -->
  ```

### Performance Considerations
- Use Tailwind's purge/tree-shaking for production
- Optimize images (prefer WebP format)
- Lazy load images below the fold
- Minimize custom CSS

## Maintenance

This style guide should be updated whenever:
- New patterns are introduced
- Existing patterns are modified
- Inconsistencies are discovered
- New components are created
