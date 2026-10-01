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
  // SectionHeader was missed in the first pass: its headline rendered in
  // light-mode ink on the dark canvas, near invisible.
  await page.goto('/test/dashboard');
  await page.locator('h1').waitFor();
  expect(await page.locator('h1').evaluate(el => getComputedStyle(el).color), 'millet clay on dark')
    .toBe('rgb(232, 225, 207)');
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

// Depth is a creative dial, and the only depth the system allows is a hard
// pixel shadow. A product once stripped its stepped shadows because the docs
// said "no shadows"; the rule was always "no blur".
const blurOf = (shadow: string) => {
  const lens = shadow.match(/-?[\d.]+px/g) ?? [];
  return lens.length >= 3 ? parseFloat(lens[2]) : 0;
};

test('a raised card rests on a hard pixel plate, with no blur', async ({ page }) => {
  await page.goto('/test/launch');
  const raised = page.locator('[data-onganda-panel][data-onganda-depth="raised"]').first();
  const shadow = await raised.evaluate(el => getComputedStyle(el).boxShadow);
  expect(shadow).toContain('8px 8px 0px');
  expect(blurOf(shadow)).toBe(0);
});

test('a lifting card steps up onto a hard shadow on hover', async ({ page }) => {
  await page.goto('/test/launch');
  const card = page.locator('[data-onganda-panel][data-onganda-depth="lift"]').first();
  await card.scrollIntoViewIfNeeded();
  await card.hover();
  await page.waitForTimeout(250);
  const s = await card.evaluate(el => ({ translate: getComputedStyle(el).translate, shadow: getComputedStyle(el).boxShadow }));
  expect(s.translate).toBe('-2px -2px');
  expect(s.shadow).toContain('4px 4px 0px');
  expect(blurOf(s.shadow)).toBe(0);
});

test('no page in the kit casts a blurred shadow', async ({ page }) => {
  for (const route of ['/test/launch', '/test/landing', '/test/app', '/test/studio']) {
    await page.goto(route);
    await page.locator('[data-test-page]').waitFor();
    const blurred = await page.evaluate(() => [...document.querySelectorAll('body *')].filter(el => {
      const lens = getComputedStyle(el).boxShadow.match(/-?[\d.]+px/g) ?? [];
      return lens.length >= 3 && parseFloat(lens[2]) !== 0;
    }).length);
    expect(blurred, route).toBe(0);
  }
});

// Found by the third cold-start pass.
test('a PixelButton type="submit" submits its form on Enter', async ({ page }) => {
  await page.goto('/test/form');
  await page.locator('#org').press('Enter');
  await expect(page.getByTestId('form-sent')).toBeVisible();
});

test('an uncontrolled PixelCheckbox honours defaultChecked', async ({ page }) => {
  await page.goto('/test/form');
  const box = page.getByRole('checkbox', { name: 'I have consent to share the sample data' });
  await expect(box).toBeChecked();
  await box.click({ force: true });
  await expect(box).not.toBeChecked();
});

test('a selectable PixelPanel is a keyboard button with a pressed state', async ({ page }) => {
  await page.goto('/test/launch');
  const peers = page.getByTestId('launch-peer');
  await expect(peers.nth(0)).toHaveAttribute('aria-pressed', 'true');
  await peers.nth(1).focus();
  await page.keyboard.press('Enter');
  await expect(peers.nth(1)).toHaveAttribute('aria-pressed', 'true');
  await expect(peers.nth(0)).toHaveAttribute('aria-pressed', 'false');
  const outline = await peers.nth(1).evaluate(el => getComputedStyle(el).outlineStyle);
  expect(outline).toBe('solid');
});
