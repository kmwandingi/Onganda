#!/usr/bin/env node
// ─── Onganda Design System — reference screenshots ──────────────────────────
// Every primitive and pattern, as the showcase actually renders it.
//
// An agent can read DESIGN_SYSTEM.md end to end and still produce something
// that is correct and flat: the rules say what is forbidden, not what a
// finished surface looks like. These are the finished surfaces. Look at them
// before building, and again after, and compare.
//
//   npm run reference            (needs `npm run build` first)
//
// Writes reference/*.png and reference/INDEX.md. Both are committed, so an
// agent reads them without running anything.

import { chromium } from 'playwright';
import { mkdirSync, writeFileSync, rmSync, existsSync } from 'node:fs';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(HERE, '..');
const dist = path.join(root, 'dist');
const out = path.join(root, 'reference');

// route, selector, file, what it is for, which exports it demonstrates.
const SHOTS = [
  ['/showcase', '#controls-stage', 'controls-light',
   'Every sanctioned control, every state, on a light surface.',
   ['PixelButton', 'PixelInput', 'PixelTextarea', 'PixelSelect', 'PixelField', 'PixelCheckbox', 'PixelRadio', 'PixelToggle', 'PixelDot', 'PixelTag', 'DensityProvider']],
  ['/showcase', '[data-testid="controls-inverse"]', 'controls-inverse',
   'The same controls on a locally dark surface. Pass isDark when a control sits on the footer, the ticker or a lab card.',
   ['PixelButton', 'PixelToggle', 'PixelCheckbox', 'WeaveOverlay']],
  ['/showcase', '#patterns-stage', 'patterns-light',
   'The compounds a product needs on day one, plus the site compositions.',
   ['PixelNotice', 'PixelDialog', 'PixelTable', 'PixelEmptyState', 'PixelSkeleton', 'PixelTabs', 'PixelProgress', 'PixelPanel', 'PixelChoice', 'PixelChoiceList', 'PixelActions', 'PixelTicker', 'PixelFocusRow', 'PixelLabCard', 'PixelStatBand']],
  ['/showcase', '[data-testid="showcase-stepline"]', 'stepline',
   'A numbered sequence in the pixel language: one accent per node, a staircase connector, vertical on a phone and horizontal above `md`.',
   ['PixelStepLine']],
  ['/showcase', '[data-testid="showcase-document-viewer"]', 'document-viewer',
   'A document page with regions a finding can light up: focusable region boxes, a status hue plus its label, and the findings beside it.',
   ['PixelDocumentViewer', 'DocumentRegion']],
  ['/showcase', '[data-testid="showcase-nav-switcher"]', 'nav-switcher',
   'The suite switcher above a nav\'s own items: the active product takes the accent-ink edge.',
   ['PixelNav', 'PixelNavProduct']],
  ['/showcase', '#product-surface', 'product-surface',
   'An APP screen, not a marketing page. Quiet chrome, colour on the work: peers with their own accent and ordinal, a meter for strength, an ochre primary. Copy this for a tool; copy the site shots for a public page.',
   ['PixelNav', 'PixelPanel', 'PixelMeter', 'PixelDropZone', 'PixelField', 'PixelSelect', 'PixelProgress', 'PixelButton']],
  ['/showcase', '#expressive-range', 'expressive-range',
   'The same content three ways — even grid, bento with a raised tinted feature and lifting peers, inverse statement. The system fixes colour, type and geometry, not composition: pick different dials per page so pages do not look alike.',
   ['PixelPanel depth/tone', 'PixelInversePanel', 'ICON_SIZE.display', 'PixelButton lift', 'accentFor']],
  ['/showcase', '#systems', 'system-cards',
   'The five-system card and the inverse cell that closes a grid. Note one accent per card, spent on the spine and the tag.',
   ['SystemCard', 'PixelLabCard', 'SectionHeader', 'PixelTag']],
  ['/showcase', '#connection-diagram', 'connection-diagram',
   'A diagram in the pixel language rather than a generic chart.',
   ['SystemConnectionDiagram']],
  ['/showcase', '#palette', 'palette',
   'The nine pigments and what each one is allowed to do.',
   ['SwatchChip', 'COLOR', 'COLOR_POLICY']],
  ['/showcase', '#roadmap', 'roadmap',
   'A phased timeline. Each phase owns a hue.',
   ['RoadmapTimeline', 'PixelTag']],
  ['/showcase', '#chart-gallery', 'charts',
   'Every chart on one palette, with the Onganda grid and marks.',
   ['ChartGallery', 'CHART_SERIES']],
  ['/showcase', '#icon-bank', 'icons',
   'The interface icon set, drawn on a 12x12 pixel grid.',
   ['ICON_REGISTRY', 'Px']],
  ['/showcase', '#publications', 'publications',
   'Document and publication cards.',
   ['Publications']],
  ['/showcase', '#language', 'brand-principles',
   'The principles a surface is judged against.',
   ['PrincipleRow', 'SectionHeader']],
  ['/', '#systems', 'site-systems-grid',
   'The reference implementation of a card grid. This is the bar.',
   ['SystemCard', 'PixelLabCard', 'SectionHeader']],
  ['/', '#why', 'site-signal-band',
   'An inverse panel beside a grid of feature cards — the page rhythm to copy.',
   ['PixelInversePanel', 'PixelPanel', 'PixelCornerMarks', 'PixelTag']],
  ['/', '#contact', 'site-contact',
   'The closing surface: the largest card on the page, not a thin footer.',
   ['PixelContactPanel', 'PixelField', 'PixelInput', 'PixelTextarea', 'PixelButton']],
  ['/full', '#focus', 'site-focus-rows',
   'A list that reads as a sequence. Each row owns a hue.',
   ['PixelEditorialSection', 'PixelFocusRow']],
];

if (!existsSync(path.join(dist, 'showcase', 'index.html'))) {
  throw new Error('capture-reference: dist/showcase/index.html missing — run `npm run build` first');
}

// Reuse the preview server the browser tests already run against rather than
// hand-rolling one: a static server that does not know the SPA's routes
// serves a shell with no app in it, and every shot comes back empty.
const preview = spawn('npx', ['vite', 'preview', '--host', '127.0.0.1', '--port', '4180'], {
  cwd: root, stdio: 'ignore'
});
const ready = async () => {
  for (let i = 0; i < 60; i++) {
    try { if ((await fetch('http://127.0.0.1:4180/')).ok) return; } catch { /* not up yet */ }
    await new Promise(r => setTimeout(r, 500));
  }
  throw new Error('capture-reference: preview server did not start');
};
await ready();

rmSync(out, { recursive: true, force: true });
mkdirSync(out, { recursive: true });

const browser = await chromium.launch();
// Reduced motion so the shots are stable and the perpetual animations stop.
const page = await browser.newPage({ viewport: { width: 1280, height: 1000 }, reducedMotion: 'reduce' });
const rows = [];

for (const [route, selector, name, why, exports] of SHOTS) {
  await page.goto(`http://127.0.0.1:4180${route}`, { waitUntil: 'networkidle' });
  // Walk the page so scroll-triggered entrances have played.
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 600) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 60)); }
    window.scrollTo(0, 0);
  });
  const el = page.locator(selector).first();
  // Wait for the section, do not merely count it. The showcase is behind
  // React.lazy, so `networkidle` fires before the chunk has painted and an
  // immediate count returns zero for sections that are plainly there.
  try {
    await el.waitFor({ state: 'attached', timeout: 20000 });
  } catch {
    console.warn(`  skip ${name}: ${selector} not on ${route}`);
    continue;
  }
  await el.scrollIntoViewIfNeeded();
  await page.waitForTimeout(700);
  await el.screenshot({ path: path.join(out, `${name}.png`), animations: 'disabled' });
  rows.push({ name, route, selector, why, exports });
  console.log(`  ${name}.png`);
}

await browser.close();
preview.kill();

const index = `# Reference screenshots

Every primitive and pattern as the showcase renders it. Regenerate with
\`npm run reference\` after \`npm run build\`.

**Look at these before building a surface, and again after.** The written
rules say what is forbidden; a surface can satisfy every one of them and
still be flat. These show what finished looks like — how much colour a page
carries, how much texture, how many rules, and how the weights sit together.

**Copy the right kind.** \`product-surface.png\` is an app screen; the
\`site-*\` shots are public pages; the rest are editorial specimens. A tool
built from editorial devices is the most common cheap imitation.

When you have built something, put your screenshot beside the closest one
here and ask what is different. Usually: colour spent on metadata instead of
identity or state, every surface at feature weight instead of one or two, or
an editorial device (ticker, stat band) on a working screen.

| Screenshot | Shows | Demonstrates |
|---|---|---|
${rows.map(r => `| [\`${r.name}.png\`](./${r.name}.png) | ${r.why} | ${r.exports.map(e => `\`${e}\``).join(', ')} |`).join('\n')}

Captured from \`${rows.map(r => r.route).filter((v, i, a) => a.indexOf(v) === i).join('\`, \`')}\` at 1280px with reduced motion.
`;
writeFileSync(path.join(out, 'INDEX.md'), index);
console.log(`\nWrote reference/INDEX.md — ${rows.length} screenshots`);
