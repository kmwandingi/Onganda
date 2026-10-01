// ─── /test/launch — a second landing page, different dials ───────────────────
// The same package and rules as /test/landing, with the creative dials set
// the other way: gold leads instead of ochre; a split hero with a display-size
// pixel illustration instead of a centred statement; a bento with one raised,
// tinted feature instead of an even grid; the inverse band in the middle;
// lift on the call to action; the weave on the closing ground. Put the two
// side by side: one system, two pages that do not look alike.

import { useState } from 'react';
import {
  accentFor, DISPLAY, ICON_SIZE, IconArrowRight, PixelButton, PixelInversePanel, PixelPanel,
  PixelTag, roles, SectionHeader, systemIconForName, TEXTURE, TYPE, WeaveOverlay, useDark } from '@onganda/design-system';
import { TestFrame } from './shell';


const PEERS = [
  { system: 'Oshini', title: 'Adapt', body: 'Fine-tune and distil open models on Oshiwambo, Otjiherero and Khoekhoegowab.' },
  { system: 'Ombiga', title: 'Hold', body: 'Agents, memory and runtimes packed into one portable unit.' },
  { system: 'Etiti', title: 'Show', body: 'Dashboards and workspaces where the work meets the hand.' }
];

export const Launch = () => {
  const { isDark } = useDark();
  const c = roles(isDark);
  const LEAD = accentFor(2, isDark); // mahangu gold leads this page
  const [chosen, setChosen] = useState(0);
  return (
    <TestFrame current="/test/launch" action={<PixelButton lift>Join the pilot <IconArrowRight size={ICON_SIZE.inline} /></PixelButton>}>
      {/* Split hero: the statement on the left, the granary at display size on
          the right. The signature move of this page. */}
      <section className="mx-auto grid max-w-7xl items-center gap-10 px-6 pb-16 pt-16 md:px-12 lg:grid-cols-[1.3fr_1fr]">
        <div data-onganda-enter="">
          <PixelTag hex={LEAD} label="Pilot · 2026" />
          <h1 style={{ fontSize: DISPLAY.heroPublic.css, fontWeight: TYPE.display.weight, lineHeight: 1.02, margin: '24px 0 20px' }}>
            A granary for Namibia&rsquo;s languages.
          </h1>
          <p style={{ fontSize: TYPE.lead.size, lineHeight: TYPE.lead.lineHeight, color: c.textBody, maxWidth: 560, margin: 0 }}>
            Okaanda keeps the corpora, the evaluations and the models in one place, in the country,
            for the people who will use them.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <PixelButton lift>Request access</PixelButton>
            <PixelButton variant="ghost">Read the brief</PixelButton>
          </div>
        </div>
        <div className="flex justify-center lg:justify-end" aria-hidden="true">
          <div className="relative" style={{ padding: 32, border: `1px solid ${LEAD}40`, background: `${LEAD}14` }} data-onganda-depth="raised">
            {systemIconForName('Okaanda', ICON_SIZE.display * 2)}
          </div>
        </div>
      </section>

      {/* Bento: one raised, tinted feature; the peers lift on hover. */}
      <section className="mx-auto max-w-7xl px-6 pb-20 md:px-12">
        <SectionHeader label="What it holds" headline="One feature, three hands." accent={LEAD} />
        <div className="grid gap-4 lg:grid-cols-[1.2fr_1fr]">
          <PixelPanel accent={LEAD} tone="tint" depth="raised" eyebrow="Okaanda · the granary" title="Every corpus, versioned and evaluated">
            <p style={{ margin: 0, fontSize: TYPE.bodyLarge.size, lineHeight: TYPE.bodyLarge.lineHeight, color: c.textBody, maxWidth: 460 }}>
              128,400 news articles, 42,000 radio minutes, the parliament record — each with its licence,
              its consent trail and the models trained on it.
            </p>
            <dl className="grid grid-cols-3 gap-4" style={{ margin: '40px 0 0' }}>
              {[['128k', 'news articles'], ['42k', 'radio minutes'], ['11', 'languages']].map(([n, l]) => (
                <div key={l}>
                  <dt style={{ fontSize: TYPE.display.size, fontWeight: TYPE.display.weight, lineHeight: 1, fontFamily: 'var(--onganda-font-heading)' }}>{n}</dt>
                  <dd style={{ margin: '8px 0 0', fontSize: TYPE.meta.size, color: c.textMuted }}>{l}</dd>
                </div>
              ))}
            </dl>
          </PixelPanel>
          <div className="grid content-start gap-4">
            {PEERS.map((p, i) => (
              <PixelPanel key={p.title} accent={accentFor(i + 3, isDark)} spine depth="lift" tag={String(i + 1).padStart(2, '0')}
                eyebrow={p.system} title={p.title} note={p.body}
                selected={chosen === i} onClick={() => setChosen(i)} data-testid="launch-peer" />
            ))}
          </div>
        </div>
      </section>

      {/* The inverse band sits in the middle of this page, not at its foot. */}
      <div className="mx-auto max-w-7xl px-6 pb-20 md:px-12">
        <PixelInversePanel tag={<PixelTag hex={LEAD} label="Why here" isDark />} headline="Models trained elsewhere arrive last.">
          Onganda builds from the languages people speak in Namibia and the problems they already have.
        </PixelInversePanel>
      </div>

      {/* The weave goes on the closing ground of this page. */}
      <section className="relative overflow-hidden" style={{ background: c.canvas, borderTop: `1px solid ${c.line}` }}>
        <WeaveOverlay opacity={TEXTURE.ground} />
        <div className="relative mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-6 px-6 py-16 md:px-12">
          <h2 style={{ fontSize: TYPE.pageTitle.size, fontWeight: TYPE.pageTitle.weight, margin: 0 }}>Twelve pilot places left.</h2>
          <PixelButton lift>Join the pilot <IconArrowRight size={ICON_SIZE.inline} /></PixelButton>
        </div>
      </section>
    </TestFrame>
  );
};
