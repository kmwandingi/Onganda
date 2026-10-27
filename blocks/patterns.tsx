// The "The compounds, not just the atoms." section of /showcase
// Generated from the live showcase. Event handlers and state are stubbed:
// wire them to your own data. Requires @onganda/design-system/style.css.
import { DensityProvider, ICON_SIZE, IconFile, IconFolder, IconOkaanda, IconSearch, PixelActions, PixelButton, PixelChoice, PixelChoiceList, PixelDialog, PixelDocumentViewer, PixelDot, PixelEmptyState, PixelField, PixelFocusRow, PixelInput, PixelInputGroup, PixelLabCard, PixelMeter, PixelNav, PixelNotice, PixelPanel, PixelProgress, PixelSkeleton, PixelStatBand, PixelStepLine, PixelSubhead, PixelTable, PixelTabs, PixelTicker, PixelToggle, SectionHeader, accentFor, roles, useDark } from '@onganda/design-system';
import type { ReactNode } from 'react';

export function TheCompoundsNotJustTheAtomsSection() {
  const { isDark } = useDark();
  const c = roles(isDark);
  const table1Rows = [{ id: "okaanda", system: "Okaanda", role: "Model & data platform", status: "settled", models: 128, uptime: 99.4 }, { id: "oshini", system: "Oshini", role: "Adaptation workflows", status: "active", models: 64, uptime: 98.1 }, { id: "ombiga", system: "Ombiga", role: "Agents & containers", status: "caution", models: 31, uptime: 94.7 }, { id: "oshitoo", system: "Oshitoo", role: "Sector applications", status: "critical", models: 8, uptime: 71.2 }];
  const table1SystemCells: ReactNode[] = [
    <span
        className="flex items-center gap-2"
        style={{ borderLeft: `3px solid ${c.actionBg}`, paddingLeft: 8 }}
      >
        <PixelDot color={accentFor(3)} size={6} ring={c.lineStrong} />
        <strong style={{ color: c.text }}>Okaanda</strong>
      </span>,
    <span
        className="flex items-center gap-2"
        style={{ borderLeft: `3px solid ${c.accentInk}`, paddingLeft: 8 }}
      >
        <PixelDot color={accentFor(0)} size={6} ring={c.lineStrong} />
        <strong style={{ color: c.text }}>Oshini</strong>
      </span>,
    <span
        className="flex items-center gap-2"
        style={{ borderLeft: `3px solid ${c.accentBg}`, paddingLeft: 8 }}
      >
        <PixelDot color={accentFor(2)} size={6} ring={c.lineStrong} />
        <strong style={{ color: c.text }}>Ombiga</strong>
      </span>,
    <span
        className="flex items-center gap-2"
        style={{ borderLeft: `3px solid ${c.accentHoverBg}`, paddingLeft: 8 }}
      >
        <PixelDot color={c.dangerBorder} size={6} ring={c.lineStrong} />
        <strong style={{ color: c.text }}>Oshitoo</strong>
      </span>
  ];
  const table1RoleCells: ReactNode[] = [
    "Model & data platform",
    "Adaptation workflows",
    "Agents & containers",
    "Sector applications"
  ];
  const table1ModelsCells: ReactNode[] = [
    "128",
    "64",
    "31",
    "8"
  ];
  const table1UptimeCells: ReactNode[] = [
    "99.4%",
    "98.1%",
    "94.7%",
    "71.2%"
  ];
  return (
    <section id="patterns" className="max-w-7xl mx-auto px-6 pb-24 md:px-12">
      <SectionHeader
        label="Product Patterns"
        headline="The compounds, not just the atoms."
        accent={accentFor(4)}
      />
      <div
        id="patterns-stage"
        className="relative p-6 md:p-8"
        style={{ background: c.canvas, border: `1px solid ${c.line}` }}
      >
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <p className="text-xs leading-relaxed" style={{ color: c.textMuted }}>
            A product needs a dialog on day one. Build from these instead of inventing chrome.
          </p>
          <PixelToggle
            checked={false}
            onChange={() => {}}
            label={<span className="text-[10px] font-bold uppercase tracking-[0.16em]">Light</span>}
          />
        </div>
        <div className="grid gap-4 lg:grid-cols-2">
          <PixelPanel eyebrow="Notice · one per status, colour never alone" accent={accentFor(4)}>
            <div className="grid gap-3">
              <PixelNotice status="active" title="Evaluation running">
                namibia-base-1b is being scored against the Oshiwambo benchmark.
              </PixelNotice>
              <PixelNotice status="caution" title="Quota at 94%">
                Archive completed runs to free granary space.
              </PixelNotice>
              <PixelNotice status="critical" title="Deployment failed">
                The Ombiga container could not reach the model registry.
              </PixelNotice>
              <PixelNotice status="settled" title="Corpus v1 archived" onDismiss={() => {}}>
                Dismissable. Press the stepped cross to remove.
              </PixelNotice>
            </div>
          </PixelPanel>
          <PixelPanel eyebrow="Tabs · ghost recipe, ochre when active" accent={accentFor(0)}>
            <div className="relative grid gap-8">
              <div>
                <PixelTabs
                  label="Run state"
                  value="live"
                  onChange={() => {}}
                  tabs={[{ value: "live", label: "Live" }, { value: "queued", label: "Queued" }, { value: "archived", label: "Archived" }]}
                />
                <p className="mt-3 text-xs" style={{ color: c.textMuted }}>
                  Showing
                  <strong style={{ color: c.text }}>live</strong>
                  runs.
                </p>
              </div>
              <div>
                <PixelSubhead spaced>Input group · a field and its action as one control</PixelSubhead>
                <PixelField label="Model URL" htmlFor="pp-url">
                  <PixelInputGroup>
                    <PixelInput id="pp-url" placeholder="https://huggingface.co/…" />
                    <PixelButton variant="ghost">Fetch</PixelButton>
                  </PixelInputGroup>
                </PixelField>
              </div>
              <div>
                <PixelSubhead spaced>Meter · a rating, not a state</PixelSubhead>
                <div className="flex flex-wrap gap-6">
                  <PixelMeter value={3} label="Strong" />
                  <PixelMeter value={2} label="Needs trim" />
                  <PixelMeter value={1} label="Weak" />
                </div>
              </div>
              <div className="grid gap-5">
                <PixelSubhead spaced>Progress · a solid fill, never a smooth gradient</PixelSubhead>
                <PixelProgress label="Corpus ingestion" value={100} status="settled" />
                <PixelProgress label="Fine-tuning" value={78} status="active" />
                <PixelProgress label="Container rollout" value={34} status="caution" />
              </div>
              <div>
                <PixelSubhead spaced>Dialog · focus trap, escape, scrim</PixelSubhead>
                <PixelButton variant="danger" onClick={() => {}}>Delete dataset</PixelButton>
              </div>
            </div>
          </PixelPanel>
          <PixelPanel
            eyebrow="Panel · a compact surface cannot be built without the language"
            accent={accentFor(1)}
          >
            <DensityProvider value="compact">
              <PixelPanel
                eyebrow="Practice — MCQ · data splitting"
                title="What happens if train_test_split uses shuffle=True without random_state?"
                footer={<PixelActions align="between">
                  <PixelButton variant="primary">Send answer</PixelButton>
                  <PixelButton variant="ghost">Next exercise</PixelButton>
                </PixelActions>}
              >
                <div className="mt-4">
                  <PixelChoiceList label="Answer">
                    <PixelChoice
                      label="The split is reproducible"
                      selected={false}
                      onSelect={() => {}}
                    />
                    <PixelChoice label="The split changes between runs" selected onSelect={() => {}} />
                    <PixelChoice label="The split fails" selected={false} onSelect={() => {}} />
                    <PixelChoice label="The test set is empty" selected={false} onSelect={() => {}} />
                  </PixelChoiceList>
                </div>
              </PixelPanel>
            </DensityProvider>
            <p className="mt-4 text-xs leading-relaxed" style={{ color: c.textMuted }}>
              The panel brings its own eyebrow, weave and corner marks, so a compact surface carries the language without the product re-deriving it.
            </p>
            <PixelSubhead spaced>Panel · page density — the public site’s card</PixelSubhead>
            <PixelPanel
              eyebrow="Focus"
              title="Adapt models"
              note="Select, adapt, evaluate, and organize models for local use."
            >
              <PixelActions><PixelButton variant="ghost">Read the brief</PixelButton></PixelActions>
            </PixelPanel>
            <PixelSubhead spaced>Panel · spine recipe — for a card that carries an identity</PixelSubhead>
            <PixelPanel
              spine
              accent={accentFor(2)}
              eyebrow="Agents & containers"
              title="Ombiga"
              note="Containers, agents, and held systems."
            />
          </PixelPanel>
          <PixelPanel eyebrow="Table · editorial rhythm, tabular figures" accent={accentFor(2)}>
            <PixelTable
              caption="Systems overview"
              rows={table1Rows}
              rowKey={(_r, i) => String(i)}
              columns={[
                { key: "system", header: "System", render: (r) => table1SystemCells[table1Rows.indexOf(r)] },
                { key: "role", header: "Role", render: (r) => table1RoleCells[table1Rows.indexOf(r)] },
                { key: "models", header: "Models", numeric: true, render: (r) => table1ModelsCells[table1Rows.indexOf(r)] },
                { key: "uptime", header: "Uptime", numeric: true, render: (r) => table1UptimeCells[table1Rows.indexOf(r)] }
              ]}
            />
          </PixelPanel>
          <PixelPanel eyebrow="Empty · the surface a product shows first" accent={accentFor(3)}>
            <div className="relative grid gap-8">
              <div>
                <PixelEmptyState
                  icon={<IconOkaanda size={ICON_SIZE.hero} />}
                  title="No datasets yet"
                  body="Ingest a corpus to start evaluating models against Namibian language data."
                  action={<PixelButton variant="accent">Ingest a corpus</PixelButton>}
                />
              </div>
              <div>
                <PixelSubhead spaced>Loading · a slow sweep that stops for reduced motion</PixelSubhead>
                <div style={{ background: c.canvas, border: `1px solid ${c.line}`, padding: 20 }}>
                  <PixelSkeleton lines={4} />
                </div>
              </div>
            </div>
          </PixelPanel>
        </div>
        <div className="mt-4">
          <PixelSubhead>Site composition · ticker — the only place all five system colours meet</PixelSubhead>
          <PixelTicker />
        </div>
        <div className="mt-10">
          <PixelSubhead>Accent rotation · peers take successive hues, defaults do not</PixelSubhead>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <PixelPanel
              accent={accentFor(0)}
              eyebrow="accentFor(0)"
              title="Adapt models"
              note="One hue per peer, spent on the corner marks."
            />
            <PixelPanel
              accent={accentFor(1)}
              eyebrow="accentFor(1)"
              title="Run workflows"
              note="One hue per peer, spent on the corner marks."
            />
            <PixelPanel
              accent={accentFor(2)}
              eyebrow="accentFor(2)"
              title="Hold systems"
              note="One hue per peer, spent on the corner marks."
            />
            <PixelPanel
              accent={accentFor(3)}
              eyebrow="accentFor(3)"
              title="Shape interfaces"
              note="One hue per peer, spent on the corner marks."
            />
          </div>
        </div>
        <div className="mt-10">
          <PixelSubhead>Site composition · stat band — cells divided by a hairline, never a gap</PixelSubhead>
          <PixelStatBand stats={[{ value: "5", label: "Active systems", sub: "in architecture", hex: accentFor(0) }, { value: "3", label: "Language models", sub: "adapted for Namibia", hex: accentFor(1) }, { value: "12", label: "Sector pilots", sub: "across 4 industries", hex: accentFor(2) }, { value: "1", label: "Sovereign lab", sub: "Windhoek, Namibia", hex: accentFor(3) }]} />
        </div>
        <div className="mt-10 grid gap-4 lg:grid-cols-2">
          <div>
            <PixelSubhead>Site composition · focus rows — a list that reads as a sequence</PixelSubhead>
            <div className="grid gap-3">
              <PixelFocusRow index={0} accent={accentFor(0)} title="Adapt models">
                Select, adapt, evaluate, and organize models for local use.
              </PixelFocusRow>
              <PixelFocusRow index={1} accent={accentFor(1)} title="Run workflows">
                Build repeatable adaptation and deployment paths.
              </PixelFocusRow>
              <PixelFocusRow index={2} accent={accentFor(2)} title="Hold systems">
                Package agents, memory, and runtimes into portable units.
              </PixelFocusRow>
            </div>
          </div>
          <div>
            <PixelSubhead>Site composition · lab card — one per grid, in the last cell</PixelSubhead>
            <PixelLabCard tag="Lab" title="Onganda" accent={accentFor(0)}>
              Five systems working as one compound: from readiness to delivery.
            </PixelLabCard>
          </div>
        </div>
        <div className="mt-10 grid gap-4 lg:grid-cols-2">
          <PixelPanel eyebrow="Step line · a sequence drawn in pixels" accent={accentFor(3)}>
            <PixelStepLine
              label="How a check stays private"
              steps={[{ title: "Your record", note: "Never leaves the member." }, { title: "A token", note: "Made with the custodian." }, { title: "The index", note: "Counts matches only." }, { title: "An answer", note: "seen at 2, details differ." }]}
            />
          </PixelPanel>
          <PixelPanel
            eyebrow="Document viewer · regions a finding can light up"
            accent={accentFor(4)}
          >
            <div className="grid gap-4 md:grid-cols-[1fr_220px]">
              <PixelDocumentViewer
                aria-label="Synthetic payslip with marked regions"
                regions={[{ id: "r-name", x: 0.08, y: 0.14, w: 0.5, h: 0.05, label: "Employee name", status: "settled", findingId: "f-name" }, { id: "r-net", x: 0.58, y: 0.62, w: 0.34, h: 0.05, label: "Net pay", status: "critical", findingId: "f-net" }, { id: "r-sum", x: 0.58, y: 0.7, w: 0.34, h: 0.05, label: "Arithmetic", status: "caution", findingId: "f-sum" }]}
                onRegionActivate={() => {}}
              >
                <div
                  aria-hidden="true"
                  style={{ position: "absolute", left: "8%", top: "14.000000000000002%", width: "50%", height: "1.6%", background: c.lineStrong }}
                />
                <div
                  aria-hidden="true"
                  style={{ position: "absolute", left: "8%", top: "22%", width: "50%", height: "1.6%", background: c.lineStrong }}
                />
                <div
                  aria-hidden="true"
                  style={{ position: "absolute", left: "8%", top: "30%", width: "34%", height: "1.6%", background: c.lineStrong }}
                />
                <div
                  aria-hidden="true"
                  style={{ position: "absolute", left: "8%", top: "38%", width: "50%", height: "1.6%", background: c.lineStrong }}
                />
                <div
                  aria-hidden="true"
                  style={{ position: "absolute", left: "8%", top: "46%", width: "50%", height: "1.6%", background: c.lineStrong }}
                />
                <div
                  aria-hidden="true"
                  style={{ position: "absolute", left: "8%", top: "54%", width: "34%", height: "1.6%", background: c.lineStrong }}
                />
                <div
                  aria-hidden="true"
                  style={{ position: "absolute", left: "8%", top: "62%", width: "50%", height: "1.6%", background: c.lineStrong }}
                />
                <div
                  aria-hidden="true"
                  style={{ position: "absolute", left: "8%", top: "70%", width: "50%", height: "1.6%", background: c.lineStrong }}
                />
                <div
                  aria-hidden="true"
                  style={{ position: "absolute", left: "8%", top: "78%", width: "34%", height: "1.6%", background: c.lineStrong }}
                />
              </PixelDocumentViewer>
              <ul className="m-0 grid list-none content-start gap-2 p-0">
                <li data-finding-id="f-name">
                  <button
                    type="button"
                    className="onganda-focus w-full text-left"
                    style={{ border: 0, borderLeft: `3px solid ${c.line}`, background: c.inverseBorder, padding: "4px 8px", cursor: "pointer", fontFamily: "inherit" }}
                    onMouseEnter={() => {}}
                    onFocus={() => {}}
                    onClick={() => {}}
                  >
                    <span style={{ display: "block", fontSize: 14, fontWeight: 600, color: c.text }}>
                      Employee name
                    </span>
                    <span style={{ display: "block", fontSize: 12, color: c.textMuted }}>
                      Consistent with the record.
                    </span>
                  </button>
                </li>
                <li data-finding-id="f-net">
                  <button
                    type="button"
                    className="onganda-focus w-full text-left"
                    style={{ border: 0, borderLeft: `3px solid ${c.line}`, background: c.inverseBorder, padding: "4px 8px", cursor: "pointer", fontFamily: "inherit" }}
                    onMouseEnter={() => {}}
                    onFocus={() => {}}
                    onClick={() => {}}
                  >
                    <span style={{ display: "block", fontSize: 14, fontWeight: 600, color: c.text }}>Net pay</span>
                    <span style={{ display: "block", fontSize: 12, color: c.textMuted }}>
                      Conflicts with the arithmetic.
                    </span>
                  </button>
                </li>
                <li data-finding-id="f-sum">
                  <button
                    type="button"
                    className="onganda-focus w-full text-left"
                    style={{ border: 0, borderLeft: `3px solid ${c.line}`, background: c.inverseBorder, padding: "4px 8px", cursor: "pointer", fontFamily: "inherit" }}
                    onMouseEnter={() => {}}
                    onFocus={() => {}}
                    onClick={() => {}}
                  >
                    <span style={{ display: "block", fontSize: 14, fontWeight: 600, color: c.text }}>
                      Arithmetic
                    </span>
                    <span style={{ display: "block", fontSize: 12, color: c.textMuted }}>Review the totals.</span>
                  </button>
                </li>
              </ul>
            </div>
            <p className="mt-4 text-xs" style={{ color: c.textMuted }}>
              Tab reaches every region; a finding lights its region in both directions. Regions are buttons, so Enter and Space activate them.
            </p>
          </PixelPanel>
        </div>
        <div className="mt-10">
          <PixelSubhead spaced>Navigation · the suite switcher — products above the items</PixelSubhead>
          <div className="max-w-xs">
            <PixelNav
              label="Workspace"
              products={[{ label: "Olupale", icon: IconSearch, href: "https://olupale.onganda.ai" }, { label: "Oshipale", icon: IconFile, href: "https://oshipale.onganda.ai", active: true }]}
              items={[{ label: "Check", icon: IconFile, href: "#/check", active: true }, { label: "Network", icon: IconFolder, href: "#/network" }, { label: "Requests", icon: IconSearch, href: "#/requests", badge: 2 }]}
            />
          </div>
        </div>
        <PixelDialog
          open={false}
          onClose={() => {}}
          eyebrow="Okaanda · granary"
          title="Delete the evaluation corpus?"
          footer={<>
            <PixelButton variant="ghost" onClick={() => {}}>Cancel</PixelButton>
            <PixelButton variant="danger" onClick={() => {}}>Delete corpus</PixelButton>
          </>}
        >
          <p>
            This removes 128 evaluation records and every scored run attached to them. Exports already downloaded are unaffected.
          </p>
          <div className="mt-5"><PixelNotice status="critical" title="This cannot be undone" /></div>
        </PixelDialog>
      </div>
    </section>
  );
}
