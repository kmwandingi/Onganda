// The "Quiet chrome. The work carries the colour." section of /showcase
// Generated from the live showcase. Event handlers and state are stubbed:
// wire them to your own data. Requires @onganda/design-system/style.css.
import { ICON_SIZE, IconEtiti, IconFile, IconFolder, IconPlay, IconVideo, PixelButton, PixelDropZone, PixelField, PixelMeter, PixelNav, PixelPanel, PixelProgress, PixelSelect, PixelTag, SectionHeader, accentFor, roles, useDark } from '@onganda/design-system';

export function QuietChromeTheWorkCarriesTheColourSection() {
  const { isDark } = useDark();
  const c = roles(isDark);
  return (
    <section id="product-surface" className="max-w-7xl mx-auto px-6 pb-24 md:px-12">
      <SectionHeader
        label="Product Surface"
        headline="Quiet chrome. The work carries the colour."
        accent={accentFor(3)}
      />
      <div
        className="grid lg:grid-cols-[200px_1fr]"
        style={{ border: `1px solid ${c.line}`, background: c.canvas }}
      >
        <div style={{ borderRight: `1px solid ${c.line}`, padding: 16 }}>
          <div className="flex items-center gap-2" style={{ marginBottom: 20 }}>
            <IconEtiti size={ICON_SIZE.control} />
            <span style={{ fontWeight: 600, color: c.text }}>Klippr</span>
          </div>
          <PixelNav
            label="Product"
            items={[{ label: "Studio", icon: IconPlay, active: true, onClick: () => {} }, { label: "Discover", icon: IconVideo, active: false, onClick: () => {} }, { label: "Ideas", icon: IconFile, active: false, onClick: () => {} }, { label: "Library", icon: IconFolder, active: false, onClick: () => {} }]}
          />
        </div>
        <div style={{ padding: 24 }}>
          <div
            className="flex flex-wrap items-end justify-between gap-4"
            style={{ marginBottom: 20 }}
          >
            <div>
              <p
                className="uppercase"
                style={{ margin: 0, fontSize: 12, fontWeight: 700, letterSpacing: "0.16em", color: c.textMuted }}
              >
                Session
              </p>
              <h3 style={{ margin: "4px 0 10px", fontSize: 24, fontWeight: 600, color: c.text }}>
                The exam day journey
              </h3>
              <div className="flex flex-wrap gap-2">
                <PixelTag label="4 assets" />
                <PixelTag label="0:12" />
                <PixelTag label="2.2 MB" />
              </div>
            </div>
            <PixelButton>Render video</PixelButton>
          </div>
          <div className="grid gap-4 lg:grid-cols-[1.5fr_1fr]">
            <div className="grid content-start gap-3">
              <PixelPanel
                spine
                accent={accentFor(0)}
                tag="01"
                eyebrow="0:04–0:14"
                title="Opening hook"
                aside={<PixelMeter value={3} label="Strong" />}
              />
              <PixelPanel
                spine
                accent={accentFor(1)}
                tag="02"
                eyebrow="0:31–0:42"
                title="The reveal"
                aside={<PixelMeter value={2} label="Needs trim" />}
              />
              <PixelPanel
                spine
                accent={accentFor(2)}
                tag="03"
                eyebrow="1:02–1:09"
                title="Closing line"
                aside={<PixelMeter value={1} label="Weak" />}
              />
              <PixelDropZone
                title="Drop more footage"
                hint="mp4 · mov · webm — up to 12 files"
                multiple
                onFiles={() => {}}
              />
            </div>
            <div className="grid content-start gap-4">
              <PixelPanel emphasis="quiet" eyebrow="Export" title="TikTok · 1080×1920">
                <PixelField label="Caption style" htmlFor="ps-caption">
                  <PixelSelect id="ps-caption" defaultValue="burned">
                    <option value="burned">Burned in</option>
                    <option value="none">None</option>
                  </PixelSelect>
                </PixelField>
                <div style={{ marginTop: 16 }}><PixelProgress value={62} label="Render" status="active" /></div>
              </PixelPanel>
              <PixelPanel
                emphasis="quiet"
                eyebrow="Notes"
                note="Two moments are ready to render. The reveal needs a tighter cut before it ships."
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
