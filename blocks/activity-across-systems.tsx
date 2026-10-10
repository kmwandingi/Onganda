// The "Activity across systems." section of /showcase
// Generated from the live showcase. Event handlers and state are stubbed:
// wire them to your own data. Requires @onganda/design-system/style.css.
import { CodeSnippetBlock, PixelDot, SectionHeader, WeaveOverlay, accentFor, roles, useDark } from '@onganda/design-system';

export function ActivityAcrossSystemsSection() {
  const { isDark } = useDark();
  const c = roles(isDark);
  return (
    <section className="max-w-7xl mx-auto px-6 pb-24 md:px-12">
      <SectionHeader
        label="Research Signals"
        headline="Activity across systems."
        accent={accentFor(2)}
      />
      <div className="flex flex-col items-stretch gap-12 lg:flex-row lg:items-start">
        <div
          className="min-w-0 flex-1 bg-(--onganda-inverse) p-6 md:p-8"
          style={{  }}
          data-onganda-enter=""
        >
          <div className="relative overflow-x-auto">
            <WeaveOverlay isDark opacity={0.055} />
            <div className="relative flex gap-1.5 mb-2 pl-24">
              <div
                className="flex-1 text-center text-[9px] font-bold uppercase tracking-widest"
                style={{ color: c.textOnInverse, opacity: 0.25 }}
              >
                Q1
              </div>
              <div
                className="flex-1 text-center text-[9px] font-bold uppercase tracking-widest"
                style={{ color: c.textOnInverse, opacity: 0.25 }}
              >
                Q2
              </div>
              <div
                className="flex-1 text-center text-[9px] font-bold uppercase tracking-widest"
                style={{ color: c.textOnInverse, opacity: 0.25 }}
              >
                Q3
              </div>
              <div
                className="flex-1 text-center text-[9px] font-bold uppercase tracking-widest"
                style={{ color: c.textOnInverse, opacity: 0.25 }}
              >
                Q4
              </div>
              <div
                className="flex-1 text-center text-[9px] font-bold uppercase tracking-widest"
                style={{ color: c.textOnInverse, opacity: 0.25 }}
              >
                Q1
              </div>
              <div
                className="flex-1 text-center text-[9px] font-bold uppercase tracking-widest"
                style={{ color: c.textOnInverse, opacity: 0.25 }}
              >
                Q2
              </div>
              <div
                className="flex-1 text-center text-[9px] font-bold uppercase tracking-widest"
                style={{ color: c.textOnInverse, opacity: 0.25 }}
              >
                Q3
              </div>
              <div
                className="flex-1 text-center text-[9px] font-bold uppercase tracking-widest"
                style={{ color: c.textOnInverse, opacity: 0.25 }}
              >
                Q4
              </div>
            </div>
            <div className="relative flex flex-col gap-1.5">
              <div className="flex items-center gap-1.5">
                <div
                  className="w-24 shrink-0 flex items-center justify-end gap-2 pr-3 text-[9px] font-bold uppercase tracking-[0.12em] text-right"
                  style={{ color: c.textMuted }}
                >
                  <span>Okaanda</span>
                  <PixelDot color={accentFor(0)} size={5} ring={c.textFaint} />
                </div>
                <div
                  className="flex-1 aspect-square"
                  title="Okaanda · Q1: 10%"
                  style={{ background: c.inverse }}
                  data-onganda-enter=""
                />
                <div
                  className="flex-1 aspect-square"
                  title="Okaanda · Q2: 30%"
                  style={{ background: c.dangerBg }}
                  data-onganda-enter=""
                />
                <div
                  className="flex-1 aspect-square"
                  title="Okaanda · Q3: 60%"
                  style={{ background: c.accentBg }}
                  data-onganda-enter=""
                />
                <div
                  className="flex-1 aspect-square"
                  title="Okaanda · Q4: 40%"
                  style={{ background: c.dangerBg }}
                  data-onganda-enter=""
                />
                <div
                  className="flex-1 aspect-square"
                  title="Okaanda · Q1: 20%"
                  style={{ background: c.actionHoverBg }}
                  data-onganda-enter=""
                />
                <div
                  className="flex-1 aspect-square"
                  title="Okaanda · Q2: 5%"
                  style={{ background: c.inverse }}
                  data-onganda-enter=""
                />
                <div
                  className="flex-1 aspect-square"
                  title="Okaanda · Q3: 15%"
                  style={{ background: c.actionHoverBg }}
                  data-onganda-enter=""
                />
                <div
                  className="flex-1 aspect-square"
                  title="Okaanda · Q4: 35%"
                  style={{ background: c.dangerBg }}
                  data-onganda-enter=""
                />
              </div>
              <div className="flex items-center gap-1.5">
                <div
                  className="w-24 shrink-0 flex items-center justify-end gap-2 pr-3 text-[9px] font-bold uppercase tracking-[0.12em] text-right"
                  style={{ color: c.textMuted }}
                >
                  <span>Oshini</span>
                  <PixelDot color={accentFor(1)} size={5} ring={c.textFaint} />
                </div>
                <div
                  className="flex-1 aspect-square"
                  title="Oshini · Q1: 20%"
                  style={{ background: c.actionHoverBg }}
                  data-onganda-enter=""
                />
                <div
                  className="flex-1 aspect-square"
                  title="Oshini · Q2: 55%"
                  style={{ background: c.accentBg }}
                  data-onganda-enter=""
                />
                <div
                  className="flex-1 aspect-square"
                  title="Oshini · Q3: 85%"
                  style={{ background: c.actionBg }}
                  data-onganda-enter=""
                />
                <div
                  className="flex-1 aspect-square"
                  title="Oshini · Q4: 70%"
                  style={{ background: c.actionBg }}
                  data-onganda-enter=""
                />
                <div
                  className="flex-1 aspect-square"
                  title="Oshini · Q1: 45%"
                  style={{ background: c.dangerBg }}
                  data-onganda-enter=""
                />
                <div
                  className="flex-1 aspect-square"
                  title="Oshini · Q2: 20%"
                  style={{ background: c.actionHoverBg }}
                  data-onganda-enter=""
                />
                <div
                  className="flex-1 aspect-square"
                  title="Oshini · Q3: 30%"
                  style={{ background: c.dangerBg }}
                  data-onganda-enter=""
                />
                <div
                  className="flex-1 aspect-square"
                  title="Oshini · Q4: 50%"
                  style={{ background: c.accentBg }}
                  data-onganda-enter=""
                />
              </div>
              <div className="flex items-center gap-1.5">
                <div
                  className="w-24 shrink-0 flex items-center justify-end gap-2 pr-3 text-[9px] font-bold uppercase tracking-[0.12em] text-right"
                  style={{ color: c.textMuted }}
                >
                  <span>Ombiga</span>
                  <PixelDot color={accentFor(2)} size={5} ring={c.textFaint} />
                </div>
                <div
                  className="flex-1 aspect-square"
                  title="Ombiga · Q1: 35%"
                  style={{ background: c.dangerBg }}
                  data-onganda-enter=""
                />
                <div
                  className="flex-1 aspect-square"
                  title="Ombiga · Q2: 70%"
                  style={{ background: c.actionBg }}
                  data-onganda-enter=""
                />
                <div
                  className="flex-1 aspect-square"
                  title="Ombiga · Q3: 90%"
                  style={{ background: c.dangerBorder }}
                  data-onganda-enter=""
                />
                <div
                  className="flex-1 aspect-square"
                  title="Ombiga · Q4: 75%"
                  style={{ background: c.actionBg }}
                  data-onganda-enter=""
                />
                <div
                  className="flex-1 aspect-square"
                  title="Ombiga · Q1: 50%"
                  style={{ background: c.accentBg }}
                  data-onganda-enter=""
                />
                <div
                  className="flex-1 aspect-square"
                  title="Ombiga · Q2: 30%"
                  style={{ background: c.dangerBg }}
                  data-onganda-enter=""
                />
                <div
                  className="flex-1 aspect-square"
                  title="Ombiga · Q3: 45%"
                  style={{ background: c.dangerBg }}
                  data-onganda-enter=""
                />
                <div
                  className="flex-1 aspect-square"
                  title="Ombiga · Q4: 60%"
                  style={{ background: c.accentBg }}
                  data-onganda-enter=""
                />
              </div>
              <div className="flex items-center gap-1.5">
                <div
                  className="w-24 shrink-0 flex items-center justify-end gap-2 pr-3 text-[9px] font-bold uppercase tracking-[0.12em] text-right"
                  style={{ color: c.textMuted }}
                >
                  <span>Etiti</span>
                  <PixelDot color={accentFor(3)} size={5} ring={c.textFaint} />
                </div>
                <div
                  className="flex-1 aspect-square"
                  title="Etiti · Q1: 25%"
                  style={{ background: c.actionHoverBg }}
                  data-onganda-enter=""
                />
                <div
                  className="flex-1 aspect-square"
                  title="Etiti · Q2: 60%"
                  style={{ background: c.accentBg }}
                  data-onganda-enter=""
                />
                <div
                  className="flex-1 aspect-square"
                  title="Etiti · Q3: 90%"
                  style={{ background: c.dangerBorder }}
                  data-onganda-enter=""
                />
                <div
                  className="flex-1 aspect-square"
                  title="Etiti · Q4: 75%"
                  style={{ background: c.actionBg }}
                  data-onganda-enter=""
                />
                <div
                  className="flex-1 aspect-square"
                  title="Etiti · Q1: 50%"
                  style={{ background: c.accentBg }}
                  data-onganda-enter=""
                />
                <div
                  className="flex-1 aspect-square"
                  title="Etiti · Q2: 30%"
                  style={{ background: c.dangerBg }}
                  data-onganda-enter=""
                />
                <div
                  className="flex-1 aspect-square"
                  title="Etiti · Q3: 45%"
                  style={{ background: c.dangerBg }}
                  data-onganda-enter=""
                />
                <div
                  className="flex-1 aspect-square"
                  title="Etiti · Q4: 60%"
                  style={{ background: c.accentBg }}
                  data-onganda-enter=""
                />
              </div>
              <div className="flex items-center gap-1.5">
                <div
                  className="w-24 shrink-0 flex items-center justify-end gap-2 pr-3 text-[9px] font-bold uppercase tracking-[0.12em] text-right"
                  style={{ color: c.textMuted }}
                >
                  <span>Oshitoo</span>
                  <PixelDot color={accentFor(4)} size={5} ring={c.textFaint} />
                </div>
                <div
                  className="flex-1 aspect-square"
                  title="Oshitoo · Q1: 10%"
                  style={{ background: c.inverse }}
                  data-onganda-enter=""
                />
                <div
                  className="flex-1 aspect-square"
                  title="Oshitoo · Q2: 35%"
                  style={{ background: c.dangerBg }}
                  data-onganda-enter=""
                />
                <div
                  className="flex-1 aspect-square"
                  title="Oshitoo · Q3: 60%"
                  style={{ background: c.accentBg }}
                  data-onganda-enter=""
                />
                <div
                  className="flex-1 aspect-square"
                  title="Oshitoo · Q4: 45%"
                  style={{ background: c.dangerBg }}
                  data-onganda-enter=""
                />
                <div
                  className="flex-1 aspect-square"
                  title="Oshitoo · Q1: 25%"
                  style={{ background: c.actionHoverBg }}
                  data-onganda-enter=""
                />
                <div
                  className="flex-1 aspect-square"
                  title="Oshitoo · Q2: 10%"
                  style={{ background: c.inverse }}
                  data-onganda-enter=""
                />
                <div
                  className="flex-1 aspect-square"
                  title="Oshitoo · Q3: 20%"
                  style={{ background: c.actionHoverBg }}
                  data-onganda-enter=""
                />
                <div
                  className="flex-1 aspect-square"
                  title="Oshitoo · Q4: 35%"
                  style={{ background: c.dangerBg }}
                  data-onganda-enter=""
                />
              </div>
              <div className="flex items-center gap-1.5">
                <div
                  className="w-24 shrink-0 flex items-center justify-end gap-2 pr-3 text-[9px] font-bold uppercase tracking-[0.12em] text-right"
                  style={{ color: c.textMuted }}
                >
                  <span>Cross</span>
                </div>
                <div
                  className="flex-1 aspect-square"
                  title="Cross · Q1: 5%"
                  style={{ background: c.inverse }}
                  data-onganda-enter=""
                />
                <div
                  className="flex-1 aspect-square"
                  title="Cross · Q2: 15%"
                  style={{ background: c.actionHoverBg }}
                  data-onganda-enter=""
                />
                <div
                  className="flex-1 aspect-square"
                  title="Cross · Q3: 30%"
                  style={{ background: c.dangerBg }}
                  data-onganda-enter=""
                />
                <div
                  className="flex-1 aspect-square"
                  title="Cross · Q4: 20%"
                  style={{ background: c.actionHoverBg }}
                  data-onganda-enter=""
                />
                <div
                  className="flex-1 aspect-square"
                  title="Cross · Q1: 10%"
                  style={{ background: c.inverse }}
                  data-onganda-enter=""
                />
                <div
                  className="flex-1 aspect-square"
                  title="Cross · Q2: 5%"
                  style={{ background: c.inverse }}
                  data-onganda-enter=""
                />
                <div
                  className="flex-1 aspect-square"
                  title="Cross · Q3: 10%"
                  style={{ background: c.inverse }}
                  data-onganda-enter=""
                />
                <div
                  className="flex-1 aspect-square"
                  title="Cross · Q4: 15%"
                  style={{ background: c.actionHoverBg }}
                  data-onganda-enter=""
                />
              </div>
            </div>
            <div className="relative flex items-center gap-3 mt-6">
              <span className="text-[9px] font-bold uppercase tracking-widest text-(--onganda-text-on-inverse)/55">
                Low
              </span>
              <div className="w-4 h-4" style={{ background: c.inverse }} aria-hidden="true" />
              <div className="w-4 h-4" style={{ background: c.actionHoverBg }} aria-hidden="true" />
              <div className="w-4 h-4" style={{ background: c.dangerBg }} aria-hidden="true" />
              <div className="w-4 h-4" style={{ background: c.accentBg }} aria-hidden="true" />
              <div className="w-4 h-4" style={{ background: c.actionBg }} aria-hidden="true" />
              <div className="w-4 h-4" style={{ background: c.dangerBorder }} aria-hidden="true" />
              <span className="text-[9px] font-bold uppercase tracking-widest text-(--onganda-text-on-inverse)/55">
                High
              </span>
            </div>
          </div>
        </div>
        <div className="lg:w-72 xl:w-80 shrink-0">
          <p className="text-xs font-bold uppercase tracking-[0.15em] text-(--onganda-text-muted) mb-5">
            How to read
          </p>
          <div className="flex flex-col gap-0 divide-y divide-(--onganda-line)">
            <div className="py-4">
              <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-(--onganda-accent-ink) mb-1">
                Rows
              </p>
              <p className="text-sm text-(--onganda-text)/65 leading-relaxed">
                Each row maps to one of the five named systems, plus a cross-system channel.
              </p>
            </div>
            <div className="py-4">
              <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-(--onganda-accent-ink) mb-1">
                Columns
              </p>
              <p className="text-sm text-(--onganda-text)/65 leading-relaxed">
                Quarterly time periods across a two-year research horizon.
              </p>
            </div>
            <div className="py-4">
              <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-(--onganda-accent-ink) mb-1">
                Color
              </p>
              <p className="text-sm text-(--onganda-text)/65 leading-relaxed">
                Intensity corresponds to relative research and development activity. Material palette — no arbitrary hues.
              </p>
            </div>
          </div>
        </div>
      </div>
      <CodeSnippetBlock
        label="HeatCell · Research Signals"
        lines={[{ type: "comment", text: "// Research Signals — heatmap grid" }, { type: "import", text: "import { HEATMAP_CELLS, HEATMAP_LABELS_X, HEATMAP_LABELS_Y } from '@onganda/design-system';" }, { type: "plain", text: "" }, { type: "comment", text: "// A HeatCell entry: { row, col, intensity (0–1) }" }, { type: "plain", text: "const cell = { row: 0, col: 2, intensity: 0.6 };" }, { type: "plain", text: "" }, { type: "comment", text: "// Derive fill color from intensity" }, { type: "plain", text: "const getHeatColor = (v: number) => {" }, { type: "keyword", text: "  if" }, { type: "plain", text: " (v > 0.85) return COLOR.firedRed;" }, { type: "keyword", text: "  if" }, { type: "plain", text: " (v > 0.65) return COLOR.ochreOrange;" }, /* …6 more */]}
        accentHex={c.dangerBorder}
      />
    </section>
  );
}
