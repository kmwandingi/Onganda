// ─── Onganda Design System — Tokens (barrel) ──────────────────────────────────
// Re-exports from the three split token files. Import from here for backwards
// compatibility, or import directly from the specific file:
//   onganda-types.ts   — TypeScript interfaces
//   onganda-palettes.ts — PALETTES, definePalette (selectPalette lives only in
//                         the /palettes entry, which must load first)
//   onganda-colors.ts  — COLOR, PALETTE, WEAVE, SWATCHES, color arrays
//   onganda-roles.ts   — ROLE_LIGHT/ROLE_DARK, roles(), SYSTEM_COLOR, STATUS
//   onganda-type.ts    — TYPE, DISPLAY, FONT, SPACE_SCALE, GEOMETRY, DENSITY
//   onganda-content.ts — SYSTEMS, TIMELINE_PHASES, and all data arrays
export * from './onganda-types';
export { PALETTES, definePalette, type Palette, type PaletteName } from './onganda-palettes';
export * from './onganda-colors';
export * from './onganda-roles';
export * from './onganda-type';
export * from './onganda-content';
