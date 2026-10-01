import { expect, test, type Page } from '@playwright/test';
import { stubMapTiles } from './support/map-tiles';

// The consumer test pages (src/test-pages) are built only from the package.
// They sit under every guard the public routes do, so a primitive that breaks
// in a product's layout fails here rather than in the product.
const TEST_PAGES = ['/test/app', '/test/studio', '/test/dashboard', '/test/form', '/test/landing', '/test/article'];

const capturePageErrors = (page: Page) => {
  const errors: string[] = [];
  page.on('console', message => {
    if (message.type() === 'error') errors.push(message.text());
  });
  page.on('pageerror', error => errors.push(error.message));
  return errors;
};

const expectNoHorizontalOverflow = async (page: Page) => {
  const hasOverflow = await page.evaluate(
    () => document.documentElement.scrollWidth > document.documentElement.clientWidth
  );
  expect(hasOverflow).toBe(false);
};

// The showcase carries the widest content in the system — a 12-column pixel
// canvas, a heatmap grid, a seven-link nav and several rule-flanked captions.
// Every one of them overflowed at some width before being made fluid, so the
// sweep runs across the full range rather than at one phone size.
for (const width of [320, 360, 390, 768, 834, 1024, 1440]) {
  test(`no horizontal overflow on any public route at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await stubMapTiles(page);
    for (const route of ['/', '/full', '/showcase', ...TEST_PAGES]) {
      await page.goto(route);
      await page.waitForTimeout(400);
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - document.documentElement.clientWidth
      );
      expect(overflow, `${route} at ${width}px`).toBe(0);
    }
  });
}

for (const route of ['/', '/full', '/showcase', ...TEST_PAGES]) {
  test(`${route} renders its primary content`, async ({ page }) => {
    const errors = capturePageErrors(page);
    await stubMapTiles(page);
    await page.goto(route);
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    await expectNoHorizontalOverflow(page);
    expect(errors).toEqual([]);
  });
}

test('the public home supports keyboard and mobile navigation', async ({ page }) => {
  const errors = capturePageErrors(page);
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');

  await page.keyboard.press('Tab');
  const skipLink = page.getByRole('link', { name: 'Skip to content' });
  await expect(skipLink).toBeFocused();
  await skipLink.press('Enter');
  await expect(page.locator('main#main')).toBeVisible();

  const menuButton = page.getByRole('button', { name: 'Open menu' });
  await expect(menuButton).toBeVisible();
  await menuButton.click();
  await expect(page.getByRole('button', { name: 'Close menu' })).toBeVisible();
  await expectNoHorizontalOverflow(page);
  expect(errors).toEqual([]);
});

// The faces ship with the package. They loaded from a remote @import that
// CSS drops unless it comes first, then from url()s a bundler may not rewrite;
// both times every heading fell back to Arial and nothing failed.
for (const route of ['/', '/showcase', '/test/studio']) {
  test(`${route} loads both faces from the package`, async ({ page }) => {
    await page.goto(route);
    await page.locator('h1, h2').first().waitFor();
    await page.evaluate(() => document.fonts.ready);
    const loaded = await page.evaluate(() =>
      [...document.fonts].filter(f => f.status === 'loaded').map(f => f.family.replace(/["']/g, '')));
    expect(loaded).toContain('Inter');
    expect(loaded).toContain('Space Grotesk');
  });
}
