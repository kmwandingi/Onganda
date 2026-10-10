// The "Naming Hierarchy" section of /showcase
// Generated from the live showcase. Event handlers and state are stubbed:
// wire them to your own data. Requires @onganda/design-system/style.css.
import { roles, useDark } from '@onganda/design-system';

export function NamingHierarchySection() {
  const { isDark } = useDark();
  const c = roles(isDark);
  return (
    <section className="max-w-7xl mx-auto px-6 pb-32 md:px-12">
      <div className="bg-(--onganda-dust-light) border border-(--onganda-char-black)/10 p-8 md:p-12">
        <div className="flex flex-col md:flex-row md:items-start gap-10 md:gap-0">
          <div className="md:w-1/3 shrink-0">
            <h2 className="text-xs font-bold uppercase tracking-[0.15em] text-(--onganda-char-black)/66 mb-3">
              Naming Hierarchy
            </h2>
            <p className="text-2xl font-medium tracking-tight text-(--onganda-char-black) leading-snug">
              One parent.
              <br />
              Five tools.
              <br />
              One direction.
            </p>
            <p className="mt-4 text-sm text-(--onganda-char-black)/66 leading-relaxed max-w-xs">
              Names pending final validation with fluent Oshikwanyama / Oshindonga speakers and community-informed partners before lock.
            </p>
          </div>
          <div className="flex-1">
            <div className="flex flex-col gap-0">
              <div className="flex items-center gap-4 py-4 border-b border-(--onganda-char-black)/10">
                <div className="w-2 h-8 bg-(--onganda-ochre-orange) shrink-0" aria-hidden="true" />
                <div>
                  <p className="text-lg font-semibold text-(--onganda-char-black) tracking-tight leading-none">
                    Onganda
                  </p>
                  <p className="text-xs text-(--onganda-char-black)/66 mt-0.5">
                    Parent brand · Namibia Applied AI Lab
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4 py-3.5 border-b border-(--onganda-char-black)/8 pl-6">
                <div
                  className="w-1.5 h-6 shrink-0"
                  style={{ background: c.actionBg, opacity: 0.7 }}
                  aria-hidden="true"
                />
                <div className="flex-1 flex flex-col sm:flex-row sm:items-baseline sm:gap-4">
                  <p className="text-base font-semibold text-(--onganda-char-black) tracking-tight leading-none">
                    Okaanda
                  </p>
                  <p className="text-xs text-(--onganda-char-black)/66 mt-0.5 sm:mt-0">
                    <span className="text-(--onganda-char-black)/66">Granary</span>
                    <span className="mx-1.5">·</span>
                    <span>Model & Data Platform</span>
                  </p>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-(--onganda-char-black)/66">
                  01
                </span>
              </div>
              <div className="flex items-center gap-4 py-3.5 border-b border-(--onganda-char-black)/8 pl-6">
                <div
                  className="w-1.5 h-6 shrink-0"
                  style={{ background: c.dangerBg, opacity: 0.7 }}
                  aria-hidden="true"
                />
                <div className="flex-1 flex flex-col sm:flex-row sm:items-baseline sm:gap-4">
                  <p className="text-base font-semibold text-(--onganda-char-black) tracking-tight leading-none">
                    Oshini
                  </p>
                  <p className="text-xs text-(--onganda-char-black)/66 mt-0.5 sm:mt-0">
                    <span className="text-(--onganda-char-black)/66">Mill</span>
                    <span className="mx-1.5">·</span>
                    <span>Adaptation Workflows</span>
                  </p>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-(--onganda-char-black)/66">
                  02
                </span>
              </div>
              <div className="flex items-center gap-4 py-3.5 border-b border-(--onganda-char-black)/8 pl-6">
                <div
                  className="w-1.5 h-6 shrink-0"
                  style={{ background: c.accentBg, opacity: 0.7 }}
                  aria-hidden="true"
                />
                <div className="flex-1 flex flex-col sm:flex-row sm:items-baseline sm:gap-4">
                  <p className="text-base font-semibold text-(--onganda-char-black) tracking-tight leading-none">
                    Ombiga
                  </p>
                  <p className="text-xs text-(--onganda-char-black)/66 mt-0.5 sm:mt-0">
                    <span className="text-(--onganda-char-black)/66">Vessel</span>
                    <span className="mx-1.5">·</span>
                    <span>Agents & Containers</span>
                  </p>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-(--onganda-char-black)/66">
                  03
                </span>
              </div>
              <div className="flex items-center gap-4 py-3.5 border-b border-(--onganda-char-black)/8 pl-6">
                <div
                  className="w-1.5 h-6 shrink-0"
                  style={{ background: c.actionHoverBg, opacity: 0.7 }}
                  aria-hidden="true"
                />
                <div className="flex-1 flex flex-col sm:flex-row sm:items-baseline sm:gap-4">
                  <p className="text-base font-semibold text-(--onganda-char-black) tracking-tight leading-none">
                    Etiti
                  </p>
                  <p className="text-xs text-(--onganda-char-black)/66 mt-0.5 sm:mt-0">
                    <span className="text-(--onganda-char-black)/66">Surface</span>
                    <span className="mx-1.5">·</span>
                    <span>Interfaces & Dashboards</span>
                  </p>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-(--onganda-char-black)/66">
                  04
                </span>
              </div>
              <div className="flex items-center gap-4 py-3.5 border-b border-(--onganda-char-black)/8 pl-6">
                <div
                  className="w-1.5 h-6 shrink-0"
                  style={{ background: c.accentHoverBg, opacity: 0.7 }}
                  aria-hidden="true"
                />
                <div className="flex-1 flex flex-col sm:flex-row sm:items-baseline sm:gap-4">
                  <p className="text-base font-semibold text-(--onganda-char-black) tracking-tight leading-none">
                    Oshitoo
                  </p>
                  <p className="text-xs text-(--onganda-char-black)/66 mt-0.5 sm:mt-0">
                    <span className="text-(--onganda-char-black)/66">Delivery</span>
                    <span className="mx-1.5">·</span>
                    <span>Applications & Sector Products</span>
                  </p>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-(--onganda-char-black)/66">
                  05
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
