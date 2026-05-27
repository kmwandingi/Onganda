// ─── Onganda Block Renderer — Pure Display ────────────────────────────────────
// Read-only rendering of DocBlock values. No editing state, no callbacks.
// Intended for published views, AI previews, and print output.
// The document editor's DocBlockView handles the interactive (editing) layer;
// this component handles only the display layer.

import React from 'react';
import { COLOR } from './onganda-colors';
import { OngandaLogoMark, PixelDot, DitherBar } from './onganda-primitives';
import type { DocBlock } from './onganda-block-types';

const ACCENT_COLORS = [COLOR.ochreOrange, COLOR.firedRed, COLOR.mahanguGold, COLOR.mopaneBrown, COLOR.dyePlum];

// ─── DocBlockDisplay ─────────────────────────────────────────────────────────
// Pure read-only rendering of a single DocBlock. Covers text block types
// (heading, body, pullquote, callout, list, divider, signature). Design blocks
// (stat, terminal, chart, etc.) show a labelled placeholder since their
// full rendering depends on editing-mode state in the document editor.

export const DocBlockDisplay = ({
  block,
  isDark = false,
  idx = 0
}: {
  block: DocBlock;
  isDark?: boolean;
  idx?: number;
}) => {
  const fg = isDark ? COLOR.milletClay : COLOR.charBlack;
  const bodyColor = isDark ? 'rgba(232,225,207,0.78)' : 'rgba(30,26,23,0.82)';
  const muted = isDark ? 'rgba(232,225,207,0.40)' : 'rgba(30,26,23,0.40)';
  const border = isDark ? 'rgba(232,225,207,0.10)' : 'rgba(30,26,23,0.10)';
  const accent = ACCENT_COLORS[idx % ACCENT_COLORS.length];
  const headingAccent = ACCENT_COLORS[Math.floor(idx / 2) % ACCENT_COLORS.length];

  if (block.type === 'divider') {
    return <div style={{ padding: '8px 0' }}>
      <DitherBar color={COLOR.ochreOrange} segments={48} height={3} opacity={0.35} />
    </div>;
  }

  if (block.type === 'signature') {
    return <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 0' }}>
      <OngandaLogoMark size={18} />
      <span style={{ fontSize: 11, color: muted, letterSpacing: '0.06em' }}>{block.content}</span>
    </div>;
  }

  if (block.type === 'heading') {
    return <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, paddingBottom: 14, borderBottom: `1px solid ${border}` }}>
      <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: headingAccent, minWidth: 20 }}>
        {String(Math.floor(idx / 3) + 1).padStart(2, '0')}
      </span>
      <h2 style={{ fontSize: 15, fontWeight: 700, letterSpacing: '-0.01em', color: fg, lineHeight: 1.2, flex: 1, margin: 0 }}>
        {block.content}
      </h2>
      <div style={{ flex: 0.3, height: 1, background: headingAccent, opacity: 0.25, marginBottom: 3 }} />
    </div>;
  }

  if (block.type === 'body') {
    return <p style={{ fontSize: 13.5, lineHeight: 1.85, color: bodyColor, margin: 0, fontFamily: 'Georgia, serif' }}>
      {block.content}
    </p>;
  }

  if (block.type === 'pullquote') {
    return <div style={{ borderLeft: `3px solid ${COLOR.ochreOrange}`, paddingLeft: 20, paddingTop: 4, paddingBottom: 4 }}>
      <p style={{ fontSize: 14, fontStyle: 'italic', fontWeight: 500, color: COLOR.ochreOrange, lineHeight: 1.7, margin: 0 }}>
        {block.content}
      </p>
    </div>;
  }

  if (block.type === 'callout') {
    return <div style={{ padding: '14px 18px', background: isDark ? `${COLOR.firedRed}0D` : `${COLOR.firedRed}08`, border: `1px solid ${COLOR.firedRed}35`, borderLeft: `3px solid ${COLOR.firedRed}`, display: 'flex', flexDirection: 'column', gap: 6 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <PixelDot color={COLOR.firedRed} size={5} />
        <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: COLOR.firedRed }}>Note</span>
      </div>
      <p style={{ fontSize: 12, lineHeight: 1.65, color: bodyColor, margin: 0 }}>{block.content}</p>
    </div>;
  }

  if (block.type === 'list') {
    const items = block.content.split(' · ').filter(Boolean);
    return <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 6 }}>
      {items.map((item, i) => <li key={`dbd-li-${block.id}-${i}`} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
        <div style={{ width: 5, height: 5, background: accent, marginTop: 7, flexShrink: 0 }} />
        <span style={{ fontSize: 13, lineHeight: 1.7, color: bodyColor, fontFamily: 'Georgia, serif' }}>{item}</span>
      </li>)}
    </ul>;
  }

  // Design blocks (stat, terminal, heatmap, timeline, systemcard, flowchart,
  // principles, swatchrow, chart-*) rely on editor state; render a labelled
  // placeholder when shown outside the document editor.
  const label = block.chartTitle ?? block.content;
  return <div style={{ padding: '10px 14px', border: `1px solid ${border}`, background: isDark ? 'rgba(232,225,207,0.04)' : 'rgba(30,26,23,0.03)' }}>
    <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: muted }}>{block.type}</span>
    {label ? <span style={{ fontSize: 11, color: muted, marginLeft: 10 }}>{label}</span> : null}
  </div>;
};

// ─── BlockRenderer ────────────────────────────────────────────────────────────
// Context-aware wrapper. Currently only 'document' context is implemented;
// 'slide' is reserved for when slide blocks adopt the DocBlock schema.
export const BlockRenderer = ({
  block,
  context = 'document',
  isDark = false,
  idx = 0
}: {
  block: DocBlock;
  context?: 'document' | 'slide';
  isDark?: boolean;
  idx?: number;
}) => {
  if (context === 'document') return <DocBlockDisplay block={block} isDark={isDark} idx={idx} />;
  // TODO: add 'slide' context when slide blocks migrate to shared DocBlock schema
  return <DocBlockDisplay block={block} isDark={isDark} idx={idx} />;
};
