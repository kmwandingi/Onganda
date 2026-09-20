import { expect, test, type Page } from '@playwright/test';

// The Control Standards section is the reference for every sanctioned control.
// These tests assert the colour contract at runtime, which the static token
// guard cannot see: a component can read the right token and still paint the
// wrong element with it.
//
// The measured ratios behind these values live in scripts/check-contrast.mjs.

const OCHRE = 'rgb(217, 121, 31)';      // accent as a FILL — needs char black on it
const BARK_RUST = 'rgb(143, 62, 33)';   // accent as INK on light, and the danger fill
const FIRED_RED = 'rgb(200, 74, 27)';   // indicator only — status marks, invalid borders
const CHAR_BLACK = 'rgb(30, 26, 23)';
const MILLET_CLAY = 'rgb(232, 225, 207)';

const openControls = async (page: Page) => {
  await page.goto('/showcase');
  const section = page.locator('#controls');
  await section.scrollIntoViewIfNeeded();
  await expect(section.getByText('One recipe per control. No free choices.')).toBeVisible();
  return section;
};

const setMode = async (page: Page, mode: 'light' | 'dark') => {
  const stage = page.locator('#controls-stage');
  if ((await stage.getAttribute('data-mode')) !== mode) {
    await page.getByRole('switch').first().click();
  }
  await expect(stage).toHaveAttribute('data-mode', mode);
  return stage;
};

// Control colours transition over 200ms, so every read is polled past it.
const bgOf = (scope: Page | ReturnType<Page['locator']>, name: string) =>
  scope.getByRole('button', { name, exact: true })
    .evaluate(el => getComputedStyle(el).backgroundColor);

const fgOf = (scope: Page | ReturnType<Page['locator']>, name: string) =>
  scope.getByRole('button', { name, exact: true })
    .evaluate(el => getComputedStyle(el).color);

const expectBg = (scope: Page | ReturnType<Page['locator']>, name: string, value: string) =>
  expect.poll(() => bgOf(scope, name), { message: `${name} background` }).toBe(value);

const expectFg = (scope: Page | ReturnType<Page['locator']>, name: string, value: string) =>
  expect.poll(() => fgOf(scope, name), { message: `${name} foreground` }).toBe(value);

test('every sanctioned control is present in the showcase', async ({ page }) => {
  const section = await openControls(page);

  for (const label of ['Primary', 'Accent', 'Ghost', 'Delete', 'Disabled']) {
    await expect(section.getByRole('button', { name: label, exact: true })).toBeVisible();
  }
  await expect(section.locator('input[type="radio"]')).toHaveCount(4);
  await expect(section.locator('input[type="checkbox"]')).toHaveCount(3);
  // three choice-control switches plus the section's own mode switch
  await expect(section.getByRole('switch')).toHaveCount(3);
  await expect(section.locator('input:not([type="radio"]):not([type="checkbox"])')).toHaveCount(3);
  await expect(section.locator('textarea')).toHaveCount(1);
  await expect(section.locator('select')).toHaveCount(1);
});

test('light mode: each button intent has its measured recipe', async ({ page }) => {
  const section = await openControls(page);
  await setMode(page, 'light');

  await expectBg(section, 'Primary', CHAR_BLACK);
  await expectFg(section, 'Primary', MILLET_CLAY);

  // Ochre fills need char black on them: millet clay on ochre is 2.4:1.
  await expectBg(section, 'Accent', OCHRE);
  await expectFg(section, 'Accent', CHAR_BLACK);

  // Danger is bark rust, not fired red — fired red tops out at 4.05:1.
  await expectBg(section, 'Delete', BARK_RUST);
  await expectFg(section, 'Delete', MILLET_CLAY);

  await expectBg(section, 'Ghost', 'rgba(0, 0, 0, 0)');
});

test('dark mode: the primary action inverts and the accent holds', async ({ page }) => {
  const section = await openControls(page);
  await setMode(page, 'dark');

  // Char black is the dark canvas, so the neutral extreme flips to millet clay.
  await expectBg(section, 'Primary', MILLET_CLAY);
  await expectFg(section, 'Primary', CHAR_BLACK);

  await expectBg(section, 'Accent', OCHRE);
  await expectFg(section, 'Accent', CHAR_BLACK);
  await expectBg(section, 'Delete', BARK_RUST);
});

test('the field focus ring is the accent ink for the mode, not the accent fill', async ({ page }) => {
  await openControls(page);
  const borderOf = (id: string) =>
    page.locator(id).evaluate(el => getComputedStyle(el).borderTopColor);

  await setMode(page, 'light');
  await page.locator('#cs-email').focus();
  // Ochre as ink on a light surface is 2.4:1, so light mode focuses in bark rust.
  await expect.poll(() => borderOf('#cs-email')).toBe(BARK_RUST);

  await setMode(page, 'dark');
  await page.locator('#cs-email').focus();
  await expect.poll(() => borderOf('#cs-email')).toBe(OCHRE);
});

test('an invalid field shows a red boundary and a full-contrast message', async ({ page }) => {
  const section = await openControls(page);
  await setMode(page, 'light');

  await expect.poll(() => page.locator('#cs-org').evaluate(el => getComputedStyle(el).borderTopColor)).toBe(FIRED_RED);
  await expect(page.locator('#cs-org')).toHaveAttribute('aria-invalid', 'true');

  const alert = section.getByRole('alert');
  await expect(alert).toContainText('This field is required.');
  // Fired red as text is 3.6:1. The message runs at full contrast and the red
  // is carried by the marker, so colour is never the only signal.
  await expect.poll(() => alert.evaluate(el => getComputedStyle(el).color)).toBe(CHAR_BLACK);
  await expect(alert.locator('span[aria-hidden="true"]')).toHaveCount(1);
});

test('checked reads as ochre on checkbox, radio, and toggle alike', async ({ page }) => {
  const section = await openControls(page);
  await setMode(page, 'light');

  const checkbox = section.locator('input[type="checkbox"]').first();
  await expect(checkbox).toBeChecked();
  const box = () => checkbox.evaluate(el => {
    const s = getComputedStyle(el.nextElementSibling as Element);
    return `${s.backgroundColor} / ${s.borderTopColor}`;
  });
  // The ochre fill is 2.56:1 on dust light, so the edge carries the boundary.
  await expect.poll(box).toBe(`${OCHRE} / ${BARK_RUST}`);

  const toggle = section.getByRole('switch').nth(1);
  await expect(toggle).toHaveAttribute('aria-checked', 'true');
  await expect.poll(() => toggle.evaluate(el => getComputedStyle(el.firstElementChild as Element).backgroundColor)).toBe(OCHRE);

  await section.getByText('Early access').click();
  const radioCore = await section.locator('label', { hasText: 'Early access' })
    .locator('svg rect').last().getAttribute('fill');
  expect(radioCore?.toUpperCase()).toBe('#D9791F');
});

test('no control uses a rounded corner in either mode', async ({ page }) => {
  await openControls(page);
  for (const mode of ['light', 'dark'] as const) {
    const stage = await setMode(page, mode);
    const rounded = await stage.evaluate(el =>
      [...el.querySelectorAll('button, input, select, textarea, [role="switch"]')]
        .filter(c => getComputedStyle(c).borderRadius.split(' ').some(v => parseFloat(v) > 0))
        .length
    );
    expect(rounded, `rounded controls in ${mode} mode`).toBe(0);
  }
});

test('an accent button on an inverse surface stays visible on hover', async ({ page }) => {
  // The inverse card is locally dark, so its buttons take the dark role set.
  // With the light set, accent hover resolves to char black and the button
  // would disappear into the card.
  await page.goto('/showcase');
  const cta = page.getByRole('link', { name: /Read the manifesto/i })
    .or(page.getByRole('button', { name: /Read the manifesto/i })).first();
  await cta.scrollIntoViewIfNeeded();

  const surface = await cta.evaluate(el => {
    const card = el.closest('[class*="overflow-hidden"]') as HTMLElement;
    return getComputedStyle(card).backgroundColor;
  });

  await cta.hover();
  // Let the 200ms colour transition settle before reading: a polled `.not`
  // assertion would otherwise pass on the first mid-transition sample.
  await cta.evaluate(el => new Promise<void>(done => {
    const finish = () => done();
    el.addEventListener('transitionend', finish, { once: true });
    setTimeout(finish, 600);
  }));

  const hovered = await cta.evaluate(el => getComputedStyle(el).backgroundColor);
  expect(hovered, 'the hovered CTA must not match the card it sits on').not.toBe(surface);
  expect(hovered).toBe(MILLET_CLAY);
});

test('the section fits without horizontal overflow at phone width', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  const section = await openControls(page);
  const overflowing = await section.evaluate(el => {
    const limit = document.documentElement.clientWidth;
    return [...el.querySelectorAll('*')].filter(c => c.getBoundingClientRect().right > limit + 1).length;
  });
  expect(overflowing).toBe(0);
});
