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

/** True under browser automation (navigator.webdriver — Playwright,
 *  Puppeteer, Selenium), read once at load. Scroll-triggered entrances never
 *  fire in a full-page screenshot, which does not scroll, so anything that
 *  waits to be seen came out blank and an agent "fixed" it. Under automation
 *  every entrance renders in its final state. Tests that want the real
 *  behaviour set window.__ongandaRevealUnderAutomation = true before load. */
export const AUTOMATED: boolean = typeof navigator !== 'undefined' && !!navigator.webdriver
  && !(typeof window !== 'undefined' && (window as unknown as { __ongandaRevealUnderAutomation?: boolean }).__ongandaRevealUnderAutomation);

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
  /** a rule draws in, like an underline under a link */
  draw: 'steps(4, end)',
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
    initial: AUTOMATED ? false : { opacity: 0, y: 16 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: '-40px' },
    transition: { duration: 0.45 }
  },
  // Parent/child list stagger
  staggerParent: {
    variants: { hidden: {}, visible: { transition: { staggerChildren: 0.06 } } },
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

// ─── Reveal — entrances that actually play ───────────────────────────────────
// A CSS entrance that starts when an element is inserted is spent before the
// viewer sees it: measured on a consumer page, a panel's 450ms entrance was at
// 442ms by the first paint, and anything below the fold finished long before
// it was scrolled to. So the entrance starts when the element comes into view.
//
// installReveal() marks <html data-onganda-motion> and watches every
// [data-onganda-enter] and [data-onganda-stagger]; each gets data-onganda-in
// on its first overlap with the viewport, and style.css plays the entrance
// then. DarkProvider installs it.
//
// Hiding content until it is seen is only safe when someone will scroll to
// it, so nothing is ever hidden:
//   • without JavaScript, without DarkProvider, or under reduced motion;
//   • under automation (navigator.webdriver — Playwright, Puppeteer,
//     Selenium): a full-page screenshot does not scroll, and hidden sections
//     would come out blank and get "fixed" by the agent looking at them;
//   • in print;
//   • when the page opts out with <html data-onganda-reveal="off">.
// Any overlap counts — no inset margin — so an element at the very bottom of
// a page that cannot scroll still appears. Tests that want the real
// behaviour under automation set window.__ongandaRevealUnderAutomation = true.
const REVEAL = '[data-onganda-enter],[data-onganda-stagger]';
let revealUsers = 0;
let revealTeardown: (() => void) | null = null;

const revealAllowed = () => {
  if (typeof window === 'undefined' || typeof document === 'undefined') return false;
  if (!('IntersectionObserver' in window) || !('MutationObserver' in window)) return false;
  if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return false;
  if (document.documentElement.getAttribute('data-onganda-reveal') === 'off') return false;
  const forced = (window as unknown as { __ongandaRevealUnderAutomation?: boolean }).__ongandaRevealUnderAutomation;
  if (navigator.webdriver && !forced) return false;
  return true;
};

export const installReveal = (): (() => void) => {
  if (!revealAllowed()) return () => {};
  revealUsers += 1;
  if (!revealTeardown) {
    const html = document.documentElement;
    const io = new IntersectionObserver(entries => {
      for (const e of entries) {
        if (!e.isIntersecting) continue;
        e.target.setAttribute('data-onganda-in', '');
        io.unobserve(e.target);
      }
    });
    const watch = (node: Element) => {
      if (node.matches(REVEAL) && !node.hasAttribute('data-onganda-in')) io.observe(node);
      node.querySelectorAll(REVEAL).forEach(el => { if (!el.hasAttribute('data-onganda-in')) io.observe(el); });
    };
    watch(document.body);
    const mo = new MutationObserver(records => {
      for (const r of records) r.addedNodes.forEach(n => { if (n instanceof Element) watch(n); });
    });
    mo.observe(document.body, { childList: true, subtree: true });
    // Printing shows everything, seen or not.
    const showAll = () => document.querySelectorAll(REVEAL).forEach(el => el.setAttribute('data-onganda-in', ''));
    window.addEventListener('beforeprint', showAll);
    html.setAttribute('data-onganda-motion', '');
    revealTeardown = () => {
      io.disconnect(); mo.disconnect();
      window.removeEventListener('beforeprint', showAll);
      html.removeAttribute('data-onganda-motion');
    };
  }
  return () => {
    revealUsers -= 1;
    if (revealUsers === 0 && revealTeardown) { revealTeardown(); revealTeardown = null; }
  };
};
