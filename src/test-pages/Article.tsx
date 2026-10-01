// ─── /test/article — a reading surface ───────────────────────────────────────
// Long-form content: the clean-type half of the Pixel vs. Type rule. Pixels
// stay in the marks and the header; the reading column is plain.

import type { ReactNode } from 'react';
import {
  PixelButton, PixelDot, PixelNotice, PixelPanel, PixelTable, PixelTag,
  roles, SectionHeader, TYPE, accentFor, type PixelColumn, useDark } from '@onganda/design-system';
import { TestFrame } from './shell';

type Result = { model: string; params: string; bleu: number; chrf: number };
const RESULTS: Result[] = [
  { model: 'namibia-base-1b', params: '1.1B', bleu: 21.4, chrf: 47.9 },
  { model: 'namibia-base-1b + Oshini', params: '1.1B', bleu: 27.8, chrf: 54.2 },
  { model: 'open baseline', params: '7B', bleu: 18.2, chrf: 44.1 }
];

const P = ({ children }: { children: ReactNode }) => {
  const { isDark } = useDark();
  const c = roles(isDark);
  return <p style={{ fontSize: TYPE.bodyLarge.size, lineHeight: TYPE.bodyLarge.lineHeight, color: c.textBody, margin: '0 0 20px' }}>{children}</p>;
};

export const Article = () => {
  const { isDark } = useDark();
  const c = roles(isDark);
  const columns: PixelColumn<Result>[] = [
    { key: 'model', header: 'Model', render: r => <span style={{ fontWeight: TYPE.ui.weight }}>{r.model}</span> },
    { key: 'params', header: 'Parameters', numeric: true, render: r => r.params },
    { key: 'bleu', header: 'BLEU', numeric: true, render: r => r.bleu.toFixed(1) },
    { key: 'chrf', header: 'chrF', numeric: true, render: r => r.chrf.toFixed(1) }
  ];

  return (
    <TestFrame current="/test/article">
      <article className="mx-auto max-w-7xl px-6 py-16 md:px-12">
        <SectionHeader level={1} label="Research note · 12 min read" headline="A small model that speaks Oshiwambo." />

        <div className="grid gap-12 lg:grid-cols-[1fr_300px]">
          <div style={{ maxWidth: 680 }}>
            <p style={{ fontSize: TYPE.lead.size, lineHeight: TYPE.lead.lineHeight, color: c.text, margin: '0 0 28px' }}>
              A one-billion-parameter model, adapted on 128,000 news articles, now beats an open seven-billion-parameter
              baseline on Oshiwambo translation. This note explains how, and what it does not yet do.
            </p>
            <P>
              We started from the observation that the large open models are trained on almost no Oshiwambo text. They
              produce fluent-looking output that a native reader recognises at once as wrong: borrowed grammar, invented
              words, English idioms carried across unchanged.
            </P>
            <h2 style={{ fontSize: TYPE.headline.size, fontWeight: TYPE.headline.weight, margin: '36px 0 16px' }}>What we measured</h2>
            <P>
              Each model translated the same 2,000 held-out sentences. We report BLEU for comparison with earlier work and
              chrF because it is kinder to an agglutinative language, where one long word carries what English spreads
              across five.
            </P>
            <PixelPanel emphasis="quiet" eyebrow="Table 1" title="Translation quality, English → Oshindonga">
              <PixelTable caption="Translation quality" columns={columns} rows={RESULTS} rowKey={r => r.model} />
            </PixelPanel>
            <blockquote style={{ margin: '36px 0', paddingLeft: 20, borderLeft: `3px solid ${c.accentInk}` }}>
              <p style={{ fontSize: TYPE.title.size, lineHeight: 1.5, fontWeight: TYPE.meta.weight, color: c.text, margin: 0 }}>
                “The adapted model gets the noun classes right. The baseline almost never does.”
              </p>
              <footer className="mt-3" style={{ fontSize: TYPE.meta.size, color: c.textMuted }}>Reviewer, University of Namibia</footer>
            </blockquote>
            <h2 style={{ fontSize: TYPE.headline.size, fontWeight: TYPE.headline.weight, margin: '36px 0 16px' }}>What it does not do</h2>
            <P>
              It has not seen spoken language, so transcripts of radio and conversation still trip it up. It has seen very
              little Oshikwanyama, the other main variety, and its errors there look like the baseline's.
            </P>
            <PixelNotice status="caution" title="Not for clinical use">
              Health translations are for pilot evaluation only and are reviewed by a clinician before they reach a patient.
            </PixelNotice>
          </div>

          <aside className="grid content-start gap-4">
            <PixelPanel emphasis="quiet" eyebrow="In this note">
              <ol className="grid gap-3" style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {['The problem', 'What we measured', 'What it does not do'].map((s, i) => (
                  <li key={s} className="flex items-center gap-3" style={{ fontSize: TYPE.meta.size, color: c.textBody }}>
                    <PixelDot color={accentFor(i)} size={6} />{s}
                  </li>
                ))}
              </ol>
            </PixelPanel>
            <PixelPanel emphasis="quiet" eyebrow="Filed under">
              <div className="flex flex-wrap gap-2">
                <PixelTag label="Oshini" />
                <PixelTag label="Evaluation" />
                <PixelTag label="Translation" />
              </div>
              <div className="mt-5"><PixelButton variant="ghost">Download PDF</PixelButton></div>
            </PixelPanel>
          </aside>
        </div>
      </article>
    </TestFrame>
  );
};
