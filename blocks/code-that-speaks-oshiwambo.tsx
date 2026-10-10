// The "Code that speaks Oshiwambo." section of /showcase
// Generated from the live showcase. Event handlers and state are stubbed:
// wire them to your own data. Requires @onganda/design-system/style.css.
import { CodeSnippetBlock, SectionHeader, TerminalCard, accentFor, roles, useDark } from '@onganda/design-system';

export function CodeThatSpeaksOshiwamboSection() {
  const { isDark } = useDark();
  const c = roles(isDark);
  return (
    <section className="max-w-7xl mx-auto px-6 pb-24 md:px-12">
      <SectionHeader
        label="Developer Surface"
        headline="Code that speaks Oshiwambo."
        accent={accentFor(1)}
      />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <TerminalCard block={{ title: "Oshini — Fine-Tune Pipeline", tag: "02", tagHex: c.focusRing, lines: [{ type: "comment", text: "# Oshini · adaptation workflow" }, { type: "comment", text: "# from raw grain to processed flour" }, { type: "plain", text: "" }, { type: "keyword", text: "from" }, { type: "plain", text: " oshini.pipeline " }, { type: "keyword", text: "import" }, { type: "plain", text: " FineTuneJob" }, { type: "plain", text: "" }, { type: "plain", text: "job = FineTuneJob(" }, { type: "plain", text: "    base_model=" }, { type: "string", text: "\"okaanda/namibia-base-1b\"" }, { type: "plain", text: "," }, /* …11 more */] }} />
        <TerminalCard block={{ title: "Okaanda — Model Query", tag: "01", tagHex: c.actionBg, lines: [{ type: "comment", text: "# Okaanda · granary data platform" }, { type: "comment", text: "# retrieve stored evaluation record" }, { type: "plain", text: "" }, { type: "keyword", text: "from" }, { type: "plain", text: " okaanda.client " }, { type: "keyword", text: "import" }, { type: "plain", text: " GranaryClient" }, { type: "plain", text: "" }, { type: "plain", text: "client = GranaryClient(" }, { type: "plain", text: "    api_key=os.environ[" }, { type: "string", text: "\"ONGANDA_API_KEY\"" }, { type: "plain", text: "]" }, /* …10 more */] }} />
      </div>
      <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2">
        <div className="flex-1 h-px bg-(--onganda-text)/8" />
        <span className="min-w-0 text-center text-[10px] font-bold uppercase tracking-[0.15em] text-(--onganda-text-muted)">
          Oshini SDK · Okaanda Client · Ombiga Runtime
        </span>
        <div className="flex-1 h-px bg-(--onganda-text)/8" />
      </div>
      <CodeSnippetBlock
        label="TerminalCard · Developer Surface"
        lines={[{ type: "comment", text: "// Developer Surface — render a TerminalCard" }, { type: "import", text: "import { TerminalCard } from '@onganda/design-system';" }, { type: "import", text: "import { TERMINAL_BLOCKS } from '@onganda/design-system';" }, { type: "plain", text: "" }, { type: "comment", text: "// Each block has title, tag, tagHex, and an array of typed lines" }, { type: "plain", text: "const block = {" }, { type: "prop", text: "  title: 'Oshini — Fine-Tune Pipeline'," }, { type: "prop", text: `  tag: '02', tagHex: '${c.focusRing}',` }, { type: "prop", text: "  lines: [" }, { type: "string", text: "    { type: 'comment', text: '# oshini · adaptation workflow' }," }, { type: "string", text: "    { type: 'keyword', text: 'from' }," }, { type: "string", text: "    { type: 'plain', text: ' oshini.pipeline import FineTuneJob' }," }, /* …4 more */]}
        accentHex={c.focusRing}
      />
    </section>
  );
}
