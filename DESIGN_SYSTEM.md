# Onganda Design System

**Pixel editorial design system for the Namibia AI Systems Lab.**
Earthy palette, pixel-art SVG primitives, basket-weave textures, quiet mechanical motion.


> **This is a closed system.** Everything permitted is in
> [`tokens/onganda.tokens.json`](./tokens/onganda.tokens.json) — every colour,
> type step, spacing value, border width and motion value. **Anything not in
> that file is not Onganda and is not acceptable**, in code or in design.
> There is no green and no blue, no corner radius, no shadow, and no second
> typeface. If the system lacks something you need, extend the system — see
> [FOR_DESIGNERS.md](./FOR_DESIGNERS.md) and `DESIGN_GUIDELINES.md` §3.
> `npm run check:design` fails on every violation.

> **The public site is the source, not a consumer.** `/` and `/full` are the
> reference implementation of the brand. They came first, they are what
> Onganda actually looks like, and the tokens and patterns in this repo are a
> *transcript* of them — the type scale in §6 was measured off the rendered
> DOM, not chosen. So the direction of change is fixed: **to change the
> system, change the public site first and re-measure.** Never retune a token
> to suit a new surface. `tests/browser/fidelity.spec.ts` measures the site
> and the system against each other and fails when they disagree.

---

## Table of Contents

1. [Installation](#1-installation)
2. [Project Setup](#2-project-setup)
3. [Color Tokens](#3-color-tokens)
4. [Color Roles](#4-color-roles)
5. [Controls](#5-controls)
6. [Product Patterns](#6-product-patterns)
7. [Content & Data Tokens](#7-content--data-tokens)
8. [Atomic Primitives](#8-atomic-primitives)
9. [System Icons](#9-system-icons)
10. [Interface Icons](#10-interface-icons)
11. [Maps and Charts](#11-maps-and-charts)
12. [Page Sections](#12-page-sections)
13. [Block System](#13-block-system)
14. [AI Authoring](#14-ai-authoring)
15. [Editor Shells](#15-editor-shells)
16. [TypeScript Types](#16-typescript-types)
17. [Design Rules](#17-design-rules)

---

## 1. Installation

### From GitHub

```bash
npm install github:kmwandingi/Onganda
```

Pin a commit rather than tracking the branch, and bump it in every
`package.json` that carries it:

```json
"@onganda/design-system": "github:kmwandingi/Onganda#<sha>"
```

A pin is a commit, not a version, so `npm install` alone will not move it —
edit the pin and reinstall with `--force`. The package builds on install via
its `prepare` script, which is how the compiled layout utilities reach
`dist/package/style.css`; a stale `node_modules` serves an older build with no
warning. If an export or a style is missing, delete
`node_modules/@onganda/design-system` and reinstall before looking elsewhere.

### From the npm registry

Not published yet. GitHub is the distribution path; `npm install
@onganda/design-system` returns a 404 until the scoped package exists.

### Peer dependencies

These must be in the consumer project:

```bash
npm install react react-dom framer-motion recharts
```

---

## 2. Project Setup

### Step 1 — Import the CSS token file

In your root entry (`main.tsx`, `_app.tsx`, `layout.tsx`):

```ts
import '@onganda/design-system/style.css';
```

This adds the Onganda CSS custom properties to `:root`:

```
--type-hero            clamp(3.2rem, 10vw, 9rem)
--type-hero-public     clamp(3rem, 7.4vw, 7.1rem)
--type-hero-gap        clamp(0.22rem, 0.65vw, 0.55rem)
--type-subhead         clamp(0.82rem, 1.3vw, 0.95rem)
--onganda-ochre-orange #D9791F
--onganda-char-black   #1E1A17
... (full palette, see §3)
```

### Step 2 — Add to Tailwind content when extending components

The package stylesheet includes the utility classes used by exported
components. Consumers need no Tailwind configuration for those components.
Add the library bundle to your content scan only when consumer code extends
the packaged components with the same utility classes.

**Tailwind v4** (in your CSS file):
```css
@source "./node_modules/@onganda/design-system/dist/package";
```

The path is relative to your CSS file; the line above assumes it sits at the
project root. Tailwind does not resolve this by package name, and a wrong level
fails silently — you get correct markup with no utility classes. Verify by
rendering, not by reading.

**Tailwind v3** (`tailwind.config.js`):
```js
module.exports = {
  content: [
    './src/**/*.{ts,tsx}',
    './node_modules/@onganda/design-system/dist/package/**/*.{js,cjs}',
  ],
};
```

### Step 3 — Wrap your app in DarkProvider

All design-system components read dark mode via React context.

```tsx
import { DarkProvider } from '@onganda/design-system';

function Root() {
  return (
    <DarkProvider>
      <App />
    </DarkProvider>
  );
}
```

### Supported package paths

The root keeps stable tokens, primitives, icons, and version 1.x compatibility exports. Use `/charts`, `/editors`, `/ai`, `/maps`, and `/sites` for larger features. `/core` provides the foundation alone.

Non-core root exports remain available throughout version 1.x. Removing one requires a major release and a migration note.

Read the current mode in any component:

```tsx
import { useDark, roles } from '@onganda/design-system';

function MyComponent() {
  const { isDark, toggle } = useDark();
  const c = roles(isDark);

  return <div style={{ background: c.surface, color: c.text }}>…</div>;
}
```

`roles(isDark)` resolves every colour for the current mode, so a component never
branches on `isDark` for colour. See [§4 Color Roles](#4-color-roles).

---

## 3. Color Tokens

```ts
import { COLOR } from '@onganda/design-system';
```

| Token           | Hex       | Name           | Role                          |
|-----------------|-----------|----------------|-------------------------------|
| `milletClay`    | `#E8E1CF` | Millet Clay    | Light mode canvas             |
| `dustLight`     | `#F3E8C3` | Dust Light     | Lifted surface / paper        |
| `mahanguGold`   | `#DFAE2B` | Mahangu Gold   | Secondary highlight           |
| `ochreOrange`   | `#D9791F` | Ochre Orange   | Primary action / CTA          |
| `firedRed`      | `#C84A1B` | Fired Red      | Actionable / critical         |
| `barkRust`      | `#8F3E21` | Bark Rust      | Support accent                |
| `mopaneBrown`   | `#6A4B2E` | Mopane Brown   | Support neutral               |
| `charBlack`     | `#1E1A17` | Char Black     | Ink; inverse surfaces         |
| `dyePlum`       | `#6F4A6E` | Dye Plum       | Rare accent                   |
| `darkBg`        | `#120F0D` | Dark BG        | Deepest dark                  |
| `darkCard`      | `#1C1713` | Dark Card      | Elevated dark surface         |
| `darkCardAlt`   | `#271F1A` | Dark Card Alt  | Alt elevated dark surface     |

This table is the inventory. It does not grant permission to use a token
anywhere. **Read §4 before styling anything** — it says which role each token
may fill, and the roles are what components consume.

Do not write these opacities by hand. `roles(isDark)` returns `textBody`,
`textMuted`, `textFaint`, `line`, and `lineStrong` already resolved for the
current mode.

### WEAVE — basket-weave texture

```ts
import { WEAVE } from '@onganda/design-system';

// WEAVE.light  — charBlack ellipse strands + stepped diamond
// WEAVE.dark   — milletClay ellipse strands + stepped diamond
// WEAVE.size   — '64px 64px, 18px 10px'
```

Used directly by `WeaveOverlay`. You rarely need to apply `WEAVE` manually.

---

## 4. Color Roles

`COLOR` says what a color is. `ROLE` says where it may be used. Style interface
elements from roles. Reach for a palette token only when no role covers the case,
and then add the role.

```tsx
import { roles, useDark } from '@onganda/design-system';

const { isDark } = useDark();
const c = roles(isDark);

<div style={{ background: c.surface, color: c.text, border: `1px solid ${c.line}` }} />
```

`roles(isDark)` returns the full set for the current mode, so a component never
writes its own light/dark branch for color.

### Two measurements shape the whole set

Every value here is measured, not chosen by eye. `npm run check:contrast`
recomputes all 68 ratios and fails the build on a regression. Two results drive
most of the design:

- **Ochre orange cannot carry meaning on a light surface.** Millet clay on ochre
  is 2.4:1, and ochre on millet clay is 2.4:1. Ochre works as a **fill** with
  char black on it (5.5:1), and as **ink** on dark surfaces (6.1:1). On light
  surfaces the accent ink is bark rust (5.6:1) — the deep ochre.
- **Fired red cannot host small light text.** Its best foreground reaches
  4.05:1, under the 4.5:1 floor. Fired red stays an **indicator** — status marks
  and invalid field borders, where the 3:1 non-text threshold applies. The
  danger fill is bark rust instead.

### The roles

| Group | Role | Light | Dark | Use |
|---|---|---|---|---|
| Surface | `canvas` | Millet Clay | Dark BG | Page background |
| | `surface` | Dust Light | Dark Card | Cards, panels, bands |
| | `surfaceWell` | Millet Clay | Dark BG | Wells, code blocks. **Recedes toward the canvas — not an elevated surface.** |
| | `inverse` | Char Black | Dark Card Alt | Footer, ticker, lab card |
| | `inverseBorder` | transparent | Ochre Orange | Dark mode has no darker tone to invert into, so the inverse card is marked by an accent edge |
| Text | `text` | Char Black | Millet Clay | Headings, primary text |
| | `textBody` | ink 82% | paper 78% | Long-form reading text (8.1:1 / 9.1:1) |
| | `textMuted` | ink 66% | paper 55% | Labels, captions, meta (the 4.5:1 floor, measured against the editor grounds too) |
| | `textFaint` | ink 25% | paper 25% | **Disabled text and ordinals only** — below 4.5:1 by design |
| | `textOnInverse` | Millet Clay | Millet Clay | Text on an inverse surface |
| Line | `line` | ink 10% | paper 10% | Hairline divider — decorative, carries no state |
| | `lineStrong` | ink 20% | paper 20% | Emphasized divider |
| | `focusRing` | Bark Rust | Ochre Orange | Focus ring (3:1 floor) |
| | `accentInk` | Bark Rust | Ochre Orange | The accent as ink: link, ghost hover, field focus |
| Action | `actionBg` / `actionFg` / `actionBorder` | Ochre / Char Black / Bark Rust | Ochre / Char Black / Ochre | Primary action |
| | `actionHoverBg` / `actionHoverFg` | Mopane Brown / Millet Clay | Mahangu Gold / Char Black | Primary hover — deepens to earth in light, lifts to gold in dark |
| | `accentBg` / `accentFg` / `accentBorder` | Mahangu Gold / Char Black / Mopane Brown | Mahangu Gold / Char Black / Mahangu Gold | The in-card accent action |
| | `accentHoverBg` / `accentHoverFg` | Dye Plum / Millet Clay | Millet Clay / Char Black | Accent hover |
| | `dangerBg` / `dangerFg` | Bark Rust / Millet Clay | Bark Rust / Millet Clay | Destructive action |
| | `dangerBorder` | Fired Red | Fired Red | The danger edge — where "red means danger" lives on the button |
| | `dangerHoverBg` / `dangerHoverFg` | Char Black / Millet Clay | Millet Clay / Char Black | Danger hover |
| | `ghostBorder` / `ghostFg` | ink 51% / Char Black | paper 42% / Millet Clay | Quiet alternative |
| | `ghostHoverBorder` / `ghostHoverFg` | Bark Rust | Ochre Orange | Ghost hover |
| Field | `fieldBg` | transparent | transparent | Field ground |
| | `fieldBorder` | ink 51% | paper 42% | The control's visible boundary (3:1 floor) |
| | `fieldBorderHover` | ink 65% | paper 58% | Boundary on hover |
| | `fieldBorderFocus` | Bark Rust | Ochre Orange | Boundary on focus |
| | `fieldBorderInvalid` | Fired Red | Fired Red | Boundary when invalid |
| | `fieldDisabledBg` / `fieldDisabledText` | ink 4% / ink 25% | paper 4% / paper 25% | Disabled field |
| | `controlOn` / `controlOnFg` | Ochre / Char Black | Ochre / Char Black | Checked checkbox, radio, toggle |
| | `controlOnBorder` | Bark Rust | Ochre Orange | The checked control's edge — the ochre fill is 2.56:1, so the edge carries the boundary |

**Text and lines are brand ink at a fixed opacity, not new hues.** Use the steps
in `ALPHA`, which is mode-aware: `body`, `muted`, `faint`, `line`, `lineStrong`,
`control`, `controlHover`. They are measured against every ground in the
system, including the eleven `EDITOR_SURFACE` tones. A step not in `ALPHA` is drift.

`textFaint` is deliberately below 4.5:1. WCAG exempts inactive controls, and
ordinals repeat information already in the adjacent label. **Never put meaning
there.**

### Picking a foreground for a colour you receive as data

Tags, chart labels, and system cards take a colour as input and cannot know
their foreground in advance:

```tsx
import { onColor, SYSTEM_COLOR } from '@onganda/design-system';

<span style={{ background: SYSTEM_COLOR.Ombiga, color: onColor(SYSTEM_COLOR.Ombiga) }}>03</span>
```

`onColor` picks by measured luminance. It cannot rescue fired red — char black
reaches 3.66:1 and dust light 3.85:1 — so do not put small text on fired red.

### What each palette token may do

`COLOR_POLICY` carries this table in code, so an agent can read the rule without
reading the docs.

| Token | Allowed | Never |
|---|---|---|
| `milletClay` | Light canvas; text and icons on any dark surface; the label on mopane, plum and bark rust fills; the accent hover in dark mode | A fill on a light surface |
| `dustLight` | Lifted surface on the light canvas | Text, borders, any action |
| `charBlack` | Ink: text, and lines via the alpha ramp; the label on ochre and gold fills; inverse surfaces; the danger hover | **The primary action fill** — a black primary makes chrome the heaviest thing on the screen. The dark-mode canvas — use `darkBg` |
| `ochreOrange` | A **fill** with char black on it (5.5:1): the primary action, checked control, active tab. **Ink on dark surfaces only** (6.1:1). Also Okaanda | Ink on a light surface — 2.4:1. Use bark rust. Never body text |
| `firedRed` | Critical status marks, invalid field borders and the danger button edge, where the 3:1 floor applies | A fill behind small text (best 4.05:1). Never error message text. Never a second accent |
| `mahanguGold` | The accent action fill (8.4:1 with char black) with a mopane edge; the dark primary hover; caution status; Ombiga; chart series 3 | Light-mode body text or small type — 1.6:1 on cream |
| `barkRust` | The accent as **ink** on light surfaces (5.6:1); the danger fill with millet clay on it; the primary action's edge. Also Oshini and chart series 2 | A surface or a large decorative fill |
| `mopaneBrown` | The primary hover fill (6.1:1 with millet clay) and the accent edge, light only; settled status on light; Etiti; chart series 4 | Picked directly for chrome — read the role. Never on a dark card — 2.25:1 |
| `mopaneBrownLight` | Settled status and Etiti on dark surfaces | A sixth system color |
| `dyePlum` | The accent hover fill (5.6:1 with millet clay), light only; Oshitoo; chart series 5 | A status, a surface, or a resting fill |
| `darkBg` | Dark canvas; the recessed well on a dark card | Light mode |
| `darkCard` | Dark surface: cards, panels | Light mode |
| `darkCardAlt` | The inverse card in dark mode, marked with an ochre edge | Light mode |

### System identity

```ts
import { SYSTEM_COLOR } from '@onganda/design-system';
// Okaanda → Ochre Orange · Oshini → Bark Rust · Ombiga → Mahangu Gold
// Etiti → Mopane Brown · Oshitoo → Dye Plum
```

A system color means "this belongs to that system." Using one as a button, a
border, or a label destroys that meaning. `npm run check:tokens` fails on a
system hue bound to a `background` or `border*` property.

### Status

```ts
import { statusFor } from '@onganda/design-system';

<PixelDot color={statusFor('settled', isDark)} ring={c.lineStrong} />
```

| Status | Color | Means |
|---|---|---|
| `active` | Ochre Orange | Live, running, in progress |
| `caution` | Mahangu Gold | Warning, pending, needs attention |
| `critical` | Fired Red | Error, destructive, blocking |
| `settled` | Mopane Brown (light) / Mopane Brown Light (dark) | Complete, archived, informational |

Always call `statusFor(name, isDark)`, not `STATUS[name]`: mopane brown drops to
2.25:1 on a dark card. The check flags a direct `STATUS.settled` read.

**A status mark is never the only carrier of meaning.** Pair it with a text
label. Some hues fall under 3:1 against their surface — gold on cream is 1.6:1 —
so a bare dot also needs a hairline: `<PixelDot ring={c.lineStrong} />`.

**The palette is earth-derived. It has no green and no blue, and none may be
added.** Success reads as a check glyph on a settled tone.

### Charts

```ts
import { CHART_SERIES } from '@onganda/design-system';
```

Fixed order: ochre orange, bark rust, mahangu gold, mopane brown, dye plum, fired
red. Take colors from the front. Never reorder or substitute, so series index 2
reads the same in every chart across a product.

### Theming

`COLOR_CSS_VARS` gives the CSS-variable form of every token
(`var(--onganda-ochre-orange, #D9791F)`). Override the `--onganda-*` properties in
a consumer stylesheet to retheme without forking components. Keep `COLOR` for hex
math such as `` `${hex}60` ``.

If you retheme, run `npx onganda-check --contrast` — the guard reads the token
source, so your values are measured, not the shipped ones.

---

## 5. Controls

Every control has one recipe. A control does not choose its own colors, and no
control uses a rounded corner. If a control is not listed here, it does not exist
yet: add it to the system and to `/showcase` before using it in a product.

`/showcase` renders all of them in every state, in both modes, under **Control
Standards**. That section carries its own light/dark switch.

### Controls on an inverse surface take the dark role set

An inverse surface — the footer, the ticker, the black lab card — is locally
dark. A control sitting on one must be passed `isDark`, or it resolves its hover
against the wrong background and can disappear into the card:

```tsx
<div style={{ background: c.inverse }}>
  <PixelButton variant="accent" isDark>Read the manifesto</PixelButton>
</div>
```

### PixelButton

```tsx
import { PixelButton } from '@onganda/design-system';

<PixelButton variant="primary" onClick={submit}>Send</PixelButton>
<PixelButton variant="accent" href="/manifesto">Read the manifesto</PixelButton>
<PixelButton variant="ghost" isDark>Cancel</PixelButton>
<PixelButton variant="danger" onClick={remove}>Delete</PixelButton>
<PixelButton variant="primary" disabled>Saving…</PixelButton>
```

### PixelIconButton

Use `PixelIconButton` for a familiar icon action inside a compact toolbar or row. It is borderless at rest and always requires a concise accessible `label`.

```tsx
<PixelIconButton label="Move up"><IconChevronUp size={14} /></PixelIconButton>
```

| Variant | Light | Dark | When |
|---|---|---|---|
| `primary` | Ochre, bark rust edge → mopane brown | Ochre → mahangu gold | The one main action in a view |
| `accent` | Mahangu gold, mopane edge → dye plum | Mahangu gold → millet clay | An action inside a card that already sits on the page's primary |
| `ghost` | Transparent, ink-50% border → bark rust | Transparent, paper-42% border → ochre | The quiet alternative next to a primary |
| `danger` | Bark rust, fired red edge → char black | Bark rust, fired red edge → millet clay | Destroys something |

The primary is ochre, not char black. A black primary made every screen read
as a black slab with some cream around it: the heaviest object on the page was
chrome, and the palette's warmth went unused. Ochre with a char black label is
5.52:1. The fill alone is 2.56:1 against dust light, under the 3:1 boundary
floor, so every filled button carries an edge that clears it: bark rust on the
primary (5.95:1), mopane on the gold accent (6.45:1), fired red on danger
(3.85:1). `npm run check:contrast` measures each edge on both surfaces.

Danger fills with bark rust rather than fired red. Fired red's best foreground
is 4.05:1, under the floor for a 14px label; a fired-red marker on a bark rust
fill measures 1.55:1 and is invisible; and an outlined treatment passes but
makes the destructive action quieter than the primary, which is wrong in a
confirmation dialog where deleting *is* the primary action. Bark rust sits
2.37:1 from char black and 2.33:1 from ochre, so it stays distinct from the
other intents. Fired red remains the critical **status** and **border** color,
where the 3:1 threshold applies, so "red means danger" survives in the system's
semantics.

On hover, light mode deepens: ochre to mopane, gold to its complement dye
plum, bark rust to char black. Dark mode lifts toward the light: ochre to gold,
gold and bark rust to millet clay. Every hover label is measured.

Props: `variant`, `isDark`, `disabled`, `onClick`, `href`, `className`.
Passing `href` renders an `<a>` with identical styling. Every button carries the
`MOTION.tap` compression and an `accentInk` focus ring; none scales on hover.

Rules: one primary per view. `accent` never substitutes for `primary` on a plain
page. `danger` is the only destructive treatment and never appears twice in one
dialog.


### Density — the surface decides, not the control

The system has two densities. Page defaults dropped into a 340px popup or a
narrow side panel are oversized: a 42px button and a 47px field crowd the
surface and the result reads as heavy. Density is a property of the **surface**,
so a container declares it once and every control inside tightens together.

```tsx
import { DensityProvider, PixelButton, PixelInput } from '@onganda/design-system';

<DensityProvider value="compact">
  <PixelButton variant="primary">Save</PixelButton>
  <PixelInput placeholder="Field" />
</DensityProvider>
```

| | `comfortable` (default) | `compact` |
|---|---|---|
| Use for | Pages, marketing, full-width app views | Popups, side panels, toolbars, inspectors, dense tables |
| Button | 44px tall, `12px 24px`, 14px | 36px tall, `8px 16px`, 14px |
| Field | 47px tall, `12px 16px`, 14px | 39px tall, `8px 12px`, 14px |
| Checkbox / radio | 18px | 16px |
| Toggle | 40×20 | 36×20 |
| Label gap / stack gap | 12 / 20 | 8 / 12 |
| Panel padding | 24 | 16 |

**Density changes spacing. It never changes type.** Both columns set the
control label at 14px/600 — the size measured off the public site's primary
action. Shrinking the type as well is what made the first extension surfaces
read as a different product; a narrow surface gets a tighter box around the
same letters.

Never hand-tune a control's padding to fit a narrow surface. Set the density on
the container; the whole surface stays in proportion.

### Focus is keyboard-only

Focus rings render through `:focus-visible` in `style.css`, so they appear when
someone tabs and never after a mouse click. Do not set an outline from a React
`onFocus` handler — it fires on click too and leaves a permanent ring on every
button a pointer user touches.

### Text fields

```tsx
import { PixelInput, PixelTextarea, PixelSelect, PixelField } from '@onganda/design-system';

<PixelField label="Email" hint="We reply within two days." htmlFor="email">
  <PixelInput id="email" type="email" placeholder="name@institution.na" />
</PixelField>

<PixelField label="Organisation" error="This field is required." htmlFor="org">
  <PixelInput id="org" invalid placeholder="Institution or company" />
</PixelField>
```

All three fields share one recipe: transparent ground, 1px `fieldBorder`,
`borderRadius: 0`, `accentInk` border on focus, fired red border when `invalid`.
`PixelSelect` replaces the native chevron with a stepped pixel arrow, so no
platform chrome survives inside an Onganda field.
Props: `isDark`, `invalid`, plus every native attribute.

Use `PixelField` for the label, hint, and error. It sets `aria-invalid` and
renders the error with `role="alert"`. **The error message runs at full contrast
with a fired-red marker beside it, not in fired red** — red text is 3.6:1, and
color must never be the only signal. Do not hand-write a field label.

### Choice controls

```tsx
import { PixelCheckbox, PixelRadio, PixelToggle } from '@onganda/design-system';

<PixelCheckbox label="Send me lab updates" checked={on} onChange={e => set(e.currentTarget.checked)} />
<PixelRadio name="inquiry" label="Pilot programme" checked={v === 'pilot'} onChange={() => setV('pilot')} />
<PixelToggle label="Publish to the public site" checked={live} onChange={setLive} />
```

| Control | Off | On | Geometry |
|---|---|---|---|
| `PixelCheckbox` | Square box, `fieldBorder` | `controlOn` fill, `controlOnBorder` edge, stepped pixel check | 18px square, no radius |
| `PixelRadio` | Stepped octagon, `fieldBorder` | `controlOnBorder` frame, square core | 18px, no circle |
| `PixelToggle` | Two-cell track, `fieldBorder` | `controlOn` fill, knob at the far cell | 40×20, knob steps in 2 frames |

Checked is `controlOn` (ochre) on all three, so "on" reads identically. The ochre
fill is 2.56:1 against dust light, so `controlOnBorder` carries the boundary. The
radio has no circle: the pixel system has no curves. The toggle knob steps
between two cells; it does not slide. Each accepts `label`, `isDark`, `disabled`,
and the native props.

### Utility controls

Tab chips, filter buttons, mode toggles, and canvas tools are not `PixelButton`.
They follow the ghost recipe — transparent ground, `fieldBorder`, `text` label,
`accentInk` when active or focused — at a smaller scale. They never take a system
color and never take a fill other than `surface` or `controlOn`.



## 6. Product Patterns

The compounds a real product needs. `/showcase` renders all of them in every
state under **Product Patterns**, with its own light/dark switch.

These exist because their absence was the largest leak in the system. An agent
building a product hits a modal on day one; with nothing here it invents one,
and the invention is where Onganda stops looking like Onganda.

```tsx
import {
  PixelDialog, PixelTable, PixelNotice, PixelEmptyState,
  PixelSkeleton, PixelTabs, PixelProgress,
} from '@onganda/design-system';
```

### PixelNotice

```tsx
<PixelNotice status="caution" title="Quota at 94%" onDismiss={hide}>
  Archive completed runs to free granary space.
</PixelNotice>
```

One per status: `active`, `caution`, `critical`, `settled`. The hue appears on
the left rule and the dot; the text runs at full contrast, so the notice still
reads if the colour is not perceived. A `critical` notice gets `role="alert"`;
the others get `role="status"`.

### PixelDialog

```tsx
<PixelDialog
  open={open}
  onClose={close}
  eyebrow="Okaanda · granary"
  title="Delete the evaluation corpus?"
  footer={<>
    <PixelButton variant="ghost" onClick={close}>Cancel</PixelButton>
    <PixelButton variant="danger" onClick={remove}>Delete corpus</PixelButton>
  </>}
>
  This removes 128 evaluation records.
</PixelDialog>
```

Traps focus, closes on Escape or scrim click, restores focus to the trigger,
locks body scroll, and carries `PixelCornerMarks` so the modal is Onganda
rather than generic chrome.

### PixelTable

```tsx
<PixelTable
  rows={runs}
  rowKey={r => r.id}
  caption="Systems overview"
  columns={[
    { key: 'system', header: 'System', render: r => r.system },
    { key: 'uptime', header: 'Uptime', numeric: true, render: r => `${r.uptime}%` },
  ]}
  empty={<PixelEmptyState title="No runs yet" />}
/>
```

Uppercase tracked headers, hairline row rules, tabular figures on `numeric`
columns, horizontal scroll rather than page overflow, and a real `<caption>`.
Pass `empty` and the table renders that instead of an empty body. Numeric
cells never wrap, and the frame uses `contain: inline-size`, so a wide table in
a grid column scrolls inside its frame instead of widening the column and the
page. Inside a titled `PixelPanel`, the caption repeats the panel title; keep
the caption short or make it the panel's eyebrow.

### PixelPanel

```tsx
<PixelPanel
  eyebrow="Practice — MCQ"
  note="data splitting"
  title="What happens if train_test_split uses shuffle=True without random_state?"
  footer={<PixelActions align="between">
    <PixelButton variant="primary">Send answer</PixelButton>
    <PixelButton variant="ghost">Next exercise</PixelButton>
  </PixelActions>}
>
  …
</PixelPanel>
```

A transcript of the feature card in the public site's "Why Onganda" grid —
the brand's general-purpose card. Surface, hairline border, four pixel corner
marks in the card's accent, a 12px eyebrow, an 18px semibold title, 14px body.
Padding follows density: 24 on a page, 16 in a side panel.

**It does not stack its marks.** The site never does. Its feature card has
corner marks and no spine; its system card has a 3px spine and no corner
marks. Pass `spine` to get the second
recipe — you get one or the other, never both. An earlier version of this
component did all three at once, and cards built from it read as busy and
over-ruled beside the site they were meant to match.

This exists because measuring a product's panels against the landing page
found them at the floor on every composition measure — one weave, three marks,
one label, no inverse band. A solid button in a flat box reads as a heavy blob,
which is why those panels looked *too black* while carrying **less** black than
the landing page (3% against 12%). The fix was never less black; it was more of
everything else.

### PixelChoice and PixelChoiceList

```tsx
<PixelChoiceList label="Answer">
  {options.map(o => (
    <PixelChoice key={o} label={o} selected={picked === o} onSelect={() => setPicked(o)} />
  ))}
</PixelChoiceList>
```

A selectable option in the system's language: stepped square mark, weave on the
selected row, accent-ink edge, density-aware height. Pass `state="correct"` or
`"incorrect"` after grading and the edge takes the settled or critical status
colour. `PixelChoiceList` is the `radiogroup` wrapper.

### PixelActions

```tsx
<PixelActions align="between">…</PixelActions>
<PixelActions stack>…</PixelActions>
```

One row, one gap, one alignment. Buttons stacked flush at unequal widths were
most of why compact surfaces looked unfinished. `stack` gives full-width
buttons for very narrow surfaces.

### PixelEmptyState

```tsx
<PixelEmptyState
  icon={<IconOkaanda size={44} />}
  title="No datasets yet"
  body="Ingest a corpus to start evaluating models."
  action={<PixelButton variant="accent">Ingest a corpus</PixelButton>}
/>
```

A solid edge with corner marks and the weave texture — the empty state is a
designed surface, not a blank panel.

### PixelSkeleton

```tsx
<PixelSkeleton lines={4} />
```

Solid bars with a slow sweep that stops for reduced motion — the waiting state
breathes without a gradient shimmer. Carries `role="status"`.

### PixelTabs

```tsx
<PixelTabs
  label="Run state"
  value={tab}
  onChange={setTab}
  tabs={[{ value: 'live', label: 'Live' }, { value: 'queued', label: 'Queued' }]}
/>
```

The ghost recipe at a smaller scale, filling with `controlOn` and its edge when
active. Proper `role="tablist"` and `aria-selected`.

### PixelProgress

```tsx
<PixelProgress label="Fine-tuning" value={78} status="active" />
```

A solid fill over a recessed well, with the percentage as tabular figures
beside the label. Full `role="progressbar"` semantics. The status hue picks the
fill through `statusFor`.

---

## 6b. Site Compositions

The public site's own building blocks, exported from
`onganda-site.tsx`. These are not "examples of the system" — they **are** the
brand's surfaces, and until they were extracted they lived as private markup
inside the site file. That meant the one thing the design system exists to
describe was the one thing it did not contain, and a consumer could import a
button and a panel and still have to re-derive the brand by eye.

The public site imports these, so there is a single implementation and no copy
to drift.

| Component | What it is | Rule |
|---|---|---|
| `PixelTicker` | The full-bleed black marquee of system names | The only place all five system colours appear together; it reads as a legend for the page below it |
| `PixelEditorialSection` | Label, headline, empty column, prose column | The empty left column is the composition. Collapsing it to full-width prose is what makes a page look like documentation |
| `PixelFocusRow` | Ordinal, icon, title, line, in a row | For a list that should read as a sequence rather than a grid |
| `PixelLabCard` | The inverted cell that closes a grid | One per grid, in the last cell. It is the grid's full stop |
| `PixelContactPanel` | The closing inquiry surface | Deliberately the largest surface on the page. A page that ends in a thin footer link reads as unfinished |
| `PixelStatBand` | The strip of measured numbers under a hero | Cells divided by a hairline, never by a gap — a gap reads as four cards, and this is one object |
| `PixelEdgeStrips` | Drifting palette columns beside a hero | 16–27s a cycle, so it reads as texture rather than motion |
| `SystemCard` | The five-system card | Icon tile, numbered tag, 24px name, English reading, role eyebrow, line — carried by a 3px spine |

### No elevation, anywhere

The public site renders **zero blurred shadows**. Depth is the weave texture, a
hairline border and stepped pixel marks — never a cast shadow. A card lifts on
hover by *moving* (`MOTION.hoverLift`), not by casting.

This is enforced by the `elevation-shadow` rule in `check:tokens` and by
`tests/browser/fidelity.spec.ts`. A `0 0 0 Npx` ring is permitted: it is a
border that does not reflow the layout.

The rule exists because `/showcase` was carrying fourteen drop shadows —
`0 4px 24px`, `0 8px 48px`, `0 24px 80px` — on system cards, publication
cards and editor panels, while `GEOMETRY.shadow` said `none` and nothing
checked it.

---

### A section is built from the page's cards, not its own

Every block on `/showcase` is a `PixelPanel`. Not a `<div>` styled to look
like one — the component itself, so the block inherits the weave, the four
accent corner marks, the 12px eyebrow and the density-aware padding without
re-deriving any of it.

This is the rule that had been broken most quietly. Control Standards and
Product Patterns contained **nine hand-rolled containers**, each writing
`background: c.surface` and `border: 1px solid ${c.line}` inline. Every guard
passed: no raw hex, no rounded corner, no off-scale type. But measured against
the rest of the page, Control Standards carried **9.0 ingredients of the
language per 1000px against 20–25 everywhere else**, and it read as a
different, duller product sitting in the middle of the showcase.

Two things are worth stating plainly, because the first attempt at fixing it
got both wrong:

- **The fix was not a new component.** A label with an accent dot and a
  dither rule under it was invented to raise the score. The site has no such
  object, and the section did not need a new part — it needed the ones the
  rest of the page already used. Rebuilding the nine blocks as `PixelPanel`
  brought the number up on its own.
- **A label inside a card is plain.** 12px uppercase muted, exactly as the
  system card sets its role line. No dot, no rule. The dot-and-rule rhythm
  belongs to `SectionHeader`, at section scale, once.

### Where a section's colour comes from

A section picks **one accent** and spends it on the dot in its
`SectionHeader`, on the dither rule beside its prose, and on the marks of the
cards inside it. Nowhere else. That is why the public site reads as deliberate
rather than colourful: `Systems` is gold, `Focus` is plum, `People` is brown,
`Why` is ochre, `Studio` is bark rust. The showcase passed no accent at all,
so every section defaulted to bark rust; each one now declares its own.

### What enforces it

| Guard | Catches |
|---|---|
| `hand-rolled-card` (`check:tokens`) | An inline style setting a `surface` background plus a `line` border — that combination **is** `PixelPanel` |
| `no section is markedly flatter than its peers` (`composition.spec.ts`) | A section below half the median language density of the others, or one rendering no inverse surface |

The density test scores against the median of the page rather than a fixed
number, so the bar rises with the page instead of freezing at whatever was
acceptable the day it was written.

---

## 7. Content & Data Tokens

Import structured data for the five Onganda systems and shared datasets:

```ts
import {
  SYSTEMS,           // SystemEntry[] — the five AI systems
  STATS,             // StatEntry[]  — headline statistics
  TIMELINE_PHASES,   // TimelinePhase[] — roadmap phases
  FLOW_NODES,        // FlowNodeEntry[] — data-pipeline nodes
  HEATMAP_CELLS,     // HeatCell[]   — activity heatmap grid
  HEATMAP_LABELS_X,  // string[]     — heatmap column labels
  HEATMAP_LABELS_Y,  // string[]     — heatmap row labels
  SECTOR_APPS,       // SectorApp[]  — field application cards
  PRINCIPLES,        // PrincipleEntry[] — lab design principles
  DIAGRAM_NODES,     // DiagramNode[] — connection diagram nodes
  CONNECTION_EDGES,  // ConnectionEdge[] — diagram edges
  DIAGRAM_NODE_TOOLTIPS, // Record<string, NodeTooltipData>
  SLIDE_MARKET_DATA, // { year: string; value: number }[]
  SLIDE_BAR_DATA,    // { name: string; progress: number }[]
  SLIDE_RADAR_DATA,  // { subject: string; value: number }[]
} from '@onganda/design-system';
```

Each `SystemEntry` has:

```ts
{
  name: string;       // Oshiwambo name  (e.g. 'Okaanda')
  english: string;    // English name    (e.g. 'Granary')
  role: string;       // Short role      (e.g. 'Model & Data Platform')
  desc: string;       // Full description
  long: string;       // Long description for detail pages
  line: string;       // One-line summary
  hex: string;        // System colour   (e.g. '#D9791F')
  tag: string;        // Numeric tag     (e.g. '01')
}
```

---

## 8. Atomic Primitives

### Px — pixel SVG wrapper

The foundation for all pixel-art icons. Constrains drawing to an integer grid.

```tsx
import { Px } from '@onganda/design-system';

// All child elements must be <rect> with integer coordinates
<Px size={48} viewBox="0 0 24 24">
  <rect x="11" y="1" width="2" height="1" fill="#D9791F" />
  <rect x="10" y="2" width="4" height="1" fill="#D9791F" />
  {/* ground shadow at y=21 */}
  <rect x="7" y="21" width="10" height="1" fill="#1E1A17" fillOpacity="0.18" />
</Px>
```

Props: `size` (default `48`), `viewBox` (default `'0 0 24 24'`).

---

### PixelDot — single square pixel mark

```tsx
import { PixelDot, COLOR } from '@onganda/design-system';

<PixelDot color={COLOR.ochreOrange} size={4} opacity={1} />
```

Props: `color`, `size` (default `4`), `opacity` (default `1`).
Use in bullet lists, stat rows, section accents.

---

### DitherBar — a solid hairline divider

```tsx
import { DitherBar, roles } from '@onganda/design-system';

<DitherBar color={roles(isDark).line} opacity={1} />
```

Props: `color`, `opacity` (default `0.55`), `className`. It used to draw
alternating segments; the dotted rule is retired, and `segments` and `height`
are accepted and ignored so existing calls keep compiling. Most blocks need no
divider at all — spacing separates them.

`DitherStrip` is retired the same way and renders nothing. Remove the call.

---

### WeaveOverlay — Oshiwambo basket-weave texture

Must be inside a `position: relative; overflow: hidden` parent.

```tsx
import { WeaveOverlay } from '@onganda/design-system';

<div style={{ position: 'relative', overflow: 'hidden', background: '#F3E8C3' }}>
  <WeaveOverlay isDark={false} opacity={TEXTURE.surface} />
  {/* card content */}
</div>
```

Props: `isDark` (default `false`), `opacity` (default `0.045`).
Range: `0.03` (very subtle) to `0.08` (visible).

---

### PixelCornerMarks — stepped corner accents

Replaces `border-radius` on brand cards. Must be inside `position: relative`.

```tsx
import { PixelCornerMarks, COLOR } from '@onganda/design-system';

<div style={{ position: 'relative', padding: 24 }}>
  <PixelCornerMarks hex={COLOR.ochreOrange} size={10} />
  {/* card content */}
</div>
```

Props: `hex`, `size` (default `10`).
Top corners: full opacity. Bottom corners: 50% opacity.

---

### PixelTag — small coloured label badge

```tsx
import { PixelTag, COLOR } from '@onganda/design-system';

<PixelTag hex={COLOR.ochreOrange} label="01" />
<PixelTag hex={COLOR.mahanguGold} label="03" />  {/* auto dark text on gold */}
```

Props: `hex`, `label`.

---

### PixelArrowDown — pixel-art downward arrow connector

```tsx
import { PixelArrowDown, COLOR } from '@onganda/design-system';

<PixelArrowDown color={COLOR.ochreOrange} />
```

Use between vertically stacked flow nodes.

---

### SectionHeader — consistent section label + headline

```tsx
import { SectionHeader } from '@onganda/design-system';

<SectionHeader
  label="System Architecture"
  headline="Five tools. One workshop."
  isDark={false}
/>
```

Props: `label`, `headline`, `accent` (default `accentInk`), `level` (`1` or `2`,
default `2`), `isDark` (default `false`). Pass `level={1}` when the header opens
the page: a screen whose title is a `SectionHeader` otherwise has no `<h1>`.
The look does not change.

Renders the four-part rhythm the public site opens every section with, in this
order every time: an accent `PixelDot`, a 12px uppercase label, a 30px
**medium** headline, and a hairline rule under the pair. The headline is medium,
not semibold — it sits beneath the cards it introduces rather than competing
with them.

The accent dot is not decoration. It declares which colour the section below is
allowed to use, and it should be the only accent in that section.

---

### PixelButton, fields, and choice controls

Specified in [§5 Controls](#5-controls) with their variants, states, and colour
rules. Do not style a button or a field from this section.

---

### SystemCard — five-system card with icon and description

```tsx
import { SystemCard, SYSTEMS } from '@onganda/design-system';

<SystemCard system={SYSTEMS[0]} isDark={false} />
```

Props: `system: SystemEntry`, `isDark` (default `false`).

---

### StatCard — headline statistic

```tsx
import { StatCard, STATS } from '@onganda/design-system';

<StatCard stat={STATS[0]} isDark={false} />
```

---

### SwatchChip — colour swatch with name and description

```tsx
import { SwatchChip, SWATCHES } from '@onganda/design-system';

<SwatchChip swatch={SWATCHES[0]} />
```

---

### OngandaFooter

```tsx
import { OngandaFooter } from '@onganda/design-system';

<OngandaFooter />
```

Full dark footer with system links, pixel marks, and the Onganda logo mark.

---

## 9. System Icons

Five pixel-art icons representing the Onganda AI systems. Each is a 24×24
pixel SVG drawn with `<rect>` elements only.

```tsx
import {
  IconOkaanda,   // Granary — ochre orange
  IconOshini,    // Mill    — bark rust / mahangu gold
  IconOmbiga,    // Vessel  — mahangu gold
  IconEtiti,     // Surface — ochre orange / mopane brown
  IconOshitoo,   // Delivery — dye plum
  OngandaLogoMark,
} from '@onganda/design-system';

<IconOkaanda size={48} />
<IconOshini  size={32} />
<IconOmbiga  size={48} />
<IconEtiti   size={48} />
<IconOshitoo size={48} />
<OngandaLogoMark size={40} />
```

All accept a single `size` prop (default `48`).

### Get an icon by system name

```tsx
import { systemIconForName } from '@onganda/design-system';

const Icon = systemIconForName('Okaanda');
<Icon size={48} />
```

Accepts any of: `'Okaanda'`, `'Oshini'`, `'Ombiga'`, `'Etiti'`, `'Oshitoo'`.

### Render a custom pixel icon

Build on the `Px` wrapper. Draw on a 24×24 integer grid using `<rect>` only.

```tsx
import { Px, COLOR } from '@onganda/design-system';

const IconCustom = ({ size = 48 }: { size?: number }) => (
  <Px size={size}>
    {/* dominant colour — use the semantic system colour */}
    <rect x="10" y="2"  width="4" height="1" fill={COLOR.ochreOrange} />
    <rect x="8"  y="3"  width="8" height="1" fill={COLOR.ochreOrange} />
    {/* body */}
    <rect x="7"  y="4"  width="10" height="10" fill={COLOR.ochreOrange} />
    {/* side shading — one step darker */}
    <rect x="7"  y="4"  width="1"  height="10" fill={COLOR.firedRed} />
    <rect x="16" y="4"  width="1"  height="10" fill={COLOR.firedRed} />
    {/* texture dot — fillOpacity for depth */}
    <rect x="10" y="6"  width="1"  height="1"  fill={COLOR.barkRust} fillOpacity="0.55" />
    {/* ground shadow */}
    <rect x="7"  y="21" width="10" height="1"  fill={COLOR.charBlack} fillOpacity="0.18" />
  </Px>
);
```

**Icon rules:**
- Integer coordinates only — no floats, no `transform`
- `<rect>` elements only — no `<path>`, `<circle>`, `<ellipse>`
- Shadow: 1px rect at y=21, `fillOpacity` 0.12–0.20
- Texture: `fillOpacity` 0.25–0.65, never full opacity on decorative marks
- Maximum ~35 rects per icon

---

## 10. Interface Icons

60+ pixel-art interface icons. All accept `size` (default `24`) and `color` props.

```tsx
import {
  IconSearch, IconMenu, IconClose, IconArrowRight, IconArrowLeft,
  IconArrowUp, IconArrowDown, IconChevronUp, IconChevronDown,
  IconPlus, IconMinus, IconEdit, IconTrash, IconCopy,
  IconDownload, IconUpload, IconShare, IconRefresh,
  IconCheck, IconAlert, IconInfo, IconError, IconSuccess, IconLoader,
  IconFile, IconFolder, IconDatabase, IconChart, IconTag,
  IconFilter, IconSort, IconTable, IconApi, IconLayers,
  IconBell, IconMail, IconMessage, IconPhone, IconBroadcast,
  IconSettings, IconLock, IconUnlock, IconUser, IconUsers, IconShield,
  IconEye, IconEyeOff, IconKey,
  IconTerminal, IconCloud, IconCpu,
  IconPlay, IconPause, IconStop, IconSkipForward,
  IconImage, IconLink, IconStar, IconVideo, IconMic,
  IconGrid, IconList, IconSidebar, IconColumns, IconDashboard,
  IconBadge, IconCurrency, IconWallet, IconReceipt,
  IconTrendingUp, IconTrendingDown, IconTarget,
  IconClock, IconCalendar, IconTimer, IconHistory,
  IconText, IconToggle, IconCheckbox, IconSlider, IconRadio,
  IconLocation, IconMap, IconGlobe, IconCompass,
  IconCode, IconGitBranch, IconPackage, IconWebhook,
  IconExternalLink, IconHome, IconBack, IconPin,
  IconMaximize, IconMinimize,
} from '@onganda/design-system';
```

Usage:
```tsx
import { IconSearch, COLOR } from '@onganda/design-system';

<IconSearch size={20} color={COLOR.ochreOrange} />
<IconSearch size={16} color={COLOR.charBlack} />
```

---

## 11. Maps and Charts

### Maps

```tsx
import '@onganda/design-system/maps.css';
import { OngandaMap } from '@onganda/design-system/maps';

<OngandaMap
  points={[
    {
      id: 'windhoek',
      position: [-22.5609, 17.0658],
      label: 'Windhoek',
      eyebrow: 'Coordination',
      description: 'Illustrative coordination signal.',
      accent: 'ochre',
      glyph: 'warehouse',
    },
  ]}
/>
```

`OngandaMap` uses Leaflet for geography and interaction while Onganda owns the frame, controls, pixel markers, routes, legend, popups, dark treatment, and focus states. Configure `tileUrl` and `attribution` for the product's map provider. Set `tileUrl={null}` when a project supplies its own geographic layer.

Markers require unique `id`, `label`, and coordinates. Use `eyebrow` and `description` for useful context. Do not use a marker to imply a real facility, deployment, or data source unless the claim is verified.

Choose a pixel glyph by operational meaning: `signal`, `warehouse`, `water`, `people`, `action`, `source`, or `allocation`. Use the accent color for state or severity.

Use `areas` for verified administrative or analytical polygons. Each area accepts GeoJSON-style polygon nesting after coordinates are converted to `[latitude, longitude]`. Keep the boundary source visible in product evidence and preserve an unavailable fallback when remote geometry cannot load.

### Charts

```tsx
import { ChartGallery } from '@onganda/design-system/charts';

<ChartGallery isDark={false} />
```

A composed showcase of all chart types using Recharts and the Onganda palette:
bar, line, area, pie, radar, scatter, treemap, funnel, radial bar, and composed charts.

**Drawing your own chart.** The gallery is a specimen, not a component. A
product charting its own data reads `chartTheme(isDark)` for the grid, axes,
tooltip and series, and puts `ChartLegend` under the chart inside a
`PixelPanel`. Without them a dashboard gets default grey axes, a rounded white
tooltip and no legend beside Onganda panels.

```tsx
import { chartTheme, ChartLegend } from '@onganda/design-system/charts';

const t = chartTheme(isDark);
<PixelPanel eyebrow="Queries by sector" title="Weekly volume">
  <ResponsiveContainer width="100%" height={240}>
    <BarChart data={weekly}>
      <CartesianGrid {...t.grid} />
      <XAxis dataKey="week" {...t.axis} />
      <YAxis {...t.axis} axisLine={false} />
      <Tooltip {...t.tooltip} />
      <Bar dataKey="health" fill={t.series[0]} />
    </BarChart>
  </ResponsiveContainer>
  <ChartLegend isDark={isDark} items={[{ label: 'Health', color: t.series[0] }]} />
</PixelPanel>
```

Take series colours from the front of `t.series`, in order. See
`/test/dashboard` for a full page.

---

## 12. Page Sections

Ready-to-use composed page sections. Drop them directly into a page layout.

### Navigation

```tsx
import { OngandaNav } from '@onganda/design-system/sites';

<OngandaNav />
```

Fixed top navigation with logo, system links, and dark mode toggle placeholder.

---

### Hero

```tsx
import { OngandaHero } from '@onganda/design-system/sites';

<OngandaHero />
```

Full-width hero with animated pixel columns, headline at `--type-hero` scale,
system ticker strip, and CTA buttons.

---

### System Connection Diagram

Animated SVG network diagram of the five AI systems with step-line connections,
tooltip overlays, and node highlights.

```tsx
import { SystemConnectionDiagram } from '@onganda/design-system/sites';

// Default — renders the full five-system diagram
<SystemConnectionDiagram />

// Custom data
<SystemConnectionDiagram
  nodes={myNodes}
  edges={myEdges}
  tooltips={myTooltips}
/>
```

Props all default to `DIAGRAM_NODES`, `CONNECTION_EDGES`, `DIAGRAM_NODE_TOOLTIPS`.

---

### Pixel Heatmap

Activity heatmap grid with row/column labels and animated reveal.

```tsx
import { PixelHeatmap } from '@onganda/design-system/sites';

// Default data
<PixelHeatmap />

// Custom data
<PixelHeatmap
  data={myHeatCells}
  rowLabels={myRowLabels}
  colLabels={myColLabels}
/>
```

`HeatCell`: `{ row: number; col: number; intensity: number }` — intensity `0.0`–`1.0`.

---

### Roadmap Timeline

Animated roadmap with phase cards, status indicators, and staggered entrance.

```tsx
import { RoadmapTimeline } from '@onganda/design-system/sites';

// Default data
<RoadmapTimeline />

// Custom phases
<RoadmapTimeline phases={myPhases} />
```

`TimelinePhase`: `{ name: string; period: string; status: 'complete' | 'active' | 'planned'; items: string[] }`.

---

### Field Applications

Grid of sector application cards (healthcare, agriculture, education, etc.).

```tsx
import { FieldApplications } from '@onganda/design-system/sites';

<FieldApplications />
```

---

### Pixel Flowchart

Step-line data-pipeline diagram with animated flow nodes.

```tsx
import { PixelFlowchart } from '@onganda/design-system/sites';

<PixelFlowchart />
```

---

### Research Signals

Horizontal stat bar with headline metrics.

```tsx
import { ResearchSignals } from '@onganda/design-system/sites';

<ResearchSignals />
```

---

### Icon Showcase

Grid display of all interface icons with labels.

```tsx
import { IconShowcase } from '@onganda/design-system/sites';

<IconShowcase />
```

---

### Publications

Publications and media mentions section.

```tsx
import { Publications } from '@onganda/design-system/editors';

<Publications isDark={false} />
```

---

## 13. Block System

The block system powers the document and slide editors. Use it if you are building
document-like content surfaces.

### Block types

```ts
import type { DocBlock, DocBlockType } from '@onganda/design-system/editors';
```

`DocBlockType` union:
`'heading'` | `'body'` | `'pullquote'` | `'divider'` | `'callout'` | `'list'` |
`'signature'` | `'stat'` | `'terminal'` | `'heatmap'` | `'timeline'` | `'systemcard'` |
`'flowchart'` | `'principles'` | `'swatchrow'` | `'chart-market'` | `'chart-bar'` | `'chart-gallery'`

### DocBlock shape

```ts
interface DocBlock {
  id: string;
  type: DocBlockType;
  content: string;
  statValue?: string;
  statLabel?: string;
  statSub?: string;
  statHex?: string;
  chartTitle?: string;
  marketData?: string;  // JSON: { year: string; value: number }[]
  barValues?: string;   // JSON: { name: string; progress: number }[]
  heatmapData?: string; // JSON: { row: number; col: number; intensity: number }[]
  principlesData?: string; // JSON: { label: string; value: string }[]
  swatchData?: string;  // JSON: { name: string; hex: string }[]
}
```

### Render a block

```tsx
import { DocBlockDisplay, BlockRenderer } from '@onganda/design-system/editors';

// Read-only display
<DocBlockDisplay block={myBlock} isDark={false} idx={0} />

// Context-aware renderer
<BlockRenderer block={myBlock} context="document" isDark={false} idx={0} />
```

`BlockRenderer` handles: `divider` → a hairline `DitherBar`, `signature` → logo + text,
`heading` → accented h2, `body` → Georgia paragraph, `pullquote` → bordered italic,
`callout` → firedRed alert box, `list` → pixel-dot list.
Design blocks show a labelled placeholder.

### Insert palettes

```ts
import {
  DOC_INSERT_PALETTE,   // InsertPaletteItem[] — 18 document block types
  DOC_PALETTE_CATEGORIES,
  SLIDE_COMPONENT_PALETTE,  // ComponentPaletteItem[] — 47 slide components
  SLIDE_PALETTE_CATEGORIES,
} from '@onganda/design-system/editors';
```

### Export API types

```ts
import type {
  DocumentExportPayload,
  DeckExportPayload,
  DocumentExportFormat,   // 'PDF' | 'WORD'
  DeckExportFormat,       // 'PDF' | 'PPT'
} from '@onganda/design-system/editors';
```

---

## 14. AI Authoring

Drop-in panel that connects to any OpenAI-compatible endpoint and generates
document blocks or slide decks.

```tsx
import { AiAuthoringPanel } from '@onganda/design-system/ai';

<AiAuthoringPanel
  mode="document"       // 'document' | 'slide'
  isDark={false}
  onResult={(result) => {
    // result.title   — generated title string
    // result.summary — brief description
    // result.blocks  — AiDocBlock[] (in document mode)
    // result.slides  — AiSlide[]   (in slide mode)
    applyToEditor(result);
  }}
/>
```

The panel stores the API endpoint in `localStorage`. When no endpoint is
configured, it falls back to offline Onganda-branded placeholder content.

### Regenerate a single block

```ts
import { regenerateDocBlock } from '@onganda/design-system/ai';
import type { AiGeneratableDocBlockType } from '@onganda/design-system/editors';

const result = await regenerateDocBlock(
  'body',                    // AiGeneratableDocBlockType
  'current block content'    // shown to the model as context
);
// result.type     — same type you passed in
// result.content  — new or improved content string
```

`AiGeneratableDocBlockType`: `'heading'` | `'body'` | `'pullquote'` | `'callout'` |
`'list'` | `'divider'` | `'signature'` | `'chart-gallery'`

---

## 15. Editor Shells

Full stateful product surfaces. Drop them into any page — they manage their own
state internally via `localStorage`.

### Document Editor

```tsx
import { DocumentEditor } from '@onganda/design-system/editors';

<DocumentEditor />
```

Block-based document editor with: drag-to-reorder, inline text editing,
18 insertable block types, export to PDF/Word, undo/redo, AI authoring rail,
per-block regeneration.

---

### Slide Editor

```tsx
import { SlideEditor } from '@onganda/design-system/editors';

<SlideEditor />
```

Canvas-based presentation editor with: 47 droppable components, free positioning,
multi-slide deck management, slide inspector panel, export to PDF/PPT, AI authoring.

---

### Slide Inspector (standalone)

```tsx
import { SlideInspector } from '@onganda/design-system/editors';
import type { DroppedBlock, SlideEntry } from '@onganda/design-system/editors';

<SlideInspector
  isDark={false}
  selectedBlock={selectedBlock}        // DroppedBlock | null
  onUpdateBlock={(id, updates) => {}}
  onDeleteBlock={(id) => {}}
  activeSlide={activeSlide}            // SlideEntry | null
  onUpdateSlideTitle={(id, title) => {}}
/>
```

---

## 16. TypeScript Types

All types are available as named imports:

```ts
import type {
  // Systems & content
  SystemEntry, StatEntry, TimelinePhase, FlowNodeEntry,
  SectorApp, HeatCell, SwatchEntry, PrincipleEntry,
  GuideAnnotation, PixelRule, FooterLink,
  DiagramNode, ConnectionEdge, NodeTooltipData, DitherCol,

  // Block system
  DocBlockType, AiGeneratableDocBlockType, DocBlock,
  InsertPaletteItem, ComponentPaletteItem,
  SlideEntry, DroppedBlock, SlideBlockType,
  AiSlideRawType, AiSlideBlock, AiSlide,
  AiDocBlock, AiAuthoringResult,

  // Export API
  DocumentExportFormat, DocumentExportPayload,
  DeckExportFormat, DeckSlideBlock, DeckSlide, DeckExportPayload,

  // Chart data
  BarChartData, BarChartDataPoint,
  LineChartData, LineChartDataPoint,
  AreaChartData, AreaChartDataPoint,
  PieChartData, PieChartDataPoint,
  RadarChartData, RadarChartDataPoint,
  ScatterChartData, ScatterChartDataPoint,
  TreemapData, TreemapDataPoint,
  FunnelData, FunnelDataPoint,
  ChartData,
} from '@onganda/design-system';
```

---

## 17. Design Rules

These constraints define the aesthetic. Follow them in any project that builds
on this system.

### 1. Pixel / type split

| Element | Rule |
|---|---|
| Icons, diagrams, marks, textures | Pixel art — `<rect>` on integer grid |
| Body copy, headings, labels | Clean Inter/Arial — no pixel fonts |

### 2. Color

- Style from `roles(isDark)`, not from `COLOR`. See §4.
- Never use Tailwind generic colors (`text-blue-500`, `bg-orange-400`).
- Never write a raw hex or rgba in a component. Both are build failures.
- A system color (bark rust, mahangu gold, mopane brown, dye plum) means
  "this belongs to that system" when a component picks it. It reaches chrome
  only through a measured role — gold is `accentBg`, mopane and plum are hover
  fills — never by a component choosing the hue.
- Ochre orange is the primary action fill and the checked-control fill. As
  **ink** it works on dark surfaces only; on light surfaces the accent ink is
  bark rust. Char black is ink, never the primary fill.
- Fired red is an indicator: critical status and invalid borders. It never sits
  behind small text and is never error-message text.
- The palette has no green and no blue. Do not add one for success or info.
- Read status through `statusFor(name, isDark)`, never `STATUS[name]`.
- `npm run check:design` enforces all of this across every design-system module.

### 3. Card geometry

- `border-radius: 0` on all brand and system cards. No rounded corners.
- Use `PixelCornerMarks` for corner decoration instead.
- Cards need `position: relative; overflow: hidden` to contain `WeaveOverlay`.

### 4. Motion (Framer Motion)

Spread the `MOTION` presets rather than retyping values, so the whole system
retunes from `onganda-motion.ts`:

```tsx
import { MOTION, SPACE } from '@onganda/design-system';

<motion.section {...MOTION.fadeUp}>…</motion.section>
<motion.div {...MOTION.staggerParent}>
  <motion.div {...MOTION.staggerChild}>…</motion.div>
</motion.div>
<motion.article {...MOTION.hoverLift}>…</motion.article>
```

`MOTION` presets: `entrance`, `fadeUp`, `staggerParent`, `staggerChild`,
`hoverLift`, `tap`, `ticker`. `SPACE` carries the editorial spacing scale
(`sectionY`, `sectionX`, `sectionXWide`, `cardPad`, `cardPadWide`, `itemGap`,
`microGap`) for inline styles.

The values behind them:

```tsx
// Section entrance — always tween, not spring
initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
transition={{ duration: 0.5 }}

// Staggered list
variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
// child: { hidden: { opacity:0, y:12 }, visible: { opacity:1, y:0, transition:{duration:0.35} } }

// Card hover — subtle lift only
whileHover={{ y: -2 }} transition={{ type: 'tween', duration: 0.15 }}

// Button tap
whileTap={{ scale: 0.97 }}

// Continuous ticker
animate={{ x: ['0%', '-50%'] }} transition={{ duration: 32, ease: 'linear', repeat: Infinity }}
```

Never use `type: 'spring'` for section entrances. Never use `scale` on card hover.

### 5. Step-line diagrams

Connections use 90° polylines — no bezier curves.

```tsx
<polyline
  points="120,40 120,80 240,80 240,120"
  stroke={COLOR.ochreOrange}
  strokeWidth="1.5"
  fill="none"
  strokeOpacity="0.45"
  strokeLinejoin="miter"
/>
```

### 6. Typography scale

The scale is a **transcript of the public site**, measured off the rendered DOM
at 1440px. The site is the reference implementation of the brand: it came
first, it is what Onganda actually looks like, and every other surface must
look like it. A size that is not in this table is not an Onganda size, and
`check:tokens` fails the build on one.

If you think a step is missing, the question is not "should we add it" — it is
"where does the public site use it". If the answer is nowhere, the answer is no.

| Step | Size | Weight | Tracking | Leading | Case | Job — and where it was measured |
|---|---|---|---|---|---|---|
| `tag` | 9 | 700 | 0.18em | 1.5 | UPPER | Pixel tag ordinals, the hero status chip. Decorative: `aria-hidden` or repeat it elsewhere |
| `micro` | 10 | 700 | 0.12em | 1.5 | UPPER | The quiet gloss beside a louder label — "Granary" under a system name |
| `label` | 11 | 700 | 0.18em | 1.5 | UPPER | A standalone identifier in a dense strip — the system name in the ticker |
| `eyebrow` | 12 | 700 | 0.16em | 1.33 | UPPER | **THE eyebrow.** Above every section headline, every nav item, every card's role line |
| `code` | 12 | 400 | — | 2.0 | — | Terminal and code lines. Airy because it is read line by line |
| `ui` | 14 | 600 | — | 1.43 | — | The button and control label — "Request a conversation" |
| `meta` | 14 | 500 | — | 1.43 | — | A subtitle directly under a title — "Granary" under "Okaanda" |
| `body` | 14 | 400 | — | 1.6 | — | Default body, and the body of every card |
| `bodyLarge` | 16 | 400 | — | 1.6 | — | Long-form reading |
| `lead` | 18 | 400 | — | 1.6 | — | The paragraph that opens a section |
| `title` | 18 | 600 | — | 1.25 | — | Card and panel titles — "Adapt models" |
| `headline` | 24 | 600 | — | 1.33 | — | The title of a full editorial card — "Okaanda" |
| `pageTitle` | 30 | **500** | — | 1.25 | — | The section headline under an eyebrow — "Five systems. One compound." |
| `display` | 48 | 600 | — | 1.25 | — | The headline inside an inverted panel |

Two of these carry most of the site's character and are the ones most often
got wrong:

- **`pageTitle` is medium, not semibold.** A section headline is lighter than
  the card titles under it. That is what stops a page of cards from shouting
  over its own structure.
- **`eyebrow` is 12px, not 10px.** The 10px step is the *gloss* beside a label,
  not the label. Setting eyebrows at 10px is the single quickest way to make a
  surface look like a dense admin tool rather than Onganda.

Above 48px, type is fluid. Use the CSS custom properties, not bare `clamp()` or
a hardcoded `vw`:

```css
font-size: var(--type-hero);         /* hero headline */
font-size: var(--type-hero-public);  /* public page hero */
font-size: var(--type-subhead);      /* subheadline */
```

### 7. Enforcement

Rules are only real if something checks them. `npm run check:design` runs two
guards over every design-system module and fails the build.

**`check:tokens`** — lexical drift:

| Rule | Catches |
|---|---|
| `tailwind-color` | `bg-blue-500` and every other generic Tailwind hue |
| `off-palette-hex` | Any hex outside `COLOR` and `EDITOR_SURFACE` (an alpha suffix such as `#D9791F60` is fine) |
| `off-palette-rgba` | `rgba()` on a colour the palette does not contain |
| `modern-color-fn` | `oklch`, `oklab`, `lch`, `lab` |
| `system-colour-as-chrome` | A system hue bound to a `background` or `border*` property |
| `raw-status-colour` | `STATUS.settled` read directly instead of `statusFor(name, isDark)` |
| `off-scale-texture` | A weave or dither opacity outside `TEXTURE` / `RULE`. Both were chosen per call site — ten weave opacities, thirteen dither opacities — so the same object read as a different weight in every section |
| `dotted-rule` | A `repeating-linear-gradient` or a dotted border. The dither rule is retired: laid on every card foot, header and progress bar it read as noise. A divider is a solid hairline |
| `off-ramp-ink` | An ink or paper opacity that is not a step on the `ALPHA` ramp, on a `color`, `border*` or `outline*` property. `off-palette-rgba` passes these because char black **is** a palette colour, so only the alpha is invented. Scoped to text and lines: a background wash and a modal scrim are surfaces, and the ramp says nothing about them |
| `rounded-geometry` | `rounded-lg`, `borderRadius` with a non-zero value |

The sanctioned hex set is **parsed from `onganda-colors.ts` at run time**, not
copied. A hand-maintained copy fails open: change a value in `COLOR` and a stale
list keeps accepting the old hex everywhere.

**`check:contrast`** — measured claims. It recomputes all 68 ratios behind §4
from the role source and fails on a regression. `npm run check:contrast -- --table`
prints the full table. Exemptions are declared in the script with a reason;
today there are three (faint text, hairlines, ringed status marks).

Both run inside `npm run check` and in CI.

**`check:docs`** — the rules are restated in nine documents. This asserts that
every measurable claim in the prose matches the token source, that every
component the docs name is actually exported, that the agent rule files cover
the same ground, and that every `npm run …` they quote exists.

**What the static guards cannot see.** They read source text and token values.
They cannot tell that a correctly-tokenised colour is on the wrong element, or
that a layout is thin. Forty-four Playwright tests cover the runtime half:

| Suite | What it holds |
|---|---|
| `control-standards` | Button recipes in both modes, focus rings, invalid state, checked controls, rounded geometry, inverse-surface hover |
| `contrast` | Every rendered text node on every public route **and inside both editors**, measured against its real background |
| `contrast-pixels` | The same question answered from screenshots, so textures, dither columns and mid-animation frames are included |
| `composition` | Whether a surface carries the language at all, and whether it is distributed rather than confined to one decorated corner |
| `identity` | That a system's hue still appears wherever its name does |
| `critical-paths` | Horizontal overflow across seven widths, keyboard and mobile navigation |

Each of these carries a self-test proving it rejects the thing it claims to
catch. A guard that cannot fail is worth nothing.

**Rendered, not just compiled.** `npm run test:consumer` builds a real Vite +
React + Tailwind app against the packed tarball, renders it, and checks that the
documented setup actually produces styled components — then builds a second app
without the Tailwind line to prove it can tell the difference. That check found
a `style.css` comment whose `**/` closed the comment early and broke every
Tailwind 4 consumer build, and a documented `@source` path that silently
produced unstyled components.

**In a consumer project.** The gate ships with the package:

```bash
npx onganda-check src/        # check your own source against the same rules
npx onganda-check --contrast  # re-measure after retheming
```

A genuine exception is declared in the file and reviewed like any other code:

```tsx
// onganda-allow: rounded-geometry — native map control, not a brand surface
```

The pragma applies to the **next line only**. Never widen the allowlist to make
a check pass. Either use a role, add a named token with a stated purpose in §4,
or write the pragma with a reason.

### 8. Accessibility

- All pixel SVGs: `aria-hidden="true"` (decorative).
- All interactive pixel elements: explicit `aria-label`.
- 4.5:1 for text under 18.66px (or 14px bold); 3:1 for a control's visible
  boundary, a focus ring, and a status indicator. `npm run check:contrast`
  measures both against the role layer.
- The only roles below those floors are `textFaint`, `line`, and `lineStrong`.
  They are for disabled text, ordinals, and decorative dividers. Never put
  meaning in them.
- Colour is never the only carrier of state. An invalid field has a red border,
  a marker, and a message. A status mark has a label and a hairline ring.

---

## Quick-start file structure for a new project

```
src/
  main.tsx         ← import '@onganda/design-system/style.css' here
  App.tsx          ← wrap in <DarkProvider>
  pages/
    Home.tsx       ← compose from OngandaNav, OngandaHero, sections...
  components/
    MyCard.tsx     ← WeaveOverlay + PixelCornerMarks + roles(isDark)
    MyIcon.tsx     ← Px + <rect> only
```

Minimal working page:

```tsx
import { DarkProvider, OngandaFooter } from '@onganda/design-system';
import { OngandaNav, OngandaHero } from '@onganda/design-system/sites';
import '@onganda/design-system/style.css';

export default function Home() {
  return (
    <DarkProvider>
      <OngandaNav />
      <OngandaHero />
      <OngandaFooter />
    </DarkProvider>
  );
}
```
