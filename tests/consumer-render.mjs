// ─── Consumer render check ───────────────────────────────────────────────────
// The package smoke test resolves every export and type-checks the README
// example. It never renders a pixel — so a consumer who follows the README and
// misses the Tailwind content configuration gets structurally correct,
// visually broken components, and every test still passes.
//
// This builds a real Vite + React + Tailwind app against the packed tarball,
// following the README setup verbatim, then renders it and asserts that:
//   1. the package's inline role styles actually apply, and
//   2. the Tailwind utilities used *inside* the package were generated,
//      which only happens if the documented `@source` line is correct.
//
// It deliberately also builds a second app WITHOUT that line, to prove the
// check can tell the two apart. A check that passes either way is worthless.

import { execFile } from 'node:child_process';
import { mkdtemp, mkdir, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { promisify } from 'node:util';
import { chromium } from 'playwright';
import { createServer } from 'node:http';
import { readFile as readFileFs } from 'node:fs/promises';

const run = promisify(execFile);
const projectRoot = process.cwd();
const testRoot = await mkdtemp(path.join(tmpdir(), 'onganda-render-'));

const APP = `
import { createRoot } from 'react-dom/client';
import { DarkProvider, PixelButton, SectionHeader, PixelField, PixelInput, StatCard, roles, COLOR } from '@onganda/design-system';
import '@onganda/design-system/style.css';
import './app.css';

const c = roles(false);

function App() {
  return (
    <DarkProvider>
      <main id="app" style={{ background: c.canvas, padding: 40 }}>
        <SectionHeader label="Consumer check" headline="Does this render?" isDark={false} />
        <PixelField label="Email" htmlFor="e"><PixelInput id="e" placeholder="name@x.na" /></PixelField>
        <PixelButton variant="primary">Primary</PixelButton>
        <PixelButton variant="danger">Delete</PixelButton>
        <div id="stat"><StatCard stat={{ value: '5', label: 'Active systems', sub: 'in architecture', hex: COLOR.ochreOrange }} /></div>
        <p id="css-var" style={{ color: 'var(--onganda-text-muted)' }}>styled from tokens.css</p>
        <div id="tw-surface" className="bg-surface">Tailwind role utility</div>
        <div id="tw-blue" className="bg-blue-500">a hue the system does not have</div>
      </main>
    </DarkProvider>
  );
}
createRoot(document.getElementById('root')).render(<App />);
`;

const buildApp = async (name, tailwindSource, tailwind = true) => {
  const root = path.join(testRoot, name);
  await mkdir(root, { recursive: true });
  await writeFile(path.join(root, 'package.json'), JSON.stringify({
    name, private: true, type: 'module', scripts: { build: 'vite build' }
  }));
  await writeFile(path.join(root, 'index.html'),
    `<!doctype html><html><body><div id="root"></div><script type="module" src="/main.jsx"></script></body></html>`);
  await writeFile(path.join(root, 'main.jsx'), APP);
  // Exactly the CSS the README tells a Tailwind 4 consumer to write.
  await writeFile(path.join(root, 'app.css'),
    tailwind ? `@import 'tailwindcss';\n${tailwindSource}\n` : '/* no tailwind in this consumer */\n');
  await writeFile(path.join(root, 'vite.config.js'), tailwind
    ? `import { defineConfig } from 'vite';\nimport react from '@vitejs/plugin-react';\nimport tailwindcss from '@tailwindcss/vite';\nexport default defineConfig({ plugins: [react(), tailwindcss()], base: './' });\n`
    : `import { defineConfig } from 'vite';\nimport react from '@vitejs/plugin-react';\nexport default defineConfig({ plugins: [react()], base: './' });\n`);
  return root;
};

let browser;
try {
  const { stdout } = await run('npm', ['pack', '--ignore-scripts', '--json', '--pack-destination', testRoot], { cwd: projectRoot });
  const [{ filename }] = JSON.parse(stdout);
  const tarball = path.join(testRoot, filename);

  const deps = [
    tarball, 'react@^19', 'react-dom@^19', 'framer-motion@^11', 'recharts@^2',
    'vite@^6', '@vitejs/plugin-react@^4', 'tailwindcss@^4', '@tailwindcss/vite@^4',
  ];

  // Verbatim from the README's Tailwind 4 instruction.
  const WITH_SOURCE = `@source "./node_modules/@onganda/design-system/dist/package";`;

  // All three must lay out. The package ships the utility classes its own
  // components carry (scripts/build-layout-css.mjs), so a component no longer
  // depends on the consumer's CSS pipeline to position itself.
  //
  // Before that, `no-tailwind` was the broken case and nothing here covered
  // it: the FirstRung side panel imports only this package's stylesheet, its
  // CSS contained zero flex rules, and StatCard collapsed into a jumble.
  const cases = [
    { name: 'configured', source: WITH_SOURCE, tailwind: true, expectStyled: true },
    { name: 'misconfigured', source: '', tailwind: true, expectStyled: true },
    { name: 'no-tailwind', source: '', tailwind: false, expectStyled: true },
    // The semantic tokens as Tailwind utilities. `bg-surface` must resolve to
    // the role and `bg-blue-500` must not exist at all.
    { name: 'tailwind-theme', source: `@import '@onganda/design-system/tailwind.css';`, tailwind: true, expectStyled: true, theme: true },
    // style.css imported from CSS, after tailwindcss — how most Tailwind apps
    // do it. A remote @import in style.css is dropped here because it is no
    // longer first, which is how every heading in a product fell back to
    // Inter. The faces now ship with the package and must load in this case.
    { name: 'css-import', source: `@import '@onganda/design-system/style.css';`, tailwind: true, expectStyled: true, cssImport: true },
  ];

  browser = await chromium.launch();
  const results = {};

  // One app, one install, two builds. Installing per case doubled the slowest
  // step for no extra coverage.
  const root = await buildApp('app', cases[0].source);
  await run('npm', ['install', '--no-package-lock', '--no-audit', '--no-fund', '--prefer-offline', ...deps], { cwd: root, maxBuffer: 1 << 26 });

  for (const { name, source, tailwind, expectStyled, theme, cssImport } of cases) {
    await writeFile(path.join(root, 'main.jsx'),
      cssImport ? APP.replace("import '@onganda/design-system/style.css';\n", '') : APP);
    await writeFile(
      path.join(root, 'app.css'),
      tailwind ? `@import 'tailwindcss';\n${source}\n` : '/* package CSS only */\n',
    );
    await writeFile(
      path.join(root, 'vite.config.js'),
      tailwind
        ? `import { defineConfig } from 'vite';\nimport react from '@vitejs/plugin-react';\nimport tailwindcss from '@tailwindcss/vite';\nexport default defineConfig({ plugins: [react(), tailwindcss()], base: './' });\n`
        : `import { defineConfig } from 'vite';\nimport react from '@vitejs/plugin-react';\nexport default defineConfig({ plugins: [react()], base: './' });\n`,
    );
    await rm(path.join(root, 'dist'), { recursive: true, force: true });
    await run('npm', ['run', 'build'], { cwd: root, maxBuffer: 1 << 26 });

    // ES modules are blocked over file://, so serve the build.
    const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.woff2': 'font/woff2' };
    const server = createServer(async (req, res) => {
      const rel = decodeURIComponent(req.url.split('?')[0]);
      const file = path.join(root, 'dist', rel === '/' ? 'index.html' : rel);
      try {
        const body = await readFileFs(file);
        res.writeHead(200, { 'content-type': types[path.extname(file)] ?? 'application/octet-stream' });
        res.end(body);
      } catch { res.writeHead(404).end('not found'); }
    });
    await new Promise(r => server.listen(0, '127.0.0.1', r));
    const origin = `http://127.0.0.1:${server.address().port}`;

    const page = await browser.newPage();
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    await page.goto(origin + '/');
    await page.waitForSelector('#app', { timeout: 15_000 });
    await page.waitForTimeout(400);
    await page.evaluate(() => document.fonts.ready);

    const probe = await page.evaluate(() => {
      const btn = [...document.querySelectorAll('button')].find(b => b.textContent.trim() === 'Primary');
      const danger = [...document.querySelectorAll('button')].find(b => b.textContent.trim() === 'Delete');
      const label = document.querySelector('h2, label, p');
      // SectionHeader's eyebrow relies on Tailwind's `uppercase` + `tracking-*`.
      // The innermost node carrying the text, not a wrapper.
      const eyebrow = [...document.querySelectorAll('*')]
        .filter(el => (el.textContent || '').trim() === 'Consumer check' && el.children.length === 0)
        .pop();
      const s = eyebrow ? getComputedStyle(eyebrow) : null;
      // Also ask the stylesheets directly: did Tailwind emit the utility at all?
      // Tailwind 4 nests utilities inside @layer, so this recurses. It is
      // diagnostic only — the computed style is what a user actually sees.
      let utilityEmitted = false;
      const scan = rules => {
        for (const rule of rules ?? []) {
          if (rule.selectorText && /\.uppercase\b/.test(rule.selectorText)) return true;
          if (rule.cssRules && scan(rule.cssRules)) return true;
        }
        return false;
      };
      for (const sheet of document.styleSheets) {
        try { if (scan(sheet.cssRules)) { utilityEmitted = true; break; } } catch { /* cross-origin */ }
      }
      return {
        rendered: !!btn,
        primaryBg: btn ? getComputedStyle(btn).backgroundColor : null,
        dangerBg: danger ? getComputedStyle(danger).backgroundColor : null,
        primaryRadius: btn ? getComputedStyle(btn).borderTopLeftRadius : null,
        eyebrowTransform: s ? s.textTransform : null,
        eyebrowTag: eyebrow ? eyebrow.tagName + '.' + (eyebrow.className || '') : null,
        utilityEmitted,
        eyebrowTracking: s ? s.letterSpacing : null,
        statPadding: (() => { const card = document.querySelector('#stat > *'); return card ? getComputedStyle(card).paddingTop : null; })(),
        labelFound: !!label,
        rootMuted: getComputedStyle(document.documentElement).getPropertyValue('--onganda-text-muted').trim(),
        rootSurface: getComputedStyle(document.documentElement).getPropertyValue('--onganda-surface').trim(),
        cssVarColor: getComputedStyle(document.getElementById('css-var')).color,
        twSurfaceBg: getComputedStyle(document.getElementById('tw-surface')).backgroundColor,
        twBlueBg: getComputedStyle(document.getElementById('tw-blue')).backgroundColor,
        // Both faces actually loaded from the package, not merely named.
        fonts: [...document.fonts].filter(f => f.status === 'loaded').map(f => f.family.replace(/["']/g, '')),
      };
    });
    await page.close();
    await new Promise(r => server.close(r));
    results[name] = { probe, errors };

    if (errors.length) throw new Error(`${name}: runtime errors in a consumer app:\n  ${errors.join('\n  ')}`);
    if (!probe.rendered) throw new Error(`${name}: the package did not render at all.`);

    // Inline role styles come from the package and must work either way.
    if (probe.primaryBg !== 'rgb(217, 121, 31)') {
      throw new Error(`${name}: PixelButton primary background is ${probe.primaryBg}, expected ochre. The role layer did not survive packaging.`);
    }
    if (probe.dangerBg !== 'rgb(143, 62, 33)') {
      throw new Error(`${name}: PixelButton danger background is ${probe.dangerBg}, expected bark rust.`);
    }
    if (parseFloat(probe.primaryRadius) !== 0) {
      throw new Error(`${name}: a control rendered with a ${probe.primaryRadius} corner radius in a consumer app.`);
    }

    // The semantic tokens reach every consumer through style.css.
    // Compare numbers, not strings: a consumer's minifier writes 0.66 as .66.
    // A minifier may write the same colour as rgba(30,26,23,.66) or #1e1a17a8;
    // compare the channels, with the alpha to two places.
    const nums = v => {
      const hex = v.match(/^#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})?$/i);
      const n = hex
        ? [1, 2, 3].map(i => parseInt(hex[i], 16)).concat(hex[4] ? [parseInt(hex[4], 16) / 255] : [])
        : (v.match(/[\d.]+/g) || []).map(Number);
      return n.map((x, i) => (i === 3 ? x.toFixed(2) : String(x))).join(',');
    };
    if (nums(probe.rootMuted) !== '30,26,23,0.66') {
      throw new Error(`${name}: --onganda-text-muted is "${probe.rootMuted}" on :root; tokens.css did not reach the consumer.`);
    }
    if (probe.cssVarColor !== 'rgba(30, 26, 23, 0.66)') {
      throw new Error(`${name}: an element styled with var(--onganda-text-muted) computed to ${probe.cssVarColor}.`);
    }
    if (theme) {
      if (probe.twSurfaceBg !== 'rgb(243, 232, 195)') {
        throw new Error(`${name}: bg-surface computed to ${probe.twSurfaceBg}; the Tailwind theme did not map the role.`);
      }
      if (probe.twBlueBg !== 'rgba(0, 0, 0, 0)') {
        throw new Error(`${name}: bg-blue-500 computed to ${probe.twBlueBg}; the theme should reset Tailwind's palette so it does not compile.`);
      }
    }

    // Computed style is the contract: it is what the consumer sees.
    for (const face of ['Inter', 'Space Grotesk']) {
      if (!probe.fonts.includes(face)) {
        throw new Error(`${name}: the ${face} face did not load (loaded: ${probe.fonts.join(', ') || 'none'}). Headings fall back to Arial.`);
      }
    }
    // StatCard picks its classes with a condition; the packaged layout CSS once
    // skipped them, and the cell lost its padding in every consumer.
    if (expectStyled && probe.statPadding !== '32px') {
      throw new Error(`${name}: StatCard padding-top is ${probe.statPadding}, expected 32px (py-8). A conditional className was not packaged.`);
    }
    const styled = probe.eyebrowTransform === 'uppercase';
    if (styled !== expectStyled) {
      throw new Error(
        `${name}: packaged layout styles did not apply. eyebrow=${probe.eyebrowTag} text-transform=${probe.eyebrowTransform} utilityEmitted=${probe.utilityEmitted}.`,
      );
    }
  }

  console.log('Consumer render check passed.');
  for (const { name } of cases) {
    const probe = results[name].probe;
    console.log(`  ${name.padEnd(13)} → eyebrow ${probe.eyebrowTransform}, tracking ${probe.eyebrowTracking}, primary ${probe.primaryBg}`);
  }
  console.log('  Packaged components retain layout with configured, unconfigured, or absent Tailwind.');
  console.log(`  tokens.css reaches every case; with the theme, bg-surface = ${results['tailwind-theme'].probe.twSurfaceBg} and bg-blue-500 = ${results['tailwind-theme'].probe.twBlueBg}.`);
} finally {
  if (browser) await browser.close();
  await rm(testRoot, { recursive: true, force: true });
}
