import { execFile, spawnSync } from 'node:child_process';
import { mkdtemp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { promisify } from 'node:util';

const run = promisify(execFile);
const projectRoot = process.cwd();
const testRoot = await mkdtemp(path.join(tmpdir(), 'onganda-package-'));

try {
  const { stdout } = await run(
    'npm',
    ['pack', '--ignore-scripts', '--json', '--pack-destination', testRoot],
    { cwd: projectRoot }
  );
  const [{ filename }] = JSON.parse(stdout);
  const consumerRoot = path.join(testRoot, 'consumer');

  await mkdir(consumerRoot);
  await writeFile(
    path.join(consumerRoot, 'package.json'),
    JSON.stringify({ name: 'onganda-consumer-smoke', private: true, type: 'module' })
  );
  await run(
    'npm',
    [
      'install',
      '--ignore-scripts',
      '--no-package-lock',
      path.join(testRoot, filename),
      '@types/react@^19.0.0',
      '@types/react-dom@^19.0.0',
    ],
    { cwd: consumerRoot }
  );
  await writeFile(
    path.join(consumerRoot, 'verify.mjs'),
    `
      import {
        COLOR, PixelButton, roles, STATUS, statusFor, onColor, ALPHA,
        SYSTEM_COLOR, CHART_SERIES, COLOR_POLICY,
        PixelField, PixelInput, PixelTextarea, PixelSelect,
        PixelCheckbox, PixelRadio, PixelToggle, PixelDot, MOTION, SPACE,
      } from '@onganda/design-system/core';
      import { ChartGallery } from '@onganda/design-system/charts';
      import { DocumentEditor } from '@onganda/design-system/editors';
      import { AiAuthoringPanel } from '@onganda/design-system/ai';
      import { OngandaMap } from '@onganda/design-system/maps';
      import { OngandaPublicSite } from '@onganda/design-system/sites';
      import { DarkProvider } from '@onganda/design-system';

      // The role layer is the colour contract: if it stops resolving, every
      // consumer silently falls back to hand-picked colours.
      const light = roles(false);
      const dark = roles(true);

      const lin = v => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; };
      const lum = ([r, g, b]) => 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
      const hexRgb = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16));
      const over = (fg, bg, a) => fg.map((c, i) => c * a + bg[i] * (1 - a));
      const contrastOf = (fg, bg) => { const [x, y] = [lum(fg), lum(bg)]; const [hi, lo] = x > y ? [x, y] : [y, x]; return (hi + 0.05) / (lo + 0.05); };
      const canvas = hexRgb(COLOR.milletClay);
      const mutedClears45 = contrastOf(over(hexRgb(COLOR.charBlack), canvas, ALPHA.muted.light), canvas) >= 4.5;
      const roleLayerIsIntact =
        light.actionBg === COLOR.charBlack &&
        dark.actionBg === COLOR.milletClay &&
        // Ochre is 2.4:1 as ink on light, so the light accent ink is bark rust.
        light.accentInk === COLOR.barkRust &&
        dark.accentInk === COLOR.ochreOrange &&
        light.focusRing === COLOR.barkRust &&
        light.controlOn === COLOR.ochreOrange &&
        light.controlOnFg === COLOR.charBlack &&
        // Fired red cannot host small text, so danger fills with bark rust.
        light.dangerBg === COLOR.barkRust &&
        dark.canvas === COLOR.darkBg &&
        light.surfaceWell === COLOR.milletClay &&
        dark.surfaceWell === COLOR.darkBg &&
        dark.inverseBorder === COLOR.ochreOrange &&
        Object.keys(light).length === Object.keys(dark).length &&
        STATUS.critical === COLOR.firedRed &&
        statusFor('settled', true) === COLOR.mopaneBrownLight &&
        statusFor('settled', false) === COLOR.mopaneBrown &&
        onColor(COLOR.ochreOrange) === COLOR.charBlack &&
        onColor(COLOR.barkRust) === COLOR.dustLight &&
        // Assert the contract, not the number: muted text must clear 4.5:1
        // against the canvas. Pinning the literal made this drift the moment
        // the floor moved to cover the editor grounds.
        mutedClears45 &&
        SYSTEM_COLOR.Oshitoo === COLOR.dyePlum &&
        CHART_SERIES[0] === COLOR.ochreOrange &&
        Object.keys(COLOR_POLICY).length === Object.keys(COLOR).length;

      if (!roleLayerIsIntact) throw new Error('The colour role layer did not resolve correctly.');

      const exportsAreUsable = [
        COLOR.ochreOrange,
        PixelButton,
        PixelField, PixelInput, PixelTextarea, PixelSelect,
        PixelCheckbox, PixelRadio, PixelToggle,
        PixelDot, MOTION.tap, SPACE.cardPad,
        ChartGallery,
        DocumentEditor,
        AiAuthoringPanel,
        OngandaMap,
        OngandaPublicSite,
        DarkProvider,
        import.meta.resolve('@onganda/design-system/maps.css'),
        import.meta.resolve('@onganda/design-system/style.css'),
      ].every(Boolean);

      if (!exportsAreUsable) throw new Error('A public package export is unavailable.');
    `
  );
  await run('node', ['verify.mjs'], { cwd: consumerRoot });
  await writeFile(
    path.join(consumerRoot, 'verify.ts'),
    `
      import {
        COLOR, PixelButton, PixelField, PixelInput, PixelCheckbox, PixelRadio, PixelToggle,
        roles, onColor, statusFor, type ColorRoles, type StatusName, type PixelButtonVariant,
      } from '@onganda/design-system/core';
      import { ChartGallery } from '@onganda/design-system/charts';
      import { DocumentEditor } from '@onganda/design-system/editors';
      import { AiAuthoringPanel } from '@onganda/design-system/ai';
      import { OngandaMap, type OngandaMapPoint } from '@onganda/design-system/maps';
      import { OngandaPublicSite } from '@onganda/design-system/sites';

      const color: string = COLOR.ochreOrange;
      const point: OngandaMapPoint = { id: 'windhoek', position: [-22.5609, 17.0658], label: 'Windhoek' };
      const theme: ColorRoles = roles(false);
      const surface: string = theme.surface;
      const state: StatusName = 'settled';
      const intent: PixelButtonVariant = 'danger';
      void [
        color, point, surface, statusFor(state, true), onColor(COLOR.ochreOrange), intent,
        PixelButton, PixelField, PixelInput, PixelCheckbox, PixelRadio, PixelToggle,
        ChartGallery, DocumentEditor, AiAuthoringPanel, OngandaMap, OngandaPublicSite,
      ];
    `
  );
  await run(
    'node',
    [
      path.join(projectRoot, 'node_modules/typescript/bin/tsc'),
      '--noEmit',
      '--strict',
      '--skipLibCheck',
      'false',
      '--target',
      'ES2020',
      '--module',
      'ESNext',
      '--moduleResolution',
      'Bundler',
      '--jsx',
      'react-jsx',
      'verify.ts',
    ],
    { cwd: consumerRoot }
  );
  // The README's "Build a screen" example is the first thing a new consumer
  // copies. Compile the real block from the file so it can never rot.
  const readme = await readFile(path.join(projectRoot, 'README.md'), 'utf8');
  const example = readme.match(/## Build a screen[\s\S]*?```tsx\n([\s\S]*?)```/);
  if (!example) throw new Error('README.md no longer has a "Build a screen" tsx example to verify.');
  await writeFile(path.join(consumerRoot, 'readme-example.tsx'), example[1]);
  await run(
    'node',
    [
      path.join(projectRoot, 'node_modules/typescript/bin/tsc'),
      '--noEmit', '--strict', '--skipLibCheck', 'false',
      '--target', 'ES2020', '--module', 'ESNext', '--moduleResolution', 'Bundler',
      '--jsx', 'react-jsx', 'readme-example.tsx',
    ],
    { cwd: consumerRoot }
  );

  // The gate ships with the package: a consumer must be able to run it.
  await writeFile(
    path.join(consumerRoot, 'drift.tsx'),
    'export const Bad = () => <div className="bg-blue-500" style={{ borderRadius: 8 }} />;\n'
  );
  const gate = spawnSync(
    process.execPath,
    [path.join(consumerRoot, 'node_modules/@onganda/design-system/scripts/onganda-check.mjs'), 'drift.tsx'],
    { cwd: consumerRoot, encoding: 'utf8' }
  );
  if (gate.status === 0) {
    throw new Error('onganda-check did not flag a consumer file using a Tailwind colour and a rounded corner.');
  }
  if (!/tailwind-color/.test(gate.stdout) || !/rounded-geometry/.test(gate.stdout)) {
    throw new Error(`onganda-check ran but missed the planted drift:\n${gate.stdout}\n${gate.stderr}`);
  }

  const contrast = spawnSync(
    process.execPath,
    [path.join(consumerRoot, 'node_modules/@onganda/design-system/scripts/onganda-check.mjs'), '--contrast'],
    { cwd: consumerRoot, encoding: 'utf8' }
  );
  if (contrast.status !== 0) {
    throw new Error(`onganda-check --contrast failed from a consumer install:\n${contrast.stdout}\n${contrast.stderr}`);
  }
} finally {
  await rm(testRoot, { recursive: true, force: true });
}
