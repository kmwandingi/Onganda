// The "One recipe per control. No free choices." section of /showcase
// Generated from the live showcase. Event handlers and state are stubbed:
// wire them to your own data. Requires @onganda/design-system/style.css.
import { DensityProvider, PixelButton, PixelCheckbox, PixelDot, PixelField, PixelIconButton, PixelInput, PixelPanel, PixelRadio, PixelSelect, PixelSubhead, PixelTextarea, PixelToggle, SectionHeader, WeaveOverlay, accentFor, roles, useDark } from '@onganda/design-system';

export function OneRecipePerControlNoFreeChoicesSection() {
  const { isDark } = useDark();
  const c = roles(isDark);
  return (
    <section id="controls" className="max-w-7xl mx-auto px-6 pb-24 md:px-12">
      <SectionHeader
        label="Control Standards"
        headline="One recipe per control. No free choices."
        accent={accentFor(1)}
      />
      <div
        id="controls-stage"
        className="relative p-6 md:p-8"
        style={{ background: c.canvas, border: `1px solid ${c.line}` }}
      >
        <div className="mb-6 flex items-center justify-between gap-4">
          <p className="text-xs leading-relaxed" style={{ color: c.textMuted }}>
            Every value below is measured.
            <code>npm run check:contrast</code>
            fails the build on a regression.
          </p>
          <PixelToggle
            checked={false}
            onChange={() => {}}
            label={<span className="text-[10px] font-bold uppercase tracking-[0.16em]">Light</span>}
          />
        </div>
        <div className="grid gap-4 lg:grid-cols-2">
          <PixelPanel eyebrow="Colour roles · read the role, not the palette" accent={accentFor(0)}>
            <dl className="grid gap-0">
              <div
                className="flex items-center gap-4 py-2.5 border-b"
                style={{ borderColor: c.line }}
              >
                <span
                  aria-hidden="true"
                  className="h-5 w-5 shrink-0"
                  style={{ background: c.canvas, border: `1px solid ${c.lineStrong}` }}
                />
                <dt className="w-28 shrink-0 font-mono text-xs sm:w-40" style={{ color: c.text }}>canvas</dt>
                <dd className="text-xs leading-relaxed" style={{ color: c.textMuted }}>Page background</dd>
              </div>
              <div
                className="flex items-center gap-4 py-2.5 border-b"
                style={{ borderColor: c.line }}
              >
                <span
                  aria-hidden="true"
                  className="h-5 w-5 shrink-0"
                  style={{ background: c.surface, border: `1px solid ${c.lineStrong}` }}
                />
                <dt className="w-28 shrink-0 font-mono text-xs sm:w-40" style={{ color: c.text }}>surface</dt>
                <dd className="text-xs leading-relaxed" style={{ color: c.textMuted }}>
                  Cards, panels, bands
                </dd>
              </div>
              <div
                className="flex items-center gap-4 py-2.5 border-b"
                style={{ borderColor: c.line }}
              >
                <span
                  aria-hidden="true"
                  className="h-5 w-5 shrink-0"
                  style={{ background: c.canvas, border: `1px solid ${c.lineStrong}` }}
                />
                <dt className="w-28 shrink-0 font-mono text-xs sm:w-40" style={{ color: c.text }}>
                  surfaceWell
                </dt>
                <dd className="text-xs leading-relaxed" style={{ color: c.textMuted }}>
                  Wells and code blocks — recedes, never raised
                </dd>
              </div>
              <div
                className="flex items-center gap-4 py-2.5 border-b"
                style={{ borderColor: c.line }}
              >
                <span
                  aria-hidden="true"
                  className="h-5 w-5 shrink-0"
                  style={{ background: c.inverse, border: `1px solid ${c.lineStrong}` }}
                />
                <dt className="w-28 shrink-0 font-mono text-xs sm:w-40" style={{ color: c.text }}>inverse</dt>
                <dd className="text-xs leading-relaxed" style={{ color: c.textMuted }}>
                  Footer, ticker, lab card
                </dd>
              </div>
              <div
                className="flex items-center gap-4 py-2.5 border-b"
                style={{ borderColor: c.line }}
              >
                <span
                  aria-hidden="true"
                  className="h-5 w-5 shrink-0"
                  style={{ background: c.inverse, border: `1px solid ${c.lineStrong}` }}
                />
                <dt className="w-28 shrink-0 font-mono text-xs sm:w-40" style={{ color: c.text }}>text</dt>
                <dd className="text-xs leading-relaxed" style={{ color: c.textMuted }}>
                  Headings and primary text
                </dd>
              </div>
              <div
                className="flex items-center gap-4 py-2.5 border-b"
                style={{ borderColor: c.line }}
              >
                <span
                  aria-hidden="true"
                  className="h-5 w-5 shrink-0"
                  style={{ background: c.textBody, border: `1px solid ${c.lineStrong}` }}
                />
                <dt className="w-28 shrink-0 font-mono text-xs sm:w-40" style={{ color: c.text }}>textBody</dt>
                <dd className="text-xs leading-relaxed" style={{ color: c.textMuted }}>
                  Long-form reading text
                </dd>
              </div>
              <div
                className="flex items-center gap-4 py-2.5 border-b"
                style={{ borderColor: c.line }}
              >
                <span
                  aria-hidden="true"
                  className="h-5 w-5 shrink-0"
                  style={{ background: c.textMuted, border: `1px solid ${c.lineStrong}` }}
                />
                <dt className="w-28 shrink-0 font-mono text-xs sm:w-40" style={{ color: c.text }}>
                  textMuted
                </dt>
                <dd className="text-xs leading-relaxed" style={{ color: c.textMuted }}>
                  Labels, captions, meta
                </dd>
              </div>
              <div
                className="flex items-center gap-4 py-2.5 border-b"
                style={{ borderColor: c.line }}
              >
                <span
                  aria-hidden="true"
                  className="h-5 w-5 shrink-0"
                  style={{ background: c.textFaint, border: `1px solid ${c.lineStrong}` }}
                />
                <dt className="w-28 shrink-0 font-mono text-xs sm:w-40" style={{ color: c.text }}>
                  textFaint
                </dt>
                <dd className="text-xs leading-relaxed" style={{ color: c.textMuted }}>
                  Disabled text and ordinals only
                </dd>
              </div>
              <div
                className="flex items-center gap-4 py-2.5 border-b"
                style={{ borderColor: c.line }}
              >
                <span
                  aria-hidden="true"
                  className="h-5 w-5 shrink-0"
                  style={{ background: c.line, border: `1px solid ${c.lineStrong}` }}
                />
                <dt className="w-28 shrink-0 font-mono text-xs sm:w-40" style={{ color: c.text }}>line</dt>
                <dd className="text-xs leading-relaxed" style={{ color: c.textMuted }}>
                  Hairline borders and dividers
                </dd>
              </div>
              <div
                className="flex items-center gap-4 py-2.5 border-b"
                style={{ borderColor: c.line }}
              >
                <span
                  aria-hidden="true"
                  className="h-5 w-5 shrink-0"
                  style={{ background: c.actionBg, border: `1px solid ${c.lineStrong}` }}
                />
                <dt className="w-28 shrink-0 font-mono text-xs sm:w-40" style={{ color: c.text }}>actionBg</dt>
                <dd className="text-xs leading-relaxed" style={{ color: c.textMuted }}>
                  Primary action fill — ochre, never black
                </dd>
              </div>
              <div
                className="flex items-center gap-4 py-2.5 border-b"
                style={{ borderColor: c.line }}
              >
                <span
                  aria-hidden="true"
                  className="h-5 w-5 shrink-0"
                  style={{ background: c.accentBg, border: `1px solid ${c.lineStrong}` }}
                />
                <dt className="w-28 shrink-0 font-mono text-xs sm:w-40" style={{ color: c.text }}>accentBg</dt>
                <dd className="text-xs leading-relaxed" style={{ color: c.textMuted }}>
                  In-card accent fill — mahangu gold
                </dd>
              </div>
              <div
                className="flex items-center gap-4 py-2.5 border-b"
                style={{ borderColor: c.line }}
              >
                <span
                  aria-hidden="true"
                  className="h-5 w-5 shrink-0"
                  style={{ background: c.dangerBg, border: `1px solid ${c.lineStrong}` }}
                />
                <dt className="w-28 shrink-0 font-mono text-xs sm:w-40" style={{ color: c.text }}>
                  accentInk
                </dt>
                <dd className="text-xs leading-relaxed" style={{ color: c.textMuted }}>
                  The accent as ink: link, focus ring, ghost hover
                </dd>
              </div>
              <div
                className="flex items-center gap-4 py-2.5 border-b"
                style={{ borderColor: c.line }}
              >
                <span
                  aria-hidden="true"
                  className="h-5 w-5 shrink-0"
                  style={{ background: c.dangerBg, border: `1px solid ${c.lineStrong}` }}
                />
                <dt className="w-28 shrink-0 font-mono text-xs sm:w-40" style={{ color: c.text }}>dangerBg</dt>
                <dd className="text-xs leading-relaxed" style={{ color: c.textMuted }}>
                  Destructive action fill
                </dd>
              </div>
              <div
                className="flex items-center gap-4 py-2.5 border-b"
                style={{ borderColor: c.line }}
              >
                <span
                  aria-hidden="true"
                  className="h-5 w-5 shrink-0"
                  style={{ background: c.ghostBorder, border: `1px solid ${c.lineStrong}` }}
                />
                <dt className="w-28 shrink-0 font-mono text-xs sm:w-40" style={{ color: c.text }}>
                  fieldBorder
                </dt>
                <dd className="text-xs leading-relaxed" style={{ color: c.textMuted }}>
                  Field boundary at rest
                </dd>
              </div>
              <div
                className="flex items-center gap-4 py-2.5 border-b"
                style={{ borderColor: c.line }}
              >
                <span
                  aria-hidden="true"
                  className="h-5 w-5 shrink-0"
                  style={{ background: c.dangerBorder, border: `1px solid ${c.lineStrong}` }}
                />
                <dt className="w-28 shrink-0 font-mono text-xs sm:w-40" style={{ color: c.text }}>
                  fieldBorderInvalid
                </dt>
                <dd className="text-xs leading-relaxed" style={{ color: c.textMuted }}>
                  Field boundary when invalid
                </dd>
              </div>
              <div
                className="flex items-center gap-4 py-2.5 border-b"
                style={{ borderColor: c.line }}
              >
                <span
                  aria-hidden="true"
                  className="h-5 w-5 shrink-0"
                  style={{ background: c.actionBg, border: `1px solid ${c.lineStrong}` }}
                />
                <dt className="w-28 shrink-0 font-mono text-xs sm:w-40" style={{ color: c.text }}>
                  controlOn
                </dt>
                <dd className="text-xs leading-relaxed" style={{ color: c.textMuted }}>
                  Checked control fill
                </dd>
              </div>
            </dl>
            <p className="mt-5 text-xs leading-relaxed" style={{ color: c.textMuted }}>
              <>
                The primary is ochre, never black; the in-card accent is mahangu gold; mopane and plum are their hovers. Each fill carries an edge that clears 3:1 on the surface. Ochre is a
                <em>fill</em>
                : as ink on light it is 2.4:1, so the accent ink is bark rust there.
              </>
            </p>
          </PixelPanel>
          <PixelPanel eyebrow="Status · four states, no green, no blue" accent={accentFor(1)}>
            <dl className="grid gap-0">
              <div className="flex items-center gap-4 py-3 border-b" style={{ borderColor: c.line }}>
                <PixelDot color={accentFor(0)} size={8} ring={c.lineStrong} />
                <dt className="w-24 shrink-0 text-sm font-medium" style={{ color: c.text }}>active</dt>
                <dd className="text-xs leading-relaxed" style={{ color: c.textMuted }}>
                  Live, running, in progress
                </dd>
              </div>
              <div className="flex items-center gap-4 py-3 border-b" style={{ borderColor: c.line }}>
                <PixelDot color={accentFor(2)} size={8} ring={c.lineStrong} />
                <dt className="w-24 shrink-0 text-sm font-medium" style={{ color: c.text }}>caution</dt>
                <dd className="text-xs leading-relaxed" style={{ color: c.textMuted }}>
                  Warning, pending, needs attention
                </dd>
              </div>
              <div className="flex items-center gap-4 py-3 border-b" style={{ borderColor: c.line }}>
                <PixelDot color={c.dangerBorder} size={8} ring={c.lineStrong} />
                <dt className="w-24 shrink-0 text-sm font-medium" style={{ color: c.text }}>critical</dt>
                <dd className="text-xs leading-relaxed" style={{ color: c.textMuted }}>
                  Error, destructive, blocking
                </dd>
              </div>
              <div className="flex items-center gap-4 py-3 border-b" style={{ borderColor: c.line }}>
                <PixelDot color={accentFor(3)} size={8} ring={c.lineStrong} />
                <dt className="w-24 shrink-0 text-sm font-medium" style={{ color: c.text }}>settled</dt>
                <dd className="text-xs leading-relaxed" style={{ color: c.textMuted }}>
                  Complete, archived, informational
                </dd>
              </div>
            </dl>
            <p className="mt-5 text-xs leading-relaxed" style={{ color: c.textMuted }}>
              <>
                A status mark always carries a text label and a hairline ring. Gold on cream is 1.6:1, so the ring is what delineates it — colour never carries the meaning alone.
              </>
            </p>
            <div className="mt-8">
              <PixelSubhead spaced>Density · the surface decides, not the control</PixelSubhead>
              <div className="mb-8 grid gap-4 sm:grid-cols-2">
                <div style={{ border: `1px solid ${c.line}`, padding: 14 }}>
                  <p
                    className="mb-3 text-[9px] font-bold uppercase tracking-[0.18em]"
                    style={{ color: c.textMuted }}
                  >
                    Comfortable · pages
                  </p>
                  <div className="flex flex-wrap items-center gap-2">
                    <PixelButton variant="primary">Save</PixelButton>
                    <PixelButton variant="ghost">Cancel</PixelButton>
                  </div>
                  <PixelInput className="mt-3" placeholder="Field" />
                </div>
                <DensityProvider value="compact">
                  <div style={{ border: `1px solid ${c.line}`, padding: 14 }}>
                    <p
                      className="mb-3 text-[9px] font-bold uppercase tracking-[0.18em]"
                      style={{ color: c.textMuted }}
                    >
                      Compact · popups, panels, toolbars
                    </p>
                    <div className="flex flex-wrap items-center gap-2">
                      <PixelButton variant="primary">Save</PixelButton>
                      <PixelButton variant="ghost">Cancel</PixelButton>
                    </div>
                    <PixelInput className="mt-3" placeholder="Field" />
                  </div>
                </DensityProvider>
              </div>
              <PixelSubhead spaced>Buttons · four intents</PixelSubhead>
              <div className="flex flex-wrap items-center gap-3">
                <PixelButton variant="primary">Primary</PixelButton>
                <PixelButton variant="accent">Accent</PixelButton>
                <PixelButton variant="ghost">Ghost</PixelButton>
                <PixelButton variant="danger">Delete</PixelButton>
                <PixelButton variant="primary" disabled>Disabled</PixelButton>
                <PixelIconButton label="Move up"><span aria-hidden="true">↑</span></PixelIconButton>
              </div>
              <p className="mt-4 text-xs leading-relaxed" style={{ color: c.textMuted }}>
                <>
                  One primary action per view. Danger is bark rust, not fired red: fired red's best foreground is 4.05:1, under the floor for a button label.
                </>
              </p>
            </div>
          </PixelPanel>
          <PixelPanel eyebrow="Fields · transparent ground, accent-ink focus" accent={accentFor(2)}>
            <div className="relative grid gap-5">
              <PixelField
                label="Email"
                hint="Focus the field to see the accent border."
                htmlFor="cs-email"
              >
                <PixelInput id="cs-email" type="email" placeholder="name@institution.na" />
              </PixelField>
              <PixelField label="Organisation" error="This field is required." htmlFor="cs-org">
                <PixelInput id="cs-org" invalid placeholder="Institution or company" />
              </PixelField>
              <PixelField label="Reference" hint="Assigned after intake." htmlFor="cs-ref">
                <PixelInput id="cs-ref" disabled placeholder="ONG-0000" />
              </PixelField>
              <PixelField label="Region" htmlFor="cs-region">
                <PixelSelect id="cs-region" defaultValue="khomas">
                  <option value="khomas">Khomas</option>
                  <option value="oshana">Oshana</option>
                  <option value="erongo">Erongo</option>
                </PixelSelect>
              </PixelField>
              <PixelField label="Short note" htmlFor="cs-note">
                <PixelTextarea
                  id="cs-note"
                  placeholder="What would you like to discuss?"
                  style={{ minHeight: 88 }}
                />
              </PixelField>
            </div>
          </PixelPanel>
          <PixelPanel eyebrow="Radio · stepped octagon, square core" accent={accentFor(3)}>
            <div className="relative grid gap-8">
              <div>
                <div className="grid gap-3">
                  <PixelRadio
                    name="cs-inquiry"
                    value="partnership"
                    label="Partnership"
                    checked={false}
                    onChange={() => {}}
                  />
                  <PixelRadio
                    name="cs-inquiry"
                    value="pilot"
                    label="Pilot programme"
                    checked
                    onChange={() => {}}
                  />
                  <PixelRadio
                    name="cs-inquiry"
                    value="access"
                    label="Early access"
                    checked={false}
                    onChange={() => {}}
                  />
                  <PixelRadio name="cs-inquiry" label="Unavailable option" disabled />
                </div>
              </div>
              <div>
                <PixelSubhead spaced>Checkbox · square box, stepped check</PixelSubhead>
                <div className="grid gap-3">
                  <PixelCheckbox label="Send me lab updates" checked onChange={() => {}} />
                  <PixelCheckbox label="Unchecked" checked={false} onChange={() => {}} />
                  <PixelCheckbox label="Locked by policy" checked disabled onChange={() => {}} />
                </div>
              </div>
              <div>
                <PixelSubhead spaced>Toggle · the knob steps, it does not slide</PixelSubhead>
                <div className="grid gap-3">
                  <PixelToggle label="Publish to the public site" checked onChange={() => {}} />
                  <PixelToggle label="Disabled" checked={false} disabled />
                </div>
              </div>
              <p className="text-xs leading-relaxed" style={{ color: c.textMuted }}>
                <>
                  Checked is ochre on all three, so "on" reads the same everywhere. The ochre fill is 2.56:1 against dust light, so the accent-ink edge carries the boundary. No control is rounded and none uses a system colour.
                </>
              </p>
            </div>
          </PixelPanel>
        </div>
        <div className="relative mt-4 overflow-hidden p-8" style={{ background: c.inverse }}>
          <WeaveOverlay isDark opacity={0.055} />
          <div className="relative">
            <PixelSubhead isDark>Inverse · a locally dark surface on a light page</PixelSubhead>
            <div className="flex flex-wrap items-center gap-3">
              <PixelButton variant="primary" isDark>Primary</PixelButton>
              <PixelButton variant="accent" isDark>Accent</PixelButton>
              <PixelButton variant="ghost" isDark>Ghost</PixelButton>
              <PixelToggle isDark label="Enabled" checked onChange={() => {}} />
              <PixelCheckbox isDark label="Checked" checked onChange={() => {}} />
            </div>
            <p className="mt-5 text-xs leading-relaxed" style={{ color: c.textMuted }}>
              The same four intents, rendered with
              <code>isDark</code>
              . Pass it whenever a control sits on the footer, the ticker or a lab card — the page being light does not make the surface light.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
