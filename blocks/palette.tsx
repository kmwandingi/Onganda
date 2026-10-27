// The "Millet, clay, bark, smoke, ochre." section of /showcase
// Generated from the live showcase. Event handlers and state are stubbed:
// wire them to your own data. Requires @onganda/design-system/style.css.
import { PixelTabs, SectionHeader, SwatchChip, accentFor, roles, useDark } from '@onganda/design-system';

export function MilletClayBarkSmokeOchreSection() {
  const { isDark } = useDark();
  const c = roles(isDark);
  return (
    <section id="palette" className="max-w-7xl mx-auto px-6 pb-24 md:px-12">
      <SectionHeader
        label="Material Palette"
        headline="Millet, clay, bark, smoke, ochre."
        accent={accentFor(0)}
        actions={<PixelTabs
          label="Palette"
          value="onganda"
          tabs={[{ value: "onganda", label: "Onganda" }, { value: "coast", label: "Coast" }, { value: "etosha", label: "Etosha" }, { value: "olupale", label: "Olupale" }, { value: "oshipale", label: "Oshipale" }]}
          onChange={() => {}}
        />}
      />
      <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-9 gap-2">
        <SwatchChip swatch={{ name: "Millet Clay", hex: c.canvas, desc: "Base background", light: true }} />
        <SwatchChip swatch={{ name: "Dust Light", hex: c.surface, desc: "Lifted surface", light: true }} />
        <SwatchChip swatch={{ name: "Mahangu Gold", hex: accentFor(2), desc: "Secondary highlight", light: true }} />
        <SwatchChip swatch={{ name: "Ochre Orange", hex: accentFor(0), desc: "Warm accent", light: false }} />
        <SwatchChip swatch={{ name: "Fired Red", hex: c.dangerBorder, desc: "Primary highlight", light: false }} />
        <SwatchChip swatch={{ name: "Bark Rust", hex: accentFor(1), desc: "Support accent", light: false }} />
        <SwatchChip swatch={{ name: "Mopane Brown", hex: accentFor(3), desc: "Support neutral", light: false }} />
        <SwatchChip swatch={{ name: "Char Black", hex: c.inverse, desc: "Warm dark", light: false }} />
        <SwatchChip swatch={{ name: "Dye Plum", hex: accentFor(4), desc: "Rare accent", light: false }} />
      </div>
    </section>
  );
}
