import { expect, test, type Page } from '@playwright/test';

// ─── Fidelity to the public site ─────────────────────────────────────────────
// The public site is not a consumer of this design system. It is the SOURCE of
// it. The site came first, it is what the brand actually looks like, and the
// tokens and patterns in this repo are a transcript of it.
//
// That makes a specific kind of regression possible, and it is the one that
// already happened once: the system quietly drifts into a denser, flatter
// house style of its own — smaller titles, tighter padding, marks stacked on
// top of each other — and every product built from it stops looking like the
// site it was supposed to look like. Nothing caught it, because every other
// guard here is about what a surface may NOT do.
//
// So this file measures the real thing and the system's copy of it, and fails
// when they disagree. If you change a value here, change the public site
// first; the site is the fact and the token is the record.

interface CardMetrics {
  background: string;
  border: string;
  radius: string;
  shadow: string;
  title: string | null;
  padding: number;
}

const readCard = (page: Page, selector: string) =>
  page.locator(selector).first().evaluate((node: Element): CardMetrics => {
    const cs = getComputedStyle(node);
    // The padded element is the card itself or the positioned box inside it.
    const padded = parseFloat(cs.paddingTop) > 0
      ? node
      : [...node.querySelectorAll(':scope > div')]
          .find(d => parseFloat(getComputedStyle(d).paddingTop) > 0) ?? node;
    const heading = node.querySelector('h1, h2, h3');
    const hs = heading ? getComputedStyle(heading) : null;
    return {
      background: cs.backgroundColor,
      border: `${cs.borderTopWidth} ${cs.borderTopColor}`,
      radius: cs.borderTopLeftRadius,
      shadow: cs.boxShadow,
      title: hs && `${parseFloat(hs.fontSize)}/${hs.fontWeight}/${(parseFloat(hs.lineHeight) / parseFloat(hs.fontSize)).toFixed(2)}`,
      padding: parseFloat(getComputedStyle(padded).paddingTop),
    };
  });

const settle = async (page: Page) => {
  // Cards enter on scroll, so nothing is measurable until the page has been
  // walked from top to bottom.
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 600) {
      window.scrollTo(0, y);
      await new Promise(r => setTimeout(r, 60));
    }
    window.scrollTo(0, 0);
  });
  await page.waitForTimeout(600);
};

test.describe('the design system reproduces the public site', () => {
  test('PixelPanel matches the site feature card', async ({ page }) => {
    await page.goto('/');
    await settle(page);
    const site = await readCard(page, '#why article');

    await page.goto('/showcase');
    await settle(page);
    // The compact demo is first in the DOM; measure the page-density one, which
    // is the specimen that claims to be the site's card.
    const system = await readCard(page, '[data-testid="panel-page-density"]');

    // The card's material: same paper, same hairline, same flat geometry.
    expect(system.background).toBe(site.background);
    expect(system.border).toBe(site.border);
    expect(system.radius).toBe(site.radius);
    expect(system.shadow).toBe(site.shadow);
    // The card's voice: an 18px semibold title, not a 16px one.
    expect(system.title).toBe(site.title);
    // The card's air. This is what made panels built from the system look
    // cramped beside the site — half the padding at the same width.
    expect(system.padding).toBe(site.padding);
  });

  test('a card carries one mark recipe, never both', async ({ page }) => {
    // The site is disciplined about this and the system must be too: corner
    // marks OR a spine-and-dither, never stacked. Stacking them is what reads
    // as busy and over-ruled, and it is what an earlier PixelPanel did.
    //
    // This measures the SYSTEM's panels, not the site's. An earlier version of
    // this test read the site's own cards, which can never catch the system
    // drifting — it passed happily with both recipes stacked in PixelPanel.
    await page.goto('/showcase');
    await settle(page);

    const recipes = await page.evaluate(() => {
      return [...document.querySelectorAll('[data-onganda-panel]')].map(card => {
        const cs = getComputedStyle(card);
        const corners = [...card.children].filter(d => {
          const s = getComputedStyle(d);
          const r = d.getBoundingClientRect();
          return s.position === 'absolute' && r.width > 0 && r.width <= 12 && r.height <= 12;
        }).length;
        return {
          declared: card.getAttribute('data-onganda-panel'),
          spine: parseFloat(cs.borderLeftWidth) >= 3,
          corners,
        };
      });
    });

    // Both recipes must actually be on the showcase, or this asserts nothing.
    expect(recipes.some(r => r.declared === 'corners')).toBe(true);
    expect(recipes.some(r => r.declared === 'spine')).toBe(true);

    for (const r of recipes) {
      expect(r.spine && r.corners > 0).toBe(false);
      // And each recipe must carry the marks it claims to.
      if (r.declared === 'spine') expect(r.spine).toBe(true);
      if (r.declared === 'corners') expect(r.corners).toBe(4);
      // Quiet is working chrome: no marks at all, or it is not quiet.
      if (r.declared === 'quiet') expect(r.corners).toBe(0);
    }
  });

  test('section headers open with the site rhythm', async ({ page }) => {
    await page.goto('/');
    await settle(page);

    // Accent dot, 12px uppercase label, 30px MEDIUM headline, hairline rule.
    // The headline weight is the load-bearing part: a semibold section
    // headline competes with the card titles underneath it.
    // The eyebrow is a <p> and the headline is the <h2>. They used to be the
    // other way round, which put the section's largest text outside the
    // display-face rule and gave every section two competing headings.
    const header = await page.locator('#systems').locator('xpath=.//div[h2]').first().evaluate(node => {
      const label = node.querySelector('p')!;
      const ls = getComputedStyle(label);
      const headline = node.querySelector('h2')!;
      const ps = getComputedStyle(headline);
      // PixelDot renders a <span>, not a <div>.
      const dot = node.querySelector('span[aria-hidden]');
      return {
        labelSize: parseFloat(ls.fontSize),
        labelWeight: ls.fontWeight,
        labelCase: ls.textTransform,
        headlineSize: parseFloat(ps.fontSize),
        headlineWeight: ps.fontWeight,
        hasDot: !!dot && dot.getBoundingClientRect().width <= 10,
      };
    });

    expect(header.labelSize).toBe(12);
    expect(header.labelWeight).toBe('700');
    expect(header.labelCase).toBe('uppercase');
    expect(header.headlineSize).toBe(30);
    expect(header.headlineWeight).toBe('500');
    expect(header.hasDot).toBe(true);
  });

  test('the system card is the site card', async ({ page }) => {
    // Both grids render the same component now; this asserts the component
    // still produces the site's recipe rather than drifting back to the
    // shadowed, 18px-title, hover-only-dither version it used to be.
    const read = async (url: string, sel: string) => {
      await page.goto(url);
      await settle(page);
      return page.locator(sel).first().evaluate((node: Element) => {
        const cs = getComputedStyle(node);
        const h = node.querySelector('h3')!;
        const hs = getComputedStyle(h);
        const eyebrow = [...node.querySelectorAll('p')]
          .find(e => getComputedStyle(e).textTransform === 'uppercase');
        const es = eyebrow ? getComputedStyle(eyebrow) : null;
        return {
          shadow: cs.boxShadow,
          padding: cs.paddingTop,
          spine: cs.borderLeftWidth,
          title: `${parseFloat(hs.fontSize)}/${hs.fontWeight}`,
          eyebrow: es && `${parseFloat(es.fontSize)}/${es.fontWeight}`,
          // No dotted rule at the foot. Runs of 12+ tiny segments were the
          // retired dither effect.
          dotted: [...node.querySelectorAll('*')].filter(el =>
            el.children.length >= 12 && el.getBoundingClientRect().height > 0
            && el.getBoundingClientRect().height <= 6).length,
        };
      });
    };

    const site = await read('/', '#systems article');
    const system = await read('/showcase', '#systems article');

    expect(site.shadow).toBe('none');
    expect(system.shadow).toBe('none');
    expect(system.padding).toBe(site.padding);
    expect(system.spine).toBe(site.spine);
    expect(system.title).toBe(site.title);
    expect(system.eyebrow).toBe(site.eyebrow);
    expect(site.dotted).toBe(0);
    expect(system.dotted).toBe(0);
  });

  test('nothing in the system casts a shadow', async ({ page }) => {
    // The site renders zero blurred shadows. Depth is the weave, the hairline
    // and the stepped marks — never elevation. /showcase carried 14 of them.
    for (const route of ['/', '/full', '/showcase']) {
      await page.goto(route);
      await settle(page);
      const blurred = await page.evaluate(() =>
        [...document.querySelectorAll('body *')].filter(el => {
          const v = getComputedStyle(el).boxShadow;
          if (v === 'none') return false;
          const lens = v.match(/-?[\d.]+px/g) ?? [];
          // A `0 0 0 Npx` ring is a border, not elevation.
          return lens.length >= 3 && parseFloat(lens[2]) !== 0;
        }).length
      );
      expect(blurred, `${route} casts ${blurred} blurred shadow(s)`).toBe(0);
    }
  });
});
