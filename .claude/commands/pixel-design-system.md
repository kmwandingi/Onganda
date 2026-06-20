# Pixel Design System Skill
# Usage: /pixel-design-system [describe what you're building]
#
# Invoke this command whenever you are starting a new UI project that should
# inherit the Onganda/Namibia-AI pixel design language, or when you need to
# add a section, icon, card, or texture to an existing project that uses it.
# Claude will apply every rule below without being reminded.

---

## What this style is

A **sovereign-African pixel editorial** design system. The aesthetic borrows
from traditional craft (Oshiwambo basket weave, earthen pottery, granary
architecture) and expresses it through pixel-art SVG primitives, a strict
earthy palette, sharp geometry, and quiet mechanical motion. Typography stays
completely clean — pixels are reserved for brand marks, icons, textures, and
decorative accents only.

The two governing rules that everything else flows from:
- **Pixel by default** for icons, diagrams, textures, marks.
- **Non-pixel by default** for body copy, headings, reading interfaces.

---

## Color palette — exact hex values, no substitutions

```ts
export const COLOR = {
  milletClay:   '#E8E1CF',  // Primary light background (warm parchment)
  dustLight:    '#F3E8C3',  // Lifted surface / paper in light mode
  mahanguGold:  '#DFAE2B',  // Secondary highlight (mahangu grain)
  ochreOrange:  '#D9791F',  // Primary warm accent / CTA
  firedRed:     '#C84A1B',  // Actionable / critical highlight
  barkRust:     '#8F3E21',  // Support accent
  mopaneBrown:  '#6A4B2E',  // Support neutral
  charBlack:    '#1E1A17',  // Primary dark background (warm, not pure black)
  dyePlum:      '#6F4A6E',  // Rare accent
  darkBg:       '#120F0D',  // Deepest dark
  darkCard:     '#1C1713',  // Elevated dark surface
  darkCardAlt:  '#271F1A',  // Alt elevated dark surface
} as const;
```

**Rules:**
- Never use Tailwind generic palette classes (`text-blue-500`, `bg-red-400`).
- Never hardcode raw hex values in component files — always import `COLOR`.
- `milletClay` is the light canvas. `charBlack` is the dark canvas.
- Borders: `rgba(30,26,23,0.10)` in light mode, `rgba(232,225,207,0.10)` in dark.
- Muted text: `rgba(30,26,23,0.45)` light, `rgba(232,225,207,0.40)` dark.

---

## Pixel SVG icons — the core technique

Every icon is drawn on a **24×24 integer grid** using only `<rect>` elements.
No `<path>`, no `<circle>`, no `<ellipse>`, no curves. Each rect uses integer
`x`, `y`, `width`, `height` values. Use `fillOpacity` for shading/shadow.

```tsx
// Wrapper — always use this; never raw <svg>
const Px = ({ children, size = 48, viewBox = '0 0 24 24' }) => (
  <svg width={size} height={size} viewBox={viewBox}
       fill="none" stroke="none"
       xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    {children}
  </svg>
);

// Example: a pixel granary icon
const IconGranary = ({ size = 48 }) => (
  <Px size={size}>
    {/* Roof peak */}
    <rect x="11" y="1" width="2" height="1" fill="#D9791F" />
    <rect x="10" y="2" width="4" height="1" fill="#D9791F" />
    <rect x="9"  y="3" width="6" height="1" fill="#D9791F" />
    {/* Eave line */}
    <rect x="8"  y="4" width="8" height="1" fill="#C84A1B" />
    <rect x="7"  y="5" width="10" height="1" fill="#8F3E21" />
    {/* Body */}
    <rect x="8"  y="6" width="8" height="8" fill="#D9791F" />
    {/* Side shading */}
    <rect x="8"  y="6" width="1" height="8" fill="#C84A1B" />
    <rect x="15" y="6" width="1" height="8" fill="#C84A1B" />
    {/* Texture dots — use fillOpacity for depth */}
    <rect x="10" y="7"  width="1" height="1" fill="#8F3E21" fillOpacity="0.6" />
    <rect x="13" y="8"  width="1" height="1" fill="#8F3E21" fillOpacity="0.6" />
    {/* Ground shadow */}
    <rect x="7"  y="21" width="10" height="1" fill="#1E1A17" fillOpacity="0.18" />
  </Px>
);
```

**Icon rules:**
- Work on the 24×24 grid. Most objects fill rows 1–22; leave row 0 and 23 as margin.
- Use the system's semantic color as the dominant fill.
- Add a darker shade (one step down the palette) for left/right walls and eaves.
- Add a 1×1 rect at y=21 or y=22 in `charBlack` at 0.12–0.20 opacity for ground shadow.
- Use `fillOpacity` 0.25–0.65 for texture marks, never full opacity on decorative pixels.
- Icons accept a single `size` prop. Default 48. Never hardcode size at the call site.

---

## DitherBar — horizontal pixel-dither accent

```tsx
const DitherBar = ({
  color,
  segments = 24,
  height = 4,
  opacity = 0.55,
}) => (
  <div aria-hidden="true" style={{ display: 'flex', height }}>
    {Array.from({ length: segments }, (_, k) => (
      <div key={k} style={{
        flex: 1,
        height: '100%',
        background: k % 2 === 0 ? color : 'transparent',
        opacity,
      }} />
    ))}
  </div>
);
```

Use as section dividers, block separators, and decorative accents.
Standard usage: `<DitherBar color={COLOR.ochreOrange} segments={48} height={3} opacity={0.35} />`

---

## DitherStrip — SVG micro-dither (section headers)

```tsx
const DitherStrip = ({ color = '#D9791F', opacity = 0.18 }) => (
  <svg width={64} height={64} viewBox="0 0 16 4" fill="none" aria-hidden="true">
    {[0,2,4,6,8,10,12,14].map(x => <rect key={x}    x={x} y="0" width="1" height="1" fill={color} fillOpacity={opacity * 2} />)}
    {[1,3,5,7,9,11,13].map(x =>   <rect key={x+20}  x={x} y="2" width="1" height="1" fill={color} fillOpacity={opacity} />)}
    {[0,4,8,12].map(x =>           <rect key={x+40}  x={x} y="3" width="1" height="1" fill={color} fillOpacity={opacity * 0.5} />)}
  </svg>
);
```

---

## WeaveOverlay — Oshiwambo basket-weave texture

A layered SVG background-image: ellipse strands + stepped diamond pattern.
Place as `position: absolute; inset: 0; pointer-events: none` inside a
`position: relative` parent. Opacity 0.03–0.07 for subtlety.

```tsx
const STRAND_LIGHT = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='18' height='10'%3E%3Cellipse cx='2' cy='5' rx='4.5' ry='2.8' fill='%231E1A17'/%3E%3Cellipse cx='11' cy='5' rx='4.5' ry='2.8' fill='%231E1A17'/%3E%3C/svg%3E")`;
const DIAMOND_LIGHT = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='64' height='64'%3E%3Crect x='30' y='18' width='4' height='4' fill='%231E1A17'/%3E%3Crect x='26' y='22' width='4' height='4' fill='%231E1A17'/%3E%3Crect x='34' y='22' width='4' height='4' fill='%231E1A17'/%3E%3Crect x='22' y='26' width='4' height='12' fill='%231E1A17'/%3E%3Crect x='38' y='26' width='4' height='12' fill='%231E1A17'/%3E%3Crect x='26' y='38' width='4' height='4' fill='%231E1A17'/%3E%3Crect x='34' y='38' width='4' height='4' fill='%231E1A17'/%3E%3Crect x='30' y='42' width='4' height='4' fill='%231E1A17'/%3E%3C/svg%3E")`;

// Combined:
const weaveStyle = {
  backgroundImage: `${DIAMOND_LIGHT}, ${STRAND_LIGHT}`,
  backgroundSize: '64px 64px, 18px 10px',
};

const WeaveOverlay = ({ opacity = 0.045 }) => (
  <div aria-hidden="true" style={{
    position: 'absolute', inset: 0, pointerEvents: 'none',
    ...weaveStyle,
    opacity,
  }} />
);
```

---

## PixelDot — single square pixel mark

```tsx
const PixelDot = ({ color, size = 4, opacity = 1 }) => (
  <div aria-hidden="true" style={{
    width: size, height: size,
    background: color,
    opacity,
    flexShrink: 0,
  }} />
);
```

Use in bullet lists, stat rows, and list item accents.

---

## PixelCornerMarks — stepped corner accents on cards

```tsx
// Place inside a `position: relative` parent
const PixelCornerMarks = ({ hex, size = 10 }) => (
  <>
    <div aria-hidden="true" style={{ position:'absolute', top:0, left:0,  width:size, height:size, background:hex }} />
    <div aria-hidden="true" style={{ position:'absolute', top:0, right:0, width:size, height:size, background:hex }} />
    <div aria-hidden="true" style={{ position:'absolute', bottom:0, left:0,  width:size, height:size, background:hex, opacity:0.5 }} />
    <div aria-hidden="true" style={{ position:'absolute', bottom:0, right:0, width:size, height:size, background:hex, opacity:0.5 }} />
  </>
);
```

---

## PixelTag — small coloured badge

```tsx
const PixelTag = ({ hex, label }) => (
  <div style={{
    padding: '2px 6px',
    fontSize: 9,
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '0.18em',
    background: hex,
    color: hex === '#DFAE2B' ? '#1E1A17' : '#F3E8C3',  // dark text on gold only
  }}>
    {label}
  </div>
);
```

---

## Typography

- Font family: **Inter, Arial, sans-serif** for all reading text and UI.
- **No pixel fonts** for body copy or headings. Ever.
- Hero scale: `clamp(3.2rem, 10vw, 9rem)` — use a CSS custom property `--type-hero`.
- Subhead: `clamp(0.82rem, 1.3vw, 0.95rem)` — `--type-subhead`.
- Letter spacing on labels: `0.12em`–`0.18em`. On body: 0 or `0.01em`.
- Section labels: 11–12px, `font-weight: 700`, `text-transform: uppercase`, `letter-spacing: 0.15em`, muted color.

```css
:root {
  --type-hero:        clamp(3.2rem, 10vw, 9rem);
  --type-hero-public: clamp(3rem, 7.4vw, 7.1rem);
  --type-hero-gap:    clamp(0.22rem, 0.65vw, 0.55rem);
  --type-subhead:     clamp(0.82rem, 1.3vw, 0.95rem);
}
```

---

## Card and geometry rules

- **No `border-radius`** on brand cards, system cards, or major containers.
- Corner decoration: use `PixelCornerMarks` instead of rounded corners.
- Borders: 1px, always use semantic opacity (`rgba(30,26,23,0.10)` light).
- Cards have subtle box-shadow: `0 8px 48px rgba(30,26,23,0.10)` in light mode.
- `position: relative; overflow: hidden` on cards so `WeaveOverlay` clips correctly.

---

## Motion — Framer Motion patterns

```tsx
// Section entrance
<motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }}
            transition={{ duration:0.5 }} />

// Staggered list
<motion.div variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
            initial="hidden" animate="visible">
  {items.map(i => (
    <motion.div key={i} variants={{ hidden:{opacity:0,y:12}, visible:{opacity:1,y:0} }}
                transition={{ duration:0.35 }} />
  ))}
</motion.div>

// Card hover lift (not bounce)
<motion.div whileHover={{ y:-2 }} transition={{ type:'tween', duration:0.15 }} />

// Button tap compression
<motion.button whileTap={{ scale:0.97 }} />
```

**Motion rules:**
- Quiet and mechanical. No spring, no bounce, no float.
- Entrance: `opacity 0→1`, `y 12→0` or `y 20→0`, duration 0.35–0.5s.
- Hover: `y: -2` max lift. Never `scale` on hover for cards.
- Tap: `scale: 0.97` compression, `whileTap` only.
- Stagger children: `0.06s`–`0.10s`. Never faster than 0.05s (looks cheap).
- Ticker/marquee: slow and continuous, `duration: 28`–`40`, `ease: 'linear'`, `repeat: Infinity`.

---

## SectionHeader — consistent section labelling

```tsx
const SectionHeader = ({ label, headline, isDark = false }) => (
  <div style={{ borderBottom: `1px solid ${isDark ? 'rgba(232,225,207,0.08)' : 'rgba(30,26,23,0.10)'}`,
                paddingBottom: 24, marginBottom: 48 }}>
    <p style={{ fontSize: 11, fontWeight: 700, textTransform:'uppercase',
                letterSpacing:'0.15em', marginBottom: 8,
                color: isDark ? 'rgba(232,225,207,0.38)' : 'rgba(30,26,23,0.45)' }}>
      {label}
    </p>
    <p style={{ fontSize: 26, fontWeight: 500, letterSpacing:'-0.01em',
                color: isDark ? '#E8E1CF' : '#1E1A17' }}>
      {headline}
    </p>
  </div>
);
```

---

## Dark mode

Manage with React context, not Tailwind `dark:` classes.

```tsx
const DarkContext = React.createContext({ isDark: false, toggle: () => {} });
const useDark = () => React.useContext(DarkContext);

// Pattern in every component:
const { isDark } = useDark();
const bg  = isDark ? COLOR.darkCard  : COLOR.dustLight;
const fg  = isDark ? COLOR.milletClay : COLOR.charBlack;
const muted = isDark ? 'rgba(232,225,207,0.40)' : 'rgba(30,26,23,0.45)';
```

---

## Animated dither columns (hero accent)

```tsx
// Five columns of slowly cycling color squares
const DITHER_COLS = [
  { colors: ['#D9791F','#C84A1B','#D9791F','#8F3E21','#1E1A17','#D9791F','#DFAE2B','#C84A1B'], delay: 0 },
  { colors: ['#8F3E21','#D9791F','#1E1A17','#C84A1B','#DFAE2B','#8F3E21','#D9791F','#1E1A17'], delay: 0.4 },
  // ...more columns
];

// Each column: absolute-positioned, animates y slowly, opacity ~0.55
<motion.div animate={{ y: ['0%', '-50%'] }}
            transition={{ duration: 18, ease: 'linear', repeat: Infinity, delay: col.delay }}
            style={{ position:'absolute', display:'flex', flexDirection:'column' }}>
  {[...col.colors, ...col.colors].map((c, i) => (
    <div key={i} style={{ width: 6, height: 6, background: c, marginBottom: 2 }} />
  ))}
</motion.div>
```

---

## Pixel flowchart / step-line diagrams

Connections between nodes use step-lines (horizontal then vertical, 90° turns),
never smooth bezier curves. Draw using SVG `<polyline>` with `strokeLinejoin="miter"`.

```tsx
<svg style={{ position:'absolute', inset:0, pointerEvents:'none' }}>
  <polyline
    points="120,40 120,80 240,80 240,120"
    stroke="#D9791F" strokeWidth="1.5" fill="none"
    strokeOpacity="0.45" strokeLinejoin="miter"
  />
</svg>
```

Node boxes: sharp rectangles, `PixelCornerMarks`, small `PixelTag` badge.

---

## What NOT to do

- No `border-radius` on brand elements (buttons may have `borderRadius:2` max).
- No `oklch`, no CSS variable color functions from Tailwind v4 on palette values.
- No generic icon libraries (Heroicons, Lucide, etc.) for system/brand icons.
- No smooth SVG paths for icons — rects only.
- No springy motion (`type: 'spring'`) for section entrances.
- No semi-transparent color overlays using Tailwind utilities (`bg-orange-500/30`).
- No font sizes set in `vw` alone — always `clamp()`.

---

## Quick-start checklist when starting a new project with this style

1. Define `COLOR` object with all 11 tokens.
2. Define `WEAVE` with light/dark SVG background-image strings.
3. Build `Px`, `PixelDot`, `DitherBar`, `WeaveOverlay`, `PixelCornerMarks`, `PixelTag`.
4. Add `--type-hero` / `--type-subhead` CSS custom properties to `:root`.
5. Set up `DarkContext` provider.
6. Draw first icon on 24×24 grid with only `<rect>` elements.
7. Build `SectionHeader` with bottom border + label/headline pattern.
8. Verify: no Tailwind generic colors, no border-radius on brand cards, no smooth SVG paths in icons.
