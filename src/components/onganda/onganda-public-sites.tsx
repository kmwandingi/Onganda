import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AUTOMATED } from './onganda-motion';
import { COLOR, roles, onColor, inkOn, SYSTEMS, TERMINAL_BLOCKS, SystemEntry } from './onganda-tokens';
import { DarkContext, OngandaLogoMark, PixelButton, PixelCornerMarks, PixelDot, PixelField, PixelInput, PixelTag, PixelTextarea, SectionHeader, TerminalCard, WeaveOverlay, systemIconForName } from './onganda-primitives';
import {
  PixelTicker,
  PixelEditorialSection,
  PixelFocusRow,
  PixelLabCard,
  PixelContactPanel,
  PixelEdgeStrips
} from './onganda-site';
import {
  IconArrowRight,
  IconCheck,
  IconClose,
  IconCode,
  IconDatabase,
  IconDashboard,
  IconMail,
  IconMenu,
  IconPackage,
  IconTarget,
  IconTerminal,
  IconUsers
} from './onganda-icons';

type PublicPage = 'home' | 'full';

const BRAND = 'Onganda';
const LAB_LABEL = 'Namibia AI Systems Lab';
const muted = 'rgba(30,26,23,0.66)';
const quiet = 'rgba(30,26,23,0.66)';
const line = 'rgba(30,26,23,0.10)';
const darkLine = 'rgba(232,225,207,0.10)';

const navItems = [
  { href: '/', label: 'Home' },
  { href: '/full', label: 'Full site' },
  { href: '/showcase', label: 'Showcase' }
];


const focusItems = [
  { icon: IconDatabase, label: 'Adapt models', body: 'Select, adapt, evaluate, and organize models for local use.', hex: COLOR.ochreOrange },
  { icon: IconTerminal, label: 'Run workflows', body: 'Build repeatable adaptation and deployment paths.', hex: COLOR.barkRust },
  { icon: IconPackage, label: 'Hold systems', body: 'Package agents, memory, and runtimes into portable units.', hex: COLOR.mahanguGold },
  { icon: IconDashboard, label: 'Shape interfaces', body: 'Create surfaces where people can inspect and control systems.', hex: COLOR.mopaneBrown },
  { icon: IconTarget, label: 'Deliver tools', body: 'Move from internal stack to pilots and sector-facing products.', hex: COLOR.dyePlum }
];

const fadeUp = {
  initial: AUTOMATED ? false as const : { opacity: 0, y: 16 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-40px' },
  transition: { duration: 0.45 }
};

const PublicNav = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
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
        <motion.button
          whileTap={{ scale: 0.94 }}
          onClick={() => setMenuOpen(open => !open)}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
          className="flex items-center justify-center border p-2 md:hidden"
          style={{ background: 'transparent', borderColor: line, color: COLOR.charBlack, cursor: 'pointer' }}
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
            style={{ borderColor: line }}
          >
            <div className="flex flex-col px-6 py-3">
              {navItems.map(item => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-3 py-3 text-xs font-bold uppercase tracking-[0.14em] no-underline"
                  style={{ color: quiet }}
                >
                  <PixelDot color={COLOR.ochreOrange} size={4} />
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

const PublicShell = ({ children }: { children: React.ReactNode }) => (
  <DarkContext.Provider value={{ isDark: false, toggle: () => {} }}>
    <div className="min-h-screen" style={{ background: COLOR.milletClay, color: COLOR.charBlack, fontFamily: 'Inter, Arial, sans-serif' }}>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:px-4 focus:py-2 focus:text-xs focus:font-bold focus:uppercase focus:tracking-[0.14em]"
        style={{ background: COLOR.charBlack, color: COLOR.milletClay }}
      >
        Skip to content
      </a>
      <PublicNav />
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
    <PixelEdgeStrips hexes={[COLOR.ochreOrange, COLOR.barkRust, COLOR.mahanguGold, COLOR.mopaneBrown, COLOR.dyePlum, COLOR.firedRed]} />

    <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col items-center px-6 pt-16 text-center md:px-12">
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
              style={{ color: index === 2 ? roles(false).accentInk : COLOR.charBlack }}
            >
              {line}
            </motion.span>
          </span>
        ))}
      </h1>
    </div>
    {/* Full-bleed system ticker — matches the showcase hero stripe */}
    <PixelTicker className="relative z-10 mt-6 md:mt-8" />
    <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col items-center px-6 pb-16 text-center md:px-12">
      <p className="mt-8 max-w-2xl text-base leading-relaxed md:text-lg" style={{ color: muted }}>{body}</p>
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
        {[COLOR.ochreOrange, COLOR.firedRed, COLOR.mahanguGold, COLOR.barkRust, COLOR.mopaneBrown].map(hex => <PixelDot key={hex} color={hex} size={8} opacity={0.45} />)}
      </div>
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
          style={{ background: COLOR.dustLight, borderColor: line }}
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
            <p className="mt-1 text-sm font-medium" style={{ color: muted }}>{sys.english}</p>
            <p className="mt-5 text-xs font-bold uppercase tracking-[0.15em]" style={{ color: quiet }}>{sys.role}</p>
            <p className="mt-4 text-sm leading-relaxed" style={{ color: muted }}>{detailed ? sys.long : sys.line}</p>
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
  <PixelEditorialSection id="building" label="What we are building" headline="A systems lab for sovereignty, capability, and use." accent={COLOR.barkRust}>
    <p>{BRAND} is not a single product. It is a lab organized around a coherent stack: model and data systems, adaptation workflows, containers, interfaces, and delivery.</p>
    <p>From there, the lab turns those systems into pilots, tools, and applications that can be used in practice.</p>
  </PixelEditorialSection>
);

const TerminalBand = () => (
  <section className="mx-auto max-w-7xl px-6 pb-24 md:px-12">
    <SectionHeader label="Studio" headline="Built like a lab. Run like a startup." accent={COLOR.barkRust} />
    <div className="grid gap-4 lg:grid-cols-3">
      {TERMINAL_BLOCKS.slice(0, 3).map(block => <TerminalCard key={block.title} block={block} />)}
    </div>
  </section>
);

const ContactBand = ({ compact = false }: { compact?: boolean }) => (
  <PixelContactPanel
    id="contact"
    eyebrow="Contact"
    headline="Start a conversation."
    accent={COLOR.ochreOrange}
    icon={<IconMail size={24} color={COLOR.ochreOrange} />}
    aside={
      <p className="max-w-xl">For collaboration, institutional interest, or early access conversations, reach out directly.</p>
    }
  >
    {!compact && (
      <div className="grid gap-5 sm:grid-cols-2">
        <PixelField label="Email" htmlFor="contact-email">
          <PixelInput id="contact-email" type="email" placeholder="name@institution.na" />
        </PixelField>
        <PixelField label="Inquiry type" htmlFor="contact-type">
          <PixelInput id="contact-type" placeholder="Partnership, pilot, access" />
        </PixelField>
      </div>
    )}
    <PixelField label="Short note" htmlFor="contact-note">
      <PixelTextarea id="contact-note" placeholder="What would you like to discuss?" />
    </PixelField>
    <PixelButton variant="primary" className="w-fit">
      Contact {BRAND}<IconArrowRight size={12} />
    </PixelButton>
  </PixelContactPanel>
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
    <PixelEditorialSection id="why" label={`Why ${BRAND}`} headline="Namibia should not only consume AI. It should be able to shape it." accent={COLOR.ochreOrange}>
      <p>AI is becoming part of infrastructure: how knowledge is handled, how decisions are supported, how tools are built, and how services are delivered.</p>
      <p>Without local capability, countries remain dependent on outside providers for model choices, system behavior, language support, evaluation standards, and deployment decisions.</p>
      <p>{BRAND} is building that missing layer: not a trophy lab, but a working capability layer.</p>
    </PixelEditorialSection>
    <WhatBuildingBand />
    <SystemsGrid detailed />
    <TerminalBand />
    <PixelEditorialSection id="focus" label="Focus" headline="Where sovereignty becomes practical." accent={COLOR.dyePlum}>
      <p>Sovereignty is not a slogan. It becomes real when systems can be adapted, tested, deployed, and used locally.</p>
      <div className="grid gap-3 pt-4">
        {focusItems.map((item, index) => {
          const Icon = item.icon;
          return (
            <PixelFocusRow
              key={item.label}
              index={index}
              accent={item.hex}
              title={item.label}
              icon={<Icon size={22} color={item.hex} />}
            >
              {item.body}
            </PixelFocusRow>
          );
        })}
      </div>
    </PixelEditorialSection>
    <PixelEditorialSection id="people" label="People" headline="A place for builders." accent={COLOR.mopaneBrown}>
      <div className="flex items-start gap-4">
        <IconUsers size={24} color={COLOR.mopaneBrown} />
        <p>{BRAND} brings together people working across systems, models, interfaces, and applications. The lab is designed for technical depth, practical experimentation, and shared making.</p>
      </div>
    </PixelEditorialSection>
    <ContactBand />
  </>
);

export const OngandaPublicSite = ({ page }: { page: PublicPage }) => (
  <PublicShell>
    {page === 'full' ? <FullPage /> : <HomePage />}
  </PublicShell>
);

export const OkaandaPublicSite = OngandaPublicSite;
