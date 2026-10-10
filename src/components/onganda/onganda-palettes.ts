// ─── Onganda Design System — Palettes ────────────────────────────────────────
// A palette is the set of pigments every role, status, accent and chart series
// is built from. The roles (onganda-roles.ts) say which pigment goes where; a
// palette only says what each pigment is. Swap the palette and every component
// follows, in both modes, with the same measured contrast.
//
// Choose one in ONE file, imported before anything else in the app:
//
//   // src/onganda-palette.ts
//   import { selectPalette } from '@onganda/design-system/palettes';
//   selectPalette('coast');
//
//   // src/main.tsx — first line
//   import './onganda-palette';
//
// The palette is read once, when the design system loads, so every value the
// components derive from it agrees. This module imports nothing else from the
// system; that is what lets the selection run first.
//
// Every shipped palette passes `npm run check:contrast`: CONTRAST_CLAIMS in
// onganda-roles.ts, in both modes. A custom palette from definePalette() is
// measured against the same claims on load, with a console warning for each it
// fails; auditPalette() from the package root returns the full table.
//
// This file is plain data on purpose: scripts/check-contrast.mjs reads it
// without compiling TypeScript, in this repo and in a consumer's node_modules.

/** What each pigment does. Every role in onganda-roles.ts reads one of these,
 *  so the comment on each slot is the contract a palette must meet. */
export interface Palette {
  /** shown in pickers and docs */
  label: string;
  /** one line: the mood and the products it suits */
  description: string;
  /** light page ground; the recessed well */
  canvas: string;
  /** lifted light surface: cards, panels, bands */
  surface: string;
  /** text and lines on light; the label on primary and secondary fills; the
   *  light inverse band */
  ink: string;
  /** text on dark grounds and inverse bands; the label on deep, rare and
   *  danger fills */
  paper: string;
  /** the primary action FILL with ink on it (4.5:1); checked controls; the
   *  accent ink on dark grounds (4.5:1 on darkSurface) */
  primary: string;
  /** the accent as INK on light grounds (4.5:1); the primary's edge; focus */
  primaryInk: string;
  /** the in-card action fill with ink on it; caution; the primary hover in dark */
  secondary: string;
  /** the primary hover fill with paper on it; the secondary's edge; settled */
  deep: string;
  /** settled on dark grounds (3:1 on darkSurface) */
  deepLight: string;
  /** the secondary hover fill with paper on it */
  rare: string;
  /** critical marks and invalid edges (3:1 on light and dark grounds); never
   *  behind text */
  critical: string;
  /** the danger button fill with paper on it */
  danger: string;
  darkCanvas: string;
  darkSurface: string;
  /** the inverse band in dark mode, marked with a primary edge */
  darkInverse: string;
  /** five peer accents for light grounds, in rotation order; also the five
   *  system identities */
  peers: readonly [string, string, string, string, string];
  /** the same five for dark grounds — hues that read as marks come first */
  peersDark: readonly [string, string, string, string, string];
  /** six chart series, in fixed order */
  chart: readonly [string, string, string, string, string, string];
  /** the nine pigments as the brand guide shows them: [name, what it is] */
  swatches: Record<'canvas' | 'surface' | 'secondary' | 'primary' | 'critical' | 'primaryInk' | 'deep' | 'ink' | 'rare', readonly [string, string]>;
}

export const PALETTES = {
  // Kalahari earth: millet, ochre, mahangu, mopane. The lab's own palette and
  // the default. No green and no blue, by design.
  onganda: {
    label: 'Onganda',
    description: 'Warm earth. The lab palette: ochre, mahangu gold, mopane and dye plum on millet clay.',
    canvas: '#E8E1CF',
    surface: '#F3E8C3',
    ink: '#1E1A17',
    paper: '#E8E1CF',
    primary: '#D9791F',
    primaryInk: '#8F3E21',
    secondary: '#DFAE2B',
    deep: '#6A4B2E',
    deepLight: '#8F6840',
    rare: '#6F4A6E',
    critical: '#C84A1B',
    danger: '#8F3E21',
    darkCanvas: '#120F0D',
    darkSurface: '#1C1713',
    darkInverse: '#271F1A',
    peers: ['#D9791F', '#8F3E21', '#DFAE2B', '#6A4B2E', '#6F4A6E'],
    peersDark: ['#D9791F', '#DFAE2B', '#8F6840', '#8F3E21', '#6F4A6E'],
    chart: ['#D9791F', '#8F3E21', '#DFAE2B', '#6A4B2E', '#6F4A6E', '#C84A1B'],
    swatches: {
      canvas: ['Millet Clay', 'Base background'], surface: ['Dust Light', 'Lifted surface'],
      secondary: ['Mahangu Gold', 'Secondary highlight'], primary: ['Ochre Orange', 'Warm accent'],
      critical: ['Fired Red', 'Primary highlight'], primaryInk: ['Bark Rust', 'Support accent'],
      deep: ['Mopane Brown', 'Support neutral'], ink: ['Char Black', 'Warm dark'], rare: ['Dye Plum', 'Rare accent']
    }
  },
  // Atlantic fog and signal amber. Cool and exact, for security, infrastructure
  // and data tooling. Radix Colors slate, teal, amber, iris and red; the chart
  // series is Okabe-Ito, safe for every common colour-vision deficiency.
  coast: {
    label: 'Coast',
    description: 'Cool fog and signal amber. Slate, teal and iris for security, infrastructure and data tools.',
    canvas: '#e8e8ec',
    surface: '#f9f9fb',
    ink: '#1c2024',
    paper: '#fcfcfd',
    primary: '#12a594',
    primaryInk: '#0d3d38',
    secondary: '#ffc53d',
    deep: '#60646c',
    deepLight: '#b0b4ba',
    rare: '#3a5bc7',
    critical: '#e5484d',
    danger: '#ce2c31',
    darkCanvas: '#111113',
    darkSurface: '#18191b',
    darkInverse: '#212225',
    peers: ['#008573', '#5753c6', '#ab6400', '#107d98', '#953ea3'],
    peersDark: ['#0bd8b6', '#b1a9ff', '#ffca16', '#4ccce6', '#e796f3'],
    chart: ['#009E73', '#0072B2', '#E69F00', '#D55E00', '#CC79A7', '#56B4E9'],
    swatches: {
      canvas: ['Fog', 'Base background'], surface: ['Salt', 'Lifted surface'],
      secondary: ['Signal Amber', 'Secondary highlight'], primary: ['Atlantic Teal', 'Primary action'],
      critical: ['Flare Red', 'Critical mark'], primaryInk: ['Deep Water', 'Accent ink'],
      deep: ['Slate', 'Support neutral'], ink: ['Basalt', 'Ink'], rare: ['Iris', 'Rare accent']
    }
  },
  // Salt pan, acacia and sun. Bright and friendly, for education, learning and
  // public services. Radix Colors sand, grass, yellow, blue and red; chart
  // series Okabe-Ito.
  etosha: {
    label: 'Etosha',
    description: 'Salt pan, acacia and sun. Sand, grass green and yellow for education and public services.',
    canvas: '#f1f0ef',
    surface: '#fdfdfc',
    ink: '#21201c',
    paper: '#fdfdfc',
    primary: '#46a758',
    primaryInk: '#203c25',
    secondary: '#ffe629',
    deep: '#63635e',
    deepLight: '#b5b3ad',
    rare: '#0d74ce',
    critical: '#e54d2e',
    danger: '#ce2c31',
    darkCanvas: '#111110',
    darkSurface: '#191918',
    darkInverse: '#222221',
    peers: ['#2a7e3b', '#0d74ce', '#ab6400', '#d13415', '#6550b9'],
    peersDark: ['#71d083', '#70b8ff', '#ffca16', '#ff977d', '#baa7ff'],
    chart: ['#0072B2', '#009E73', '#E69F00', '#CC79A7', '#D55E00', '#56B4E9'],
    swatches: {
      canvas: ['Salt Pan', 'Base background'], surface: ['Chalk', 'Lifted surface'],
      secondary: ['Sun', 'Secondary highlight'], primary: ['Acacia', 'Primary action'],
      critical: ['Ember', 'Critical mark'], primaryInk: ['Thorn', 'Accent ink'],
      deep: ['Shade', 'Support neutral'], ink: ['Dusk', 'Ink'], rare: ['Sky', 'Rare accent']
    }
  }
} as const satisfies Record<string, Palette>;

export type PaletteName = keyof typeof PALETTES;

/** Types a custom palette. Copy a shipped one and change its pigments; the
 *  slot comments in `Palette` are the contrast each must meet. */
export const definePalette = (palette: Palette): Palette => palette;

const store = globalThis as typeof globalThis & { __ongandaPalette?: Palette; __ongandaPaletteRead?: boolean };

/** Choose the palette. Call it before the rest of the system is imported —
 *  see the top of this file. A later call cannot reach values the components
 *  have already built, so it reports the mistake instead of half-applying. */
export const selectPalette = (palette: PaletteName | Palette): void => {
  if (store.__ongandaPaletteRead) {
    console.error('[onganda] selectPalette() ran after the design system loaded, so it was ignored. Import your palette file first, before anything that imports @onganda/design-system.');
    return;
  }
  store.__ongandaPalette = typeof palette === 'string' ? PALETTES[palette] : palette;
};

/** The palette the system was built from. Read once, by onganda-colors.ts. */
export const activePalette = (): Palette => {
  store.__ongandaPaletteRead = true;
  return store.__ongandaPalette ?? PALETTES.onganda;
};
