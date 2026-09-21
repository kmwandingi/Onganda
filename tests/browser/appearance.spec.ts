import { expect, test, type Page } from '@playwright/test';
import { stubMapTiles } from './support/map-tiles';

// ─── Visual baselines ────────────────────────────────────────────────────────
// Every other guard checks a property: contrast, tokens, composition, identity.
// None of them can tell that something got uglier — and this session raised the
// muted ink 47% and the field border 3.4× for accessibility reasons, exactly
// the kind of change that is correct and could still spoil a calm layout.
//
// These baselines do not decide whether a change is good. They make sure a
// human sees it. A diff here is a prompt to look, not a failure to suppress:
// if the new render is right, update the snapshot in the same commit that
// caused it, so the reason is in the history.
//
//   npx playwright test appearance --update-snapshots

// Visual baselines run with reduced motion. `animations: 'disabled'` only
// freezes CSS animations; framer-motion drives transforms in JS and keeps
// going, so a section containing a ticker or a loading sweep never reaches
// two identical consecutive frames and the screenshot times out. Reduced
// motion stops those at the source — see useMotionOK in onganda-motion.ts.
test.use({ reducedMotion: 'reduce' });

const settle = async (page: Page, selector: string) => {
  await stubMapTiles(page);
  if (selector !== 'body') {
    await page.locator(selector).scrollIntoViewIfNeeded();
  }
  // Let entrance motion finish so the baseline is the resting state.
  await page.waitForTimeout(1400);
  await page.evaluate(() => document.querySelectorAll('*').forEach(el => {
    const s = el as HTMLElement;
    if (s.style) s.style.animationPlayState = 'paused';
  }));
};

const SURFACES: [name: string, route: string, selector: string][] = [
  ['public-contact', '/', '#contact'],
  ['public-systems', '/', '#systems'],
  ['showcase-systems', '/showcase', '#systems'],
  ['controls-light', '/showcase', '#controls-stage'],
  ['patterns-light', '/showcase', '#patterns-stage'],
  ['roadmap', '/showcase', '#roadmap'],
  ['publications', '/showcase', '#publications'],
];

for (const [name, route, selector] of SURFACES) {
  test(`appearance: ${name}`, async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 1000 });
    await page.goto(route);
    await settle(page, selector);
    await expect(page.locator(selector)).toHaveScreenshot(`${name}.png`, {
      animations: 'disabled',
      caret: 'hide',
      // Tight on purpose. A 1px border colour change touches well under 1% of
      // a panel's pixels, so a lenient ratio makes this baseline decorative —
      // it silently accepted a 0.51 → 0.80 field border when set to 0.02.
      maxDiffPixelRatio: 0.0015,
      // Time, not tolerance. The Control Standards section is ~1900px tall and
      // takes 5–6.5s to capture twice in the CI container, against a 5s
      // default — so it timed out under load while passing alone. The
      // comparison stays at 0.0015; only the budget moves.
      timeout: 20_000,
    });
  });
}

// The two sections that carry their own mode switch are the only places the
// dark role set is rendered, so they are the only place a dark-mode visual
// regression can be caught.
for (const [name, stage] of [['controls-dark', '#controls-stage'], ['patterns-dark', '#patterns-stage']] as const) {
  test(`appearance: ${name}`, async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 1000 });
    await page.goto('/showcase');
    await page.locator(stage).scrollIntoViewIfNeeded();
    await page.locator(stage).getByRole('switch').first().click();
    await expect(page.locator(stage)).toHaveAttribute('data-mode', 'dark');
    await page.waitForTimeout(1000);
    await expect(page.locator(stage)).toHaveScreenshot(`${name}.png`, {
      animations: 'disabled',
      caret: 'hide',
      maxDiffPixelRatio: 0.0015,
      timeout: 20_000,
    });
  });
}

test('appearance: the mobile public home', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await settle(page, 'body');
  await expect(page.locator('#contact')).toHaveScreenshot('public-contact-mobile.png', {
    animations: 'disabled',
    caret: 'hide',
    maxDiffPixelRatio: 0.0015,
    timeout: 20_000,
  });
});
