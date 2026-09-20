# Onganda (Namibia AI Systems Lab) - AI Agent Instructions

You are working in the Onganda project repository. This project has a very strict and specific design system. Onganda is the project name; Okaanda is one system inside it.

## CRITICAL INSTRUCTION BEFORE WRITING ANY CODE
Before you make any changes to UI, styling, components, or layout, you MUST:
1. Read `skills/onganda-design-system/SKILL.md`.
2. Read the `DESIGN_GUIDELINES.md` file located in the root of this project.
3. Read the relevant public export in `src/design-system/`.
4. Read `DESIGN_SYSTEM.md` §4 (Color Roles) and §5 (Controls). These are the enforceable rules.
5. Read `onganda-colors.ts`, `onganda-roles.ts`, `onganda-types.ts`, and `onganda-content.ts` before changing design data. `onganda-tokens.ts` re-exports them for compatibility.

## Hard Rules

### Colour
1. **Style from roles, not from the palette.** Call `roles(isDark)` and read `surface`, `text`, `textMuted`, `line`, `actionBg`, `accentInk`, `fieldBorder`. Being in `COLOR` does not make a token available for any purpose. `DESIGN_SYSTEM.md` §4 has the full table; `COLOR_POLICY` has it in code.
2. **Never write a raw hex, an `rgba()`, or a generic Tailwind colour** (`text-blue-500`, `bg-red-500`) in a component. All three fail `npm run check:design`.
3. **Ochre Orange is the accent as a FILL, not as ink on light.** Millet clay on ochre is 2.4:1 and ochre on millet clay is 2.4:1. Ochre fills need Char Black on them. On light surfaces the accent ink is **Bark Rust**; in dark mode it is ochre. Use `accentInk`, never a raw token.
4. **Fired Red is an indicator only.** Critical status marks and invalid field borders, where the 3:1 threshold applies. Its best foreground is 4.05:1, so it never sits behind small text and is never error-message text. The danger button fills with Bark Rust.
5. **System colours mean membership.** Mahangu Gold, Mopane Brown, and Dye Plum identify Ombiga, Etiti, and Oshitoo; Bark Rust identifies Oshini. Never a button, border, label, or background — the check fails on a system hue bound to `background` or `border*`.
6. **Text and lines are brand ink at a fixed opacity.** Use the mode-aware steps in `ALPHA`. Only `textFaint`, `line`, and `lineStrong` sit below the contrast floors; they are for disabled text, ordinals, and dividers. Never put meaning there.
7. **The palette has no green and no blue.** Do not add one. Read status through `statusFor(name, isDark)`, never `STATUS[name]` — mopane brown is 2.25:1 on a dark card.
8. **Colour is never the only carrier of state.** An invalid field has a border, a marker, and a message. A status mark has a label and a hairline ring.
9. **Adding a colour means measuring it first** against both surfaces in both modes, then updating `COLOR`, `COLOR_CSS_VARS`, `lib-style.css`, and `COLOR_POLICY`. Never widen a check to make it pass.

### Controls
10. **Never hand-roll a control.** Use `PixelButton`, `PixelInput`, `PixelTextarea`, `PixelSelect`, `PixelField`, `PixelCheckbox`, `PixelRadio`, `PixelToggle`. An inline-styled `<button>` or `<input>` is how this design system forks.
11. **One primary action per view.** `primary` is the main action, `accent` is an action inside a card that already carries the page's primary, `ghost` is the quiet alternative, `danger` destroys something.
12. **A control on an inverse surface takes the dark role set.** The footer, ticker, and black lab card are locally dark — pass `isDark`, or the control's hover resolves against the wrong background and it can vanish into the card.
13. **A control not on `/showcase` does not exist.** Adding one means: build it on `roles()`, give it every state, add it to the Control Standards section, verify it in both modes with that section's switch, specify it in `DESIGN_SYSTEM.md` §5, and assert its colours in `tests/browser/control-standards.spec.ts`.
14. **No rounded corners anywhere.** `borderRadius: 0` on every control and brand surface. Use `PixelCornerMarks` for corner decoration.

### Language
15. **Respect the Pixel vs. Type dichotomy**: icons, diagrams, and brand elements are pixelated (stepped corners, dither, basket-weave). Typography and reading interfaces are clean sans-serif (Inter/Arial).
16. **Oshiwambo First**: use the Oshiwambo system names (Okaanda, Oshini, Ombiga, Etiti, Oshitoo) first, English second.
17. **Use the showcase as the reference implementation**: public pages must feel like peers of `/showcase`, including its pixel primitives, system icons, black ticker/lab-card language, and subtle motion patterns.
18. **Keep public IA intentional**: `/` is the current one-page public home, `/full` is the fuller future-facing version, `/showcase` is the preserved design-system showcase. Do not add thin `/systems` or `/contact` routes unless explicitly asked.
19. **Hero and contact quality bar**: hero elements must fit intentionally at desktop and mobile sizes; the main Home contact section must be a rich inquiry surface, not a stripped footer.

### Composition
20. **Every rule above is a prohibition; a thin page passes all of them.** A finished Onganda surface also carries: the `SectionHeader` label/headline rhythm, at least one `WeaveOverlay` texture, pixel marks (`PixelDot`/`PixelTag`/`PixelCornerMarks`), a `DitherBar` rule, pixel iconography, an inverse band, real `MOTION`, and system controls. `tests/browser/composition.spec.ts` fails without them.
21. **Open `/showcase` before building.** It is the inventory: Control Standards for every control, Product Patterns for dialog/table/notice/empty/loading/tabs/progress, plus diagrams, heatmap, roadmap, charts, icons, maps and publications. Take what fits instead of inventing an equivalent.
22. **Use `PixelDialog`, `PixelTable`, `PixelNotice`, `PixelEmptyState`, `PixelSkeleton`, `PixelTabs`, `PixelProgress`** for product surfaces. A missing pattern is a gap in the system: build it as a primitive, add it to the showcase in every state, document it, and extend the composition test.
23. **Give every surface that loads an empty, loading and error state.** They are part of the design, not an afterthought.

### Validation
24. **Run `npm run check:design`** before considering any UI change complete — it runs the token guard and re-measures every documented contrast ratio. Then run `npm run test:browser` and a Playwright pass for rendered desktop/mobile layout, motion, hover/tap states, and console errors.

Failure to follow these rules will result in visual regressions and break the cultural and architectural alignment of the project.
