import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AUTOMATED } from './onganda-motion';
import {
  COLOR,
  roles,
  inkOn,
  SYSTEMS,
  STATS,
  PRINCIPLES,
  SECTOR_APPS,
  TIMELINE_PHASES,
  TERMINAL_BLOCKS,
  CONNECTION_EDGES,
  DIAGRAM_NODE_TOOLTIPS,
  TerminalBlock,
  inkAlpha,
  paperAlpha
} from './onganda-tokens';
import {
  DarkContext,
  FieldAppCard,
  ICON_SIZE,
  OngandaFooter,
  OngandaLogoMark,
  PixelButton,
  PixelCornerMarks,
  PixelDot,
  PixelField,
  PixelIconTile,
  PixelInput,
  PixelTag,
  PixelTextarea,
  PrincipleRow,
  SectionHeader,
  TerminalCard,
  WeaveOverlay,
  systemIconForName
} from './onganda-primitives';
import {
  PixelNotice,
  PixelPanel,
  PixelProgress,
  PixelStepLine,
  PixelTabs
} from './onganda-patterns';
import {
  PixelTicker,
  PixelFocusRow,
  PixelLabCard,
  PixelContactPanel,
  PixelEdgeStrips,
  PixelStatBand
} from './onganda-site';
import {
  IconArrowRight,
  IconCheck,
  IconClose,
  IconDatabase,
  IconDashboard,
  IconLayers,
  IconMail,
  IconMenu,
  IconPackage,
  IconTarget,
  IconTerminal,
  IconUsers
} from './onganda-icons';
import { TYPE, SPACE_SCALE, TEXTURE } from './onganda-type';
import { followPalette } from './onganda-colors';

export type PublicPage = 'home' | 'full';

const BRAND = 'Onganda';
const LAB_LABEL = 'Applied AI lab for services';
const TONE = followPalette(() => ({
  muted: inkAlpha(0.66),
  quiet: inkAlpha(0.66),
  line: inkAlpha(0.10),
  darkLine: paperAlpha(0.10)
}));

const fullSiteAnchors = [
  { href: '#why', label: 'Why Onganda' },
  { href: '#building', label: 'Architecture' },
  { href: '#focus', label: 'Projects' },
  { href: '#contact', label: 'Contact' }
];

interface LiveProject {
  name: string;
  oshiwambo: string;
  sector: string;
  desc: string;
  hex: string;
  tag: string;
  statusLabel: string;
  href?: string;
  openBot?: boolean;
}

const LIVE_PROJECTS: LiveProject[] = followPalette(() => ([
  {
    name: 'Olupale',
    oshiwambo: 'Oshitoo',
    sector: 'Financial Integrity',
    desc: 'Political-exposure, sanctions, and adverse-media screening for Namibian institutions, with published evidence behind every claim.',
    hex: COLOR.ochreOrange,
    tag: 'P–01',
    statusLabel: 'Open Olupale',
    href: 'https://olupale.kennethmwandingi.workers.dev/'
  },
  {
    name: 'Oshipale',
    oshiwambo: 'Oshitoo',
    sector: 'Document Integrity',
    desc: 'Checks payslips and bank statements for alterations and cross-lender contradictions without institutions sharing raw records.',
    hex: COLOR.barkRust,
    tag: 'P–02',
    statusLabel: 'Open Oshipale',
    href: 'https://oshipale.kennethmwandingi.workers.dev/'
  },
  {
    name: 'Namibia Services',
    oshiwambo: 'Etiti',
    sector: 'Public Services',
    desc: 'Answers questions on visas, permits, licences, business registration, and tax in plain English with cited official sources.',
    hex: COLOR.mahanguGold,
    tag: 'P–03',
    statusLabel: 'Ask the assistant',
    openBot: true
  },
  {
    name: 'Clip Studio',
    oshiwambo: 'Oshini',
    sector: 'Media & Creator Tools',
    desc: 'Turns long-form talks and recordings into finished short clips with transcript selection and framing.',
    hex: COLOR.dyePlum,
    tag: 'P–04',
    statusLabel: 'Open Clip Studio',
    href: 'https://clip-studio.kennethmwandingi.workers.dev/'
  }
]));

const focusItems = followPalette(() => ([
  { icon: IconDatabase, sys: 'Okaanda', label: 'Adapt models', body: 'Select, adapt, evaluate, and organize models for local use.', hex: COLOR.ochreOrange },
  { icon: IconTerminal, sys: 'Oshini', label: 'Run workflows', body: 'Build repeatable adaptation and deployment paths.', hex: COLOR.barkRust },
  { icon: IconPackage, sys: 'Ombiga', label: 'Hold systems', body: 'Package agents, memory, and runtimes into portable units.', hex: COLOR.mahanguGold },
  { icon: IconDashboard, sys: 'Etiti', label: 'Shape interfaces', body: 'Create surfaces where people can inspect and control systems.', hex: COLOR.mopaneBrown },
  { icon: IconTarget, sys: 'Oshitoo', label: 'Deliver tools', body: 'Move from internal stack to pilots and sector-facing products.', hex: COLOR.dyePlum }
]));

const COMPOUND_STEPS = [
  { title: 'Okaanda · Store', note: 'The granary holds corpora, evaluations, and model weights in readiness.', icon: IconDatabase },
  { title: 'Oshini · Grind', note: 'The mill refines raw models through fine-tuning and distillation.', icon: IconTerminal },
  { title: 'Ombiga · Hold', note: 'The vessel packages adapted models, memory, and agent runtimes to travel.', icon: IconPackage },
  { title: 'Etiti · Set down', note: 'The woven surface turns agent capability into workspaces and dashboards.', icon: IconDashboard },
  { title: 'Oshitoo · Serve', note: 'The delivery vessel brings sector tools to clinics, farms, and schools.', icon: IconTarget }
];

const OMBIGA_TERMINAL: TerminalBlock = followPalette(() => ({
  title: 'Ombiga — Agent Container',
  tag: '03',
  tagHex: COLOR.mahanguGold,
  lines: [
    { type: 'comment', text: '# Ombiga · portable agent runtime' },
    { type: 'comment', text: '# package adapted model + local memory' },
    { type: 'plain', text: '' },
    { type: 'keyword', text: 'from' },
    { type: 'plain', text: ' ombiga.container ' },
    { type: 'keyword', text: 'import' },
    { type: 'plain', text: ' VesselRuntime' },
    { type: 'plain', text: '' },
    { type: 'plain', text: 'vessel = VesselRuntime(' },
    { type: 'plain', text: '    checkpoint=' },
    { type: 'string', text: '"oshini/namibia-instruct-1b"' },
    { type: 'plain', text: ',' },
    { type: 'plain', text: '    memory=' },
    { type: 'string', text: '"okaanda://civic-kb-v2"' },
    { type: 'plain', text: ',' },
    { type: 'plain', text: '    offline=' },
    { type: 'accent', text: 'True' },
    { type: 'plain', text: ')' },
    { type: 'plain', text: '' },
    { type: 'plain', text: 'vessel.serve(port=' },
    { type: 'accent', text: '8080' },
    { type: 'plain', text: ')' }
  ]
}));

const fadeUp = {
  initial: AUTOMATED ? false as const : { opacity: 0, y: 16 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-40px' },
  transition: { duration: 0.45 }
};

const PublicNav = ({ page: _page }: { page: PublicPage }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <nav className="sticky top-0 z-50 w-full border-b" style={{
      background: COLOR.milletClay,
      borderColor: TONE.line
    }}>
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 md:px-12">
        <a href="/" className="flex items-center gap-3 no-underline" style={{ color: COLOR.charBlack }}>
          <OngandaLogoMark size={24} />
          <div>
            <p className="text-sm font-semibold leading-none">{BRAND}</p>
            <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.16em]" style={{ color: TONE.quiet }}>{LAB_LABEL}</p>
          </div>
        </a>
        <div className="hidden items-center gap-1 md:flex">
          {fullSiteAnchors.map(item => (
            <a
              key={item.href}
              href={item.href}
              data-onganda-underline=""
              className="px-3 py-2 text-xs font-bold uppercase tracking-[0.12em] no-underline"
              style={{ color: TONE.quiet }}
            >
              {item.label}
            </a>
          ))}
        </div>
        <motion.button
          whileTap={{ scale: 0.94 }}
          onClick={() => setMenuOpen(open => !open)}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
          className="flex items-center justify-center border p-2 md:hidden"
          style={{ background: 'transparent', borderColor: TONE.line, color: COLOR.charBlack, cursor: 'pointer' }}
        >
          {menuOpen ? <IconClose size={24} /> : <IconMenu size={24} />}
        </motion.button>
      </div>
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="overflow-hidden border-t md:hidden"
            style={{ borderColor: TONE.line }}
          >
            <div className="flex flex-col px-6 py-3">
              {fullSiteAnchors.map(item => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-3 py-2.5 text-xs font-bold uppercase tracking-[0.14em] no-underline"
                  style={{ color: TONE.quiet }}
                >
                  <PixelDot color={COLOR.barkRust} size={4} />
                  {item.label}
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const PublicShell = ({ page, children }: { page: PublicPage; children: React.ReactNode }) => (
  <DarkContext.Provider value={{ isDark: false, toggle: () => {} }}>
    <div className="min-h-screen" style={{ background: COLOR.milletClay, color: COLOR.charBlack, fontFamily: 'Inter, Arial, sans-serif' }}>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:px-4 focus:py-2 focus:text-xs focus:font-bold focus:uppercase focus:tracking-[0.14em]"
        style={{ background: COLOR.charBlack, color: COLOR.milletClay }}
      >
        Skip to content
      </a>
      <PublicNav page={page} />
      <main id="main">{children}</main>
    </div>
  </DarkContext.Provider>
);

const PublicHero = ({
  tag,
  line1,
  line2,
  line3,
  body,
  primary,
  secondary,
  withStats = false
}: {
  tag: string;
  line1: string;
  line2: string;
  line3: string;
  body: string;
  primary: { label: string; href: string };
  secondary?: { label: string; href: string };
  withStats?: boolean;
}) => (
  <header className="relative flex min-h-[calc(100svh-65px)] flex-col items-center justify-center overflow-hidden">
    <WeaveOverlay opacity={0.026} />
    <PixelEdgeStrips hexes={[COLOR.ochreOrange, COLOR.barkRust, COLOR.mahanguGold, COLOR.mopaneBrown, COLOR.dyePlum, COLOR.firedRed]} />

    <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col items-center px-6 pt-16 text-center md:px-12">
      <div className="mb-7 flex flex-wrap items-center justify-center gap-3">
        <PixelTag hex={COLOR.ochreOrange} label={tag} />
        <span className="text-xs font-bold uppercase tracking-[0.18em]" style={{ color: TONE.quiet }}>
          {LAB_LABEL} · Windhoek, Namibia
        </span>
      </div>
      <h1 className="flex max-w-6xl flex-col items-center text-center font-bold" style={{ color: COLOR.charBlack, fontSize: 'var(--type-hero-public)', lineHeight: 1.06 }}>
        {[line1, line2, line3].map((line, index) => (
          <span key={line} className="block overflow-hidden" style={{ paddingBottom: '0.08em' }}>
            <motion.span
              className="block"
              initial={AUTOMATED ? false : { y: '105%', opacity: 0 }}
              animate={{ y: '0%', opacity: 1 }}
              transition={{ duration: 0.72, delay: 0.08 + index * 0.12, ease: [0.16, 1, 0.3, 1] }}
              style={{ color: index === 2 ? roles(false).accentInk : COLOR.charBlack }}
            >
              {line}
            </motion.span>
          </span>
        ))}
      </h1>
    </div>
    {/* Full-bleed system ticker — the legend for the five systems below */}
    <PixelTicker className="relative z-10 mt-6 md:mt-8" />
    <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col items-center px-6 pb-16 text-center md:px-12">
      <p className="mt-8 max-w-2xl text-base leading-relaxed md:text-lg" style={{ color: TONE.muted }}>{body}</p>
      <div className="mt-9 flex flex-wrap justify-center gap-3">
        <PixelButton href={primary.href}>
          {primary.label}<IconArrowRight size={12} />
        </PixelButton>
        {secondary && (
          <PixelButton href={secondary.href} variant="ghost">
            {secondary.label}<IconArrowRight size={12} />
          </PixelButton>
        )}
      </div>
      <div className="mt-8 flex gap-1" aria-hidden="true">
        {[COLOR.ochreOrange, COLOR.firedRed, COLOR.mahanguGold, COLOR.barkRust, COLOR.mopaneBrown].map((hex, i) => (
          <PixelDot key={i} color={hex} size={8} opacity={0.45} />
        ))}
      </div>
      {withStats && (
        <div className="mt-14 w-full text-left">
          <div className="hidden lg:block">
            <PixelStatBand stats={STATS} columns={4} />
          </div>
          <div className="lg:hidden">
            <PixelStatBand stats={STATS} columns={2} />
          </div>
        </div>
      )}
    </div>
  </header>
);

const SystemsGrid = ({ detailed = false }: { detailed?: boolean }) => (
  <section id="systems" className="mx-auto max-w-7xl px-6 pb-24 md:px-12">
    <SectionHeader label="Systems" headline="Five systems. One compound." accent={COLOR.mahanguGold} />
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {SYSTEMS.map((sys, index) => (
        <motion.article
          key={sys.name}
          {...fadeUp}
          whileHover={{ y: -4 }}
          className="relative flex min-h-[320px] flex-col border p-8"
          style={{ background: COLOR.dustLight, borderColor: TONE.line }}
        >
          <WeaveOverlay opacity={0.035} />
          <div className="relative mb-8 flex items-start justify-between">
            <div className="border p-3" style={{ borderColor: `${sys.borderHex}40`, background: `${sys.borderHex}14` }}>
              {systemIconForName(sys.name, 48)}
            </div>
            <PixelTag hex={sys.borderHex} label={String(index + 1).padStart(2, '0')} />
          </div>
          <div className="relative">
            <h3 className="text-2xl font-semibold">{sys.name}</h3>
            <p className="mt-1 text-sm font-medium" style={{ color: TONE.muted }}>{sys.english}</p>
            <p className="mt-5 text-xs font-bold uppercase tracking-[0.15em]" style={{ color: TONE.quiet }}>{sys.role}</p>
            <p className="mt-4 text-sm leading-relaxed" style={{ color: TONE.muted }}>{detailed ? sys.long : sys.line}</p>
          </div>
          <div className="absolute left-0 top-0 h-full w-[3px]" style={{ background: sys.borderHex }} aria-hidden="true" />
        </motion.article>
      ))}
      <PixelLabCard
        tag="Lab"
        title={BRAND}
        accent={COLOR.ochreOrange}
        footer={<IconCheck size={24} color={COLOR.ochreOrange} />}
      >
        {detailed
          ? 'The compound exists so the five systems work together rather than become isolated prototypes.'
          : 'Five systems working as one compound: from readiness to delivery.'}
      </PixelLabCard>
    </div>
  </section>
);

const SignalBand = ({ expanded = false }: { expanded?: boolean }) => {
  const dark = roles(true);
  return (
    <section id="why" className="mx-auto max-w-7xl px-6 pb-24 pt-12 md:px-12">
      <div className="grid gap-4 lg:grid-cols-[0.95fr_1.05fr]">
        <motion.div
          {...fadeUp}
          whileHover={{ y: -3 }}
          className="relative flex flex-col justify-between overflow-hidden p-8 md:p-10"
          style={{ background: COLOR.charBlack, color: COLOR.milletClay }}
        >
          <WeaveOverlay isDark opacity={0.055} />
          <PixelCornerMarks hex={COLOR.ochreOrange} size={8} />
          <div className="relative">
            <PixelTag hex={COLOR.ochreOrange} label="Why Onganda" isDark />
            <h2 className="mt-8 max-w-xl text-3xl font-semibold leading-tight md:text-5xl">
              Namibia should not only consume AI. It should be able to shape it.
            </h2>
            <p className="mt-6 max-w-lg text-sm leading-relaxed md:text-base" style={{ color: dark.textMuted }}>
              AI is becoming part of public infrastructure: how knowledge is handled, how decisions are supported, and how services reach citizens.
            </p>
            {expanded && (
              <p className="mt-4 max-w-lg text-sm leading-relaxed md:text-base" style={{ color: dark.textMuted }}>
                Without domestic capability, countries remain dependent on outside providers for model choices, language support, evaluation standards, and deployment decisions. {BRAND} is building that missing layer.
              </p>
            )}
          </div>
          <div className="relative mt-10 border-t pt-6" style={{ borderColor: dark.line }}>
            <p className="mb-3 uppercase" style={{ fontSize: TYPE.micro.size, fontWeight: TYPE.micro.weight, letterSpacing: TYPE.micro.tracking, color: dark.textMuted }}>
              Sovereign stack coverage
            </p>
            <div className="flex flex-wrap gap-3">
              {SYSTEMS.map(sys => (
                <span key={sys.name} className="inline-flex items-center gap-2 border px-2.5 py-1" style={{ borderColor: sys.borderHex, background: `${sys.borderHex}18` }}>
                  <PixelDot color={sys.borderHex} size={5} />
                  <span style={{ fontSize: TYPE.micro.size, fontWeight: TYPE.ui.weight, color: COLOR.milletClay }}>
                    {sys.name}
                  </span>
                </span>
              ))}
            </div>
          </div>
        </motion.div>
        <div className="grid gap-4 sm:grid-cols-2">
          {focusItems.slice(0, 4).map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.article
                key={item.label}
                {...fadeUp}
                whileHover={{ y: -3 }}
                className="relative flex flex-col justify-between border p-6"
                style={{ background: COLOR.dustLight, borderColor: TONE.line }}
              >
                <PixelCornerMarks hex={item.hex} size={7} />
                <div>
                  <div className="mb-8 flex items-center justify-between">
                    <PixelTag hex={item.hex} label={String(index + 1).padStart(2, '0')} />
                    <Icon size={24} color={item.hex} />
                  </div>
                  <h3 className="text-lg font-semibold leading-tight">{item.label}</h3>
                  <p className="mt-4 text-sm leading-relaxed" style={{ color: TONE.muted }}>{item.body}</p>
                </div>
                <div className="mt-6 flex items-center gap-2 border-t pt-3" style={{ borderColor: TONE.line }}>
                  <PixelDot color={item.hex} size={6} />
                  <span className="uppercase" style={{ fontSize: TYPE.micro.size, fontWeight: TYPE.micro.weight, letterSpacing: TYPE.micro.tracking, color: TONE.quiet }}>
                    {item.sys}
                  </span>
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
};

/** Interactive architectural walkthrough for the Full Site (#building). */
const CompoundArchitectureBand = () => {
  const [selectedName, setSelectedName] = useState<string>(SYSTEMS[0].name);
  const c = roles(false);
  const dark = roles(true);
  const activeSys = SYSTEMS.find(s => s.name === selectedName) ?? SYSTEMS[0];
  const activeIdx = SYSTEMS.findIndex(s => s.name === activeSys.name);
  const tooltip = DIAGRAM_NODE_TOOLTIPS[activeSys.name];
  const edges = CONNECTION_EDGES.filter(e => e.from === activeSys.name || e.to === activeSys.name);

  return (
    <section id="building" data-onganda-enter="" className="mx-auto max-w-7xl px-6 pb-24 md:px-12">
      <SectionHeader
        label="What we are building"
        headline="From raw grain to the last pour of intelligence."
        accent={COLOR.barkRust}
      />

      <div className="mb-10 grid gap-6 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
        <p style={{ margin: 0, fontSize: TYPE.lead.size, lineHeight: TYPE.lead.lineHeight, color: c.textBody }}>
          {BRAND} borrows its architecture from traditional Oshiwambo agricultural and domestic life. The compound processes data and models the way a homestead processes mahangu grain: from storage in the granary, to grinding at the mill, to holding in the vessel, to the woven surface where work meets the hand, and finally to delivery.
        </p>
        <div className="border p-5" style={{ background: c.surface, borderColor: c.line }}>
          <div className="flex items-center justify-between gap-3">
            <span className="uppercase" style={{ fontSize: TYPE.eyebrow.size, fontWeight: TYPE.eyebrow.weight, letterSpacing: TYPE.eyebrow.tracking, color: c.textMuted }}>
              Compound flow
            </span>
            <PixelTag hex={COLOR.barkRust} label="5 stages" />
          </div>
          <p style={{ margin: `${SPACE_SCALE['3']}px 0 0`, fontSize: TYPE.caption.size, lineHeight: TYPE.caption.lineHeight, color: c.textMuted }}>
            Each system hands its output to the next. No model sits on a shelf without a path to a container, an interface, and a field deployment.
          </p>
        </div>
      </div>

      {/* The 5-step pixel sequence with staircase connectors */}
      <div className="mb-10 border p-6 md:p-8" style={{ background: c.surface, borderColor: c.line }}>
        <PixelStepLine label="How intelligence moves through the Onganda compound" steps={COMPOUND_STEPS} />
      </div>

      {/* Interactive System Inspector: tabs + raised detail card + inverse connection card */}
      <div className="mb-5">
        <PixelTabs
          label="Inspect system architecture"
          scrollable
          tabs={SYSTEMS.map((s, i) => ({ value: s.name, label: `0${i + 1} · ${s.name} (${s.english})` }))}
          value={selectedName}
          onChange={setSelectedName}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
        <PixelPanel
          spine
          accent={activeSys.borderHex}
          tag={String(activeIdx + 1).padStart(2, '0')}
          eyebrow={`${activeSys.english} · ${activeSys.role}`}
          title={activeSys.name}
          aside={
            <PixelIconTile hex={activeSys.borderHex}>
              {systemIconForName(activeSys.name, ICON_SIZE.feature)}
            </PixelIconTile>
          }
        >
          <p style={{ margin: 0, fontSize: TYPE.bodyLarge.size, lineHeight: TYPE.bodyLarge.lineHeight, color: c.textBody }}>
            {activeSys.long}
          </p>
          <p style={{ margin: `${SPACE_SCALE['4']}px 0 0`, fontSize: TYPE.body.size, lineHeight: TYPE.body.lineHeight, color: c.textMuted }}>
            {activeSys.desc}
          </p>
        </PixelPanel>

        <div
          className="relative flex flex-col justify-between overflow-hidden border p-6 md:p-8"
          style={{ background: COLOR.charBlack, borderColor: activeSys.borderHex, color: COLOR.milletClay }}
        >
          <WeaveOverlay isDark opacity={TEXTURE.inverse} />
          <PixelCornerMarks hex={activeSys.borderHex} size={8} />
          <div className="relative">
            <div className="flex items-center justify-between gap-3">
              <span className="uppercase" style={{ fontSize: TYPE.eyebrow.size, fontWeight: TYPE.eyebrow.weight, letterSpacing: TYPE.eyebrow.tracking, color: dark.textMuted }}>
                Data &amp; runtime links
              </span>
              <PixelTag hex={activeSys.borderHex} label={activeSys.name} isDark />
            </div>
            <p style={{ margin: `${SPACE_SCALE['4']}px 0 0`, fontSize: TYPE.body.size, lineHeight: TYPE.body.lineHeight, color: dark.textBody }}>
              {tooltip?.desc ?? activeSys.line}
            </p>
            <div className="mt-6 grid gap-2.5">
              {edges.map((edge, idx) => {
                const fromHex = SYSTEMS.find(sys => sys.name === edge.from)?.borderHex ?? edge.color;
                const toHex = SYSTEMS.find(sys => sys.name === edge.to)?.borderHex ?? edge.color;
                return (
                  <div
                    key={`${edge.from}-${edge.to}-${idx}`}
                    className="flex flex-wrap items-center justify-between gap-3 border px-3.5 py-2.5"
                    style={{ borderColor: edge.color, background: `${edge.color}16` }}
                  >
                    <span className="inline-flex items-center gap-2" style={{ fontSize: TYPE.meta.size, fontWeight: TYPE.ui.weight, color: COLOR.milletClay }}>
                      <PixelDot color={fromHex} size={6} />
                      <span>{edge.from}</span>
                      <IconArrowRight size={ICON_SIZE.inline} color={inkOn(edge.color, COLOR.charBlack)} />
                      <PixelDot color={toHex} size={6} />
                      <span>{edge.to}</span>
                    </span>
                    <span className="uppercase" style={{ fontSize: TYPE.micro.size, fontWeight: TYPE.micro.weight, letterSpacing: TYPE.micro.tracking, color: dark.textMuted }}>
                      {edge.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="relative mt-6 flex items-center justify-between border-t pt-4" style={{ borderColor: dark.line }}>
            <span style={{ fontSize: TYPE.caption.size, color: dark.textMuted }}>
              Click any system tab above to trace its connections
            </span>
            <IconLayers size={ICON_SIZE.control} color={inkOn(activeSys.borderHex, COLOR.charBlack)} />
          </div>
        </div>
      </div>
    </section>
  );
};

const TerminalBand = () => {
  const blocks = [...TERMINAL_BLOCKS.slice(0, 2), OMBIGA_TERMINAL];
  return (
    <section id="studio" className="mx-auto max-w-7xl px-6 pb-24 md:px-12">
      <SectionHeader label="Studio" headline="Built like a lab. Run like a startup." accent={COLOR.barkRust} />
      <div className="grid gap-4 lg:grid-cols-3">
        {blocks.map(block => <TerminalCard key={block.title} block={block} />)}
      </div>
    </section>
  );
};

const LiveProjectCard = ({ project, idx }: { project: LiveProject; idx: number }) => {
  const c = roles(false);
  const ink = inkOn(project.hex, c.surface, false);
  const inner = (
    <>
      <div className="mb-6 flex items-start justify-between">
        <PixelTag hex={project.hex} label={project.tag} />
        <div className="flex gap-0.5" aria-hidden="true">
          <div className="h-2 w-2" style={{ background: project.hex, opacity: 0.4 }} />
          <div className="h-2 w-1" style={{ background: project.hex, opacity: 0.2 }} />
        </div>
      </div>
      <h3 className="text-lg font-semibold leading-none tracking-tight" style={{ color: c.text, margin: 0 }}>
        {project.name}
      </h3>
      <p className="mb-4 mt-1.5 text-xs font-medium" style={{ color: c.textMuted }}>
        <span style={{ color: ink }}>{project.oshiwambo}</span>
        <span className="mx-1.5" style={{ color: c.textMuted }}>·</span>
        <span>{project.sector}</span>
      </p>
      <p className="mb-6 text-sm leading-relaxed" style={{ color: c.textMuted }}>
        {project.desc}
      </p>
      <div className="mt-auto flex items-center justify-between gap-2 pt-2">
        <span className="inline-flex items-center gap-1.5">
          <PixelDot color={project.hex} size={6} />
          <span className="text-[10px] font-bold uppercase tracking-[0.15em]" style={{ color: ink }}>
            {project.statusLabel}
          </span>
        </span>
        <IconArrowRight size={ICON_SIZE.inline} color={ink} />
      </div>
      <div className="absolute bottom-0 left-0 top-0 w-[3px]" style={{ background: project.hex }} aria-hidden="true" />
    </>
  );

  if (project.openBot) {
    return (
      <motion.button
        type="button"
        data-project-card="namibia-services"
        initial={AUTOMATED ? false : { opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-30px' }}
        transition={{ delay: idx * 0.09, duration: 0.48 }}
        whileHover={{ y: -3 }}
        onClick={() => {
          window.dispatchEvent(new CustomEvent('namibia-bot:open'));
        }}
        className="onganda-focus relative flex w-full cursor-pointer flex-col overflow-hidden border p-7 text-left"
        style={{ background: c.surface, borderColor: c.line }}
      >
        {inner}
      </motion.button>
    );
  }

  return (
    <motion.a
      href={project.href}
      target="_blank"
      rel="noopener noreferrer"
      data-project-card={project.name.toLowerCase().replace(/\s+/g, '-')}
      initial={AUTOMATED ? false : { opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-30px' }}
      transition={{ delay: idx * 0.09, duration: 0.48 }}
      whileHover={{ y: -3 }}
      className="onganda-focus relative flex flex-col overflow-hidden border p-7 no-underline"
      style={{ background: c.surface, borderColor: c.line, color: c.text }}
    >
      {inner}
    </motion.a>
  );
};

const FocusAndPilotsBand = () => {
  const c = roles(false);
  return (
    <section id="focus" data-onganda-enter="" className="mx-auto max-w-7xl px-6 pb-24 md:px-12">
      <SectionHeader label="Focus & field applications" headline="Where sovereignty becomes practical." accent={COLOR.dyePlum} />
      <div className="grid gap-8 lg:grid-cols-[1fr_1.05fr] lg:items-start">
        <div className="grid gap-3">
          <p style={{ margin: '0 0 8px', fontSize: TYPE.bodyLarge.size, lineHeight: TYPE.bodyLarge.lineHeight, color: c.textBody }}>
            Domestic capability matters when systems can be adapted, tested, deployed, and used directly across financial and public services.
          </p>
          {focusItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <PixelFocusRow
                key={item.label}
                index={index}
                accent={item.hex}
                title={item.label}
                icon={<Icon size={24} color={item.hex} />}
              >
                {item.body}
              </PixelFocusRow>
            );
          })}
        </div>

        <div id="pilots" className="grid gap-4">
          <div className="flex items-center justify-between border-b pb-3" style={{ borderColor: c.line }}>
            <span className="uppercase" style={{ fontSize: TYPE.eyebrow.size, fontWeight: TYPE.eyebrow.weight, letterSpacing: TYPE.eyebrow.tracking, color: c.textMuted }}>
              Current projects in Namibia
            </span>
            <PixelTag hex={COLOR.dyePlum} label="4 live products" />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {LIVE_PROJECTS.map((project, idx) => (
              <LiveProjectCard key={project.tag} project={project} idx={idx} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

const SectorIdeasBand = () => {
  const c = roles(false);
  return (
    <section id="sector-ideas" className="mx-auto max-w-7xl px-6 pb-24 md:px-12">
      <SectionHeader label="Sector ideas" headline="Future sector pilots in Namibia." accent={COLOR.dyePlum} />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4" style={{ borderColor: c.line }}>
        {SECTOR_APPS.map((app, idx) => (
          <FieldAppCard key={app.tag} app={app} idx={idx} />
        ))}
      </div>
    </section>
  );
};

const RoadmapBand = () => {
  const c = roles(false);
  return (
    <section id="roadmap" data-onganda-enter="" className="mx-auto max-w-7xl px-6 pb-24 md:px-12">
      <SectionHeader label="Development roadmap" headline="Phased capability, measured in milestones." accent={COLOR.ochreOrange} />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {TIMELINE_PHASES.map(phase => (
          <article
            key={phase.tag}
            className="relative flex flex-col justify-between border p-6"
            style={{
              background: c.surface,
              borderColor: c.line,
              borderTop: `3px solid ${phase.hex}`
            }}
          >
            <div>
              <div className="mb-5 flex items-center justify-between gap-2">
                <PixelTag hex={phase.hex} label={phase.tag} />
                <span className="uppercase" style={{ fontSize: TYPE.micro.size, fontWeight: TYPE.micro.weight, letterSpacing: TYPE.micro.tracking, color: c.textMuted }}>
                  {phase.period}
                </span>
              </div>
              <h3 style={{ margin: 0, fontSize: TYPE.title.size, fontWeight: TYPE.title.weight, color: c.text }}>
                {phase.oshiwambo}
              </h3>
              <p style={{ margin: '4px 0 0', fontSize: TYPE.caption.size, fontWeight: TYPE.ui.weight, color: c.textMuted }}>
                {phase.english}
              </p>
              <p style={{ margin: '12px 0 0', fontSize: TYPE.caption.size, lineHeight: TYPE.caption.lineHeight, color: c.textBody }}>
                {phase.desc}
              </p>
            </div>

            <div className="mt-6 pt-4" style={{ borderTop: `1px solid ${c.line}` }}>
              <PixelProgress
                value={phase.progress}
                label={phase.status === 'complete' ? 'Complete' : phase.status === 'active' ? 'In progress' : 'Scheduled'}
                status={phase.status === 'complete' ? 'settled' : phase.status === 'active' ? 'active' : 'caution'}
              />
              <ul className="mt-4 grid gap-1.5" style={{ listStyle: 'none', padding: 0, margin: '12px 0 0' }}>
                {phase.milestones.map(ms => (
                  <li key={ms} className="flex items-center gap-2" style={{ fontSize: TYPE.caption.size, color: c.textMuted }}>
                    <PixelDot color={phase.hex} size={5} />
                    <span>{ms}</span>
                  </li>
                ))}
              </ul>
            </div>
          </article>
        ))}
        <PixelLabCard
          tag="2026 Horizon"
          title="Sovereign Delivery"
          accent={COLOR.dyePlum}
          footer={<IconCheck size={24} color={COLOR.mahanguGold} />}
        >
          Every milestone feeds the next: corpus readiness in Okaanda powers adaptation in Oshini, containment in Ombiga, interfaces in Etiti, and field deployments in Oshitoo.
        </PixelLabCard>
      </div>
    </section>
  );
};

const PeopleAndPrinciplesBand = () => {
  const c = roles(false);
  return (
    <section id="people" data-onganda-enter="" className="mx-auto max-w-7xl px-6 pb-24 md:px-12">
      <SectionHeader label="People & principles" headline="A place for builders." accent={COLOR.mopaneBrown} />
      <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
        <PixelPanel
          spine
          accent={COLOR.mopaneBrown}
          eyebrow="Windhoek · Sovereign AI workshop"
          title="Technical depth, practical experimentation, and shared making."
          aside={<IconUsers size={ICON_SIZE.control} color={COLOR.mopaneBrown} />}
        >
          <p style={{ margin: 0, fontSize: TYPE.bodyLarge.size, lineHeight: TYPE.bodyLarge.lineHeight, color: c.textBody }}>
            {BRAND} brings together researchers, systems engineers, linguists, and sector operators working across models, workflows, containers, interfaces, and field applications.
          </p>
          <p style={{ margin: `${SPACE_SCALE['4']}px 0 0`, fontSize: TYPE.body.size, lineHeight: TYPE.body.lineHeight, color: c.textMuted }}>
            Rather than publishing isolated demos, the lab builds reusable domestic infrastructure so every pilot strengthens the next one.
          </p>
          <div className="mt-6 grid grid-cols-2 gap-4 border-t pt-5" style={{ borderColor: c.line }}>
            <div>
              <p className="uppercase" style={{ margin: 0, fontSize: TYPE.micro.size, fontWeight: TYPE.micro.weight, letterSpacing: TYPE.micro.tracking, color: c.textMuted }}>
                Disciplines
              </p>
              <p style={{ margin: '6px 0 0', fontSize: TYPE.meta.size, fontWeight: TYPE.ui.weight, color: c.text }}>
                ML systems · Linguistics · Field UX
              </p>
            </div>
            <div>
              <p className="uppercase" style={{ margin: 0, fontSize: TYPE.micro.size, fontWeight: TYPE.micro.weight, letterSpacing: TYPE.micro.tracking, color: c.textMuted }}>
                Home base
              </p>
              <p style={{ margin: '6px 0 0', fontSize: TYPE.meta.size, fontWeight: TYPE.ui.weight, color: c.text }}>
                Windhoek, Namibia
              </p>
            </div>
          </div>
        </PixelPanel>

        <div className="border p-6 md:p-8" style={{ background: c.surface, borderColor: c.line }}>
          <div className="mb-4 flex items-center justify-between">
            <span className="uppercase" style={{ fontSize: TYPE.eyebrow.size, fontWeight: TYPE.eyebrow.weight, letterSpacing: TYPE.eyebrow.tracking, color: c.textMuted }}>
              Five governing principles
            </span>
            <PixelTag hex={COLOR.mopaneBrown} label="Foundations" />
          </div>
          <dl className="m-0 divide-y" style={{ borderColor: c.line }}>
            {PRINCIPLES.map((p, i) => (
              <PrincipleRow key={p.label} principle={p} idx={i} />
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
};

const ContactBand = ({ compact = false }: { compact?: boolean }) => {
  const [email, setEmail] = useState('');
  const [kind, setKind] = useState('');
  const [note, setNote] = useState('');
  const [error, setError] = useState('');
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async () => {
    const trimmedEmail = email.trim();
    const trimmedKind = kind.trim();
    const trimmedNote = note.trim();
    if (!trimmedEmail && !trimmedNote) {
      setError('Enter an email address or a short note so we can reply.');
      return;
    }
    setError('');
    setSending(true);
    try {
      await fetch('/api/v1/contact', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ email: trimmedEmail, kind: trimmedKind, note: trimmedNote })
      });
    } catch {
      // Static preview or offline fallback still shows the confirmation and mailto link.
    } finally {
      setSending(false);
      setSent(true);
    }
  };

  const mailtoHref = `mailto:kennethmwandingi@gmail.com?subject=${encodeURIComponent(
    kind.trim() ? `Onganda inquiry: ${kind.trim()}` : 'Onganda inquiry'
  )}&body=${encodeURIComponent(
    [email.trim() ? `From: ${email.trim()}` : '', note.trim()].filter(Boolean).join('\n\n')
  )}`;

  return (
    <PixelContactPanel
      id="contact"
      eyebrow="Contact"
      headline="Start a conversation."
      accent={COLOR.ochreOrange}
      icon={<IconMail size={24} color={COLOR.ochreOrange} />}
      aside={
        <p className="max-w-xl">For collaboration, institutional pilots, or early access conversations, reach out directly.</p>
      }
    >
      {sent && (
        <PixelNotice status="active" title="Inquiry recorded" onDismiss={() => setSent(false)}>
          Thank you. Your note for the {BRAND} team in Windhoek has been recorded, or you can{' '}
          <a href={mailtoHref} className="underline" style={{ color: 'inherit' }}>
            send it directly by email
          </a>
          .
        </PixelNotice>
      )}
      {!compact && (
        <div className="grid gap-5 sm:grid-cols-2">
          <PixelField label="Email" htmlFor="contact-email">
            <PixelInput
              id="contact-email"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="name@institution.na"
            />
          </PixelField>
          <PixelField label="Inquiry type" htmlFor="contact-type">
            <PixelInput
              id="contact-type"
              value={kind}
              onChange={e => setKind(e.target.value)}
              placeholder="Partnership, pilot, access"
            />
          </PixelField>
        </div>
      )}
      <PixelField label="Short note" htmlFor="contact-note" error={error || undefined}>
        <PixelTextarea
          id="contact-note"
          value={note}
          invalid={!!error}
          onChange={e => {
            setNote(e.target.value);
            if (error) setError('');
          }}
          placeholder="What would you like to discuss?"
        />
      </PixelField>
      <PixelButton
        variant="primary"
        className="w-fit"
        disabled={sending}
        onClick={handleSubmit}
      >
        {sending ? 'Sending…' : `Contact ${BRAND}`}<IconArrowRight size={12} />
      </PixelButton>
    </PixelContactPanel>
  );
};

const HomePage = () => (
  <>
    <PublicHero
      tag="LIVE"
      line1="AI systems"
      line2="Namibia can"
      line3="shape locally."
      body={`${BRAND} is building the capability to adapt, evaluate, deploy, and turn AI systems into useful tools. More will be shared in time. For now, the lab is opening conversations.`}
      primary={{ label: 'Request a conversation', href: '#contact' }}
      secondary={{ label: 'View the systems', href: '#systems' }}
    />
    <SignalBand />
    <SystemsGrid />
    <ContactBand />
  </>
);

const FullPage = () => (
  <>
    <PublicHero
      tag="ONGANDA · LAB"
      line1="AI systems"
      line2="Namibia can shape,"
      line3="run, and build on."
      body={`${BRAND} is building domestic capability to adapt, evaluate, deploy, and turn AI systems into useful tools for Namibian institutions, languages, and services.`}
      primary={{ label: 'Explore current projects', href: '#pilots' }}
      secondary={{ label: 'Start a conversation', href: '#contact' }}
      withStats
    />
    <SignalBand expanded />
    <CompoundArchitectureBand />
    <FocusAndPilotsBand />
    <div hidden aria-hidden="true" data-hidden-sections="">
      <SystemsGrid detailed />
      <TerminalBand />
      <SectorIdeasBand />
      <RoadmapBand />
      <PeopleAndPrinciplesBand />
    </div>
    <ContactBand />
    <OngandaFooter />
  </>
);

export const OngandaPublicSite = ({ page = 'full' }: { page?: PublicPage }) => (
  <PublicShell page={page}>
    {page === 'full' ? <FullPage /> : <HomePage />}
  </PublicShell>
);

export const OkaandaPublicSite = OngandaPublicSite;
