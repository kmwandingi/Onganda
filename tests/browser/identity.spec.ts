import { expect, test, type Page } from '@playwright/test';
import { stubMapTiles } from './support/map-tiles';

// ─── Identity is relocated, never deleted ────────────────────────────────────
// Making labels readable meant taking system hues out of a lot of text, on the
// argument that "the hue is already carried by the mark beside it". That
// argument is only true if somebody checks it. Where it is false, the fix
// silently removed the signal instead of moving it, and no colour or contrast
// guard would ever notice.
//
// For every place a system's name is rendered, this asserts its hue still
// appears somewhere inside the card that names it — as a fill, a border, an
// icon, or a rule.

const SYSTEM_HEX: Record<string, string> = {
  Okaanda: '#D9791F',
  Oshini: '#8F3E21',
  Ombiga: '#DFAE2B',
  Etiti: '#6A4B2E',
  Oshitoo: '#6F4A6E'
};

const hexToRgb = (hex: string) => {
  const [r, g, b] = [1, 3, 5].map(i => parseInt(hex.slice(i, i + 2), 16));
  return { r, g, b };
};

const AUDIT = (systems: Record<string, string>) => {
  const parse = (s: string) => (s.match(/[\d.]+/g) || []).map(Number);
  const near = (a: number[], t: number[]) =>
    a.length >= 3 && Math.abs(a[0] - t[0]) <= 6 && Math.abs(a[1] - t[1]) <= 6 && Math.abs(a[2] - t[2]) <= 6;

  const results: { system: string; card: string; found: boolean }[] = [];

  for (const [name, hex] of Object.entries(systems)) {
    const target = [1, 3, 5].map(i => parseInt(hex.slice(i, i + 2), 16));

    // Every element whose own text is exactly this system's name.
    const labels = [...document.querySelectorAll<HTMLElement>('*')].filter(
      el => el.children.length === 0 && (el.textContent || '').trim() === name
    );

    for (const label of labels) {
      const r = label.getBoundingClientRect();
      if (r.width < 2 || r.height < 2) continue;

      // Walk up to a container that plausibly is "the card naming it".
      let card: HTMLElement | null = label;
      for (let i = 0; i < 5 && card?.parentElement; i++) card = card.parentElement;
      if (!card) continue;

      // Does the hue appear anywhere inside it, in any paint-bearing property?
      const carriers = [card, ...card.querySelectorAll<HTMLElement>('*')];
      const found = carriers.some(el => {
        const s = getComputedStyle(el);
        for (const prop of [s.backgroundColor, s.borderTopColor, s.borderLeftColor, s.borderBottomColor, s.borderRightColor, s.color, s.fill, s.stroke, s.boxShadow, s.backgroundImage]) {
          if (!prop || prop === 'none') continue;
          for (const m of String(prop).matchAll(/rgba?\(([^)]+)\)/g)) {
            if (near(parse(m[1]), target)) return true;
          }
          if (String(prop).toLowerCase().includes(hex.toLowerCase())) return true;
        }
        // SVG rects often carry the hue as an attribute.
        const fillAttr = el.getAttribute?.('fill');
        if (fillAttr && fillAttr.toLowerCase() === hex.toLowerCase()) return true;
        return false;
      });

      results.push({
        system: name,
        card: `${card.tagName}.${(card.className || '').toString().slice(0, 40)}`,
        found
      });
    }
  }
  return results;
};

const settle = async (page: Page) => {
  await page.waitForTimeout(1000);
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(1200);
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(400);
};

for (const route of ['/', '/full', '/showcase']) {
  test(`${route} keeps each system's identity beside its name`, async ({ page }) => {
    await stubMapTiles(page);
    await page.goto(route);
    await settle(page);

    const results = await page.evaluate(AUDIT, SYSTEM_HEX);
    expect(results.length, `${route} renders no system names at all — the audit is not looking at anything`).toBeGreaterThan(0);

    const orphaned = results.filter(r => !r.found);
    expect(
      orphaned,
      `${orphaned.length} of ${results.length} system labels on ${route} have no trace of their system colour in the card that names them. ` +
      `Making a label readable must relocate the hue to a mark, border or icon — not delete it.\n  ` +
      orphaned.map(o => `${o.system} in ${o.card}`).join('\n  ')
    ).toEqual([]);
  });
}

test('the audit can tell a missing identity signal from a present one', async ({ page }) => {
  // A card that names a system and carries its hue, and one that does not.
  await page.setContent(`
    <div id="good" style="padding:20px;border-left:3px solid #D9791F">
      <div><div><div><div><span>Okaanda</span></div></div></div></div>
    </div>
    <div id="bad" style="padding:20px;border-left:3px solid #1E1A17">
      <div><div><div><div><span>Oshitoo</span></div></div></div></div>
    </div>
  `);
  const results = await page.evaluate(AUDIT, SYSTEM_HEX);
  const good = results.find(r => r.system === 'Okaanda');
  const bad = results.find(r => r.system === 'Oshitoo');
  expect(good?.found, 'a card carrying its system hue should pass').toBe(true);
  expect(bad?.found, 'a card with no trace of its system hue should fail').toBe(false);
});
