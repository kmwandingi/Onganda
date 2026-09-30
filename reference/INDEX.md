# Reference screenshots

Every primitive and pattern as the showcase renders it. Regenerate with
`npm run reference` after `npm run build`.

**Look at these before building a surface, and again after.** The written
rules say what is forbidden; a surface can satisfy every one of them and
still be flat. These show what finished looks like — how much colour a page
carries, how much texture, how many rules, and how the weights sit together.

**Copy the right kind.** `product-surface.png` is an app screen; the
`site-*` shots are public pages; the rest are editorial specimens. A tool
built from editorial devices is the most common cheap imitation.

When you have built something, put your screenshot beside the closest one
here and ask what is different. Usually: colour spent on metadata instead of
identity or state, every surface at feature weight instead of one or two, or
an editorial device (ticker, stat band) on a working screen.

| Screenshot | Shows | Demonstrates |
|---|---|---|
| [`controls-light.png`](./controls-light.png) | Every sanctioned control, every state, on a light surface. | `PixelButton`, `PixelInput`, `PixelTextarea`, `PixelSelect`, `PixelField`, `PixelCheckbox`, `PixelRadio`, `PixelToggle`, `PixelDot`, `PixelTag`, `DensityProvider` |
| [`controls-inverse.png`](./controls-inverse.png) | The same controls on a locally dark surface. Pass isDark when a control sits on the footer, the ticker or a lab card. | `PixelButton`, `PixelToggle`, `PixelCheckbox`, `WeaveOverlay` |
| [`patterns-light.png`](./patterns-light.png) | The compounds a product needs on day one, plus the site compositions. | `PixelNotice`, `PixelDialog`, `PixelTable`, `PixelEmptyState`, `PixelSkeleton`, `PixelTabs`, `PixelProgress`, `PixelPanel`, `PixelChoice`, `PixelChoiceList`, `PixelActions`, `PixelTicker`, `PixelFocusRow`, `PixelLabCard`, `PixelStatBand` |
| [`product-surface.png`](./product-surface.png) | An APP screen, not a marketing page. Quiet chrome, one feature surface, neutral metadata, colour only for identity and state, no ticker or stat band. Copy this for a tool; copy the site shots for a public page. | `PixelPanel`, `PixelTable`, `PixelTag`, `PixelField`, `PixelSelect`, `PixelProgress`, `PixelButton`, `statusFor` |
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
