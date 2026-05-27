import React from 'react';
import { motion } from 'framer-motion';
import { COLOR, SYSTEMS, TERMINAL_BLOCKS, SystemEntry } from './onganda-tokens';
import {
  DarkContext,
  DitherBar,
  OngandaLogoMark,
  PixelCornerMarks,
  PixelDot,
  PixelTag,
  TerminalCard,
  WeaveOverlay,
  systemIconForName
} from './onganda-primitives';
import {
  IconArrowRight,
  IconCheck,
  IconCode,
  IconDatabase,
  IconDashboard,
  IconMail,
  IconPackage,
  IconTarget,
  IconTerminal,
  IconUsers
} from './onganda-icons';

type PublicPage = 'home' | 'full';

const BRAND = 'Onganda';
const LAB_LABEL = 'Namibia AI Systems Lab';
const muted = 'rgba(30,26,23,0.58)';
const quiet = 'rgba(30,26,23,0.42)';
const line = 'rgba(30,26,23,0.10)';
const darkLine = 'rgba(232,225,207,0.10)';

const navItems = [
  { href: '/', label: 'Home' },
  { href: '/full', label: 'Full site' },
  { href: '/showcase', label: 'Showcase' }
];

const systemEnglish = (sys: SystemEntry) => sys.name === 'Okaanda' ? 'Granary' : sys.english;

const focusItems = [
  { icon: IconDatabase, label: 'Adapt models', body: 'Select, adapt, evaluate, and organize models for local use.', hex: COLOR.ochreOrange },
  { icon: IconTerminal, label: 'Run workflows', body: 'Build repeatable adaptation and deployment paths.', hex: COLOR.barkRust },
  { icon: IconPackage, label: 'Hold systems', body: 'Package agents, memory, and runtimes into portable units.', hex: COLOR.mahanguGold },
  { icon: IconDashboard, label: 'Shape interfaces', body: 'Create surfaces where people can inspect and control systems.', hex: COLOR.mopaneBrown },
  { icon: IconTarget, label: 'Deliver tools', body: 'Move from internal stack to pilots and sector-facing products.', hex: COLOR.dyePlum }
];

const fadeUp = {
  initial: { opacity: 0, y: 16 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-40px' },
  transition: { duration: 0.45 }
};

const PublicNav = () => (
  <nav className="sticky top-0 z-50 w-full border-b" style={{
    background: 'rgba(232,225,207,0.92)',
    borderColor: line,
    backdropFilter: 'blur(14px)'
  }}>
    <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 md:px-12">
      <a href="/" className="flex items-center gap-3 no-underline" style={{ color: COLOR.charBlack }}>
        <OngandaLogoMark size={24} />
        <div>
          <p className="text-sm font-semibold leading-none">{BRAND}</p>
          <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.16em]" style={{ color: quiet }}>{LAB_LABEL}</p>
        </div>
      </a>
      <div className="hidden items-center gap-1 md:flex">
        {navItems.map(item => (
          <a key={item.href} href={item.href} className="px-3 py-2 text-xs font-bold uppercase tracking-[0.14em] no-underline" style={{ color: quiet }}>
            {item.label}
          </a>
        ))}
      </div>
    </div>
  </nav>
);

const PublicShell = ({ children }: { children: React.ReactNode }) => (
  <DarkContext.Provider value={{ isDark: false, toggle: () => {} }}>
    <div className="min-h-screen" style={{ background: COLOR.milletClay, color: COLOR.charBlack, fontFamily: 'Inter, Arial, sans-serif' }}>
      <PublicNav />
      {children}
    </div>
  </DarkContext.Provider>
);

const Ticker = ({ className = '' }: { className?: string }) => (
  <div className={`w-full overflow-hidden border-y ${className}`} style={{ background: COLOR.charBlack, borderColor: line }} aria-hidden="true">
    <motion.div
      data-onganda-ticker
      animate={{ x: ['0%', '-50%'] }}
      transition={{ duration: 28, repeat: Infinity, ease: 'linear' }}
      className="flex w-max items-center py-3"
    >
      {[...SYSTEMS, ...SYSTEMS].map((sys, index) => (
        <div key={`${sys.name}-${index}`} className="flex items-center">
          <PixelDot color={sys.borderHex} size={6} />
          <span className="ml-3 text-[11px] font-bold uppercase tracking-[0.18em]" style={{ color: sys.borderHex }}>{sys.name}</span>
          <span className="ml-2 mr-8 text-[10px] font-bold uppercase tracking-[0.12em]" style={{ color: 'rgba(232,225,207,0.32)' }}>{systemEnglish(sys)}</span>
          <div className="mr-8 h-4 w-px" style={{ background: darkLine }} />
        </div>
      ))}
    </motion.div>
  </div>
);

const PublicHero = ({
  tag,
  line1,
  line2,
  line3,
  body,
  primary,
  secondary
}: {
  tag: string;
  line1: string;
  line2: string;
  line3: string;
  body: string;
  primary: { label: string; href: string };
  secondary?: { label: string; href: string };
}) => (
  <header className="relative flex min-h-[calc(100svh-65px)] flex-col items-center justify-center overflow-hidden">
    <WeaveOverlay opacity={0.026} />
    <div className="absolute inset-y-0 left-0 flex w-5 flex-col overflow-hidden" aria-hidden="true">
      {[COLOR.ochreOrange, COLOR.barkRust, COLOR.mahanguGold, COLOR.mopaneBrown, COLOR.dyePlum, COLOR.firedRed].map((hex, i) => (
        <motion.div
          key={`${hex}-${i}`}
          animate={{ y: [0, -80, 0] }}
          transition={{ duration: 16 + i * 2, repeat: Infinity, ease: 'linear' }}
          className="h-12 w-2"
          style={{ background: hex, opacity: i % 2 ? 0.18 : 0.48 }}
        />
      ))}
    </div>
    <div className="absolute inset-y-0 right-0 flex w-5 flex-col items-end overflow-hidden" aria-hidden="true">
      {[COLOR.dyePlum, COLOR.mopaneBrown, COLOR.mahanguGold, COLOR.barkRust, COLOR.ochreOrange, COLOR.firedRed].map((hex, i) => (
        <motion.div
          key={`${hex}-${i}`}
          animate={{ y: [0, 80, 0] }}
          transition={{ duration: 17 + i * 2, repeat: Infinity, ease: 'linear' }}
          className="h-12 w-2"
          style={{ background: hex, opacity: i % 2 ? 0.16 : 0.42 }}
        />
      ))}
    </div>

    <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col items-center px-6 py-16 text-center md:px-12">
      <div className="mb-7 flex flex-wrap items-center justify-center gap-3">
        <PixelTag hex={COLOR.ochreOrange} label={tag} />
        <span className="text-xs font-bold uppercase tracking-[0.18em]" style={{ color: quiet }}>{LAB_LABEL}</span>
      </div>
      <h1 className="flex max-w-6xl flex-col items-center text-center font-bold leading-[0.98]" style={{ color: COLOR.charBlack, fontSize: 'var(--type-hero-public)' }}>
        {[line1, line2, line3].map((line, index) => (
          <span key={line} className="block overflow-hidden">
            <motion.span
              className="block"
              initial={{ y: '110%', opacity: 0 }}
              animate={{ y: '0%', opacity: 1 }}
              transition={{ duration: 0.72, delay: 0.08 + index * 0.12, ease: [0.16, 1, 0.3, 1] }}
              style={{ color: index === 2 ? COLOR.ochreOrange : COLOR.charBlack }}
            >
              {line}
            </motion.span>
          </span>
        ))}
      </h1>
      <Ticker className="mt-6 md:mt-8" />
      <p className="mt-8 max-w-2xl text-base leading-relaxed md:text-lg" style={{ color: muted }}>{body}</p>
      <div className="mt-9 flex flex-wrap justify-center gap-3">
        <a href={primary.href} className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold no-underline" style={{ background: COLOR.charBlack, color: COLOR.milletClay }}>
          {primary.label}<IconArrowRight size={14} />
        </a>
        {secondary && (
          <a href={secondary.href} className="inline-flex items-center gap-2 border px-6 py-3 text-sm font-semibold no-underline" style={{ borderColor: line, color: COLOR.charBlack }}>
            {secondary.label}<IconArrowRight size={14} />
          </a>
        )}
      </div>
      <div className="mt-8 flex gap-1" aria-hidden="true">
        {[COLOR.ochreOrange, COLOR.firedRed, COLOR.mahanguGold, COLOR.barkRust, COLOR.mopaneBrown].map(hex => <PixelDot key={hex} color={hex} size={8} opacity={0.45} />)}
      </div>
    </div>
  </header>
);

const SectionTitle = ({ label, headline, accent = COLOR.ochreOrange }: { label: string; headline: string; accent?: string }) => (
  <div className="mb-12 border-b pb-6" style={{ borderColor: line }}>
    <div className="mb-3 flex items-center gap-3">
      <PixelDot color={accent} size={7} />
      <h2 className="text-xs font-bold uppercase tracking-[0.16em]" style={{ color: quiet }}>{label}</h2>
    </div>
    <p className="max-w-4xl text-2xl font-medium leading-tight md:text-4xl" style={{ color: COLOR.charBlack }}>{headline}</p>
  </div>
);

const EditorialSection = ({ id, label, headline, children, accent = COLOR.ochreOrange }: {
  id?: string;
  label: string;
  headline: string;
  children: React.ReactNode;
  accent?: string;
}) => (
  <section id={id} className="mx-auto max-w-7xl px-6 pb-24 md:px-12">
    <SectionTitle label={label} headline={headline} accent={accent} />
    <div className="grid gap-10 lg:grid-cols-[0.78fr_1.22fr]">
      <div className="hidden lg:block">
        <DitherBar color={accent} segments={34} height={4} opacity={0.42} />
      </div>
      <div className="space-y-5 text-base leading-relaxed md:text-lg" style={{ color: muted }}>{children}</div>
    </div>
  </section>
);

const SystemsGrid = ({ detailed = false }: { detailed?: boolean }) => (
  <section id="systems" className="mx-auto max-w-7xl px-6 pb-24 md:px-12">
    <SectionTitle label="Systems" headline="Five systems. One compound." accent={COLOR.mahanguGold} />
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {SYSTEMS.map((sys, index) => (
        <motion.article
          key={sys.name}
          {...fadeUp}
          whileHover={{ y: -4 }}
          className="relative flex min-h-[320px] flex-col border p-8"
          style={{ background: COLOR.dustLight, borderColor: line }}
        >
          <WeaveOverlay opacity={0.035} />
          <div className="relative mb-8 flex items-start justify-between">
            <div className="border p-3" style={{ borderColor: `${sys.borderHex}40`, background: `${sys.borderHex}14` }}>
              {systemIconForName(sys.name, 50)}
            </div>
            <PixelTag hex={sys.borderHex} label={String(index + 1).padStart(2, '0')} />
          </div>
          <div className="relative">
            <h3 className="text-2xl font-semibold">{sys.name}</h3>
            <p className="mt-1 text-sm font-medium" style={{ color: sys.borderHex }}>{systemEnglish(sys)}</p>
            <p className="mt-5 text-xs font-bold uppercase tracking-[0.15em]" style={{ color: quiet }}>{sys.role}</p>
            <p className="mt-4 text-sm leading-relaxed" style={{ color: muted }}>{detailed ? sys.long : sys.line}</p>
          </div>
          <div className="absolute left-0 top-0 h-full w-[3px]" style={{ background: sys.borderHex }} aria-hidden="true" />
          <DitherBar color={sys.borderHex} segments={24} height={2} opacity={0.55} className="absolute bottom-0 left-0 right-0" />
        </motion.article>
      ))}
      <motion.article
        {...fadeUp}
        whileHover={{ y: -4 }}
        className="relative flex min-h-[320px] flex-col justify-between overflow-hidden p-8"
        style={{ background: COLOR.charBlack, color: COLOR.milletClay }}
      >
          <WeaveOverlay isDark opacity={0.06} />
          <div className="relative">
            <div className="w-full" style={{ background: COLOR.ochreOrange, height: 28 }}>
              <span className="ml-3 text-[10px] font-bold uppercase tracking-[0.16em]" style={{ color: COLOR.milletClay, lineHeight: '28px' }}>LAB</span>
            </div>
            <h3 className="mt-8 text-2xl font-semibold">{BRAND}</h3>
            <p className="mt-5 text-sm leading-relaxed" style={{ color: 'rgba(232,225,207,0.56)' }}>
              {detailed ? 'The compound exists so the five systems work together rather than become isolated prototypes.' : 'Five systems working as one compound: from readiness to delivery.'}
            </p>
          </div>
          <IconCheck size={24} color={COLOR.ochreOrange} />
      </motion.article>
    </div>
  </section>
);

const SignalBand = () => (
  <section id="why" className="mx-auto max-w-7xl px-6 pb-24 md:px-12">
    <div className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
      <motion.div
        {...fadeUp}
        whileHover={{ y: -3 }}
        className="relative overflow-hidden p-8"
        style={{ background: COLOR.charBlack, color: COLOR.milletClay }}
      >
        <WeaveOverlay isDark opacity={0.055} />
        <div className="relative">
          <PixelTag hex={COLOR.ochreOrange} label="Why Onganda" />
          <h2 className="mt-10 max-w-xl text-3xl font-semibold leading-tight md:text-5xl">Namibia should not only consume AI. It should be able to shape it.</h2>
          <p className="mt-8 max-w-lg text-sm leading-relaxed md:text-base" style={{ color: 'rgba(232,225,207,0.58)' }}>
            Onganda is building the missing layer: adaptation, evaluation, deployment, interfaces, and delivered tools.
          </p>
          <DitherBar color={COLOR.ochreOrange} segments={28} height={3} opacity={0.65} className="mt-10" />
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
              className="relative border p-6"
              style={{ background: COLOR.dustLight, borderColor: line }}
            >
              <PixelCornerMarks hex={item.hex} size={7} />
              <div className="mb-8 flex items-center justify-between">
                <PixelTag hex={item.hex} label={String(index + 1).padStart(2, '0')} />
                <Icon size={22} color={item.hex} />
              </div>
              <h3 className="text-lg font-semibold leading-tight">{item.label}</h3>
              <p className="mt-4 text-sm leading-relaxed" style={{ color: muted }}>{item.body}</p>
            </motion.article>
          );
        })}
      </div>
    </div>
  </section>
);

const WhatBuildingBand = () => (
  <EditorialSection id="building" label="What we are building" headline="A systems lab for sovereignty, capability, and use." accent={COLOR.barkRust}>
    <p>{BRAND} is not a single product. It is a lab organized around a coherent stack: model and data systems, adaptation workflows, containers, interfaces, and delivery.</p>
    <p>From there, the lab turns those systems into pilots, tools, and applications that can be used in practice.</p>
  </EditorialSection>
);

const TerminalBand = () => (
  <section className="mx-auto max-w-7xl px-6 pb-24 md:px-12">
    <SectionTitle label="Studio" headline="Built like a lab. Run like a startup." accent={COLOR.barkRust} />
    <div className="grid gap-4 lg:grid-cols-3">
      {TERMINAL_BLOCKS.slice(0, 3).map(block => <TerminalCard key={block.title} block={block} />)}
    </div>
  </section>
);

const ContactBand = ({ compact = false }: { compact?: boolean }) => (
  <section id="contact" className="px-6 pb-24 md:px-12">
    <div className="mx-auto max-w-7xl">
      <div className="relative overflow-hidden border p-8 md:p-12" style={{ background: COLOR.dustLight, borderColor: line }}>
        <PixelCornerMarks hex={COLOR.ochreOrange} size={10} />
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <div className="mb-5 flex items-center gap-3">
              <IconMail size={24} color={COLOR.ochreOrange} />
              <span className="text-xs font-bold uppercase tracking-[0.16em]" style={{ color: quiet }}>Contact</span>
            </div>
            <h2 className="text-3xl font-semibold leading-tight md:text-5xl">Start a conversation.</h2>
            <p className="mt-6 max-w-xl text-base leading-relaxed" style={{ color: muted }}>
              For collaboration, institutional interest, or early access conversations, reach out directly.
            </p>
          </div>
          <div className="grid gap-5">
            {!compact && (
              <div className="grid gap-5 sm:grid-cols-2">
                <label className="block">
                  <span className="text-xs font-bold uppercase tracking-[0.15em]" style={{ color: quiet }}>Email</span>
                  <input className="mt-3 w-full border bg-transparent px-4 py-3 outline-none" style={{ borderColor: line }} placeholder="name@institution.na" />
                </label>
                <label className="block">
                  <span className="text-xs font-bold uppercase tracking-[0.15em]" style={{ color: quiet }}>Inquiry type</span>
                  <input className="mt-3 w-full border bg-transparent px-4 py-3 outline-none" style={{ borderColor: line }} placeholder="Partnership, pilot, access" />
                </label>
              </div>
            )}
            <label className="block">
              <span className="text-xs font-bold uppercase tracking-[0.15em]" style={{ color: quiet }}>Short note</span>
              <textarea className="mt-3 min-h-32 w-full border bg-transparent px-4 py-3 outline-none" style={{ borderColor: line }} placeholder="What would you like to discuss?" />
            </label>
            <motion.button whileTap={{ scale: 0.98 }} className="inline-flex w-fit items-center gap-2 px-6 py-3 text-sm font-semibold" style={{ background: COLOR.charBlack, color: COLOR.milletClay }}>
              Contact {BRAND}<IconArrowRight size={14} />
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  </section>
);

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
      tag="LATER"
      line1="AI systems"
      line2="Namibia can shape,"
      line3="run, and build on."
      body={`${BRAND} is building domestic capability to adapt, evaluate, deploy, and turn AI systems into useful tools.`}
      primary={{ label: 'Explore the systems', href: '#systems' }}
      secondary={{ label: 'Start a conversation', href: '#contact' }}
    />
    <EditorialSection id="why" label={`Why ${BRAND}`} headline="Namibia should not only consume AI. It should be able to shape it." accent={COLOR.ochreOrange}>
      <p>AI is becoming part of infrastructure: how knowledge is handled, how decisions are supported, how tools are built, and how services are delivered.</p>
      <p>Without local capability, countries remain dependent on outside providers for model choices, system behavior, language support, evaluation standards, and deployment decisions.</p>
      <p>{BRAND} is building that missing layer: not a trophy lab, but a working capability layer.</p>
    </EditorialSection>
    <WhatBuildingBand />
    <SystemsGrid detailed />
    <TerminalBand />
    <EditorialSection id="focus" label="Focus" headline="Where sovereignty becomes practical." accent={COLOR.dyePlum}>
      <p>Sovereignty is not a slogan. It becomes real when systems can be adapted, tested, deployed, and used locally.</p>
      <div className="grid gap-3 pt-4">
        {focusItems.map((item, index) => {
          const Icon = item.icon;
          return (
            <motion.article key={item.label} {...fadeUp} whileHover={{ x: 4 }} className="relative flex gap-5 border p-5" style={{ background: COLOR.dustLight, borderColor: line }}>
              <PixelTag hex={item.hex} label={String(index + 1).padStart(2, '0')} />
              <div className="shrink-0 pt-1"><Icon size={22} color={item.hex} /></div>
              <div>
                <h3 className="font-semibold">{item.label}</h3>
                <p className="mt-2 text-sm leading-relaxed" style={{ color: muted }}>{item.body}</p>
              </div>
            </motion.article>
          );
        })}
      </div>
    </EditorialSection>
    <EditorialSection id="people" label="People" headline="A place for builders." accent={COLOR.mopaneBrown}>
      <div className="flex items-start gap-4">
        <IconUsers size={28} color={COLOR.mopaneBrown} />
        <p>{BRAND} brings together people working across systems, models, interfaces, and applications. The lab is designed for technical depth, practical experimentation, and shared making.</p>
      </div>
    </EditorialSection>
    <ContactBand />
  </>
);

export const OngandaPublicSite = ({ page }: { page: PublicPage }) => (
  <PublicShell>
    {page === 'full' ? <FullPage /> : <HomePage />}
  </PublicShell>
);

export const OkaandaPublicSite = OngandaPublicSite;
