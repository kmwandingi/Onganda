# Onganda Design Guidelines

This document serves as the single source of truth for the design language of **Onganda** (Namibia AI Systems Lab). It codifies the visual, architectural, and cultural principles that define the project. Whenever adding new features, components, or systems to this project, adhere strictly to these guidelines to ensure consistency.


> **This is a closed system.** Everything permitted is in
> [`tokens/onganda.tokens.json`](./tokens/onganda.tokens.json) — every colour,
> type step, spacing value, border width and motion value. **Anything not in
> that file is not Onganda and is not acceptable**, in code or in design.
> There is no corner radius, no blurred shadow and no second typeface. The
> Onganda palette has no green and no blue; a product that needs other hues
> chooses another shipped palette whole, never a hex at a time. If the system lacks something you need, extend the system — see
> [FOR_DESIGNERS.md](./FOR_DESIGNERS.md) and `DESIGN_GUIDELINES.md` §3.
> `npm run check:design` fails on every violation.

---

## 1. Introduction & Vision

**Onganda** is the project and public home of the Namibia AI Systems Lab. It represents sovereign AI infrastructure grounded in the Namibian context. **Okaanda** is one system inside that project: the granary, or model and data platform.

*   **The Vision**: To build and maintain AI tools (models, workflows, containers, interfaces, and applications) that are deeply aligned with Namibian culture, language, and needs.
*   **The Metaphor**: The architecture borrows from traditional Oshiwambo agricultural and domestic life. The systems process data the way a village processes grain: from storage (granary) to grinding (mill), to holding (vessel), to the surface where it is used (etiti), and finally to delivery (oshitoo).

---

## 2. Core Principles

The design of Onganda is governed by five unwavering principles (defined in `onganda-tokens.ts`):

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

The Onganda color palette is strictly defined. **Do not use generic Tailwind colors (e.g., `bg-red-500`, `text-blue-500`).** Always use the semantic tokens defined in `onganda-tokens.ts`.

### Base & Backgrounds
*   **Millet Clay** (`#E8E1CF`): The primary light background. Used as the canvas for the `light` theme.
*   **Dust Light** (`#F3E8C3`): Lifted surfaces, secondary backgrounds in `light` theme.
*   **Char Black** (`#1E1A17`): The brand ink — text, lines, and the inverse band (footer, ticker, lab card). Warm, not pure black. Not the primary action fill.
*   **Dark Card** (`#1C1713`) / **Dark Card Alt** (`#271F1A`): Used for elevated surfaces in the `dark` theme.

### Semantic Highlights & Accents
*   **Ochre Orange** (`#D9791F`): The primary action fill and the checked-control fill; also **Okaanda** (Granary / Parent).
*   **Bark Rust** (`#8F3E21`): Support accent, representing the **Oshini** (Mill) system.
*   **Mahangu Gold** (`#DFAE2B`): Secondary highlight — the accent action fill; also **Ombiga** (Vessel).
*   **Mopane Brown** (`#6A4B2E`): Support neutral, representing the **Etiti** (Surface) system.
*   **Dye Plum** (`#6F4A6E`): Rare accent, representing the **Oshitoo** (Delivery) system.
*   **Fired Red** (`#C84A1B`): Critical indicator — status marks, invalid borders, the danger button's edge.

### The palette is an inventory, not a permission

Being in the palette does not make a colour available for any purpose. Each token
has a role, and the role is the rule. `DESIGN_SYSTEM.md` §4 holds the full table;
`COLOR_POLICY` in `onganda-roles.ts` holds the same table in code.

**Style from roles, not from the palette:**

```tsx
import { roles, useDark } from '@onganda/design-system';

const { isDark } = useDark();
const c = roles(isDark);

<div style={{ background: c.surface, color: c.text, border: `1px solid ${c.line}` }} />
```

The colour rules, all measured and all enforced by `npm run check:design`:

1.  **The primary action is ochre, not black.** A black primary made every
    screen read as a black slab with some cream around it — the heaviest thing
    on the page was chrome. `primary` fills with ochre (char black label,
    5.52:1, bark rust edge); `accent` fills with mahangu gold (8.41:1, mopane
    edge); `danger` fills with bark rust (fired red edge). A fill under 3:1
    against the surface always carries an edge that clears it. Char black is
    ink and the inverse band, never the primary fill.
2.  **Ochre Orange works as a fill, not as ink on light.** Millet clay
    on ochre is 2.4:1 and ochre on millet clay is 2.4:1. Ochre works as a
    **fill** with Char Black on it (5.5:1) and as **ink** on dark surfaces
    (6.1:1). On light surfaces the accent ink is **Bark Rust** (5.6:1) — the
    deep ochre. That is what `accentInk` and `focusRing` resolve to in light mode.
3.  **Fired Red is an indicator, not a fill behind text.** Its best foreground
    reaches 4.05:1, under the 4.5:1 floor. Use it for critical status marks and
    invalid field borders, where the 3:1 non-text threshold applies. The danger
    button fills with Bark Rust. Error message text runs at full contrast with a
    red marker beside it.
4.  **System colours mean membership when a component picks them.** Mahangu
    Gold, Mopane Brown, and Dye Plum identify Ombiga, Etiti, and Oshitoo; Bark
    Rust identifies Oshini. They reach interface chrome only through measured
    roles — gold is the accent fill, mopane and plum are hover fills, bark rust
    is the accent ink and the danger fill. A component never binds one to a
    `background` or `border*` directly; the check fails when it does.
5.  **Text and lines are brand ink at a fixed opacity, not new hues.** Use the
    steps in `ALPHA`, which is mode-aware. Only `textFaint`, `line`, and
    `lineStrong` sit below the contrast floors, and they are reserved for
    disabled text, ordinals, and decorative dividers.
6.  **The Onganda palette has no green and no blue, and none may be added to
    it.** A product that needs other hues chooses another palette (see
    "Palettes" below). The four status colours are `active` (ochre), `caution`
    (gold), `critical` (fired red), and `settled` (mopane brown) in Onganda,
    and the same four slots in every palette. Read them through
    `statusFor(name, isDark)` — mopane brown drops to 2.25:1 on a dark card.
7.  **Colour is never the only carrier of state.** An invalid field has a red
    border, a marker, and a message. A status mark has a text label and a
    hairline ring.
8.  **A control on an inverse surface takes the dark role set.** The footer, the
    ticker, and the black lab card are locally dark. Pass `isDark` to controls
    sitting on them, or their hover resolves against the wrong background.

### Palettes

A palette is the set of pigments the roles are built from: `onganda` (the
default, warm earth), `coast` (cool fog and signal amber, for security,
infrastructure and data tools) and `etosha` (salt pan, acacia and sun, for
education and public services). The roles, and every rule in this document,
are the same in all three; only the pigments change. A product chooses one in a
single file with `selectPalette()` from `@onganda/design-system/palettes`,
imported before anything else. `DESIGN_SYSTEM.md` §4 has the details.

### Adding a colour

Almost never the right move. A product that wants different hues chooses or
defines a palette; it never adds a hex to a component. To change the system's
own pigments:

1.  Name the palette slot it fills (`Palette` in `onganda-palettes.ts`), or
    the role that no slot covers.
2.  Measure it against both surfaces in both modes: 4.5:1 for text, 3:1 for a
    boundary or indicator. `npm run check:contrast -- --table` measures every
    palette and shows the format.
3.  Change the palette in `onganda-palettes.ts`. `COLOR`, the roles, the CSS
    variables and the token export are all built from it, and the guard reads
    the permitted pigments from the same file — no separate allowlist to
    update, and no way for them to drift.
4.  Record its allowed and forbidden uses in `DESIGN_SYSTEM.md` §4 and
    `COLOR_POLICY`.

---

## 4. Controls

Every interactive element has one recipe. A control does not choose its own
colours. `/showcase` renders all of them in every state under **Control
Standards**; that section is the reference, and `DESIGN_SYSTEM.md` §5 is the spec.

### Never hand-roll a control

If the system has a primitive, use it. A hand-written `<button>` or `<input>`
with inline colours is the single most common way this design system drifts: the
same "primary button" ends up three different colours on three pages.

| Need | Use | Not |
|---|---|---|
| Any button or CTA | `PixelButton` | `<button>` with an inline `background` |
| Compact icon action | `PixelIconButton` | A full text button around an icon |
| Text entry | `PixelInput` | `<input>` with an inline `border` |
| Long text | `PixelTextarea` | `<textarea>` |
| Fixed choice from a list | `PixelSelect` | `<select>` |
| Label, hint, error | `PixelField` | a hand-written `<label>` + `<span>` |
| One of several options | `PixelRadio` | a native radio |
| Independent on/off | `PixelCheckbox` | a native checkbox |
| Instant-effect on/off | `PixelToggle` | a switch library |

### Choosing a button

| Variant | When |
|---|---|
| `primary` | The one main action in a view. Exactly one per view. |
| `accent` | An action inside a card that already sits on the page's primary. |
| `ghost` | The quiet alternative standing next to a primary. |
| `danger` | It destroys something. Never twice in one dialog. |

Danger fills with Bark Rust rather than Fired Red: fired red's best foreground
is 4.05:1, under the floor for a 14px button label. Fired red stays the critical
status and border colour.

A control on an inverse surface — the footer, the ticker, the black lab card —
must be passed `isDark`, or its hover resolves against the wrong background and
the control can disappear into the card.

Pass `href` to render an anchor; the styling is identical either way. Every
button carries `MOTION.tap`. No button scales on hover.

### Field states

Transparent ground, 1px `fieldBorder`, `borderRadius: 0`, `accentInk` on focus,
fired red when `invalid`. Pass `invalid` and let `PixelField` render the message
— it sets `aria-invalid` and `role="alert"`, runs the text at full contrast, and
puts the red in a marker beside it. Do not colour an error state by hand.

### Choice controls

Checked is `controlOn` (ochre) on checkbox, radio, and toggle alike, so "on"
reads the same everywhere. The ochre fill is 2.56:1 against dust light, so
`controlOnBorder` carries the boundary. The radio is a stepped octagon with a square core,
because the pixel system has no curves. The toggle knob steps between two cells;
it does not slide.

### Utility controls

Tab chips, filter buttons, mode toggles, and canvas tools are deliberately not
`PixelButton`. They follow the ghost recipe at a smaller scale: transparent
ground, `line` border, `text` label, `focusRing` when active or focused. They
never take a system colour and never take a fill other than `surface` or
`controlOn`.

### Adding a control

A new control is a change to the system, not to a page:

1.  Build it in `onganda-primitives.tsx` reading `roles(isDark)`.
2.  Give it every state: rest, hover, focus, active, disabled, and invalid where
    it applies.
3.  Add it to the **Control Standards** section of `/showcase` in every state,
    and verify it in both modes with that section's own light/dark switch.
4.  Specify it in `DESIGN_SYSTEM.md` §5 and in the table above.
5.  Run `npm run check:design`, then extend
    `tests/browser/control-standards.spec.ts` to assert its colours at runtime.

A control that is not on `/showcase` does not exist yet.

---

## 5. Composition

Every other rule in this document is a prohibition. An agent can satisfy all of
them by building a few bordered cards and a button, and the result passes every
check while looking nothing like Onganda.

This section is the positive half: **what a finished Onganda surface actually
contains.** `tests/browser/composition.spec.ts` enforces it.

### A surface is not finished until it has all of these

| Ingredient | What it means | Where it comes from |
|---|---|---|
| **Editorial rhythm** | A small uppercase tracked label above a headline, on every major section | `SectionHeader` |
| **Texture** | At least one ground or inverse panel carrying the basket-weave | `WeaveOverlay` at a `TEXTURE` step (0.026 · 0.035 · 0.055) |
| **Pixel marks** | Dots, tags, or stepped corner accents — the system's punctuation | `PixelDot`, `PixelTag`, `PixelCornerMarks` |
| **Pixel iconography** | Icons drawn as `<rect>` on an integer grid | `Icon*`, `systemIconForName`, `createPixelIcon` |
| **An inverse band** | The black-card language somewhere on the page | `c.inverse`, and `isDark` on its controls |
| **Real motion** | Entrance, hover and tap that actually move | `MOTION` presets |
| **System controls** | Every button and field from the primitives | §4 |
| **Generous space** | Sections breathe; nothing is cramped | `SPACE` scale |

A page that renders correct colours and none of the above is a failure, even
though the token and contrast guards pass.

### Use the whole vocabulary, not the safe corner of it

The most common failure is timidity: an agent uses `roles()` and `PixelButton`,
avoids everything else, and ships a generic layout in Onganda colours. Before
calling a surface done, ask which of these it could legitimately carry:

- A **ticker** or marquee band for live signals.
- A **step-line diagram** for anything with relationships — no bezier curves.
- A **heatmap** or **flowchart** for density and process.
- A **terminal or code surface** where the product is technical.
- A **map** where place matters.
- A **chart** from `CHART_SERIES` where there is data.
- The **five system identities** where content belongs to one of them.
- An **empty**, **loading**, and **error** state for every surface that loads.

Not every page needs every one. Every page needs more than cards and buttons.

### Look at the reference screenshots

`reference/` holds every primitive and pattern as the showcase renders it,
with [`reference/INDEX.md`](./reference/INDEX.md) saying what each one shows.
Regenerate with `npm run reference`.

**Look at them before you build a surface, and again after.** Everything else
in this document says what is forbidden. A surface can satisfy every rule here
and still be flat, because the rules cannot describe how much colour a page
carries or how the weights sit together. The screenshots can.

**Copy the right kind of reference.** `product-surface.png` is an app screen;
the `site-*` shots are public pages; most of the rest are editorial
specimens. A tool built by copying editorial devices is the most common way a
product comes out as a cheap imitation.

When your surface is built, put a screenshot of it beside the closest
reference and ask what is different. Measured on real products, it is almost
always one of these:

| Symptom | Cause | Fix |
|---|---|---|
| Confetti: tags and chips in many colours | Colour spent on metadata, which carries no identity | Omit `hex`; the tag renders neutral |
| Every surface decorated, nothing stands out | Every card at feature weight | One or two `feature` surfaces; the rest `emphasis="quiet"` |
| A tool that looks like a landing page | Editorial devices transplanted: ticker, stat band, edge strips | Keep them on public pages |
| A wall of warnings | `PixelNotice` used as the page body | State the condition once; notices are for exceptions |
| Every card the same colour in a list of peers | `accent` never passed | `<PixelPeers>` around them, or `accentFor(i, isDark)` — for peers only |
| Muddy, tiring page | Texture on the ground *and* on every card | `TEXTURE`, and never stack it |
| A dead control shouts | A disabled fill is still a fill | Disabled takes the disabled roles |

### Colour means identity or state

A palette has nine pigments and a page is not better for using more of them.
Colour in this system says something: which system, which peer, which state.
Spent anywhere else it becomes noise that a reader tries and fails to decode.

- **Peers in a list** — cards in a feed, blocks in a section — take successive
  accents, the site's own order. Put them in a `PixelPeers` and it is done for
  you; by hand it is `accentFor(i, isDark)`. That is the one place colour is
  distributed on purpose.
- **Metadata** — counts, durations, sizes, file types — is neutral. A
  `PixelTag` without `hex` renders outlined in ink.
- **State** reads through `statusFor()`, and always with a label.
- **Identity** comes from `SYSTEM_COLOR` on Onganda's own pages, where the
  five hues *are* the five systems: there, do not rotate them across items a
  reader could mistake for those systems. In any other product the hues are
  simply the palette's accents, and peers take `accentFor(i, isDark)`.

An earlier version of this section said only "distribute colour", and a
product applied it to a row of metadata chips: seven tags, five colours, no
meaning. The rule is not "use more colours". It is "let colour carry meaning,
and only there".

### Hierarchy: one or two feature surfaces

`PixelPanel` has two weights. `feature` — corner marks in its accent — is for the
surface the user came to work on. `quiet` — surface and hairline — is for
everything they work *in*: sidebars, inspectors, export bars, transcripts.

```tsx
<PixelPanel eyebrow="Moments" title="Three proposals">…</PixelPanel>   {/* the work */}
<PixelPanel emphasis="quiet" eyebrow="Export" title="TikTok">…</PixelPanel>  {/* chrome */}
```

The decoration is correct on every one of them; spread evenly it stops
meaning anything. The showcase's own Product Patterns sit on one stage for
the same reason.

### Texture and rules have scales too

`TEXTURE` and `RULE` in `onganda-type.ts` exist because both were being chosen
one call site at a time — ten weave opacities and thirteen dither opacities
across the components, so the same object read as a different weight in every
section.

- **Texture belongs to grounds and inverse panels, not cards.** The public
  site's cards are flat; `PixelPanel`, `PixelNotice`, `PixelDialog` and
  `PixelEmptyState` are flat too. The one textured card grid is the
  five-system grid. Never switch texture on for a state — selected, active,
  drag-over — `check:tokens` fails `texture-as-state`. When every card carried
  the weave, every product screen came out textured, because every card a
  product builds is a `PixelPanel`.
- **No dotted rules.** The dither rule is retired. Repeated under every
  header, card foot and progress bar, the dots read as fussy and were never
  consistent from one section to the next. A divider is a solid hairline
  (`border-line`, or `DitherBar`, which now draws one); most blocks need none —
  spacing separates them. `npm run check:tokens` rejects striped fills.
- **A control's boundary is solid.** Dashed edges read as provisional. Use
  `PixelCornerMarks` for the emphasis a dashed border was reaching for.

### Creative latitude

The system fixes the material — colour roles, type, zero radius, zero blur,
the controls, contrast — and leaves the composition to the page. Each page
sets its own dials: lead accent, hero pattern, grid rhythm, depth (flat,
raised, lift — hard pixel shadows only), tone (one tinted feature), scale
contrast, texture placement, where the inverse band sits, and motion
signature. One signature move per page; turn a dial up in one section, not
all; product screens keep the dials low. SKILL.md has the full table and
`reference/expressive-range.png` shows three settings of the same content.

### Read the showcase first

`/showcase` is the reference implementation and the inventory. Before building,
open it and take the patterns that fit:

| Showcase section | What it teaches |
|---|---|
| Hero | Layered display type, pixel columns, ticker |
| Systems grid | Card composition, system identity, the black lab card |
| Control Standards | Every control in every state, both modes |
| **Product Patterns** | Dialog, table, notice, empty, loading, tabs, progress |
| Connection diagram | Step-line relationships, tooltips, node states |
| Heatmap · Roadmap | Density, phases, progress, status |
| Chart gallery | Every chart type on the fixed series order |
| Icon bank · Icon factory | The icon vocabulary and how to add to it |
| Maps | Geospatial framing |
| Publications | Long-form and deck authoring surfaces |
| Brand guide | Pixel rules and annotation |

If a product needs something the showcase does not have, that is a gap in the
system, not a licence to invent. Build it as a primitive, add it to the
showcase in every state, and document it. The composition test asserts the
showcase still contains every pattern an agent will reach for.

### Adding a pattern

1. Build it in `onganda-patterns.tsx` reading `roles(isDark)`.
2. Give it every state, including empty, loading and error where they apply.
3. Make colour a second signal, never the only one.
4. Add it to the **Product Patterns** section of `/showcase` in both modes.
5. Document it in `DESIGN_SYSTEM.md`, and add it to the README cheat sheet.
6. Add it to the pattern list in `tests/browser/composition.spec.ts`.

---

## 6. Typography & Layout

### Typography
*   **Font Families**: `Inter` for body and interface, `Space Grotesk` for headings (`FONT.display`, applied to `h1`–`h4` by `style.css`). No pixel fonts for reading text.
*   **Scale**: the closed `TYPE` scale in `onganda-type.ts`; `check:tokens` fails any other size.
*   **Hierarchy**: Use clear font weight distinctions. Avoid overly large fonts unless it's a major section heading.
*   **Contrast**: In dark mode, ensure text is legible against `Char Black`. Use `Millet Clay` for primary text. In light mode, use `Char Black` or variations with reduced opacity for primary text.

### Layout & Sizing
*   **Whitespace**: Use Tailwind spacing utilities aggressively (`p-8`, `px-12`, `mb-24`). Sections should have distinct breathing room.
*   **Borders**: Keep borders subtle and thin — the `line` role (`border-line`, `var(--onganda-line)`), never a raw hex.
*   **Hero Fit**: Hero compositions may layer type, tickers, tags, and pixel textures, but overlap must be intentional, balanced, and verified at desktop and mobile sizes. If a ticker, tag, or CTA reads as accidentally colliding with the headline, add spacing or reduce scale before shipping.
*   **No Viewport Guessing**: Do not scale typography directly with viewport width alone. Use `clamp()` with conservative bounds and verify real rendered line breaks.

---

## 7. Iconography & Textures

### The Pixel Rule
All visual flair must be pixelated.
*   **Icons**: Icons must be drawn as pixel art, constrained to a grid, utilizing the semantic color associated with their system.
*   **Diagrams**: Use step-lines and blocky nodes rather than smooth curves.
*   **Corners**: **Stepped corners, not rounded**, for all brand assets. Avoid `rounded-lg` on major brand cards; instead, build stepped pseudo-elements or use sharp rectangles.

### Core Textures
*   **No dotted or striped fills.** Pixels live in icons, marks and the hero's columns; a line or a fill is solid.
*   **Basket-Weave (`WEAVE`)**: Derived from Oshiwambo coil strands + stepped diamond patterns. Use the `WeaveOverlay` primitive on page grounds, hero sections and inverse panels — not on cards. It comes in both `light` and `dark` variants.

### Motion & Interaction
Motion is part of the design language, not a garnish — and it comes from the
defaults. `PixelPanel`, `SectionHeader`, `PixelStatBand`,
`PixelEditorialSection`, `PixelInversePanel`, `PixelEmptyState` and
`PixelDropZone` enter on their own; the stat band and `PixelPeers` stagger;
tabs, choices and buttons compress on press; a `PixelPanel` with an `onClick`
lifts on hover; a `PixelNav` item steps along and a `PixelFooter` link's
underline draws in. A product built from the primitives moves without writing
any motion. Until
this was the case, every product screen came out still.

*   **Quiet and mechanical.** Things rise, step and settle: a short ease-out, no spring, no bounce, no glow, no scale on hover. Avoid glossy, floating, or generic SaaS animation.
*   **Use the presets, never your own timings.** In CSS, the attributes in `style.css`:

    | Attribute | Motion |
    |---|---|
    | `data-onganda-enter` | rises 12px and fades in on mount (0.45s) |
    | `data-onganda-stagger` | on a grid or list: children arrive in turn, 60ms apart |
    | `data-onganda-lift` | a clickable card lifts 4px on hover |
    | `data-onganda-press` | compresses to 0.97 on press |
    | `data-onganda-nudge` | the element's last icon steps 2px forward on hover |
    | `data-onganda-slide` | a row, tab or nav item steps 2px along on hover |
    | `data-onganda-underline` | a text link's underline draws in, in four steps, in its own colour |
    | `data-onganda-live` | a status mark blinks in two steps |

    In framer-motion, `MOTION.entrance`, `fadeUp`, `staggerParent` / `staggerChild`, `hoverLift`, `tap`, `ticker`.
*   **Every interactive thing answers.** A clickable card lifts or takes its accent edge; a control shows hover, focus and pressed; a link draws its underline; a selected item takes `controlOn` or the accent edge — never texture.
*   **The stepped hover lift is the expressive signature.** A card that steps up and left onto a hard shadow when the pointer reaches it is what makes a public page feel made: `<PixelPeers lift>` for a set of feature cards, `depth="lift"` on one card, `<PixelButton lift>` on the call to action. Turn it up on editorial pages; a product screen keeps it to its primary action.
*   **Loading moves, and stops.** `PixelSkeleton` sweeps and `PixelProgress` fills while work progresses; an error replaces them with a `PixelNotice status="critical"`. Nothing sweeps forever.
*   **Reduced motion is honoured everywhere.** The CSS presets switch off under `prefers-reduced-motion`; `DarkProvider` wraps the tree in `MotionConfig reducedMotion="user"`, so framer entrances drop their slide; perpetual animations (ticker, sweep, edge strips) check `useMotionOK()`. The page is complete without motion.
*   **Public pages keep the showcase's motion**: the moving black system ticker, pixel-column motion, staggered headline entrance, card entrance, hover lift, animated diagram and flow affordances. Do not remove it unless an accessibility or layout issue requires it. A product screen uses entrance, stagger, lift and press — never the ticker.
*   `tests/browser/motion.spec.ts` checks all of this on the consumer test pages.

---

## 8. System Architecture Hierarchy

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

## 9. Design System Contract

Use the package root for the stable foundation:

```tsx
import {
  COLOR,
  SYSTEMS,
  DarkProvider,
  useDark,
  SectionHeader,
  SystemCard,
  PixelButton,
  IconSearch,
} from '@onganda/design-system';
```

Import larger features through `@onganda/design-system/charts`, `/editors`, `/ai`, `/maps`, or `/sites`. The package root retains the complete 1.x surface; 2.0 changed how it looks, not what it exports (see the CHANGELOG's migration notes). Removing a root export requires a major release and a migration note.

The implementation modules are:

1.  `onganda-tokens.ts`: color constants, cultural system data, charts, publication formats, guide annotations, and TypeScript interfaces.
2.  `onganda-primitives.tsx`: atomic Onganda UI primitives such as pixel marks, hairline rules, tags, overlays, cards, buttons, logo marks, and dark-mode context.
3.  `onganda-icons.tsx`: pixel-art interface and system icons.
4.  `onganda-charts.tsx`: Recharts-based chart gallery and chart composition patterns using the Onganda palette.
5.  `onganda-maps.tsx`: Leaflet-backed maps with Onganda controls, markers, routes, popups, and accessibility behavior.
6.  `onganda-sections.tsx`: composed page sections such as hero, navigation, diagrams, timelines, heatmaps, and icon showcase.
7.  `onganda-publications.tsx`, `onganda-document-editor.tsx`, and `onganda-slide-editor.tsx`: larger product surfaces built on the same system.
8.  `onganda-ai-authoring.tsx`: the lightweight AI authoring rail and endpoint adapter for generating editable documents and decks.
9.  `onganda-public-sites.tsx`: public Home and Full site surfaces built from the system.
10. `NamibiaAISystemsHub.tsx`: the current full-page reference implementation.

### Reuse Status
The repository builds a showcase and a publishable package. `npm run build` writes them to `dist/showcase` and `dist/package`. Consumer code must use the package exports, never deep source paths.

### Current Public Surfaces
The current app intentionally has multiple public surfaces:

*   `/`: selective public homepage for the current live posture.
*   `/full`: fuller future-facing website version for later release.
*   `/showcase`: the existing design-system showcase and capability demo. Preserve this page as-is unless the task explicitly asks to change showcase behavior.

The live homepage is a compact one-page public site. It must include the hero, Why Onganda, systems overview, and a rich contact area on the page itself. Do not split Home into thin `/systems` or `/contact` pages unless the information architecture is explicitly changed.

The homepage should avoid repeated editorial sections. If "What we are building" is already explained inside the Why Onganda block, do not add a second standalone section with the same point. The fuller `/full` page may include the standalone "What we are building" section because it is intended for a later, more detailed release.

### Public Page Composition
*   The public site is not a brand guide. Do not expose pixel asset libraries, palette explanations, internal component inventories, or design-system prose to public visitors.
*   Public pages should explain why Onganda exists, what it is building, how the five systems fit together, and how to start a conversation.
*   Use the showcase as the visual reference implementation. New public sections should feel like peers of the showcase, not simplified imitations.
*   The black Onganda lab card is part of the systems composition. Keep it in Home and Full systems grids unless a new systems layout replaces it with an equally strong compound signal.
*   Contact areas should feel as rich and intentional as other sections. A compact contact block is acceptable only for a small footer; the main Home contact should include the full inquiry surface.

### Stability Tiers
*   **Stable foundation**: `COLOR`, `WEAVE`, `SYSTEMS`, `SWATCHES`, `PRINCIPLES`, `DarkContext`, `useDark`, `Px`, `PixelDot`, `DitherBar` (a hairline now), `PixelTag`, `PixelButton`, `SectionHeader`, `WeaveOverlay`, `PixelCornerMarks`, `SystemCard`, `StatCard`, `SwatchChip`, and the icons in `onganda-icons.tsx`.
*   **Reusable but page-shaped**: `OngandaNav`, `OngandaHero`, `ResearchSignals`, `SystemConnectionDiagram`, `PixelHeatmap`, `RoadmapTimeline`, `FieldApplications`, `PixelFlowchart`, `IconShowcase`, and `Publications`.
*   **Product shells**: `DocumentEditor` and `SlideEditor`. These are usable surfaces, but they are larger, stateful modules and should not be treated as small primitives.
*   **AI authoring surface**: `AiAuthoringPanel`. Use it as the starting pattern for chat-like generation workflows: schema-first output, endpoint configured by the user, deterministic apply-to-editor behavior, and generated content that becomes normal editable blocks/slides.
*   **Geospatial surface**: `OngandaMap`. Import it from `/maps`, load `maps.css`, keep provider attribution visible, and preserve keyboard, reduced-motion, responsive, and marker-label behavior.

---

## 10. Component Implementation Rules

### Working with `src/components/onganda/`
The design system is implemented through focused modules in `src/components/onganda/`:
1.  `onganda-design-system.ts`: Preferred import surface for new app code.
2.  `onganda-tokens.ts`: **Do not hardcode new colors or constant data.** If you need a color or system definition, import `COLOR`, `SYSTEMS`, `SWATCHES`, or a typed data constant from this file through the barrel.
3.  `onganda-primitives.tsx`: Base UI elements (section headers, standard cards, overlays). When building a new page section, compose it using these primitives.
4.  `onganda-sections.tsx`: Large, composed page sections (hero, timelines, heatmaps).
5.  `onganda-icons.tsx`: All pixel-art SVG icons.
6.  `onganda-ai-authoring.tsx`: AI/chat authoring rail. Keep it lightweight, local/endpoint-driven, and visually constrained to the Onganda rail pattern.
7.  `onganda-maps.tsx`: Geospatial surface. Keep tile services configurable and all visible controls, markers, legends, and popups inside the Onganda language.

### Dark Mode Context
*   The application handles dark mode via the `DarkContext` provider (found in `onganda-primitives.tsx`).
*   Read the mode once and take colours from the role layer. A component should
    not branch on `isDark` per colour.
*   Example:
    ```tsx
    import { roles, useDark } from '@onganda/design-system';

    const { isDark } = useDark();
    const c = roles(isDark);
    // c.surface, c.text, c.line, c.actionBg, c.fieldBorder …
    ```

### Writing New Code
1.  **Surgical Changes**: Do not refactor whole files unless necessary. If adding a stat, add it to `STATS` in `onganda-tokens.ts` rather than hardcoding HTML.
2.  **Minimalism**: Prefer elegant improvements over verbosity. If a piece of UI feels cluttered, you are violating the "Anthropic-level whitespace discipline" rule.
3.  **Comment Minimally**: Only document what is not obvious. Rely on the strong naming conventions provided by the Oshiwambo + English system roles.
4.  **Style from roles**: Take colours from `roles(isDark)`. A raw hex, an `rgba()`, or a generic Tailwind colour class in a component is a build failure — see §3 and `npm run check:design`. Adding a token means measuring it first, not reaching for it.
5.  **Sharp Brand Geometry**: Do not add rounded corners to brand cards, diagrams, icons, or major Onganda surfaces. Small utility controls may remain rectangular or stepped.
6.  **Never Hand-Roll a Control**: Buttons, fields, labels, checkboxes, radios, and toggles come from the primitives in §4. An inline-styled `<button>` or `<input>` is the fastest way to fork the design system.
7.  **Use Existing Icons**: If a section has system cards, contact actions, focus areas, navigation affordances, or tool/product concepts, use the existing pixel icons from `onganda-icons.tsx` or system icons from `onganda-primitives.tsx`. Do not introduce generic icon styles.
8.  **Validate Every UI Change**: Before shipping UI work, run a code pass for design-system drift and a Playwright pass for rendered layout, motion, hover states, mobile fit, and console errors.
9.  **AI Generation Contract**: Generated documents and decks must land as normal editor data, not as static images or opaque blobs. The assistant may call any user-configured endpoint, but it must keep a schema-first response contract and ask for missing brief context before generation.

### Required Design Validation
For any UI, page, or component change, run the following checks:

1.  Run `npm run check:design`. It fails on generic Tailwind colours, off-palette hex and `rgba()`, `oklch`, system colours used as chrome, raw `STATUS` reads, rounded geometry, and any contrast regression against the measured role table.
2.  Read the changed files for drift the script cannot see: a hand-rolled control, a system colour used as chrome, a hue chosen for decoration, `tracking-tight`, or a stale public link.
3.  Run `npm run lint` and `npm run build`.
4.  Start the app and use Playwright on the affected routes.
5.  Verify no document-level horizontal overflow on desktop and mobile.
6.  Verify hero text, tickers, CTAs, and contact/forms do not collide or overflow.
7.  Verify expected motion actually changes over time or on hover/tap.
8.  Verify `/showcase` still works when the task did not explicitly target it.
9.  When the change adds or alters a control, verify it in the `/showcase` Control Standards section in both modes.

### Current Compliance Notes
Every design-system module passes `npm run check:tokens`. Remaining debt is
structural, not chromatic:

*   Many components still write approved palette literals inline instead of reading `roles(isDark)`. The colours are correct, so the check passes, but the mode branching is duplicated. Migrate a file to the role layer when you are already editing it. Do not copy the pattern into new code.
*   `DocumentEditor` and `SlideEditor` use the `EDITOR_SURFACE` paper and panel tones. Those are editor-only surface variants, not brand identity colours, and they are sanctioned. Promote a new one into `EDITOR_SURFACE` rather than inlining a hex.
*   `src/index.css` maps global Tailwind/shadcn-style variables to the Onganda palette so generic utilities such as `bg-background`, `text-foreground`, and `border-border` remain brand-aligned.
*   The lint configuration allows the named library utilities that intentionally share modules with components. Add no broad Fast Refresh exemptions.

---
*Following these guidelines ensures that Onganda remains visually coherent, culturally grounded, and architecturally sound.*
