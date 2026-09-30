// ─── Test pages — shared shell ───────────────────────────────────────────────
// These pages are built the way a product consuming the package would build
// them: every import comes from '@onganda/design-system', colour comes from
// roles() or the --onganda-* variables in tokens.css, and nothing reaches into
// src/components. `npm run check:test-pages` runs the token guard on this
// folder in consumer mode, and `npm run test-pages` screenshots every page
// beside the reference shot it should resemble.

import React from 'react';
import { OngandaLogoMark, PixelButton, roles, TYPE } from '@onganda/design-system';

export const TEST_PAGES = [
  { path: '/test/app', label: 'App screen' },
  { path: '/test/dashboard', label: 'Dashboard' },
  { path: '/test/form', label: 'Form' },
  { path: '/test/landing', label: 'Landing' },
  { path: '/test/article', label: 'Article' }
] as const;

export type TestPath = (typeof TEST_PAGES)[number]['path'];

/** The top bar a product would put above its own screens. */
export const TestHeader = ({ current, action }: { current: TestPath; action?: React.ReactNode }) => {
  const c = roles(false);
  return (
    <header style={{ borderBottom: `1px solid ${c.line}`, background: c.canvas }}>
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-6 py-4 md:px-12">
        <a href="/test" className="flex items-center gap-3 no-underline" style={{ color: c.text }}>
          <OngandaLogoMark size={24} />
          <span style={{ fontSize: TYPE.ui.size, fontWeight: TYPE.ui.weight }}>Onganda</span>
        </a>
        <nav aria-label="Test pages" className="hidden items-center gap-6 md:flex">
          {TEST_PAGES.map(p => (
            <a
              key={p.path}
              href={p.path}
              aria-current={p.path === current ? 'page' : undefined}
              className="no-underline"
              style={{
                fontSize: TYPE.meta.size,
                fontWeight: TYPE.meta.weight,
                color: p.path === current ? c.text : c.textMuted,
                borderBottom: `2px solid ${p.path === current ? c.accentInk : 'transparent'}`,
                paddingBottom: 2
              }}
            >
              {p.label}
            </a>
          ))}
        </nav>
        {action ?? <PixelButton variant="ghost" href="/showcase">Showcase</PixelButton>}
      </div>
    </header>
  );
};

/** The page frame: canvas ground, body type, the header. */
export const TestFrame = ({ current, action, children }: {
  current: TestPath;
  action?: React.ReactNode;
  children: React.ReactNode;
}) => (
  <div
    data-test-page={current}
    className="min-h-screen w-full"
    style={{ background: 'var(--onganda-canvas)', color: 'var(--onganda-text)', fontFamily: 'var(--onganda-font-body)' }}
  >
    <TestHeader current={current} action={action} />
    <main>{children}</main>
  </div>
);

/** /test — an index of the pages. */
export const TestIndex = () => {
  const c = roles(false);
  return (
    <div className="min-h-screen w-full" style={{ background: c.canvas, color: c.text }}>
      <div className="mx-auto max-w-3xl px-6 py-16">
        <p style={{ fontSize: TYPE.eyebrow.size, fontWeight: TYPE.eyebrow.weight, letterSpacing: TYPE.eyebrow.tracking, textTransform: 'uppercase', color: c.textMuted }}>
          Consumer test pages
        </p>
        <h1 style={{ fontSize: TYPE.pageTitle.size, fontWeight: TYPE.pageTitle.weight, margin: '12px 0 24px' }}>
          Built only from the package.
        </h1>
        <ul className="grid gap-3" style={{ listStyle: 'none', padding: 0 }}>
          {TEST_PAGES.map(p => (
            <li key={p.path}>
              <a href={p.path} style={{ color: c.accentInk, fontSize: TYPE.bodyLarge.size }}>{p.label}</a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
