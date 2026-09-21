// ─── Onganda Design System — Sections ────────────────────────────────────────
// All page-level section components. Each is self-contained and composable.
// Imports only from onganda-tokens and onganda-primitives.

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, useInView, useAnimation } from 'framer-motion';
import { COLOR, EDITOR_SURFACE, roles, onColor, inkOn, statusFor, SYSTEM_COLOR, SystemName, ColorRoles, StatusName, SYSTEMS, FLOW_NODES, GUIDE_ANNOTATIONS, PIXEL_RULES, STATS, TIMELINE_PHASES, TERMINAL_BLOCKS, HEATMAP_CELLS, HEATMAP_LABELS_X, HEATMAP_LABELS_Y, SECTOR_APPS, CONNECTION_EDGES, DIAGRAM_NODES, DIAGRAM_NODE_TOOLTIPS, TICKER_ITEMS, DITHER_COLS, HERO_LINE_1_WORDS, HERO_LINE_2_WORDS, HERO_LINE_3_WORDS, HERO_DITHER_COLORS, ConnectionEdge, HeatCell, TimelinePhase, DiagramNode, NodeTooltipData } from './onganda-tokens';
import { Px, PixelDot, DitherBar, SectionHeader, WeaveOverlay, PixelCornerMarks, PixelTag, PixelArrowDown, PixelButton, PixelIconButton, PixelField, DensityProvider, IconOkaanda, PixelInput, PixelTextarea, PixelSelect, PixelCheckbox, PixelRadio, PixelToggle, StatCard, TerminalCard, SystemCard, FlowNodeCard, FlowNodeIcon, FieldAppCard, AnnotationPanel, PrincipleRow, OngandaFooter, OngandaLogoMark, IconSun, IconMoon, useDark, CodeSnippetBlock, CodeSnippetLine } from './onganda-primitives';
import { TYPE } from './onganda-type';
import { ICON_REGISTRY, ICON_CATEGORIES, IconCategory } from './onganda-icons';
import { createPixelIcon, validatePixelIconDef, PixelIconDef, PixelRect } from './onganda-icon-factory';
import { PixelTicker, PixelFocusRow, PixelLabCard, PixelStatBand } from './onganda-site';
import { PixelNotice, PixelDialog, PixelTable, PixelEmptyState, PixelSkeleton, PixelTabs, PixelProgress, PixelPanel, PixelChoice, PixelChoiceList, PixelActions } from './onganda-patterns';
const LINE_1_COUNT = HERO_LINE_1_WORDS.length;
const LINE_2_COUNT = HERO_LINE_2_WORDS.length;

// ─── Section code snippet data (declared outside components per rules) ────────

const SNIPPET_SYSTEM_ARCH: CodeSnippetLine[] = [{
  type: 'comment',
  text: '// System Architecture — render a SystemCard'
}, {
  type: 'import',
  text: "import { SystemCard } from './onganda-primitives';"
}, {
  type: 'import',
  text: "import { SYSTEMS } from './onganda-tokens';"
}, {
  type: 'plain',
  text: ''
}, {
  type: 'comment',
  text: '// Map over SYSTEMS to render the grid'
}, {
  type: 'tag',
  text: '<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">'
}, {
  type: 'plain',
  text: '  {SYSTEMS.map((sys, idx) => ('
}, {
  type: 'tag',
  text: '    <SystemCard'
}, {
  type: 'prop',
  text: '      key={sys.name}'
}, {
  type: 'prop',
  text: '      sys={sys}'
}, {
  type: 'prop',
  text: '      idx={idx}'
}, {
  type: 'tag',
  text: '    />'
}, {
  type: 'plain',
  text: '  ))}'
}, {
  type: 'tag',
  text: '</div>'
}];
const SNIPPET_DEVELOPER_SURFACE: CodeSnippetLine[] = [{
  type: 'comment',
  text: '// Developer Surface — render a TerminalCard'
}, {
  type: 'import',
  text: "import { TerminalCard } from './onganda-primitives';"
}, {
  type: 'import',
  text: "import { TERMINAL_BLOCKS } from './onganda-tokens';"
}, {
  type: 'plain',
  text: ''
}, {
  type: 'comment',
  text: '// Each block has title, tag, tagHex, and an array of typed lines'
}, {
  type: 'plain',
  text: 'const block = {'
}, {
  type: 'prop',
  text: "  title: 'Oshini — Fine-Tune Pipeline',"
}, {
  type: 'prop',
  text: "  tag: '02', tagHex: '#8F3E21',"
}, {
  type: 'prop',
  text: '  lines: ['
}, {
  type: 'string',
  text: "    { type: 'comment', text: '# oshini · adaptation workflow' },"
}, {
  type: 'string',
  text: "    { type: 'keyword', text: 'from' },"
}, {
  type: 'string',
  text: "    { type: 'plain', text: ' oshini.pipeline import FineTuneJob' },"
}, {
  type: 'prop',
  text: '  ],'
}, {
  type: 'plain',
  text: '};'
}, {
  type: 'plain',
  text: ''
}, {
  type: 'tag',
  text: '<TerminalCard block={block} />'
}];
const SNIPPET_SYSTEM_CONNECTIONS: CodeSnippetLine[] = [{
  type: 'comment',
  text: '// System Connections — render a connection map'
}, {
  type: 'import',
  text: "import { DIAGRAM_NODES, CONNECTION_EDGES } from './onganda-tokens';"
}, {
  type: 'plain',
  text: ''
}, {
  type: 'comment',
  text: '// A DiagramNode entry'
}, {
  type: 'plain',
  text: 'const node = {'
}, {
  type: 'prop',
  text: "  id: 'Okaanda', label: 'Okaanda', sublabel: 'Granary',"
}, {
  type: 'prop',
  text: "  hex: '#D9791F', tag: '01', cx: 50, cy: 16,"
}, {
  type: 'plain',
  text: '};'
}, {
  type: 'plain',
  text: ''
}, {
  type: 'comment',
  text: '// A ConnectionEdge entry'
}, {
  type: 'plain',
  text: 'const edge = {'
}, {
  type: 'prop',
  text: "  from: 'Okaanda', to: 'Oshini',"
}, {
  type: 'prop',
  text: "  label: 'feeds raw data', color: '#D9791F',"
}, {
  type: 'plain',
  text: '};'
}];
const SNIPPET_MATERIAL_PALETTE: CodeSnippetLine[] = [{
  type: 'comment',
  text: '// Material Palette — render SwatchChips'
}, {
  type: 'import',
  text: "import { SwatchChip } from './onganda-primitives';"
}, {
  type: 'import',
  text: "import { SWATCHES } from './onganda-tokens';"
}, {
  type: 'plain',
  text: ''
}, {
  type: 'comment',
  text: '// Each swatch has name, hex, desc, light (bool)'
}, {
  type: 'tag',
  text: '<div className="grid grid-cols-3 sm:grid-cols-5 gap-2">'
}, {
  type: 'plain',
  text: '  {SWATCHES.map(sw => ('
}, {
  type: 'tag',
  text: '    <SwatchChip'
}, {
  type: 'prop',
  text: '      key={sw.hex}'
}, {
  type: 'prop',
  text: '      swatch={sw}'
}, {
  type: 'tag',
  text: '    />'
}, {
  type: 'plain',
  text: '  ))}'
}, {
  type: 'tag',
  text: '</div>'
}, {
  type: 'plain',
  text: ''
}, {
  type: 'comment',
  text: '// COLOR token reference'
}, {
  type: 'import',
  text: "import { COLOR } from './onganda-tokens';"
}, {
  type: 'plain',
  text: "// COLOR.ochreOrange → '#D9791F'"
}, {
  type: 'plain',
  text: "// COLOR.milletClay  → '#E8E1CF'"
}, {
  type: 'plain',
  text: "// COLOR.charBlack   → '#1E1A17'"
}];
const SNIPPET_RESEARCH_SIGNALS: CodeSnippetLine[] = [{
  type: 'comment',
  text: '// Research Signals — heatmap grid'
}, {
  type: 'import',
  text: "import { HEATMAP_CELLS, HEATMAP_LABELS_X, HEATMAP_LABELS_Y } from './onganda-tokens';"
}, {
  type: 'plain',
  text: ''
}, {
  type: 'comment',
  text: '// A HeatCell entry: { row, col, intensity (0–1) }'
}, {
  type: 'plain',
  text: 'const cell = { row: 0, col: 2, intensity: 0.6 };'
}, {
  type: 'plain',
  text: ''
}, {
  type: 'comment',
  text: '// Derive fill color from intensity'
}, {
  type: 'plain',
  text: 'const getHeatColor = (v: number) => {'
}, {
  type: 'keyword',
  text: '  if'
}, {
  type: 'plain',
  text: " (v > 0.85) return COLOR.firedRed;"
}, {
  type: 'keyword',
  text: '  if'
}, {
  type: 'plain',
  text: " (v > 0.65) return COLOR.ochreOrange;"
}, {
  type: 'keyword',
  text: '  if'
}, {
  type: 'plain',
  text: " (v > 0.45) return COLOR.mahanguGold;"
}, {
  type: 'plain',
  text: '};'
}, {
  type: 'plain',
  text: ''
}, {
  type: 'comment',
  text: '// Render a single cell'
}, {
  type: 'tag',
  text: '<div style={{ background: getHeatColor(cell.intensity) }} />'
}];
const SNIPPET_ROADMAP: CodeSnippetLine[] = [{
  type: 'comment',
  text: '// Development Roadmap — timeline phase'
}, {
  type: 'import',
  text: "import { TIMELINE_PHASES } from './onganda-tokens';"
}, {
  type: 'plain',
  text: ''
}, {
  type: 'comment',
  text: '// A TimelinePhase entry'
}, {
  type: 'plain',
  text: 'const phase = {'
}, {
  type: 'prop',
  text: "  tag: 'P–01', oshiwambo: 'Ouheke', english: 'Foundation',"
}, {
  type: 'prop',
  text: "  period: 'Q1 – Q2 2024', hex: '#D9791F',"
}, {
  type: 'prop',
  text: "  progress: 100, status: 'complete',"
}, {
  type: 'prop',
  text: "  milestones: ['Corpus v1 ingested', 'Okaanda granary deployed'],"
}, {
  type: 'plain',
  text: '};'
}, {
  type: 'plain',
  text: ''
}, {
  type: 'comment',
  text: '// Progress bar (animated with framer-motion)'
}, {
  type: 'tag',
  text: '<motion.div'
}, {
  type: 'prop',
  text: '  animate={{ width: `${phase.progress}%` }}'
}, {
  type: 'prop',
  text: '  style={{ background: phase.hex, height: 12 }}'
}, {
  type: 'tag',
  text: '/>'
}];
const SNIPPET_BRAND_PRINCIPLES: CodeSnippetLine[] = [{
  type: 'comment',
  text: '// Brand Principles — render PrincipleRow'
}, {
  type: 'import',
  text: "import { PrincipleRow } from './onganda-primitives';"
}, {
  type: 'import',
  text: "import { PRINCIPLES } from './onganda-tokens';"
}, {
  type: 'plain',
  text: ''
}, {
  type: 'comment',
  text: '// A PrincipleEntry: { label: string, value: string }'
}, {
  type: 'tag',
  text: '<dl className="divide-y divide-[#1E1A17]/10">'
}, {
  type: 'plain',
  text: '  {PRINCIPLES.map((p, i) => ('
}, {
  type: 'tag',
  text: '    <PrincipleRow'
}, {
  type: 'prop',
  text: '      key={p.label}'
}, {
  type: 'prop',
  text: '      principle={p}'
}, {
  type: 'prop',
  text: '      idx={i}'
}, {
  type: 'tag',
  text: '    />'
}, {
  type: 'plain',
  text: '  ))}'
}, {
  type: 'tag',
  text: '</dl>'
}];
const SNIPPET_ICON_BANK: CodeSnippetLine[] = [{
  type: 'comment',
  text: '// Icon Bank — import and use pixel icons'
}, {
  type: 'import',
  text: "import { IconSearch, IconUser, IconCheck } from './onganda-icons';"
}, {
  type: 'plain',
  text: ''
}, {
  type: 'comment',
  text: '// All icons use a 12×12 pixel grid, rect-only, currentColor'
}, {
  type: 'tag',
  text: '<IconSearch'
}, {
  type: 'prop',
  text: '  size={16}'
}, {
  type: 'prop',
  text: "  color='#D9791F'"
}, {
  type: 'tag',
  text: '/>'
}, {
  type: 'plain',
  text: ''
}, {
  type: 'comment',
  text: '// ICON_REGISTRY entry shape:'
}, {
  type: 'plain',
  text: '// { id, name, category, component: React.FC<{size?,color?,opacity?}> }'
}, {
  type: 'plain',
  text: ''
}, {
  type: 'comment',
  text: '// Browse all icons (click any to copy import)'
}, {
  type: 'import',
  text: "import { ICON_REGISTRY, ICON_CATEGORIES } from './onganda-icons';"
}];
const SNIPPET_FIELD_APPS: CodeSnippetLine[] = [{
  type: 'comment',
  text: '// Field Applications — render FieldAppCard'
}, {
  type: 'import',
  text: "import { FieldAppCard } from './onganda-primitives';"
}, {
  type: 'import',
  text: "import { SECTOR_APPS } from './onganda-tokens';"
}, {
  type: 'plain',
  text: ''
}, {
  type: 'comment',
  text: '// A SectorApp entry'
}, {
  type: 'plain',
  text: 'const app = {'
}, {
  type: 'prop',
  text: "  name: 'OshitooHealth', oshiwambo: 'Oshitoo',"
}, {
  type: 'prop',
  text: "  sector: 'Healthcare', hex: '#6F4A6E', tag: 'H–01',"
}, {
  type: 'prop',
  text: "  desc: 'AI triage and clinical decision support...',"
}, {
  type: 'plain',
  text: '};'
}, {
  type: 'plain',
  text: ''
}, {
  type: 'tag',
  text: '<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">'
}, {
  type: 'plain',
  text: '  {SECTOR_APPS.map((app, idx) => ('
}, {
  type: 'tag',
  text: '    <FieldAppCard key={app.tag} app={app} idx={idx} />'
}, {
  type: 'plain',
  text: '  ))}'
}, {
  type: 'tag',
  text: '</div>'
}];
const SNIPPET_BRAND_GUIDE: CodeSnippetLine[] = [{
  type: 'comment',
  text: '// Brand Guide — FlowNodeCard naming hierarchy'
}, {
  type: 'import',
  text: "import { FlowNodeCard, FlowNodeIcon } from './onganda-primitives';"
}, {
  type: 'import',
  text: "import { FLOW_NODES } from './onganda-tokens';"
}, {
  type: 'plain',
  text: ''
}, {
  type: 'comment',
  text: '// A FlowNodeEntry'
}, {
  type: 'plain',
  text: 'const node = {'
}, {
  type: 'prop',
  text: "  id: 'mill', oshiwambo: 'Oshini', english: 'Mill',"
}, {
  type: 'prop',
  text: "  role: 'Adaptation Workflows', hex: '#8F3E21',"
}, {
  type: 'prop',
  text: "  pixelTag: '02', isRoot: false,"
}, {
  type: 'plain',
  text: '};'
}, {
  type: 'plain',
  text: ''
}, {
  type: 'comment',
  text: '// Render with hover state'
}, {
  type: 'tag',
  text: '<FlowNodeCard'
}, {
  type: 'prop',
  text: '  node={node}'
}, {
  type: 'prop',
  text: '  isHovered={false}'
}, {
  type: 'tag',
  text: '/>'
}];

// ─── OngandaNav ───────────────────────────────────────────────────────────────
export const OngandaNav = () => {
  const {
    isDark,
    toggle
  } = useDark();
  const bg = isDark ? COLOR.darkBg : COLOR.milletClay;
  const border = isDark ? 'rgba(232,225,207,0.08)' : 'rgba(30,26,23,0.10)';
  const linkColor = isDark ? 'rgba(232,225,207,0.55)' : 'rgba(30,26,23,0.66)';
  const subtitleColor = isDark ? 'rgba(232,225,207,0.55)' : 'rgba(30,26,23,0.70)';
  const dotColor = isDark ? 'rgba(232,225,207,0.3)' : 'rgba(30,26,23,0.4)';
  const NAV_ITEMS = [{
    label: 'Systems',
    href: '#systems'
  }, {
    label: 'Palette',
    href: '#palette'
  }, {
    label: 'Principles',
    href: '#language'
  }, {
    label: 'Icons',
    href: '#icon-bank'
  }, {
    label: 'Factory',
    href: '#icon-factory'
  }, {
    label: 'Brand Guide',
    href: '#brand-guide'
  }, {
    label: 'Documents',
    href: '#publications'
  }];
  return <nav style={{
    width: '100%',
    padding: '24px 48px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottom: `1px solid ${border}`,
    background: bg,
    transition: 'background 0.35s, border-color 0.35s'
  }}>
      <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: 12
    }}>
        <OngandaLogoMark size={28} />
        <span style={{
        fontWeight: 600,
        letterSpacing: '-0.01em',
        fontSize: 14,
        lineHeight: 1
      }}>
          <span style={{
          color: roles(isDark).accentInk
        }}>Onganda</span>
          <span style={{
          color: dotColor,
          margin: '0 8px',
          fontWeight: 300
        }}>·</span>
          <span style={{
          color: subtitleColor,
          fontWeight: 400,
          fontSize: 14
        }}>Namibia AI Systems Lab</span>
        </span>
      </div>
      <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: 32
    }}>
        {/* Seven links need ~676px of text alone, so the row appears at lg
            rather than md. Below that the nav keeps its logo and mode switch,
            the same as it already did on phones. */}
        <div className="hidden items-center gap-[18px] lg:flex lg:gap-6 xl:gap-8">
          {NAV_ITEMS.map(item => <a key={item.label} href={item.href} style={{
          fontSize: 14,
          fontWeight: 500,
          color: linkColor,
          textDecoration: 'none',
          transition: 'color 0.2s'
        }} onMouseEnter={e => e.currentTarget.style.color = roles(isDark).accentInk} onMouseLeave={e => e.currentTarget.style.color = linkColor}>
              {item.label}
            </a>)}
          <div aria-hidden="true" style={{
          width: 1,
          height: 16,
          background: border
        }} />
          {[{
          label: 'Home',
          href: '/'
        }, {
          label: 'Full site',
          href: '/full'
        }].map(item => <a key={item.label} href={item.href} style={{
          fontSize: 14,
          fontWeight: 600,
          color: roles(isDark).accentInk,
          textDecoration: 'none',
          transition: 'color 0.2s'
        }} onMouseEnter={e => e.currentTarget.style.color = roles(isDark).text} onMouseLeave={e => e.currentTarget.style.color = roles(isDark).accentInk}>
              {item.label}
            </a>)}
        </div>
        {/* TODO: dark mode — remove disabled attribute and wire toggle once COLOR token audit is complete */}
        <motion.button disabled title="Dark mode — coming soon" aria-label="Dark mode — coming soon" whileTap={{
        scale: 0.88
      }} style={{
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        padding: '6px 10px',
        border: `1px solid rgba(30,26,23,0.2)`,
        background: 'rgba(30,26,23,0.04)',
        color: 'rgba(30,26,23,0.66)',
        cursor: 'not-allowed',
        opacity: 0.45,
        transition: 'background 0.25s, border-color 0.25s, color 0.25s'
      }}>
          <motion.span key={isDark ? 'moon' : 'sun'} initial={{
          opacity: 0,
          scale: 0.6,
          rotate: -30
        }} animate={{
          opacity: 1,
          scale: 1,
          rotate: 0
        }} transition={{
          duration: 0.22,
          ease: 'easeOut'
        }} style={{
          display: 'flex',
          alignItems: 'center'
        }}>
            {isDark ? <IconMoon /> : <IconSun />}
          </motion.span>
          <span style={{
          fontSize: 9,
          fontWeight: 700,
          letterSpacing: '0.16em',
          textTransform: 'uppercase'
        }} className="hidden sm:inline">
            {isDark ? 'Light' : 'Dark'}
          </span>
        </motion.button>
      </div>
    </nav>;
};

// ─── OngandaHero ─────────────────────────────────────────────────────────────
export const OngandaHero = () => {
  const CORNER_CHIPS = [{
    text: 'Applied Sovereign AI',
    hex: COLOR.ochreOrange,
    pos: {
      top: '10%',
      left: '4%'
    },
    dy: -6,
    delay: 1.0,
    ix: -14
  }, {
    text: 'Oshiwambo by name',
    hex: COLOR.barkRust,
    pos: {
      top: '13%',
      right: '4%'
    },
    dy: 7,
    delay: 1.1,
    ix: 14
  }, {
    text: 'Material by palette',
    hex: COLOR.mahanguGold,
    pos: {
      bottom: '20%',
      left: '4%'
    },
    dy: 8,
    delay: 1.2,
    ix: -14
  }, {
    text: 'Windhoek, Namibia',
    hex: COLOR.mopaneBrown,
    pos: {
      bottom: '24%',
      right: '4%'
    },
    dy: -7,
    delay: 1.3,
    ix: 14
  }];
  return <header style={{
    position: 'relative',
    width: '100%',
    minHeight: '100svh',
    background: COLOR.milletClay,
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  }}>
      <WeaveOverlay isDark={false} opacity={0.022} />

      {/* Basket-centre glow */}
      <div aria-hidden="true" style={{
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: '72vw',
      maxWidth: 820,
      aspectRatio: '1 / 1',
      pointerEvents: 'none',
      zIndex: 1
    }}>
        <div style={{
        position: 'absolute',
        inset: 0,
        background: 'radial-gradient(circle at 50% 50%, rgba(217,121,31,0.10) 0%, rgba(217,121,31,0.04) 38%, transparent 70%)'
      }} />
        <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%'
      }}>
          <motion.ellipse cx="100" cy="100" rx="88" ry="88" stroke="#D9791F" strokeWidth="0.55" strokeDasharray="4 6" strokeLinecap="square" strokeOpacity="0.18" animate={{
          scale: [1, 1.025, 1],
          opacity: [0.18, 0.28, 0.18]
        }} transition={{
          duration: 9,
          repeat: Infinity,
          ease: 'easeInOut'
        }} style={{
          transformOrigin: '100px 100px'
        }} />
          <motion.ellipse cx="100" cy="100" rx="64" ry="64" stroke="#C84A1B" strokeWidth="0.5" strokeDasharray="3 5" strokeLinecap="square" strokeOpacity="0.14" animate={{
          scale: [1, 1.035, 1],
          opacity: [0.14, 0.24, 0.14]
        }} transition={{
          duration: 7,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 1.2
        }} style={{
          transformOrigin: '100px 100px'
        }} />
          <motion.ellipse cx="100" cy="100" rx="38" ry="38" stroke="#D9791F" strokeWidth="0.7" strokeDasharray="2 4" strokeLinecap="square" strokeOpacity="0.22" animate={{
          scale: [1, 1.06, 1],
          opacity: [0.22, 0.38, 0.22]
        }} transition={{
          duration: 5,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 0.5
        }} style={{
          transformOrigin: '100px 100px'
        }} />
          <motion.rect x="97" y="97" width="6" height="6" fill="#D9791F" fillOpacity="0.35" animate={{
          opacity: [0.35, 0.6, 0.35],
          scale: [1, 1.15, 1]
        }} transition={{
          duration: 4,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 0.2
        }} style={{
          transformOrigin: '100px 100px'
        }} />
          {([{
          x: 98,
          y: 58
        }, {
          x: 98,
          y: 138
        }, {
          x: 58,
          y: 98
        }, {
          x: 138,
          y: 98
        }] as {
          x: number;
          y: number;
        }[]).map((pt, i) => <motion.rect key={`stitch-${i}`} x={pt.x} y={pt.y} width="4" height="4" fill="#8F3E21" fillOpacity="0.22" animate={{
          opacity: [0.22, 0.40, 0.22]
        }} transition={{
          duration: 6,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: i * 0.6
        }} />)}
        </svg>
      </div>

      {/* Dither columns */}
      {[{
      side: 'left',
      cols: DITHER_COLS.slice(0, 2),
      yDir: -80
    }, {
      side: 'right',
      cols: DITHER_COLS.slice(2, 4),
      yDir: 80
    }].map(strip => <div key={strip.side} aria-hidden="true" style={{
      position: 'absolute',
      top: 0,
      [strip.side]: 0,
      bottom: 0,
      width: 20,
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden'
    }}>
          {strip.cols.map((col, ci) => <motion.div key={`d${strip.side}-${ci}`} initial={{
        opacity: 0
      }} animate={{
        opacity: 1,
        y: [0, strip.yDir, 0]
      }} transition={{
        opacity: {
          delay: 0.8 + ci * 0.1,
          duration: 0.5
        },
        y: {
          duration: 18 + ci * 4,
          repeat: Infinity,
          ease: 'linear',
          delay: col.delay
        }
      }} style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 0,
        width: 10,
        marginLeft: ci * 10
      }}>
              {col.colors.concat(col.colors).concat(col.colors).map((c, pi) => <div key={`dp-${ci}-${pi}`} style={{
          width: 10,
          height: 10,
          background: c,
          opacity: pi % 3 === 0 ? 0.55 : pi % 3 === 1 ? 0.22 : 0.08
        }} />)}
            </motion.div>)}
        </div>)}

      {/* Corner chips */}
      {CORNER_CHIPS.map((chip, ci) => <motion.div key={`chip-${ci}`} initial={{
      opacity: 0,
      x: chip.ix
    }} animate={{
      opacity: 1,
      x: 0
    }} transition={{
      delay: chip.delay,
      duration: 0.5
    }} style={{
      position: 'absolute',
      zIndex: 4,
      ...chip.pos
    }}>
          <motion.div animate={{
        y: [0, chip.dy, 0]
      }} transition={{
        duration: 8 + ci * 1.5,
        repeat: Infinity,
        ease: 'easeInOut',
        delay: ci * 0.5
      }} style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 8,
        border: '1px solid rgba(30,26,23,0.1)',
        background: 'rgba(243,232,195,0.9)',
        padding: '6px 12px'
      }}>
            <PixelDot color={chip.hex} size={5} />
            <span style={{
          fontSize: 10,
          fontWeight: 700,
          letterSpacing: '0.16em',
          textTransform: 'uppercase',
          color: 'rgba(30,26,23,0.66)'
        }}>
              {chip.text}
            </span>
          </motion.div>
        </motion.div>)}

      {/* Headline */}
      <div style={{
      position: 'relative',
      zIndex: 2,
      width: '100%',
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'center',
      gap: '0 0.28em',
      overflow: 'hidden',
      lineHeight: 1.08
    }}>
        <h1 style={{
        margin: 0,
        padding: 0,
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: '0 0.28em',
        overflow: 'hidden',
        lineHeight: 1.08
      }}>
          {HERO_LINE_1_WORDS.map((word, wi) => <span key={`l1w-${wi}`} style={{
          display: 'block',
          overflow: 'hidden',
          lineHeight: 1.08
        }}>
              <motion.span initial={{
            y: '110%',
            opacity: 0
          }} animate={{
            y: '0%',
            opacity: 1
          }} transition={{
            duration: 0.72,
            delay: 0.05 + wi * 0.12,
            ease: [0.16, 1, 0.3, 1]
          }} style={{
            display: 'block',
            fontSize: 'var(--type-hero)',
            fontWeight: 700,
            letterSpacing: '-0.04em',
            color: word.color,
            whiteSpace: 'normal',
        textAlign: 'center'
          }}>
                {word.text}
              </motion.span>
            </span>)}
        </h1>

        {/* Ticker */}
        <div style={{
        width: '100vw',
        overflow: 'hidden',
        borderTop: '1px solid rgba(30,26,23,0.1)',
        borderBottom: '1px solid rgba(30,26,23,0.1)',
        background: COLOR.charBlack,
        margin: '0.4em 0'
      }} aria-hidden="true">
          <motion.div animate={{
          x: ['0%', '-50%']
        }} transition={{
          duration: 28,
          repeat: Infinity,
          ease: 'linear'
        }} style={{
          display: 'flex',
          alignItems: 'center',
          gap: 0,
          whiteSpace: 'nowrap',
          width: 'max-content',
          padding: '10px 0'
        }}>
            {TICKER_ITEMS.map((item, i) => <div key={`tick-${i}`} style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6
          }}>
                <div style={{
              width: 5,
              height: 5,
              background: item.hex,
              marginRight: 10,
              flexShrink: 0
            }} aria-hidden="true" />
                <span style={{
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color: item.hex,
              marginRight: 6
            }}>{item.name}</span>
                <span style={{
              fontSize: 10,
              fontWeight: 400,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: 'rgba(232,225,207,0.55)',
              marginRight: 32
            }}>{item.role}</span>
                <div style={{
              width: 1,
              height: 14,
              background: 'rgba(232,225,207,0.1)',
              marginRight: 32
            }} />
              </div>)}
          </motion.div>
        </div>

        <p style={{
        margin: 0,
        padding: 0,
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: '0 0.28em',
        overflow: 'hidden',
        lineHeight: 1.0
      }}>
          {HERO_LINE_2_WORDS.map((word, wi) => <span key={`l2w-${wi}`} style={{
          display: 'block',
          overflow: 'hidden',
          lineHeight: 1.08
        }}>
              <motion.span initial={{
            y: '110%',
            opacity: 0
          }} animate={{
            y: '0%',
            opacity: 1
          }} transition={{
            duration: 0.72,
            delay: 0.05 + (LINE_1_COUNT + wi) * 0.12,
            ease: [0.16, 1, 0.3, 1]
          }} style={{
            display: 'block',
            fontSize: 'var(--type-hero)',
            fontWeight: 700,
            letterSpacing: '-0.04em',
            color: word.color,
            whiteSpace: 'nowrap'
          }}>
                {word.text}
              </motion.span>
            </span>)}
        </p>

        <p style={{
        margin: 0,
        marginTop: '0.05em',
        padding: 0,
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: '0 0.28em',
        overflow: 'hidden',
        lineHeight: 1.0
      }}>
          {HERO_LINE_3_WORDS.map((word, wi) => <span key={`l3w-${wi}`} style={{
          display: 'block',
          overflow: 'hidden',
          lineHeight: 1.08
        }}>
              <motion.span initial={{
            y: '110%',
            opacity: 0
          }} animate={{
            y: '0%',
            opacity: 0.18
          }} transition={{
            duration: 0.72,
            delay: 0.05 + (LINE_1_COUNT + LINE_2_COUNT + wi) * 0.12,
            ease: [0.16, 1, 0.3, 1]
          }} style={{
            display: 'block',
            fontSize: 'var(--type-hero)',
            fontWeight: 700,
            letterSpacing: '-0.04em',
            color: word.color,
            whiteSpace: 'nowrap'
          }}>
                {word.text}
              </motion.span>
            </span>)}
          {/* Blinking cursor */}
          <span style={{
          display: 'block',
          overflow: 'hidden',
          lineHeight: 1.08
        }} aria-hidden="true">
            <motion.span initial={{
            opacity: 0,
            y: '110%'
          }} animate={{
            opacity: [0, 0, 0.45, 0, 0.45],
            y: '0%'
          }} transition={{
            y: {
              duration: 0.72,
              delay: 0.05 + (LINE_1_COUNT + LINE_2_COUNT + HERO_LINE_3_WORDS.length - 1) * 0.12 + 0.68,
              ease: [0.16, 1, 0.3, 1]
            },
            opacity: {
              duration: 1.1,
              delay: 0.05 + (LINE_1_COUNT + LINE_2_COUNT + HERO_LINE_3_WORDS.length - 1) * 0.12 + 0.68,
              repeat: Infinity,
              ease: 'linear'
            }
          }} style={{
            display: 'inline-block',
            width: 'var(--type-hero-gap)',
            height: '0.72em',
            background: COLOR.ochreOrange,
            verticalAlign: 'baseline',
            marginLeft: '0.08em',
            marginBottom: '0.06em',
            fontSize: 'var(--type-hero)',
            lineHeight: 1.08,
            flexShrink: 0
          }} />
          </span>
        </p>
      </div>

      {/* Bottom anchor */}
      <div style={{
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      zIndex: 5,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      paddingBottom: '2.5rem',
      gap: 14
    }}>
        <motion.p initial={{
        opacity: 0,
        y: 10
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        delay: 1.0,
        duration: 0.6
      }} style={{
        fontSize: 'var(--type-subhead)',
        color: 'rgba(30,26,23,0.66)',
        letterSpacing: '0.01em',
        lineHeight: 1.7,
        textAlign: 'center',
        maxWidth: 440,
        padding: '0 1.5rem'
      }}>
          Five systems. One sovereign lab. Intelligence built from millet, clay, bark, and ochre.
        </motion.p>
        <motion.div initial={{
        opacity: 0,
        y: 8
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        delay: 1.15,
        duration: 0.5
      }} style={{
        display: 'flex',
        gap: 10,
        flexWrap: 'wrap',
        justifyContent: 'center'
      }}>
          <PixelButton href="#systems" variant="primary">
            <span>Explore systems</span>
            <Px size={12} viewBox="0 0 8 8">
              <rect x="0" y="3" width="6" height="2" fill="currentColor" />
              <rect x="4" y="1" width="2" height="2" fill="currentColor" />
              <rect x="4" y="5" width="2" height="2" fill="currentColor" />
            </Px>
          </PixelButton>
          <PixelButton href="#brand-guide" variant="ghost">Brand guide</PixelButton>
        </motion.div>
        <motion.div initial={{
        opacity: 0
      }} animate={{
        opacity: 1
      }} transition={{
        delay: 1.4,
        duration: 0.5
      }} style={{
        display: 'flex',
        gap: 3,
        alignItems: 'center',
        marginTop: 4
      }} aria-hidden="true">
          {[0, 1, 2, 3, 4].map(i => <div key={`sh-${i}`} className="w-2 h-2" style={{
          background: HERO_DITHER_COLORS[i],
          opacity: 0.4
        }} />)}
        </motion.div>
      </div>
    </header>;
};

// ─── ResearchSignals ─────────────────────────────────────────────────────────
export const ResearchSignals = () => <section className="w-full border-y border-[#1E1A17]/10 bg-[#F3E8C3]">
    <div className="max-w-7xl mx-auto px-6 md:px-12">
      <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-[#1E1A17]/10">
        {STATS.map(stat => <StatCard key={stat.label} stat={stat} />)}
      </div>
    </div>
  </section>;

// ─── PixelTerminal ────────────────────────────────────────────────────────────
export const PixelTerminal = () => <section className="max-w-7xl mx-auto px-6 pb-24 md:px-12">
    <SectionHeader label="Developer Surface" headline="Code that speaks Oshiwambo." accent={COLOR.barkRust} />
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
      {TERMINAL_BLOCKS.map(block => <TerminalCard key={block.title} block={block} />)}
    </div>
    <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2">
      <div className="flex-1 h-px bg-[#1E1A17]/8" />
      <span className="min-w-0 text-center text-[10px] font-bold uppercase tracking-[0.15em] text-[#1E1A17]/66">Oshini SDK · Okaanda Client · Ombiga Runtime</span>
      <div className="flex-1 h-px bg-[#1E1A17]/8" />
    </div>
    <CodeSnippetBlock label="TerminalCard · Developer Surface" lines={SNIPPET_DEVELOPER_SURFACE} accentHex="#8F3E21" />
  </section>;

// ─── SystemConnectionDiagram ─────────────────────────────────────────────────
export const SystemConnectionDiagram = ({
  nodes = DIAGRAM_NODES,
  edges = CONNECTION_EDGES,
  tooltips = DIAGRAM_NODE_TOOLTIPS
}: {
  nodes?: DiagramNode[];
  edges?: ConnectionEdge[];
  tooltips?: Record<string, NodeTooltipData>;
} = {}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, {
    once: true,
    margin: '-60px'
  });
  const [activeNode, setActiveNode] = useState<string | null>(null);
  const [activatedEdges, setActivatedEdges] = useState<number[]>([]);
  const controls = useAnimation();
  useEffect(() => {
    if (!isInView) return;
    controls.start('visible');
    edges.forEach((_, i) => {
      setTimeout(() => setActivatedEdges(prev => [...prev, i]), 400 + i * 220);
    });
  }, [isInView, controls, edges]);
  const getNodeById = (id: string) => nodes.find(n => n.id === id);
  const isEdgeActive = (idx: number) => activatedEdges.includes(idx);
  const isEdgeHighlighted = (edge: ConnectionEdge) => activeNode === null || edge.from === activeNode || edge.to === activeNode;

  const nodePos = (id: string) => {
    const n = getNodeById(id);
    return n ? {
      x: n.cx,
      y: n.cy
    } : {
      x: 50,
      y: 50
    };
  };
  return <section id="connection-diagram" className="max-w-7xl mx-auto px-6 pb-24 md:px-12" ref={containerRef}>
      <SectionHeader label="System Connections" headline="How the workshop talks to itself." accent={COLOR.mopaneBrown} />
      <div className="flex flex-col lg:flex-row gap-10 items-start">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-4 mb-6">
            <div className="flex gap-1" aria-hidden="true">
              {([COLOR.ochreOrange, COLOR.barkRust, COLOR.mahanguGold, COLOR.mopaneBrown, COLOR.dyePlum] as string[]).map((c, i) => <div key={`cd-leg-${i}`} className="h-1.5" style={{
              width: 8,
              background: c,
              opacity: 0.12 + i * 0.1
            }} />)}
            </div>
            <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#1E1A17]/66">Pixel Connection Map — Data Flow</span>
          </div>
          <div className="bg-[#1E1A17]" style={{
          position: 'relative',
          width: '100%',
          paddingBottom: '82%'
        }}>
            <WeaveOverlay isDark opacity={0.05} />
            <svg style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%'
          }} viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
              <defs>
                {edges.map((edge, i) => <marker key={`marker-${i}`} id={`arrowhead-${i}`} markerWidth="4" markerHeight="4" refX="3" refY="2" orient="auto">
                    <polygon points="0 0, 4 2, 0 4" fill={edge.color} fillOpacity={isEdgeActive(i) ? 0.85 : 0.2} />
                  </marker>)}
              </defs>
              {edges.map((edge, i) => {
              const from = nodePos(edge.from);
              const to = nodePos(edge.to);
              const highlighted = isEdgeHighlighted(edge);
              const active = isEdgeActive(i);
              const midX = (from.x + to.x) / 2 + (i % 2 === 0 ? 6 : -6);
              const midY = (from.y + to.y) / 2 + (i % 3 === 0 ? -8 : 5);
              const pathD = `M ${from.x} ${from.y} Q ${midX} ${midY} ${to.x} ${to.y}`;
              return <g key={`edge-${i}`}>
                    <path d={pathD} stroke={edge.color} strokeWidth="0.4" strokeOpacity={highlighted ? 0.15 : 0.05} fill="none" strokeDasharray="1.5 2" />
                    {active && <motion.path d={pathD} stroke={edge.color} strokeWidth={highlighted ? 0.7 : 0.35} strokeOpacity={highlighted ? 0.9 : 0.3} fill="none" strokeDasharray="2 3" strokeLinecap="square" markerEnd={`url(#arrowhead-${i})`} initial={{
                  pathLength: 0,
                  opacity: 0
                }} animate={{
                  pathLength: 1,
                  opacity: 1
                }} transition={{
                  duration: 0.7,
                  ease: 'easeOut'
                }} />}
                    {active && <motion.circle r="0.9" fill={edge.color} fillOpacity={highlighted ? 0.95 : 0.35} animate={{
                  opacity: [0, 1, 1, 0]
                }} transition={{
                  duration: 2.4,
                  delay: 0.7 + i * 0.18,
                  repeat: Infinity,
                  repeatDelay: 1.2
                }}>
                        <animateMotion dur="2.4s" repeatCount="indefinite" begin={`${0.7 + i * 0.18}s`} path={pathD} />
                      </motion.circle>}
                  </g>;
            })}
            </svg>
            <div style={{
            position: 'absolute',
            inset: 0,
            overflow: 'visible'
          }}>
              {nodes.map(node => {
              const isActive = activeNode === node.id;
              const isLinked = activeNode !== null && edges.some(e => e.from === activeNode && e.to === node.id || e.to === activeNode && e.from === node.id);
              const tooltip = tooltips[node.id];
              const tooltipAbove = node.cy > 55;
              let tooltipLeft: string | undefined = '50%';
              let tooltipTransform = 'translateX(-50%)';
              if (node.cx > 70) {
                tooltipLeft = 'auto';
                tooltipTransform = 'translateX(-100%)';
              }
              if (node.cx < 30) {
                tooltipLeft = '0';
                tooltipTransform = 'translateX(0)';
              }
              return <motion.button key={`dn-${node.id}`} initial={{
                opacity: 0,
                scale: 0.7
              }} animate={isInView ? {
                opacity: 1,
                scale: 1
              } : {
                opacity: 0,
                scale: 0.7
              }} transition={{
                delay: 0.15 + nodes.indexOf(node) * 0.1,
                duration: 0.4
              }} onMouseEnter={() => setActiveNode(node.id)} onMouseLeave={() => setActiveNode(null)} className="flex flex-col items-center cursor-default focus:outline-none" style={{
                position: 'absolute',
                left: `${node.cx}%`,
                top: `${node.cy}%`,
                transform: 'translate(-50%, -50%)',
                zIndex: isActive ? 50 : 5
              }} aria-label={`${node.label} — ${node.sublabel}`}>
                    <div style={{
                  background: isActive || isLinked ? node.hex : COLOR.charBlack,
                  border: `2px solid ${node.hex}`,
                  padding: '6px 8px',
                  transition: 'background 0.18s, border-color 0.18s, box-shadow 0.18s',
                  boxShadow: isActive ? `0 0 0 3px ${node.hex}44` : 'none'
                }}>
                      <div className="text-[9px] font-bold uppercase tracking-[0.18em] mb-1 text-center" style={{
                    color: isActive || isLinked ? COLOR.milletClay : inkOn(node.hex, COLOR.charBlack, true)
                  }}>{node.tag}</div>
                      <div className="w-6 h-6 mx-auto flex items-center justify-center" aria-hidden="true" style={{
                    background: isActive || isLinked ? 'rgba(30,26,23,0.4)' : `${node.hex}22`,
                    border: `1px solid ${node.hex}55`
                  }}>
                        <div className="w-2 h-2" style={{
                      background: isActive || isLinked ? COLOR.charBlack : node.hex
                    }} />
                      </div>
                    </div>
                    <div className="mt-1.5 text-center leading-tight" style={{
                  minWidth: 64
                }}>
                      <p className="text-[10px] font-semibold tracking-tight" style={{
                    color: COLOR.milletClay,
                    opacity: isActive || isLinked ? 1 : 0.75
                  }}>{node.label}</p>
                      <p className="text-[9px] uppercase tracking-[0.1em]" style={{
                    color: COLOR.milletClay,
                    opacity: isActive || isLinked ? 0.7 : 0.3
                  }}>{tooltip.role}</p>
                    </div>
                    {isActive && tooltip && <motion.div initial={{
                  opacity: 0,
                  y: tooltipAbove ? 6 : -6,
                  scale: 0.96
                }} animate={{
                  opacity: 1,
                  y: 0,
                  scale: 1
                }} transition={{
                  duration: 0.18,
                  ease: 'easeOut'
                }} style={{
                  position: 'absolute',
                  left: tooltipLeft === '50%' ? '50%' : tooltipLeft === '0' ? 24 : undefined,
                  right: tooltipLeft === 'auto' ? 24 : undefined,
                  transform: tooltipTransform,
                  ...(tooltipAbove ? {
                    bottom: 'calc(100% + 10px)'
                  } : {
                    top: 'calc(100% + 10px)'
                  }),
                  zIndex: 60,
                  pointerEvents: 'none',
                  minWidth: 200,
                  maxWidth: 232,
                  background: COLOR.charBlack,
                  border: `2px solid ${node.hex}`,
                  padding: '10px 12px',
                  boxShadow: `0 0 0 1px ${node.hex}22`
                }}>
                        <PixelCornerMarks hex={node.hex} size={6} />
                        <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: 6
                  }}>
                          <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6
                    }}>
                            <PixelDot color={node.hex} size={6} />
                            <span style={{
                        fontSize: 9,
                        fontWeight: 700,
                        letterSpacing: '0.14em',
                        textTransform: 'uppercase',
                        color: inkOn(node.hex, COLOR.charBlack, true)
                      }}>{node.tag}</span>
                          </div>
                          <span style={{
                      fontSize: 9,
                      fontWeight: 700,
                      letterSpacing: '0.14em',
                      textTransform: 'uppercase',
                      color: 'rgba(232,225,207,0.55)'
                    }}>NODE</span>
                        </div>
                        <p style={{
                    fontSize: 14,
                    fontWeight: 600,
                    letterSpacing: '-0.01em',
                    color: COLOR.milletClay,
                    lineHeight: 1.1,
                    marginBottom: 4
                  }}>{node.label}</p>
                        <p style={{
                    fontSize: 10,
                    fontWeight: 500,
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    color: inkOn(node.hex, COLOR.charBlack, true),
                    opacity: 0.75,
                    marginBottom: 8
                  }}>{tooltip.role}</p>
                        {tooltip.connects.length > 0 && <div>
                            <p style={{
                      fontSize: 9,
                      fontWeight: 700,
                      letterSpacing: '0.15em',
                      textTransform: 'uppercase',
                      color: 'rgba(232,225,207,0.55)',
                      marginBottom: 4
                    }}>Connects to</p>
                            <div style={{
                      display: 'flex',
                      gap: 4,
                      flexWrap: 'wrap'
                    }}>
                              {tooltip.connects.map(c => <span key={`tt-conn-${node.id}-${c}`} style={{
                        fontSize: 9,
                        fontWeight: 700,
                        letterSpacing: '0.14em',
                        textTransform: 'uppercase',
                        padding: '2px 6px',
                        background: `${node.hex}22`,
                        border: `1px solid ${node.hex}55`,
                        color: inkOn(node.hex, COLOR.charBlack, true)
                      }}>{c}</span>)}
                            </div>
                          </div>}
                        <DitherBar color={node.hex} segments={16} height={2} opacity={0.55} className="mt-2" />
                        <div aria-hidden="true" style={{
                    position: 'absolute',
                    left: tooltipLeft === '50%' ? '50%' : tooltipLeft === '0' ? 24 : undefined,
                    right: tooltipLeft === 'auto' ? 24 : undefined,
                    transform: tooltipLeft === '50%' ? 'translateX(-50%)' : 'none',
                    ...(tooltipAbove ? {
                      bottom: -6,
                      borderTop: `6px solid ${node.hex}`,
                      borderLeft: '5px solid transparent',
                      borderRight: '5px solid transparent'
                    } : {
                      top: -6,
                      borderBottom: `6px solid ${node.hex}`,
                      borderLeft: '5px solid transparent',
                      borderRight: '5px solid transparent'
                    }),
                    width: 0,
                    height: 0
                  }} />
                      </motion.div>}
                  </motion.button>;
            })}
            </div>
          </div>
        </div>
        <AnnotationPanel annotations={GUIDE_ANNOTATIONS} rules={PIXEL_RULES} />
      </div>
      <CodeSnippetBlock label="DiagramNode · System Connections" lines={SNIPPET_SYSTEM_CONNECTIONS} accentHex="#DFAE2B" />
    </section>;
};

// ─── PixelHeatmap ─────────────────────────────────────────────────────────────
export const PixelHeatmap = ({
  data = HEATMAP_CELLS,
  rowLabels = HEATMAP_LABELS_Y,
  colLabels = HEATMAP_LABELS_X
}: {
  data?: HeatCell[];
  rowLabels?: string[];
  colLabels?: string[];
} = {}) => {
  const getHeatColor = (intensity: number) => {
    if (intensity > 0.85) return COLOR.firedRed;
    if (intensity > 0.65) return COLOR.ochreOrange;
    if (intensity > 0.45) return COLOR.mahanguGold;
    if (intensity > 0.25) return COLOR.barkRust;
    if (intensity > 0.1) return COLOR.mopaneBrown;
    return COLOR.charBlack;
  };
  return <section className="max-w-7xl mx-auto px-6 pb-24 md:px-12">
      <SectionHeader label="Research Signals" headline="Activity across systems." accent={COLOR.mahanguGold} />
      <div className="flex flex-col items-stretch gap-12 lg:flex-row lg:items-start">
        <motion.div initial={{
        opacity: 0
      }} whileInView={{
        opacity: 1
      }} viewport={{
        once: true
      }} transition={{
        duration: 0.6
      }} className="min-w-0 flex-1 bg-[#1E1A17] p-6 md:p-8">
          <div className="relative overflow-x-auto">
            <WeaveOverlay isDark opacity={0.06} />
            <div className="relative flex gap-1.5 mb-2 pl-24">
              {colLabels.map((label, i) => <div key={`hx-${i}`} className="flex-1 text-center text-[9px] font-bold uppercase tracking-widest" style={{
              color: COLOR.milletClay,
              opacity: 0.25
            }}>{label}</div>)}
            </div>
            <div className="relative flex flex-col gap-1.5">
              {rowLabels.map((yLabel, rowIdx) => <div key={`hr-${rowIdx}`} className="flex items-center gap-1.5">
                  {/* The row names a system, so it carries that system's mark.
                      Without it the label is the only identity and the hue is
                      gone — see tests/browser/identity.spec.ts. */}
                  <div className="w-24 shrink-0 flex items-center justify-end gap-2 pr-3 text-[9px] font-bold uppercase tracking-[0.12em] text-right" style={{
                color: 'rgba(232,225,207,0.55)'
              }}>
                      <span>{yLabel}</span>
                      {SYSTEM_COLOR[yLabel as SystemName] && <PixelDot color={SYSTEM_COLOR[yLabel as SystemName]} size={5} ring="rgba(232,225,207,0.2)" />}
                    </div>
                  {data.filter(c => c.row === rowIdx).map(cell => <motion.div key={`hc-${cell.row}-${cell.col}`} initial={{
                opacity: 0,
                scale: 0.5
              }} whileInView={{
                opacity: 1,
                scale: 1
              }} viewport={{
                once: true
              }} transition={{
                delay: (cell.row * 8 + cell.col) * 0.012,
                duration: 0.25
              }} className="flex-1 aspect-square" style={{
                background: getHeatColor(cell.intensity)
              }} title={`${yLabel} · ${colLabels[cell.col]}: ${Math.round(cell.intensity * 100)}%`} />)}
                </div>)}
            </div>
            <div className="relative flex items-center gap-3 mt-6">
              <span className="text-[9px] font-bold uppercase tracking-widest text-[#E8E1CF]/55">Low</span>
              {([COLOR.charBlack, COLOR.mopaneBrown, COLOR.barkRust, COLOR.mahanguGold, COLOR.ochreOrange, COLOR.firedRed] as string[]).map((c, i) => <div key={`hl-${i}`} className="w-4 h-4" style={{
              background: c
            }} aria-hidden="true" />)}
              <span className="text-[9px] font-bold uppercase tracking-widest text-[#E8E1CF]/55">High</span>
            </div>
          </div>
        </motion.div>
        <div className="lg:w-72 xl:w-80 shrink-0">
          <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#1E1A17]/66 mb-5">How to read</p>
          <div className="flex flex-col gap-0 divide-y divide-[#1E1A17]/10">
            {[{
            label: 'Rows',
            body: 'Each row maps to one of the five named systems, plus a cross-system channel.'
          }, {
            label: 'Columns',
            body: 'Quarterly time periods across a two-year research horizon.'
          }, {
            label: 'Color',
            body: 'Intensity corresponds to relative research and development activity. Material palette — no arbitrary hues.'
          }].map(item => <div key={item.label} className="py-4">
                <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#8F3E21] mb-1">{item.label}</p>
                <p className="text-sm text-[#1E1A17]/65 leading-relaxed">{item.body}</p>
              </div>)}
          </div>
        </div>
      </div>
      <CodeSnippetBlock label="HeatCell · Research Signals" lines={SNIPPET_RESEARCH_SIGNALS} accentHex="#C84A1B" />
    </section>;
};

// ─── RoadmapTimeline ──────────────────────────────────────────────────────────
export const RoadmapTimeline = ({
  phases = TIMELINE_PHASES
}: {
  phases?: TimelinePhase[];
} = {}) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, {
    once: true,
    margin: '-60px'
  });
  const STATUS_LEGEND = [{
    status: 'complete' as const,
    label: 'Complete'
  }, {
    status: 'active' as const,
    label: 'In progress'
  }, {
    status: 'upcoming' as const,
    label: 'Upcoming'
  }];
  return <section id="roadmap" ref={sectionRef} className="max-w-7xl mx-auto px-6 pb-24 md:px-12">
      <SectionHeader label="Development Roadmap" headline="Five phases. One direction." accent={COLOR.dyePlum} />
      <div className="hidden lg:block relative mb-14" aria-hidden="true">
        <div className="h-px bg-[#1E1A17]/12 w-full" />
        <div className="absolute top-0 left-0 w-full flex">
          {phases.map(phase => <div key={`spine-tick-${phase.tag}`} className="flex-1 flex flex-col items-center" style={{
          transform: 'translateY(-50%)'
        }}>
              <div className="w-2.5 h-2.5" style={{
            background: phase.status === 'upcoming' ? 'transparent' : phase.hex,
            border: `2px solid ${phase.hex}`
          }} />
            </div>)}
        </div>
        <div className="flex mt-3">
          {phases.map(phase => <div key={`spine-label-${phase.tag}`} className="flex-1 text-center">
              <span className="text-[9px] font-bold uppercase tracking-[0.14em]" style={{
            color: phase.hex,
            opacity: 0.7
          }}>{phase.period}</span>
            </div>)}
        </div>
      </div>
      <div className="flex flex-col gap-0 divide-y divide-[#1E1A17]/10">
        {phases.map((phase, idx) => <motion.div key={phase.tag} initial={{
        opacity: 0,
        y: 14
      }} animate={isInView ? {
        opacity: 1,
        y: 0
      } : {
        opacity: 0,
        y: 14
      }} transition={{
        delay: 0.1 + idx * 0.11,
        duration: 0.5
      }} className="flex flex-col lg:flex-row gap-6 lg:gap-10 py-8 group">
            <div className="lg:w-40 shrink-0 flex flex-row lg:flex-col gap-3 lg:gap-2 items-center lg:items-start">
              <PixelTag hex={phase.hex} label={phase.tag} />
              <div className="flex items-center gap-1.5">
                <div className="flex gap-0.5" aria-hidden="true">
                  {[0, 1, 2].map(k => <div key={`st-${phase.tag}-${k}`} className="w-1.5 h-1.5" style={{
                background: phase.status === 'upcoming' ? 'transparent' : phase.hex,
                border: `1px solid ${phase.hex}`,
                opacity: phase.status === 'upcoming' ? 0.4 : 1
              }} />)}
                </div>
                <span className="text-[9px] font-bold uppercase tracking-[0.15em]" style={{
              color: COLOR.charBlack,
              opacity: phase.status === 'upcoming' ? 0.35 : 1
            }}>{phase.status}</span>
              </div>
              <span className="hidden lg:block text-[9px] font-bold uppercase tracking-[0.12em] text-[#1E1A17]/66 mt-1">{phase.period}</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-baseline gap-2.5 mb-1">
                <h3 className="text-lg font-semibold text-[#1E1A17] tracking-tight leading-none">{phase.oshiwambo}</h3>
                <span className="text-sm text-[#1E1A17]/66 font-normal">{phase.english}</span>
              </div>
              <p className="text-sm text-[#1E1A17]/65 leading-relaxed mb-5 max-w-xl">{phase.desc}</p>
              <div className="flex items-center gap-3">
                <div className="flex-1 h-3 bg-[#1E1A17]/8 overflow-hidden relative" role="progressbar" aria-valuenow={phase.progress} aria-valuemin={0} aria-valuemax={100} aria-label={`${phase.oshiwambo} progress: ${phase.progress}%`}>
                  <motion.div className="h-full relative overflow-hidden" initial={{
                width: 0
              }} animate={{
                width: `${phase.progress}%`
              }} transition={{
                delay: 0.35 + idx * 0.12,
                duration: 0.9,
                ease: [0.16, 1, 0.3, 1]
              }} style={{
                background: phase.hex
              }}>
                    <div aria-hidden="true" className="absolute inset-0" style={{
                  backgroundImage: 'repeating-linear-gradient(90deg, transparent 0px, transparent 3px, rgba(30,26,23,0.12) 3px, rgba(30,26,23,0.12) 4px)'
                }} />
                    {phase.status === 'active' && <motion.div aria-hidden="true" className="absolute right-0 top-0 bottom-0 w-3" style={{
                  background: COLOR.charBlack
                }} animate={{
                  opacity: [1, 0.3, 1]
                }} transition={{
                  duration: 1.4,
                  repeat: Infinity,
                  ease: 'easeInOut'
                }} />}
                  </motion.div>
                  {[25, 50, 75].map(tick => <div key={`tick-${phase.tag}-${tick}`} aria-hidden="true" className="absolute top-0 bottom-0 w-px" style={{
                left: `${tick}%`,
                background: COLOR.charBlack,
                opacity: 0.08
              }} />)}
                </div>
                <span className="text-[11px] font-bold tabular-nums shrink-0" style={{
              color: COLOR.charBlack,
              opacity: phase.progress === 0 ? 0.3 : 1
            }}>{phase.progress}%</span>
              </div>
            </div>
            <div className="lg:w-60 xl:w-72 shrink-0">
              <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-[#1E1A17]/66 mb-3">Milestones</p>
              <ul className="flex flex-col gap-2">
                {phase.milestones.map(ms => <li key={`ms-${phase.tag}-${ms}`} className="flex items-start gap-2">
                    <div aria-hidden="true" className="w-1.5 h-1.5 mt-1 shrink-0" style={{
                background: phase.status === 'upcoming' ? 'transparent' : phase.hex,
                border: `1px solid ${phase.hex}`,
                opacity: phase.status === 'upcoming' ? 0.4 : 1
              }} />
                    <span className="text-xs leading-snug" style={{
                color: COLOR.charBlack,
                opacity: phase.status === 'upcoming' ? 0.35 : 0.65
              }}>{ms}</span>
                  </li>)}
              </ul>
            </div>
          </motion.div>)}
      </div>
      <div aria-hidden="true" className="flex mt-4 h-1">
        {phases.map(phase => [0, 1, 2, 3, 4, 5, 6, 7].map(i => <div key={`btm-${phase.tag}-${i}`} className="flex-1 h-full" style={{
        background: i % 2 === 0 ? phase.hex : 'transparent',
        opacity: 0.45
      }} />))}
      </div>
      <div className="flex items-center gap-6 mt-5 flex-wrap">
        {STATUS_LEGEND.map(item => <div key={item.status} className="flex items-center gap-2">
            <div className="flex gap-0.5" aria-hidden="true">
              {[0, 1, 2].map(k => <div key={`leg-${item.status}-${k}`} className="w-1.5 h-1.5" style={{
            background: item.status === 'complete' ? COLOR.ochreOrange : item.status === 'active' && k < 2 ? COLOR.barkRust : 'transparent',
            border: `1px solid ${item.status === 'complete' ? COLOR.ochreOrange : item.status === 'active' ? COLOR.barkRust : '#1E1A1744'}`
          }} />)}
            </div>
            <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#1E1A17]/66">{item.label}</span>
          </div>)}
      </div>
      <CodeSnippetBlock label="TimelinePhase · Development Roadmap" lines={SNIPPET_ROADMAP} accentHex="#D9791F" />
    </section>;
};

// ─── FieldApplications ────────────────────────────────────────────────────────
export const FieldApplications = () => <section className="max-w-7xl mx-auto px-6 pb-24 md:px-12">
    <SectionHeader label="Field Applications" headline="Intelligence carried to where it is needed." accent={COLOR.ochreOrange} />
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {SECTOR_APPS.map((app, idx) => <FieldAppCard key={app.tag} app={app} idx={idx} />)}
    </div>
    <motion.div initial={{
    opacity: 0
  }} whileInView={{
    opacity: 1
  }} viewport={{
    once: true
  }} transition={{
    duration: 0.5
  }} className="relative mt-5 bg-[#1E1A17] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 px-7 py-6 overflow-hidden">
      <WeaveOverlay isDark opacity={0.04} />
      <div className="relative">
        <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#D9791F] mb-1">Partner with us</p>
        <p className="text-sm text-[#E8E1CF]/55 max-w-md leading-relaxed">We are seeking sector partners in health, agriculture, education, and public administration.</p>
      </div>
      {/* isDark: this sits on the inverse (black) band — see DESIGN_SYSTEM.md §5 */}
      <PixelButton variant="accent" isDark className="relative shrink-0">Propose a pilot</PixelButton>
    </motion.div>
    <CodeSnippetBlock label="FieldAppCard · Field Applications" lines={SNIPPET_FIELD_APPS} accentHex="#6F4A6E" />
  </section>;

// ─── PixelFlowchart ───────────────────────────────────────────────────────────
export const PixelFlowchart = () => {
  const rootNode = FLOW_NODES[0];
  const childNodes = FLOW_NODES.slice(1);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  return <section id="brand-guide" className="max-w-7xl mx-auto px-6 pb-24 md:px-12">
      <SectionHeader label="Brand Guide" headline="Naming hierarchy. One root. Five branches." accent={COLOR.mopaneBrown} />
      <div className="flex flex-col lg:flex-row gap-16 items-start">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-10">
            <div className="flex gap-1" aria-hidden="true">
              {[8, 16, 24, 16, 8].map((w, idx) => <div key={`leg-seg-${idx}`} className="h-1.5" style={{
              width: w,
              background: COLOR.ochreOrange,
              opacity: 0.12 + idx * 0.1
            }} />)}
            </div>
            <span className="text-[11px] font-bold uppercase tracking-[0.15em] text-[#1E1A17]/66">Pixel Flowchart — Naming Architecture</span>
          </div>
          <motion.div initial={{
          opacity: 0,
          y: 12
        }} whileInView={{
          opacity: 1,
          y: 0
        }} viewport={{
          once: true
        }} transition={{
          duration: 0.5
        }}>
            {/* Root node */}
            <div className="relative border-2 bg-[#1E1A17] flex items-center gap-5 px-6 py-5 overflow-hidden" style={{
            borderColor: rootNode.hex
          }}>
              <WeaveOverlay isDark opacity={0.06} />
              <PixelCornerMarks hex={rootNode.hex} size={10} />
              <div className="relative flex items-center gap-4">
                <FlowNodeIcon id="root" hex={rootNode.hex} />
                <div>
                  <div className="flex items-baseline gap-2.5">
                    <h3 className="text-lg font-semibold tracking-tight text-[#E8E1CF] leading-none">{rootNode.oshiwambo}</h3>
                    <PixelTag hex="transparent" label={rootNode.pixelTag} isDark />
                  </div>
                  <p className="text-sm text-[#E8E1CF]/55 mt-1">{rootNode.english}</p>
                  <p className="text-[10px] font-bold uppercase tracking-[0.13em] mt-1.5" style={{
                  color: inkOn(rootNode.hex, COLOR.charBlack, true)
                }}>{rootNode.role}</p>
                </div>
              </div>
              <DitherBar color={rootNode.hex} segments={40} height={2} opacity={1} className="absolute bottom-0 left-0 right-0" />
            </div>
            {/* Connector SVG — xl only */}
            <div aria-hidden="true" className="hidden xl:block w-full" style={{
            height: 52,
            position: 'relative'
          }}>
              {/* 
                3-column grid: each column is (600 - 2*16) / 3 = 189.3px wide
                col centers: 189.3/2 = 94.7, 94.7+16+189.3 = 300, 300+16+189.3 = 505.3
                Round to: 95, 300, 505
               */}
              <svg width="100%" height="52" viewBox="0 0 600 52" preserveAspectRatio="none">
                <line x1="300" y1="0" x2="300" y2="20" stroke={rootNode.hex} strokeWidth="1.5" strokeDasharray="4 3" strokeOpacity="0.55" />
                <line x1="95" y1="20" x2="505" y2="20" stroke={rootNode.hex} strokeWidth="1.5" strokeDasharray="6 4" strokeOpacity="0.35" />
                {([95, 300, 505] as number[]).map((cx, i) => <line key={`drop-${i}`} x1={cx} y1="20" x2={cx} y2="52" stroke={childNodes[i]?.hex ?? rootNode.hex} strokeWidth="1.5" strokeDasharray="3 3" strokeOpacity="0.5" />)}
              </svg>
            </div>
            {/* Simple trunk — non-xl */}
            <div className="xl:hidden flex justify-center py-3" aria-hidden="true">
              <div className="w-px h-8" style={{
              background: `repeating-linear-gradient(to bottom, ${rootNode.hex} 0px, ${rootNode.hex} 3px, transparent 3px, transparent 6px)`
            }} />
            </div>
            {/* Child nodes */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-x-4 gap-y-0 mt-0">
              {childNodes.map((node, idx) => <motion.div key={node.id} initial={{
              opacity: 0,
              y: 14
            }} whileInView={{
              opacity: 1,
              y: 0
            }} viewport={{
              once: true,
              margin: '-30px'
            }} transition={{
              delay: 0.1 + idx * 0.08,
              duration: 0.45
            }} className="flex flex-col items-center" onMouseEnter={() => setHoveredId(node.id)} onMouseLeave={() => setHoveredId(null)}>
                  <div aria-hidden="true" className="xl:hidden" style={{
                width: 2,
                height: 20,
                background: `repeating-linear-gradient(to bottom, ${node.hex} 0px, ${node.hex} 3px, transparent 3px, transparent 6px)`
              }} />
                  <div aria-hidden="true" className="flex flex-col items-center mb-1"><PixelArrowDown color={node.hex} /></div>
                  <div className="w-full" style={{
                minHeight: 160
              }}>
                    <FlowNodeCard node={node} isHovered={hoveredId === node.id} />
                  </div>
                </motion.div>)}
            </div>
          </motion.div>
        </div>
        <AnnotationPanel annotations={GUIDE_ANNOTATIONS} rules={PIXEL_RULES} />
      </div>
      <CodeSnippetBlock label="FlowNode · Pixel Flowchart" lines={SNIPPET_BRAND_GUIDE} accentHex="#8F3E21" />
    </section>;
};

// ─── IconShowcase ─────────────────────────────────────────────────────────────
export const IconShowcase = () => {
  const [activeCategory, setActiveCategory] = useState<IconCategory | 'All'>('All');
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const {
    isDark
  } = useDark();
  const cardBg = isDark ? COLOR.darkCard : COLOR.dustLight;
  const borderColor = isDark ? 'rgba(232,225,207,0.08)' : 'rgba(30,26,23,0.10)';
  const labelColor = isDark ? 'rgba(232,225,207,0.55)' : 'rgba(30,26,23,0.66)';
  const headlineColor = isDark ? COLOR.milletClay : COLOR.charBlack;
  const bodyColor = isDark ? 'rgba(232,225,207,0.55)' : 'rgba(30,26,23,0.66)';
  const CATEGORY_TABS: Array<IconCategory | 'All'> = ['All', ...ICON_CATEGORIES];
  const filtered = activeCategory === 'All' ? ICON_REGISTRY : ICON_REGISTRY.filter(i => i.category === activeCategory);
  const handleCopy = (name: string, id: string) => {
    navigator.clipboard.writeText(`<Icon${name} size={16} />`).catch(() => {});
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1400);
  };

  // Style spec lines — data outside JSX, no inline array literals
  const STYLE_SPEC = [{
    label: 'Grid',
    value: '12 × 12 pixel grid — all coordinates snap to integer units'
  }, {
    label: 'Shapes',
    value: 'Rect-only — no paths, no strokes, no curves. Pure filled rectangles'
  }, {
    label: 'Color',
    value: 'currentColor by default — override with color prop. Depth via fillOpacity layers'
  }, {
    label: 'Scale',
    value: 'Uniform size prop (default 16px) — crisp at any integer multiple'
  }, {
    label: 'Usage',
    value: 'import { IconName } from "./onganda-icons"; size, color, opacity props'
  }];
  return <section id="icon-bank" className="max-w-7xl mx-auto px-6 pb-24 md:px-12">
      <div className="border-b pb-8 mb-10" style={{
      borderColor
    }}>
        <h2 className="text-xs font-bold uppercase tracking-[0.15em] mb-2" style={{
        color: labelColor
      }}>
          Icon Bank
        </h2>
        <p className="text-2xl md:text-3xl font-medium tracking-tight mb-5" style={{
        color: headlineColor
      }}>
          Pixel icons. Every shape you need.
        </p>

        {/* Style description blurb */}
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-16 items-start">
          <p className="text-sm leading-relaxed max-w-xl" style={{
          color: bodyColor
        }}>
            Every icon in this system is drawn on a strict <strong style={{
            color: isDark ? COLOR.milletClay : COLOR.charBlack,
            fontWeight: 600
          }}>12 × 12 pixel grid</strong> using only filled rectangles — no paths, no strokes, no curves. The result is a cohesive pixel-art language that reads crisply at 16px and scales cleanly to any integer multiple. Depth is achieved through <strong style={{
            color: isDark ? COLOR.milletClay : COLOR.charBlack,
            fontWeight: 600
          }}>fillOpacity layering</strong> — a foreground rect at full opacity over a background rect at 0.15–0.45 — giving form without gradients. All icons use <strong style={{
            color: isDark ? COLOR.milletClay : COLOR.charBlack,
            fontWeight: 600
          }}>currentColor</strong> so they adapt to any surface; pass a color prop to pin them. This is a material language — deliberate, structured, reproducible.
          </p>
          <div className="flex flex-col gap-0 divide-y shrink-0 lg:min-w-72" style={{
          borderColor
        }}>
            {STYLE_SPEC.map(spec => <div key={spec.label} className="flex gap-3 py-2.5 items-start">
                <span className="text-[9px] font-bold uppercase tracking-[0.18em] shrink-0 mt-0.5 w-16" style={{
              color: roles(isDark).accentInk
            }}>{spec.label}</span>
                <span className="text-[11px] leading-snug" style={{
              color: bodyColor
            }}>{spec.value}</span>
              </div>)}
          </div>
        </div>
      </div>

      {/* Category tabs */}
      <div className="flex flex-wrap gap-2 mb-10" role="tablist" aria-label="Icon categories">
        {CATEGORY_TABS.map(cat => {
        const isActive = activeCategory === cat;
        return <button key={cat} role="tab" aria-selected={isActive} onClick={() => setActiveCategory(cat)} style={{
          padding: '5px 14px',
          fontSize: 10,
          fontWeight: 700,
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
          border: `1px solid ${isActive ? COLOR.ochreOrange : borderColor}`,
          background: isActive ? COLOR.ochreOrange : 'transparent',
          color: isActive ? onColor(COLOR.ochreOrange) : labelColor,
          cursor: 'pointer',
          transition: 'background 0.18s, border-color 0.18s, color 0.18s'
        }}>
              {cat}
            </button>;
      })}
      </div>

      {/* Icon grid */}
      <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 xl:grid-cols-12 gap-2">
        {filtered.map((entry, idx) => {
        const isHovered = hoveredId === entry.id;
        const isCopied = copiedId === entry.id;
        return <motion.button key={entry.id} initial={{
          opacity: 0,
          scale: 0.8
        }} animate={{
          opacity: 1,
          scale: 1
        }} transition={{
          delay: idx * 0.012,
          duration: 0.22
        }} onMouseEnter={() => setHoveredId(entry.id)} onMouseLeave={() => setHoveredId(null)} onClick={() => handleCopy(entry.name, entry.id)} aria-label={`Copy ${entry.name} icon import`} title={`${entry.name} · click to copy`} style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 6,
          padding: '12px 6px 8px',
          background: isHovered ? isDark ? COLOR.darkCardAlt : EDITOR_SURFACE.dustHover : cardBg,
          border: `1px solid ${isHovered ? COLOR.ochreOrange : borderColor}`,
          cursor: 'pointer',
          transition: 'background 0.15s, border-color 0.15s, box-shadow 0.15s',
          boxShadow: isHovered ? `0 0 0 2px ${COLOR.ochreOrange}22` : 'none'
        }}>
              <span style={{
            color: isCopied ? COLOR.ochreOrange : isDark ? COLOR.milletClay : COLOR.charBlack,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'color 0.18s'
          }}>
                <entry.component size={20} />
              </span>
              <span style={{
            fontSize: 9,
            fontWeight: 700,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: isCopied ? COLOR.ochreOrange : labelColor,
            lineHeight: 1.2,
            textAlign: 'center',
            transition: 'color 0.18s'
          }}>
                {isCopied ? 'Copied!' : entry.name}
              </span>
            </motion.button>;
      })}
      </div>

      {/* Footer rule */}
      <div className="mt-10 flex flex-wrap items-center gap-x-4 gap-y-2">
        <div className="flex-1 h-px" style={{
        background: borderColor
      }} />
        <span style={{
        fontSize: 9,
        fontWeight: 700,
        letterSpacing: '0.16em',
        textTransform: 'uppercase',
        color: labelColor,
        whiteSpace: 'normal',
        textAlign: 'center'
      }}>
          {ICON_REGISTRY.length} icons · Pixel grid · 12×12 viewBox · currentColor
        </span>
        <div className="flex-1 h-px" style={{
        background: borderColor
      }} />
      </div>

      {/* Usage snippet */}
      <div className="mt-6 p-5 font-mono text-[11px] leading-6" style={{
      background: COLOR.charBlack,
      color: 'rgba(232,225,207,0.55)',
      borderLeft: `3px solid ${COLOR.ochreOrange}`
    }}>
        <span style={{
        color: 'rgba(232,225,207,0.55)'
      }}>{'// import from onganda-icons'}</span>
        <br />
        <span style={{
        color: COLOR.ochreOrange
      }}>import</span>
        <span>{' { IconSearch, IconUser, IconCheck } '}</span>
        <span style={{
        color: COLOR.ochreOrange
      }}>from</span>
        <span style={{
        color: COLOR.mahanguGold
      }}>{" './onganda-icons'"}</span>
        <br />
        <br />
        <span style={{
        color: 'rgba(232,225,207,0.55)'
      }}>{'// render with size + color props'}</span>
        <br />
        <span>{'<'}</span>
        <span style={{
        color: COLOR.ochreOrange
      }}>IconSearch</span>
        <span style={{
        color: COLOR.mahanguGold
      }}>{' size'}</span>
        <span>{'={16} '}</span>
        <span style={{
        color: COLOR.mahanguGold
      }}>color</span>
        <span>{"='"}</span>
        <span style={{
        color: COLOR.mahanguGold
      }}>{'#D9791F'}</span>
        <span>{"' />"}</span>
      </div>
      <CodeSnippetBlock label="Icon · Icon Bank" lines={SNIPPET_ICON_BANK} accentHex="#D9791F" />
    </section>;
};

// ─── IconFactoryLab — live pixel-icon editor ──────────────────────────────────
// Draw on a 12×12 grid, watch createPixelIcon render it live, copy the def.
// Demonstrates the data-driven icon path from onganda-icon-factory.

const FACTORY_GRID = 12;
const FACTORY_PALETTE = [COLOR.charBlack, COLOR.ochreOrange, COLOR.firedRed, COLOR.mahanguGold, COLOR.barkRust, COLOR.mopaneBrown, COLOR.dyePlum];

// Seed doodle: the WEAVE diamond motif — outline in ochre, firedRed core
const FACTORY_SEED: (string | null)[] = (() => {
  const cells: (string | null)[] = Array(FACTORY_GRID * FACTORY_GRID).fill(null);
  const paint = (pts: [number, number][], hex: string) => pts.forEach(([x, y]) => {
    cells[y * FACTORY_GRID + x] = hex;
  });
  paint([[5, 2], [6, 2], [4, 3], [7, 3], [3, 4], [8, 4], [2, 5], [9, 5], [2, 6], [9, 6], [3, 7], [8, 7], [4, 8], [7, 8], [5, 9], [6, 9]], COLOR.ochreOrange);
  paint([[5, 5], [6, 5], [5, 6], [6, 6]], COLOR.firedRed);
  return cells;
})();

// Merge same-colour horizontal runs into rects (charBlack → currentColor)
const factoryDefFromCells = (cells: (string | null)[]): PixelIconDef => {
  const rects: PixelRect[] = [];
  for (let y = 0; y < FACTORY_GRID; y++) {
    let x = 0;
    while (x < FACTORY_GRID) {
      const hex = cells[y * FACTORY_GRID + x];
      if (!hex) {
        x++;
        continue;
      }
      let w = 1;
      while (x + w < FACTORY_GRID && cells[y * FACTORY_GRID + x + w] === hex) w++;
      rects.push({
        x,
        y,
        w,
        h: 1,
        ...(hex === COLOR.charBlack ? {} : {
          fill: hex
        })
      });
      x += w;
    }
  }
  return {
    grid: FACTORY_GRID,
    rects
  };
};

const factorySnippetLines = (def: PixelIconDef): CodeSnippetLine[] => {
  const rectLine = (r: PixelRect) => `    { x: ${r.x}, y: ${r.y}, w: ${r.w}, h: ${r.h}${r.fill ? `, fill: '${r.fill}'` : ''} },`;
  const shown = def.rects.slice(0, 12).map(r => ({
    type: 'prop' as const,
    text: rectLine(r)
  }));
  const elided = def.rects.length > 12 ? [{
    type: 'comment' as const,
    text: `    // … ${def.rects.length - 12} more rects`
  }] : [];
  return [{
    type: 'import',
    text: "import { createPixelIcon } from '@onganda/design-system';"
  }, {
    type: 'plain',
    text: ''
  }, {
    type: 'keyword',
    text: 'const def = {'
  }, {
    type: 'plain',
    text: `  grid: ${def.grid},`
  }, {
    type: 'plain',
    text: '  rects: ['
  }, ...shown, ...elided, {
    type: 'plain',
    text: '  ]'
  }, {
    type: 'keyword',
    text: '};'
  }, {
    type: 'plain',
    text: ''
  }, {
    type: 'accent',
    text: 'export const IconDoodle = createPixelIcon(def);'
  }];
};

export const IconFactoryLab = () => {
  const {
    isDark
  } = useDark();
  const [cells, setCells] = useState<(string | null)[]>(FACTORY_SEED);
  const [activeColor, setActiveColor] = useState<string | null>(COLOR.charBlack);
  const def = useMemo(() => factoryDefFromCells(cells), [cells]);
  const Doodle = useMemo(() => createPixelIcon(def), [def]);
  const problems = useMemo(() => validatePixelIconDef('Doodle', def), [def]);
  const snippet = useMemo(() => factorySnippetLines(def), [def]);
  const border = isDark ? 'rgba(232,225,207,0.10)' : 'rgba(30,26,23,0.10)';
  const muted = isDark ? 'rgba(232,225,207,0.55)' : 'rgba(30,26,23,0.66)';
  const cellBg = isDark ? 'rgba(232,225,207,0.05)' : 'rgba(30,26,23,0.04)';
  const paintCell = (idx: number) => setCells(prev => {
    const next = [...prev];
    next[idx] = activeColor === null || prev[idx] === activeColor ? null : activeColor;
    return next;
  });
  return <section id="icon-factory" className="max-w-7xl mx-auto px-6 pb-24 md:px-12">
      <SectionHeader label="Icon Factory" headline="Draw a doodle. Get a component." accent={COLOR.mahanguGold} isDark={isDark} />
      <div className="grid gap-10 lg:grid-cols-[auto_1fr] [&>*]:min-w-0">
        {/* ── Editor ── */}
        <div>
          <div className="mb-4 flex flex-wrap items-center gap-2">
            {FACTORY_PALETTE.map(hex => <button key={hex} onClick={() => setActiveColor(hex)} aria-label={`Paint with ${hex}`} style={{
            width: 22,
            height: 22,
            background: hex,
            border: activeColor === hex ? `2px solid ${isDark ? COLOR.milletClay : COLOR.charBlack}` : `1px solid ${border}`,
            cursor: 'pointer'
          }} />)}
            <button onClick={() => setActiveColor(null)} aria-label="Eraser" style={{
            width: 22,
            height: 22,
            background: 'transparent',
            border: activeColor === null ? `2px solid ${isDark ? COLOR.milletClay : COLOR.charBlack}` : `1px dashed ${muted}`,
            cursor: 'pointer',
            fontSize: 10,
            color: muted,
            lineHeight: 1
          }}>✕</button>
            <button onClick={() => setCells(Array(FACTORY_GRID * FACTORY_GRID).fill(null))} style={{
            marginLeft: 8,
            padding: '4px 10px',
            background: 'transparent',
            border: `1px solid ${border}`,
            cursor: 'pointer',
            fontSize: 10,
            fontWeight: 600,
            letterSpacing: '0.08em',
            color: muted
          }}>Clear</button>
          </div>
          <div style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${FACTORY_GRID}, minmax(0, 1fr))`,
          gap: 1,
          // 24px cells at rest; shrinks rather than pushing the page wide.
          width: '100%',
          maxWidth: FACTORY_GRID * 24 + (FACTORY_GRID - 1) + 18,
          padding: 8,
          background: isDark ? COLOR.darkCard : COLOR.dustLight,
          border: `1px solid ${border}`
        }}>
            {cells.map((hex, idx) => <button key={idx} onClick={() => paintCell(idx)} aria-label={`Pixel ${idx % FACTORY_GRID},${Math.floor(idx / FACTORY_GRID)}`} style={{
            width: '100%',
            aspectRatio: '1',
            background: hex ?? cellBg,
            border: 'none',
            padding: 0,
            cursor: 'pointer'
          }} />)}
          </div>
          <p className="mt-3 text-[11px]" style={{
          color: muted
        }}>
            Click to paint · click again to erase · charBlack renders as <code>currentColor</code>
          </p>
        </div>
        {/* ── Preview + code ── */}
        <div>
          <div className="flex flex-wrap items-end gap-8 border p-6" style={{
          borderColor: border,
          background: isDark ? COLOR.darkCard : COLOR.dustLight,
          color: isDark ? COLOR.milletClay : COLOR.charBlack
        }}>
            {[16, 24, 48, 96].map(size => <div key={size} className="flex flex-col items-center gap-2">
                <Doodle size={size} />
                <span className="text-[10px] font-bold uppercase tracking-[0.12em]" style={{
              color: muted
            }}>{size}px</span>
              </div>)}
            <div className="ml-auto text-right">
              <p className="text-[11px] font-bold uppercase tracking-[0.12em]" style={{
              color: muted
            }}>{def.rects.length} rects</p>
              {problems.length > 0 && <p className="mt-1 text-[11px]" style={{
              color: COLOR.firedRed
            }}>{problems[0]}</p>}
            </div>
          </div>
          <CodeSnippetBlock label="Icon Factory · live def" lines={snippet} accentHex={COLOR.ochreOrange} />
        </div>
      </div>
    </section>;
};

// ─── Control Standards — the enforceable half of the design system ───────────
// Every interactive element the system sanctions, in every state, next to the
// colour role that governs it. If a control is not on this page, it does not
// exist yet: add it here and to DESIGN_SYSTEM.md §4–5 before using it in a
// product. Read this section before styling any button, field, or choice.

const ROLE_ROWS: { role: keyof ColorRoles; use: string }[] = [
  { role: 'canvas', use: 'Page background' },
  { role: 'surface', use: 'Cards, panels, bands' },
  { role: 'surfaceWell', use: 'Wells and code blocks — recedes, never raised' },
  { role: 'inverse', use: 'Footer, ticker, lab card' },
  { role: 'text', use: 'Headings and primary text' },
  { role: 'textBody', use: 'Long-form reading text' },
  { role: 'textMuted', use: 'Labels, captions, meta' },
  { role: 'textFaint', use: 'Disabled text and ordinals only' },
  { role: 'line', use: 'Hairline borders and dividers' },
  { role: 'actionBg', use: 'Primary action fill' },
  { role: 'accentBg', use: 'Warm in-card action fill' },
  { role: 'accentInk', use: 'The accent as ink: link, focus ring, ghost hover' },
  { role: 'dangerBg', use: 'Destructive action fill' },
  { role: 'fieldBorder', use: 'Field boundary at rest' },
  { role: 'fieldBorderInvalid', use: 'Field boundary when invalid' },
  { role: 'controlOn', use: 'Checked control fill' }
];

const STATUS_ROWS: { name: StatusName; means: string }[] = [
  { name: 'active', means: 'Live, running, in progress' },
  { name: 'caution', means: 'Warning, pending, needs attention' },
  { name: 'critical', means: 'Error, destructive, blocking' },
  { name: 'settled', means: 'Complete, archived, informational' }
];

// The label inside a card, exactly as the public site sets it: the role line
// on a system card. 12px uppercase muted — no dot, no rule.
//
// An earlier attempt at fixing this section invented a new label with an
// accent dot and a dither rule under it. That was the wrong move twice over:
// the site has no such object, and the section did not need a new component,
// it needed the ones the rest of the page already uses.
const SubLabel = ({ children, isDark, spaced = false }: {
  children: React.ReactNode;
  isDark: boolean;
  /** a label that follows content rather than opening a block needs air above it */
  spaced?: boolean;
}) => (
  <p className="uppercase" style={{
    fontSize: TYPE.eyebrow.size,
    fontWeight: TYPE.eyebrow.weight,
    letterSpacing: TYPE.eyebrow.tracking,
    lineHeight: TYPE.eyebrow.lineHeight,
    color: roles(isDark).textMuted,
    margin: spaced ? '40px 0 16px' : '0 0 16px'
  }}>
    {children}
  </p>
);

// ─── Control Standards — the enforceable half of the design system ───────────
// Every interactive element the system sanctions, in every state, next to the
// colour role that governs it. If a control is not on this page, it does not
// exist yet: add it here and to DESIGN_SYSTEM.md §4–5 before using it in a
// product. Read this section before styling any button, field, or choice.
//
// The mode switch is local to this section. The surrounding showcase does not
// support dark mode yet (see the TODO in OngandaNav), but every dark role must
// still be renderable and reviewable, so this section flips on its own.
export const ControlStandards = () => {
  const { isDark: pageDark } = useDark();
  const [isDark, setIsDark] = useState(pageDark);
  const c = roles(isDark);
  const [inquiry, setInquiry] = useState('pilot');
  const [consent, setConsent] = useState(true);
  const [live, setLive] = useState(true);


  return (
    <section id="controls" className="max-w-7xl mx-auto px-6 pb-24 md:px-12">
      <SectionHeader label="Control Standards" headline="One recipe per control. No free choices." accent={COLOR.barkRust} isDark={pageDark} />

      {/* The whole reference renders on the canvas role so both modes are real. */}
      <div id="controls-stage" data-mode={isDark ? 'dark' : 'light'} className="relative p-6 md:p-8" style={{ background: c.canvas, border: `1px solid ${c.line}` }}>
        <div className="mb-6 flex items-center justify-between gap-4">
          <p className="text-xs leading-relaxed" style={{ color: c.textMuted }}>
            Every value below is measured. <code>npm run check:contrast</code> fails the build on a regression.
          </p>
          <PixelToggle
            isDark={isDark}
            checked={isDark}
            onChange={setIsDark}
            label={<span className="text-[10px] font-bold uppercase tracking-[0.16em]">{isDark ? 'Dark' : 'Light'}</span>}
          />
        </div>

        {/* The light specimens. The control tests scope to this grid, so the
            inverse band below is measured separately rather than colliding
            with it on button labels. */}
        <div data-testid="controls-grid" className="grid gap-4 lg:grid-cols-2">
          {/* ── Colour roles ── */}
          <PixelPanel isDark={isDark} eyebrow="Colour roles · read the role, not the palette" accent={COLOR.ochreOrange}>

              <dl className="grid gap-0">
                {ROLE_ROWS.map(r => (
                  <div key={r.role} className="flex items-center gap-4 py-2.5 border-b" style={{ borderColor: c.line }}>
                    <span aria-hidden="true" className="h-5 w-5 shrink-0" style={{ background: c[r.role], border: `1px solid ${c.lineStrong}` }} />
                    <dt className="w-28 shrink-0 font-mono text-xs sm:w-40" style={{ color: c.text }}>{r.role}</dt>
                    <dd className="text-xs leading-relaxed" style={{ color: c.textMuted }}>{r.use}</dd>
                  </div>
                ))}
              </dl>
              <p className="mt-5 text-xs leading-relaxed" style={{ color: c.textMuted }}>
                Ochre is the accent as a <em>fill</em>. As ink on a light surface it measures 2.4:1, so the
                accent ink is bark rust there and ochre in dark mode. Mahangu gold, mopane brown, and dye
                plum are absent: they identify systems and carry chart series.
              </p>
            
          </PixelPanel>

          {/* ── Status and buttons ── */}
          <PixelPanel isDark={isDark} eyebrow="Status · four states, no green, no blue" accent={COLOR.barkRust}>

              <dl className="grid gap-0">
                {STATUS_ROWS.map(s => (
                  <div key={s.name} className="flex items-center gap-4 py-3 border-b" style={{ borderColor: c.line }}>
                    <PixelDot color={statusFor(s.name, isDark)} size={8} ring={c.lineStrong} />
                    <dt className="w-24 shrink-0 text-sm font-medium" style={{ color: c.text }}>{s.name}</dt>
                    <dd className="text-xs leading-relaxed" style={{ color: c.textMuted }}>{s.means}</dd>
                  </div>
                ))}
              </dl>
              <p className="mt-5 text-xs leading-relaxed" style={{ color: c.textMuted }}>
                A status mark always carries a text label and a hairline ring. Gold on cream is 1.6:1, so
                the ring is what delineates it — colour never carries the meaning alone.
              </p>

              <div className="mt-8">
                <SubLabel isDark={isDark} spaced>Density · the surface decides, not the control</SubLabel>
                <div className="mb-8 grid gap-4 sm:grid-cols-2">
                  <div style={{ border: `1px solid ${c.line}`, padding: 14 }}>
                    <p className="mb-3 text-[9px] font-bold uppercase tracking-[0.18em]" style={{ color: c.textMuted }}>Comfortable · pages</p>
                    <div className="flex flex-wrap items-center gap-2">
                      <PixelButton variant="primary" isDark={isDark}>Save</PixelButton>
                      <PixelButton variant="ghost" isDark={isDark}>Cancel</PixelButton>
                    </div>
                    <PixelInput className="mt-3" isDark={isDark} placeholder="Field" />
                  </div>
                  <DensityProvider value="compact">
                    <div style={{ border: `1px solid ${c.line}`, padding: 14 }}>
                      <p className="mb-3 text-[9px] font-bold uppercase tracking-[0.18em]" style={{ color: c.textMuted }}>Compact · popups, panels, toolbars</p>
                      <div className="flex flex-wrap items-center gap-2">
                        <PixelButton variant="primary" isDark={isDark}>Save</PixelButton>
                        <PixelButton variant="ghost" isDark={isDark}>Cancel</PixelButton>
                      </div>
                      <PixelInput className="mt-3" isDark={isDark} placeholder="Field" />
                    </div>
                  </DensityProvider>
                </div>

                <SubLabel isDark={isDark} spaced>Buttons · four intents</SubLabel>
                <div className="flex flex-wrap items-center gap-3">
                  <PixelButton variant="primary" isDark={isDark}>Primary</PixelButton>
                  <PixelButton variant="accent" isDark={isDark}>Accent</PixelButton>
                  <PixelButton variant="ghost" isDark={isDark}>Ghost</PixelButton>
                  <PixelButton variant="danger" isDark={isDark}>Delete</PixelButton>
                  <PixelButton variant="primary" isDark={isDark} disabled>Disabled</PixelButton>
                  <PixelIconButton label="Move up" isDark={isDark}><span aria-hidden="true">↑</span></PixelIconButton>
                </div>
                <p className="mt-4 text-xs leading-relaxed" style={{ color: c.textMuted }}>
                  One primary action per view. Danger is bark rust, not fired red: fired red's best
                  foreground is 4.05:1, under the floor for a button label.
                </p>
              </div>
            
          </PixelPanel>

          {/* ── Fields ── */}
          <PixelPanel isDark={isDark} eyebrow="Fields · transparent ground, accent-ink focus" accent={COLOR.mahanguGold}>
<div className="relative grid gap-5">
              <PixelField label="Email" hint="Focus the field to see the accent border." htmlFor="cs-email" isDark={isDark}>
                <PixelInput id="cs-email" isDark={isDark} type="email" placeholder="name@institution.na" />
              </PixelField>
              <PixelField label="Organisation" error="This field is required." htmlFor="cs-org" isDark={isDark}>
                <PixelInput id="cs-org" isDark={isDark} invalid placeholder="Institution or company" />
              </PixelField>
              <PixelField label="Reference" hint="Assigned after intake." htmlFor="cs-ref" isDark={isDark}>
                <PixelInput id="cs-ref" isDark={isDark} disabled placeholder="ONG-0000" />
              </PixelField>
              <PixelField label="Region" htmlFor="cs-region" isDark={isDark}>
                <PixelSelect id="cs-region" isDark={isDark} defaultValue="khomas">
                  <option value="khomas">Khomas</option>
                  <option value="oshana">Oshana</option>
                  <option value="erongo">Erongo</option>
                </PixelSelect>
              </PixelField>
              <PixelField label="Short note" htmlFor="cs-note" isDark={isDark}>
                <PixelTextarea id="cs-note" isDark={isDark} placeholder="What would you like to discuss?" style={{ minHeight: 88 }} />
              </PixelField>
            </div>
          </PixelPanel>

          {/* ── Choice controls ── */}
          <PixelPanel isDark={isDark} eyebrow="Radio · stepped octagon, square core" accent={COLOR.mopaneBrown}>
<div className="relative grid gap-8">
              <div>
                <div className="grid gap-3">
                  {[
                    { value: 'partnership', label: 'Partnership' },
                    { value: 'pilot', label: 'Pilot programme' },
                    { value: 'access', label: 'Early access' }
                  ].map(o => (
                    <PixelRadio
                      key={o.value}
                      name="cs-inquiry"
                      value={o.value}
                      isDark={isDark}
                      label={o.label}
                      checked={inquiry === o.value}
                      onChange={() => setInquiry(o.value)}
                    />
                  ))}
                  <PixelRadio name="cs-inquiry" isDark={isDark} label="Unavailable option" disabled />
                </div>
              </div>

              <div>
                <SubLabel isDark={isDark} spaced>Checkbox · square box, stepped check</SubLabel>
                <div className="grid gap-3">
                  <PixelCheckbox isDark={isDark} label="Send me lab updates" checked={consent} onChange={e => setConsent(e.currentTarget.checked)} />
                  <PixelCheckbox isDark={isDark} label="Unchecked" checked={false} onChange={() => {}} />
                  <PixelCheckbox isDark={isDark} label="Locked by policy" checked disabled onChange={() => {}} />
                </div>
              </div>

              <div>
                <SubLabel isDark={isDark} spaced>Toggle · the knob steps, it does not slide</SubLabel>
                <div className="grid gap-3">
                  <PixelToggle isDark={isDark} label="Publish to the public site" checked={live} onChange={setLive} />
                  <PixelToggle isDark={isDark} label="Disabled" checked={false} disabled />
                </div>
              </div>

              <p className="text-xs leading-relaxed" style={{ color: c.textMuted }}>
                Checked is ochre on all three, so "on" reads the same everywhere. The ochre fill is 2.56:1
                against dust light, so the accent-ink edge carries the boundary. No control is rounded and
                none uses a system colour.
              </p>
            </div>
          </PixelPanel>

        </div>

          {/* ── The inverse band ──
            Rule 12: a control on an inverse surface takes the dark role
            set. Until now that rule had no specimen — this section rendered
            no inverse surface at all in light mode, which also made it the
            only section on the page carrying none. A footer, a ticker or a
            lab card is a locally dark surface even on a light page, and a
            control dropped into one without `isDark` resolves its hover
            against the wrong ground and can vanish. */}
        <div data-testid="controls-inverse" className="relative mt-4 overflow-hidden p-8" style={{ background: roles(false).inverse }}>
          <WeaveOverlay isDark opacity={0.06} />
          <div className="relative">
            <SubLabel isDark>
              Inverse · a locally dark surface on a light page
            </SubLabel>
            <div className="flex flex-wrap items-center gap-3">
              <PixelButton variant="primary" isDark>Primary</PixelButton>
              <PixelButton variant="accent" isDark>Accent</PixelButton>
              <PixelButton variant="ghost" isDark>Ghost</PixelButton>
              <PixelToggle isDark label="Enabled" checked onChange={() => {}} />
              <PixelCheckbox isDark label="Checked" checked onChange={() => {}} />
            </div>
            <p className="mt-5 text-xs leading-relaxed" style={{ color: roles(true).textMuted }}>
              The same four intents, rendered with <code>isDark</code>. Pass it whenever a control sits on
              the footer, the ticker or a lab card — the page being light does not make the surface light.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

// ─── Product Patterns — the surfaces a real product needs ────────────────────
// Control Standards covers the atoms. This covers the compounds: the dialog,
// table, notice, empty state, loading state, tabs and progress bar that every
// product reaches for. They live here so an agent building a product has an
// Onganda answer instead of inventing generic chrome.
//
// Like Control Standards, this section carries its own light/dark switch and
// every pattern is shown in every state.

const PATTERN_ROWS = [
  { id: 'okaanda', system: 'Okaanda', role: 'Model & data platform', status: 'settled' as StatusName, models: 128, uptime: 99.4 },
  { id: 'oshini', system: 'Oshini', role: 'Adaptation workflows', status: 'active' as StatusName, models: 64, uptime: 98.1 },
  { id: 'ombiga', system: 'Ombiga', role: 'Agents & containers', status: 'caution' as StatusName, models: 31, uptime: 94.7 },
  { id: 'oshitoo', system: 'Oshitoo', role: 'Sector applications', status: 'critical' as StatusName, models: 8, uptime: 71.2 }
];

export const ProductPatterns = () => {
  const { isDark: pageDark } = useDark();
  const [isDark, setIsDark] = useState(pageDark);
  const c = roles(isDark);
  const [tab, setTab] = useState<'live' | 'queued' | 'archived'>('live');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [choice, setChoice] = useState('The split changes between runs');


  return (
    <section id="patterns" className="max-w-7xl mx-auto px-6 pb-24 md:px-12">
      <SectionHeader label="Product Patterns" headline="The compounds, not just the atoms." accent={COLOR.dyePlum} isDark={pageDark} />

      <div id="patterns-stage" data-mode={isDark ? 'dark' : 'light'} className="relative p-6 md:p-8" style={{ background: c.canvas, border: `1px solid ${c.line}` }}>
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <p className="text-xs leading-relaxed" style={{ color: c.textMuted }}>
            A product needs a dialog on day one. Build from these instead of inventing chrome.
          </p>
          <PixelToggle
            isDark={isDark}
            checked={isDark}
            onChange={setIsDark}
            label={<span className="text-[10px] font-bold uppercase tracking-[0.16em]">{isDark ? 'Dark' : 'Light'}</span>}
          />
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          {/* ── Notices ── */}
          <PixelPanel isDark={isDark} eyebrow="Notice · one per status, colour never alone" accent={COLOR.dyePlum}>

              <div className="grid gap-3">
                <PixelNotice isDark={isDark} status="active" title="Evaluation running">
                  namibia-base-1b is being scored against the Oshiwambo benchmark.
                </PixelNotice>
                <PixelNotice isDark={isDark} status="caution" title="Quota at 94%">
                  Archive completed runs to free granary space.
                </PixelNotice>
                <PixelNotice isDark={isDark} status="critical" title="Deployment failed">
                  The Ombiga container could not reach the model registry.
                </PixelNotice>
                {!dismissed && (
                  <PixelNotice isDark={isDark} status="settled" title="Corpus v1 archived" onDismiss={() => setDismissed(true)}>
                    Dismissable. Press the stepped cross to remove.
                  </PixelNotice>
                )}
              </div>
            
          </PixelPanel>

          {/* ── Tabs, progress, dialog trigger ── */}
          <PixelPanel isDark={isDark} eyebrow="Tabs · ghost recipe, ochre when active" accent={COLOR.ochreOrange}>
<div className="relative grid gap-8">
              <div>
                <PixelTabs
                  isDark={isDark}
                  label="Run state"
                  value={tab}
                  onChange={setTab}
                  tabs={[
                    { value: 'live', label: 'Live' },
                    { value: 'queued', label: 'Queued' },
                    { value: 'archived', label: 'Archived' }
                  ]}
                />
                <p className="mt-3 text-xs" style={{ color: c.textMuted }}>Showing <strong style={{ color: c.text }}>{tab}</strong> runs.</p>
              </div>

              <div className="grid gap-5">
                <SubLabel isDark={isDark} spaced>Progress · dithered fill, never a smooth gradient</SubLabel>
                <PixelProgress isDark={isDark} label="Corpus ingestion" value={100} status="settled" />
                <PixelProgress isDark={isDark} label="Fine-tuning" value={78} status="active" />
                <PixelProgress isDark={isDark} label="Container rollout" value={34} status="caution" />
              </div>

              <div>
                <SubLabel isDark={isDark} spaced>Dialog · focus trap, escape, scrim</SubLabel>
                <PixelButton variant="danger" isDark={isDark} onClick={() => setDialogOpen(true)}>Delete dataset</PixelButton>
              </div>
            </div>
          </PixelPanel>

          {/* ── Panel, choices, actions — the compact composition ── */}
          <PixelPanel isDark={isDark} eyebrow="Panel · a compact surface cannot be built without the language" accent={COLOR.barkRust}>

              <DensityProvider value="compact">
                <PixelPanel
                  isDark={isDark}
                  eyebrow="Practice — MCQ · data splitting"
                  title="What happens if train_test_split uses shuffle=True without random_state?"
                  footer={
                    <PixelActions align="between">
                      <PixelButton variant="primary" isDark={isDark}>Send answer</PixelButton>
                      <PixelButton variant="ghost" isDark={isDark}>Next exercise</PixelButton>
                    </PixelActions>
                  }
                >
                  <div className="mt-4">
                    <PixelChoiceList label="Answer" isDark={isDark}>
                      {[
                        'The split is reproducible',
                        'The split changes between runs',
                        'The split fails',
                        'The test set is empty'
                      ].map(o => (
                        <PixelChoice
                          key={o}
                          isDark={isDark}
                          label={o}
                          selected={choice === o}
                          onSelect={() => setChoice(o)}
                        />
                      ))}
                    </PixelChoiceList>
                  </div>
                </PixelPanel>
              </DensityProvider>
              <p className="mt-4 text-xs leading-relaxed" style={{ color: c.textMuted }}>
                The panel brings its own eyebrow, weave and corner marks, so a compact
                surface carries the language without the product re-deriving it.
              </p>

              {/* The same component at page density. This is the brand's card:
                  a transcript of the public site's feature card, and the
                  reference the fidelity test measures against. Showing only
                  the compact one left the actual card off the inventory. */}
              <SubLabel isDark={isDark} spaced>Panel · page density — the public site&rsquo;s card</SubLabel>
              <PixelPanel
                data-testid="panel-page-density"
                isDark={isDark}
                eyebrow="Focus"
                title="Adapt models"
                note="Select, adapt, evaluate, and organize models for local use."
              >
                <PixelActions>
                  <PixelButton variant="ghost" isDark={isDark}>Read the brief</PixelButton>
                </PixelActions>
              </PixelPanel>

              {/* The second recipe. A card that stands for a thing with its own
                  colour takes a spine and a closing dither rule instead of
                  corner marks — never both sets of marks at once. */}
              <SubLabel isDark={isDark} spaced>Panel · spine recipe — for a card that carries an identity</SubLabel>
              <PixelPanel
                isDark={isDark}
                spine
                accent={COLOR.mahanguGold}
                eyebrow="Agents &amp; containers"
                title="Ombiga"
                note="Containers, agents, and held systems."
              />
            
          </PixelPanel>

          {/* ── Table ── */}
          <PixelPanel isDark={isDark} eyebrow="Table · editorial rhythm, tabular figures" accent={COLOR.mahanguGold}>

              <PixelTable
                isDark={isDark}
                caption="Systems overview"
                rows={PATTERN_ROWS}
                rowKey={row => row.id}
                columns={[
                  {
                    key: 'system',
                    header: 'System',
                    render: row => (
                      // Two signals, two meanings: the left rule is the system's
                      // identity, the dot is its run status.
                      <span className="flex items-center gap-2" style={{ borderLeft: `3px solid ${SYSTEM_COLOR[row.system as SystemName]}`, paddingLeft: 8 }}>
                        <PixelDot color={statusFor(row.status, isDark)} size={6} ring={c.lineStrong} />
                        <strong style={{ color: c.text }}>{row.system}</strong>
                      </span>
                    )
                  },
                  { key: 'role', header: 'Role', render: row => row.role },
                  { key: 'models', header: 'Models', numeric: true, render: row => row.models },
                  { key: 'uptime', header: 'Uptime', numeric: true, render: row => `${row.uptime}%` }
                ]}
              />
            
          </PixelPanel>

          {/* ── Empty and loading ── */}
          <PixelPanel isDark={isDark} eyebrow="Empty · the surface a product shows first" accent={COLOR.mopaneBrown}>
<div className="relative grid gap-8">
              <div>
                <PixelEmptyState
                  isDark={isDark}
                  icon={<IconOkaanda size={44} />}
                  title="No datasets yet"
                  body="Ingest a corpus to start evaluating models against Namibian language data."
                  action={<PixelButton variant="accent" isDark={isDark}>Ingest a corpus</PixelButton>}
                />
              </div>
              <div>
                <SubLabel isDark={isDark} spaced>Loading · a dither sweep, not a soft shimmer</SubLabel>
                <div style={{ background: c.surfaceWell, border: `1px solid ${c.line}`, padding: 20 }}>
                  <PixelSkeleton isDark={isDark} lines={4} />
                </div>
              </div>
            </div>
          </PixelPanel>
        </div>

        {/* ── Site compositions — the brand's own surfaces ──
            These are the public site's building blocks. They were private
            markup inside the site file until now, which meant the thing the
            design system exists to describe was the one thing it did not
            contain. A consumer had to re-derive them by eye. */}
        <div className="mt-4">
          <SubLabel isDark={isDark}>Site composition · ticker — the only place all five system colours meet</SubLabel>
          <PixelTicker />
        </div>

        <div className="mt-10">
          <SubLabel isDark={isDark}>Site composition · stat band — cells divided by a hairline, never a gap</SubLabel>
          <PixelStatBand
            isDark={isDark}
            stats={[
              { value: '5', label: 'Active systems', sub: 'in architecture', hex: COLOR.ochreOrange },
              { value: '3', label: 'Language models', sub: 'adapted for Namibia', hex: COLOR.barkRust },
              { value: '12', label: 'Sector pilots', sub: 'across 4 industries', hex: COLOR.mahanguGold },
              { value: '1', label: 'Sovereign lab', sub: 'Windhoek, Namibia', hex: COLOR.mopaneBrown }
            ]}
          />
        </div>

        <div className="mt-10 grid gap-4 lg:grid-cols-2">
          <div>
            <SubLabel isDark={isDark}>Site composition · focus rows — a list that reads as a sequence</SubLabel>
            <div className="grid gap-3">
              {[
                { t: 'Adapt models', hex: COLOR.ochreOrange, b: 'Select, adapt, evaluate, and organize models for local use.' },
                { t: 'Run workflows', hex: COLOR.barkRust, b: 'Build repeatable adaptation and deployment paths.' },
                { t: 'Hold systems', hex: COLOR.mahanguGold, b: 'Package agents, memory, and runtimes into portable units.' }
              ].map((f, i) => (
                <PixelFocusRow key={f.t} index={i} accent={f.hex} title={f.t} isDark={isDark}>
                  {f.b}
                </PixelFocusRow>
              ))}
            </div>
          </div>
          <div>
            <SubLabel isDark={isDark}>Site composition · lab card — one per grid, in the last cell</SubLabel>
            <PixelLabCard tag="Lab" title="Onganda" accent={COLOR.ochreOrange}>
              Five systems working as one compound: from readiness to delivery.
            </PixelLabCard>
          </div>
        </div>

        <PixelDialog
          isDark={isDark}
          open={dialogOpen}
          onClose={() => setDialogOpen(false)}
          eyebrow="Okaanda · granary"
          title="Delete the evaluation corpus?"
          footer={
            <>
              <PixelButton variant="ghost" isDark={isDark} onClick={() => setDialogOpen(false)}>Cancel</PixelButton>
              <PixelButton variant="danger" isDark={isDark} onClick={() => setDialogOpen(false)}>Delete corpus</PixelButton>
            </>
          }
        >
          <p>
            This removes 128 evaluation records and every scored run attached to them. Exports already
            downloaded are unaffected.
          </p>
          <div className="mt-5">
            <PixelNotice isDark={isDark} status="critical" title="This cannot be undone" />
          </div>
        </PixelDialog>
      </div>
    </section>
  );
};

export const OkaandaNav = OngandaNav;
export const OkaandaHero = OngandaHero;
