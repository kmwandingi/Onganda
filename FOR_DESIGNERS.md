# Designing with Onganda

**This is a closed system.** Everything you are permitted to use is in
[`tokens/onganda.tokens.json`](./tokens/onganda.tokens.json). A colour, size,
spacing value, corner radius, shadow or typeface that is not in that file is
not part of Onganda, and a design that uses one is not an Onganda design.

That is not a stylistic preference. The palette is derived from Namibian
materials — millet, clay, bark, smoke, ochre, dried grass — and every value has
been measured against WCAG AA. Adding to it breaks both the meaning and the
accessibility guarantee.

If you need something the system does not have, **the answer is to extend the
system, not to work around it.** See [Asking for something new](#asking-for-something-new).

---

## Load the tokens into Figma

1. Install the **Tokens Studio for Figma** plugin.
2. Plugin → Tools → **Load from file/folder** → select
   `tokens/onganda.tokens.json`.
3. Apply the `role` set as your active theme. Create two themes, one for
   `role/light` and one for `role/dark`.

The file is in the W3C Design Tokens format, so Style Dictionary and most other
token tools read it directly as well.

It is **generated from the source code**, never written by hand. When the
system changes, the file changes with it in the same commit, and CI fails if it
falls behind.

---

## Design from roles, not from the palette

This is the single most important rule and the one most often broken.

The `palette` group holds the raw hues. **Do not pick from it.** Pick from the
`role` group, which says what an element *does*:

| You are styling | Use |
|---|---|
| The page background | `role/light/canvas` |
| A card or panel | `role/light/surface` with a `role/light/line` border |
| A recessed well or code block | `role/light/surfaceWell` |
| The black card, footer or ticker | `role/light/inverse` |
| A heading | `role/light/text` |
| Body copy | `role/light/textBody` |
| A label, caption or meta line | `role/light/textMuted` |
| The main action | `role/light/actionBg` + `actionFg` |
| A warm action inside a card | `role/light/accentBg` + `accentFg` |
| A destructive action | `role/light/dangerBg` + `dangerFg` |
| A link, focus ring or hover accent | `role/light/accentInk` |
| A form field's border | `role/light/fieldBorder` |
| A checked control | `role/light/controlOn` + `controlOnFg` + `controlOnBorder` |

Each palette entry carries its own `ALLOWED` / `NEVER` description in the token
file, so the rule travels with the value.

---

## The five things that trip people up

Every one of these is a measured fact, not an opinion. The ratios are in
`scripts/check-contrast.mjs` and re-verified on every build.

1. **Ochre orange is a fill, not ink.** Ochre text on the light canvas measures
   **2.4:1** — unreadable. Fill with ochre and put char black on it. For
   accent-coloured *text* on a light surface, use `accentInk`, which is bark
   rust (5.6:1). In dark mode `accentInk` is ochre.

2. **Fired red never sits behind small text.** Its best possible foreground is
   **4.05:1**, below the floor. It is an indicator only: status marks and
   invalid field borders. Destructive buttons fill with bark rust.

3. **The four system colours mean membership.** Mahangu gold, mopane brown and
   dye plum identify Ombiga, Etiti and Oshitoo; bark rust identifies Oshini.
   They are never a button, a border, a label or a background. If you name a
   system, put its hue on a mark beside the name — never *as* the name.

4. **There is no green and no blue.** Success is a check glyph on the settled
   tone, not a new hue. Do not add one.

5. **Nothing is rounded and nothing has a shadow.** `geometry/radius` is `0px`
   and `geometry/shadow` is `none`. Corner decoration is the stepped
   `PixelCornerMarks` mark. Depth comes from the basket-weave texture.

---

## Type, space and geometry

- **One typeface: Inter.** Weights 400, 500, 600, 700, 800.
- **The type scale is closed** — 13 steps from 8px to 48px, plus three fluid
  display sizes. Each step in `typography` carries its size, weight,
  line-height, letter-spacing and casing. A size not in the scale fails the
  build.
- **Spacing is a 4px grid.** The `space` group holds every permitted step.
- **Borders are 1px or 3px.** Nothing else.

The hero sizes are fluid (`clamp`), which Figma cannot express. The token file
gives the rendered size at 360px, 1280px and 1920px so you can lay out against
real numbers.

---

## Two densities

Every control has a `comfortable` and a `compact` size, in the `density` token
group. Design pages at comfortable; design popups, side panels, toolbars and
inspectors at compact. Do not shrink a control by hand — the whole surface
changes density together, or the proportions break.

| | comfortable | compact |
|---|---|---|
| Button | 42px tall, 13px label | 32px tall, 12px label |
| Field | 47px tall, 14px | 38px tall, 13px |
| Checkbox / radio | 18px | 16px |
| Toggle | 40×20 | 34×18 |

Build two Figma component variants against these numbers rather than resizing
instances.

## Composition: what makes a page actually Onganda

Using the right colours is necessary and not sufficient. A layout that uses
correct tokens and nothing else is not an Onganda design — it is a generic
layout in Onganda colours, and that is the most common failure.

A finished surface carries:

- the **eyebrow label above a headline** on every major section
- at least one surface with the **basket-weave texture** (3–8% opacity)
- **pixel marks** — dots, tags, stepped corner accents
- a **dither rule** where a section breaks, rather than a plain hairline
- **pixel iconography**: icons drawn as squares on an integer grid, never an
  icon library, never rounded or organic shapes
- an **inverse band** — the black-card language — somewhere on the page
- **quiet mechanical motion**: entrance, a 2px hover lift, a tap compression.
  Never spring, never scale-on-hover
- generous space; nothing cramped

Then ask what else the content supports: a ticker for live signals, a step-line
diagram for relationships (90° corners, never bezier curves), a heatmap for
density, a map where place matters, charts on the fixed series order.

**Look at `/showcase` before you start.** It is the reference implementation and
the inventory — every control in every state, every product pattern, plus
diagrams, heatmaps, charts, icons, maps and authoring surfaces. Take what fits.

---

## What already exists — do not redraw it

| | |
|---|---|
| **Controls** | Button (4 intents), text input, textarea, select, field wrapper with label/hint/error, checkbox, radio, toggle |
| **Patterns** | Dialog, table, notice (4 statuses), empty state, loading skeleton, tabs, progress bar |
| **Marks** | Pixel dot, pixel tag, dither bar, dither strip, stepped corner marks, basket-weave overlay, arrow connector |
| **Icons** | 95 interface icons plus 5 system icons, all `<rect>` on a 12 or 24 grid |
| **Sections** | Hero, nav, systems grid, connection diagram, heatmap, roadmap, field applications, flowchart, research signals, footer |
| **Data** | 15+ chart types on the fixed series order; Leaflet maps with pixel markers |

---

## Asking for something new

A gap in the system is a real thing and worth raising. It is never a licence to
invent a one-off.

To propose an addition:

1. **Name the role it fills** that no existing token or component covers.
2. **Measure it.** 4.5:1 against every surface for text; 3:1 for a boundary,
   focus ring or indicator. Both modes. The surfaces are in the token file.
3. **Show it beside what already exists**, so the difference is a decision
   rather than an accident.
4. It is added to the source modules, the token export regenerates, it goes on
   `/showcase` in every state, and it gets a test.

Anything added this way becomes permanent and enforced. Anything added any
other way fails the build.

---

## Why the repo can enforce this

So you know the rules are real rather than aspirational:

| Check | What it prevents |
|---|---|
| `check:tokens` | Off-palette colour, off-scale type, a system colour used as chrome, a rounded corner |
| `check:contrast` | Any of the 118 documented ratios regressing |
| `check:docs` | The written rules drifting from the code |
| `check:tokens:export` | This token file falling behind the source |
| `contrast` / `contrast-pixels` | Text failing on the rendered page, including behind textures and mid-animation |
| `composition` | A page that uses correct colours and carries none of the language |
| `identity` | A system's name appearing with no trace of its colour |
| `appearance` | Any visual change landing without a human seeing it |

Every one of these carries a self-test proving it rejects what it claims to
catch.
