// ─── Onganda Design System — Color Tokens ─────────────────────────────────────
// Brand colors, texture tokens, and color arrays. Import from here when you
// need palette values without pulling in content data.

import type { SwatchEntry, DitherCol } from './onganda-types';

export const COLOR = {
  milletClay: '#E8E1CF',
  dustLight: '#F3E8C3',
  mahanguGold: '#DFAE2B',
  ochreOrange: '#D9791F',
  firedRed: '#C84A1B',
  barkRust: '#8F3E21',
  mopaneBrown: '#6A4B2E',
  charBlack: '#1E1A17',
  dyePlum: '#6F4A6E',
  darkBg: '#120F0D',
  darkCard: '#1C1713',
  darkCardAlt: '#271F1A'
} as const;

// ─── Basket-weave texture (Oshiwambo coil strands + stepped diamond) ──────────
const STRAND_LIGHT = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='18' height='10'%3E%3Cellipse cx='2' cy='5' rx='4.5' ry='2.8' fill='%231E1A17'/%3E%3Cellipse cx='11' cy='5' rx='4.5' ry='2.8' fill='%231E1A17'/%3E%3C/svg%3E")`;
const STRAND_DARK = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='18' height='10'%3E%3Cellipse cx='2' cy='5' rx='4.5' ry='2.8' fill='%23E8E1CF'/%3E%3Cellipse cx='11' cy='5' rx='4.5' ry='2.8' fill='%23E8E1CF'/%3E%3C/svg%3E")`;
const DIAMOND_LIGHT = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='64' height='64'%3E%3Crect x='30' y='18' width='4' height='4' fill='%231E1A17'/%3E%3Crect x='26' y='22' width='4' height='4' fill='%231E1A17'/%3E%3Crect x='34' y='22' width='4' height='4' fill='%231E1A17'/%3E%3Crect x='22' y='26' width='4' height='12' fill='%231E1A17'/%3E%3Crect x='38' y='26' width='4' height='12' fill='%231E1A17'/%3E%3Crect x='26' y='38' width='4' height='4' fill='%231E1A17'/%3E%3Crect x='34' y='38' width='4' height='4' fill='%231E1A17'/%3E%3Crect x='30' y='42' width='4' height='4' fill='%231E1A17'/%3E%3C/svg%3E")`;
const DIAMOND_DARK = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='64' height='64'%3E%3Crect x='30' y='18' width='4' height='4' fill='%23E8E1CF'/%3E%3Crect x='26' y='22' width='4' height='4' fill='%23E8E1CF'/%3E%3Crect x='34' y='22' width='4' height='4' fill='%23E8E1CF'/%3E%3Crect x='22' y='26' width='4' height='12' fill='%23E8E1CF'/%3E%3Crect x='38' y='26' width='4' height='12' fill='%23E8E1CF'/%3E%3Crect x='26' y='38' width='4' height='4' fill='%23E8E1CF'/%3E%3Crect x='34' y='38' width='4' height='4' fill='%23E8E1CF'/%3E%3Crect x='30' y='42' width='4' height='4' fill='%23E8E1CF'/%3E%3C/svg%3E")`;

export const WEAVE = {
  light: `${DIAMOND_LIGHT}, ${STRAND_LIGHT}`,
  dark: `${DIAMOND_DARK},  ${STRAND_DARK}`,
  size: '64px 64px, 18px 10px'
} as const;

export const SWATCHES: SwatchEntry[] = [{
  name: 'Millet Clay',
  hex: '#E8E1CF',
  desc: 'Base background',
  light: true
}, {
  name: 'Dust Light',
  hex: '#F3E8C3',
  desc: 'Lifted surface',
  light: true
}, {
  name: 'Mahangu Gold',
  hex: '#DFAE2B',
  desc: 'Secondary highlight',
  light: true
}, {
  name: 'Ochre Orange',
  hex: '#D9791F',
  desc: 'Warm accent',
  light: false
}, {
  name: 'Fired Red',
  hex: '#C84A1B',
  desc: 'Primary highlight',
  light: false
}, {
  name: 'Bark Rust',
  hex: '#8F3E21',
  desc: 'Support accent',
  light: false
}, {
  name: 'Mopane Brown',
  hex: '#6A4B2E',
  desc: 'Support neutral',
  light: false
}, {
  name: 'Char Black',
  hex: '#1E1A17',
  desc: 'Warm dark',
  light: false
}, {
  name: 'Dye Plum',
  hex: '#6F4A6E',
  desc: 'Rare accent',
  light: false
}];

export const GUIDE_PALETTE_SWATCHES = ['#D9791F', '#8F3E21', '#DFAE2B', '#6A4B2E', '#6F4A6E'];
export const FOOTER_DITHER_SWATCHES = ['#D9791F', '#C84A1B', '#DFAE2B', '#8F3E21', '#6A4B2E', '#1E1A17'];
export const HERO_DITHER_COLORS = ['#D9791F', '#C84A1B', '#DFAE2B', '#8F3E21', '#6A4B2E'];

export const DITHER_COLS: DitherCol[] = [{
  colors: ['#D9791F', '#C84A1B', '#D9791F', '#8F3E21', '#1E1A17', '#D9791F', '#DFAE2B', '#C84A1B'],
  delay: 0
}, {
  colors: ['#8F3E21', '#D9791F', '#1E1A17', '#C84A1B', '#DFAE2B', '#8F3E21', '#D9791F', '#1E1A17'],
  delay: 0.4
}, {
  colors: ['#DFAE2B', '#8F3E21', '#D9791F', '#1E1A17', '#C84A1B', '#DFAE2B', '#6A4B2E', '#D9791F'],
  delay: 0.8
}, {
  colors: ['#6A4B2E', '#DFAE2B', '#8F3E21', '#D9791F', '#1E1A17', '#6A4B2E', '#C84A1B', '#8F3E21'],
  delay: 1.2
}, {
  colors: ['#6F4A6E', '#6A4B2E', '#D9791F', '#8F3E21', '#DFAE2B', '#1E1A17', '#D9791F', '#6A4B2E'],
  delay: 0.2
}];
