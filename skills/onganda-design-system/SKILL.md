---
name: onganda-design-system
description: Build or review React interfaces that must use the Onganda design system and Namibia AI Systems Lab design language. Use for new lab projects, Onganda component work, or visual compliance reviews. Do not use for unrelated products.
---

# Onganda Design System

Build products that feel unmistakably Onganda without copying the showcase's content or information architecture.

## Start with the source of truth

Resolve the repository root from this skill, then read:

1. `README.md` for installation and public package paths.
2. `DESIGN_SYSTEM.md` for the visual language and component API. Read §4 Color Roles and §5 Controls before styling anything — they are the enforceable rules, and `npm run check:tokens` fails the build on violations.
3. `DESIGN_GUIDELINES.md` for implementation and quality rules.

**Open `/showcase` before you write anything.** It is the reference
implementation and the inventory: hero, systems grid, Control Standards (every
control, every state, both modes), Product Patterns (dialog, table, notice,
empty, loading, tabs, progress), connection diagram, heatmap, roadmap, chart
gallery, icon bank, icon factory, maps, publications and brand guide. Take the
patterns that fit the product instead of inventing equivalents.

Inspect the relevant public export before writing code. Use the smallest suitable path: the package root or `/core` for foundations, then `/charts`, `/editors`, `/ai`, `/maps`, or `/sites` for larger features. Never deep-import package source files.

## Consume the package correctly

The package is not on npm. Consumers install it straight from GitHub, pinned
to a commit:

```json
"@onganda/design-system": "github:kmwandingi/Onganda#<sha>"
```

Two consequences, both of which have already cost a debugging session:

- **A pin is a commit, not a version.** Bumping means editing the pin in every
  `package.json` that carries it — a monorepo usually has several — and
  reinstalling with `--force`. A plain `npm install` will not pick up a new
  commit behind an unchanged range.
- **The package builds on install**, via its `prepare` script. That is how the
  compiled Tailwind layout utilities reach `dist/package/style.css`. A stale
  `node_modules` therefore serves an older build even when the lockfile points
  at the right commit, and nothing warns you. If a component renders without
  the styles or exports you expect, delete
  `node_modules/@onganda/design-system` and reinstall before looking anywhere
  else.

Verify the bump landed rather than assuming it: check that a symbol you expect
is actually exported from the installed package, not just present in the
source you read on GitHub.

## Look at the reference screenshots before you build

`reference/` holds every primitive and pattern as the showcase renders it;
`reference/INDEX.md` says what each shows and which exports it demonstrates.

**Copy the right kind of reference.** Building a tool, a dashboard or an app
screen: copy `product-surface.png`. Building a public page: copy the `site-*`
shots. Almost every other screenshot is editorial, and transplanting editorial
devices onto a tool is the single most common way a product comes out as a
cheap imitation — correct parts, wrong register.

Open the reference first, and again when your surface is built. Put your
screenshot beside it and name the difference.

### What separates a product surface from a cheap imitation

Measured on real products that followed every rule and still looked cheap.
It was never a missing component. It was decoration spread evenly:

- **Colour spent on things that carry no meaning.** A row of seven metadata
  tags in five colours is confetti. Colour in this system means identity (a
  system, a peer in a list) or state (`statusFor`). A metadata tag omits `hex`
  and renders neutral. `accentFor(i)` is for **peer cards in a list** — never
  for tags, labels, chrome or metadata.
- **Every surface at feature weight.** Six cards each with weave and corner
  marks reads as noise. One or two surfaces per screen are `feature` — the
  thing the user came to work on. Everything they work *in* — inspectors,
  export bars, transcripts, sidebars — is `<PixelPanel emphasis="quiet">`.
- **Editorial devices on a tool.** The ticker, stat band, edge strips,
  inverse hero panel and display-size type belong to public pages. A ticker
  used as the footer of an app is the clearest sign of a copy.
- **Notices used as content.** `PixelNotice` is for an exception. Three
  stacked notices as the body of a screen reads as a wall of warnings; state
  the condition once, and put the real content where the notices were.
- **Texture on everything.** Weave belongs to grounds and inverse panels.
- **A dead control that shouts.** Disabled takes the disabled roles.

## Style with tokens, not the palette

`@onganda/design-system/tokens.css` (imported by `style.css`) holds every
colour role, type step, space, texture, rule and geometry value as a CSS
variable, light and dark. Open it: it is the entire vocabulary in one file,
which is what makes a token file work for a tool like Figma.

- In CSS: `color: var(--onganda-text-muted); border: 1px solid var(--onganda-line);`
- In Tailwind 4: `@import '@onganda/design-system/tailwind.css';` then
  `bg-surface text-text-muted border-line`. Tailwind's own colour palette is
  reset, so `bg-blue-500` does not compile.
- Dark mode follows `<DarkProvider>`, which marks `<html data-onganda-theme>`.

**Read a role, not a pigment.** `--onganda-mopane-brown` exists for a system's
identity. A surface, a label, a line or a control reads its role. The pigments
were the only CSS variables the package used to ship, which is exactly how
"use the design tokens" kept turning into "use every colour".

## When a component does not fit

Every exported component forwards its rest props, so `data-testid`, ARIA
attributes, `className` and `style` all reach the DOM. Reaching into a
component's internals with a descendant selector is never the answer; if you
find yourself writing one, the prop you need is probably already there:

| Need | Prop |
|---|---|
| A tab strip that scrolls instead of wrapping | `<PixelTabs scrollable />` |
| Buttons that divide a row evenly | `<PixelActions share />` |
| A card's identity edge without the foot rule | `<PixelPanel spine rule={false} />` |
| A card on an already-textured ground | `<PixelPanel texture="none" />` |
| Controls that fit a narrow surface | `<DensityProvider value="compact">` |
| Dark controls without threading a prop | `<DarkProvider>` — controls read it |

`DensityProvider` is the sanctioned answer to "these buttons must fit one
row". It is on `/showcase` in Control Standards, comfortable and compact side
by side. Reach for it before you reach for a smaller font: density changes
spacing, never type.

If none of these fit, the gap is in the system. Add the prop or the primitive,
put it on `/showcase`, document it, and re-run `npm run reference` — do not
work around it in the product.

## Changing a surface someone else already built

Assume the previous pass was partial. Measure before you judge it, and again
before you claim it is done.

1. **Check whether colour is distributed at all.** `grep -c "accent=" src/`
   returning zero means every panel, header and tag is the same hue, whatever
   else looks right.
2. **Check for hand-rolled cards.** An inline style setting a `surface`
   background plus a `line` border *is* `PixelPanel`. `check:tokens` catches
   this as `hand-rolled-card`.
3. **Run `npx onganda-check <dirs>`.** It catches token drift. It does not
   catch flatness, so the screenshots are still the test for that.
4. **Verify a test hook survived.** TypeScript does not type-check hyphenated
   JSX attributes, so `data-testid` on a component compiles and is silently
   dropped unless that component forwards its rest props. If a selector stops
   matching after a refactor, check this before rewriting the test.
5. **Before editing a shared component, find its consumers.** A pattern used
   on the showcase is also used by products pinned to this package.
6. **Regenerate visual baselines in the same commit as the change that moved
   them**, so the reason is in the history rather than in a later "update
   snapshots" commit.
7. **Re-run `npm run reference`** if you changed a primitive's appearance.
   Stale reference screenshots are worse than none: the next agent will match
   the old look.

## Apply the language

- Preserve the product's business goals, domain model, and information architecture. Onganda governs presentation and interaction.
- Reuse existing tokens, primitives, icons, and patterns EXCLUSIVELY.
- Style from `roles(isDark)`, not from the palette. Being in `COLOR` does not make a token available for any purpose, and every role value is measured against WCAG AA.
- Ochre orange is the accent as a **fill**, with char black on it. As ink on a light surface it is 2.4:1, so the light-mode accent ink is bark rust — read `accentInk`, never a raw token. Fired red is an indicator only: status marks and invalid borders, never behind small text and never error-message text. System colours mean membership: mahangu gold, mopane brown, and dye plum identify Ombiga, Etiti, and Oshitoo, and bark rust identifies Oshini. The palette has no green and no blue; do not add one. Read status through `statusFor(name, isDark)`.
- Colour is never the only carrier of state: an invalid field has a border, a marker, and a message; a status mark has a label and a hairline ring.
- Never write a raw hex, an `rgba()`, or a generic framework color class in a component.
- Never hand-roll a control. Use `PixelButton`, `PixelInput`, `PixelTextarea`, `PixelSelect`, `PixelField`, `PixelCheckbox`, `PixelRadio`, and `PixelToggle`. One primary action per view, and no rounded corners anywhere. A control on an inverse surface takes the dark role set — pass `isDark`. A control that is not in the `/showcase` Control Standards section does not exist yet.
- Keep marks, icons, diagrams, and decorative geometry pixel-based. Keep typography clean and highly readable.
- Prefer sharp geometry, generous space, clear hierarchy, and quiet mechanical motion.
- Use Oshiwambo system names accurately. Do not invent cultural meanings or imply field deployments that are not real.
- Keep copy direct, concrete, and understandable. Remove repeated claims and robotic labels.
- Add a shared token or component only when the system has a real reusable gap.

For geospatial work, import `OngandaMap` from `@onganda/design-system/maps` and load `@onganda/design-system/maps.css`. Keep tile providers and attribution configurable. Preserve geographic accuracy, keyboard navigation, marker labels, responsive fit, and reduced-motion behavior.

## Build the whole language, not the safe corner of it

Every prohibition below can be satisfied by a thin page — a few bordered cards
and a button — that passes every automated check and looks nothing like
Onganda. That is the most common failure, and it is the one to guard against.

A finished Onganda surface carries all of these, and
`tests/browser/composition.spec.ts` fails without them:

- **Editorial rhythm** — `SectionHeader`'s uppercase label above a headline, on every major section.
- **Texture** — at least one surface with `WeaveOverlay` at 0.03–0.08.
- **Pixel marks** — `PixelDot`, `PixelTag`, or `PixelCornerMarks` as punctuation.
- **No dotted rules.** The dither rule is retired; a divider is a solid hairline, and most blocks need none.
- **Pixel iconography** — `Icon*`, `systemIconForName`, or `createPixelIcon`.
- **An inverse band** — the black-card language, with `isDark` passed to its controls.
- **Real motion** — `MOTION` presets on entrance, hover and tap.
- **System controls** — every button and field from the primitives.
- **Generous space** — the `SPACE` scale; nothing cramped.

Then ask what else the content legitimately supports: a ticker for live
signals, a step-line diagram for relationships, a heatmap or flowchart for
density and process, a terminal for technical surfaces, a map where place
matters, charts from `CHART_SERIES`, the five system identities, and an empty,
loading and error state for everything that loads. Not every page needs every
one. Every page needs more than cards and buttons.

For product surfaces use the patterns rather than rebuilding them:
`PixelDialog`, `PixelTable`, `PixelNotice`, `PixelEmptyState`, `PixelSkeleton`,
`PixelTabs`, `PixelProgress`. If the product needs something the system does
not have, that is a gap: build it as a primitive, add it to the showcase in
every state, document it, and extend the composition test. It is never a
licence to invent generic chrome.

## Verify the result

Run `npm run check:design` first. It runs two guards: `check:tokens` for lexical drift (generic framework colors, off-palette hex and `rgba()`, `oklch`, system colors used as chrome, raw `STATUS` reads, rounded geometry) and `check:contrast` for every measured ratio behind §4. Never widen a guard to make it pass. In a consumer project the same gate runs as `npx onganda-check src/`.

Then run the repository's type check, lint, builds, and package consumer test.
Run `npm run test:browser`, which includes the contrast audit over every
rendered text node and the composition standard above. For visible changes, inspect desktop and mobile renders with Playwright. Exercise keyboard, pointer, responsive, overflow, loading, and error states. Check browser console errors and update focused visual snapshots when the intended design changes.

Do not deploy, publish, or change unrelated product behavior unless the task asks for it.
