// ─── Onganda Design System — Palettes ────────────────────────────────────────
// A palette is the set of pigments every role, status, accent and chart series
// is built from. The roles (onganda-roles.ts) say which pigment goes where; a
// palette only says what each pigment is. Swap the palette and every component
// follows, in both modes, with the same measured contrast.
//
// Choose one in ONE file, imported by the app entry, before the first render:
//
//   // src/onganda-palette.ts
//   import { selectPalette } from '@onganda/design-system/palettes';
//   selectPalette('coast');
//
//   // src/main.tsx — first line
//   import './onganda-palette';
//
// Module load order cannot be relied on: a bundler that splits the system into
// its own chunk evaluates it before the entry's code. So selectPalette()
// notifies every value the system built from the palette, and each rebuilds in
// place (onPaletteChange). Anything rendered after the call uses the palette.
// This module imports nothing else from the system.
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
  /** the hue rules this palette adds to the shared ones — what an agent must
   *  not do with these pigments. The showcase and the docs read it, so the
   *  rule a reader sees is always the active palette's. */
  rules: string;
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
  /** the document and slide editors' paper and panel grounds, lightest
   *  first; the last two are dark (text roles 4.5:1 on each, in the mode
   *  that reads on it) */
  editor: Record<EditorTone, string>;
  /** the nine pigments as the brand guide shows them: [name, what it is] */
  swatches: Record<'canvas' | 'surface' | 'secondary' | 'primary' | 'critical' | 'primaryInk' | 'deep' | 'ink' | 'rare', readonly [string, string]>;
}

export type EditorTone = 'paperWhite' | 'paperWarm' | 'dustCream' | 'dustHover' | 'dustPanel' | 'dustPanelDeep' | 'dustWell' | 'dustHeader' | 'canvasWellDark' | 'emberBrown';

export const PALETTES = {
  // Kalahari earth: millet, ochre, mahangu, mopane. The lab's own palette and
  // the default. No green and no blue, by design.
  onganda: {
    label: 'Onganda',
    description: 'Warm earth. The lab palette: ochre, mahangu gold, mopane and dye plum on millet clay.',
    rules: 'No green and no blue. Success is a check glyph on the settled tone, never a new hue.',
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
    editor: {
      paperWhite: '#FFFFFF', paperWarm: '#FDFAF2', dustCream: '#F0E8D4', dustHover: '#EDE0C4', dustPanel: '#E0D8C6',
      dustPanelDeep: '#DDD6C3', dustWell: '#D8D1BF', dustHeader: '#D5CEBB', canvasWellDark: '#0E0C0A', emberBrown: '#2A2420'
    },
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
    rules: 'Cool, with one warm signal: amber is the secondary action and caution, and nothing else. Success is a check glyph on the settled slate, never a green.',
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
    editor: {
      paperWhite: '#ffffff', paperWarm: '#fcfcfd', dustCream: '#f0f0f3', dustHover: '#e8e8ec', dustPanel: '#e0e1e6',
      dustPanelDeep: '#dddde3', dustWell: '#d9d9e0', dustHeader: '#d7d8de', canvasWellDark: '#0b0b0d', emberBrown: '#272a2d'
    },
    swatches: {
      canvas: ['Fog', 'Base background'], surface: ['Salt', 'Lifted surface'],
      secondary: ['Signal Amber', 'Secondary highlight'], primary: ['Atlantic Teal', 'Primary action'],
      critical: ['Flare Red', 'Critical mark'], primaryInk: ['Deep Water', 'Accent ink'],
      deep: ['Slate', 'Support neutral'], ink: ['Basalt', 'Ink'], rare: ['Iris', 'Rare accent']
    }
  },
  // Salt pan, acacia and sun. Bright and friendly, for education, learning and
  // public services. Radix Colors sand, grass, blue and red; the sun is
  // Tailwind's yellow-400, warmer and quieter than Radix yellow beside grass.
  // Chart series Okabe-Ito.
  etosha: {
    label: 'Etosha',
    description: 'Salt pan, acacia and sun. Sand, grass green and yellow for education and public services.',
    rules: 'Green is the primary action, so it never also means success: success is a check glyph on the settled tone. Yellow is a fill, never text.',
    canvas: '#f1f0ef',
    surface: '#fdfdfc',
    ink: '#21201c',
    paper: '#fdfdfc',
    primary: '#46a758',
    primaryInk: '#203c25',
    secondary: '#facc15',
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
    editor: {
      paperWhite: '#ffffff', paperWarm: '#fdfdfc', dustCream: '#f9f9f8', dustHover: '#f1f0ef', dustPanel: '#e9e8e6',
      dustPanelDeep: '#e2e1de', dustWell: '#dddcd9', dustHeader: '#dad9d6', canvasWellDark: '#0b0b0a', emberBrown: '#2a2a28'
    },
    swatches: {
      canvas: ['Salt Pan', 'Base background'], surface: ['Chalk', 'Lifted surface'],
      secondary: ['Sun', 'Secondary highlight'], primary: ['Acacia', 'Primary action'],
      critical: ['Ember', 'Critical mark'], primaryInk: ['Thorn', 'Accent ink'],
      deep: ['Shade', 'Support neutral'], ink: ['Dusk', 'Ink'], rare: ['Sky', 'Rare accent']
    }
  },
  // Indigo ink and brass on paper. Deliberate and quiet, for evidence review in
  // financial integrity work. Named for the Olupale product it was built with.
  // No green: no result is not clearance, so no state may read as "all clear".
  olupale: {
    label: 'Olupale',
    description: 'Indigo ink and brass on paper, for evidence review in financial integrity work.',
    rules: 'No green. No-result and low-risk states are never green, because no result is not clearance. Every state carries text, an icon and a shape as well as colour.',
    canvas: '#E8E0CF',
    surface: '#F7F3E8',
    ink: '#191B2A',
    paper: '#F7F3E8',
    primary: '#D7A43B',
    primaryInk: '#2F3A78',
    secondary: '#ECD08C',
    deep: '#2F3A78',
    deepLight: '#8C9BE0',
    rare: '#98640F',
    critical: '#C23B22',
    danger: '#A52A1A',
    darkCanvas: '#0F1020',
    darkSurface: '#171828',
    darkInverse: '#20223A',
    peers: ['#2F3A78', '#98640F', '#7A3E6B', '#3A6EA5', '#8A4B2D'],
    peersDark: ['#8C9BE0', '#D7A43B', '#C48BB8', '#7FB0E0', '#D49A74'],
    chart: ['#2F3A78', '#D7A43B', '#7A3E6B', '#3A6EA5', '#98640F', '#C23B22'],
    editor: {
      paperWhite: '#FFFFFF', paperWarm: '#FBF8F0', dustCream: '#F1EBDC', dustHover: '#ECE4D0', dustPanel: '#E6DECB',
      dustPanelDeep: '#E2DAC6', dustWell: '#DDD5C1', dustHeader: '#D9D1BD', canvasWellDark: '#0B0C18', emberBrown: '#1F2136'
    },
    swatches: {
      canvas: ['Paper', 'Base background'], surface: ['Quiet surface', 'Panels and bands'],
      secondary: ['Pale brass', 'Secondary highlight'], primary: ['Brass', 'Primary action'],
      critical: ['Signal red', 'Critical mark'], primaryInk: ['Indigo', 'Accent ink'],
      deep: ['Deep indigo', 'Hover and settled'], ink: ['Night ink', 'Ink'], rare: ['Brass ink', 'Text-safe brass']
    }
  },
  // Sorghum and husk rose on swept stone, with dusk slate. The threshing floor
  // at the end of the day, for document checks in financial integrity work.
  // Named for the Oshipale product. No green: a passed check is not clearance.
  oshipale: {
    label: 'Oshipale',
    description: 'Sorghum and husk rose on swept stone, with dusk slate, for document checks in financial integrity work.',
    rules: 'No green. No state reads as all clear: a passed check is a check glyph on the settled tone with its words. Husk rose is the action fill and never a state; chaff is a fill and never text.',
    canvas: '#E3E1DC',
    surface: '#F4F3EF',
    ink: '#1B1820',
    paper: '#F4F3EF',
    primary: '#E2A08E',
    primaryInk: '#6B2346',
    secondary: '#E6CC85',
    deep: '#6B2346',
    deepLight: '#D79AB6',
    rare: '#3D5A80',
    critical: '#C8372D',
    danger: '#9C2A2C',
    darkCanvas: '#110F15',
    darkSurface: '#1A1720',
    darkInverse: '#251F2C',
    peers: ['#6B2346', '#3D5A80', '#8A6A1B', '#7A4A8C', '#8E4A36'],
    peersDark: ['#D79AB6', '#9DB9DD', '#E6CC85', '#C6A6DA', '#E0A48C'],
    chart: ['#6B2346', '#4F7BA8', '#C9A43E', '#7A4A8C', '#B0603F', '#C8372D'],
    editor: {
      paperWhite: '#FFFFFF', paperWarm: '#FAF9F6', dustCream: '#EFEDE8', dustHover: '#E9E7E1', dustPanel: '#E3E1DB',
      dustPanelDeep: '#DEDCD5', dustWell: '#DAD8D1', dustHeader: '#D6D4CC', canvasWellDark: '#0B0A0E', emberBrown: '#221E27'
    },
    swatches: {
      canvas: ['Floor stone', 'Base background'], surface: ['Swept floor', 'Lifted surface'],
      secondary: ['Chaff', 'Secondary highlight'], primary: ['Husk rose', 'Primary action'],
      critical: ['Signal red', 'Critical mark'], primaryInk: ['Sorghum', 'Accent ink'],
      deep: ['Deep sorghum', 'Hover and settled'], ink: ['Night ink', 'Ink'], rare: ['Dusk blue', 'Rare accent']
    }
  }
} as const satisfies Record<string, Palette>;

export type PaletteName = keyof typeof PALETTES;

/** Types a custom palette. Copy a shipped one and change its pigments; the
 *  slot comments in `Palette` are the contrast each must meet. */
export const definePalette = (palette: Palette): Palette => palette;

// On globalThis, so a second copy of the package in one app shares the choice.
const store = globalThis as typeof globalThis & { __ongandaPalette?: Palette; __ongandaPaletteListeners?: (() => void)[] };

/** Choose the palette, before the first render (see the top of this file). */
export const selectPalette = (palette: PaletteName | Palette): void => {
  store.__ongandaPalette = typeof palette === 'string' ? PALETTES[palette] : palette;
  for (const rebuild of store.__ongandaPaletteListeners ?? []) rebuild();
};

/** The palette in use. */
export const activePalette = (): Palette => store.__ongandaPalette ?? PALETTES.onganda;

/** Run `rebuild` whenever the palette changes, so a value the system built
 *  from it at load follows. Listeners run in the order modules registered
 *  them, so a module's dependencies rebuild before it does. */
export const onPaletteChange = (rebuild: () => void): void => {
  (store.__ongandaPaletteListeners ??= []).push(rebuild);
};
