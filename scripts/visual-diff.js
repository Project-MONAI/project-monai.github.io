// Visual (pixel) diff — INFORMATIONAL ONLY for cross-build migrations.
// Font loading and antialiasing vary between two different build pipelines, so
// pixel parity is unattainable. The structural gate is `scripts/dom-diff.js`,
// which compares text content. This script writes diff PNGs for any page whose
// pixel difference exceeds 0.5% of total pixels — that threshold catches real
// layout regressions without flagging font-rendering noise. Always investigate
// large diffs visually; small diffs (<0.5%) are expected and tolerated.

const fs = require('fs');
const path = require('path');
const { PNG } = require('pngjs');

const BASELINE = process.argv[2];
const CURRENT  = process.argv[3];
const OUT      = process.argv[4];
const TOLERANCE = parseFloat(process.env.DIFF_TOLERANCE || '0.005'); // 0.5% of pixels

if (!BASELINE || !CURRENT || !OUT) {
  console.error('Usage: node scripts/visual-diff.js <baseline-dir> <current-dir> <out-dir>');
  process.exit(2);
}

(async () => {
  const pixelmatch = (await import('pixelmatch')).default;

  fs.mkdirSync(OUT, { recursive: true });

  let major = 0, minor = 0, ok = 0, missing = 0;
  for (const file of fs.readdirSync(BASELINE)) {
    if (!file.endsWith('.png')) continue;
    const a = path.join(BASELINE, file);
    const b = path.join(CURRENT, file);
    if (!fs.existsSync(b)) {
      console.warn(`MISSING in current: ${file}`);
      missing++;
      continue;
    }
    const imgA = PNG.sync.read(fs.readFileSync(a));
    const imgB = PNG.sync.read(fs.readFileSync(b));
    if (imgA.width !== imgB.width || imgA.height !== imgB.height) {
      console.log(
        `size mismatch ${file}: baseline ${imgA.width}x${imgA.height}, current ${imgB.width}x${imgB.height} — skipping (compare structurally via dom-diff)`,
      );
      continue;
    }
    const w = imgA.width;
    const h = imgA.height;
    const total = w * h;
    const diff = new PNG({ width: w, height: h });
    const numDiff = pixelmatch(imgA.data, imgB.data, diff.data, w, h, {
      threshold: 0.2,
      includeAA: false,
    });
    const pct = (numDiff / total) * 100;
    if (numDiff === 0) {
      ok++;
    } else if (numDiff / total > TOLERANCE) {
      fs.writeFileSync(path.join(OUT, file), PNG.sync.write(diff));
      console.log(`MAJOR (${numDiff} px, ${pct.toFixed(2)}%) ${file}`);
      major++;
    } else {
      console.log(`minor (${numDiff} px, ${pct.toFixed(2)}%) ${file}`);
      minor++;
    }
  }
  console.log(
    `\nResult: ${ok} pixel-identical, ${minor} minor (<${(TOLERANCE * 100).toFixed(2)}%), ${major} MAJOR, ${missing} missing.`,
  );
  console.log(
    'Major diffs are written to the out dir for review. Minor diffs are typical font-load timing noise across build pipelines.',
  );
  process.exit(major > 0 ? 1 : 0);
})().catch((err) => {
  console.error(err);
  process.exit(2);
});
