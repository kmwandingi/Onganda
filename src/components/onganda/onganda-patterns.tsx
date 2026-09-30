// ─── Onganda Design System — Product Patterns ────────────────────────────────
// The surfaces every real product needs and the showcase did not have: a
// dialog, a table, a notice, an empty state, a loading state, tabs, and a
// progress bar.
//
// These exist because their absence was the biggest leak in the system. An
// agent building a product hits a modal on day one; with nothing here it
// invents one, and the invention is where Onganda stops looking like Onganda.
//
// Every pattern reads roles(isDark), keeps borderRadius 0, uses the pixel
// vocabulary (dither, weave, stepped marks) rather than generic chrome, and
// pairs colour with a second signal so meaning never rests on hue alone.

import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { roles, statusFor, StatusName } from './onganda-tokens';
import { PixelDot, DitherBar, WeaveOverlay, PixelCornerMarks, Px, useDensity, type MotionConflicting } from './onganda-primitives';
import { MOTION, useMotionOK } from './onganda-motion';
import { TYPE, SPACE_SCALE, TEXTURE, RULE } from './onganda-type';

// ─── PixelNotice — inline callout tied to the four status states ─────────────
// Usage: <PixelNotice status="caution" title="Pilot closes Friday">body</PixelNotice>
//
// The status hue appears on the left rule and the dot. The text runs at full
// contrast, so the notice still reads if the colour is not perceived.
export const PixelNotice = ({
  status = 'active',
  title,
  children,
  isDark = false,
  onDismiss,
  className = '',
  ...rest
}: {
  status?: StatusName;
  title: string;
  children?: React.ReactNode;
  isDark?: boolean;
  onDismiss?: () => void;
  className?: string;
  // TypeScript does not type-check hyphenated JSX attributes, so `data-testid`
  // on a component compiles and is then silently dropped. Forwarding the rest
  // keeps test hooks and ARIA attributes working, as PixelPanel and
  // PixelChoice already do.
} & Omit<React.HTMLAttributes<HTMLElement>, 'title' | MotionConflicting>) => {
  const c = roles(isDark);
  const hue = statusFor(status, isDark);
  return (
    <motion.div
      {...rest}
      // Mount entrance, not a scroll-triggered one. A notice usually appears
      // in response to something the user just did; `whileInView` leaves it at
      // opacity 0 until it is scrolled past, which for an alert means never.
      {...MOTION.entrance}
      role={status === 'critical' ? 'alert' : 'status'}
      className={`relative overflow-hidden ${className}`}
      style={{ background: c.surface, borderLeft: `3px solid ${hue}`, border: `1px solid ${c.line}`, borderLeftWidth: 3, borderLeftColor: hue, padding: '16px 20px' }}
    >
      <WeaveOverlay isDark={isDark} opacity={0.026} />
      <div className="relative flex items-start gap-3">
        <PixelDot color={hue} size={8} ring={c.lineStrong} offset={5} />
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold" style={{ color: c.text }}>{title}</p>
          {children && <div className="mt-1.5 text-sm leading-relaxed" style={{ color: c.textBody }}>{children}</div>}
        </div>
        {onDismiss && (
          <button
            type="button"
            onClick={onDismiss}
            aria-label="Dismiss"
            className="shrink-0"
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: c.textMuted, padding: 2, lineHeight: 0 }}
          >
            <Px size={12} viewBox="0 0 12 12">
              <rect x="1" y="1" width="2" height="2" fill="currentColor" />
              <rect x="3" y="3" width="2" height="2" fill="currentColor" />
              <rect x="5" y="5" width="2" height="2" fill="currentColor" />
              <rect x="7" y="7" width="2" height="2" fill="currentColor" />
              <rect x="9" y="9" width="2" height="2" fill="currentColor" />
              <rect x="9" y="1" width="2" height="2" fill="currentColor" />
              <rect x="7" y="3" width="2" height="2" fill="currentColor" />
              <rect x="3" y="7" width="2" height="2" fill="currentColor" />
              <rect x="1" y="9" width="2" height="2" fill="currentColor" />
            </Px>
          </button>
        )}
      </div>
    </motion.div>
  );
};

// ─── PixelDialog — modal with focus trap, escape, and scrim ──────────────────
// Usage: <PixelDialog open={o} onClose={…} title="Delete dataset" footer={…}>
export const PixelDialog = ({
  open,
  onClose,
  title,
  eyebrow,
  children,
  footer,
  isDark = false,
  width = 520
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  eyebrow?: string;
  children?: React.ReactNode;
  footer?: React.ReactNode;
  isDark?: boolean;
  width?: number;
}) => {
  const c = roles(isDark);
  const panel = useRef<HTMLDivElement>(null);
  const restoreTo = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!open) return;
    restoreTo.current = document.activeElement as HTMLElement;
    const focusable = () =>
      Array.from(panel.current?.querySelectorAll<HTMLElement>(
        'a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])'
      ) ?? []);
    focusable()[0]?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { onClose(); return; }
      if (e.key !== 'Tab') return;
      const items = focusable();
      if (!items.length) return;
      const [first, last] = [items[0], items[items.length - 1]];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    };
    document.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
      restoreTo.current?.focus();
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          onMouseDown={e => { if (e.target === e.currentTarget) onClose(); }}
          style={{
            position: 'fixed', inset: 0, zIndex: 100,
            display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24,
            background: 'rgba(30,26,23,0.62)'
          }}
        >
          <motion.div
            ref={panel}
            role="dialog"
            aria-modal="true"
            aria-label={title}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            className="relative w-full overflow-hidden"
            style={{ maxWidth: width, background: c.surface, border: `1px solid ${c.lineStrong}` }}
          >
            <WeaveOverlay isDark={isDark} opacity={0.035} />
            <PixelCornerMarks hex={c.accentInk} size={10} />
            <div className="relative" style={{ padding: '28px 28px 0' }}>
              {eyebrow && (
                <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.18em]" style={{ color: c.textMuted }}>{eyebrow}</p>
              )}
              <h2 className="text-lg font-semibold tracking-tight" style={{ color: c.text }}>{title}</h2>
            </div>
            {children && (
              <div className="relative text-sm leading-relaxed" style={{ color: c.textBody, padding: '16px 28px 0' }}>{children}</div>
            )}
            {footer && (
              <div className="relative mt-7 flex flex-wrap justify-end gap-3" style={{ padding: '20px 28px', borderTop: `1px solid ${c.line}` }}>{footer}</div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// ─── PixelTable — data list with the editorial rhythm, not generic chrome ────
export interface PixelColumn<Row> {
  key: string;
  header: string;
  /** right-align numeric columns and set tabular figures */
  numeric?: boolean;
  width?: string;
  render: (row: Row) => React.ReactNode;
}

export const PixelTable = <Row,>({
  columns,
  rows,
  caption,
  isDark = false,
  rowKey,
  empty
}: {
  columns: PixelColumn<Row>[];
  rows: Row[];
  caption?: string;
  isDark?: boolean;
  rowKey: (row: Row, i: number) => string;
  empty?: React.ReactNode;
}) => {
  const c = roles(isDark);
  if (!rows.length && empty) return <>{empty}</>;
  return (
    <div
      className="w-full overflow-x-auto"
      // A table that scrolls needs to be reachable by keyboard and to say so.
      tabIndex={0}
      role="region"
      aria-label={caption ? `${caption} (scrolls horizontally)` : 'Data table, scrolls horizontally'}
      style={{ border: `1px solid ${c.line}`, background: c.surface }}
    >
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
        {caption && <caption className="px-4 pt-4 pb-2 text-left text-[10px] font-bold uppercase tracking-[0.18em]" style={{ color: c.textMuted }}>{caption}</caption>}
        <thead>
          <tr>
            {columns.map(col => (
              <th
                key={col.key}
                scope="col"
                style={{
                  textAlign: col.numeric ? 'right' : 'left',
                  width: col.width,
                  padding: '12px 16px',
                  borderBottom: `1px solid ${c.lineStrong}`,
                  color: c.textMuted,
                  fontSize: 10, fontWeight: 700,
                  letterSpacing: '0.16em', textTransform: 'uppercase',
                  whiteSpace: 'nowrap'
                }}
              >{col.header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={rowKey(row, i)} style={{ borderBottom: `1px solid ${c.line}` }}>
              {columns.map(col => (
                <td
                  key={col.key}
                  style={{
                    textAlign: col.numeric ? 'right' : 'left',
                    padding: '12px 16px',
                    color: c.textBody,
                    fontVariantNumeric: col.numeric ? 'tabular-nums' : undefined
                  }}
                >{col.render(row)}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// ─── PixelEmptyState — the surface a product shows most often on day one ─────
export const PixelEmptyState = ({
  title,
  body,
  action,
  icon,
  isDark = false,
  ...rest
}: {
  title: string;
  body?: string;
  action?: React.ReactNode;
  icon?: React.ReactNode;
  isDark?: boolean;
} & React.HTMLAttributes<HTMLDivElement>) => {
  const c = roles(isDark);
  // A solid edge with corner marks, not a dashed one. A dashed border reads
  // as provisional, and an empty state is a real surface: it is what a
  // product shows first. The recessed well already says "nothing here yet",
  // and PixelCornerMarks does the work the dashes were reaching for.
  return (
    <div {...rest} className="relative overflow-hidden text-center" style={{ background: c.surfaceWell, border: `1px solid ${c.line}`, padding: '56px 32px', ...rest.style }}>
      <WeaveOverlay isDark={isDark} opacity={TEXTURE.surface} />
      <PixelCornerMarks hex={c.accentInk} size={7} />
      <div className="relative mx-auto flex max-w-sm flex-col items-center">
        {icon && <div className="mb-5" aria-hidden="true">{icon}</div>}
        <p className="mt-5 text-base font-semibold" style={{ color: c.text }}>{title}</p>
        {body && <p className="mt-2 text-sm leading-relaxed" style={{ color: c.textMuted }}>{body}</p>}
        {action && <div className="mt-7">{action}</div>}
      </div>
    </div>
  );
};

// ─── PixelSkeleton — loading, as a dither sweep rather than a soft shimmer ───
export const PixelSkeleton = ({
  lines = 3,
  isDark = false,
  className = '',
  ...rest
}: {
  lines?: number;
  isDark?: boolean;
  className?: string;
} & React.HTMLAttributes<HTMLDivElement>) => {
  const c = roles(isDark);
  const moving = useMotionOK();
  return (
    <div {...rest} className={className} role="status" aria-label="Loading" style={{ display: 'grid', gap: 10, ...rest.style }}>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          aria-hidden="true"
          style={{
            position: 'relative',
            overflow: 'hidden',
            height: 10,
            width: i === lines - 1 ? '60%' : '100%',
            // A solid block, not a gradient shimmer and not the retired dither.
            background: c.lineStrong
          }}
        >
          {/* A travelling sweep, not a whole-row pulse. Fading the entire bar
              in and out is easy to read as a static block — it was reported as
              one — because nothing in it moves. A highlight crossing the bar
              says the work is progressing, not merely pending. */}
          {moving && (
            <motion.div
              animate={{ x: ['-40%', '140%'] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: 'linear', delay: i * 0.18 }}
              style={{
                position: 'absolute',
                inset: 0,
                width: '40%',
                background: c.surface,
                opacity: 0.7
              }}
            />
          )}
        </div>
      ))}
    </div>
  );
};

// ─── PixelTabs — segmented navigation on the ghost recipe ────────────────────
export const PixelTabs = <T extends string>({
  tabs,
  value,
  onChange,
  isDark = false,
  label = 'Sections',
  scrollable = false,
  className = '',
  ...rest
}: {
  tabs: { value: T; label: string }[];
  value: T;
  onChange: (next: T) => void;
  isDark?: boolean;
  label?: string;
  /** one row that scrolls sideways instead of wrapping. A narrow surface with
   *  four tabs wrapped to two rows and read as a keypad; the only way to stop
   *  it was a descendant selector reaching into this component's internals,
   *  which is the hack the system exists to prevent. */
  scrollable?: boolean;
  className?: string;
} & Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'>) => {
  const c = roles(isDark);
  const d = useDensity();
  return (
    <div
      {...rest}
      role="tablist"
      aria-label={label}
      className={`flex gap-2 ${scrollable ? 'flex-nowrap overflow-x-auto' : 'flex-wrap'} ${className}`}
      style={scrollable ? { scrollbarWidth: 'none', ...rest.style } : rest.style}
    >
      {tabs.map(tab => {
        const active = tab.value === value;
        return (
          <button
            key={tab.value}
            role="tab"
            type="button"
            className="onganda-focus"
            aria-selected={active}
            onClick={() => onChange(tab.value)}
            style={{
              ['--onganda-focus' as string]: c.focusRing,
              padding: d.tabPadding,
              borderRadius: 0,
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              cursor: 'pointer',
              transition: 'background 0.18s, border-color 0.18s, color 0.18s',
              background: active ? c.controlOn : 'transparent',
              border: `1px solid ${active ? c.controlOnBorder : c.fieldBorder}`,
              color: active ? c.controlOnFg : c.textMuted
            } as React.CSSProperties}
          >{tab.label}</button>
        );
      })}
    </div>
  );
};

// ─── PixelProgress — determinate bar with a dithered fill ────────────────────
export const PixelProgress = ({
  value,
  label,
  status = 'active',
  isDark = false,
  ...rest
}: {
  /** 0–100 */
  value: number;
  label?: string;
  status?: StatusName;
  isDark?: boolean;
} & React.HTMLAttributes<HTMLDivElement>) => {
  const c = roles(isDark);
  const clamped = Math.max(0, Math.min(100, value));
  const hue = statusFor(status, isDark);
  return (
    <div {...rest}>
      {label && (
        <div className="mb-2 flex items-baseline justify-between gap-4">
          <span className="text-[10px] font-bold uppercase tracking-[0.16em]" style={{ color: c.textMuted }}>{label}</span>
          <span className="text-[11px] font-bold" style={{ color: c.text, fontVariantNumeric: 'tabular-nums' }}>{clamped}%</span>
        </div>
      )}
      <div
        role="progressbar"
        aria-valuenow={clamped}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label}
        style={{ height: 8, background: c.surfaceWell, border: `1px solid ${c.line}` }}
      >
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${clamped}%` }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          style={{
            height: '100%',
            // A solid fill. The stripes were the same dotted effect as the
            // rules, and were retired with them.
            backgroundColor: hue
          }}
        />
      </div>
    </div>
  );
};

// ─── PixelPanel — the compact surface container ──────────────────────────────
// Measured against the landing page, every extension panel sat at the floor on
// all six composition measures: one weave, three marks, one eyebrow label, no
// inverse band. A solid black button in a flat textureless box reads as a heavy
// blob, which is why the panels looked "too black" while actually carrying less
// black than the landing page (3% against 12%).
//
// This is the compact peer of SectionHeader + a card: eyebrow, title, dither
// rule, weave and corner marks in one place, so a panel cannot be built
// without them.
// ─── PixelPanel — the card, exactly as the public site builds it ─────────────
// Usage: <PixelPanel eyebrow="Privacy" title="What appears in History">…</PixelPanel>
//
// This is a transcript of the feature card in the public site's "Why Onganda"
// grid, which is the brand's general-purpose card: a light surface, a hairline
// border, four pixel corner marks in the card's accent, a header row, an 18px
// semibold title, and 14px body.
//
// Note what it does NOT do. The site never stacks its marks: the feature card
// has corner marks and no spine and no dither rule; the system card has a
// 3px spine and a bottom dither rule and no corner marks. An earlier version
// of this component did all three at once, and cards built from it read as
// busy and over-ruled next to the site they were supposed to match. Pass
// `spine` to get the system-card recipe instead — you get one or the other,
// never both.
//
// Padding follows density: 24 on a page, 16 in a side panel. The type does
// not change (see DENSITY in onganda-type.ts).
export const PixelPanel = ({
  eyebrow,
  title,
  note,
  accent,
  spine = false,
  rule,
  texture,
  emphasis = 'feature',
  children,
  footer,
  isDark = false,
  className = '',
  ...rest
}: {
  eyebrow?: string;
  title?: React.ReactNode;
  /** a quiet subtitle under the title */
  note?: React.ReactNode;
  /** the card's identifying colour; defaults to the accent ink */
  accent?: string;
  /** the system-card recipe: a 3px left spine and a bottom dither rule,
   *  instead of corner marks. Use it when the card stands for a thing that
   *  has its own colour — a system, a feature area — not for chrome. */
  spine?: boolean;
  /** the closing dither rule. Defaults to on with `spine`, off without.
   *  Separate from `spine` because a product may want the identity edge
   *  without a foot rule, and hiding it with a descendant selector is the
   *  hack this system exists to prevent. */
  rule?: boolean;
  /** which step of TEXTURE the card carries. Use `none` when it sits on a
   *  ground that is already textured — stacking the weave is what makes a
   *  page muddy. */
  texture?: 'surface' | 'none' | 'inverse';
  /** how loudly the card speaks. `feature` is the decorated card — corner
   *  marks, weave — and a screen carries one or two of them. `quiet` is
   *  surface and hairline only, for working chrome: inspectors, transcripts,
   *  export bars, anything a user works IN rather than reads.
   *
   *  Every card at feature weight is the most common way a product ends up
   *  looking like a cheap copy of the showcase: the decoration is right, and
   *  spread evenly it reads as noise. The showcase's own Product Patterns sit
   *  on ONE stage for that reason. */
  emphasis?: 'feature' | 'quiet';
  children?: React.ReactNode;
  footer?: React.ReactNode;
  isDark?: boolean;
  className?: string;
  // TypeScript does not type-check hyphenated JSX attributes, so `data-testid`
  // on a component compiles and is then silently dropped. Forwarding the rest
  // keeps test hooks and ARIA attributes working.
} & Omit<React.HTMLAttributes<HTMLElement>, 'title'>) => {
  const c = roles(isDark);
  const d = useDensity();
  const hue = accent ?? c.accentInk;
  // The foot rule follows the spine unless the caller says otherwise.
  const quiet = emphasis === 'quiet';
  // The foot rule is opt-in. It used to follow the spine by default, which
  // put a rule at the foot of every identity card.
  const showRule = rule ?? false;
  // Quiet cards carry no weave unless asked; feature cards default to the
  // surface step.
  const weave = TEXTURE[texture ?? (quiet ? 'none' : 'surface')];
  const pad = d.stackGap > 12 ? 24 : 16;
  return (
    <section
      data-onganda-panel={emphasis === 'quiet' ? 'quiet' : spine ? 'spine' : 'corners'}
      {...rest}
      className={`relative overflow-hidden ${className}`}
      style={{
        background: c.surface,
        border: `1px solid ${c.line}`,
        ...(spine ? { borderLeft: `3px solid ${hue}` } : {})
      }}
    >
      {weave > 0 && <WeaveOverlay isDark={isDark} opacity={weave} />}
      {!spine && !quiet && <PixelCornerMarks hex={hue} size={7} />}
      <div className="relative" style={{ padding: pad }}>
        {eyebrow && (
          <p
            className="uppercase"
            style={{
              fontSize: TYPE.eyebrow.size,
              fontWeight: TYPE.eyebrow.weight,
              letterSpacing: TYPE.eyebrow.tracking,
              lineHeight: TYPE.eyebrow.lineHeight,
              color: c.textMuted,
              margin: 0
            }}
          >
            {eyebrow}
          </p>
        )}
        {title && (
          <h2
            style={{
              fontSize: TYPE.title.size,
              fontWeight: TYPE.title.weight,
              lineHeight: TYPE.title.lineHeight,
              color: c.text,
              // The site's rhythm: a full step of air under the label, not a
              // hairline gap. This is most of what makes its cards breathe.
              margin: eyebrow ? `${SPACE_SCALE['4']}px 0 0` : 0
            }}
          >
            {title}
          </h2>
        )}
        {note && (
          <p
            style={{
              fontSize: TYPE.body.size,
              lineHeight: TYPE.body.lineHeight,
              color: c.textMuted,
              margin: `${SPACE_SCALE['3']}px 0 0`
            }}
          >
            {note}
          </p>
        )}
        {(eyebrow || title || note) && children && (
          <div style={{ height: SPACE_SCALE['5'] }} />
        )}
        {children}
      </div>
      {showRule && (
        <DitherBar
          color={hue}
          segments={RULE.edge.segments}
          height={RULE.edge.height}
          opacity={RULE.edge.opacity}
          className="absolute bottom-0 left-0 right-0"
        />
      )}
      {footer && (
        <div
          className="relative"
          style={{
            padding: `${SPACE_SCALE['3']}px ${pad}px`,
            borderTop: `1px solid ${c.line}`,
            background: c.surfaceWell
          }}
        >
          {footer}
        </div>
      )}
    </section>
  );
};

// ─── PixelInversePanel — the black card ──────────────────────────────────────
// Usage: <PixelInversePanel tag="Why Onganda" headline="…">body</PixelInversePanel>
//
// The site's one loud move. Everything else is quiet so that flipping to char
// black reads as emphasis; use it once per view at most. Transcribed from the
// "Why Onganda" panel: an accent tag, a 48px headline, dark-muted body, and a
// dither rule closing the block.
export const PixelInversePanel = ({
  tag,
  headline,
  children,
  accent,
  className = '',
  ...rest
}: {
  tag?: React.ReactNode;
  headline?: React.ReactNode;
  children?: React.ReactNode;
  accent?: string;
  className?: string;
} & React.HTMLAttributes<HTMLElement>) => {
  const c = roles(true);
  const rule = accent ?? c.accentInk;
  return (
    <section
      {...rest}
      className={`relative overflow-hidden ${className}`}
      style={{ background: roles(false).inverse, color: c.text, padding: SPACE_SCALE['8'] }}
    >
      <WeaveOverlay isDark opacity={TEXTURE.inverse} />
      <div className="relative">
        {tag}
        {headline && (
          <h2
            style={{
              fontSize: TYPE.display.size,
              fontWeight: TYPE.display.weight,
              lineHeight: TYPE.display.lineHeight,
              color: roles(false).textOnInverse,
              margin: `${SPACE_SCALE['10']}px 0 0`
            }}
          >
            {headline}
          </h2>
        )}
        {children && (
          <div
            style={{
              fontSize: TYPE.body.size,
              lineHeight: TYPE.body.lineHeight,
              color: c.textMuted,
              marginTop: SPACE_SCALE['8']
            }}
          >
            {children}
          </div>
        )}
      </div>
    </section>
  );
};

export const PixelChoice = ({
  label,
  selected,
  onSelect,
  disabled = false,
  state,
  isDark = false,
  name,
  tabIndex,
  showIndicator = true,
  ...rest
}: {
  label: React.ReactNode;
  selected: boolean;
  onSelect: () => void;
  disabled?: boolean;
  /** after grading: marks the option as the right or the chosen-wrong one */
  state?: 'correct' | 'incorrect';
  isDark?: boolean;
  name?: string;
  /** Hide the built-in square when the product supplies its own option mark. */
  showIndicator?: boolean;
  /** override the roving tab stop; the list normally handles this */
  tabIndex?: number;
} & Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onSelect' | 'name' | 'disabled' | 'tabIndex' | 'style' | 'className' | 'children'>) => {
  const c = roles(isDark);
  const d = useDensity();
  const edge = state === 'correct' ? statusFor('settled', isDark)
    : state === 'incorrect' ? statusFor('critical', isDark)
    : selected ? c.controlOnBorder : c.fieldBorder;
  return (
    <button
      {...rest}
      type="button"
      role="radio"
      name={name}
      aria-checked={selected}
      // One tab stop for the whole group; arrows move within it.
      tabIndex={tabIndex ?? (selected ? 0 : -1)}
      disabled={disabled}
      onClick={onSelect}
      className="onganda-focus relative w-full overflow-hidden text-left"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: d.labelGap,
        padding: d.fieldPadding,
        background: selected ? `${c.controlOn}14` : c.fieldBg,
        border: `1px solid ${edge}`,
        borderRadius: 0,
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled && !selected ? 0.55 : 1,
        color: c.textBody,
        fontSize: d.fieldFont,
        lineHeight: 1.45,
        transition: 'background 0.18s, border-color 0.18s',
        ['--onganda-focus' as string]: c.focusRing
      } as React.CSSProperties}
    >
      {selected && <WeaveOverlay isDark={isDark} opacity={0.055} />}
      {showIndicator && <span
        aria-hidden="true"
        className="relative shrink-0"
        style={{ width: d.controlBox - 4, height: d.controlBox - 4, border: `1px solid ${edge}`, background: selected ? c.controlOn : 'transparent' }}
      />}
      <span className="relative min-w-0">{label}</span>
    </button>
  );
};

/** The radiogroup wrapper.
 *
 *  It owns the keyboard contract so no product has to rebuild it: a single tab
 *  stop into the group, then Arrow keys move and select, Home and End jump to
 *  the ends. That is what `role="radiogroup"` promises, and re-deriving it per
 *  product is how it ends up missing.
 */
export const PixelChoiceList = ({
  label,
  children,
  isDark = false,
  layout = 'rows'
}: {
  label: string;
  children: React.ReactNode;
  isDark?: boolean;
  /** `grid` packs short options two-up; long text always wants rows */
  layout?: 'rows' | 'grid';
}) => {
  const d = useDensity();
  const group = useRef<HTMLDivElement>(null);

  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const keys = ['ArrowDown', 'ArrowRight', 'ArrowUp', 'ArrowLeft', 'Home', 'End'];
    if (!keys.includes(e.key)) return;
    const radios = Array.from(group.current?.querySelectorAll<HTMLElement>('[role="radio"]:not([disabled])') ?? []);
    if (!radios.length) return;
    e.preventDefault();
    const here = radios.indexOf(document.activeElement as HTMLElement);
    const step = e.key === 'ArrowDown' || e.key === 'ArrowRight' ? 1 : -1;
    const next =
      e.key === 'Home' ? 0 :
      e.key === 'End' ? radios.length - 1 :
      here === -1 ? 0 : (here + step + radios.length) % radios.length;
    radios[next].focus();
    // Arrow keys select in a radiogroup; Home and End only move.
    if (e.key !== 'Home' && e.key !== 'End') radios[next].click();
  };

  return (
    <div
      ref={group}
      role="radiogroup"
      aria-label={label}
      onKeyDown={onKeyDown}
      style={{
        display: 'grid',
        gap: d.labelGap,
        gridTemplateColumns: layout === 'grid' ? 'repeat(auto-fit, minmax(150px, 1fr))' : '1fr'
      }}
    >
      {children}
    </div>
  );
};

// ─── PixelActions — the button row ───────────────────────────────────────────
// Buttons were being stacked flush at unequal widths, which is most of why the
// panels looked unfinished. One row, one gap, one alignment.
export const PixelActions = ({
  children,
  align = 'start',
  stack = false,
  share = false,
  ...rest
}: {
  children: React.ReactNode;
  align?: 'start' | 'end' | 'between';
  /** full-width stacked buttons, for very narrow surfaces */
  stack?: boolean;
  /** the row's buttons divide its width evenly. Products were reinventing
   *  this as a local `.btn-row` because there was no way to ask for it. */
  share?: boolean;
} & React.HTMLAttributes<HTMLDivElement>) => {
  const d = useDensity();
  return (
    <div
      {...rest}
      style={{
        display: 'flex',
        flexDirection: stack ? 'column' : 'row',
        flexWrap: stack || share ? 'nowrap' : 'wrap',
        alignItems: stack ? 'stretch' : 'center',
        justifyContent: align === 'end' ? 'flex-end' : align === 'between' ? 'space-between' : 'flex-start',
        gap: d.labelGap,
        marginTop: d.stackGap,
        ...(share ? { display: 'grid', gridTemplateColumns: `repeat(${React.Children.count(children)}, minmax(0, 1fr))` } : null),
        ...rest.style
      }}
    >
      {children}
    </div>
  );
};
