import { expect, test, type Page } from '@playwright/test';

// Motion is part of the language, and it has to come from the defaults. The
// primitives a product is built from were static, so every product screen
// came out still while the guidelines said motion was not a garnish. These
// read the consumer test pages — built only from the package — so a primitive
// that loses its motion fails here, not in a product.

const animationOf = (page: Page, selector: string) =>
  page.locator(selector).first().evaluate(el => {
    const s = getComputedStyle(el);
    return { name: s.animationName, delay: s.animationDelay, duration: s.animationDuration };
  });

test.describe('with motion', () => {
  test('panels and section headers enter by default', async ({ page }) => {
    await page.goto('/test/app');
    await page.locator('[data-test-page]').waitFor();
    const panel = page.locator('[data-onganda-panel]').first();
    await expect(panel).toHaveAttribute('data-onganda-in', '');
    expect((await animationOf(page, '[data-onganda-panel]')).name).toBe('onganda-enter');
  });

  test('an entrance is seen: it starts when the element arrives, not at mount', async ({ page }) => {
    // Measured before this existed: the first panel's 450ms entrance was at
    // 442ms by the time the page could paint, and anything below the fold
    // had finished before it was scrolled to.
    await page.goto('/test/landing');
    await page.locator('[data-test-page]').waitFor();
    const below = page.locator('#contact[data-onganda-enter]');
    await page.waitForTimeout(800);
    expect(await below.getAttribute('data-onganda-in'), 'below the fold, it waits').toBeNull();
    expect(await below.evaluate(el => getComputedStyle(el).opacity)).toBe('0');
    await below.evaluate(el => el.scrollIntoView());
    await expect(below).toHaveAttribute('data-onganda-in', '');
    const at = await below.evaluate(el => Number(el.getAnimations()[0]?.currentTime ?? -1));
    expect(at, 'the entrance is near its start when it arrives').toBeGreaterThanOrEqual(0);
    expect(at).toBeLessThan(300);
  });

  test('the stat band arrives in turn, not all at once', async ({ page }) => {
    await page.goto('/test/dashboard');
    const cells = page.locator('[data-onganda-stagger] > *');
    await expect(cells).toHaveCount(4);
    const delays = await cells.evaluateAll(els => els.map(el => getComputedStyle(el).animationDelay));
    expect(new Set(delays).size, `delays: ${delays.join(', ')}`).toBe(4);
  });

  test('entrances settle: nothing is left invisible once seen', async ({ page }) => {
    await page.goto('/test/form');
    await page.locator('[data-test-page]').waitFor();
    await page.evaluate(async () => {
      for (let y = 0; y <= document.body.scrollHeight; y += 300) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 80)); }
    });
    await page.waitForTimeout(1000);
    const faded = await page.evaluate(() =>
      [...document.querySelectorAll('[data-onganda-enter], [data-onganda-stagger] > *')]
        .filter(el => Number(getComputedStyle(el).opacity) < 1).length);
    expect(faded).toBe(0);
  });

  test('tabs and choices compress on press', async ({ page }) => {
    await page.goto('/test/app');
    const tab = page.getByRole('tab').first();
    expect(await tab.getAttribute('data-onganda-press')).not.toBeNull();
    const transition = await tab.evaluate(el => getComputedStyle(el).transitionProperty);
    expect(transition).toContain('transform');
  });
});

test.describe('with reduced motion', () => {
  // contextOptions, not the top-level option: in Playwright 1.62 `reducedMotion`
  // under `use` never reaches the page, so these tests ran with full motion.
  test.use({ contextOptions: { reducedMotion: 'reduce' } });

  test('every entrance is off and content is visible at once', async ({ page }) => {
    await page.goto('/test/app');
    await page.locator('[data-test-page]').waitFor();
    const moving = await page.evaluate(() =>
      [...document.querySelectorAll('[data-onganda-enter], [data-onganda-stagger] > *')]
        .filter(el => getComputedStyle(el).animationName !== 'none').length);
    expect(moving).toBe(0);
  });

  test('framer-motion entrances respect it too', async ({ page }) => {
    // MotionConfig reducedMotion="user" in DarkProvider: a card that enters
    // with MOTION.fadeUp must not be mid-slide.
    await page.goto('/test/landing');
    const card = page.locator('#systems article').first();
    await card.scrollIntoViewIfNeeded();
    await page.waitForTimeout(100);
    const transform = await card.evaluate(el => getComputedStyle(el).transform);
    expect(['none', 'matrix(1, 0, 0, 1, 0, 0)']).toContain(transform);
  });
});
