#!/usr/bin/env node
// ─── onganda-check ───────────────────────────────────────────────────────────
// The design-system gate, runnable from a consumer project:
//
//   npx onganda-check src/            check a consumer's own source
//   npx onganda-check --contrast      re-measure the role layer's ratios in every palette
//
// Rules that live only in prose get ignored. This ships with the package so a
// product built on Onganda can fail its own build on the same rules the
// system enforces on itself.

import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const here = path.dirname(fileURLToPath(import.meta.url));
const args = process.argv.slice(2);

const run = (script, extra = []) => {
  const r = spawnSync(process.execPath, [path.join(here, script), ...extra], { stdio: 'inherit' });
  return r.status ?? 1;
};

if (args.includes('--help') || args.includes('-h')) {
  console.log(`onganda-check — Onganda design-system gate

  onganda-check [paths...]   check the given files or directories (default: src)
  onganda-check --contrast   re-measure the colour role layer against WCAG AA, in every palette
  onganda-check --all        run both

Rules: tailwind-color, off-palette-hex, off-palette-rgba, modern-color-fn,
system-colour-as-chrome, raw-status-colour, rounded-geometry.
Declare an exception inline:  // onganda-allow: <rule-id> — <reason>`);
  process.exit(0);
}

let status = 0;
if (args.includes('--contrast') || args.includes('--all')) status |= run('check-contrast.mjs');
if (!args.includes('--contrast')) {
  const paths = args.filter(a => !a.startsWith('-'));
  status |= run('check-design-tokens.mjs', paths.length ? ['--paths', ...paths] : []);
}
process.exit(status ? 1 : 0);
