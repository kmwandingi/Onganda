#!/usr/bin/env node
// ─── Onganda Design System — token export ────────────────────────────────────
// Emits the design tokens in the W3C Design Tokens format, which Tokens Studio
// imports straight into Figma, and Style Dictionary compiles to any other
// platform.
//
//   npm run build:tokens          write tokens/
//   npm run build:tokens -- --check   fail if the committed files are stale
//
// Everything is READ FROM THE SOURCE MODULES. A token file maintained by hand
// is a copy that drifts, and this repo has already been bitten by that three
// times. The `--check` mode is wired into the design guard so the export can
// never fall behind the code it describes.

import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const root = existsSync(path.join(process.cwd(), 'package.json')) ? process.cwd() : path.join(HERE, '..');
const SRC = path.join(root, 'src/components/onganda');
const read = f => readFileSync(path.join(SRC, f), 'utf8');

const colorsSrc = read('onganda-colors.ts');
const rolesSrc = read('onganda-roles.ts');
const typeSrc = read('onganda-type.ts');
const motionSrc = read('onganda-motion.ts');

// ── Parse the source modules ────────────────────────────────────────────────
const literalBlock = (src, name, close = '} as const;') => {
  // Arrays open with `[`, objects with `{`.
  const open = close.startsWith(']') ? '[' : '{';
  const start = src.indexOf(`export const ${name} = ${open}`);
  if (start === -1) throw new Error(`build-tokens: ${name} not found`);
  const end = src.indexOf(close, start);
  if (end === -1) throw new Error(`build-tokens: ${name} is not a closed literal`);
  return src.slice(start, end);
};

const hexMap = (src, name) => Object.fromEntries(
  [...literalBlock(src, name).matchAll(/(\w+):\s*'(#[0-9A-Fa-f]{3,8})'/g)].map(m => [m[1], m[2]])
);

const COLOR = hexMap(colorsSrc, 'COLOR');
const EDITOR_SURFACE = hexMap(colorsSrc, 'EDITOR_SURFACE');

const roleBlock = name => {
  const body = literalBlock(rolesSrc, `${name}: ColorRoles`, '\n};');
  const out = {};
  for (const m of body.matchAll(/^\s{2}(\w+):\s*(?:COLOR\.(\w+)|(ink|paper)\(ALPHA\.(\w+)\.(\w+)\)|(ink|paper)\(([\d.]+)\)|'([^']*)')/gm)) {
    const [, key, colorKey, fn, aKey, aMode, fn2, rawAlpha, literal] = m;
    if (colorKey) out[key] = { value: COLOR[colorKey], ref: colorKey };
    else if (fn) out[key] = { value: rgba(fn, ALPHA[aKey][aMode]), ref: `${fn} ${Math.round(ALPHA[aKey][aMode] * 100)}%` };
    else if (fn2) out[key] = { value: rgba(fn2, parseFloat(rawAlpha)), ref: `${fn2} ${Math.round(parseFloat(rawAlpha) * 100)}%` };
    else out[key] = { value: literal, ref: literal };
  }
  return out;
};

const ALPHA = {};
{
  const body = literalBlock(rolesSrc, 'ALPHA');
  for (const m of body.matchAll(/^\s{2}(\w+):\s*\{\s*light:\s*([\d.]+),\s*dark:\s*([\d.]+)\s*\}/gm)) {
    ALPHA[m[1]] = { light: parseFloat(m[2]), dark: parseFloat(m[3]) };
  }
}
const rgba = (which, a) => which === 'ink' ? `rgba(30, 26, 23, ${a})` : `rgba(232, 225, 207, ${a})`;

const ROLE_LIGHT = roleBlock('ROLE_LIGHT');
const ROLE_DARK = roleBlock('ROLE_DARK');

const SYSTEM_COLOR = Object.fromEntries(
  [...literalBlock(rolesSrc, 'SYSTEM_COLOR').matchAll(/(\w+):\s*COLOR\.(\w+)/g)].map(m => [m[1], COLOR[m[2]]])
);
const STATUS = Object.fromEntries(
  [...literalBlock(rolesSrc, 'STATUS').matchAll(/(\w+):\s*COLOR\.(\w+)/g)].map(m => [m[1], COLOR[m[2]]])
);
const CHART_SERIES = [...literalBlock(rolesSrc, 'CHART_SERIES', '] as const;').matchAll(/COLOR\.(\w+)/g)].map(m => COLOR[m[1]]);

const TYPE = {};
for (const m of literalBlock(typeSrc, 'TYPE').matchAll(
  /^\s{2}(\w+):\s*\{\s*size:\s*(\d+),\s*lineHeight:\s*([\d.]+),\s*tracking:\s*'([^']+)',\s*weight:\s*(\d+),\s*case:\s*'(\w+)'/gm)) {
  TYPE[m[1]] = { size: +m[2], lineHeight: +m[3], tracking: m[4], weight: +m[5], case: m[6] };
}
const DISPLAY = {};
for (const m of literalBlock(typeSrc, 'DISPLAY').matchAll(
  /^\s{2}(\w+):\s*\{\s*css:\s*'([^']+)',\s*at360:\s*(\d+),\s*at1280:\s*(\d+),\s*at1920:\s*(\d+)/gm)) {
  DISPLAY[m[1]] = { css: m[2], at360: +m[3], at1280: +m[4], at1920: +m[5] };
}
const SPACE_SCALE = Object.fromEntries(
  [...literalBlock(typeSrc, 'SPACE_SCALE').matchAll(/'(\d+)':\s*(\d+)/g)].map(m => [m[1], +m[2]])
);
const fontFamily = typeSrc.match(/family:\s*"([^"]+)"/)[1];
const durations = [...motionSrc.matchAll(/duration:\s*([\d.]+)/g)].map(m => parseFloat(m[1]));

// ── Build the W3C token document ────────────────────────────────────────────
const g = (description, tokens) => ({ $description: description, ...tokens });
const color = (value, description) => ({ $type: 'color', $value: value, $description: description });
const dim = (value, description) => ({ $type: 'dimension', $value: `${value}px`, $description: description });

const POLICY = Object.fromEntries(
  [...rolesSrc.matchAll(/(\w+):\s*\{\s*\n\s*allowed:\s*'((?:[^'\\]|\\.)*)',\s*\n\s*never:\s*'((?:[^'\\]|\\.)*)'/g)]
    .map(m => [m[1], { allowed: m[2].replace(/\\'/g, "'"), never: m[3].replace(/\\'/g, "'") }])
);

const roleGroup = (roles, mode) => Object.fromEntries(
  Object.entries(roles).map(([k, v]) => [k, color(v.value, `${mode} — ${v.ref}`)])
);

const tokens = {
  $description:
    'Onganda Design System — the complete and closed token set for the Namibia AI Systems Lab. ' +
    'Any colour, size, spacing or radius not in this file is not part of the system. ' +
    'Generated from source by scripts/build-tokens.mjs; do not edit by hand.',

  palette: g(
    'The nine brand hues and the dark surfaces. These are the raw materials. ' +
    'Do NOT design with them directly — pick a semantic role below. Each entry records what it may and may not do.',
    Object.fromEntries(Object.entries(COLOR).map(([k, v]) => [
      k, color(v, POLICY[k] ? `ALLOWED: ${POLICY[k].allowed} — NEVER: ${POLICY[k].never}` : undefined)
    ]))
  ),

  'palette-editor': g(
    'Additional grounds used only by the document and slide editors. Not brand identity colours.',
    Object.fromEntries(Object.entries(EDITOR_SURFACE).map(([k, v]) => [k, color(v)]))
  ),

  role: {
    $description:
      'THE DESIGN SURFACE. Every colour decision is made here, not in the palette. ' +
      'Pick the role that matches what the element does; the mode decides the value.',
    light: g('Roles on the light canvas.', roleGroup(ROLE_LIGHT, 'light')),
    dark: g('Roles on the dark canvas.', roleGroup(ROLE_DARK, 'dark'))
  },

  system: g(
    'The five Onganda systems. A colour here means "this belongs to that system" and nothing else. ' +
    'Never use one as a button, border, label or background.',
    Object.fromEntries(Object.entries(SYSTEM_COLOR).map(([k, v]) => [k, color(v, `Identity colour for ${k}`)]))
  ),

  status: g(
    'Four states. The palette is earth-derived: it has no green and no blue, and none may be added. ' +
    'Success reads as a check glyph on the settled tone. Colour is never the only carrier — pair every ' +
    'status mark with a text label and a hairline ring.',
    Object.fromEntries(Object.entries(STATUS).map(([k, v]) => [k, color(v)]))
  ),

  chart: g(
    'Fixed series order. Take colours from the front; never reorder or substitute, so series index 2 ' +
    'reads the same in every chart across a product.',
    Object.fromEntries(CHART_SERIES.map((v, i) => [`series-${i + 1}`, color(v)]))
  ),

  typography: {
    $description:
      'The complete, closed type scale. One family. A size not listed here is not an Onganda size.',
    fontFamily: { $type: 'fontFamily', $value: fontFamily },
    ...Object.fromEntries(Object.entries(TYPE).map(([k, t]) => [k, {
      $type: 'typography',
      $value: {
        fontFamily,
        fontSize: `${t.size}px`,
        fontWeight: t.weight,
        lineHeight: t.lineHeight,
        letterSpacing: t.tracking,
        textCase: t.case
      }
    }])),
    display: g(
      'Fluid hero sizes. Figma cannot express a clamp, so the rendered size is given at three reference widths.',
      Object.fromEntries(Object.entries(DISPLAY).flatMap(([k, d]) => [
        [`${k}-360`, dim(d.at360, `${d.css} at a 360px viewport`)],
        [`${k}-1280`, dim(d.at1280, `${d.css} at a 1280px viewport`)],
        [`${k}-1920`, dim(d.at1920, `${d.css} at a 1920px viewport`)]
      ]))
    )
  },

  space: g(
    'A 4px base grid. The pixel geometry rests on whole units.',
    Object.fromEntries(Object.entries(SPACE_SCALE).map(([k, v]) => [k, dim(v)]))
  ),

  geometry: g(
    'Sharp by definition.',
    {
      radius: dim(0, 'ZERO, EVERYWHERE. Corner decoration is the PixelCornerMarks component, never a radius.'),
      'border-hairline': dim(1, 'The standard border.'),
      'border-rule': dim(3, 'The emphasised left rule on inverse cards and notices.'),
      shadow: { $type: 'shadow', $value: 'none', $description: 'No shadows. Depth comes from the weave texture and stepped marks.' }
    }
  ),

  motion: g(
    'Quiet and mechanical. Tween, never spring. Cards lift, they do not scale.',
    {
      'duration-tap': { $type: 'duration', $value: '150ms' },
      'duration-entrance': { $type: 'duration', $value: `${Math.round(Math.max(...durations.filter(d => d < 1)) * 1000)}ms` },
      'duration-ticker': { $type: 'duration', $value: '28000ms' },
      easing: { $type: 'cubicBezier', $value: [0.16, 1, 0.3, 1], $description: 'The hero entrance curve.' },
      'hover-lift': dim(-2, 'Cards translate up by 2px on hover. They never scale.'),
      'tap-scale': { $type: 'number', $value: 0.97, $description: 'Buttons compress on tap.' }
    }
  ),

  forbidden: {
    $description:
      'NOT TOKENS — the closed-set rule, stated so it travels with the file. ' +
      'Anything below is outside the Onganda design system and is not acceptable in work that claims to use it.',
    rules: {
      $type: 'other',
      $value: [
        'Any colour not in `palette` or `palette-editor`. There is no green and no blue, and none may be added.',
        'Designing from `palette` directly instead of `role`. The palette is raw material; roles are the design surface.',
        'Ochre orange as text on a light surface (2.4:1). It is a fill; the accent ink on light is bark rust.',
        'Fired red behind small text (best foreground 4.05:1). It is an indicator only.',
        'A system colour used as a button, border, label or background.',
        'Any corner radius. Any drop shadow. Any gradient other than the documented dither fills.',
        'Any font other than Inter, and any size not in `typography`.',
        'Any spacing not on the 4px grid in `space`.',
        'Rounded or organic icon shapes. Icons are <rect> on an integer grid.',
        'Spring animation, scale-on-hover, or any motion that is not in `motion`.'
      ]
    }
  }
};

// ── Write or check ──────────────────────────────────────────────────────────
const outDir = path.join(root, 'tokens');
const outFile = path.join(outDir, 'onganda.tokens.json');
const serialised = JSON.stringify(tokens, null, 2) + '\n';

if (process.argv.includes('--check')) {
  if (!existsSync(outFile)) {
    console.error('Token export is missing. Run `npm run build:tokens`.');
    process.exit(1);
  }
  if (readFileSync(outFile, 'utf8') !== serialised) {
    console.error('tokens/onganda.tokens.json is stale — the source modules have changed.\nRun `npm run build:tokens` and commit the result.');
    process.exit(1);
  }
  const n = Object.keys(COLOR).length + Object.keys(ROLE_LIGHT).length * 2 + Object.keys(TYPE).length + Object.keys(SPACE_SCALE).length;
  console.log(`Token export is current — ${n} tokens match the source.`);
} else {
  mkdirSync(outDir, { recursive: true });
  writeFileSync(outFile, serialised);
  console.log(`Wrote ${path.relative(root, outFile)}`);
  console.log(`  palette ${Object.keys(COLOR).length}  roles ${Object.keys(ROLE_LIGHT).length}x2  type ${Object.keys(TYPE).length}  space ${Object.keys(SPACE_SCALE).length}  systems ${Object.keys(SYSTEM_COLOR).length}  chart ${CHART_SERIES.length}`);
}
