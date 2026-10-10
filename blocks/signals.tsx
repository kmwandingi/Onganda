// The "signals" section of /showcase
// Generated from the live showcase. Event handlers and state are stubbed:
// wire them to your own data. Requires @onganda/design-system/style.css.
import { StatCard, accentFor } from '@onganda/design-system';

export function SignalsSection() {
  return (
    <section id="signals" className="w-full border-y border-(--onganda-line) bg-(--onganda-surface)">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-(--onganda-line)">
          <StatCard stat={{ value: "5", label: "Active Systems", sub: "in architecture", hex: accentFor(0) }} />
          <StatCard stat={{ value: "3", label: "Language Models", sub: "adapted for Namibia", hex: accentFor(1) }} />
          <StatCard stat={{ value: "12", label: "Sector Pilots", sub: "across 4 industries", hex: accentFor(2) }} />
          <StatCard stat={{ value: "1", label: "Sovereign Lab", sub: "Windhoek, Namibia", hex: accentFor(3) }} />
        </div>
      </div>
    </section>
  );
}
