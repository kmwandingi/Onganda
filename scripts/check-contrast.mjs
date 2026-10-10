#!/usr/bin/env node
// ─── Onganda Design System — contrast guard ──────────────────────────────────
// The colour policy in DESIGN_SYSTEM.md §4 makes measurable claims. This
// recomputes every one of them from the role recipe, for every palette in
// onganda-palettes.ts, and fails on a regression, so neither a token edit nor
// a new palette can quietly break a documented ratio.
//
//   npm run check:contrast          fail on any violation
//   npm run check:contrast -- --table  print the full measured table
//
// Thresholds are WCAG 2.2: 4.5:1 for small text, 3:1 for non-text boundaries
// and indicators. Roles exempt from a threshold are listed with a reason.

import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { readPalettes, readColorMap, colorFor } from './palette-source.mjs';

// Resolves whether this runs in the repo or from a consumer's node_modules.
const HERE = path.dirname(fileURLToPath(import.meta.url));
const REL = 'src/components/onganda';
const tokenFile = name => {
  const candidates = [path.join(process.cwd(), REL, name), path.join(HERE, '..', REL, name)];
  const hit = candidates.find(existsSync);
  if (!hit) throw new Error(`check-contrast: cannot find ${name}. Looked in:\n  ${candidates.join('\n  ')}`);
  return readFileSync(hit, 'utf8');
};

const src = tokenFile('onganda-roles.ts');
const colorsSrc = tokenFile('onganda-colors.ts');
const PALETTES = readPalettes(tokenFile('onganda-palettes.ts'));
const COLOR_MAP = readColorMap(colorsSrc);

const rgb = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16));
const lin = c => { c /= 255; return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4; };
const lum = c => 0.2126 * lin(c[0]) + 0.7152 * lin(c[1]) + 0.0722 * lin(c[2]);
const ratio = (a, b) => {
  const [x, y] = [lum(a), lum(b)];
  const [hi, lo] = x > y ? [x, y] : [y, x];
  return (hi + 0.05) / (lo + 0.05);
};
const over = (fg, bg, a) => fg.map((c, i) => Math.round(c * a + bg[i] * (1 - a)));

// Parse a role value: a hex, an rgba() on ink/paper, or 'transparent'.
const resolve = (value, bgHex) => {
  if (!value || value === 'transparent') return null;
  if (value.startsWith('#')) return rgb(value);
  const m = value.match(/rgba\((\d+),(\d+),(\d+),([\d.]+)\)/);
  if (m) return over([+m[1], +m[2], +m[3]], rgb(bgHex), parseFloat(m[4]));
  return null;
};

// Pull one mode's role recipe out of the source and resolve it for a palette.
// A role reads a palette slot (P.primary), ink or paper at an ALPHA step, or a
// literal; the shadows are template strings and are not contrast claims.
const hexRgb = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16)).join(',');
const roleBlock = (name, P) => {
  const fn = { ROLE_LIGHT: 'lightRoles', ROLE_DARK: 'darkRoles' }[name];
  const start = src.indexOf(`const ${fn} = (): ColorRoles => ({`);
  if (start === -1) throw new Error(`check-contrast: ${fn} not found in onganda-roles.ts`);
  const body = src.slice(start, src.indexOf('\n});', start));
  const tone = fn => hexRgb(fn === 'ink' ? P.ink : P.paper);
  const out = {};
  for (const m of body.matchAll(/^\s{2}(\w+):\s*(?:P\.(\w+)|(ink|paper)\(ALPHA\.(\w+)\.(\w+)\)|(ink|paper)\(([\d.]+)\)|'([^']*)')/gm)) {
    const [, key, slot, fn, alphaKey, alphaMode, fn2, rawAlpha, literal] = m;
    if (slot) out[key] = P[slot];
    else if (fn) out[key] = `rgba(${tone(fn)},${ALPHA[alphaKey][alphaMode]})`;
    else if (fn2) out[key] = `rgba(${tone(fn2)},${rawAlpha})`;
    else out[key] = literal;
  }
  return out;
};

// ALPHA, parsed from the source so the two cannot drift.
const ALPHA = {};
{
  const start = src.indexOf('export const ALPHA = {');
  const body = src.slice(start, src.indexOf('} as const;', start));
  for (const m of body.matchAll(/^\s{2}(\w+):\s*\{\s*light:\s*([\d.]+),\s*dark:\s*([\d.]+)\s*\}/gm)) {
    ALPHA[m[1]] = { light: parseFloat(m[2]), dark: parseFloat(m[3]) };
  }
}

// The editors paint on eleven additional grounds. They were outside the model
// until an audit inside the document editor found ink text at 1.13:1 on
// emberBrown. Every light tone is checked against the text roles; the two dark
// tones are checked against the dark set.
const EDITOR_SURFACE = Object.fromEntries(
  [...colorsSrc.slice(colorsSrc.indexOf('export const EDITOR_SURFACE = {'), colorsSrc.indexOf('} as const;', colorsSrc.indexOf('export const EDITOR_SURFACE = {')))
    .matchAll(/(\w+):\s*'(#[0-9A-Fa-f]{6})'/g)].map(m => [m[1], m[2]])
);

const AA = 4.5;  // small text
const UI = 3.0;  // non-text boundary or indicator

// The claims, read from CONTRAST_CLAIMS in onganda-roles.ts so this check and
// auditPalette() in the browser measure the same list.
const claims = [...src.slice(src.indexOf('export const CONTRAST_CLAIMS'), src.indexOf('];', src.indexOf('export const CONTRAST_CLAIMS')))
  .matchAll(/\['([^']+)', '(\w+)', '(\w+)', (AA|UI)\]/g)].map(m => [m[1], m[2], m[3], m[4] === 'AA' ? AA : UI]);
if (claims.length < 30) throw new Error(`check-contrast: only ${claims.length} claims read from CONTRAST_CLAIMS — the parser is out of date`);

// Documented exemptions. Each needs a reason, and the reason is the contract.
const EXEMPT = {
  'faint text': 'Disabled controls and decorative ordinals. WCAG 1.4.3 exempts inactive controls; ordinals repeat the adjacent label.',
  'hairline': 'Decorative divider. Carries no state and no boundary meaning.',
  'status mark': 'Paired with a text label and drawn with a hairline ring, which provides the boundary.'
};

const failures = [];
const rows = [];

const runMode = (label, R, COLOR) => {
  for (const [name, fgKey, bgKey, threshold] of claims) {
    const bgHex = R[bgKey];
    if (!bgHex || bgHex === 'transparent') continue;
    const bg = bgHex.startsWith('#') ? rgb(bgHex) : resolve(bgHex, R.canvas);
    const fg = resolve(R[fgKey], bgHex.startsWith('#') ? bgHex : R.canvas);
    if (!fg || !bg) continue;
    const r = ratio(fg, bg);
    const ok = r >= threshold;
    rows.push([label, name, r.toFixed(2), threshold, ok ? 'ok' : 'FAIL']);
    if (!ok) failures.push(`${label}: ${name} is ${r.toFixed(2)}:1, needs ${threshold}:1 (${fgKey} on ${bgKey})`);
  }
  // Status marks must clear 3:1 against both surfaces, or carry a ring.
  for (const [name, hex] of Object.entries({
    critical: COLOR.firedRed,
    caution: COLOR.mahanguGold,
    active: COLOR.ochreOrange,
    settled: label.endsWith('dark') ? COLOR.mopaneBrownLight : COLOR.mopaneBrown
  })) {
    const r = Math.min(ratio(rgb(hex), rgb(R.canvas)), ratio(rgb(hex), rgb(R.surface)));
    rows.push([label, `status ${name}`, r.toFixed(2), UI, r >= UI ? 'ok' : 'ring required']);
  }
};

// The editors paint on their own warm paper tones under every palette, so
// they are measured against the Onganda ink, the palette they were tuned for.
// Editor grounds. A tone is light or dark by which ink actually reads on it.
const EDITOR_LIGHT = ['paperWhite', 'paperWarm', 'dustCream', 'dustHover', 'dustPanel', 'dustPanelDeep', 'dustWell', 'dustHeader'];
const EDITOR_DARK = ['canvasWellDark', 'emberBrown'];

function checkEditorSurfaces(LIGHT, DARK) {
for (const [tone, hex] of Object.entries(EDITOR_SURFACE)) {
  const isDarkTone = EDITOR_DARK.includes(tone);
  if (!EDITOR_LIGHT.includes(tone) && !isDarkTone) continue; // smokeGray is a chrome tone, not a ground
  const R = isDarkTone ? DARK : LIGHT;
  const bg = rgb(hex);
  for (const role of ['text', 'textBody', 'textMuted', 'fieldText']) {
    const fg = resolve(R[role], hex);
    if (!fg) continue;
    const r = ratio(fg, bg);
    rows.push([isDarkTone ? 'editor-dk' : 'editor-lt', `${role} on ${tone}`, r.toFixed(2), AA, r >= AA ? 'ok' : 'FAIL']);
    if (r < AA) failures.push(`editor surface: ${role} is ${r.toFixed(2)}:1 on ${tone} (${hex}), needs ${AA}:1`);
  }
  // The accent as ink has to survive these grounds too.
  const accent = resolve(R.accentInk, hex);
  if (accent) {
    const r = ratio(accent, bg);
    rows.push([isDarkTone ? 'editor-dk' : 'editor-lt', `accentInk on ${tone}`, r.toFixed(2), AA, r >= AA ? 'ok' : 'FAIL']);
    if (r < AA) failures.push(`editor surface: accentInk is ${r.toFixed(2)}:1 on ${tone} (${hex}), needs ${AA}:1`);
  }
}
}

for (const [paletteName, P] of Object.entries(PALETTES)) {
  const COLOR = colorFor(P, COLOR_MAP);
  const LIGHT = roleBlock('ROLE_LIGHT', P);
  const DARK = roleBlock('ROLE_DARK', P);
  const tag = paletteName === 'onganda' ? '' : `${paletteName} `;
  runMode(`${tag}light`, LIGHT, COLOR);
  runMode(`${tag}dark`, DARK, COLOR);
  if (paletteName === 'onganda') checkEditorSurfaces(LIGHT, DARK);
}

if (process.argv.includes('--table')) {
  const w = [6, 32, 7, 5, 14];
  console.log(['mode', 'check', 'ratio', 'min', 'result'].map((h, i) => h.padEnd(w[i])).join(''));
  console.log('-'.repeat(w.reduce((a, b) => a + b)));
  for (const r of rows) console.log(r.map((c, i) => String(c).padEnd(w[i])).join(''));
  console.log('\nExemptions:');
  for (const [k, v] of Object.entries(EXEMPT)) console.log(`  ${k}: ${v}`);
}

if (failures.length) {
  console.error('\nContrast check failed:\n');
  for (const f of failures) console.error(`  ${f}`);
  console.error('\nFix the role value, or state the exemption and its reason in scripts/check-contrast.mjs.');
  process.exit(1);
}
console.log(`Contrast check passed — ${rows.length} measurements across ${Object.keys(PALETTES).length} palettes, WCAG AA.`);
