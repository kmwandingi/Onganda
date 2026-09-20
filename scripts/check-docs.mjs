#!/usr/bin/env node
// ─── Onganda Design System — documentation guard ─────────────────────────────
// The same rules are restated in DESIGN_SYSTEM.md, DESIGN_GUIDELINES.md,
// README.md, the agent skill, CLAUDE.md and the Copilot instructions. Nothing
// checked that they agreed, which is the exact failure mode already fixed twice
// in code: a hand-copied list that drifts from what it describes.
//
// This asserts three things:
//   1. Every measurable claim in the prose matches the token source.
//   2. Every component the docs tell an agent to use is actually exported.
//   3. The rule set restated for agents covers the rules the docs define.
//
//   npm run check:docs

import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const root = existsSync(path.join(process.cwd(), 'DESIGN_SYSTEM.md')) ? process.cwd() : path.join(HERE, '..');
const read = f => readFileSync(path.join(root, f), 'utf8');

const DOCS = {
  'DESIGN_SYSTEM.md': read('DESIGN_SYSTEM.md'),
  'DESIGN_GUIDELINES.md': read('DESIGN_GUIDELINES.md'),
  'README.md': read('README.md'),
  'USAGE.md': read('USAGE.md'),
  'skills/onganda-design-system/SKILL.md': read('skills/onganda-design-system/SKILL.md'),
  'CLAUDE.md': read('CLAUDE.md'),
  '.github/copilot-instructions.md': read('.github/copilot-instructions.md'),
  '.cursorrules': read('.cursorrules'),
  '.windsurfrules': read('.windsurfrules')
};

const rolesSrc = read('src/components/onganda/onganda-roles.ts');
const colorsSrc = read('src/components/onganda/onganda-colors.ts');

const failures = [];
const fail = (doc, msg) => failures.push(`${doc}: ${msg}`);

// ── 1. Measurable claims must match the source ───────────────────────────────
const alpha = name => {
  const m = rolesSrc.match(new RegExp(`${name}:\\s*\\{\\s*light:\\s*([\\d.]+),\\s*dark:\\s*([\\d.]+)`));
  return m ? { light: m[1], dark: m[2] } : null;
};

const roleValue = (block, key) => {
  const start = rolesSrc.indexOf(`export const ${block}: ColorRoles = {`);
  const body = rolesSrc.slice(start, rolesSrc.indexOf('\n};', start));
  const m = body.match(new RegExp(`^\\s{2}${key}:\\s*(?:COLOR\\.(\\w+)|'([^']+)')`, 'm'));
  return m ? (m[1] ?? m[2]) : null;
};

// Claims the prose makes, and where the truth lives.
const CLAIMS = [
  {
    what: 'the light accent ink',
    truth: () => roleValue('ROLE_LIGHT', 'accentInk'),
    expect: 'barkRust',
    mustSay: /bark rust/i,
    in: ['DESIGN_SYSTEM.md', 'DESIGN_GUIDELINES.md', 'README.md', 'skills/onganda-design-system/SKILL.md', 'CLAUDE.md', '.cursorrules']
  },
  {
    what: 'the danger fill',
    truth: () => roleValue('ROLE_LIGHT', 'dangerBg'),
    expect: 'barkRust',
    mustSay: /danger.{0,80}bark rust|bark rust.{0,80}danger/is,
    in: ['DESIGN_SYSTEM.md', 'DESIGN_GUIDELINES.md', 'CLAUDE.md']
  },
  {
    what: 'the dark primary action fill',
    truth: () => roleValue('ROLE_DARK', 'actionBg'),
    expect: 'milletClay',
    mustSay: /millet clay/i,
    in: ['DESIGN_SYSTEM.md']
  },
  {
    what: 'the checked-control foreground',
    truth: () => roleValue('ROLE_LIGHT', 'controlOnFg'),
    expect: 'charBlack',
    mustSay: /char black/i,
    in: ['DESIGN_SYSTEM.md']
  }
];

for (const claim of CLAIMS) {
  const actual = claim.truth();
  if (actual !== claim.expect) {
    failures.push(`onganda-roles.ts: ${claim.what} is now "${actual}" but this guard still expects "${claim.expect}". Update the guard and every doc in: ${claim.in.join(', ')}`);
    continue;
  }
  for (const doc of claim.in) {
    if (!claim.mustSay.test(DOCS[doc])) fail(doc, `does not state ${claim.what} (${claim.expect}), which the other docs do`);
  }
}

// Alpha steps quoted in prose must be the real ones.
const muted = alpha('muted');
for (const [doc, text] of Object.entries(DOCS)) {
  for (const m of text.matchAll(/ink (\d?\.\d+)%?|ink (\d+)%/g)) { /* documented as a table, checked below */ }
  // The §4 role table quotes muted as "ink NN%".
  const quoted = text.match(/`textMuted`\s*\|\s*ink (\d+)%/);
  if (quoted) {
    const pct = String(Math.round(parseFloat(muted.light) * 100));
    if (quoted[1] !== pct) fail(doc, `quotes textMuted as ink ${quoted[1]}% but ALPHA.muted.light is ${muted.light} (${pct}%)`);
  }
}

// ── 2. Components the docs name must exist ───────────────────────────────────
// Follow the barrel and every re-export chain it reaches, plus the sub-entry
// points, so a symbol exported two levels down still counts as exported.
const exported = new Set();
const visited = new Set();
const collect = file => {
  if (visited.has(file) || !existsSync(file)) return;
  visited.add(file);
  const text = readFileSync(file, 'utf8');
  for (const m of text.matchAll(/export (?:const|function|interface|type) (\w+)/g)) exported.add(m[1]);
  for (const m of text.matchAll(/from '([./][\w./-]+)'/g)) {
    const base = path.resolve(path.dirname(file), m[1]);
    for (const ext of ['.tsx', '.ts']) collect(base + ext);
  }
};
for (const entry of ['index', 'core', 'charts', 'editors', 'ai', 'maps', 'sites']) {
  collect(path.join(root, 'src/design-system', entry + '.ts'));
}

const NAMED = new Set();
for (const text of Object.values(DOCS)) {
  for (const m of text.matchAll(/`(Pixel[A-Z]\w+|Onganda[A-Z]\w+|Icon[A-Z]\w+|SectionHeader|WeaveOverlay|DitherBar|DitherStrip|SystemCard|StatCard|SwatchChip|DarkProvider|useDark|roles|statusFor|onColor|inkOn|MOTION|SPACE|SYSTEM_COLOR|CHART_SERIES|COLOR_POLICY|ALPHA)`/g)) {
    NAMED.add(m[1]);
  }
}
for (const name of [...NAMED].sort()) {
  if (!exported.has(name)) failures.push(`docs reference \`${name}\` but no design-system module exports it`);
}

// ── 3. The agent rule sets must cover the same ground ────────────────────────
// These are the rules an agent must not miss. Each needs a matching statement
// in every file an agent might read first.
const AGENT_FILES = ['CLAUDE.md', '.github/copilot-instructions.md', '.cursorrules', '.windsurfrules', 'skills/onganda-design-system/SKILL.md'];
const AGENT_RULES = [
  ['style from roles', /roles\(isDark\)/],
  ['no raw hex or rgba', /raw hex|rgba\(\)/i],
  ['ochre is a fill, not light-mode ink', /2\.4:1|accentInk|bark rust/i],
  ['fired red is an indicator only', /fired red/i],
  ['system colours mean membership', /system colou?rs? mean|identify (Ombiga|Oshini)/i],
  ['no green or blue', /no green and no blue|has no green/i],
  ['never hand-roll a control', /hand-roll/i],
  ['no rounded corners', /rounded corner/i],
  ['read the showcase first', /showcase/i],
  ['composition, not just colours', /composition|thin page|SectionHeader/i],
  ['run the checks', /check:design|onganda-check/i]
];
for (const doc of AGENT_FILES) {
  for (const [rule, re] of AGENT_RULES) {
    if (!re.test(DOCS[doc])) fail(doc, `never states the rule "${rule}", but the other agent files do`);
  }
}

// ── 4. Commands quoted in docs must exist in package.json ────────────────────
const pkg = JSON.parse(read('package.json'));
const scripts = new Set(Object.keys(pkg.scripts ?? {}));
for (const [doc, text] of Object.entries(DOCS)) {
  for (const m of text.matchAll(/`npm run ([\w:]+)`/g)) {
    if (!scripts.has(m[1])) fail(doc, `tells the reader to run \`npm run ${m[1]}\`, which package.json does not define`);
  }
}

if (failures.length) {
  console.error('\nDocumentation guard failed:\n');
  for (const f of failures) console.error(`  ${f}`);
  console.error('\nThe rules are restated across several files. When one changes, they all must.');
  process.exit(1);
}
console.log(`Docs guard passed — ${Object.keys(DOCS).length} documents agree with the token source and with each other.`);
