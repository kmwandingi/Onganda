// ─── /test/chat — an embedded assistant ──────────────────────────────────────
// A chat or assistant panel, built only from the package. Each turn sits on a
// rail: a 24px mark joined to the next turn by a hairline, a small caps label,
// then the content at reading size. Starter questions, sources and feedback
// are text actions (`variant="link"`), not boxes; sources are shown with the
// answer, numbered, never folded away; the field and its action are one control.

import { Fragment, useEffect, useRef, useState, type ReactNode } from 'react';
import {
  ICON_SIZE, IconArrowRight, IconArrowUp, IconExternalLink, IconRefresh, IconUser, PixelButton,
  PixelDot, PixelIconButton, PixelInputGroup, PixelSkeleton,
  PixelTextarea, TYPE, createPixelIcon, roles, statusFor, useDark, type StatusName
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
  { question: 'Do I need a visa to visit Namibia?' },
  { question: 'What documents does a work permit need?' },
  { question: 'How much is a duplicate birth certificate?' },
  { question: 'Where do I apply for a study permit?' }
];

type Source = { title: string; publisher: string; checked: string };
type Turn =
  | { role: 'user'; text: string }
  | { role: 'assistant'; text: string; status: StatusName; state: string; sources: Source[]; needs?: string[] };

const ANSWER: Turn = {
  role: 'assistant', status: 'settled', state: 'Answered',
  text: 'A duplicate birth certificate costs N$100 for the first copy [1]. Apply at any regional office with your ID [1].',
  sources: [{ title: 'Application fees', publisher: 'Ministry of Home Affairs', checked: '14 Oct 2026' }]
};

const CLARIFY: Turn = {
  role: 'assistant', status: 'caution', state: 'One more detail needed',
  text: 'Visa rules depend on the passport you travel on. Which country issued yours?',
  sources: [], needs: ['Your nationality', 'Where you are now']
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
            display: 'inline-block', minWidth: 16, padding: '0 4px', margin: '0 1px', background: c.surfaceWell,
            color: c.accentInk, fontSize: TYPE.micro.size, fontWeight: 700, lineHeight: '16px', textAlign: 'center', verticalAlign: 'super'
          }}>{part}</span>
        )))}
    </div>
  );
}

/** Sources under a hairline: number, title as a link, and when it was checked.
 *  Text actions, not boxes. */
function SourceList({ sources }: { sources: Source[] }) {
  const { isDark } = useDark();
  const c = roles(isDark);
  return (
    <div style={{ marginTop: 16, paddingTop: 12, borderTop: `1px solid ${c.line}` }}>
      <div style={{ ...LABEL, color: c.textMuted, marginBottom: 8 }}>{sources.length === 1 ? 'Source' : 'Sources'}</div>
      {sources.map((s, i) => (
        <div key={s.title} style={{ display: 'grid', gridTemplateColumns: 'auto minmax(0, 1fr)', alignItems: 'baseline', columnGap: 10, padding: '4px 0' }}>
          <span style={{ minWidth: 20, padding: '0 4px', background: c.surfaceWell, color: c.accentInk, fontSize: TYPE.meta.size, fontWeight: 700, textAlign: 'center' }}>{i + 1}</span>
          <span style={{ minWidth: 0 }}>
            <PixelButton variant="link" href="#">{s.title}<IconExternalLink size={ICON_SIZE.inline} /></PixelButton>
            <div style={{ color: c.textMuted, fontSize: TYPE.caption.size, marginTop: 2 }}>{s.publisher} · {s.checked}</div>
          </span>
        </div>
      ))}
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
        <div style={{ marginTop: 12, padding: '10px 14px', background: c.surfaceWell }}>
          <div style={{ ...LABEL, color: c.textMuted, marginBottom: 6 }}>To answer, I need</div>
          {/* Content in sentence case, not uppercase tags: tags are labels. */}
          <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'grid', gap: 4 }}>
            {turn.needs.map(n => (
              <li key={n} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: TYPE.meta.size, color: c.text }}>
                <PixelDot color={c.accentInk} size={5} />{n}
              </li>
            ))}
          </ul>
        </div>
      )}
      {turn.sources.length > 0 && <SourceList sources={turn.sources} />}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 12, fontSize: TYPE.meta.size, color: c.textMuted }}>
        {vote ? 'Thank you.' : (
          <>
            <span>Was this helpful?</span>
            <PixelButton variant="link" onClick={() => setVote(true)}>Yes</PixelButton>
            <PixelButton variant="link" onClick={() => setVote(true)}>No</PixelButton>
          </>
        )}
      </div>
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
  const transcript = useRef<HTMLDivElement>(null);
  // Follow the conversation; the welcome screen stays at its top.
  useEffect(() => {
    if (turns.length) transcript.current?.scrollTo({ top: transcript.current.scrollHeight });
  }, [turns, working]);
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
              <div style={{ ...LABEL, marginTop: 4, color: c.textOnInverse, opacity: 0.7 }}>Official sources</div>
            </div>
            <PixelIconButton isDark label="Start over" onClick={() => setTurns([])}>
              <IconRefresh size={ICON_SIZE.control} color={c.textOnInverse} />
            </PixelIconButton>
          </header>

          <div ref={transcript} style={{ flex: 1, overflowY: 'auto', padding: '24px 16px 8px' }}>
            {turns.length === 0 && !working ? (
              <div data-onganda-enter="">
                <h2 style={{ margin: '0 0 8px', fontSize: TYPE.headline.size, lineHeight: 1.15, color: c.text }}>Ask about a public service</h2>
                <p style={{ ...READING, margin: '0 0 24px', color: c.textMuted }}>Every answer cites the published source.</p>
                <div style={{ ...LABEL, color: c.textMuted, marginBottom: 4 }}>Common questions</div>
                {/* Starter questions are actions, so they read as links, not as cards. */}
                <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
                  {SUGGESTED.map(s => (
                    <li key={s.question} style={{ borderTop: `1px solid ${c.line}`, padding: '10px 0' }}>
                      <PixelButton variant="link" onClick={() => ask(s.question)}>
                        {s.question}<IconArrowRight size={ICON_SIZE.inline} />
                      </PixelButton>
                    </li>
                  ))}
                </ul>
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
                placeholder="Ask a question"
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
