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
- **A dither rule** — `DitherBar` or `DitherStrip` where a section breaks.
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
