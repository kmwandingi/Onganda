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
// The roles name palette SLOTS (`P.primary`, `P.primaryInk`), not pigments, so
// the same recipe builds every palette in onganda-palettes.ts. The ratios
// quoted in comments are the Onganda palette's; `npm run check:contrast`
// measures every shipped palette against the same claims (CONTRAST_CLAIMS
// below) and fails on a regression. Two Onganda measurements shape the whole
// set and are worth knowing before you edit it:
//
//   • Ochre orange cannot carry meaning on a light surface. Millet clay on
//     ochre is 2.4:1 and ochre on millet clay is 2.4:1. Ochre works as a FILL
//     with char black on it (5.5:1), and as INK on dark surfaces (6.1:1). On
//     light surfaces the accent ink is bark rust (5.6:1) — the deep ochre.
//   • Fired red cannot host small light text. Its best foreground is 4.05:1,
//     under the 4.5:1 floor. Fired red stays an indicator — status marks and
//     field borders, where the 3:1 non-text threshold applies — and the danger
//     fill is bark rust instead.

import { COLOR, PALETTE as P } from './onganda-colors';
import { PALETTES } from './onganda-palettes';

// ─── Alpha ramp ───────────────────────────────────────────────────────────────
// Text and lines are the brand ink at a fixed set of opacities, not new hues.
// Use these steps only. A step not listed here is drift.
const rgbOf = (hex: string) => [1, 3, 5].map(i => parseInt(hex.slice(i, i + 2), 16)).join(',');
const INK_RGB = rgbOf(P.ink);
const PAPER_RGB = rgbOf(P.paper);
const ink = (a: number) => `rgba(${INK_RGB},${a})`;
const paper = (a: number) => `rgba(${PAPER_RGB},${a})`;

/** The palette's ink at opacity `a` — for a component that needs a step the
 *  roles do not name. Prefer a role; use an ALPHA step for `a`. */
export const inkAlpha = ink;
/** The palette's paper (text on dark) at opacity `a`. Prefer a role. */
export const paperAlpha = paper;

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
  // Depth — hard pixel shadows. Zero blur, offsets on the grid: a stepped
  // block under the surface, the way pixel art draws depth. A blurred shadow
  // is still never allowed. In dark mode the canvas is already the darkest
  // tone, so the step is a faint light offset instead of a dark one.
  /** a sticky bar's foot: a solid band under it */
  shadowBand: string;
  /** a control or card lifted on hover: 4px down and right */
  shadowStep: string;
  /** a raised surface at rest: 8px, faint */
  shadowPlate: string;
}

export const ROLE_LIGHT: ColorRoles = {
  canvas: P.canvas,
  surface: P.surface,
  surfaceWell: P.canvas,
  inverse: P.ink,
  inverseBorder: 'transparent',

  text: P.ink,
  textBody: ink(ALPHA.body.light),
  textMuted: ink(ALPHA.muted.light),
  textFaint: ink(ALPHA.faint.light),
  textOnInverse: P.paper,

  line: ink(ALPHA.line.light),
  lineStrong: ink(ALPHA.lineStrong.light),
  focusRing: P.primaryInk,
  accentInk: P.primaryInk,

  // The primary is ochre, not char black. A black primary made every screen
  // read as a black slab with some cream around it — the heaviest thing on
  // the page was chrome, and the palette's warmth went unused. Measured:
  //   ochre fill, char black label ........ 5.52:1
  //   bark rust edge on dust / millet ..... 5.95 / 5.59:1  (the fill alone is
  //     2.56:1 on dust, so the edge carries the 3:1 boundary)
  //   hover: mopane fill, millet label .... 6.06:1  — the fill deepens to earth
  actionBg: P.primary,
  actionFg: P.ink,
  actionBorder: P.primaryInk,
  actionHoverBg: P.deep,
  actionHoverFg: P.paper,
  actionHoverBorder: P.deep,
  // The in-card action is mahangu gold, the palette's secondary highlight.
  //   gold fill, char black label ......... 8.41:1
  //   mopane edge on dust ................. 6.45:1  (gold alone is 1.68:1)
  //   hover: dye plum fill, millet label .. 5.59:1  — gold's complement
  accentBg: P.secondary,
  accentFg: P.ink,
  accentBorder: P.deep,
  accentHoverBg: P.rare,
  accentHoverFg: P.paper,
  accentHoverBorder: P.rare,
  dangerBg: P.danger,
  dangerFg: P.paper,
  // The fired red edge (3.85:1 on dust) is where "red means danger" lives on
  // the button itself — it is a boundary, so the 3:1 floor applies.
  dangerBorder: P.critical,
  dangerHoverBg: P.ink,
  dangerHoverFg: P.paper,
  dangerHoverBorder: P.ink,
  ghostBorder: ink(ALPHA.control.light),
  ghostFg: P.ink,
  ghostHoverBorder: P.primaryInk,
  ghostHoverFg: P.primaryInk,

  fieldBg: 'transparent',
  fieldText: P.ink,
  fieldPlaceholder: ink(ALPHA.muted.light),
  fieldBorder: ink(ALPHA.control.light),
  fieldBorderHover: ink(ALPHA.controlHover.light),
  fieldBorderFocus: P.primaryInk,
  fieldBorderInvalid: P.critical,
  fieldDisabledBg: ink(0.04),
  fieldDisabledText: ink(ALPHA.faint.light),
  controlOn: P.primary,
  controlOnFg: P.ink,
  controlOnBorder: P.primaryInk,
  shadowBand: `0 8px 0 ${ink(0.03)}`,
  shadowStep: `4px 4px 0 ${ink(0.18)}`,
  shadowPlate: `8px 8px 0 ${ink(0.08)}`
};

export const ROLE_DARK: ColorRoles = {
  canvas: P.darkCanvas,
  surface: P.darkSurface,
  surfaceWell: P.darkCanvas,
  inverse: P.darkInverse,
  inverseBorder: P.primary,

  text: P.paper,
  textBody: paper(ALPHA.body.dark),
  textMuted: paper(ALPHA.muted.dark),
  textFaint: paper(ALPHA.faint.dark),
  textOnInverse: P.paper,

  line: paper(ALPHA.line.dark),
  lineStrong: paper(ALPHA.lineStrong.dark),
  focusRing: P.primary,
  accentInk: P.primary,

  // Ochre on the dark card is 5.68:1 by itself, so the edge matches the fill.
  // Hover lifts to gold (8.66:1 on the card); the in-card accent is gold at
  // rest and lifts to millet clay.
  actionBg: P.primary,
  actionFg: P.ink,
  actionBorder: P.primary,
  actionHoverBg: P.secondary,
  actionHoverFg: P.ink,
  actionHoverBorder: P.secondary,
  accentBg: P.secondary,
  accentFg: P.ink,
  accentBorder: P.secondary,
  accentHoverBg: P.paper,
  accentHoverFg: P.ink,
  accentHoverBorder: P.paper,
  // Bark rust is 2.44:1 on the dark card; the fired red edge is 3.77:1.
  dangerBg: P.danger,
  dangerFg: P.paper,
  dangerBorder: P.critical,
  dangerHoverBg: P.paper,
  dangerHoverFg: P.ink,
  dangerHoverBorder: P.paper,
  ghostBorder: paper(ALPHA.control.dark),
  ghostFg: P.paper,
  ghostHoverBorder: P.primary,
  ghostHoverFg: P.primary,

  fieldBg: 'transparent',
  fieldText: P.paper,
  fieldPlaceholder: paper(ALPHA.muted.dark),
  fieldBorder: paper(ALPHA.control.dark),
  fieldBorderHover: paper(ALPHA.controlHover.dark),
  fieldBorderFocus: P.primary,
  fieldBorderInvalid: P.critical,
  fieldDisabledBg: paper(0.04),
  fieldDisabledText: paper(ALPHA.faint.dark),
  controlOn: P.primary,
  controlOnFg: P.ink,
  controlOnBorder: P.primary,
  shadowBand: `0 8px 0 ${paper(0.04)}`,
  shadowStep: `4px 4px 0 ${paper(0.14)}`,
  shadowPlate: `8px 8px 0 ${paper(0.06)}`
};

/** The role set for the current mode. `const c = roles(isDark)`. */
export const roles = (isDark: boolean): ColorRoles => (isDark ? ROLE_DARK : ROLE_LIGHT);

// ─── System identity ──────────────────────────────────────────────────────────
// The only sanctioned use of mahangu gold, mopane brown, and dye plum, and the
// identity use of bark rust. A colour here means "this belongs to that system"
// — nothing else.
// Under another palette the five identities are its five peer accents.
export const SYSTEM_COLOR = {
  Okaanda: P.peers[0],
  Oshini: P.peers[1],
  Ombiga: P.peers[2],
  Etiti: P.peers[3],
  Oshitoo: P.peers[4]
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
  critical: P.critical,   // error, destructive, blocking
  caution: P.secondary,   // warning, pending, needs attention
  active: P.primary,      // live, running, in progress
  settled: P.deep         // complete, archived, informational
} as const;

export type StatusName = keyof typeof STATUS;

/** Status colour adjusted for the current mode. Mopane brown drops to 2.25:1
 *  on a dark card, so the lighter tone is substituted there. */
export const statusFor = (name: StatusName, isDark: boolean): string =>
  isDark && name === 'settled' ? P.deepLight : STATUS[name];

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
  luminance(hex) > 0.18 ? P.ink : P.surface;

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
export const CHART_SERIES = P.chart;

// ─── Machine-readable policy ──────────────────────────────────────────────────
// What each palette token is allowed to do. Read this before reaching for a
// token that is not already behind a role. Mirrors the table in DESIGN_SYSTEM.md
// §4 so docs and code cannot drift apart. The text describes the Onganda
// pigments; another palette gives each COLOR key the same job (the slot
// comments in onganda-palettes.ts).
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
export const ACCENT_CYCLE = P.peers;

/** On a dark card the cycle reorders so the first three peers get hues that
 *  clear 3:1 as marks — ochre 5.7, gold 8.7, mopane light 3.6 — and the two
 *  that do not (bark rust 2.4, dye plum 2.4) come fourth and fifth, where the
 *  ordinal tag beside them carries the identity. Measured, not guessed. */
export const ACCENT_CYCLE_DARK = P.peersDark;

/** The accent for the i-th peer in a list. Pass the mode: on a dark card the
 *  cycle puts the hues that read first (see ACCENT_CYCLE_DARK). */
export const accentFor = (index: number, isDark = false): string => {
  const cycle = isDark ? ACCENT_CYCLE_DARK : ACCENT_CYCLE;
  return cycle[((index % cycle.length) + cycle.length) % cycle.length];
};

// ─── Contrast claims ─────────────────────────────────────────────────────────
// What every palette must measure, in each mode: [label, foreground role,
// background role, minimum ratio]. WCAG 2.2: 4.5 for small text, 3 for a
// control's boundary. scripts/check-contrast.mjs reads this list from source
// and measures every shipped palette; auditPalette() runs it in the browser.
const AA = 4.5;
const UI = 3;
export const CONTRAST_CLAIMS: readonly (readonly [string, keyof ColorRoles, keyof ColorRoles, number])[] = [
  ['body text on canvas', 'textBody', 'canvas', AA],
  ['body text on surface', 'textBody', 'surface', AA],
  ['body text in a well', 'textBody', 'surfaceWell', AA],
  ['muted text on canvas', 'textMuted', 'canvas', AA],
  ['muted text on surface', 'textMuted', 'surface', AA],
  ['primary text on canvas', 'text', 'canvas', AA],
  ['text on the inverse card', 'textOnInverse', 'inverse', AA],
  ['field text on surface', 'fieldText', 'surface', AA],
  ['placeholder on surface', 'fieldPlaceholder', 'surface', AA],
  ['accent ink on canvas', 'accentInk', 'canvas', AA],
  ['accent ink on surface', 'accentInk', 'surface', AA],
  ['primary button label', 'actionFg', 'actionBg', AA],
  ['primary button label, hover', 'actionHoverFg', 'actionHoverBg', AA],
  ['accent button label', 'accentFg', 'accentBg', AA],
  ['accent button label, hover', 'accentHoverFg', 'accentHoverBg', AA],
  ['danger button label', 'dangerFg', 'dangerBg', AA],
  ['danger button label, hover', 'dangerHoverFg', 'dangerHoverBg', AA],
  ['ghost button label on surface', 'ghostFg', 'surface', AA],
  ['ghost button label, hover', 'ghostHoverFg', 'surface', AA],
  ['checked control glyph', 'controlOnFg', 'controlOn', AA],
  ['field border on surface', 'fieldBorder', 'surface', UI],
  ['field border on canvas', 'fieldBorder', 'canvas', UI],
  ['field border, hover', 'fieldBorderHover', 'surface', UI],
  ['field border, focus', 'fieldBorderFocus', 'surface', UI],
  ['field border, invalid', 'fieldBorderInvalid', 'surface', UI],
  ['focus ring on surface', 'focusRing', 'surface', UI],
  ['focus ring on canvas', 'focusRing', 'canvas', UI],
  ['ghost button border', 'ghostBorder', 'surface', UI],
  ['primary button edge on surface', 'actionBorder', 'surface', UI],
  ['primary button edge on canvas', 'actionBorder', 'canvas', UI],
  ['primary button edge, hover', 'actionHoverBorder', 'surface', UI],
  ['accent button edge on surface', 'accentBorder', 'surface', UI],
  ['accent button edge on canvas', 'accentBorder', 'canvas', UI],
  ['accent button edge, hover', 'accentHoverBorder', 'surface', UI],
  ['danger button edge on surface', 'dangerBorder', 'surface', UI],
  ['danger button edge on canvas', 'dangerBorder', 'canvas', UI],
  ['danger button edge, hover', 'dangerHoverBorder', 'surface', UI],
  ['checked control edge on surface', 'controlOnBorder', 'surface', UI],
  ['checked control edge on canvas', 'controlOnBorder', 'canvas', UI]
];

// A role is a hex or ink/paper at an opacity; composite the latter on its ground.
const solid = (value: string, ground: string): string => {
  const m = value.match(/rgba\((\d+),(\d+),(\d+),([\d.]+)\)/);
  if (!m) return value;
  const a = parseFloat(m[4]);
  const g = [1, 3, 5].map(i => parseInt(ground.slice(i, i + 2), 16));
  return '#' + [m[1], m[2], m[3]].map((c, i) => Math.round(+c * a + g[i] * (1 - a)).toString(16).padStart(2, '0')).join('');
};

/** Measure the active palette against CONTRAST_CLAIMS in both modes. Every
 *  shipped palette passes; run this on a custom one. */
export const auditPalette = () => (['light', 'dark'] as const).flatMap(mode => {
  const r = mode === 'dark' ? ROLE_DARK : ROLE_LIGHT;
  return CONTRAST_CLAIMS.flatMap(([label, fg, bg, min]) => {
    const ground = r[bg].startsWith('#') ? r[bg] : solid(r[bg], r.canvas);
    if (!ground.startsWith('#') || r[fg] === 'transparent') return [];
    const ratio = contrast(solid(r[fg], ground), ground);
    return [{ mode, label, ratio: Math.round(ratio * 100) / 100, min, ok: ratio >= min }];
  });
});

const kebab = (s: string) => s.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();

/** The active palette as CSS custom properties — the colour half of
 *  tokens.css, for both modes. Injected on load for any palette other than
 *  Onganda, and written to dist/package/palettes/<name>.css at build. */
export const paletteCss = (): string => {
  const block = (r: ColorRoles, dark: boolean) => [
    ...Object.entries(r).map(([k, v]) => `  --onganda-${kebab(k)}: ${v};`),
    ...(['active', 'caution', 'critical', 'settled'] as const).map(s => `  --onganda-status-${s}: ${statusFor(s, dark)};`),
    ...(dark ? ACCENT_CYCLE_DARK : ACCENT_CYCLE).map((c, i) => `  --onganda-accent-${i + 1}: ${c};`)
  ].join('\n');
  const pigments = Object.entries(COLOR).map(([k, v]) => `  --onganda-${kebab(k)}: ${v};`).join('\n');
  return `:root {\n${pigments}\n${block(ROLE_LIGHT, false)}\n}\n\n` +
    `:root[data-onganda-theme="dark"],\n[data-theme="dark"],\n.dark {\n${block(ROLE_DARK, true)}\n}\n`;
};

// A palette other than Onganda: point the CSS tokens at it, and audit a
// custom one so a failing pigment is reported where it is chosen.
if (P !== PALETTES.onganda && typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.setAttribute('data-onganda-palette', P.label);
  style.textContent = paletteCss();
  document.head.appendChild(style);
  if (!Object.values(PALETTES).includes(P as never)) {
    const failing = auditPalette().filter(c => !c.ok);
    if (failing.length) {
      console.warn(`[onganda] Palette "${P.label}" fails ${failing.length} contrast claims:\n` +
        failing.map(c => `  ${c.mode}: ${c.label} is ${c.ratio}:1, needs ${c.min}:1`).join('\n'));
    }
  }
}
