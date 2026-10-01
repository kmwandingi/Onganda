// ─── /test/studio — a media tool's intake screen ─────────────────────────────
// The same jobs as a clip studio's "Create" screen — upload, link, transcript,
// a steer — built only from the package. It is the answer to "why does our
// version look amateur": one primary action in the header, the three inputs
// as peers with their own accent, icon tile and ordinal, pixel icons on the
// grid, the field and its action as one control, sentence-case labels, and
// motion that comes from the primitives.

import { useState } from 'react';
import {
  accentFor, ICON_SIZE, IconFile, IconLink, IconPlay, IconSettings, IconUpload, IconVideo,
  PixelButton, PixelNav, PixelDot, PixelDropZone, PixelField, PixelInput, PixelInputGroup, PixelPanel,
  PixelTextarea, roles, SectionHeader, systemIconForName, TYPE, useDark } from '@onganda/design-system';
import { TestFrame } from './shell';

const NAV = [
  { label: 'Create', icon: IconPlay },
  { label: 'Discover', icon: IconVideo },
  { label: 'Ideas', icon: IconFile },
  { label: 'Library', icon: IconSettings }
];

export const Studio = () => {
  const { isDark } = useDark();
  const c = roles(isDark);
  const [files, setFiles] = useState<File[]>([]);

  return (
    <TestFrame current="/test/studio">
      <div className="mx-auto grid max-w-7xl md:grid-cols-[208px_1fr]">
        <aside className="hidden md:block" style={{ borderRight: `1px solid ${c.line}`, padding: '40px 24px 40px 24px' }}>
          <div className="mb-8 flex items-center gap-3">
            {systemIconForName('Etiti', ICON_SIZE.control)}
            <span style={{ fontSize: TYPE.title.size, fontWeight: TYPE.title.weight }}>Klippr</span>
          </div>
          <PixelNav label="Studio" items={NAV.map((n, i) => ({ label: n.label, icon: n.icon, href: '#', active: i === 0 }))} />
        </aside>

        <section className="min-w-0 px-6 py-10 md:px-10">
          <SectionHeader
            level={1}
            label="Create"
            headline="Drop media. Get the moments."
            accent={accentFor(0)}
            actions={<PixelButton disabled={!files.length}>Find the moments <IconPlay size={ICON_SIZE.inline} /></PixelButton>}
          />

          <p style={{ fontSize: TYPE.bodyLarge.size, lineHeight: TYPE.bodyLarge.lineHeight, color: c.textBody, maxWidth: 640, margin: '0 0 32px' }}>
            Give the studio a file, a link or a transcript. It transcribes, proposes the moments worth cutting,
            and hands you a timeline.
          </p>

          <div className="grid items-start gap-4 lg:grid-cols-[1.25fr_1fr]">
            {/* Two columns of similar height: the upload and the steer on the
                left, the link and transcript on the right. A short card next
                to a tall stack leaves a hole. */}
            <div className="grid content-start gap-4">
              <PixelPanel accent={accentFor(0)} tag="01" eyebrow="Upload" title="A video or audio file">
                <PixelDropZone
                  title={files.length ? `${files.length} file ready` : 'Drop a file here'}
                  hint="mp4 · mov · webm · mp3 · wav — up to 200 MB"
                  accept="video/*,audio/*"
                  onFiles={setFiles}
                >
                  <PixelButton variant="ghost">Try an example</PixelButton>
                </PixelDropZone>
              </PixelPanel>
            <PixelPanel emphasis="quiet" eyebrow="Direction" title="Steer the search (optional)">
              <div className="grid gap-4 md:grid-cols-[1fr_auto] md:items-end">
                <PixelField label="What to look for" htmlFor="st-dir">
                  <PixelInput id="st-dir" placeholder="the awkward reactions" />
                </PixelField>
                <span className="inline-flex items-center gap-2" style={{ fontSize: TYPE.meta.size, color: c.textMuted, paddingBottom: 12 }}>
                  <PixelDot color={accentFor(0)} size={7} live /> Transcriber ready
                </span>
              </div>
            </PixelPanel>
            </div>

            <div className="grid content-start gap-4">
              <PixelPanel accent={accentFor(1)} tag="02" icon={<IconLink size={ICON_SIZE.feature} color={accentFor(1)} />}
                eyebrow="Link" title="YouTube, TikTok or a file URL">
                <PixelField label="URL" htmlFor="st-link" hint="A public video, or a URL ending in .mp4 or .mp3.">
                  <PixelInputGroup>
                    <PixelInput id="st-link" placeholder="https://youtube.com/watch?v=…" />
                    <PixelButton variant="ghost">Open <IconUpload size={ICON_SIZE.inline} /></PixelButton>
                  </PixelInputGroup>
                </PixelField>
              </PixelPanel>

              <PixelPanel accent={accentFor(2)} tag="03" icon={<IconFile size={ICON_SIZE.feature} color={accentFor(2)} />}
                eyebrow="Transcript" title="Paste the words">
                <PixelField label="Text, with timestamps" htmlFor="st-tx" hint="One line per beat. Moments are found in the words.">
                  <PixelTextarea id="st-tx" rows={3} placeholder={'00:00 opening line…\n00:12 the good part…'} />
                </PixelField>
              </PixelPanel>
            </div>
          </div>

        </section>
      </div>
    </TestFrame>
  );
};
