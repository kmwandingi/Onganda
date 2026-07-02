# Changelog

All notable changes to `@onganda/design-system` are documented here.
Format follows [Keep a Changelog](https://keepachangelog.com); versions follow semver.

## [1.1.0] — 2026-06-22

### Added
- `DarkProvider` — ready-made `DarkContext` wrapper with localStorage persistence; consumers no longer write provider boilerplate.
- `MOTION` and `SPACE` tokens (`onganda-motion.ts`) — canonical entrance, stagger, hover, tap, and ticker presets plus the editorial spacing scale, tunable from one place.
- `COLOR_CSS_VARS` — CSS-variable form of every `COLOR` token (`var(--onganda-*, #hex)`) for stylesheet-level theming in consumer projects.
- Form primitives: `PixelInput`, `PixelTextarea`, `PixelSelect` — sharp-cornered fields in the pixel language with ochre focus states; used by the public contact section.
- Pixel icon factory (`onganda-icon-factory.tsx`): `createPixelIcon`, `validatePixelIconDef`, `pixelIconToSvgString`, and the `PixelIconDef`/`PixelRect` types. New icons are defined as rect data instead of hand-written JSX.

### Changed
- Public site: mobile navigation (hamburger + animated panel), skip-to-content link, `<main>` landmark, SEO/OpenGraph meta tags, contact form fields moved onto the new form primitives.
- App shell: `/showcase` is now lazy-loaded so public pages no longer ship the editor bundle.

## [1.0.0] — 2026-06-20

### Added
- Library build (`npm run build:lib`): ESM + CJS bundles, rolled-up TypeScript declarations, and `dist/style.css` design tokens; peers (`react`, `react-dom`, `framer-motion`, `recharts`) externalized.
- Explicit public API entry (`src/design-system/lib-entry.ts`) covering tokens, primitives, icons, charts, sections, block system, export API types, AI authoring, and editor shells.
- `USAGE.md` and `DESIGN_SYSTEM.md` documentation.
