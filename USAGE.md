# Onganda Design System — Usage Guide

Pixel editorial design system for the Namibia AI Systems Lab. Earthy palette,
pixel-art SVG primitives, basket-weave textures, quiet mechanical motion.

---

## Installation

### From GitHub

```bash
npm install @onganda/design-system@github:kmwandingi/Onganda#main --force
```

Track `main` to always get the latest, in every `package.json` that carries
it (a monorepo usually has several):

```json
"@onganda/design-system": "github:kmwandingi/Onganda#main"
```

The lockfile freezes a git dependency at the commit it first resolved, so
`npm install` alone will not update it. Upgrade with
`npm install @onganda/design-system@github:kmwandingi/Onganda#main --force`,
then restart the dev server and clear `node_modules/.vite`. The installed
version names its commit (`2.0.0+<sha>`); compare it with
`git ls-remote https://github.com/kmwandingi/Onganda HEAD`. To hold a product
still instead, pin a commit (`#<sha>`) and move the pin deliberately. Read the
CHANGELOG's migration notes before crossing a major version. The package builds on install via
its `prepare` script, which is how the compiled layout utilities reach
`dist/package/style.css`; a stale `node_modules` serves an older build with no
warning. If an export or a style is missing, delete
`node_modules/@onganda/design-system` and reinstall before looking elsewhere.

### From the npm registry

Not published yet. GitHub is the distribution path; `npm install
@onganda/design-system` returns a 404 until the scoped package exists.

### Peer dependencies

Install these alongside the package if your project doesn't already have them:

```bash
npm install react react-dom framer-motion recharts
```

---

## Setup

### 1. Import the CSS token file

In your project's root entry file (e.g. `main.tsx`, `_app.tsx`, `layout.tsx`):

```ts
import '@onganda/design-system/style.css';
```

This gives you the CSS custom properties and the layout rules used by packaged
components:
- every colour role, in both modes — `--onganda-surface`, `--onganda-text-muted`,
  `--onganda-line`, `--onganda-action-bg` … (from `tokens.css`; **use these**)
- the type scale, space, texture, rules and geometry — `--onganda-type-eyebrow-size`,
  `--onganda-space-4`, `--onganda-texture-surface`, `--onganda-radius`
- `--type-hero`, `--type-hero-public`, `--type-hero-gap`, `--type-subhead`
- `--onganda-ochre-orange`, `--onganda-char-black`, etc. — the raw pigments,
  for a system's identity only. A surface, label, line or control reads its role.

### 2. Add to your Tailwind content path only when extending components

The package stylesheet includes the utilities used by its exported components,
so no Tailwind configuration is needed for them — not even an `@source` line.
Only if your own components copy utility classes out of the package source do
you need Tailwind to scan it:

**Tailwind v4** (path relative to the CSS file that contains it):
```css
@source "../node_modules/@onganda/design-system/dist/package";
```

**Tailwind v3** (`tailwind.config.js`):
```js
module.exports = {
  content: [
    // ... your existing paths
    './node_modules/@onganda/design-system/dist/package/**/*.{js,cjs}',
  ],
};
```

### 3. Wrap your app in the dark-mode provider

```tsx
import { DarkProvider } from '@onganda/design-system';

function App() {
  return (
    <DarkProvider>
      {/* your app */}
    </DarkProvider>
  );
}
```

---

## Supported imports

Use the package root or `/core` for tokens, primitives, and icons. Import larger features through their named paths:

```ts
import { COLOR, PixelButton } from '@onganda/design-system';
import { ChartGallery } from '@onganda/design-system/charts';
import { DocumentEditor, SlideEditor } from '@onganda/design-system/editors';
import { AiAuthoringPanel } from '@onganda/design-system/ai';
import { OngandaMap } from '@onganda/design-system/maps';
import { OngandaPublicSite } from '@onganda/design-system/sites';
```

The package root retains the complete version 1.x surface for compatibility.

Map consumers must also load the Leaflet base styles once:

```ts
import '@onganda/design-system/maps.css';
```

## Compatibility import list

```ts
import {
  // Tokens
  COLOR,
  WEAVE,
  SYSTEMS,
  TIMELINE_PHASES,
  FLOW_NODES,
  HEATMAP_CELLS,
  SECTOR_APPS,

  // Primitives
  Px,
  PixelDot,
  DitherBar,
  DitherStrip,
  WeaveOverlay,
  PixelCornerMarks,
  PixelTag,
  PixelArrowDown,
  SectionHeader,
  PixelButton,
  SystemCard,
  StatCard,

  // System icons
  IconOkaanda,
  IconOshini,
  IconOmbiga,
  IconEtiti,
  IconOshitoo,
  OngandaLogoMark,
  systemIconForName,

  // Charts
  ChartGallery,

  // Page sections
  OngandaNav,
  OngandaHero,
  SystemConnectionDiagram,
  PixelHeatmap,
  RoadmapTimeline,
  FieldApplications,
  PixelFlowchart,
  IconShowcase,
  Publications,

  // Block renderer
  DocBlockDisplay,
  BlockRenderer,

  // AI authoring
  AiAuthoringPanel,
  regenerateDocBlock,

  // Editor shells
  DocumentEditor,
  SlideEditor,
  SlideInspector,

  // Dark mode context
  DarkContext,
  useDark,
} from '@onganda/design-system';
```

---

## Examples

### Pixel dot accent
```tsx
import { PixelDot, COLOR } from '@onganda/design-system';

<PixelDot color={COLOR.ochreOrange} size={5} />
```

### Divider
```tsx
import { DitherBar, roles } from '@onganda/design-system';

// A solid hairline. The dotted rule is retired; most blocks need no divider.
<DitherBar color={roles(isDark).line} opacity={1} />
```

### A card
```tsx
import { PixelPanel, PixelTag, accentFor } from '@onganda/design-system';

// Flat, like the site's cards: surface, hairline, corner marks in its accent.
// Texture belongs to the page ground, not the card.
<PixelPanel accent={accentFor(0)} eyebrow="System" title="Okaanda — Granary">
  <PixelTag hex={accentFor(0)} label="01" />
</PixelPanel>
```

### Section header
```tsx
import { SectionHeader } from '@onganda/design-system';

<SectionHeader label="System Architecture" headline="Five tools. One workshop." />
```

### Pixel icon
```tsx
import { IconOkaanda } from '@onganda/design-system';

<IconOkaanda size={48} />
```

### System icon by name
```tsx
import { systemIconForName } from '@onganda/design-system';

const Icon = systemIconForName('Okaanda');
<Icon size={32} />
```

### Pixel SVG icon (custom)
```tsx
import { Px, COLOR } from '@onganda/design-system';

const MyIcon = ({ size = 48 }: { size?: number }) => (
  <Px size={size}>
    {/* Draw on a 24×24 integer grid with <rect> only */}
    <rect x="11" y="1" width="2" height="1" fill={COLOR.ochreOrange} />
    <rect x="10" y="2" width="4" height="1" fill={COLOR.ochreOrange} />
    {/* Ground shadow */}
    <rect x="7" y="21" width="10" height="1" fill={COLOR.charBlack} fillOpacity="0.18" />
  </Px>
);
```

### Dark mode and colour roles
```tsx
import { useDark, roles, PixelButton } from '@onganda/design-system';

function MyComponent() {
  const { isDark, toggle } = useDark();
  const c = roles(isDark);

  return (
    <div style={{ background: c.surface, color: c.text }}>
      <PixelButton variant="ghost" isDark={isDark} onClick={toggle}>Toggle dark mode</PixelButton>
    </div>
  );
}
```

`roles(isDark)` resolves every colour for the current mode, so a component never
branches on `isDark` per colour. `COLOR` says what a colour *is*; a role says
where it may be *used*. See `DESIGN_SYSTEM.md` §4.

### Forms
```tsx
import { PixelField, PixelInput, PixelSelect, PixelCheckbox, PixelRadio, PixelToggle, PixelButton } from '@onganda/design-system';

<PixelField label="Email" hint="We reply within two days." htmlFor="email">
  <PixelInput id="email" type="email" placeholder="name@institution.na" />
</PixelField>

{/* PixelField runs the message at full contrast with a red marker beside it —
    fired red as text is 3.6:1, and colour is never the only signal. */}
<PixelField label="Organisation" error="This field is required." htmlFor="org">
  <PixelInput id="org" invalid />
</PixelField>

<PixelRadio name="kind" label="Pilot programme" checked={kind === 'pilot'} onChange={() => setKind('pilot')} />
<PixelCheckbox label="Send me lab updates" checked={sub} onChange={e => setSub(e.currentTarget.checked)} />
<PixelToggle label="Publish" checked={live} onChange={setLive} />

<PixelButton variant="primary" onClick={submit}>Send</PixelButton>
```

Never hand-roll a control. Every field shares one recipe: transparent ground,
1px border, `borderRadius: 0`, ochre on focus, fired red when `invalid`.

### Composing a page section
```tsx
import { SystemConnectionDiagram } from '@onganda/design-system/sites';

// Default data (full five-system diagram)
<SystemConnectionDiagram />

// Custom data
<SystemConnectionDiagram nodes={myNodes} edges={myEdges} />
```

### AI authoring panel
```tsx
import { AiAuthoringPanel } from '@onganda/design-system/ai';

<AiAuthoringPanel
  mode="document"
  isDark={false}
  onResult={(result) => {
    // result.blocks — array of DocBlock
    // result.slides — array of AiSlide
    console.log(result);
  }}
/>
```

### Document editor
```tsx
import { DocumentEditor } from '@onganda/design-system/editors';
import '@onganda/design-system/style.css';

<DocumentEditor />
```

### Slide editor
```tsx
import { SlideEditor } from '@onganda/design-system/editors';
import '@onganda/design-system/style.css';

<SlideEditor />
```

---

## Color palette reference

| Token           | Hex       | Role                        |
|-----------------|-----------|-----------------------------|
| `milletClay`    | `#E8E1CF` | Light mode canvas           |
| `dustLight`     | `#F3E8C3` | Lifted surface / paper      |
| `mahanguGold`   | `#DFAE2B` | Secondary highlight         |
| `ochreOrange`   | `#D9791F` | Primary accent / CTA        |
| `firedRed`      | `#C84A1B` | Actionable / critical       |
| `barkRust`      | `#8F3E21` | Support accent              |
| `mopaneBrown`   | `#6A4B2E` | Support neutral             |
| `charBlack`     | `#1E1A17` | Ink; inverse surfaces       |
| `dyePlum`       | `#6F4A6E` | Rare accent                 |
| `darkCard`      | `#1C1713` | Elevated dark surface       |
| `darkCardAlt`   | `#271F1A` | Alt elevated dark surface   |

---

## Design rules

1. **Style from `roles(isDark)`** — not from the raw palette. Being in `COLOR` does not make a token available for any purpose.
2. **The primary action is ochre, the accent mahangu gold** — never a black primary. **Ochre is a fill**, with char black on it. As ink on a light surface it is 2.4:1 — read `accentInk` (bark rust in light, ochre in dark) for links, focus rings, and ghost hover.
3. **Fired red is an indicator only** — status marks and invalid borders. Never behind small text, never error-message text.
4. **System colours mean membership.** Mahangu gold, mopane brown, and dye plum identify Ombiga, Etiti, and Oshitoo. They reach chrome only through roles.
5. **The palette has no green and no blue.** Read status through `statusFor(name, isDark)`.
6. **Colour is never the only carrier of state** — pair it with a marker, a label, or a message.
7. **Never hand-roll a control** — use `PixelButton`, `PixelInput`, `PixelTextarea`, `PixelSelect`, `PixelField`, `PixelCheckbox`, `PixelRadio`, `PixelToggle`. One primary per view. A control on an inverse surface takes `isDark`.
8. **No `border-radius` anywhere** — use `PixelCornerMarks` for corner decoration.
9. **No Tailwind generic colors, no raw hex, no `rgba()`** in components. All three fail `npm run check:design`.
10. **Pixel icons use `<rect>` only** — no `<path>`, `<circle>`, `<ellipse>`.
11. **Motion: spread `MOTION` presets** — tween entrances, `y:-2` hover lift, `scale:0.97` tap. Never spring.
12. **Typography: Inter/Arial everywhere** — no pixel fonts for reading text.

Check your own project against these rules with `npx onganda-check src/`.

The full specification is `DESIGN_SYSTEM.md` §4 (Color Roles) and §5 (Controls).
The `/showcase` **Control Standards** section renders every control in every state.

---

## Package exports

```
dist/
  index.js         — ESM bundle (tree-shakable)
  index.cjs        — CommonJS bundle
  index.d.ts       — TypeScript declarations entry
  style.css        — Design token CSS custom properties
  index.js.map     — Source map (ESM)
  index.cjs.map    — Source map (CJS)
  design-system/   — Individual .d.ts files
  components/      — Individual .d.ts files per component
```

Import the CSS token file once:
```ts
import '@onganda/design-system/style.css';   // via 'style.css' export
// or
import '@onganda/design-system/style';       // via 'style' export
```
