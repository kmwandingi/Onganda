// The "Same content. Three pages that do not look alike." section of /showcase
// Generated from the live showcase. Event handlers and state are stubbed:
// wire them to your own data. Requires @onganda/design-system/style.css.
import { ICON_SIZE, IconOkaanda, IconOmbiga, IconOshini, PixelButton, PixelInversePanel, PixelPanel, PixelPeers, PixelSubhead, PixelTag, SectionHeader, accentFor, roles, useDark } from '@onganda/design-system';

export function SameContentThreePagesThatDoNotLookAlikeSection() {
  const { isDark } = useDark();
  const c = roles(isDark);
  return (
    <section id="expressive-range" className="max-w-7xl mx-auto px-6 pb-24 md:px-12">
      <SectionHeader
        label="Expressive range"
        headline="Same content. Three pages that do not look alike."
        accent={accentFor(2)}
      />
      <PixelSubhead spaced>A · Even grid — flat cards, corner marks, the site default</PixelSubhead>
      <PixelPeers>
        <PixelPanel
          icon={<IconOkaanda size={ICON_SIZE.hero} />}
          eyebrow="Okaanda"
          title="Store it"
          note="Corpora, evaluations and models, kept where they are used."
        />
        <PixelPanel
          icon={<IconOshini size={ICON_SIZE.hero} />}
          eyebrow="Oshini"
          title="Adapt it"
          note="Fine-tune and distil open models for local languages."
        />
        <PixelPanel
          icon={<IconOmbiga size={ICON_SIZE.hero} />}
          eyebrow="Ombiga"
          title="Run it"
          note="Agents and containers that hold the work in one place."
        />
      </PixelPeers>
      <div className="mt-12">
        <PixelSubhead spaced>
          B · Bento — one tinted, raised feature with a display illustration; peers lift on hover
        </PixelSubhead>
        <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
          <PixelPanel
            accent={accentFor(0)}
            tone="tint"
            depth="raised"
            eyebrow="The granary"
            title="Store it"
          >
            <div className="flex flex-wrap items-end justify-between gap-6">
              <p style={{ margin: 0, maxWidth: 360, fontSize: 16, lineHeight: 1.6, color: c.textBody }}>
                Corpora, evaluations and models, kept where they are used.
                Everything else in the system starts from what is stored here.
              </p>
              <div aria-hidden="true"><IconOkaanda size={ICON_SIZE.display} /></div>
            </div>
          </PixelPanel>
          <div className="grid content-start gap-4">
            <PixelPanel
              accent={accentFor(1)}
              spine
              depth="lift"
              tag="02"
              eyebrow="Oshini"
              title="Adapt it"
              note="Fine-tune and distil open models for local languages."
            />
            <PixelPanel
              accent={accentFor(2)}
              spine
              depth="lift"
              tag="03"
              eyebrow="Ombiga"
              title="Run it"
              note="Agents and containers that hold the work in one place."
            />
          </div>
        </div>
      </div>
      <div className="mt-12">
        <PixelSubhead spaced>
          C · Statement — an inverse band carries the lead; the items become a numbered sequence
        </PixelSubhead>
        <PixelInversePanel
          tag={<PixelTag hex={accentFor(4)} label="Three steps" isDark />}
          headline="Store. Adapt. Run."
        >
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            <div className="flex gap-4">
              <div aria-hidden="true"><IconOkaanda size={ICON_SIZE.hero} /></div>
              <div>
                <p style={{ margin: 0, fontSize: 18, fontWeight: 600, color: c.textOnInverse }}>
                  01
                  ·
                  Store it
                </p>
                <p style={{ margin: "6px 0 0", fontSize: 14, lineHeight: 1.6, color: c.textMuted }}>
                  Corpora, evaluations and models, kept where they are used.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div aria-hidden="true"><IconOshini size={ICON_SIZE.hero} /></div>
              <div>
                <p style={{ margin: 0, fontSize: 18, fontWeight: 600, color: c.textOnInverse }}>
                  02
                  ·
                  Adapt it
                </p>
                <p style={{ margin: "6px 0 0", fontSize: 14, lineHeight: 1.6, color: c.textMuted }}>
                  Fine-tune and distil open models for local languages.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div aria-hidden="true"><IconOmbiga size={ICON_SIZE.hero} /></div>
              <div>
                <p style={{ margin: 0, fontSize: 18, fontWeight: 600, color: c.textOnInverse }}>
                  03
                  ·
                  Run it
                </p>
                <p style={{ margin: "6px 0 0", fontSize: 14, lineHeight: 1.6, color: c.textMuted }}>
                  Agents and containers that hold the work in one place.
                </p>
              </div>
            </div>
          </div>
          <div className="mt-8">
            <PixelButton variant="accent" isDark lift>See the systems</PixelButton>
          </div>
        </PixelInversePanel>
      </div>
    </section>
  );
}
