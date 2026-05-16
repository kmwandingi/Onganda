# Onganda Design Guidelines

This document serves as the single source of truth for the design language of **Onganda** (Namibia AI Systems Lab). It codifies the visual, architectural, and cultural principles that define the project. Whenever adding new features, components, or systems to this project, adhere strictly to these guidelines to ensure consistency.

---

## 1. Introduction & Vision

**Onganda** is the project and public home of the Namibia AI Systems Lab. It represents sovereign AI infrastructure grounded in the Namibian context. **Okaanda** is one system inside that project: the granary, or model and data platform.

*   **The Vision**: To build and maintain AI tools (models, workflows, containers, interfaces, and applications) that are deeply aligned with Namibian culture, language, and needs.
*   **The Metaphor**: The architecture borrows from traditional Oshiwambo agricultural and domestic life. The systems process data the way a village processes grain: from storage (granary) to grinding (mill), to holding (vessel), to the surface where it is used (etiti), and finally to delivery (oshitoo).

---

## 2. Core Principles

The design of Onganda is governed by five unwavering principles (defined in `okaanda-tokens.ts`):

1.  **Language**: *Oshiwambo first. English second.*
    *   In UI and documentation, the primary name is always the Oshiwambo term, followed by the English translation for functional clarity.
2.  **Symbol**: *Pixel by default — icon, diagram, texture, mark.*
    *   All brand assets, iconography, and decorative textures must utilize pixel-art aesthetics.
3.  **Type**: *Non-pixel by default — body, reading, interface.*
    *   Text must remain clean, legible, and un-pixelated to ensure high usability for dense interfaces and long-form reading.
4.  **Palette**: *Millet, clay, bark, smoke, ochre, dried grass.*
    *   The colors are derived from earthy, natural materials found in Namibia.
5.  **Layout**: *Calm and editorial. Anthropic-level whitespace discipline.*
    *   Interfaces must avoid clutter. Use generous spacing (padding/margins) to let the pixel elements breathe.

---

## 3. Color Palette

The Onganda color palette is strictly defined. **Do not use generic Tailwind colors (e.g., `bg-red-500`, `text-blue-500`).** Always use the semantic tokens defined in `okaanda-tokens.ts`.

### Base & Backgrounds
*   **Millet Clay** (`#E8E1CF`): The primary light background. Used as the canvas for the `light` theme.
*   **Dust Light** (`#F3E8C3`): Lifted surfaces, secondary backgrounds in `light` theme.
*   **Char Black** (`#1E1A17`): The primary dark background. Warm, not pure black. Used as the canvas for the `dark` theme.
*   **Dark Card** (`#1C1713`) / **Dark Card Alt** (`#271F1A`): Used for elevated surfaces in the `dark` theme.

### Semantic Highlights & Accents
*   **Ochre Orange** (`#D9791F`): Warm accent, representing the **Okaanda** (Granary / Parent) system.
*   **Bark Rust** (`#8F3E21`): Support accent, representing the **Oshini** (Mill) system.
*   **Mahangu Gold** (`#DFAE2B`): Secondary highlight, representing the **Ombiga** (Vessel) system.
*   **Mopane Brown** (`#6A4B2E`): Support neutral, representing the **Etiti** (Surface) system.
*   **Dye Plum** (`#6F4A6E`): Rare accent, representing the **Oshitoo** (Delivery) system.
*   **Fired Red** (`#C84A1B`): Primary highlight for actionable or critical UI elements.

---

## 4. Typography & Layout

### Typography
*   **Font Families**: We use `Inter`, `Arial`, or standard sans-serif for body and headings. No pixel fonts for reading text.
*   **Hierarchy**: Use clear font weight distinctions. Avoid overly large fonts unless it's a major section heading.
*   **Contrast**: In dark mode, ensure text is legible against `Char Black`. Use `Millet Clay` for primary text. In light mode, use `Char Black` or variations with reduced opacity for primary text.

### Layout & Sizing
*   **Whitespace**: Use Tailwind spacing utilities aggressively (`p-8`, `px-12`, `mb-24`). Sections should have distinct breathing room.
*   **Borders**: Keep borders subtle and thin (`border-[#1E1A17]/10` in light mode, `border-[#E8E1CF]/10` in dark mode).

---

## 5. Iconography & Textures

### The Pixel Rule
All visual flair must be pixelated.
*   **Icons**: Icons must be drawn as pixel art, constrained to a grid, utilizing the semantic color associated with their system.
*   **Diagrams**: Use step-lines and blocky nodes rather than smooth curves.
*   **Corners**: **Stepped corners, not rounded**, for all brand assets. Avoid `rounded-lg` on major brand cards; instead, build stepped pseudo-elements or use sharp rectangles.

### Core Textures
*   **Dither & Checker Fills**: Use these for texture, not just decoration. They represent digital processing and raw material.
*   **Basket-Weave (`WEAVE`)**: Derived from Oshiwambo coil strands + stepped diamond patterns. Use the `WeaveOverlay` primitive to add depth to cards and hero sections. It comes in both `light` and `dark` variants.

---

## 6. System Architecture Hierarchy

Onganda is divided into five functional systems. Each system has a dedicated name, role, color, and tag. When building a feature, identify which system it belongs to and use the corresponding visual language.

1.  **Okaanda** (Granary)
    *   **Role**: Parent Institution, Model & Data Platform (Storage, repositories, datasets).
    *   **Color**: Ochre Orange (`#D9791F`)
    *   **Tag**: `01` or `ROOT`

2.  **Oshini** (Mill)
    *   **Role**: Adaptation Workflows (Fine-tuning, distillation, compression pipelines).
    *   **Color**: Bark Rust (`#8F3E21`)
    *   **Tag**: `02`

3.  **Ombiga** (Vessel)
    *   **Role**: Agents & Containers (Holding runtimes, agent memory, model containers).
    *   **Color**: Mahangu Gold (`#DFAE2B`)
    *   **Tag**: `03`

4.  **Etiti** (Surface)
    *   **Role**: Interfaces & Dashboards (User interfaces, read surfaces, workspaces).
    *   **Color**: Mopane Brown (`#6A4B2E`)
    *   **Tag**: `04`

5.  **Oshitoo** (Delivery)
    *   **Role**: Applications & Sector Products (Sector apps like healthcare, agriculture, education).
    *   **Color**: Dye Plum (`#6F4A6E`)
    *   **Tag**: `05`

---

## 7. Importable Design System Contract

The reusable design system now has a single internal import surface:

```tsx
import {
  COLOR,
  SYSTEMS,
  DarkContext,
  useDark,
  SectionHeader,
  SystemCard,
  PixelButton,
  IconSearch,
} from '@/components/generated/okaanda-design-system';
```

Use this barrel for new components unless you are editing one of the underlying design-system files directly. It re-exports:

1.  `okaanda-tokens.ts`: color constants, cultural system data, charts, publication formats, guide annotations, and TypeScript interfaces.
2.  `okaanda-primitives.tsx`: atomic Okaanda UI primitives such as pixel marks, dither bars, tags, overlays, cards, buttons, logo marks, and dark-mode context.
3.  `okaanda-icons.tsx`: pixel-art interface and system icons.
4.  `okaanda-sections.tsx`: composed page sections such as hero, navigation, diagrams, timelines, heatmaps, and icon showcase.
5.  `okaanda-publications.tsx`, `okaanda-document-editor.tsx`, and `okaanda-slide-editor.tsx`: larger product surfaces built on the same system.
6.  `NamibiaAISystemsHub.tsx`: the current full-page reference implementation.

### Reuse Status
This project is currently an **internal Vite React design system**, not a packaged npm library. Components can be imported inside this app through the `@/components/generated/okaanda-design-system` barrel. To reuse it in another repository, copy or package the `src/components/generated/` directory together with `src/index.css`, Tailwind/Vite configuration, and the runtime dependencies listed in `package.json` (`framer-motion`, `react`, `recharts`, etc.).

### Current Public Surfaces
The current app intentionally has multiple public surfaces:

*   `/`: selective public homepage for the current live posture.
*   `/systems`: concise public systems page.
*   `/contact`: selective inquiry page.
*   `/full`: fuller future-facing website version for later release.
*   `/showcase`: the existing design-system showcase and capability demo. Preserve this page as-is unless the task explicitly asks to change showcase behavior.

### Stability Tiers
*   **Stable foundation**: `COLOR`, `WEAVE`, `SYSTEMS`, `SWATCHES`, `PRINCIPLES`, `DarkContext`, `useDark`, `Px`, `PixelDot`, `DitherBar`, `DitherStrip`, `PixelTag`, `PixelButton`, `SectionHeader`, `WeaveOverlay`, `PixelCornerMarks`, `SystemCard`, `StatCard`, `SwatchChip`, and the icons in `okaanda-icons.tsx`.
*   **Reusable but page-shaped**: `OkaandaNav`, `OkaandaHero`, `ResearchSignals`, `SystemConnectionDiagram`, `PixelHeatmap`, `RoadmapTimeline`, `FieldApplications`, `PixelFlowchart`, `IconShowcase`, and `Publications`.
*   **Product shells**: `DocumentEditor` and `SlideEditor`. These are usable surfaces, but they are larger, stateful modules and should not be treated as small primitives.

---

## 8. Component Implementation Rules

### Working with `src/components/generated/`
The design system is implemented via modular files in the `generated` directory:
1.  `okaanda-design-system.ts`: Preferred import surface for new app code.
2.  `okaanda-tokens.ts`: **Do not hardcode new colors or constant data.** If you need a color or system definition, import `COLOR`, `SYSTEMS`, `SWATCHES`, or a typed data constant from this file through the barrel.
3.  `okaanda-primitives.tsx`: Base UI elements (section headers, dither strips, standard cards, overlays). When building a new page section, compose it using these primitives.
4.  `okaanda-sections.tsx`: Large, composed page sections (hero, timelines, heatmaps).
5.  `okaanda-icons.tsx`: All pixel-art SVG icons.

### Dark Mode Context
*   The application handles dark mode via the `DarkContext` provider (found in `okaanda-primitives.tsx`).
*   Always respect the `isDark` value from `useDark()` when applying inline styles for colors that are not perfectly mapped by Tailwind classes.
*   Example:
    ```tsx
    import { COLOR, useDark } from '@/components/generated/okaanda-design-system';

    const { isDark } = useDark();
    const bg = isDark ? COLOR.darkCard : COLOR.milletClay;
    ```

### Writing New Code
1.  **Surgical Changes**: Do not refactor whole files unless necessary. If adding a stat, add it to `STATS` in `okaanda-tokens.ts` rather than hardcoding HTML.
2.  **Minimalism**: Prefer elegant improvements over verbosity. If a piece of UI feels cluttered, you are violating the "Anthropic-level whitespace discipline" rule.
3.  **Comment Minimally**: Only document what is not obvious. Rely on the strong naming conventions provided by the Oshiwambo + English system roles.
4.  **No Generic Colors**: New code must not introduce generic Tailwind color classes or unrelated hex values. Use `COLOR`, existing data constants, or add a named semantic token first.
5.  **Sharp Brand Geometry**: Do not add rounded corners to brand cards, diagrams, icons, or major Onganda surfaces. Small utility controls may remain rectangular or stepped.

### Current Compliance Notes
The core design language is present and importable, but the repository still contains legacy generated code that predates the stricter token rule:

*   Several generated components hardcode approved Onganda palette values directly in JSX. Treat those as migration debt, not as a pattern to copy.
*   `DocumentEditor` and `SlideEditor` include additional light-surface variants for paper/editor canvases. These should be promoted into named tokens before further expansion.
*   `src/index.css` maps global Tailwind/shadcn-style variables to the Okaanda palette so generic utilities such as `bg-background`, `text-foreground`, and `border-border` remain brand-aligned.
*   `npm run lint` may report Fast Refresh warnings because some generated files export both components and constants. These warnings do not block use, but a future library extraction should split contexts/constants into separate files.

---
*Following these guidelines ensures that Onganda remains visually coherent, culturally grounded, and architecturally sound.*
