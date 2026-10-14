# Changelog

All notable changes to `@onganda/design-system` are documented here.
Format follows [Keep a Changelog](https://keepachangelog.com); versions follow semver.

## [Unreleased]

### Changed — ghost is a tonal button; added `link`, and a `caption` type step

- **`ghost`** is now a wash of ink at the `line` step with no outline. The
  hairline-black edge read as a form field, not an action. On hover it takes
  the accent edge and label, as before. The "ghost button border 3:1" claim is
  gone; the label is measured on the wash instead.
- **`variant="link"`**: a text action in the accent ink, underlined, flowing as
  text, with icons on the text line. For sources, suggested questions, reply
  options and "Show more", where a box would be noise. On `/showcase` in
  Control Standards and asserted in `control-standards.spec.ts`.
- **`TYPE.caption`**, 12px sentence case: the step to drop to when metadata
  would wrap at 14px.
- **`PixelPanel`**'s ordinal tag no longer shrinks into the card's edge when a
  long eyebrow wraps.
- **`/test/chat`** uses all of these: suggested questions and sources as links,
  feedback as text actions, and a transcript that follows the conversation.

### Added — `/test/chat`, a reference for chat and assistant panels

Agents asked to build an embedded assistant had no example to start from, and
every attempt came out plain. `/test/chat` is one built only from the package:
each turn on a rail with a 24px mark and a small caps label, answers at
reading size with numbered citations, sources shown with the answer, starter
questions as peer cards, and the field and its button as one control. It is in
the contrast and critical-path tests, the comparison sheets and the
`onganda-showcase` list.

### Fixed — pages without their own font rendered in serif

`style.css` set the heading face but not the body face, so a product that set
no font of its own showed its text in the browser's serif. It now sets the
body face and ink on `html` at zero specificity, so a product's own rule still
wins.

### Added — a Tailwind 3 preset

`@onganda/design-system/tailwind.preset.cjs`, generated beside `tailwind.css`
from the same source: the roles as colours through their CSS variables, the
type scale, zero radius and the pixel shadows, with Tailwind's own palette
replaced. One line in `tailwind.config.cjs`:
`presets: [require('@onganda/design-system/tailwind.preset.cjs')]`. Each
colour is a Tailwind 3 function colour, so an opacity modifier works
(`bg-surface/50` mixes the role with transparent through `color-mix()`). The
package smoke test compiles it with Tailwind 3 from a consumer install: the
roles are utilities, the modifier works, and `bg-blue-500` does not exist.

### Added — each palette carries its own hue rule

`Palette.rules`: Onganda's "no green and no blue", and what replaces it under
`coast` and `etosha`. The docs quote each verbatim (`check:docs` fails if they
drift) and tell an agent that a rule naming a pigment describes Onganda. Under
another palette, the showcase's Control Standards prose names that palette's
pigments and shows its rule instead of Onganda's measured ratios; under
`onganda` it is word for word what it was.

### Changed — blocks and the showcase use semantic colours

The showcase's classes now read roles (`--onganda-surface`,
`--onganda-text-muted`, `--onganda-line`, `--onganda-text-on-inverse`) and peer
accents (`--onganda-accent-1`…`-5`), not pigments, so the blocks generated from
it do too. The copy generator maps a tinted pigment (`#D9791F22`) to
`${accentFor(0)}22` and ink to `c.text`, and writes the map section as
`<OngandaMap>` from `@onganda/design-system/maps` instead of its internals.
A new guard, `pigment-variable`, fails styling with a pigment variable; the
copy test runs it on every block. Text selection now takes the primary's own
label colour (`action-fg`) instead of millet clay at 2.4:1.

### Changed — icon direction

`SKILL.md` and `DESIGN_SYSTEM.md` say how a product draws its own icons with
`createPixelIcon`: 12 cells and one colour from a role for interface icons, 24
cells with colours from `COLOR` or `accentFor(i)` for marks, so they follow the
palette; `validatePixelIconDef()` checks them. The guidance no longer puts an
icon tile on every feature card: a lead icon goes on peers that differ in kind.

### Changed — agents stay on the Onganda palette unless asked

An agent given a bookkeeping brief read the palette table's "For" column and
switched to `coast` unasked. The guide's first step is now to stay on
`onganda`, and every guide says to choose another palette only when the
product asks for one.

### Fixed — what still showed Onganda under another palette

A pass over every surface in `coast` and `etosha` found these, now fixed:

- **CommonJS.** `PALETTE` was reassigned, and a CommonJS build copies an export
  once, so `require()` kept the Onganda palette. It is now one object updated in
  place; ask which palette is active with `activePalette()` (newly exported from
  the root). The package smoke test selects `coast` through `require()`.
- **Copy that described Onganda.** The chart gallery footer, the hero line and
  the "Palette" principle now name the active palette; the document editor's
  principles and swatches read `PRINCIPLES` and `SWATCHES` instead of their own
  Onganda copies, and its paper choices are named from the palette.
- **The map** tinted its tiles sepia in every palette; that warmth is now
  Onganda's only.
- **The PowerPoint export** wrote Onganda's paper and muted text, and the
  primary as small text. It now takes the palette's editor paper, the muted role
  and the accent ink, as the slide canvas does.
- **The document editor** set the callout label in fired red and a stat value
  in the primary at any contrast. Each now falls back to text where it fails
  (4.5:1, and 3:1 for the large stat); under `onganda` both render as before.
- **The public-site tones** were computed once, at load.
- **The hero ticker** set coast's and etosha's ink-dark peers on the black band;
  a name under 3:1 there takes paper. Onganda's ticker is unchanged.

Chart series are not held to 3:1 in any palette; `DESIGN_SYSTEM.md` now says so
and what carries the meaning instead. The Tailwind 3 preset takes opacity
modifiers. A smoke test checks that the palette parser the checks use reads
exactly what the compiled module holds.

### Fixed — a palette selected after the system loaded was lost

The first version read the palette once, at load, and assumed the palette file
ran first. A bundler that splits the system into its own chunk runs it before
the entry's code, so the showcase's own build never applied `?palette=`, and an
app with lazy routes would have kept the default palette. `selectPalette()` now
rebuilds every value built from the palette in place (`onPaletteChange`,
`followPalette`), whatever the load order. The consumer test builds the
palette case with the system in its own chunk, and the palette contrast audits
first assert that the palette applied.

### Added — palettes, chosen in one file

The roles were always built from one fixed set of pigments, so a security
tool and a school site both came out in Kalahari earth. A palette is now the
set of pigments the roles are built from, and a product chooses one in a
single file:

```ts
// src/onganda-palette.ts, imported on the first line of main.tsx, before the first render
import { selectPalette } from '@onganda/design-system/palettes';
selectPalette('coast');
```

- **Three palettes.** `onganda` (the default, unchanged), `coast` (cool fog and
  signal amber: Radix Colors slate, teal, amber, iris, red) and `etosha` (salt
  pan, acacia and sun: Radix sand, grass, blue, red, and Tailwind's yellow-400
  for the sun). The new two use
  the Okabe-Ito chart series, distinct for every common colour-vision
  deficiency.
- **Every palette meets the same contrast claims.** The claims moved into
  `CONTRAST_CLAIMS` (`onganda-roles.ts`); `check:contrast` measures every
  palette in both modes, editor grounds included (402 measurements). The
  browser audit measures the showcase and two test pages in `coast` and
  `etosha` (the test pages in both modes; the showcase has no page-wide dark
  mode, so its Control Standards dark switch is audited instead), and both
  editors in every palette.
- **Everything follows.** `COLOR`, the roles, statuses, peer accents, system
  identities, chart series, the weave, the brand-guide swatches, the CSS
  variables (written to the page for a non-default palette) and the token
  export. `selectPalette()` rebuilds every value built from the palette in
  place, module-level ones included, so it works whatever order a bundler
  loads the modules in.
- **CSS-only products** import `@onganda/design-system/palettes/<name>.css`
  after `style.css`.
- **Custom palettes:** `definePalette()` with every slot filled; the system
  audits it on load and warns for each failing claim; `auditPalette()` returns
  the table.
- **On the showcase:** palette tabs on the Material Palette section reload the
  page in that palette (`?palette=coast`).

To make the components follow, 351 hard-coded ink and paper `rgba()` values
became `inkAlpha()` / `paperAlpha()` and 203 hard-coded hex values became
`COLOR` references or pigment variables. Under `onganda` every one renders the
same: the visual baselines pass unregenerated. The five system icons keep their
own pixel colours. Each palette carries its own ten editor grounds (`editor`,
read through `EDITOR_SURFACE`), so the document and slide editors and the
PowerPoint export are cool under `coast` and neutral under `etosha`.

### Added — `PixelPeers`: the showcase's peer colouring is the default

The showcase passes `accent={accentFor(i)}` on 23 of its 27 panels and an
ordinal tag on the peers; a product built from defaults passed neither, and
came out one accent ink with no ordinals. `<PixelPeers>` around a set of
`PixelPanel`s gives each the next accent and its ordinal, lays them out (up to
`columns` across, one column on a narrow screen, no Tailwind needed) and
staggers them in. `lift` turns on the stepped hover lift for the set, `offset`
continues the rotation. A `SectionHeader` inside a peer takes its accent;
`usePeer()` gives a product's own element the same. The showcase's even-grid
example and `/test/launch` use it.

### Added — `blocks/`: every showcase section as a file

The copy test now writes each section's generated code to `blocks/<section>.tsx`
and fails when the shipped file differs from what the showcase copies today
(`UPDATE_BLOCKS=1` rewrites them). Each block compiles under strict TypeScript
and passes `onganda-check`. They ship with the package, so an agent can start
from `product-surface.tsx` or `controls.tsx` without opening a browser.

### Added — micro-interactions

- `data-onganda-slide`: a row, tab or nav item steps 2px along on hover.
  `PixelNav` items use it.
- `data-onganda-underline`: a text link's underline draws in, in four steps, in
  the link's own colour, so it reads on inverse bands. `PixelFooter` links use it.
- `MOTION_TOKENS.draw` (`steps(4, end)`, `--onganda-motion-draw`).
- The docs name the stepped hover lift as the expressive signature of a public
  page: `<PixelPeers lift>`, `depth="lift"`, `<PixelButton lift>`.

### Changed — the agent guide starts with six steps

`SKILL.md` (and the agent docs generated from it) opens with "Start here":
choose the palette, load the system, start from a block, put peers in
`PixelPeers`, give each section an accent, run `onganda-check`. The reasoning
follows it.

### Fixed

- **Packaged layout CSS kept classes chosen inside a `className` expression.**
  The scanner read only literal `className="…"` attributes, so `StatCard`'s
  `py-8` and `md:px-10` were never compiled and the stat band lost its padding
  in every consumer without Tailwind. `tests/consumer-render.mjs` now asserts
  the padding.
- **Sixteen hairlines with an off-ramp ink opacity** in the editors and maps
  (0.08–0.18) now take their dark-mode pair's ramp step. The `off-ramp-ink`
  guard missed them: its pattern stopped at the first comma inside the first
  `rgba()` on a line.
- **The browser contrast audit reads any colour format.** Tailwind 4 writes
  `oklab()` for an opacity on a CSS variable; the audit misread it as RGB.
- React keys built from a colour value collided when two palette slots share a
  pigment; they are keyed by name or position.

### Fixed — everything on the showcase is reproducible from the system

Copying every section showed six where the showcase used something the
design system did not offer: a private caption, private chart parts, hand-built
cards, and table cells whose `render` functions could not be read back. The
copy filled those gaps with placeholders, dropped props and rewrites. Each was
a gap in the system, and each is closed — with the showcase unchanged: the
visual baselines pass without being regenerated, and the reference shots come
out byte-identical.

- **Exported from the showcase's own code, unchanged:** `ChartPanel` (the
  gallery's chart card), `ChartTooltip`, `ChartPointTooltip` (the scatter's
  inline tooltip, now a component), `ChartTreemapCell` (the treemap
  renderer, now a component), and `PixelSubhead` (the specimen caption,
  which also follows `DarkProvider` now).
- **Tool sections copy as their component.** The icon bank, icon factory and
  publications launcher are complete exported components; copying them
  writes `<IconShowcase />`, `<IconFactoryLab />`, `<Publications />`.
- **Table cells copy as they rendered.** The rows become a constant and each
  custom column a list of the JSX its cells produced, so status dots and
  formatted values come through exactly.
- **The copy test now fails on any gap**, not only on code that does not
  compile.
- **The connection diagram's travelling dots respect reduced motion.** They
  looped forever (SMIL `animateMotion` plus an endless opacity cycle) for
  everyone, which is also why its reference shot was never the same twice.

### Added — Copy code on the showcase

`/showcase` has a **Copy code** toggle. With it on, every section carries a
**Copy section** button, hovering outlines the nearest design-system
component with its name, and a click opens its code with a copy button (and
"Whole section instead"). Off by default; nothing on the page changes until
it is pressed.

The code is generated from the live React tree, not written by hand, so it
cannot drift from what is on screen:

- A **section** is written as its full composition, stopping at each
  design-system component and expanding the showcase's private helpers.
- Colours become the system's vocabulary — a role (`c.textMuted`), a peer
  accent (`accentFor(0)`), a palette colour (`COLOR.x`); ink at an
  off-ramp alpha becomes the nearest role.
- Icons are written at the size they render (`ICON_SIZE.control`).
- framer-motion entrances become the system's presets
  (`data-onganda-enter`, `-stagger`, `-lift`, `-press`); framer's
  mid-animation inline styles are dropped, so a paste is never frozen at
  opacity 0.
- A card the showcase still hand-builds (surface plus hairline) is written as
  `<PixelPanel emphasis="quiet">`, so the paste uses the system even where the
  showcase does not.
- Handlers come stubbed, row keys get a real key function, and private
  render callbacks are left out so components use their defaults.

`tests/browser/copy-code.spec.ts` copies **every** section, writes each to a
file, and fails unless all of them compile under strict TypeScript against
the package and pass `onganda-check`.

## [2.0.0] — 2026-10-01

### Migrating from 1.x

2.0 changes how every product looks without changing a single prop
signature. Nothing is removed from the package root. Reinstall, then check
each item against your screens:

1. **The primary button is ochre, not black.** `PixelButton` reads the new
   roles; nothing to change in code. A screen designed around a black
   primary will look different — re-screenshot it.
2. **The in-card accent is mahangu gold**, and danger carries a fired red edge.
3. **Cards are flat.** `PixelPanel`'s `texture` defaults to `none`, and
   `PixelNotice`, `PixelDialog` and `PixelEmptyState` drop their weave. Put
   texture on the page ground. Pass `texture="surface"` only for an identity
   grid like the five-system cards.
4. **The dotted rule is retired.** `DitherBar` draws a hairline and ignores
   `segments` and `height`; `DitherStrip` renders nothing — remove its calls.
   `npx onganda-check` now fails dotted and dashed edges.
5. **Pixel icons snap to their grid.** A size that is not a whole multiple of
   12 changes: 14 and 16 render at 12, 20 at 24, 28 at 24. Use `ICON_SIZE`
   (12 / 24 / 36 / 48). A nav or toolbar that relied on 16px icons wants
   `ICON_SIZE.control`.
6. **The faces ship with the package.** Remove Google Fonts and Fontsource
   imports of Inter and Space Grotesk. `style.css` is about 230 kB larger.
7. **Motion comes from the primitives.** With `DarkProvider`, panels, section
   headers and the stat band enter as they come into view; without it they
   enter on mount, or call `installReveal()` yourself. Remove any entrance
   you added to a `PixelPanel` by hand, or it will play twice.
8. **`PixelDialog` renders on `document.body`.** CSS that reached it through
   an ancestor selector must target it directly.
9. **New guard rules**: `texture-as-state`, and dashed edges under
   `dotted-rule`. Expect `npx onganda-check` to report them.
10. **The package carries its guidance**: `skills/`, `reference/`,
    `screenshots/test-pages/` and `src/test-pages/` are in
    `node_modules/@onganda/design-system/` (about 6 MB).
11. **Patterns follow `DarkProvider`.** `PixelPanel`, `PixelNotice`,
    `PixelTable`, `PixelTabs`, `PixelDialog` and the site sections now read the
    mode from the provider instead of defaulting to light. A component that sat
    light inside a dark provider without `isDark` will now be dark; pass
    `isDark={false}` where that was intended.
12. **No `@source` line is needed** for the package; remove it if you added one.
13. **`PixelTag` is inline.** It was block-level and stretched across any
    plain container. Where you relied on a full-width band, wrap it in a
    flex column (as `PixelInversePanel` does).
14. **Ink follows the theme without a `SurfaceProvider`.** `useInkOn`,
    `StatCard` and `PixelStatBand` used to assume a light card; under a dark
    `DarkProvider` they now measure against the dark card.
15. Regenerate any visual snapshots.

### Fixed — the third cold-start pass

A fresh agent built a Kino landing page and app screen from the package
alone. The landing page set its own dials — an inverse hero at hero scale, a
"cut sheet" of pixel cells as its signature move, a staircase of steps, no
card grid — and looks like neither test landing page while being plainly the
same system. Every full-page screenshot, taken without reduced motion, was
complete. It reported nineteen problems; all are fixed:

- **`PixelButton type`** — a form's main button can submit on Enter.
- **`PixelPanel selected`** — a 2px accent edge and `aria-pressed`; with
  `onClick` the panel is a keyboard button (Enter, Space).
- **`accentFor(i, isDark)`** — on a dark card the hues that clear 3:1 as marks
  come first (ochre 5.7, gold 8.7, mopane light 3.6); bark rust and dye plum
  (2.4) come fourth and fifth. `--onganda-accent-*` reorder in dark too.
- **`PixelTicker items`** and **`PixelFooter`** — the ticker and closing band
  for a product that is not the Onganda lab.
- **`PixelInversePanel headlineSize="hero"`** for an inverse band that opens a
  page.
- **`FONT.mono`** / `--onganda-font-mono` / `font-mono`; the components that
  hard-coded `monospace` use it.
- **`PixelCheckbox`** honours `defaultChecked`; **`PixelToggle`** labels read
  left when they wrap; **`IconSun` / `IconMoon`** take `size` and `color`;
  `MOTION`'s stagger is 60ms, as the CSS.
- **Docs**: peer accents versus system identity and "one accent per section"
  reconciled; texture claims about cards and `PixelChoice` corrected; the
  weave range given as `TEXTURE` steps; `ICON_SIZE.display` documented; the
  two lifts distinguished; the `@source` step removed outright (copied classes
  live in your own source); `SystemCard`'s props corrected; the
  `PixelIconButton` heading moved out of `PixelButton`'s section; and a plain
  note that `onganda-check` reads code, not the screen.
- **The showcase taught banned patterns** — its Icon Bank said "default
  16px", showed a raw hex and imported from source paths. All snippets now
  import from `@onganda/design-system` and size with `ICON_SIZE`.
- **The test pages broke the rules they demonstrate** — a primary in the top
  bar, `statusFor(…, false)`, literal icon sizes, a search icon beside its
  field, a hand-rolled header nav. Fixed; the shared header is a `PixelNav`.

### Added — creative latitude

Pages built from the system were starting to look alike, and a product
redesign lost the stepped shadows that gave its landing page depth — because
the docs said "no shadows" when the rule was always "no blur". The system now
fixes the material and leaves the composition to the page:

- **Hard pixel shadows** as roles in both modes: `shadowStep` (4px),
  `shadowPlate` (8px), `shadowBand` (a sticky bar's foot) —
  `--onganda-shadow-*`, Tailwind `shadow-step / -plate / -band`. Zero blur;
  in dark mode a faint light offset, because the canvas is already darkest.
- **`PixelPanel depth`** — `flat` (default), `raised` (rests on a plate),
  `lift` (steps up-left 2px onto a hard shadow on hover). **`PixelButton
  lift`** for the expressive call to action. The step moves with `translate`
  so it never fights the press or the entrance.
- **`PixelPanel tone="tint"`** — one featured card washed in its accent.
- **`ICON_SIZE.display`** (96) for a page's lead pixel illustration.
- **"Creative latitude"** in SKILL.md: what is fixed, the nine dials each page
  sets (lead accent, hero, grid rhythm, depth, tone, scale contrast, texture,
  inverse placement, motion signature), and the rules for using them — one
  signature move per page, turn a dial up in one section, product screens keep
  them low.
- **`/showcase#expressive-range`** and `reference/expressive-range.png`: the
  same content three ways. **`/test/launch`**: a second landing page with the
  dials set differently from `/test/landing`, built only from the package.

### Fixed — confidence, verified

- **Entrances never hide content from a screenshot.** Under automation
  (`navigator.webdriver`) nothing waits to be seen — the CSS reveal and every
  framer `whileInView` entrance render in their final state — so a full-page
  screenshot shows the whole page. Any overlap with the viewport now counts,
  so an element at the bottom of a page that cannot scroll still appears.
  `<html data-onganda-reveal="off">` opts out.
- **Dark mode, audited.** The contrast audit now runs on every test page in
  dark mode. It found stat values at 1.03:1 (the default surface was light
  regardless of theme) and chart legends defaulting to light; both fixed.
- **`own-scroll-reveal`** in `check:tokens`: a product's own `whileInView`
  fails. Installing 2.0 into FirstRung's landing page showed whole sections
  blank in every full-page screenshot — its hand-copied `fadeUp` hid them —
  on both the old and the new package. The package presets now render in
  their final state under automation; products must use them.
- **`locked-light-mode`** in `check:tokens`: `roles(false)` in product code
  fails, because it locks a surface light under a dark theme — the test pages
  themselves did it.

### Fixed — what a cold-start agent hit

A fresh agent built two product screens from the package and the prompt
alone, with no access to this repo. The result was the closest any product
has come to the showcase, and it reported fifteen places the package or its
docs let it down. All are fixed:

- **The guidance did not ship.** `skills/`, `reference/`,
  `screenshots/test-pages/`, `src/test-pages/`, `DESIGN_SYSTEM.md` and the
  CHANGELOG are now in the package, and **`npx onganda-showcase`** serves the
  built showcase and test pages from inside a product — "open /showcase" was
  impossible for a consumer. The package smoke test asserts every file.
- **The version check threw**: `package.json` was not exported.
- **Patterns ignored `DarkProvider`** and rendered light unless passed
  `isDark`. Fifteen components now read the provider.
- **`PixelTabs scrollable` wrapped its labels** inside squeezed buttons
  instead of scrolling. Tab labels never break now.
- **No navigation primitive** — every product hand-rolled its sidebar.
  `PixelNav`, vertical or horizontal.
- **No way to show a rating.** Status colours mean process state, so "strong"
  as `active` said a clip was *running*. `PixelMeter`, and the product
  reference now uses it.
- **No slot beside a card's title.** `PixelPanel` `aside`.
- **Off-grid icon sizes in the system's own examples** — 40 literals in the
  components and test pages, more in the docs, all normalised to what renders.
  The five system icons are on a 24-cell grid (24 or 48); `createPixelIcon`
  icons now snap too. **`off-grid-icon`** in `check:tokens` fails the rest.
- **Docs that contradicted SKILL.md**: the README's "fully Onganda" list
  required texture and an inverse band on every surface; its "Build a screen"
  example hand-rolled a card the guard rejects; install commands differed;
  the `@source` line was documented as required and is not; repo-only steps
  (`npm run reference`, `composition.spec.ts`) read as product steps; the
  `PixelPanel` `rule` comment claimed a default it no longer has.
- The windsurf, ChatGPT/Codex and Claude-command docs are **generated from
  SKILL.md** (`check:agent-docs`), not hand-kept copies of an older system.
- Entrances now start when an element comes into view (`installReveal`, via
  `DarkProvider`): measured, a panel's 450ms entrance was at 442ms by first
  paint, so it was never seen.
- `PixelDialog` renders on `document.body`, so no card can clip it.
- A second cold-start pass, after the fixes above, confirmed 11 of the 15
  fixed and found the rest: `SectionHeader`, `StatCard`, `PixelIconButton`
  and `WeaveOverlay` still defaulted to light (all now read the provider); the
  docs gave three different ordinal rules (now one: `PixelPanel` `tag`, plus
  `icon` when peers differ in kind); a scrolling tab row gave no sign it
  continued (it now fades at the cut edge); a title-row `aside` squeezed
  titles on a phone (it now drops below); and four doc examples were wrong or
  off-grid, including `systemIconForName` used as a component.
- The font explanation was wrong: whether a `url()` survives a nested import
  depends on the consumer's `@tailwindcss/vite` version (4.0.9 no, 4.3.3 yes),
  not on the plugin as such. Embedding stands; the cause is corrected.

### Fixed — the faces, the pixel grid, and what makes a screen look finished

A product on the latest build still looked amateur: headings in Arial, pixel
icons as blurry specks, no pixel art where the eye lands, little
micro-motion, loose actions. Each had a cause in the package.

- **The faces never reached products.** `style.css` loaded them with a remote
  Google Fonts `@import`, which CSS ignores unless it comes first — and every
  Tailwind app imports `style.css` after `tailwindcss`. A product working around
  it with Fontsource got `'Space Grotesk Variable'`, a name the stacks did not
  list. Inter and Space Grotesk (OFL) now ship embedded in `fonts.css`, inlined
  by `style.css`; the stacks also accept the Fontsource names. A `url()` to
  font files was tried first and worked or failed depending on the consumer's
  bundler: `@tailwindcss/vite` 4.0.9 leaves `url()`s in a nested import
  unrewritten (404 — the showcase rendered in Arial), 4.3.3 rewrites them.
  A package cannot choose its consumer's Tailwind version, so the faces are
  embedded. The cost is about 230 kB in `style.css`.
  `check:fonts`, a consumer case importing `style.css` from CSS, and a browser
  test that both faces load now guard it.
- **Pixel icons were off their grid.** Drawn on 12 cells, rendered at a 16px
  default. `Px` now snaps every icon to a whole multiple of its grid and
  renders `crispEdges`; `ICON_SIZE` (12 / 24 / 36 / 48) is the scale.
- **No place for pixel art on a product screen.** `PixelIconTile`, and
  `PixelPanel` `icon` and `tag`, give every feature card the system card's
  opening. `PixelDropZone` carries a feature-size illustration by default.
- **Stepped micro-motion**: a button's trailing icon steps forward on hover, a
  clickable card's tile icon steps up, the drop-zone icon bobs while dragged
  over, `<PixelDot live>` blinks. `steps()` timing, so motion moves in whole
  pixels like the art. Off under reduced motion.
- **Motion tokens reach CSS and JSON.** `MOTION_TOKENS` is the one source for
  `--onganda-motion-*` in `tokens.css` and the token JSON's motion group, which
  had drifted from the code (a 2px lift against `MOTION`'s 4px).
- **`PixelInputGroup`** and **`SectionHeader actions`** for the two layout
  tells a screen showed: a field and its button as mismatched boxes, and the
  page action as a loose link in a corner.
- **`/test/studio`** — a media tool's intake screen done with all of the above,
  built only from the package. SKILL.md has the recipe ("Pixel art on a product
  screen", "A product screen's skeleton").

### Added — motion from the defaults

The guidelines called motion part of the language, but the primitives a
product is built from were static: `PixelPanel`, `SectionHeader`, the stat
band, the editorial and inverse sections, the empty state, tabs and choices.
Products built from them came out still.

- **A CSS motion layer in `style.css`**: `data-onganda-enter`,
  `data-onganda-stagger`, `data-onganda-lift`, `data-onganda-press`. The
  primitives set them; products can use them on their own elements. Off under
  `prefers-reduced-motion`, frozen by screenshot tools, and no change to any
  component's props.
- **`DarkProvider` adds `MotionConfig reducedMotion="user"`.** framer-motion
  ignores the setting otherwise, so every `MOTION` entrance slid in for viewers
  who had asked for less.
- **The browser tests never ran with reduced motion.** In Playwright 1.62,
  `test.use({ reducedMotion })` does not reach the page; the visual baselines
  and map tests now use `contextOptions`, and the baselines are regenerated.
- **`tests/browser/motion.spec.ts`** checks entrance, stagger, press and
  reduced motion on the consumer test pages.

### Changed — cards are flat, and colour goes on the work

A product built from the latest package came out with texture on every card
and colour either everywhere or nowhere. The causes were in the package:

- **`PixelPanel` defaulted to the weave.** It transcribes the site's feature
  card, which is flat. Because every card a product builds is a `PixelPanel`,
  every card came out textured. `texture` now defaults to `none`.
  `PixelNotice`, `PixelDialog` and `PixelEmptyState` drop their built-in
  weave; the publication and map cards drop theirs. Texture stays on page
  grounds, inverse panels and the five-system grid.
- **`PixelChoice` switched the weave on when selected**, and products copied
  it onto active nav items, selected rows and drag-over states. Removed, and
  `check:tokens` now fails **`texture-as-state`**.
- **The guidance licensed it**: "a card repeats it only when it sits on a
  plain ground" — which is nearly every card. Rewritten.
- **No positive colour recipe.** The rules said where colour may not go, so
  products swung between confetti and one black button on beige. SKILL.md
  now has "Where colour goes on a product screen", and
  `reference/product-surface.png` shows it: an ochre primary, the section's
  accent, each peer item `accentFor(i)` on its spine and a filled ordinal,
  state through `statusFor`, neutral metadata.
- **`PixelDropZone`** — a solid-edged drop target. Products hand-rolled dashed
  ones; `dotted-rule` now fails dashed borders and outlines too, and the
  editors' dashed insertion targets are solid.
- **Stale dev servers.** SKILL.md says to restart the dev server and clear
  `node_modules/.vite` after upgrading, with a canary: a black primary button
  means an old build is being served.

### Added — consumer test pages, compared with the reference

- **`/test/app`, `/test/dashboard`, `/test/form`, `/test/landing`,
  `/test/article`** (`src/test-pages`) — built only from
  `@onganda/design-system`, as a product would build them. They run under the
  overflow, contrast and console guards of the public routes, and
  `check:test-pages` runs the token guard on them in consumer mode.
- **`npm run test-pages`** screenshots each page at desktop and phone width and
  writes `screenshots/test-pages/compare-*.png`, the page beside the reference
  shots it should resemble. Every reference shot is paired with a page.

What building them found, and fixed in the package:

- **`PixelTable` widened its grid column.** A wide table in a grid column
  pushed the page sideways on a phone. The frame now uses
  `contain: inline-size` and scrolls inside itself. Numeric cells no longer
  wrap ("2.1 / GB").
- **No way to style a product's own chart.** The charts module exported only
  the gallery. `chartTheme(isDark)` (grid, axes, tooltip, series) and
  `ChartLegend` are exported now, both role-aware.
- **A page titled by `SectionHeader` had no `<h1>`.** `level={1}` renders the
  headline as the page heading, same look.
- `PixelFocusRow`'s `index` is documented as 0-based, and `PixelContactPanel`
  as bringing its own container. Both were misread while building the pages.

### Changed — the primary action is ochre, not black

A char black primary made every screen read as a black slab with some cream
around it: the heaviest object on the page was chrome, and the palette's
warmth went unused. The action roles now spend the palette, each value
measured in both modes by `check:contrast`.

| Intent | Light | Dark |
|---|---|---|
| `primary` | ochre, char black label (5.52:1), bark rust edge → mopane, millet label (6.06:1) | ochre, ochre edge → mahangu gold |
| `accent` | mahangu gold (8.41:1), mopane edge → dye plum, millet label (5.59:1) | gold → millet clay |
| `danger` | bark rust (5.59:1), fired red edge → char black | bark rust, fired red edge → millet clay |

- **New roles** — `actionBorder`, `actionHoverBorder`, `accentBorder`,
  `accentHoverBorder`, `dangerBorder`, `dangerHoverBorder` (48 roles). A fill
  under 3:1 against the surface carries an edge that clears it; eighteen new
  edge measurements guard this.
- **Fired red** reaches the danger button as its edge, where the 3:1 boundary
  floor applies — "red means danger" is now on the button itself.
- **System hues** reach chrome only through these roles. A component still
  may not bind one to `background` or `border*` directly.
- The public hero CTA and the editor's "Apply" button were hand-styled black;
  both are `PixelButton` now.

### Removed — the dotted rule

The dither rule — runs of alternating segments under headers, at card feet,
beside prose, across progress bars and skeletons — is retired. Repeated
everywhere it read as fussy, and it was never consistent from one section to
the next.

- **`DitherBar`** draws a 1px solid hairline. `segments` and `height` are
  accepted and ignored, so pinned products lose the dots without an edit.
- **`DitherStrip`** renders nothing and is deprecated.
- **`PixelPanel`** no longer adds a rule under the spine recipe; `rule` is
  opt-in. Dialog, empty state and the inverse panel drop theirs.
- **`PixelProgress`** and **`PixelSkeleton`** fill solid; the skeleton still
  sweeps, and stops for reduced motion.
- Decorative rules and striped fills removed from the showcase, site, charts,
  publications, roadmap, and both editors. A user-inserted divider block stays,
  as a hairline.
- **`dotted-rule`** in `check:tokens` rejects `repeating-linear-gradient` and
  dotted borders; `composition.spec.ts` now treats dotted runs as a ceiling of
  zero instead of a required ingredient.

## [1.2.0]

### Added — semantic tokens as CSS, and the Tailwind theme

The only CSS variables the package shipped were the thirteen raw pigments.
None of the 42 colour roles, and none of the type, space, texture, rule or
geometry scales, were reachable from CSS. So an agent styling in CSS or
Tailwind could reach `--onganda-mahangu-gold` but not `--onganda-text-muted`:
"use the design tokens" meant "use the palette", which is exactly what
produces colour everywhere. A token file works in Figma because the tokens
are semantic; the package now ships that file.

- **`tokens.css`** — every role in both modes, status, peer accents, the type
  scale, space, texture, rules and geometry. Generated from the real
  `roles()` and scales, committed so an agent can read the whole vocabulary
  in one file, and imported by `style.css`. `check:token-css` fails if stale.
- **`tailwind.css`** — a Tailwind 4 `@theme` mapping, so `bg-surface
  text-text-muted border-line` are the easy utilities. Tailwind's own palette
  is reset: `bg-blue-500` does not compile.
- **`DarkProvider` marks `<html data-onganda-theme>`**, so CSS tokens follow
  the same toggle the components read.
- The consumer test builds four real apps and asserts the tokens reach each,
  that `bg-surface` resolves, and that `bg-blue-500` produces nothing. Verified
  to fail when the token import is removed.

### Added — a product surface, and the weights to build one

Every reference was editorial: a hero, a ticker, a stat band, feature cards.
Told to match the showcase, an agent building a tool transplanted those
devices onto a working screen and came out as a cheap imitation — correct
parts, wrong register. Measured on a real product: seven metadata tags in
five colours, six surfaces all at feature weight, a ticker as the footer.

- **`ProductSurface`** on `/showcase`, captured as
  `reference/product-surface.png`: an app screen with quiet chrome, one feature
  surface, neutral metadata, colour only for identity and state.
- **`<PixelPanel emphasis="quiet">`** — surface and hairline only, for
  working chrome. A screen carries one or two feature surfaces.
- **`PixelTag` without `hex` is neutral** — outlined in ink, for metadata.

### Fixed — guidance that caused the confetti

`CLAUDE.md` rule 20 required every surface to carry weave, marks, rules and an
inverse band. That is an editorial checklist, and applied to a tool it
produced decoration spread evenly. It is scoped to editorial surfaces now, with
the product register stated beside it.

The previous pass also said "distribute colour" with `accentFor(i)`, and a
product applied it to metadata chips. `accentFor` is for peer cards in a list
only; colour means identity or state. Corrected in `CLAUDE.md`, `AGENTS.md`,
`SKILL.md`, `DESIGN_GUIDELINES.md` and the reference index.


### Changed — the system bends where products were forced to hack it

From a consumer's report of what it could not do without reaching into
component internals. Each item was verified against the code before acting.

- **Every exported component forwards its rest props.** `data-testid` on a
  component compiles and is silently dropped, because TypeScript does not
  type-check hyphenated attributes. Only the four fixed reactively, one
  reported bug at a time, were forwarding. Now all of them are.
- **`PixelTabs` takes `className`, `style`, rest props and `scrollable`.** It
  hard-coded `flex-wrap`, so a one-row strip needed a descendant selector
  into its internals — the exact hack the system exists to prevent.
- **`PixelPanel` separates its recipes**: `rule` toggles the foot rule
  independently of `spine`, and `texture` selects a `TEXTURE` step, including
  `none` for a card on an already-textured ground. Both were previously
  reachable only by hiding internal classes.
- **`WeaveOverlay.opacity` is the `TEXTURE` union**, not a free number. It
  immediately caught two off-scale values inside ternaries that the lexical
  guard could not see, and one in the README's own example.
- **`PixelActions` gains `share`** — buttons divide the row evenly. Products
  were reinventing it as a local `.btn-row`.
- **Controls resolve dark mode from `DarkProvider`.** The provider existed to
  hold the toggle but no control read it, so every call site threaded
  `isDark={isDark}` by hand. The prop still wins where it is passed.
- **`PixelButton.onClick` forwards the event.** It was `() => void`, so a
  button inside a clickable card could not stop propagation.
- **`SystemEntry` requires only what `PixelTicker` reads.** A consumer was
  passing empty strings for `role`, `desc`, `line` and `long` to satisfy a
  shape the component never touches.

### Fixed — the section headline was not a heading

`SectionHeader` rendered its eyebrow as `<h2>` and its headline as `<p>`, so
the largest text on a page sat outside the display-face rule while the
smallest sat inside it, and every section contributed two competing headings
to the outline. The elements are the right way round now.

The public site also kept a private `SectionTitle` duplicating
`SectionHeader`, so none of that component's fixes had ever reached it. The
duplicate is gone.

### Fixed — the package version never changed

It stayed `1.1.1` across every commit. Bundlers key dependency caches on the
version, so a consumer bumping the pin got new code on disk and a stale
bundle from cache — which presented as a blank page when a newly exported
token was missing at runtime. `prepare` now stamps the commit into the
version, so every commit is a distinct version and those caches invalidate on
their own. Base version bumped to 1.2.0.

### Fixed — the display face and the library stylesheet

- The stylesheet **fetches the faces it names**. It referenced Space Grotesk
  and left the consumer to discover it, so headings silently fell back to
  Inter with no indication anything was wrong.
- The heading rule is `:where(...)`, so it has zero specificity. A library
  rule that beats a consumer's own heading styles cannot be mixed into an
  existing app.


### Changed — two type roles, and the showcase loads what it ships

`FONT` had one family, on the reasoning that the brand's character lives in
the pixel marks so the letterforms could stay neutral. That holds on the
marketing site, where the marks are dense. It does not hold on a product
surface, where they are sparse and the page reads as unbranded.

- **`FONT.display` is Space Grotesk**, applied to headings by the shipped
  stylesheet. Its squared terminals echo the pixel geometry, so a headline
  carries the brand where the marks are thin. `FONT.family` stays Inter for
  body, controls and tables, so reading is unaffected. Both fall back to
  Arial, so a consumer that does not load the webfonts still renders.
- **The showcase now imports `lib-style.css`**, the stylesheet it ships.
  Previously it used only its own Tailwind entry, so what a consumer received
  and what the showcase demonstrated could drift — and did: the display face
  applied to consumers and not to the showcase.

The first version of the heading rule also set `letter-spacing`, which
silently overrode every `tracking-*` utility on a heading, including the
0.16em on a section's uppercase label. That section stopped counting as
carrying the language, and the composition test caught it. Tracking belongs
to the type scale, per step, not to the font rule.

### Added — the system distributes colour, texture and rules

A product can follow every rule in this repo and still look flat. Measured on
a real consumer: 21 `PixelPanel`s, 12 `SectionHeader`s, 38 `PixelButton`s, and
`accent` passed **zero** times. Everything defaulted to the accent ink, so the
whole product was two colours. Nothing in it was wrong.

- **`ACCENT_CYCLE` and `accentFor(i)`** — the site's own accent order. Peers
  in a list take successive hues, so distributing colour is the easy path
  rather than the remembered one. On `/showcase` beside the same four cards
  built from defaults.
- **`TEXTURE`** — three steps, replacing ten weave opacities chosen one call
  site at a time. Texture belongs to grounds and inverse panels, and never
  stacks: a textured card on a textured ground is the weave twice, which is
  what makes a page muddy.
- **`RULE`** — four steps, replacing thirteen dither opacities and three
  heights. One rule per block. A card with a section rule, a rule under its
  title and a rule at its foot is striped, not structured.

- **`off-scale-texture` guard** so neither scale can drift back. 35 call
  sites remapped to their nearest step, and `PixelEmptyState` traded its
  dashed border for a solid edge with corner marks: a dashed border reads as
  provisional, and an empty state is what a product shows first.

### Added — `reference/`

Every primitive and pattern as the showcase renders it, with an index saying
what each shows and which exports it demonstrates. `npm run reference`
regenerates it. `DESIGN_GUIDELINES.md`, `SKILL.md`, `AGENTS.md` and
`CLAUDE.md` all now tell an agent to compare its finished surface against the
closest one, because the written rules are prohibitions and cannot describe
how much colour a page carries.

`SKILL.md` also gains a checklist for changing a surface someone else built:
measure before judging, check whether colour was ever distributed, and re-run
`npm run reference` after changing how a primitive looks.

### Fixed — a disabled control no longer outweighs a live one

`opacity: 0.45` on the variant's own recipe: char black at 45% on cream is a
solid mid-grey slab, heavier than the enabled ghost button beside it, so the
dead control drew the eye first. Every disabled control takes the disabled
roles instead, whatever variant it was.

The contrast audit gained the exemption WCAG 1.4.3 already makes for inactive
controls, read from the real `disabled` state rather than assumed. Verified
still to catch an enabled node at the same opacity.

### Fixed — the loading state reads as static

`PixelSkeleton` faded whole rows in and out, which was reported as a static
block because nothing in it moves. A highlight travels across the dither now:
progressing, not merely pending.


### Added — two guard rules that were failing open

- **`off-ramp-ink`** — an ink or paper opacity that is not a step on the
  `ALPHA` ramp. `off-palette-rgba` passed these because char black *is* a
  palette colour: only the alpha was invented, and 25 different ones had
  accumulated in a consumer where the ramp defines eleven. Scoped to `color`,
  `border*` and `outline*`, because a 4% wash and a 90% scrim are surfaces,
  not ink. 34 sites in the editors remapped to their nearest step; the whole
  visual suite is unchanged.
- **`off-scale-type` now reads quoted and fractional sizes.** `fontSize:
  '20px'` was invisible to it, and `fontSize: 9.5` matched as `9` and passed.
  Two fractional sizes in the document editor were found this way.

Both verified against a planted violation and a legal neighbour.

### Fixed — PixelNotice forwards its attributes

`data-testid` on a component compiles and is then silently dropped, because
TypeScript does not type-check hyphenated JSX attributes. PixelPanel and
PixelChoice were fixed for this; PixelNotice was not, so a consumer moving a
block from one to the other lost its test hook with no error anywhere. It
reuses the exported `MotionConflicting` type rather than casting the
framer-motion handler clash away.

### Fixed — StatCard no longer hides itself

It used `MOTION.fadeUp`, whose `whileInView` never fires when the component
is mounted inside an inactive tab panel: FirstRung's mentor cockpit rendered
a row of empty cells, and scrolling did not recover them. Entrance motion
must never decide whether content is legible, so a stat band now uses
`MOTION.entrance`, which always plays.

### Changed — StatCard is density-aware and reads its roles

Dropped into a 390px side panel, the stat band wrapped into an unreadable
jumble: a 30px numeral with 24–40px of gutter needs a page to sit on. It also
hardcoded its ink at `#1E1A17/65` and `/66` — neither an `ALPHA` step — and
had no dark mode at all.

- Compact density gives it a 24px numeral and a 16×14 box; page density keeps
  the responsive gutter the band was built with.
- Ink comes from `roles(isDark).textMuted`, and it takes `isDark`.

### Fixed — two showcase sections were not built from the page's own cards

Control Standards and Product Patterns contained **nine hand-rolled
containers**, each writing `background: c.surface` and a `line` border inline
instead of using `PixelPanel`. Every guard passed — no raw hex, no rounded
corner, no off-scale type — but measured against the rest of the page the
sections carried **9.0 ingredients of the language per 1000px against 20–25
everywhere else**, and they read as a different product.

- **All nine blocks are `PixelPanel` now**, so each inherits the weave, the
  four accent corner marks, the 12px eyebrow and the density-aware padding.
  Control Standards went from 9.0 to 17.5 per 1000px with no decoration added.
- **One accent per section.** The showcase passed no `accent` to any
  `SectionHeader`, so all twelve defaulted to bark rust while the public site
  assigns a distinct hue per section. Each now declares its own.
- **Control Standards renders an inverse band.** Rule 12 — a control on an
  inverse surface takes the dark role set — was documented with no specimen,
  and the section was the only one on the page carrying no inverse surface.
- **A label inside a card is plain** 12px uppercase muted, as the system card
  sets its role line. The previous 10px was the wrong step: `TYPE.micro` is
  the gloss *beside* a label, not the label.
- **`hand-rolled-card` guard** — an inline style setting a `surface`
  background plus a `line` border is `PixelPanel`; use it. Verified to catch a
  reverted block, and to ignore a background or a border on its own.
- **A section-evenness test** scores each section against the median of its
  peers, so the bar rises with the page.

A first attempt at this added a new label component with an accent dot and a
dither rule to raise the density score. That was wrong twice over — the site
has no such object, and the section needed the parts the page already had,
not a new one. It was removed.

### Fixed — perpetual motion

- **`useMotionOK` guards every animation that repeats forever** — the ticker,
  the hero edge strips, the loading sweep. Two reasons. WCAG 2.2.2: content
  that moves automatically for more than five seconds needs a way to stop,
  and `prefers-reduced-motion` is that way. And a page with a perpetual
  animation is never visually stable, so a screenshot of it never converges —
  `animations: 'disabled'` only freezes CSS animations, while framer-motion
  drives transforms in JS and keeps going. The visual baselines now run under
  reduced motion.
- **Raised the screenshot time budget to 20s.** The Control Standards section
  is ~1900px tall and takes 5–6.5s to capture twice in the CI container,
  against a 5s default, so it timed out under load while passing alone. The
  comparison threshold stays at `maxDiffPixelRatio: 0.0015` — only the budget
  moved. Verified with three consecutive clean full runs in the Linux
  container.

### Changed — no elevation, and the site's compositions are now in the system

- **Removed every drop shadow.** The public site renders zero blurred shadows;
  `/showcase` was carrying fourteen — `0 4px 24px` on system cards,
  `0 12px 40px` on publication cards, `0 24px 80px` on editor panels — while
  `GEOMETRY.shadow` said `none` and nothing checked it. Added the
  `elevation-shadow` guard rule, which reads the shadow value wherever it is
  written (the offenders were ternaries over consts declared elsewhere, so a
  rule matching only `boxShadow:` reported clean). A `0 0 0 Npx` ring is
  permitted: it is a border that does not reflow.
- **`SystemCard` rebuilt as the site's card.** It cast four different shadows
  and lifted on hover, which is Material, not Onganda. Now: icon tile edged in
  the system's colour, numbered tag, 24px name (was 18px), English reading,
  12px role eyebrow (was 10px, and accent-coloured — the site keeps the hue on
  the spine, tag and dither), a 3px spine in both modes (was dark-mode only)
  and a dither rule that is always on (was hover-only).
- **`Okaanda.english` is "Granary".** The data said "Namibia AI Systems Lab" —
  the lab's name, not the system's — and the public site carried a local
  override to correct it. The data tells the truth now and the override is
  gone.
- The Institute card on `/showcase` was hand-rolled from hardcoded hexes and
  two off-scale ink opacities; it is a `PixelLabCard` now.

### Added — `PixelStatBand`

The strip of measured numbers under the public hero. It was only ever written
inline on the site, so a product had the cell (`StatCard`) but not the band,
and hand-rolled the grid around it — FirstRung's mentor cockpit and its side
panel both did. Cells are divided by a hairline, never by a gap: a gap reads
as four cards, and this is one object.

### Added — `onganda-site.tsx`

The public site's building blocks, extracted and exported. They were private
markup inside the site file, which meant the one thing the design system
exists to describe was the one thing it did not contain. The site imports
them, so there is one implementation and no copy to drift.

- **`PixelTicker`** — the full-bleed marquee of system names.
- **`PixelEditorialSection`** — label, headline, dither column, prose column.
- **`PixelFocusRow`** — a numbered row for a list that reads as a sequence.
- **`PixelLabCard`** — the inverted cell that closes a grid.
- **`PixelContactPanel`** — the closing inquiry surface.
- **`PixelEdgeStrips`** — the drifting palette columns beside a hero.
- Two more fidelity tests: the system card against the site card, and a
  zero-blurred-shadow sweep over all three routes. Both verified to fail on a
  reintroduced shadow.
- `DESIGN_SYSTEM.md` §6b documents all of it.

### Changed — the system is now a transcript of the public site

The public site (`/`, `/full`) is the reference implementation of the brand:
it came first, and it is what Onganda actually looks like. The system had
drifted into a parallel, denser house style of its own, so every product built
from it stopped looking like the site it was meant to look like. The direction
of authority is now fixed and documented: **change the site first, then
re-measure.**

- **Type scale retuned to the site, measured off the rendered DOM at 1440px.**
  `eyebrow` 10 → **12** (the site's most-used label; 10px is the *gloss*
  beside a label, not the label). `pageTitle` weight 600 → **500** — a section
  headline is lighter than the card titles under it, which is what stops a
  page of cards shouting over its own structure. `display` 700 → 600, `tag`
  8 → 9, `micro` 9 → 10, `title` 20 → 18, `caption` → `label` (11px is bold
  uppercase on the site, never a caption), `ui` 13 → 14/600. Added `meta`
  (14/500) and `code` (12/400). Removed the 8, 13 and 20px steps, which the
  site never used; 101 usages migrated.
- **Density no longer changes type.** Both densities set the control label at
  14px/600. Shrinking type as well as padding is what made the first extension
  surfaces read as a different product. `comfortable` button padding
  `10px 22px` → `12px 24px`, matching the site's primary action.
- **`PixelPanel` is the site's card.** 18px semibold title (was 16px), padding
  24 at page density and 16 in a side panel (was 16 everywhere). It no longer
  stacks its marks: corner marks *or* a spine and closing dither rule, never
  both — the site never does, and doing both is what made panels read as busy
  and over-ruled. Pass `spine` for the second recipe.
- **`SectionHeader` gained the accent dot and an `accent` prop**, and now
  styles from `roles(isDark)` instead of hardcoded `rgba()`. It renders the
  site's four-part rhythm: dot, 12px label, 30px medium headline, hairline.
- `MOTION.hoverLift` −2 → −4, matching the site's card hover.

### Added

- **`PixelInversePanel`** — the black card, transcribed from the "Why Onganda"
  panel. The site's one loud move; use it once per view at most.
- **`tests/browser/fidelity.spec.ts`** — measures the public site and the
  system's copy of it against each other and fails when they disagree:
  the card's material, its title step, its padding, its mark recipe, and the
  section-header rhythm. Verified to fail on each drift it claims to catch.
- **A type-table rule in `check:docs`** — `DESIGN_SYSTEM.md` §6 restates the
  whole scale for designers, who read it instead of the source. The guard now
  checks every step's size, weight, tracking, leading and case against `TYPE`,
  and the step-count claim in `FOR_DESIGNERS.md`. Verified against three kinds
  of drift.
- **Page-density and spine `PixelPanel` specimens on `/showcase`.** The
  showcase previously demonstrated the panel only in compact, so the brand's
  actual card was missing from the inventory.

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
