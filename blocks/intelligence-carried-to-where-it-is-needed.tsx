// The "Intelligence carried to where it is needed." section of /showcase
// Generated from the live showcase. Event handlers and state are stubbed:
// wire them to your own data. Requires @onganda/design-system/style.css.
import { CodeSnippetBlock, FieldAppCard, PixelButton, SectionHeader, WeaveOverlay, accentFor, roles, useDark } from '@onganda/design-system';

export function IntelligenceCarriedToWhereItIsNeededSection() {
  const { isDark } = useDark();
  const c = roles(isDark);
  return (
    <section className="max-w-7xl mx-auto px-6 pb-24 md:px-12">
      <SectionHeader
        label="Field Applications"
        headline="Intelligence carried to where it is needed."
        accent={accentFor(0)}
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FieldAppCard
          app={{ name: "OshitooHealth", oshiwambo: "Oshitoo", sector: "Healthcare", desc: "AI triage and clinical decision support for rural clinics. Deployed in Northern Namibia.", hex: accentFor(4), tag: "H–01" }}
          idx={0}
        />
        <FieldAppCard
          app={{ name: "OshiniAgro", oshiwambo: "Oshini", sector: "Agriculture", desc: "Crop failure prediction and soil analysis pipelines adapted for Namibian growing regions.", hex: accentFor(1), tag: "A–02" }}
          idx={1}
        />
        <FieldAppCard
          app={{ name: "OkaandaEdu", oshiwambo: "Okaanda", sector: "Education", desc: "Oshiwambo-first learning models. Curriculum-aligned reading and assessment tools.", hex: accentFor(0), tag: "E–03" }}
          idx={2}
        />
        <FieldAppCard
          app={{ name: "EtitiGov", oshiwambo: "Etiti", sector: "Public Sector", desc: "Read surfaces and dashboards for government programme monitoring and civic AI.", hex: accentFor(3), tag: "G–04" }}
          idx={3}
        />
      </div>
      <div
        className="relative mt-5 bg-(--onganda-inverse) flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 px-7 py-6 overflow-hidden"
        style={{  }}
        data-onganda-enter=""
      >
        <WeaveOverlay isDark opacity={0.035} />
        <div className="relative">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-(--onganda-action-bg) mb-1">
            Partner with us
          </p>
          <p className="text-sm text-(--onganda-text-on-inverse)/55 max-w-md leading-relaxed">
            We are seeking sector partners in health, agriculture, education, and public administration.
          </p>
        </div>
        <PixelButton variant="accent" isDark className="relative shrink-0">Propose a pilot</PixelButton>
      </div>
      <CodeSnippetBlock
        label="FieldAppCard · Field Applications"
        lines={[{ type: "comment", text: "// Field Applications — render FieldAppCard" }, { type: "import", text: "import { FieldAppCard } from '@onganda/design-system';" }, { type: "import", text: "import { SECTOR_APPS } from '@onganda/design-system';" }, { type: "plain", text: "" }, { type: "comment", text: "// A SectorApp entry" }, { type: "plain", text: "const app = {" }, { type: "prop", text: "  name: 'OshitooHealth', oshiwambo: 'Oshitoo'," }, { type: "prop", text: `  sector: 'Healthcare', hex: '${c.accentHoverBg}', tag: 'H–01',` }, { type: "prop", text: "  desc: 'AI triage and clinical decision support...'," }, { type: "plain", text: "};" }, { type: "plain", text: "" }, { type: "tag", text: "<div className=\"grid grid-cols-1 sm:grid-cols-2 gap-4\">" }, /* …4 more */]}
        accentHex={c.accentHoverBg}
      />
    </section>
  );
}
