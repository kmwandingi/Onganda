import { useReducedMotion } from 'framer-motion';

// ─── Onganda Design System — Motion & Spacing Tokens ──────────────────────────
// Canonical motion values from DESIGN_GUIDELINES.md: quiet, mechanical,
// pixel-system aligned. Spread MOTION presets into framer-motion props so the
// whole system can be retuned from one place.

/**
 * True when the viewer has not asked for less motion.
 *
 * Every animation in the system that repeats forever — the ticker, the hero
 * edge strips, the loading sweep — must be guarded by this. Two reasons:
 *
 *  1. WCAG 2.2.2. Content that moves automatically for more than five seconds
 *     needs a way to stop. `prefers-reduced-motion` is that way.
 *  2. A page with a perpetual animation is never visually stable, so a
 *     screenshot of it never converges. Playwright's `animations: 'disabled'`
 *     only freezes CSS animations; framer-motion drives transforms in JS and
 *     keeps going. That is what made the Linux visual baselines flake.
 */
export const useMotionOK = () => !useReducedMotion();

/** The motion vocabulary as values — the same numbers MOTION and style.css
 *  use, exported so CSS (--onganda-motion-*), the token JSON and Figma read
 *  one source. Quiet and mechanical: short ease-out entrances, stepped
 *  micro-motion, no spring. */
export const MOTION_TOKENS = {
  /** micro-motion and press */
  fast: '120ms',
  /** colour, border and background changes */
  base: '200ms',
  /** a surface entering */
  enter: '450ms',
  /** between staggered siblings */
  stagger: '60ms',
  /** every entrance and lift */
  ease: 'cubic-bezier(0.2, 0, 0, 1)',
  /** micro-motion moves in whole pixels, like the art */
  step: 'steps(2, end)',
  /** a clickable card rises this far on hover */
  lift: '4px',
  /** an icon steps this far on hover */
  nudge: '2px',
  /** a pressed control scales to this */
  press: '0.97'
} as const;

export const MOTION = {
  // Section / card entrance: <motion.div {...MOTION.entrance} />
  entrance: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
  },
  // Scroll-triggered entrance: <motion.div {...MOTION.fadeUp} />
  fadeUp: {
    initial: { opacity: 0, y: 16 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: '-40px' },
    transition: { duration: 0.45 }
  },
  // Parent/child list stagger
  staggerParent: {
    variants: { hidden: {}, visible: { transition: { staggerChildren: 0.08 } } },
    initial: 'hidden',
    animate: 'visible'
  },
  staggerChild: {
    variants: {
      hidden: { opacity: 0, y: 12 },
      visible: { opacity: 1, y: 0, transition: { duration: 0.35 } }
    }
  },
  // Interaction: never spring, never scale-on-hover for cards
  hoverLift: { whileHover: { y: -4 }, transition: { type: 'tween', duration: 0.15 } },
  tap: { whileTap: { scale: 0.97 } },
  // Continuous ticker/marquee
  ticker: {
    animate: { x: ['0%', '-50%'] },
    transition: { duration: 28, repeat: Infinity, ease: 'linear' }
  }
} as const;

// ─── Spacing scale — editorial whitespace discipline ──────────────────────────
// px values used with inline styles; mirror the Tailwind utilities used in
// section markup (px-6 md:px-12, pb-24, gap-3/5/10).
export const SPACE = {
  sectionY: 96,   // vertical rhythm between major sections (pb-24)
  sectionX: 24,   // section gutter, mobile (px-6)
  sectionXWide: 48, // section gutter, desktop (md:px-12)
  cardPad: 32,    // standard card padding (p-8)
  cardPadWide: 48, // large card padding (md:p-12)
  itemGap: 20,    // gap between sibling items (gap-5)
  microGap: 12    // gap inside compound elements (gap-3)
} as const;
