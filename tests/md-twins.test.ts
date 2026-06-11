import { describe, it, expect } from 'vitest';
import { htmlToMarkdownTwin, type TwinFrontmatter } from '../src/integrations/md-twins';

const sampleHtml = `<!DOCTYPE html>
<html>
<head><title>Sample</title><meta name="description" content="A sample page"></head>
<body>
  <header>Site header</header>
  <nav>Nav links</nav>
  <main>
    <h1>Hello</h1>
    <p>Some content with <a href="https://example.com">a link</a>.</p>
    <pre><code class="language-python">print("hi")</code></pre>
  </main>
  <footer>Site footer</footer>
  <script>console.log("noise");</script>
</body>
</html>`;

const sampleFm: TwinFrontmatter = {
  title: 'Sample',
  description: 'A sample page',
  canonical: 'https://example.com/sample.html',
  audience: ['engineer'],
  last_updated: '2026-05-01',
  source: 'sample.html',
};

describe('htmlToMarkdownTwin', () => {
  it('strips header, nav, footer, script', () => {
    const md = htmlToMarkdownTwin(sampleHtml, sampleFm);
    expect(md).not.toMatch(/Site header/);
    expect(md).not.toMatch(/Nav links/);
    expect(md).not.toMatch(/Site footer/);
    expect(md).not.toMatch(/console\.log/);
  });

  it('preserves main content as Markdown', () => {
    const md = htmlToMarkdownTwin(sampleHtml, sampleFm);
    expect(md).toMatch(/# Hello/);
    expect(md).toMatch(/\[a link\]\(https:\/\/example\.com\)/);
  });

  it('detects code-block language from class attribute', () => {
    const md = htmlToMarkdownTwin(sampleHtml, sampleFm);
    expect(md).toMatch(/```python\nprint\("hi"\)\n```/);
  });

  it('emits frontmatter at the top', () => {
    const md = htmlToMarkdownTwin(sampleHtml, sampleFm);
    expect(md.startsWith('---\n')).toBe(true);
    expect(md).toMatch(/title: "Sample"/);
    expect(md).toMatch(/audience: \[engineer\]/);
    expect(md).toMatch(/canonical: https:\/\/example\.com\/sample\.html/);
  });

  it('escapes double-quotes in title', () => {
    const fm = { ...sampleFm, title: 'A "quoted" title' };
    const md = htmlToMarkdownTwin(sampleHtml, fm);
    expect(md).toMatch(/title: "A \\"quoted\\" title"/);
  });

  it('handles missing main by falling back to body content', () => {
    const noMain = `<!DOCTYPE html><html><body><p>orphan content</p></body></html>`;
    const md = htmlToMarkdownTwin(noMain, sampleFm);
    expect(md).toMatch(/orphan content/);
  });

  it('joins multiple audience values', () => {
    const fm = { ...sampleFm, audience: ['researcher', 'engineer', 'newcomer'] };
    const md = htmlToMarkdownTwin(sampleHtml, fm);
    expect(md).toMatch(/audience: \[researcher, engineer, newcomer\]/);
  });
});
