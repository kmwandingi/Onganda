# Windsurf Rules — Pixel Editorial Design System
# Save this as `.windsurfrules` at the root of a project that uses this style.
# Windsurf reads this file and applies it as persistent context for Cascade.

---

## Identity

This project uses the **Pixel Editorial** design system — a visual language
derived from Namibian craft traditions (Oshiwambo basket weave, earthenware,
granary architecture) expressed through pixel-art SVG primitives, a strict
earthy palette, sharp geometry, and quiet mechanical motion.

Two rules govern every decision:

- **Pixel by default** — icons, diagrams, textures, decorative marks, and
  corner accents must be pixel art (integer-grid SVG rects, alternating dither
  strips, basket-weave CSS backgrounds).
- **Non-pixel by default** — body copy, headings, labels, and reading
  interfaces use clean Inter/Arial. No pixel fonts for text. Ever.

---

## Color system

Cascade must never introduce a color that isn't in the table below or derived
from it via `rgba()` opacity. No Tailwind generic palette classes. No new hex
values in component files.

| Token         | Hex       | Role                              |
|---------------|-----------|-----------------------------------|
| milletClay    | #E8E1CF   | Light mode canvas                 |
| dustLight     | #F3E8C3   | Lifted surface / paper            |
| mahanguGold   | #DFAE2B   | Secondary highlight               |
| ochreOrange   | #D9791F   | Primary warm accent / CTA         |
| firedRed      | #C84A1B   | Actionable / critical             |
| barkRust      | #8F3E21   | Support accent                    |
| mopaneBrown   | #6A4B2E   | Support neutral                   |
| charBlack     | #1E1A17   | Warm dark — dark mode canvas      |
| dyePlum       | #6F4A6E   | Rare accent                       |
| darkCard      | #1C1713   | Elevated dark surface             |
| darkCardAlt   | #271F1A   | Alt elevated dark surface         |

Standard derived values (always inline `rgba`, never Tailwind):
- Light border: `rgba(30,26,23,0.10)`
- Dark border: `rgba(232,225,207,0.10)`
- Light muted: `rgba(30,26,23,0.45)`
- Dark muted: `rgba(232,225,207,0.40)`

---

## Pixel SVG icons

All icons are SVG elements on a **24×24 integer grid** using only `<rect>`.
No `<path>`, `<circle>`, `<ellipse>`, or `<line>`.

```tsx
// Required wrapper
const Px = ({ children, size = 48, viewBox = '0 0 24 24' }) => (
  <svg width={size} height={size} viewBox={viewBox}
       fill="none" stroke="none" xmlns="http://www.w3.org/2000/svg"
       aria-hidden="true">
    {children}
  </svg>
);

// Every icon: single size prop, default 48
const MyIcon = ({ size = 48 }: { size?: number }) => (
  <Px size={size}>
    {/* rects only — integer coords — fillOpacity for shading */}
    <rect x="11" y="1" width="2" height="1" fill="#D9791F" />
    {/* ground shadow at y=21 */}
    <rect x="7" y="21" width="10" height="1" fill="#1E1A17" fillOpacity="0.18" />
  </Px>
);
```

Icon construction rules Cascade must follow:
1. Plan the icon silhouette first, then fill each row with rects.
2. Use the semantic system color as the dominant fill.
3. Darken left/right walls by one palette step (e.g., `barkRust` under `ochreOrange`).
4. Add texture/detail dots at 0.25–0.65 `fillOpacity` — never full opacity.
5. End with a ground shadow rect at y=21, `fill="#1E1A17"`, `fillOpacity="0.15"`.
6. Never use more than 35 rects for a single icon (keeps it pixel-sparse, not muddy).

---

## DitherBar

```tsx
const DitherBar = ({ color, segments=24, height=4, opacity=0.55 }) => (
  <div aria-hidden="true" style={{ display:'flex', height }}>
    {Array.from({ length:segments }, (_,k) => (
      <div key={k} style={{ flex:1, height:'100%',
        background: k%2===0 ? color : 'transparent', opacity }} />
    ))}
  </div>
);
```

Standard call: `segments={48}`, `height={3}`, `opacity={0.35}`, color `ochreOrange`.

---

## WeaveOverlay

CSS background-image composite of a stepped-diamond SVG and an ellipse-strand SVG.
Parent container must have `position:relative; overflow:hidden`.

```tsx
// Light mode — strands and diamonds in charBlack
const WEAVE_LIGHT_STRAND   = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='18' height='10'%3E%3Cellipse cx='2' cy='5' rx='4.5' ry='2.8' fill='%231E1A17'/%3E%3Cellipse cx='11' cy='5' rx='4.5' ry='2.8' fill='%231E1A17'/%3E%3C/svg%3E")`;
const WEAVE_LIGHT_DIAMOND  = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='64' height='64'%3E%3Crect x='30' y='18' width='4' height='4' fill='%231E1A17'/%3E%3Crect x='26' y='22' width='4' height='4' fill='%231E1A17'/%3E%3Crect x='34' y='22' width='4' height='4' fill='%231E1A17'/%3E%3Crect x='22' y='26' width='4' height='12' fill='%231E1A17'/%3E%3Crect x='38' y='26' width='4' height='12' fill='%231E1A17'/%3E%3Crect x='26' y='38' width='4' height='4' fill='%231E1A17'/%3E%3Crect x='34' y='38' width='4' height='4' fill='%231E1A17'/%3E%3Crect x='30' y='42' width='4' height='4' fill='%231E1A17'/%3E%3C/svg%3E")`;

const WeaveOverlay = ({ isDark=false, opacity=0.045 }) => (
  <div aria-hidden="true" style={{
    position:'absolute', inset:0, pointerEvents:'none',
    backgroundImage: `${isDark ? WEAVE_DARK_DIAMOND : WEAVE_LIGHT_DIAMOND}, ${isDark ? WEAVE_DARK_STRAND : WEAVE_LIGHT_STRAND}`,
    backgroundSize: '64px 64px, 18px 10px',
    opacity,
  }} />
);
```

---

## PixelDot, PixelCornerMarks, PixelTag

```tsx
// Square pixel mark
const PixelDot = ({ color, size=4, opacity=1 }) => (
  <div aria-hidden="true" style={{ width:size, height:size, background:color, opacity, flexShrink:0 }} />
);

// Four corner squares (inside a position:relative parent)
const PixelCornerMarks = ({ hex, size=10 }) => (
  <>
    <div aria-hidden="true" style={{ position:'absolute', top:0, left:0,    width:size, height:size, background:hex }} />
    <div aria-hidden="true" style={{ position:'absolute', top:0, right:0,   width:size, height:size, background:hex }} />
    <div aria-hidden="true" style={{ position:'absolute', bottom:0, left:0,  width:size, height:size, background:hex, opacity:0.5 }} />
    <div aria-hidden="true" style={{ position:'absolute', bottom:0, right:0, width:size, height:size, background:hex, opacity:0.5 }} />
  </>
);

// Small coloured badge label
const PixelTag = ({ hex, label }) => (
  <div style={{
    padding:'2px 6px', fontSize:9, fontWeight:700,
    textTransform:'uppercase', letterSpacing:'0.18em',
    background:hex,
    color: hex === '#DFAE2B' ? '#1E1A17' : '#F3E8C3',
  }}>
    {label}
  </div>
);
```

---

## Typography

| Context        | Size                        | Weight | Tracking       | Font           |
|----------------|-----------------------------|--------|----------------|----------------|
| Hero headline  | `var(--type-hero)` (clamp)  | 500    | -0.01em        | Inter, Arial   |
| Section label  | 11px                        | 700    | 0.15em         | Inter, Arial   |
| Body copy      | 15–16px                     | 400    | 0              | Inter, Arial   |
| Small label    | 9–11px                      | 600    | 0.10–0.18em    | Inter, Arial   |
| Monospace      | 12–13px                     | 400    | 0.04em         | monospace      |

CSS custom properties Cascade must add to `:root`:
```css
--type-hero:        clamp(3.2rem, 10vw, 9rem);
--type-hero-public: clamp(3rem, 7.4vw, 7.1rem);
--type-hero-gap:    clamp(0.22rem, 0.65vw, 0.55rem);
--type-subhead:     clamp(0.82rem, 1.3vw, 0.95rem);
```

---

## Card and layout rules

- `border-radius: 0` on all brand cards and system cards. No exceptions.
- Use `PixelCornerMarks` for visual corner treatment instead of rounded corners.
- Borders: 1px, always `rgba()` opacity — never Tailwind `border-*` utilities.
- Cards: `position:relative; overflow:hidden` to contain WeaveOverlay.
- Box shadow light: `0 8px 48px rgba(30,26,23,0.10)`.
- Whitespace: generous. Sections get 80–96px vertical padding. Items get 24–32px gap.

---

## Motion

Cascade uses Framer Motion. Rules:

| Pattern        | Values                                                      |
|----------------|-------------------------------------------------------------|
| Entrance       | `initial={{opacity:0,y:20}}` → `animate={{opacity:1,y:0}}` `duration:0.5` |
| List stagger   | `staggerChildren:0.08`, child `y:12→0`, `duration:0.35`   |
| Card hover     | `whileHover={{y:-2}}` `type:'tween'` `duration:0.15`       |
| Button tap     | `whileTap={{scale:0.97}}`                                   |
| Ticker         | `animate={{x:['0%','-50%']}}` `duration:32` `ease:'linear'` `repeat:Infinity` |

Never use `type:'spring'` for section entrances. Never use `scale` on card hover.
Motion must feel quiet and mechanical, not bouncy or generic.

---

## Step-line diagrams

Connection lines between nodes use 90° polylines, not bezier curves.

```tsx
<polyline
  points="120,40 120,80 240,80 240,120"
  stroke="#D9791F" strokeWidth="1.5"
  fill="none" strokeOpacity="0.45" strokeLinejoin="miter"
/>
```

---

## Prohibited patterns — Cascade must refuse or auto-correct

| Prohibited                                         | Correct replacement                          |
|----------------------------------------------------|----------------------------------------------|
| `border-radius` > 2px on brand/system card         | `border-radius:0` + `PixelCornerMarks`       |
| `text-blue-500`, `bg-orange-400` (Tailwind generic) | `color: COLOR.ochreOrange` inline style      |
| `<path>` in a pixel icon                           | Only `<rect>` on integer grid                |
| Hardcoded hex in JSX component                     | Import from `COLOR` constant                 |
| `type:'spring'` on section entrance                | `type:'tween'`, `duration:0.5`               |
| `font-size` in `vw` alone                          | `clamp()` with min/max bounds                |
| Generic icon library (Lucide, Heroicons)           | Custom `<Px>` icons with rect-only shapes    |
| `oklch(...)` or CSS color functions on palette     | Direct hex from COLOR constant               |
| `border-gray-200`, `border-slate-300`              | `rgba(30,26,23,0.10)` inline                 |
| `rounded-lg`, `rounded-xl` on card                 | Remove; add `PixelCornerMarks` if needed     |

---

## Quick-start file structure

When initialising a new project with this system, create:

```
src/
  tokens/
    colors.ts        ← COLOR, WEAVE constant definitions
  primitives/
    Px.tsx           ← SVG wrapper
    PixelDot.tsx
    DitherBar.tsx
    WeaveOverlay.tsx
    PixelCornerMarks.tsx
    PixelTag.tsx
    SectionHeader.tsx
  icons/
    IconGranary.tsx   ← one file per icon using Px + rects
    IconMill.tsx
    ...
  index.css          ← :root { --type-hero: ... } variables
```

Import convention: always barrel-export everything through a single
`design-system.ts` so components `import { COLOR, DitherBar, PixelDot } from '@/design-system'`.

---

## Style in one sentence

**Sharp, earthy, editorial, pixel-detailed, quietly animated.**
Every surface should feel like a hand-crafted instrument — precise, purposeful,
and grounded in material culture, not generic SaaS defaults.
