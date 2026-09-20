import { expect, test, type Page } from '@playwright/test';

// ─── Measured from pixels, not from computed style ───────────────────────────
// The DOM audit resolves a background by walking up to the first opaque
// ancestor. That ignores everything painted in between: the basket-weave, the
// dither columns behind the hero, gradients, and any motion mid-flight. A label
// can measure 6:1 there and still render over a dark dither stripe.
//
// This screenshots the real page and samples the pixels actually behind each
// piece of text, at several animation frames. The screenshot is decoded inside
// the browser, so this needs no image dependency.

interface Failure { text: string; ratio: number; need: number; size: number }

const sampleAgainstPixels = async (page: Page, selector: string): Promise<Failure[]> => {
  const shot = (await page.screenshot({ type: 'png' })).toString('base64');
  return page.evaluate(
    async ({ png, sel, dpr }) => {
      const lum = (r: number, g: number, b: number) => {
        const f = (c: number) => { c /= 255; return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4; };
        return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
      };
      const ratio = (a: number, b: number) => { const [hi, lo] = a > b ? [a, b] : [b, a]; return (hi + 0.05) / (lo + 0.05); };
      const parse = (s: string) => (s.match(/[\d.]+/g) || []).map(Number);

      const img = new Image();
      img.src = 'data:image/png;base64,' + png;
      await img.decode();
      const canvas = document.createElement('canvas');
      canvas.width = img.width; canvas.height = img.height;
      const ctx = canvas.getContext('2d', { willReadFrequently: true })!;
      ctx.drawImage(img, 0, 0);
      const scale = img.width / window.innerWidth || dpr;

      const root = document.querySelector(sel) ?? document.body;
      const out: Failure[] = [];
      const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
      const seen = new Set<Element>();

      for (let n = walker.nextNode(); n; n = walker.nextNode()) {
        const t = (n.textContent || '').trim();
        if (t.length < 3) continue;
        const el = n.parentElement;
        if (!el || seen.has(el)) continue;
        seen.add(el);
        const r = el.getBoundingClientRect();
        if (r.width < 10 || r.height < 10) continue;
        if (r.top < 0 || r.bottom > window.innerHeight || r.left < 0 || r.right > window.innerWidth) continue;
        const st = getComputedStyle(el);
        if (st.visibility === 'hidden' || parseFloat(st.opacity) < 0.5) continue;
        if (el.closest('[aria-hidden="true"]')) continue;
        const c = parse(st.color);
        if ((c[3] ?? 1) < 0.95) continue; // translucent text belongs to the DOM audit
        const [tr, tg, tb] = c;
        const textLum = lum(tr, tg, tb);

        const data = ctx.getImageData(
          Math.round(r.x * scale), Math.round(r.y * scale),
          Math.max(1, Math.round(r.width * scale)), Math.max(1, Math.round(r.height * scale))
        ).data;

        // Glyph pixels and their antialiased edges are a minority of the box;
        // a real background — including a dither stripe — occupies a
        // substantial share of it. Bucket the pixels and judge only the
        // colours that actually cover ground, or the measurement becomes
        // "text versus its own antialiasing" and everything fails.
        const buckets = new Map<number, { n: number; r: number; g: number; b: number }>();
        let total = 0;
        for (let i = 0; i < data.length; i += 4) {
          const [pr, pg, pb] = [data[i], data[i + 1], data[i + 2]];
          const key = (pr >> 4 << 8) | (pg >> 4 << 4) | (pb >> 4);
          const b = buckets.get(key) ?? { n: 0, r: 0, g: 0, b: 0 };
          b.n++; b.r += pr; b.g += pg; b.b += pb;
          buckets.set(key, b);
          total++;
        }
        if (!total) continue;

        let worst = Infinity;
        for (const b of buckets.values()) {
          // A colour has to cover at least a tenth of the box to count as the
          // ground the text sits on.
          if (b.n / total < 0.1) continue;
          const [ar, ag, ab] = [b.r / b.n, b.g / b.n, b.b / b.n];
          // Skip the glyph's own cluster.
          if (Math.abs(ar - tr) < 40 && Math.abs(ag - tg) < 40 && Math.abs(ab - tb) < 40) continue;
          const v = ratio(textLum, lum(ar, ag, ab));
          if (v < worst) worst = v;
        }
        if (!isFinite(worst)) continue;

        const size = parseFloat(st.fontSize);
        const weight = parseInt(st.fontWeight) || 400;
        const need = (size >= 24 || (size >= 18.66 && weight >= 700)) ? 3 : 4.5;
        if (worst < need) out.push({ text: t.slice(0, 36), ratio: +worst.toFixed(2), need, size });
      }
      return out;
    },
    { png: shot, sel: selector, dpr: 1 }
  );
};

for (const [label, route, selector] of [
  ['the public hero over its dither columns', '/', 'body'],
  ['the showcase hero over its ticker', '/showcase', 'body'],
  ['weave-textured system cards', '/showcase', '#systems'],
  ['the Product Patterns surfaces', '/showcase', '#patterns'],
] as const) {
  test(`${label}: text is readable against the pixels actually painted`, async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto(route);
    await page.waitForTimeout(1200);
    if (selector !== 'body') {
      await page.locator(selector).scrollIntoViewIfNeeded();
      await page.waitForTimeout(900);
    }

    const all: Failure[] = [];
    // Three moments, so a moving stripe cannot hide between frames.
    for (const wait of [0, 700, 700]) {
      if (wait) await page.waitForTimeout(wait);
      all.push(...(await sampleAgainstPixels(page, selector)));
    }

    const unique = [...new Map(all.map(f => [f.text + f.ratio, f])).values()];
    expect(
      unique,
      `Text measured against what is really behind it on ${route} ${selector}:\n  ` +
      unique.slice(0, 10).map(f => `${f.ratio}:1 (needs ${f.need}) at ${f.size}px — "${f.text}"`).join('\n  ')
    ).toEqual([]);
  });
}

test('the pixel sampler detects text hidden by a layer the DOM audit cannot see', async ({ page }) => {
  // Computed style sees char black on millet clay — 13.25:1, a clean pass. The
  // mopane-brown stripe painted between them is what a reader actually gets,
  // and against it the same text is 2.19:1. The stripe hue is deliberately not
  // the text hue, or it would be indistinguishable from the glyph itself.
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.setContent(`
    <div id="probe" style="position:relative;background:#E8E1CF;width:700px;height:240px">
      <div style="position:absolute;inset:0;background:repeating-linear-gradient(90deg,#6A4B2E 0 24px,transparent 24px 40px)"></div>
      <p style="position:relative;margin:0;padding:100px 20px;color:#1E1A17;font-size:16px;font-weight:400">Hidden by the stripe behind it</p>
    </div>
  `);
  await page.waitForTimeout(300);
  const failures = await sampleAgainstPixels(page, '#probe');
  expect(failures.length, 'the sampler must catch text lost against a painted layer').toBeGreaterThan(0);
});
