// ─── Onganda Design System — Site Compositions ──────────────────────────────
// The public site's own building blocks, moved into the system.
//
// These seven compositions ARE the brand: the ticker, the editorial section,
// the focus row, the lab card, the contact panel, the stat band, the hero
// edge strips. Until now every one of them lived as private markup inside
// `onganda-public-sites.tsx`, which meant the thing the design system exists
// to describe was the one thing it did not contain. A consumer could import a
// button and a panel and still had to re-derive the brand's actual surfaces
// by eye — which is exactly how a product ends up looking almost-Onganda.
//
// Each is a transcript, not a redesign. The public site imports these, so
// there is one implementation and the rendered output is unchanged; the
// appearance baselines prove it.

import React from 'react';
import { motion } from 'framer-motion';
import { roles, onColor, inkOn, SYSTEMS, SystemEntry, StatEntry } from './onganda-tokens';
import { TYPE, SPACE_SCALE, TEXTURE } from './onganda-type';
import { MOTION, useMotionOK } from './onganda-motion';
import {
  StatCard,
  PixelDot,
  PixelTag,
  PixelCornerMarks,
  WeaveOverlay,
  SectionHeader,
  useIsDark
} from './onganda-primitives';

const label = (c: ReturnType<typeof roles>, tracking = TYPE.eyebrow.tracking) => ({
  fontSize: TYPE.eyebrow.size,
  fontWeight: TYPE.eyebrow.weight,
  letterSpacing: tracking,
  lineHeight: TYPE.eyebrow.lineHeight,
  color: c.textMuted,
  margin: 0
});

// ─── PixelTicker — the full-bleed marquee of system names ───────────────────
// Usage: <PixelTicker />
//
// The black band that cuts across the hero. It is the brand's loudest piece
// of structure and the only place the five system colours appear together,
// so it reads as a legend for everything below it.
//
// Duplicated content plus a -50% translate is what makes the loop seamless;
// the whole strip is aria-hidden because it repeats names available as text.
export type PixelTickerItem = {
  /** the name, in the item's colour */
  label: string;
  /** the quiet reading beside it */
  gloss?: string;
  /** the item's identity hue (an accentFor(i), a system colour) */
  hex: string;
};

export const PixelTicker = ({
  systems = SYSTEMS,
  items,
  gloss,
  className = ''
}: {
  systems?: readonly SystemEntry[];
  /** any product's own items. Without it the ticker runs the five Onganda
   *  systems — which only an Onganda lab page should show. */
  items?: readonly PixelTickerItem[];
  /** the quiet English reading beside each name (systems only) */
  gloss?: (sys: SystemEntry) => string;
  className?: string;
}) => {
  const c = roles(false);
  const moving = useMotionOK();
  const rows: PixelTickerItem[] = items
    ? [...items]
    : systems.map(sys => ({ label: sys.name, gloss: gloss ? gloss(sys) : sys.english, hex: sys.borderHex }));
  return (
    <div
      className={`w-full overflow-hidden border-y ${className}`}
      style={{ background: c.inverse, borderColor: c.line }}
      aria-hidden="true"
    >
      <motion.div
        data-onganda-ticker
        // MOTION.ticker is `as const`; framer wants a mutable keyframe array.
        animate={moving ? { x: [...MOTION.ticker.animate.x] } : undefined}
        transition={{ ...MOTION.ticker.transition }}
        className="flex w-max items-center py-3"
      >
        {[...rows, ...rows].map((row, index) => (
          <div key={`${row.label}-${index}`} className="flex items-center">
            <PixelDot color={row.hex} size={6} />
            <span
              className="ml-3 uppercase"
              style={{
                fontSize: TYPE.label.size,
                fontWeight: TYPE.label.weight,
                letterSpacing: TYPE.label.tracking,
                // The system hue has to survive the black ground: inkOn picks
                // the readable form rather than trusting the raw token.
                color: inkOn(row.hex, c.inverse)
              }}
            >
              {row.label}
            </span>
            <span
              className="ml-2 mr-8 uppercase"
              style={{
                fontSize: TYPE.micro.size,
                fontWeight: TYPE.micro.weight,
                letterSpacing: TYPE.micro.tracking,
                color: roles(true).textMuted
              }}
            >
              {row.gloss}
            </span>
            <div className="mr-8 h-4 w-px" style={{ background: roles(true).line }} />
          </div>
        ))}
      </motion.div>
    </div>
  );
};

// ─── PixelEditorialSection — label, headline, dither column, prose ──────────
// Usage: <PixelEditorialSection label="Focus" headline="…" accent={…}>…</…>
//
// The site's reading section. A SectionHeader, then an asymmetric two-column
// grid: a dither rule alone in the left column and the prose in the right.
//
// The empty left column is the composition, not an oversight. It is what
// gives the site its editorial air, and collapsing it to a full-width
// paragraph is the quickest way to make a page look like documentation.
export const PixelEditorialSection = ({
  id,
  label: labelText,
  headline,
  accent,
  children,
  isDark: isDarkProp
}: {
  id?: string;
  label: string;
  headline: string;
  accent?: string;
  children: React.ReactNode;
  isDark?: boolean;
}) => {
  const isDark = useIsDark(isDarkProp);
  const c = roles(isDark);
  const rule = accent ?? c.accentInk;
  return (
    <section id={id} data-onganda-enter="" className="mx-auto max-w-7xl px-6 pb-24 md:px-12">
      <SectionHeader label={labelText} headline={headline} accent={rule} isDark={isDark} />
      <div className="grid gap-10 lg:grid-cols-[0.78fr_1.22fr]">
        <div className="hidden lg:block">
        </div>
        <div
          className="space-y-5"
          style={{
            fontSize: TYPE.lead.size,
            lineHeight: TYPE.lead.lineHeight,
            color: c.textMuted
          }}
        >
          {children}
        </div>
      </div>
    </section>
  );
};

// ─── PixelFocusRow — a numbered row in a list of capabilities ───────────────
// Usage: <PixelFocusRow index={0} accent={…} title="Adapt models" icon={…}>…</…>
//
// The horizontal cousin of the feature card: ordinal, icon, title, line. Used
// where a list needs to read as a sequence rather than a grid.
export const PixelFocusRow = ({
  index,
  accent,
  title,
  icon,
  children,
  isDark: isDarkProp
}: {
  /** 0-based position in the list; the row shows index + 1 as its ordinal */
  index: number;
  accent: string;
  title: string;
  icon?: React.ReactNode;
  children?: React.ReactNode;
  isDark?: boolean;
}) => {
  const isDark = useIsDark(isDarkProp);
  const c = roles(isDark);
  return (
    <motion.article
      {...MOTION.fadeUp}
      whileHover={{ x: 4 }}
      className="relative flex gap-5 border p-5"
      style={{ background: c.surface, borderColor: c.line }}
    >
      <PixelTag hex={accent} label={String(index + 1).padStart(2, '0')} isDark={isDark} />
      {icon && <div className="shrink-0 pt-1">{icon}</div>}
      <div>
        <h3 style={{
          fontSize: TYPE.title.size,
          fontWeight: TYPE.title.weight,
          lineHeight: TYPE.title.lineHeight,
          color: c.text,
          margin: 0
        }}>{title}</h3>
        {children && (
          <p style={{
            fontSize: TYPE.body.size,
            lineHeight: TYPE.body.lineHeight,
            color: c.textMuted,
            margin: '8px 0 0'
          }}>{children}</p>
        )}
      </div>
    </motion.article>
  );
};

// ─── PixelLabCard — the inverted card that closes a grid ────────────────────
// Usage: <PixelLabCard tag="Lab" title="Onganda" footer={<IconCheck/>}>…</…>
//
// The black cell in the systems grid. A full-width accent bar carrying a tiny
// label, the name, the line, and a mark in the corner. It is the grid's
// full stop: use one, in the last cell.
export const PixelLabCard = ({
  tag,
  title,
  accent,
  footer,
  children
}: {
  tag: string;
  title: string;
  accent: string;
  footer?: React.ReactNode;
  children?: React.ReactNode;
}) => {
  const light = roles(false);
  const dark = roles(true);
  return (
    <motion.article
      {...MOTION.fadeUp}
      {...MOTION.hoverLift}
      className="relative flex min-h-[320px] flex-col justify-between overflow-hidden p-8"
      style={{ background: light.inverse, color: light.textOnInverse }}
    >
      <WeaveOverlay isDark opacity={TEXTURE.inverse} />
      <div className="relative">
        {/* A filled bar, not a tag: at this size the label needs the whole
            width to register against the black. */}
        <div className="w-full" style={{ background: accent, height: 28 }}>
          <span
            className="ml-3 uppercase"
            style={{
              fontSize: TYPE.micro.size,
              fontWeight: TYPE.micro.weight,
              letterSpacing: TYPE.eyebrow.tracking,
              color: onColor(accent),
              lineHeight: '28px'
            }}
          >
            {tag}
          </span>
        </div>
        <h3 style={{
          fontSize: TYPE.headline.size,
          fontWeight: TYPE.headline.weight,
          lineHeight: TYPE.headline.lineHeight,
          color: light.textOnInverse,
          margin: `${SPACE_SCALE['8']}px 0 0`
        }}>{title}</h3>
        {children && (
          <p style={{
            fontSize: TYPE.body.size,
            lineHeight: TYPE.body.lineHeight,
            color: dark.textMuted,
            margin: `${SPACE_SCALE['5']}px 0 0`
          }}>{children}</p>
        )}
      </div>
      {footer}
    </motion.article>
  );
};

// ─── PixelContactPanel — the closing inquiry surface ────────────────────────
// Usage: <PixelContactPanel eyebrow="Contact" headline="Start a conversation."
//          icon={<IconMail/>} aside={<p>…</p>}>{fields}</PixelContactPanel>
//
// The site's last surface, and deliberately the largest: a wide card with
// corner marks, a heading column and a form column. A page that ends in a
// thin footer link instead of this reads as unfinished.
// Renders its own full-width <section> and max-w-7xl container, like
// PixelEditorialSection. Place it straight in the page; wrapping it in another
// padded container indents it from every other section.
export const PixelContactPanel = ({
  id,
  eyebrow,
  headline,
  icon,
  accent,
  aside,
  children,
  isDark: isDarkProp
}: {
  /** anchor target — the page's own "get in touch" links point here */
  id?: string;
  eyebrow: string;
  headline: string;
  icon?: React.ReactNode;
  accent?: string;
  /** the supporting paragraph under the headline */
  aside?: React.ReactNode;
  /** the form column */
  children: React.ReactNode;
  isDark?: boolean;
}) => {
  const isDark = useIsDark(isDarkProp);
  const c = roles(isDark);
  const rule = accent ?? c.accentInk;
  return (
    <section id={id} data-onganda-enter="" className="px-6 pb-24 md:px-12">
      <div className="mx-auto max-w-7xl">
        <div
          className="relative overflow-hidden border p-8 md:p-12"
          style={{ background: c.surface, borderColor: c.line }}
        >
          <PixelCornerMarks hex={rule} size={10} />
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
            <div>
              <div className="mb-5 flex items-center gap-3">
                {icon}
                <span style={label(c)}>{eyebrow}</span>
              </div>
              <h2 style={{
                fontSize: TYPE.display.size,
                fontWeight: TYPE.display.weight,
                lineHeight: TYPE.display.lineHeight,
                color: c.text,
                margin: 0
              }}>{headline}</h2>
              {aside && (
                <div style={{
                  fontSize: TYPE.bodyLarge.size,
                  lineHeight: TYPE.bodyLarge.lineHeight,
                  color: c.textMuted,
                  marginTop: SPACE_SCALE['6']
                }}>{aside}</div>
              )}
            </div>
            <div className="grid gap-5">{children}</div>
          </div>
        </div>
      </div>
    </section>
  );
};

// ─── PixelEdgeStrips — the drifting colour columns beside a hero ────────────
// Usage: <PixelEdgeStrips />  (inside a relative, overflow-hidden header)
//
// Two narrow columns of palette blocks that creep in opposite directions.
// They are the only place the full palette appears at once, and they run slow
// enough — 16 to 27 seconds a cycle — to read as texture rather than motion.
export const PixelEdgeStrips = ({ hexes }: { hexes: readonly string[] }) => {
  const moving = useMotionOK();
  return (
  <>
    <div className="absolute inset-y-0 left-0 flex w-5 flex-col overflow-hidden" aria-hidden="true">
      {hexes.map((hex, i) => (
        <motion.div
          key={`l-${hex}-${i}`}
          animate={moving ? { y: [0, -80, 0] } : undefined}
          transition={{ duration: 16 + i * 2, repeat: Infinity, ease: 'linear' }}
          className="h-12 w-2"
          style={{ background: hex, opacity: i % 2 ? 0.18 : 0.48 }}
        />
      ))}
    </div>
    <div className="absolute inset-y-0 right-0 flex w-5 flex-col items-end overflow-hidden" aria-hidden="true">
      {[...hexes].reverse().map((hex, i) => (
        <motion.div
          key={`r-${hex}-${i}`}
          animate={moving ? { y: [0, 80, 0] } : undefined}
          transition={{ duration: 17 + i * 2, repeat: Infinity, ease: 'linear' }}
          className="h-12 w-2"
          style={{ background: hex, opacity: i % 2 ? 0.16 : 0.42 }}
        />
      ))}
    </div>
  </>
  );
};

// ─── PixelStatBand — the strip of measured numbers ─────────────────────────
// Usage: <PixelStatBand stats={[{ value: '5', label: '…', sub: '…', hex }]} />
//
// The band under the public site's hero: cells of StatCard divided by
// hairlines, never by a gap, on the raised surface. The gap-less division is
// the whole point — a gap would read as four cards, and this is one object.
//
// It was only ever written inline on the site, so a product wanting the same
// strip had the cell but not the band, and hand-rolled the grid around it.
// Both FirstRung's mentor cockpit and its side panel did exactly that.
export const PixelStatBand = ({
  stats,
  columns,
  isDark: isDarkProp,
  className = ''
}: {
  stats: readonly StatEntry[];
  /** cells per row; defaults to one row on a page, two columns when compact */
  columns?: number;
  isDark?: boolean;
  className?: string;
}) => {
  const isDark = useIsDark(isDarkProp);
  const c = roles(isDark);
  const cols = columns ?? stats.length;
  return (
    <div
      data-onganda-stagger=""
      className={className}
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
        background: c.surface,
        border: `1px solid ${c.line}`
      }}
    >
      {stats.map((stat, i) => (
        <div
          key={stat.label}
          style={{
            // The hairline between cells, and none on the outer edges.
            borderRight: (i + 1) % cols === 0 ? undefined : `1px solid ${c.line}`,
            borderBottom: i < stats.length - (stats.length % cols || cols) ? `1px solid ${c.line}` : undefined
          }}
        >
          <StatCard stat={stat} isDark={isDark} />
        </div>
      ))}
    </div>
  );
};

// ─── PixelFooter — any product's closing band ───────────────────────────────
// OngandaFooter is the lab's own footer: its links, its name, its copy. A
// product needs the same object with its own content — the inverse band, a
// pixel mark, a line, link columns and a fine-print row.
// Usage:
//   <PixelFooter mark={<KinoMark size={24} />} name="Kino" line="For people with more footage than evenings."
//     columns={[{ title: 'Product', links: [{ label: 'How it works', href: '#how' }] }]}
//     fine="© 2026 Kino" />
export type PixelFooterColumn = { title: string; links: { label: string; href: string }[] };

export const PixelFooter = ({
  mark,
  name,
  line,
  columns = [],
  fine,
  accent
}: {
  /** the product's pixel mark, at ICON_SIZE.control */
  mark?: React.ReactNode;
  name: string;
  line?: string;
  columns?: PixelFooterColumn[];
  fine?: React.ReactNode;
  /** the band's top edge; defaults to the accent ink of the dark set */
  accent?: string;
}) => {
  const light = roles(false);
  const dark = roles(true);
  return (
    <footer className="w-full" style={{ background: light.inverse, color: light.textOnInverse, borderTop: `3px solid ${accent ?? dark.accentInk}` }}>
      <div className="mx-auto max-w-7xl px-6 py-14 md:px-12">
        <div className="flex flex-col gap-10 md:flex-row md:justify-between">
          <div className="max-w-sm">
            <div className="flex items-center gap-3">
              {mark}
              <span style={{ fontSize: TYPE.title.size, fontWeight: TYPE.title.weight }}>{name}</span>
            </div>
            {line && <p style={{ margin: '12px 0 0', fontSize: TYPE.body.size, lineHeight: TYPE.body.lineHeight, color: dark.textMuted }}>{line}</p>}
          </div>
          {columns.length > 0 && (
            <div className="grid grid-cols-2 gap-10 sm:grid-cols-3">
              {columns.map(col => (
                <nav key={col.title} aria-label={col.title}>
                  <p className="uppercase" style={{ margin: 0, fontSize: TYPE.label.size, fontWeight: TYPE.label.weight, letterSpacing: TYPE.label.tracking, color: dark.textMuted }}>{col.title}</p>
                  <ul style={{ listStyle: 'none', margin: '12px 0 0', padding: 0 }} className="grid gap-2">
                    {col.links.map(l => (
                      <li key={l.label}><a href={l.href} className="onganda-focus no-underline" style={{ fontSize: TYPE.meta.size, color: light.textOnInverse, ['--onganda-focus' as string]: dark.focusRing } as React.CSSProperties}>{l.label}</a></li>
                    ))}
                  </ul>
                </nav>
              ))}
            </div>
          )}
        </div>
        {fine && <div className="mt-12 pt-6" style={{ borderTop: `1px solid ${dark.line}`, fontSize: TYPE.meta.size, color: dark.textMuted }}>{fine}</div>}
      </div>
    </footer>
  );
};
