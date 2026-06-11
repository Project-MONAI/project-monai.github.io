const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const http = require('http');
const handler = require('serve-handler');

const ROOT = process.argv[2];
const OUT  = process.argv[3];
const PORT = 4321;

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const server = http.createServer((req, res) => handler(req, res, { public: ROOT }));
  await new Promise(r => server.listen(PORT, r));
  const browser = await puppeteer.launch({
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
  await browser.close();
  server.close();
})();
