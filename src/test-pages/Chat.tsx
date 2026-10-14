// ─── /test/chat — an embedded assistant ──────────────────────────────────────
// A chat or assistant panel, built only from the package. Each turn sits on a
// rail: a 24px mark joined to the next turn by a hairline, a small caps label,
// then the content at reading size. Starter questions are peer cards; sources
// are shown with the answer, numbered, never folded away; the field and its
// action are one control.

import { Fragment, useState, type ReactNode } from 'react';
import {
  ICON_SIZE, IconArrowUp, IconCheck, IconClose, IconRefresh, IconUser, PixelButton,
  PixelDot, PixelIconButton, PixelInputGroup, PixelPanel, PixelPeers, PixelSkeleton,
  PixelTag, PixelTextarea, TYPE, createPixelIcon, roles, statusFor, useDark, type StatusName
} from '@onganda/design-system';
import { TestFrame } from './shell';

const IconAssistant = createPixelIcon({
  grid: 12,
  rects: [
    { x: 5, y: 0, w: 2, h: 1 }, { x: 2, y: 2, w: 8, h: 2 }, { x: 2, y: 4, w: 2, h: 2 },
    { x: 8, y: 4, w: 2, h: 2 }, { x: 2, y: 6, w: 8, h: 2 }, { x: 4, y: 9, w: 4, h: 1 }
  ]
});

const READING = { fontSize: TYPE.body.size, lineHeight: 1.6 } as const;
const LABEL = { fontSize: TYPE.eyebrow.size, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase' } as const;

const SUGGESTED = [
  { topic: 'Visas', question: 'Do I need a visa to visit Namibia?' },
  { topic: 'Work permits', question: 'What documents does a work permit need?' },
  { topic: 'Registration', question: 'How much is a duplicate birth certificate?' },
  { topic: 'Study permits', question: 'Where do I apply for a study permit?' }
];

type Source = { title: string; publisher: string; checked: string };
type Turn =
  | { role: 'user'; text: string }
  | { role: 'assistant'; text: string; status: StatusName; state: string; sources: Source[]; needs?: string[] };

const ANSWER: Turn = {
  role: 'assistant', status: 'settled', state: 'Answered',
  text: 'A duplicate birth certificate costs N$100 for the first copy [1]. Apply at any regional office with your ID [1].',
  sources: [{ title: 'Application fees', publisher: 'Ministry of Home Affairs · Civil registration', checked: 'Checked 2026-10-14' }]
};

const CLARIFY: Turn = {
  role: 'assistant', status: 'caution', state: 'One more detail needed',
  text: 'Visa rules depend on the passport you travel on. Which country issued yours?',
  sources: [], needs: ['Nationality']
};

function RailTurn({ mark, label, labelColor, aside, last, children }: {
  mark: ReactNode; label: string; labelColor: string; aside?: ReactNode; last: boolean; children: ReactNode;
}) {
  const { isDark } = useDark();
  const c = roles(isDark);
  return (
    <section style={{ display: 'grid', gridTemplateColumns: '24px minmax(0, 1fr)', columnGap: 12 }}>
      <div aria-hidden style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <span style={{ display: 'inline-flex', width: 24, height: 24 }}>{mark}</span>
        {!last && <span style={{ flex: '1 1 auto', width: 1, minHeight: 12, margin: '4px 0', background: c.line }} />}
      </div>
      <div style={{ minWidth: 0, paddingBottom: last ? 8 : 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, minHeight: 24, marginBottom: 6 }}>
          <span style={{ ...LABEL, color: labelColor }}>{label}</span>
          {aside}
        </div>
        {children}
      </div>
    </section>
  );
}

function CitedText({ text, count }: { text: string; count: number }) {
  const { isDark } = useDark();
  const c = roles(isDark);
  return (
    <div style={{ ...READING, color: c.text }}>
      {text.split(/\[(\d+)\]/).map((part, i) => (i % 2 === 0 || Number(part) > count
        ? <Fragment key={i}>{part}</Fragment>
        : (
          <span key={i} aria-label={`Source ${part}`} style={{
            display: 'inline-block', minWidth: 14, padding: '0 3px', margin: '0 1px', border: `1px solid ${c.lineStrong}`,
            color: c.accentInk, fontSize: TYPE.micro.size, fontWeight: 700, lineHeight: '14px', textAlign: 'center', verticalAlign: 'super'
          }}>{part}</span>
        )))}
    </div>
  );
}

function AssistantTurn({ turn, last }: { turn: Extract<Turn, { role: 'assistant' }>; last: boolean }) {
  const { isDark } = useDark();
  const c = roles(isDark);
  const [vote, setVote] = useState(false);
  return (
    <RailTurn
      mark={<IconAssistant size={ICON_SIZE.control} color={c.accentInk} />}
      label="Answer" labelColor={c.accentInk} last={last}
      aside={(
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: c.textMuted, fontSize: TYPE.meta.size }}>
          <PixelDot color={statusFor(turn.status, isDark)} size={7} ring={c.lineStrong} />{turn.state}
        </span>
      )}
    >
      <CitedText text={turn.text} count={turn.sources.length} />
      {turn.needs && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 12 }}>
          <span style={{ ...LABEL, color: c.textMuted }}>To answer, I need</span>
          {turn.needs.map(n => <PixelTag key={n} label={n} />)}
        </div>
      )}
      {turn.sources.length > 0 && (
        <div style={{ marginTop: 16 }}>
          <div style={{ ...LABEL, color: c.textMuted, marginBottom: 8 }}>Source</div>
          {turn.sources.map((s, i) => (
            <div key={s.title} style={{ display: 'grid', gridTemplateColumns: 'auto minmax(0, 1fr)', alignItems: 'start', gap: 10, padding: '10px 12px', background: c.surfaceWell, borderLeft: `2px solid ${c.accentInk}` }}>
              <PixelTag label={String(i + 1).padStart(2, '0')} />
              <div style={{ minWidth: 0 }}>
                <a href="#" data-onganda-underline="" style={{ color: c.accentInk, fontWeight: 600 }}>{s.title}</a>
                <div style={{ color: c.textMuted, fontSize: TYPE.meta.size, marginTop: 2 }}>{s.publisher}</div>
                <div style={{ color: c.textMuted, fontSize: TYPE.meta.size }}>{s.checked}</div>
              </div>
            </div>
          ))}
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 12, fontSize: TYPE.meta.size, color: c.textMuted }}>
            {vote ? 'Thank you.' : (
              <>
                <span style={{ marginRight: 4 }}>Was this helpful?</span>
                <PixelButton variant="ghost" onClick={() => setVote(true)}><IconCheck size={ICON_SIZE.inline} /> Yes</PixelButton>
                <PixelButton variant="ghost" onClick={() => setVote(true)}><IconClose size={ICON_SIZE.inline} /> No</PixelButton>
              </>
            )}
          </div>
        </div>
      )}
    </RailTurn>
  );
}

export const Chat = () => {
  const { isDark } = useDark();
  const c = roles(isDark);
  const [turns, setTurns] = useState<Turn[]>([
    { role: 'user', text: 'How much is a duplicate birth certificate?' }, ANSWER,
    { role: 'user', text: 'Do I need a visa to visit Namibia?' }, CLARIFY
  ]);
  const [draft, setDraft] = useState('');
  const [working, setWorking] = useState(false);
  const ask = (text: string) => {
    if (!text.trim() || working) return;
    setTurns(t => [...t, { role: 'user', text: text.trim() }]);
    setDraft('');
    setWorking(true);
    setTimeout(() => { setTurns(t => [...t, ANSWER]); setWorking(false); }, 900);
  };

  return (
    <TestFrame current="/test/chat">
      <div className="mx-auto max-w-7xl px-6 py-12 md:px-12">
        {/* onganda-allow: hand-rolled-card — the window of an embedded panel, flush to its header and composer; PixelPanel pads its content */}
        <section style={{ maxWidth: 520, height: 720, margin: '0 auto', display: 'flex', flexDirection: 'column', border: `1px solid ${c.line}`, background: c.surface, boxShadow: 'var(--onganda-shadow-plate)' }}>
          <header style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 12px 12px 16px', background: c.inverse, borderBottom: `2px solid ${c.actionBg}` }}>
            <span aria-hidden style={{ width: 36, height: 36, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: c.actionBg }}>
              <IconAssistant size={ICON_SIZE.control} color={c.actionFg} />
            </span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <h1 style={{ margin: 0, fontSize: TYPE.title.size, lineHeight: 1.2, color: c.textOnInverse }}>Service assistant</h1>
              <div style={{ ...LABEL, marginTop: 4, color: c.textOnInverse, opacity: 0.7 }}>Published official sources</div>
            </div>
            <PixelIconButton isDark label="Start over" onClick={() => setTurns([])}>
              <IconRefresh size={ICON_SIZE.control} color={c.textOnInverse} />
            </PixelIconButton>
          </header>

          <div style={{ flex: 1, overflowY: 'auto', padding: '24px 16px 8px' }}>
            {turns.length === 0 && !working ? (
              <div data-onganda-enter="">
                <h2 style={{ margin: '0 0 8px', fontSize: TYPE.headline.size, lineHeight: 1.15, color: c.text }}>Ask about a public service</h2>
                <p style={{ ...READING, margin: '0 0 24px', color: c.textMuted }}>Every answer cites the published source.</p>
                <PixelPeers minWidth={168} gap={12} lift>
                  {SUGGESTED.map(s => (
                    <PixelPanel key={s.question} eyebrow={s.topic} onClick={() => ask(s.question)}>
                      <span style={{ fontSize: TYPE.body.size, lineHeight: 1.45, color: c.text }}>{s.question}</span>
                    </PixelPanel>
                  ))}
                </PixelPeers>
              </div>
            ) : turns.map((turn, i) => {
              const last = i === turns.length - 1 && !working;
              return turn.role === 'user'
                ? (
                  <RailTurn key={i} mark={<IconUser size={ICON_SIZE.control} color={c.textMuted} />} label="You asked" labelColor={c.textMuted} last={last}>
                    <div style={{ ...READING, padding: '10px 14px', background: c.surfaceWell, color: c.text }}>{turn.text}</div>
                  </RailTurn>
                )
                : <AssistantTurn key={i} turn={turn} last={last} />;
            })}
            {working && (
              <RailTurn mark={<IconAssistant size={ICON_SIZE.control} color={c.accentInk} />} label="Finding the published answer" labelColor={c.accentInk} last>
                <PixelSkeleton lines={3} />
              </RailTurn>
            )}
          </div>

          <form onSubmit={e => { e.preventDefault(); ask(draft); }} style={{ padding: 16, borderTop: `1px solid ${c.line}` }}>
            <PixelInputGroup>
              <PixelTextarea
                value={draft} onChange={e => setDraft(e.target.value)} rows={1} aria-label="Your question"
                placeholder="Ask about a visa, permit or fee"
                onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); ask(draft); } }}
                style={{ flex: 1, minHeight: 44, maxHeight: 132, resize: 'none', fieldSizing: 'content' } as React.CSSProperties}
              />
              <PixelButton type="submit" disabled={working || !draft.trim()}>Send <IconArrowUp size={ICON_SIZE.inline} /></PixelButton>
            </PixelInputGroup>
            <p style={{ margin: '8px 0 0', color: c.textMuted, fontSize: TYPE.meta.size }}>Answers can be incomplete. Do not share personal records.</p>
          </form>
        </section>
      </div>
    </TestFrame>
  );
};
