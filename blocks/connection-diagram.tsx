// The "How the workshop talks to itself." section of /showcase
// Generated from the live showcase. Event handlers and state are stubbed:
// wire them to your own data. Requires @onganda/design-system/style.css.
import { AnnotationPanel, CodeSnippetBlock, SectionHeader, WeaveOverlay, accentFor, roles, useDark } from '@onganda/design-system';

export function HowTheWorkshopTalksToItselfSection() {
  const { isDark } = useDark();
  const c = roles(isDark);
  return (
    <section id="connection-diagram" className="max-w-7xl mx-auto px-6 pb-24 md:px-12">
      <SectionHeader
        label="System Connections"
        headline="How the workshop talks to itself."
        accent={accentFor(3)}
      />
      <div className="flex flex-col lg:flex-row gap-10 items-start">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-4 mb-6">
            <div className="flex gap-1" aria-hidden="true">
              <div className="h-1.5" style={{ width: 8, background: c.actionBg, opacity: 0.12 }} />
              <div className="h-1.5" style={{ width: 8, background: c.dangerBg, opacity: 0.22 }} />
              <div className="h-1.5" style={{ width: 8, background: c.accentBg, opacity: 0.32 }} />
              <div
                className="h-1.5"
                style={{ width: 8, background: c.actionHoverBg, opacity: 0.42000000000000004 }}
              />
              <div
                className="h-1.5"
                style={{ width: 8, background: c.accentHoverBg, opacity: 0.52 }}
              />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-(--onganda-text-muted)">
              Pixel Connection Map — Data Flow
            </span>
          </div>
          <div
            className="bg-(--onganda-inverse)"
            style={{ position: "relative", width: "100%", paddingBottom: "82%" }}
          >
            <WeaveOverlay isDark opacity={0.055} />
            <svg
              style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
              viewBox="0 0 100 100"
              aria-hidden="true"
            >
              <defs>
                <marker id="arrowhead-0"><polygon points="0 0, 4 2, 0 4" fill={accentFor(0)} /></marker>
                <marker id="arrowhead-1"><polygon points="0 0, 4 2, 0 4" fill={accentFor(1)} /></marker>
                <marker id="arrowhead-2"><polygon points="0 0, 4 2, 0 4" fill={accentFor(2)} /></marker>
                <marker id="arrowhead-3"><polygon points="0 0, 4 2, 0 4" fill={accentFor(3)} /></marker>
                <marker id="arrowhead-4"><polygon points="0 0, 4 2, 0 4" fill={c.dangerBorder} /></marker>
                <marker id="arrowhead-5"><polygon points="0 0, 4 2, 0 4" fill={accentFor(1)} /></marker>
              </defs>
              <g><path d="M 50 16 Q 70 18 78 36" stroke={accentFor(0)} fill="none" /></g>
              <g><path d="M 78 36 Q 72 56 78 66" stroke={accentFor(1)} fill="none" /></g>
              <g><path d="M 78 66 Q 56 71 22 66" stroke={accentFor(2)} fill="none" /></g>
              <g><path d="M 22 66 Q 30 67 50 84" stroke={accentFor(3)} fill="none" /></g>
              <g><path d="M 50 16 Q 70 46 78 66" stroke={c.dangerBorder} fill="none" /></g>
              <g><path d="M 78 36 Q 44 56 22 66" stroke={accentFor(1)} fill="none" /></g>
            </svg>
            <div style={{ position: "absolute", inset: 0, overflow: "visible" }}>
              <button
                className="flex flex-col items-center cursor-default focus:outline-none"
                aria-label="Okaanda — Granary"
                style={{ position: "absolute", left: "50%", top: "16%", zIndex: 5 }}
                data-onganda-enter=""
              >
                <div style={{ background: c.inverse, border: `2px solid ${c.actionBg}`, padding: "6px 8px", transition: "background 0.18s, border-color 0.18s, box-shadow 0.18s", boxShadow: "none" }}>
                  <div
                    className="text-[9px] font-bold uppercase tracking-[0.18em] mb-1 text-center"
                    style={{ color: accentFor(0) }}
                  >
                    01
                  </div>
                  <div
                    className="w-6 h-6 mx-auto flex items-center justify-center"
                    aria-hidden="true"
                    style={{ background: `${accentFor(0)}22`, border: `1px solid ${accentFor(0)}55` }}
                  >
                    <div className="w-2 h-2" style={{ background: c.actionBg }} />
                  </div>
                </div>
                <div className="mt-1.5 text-center leading-tight" style={{ minWidth: 64 }}>
                  <p
                    className="text-[10px] font-semibold tracking-tight"
                    style={{ color: c.textOnInverse, opacity: 0.75 }}
                  >
                    Okaanda
                  </p>
                  <p
                    className="text-[9px] uppercase tracking-[0.1em]"
                    style={{ color: c.textOnInverse, opacity: 0.3 }}
                  >
                    Model & Data Platform
                  </p>
                </div>
              </button>
              <button
                className="flex flex-col items-center cursor-default focus:outline-none"
                aria-label="Oshini — Mill"
                style={{ position: "absolute", left: "78%", top: "36%", zIndex: 5 }}
                data-onganda-enter=""
              >
                <div style={{ background: c.inverse, border: `2px solid ${c.accentInk}`, padding: "6px 8px", transition: "background 0.18s, border-color 0.18s, box-shadow 0.18s", boxShadow: "none" }}>
                  <div
                    className="text-[9px] font-bold uppercase tracking-[0.18em] mb-1 text-center"
                    style={{ color: c.textOnInverse }}
                  >
                    02
                  </div>
                  <div
                    className="w-6 h-6 mx-auto flex items-center justify-center"
                    aria-hidden="true"
                    style={{ background: `${accentFor(1)}22`, border: `1px solid ${accentFor(1)}55` }}
                  >
                    <div className="w-2 h-2" style={{ background: c.dangerBg }} />
                  </div>
                </div>
                <div className="mt-1.5 text-center leading-tight" style={{ minWidth: 64 }}>
                  <p
                    className="text-[10px] font-semibold tracking-tight"
                    style={{ color: c.textOnInverse, opacity: 0.75 }}
                  >
                    Oshini
                  </p>
                  <p
                    className="text-[9px] uppercase tracking-[0.1em]"
                    style={{ color: c.textOnInverse, opacity: 0.3 }}
                  >
                    Adaptation Workflows
                  </p>
                </div>
              </button>
              <button
                className="flex flex-col items-center cursor-default focus:outline-none"
                aria-label="Ombiga — Vessel"
                style={{ position: "absolute", left: "78%", top: "66%", zIndex: 5 }}
                data-onganda-enter=""
              >
                <div style={{ background: c.inverse, border: `2px solid ${c.accentBg}`, padding: "6px 8px", transition: "background 0.18s, border-color 0.18s, box-shadow 0.18s", boxShadow: "none" }}>
                  <div
                    className="text-[9px] font-bold uppercase tracking-[0.18em] mb-1 text-center"
                    style={{ color: accentFor(2) }}
                  >
                    03
                  </div>
                  <div
                    className="w-6 h-6 mx-auto flex items-center justify-center"
                    aria-hidden="true"
                    style={{ background: `${accentFor(2)}22`, border: `1px solid ${accentFor(2)}55` }}
                  >
                    <div className="w-2 h-2" style={{ background: c.accentBg }} />
                  </div>
                </div>
                <div className="mt-1.5 text-center leading-tight" style={{ minWidth: 64 }}>
                  <p
                    className="text-[10px] font-semibold tracking-tight"
                    style={{ color: c.textOnInverse, opacity: 0.75 }}
                  >
                    Ombiga
                  </p>
                  <p
                    className="text-[9px] uppercase tracking-[0.1em]"
                    style={{ color: c.textOnInverse, opacity: 0.3 }}
                  >
                    Agents & Containers
                  </p>
                </div>
              </button>
              <button
                className="flex flex-col items-center cursor-default focus:outline-none"
                aria-label="Oshitoo — Delivery"
                style={{ position: "absolute", left: "50%", top: "84%", zIndex: 5 }}
                data-onganda-enter=""
              >
                <div style={{ background: c.inverse, border: `2px solid ${c.accentHoverBg}`, padding: "6px 8px", transition: "background 0.18s, border-color 0.18s, box-shadow 0.18s", boxShadow: "none" }}>
                  <div
                    className="text-[9px] font-bold uppercase tracking-[0.18em] mb-1 text-center"
                    style={{ color: c.textOnInverse }}
                  >
                    05
                  </div>
                  <div
                    className="w-6 h-6 mx-auto flex items-center justify-center"
                    aria-hidden="true"
                    style={{ background: `${accentFor(4)}22`, border: `1px solid ${accentFor(4)}55` }}
                  >
                    <div className="w-2 h-2" style={{ background: c.accentHoverBg }} />
                  </div>
                </div>
                <div className="mt-1.5 text-center leading-tight" style={{ minWidth: 64 }}>
                  <p
                    className="text-[10px] font-semibold tracking-tight"
                    style={{ color: c.textOnInverse, opacity: 0.75 }}
                  >
                    Oshitoo
                  </p>
                  <p
                    className="text-[9px] uppercase tracking-[0.1em]"
                    style={{ color: c.textOnInverse, opacity: 0.3 }}
                  >
                    Applications & Sector Products
                  </p>
                </div>
              </button>
              <button
                className="flex flex-col items-center cursor-default focus:outline-none"
                aria-label="Etiti — Surface"
                style={{ position: "absolute", left: "22%", top: "66%", zIndex: 5 }}
                data-onganda-enter=""
              >
                <div style={{ background: c.inverse, border: `2px solid ${c.actionHoverBg}`, padding: "6px 8px", transition: "background 0.18s, border-color 0.18s, box-shadow 0.18s", boxShadow: "none" }}>
                  <div
                    className="text-[9px] font-bold uppercase tracking-[0.18em] mb-1 text-center"
                    style={{ color: c.textOnInverse }}
                  >
                    04
                  </div>
                  <div
                    className="w-6 h-6 mx-auto flex items-center justify-center"
                    aria-hidden="true"
                    style={{ background: `${accentFor(3)}22`, border: `1px solid ${accentFor(3)}55` }}
                  >
                    <div className="w-2 h-2" style={{ background: c.actionHoverBg }} />
                  </div>
                </div>
                <div className="mt-1.5 text-center leading-tight" style={{ minWidth: 64 }}>
                  <p
                    className="text-[10px] font-semibold tracking-tight"
                    style={{ color: c.textOnInverse, opacity: 0.75 }}
                  >
                    Etiti
                  </p>
                  <p
                    className="text-[9px] uppercase tracking-[0.1em]"
                    style={{ color: c.textOnInverse, opacity: 0.3 }}
                  >
                    Interfaces & Dashboards
                  </p>
                </div>
              </button>
              <button
                className="flex flex-col items-center cursor-default focus:outline-none"
                aria-label="Okaanda — Lab Root"
                style={{ position: "absolute", left: "22%", top: "36%", zIndex: 5 }}
                data-onganda-enter=""
              >
                <div style={{ background: c.inverse, border: `2px solid ${c.actionBg}`, padding: "6px 8px", transition: "background 0.18s, border-color 0.18s, box-shadow 0.18s", boxShadow: "none" }}>
                  <div
                    className="text-[9px] font-bold uppercase tracking-[0.18em] mb-1 text-center"
                    style={{ color: accentFor(0) }}
                  >
                    ROOT
                  </div>
                  <div
                    className="w-6 h-6 mx-auto flex items-center justify-center"
                    aria-hidden="true"
                    style={{ background: `${accentFor(0)}22`, border: `1px solid ${accentFor(0)}55` }}
                  >
                    <div className="w-2 h-2" style={{ background: c.actionBg }} />
                  </div>
                </div>
                <div className="mt-1.5 text-center leading-tight" style={{ minWidth: 64 }}>
                  <p
                    className="text-[10px] font-semibold tracking-tight"
                    style={{ color: c.textOnInverse, opacity: 0.75 }}
                  >
                    Okaanda
                  </p>
                  <p
                    className="text-[9px] uppercase tracking-[0.1em]"
                    style={{ color: c.textOnInverse, opacity: 0.3 }}
                  >
                    Parent Institution
                  </p>
                </div>
              </button>
            </div>
          </div>
        </div>
        <AnnotationPanel
          annotations={[{ label: "Root", note: "Parent brand and institutional identity. All sub-systems live under this mark." }, { label: "Tag", note: "Two-digit pixel tag for ordering, versioning, and spec references." }, { label: "Oshiwambo", note: "Primary name. Always leads in product, UI, and documentation contexts." }, { label: "English", note: "Secondary name. Provides functional clarity for external audiences." }, { label: "Role", note: "One-line functional description of what the system does architecturally." }, { label: "Color", note: "Each system carries its material color through iconography and accents only." }]}
          rules={[{ rule: "Pixel by default: icon, diagram, texture, mark." }, { rule: "Non-pixel by default: body, reading layout, dense interface." }, { rule: "Stepped corners, not rounded, for brand assets." }, { rule: "Texture on grounds, solid lines everywhere else — no dotted rules." }, { rule: "Typography stays clean so pixel elements breathe." }]}
        />
      </div>
      <CodeSnippetBlock
        label="DiagramNode · System Connections"
        lines={[{ type: "comment", text: "// System Connections — render a connection map" }, { type: "import", text: "import { DIAGRAM_NODES, CONNECTION_EDGES } from '@onganda/design-system';" }, { type: "plain", text: "" }, { type: "comment", text: "// A DiagramNode entry" }, { type: "plain", text: "const node = {" }, { type: "prop", text: "  id: 'Okaanda', label: 'Okaanda', sublabel: 'Granary'," }, { type: "prop", text: `  hex: '${c.actionBg}', tag: '01', cx: 50, cy: 16,` }, { type: "plain", text: "};" }, { type: "plain", text: "" }, { type: "comment", text: "// A ConnectionEdge entry" }, { type: "plain", text: "const edge = {" }, { type: "prop", text: "  from: 'Okaanda', to: 'Oshini'," }, /* …2 more */]}
        accentHex={c.accentBg}
      />
    </section>
  );
}
