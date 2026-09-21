// ─── Onganda Design System — Motion & Spacing Tokens ──────────────────────────
// Canonical motion values from DESIGN_GUIDELINES.md: quiet, mechanical,
// pixel-system aligned. Spread MOTION presets into framer-motion props so the
// whole system can be retuned from one place.

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
