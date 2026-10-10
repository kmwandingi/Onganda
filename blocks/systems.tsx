// The "Five tools. One workshop." section of /showcase
// Generated from the live showcase. Event handlers and state are stubbed:
// wire them to your own data. Requires @onganda/design-system/style.css.
import { PixelButton, PixelLabCard, SectionHeader, SystemCard, accentFor, roles, useDark } from '@onganda/design-system';

export function FiveToolsOneWorkshopSection() {
  const { isDark } = useDark();
  const c = roles(isDark);
  return (
    <section id="systems" className="max-w-7xl mx-auto px-6 pb-24 md:px-12 pt-16">
      <SectionHeader
        label="System Architecture"
        headline="Five tools. One workshop."
        accent={accentFor(2)}
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <SystemCard
          sys={{ name: "Okaanda", english: "Granary", role: "Model & Data Platform", desc: "Storage, resilience, readiness, and future capacity. Repositories for evaluation, memory, and large-scale datasets. The foundation that holds before it feeds.", line: "Storage, readiness, and model organization.", long: "Okaanda is the granary: the storage and readiness layer. It holds datasets, evaluation structures, model organization, and the internal order that makes the rest of the stack usable.", accent: "bg-(--onganda-ochre-orange)/8 border-(--onganda-ochre-orange)/25", iconColor: c.actionBg, borderHex: c.actionBg }}
          idx={0}
        />
        <SystemCard
          sys={{ name: "Oshini", english: "Mill", role: "Adaptation Workflows", desc: "Raw material to refined output. Fine-tuning, distillation, compression, and evaluation pipelines. The sequence from grain to flour.", line: "Adaptation, transformation, and workflow.", long: "Oshini is where raw material becomes usable capability. It carries the workflows for fine-tuning, distillation, compression, evaluation, and model adaptation.", accent: "bg-(--onganda-bark-rust)/8 border-(--onganda-bark-rust)/25", iconColor: c.focusRing, borderHex: c.accentInk }}
          idx={1}
        />
        <SystemCard
          sys={{ name: "Ombiga", english: "Vessel", role: "Agents & Containers", desc: "Holding, carrying, and preserving. Runtimes for agents, memory systems, and model containers. Shape that makes liquid usable.", line: "Containers, agents, and held systems.", long: "Ombiga holds systems in a form that can travel. It is the layer for containers, agent runtimes, memory, and portable units of work.", accent: "bg-(--onganda-mahangu-gold)/10 border-(--onganda-mahangu-gold)/30", iconColor: c.accentBg, borderHex: c.accentBg }}
          idx={2}
        />
        <SystemCard
          sys={{ name: "Etiti", english: "Surface", role: "Interfaces & Dashboards", desc: "The woven place where things are set down and shared. User interfaces, workspaces, and read surfaces. Where the work meets the hand.", line: "User surfaces, dashboards, and interfaces.", long: "Etiti is the surface where people meet the system. It turns model work into dashboards, review spaces, workbenches, and interfaces that can be understood and controlled.", accent: "bg-(--onganda-mopane-brown)/8 border-(--onganda-mopane-brown)/25", iconColor: c.actionHoverBg, borderHex: c.actionHoverBg }}
          idx={3}
        />
        <SystemCard
          sys={{ name: "Oshitoo", english: "Delivery", role: "Applications & Sector Products", desc: "The large round-bellied vessel used to hold and serve traditional beer. Carried to where the gathering is. Sector applications, field products, and user-facing deployments — the last pour of sovereign intelligence.", line: "Applications, outputs, and delivered tools.", long: "Oshitoo is the delivery layer. It is where the lab turns internal capability into pilots, applications, and sector-facing products prepared for real use.", accent: "bg-(--onganda-dye-plum)/8 border-(--onganda-dye-plum)/25", iconColor: c.accentHoverBg, borderHex: c.accentHoverBg }}
          idx={4}
        />
        <PixelLabCard
          tag="Institute"
          title="The Institute"
          accent={accentFor(0)}
          footer={<PixelButton variant="accent" isDark className="relative self-start">Read the manifesto</PixelButton>}
        >
          A science and technology park driving applied research, piloting, and technology transfer. Sovereign AI infrastructure for Namibia.
        </PixelLabCard>
      </div>
    </section>
  );
}
