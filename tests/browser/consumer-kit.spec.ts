import { expect, test } from '@playwright/test';

// Regressions a cold-start agent found by building a product from the package
// alone. Each one passed every earlier check because the showcase passes
// `isDark` and sizes explicitly, and a product does not.

test('patterns follow DarkProvider without an isDark prop', async ({ page }) => {
  // DarkProvider restores the mode from storage. Panels, notices and tables
  // used to default to light and ignore it.
  await page.addInitScript(() => localStorage.setItem('onganda-dark', '1'));
  await page.goto('/test/app');
  await page.locator('[data-test-page]').waitFor();
  await expect(page.locator('html')).toHaveAttribute('data-onganda-theme', 'dark');
  const panel = await page.locator('[data-onganda-panel]').first()
    .evaluate(el => getComputedStyle(el).backgroundColor);
  expect(panel, 'the dark card surface').toBe('rgb(28, 23, 19)');
});

test('a tab label never wraps inside its button', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/test/app');
  const tabs = page.getByRole('tab');
  const styles = await tabs.evaluateAll(els => els.map(el => {
    const s = getComputedStyle(el);
    return `${s.whiteSpace}/${s.flexShrink}`;
  }));
  for (const s of styles) expect(s).toBe('nowrap/0');
});

test('PixelNav marks the current page and sizes its icons on the grid', async ({ page }) => {
  await page.goto('/test/studio');
  const nav = page.getByRole('navigation', { name: 'Studio' });
  await expect(nav.locator('[aria-current="page"]')).toHaveCount(1);
  const sizes = await nav.locator('svg').evaluateAll(els => els.map(el => el.getAttribute('width')));
  expect(new Set(sizes)).toEqual(new Set(['24']));
});

test('a dialog renders on the body, outside any card', async ({ page }) => {
  await page.goto('/test/app');
  await page.getByRole('button', { name: 'Delete', exact: true }).click();
  const dialog = page.getByRole('dialog');
  await expect(dialog).toBeVisible();
  const insidePanel = await dialog.evaluate(el => !!el.closest('[data-onganda-panel]'));
  expect(insidePanel).toBe(false);
});
