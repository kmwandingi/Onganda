// The "Pixelated by design. Oshiwambo by name." section of /showcase
// Generated from the live showcase. Event handlers and state are stubbed:
// wire them to your own data. Requires @onganda/design-system/style.css.
import { PrincipleRow, SectionHeader, accentFor } from '@onganda/design-system';

export function PixelatedByDesignOshiwamboByNameSection() {
  return (
    <section id="language" className="max-w-7xl mx-auto px-6 pb-24 md:px-12">
      <SectionHeader
        label="Brand Principles"
        headline="Pixelated by design. Oshiwambo by name."
        accent={accentFor(4)}
      />
      <dl className="divide-y divide-(--onganda-char-black)/10">
        <PrincipleRow
          principle={{ label: "Language", value: "Oshiwambo first. English second." }}
          idx={0}
        />
        <PrincipleRow
          principle={{ label: "Symbol", value: "Pixel by default — icon, diagram, texture, mark." }}
          idx={1}
        />
        <PrincipleRow
          principle={{ label: "Type", value: "Non-pixel by default — body, reading, interface." }}
          idx={2}
        />
        <PrincipleRow
          principle={{ label: "Palette", value: "Millet, clay, bark, smoke, ochre, dried grass." }}
          idx={3}
        />
        <PrincipleRow
          principle={{ label: "Layout", value: "Calm and editorial. Anthropic-level whitespace discipline." }}
          idx={4}
        />
      </dl>
    </section>
  );
}
