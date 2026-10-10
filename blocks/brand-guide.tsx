// The "Naming hierarchy. One root. Five branches." section of /showcase
// Generated from the live showcase. Event handlers and state are stubbed:
// wire them to your own data. Requires @onganda/design-system/style.css.
import { AnnotationPanel, CodeSnippetBlock, FlowNodeCard, FlowNodeIcon, PixelArrowDown, PixelCornerMarks, PixelTag, SectionHeader, WeaveOverlay, accentFor, roles, useDark } from '@onganda/design-system';

export function NamingHierarchyOneRootFiveBranchesSection() {
  const { isDark } = useDark();
  const c = roles(isDark);
  return (
    <section id="brand-guide" className="max-w-7xl mx-auto px-6 pb-24 md:px-12">
      <SectionHeader
        label="Brand Guide"
        headline="Naming hierarchy. One root. Five branches."
        accent={accentFor(3)}
      />
      <div className="flex flex-col lg:flex-row gap-16 items-start">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-10">
            <div className="flex gap-1" aria-hidden="true">
              <div className="h-1.5" style={{ width: 8, background: c.actionBg, opacity: 0.12 }} />
              <div className="h-1.5" style={{ width: 16, background: c.actionBg, opacity: 0.22 }} />
              <div className="h-1.5" style={{ width: 24, background: c.actionBg, opacity: 0.32 }} />
              <div
                className="h-1.5"
                style={{ width: 16, background: c.actionBg, opacity: 0.42000000000000004 }}
              />
              <div className="h-1.5" style={{ width: 8, background: c.actionBg, opacity: 0.52 }} />
            </div>
            <span className="text-[11px] font-bold uppercase tracking-[0.15em] text-(--onganda-char-black)/66">
              Pixel Flowchart — Naming Architecture
            </span>
          </div>
          <div style={{  }} data-onganda-enter="">
            <div
              className="relative border-2 bg-(--onganda-char-black) flex items-center gap-5 px-6 py-5 overflow-hidden"
              style={{ borderColor: c.actionBg }}
            >
              <WeaveOverlay isDark opacity={0.055} />
              <PixelCornerMarks hex={accentFor(0)} size={10} />
              <div className="relative flex items-center gap-4">
                <FlowNodeIcon id="root" hex={accentFor(0)} />
                <div>
                  <div className="flex items-baseline gap-2.5">
                    <h3 className="text-lg font-semibold tracking-tight text-(--onganda-millet-clay) leading-none">
                      Okaanda
                    </h3>
                    <PixelTag hex={c.inverseBorder} label="ROOT" isDark />
                  </div>
                  <p className="text-sm text-(--onganda-millet-clay)/55 mt-1">Namibia AI Systems Lab</p>
                  <p
                    className="text-[10px] font-bold uppercase tracking-[0.13em] mt-1.5"
                    style={{ color: accentFor(0) }}
                  >
                    Parent Institution
                  </p>
                </div>
              </div>
            </div>
            <div
              aria-hidden="true"
              className="hidden xl:block w-full"
              style={{ height: 52, position: "relative" }}
            >
              <svg width="100%" height="52" viewBox="0 0 600 52">
                <line stroke={accentFor(0)} />
                <line stroke={accentFor(0)} />
                <line stroke={accentFor(0)} />
                <line stroke={accentFor(1)} />
                <line stroke={accentFor(2)} />
              </svg>
            </div>
            <div className="xl:hidden flex justify-center py-3" aria-hidden="true">
              <div className="w-px h-8" style={{ background: c.actionBg }} />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-x-4 gap-y-0 mt-0">
              <div className="flex flex-col items-center" style={{  }} data-onganda-enter="">
                <div
                  aria-hidden="true"
                  className="xl:hidden"
                  style={{ width: 2, height: 20, background: c.actionBg }}
                />
                <div aria-hidden="true" className="flex flex-col items-center mb-1">
                  <PixelArrowDown color={accentFor(0)} />
                </div>
                <div className="w-full" style={{ minHeight: 160 }}>
                  <FlowNodeCard
                    node={{ id: "granary", oshiwambo: "Okaanda", english: "Granary", role: "Model & Data Platform", hex: accentFor(0), pixelTag: "01", isRoot: false }}
                    isHovered={false}
                  />
                </div>
              </div>
              <div className="flex flex-col items-center" style={{  }} data-onganda-enter="">
                <div
                  aria-hidden="true"
                  className="xl:hidden"
                  style={{ width: 2, height: 20, background: c.dangerBg }}
                />
                <div aria-hidden="true" className="flex flex-col items-center mb-1">
                  <PixelArrowDown color={accentFor(1)} />
                </div>
                <div className="w-full" style={{ minHeight: 160 }}>
                  <FlowNodeCard
                    node={{ id: "mill", oshiwambo: "Oshini", english: "Mill", role: "Adaptation Workflows", hex: accentFor(1), pixelTag: "02", isRoot: false }}
                    isHovered={false}
                  />
                </div>
              </div>
              <div className="flex flex-col items-center" style={{  }} data-onganda-enter="">
                <div
                  aria-hidden="true"
                  className="xl:hidden"
                  style={{ width: 2, height: 20, background: c.accentBg }}
                />
                <div aria-hidden="true" className="flex flex-col items-center mb-1">
                  <PixelArrowDown color={accentFor(2)} />
                </div>
                <div className="w-full" style={{ minHeight: 160 }}>
                  <FlowNodeCard
                    node={{ id: "vessel", oshiwambo: "Ombiga", english: "Vessel", role: "Agents & Containers", hex: accentFor(2), pixelTag: "03", isRoot: false }}
                    isHovered={false}
                  />
                </div>
              </div>
              <div className="flex flex-col items-center" style={{  }} data-onganda-enter="">
                <div
                  aria-hidden="true"
                  className="xl:hidden"
                  style={{ width: 2, height: 20, background: c.actionHoverBg }}
                />
                <div aria-hidden="true" className="flex flex-col items-center mb-1">
                  <PixelArrowDown color={accentFor(3)} />
                </div>
                <div className="w-full" style={{ minHeight: 160 }}>
                  <FlowNodeCard
                    node={{ id: "surface", oshiwambo: "Etiti", english: "Surface", role: "Interfaces & Dashboards", hex: accentFor(3), pixelTag: "04", isRoot: false }}
                    isHovered={false}
                  />
                </div>
              </div>
              <div className="flex flex-col items-center" style={{  }} data-onganda-enter="">
                <div
                  aria-hidden="true"
                  className="xl:hidden"
                  style={{ width: 2, height: 20, background: c.accentHoverBg }}
                />
                <div aria-hidden="true" className="flex flex-col items-center mb-1">
                  <PixelArrowDown color={accentFor(4)} />
                </div>
                <div className="w-full" style={{ minHeight: 160 }}>
                  <FlowNodeCard
                    node={{ id: "delivery", oshiwambo: "Oshitoo", english: "Delivery", role: "Applications & Sector Products", hex: accentFor(4), pixelTag: "05", isRoot: false }}
                    isHovered={false}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <AnnotationPanel
          annotations={[{ label: "Root", note: "Parent brand and institutional identity. All sub-systems live under this mark." }, { label: "Tag", note: "Two-digit pixel tag for ordering, versioning, and spec references." }, { label: "Oshiwambo", note: "Primary name. Always leads in product, UI, and documentation contexts." }, { label: "English", note: "Secondary name. Provides functional clarity for external audiences." }, { label: "Role", note: "One-line functional description of what the system does architecturally." }, { label: "Color", note: "Each system carries its material color through iconography and accents only." }]}
          rules={[{ rule: "Pixel by default: icon, diagram, texture, mark." }, { rule: "Non-pixel by default: body, reading layout, dense interface." }, { rule: "Stepped corners, not rounded, for brand assets." }, { rule: "Texture on grounds, solid lines everywhere else — no dotted rules." }, { rule: "Typography stays clean so pixel elements breathe." }]}
        />
      </div>
      <CodeSnippetBlock
        label="FlowNode · Pixel Flowchart"
        lines={[{ type: "comment", text: "// Brand Guide — FlowNodeCard naming hierarchy" }, { type: "import", text: "import { FlowNodeCard, FlowNodeIcon } from '@onganda/design-system';" }, { type: "import", text: "import { FLOW_NODES } from '@onganda/design-system';" }, { type: "plain", text: "" }, { type: "comment", text: "// A FlowNodeEntry" }, { type: "plain", text: "const node = {" }, { type: "prop", text: "  id: 'mill', oshiwambo: 'Oshini', english: 'Mill'," }, { type: "prop", text: `  role: 'Adaptation Workflows', hex: '${c.focusRing}',` }, { type: "prop", text: "  pixelTag: '02', isRoot: false," }, { type: "plain", text: "};" }, { type: "plain", text: "" }, { type: "comment", text: "// Render with hover state" }, /* …4 more */]}
        accentHex={c.focusRing}
      />
    </section>
  );
}
