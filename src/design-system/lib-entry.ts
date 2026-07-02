// ─── Onganda Design System — Library Entry ─────────────────────────────────────
// Published npm package entry point. Re-exports the complete design-system
// barrel so every token, primitive, icon, chart, section, editor shell, public
// site surface, and export utility is importable — the package surface can
// never drift from the source of truth.
//
// Consumers:
//   import { COLOR, PixelDot, DocumentEditor, ... } from '@onganda/design-system';
//   import '@onganda/design-system/style.css';   ← design tokens (import separately)

export * from '../components/onganda/onganda-design-system';
