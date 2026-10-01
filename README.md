# Onganda Design System

Onganda is the pixel editorial design language for the Namibia AI Systems Lab. It combines Namibian craft references, sharp geometry, clean typography, and quiet mechanical motion.


> **This is a closed system.** Everything permitted is in
> [`tokens/onganda.tokens.json`](./tokens/onganda.tokens.json) — every colour,
> type step, spacing value, border width and motion value. **Anything not in
> that file is not Onganda and is not acceptable**, in code or in design.
> There is no green and no blue, no corner radius, no blurred shadow, and no
> second typeface. If the system lacks something you need, extend the system — see
> [FOR_DESIGNERS.md](./FOR_DESIGNERS.md) and `DESIGN_GUIDELINES.md` §3.
> `npm run check:design` fails on every violation.

Use this repository for lab websites, product interfaces, documents, presentations, and AI-assisted authoring surfaces.

## Designing, not coding?

Read **[FOR_DESIGNERS.md](./FOR_DESIGNERS.md)** and load
`tokens/onganda.tokens.json` into Figma with the Tokens Studio plugin. That
file plus the `/showcase` page is everything needed to design a page that is
solely Onganda.

## Start a project

Install the current package from GitHub:

```bash
npm install @onganda/design-system@github:kmwandingi/Onganda#main --force
```

That tracks `main`, always the latest. The lockfile freezes a git dependency,
so run the same command again to upgrade, then restart the dev server and
clear `node_modules/.vite`. Check you have the latest: the hash in
`node -p "require('@onganda/design-system/package.json').version"` must match
`git ls-remote https://github.com/kmwandingi/Onganda HEAD`. To hold a product
still, pin a commit (`#<sha>`) instead. Read the CHANGELOG's migration notes
before crossing a major version.

**Open the showcase from your own project:** `npx onganda-showcase` serves the
showcase and the consumer test pages at `http://127.0.0.1:4174`. Press **Copy code**
on `/showcase` to copy any section or element as working code.

There is no registry release yet. `npm install @onganda/design-system`
returns a 404 until the scoped package is published.

Import the design tokens once in the project entry:

```ts
import '@onganda/design-system/style.css';
```

That stylesheet carries `tokens.css`: every colour role, type step, space,
texture, rule and geometry value as a CSS variable, in both modes. Style with
the **roles**, not the pigments:

```css
.card { background: var(--onganda-surface); border: 1px solid var(--onganda-line); }
.meta { color: var(--onganda-text-muted); font-size: var(--onganda-type-meta-size); }
```

With Tailwind 4, add the theme and the roles become utilities
(`bg-surface text-text-muted border-line`). Tailwind's own colour palette is
reset, so `bg-blue-500` does not compile:

```css
@import 'tailwindcss';
@import '@onganda/design-system/tailwind.css';
```

Wrap the app with the built-in theme provider:

```tsx
import { DarkProvider } from '@onganda/design-system';

<DarkProvider>
  <App />
</DarkProvider>;
```

**No Tailwind setup is needed.** `style.css` carries every utility class the
components use, so they render the same with Tailwind configured, configured
wrongly, or absent — `tests/consumer-render.mjs` builds all three and fails if
any differs. Do not add an `@source` line for the package. If your own code
uses Tailwind, `@import '@onganda/design-system/tailwind.css'` after
`tailwindcss` gives you the role utilities (`bg-surface`, `text-text-muted`)
and removes Tailwind's own palette.

## Build a screen

Everything below is the whole idea. Copy it, change the content, and the result
is already on-brand and already accessible.

```tsx
import {
  DarkProvider, roles, useDark, accentFor, ICON_SIZE, IconMail,
  SectionHeader, PixelPanel, PixelDot, PixelButton, PixelField, PixelInput,
  PixelSelect, PixelCheckbox, PixelActions, statusFor, TYPE,
} from '@onganda/design-system';
import '@onganda/design-system/style.css';   // tokens, both faces, motion

function RequestAccess() {
  const { isDark } = useDark();
  const c = roles(isDark);                 // ← any colour you need comes from here

  return (
    <section className="mx-auto max-w-3xl px-6 py-16">
      {/* The screen's one primary sits with its title. */}
      <SectionHeader level={1} label="Access" headline="Request a pilot." accent={accentFor(0)}
        actions={<PixelButton>Send request</PixelButton>} />

      {/* A card is a PixelPanel: flat, hairline, corner marks, its icon in a
          tile — and it enters as it comes into view. */}
      <PixelPanel accent={accentFor(0)} tag="01" icon={<IconMail size={ICON_SIZE.feature} color={accentFor(0)} />}
        eyebrow="Pilot programme" title="Tell us what you would build"
        aside={<span className="inline-flex items-center gap-2" style={{ fontSize: TYPE.meta.size, color: c.textMuted }}>
          <PixelDot color={statusFor('active', isDark)} size={7} ring={c.lineStrong} live /> Open
        </span>}>
        <div className="grid gap-5">
          <PixelField label="Email" hint="We never share this." htmlFor="email">
            <PixelInput id="email" type="email" placeholder="name@institution.na" />
          </PixelField>
          <PixelField label="Region" htmlFor="region">
            <PixelSelect id="region"><option>Khomas</option><option>Oshana</option></PixelSelect>
          </PixelField>
          <PixelCheckbox label="Send me lab updates" />
        </div>
        <PixelActions><PixelButton variant="ghost">Save draft</PixelButton></PixelActions>
      </PixelPanel>
    </section>
  );
}

// DarkProvider: dark mode for every component, reduced motion, and the
// entrances that play as things come into view.
export default () => <DarkProvider><RequestAccess /></DarkProvider>;
```

Three habits carry almost everything:

1. `const c = roles(isDark)` at the top of the component. Never a hex, never an
   `rgba()`, never a Tailwind colour class.
2. Reach for a primitive before writing a `<button>` or an `<input>`.
3. Spread a `MOTION` preset instead of retyping transition values.

## What do I use for…

| You need | Use | Not |
|---|---|---|
| A page background | `c.canvas` | `COLOR.milletClay` |
| A card or panel | `<PixelPanel>` (`emphasis="quiet"` for working chrome) | a `div` with `c.surface` and a border — `check:tokens` fails it |
| A recessed well or code block | `c.surfaceWell` | a darker hex |
| The black card / footer / ticker | `c.inverse`, and pass `isDark` to controls on it | `COLOR.charBlack` |
| Heading or primary text | `c.text` | `COLOR.charBlack` |
| Body copy | `c.textBody` | `rgba(30,26,23,0.8)` |
| A label, caption, or meta line | `c.textMuted` | any lower opacity |
| A divider | `c.line` | `border-gray-200` |
| The main action | `<PixelButton variant="primary">` (ochre) | a styled black `<button>` |
| A warm action inside a card | `variant="accent"` (mahangu gold) | ochre text |
| The quiet alternative | `variant="ghost"` | a link |
| Something destructive | `variant="danger"` | a red button you style yourself |
| A link, focus ring, or hover accent | `c.accentInk` | `COLOR.ochreOrange` |
| Any text input | `<PixelInput>` inside `<PixelField>` | `<input>` |
| A fixed choice from a list | `<PixelSelect>` | `<select>` |
| One of several options | `<PixelRadio>` | a native radio |
| An independent on/off | `<PixelCheckbox>` | a native checkbox |
| An instant-effect on/off | `<PixelToggle>` | a switch library |
| An error on a field | `<PixelField error="…">` | red text you write |
| A live / warning / error / done mark | `statusFor(name, isDark)` + `<PixelDot ring>` | `STATUS[name]` |
| A colour you received as data | `onColor(hex)` for a fill, `inkOn(hex, surface)` for text | the hex directly |
| Which of the five systems something is | `SYSTEM_COLOR[name]` | any accent |
| A chart series | `CHART_SERIES[i]` | your own order |
| Any entrance, hover, or tap | a `MOTION` preset | hand-written transitions |
| An icon | an existing `Icon*`, or `createPixelIcon` | an icon library |
| A corner accent | `<PixelCornerMarks>` | `border-radius` |
| A modal or confirm | `<PixelDialog>` | a modal library |
| A data list | `<PixelTable>` | a bare `<table>` |
| An inline alert | `<PixelNotice status=…>` | coloured text |
| Nothing to show yet | `<PixelEmptyState>` | a blank panel |
| Waiting for data | `<PixelSkeleton>` | a spinner |
| Segmented navigation | `<PixelTabs>` | styled links |
| A determinate bar | `<PixelProgress>` | `<progress>` |
| A product's sidebar or top nav | `<PixelNav>` | styled anchors |
| A rating — strength, fit, confidence | `<PixelMeter value label>` | a status colour (that means *state*) |
| A field with its button | `<PixelInputGroup>` | two boxes side by side |
| Taking files | `<PixelDropZone>` | a dashed box |
| An icon's size | `ICON_SIZE.inline / control / feature / hero` | 14, 16, 20 — off the pixel grid |
| A card's pixel art | `<PixelPanel icon tag>` | a 12px glyph beside the title |

## Make it *fully* Onganda

The rules above are prohibitions. You can satisfy every one of them with a few
bordered cards and a button, pass all the checks, and ship something that does
not look like Onganda at all. That is the most common failure.

A **product screen** — a tool, a dashboard — also carries: the
`SectionHeader` rhythm with the screen's one primary in its `actions`; peers as
`PixelPanel`s with `accentFor(i, isDark)` and an ordinal `tag` (and an `icon` when they differ in kind); pixel icons
on the grid (`ICON_SIZE`); state through `statusFor` with a label and ratings
through `PixelMeter`; flat cards; and an empty, loading and error state for
anything that loads. `skills/onganda-design-system/SKILL.md` has the full
recipe, and `/test/studio` and `/test/app` show it.

An **editorial page** — a public page, a landing page — adds the weave on its
grounds, an inverse band with `isDark` on its controls, and the showcase's
motion. In this repo `tests/browser/composition.spec.ts` enforces that on the
public routes.

**Open the showcase before you build** (`npx onganda-showcase` from a product). It is the inventory, not a demo: every
control in every state, every product pattern, plus diagrams, heatmaps, charts,
icons, maps and authoring surfaces. Take what fits instead of inventing an
equivalent. If the system genuinely lacks something, build it as a primitive
and add it to the showcase — that is a contribution, not a workaround.

## Five rules that will trip you up

1. **Ochre is a fill, not ink.** On a light surface ochre text measures 2.4:1.
   Fill with ochre and put char black on it, or use `c.accentInk` for text.
2. **Fired red never sits behind small text.** Its best foreground is 4.05:1.
   It is for status marks and invalid borders. Danger buttons fill with bark rust.
3. **System colours mean membership.** Mahangu gold, mopane brown and dye plum
   identify Ombiga, Etiti and Oshitoo. They are never buttons or borders.
4. **There is no green and no blue.** Success is a check glyph on a settled
   tone, not a new hue.
5. **Nothing is rounded.** `border-radius: 0` everywhere.

You do not have to memorise these. `npx onganda-check src/` fails on all of them.

## Supported imports

The package root keeps the stable foundation and the full version 1.x compatibility surface. New projects should import larger features through their named paths.

| Path                             | Use                                                             |
| -------------------------------- | --------------------------------------------------------------- |
| `@onganda/design-system`         | Stable tokens, primitives, icons, and version 1.x compatibility |
| `@onganda/design-system/core`    | Foundation-only imports                                         |
| `@onganda/design-system/charts`  | Chart compositions                                              |
| `@onganda/design-system/editors` | Document and slide tools                                        |
| `@onganda/design-system/ai`      | AI authoring tools                                              |
| `@onganda/design-system/maps`    | Branded, accessible Leaflet maps                                |
| `@onganda/design-system/sites`   | Sections, public pages, and the showcase                        |

Non-core root exports remain available throughout version 1.x. Any later removal requires a major release and a migration note.

## Maps

Load the map stylesheet once, then provide points and an optional route network:

```tsx
import '@onganda/design-system/maps.css';
import { OngandaMap } from '@onganda/design-system/maps';

<OngandaMap
  points={[
    {
      id: 'windhoek',
      position: [-22.5609, 17.0658],
      label: 'Windhoek',
      description: 'Illustrative coordination signal.',
    },
  ]}
/>;
```

The component includes keyboard-ready markers, responsive controls, reduced-motion behavior, and configurable tiles and attribution. The default uses OpenStreetMap tiles; production products should set a tile service that matches their traffic and hosting needs.

## Start with an agent

Repository-aware agents should read [skills/onganda-design-system/SKILL.md](./skills/onganda-design-system/SKILL.md). `AGENTS.md`, Copilot, Cursor, and Windsurf instructions all point to that same compact project brief.

## Source of truth

- [DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md) defines the design language and component patterns. §4 Color Roles and §5 Controls are the enforceable rules.
- [DESIGN_GUIDELINES.md](./DESIGN_GUIDELINES.md) defines implementation rules.
- [USAGE.md](./USAGE.md) contains extended examples.
- [CHANGELOG.md](./CHANGELOG.md) records package changes and migrations.

## Enforced rules

Style from `roles(isDark)`, not from the raw palette. Being in `COLOR` does not
make a token available for any purpose, and every role value is measured against
WCAG AA rather than chosen by eye:

- The primary action is ochre, the in-card accent mahangu gold — never a
  black primary. Each fill carries an edge that clears 3:1 on the surface.
- Ochre orange is a **fill**, with char black on it. As ink on a
  light surface it measures 2.4:1, so the light-mode accent ink is bark rust.
- Fired red is an **indicator** — status marks and invalid borders. Its best
  foreground is 4.05:1, so it never sits behind small text.
- Mahangu gold, mopane brown, and dye plum identify systems and carry chart
  series. They are not interface chrome.
- The palette has no green and no blue, and none may be added.

Never hand-roll a control. `PixelButton`, `PixelInput`, `PixelTextarea`,
`PixelSelect`, `PixelField`, `PixelCheckbox`, `PixelRadio`, and `PixelToggle`
each have one recipe. The `/showcase` **Control Standards** section renders them
all in every state and carries its own light/dark switch.

`npm run check:design` runs two guards over every design-system module:
`check:tokens` for lexical drift and `check:contrast` for the 68 measured ratios
behind the role table. Both run inside `npm run check` and in CI.

The gate ships with the package, so a product built on Onganda can fail its own
build on the same rules:

```bash
npx onganda-check src/        # check your own source
npx onganda-check --contrast  # re-measure after retheming
```

## Contributing

Reuse an existing token, primitive, or pattern before adding one. Add shared design values to the token modules, not to feature components.

Changes to stable exports require a changelog entry and maintainer approval. Breaking changes require a major release and a migration note.

Before opening a change, run:

```bash
npm run check
npm run test:browser
```

`npm run build` writes the showcase to `dist/showcase` and the package to `dist/package`.

## License

MIT. See [LICENSE](./LICENSE).
