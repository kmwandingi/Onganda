# Onganda Design System — Usage Guide

Pixel editorial design system for the Namibia AI Systems Lab. Earthy palette,
pixel-art SVG primitives, basket-weave textures, quiet mechanical motion.

---

## Installation

### From GitHub (current)

```bash
npm install github:kmwandingi/Onganda
```

### From npm (when published)

```bash
npm install @onganda/design-system
```

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

This gives you the CSS custom properties:
- `--type-hero`, `--type-hero-public`, `--type-hero-gap`, `--type-subhead`
- `--onganda-ochre-orange`, `--onganda-char-black`, etc. (full palette as CSS vars)

### 2. Add to your Tailwind content path (if using Tailwind)

The design-system components use Tailwind utility classes. Add the library to
your Tailwind content path so those utilities are included in your CSS output.

**Tailwind v4** (`tailwind.css` or `@tailwindcss/vite` config):
```css
@source "../../node_modules/@onganda/design-system/dist/index.js";
```

**Tailwind v3** (`tailwind.config.js`):
```js
module.exports = {
  content: [
    // ... your existing paths
    './node_modules/@onganda/design-system/dist/index.js',
  ],
};
```

### 3. Wrap your app in the dark-mode provider

```tsx
import { DarkContext } from '@onganda/design-system';
import { useState } from 'react';

function App() {
  const [isDark, setIsDark] = useState(false);
  return (
    <DarkContext.Provider value={{ isDark, toggle: () => setIsDark(d => !d) }}>
      {/* your app */}
    </DarkContext.Provider>
  );
}
```

---

## Core imports

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

### Dither bar divider
```tsx
import { DitherBar, COLOR } from '@onganda/design-system';

<DitherBar color={COLOR.ochreOrange} segments={48} height={3} opacity={0.35} />
```

### Card with basket-weave texture and corner marks
```tsx
import { WeaveOverlay, PixelCornerMarks, PixelTag, COLOR } from '@onganda/design-system';

<div style={{ position: 'relative', overflow: 'hidden', background: COLOR.dustLight, padding: 32 }}>
  <WeaveOverlay opacity={0.045} />
  <PixelCornerMarks hex={COLOR.ochreOrange} size={10} />
  <PixelTag hex={COLOR.ochreOrange} label="01" />
  <p style={{ color: COLOR.charBlack }}>Okaanda — Granary</p>
</div>
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

### Dark mode
```tsx
import { useDark, COLOR } from '@onganda/design-system';

function MyComponent() {
  const { isDark, toggle } = useDark();
  const bg = isDark ? COLOR.darkCard : COLOR.dustLight;
  const fg = isDark ? COLOR.milletClay : COLOR.charBlack;

  return (
    <div style={{ background: bg, color: fg }}>
      <button onClick={toggle}>Toggle dark mode</button>
    </div>
  );
}
```

### Composing a page section
```tsx
import { SystemConnectionDiagram, DIAGRAM_NODES, CONNECTION_EDGES } from '@onganda/design-system';

// Default data (full five-system diagram)
<SystemConnectionDiagram />

// Custom data
<SystemConnectionDiagram nodes={myNodes} edges={myEdges} />
```

### AI authoring panel
```tsx
import { AiAuthoringPanel } from '@onganda/design-system';

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
import { DocumentEditor } from '@onganda/design-system';
import '@onganda/design-system/style.css';

<DocumentEditor />
```

### Slide editor
```tsx
import { SlideEditor } from '@onganda/design-system';
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
| `charBlack`     | `#1E1A17` | Dark mode canvas (warm)     |
| `dyePlum`       | `#6F4A6E` | Rare accent                 |
| `darkCard`      | `#1C1713` | Elevated dark surface       |
| `darkCardAlt`   | `#271F1A` | Alt elevated dark surface   |

---

## Design rules

1. **No `border-radius` on brand cards** — use `PixelCornerMarks` instead.
2. **No Tailwind generic colors** — use `COLOR.*` tokens always.
3. **Pixel icons use `<rect>` only** — no `<path>`, `<circle>`, `<ellipse>`.
4. **Inline `style={}` for colors** — never `className="text-orange-500"`.
5. **Motion: tween entrances, not spring** — `y:-2` hover lift, `scale:0.97` tap.
6. **Typography: Inter/Arial everywhere** — no pixel fonts for reading text.

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
