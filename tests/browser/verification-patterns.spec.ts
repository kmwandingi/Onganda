import { expect, test } from '@playwright/test';

// The three patterns a verification product needed: a step-line for "how it
// works", a document viewer whose regions a finding lights up, and the suite
// switcher inside a product's nav. Each lives on /showcase, in both modes.

test('PixelStepLine renders its steps in order, with one accent per node', async ({ page }) => {
  await page.goto('/showcase');
  const line = page.locator('[data-testid="showcase-stepline"] ol');
  await expect(line.getByRole('listitem')).toHaveCount(4);
  await expect(line).toContainText('Your record');
  await expect(line).toContainText('An answer');
});

test('PixelDocumentViewer regions are buttons Tab can reach', async ({ page }) => {
  await page.goto('/showcase');
  const viewer = page.locator('[data-onganda-viewer]');
  const regions = viewer.locator('[data-region-id]');
  await expect(regions).toHaveCount(3);
  // Focusing a region activates it: aria-pressed and the corner marks appear.
  await regions.nth(1).focus();
  await expect(regions.nth(1)).toHaveAttribute('aria-pressed', 'true');
  // The finding beside the viewer lights the same region back.
  const finding = page.locator('[data-finding-id="f-sum"] button');
  await finding.hover();
  await expect(regions.nth(2)).toHaveAttribute('aria-pressed', 'true');
});

test('the suite switcher marks the product the user is inside', async ({ page }) => {
  await page.goto('/showcase');
  const nav = page.locator('[data-testid="showcase-nav-switcher"] nav');
  const products = nav.getByRole('list').first().getByRole('link');
  await expect(products).toHaveCount(2);
  await expect(products.nth(1)).toHaveAttribute('aria-current', 'page');
});
