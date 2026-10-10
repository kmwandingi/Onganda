// The "Every chart. One palette." section of /showcase
// Generated from the live showcase. Event handlers and state are stubbed:
// wire them to your own data. Requires @onganda/design-system/style.css.
import { ChartPanel, ChartPointTooltip, ChartTooltip, ChartTreemapCell, SectionHeader, accentFor, roles, useDark } from '@onganda/design-system';
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, ComposedChart, Funnel, FunnelChart, LabelList, Line, LineChart, Pie, PieChart, PolarAngleAxis, PolarGrid, Radar, RadarChart, RadialBar, RadialBarChart, ReferenceLine, ResponsiveContainer, Scatter, ScatterChart, Tooltip, Treemap, XAxis, YAxis } from 'recharts';

export function EveryChartOnePaletteSection() {
  const { isDark } = useDark();
  const c = roles(isDark);
  return (
    <section id="chart-gallery" className="max-w-7xl mx-auto px-6 pb-24 md:px-12">
      <SectionHeader
        label="Chart Gallery"
        headline="Every chart. One palette."
        accent={accentFor(2)}
      />
      <div className="flex flex-wrap gap-2 mb-10" role="tablist" aria-label="Chart categories">
        <button
          role="tab"
          aria-selected
          style={{ padding: "5px 14px", fontSize: 10, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", border: `1px solid ${c.actionBg}`, background: c.actionBg, color: c.text, cursor: "pointer", transition: "background 0.18s, border-color 0.18s, color 0.18s" }}
        >
          All
        </button>
        <button
          role="tab"
          aria-selected={false}
          style={{ padding: "5px 14px", fontSize: 10, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", border: `1px solid ${c.line}`, background: c.inverseBorder, color: c.textMuted, cursor: "pointer", transition: "background 0.18s, border-color 0.18s, color 0.18s" }}
        >
          Bar
        </button>
        <button
          role="tab"
          aria-selected={false}
          style={{ padding: "5px 14px", fontSize: 10, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", border: `1px solid ${c.line}`, background: c.inverseBorder, color: c.textMuted, cursor: "pointer", transition: "background 0.18s, border-color 0.18s, color 0.18s" }}
        >
          Line
        </button>
        <button
          role="tab"
          aria-selected={false}
          style={{ padding: "5px 14px", fontSize: 10, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", border: `1px solid ${c.line}`, background: c.inverseBorder, color: c.textMuted, cursor: "pointer", transition: "background 0.18s, border-color 0.18s, color 0.18s" }}
        >
          Area
        </button>
        <button
          role="tab"
          aria-selected={false}
          style={{ padding: "5px 14px", fontSize: 10, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", border: `1px solid ${c.line}`, background: c.inverseBorder, color: c.textMuted, cursor: "pointer", transition: "background 0.18s, border-color 0.18s, color 0.18s" }}
        >
          Circular
        </button>
        <button
          role="tab"
          aria-selected={false}
          style={{ padding: "5px 14px", fontSize: 10, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", border: `1px solid ${c.line}`, background: c.inverseBorder, color: c.textMuted, cursor: "pointer", transition: "background 0.18s, border-color 0.18s, color 0.18s" }}
        >
          Relational
        </button>
        <button
          role="tab"
          aria-selected={false}
          style={{ padding: "5px 14px", fontSize: 10, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", border: `1px solid ${c.line}`, background: c.inverseBorder, color: c.textMuted, cursor: "pointer", transition: "background 0.18s, border-color 0.18s, color 0.18s" }}
        >
          Composition
        </button>
        <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: c.textMuted, alignSelf: "center", marginLeft: 8 }}>
          18
          chart
          s
        </span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ChartPanel
          title="Monthly Activity — Grouped"
          tag="B-01"
          category="Bar"
          legend={[{ label: "Okaanda", color: accentFor(0) }, { label: "Oshini", color: accentFor(1) }, { label: "Ombiga", color: accentFor(2) }]}
        >
          <ResponsiveContainer width="100%" height={220}>
            <BarChart
              data={[{ month: "Jan", okaanda: 42, oshini: 28, ombiga: 19 }, { month: "Feb", okaanda: 55, oshini: 36, ombiga: 27 }, { month: "Mar", okaanda: 48, oshini: 44, ombiga: 34 }, { month: "Apr", okaanda: 63, oshini: 52, ombiga: 41 }, { month: "May", okaanda: 71, oshini: 61, ombiga: 48 }, { month: "Jun", okaanda: 67, oshini: 58, ombiga: 55 }, { month: "Jul", okaanda: 82, oshini: 70, ombiga: 62 }, { month: "Aug", okaanda: 78, oshini: 74, ombiga: 69 }]}
              barGap={2}
              barCategoryGap="28%"
            >
              <CartesianGrid vertical={false} stroke={c.line} />
              <XAxis
                dataKey="month"
                tick={{ fontSize: 9, fill: c.textMuted, fontWeight: 700 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis tick={{ fontSize: 9, fill: c.textMuted }} axisLine={false} tickLine={false} />
              <Tooltip content={<ChartTooltip />} cursor={{ fill: c.fieldDisabledBg }} />
              <Bar dataKey="okaanda" name="Okaanda" fill={accentFor(0)} />
              <Bar dataKey="oshini" name="Oshini" fill={accentFor(1)} />
              <Bar dataKey="ombiga" name="Ombiga" fill={accentFor(2)} />
            </BarChart>
          </ResponsiveContainer>
        </ChartPanel>
        <ChartPanel
          title="Phase Progress — Stacked"
          tag="B-02"
          category="Bar"
          legend={[{ label: "Foundation", color: accentFor(0) }, { label: "Adaptation", color: accentFor(1) }, { label: "Containment", color: accentFor(2) }, { label: "Surface", color: accentFor(3) }]}
        >
          <ResponsiveContainer width="100%" height={220}>
            <BarChart
              data={[{ q: "Q1 2024", foundation: 100, adaptation: 0, containment: 0, surface: 0 }, { q: "Q2 2024", foundation: 100, adaptation: 44, containment: 0, surface: 0 }, { q: "Q3 2024", foundation: 100, adaptation: 78, containment: 18, surface: 0 }, { q: "Q4 2024", foundation: 100, adaptation: 95, containment: 34, surface: 8 }, { q: "Q1 2025", foundation: 100, adaptation: 100, containment: 52, surface: 22 }]}
              barCategoryGap="32%"
            >
              <CartesianGrid vertical={false} stroke={c.line} />
              <XAxis
                dataKey="q"
                tick={{ fontSize: 9, fill: c.textMuted, fontWeight: 700 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis tick={{ fontSize: 9, fill: c.textMuted }} axisLine={false} tickLine={false} />
              <Tooltip content={<ChartTooltip />} cursor={{ fill: c.fieldDisabledBg }} />
              <Bar dataKey="foundation" name="Foundation" stackId="a" fill={accentFor(0)} />
              <Bar dataKey="adaptation" name="Adaptation" stackId="a" fill={accentFor(1)} />
              <Bar dataKey="containment" name="Containment" stackId="a" fill={accentFor(2)} />
              <Bar dataKey="surface" name="Surface" stackId="a" fill={accentFor(3)} />
            </BarChart>
          </ResponsiveContainer>
        </ChartPanel>
        <ChartPanel
          title="System Readiness — Horizontal"
          tag="B-03"
          category="Bar"
          legend={[{ label: "Readiness Score", color: accentFor(0) }]}
        >
          <ResponsiveContainer width="100%" height={220}>
            <BarChart
              data={[{ system: "Okaanda", score: 90 }, { system: "Oshini", score: 78 }, { system: "Ombiga", score: 34 }, { system: "Etiti", score: 12 }, { system: "Oshitoo", score: 4 }]}
              layout="vertical"
              barCategoryGap="30%"
            >
              <CartesianGrid horizontal={false} stroke={c.line} />
              <XAxis
                type="number"
                domain={[0, 100]}
                tick={{ fontSize: 9, fill: c.textMuted }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                dataKey="system"
                type="category"
                tick={{ fontSize: 9, fill: c.textMuted, fontWeight: 700 }}
                axisLine={false}
                tickLine={false}
                width={72}
              />
              <Tooltip content={<ChartTooltip />} cursor={{ fill: c.fieldDisabledBg }} />
              <Bar dataKey="score" name="Readiness Score" fill={accentFor(0)}>
                <Cell fill={accentFor(0)} />
                <Cell fill={accentFor(1)} />
                <Cell fill={accentFor(2)} />
                <Cell fill={accentFor(3)} />
                <Cell fill={accentFor(4)} />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartPanel>
        <ChartPanel
          title="Monthly Delta — Gain / Loss"
          tag="B-04"
          category="Bar"
          legend={[{ label: "Positive delta", color: accentFor(0) }, { label: "Negative delta", color: c.dangerBorder }]}
        >
          <ResponsiveContainer width="100%" height={220}>
            <BarChart
              data={[{ month: "Jan", delta: 12 }, { month: "Feb", delta: -5 }, { month: "Mar", delta: 18 }, { month: "Apr", delta: -3 }, { month: "May", delta: 24 }, { month: "Jun", delta: -8 }, { month: "Jul", delta: 31 }, { month: "Aug", delta: 14 }]}
              barCategoryGap="32%"
            >
              <CartesianGrid vertical={false} stroke={c.line} />
              <XAxis
                dataKey="month"
                tick={{ fontSize: 9, fill: c.textMuted, fontWeight: 700 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis tick={{ fontSize: 9, fill: c.textMuted }} axisLine={false} tickLine={false} />
              <ReferenceLine y={0} stroke={c.line} strokeWidth={1.5} />
              <Tooltip content={<ChartTooltip />} cursor={{ fill: c.fieldDisabledBg }} />
              <Bar dataKey="delta" name="Delta">
                <Cell fill={accentFor(0)} />
                <Cell fill={c.dangerBorder} />
                <Cell fill={accentFor(0)} />
                <Cell fill={c.dangerBorder} />
                <Cell fill={accentFor(0)} />
                <Cell fill={c.dangerBorder} />
                <Cell fill={accentFor(0)} />
                <Cell fill={accentFor(0)} />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartPanel>
        <ChartPanel
          title="Research Activity — Multi-line"
          tag="L-01"
          category="Line"
          legend={[{ label: "Okaanda", color: accentFor(0), dash: true }, { label: "Oshini", color: accentFor(1), dash: true }, { label: "Ombiga", color: accentFor(2), dash: true }]}
        >
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={[{ month: "Jan", okaanda: 42, oshini: 28, ombiga: 19 }, { month: "Feb", okaanda: 55, oshini: 36, ombiga: 27 }, { month: "Mar", okaanda: 48, oshini: 44, ombiga: 34 }, { month: "Apr", okaanda: 63, oshini: 52, ombiga: 41 }, { month: "May", okaanda: 71, oshini: 61, ombiga: 48 }, { month: "Jun", okaanda: 67, oshini: 58, ombiga: 55 }, { month: "Jul", okaanda: 82, oshini: 70, ombiga: 62 }, { month: "Aug", okaanda: 78, oshini: 74, ombiga: 69 }]}>
              <CartesianGrid stroke={c.line} />
              <XAxis
                dataKey="month"
                tick={{ fontSize: 9, fill: c.textMuted, fontWeight: 700 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis tick={{ fontSize: 9, fill: c.textMuted }} axisLine={false} tickLine={false} />
              <Tooltip content={<ChartTooltip />} />
              <Line
                type="monotone"
                dataKey="okaanda"
                name="Okaanda"
                stroke={accentFor(0)}
                strokeWidth={2}
                dot={{ r: 3, fill: accentFor(0) }}
                activeDot={{ r: 4 }}
              />
              <Line
                type="monotone"
                dataKey="oshini"
                name="Oshini"
                stroke={accentFor(1)}
                strokeWidth={2}
                dot={{ r: 3, fill: accentFor(1) }}
                activeDot={{ r: 4 }}
              />
              <Line
                type="monotone"
                dataKey="ombiga"
                name="Ombiga"
                stroke={accentFor(2)}
                strokeWidth={2}
                dot={{ r: 3, fill: accentFor(2) }}
                activeDot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartPanel>
        <ChartPanel
          title="Phase Activations — Step Line"
          tag="L-02"
          category="Line"
          legend={[{ label: "Active phases", color: accentFor(0), dash: true }]}
        >
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={[{ date: "Jan", phases: 1 }, { date: "Feb", phases: 1 }, { date: "Mar", phases: 2 }, { date: "Apr", phases: 2 }, { date: "May", phases: 3 }, { date: "Jun", phases: 3 }, { date: "Jul", phases: 4 }, { date: "Aug", phases: 4 }]}>
              <CartesianGrid stroke={c.line} />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 9, fill: c.textMuted, fontWeight: 700 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 9, fill: c.textMuted }}
                axisLine={false}
                tickLine={false}
                domain={[0, 5]}
                ticks={[0, 1, 2, 3, 4, 5]}
              />
              <Tooltip content={<ChartTooltip />} />
              <Line
                type="stepAfter"
                dataKey="phases"
                name="Active phases"
                stroke={accentFor(0)}
                strokeWidth={2.5}
                dot={{ r: 4, fill: accentFor(0) }}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartPanel>
        <ChartPanel
          title="Dual-Series Trend — Composed"
          tag="L-03"
          category="Line"
          legend={[{ label: "Series A", color: accentFor(0), dash: true }, { label: "Series B", color: accentFor(1), dash: true }]}
          fullWidth
        >
          <ResponsiveContainer width="100%" height={220}>
            <ComposedChart data={[{ t: "Jan", a: 38, b: 55 }, { t: "Feb", a: 44, b: 60 }, { t: "Mar", a: 52, b: 50 }, { t: "Apr", a: 61, b: 58 }, { t: "May", a: 55, b: 72 }, { t: "Jun", a: 70, b: 65 }, { t: "Jul", a: 80, b: 74 }, { t: "Aug", a: 76, b: 88 }]}>
              <CartesianGrid stroke={c.line} />
              <XAxis
                dataKey="t"
                tick={{ fontSize: 9, fill: c.textMuted, fontWeight: 700 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                yAxisId="left"
                tick={{ fontSize: 9, fill: c.textMuted }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                tick={{ fontSize: 9, fill: c.textMuted }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip content={<ChartTooltip />} />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="a"
                name="Series A"
                stroke={accentFor(0)}
                strokeWidth={2}
                dot={{ r: 3, fill: accentFor(0) }}
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="b"
                name="Series B"
                stroke={accentFor(1)}
                strokeWidth={2}
                strokeDasharray="4 3"
                dot={{ r: 3, fill: accentFor(1) }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </ChartPanel>
        <ChartPanel
          title="Cumulative Growth — Area"
          tag="A-01"
          category="Area"
          legend={[{ label: "Okaanda", color: accentFor(0) }, { label: "Oshini", color: accentFor(1) }]}
        >
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={[{ month: "Jan", okaanda: 42, oshini: 28, ombiga: 19 }, { month: "Feb", okaanda: 55, oshini: 36, ombiga: 27 }, { month: "Mar", okaanda: 48, oshini: 44, ombiga: 34 }, { month: "Apr", okaanda: 63, oshini: 52, ombiga: 41 }, { month: "May", okaanda: 71, oshini: 61, ombiga: 48 }, { month: "Jun", okaanda: 67, oshini: 58, ombiga: 55 }, { month: "Jul", okaanda: 82, oshini: 70, ombiga: 62 }, { month: "Aug", okaanda: 78, oshini: 74, ombiga: 69 }]}>
              <defs>
                <linearGradient id="areaGrad0" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={c.actionBg} stopOpacity={0.38} />
                  <stop offset="100%" stopColor={c.actionBg} stopOpacity={0.04} />
                </linearGradient>
                <linearGradient id="areaGrad1" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={c.focusRing} stopOpacity={0.32} />
                  <stop offset="100%" stopColor={c.focusRing} stopOpacity={0.04} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke={c.line} />
              <XAxis
                dataKey="month"
                tick={{ fontSize: 9, fill: c.textMuted, fontWeight: 700 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis tick={{ fontSize: 9, fill: c.textMuted }} axisLine={false} tickLine={false} />
              <Tooltip content={<ChartTooltip />} />
              <Area
                type="monotone"
                dataKey="okaanda"
                name="Okaanda"
                stroke={accentFor(0)}
                strokeWidth={2}
                fill="url(#areaGrad0)"
              />
              <Area
                type="monotone"
                dataKey="oshini"
                name="Oshini"
                stroke={accentFor(1)}
                strokeWidth={2}
                fill="url(#areaGrad1)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartPanel>
        <ChartPanel
          title="Stacked Area — Phase Rollup"
          tag="A-02"
          category="Area"
          legend={[{ label: "Foundation", color: accentFor(0) }, { label: "Adaptation", color: accentFor(1) }, { label: "Containment", color: accentFor(2) }, { label: "Surface", color: accentFor(3) }]}
        >
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={[{ q: "Q1 2024", foundation: 100, adaptation: 0, containment: 0, surface: 0 }, { q: "Q2 2024", foundation: 100, adaptation: 44, containment: 0, surface: 0 }, { q: "Q3 2024", foundation: 100, adaptation: 78, containment: 18, surface: 0 }, { q: "Q4 2024", foundation: 100, adaptation: 95, containment: 34, surface: 8 }, { q: "Q1 2025", foundation: 100, adaptation: 100, containment: 52, surface: 22 }]}>
              <defs>
                <linearGradient id="stackGrad0" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={c.actionBg} stopOpacity={0.65} />
                  <stop offset="100%" stopColor={c.actionBg} stopOpacity={0.22} />
                </linearGradient>
                <linearGradient id="stackGrad1" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={c.focusRing} stopOpacity={0.65} />
                  <stop offset="100%" stopColor={c.focusRing} stopOpacity={0.22} />
                </linearGradient>
                <linearGradient id="stackGrad2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={c.accentBg} stopOpacity={0.65} />
                  <stop offset="100%" stopColor={c.accentBg} stopOpacity={0.22} />
                </linearGradient>
                <linearGradient id="stackGrad3" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={c.actionHoverBg} stopOpacity={0.65} />
                  <stop offset="100%" stopColor={c.actionHoverBg} stopOpacity={0.22} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke={c.line} />
              <XAxis
                dataKey="q"
                tick={{ fontSize: 9, fill: c.textMuted, fontWeight: 700 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis tick={{ fontSize: 9, fill: c.textMuted }} axisLine={false} tickLine={false} />
              <Tooltip content={<ChartTooltip />} />
              <Area
                type="monotone"
                dataKey="foundation"
                name="Foundation"
                stackId="1"
                stroke={accentFor(0)}
                fill="url(#stackGrad0)"
                strokeWidth={1.5}
              />
              <Area
                type="monotone"
                dataKey="adaptation"
                name="Adaptation"
                stackId="1"
                stroke={accentFor(1)}
                fill="url(#stackGrad1)"
                strokeWidth={1.5}
              />
              <Area
                type="monotone"
                dataKey="containment"
                name="Containment"
                stackId="1"
                stroke={accentFor(2)}
                fill="url(#stackGrad2)"
                strokeWidth={1.5}
              />
              <Area
                type="monotone"
                dataKey="surface"
                name="Surface"
                stackId="1"
                stroke={accentFor(3)}
                fill="url(#stackGrad3)"
                strokeWidth={1.5}
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartPanel>
        <ChartPanel
          title="Sector Share — Pie"
          tag="C-01"
          category="Circular"
          legend={[{ label: "Healthcare", color: accentFor(0) }, { label: "Agriculture", color: accentFor(1) }, { label: "Education", color: accentFor(2) }, { label: "Public Sector", color: accentFor(3) }]}
        >
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={[{ name: "Healthcare", value: 34 }, { name: "Agriculture", value: 27 }, { name: "Education", value: 22 }, { name: "Public Sector", value: 17 }]}
                cx="50%"
                cy="50%"
                outerRadius={80}
                dataKey="value"
                paddingAngle={2}
              >
                <Cell fill={accentFor(0)} />
                <Cell fill={accentFor(1)} />
                <Cell fill={accentFor(2)} />
                <Cell fill={accentFor(3)} />
              </Pie>
              <Tooltip content={<ChartTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </ChartPanel>
        <ChartPanel
          title="Sector Share — Donut"
          tag="C-02"
          category="Circular"
          legend={[{ label: "Healthcare", color: accentFor(0) }, { label: "Agriculture", color: accentFor(1) }, { label: "Education", color: accentFor(2) }, { label: "Public Sector", color: accentFor(3) }]}
        >
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={[{ name: "Healthcare", value: 34 }, { name: "Agriculture", value: 27 }, { name: "Education", value: 22 }, { name: "Public Sector", value: 17 }]}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={82}
                dataKey="value"
                paddingAngle={3}
              >
                <Cell fill={accentFor(0)} />
                <Cell fill={accentFor(1)} />
                <Cell fill={accentFor(2)} />
                <Cell fill={accentFor(3)} />
              </Pie>
              <Tooltip content={<ChartTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </ChartPanel>
        <ChartPanel
          title="System Progress — Radial Bar"
          tag="C-03"
          category="Circular"
          legend={[{ label: "Okaanda", color: accentFor(0) }, { label: "Oshini", color: accentFor(1) }, { label: "Ombiga", color: accentFor(2) }, { label: "Etiti", color: accentFor(3) }, { label: "Oshitoo", color: accentFor(4) }]}
        >
          <ResponsiveContainer width="100%" height={220}>
            <RadialBarChart
              cx="50%"
              cy="50%"
              innerRadius={24}
              outerRadius={96}
              data={[{ name: "Okaanda", value: 90, fill: accentFor(0) }, { name: "Oshini", value: 78, fill: accentFor(1) }, { name: "Ombiga", value: 34, fill: accentFor(2) }, { name: "Etiti", value: 12, fill: accentFor(3) }, { name: "Oshitoo", value: 4, fill: accentFor(4) }]}
              startAngle={90}
              endAngle={-270}
            >
              <RadialBar dataKey="value" cornerRadius={0} background={{ fill: c.line }}>
                <Cell fill={accentFor(0)} />
                <Cell fill={accentFor(1)} />
                <Cell fill={accentFor(2)} />
                <Cell fill={accentFor(3)} />
                <Cell fill={accentFor(4)} />
              </RadialBar>
              <Tooltip content={<ChartTooltip />} />
            </RadialBarChart>
          </ResponsiveContainer>
        </ChartPanel>
        <ChartPanel
          title="Capability Radar — 6-axis"
          tag="R-01"
          category="Relational"
          legend={[{ label: "Okaanda", color: accentFor(0) }, { label: "Oshini", color: accentFor(1) }]}
        >
          <ResponsiveContainer width="100%" height={220}>
            <RadarChart
              data={[{ metric: "Data", okaanda: 90, oshini: 60 }, { metric: "Models", okaanda: 72, oshini: 88 }, { metric: "Agents", okaanda: 45, oshini: 55 }, { metric: "Interfaces", okaanda: 58, oshini: 70 }, { metric: "Delivery", okaanda: 38, oshini: 65 }, { metric: "Security", okaanda: 80, oshini: 74 }]}
              cx="50%"
              cy="50%"
              outerRadius={80}
            >
              <PolarGrid stroke={c.line} />
              <PolarAngleAxis
                dataKey="metric"
                tick={{ fontSize: 9, fill: c.textMuted, fontWeight: 700 }}
              />
              <Radar
                name="Okaanda"
                dataKey="okaanda"
                stroke={accentFor(0)}
                fill={accentFor(0)}
                fillOpacity={0.22}
                strokeWidth={2}
              />
              <Radar
                name="Oshini"
                dataKey="oshini"
                stroke={accentFor(1)}
                fill={accentFor(1)}
                fillOpacity={0.18}
                strokeWidth={2}
              />
              <Tooltip content={<ChartTooltip />} />
            </RadarChart>
          </ResponsiveContainer>
        </ChartPanel>
        <ChartPanel
          title="Research Positioning — Scatter"
          tag="R-02"
          category="Relational"
          legend={[{ label: "Systems & Pilots", color: accentFor(0) }]}
        >
          <ResponsiveContainer width="100%" height={220}>
            <ScatterChart>
              <CartesianGrid stroke={c.line} />
              <XAxis
                type="number"
                dataKey="x"
                name="Breadth"
                tick={{ fontSize: 9, fill: c.textMuted }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                type="number"
                dataKey="y"
                name="Depth"
                tick={{ fontSize: 9, fill: c.textMuted }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip content={<ChartPointTooltip />} />
              <Scatter
                data={[{ x: 12, y: 38, label: "Okaanda" }, { x: 28, y: 55, label: "Oshini" }, { x: 44, y: 42, label: "Ombiga" }, { x: 56, y: 71, label: "Etiti" }, { x: 67, y: 63, label: "Oshitoo" }, { x: 35, y: 80, label: "Cross" }, { x: 72, y: 50, label: "Pilot A" }, { x: 20, y: 66, label: "Pilot B" }]}
                name="Systems"
              >
                <Cell fill={accentFor(0)} />
                <Cell fill={accentFor(1)} />
                <Cell fill={accentFor(2)} />
                <Cell fill={accentFor(3)} />
                <Cell fill={accentFor(4)} />
                <Cell fill={c.dangerBorder} />
                <Cell fill={accentFor(0)} />
                <Cell fill={accentFor(1)} />
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
        </ChartPanel>
        <ChartPanel
          title="Composed — Bar + Line Overlay"
          tag="C-04"
          category="Composition"
          legend={[{ label: "Okaanda (bar)", color: accentFor(0) }, { label: "Oshini (bar)", color: accentFor(1) }, { label: "Ombiga (line)", color: accentFor(2), dash: true }]}
          fullWidth
        >
          <ResponsiveContainer width="100%" height={220}>
            <ComposedChart data={[{ month: "Jan", okaanda: 42, oshini: 28, ombiga: 19 }, { month: "Feb", okaanda: 55, oshini: 36, ombiga: 27 }, { month: "Mar", okaanda: 48, oshini: 44, ombiga: 34 }, { month: "Apr", okaanda: 63, oshini: 52, ombiga: 41 }, { month: "May", okaanda: 71, oshini: 61, ombiga: 48 }, { month: "Jun", okaanda: 67, oshini: 58, ombiga: 55 }, { month: "Jul", okaanda: 82, oshini: 70, ombiga: 62 }, { month: "Aug", okaanda: 78, oshini: 74, ombiga: 69 }]}>
              <CartesianGrid stroke={c.line} />
              <XAxis
                dataKey="month"
                tick={{ fontSize: 9, fill: c.textMuted, fontWeight: 700 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis tick={{ fontSize: 9, fill: c.textMuted }} axisLine={false} tickLine={false} />
              <Tooltip content={<ChartTooltip />} />
              <Bar dataKey="okaanda" name="Okaanda" fill={accentFor(0)} barSize={16} />
              <Bar dataKey="oshini" name="Oshini" fill={accentFor(1)} barSize={16} />
              <Line
                type="monotone"
                dataKey="ombiga"
                name="Ombiga"
                stroke={accentFor(2)}
                strokeWidth={2}
                dot={{ r: 3, fill: accentFor(2) }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </ChartPanel>
        <ChartPanel
          title="Contribution Waterfall"
          tag="C-05"
          category="Composition"
          legend={[{ label: "Base / End", color: accentFor(3) }, { label: "Gain", color: accentFor(0) }, { label: "Loss", color: c.dangerBorder }]}
        >
          <ResponsiveContainer width="100%" height={220}>
            <BarChart
              data={[{ name: "Q1 Base", value: 240, type: "base" }, { name: "Corpus +", value: 85, type: "gain" }, { name: "Eval +", value: 62, type: "gain" }, { name: "Infra –", value: -38, type: "loss" }, { name: "SDK +", value: 44, type: "gain" }, { name: "Ops –", value: -22, type: "loss" }, { name: "Q2 End", value: 471, type: "base" }]}
              barCategoryGap="28%"
            >
              <CartesianGrid vertical={false} stroke={c.line} />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 9, fill: c.textMuted, fontWeight: 700 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis tick={{ fontSize: 9, fill: c.textMuted }} axisLine={false} tickLine={false} />
              <ReferenceLine y={0} stroke={c.line} strokeWidth={1} />
              <Tooltip content={<ChartTooltip />} cursor={{ fill: c.fieldDisabledBg }} />
              <Bar dataKey="value" name="Value">
                <Cell fill={accentFor(3)} />
                <Cell fill={accentFor(0)} />
                <Cell fill={accentFor(0)} />
                <Cell fill={c.dangerBorder} />
                <Cell fill={accentFor(0)} />
                <Cell fill={c.dangerBorder} />
                <Cell fill={accentFor(3)} />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartPanel>
        <ChartPanel
          title="Pipeline Funnel"
          tag="C-06"
          category="Composition"
          legend={[{ label: "Research", color: accentFor(0) }, { label: "Prototyping", color: accentFor(1) }, { label: "Pilot", color: accentFor(2) }, { label: "Deployment", color: accentFor(3) }, { label: "Scale", color: accentFor(4) }]}
        >
          <ResponsiveContainer width="100%" height={220}>
            <FunnelChart>
              <Funnel
                dataKey="value"
                data={[{ name: "Research", value: 1000, fill: accentFor(0) }, { name: "Prototyping", value: 740, fill: accentFor(1) }, { name: "Pilot", value: 440, fill: accentFor(2) }, { name: "Deployment", value: 220, fill: accentFor(3) }, { name: "Scale", value: 80, fill: accentFor(4) }]}
                isAnimationActive
              >
                <LabelList dataKey="name" position="center" fill={c.canvas} />
              </Funnel>
              <Tooltip content={<ChartTooltip />} />
            </FunnelChart>
          </ResponsiveContainer>
        </ChartPanel>
        <ChartPanel
          title="Research Budget — Treemap"
          tag="C-07"
          category="Composition"
          legend={[{ label: "NLP", color: accentFor(0) }, { label: "Vision", color: accentFor(1) }, { label: "Speech", color: accentFor(2) }, { label: "Search", color: accentFor(3) }]}
          fullWidth
        >
          <ResponsiveContainer width="100%" height={220}>
            <Treemap
              data={[{ name: "NLP", size: 420, fill: accentFor(0) }, { name: "Vision", size: 290, fill: accentFor(1) }, { name: "Speech", size: 210, fill: accentFor(2) }, { name: "Search", size: 185, fill: accentFor(3) }, { name: "Agents", size: 160, fill: accentFor(0) }, { name: "Safety", size: 120, fill: accentFor(4) }, { name: "Infra", size: 95, fill: accentFor(1) }, { name: "Eval", size: 70, fill: c.dangerBorder }]}
              dataKey="size"
              nameKey="name"
              content={<ChartTreemapCell />}
            />
          </ResponsiveContainer>
        </ChartPanel>
      </div>
      <div className="mt-10 flex items-center gap-4">
        <div className="flex-1 h-px" style={{ background: c.line }} />
        <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", color: c.textMuted, whiteSpace: "normal", textAlign: "center" }}>
          18
          chart types · Recharts ·
          Onganda
          palette
        </span>
        <div className="flex-1 h-px" style={{ background: c.line }} />
      </div>
    </section>
  );
}
