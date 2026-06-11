import * as cheerio from 'cheerio';
import TurndownService from 'turndown';
// turndown-plugin-gfm has no TS types
// eslint-disable-next-line @typescript-eslint/no-explicit-any
import * as turndownPluginGfm from 'turndown-plugin-gfm';
import type { AstroIntegration } from 'astro';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const gfm = (turndownPluginGfm as any).gfm;

export interface TwinFrontmatter {
  title: string;
  description: string;
  canonical: string;
  audience: string[];
  last_updated: string;
  source: string;
}

export function htmlToMarkdownTwin(html: string, fm: TwinFrontmatter): string {
  const $ = cheerio.load(html);
  $(
    'header, nav, footer, script, style, .skip-link, [aria-hidden="true"]',
  ).remove();

  const main = $('main').html() || $('body').html() || '';

  const td = new TurndownService({
    headingStyle: 'atx',
    codeBlockStyle: 'fenced',
    fence: '```',
    bulletListMarker: '-',
    emDelimiter: '_',
    hr: '---',
  });
  td.use(gfm);

  // Detect code-block language from class="language-..." on <code> inside <pre>
  td.addRule('fencedCodeBlock', {
    filter: (node) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const n = node as any;
      return (
        n.nodeName === 'PRE' &&
        n.firstChild != null &&
        n.firstChild.nodeName === 'CODE'
      );
    },
    replacement: (_content, node) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const codeNode = (node as any).firstChild;
      const className = codeNode.getAttribute
        ? codeNode.getAttribute('class') || ''
        : (codeNode.className || '');
      const m = /language-(\w+)/.exec(className);
      const lang = m ? m[1] : '';
      const code = (codeNode.textContent || '').replace(/\n$/, '');
      return `\n\n\`\`\`${lang}\n${code}\n\`\`\`\n\n`;
    },
  });

  const md = td.turndown(main).trim();

  const escapedTitle = fm.title.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
  const escapedDescription = fm.description
    .replace(/\\/g, '\\\\')
    .replace(/"/g, '\\"');
  const audienceList = `[${fm.audience.join(', ')}]`;

  const front = [
    '---',
    `title: "${escapedTitle}"`,
    `description: "${escapedDescription}"`,
    `canonical: ${fm.canonical}`,
    `audience: ${audienceList}`,
    `last_updated: ${fm.last_updated}`,
    `source: ${fm.source}`,
    '---',
    '',
  ].join('\n');
  return front + md + '\n';
}

interface AstroPageEntry {
  pathname: string;
}

/** Build the frontmatter for a twin from a rendered HTML document. */
function frontmatterFromHtml(html: string, rel: string): TwinFrontmatter {
  const $ = cheerio.load(html);
  const audienceAttr = $('meta[name="audience"]').attr('content') || 'engineer';
  return {
    title: $('title').text() || rel,
    description: $('meta[name="description"]').attr('content') || '',
    canonical: $('link[rel="canonical"]').attr('href') || '',
    audience: audienceAttr
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean),
    last_updated: new Date().toISOString().slice(0, 10),
    source: `${rel}.html`,
  };
}

export default function mdTwins(): AstroIntegration {
  return {
    name: 'md-twins',
    hooks: {
      // Dev parity: in `astro dev`, twins don't exist on disk (they're a build
      // artifact), so convert on the fly by rendering the HTML route through
      // the dev server and running the same converter production uses.
      'astro:server:setup': ({ server }) => {
        server.middlewares.use(async (req, res, next) => {
          const url = (req.url || '').split('?')[0];
          if (!url.endsWith('.md') || url.includes('/assets/')) return next();
          const rel = url.replace(/^\//, '').replace(/\.md$/, '') || 'index';
          const route = rel === 'index' ? '/' : `/${rel}`;
          try {
            const address = server.httpServer?.address();
            const port =
              typeof address === 'object' && address ? address.port : 3000;
            const resp = await fetch(`http://localhost:${port}${route}`);
            if (!resp.ok) return next();
            const html = await resp.text();
            const md = htmlToMarkdownTwin(html, frontmatterFromHtml(html, rel));
            res.setHeader('Content-Type', 'text/markdown; charset=utf-8');
            res.end(md);
          } catch {
            next();
          }
        });
      },
      'astro:build:done': async ({
        dir,
        pages,
      }: {
        dir: URL;
        pages: AstroPageEntry[];
      }) => {
        const distRoot = fileURLToPath(dir);

        for (const { pathname } of pages) {
          // pathname is 'about/' or 'index/' etc. With format:'file' Astro emits about.html.
          const rel = pathname.replace(/\/$/, '') || 'index';
          const htmlPath = path.join(distRoot, `${rel}.html`);
          const mdPath = path.join(distRoot, `${rel}.md`);
          if (!fs.existsSync(htmlPath)) continue;

          const html = fs.readFileSync(htmlPath, 'utf8');
          const md = htmlToMarkdownTwin(html, frontmatterFromHtml(html, rel));
          fs.writeFileSync(mdPath, md, 'utf8');
        }
      },
    },
  };
}
