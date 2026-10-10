// ─── Onganda Design System — Color Tokens ─────────────────────────────────────
// Brand colors, texture tokens, and color arrays. Import from here when you
// need palette values without pulling in content data.
//
// Every value is built from the palette chosen with selectPalette()
// (onganda-palettes.ts), and rebuilt in place when it changes, so a module
// holding a reference to COLOR or SWATCHES sees the new values. The COLOR keys
// keep the Onganda pigment names so existing code compiles unchanged; under
// another palette each key holds the pigment that does the same job.

import type { SwatchEntry, DitherCol } from './onganda-types';
import { activePalette, onPaletteChange, type Palette } from './onganda-palettes';

/** The palette in use. A live binding: it follows selectPalette(). */
export let PALETTE: Palette = activePalette();

/** Which palette slot each COLOR key reads. */
export const COLOR_SLOT = {
  milletClay: 'paper',
  dustLight: 'surface',
  mahanguGold: 'secondary',
  ochreOrange: 'primary',
  firedRed: 'critical',
  barkRust: 'primaryInk',
  mopaneBrown: 'deep',
  mopaneBrownLight: 'deepLight',
  charBlack: 'ink',
  dyePlum: 'rare',
  darkBg: 'darkCanvas',
  darkCard: 'darkSurface',
  darkCardAlt: 'darkInverse'
} as const;

type ColorKey = keyof typeof COLOR_SLOT;
const colorOf = (p: Palette) =>
  Object.fromEntries(Object.entries(COLOR_SLOT).map(([key, slot]) => [key, p[slot]])) as Record<ColorKey, string>;

export const COLOR: Readonly<Record<ColorKey, string>> = colorOf(PALETTE);

const kebab = (s: string) => s.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();

// CSS-variable form of COLOR for consumers who theme via stylesheet overrides.
// Each value resolves to the --onganda-* custom property (shipped in style.css)
// with the palette's hex as fallback. Use where a plain CSS color string is
// accepted (background, color, border); keep COLOR for hex math like `${hex}60`.
const cssVarsOf = (c: Record<ColorKey, string>) =>
  Object.fromEntries(Object.entries(c).map(([key, hex]) => [key, `var(--onganda-${kebab(key)}, ${hex})`])) as Record<ColorKey, string>;
export const COLOR_CSS_VARS: Readonly<Record<ColorKey, string>> = cssVarsOf(COLOR);

// ─── Basket-weave texture (Oshiwambo coil strands + stepped diamond) ──────────
// Drawn in the palette's ink (light) and paper (dark).
const fill = (hex: string) => `%23${hex.slice(1)}`;
const strand = (hex: string) => `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='18' height='10'%3E%3Cellipse cx='2' cy='5' rx='4.5' ry='2.8' fill='${fill(hex)}'/%3E%3Cellipse cx='11' cy='5' rx='4.5' ry='2.8' fill='${fill(hex)}'/%3E%3C/svg%3E")`;
const diamond = (hex: string) => `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='64' height='64'%3E%3Crect x='30' y='18' width='4' height='4' fill='${fill(hex)}'/%3E%3Crect x='26' y='22' width='4' height='4' fill='${fill(hex)}'/%3E%3Crect x='34' y='22' width='4' height='4' fill='${fill(hex)}'/%3E%3Crect x='22' y='26' width='4' height='12' fill='${fill(hex)}'/%3E%3Crect x='38' y='26' width='4' height='12' fill='${fill(hex)}'/%3E%3Crect x='26' y='38' width='4' height='4' fill='${fill(hex)}'/%3E%3Crect x='34' y='38' width='4' height='4' fill='${fill(hex)}'/%3E%3Crect x='30' y='42' width='4' height='4' fill='${fill(hex)}'/%3E%3C/svg%3E")`;
const weaveOf = (c: Record<ColorKey, string>) => ({
  light: `${diamond(c.charBlack)}, ${strand(c.charBlack)}`,
  dark: `${diamond(c.milletClay)},  ${strand(c.milletClay)}`,
  size: '64px 64px, 18px 10px'
});
export const WEAVE: Readonly<ReturnType<typeof weaveOf>> = weaveOf(COLOR);

// The nine pigments as the brand guide shows them, named and described by the
// palette. `light` marks the pale ones.
const swatchesOf = (p: Palette): SwatchEntry[] => {
  const swatch = (slot: keyof Palette['swatches'], light: boolean): SwatchEntry =>
    ({ name: p.swatches[slot][0], hex: p[slot], desc: p.swatches[slot][1], light });
  return [
    swatch('canvas', true),
    swatch('surface', true),
    swatch('secondary', true),
    swatch('primary', false),
    swatch('critical', false),
    swatch('primaryInk', false),
    swatch('deep', false),
    swatch('ink', false),
    swatch('rare', false)
  ];
};
export const SWATCHES: SwatchEntry[] = swatchesOf(PALETTE);

// ─── Editor surface tones ──────────────────────────────────────────────────
// Paper/panel/canvas tones used by DocumentEditor and SlideEditor. Kept apart
// from COLOR (the 12 core brand tokens mirrored in lib-style.css CSS vars) —
// these are editor-only surface variants, not brand identity colors.
export const EDITOR_SURFACE = {
  paperWhite: '#FFFFFF',
  paperWarm: '#FDFAF2',
  dustCream: '#F0E8D4',
  dustHover: '#EDE0C4',
  dustPanel: '#E0D8C6',
  dustPanelDeep: '#DDD6C3',
  dustWell: '#D8D1BF',
  dustHeader: '#D5CEBB',
  canvasWellDark: '#0E0C0A',
  emberBrown: '#2A2420',
  smokeGray: '#888888'
} as const;

// The brand guide's swatch rows and the dither columns, in the palette's hues.
const arraysOf = (c: Record<ColorKey, string>) => {
  const { ochreOrange: O, firedRed: F, mahanguGold: G, barkRust: B, mopaneBrown: M, charBlack: K, dyePlum: P } = c;
  return {
    guide: [O, B, G, M, P],
    footer: [O, F, G, B, M, K],
    hero: [O, F, G, B, M],
    dither: [
      { colors: [O, F, O, B, K, O, G, F], delay: 0 },
      { colors: [B, O, K, F, G, B, O, K], delay: 0.4 },
      { colors: [G, B, O, K, F, G, M, O], delay: 0.8 },
      { colors: [M, G, B, O, K, M, F, B], delay: 1.2 },
      { colors: [P, M, O, B, G, K, O, M], delay: 0.2 }
    ] as DitherCol[]
  };
};
const arrays = arraysOf(COLOR);
export const GUIDE_PALETTE_SWATCHES: string[] = arrays.guide;
export const FOOTER_DITHER_SWATCHES: string[] = arrays.footer;
export const HERO_DITHER_COLORS: string[] = arrays.hero;
export const DITHER_COLS: DitherCol[] = arrays.dither;

/** Replace an array's contents, keeping the array every importer holds. */
export const refill = <T>(target: T[], next: T[]) => { target.splice(0, target.length, ...next); };

/** A module-level value built from the palette: `followPalette(() => [...])`.
 *  It is built now and rebuilt in place on a palette change, so a component
 *  holding it renders the new palette. Arrays are refilled, objects reassigned. */
export const followPalette = <T extends object>(build: () => T): T => {
  const value = build();
  onPaletteChange(() => {
    const next = build();
    if (Array.isArray(value)) refill(value as unknown[], next as unknown[]);
    else Object.assign(value, next);
  });
  return value;
};

// A new palette: rebuild every value above in place.
onPaletteChange(() => {
  PALETTE = activePalette();
  Object.assign(COLOR, colorOf(PALETTE));
  Object.assign(COLOR_CSS_VARS, cssVarsOf(COLOR));
  Object.assign(WEAVE, weaveOf(COLOR));
  refill(SWATCHES, swatchesOf(PALETTE));
  const next = arraysOf(COLOR);
  refill(GUIDE_PALETTE_SWATCHES, next.guide);
  refill(FOOTER_DITHER_SWATCHES, next.footer);
  refill(HERO_DITHER_COLORS, next.hero);
  refill(DITHER_COLS, next.dither);
});
