# Onganda Design System Report

This repository is the remote source of truth for the Onganda design system and its showcase.

## Import Boundary

Use one public import path for app work:

```tsx
import { COLOR, PixelTag, ChartGallery } from '@onganda/design-system';
```

Do not import from `src/components/generated/*` in feature code. Those files are implementation modules behind the package boundary.

## System Layers

1. `tokens`: color, system data, texture data, charts data, and shared typed constants.
2. `primitives`: pixel dots, tags, dither bars, overlays, buttons, cards, logo marks, and base icon marks.
3. `icons`: pixel-art interface icons and system icons.
4. `charts`: Recharts compositions using Onganda tokens and motion rules.
5. `sections`: composed showcase sections, hero, diagrams, heatmaps, timelines, applications, and icon banks.
6. `surfaces`: public site pages, publications, document editor, slide editor, and the showcase hub.

## Design Rules

The design system includes motion, interaction, iconography, layout, and editorial tone. A component is not compliant just because it uses the right colors.

Use existing motion patterns: moving black tickers, dither motion, staggered type, card entrance, hover lift, tap compression, and animated flow affordances.

Use existing pixel icons and primitives before adding anything new.

## Current Packaging State

The package name is `@onganda/design-system`, resolved locally through Vite and TypeScript to `src/design-system/index.ts`.

The repository can be consumed as a GitHub remote source of truth. A later package extraction should add compiled `dist/` output and generated `.d.ts` files before publishing to npm.

## Validation Contract

Every UI change must pass:

1. Design drift scan for forbidden generic colors, raw new hex values, rounded brand geometry, stale public links, and `tracking-tight`.
2. `npm run lint`.
3. `npm run build`.
4. Playwright checks for affected routes, mobile fit, desktop fit, motion, hover/tap behavior, console errors, and no horizontal overflow.
