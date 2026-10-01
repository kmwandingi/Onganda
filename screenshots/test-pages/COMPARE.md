# Consumer test pages against the reference

Each page under `/test` is built only from `@onganda/design-system`, the way
a product would build it (`src/test-pages`). Regenerate with
`npm run test-pages` after `npm run build`.

Open a `compare-*.png`: the page on the left, the reference shots it should
resemble on the right, at the same scale. If the left side reads as a cheaper
version of the right, the gap is in the package, not in the page.

| Page | Route | What it tests | Compared with |
|---|---|---|---|
| [`app`](./compare-app.png) | `/test/app` | A product screen: quiet chrome, one feature surface, a table, an inspector, a dialog. | `product-surface`, `patterns-light`, `controls-light` |
| [`studio`](./compare-studio.png) | `/test/studio` | A media tool intake screen: header action, peer inputs with icon tiles, a drop zone, an input group. | `product-surface`, `system-cards`, `controls-light` |
| [`dashboard`](./compare-dashboard.png) | `/test/dashboard` | A monitoring dashboard: stat band, charts drawn with recharts, a status table, notices. | `site-signal-band`, `charts`, `roadmap`, `connection-diagram` |
| [`form`](./compare-form.png) | `/test/form` | A multi-section form: every control in every state, a summary, an inverse panel. | `controls-light`, `controls-inverse`, `site-contact` |
| [`landing`](./compare-landing.png) | `/test/landing` | An editorial page: hero, ticker, system grid, focus rows, editorial section, contact, footer. | `site-systems-grid`, `system-cards`, `site-focus-rows`, `site-contact`, `icons`, `palette` |
| [`launch`](./compare-launch.png) | `/test/launch` | A second landing page with the creative dials set differently from /test/landing: gold lead, split hero, bento, mid-page inverse, lift. | `expressive-range`, `site-systems-grid` |
| [`article`](./compare-article.png) | `/test/article` | A reading surface: long-form type, a results table, a pull quote, a side rail. | `publications`, `brand-principles` |
