// ─── Onganda Design System — palette source reader ──────────────────────────
// The checks read colour straight from the TypeScript source, without
// compiling it, so they run the same in this repo and in a consumer's
// node_modules. This is the one parser for the two files that define colour:
//
//   onganda-palettes.ts  PALETTES — each palette's pigments, peers and chart
//   onganda-colors.ts    COLOR_SLOT — which palette slot each COLOR key reads
//
// Used by check-contrast, check-design-tokens, check-docs and build-tokens.

const block = (src, start, file) => {
  const at = src.indexOf(start);
  if (at === -1) throw new Error(`palette-source: "${start}" not found in ${file}`);
  return src.slice(at);
};

/** Every shipped palette: { name: { slot: hex, peers: [], peersDark: [], chart: [] } }. */
export const readPalettes = palettesSrc => {
  const body = block(palettesSrc, 'export const PALETTES = {', 'onganda-palettes.ts');
  const end = body.indexOf('} as const satisfies');
  const out = {};
  // A palette opens at two spaces of indent and closes at "  }," or "  }".
  for (const m of body.slice(0, end).matchAll(/^ {2}(\w+): \{\n([\s\S]*?)^ {2}\}/gm)) {
    const [, name, text] = m;
    const p = {};
    for (const s of text.matchAll(/^ {4}(\w+):\s*'(#[0-9A-Fa-f]{6})'/gm)) p[s[1]] = s[2];
    for (const s of text.matchAll(/^ {4}(label|description|rules):\s*'((?:[^'\\]|\\.)*)'/gm)) p[s[1]] = s[2].replace(/\\'/g, "'");
    for (const s of text.matchAll(/^ {4}(peers|peersDark|chart):\s*\[([^\]]*)\]/gm)) {
      p[s[1]] = [...s[2].matchAll(/'(#[0-9A-Fa-f]{6})'/g)].map(h => h[1]);
    }
    out[name] = p;
  }
  if (!out.onganda || Object.keys(out.onganda).length < 18) {
    throw new Error('palette-source: could not read PALETTES.onganda — the parser is out of date');
  }
  return out;
};

/** COLOR key → palette slot, e.g. { milletClay: 'paper', ochreOrange: 'primary' }. */
export const readColorMap = colorsSrc => {
  const body = block(colorsSrc, 'export const COLOR_SLOT = {', 'onganda-colors.ts');
  const map = Object.fromEntries(
    [...body.slice(0, body.indexOf('} as const;')).matchAll(/(\w+):\s*'(\w+)'/g)].map(m => [m[1], m[2]])
  );
  if (Object.keys(map).length < 13) throw new Error('palette-source: could not read COLOR_SLOT');
  return map;
};

/** COLOR as hex for one palette, e.g. colorFor(p, map).ochreOrange === '#D9791F'. */
export const colorFor = (palette, map) => Object.fromEntries(Object.entries(map).map(([key, slot]) => [key, palette[slot]]));
