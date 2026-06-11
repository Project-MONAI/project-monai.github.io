import type { AstroIntegration } from 'astro';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';

interface Config {
  include: string[];
}

export default function llmsTxt(): AstroIntegration {
  return {
    name: 'llms-txt',
    hooks: {
      // Dev parity: llms-full.txt and sitemap-llms.xml are build artifacts, so
      // synthesize them on the fly in `astro dev` (the md-twins dev middleware
      // converts each page when we fetch its .md here).
      'astro:server:setup': ({ server }) => {
        server.middlewares.use(async (req, res, next) => {
          const url = (req.url || '').split('?')[0];
          if (url !== '/llms-full.txt' && url !== '/sitemap-llms.xml')
            return next();
          try {
            const configPath = path.resolve(
              process.cwd(),
              'src/integrations/llms-config.json',
            );
            const config: Config = JSON.parse(
              fs.readFileSync(configPath, 'utf8'),
            );
            const address = server.httpServer?.address();
            const port =
              typeof address === 'object' && address ? address.port : 3000;

            if (url === '/llms-full.txt') {
              const parts: string[] = [];
              for (const slug of config.include) {
                const r = await fetch(`http://localhost:${port}/${slug}.md`);
                if (r.ok) parts.push(await r.text());
              }
              res.setHeader('Content-Type', 'text/plain; charset=utf-8');
              res.end(parts.join('\n\n---\n\n'));
              return;
            }

            // sitemap-llms.xml: derive twin list from src/pages
            const pagesDir = path.resolve(process.cwd(), 'src/pages');
            const rels: string[] = [];
            const walkSrc = (d: string, base = ''): void => {
              for (const e of fs.readdirSync(d, { withFileTypes: true })) {
                const rel = path.join(base, e.name);
                if (e.isDirectory()) walkSrc(path.join(d, e.name), rel);
                else if (/\.(astro|mdx?)$/.test(e.name))
                  rels.push(
                    rel.replace(/\\/g, '/').replace(/\.(astro|mdx?)$/, '.md'),
                  );
              }
            };
            walkSrc(pagesDir);
            const today = new Date().toISOString().slice(0, 10);
            const urls = rels
              .map(
                (rel) =>
                  `  <url><loc>https://project-monai.github.io/${rel}</loc><lastmod>${today}</lastmod></url>`,
              )
              .join('\n');
            res.setHeader('Content-Type', 'application/xml; charset=utf-8');
            res.end(
              `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
            );
          } catch (err) {
            console.error(`[llms-txt] dev synthesis failed for ${url}:`, err);
            next();
          }
        });
      },
      'astro:build:done': async ({ dir }: { dir: URL }) => {
        const distRoot = fileURLToPath(dir);
        const configPath = path.resolve(
          process.cwd(),
          'src/integrations/llms-config.json',
        );
        const config: Config = JSON.parse(fs.readFileSync(configPath, 'utf8'));

        // llms-full.txt: concatenate curated .md twins
        const parts: string[] = [];
        for (const slug of config.include) {
          const mdPath = path.join(distRoot, `${slug}.md`);
          if (!fs.existsSync(mdPath)) {
            console.warn(`[llms-txt] missing twin for ${slug}, skipping`);
            continue;
          }
          parts.push(fs.readFileSync(mdPath, 'utf8'));
        }
        fs.writeFileSync(
          path.join(distRoot, 'llms-full.txt'),
          parts.join('\n\n---\n\n'),
          'utf8',
        );

        // sitemap-llms.xml: every emitted .md twin
        const allMd: string[] = [];
        function walk(d: string, base = ''): void {
          for (const e of fs.readdirSync(d, { withFileTypes: true })) {
            const rel = path.join(base, e.name);
            const abs = path.join(d, e.name);
            if (e.isDirectory()) walk(abs, rel);
            else if (e.name.endsWith('.md')) allMd.push(rel.replace(/\\/g, '/'));
          }
        }
        walk(distRoot);

        const today = new Date().toISOString().slice(0, 10);
        const urls = allMd
          .map(
            (rel) =>
              `  <url><loc>https://project-monai.github.io/${rel}</loc><lastmod>${today}</lastmod></url>`,
          )
          .join('\n');
        const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;
        fs.writeFileSync(path.join(distRoot, 'sitemap-llms.xml'), xml, 'utf8');
      },
    },
  };
}
