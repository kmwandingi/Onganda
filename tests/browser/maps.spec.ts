import { expect, test, type Page } from '@playwright/test';
import { stubMapTiles } from './support/map-tiles';

const capturePageErrors = (page: Page) => {
  const errors: string[] = [];
  page.on('console', message => {
    if (message.type() === 'error') errors.push(message.text());
  });
  page.on('pageerror', error => errors.push(error.message));
  return errors;
};

const openMap = async (page: Page) => {
  await page.goto('/showcase?shouldSkipAnimations=true');
  const map = page.locator('[data-onganda-map]');
  await map.scrollIntoViewIfNeeded();
  await expect(map.locator('[data-map-state="ready"]')).toBeVisible();
  return map;
};

test.beforeEach(async ({ page }) => {
  await stubMapTiles(page);
});

// contextOptions, not the top-level option: in Playwright 1.62 `reducedMotion`
// under `use` never reaches the page, so these tests ran with full motion.
test.use({ contextOptions: { reducedMotion: 'reduce' } });

test('map markers and legend work with keyboard and pointer input', async ({ page }) => {
  const errors = capturePageErrors(page);
  const map = await openMap(page);

  const region = map.getByRole('region', {
    name: 'Illustrative map of capability signals across Namibia',
  });
  await expect(region).toBeVisible();
  await region.focus();
  await expect(region).toBeFocused();

  const markers = map.locator('.onganda-map-marker-host');
  await expect(markers).toHaveCount(5);
  await expect(markers.first()).toHaveAttribute('aria-label', 'Show Windhoek');
  await markers.first().focus();
  await expect(markers.first()).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(map.locator('.onganda-map-popup-title:visible')).toHaveText('Windhoek');

  const oshakati = map.locator('[data-onganda-map-point="oshakati"]');
  await oshakati.click();
  await expect(oshakati).toHaveAttribute('aria-pressed', 'true');
  await expect(map.locator('.leaflet-popup-pane').getByText('Oshakati')).toBeVisible();

  await map.locator('.leaflet-control-zoom-in').click();
  expect(errors).toEqual([]);
});

test('map stays usable on a mobile viewport', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  const errors = capturePageErrors(page);
  const map = await openMap(page);
  const bounds = await map.boundingBox();

  expect(bounds).not.toBeNull();
  expect(bounds!.x).toBeGreaterThanOrEqual(0);
  expect(bounds!.x + bounds!.width).toBeLessThanOrEqual(390);
  await expect(map.locator('[data-onganda-map-legend]')).toBeVisible();
  await map.locator('[data-onganda-map-point="walvis-bay"]').click();
  await expect(map.locator('.leaflet-popup-pane').getByText('Walvis Bay')).toBeVisible();
  await expect(map.locator('[data-onganda-map-canvas]')).toHaveCSS('overflow', 'hidden');
  expect(errors).toEqual([]);
});

test('map visual language remains stable', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 960 });
  const map = await openMap(page);
  await expect(map).toHaveScreenshot('onganda-map-desktop.png', {
    animations: 'disabled',
    caret: 'hide',
    maxDiffPixelRatio: 0.04,
  });
});
