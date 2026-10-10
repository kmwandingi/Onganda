import { expect, test } from '@playwright/test';
import { cpSync, existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import path from 'node:path';

// "Copy code" on /showcase must hand an agent code that works: it compiles
// under strict TypeScript against the package, and it passes onganda-check.
// Every section is copied, written to a file and checked both ways.
//
// The same files ship as blocks/<section>.tsx, so an agent can start from a
// whole showcase section without a browser. They must match what the showcase
// copies today: a stale block fails here. UPDATE_BLOCKS=1 rewrites them.

const OUT = path.join(process.cwd(), 'tests/copy-code/generated');
const BLOCKS = path.join(process.cwd(), 'blocks');

test('every section on /showcase copies as code that compiles and passes the guard', async ({ page }) => {
  test.setTimeout(240_000);
  rmSync(OUT, { recursive: true, force: true });
  mkdirSync(OUT, { recursive: true });
  await page.goto('/showcase?copy');
  await page.getByTestId('copy-toggle').click();
  const buttons = page.getByTestId('copy-section');
  await expect(buttons.first()).toBeVisible();
  const count = await buttons.count();
  expect(count, 'one Copy section button per showcase section').toBeGreaterThanOrEqual(15);

  for (let i = 0; i < count; i++) {
    await buttons.nth(i).scrollIntoViewIfNeeded();
    await buttons.nth(i).click();
    const code = (await page.getByTestId('copy-code').textContent()) ?? '';
    expect(code, `section ${i} produced code`).toMatch(/from '@onganda\/design-system(\/\w+)?'/);
    // Named after the section, which is what an agent looks for: its id, or
    // the name on the code's first line when the section has none.
    const id = await buttons.nth(i).evaluate(b => b.closest('[data-onganda-copy-ui]')?.parentElement?.id ?? '');
    const named = code.match(/^\/\/ The "(.+?)" section/)?.[1] ?? `section ${i}`;
    const slug = id || named.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    writeFileSync(path.join(OUT, `${slug}.tsx`), code);
    await page.keyboard.press('Escape');
    await expect(page.getByTestId('copy-code')).toHaveCount(0);
  }

  // Zero gaps: every section must be expressible with the design system alone
  // — no private helper, no dropped render callback, no hand-built card the
  // generator had to rewrite. A gap here is missing in the SYSTEM.
  const gaps = await page.evaluate(() => (window as unknown as { __ongandaCopyGaps?: Record<string, unknown[]> }).__ongandaCopyGaps ?? {});
  const withGaps = Object.entries(gaps).filter(([, g]) => g.length);
  expect(withGaps, `sections the design system cannot reproduce: ${JSON.stringify(withGaps)}`).toEqual([]);

  const guard = (() => {
    try { execFileSync('node', ['scripts/check-design-tokens.mjs', '--paths', OUT], { encoding: 'utf8' }); return ''; }
    catch (e) { return String((e as { stdout?: string }).stdout ?? e); }
  })();
  expect(guard, 'generated code passes onganda-check').toBe('');

  const tsc = (() => {
    try { execFileSync('npx', ['tsc', '-p', 'tests/copy-code/tsconfig.json'], { encoding: 'utf8' }); return ''; }
    catch (e) { return String((e as { stdout?: string }).stdout ?? e); }
  })();
  expect(tsc.split('\n').slice(0, 30).join('\n'), 'generated code type-checks').toBe('');

  if (process.env.UPDATE_BLOCKS) {
    rmSync(BLOCKS, { recursive: true, force: true });
    cpSync(OUT, BLOCKS, { recursive: true });
  }
  const generated = readdirSync(OUT).sort();
  const shipped = existsSync(BLOCKS) ? readdirSync(BLOCKS).filter(f => f.endsWith('.tsx')).sort() : [];
  const stale = generated.filter(f => !shipped.includes(f) || readFileSync(path.join(BLOCKS, f), 'utf8') !== readFileSync(path.join(OUT, f), 'utf8'))
    .concat(shipped.filter(f => !generated.includes(f)));
  expect(stale, 'blocks/ matches the showcase — run UPDATE_BLOCKS=1 npx playwright test copy-code').toEqual([]);
});

test('an element copies as itself, with the section one click away', async ({ page }) => {
  await page.goto('/showcase?copy');
  await page.getByTestId('copy-toggle').click();
  const panel = page.locator('#product-surface [data-onganda-panel]').first();
  await panel.scrollIntoViewIfNeeded();
  await panel.click({ position: { x: 30, y: 30 } });
  const code = (await page.getByTestId('copy-code').textContent()) ?? '';
  expect(code).toContain('<PixelPanel');
  expect(code).toContain('accentFor(0)');
  expect(code).not.toMatch(/#[0-9a-f]{6}/i);
  await page.getByRole('button', { name: 'Whole section instead' }).click();
  expect(await page.getByTestId('copy-code').textContent()).toContain('<SectionHeader');
});

test('copy mode is off by default and leaves the page untouched', async ({ page }) => {
  await page.goto('/showcase');
  await expect(page.getByTestId('copy-toggle')).toHaveCount(0); // hidden under automation without ?copy
  await expect(page.getByTestId('copy-section')).toHaveCount(0);
});
