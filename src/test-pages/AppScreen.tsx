// ─── /test/app — a product screen ────────────────────────────────────────────
// A dataset registry: the register a tool uses. Quiet chrome, one feature
// surface, neutral metadata, status carried by a mark AND a label.

import { useState } from 'react';
import {
  IconDatabase, IconFolder, IconLayers, IconSearch, IconSettings, IconUpload,
  PixelButton, PixelNav, PixelDialog, PixelDot, PixelEmptyState, PixelField, PixelInput,
  PixelNotice, PixelPanel, PixelProgress, PixelSelect, PixelSkeleton, PixelTable,
  PixelTabs, PixelTag, PixelToggle, roles, statusFor, systemIconForName, TYPE,
  type PixelColumn, type StatusName, useDark } from '@onganda/design-system';
import { TestFrame } from './shell';

type Dataset = { name: string; language: string; records: number; size: string; status: StatusName; state: string };

const DATASETS: Dataset[] = [
  { name: 'oshiwambo-news-v3', language: 'Oshindonga', records: 128400, size: '2.1 GB', status: 'active', state: 'Indexing' },
  { name: 'otjiherero-radio', language: 'Otjiherero', records: 42210, size: '860 MB', status: 'caution', state: 'Needs review' },
  { name: 'khoekhoe-parliament', language: 'Khoekhoegowab', records: 18930, size: '310 MB', status: 'settled', state: 'Ready' },
  { name: 'rukwangali-health', language: 'Rukwangali', records: 7604, size: '120 MB', status: 'critical', state: 'Failed checks' }
];

const NAV = [
  { label: 'Datasets', icon: IconDatabase },
  { label: 'Collections', icon: IconFolder },
  { label: 'Pipelines', icon: IconLayers },
  { label: 'Settings', icon: IconSettings }
];

export const AppScreen = () => {
  const { isDark } = useDark();
  const c = roles(isDark);
  const [tab, setTab] = useState<'all' | 'review' | 'archived'>('all');
  const [confirm, setConfirm] = useState(false);
  const [dedupe, setDedupe] = useState(true);

  const columns: PixelColumn<Dataset>[] = [
    { key: 'name', header: 'Dataset', render: r => <span style={{ fontWeight: TYPE.ui.weight }}>{r.name}</span> },
    { key: 'language', header: 'Language', render: r => r.language },
    { key: 'records', header: 'Records', numeric: true, render: r => r.records.toLocaleString('en') },
    { key: 'size', header: 'Size', numeric: true, render: r => r.size },
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
    <TestFrame current="/test/app" action={<PixelButton>Ingest a corpus <IconUpload size={12} /></PixelButton>}>
      <div className="mx-auto grid max-w-7xl gap-0 px-6 py-10 md:grid-cols-[220px_1fr] md:px-12">
        <aside className="hidden md:block" style={{ borderRight: `1px solid ${c.line}`, paddingRight: 24 }}>
          <div className="mb-6 flex items-center gap-3">
            {systemIconForName('Okaanda', 24)}
            <span style={{ fontSize: TYPE.title.size, fontWeight: TYPE.title.weight }}>Okaanda</span>
          </div>
          <PixelNav label="Registry" items={NAV.map((n, i) => ({ label: n.label, icon: n.icon, href: '#', active: i === 0 }))} />
        </aside>

        <section className="min-w-0 md:pl-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p style={{ fontSize: TYPE.eyebrow.size, fontWeight: TYPE.eyebrow.weight, letterSpacing: TYPE.eyebrow.tracking, textTransform: 'uppercase', color: c.textMuted }}>Registry</p>
              <h1 style={{ fontSize: TYPE.headline.size, fontWeight: TYPE.headline.weight, margin: '6px 0 10px' }}>Language corpora</h1>
              <div className="flex flex-wrap gap-2">
                <PixelTag label="4 datasets" />
                <PixelTag label="197,144 records" />
                <PixelTag label="3.4 GB" />
              </div>
            </div>
            <div className="flex w-full items-center gap-2 sm:w-72">
              <IconSearch size={12} color={c.textMuted} />
              <PixelInput aria-label="Search datasets" placeholder="Search datasets" />
            </div>
          </div>

          <PixelTabs
            className="mt-6"
            label="Dataset state"
            value={tab}
            onChange={setTab}
            tabs={[{ value: 'all', label: 'All' }, { value: 'review', label: 'Needs review' }, { value: 'archived', label: 'Archived' }]}
          />

          <div className="mt-6 grid gap-4 lg:grid-cols-[1fr_320px]">
            <PixelPanel eyebrow="Datasets" title={tab === 'all' ? 'Four corpora' : tab === 'review' ? 'Waiting on review' : 'Archived'}>
              {tab === 'all' && <PixelTable caption="Language corpora" columns={columns} rows={DATASETS} rowKey={r => r.name} />}
              {tab === 'review' && <PixelSkeleton lines={4} />}
              {tab === 'archived' && (
                <PixelEmptyState
                  icon={systemIconForName('Okaanda', 48)}
                  title="Nothing archived"
                  body="Archived corpora keep their records but leave the active index."
                />
              )}
            </PixelPanel>

            <div className="grid content-start gap-4">
              <PixelPanel emphasis="quiet" eyebrow="Selected" title="oshiwambo-news-v3">
                <PixelProgress label="Indexing" value={64} />
                <div className="mt-5 grid gap-4">
                  <PixelField label="Tokenizer" htmlFor="tok">
                    <PixelSelect id="tok" defaultValue="bpe">
                      <option value="bpe">Byte-pair, 32k</option>
                      <option value="uni">Unigram, 16k</option>
                    </PixelSelect>
                  </PixelField>
                  <PixelToggle label="Drop near-duplicates" checked={dedupe} onChange={setDedupe} />
                </div>
                <div className="mt-5 flex flex-wrap gap-2">
                  <PixelButton variant="ghost">Pause</PixelButton>
                  <PixelButton variant="danger" onClick={() => setConfirm(true)}>Delete</PixelButton>
                </div>
              </PixelPanel>
              <PixelNotice status="critical" title="rukwangali-health failed checks">
                214 records have no speaker consent flag.
              </PixelNotice>
            </div>
          </div>
        </section>
      </div>

      <PixelDialog
        open={confirm}
        onClose={() => setConfirm(false)}
        eyebrow="Delete dataset"
        title="Delete oshiwambo-news-v3?"
        footer={<>
          <PixelButton variant="ghost" onClick={() => setConfirm(false)}>Cancel</PixelButton>
          <PixelButton variant="danger" onClick={() => setConfirm(false)}>Delete dataset</PixelButton>
        </>}
      >
        This removes 128,400 records and their evaluation history.
      </PixelDialog>
    </TestFrame>
  );
};
