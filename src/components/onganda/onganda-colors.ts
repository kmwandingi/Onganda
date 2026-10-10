// ─── Onganda Design System — Color Tokens ─────────────────────────────────────
// Brand colors, texture tokens, and color arrays. Import from here when you
// need palette values without pulling in content data.
//
// Every value is built from the palette chosen with selectPalette()
// (onganda-palettes.ts), read once at load. The COLOR keys keep the Onganda
// pigment names so existing code compiles unchanged; under another palette
// each key holds the pigment that does the same job (see the map below).

import type { SwatchEntry, DitherCol } from './onganda-types';
import { activePalette } from './onganda-palettes';

/** The palette this build of the system was made from. */
export const PALETTE = activePalette();

export const COLOR = {
  milletClay: PALETTE.paper,
  dustLight: PALETTE.surface,
  mahanguGold: PALETTE.secondary,
  ochreOrange: PALETTE.primary,
  firedRed: PALETTE.critical,
  barkRust: PALETTE.primaryInk,
  mopaneBrown: PALETTE.deep,
  mopaneBrownLight: PALETTE.deepLight,
  charBlack: PALETTE.ink,
  dyePlum: PALETTE.rare,
  darkBg: PALETTE.darkCanvas,
  darkCard: PALETTE.darkSurface,
  darkCardAlt: PALETTE.darkInverse
} as const;

const kebab = (s: string) => s.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();

// CSS-variable form of COLOR for consumers who theme via stylesheet overrides.
// Each value resolves to the --onganda-* custom property (shipped in style.css)
// with the palette's hex as fallback. Use where a plain CSS color string is
// accepted (background, color, border); keep COLOR for hex math like `${hex}60`.
export const COLOR_CSS_VARS = Object.fromEntries(
  Object.entries(COLOR).map(([key, hex]) => [key, `var(--onganda-${kebab(key)}, ${hex})`])
) as Record<keyof typeof COLOR, string>;

// ─── Basket-weave texture (Oshiwambo coil strands + stepped diamond) ──────────
// Drawn in the palette's ink (light) and paper (dark).
const fill = (hex: string) => `%23${hex.slice(1)}`;
const strand = (hex: string) => `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='18' height='10'%3E%3Cellipse cx='2' cy='5' rx='4.5' ry='2.8' fill='${fill(hex)}'/%3E%3Cellipse cx='11' cy='5' rx='4.5' ry='2.8' fill='${fill(hex)}'/%3E%3C/svg%3E")`;
const diamond = (hex: string) => `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='64' height='64'%3E%3Crect x='30' y='18' width='4' height='4' fill='${fill(hex)}'/%3E%3Crect x='26' y='22' width='4' height='4' fill='${fill(hex)}'/%3E%3Crect x='34' y='22' width='4' height='4' fill='${fill(hex)}'/%3E%3Crect x='22' y='26' width='4' height='12' fill='${fill(hex)}'/%3E%3Crect x='38' y='26' width='4' height='12' fill='${fill(hex)}'/%3E%3Crect x='26' y='38' width='4' height='4' fill='${fill(hex)}'/%3E%3Crect x='34' y='38' width='4' height='4' fill='${fill(hex)}'/%3E%3Crect x='30' y='42' width='4' height='4' fill='${fill(hex)}'/%3E%3C/svg%3E")`;
const STRAND_LIGHT = strand(COLOR.charBlack);
const STRAND_DARK = strand(COLOR.milletClay);
const DIAMOND_LIGHT = diamond(COLOR.charBlack);
const DIAMOND_DARK = diamond(COLOR.milletClay);

export const WEAVE = {
  light: `${DIAMOND_LIGHT}, ${STRAND_LIGHT}`,
  dark: `${DIAMOND_DARK},  ${STRAND_DARK}`,
  size: '64px 64px, 18px 10px'
} as const;

// The nine pigments as the brand guide shows them, named and described by the
// palette. `light` marks the pale ones.
const swatch = (slot: keyof typeof PALETTE.swatches, light: boolean): SwatchEntry =>
  ({ name: PALETTE.swatches[slot][0], hex: PALETTE[slot], desc: PALETTE.swatches[slot][1], light });

export const SWATCHES: SwatchEntry[] = [
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

const { ochreOrange: O, firedRed: F, mahanguGold: G, barkRust: B, mopaneBrown: M, charBlack: K, dyePlum: P } = COLOR;
export const GUIDE_PALETTE_SWATCHES = [O, B, G, M, P];
export const FOOTER_DITHER_SWATCHES = [O, F, G, B, M, K];
export const HERO_DITHER_COLORS = [O, F, G, B, M];

export const DITHER_COLS: DitherCol[] = [{
  colors: [O, F, O, B, K, O, G, F],
  delay: 0
}, {
  colors: [B, O, K, F, G, B, O, K],
  delay: 0.4
}, {
  colors: [G, B, O, K, F, G, M, O],
  delay: 0.8
}, {
  colors: [M, G, B, O, K, M, F, B],
  delay: 1.2
}, {
  colors: [P, M, O, B, G, K, O, M],
  delay: 0.2
}];
