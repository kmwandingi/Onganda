// ─── Onganda Design System — Typography & Space Scale ────────────────────────
// The complete, closed type scale. A size that is not here is not an Onganda
// size, and `npm run check:tokens` fails on one.
//
// The scale is what the system actually uses, with the near-duplicates removed
// — a 15px and a 16px in the same role were an accident, not a decision. Every
// value is a whole pixel: the geometry is pixel-aligned and fractional type
// undermines that. It is dense at the small end because this is an editorial
// system built on micro-labels; each step below 14px has a distinct job.
//
// Designers: these are exported to `tokens/onganda.tokens.json` in the W3C
// design-token format, which Tokens Studio imports directly into Figma.

export const TYPE = {
  /** 8px — pixel tags and ordinals. Decorative by intent: anything at this
   *  size must be aria-hidden or repeat information available elsewhere. */
  tag: { size: 8, lineHeight: 1.2, tracking: '0.18em', weight: 700, case: 'uppercase' },
  /** 9px — the smallest readable label */
  micro: { size: 9, lineHeight: 1.2, tracking: '0.16em', weight: 700, case: 'uppercase' },
  /** 10px — the eyebrow label above every section headline */
  eyebrow: { size: 10, lineHeight: 1.2, tracking: '0.16em', weight: 700, case: 'uppercase' },
  /** 11px — captions, table meta, inline annotations */
  caption: { size: 11, lineHeight: 1.45, tracking: '0.02em', weight: 500, case: 'none' },
  /** 12px — dense secondary text, the most common small step */
  small: { size: 12, lineHeight: 1.45, tracking: '0.02em', weight: 500, case: 'none' },
  /** 13px — control and button labels */
  ui: { size: 13, lineHeight: 1.4, tracking: '0.02em', weight: 500, case: 'none' },
  /** 14px — default body */
  body: { size: 14, lineHeight: 1.6, tracking: '0em', weight: 400, case: 'none' },
  /** 16px — long-form reading */
  bodyLarge: { size: 16, lineHeight: 1.65, tracking: '0em', weight: 400, case: 'none' },
  /** 18px — section lead paragraph */
  lead: { size: 18, lineHeight: 1.6, tracking: '0em', weight: 400, case: 'none' },
  /** 20px — card and panel titles */
  title: { size: 20, lineHeight: 1.25, tracking: '-0.01em', weight: 600, case: 'none' },
  /** 24px — section headline */
  headline: { size: 24, lineHeight: 1.2, tracking: '-0.01em', weight: 600, case: 'none' },
  /** 30px — page headline */
  pageTitle: { size: 30, lineHeight: 1.15, tracking: '-0.02em', weight: 600, case: 'none' },
  /** 48px — the largest fixed size; above this use the fluid display steps */
  display: { size: 48, lineHeight: 1.08, tracking: '-0.02em', weight: 700, case: 'none' }
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

// ─── Density ─────────────────────────────────────────────────────────────────
// The system shipped with one density, tuned for a page. Dropped unchanged into
// a 340px popup or a narrow side panel, a 36px button with 22px of horizontal
// padding and a 43px field is oversized, and the layout reads as cramped and
// heavy — which is exactly what happened in the first extension surfaces.
//
// Density is a property of the SURFACE, not of each control. A container
// declares it once with <DensityProvider>, and every control inside tightens
// together. Both sets are on /showcase side by side.
//
//   comfortable — pages, marketing, full-width app views (the default)
//   compact     — popups, side panels, toolbars, inspectors, dense tables
export const DENSITY = {
  comfortable: {
    buttonPadding: '10px 22px',
    buttonFont: TYPE.ui.size,        // 13
    fieldPadding: '12px 16px',
    fieldFont: TYPE.body.size,       // 14
    textareaMinHeight: 128,
    controlBox: 18,
    toggleWidth: 40,
    toggleHeight: 20,
    stackGap: SPACE_SCALE['5'],      // 20
    labelGap: SPACE_SCALE['3'],      // 12
    tabPadding: '7px 14px'
  },
  compact: {
    buttonPadding: '6px 14px',
    buttonFont: TYPE.small.size,     // 12
    fieldPadding: '8px 12px',
    fieldFont: TYPE.ui.size,         // 13
    textareaMinHeight: 88,
    controlBox: 16,
    toggleWidth: 34,
    toggleHeight: 18,
    stackGap: SPACE_SCALE['3'],      // 12
    labelGap: SPACE_SCALE['2'],      // 8
    tabPadding: '5px 10px'
  }
} as const;

export type DensityName = keyof typeof DENSITY;
export type Density = (typeof DENSITY)[DensityName];
