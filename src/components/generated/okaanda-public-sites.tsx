import React from 'react';
import { COLOR, SYSTEMS, SystemEntry } from './okaanda-tokens';
import {
  DarkContext,
  DitherBar,
  OkaandaLogoMark,
  PixelCornerMarks,
  PixelDot,
  PixelTag,
  WeaveOverlay,
  IconOkaanda,
  IconOshini,
  IconOmbiga,
  IconEtiti,
  IconOshitoo
} from './okaanda-primitives';
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
} from './okaanda-icons';

type PublicPage = 'home' | 'systems' | 'contact' | 'full';

const BRAND = 'Onganda';
const LAB_LABEL = 'Namibia AI Systems Lab';
const muted = 'rgba(30,26,23,0.58)';
const quiet = 'rgba(30,26,23,0.42)';
const line = 'rgba(30,26,23,0.10)';
const darkLine = 'rgba(232,225,207,0.10)';

const systemIcon = (name: string, size = 42) => {
  if (name === 'Okaanda') return <IconOkaanda size={size} />;
  if (name === 'Oshini') return <IconOshini size={size} />;
  if (name === 'Ombiga') return <IconOmbiga size={size} />;
  if (name === 'Etiti') return <IconEtiti size={size} />;
  return <IconOshitoo size={size} />;
};

const systemEnglish = (sys: SystemEntry) => sys.name === 'Okaanda' ? 'Granary' : sys.english;

const systemLine = (name: string) => {
  if (name === 'Okaanda') return 'Storage, readiness, and model organization.';
  if (name === 'Oshini') return 'Adaptation, transformation, and workflow.';
  if (name === 'Ombiga') return 'Containers, agents, and held systems.';
  if (name === 'Etiti') return 'User surfaces, dashboards, and interfaces.';
  return 'Applications, outputs, and delivered tools.';
};

const systemLong = (name: string) => {
  if (name === 'Okaanda') return 'Okaanda is the granary: the storage and readiness layer. It holds datasets, evaluation structures, model organization, and the internal order that makes the rest of the stack usable.';
  if (name === 'Oshini') return 'Oshini is where raw material becomes usable capability. It carries the workflows for fine-tuning, distillation, compression, evaluation, and model adaptation.';
  if (name === 'Ombiga') return 'Ombiga holds systems in a form that can travel. It is the layer for containers, agent runtimes, memory, and portable units of work.';
  if (name === 'Etiti') return 'Etiti is the surface where people meet the system. It turns model work into dashboards, review spaces, workbenches, and interfaces that can be understood and controlled.';
  return 'Oshitoo is the delivery layer. It is where the lab turns internal capability into pilots, applications, and sector-facing products prepared for real use.';
};

const navItems = [
  { href: '/', label: 'Home' },
  { href: '/systems', label: 'Systems' },
  { href: '/contact', label: 'Contact' },
  { href: '/full', label: 'Full site' },
  { href: '/showcase', label: 'Showcase' }
];

const focusItems = [
  { icon: IconDatabase, label: 'Model adaptation and evaluation', hex: COLOR.ochreOrange },
  { icon: IconTerminal, label: 'Local deployment workflows', hex: COLOR.barkRust },
  { icon: IconPackage, label: 'Agents, containers, and held systems', hex: COLOR.mahanguGold },
  { icon: IconDashboard, label: 'Interfaces for review, control, and use', hex: COLOR.mopaneBrown },
  { icon: IconTarget, label: 'Applied systems that can move into practice', hex: COLOR.dyePlum }
];

const studioSteps = [
  { icon: IconDatabase, label: 'Build the stack', body: 'Start with model, data, evaluation, and readiness layers.', hex: COLOR.ochreOrange },
  { icon: IconCode, label: 'Test the system', body: 'Adapt, compress, evaluate, and inspect behavior before use.', hex: COLOR.barkRust },
  { icon: IconDashboard, label: 'Shape the interface', body: 'Turn capability into work surfaces people can understand.', hex: COLOR.mopaneBrown },
  { icon: IconPackage, label: 'Deliver the tool', body: 'Package outputs into pilots, products, and sector systems.', hex: COLOR.dyePlum }
];

const PublicNav = () => (
  <nav className="sticky top-0 z-50 w-full border-b" style={{
    background: 'rgba(232,225,207,0.92)',
    borderColor: line,
    backdropFilter: 'blur(14px)'
  }}>
    <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 md:px-12">
      <a href="/" className="flex items-center gap-3 no-underline" style={{ color: COLOR.charBlack }}>
        <OkaandaLogoMark size={24} />
        <div>
          <p className="text-sm font-semibold leading-none tracking-tight">{BRAND}</p>
          <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.16em]" style={{ color: quiet }}>
            {LAB_LABEL}
          </p>
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
      <footer className="w-full border-t px-6 py-14 md:px-12" style={{ background: COLOR.charBlack, borderColor: COLOR.ochreOrange, color: COLOR.milletClay }}>
        <div className="mx-auto flex max-w-7xl flex-col gap-10 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <OkaandaLogoMark size={22} />
              <p className="text-lg font-semibold">{BRAND}</p>
              <span className="text-sm" style={{ color: 'rgba(232,225,207,0.38)' }}>· {LAB_LABEL}</span>
            </div>
            <p className="mt-5 max-w-lg text-sm leading-relaxed" style={{ color: 'rgba(232,225,207,0.55)' }}>
              AI systems that Namibia can shape, run, and build on.
            </p>
          </div>
          <div className="flex gap-1" aria-hidden="true">
            {[COLOR.ochreOrange, COLOR.firedRed, COLOR.mahanguGold, COLOR.barkRust, COLOR.mopaneBrown, COLOR.dyePlum].map(hex => (
              <PixelDot key={hex} color={hex} size={10} opacity={0.8} />
            ))}
          </div>
        </div>
      </footer>
    </div>
  </DarkContext.Provider>
);

const Ticker = () => (
  <div className="w-screen overflow-hidden border-y" style={{ background: COLOR.charBlack, borderColor: line }} aria-hidden="true">
    <div className="flex w-max items-center py-3">
      {[...SYSTEMS, ...SYSTEMS].map((sys, index) => (
        <div key={`${sys.name}-${index}`} className="flex items-center">
          <PixelDot color={sys.borderHex} size={6} />
          <span className="ml-3 text-[11px] font-bold uppercase tracking-[0.18em]" style={{ color: sys.borderHex }}>{sys.name}</span>
          <span className="ml-2 mr-8 text-[10px] font-bold uppercase tracking-[0.12em]" style={{ color: 'rgba(232,225,207,0.32)' }}>
            {systemEnglish(sys)}
          </span>
          <div className="mr-8 h-4 w-px" style={{ background: darkLine }} />
        </div>
      ))}
    </div>
  </div>
);

const PublicHero = ({
  mode,
  headline,
  body,
  primary,
  secondary
}: {
  mode: 'selective' | 'full' | 'systems' | 'contact';
  headline: string;
  body: string;
  primary?: { label: string; href: string };
  secondary?: { label: string; href: string };
}) => (
  <header className="relative flex min-h-[calc(100svh-65px)] flex-col items-center justify-center overflow-hidden">
    <WeaveOverlay opacity={0.026} />
    <div className="absolute inset-y-0 left-0 flex w-5 flex-col" aria-hidden="true">
      {[COLOR.ochreOrange, COLOR.barkRust, COLOR.mahanguGold, COLOR.mopaneBrown, COLOR.dyePlum, COLOR.firedRed].map((hex, i) => (
        <div key={`${hex}-${i}`} className="h-12 w-2" style={{ background: hex, opacity: i % 2 ? 0.18 : 0.48 }} />
      ))}
    </div>
    <div className="absolute inset-y-0 right-0 flex w-5 flex-col items-end" aria-hidden="true">
      {[COLOR.dyePlum, COLOR.mopaneBrown, COLOR.mahanguGold, COLOR.barkRust, COLOR.ochreOrange, COLOR.firedRed].map((hex, i) => (
        <div key={`${hex}-${i}`} className="h-12 w-2" style={{ background: hex, opacity: i % 2 ? 0.16 : 0.42 }} />
      ))}
    </div>

    <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col items-center px-6 py-20 text-center md:px-12">
      <div className="mb-8 flex flex-wrap items-center justify-center gap-3">
        <PixelTag hex={COLOR.ochreOrange} label={mode === 'selective' ? 'LIVE' : mode === 'full' ? 'LATER' : 'ROOT'} />
        <span className="text-xs font-bold uppercase tracking-[0.18em]" style={{ color: quiet }}>{LAB_LABEL}</span>
      </div>
      <h1 className="max-w-6xl text-5xl font-bold leading-[0.95] tracking-tight md:text-8xl" style={{ color: COLOR.charBlack }}>
        {headline}
      </h1>
      <Ticker />
      <p className="mt-8 max-w-2xl text-base leading-relaxed md:text-lg" style={{ color: muted }}>
        {body}
      </p>
      {(primary || secondary) && (
        <div className="mt-9 flex flex-wrap justify-center gap-3">
          {primary && <a href={primary.href} className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold no-underline" style={{ background: COLOR.charBlack, color: COLOR.milletClay }}>
            {primary.label}<IconArrowRight size={14} />
          </a>}
          {secondary && <a href={secondary.href} className="inline-flex items-center gap-2 border px-6 py-3 text-sm font-semibold no-underline" style={{ borderColor: line, color: COLOR.charBlack }}>
            {secondary.label}<IconArrowRight size={14} />
          </a>}
        </div>
      )}
      <div className="mt-8 flex gap-1" aria-hidden="true">
        {[COLOR.ochreOrange, COLOR.firedRed, COLOR.mahanguGold, COLOR.barkRust, COLOR.mopaneBrown].map(hex => <PixelDot key={hex} color={hex} size={8} opacity={0.45} />)}
      </div>
    </div>
  </header>
);

const EditorialSection = ({
  id,
  label,
  headline,
  children,
  accent = COLOR.ochreOrange
}: {
  id?: string;
  label: string;
  headline: string;
  children: React.ReactNode;
  accent?: string;
}) => (
  <section id={id} className="mx-auto max-w-7xl px-6 pb-24 md:px-12">
    <div className="mb-12 border-b pb-6" style={{ borderColor: line }}>
      <div className="mb-3 flex items-center gap-3">
        <PixelDot color={accent} size={7} />
        <h2 className="text-xs font-bold uppercase tracking-[0.16em]" style={{ color: quiet }}>{label}</h2>
      </div>
      <p className="max-w-4xl text-2xl font-medium leading-tight tracking-tight md:text-4xl" style={{ color: COLOR.charBlack }}>
        {headline}
      </p>
    </div>
    <div className="grid gap-10 lg:grid-cols-[0.82fr_1.18fr]">
      <div className="hidden lg:block">
        <DitherBar color={accent} segments={34} height={4} opacity={0.42} />
      </div>
      <div className="space-y-5 text-base leading-relaxed md:text-lg" style={{ color: muted }}>
        {children}
      </div>
    </div>
  </section>
);

const IconCard = ({ item, index }: {
  item: { icon: React.ComponentType<{ size?: number; color?: string; opacity?: number }>; label: string; body?: string; hex: string };
  index: number;
}) => {
  const Icon = item.icon;
  return (
    <article className="relative border p-6" style={{ background: COLOR.dustLight, borderColor: line }}>
      <PixelCornerMarks hex={item.hex} size={7} />
      <div className="mb-8 flex items-center justify-between">
        <PixelTag hex={item.hex} label={String(index + 1).padStart(2, '0')} />
        <Icon size={22} color={item.hex} />
      </div>
      <h3 className="text-lg font-semibold leading-tight tracking-tight">{item.label}</h3>
      {item.body && <p className="mt-4 text-sm leading-relaxed" style={{ color: muted }}>{item.body}</p>}
      <DitherBar color={item.hex} segments={18} height={2} opacity={0.55} className="mt-6" />
    </article>
  );
};

const SystemsShowcase = ({ concise = false }: { concise?: boolean }) => (
  <section id="systems" className="mx-auto max-w-7xl px-6 pb-24 md:px-12">
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {SYSTEMS.map((sys, index) => (
        <article key={sys.name} className="relative flex min-h-[320px] flex-col border p-8" style={{ background: COLOR.dustLight, borderColor: line }}>
          <WeaveOverlay opacity={0.035} />
          <div className="relative mb-8 flex items-start justify-between">
            <div className="border p-3" style={{ borderColor: `${sys.borderHex}40`, background: `${sys.borderHex}14` }}>
              {systemIcon(sys.name, 48)}
            </div>
            <PixelTag hex={sys.borderHex} label={String(index + 1).padStart(2, '0')} />
          </div>
          <div className="relative">
            <h3 className="text-2xl font-semibold tracking-tight">{sys.name}</h3>
            <p className="mt-1 text-sm font-medium" style={{ color: sys.borderHex }}>{systemEnglish(sys)}</p>
            <p className="mt-5 text-xs font-bold uppercase tracking-[0.15em]" style={{ color: quiet }}>{sys.role}</p>
            <p className="mt-4 text-sm leading-relaxed" style={{ color: muted }}>{concise ? systemLine(sys.name) : systemLong(sys.name)}</p>
          </div>
          <div className="absolute left-0 top-0 h-full w-[3px]" style={{ background: sys.borderHex }} aria-hidden="true" />
          <DitherBar color={sys.borderHex} segments={24} height={2} opacity={0.55} className="absolute bottom-0 left-0 right-0" />
        </article>
      ))}
      {!concise && (
        <article className="relative flex min-h-[320px] flex-col justify-between overflow-hidden p-8" style={{ background: COLOR.charBlack, color: COLOR.milletClay }}>
          <WeaveOverlay isDark opacity={0.06} />
          <div className="relative">
            <PixelTag hex={COLOR.ochreOrange} label="LAB" />
            <h3 className="mt-8 text-2xl font-semibold tracking-tight">{BRAND}</h3>
            <p className="mt-5 text-sm leading-relaxed" style={{ color: 'rgba(232,225,207,0.56)' }}>
              The compound exists so the five systems work together rather than become isolated prototypes.
            </p>
          </div>
          <IconCheck size={24} color={COLOR.ochreOrange} />
        </article>
      )}
    </div>
  </section>
);

const SelectiveHome = () => (
  <>
    <PublicHero
      mode="selective"
      headline="A new lab for AI systems that can be shaped locally."
      body={`${BRAND} is building the capability to adapt, evaluate, deploy, and turn AI systems into useful tools. More will be shared in time. For now, the lab is opening conversations.`}
      primary={{ label: 'Request a conversation', href: '/contact' }}
      secondary={{ label: 'View the systems', href: '/systems' }}
    />
    <EditorialSection id="why" label={`Why ${BRAND}`} headline="Useful systems need local control over how they work." accent={COLOR.barkRust}>
      <p>
        AI capability is becoming part of national capacity. {BRAND} is being built so that useful systems can be shaped, tested, and delivered with local control over behavior, deployment, and use.
      </p>
    </EditorialSection>
    <SystemsShowcase concise />
    <EditorialSection id="invitation" label="Invitation" headline="For those who want to see what is being built" accent={COLOR.dyePlum}>
      <p>
        The lab is still selective in what it shares publicly. For institutional interest, collaboration, or early conversations, contact {BRAND} directly.
      </p>
      <p>
        <a href="/contact" className="inline-flex items-center gap-2 font-semibold no-underline" style={{ color: COLOR.ochreOrange }}>
          Contact the lab <IconArrowRight size={14} />
        </a>
      </p>
    </EditorialSection>
  </>
);

const SelectiveSystems = () => (
  <>
    <PublicHero
      mode="systems"
      headline="The internal architecture of Onganda."
      body={`${BRAND} is built around five linked systems that move from storage and adaptation to interface and delivery.`}
    />
    <SystemsShowcase concise />
    <EditorialSection label="Shared movement" headline="More detail is shared through direct conversation." accent={COLOR.mahanguGold}>
      <p>
        The public view stays intentionally concise. The important point is the structure: each system has a role, and the stack is designed to move.
      </p>
    </EditorialSection>
  </>
);

const ContactPage = () => (
  <>
    <PublicHero
      mode="contact"
      headline={`Start a conversation with ${BRAND}.`}
      body="For collaboration, institutional interest, or early access conversations, reach out directly."
    />
    <section className="mx-auto max-w-5xl px-6 pb-24 md:px-12">
      <div className="relative border p-8 md:p-10" style={{ background: COLOR.dustLight, borderColor: line }}>
        <PixelCornerMarks hex={COLOR.ochreOrange} size={10} />
        <div className="mb-8 flex items-center gap-3">
          <IconMail size={22} color={COLOR.ochreOrange} />
          <p className="text-xs font-bold uppercase tracking-[0.16em]" style={{ color: quiet }}>Direct inquiry</p>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          <label className="block">
            <span className="text-xs font-bold uppercase tracking-[0.15em]" style={{ color: quiet }}>Email</span>
            <input className="mt-3 w-full border bg-transparent px-4 py-3 outline-none" style={{ borderColor: line }} placeholder="name@institution.na" />
          </label>
          <label className="block">
            <span className="text-xs font-bold uppercase tracking-[0.15em]" style={{ color: quiet }}>Inquiry type</span>
            <input className="mt-3 w-full border bg-transparent px-4 py-3 outline-none" style={{ borderColor: line }} placeholder="Partnership, pilot, access" />
          </label>
          <label className="block md:col-span-2">
            <span className="text-xs font-bold uppercase tracking-[0.15em]" style={{ color: quiet }}>Short note</span>
            <textarea className="mt-3 min-h-36 w-full border bg-transparent px-4 py-3 outline-none" style={{ borderColor: line }} placeholder="What would you like to discuss?" />
          </label>
        </div>
        <button className="mt-8 inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold" style={{ background: COLOR.charBlack, color: COLOR.milletClay }}>
          Contact {BRAND}<IconArrowRight size={14} />
        </button>
      </div>
    </section>
  </>
);

const FullSite = () => (
  <>
    <PublicHero
      mode="full"
      headline="AI systems that Namibia can shape, run, and build on."
      body={`${BRAND} is building domestic capability to adapt, evaluate, deploy, and turn AI systems into useful tools.`}
      primary={{ label: 'Explore the systems', href: '#systems' }}
      secondary={{ label: `Why ${BRAND} exists`, href: '#why' }}
    />
    <EditorialSection id="why" label={`Why ${BRAND}`} headline="Namibia should not only consume AI. It should be able to shape it." accent={COLOR.ochreOrange}>
      <p>AI is becoming part of infrastructure: how knowledge is handled, how decisions are supported, how tools are built, and how services are delivered.</p>
      <p>Without local capability, countries remain dependent on outside providers for model choices, system behavior, language support, evaluation standards, and deployment decisions.</p>
      <p>{BRAND} is building that missing layer. Not a trophy lab. A working capability layer.</p>
    </EditorialSection>
    <EditorialSection label="What we are building" headline="A systems lab for sovereignty, capability, and use." accent={COLOR.barkRust}>
      <p>{BRAND} is not a single product. It is a lab organized around a coherent stack: model and data systems, adaptation workflows, containers, interfaces, and delivery.</p>
      <p>From there, the lab turns those systems into pilots, tools, and applications that can be used in practice.</p>
    </EditorialSection>
    <section className="mx-auto max-w-7xl px-6 pb-10 md:px-12">
      <div className="mb-12 border-b pb-6" style={{ borderColor: line }}>
        <div className="mb-3 flex items-center gap-3">
          <PixelDot color={COLOR.mahanguGold} size={7} />
          <h2 className="text-xs font-bold uppercase tracking-[0.16em]" style={{ color: quiet }}>Five systems</h2>
        </div>
        <p className="max-w-4xl text-2xl font-medium leading-tight tracking-tight md:text-4xl">Five tools. One compound.</p>
      </div>
    </section>
    <SystemsShowcase />
    <EditorialSection id="studio" label="Studio" headline="Built like a lab. Run like a startup." accent={COLOR.mopaneBrown}>
      <p>{BRAND} is structured for making: small teams, clear systems, fast cycles, and real outputs.</p>
      <p>It combines research, systems design, model work, interface building, and applied prototyping in one place.</p>
      <div className="grid gap-3 pt-4 sm:grid-cols-2">
        {studioSteps.map((item, index) => <IconCard key={item.label} item={item} index={index} />)}
      </div>
    </EditorialSection>
    <EditorialSection id="focus" label="Focus" headline="Where sovereignty becomes practical." accent={COLOR.dyePlum}>
      <p>Sovereignty is not a slogan. It becomes real when systems can be adapted, tested, deployed, and used locally.</p>
      <div className="grid gap-3 pt-4">
        {focusItems.map((item, index) => <IconCard key={item.label} item={item} index={index} />)}
      </div>
    </EditorialSection>
    <EditorialSection id="people" label="People" headline="A place for builders." accent={COLOR.ochreOrange}>
      <div className="flex items-start gap-4">
        <IconUsers size={28} color={COLOR.ochreOrange} />
        <p>{BRAND} brings together people working across systems, models, interfaces, and applications. The lab is designed for technical depth, practical experimentation, and shared making.</p>
      </div>
    </EditorialSection>
    <EditorialSection id="contact" label="Contact" headline="Start a conversation." accent={COLOR.barkRust}>
      <p>{BRAND} is being built as a long-term capability for Namibia. For institutional partnerships, early collaboration, or direct inquiries, contact the lab.</p>
      <p><a href="/contact" className="inline-flex items-center gap-2 font-semibold no-underline" style={{ color: COLOR.ochreOrange }}>Contact {BRAND}<IconArrowRight size={14} /></a></p>
    </EditorialSection>
  </>
);

export const OkaandaPublicSite = ({ page }: { page: PublicPage }) => (
  <PublicShell>
    {page === 'systems' && <SelectiveSystems />}
    {page === 'contact' && <ContactPage />}
    {page === 'full' && <FullSite />}
    {page === 'home' && <SelectiveHome />}
  </PublicShell>
);
