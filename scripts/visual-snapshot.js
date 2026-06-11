const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const http = require('http');
const handler = require('serve-handler');

const ROOT = process.argv[2];
const OUT  = process.argv[3];
const PORT = 4321;

if (!ROOT || !OUT) {
  console.error('Usage: node scripts/visual-snapshot.js <ROOT> <OUT>');
  console.error('  ROOT: directory of built HTML to serve (e.g. ./dist)');
  console.error('  OUT:  directory to write screenshots into');
  process.exit(1);
}

(async () => {
  let server;
  let browser;
  try {
    await main();
  } catch (e) {
    console.error('visual-snapshot failed:', e.message);
    console.error(e.stack);
    process.exitCode = 1;
  } finally {
    if (browser) await browser.close().catch(() => {});
    if (server) server.close();
  }

  async function main() {
  fs.mkdirSync(OUT, { recursive: true });
  server = http.createServer((req, res) => handler(req, res, { public: ROOT }));
  await new Promise(r => server.listen(PORT, r));
  browser = await puppeteer.launch({
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 1600, deviceScaleFactor: 1 });

  const htmls = [];
  (function walk(dir, base = '') {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const rel = path.join(base, entry.name);
      const abs = path.join(dir, entry.name);
      if (entry.isDirectory()) walk(abs, rel);
      else if (entry.name.endsWith('.html')) htmls.push(rel);
    }
  })(ROOT);

  for (const h of htmls) {
    const url = `http://localhost:${PORT}/${h.replace(/\\/g, '/')}`;
    try {
      await page.goto(url, { waitUntil: 'networkidle0', timeout: 30000 });
      const safe = h.replace(/[\\/]/g, '__').replace('.html', '.png');
      await page.screenshot({ path: path.join(OUT, safe), fullPage: true });
      console.log(`Captured ${h}`);
    } catch (e) {
      console.warn(`Skip ${h}: ${e.message}`);
    }
  }
  }
})();
