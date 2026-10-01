import { expect, test, type Page } from '@playwright/test';
import { stubMapTiles } from './support/map-tiles';

// The role layer being compliant does not prove the pages are: a correct token
// can still land on the wrong background. This walks every rendered text node
// on every public route and measures its real contrast against the nearest
// opaque painted ancestor.
//
// It found 493 failures the first time it ran, in code that passed both static
// guards — ink at too-low alpha, ochre used as ink on light surfaces, and
// identity hues used as labels.

const AUDIT_SOURCE = () => {
  const lin = (c: number) => { c /= 255; return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4; };
  const lum = (v: number[]) => 0.2126 * lin(v[0]) + 0.7152 * lin(v[1]) + 0.0722 * lin(v[2]);
  const parse = (s: string) => (s.match(/[\d.]+/g) || []).map(Number);
  const over = (fg: number[], bg: number[], a: number) => fg.map((c, i) => c * a + bg[i] * (1 - a));
  const ratio = (a: number[], b: number[]) => {
    const [x, y] = [lum(a), lum(b)];
    const [hi, lo] = x > y ? [x, y] : [y, x];
    return (hi + 0.05) / (lo + 0.05);
  };
  const bgOf = (el: Element) => {
    for (let n: Element | null = el; n; n = n.parentElement) {
      const c = parse(getComputedStyle(n).backgroundColor);
      if (c.length >= 3 && (c[3] === undefined || c[3] > 0.85)) return c.slice(0, 3);
    }
    return [232, 225, 207];
  };

  const failures: string[] = [];
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  const seen = new Set<Element>();
  for (let n = walker.nextNode(); n; n = walker.nextNode()) {
    const text = (n.textContent || '').trim();
    if (text.length < 2) continue;
    const el = n.parentElement;
    if (!el || seen.has(el)) continue;
    seen.add(el);
    const r = el.getBoundingClientRect();
    if (r.width < 2 || r.height < 2) continue;
    const st = getComputedStyle(el);
    if (st.visibility === 'hidden' || st.display === 'none' || parseFloat(st.opacity) < 0.15) continue;
    // Decorative text is exempt, and marking it aria-hidden is how that
    // exemption is declared rather than assumed.
    if (el.closest('[aria-hidden="true"]')) continue;
    // WCAG 1.4.3 exempts inactive controls, which is what ALPHA.faint is for
    // ("disabled text and decorative ordinals ONLY"). Read the real state:
    // a control is exempt because it is disabled, not because it looks it.
    if (el.closest('[disabled], [aria-disabled="true"], fieldset:disabled')) continue;

    const bg = bgOf(el);
    const raw = parse(st.color);
    const alpha = raw[3] === undefined ? 1 : raw[3];
    const fg = over(raw.slice(0, 3), bg, alpha);
    const size = parseFloat(st.fontSize);
    const weight = parseInt(st.fontWeight) || 400;
    const large = size >= 24 || (size >= 18.66 && weight >= 700);
    const need = large ? 3.0 : 4.5;
    const got = ratio(fg, bg);
    if (got < need - 0.01) {
      failures.push(
        `${got.toFixed(2)}:1 (needs ${need}) — ${st.color} on rgb(${bg.map(Math.round).join(',')}) ` +
        `at ${size}px/${weight} in #${el.closest('[id]')?.id || el.tagName} — "${text.slice(0, 48)}"`
      );
    }
  }
  return failures;
};

const settle = async (page: Page) => {
  await page.waitForTimeout(1200);
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(1200);
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(400);
};

// The consumer test pages are included: built only from the package, they are
// what a product's screen actually looks like.
for (const route of ['/', '/full', '/showcase', '/test/app', '/test/studio', '/test/dashboard', '/test/form', '/test/landing', '/test/article']) {
  test(`every text node on ${route} meets its contrast floor`, async ({ page }) => {
    await stubMapTiles(page);
    await page.goto(route);
    await settle(page);
    const failures = await page.evaluate(AUDIT_SOURCE);
    expect(failures, `${failures.length} text nodes below their floor on ${route}:\n  ${failures.slice(0, 15).join('\n  ')}`).toEqual([]);
  });
}

// The editors are behind a click, so the route sweep above never reached them.
// They also paint on the eleven EDITOR_SURFACE grounds, two of which are dark
// while being used in light mode — that is how ink text at 1.13:1 survived
// there. Both shells are audited with the same walker.
for (const [name, open, template] of [
  ['document editor', /Create document|Documents/i, /Concept Paper/i],
  ['slide editor', /Build presentation/i, null],
] as const) {
  test(`the ${name} meets the contrast floor on every surface`, async ({ page }) => {
    await page.goto('/showcase');
    await page.locator('#publications').scrollIntoViewIfNeeded();
    await page.getByRole('button', { name: open }).first().click();
    await page.waitForTimeout(1000);
    if (template && await page.getByText(template).count()) {
      await page.getByText(template).first().click();
      await page.waitForTimeout(1800);
    }
    const failures = await page.evaluate(AUDIT_SOURCE);
    expect(failures, `${failures.length} text nodes below their floor in the ${name}:\n  ${failures.slice(0, 12).join('\n  ')}`).toEqual([]);
  });
}

test('the Control Standards section is compliant in dark mode too', async ({ page }) => {
  await page.goto('/showcase');
  await page.locator('#controls').scrollIntoViewIfNeeded();
  await page.getByRole('switch').first().click();
  await expect(page.locator('#controls-stage')).toHaveAttribute('data-mode', 'dark');
  await page.waitForTimeout(600);
  const failures = await page.evaluate(() => {
    const stage = document.querySelector('#controls-stage')!;
    const lin = (c: number) => { c /= 255; return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4; };
    const lum = (v: number[]) => 0.2126 * lin(v[0]) + 0.7152 * lin(v[1]) + 0.0722 * lin(v[2]);
    const parse = (s: string) => (s.match(/[\d.]+/g) || []).map(Number);
    const over = (f: number[], b: number[], a: number) => f.map((c, i) => c * a + b[i] * (1 - a));
    const ratio = (a: number[], b: number[]) => { const [x, y] = [lum(a), lum(b)]; const [hi, lo] = x > y ? [x, y] : [y, x]; return (hi + 0.05) / (lo + 0.05); };
    const bgOf = (el: Element) => { for (let n: Element | null = el; n; n = n.parentElement) { const c = parse(getComputedStyle(n).backgroundColor); if (c.length >= 3 && (c[3] === undefined || c[3] > 0.85)) return c.slice(0, 3); } return [18, 15, 13]; };
    const out: string[] = [];
    const w = document.createTreeWalker(stage, NodeFilter.SHOW_TEXT);
    const seen = new Set<Element>();
    for (let n = w.nextNode(); n; n = w.nextNode()) {
      const t = (n.textContent || '').trim(); if (t.length < 2) continue;
      const el = n.parentElement; if (!el || seen.has(el)) continue; seen.add(el);
      const r = el.getBoundingClientRect(); if (r.width < 2 || r.height < 2) continue;
      const st = getComputedStyle(el);
      // Same two exemptions as the page-wide audit above: decorative text,
      // and inactive controls, which WCAG 1.4.3 exempts.
      if (st.visibility === 'hidden' || parseFloat(st.opacity) < 0.15 || el.closest('[aria-hidden="true"]')) continue;
      if (el.closest('[disabled], [aria-disabled="true"], fieldset:disabled')) continue;
      const bg = bgOf(el); const raw = parse(st.color); const a = raw[3] === undefined ? 1 : raw[3];
      const size = parseFloat(st.fontSize); const weight = parseInt(st.fontWeight) || 400;
      const need = (size >= 24 || (size >= 18.66 && weight >= 700)) ? 3 : 4.5;
      const got = ratio(over(raw.slice(0, 3), bg, a), bg);
      if (got < need - 0.01) out.push(`${got.toFixed(2)}:1 ${st.color} on rgb(${bg.map(Math.round).join(',')}) — "${t.slice(0, 40)}"`);
    }
    return out;
  });
  expect(failures, failures.join('\n')).toEqual([]);
});
