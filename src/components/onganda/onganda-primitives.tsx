// ─── Onganda Design System — Primitives ──────────────────────────────────────
// All reusable atomic UI components: pixel SVGs, icons, context, section header,
// dither bar, stat card, swatch chip, terminal block, progress bar, flowchart
// node card, field app card, annotation panel, and dark-mode context.
// Import from this file in any Onganda project.

import React, { createContext, useContext, useState, useCallback, useMemo, useEffect, useLayoutEffect } from 'react';
import { motion, MotionConfig } from 'framer-motion';
import { AUTOMATED, MOTION, installReveal } from './onganda-motion';
import { TYPE, TEXTURE } from './onganda-type';
import { WEAVE, COLOR, roles, onColor, contrast, inkOn, STATUS, ColorRoles, DENSITY, DensityName, Density, SystemEntry, FlowNodeEntry, StatEntry, SwatchEntry, TerminalBlock, TerminalLine, SectorApp, PrincipleEntry, GuideAnnotation, PixelRule, FooterLink, GUIDE_PALETTE_SWATCHES, FOOTER_DITHER_SWATCHES, FOOTER_LINKS } from './onganda-tokens';

// ─── Dark Mode Context ────────────────────────────────────────────────────────
export const DarkContext = createContext<{
  isDark: boolean;
  toggle: () => void;
}>({
  isDark: false,
  toggle: () => {}
});
export const useDark = () => useContext(DarkContext);

/**
 * Resolve a control's mode: the explicit prop wins, otherwise the surrounding
 * DarkProvider decides.
 *
 * DarkProvider existed to hold the toggle, but no control read it, so every
 * call site threaded `isDark={isDark}` by hand — dozens of times in a single
 * product, and one missed thread is a control resolving its hover against the
 * wrong ground. Passing the prop still works and still wins.
 */
export const useIsDark = (explicit?: boolean) => {
  const { isDark } = useContext(DarkContext);
  return explicit ?? isDark;
};

// ─── DarkProvider — ready-made context wrapper with localStorage persistence ──
// Usage: <DarkProvider><App /></DarkProvider>
export const DarkProvider = ({
  children,
  defaultDark = false,
  storageKey = 'onganda-dark'
}: {
  children: React.ReactNode;
  defaultDark?: boolean;
  storageKey?: string;
}) => {
  const [isDark, setIsDark] = useState(() => {
    try {
      const stored = localStorage.getItem(storageKey);
      return stored !== null ? stored === '1' : defaultDark;
    } catch {
      return defaultDark;
    }
  });
  const toggle = useCallback(() => setIsDark(prev => {
    const next = !prev;
    try {
      localStorage.setItem(storageKey, next ? '1' : '0');
    } catch { /* storage unavailable (SSR, private mode) */ }
    return next;
  }), [storageKey]);
  // Mark the document so the CSS tokens (tokens.css) follow the same toggle
  // the components read. Without it, anything styled with
  // var(--onganda-surface) stayed light while the React tree went dark.
  useEffect(() => {
    if (typeof document === 'undefined') return;
    document.documentElement.setAttribute('data-onganda-theme', isDark ? 'dark' : 'light');
  }, [isDark]);
  // Entrances start when an element comes into view, not when it is
  // inserted — see installReveal. Layout effect, so the observer is in place
  // before the first paint and nothing flashes in and out.
  useLayoutEffect(() => installReveal(), []);
  // framer-motion ignores prefers-reduced-motion unless told otherwise, so
  // every MOTION entrance slid in for viewers who had asked for less. "user"
  // drops the transform and keeps the fade.
  return <MotionConfig reducedMotion="user"><DarkContext.Provider value={{
    isDark,
    toggle
  }}>{children}</DarkContext.Provider></MotionConfig>;
};

// ─── Px — pixel SVG primitive ─────────────────────────────────────────────────
// Usage: <Px size={48} viewBox="0 0 24 24">…rects…</Px>
//
// Pixel art is only pixel art at a whole multiple of its grid. The interface
// icons are drawn on 12 cells; rendered at the old 16px default, each cell
// was 1.33 screen pixels, so edges smeared and rows came out uneven — the
// marks read as blurry specks rather than as the system's pixel language.
// `size` snaps to the nearest whole multiple of the grid (16 → 12, 20 → 24,
// 28 → 24) and the rects render crisp. Use ICON_SIZE so you never guess.
export const Px = ({
  children,
  size = 48,
  viewBox = '0 0 24 24'
}: {
  children: React.ReactNode;
  size?: number;
  viewBox?: string;
}) => {
  const [, , w, h] = viewBox.split(/\s+/).map(Number);
  const square = w === h && Number.isInteger(w) && w > 0;
  const px = square ? Math.max(1, Math.round(size / w)) * w : size;
  return <svg width={px} height={px} viewBox={viewBox} fill="none" stroke="none" shapeRendering="crispEdges" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    {children}
  </svg>;
};

/** Icon sizes that stay on the pixel grid. Interface icons (`Icon*`) are
 *  drawn on 12 cells, so every step here is crisp for them. The five system
 *  icons (`IconOkaanda`… and `systemIconForName`) are drawn on 24 cells: use
 *  `control` (24) or `hero` (48) for those — `feature` (36) snaps to 48.
 *  - inline:  in a button, a tag, a line of text
 *  - control: nav items, toolbars, list rows
 *  - feature: inside a PixelIconTile on a card, a drop zone, an empty state
 *  - hero:    a system card
 *  - display: a page's lead illustration — a hero, a landing section, an
 *             empty state that is the whole screen (96: crisp on both grids) */
export const ICON_SIZE = { inline: 12, control: 24, feature: 36, hero: 48, display: 96 } as const;

// ─── PixelIconTile — the framed pixel icon that opens a card ────────────────
// The system card opens with its icon in a tile edged in the system's colour.
// That tile is where most of a screen's pixel art lives — products without it
// put a 12px glyph beside a label and the page reads as unbranded. Give a
// feature card, a drop zone or an empty state one tile.
// Usage: <PixelIconTile hex={accentFor(0)}><IconUpload size={ICON_SIZE.feature} color={accentFor(0)} /></PixelIconTile>
export const PixelIconTile = ({
  hex,
  children,
  className = '',
  ...rest
}: {
  /** the card's accent — the tile takes it as a faint edge and wash */
  hex: string;
  children: React.ReactNode;
  className?: string;
} & React.HTMLAttributes<HTMLDivElement>) => (
  <div
    {...rest}
    data-onganda-tile=""
    className={`inline-flex shrink-0 items-center justify-center ${className}`}
    // The wash appends alpha to a #rrggbb hex. Anything else (a role in
    // rgba(), a CSS variable) gets a hairline in that colour and no wash,
    // rather than an invalid declaration that silently drops the edge.
    style={{
      border: `1px solid ${/^#[0-9a-f]{6}$/i.test(hex) ? `${hex}40` : hex}`,
      background: /^#[0-9a-f]{6}$/i.test(hex) ? `${hex}14` : 'transparent',
      padding: 12,
      ...rest.style
    }}
  >
    {children}
  </div>
);

// ─── PixelDot — single 2×2 or n×n pixel mark ─────────────────────────────────
// Usage: <PixelDot color="#D9791F" size={5} />
// `ring` draws a hairline edge. A status hue below 3:1 against its surface
// (mahangu gold on cream is 1.6:1) needs one to be delineated at all.
export const PixelDot = ({
  color,
  size = 4,
  opacity = 1,
  ring,
  offset,
  live = false,
  ...rest
}: {
  color: string;
  size?: number;
  opacity?: number;
  ring?: string;
  /** nudge down to sit on a text baseline when inline with a line of copy */
  offset?: number;
  /** a live, in-progress state: the mark blinks in two steps (off under
   *  reduced motion). For a running job or an online site, not decoration. */
  live?: boolean;
} & Omit<React.HTMLAttributes<HTMLSpanElement>, 'color'>) => <span aria-hidden="true" data-onganda-live={live ? '' : undefined} {...rest} style={{
  display: 'block',
  width: size,
  height: size,
  background: color,
  opacity,
  flexShrink: 0,
  marginTop: offset,
  boxShadow: ring ? `0 0 0 1px ${ring}` : undefined
}} />;

// ─── DitherBar — horizontal pixel-dither accent bar ──────────────────────────
// Usage: <DitherBar color={c.line} opacity={1} />   (a solid hairline)
export const DitherBar = ({
  color,
  opacity = 0.55,
  className = ''
}: {
  color: string;
  /** retired: the rule is solid now. Accepted so existing calls compile. */
  segments?: number;
  /** retired: a rule is a 1px hairline. Accepted so existing calls compile. */
  height?: number;
  opacity?: number;
  className?: string;
}) => (
  // A solid hairline. This used to render alternating segments — the dotted
  // line — and it was retired as a product decision: repeated under every
  // block, the dots read as fussy and never quite consistent from one section
  // to the next. The API is unchanged so every existing call, including in
  // products pinned to this package, loses the dots without an edit.
  <div
    aria-hidden="true"
    data-onganda-rule
    className={className}
    style={{ height: 1, background: color, opacity }}
  />
);

// ─── DitherStrip — retired ────────────────────────────────────────────────────
// It drew a stepped run of dots. Retired with the dotted rule; it renders
// nothing so pinned products lose the dots without an edit. Do not use it.
/** @deprecated The dotted strip is retired. Remove the call. */
export const DitherStrip = (_props: {
  color?: string;
  opacity?: number;
}) => null;

// ─── PixelTag — small coloured badge  ────────────────────────────────────────
// Usage: <PixelTag hex="#D9791F" label="01" />
export const PixelTag = ({
  hex,
  label,
  isDark,
  className = '',
  ...rest
}: {
  /** the tag's identity or status colour. OMIT IT for metadata.
   *
   *  Colour in a tag means something: which system, which state, which
   *  ordinal. A row of metadata chips — "4 assets", "2.2 MB", "0:06" — is
   *  not identity, and giving each one a hue turns the row into confetti
   *  that a reader tries and fails to decode. Without `hex` the tag is
   *  neutral: outlined in ink, which is how metadata should read. */
  hex?: string;
  label: string;
  isDark?: boolean;
  className?: string;
  // TypeScript does not type-check hyphenated JSX attributes, so `data-testid`
  // on a component compiles and is then silently dropped. Every exported
  // component forwards its rest props for that reason.
} & Omit<React.HTMLAttributes<HTMLDivElement>, 'color'>) => {
  // Chosen by measured luminance, not by comparing against one token. Some
  // fills — fired red tops out at 3.85:1 — cannot host small text at all, so
  // the tag outlines instead of filling and the hue still reads as identity.
  // `transparent` is a valid request for the outlined form.
  // Resolved before the branch: a hook inside the ternary runs conditionally.
  const c = roles(useIsDark(isDark));
  const neutral = hex === undefined;
  const parsable = !neutral && /^#[0-9a-fA-F]{6}$/.test(hex);
  const fg = parsable ? onColor(hex!) : COLOR.charBlack;
  const filled = parsable && contrast(fg, hex!) >= 4.5;
  const style: React.CSSProperties = neutral
    ? { background: 'transparent', border: `1px solid ${c.lineStrong}`, color: c.textMuted }
    : filled
      ? { background: hex, color: fg }
      : { background: 'transparent', border: `1px solid ${parsable ? hex : 'currentColor'}`, color: c.text };
  // Inline by default: a block-level tag stretched to fill any container it
  // sat in, so a hero's "PILOT · 2026" came out as a long bar. The inverse
  // panel and the lab card ask for the full-width band explicitly.
  return <div {...rest} data-onganda-tag={neutral ? 'neutral' : 'identity'} className={`inline-block px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-[0.18em] ${className}`} style={style}>
    {label}
  </div>;
};

// ─── PixelArrowDown — pixel-art downward arrow connector ─────────────────────
// Usage: <PixelArrowDown color="#D9791F" />
export const PixelArrowDown = ({
  color = COLOR.ochreOrange
}: {
  color?: string;
}) => <svg width="12" height="16" viewBox="0 0 6 8" fill="none" aria-hidden="true">
    <rect x="2" y="0" width="2" height="5" fill={color} fillOpacity="0.45" />
    <rect x="1" y="4" width="1" height="1" fill={color} fillOpacity="0.45" />
    <rect x="4" y="4" width="1" height="1" fill={color} fillOpacity="0.45" />
    <rect x="0" y="5" width="1" height="1" fill={color} fillOpacity="0.5" />
    <rect x="2" y="5" width="2" height="1" fill={color} fillOpacity="0.65" />
    <rect x="5" y="5" width="1" height="1" fill={color} fillOpacity="0.5" />
    <rect x="1" y="6" width="4" height="1" fill={color} fillOpacity="0.6" />
    <rect x="2" y="7" width="2" height="1" fill={color} fillOpacity="0.8" />
  </svg>;

// ─── SectionHeader — consistent section label + headline ─────────────────────
// Usage: <SectionHeader label="System Architecture" headline="Five tools. One workshop." />
// ─── SectionHeader — the label/headline rhythm that opens every section ──────
// Usage: <SectionHeader label="Systems" headline="Five systems. One compound."
//          accent={COLOR.mahanguGold} />
//
// Transcribed from the public site. Four parts, in this order, every time: an
// accent dot, a 12px uppercase label, a 30px MEDIUM headline, and a hairline
// rule under the pair. The headline is medium, not semibold — it sits under
// the cards it introduces rather than competing with them.
//
// The accent dot is not decoration: it is how a section declares which colour
// it is allowed to use. Whatever you pass here is the only accent permitted
// in the section below it.
export const SectionHeader = ({
  label,
  headline,
  accent,
  level = 2,
  actions,
  isDark: isDarkProp,
  className = '',
  ...rest
}: {
  label: string;
  headline: string;
  /** the section's one permitted accent; defaults to the accent ink */
  accent?: string;
  /** 1 when this header opens the page. A screen whose first header is its
   *  title needs an <h1>; a page built only from section headers otherwise
   *  has no top of its outline. Same look either way. */
  level?: 1 | 2;
  /** the page or section's actions, aligned to the headline's right — its
   *  one primary and any ghosts. Not a loose link in a corner. */
  actions?: React.ReactNode;
  isDark?: boolean;
  className?: string;
} & React.HTMLAttributes<HTMLDivElement>) => {
  const isDark = useIsDark(isDarkProp);
  const c = roles(isDark);
  const Heading = level === 1 ? 'h1' : 'h2';
  return (
    <div data-onganda-enter="" {...rest} className={`border-b pb-6 mb-12 ${className}`} style={{ borderColor: c.line, ...rest.style }}>
      <div className="mb-3 flex items-center gap-3">
        <PixelDot color={accent ?? c.accentInk} size={7} />
        {/* The eyebrow is a label, not a heading. It was an <h2> while the
            headline below it was a <p>, which put the section's largest text
            outside the display-face rule and the smallest text inside it —
            and gave the section two competing headings in the outline. */}
        <p className="uppercase" style={{
          fontSize: TYPE.eyebrow.size,
          fontWeight: TYPE.eyebrow.weight,
          letterSpacing: TYPE.eyebrow.tracking,
          lineHeight: TYPE.eyebrow.lineHeight,
          color: c.textMuted,
          margin: 0
        }}>
          {label}
        </p>
      </div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <Heading className="max-w-4xl" style={{
          fontSize: TYPE.pageTitle.size,
          fontWeight: TYPE.pageTitle.weight,
          lineHeight: TYPE.pageTitle.lineHeight,
          color: c.text,
          margin: 0
        }}>
          {headline}
        </Heading>
        {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
      </div>
    </div>
  );
};

// ─── WeaveOverlay — Oshiwambo basket-weave texture overlay ───────────────────
// Usage: <WeaveOverlay isDark opacity={0.055} />
export const WeaveOverlay = ({
  isDark: isDarkProp,
  opacity = TEXTURE.surface,
  ...rest
}: {
  isDark?: boolean;
  /** a step of TEXTURE, not a free number. Off-scale values compiled fine
   *  and only `check:tokens` caught them, after the fact; the union catches
   *  them in the editor. Texture belongs to grounds and inverse panels and
   *  never stacks. */
  opacity?: (typeof TEXTURE)[keyof typeof TEXTURE];
} & React.HTMLAttributes<HTMLDivElement>) => {
  const isDark = useIsDark(isDarkProp);
  return <div aria-hidden="true" data-onganda-paper-texture {...rest} className="absolute inset-0 pointer-events-none" style={{
    backgroundImage: isDark ? WEAVE.dark : WEAVE.light,
    backgroundSize: WEAVE.size,
    opacity
  }} />;
};

// ─── PixelCornerMarks — four pixel corner accents on a box ───────────────────
// Usage: <PixelCornerMarks hex="#D9791F" />  (wrap a relative-positioned parent)
export const PixelCornerMarks = ({
  hex,
  size = 10
}: {
  hex: string;
  size?: number;
}) => <>
    <div aria-hidden="true" className="absolute top-0 left-0" style={{
    width: size,
    height: size,
    background: hex
  }} />
    <div aria-hidden="true" className="absolute top-0 right-0" style={{
    width: size,
    height: size,
    background: hex
  }} />
    <div aria-hidden="true" className="absolute bottom-0 left-0" style={{
    width: size,
    height: size,
    background: hex,
    opacity: 0.5
  }} />
    <div aria-hidden="true" className="absolute bottom-0 right-0" style={{
    width: size,
    height: size,
    background: hex,
    opacity: 0.5
  }} />
  </>;

// ─── Canonical system icons ───────────────────────────────────────────────────
export const IconOkaanda = ({
  size = 48
}: {
  size?: number;
}) => <Px size={size}>
    <rect x="11" y="1" width="2" height="1" fill="#D9791F" />
    <rect x="10" y="2" width="4" height="1" fill="#D9791F" />
    <rect x="9" y="3" width="6" height="1" fill="#D9791F" />
    <rect x="8" y="4" width="8" height="1" fill="#C84A1B" />
    <rect x="7" y="5" width="10" height="1" fill="#8F3E21" />
    <rect x="8" y="6" width="8" height="8" fill="#D9791F" />
    <rect x="8" y="6" width="1" height="8" fill="#C84A1B" />
    <rect x="15" y="6" width="1" height="8" fill="#C84A1B" />
    <rect x="10" y="7" width="1" height="1" fill="#8F3E21" fillOpacity="0.6" />
    <rect x="13" y="8" width="1" height="1" fill="#8F3E21" fillOpacity="0.6" />
    <rect x="10" y="10" width="1" height="1" fill="#8F3E21" fillOpacity="0.6" />
    <rect x="13" y="11" width="1" height="1" fill="#8F3E21" fillOpacity="0.6" />
    <rect x="7" y="14" width="10" height="2" fill="#8F3E21" />
    <rect x="8" y="16" width="2" height="5" fill="#6A4B2E" />
    <rect x="11" y="16" width="1" height="4" fill="#6A4B2E" />
    <rect x="13" y="16" width="1" height="4" fill="#6A4B2E" />
    <rect x="14" y="16" width="2" height="5" fill="#6A4B2E" />
    <rect x="7" y="21" width="10" height="1" fill="#1E1A17" fillOpacity="0.18" />
  </Px>;
export const IconOshini = ({
  size = 48
}: {
  size?: number;
}) => <Px size={size}>
    <rect x="10" y="1" width="4" height="1" fill="#8F3E21" />
    <rect x="11" y="2" width="2" height="1" fill="#8F3E21" />
    <rect x="11" y="3" width="2" height="9" fill="#6A4B2E" />
    <rect x="9" y="11" width="6" height="1" fill="#8F3E21" />
    <rect x="10" y="12" width="4" height="2" fill="#8F3E21" />
    <rect x="5" y="14" width="14" height="1" fill="#8F3E21" />
    <rect x="5" y="15" width="2" height="6" fill="#8F3E21" />
    <rect x="17" y="15" width="2" height="6" fill="#8F3E21" />
    <rect x="7" y="15" width="10" height="6" fill="#DFAE2B" />
    <rect x="8" y="17" width="8" height="3" fill="#C84A1B" fillOpacity="0.30" />
    <rect x="6" y="21" width="12" height="1" fill="#6A4B2E" />
    <rect x="7" y="22" width="10" height="1" fill="#6A4B2E" />
    <rect x="6" y="23" width="12" height="1" fill="#1E1A17" fillOpacity="0.15" />
  </Px>;
export const IconOmbiga = ({
  size = 48
}: {
  size?: number;
}) => <Px size={size}>
    {/* Bail handle arc — two side posts */}
    <rect x="8" y="1" width="1" height="2" fill="#8F3E21" />
    <rect x="15" y="1" width="1" height="2" fill="#8F3E21" />
    {/* Lid — flat dome */}
    <rect x="9" y="3" width="6" height="1" fill="#DFAE2B" />
    <rect x="8" y="4" width="8" height="1" fill="#DFAE2B" />
    <rect x="11" y="2" width="2" height="2" fill="#DFAE2B" />
    {/* Lid knob */}
    <rect x="11" y="1" width="2" height="1" fill="#D9791F" />
    {/* Pot body — wide belly */}
    <rect x="7" y="5" width="10" height="1" fill="#D9791F" />
    <rect x="6" y="6" width="12" height="8" fill="#DFAE2B" />
    <rect x="6" y="6" width="1" height="8" fill="#D9791F" fillOpacity="0.55" />
    <rect x="17" y="6" width="1" height="8" fill="#D9791F" fillOpacity="0.55" />
    {/* Texture bands */}
    <rect x="6" y="8" width="12" height="1" fill="#8F3E21" fillOpacity="0.25" />
    <rect x="6" y="11" width="12" height="1" fill="#8F3E21" fillOpacity="0.25" />
    {/* Belly highlight dots */}
    <rect x="9" y="7" width="1" height="1" fill="#C84A1B" fillOpacity="0.35" />
    <rect x="14" y="9" width="1" height="1" fill="#C84A1B" fillOpacity="0.35" />
    {/* Lower taper */}
    <rect x="7" y="14" width="10" height="1" fill="#D9791F" />
    <rect x="8" y="15" width="8" height="1" fill="#8F3E21" />
    <rect x="9" y="16" width="6" height="1" fill="#8F3E21" />
    {/* Three legs */}
    <rect x="8" y="17" width="2" height="4" fill="#6A4B2E" />
    <rect x="11" y="17" width="2" height="4" fill="#6A4B2E" />
    <rect x="14" y="17" width="2" height="4" fill="#6A4B2E" />
    {/* Shadow */}
    <rect x="7" y="21" width="8" height="1" fill="#1E1A17" fillOpacity="0.15" />
  </Px>;
export const IconEtiti = ({
  size = 48
}: {
  size?: number;
}) => <Px size={size}>
    {/* Wide shallow bowl — open top */}
    <rect x="4" y="8" width="16" height="1" fill="#8F3E21" />
    {/* Inner cavity — deep open top */}
    <rect x="5" y="9" width="14" height="5" fill="#6A4B2E" fillOpacity="0.55" />
    {/* Bowl walls — ochre earthenware */}
    <rect x="3" y="9" width="2" height="6" fill="#D9791F" />
    <rect x="19" y="9" width="2" height="6" fill="#D9791F" />
    <rect x="5" y="9" width="14" height="1" fill="#D9791F" fillOpacity="0.6" />
    {/* Ochre texture swirls on exterior */}
    <rect x="5" y="12" width="14" height="3" fill="#D9791F" />
    <rect x="6" y="13" width="3" height="1" fill="#C84A1B" fillOpacity="0.4" />
    <rect x="11" y="12" width="4" height="1" fill="#8F3E21" fillOpacity="0.35" />
    <rect x="15" y="13" width="3" height="1" fill="#C84A1B" fillOpacity="0.4" />
    {/* Rim lip */}
    <rect x="3" y="15" width="18" height="1" fill="#8F3E21" />
    {/* Handle lugs — ear-style protrusions on each side */}
    <rect x="1" y="10" width="3" height="3" fill="#D9791F" />
    <rect x="20" y="10" width="3" height="3" fill="#D9791F" />
    <rect x="1" y="11" width="1" height="1" fill="#8F3E21" fillOpacity="0.4" />
    <rect x="22" y="11" width="1" height="1" fill="#8F3E21" fillOpacity="0.4" />
    {/* Flat base */}
    <rect x="5" y="16" width="14" height="1" fill="#6A4B2E" />
    <rect x="4" y="17" width="16" height="1" fill="#1E1A17" fillOpacity="0.15" />
  </Px>;
export const IconOshitoo = ({
  size = 48
}: {
  size?: number;
}) => <Px size={size}>
    {/* Narrow neck opening */}
    <rect x="10" y="1" width="4" height="1" fill="#6F4A6E" />
    <rect x="9" y="2" width="6" height="1" fill="#6F4A6E" />
    {/* Neck */}
    <rect x="9" y="3" width="6" height="2" fill="#6F4A6E" />
    <rect x="9" y="3" width="1" height="2" fill="#1E1A17" fillOpacity="0.2" />
    <rect x="14" y="3" width="1" height="2" fill="#1E1A17" fillOpacity="0.2" />
    {/* Shoulder — shoulders widening out */}
    <rect x="7" y="5" width="10" height="1" fill="#6F4A6E" />
    <rect x="6" y="6" width="12" height="1" fill="#6F4A6E" />
    {/* Round belly — widest point */}
    <rect x="5" y="7" width="14" height="7" fill="#6F4A6E" />
    <rect x="5" y="7" width="1" height="7" fill="#1E1A17" fillOpacity="0.22" />
    <rect x="18" y="7" width="1" height="7" fill="#1E1A17" fillOpacity="0.22" />
    {/* Kintsugi crack lines — gold repair marks */}
    <rect x="8" y="8" width="1" height="3" fill="#DFAE2B" fillOpacity="0.55" />
    <rect x="9" y="10" width="3" height="1" fill="#DFAE2B" fillOpacity="0.55" />
    <rect x="14" y="9" width="1" height="2" fill="#DFAE2B" fillOpacity="0.4" />
    <rect x="13" y="11" width="2" height="1" fill="#DFAE2B" fillOpacity="0.4" />
    {/* Lower belly taper */}
    <rect x="6" y="14" width="12" height="1" fill="#6F4A6E" />
    <rect x="7" y="15" width="10" height="1" fill="#8F3E21" fillOpacity="0.6" />
    <rect x="8" y="16" width="8" height="1" fill="#8F3E21" fillOpacity="0.5" />
    {/* Base */}
    <rect x="9" y="17" width="6" height="1" fill="#6A4B2E" />
    <rect x="10" y="18" width="4" height="1" fill="#6A4B2E" />
    {/* Shadow */}
    <rect x="8" y="19" width="8" height="1" fill="#1E1A17" fillOpacity="0.15" />
  </Px>;

// ─── systemIconForName — single source for system name → icon component ───────
// Accepts an optional size so callers never need their own mapping.
export const systemIconForName = (name: string, size = 48): React.ReactElement => {
  if (name === 'Okaanda') return <IconOkaanda size={size} />;
  if (name === 'Oshini')  return <IconOshini  size={size} />;
  if (name === 'Ombiga')  return <IconOmbiga  size={size} />;
  if (name === 'Etiti')   return <IconEtiti   size={size} />;
  return <IconOshitoo size={size} />;
};

// ─── FlowNodeIcon — small icon for flowchart nodes ───────────────────────────
export const FlowNodeIcon = ({
  id,
  hex: _hex
}: {
  id: string;
  hex: string;
}) => {
  if (id === 'root' || id === 'granary') return <IconOkaanda size={24} />;
  if (id === 'mill') return <IconOshini size={24} />;
  if (id === 'vessel') return <IconOmbiga size={24} />;
  if (id === 'surface') return <IconEtiti size={24} />;
  if (id === 'delivery') return <IconOshitoo size={24} />;
  return <IconOkaanda size={24} />;
};

// ─── IconSun / IconMoon — dark mode toggle icons ─────────────────────────────
export const IconSun = () => <Px size={16} viewBox="0 0 12 12">
    <rect x="5" y="0" width="2" height="2" fill="currentColor" />
    <rect x="5" y="10" width="2" height="2" fill="currentColor" />
    <rect x="0" y="5" width="2" height="2" fill="currentColor" />
    <rect x="10" y="5" width="2" height="2" fill="currentColor" />
    <rect x="1" y="1" width="2" height="2" fill="currentColor" fillOpacity="0.6" />
    <rect x="9" y="1" width="2" height="2" fill="currentColor" fillOpacity="0.6" />
    <rect x="1" y="9" width="2" height="2" fill="currentColor" fillOpacity="0.6" />
    <rect x="9" y="9" width="2" height="2" fill="currentColor" fillOpacity="0.6" />
    <rect x="3" y="3" width="6" height="6" fill="currentColor" />
  </Px>;
export const IconMoon = () => <Px size={16} viewBox="0 0 12 12">
    <rect x="4" y="0" width="4" height="2" fill="currentColor" />
    <rect x="2" y="2" width="2" height="2" fill="currentColor" />
    <rect x="0" y="4" width="2" height="4" fill="currentColor" />
    <rect x="2" y="8" width="2" height="2" fill="currentColor" />
    <rect x="4" y="10" width="4" height="2" fill="currentColor" />
    <rect x="8" y="8" width="2" height="2" fill="currentColor" />
    <rect x="6" y="2" width="2" height="2" fill="currentColor" />
    <rect x="10" y="6" width="2" height="2" fill="currentColor" />
    <rect x="6" y="4" width="4" height="4" fill="currentColor" />
    <rect x="4" y="2" width="4" height="8" fill="currentColor" />
  </Px>;

// ─── OngandaLogoMark — brand pixel granary icon ───────────────────────────────
// Usage: <OngandaLogoMark size={28} />
export const OngandaLogoMark = ({
  size = 28
}: {
  size?: number;
}) => <Px size={size} viewBox="0 0 12 12">
    <rect x="5" y="0" width="2" height="1" fill="#D9791F" />
    <rect x="4" y="1" width="4" height="1" fill="#D9791F" />
    <rect x="3" y="2" width="6" height="1" fill="#C84A1B" />
    <rect x="4" y="3" width="4" height="4" fill="#D9791F" />
    <rect x="4" y="3" width="1" height="4" fill="#C84A1B" fillOpacity="0.5" />
    <rect x="7" y="3" width="1" height="4" fill="#C84A1B" fillOpacity="0.5" />
    <rect x="5" y="4" width="1" height="1" fill="#8F3E21" fillOpacity="0.6" />
    <rect x="3" y="7" width="6" height="1" fill="#8F3E21" />
    <rect x="4" y="8" width="1" height="3" fill="#6A4B2E" />
    <rect x="7" y="8" width="1" height="3" fill="#6A4B2E" />
    <rect x="3" y="11" width="6" height="1" fill="#1E1A17" fillOpacity="0.18" />
  </Px>;

// ─── Surface context — what ground am I painted on? ─────────────────────────
// `inkOn(hex, surface)` has to be told the surface, and naming it at the call
// site bakes in an assumption: `inkOn(hex, EDITOR_SURFACE.emberBrown)` is
// wrong the moment that component renders somewhere else, and it fails
// silently. A container declares its ground once and everything inside
// resolves against the real one.
//
//   <SurfaceProvider hex={c.inverse} isDark>
//     <SystemCard … />          ← its labels now resolve against the black card
//   </SurfaceProvider>
// The default stands for "no SurfaceProvider here". It used to be read as a
// light card unconditionally, so under DarkProvider dark every ink choice was
// made against dust light: a stat value came out char black on the dark card
// (1.03:1). With no provider, the surface is the theme's own card.
const IMPLICIT_SURFACE = { hex: COLOR.dustLight, isDark: false };
export const SurfaceContext = createContext<{ hex: string; isDark: boolean }>(IMPLICIT_SURFACE);

export const useSurface = () => {
  const declared = useContext(SurfaceContext);
  const { isDark } = useContext(DarkContext);
  if (declared !== IMPLICIT_SURFACE) return declared;
  return isDark ? { hex: COLOR.darkCard, isDark: true } : IMPLICIT_SURFACE;
};

export const SurfaceProvider = ({
  hex,
  isDark = false,
  children
}: {
  hex: string;
  isDark?: boolean;
  children: React.ReactNode;
}) => {
  const value = useMemo(() => ({ hex, isDark }), [hex, isDark]);
  return <SurfaceContext.Provider value={value}>{children}</SurfaceContext.Provider>;
};

/** `inkOn` for the ground this component is actually on. Prefer this over
 *  passing a surface literal. */
export const useInkOn = () => {
  const { hex, isDark } = useSurface();
  return useCallback((hue: string) => inkOn(hue, hex, isDark), [hex, isDark]);
};

// ─── Focus ring stylesheet ──────────────────────────────────────────────────
// :focus-visible is the only correct way to express "focused by keyboard", and
// it cannot be expressed as an inline style. Shipping it only in style.css
// would mean a consumer who forgets that import loses every focus ring — worse
// than the always-on ring this replaced. So it is injected once at module
// load, and style.css keeps a copy for SSR and for anyone inspecting the CSS.
const FOCUS_STYLE_ID = 'onganda-focus-style';
const FOCUS_CSS = `
.onganda-focus:focus,.onganda-control:focus,.onganda-choice:focus{outline:none}
.onganda-focus:focus-visible,.onganda-control:focus-visible{
  outline:2px solid var(--onganda-focus,#8F3E21);outline-offset:2px}
.onganda-choice:focus-visible + span{
  outline:2px solid var(--onganda-focus,#8F3E21);outline-offset:2px}
`;
if (typeof document !== 'undefined' && !document.getElementById(FOCUS_STYLE_ID)) {
  const el = document.createElement('style');
  el.id = FOCUS_STYLE_ID;
  el.textContent = FOCUS_CSS;
  document.head.appendChild(el);
}

// ─── Density context — how tight is this surface? ───────────────────────────
// The page defaults were dropped unchanged into a 340px popup and a narrow
// side panel, where a 36px button and a 43px field are oversized and the
// result reads as cramped. Density belongs to the SURFACE: a container
// declares it once and every control inside tightens together.
//
//   <DensityProvider value="compact">   ← popups, side panels, toolbars
//     <PixelButton>Save</PixelButton>
//   </DensityProvider>
export const DensityContext = createContext<DensityName>('comfortable');

export const useDensity = (): Density => DENSITY[useContext(DensityContext)];

export const DensityProvider = ({
  value,
  children
}: {
  value: DensityName;
  children: React.ReactNode;
}) => <DensityContext.Provider value={value}>{children}</DensityContext.Provider>;

// ─── Controls — buttons, fields, and choice controls ─────────────────────────
// Every control reads the role layer (onganda-roles.ts). No control picks a
// palette token directly, so a theme change or a mode switch moves all of them
// at once. Geometry is sharp: borderRadius is 0 everywhere, without exception.

const CONTROL_TRANSITION = 'background 0.2s, border-color 0.2s, color 0.2s';

// ─── PixelButton ──────────────────────────────────────────────────────────────
// Four intents, one recipe each. `primary` is the page's main action;
// `accent` is the warm in-card action; `ghost` is the quiet alternative;
// `danger` destroys something. A button never invents a fourth colour, and
// `href` renders an <a> with identical styling to the <button>.
export type PixelButtonVariant = 'primary' | 'accent' | 'ghost' | 'danger';

// framer-motion redefines the drag and animation handlers with its own
// signatures. Rather than cast the conflict away, drop them from the public
// surface: a design-system button has no business being a drag source.
export type MotionConflicting =
  | 'onDrag' | 'onDragStart' | 'onDragEnd' | 'onDragEnter' | 'onDragExit'
  | 'onDragLeave' | 'onDragOver' | 'onDrop'
  | 'onAnimationStart' | 'onAnimationEnd' | 'onAnimationIteration'
  | 'onTransitionEnd' | 'color' | 'style' | 'children';

export type PixelButtonProps = {
  children: React.ReactNode;
  variant?: PixelButtonVariant;
  isDark?: boolean;
  disabled?: boolean;
  /** the event is forwarded: a button inside a clickable card needs
   *  stopPropagation, and a bare `() => void` makes that impossible. */
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  href?: string;
  className?: string;
  /** steps up and left 2px onto a hard 4px pixel shadow on hover — the
   *  expressive call to action. Use it on one or two buttons a page, not all. */
  lift?: boolean;
} & Omit<React.HTMLAttributes<HTMLElement>, MotionConflicting>;

const buttonPalette = (variant: PixelButtonVariant, c: ColorRoles) => {
  switch (variant) {
    case 'accent':
      return { bg: c.accentBg, fg: c.accentFg, border: c.accentBorder, hoverBg: c.accentHoverBg, hoverFg: c.accentHoverFg, hoverBorder: c.accentHoverBorder };
    case 'ghost':
      return { bg: 'transparent', fg: c.ghostFg, border: c.ghostBorder, hoverBg: 'transparent', hoverFg: c.ghostHoverFg, hoverBorder: c.ghostHoverBorder };
    case 'danger':
      return { bg: c.dangerBg, fg: c.dangerFg, border: c.dangerBorder, hoverBg: c.dangerHoverBg, hoverFg: c.dangerHoverFg, hoverBorder: c.dangerHoverBorder };
    default:
      return { bg: c.actionBg, fg: c.actionFg, border: c.actionBorder, hoverBg: c.actionHoverBg, hoverFg: c.actionHoverFg, hoverBorder: c.actionHoverBorder };
  }
};

export const PixelButton = ({
  children,
  variant = 'primary',
  isDark,
  disabled = false,
  onClick,
  href,
  lift = false,
  className = '',
  ...rest
}: PixelButtonProps) => {
  const c = roles(useIsDark(isDark));
  const d = useDensity();
  const p = buttonPalette(variant, c);
  // A disabled control RECEDES. Fading the variant's own recipe does the
  // opposite for a filled one: char black at 45% on cream is a solid mid-grey
  // slab, heavier than the live ghost button beside it, so the dead control
  // draws the eye first. Every disabled control takes the same quiet surface
  // instead, whatever variant it was.
  const off = disabled
    ? { bg: c.fieldDisabledBg, fg: c.fieldDisabledText, border: c.line }
    : null;
  const style: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 8,
    padding: d.buttonPadding,
    fontSize: d.buttonFont,
    fontWeight: 500,
    letterSpacing: '0.02em',
    textDecoration: 'none',
    borderRadius: 0,
    border: `1px solid ${off ? off.border : p.border}`,
    background: off ? off.bg : p.bg,
    color: off ? off.fg : p.fg,
    cursor: disabled ? 'not-allowed' : 'pointer',
    transition: CONTROL_TRANSITION,
    // Read by the `:focus-visible` rule in style.css.
    ['--onganda-focus' as string]: c.focusRing
  } as React.CSSProperties;
  const enter = (el: HTMLElement) => {
    if (disabled) return;
    el.style.background = p.hoverBg;
    el.style.color = p.hoverFg;
    el.style.borderColor = p.hoverBorder;
  };
  const leave = (el: HTMLElement) => {
    el.style.background = p.bg;
    el.style.color = p.fg;
    el.style.borderColor = p.border;
  };
  // Focus rings are keyboard-only. Setting them from onFocus put a permanent
  // 2px ring on every button a mouse user clicked, which read as a heavy black
  // outline on everything. `:focus-visible` in the stylesheet is the only
  // correct way to express "focused by keyboard".

  if (href && !disabled) {
    return (
      <motion.a
        data-onganda-button=""
        data-onganda-depth={lift ? 'lift' : undefined}
        {...rest}
        {...MOTION.tap}
        href={href}
        style={style}
        className={`onganda-focus ${className}`}
        onMouseEnter={e => enter(e.currentTarget)}
        onMouseLeave={e => leave(e.currentTarget)}
      >
        {children}
      </motion.a>
    );
  }
  return (
    <motion.button
      data-onganda-button=""
      data-onganda-depth={lift && !disabled ? 'lift' : undefined}
      {...rest}
      {...(disabled ? {} : MOTION.tap)}
      type="button"
      onClick={onClick}
      disabled={disabled}
      style={style}
      className={`onganda-focus ${className}`}
      onMouseEnter={e => enter(e.currentTarget)}
      onMouseLeave={e => leave(e.currentTarget)}
    >
      {children}
    </motion.button>
  );
};

/** Borderless icon action for compact toolbars and in-row controls. */
export const PixelIconButton = ({
  label,
  isDark: isDarkProp,
  disabled = false,
  children,
  ...props
}: Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, MotionConflicting | 'aria-label'> & {
  label: string;
  isDark?: boolean;
  children: React.ReactNode;
}) => {
  const isDark = useIsDark(isDarkProp);
  const c = roles(isDark);
  const d = useDensity();
  return <motion.button
    {...props}
    {...(disabled ? {} : MOTION.tap)}
    type="button"
    aria-label={label}
    title={label}
    disabled={disabled}
    className="onganda-focus"
    style={{
      width: d.controlBox + 16,
      height: d.controlBox + 16,
      display: 'inline-grid',
      placeItems: 'center',
      padding: 0,
      border: 0,
      borderRadius: 0,
      background: 'transparent',
      color: c.textMuted,
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.35 : 1,
      transition: CONTROL_TRANSITION,
      ['--onganda-focus' as string]: c.focusRing
    } as React.CSSProperties}
    onMouseEnter={event => { if (!disabled) { event.currentTarget.style.background = c.surfaceWell; event.currentTarget.style.color = c.accentInk; } }}
    onMouseLeave={event => { event.currentTarget.style.background = 'transparent'; event.currentTarget.style.color = c.textMuted; }}
  >{children}</motion.button>;
};

// ─── Text fields ──────────────────────────────────────────────────────────────
// Transparent ground, 1px line, ochre on focus, fired red when invalid.
// Pass `invalid` rather than styling an error state by hand.
const fieldBase = (c: ColorRoles, invalid: boolean, disabled: boolean, d: Density): React.CSSProperties => ({
  width: '100%',
  background: disabled ? c.fieldDisabledBg : c.fieldBg,
  border: `1px solid ${invalid ? c.fieldBorderInvalid : c.fieldBorder}`,
  borderRadius: 0,
  outline: 'none',
  padding: d.fieldPadding,
  fontFamily: 'Inter, Arial, sans-serif',
  fontSize: d.fieldFont,
  color: disabled ? c.fieldDisabledText : c.fieldText,
  transition: 'border-color 0.2s'
});

const useFieldHandlers = (c: ColorRoles, invalid: boolean) => ({
  onFocus: (e: React.FocusEvent<HTMLElement>) => {
    e.currentTarget.style.borderColor = invalid ? c.fieldBorderInvalid : c.fieldBorderFocus;
  },
  onBlur: (e: React.FocusEvent<HTMLElement>) => {
    e.currentTarget.style.borderColor = invalid ? c.fieldBorderInvalid : c.fieldBorder;
  }
});

interface FieldFlags {
  isDark?: boolean;
  invalid?: boolean;
}

export const PixelInput = ({ isDark, invalid = false, style, ...props }: React.InputHTMLAttributes<HTMLInputElement> & FieldFlags) => {
  const c = roles(useIsDark(isDark));
  const d = useDensity();
  const h = useFieldHandlers(c, invalid);
  return <input
    {...props}
    className={`onganda-control ${props.className ?? ''}`}
    aria-invalid={invalid || undefined}
    onFocus={e => { h.onFocus(e); props.onFocus?.(e); }}
    onBlur={e => { h.onBlur(e); props.onBlur?.(e); }}
    style={{ ...fieldBase(c, invalid, !!props.disabled, d), ['--onganda-focus' as string]: c.focusRing, ...style } as React.CSSProperties}
  />;
};

// ─── PixelInputGroup — a field and its action, as one control ───────────────
// A link field with an "Open" button beside it, a search with "Go". Built by
// hand they come out as two boxes of different heights with a gap between —
// one of the plainest tells of an unfinished screen. The group shares one
// edge and one height.
// Usage: <PixelInputGroup><PixelInput placeholder="https://…" /><PixelButton variant="ghost">Open</PixelButton></PixelInputGroup>
export const PixelInputGroup = ({
  children,
  className = '',
  ...rest
}: {
  children: React.ReactNode;
  className?: string;
} & React.HTMLAttributes<HTMLDivElement>) => (
  <div {...rest} data-onganda-input-group="" className={`flex items-stretch ${className}`}>
    {children}
  </div>
);

export const PixelTextarea = ({ isDark, invalid = false, style, ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement> & FieldFlags) => {
  const c = roles(useIsDark(isDark));
  const d = useDensity();
  const h = useFieldHandlers(c, invalid);
  return <textarea
    {...props}
    className={`onganda-control ${props.className ?? ''}`}
    aria-invalid={invalid || undefined}
    onFocus={e => { h.onFocus(e); props.onFocus?.(e); }}
    onBlur={e => { h.onBlur(e); props.onBlur?.(e); }}
    style={{ ...fieldBase(c, invalid, !!props.disabled, d), minHeight: d.textareaMinHeight, resize: 'vertical', ['--onganda-focus' as string]: c.focusRing, ...style } as React.CSSProperties}
  />;
};

// The native chevron is the last piece of platform chrome that would survive
// inside an Onganda field, so it is replaced with a stepped pixel arrow drawn
// from rects — the same vocabulary as the icons.
const chevron = (hex: string) =>
  `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6'%3E%3Crect x='0' y='0' width='2' height='2' fill='${encodeURIComponent(hex)}'/%3E%3Crect x='2' y='2' width='2' height='2' fill='${encodeURIComponent(hex)}'/%3E%3Crect x='4' y='4' width='2' height='2' fill='${encodeURIComponent(hex)}'/%3E%3Crect x='6' y='2' width='2' height='2' fill='${encodeURIComponent(hex)}'/%3E%3Crect x='8' y='0' width='2' height='2' fill='${encodeURIComponent(hex)}'/%3E%3C/svg%3E")`;

export const PixelSelect = ({ isDark, invalid = false, style, children, className = '', ...props }: React.SelectHTMLAttributes<HTMLSelectElement> & FieldFlags) => {
  const c = roles(useIsDark(isDark));
  const d = useDensity();
  const h = useFieldHandlers(c, invalid);
  return <select
    {...props}
    className={`onganda-control onganda-select ${className}`}
    aria-invalid={invalid || undefined}
    onFocus={e => { h.onFocus(e); props.onFocus?.(e); }}
    onBlur={e => { h.onBlur(e); props.onBlur?.(e); }}
    style={{
      ...fieldBase(c, invalid, !!props.disabled, d),
      cursor: props.disabled ? 'not-allowed' : 'pointer',
      // Fully inline: a consumer that has not loaded style.css would
      // otherwise get the chevron tiled across the whole field.
      appearance: 'none',
      WebkitAppearance: 'none',
      backgroundImage: chevron(props.disabled ? c.fieldDisabledText : c.textMuted),
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'right 12px center',
      backgroundSize: '10px 6px',
      paddingRight: 34,
      ['--onganda-focus' as string]: c.focusRing,
      ...style
    } as React.CSSProperties}
  >{children}</select>;
};

// ─── PixelField — label, hint, and error around any field ─────────────────────
// Wraps a control so every form in every Onganda product labels, hints, and
// errors the same way. The label is the standard uppercase micro-label; the
// error is the only place fired red appears in a form.
export const PixelField = ({
  label,
  hint,
  error,
  htmlFor,
  isDark,
  children,
  className = '',
  ...rest
}: {
  label: string;
  hint?: string;
  error?: string;
  htmlFor?: string;
  isDark?: boolean;
  children: React.ReactNode;
  className?: string;
} & React.HTMLAttributes<HTMLDivElement>) => {
  const c = roles(useIsDark(isDark));
  const d = useDensity();
  return (
    <div {...rest} className={className}>
      <label htmlFor={htmlFor} className="block text-xs font-bold uppercase tracking-[0.15em]" style={{ color: c.textMuted }}>
        {label}
      </label>
      <div style={{ marginTop: d.labelGap }}>{children}</div>
      {hint && !error && <p className="mt-2 text-xs leading-relaxed" style={{ color: c.textMuted }}>{hint}</p>}
      {/* Fired red as text is 3.6:1 — under the floor. The message runs at full
          contrast and the red appears as the marker, so colour is never the
          only thing carrying the error. */}
      {error && (
        <p role="alert" className="mt-2 flex items-start gap-2 text-xs leading-relaxed" style={{ color: c.text }}>
          <PixelDot color={STATUS.critical} size={6} ring={c.line} offset={4} />
          <span>{error}</span>
        </p>
      )}
    </div>
  );
};

// ─── Choice controls — checkbox, radio, toggle ────────────────────────────────
// Drawn as pixel marks on the integer grid, never as a rounded native control.
// Unchecked is a hairline box; checked fills with `controlOn` (ochre). The
// checked colour is the same for all three, so "on" reads identically.

const controlLabelStyle = (c: ColorRoles, disabled: boolean, d: Density): React.CSSProperties => ({
  display: 'inline-flex',
  alignItems: 'flex-start',
  gap: d.labelGap,
  cursor: disabled ? 'not-allowed' : 'pointer',
  opacity: disabled ? 0.45 : 1,
  fontSize: 14,
  lineHeight: 1.5,
  color: c.textBody
});

/** Square box with a stepped pixel check. Sharp corners, ochre when on. */
export const PixelCheckbox = ({
  label,
  isDark,
  className = '',
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { label?: React.ReactNode; isDark?: boolean }) => {
  const c = roles(useIsDark(isDark));
  const d = useDensity();
  const on = !!props.checked;
  const disabled = !!props.disabled;
  return (
    <label className={className} style={controlLabelStyle(c, disabled, d)}>
      <span style={{ position: 'relative', flexShrink: 0, width: d.controlBox, height: d.controlBox, marginTop: 2 }}>
        <input
          {...props}
          type="checkbox"
          className="onganda-choice"
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', margin: 0, opacity: 0, cursor: disabled ? 'not-allowed' : 'pointer', ['--onganda-focus' as string]: c.focusRing } as React.CSSProperties}
        />
        <span
          aria-hidden="true"
          style={{
            display: 'block',
            width: '100%',
            height: '100%',
            borderRadius: 0,
            border: `1px solid ${on ? c.controlOnBorder : c.fieldBorder}`,
            background: on ? c.controlOn : c.fieldBg,
            transition: CONTROL_TRANSITION
          }}
        >
          {on && (
            <svg width={d.controlBox - 2} height={d.controlBox - 2} viewBox="0 0 12 12" fill="none" shapeRendering="crispEdges">
              <rect x="2" y="6" width="2" height="2" fill={c.controlOnFg} />
              <rect x="4" y="8" width="2" height="2" fill={c.controlOnFg} />
              <rect x="6" y="6" width="2" height="2" fill={c.controlOnFg} />
              <rect x="8" y="4" width="2" height="2" fill={c.controlOnFg} />
              <rect x="10" y="2" width="1" height="2" fill={c.controlOnFg} />
            </svg>
          )}
        </span>
      </span>
      {label}
    </label>
  );
};

/** Stepped-octagon frame with a square core. The pixel system has no circles. */
export const PixelRadio = ({
  label,
  isDark,
  className = '',
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { label?: React.ReactNode; isDark?: boolean }) => {
  const c = roles(useIsDark(isDark));
  const d = useDensity();
  const on = !!props.checked;
  const disabled = !!props.disabled;
  const edge = on ? c.controlOnBorder : c.fieldBorder;
  return (
    <label className={className} style={controlLabelStyle(c, disabled, d)}>
      <span style={{ position: 'relative', flexShrink: 0, width: d.controlBox, height: d.controlBox, marginTop: 2 }}>
        <input
          {...props}
          type="radio"
          className="onganda-choice"
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', margin: 0, opacity: 0, cursor: disabled ? 'not-allowed' : 'pointer', ['--onganda-focus' as string]: c.focusRing } as React.CSSProperties}
        />
        <svg aria-hidden="true" width={d.controlBox} height={d.controlBox} viewBox="0 0 12 12" fill="none" shapeRendering="crispEdges" style={{ display: 'block', transition: CONTROL_TRANSITION }}>
          {/* stepped octagon frame */}
          <rect x="3" y="0" width="6" height="1" fill={edge} />
          <rect x="3" y="11" width="6" height="1" fill={edge} />
          <rect x="0" y="3" width="1" height="6" fill={edge} />
          <rect x="11" y="3" width="1" height="6" fill={edge} />
          <rect x="1" y="1" width="2" height="1" fill={edge} />
          <rect x="9" y="1" width="2" height="1" fill={edge} />
          <rect x="1" y="10" width="2" height="1" fill={edge} />
          <rect x="9" y="10" width="2" height="1" fill={edge} />
          <rect x="1" y="2" width="1" height="1" fill={edge} />
          <rect x="10" y="2" width="1" height="1" fill={edge} />
          <rect x="1" y="9" width="1" height="1" fill={edge} />
          <rect x="10" y="9" width="1" height="1" fill={edge} />
          {on && <rect x="4" y="4" width="4" height="4" fill={c.controlOn} />}
        </svg>
      </span>
      {label}
    </label>
  );
};

/** Two-cell mechanical switch. The knob steps between cells; it does not slide. */
export const PixelToggle = ({
  label,
  checked = false,
  disabled = false,
  isDark,
  onChange,
  className = '',
  ...rest
}: {
  label?: React.ReactNode;
  checked?: boolean;
  disabled?: boolean;
  isDark?: boolean;
  onChange?: (next: boolean) => void;
  className?: string;
} & Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onChange' | 'type' | 'color'>) => {
  const c = roles(useIsDark(isDark));
  const d = useDensity();
  const w = d.toggleWidth;
  const h = d.toggleHeight;
  return (
    <button
      {...rest}
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onChange?.(!checked)}
      className={`onganda-focus ${className}`}
      style={{ ...controlLabelStyle(c, disabled, d), alignItems: 'center', background: 'none', border: 'none', padding: 0, ['--onganda-focus' as string]: c.focusRing } as React.CSSProperties}
    >
      <span
        aria-hidden="true"
        style={{
          position: 'relative',
          flexShrink: 0,
          width: w,
          height: h,
          borderRadius: 0,
          border: `1px solid ${checked ? c.controlOnBorder : c.fieldBorder}`,
          background: checked ? c.controlOn : c.fieldBg,
          transition: CONTROL_TRANSITION
        }}
      >
        <span
          style={{
            position: 'absolute',
            top: 2,
            left: checked ? w - h + 2 : 2,
            width: h - 6,
            height: h - 6,
            background: checked ? c.controlOnFg : c.textMuted,
            transition: 'left 0.12s steps(2, end), background 0.2s'
          }}
        />
      </span>
      {label}
    </button>
  );
};

// ─── StatCard — single stat in the research signals bar ──────────────────────
// ─── StatCard — one measured number in a stat band ──────────────────────────
// Usage: <StatCard stat={{ value: '5', label: 'Active systems', sub: '…', hex }} />
//
// The number, its pixel full stop, the label, the qualifier. Cells sit in a
// grid divided by hairlines — never by a gap — as the public site's stat
// strip does it.
//
// Density-aware, because this is exactly the component that broke when a
// product dropped it into a 390px side panel: a 30px numeral with 24px of
// padding needs a page to sit on, and in a narrow column it wrapped into an
// unreadable jumble. Wrap a narrow surface in <DensityProvider value="compact">.
export const StatCard = ({
  stat,
  isDark: isDarkProp
}: {
  stat: StatEntry;
  isDark?: boolean;
}) => {
  const isDark = useIsDark(isDarkProp);
  const inkFor = useInkOn();
  const c = roles(isDark);
  const d = useDensity();
  const compact = d.stackGap <= 12;
  return <motion.div
    // MOTION.entrance, not fadeUp. A stat band is data, and `whileInView`
    // gates visibility on an intersection that never fires when the band is
    // mounted inside an inactive tab panel — FirstRung's mentor cockpit
    // rendered a row of empty cells for exactly that reason. Entrance motion
    // must never decide whether content is legible.
    {...MOTION.entrance}
    // Page density keeps the responsive gutter the stat band was built with;
    // only the compact set is expressed inline.
    className={compact ? 'flex flex-col' : 'flex flex-col gap-1 px-6 py-8 md:px-10'}
    style={compact ? { padding: '16px 14px', gap: 2 } : undefined}
  >
    <div className="flex items-end gap-2" style={{ marginBottom: compact ? 2 : 4 }}>
      <span style={{
        fontSize: compact ? TYPE.headline.size : TYPE.pageTitle.size,
        fontWeight: TYPE.headline.weight,
        lineHeight: 1,
        letterSpacing: '-0.02em',
        color: inkFor(stat.hex)
      }}>{stat.value}</span>
      <PixelDot color={stat.hex} size={compact ? 6 : 8} />
    </div>
    <p style={{
      fontSize: TYPE.body.size,
      lineHeight: TYPE.body.lineHeight,
      color: c.textMuted,
      margin: 0
    }}>{stat.label}</p>
    <p style={{
      fontSize: TYPE.eyebrow.size,
      lineHeight: 1.4,
      color: c.textMuted,
      margin: 0
    }}>{stat.sub}</p>
  </motion.div>;
};

// ─── SwatchChip — single colour swatch with label ────────────────────────────
export const SwatchChip = ({
  swatch
}: {
  swatch: SwatchEntry;
}) => <div className="flex flex-col gap-2">
    <div className="w-full aspect-square border border-[#1E1A17]/10" style={{
    background: swatch.hex
  }} title={swatch.name} aria-label={swatch.name} />
    <div>
      <p className="text-[11px] font-semibold text-[#1E1A17] leading-tight">{swatch.name}</p>
      <p className="text-[10px] text-[#1E1A17]/66 mt-0.5">{swatch.desc}</p>
    </div>
  </div>;

// ─── TerminalCard — syntax-highlighted code block ────────────────────────────
export const TerminalCard = ({
  block
}: {
  block: TerminalBlock;
}) => {
  // Syntax colours sit on char black. Mopane brown reads 2.19:1 there and
  // fired red 3.66:1, so comments become dimmed paper and the accent takes
  // ochre. Only ochre, mahangu gold and paper >=0.52 clear 4.5:1 on this
  // surface, so keyword and accent share a hue by necessity.
  const colorMap: Record<TerminalLine['type'], string> = {
    comment: 'rgba(232,225,207,0.55)',
    keyword: COLOR.ochreOrange,
    string: COLOR.mahanguGold,
    plain: 'rgba(232,225,207,0.78)',
    accent: COLOR.ochreOrange
  };
  return <motion.div initial={AUTOMATED ? false : {
    opacity: 0,
    y: 14
  }} whileInView={{
    opacity: 1,
    y: 0
  }} viewport={{
    once: true,
    margin: '-40px'
  }} transition={{
    duration: 0.5
  }} className="bg-[#1E1A17] overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b" style={{
      borderColor: `${block.tagHex}33`
    }}>
        <div className="flex items-center gap-2.5">
          <div className="flex gap-1.5" aria-hidden="true">
            <div className="w-2.5 h-2.5" style={{
            background: '#D9791F',
            opacity: 0.7
          }} />
            <div className="w-2.5 h-2.5" style={{
            background: '#C84A1B',
            opacity: 0.7
          }} />
            <div className="w-2.5 h-2.5" style={{
            background: '#DFAE2B',
            opacity: 0.7
          }} />
          </div>
          <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#E8E1CF]/55 ml-2">{block.title}</span>
        </div>
        <PixelTag hex={block.tagHex} label={block.tag} />
      </div>
      <div className="px-5 py-5 font-mono text-[12px] leading-6 overflow-x-auto">
        {block.lines.map((line, li) => <div key={`line-${block.tag}-${li}`} style={{
        color: colorMap[line.type],
        minHeight: '1.5rem'
      }}>
            <span>{line.text || '\u00A0'}</span>
          </div>)}
      </div>
    </motion.div>;
};

// ─── SystemCard — system grid card with dark-mode support ─────────────────────
// ─── SystemCard — the five-system card, as the public site builds it ────────
// A transcript of the systems grid on `/` and `/full`. Six parts, in this
// order: an icon tile edged in the system's colour, a numbered tag, the
// Oshiwambo name at 24px, the English reading, the role eyebrow, the line —
// closed by a 3px spine down the left and a dither rule along the bottom.
//
// It carries no shadow. The public site renders zero blurred shadows; this
// card used to cast four different ones and lift on hover, which is Material,
// not Onganda. Depth here is the weave, the hairline and the spine. The card
// moves on hover instead (MOTION.hoverLift) and the spine holds the colour.
export const SystemCard = ({
  sys,
  idx
}: {
  sys: SystemEntry;
  idx: number;
}) => {
  const { isDark } = useDark();
  const c = roles(isDark);
  return <motion.article
    {...MOTION.fadeUp}
    {...MOTION.hoverLift}
    className="relative flex min-h-[320px] flex-col border p-8 cursor-default overflow-hidden"
    style={{ background: c.surface, borderColor: c.line }}
  >
      <WeaveOverlay isDark={isDark} opacity={0.035} />

      <div className="relative mb-8 flex items-start justify-between">
        <div className="border p-3" style={{
          borderColor: `${sys.borderHex}40`,
          background: `${sys.borderHex}14`
        }}>
          {systemIconForName(sys.name, 48)}
        </div>
        <PixelTag hex={sys.borderHex} label={String(idx + 1).padStart(2, '0')} />
      </div>

      <div className="relative">
        <h3 style={{
          fontSize: TYPE.headline.size,
          fontWeight: TYPE.headline.weight,
          lineHeight: TYPE.headline.lineHeight,
          color: c.text,
          margin: 0
        }}>{sys.name}</h3>
        <p style={{
          fontSize: TYPE.meta.size,
          fontWeight: TYPE.meta.weight,
          lineHeight: TYPE.meta.lineHeight,
          color: c.textMuted,
          margin: '4px 0 0'
        }}>{sys.english}</p>
        {/* The role line is muted, not accent-coloured. The site keeps the
            system's hue on the spine, the tag and the dither — putting it on
            the label too is the "colour everywhere" failure the roles exist
            to prevent. */}
        <p className="uppercase" style={{
          fontSize: TYPE.eyebrow.size,
          fontWeight: TYPE.eyebrow.weight,
          letterSpacing: TYPE.eyebrow.tracking,
          lineHeight: TYPE.eyebrow.lineHeight,
          color: c.textMuted,
          margin: '20px 0 0'
        }}>{sys.role}</p>
        <p style={{
          fontSize: TYPE.body.size,
          lineHeight: TYPE.body.lineHeight,
          color: c.textMuted,
          margin: '16px 0 0'
        }}>{sys.desc}</p>
      </div>

      <div aria-hidden="true" className="absolute left-0 top-0 h-full w-[3px]" style={{ background: sys.borderHex }} />
    </motion.article>;
};

// ─── FlowNodeCard — flowchart child node card ─────────────────────────────────
export const FlowNodeCard = ({
  node,
  isHovered
}: {
  node: FlowNodeEntry;
  isHovered: boolean;
}) => {
  const inkFor = useInkOn();
  return <div className="relative w-full bg-[#F3E8C3] overflow-hidden mb-4" style={{
  border: `1px solid ${node.hex}`,
  borderLeftWidth: 4,
  borderLeftColor: node.hex,
  // The accent edge stays; the blur does not.
  boxShadow: isHovered ? `-3px 0 0 0 ${node.hex}` : 'none',
  transition: 'box-shadow 0.2s'
}}>
    <div aria-hidden="true" style={{
    height: 3,
    background: node.hex,
    opacity: isHovered ? 1 : 0.7,
    transition: 'opacity 0.2s'
  }} />
    <div aria-hidden="true" className="absolute top-[3px] left-0 w-2.5 h-2.5" style={{
    background: node.hex
  }} />
    <div className="p-5">
      <div className="flex items-center justify-between mb-4">
        <PixelTag hex={node.hex} label={node.pixelTag} />
        <FlowNodeIcon id={node.id} hex={node.hex} />
      </div>
      <p className="text-[16px] font-semibold tracking-tight text-[#1E1A17] leading-none">{node.oshiwambo}</p>
      <p className="text-xs text-[#1E1A17]/66 font-medium mb-3">{node.english}</p>
      <div className="flex items-center gap-1.5 min-w-0">
        <PixelDot color={node.hex} size={4} />
        <span className="text-[10px] font-bold uppercase tracking-[0.13em] truncate" style={{
        color: inkFor(node.hex)
      }}>
          {node.role}
        </span>
      </div>
    </div>
  </div>;
};

// ─── FieldAppCard — field application card ────────────────────────────────────
export const FieldAppCard = ({
  app,
  idx
}: {
  app: SectorApp;
  idx: number;
}) => {
  const inkFor = useInkOn();
  return <motion.article initial={AUTOMATED ? false : {
  opacity: 0,
  y: 16
}} whileInView={{
  opacity: 1,
  y: 0
}} viewport={{
  once: true,
  margin: '-30px'
}} transition={{
  delay: idx * 0.09,
  duration: 0.48
}} className="relative bg-[#F3E8C3] border border-[#1E1A17]/10 p-7 overflow-hidden group">
    <div className="flex items-start justify-between mb-6">
      <PixelTag hex={app.hex} label={app.tag} />
      <div className="flex gap-0.5" aria-hidden="true">
        <div className="w-2 h-2" style={{
        background: app.hex,
        opacity: 0.4
      }} />
        <div className="w-1 h-2" style={{
        background: app.hex,
        opacity: 0.2
      }} />
      </div>
    </div>
    <h3 className="text-lg font-semibold tracking-tight text-[#1E1A17] leading-none">{app.name}</h3>
    <p className="text-xs font-medium text-[#1E1A17]/66 mb-4">
      <span style={{
      color: inkFor(app.hex)
    }}>{app.oshiwambo}</span>
      <span className="mx-1.5 text-[#1E1A17]/66">·</span>
      <span>{app.sector}</span>
    </p>
    <p className="text-sm text-[#1E1A17]/65 leading-relaxed mb-6">{app.desc}</p>
    <div className="flex items-center gap-1.5">
      <PixelDot color={app.hex} size={6} />
      <span className="text-[10px] font-bold uppercase tracking-[0.15em]" style={{
      color: inkFor(app.hex)
    }}>Active pilot</span>
    </div>
    <div className="absolute left-0 top-0 bottom-0 w-[3px]" style={{
    background: app.hex
  }} aria-hidden="true" />
  </motion.article>;
};

// ─── AnnotationPanel — chart reading guide + pixel rules sidebar ──────────────
export const AnnotationPanel = ({
  annotations,
  rules
}: {
  annotations: GuideAnnotation[];
  rules: PixelRule[];
}) => <div className="lg:w-72 xl:w-80 shrink-0 flex flex-col gap-0">
    <div className="mb-8">
      <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#1E1A17]/66 mb-4">Reading the chart</p>
      <dl className="flex flex-col gap-0 divide-y divide-[#1E1A17]/10">
        {annotations.map(item => <div key={item.label} className="flex flex-col gap-0.5 py-4">
            <dt className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#8F3E21]">{item.label}</dt>
            <dd className="text-sm text-[#1E1A17]/65 leading-relaxed">{item.note}</dd>
          </div>)}
      </dl>
    </div>
    <div className="border border-[#1E1A17]/12 bg-[#F3E8C3] p-5">
      <div className="flex items-center gap-2 mb-4" aria-hidden="true">
        {GUIDE_PALETTE_SWATCHES.map((c, i) => <div key={`guide-sw-${i}`} className="w-2.5 h-2.5" style={{
        background: c
      }} />)}
      </div>
      <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#1E1A17]/66 mb-3">Pixel rules</p>
      <ul className="flex flex-col gap-2">
        {rules.map(item => <li key={item.rule} className="flex items-start gap-2 text-xs text-[#1E1A17]/65 leading-snug">
            <div className="w-1 h-1 mt-1.5 shrink-0 bg-[#D9791F]" aria-hidden="true" />
            <span>{item.rule}</span>
          </li>)}
      </ul>
    </div>
  </div>;

// ─── PrinciplesRow — single brand principle row ───────────────────────────────
export const PrincipleRow = ({
  principle,
  idx
}: {
  principle: PrincipleEntry;
  idx: number;
}) => <motion.div initial={AUTOMATED ? false : {
  opacity: 0,
  x: -10
}} whileInView={{
  opacity: 1,
  x: 0
}} viewport={{
  once: true
}} transition={{
  delay: idx * 0.07
}} className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-8 py-5">
    <dt className="text-xs font-bold uppercase tracking-[0.13em] text-[#8F3E21] w-32 shrink-0">{principle.label}</dt>
    <dd className="text-[#1E1A17]/80 text-base">{principle.value}</dd>
  </motion.div>;

// ─── CodeSnippetBlock — section-bottom code snippet with copy button ──────────
// Usage: <CodeSnippetBlock label="SystemCard" code={...} accentHex="#D9791F" />
export interface CodeSnippetLine {
  type: 'comment' | 'keyword' | 'string' | 'plain' | 'accent' | 'import' | 'tag' | 'prop';
  text: string;
}
export const CodeSnippetBlock = ({
  label,
  lines,
  accentHex = COLOR.ochreOrange
}: {
  label: string;
  lines: CodeSnippetLine[];
  accentHex?: string;
}) => {
  const [copied, setCopied] = React.useState(false);
  const {
    isDark
  } = useDark();
  const colorMap: Record<CodeSnippetLine['type'], string> = {
    // See TerminalCard: this block is char-black in both modes, so the
    // comment tone is dimmed paper rather than a brown that fails on it.
    comment: 'rgba(232,225,207,0.55)',
    keyword: COLOR.ochreOrange,
    string: COLOR.mahanguGold,
    plain: isDark ? 'rgba(232,225,207,0.7)' : 'rgba(232,225,207,0.78)',
    accent: COLOR.ochreOrange,
    import: COLOR.ochreOrange,
    tag: isDark ? 'rgba(232,225,207,0.9)' : 'rgba(232,225,207,0.95)',
    prop: COLOR.mahanguGold
  };
  const rawText = lines.map(l => l.text).join('\n');
  const handleCopy = () => {
    navigator.clipboard.writeText(rawText).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };
  return <motion.div initial={AUTOMATED ? false : {
    opacity: 0,
    y: 10
  }} whileInView={{
    opacity: 1,
    y: 0
  }} viewport={{
    once: true,
    margin: '-20px'
  }} transition={{
    duration: 0.45
  }} style={{
    marginTop: 32,
    background: COLOR.charBlack,
    borderLeft: `3px solid ${accentHex}`,
    position: 'relative',
    overflow: 'hidden'
  }}>
      {/* Header bar */}
      <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '12px 16px',
      borderBottom: `1px solid ${accentHex}22`,
      background: `${accentHex}0a`
    }}>
        <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12
      }}>
          {/* Traffic lights */}
          <div style={{
          display: 'flex',
          gap: 4
        }} aria-hidden="true">
            <div style={{
            width: 8,
            height: 8,
            background: COLOR.ochreOrange,
            opacity: 0.6
          }} />
            <div style={{
            width: 8,
            height: 8,
            background: COLOR.firedRed,
            opacity: 0.6
          }} />
            <div style={{
            width: 8,
            height: 8,
            // onganda-allow: system-colour-as-chrome — decorative dither run, not an interface surface
            background: COLOR.mahanguGold,
            opacity: 0.6
          }} />
          </div>
          <span style={{
          fontSize: 9,
          fontWeight: 700,
          letterSpacing: '0.16em',
          textTransform: 'uppercase',
          color: 'rgba(232,225,207,0.82)',
          opacity: 0.85
        }}>
            {label}
          </span>
          <span style={{
          fontSize: 9,
          fontWeight: 500,
          letterSpacing: '0.10em',
          textTransform: 'uppercase',
          color: 'rgba(232,225,207,0.55)'
        }}>
            snippet
          </span>
        </div>
        <motion.button onClick={handleCopy} whileTap={{
        scale: 0.92
      }} aria-label="Copy code snippet" style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        padding: '4px 12px',
        background: copied ? `${accentHex}22` : 'transparent',
        border: `1px solid ${copied ? accentHex : 'rgba(232,225,207,0.1)'}`,
        color: copied ? COLOR.mahanguGold : 'rgba(232,225,207,0.58)',
        fontSize: 9,
        fontWeight: 700,
        letterSpacing: '0.14em',
        textTransform: 'uppercase',
        cursor: 'pointer',
        transition: 'background 0.2s, border-color 0.2s, color 0.2s'
      }}>
          {/* Copy icon pixel */}
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
            {copied ? <>
                <rect x="1" y="5" width="3" height="2" fill="currentColor" />
                <rect x="2" y="7" width="2" height="1" fill="currentColor" />
                <rect x="3" y="4" width="2" height="2" fill="currentColor" />
                <rect x="5" y="2" width="2" height="3" fill="currentColor" />
              </> : <>
                <rect x="3" y="0" width="6" height="1" fill="currentColor" fillOpacity="0.7" />
                <rect x="3" y="0" width="1" height="7" fill="currentColor" fillOpacity="0.7" />
                <rect x="8" y="0" width="1" height="7" fill="currentColor" fillOpacity="0.7" />
                <rect x="3" y="6" width="6" height="1" fill="currentColor" fillOpacity="0.7" />
                <rect x="1" y="2" width="4" height="1" fill="currentColor" fillOpacity="0.5" />
                <rect x="1" y="2" width="1" height="7" fill="currentColor" fillOpacity="0.5" />
                <rect x="1" y="8" width="5" height="1" fill="currentColor" fillOpacity="0.5" />
                <rect x="5" y="8" width="1" height="1" fill="currentColor" fillOpacity="0.5" />
              </>}
          </svg>
          <span>{copied ? 'Copied!' : 'Copy'}</span>
        </motion.button>
      </div>

      {/* Code body */}
      <div style={{
      padding: '16px 20px',
      fontFamily: 'monospace',
      fontSize: 11,
      lineHeight: 1.75,
      overflowX: 'auto'
    }}>
        {lines.map((line, li) => <div key={`csl-${label}-${li}`} style={{
        color: colorMap[line.type],
        minHeight: '1.75em',
        whiteSpace: 'pre'
      }}>
            {line.text || '\u00A0'}
          </div>)}
      </div>
    </motion.div>;
};

const CURRENT_YEAR = new Date().getFullYear();

// ─── OngandaFooter — site-wide footer ────────────────────────────────────────
export const OngandaFooter = () => <footer className="w-full bg-[#1E1A17] text-[#E8E1CF] py-16 px-6 md:px-12 border-t-[3px] border-[#D9791F]">
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start gap-10 md:gap-0">
        <div>
          <div className="flex items-center gap-2.5 mb-3">
            <OngandaLogoMark size={22} />
            <span className="font-semibold tracking-tight text-base">
              <span className="text-[#D9791F]">Onganda</span>
              <span className="text-[#E8E1CF]/55 mx-1.5">·</span>
              <span className="text-[#E8E1CF]/70 font-normal text-sm">Namibia AI Systems Lab</span>
            </span>
          </div>
          <p className="text-sm text-[#E8E1CF]/55 max-w-xs leading-relaxed">
            A sovereign intelligence workshop. Pixelated by design. Material by palette. Oshiwambo by name. Calm by layout.
          </p>
        </div>
        <nav aria-label="Footer navigation" className="flex flex-col gap-3">
          <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#E8E1CF]/55 mb-1">Navigate</p>
          {FOOTER_LINKS.map(link => <a key={link.label} href={link.href} className="text-sm text-[#E8E1CF]/60 hover:text-[#D9791F] transition-colors duration-200">{link.label}</a>)}
        </nav>
      </div>
      <div className="mt-12 pt-6 border-t border-[#E8E1CF]/10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <p className="text-[11px] text-[#E8E1CF]/55">© {CURRENT_YEAR} Namibia AI Systems Lab. All rights reserved. Names pending linguistic validation.</p>
        <div aria-hidden="true" className="flex gap-0.5">
          {FOOTER_DITHER_SWATCHES.map((c, i) => <div key={`foot-sw-${i}`} className="w-3 h-3" style={{
          background: c,
          opacity: 0.7
        }} />)}
        </div>
      </div>
    </div>
  </footer>;

export const OkaandaLogoMark = OngandaLogoMark;
export const OkaandaFooter = OngandaFooter;
