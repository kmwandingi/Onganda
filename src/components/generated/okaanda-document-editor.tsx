// ─── Okaanda Document Editor — Full Editing Shell ─────────────────────────────
// Block-based document editor: click any block to select, drag to reorder,
// double-click text to edit inline. All design-system components insertable,
// configurable, deletable. "New Document" = blank canvas, templates pre-filled.

import React, { useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { COLOR, STATS, TERMINAL_BLOCKS, TIMELINE_PHASES, SYSTEMS, HEATMAP_CELLS, HEATMAP_LABELS_X, HEATMAP_LABELS_Y, FLOW_NODES } from './okaanda-tokens';
import { OkaandaLogoMark, PixelDot, DitherBar, PixelTag, WeaveOverlay, useDark, IconOkaanda, IconOshini, IconOmbiga, IconEtiti, IconOshitoo, FlowNodeIcon } from './okaanda-primitives';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';

// ─── Types ────────────────────────────────────────────────────────────────────
type DocBlockType = 'heading' | 'body' | 'pullquote' | 'divider' | 'callout' | 'list' | 'signature' | 'stat' | 'terminal' | 'heatmap' | 'timeline' | 'systemcard' | 'flowchart' | 'principles' | 'swatchrow' | 'chart-market' | 'chart-bar';
interface DocBlock {
  id: string;
  type: DocBlockType;
  content: string;
  statValue?: string;
  statLabel?: string;
  statSub?: string;
  statHex?: string;
  timelinePhaseIdx?: number;
  systemIdx?: number;
  flowNodeIdx?: number;
  terminalIdx?: number;
  // For chart-market editable labels
  chartTitle?: string;
  // For chart-market editable data points
  marketData?: string; // JSON stringified [{year,value}]
  // For chart-bar editable values
  barValues?: string; // JSON stringified array of {name,progress}
  // For heatmap editable intensities
  heatmapData?: string; // JSON stringified [{row,col,intensity}]
  // For principles editable entries
  principlesData?: string; // JSON stringified [{label,value}]
  // For swatch row editable entries
  swatchData?: string; // JSON stringified [{name,hex}]
}
interface InsertPaletteItem {
  id: string;
  label: string;
  desc: string;
  type: DocBlockType;
  defaultContent: string;
  hex: string;
  category: string;
}

// ─── Insert palette ───────────────────────────────────────────────────────────
const INSERT_PALETTE: InsertPaletteItem[] = [{
  id: 'insert-heading',
  label: 'Section Heading',
  desc: 'Named section with dashed rule',
  type: 'heading',
  defaultContent: 'New Section',
  hex: COLOR.ochreOrange,
  category: 'Text'
}, {
  id: 'insert-body',
  label: 'Body Paragraph',
  desc: 'Editorial body text in Georgia',
  type: 'body',
  defaultContent: 'Start writing here…',
  hex: COLOR.charBlack,
  category: 'Text'
}, {
  id: 'insert-pullquote',
  label: 'Pull Quote',
  desc: 'Highlighted branded quotation',
  type: 'pullquote',
  defaultContent: 'Build domestic AI capability first.',
  hex: COLOR.ochreOrange,
  category: 'Text'
}, {
  id: 'insert-callout',
  label: 'Callout Box',
  desc: 'Accented info or note block',
  type: 'callout',
  defaultContent: 'Note: Key finding.',
  hex: COLOR.firedRed,
  category: 'Text'
}, {
  id: 'insert-list',
  label: 'Bullet List',
  desc: 'Pixel-dot list items',
  type: 'list',
  defaultContent: 'First item · Second item · Third item',
  hex: COLOR.ochreOrange,
  category: 'Text'
}, {
  id: 'insert-divider',
  label: 'Section Divider',
  desc: 'Dither bar visual separator',
  type: 'divider',
  defaultContent: '',
  hex: COLOR.ochreOrange,
  category: 'Text'
}, {
  id: 'insert-signature',
  label: 'Signature Block',
  desc: 'Author attribution footer',
  type: 'signature',
  defaultContent: 'Okaanda · Namibia AI Systems Lab · 2025',
  hex: COLOR.mopaneBrown,
  category: 'Text'
}, {
  id: 'insert-stat',
  label: 'Stat Card',
  desc: 'Editable KPI / metric card',
  type: 'stat',
  defaultContent: 'New Metric',
  hex: COLOR.ochreOrange,
  category: 'Data'
}, {
  id: 'insert-chart-market',
  label: 'Market Chart',
  desc: 'AI market growth area chart',
  type: 'chart-market',
  defaultContent: 'Market Growth',
  hex: COLOR.ochreOrange,
  category: 'Data'
}, {
  id: 'insert-chart-bar',
  label: 'Bar Chart',
  desc: 'System progress bar chart',
  type: 'chart-bar',
  defaultContent: 'System Progress',
  hex: COLOR.barkRust,
  category: 'Data'
}, {
  id: 'insert-heatmap',
  label: 'Research Heatmap',
  desc: 'Activity heatmap across systems',
  type: 'heatmap',
  defaultContent: 'Research Activity',
  hex: COLOR.firedRed,
  category: 'Data'
}, {
  id: 'insert-terminal',
  label: 'Code Terminal',
  desc: 'Syntax-highlighted terminal block',
  type: 'terminal',
  defaultContent: 'Oshini Pipeline',
  hex: COLOR.barkRust,
  category: 'System'
}, {
  id: 'insert-timeline',
  label: 'Roadmap Phase',
  desc: 'Single roadmap timeline phase',
  type: 'timeline',
  defaultContent: 'Foundation Phase',
  hex: COLOR.ochreOrange,
  category: 'System'
}, {
  id: 'insert-systemcard',
  label: 'System Card',
  desc: 'One of the five named systems',
  type: 'systemcard',
  defaultContent: 'Okaanda',
  hex: COLOR.ochreOrange,
  category: 'System'
}, {
  id: 'insert-flowchart',
  label: 'Flow Node',
  desc: 'Pixel flowchart node card',
  type: 'flowchart',
  defaultContent: 'Granary',
  hex: COLOR.ochreOrange,
  category: 'System'
}, {
  id: 'insert-principles',
  label: 'Principles Table',
  desc: 'Brand principles definition list',
  type: 'principles',
  defaultContent: 'Brand Principles',
  hex: COLOR.charBlack,
  category: 'System'
}, {
  id: 'insert-swatchrow',
  label: 'Swatch Row',
  desc: 'Material colour palette strip',
  type: 'swatchrow',
  defaultContent: 'Material Palette',
  hex: COLOR.mahanguGold,
  category: 'System'
}];
const PALETTE_CATEGORIES = ['Text', 'Data', 'System'];

// ─── Chart Data ───────────────────────────────────────────────────────────────
const DEFAULT_AI_MARKET_DATA = [{
  year: '2023',
  value: 189
}, {
  year: '2026',
  value: 1100
}, {
  year: '2030',
  value: 2900
}, {
  year: '2033',
  value: 4800
}];
const DEFAULT_BAR_DATA = [{
  name: 'Okaanda',
  progress: 100
}, {
  name: 'Oshini',
  progress: 78
}, {
  name: 'Ombiga',
  progress: 34
}, {
  name: 'Etiti',
  progress: 12
}, {
  name: 'Oshitoo',
  progress: 0
}];

// ─── Template Blocks ──────────────────────────────────────────────────────────
const TEMPLATE_BLOCKS: DocBlock[] = [{
  id: 'b-title-heading',
  type: 'heading',
  content: 'A Namibia-Focused AI Capability and Tooling Platform'
}, {
  id: 'b-subtitle-body',
  type: 'body',
  content: 'A two-track model for local AI capability, applied tooling, and institutional deployment.'
}, {
  id: 'b-div0',
  type: 'divider',
  content: ''
}, {
  id: 'b-ctx',
  type: 'heading',
  content: 'Context'
}, {
  id: 'b-ctx-body',
  type: 'body',
  content: 'Artificial intelligence is becoming a major commercial and strategic layer of the digital economy. UNCTAD projects the global AI market to grow from $189 billion in 2023 to $4.8 trillion by 2033. McKinsey estimates that generative AI could unlock $61 billion to $103 billion annually across Africa. Namibia is therefore entering a period in which AI-driven software, cloud services, workflow tools, and sector applications will increasingly shape how institutions operate and where digital spending flows.'
}, {
  id: 'b-ctx-body2',
  type: 'body',
  content: 'Namibia already has relevant institutional movement. NCRST and UNESCO have completed the country\'s AI Readiness Assessment. NUST launched the Bank of Namibia-funded Artificial Intelligence and Robotics Accelerator in November 2024. UNAM\'s Namibia Green Hydrogen Research Institute provides a local template for a university-industry-government institute that combines research, infrastructure, incubation, and commercialization. Together, these developments show that the country has policy momentum, early institutional capacity, and a credible foundation for an applied AI platform.'
}, {
  id: 'b-chart-mkt',
  type: 'chart-market',
  content: 'Market Growth',
  chartTitle: 'Global AI Market Growth (USD Billions)'
}, {
  id: 'b-stat-africa',
  type: 'stat',
  content: 'Africa AI Opportunity',
  statValue: '$103B',
  statLabel: 'Africa Generative AI Potential',
  statSub: 'annually — McKinsey estimate',
  statHex: COLOR.ochreOrange
}, {
  id: 'b-div1',
  type: 'divider',
  content: ''
}, {
  id: 'b-model',
  type: 'heading',
  content: 'Operating Model'
}, {
  id: 'b-model-body',
  type: 'body',
  content: 'The platform is organized around two linked tracks. The first track is capability. This includes open-source model selection, fine-tuning, steering, evaluation, distillation, compression, local datasets, language and context tuning, and efficient deployment methods. The purpose of this track is to build a reusable AI systems base that fits Namibian operating conditions and produces domestic technical competence.'
}, {
  id: 'b-model-body2',
  type: 'body',
  content: 'The second track is tooling and deployment. This includes document intelligence, workflow assistants, knowledge systems, onboarding and training tools, planning systems, decision-support tools, and sector applications for government, NGOs, utilities, schools, hospitals, and firms. The purpose of this track is to convert technical capability into institutional use, operational value, and local commercial activity.'
}, {
  id: 'b-quote1',
  type: 'pullquote',
  content: 'Build the tools locally. Keep the contracts local. Train local talent.'
}, {
  id: 'b-model-body3',
  type: 'body',
  content: 'This sequencing has a strong external analogue. Mistral AI was founded in April 2023 and established technical credibility early through Mistral 7B in September 2023, added a platform layer through La Plateforme in December 2023, and later expanded into enterprise products and infrastructure. The relevant lesson is the order of moves: capability first, visible proof points second, platformization and broader deployment after that.'
}, {
  id: 'b-div2',
  type: 'divider',
  content: ''
}, {
  id: 'b-prob',
  type: 'heading',
  content: 'Problem Areas Addressed'
}, {
  id: 'b-prob-call',
  type: 'callout',
  content: 'UNESCO\'s Namibia AI Readiness Assessment identifies: absence of a formal AI regulatory framework · Data Protection Bill needs finalization · Limited electricity access in rural areas · Gaps in AI-related skills · Shortage of AI training data in Indigenous languages.'
}, {
  id: 'b-prob-body',
  type: 'body',
  content: 'The platform also addresses outward digital-spend leakage. IMF work using Namibian card data estimates that total digital-services imports rose from $34.4 million in 2020 to $111.2 million in 2024. Within that, software, cloud, and storage services rose from $4.7 million to $9.8 million, and applications from $3.2 million to $8.0 million. As AI is embedded into software and cloud products, a growing share of Namibia\'s digital expenditure will move through these channels. A local AI capability-and-tooling layer creates a basis for retaining part of that value through local systems, integrations, contracts, and products.'
}, {
  id: 'b-stat-imports',
  type: 'stat',
  content: 'Digital Import Growth',
  statValue: '$111.2M',
  statLabel: 'Digital-Services Imports',
  statSub: '2024 — up from $34.4M in 2020',
  statHex: COLOR.firedRed
}, {
  id: 'b-chart-bar',
  type: 'chart-bar',
  content: 'System Progress',
  barValues: JSON.stringify([{
    name: 'Software/Cloud',
    progress: 100
  }, {
    name: 'Applications',
    progress: 80
  }, {
    name: 'Other Digital',
    progress: 60
  }])
}, {
  id: 'b-labour-body',
  type: 'body',
  content: 'The labour-market case is equally important. Namibia\'s official unemployment rate reached 36.9% in 2023, and NDP6 targets an increase in the graduate employment rate from 66% to 74% by 2030. In this context, the platform contributes in two ways: through its own high-skill delivery work, and through the development of tools that help firms, public institutions, and NGOs onboard and train graduates faster into productive work.'
}, {
  id: 'b-stat-unemployment',
  type: 'stat',
  content: 'Unemployment',
  statValue: '36.9%',
  statLabel: 'Namibia Unemployment Rate',
  statSub: '2023 official rate',
  statHex: COLOR.barkRust
}, {
  id: 'b-div3',
  type: 'divider',
  content: ''
}, {
  id: 'b-delivery',
  type: 'heading',
  content: 'Delivery Sequence'
}, {
  id: 'b-delivery-list',
  type: 'list',
  content: 'Phase 1 — Core team, partner base, compute plan, and technical doctrine · Phase 2 — Model registry, evaluation harness, fine-tuning workflows, steering methods, distillation paths, deployment recipes, and domain datasets · Phase 3 — Tuned model families, benchmark results, local-language and local-domain systems, and demonstrator tools · Phase 4 — Repeatable modules and institutional deployments · Phase 5 — Paid pilots, public-sector and NGO deployments, enterprise contracts, training, and later spinouts'
}, {
  id: 'b-timeline1',
  type: 'timeline',
  content: 'Foundation Phase',
  timelinePhaseIdx: 0
}, {
  id: 'b-timeline2',
  type: 'timeline',
  content: 'Adaptation Phase',
  timelinePhaseIdx: 1
}, {
  id: 'b-heatmap',
  type: 'heatmap',
  content: 'Research Activity'
}, {
  id: 'b-div4',
  type: 'divider',
  content: ''
}, {
  id: 'b-sysarch',
  type: 'heading',
  content: 'System Architecture'
}, {
  id: 'b-sysarch-body',
  type: 'body',
  content: 'The platform is organized into five named systems, each corresponding to a layer of the capability and tooling stack.'
}, {
  id: 'b-sys0',
  type: 'systemcard',
  content: 'Okaanda',
  systemIdx: 0
}, {
  id: 'b-sys1',
  type: 'systemcard',
  content: 'Oshini',
  systemIdx: 1
}, {
  id: 'b-sys2',
  type: 'systemcard',
  content: 'Ombiga',
  systemIdx: 2
}, {
  id: 'b-sys3',
  type: 'systemcard',
  content: 'Etiti',
  systemIdx: 3
}, {
  id: 'b-sys4',
  type: 'systemcard',
  content: 'Oshitoo',
  systemIdx: 4
}, {
  id: 'b-flow1',
  type: 'flowchart',
  content: 'Granary Node',
  flowNodeIdx: 1
}, {
  id: 'b-terminal1',
  type: 'terminal',
  content: 'Oshini Pipeline',
  terminalIdx: 0
}, {
  id: 'b-div5',
  type: 'divider',
  content: ''
}, {
  id: 'b-principles',
  type: 'principles',
  content: 'Brand Principles'
}, {
  id: 'b-swatches',
  type: 'swatchrow',
  content: 'Material Palette'
}, {
  id: 'b-div6',
  type: 'divider',
  content: ''
}, {
  id: 'b-prop',
  type: 'heading',
  content: 'Core Proposition'
}, {
  id: 'b-prop-body',
  type: 'body',
  content: 'The platform creates a domestic AI capability base, a local tooling layer, and a practical route from research into deployment. Its value lies in converting Namibian demand for AI-enabled systems into Namibian capability, Namibian tools, and Namibian institutional learning.'
}, {
  id: 'b-prop-quote',
  type: 'pullquote',
  content: 'A local capability layer turns AI demand into local systems, local expertise, and local value.'
}, {
  id: 'b-sig',
  type: 'signature',
  content: 'Okaanda · Namibia AI Systems Lab · 2025'
}];

// ─── Drag reorder state ───────────────────────────────────────────────────────
interface DragState {
  draggingId: string | null;
  overIdx: number | null;
}

// ─── Inline text area ────────────────────────────────────────────────────────
const InlineTextArea = ({
  value,
  onChange,
  onBlur,
  style
}: {
  value: string;
  onChange: (v: string) => void;
  onBlur: () => void;
  style: React.CSSProperties;
}) => {
  const ref = useRef<HTMLTextAreaElement>(null);
  useEffect(() => {
    ref.current?.focus();
    ref.current?.select();
  }, []);
  return <textarea ref={ref} value={value} onChange={e => onChange(e.target.value)} onBlur={onBlur} onKeyDown={e => {
    if (e.key === 'Escape') onBlur();
  }} style={{
    ...style,
    resize: 'vertical'
  }} />;
};
const InlineInput = ({
  value,
  onChange,
  onBlur,
  style
}: {
  value: string;
  onChange: (v: string) => void;
  onBlur: () => void;
  style: React.CSSProperties;
}) => {
  const ref = useRef<HTMLInputElement>(null);
  useEffect(() => {
    ref.current?.focus();
    ref.current?.select();
  }, []);
  return <input ref={ref} value={value} onChange={e => onChange(e.target.value)} onBlur={onBlur} onKeyDown={e => {
    if (e.key === 'Enter' || e.key === 'Escape') onBlur();
  }} style={style} />;
};

// ─── Stat Block ───────────────────────────────────────────────────────────────
const HEX_OPTIONS = [COLOR.ochreOrange, COLOR.firedRed, COLOR.mahanguGold, COLOR.barkRust, COLOR.mopaneBrown, COLOR.dyePlum];
const StatBlock = ({
  block,
  isDark,
  isConfiguring,
  onEditChange
}: {
  block: DocBlock;
  isDark: boolean;
  isConfiguring: boolean;
  onEditChange: (u: Partial<DocBlock>) => void;
}) => {
  const hex = block.statHex ?? COLOR.ochreOrange;
  const fg = isDark ? COLOR.milletClay : COLOR.charBlack;
  const muted = isDark ? 'rgba(232,225,207,0.40)' : 'rgba(30,26,23,0.40)';
  const border = isDark ? 'rgba(232,225,207,0.10)' : 'rgba(30,26,23,0.10)';
  const fields = [{
    key: 'statValue',
    label: 'Value',
    val: block.statValue ?? '',
    fontSize: 18,
    color: hex
  }, {
    key: 'statLabel',
    label: 'Label',
    val: block.statLabel ?? '',
    fontSize: 11,
    color: fg
  }, {
    key: 'statSub',
    label: 'Sub',
    val: block.statSub ?? '',
    fontSize: 10,
    color: muted
  }];
  if (isConfiguring) {
    return <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: 10
    }}>
        <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr 1fr',
        gap: 8
      }}>
          {fields.map(f => <div key={f.key}>
              <label style={{
            fontSize: 8,
            fontWeight: 700,
            letterSpacing: '0.12em',
            textTransform: 'uppercase' as const,
            color: muted,
            display: 'block',
            marginBottom: 4
          }}>{f.label}</label>
              <input value={f.val} onChange={e => onEditChange({
            [f.key]: e.target.value
          })} style={{
            width: '100%',
            fontSize: f.fontSize,
            fontWeight: 700,
            color: f.color,
            background: 'transparent',
            border: `1px solid ${border}`,
            outline: 'none',
            padding: '6px 8px'
          }} />
            </div>)}
        </div>
        <div>
          <label style={{
          fontSize: 8,
          fontWeight: 700,
          letterSpacing: '0.12em',
          textTransform: 'uppercase' as const,
          color: muted,
          display: 'block',
          marginBottom: 6
        }}>Accent Colour</label>
          <div style={{
          display: 'flex',
          gap: 6
        }}>
            {HEX_OPTIONS.map((c, i) => <button key={`stat-hex-${i}`} onClick={() => onEditChange({
            statHex: c
          })} style={{
            width: 20,
            height: 20,
            background: c,
            border: `2px solid ${hex === c ? fg : 'transparent'}`,
            cursor: 'pointer'
          }} />)}
          </div>
        </div>
      </div>;
  }
  return <div style={{
    display: 'inline-flex',
    flexDirection: 'column',
    gap: 4,
    padding: '14px 20px',
    background: `${hex}12`,
    border: `1px solid ${hex}40`,
    borderTop: `3px solid ${hex}`,
    minWidth: 140
  }}>
      <span style={{
      fontSize: 34,
      fontWeight: 700,
      color: hex,
      lineHeight: 1
    }}>{block.statValue ?? '0'}</span>
      <span style={{
      fontSize: 12,
      fontWeight: 600,
      color: fg
    }}>{block.statLabel ?? 'Metric'}</span>
      <span style={{
      fontSize: 10,
      color: muted
    }}>{block.statSub ?? ''}</span>
    </div>;
};

// ─── Terminal Block ───────────────────────────────────────────────────────────
const TerminalBlock = ({
  block,
  isDark,
  isConfiguring,
  onEditChange
}: {
  block: DocBlock;
  isDark: boolean;
  isConfiguring: boolean;
  onEditChange: (u: Partial<DocBlock>) => void;
}) => {
  const idx = block.terminalIdx ?? 0;
  const terminal = TERMINAL_BLOCKS[idx % TERMINAL_BLOCKS.length];
  const muted = isDark ? 'rgba(232,225,207,0.40)' : 'rgba(30,26,23,0.40)';
  const colorMap: Record<string, string> = {
    comment: '#6A4B2E',
    keyword: '#D9791F',
    string: '#DFAE2B',
    plain: '#E8E1CF99',
    accent: '#C84A1B'
  };
  if (isConfiguring) {
    return <div>
        <label style={{
        fontSize: 8,
        fontWeight: 700,
        letterSpacing: '0.12em',
        textTransform: 'uppercase' as const,
        color: muted,
        display: 'block',
        marginBottom: 8
      }}>Choose Terminal Block</label>
        <div style={{
        display: 'flex',
        gap: 6,
        flexWrap: 'wrap' as const
      }}>
          {TERMINAL_BLOCKS.map((tb, i) => <button key={`tb-choice-${i}`} onClick={() => onEditChange({
          terminalIdx: i,
          content: tb.title
        })} style={{
          padding: '6px 12px',
          fontSize: 10,
          fontWeight: 600,
          cursor: 'pointer',
          border: `1px solid ${(block.terminalIdx ?? 0) === i ? tb.tagHex : 'rgba(30,26,23,0.15)'}`,
          background: (block.terminalIdx ?? 0) === i ? `${tb.tagHex}18` : 'transparent',
          color: (block.terminalIdx ?? 0) === i ? tb.tagHex : muted
        }}>
              {tb.title}
            </button>)}
        </div>
      </div>;
  }
  return <div style={{
    background: '#1E1A17',
    overflow: 'hidden'
  }}>
      <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '10px 16px',
      borderBottom: `1px solid ${terminal.tagHex}33`
    }}>
        <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8
      }}>
          <div style={{
          display: 'flex',
          gap: 5
        }} aria-hidden="true">
            {[COLOR.ochreOrange, COLOR.firedRed, COLOR.mahanguGold].map((c, i) => <div key={`tc-dot-${i}`} style={{
            width: 8,
            height: 8,
            background: c,
            opacity: 0.6
          }} />)}
          </div>
          <span style={{
          fontSize: 9,
          fontWeight: 700,
          letterSpacing: '0.14em',
          textTransform: 'uppercase' as const,
          color: 'rgba(232,225,207,0.30)',
          marginLeft: 8
        }}>{terminal.title}</span>
        </div>
        <PixelTag hex={terminal.tagHex} label={terminal.tag} />
      </div>
      <div style={{
      padding: '16px 20px',
      fontFamily: 'monospace',
      fontSize: 11,
      lineHeight: 1.7
    }}>
        {terminal.lines.map((line, li) => <div key={`tl-${li}`} style={{
        color: colorMap[line.type] ?? colorMap.plain,
        minHeight: '1.5rem'
      }}>
            <span>{line.text || '\u00A0'}</span>
          </div>)}
      </div>
      <DitherBar color={terminal.tagHex} segments={32} height={3} opacity={0.55} />
    </div>;
};

// ─── Timeline Block ───────────────────────────────────────────────────────────
const TimelineBlock = ({
  block,
  isDark,
  isConfiguring,
  onEditChange
}: {
  block: DocBlock;
  isDark: boolean;
  isConfiguring: boolean;
  onEditChange: (u: Partial<DocBlock>) => void;
}) => {
  const idx = block.timelinePhaseIdx ?? 0;
  const phase = TIMELINE_PHASES[idx % TIMELINE_PHASES.length];
  const muted = isDark ? 'rgba(232,225,207,0.40)' : 'rgba(30,26,23,0.40)';
  const border = isDark ? 'rgba(232,225,207,0.08)' : 'rgba(30,26,23,0.08)';
  if (isConfiguring) {
    return <div>
        <label style={{
        fontSize: 8,
        fontWeight: 700,
        letterSpacing: '0.12em',
        textTransform: 'uppercase' as const,
        color: muted,
        display: 'block',
        marginBottom: 8
      }}>Choose Roadmap Phase</label>
        <div style={{
        display: 'flex',
        flexWrap: 'wrap' as const,
        gap: 6
      }}>
          {TIMELINE_PHASES.map((ph, i) => <button key={`ph-choice-${i}`} onClick={() => onEditChange({
          timelinePhaseIdx: i,
          content: ph.english
        })} style={{
          padding: '5px 10px',
          fontSize: 10,
          fontWeight: 600,
          cursor: 'pointer',
          border: `1px solid ${(block.timelinePhaseIdx ?? 0) === i ? ph.hex : 'rgba(30,26,23,0.15)'}`,
          background: (block.timelinePhaseIdx ?? 0) === i ? `${ph.hex}18` : 'transparent',
          color: (block.timelinePhaseIdx ?? 0) === i ? ph.hex : muted
        }}>
              {ph.tag} {ph.english}
            </button>)}
        </div>
      </div>;
  }
  return <div style={{
    border: `1px solid ${border}`,
    borderLeft: `3px solid ${phase.hex}`,
    padding: '16px 20px',
    background: isDark ? `${phase.hex}08` : `${phase.hex}06`
  }}>
      <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      marginBottom: 10
    }}>
        <PixelTag hex={phase.hex} label={phase.tag} />
        <div>
          <span style={{
          fontSize: 13,
          fontWeight: 700,
          color: isDark ? COLOR.milletClay : phase.hex
        }}>{phase.oshiwambo}</span>
          <span style={{
          fontSize: 11,
          color: muted,
          marginLeft: 8
        }}>{phase.english}</span>
        </div>
        <div style={{
        marginLeft: 'auto'
      }}>
          <span style={{
          fontSize: 10,
          fontWeight: 600,
          color: phase.hex
        }}>{phase.progress}%</span>
          <span style={{
          fontSize: 9,
          color: muted,
          marginLeft: 4
        }}>{phase.period}</span>
        </div>
      </div>
      <p style={{
      fontSize: 12,
      color: isDark ? 'rgba(232,225,207,0.65)' : 'rgba(30,26,23,0.65)',
      lineHeight: 1.65,
      marginBottom: 10
    }}>{phase.desc}</p>
      <div style={{
      width: '100%',
      height: 6,
      background: isDark ? 'rgba(232,225,207,0.08)' : 'rgba(30,26,23,0.08)',
      marginBottom: 8
    }}>
        <div style={{
        height: '100%',
        width: `${phase.progress}%`,
        background: phase.hex,
        backgroundImage: 'repeating-linear-gradient(90deg, transparent 0px, transparent 3px, rgba(30,26,23,0.12) 3px, rgba(30,26,23,0.12) 4px)'
      }} />
      </div>
      <div style={{
      display: 'flex',
      flexWrap: 'wrap' as const,
      gap: 6
    }}>
        {phase.milestones.map(ms => <span key={`ms-block-${ms}`} style={{
        fontSize: 9,
        padding: '2px 8px',
        background: `${phase.hex}18`,
        border: `1px solid ${phase.hex}40`,
        color: phase.hex,
        fontWeight: 600,
        letterSpacing: '0.08em'
      }}>{ms}</span>)}
      </div>
    </div>;
};

// ─── System Card Block ────────────────────────────────────────────────────────
const SYSTEM_ICON_SMALL: Record<string, React.ReactNode> = {
  Okaanda: <IconOkaanda size={32} />,
  Oshini: <IconOshini size={32} />,
  Ombiga: <IconOmbiga size={32} />,
  Etiti: <IconEtiti size={32} />,
  Oshitoo: <IconOshitoo size={32} />
};
const SystemCardBlock = ({
  block,
  isDark,
  isConfiguring,
  onEditChange
}: {
  block: DocBlock;
  isDark: boolean;
  isConfiguring: boolean;
  onEditChange: (u: Partial<DocBlock>) => void;
}) => {
  const idx = block.systemIdx ?? 0;
  const sys = SYSTEMS[idx % SYSTEMS.length];
  const muted = isDark ? 'rgba(232,225,207,0.40)' : 'rgba(30,26,23,0.40)';
  const border = isDark ? 'rgba(232,225,207,0.08)' : 'rgba(30,26,23,0.08)';
  if (isConfiguring) {
    return <div>
        <label style={{
        fontSize: 8,
        fontWeight: 700,
        letterSpacing: '0.12em',
        textTransform: 'uppercase' as const,
        color: muted,
        display: 'block',
        marginBottom: 8
      }}>Choose System</label>
        <div style={{
        display: 'flex',
        flexWrap: 'wrap' as const,
        gap: 6
      }}>
          {SYSTEMS.map((s, i) => <button key={`sys-choice-${i}`} onClick={() => onEditChange({
          systemIdx: i,
          content: s.name
        })} style={{
          padding: '5px 12px',
          fontSize: 10,
          fontWeight: 600,
          cursor: 'pointer',
          border: `1px solid ${(block.systemIdx ?? 0) === i ? s.borderHex : 'rgba(30,26,23,0.15)'}`,
          background: (block.systemIdx ?? 0) === i ? `${s.borderHex}18` : 'transparent',
          color: (block.systemIdx ?? 0) === i ? s.borderHex : muted
        }}>
              {s.name}
            </button>)}
        </div>
      </div>;
  }
  return <div style={{
    display: 'flex',
    gap: 16,
    padding: '16px 20px',
    background: isDark ? COLOR.darkCard : '#2A2420',
    border: `1px solid ${border}`,
    borderLeft: `3px solid ${sys.borderHex}`
  }}>
      <div style={{
      width: 48,
      height: 48,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: `${sys.borderHex}14`,
      border: `1px solid ${sys.borderHex}40`,
      flexShrink: 0
    }}>
        {SYSTEM_ICON_SMALL[sys.name]}
      </div>
      <div style={{
      flex: 1,
      minWidth: 0
    }}>
        <div style={{
        display: 'flex',
        alignItems: 'baseline',
        gap: 8,
        marginBottom: 4
      }}>
          <span style={{
          fontSize: 15,
          fontWeight: 700,
          color: isDark ? COLOR.milletClay : COLOR.charBlack
        }}>{sys.name}</span>
          <span style={{
          fontSize: 10,
          color: sys.borderHex,
          fontWeight: 700,
          letterSpacing: '0.12em',
          textTransform: 'uppercase' as const
        }}>{sys.role}</span>
        </div>
        <p style={{
        fontSize: 11,
        color: isDark ? 'rgba(232,225,207,0.60)' : 'rgba(30,26,23,0.65)',
        lineHeight: 1.6
      }}>{sys.desc}</p>
      </div>
    </div>;
};

// ─── Flow Node Block ──────────────────────────────────────────────────────────
const FlowNodeBlock = ({
  block,
  isDark,
  isConfiguring,
  onEditChange
}: {
  block: DocBlock;
  isDark: boolean;
  isConfiguring: boolean;
  onEditChange: (u: Partial<DocBlock>) => void;
}) => {
  const idx = block.flowNodeIdx ?? 0;
  const node = FLOW_NODES[idx % FLOW_NODES.length];
  const muted = isDark ? 'rgba(232,225,207,0.40)' : 'rgba(30,26,23,0.40)';
  if (isConfiguring) {
    return <div>
        <label style={{
        fontSize: 8,
        fontWeight: 700,
        letterSpacing: '0.12em',
        textTransform: 'uppercase' as const,
        color: muted,
        display: 'block',
        marginBottom: 8
      }}>Choose Flow Node</label>
        <div style={{
        display: 'flex',
        flexWrap: 'wrap' as const,
        gap: 6
      }}>
          {FLOW_NODES.map((n, i) => <button key={`fn-choice-${i}`} onClick={() => onEditChange({
          flowNodeIdx: i,
          content: n.oshiwambo
        })} style={{
          padding: '5px 10px',
          fontSize: 10,
          fontWeight: 600,
          cursor: 'pointer',
          border: `1px solid ${(block.flowNodeIdx ?? 0) === i ? n.hex : 'rgba(30,26,23,0.15)'}`,
          background: (block.flowNodeIdx ?? 0) === i ? `${n.hex}18` : 'transparent',
          color: (block.flowNodeIdx ?? 0) === i ? n.hex : muted
        }}>
              {n.oshiwambo}
            </button>)}
        </div>
      </div>;
  }
  return <div style={{
    display: 'flex',
    alignItems: 'center',
    gap: 14,
    padding: '14px 18px',
    background: `${node.hex}0E`,
    border: `1px solid ${node.hex}`,
    borderLeft: `4px solid ${node.hex}`
  }}>
      <div style={{
      flexShrink: 0
    }}><FlowNodeIcon id={node.id} hex={node.hex} /></div>
      <div>
        <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        marginBottom: 3
      }}>
          <PixelTag hex={node.hex} label={node.pixelTag} />
          <span style={{
          fontSize: 14,
          fontWeight: 700,
          color: isDark ? COLOR.milletClay : COLOR.charBlack
        }}>{node.oshiwambo}</span>
          <span style={{
          fontSize: 10,
          color: 'rgba(30,26,23,0.45)'
        }}>{node.english}</span>
        </div>
        <span style={{
        fontSize: 9,
        fontWeight: 700,
        letterSpacing: '0.13em',
        textTransform: 'uppercase' as const,
        color: node.hex
      }}>{node.role}</span>
      </div>
    </div>;
};

// ─── Heatmap Block ────────────────────────────────────────────────────────────
const HeatmapBlock = ({
  block,
  isDark,
  isConfiguring,
  onEditChange
}: {
  block: DocBlock;
  isDark: boolean;
  isConfiguring: boolean;
  onEditChange: (u: Partial<DocBlock>) => void;
}) => {
  const getHeatColor = (intensity: number) => {
    if (intensity > 0.85) return COLOR.firedRed;
    if (intensity > 0.65) return COLOR.ochreOrange;
    if (intensity > 0.45) return COLOR.mahanguGold;
    if (intensity > 0.25) return COLOR.barkRust;
    if (intensity > 0.1) return COLOR.mopaneBrown;
    return COLOR.charBlack;
  };
  const cells = block.heatmapData ? JSON.parse(block.heatmapData) as Array<{
    row: number;
    col: number;
    intensity: number;
  }> : HEATMAP_CELLS;
  const rowLabels = HEATMAP_LABELS_Y;
  const colLabels = HEATMAP_LABELS_X;
  const numRows = rowLabels.length;
  const numCols = colLabels.length;
  const getCell = (r: number, c: number) => cells.find(cell => cell.row === r && cell.col === c)?.intensity ?? 0;
  const updateCell = (r: number, c: number, val: number) => {
    const next = cells.map(cell => cell.row === r && cell.col === c ? {
      ...cell,
      intensity: val
    } : cell);
    onEditChange({
      heatmapData: JSON.stringify(next)
    });
  };
  if (isConfiguring) {
    return <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: 12
    }}>
        <label style={{
        fontSize: 8,
        fontWeight: 700,
        letterSpacing: '0.12em',
        textTransform: 'uppercase' as const,
        color: 'rgba(232,225,207,0.40)',
        display: 'block'
      }}>Edit Cell Intensities (0.0 – 1.0)</label>
        <div style={{
        background: '#1E1A17',
        padding: '12px 14px',
        overflowX: 'auto'
      }}>
          <div style={{
          display: 'flex',
          gap: 4,
          marginBottom: 6,
          paddingLeft: 58
        }}>
            {colLabels.map((lbl, ci) => <div key={`hcfg-x-${ci}`} style={{
            width: 36,
            textAlign: 'center',
            fontSize: 8,
            color: 'rgba(232,225,207,0.35)',
            fontWeight: 700
          }}>{lbl}</div>)}
          </div>
          {Array.from({
          length: numRows
        }, (_, ri) => <div key={`hcfg-row-${ri}`} style={{
          display: 'flex',
          alignItems: 'center',
          gap: 4,
          marginBottom: 4
        }}>
              <div style={{
            width: 72,
            fontSize: 8,
            color: 'rgba(232,225,207,0.35)',
            fontWeight: 700,
            textAlign: 'right',
            paddingRight: 6,
            flexShrink: 0
          }}>{rowLabels[ri]}</div>
              {Array.from({
            length: numCols
          }, (_, ci) => {
            const val = getCell(ri, ci);
            return <div key={`hcfg-cell-${ri}-${ci}`} style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 2
            }}>
                  <div style={{
                width: 36,
                height: 20,
                background: getHeatColor(val),
                cursor: 'pointer'
              }} />
                  <input type="number" min="0" max="1" step="0.05" value={val.toFixed(2)} onChange={e => updateCell(ri, ci, Math.max(0, Math.min(1, Number(e.target.value))))} style={{
                width: 36,
                fontSize: 8,
                background: 'transparent',
                border: '1px solid rgba(232,225,207,0.15)',
                outline: 'none',
                padding: '2px 3px',
                color: 'rgba(232,225,207,0.7)',
                textAlign: 'center'
              }} />
                </div>;
          })}
            </div>)}
        </div>
        <p style={{
        fontSize: 9,
        color: 'rgba(232,225,207,0.40)',
        margin: 0
      }}>Enter values 0.0 (inactive) to 1.0 (maximum activity) for each cell.</p>
      </div>;
  }
  return <div style={{
    background: '#1E1A17',
    padding: '16px 20px'
  }}>
      <div style={{
      display: 'flex',
      gap: 6,
      marginBottom: 6,
      paddingLeft: 72
    }}>
        {colLabels.map((label, i) => <div key={`hx-doc-${i}`} style={{
        flex: 1,
        textAlign: 'center',
        fontSize: 8,
        fontWeight: 700,
        letterSpacing: '0.12em',
        textTransform: 'uppercase' as const,
        color: 'rgba(232,225,207,0.35)'
      }}>{label}</div>)}
      </div>
      {rowLabels.map((yLabel, rowIdx) => <div key={`hr-doc-${rowIdx}`} style={{
      display: 'flex',
      alignItems: 'center',
      gap: 6,
      marginBottom: 3
    }}>
          <div style={{
        width: 72,
        fontSize: 8,
        color: 'rgba(232,225,207,0.35)',
        fontWeight: 700,
        textAlign: 'right',
        paddingRight: 8,
        flexShrink: 0
      }}>{yLabel}</div>
          {cells.filter(c => c.row === rowIdx).map(cell => <div key={`hc-doc-${cell.row}-${cell.col}`} style={{
        flex: 1,
        aspectRatio: '1',
        background: getHeatColor(cell.intensity)
      }} />)}
        </div>)}
      <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: 6,
      marginTop: 8
    }}>
        <span style={{
        fontSize: 8,
        fontWeight: 700,
        letterSpacing: '0.12em',
        textTransform: 'uppercase' as const,
        color: 'rgba(232,225,207,0.25)'
      }}>Low</span>
        {[COLOR.charBlack, COLOR.mopaneBrown, COLOR.barkRust, COLOR.mahanguGold, COLOR.ochreOrange, COLOR.firedRed].map((c, i) => <div key={`hl-doc-${i}`} style={{
        width: 12,
        height: 12,
        background: c
      }} />)}
        <span style={{
        fontSize: 8,
        fontWeight: 700,
        letterSpacing: '0.12em',
        textTransform: 'uppercase' as const,
        color: 'rgba(232,225,207,0.25)'
      }}>High</span>
      </div>
    </div>;
};

// ─── Market Chart Block ───────────────────────────────────────────────────────
const MarketChartBlock = ({
  block,
  isDark,
  isConfiguring,
  onEditChange
}: {
  block: DocBlock;
  isDark: boolean;
  isConfiguring: boolean;
  onEditChange: (u: Partial<DocBlock>) => void;
}) => {
  const muted = isDark ? 'rgba(232,225,207,0.40)' : 'rgba(30,26,23,0.40)';
  const border = isDark ? 'rgba(232,225,207,0.08)' : 'rgba(30,26,23,0.08)';
  const chartTitle = block.chartTitle ?? 'Global AI Market Growth';
  const chartData = block.marketData ? JSON.parse(block.marketData) as Array<{
    year: string;
    value: number;
  }> : DEFAULT_AI_MARKET_DATA;
  if (isConfiguring) {
    return <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: 12
    }}>
        <div>
          <label style={{
          fontSize: 8,
          fontWeight: 700,
          letterSpacing: '0.12em',
          textTransform: 'uppercase' as const,
          color: muted,
          display: 'block',
          marginBottom: 4
        }}>Chart Title</label>
          <input value={chartTitle} onChange={e => onEditChange({
          chartTitle: e.target.value
        })} style={{
          width: '100%',
          fontSize: 12,
          color: isDark ? COLOR.milletClay : COLOR.charBlack,
          background: 'transparent',
          border: `1px solid ${border}`,
          outline: 'none',
          padding: '6px 8px'
        }} />
        </div>
        <div>
          <label style={{
          fontSize: 8,
          fontWeight: 700,
          letterSpacing: '0.12em',
          textTransform: 'uppercase' as const,
          color: muted,
          display: 'block',
          marginBottom: 8
        }}>Data Points</label>
          <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 6
        }}>
            {chartData.map((row, i) => <div key={`mkt-edit-${i}`} style={{
            display: 'flex',
            gap: 8,
            alignItems: 'center'
          }}>
                <input value={row.year} onChange={e => {
              const next = chartData.map((r, ri) => ri === i ? {
                ...r,
                year: e.target.value
              } : r);
              onEditChange({
                marketData: JSON.stringify(next)
              });
            }} style={{
              flex: 1,
              fontSize: 11,
              background: 'transparent',
              border: `1px solid ${border}`,
              outline: 'none',
              padding: '4px 8px',
              color: isDark ? COLOR.milletClay : COLOR.charBlack
            }} placeholder="Year" />
                <input type="number" value={row.value} onChange={e => {
              const next = chartData.map((r, ri) => ri === i ? {
                ...r,
                value: Number(e.target.value)
              } : r);
              onEditChange({
                marketData: JSON.stringify(next)
              });
            }} style={{
              flex: 1,
              fontSize: 11,
              background: 'transparent',
              border: `1px solid ${border}`,
              outline: 'none',
              padding: '4px 8px',
              color: COLOR.ochreOrange
            }} placeholder="$B" />
                <span style={{
              fontSize: 9,
              color: muted,
              flexShrink: 0
            }}>$B</span>
                <button onClick={() => {
              const next = chartData.filter((_, ri) => ri !== i);
              onEditChange({
                marketData: JSON.stringify(next)
              });
            }} style={{
              fontSize: 9,
              color: COLOR.firedRed,
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              flexShrink: 0,
              paddingTop: 6
            }}>✕</button>
              </div>)}
          </div>
          <button onClick={() => {
          const next = [...chartData, {
            year: 'Year',
            value: 0
          }];
          onEditChange({
            marketData: JSON.stringify(next)
          });
        }} style={{
          marginTop: 8,
          fontSize: 9,
          fontWeight: 600,
          color: COLOR.ochreOrange,
          background: 'transparent',
          border: `1px solid ${COLOR.ochreOrange}50`,
          cursor: 'pointer',
          padding: '4px 10px',
          alignSelf: 'flex-start'
        }}>
            + Add Point
          </button>
        </div>
      </div>;
  }
  return <div style={{
    background: isDark ? COLOR.darkCard : '#FDFAF2',
    border: `1px solid ${isDark ? 'rgba(232,225,207,0.08)' : 'rgba(30,26,23,0.08)'}`,
    padding: '16px 20px'
  }}>
      <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      marginBottom: 12
    }}>
        <PixelDot color={COLOR.ochreOrange} size={5} />
        <span style={{
        fontSize: 9,
        fontWeight: 700,
        letterSpacing: '0.14em',
        textTransform: 'uppercase' as const,
        color: COLOR.ochreOrange
      }}>{chartTitle}</span>
        <span style={{
        fontSize: 9,
        color: muted,
        marginLeft: 'auto'
      }}>2023–2033 · USD Billions</span>
      </div>
      <div style={{
      width: '100%',
      height: 160
    }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{
          top: 4,
          right: 8,
          left: 0,
          bottom: 0
        }}>
            <defs>
              <linearGradient id="doc-area-grad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={COLOR.ochreOrange} stopOpacity={0.3} />
                <stop offset="95%" stopColor={COLOR.ochreOrange} stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <XAxis dataKey="year" tick={{
            fontSize: 9,
            fill: muted
          }} axisLine={false} tickLine={false} />
            <YAxis tick={{
            fontSize: 8,
            fill: muted
          }} axisLine={false} tickLine={false} tickFormatter={v => `$${v}B`} />
            <Tooltip contentStyle={{
            background: '#1E1A17',
            border: `1px solid ${COLOR.ochreOrange}40`,
            borderRadius: 0,
            fontSize: 10
          }} labelStyle={{
            color: COLOR.ochreOrange
          }} itemStyle={{
            color: COLOR.milletClay
          }} formatter={(v: number) => [`$${v}B`, 'Market Size']} />
            <Area type="monotone" dataKey="value" stroke={COLOR.ochreOrange} strokeWidth={2} fill="url(#doc-area-grad)" dot={{
            fill: COLOR.ochreOrange,
            r: 3,
            strokeWidth: 0
          }} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>;
};

// ─── Bar Chart Block ──────────────────────────────────────────────────────────
const BarChartBlock = ({
  block,
  isDark,
  isConfiguring,
  onEditChange
}: {
  block: DocBlock;
  isDark: boolean;
  isConfiguring: boolean;
  onEditChange: (u: Partial<DocBlock>) => void;
}) => {
  const muted = isDark ? 'rgba(232,225,207,0.40)' : 'rgba(30,26,23,0.40)';
  const border = isDark ? 'rgba(232,225,207,0.08)' : 'rgba(30,26,23,0.08)';
  const rawValues = block.barValues ? JSON.parse(block.barValues) as Array<{
    name: string;
    progress: number;
  }> : DEFAULT_BAR_DATA;
  if (isConfiguring) {
    return <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: 10
    }}>
        <label style={{
        fontSize: 8,
        fontWeight: 700,
        letterSpacing: '0.12em',
        textTransform: 'uppercase' as const,
        color: muted
      }}>Edit Bar Values</label>
        {rawValues.map((row, i) => <div key={`bar-edit-${i}`} style={{
        display: 'flex',
        gap: 8,
        alignItems: 'center'
      }}>
            <input value={row.name} onChange={e => {
          const next = rawValues.map((r, ri) => ri === i ? {
            ...r,
            name: e.target.value
          } : r);
          onEditChange({
            barValues: JSON.stringify(next)
          });
        }} style={{
          flex: 2,
          fontSize: 11,
          background: 'transparent',
          border: `1px solid ${border}`,
          outline: 'none',
          padding: '4px 8px',
          color: isDark ? COLOR.milletClay : COLOR.charBlack
        }} placeholder="Name" />
            <input type="number" value={row.progress} min={0} max={100} onChange={e => {
          const next = rawValues.map((r, ri) => ri === i ? {
            ...r,
            progress: Number(e.target.value)
          } : r);
          onEditChange({
            barValues: JSON.stringify(next)
          });
        }} style={{
          flex: 1,
          fontSize: 11,
          background: 'transparent',
          border: `1px solid ${border}`,
          outline: 'none',
          padding: '4px 8px',
          color: COLOR.barkRust
        }} placeholder="%" />
            <span style={{
          fontSize: 9,
          color: muted
        }}>%</span>
          </div>)}
        <button onClick={() => {
        const next = [...rawValues, {
          name: 'New System',
          progress: 0
        }];
        onEditChange({
          barValues: JSON.stringify(next)
        });
      }} style={{
        marginTop: 8,
        fontSize: 9,
        fontWeight: 600,
        color: COLOR.ochreOrange,
        background: 'transparent',
        border: `1px solid ${COLOR.ochreOrange}50`,
        cursor: 'pointer',
        padding: '4px 10px',
        alignSelf: 'flex-start'
      }}>
          + Add System
        </button>
      </div>;
  }
  return <div style={{
    background: isDark ? COLOR.darkCard : '#FDFAF2',
    border: `1px solid ${isDark ? 'rgba(232,225,207,0.08)' : 'rgba(30,26,23,0.08)'}`,
    padding: '16px 20px'
  }}>
      <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      marginBottom: 12
    }}>
        <PixelDot color={COLOR.barkRust} size={5} />
        <span style={{
        fontSize: 9,
        fontWeight: 700,
        letterSpacing: '0.14em',
        textTransform: 'uppercase' as const,
        color: COLOR.barkRust
      }}>System Build Progress</span>
        <span style={{
        fontSize: 9,
        color: muted,
        marginLeft: 'auto'
      }}>% complete</span>
      </div>
      <div style={{
      width: '100%',
      height: 160
    }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={rawValues} margin={{
          top: 4,
          right: 8,
          left: 0,
          bottom: 0
        }}>
            <XAxis dataKey="name" tick={{
            fontSize: 9,
            fill: muted
          }} axisLine={false} tickLine={false} />
            <YAxis tick={{
            fontSize: 8,
            fill: muted
          }} axisLine={false} tickLine={false} domain={[0, 100]} tickFormatter={v => `${v}%`} />
            <Tooltip contentStyle={{
            background: '#1E1A17',
            border: `1px solid ${COLOR.barkRust}40`,
            borderRadius: 0,
            fontSize: 10
          }} labelStyle={{
            color: COLOR.barkRust
          }} itemStyle={{
            color: COLOR.milletClay
          }} formatter={(v: number) => [`${v}%`, 'Progress']} />
            <Bar dataKey="progress" fill={COLOR.barkRust} opacity={0.85} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>;
};

// ─── Principles Block ─────────────────────────────────────────────────────────
const BRAND_PRINCIPLES = [{
  label: 'Language',
  value: 'Oshiwambo first. English second.'
}, {
  label: 'Symbol',
  value: 'Pixel by default — icon, diagram, texture, mark.'
}, {
  label: 'Type',
  value: 'Non-pixel by default — body, reading, interface.'
}, {
  label: 'Palette',
  value: 'Millet, clay, bark, smoke, ochre, dried grass.'
}, {
  label: 'Layout',
  value: 'Calm and editorial. Anthropic-level whitespace discipline.'
}];
const PrinciplesBlock = ({
  block,
  isDark,
  isConfiguring,
  onEditChange
}: {
  block: DocBlock;
  isDark: boolean;
  isConfiguring: boolean;
  onEditChange: (u: Partial<DocBlock>) => void;
}) => {
  const border = isDark ? 'rgba(232,225,207,0.10)' : 'rgba(30,26,23,0.10)';
  const fg = isDark ? 'rgba(232,225,207,0.80)' : 'rgba(30,26,23,0.80)';
  const muted = isDark ? 'rgba(232,225,207,0.40)' : 'rgba(30,26,23,0.40)';
  const principles = block.principlesData ? JSON.parse(block.principlesData) as Array<{
    label: string;
    value: string;
  }> : BRAND_PRINCIPLES;
  if (isConfiguring) {
    return <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: 10
    }}>
        <label style={{
        fontSize: 8,
        fontWeight: 700,
        letterSpacing: '0.12em',
        textTransform: 'uppercase' as const,
        color: muted,
        display: 'block'
      }}>Edit Principles — Label + Value</label>
        <div>
          <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 6
        }}>
            {principles.map((p, i) => <div key={`pr-edit-${i}`} style={{
            display: 'flex',
            gap: 8,
            alignItems: 'flex-start'
          }}>
                <input value={p.label} onChange={e => {
              const next = principles.map((pr, pi) => pi === i ? {
                ...pr,
                label: e.target.value
              } : pr);
              onEditChange({
                principlesData: JSON.stringify(next)
              });
            }} style={{
              width: 88,
              flexShrink: 0,
              fontSize: 9,
              fontWeight: 700,
              color: COLOR.ochreOrange,
              background: 'transparent',
              border: `1px solid ${border}`,
              outline: 'none',
              padding: '5px 8px'
            }} placeholder="Label" />
                <input value={p.value} onChange={e => {
              const next = principles.map((pr, pi) => pi === i ? {
                ...pr,
                value: e.target.value
              } : pr);
              onEditChange({
                principlesData: JSON.stringify(next)
              });
            }} style={{
              flex: 1,
              fontSize: 11,
              color: fg,
              background: 'transparent',
              border: `1px solid ${border}`,
              outline: 'none',
              padding: '5px 8px'
            }} placeholder="Value" />
                <button onClick={() => {
              const next = principles.filter((_, pi) => pi !== i);
              onEditChange({
                principlesData: JSON.stringify(next)
              });
            }} style={{
              fontSize: 9,
              color: COLOR.firedRed,
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              flexShrink: 0,
              paddingTop: 6
            }}>✕</button>
              </div>)}
          </div>
          <button onClick={() => {
          const next = [...principles, {
            label: 'New',
            value: 'New principle'
          }];
          onEditChange({
            principlesData: JSON.stringify(next)
          });
        }} style={{
          marginTop: 8,
          fontSize: 9,
          fontWeight: 600,
          color: COLOR.ochreOrange,
          background: 'transparent',
          border: `1px solid ${COLOR.ochreOrange}50`,
          cursor: 'pointer',
          padding: '4px 10px',
          alignSelf: 'flex-start'
        }}>
            + Add Row
          </button>
        </div>
      </div>;
  }
  return <dl style={{
    borderTop: `1px solid ${border}`
  }}>
      {principles.map(p => <div key={p.label} style={{
      display: 'flex',
      gap: 24,
      padding: '10px 0',
      borderBottom: `1px solid ${border}`
    }}>
          <dt style={{
        fontSize: 9,
        fontWeight: 700,
        letterSpacing: '0.14em',
        textTransform: 'uppercase' as const,
        color: COLOR.ochreOrange,
        width: 80,
        flexShrink: 0,
        paddingTop: 2
      }}>{p.label}</dt>
          <dd style={{
        fontSize: 12,
        color: fg,
        lineHeight: 1.65
      }}>{p.value}</dd>
        </div>)}
    </dl>;
};

// ─── Swatch Row Block ─────────────────────────────────────────────────────────
const SWATCH_DATA = [{
  name: 'Millet Clay',
  hex: '#E8E1CF',
  light: true
}, {
  name: 'Dust Light',
  hex: '#F3E8C3',
  light: true
}, {
  name: 'Mahangu Gold',
  hex: '#DFAE2B',
  light: true
}, {
  name: 'Ochre Orange',
  hex: '#D9791F',
  light: false
}, {
  name: 'Fired Red',
  hex: '#C84A1B',
  light: false
}, {
  name: 'Bark Rust',
  hex: '#8F3E21',
  light: false
}, {
  name: 'Mopane Brown',
  hex: '#6A4B2E',
  light: false
}, {
  name: 'Char Black',
  hex: '#1E1A17',
  light: false
}, {
  name: 'Dye Plum',
  hex: '#6F4A6E',
  light: false
}];
const SwatchRowBlock = ({
  block,
  isDark,
  isConfiguring,
  onEditChange
}: {
  block: DocBlock;
  isDark: boolean;
  isConfiguring: boolean;
  onEditChange: (u: Partial<DocBlock>) => void;
}) => {
  const muted = isDark ? 'rgba(232,225,207,0.40)' : 'rgba(30,26,23,0.40)';
  const border = isDark ? 'rgba(232,225,207,0.08)' : 'rgba(30,26,23,0.08)';
  const swatches = block.swatchData ? JSON.parse(block.swatchData) as Array<{
    name: string;
    hex: string;
  }> : SWATCH_DATA.map(s => ({
    name: s.name,
    hex: s.hex
  }));
  if (isConfiguring) {
    return <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: 8
    }}>
        <label style={{
        fontSize: 8,
        fontWeight: 700,
        letterSpacing: '0.12em',
        textTransform: 'uppercase' as const,
        color: muted,
        display: 'block'
      }}>Edit Swatches</label>
        {swatches.map((sw, i) => <div key={`sw-edit-${i}`} style={{
        display: 'flex',
        gap: 8,
        alignItems: 'center'
      }}>
            <div style={{
          width: 28,
          height: 28,
          background: sw.hex,
          border: `1px solid ${border}`,
          flexShrink: 0
        }} />
            <input value={sw.hex} onChange={e => {
          const next = swatches.map((s, si) => si === i ? {
            ...s,
            hex: e.target.value
          } : s);
          onEditChange({
            swatchData: JSON.stringify(next)
          });
        }} style={{
          width: 80,
          fontSize: 10,
          background: 'transparent',
          border: `1px solid ${border}`,
          outline: 'none',
          padding: '4px 6px',
          color: isDark ? COLOR.milletClay : COLOR.charBlack,
          fontFamily: 'monospace'
        }} placeholder="#hex" />
            <input value={sw.name} onChange={e => {
          const next = swatches.map((s, si) => si === i ? {
            ...s,
            name: e.target.value
          } : s);
          onEditChange({
            swatchData: JSON.stringify(next)
          });
        }} style={{
          flex: 1,
          fontSize: 10,
          background: 'transparent',
          border: `1px solid ${border}`,
          outline: 'none',
          padding: '4px 6px',
          color: isDark ? COLOR.milletClay : COLOR.charBlack
        }} placeholder="Name" />
            <button onClick={() => {
          const next = swatches.filter((_, si) => si !== i);
          onEditChange({
            swatchData: JSON.stringify(next)
          });
        }} style={{
          fontSize: 9,
          color: COLOR.firedRed,
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
          flexShrink: 0
        }}>✕</button>
          </div>)}
        <button onClick={() => {
        const next = [...swatches, {
          name: 'New Colour',
          hex: '#888888'
        }];
        onEditChange({
          swatchData: JSON.stringify(next)
        });
      }} style={{
        fontSize: 9,
        fontWeight: 600,
        color: COLOR.ochreOrange,
        background: 'transparent',
        border: `1px solid ${COLOR.ochreOrange}50`,
        cursor: 'pointer',
        padding: '4px 10px',
        alignSelf: 'flex-start'
      }}>
            + Add Swatch
          </button>
      </div>;
  }
  return <div style={{
    display: 'flex',
    gap: 8,
    flexWrap: 'wrap' as const
  }}>
      {swatches.map(sw => <div key={sw.hex} style={{
      display: 'flex',
      flexDirection: 'column',
      gap: 4,
      minWidth: 52
    }}>
          <div style={{
        width: 52,
        height: 52,
        background: sw.hex,
        border: '1px solid rgba(30,26,23,0.10)'
      }} />
          <span style={{
        fontSize: 9,
        fontWeight: 600,
        color: isDark ? COLOR.milletClay : COLOR.charBlack,
        lineHeight: 1.2
      }}>{sw.name}</span>
          <span style={{
        fontSize: 8,
        color: muted
      }}>{sw.hex}</span>
        </div>)}
    </div>;
};

// ─── Block renderer ───────────────────────────────────────────────────────────
function DocBlockView({
  block,
  isDark,
  isSelected,
  isEditing,
  isConfiguring,
  dragState,
  idx,
  onSelect,
  onStartEdit,
  onStopEdit,
  onEdit,
  onDelete,
  onDragStart,
  onDragOver,
  onDragEnd,
  onMoveUp,
  onMoveDown
}: {
  block: DocBlock;
  isDark: boolean;
  isSelected: boolean;
  isEditing: boolean;
  isConfiguring: boolean;
  dragState: DragState;
  idx: number;
  onSelect: () => void;
  onStartEdit: () => void;
  onStopEdit: () => void;
  onEdit: (updates: Partial<DocBlock>) => void;
  onDelete: () => void;
  onDragStart: () => void;
  onDragOver: () => void;
  onDragEnd: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
}) {
  const fg = isDark ? COLOR.milletClay : COLOR.charBlack;
  const bodyColor = isDark ? 'rgba(232,225,207,0.78)' : 'rgba(30,26,23,0.82)';
  const muted = isDark ? 'rgba(232,225,207,0.40)' : 'rgba(30,26,23,0.40)';
  const border = isDark ? 'rgba(232,225,207,0.10)' : 'rgba(30,26,23,0.10)';
  const selBorder = `${COLOR.ochreOrange}60`;
  const ACCENT_COLORS = [COLOR.ochreOrange, COLOR.firedRed, COLOR.mahanguGold, COLOR.mopaneBrown, COLOR.dyePlum];
  const accent = ACCENT_COLORS[idx % ACCENT_COLORS.length];
  const isDesignBlock = ['stat', 'terminal', 'heatmap', 'timeline', 'systemcard', 'flowchart', 'principles', 'swatchrow', 'chart-market', 'chart-bar'].includes(block.type);
  const isTextBlock = ['heading', 'body', 'pullquote', 'callout', 'list', 'signature'].includes(block.type);
  const isDragging = dragState.draggingId === block.id;
  const isDragOver = dragState.overIdx === idx && dragState.draggingId !== block.id;
  const sharedTextareaStyle: React.CSSProperties = {
    width: '100%',
    background: isDark ? 'rgba(232,225,207,0.04)' : 'rgba(30,26,23,0.03)',
    border: `1px solid ${COLOR.ochreOrange}60`,
    outline: 'none',
    padding: '8px 10px',
    fontFamily: 'Georgia, serif',
    minHeight: 80
  };
  const innerContent = (() => {
    if (block.type === 'stat') return <StatBlock block={block} isDark={isDark} isConfiguring={isConfiguring} onEditChange={onEdit} />;
    if (block.type === 'terminal') return <TerminalBlock block={block} isDark={isDark} isConfiguring={isConfiguring} onEditChange={onEdit} />;
    if (block.type === 'timeline') return <TimelineBlock block={block} isDark={isDark} isConfiguring={isConfiguring} onEditChange={onEdit} />;
    if (block.type === 'systemcard') return <SystemCardBlock block={block} isDark={isDark} isConfiguring={isConfiguring} onEditChange={onEdit} />;
    if (block.type === 'flowchart') return <FlowNodeBlock block={block} isDark={isDark} isConfiguring={isConfiguring} onEditChange={onEdit} />;
    if (block.type === 'heatmap') return <HeatmapBlock block={block} isDark={isDark} isConfiguring={isConfiguring} onEditChange={onEdit} />;
    if (block.type === 'principles') return <PrinciplesBlock block={block} isDark={isDark} isConfiguring={isConfiguring} onEditChange={onEdit} />;
    if (block.type === 'swatchrow') return <SwatchRowBlock block={block} isDark={isDark} isConfiguring={isConfiguring} onEditChange={onEdit} />;
    if (block.type === 'chart-market') return <MarketChartBlock block={block} isDark={isDark} isConfiguring={isConfiguring} onEditChange={onEdit} />;
    if (block.type === 'chart-bar') return <BarChartBlock block={block} isDark={isDark} isConfiguring={isConfiguring} onEditChange={onEdit} />;
    if (block.type === 'divider') {
      return <div style={{
        padding: '8px 0'
      }}><DitherBar color={COLOR.ochreOrange} segments={48} height={3} opacity={0.35} /></div>;
    }
    if (block.type === 'signature') {
      return <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        padding: '12px 0'
      }}>
          <OkaandaLogoMark size={18} />
          {isEditing ? <InlineInput value={block.content} onChange={v => onEdit({
          content: v
        })} onBlur={onStopEdit} style={{
          flex: 1,
          fontSize: 11,
          color: muted,
          background: 'transparent',
          border: 'none',
          borderBottom: `1px solid ${COLOR.ochreOrange}80`,
          outline: 'none',
          letterSpacing: '0.06em'
        }} /> : <span style={{
          fontSize: 11,
          color: muted,
          letterSpacing: '0.06em',
          cursor: 'text'
        }} onDoubleClick={() => {
          onStartEdit();
        }} title="Double-click to rename">{block.content}</span>}
        </div>;
    }
    if (block.type === 'heading') {
      const headingAccent = ACCENT_COLORS[Math.floor(idx / 2) % ACCENT_COLORS.length];
      return <div style={{
        display: 'flex',
        alignItems: 'baseline',
        gap: 12,
        paddingBottom: 14,
        borderBottom: `1px solid ${border}`
      }}>
          <span style={{
          fontSize: 9,
          fontWeight: 700,
          letterSpacing: '0.18em',
          textTransform: 'uppercase' as const,
          color: headingAccent,
          minWidth: 20
        }}>
            {String(Math.floor(idx / 3) + 1).padStart(2, '0')}
          </span>
          {isEditing ? <InlineInput value={block.content} onChange={v => onEdit({
          content: v
        })} onBlur={onStopEdit} style={{
          flex: 1,
          fontSize: 15,
          fontWeight: 700,
          letterSpacing: '-0.01em',
          color: fg,
          background: 'transparent',
          border: 'none',
          borderBottom: `1px solid ${headingAccent}80`,
          outline: 'none'
        }} /> : <h2 style={{
          fontSize: 15,
          fontWeight: 700,
          letterSpacing: '-0.01em',
          color: fg,
          lineHeight: 1.2,
          flex: 1,
          margin: 0,
          cursor: 'text'
        }} onDoubleClick={() => {
          onStartEdit();
        }}>{block.content}</h2>}
          <div style={{
          flex: 0.3,
          height: 1,
          background: headingAccent,
          opacity: 0.25,
          marginBottom: 3
        }} />
        </div>;
    }
    if (block.type === 'body') {
      return isEditing ? <InlineTextArea value={block.content} onChange={v => onEdit({
        content: v
      })} onBlur={onStopEdit} style={{
        ...sharedTextareaStyle,
        fontSize: 13.5,
        lineHeight: 1.85,
        color: bodyColor
      }} /> : <p style={{
        fontSize: 13.5,
        lineHeight: 1.85,
        color: bodyColor,
        margin: 0,
        fontFamily: 'Georgia, serif',
        cursor: 'text'
      }} onDoubleClick={() => {
        onStartEdit();
      }}>{block.content}</p>;
    }
    if (block.type === 'pullquote') {
      return <div style={{
        borderLeft: `3px solid ${COLOR.ochreOrange}`,
        paddingLeft: 20,
        paddingTop: 4,
        paddingBottom: 4
      }}>
          {isEditing ? <InlineTextArea value={block.content} onChange={v => onEdit({
          content: v
        })} onBlur={onStopEdit} style={{
          ...sharedTextareaStyle,
          fontSize: 14,
          fontStyle: 'italic',
          fontWeight: 500,
          color: COLOR.ochreOrange,
          background: 'transparent',
          border: `1px solid ${COLOR.ochreOrange}40`,
          minHeight: 56
        }} /> : <p style={{
          fontSize: 14,
          fontStyle: 'italic',
          fontWeight: 500,
          color: COLOR.ochreOrange,
          lineHeight: 1.7,
          margin: 0,
          cursor: 'text'
        }} onDoubleClick={() => {
          onStartEdit();
        }}>{block.content}</p>}
        </div>;
    }
    if (block.type === 'callout') {
      return <div style={{
        padding: '14px 18px',
        background: isDark ? `${COLOR.firedRed}0D` : `${COLOR.firedRed}08`,
        border: `1px solid ${COLOR.firedRed}35`,
        borderLeft: `3px solid ${COLOR.firedRed}`,
        display: 'flex',
        flexDirection: 'column',
        gap: 6
      }}>
          <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6
        }}>
            <PixelDot color={COLOR.firedRed} size={5} />
            <span style={{
            fontSize: 9,
            fontWeight: 700,
            letterSpacing: '0.16em',
            textTransform: 'uppercase' as const,
            color: COLOR.firedRed
          }}>Note</span>
          </div>
          {isEditing ? <InlineTextArea value={block.content} onChange={v => onEdit({
          content: v
        })} onBlur={onStopEdit} style={{
          ...sharedTextareaStyle,
          fontSize: 12,
          lineHeight: 1.65,
          color: bodyColor,
          background: 'transparent',
          border: `1px solid ${COLOR.firedRed}40`,
          minHeight: 56
        }} /> : <p style={{
          fontSize: 12,
          lineHeight: 1.65,
          color: bodyColor,
          margin: 0,
          cursor: 'text'
        }} onDoubleClick={() => {
          onStartEdit();
        }}>{block.content}</p>}
        </div>;
    }
    if (block.type === 'list') {
      const items = block.content.split(' · ').filter(Boolean);
      return <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 0
      }}>
          {isEditing ? <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 6
        }}>
                <InlineTextArea value={block.content} onChange={v => onEdit({
            content: v
          })} onBlur={onStopEdit} style={{
            ...sharedTextareaStyle,
            fontSize: 12,
            lineHeight: 1.7,
            color: bodyColor,
            minHeight: 80
          }} />
                <span style={{
            fontSize: 9,
            color: muted
          }}>Separate items with " · " (space · space)</span>
              </div> : <ul style={{
          margin: 0,
          padding: 0,
          listStyle: 'none',
          display: 'flex',
          flexDirection: 'column',
          gap: 6
        }}>
                {items.map((item, i) => <li key={`li-${block.id}-${i}`} style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: 10
          }} onDoubleClick={() => {
            onStartEdit();
          }}>
                    <div style={{
              width: 5,
              height: 5,
              background: accent,
              marginTop: 7,
              flexShrink: 0
            }} />
                    <span style={{
              fontSize: 13,
              lineHeight: 1.7,
              color: bodyColor,
              fontFamily: 'Georgia, serif',
              cursor: 'text'
            }}>{item}</span>
                  </li>)}
              </ul>}
        </div>;
    }
    return null;
  })();
  const showToolbar = isSelected && block.type !== 'divider';
  const showDividerRemove = isSelected && block.type === 'divider';
  return <div draggable onDragStart={e => {
    e.stopPropagation();
    onDragStart();
  }} onDragOver={e => {
    e.preventDefault();
    e.stopPropagation();
    onDragOver();
  }} onDragEnd={onDragEnd} style={{
    position: 'relative',
    outline: isSelected ? `1.5px solid ${selBorder}` : isDragOver ? `1.5px dashed ${COLOR.ochreOrange}90` : '1.5px solid transparent',
    outlineOffset: 2,
    padding: '4px 0',
    marginBottom: block.type === 'heading' ? 14 : block.type === 'divider' ? 16 : 18,
    cursor: 'default',
    transition: 'outline 0.15s',
    opacity: isDragging ? 0.35 : 1,
    background: isDragOver ? isDark ? 'rgba(232,225,207,0.04)' : 'rgba(30,26,23,0.03)' : 'transparent'
  }} onClick={e => {
    e.stopPropagation();
    onSelect();
  }}>
      {/* Drag handle */}
      <div style={{
      position: 'absolute',
      left: -28,
      top: '50%',
      transform: 'translateY(-50%)',
      width: 16,
      display: 'flex',
      flexDirection: 'column',
      gap: 2.5,
      alignItems: 'center',
      cursor: 'grab',
      opacity: isSelected ? 0.7 : 0,
      transition: 'opacity 0.15s',
      paddingTop: 2,
      paddingBottom: 2
    }} title="Drag to reorder" onMouseEnter={e => {
      (e.currentTarget as HTMLElement).style.opacity = '1';
    }} onMouseLeave={e => {
      (e.currentTarget as HTMLElement).style.opacity = isSelected ? '0.7' : '0';
    }}>
        {[0, 1, 2, 3, 4, 5].map(i => <div key={`dh-${i}`} style={{
        width: 3,
        height: 3,
        background: COLOR.ochreOrange,
        borderRadius: 1
      }} />)}
      </div>

      {isSelected && <div style={{
      position: 'absolute',
      left: -16,
      top: 0,
      bottom: 0,
      width: 2,
      background: COLOR.ochreOrange
    }} />}

      {innerContent}

      {showDividerRemove && <div style={{
      display: 'flex',
      justifyContent: 'flex-end',
      marginTop: 4
    }}>
        <button onClick={e => {
        e.stopPropagation();
        onDelete();
      }} style={{
        fontSize: 9,
        fontWeight: 600,
        cursor: 'pointer',
        background: 'transparent',
        border: `1px solid ${isDark ? 'rgba(232,225,207,0.15)' : 'rgba(30,26,23,0.15)'}`,
        color: muted,
        padding: '2px 8px',
        letterSpacing: '0.08em'
      }} onMouseEnter={e => {
        e.currentTarget.style.borderColor = COLOR.firedRed;
        e.currentTarget.style.color = COLOR.firedRed;
      }} onMouseLeave={e => {
        e.currentTarget.style.borderColor = isDark ? 'rgba(232,225,207,0.15)' : 'rgba(30,26,23,0.15)';
        e.currentTarget.style.color = muted;
      }}>✕ Remove</button>
      </div>}

      {showToolbar && <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: 6,
      marginTop: 8,
      flexWrap: 'wrap' as const
    }}>
          {isTextBlock && !isEditing && <button onClick={e => {
        e.stopPropagation();
        onStartEdit();
      }} style={{
        padding: '4px 10px',
        background: 'transparent',
        border: `1px solid ${border}`,
        cursor: 'pointer',
        fontSize: 9,
        fontWeight: 600,
        color: muted
      }} onMouseEnter={e => {
        e.currentTarget.style.borderColor = COLOR.ochreOrange;
        e.currentTarget.style.color = COLOR.ochreOrange;
      }} onMouseLeave={e => {
        e.currentTarget.style.borderColor = border;
        e.currentTarget.style.color = muted;
      }}>Edit</button>}
          {isDesignBlock && !isConfiguring && <button onClick={e => {
        e.stopPropagation();
        onStartEdit();
      }} style={{
        padding: '4px 10px',
        background: 'transparent',
        border: `1px solid ${border}`,
        cursor: 'pointer',
        fontSize: 9,
        fontWeight: 600,
        color: muted
      }} onMouseEnter={e => {
        e.currentTarget.style.borderColor = COLOR.ochreOrange;
        e.currentTarget.style.color = COLOR.ochreOrange;
      }} onMouseLeave={e => {
        e.currentTarget.style.borderColor = border;
        e.currentTarget.style.color = muted;
      }}>Configure</button>}
          {(isEditing || isConfiguring) && <button onClick={e => {
        e.stopPropagation();
        onStopEdit();
      }} style={{
        padding: '4px 10px',
        background: COLOR.ochreOrange,
        border: 'none',
        cursor: 'pointer',
        fontSize: 9,
        fontWeight: 700,
        color: COLOR.milletClay
      }}>Done</button>}
          {!isEditing && !isConfiguring && <button onClick={e => {
        e.stopPropagation();
        onMoveUp();
      }} style={{
        padding: '4px 8px',
        background: 'transparent',
        border: `1px solid ${border}`,
        cursor: 'pointer',
        fontSize: 9,
        color: muted
      }} title="Move up">↑</button>}
          {!isEditing && !isConfiguring && <button onClick={e => {
        e.stopPropagation();
        onMoveDown();
      }} style={{
        padding: '4px 8px',
        background: 'transparent',
        border: `1px solid ${border}`,
        cursor: 'pointer',
        fontSize: 9,
        color: muted
      }} title="Move down">↓</button>}
          {!isEditing && !isConfiguring && <button onClick={e => {
        e.stopPropagation();
        onDelete();
      }} style={{
        padding: '4px 8px',
        background: 'transparent',
        border: `1px solid ${isDark ? 'rgba(232,225,207,0.10)' : 'rgba(30,26,23,0.10)'}`,
        cursor: 'pointer',
        fontSize: 9,
        fontWeight: 600,
        color: muted
      }} onMouseEnter={e => {
        e.currentTarget.style.borderColor = COLOR.firedRed;
        e.currentTarget.style.color = COLOR.firedRed;
      }} onMouseLeave={e => {
        e.currentTarget.style.borderColor = isDark ? 'rgba(232,225,207,0.10)' : 'rgba(30,26,23,0.10)';
        e.currentTarget.style.color = muted;
      }}>✕ Remove</button>}
          <span style={{
        fontSize: 8,
        color: muted,
        letterSpacing: '0.10em'
      }}>
            {isEditing ? 'Click Done or click outside to save' : isConfiguring ? 'Select option above, then Done' : isTextBlock ? 'Double-click to edit · drag ⠿ to reorder' : block.type.toUpperCase()}
          </span>
        </div>}
    </div>;
}

// ─── Insert Palette ───────────────────────────────────────────────────────────
const InsertPanel = ({
  isDark,
  onInsert
}: {
  isDark: boolean;
  onInsert: (item: InsertPaletteItem) => void;
}) => {
  const [activeCat, setActiveCat] = useState<string>('Text');
  const panelBg = isDark ? '#1C1713' : '#E0D8C6';
  const headerBg = isDark ? COLOR.darkCard : '#D5CEBB';
  const border = isDark ? 'rgba(232,225,207,0.08)' : 'rgba(30,26,23,0.10)';
  const fg = isDark ? COLOR.milletClay : COLOR.charBlack;
  const muted = isDark ? 'rgba(232,225,207,0.45)' : 'rgba(30,26,23,0.45)';
  const itemBg = isDark ? 'rgba(232,225,207,0.04)' : 'rgba(255,255,255,0.6)';
  const itemHoverBg = isDark ? 'rgba(232,225,207,0.08)' : '#FDFAF2';
  const filtered = INSERT_PALETTE.filter(item => item.category === activeCat);
  return <div style={{
    width: 210,
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
        marginBottom: 8
      }}>
          <PixelDot color={COLOR.ochreOrange} size={5} />
          <span style={{
          fontSize: 9,
          fontWeight: 700,
          letterSpacing: '0.16em',
          color: COLOR.ochreOrange,
          textTransform: 'uppercase' as const
        }}>Insert Block</span>
        </div>
        <div style={{
        display: 'flex',
        gap: 4,
        flexWrap: 'wrap' as const
      }}>
          {PALETTE_CATEGORIES.map(cat => <button key={`doc-cat-${cat}`} onClick={() => setActiveCat(cat)} style={{
          padding: '3px 8px',
          fontSize: 9,
          fontWeight: 700,
          letterSpacing: '0.12em',
          cursor: 'pointer',
          border: 'none',
          background: activeCat === cat ? COLOR.ochreOrange : 'transparent',
          color: activeCat === cat ? COLOR.milletClay : muted,
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
          {filtered.map(item => <button key={item.id} onClick={() => onInsert(item)} style={{
          background: itemBg,
          border: `1px solid ${border}`,
          padding: '10px 12px',
          cursor: 'pointer',
          textAlign: 'left',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          gap: 3
        }} onMouseEnter={e => {
          e.currentTarget.style.background = itemHoverBg;
          e.currentTarget.style.borderColor = `${item.hex}60`;
        }} onMouseLeave={e => {
          e.currentTarget.style.background = itemBg;
          e.currentTarget.style.borderColor = border;
        }}>
              <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6
          }}>
                <div style={{
              width: 8,
              height: 8,
              background: item.hex,
              flexShrink: 0
            }} />
                <span style={{
              fontSize: 11,
              fontWeight: 600,
              color: fg,
              lineHeight: 1.2
            }}>{item.label}</span>
              </div>
              <span style={{
            fontSize: 9,
            color: muted,
            lineHeight: 1.4
          }}>{item.desc}</span>
            </button>)}
        </div>
      </div>
    </div>;
};

// ─── Export Modal ─────────────────────────────────────────────────────────────
const DocExportModal = ({
  isDark,
  format,
  onClose
}: {
  isDark: boolean;
  format: 'PDF' | 'DOCX';
  onClose: () => void;
}) => {
  const [phase, setPhase] = useState<'options' | 'exporting' | 'done'>('options');
  const [progress, setProgress] = useState(0);
  const handleExport = () => {
    setPhase('exporting');
    setProgress(0);
    const steps = [10, 25, 40, 58, 74, 88, 100];
    let i = 0;
    const tick = () => {
      if (i < steps.length) {
        setProgress(steps[i]);
        i++;
        setTimeout(tick, 200 + Math.random() * 200);
      } else setTimeout(() => setPhase('done'), 300);
    };
    setTimeout(tick, 280);
  };
  const panelBg = isDark ? COLOR.darkCard : '#2A2420';
  const borderC = 'rgba(232,225,207,0.08)';
  const fg = COLOR.milletClay;
  const muted = 'rgba(232,225,207,0.45)';
  const formatColor = format === 'PDF' ? COLOR.ochreOrange : COLOR.mahanguGold;
  const exportOpts = [{
    label: 'Pages',
    value: 'Auto-paginated'
  }, {
    label: 'Format',
    value: format === 'PDF' ? 'A4 Portrait' : 'DOCX 2016+'
  }, {
    label: 'Fonts',
    value: 'Inter + Georgia embedded'
  }, {
    label: 'Branding',
    value: 'Letterhead + footer'
  }];
  const exportSteps = [{
    label: 'Composing document layout',
    done: progress >= 30
  }, {
    label: 'Rendering typography & brand',
    done: progress >= 60
  }, {
    label: format === 'PDF' ? 'Generating PDF stream' : 'Packaging DOCX archive',
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
      width: 420,
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
            <OkaandaLogoMark size={18} />
            <PixelTag hex={formatColor} label={`Export ${format}`} />
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
          gap: 18
        }}>
              <div>
                <p style={{
              fontSize: 14,
              fontWeight: 600,
              color: fg,
              margin: '0 0 4px'
            }}>Export as {format}</p>
                <p style={{
              fontSize: 12,
              color: muted,
              margin: 0,
              lineHeight: 1.6
            }}>
                  {format === 'PDF' ? 'High-fidelity PDF with embedded fonts and branded letterhead.' : 'Editable DOCX file with Okaanda branded styles applied.'}
                </p>
              </div>
              <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 8
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
              <DitherBar color={formatColor} segments={18} height={2} opacity={0.3} />
              <button onClick={handleExport} style={{
            width: '100%',
            padding: '12px',
            background: formatColor,
            border: 'none',
            cursor: 'pointer',
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: '0.10em',
            color: formatColor === COLOR.mahanguGold ? COLOR.charBlack : COLOR.milletClay,
            textTransform: 'uppercase' as const
          }} onMouseEnter={e => e.currentTarget.style.background = COLOR.firedRed} onMouseLeave={e => e.currentTarget.style.background = formatColor}>
                Generate {format} →
              </button>
            </div>}
          {phase === 'exporting' && <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 20,
          alignItems: 'center',
          padding: '8px 0'
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
                <OkaandaLogoMark size={28} />
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
              }}>Generating {format}…</span>
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
          padding: '8px 0'
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
              fontSize: 22,
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
            }}>Your {format} has been prepared.</p>
              </div>
              <DitherBar color={COLOR.mahanguGold} segments={14} height={3} opacity={0.6} />
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
                <button style={{
              flex: 2,
              padding: '10px',
              background: COLOR.mahanguGold,
              border: 'none',
              cursor: 'pointer',
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: '0.08em',
              color: COLOR.charBlack,
              textTransform: 'uppercase' as const
            }}>↓ Download {format}</button>
              </div>
            </div>}
        </div>
        <DitherBar color={formatColor} segments={55} height={2} opacity={0.2} />
      </motion.div>
    </div>;
};

// ─── Session storage keys ─────────────────────────────────────────────────────
const DOC_SESSION_KEY = 'okaanda_doc_editor_session';
interface DocSession {
  stage: 'picker' | 'editor';
  blocks: DocBlock[];
  docTitle: string;
}
function loadDocSession(): DocSession | null {
  try {
    const raw = localStorage.getItem(DOC_SESSION_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as DocSession;
  } catch {
    return null;
  }
}
function saveDocSession(session: DocSession) {
  try {
    localStorage.setItem(DOC_SESSION_KEY, JSON.stringify(session));
  } catch {
    // storage unavailable — silently skip
  }
}

// ─── useDocHistory — undo/redo stack ─────────────────────────────────────────
function useDocHistory(initial: DocBlock[]) {
  const [stack, setStack] = useState<DocBlock[][]>([initial]);
  const [cursor, setCursor] = useState(0);
  const current = stack[cursor];
  const push = useCallback((next: DocBlock[]) => {
    setStack(prev => {
      const trimmed = prev.slice(0, cursor + 1);
      return [...trimmed, next].slice(-60); // keep last 60 states
    });
    setCursor(prev => Math.min(prev + 1, 59));
  }, [cursor]);
  const undo = useCallback(() => {
    setCursor(prev => Math.max(0, prev - 1));
  }, []);
  const redo = useCallback(() => {
    setCursor(prev => {
      setStack(s => {
        const max = s.length - 1;
        return s;
      });
      return cursor < stack.length - 1 ? cursor + 1 : cursor;
    });
  }, [cursor, stack.length]);
  const canUndo = cursor > 0;
  const canRedo = cursor < stack.length - 1;

  // Seed when initial changes externally (on template select)
  const reset = useCallback((blocks: DocBlock[]) => {
    setStack([blocks]);
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

// ─── Document Toolbar ─────────────────────────────────────────────────────────
const DocToolbar = ({
  onClose,
  isDark,
  blockCount,
  docTitle,
  onTitleChange,
  onExport,
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  sessionSaved
}: {
  onClose: () => void;
  isDark: boolean;
  blockCount: number;
  docTitle: string;
  onTitleChange: (t: string) => void;
  onExport: (fmt: 'PDF' | 'DOCX') => void;
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
  sessionSaved: boolean;
}) => {
  const [editingTitle, setEditingTitle] = useState(false);
  const bg = isDark ? COLOR.darkCard : '#F3E8C3';
  const border = isDark ? 'rgba(232,225,207,0.08)' : 'rgba(30,26,23,0.10)';
  const fg = isDark ? COLOR.milletClay : COLOR.charBlack;
  const mutedFg = isDark ? 'rgba(232,225,207,0.45)' : 'rgba(30,26,23,0.45)';
  const fmtBtns: Array<'PDF' | 'DOCX'> = ['PDF', 'DOCX'];
  const btnBase: React.CSSProperties = {
    padding: '4px 10px',
    background: 'transparent',
    border: `1px solid ${border}`,
    cursor: 'pointer',
    fontSize: 10,
    fontWeight: 700,
    letterSpacing: '0.10em',
    color: mutedFg,
    display: 'flex',
    alignItems: 'center',
    gap: 4,
    transition: 'all 0.12s'
  };
  return <div style={{
    background: bg,
    borderBottom: `1px solid ${border}`,
    padding: '0 24px',
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
        color: mutedFg,
        fontSize: 12,
        fontWeight: 500,
        padding: '4px 0'
      }} onMouseEnter={e => e.currentTarget.style.color = COLOR.ochreOrange} onMouseLeave={e => e.currentTarget.style.color = mutedFg}>
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
          <PixelTag hex={COLOR.ochreOrange} label="DOC" />
          {editingTitle ? <input value={docTitle} onChange={e => onTitleChange(e.target.value)} onBlur={() => setEditingTitle(false)} onKeyDown={e => {
          if (e.key === 'Enter' || e.key === 'Escape') setEditingTitle(false);
        }} autoFocus style={{
          fontSize: 12,
          fontWeight: 500,
          color: fg,
          background: 'transparent',
          border: 'none',
          borderBottom: `1px solid ${COLOR.ochreOrange}80`,
          outline: 'none',
          letterSpacing: '0.06em'
        }} /> : <span style={{
          fontSize: 12,
          fontWeight: 500,
          color: fg,
          cursor: 'text'
        }} onDoubleClick={() => {
          setEditingTitle(true);
        }} title="Double-click to rename">{docTitle}</span>}
        </div>
        <span style={{
        fontSize: 9,
        color: mutedFg,
        letterSpacing: '0.08em'
      }}>· {blockCount} block{blockCount !== 1 ? 's' : ''}</span>
        {/* Session saved indicator */}
        {sessionSaved && <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 4
      }}>
          <div style={{
          width: 5,
          height: 5,
          background: COLOR.mahanguGold,
          opacity: 0.7
        }} />
          <span style={{
          fontSize: 8,
          color: mutedFg,
          letterSpacing: '0.10em'
        }}>saved</span>
        </div>}
      </div>
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
          e.currentTarget.style.color = COLOR.ochreOrange;
        }
      }} onMouseLeave={e => {
        e.currentTarget.style.borderColor = border;
        e.currentTarget.style.color = mutedFg;
      }}>
          <span style={{
          fontSize: 13,
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
          e.currentTarget.style.color = COLOR.ochreOrange;
        }
      }} onMouseLeave={e => {
        e.currentTarget.style.borderColor = border;
        e.currentTarget.style.color = mutedFg;
      }}>
          <span style={{
          fontSize: 13,
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
        {fmtBtns.map(fmt => <button key={`doc-export-${fmt}`} onClick={() => onExport(fmt)} style={{
        display: 'flex',
        alignItems: 'center',
        gap: 5,
        padding: '6px 14px',
        background: fmt === 'PDF' ? COLOR.ochreOrange : 'transparent',
        border: fmt === 'PDF' ? 'none' : `1px solid ${isDark ? 'rgba(232,225,207,0.15)' : 'rgba(30,26,23,0.15)'}`,
        cursor: 'pointer',
        fontSize: 10,
        fontWeight: 700,
        letterSpacing: '0.14em',
        textTransform: 'uppercase' as const,
        color: fmt === 'PDF' ? COLOR.milletClay : mutedFg
      }} onMouseEnter={e => {
        if (fmt === 'PDF') e.currentTarget.style.background = COLOR.firedRed;else {
          e.currentTarget.style.borderColor = COLOR.mahanguGold;
          e.currentTarget.style.color = COLOR.mahanguGold;
        }
      }} onMouseLeave={e => {
        if (fmt === 'PDF') e.currentTarget.style.background = COLOR.ochreOrange;else {
          e.currentTarget.style.borderColor = isDark ? 'rgba(232,225,207,0.15)' : 'rgba(30,26,23,0.15)';
          e.currentTarget.style.color = mutedFg;
        }
      }}>
            <PixelDot color="currentColor" size={4} />
            <span>Export {fmt}</span>
          </button>)}
      </div>
    </div>;
};

// ─── Document Letterhead ──────────────────────────────────────────────────────
const DocLetterhead = ({
  isDark,
  title
}: {
  isDark: boolean;
  title: string;
}) => {
  const fg = isDark ? COLOR.milletClay : COLOR.charBlack;
  const muted = isDark ? 'rgba(232,225,207,0.40)' : 'rgba(30,26,23,0.40)';
  const border = isDark ? 'rgba(232,225,207,0.10)' : 'rgba(30,26,23,0.10)';
  const dotColors = [COLOR.ochreOrange, COLOR.firedRed, COLOR.mahanguGold, COLOR.mopaneBrown, COLOR.dyePlum];
  return <div>
      <div style={{
      height: 3,
      background: COLOR.ochreOrange,
      width: '100%'
    }} />
      <DitherBar color={COLOR.ochreOrange} segments={48} height={2} opacity={0.25} />
      <div style={{
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      padding: '28px 56px 24px',
      borderBottom: `1px solid ${border}`,
      gap: 20
    }}>
        <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 10
      }}>
          <OkaandaLogoMark size={32} />
          <div>
            <p style={{
            fontSize: 14,
            fontWeight: 700,
            letterSpacing: '-0.01em',
            color: COLOR.ochreOrange,
            lineHeight: 1.1
          }}>Okaanda</p>
            <p style={{
            fontSize: 10,
            color: muted,
            letterSpacing: '0.05em',
            marginTop: 2
          }}>Namibia AI Systems Lab</p>
          </div>
        </div>
        <div style={{
        textAlign: 'right'
      }}>
          <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 6,
          padding: '3px 10px',
          border: `1px solid ${COLOR.ochreOrange}50`,
          marginBottom: 6
        }}>
            <PixelDot color={COLOR.ochreOrange} size={5} />
            <span style={{
            fontSize: 9,
            fontWeight: 700,
            letterSpacing: '0.18em',
            textTransform: 'uppercase' as const,
            color: COLOR.ochreOrange
          }}>Concept Paper</span>
          </div>
          <p style={{
          fontSize: 10,
          color: muted
        }}>2025</p>
        </div>
      </div>
      <div style={{
      padding: '36px 56px 28px'
    }}>
        <h1 style={{
        fontSize: 26,
        fontWeight: 700,
        letterSpacing: '-0.025em',
        color: fg,
        lineHeight: 1.2,
        marginBottom: 10,
        maxWidth: 600
      }}>{title}</h1>
        <p style={{
        fontSize: 13.5,
        color: isDark ? 'rgba(232,225,207,0.55)' : 'rgba(30,26,23,0.55)',
        lineHeight: 1.6,
        maxWidth: 520,
        marginBottom: 22
      }}>
          A two-track model for local AI capability, applied tooling, and institutional deployment.
        </p>
        <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8
      }}>
          {dotColors.map((c, i) => <div key={`lh-dot-${i}`} style={{
          width: 5,
          height: 5,
          background: c
        }} />)}
          <div style={{
          flex: 1,
          height: 1,
          background: border
        }} />
        </div>
      </div>
    </div>;
};

// ─── Template Picker ──────────────────────────────────────────────────────────
const TEMPLATE_OPTIONS = [{
  id: 'blank',
  label: 'Blank Document',
  desc: 'Start from scratch with an empty canvas',
  icon: '□',
  color: COLOR.ochreOrange
}, {
  id: 'concept',
  label: 'Concept Paper',
  desc: 'Namibia AI Capability and Tooling Platform — full one-page concept with all sections',
  icon: '▣',
  color: COLOR.barkRust
}];
const TemplatePicker = ({
  isDark,
  onSelect,
  onBack
}: {
  isDark: boolean;
  onSelect: (templateId: string, title: string) => void;
  onBack: () => void;
}) => {
  const bg = isDark ? COLOR.darkBg : COLOR.milletClay;
  const cardBg = isDark ? COLOR.darkCard : '#FDFAF2';
  const border = isDark ? 'rgba(232,225,207,0.10)' : 'rgba(30,26,23,0.08)';
  const fg = isDark ? COLOR.milletClay : COLOR.charBlack;
  const muted = isDark ? 'rgba(232,225,207,0.45)' : 'rgba(30,26,23,0.45)';
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
          <OkaandaLogoMark size={24} />
          <div style={{
          flex: 1
        }}>
            <p style={{
            fontSize: 10,
            color: COLOR.ochreOrange,
            fontWeight: 700,
            letterSpacing: '0.16em',
            textTransform: 'uppercase',
            margin: 0
          }}>Document Editor</p>
            <h1 style={{
            fontSize: 22,
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
          padding: '6px 14px',
          flexShrink: 0
        }} onMouseEnter={e => {
          e.currentTarget.style.borderColor = COLOR.ochreOrange;
          e.currentTarget.style.color = COLOR.ochreOrange;
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
        <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 16,
        marginBottom: 32
      }}>
          {TEMPLATE_OPTIONS.map(opt => <button key={opt.id} onClick={() => onSelect(opt.id, opt.id === 'blank' ? 'Untitled Document' : 'A Namibia-Focused AI Capability and Tooling Platform')} style={{
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
          e.currentTarget.style.background = isDark ? 'rgba(232,225,207,0.05)' : 'rgba(30,26,23,0.02)';
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
            fontSize: 20,
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
                  {opt.id === 'blank' ? 'Create' : 'Open template'}
                </span>
              </div>
            </button>)}
        </div>
        <DitherBar color={COLOR.ochreOrange} segments={30} height={2} opacity={0.2} />
      </div>
    </div>;
};

// ─── Main Export ──────────────────────────────────────────────────────────────
export const DocumentEditor = ({
  onClose
}: {
  onClose: () => void;
}) => {
  const {
    isDark
  } = useDark();

  // Session restore
  const savedSession = loadDocSession();
  const [stage, setStage] = useState<'picker' | 'editor'>(savedSession?.stage ?? 'picker');
  const [docTitle, setDocTitle] = useState(savedSession?.docTitle ?? 'Untitled Document');
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const [editingBlockId, setEditingBlockId] = useState<string | null>(null);
  const [configuringBlockId, setConfiguringBlockId] = useState<string | null>(null);
  const [exportModal, setExportModal] = useState<'PDF' | 'DOCX' | null>(null);
  const [dragState, setDragState] = useState<DragState>({
    draggingId: null,
    overIdx: null
  });
  const [sessionSaved, setSessionSaved] = useState(false);
  const history = useDocHistory(savedSession?.blocks ?? []);
  const blocks = history.current;
  const setBlocks = useCallback((updater: DocBlock[] | ((prev: DocBlock[]) => DocBlock[])) => {
    const next = typeof updater === 'function' ? updater(blocks) : updater;
    history.push(next);
  }, [blocks, history]);

  // Auto-save session to localStorage (debounced)
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    if (stage !== 'editor') return;
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(() => {
      saveDocSession({
        stage,
        blocks,
        docTitle
      });
      setSessionSaved(true);
      setTimeout(() => setSessionSaved(false), 1800);
    }, 800);
    return () => {
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    };
  }, [blocks, docTitle, stage]);

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
  const pageBg = isDark ? COLOR.darkBg : COLOR.milletClay;
  const paperBg = isDark ? COLOR.darkCard : '#FDFAF2';
  const paperBorder = isDark ? 'rgba(232,225,207,0.08)' : 'rgba(30,26,23,0.08)';
  const handleTemplateSelect = (templateId: string, title: string) => {
    setDocTitle(title);
    const newBlocks = templateId === 'blank' ? [] : TEMPLATE_BLOCKS.map(b => ({
      ...b
    }));
    history.reset(newBlocks);
    setStage('editor');
    saveDocSession({
      stage: 'editor',
      blocks: newBlocks,
      docTitle: title
    });
  };
  const handleInsert = useCallback((item: InsertPaletteItem) => {
    const newBlock: DocBlock = {
      id: `block-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      type: item.type,
      content: item.defaultContent,
      statValue: item.type === 'stat' ? '0' : undefined,
      statLabel: item.type === 'stat' ? item.label : undefined,
      statSub: item.type === 'stat' ? 'metric' : undefined,
      statHex: item.type === 'stat' ? item.hex : undefined,
      terminalIdx: item.type === 'terminal' ? 0 : undefined,
      timelinePhaseIdx: item.type === 'timeline' ? 0 : undefined,
      systemIdx: item.type === 'systemcard' ? 0 : undefined,
      flowNodeIdx: item.type === 'flowchart' ? 0 : undefined,
      chartTitle: item.type === 'chart-market' ? 'Global AI Market Growth' : undefined,
      barValues: item.type === 'chart-bar' ? JSON.stringify(DEFAULT_BAR_DATA) : undefined
    };
    setBlocks(prev => [...prev, newBlock]);
    setSelectedBlockId(newBlock.id);
    const isDesign = ['stat', 'terminal', 'heatmap', 'timeline', 'systemcard', 'flowchart', 'principles', 'swatchrow', 'chart-market', 'chart-bar'].includes(item.type);
    if (isDesign) setConfiguringBlockId(newBlock.id);else if (['heading', 'body', 'pullquote', 'callout', 'list', 'signature'].includes(item.type)) setEditingBlockId(newBlock.id);
  }, [setBlocks]);
  const handleEdit = useCallback((id: string, updates: Partial<DocBlock>) => {
    setBlocks(prev => prev.map(b => b.id === id ? {
      ...b,
      ...updates
    } : b));
  }, [setBlocks]);
  const handleDelete = useCallback((id: string) => {
    setBlocks(prev => prev.filter(b => b.id !== id));
    setSelectedBlockId(null);
    setEditingBlockId(null);
    setConfiguringBlockId(null);
  }, [setBlocks]);
  const handleMoveUp = useCallback((id: string) => {
    setBlocks(prev => {
      const idx = prev.findIndex(b => b.id === id);
      if (idx <= 0) return prev;
      const next = [...prev];
      [next[idx - 1], next[idx]] = [next[idx], next[idx - 1]];
      return next;
    });
  }, [setBlocks]);
  const handleMoveDown = useCallback((id: string) => {
    setBlocks(prev => {
      const idx = prev.findIndex(b => b.id === id);
      if (idx < 0 || idx >= prev.length - 1) return prev;
      const next = [...prev];
      [next[idx], next[idx + 1]] = [next[idx + 1], next[idx]];
      return next;
    });
  }, []);

  // Drag reorder
  const handleDragStart = useCallback((id: string) => {
    setDragState({
      draggingId: id,
      overIdx: null
    });
  }, []);
  const handleDragOver = useCallback((overIdx: number) => {
    setDragState(prev => ({
      ...prev,
      overIdx
    }));
  }, []);
  const handleDragEnd = useCallback(() => {
    setDragState(prev => {
      if (prev.draggingId && prev.overIdx !== null) {
        setBlocks(prevBlocks => {
          const fromIdx = prevBlocks.findIndex(b => b.id === prev.draggingId);
          if (fromIdx < 0 || fromIdx === prev.overIdx) return prevBlocks;
          const next = [...prevBlocks];
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
  }, [setBlocks]);
  const handleDeselect = () => {
    setSelectedBlockId(null);
    setEditingBlockId(null);
    setConfiguringBlockId(null);
  };
  if (stage === 'picker') {
    return <TemplatePicker isDark={isDark} onSelect={handleTemplateSelect} onBack={onClose} />;
  }
  return <div style={{
    minHeight: '100vh',
    background: pageBg,
    transition: 'background 0.35s',
    display: 'flex',
    flexDirection: 'column'
  }}>
      <DocToolbar onClose={onClose} isDark={isDark} blockCount={blocks.length} docTitle={docTitle} onTitleChange={setDocTitle} onExport={fmt => setExportModal(fmt)} canUndo={history.canUndo} canRedo={history.canRedo} onUndo={history.undo} onRedo={history.redo} sessionSaved={sessionSaved} />

      <div style={{
      display: 'flex',
      flex: 1,
      minHeight: 0,
      overflow: 'hidden'
    }}>
        <InsertPanel isDark={isDark} onInsert={handleInsert} />

        <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '36px 24px 80px'
      }} onClick={handleDeselect}>
          <div style={{
          maxWidth: 780,
          margin: '0 auto'
        }}>
            <motion.article initial={{
            opacity: 0,
            y: 20
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            duration: 0.5
          }} style={{
            background: paperBg,
            border: `1px solid ${paperBorder}`,
            boxShadow: isDark ? '0 8px 48px rgba(0,0,0,0.5)' : '0 8px 48px rgba(30,26,23,0.10)',
            position: 'relative',
            overflow: 'hidden'
          }} onClick={e => e.stopPropagation()}>
              <WeaveOverlay isDark={isDark} opacity={0.025} />
              <DocLetterhead isDark={isDark} title={docTitle} />

              <div style={{
              padding: '16px 56px 8px'
            }}>
                <AnimatePresence>
                  {blocks.map((block, idx) => <DocBlockView key={block.id} block={block} idx={idx} isDark={isDark} isSelected={selectedBlockId === block.id} isEditing={editingBlockId === block.id} isConfiguring={configuringBlockId === block.id} dragState={dragState} onSelect={() => setSelectedBlockId(block.id)} onStartEdit={() => {
                  setSelectedBlockId(block.id);
                  const isDesign = ['stat', 'terminal', 'heatmap', 'timeline', 'systemcard', 'flowchart', 'principles', 'swatchrow', 'chart-market', 'chart-bar'].includes(block.type);
                  if (isDesign) {
                    setConfiguringBlockId(block.id);
                    setEditingBlockId(null);
                  } else {
                    setEditingBlockId(block.id);
                    setConfiguringBlockId(null);
                  }
                }} onStopEdit={() => {
                  setEditingBlockId(null);
                  setConfiguringBlockId(null);
                }} onEdit={updates => handleEdit(block.id, updates)} onDelete={() => handleDelete(block.id)} onDragStart={() => handleDragStart(block.id)} onDragOver={() => handleDragOver(idx)} onDragEnd={handleDragEnd} onMoveUp={() => handleMoveUp(block.id)} onMoveDown={() => handleMoveDown(block.id)} />)}
                </AnimatePresence>

                {blocks.length === 0 && <div style={{
                padding: '80px 0',
                textAlign: 'center'
              }}>
                    <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 16
                }}>
                      <div style={{
                    display: 'flex',
                    gap: 4
                  }}>
                        {[COLOR.ochreOrange, COLOR.barkRust, COLOR.mahanguGold].map((c, i) => <div key={`empty-dot-${i}`} style={{
                      width: 6,
                      height: 6,
                      background: c,
                      opacity: 0.5
                    }} />)}
                      </div>
                      <p style={{
                    fontSize: 13,
                    color: isDark ? 'rgba(232,225,207,0.35)' : 'rgba(30,26,23,0.35)',
                    letterSpacing: '0.06em',
                    margin: 0
                  }}>
                        <span>Document is empty.</span>
                      </p>
                      <p style={{
                    fontSize: 11,
                    color: isDark ? 'rgba(232,225,207,0.25)' : 'rgba(30,26,23,0.25)',
                    margin: 0
                  }}>
                        <span>Use the Insert panel on the left to add blocks.</span>
                      </p>
                    </div>
                  </div>}
              </div>

              <div style={{
              padding: '16px 56px 36px'
            }}>
                <DitherBar color={COLOR.ochreOrange} segments={48} height={2} opacity={0.20} />
                <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginTop: 12
              }}>
                  <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6
                }}>
                    <OkaandaLogoMark size={14} />
                    <span style={{
                    fontSize: 9,
                    color: isDark ? 'rgba(232,225,207,0.30)' : 'rgba(30,26,23,0.30)',
                    letterSpacing: '0.08em'
                  }}>Okaanda · Namibia AI Systems Lab</span>
                  </div>
                  <span style={{
                  fontSize: 9,
                  color: isDark ? 'rgba(232,225,207,0.30)' : 'rgba(30,26,23,0.30)'
                }}>2025</span>
                </div>
              </div>
            </motion.article>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {exportModal && <DocExportModal isDark={isDark} format={exportModal} onClose={() => setExportModal(null)} />}
      </AnimatePresence>
    </div>;
};