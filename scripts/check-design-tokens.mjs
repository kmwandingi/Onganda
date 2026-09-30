#!/usr/bin/env node
// ─── Onganda Design System — token guard ─────────────────────────────────────
// Rules are only real if something checks them. This enforces the colour
// policy in DESIGN_SYSTEM.md §4 against the source.
//
//   npm run check:tokens
//
// Every design-system module is checked and must stay at zero violations.
// A real exception is declared inline and reviewed like any other code:
//   // onganda-allow: rounded-geometry — radial gradient mask, not a surface

import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const SRC = 'src/components/onganda';

// The token source ships with the package, so this resolves whether the script
// runs in this repo or from a consumer's node_modules.
const HERE = path.dirname(fileURLToPath(import.meta.url));
const resolveTokenFile = name => {
  const candidates = [
    path.join(process.cwd(), SRC, name),
    path.join(HERE, '..', SRC, name)
  ];
  const hit = candidates.find(existsSync);
  if (!hit) throw new Error(`check-design-tokens: cannot find ${name}. Looked in:\n  ${candidates.join('\n  ')}`);
  return hit;
};

// Every design-system module is governed, and the list is READ FROM THE
// DIRECTORY rather than enumerated. A hardcoded list silently exempts every
// file added after it was written — which is how an ungoverned module appears.
// A justified exception is written in the file as
//   // onganda-allow: <rule-id> — <reason>
// on the line above, and shows up in review like any other code.
const designSystemFiles = () => {
  const dir = existsSync(path.join(process.cwd(), SRC))
    ? path.join(process.cwd(), SRC)
    : path.join(HERE, '..', SRC);
  if (!existsSync(dir)) throw new Error(`check-design-tokens: cannot find ${SRC}`);
  const files = readdirSync(dir)
    .filter(f => /\.(tsx?|css)$/.test(f))
    .map(f => path.join(dir, f))
    .sort();
  if (files.length < 5) throw new Error(`check-design-tokens: only ${files.length} files found in ${SRC} — resolver is wrong`);
  return files;
};


// The sanctioned hex set, READ FROM SOURCE. A hand-copied list fails open: if
// someone changes a value in COLOR, a stale copy here keeps accepting the old
// hex everywhere. Deriving it means the guard can never disagree with the
// tokens it guards.
const readHexes = (file, constName) => {
  const text = readFileSync(file, 'utf8');
  const start = text.indexOf(`export const ${constName} = {`);
  if (start === -1) throw new Error(`check-design-tokens: ${constName} not found in ${file}`);
  const end = text.indexOf('} as const;', start);
  if (end === -1) throw new Error(`check-design-tokens: ${constName} is not a closed literal in ${file}`);
  const hexes = [...text.slice(start, end).matchAll(/'(#[0-9a-fA-F]{3,8})'/g)].map(m => m[1].toLowerCase());
  if (!hexes.length) throw new Error(`check-design-tokens: ${constName} yielded no colours — parser is out of date`);
  return hexes;
};

const COLORS_FILE = resolveTokenFile('onganda-colors.ts');
const PALETTE = new Set([
  ...readHexes(COLORS_FILE, 'COLOR'),
  ...readHexes(COLORS_FILE, 'EDITOR_SURFACE'),
  // Neutral extremes used for shadows, scrims, and SVG masks.
  '#ffffff', '#fff', '#000000', '#000'
]);

// The same palette expressed as `r,g,b`, so rgba() is checked against it too.
const PALETTE_RGB = new Set(
  [...PALETTE]
    .filter(h => /^#[0-9a-f]{6}$/.test(h))
    .map(h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16)).join(','))
);

// The closed type scale, read from source like the palette is.
const typeSrc = readFileSync(resolveTokenFile('onganda-type.ts'), 'utf8');

const literalOf = (text, name) => {
  const start = text.indexOf(`export const ${name} = {`);
  if (start === -1) throw new Error(`check-design-tokens: ${name} not found`);
  const end = text.indexOf('} as const;', start);
  if (end === -1) throw new Error(`check-design-tokens: ${name} is not a closed literal`);
  return text.slice(start, end);
};

const TYPE_SIZES = new Set(
  [...typeSrc.slice(typeSrc.indexOf('export const TYPE = {'), typeSrc.indexOf('} as const;'))
    .matchAll(/size:\s*(\d+)/g)].map(m => Number(m[1]))
);
if (TYPE_SIZES.size < 5) throw new Error('check-design-tokens: could not read the type scale');
// The permitted ink and paper opacities, READ FROM SOURCE for the same reason
// the palette is: a hand-copied list stops agreeing with what it guards.
const ALPHA_STEPS = new Set(
  [...readFileSync(resolveTokenFile('onganda-roles.ts'), 'utf8')
    .matchAll(/light:\s*([\d.]+),\s*dark:\s*([\d.]+)/g)]
    .flatMap(m => [Number(m[1]), Number(m[2])])
);
// Fully opaque and fully transparent are not ramp steps but are always legal.
ALPHA_STEPS.add(0); ALPHA_STEPS.add(1);
if (ALPHA_STEPS.size < 6) throw new Error('check-design-tokens: could not read the alpha ramp');

// The permitted weave opacities and dither weights, READ FROM SOURCE. Both
// were being chosen one call site at a time — ten weave opacities and
// thirteen dither opacities — so the same object read as a different weight
// in every section.
const TEXTURE_STEPS = new Set(
  [...literalOf(typeSrc, 'TEXTURE').matchAll(/:\s*([\d.]+)/g)].map(m => Number(m[1]))
);
const RULE_OPACITIES = new Set(
  [...literalOf(typeSrc, 'RULE').matchAll(/opacity:\s*([\d.]+)/g)].map(m => Number(m[1]))
);
if (TEXTURE_STEPS.size < 3 || RULE_OPACITIES.size < 3) {
  throw new Error('check-design-tokens: could not read the texture or rule scales');
}

// Tailwind's default steps, mapped to px so they are checked too.
const TW_SIZES = { xs: 12, sm: 14, base: 16, lg: 18, xl: 20, '2xl': 24, '3xl': 30, '4xl': 36, '5xl': 48, '6xl': 60, '7xl': 72 };

const TAILWIND_HUES = 'slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose';

const RULES = [
  {
    id: 'tailwind-color',
    why: 'Generic Tailwind colour. Use a role from onganda-roles.ts.',
    re: new RegExp(`\\b(?:bg|text|border|ring|fill|stroke|divide|placeholder|outline|accent|caret|from|via|to)-(?:${TAILWIND_HUES})-\\d{2,3}\\b`, 'g')
  },
  {
    id: 'off-palette-hex',
    why: 'Hex outside the Onganda palette. Add a named token first.',
    re: /#[0-9a-fA-F]{3,8}\b/g,
    // `${COLOR.x}60` alpha suffixes are the documented way to fade a token.
    filter: m => {
      const h = m.toLowerCase();
      return !PALETTE.has(h) && !(h.length === 9 && PALETTE.has(h.slice(0, 7)));
    }
  },
  {
    id: 'off-palette-rgba',
    why: 'rgba() on a colour the palette does not contain. Opacity belongs on a palette token, not on a new hue.',
    re: /rgba?\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*[,)]/g,
    filter: m => !PALETTE_RGB.has(m.match(/\d+/g).slice(0, 3).join(','))
  },
  {
    id: 'modern-color-fn',
    why: 'oklch/lab/lch is outside the system. Use a role.',
    re: /\b(?:oklch|oklab|lch|lab)\(/g
  },
  {
    id: 'system-colour-as-chrome',
    why: 'A system colour bound to a surface or border. Mahangu gold, mopane brown, dye plum, and bark rust identify Oshini, Ombiga, Etiti, and Oshitoo — a component does not pick one for its chrome. The palette reaches interface chrome through measured roles — gold is `accentBg`, mopane and plum are hover fills — so read `roles(isDark)` and the edge, label and hover come with it.',
    // Identity hues assigned directly to a surface or boundary property.
    // Data-driven uses (sys.borderHex, CHART_SERIES[i], statusFor(...)) are not
    // literal COLOR.x references and correctly do not trip this.
    re: /(?:background|backgroundColor|borderColor|borderTopColor|borderBottomColor|borderLeftColor|borderRightColor)\s*:\s*COLOR\.(mahanguGold|mopaneBrown|mopaneBrownLight|dyePlum|barkRust)\b/g
  },
  {
    id: 'raw-status-colour',
    why: 'STATUS read directly instead of statusFor(name, isDark). Mopane brown is 2.25:1 on a dark card and needs the lighter tone.',
    re: /STATUS\.(settled|active|caution)\b/g
  },
  {
    id: 'surface-literal-ink',
    why: 'inkOn() given a surface literal. That bakes in the ground the component happens to sit on today and is silently wrong when it moves. Use useInkOn(), which reads SurfaceProvider.',
    // Only flags the reusable layer; the editors legitimately know their own
    // fixed grounds and declare them.
    re: /\binkOn\([^,)]+,\s*(?:COLOR|EDITOR_SURFACE)\.\w+/g,
    files: /onganda-primitives\.tsx$|onganda-patterns\.tsx$/
  },
  {
    id: 'off-scale-type',
    why: 'A font size outside the closed type scale in onganda-type.ts. Pick the step whose job matches, or add one to the scale with a stated role.',
    // .tsx only: the PPTX exporter measures in points, not CSS pixels.
    files: /\.tsx$/,
    // `fontSize: '20px'` is the same declaration as `fontSize: 20` and was
    // invisible to this rule, which is how 71 off-scale sizes accumulated in
    // a consumer while the check reported clean.
    re: /fontSize:\s*'(\d+(?:\.\d+)?)px'|fontSize:\s*(\d+(?:\.\d+)?)\b|text-\[(\d+)px\]|\btext-(xs|sm|base|lg|xl|2xl|3xl|4xl|5xl|6xl|7xl)\b/g,
    filter: m => {
      const n = m.match(/fontSize:\s*'?(\d+(?:\.\d+)?)/) ?? m.match(/text-\[(\d+)px\]/);
      if (n) return !TYPE_SIZES.has(Number(n[1]));
      const tw = m.match(/text-(\w+)/);
      return tw ? !TYPE_SIZES.has(TW_SIZES[tw[1]]) : false;
    }
  },
  {
    id: 'hand-rolled-card',
    why: 'A card built by hand. `background: surface` plus a `line` border plus padding IS PixelPanel — use it, and get the weave, the corner marks and the eyebrow rhythm with it. Nine of these in Control Standards and Product Patterns are why those two sections read as a different product from the rest of the page.',
    // The components that legitimately define the card language are exempt.
    files: /\.tsx$/,
    exclude: /onganda-patterns\.tsx$|onganda-primitives\.tsx$|onganda-site\.tsx$/,
    // To end of line, not `[^}]*`: a template literal like `${c.line}`
    // contains a closing brace, so a brace-bounded match stops short of the
    // border declaration and the rule silently never fires.
    re: /style=\{\{.*$|const \w+: React\.CSSProperties = \{.*$/gm,
    filter: m => {
      const surface = /background:\s*(?:c|roles\([^)]*\))\.surface\b/.test(m);
      const line = /border:\s*`1px solid \$\{(?:c|roles\([^)]*\))\.line\}`/.test(m);
      return surface && line;
    }
  },
  {
    id: 'off-ramp-ink',
    why: 'An ink or paper opacity that is not a step on the ALPHA ramp in onganda-roles.ts. `off-palette-rgba` passes this because char black IS a palette colour — only the alpha is invented, and 25 different ones had accumulated where the ramp defines seven. Read a role (textMuted, textBody, line, lineStrong) instead.',
    files: /\.tsx?$/,
    exclude: /onganda-roles\.ts$|onganda-colors\.ts$/,
    // Scoped to the properties the ramp governs: text and lines. A 4%
    // background wash and a 90% modal scrim are surfaces, not ink, and the
    // ramp has nothing to say about them.
    re: /(?:color|borderColor|border(?:Top|Right|Bottom|Left)?Color|outlineColor|border(?:Top|Right|Bottom|Left)?|outline|textDecorationColor)\s*:\s*[^;,\n]*rgba\(\s*(?:30,\s*26,\s*23|232,\s*225,\s*207),\s*[\d.]+\s*\)/g,
    filter: m => {
      const a = Number(m.match(/,\s*([\d.]+)\s*\)/)[1]);
      return !ALPHA_STEPS.has(a);
    }
  },
  {
    id: 'off-scale-texture',
    why: 'A weave opacity or dither opacity that is not a step in TEXTURE or RULE (onganda-type.ts). Both were chosen per call site — ten weave opacities and thirteen dither opacities — so the same object read as a different weight in every section. Texture belongs to grounds and inverse panels and never stacks; a block gets one rule.',
    files: /\.tsx$/,
    exclude: /onganda-type\.ts$/,
    re: /<WeaveOverlay[^>]*opacity=\{([\d.]+)\}|<DitherBar[^>]*opacity=\{([\d.]+)\}/g,
    filter: m => {
      const value = Number(m.match(/opacity=\{([\d.]+)\}/)[1]);
      return /WeaveOverlay/.test(m) ? !TEXTURE_STEPS.has(value) : !RULE_OPACITIES.has(value);
    }
  },
  {
    id: 'dotted-rule',
    why: 'A striped or dotted fill. The system retired the dither rule: laid on every card foot, header and progress bar it read as noise, not texture. A divider is a solid hairline (`DitherBar` now renders one, or `border-line`); a progress fill is solid; texture belongs to grounds through `WeaveOverlay`.',
    files: /\.(tsx|css)$/,
    re: /repeating-linear-gradient|border(?:Top|Bottom|Left|Right)?:\s*[`'"][^`'"\n]*\bdotted\b/g
  },
  {
    id: 'elevation-shadow',
    why: 'A drop shadow. Onganda has no elevation: the public site renders zero blurred shadows, and depth comes from the weave texture, a hairline border and stepped pixel marks. A card lifts on hover by moving (MOTION.hoverLift), not by casting. A `0 0 0 Npx` ring is allowed — it is a border that does not reflow the layout.',
    files: /\.tsx$/,
    // Matching `boxShadow:` alone is not enough: the value is usually a
    // ternary over consts declared elsewhere, which is how 37 shadows sat on
    // /showcase while the guard reported clean. Match the property AND any
    // shadow-named const, then read the literals inside.
    //
    // Scoped to shadow context on purpose: `padding: '20px 20px 16px'` is
    // three lengths too, and an earlier, shape-only version of this rule
    // flagged every one of them.
    re: /(?:boxShadow|textShadow)\s*:[^\n]*|\bconst\s+\w*[Ss]hadow\w*\s*=[^\n]*|\bshadow-(?:sm|md|lg|xl|2xl|inner)\b/g,
    filter: m => {
      if (/^shadow-/.test(m)) return true;
      const LEN = String.raw`(?:-?[\d.]+px|0)`;
      const literals = m.match(/`[^`]*`|'[^']*'|"[^"]*"/g) ?? [];
      return literals.some(lit => {
        const body = lit.slice(1, -1);
        if (!new RegExp(`${LEN}\\s+${LEN}\\s+${LEN}`).test(body)) return false;
        // Each comma-separated layer: a ring is `<x> <y> 0 <spread>` with no
        // blur. A non-zero third length is elevation.
        return body.split(/,(?![^(]*\))/).some(layer => {
          const lengths = layer.trim().match(new RegExp(LEN, 'g')) ?? [];
          return lengths.length >= 3 && parseFloat(lengths[2]) !== 0;
        });
      });
    }
  },
  {
    id: 'rounded-geometry',
    why: 'Rounded corner on a brand surface. Onganda geometry is sharp — use PixelCornerMarks.',
    // Bare `rounded` only counts inside a class attribute; elsewhere it is prose.
    // `\s*` backtracks, so a lookahead cannot reject `radius: 0`. Read the
    // value and compare it instead.
    re: /\brounded-(?:sm|md|lg|xl|2xl|3xl|full|t|b|l|r|tl|tr|bl|br)\b|border-?[Rr]adius:\s*[^;,\n}]+/g,
    filter: m => {
      const v = m.match(/radius:\s*(.+)/i);
      return !v || !/^0(\s|$|px|!)/.test(v[1].trim());
    }
  }
];

const violations = file => {
  const text = readFileSync(file, 'utf8');
  const lines = text.split('\n');
  const found = [];
  lines.forEach((line, i) => {
    if (/^\s*(\/\/|\*|\/\*)/.test(line)) return; // comments document the rules
    const pragma = (lines[i - 1] ?? '').match(/onganda-allow:\s*([\w-]+)/);
    for (const rule of RULES) {
      if (pragma && pragma[1] === rule.id) continue;
      if (rule.files && !rule.files.test(file)) continue;
      if (rule.exclude && rule.exclude.test(file)) continue;
      rule.re.lastIndex = 0;
      for (const m of line.matchAll(rule.re)) {
        if (rule.filter && !rule.filter(m[0])) continue;
        found.push({ line: i + 1, rule: rule.id, why: rule.why, text: m[0] });
      }
    }
  });
  return found;
};

const report = (files, label) => {
  let total = 0;
  for (const f of files) {
    const v = violations(f);
    if (!v.length) continue;
    total += v.length;
    console.log(`\n${f}`);
    for (const x of v.slice(0, 12)) console.log(`  ${f}:${x.line}  [${x.rule}] ${x.text}  — ${x.why}`);
    if (v.length > 12) console.log(`  … ${v.length - 12} more`);
  }
  if (total) console.log(`\n${label}: ${total} violation${total === 1 ? '' : 's'}`);
  return total;
};

const pathsFlag = process.argv.indexOf('--paths');
const EXT = /\.(tsx?|jsx?|mjs|cjs|css)$/;
const SKIP = new Set(['node_modules', 'dist', 'build', '.git', 'coverage', '.next']);

const walk = target => {
  if (!existsSync(target)) throw new Error(`onganda-check: no such path — ${target}`);
  if (statSync(target).isFile()) return EXT.test(target) ? [target] : [];
  return readdirSync(target).flatMap(entry =>
    SKIP.has(entry) ? [] : walk(path.join(target, entry))
  );
};

// Only scan this repo's modules when no explicit paths are given. A consumer
// install ships the token source but not the components, so the directory
// scan must never run in that mode.
const targets = pathsFlag === -1
  ? designSystemFiles()
  : process.argv.slice(pathsFlag + 1).filter(a => !a.startsWith('-')).flatMap(walk);

if (pathsFlag !== -1 && !targets.length) {
  console.error('onganda-check: no checkable files found in the given paths.');
  process.exit(1);
}

const governedCount = report(targets, pathsFlag === -1 ? 'Governed files' : 'Checked files');

if (governedCount) {
  console.error(`\nDesign token check failed. Fix the governed files, or state why the rule should change in DESIGN_SYSTEM.md §4.`);
  process.exit(1);
}
console.log(`Design token check passed — ${targets.length} files clean.`);
