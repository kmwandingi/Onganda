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
const GOLD = 'rgb(223, 174, 43)';       // the accent fill — char black on it, 8.41:1
const MOPANE = 'rgb(106, 75, 46)';
const MILLET_CLAY = 'rgb(232, 225, 207)';

// Scoped to the light specimen grid, not the whole section: the inverse band
// below it renders the same four intents with `isDark`, so an unscoped
// `getByRole('button', { name: 'Primary' })` matches two elements.
const openControls = async (page: Page) => {
  await page.goto('/showcase');
  const section = page.locator('#controls');
  await section.scrollIntoViewIfNeeded();
  await expect(section.getByText('One recipe per control. No free choices.')).toBeVisible();
  return section.getByTestId('controls-grid');
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

const expectEdge = (scope: Page | ReturnType<Page['locator']>, name: string, value: string) =>
  expect.poll(() => scope.getByRole('button', { name, exact: true })
    .evaluate(el => getComputedStyle(el).borderTopColor), { message: `${name} edge` }).toBe(value);

test('every sanctioned control is present in the showcase', async ({ page }) => {
  const section = await openControls(page);

  for (const label of ['Primary', 'Accent', 'Ghost', 'Delete', 'Disabled']) {
    await expect(section.getByRole('button', { name: label, exact: true })).toBeVisible();
  }
  await expect(section.locator('input[type="radio"]')).toHaveCount(4);
  await expect(section.locator('input[type="checkbox"]')).toHaveCount(3);
  // The two toggle specimens. The section's own light/dark mode switch sits
  // above the grid and is deliberately out of scope.
  await expect(section.getByRole('switch')).toHaveCount(2);
  // three field examples plus the two in the density comparison
  await expect(section.locator('input:not([type="radio"]):not([type="checkbox"])')).toHaveCount(5);
  await expect(section.locator('textarea')).toHaveCount(1);
  await expect(section.locator('select')).toHaveCount(1);
});

test('light mode: each button intent has its measured recipe', async ({ page }) => {
  const section = await openControls(page);
  await setMode(page, 'light');

  // The primary is ochre, never black. Ochre needs char black on it
  // (millet clay on ochre is 2.4:1), and its fill is 2.56:1 on dust light, so
  // a bark rust edge carries the boundary.
  await expectBg(section, 'Primary', OCHRE);
  await expectFg(section, 'Primary', CHAR_BLACK);
  await expectEdge(section, 'Primary', BARK_RUST);

  // The accent is mahangu gold with a mopane edge — gold alone is 1.68:1.
  await expectBg(section, 'Accent', GOLD);
  await expectFg(section, 'Accent', CHAR_BLACK);
  await expectEdge(section, 'Accent', MOPANE);

  // Danger is bark rust, not fired red — fired red tops out at 4.05:1. Fired
  // red is the edge, where the 3:1 boundary floor applies.
  await expectBg(section, 'Delete', BARK_RUST);
  await expectFg(section, 'Delete', MILLET_CLAY);
  await expectEdge(section, 'Delete', FIRED_RED);

  await expectBg(section, 'Ghost', 'rgba(0, 0, 0, 0)');
});

test('dark mode: the fills hold and the edges match them', async ({ page }) => {
  const section = await openControls(page);
  await setMode(page, 'dark');

  // Ochre is 5.68:1 on the dark card by itself, so the edge matches the fill.
  await expectBg(section, 'Primary', OCHRE);
  await expectFg(section, 'Primary', CHAR_BLACK);
  await expectEdge(section, 'Primary', OCHRE);

  await expectBg(section, 'Accent', GOLD);
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

  // First inside the grid: the mode switch is no longer in this scope.
  const toggle = section.getByRole('switch').first();
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

test('the inverse band renders controls with the dark role set', async ({ page }) => {
  // Rule 12: a control on an inverse surface takes the dark role set. The
  // rule was documented with no specimen on the page until now, and a control
  // dropped onto a footer or lab card without `isDark` resolves its hover
  // against the wrong ground.
  await page.goto('/showcase');
  const band = page.getByTestId('controls-inverse');
  await band.scrollIntoViewIfNeeded();
  await expect(band).toBeVisible();

  // The dark set: ochre primary with an ochre edge, gold accent — the same
  // recipe as the whole section switched to dark.
  await expect
    .poll(() => band.getByRole('button', { name: 'Primary', exact: true })
      .evaluate(el => getComputedStyle(el).borderTopColor))
    .toBe(OCHRE);
  await expect
    .poll(() => band.getByRole('button', { name: 'Accent', exact: true })
      .evaluate(el => getComputedStyle(el).backgroundColor))
    .toBe(GOLD);

  // And the band really is a dark surface on a light page.
  await expect
    .poll(() => band.evaluate(el => getComputedStyle(el).backgroundColor))
    .toBe(CHAR_BLACK);
});
