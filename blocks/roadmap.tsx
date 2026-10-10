// The "Five phases. One direction." section of /showcase
// Generated from the live showcase. Event handlers and state are stubbed:
// wire them to your own data. Requires @onganda/design-system/style.css.
import { CodeSnippetBlock, PixelTag, SectionHeader, accentFor, roles, useDark } from '@onganda/design-system';

export function FivePhasesOneDirectionSection() {
  const { isDark } = useDark();
  const c = roles(isDark);
  return (
    <section id="roadmap" className="max-w-7xl mx-auto px-6 pb-24 md:px-12">
      <SectionHeader
        label="Development Roadmap"
        headline="Five phases. One direction."
        accent={accentFor(4)}
      />
      <div className="hidden lg:block relative mb-14" aria-hidden="true">
        <div className="h-px bg-(--onganda-char-black)/12 w-full" />
        <div className="absolute top-0 left-0 w-full flex">
          <div
            className="flex-1 flex flex-col items-center"
            style={{ transform: "translateY(-50%)" }}
          >
            <div
              className="w-2.5 h-2.5"
              style={{ background: c.actionBg, border: `2px solid ${c.actionBg}` }}
            />
          </div>
          <div
            className="flex-1 flex flex-col items-center"
            style={{ transform: "translateY(-50%)" }}
          >
            <div
              className="w-2.5 h-2.5"
              style={{ background: c.dangerBg, border: `2px solid ${c.accentInk}` }}
            />
          </div>
          <div
            className="flex-1 flex flex-col items-center"
            style={{ transform: "translateY(-50%)" }}
          >
            <div
              className="w-2.5 h-2.5"
              style={{ background: c.accentBg, border: `2px solid ${c.accentBg}` }}
            />
          </div>
          <div
            className="flex-1 flex flex-col items-center"
            style={{ transform: "translateY(-50%)" }}
          >
            <div
              className="w-2.5 h-2.5"
              style={{ background: c.inverseBorder, border: `2px solid ${c.actionHoverBg}` }}
            />
          </div>
          <div
            className="flex-1 flex flex-col items-center"
            style={{ transform: "translateY(-50%)" }}
          >
            <div
              className="w-2.5 h-2.5"
              style={{ background: c.inverseBorder, border: `2px solid ${c.accentHoverBg}` }}
            />
          </div>
        </div>
        <div className="flex mt-3">
          <div className="flex-1 text-center">
            <span
              className="text-[9px] font-bold uppercase tracking-[0.14em]"
              style={{ color: accentFor(0), opacity: 0.7 }}
            >
              Q1 – Q2 2024
            </span>
          </div>
          <div className="flex-1 text-center">
            <span
              className="text-[9px] font-bold uppercase tracking-[0.14em]"
              style={{ color: accentFor(1), opacity: 0.7 }}
            >
              Q3 – Q4 2024
            </span>
          </div>
          <div className="flex-1 text-center">
            <span
              className="text-[9px] font-bold uppercase tracking-[0.14em]"
              style={{ color: accentFor(2), opacity: 0.7 }}
            >
              Q1 – Q2 2025
            </span>
          </div>
          <div className="flex-1 text-center">
            <span
              className="text-[9px] font-bold uppercase tracking-[0.14em]"
              style={{ color: accentFor(3), opacity: 0.7 }}
            >
              Q3 2025
            </span>
          </div>
          <div className="flex-1 text-center">
            <span
              className="text-[9px] font-bold uppercase tracking-[0.14em]"
              style={{ color: accentFor(4), opacity: 0.7 }}
            >
              Q4 2025 – Q1 2026
            </span>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-0 divide-y divide-(--onganda-char-black)/10">
        <div
          className="flex flex-col lg:flex-row gap-6 lg:gap-10 py-8 group"
          style={{  }}
          data-onganda-enter=""
        >
          <div className="lg:w-40 shrink-0 flex flex-row lg:flex-col gap-3 lg:gap-2 items-center lg:items-start">
            <PixelTag hex={accentFor(0)} label="P–01" />
            <div className="flex items-center gap-1.5">
              <div className="flex gap-0.5" aria-hidden="true">
                <div
                  className="w-1.5 h-1.5"
                  style={{ background: c.actionBg, border: `1px solid ${c.actionBg}`, opacity: 1 }}
                />
                <div
                  className="w-1.5 h-1.5"
                  style={{ background: c.actionBg, border: `1px solid ${c.actionBg}`, opacity: 1 }}
                />
                <div
                  className="w-1.5 h-1.5"
                  style={{ background: c.actionBg, border: `1px solid ${c.actionBg}`, opacity: 1 }}
                />
              </div>
              <span
                className="text-[9px] font-bold uppercase tracking-[0.15em]"
                style={{ color: c.text, opacity: 1 }}
              >
                complete
              </span>
            </div>
            <span className="hidden lg:block text-[9px] font-bold uppercase tracking-[0.12em] text-(--onganda-char-black)/66 mt-1">
              Q1 – Q2 2024
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-baseline gap-2.5 mb-1">
              <h3 className="text-lg font-semibold text-(--onganda-char-black) tracking-tight leading-none">
                Ouheke
              </h3>
              <span className="text-sm text-(--onganda-char-black)/66 font-normal">Foundation</span>
            </div>
            <p className="text-sm text-(--onganda-char-black)/65 leading-relaxed mb-5 max-w-xl">
              Establishing sovereign data infrastructure. Corpus ingestion, annotation pipelines, and base model evaluation across Oshiwambo language variants.
            </p>
            <div className="flex items-center gap-3">
              <div
                className="flex-1 h-3 bg-(--onganda-char-black)/8 overflow-hidden relative"
                role="progressbar"
                aria-valuenow={100}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label="Ouheke progress: 100%"
              >
                <div
                  className="h-full relative overflow-hidden"
                  style={{ background: c.actionBg, width: "0px" }}
                  data-onganda-enter=""
                />
                <div
                  aria-hidden="true"
                  className="absolute top-0 bottom-0 w-px"
                  style={{ left: "25%", background: c.inverse, opacity: 0.08 }}
                />
                <div
                  aria-hidden="true"
                  className="absolute top-0 bottom-0 w-px"
                  style={{ left: "50%", background: c.inverse, opacity: 0.08 }}
                />
                <div
                  aria-hidden="true"
                  className="absolute top-0 bottom-0 w-px"
                  style={{ left: "75%", background: c.inverse, opacity: 0.08 }}
                />
              </div>
              <span
                className="text-[11px] font-bold tabular-nums shrink-0"
                style={{ color: c.text, opacity: 1 }}
              >
                100
                %
              </span>
            </div>
          </div>
          <div className="lg:w-60 xl:w-72 shrink-0">
            <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-(--onganda-char-black)/66 mb-3">
              Milestones
            </p>
            <ul className="flex flex-col gap-2">
              <li className="flex items-start gap-2">
                <div
                  aria-hidden="true"
                  className="w-1.5 h-1.5 mt-1 shrink-0"
                  style={{ background: c.actionBg, border: `1px solid ${c.actionBg}`, opacity: 1 }}
                />
                <span className="text-xs leading-snug" style={{ color: c.text, opacity: 0.65 }}>
                  Corpus v1 ingested
                </span>
              </li>
              <li className="flex items-start gap-2">
                <div
                  aria-hidden="true"
                  className="w-1.5 h-1.5 mt-1 shrink-0"
                  style={{ background: c.actionBg, border: `1px solid ${c.actionBg}`, opacity: 1 }}
                />
                <span className="text-xs leading-snug" style={{ color: c.text, opacity: 0.65 }}>
                  Annotation toolchain live
                </span>
              </li>
              <li className="flex items-start gap-2">
                <div
                  aria-hidden="true"
                  className="w-1.5 h-1.5 mt-1 shrink-0"
                  style={{ background: c.actionBg, border: `1px solid ${c.actionBg}`, opacity: 1 }}
                />
                <span className="text-xs leading-snug" style={{ color: c.text, opacity: 0.65 }}>
                  Okaanda granary deployed
                </span>
              </li>
            </ul>
          </div>
        </div>
        <div
          className="flex flex-col lg:flex-row gap-6 lg:gap-10 py-8 group"
          style={{  }}
          data-onganda-enter=""
        >
          <div className="lg:w-40 shrink-0 flex flex-row lg:flex-col gap-3 lg:gap-2 items-center lg:items-start">
            <PixelTag hex={accentFor(1)} label="P–02" />
            <div className="flex items-center gap-1.5">
              <div className="flex gap-0.5" aria-hidden="true">
                <div
                  className="w-1.5 h-1.5"
                  style={{ background: c.dangerBg, border: `1px solid ${c.accentInk}`, opacity: 1 }}
                />
                <div
                  className="w-1.5 h-1.5"
                  style={{ background: c.dangerBg, border: `1px solid ${c.accentInk}`, opacity: 1 }}
                />
                <div
                  className="w-1.5 h-1.5"
                  style={{ background: c.dangerBg, border: `1px solid ${c.accentInk}`, opacity: 1 }}
                />
              </div>
              <span
                className="text-[9px] font-bold uppercase tracking-[0.15em]"
                style={{ color: c.text, opacity: 1 }}
              >
                active
              </span>
            </div>
            <span className="hidden lg:block text-[9px] font-bold uppercase tracking-[0.12em] text-(--onganda-char-black)/66 mt-1">
              Q3 – Q4 2024
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-baseline gap-2.5 mb-1">
              <h3 className="text-lg font-semibold text-(--onganda-char-black) tracking-tight leading-none">
                Oshitwa
              </h3>
              <span className="text-sm text-(--onganda-char-black)/66 font-normal">Adaptation</span>
            </div>
            <p className="text-sm text-(--onganda-char-black)/65 leading-relaxed mb-5 max-w-xl">
              Fine-tuning and distillation cycles. Oshini mill pipelines processing base models into Namibia-aligned variants for evaluation and iteration.
            </p>
            <div className="flex items-center gap-3">
              <div
                className="flex-1 h-3 bg-(--onganda-char-black)/8 overflow-hidden relative"
                role="progressbar"
                aria-valuenow={78}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label="Oshitwa progress: 78%"
              >
                <div
                  className="h-full relative overflow-hidden"
                  style={{ background: c.dangerBg, width: "0px" }}
                  data-onganda-enter=""
                >
                  <div
                    aria-hidden="true"
                    className="absolute right-0 top-0 bottom-0 w-3"
                    style={{ background: c.inverse }}
                  />
                </div>
                <div
                  aria-hidden="true"
                  className="absolute top-0 bottom-0 w-px"
                  style={{ left: "25%", background: c.inverse, opacity: 0.08 }}
                />
                <div
                  aria-hidden="true"
                  className="absolute top-0 bottom-0 w-px"
                  style={{ left: "50%", background: c.inverse, opacity: 0.08 }}
                />
                <div
                  aria-hidden="true"
                  className="absolute top-0 bottom-0 w-px"
                  style={{ left: "75%", background: c.inverse, opacity: 0.08 }}
                />
              </div>
              <span
                className="text-[11px] font-bold tabular-nums shrink-0"
                style={{ color: c.text, opacity: 1 }}
              >
                78
                %
              </span>
            </div>
          </div>
          <div className="lg:w-60 xl:w-72 shrink-0">
            <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-(--onganda-char-black)/66 mb-3">
              Milestones
            </p>
            <ul className="flex flex-col gap-2">
              <li className="flex items-start gap-2">
                <div
                  aria-hidden="true"
                  className="w-1.5 h-1.5 mt-1 shrink-0"
                  style={{ background: c.dangerBg, border: `1px solid ${c.accentInk}`, opacity: 1 }}
                />
                <span className="text-xs leading-snug" style={{ color: c.text, opacity: 0.65 }}>
                  namibia-base-1b fine-tuned
                </span>
              </li>
              <li className="flex items-start gap-2">
                <div
                  aria-hidden="true"
                  className="w-1.5 h-1.5 mt-1 shrink-0"
                  style={{ background: c.dangerBg, border: `1px solid ${c.accentInk}`, opacity: 1 }}
                />
                <span className="text-xs leading-snug" style={{ color: c.text, opacity: 0.65 }}>
                  Oshini SDK beta released
                </span>
              </li>
              <li className="flex items-start gap-2">
                <div
                  aria-hidden="true"
                  className="w-1.5 h-1.5 mt-1 shrink-0"
                  style={{ background: c.dangerBg, border: `1px solid ${c.accentInk}`, opacity: 1 }}
                />
                <span className="text-xs leading-snug" style={{ color: c.text, opacity: 0.65 }}>
                  Eval bench v1 published
                </span>
              </li>
            </ul>
          </div>
        </div>
        <div
          className="flex flex-col lg:flex-row gap-6 lg:gap-10 py-8 group"
          style={{  }}
          data-onganda-enter=""
        >
          <div className="lg:w-40 shrink-0 flex flex-row lg:flex-col gap-3 lg:gap-2 items-center lg:items-start">
            <PixelTag hex={accentFor(2)} label="P–03" />
            <div className="flex items-center gap-1.5">
              <div className="flex gap-0.5" aria-hidden="true">
                <div
                  className="w-1.5 h-1.5"
                  style={{ background: c.accentBg, border: `1px solid ${c.accentBg}`, opacity: 1 }}
                />
                <div
                  className="w-1.5 h-1.5"
                  style={{ background: c.accentBg, border: `1px solid ${c.accentBg}`, opacity: 1 }}
                />
                <div
                  className="w-1.5 h-1.5"
                  style={{ background: c.accentBg, border: `1px solid ${c.accentBg}`, opacity: 1 }}
                />
              </div>
              <span
                className="text-[9px] font-bold uppercase tracking-[0.15em]"
                style={{ color: c.text, opacity: 1 }}
              >
                active
              </span>
            </div>
            <span className="hidden lg:block text-[9px] font-bold uppercase tracking-[0.12em] text-(--onganda-char-black)/66 mt-1">
              Q1 – Q2 2025
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-baseline gap-2.5 mb-1">
              <h3 className="text-lg font-semibold text-(--onganda-char-black) tracking-tight leading-none">
                Ombaanga
              </h3>
              <span className="text-sm text-(--onganda-char-black)/66 font-normal">Containment</span>
            </div>
            <p className="text-sm text-(--onganda-char-black)/65 leading-relaxed mb-5 max-w-xl">
              Agent runtimes and model containers. Ombiga vessel system accepting adapted models. Memory systems and multi-agent coordination protocols.
            </p>
            <div className="flex items-center gap-3">
              <div
                className="flex-1 h-3 bg-(--onganda-char-black)/8 overflow-hidden relative"
                role="progressbar"
                aria-valuenow={34}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label="Ombaanga progress: 34%"
              >
                <div
                  className="h-full relative overflow-hidden"
                  style={{ background: c.accentBg, width: "0px" }}
                  data-onganda-enter=""
                >
                  <div
                    aria-hidden="true"
                    className="absolute right-0 top-0 bottom-0 w-3"
                    style={{ background: c.inverse }}
                  />
                </div>
                <div
                  aria-hidden="true"
                  className="absolute top-0 bottom-0 w-px"
                  style={{ left: "25%", background: c.inverse, opacity: 0.08 }}
                />
                <div
                  aria-hidden="true"
                  className="absolute top-0 bottom-0 w-px"
                  style={{ left: "50%", background: c.inverse, opacity: 0.08 }}
                />
                <div
                  aria-hidden="true"
                  className="absolute top-0 bottom-0 w-px"
                  style={{ left: "75%", background: c.inverse, opacity: 0.08 }}
                />
              </div>
              <span
                className="text-[11px] font-bold tabular-nums shrink-0"
                style={{ color: c.text, opacity: 1 }}
              >
                34
                %
              </span>
            </div>
          </div>
          <div className="lg:w-60 xl:w-72 shrink-0">
            <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-(--onganda-char-black)/66 mb-3">
              Milestones
            </p>
            <ul className="flex flex-col gap-2">
              <li className="flex items-start gap-2">
                <div
                  aria-hidden="true"
                  className="w-1.5 h-1.5 mt-1 shrink-0"
                  style={{ background: c.accentBg, border: `1px solid ${c.accentBg}`, opacity: 1 }}
                />
                <span className="text-xs leading-snug" style={{ color: c.text, opacity: 0.65 }}>
                  Ombiga runtime alpha
                </span>
              </li>
              <li className="flex items-start gap-2">
                <div
                  aria-hidden="true"
                  className="w-1.5 h-1.5 mt-1 shrink-0"
                  style={{ background: c.accentBg, border: `1px solid ${c.accentBg}`, opacity: 1 }}
                />
                <span className="text-xs leading-snug" style={{ color: c.text, opacity: 0.65 }}>
                  Agent memory schema v1
                </span>
              </li>
              <li className="flex items-start gap-2">
                <div
                  aria-hidden="true"
                  className="w-1.5 h-1.5 mt-1 shrink-0"
                  style={{ background: c.accentBg, border: `1px solid ${c.accentBg}`, opacity: 1 }}
                />
                <span className="text-xs leading-snug" style={{ color: c.text, opacity: 0.65 }}>
                  Container registry open
                </span>
              </li>
            </ul>
          </div>
        </div>
        <div
          className="flex flex-col lg:flex-row gap-6 lg:gap-10 py-8 group"
          style={{  }}
          data-onganda-enter=""
        >
          <div className="lg:w-40 shrink-0 flex flex-row lg:flex-col gap-3 lg:gap-2 items-center lg:items-start">
            <PixelTag hex={accentFor(3)} label="P–04" />
            <div className="flex items-center gap-1.5">
              <div className="flex gap-0.5" aria-hidden="true">
                <div
                  className="w-1.5 h-1.5"
                  style={{ background: c.inverseBorder, border: `1px solid ${c.actionHoverBg}`, opacity: 0.4 }}
                />
                <div
                  className="w-1.5 h-1.5"
                  style={{ background: c.inverseBorder, border: `1px solid ${c.actionHoverBg}`, opacity: 0.4 }}
                />
                <div
                  className="w-1.5 h-1.5"
                  style={{ background: c.inverseBorder, border: `1px solid ${c.actionHoverBg}`, opacity: 0.4 }}
                />
              </div>
              <span
                className="text-[9px] font-bold uppercase tracking-[0.15em]"
                style={{ color: c.text, opacity: 0.35 }}
              >
                upcoming
              </span>
            </div>
            <span className="hidden lg:block text-[9px] font-bold uppercase tracking-[0.12em] text-(--onganda-char-black)/66 mt-1">
              Q3 2025
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-baseline gap-2.5 mb-1">
              <h3 className="text-lg font-semibold text-(--onganda-char-black) tracking-tight leading-none">
                Etiti Yontanda
              </h3>
              <span className="text-sm text-(--onganda-char-black)/66 font-normal">Surface & Interface</span>
            </div>
            <p className="text-sm text-(--onganda-char-black)/65 leading-relaxed mb-5 max-w-xl">
              Read surfaces and civic dashboards. Etiti interface layer connecting agents to sector operators, field workers, and government programme monitors.
            </p>
            <div className="flex items-center gap-3">
              <div
                className="flex-1 h-3 bg-(--onganda-char-black)/8 overflow-hidden relative"
                role="progressbar"
                aria-valuenow={12}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label="Etiti Yontanda progress: 12%"
              >
                <div
                  className="h-full relative overflow-hidden"
                  style={{ background: c.actionHoverBg, width: "0px" }}
                  data-onganda-enter=""
                />
                <div
                  aria-hidden="true"
                  className="absolute top-0 bottom-0 w-px"
                  style={{ left: "25%", background: c.inverse, opacity: 0.08 }}
                />
                <div
                  aria-hidden="true"
                  className="absolute top-0 bottom-0 w-px"
                  style={{ left: "50%", background: c.inverse, opacity: 0.08 }}
                />
                <div
                  aria-hidden="true"
                  className="absolute top-0 bottom-0 w-px"
                  style={{ left: "75%", background: c.inverse, opacity: 0.08 }}
                />
              </div>
              <span
                className="text-[11px] font-bold tabular-nums shrink-0"
                style={{ color: c.text, opacity: 1 }}
              >
                12
                %
              </span>
            </div>
          </div>
          <div className="lg:w-60 xl:w-72 shrink-0">
            <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-(--onganda-char-black)/66 mb-3">
              Milestones
            </p>
            <ul className="flex flex-col gap-2">
              <li className="flex items-start gap-2">
                <div
                  aria-hidden="true"
                  className="w-1.5 h-1.5 mt-1 shrink-0"
                  style={{ background: c.inverseBorder, border: `1px solid ${c.actionHoverBg}`, opacity: 0.4 }}
                />
                <span className="text-xs leading-snug" style={{ color: c.text, opacity: 0.35 }}>
                  Dashboard framework
                </span>
              </li>
              <li className="flex items-start gap-2">
                <div
                  aria-hidden="true"
                  className="w-1.5 h-1.5 mt-1 shrink-0"
                  style={{ background: c.inverseBorder, border: `1px solid ${c.actionHoverBg}`, opacity: 0.4 }}
                />
                <span className="text-xs leading-snug" style={{ color: c.text, opacity: 0.35 }}>
                  Civic data layer
                </span>
              </li>
              <li className="flex items-start gap-2">
                <div
                  aria-hidden="true"
                  className="w-1.5 h-1.5 mt-1 shrink-0"
                  style={{ background: c.inverseBorder, border: `1px solid ${c.actionHoverBg}`, opacity: 0.4 }}
                />
                <span className="text-xs leading-snug" style={{ color: c.text, opacity: 0.35 }}>
                  Field operator UX
                </span>
              </li>
            </ul>
          </div>
        </div>
        <div
          className="flex flex-col lg:flex-row gap-6 lg:gap-10 py-8 group"
          style={{  }}
          data-onganda-enter=""
        >
          <div className="lg:w-40 shrink-0 flex flex-row lg:flex-col gap-3 lg:gap-2 items-center lg:items-start">
            <PixelTag hex={accentFor(4)} label="P–05" />
            <div className="flex items-center gap-1.5">
              <div className="flex gap-0.5" aria-hidden="true">
                <div
                  className="w-1.5 h-1.5"
                  style={{ background: c.inverseBorder, border: `1px solid ${c.accentHoverBg}`, opacity: 0.4 }}
                />
                <div
                  className="w-1.5 h-1.5"
                  style={{ background: c.inverseBorder, border: `1px solid ${c.accentHoverBg}`, opacity: 0.4 }}
                />
                <div
                  className="w-1.5 h-1.5"
                  style={{ background: c.inverseBorder, border: `1px solid ${c.accentHoverBg}`, opacity: 0.4 }}
                />
              </div>
              <span
                className="text-[9px] font-bold uppercase tracking-[0.15em]"
                style={{ color: c.text, opacity: 0.35 }}
              >
                upcoming
              </span>
            </div>
            <span className="hidden lg:block text-[9px] font-bold uppercase tracking-[0.12em] text-(--onganda-char-black)/66 mt-1">
              Q4 2025 – Q1 2026
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-baseline gap-2.5 mb-1">
              <h3 className="text-lg font-semibold text-(--onganda-char-black) tracking-tight leading-none">
                Oshitoo
              </h3>
              <span className="text-sm text-(--onganda-char-black)/66 font-normal">Delivery</span>
            </div>
            <p className="text-sm text-(--onganda-char-black)/65 leading-relaxed mb-5 max-w-xl">
              Sector application launch. Health, agriculture, education, and public administration pilots carrying sovereign intelligence to where it is needed.
            </p>
            <div className="flex items-center gap-3">
              <div
                className="flex-1 h-3 bg-(--onganda-char-black)/8 overflow-hidden relative"
                role="progressbar"
                aria-valuenow={0}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label="Oshitoo progress: 0%"
              >
                <div
                  className="h-full relative overflow-hidden"
                  style={{ background: c.accentHoverBg, width: "0px" }}
                  data-onganda-enter=""
                />
                <div
                  aria-hidden="true"
                  className="absolute top-0 bottom-0 w-px"
                  style={{ left: "25%", background: c.inverse, opacity: 0.08 }}
                />
                <div
                  aria-hidden="true"
                  className="absolute top-0 bottom-0 w-px"
                  style={{ left: "50%", background: c.inverse, opacity: 0.08 }}
                />
                <div
                  aria-hidden="true"
                  className="absolute top-0 bottom-0 w-px"
                  style={{ left: "75%", background: c.inverse, opacity: 0.08 }}
                />
              </div>
              <span
                className="text-[11px] font-bold tabular-nums shrink-0"
                style={{ color: c.text, opacity: 0.3 }}
              >
                0
                %
              </span>
            </div>
          </div>
          <div className="lg:w-60 xl:w-72 shrink-0">
            <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-(--onganda-char-black)/66 mb-3">
              Milestones
            </p>
            <ul className="flex flex-col gap-2">
              <li className="flex items-start gap-2">
                <div
                  aria-hidden="true"
                  className="w-1.5 h-1.5 mt-1 shrink-0"
                  style={{ background: c.inverseBorder, border: `1px solid ${c.accentHoverBg}`, opacity: 0.4 }}
                />
                <span className="text-xs leading-snug" style={{ color: c.text, opacity: 0.35 }}>
                  OshitooHealth launch
                </span>
              </li>
              <li className="flex items-start gap-2">
                <div
                  aria-hidden="true"
                  className="w-1.5 h-1.5 mt-1 shrink-0"
                  style={{ background: c.inverseBorder, border: `1px solid ${c.accentHoverBg}`, opacity: 0.4 }}
                />
                <span className="text-xs leading-snug" style={{ color: c.text, opacity: 0.35 }}>
                  OshiniAgro field pilot
                </span>
              </li>
              <li className="flex items-start gap-2">
                <div
                  aria-hidden="true"
                  className="w-1.5 h-1.5 mt-1 shrink-0"
                  style={{ background: c.inverseBorder, border: `1px solid ${c.accentHoverBg}`, opacity: 0.4 }}
                />
                <span className="text-xs leading-snug" style={{ color: c.text, opacity: 0.35 }}>
                  OkaandaEdu curriculum integration
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-6 mt-5 flex-wrap">
        <div className="flex items-center gap-2">
          <div className="flex gap-0.5" aria-hidden="true">
            <div
              className="w-1.5 h-1.5"
              style={{ background: c.actionBg, border: `1px solid ${c.actionBg}` }}
            />
            <div
              className="w-1.5 h-1.5"
              style={{ background: c.actionBg, border: `1px solid ${c.actionBg}` }}
            />
            <div
              className="w-1.5 h-1.5"
              style={{ background: c.actionBg, border: `1px solid ${c.actionBg}` }}
            />
          </div>
          <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-(--onganda-char-black)/66">
            Complete
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex gap-0.5" aria-hidden="true">
            <div
              className="w-1.5 h-1.5"
              style={{ background: c.dangerBg, border: `1px solid ${c.accentInk}` }}
            />
            <div
              className="w-1.5 h-1.5"
              style={{ background: c.dangerBg, border: `1px solid ${c.accentInk}` }}
            />
            <div
              className="w-1.5 h-1.5"
              style={{ background: c.inverseBorder, border: `1px solid ${c.accentInk}` }}
            />
          </div>
          <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-(--onganda-char-black)/66">
            In progress
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex gap-0.5" aria-hidden="true">
            <div
              className="w-1.5 h-1.5"
              style={{ background: c.inverseBorder, border: "1px solid #1E1A1744" }}
            />
            <div
              className="w-1.5 h-1.5"
              style={{ background: c.inverseBorder, border: "1px solid #1E1A1744" }}
            />
            <div
              className="w-1.5 h-1.5"
              style={{ background: c.inverseBorder, border: "1px solid #1E1A1744" }}
            />
          </div>
          <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-(--onganda-char-black)/66">
            Upcoming
          </span>
        </div>
      </div>
      <CodeSnippetBlock
        label="TimelinePhase · Development Roadmap"
        lines={[{ type: "comment", text: "// Development Roadmap — timeline phase" }, { type: "import", text: "import { TIMELINE_PHASES } from '@onganda/design-system';" }, { type: "plain", text: "" }, { type: "comment", text: "// A TimelinePhase entry" }, { type: "plain", text: "const phase = {" }, { type: "prop", text: "  tag: 'P–01', oshiwambo: 'Ouheke', english: 'Foundation'," }, { type: "prop", text: `  period: 'Q1 – Q2 2024', hex: '${c.actionBg}',` }, { type: "prop", text: "  progress: 100, status: 'complete'," }, { type: "prop", text: "  milestones: ['Corpus v1 ingested', 'Okaanda granary deployed']," }, { type: "plain", text: "};" }, { type: "plain", text: "" }, { type: "comment", text: "// Progress bar (animated with framer-motion)" }, /* …4 more */]}
        accentHex={c.actionBg}
      />
    </section>
  );
}
