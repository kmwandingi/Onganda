# Changelog

All notable changes to `@onganda/design-system` are documented here.
Format follows [Keep a Changelog](https://keepachangelog.com); versions follow semver.

## [Unreleased]

### Added
- **Colour role layer** (`onganda-roles.ts`): `roles(isDark)`, `ROLE_LIGHT`, `ROLE_DARK`, `ALPHA`, `SYSTEM_COLOR`, `STATUS`, `statusFor()`, `onColor()`, `CHART_SERIES`, `COLOR_POLICY`. `COLOR` says what a colour is; `ROLE` says where it may be used. Components read a role and stop branching on `isDark` per colour.
- **Choice controls**: `PixelCheckbox`, `PixelRadio`, `PixelToggle` — pixel-drawn, sharp-cornered, ochre when checked, with disabled states.
- **`PixelField`** — the one label, hint, and error wrapper for any field. Sets `aria-invalid`, renders errors with `role="alert"`, runs the message at full contrast with a fired-red marker.
- **`invalid` state** on `PixelInput`, `PixelTextarea`, and `PixelSelect`.
- **`onColor(hex)`** — picks an accessible foreground for a colour received as data, by measured luminance.
- **`npm run check:design`** — two guards, both run in `npm run check` and CI:
  - `check:tokens` fails on generic Tailwind colours, off-palette hex and `rgba()`, `oklch`, system colours bound to a surface or border, raw `STATUS` reads, and rounded geometry. The sanctioned palette is parsed from `onganda-colors.ts` at run time, so it cannot drift from the tokens it guards.
  - `check:contrast` recomputes the 68 ratios behind `DESIGN_SYSTEM.md` §4 and fails on a regression.
- **`onganda-check` binary**, shipped with the package: `npx onganda-check src/` gates a consumer project on the same rules; `npx onganda-check --contrast` re-measures after retheming.
- **Control Standards** section on `/showcase`: every sanctioned control in every state, beside the colour role that governs it, with its own light/dark switch so the dark role set is reviewable.
- Nine Playwright tests asserting the colour contract at runtime in both modes, and a seven-width overflow sweep across all three public routes (320–1440px).
- `@onganda/design-system/maps` — accessible Leaflet maps with Onganda markers, routes, legends, popups, dark treatment, and provider configuration.
- Repository-owned `onganda-design-system` agent skill, linked from the supported agent instruction files.
- Focused map interaction, mobile, and visual regression coverage in Playwright.

- **Product patterns** (`onganda-patterns.tsx`): `PixelDialog` (focus trap, escape, scrim, focus restore), `PixelTable`, `PixelNotice`, `PixelEmptyState`, `PixelSkeleton`, `PixelTabs`, `PixelProgress`. None of the seventeen most common product UI patterns existed before; their absence was the largest leak in the system, because a product that needs a modal invents one.
- **Product Patterns** section on `/showcase`: every pattern in every state, with its own light/dark switch.
- **The composition standard** (`DESIGN_GUIDELINES.md` §5, `tests/browser/composition.spec.ts`). Every other guard is a prohibition, and a thin page satisfies all of them. This is the positive half: a finished surface must carry the editorial rhythm, weave texture, pixel marks, a dither rule, pixel iconography, an inverse band, real motion and system controls. Verified to reject a colour-correct page that has none of them.
- **Live-DOM contrast audit** (`tests/browser/contrast.spec.ts`): walks every rendered text node on every route and measures it against the nearest opaque background. It found 493 failures on its first run, in code that passed both static guards.
- A README quickstart with a complete, copy-pasteable screen, a "what do I use for…" table, and the five rules that trip people up. The smoke test compiles the README example so it cannot rot.

- **`npm run test:consumer`** — builds a real Vite + React + Tailwind consumer app against the packed tarball and renders it. Everything before this verified compilation only.
- **`npm run check:docs`** — the rules are restated in nine documents; this asserts they agree with the token source and with each other. It immediately caught a `textMuted` figure left stale by a token change.
- **`tests/browser/contrast-pixels.spec.ts`** — measures contrast from screenshots, so textures, dither columns and mid-animation frames are included. The DOM audit resolves the first opaque ancestor and cannot see them.
- **`tests/browser/identity.spec.ts`** — asserts a system's hue still appears wherever its name does, so making a label readable relocates the identity instead of deleting it.
- Contrast coverage inside the document and slide editors, which sit behind a click and were never reached by the route sweep.

### Changed
- `PixelButton` variants are now `primary` | `accent` | `ghost` | `danger`, each with one measured recipe, per-variant hover foregrounds, `isDark` and `disabled` support, an `accentInk` focus ring, and `MOTION.tap`.
- **Accessibility corrections across the role layer.** Every value is now measured against WCAG AA rather than chosen by eye:
  - `textMuted` 0.45 → 0.63 light, 0.40 → 0.52 dark. The old values were 2.73:1 and 3.20:1, under the 4.5:1 floor for labels and captions.
  - `fieldBorder` 0.15 → 0.50 light, 0.42 dark. The old value was 1.35:1; a transparent-ground field's border is its only affordance and needs 3:1.
  - Accent fills now carry char black, not millet clay — millet clay on ochre is 2.4:1.
  - The light-mode accent ink, focus ring, and field focus are bark rust, not ochre. Ochre as ink on a light surface is 2.4:1.
  - `dangerBg` is bark rust, not fired red. Fired red's best foreground is 4.05:1, under the floor for a button label. Fired red remains the critical status and border colour.
  - Dark-mode `actionBg` is millet clay, mirroring light mode's char black; both warm up to ochre on hover.
  - Checked controls gained `controlOnBorder`: the ochre fill is 2.56:1 against dust light, so the edge carries the boundary.
  - `PixelField` error text runs at full contrast with a red marker instead of in fired red.
  - `PixelTag` picks its foreground by measured luminance instead of comparing against one token — dust light on ochre (2.56:1) previously slipped through.
- `surfaceRaised` renamed to `surfaceWell` and made consistent: it recedes toward the canvas in both modes. The old name described the opposite of what light mode did.
- Dark-mode `inverse` no longer collapses into the raised surface; the new `inverseBorder` role carries the ochre edge that marks the inverse card in dark mode.
- `PixelDot` renders a `<span>` (valid inside a `<p>`) and accepts `ring` and `offset`.
- Charts read the shared `CHART_SERIES` order instead of a local copy.
- Public contact fields, the showcase and field-application CTAs, and the editor export buttons now use the shared primitives and roles instead of hand-rolled markup.
- Editor "saved" indicators read `statusFor('settled', isDark)` instead of mahangu gold.

- **493 contrast failures on the rendered pages**, all in code that passed the token guard: ink and paper at alphas below the floor, ochre used as ink on light surfaces, and identity hues used as labels. Text colours now resolve through the role layer, and `inkOn(hex, surface)` makes a brand hue safe wherever one arrives as data.
- `check:tokens` now reads the governed file list **from the directory** instead of a hardcoded array, which had silently exempted six modules including the new patterns file.

- The contrast model now covers the eleven `EDITOR_SURFACE` grounds. Two of them — `emberBrown` and `canvasWellDark` — are dark tones used in light mode, which is how ink text at **1.13:1** survived in the document editor. `ALPHA.muted` rose to 0.66/0.55 and `ALPHA.control` to 0.51 so every ground clears its floor. The guard grew from 68 to 118 measurements.
- The composition standard measures distribution, not just presence: a page whose language sits in one decorated corner while every other section is bare now fails.
- `check:tokens` derives its governed file list from the directory, and `package-smoke` asserts the muted alpha *clears 4.5:1* rather than pinning a literal that drifts.

### Fixed
- `PixelButton` with `variant="primary"` rendered char black as an `<a>` and ochre as a `<button>`. Both now render the primary recipe.
- An accent button on the black lab card resolved its hover to char black and disappeared into the card. Controls on an inverse surface now take the dark role set.
- `PixelButton` passed HTML props to framer-motion behind a type assertion. The conflicting drag and animation handlers are now excluded from the prop surface.
- Three non-zero `borderRadius` values in the hero glow, document editor, and slide editor.
- **`style.css` shipped an invalid CSS declaration that broke every Tailwind 4 consumer build.** A `**/` inside a glob in the header comment closed the comment early, so `*.{js,cjs}']` was parsed as CSS. The documented setup path did not work at all.
- **The documented Tailwind `@source` path was wrong** and silently produced unstyled components — correct markup, no utilities, no error. It is now the path that was verified by rendering.
- Fourteen contrast failures inside the document and slide editors, including char black on ember brown at 1.13:1, ochre used as ink on every editor ground, and export buttons whose hover swapped to a fill that cannot host their label.
- Two system labels in the new Product Patterns table and one in the heatmap named a system with no trace of its hue in the surrounding card.
- Refreshed the stale `onganda-map-desktop` visual baseline, which predated a layout fix to the map eyebrow tag.
- **Horizontal overflow on `/showcase` at every width below 1024px.** Seven separate causes, all now fluid: the 12-column icon-factory canvas (fixed 24px cells), the seven-link nav row (needs ~676px of text, now appears at `lg`), four rule-flanked captions pinned with `white-space: nowrap`, the heatmap card's `items-start` cross-axis sizing, and grid and flex children defaulting to `min-width: auto`. The heatmap grid scrolls inside its card below ~350px rather than widening the page.
- `PixelDot` rendered a `<div>`, which is invalid inside the `<p>` that carries a field error.

### Migration
- `<PixelButton variant="primary">` without `href` was ochre; it is now char black with an ochre hover. Use `variant="accent"` to keep the ochre treatment.
- `variant="danger"` fills with bark rust rather than fired red.
- Text on an accent or checked-control fill is char black, not millet clay.
- `roles().surfaceRaised` is now `roles().surfaceWell`, and its light-mode meaning changed from "elevated" to "recessed".
- `STATUS[name]` still works but `statusFor(name, isDark)` is required for `settled`; the token guard flags direct reads.
- Labels, captions, and field borders are visibly darker. This is the 4.5:1 and 3:1 correction, not a style change.
- `PixelInput`, `PixelTextarea`, and `PixelSelect` keep their existing props. `invalid` is new and optional.

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
- Package: removed the local self-dependency and added complete release files.
- Builds: the showcase and package now use independent output directories.
- Public API: added `/core`, `/charts`, `/editors`, `/ai`, and `/sites` entry points while preserving version 1.x root imports.
- Quality: added clean-consumer, browser, responsive, keyboard, and CI checks.

## [1.0.0] — 2026-06-20

### Added
- Library build (`npm run build:lib`): ESM + CJS bundles, rolled-up TypeScript declarations, and `dist/style.css` design tokens; peers (`react`, `react-dom`, `framer-motion`, `recharts`) externalized.
- Explicit public API entry (`src/design-system/lib-entry.ts`) covering tokens, primitives, icons, charts, sections, block system, export API types, AI authoring, and editor shells.
- `USAGE.md` and `DESIGN_SYSTEM.md` documentation.
