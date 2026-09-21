// ─── Onganda Slide Editor — Full Editing Shell ─────────────────────────────
// Presentation editor: drag to place & move components on canvas, alignment
// guides when dragging, drag-to-reorder slides, Inspector for all properties.
// "New Presentation" = blank slides, Templates = pre-filled decks.

import React, { useState, useRef, useCallback, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { COLOR, EDITOR_SURFACE, statusFor, onColor, SYSTEMS, FLOW_NODES, TIMELINE_PHASES, TERMINAL_BLOCKS, HEATMAP_CELLS, HEATMAP_LABELS_X, HEATMAP_LABELS_Y, SECTOR_APPS, SLIDE_MARKET_DATA, SLIDE_BAR_DATA, SLIDE_RADAR_DATA } from './onganda-tokens';
import { OngandaLogoMark, PixelDot, DitherBar, PixelTag, WeaveOverlay, IconOkaanda, IconOshini, IconOmbiga, IconEtiti, IconOshitoo, useDark, FlowNodeIcon } from './onganda-primitives';
import { AiAuthoringPanel, AiAuthoringResult, AiSlideBlock } from './onganda-ai-authoring';
import { SLIDE_COMPONENT_PALETTE, SLIDE_PALETTE_CATEGORIES } from './onganda-block-palette';
import type { ComponentPaletteItem, SlideEntry, DroppedBlock } from './onganda-block-types';
import type { DeckExportPayload } from './onganda-export-api';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, RadarChart, Radar, PolarGrid, PolarAngleAxis } from 'recharts';
import { SlideInspector } from './onganda-slide-inspector';

// ─── Types ────────────────────────────────────────────────────────────────────
// SlideEntry and DroppedBlock are imported from onganda-block-types.
interface AlignGuide {
  orientation: 'h' | 'v';
  position: number;
}
interface SlideDragState {
  draggingId: string | null;
  overIdx: number | null;
}

const AI_SYSTEM_INDEX: Record<string, number> = {
  Okaanda: 0,
  Oshini: 1,
  Ombiga: 2,
  Etiti: 3,
  Oshitoo: 4
};

const aiBlockType = (block: AiSlideBlock) => {
  if (block.type === 'headline') return 'text-headline';
  if (block.type === 'label') return 'text-label';
  if (block.type === 'quote') return 'text-quote';
  if (block.type === 'system') return `sys-card-${AI_SYSTEM_INDEX[block.systemName ?? 'Okaanda'] ?? 0}`;
  if (block.type === 'chart') return 'chart-progress';
  if (block.type === 'divider') return 'divider-dither';
  return 'text-body';
};

const aiBlockLayout = (block: AiSlideBlock, slideIdx: number, blockIdx: number) => {
  if (block.type === 'label') return { x: 50, y: 18, w: 34, h: 6, textSize: 12 };
  if (block.type === 'headline') return { x: 50, y: slideIdx === 0 ? 42 : 38, w: 78, h: 24, textSize: slideIdx === 0 ? 44 : 36 };
  if (block.type === 'body') return { x: 50, y: slideIdx === 0 ? 66 : 62, w: 58, h: 13, textSize: 16 };
  if (block.type === 'quote') return { x: 50, y: 52, w: 66, h: 20, textSize: 22 };
  if (block.type === 'chart') return { x: 50, y: 58, w: 72, h: 44 };
  if (block.type === 'system') return { x: 24 + blockIdx * 26, y: 62, w: 24, h: 24 };
  if (block.type === 'divider') return { x: 50, y: 80, w: 58, h: 3 };
  return { x: 50, y: 58, w: 58, h: 13, textSize: 16 };
};

const aiSlideBlock = (block: AiSlideBlock, slideIdx: number, blockIdx: number): DroppedBlock => {
  const layout = aiBlockLayout(block, slideIdx, blockIdx);
  return {
    id: `ai-slide-${Date.now()}-${slideIdx}-${blockIdx}-${Math.random().toString(36).slice(2, 6)}`,
    type: aiBlockType(block),
    label: block.type,
    ...layout,
    selected: false,
    editingText: false,
    textContent: ['headline', 'body', 'label', 'quote'].includes(block.type) ? block.content : undefined,
    systemIdx: block.type === 'system' ? AI_SYSTEM_INDEX[block.systemName ?? 'Okaanda'] ?? 0 : undefined,
    chartTitle: block.type === 'chart' ? block.content : undefined
  };
};

const safeFileName = (name: string) => (name.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '').slice(0, 84).replace(/-$/g, '') || 'onganda-deck');

const downloadOfficeHtml = (filename: string, html: string, mime: string) => {
  const blob = new Blob(['\ufeff', html], { type: mime });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
};

const wrapPowerPointDeck = (title: string, bodyHtml: string) => `<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <title>${title}</title>
  <style>
    @page { size: 13.333in 7.5in; margin: 0; }
    html, body { margin: 0; background: ${COLOR.charBlack}; font-family: Inter, Arial, sans-serif; print-color-adjust: exact; -webkit-print-color-adjust: exact; }
    .onganda-print-slide { width: 13.333in; height: 7.5in; page-break-after: always; break-after: page; overflow: hidden; print-color-adjust: exact; -webkit-print-color-adjust: exact; }
    button, input, textarea { display: none !important; }
    svg { max-width: 100%; }
  </style>
</head>
<body>${bodyHtml}</body>
</html>`;

// ─── Session storage ──────────────────────────────────────────────────────────
const SLIDE_SESSION_KEY = 'onganda_slide_editor_session';
interface SlideSession {
  stage: 'picker' | 'editor';
  slides: SlideEntry[];
  deckTitle: string;
  slideBlocks: Record<string, DroppedBlock[]>;
  activeSlideId: string;
}
function loadSlideSession(): SlideSession | null {
  try {
    const raw = localStorage.getItem(SLIDE_SESSION_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as SlideSession;
  } catch {
    return null;
  }
}
function saveSlideSession(session: SlideSession) {
  try {
    localStorage.setItem(SLIDE_SESSION_KEY, JSON.stringify(session));
  } catch {
    // storage unavailable — silently skip
  }
}

// ─── Slide history snapshot ───────────────────────────────────────────────────
interface SlideHistorySnapshot {
  slides: SlideEntry[];
  slideBlocks: Record<string, DroppedBlock[]>;
  deckTitle: string;
}
function useSlideHistory(initial: SlideHistorySnapshot) {
  const [stack, setStack] = useState<SlideHistorySnapshot[]>([initial]);
  const [cursor, setCursor] = useState(0);
  const current = stack[cursor];
  const push = useCallback((next: SlideHistorySnapshot) => {
    setStack(prev => {
      const trimmed = prev.slice(0, cursor + 1);
      return [...trimmed, next].slice(-60);
    });
    setCursor(prev => Math.min(prev + 1, 59));
  }, [cursor]);
  const undo = useCallback(() => {
    setCursor(prev => Math.max(0, prev - 1));
  }, []);
  const redo = useCallback(() => {
    setCursor(prev => prev < stack.length - 1 ? prev + 1 : prev);
  }, [stack.length]);
  const canUndo = cursor > 0;
  const canRedo = cursor < stack.length - 1;
  const reset = useCallback((snapshot: SlideHistorySnapshot) => {
    setStack([snapshot]);
    setCursor(0);
  }, []);
  return {
    current,
    push,
    undo,
    redo,
    canUndo,
    canRedo,
    reset
  };
}


// ─── Chart data ───────────────────────────────────────────────────────────────
const SWATCHES_5 = [COLOR.ochreOrange, COLOR.firedRed, COLOR.mahanguGold, COLOR.mopaneBrown, COLOR.dyePlum];
const SYSTEM_ICON_MAP: Record<string, React.ReactNode> = {
  Okaanda: <IconOkaanda size={36} />,
  Oshini: <IconOshini size={36} />,
  Ombiga: <IconOmbiga size={36} />,
  Etiti: <IconEtiti size={36} />,
  Oshitoo: <IconOshitoo size={36} />
};

// ─── Template slide registry ──────────────────────────────────────────────────
const TEMPLATE_SLIDES: SlideEntry[] = [{
  id: 'slide-01',
  tag: '01',
  title: 'Namibia AI Platform',
  subtitle: 'Title slide'
}, {
  id: 'slide-02',
  tag: '02',
  title: 'The idea',
  subtitle: 'Concept overview'
}, {
  id: 'slide-03',
  tag: '03',
  title: 'Why this matters now',
  subtitle: 'Global market context'
}, {
  id: 'slide-04',
  tag: '04',
  title: 'Namibia already has the early pieces',
  subtitle: 'Institutional readiness'
}, {
  id: 'slide-05',
  tag: '05',
  title: 'The readiness gaps are identified',
  subtitle: 'Documented gaps'
}, {
  id: 'slide-06',
  tag: '06',
  title: 'The economic and business case',
  subtitle: 'Digital spend & market'
}, {
  id: 'slide-07',
  tag: '07',
  title: 'The labour-market case',
  subtitle: 'Jobs & employability'
}, {
  id: 'slide-08',
  tag: '08',
  title: 'The concept in one sentence',
  subtitle: 'Positioning'
}, {
  id: 'slide-09',
  tag: '09',
  title: 'The two-track operating model',
  subtitle: 'Architecture'
}, {
  id: 'slide-10',
  tag: '10',
  title: 'Internal system architecture',
  subtitle: 'Five systems'
}, {
  id: 'slide-11',
  tag: '11',
  title: 'What the tools can address',
  subtitle: 'Problem-to-tool mapping'
}, {
  id: 'slide-12',
  tag: '12',
  title: 'Sequencing reference: Mistral',
  subtitle: 'External analogue'
}, {
  id: 'slide-13',
  tag: '13',
  title: 'How the institution is structured',
  subtitle: 'Institutional model'
}, {
  id: 'slide-14',
  tag: '14',
  title: 'Delivery sequence',
  subtitle: 'First 24 months'
}, {
  id: 'slide-15',
  tag: '15',
  title: 'Core proposition',
  subtitle: 'Closing slide'
}];

// ─── Template slide pre-populated blocks ─────────────────────────────────────
// Canvas is 16:9, content area below 40px header.
// x/y = center-% of the content area. Blocks render via translate(-50%,-50%).
// Approximate rendered widths: icon~60, stat-card~130, chart~240, sys-card~240,
// timeline~200, flow-node~240, field-app~200, text-headline wraps naturally,
// text-body maxWidth 320, text-quote ~300, text-label ~auto, dither 200.
const TEMPLATE_SLIDE_BLOCKS: Record<string, DroppedBlock[]> = {
  'slide-01': [{
    id: 's01-h',
    type: 'text-headline',
    label: 'Headline',
    x: 50,
    y: 32,
    selected: false,
    editingText: false,
    textContent: 'Namibia AI Capability and Tooling Platform'
  }, {
    id: 's01-b',
    type: 'text-body',
    label: 'Body Text',
    x: 50,
    y: 52,
    selected: false,
    editingText: false,
    textContent: 'Building local AI capability, institutional deployment, and practical tools for Namibia'
  }, {
    id: 's01-d',
    type: 'divider-dither',
    label: 'Dither Divider',
    x: 50,
    y: 66,
    selected: false,
    editingText: false
  }, {
    id: 's01-i1',
    type: 'icon-okaanda',
    label: 'Okaanda Icon',
    x: 29,
    y: 82,
    selected: false,
    editingText: false
  }, {
    id: 's01-i2',
    type: 'icon-oshini',
    label: 'Oshini Icon',
    x: 40,
    y: 82,
    selected: false,
    editingText: false
  }, {
    id: 's01-i3',
    type: 'icon-ombiga',
    label: 'Ombiga Icon',
    x: 50,
    y: 82,
    selected: false,
    editingText: false
  }, {
    id: 's01-i4',
    type: 'icon-etiti',
    label: 'Etiti Icon',
    x: 60,
    y: 82,
    selected: false,
    editingText: false
  }, {
    id: 's01-i5',
    type: 'icon-oshitoo',
    label: 'Oshitoo Icon',
    x: 71,
    y: 82,
    selected: false,
    editingText: false
  }],
  'slide-02': [{
    id: 's02-h',
    type: 'text-headline',
    label: 'Headline',
    x: 50,
    y: 18,
    selected: false,
    editingText: false,
    textContent: 'The idea'
  }, {
    id: 's02-b',
    type: 'text-body',
    label: 'Body Text',
    x: 27,
    y: 52,
    selected: false,
    editingText: false,
    textContent: 'Namibia is entering a period in which AI will shape software, workflows, public services, and sector operations. Build a Namibia-based platform that develops local AI capability and converts it into deployable tools for institutions across the country.'
  }, {
    id: 's02-l1',
    type: 'text-label',
    label: 'Label',
    x: 67,
    y: 36,
    selected: false,
    editingText: false,
    textContent: 'Capability'
  }, {
    id: 's02-i1',
    type: 'icon-okaanda',
    label: 'Okaanda Icon',
    x: 82,
    y: 36,
    selected: false,
    editingText: false
  }, {
    id: 's02-l2',
    type: 'text-label',
    label: 'Label',
    x: 67,
    y: 56,
    selected: false,
    editingText: false,
    textContent: 'Tools'
  }, {
    id: 's02-i2',
    type: 'icon-etiti',
    label: 'Etiti Icon',
    x: 82,
    y: 56,
    selected: false,
    editingText: false
  }, {
    id: 's02-l3',
    type: 'text-label',
    label: 'Label',
    x: 67,
    y: 76,
    selected: false,
    editingText: false,
    textContent: 'Institutional Use'
  }, {
    id: 's02-i3',
    type: 'icon-oshitoo',
    label: 'Oshitoo Icon',
    x: 82,
    y: 76,
    selected: false,
    editingText: false
  }],
  'slide-03': [{
    id: 's03-h',
    type: 'text-headline',
    label: 'Headline',
    x: 50,
    y: 16,
    selected: false,
    editingText: false,
    textContent: 'Why this matters now'
  }, {
    id: 's03-c',
    type: 'chart-market',
    label: 'Market Growth Chart',
    x: 28,
    y: 56,
    selected: false,
    editingText: false,
    chartTitle: 'Global AI Market ($B)'
  }, {
    id: 's03-s1',
    type: 'stat-custom',
    label: 'Custom Stat',
    x: 73,
    y: 38,
    selected: false,
    editingText: false,
    statValue: '$189B',
    statLabel: 'Global AI Market 2023',
    statHex: COLOR.ochreOrange
  }, {
    id: 's03-s2',
    type: 'stat-custom',
    label: 'Custom Stat',
    x: 73,
    y: 60,
    selected: false,
    editingText: false,
    statValue: '$4.8T',
    statLabel: 'Projected by 2033',
    statHex: COLOR.firedRed
  }, {
    id: 's03-q',
    type: 'text-quote',
    label: 'Pull Quote',
    x: 73,
    y: 82,
    selected: false,
    editingText: false,
    textContent: 'Gen AI: $61B–$103B annually across Africa — McKinsey'
  }],
  'slide-04': [{
    id: 's04-h',
    type: 'text-headline',
    label: 'Headline',
    x: 50,
    y: 16,
    selected: false,
    editingText: false,
    textContent: "Namibia already has the early institutional pieces"
  }, {
    id: 's04-c0',
    type: 'sys-card-0',
    label: 'Okaanda Card',
    x: 19,
    y: 52,
    selected: false,
    editingText: false,
    systemIdx: 0,
    customName: 'UNESCO / NCRST',
    customRole: 'AI Readiness Assessment completed'
  }, {
    id: 's04-c1',
    type: 'sys-card-1',
    label: 'Oshini Card',
    x: 50,
    y: 52,
    selected: false,
    editingText: false,
    systemIdx: 1,
    customName: 'NUST AIRA',
    customRole: 'AI & Robotics Accelerator — Nov 2024'
  }, {
    id: 's04-c2',
    type: 'sys-card-2',
    label: 'Ombiga Card',
    x: 81,
    y: 52,
    selected: false,
    editingText: false,
    systemIdx: 2,
    customName: 'UNAM NGHRI',
    customRole: 'University–Industry–Gov Institute model'
  }, {
    id: 's04-b',
    type: 'text-body',
    label: 'Body Text',
    x: 50,
    y: 80,
    selected: false,
    editingText: false,
    textContent: 'Policy momentum · Institutional capacity · Credible foundation for an applied AI platform'
  }],
  'slide-05': [{
    id: 's05-h',
    type: 'text-headline',
    label: 'Headline',
    x: 50,
    y: 14,
    selected: false,
    editingText: false,
    textContent: 'The readiness gaps are already identified'
  }, {
    id: 's05-l1',
    type: 'text-label',
    label: 'Label',
    x: 22,
    y: 32,
    selected: false,
    editingText: false,
    textContent: '01 — No AI Regulatory Framework'
  }, {
    id: 's05-l2',
    type: 'text-label',
    label: 'Label',
    x: 58,
    y: 32,
    selected: false,
    editingText: false,
    textContent: '02 — Data Protection Bill Pending'
  }, {
    id: 's05-l3',
    type: 'text-label',
    label: 'Label',
    x: 22,
    y: 50,
    selected: false,
    editingText: false,
    textContent: '03 — AI Skills Gaps'
  }, {
    id: 's05-l4',
    type: 'text-label',
    label: 'Label',
    x: 58,
    y: 50,
    selected: false,
    editingText: false,
    textContent: '04 — Rural Infrastructure Limits'
  }, {
    id: 's05-l5',
    type: 'text-label',
    label: 'Label',
    x: 45,
    y: 66,
    selected: false,
    editingText: false,
    textContent: '05 — Indigenous-Language Data Shortage'
  }, {
    id: 's05-r',
    type: 'chart-radar',
    label: 'Readiness Radar',
    x: 86,
    y: 45,
    selected: false,
    editingText: false,
    radarData: JSON.stringify([{
      subject: 'Regulation',
      value: 25
    }, {
      subject: 'Data protection',
      value: 35
    }, {
      subject: 'Skills',
      value: 40
    }, {
      subject: 'Infrastructure',
      value: 45
    }, {
      subject: 'Language data',
      value: 20
    }])
  }, {
    id: 's05-d',
    type: 'divider-dither',
    label: 'Dither Divider',
    x: 50,
    y: 77,
    selected: false,
    editingText: false
  }, {
    id: 's05-q',
    type: 'text-quote',
    label: 'Pull Quote',
    x: 50,
    y: 88,
    selected: false,
    editingText: false,
    textContent: 'These are readiness gaps. They are also design requirements.'
  }],
  'slide-06': [{
    id: 's06-h',
    type: 'text-headline',
    label: 'Headline',
    x: 50,
    y: 15,
    selected: false,
    editingText: false,
    textContent: 'The economic and business case'
  }, {
    id: 's06-c',
    type: 'chart-market',
    label: 'Market Growth Chart',
    x: 28,
    y: 53,
    selected: false,
    editingText: false,
    chartTitle: 'Namibia Digital Services Imports ($M)',
    marketData: JSON.stringify([{
      year: '2020',
      value: 34.4
    }, {
      year: '2021',
      value: 52
    }, {
      year: '2022',
      value: 74
    }, {
      year: '2023',
      value: 93
    }, {
      year: '2024',
      value: 111.2
    }])
  }, {
    id: 's06-s1',
    type: 'stat-custom',
    label: 'Custom Stat',
    x: 74,
    y: 37,
    selected: false,
    editingText: false,
    statValue: '36.9%',
    statLabel: 'Unemployment 2023',
    statHex: COLOR.mopaneBrown
  }, {
    id: 's06-s2',
    type: 'stat-custom',
    label: 'Custom Stat',
    x: 74,
    y: 59,
    selected: false,
    editingText: false,
    statValue: '111.2M',
    statLabel: 'Digital imports 2024',
    statHex: COLOR.firedRed
  }, {
    id: 's06-q',
    type: 'text-quote',
    label: 'Pull Quote',
    x: 50,
    y: 82,
    selected: false,
    editingText: false,
    textContent: 'As AI embeds into software and cloud, a growing share of this spend moves through AI-linked channels.'
  }],
  'slide-07': [{
    id: 's07-h',
    type: 'text-headline',
    label: 'Headline',
    x: 50,
    y: 14,
    selected: false,
    editingText: false,
    textContent: 'The labour-market case'
  }, {
    id: 's07-s1',
    type: 'stat-custom',
    label: 'Custom Stat',
    x: 19,
    y: 42,
    selected: false,
    editingText: false,
    statValue: '36.9%',
    statLabel: 'Unemployment 2023',
    statHex: COLOR.firedRed
  }, {
    id: 's07-s2',
    type: 'stat-custom',
    label: 'Custom Stat',
    x: 19,
    y: 66,
    selected: false,
    editingText: false,
    statValue: '54.8%',
    statLabel: 'Combined labour-force rate',
    statHex: COLOR.barkRust
  }, {
    id: 's07-t1',
    type: 'timeline-0',
    label: 'Phase 0',
    x: 68,
    y: 38,
    selected: false,
    editingText: false,
    timelineIdx: 0,
    customPhaseName: 'NDP6 Baseline',
    customPeriod: 'Now',
    customProgress: 66
  }, {
    id: 's07-t2',
    type: 'timeline-1',
    label: 'Phase 1',
    x: 68,
    y: 66,
    selected: false,
    editingText: false,
    timelineIdx: 1,
    customPhaseName: 'NDP6 Target 2030',
    customPeriod: 'By 2030',
    customProgress: 74
  }, {
    id: 's07-b',
    type: 'text-body',
    label: 'Body Text',
    x: 50,
    y: 87,
    selected: false,
    editingText: false,
    textContent: 'Platform builds onboarding tools, workflow copilots, and knowledge systems that help institutions absorb graduates faster.'
  }],
  'slide-08': [{
    id: 's08-l',
    type: 'text-label',
    label: 'Label',
    x: 50,
    y: 26,
    selected: false,
    editingText: false,
    textContent: 'The concept in one sentence'
  }, {
    id: 's08-q',
    type: 'text-quote',
    label: 'Pull Quote',
    x: 50,
    y: 50,
    selected: false,
    editingText: false,
    textContent: 'A Namibia-based AI platform that builds local model capability and converts it into usable tools for government, NGOs, firms, utilities, schools, hospitals, and other institutions.'
  }, {
    id: 's08-d',
    type: 'divider-dither',
    label: 'Dither Divider',
    x: 50,
    y: 72,
    selected: false,
    editingText: false
  }, {
    id: 's08-i1',
    type: 'icon-okaanda',
    label: 'Okaanda Icon',
    x: 38,
    y: 85,
    selected: false,
    editingText: false
  }, {
    id: 's08-i2',
    type: 'icon-oshitoo',
    label: 'Oshitoo Icon',
    x: 62,
    y: 85,
    selected: false,
    editingText: false
  }],
  'slide-09': [{
    id: 's09-h',
    type: 'text-headline',
    label: 'Headline',
    x: 50,
    y: 14,
    selected: false,
    editingText: false,
    textContent: 'The two-track operating model'
  }, {
    id: 's09-l1',
    type: 'text-label',
    label: 'Label',
    x: 23,
    y: 28,
    selected: false,
    editingText: false,
    textContent: 'Track 1 — Capability'
  }, {
    id: 's09-i1',
    type: 'icon-okaanda',
    label: 'Okaanda Icon',
    x: 23,
    y: 43,
    selected: false,
    editingText: false
  }, {
    id: 's09-b1',
    type: 'text-body',
    label: 'Body Text',
    x: 23,
    y: 65,
    selected: false,
    editingText: false,
    textContent: 'Model selection · Fine-tuning · Steering · Evaluation · Distillation · Compression · Local datasets · Deployment recipes'
  }, {
    id: 's09-l2',
    type: 'text-label',
    label: 'Label',
    x: 73,
    y: 28,
    selected: false,
    editingText: false,
    textContent: 'Track 2 — Tooling & Deployment'
  }, {
    id: 's09-i2',
    type: 'icon-oshitoo',
    label: 'Oshitoo Icon',
    x: 73,
    y: 43,
    selected: false,
    editingText: false
  }, {
    id: 's09-b2',
    type: 'text-body',
    label: 'Body Text',
    x: 73,
    y: 65,
    selected: false,
    editingText: false,
    textContent: 'Document intelligence · Internal assistants · Workflow tools · Planning systems · Training tools · Sector applications'
  }, {
    id: 's09-d',
    type: 'divider-dither',
    label: 'Dither Divider',
    x: 50,
    y: 86,
    selected: false,
    editingText: false
  }],
  'slide-10': [{
    id: 's10-h',
    type: 'text-headline',
    label: 'Headline',
    x: 50,
    y: 13,
    selected: false,
    editingText: false,
    textContent: 'Internal system architecture'
  }, {
    id: 's10-s0',
    type: 'sys-card-0',
    label: 'Okaanda Card',
    x: 12,
    y: 48,
    w: 18,
    h: 16,
    selected: false,
    editingText: false,
    systemIdx: 0
  }, {
    id: 's10-s1',
    type: 'sys-card-1',
    label: 'Oshini Card',
    x: 31,
    y: 48,
    w: 18,
    h: 16,
    selected: false,
    editingText: false,
    systemIdx: 1
  }, {
    id: 's10-s2',
    type: 'sys-card-2',
    label: 'Ombiga Card',
    x: 50,
    y: 48,
    w: 18,
    h: 16,
    selected: false,
    editingText: false,
    systemIdx: 2
  }, {
    id: 's10-s3',
    type: 'sys-card-3',
    label: 'Etiti Card',
    x: 69,
    y: 48,
    w: 18,
    h: 16,
    selected: false,
    editingText: false,
    systemIdx: 3
  }, {
    id: 's10-s4',
    type: 'sys-card-4',
    label: 'Oshitoo Card',
    x: 88,
    y: 48,
    w: 18,
    h: 16,
    selected: false,
    editingText: false,
    systemIdx: 4
  }, {
    id: 's10-l',
    type: 'text-label',
    label: 'Label',
    x: 50,
    y: 76,
    selected: false,
    editingText: false,
    textContent: 'Granary → Mill → Vessel → Surface → Delivery'
  }],
  'slide-11': [{
    id: 's11-h',
    type: 'text-headline',
    label: 'Headline',
    x: 50,
    y: 12,
    selected: false,
    editingText: false,
    textContent: 'What the tools can address'
  }, {
    id: 's11-l1',
    type: 'text-label',
    label: 'Label',
    x: 18,
    y: 28,
    selected: false,
    editingText: false,
    textContent: 'Skills & Employability Gap'
  }, {
    id: 's11-d1',
    type: 'text-body',
    label: 'Body',
    x: 62,
    y: 28,
    selected: false,
    editingText: false,
    textContent: 'Learning assistants · Workflow guides · Practice environments'
  }, {
    id: 's11-l2',
    type: 'text-label',
    label: 'Label',
    x: 18,
    y: 46,
    selected: false,
    editingText: false,
    textContent: 'Public-Sector Implementation Gap'
  }, {
    id: 's11-d2',
    type: 'text-body',
    label: 'Body',
    x: 62,
    y: 46,
    selected: false,
    editingText: false,
    textContent: 'Document intelligence · Retrieval systems · Drafting assistants'
  }, {
    id: 's11-l3',
    type: 'text-label',
    label: 'Label',
    x: 18,
    y: 63,
    selected: false,
    editingText: false,
    textContent: 'Language & Context Gap'
  }, {
    id: 's11-d3',
    type: 'text-body',
    label: 'Body',
    x: 62,
    y: 63,
    selected: false,
    editingText: false,
    textContent: 'Tuned datasets · Evaluation sets · Local-language systems'
  }, {
    id: 's11-l4',
    type: 'text-label',
    label: 'Label',
    x: 18,
    y: 80,
    selected: false,
    editingText: false,
    textContent: 'Sector Productivity Gaps'
  }, {
    id: 's11-d4',
    type: 'text-body',
    label: 'Body',
    x: 62,
    y: 80,
    selected: false,
    editingText: false,
    textContent: 'Utilities · Schools · Hospitals · NGOs · Enterprise tools'
  }, {
    id: 's11-i1',
    type: 'icon-etiti',
    label: 'Etiti Icon',
    x: 6,
    y: 28,
    selected: false,
    editingText: false
  }, {
    id: 's11-i2',
    type: 'icon-okaanda',
    label: 'Okaanda Icon',
    x: 6,
    y: 46,
    selected: false,
    editingText: false
  }, {
    id: 's11-i3',
    type: 'icon-oshini',
    label: 'Oshini Icon',
    x: 6,
    y: 63,
    selected: false,
    editingText: false
  }, {
    id: 's11-i4',
    type: 'icon-oshitoo',
    label: 'Oshitoo Icon',
    x: 6,
    y: 80,
    selected: false,
    editingText: false
  }],
  'slide-12': [{
    id: 's12-h',
    type: 'text-headline',
    label: 'Headline',
    x: 50,
    y: 11,
    selected: false,
    editingText: false,
    textContent: 'Sequencing reference: Mistral'
  }, {
    id: 's12-lbl1',
    type: 'text-label',
    label: 'Label',
    x: 10,
    y: 27,
    selected: false,
    editingText: false,
    textContent: 'Mistral'
  }, {
    id: 's12-p0',
    type: 'timeline-0',
    label: 'Phase 0',
    x: 28,
    y: 40,
    selected: false,
    editingText: false,
    timelineIdx: 0,
    customPhaseName: 'Apr 2023: Founded',
    customPeriod: 'Capability first',
    customProgress: 100
  }, {
    id: 's12-p1',
    type: 'timeline-1',
    label: 'Phase 1',
    x: 48,
    y: 40,
    selected: false,
    editingText: false,
    timelineIdx: 1,
    customPhaseName: 'Sep 2023: Mistral 7B',
    customPeriod: 'Proof points',
    customProgress: 100
  }, {
    id: 's12-p2',
    type: 'timeline-2',
    label: 'Phase 2',
    x: 68,
    y: 40,
    selected: false,
    editingText: false,
    timelineIdx: 2,
    customPhaseName: 'Dec 2023: La Plateforme',
    customPeriod: 'Platformization',
    customProgress: 100
  }, {
    id: 's12-p3',
    type: 'timeline-3',
    label: 'Phase 3',
    x: 88,
    y: 40,
    selected: false,
    editingText: false,
    timelineIdx: 3,
    customPhaseName: '2024–25: Enterprise',
    customPeriod: 'Scaled deployment',
    customProgress: 80
  }, {
    id: 's12-lbl2',
    type: 'text-label',
    label: 'Label',
    x: 10,
    y: 60,
    selected: false,
    editingText: false,
    textContent: 'Namibia'
  }, {
    id: 's12-n0',
    type: 'timeline-0',
    label: 'Phase 0',
    x: 28,
    y: 74,
    selected: false,
    editingText: false,
    timelineIdx: 0,
    customPhaseName: 'Phase 0: Founding',
    customPeriod: 'Team & Partners',
    customProgress: 100
  }, {
    id: 's12-n1',
    type: 'timeline-1',
    label: 'Phase 1',
    x: 48,
    y: 74,
    selected: false,
    editingText: false,
    timelineIdx: 1,
    customPhaseName: 'Phase 1: Capability',
    customPeriod: 'Registry & eval',
    customProgress: 60
  }, {
    id: 's12-n2',
    type: 'timeline-2',
    label: 'Phase 2',
    x: 68,
    y: 74,
    selected: false,
    editingText: false,
    timelineIdx: 2,
    customPhaseName: 'Phase 2: Proof Points',
    customPeriod: 'Benchmarks',
    customProgress: 30
  }, {
    id: 's12-n3',
    type: 'timeline-3',
    label: 'Phase 3',
    x: 88,
    y: 74,
    selected: false,
    editingText: false,
    timelineIdx: 3,
    customPhaseName: 'Phase 3–5: Scale',
    customPeriod: 'Deploy & grow',
    customProgress: 0
  }],
  'slide-13': [{
    id: 's13-h',
    type: 'text-headline',
    label: 'Headline',
    x: 50,
    y: 11,
    selected: false,
    editingText: false,
    textContent: 'How the institution is structured'
  }, {
    id: 's13-n1',
    type: 'flow-node-1',
    label: 'Flow: Granary',
    x: 16,
    y: 48,
    selected: false,
    editingText: false,
    flowNodeIdx: 1,
    customNodeName: 'Research & Capability',
    customNodeRole: 'University-linked core'
  }, {
    id: 's13-n2',
    type: 'flow-node-2',
    label: 'Flow: Mill',
    x: 38,
    y: 48,
    selected: false,
    editingText: false,
    flowNodeIdx: 2,
    customNodeName: 'Public-Interest Governance',
    customNodeRole: 'National relevance layer'
  }, {
    id: 's13-n3',
    type: 'flow-node-3',
    label: 'Flow: Vessel',
    x: 62,
    y: 48,
    selected: false,
    editingText: false,
    flowNodeIdx: 3,
    customNodeName: 'Applied Delivery',
    customNodeRole: 'Institutional deployments'
  }, {
    id: 's13-n4',
    type: 'flow-node-4',
    label: 'Flow: Surface',
    x: 84,
    y: 48,
    selected: false,
    editingText: false,
    flowNodeIdx: 4,
    customNodeName: 'Commercialization',
    customNodeRole: 'Contracts & spinouts'
  }, {
    id: 's13-b',
    type: 'text-body',
    label: 'Body',
    x: 50,
    y: 76,
    selected: false,
    editingText: false,
    textContent: 'Partner base: university · government · NGOs · firms · international academic partners'
  }, {
    id: 's13-d',
    type: 'divider-dither',
    label: 'Dither Divider',
    x: 50,
    y: 88,
    selected: false,
    editingText: false
  }],
  'slide-14': [{
    id: 's14-h',
    type: 'text-headline',
    label: 'Headline',
    x: 50,
    y: 11,
    selected: false,
    editingText: false,
    textContent: 'Delivery sequence — first 24 months'
  }, {
    id: 's14-t0',
    type: 'timeline-0',
    label: 'Phase 0',
    x: 11,
    y: 40,
    w: 18,
    h: 20,
    selected: false,
    editingText: false,
    timelineIdx: 0,
    customPhaseName: 'Months 0–3',
    customPeriod: 'Q1',
    customProgress: 100
  }, {
    id: 's14-t1',
    type: 'timeline-1',
    label: 'Phase 1',
    x: 30,
    y: 40,
    w: 18,
    h: 20,
    selected: false,
    editingText: false,
    timelineIdx: 1,
    customPhaseName: 'Months 3–9',
    customPeriod: 'Q2–Q3',
    customProgress: 75
  }, {
    id: 's14-t2',
    type: 'timeline-2',
    label: 'Phase 2',
    x: 50,
    y: 40,
    w: 18,
    h: 20,
    selected: false,
    editingText: false,
    timelineIdx: 2,
    customPhaseName: 'Months 9–12',
    customPeriod: 'Q4',
    customProgress: 40
  }, {
    id: 's14-t3',
    type: 'timeline-3',
    label: 'Phase 3',
    x: 70,
    y: 40,
    w: 18,
    h: 20,
    selected: false,
    editingText: false,
    timelineIdx: 3,
    customPhaseName: 'Year 2',
    customPeriod: 'Q5–Q8',
    customProgress: 15
  }, {
    id: 's14-t4',
    type: 'timeline-4',
    label: 'Phase 4',
    x: 89,
    y: 40,
    w: 18,
    h: 20,
    selected: false,
    editingText: false,
    timelineIdx: 4,
    customPhaseName: 'End Year 2',
    customPeriod: 'Q8',
    customProgress: 0
  }, {
    id: 's14-b0',
    type: 'text-body',
    label: 'Body',
    x: 11,
    y: 72,
    w: 16,
    h: 11,
    selected: false,
    editingText: false,
    textContent: 'Founding team · doctrine · partners'
  }, {
    id: 's14-b1',
    type: 'text-body',
    label: 'Body',
    x: 30,
    y: 72,
    w: 16,
    h: 11,
    selected: false,
    editingText: false,
    textContent: 'Stack build · registry · eval'
  }, {
    id: 's14-b2',
    type: 'text-body',
    label: 'Body',
    x: 50,
    y: 72,
    w: 16,
    h: 11,
    selected: false,
    editingText: false,
    textContent: 'Tuned models · benchmarks'
  }, {
    id: 's14-b3',
    type: 'text-body',
    label: 'Body',
    x: 70,
    y: 72,
    w: 16,
    h: 11,
    selected: false,
    editingText: false,
    textContent: 'Tools · pilots · deployments'
  }, {
    id: 's14-b4',
    type: 'text-body',
    label: 'Body',
    x: 89,
    y: 72,
    w: 16,
    h: 11,
    selected: false,
    editingText: false,
    textContent: 'Repeatable modules'
  }],
  'slide-15': [{
    id: 's15-l',
    type: 'text-label',
    label: 'Label',
    x: 50,
    y: 20,
    selected: false,
    editingText: false,
    textContent: 'Core proposition'
  }, {
    id: 's15-q',
    type: 'text-quote',
    label: 'Pull Quote',
    x: 50,
    y: 40,
    selected: false,
    editingText: false,
    textContent: 'A local capability layer turns AI demand into local systems, local expertise, and local value.'
  }, {
    id: 's15-b',
    type: 'text-body',
    label: 'Body Text',
    x: 50,
    y: 58,
    selected: false,
    editingText: false,
    textContent: 'Namibia already has the early institutional pieces. The next step is a platform that turns readiness into capability, capability into tools, and tools into institutional use.'
  }, {
    id: 's15-d',
    type: 'divider-dither',
    label: 'Dither Divider',
    x: 50,
    y: 72,
    selected: false,
    editingText: false
  }, {
    id: 's15-i1',
    type: 'icon-okaanda',
    label: 'Okaanda Icon',
    x: 30,
    y: 84,
    selected: false,
    editingText: false
  }, {
    id: 's15-i2',
    type: 'icon-oshini',
    label: 'Oshini Icon',
    x: 41,
    y: 84,
    selected: false,
    editingText: false
  }, {
    id: 's15-i3',
    type: 'icon-ombiga',
    label: 'Ombiga Icon',
    x: 50,
    y: 84,
    selected: false,
    editingText: false
  }, {
    id: 's15-i4',
    type: 'icon-etiti',
    label: 'Etiti Icon',
    x: 59,
    y: 84,
    selected: false,
    editingText: false
  }, {
    id: 's15-i5',
    type: 'icon-oshitoo',
    label: 'Oshitoo Icon',
    x: 70,
    y: 84,
    selected: false,
    editingText: false
  }]
};

// ─── Inline canvas text editor ────────────────────────────────────────────────
const CanvasTextEdit = ({
  value,
  onChange,
  onCommit,
  isHeadline
}: {
  value: string;
  onChange: (v: string) => void;
  onCommit: () => void;
  isHeadline: boolean;
}) => {
  const ref = useRef<HTMLTextAreaElement>(null);
  useEffect(() => {
    ref.current?.focus();
    const len = ref.current?.value.length ?? 0;
    ref.current?.setSelectionRange(len, len);
  }, []);
  return <textarea ref={ref} value={value} onChange={e => onChange(e.target.value)} onBlur={onCommit} onKeyDown={e => {
    if (e.key === 'Escape') onCommit();
    if (e.key === 'Enter' && e.metaKey) onCommit();
  }} style={{
    width: '100%',
    minWidth: isHeadline ? 200 : 240,
    minHeight: isHeadline ? 40 : 64,
    resize: 'both',
    overflow: 'auto',
    background: 'transparent',
    border: `1px solid ${COLOR.ochreOrange}80`,
    outline: 'none',
    padding: 4,
    fontFamily: isHeadline ? 'inherit' : 'Georgia, serif',
    fontSize: isHeadline ? 22 : 12,
    fontWeight: isHeadline ? 700 : 400,
    color: isHeadline ? 'inherit' : 'rgba(30,26,23,0.80)',
    lineHeight: isHeadline ? 1.2 : 1.8,
    whiteSpace: 'pre-wrap'
  }} />;
};

const renderSlideTextWithCitations = (text: string) => text.split(/(\[\d+\])/g).map((part, i) => {
  if (!/^\[\d+\]$/.test(part)) return part;
  return <sup key={`slide-cite-${i}`} style={{
    color: COLOR.barkRust,
    fontSize: '0.72em',
    fontWeight: 800,
    marginLeft: 2
  }}>{part}</sup>;
});

// ─── Dropped block renderer ───────────────────────────────────────────────────
function renderDroppedBlock(block: DroppedBlock, isDark: boolean, onUpdateBlock: (id: string, updates: Partial<DroppedBlock>) => void) {
  const fg = isDark ? COLOR.milletClay : COLOR.charBlack;
  const muted = isDark ? 'rgba(232,225,207,0.55)' : 'rgba(30,26,23,0.66)';
  const isAiSlideBlock = block.id.startsWith('ai-slide-');
  const colorMap: Record<string, string> = {
    comment: '#6A4B2E',
    keyword: '#D9791F',
    string: '#DFAE2B',
    plain: '#E8E1CF60',
    accent: '#C84A1B'
  };
  const iconMap: Record<string, {
    Icon: React.FC<{
      size: number;
    }>;
    color: string;
    name: string;
  }> = {
    'icon-okaanda': {
      Icon: IconOkaanda,
      color: COLOR.barkRust,
      name: 'OKAANDA'
    },
    'icon-oshini': {
      Icon: IconOshini,
      color: COLOR.barkRust,
      name: 'OSHINI'
    },
    'icon-ombiga': {
      Icon: IconOmbiga,
      color: COLOR.mahanguGold,
      name: 'OMBIGA'
    },
    'icon-etiti': {
      Icon: IconEtiti,
      color: COLOR.mopaneBrown,
      name: 'ETITI'
    },
    'icon-oshitoo': {
      Icon: IconOshitoo,
      color: COLOR.dyePlum,
      name: 'OSHITOO'
    }
  };
  if (iconMap[block.type]) {
    const {
      Icon,
      color,
      name
    } = iconMap[block.type];
    return <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 6
    }}>
      <Icon size={48} />
      <span style={{
        fontSize: 10,
        color,
        fontWeight: 700,
        letterSpacing: '0.10em'
      }}>{name}</span>
    </div>;
  }
  const statDefs: Record<string, {
    v: string;
    l: string;
    h: string;
    s?: string;
  }> = {
    'stat-systems': {
      v: '5',
      l: 'Active Systems',
      h: COLOR.ochreOrange
    },
    'stat-models': {
      v: '3',
      l: 'Language Models',
      h: COLOR.barkRust
    },
    'stat-pilots': {
      v: '12',
      l: 'Sector Pilots',
      h: COLOR.mahanguGold
    },
    'stat-lab': {
      v: '1',
      l: 'Sovereign Lab',
      h: COLOR.mopaneBrown
    }
  };
  if (statDefs[block.type]) {
    const d = statDefs[block.type];
    const v = block.statValue ?? d.v;
    const l = block.statLabel ?? d.l;
    const h = block.statHex ?? d.h;
    const s = block.statSub ?? d.s;
    return <div style={{
      padding: '14px 18px',
      background: `${h}12`,
      border: `1px solid ${h}40`,
      borderTop: `3px solid ${h}`,
      display: 'flex',
      flexDirection: 'column',
      gap: 4,
      minWidth: 110
    }}>
      <span style={{
        fontSize: 30,
        fontWeight: 700,
        color: h,
        lineHeight: 1
      }}>{v}</span>
      <span style={{
        fontSize: 11,
        fontWeight: 600,
        color: fg
      }}>{l}</span>
      <span style={{
        fontSize: 9,
        color: muted
      }}>{s}</span>
    </div>;
  }
  if (block.type === 'stat-custom') {
    const h = block.statHex ?? COLOR.dyePlum;
    return <div style={{
      padding: '14px 18px',
      background: `${h}12`,
      border: `1px solid ${h}40`,
      borderTop: `3px solid ${h}`,
      display: 'flex',
      flexDirection: 'column',
      gap: 4,
      minWidth: 110
    }}>
      <span style={{
        fontSize: 30,
        fontWeight: 700,
        color: h,
        lineHeight: 1
      }}>{block.statValue ?? '0'}</span>
      <span style={{
        fontSize: 11,
        fontWeight: 600,
        color: fg
      }}>{block.statLabel ?? 'Custom Metric'}</span>
    </div>;
  }
  if (block.type === 'chart-market') {
    const chartData = block.marketData ? JSON.parse(block.marketData) as Array<{
      year: string;
      value: number;
    }> : SLIDE_MARKET_DATA;
    const chartTitle = block.chartTitle ?? 'AI Market Growth';
    return <div style={{
      width: 240,
      height: 130,
      background: isDark ? COLOR.darkCard : EDITOR_SURFACE.paperWarm,
      padding: '10px 12px',
      border: `1px solid ${COLOR.ochreOrange}30`
    }}>
      <div style={{
        fontSize: 9,
        fontWeight: 700,
        letterSpacing: '0.12em',
        textTransform: 'uppercase' as const,
        color: COLOR.barkRust,
        marginBottom: 6
      }}>{chartTitle}</div>
      <ResponsiveContainer width="100%" height={90}>
        <AreaChart data={chartData} margin={{
          top: 2,
          right: 4,
          left: 0,
          bottom: 0
        }}>
          <defs>
            <linearGradient id={`slide-grad-${block.id}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={COLOR.ochreOrange} stopOpacity={0.3} />
              <stop offset="95%" stopColor={COLOR.ochreOrange} stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <XAxis dataKey="year" tick={{
            fontSize: 9,
            fill: muted
          }} axisLine={false} tickLine={false} />
          <YAxis hide />
          <Tooltip contentStyle={{
            background: '#1E1A17',
            border: `1px solid ${COLOR.ochreOrange}40`,
            borderRadius: 0,
            fontSize: 9
          }} labelStyle={{
            color: COLOR.barkRust
          }} formatter={(v: number) => [`$${v}B`]} />
          <Area type="monotone" dataKey="value" stroke={COLOR.ochreOrange} strokeWidth={2} fill={`url(#slide-grad-${block.id})`} dot={{
            fill: COLOR.ochreOrange,
            r: 2,
            strokeWidth: 0
          }} />
        </AreaChart>
      </ResponsiveContainer>
    </div>;
  }
  if (block.type === 'chart-progress') {
    return <div style={{
      width: isAiSlideBlock ? '100%' : 220,
      height: isAiSlideBlock ? '100%' : 130,
      background: isDark ? COLOR.darkCard : EDITOR_SURFACE.paperWarm,
      padding: isAiSlideBlock ? '18px 22px' : '10px 12px',
      border: `1px solid ${COLOR.barkRust}30`,
      boxSizing: 'border-box' as const
    }}>
      <div style={{
        fontSize: isAiSlideBlock ? 11 : 8,
        fontWeight: 700,
        letterSpacing: '0.12em',
        textTransform: 'uppercase' as const,
        color: COLOR.barkRust,
        marginBottom: isAiSlideBlock ? 12 : 6
      }}>{block.chartTitle ?? 'System Progress'}</div>
      <ResponsiveContainer width="100%" height={isAiSlideBlock ? '82%' : 90}>
        <BarChart data={SLIDE_BAR_DATA} margin={{
          top: 2,
          right: isAiSlideBlock ? 10 : 4,
          left: 0,
          bottom: 0
        }}>
          <XAxis dataKey="name" tick={{
            fontSize: isAiSlideBlock ? 10 : 7,
            fill: muted
          }} axisLine={false} tickLine={false} />
          <YAxis hide domain={[0, 100]} />
          <Tooltip contentStyle={{
            background: '#1E1A17',
            border: `1px solid ${COLOR.barkRust}40`,
            borderRadius: 0,
            fontSize: 9
          }} labelStyle={{
            color: COLOR.barkRust
          }} formatter={(v: number) => [`${v}%`]} />
          <Bar dataKey="progress" fill={COLOR.barkRust} opacity={0.85} />
        </BarChart>
      </ResponsiveContainer>
    </div>;
  }
  if (block.type === 'chart-heatmap') {
    const heatCells = block.heatmapData ? JSON.parse(block.heatmapData) as Array<{
      row: number;
      col: number;
      intensity: number;
    }> : HEATMAP_CELLS;
    const getHeatColor = (intensity: number) => {
      if (intensity > 0.85) return COLOR.firedRed;
      if (intensity > 0.65) return COLOR.ochreOrange;
      if (intensity > 0.45) return COLOR.mahanguGold;
      if (intensity > 0.25) return COLOR.barkRust;
      if (intensity > 0.1) return COLOR.mopaneBrown;
      return COLOR.charBlack;
    };
    return <div style={{
      background: '#1E1A17',
      padding: '10px 12px',
      minWidth: 220
    }}>
      <div style={{
        fontSize: 9,
        fontWeight: 700,
        letterSpacing: '0.12em',
        textTransform: 'uppercase' as const,
        color: COLOR.firedRed,
        marginBottom: 6
      }}>Research Heatmap</div>
      {HEATMAP_LABELS_Y.slice(0, 4).map((yLabel, rowIdx) => <div key={`hmr-${rowIdx}`} style={{
        display: 'flex',
        alignItems: 'center',
        gap: 3,
        marginBottom: 2
      }}>
        <span style={{
          fontSize: 9,
          color: 'rgba(232,225,207,0.55)',
          width: 42,
          flexShrink: 0,
          textAlign: 'right',
          paddingRight: 4
        }}>{yLabel}</span>
        {heatCells.filter(c => c.row === rowIdx).map(cell => <div key={`hmc-${cell.row}-${cell.col}`} style={{
          flex: 1,
          height: 12,
          background: getHeatColor(cell.intensity)
        }} />)}
      </div>)}
    </div>;
  }
  if (block.type === 'chart-radar') {
    const radarChartData = block.radarData ? JSON.parse(block.radarData) as Array<{
      subject: string;
      value: number;
    }> : SLIDE_RADAR_DATA;
    return <div style={{
      width: 200,
      height: 140,
      background: isDark ? COLOR.darkCard : EDITOR_SURFACE.paperWarm,
      padding: '8px',
      border: `1px solid ${COLOR.dyePlum}30`
    }}>
      <div style={{
        fontSize: 9,
        fontWeight: 700,
        letterSpacing: '0.12em',
        textTransform: 'uppercase' as const,
        color: COLOR.dyePlum,
        marginBottom: 2
      }}>Capability Radar</div>
      <ResponsiveContainer width="100%" height={110}>
        <RadarChart data={radarChartData}>
          <PolarGrid stroke={`${COLOR.dyePlum}30`} />
          <PolarAngleAxis dataKey="subject" tick={{
            fontSize: 9,
            fill: muted
          }} />
          <Radar dataKey="value" stroke={COLOR.dyePlum} fill={COLOR.dyePlum} fillOpacity={0.25} strokeWidth={1.5} />
        </RadarChart>
      </ResponsiveContainer>
    </div>;
  }
  if (block.type === 'chart-timeline') {
    const phaseIdx = block.timelineIdx ?? 0;
    const phase = TIMELINE_PHASES[phaseIdx % TIMELINE_PHASES.length];
    return <div style={{
      width: 200,
      padding: '10px 14px',
      background: `${phase.hex}10`,
      border: `1px solid ${phase.hex}40`
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 6
      }}>
        <PixelTag hex={phase.hex} label={phase.tag} />
        <span style={{
          fontSize: 10,
          color: phase.hex,
          fontWeight: 700
        }}>{phase.progress}%</span>
      </div>
      <div style={{
        fontSize: 11,
        fontWeight: 600,
        color: fg,
        marginBottom: 6
      }}>{phase.english}</div>
      <div style={{
        width: '100%',
        height: 4,
        background: isDark ? 'rgba(232,225,207,0.08)' : 'rgba(30,26,23,0.08)'
      }}>
        <div style={{
          height: '100%',
          width: `${phase.progress}%`,
          background: phase.hex
        }} />
      </div>
    </div>;
  }
  if (block.type === 'text-headline') {
    if (block.editingText) {
      return <CanvasTextEdit value={block.textContent ?? 'Namibia AI Platform'} onChange={v => onUpdateBlock(block.id, {
        textContent: v
      })} onCommit={() => onUpdateBlock(block.id, {
        editingText: false
      })} isHeadline={true} />;
    }
    return <h2 style={{
      fontSize: block.textSize ?? 22,
      fontWeight: 700,
      color: fg,
      letterSpacing: 0,
      lineHeight: isAiSlideBlock ? 1.04 : 1.2,
      margin: 0,
      cursor: 'inherit',
      userSelect: 'none',
      whiteSpace: 'pre-wrap'
    }}>{renderSlideTextWithCitations(block.textContent ?? 'Namibia AI Platform')}</h2>;
  }
  if (block.type === 'text-body') {
    if (block.editingText) {
      return <CanvasTextEdit value={block.textContent ?? 'A two-track model for local AI capability, applied tooling, and institutional deployment across Namibian sectors.'} onChange={v => onUpdateBlock(block.id, {
        textContent: v
      })} onCommit={() => onUpdateBlock(block.id, {
        editingText: false
      })} isHeadline={false} />;
    }
    return <p style={{
      fontSize: block.textSize ?? 12,
      color: muted,
      lineHeight: isAiSlideBlock ? 1.42 : 1.8,
      margin: 0,
      maxWidth: isAiSlideBlock ? '100%' : 320,
      cursor: 'inherit',
      userSelect: 'none',
      whiteSpace: 'pre-wrap'
    }}>{renderSlideTextWithCitations(block.textContent ?? 'A two-track model for local AI capability, applied tooling, and institutional deployment across Namibian sectors.')}</p>;
  }
  if (block.type === 'text-quote') {
    if (block.editingText) {
      return <CanvasTextEdit value={block.textContent ?? 'Build domestic AI capability first.'} onChange={v => onUpdateBlock(block.id, {
        textContent: v
      })} onCommit={() => onUpdateBlock(block.id, {
        editingText: false
      })} isHeadline={false} />;
    }
    return <div style={{
      padding: isAiSlideBlock ? '16px 24px' : '12px 16px',
      borderLeft: `3px solid ${COLOR.ochreOrange}`,
      background: `${COLOR.ochreOrange}08`
    }}>
      <p style={{
        fontSize: block.textSize ?? 13,
        color: COLOR.barkRust,
        fontStyle: 'italic',
        fontWeight: 500,
        margin: 0,
        lineHeight: isAiSlideBlock ? 1.25 : 1.65,
        cursor: 'inherit',
        userSelect: 'none',
        whiteSpace: 'pre-wrap'
      }}>
        {renderSlideTextWithCitations(block.textContent ?? 'Build domestic AI capability first.')}
      </p>
    </div>;
  }
  if (block.type === 'text-label') {
    if (block.editingText) {
      return <CanvasTextEdit value={block.textContent ?? 'LABEL'} onChange={v => onUpdateBlock(block.id, {
        textContent: v
      })} onCommit={() => onUpdateBlock(block.id, {
        editingText: false
      })} isHeadline={true} />;
    }
    return <span style={{
      fontSize: block.textSize ?? 9,
      fontWeight: 700,
      letterSpacing: '0.18em',
      textTransform: 'uppercase' as const,
      color: COLOR.barkRust,
      cursor: 'inherit',
      userSelect: 'none',
      whiteSpace: 'pre-wrap'
    }}>{renderSlideTextWithCitations(block.textContent ?? 'LABEL')}</span>;
  }

  // System cards
  if (block.type.startsWith('sys-card-')) {
    const sysIdx = block.systemIdx ?? parseInt(block.type.replace('sys-card-', ''), 10);
    const sys = SYSTEMS[sysIdx % SYSTEMS.length];
    const displayName = block.customName ?? sys.name;
    const displayRole = block.customRole ?? sys.role;
    return <div style={{
      display: 'flex',
      gap: 10,
      padding: '10px 14px',
      background: isDark ? COLOR.darkCard : COLOR.dustLight,
      border: `1px solid ${sys.borderHex}40`,
      borderLeft: `3px solid ${sys.borderHex}`,
      maxWidth: 240
    }}>
      <div style={{
        width: 36,
        height: 36,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: `${sys.borderHex}18`,
        flexShrink: 0
      }}>{SYSTEM_ICON_MAP[sys.name]}</div>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 2
      }}>
        {block.editingField === 'name' ? <input autoFocus defaultValue={displayName} onBlur={e => onUpdateBlock(block.id, {
          customName: e.target.value,
          editingField: undefined
        })} onKeyDown={e => {
          if (e.key === 'Enter' || e.key === 'Escape') onUpdateBlock(block.id, {
            customName: (e.target as HTMLInputElement).value,
            editingField: undefined
          });
        }} onClick={e => e.stopPropagation()} onMouseDown={e => e.stopPropagation()} style={{
          fontSize: 12,
          fontWeight: 700,
          color: fg,
          background: 'transparent',
          border: 'none',
          borderBottom: `1px solid ${sys.borderHex}`,
          outline: 'none',
          width: '100%',
          padding: '0 2px'
        }} /> : <span style={{
          fontSize: 12,
          fontWeight: 700,
          color: fg,
          display: 'block',
          cursor: 'text'
        }} title="Double-click to edit name">{displayName}</span>}
        {block.editingField === 'role' ? <input autoFocus defaultValue={displayRole} onBlur={e => onUpdateBlock(block.id, {
          customRole: e.target.value,
          editingField: undefined
        })} onKeyDown={e => {
          if (e.key === 'Enter' || e.key === 'Escape') onUpdateBlock(block.id, {
            customRole: (e.target as HTMLInputElement).value,
            editingField: undefined
          });
        }} onClick={e => e.stopPropagation()} onMouseDown={e => e.stopPropagation()} style={{
          fontSize: 9,
          fontWeight: 700,
          letterSpacing: '0.12em',
          textTransform: 'uppercase' as const,
          color: sys.borderHex,
          background: 'transparent',
          border: 'none',
          borderBottom: `1px solid ${sys.borderHex}`,
          outline: 'none',
          width: '100%',
          padding: '0 2px'
        }} /> : <span style={{
          fontSize: 9,
          fontWeight: 700,
          letterSpacing: '0.12em',
          textTransform: 'uppercase' as const,
          color: sys.borderHex,
          cursor: 'text'
        }} title="Double-click to edit role">{displayRole}</span>}
        {block.selected && !block.editingField && <div style={{
          display: 'flex',
          gap: 4,
          marginTop: 2
        }}>
          <button onClick={e => {
            e.stopPropagation();
            onUpdateBlock(block.id, {
              editingField: 'name'
            });
          }} onMouseDown={e => e.stopPropagation()} style={{
            fontSize: 9,
            padding: '1px 5px',
            background: `${sys.borderHex}20`,
            border: `1px solid ${sys.borderHex}50`,
            color: sys.borderHex,
            cursor: 'pointer'
          }}>Edit name</button>
          <button onClick={e => {
            e.stopPropagation();
            onUpdateBlock(block.id, {
              editingField: 'role'
            });
          }} onMouseDown={e => e.stopPropagation()} style={{
            fontSize: 9,
            padding: '1px 5px',
            background: `${sys.borderHex}20`,
            border: `1px solid ${sys.borderHex}50`,
            color: sys.borderHex,
            cursor: 'pointer'
          }}>Edit role</button>
        </div>}
      </div>
    </div>;
  }

  // Flow nodes
  if (block.type.startsWith('flow-node-')) {
    const nodeIdx = block.flowNodeIdx ?? parseInt(block.type.replace('flow-node-', ''), 10);
    const node = FLOW_NODES[nodeIdx % FLOW_NODES.length];
    const displayName = block.customNodeName ?? node.oshiwambo;
    const displayRole = block.customNodeRole ?? node.role;
    return <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      padding: '10px 14px',
      background: `${node.hex}10`,
      border: `1px solid ${node.hex}`,
      borderLeft: `3px solid ${node.hex}`
    }}>
      <FlowNodeIcon id={node.id} hex={node.hex} />
      <div>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          marginBottom: 2
        }}>
          <PixelTag hex={node.hex} label={node.pixelTag} />
          {block.editingField === 'name' ? <input autoFocus defaultValue={displayName} onBlur={e => onUpdateBlock(block.id, {
            customNodeName: e.target.value,
            editingField: undefined
          })} onKeyDown={e => {
            if (e.key === 'Enter' || e.key === 'Escape') onUpdateBlock(block.id, {
              customNodeName: (e.target as HTMLInputElement).value,
              editingField: undefined
            });
          }} onClick={e => e.stopPropagation()} onMouseDown={e => e.stopPropagation()} style={{
            fontSize: 12,
            fontWeight: 700,
            color: fg,
            background: 'transparent',
            border: 'none',
            borderBottom: `1px solid ${node.hex}`,
            outline: 'none',
            flex: 1,
            minWidth: 0,
            padding: '0 2px'
          }} /> : <span style={{
            fontSize: 12,
            fontWeight: 700,
            color: fg,
            cursor: 'text'
          }} title="Double-click to edit name">{displayName}</span>}
        </div>
        {block.editingField === 'role' ? <input autoFocus defaultValue={displayRole} onBlur={e => onUpdateBlock(block.id, {
          customNodeRole: e.target.value,
          editingField: undefined
        })} onKeyDown={e => {
          if (e.key === 'Enter' || e.key === 'Escape') onUpdateBlock(block.id, {
            customNodeRole: (e.target as HTMLInputElement).value,
            editingField: undefined
          });
        }} onClick={e => e.stopPropagation()} onMouseDown={e => e.stopPropagation()} style={{
          fontSize: 9,
          fontWeight: 700,
          letterSpacing: '0.12em',
          textTransform: 'uppercase' as const,
          color: node.hex,
          background: 'transparent',
          border: 'none',
          borderBottom: `1px solid ${node.hex}`,
          outline: 'none',
          width: '100%',
          padding: '0 2px'
        }} /> : <span style={{
          fontSize: 9,
          fontWeight: 700,
          letterSpacing: '0.12em',
          textTransform: 'uppercase' as const,
          color: node.hex,
          cursor: 'text'
        }} title="Double-click to edit role">{displayRole}</span>}
        {block.selected && !block.editingField && <div style={{
          display: 'flex',
          gap: 4,
          marginTop: 4
        }}>
          <button onClick={e => {
            e.stopPropagation();
            onUpdateBlock(block.id, {
              editingField: 'name'
            });
          }} onMouseDown={e => e.stopPropagation()} style={{
            fontSize: 9,
            padding: '1px 5px',
            background: `${node.hex}20`,
            border: `1px solid ${node.hex}50`,
            color: node.hex,
            cursor: 'pointer'
          }}>Edit name</button>
          <button onClick={e => {
            e.stopPropagation();
            onUpdateBlock(block.id, {
              editingField: 'role'
            });
          }} onMouseDown={e => e.stopPropagation()} style={{
            fontSize: 9,
            padding: '1px 5px',
            background: `${node.hex}20`,
            border: `1px solid ${node.hex}50`,
            color: node.hex,
            cursor: 'pointer'
          }}>Edit role</button>
        </div>}
      </div>
    </div>;
  }

  // Timeline phases
  if (block.type.startsWith('timeline-')) {
    const phIdx = block.timelineIdx ?? parseInt(block.type.replace('timeline-', ''), 10);
    const phase = TIMELINE_PHASES[phIdx % TIMELINE_PHASES.length];
    const displayName = block.customPhaseName ?? phase.english;
    const displayPeriod = block.customPeriod ?? phase.period;
    const displayProgress = block.customProgress ?? phase.progress;
    return <div style={{
      width: 200,
      padding: '10px 14px',
      background: `${phase.hex}08`,
      border: `1px solid ${phase.hex}40`,
      borderLeft: `3px solid ${phase.hex}`
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        marginBottom: 6
      }}>
        <PixelTag hex={phase.hex} label={phase.tag} />
        {block.editingField === 'phaseName' ? <input autoFocus defaultValue={displayName} onBlur={e => onUpdateBlock(block.id, {
          customPhaseName: e.target.value,
          editingField: undefined
        })} onKeyDown={e => {
          if (e.key === 'Enter' || e.key === 'Escape') onUpdateBlock(block.id, {
            customPhaseName: (e.target as HTMLInputElement).value,
            editingField: undefined
          });
        }} onClick={e => e.stopPropagation()} onMouseDown={e => e.stopPropagation()} style={{
          fontSize: 11,
          fontWeight: 700,
          color: phase.hex,
          background: 'transparent',
          border: 'none',
          borderBottom: `1px solid ${phase.hex}`,
          outline: 'none',
          flex: 1,
          minWidth: 0,
          padding: '0 2px'
        }} /> : <span style={{
          fontSize: 11,
          fontWeight: 700,
          color: phase.hex,
          flex: 1
        }}>{displayName}</span>}
      </div>
      <p style={{
        fontSize: 9,
        color: muted,
        lineHeight: 1.5,
        marginBottom: 6
      }}>{(block.customDesc ?? phase.desc).slice(0, 80)}…</p>
      <div style={{
        width: '100%',
        height: 3,
        background: isDark ? 'rgba(232,225,207,0.08)' : 'rgba(30,26,23,0.08)'
      }}>
        <div style={{
          height: '100%',
          width: `${displayProgress}%`,
          background: phase.hex
        }} />
      </div>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 3
      }}>
        <span style={{
          fontSize: 9,
          color: phase.hex,
          fontWeight: 700
        }}>{displayProgress}%</span>
        {block.editingField === 'period' ? <input autoFocus defaultValue={displayPeriod} onBlur={e => onUpdateBlock(block.id, {
          customPeriod: e.target.value,
          editingField: undefined
        })} onKeyDown={e => {
          if (e.key === 'Enter' || e.key === 'Escape') onUpdateBlock(block.id, {
            customPeriod: (e.target as HTMLInputElement).value,
            editingField: undefined
          });
        }} onClick={e => e.stopPropagation()} onMouseDown={e => e.stopPropagation()} style={{
          fontSize: 9,
          color: phase.hex,
          background: 'transparent',
          border: 'none',
          borderBottom: `1px solid ${phase.hex}`,
          outline: 'none',
          textAlign: 'right',
          width: 80,
          padding: '0 2px'
        }} /> : <span style={{
          fontSize: 9,
          color: muted
        }}>{displayPeriod}</span>}
      </div>
      {block.selected && !block.editingField && <div style={{
        display: 'flex',
        gap: 4,
        marginTop: 6
      }}>
        <button onClick={e => {
          e.stopPropagation();
          onUpdateBlock(block.id, {
            editingField: 'phaseName'
          });
        }} onMouseDown={e => e.stopPropagation()} style={{
          fontSize: 9,
          padding: '1px 5px',
          background: `${phase.hex}20`,
          border: `1px solid ${phase.hex}50`,
          color: phase.hex,
          cursor: 'pointer'
        }}>Edit name</button>
        <button onClick={e => {
          e.stopPropagation();
          onUpdateBlock(block.id, {
            editingField: 'period'
          });
        }} onMouseDown={e => e.stopPropagation()} style={{
          fontSize: 9,
          padding: '1px 5px',
          background: `${phase.hex}20`,
          border: `1px solid ${phase.hex}50`,
          color: phase.hex,
          cursor: 'pointer'
        }}>Edit period</button>
      </div>}
    </div>;
  }

  // Field applications
  if (block.type.startsWith('field-')) {
    const fIdx = block.sectorAppIdx ?? parseInt(block.type.replace('field-', ''), 10);
    const app = SECTOR_APPS[fIdx % SECTOR_APPS.length];
    const displayName = block.customAppName ?? app.name;
    const displaySector = block.customSector ?? app.sector;
    const displayDesc = block.customAppDesc ?? app.desc;
    return <div style={{
      width: 200,
      padding: '10px 14px',
      background: isDark ? COLOR.darkCard : COLOR.dustLight,
      border: `1px solid ${app.hex}40`,
      borderLeft: `3px solid ${app.hex}`
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        marginBottom: 4
      }}>
        <PixelTag hex={app.hex} label={app.tag} />
      </div>
      {block.editingField === 'appName' ? <input autoFocus defaultValue={displayName} onBlur={e => onUpdateBlock(block.id, {
        customAppName: e.target.value,
        editingField: undefined
      })} onKeyDown={e => {
        if (e.key === 'Enter' || e.key === 'Escape') onUpdateBlock(block.id, {
          customAppName: (e.target as HTMLInputElement).value,
          editingField: undefined
        });
      }} onClick={e => e.stopPropagation()} onMouseDown={e => e.stopPropagation()} style={{
        fontSize: 12,
        fontWeight: 700,
        color: fg,
        background: 'transparent',
        border: 'none',
        borderBottom: `1px solid ${app.hex}`,
        outline: 'none',
        width: '100%',
        padding: '0 2px',
        marginBottom: 2
      }} /> : <span style={{
        fontSize: 12,
        fontWeight: 700,
        color: fg,
        display: 'block',
        marginBottom: 2,
        cursor: 'text'
      }} title="Double-click to edit name">{displayName}</span>}
      {block.editingField === 'sector' ? <input autoFocus defaultValue={displaySector} onBlur={e => onUpdateBlock(block.id, {
        customSector: e.target.value,
        editingField: undefined
      })} onKeyDown={e => {
        if (e.key === 'Enter' || e.key === 'Escape') onUpdateBlock(block.id, {
          customSector: (e.target as HTMLInputElement).value,
          editingField: undefined
        });
      }} onClick={e => e.stopPropagation()} onMouseDown={e => e.stopPropagation()} style={{
        fontSize: 9,
        fontWeight: 700,
        letterSpacing: '0.12em',
        textTransform: 'uppercase' as const,
        color: app.hex,
        background: 'transparent',
        border: 'none',
        borderBottom: `1px solid ${app.hex}60`,
        outline: 'none',
        width: '100%',
        padding: '0 2px'
      }} /> : <span style={{
        fontSize: 9,
        fontWeight: 700,
        letterSpacing: '0.12em',
        textTransform: 'uppercase' as const,
        color: app.hex,
        cursor: 'text'
      }} title="Double-click to edit sector">{displaySector}</span>}
      {block.editingField === 'appDesc' ? <textarea autoFocus defaultValue={displayDesc} onBlur={e => onUpdateBlock(block.id, {
        customAppDesc: e.target.value,
        editingField: undefined
      })} onKeyDown={e => {
        if (e.key === 'Escape') onUpdateBlock(block.id, {
          customAppDesc: (e.target as HTMLTextAreaElement).value,
          editingField: undefined
        });
      }} onClick={e => e.stopPropagation()} onMouseDown={e => e.stopPropagation()} style={{
        fontSize: 9,
        color: muted,
        lineHeight: 1.5,
        marginTop: 4,
        background: 'transparent',
        border: 'none',
        borderBottom: `1px solid ${app.hex}60`,
        outline: 'none',
        width: '100%',
        resize: 'none',
        padding: '0 2px',
        minHeight: 40
      }} /> : <p style={{
        fontSize: 9,
        color: muted,
        lineHeight: 1.5,
        marginTop: 4,
        cursor: 'text'
      }} title="Double-click to edit description">{displayDesc.slice(0, 70)}…</p>}
      {block.selected && !block.editingField && <div style={{
        display: 'flex',
        gap: 4,
        marginTop: 6,
        flexWrap: 'wrap' as const
      }}>
        <button onClick={e => {
          e.stopPropagation();
          onUpdateBlock(block.id, {
            editingField: 'appName'
          });
        }} onMouseDown={e => e.stopPropagation()} style={{
          fontSize: 9,
          padding: '1px 5px',
          background: `${app.hex}20`,
          border: `1px solid ${app.hex}50`,
          color: app.hex,
          cursor: 'pointer'
        }}>Edit name</button>
        <button onClick={e => {
          e.stopPropagation();
          onUpdateBlock(block.id, {
            editingField: 'sector'
          });
        }} onMouseDown={e => e.stopPropagation()} style={{
          fontSize: 9,
          padding: '1px 5px',
          background: `${app.hex}20`,
          border: `1px solid ${app.hex}50`,
          color: app.hex,
          cursor: 'pointer'
        }}>Edit sector</button>
        <button onClick={e => {
          e.stopPropagation();
          onUpdateBlock(block.id, {
            editingField: 'appDesc'
          });
        }} onMouseDown={e => e.stopPropagation()} style={{
          fontSize: 9,
          padding: '1px 5px',
          background: `${app.hex}20`,
          border: `1px solid ${app.hex}50`,
          color: app.hex,
          cursor: 'pointer'
        }}>Edit desc</button>
      </div>}
    </div>;
  }

  // Brand elements
  if (block.type === 'swatch-row') {
    return <div style={{
      display: 'flex',
      gap: 6,
      alignItems: 'center'
    }}>{SWATCHES_5.map((c, i) => <div key={`sw-d-${i}`} style={{
        width: 24,
        height: 24,
        background: c
      }} />)}</div>;
  }
  if (block.type === 'badge-okaanda') return <PixelTag hex={COLOR.ochreOrange} label="OKAANDA" />;
  if (block.type === 'badge-oshini') return <PixelTag hex={COLOR.barkRust} label="OSHINI" />;
  if (block.type === 'divider-dither') return <div style={{
    width: 200
  }}><DitherBar color={COLOR.ochreOrange} segments={24} height={4} opacity={0.6} /></div>;
  if (block.type === 'divider-dot') return <div style={{
    display: 'flex',
    gap: 4
  }}>{SWATCHES_5.map((c, i) => <div key={`dot-d-${i}`} style={{
      width: 6,
      height: 6,
      background: c
    }} />)}</div>;

  // Terminal
  if (block.type.startsWith('terminal-')) {
    const tIdx = block.terminalIdx ?? parseInt(block.type.replace('terminal-', ''), 10);
    const terminal = TERMINAL_BLOCKS[tIdx % TERMINAL_BLOCKS.length];
    return <div style={{
      background: '#1E1A17',
      minWidth: 180,
      maxWidth: 280
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '8px 12px',
        borderBottom: `1px solid ${terminal.tagHex}33`
      }}>
        <span style={{
          fontSize: 9,
          fontWeight: 700,
          letterSpacing: '0.12em',
          textTransform: 'uppercase' as const,
          color: 'rgba(232,225,207,0.55)'
        }}>{terminal.title}</span>
        <PixelTag hex={terminal.tagHex} label={terminal.tag} />
      </div>
      <div style={{
        padding: '10px 12px',
        fontFamily: 'monospace',
        fontSize: 9,
        lineHeight: 1.65
      }}>
        {terminal.lines.slice(0, 8).map((line, li) => <div key={`tl-s-${li}`} style={{
          color: colorMap[line.type] ?? colorMap.plain,
          minHeight: '1.2rem'
        }}>
          <span>{line.text || '\u00A0'}</span>
        </div>)}
      </div>
      <DitherBar color={terminal.tagHex} segments={20} height={2} opacity={0.55} />
    </div>;
  }
  return <div data-onganda-export-ui="true" data-onganda-export-modal="true" style={{
    fontSize: 11,
    color: muted
  }}>{block.label}</div>;
}

// ─── Component Preview (mini card in palette) ─────────────────────────────────
function ComponentPreview({
  item,
  isDark
}: {
  item: ComponentPaletteItem;
  isDark: boolean;
}) {
  const muted = isDark ? 'rgba(232,225,207,0.55)' : 'rgba(30,26,23,0.66)';
  const ICON_MAP: Record<string, React.ReactNode> = {
    'icon-okaanda': <IconOkaanda size={28} />,
    'icon-oshini': <IconOshini size={28} />,
    'icon-ombiga': <IconOmbiga size={28} />,
    'icon-etiti': <IconEtiti size={28} />,
    'icon-oshitoo': <IconOshitoo size={28} />
  };
  if (ICON_MAP[item.id]) return <div style={{
    height: 40,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  }}>{ICON_MAP[item.id]}</div>;
  if (item.category === 'Stats') {
    const vMap: Record<string, string> = {
      'stat-systems': '5',
      'stat-models': '3',
      'stat-pilots': '12',
      'stat-lab': '1',
      'stat-custom': 'N'
    };
    return <div style={{
      height: 40,
      display: 'flex',
      alignItems: 'center'
    }}><div style={{
        padding: '4px 8px',
        background: `${item.hex}12`,
        border: `1px solid ${item.hex}40`,
        borderTop: `2px solid ${item.hex}`
      }}><span style={{
          fontSize: 16,
          fontWeight: 700,
          color: item.hex,
          lineHeight: 1
        }}>{vMap[item.id] ?? '0'}</span></div></div>;
  }
  if (item.category === 'Charts') {
    const chartColors: Record<string, string> = {
      'chart-market': COLOR.ochreOrange,
      'chart-progress': COLOR.barkRust,
      'chart-heatmap': COLOR.firedRed,
      'chart-radar': COLOR.dyePlum,
      'chart-timeline': COLOR.mopaneBrown
    };
    const chartH = [2, 5, 8, 12];
    return <div style={{
      height: 40,
      display: 'flex',
      flexDirection: 'column',
      gap: 2
    }}>{chartH.map((h, i) => <div key={`prev-bar-${i}`} style={{
        flex: 1,
        height: `${h * 3}px`,
        background: chartColors[item.id] ?? item.hex,
        opacity: 0.3 + i * 0.15
      }} />)}</div>;
  }
  if (item.id === 'text-headline') return <div style={{
    height: 40,
    display: 'flex',
    alignItems: 'center'
  }}><div style={{
      height: 6,
      background: isDark ? 'rgba(232,225,207,0.6)' : 'rgba(30,26,23,0.6)',
      width: '80%'
    }} /></div>;
  if (item.id === 'text-quote') return <div style={{
    borderLeft: `2px solid ${item.hex}`,
    paddingLeft: 6,
    height: 40,
    display: 'flex',
    alignItems: 'center'
  }}><div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: 2
    }}>{[60, 48, 52].map((w, i) => <div key={`qt-${i}`} style={{
        height: 3,
        background: `${item.hex}${i === 0 ? 'A0' : '60'}`,
        width: w
      }} />)}</div></div>;
  if (item.id === 'text-body' || item.id === 'text-label') return <div style={{
    display: 'flex',
    flexDirection: 'column',
    gap: 3,
    height: 40,
    justifyContent: 'center'
  }}>{[90, 75, 82].map((w, i) => <div key={`bd-${i}`} style={{
      height: 3,
      background: isDark ? `rgba(232,225,207,${0.3 - i * 0.06})` : `rgba(30,26,23,${0.3 - i * 0.06})`,
      width: `${w}%`
    }} />)}</div>;
  if (item.category === 'Systems') return <div style={{
    height: 40,
    display: 'flex',
    alignItems: 'center'
  }}><div style={{
      width: '100%',
      height: 24,
      background: `${item.hex}14`,
      border: `1px solid ${item.hex}40`,
      borderLeft: `2px solid ${item.hex}`,
      display: 'flex',
      alignItems: 'center',
      paddingLeft: 6
    }}><div style={{
        width: 4,
        height: 4,
        background: item.hex
      }} /></div></div>;
  if (item.category === 'Timeline') {
    const phIdx = parseInt(item.id.replace('timeline-', ''), 10);
    const phase = TIMELINE_PHASES[phIdx % TIMELINE_PHASES.length];
    return <div style={{
      height: 40,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      gap: 4
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between'
      }}>
        <span style={{
          fontSize: 9,
          color: item.hex,
          fontWeight: 700
        }}>{phase.tag}</span>
        <span style={{
          fontSize: 9,
          color: muted
        }}>{phase.progress}%</span>
      </div>
      <div style={{
        width: '100%',
        height: 3,
        background: isDark ? 'rgba(232,225,207,0.08)' : 'rgba(30,26,23,0.08)'
      }}>
        <div style={{
          height: '100%',
          width: `${phase.progress}%`,
          background: item.hex
        }} />
      </div>
    </div>;
  }
  if (item.category === 'Field') {
    const fIdx = parseInt(item.id.replace('field-', ''), 10);
    const app = SECTOR_APPS[fIdx % SECTOR_APPS.length];
    return <div style={{
      height: 40,
      display: 'flex',
      alignItems: 'center'
    }}><div style={{
        width: '100%',
        height: 26,
        background: isDark ? COLOR.darkCard : COLOR.dustLight,
        border: `1px solid ${item.hex}40`,
        borderLeft: `2px solid ${item.hex}`,
        display: 'flex',
        alignItems: 'center',
        paddingLeft: 6,
        gap: 4
      }}><div style={{
          width: 4,
          height: 4,
          background: item.hex
        }} /><span style={{
          fontSize: 9,
          fontWeight: 700,
          color: isDark ? COLOR.milletClay : COLOR.charBlack
        }}>{app.name}</span></div></div>;
  }
  if (item.id === 'swatch-row') return <div style={{
    height: 40,
    display: 'flex',
    alignItems: 'center',
    gap: 3
  }}>{SWATCHES_5.map((c, i) => <div key={`sw-prev-${i}`} style={{
      width: 12,
      height: 12,
      background: c
    }} />)}</div>;
  if (item.id === 'badge-okaanda' || item.id === 'badge-oshini') return <div style={{
    height: 40,
    display: 'flex',
    alignItems: 'center'
  }}><PixelTag hex={item.hex} label={item.label.replace('Badge: ', '')} /></div>;
  if (item.id === 'divider-dither') return <div style={{
    height: 40,
    display: 'flex',
    alignItems: 'center',
    width: '100%'
  }}><DitherBar color={COLOR.ochreOrange} segments={16} height={4} opacity={0.55} /></div>;
  if (item.id === 'divider-dot') return <div style={{
    height: 40,
    display: 'flex',
    alignItems: 'center',
    gap: 4
  }}>{SWATCHES_5.map((c, i) => <div key={`dot-prev-${i}`} style={{
      width: 6,
      height: 6,
      background: c
    }} />)}</div>;
  if (item.category === 'Brand' && item.id.startsWith('terminal-')) {
    const tIdx = parseInt(item.id.replace('terminal-', ''), 10);
    const terminal = TERMINAL_BLOCKS[tIdx % TERMINAL_BLOCKS.length];
    return <div style={{
      height: 40,
      background: '#1E1A17',
      display: 'flex',
      alignItems: 'center',
      paddingLeft: 8,
      gap: 4
    }}>
      <div style={{
        width: 6,
        height: 6,
        background: terminal.tagHex
      }} />
      <span style={{
        fontSize: 9,
        color: terminal.tagHex,
        fontWeight: 700,
        letterSpacing: '0.1em',
        fontFamily: 'monospace'
      }}>{terminal.title.slice(0, 14)}</span>
    </div>;
  }
  return <div style={{
    height: 40,
    display: 'flex',
    alignItems: 'center'
  }}><div style={{
      width: '70%',
      height: 4,
      background: item.hex,
      opacity: 0.4
    }} /></div>;
}

// ─── ScaledBlockContent — fit intrinsic content into a sized box ──────────────
// Blocks render at their natural pixel size; when the user (or a template)
// gives a block w/h, the content is scaled to fit rather than clipped, so
// resizing always keeps the whole component visible and proportioned.
const ScaledBlockContent = ({
  children
}: {
  children: React.ReactNode;
}) => {
  const outerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  useEffect(() => {
    const measure = () => {
      const outer = outerRef.current;
      const inner = innerRef.current;
      if (!outer || !inner) return;
      const iw = inner.offsetWidth;
      const ih = inner.offsetHeight;
      if (!iw || !ih) return;
      setScale(Math.min(outer.clientWidth / iw, outer.clientHeight / ih));
    };
    measure();
    const observer = new ResizeObserver(measure);
    if (outerRef.current) observer.observe(outerRef.current);
    if (innerRef.current) observer.observe(innerRef.current);
    return () => observer.disconnect();
  }, []);
  return <div ref={outerRef} style={{
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden'
  }}>
      <div ref={innerRef} style={{
      transform: `scale(${scale})`,
      transformOrigin: 'center',
      flexShrink: 0,
      width: 'max-content'
    }}>{children}</div>
    </div>;
};

// ─── Slide Canvas ─────────────────────────────────────────────────────────────
const SlideCanvas = ({
  slideId,
  isDark,
  droppedBlocks,
  onDrop,
  onSelectBlock,
  onDeleteBlock,
  onUpdateBlock,
  onDoubleClickBlock,
  onMoveBlock,
  onUpdateSlideTitle,
  slides
}: {
  slideId: string;
  isDark: boolean;
  droppedBlocks: DroppedBlock[];
  onDrop: (type: string, label: string, x: number, y: number) => void;
  onSelectBlock: (id: string) => void;
  onDeleteBlock: (id: string) => void;
  onUpdateBlock: (id: string, updates: Partial<DroppedBlock>) => void;
  onDoubleClickBlock: (id: string) => void;
  onMoveBlock: (id: string, x: number, y: number) => void;
  onUpdateSlideTitle: (slideId: string, title: string) => void;
  slides: SlideEntry[];
}) => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const [draggingBlockId, setDraggingBlockId] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({
    ox: 0,
    oy: 0
  });
  const [guides, setGuides] = useState<AlignGuide[]>([]);
  // Resize state
  const resizingRef = useRef<{
    blockId: string;
    handle: string; // 'nw'|'ne'|'sw'|'se'|'n'|'s'|'e'|'w'
    startX: number;
    startY: number;
    origX: number;
    origY: number;
    origW: number;
    origH: number;
  } | null>(null);
  const bg = isDark ? COLOR.darkCard : EDITOR_SURFACE.paperWarm;
  const border = isDark ? 'rgba(232,225,207,0.08)' : 'rgba(30,26,23,0.07)';
  const muted = isDark ? 'rgba(232,225,207,0.55)' : 'rgba(30,26,23,0.66)';
  const slide = slides.find(s => s.id === slideId) ?? {
    id: slideId,
    tag: '??',
    title: 'Slide',
    subtitle: ''
  };
  const slideTitle = slide.customTitle ?? slide.title;
  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  }, []);
  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const type = e.dataTransfer.getData('component-type');
    const label = e.dataTransfer.getData('component-label');
    if (!type || !bodyRef.current) return;
    const rect = bodyRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width * 100;
    const y = (e.clientY - rect.top) / rect.height * 100;
    onDrop(type, label, Math.max(2, Math.min(80, x)), Math.max(2, Math.min(85, y)));
  }, [onDrop]);
  const handleBlockMouseDown = useCallback((e: React.MouseEvent, blockId: string) => {
    if ((e.target as HTMLElement).tagName === 'TEXTAREA' || (e.target as HTMLElement).tagName === 'INPUT') return;
    const block = droppedBlocks.find(b => b.id === blockId);
    if (!block || block.editingField) return;
    e.preventDefault();
    e.stopPropagation();
    if (!bodyRef.current) return;
    const rect = bodyRef.current.getBoundingClientRect();
    const blockX = block.x / 100 * rect.width + rect.left;
    const blockY = block.y / 100 * rect.height + rect.top;
    setDragOffset({
      ox: e.clientX - blockX,
      oy: e.clientY - blockY
    });
    setDraggingBlockId(blockId);
    onSelectBlock(blockId);
  }, [droppedBlocks, onSelectBlock]);
  const handleResizeMouseDown = useCallback((e: React.MouseEvent, blockId: string, handle: string) => {
    e.preventDefault();
    e.stopPropagation();
    if (!bodyRef.current) return;
    const rect = bodyRef.current.getBoundingClientRect();
    const block = droppedBlocks.find(b => b.id === blockId);
    if (!block) return;
    resizingRef.current = {
      blockId,
      handle,
      startX: (e.clientX - rect.left) / rect.width * 100,
      startY: (e.clientY - rect.top) / rect.height * 100,
      origX: block.x,
      origY: block.y,
      origW: block.w ?? 20,
      origH: block.h ?? 20
    };
  }, [droppedBlocks]);
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!bodyRef.current) return;
      const rect = bodyRef.current.getBoundingClientRect();

      // Resize logic
      if (resizingRef.current) {
        const {
          blockId,
          handle,
          startX,
          startY,
          origX,
          origY,
          origW,
          origH
        } = resizingRef.current;
        const cx = (e.clientX - rect.left) / rect.width * 100;
        const cy = (e.clientY - rect.top) / rect.height * 100;
        const dx = cx - startX;
        const dy = cy - startY;
        let newW = origW;
        let newH = origH;
        const newX = origX;
        const newY = origY;
        if (handle === 'se') {
          newW = Math.max(6, origW + dx * 2);
          newH = Math.max(6, origH + dy * 2);
        } else if (handle === 'sw') {
          newW = Math.max(6, origW - dx * 2);
          newH = Math.max(6, origH + dy * 2);
        } else if (handle === 'ne') {
          newW = Math.max(6, origW + dx * 2);
          newH = Math.max(6, origH - dy * 2);
        } else if (handle === 'nw') {
          newW = Math.max(6, origW - dx * 2);
          newH = Math.max(6, origH - dy * 2);
        } else if (handle === 'e') {
          newW = Math.max(6, origW + dx * 2);
        } else if (handle === 'w') {
          newW = Math.max(6, origW - dx * 2);
        } else if (handle === 's') {
          newH = Math.max(6, origH + dy * 2);
        } else if (handle === 'n') {
          newH = Math.max(6, origH - dy * 2);
        }
        onUpdateBlock(blockId, {
          w: Math.min(96, newW),
          h: Math.min(90, newH),
          x: newX,
          y: newY
        });
        return;
      }

      // Drag-to-move logic
      if (!draggingBlockId) return;
      let nx = (e.clientX - dragOffset.ox - rect.left) / rect.width * 100;
      let ny = (e.clientY - dragOffset.oy - rect.top) / rect.height * 100;
      nx = Math.max(2, Math.min(90, nx));
      ny = Math.max(2, Math.min(88, ny));
      const SNAP_THRESHOLD = 3;
      const newGuides: AlignGuide[] = [];
      // Quarters plus the 10/90 margin lines used by the templates
      const gridLines = [10, 25, 50, 75, 90];
      for (const gl of gridLines) {
        if (Math.abs(nx - gl) < SNAP_THRESHOLD) {
          nx = gl;
          newGuides.push({
            orientation: 'v',
            position: gl
          });
        }
        if (Math.abs(ny - gl) < SNAP_THRESHOLD) {
          ny = gl;
          newGuides.push({
            orientation: 'h',
            position: gl
          });
        }
      }
      for (const other of droppedBlocks) {
        if (other.id === draggingBlockId) continue;
        if (Math.abs(nx - other.x) < SNAP_THRESHOLD) {
          nx = other.x;
          newGuides.push({
            orientation: 'v',
            position: other.x
          });
        }
        if (Math.abs(ny - other.y) < SNAP_THRESHOLD) {
          ny = other.y;
          newGuides.push({
            orientation: 'h',
            position: other.y
          });
        }
      }
      setGuides(newGuides);
      onMoveBlock(draggingBlockId, nx, ny);
    };
    const handleMouseUp = () => {
      // Quantize the final position to whole percent so layouts stay tidy
      // and agent/template data reads cleanly.
      if (draggingBlockId) {
        const block = droppedBlocks.find(b => b.id === draggingBlockId);
        if (block) onMoveBlock(draggingBlockId, Math.round(block.x), Math.round(block.y));
      }
      setDraggingBlockId(null);
      setGuides([]);
      resizingRef.current = null;
    };
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [draggingBlockId, dragOffset, droppedBlocks, onMoveBlock, onUpdateBlock]);

  // Resize handle style helper
  const handleBase: React.CSSProperties = {
    position: 'absolute',
    zIndex: 25,
    background: COLOR.milletClay,
    border: `1.5px solid ${COLOR.ochreOrange}`,
    borderRadius: 0
  };
  const cornerHandle = (style: React.CSSProperties): React.CSSProperties => ({
    ...handleBase,
    width: 8,
    height: 8,
    ...style
  });
  const edgeHandleH = (style: React.CSSProperties): React.CSSProperties => ({
    ...handleBase,
    width: 20,
    height: 6,
    ...style
  });
  const edgeHandleV = (style: React.CSSProperties): React.CSSProperties => ({
    ...handleBase,
    width: 6,
    height: 20,
    ...style
  });
  return <div ref={canvasRef} style={{
    background: bg,
    border: `1px solid ${border}`,
    boxShadow: isDark ? '0 8px 48px rgba(0,0,0,0.5)' : '0 8px 48px rgba(30,26,23,0.10)',
    aspectRatio: '16 / 9',
    position: 'relative',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    cursor: 'default'
  }}>
    <WeaveOverlay isDark={isDark} opacity={isDark ? 0.03 : 0.02} />
    <div style={{
      height: 4,
      background: COLOR.ochreOrange,
      flexShrink: 0
    }} />
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '10px 24px',
      borderBottom: `1px solid ${border}`,
      flexShrink: 0,
      background: isDark ? 'rgba(0,0,0,0.15)' : 'rgba(255,255,255,0.5)'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 10
      }}>
        <OngandaLogoMark size={16} />
        <span style={{
          fontSize: 9,
          color: COLOR.barkRust,
          fontWeight: 700,
          letterSpacing: '0.12em'
        }}>OKAANDA</span>
        <span style={{
          fontSize: 9,
          color: muted
        }}>·</span>
        <span style={{
          fontSize: 9,
          color: muted,
          fontWeight: 500,
          letterSpacing: '0.06em'
        }}>{slideTitle}</span>
      </div>
      <PixelTag hex={COLOR.ochreOrange} label={slide.tag} />
    </div>
    <div ref={bodyRef} onDragOver={handleDragOver} onDrop={handleDrop} style={{
      flex: 1,
      position: 'relative',
      overflow: 'hidden',
      minHeight: 0
    }}>
      {/* Empty state hint */}
      <div style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        gap: 12,
        opacity: droppedBlocks.length > 0 ? 0.04 : 0.22,
        transition: 'opacity 0.3s',
        pointerEvents: 'none',
        padding: '20px 40px'
      }}>
        <div style={{
          width: '60%',
          height: 6,
          background: isDark ? COLOR.milletClay : COLOR.charBlack,
          opacity: 0.4
        }} />
        <div style={{
          width: '45%',
          height: 4,
          background: isDark ? COLOR.milletClay : COLOR.charBlack,
          opacity: 0.25
        }} />
        <div style={{
          display: 'flex',
          gap: 12,
          marginTop: 12
        }}>
          {[1, 2, 3].map(i => <div key={`guide-col-${i}`} style={{
            width: 60,
            height: 40,
            border: `1px dashed ${isDark ? 'rgba(232,225,207,0.2)' : 'rgba(30,26,23,0.15)'}`
          }} />)}
        </div>
        <p style={{
          fontSize: 9,
          color: muted,
          letterSpacing: '0.12em',
          textTransform: 'uppercase' as const,
          marginTop: 8
        }}>Drag components here</p>
      </div>
      {/* Alignment guides */}
      {guides.map((guide, gi) => <div key={`guide-${gi}`} style={{
        position: 'absolute',
        pointerEvents: 'none',
        zIndex: 30,
        ...(guide.orientation === 'v' ? {
          left: `${guide.position}%`,
          top: 0,
          bottom: 0,
          width: 1,
          background: COLOR.ochreOrange,
          opacity: 0.6
        } : {
          top: `${guide.position}%`,
          left: 0,
          right: 0,
          height: 1,
          background: COLOR.ochreOrange,
          opacity: 0.6
        })
      }} />)}
      {/* Blocks */}
      {droppedBlocks.map(block => {
        const hasSize = block.w !== undefined && block.h !== undefined;
        return <div key={block.id} style={{
          position: 'absolute',
          left: `${block.x}%`,
          top: `${block.y}%`,
          transform: 'translate(-50%, -50%)',
          zIndex: block.selected ? 10 : 5,
          cursor: draggingBlockId === block.id ? 'grabbing' : block.editingText || block.editingField ? 'text' : 'grab',
          ...(hasSize ? {
            width: `${block.w}%`,
            height: `${block.h}%`,
            overflow: 'hidden'
          } : {})
        }} onMouseDown={e => handleBlockMouseDown(e, block.id)} onClick={e => {
          e.stopPropagation();
          onSelectBlock(block.id);
        }} onDoubleClick={e => {
          e.stopPropagation();
          onDoubleClickBlock(block.id);
        }}>
          <div style={{
            outline: block.selected ? `2px solid ${COLOR.ochreOrange}` : '2px solid transparent',
            outlineOffset: 4,
            position: 'relative',
            transition: 'outline 0.15s',
            width: '100%',
            height: '100%'
          }}>
            {hasSize && !block.editingText && !block.editingField ? <ScaledBlockContent>
                {renderDroppedBlock(block, isDark, onUpdateBlock)}
              </ScaledBlockContent> : <div style={{
              width: '100%',
              height: '100%',
              overflow: 'visible'
            }}>
                {renderDroppedBlock(block, isDark, onUpdateBlock)}
              </div>}
            {/* Delete button */}
            {block.selected && !block.editingText && <button onClick={e => {
              e.stopPropagation();
              onDeleteBlock(block.id);
            }} style={{
              position: 'absolute',
              top: -12,
              right: -12,
              width: 20,
              height: 20,
              background: COLOR.firedRed,
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 10,
              color: COLOR.milletClay,
              fontWeight: 700,
              zIndex: 20
            }} aria-label="Remove block">×</button>}
            {/* Resize handles — only shown when selected */}
            {block.selected && !block.editingText && !block.editingField && <>
              {/* Corner handles (proportional resize) */}
              <div style={cornerHandle({
                top: -5,
                left: -5,
                cursor: 'nw-resize'
              })} onMouseDown={e => {
                e.stopPropagation();
                handleResizeMouseDown(e, block.id, 'nw');
              }} />
              <div style={cornerHandle({
                top: -5,
                right: -5,
                cursor: 'ne-resize'
              })} onMouseDown={e => {
                e.stopPropagation();
                handleResizeMouseDown(e, block.id, 'ne');
              }} />
              <div style={cornerHandle({
                bottom: -5,
                left: -5,
                cursor: 'sw-resize'
              })} onMouseDown={e => {
                e.stopPropagation();
                handleResizeMouseDown(e, block.id, 'sw');
              }} />
              <div style={cornerHandle({
                bottom: -5,
                right: -5,
                cursor: 'se-resize'
              })} onMouseDown={e => {
                e.stopPropagation();
                handleResizeMouseDown(e, block.id, 'se');
              }} />
              {/* Edge handles (single-axis resize) */}
              <div style={edgeHandleH({
                top: -4,
                left: '50%',
                transform: 'translateX(-50%)',
                cursor: 'n-resize'
              })} onMouseDown={e => {
                e.stopPropagation();
                handleResizeMouseDown(e, block.id, 'n');
              }} />
              <div style={edgeHandleH({
                bottom: -4,
                left: '50%',
                transform: 'translateX(-50%)',
                cursor: 's-resize'
              })} onMouseDown={e => {
                e.stopPropagation();
                handleResizeMouseDown(e, block.id, 's');
              }} />
              <div style={edgeHandleV({
                left: -4,
                top: '50%',
                transform: 'translateY(-50%)',
                cursor: 'w-resize'
              })} onMouseDown={e => {
                e.stopPropagation();
                handleResizeMouseDown(e, block.id, 'w');
              }} />
              <div style={edgeHandleV({
                right: -4,
                top: '50%',
                transform: 'translateY(-50%)',
                cursor: 'e-resize'
              })} onMouseDown={e => {
                e.stopPropagation();
                handleResizeMouseDown(e, block.id, 'e');
              }} />
            </>}
          </div>
        </div>;
      })}
    </div>
    <DitherBar color={COLOR.ochreOrange} segments={80} height={2} opacity={0.15} />
  </div>;
};

// ─── Component Panel ──────────────────────────────────────────────────────────
const ComponentPanel = ({
  isDark,
  activeCategory,
  onCategoryChange
}: {
  isDark: boolean;
  activeCategory: string;
  onCategoryChange: (cat: string) => void;
}) => {
  const panelBg = isDark ? COLOR.darkCard : EDITOR_SURFACE.dustPanel;
  const headerBg = isDark ? COLOR.darkCard : EDITOR_SURFACE.dustHeader;
  const border = isDark ? 'rgba(232,225,207,0.08)' : 'rgba(30,26,23,0.10)';
  const fg = isDark ? COLOR.milletClay : COLOR.charBlack;
  const muted = isDark ? 'rgba(232,225,207,0.55)' : 'rgba(30,26,23,0.66)';
  const itemBg = isDark ? 'rgba(232,225,207,0.04)' : 'rgba(255,255,255,0.6)';
  const itemHoverBg = isDark ? 'rgba(232,225,207,0.08)' : EDITOR_SURFACE.paperWarm;
  const filtered = SLIDE_COMPONENT_PALETTE.filter(i => i.category === activeCategory);
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, item: ComponentPaletteItem) => {
    e.dataTransfer.setData('component-type', item.id);
    e.dataTransfer.setData('component-label', item.label);
    e.dataTransfer.effectAllowed = 'copy';
  };
  return <div style={{
    width: 220,
    flexShrink: 0,
    background: panelBg,
    borderRight: `1px solid ${border}`,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden'
  }}>
    <div style={{
      background: headerBg,
      borderBottom: `1px solid ${border}`,
      padding: '12px 14px',
      flexShrink: 0
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        marginBottom: 10
      }}>
        <PixelDot color={COLOR.ochreOrange} size={5} />
        <span style={{
          fontSize: 9,
          fontWeight: 700,
          letterSpacing: '0.16em',
          color: COLOR.barkRust,
          textTransform: 'uppercase' as const
        }}>Components</span>
      </div>
      <div style={{
        display: 'flex',
        flexWrap: 'wrap' as const,
        gap: 3
      }}>
        {SLIDE_PALETTE_CATEGORIES.map(cat => <button key={`cat-${cat}`} onClick={() => onCategoryChange(cat)} style={{
          padding: '2px 6px',
          fontSize: 9,
          fontWeight: 700,
          letterSpacing: '0.10em',
          cursor: 'pointer',
          border: 'none',
          background: activeCategory === cat ? COLOR.ochreOrange : 'transparent',
          color: activeCategory === cat ? COLOR.milletClay : muted,
          textTransform: 'uppercase' as const
        }}>{cat}</button>)}
      </div>
    </div>
    <div style={{
      flex: 1,
      overflowY: 'auto',
      padding: '10px 10px'
    }}>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 6
      }}>
        {filtered.map(item => <div key={item.id} draggable onDragStart={e => handleDragStart(e, item)} style={{
          background: itemBg,
          border: `1px solid ${border}`,
          padding: '10px 10px',
          cursor: 'grab',
          userSelect: 'none'
        }} onMouseEnter={e => {
          if (!activeCategory) e.currentTarget.style.background = itemHoverBg;
          e.currentTarget.style.borderColor = `${COLOR.ochreOrange}50`;
        }} onMouseLeave={e => {
          if (!activeCategory) e.currentTarget.style.background = itemBg;
          e.currentTarget.style.borderColor = border;
        }} title={`Drag to add ${item.label}`}>
          <div style={{
            marginBottom: 8,
            pointerEvents: 'none'
          }}>
            <ComponentPreview item={item} isDark={isDark} />
          </div>
          <p style={{
            fontSize: 10,
            fontWeight: 600,
            color: fg,
            margin: '0 0 2px',
            lineHeight: 1.2
          }}>{item.label}</p>
          <p style={{
            fontSize: 9,
            color: muted,
            margin: 0,
            lineHeight: 1.3
          }}>{item.desc}</p>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 3,
            marginTop: 5
          }}>
            {[0, 1, 2].map(k => <div key={`dh-${k}`} style={{
              width: 3,
              height: 3,
              background: muted
            }} />)}
            <span style={{
              fontSize: 9,
              color: muted,
              letterSpacing: '0.12em'
            }}>drag to slide</span>
          </div>
        </div>)}
      </div>
    </div>
  </div>;
};

// ─── Slide Thumbnail (in side panel) ─────────────────────────────────────────
function SlideThumbnail({
  slide,
  isActive,
  isDark,
  onClick,
  onDragStart,
  onDragOver,
  onDragEnd,
  isDragging,
  isDragOver
}: {
  slide: SlideEntry;
  isActive: boolean;
  isDark: boolean;
  onClick: () => void;
  onDragStart: () => void;
  onDragOver: () => void;
  onDragEnd: () => void;
  isDragging: boolean;
  isDragOver: boolean;
}) {
  const muted = isDark ? 'rgba(232,225,207,0.55)' : 'rgba(30,26,23,0.66)';
  const fg = isDark ? COLOR.milletClay : COLOR.charBlack;
  return <div draggable onDragStart={e => {
    e.stopPropagation();
    onDragStart();
  }} onDragOver={e => {
    e.preventDefault();
    e.stopPropagation();
    onDragOver();
  }} onDragEnd={onDragEnd} onClick={onClick} style={{
    width: '100%',
    padding: '9px 14px',
    background: isActive ? `${COLOR.ochreOrange}18` : isDragOver ? `${COLOR.ochreOrange}0C` : 'transparent',
    borderLeft: `3px solid ${isActive ? COLOR.ochreOrange : isDark ? 'rgba(232,225,207,0.06)' : 'rgba(30,26,23,0.08)'}`,
    cursor: isDragging ? 'grabbing' : 'pointer',
    textAlign: 'left',
    display: 'flex',
    flexDirection: 'column',
    gap: 3,
    opacity: isDragging ? 0.4 : 1,
    transition: 'background 0.1s, border-color 0.1s',
    userSelect: 'none'
  }} onMouseEnter={e => {
    if (!isActive) e.currentTarget.style.background = isDark ? 'rgba(232,225,207,0.05)' : 'rgba(30,26,23,0.05)';
  }} onMouseLeave={e => {
    if (!isActive) e.currentTarget.style.background = 'transparent';
  }}>
    <div style={{
      width: '100%',
      aspectRatio: '16/9',
      background: isDark ? EDITOR_SURFACE.canvasWellDark : EDITOR_SURFACE.paperWarm,
      border: `1px solid ${isActive ? `${COLOR.ochreOrange}40` : isDark ? 'rgba(232,225,207,0.06)' : 'rgba(30,26,23,0.08)'}`,
      marginBottom: 6,
      overflow: 'hidden',
      position: 'relative'
    }}>
      <div style={{
        height: 2,
        background: COLOR.ochreOrange
      }} />
      <div style={{
        padding: '4px 6px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div style={{
          width: '40%',
          height: 3,
          background: isDark ? 'rgba(232,225,207,0.15)' : 'rgba(30,26,23,0.15)'
        }} />
        <div style={{
          width: 10,
          height: 5,
          background: `${COLOR.ochreOrange}60`
        }} />
      </div>
      <div style={{
        padding: '2px 6px',
        display: 'flex',
        flexDirection: 'column',
        gap: 2
      }}>
        {[70, 55, 40].map((w, i) => <div key={`prv-${i}`} style={{
          height: 2,
          background: isDark ? `rgba(232,225,207,${0.08 - i * 0.02})` : `rgba(30,26,23,${0.08 - i * 0.02})`,
          width: `${w}%`
        }} />)}
      </div>
    </div>
    <div style={{
      display: 'flex',
      alignItems: 'baseline',
      gap: 6
    }}>
      <span style={{
        fontSize: 9,
        fontWeight: 700,
        letterSpacing: '0.16em',
        color: isActive ? COLOR.ochreOrange : muted
      }}>{slide.tag}</span>
      <p style={{
        fontSize: 10,
        fontWeight: isActive ? 600 : 400,
        color: isActive ? fg : muted,
        margin: 0,
        lineHeight: 1.3,
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap' as const,
        flex: 1
      }}>{slide.customTitle ?? slide.title}</p>
    </div>
  </div>;
}

// ─── Export Modal ─────────────────────────────────────────────────────────────
const ExportModal = ({
  isDark,
  format,
  slideCount,
  deckTitle,
  onGenerate,
  onClose
}: {
  isDark: boolean;
  format: 'PDF' | 'PPT';
  slideCount: number;
  deckTitle: string;
  onGenerate: () => void;
  onClose: () => void;
}) => {
  const [phase, setPhase] = useState<'options' | 'exporting' | 'done'>('options');
  const [progress, setProgress] = useState(0);
  const handleExport = () => {
    setPhase('exporting');
    setProgress(0);
    const steps = [12, 28, 45, 62, 78, 91, 100];
    let i = 0;
    const tick = () => {
      if (i < steps.length) {
        setProgress(steps[i]);
        i++;
        setTimeout(tick, 220 + Math.random() * 180);
      } else setTimeout(() => {
        onGenerate();
        if (format !== 'PDF') setPhase('done');
      }, 300);
    };
    setTimeout(tick, 300);
  };
  const panelBg = isDark ? COLOR.darkCard : EDITOR_SURFACE.emberBrown;
  const borderC = 'rgba(232,225,207,0.08)';
  const fg = COLOR.milletClay;
  const muted = 'rgba(232,225,207,0.55)';
  const formatColor = format === 'PDF' ? COLOR.ochreOrange : COLOR.dyePlum;
  const exportOpts = [{
    label: 'Slides',
    value: `${slideCount} slides`
  }, {
    label: 'Format',
    value: format === 'PDF' ? 'Landscape PDF print' : 'PowerPoint-compatible .ppt'
  }, {
    label: 'Deck',
    value: deckTitle
  }, {
    label: 'Layout',
    value: '16:9 Onganda slides'
  }];
  const exportSteps = [{
    label: 'Rendering slides',
    done: progress >= 30
  }, {
    label: 'Embedding fonts & assets',
    done: progress >= 60
  }, {
    label: 'Packaging file',
    done: progress >= 90
  }];
  return <div style={{
    position: 'fixed',
    inset: 0,
    zIndex: 200,
    background: 'rgba(18,15,13,0.88)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  }}>
    <motion.div initial={{
      opacity: 0,
      scale: 0.96,
      y: 10
    }} animate={{
      opacity: 1,
      scale: 1,
      y: 0
    }} exit={{
      opacity: 0,
      scale: 0.96
    }} transition={{
      duration: 0.22
    }} style={{
      width: 440,
      background: panelBg,
      border: `1px solid ${borderC}`,
      boxShadow: '0 24px 80px rgba(0,0,0,0.7)',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden'
    }}>
      <div style={{
        padding: '18px 24px 16px',
        borderBottom: `1px solid ${borderC}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10
        }}>
          <OngandaLogoMark size={18} />
          <PixelTag hex={formatColor} label={format === 'PDF' ? 'Export PDF' : 'Export PPT'} />
        </div>
        <button onClick={onClose} style={{
          background: 'transparent',
          border: `1px solid ${borderC}`,
          color: muted,
          cursor: 'pointer',
          fontSize: 11,
          padding: '5px 12px'
        }}>✕</button>
      </div>
      <div style={{
        padding: '24px 24px'
      }}>
        {phase === 'options' && <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 20
        }}>
          <div>
            <p style={{
              fontSize: 14,
              fontWeight: 600,
              color: fg,
              margin: '0 0 4px'
            }}>Export as {format === 'PDF' ? 'PDF' : 'PPT'}</p>
            <p style={{
              fontSize: 12,
              color: muted,
              margin: 0,
              lineHeight: 1.6
            }}>
              {format === 'PDF' ? `Opens the browser PDF print flow for all ${slideCount} slides.` : `Downloads all ${slideCount} slides as a PowerPoint-compatible .ppt file.`}
            </p>
          </div>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 10
          }}>
            {exportOpts.map(row => <div key={`opt-${row.label}`} style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '8px 12px',
              background: 'rgba(232,225,207,0.04)',
              border: `1px solid ${borderC}`
            }}>
              <span style={{
                fontSize: 11,
                color: muted
              }}>{row.label}</span>
              <span style={{
                fontSize: 11,
                fontWeight: 600,
                color: fg
              }}>{row.value}</span>
            </div>)}
          </div>
          <DitherBar color={formatColor} segments={20} height={2} opacity={0.3} />
          <button onClick={handleExport} style={{
            width: '100%',
            padding: '12px',
            background: formatColor,
            border: 'none',
            cursor: 'pointer',
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: '0.10em',
            color: COLOR.milletClay,
            textTransform: 'uppercase' as const
          }} onMouseEnter={e => e.currentTarget.style.background = COLOR.firedRed} onMouseLeave={e => e.currentTarget.style.background = formatColor}>
            Generate {format === 'PDF' ? 'PDF' : 'PPT'} →
          </button>
        </div>}
        {phase === 'exporting' && <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 20,
          alignItems: 'center',
          width: '100%'
        }}>
          <div style={{
            width: 48,
            height: 48,
            background: `${formatColor}15`,
            border: `1px solid ${formatColor}40`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <OngandaLogoMark size={28} />
          </div>
          <div style={{
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            gap: 10
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <span style={{
                fontSize: 12,
                color: fg,
                fontWeight: 500
              }}>Generating {format === 'PDF' ? 'PDF' : 'PPT'}…</span>
              <span style={{
                fontSize: 11,
                color: formatColor,
                fontWeight: 700
              }}>{progress}%</span>
            </div>
            <div style={{
              width: '100%',
              height: 4,
              background: 'rgba(232,225,207,0.08)'
            }}>
              <motion.div animate={{
                width: `${progress}%`
              }} transition={{
                duration: 0.3,
                ease: 'easeOut'
              }} style={{
                height: '100%',
                background: formatColor
              }} />
            </div>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 4
            }}>
              {exportSteps.map(step => <div key={`step-${step.label}`} style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8
              }}>
                <div style={{
                  width: 8,
                  height: 8,
                  background: step.done ? COLOR.mahanguGold : 'rgba(232,225,207,0.15)'
                }} />
                <span style={{
                  fontSize: 10,
                  color: step.done ? fg : muted
                }}>{step.label}</span>
              </div>)}
            </div>
          </div>
        </div>}
        {phase === 'done' && <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 18,
          alignItems: 'center',
          textAlign: 'center',
          width: '100%'
        }}>
          <div style={{
            width: 48,
            height: 48,
            background: `${COLOR.mahanguGold}20`,
            border: `1px solid ${COLOR.mahanguGold}50`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <span style={{
              fontSize: 24,
              color: COLOR.mahanguGold
            }}>✓</span>
          </div>
          <div>
            <p style={{
              fontSize: 14,
              fontWeight: 600,
              color: fg,
              margin: '0 0 6px'
            }}>Export complete</p>
            <p style={{
              fontSize: 11,
              color: muted,
              margin: 0,
              lineHeight: 1.6
            }}>{format === 'PDF' ? 'Use Save as PDF in the print dialog.' : 'Your PowerPoint-compatible deck has downloaded.'}</p>
          </div>
          <DitherBar color={COLOR.mahanguGold} segments={16} height={3} opacity={0.6} />
          <div style={{
            display: 'flex',
            gap: 10,
            width: '100%'
          }}>
            <button onClick={onClose} style={{
              flex: 1,
              padding: '10px',
              background: 'transparent',
              border: `1px solid ${borderC}`,
              cursor: 'pointer',
              fontSize: 11,
              fontWeight: 500,
              color: muted
            }}>Close</button>
            <button onClick={onGenerate} style={{
              flex: 2,
              padding: '10px',
              background: COLOR.ochreOrange,
              border: 'none',
              cursor: 'pointer',
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: '0.08em',
              color: COLOR.charBlack,
              textTransform: 'uppercase' as const
            }}>{format === 'PDF' ? 'Open PDF Dialog' : '↓ Download PPT'}</button>
          </div>
        </div>}
      </div>
      <DitherBar color={formatColor} segments={60} height={2} opacity={0.2} />
    </motion.div>
  </div>;
};

// ─── Top Toolbar ──────────────────────────────────────────────────────────────
const EditorToolbar = ({
  isDark,
  activeSlide,
  slides,
  deckTitle,
  onDeckTitleChange,
  onClose,
  onExport,
  onAddSlide,
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  sessionSaved
}: {
  isDark: boolean;
  activeSlide: string;
  slides: SlideEntry[];
  deckTitle: string;
  onDeckTitleChange: (t: string) => void;
  onClose: () => void;
  onExport: (fmt: 'PDF' | 'PPT') => void;
  onAddSlide: () => void;
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
  sessionSaved: boolean;
}) => {
  const [editingTitle, setEditingTitle] = useState(false);
  const bg = isDark ? COLOR.darkCard : EDITOR_SURFACE.dustCream;
  const border = isDark ? 'rgba(232,225,207,0.08)' : 'rgba(30,26,23,0.10)';
  const fg = isDark ? COLOR.milletClay : COLOR.charBlack;
  const muted = isDark ? 'rgba(232,225,207,0.55)' : 'rgba(30,26,23,0.66)';
  const activeIdx = slides.findIndex(s => s.id === activeSlide);
  const fmtBtns: Array<'PDF' | 'PPT'> = ['PDF', 'PPT'];
  const btnBase: React.CSSProperties = {
    padding: '4px 10px',
    background: 'transparent',
    border: `1px solid ${border}`,
    cursor: 'pointer',
    fontSize: 10,
    fontWeight: 700,
    letterSpacing: '0.10em',
    color: muted,
    display: 'flex',
    alignItems: 'center',
    gap: 4
  };
  return <div style={{
    background: bg,
    borderBottom: `1px solid ${border}`,
    padding: '0 20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 16,
    height: 48,
    flexShrink: 0,
    position: 'sticky',
    top: 0,
    zIndex: 30
  }}>
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: 12
    }}>
      <button onClick={onClose} style={{
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        background: 'transparent',
        border: 'none',
        cursor: 'pointer',
        color: muted,
        fontSize: 12,
        fontWeight: 500,
        padding: '4px 0'
      }} onMouseEnter={e => e.currentTarget.style.color = COLOR.barkRust} onMouseLeave={e => e.currentTarget.style.color = muted}>
        <svg width="14" height="10" viewBox="0 0 7 5" fill="none" aria-hidden="true">
          <rect x="2" y="0" width="1" height="1" fill="currentColor" fillOpacity="0.7" />
          <rect x="1" y="1" width="1" height="1" fill="currentColor" fillOpacity="0.7" />
          <rect x="0" y="2" width="7" height="1" fill="currentColor" fillOpacity="0.9" />
          <rect x="1" y="3" width="1" height="1" fill="currentColor" fillOpacity="0.7" />
          <rect x="2" y="4" width="1" height="1" fill="currentColor" fillOpacity="0.7" />
        </svg>
        <span>Publications</span>
      </button>
      <span style={{
        color: border,
        fontSize: 14
      }}>/</span>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8
      }}>
        <PixelTag hex={COLOR.dyePlum} label="DECK" />
        {editingTitle ? <input value={deckTitle} onChange={e => onDeckTitleChange(e.target.value)} onBlur={() => setEditingTitle(false)} onKeyDown={e => {
          if (e.key === 'Enter' || e.key === 'Escape') setEditingTitle(false);
        }} autoFocus style={{
          fontSize: 12,
          fontWeight: 600,
          color: fg,
          background: 'transparent',
          border: 'none',
          borderBottom: `1px solid ${COLOR.dyePlum}80`,
          outline: 'none',
          minWidth: 120
        }} /> : <span style={{
          fontSize: 12,
          fontWeight: 600,
          color: fg,
          cursor: 'text'
        }} onDoubleClick={() => setEditingTitle(true)} title="Double-click to rename">{deckTitle}</span>}
      </div>
      {sessionSaved && <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 4
      }}>
        <div style={{
          width: 5,
          height: 5,
          background: statusFor('settled', isDark),
          opacity: 0.7
        }} />
        <span style={{
          fontSize: 9,
          color: muted,
          letterSpacing: '0.10em'
        }}>saved</span>
      </div>}
    </div>
    <span style={{
      fontSize: 11,
      color: muted,
      letterSpacing: '0.04em'
    }}>
      <span style={{
        color: fg,
        fontWeight: 600
      }}>{String(activeIdx + 1).padStart(2, '0')}</span>
      <span style={{
        margin: '0 4px'
      }}>/</span>
      <span>{String(slides.length).padStart(2, '0')}</span>
      <span style={{
        marginLeft: 8,
        fontSize: 9
      }}>slides</span>
    </span>
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: 6
    }}>
      {/* Undo / Redo */}
      <button onClick={onUndo} disabled={!canUndo} title="Undo (Cmd+Z)" style={{
        ...btnBase,
        opacity: canUndo ? 1 : 0.35,
        cursor: canUndo ? 'pointer' : 'not-allowed'
      }} onMouseEnter={e => {
        if (canUndo) {
          e.currentTarget.style.borderColor = COLOR.ochreOrange;
          e.currentTarget.style.color = COLOR.barkRust;
        }
      }} onMouseLeave={e => {
        e.currentTarget.style.borderColor = border;
        e.currentTarget.style.color = muted;
      }}>
        <span style={{
          fontSize: 14,
          lineHeight: 1
        }}>↩</span>
        <span>Undo</span>
      </button>
      <button onClick={onRedo} disabled={!canRedo} title="Redo (Cmd+Shift+Z)" style={{
        ...btnBase,
        opacity: canRedo ? 1 : 0.35,
        cursor: canRedo ? 'pointer' : 'not-allowed'
      }} onMouseEnter={e => {
        if (canRedo) {
          e.currentTarget.style.borderColor = COLOR.ochreOrange;
          e.currentTarget.style.color = COLOR.barkRust;
        }
      }} onMouseLeave={e => {
        e.currentTarget.style.borderColor = border;
        e.currentTarget.style.color = muted;
      }}>
        <span style={{
          fontSize: 14,
          lineHeight: 1
        }}>↪</span>
        <span>Redo</span>
      </button>
      <div style={{
        width: 1,
        height: 20,
        background: border,
        margin: '0 2px'
      }} />
      <button onClick={onAddSlide} style={{
        padding: '6px 12px',
        background: 'transparent',
        border: `1px solid ${isDark ? 'rgba(232,225,207,0.18)' : 'rgba(30,26,23,0.18)'}`,
        cursor: 'pointer',
        fontSize: 10,
        fontWeight: 600,
        color: muted
      }} onMouseEnter={e => {
        e.currentTarget.style.borderColor = COLOR.ochreOrange;
        e.currentTarget.style.color = COLOR.barkRust;
      }} onMouseLeave={e => {
        e.currentTarget.style.borderColor = isDark ? 'rgba(232,225,207,0.18)' : 'rgba(30,26,23,0.18)';
        e.currentTarget.style.color = muted;
      }}>+ Slide</button>
      {fmtBtns.map(fmt => <button key={`toolbar-${fmt}`} onClick={() => onExport(fmt)} style={{
        display: 'flex',
        alignItems: 'center',
        gap: 5,
        padding: '6px 14px',
        background: fmt === 'PDF' ? COLOR.ochreOrange : 'transparent',
        border: fmt === 'PDF' ? 'none' : `1px solid ${isDark ? 'rgba(232,225,207,0.18)' : 'rgba(30,26,23,0.18)'}`,
        cursor: 'pointer',
        fontSize: 10,
        fontWeight: 700,
        letterSpacing: '0.12em',
        textTransform: 'uppercase' as const,
        color: fmt === 'PDF' ? onColor(COLOR.ochreOrange) : muted
      }} onMouseEnter={e => {
        // The accent recipe: ochre fill with char black, pressing into ink on
        // hover. Dye plum is 2.37:1 as ink here, so the quiet variant uses the
        // accent ink instead.
        if (fmt === 'PDF') {
          e.currentTarget.style.background = COLOR.charBlack;
          e.currentTarget.style.color = COLOR.milletClay;
        } else {
          e.currentTarget.style.borderColor = COLOR.barkRust;
          e.currentTarget.style.color = COLOR.barkRust;
        }
      }} onMouseLeave={e => {
        if (fmt === 'PDF') e.currentTarget.style.color = onColor(COLOR.ochreOrange);
        if (fmt === 'PDF') e.currentTarget.style.background = COLOR.ochreOrange;else {
          e.currentTarget.style.borderColor = isDark ? 'rgba(232,225,207,0.18)' : 'rgba(30,26,23,0.18)';
          e.currentTarget.style.color = muted;
        }
      }}>
        <PixelDot color="currentColor" size={4} />
        <span>{fmt === 'PDF' ? 'Export PDF' : 'Export PPT'}</span>
      </button>)}
    </div>
  </div>;
};

// ─── Template Picker ──────────────────────────────────────────────────────────
const SlidePicker = ({
  isDark,
  onSelect,
  onResume,
  onBack
}: {
  isDark: boolean;
  onSelect: (templateId: string, deckTitle: string, slides: SlideEntry[]) => void;
  onResume?: () => void;
  onBack: () => void;
}) => {
  const bg = isDark ? COLOR.darkBg : COLOR.milletClay;
  const cardBg = isDark ? COLOR.darkCard : EDITOR_SURFACE.paperWarm;
  const border = isDark ? 'rgba(232,225,207,0.10)' : 'rgba(30,26,23,0.08)';
  const fg = isDark ? COLOR.milletClay : COLOR.charBlack;
  const muted = isDark ? 'rgba(232,225,207,0.55)' : 'rgba(30,26,23,0.66)';
  const templates = [{
    id: 'blank',
    label: 'Blank Presentation',
    desc: 'Start with a single empty slide',
    icon: '□',
    color: COLOR.barkRust,
    slideCount: 1
  }, {
    id: 'full-deck',
    label: 'Namibia AI Platform',
    desc: '15-slide concept deck — all slides from the Namibia AI Capability and Tooling Platform deck outline',
    icon: '▣',
    color: COLOR.dyePlum,
    slideCount: 15
  }];
  return <div style={{
    minHeight: '100vh',
    background: bg,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40
  }}>
    <div style={{
      maxWidth: 600,
      width: '100%'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        marginBottom: 48
      }}>
        <OngandaLogoMark size={24} />
        <div style={{
          flex: 1
        }}>
          <p style={{
            fontSize: 10,
            color: COLOR.dyePlum,
            fontWeight: 700,
            letterSpacing: '0.16em',
            textTransform: 'uppercase',
            margin: 0
          }}>Slide Editor</p>
          <h1 style={{
            fontSize: 24,
            fontWeight: 700,
            color: fg,
            margin: 0,
            letterSpacing: '-0.02em'
          }}>Choose a starting point</h1>
        </div>
        <button onClick={onBack} style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          background: 'transparent',
          border: `1px solid ${isDark ? 'rgba(232,225,207,0.15)' : 'rgba(30,26,23,0.15)'}`,
          cursor: 'pointer',
          color: muted,
          fontSize: 11,
          fontWeight: 500,
          padding: '6px 12px',
          flexShrink: 0
        }} onMouseEnter={e => {
          e.currentTarget.style.borderColor = COLOR.dyePlum;
          e.currentTarget.style.color = COLOR.dyePlum;
        }} onMouseLeave={e => {
          e.currentTarget.style.borderColor = isDark ? 'rgba(232,225,207,0.15)' : 'rgba(30,26,23,0.15)';
          e.currentTarget.style.color = muted;
        }}>
          <svg width="14" height="10" viewBox="0 0 7 5" fill="none" aria-hidden="true">
            <rect x="2" y="0" width="1" height="1" fill="currentColor" fillOpacity="0.7" />
            <rect x="1" y="1" width="1" height="1" fill="currentColor" fillOpacity="0.7" />
            <rect x="0" y="2" width="7" height="1" fill="currentColor" fillOpacity="0.9" />
            <rect x="1" y="3" width="1" height="1" fill="currentColor" fillOpacity="0.7" />
            <rect x="2" y="4" width="1" height="1" fill="currentColor" fillOpacity="0.7" />
          </svg>
          <span>Back</span>
        </button>
      </div>
      {onResume && <button onClick={onResume} style={{
        width: '100%',
        background: isDark ? 'rgba(232,225,207,0.04)' : 'rgba(255,255,255,0.55)',
        border: `1px solid ${COLOR.dyePlum}45`,
        color: fg,
        padding: '14px 16px',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 16,
        marginBottom: 16,
        textAlign: 'left'
      }}>
        <span style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 3
        }}>
          <strong style={{ fontSize: 12 }}>Resume last presentation</strong>
          <span style={{ fontSize: 10, color: muted }}>Continue the autosaved slide deck.</span>
        </span>
        <span style={{
          color: COLOR.dyePlum,
          fontSize: 9,
          fontWeight: 800,
          letterSpacing: '0.12em',
          textTransform: 'uppercase'
        }}>Open</span>
      </button>}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 16,
        marginBottom: 32
      }}>
        {templates.map(opt => {
          const slides = opt.id === 'blank' ? [{
            id: `slide-01-${Date.now()}`,
            tag: '01',
            title: 'New Slide',
            subtitle: 'Blank slide'
          }] : TEMPLATE_SLIDES;
          return <button key={opt.id} onClick={() => onSelect(opt.id, opt.id === 'blank' ? 'Untitled Presentation' : 'Namibia AI Capability and Tooling Platform', slides)} style={{
            background: cardBg,
            border: `1px solid ${border}`,
            padding: '28px 24px',
            cursor: 'pointer',
            textAlign: 'left',
            display: 'flex',
            flexDirection: 'column',
            gap: 12,
            transition: 'border-color 0.15s'
          }} onMouseEnter={e => {
            e.currentTarget.style.borderColor = `${opt.color}60`;
            e.currentTarget.style.background = isDark ? 'rgba(232,225,207,0.05)' : 'rgba(255,255,255,0.02)';
          }} onMouseLeave={e => {
            e.currentTarget.style.borderColor = border;
            e.currentTarget.style.background = cardBg;
          }}>
            <div style={{
              width: 48,
              height: 48,
              background: `${opt.color}14`,
              border: `1px solid ${opt.color}40`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 18,
              color: opt.color
            }}>{opt.icon}</div>
            <div>
              <p style={{
                fontSize: 14,
                fontWeight: 700,
                color: fg,
                margin: '0 0 4px'
              }}>{opt.label}</p>
              <p style={{
                fontSize: 11,
                color: muted,
                margin: 0,
                lineHeight: 1.5
              }}>{opt.desc}</p>
            </div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              marginTop: 4
            }}>
              <div style={{
                width: 20,
                height: 2,
                background: opt.color
              }} />
              <span style={{
                fontSize: 9,
                fontWeight: 700,
                color: opt.color,
                letterSpacing: '0.12em',
                textTransform: 'uppercase'
              }}>
                {opt.id === 'blank' ? 'Create' : `Open · ${opt.slideCount} slides`}
              </span>
            </div>
          </button>;
        })}
      </div>
      <DitherBar color={COLOR.dyePlum} segments={30} height={2} opacity={0.2} />
    </div>
  </div>;
};

const PrintDeck = ({
  isDark,
  slides,
  slideBlocks
}: {
  isDark: boolean;
  slides: SlideEntry[];
  slideBlocks: Record<string, DroppedBlock[]>;
}) => {
  const noop = () => {};
  const noopDrop = () => {};
  return <div data-onganda-print-deck className="onganda-print-deck" aria-hidden="true">
      {slides.map(slide => <div key={`print-${slide.id}`} className="onganda-print-slide">
        <SlideCanvas
          slideId={slide.id}
          isDark={isDark}
          droppedBlocks={(slideBlocks[slide.id] ?? []).map(block => ({
            ...block,
            selected: false,
            editingText: false,
            editingField: undefined
          }))}
          onDrop={noopDrop}
          onSelectBlock={noop}
          onDeleteBlock={noop}
          onUpdateBlock={noop}
          onDoubleClickBlock={noop}
          onMoveBlock={noopDrop}
          onUpdateSlideTitle={noopDrop}
          slides={slides}
        />
      </div>)}
    </div>;
};

// ─── Main Export ──────────────────────────────────────────────────────────────
export const SlideEditor = ({
  onClose
}: {
  onClose: () => void;
}) => {
  const {
    isDark
  } = useDark();

  // Session restore
  const savedSession = useMemo(() => loadSlideSession(), []);
  // Always land on the picker — a saved session surfaces there as "Resume"
  const [stage, setStage] = useState<'picker' | 'editor'>('picker');
  const [activeSlideId, setActiveSlideId] = useState<string>(savedSession?.activeSlideId ?? '');
  const [deckTitle, setDeckTitle] = useState(savedSession?.deckTitle ?? 'Untitled Presentation');
  const [activeCategory, setActiveCategory] = useState('Icons');
  const [exportModal, setExportModal] = useState<'PDF' | 'PPT' | null>(null);
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const [slideDragState, setSlideDragState] = useState<SlideDragState>({
    draggingId: null,
    overIdx: null
  });
  const [sessionSaved, setSessionSaved] = useState(false);
  const history = useSlideHistory({
    slides: savedSession?.slides ?? [],
    slideBlocks: savedSession?.slideBlocks ?? {},
    deckTitle: savedSession?.deckTitle ?? 'Untitled Presentation'
  });
  const {
    slides,
    slideBlocks
  } = history.current;

  // Helpers to push mutations into history
  const mutate = useCallback((updater: (snap: SlideHistorySnapshot) => SlideHistorySnapshot) => {
    history.push(updater(history.current));
  }, [history]);
  const setSlides = useCallback((updater: SlideEntry[] | ((prev: SlideEntry[]) => SlideEntry[])) => {
    mutate(snap => ({
      ...snap,
      slides: typeof updater === 'function' ? updater(snap.slides) : updater
    }));
  }, [mutate]);
  const setSlideBlocks = useCallback((updater: Record<string, DroppedBlock[]> | ((prev: Record<string, DroppedBlock[]>) => Record<string, DroppedBlock[]>)) => {
    mutate(snap => ({
      ...snap,
      slideBlocks: typeof updater === 'function' ? updater(snap.slideBlocks) : updater
    }));
  }, [mutate]);
  const currentBlocks: DroppedBlock[] = (activeSlideId ? slideBlocks[activeSlideId] : null) ?? [];
  const selectedBlock = currentBlocks.find(b => b.id === selectedBlockId) ?? null;

  const persistSession = useCallback(() => {
    if (stage !== 'editor') return;
    saveSlideSession({
      stage,
      slides,
      slideBlocks,
      deckTitle,
      activeSlideId
    });
  }, [activeSlideId, deckTitle, slideBlocks, slides, stage]);

  // Auto-save session (debounced)
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    if (stage !== 'editor') return;
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(() => {
      persistSession();
      setSessionSaved(true);
      setTimeout(() => setSessionSaved(false), 1800);
    }, 800);
    return () => {
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    };
  }, [persistSession, stage]);

  useEffect(() => {
    if (stage !== 'editor') return;
    const flush = () => persistSession();
    const flushOnVisibilityChange = () => {
      if (document.visibilityState === 'hidden') flush();
    };
    window.addEventListener('beforeunload', flush);
    window.addEventListener('pagehide', flush);
    document.addEventListener('visibilitychange', flushOnVisibilityChange);
    return () => {
      window.removeEventListener('beforeunload', flush);
      window.removeEventListener('pagehide', flush);
      document.removeEventListener('visibilitychange', flushOnVisibilityChange);
    };
  }, [persistSession, stage]);

  // Keyboard undo/redo
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      const mod = e.metaKey || e.ctrlKey;
      if (mod && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        history.undo();
      }
      if (mod && (e.key === 'y' || e.key === 'z' && e.shiftKey)) {
        e.preventDefault();
        history.redo();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [history]);
  const pageBg = isDark ? COLOR.darkBg : '#E8E1CF';
  const panelBg = isDark ? COLOR.darkCard : EDITOR_SURFACE.dustPanelDeep;
  const panelBorder = isDark ? 'rgba(232,225,207,0.08)' : 'rgba(30,26,23,0.10)';
  const fg = isDark ? COLOR.milletClay : COLOR.charBlack;
  const muted = isDark ? 'rgba(232,225,207,0.55)' : 'rgba(30,26,23,0.66)';
  const handlePickerSelect = (templateId: string, title: string, initialSlides: SlideEntry[]) => {
    const initialBlocks: Record<string, DroppedBlock[]> = {};
    if (templateId === 'full-deck') {
      for (const slide of initialSlides) {
        initialBlocks[slide.id] = TEMPLATE_SLIDE_BLOCKS[slide.id] ?? [];
      }
    }
    const snapshot: SlideHistorySnapshot = {
      slides: initialSlides,
      slideBlocks: initialBlocks,
      deckTitle: title
    };
    history.reset(snapshot);
    setDeckTitle(title);
    setActiveSlideId(initialSlides[0]?.id ?? '');
    setStage('editor');
    saveSlideSession({
      stage: 'editor',
      slides: initialSlides,
      slideBlocks: initialBlocks,
      deckTitle: title,
      activeSlideId: initialSlides[0]?.id ?? ''
    });
  };
  const handleResume = useCallback(() => {
    if (!savedSession) return;
    const snapshot: SlideHistorySnapshot = {
      slides: savedSession.slides ?? [],
      slideBlocks: savedSession.slideBlocks ?? {},
      deckTitle: savedSession.deckTitle ?? 'Untitled Presentation'
    };
    history.reset(snapshot);
    setDeckTitle(snapshot.deckTitle);
    setActiveSlideId(savedSession.activeSlideId || snapshot.slides[0]?.id || '');
    setSelectedBlockId(null);
    setStage('editor');
  }, [history, savedSession]);
  const handleAddSlide = () => {
    const num = String(slides.length + 1).padStart(2, '0');
    const newSlide: SlideEntry = {
      id: `slide-${num}-${Date.now()}`,
      tag: num,
      title: 'New Slide',
      subtitle: 'Blank slide'
    };
    setSlides(prev => [...prev, newSlide]);
    setActiveSlideId(newSlide.id);
  };
  const handleDrop = useCallback((type: string, label: string, x: number, y: number) => {
    const id = `block-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    const phIdx = type.startsWith('timeline-') ? parseInt(type.replace('timeline-', ''), 10) : undefined;
    const sysIdx = type.startsWith('sys-card-') ? parseInt(type.replace('sys-card-', ''), 10) : undefined;
    const fnIdx = type.startsWith('flow-node-') ? parseInt(type.replace('flow-node-', ''), 10) : undefined;
    const faIdx = type.startsWith('field-') ? parseInt(type.replace('field-', ''), 10) : undefined;
    const tIdx = type.startsWith('terminal-') ? parseInt(type.replace('terminal-', ''), 10) : undefined;
    const statDefs: Record<string, {
      v: string;
      l: string;
      h: string;
    }> = {
      'stat-systems': {
        v: '5',
        l: 'Active Systems',
        h: COLOR.ochreOrange
      },
      'stat-models': {
        v: '3',
        l: 'Language Models',
        h: COLOR.barkRust
      },
      'stat-pilots': {
        v: '12',
        l: 'Sector Pilots',
        h: COLOR.mahanguGold
      },
      'stat-lab': {
        v: '1',
        l: 'Sovereign Lab',
        h: COLOR.mopaneBrown
      }
    };
    const sd = statDefs[type];
    setSlideBlocks(prev => ({
      ...prev,
      [activeSlideId]: [...(prev[activeSlideId] ?? []).map(b => ({
        ...b,
        selected: false
      })), {
        id,
        type,
        label,
        x,
        y,
        selected: true,
        editingText: false,
        statValue: sd ? sd.v : type === 'stat-custom' ? '0' : undefined,
        statLabel: sd ? sd.l : type === 'stat-custom' ? 'Metric' : undefined,
        statHex: sd ? sd.h : type === 'stat-custom' ? COLOR.dyePlum : undefined,
        textContent: undefined,
        timelineIdx: phIdx,
        systemIdx: sysIdx,
        flowNodeIdx: fnIdx,
        sectorAppIdx: faIdx,
        terminalIdx: tIdx
      }]
    }));
    setSelectedBlockId(id);
  }, [activeSlideId, setSlideBlocks]);
  const handleSelectBlock = useCallback((id: string) => {
    setSlideBlocks(prev => ({
      ...prev,
      [activeSlideId]: (prev[activeSlideId] ?? []).map(b => ({
        ...b,
        selected: b.id === id,
        editingText: b.id === id ? b.editingText : false
      }))
    }));
    setSelectedBlockId(id);
  }, [activeSlideId, setSlideBlocks]);
  const handleDoubleClickBlock = useCallback((id: string) => {
    setSlideBlocks(prev => ({
      ...prev,
      [activeSlideId]: (prev[activeSlideId] ?? []).map(b => {
        if (b.id !== id) return {
          ...b,
          selected: false,
          editingText: false,
          editingField: undefined
        };
        const isTextType = ['text-headline', 'text-body', 'text-quote', 'text-label'].includes(b.type);
        const isSysCard = b.type.startsWith('sys-card-');
        const isTimeline = b.type.startsWith('timeline-');
        const isFlowNode = b.type.startsWith('flow-node-');
        const isFieldApp = b.type.startsWith('field-');
        return {
          ...b,
          selected: true,
          editingText: isTextType,
          editingField: isSysCard ? 'name' : isTimeline ? 'phaseName' : isFlowNode ? 'name' : isFieldApp ? 'appName' : undefined
        };
      })
    }));
    setSelectedBlockId(id);
  }, [activeSlideId, setSlideBlocks]);
  const handleDeleteBlock = useCallback((id: string) => {
    setSlideBlocks(prev => ({
      ...prev,
      [activeSlideId]: (prev[activeSlideId] ?? []).filter(b => b.id !== id)
    }));
    setSelectedBlockId(null);
  }, [activeSlideId, setSlideBlocks]);
  const handleUpdateBlock = useCallback((id: string, updates: Partial<DroppedBlock>) => {
    setSlideBlocks(prev => ({
      ...prev,
      [activeSlideId]: (prev[activeSlideId] ?? []).map(b => b.id === id ? {
        ...b,
        ...updates
      } : b)
    }));
  }, [activeSlideId, setSlideBlocks]);
  const handleMoveBlock = useCallback((id: string, x: number, y: number) => {
    // Move is high-frequency during drag — update WITHOUT pushing to undo history
    mutate(snap => ({
      ...snap,
      slideBlocks: {
        ...snap.slideBlocks,
        [activeSlideId]: (snap.slideBlocks[activeSlideId] ?? []).map(b => b.id === id ? {
          ...b,
          x,
          y
        } : b)
      }
    }));
  }, [activeSlideId, mutate]);
  const handleCanvasClick = () => {
    setSlideBlocks(prev => ({
      ...prev,
      [activeSlideId]: (prev[activeSlideId] ?? []).map(b => ({
        ...b,
        selected: false,
        editingText: false,
        editingField: undefined
      }))
    }));
    setSelectedBlockId(null);
  };
  const handleSlideDragStart = useCallback((slideId: string) => {
    setSlideDragState({
      draggingId: slideId,
      overIdx: null
    });
  }, []);
  const handleSlideDragOver = useCallback((overIdx: number) => {
    setSlideDragState(prev => ({
      ...prev,
      overIdx
    }));
  }, []);
  const handleSlideDragEnd = useCallback(() => {
    setSlideDragState(prev => {
      if (prev.draggingId && prev.overIdx !== null) {
        setSlides(prevSlides => {
          const fromIdx = prevSlides.findIndex(s => s.id === prev.draggingId);
          if (fromIdx < 0 || fromIdx === prev.overIdx) return prevSlides;
          const next = [...prevSlides];
          const [moved] = next.splice(fromIdx, 1);
          next.splice(prev.overIdx!, 0, moved);
          return next;
        });
      }
      return {
        draggingId: null,
        overIdx: null
      };
    });
  }, [setSlides]);
  const handleGenerateExport = useCallback((format: DeckExportPayload['format']) => {
    setSelectedBlockId(null);
    setExportModal(null);
    setSlideBlocks(prev => ({
      ...prev,
      [activeSlideId]: (prev[activeSlideId] ?? []).map(block => ({
        ...block,
        selected: false,
        editingText: false,
        editingField: undefined
      }))
    }));
    if (format === 'PDF') {
      window.requestAnimationFrame(() => window.requestAnimationFrame(() => {
        window.setTimeout(() => window.print(), 160);
      }));
      return;
    }
    // Real .pptx via pptxgenjs — native editable text, shapes, and charts.
    // Dynamically imported so the library stays out of the editor bundle.
    import('./onganda-pptx-export').then(({ exportDeckToPptx }) =>
      exportDeckToPptx(deckTitle, slides, slideBlocks, `${safeFileName(deckTitle)}.pptx`)
    ).catch(() => {
      // Fallback: legacy HTML-based .ppt so the user still gets a file
      const deckHtml = document.querySelector('[data-onganda-print-deck]')?.innerHTML ?? '';
      downloadOfficeHtml(`${safeFileName(deckTitle)}.ppt`, wrapPowerPointDeck(deckTitle, deckHtml), 'application/vnd.ms-powerpoint;charset=utf-8');
    });
  }, [activeSlideId, deckTitle, setSlideBlocks, slides, slideBlocks]);
  const handleApplyAiResult = useCallback((result: AiAuthoringResult) => {
    const generatedSlides: SlideEntry[] = (result.slides ?? []).map((slide, idx) => ({
      id: `ai-deck-${Date.now()}-${idx}`,
      tag: String(idx + 1).padStart(2, '0'),
      title: slide.title,
      subtitle: slide.subtitle
    }));
    if (!generatedSlides.length) return;
    const generatedBlocks = generatedSlides.reduce<Record<string, DroppedBlock[]>>((acc, slide, idx) => {
      acc[slide.id] = (result.slides?.[idx]?.blocks ?? []).map((block, blockIdx) => aiSlideBlock(block, idx, blockIdx));
      return acc;
    }, {});
    const snapshot: SlideHistorySnapshot = {
      slides: generatedSlides,
      slideBlocks: generatedBlocks,
      deckTitle: result.title
    };
    history.reset(snapshot);
    setDeckTitle(result.title);
    setActiveSlideId(generatedSlides[0].id);
    setSelectedBlockId(null);
  }, [history]);
  if (stage === 'picker') {
    return <SlidePicker isDark={isDark} onSelect={handlePickerSelect} onResume={savedSession ? handleResume : undefined} onBack={onClose} />;
  }
  const activeIdx = slides.findIndex(s => s.id === activeSlideId);
  return <div style={{
    height: '100vh',
    width: '100%',
    maxWidth: '100vw',
    background: pageBg,
    display: 'flex',
    flexDirection: 'column',
    transition: 'background 0.35s',
    overflow: 'hidden'
  }}>
    <style>{`
      .onganda-print-deck { display: none; }
      @media print {
        @page { size: 13.333in 7.5in; margin: 0; }
        html, body {
          width: 13.333in;
          height: 7.5in;
          margin: 0 !important;
          background: ${COLOR.charBlack} !important;
          print-color-adjust: exact;
          -webkit-print-color-adjust: exact;
        }
        body * { visibility: hidden !important; }
        [data-onganda-print-deck], [data-onganda-print-deck] * { visibility: visible !important; }
        [data-onganda-print-deck] {
          display: block !important;
          position: absolute !important;
          left: 0 !important;
          top: 0 !important;
          width: 100% !important;
          background: ${COLOR.charBlack} !important;
        }
        .onganda-print-slide {
          display: block !important;
          width: 13.333in !important;
          height: 7.5in !important;
          page-break-after: always;
          break-after: page;
          overflow: hidden !important;
          print-color-adjust: exact;
          -webkit-print-color-adjust: exact;
        }
        .onganda-print-slide button,
        .onganda-print-slide input,
        .onganda-print-slide textarea {
          display: none !important;
          visibility: hidden !important;
        }
      }
    `}</style>
    <PrintDeck isDark={isDark} slides={slides} slideBlocks={slideBlocks} />
    <EditorToolbar isDark={isDark} activeSlide={activeSlideId} slides={slides} deckTitle={deckTitle} onDeckTitleChange={t => {
      setDeckTitle(t);
      mutate(snap => ({
        ...snap,
        deckTitle: t
      }));
    }} onClose={onClose} onExport={fmt => setExportModal(fmt)} onAddSlide={handleAddSlide} canUndo={history.canUndo} canRedo={history.canRedo} onUndo={history.undo} onRedo={history.redo} sessionSaved={sessionSaved} />
    <div style={{
      display: 'flex',
      flex: 1,
      minHeight: 0,
      overflow: 'hidden'
    }}>
      {/* Left: slide list */}
      <div style={{
        width: 180,
        flexShrink: 0,
        background: panelBg,
        borderRight: `1px solid ${panelBorder}`,
        overflowY: 'auto',
        padding: '12px 0'
      }}>
        <div style={{
          padding: '0 14px 10px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6
          }}>
            <PixelDot color={muted} size={4} />
            <span style={{
              fontSize: 9,
              fontWeight: 700,
              letterSpacing: '0.16em',
              color: muted,
              textTransform: 'uppercase' as const
            }}>Slides</span>
          </div>
          <span style={{
            fontSize: 9,
            color: muted
          }}>{slides.length}</span>
        </div>
        {slides.map((slide, idx) => <SlideThumbnail key={slide.id} slide={slide} isActive={slide.id === activeSlideId} isDark={isDark} onClick={() => {
          setActiveSlideId(slide.id);
          setSelectedBlockId(null);
        }} onDragStart={() => handleSlideDragStart(slide.id)} onDragOver={() => handleSlideDragOver(idx)} onDragEnd={handleSlideDragEnd} isDragging={slideDragState.draggingId === slide.id} isDragOver={slideDragState.overIdx === idx && slideDragState.draggingId !== slide.id} />)}
        <div style={{
          padding: '10px 14px'
        }}>
          <button onClick={handleAddSlide} style={{
            width: '100%',
            padding: '7px',
            background: 'transparent',
            border: `1px dashed ${panelBorder}`,
            cursor: 'pointer',
            fontSize: 9,
            fontWeight: 600,
            color: muted,
            textAlign: 'center'
          }} onMouseEnter={e => {
            e.currentTarget.style.borderColor = COLOR.ochreOrange;
            e.currentTarget.style.color = COLOR.barkRust;
          }} onMouseLeave={e => {
            e.currentTarget.style.borderColor = panelBorder;
            e.currentTarget.style.color = muted;
          }}>+ New Slide</button>
        </div>
      </div>

      {/* Center: component panel + canvas */}
      <div style={{
        flex: 1,
        display: 'flex',
        minWidth: 0,
        overflow: 'hidden'
      }}>
        <ComponentPanel isDark={isDark} activeCategory={activeCategory} onCategoryChange={setActiveCategory} />
        <div style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px 28px',
          overflowY: 'auto',
          background: isDark ? EDITOR_SURFACE.canvasWellDark : EDITOR_SURFACE.dustWell
        }} onClick={handleCanvasClick}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            marginBottom: 12,
            width: '100%',
            maxWidth: 900
          }}>
            <span style={{
              fontSize: 9,
              color: muted,
              letterSpacing: '0.12em',
              textTransform: 'uppercase' as const,
              fontWeight: 600
            }}>{`Slide ${activeIdx + 1} of ${slides.length}`}</span>
            <div style={{
              flex: 1,
              height: 1,
              background: isDark ? 'rgba(232,225,207,0.06)' : 'rgba(30,26,23,0.08)'
            }} />
            <span style={{
              fontSize: 9,
              color: muted
            }}>{currentBlocks.length} component{currentBlocks.length !== 1 ? 's' : ''} placed</span>
          </div>
          <AnimatePresence mode="wait">
            <motion.div key={`canvas-${activeSlideId}`} initial={{
              opacity: 0,
              scale: 0.96,
              y: 10
            }} animate={{
              opacity: 1,
              scale: 1,
              y: 0
            }} exit={{
              opacity: 0,
              scale: 0.96
            }} transition={{
              duration: 0.2
            }} style={{
              width: '100%',
              maxWidth: 900
            }} onClick={e => e.stopPropagation()}>
              <SlideCanvas slideId={activeSlideId} isDark={isDark} droppedBlocks={currentBlocks} onDrop={handleDrop} onSelectBlock={handleSelectBlock} onDeleteBlock={handleDeleteBlock} onUpdateBlock={handleUpdateBlock} onDoubleClickBlock={handleDoubleClickBlock} onMoveBlock={handleMoveBlock} slides={slides} onUpdateSlideTitle={(slideId, title) => {
                setSlides(prev => prev.map(s => s.id === slideId ? {
                  ...s,
                  customTitle: title
                } : s));
              }} />
            </motion.div>
          </AnimatePresence>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            marginTop: 18
          }}>
            <button onClick={() => {
              const prev = slides[activeIdx - 1];
              if (prev) {
                setActiveSlideId(prev.id);
                setSelectedBlockId(null);
              }
            }} disabled={activeIdx === 0} style={{
              padding: '7px 18px',
              background: 'transparent',
              border: `1px solid ${panelBorder}`,
              cursor: activeIdx === 0 ? 'not-allowed' : 'pointer',
              fontSize: 11,
              fontWeight: 500,
              color: activeIdx === 0 ? muted : fg,
              opacity: activeIdx === 0 ? 0.4 : 1
            }}>← Prev</button>
            <span style={{
              fontSize: 11,
              color: muted,
              minWidth: 56,
              textAlign: 'center'
            }}>{`Slide ${activeIdx + 1} of ${slides.length}`}</span>
            <button onClick={() => {
              const next = slides[activeIdx + 1];
              if (next) {
                setActiveSlideId(next.id);
                setSelectedBlockId(null);
              }
            }} disabled={activeIdx === slides.length - 1} style={{
              padding: '7px 18px',
              background: activeIdx < slides.length - 1 ? COLOR.ochreOrange : 'transparent',
              border: `1px solid ${activeIdx < slides.length - 1 ? COLOR.ochreOrange : panelBorder}`,
              cursor: activeIdx === slides.length - 1 ? 'not-allowed' : 'pointer',
              fontSize: 11,
              fontWeight: 600,
              color: activeIdx < slides.length - 1 ? COLOR.milletClay : muted,
              opacity: activeIdx === slides.length - 1 ? 0.4 : 1
            }}>Next →</button>
          </div>
        </div>
      </div>

      {/* Right: inspector */}
      <AiAuthoringPanel mode="deck" isDark={isDark} onApply={handleApplyAiResult} />
      <SlideInspector isDark={isDark} selectedBlock={selectedBlock} onUpdateBlock={handleUpdateBlock} onDeleteBlock={handleDeleteBlock} activeSlide={slides.find(s => s.id === activeSlideId) ?? null} onUpdateSlideTitle={(slideId, title) => {
        setSlides(prev => prev.map(s => s.id === slideId ? {
          ...s,
          customTitle: title
        } : s));
      }} />
    </div>
    <AnimatePresence>
      {exportModal && <ExportModal isDark={isDark} format={exportModal} slideCount={slides.length} deckTitle={deckTitle} onGenerate={() => handleGenerateExport(exportModal)} onClose={() => setExportModal(null)} />}
    </AnimatePresence>
  </div>;
};
