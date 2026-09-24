# Reference screenshots

Every primitive and pattern as the showcase renders it. Regenerate with
`npm run reference` after `npm run build`.

**Look at these before building a surface, and again after.** The written
rules say what is forbidden; a surface can satisfy every one of them and
still be flat. These show what finished looks like — how much colour a page
carries, how much texture, how many rules, and how the weights sit together.

When you have built something, put your screenshot beside the closest one
here and ask what is different. Usually it is one of three things: one accent
where there should be several, texture on every card instead of the ground,
or a rule under every element instead of one per block.

| Screenshot | Shows | Demonstrates |
|---|---|---|
| [`controls-light.png`](./controls-light.png) | Every sanctioned control, every state, on a light surface. | `PixelButton`, `PixelInput`, `PixelTextarea`, `PixelSelect`, `PixelField`, `PixelCheckbox`, `PixelRadio`, `PixelToggle`, `PixelDot`, `PixelTag`, `DensityProvider` |
| [`controls-inverse.png`](./controls-inverse.png) | The same controls on a locally dark surface. Pass isDark when a control sits on the footer, the ticker or a lab card. | `PixelButton`, `PixelToggle`, `PixelCheckbox`, `WeaveOverlay` |
| [`patterns-light.png`](./patterns-light.png) | The compounds a product needs on day one, plus the site compositions. | `PixelNotice`, `PixelDialog`, `PixelTable`, `PixelEmptyState`, `PixelSkeleton`, `PixelTabs`, `PixelProgress`, `PixelPanel`, `PixelChoice`, `PixelChoiceList`, `PixelActions`, `PixelTicker`, `PixelFocusRow`, `PixelLabCard`, `PixelStatBand` |
| [`system-cards.png`](./system-cards.png) | The five-system card and the inverse cell that closes a grid. Note one accent per card, spent on the spine, the tag and the foot rule. | `SystemCard`, `PixelLabCard`, `SectionHeader`, `PixelTag` |
| [`connection-diagram.png`](./connection-diagram.png) | A diagram in the pixel language rather than a generic chart. | `SystemConnectionDiagram` |
| [`palette.png`](./palette.png) | The nine pigments and what each one is allowed to do. | `SwatchChip`, `COLOR`, `COLOR_POLICY` |
| [`roadmap.png`](./roadmap.png) | A phased timeline. Each phase owns a hue. | `RoadmapTimeline`, `PixelTag` |
| [`charts.png`](./charts.png) | Every chart on one palette, with the Onganda grid and marks. | `ChartGallery`, `CHART_SERIES` |
| [`icons.png`](./icons.png) | The interface icon set, drawn on a 12x12 pixel grid. | `ICON_REGISTRY`, `Px` |
| [`publications.png`](./publications.png) | Document and publication cards. | `Publications` |
| [`brand-principles.png`](./brand-principles.png) | The principles a surface is judged against. | `PrincipleRow`, `SectionHeader` |
| [`site-systems-grid.png`](./site-systems-grid.png) | The reference implementation of a card grid. This is the bar. | `SystemCard`, `PixelLabCard`, `SectionHeader` |
| [`site-signal-band.png`](./site-signal-band.png) | An inverse panel beside a grid of feature cards — the page rhythm to copy. | `PixelInversePanel`, `PixelPanel`, `PixelCornerMarks`, `PixelTag` |
| [`site-contact.png`](./site-contact.png) | The closing surface: the largest card on the page, not a thin footer. | `PixelContactPanel`, `PixelField`, `PixelInput`, `PixelTextarea`, `PixelButton` |
| [`site-focus-rows.png`](./site-focus-rows.png) | A list that reads as a sequence. Each row owns a hue. | `PixelEditorialSection`, `PixelFocusRow` |

Captured from `/showcase`, `/`, `/full` at 1280px with reduced motion.
