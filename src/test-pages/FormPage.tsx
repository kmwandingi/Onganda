// ─── /test/form — a multi-section form ───────────────────────────────────────
// Every control from the package, in every state a real form reaches:
// empty, filled, invalid, disabled, chosen.

import { useState } from 'react';
import {
  PixelActions, PixelButton, PixelCheckbox, PixelChoice, PixelChoiceList, PixelField,
  PixelInput, PixelInversePanel, PixelNotice, PixelPanel, PixelRadio, PixelSelect,
  PixelTag, PixelTextarea, PixelToggle, roles, SectionHeader, TYPE
} from '@onganda/design-system';
import { TestFrame } from './shell';

const TRACKS = ['Health', 'Agriculture', 'Education', 'Public administration'];

export const FormPage = () => {
  const c = roles(false);
  const [track, setTrack] = useState('Health');
  const [size, setSize] = useState('pilot');
  const [updates, setUpdates] = useState(true);
  const [publish, setPublish] = useState(false);

  return (
    <TestFrame current="/test/form">
      <div className="mx-auto max-w-7xl px-6 py-12 md:px-12">
        <SectionHeader level={1} label="Pilot access" headline="Tell us what you want to run." />

        <div className="grid gap-4 lg:grid-cols-[1fr_340px]">
          <form className="grid gap-4" onSubmit={e => e.preventDefault()}>
            <PixelPanel eyebrow="Step 1" title="Your organisation">
              <div className="grid gap-4 md:grid-cols-2">
                <PixelField label="Organisation" htmlFor="org">
                  <PixelInput id="org" defaultValue="Ministry of Health and Social Services" />
                </PixelField>
                <PixelField label="Work email" htmlFor="email" error="Use an address at your organisation's domain.">
                  <PixelInput id="email" invalid defaultValue="pilot@gmail.com" />
                </PixelField>
                <PixelField label="Region" htmlFor="region">
                  <PixelSelect id="region" defaultValue="oshana">
                    <option value="oshana">Oshana</option>
                    <option value="khomas">Khomas</option>
                    <option value="zambezi">Zambezi</option>
                  </PixelSelect>
                </PixelField>
                <PixelField label="Reference" htmlFor="ref" hint="Assigned after intake.">
                  <PixelInput id="ref" disabled placeholder="ONG-0000" />
                </PixelField>
              </div>
            </PixelPanel>

            <PixelPanel eyebrow="Step 2" title="What you want to pilot">
              <PixelChoiceList label="Sector" layout="grid">
                {TRACKS.map(t => (
                  <PixelChoice key={t} name="track" label={t} selected={track === t} onSelect={() => setTrack(t)} />
                ))}
              </PixelChoiceList>
              <fieldset className="grid gap-2" style={{ border: 0, padding: 0, margin: '24px 0 0' }}>
                <legend style={{ fontSize: TYPE.label.size, fontWeight: TYPE.label.weight, letterSpacing: TYPE.label.tracking, textTransform: 'uppercase', color: c.textMuted, marginBottom: 8 }}>
                  Scale
                </legend>
                <PixelRadio name="size" label="A single-site pilot" checked={size === 'pilot'} onChange={() => setSize('pilot')} />
                <PixelRadio name="size" label="A regional rollout" checked={size === 'region'} onChange={() => setSize('region')} />
                <PixelRadio name="size" label="National (by invitation)" disabled />
              </fieldset>
              <PixelField className="mt-6" label="What problem should it solve?" htmlFor="note">
                <PixelTextarea id="note" rows={4} placeholder="Two or three sentences are enough." />
              </PixelField>
            </PixelPanel>

            <PixelPanel emphasis="quiet" eyebrow="Step 3" title="Preferences">
              <div className="grid gap-3">
                <PixelCheckbox label="Send me lab updates" checked={updates} onChange={e => setUpdates(e.target.checked)} />
                <PixelCheckbox label="I have consent to share the sample data" />
                <PixelToggle label="List this pilot on the public site" checked={publish} onChange={setPublish} />
              </div>
              <PixelActions align="between">
                <PixelButton variant="ghost">Save draft</PixelButton>
                <PixelButton>Submit request</PixelButton>
              </PixelActions>
            </PixelPanel>
          </form>

          <div className="grid content-start gap-4">
            <PixelPanel emphasis="quiet" eyebrow="Summary" title={track}>
              <div className="flex flex-wrap gap-2">
                <PixelTag label={size === 'pilot' ? 'Single site' : 'Regional'} />
                <PixelTag label="Oshana" />
              </div>
              <p className="mt-4" style={{ fontSize: TYPE.body.size, lineHeight: TYPE.body.lineHeight, color: c.textBody }}>
                A reviewer reads every request within five working days.
              </p>
            </PixelPanel>
            <PixelNotice status="caution" title="One field needs attention">
              The work email must be at your organisation's domain.
            </PixelNotice>
            <PixelInversePanel headline="Sovereign by default.">
              Pilot data stays in Namibia, on infrastructure the lab operates.
              <div className="mt-6">
                <PixelButton variant="accent" isDark>Read the data terms</PixelButton>
              </div>
            </PixelInversePanel>
          </div>
        </div>
      </div>
    </TestFrame>
  );
};
