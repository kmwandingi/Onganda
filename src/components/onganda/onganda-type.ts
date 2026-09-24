// ─── Onganda Design System — Typography & Space Scale ────────────────────────
// This scale is not a design. It is a TRANSCRIPT.
//
// Onganda's public site (/ and /full) is the reference implementation of the
// brand. It came first, it is what the brand actually looks like, and it is
// what every other surface must look like. This file records the type it
// uses — measured off the rendered DOM at 1440px, not chosen by eye.
//
// So: a size that is not here is not an Onganda size, and `npm run
// check:tokens` fails on one. If you believe a step is missing, the question
// is not "should we add it" — it is "where does the public site use it". If
// the answer is nowhere, the answer is no.
//
// Each step below records the element it was measured from. Do not retune a
// step without changing the public site first and re-measuring.
//
// Designers: these are exported to `tokens/onganda.tokens.json` in the W3C
// design-token format, which Tokens Studio imports directly into Figma.

export const TYPE = {
  /** 9px — pixel tag ordinals and the hero status chip ("LIVE", "01").
   *  Decorative by intent: anything at this size must be aria-hidden or
   *  repeat information available elsewhere. Measured: PixelTag. */
  tag: { size: 9, lineHeight: 1.5, tracking: '0.18em', weight: 700, case: 'uppercase' },
  /** 10px — the quiet gloss beside a louder label: the English reading under
   *  a system name, the lab line under the wordmark. Measured: ticker gloss. */
  micro: { size: 10, lineHeight: 1.5, tracking: '0.12em', weight: 700, case: 'uppercase' },
  /** 11px — a standalone identifier in a dense strip. Measured: the system
   *  name in the hero ticker. This step is a LABEL, not a caption: at 11px
   *  the site only ever sets bold uppercase. */
  label: { size: 11, lineHeight: 1.5, tracking: '0.18em', weight: 700, case: 'uppercase' },
  /** 12px — THE eyebrow. The most-used label in the system: the word above
   *  every section headline, every nav item, every card's role line.
   *  Measured: "Systems", "Focus", "Model & Data Platform". */
  eyebrow: { size: 12, lineHeight: 1.33, tracking: '0.16em', weight: 700, case: 'uppercase' },
  /** 12px — terminal and code lines. Airy leading because a code block is
   *  read line by line. Measured: TerminalCard. */
  code: { size: 12, lineHeight: 2, tracking: '0em', weight: 400, case: 'none' },
  /** 14px — the button and control label. Measured: "Request a conversation". */
  ui: { size: 14, lineHeight: 1.43, tracking: '0em', weight: 600, case: 'none' },
  /** 14px — a subtitle directly under a title, weighted to hold its own
   *  against the title above it. Measured: "Granary" under "Okaanda". */
  meta: { size: 14, lineHeight: 1.43, tracking: '0em', weight: 500, case: 'none' },
  /** 14px — default body, and the body of every card. */
  body: { size: 14, lineHeight: 1.6, tracking: '0em', weight: 400, case: 'none' },
  /** 16px — long-form reading. */
  bodyLarge: { size: 16, lineHeight: 1.6, tracking: '0em', weight: 400, case: 'none' },
  /** 18px — the paragraph that opens a section. Measured: hero body. */
  lead: { size: 18, lineHeight: 1.6, tracking: '0em', weight: 400, case: 'none' },
  /** 18px — card and panel titles. Measured: "Adapt models". */
  title: { size: 18, lineHeight: 1.25, tracking: '0em', weight: 600, case: 'none' },
  /** 24px — the title of a full editorial card. Measured: "Okaanda". */
  headline: { size: 24, lineHeight: 1.33, tracking: '0em', weight: 600, case: 'none' },
  /** 30px — the section headline under an eyebrow. MEDIUM, not semibold: the
   *  site's section headlines are deliberately lighter than its card titles,
   *  which is what keeps a page of cards from shouting over its own
   *  structure. Measured: "Five systems. One compound." */
  pageTitle: { size: 30, lineHeight: 1.25, tracking: '0em', weight: 500, case: 'none' },
  /** 48px — the headline inside an inverted panel; the largest fixed size.
   *  Above this use the fluid display steps. Measured: "Namibia should not
   *  only consume AI." */
  display: { size: 48, lineHeight: 1.25, tracking: '0em', weight: 600, case: 'none' }
} as const;

export type TypeStep = keyof typeof TYPE;

/** Every size the system permits, for the guard and the token export. */
export const TYPE_SIZES: readonly number[] = Object.values(TYPE).map(t => t.size);

// ─── Fluid display sizes ─────────────────────────────────────────────────────
// Hero type scales with the viewport. Figma cannot express a clamp, so the
// token export carries the rendered size at three reference widths.
export const DISPLAY = {
  hero: { css: 'clamp(3.2rem, 10vw, 9rem)', at360: 58, at1280: 128, at1920: 144 },
  heroPublic: { css: 'clamp(3rem, 7.4vw, 7.1rem)', at360: 48, at1280: 95, at1920: 114 },
  subhead: { css: 'clamp(0.82rem, 1.3vw, 0.95rem)', at360: 13, at1280: 15, at1920: 15 }
} as const;

// ─── Font ────────────────────────────────────────────────────────────────────
// One family. The pixel/type split means the brand's character lives in the
// marks, not the letterforms, so the reading face stays neutral and legible.
export const FONT = {
  family: "'Inter', Arial, Helvetica, sans-serif",
  weights: [400, 500, 600, 700, 800] as const,
  /** Used only inside the document editor's reading surfaces. */
  serif: "Georgia, 'Times New Roman', serif"
} as const;

// ─── Space ───────────────────────────────────────────────────────────────────
// A 4px base grid: the pixel geometry rests on whole units.
export const SPACE_SCALE = {
  '0': 0,
  '1': 4,
  '2': 8,
  '3': 12,
  '4': 16,
  '5': 20,
  '6': 24,
  '8': 32,
  '10': 40,
  '12': 48,
  '16': 64,
  '20': 80,
  '24': 96,
  '32': 128
} as const;

// ─── Geometry ────────────────────────────────────────────────────────────────
// Stated as a token so it appears in the export and in Figma, where a designer
// would otherwise reach for a default corner radius without thinking.
export const GEOMETRY = {
  /** Zero. Everywhere. Corner decoration is PixelCornerMarks, not a radius. */
  radius: 0,
  /** The only border widths the system uses. */
  borderWidths: [1, 3] as const,
  /** No shadows: depth comes from the weave texture and stepped marks. */
  shadow: 'none'
} as const;

// ─── Texture ─────────────────────────────────────────────────────────────────
// How much weave, and where. The system shipped with ten different opacities
// between 0.022 and 0.06 chosen one call site at a time, which is why a page
// of cards can come out muddy: a textured card sitting on a textured ground
// is the same weave twice.
//
// Three steps, one rule: TEXTURE BELONGS TO GROUNDS AND INVERSE PANELS.
// A card repeats it only when it sits on a plain ground, which is how the
// public site does it — the hero is textured, the section grounds between are
// not, and the cards carry their own.
//
// Never stack it. If the container behind a card is textured, the card is not.
export const TEXTURE = {
  /** the page ground behind everything; barely present */
  ground: 0.026,
  /** a raised card on a PLAIN ground */
  surface: 0.035,
  /** an inverse panel, the one place the weave actually reads */
  inverse: 0.055,
  /** no texture: a card on a textured ground, a dense control surface */
  none: 0
} as const;

// ─── Rules ───────────────────────────────────────────────────────────────────
// The dither bar is the system's divider. It had thirteen opacities and three
// heights across the components, so the same object read as a different
// weight in every section.
//
// Three jobs, and one discipline: ONE RULE PER BLOCK. A card that carries a
// section rule, a rule under its title and a rule at its foot is not
// structured, it is striped. That includes dashed borders: a control's
// boundary is solid, and `PixelCornerMarks` does the work a dashed edge was
// reaching for.
export const RULE = {
  /** beside a section's prose, the boldest of the three */
  section: { segments: 34, height: 4, opacity: 0.42 },
  /** closing the foot of a card */
  edge: { segments: 24, height: 2, opacity: 0.55 },
  /** inside an inverse panel, where it has to carry against black */
  inverse: { segments: 28, height: 3, opacity: 0.65 }
} as const;

// ─── Density ─────────────────────────────────────────────────────────────────
// Density changes SPACING. It never changes type.
//
// The brand's control label is 14px/600 — measured off the public site's
// "Request a conversation". A popup does not get a different typeface size for
// the same job; it gets tighter padding. Shrinking the type as well was the
// mistake that made the first extension surfaces look like a different
// product, so the two sets below share every font size and differ only in the
// space around it.
//
// Density is a property of the SURFACE, not of each control. A container
// declares it once with <DensityProvider>, and every control inside tightens
// together. Both sets are on /showcase side by side.
//
//   comfortable — pages, marketing, full-width app views (the default)
//   compact     — popups, side panels, toolbars, inspectors, dense tables
export const DENSITY = {
  comfortable: {
    // Measured: the public hero's primary action is px-6 py-3.
    buttonPadding: '12px 24px',
    buttonFont: TYPE.ui.size,        // 14
    fieldPadding: '12px 16px',
    fieldFont: TYPE.body.size,       // 14
    textareaMinHeight: 128,
    controlBox: 18,
    toggleWidth: 40,
    toggleHeight: 20,
    stackGap: SPACE_SCALE['5'],      // 20
    labelGap: SPACE_SCALE['3'],      // 12
    tabPadding: '8px 16px'
  },
  compact: {
    buttonPadding: '8px 16px',
    buttonFont: TYPE.ui.size,        // 14 — same step, tighter box
    fieldPadding: '8px 12px',
    fieldFont: TYPE.body.size,       // 14 — same step, tighter box
    textareaMinHeight: 88,
    controlBox: 16,
    toggleWidth: 36,
    toggleHeight: 20,
    stackGap: SPACE_SCALE['3'],      // 12
    labelGap: SPACE_SCALE['2'],      // 8
    tabPadding: '8px 12px'
  }
} as const;

export type DensityName = keyof typeof DENSITY;
export type Density = (typeof DENSITY)[DensityName];
