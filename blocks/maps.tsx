// The "A map that belongs to the system." section of /showcase
// Generated from the live showcase. Event handlers and state are stubbed:
// wire them to your own data. Requires @onganda/design-system/style.css.
import { ICON_SIZE, IconMap, PixelCornerMarks, PixelTag, accentFor, roles, useDark } from '@onganda/design-system';

export function AMapThatBelongsToTheSystemSection() {
  const { isDark } = useDark();
  const c = roles(isDark);
  return (
    <div id="maps" className="max-w-7xl mx-auto px-6 pb-24 md:px-12">
      <section
        className="onganda-map-shell relative overflow-hidden border"
        style={{ borderColor: c.line, background: c.surface, color: c.text }}
      >
        <style>
          {"\n  .onganda-map-shell .leaflet-container {\n    background: #F3E8C3;\n    color: #1E1A17;\n    font-family: Inter, Arial, sans-serif;\n  }\n  .onganda-map-shell[data-theme='dark'] .leaflet-container {\n    background: #271F1A;\n    color: #E8E1CF;\n  }\n  .onganda-map-shell .leaflet-tile-pane {\n    filter: sepia(.28) saturate(.72) contrast(.9) brightness(1.06);\n  }\n  .onganda-map-shell[data-theme='dark'] .leaflet-tile-pane {\n    filter: grayscale(.35) sepia(.35) saturate(.55) brightness(.58) contrast(1.25);\n  }\n  .onganda-map-shell .leaflet-control-zoom,\n  .onganda-map-shell .leaflet-control-attribution,\n  .onganda-map-shell .leaflet-popup-content-wrapper,\n  .onganda-map-shell .leaflet-popup-tip {\n    border-radius: 0;\n    box-shadow: none;\n  }\n  .onganda-map-shell .leaflet-control-zoom {\n    border: 1px solid rgba(30,26,23,0.25);\n    margin: 16px 16px 0 0;\n  }\n  .onganda-map-shell[data-theme='dark'] .leaflet-control-zoom {\n    border-color: rgba(232,225,207,0.25);\n  }\n  .onganda-map-shell .leaflet-control-zoom a {\n    width: 34px;\n    height: 34px;\n    border: 0;\n    border-bottom: 1px solid rgba(30,26,23,0.14);\n    border-radius: 0 !important;\n    background: #E8E1CF;\n    color: #1E1A17;\n    font: 600 18px/34px Inter, Arial, sans-serif;\n  }\n  .onganda-map-shell[data-theme='dark'] .leaflet-control-zoom a {\n    border-color: rgba(232,225,207,0.1);\n    background: #1C1713;\n    color: #E8E1CF;\n  }\n  .onganda-map-shell .leaflet-control-zoom a:hover,\n  .onganda-map-shell .leaflet-control-zoom a:focus-visible {\n    background: #D9791F;\n    color: #F3E8C3;\n  }\n  .onganda-map-shell .leaflet-control-attribution {\n    padding: 3px 6px;\n    background: rgba(243, 232, 195, .88);\n    color: #6A4B2E;\n    font-size: 9px;\n    letter-spacing: .02em;\n  }\n  .onganda-map-shell[data-theme='dark'] .leaflet-control-attribution {\n    background: rgba(18, 15, 13, .86);\n    color: #E8E1CF;\n  }\n  .onganda-map-shell .leaflet-control-attribution a {\n    color: inherit;\n    text-decoration: underline;\n    text-underline-offset: 2px;\n  }\n  .onganda-map-shell .onganda-map-marker-host {\n    border: 0;\n    background: transparent;\n  }\n  .onganda-map-shell .onganda-map-marker-host:focus-visible {\n    outline: 3px solid #1E1A17;\n    outline-offset: 4px;\n  }\n  .onganda-map-shell .onganda-map-area:focus-visible {\n    outline: 3px solid #1E1A17;\n    outline-offset: 2px;\n    stroke-width: 3px;\n  }\n  .onganda-map-shell[data-theme='dark'] .onganda-map-marker-host:focus-visible {\n    outline-color: #E8E1CF;\n  }\n  .onganda-map-shell .onganda-map-marker-shape {\n    position: relative;\n    display: block;\n    width: 30px;\n    height: 30px;\n    border: 4px solid #F3E8C3;\n    background: var(--onganda-map-accent);\n    box-shadow: 4px 4px 0 rgba(30,26,23,0.42);\n    transition: transform 140ms ease, box-shadow 140ms ease;\n  }\n  .onganda-map-shell .onganda-map-marker-shape::before,\n  .onganda-map-shell .onganda-map-marker-shape::after {\n    display: none;\n  }\n  .onganda-map-shell .onganda-map-marker-pixels {\n    position: absolute;\n    inset: 3px;\n    display: grid;\n    grid-template-columns: repeat(5, 3px);\n    grid-auto-rows: 3px;\n    place-content: center;\n  }\n  .onganda-map-shell .onganda-map-marker-pixel {\n    width: 3px;\n    height: 3px;\n    background: #1E1A17;\n  }\n  .onganda-map-shell .onganda-map-marker-host:hover .onganda-map-marker-shape,\n  .onganda-map-shell .onganda-map-marker-host:focus-visible .onganda-map-marker-shape {\n    transform: translateY(-3px);\n    box-shadow: 4px 7px 0 rgba(30,26,23,0.34);\n  }\n  .onganda-map-shell .leaflet-popup-content-wrapper {\n    border: 1px solid rgba(30,26,23,0.2);\n    background: #F3E8C3;\n    color: #1E1A17;\n  }\n  .onganda-map-shell[data-theme='dark'] .leaflet-popup-content-wrapper {\n    border-color: rgba(232,225,207,0.2);\n    background: #1C1713;\n    color: #E8E1CF;\n  }\n  .onganda-map-shell .leaflet-popup-tip {\n    background: #F3E8C3;\n  }\n  .onganda-map-shell[data-theme='dark'] .leaflet-popup-tip {\n    background: #1C1713;\n  }\n  .onganda-map-shell .leaflet-popup-content {\n    width: 210px !important;\n    margin: 16px;\n    line-height: 1.45;\n  }\n  .onganda-map-shell .onganda-map-popup-eyebrow {\n    margin-bottom: 6px;\n    color: #8F3E21;\n    font-size: 9px;\n    font-weight: 700;\n    letter-spacing: .15em;\n    text-transform: uppercase;\n  }\n  .onganda-map-shell[data-theme='dark'] .onganda-map-popup-eyebrow {\n    color: #DFAE2B;\n  }\n  .onganda-map-shell .onganda-map-popup-title {\n    display: block;\n    margin-bottom: 5px;\n    font-size: 15px;\n    letter-spacing: -.01em;\n  }\n  .onganda-map-shell .onganda-map-popup-description {\n    margin: 0;\n    color: #6A4B2E;\n    font-size: 12px;\n  }\n  .onganda-map-shell[data-theme='dark'] .onganda-map-popup-description {\n    color: rgba(232,225,207,0.65);\n  }\n  .onganda-map-shell .onganda-map-canvas:focus-visible {\n    outline: 3px solid #D9791F;\n    outline-offset: -3px;\n  }\n  @media (prefers-reduced-motion: reduce) {\n    .onganda-map-shell .onganda-map-marker-shape {\n      transition: none;\n    }\n  }\n"}
        </style>
        <PixelCornerMarks hex={accentFor(0)} size={8} />
        <header className="relative grid gap-5 p-6 md:grid-cols-[1fr_auto] md:items-end md:p-8">
          <div className="flex items-start gap-4">
            <div
              className="flex h-12 w-12 shrink-0 items-center justify-center"
              style={{ background: c.actionBg, color: c.surface }}
              aria-hidden="true"
            >
              <IconMap size={ICON_SIZE.control} color={c.surface} />
            </div>
            <div>
              <div className="flex"><PixelTag hex={accentFor(2)} label="Geospatial surface" /></div>
              <h2 className="mt-3 text-2xl font-semibold tracking-tight md:text-3xl">
                A map that belongs to the system.
              </h2>
              <p
                className="mt-2 max-w-2xl text-sm leading-relaxed md:text-base"
                style={{ color: c.textMuted }}
              >
                An illustrative Namibia-wide network showing how place, data, and field operations can share one visual language.
              </p>
            </div>
          </div>
          <p
            aria-live="polite"
            className="text-[10px] font-bold uppercase tracking-[0.15em]"
            style={{ color: c.textMuted }}
          >
            5 signals mapped
          </p>
        </header>
        <div className="relative border-y" style={{ borderColor: c.line }}>
          <div
            className="onganda-map-canvas w-full"
            role="region"
            aria-label="Illustrative map of capability signals across Namibia"
            tabIndex={0}
            style={{ height: "clamp(360px, 58vw, 560px)" }}
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute bottom-4 left-4 z-[500] flex items-end gap-1"
          >
            <span style={{ width: 3, height: 18, background: c.inverse, opacity: 0.58 }} />
            <span style={{ width: 3, height: 10, background: c.inverse, opacity: 0.58 }} />
            <span style={{ width: 3, height: 26, background: c.inverse, opacity: 0.58 }} />
            <span style={{ width: 3, height: 14, background: c.inverse, opacity: 0.58 }} />
            <span style={{ width: 3, height: 34, background: c.actionBg, opacity: 0.9 }} />
          </div>
        </div>
        <div
          className="relative grid gap-px sm:grid-cols-2 lg:grid-cols-3"
          style={{ background: c.line }}
        >
          <button
            type="button"
            className="group flex min-h-16 items-center gap-3 px-5 py-4 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px]"
            aria-pressed={false}
            style={{ background: c.surface, outlineColor: c.actionBg }}
          >
            <span aria-hidden="true" className="h-3 w-3 shrink-0" style={{ background: c.actionBg }} />
            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm font-semibold">Windhoek</span>
              <span
                className="mt-0.5 block truncate text-[9px] font-bold uppercase tracking-[0.13em]"
                style={{ color: c.textMuted }}
              >
                Coordination
              </span>
            </span>
            <span
              aria-hidden="true"
              className="text-[10px] font-bold tabular-nums"
              style={{ color: c.textMuted }}
            >
              01
            </span>
          </button>
          <button
            type="button"
            className="group flex min-h-16 items-center gap-3 px-5 py-4 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px]"
            aria-pressed={false}
            style={{ background: c.surface, outlineColor: c.actionBg }}
          >
            <span aria-hidden="true" className="h-3 w-3 shrink-0" style={{ background: c.accentBg }} />
            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm font-semibold">Oshakati</span>
              <span
                className="mt-0.5 block truncate text-[9px] font-bold uppercase tracking-[0.13em]"
                style={{ color: c.textMuted }}
              >
                Language systems
              </span>
            </span>
            <span
              aria-hidden="true"
              className="text-[10px] font-bold tabular-nums"
              style={{ color: c.textMuted }}
            >
              02
            </span>
          </button>
          <button
            type="button"
            className="group flex min-h-16 items-center gap-3 px-5 py-4 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px]"
            aria-pressed={false}
            style={{ background: c.surface, outlineColor: c.actionBg }}
          >
            <span
              aria-hidden="true"
              className="h-3 w-3 shrink-0"
              style={{ background: c.accentHoverBg }}
            />
            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm font-semibold">Rundu</span>
              <span
                className="mt-0.5 block truncate text-[9px] font-bold uppercase tracking-[0.13em]"
                style={{ color: c.textMuted }}
              >
                Field delivery
              </span>
            </span>
            <span
              aria-hidden="true"
              className="text-[10px] font-bold tabular-nums"
              style={{ color: c.textMuted }}
            >
              03
            </span>
          </button>
          <button
            type="button"
            className="group flex min-h-16 items-center gap-3 px-5 py-4 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px]"
            aria-pressed={false}
            style={{ background: c.surface, outlineColor: c.actionBg }}
          >
            <span
              aria-hidden="true"
              className="h-3 w-3 shrink-0"
              style={{ background: c.dangerBorder }}
            />
            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm font-semibold">Walvis Bay</span>
              <span
                className="mt-0.5 block truncate text-[9px] font-bold uppercase tracking-[0.13em]"
                style={{ color: c.textMuted }}
              >
                Logistics
              </span>
            </span>
            <span
              aria-hidden="true"
              className="text-[10px] font-bold tabular-nums"
              style={{ color: c.textMuted }}
            >
              04
            </span>
          </button>
          <button
            type="button"
            className="group flex min-h-16 items-center gap-3 px-5 py-4 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px]"
            aria-pressed={false}
            style={{ background: c.surface, outlineColor: c.actionBg }}
          >
            <span aria-hidden="true" className="h-3 w-3 shrink-0" style={{ background: c.dangerBg }} />
            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm font-semibold">Keetmanshoop</span>
              <span
                className="mt-0.5 block truncate text-[9px] font-bold uppercase tracking-[0.13em]"
                style={{ color: c.textMuted }}
              >
                Climate systems
              </span>
            </span>
            <span
              aria-hidden="true"
              className="text-[10px] font-bold tabular-nums"
              style={{ color: c.textMuted }}
            >
              05
            </span>
          </button>
        </div>
      </section>
    </div>
  );
}
