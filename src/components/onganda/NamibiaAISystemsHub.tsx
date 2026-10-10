// ─── Onganda — Namibia AI Systems Hub ────────────────────────────────────────
// Top-level page component. Composes sections and primitives from the
// Onganda design system. All tokens live in onganda-tokens.ts,
// all atomic primitives in onganda-primitives.tsx,
// all page sections in onganda-sections.tsx.

import React, { Suspense, lazy, useState } from 'react';
import { motion } from 'framer-motion';
import { COLOR, WEAVE, SYSTEMS, SWATCHES, PRINCIPLES, PALETTE, PALETTES, activePalette, type PaletteName } from './onganda-tokens';
import { PixelTabs } from './onganda-patterns';
import { PixelLabCard } from './onganda-site';
import { DarkContext, SectionHeader, WeaveOverlay, SystemCard, StatCard, SwatchChip, PrincipleRow, PixelButton, OngandaFooter } from './onganda-primitives';
import { OngandaNav, OngandaHero, ResearchSignals, PixelTerminal, SystemConnectionDiagram, PixelHeatmap, RoadmapTimeline, FieldApplications, PixelFlowchart, IconShowcase, IconFactoryLab, ControlStandards, ProductPatterns, ProductSurface, ExpressiveRange } from './onganda-sections';
import { ChartGallery } from './onganda-charts';
import { NAMIBIA_MAP_POINTS, NAMIBIA_MAP_ROUTES } from './onganda-map-data';
import { OngandaMap } from './onganda-maps';
import { Publications } from './onganda-publications';
import { DocumentEditor } from './onganda-document-editor';
import { SlideEditor } from './onganda-slide-editor';
// Loaded after the hub: it reads the whole design-system namespace, which
// includes this module, so a static import is a load-order cycle.
const CopyCodeInspector = lazy(() => import('../../showcase-tools/CopyCodeInspector').then(m => ({ default: m.CopyCodeInspector })));

// The palette in use — chosen by ?palette= (palette-boot.ts). Read at render.
const activePaletteName = () => (Object.keys(PALETTES) as PaletteName[]).find(name => PALETTES[name] === activePalette()) ?? 'onganda';

// ─── Main export ──────────────────────────────────────────────────────────────
export const NamibiaAISystemsHub = () => {
  const [isDark, setIsDark] = useState(false);
  const toggle = () => setIsDark(d => !d);
  const [view, setView] = useState<'hub' | 'document' | 'slides'>('hub');
  const bg = isDark ? COLOR.darkBg : COLOR.milletClay;
  const fg = isDark ? COLOR.milletClay : COLOR.charBlack;

  // Editor views render outside the hub scroll so they get the full viewport
  if (view === 'document') {
    return <DarkContext.Provider value={{
      isDark,
      toggle
    }}>
        <DocumentEditor onClose={() => setView('hub')} />
      </DarkContext.Provider>;
  }
  if (view === 'slides') {
    return <DarkContext.Provider value={{
      isDark,
      toggle
    }}>
        <SlideEditor onClose={() => setView('hub')} />
      </DarkContext.Provider>;
  }
  return <DarkContext.Provider value={{
    isDark,
    toggle
  }}>
      <div data-onganda-showcase="" className="min-h-screen selection:bg-(--onganda-action-bg) selection:text-(--onganda-action-fg)" style={{
      fontFamily: 'Inter, Arial, sans-serif',
      background: bg,
      color: fg,
      transition: 'background 0.35s, color 0.35s'
    }}>
        {/* ── Navigation ── */}
        <OngandaNav />

        {/* ── Hero ── */}
        <OngandaHero />

        {/* ── Research Signals stats bar ── */}
        <ResearchSignals />

        {/* ── Systems grid ── */}
        <section id="systems" className="max-w-7xl mx-auto px-6 pb-24 md:px-12 pt-16">
          <SectionHeader label="System Architecture" headline="Five tools. One workshop." accent={COLOR.mahanguGold} isDark={isDark} />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {SYSTEMS.map((sys, idx) => <SystemCard key={sys.name} sys={sys} idx={idx} />)}

            {/* Institute promo card */}
            <PixelLabCard
              tag="Institute"
              title="The Institute"
              accent={COLOR.ochreOrange}
              footer={
                // isDark: the button sits on the inverse card, so it takes the
                // dark role set — see DESIGN_SYSTEM.md §5.
                <PixelButton variant="accent" isDark className="relative self-start">Read the manifesto</PixelButton>
              }
            >
              A science and technology park driving applied research, piloting, and technology transfer. Sovereign AI infrastructure for Namibia.
            </PixelLabCard>
          </div>
        </section>

        {/* ── Developer Terminal ── */}
        <PixelTerminal />

        {/* ── System Connection Diagram ── */}
        <SystemConnectionDiagram />

        {/* ── Material Palette ── */}
        <section id="palette" className="max-w-7xl mx-auto px-6 pb-24 md:px-12">
          <SectionHeader label="Material Palette" headline={activePalette() === PALETTES.onganda ? 'Millet, clay, bark, smoke, ochre.' : PALETTE.description.split('. ')[0] + '.'} accent={COLOR.ochreOrange} isDark={isDark}
            actions={<PixelTabs label="Palette" isDark={isDark} value={activePaletteName()}
              tabs={(Object.keys(PALETTES) as PaletteName[]).map(name => ({ value: name, label: PALETTES[name].label }))}
              onChange={name => {
                // Reload in the new palette: what is already rendered keeps the colours it was drawn with.
                const url = new URL(location.href);
                if (name === 'onganda') url.searchParams.delete('palette'); else url.searchParams.set('palette', name);
                location.assign(url);
              }} />} />
          <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-9 gap-2">
            {SWATCHES.map(sw => <SwatchChip key={sw.name} swatch={sw} />)}
          </div>
        </section>

        {/* ── Control Standards — buttons, fields, choice controls, colour roles ── */}
        <ControlStandards />

        {/* ── Product Patterns — dialog, table, notice, empty, loading, tabs ── */}
        <ProductPatterns />
        <ProductSurface />
        <ExpressiveRange />

        {/* ── Research Heatmap ── */}
        <PixelHeatmap />

        {/* ── Chart Gallery ── */}
        <ChartGallery />

        {/* ── Geospatial surface ── */}
        <div id="maps" className="max-w-7xl mx-auto px-6 pb-24 md:px-12">
          <OngandaMap
            points={NAMIBIA_MAP_POINTS}
            routes={NAMIBIA_MAP_ROUTES}
            label="Geospatial surface"
            title="A map that belongs to the system."
            description="An illustrative Namibia-wide network showing how place, data, and field operations can share one visual language."
            ariaLabel="Illustrative map of capability signals across Namibia"
          />
        </div>

        {/* ── Roadmap Timeline ── */}
        <RoadmapTimeline />

        {/* ── Brand Principles ── */}
        <section id="language" className="max-w-7xl mx-auto px-6 pb-24 md:px-12">
          <SectionHeader label="Brand Principles" headline="Pixelated by design. Oshiwambo by name." accent={COLOR.dyePlum} isDark={isDark} />
          <dl className="divide-y divide-(--onganda-line)">
            {PRINCIPLES.map((p, i) => <PrincipleRow key={p.label} principle={p} idx={i} />)}
          </dl>
        </section>

        {/* ── Icon Bank ── */}
        <IconShowcase />

        {/* ── Icon Factory — live pixel editor ── */}
        <IconFactoryLab />

        {/* ── Naming ladder ── */}
        <section className="max-w-7xl mx-auto px-6 pb-32 md:px-12">
          <div className="bg-(--onganda-surface) border border-(--onganda-line) p-8 md:p-12">
            <div className="flex flex-col md:flex-row md:items-start gap-10 md:gap-0">
              <div className="md:w-1/3 shrink-0">
                <h2 className="text-xs font-bold uppercase tracking-[0.15em] text-(--onganda-text-muted) mb-3">Naming Hierarchy</h2>
                <p className="text-2xl font-medium tracking-tight text-(--onganda-text) leading-snug">
                  One parent.<br />Five tools.<br />One direction.
                </p>
                <p className="mt-4 text-sm text-(--onganda-text-muted) leading-relaxed max-w-xs">
                  Names pending final validation with fluent Oshikwanyama / Oshindonga speakers and community-informed partners before lock.
                </p>
              </div>
              <div className="flex-1">
                <div className="flex flex-col gap-0">
                  <div className="flex items-center gap-4 py-4 border-b border-(--onganda-line)">
                    <div className="w-2 h-8 bg-(--onganda-accent-1) shrink-0" aria-hidden="true" />
                    <div>
                      <p className="text-lg font-semibold text-(--onganda-text) tracking-tight leading-none">Onganda</p>
                      <p className="text-xs text-(--onganda-text-muted) mt-0.5">Parent brand · Namibia Applied AI Lab</p>
                    </div>
                  </div>
                  {SYSTEMS.map((sys, i) => <div key={`nl-${sys.name}`} className="flex items-center gap-4 py-3.5 border-b border-(--onganda-text)/8 pl-6">
                      <div className="w-1.5 h-6 shrink-0" style={{
                    background: sys.borderHex,
                    opacity: 0.7
                  }} aria-hidden="true" />
                      <div className="flex-1 flex flex-col sm:flex-row sm:items-baseline sm:gap-4">
                        <p className="text-base font-semibold text-(--onganda-text) tracking-tight leading-none">{sys.name}</p>
                        <p className="text-xs text-(--onganda-text-muted) mt-0.5 sm:mt-0">
                          <span className="text-(--onganda-text-muted)">{sys.english}</span>
                          <span className="mx-1.5">·</span>
                          <span>{sys.role}</span>
                        </p>
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-(--onganda-text-muted)">{String(i + 1).padStart(2, '0')}</span>
                    </div>)}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Field Applications ── */}
        <FieldApplications />

        {/* ── Publications — Document & Presentation authoring ── */}
        <Publications onOpenDocument={() => setView('document')} onOpenSlides={() => setView('slides')} />

        {/* ── Brand Guide — Pixel Flowchart ── */}
        <PixelFlowchart />

        {/* ── Footer ── */}
        <OngandaFooter />

        {/* ── Copy code: every section and element, as consumer code ── */}
        <Suspense fallback={null}><CopyCodeInspector /></Suspense>
      </div>
    </DarkContext.Provider>;
};
