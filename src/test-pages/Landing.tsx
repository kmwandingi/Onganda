// ─── /test/landing — an editorial page ───────────────────────────────────────
// The public register: section rhythm, texture on grounds, peer cards that
// take successive accents, an inverse cell that closes the grid, a real
// contact surface, the footer.

import {
  OngandaFooter, PixelButton, PixelContactPanel, PixelEditorialSection, PixelField, PixelFocusRow,
  PixelInput, PixelLabCard, PixelTextarea, PixelTicker, SectionHeader, SystemCard, SYSTEMS,
  TEXTURE, TYPE, DISPLAY, WeaveOverlay, accentFor, roles, systemIconForName, IconMail
} from '@onganda/design-system';
import { TestFrame } from './shell';

const FOCUS = [
  { title: 'Adapt models', body: 'Fine-tune open models on Namibian languages and domains.' },
  { title: 'Run them here', body: 'Serve them from infrastructure inside the country.' },
  { title: 'Ship tools', body: 'Put them in front of clinics, farmers and classrooms.' }
];

export const Landing = () => {
  const c = roles(false);
  return (
    <TestFrame current="/test/landing" action={<PixelButton href="#contact">Start a conversation</PixelButton>}>
      <section className="relative overflow-hidden" style={{ background: c.canvas }}>
        <WeaveOverlay opacity={TEXTURE.ground} />
        <div className="relative mx-auto max-w-7xl px-6 pb-12 pt-20 md:px-12">
          <p style={{ fontSize: TYPE.eyebrow.size, fontWeight: TYPE.eyebrow.weight, letterSpacing: TYPE.eyebrow.tracking, textTransform: 'uppercase', color: c.textMuted }}>
            Namibia Applied AI Lab
          </p>
          <h1 style={{ fontSize: DISPLAY.heroPublic.css, fontWeight: TYPE.display.weight, lineHeight: 1.02, margin: '20px 0 24px', maxWidth: 900 }}>
            Sovereign AI, built where it is used.
          </h1>
          <p style={{ fontSize: TYPE.lead.size, lineHeight: TYPE.lead.lineHeight, color: c.textBody, maxWidth: 620 }}>
            Five systems that take a model from raw data to a tool in someone's hands.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <PixelButton href="#systems">See the systems</PixelButton>
            <PixelButton href="#why" variant="ghost">Why Onganda</PixelButton>
          </div>
        </div>
        <PixelTicker />
      </section>

      <section id="systems" className="mx-auto max-w-7xl px-6 py-20 md:px-12">
        <SectionHeader label="System architecture" headline="Five tools. One workshop." />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {SYSTEMS.map((sys, i) => <SystemCard key={sys.name} sys={sys} idx={i} />)}
          <PixelLabCard tag="Lab" title="The Institute" accent={accentFor(0)} footer={<PixelButton variant="accent" isDark>Read the manifesto</PixelButton>}>
            Applied research, piloting and technology transfer.
          </PixelLabCard>
        </div>
      </section>

      <section id="why" className="mx-auto max-w-7xl px-6 pb-20 md:px-12">
        <SectionHeader label="Why Onganda" headline="Three things, in order." />
        <div className="grid gap-3">
          {FOCUS.map((f, i) => (
            <PixelFocusRow key={f.title} index={i} accent={accentFor(i)} title={f.title} icon={systemIconForName(SYSTEMS[i].name, 24)}>
              {f.body}
            </PixelFocusRow>
          ))}
        </div>
      </section>

      <PixelEditorialSection label="The approach" headline="Local data, local models, local tools.">
        Most language technology reaches Namibia last, translated from somewhere else. The lab starts from the
        languages people speak here and the problems they already have, and builds outward from there.
      </PixelEditorialSection>

      <PixelContactPanel id="contact" eyebrow="Contact" headline="Start a conversation." icon={<IconMail size={24} color={c.accentInk} />}
          aside={<p style={{ fontSize: TYPE.body.size, lineHeight: TYPE.body.lineHeight, color: c.textBody }}>For pilots, partnerships and research access.</p>}>
          <div className="grid gap-4">
            <PixelField label="Email" htmlFor="c-email"><PixelInput id="c-email" placeholder="name@institution.na" /></PixelField>
            <PixelField label="Note" htmlFor="c-note"><PixelTextarea id="c-note" rows={3} placeholder="What would you like to discuss?" /></PixelField>
            <div><PixelButton>Send</PixelButton></div>
          </div>
      </PixelContactPanel>

      <OngandaFooter />
    </TestFrame>
  );
};
