# Onganda Design System

**Pixel editorial design system for the Namibia AI Systems Lab.**
Earthy palette, pixel-art SVG primitives, basket-weave textures, quiet mechanical motion.

---

## Table of Contents

1. [Installation](#1-installation)
2. [Project Setup](#2-project-setup)
3. [Color Tokens](#3-color-tokens)
4. [Content & Data Tokens](#4-content--data-tokens)
5. [Atomic Primitives](#5-atomic-primitives)
6. [System Icons](#6-system-icons)
7. [Interface Icons](#7-interface-icons)
8. [Charts](#8-charts)
9. [Page Sections](#9-page-sections)
10. [Block System](#10-block-system)
11. [AI Authoring](#11-ai-authoring)
12. [Editor Shells](#12-editor-shells)
13. [TypeScript Types](#13-typescript-types)
14. [Design Rules](#14-design-rules)

---

## 1. Installation

### From GitHub

```bash
npm install github:kmwandingi/Onganda
```

### When published to npm

```bash
npm install @onganda/design-system
```

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

### Step 2 — Add to Tailwind content (if using Tailwind)

The components use Tailwind utility classes. Add the library's bundle to your
content scan so those utilities are generated.

**Tailwind v4** (in your CSS file):
```css
@source "../../node_modules/@onganda/design-system/dist/index.js";
```

**Tailwind v3** (`tailwind.config.js`):
```js
module.exports = {
  content: [
    './src/**/*.{ts,tsx}',
    './node_modules/@onganda/design-system/dist/index.js',
  ],
};
```

### Step 3 — Wrap your app in DarkContext

All design-system components read dark mode via React context.

```tsx
import { DarkContext } from '@onganda/design-system';
import { useState } from 'react';

function Root() {
  const [isDark, setIsDark] = useState(false);

  return (
    <DarkContext.Provider value={{ isDark, toggle: () => setIsDark(d => !d) }}>
      <App />
    </DarkContext.Provider>
  );
}
```

Read the current mode in any component:

```tsx
import { useDark, COLOR } from '@onganda/design-system';

function MyComponent() {
  const { isDark, toggle } = useDark();
  const bg = isDark ? COLOR.darkCard : COLOR.dustLight;
  const fg = isDark ? COLOR.milletClay : COLOR.charBlack;

  return <div style={{ background: bg, color: fg }}>…</div>;
}
```

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
| `ochreOrange`   | `#D9791F` | Ochre Orange   | Primary warm accent / CTA     |
| `firedRed`      | `#C84A1B` | Fired Red      | Actionable / critical         |
| `barkRust`      | `#8F3E21` | Bark Rust      | Support accent                |
| `mopaneBrown`   | `#6A4B2E` | Mopane Brown   | Support neutral               |
| `charBlack`     | `#1E1A17` | Char Black     | Dark mode canvas (warm)       |
| `dyePlum`       | `#6F4A6E` | Dye Plum       | Rare accent                   |
| `darkBg`        | `#120F0D` | Dark BG        | Deepest dark                  |
| `darkCard`      | `#1C1713` | Dark Card      | Elevated dark surface         |
| `darkCardAlt`   | `#271F1A` | Dark Card Alt  | Alt elevated dark surface     |

**Standard opacity patterns (use `rgba`, not Tailwind utilities):**

```ts
// Light mode
const borderLight  = 'rgba(30,26,23,0.10)';
const mutedLight   = 'rgba(30,26,23,0.45)';
const bodyLight    = 'rgba(30,26,23,0.82)';

// Dark mode
const borderDark   = 'rgba(232,225,207,0.10)';
const mutedDark    = 'rgba(232,225,207,0.40)';
const bodyDark     = 'rgba(232,225,207,0.78)';
```

### WEAVE — basket-weave texture

```ts
import { WEAVE } from '@onganda/design-system';

// WEAVE.light  — charBlack ellipse strands + stepped diamond
// WEAVE.dark   — milletClay ellipse strands + stepped diamond
// WEAVE.size   — '64px 64px, 18px 10px'
```

Used directly by `WeaveOverlay`. You rarely need to apply `WEAVE` manually.

---

## 4. Content & Data Tokens

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

## 5. Atomic Primitives

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

### DitherBar — horizontal alternating-pixel divider

```tsx
import { DitherBar, COLOR } from '@onganda/design-system';

<DitherBar
  color={COLOR.ochreOrange}
  segments={48}
  height={3}
  opacity={0.35}
/>
```

Props: `color`, `segments` (default `24`), `height` (default `4`), `opacity` (default `0.55`).
Standard usage: `segments={48}` `height={3}` `opacity={0.35}`.

---

### DitherStrip — SVG micro-dither accent

```tsx
import { DitherStrip, COLOR } from '@onganda/design-system';

<DitherStrip color={COLOR.ochreOrange} opacity={0.18} />
```

Used inside `SectionHeader`. Renders a 3-row stepped dither pattern as a 64×64 SVG.

---

### WeaveOverlay — Oshiwambo basket-weave texture

Must be inside a `position: relative; overflow: hidden` parent.

```tsx
import { WeaveOverlay } from '@onganda/design-system';

<div style={{ position: 'relative', overflow: 'hidden', background: '#F3E8C3' }}>
  <WeaveOverlay isDark={false} opacity={0.045} />
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

Props: `label`, `headline`, `isDark` (default `false`).
Renders: small uppercase label above a 26px headline, separated by a subtle bottom border.

---

### PixelButton — primary and ghost button

```tsx
import { PixelButton } from '@onganda/design-system';

<PixelButton variant="primary" onClick={() => {}}>
  Get started
</PixelButton>

<PixelButton variant="ghost" href="https://example.com">
  Learn more
</PixelButton>
```

Props: `variant` (`'primary'` | `'ghost'`, default `'primary'`), `onClick`, `href`, `className`.
Pass `href` to render an `<a>` tag instead of `<button>`.

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

Full dark footer with system links, pixel dither strips, and the Onganda logo mark.

---

## 6. System Icons

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

## 7. Interface Icons

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

## 8. Charts

```tsx
import { ChartGallery } from '@onganda/design-system';

<ChartGallery isDark={false} />
```

A composed showcase of all chart types using Recharts and the Onganda palette:
bar, line, area, pie, radar, scatter, treemap, funnel, radial bar, and composed charts.

All chart colours derive from `COLOR` — no hardcoded hex in chart code.

---

## 9. Page Sections

Ready-to-use composed page sections. Drop them directly into a page layout.

### Navigation

```tsx
import { OngandaNav } from '@onganda/design-system';

<OngandaNav />
```

Fixed top navigation with logo, system links, and dark mode toggle placeholder.

---

### Hero

```tsx
import { OngandaHero } from '@onganda/design-system';

<OngandaHero />
```

Full-width hero with animated dither columns, headline at `--type-hero` scale,
system ticker strip, and CTA buttons.

---

### System Connection Diagram

Animated SVG network diagram of the five AI systems with step-line connections,
tooltip overlays, and node highlights.

```tsx
import { SystemConnectionDiagram, DIAGRAM_NODES, CONNECTION_EDGES } from '@onganda/design-system';

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
import { PixelHeatmap, HEATMAP_CELLS, HEATMAP_LABELS_X, HEATMAP_LABELS_Y } from '@onganda/design-system';

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
import { RoadmapTimeline, TIMELINE_PHASES } from '@onganda/design-system';

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
import { FieldApplications } from '@onganda/design-system';

<FieldApplications />
```

---

### Pixel Flowchart

Step-line data-pipeline diagram with animated flow nodes.

```tsx
import { PixelFlowchart } from '@onganda/design-system';

<PixelFlowchart />
```

---

### Research Signals

Horizontal stat bar with headline metrics.

```tsx
import { ResearchSignals } from '@onganda/design-system';

<ResearchSignals />
```

---

### Icon Showcase

Grid display of all interface icons with labels.

```tsx
import { IconShowcase } from '@onganda/design-system';

<IconShowcase />
```

---

### Publications

Publications and media mentions section.

```tsx
import { Publications } from '@onganda/design-system';

<Publications isDark={false} />
```

---

## 10. Block System

The block system powers the document and slide editors. Use it if you are building
document-like content surfaces.

### Block types

```ts
import type { DocBlock, DocBlockType } from '@onganda/design-system';
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
import { DocBlockDisplay, BlockRenderer } from '@onganda/design-system';

// Read-only display
<DocBlockDisplay block={myBlock} isDark={false} idx={0} />

// Context-aware renderer
<BlockRenderer block={myBlock} context="document" isDark={false} idx={0} />
```

`BlockRenderer` handles: `divider` → `DitherBar`, `signature` → logo + text,
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
} from '@onganda/design-system';
```

### Export API types

```ts
import type {
  DocumentExportPayload,
  DeckExportPayload,
  DocumentExportFormat,   // 'PDF' | 'WORD'
  DeckExportFormat,       // 'PDF' | 'PPT'
} from '@onganda/design-system';
```

---

## 11. AI Authoring

Drop-in panel that connects to any OpenAI-compatible endpoint and generates
document blocks or slide decks.

```tsx
import { AiAuthoringPanel } from '@onganda/design-system';

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
import { regenerateDocBlock } from '@onganda/design-system';
import type { AiGeneratableDocBlockType } from '@onganda/design-system';

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

## 12. Editor Shells

Full stateful product surfaces. Drop them into any page — they manage their own
state internally via `localStorage`.

### Document Editor

```tsx
import { DocumentEditor } from '@onganda/design-system';

<DocumentEditor />
```

Block-based document editor with: drag-to-reorder, inline text editing,
18 insertable block types, export to PDF/Word, undo/redo, AI authoring rail,
per-block regeneration.

---

### Slide Editor

```tsx
import { SlideEditor } from '@onganda/design-system';

<SlideEditor />
```

Canvas-based presentation editor with: 47 droppable components, free positioning,
multi-slide deck management, slide inspector panel, export to PDF/PPT, AI authoring.

---

### Slide Inspector (standalone)

```tsx
import { SlideInspector } from '@onganda/design-system';
import type { DroppedBlock, SlideEntry } from '@onganda/design-system';

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

## 13. TypeScript Types

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

## 14. Design Rules

These constraints define the aesthetic. Follow them in any project that builds
on this system.

### 1. Pixel / type split

| Element | Rule |
|---|---|
| Icons, diagrams, marks, textures | Pixel art — `<rect>` on integer grid |
| Body copy, headings, labels | Clean Inter/Arial — no pixel fonts |

### 2. Color

- Always use `COLOR.*` tokens — never raw hex in component code.
- Never use Tailwind generic colors (`text-blue-500`, `bg-orange-400`).
- Border opacity: `rgba(30,26,23,0.10)` light / `rgba(232,225,207,0.10)` dark.
- Muted text: `rgba(30,26,23,0.45)` light / `rgba(232,225,207,0.40)` dark.

### 3. Card geometry

- `border-radius: 0` on all brand and system cards. No rounded corners.
- Use `PixelCornerMarks` for corner decoration instead.
- Cards need `position: relative; overflow: hidden` to contain `WeaveOverlay`.

### 4. Motion (Framer Motion)

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

Use CSS custom properties, not bare `clamp()` or hardcoded `vw`:

```css
font-size: var(--type-hero);         /* hero headline */
font-size: var(--type-hero-public);  /* public page hero */
font-size: var(--type-subhead);      /* subheadline */
```

### 7. Accessibility

- All pixel SVGs: `aria-hidden="true"` (decorative).
- All interactive pixel elements: explicit `aria-label`.
- Minimum contrast ratio 4.5:1 for body text against its background.

---

## Quick-start file structure for a new project

```
src/
  main.tsx         ← import '@onganda/design-system/style.css' here
  App.tsx          ← wrap in <DarkContext.Provider>
  pages/
    Home.tsx       ← compose from OngandaNav, OngandaHero, sections...
  components/
    MyCard.tsx     ← WeaveOverlay + PixelCornerMarks + COLOR tokens
    MyIcon.tsx     ← Px + <rect> only
```

Minimal working page:

```tsx
import { DarkContext, OngandaNav, OngandaHero, OngandaFooter } from '@onganda/design-system';
import '@onganda/design-system/style.css';
import { useState } from 'react';

export default function Home() {
  const [isDark, setIsDark] = useState(false);
  return (
    <DarkContext.Provider value={{ isDark, toggle: () => setIsDark(d => !d) }}>
      <OngandaNav />
      <OngandaHero />
      <OngandaFooter />
    </DarkContext.Provider>
  );
}
```
