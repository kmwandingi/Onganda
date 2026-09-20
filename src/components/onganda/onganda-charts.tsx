// ─── Onganda Design System — Chart Gallery ────────────────────────────────────
// Self-contained chart showcase. 15+ chart types rendered with Recharts,
// styled strictly within the Onganda material palette. Light card backgrounds.
// Each chart ships with an inline legend. Category filter for navigation.

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, LineChart, Line, AreaChart, Area, PieChart, Pie, Cell, RadarChart, Radar, PolarGrid, PolarAngleAxis, ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ComposedChart, ReferenceLine, RadialBarChart, RadialBar, Treemap, FunnelChart, Funnel, LabelList } from 'recharts';
import { COLOR } from './onganda-colors';
import { CHART_SERIES, onColor } from './onganda-roles';
import { SectionHeader, DitherBar, PixelTag, PixelDot } from './onganda-primitives';

// ─── Design tokens for charts ─────────────────────────────────────────────────
const C = {
  card: COLOR.dustLight,
  // dustLight — warm lifted surface
  cardAlt: 'rgba(232,225,207,0.62)',
  // slightly deeper for alt rows
  border: 'rgba(30,26,23,0.10)',
  label: 'rgba(30,26,23,0.66)',
  tick: 'rgba(30,26,23,0.66)',
  grid: 'rgba(30,26,23,0.07)',
  tooltipBg: COLOR.charBlack,
  tooltipText: COLOR.milletClay,
  // Fixed series order — see CHART_SERIES in onganda-roles.ts
  p: CHART_SERIES
} as const;

// ─── Chart types / categories ─────────────────────────────────────────────────
type ChartCategory = 'Bar' | 'Line' | 'Area' | 'Circular' | 'Relational' | 'Composition';
const CHART_CATEGORIES: ChartCategory[] = ['Bar', 'Line', 'Area', 'Circular', 'Relational', 'Composition'];

// ─── Shared dataset definitions ───────────────────────────────────────────────
const MONTHLY_DATA = [{
  month: 'Jan',
  okaanda: 42,
  oshini: 28,
  ombiga: 19
}, {
  month: 'Feb',
  okaanda: 55,
  oshini: 36,
  ombiga: 27
}, {
  month: 'Mar',
  okaanda: 48,
  oshini: 44,
  ombiga: 34
}, {
  month: 'Apr',
  okaanda: 63,
  oshini: 52,
  ombiga: 41
}, {
  month: 'May',
  okaanda: 71,
  oshini: 61,
  ombiga: 48
}, {
  month: 'Jun',
  okaanda: 67,
  oshini: 58,
  ombiga: 55
}, {
  month: 'Jul',
  okaanda: 82,
  oshini: 70,
  ombiga: 62
}, {
  month: 'Aug',
  okaanda: 78,
  oshini: 74,
  ombiga: 69
}];
const QUARTERLY_STACKED = [{
  q: 'Q1 2024',
  foundation: 100,
  adaptation: 0,
  containment: 0,
  surface: 0
}, {
  q: 'Q2 2024',
  foundation: 100,
  adaptation: 44,
  containment: 0,
  surface: 0
}, {
  q: 'Q3 2024',
  foundation: 100,
  adaptation: 78,
  containment: 18,
  surface: 0
}, {
  q: 'Q4 2024',
  foundation: 100,
  adaptation: 95,
  containment: 34,
  surface: 8
}, {
  q: 'Q1 2025',
  foundation: 100,
  adaptation: 100,
  containment: 52,
  surface: 22
}];
const SECTOR_SHARE = [{
  name: 'Healthcare',
  value: 34
}, {
  name: 'Agriculture',
  value: 27
}, {
  name: 'Education',
  value: 22
}, {
  name: 'Public Sector',
  value: 17
}];
const SCATTER_DATA = [{
  x: 12,
  y: 38,
  label: 'Okaanda'
}, {
  x: 28,
  y: 55,
  label: 'Oshini'
}, {
  x: 44,
  y: 42,
  label: 'Ombiga'
}, {
  x: 56,
  y: 71,
  label: 'Etiti'
}, {
  x: 67,
  y: 63,
  label: 'Oshitoo'
}, {
  x: 35,
  y: 80,
  label: 'Cross'
}, {
  x: 72,
  y: 50,
  label: 'Pilot A'
}, {
  x: 20,
  y: 66,
  label: 'Pilot B'
}];
const RADAR_DATA = [{
  metric: 'Data',
  okaanda: 90,
  oshini: 60
}, {
  metric: 'Models',
  okaanda: 72,
  oshini: 88
}, {
  metric: 'Agents',
  okaanda: 45,
  oshini: 55
}, {
  metric: 'Interfaces',
  okaanda: 58,
  oshini: 70
}, {
  metric: 'Delivery',
  okaanda: 38,
  oshini: 65
}, {
  metric: 'Security',
  okaanda: 80,
  oshini: 74
}];
const RADIAL_DATA = [{
  name: 'Okaanda',
  value: 90,
  fill: C.p[0]
}, {
  name: 'Oshini',
  value: 78,
  fill: C.p[1]
}, {
  name: 'Ombiga',
  value: 34,
  fill: C.p[2]
}, {
  name: 'Etiti',
  value: 12,
  fill: C.p[3]
}, {
  name: 'Oshitoo',
  value: 4,
  fill: C.p[4]
}];
const WATERFALL_DATA = [{
  name: 'Q1 Base',
  value: 240,
  type: 'base'
}, {
  name: 'Corpus +',
  value: 85,
  type: 'gain'
}, {
  name: 'Eval +',
  value: 62,
  type: 'gain'
}, {
  name: 'Infra –',
  value: -38,
  type: 'loss'
}, {
  name: 'SDK +',
  value: 44,
  type: 'gain'
}, {
  name: 'Ops –',
  value: -22,
  type: 'loss'
}, {
  name: 'Q2 End',
  value: 471,
  type: 'base'
}];
const FUNNEL_DATA = [{
  name: 'Research',
  value: 1000,
  fill: C.p[0]
}, {
  name: 'Prototyping',
  value: 740,
  fill: C.p[1]
}, {
  name: 'Pilot',
  value: 440,
  fill: C.p[2]
}, {
  name: 'Deployment',
  value: 220,
  fill: C.p[3]
}, {
  name: 'Scale',
  value: 80,
  fill: C.p[4]
}];
const TREEMAP_DATA = [{
  name: 'NLP',
  size: 420,
  fill: C.p[0]
}, {
  name: 'Vision',
  size: 290,
  fill: C.p[1]
}, {
  name: 'Speech',
  size: 210,
  fill: C.p[2]
}, {
  name: 'Search',
  size: 185,
  fill: C.p[3]
}, {
  name: 'Agents',
  size: 160,
  fill: C.p[0]
}, {
  name: 'Safety',
  size: 120,
  fill: C.p[4]
}, {
  name: 'Infra',
  size: 95,
  fill: C.p[1]
}, {
  name: 'Eval',
  size: 70,
  fill: C.p[5]
}];
const STEP_DATA = [{
  date: 'Jan',
  phases: 1
}, {
  date: 'Feb',
  phases: 1
}, {
  date: 'Mar',
  phases: 2
}, {
  date: 'Apr',
  phases: 2
}, {
  date: 'May',
  phases: 3
}, {
  date: 'Jun',
  phases: 3
}, {
  date: 'Jul',
  phases: 4
}, {
  date: 'Aug',
  phases: 4
}];
const DELTA_DATA = [{
  month: 'Jan',
  delta: 12
}, {
  month: 'Feb',
  delta: -5
}, {
  month: 'Mar',
  delta: 18
}, {
  month: 'Apr',
  delta: -3
}, {
  month: 'May',
  delta: 24
}, {
  month: 'Jun',
  delta: -8
}, {
  month: 'Jul',
  delta: 31
}, {
  month: 'Aug',
  delta: 14
}];
const HORIZON_DATA = [{
  t: 'Jan',
  a: 38,
  b: 55
}, {
  t: 'Feb',
  a: 44,
  b: 60
}, {
  t: 'Mar',
  a: 52,
  b: 50
}, {
  t: 'Apr',
  a: 61,
  b: 58
}, {
  t: 'May',
  a: 55,
  b: 72
}, {
  t: 'Jun',
  a: 70,
  b: 65
}, {
  t: 'Jul',
  a: 80,
  b: 74
}, {
  t: 'Aug',
  a: 76,
  b: 88
}];
const HORIZONTAL_DATA = [{
  system: 'Okaanda',
  score: 90
}, {
  system: 'Oshini',
  score: 78
}, {
  system: 'Ombiga',
  score: 34
}, {
  system: 'Etiti',
  score: 12
}, {
  system: 'Oshitoo',
  score: 4
}];

// ─── Shared sub-components ────────────────────────────────────────────────────

const ChartTooltip = ({
  active,
  payload,
  label
}: {
  active?: boolean;
  payload?: Array<{
    name: string;
    value: number;
    color: string;
  }>;
  label?: string;
}) => {
  if (!active || !payload || payload.length === 0) return null;
  return <div style={{
    background: C.tooltipBg,
    border: `1px solid ${COLOR.ochreOrange}44`,
    padding: '8px 12px',
    minWidth: 120
  }}>
      {label && <p style={{
      fontSize: 9,
      fontWeight: 700,
      letterSpacing: '0.14em',
      textTransform: 'uppercase',
      color: COLOR.ochreOrange,
      marginBottom: 6
    }}>
          {label}
        </p>}
      {payload.map(item => <div key={`tt-${item.name}`} style={{
      display: 'flex',
      alignItems: 'center',
      gap: 6,
      marginBottom: 2
    }}>
          <div style={{
        width: 6,
        height: 6,
        background: item.color,
        flexShrink: 0
      }} />
          <span style={{
        fontSize: 10,
        color: C.tooltipText,
        opacity: 0.6
      }}>{item.name}:</span>
          <span style={{
        fontSize: 11,
        fontWeight: 700,
        color: C.tooltipText
      }}>{item.value}</span>
        </div>)}
    </div>;
};

// Minimal legend that sits below each chart
const ChartLegend = ({
  items
}: {
  items: Array<{
    label: string;
    color: string;
    dash?: boolean;
  }>;
}) => <div style={{
  display: 'flex',
  gap: 16,
  flexWrap: 'wrap',
  marginTop: 12
}}>
    {items.map(item => <div key={item.label} style={{
    display: 'flex',
    alignItems: 'center',
    gap: 5
  }}>
        {item.dash ? <div style={{
      width: 14,
      height: 2,
      background: item.color,
      opacity: 0.8
    }} aria-hidden="true" /> : <div style={{
      width: 8,
      height: 8,
      background: item.color,
      flexShrink: 0
    }} aria-hidden="true" />}
        <span style={{
      fontSize: 9,
      fontWeight: 700,
      letterSpacing: '0.12em',
      textTransform: 'uppercase',
      color: C.label
    }}>
          {item.label}
        </span>
      </div>)}
  </div>;

// Card wrapper for each chart
const ChartCard = ({
  title,
  tag,
  category,
  children,
  legend,
  fullWidth = false
}: {
  title: string;
  tag: string;
  category: ChartCategory;
  children: React.ReactNode;
  legend: Array<{
    label: string;
    color: string;
    dash?: boolean;
  }>;
  fullWidth?: boolean;
}) => <motion.div initial={{
  opacity: 0,
  y: 12
}} whileInView={{
  opacity: 1,
  y: 0
}} viewport={{
  once: true,
  margin: '-40px'
}} transition={{
  duration: 0.45
}} style={{
  background: C.card,
  border: `1px solid ${C.border}`,
  padding: '20px 20px 16px',
  display: 'flex',
  flexDirection: 'column',
  gridColumn: fullWidth ? 'span 2' : undefined
}}>
    <div style={{
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16
  }}>
      <p style={{
      fontSize: 11,
      fontWeight: 700,
      letterSpacing: '0.10em',
      textTransform: 'uppercase',
      color: 'rgba(30,26,23,0.65)'
    }}>
        {title}
      </p>
      <PixelTag hex={C.p[CHART_CATEGORIES.indexOf(category) % C.p.length]} label={tag} />
    </div>
    <div style={{
    flex: 1
  }}>
      {children}
    </div>
    <ChartLegend items={legend} />
    <DitherBar color={C.p[CHART_CATEGORIES.indexOf(category) % C.p.length]} segments={24} height={2} opacity={0.45} className="mt-3" />
  </motion.div>;

// ─── Individual chart definitions ─────────────────────────────────────────────

const GroupedBarChartPanel = () => <ChartCard title="Monthly Activity — Grouped" tag="B-01" category="Bar" legend={[{
  label: 'Okaanda',
  color: C.p[0]
}, {
  label: 'Oshini',
  color: C.p[1]
}, {
  label: 'Ombiga',
  color: C.p[2]
}]}>
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={MONTHLY_DATA} barGap={2} barCategoryGap="28%">
        <CartesianGrid vertical={false} stroke={C.grid} />
        <XAxis dataKey="month" tick={{
        fontSize: 9,
        fill: C.tick,
        fontWeight: 700
      }} axisLine={false} tickLine={false} />
        <YAxis tick={{
        fontSize: 9,
        fill: C.tick
      }} axisLine={false} tickLine={false} />
        <Tooltip content={<ChartTooltip />} cursor={{
        fill: 'rgba(30,26,23,0.04)'
      }} />
        <Bar dataKey="okaanda" name="Okaanda" fill={C.p[0]} />
        <Bar dataKey="oshini" name="Oshini" fill={C.p[1]} />
        <Bar dataKey="ombiga" name="Ombiga" fill={C.p[2]} />
      </BarChart>
    </ResponsiveContainer>
  </ChartCard>;
const StackedBarChartPanel = () => <ChartCard title="Phase Progress — Stacked" tag="B-02" category="Bar" legend={[{
  label: 'Foundation',
  color: C.p[0]
}, {
  label: 'Adaptation',
  color: C.p[1]
}, {
  label: 'Containment',
  color: C.p[2]
}, {
  label: 'Surface',
  color: C.p[3]
}]}>
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={QUARTERLY_STACKED} barCategoryGap="32%">
        <CartesianGrid vertical={false} stroke={C.grid} />
        <XAxis dataKey="q" tick={{
        fontSize: 9,
        fill: C.tick,
        fontWeight: 700
      }} axisLine={false} tickLine={false} />
        <YAxis tick={{
        fontSize: 9,
        fill: C.tick
      }} axisLine={false} tickLine={false} />
        <Tooltip content={<ChartTooltip />} cursor={{
        fill: 'rgba(30,26,23,0.04)'
      }} />
        <Bar dataKey="foundation" name="Foundation" stackId="a" fill={C.p[0]} />
        <Bar dataKey="adaptation" name="Adaptation" stackId="a" fill={C.p[1]} />
        <Bar dataKey="containment" name="Containment" stackId="a" fill={C.p[2]} />
        <Bar dataKey="surface" name="Surface" stackId="a" fill={C.p[3]} />
      </BarChart>
    </ResponsiveContainer>
  </ChartCard>;
const HorizontalBarChartPanel = () => <ChartCard title="System Readiness — Horizontal" tag="B-03" category="Bar" legend={[{
  label: 'Readiness Score',
  color: C.p[0]
}]}>
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={HORIZONTAL_DATA} layout="vertical" barCategoryGap="30%">
        <CartesianGrid horizontal={false} stroke={C.grid} />
        <XAxis type="number" domain={[0, 100]} tick={{
        fontSize: 9,
        fill: C.tick
      }} axisLine={false} tickLine={false} />
        <YAxis dataKey="system" type="category" tick={{
        fontSize: 9,
        fill: C.tick,
        fontWeight: 700
      }} axisLine={false} tickLine={false} width={72} />
        <Tooltip content={<ChartTooltip />} cursor={{
        fill: 'rgba(30,26,23,0.04)'
      }} />
        <Bar dataKey="score" name="Readiness Score" fill={C.p[0]}>
          {HORIZONTAL_DATA.map(entry => <Cell key={`hb-${entry.system}`} fill={C.p[HORIZONTAL_DATA.indexOf(entry) % C.p.length]} />)}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  </ChartCard>;
const DeltaBarChartPanel = () => <ChartCard title="Monthly Delta — Gain / Loss" tag="B-04" category="Bar" legend={[{
  label: 'Positive delta',
  color: C.p[0]
}, {
  label: 'Negative delta',
  color: C.p[5]
}]}>
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={DELTA_DATA} barCategoryGap="32%">
        <CartesianGrid vertical={false} stroke={C.grid} />
        <XAxis dataKey="month" tick={{
        fontSize: 9,
        fill: C.tick,
        fontWeight: 700
      }} axisLine={false} tickLine={false} />
        <YAxis tick={{
        fontSize: 9,
        fill: C.tick
      }} axisLine={false} tickLine={false} />
        <ReferenceLine y={0} stroke={C.border} strokeWidth={1.5} />
        <Tooltip content={<ChartTooltip />} cursor={{
        fill: 'rgba(30,26,23,0.04)'
      }} />
        <Bar dataKey="delta" name="Delta">
          {DELTA_DATA.map(entry => <Cell key={`dc-${entry.month}`} fill={entry.delta >= 0 ? C.p[0] : C.p[5]} />)}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  </ChartCard>;
const MultiLineChartPanel = () => <ChartCard title="Research Activity — Multi-line" tag="L-01" category="Line" legend={[{
  label: 'Okaanda',
  color: C.p[0],
  dash: true
}, {
  label: 'Oshini',
  color: C.p[1],
  dash: true
}, {
  label: 'Ombiga',
  color: C.p[2],
  dash: true
}]}>
    <ResponsiveContainer width="100%" height={220}>
      <LineChart data={MONTHLY_DATA}>
        <CartesianGrid stroke={C.grid} />
        <XAxis dataKey="month" tick={{
        fontSize: 9,
        fill: C.tick,
        fontWeight: 700
      }} axisLine={false} tickLine={false} />
        <YAxis tick={{
        fontSize: 9,
        fill: C.tick
      }} axisLine={false} tickLine={false} />
        <Tooltip content={<ChartTooltip />} />
        <Line type="monotone" dataKey="okaanda" name="Okaanda" stroke={C.p[0]} strokeWidth={2} dot={{
        r: 3,
        fill: C.p[0]
      }} activeDot={{
        r: 4
      }} />
        <Line type="monotone" dataKey="oshini" name="Oshini" stroke={C.p[1]} strokeWidth={2} dot={{
        r: 3,
        fill: C.p[1]
      }} activeDot={{
        r: 4
      }} />
        <Line type="monotone" dataKey="ombiga" name="Ombiga" stroke={C.p[2]} strokeWidth={2} dot={{
        r: 3,
        fill: C.p[2]
      }} activeDot={{
        r: 4
      }} />
      </LineChart>
    </ResponsiveContainer>
  </ChartCard>;
const StepLineChartPanel = () => <ChartCard title="Phase Activations — Step Line" tag="L-02" category="Line" legend={[{
  label: 'Active phases',
  color: C.p[0],
  dash: true
}]}>
    <ResponsiveContainer width="100%" height={220}>
      <LineChart data={STEP_DATA}>
        <CartesianGrid stroke={C.grid} />
        <XAxis dataKey="date" tick={{
        fontSize: 9,
        fill: C.tick,
        fontWeight: 700
      }} axisLine={false} tickLine={false} />
        <YAxis tick={{
        fontSize: 9,
        fill: C.tick
      }} axisLine={false} tickLine={false} domain={[0, 5]} ticks={[0, 1, 2, 3, 4, 5]} />
        <Tooltip content={<ChartTooltip />} />
        <Line type="stepAfter" dataKey="phases" name="Active phases" stroke={C.p[0]} strokeWidth={2.5} dot={{
        r: 4,
        fill: C.p[0]
      }} />
      </LineChart>
    </ResponsiveContainer>
  </ChartCard>;
const DualAxisLineChartPanel = () => <ChartCard title="Dual-Series Trend — Composed" tag="L-03" category="Line" legend={[{
  label: 'Series A',
  color: C.p[0],
  dash: true
}, {
  label: 'Series B',
  color: C.p[1],
  dash: true
}]} fullWidth>
    <ResponsiveContainer width="100%" height={220}>
      <ComposedChart data={HORIZON_DATA}>
        <CartesianGrid stroke={C.grid} />
        <XAxis dataKey="t" tick={{
        fontSize: 9,
        fill: C.tick,
        fontWeight: 700
      }} axisLine={false} tickLine={false} />
        <YAxis yAxisId="left" tick={{
        fontSize: 9,
        fill: C.tick
      }} axisLine={false} tickLine={false} />
        <YAxis yAxisId="right" orientation="right" tick={{
        fontSize: 9,
        fill: C.tick
      }} axisLine={false} tickLine={false} />
        <Tooltip content={<ChartTooltip />} />
        <Line yAxisId="left" type="monotone" dataKey="a" name="Series A" stroke={C.p[0]} strokeWidth={2} dot={{
        r: 3,
        fill: C.p[0]
      }} />
        <Line yAxisId="right" type="monotone" dataKey="b" name="Series B" stroke={C.p[1]} strokeWidth={2} strokeDasharray="4 3" dot={{
        r: 3,
        fill: C.p[1]
      }} />
      </ComposedChart>
    </ResponsiveContainer>
  </ChartCard>;
const SimpleAreaChartPanel = () => <ChartCard title="Cumulative Growth — Area" tag="A-01" category="Area" legend={[{
  label: 'Okaanda',
  color: C.p[0]
}, {
  label: 'Oshini',
  color: C.p[1]
}]}>
    <ResponsiveContainer width="100%" height={220}>
      <AreaChart data={MONTHLY_DATA}>
        <defs>
          <linearGradient id="areaGrad0" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={C.p[0]} stopOpacity={0.38} />
            <stop offset="100%" stopColor={C.p[0]} stopOpacity={0.04} />
          </linearGradient>
          <linearGradient id="areaGrad1" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={C.p[1]} stopOpacity={0.32} />
            <stop offset="100%" stopColor={C.p[1]} stopOpacity={0.04} />
          </linearGradient>
        </defs>
        <CartesianGrid stroke={C.grid} />
        <XAxis dataKey="month" tick={{
        fontSize: 9,
        fill: C.tick,
        fontWeight: 700
      }} axisLine={false} tickLine={false} />
        <YAxis tick={{
        fontSize: 9,
        fill: C.tick
      }} axisLine={false} tickLine={false} />
        <Tooltip content={<ChartTooltip />} />
        <Area type="monotone" dataKey="okaanda" name="Okaanda" stroke={C.p[0]} strokeWidth={2} fill="url(#areaGrad0)" />
        <Area type="monotone" dataKey="oshini" name="Oshini" stroke={C.p[1]} strokeWidth={2} fill="url(#areaGrad1)" />
      </AreaChart>
    </ResponsiveContainer>
  </ChartCard>;
const StackedAreaChartPanel = () => <ChartCard title="Stacked Area — Phase Rollup" tag="A-02" category="Area" legend={[{
  label: 'Foundation',
  color: C.p[0]
}, {
  label: 'Adaptation',
  color: C.p[1]
}, {
  label: 'Containment',
  color: C.p[2]
}, {
  label: 'Surface',
  color: C.p[3]
}]}>
    <ResponsiveContainer width="100%" height={220}>
      <AreaChart data={QUARTERLY_STACKED}>
        <defs>
          {([0, 1, 2, 3] as const).map(i => <linearGradient key={`sg-${i}`} id={`stackGrad${i}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={C.p[i]} stopOpacity={0.65} />
              <stop offset="100%" stopColor={C.p[i]} stopOpacity={0.22} />
            </linearGradient>)}
        </defs>
        <CartesianGrid stroke={C.grid} />
        <XAxis dataKey="q" tick={{
        fontSize: 9,
        fill: C.tick,
        fontWeight: 700
      }} axisLine={false} tickLine={false} />
        <YAxis tick={{
        fontSize: 9,
        fill: C.tick
      }} axisLine={false} tickLine={false} />
        <Tooltip content={<ChartTooltip />} />
        <Area type="monotone" dataKey="foundation" name="Foundation" stackId="1" stroke={C.p[0]} fill={`url(#stackGrad0)`} strokeWidth={1.5} />
        <Area type="monotone" dataKey="adaptation" name="Adaptation" stackId="1" stroke={C.p[1]} fill={`url(#stackGrad1)`} strokeWidth={1.5} />
        <Area type="monotone" dataKey="containment" name="Containment" stackId="1" stroke={C.p[2]} fill={`url(#stackGrad2)`} strokeWidth={1.5} />
        <Area type="monotone" dataKey="surface" name="Surface" stackId="1" stroke={C.p[3]} fill={`url(#stackGrad3)`} strokeWidth={1.5} />
      </AreaChart>
    </ResponsiveContainer>
  </ChartCard>;
const PieChartPanel = () => <ChartCard title="Sector Share — Pie" tag="C-01" category="Circular" legend={SECTOR_SHARE.map((d, i) => ({
  label: d.name,
  color: C.p[i % C.p.length]
}))}>
    <ResponsiveContainer width="100%" height={220}>
      <PieChart>
        <Pie data={SECTOR_SHARE} cx="50%" cy="50%" outerRadius={80} dataKey="value" paddingAngle={2}>
          {SECTOR_SHARE.map((entry, i) => <Cell key={`pc-${entry.name}`} fill={C.p[i % C.p.length]} />)}
        </Pie>
        <Tooltip content={<ChartTooltip />} />
      </PieChart>
    </ResponsiveContainer>
  </ChartCard>;
const DonutChartPanel = () => <ChartCard title="Sector Share — Donut" tag="C-02" category="Circular" legend={SECTOR_SHARE.map((d, i) => ({
  label: d.name,
  color: C.p[i % C.p.length]
}))}>
    <ResponsiveContainer width="100%" height={220}>
      <PieChart>
        <Pie data={SECTOR_SHARE} cx="50%" cy="50%" innerRadius={50} outerRadius={82} dataKey="value" paddingAngle={3}>
          {SECTOR_SHARE.map((entry, i) => <Cell key={`dc-${entry.name}`} fill={C.p[i % C.p.length]} />)}
        </Pie>
        <Tooltip content={<ChartTooltip />} />
      </PieChart>
    </ResponsiveContainer>
  </ChartCard>;
const RadialBarChartPanel = () => <ChartCard title="System Progress — Radial Bar" tag="C-03" category="Circular" legend={RADIAL_DATA.map(d => ({
  label: d.name,
  color: d.fill
}))}>
    <ResponsiveContainer width="100%" height={220}>
      <RadialBarChart cx="50%" cy="50%" innerRadius={24} outerRadius={96} data={RADIAL_DATA} startAngle={90} endAngle={-270}>
        <RadialBar dataKey="value" cornerRadius={0} background={{
        fill: 'rgba(30,26,23,0.05)'
      }}>
          {RADIAL_DATA.map(entry => <Cell key={`rb-${entry.name}`} fill={entry.fill} />)}
        </RadialBar>
        <Tooltip content={<ChartTooltip />} />
      </RadialBarChart>
    </ResponsiveContainer>
  </ChartCard>;
const RadarChartPanel = () => <ChartCard title="Capability Radar — 6-axis" tag="R-01" category="Relational" legend={[{
  label: 'Okaanda',
  color: C.p[0]
}, {
  label: 'Oshini',
  color: C.p[1]
}]}>
    <ResponsiveContainer width="100%" height={220}>
      <RadarChart data={RADAR_DATA} cx="50%" cy="50%" outerRadius={80}>
        <PolarGrid stroke={C.grid} />
        <PolarAngleAxis dataKey="metric" tick={{
        fontSize: 9,
        fill: C.tick,
        fontWeight: 700
      }} />
        <Radar name="Okaanda" dataKey="okaanda" stroke={C.p[0]} fill={C.p[0]} fillOpacity={0.22} strokeWidth={2} />
        <Radar name="Oshini" dataKey="oshini" stroke={C.p[1]} fill={C.p[1]} fillOpacity={0.18} strokeWidth={2} />
        <Tooltip content={<ChartTooltip />} />
      </RadarChart>
    </ResponsiveContainer>
  </ChartCard>;
const ScatterPlotPanel = () => <ChartCard title="Research Positioning — Scatter" tag="R-02" category="Relational" legend={[{
  label: 'Systems & Pilots',
  color: C.p[0]
}]}>
    <ResponsiveContainer width="100%" height={220}>
      <ScatterChart>
        <CartesianGrid stroke={C.grid} />
        <XAxis type="number" dataKey="x" name="Breadth" tick={{
        fontSize: 9,
        fill: C.tick
      }} axisLine={false} tickLine={false} />
        <YAxis type="number" dataKey="y" name="Depth" tick={{
        fontSize: 9,
        fill: C.tick
      }} axisLine={false} tickLine={false} />
        <Tooltip content={({
        active,
        payload
      }) => {
        if (!active || !payload) return null;
        const d = payload[0]?.payload as typeof SCATTER_DATA[number];
        return <div style={{
          background: C.tooltipBg,
          border: `1px solid ${COLOR.ochreOrange}44`,
          padding: '8px 12px'
        }}>
              <p style={{
            fontSize: 10,
            fontWeight: 700,
            color: COLOR.ochreOrange
          }}>{d?.label}</p>
              <p style={{
            fontSize: 9,
            color: C.tooltipText,
            opacity: 0.6
          }}>x: {d?.x} · y: {d?.y}</p>
            </div>;
      }} />
        <Scatter data={SCATTER_DATA} name="Systems">
          {SCATTER_DATA.map((entry, i) => <Cell key={`sc-${entry.label}`} fill={C.p[i % C.p.length]} />)}
        </Scatter>
      </ScatterChart>
    </ResponsiveContainer>
  </ChartCard>;
const ComposedChartPanel = () => <ChartCard title="Composed — Bar + Line Overlay" tag="C-04" category="Composition" legend={[{
  label: 'Okaanda (bar)',
  color: C.p[0]
}, {
  label: 'Oshini (bar)',
  color: C.p[1]
}, {
  label: 'Ombiga (line)',
  color: C.p[2],
  dash: true
}]} fullWidth>
    <ResponsiveContainer width="100%" height={220}>
      <ComposedChart data={MONTHLY_DATA}>
        <CartesianGrid stroke={C.grid} />
        <XAxis dataKey="month" tick={{
        fontSize: 9,
        fill: C.tick,
        fontWeight: 700
      }} axisLine={false} tickLine={false} />
        <YAxis tick={{
        fontSize: 9,
        fill: C.tick
      }} axisLine={false} tickLine={false} />
        <Tooltip content={<ChartTooltip />} />
        <Bar dataKey="okaanda" name="Okaanda" fill={C.p[0]} barSize={16} />
        <Bar dataKey="oshini" name="Oshini" fill={C.p[1]} barSize={16} />
        <Line type="monotone" dataKey="ombiga" name="Ombiga" stroke={C.p[2]} strokeWidth={2} dot={{
        r: 3,
        fill: C.p[2]
      }} />
      </ComposedChart>
    </ResponsiveContainer>
  </ChartCard>;
const WaterfallChartPanel = () => <ChartCard title="Contribution Waterfall" tag="C-05" category="Composition" legend={[{
  label: 'Base / End',
  color: C.p[3]
}, {
  label: 'Gain',
  color: C.p[0]
}, {
  label: 'Loss',
  color: C.p[5]
}]}>
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={WATERFALL_DATA} barCategoryGap="28%">
        <CartesianGrid vertical={false} stroke={C.grid} />
        <XAxis dataKey="name" tick={{
        fontSize: 8,
        fill: C.tick,
        fontWeight: 700
      }} axisLine={false} tickLine={false} />
        <YAxis tick={{
        fontSize: 9,
        fill: C.tick
      }} axisLine={false} tickLine={false} />
        <ReferenceLine y={0} stroke={C.border} strokeWidth={1} />
        <Tooltip content={<ChartTooltip />} cursor={{
        fill: 'rgba(30,26,23,0.04)'
      }} />
        <Bar dataKey="value" name="Value">
          {WATERFALL_DATA.map(entry => <Cell key={`wf-${entry.name}`} fill={entry.type === 'base' ? C.p[3] : entry.type === 'gain' ? C.p[0] : C.p[5]} />)}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  </ChartCard>;
const FunnelChartPanel = () => <ChartCard title="Pipeline Funnel" tag="C-06" category="Composition" legend={FUNNEL_DATA.map(d => ({
  label: d.name,
  color: d.fill
}))}>
    <ResponsiveContainer width="100%" height={220}>
      <FunnelChart>
        <Funnel dataKey="value" data={FUNNEL_DATA} isAnimationActive>
          <LabelList dataKey="name" position="center" fill={COLOR.milletClay} />
        </Funnel>
        <Tooltip content={<ChartTooltip />} />
      </FunnelChart>
    </ResponsiveContainer>
  </ChartCard>;
type TreemapCellProps = {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  name?: string;
  fill?: string;
};

const renderTreemapCell = (props: TreemapCellProps) => {
  const {
    x = 0,
    y = 0,
    width = 0,
    height = 0,
    name,
    fill
  } = props;
  return <g>
      <rect x={x + 1} y={y + 1} width={width - 2} height={height - 2} fill={fill} fillOpacity={0.88} />
      {width > 44 && height > 22 && <text x={x + width / 2} y={y + height / 2} textAnchor="middle" dominantBaseline="middle" fontSize={9} fontWeight={700} fill={COLOR.milletClay}>
          {name}
        </text>}
    </g>;
};
const TreemapPanel = () => <ChartCard title="Research Budget — Treemap" tag="C-07" category="Composition" legend={TREEMAP_DATA.slice(0, 4).map(d => ({
  label: d.name,
  color: d.fill
}))} fullWidth>
    <ResponsiveContainer width="100%" height={220}>
      <Treemap data={TREEMAP_DATA} dataKey="size" nameKey="name" content={renderTreemapCell as unknown as React.ReactElement} />
    </ResponsiveContainer>
  </ChartCard>;

// ─── Chart registry ───────────────────────────────────────────────────────────
const CHART_PANELS: Array<{
  id: string;
  category: ChartCategory;
  component: React.ReactNode;
}> = [{
  id: 'b01',
  category: 'Bar',
  component: <GroupedBarChartPanel />
}, {
  id: 'b02',
  category: 'Bar',
  component: <StackedBarChartPanel />
}, {
  id: 'b03',
  category: 'Bar',
  component: <HorizontalBarChartPanel />
}, {
  id: 'b04',
  category: 'Bar',
  component: <DeltaBarChartPanel />
}, {
  id: 'l01',
  category: 'Line',
  component: <MultiLineChartPanel />
}, {
  id: 'l02',
  category: 'Line',
  component: <StepLineChartPanel />
}, {
  id: 'l03',
  category: 'Line',
  component: <DualAxisLineChartPanel />
}, {
  id: 'a01',
  category: 'Area',
  component: <SimpleAreaChartPanel />
}, {
  id: 'a02',
  category: 'Area',
  component: <StackedAreaChartPanel />
}, {
  id: 'c01',
  category: 'Circular',
  component: <PieChartPanel />
}, {
  id: 'c02',
  category: 'Circular',
  component: <DonutChartPanel />
}, {
  id: 'c03',
  category: 'Circular',
  component: <RadialBarChartPanel />
}, {
  id: 'r01',
  category: 'Relational',
  component: <RadarChartPanel />
}, {
  id: 'r02',
  category: 'Relational',
  component: <ScatterPlotPanel />
}, {
  id: 'cmp01',
  category: 'Composition',
  component: <ComposedChartPanel />
}, {
  id: 'cmp02',
  category: 'Composition',
  component: <WaterfallChartPanel />
}, {
  id: 'cmp03',
  category: 'Composition',
  component: <FunnelChartPanel />
}, {
  id: 'cmp04',
  category: 'Composition',
  component: <TreemapPanel />
}];

// ─── ChartGallery — main section export ───────────────────────────────────────
export const ChartGallery = () => {
  const [activeCategory, setActiveCategory] = useState<ChartCategory | 'All'>('All');
  const TABS: Array<ChartCategory | 'All'> = ['All', ...CHART_CATEGORIES];
  const visible = activeCategory === 'All' ? CHART_PANELS : CHART_PANELS.filter(p => p.category === activeCategory);
  const borderColor = 'rgba(30,26,23,0.10)';
  const labelColor = 'rgba(30,26,23,0.66)';
  return <section id="chart-gallery" className="max-w-7xl mx-auto px-6 pb-24 md:px-12">
      <SectionHeader label="Chart Gallery" headline="Every chart. One palette." />

      {/* Category filter tabs */}
      <div className="flex flex-wrap gap-2 mb-10" role="tablist" aria-label="Chart categories">
        {TABS.map(cat => {
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
        <span style={{
        fontSize: 10,
        fontWeight: 700,
        letterSpacing: '0.12em',
        textTransform: 'uppercase',
        color: labelColor,
        alignSelf: 'center',
        marginLeft: 8
      }}>
          {visible.length} chart{visible.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Chart grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {visible.map(panel => <React.Fragment key={panel.id}>
            {panel.component}
          </React.Fragment>)}
      </div>

      {/* Footer rule */}
      <div className="mt-10 flex items-center gap-4">
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
          {CHART_PANELS.length} chart types · Recharts · Onganda palette
        </span>
        <div className="flex-1 h-px" style={{
        background: borderColor
      }} />
      </div>
    </section>;
};
