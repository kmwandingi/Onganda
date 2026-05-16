import React from 'react';
import {
  COLOR,
  SYSTEMS
} from './okaanda-tokens';
import {
  DarkContext,
  DitherBar,
  OkaandaLogoMark,
  PixelCornerMarks,
  PixelDot,
  PixelTag,
  SectionHeader,
  WeaveOverlay
} from './okaanda-primitives';

type PublicPage = 'home' | 'systems' | 'contact' | 'full';

const muted = 'rgb(30 26 23 / 62%)';
const quiet = 'rgb(30 26 23 / 42%)';
const line = 'rgb(30 26 23 / 10%)';
const lineStrong = 'rgb(30 26 23 / 16%)';

const navItems = [
  { href: '/', label: 'Home' },
  { href: '/systems', label: 'Systems' },
  { href: '/contact', label: 'Contact' },
  { href: '/full', label: 'Full site' },
  { href: '/showcase', label: 'Showcase' }
];

const fullSections = [
  { id: 'why', label: 'Why Okaanda' },
  { id: 'systems', label: 'Systems' },
  { id: 'studio', label: 'Studio' },
  { id: 'focus', label: 'Focus' },
  { id: 'people', label: 'People' },
  { id: 'contact', label: 'Contact' }
];

const focusAreas = [
  'AI adaptation and evaluation',
  'Local deployment workflows',
  'Agents and applied interfaces',
  'Public-interest and institutional systems',
  'Sector tools that can move from internal stack to real use'
];

const studioSteps = [
  'Build the stack',
  'Test the system',
  'Turn it into a usable interface',
  'Deliver it as a real tool'
];

const systemLine = (name: string) => {
  if (name === 'Okaanda') return 'Storage, readiness, and model organization.';
  if (name === 'Oshini') return 'Adaptation, transformation, and workflow.';
  if (name === 'Ombiga') return 'Containers, agents, and held systems.';
  if (name === 'Etiti') return 'User surfaces, dashboards, and interfaces.';
  return 'Applications, outputs, and delivered tools.';
};

const systemLong = (name: string) => {
  if (name === 'Okaanda') {
    return 'Okaanda is the storage and readiness layer of the lab. It holds datasets, evaluation structures, model organization, and the internal order that makes the rest of the stack usable.';
  }
  if (name === 'Oshini') {
    return 'Oshini is where raw material becomes usable capability. It carries the workflows for fine-tuning, distillation, compression, evaluation, and model adaptation.';
  }
  if (name === 'Ombiga') {
    return 'Ombiga holds systems in a form that can travel. It is the layer for containers, agent runtimes, memory, and portable units of work.';
  }
  if (name === 'Etiti') {
    return 'Etiti is the surface where people meet the system. It turns model work into dashboards, review spaces, workbenches, and interfaces that can be understood and controlled.';
  }
  return 'Oshitoo is the delivery layer. It is where the lab turns internal capability into pilots, applications, and sector-facing products prepared for real use.';
};

const PublicNav = () => (
  <header className="sticky top-0 z-40 border-b backdrop-blur" style={{
    background: 'rgb(232 225 207 / 92%)',
    borderColor: line
  }}>
    <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-6 py-4 md:px-12">
      <a href="/" className="flex items-center gap-3 no-underline" style={{ color: COLOR.charBlack }}>
        <OkaandaLogoMark size={22} />
        <div>
          <p className="text-sm font-semibold leading-none tracking-tight">Okaanda</p>
          <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.16em]" style={{ color: quiet }}>
            Namibia AI Systems Lab
          </p>
        </div>
      </a>
      <nav className="hidden items-center gap-1 md:flex" aria-label="Primary">
        {navItems.map(item => (
          <a
            key={item.href}
            href={item.href}
            className="px-3 py-2 text-xs font-bold uppercase tracking-[0.13em] no-underline transition-colors"
            style={{ color: quiet }}
          >
            {item.label}
          </a>
        ))}
      </nav>
    </div>
  </header>
);

const PublicShell = ({ children }: { children: React.ReactNode }) => (
  <DarkContext.Provider value={{ isDark: false, toggle: () => {} }}>
    <div className="min-h-screen" style={{
      background: COLOR.milletClay,
      color: COLOR.charBlack,
      fontFamily: 'Inter, Arial, sans-serif'
    }}>
      <PublicNav />
      {children}
      <footer className="border-t px-6 py-10 md:px-12" style={{ borderColor: line }}>
        <div className="mx-auto flex max-w-7xl flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-semibold">Okaanda</p>
            <p className="mt-2 max-w-md text-sm leading-relaxed" style={{ color: muted }}>
              AI systems that Namibia can shape, run, and build on.
            </p>
          </div>
          <div className="flex gap-1" aria-hidden="true">
            {[COLOR.ochreOrange, COLOR.barkRust, COLOR.mahanguGold, COLOR.mopaneBrown, COLOR.dyePlum].map(hex => (
              <PixelDot key={hex} color={hex} size={10} />
            ))}
          </div>
        </div>
      </footer>
    </div>
  </DarkContext.Provider>
);

const HeroPanel = ({
  label,
  headline,
  body,
  primary,
  secondary
}: {
  label: string;
  headline: string;
  body: string;
  primary?: { label: string; href: string };
  secondary?: { label: string; href: string };
}) => (
  <section className="relative overflow-hidden px-6 py-20 md:px-12 md:py-28">
    <WeaveOverlay opacity={0.045} />
    <div className="relative mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
      <div>
        <div className="mb-8 flex items-center gap-3">
          <PixelTag hex={COLOR.ochreOrange} label="ROOT" />
          <span className="text-xs font-bold uppercase tracking-[0.16em]" style={{ color: quiet }}>{label}</span>
        </div>
        <h1 className="max-w-5xl text-5xl font-semibold leading-[0.94] tracking-tight md:text-7xl">
          {headline}
        </h1>
        <p className="mt-8 max-w-2xl text-lg leading-relaxed md:text-xl" style={{ color: muted }}>
          {body}
        </p>
        {(primary || secondary) && (
          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            {primary && <a href={primary.href} className="inline-flex px-6 py-3 text-sm font-semibold no-underline" style={{ background: COLOR.charBlack, color: COLOR.milletClay }}>{primary.label}</a>}
            {secondary && <a href={secondary.href} className="inline-flex border px-6 py-3 text-sm font-semibold no-underline" style={{ borderColor: lineStrong, color: COLOR.charBlack }}>{secondary.label}</a>}
          </div>
        )}
      </div>
      <div className="relative border p-7" style={{ background: COLOR.dustLight, borderColor: line }}>
        <PixelCornerMarks hex={COLOR.ochreOrange} size={9} />
        <p className="text-xs font-bold uppercase tracking-[0.16em]" style={{ color: quiet }}>Capability path</p>
        <div className="mt-7 flex flex-col gap-0">
          {SYSTEMS.map((sys, index) => (
            <div key={sys.name} className="flex items-center gap-4 border-t py-4 first:border-t-0 first:pt-0" style={{ borderColor: line }}>
              <PixelTag hex={sys.borderHex} label={String(index + 1).padStart(2, '0')} />
              <div>
                <p className="font-semibold leading-none">{sys.name}</p>
                <p className="mt-1 text-sm" style={{ color: muted }}>{sys.role}</p>
              </div>
            </div>
          ))}
        </div>
        <DitherBar color={COLOR.ochreOrange} segments={30} height={3} opacity={0.55} className="mt-4" />
      </div>
    </div>
  </section>
);

const TextSection = ({ id, label, headline, children }: {
  id?: string;
  label: string;
  headline: string;
  children: React.ReactNode;
}) => (
  <section id={id} className="mx-auto max-w-7xl px-6 pb-24 md:px-12">
    <SectionHeader label={label} headline={headline} />
    <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
      <div className="hidden lg:block">
        <DitherBar color={COLOR.ochreOrange} segments={36} height={4} opacity={0.36} />
      </div>
      <div className="space-y-5 text-base leading-relaxed md:text-lg" style={{ color: muted }}>
        {children}
      </div>
    </div>
  </section>
);

const SystemRows = ({ concise = false }: { concise?: boolean }) => (
  <div className="mx-auto grid max-w-7xl gap-3 px-6 pb-24 md:px-12">
    {SYSTEMS.map((sys, index) => (
      <article key={sys.name} className="relative border p-6 md:grid md:grid-cols-[220px_1fr] md:gap-8 md:p-8" style={{
        background: COLOR.dustLight,
        borderColor: line
      }}>
        <div className="flex items-center gap-4">
          <PixelTag hex={sys.borderHex} label={String(index + 1).padStart(2, '0')} />
          <div>
            <h2 className="text-xl font-semibold tracking-tight">{sys.name}</h2>
            <p className="mt-1 text-sm font-medium" style={{ color: sys.borderHex }}>{sys.english}</p>
          </div>
        </div>
        <div className="mt-5 md:mt-0">
          <p className="text-xs font-bold uppercase tracking-[0.15em]" style={{ color: quiet }}>{sys.role}</p>
          <p className="mt-3 max-w-3xl text-base leading-relaxed" style={{ color: muted }}>
            {concise ? systemLine(sys.name) : systemLong(sys.name)}
          </p>
        </div>
        <div className="absolute left-0 top-0 h-full w-[3px]" style={{ background: sys.borderHex }} aria-hidden="true" />
      </article>
    ))}
  </div>
);

const SelectiveHome = () => (
  <>
    <HeroPanel
      label="Namibia AI Systems Lab"
      headline="A new lab for AI systems that can be shaped locally."
      body="Okaanda is building the capability to adapt, evaluate, deploy, and turn AI systems into useful tools. More will be shared in time. For now, the lab is opening conversations."
      primary={{ label: 'Request a conversation', href: '/contact' }}
      secondary={{ label: 'View the systems', href: '/systems' }}
    />
    <TextSection id="why" label="Why Okaanda" headline="Useful systems need local control over how they work.">
      <p>
        AI capability is becoming part of national capacity. Okaanda is being built so that systems can be shaped, tested, and delivered with local control over their behavior, deployment, and use.
      </p>
    </TextSection>
    <section className="mx-auto max-w-7xl px-6 pb-24 md:px-12">
      <SectionHeader label="Systems" headline="Five systems. One compound." />
      <div className="grid gap-3 md:grid-cols-5">
        {SYSTEMS.map((sys, index) => (
          <a key={sys.name} href="/systems" className="border p-5 no-underline" style={{ background: COLOR.dustLight, borderColor: line, color: COLOR.charBlack }}>
            <PixelTag hex={sys.borderHex} label={String(index + 1).padStart(2, '0')} />
            <p className="mt-5 text-lg font-semibold">{sys.name}</p>
            <p className="mt-2 text-sm" style={{ color: muted }}>{sys.english}</p>
          </a>
        ))}
      </div>
      <p className="mt-8 max-w-xl text-base leading-relaxed" style={{ color: muted }}>
        Together, they form the internal architecture of the lab.
      </p>
    </section>
    <TextSection id="invitation" label="Invitation" headline="For those who want to see what is being built">
      <p>
        The lab is still selective in what it shares publicly. For institutional interest, collaboration, or early conversations, contact Okaanda directly.
      </p>
      <p><a href="/contact" className="font-semibold no-underline" style={{ color: COLOR.ochreOrange }}>Contact the lab</a></p>
    </TextSection>
  </>
);

const SelectiveSystems = () => (
  <>
    <HeroPanel
      label="Internal architecture"
      headline="Five linked systems, from storage to delivery."
      body="Okaanda is built around systems that move from readiness and adaptation to interface and delivered tools. More detail is shared through direct conversation."
    />
    <SystemRows concise />
  </>
);

const ContactPage = () => (
  <>
    <HeroPanel
      label="Contact"
      headline="Start a conversation with Okaanda."
      body="For collaboration, institutional interest, or early access conversations, reach out directly."
    />
    <section className="mx-auto max-w-4xl px-6 pb-24 md:px-12">
      <div className="relative border p-8 md:p-10" style={{ background: COLOR.dustLight, borderColor: line }}>
        <PixelCornerMarks hex={COLOR.ochreOrange} size={10} />
        <div className="grid gap-6 md:grid-cols-2">
          <label className="block">
            <span className="text-xs font-bold uppercase tracking-[0.15em]" style={{ color: quiet }}>Email</span>
            <input className="mt-3 w-full border bg-transparent px-4 py-3 outline-none" style={{ borderColor: lineStrong }} placeholder="name@institution.na" />
          </label>
          <label className="block">
            <span className="text-xs font-bold uppercase tracking-[0.15em]" style={{ color: quiet }}>Inquiry type</span>
            <input className="mt-3 w-full border bg-transparent px-4 py-3 outline-none" style={{ borderColor: lineStrong }} placeholder="Partnership, pilot, access" />
          </label>
          <label className="block md:col-span-2">
            <span className="text-xs font-bold uppercase tracking-[0.15em]" style={{ color: quiet }}>Short note</span>
            <textarea className="mt-3 min-h-36 w-full border bg-transparent px-4 py-3 outline-none" style={{ borderColor: lineStrong }} placeholder="What would you like to discuss?" />
          </label>
        </div>
        <button className="mt-8 px-6 py-3 text-sm font-semibold" style={{ background: COLOR.charBlack, color: COLOR.milletClay }}>
          Contact Okaanda
        </button>
      </div>
    </section>
  </>
);

const FullSite = () => (
  <>
    <section className="border-b px-6 py-4 md:px-12" style={{ borderColor: line }}>
      <div className="mx-auto flex max-w-7xl flex-wrap gap-2">
        {fullSections.map(section => (
          <a key={section.id} href={`#${section.id}`} className="border px-3 py-2 text-[10px] font-bold uppercase tracking-[0.15em] no-underline" style={{ borderColor: line, color: quiet }}>
            {section.label}
          </a>
        ))}
      </div>
    </section>
    <HeroPanel
      label="Namibia AI Systems Lab"
      headline="AI systems that Namibia can shape, run, and build on."
      body="Okaanda is building the domestic capability to adapt, evaluate, deploy, and turn AI systems into useful tools."
      primary={{ label: 'Explore the systems', href: '#systems' }}
      secondary={{ label: 'Why Okaanda exists', href: '#why' }}
    />
    <TextSection id="why" label="Why this lab exists" headline="Namibia should not only consume AI. It should be able to shape it.">
      <p>
        AI is becoming part of infrastructure: how knowledge is handled, how decisions are supported, how tools are built, and how services are delivered.
      </p>
      <p>
        Without local capability, countries remain dependent on outside providers for model choices, system behavior, language support, evaluation standards, and deployment decisions.
      </p>
      <p>
        Okaanda is building that missing layer. Not a trophy lab. A working capability layer.
      </p>
    </TextSection>
    <TextSection label="What we are building" headline="A systems lab for sovereignty, capability, and use.">
      <p>
        Okaanda is not a single product. It is a lab organized around a coherent stack: model and data systems, adaptation workflows, containers, interfaces, and delivery.
      </p>
      <p>
        From there, the lab turns those systems into pilots, tools, and applications that can be used in practice.
      </p>
    </TextSection>
    <section id="systems" className="mx-auto max-w-7xl px-6 pb-10 md:px-12">
      <SectionHeader label="Five systems" headline="Five tools. One compound." />
      <p className="max-w-3xl pb-10 text-lg leading-relaxed" style={{ color: muted }}>
        Okaanda is structured as five linked systems. Each one has a local name and a clear role.
      </p>
    </section>
    <SystemRows />
    <TextSection id="studio" label="Studio" headline="Built like a lab. Run like a startup.">
      <p>
        Okaanda is structured for making: small teams, clear systems, fast cycles, and real outputs.
      </p>
      <p>
        It combines research, systems design, model work, interface building, and applied prototyping in one place. The goal is not to generate demos. The goal is to build reusable capability that can become dependable tools.
      </p>
      <div className="grid gap-2 pt-3 sm:grid-cols-2">
        {studioSteps.map((step, index) => (
          <div key={step} className="border p-4" style={{ borderColor: line, background: COLOR.dustLight }}>
            <PixelTag hex={COLOR.ochreOrange} label={String(index + 1).padStart(2, '0')} />
            <p className="mt-4 font-semibold" style={{ color: COLOR.charBlack }}>{step}</p>
          </div>
        ))}
      </div>
    </TextSection>
    <TextSection id="focus" label="Focus" headline="Where sovereignty becomes practical.">
      <p>
        Sovereignty is not a slogan. It becomes real when systems can be adapted, tested, deployed, and used locally.
      </p>
      <div className="grid gap-2 pt-3">
        {focusAreas.map(area => (
          <div key={area} className="flex items-center gap-3 border p-4" style={{ borderColor: line, background: COLOR.dustLight }}>
            <PixelDot color={COLOR.barkRust} size={8} />
            <span style={{ color: COLOR.charBlack }}>{area}</span>
          </div>
        ))}
      </div>
    </TextSection>
    <TextSection id="people" label="People" headline="A place for builders.">
      <p>
        Okaanda brings together people working across systems, models, interfaces, and applications. The lab is designed for technical depth, practical experimentation, and shared making.
      </p>
    </TextSection>
    <TextSection id="contact" label="Contact" headline="Start a conversation.">
      <p>
        Okaanda is being built as a long-term capability for Namibia. For institutional partnerships, early collaboration, or direct inquiries, contact the lab.
      </p>
      <p><a href="/contact" className="font-semibold no-underline" style={{ color: COLOR.ochreOrange }}>Contact Okaanda</a></p>
    </TextSection>
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
