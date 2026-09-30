# Changelog

All notable changes to `@onganda/design-system` are documented here.
Format follows [Keep a Changelog](https://keepachangelog.com); versions follow semver.

## [Unreleased]

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
