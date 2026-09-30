#!/usr/bin/env node
// ─── Onganda Design System — consumer test pages, against the reference ─────
// The test pages under /test are built only from '@onganda/design-system', the
// way a product would build them. This screenshots each one at desktop and
// phone width, then lays it beside the reference shots it should resemble, so
// the difference between "built from the package" and "the showcase" is
// something you look at, not something you argue about.
//
//   npm run test-pages           (needs `npm run build` first)
//
// Writes screenshots/test-pages/*.png and COMPARE.md. Every shot in
// reference/ is paired with at least one page.

import { chromium } from 'playwright';
import { mkdirSync, writeFileSync, rmSync, existsSync, readFileSync, readdirSync } from 'node:fs';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(HERE, '..');
const ref = path.join(root, 'reference');
const out = path.join(root, 'screenshots/test-pages');

// page, route, what it tests, the reference shots it should sit beside.
const PAGES = [
  ['app', '/test/app', 'A product screen: quiet chrome, one feature surface, a table, an inspector, a dialog.',
   ['product-surface', 'patterns-light', 'controls-light']],
  ['dashboard', '/test/dashboard', 'A monitoring dashboard: stat band, charts drawn with recharts, a status table, notices.',
   ['site-signal-band', 'charts', 'roadmap', 'connection-diagram']],
  ['form', '/test/form', 'A multi-section form: every control in every state, a summary, an inverse panel.',
   ['controls-light', 'controls-inverse', 'site-contact']],
  ['landing', '/test/landing', 'An editorial page: hero, ticker, system grid, focus rows, editorial section, contact, footer.',
   ['site-systems-grid', 'system-cards', 'site-focus-rows', 'site-contact', 'icons', 'palette']],
  ['article', '/test/article', 'A reading surface: long-form type, a results table, a pull quote, a side rail.',
   ['publications', 'brand-principles']]
];

if (!existsSync(path.join(root, 'dist/showcase/index.html')) && !existsSync(path.join(root, 'dist/index.html'))) {
  throw new Error('capture-test-pages: no build — run `npm run build` first');
}
const refs = readdirSync(ref).filter(f => f.endsWith('.png')).map(f => f.replace(/\.png$/, ''));
const unpaired = refs.filter(r => !PAGES.some(p => p[3].includes(r)));
if (unpaired.length) throw new Error(`capture-test-pages: reference shots with no test page beside them: ${unpaired.join(', ')}`);

const preview = spawn('npx', ['vite', 'preview', '--host', '127.0.0.1', '--port', '4181'], { cwd: root, stdio: 'ignore' });
for (let i = 0; ; i++) {
  try { if ((await fetch('http://127.0.0.1:4181/')).ok) break; } catch { /* not up yet */ }
  if (i > 60) throw new Error('capture-test-pages: preview server did not start');
  await new Promise(r => setTimeout(r, 500));
}

rmSync(out, { recursive: true, force: true });
mkdirSync(out, { recursive: true });
const browser = await chromium.launch();
const errors = [];

const shoot = async (route, file, viewport) => {
  const page = await browser.newPage({ viewport, reducedMotion: 'reduce' });
  page.on('pageerror', e => errors.push(`${route}: ${e.message}`));
  page.on('console', m => { if (m.type() === 'error') errors.push(`${route}: ${m.text()}`); });
  await page.goto(`http://127.0.0.1:4181${route}`, { waitUntil: 'networkidle' });
  await page.locator('[data-test-page]').waitFor({ timeout: 20000 });
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 500) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 60)); }
    window.scrollTo(0, 0);
  });
  await page.waitForTimeout(600);
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  if (overflow > 1) errors.push(`${route} at ${viewport.width}px: ${overflow}px of horizontal overflow`);
  await page.screenshot({ path: path.join(out, file), fullPage: true, animations: 'disabled' });
  await page.close();
};

const dataUri = f => `data:image/png;base64,${readFileSync(f).toString('base64')}`;
const rows = [];

for (const [name, route, why, against] of PAGES) {
  await shoot(route, `${name}.png`, { width: 1280, height: 900 });
  await shoot(route, `${name}-mobile.png`, { width: 390, height: 844 });

  // The comparison sheet: the page on the left, its references on the right,
  // both at the same scale so weight, colour and density compare directly.
  const sheet = await browser.newPage({ viewport: { width: 1320, height: 900 } });
  await sheet.setContent(`<!doctype html><body style="margin:0;background:#fff;font:600 13px Inter,Arial">
    <div style="display:grid;grid-template-columns:640px 640px;gap:40px;padding:20px">
      <div><p>Built from the package — ${route}</p><img src="${dataUri(path.join(out, `${name}.png`))}" style="width:640px;display:block"></div>
      <div><p>Reference</p>${against.map(r => `<p style="margin:16px 0 6px;font-weight:500">${r}.png</p><img src="${dataUri(path.join(ref, `${r}.png`))}" style="width:640px;display:block">`).join('')}</div>
    </div></body>`);
  await sheet.waitForTimeout(300);
  await sheet.screenshot({ path: path.join(out, `compare-${name}.png`), fullPage: true });
  await sheet.close();

  rows.push({ name, route, why, against });
  console.log(`  ${name}.png, ${name}-mobile.png, compare-${name}.png`);
}

await browser.close();
preview.kill();

writeFileSync(path.join(out, 'COMPARE.md'), `# Consumer test pages against the reference

Each page under \`/test\` is built only from \`@onganda/design-system\`, the way
a product would build it (\`src/test-pages\`). Regenerate with
\`npm run test-pages\` after \`npm run build\`.

Open a \`compare-*.png\`: the page on the left, the reference shots it should
resemble on the right, at the same scale. If the left side reads as a cheaper
version of the right, the gap is in the package, not in the page.

| Page | Route | What it tests | Compared with |
|---|---|---|---|
${rows.map(r => `| [\`${r.name}\`](./compare-${r.name}.png) | \`${r.route}\` | ${r.why} | ${r.against.map(a => `\`${a}\``).join(', ')} |`).join('\n')}
`);

if (errors.length) {
  console.error(`\n${errors.length} problem(s):\n  ${errors.join('\n  ')}`);
  process.exit(1);
}
console.log(`Wrote ${rows.length} pages, ${rows.length * 3} screenshots and COMPARE.md`);
