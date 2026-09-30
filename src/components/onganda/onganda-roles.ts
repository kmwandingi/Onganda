// ─── Onganda Design System — Color Roles ──────────────────────────────────────
// COLOR says what a color is. ROLE says where it may be used.
//
// Styling an interface element? Read a role, never a palette token:
//
//   const c = roles(isDark);
//   <div style={{ background: c.surface, color: c.text, border: `1px solid ${c.line}` }} />
//
// The palette has nine hues. Five of them belong to the five systems and carry
// meaning. If any of them could be chosen for a button, a border, or a label,
// the meaning is gone. The roles below are the whole permitted vocabulary for
// interface chrome; SYSTEM_COLOR, statusFor(), and CHART_SERIES cover the rest.
//
// Every value here is measured, not chosen by eye. `npm run check:contrast`
// recomputes the ratios and fails on a regression. Two measurements shape the
// whole set and are worth knowing before you edit it:
//
//   • Ochre orange cannot carry meaning on a light surface. Millet clay on
//     ochre is 2.4:1 and ochre on millet clay is 2.4:1. Ochre works as a FILL
//     with char black on it (5.5:1), and as INK on dark surfaces (6.1:1). On
//     light surfaces the accent ink is bark rust (5.6:1) — the deep ochre.
//   • Fired red cannot host small light text. Its best foreground is 4.05:1,
//     under the 4.5:1 floor. Fired red stays an indicator — status marks and
//     field borders, where the 3:1 non-text threshold applies — and the danger
//     fill is bark rust instead.

import { COLOR } from './onganda-colors';

// ─── Alpha ramp ───────────────────────────────────────────────────────────────
// Text and lines are the brand ink at a fixed set of opacities, not new hues.
// Use these steps only. A step not listed here is drift.
const ink = (a: number) => `rgba(30,26,23,${a})`;    // charBlack
const paper = (a: number) => `rgba(232,225,207,${a})`; // milletClay

export const ALPHA = {
  /** long-form reading text — 8.1:1 light, 9.1:1 dark */
  body: { light: 0.82, dark: 0.78 },
  /** labels, captions, meta — the 4.5:1 floor for small text, measured
   *  against every surface in the system including the eleven EDITOR_SURFACE
   *  tones. Dust header (#D5CEBB) is the darkest light ground and sets this. */
  muted: { light: 0.66, dark: 0.55 },
  /** disabled text and decorative ordinals ONLY. Below 4.5:1 by design:
   *  WCAG exempts inactive controls, and ordinals repeat information that is
   *  already in the adjacent label. Never put meaning here. */
  faint: { light: 0.25, dark: 0.25 },
  /** hairline divider — decorative, carries no state */
  line: { light: 0.1, dark: 0.1 },
  /** emphasized divider */
  lineStrong: { light: 0.2, dark: 0.2 },
  /** the visible boundary of a control — the 3:1 non-text floor */
  control: { light: 0.51, dark: 0.42 },
  /** that boundary on hover */
  controlHover: { light: 0.65, dark: 0.58 }
} as const;

export interface ColorRoles {
  // Surfaces
  canvas: string;
  surface: string;
  /** recessed panel: wells, code blocks, nested inputs. Recedes toward the
   *  canvas in both modes — it is not an elevated surface. */
  surfaceWell: string;
  /** the black-card language: footer, ticker, lab card */
  inverse: string;
  /** dark mode has no darker tone to invert into, so the inverse card is
   *  marked by an accent edge instead. Transparent in light mode. */
  inverseBorder: string;
  // Text
  text: string;
  textBody: string;
  textMuted: string;
  textFaint: string;
  textOnInverse: string;
  // Lines
  line: string;
  lineStrong: string;
  focusRing: string;
  /** the accent used as ink — link, ghost hover, focus ring. Not the same
   *  token as accentBg: ochre fails as ink on light surfaces. */
  accentInk: string;
  // Action — one recipe per intent, each with its own hover foreground.
  // A fill that sits under 3:1 against the surface gets an edge that clears
  // it: the edge, not the fill, is the control's boundary.
  actionBg: string;
  actionFg: string;
  actionBorder: string;
  actionHoverBg: string;
  actionHoverFg: string;
  actionHoverBorder: string;
  accentBg: string;
  accentFg: string;
  accentBorder: string;
  accentHoverBg: string;
  accentHoverFg: string;
  accentHoverBorder: string;
  dangerBg: string;
  dangerFg: string;
  dangerBorder: string;
  dangerHoverBg: string;
  dangerHoverFg: string;
  dangerHoverBorder: string;
  ghostBorder: string;
  ghostFg: string;
  ghostHoverBorder: string;
  ghostHoverFg: string;
  // Fields and controls
  fieldBg: string;
  fieldText: string;
  fieldPlaceholder: string;
  fieldBorder: string;
  fieldBorderHover: string;
  fieldBorderFocus: string;
  fieldBorderInvalid: string;
  fieldDisabledBg: string;
  fieldDisabledText: string;
  controlOn: string;
  controlOnFg: string;
  /** the edge of a checked control. The ochre fill alone is 2.56:1 on dust
   *  light, under the 3:1 boundary floor, so the edge carries the contrast. */
  controlOnBorder: string;
}

export const ROLE_LIGHT: ColorRoles = {
  canvas: COLOR.milletClay,
  surface: COLOR.dustLight,
  surfaceWell: COLOR.milletClay,
  inverse: COLOR.charBlack,
  inverseBorder: 'transparent',

  text: COLOR.charBlack,
  textBody: ink(ALPHA.body.light),
  textMuted: ink(ALPHA.muted.light),
  textFaint: ink(ALPHA.faint.light),
  textOnInverse: COLOR.milletClay,

  line: ink(ALPHA.line.light),
  lineStrong: ink(ALPHA.lineStrong.light),
  focusRing: COLOR.barkRust,
  accentInk: COLOR.barkRust,

  // The primary is ochre, not char black. A black primary made every screen
  // read as a black slab with some cream around it — the heaviest thing on
  // the page was chrome, and the palette's warmth went unused. Measured:
  //   ochre fill, char black label ........ 5.52:1
  //   bark rust edge on dust / millet ..... 5.95 / 5.59:1  (the fill alone is
  //     2.56:1 on dust, so the edge carries the 3:1 boundary)
  //   hover: mopane fill, millet label .... 6.06:1  — the fill deepens to earth
  actionBg: COLOR.ochreOrange,
  actionFg: COLOR.charBlack,
  actionBorder: COLOR.barkRust,
  actionHoverBg: COLOR.mopaneBrown,
  actionHoverFg: COLOR.milletClay,
  actionHoverBorder: COLOR.mopaneBrown,
  // The in-card action is mahangu gold, the palette's secondary highlight.
  //   gold fill, char black label ......... 8.41:1
  //   mopane edge on dust ................. 6.45:1  (gold alone is 1.68:1)
  //   hover: dye plum fill, millet label .. 5.59:1  — gold's complement
  accentBg: COLOR.mahanguGold,
  accentFg: COLOR.charBlack,
  accentBorder: COLOR.mopaneBrown,
  accentHoverBg: COLOR.dyePlum,
  accentHoverFg: COLOR.milletClay,
  accentHoverBorder: COLOR.dyePlum,
  dangerBg: COLOR.barkRust,
  dangerFg: COLOR.milletClay,
  // The fired red edge (3.85:1 on dust) is where "red means danger" lives on
  // the button itself — it is a boundary, so the 3:1 floor applies.
  dangerBorder: COLOR.firedRed,
  dangerHoverBg: COLOR.charBlack,
  dangerHoverFg: COLOR.milletClay,
  dangerHoverBorder: COLOR.charBlack,
  ghostBorder: ink(ALPHA.control.light),
  ghostFg: COLOR.charBlack,
  ghostHoverBorder: COLOR.barkRust,
  ghostHoverFg: COLOR.barkRust,

  fieldBg: 'transparent',
  fieldText: COLOR.charBlack,
  fieldPlaceholder: ink(ALPHA.muted.light),
  fieldBorder: ink(ALPHA.control.light),
  fieldBorderHover: ink(ALPHA.controlHover.light),
  fieldBorderFocus: COLOR.barkRust,
  fieldBorderInvalid: COLOR.firedRed,
  fieldDisabledBg: ink(0.04),
  fieldDisabledText: ink(ALPHA.faint.light),
  controlOn: COLOR.ochreOrange,
  controlOnFg: COLOR.charBlack,
  controlOnBorder: COLOR.barkRust
};

export const ROLE_DARK: ColorRoles = {
  canvas: COLOR.darkBg,
  surface: COLOR.darkCard,
  surfaceWell: COLOR.darkBg,
  inverse: COLOR.darkCardAlt,
  inverseBorder: COLOR.ochreOrange,

  text: COLOR.milletClay,
  textBody: paper(ALPHA.body.dark),
  textMuted: paper(ALPHA.muted.dark),
  textFaint: paper(ALPHA.faint.dark),
  textOnInverse: COLOR.milletClay,

  line: paper(ALPHA.line.dark),
  lineStrong: paper(ALPHA.lineStrong.dark),
  focusRing: COLOR.ochreOrange,
  accentInk: COLOR.ochreOrange,

  // Ochre on the dark card is 5.68:1 by itself, so the edge matches the fill.
  // Hover lifts to gold (8.66:1 on the card); the in-card accent is gold at
  // rest and lifts to millet clay.
  actionBg: COLOR.ochreOrange,
  actionFg: COLOR.charBlack,
  actionBorder: COLOR.ochreOrange,
  actionHoverBg: COLOR.mahanguGold,
  actionHoverFg: COLOR.charBlack,
  actionHoverBorder: COLOR.mahanguGold,
  accentBg: COLOR.mahanguGold,
  accentFg: COLOR.charBlack,
  accentBorder: COLOR.mahanguGold,
  accentHoverBg: COLOR.milletClay,
  accentHoverFg: COLOR.charBlack,
  accentHoverBorder: COLOR.milletClay,
  // Bark rust is 2.44:1 on the dark card; the fired red edge is 3.77:1.
  dangerBg: COLOR.barkRust,
  dangerFg: COLOR.milletClay,
  dangerBorder: COLOR.firedRed,
  dangerHoverBg: COLOR.milletClay,
  dangerHoverFg: COLOR.charBlack,
  dangerHoverBorder: COLOR.milletClay,
  ghostBorder: paper(ALPHA.control.dark),
  ghostFg: COLOR.milletClay,
  ghostHoverBorder: COLOR.ochreOrange,
  ghostHoverFg: COLOR.ochreOrange,

  fieldBg: 'transparent',
  fieldText: COLOR.milletClay,
  fieldPlaceholder: paper(ALPHA.muted.dark),
  fieldBorder: paper(ALPHA.control.dark),
  fieldBorderHover: paper(ALPHA.controlHover.dark),
  fieldBorderFocus: COLOR.ochreOrange,
  fieldBorderInvalid: COLOR.firedRed,
  fieldDisabledBg: paper(0.04),
  fieldDisabledText: paper(ALPHA.faint.dark),
  controlOn: COLOR.ochreOrange,
  controlOnFg: COLOR.charBlack,
  controlOnBorder: COLOR.ochreOrange
};

/** The role set for the current mode. `const c = roles(isDark)`. */
export const roles = (isDark: boolean): ColorRoles => (isDark ? ROLE_DARK : ROLE_LIGHT);

// ─── System identity ──────────────────────────────────────────────────────────
// The only sanctioned use of mahangu gold, mopane brown, and dye plum, and the
// identity use of bark rust. A colour here means "this belongs to that system"
// — nothing else.
export const SYSTEM_COLOR = {
  Okaanda: COLOR.ochreOrange,
  Oshini: COLOR.barkRust,
  Ombiga: COLOR.mahanguGold,
  Etiti: COLOR.mopaneBrown,
  Oshitoo: COLOR.dyePlum
} as const;

export type SystemName = keyof typeof SYSTEM_COLOR;

// ─── Status ───────────────────────────────────────────────────────────────────
// Four states, no more. The palette is earth-derived: it has no green and no
// blue, and none may be added. Success is carried by a check glyph and a
// settled neutral tone, not by a colour the system does not own.
//
// A status hue is never the only carrier of meaning: always pair the mark with
// a text label. Some hues fall under 3:1 against their surface (gold on cream
// is 1.6:1), so a bare status dot also needs a `line` hairline to delineate it.
// `PixelDot` draws that hairline when you pass `ring`.
export const STATUS = {
  critical: COLOR.firedRed,   // error, destructive, blocking
  caution: COLOR.mahanguGold, // warning, pending, needs attention
  active: COLOR.ochreOrange,  // live, running, in progress
  settled: COLOR.mopaneBrown  // complete, archived, informational
} as const;

export type StatusName = keyof typeof STATUS;

/** Status colour adjusted for the current mode. Mopane brown drops to 2.25:1
 *  on a dark card, so the lighter tone is substituted there. */
export const statusFor = (name: StatusName, isDark: boolean): string =>
  isDark && name === 'settled' ? COLOR.mopaneBrownLight : STATUS[name];

// ─── Foreground for an arbitrary fill ─────────────────────────────────────────
// Tags, chart labels, and system cards take a colour as data, so they cannot
// know their foreground in advance. Pick it by measured luminance rather than
// by comparing against one token.
//
// Fired red is the one fill this cannot rescue: char black reaches 3.66:1 and
// dust light 3.85:1, both under the 4.5:1 floor. Do not put small text on it —
// see COLOR_POLICY.firedRed.
const channel = (c: number) => {
  const v = c / 255;
  return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
};

const luminance = (hex: string): number => {
  const [r, g, b] = [1, 3, 5].map(i => parseInt(hex.slice(i, i + 2), 16));
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
};

/** WCAG contrast ratio between two hex colours. */
export const contrast = (a: string, b: string): number => {
  const [x, y] = [luminance(a), luminance(b)];
  const [hi, lo] = x > y ? [x, y] : [y, x];
  return (hi + 0.05) / (lo + 0.05);
};

/** The accessible foreground for text sitting on `hex`. */
export const onColor = (hex: string): string =>
  luminance(hex) > 0.18 ? COLOR.charBlack : COLOR.dustLight;

/** A brand hue used as TEXT, made safe for the surface it sits on.
 *
 *  Identity hues are chosen for meaning, not legibility: mopane brown reads
 *  2.19:1 on char black and mahangu gold 1.57:1 on cream. Pass the hue and the
 *  surface, and get the hue back only when it actually clears 4.5:1 — otherwise
 *  the surface's own text colour, so the label stays readable and the hue keeps
 *  doing its job on the mark beside it.
 *
 *  Prefer `useInkOn(hex)` from the primitives, which reads the surface from
 *  `SurfaceProvider` instead of taking it as an argument. Naming the surface
 *  here bakes in an assumption that is wrong — silently — the moment the
 *  component is rendered on a different ground.
 */
export const inkOn = (hex: string, surface: string, isDark = false): string =>
  contrast(hex, surface) >= 4.5 ? hex : roles(isDark).text;

/** True when `hex` can host small text at all. Fired red cannot: its best
 *  foreground reaches 3.85:1. Use it to pick a filled or outlined treatment. */
export const canHostText = (hex: string): boolean => contrast(onColor(hex), hex) >= 4.5;

// ─── Charts ───────────────────────────────────────────────────────────────────
// Fixed series order. Take colors from the front; never reorder or substitute,
// so the same series index reads the same across every chart in a product.
export const CHART_SERIES = [
  COLOR.ochreOrange,
  COLOR.barkRust,
  COLOR.mahanguGold,
  COLOR.mopaneBrown,
  COLOR.dyePlum,
  COLOR.firedRed
] as const;

// ─── Machine-readable policy ──────────────────────────────────────────────────
// What each palette token is allowed to do. Read this before reaching for a
// token that is not already behind a role. Mirrors the table in DESIGN_SYSTEM.md
// §4 so docs and code cannot drift apart.
export const COLOR_POLICY: Record<keyof typeof COLOR, { allowed: string; never: string }> = {
  milletClay: {
    allowed: 'Light canvas; text and icons on any dark surface; the label on mopane, plum and bark rust fills; the accent hover fill in dark mode.',
    never: 'A fill on a light surface — it disappears.'
  },
  dustLight: {
    allowed: 'Lifted surface on the light canvas: cards, panels, bands.',
    never: 'Text, borders, or any action.'
  },
  charBlack: {
    allowed: 'Ink: text, and lines via the alpha ramp; the label on ochre and gold fills; inverse surfaces (footer, ticker, lab card); the danger hover fill.',
    never: 'The primary action fill — a black primary makes chrome the heaviest thing on the screen. The dark-mode canvas — use darkBg.'
  },
  ochreOrange: {
    allowed: 'A FILL with char black on it (5.5:1): the primary action, checked control, active tab. INK on dark surfaces only (6.1:1): link, focus ring, ghost hover. Also Okaanda.',
    never: 'Ink on a light surface — 2.4:1. Use bark rust there. Never body text at any size.'
  },
  firedRed: {
    allowed: 'Critical status marks, invalid field borders and the danger button edge, where the 3:1 non-text floor applies.',
    never: 'A fill behind small text — its best foreground is 4.05:1. Never error message text. Never a second general-purpose accent.'
  },
  mahanguGold: {
    allowed: 'The accent action fill (8.4:1 with char black) with a mopane edge; the primary hover fill in dark mode; caution status; Ombiga; chart series 3.',
    never: 'Light-mode body text or any small type — 1.6:1 on cream. Never millet clay on it.'
  },
  barkRust: {
    allowed: 'The accent as INK on light surfaces (5.6:1): link, focus ring, ghost hover, field focus. The danger fill, with millet clay on it; the edge of the primary action. Also Oshini and chart series 2.',
    never: 'A surface or a large decorative fill.'
  },
  mopaneBrown: {
    allowed: 'The primary hover fill with millet clay (6.1:1) and the accent edge, light mode only; settled status on light surfaces; Etiti; chart series 4.',
    never: 'Picked directly for chrome — read the role. Never on a dark card — 2.25:1. Use mopaneBrownLight.'
  },
  mopaneBrownLight: {
    allowed: 'Settled status and Etiti on dark surfaces, where the base tone loses contrast.',
    never: 'A sixth system color.'
  },
  dyePlum: {
    allowed: 'The accent hover fill with millet clay (5.6:1), light mode; Oshitoo; chart series 5.',
    never: 'A status, a surface, or a resting fill.'
  },
  darkBg: { allowed: 'Dark canvas; the recessed well on a dark card.', never: 'Light mode.' },
  darkCard: { allowed: 'Dark surface: cards, panels.', never: 'Light mode.' },
  darkCardAlt: { allowed: 'The inverse card in dark mode, marked with an ochre edge.', never: 'Light mode.' }
};

// ─── Accent rotation ─────────────────────────────────────────────────────────
// A component takes ONE accent and defaults to the accent ink. So a product
// built entirely from defaults is one colour, and that is how a consumer can
// follow every rule in this repo and still look nothing like the site.
//
// Measured: a studio app using 21 PixelPanels, 12 SectionHeaders and 38
// PixelButtons passed `accent` exactly zero times. Every card, every header
// and every tag came out bark rust, every action ochre. Nothing was wrong
// with it; the default was simply monochrome.
//
// The public site does not work that way. It gives each section its own
// accent by hand — ochre, bark rust, gold, brown, plum — and spends it on the
// dot, the rule and the card marks. This does the same for anything
// enumerable, so distributing colour is the easy path rather than the
// remembered one:
//
//   {items.map((item, i) => <PixelPanel accent={accentFor(i)} … />)}
//
// The order is the site's own, reading down the page.
//
// This is for variety among PEERS — cards in a feed, rows in a list, blocks
// in a section. Where a hue already means something, meaning wins: a system's
// colour comes from SYSTEM_COLOR and a state's from statusFor(). Never rotate
// an accent across items that a reader could mistake for system membership.
export const ACCENT_CYCLE = [
  COLOR.ochreOrange,
  COLOR.barkRust,
  COLOR.mahanguGold,
  COLOR.mopaneBrown,
  COLOR.dyePlum
] as const;

export const accentFor = (index: number): string =>
  ACCENT_CYCLE[((index % ACCENT_CYCLE.length) + ACCENT_CYCLE.length) % ACCENT_CYCLE.length];
