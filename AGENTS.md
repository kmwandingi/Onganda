# Repository agent instructions

**Onganda is a closed system.** Everything permitted is in
`tokens/onganda.tokens.json`. Any colour, type size, spacing value, radius or
shadow not in that file is not acceptable. `npm run check:design` fails on
violations; do not widen a check to make one pass.

**The public site is the source of the design system, not a consumer of it.**
`/` and `/full` are the reference implementation of the brand. The tokens and
patterns here are a transcript of them — the type scale was measured off the
rendered DOM. To change the system, change the public site first and
re-measure; never retune a token to suit a new surface.
`tests/browser/fidelity.spec.ts` fails when the two disagree.

**Look at `reference/` before building a visual surface, and copy the right
kind.** `product-surface.png` for a tool, the `site-*` shots for a public page.
The rules in this file are prohibitions; a surface can satisfy all of them and
still look like a cheap imitation. The usual causes: colour spent on metadata
(a tag without `hex` is neutral; `accentFor(i)` is for peer cards only), every
surface at feature weight (working chrome is `emphasis="quiet"`), and editorial
devices — ticker, stat band — transplanted onto a tool. Style from
`tokens.css` roles, never the pigments. Re-run `npm run reference` if you
change how a primitive looks.

For Onganda UI, design-system, or new-project work, read and follow `skills/onganda-design-system/SKILL.md` before changing code. Treat `DESIGN_SYSTEM.md` as the language specification and `DESIGN_GUIDELINES.md` as the implementation contract.

Two sections govern most day-to-day decisions and are enforced by `npm run check:design`:

- `DESIGN_SYSTEM.md` §4 Color Roles — which colour may be used where. Style from `roles(isDark)`, never the raw palette. Every value is measured: ochre is the accent as a *fill* but is 2.4:1 as ink on light, so the light-mode accent ink is bark rust; fired red is an indicator only; the system colours mean system membership, not decoration.
- `DESIGN_SYSTEM.md` §5 Controls — one recipe per control. Never hand-roll a button, field, checkbox, radio, or toggle. A control on an inverse surface takes the dark role set.

`npm run check:design` runs two guards: `check:tokens` for lexical drift (it parses the palette from source, so it cannot drift from the tokens it guards) and `check:contrast` for the 68 measured ratios behind §4. Nine Playwright tests cover the runtime half. Neither can tell that a correctly-tokenised colour is on the wrong element — judgement is still required.

The `/showcase` Control Standards section renders every control in every state and carries its own light/dark switch. A control that is not there does not exist yet.

Keep the product's business structure intact. Onganda governs the visual language and interaction quality; the showcase is a reference, not a page template.
