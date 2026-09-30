// ─── /test/dashboard — a monitoring dashboard ────────────────────────────────
// The package ships no reusable chart component, only CHART_SERIES and the
// showcase gallery, so this page draws its charts with recharts the way a
// consumer would. Whatever looks off here is the gap.

import {
  Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis
} from 'recharts';
import {
  ChartLegend, chartTheme, PixelButton, PixelDot, PixelNotice, PixelPanel, PixelStatBand, PixelTable,
  roles, SectionHeader, statusFor, TYPE, accentFor,
  type PixelColumn, type StatEntry, type StatusName
} from '@onganda/design-system';
import { TestFrame } from './shell';

const STATS: StatEntry[] = [
  { value: '14', label: 'Field sites', sub: 'across 6 regions', hex: accentFor(0) },
  { value: '92%', label: 'Uptime', sub: 'last 30 days', hex: accentFor(1) },
  { value: '3.1k', label: 'Daily queries', sub: 'up 12% on June', hex: accentFor(2) },
  { value: '2', label: 'Open incidents', sub: 'one critical', hex: accentFor(3) }
];

const WEEKLY = [
  { week: 'W1', health: 420, farming: 310, school: 180 },
  { week: 'W2', health: 460, farming: 290, school: 240 },
  { week: 'W3', health: 510, farming: 350, school: 260 },
  { week: 'W4', health: 580, farming: 400, school: 300 },
  { week: 'W5', health: 620, farming: 380, school: 340 },
  { week: 'W6', health: 700, farming: 450, school: 390 }
];

const LATENCY = [
  { day: 'Mon', p50: 210, p95: 640 }, { day: 'Tue', p50: 190, p95: 580 },
  { day: 'Wed', p50: 230, p95: 720 }, { day: 'Thu', p50: 200, p95: 610 },
  { day: 'Fri', p50: 180, p95: 540 }, { day: 'Sat', p50: 170, p95: 500 }
];

type Site = { region: string; site: string; queries: number; status: StatusName; state: string };
const SITES: Site[] = [
  { region: 'Oshana', site: 'Ongwediva clinic', queries: 812, status: 'active', state: 'Live' },
  { region: 'Kavango East', site: 'Rundu extension office', queries: 455, status: 'caution', state: 'Degraded' },
  { region: 'Khomas', site: 'Windhoek school hub', queries: 390, status: 'settled', state: 'Maintenance done' },
  { region: 'Zambezi', site: 'Katima Mulilo clinic', queries: 0, status: 'critical', state: 'Offline' }
];

export const Dashboard = () => {
  const c = roles(false);
  const t = chartTheme(false);

  const columns: PixelColumn<Site>[] = [
    { key: 'region', header: 'Region', render: r => r.region },
    { key: 'site', header: 'Site', render: r => <span style={{ fontWeight: TYPE.ui.weight }}>{r.site}</span> },
    { key: 'queries', header: 'Queries today', numeric: true, render: r => r.queries.toLocaleString('en') },
    {
      key: 'state', header: 'State', render: r => (
        <span className="inline-flex items-center gap-2">
          <PixelDot color={statusFor(r.status, false)} size={7} ring={c.lineStrong} />
          {r.state}
        </span>
      )
    }
  ];

  return (
    <TestFrame current="/test/dashboard" action={<PixelButton>Export report</PixelButton>}>
      <div className="mx-auto max-w-7xl px-6 py-12 md:px-12">
        <SectionHeader level={1} label="Field operations" headline="Six weeks across fourteen sites." />
        <PixelStatBand stats={STATS} />

        <div className="mt-8 grid gap-4 lg:grid-cols-2">
          <PixelPanel eyebrow="Queries by sector" title="Weekly volume">
            <div style={{ height: 240 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={WEEKLY} barGap={2}>
                  <CartesianGrid {...t.grid} />
                  <XAxis dataKey="week" {...t.axis} />
                  <YAxis {...t.axis} axisLine={false} width={36} />
                  <Tooltip {...t.tooltip} />
                  <Bar dataKey="health" name="Health" fill={t.series[0]} />
                  <Bar dataKey="farming" name="Farming" fill={t.series[1]} />
                  <Bar dataKey="school" name="Schools" fill={t.series[2]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <ChartLegend items={[{ label: 'Health', color: t.series[0] }, { label: 'Farming', color: t.series[1] }, { label: 'Schools', color: t.series[2] }]} />
          </PixelPanel>

          <PixelPanel eyebrow="Latency" title="Response time, ms">
            <div style={{ height: 240 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={LATENCY}>
                  <CartesianGrid {...t.grid} />
                  <XAxis dataKey="day" {...t.axis} />
                  <YAxis {...t.axis} axisLine={false} width={36} />
                  <Tooltip {...t.tooltip} />
                  <Line type="stepAfter" dataKey="p50" name="p50" stroke={t.series[0]} strokeWidth={2} dot={false} />
                  <Line type="stepAfter" dataKey="p95" name="p95" stroke={t.series[3]} strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <ChartLegend items={[{ label: 'p50', color: t.series[0], dash: true }, { label: 'p95', color: t.series[3], dash: true }]} />
          </PixelPanel>
        </div>

        <div className="mt-4 grid gap-4 lg:grid-cols-[1fr_360px]">
          <PixelPanel emphasis="quiet" eyebrow="Sites" title="Today">
            <PixelTable caption="Field sites" columns={columns} rows={SITES} rowKey={r => r.site} />
          </PixelPanel>
          <div className="grid content-start gap-3">
            <PixelNotice status="critical" title="Katima Mulilo clinic is offline">
              No heartbeat since 06:40. The field team has been paged.
            </PixelNotice>
            <PixelNotice status="caution" title="Rundu is degraded">
              p95 latency above 900 ms for two hours.
            </PixelNotice>
          </div>
        </div>
      </div>
    </TestFrame>
  );
};
