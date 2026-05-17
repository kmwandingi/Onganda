// ─── Onganda Design System — Tokens ──────────────────────────────────────────
// Single source of truth for all design tokens, data constants, and types.
// Import from this file in any component that needs brand values.

// ─── Color palette ────────────────────────────────────────────────────────────
export const COLOR = {
  milletClay: '#E8E1CF',
  dustLight: '#F3E8C3',
  mahanguGold: '#DFAE2B',
  ochreOrange: '#D9791F',
  firedRed: '#C84A1B',
  barkRust: '#8F3E21',
  mopaneBrown: '#6A4B2E',
  charBlack: '#1E1A17',
  dyePlum: '#6F4A6E',
  darkBg: '#120F0D',
  darkCard: '#1C1713',
  darkCardAlt: '#271F1A'
} as const;

// ─── Basket-weave texture (Oshiwambo coil strands + stepped diamond) ──────────
const STRAND_LIGHT = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='18' height='10'%3E%3Cellipse cx='2' cy='5' rx='4.5' ry='2.8' fill='%231E1A17'/%3E%3Cellipse cx='11' cy='5' rx='4.5' ry='2.8' fill='%231E1A17'/%3E%3C/svg%3E")`;
const STRAND_DARK = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='18' height='10'%3E%3Cellipse cx='2' cy='5' rx='4.5' ry='2.8' fill='%23E8E1CF'/%3E%3Cellipse cx='11' cy='5' rx='4.5' ry='2.8' fill='%23E8E1CF'/%3E%3C/svg%3E")`;
const DIAMOND_LIGHT = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='64' height='64'%3E%3Crect x='30' y='18' width='4' height='4' fill='%231E1A17'/%3E%3Crect x='26' y='22' width='4' height='4' fill='%231E1A17'/%3E%3Crect x='34' y='22' width='4' height='4' fill='%231E1A17'/%3E%3Crect x='22' y='26' width='4' height='12' fill='%231E1A17'/%3E%3Crect x='38' y='26' width='4' height='12' fill='%231E1A17'/%3E%3Crect x='26' y='38' width='4' height='4' fill='%231E1A17'/%3E%3Crect x='34' y='38' width='4' height='4' fill='%231E1A17'/%3E%3Crect x='30' y='42' width='4' height='4' fill='%231E1A17'/%3E%3C/svg%3E")`;
const DIAMOND_DARK = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='64' height='64'%3E%3Crect x='30' y='18' width='4' height='4' fill='%23E8E1CF'/%3E%3Crect x='26' y='22' width='4' height='4' fill='%23E8E1CF'/%3E%3Crect x='34' y='22' width='4' height='4' fill='%23E8E1CF'/%3E%3Crect x='22' y='26' width='4' height='12' fill='%23E8E1CF'/%3E%3Crect x='38' y='26' width='4' height='12' fill='%23E8E1CF'/%3E%3Crect x='26' y='38' width='4' height='4' fill='%23E8E1CF'/%3E%3Crect x='34' y='38' width='4' height='4' fill='%23E8E1CF'/%3E%3Crect x='30' y='42' width='4' height='4' fill='%23E8E1CF'/%3E%3C/svg%3E")`;
export const WEAVE = {
  light: `${DIAMOND_LIGHT}, ${STRAND_LIGHT}`,
  dark: `${DIAMOND_DARK},  ${STRAND_DARK}`,
  size: '64px 64px, 18px 10px'
} as const;

// ─── Types ────────────────────────────────────────────────────────────────────
export interface SystemEntry {
  name: string;
  english: string;
  role: string;
  desc: string;
  accent: string;
  iconColor: string;
  borderHex: string;
}
export interface PrincipleEntry {
  label: string;
  value: string;
}
export interface SwatchEntry {
  name: string;
  hex: string;
  desc: string;
  light: boolean;
}
export interface FlowNodeEntry {
  id: string;
  oshiwambo: string;
  english: string;
  role: string;
  hex: string;
  pixelTag: string;
  isRoot: boolean;
}
export interface GuideAnnotation {
  label: string;
  note: string;
}
export interface PixelRule {
  rule: string;
}
export interface FooterLink {
  label: string;
  href: string;
}
export interface StatEntry {
  value: string;
  label: string;
  sub: string;
  hex: string;
}
export interface TerminalLine {
  type: 'comment' | 'keyword' | 'string' | 'plain' | 'accent';
  text: string;
}
export interface TerminalBlock {
  title: string;
  tag: string;
  tagHex: string;
  lines: TerminalLine[];
}
export interface HeatCell {
  row: number;
  col: number;
  intensity: number;
}
export interface SectorApp {
  name: string;
  oshiwambo: string;
  sector: string;
  desc: string;
  hex: string;
  tag: string;
}
export interface ConnectionEdge {
  from: string;
  to: string;
  label: string;
  color: string;
}
export interface DiagramNode {
  id: string;
  label: string;
  sublabel: string;
  hex: string;
  tag: string;
  cx: number;
  cy: number;
}
export interface TimelinePhase {
  tag: string;
  oshiwambo: string;
  english: string;
  period: string;
  desc: string;
  hex: string;
  progress: number;
  status: 'complete' | 'active' | 'upcoming';
  milestones: string[];
}
export interface NodeTooltipData {
  role: string;
  desc: string;
  connects: string[];
}

// ─── Publication format entry ─────────────────────────────────────────────────
export interface PublicationFormat {
  id: string;
  oshiwambo: string;
  english: string;
  tag: string;
  hex: string;
  role: string;
  desc: string;
  hint: string;
  exports: string[];
  useCases: string[];
}

// ─── Static data ──────────────────────────────────────────────────────────────
export const SYSTEMS: SystemEntry[] = [{
  name: 'Okaanda',
  english: 'Namibia AI Systems Lab',
  role: 'Model & Data Platform',
  desc: 'Storage, resilience, readiness, and future capacity. Repositories for evaluation, memory, and large-scale datasets. The foundation that holds before it feeds.',
  accent: 'bg-[#D9791F]/8 border-[#D9791F]/25',
  iconColor: '#D9791F',
  borderHex: '#D9791F'
}, {
  name: 'Oshini',
  english: 'Mill',
  role: 'Adaptation Workflows',
  desc: 'Raw material to refined output. Fine-tuning, distillation, compression, and evaluation pipelines. The sequence from grain to flour.',
  accent: 'bg-[#8F3E21]/8 border-[#8F3E21]/25',
  iconColor: '#8F3E21',
  borderHex: '#8F3E21'
}, {
  name: 'Ombiga',
  english: 'Vessel',
  role: 'Agents & Containers',
  desc: 'Holding, carrying, and preserving. Runtimes for agents, memory systems, and model containers. Shape that makes liquid usable.',
  accent: 'bg-[#DFAE2B]/10 border-[#DFAE2B]/30',
  iconColor: '#DFAE2B',
  borderHex: '#DFAE2B'
}, {
  name: 'Etiti',
  english: 'Surface',
  role: 'Interfaces & Dashboards',
  desc: 'The woven place where things are set down and shared. User interfaces, workspaces, and read surfaces. Where the work meets the hand.',
  accent: 'bg-[#6A4B2E]/8 border-[#6A4B2E]/25',
  iconColor: '#6A4B2E',
  borderHex: '#6A4B2E'
}, {
  name: 'Oshitoo',
  english: 'Delivery',
  role: 'Applications & Sector Products',
  desc: 'The large round-bellied vessel used to hold and serve traditional beer. Carried to where the gathering is. Sector applications, field products, and user-facing deployments — the last pour of sovereign intelligence.',
  accent: 'bg-[#6F4A6E]/8 border-[#6F4A6E]/25',
  iconColor: '#6F4A6E',
  borderHex: '#6F4A6E'
}];
export const PRINCIPLES: PrincipleEntry[] = [{
  label: 'Language',
  value: 'Oshiwambo first. English second.'
}, {
  label: 'Symbol',
  value: 'Pixel by default — icon, diagram, texture, mark.'
}, {
  label: 'Type',
  value: 'Non-pixel by default — body, reading, interface.'
}, {
  label: 'Palette',
  value: 'Millet, clay, bark, smoke, ochre, dried grass.'
}, {
  label: 'Layout',
  value: 'Calm and editorial. Anthropic-level whitespace discipline.'
}];
export const SWATCHES: SwatchEntry[] = [{
  name: 'Millet Clay',
  hex: '#E8E1CF',
  desc: 'Base background',
  light: true
}, {
  name: 'Dust Light',
  hex: '#F3E8C3',
  desc: 'Lifted surface',
  light: true
}, {
  name: 'Mahangu Gold',
  hex: '#DFAE2B',
  desc: 'Secondary highlight',
  light: true
}, {
  name: 'Ochre Orange',
  hex: '#D9791F',
  desc: 'Warm accent',
  light: false
}, {
  name: 'Fired Red',
  hex: '#C84A1B',
  desc: 'Primary highlight',
  light: false
}, {
  name: 'Bark Rust',
  hex: '#8F3E21',
  desc: 'Support accent',
  light: false
}, {
  name: 'Mopane Brown',
  hex: '#6A4B2E',
  desc: 'Support neutral',
  light: false
}, {
  name: 'Char Black',
  hex: '#1E1A17',
  desc: 'Warm dark',
  light: false
}, {
  name: 'Dye Plum',
  hex: '#6F4A6E',
  desc: 'Rare accent',
  light: false
}];
export const FLOW_NODES: FlowNodeEntry[] = [{
  id: 'root',
  oshiwambo: 'Okaanda',
  english: 'Namibia AI Systems Lab',
  role: 'Parent Institution',
  hex: '#D9791F',
  pixelTag: 'ROOT',
  isRoot: true
}, {
  id: 'granary',
  oshiwambo: 'Okaanda',
  english: 'Granary',
  role: 'Model & Data Platform',
  hex: '#D9791F',
  pixelTag: '01',
  isRoot: false
}, {
  id: 'mill',
  oshiwambo: 'Oshini',
  english: 'Mill',
  role: 'Adaptation Workflows',
  hex: '#8F3E21',
  pixelTag: '02',
  isRoot: false
}, {
  id: 'vessel',
  oshiwambo: 'Ombiga',
  english: 'Vessel',
  role: 'Agents & Containers',
  hex: '#DFAE2B',
  pixelTag: '03',
  isRoot: false
}, {
  id: 'surface',
  oshiwambo: 'Etiti',
  english: 'Surface',
  role: 'Interfaces & Dashboards',
  hex: '#6A4B2E',
  pixelTag: '04',
  isRoot: false
}, {
  id: 'delivery',
  oshiwambo: 'Oshitoo',
  english: 'Delivery',
  role: 'Applications & Sector Products',
  hex: '#6F4A6E',
  pixelTag: '05',
  isRoot: false
}];
export const GUIDE_ANNOTATIONS: GuideAnnotation[] = [{
  label: 'Root',
  note: 'Parent brand and institutional identity. All sub-systems live under this mark.'
}, {
  label: 'Tag',
  note: 'Two-digit pixel tag for ordering, versioning, and spec references.'
}, {
  label: 'Oshiwambo',
  note: 'Primary name. Always leads in product, UI, and documentation contexts.'
}, {
  label: 'English',
  note: 'Secondary name. Provides functional clarity for external audiences.'
}, {
  label: 'Role',
  note: 'One-line functional description of what the system does architecturally.'
}, {
  label: 'Color',
  note: 'Each system carries its material color through iconography and accents only.'
}];
export const PIXEL_RULES: PixelRule[] = [{
  rule: 'Pixel by default: icon, diagram, texture, mark.'
}, {
  rule: 'Non-pixel by default: body, reading layout, dense interface.'
}, {
  rule: 'Stepped corners, not rounded, for brand assets.'
}, {
  rule: 'Dither and checker fills as core texture — not decoration.'
}, {
  rule: 'Typography stays clean so pixel elements breathe.'
}];
export const FOOTER_LINKS: FooterLink[] = [{
  label: 'Manifesto',
  href: '#'
}, {
  label: 'Documentation',
  href: '#'
}, {
  label: 'Research',
  href: '#'
}, {
  label: 'Partners',
  href: '#'
}];
export const STATS: StatEntry[] = [{
  value: '5',
  label: 'Active Systems',
  sub: 'in architecture',
  hex: '#D9791F'
}, {
  value: '3',
  label: 'Language Models',
  sub: 'adapted for Namibia',
  hex: '#8F3E21'
}, {
  value: '12',
  label: 'Sector Pilots',
  sub: 'across 4 industries',
  hex: '#DFAE2B'
}, {
  value: '1',
  label: 'Sovereign Lab',
  sub: 'Windhoek, Namibia',
  hex: '#6A4B2E'
}];
export const TIMELINE_PHASES: TimelinePhase[] = [{
  tag: 'P–01',
  oshiwambo: 'Ouheke',
  english: 'Foundation',
  period: 'Q1 – Q2 2024',
  desc: 'Establishing sovereign data infrastructure. Corpus ingestion, annotation pipelines, and base model evaluation across Oshiwambo language variants.',
  hex: '#D9791F',
  progress: 100,
  status: 'complete',
  milestones: ['Corpus v1 ingested', 'Annotation toolchain live', 'Okaanda granary deployed']
}, {
  tag: 'P–02',
  oshiwambo: 'Oshitwa',
  english: 'Adaptation',
  period: 'Q3 – Q4 2024',
  desc: 'Fine-tuning and distillation cycles. Oshini mill pipelines processing base models into Namibia-aligned variants for evaluation and iteration.',
  hex: '#8F3E21',
  progress: 78,
  status: 'active',
  milestones: ['namibia-base-1b fine-tuned', 'Oshini SDK beta released', 'Eval bench v1 published']
}, {
  tag: 'P–03',
  oshiwambo: 'Ombaanga',
  english: 'Containment',
  period: 'Q1 – Q2 2025',
  desc: 'Agent runtimes and model containers. Ombiga vessel system accepting adapted models. Memory systems and multi-agent coordination protocols.',
  hex: '#DFAE2B',
  progress: 34,
  status: 'active',
  milestones: ['Ombiga runtime alpha', 'Agent memory schema v1', 'Container registry open']
}, {
  tag: 'P–04',
  oshiwambo: 'Etiti Yontanda',
  english: 'Surface & Interface',
  period: 'Q3 2025',
  desc: 'Read surfaces and civic dashboards. Etiti interface layer connecting agents to sector operators, field workers, and government programme monitors.',
  hex: '#6A4B2E',
  progress: 12,
  status: 'upcoming',
  milestones: ['Dashboard framework', 'Civic data layer', 'Field operator UX']
}, {
  tag: 'P–05',
  oshiwambo: 'Oshitoo',
  english: 'Delivery',
  period: 'Q4 2025 – Q1 2026',
  desc: 'Sector application launch. Health, agriculture, education, and public administration pilots carrying sovereign intelligence to where it is needed.',
  hex: '#6F4A6E',
  progress: 0,
  status: 'upcoming',
  milestones: ['OshitooHealth launch', 'OshiniAgro field pilot', 'OkaandaEdu curriculum integration']
}];
export const TERMINAL_BLOCKS: TerminalBlock[] = [{
  title: 'Oshini — Fine-Tune Pipeline',
  tag: '02',
  tagHex: '#8F3E21',
  lines: [{
    type: 'comment',
    text: '# Oshini · adaptation workflow'
  }, {
    type: 'comment',
    text: '# from raw grain to processed flour'
  }, {
    type: 'plain',
    text: ''
  }, {
    type: 'keyword',
    text: 'from'
  }, {
    type: 'plain',
    text: ' oshini.pipeline '
  }, {
    type: 'keyword',
    text: 'import'
  }, {
    type: 'plain',
    text: ' FineTuneJob'
  }, {
    type: 'plain',
    text: ''
  }, {
    type: 'plain',
    text: 'job = FineTuneJob('
  }, {
    type: 'plain',
    text: '    base_model='
  }, {
    type: 'string',
    text: '"okaanda/namibia-base-1b"'
  }, {
    type: 'plain',
    text: ','
  }, {
    type: 'plain',
    text: '    dataset='
  }, {
    type: 'string',
    text: '"okaanda/oshiwambo-corpus-v2"'
  }, {
    type: 'plain',
    text: ','
  }, {
    type: 'plain',
    text: '    epochs='
  }, {
    type: 'accent',
    text: '3'
  }, {
    type: 'plain',
    text: ','
  }, {
    type: 'plain',
    text: '    weight_decay='
  }, {
    type: 'accent',
    text: '0.01'
  }, {
    type: 'plain',
    text: ')'
  }, {
    type: 'plain',
    text: ''
  }, {
    type: 'plain',
    text: 'job.run()'
  }]
}, {
  title: 'Okaanda — Model Query',
  tag: '01',
  tagHex: '#D9791F',
  lines: [{
    type: 'comment',
    text: '# Okaanda · granary data platform'
  }, {
    type: 'comment',
    text: '# retrieve stored evaluation record'
  }, {
    type: 'plain',
    text: ''
  }, {
    type: 'keyword',
    text: 'from'
  }, {
    type: 'plain',
    text: ' okaanda.client '
  }, {
    type: 'keyword',
    text: 'import'
  }, {
    type: 'plain',
    text: ' GranaryClient'
  }, {
    type: 'plain',
    text: ''
  }, {
    type: 'plain',
    text: 'client = GranaryClient('
  }, {
    type: 'plain',
    text: '    api_key=os.environ['
  }, {
    type: 'string',
    text: '"ONGANDA_API_KEY"'
  }, {
    type: 'plain',
    text: ']'
  }, {
    type: 'plain',
    text: ')'
  }, {
    type: 'plain',
    text: ''
  }, {
    type: 'plain',
    text: 'record = client.fetch('
  }, {
    type: 'plain',
    text: '    model='
  }, {
    type: 'string',
    text: '"namibia-base-1b"'
  }, {
    type: 'plain',
    text: ','
  }, {
    type: 'plain',
    text: '    eval_set='
  }, {
    type: 'string',
    text: '"oshiwambo-bench-v1"'
  }, {
    type: 'plain',
    text: ')'
  }, {
    type: 'plain',
    text: 'print(record.score)'
  }]
}];
export const HEATMAP_CELLS: HeatCell[] = [{
  row: 0,
  col: 0,
  intensity: 0.1
}, {
  row: 0,
  col: 1,
  intensity: 0.3
}, {
  row: 0,
  col: 2,
  intensity: 0.6
}, {
  row: 0,
  col: 3,
  intensity: 0.4
}, {
  row: 0,
  col: 4,
  intensity: 0.2
}, {
  row: 0,
  col: 5,
  intensity: 0.05
}, {
  row: 0,
  col: 6,
  intensity: 0.15
}, {
  row: 0,
  col: 7,
  intensity: 0.35
}, {
  row: 1,
  col: 0,
  intensity: 0.2
}, {
  row: 1,
  col: 1,
  intensity: 0.55
}, {
  row: 1,
  col: 2,
  intensity: 0.85
}, {
  row: 1,
  col: 3,
  intensity: 0.7
}, {
  row: 1,
  col: 4,
  intensity: 0.45
}, {
  row: 1,
  col: 5,
  intensity: 0.2
}, {
  row: 1,
  col: 6,
  intensity: 0.3
}, {
  row: 1,
  col: 7,
  intensity: 0.5
}, {
  row: 2,
  col: 0,
  intensity: 0.35
}, {
  row: 2,
  col: 1,
  intensity: 0.7
}, {
  row: 2,
  col: 2,
  intensity: 0.9
}, {
  row: 2,
  col: 3,
  intensity: 0.75
}, {
  row: 2,
  col: 4,
  intensity: 0.5
}, {
  row: 2,
  col: 5,
  intensity: 0.3
}, {
  row: 2,
  col: 6,
  intensity: 0.45
}, {
  row: 2,
  col: 7,
  intensity: 0.6
}, {
  row: 3,
  col: 0,
  intensity: 0.25
}, {
  row: 3,
  col: 1,
  intensity: 0.6
}, {
  row: 3,
  col: 2,
  intensity: 0.9
}, {
  row: 3,
  col: 3,
  intensity: 0.75
}, {
  row: 3,
  col: 4,
  intensity: 0.5
}, {
  row: 3,
  col: 5,
  intensity: 0.3
}, {
  row: 3,
  col: 6,
  intensity: 0.45
}, {
  row: 3,
  col: 7,
  intensity: 0.6
}, {
  row: 4,
  col: 0,
  intensity: 0.1
}, {
  row: 4,
  col: 1,
  intensity: 0.35
}, {
  row: 4,
  col: 2,
  intensity: 0.6
}, {
  row: 4,
  col: 3,
  intensity: 0.45
}, {
  row: 4,
  col: 4,
  intensity: 0.25
}, {
  row: 4,
  col: 5,
  intensity: 0.1
}, {
  row: 4,
  col: 6,
  intensity: 0.2
}, {
  row: 4,
  col: 7,
  intensity: 0.35
}, {
  row: 5,
  col: 0,
  intensity: 0.05
}, {
  row: 5,
  col: 1,
  intensity: 0.15
}, {
  row: 5,
  col: 2,
  intensity: 0.3
}, {
  row: 5,
  col: 3,
  intensity: 0.2
}, {
  row: 5,
  col: 4,
  intensity: 0.1
}, {
  row: 5,
  col: 5,
  intensity: 0.05
}, {
  row: 5,
  col: 6,
  intensity: 0.1
}, {
  row: 5,
  col: 7,
  intensity: 0.15
}];
export const HEATMAP_LABELS_X = ['Q1', 'Q2', 'Q3', 'Q4', 'Q1', 'Q2', 'Q3', 'Q4'];
export const HEATMAP_LABELS_Y = ['Okaanda', 'Oshini', 'Ombiga', 'Etiti', 'Oshitoo', 'Cross'];
export const SECTOR_APPS: SectorApp[] = [{
  name: 'OshitooHealth',
  oshiwambo: 'Oshitoo',
  sector: 'Healthcare',
  desc: 'AI triage and clinical decision support for rural clinics. Deployed in Northern Namibia.',
  hex: '#6F4A6E',
  tag: 'H–01'
}, {
  name: 'OshiniAgro',
  oshiwambo: 'Oshini',
  sector: 'Agriculture',
  desc: 'Crop failure prediction and soil analysis pipelines adapted for Namibian growing regions.',
  hex: '#8F3E21',
  tag: 'A–02'
}, {
  name: 'OkaandaEdu',
  oshiwambo: 'Okaanda',
  sector: 'Education',
  desc: 'Oshiwambo-first learning models. Curriculum-aligned reading and assessment tools.',
  hex: '#D9791F',
  tag: 'E–03'
}, {
  name: 'EtitiGov',
  oshiwambo: 'Etiti',
  sector: 'Public Sector',
  desc: 'Read surfaces and dashboards for government programme monitoring and civic AI.',
  hex: '#6A4B2E',
  tag: 'G–04'
}];
export const CONNECTION_EDGES: ConnectionEdge[] = [{
  from: 'Okaanda',
  to: 'Oshini',
  label: 'feeds raw data',
  color: '#D9791F'
}, {
  from: 'Oshini',
  to: 'Ombiga',
  label: 'outputs refined model',
  color: '#8F3E21'
}, {
  from: 'Ombiga',
  to: 'Etiti',
  label: 'exposes agent API',
  color: '#DFAE2B'
}, {
  from: 'Etiti',
  to: 'Oshitoo',
  label: 'renders interface',
  color: '#6A4B2E'
}, {
  from: 'Okaanda',
  to: 'Ombiga',
  label: 'stores containers',
  color: '#C84A1B'
}, {
  from: 'Oshini',
  to: 'Etiti',
  label: 'evaluation surface',
  color: '#8F3E21'
}];
export const DIAGRAM_NODES: DiagramNode[] = [{
  id: 'Okaanda',
  label: 'Okaanda',
  sublabel: 'Granary',
  hex: '#D9791F',
  tag: '01',
  cx: 50,
  cy: 16
}, {
  id: 'Oshini',
  label: 'Oshini',
  sublabel: 'Mill',
  hex: '#8F3E21',
  tag: '02',
  cx: 78,
  cy: 36
}, {
  id: 'Ombiga',
  label: 'Ombiga',
  sublabel: 'Vessel',
  hex: '#DFAE2B',
  tag: '03',
  cx: 78,
  cy: 66
}, {
  id: 'Oshitoo',
  label: 'Oshitoo',
  sublabel: 'Delivery',
  hex: '#6F4A6E',
  tag: '05',
  cx: 50,
  cy: 84
}, {
  id: 'Etiti',
  label: 'Etiti',
  sublabel: 'Surface',
  hex: '#6A4B2E',
  tag: '04',
  cx: 22,
  cy: 66
}, {
  id: 'root',
  label: 'Okaanda',
  sublabel: 'Lab Root',
  hex: '#D9791F',
  tag: 'ROOT',
  cx: 22,
  cy: 36
}];
export const DIAGRAM_NODE_TOOLTIPS: Record<string, NodeTooltipData> = {
  Okaanda: {
    role: 'Model & Data Platform',
    desc: 'Sovereign data infrastructure. Corpus repositories, evaluation memory, and large-scale datasets.',
    connects: ['Oshini', 'Ombiga']
  },
  Oshini: {
    role: 'Adaptation Workflows',
    desc: 'Fine-tuning, distillation, and compression pipelines. Transforms raw data into refined model variants.',
    connects: ['Ombiga', 'Etiti']
  },
  Ombiga: {
    role: 'Agents & Containers',
    desc: 'Agent runtimes, memory systems, and model containers. Holds and preserves adapted models.',
    connects: ['Etiti']
  },
  Etiti: {
    role: 'Interfaces & Dashboards',
    desc: 'Read surfaces, workspaces, and civic dashboards. The layer where work meets the hand.',
    connects: ['Oshitoo']
  },
  Oshitoo: {
    role: 'Applications & Sector Products',
    desc: 'Sector applications and field deployments. Served from the vessel to where the gathering is.',
    connects: []
  },
  root: {
    role: 'Parent Institution',
    desc: 'The institutional root. All sub-systems live under this brand. Windhoek, Namibia.',
    connects: []
  }
};

// ─── Publication formats ──────────────────────────────────────────────────────
export const PUBLICATION_FORMATS: PublicationFormat[] = [{
  id: 'document',
  oshiwambo: 'Oshitaandwa',
  english: 'Document',
  tag: 'DOC',
  hex: '#D9791F',
  role: 'White Papers, Letters & Reports',
  desc: 'Compose structured documents with branded letterheads, section dividers, and editorial typography. Everything authored here is a living page on the site — export to PDF or Word whenever you are ready.',
  hint: 'White papers · Partner letters · Research reports · Technical briefs',
  exports: ['PDF', 'Word'],
  useCases: ['White paper', 'Partner letter', 'Technical brief', 'Policy report']
}, {
  id: 'presentation',
  oshiwambo: 'Oshilongifano',
  english: 'Presentation',
  tag: 'DECK',
  hex: '#6F4A6E',
  role: 'Decks for Partners, Investors & Pilots',
  desc: 'Build slide decks with Onganda-branded layouts — cover slide, section dividers, content slides, and closing marks. The deck lives on the website as a first-class page and exports to PDF or PPT for offline sharing.',
  hint: 'Investor pitch · Partner overview · Pilot proposal · Systems walkthrough',
  exports: ['PDF', 'PPT'],
  useCases: ['Investor deck', 'Partner overview', 'Pilot proposal', 'Systems brief']
}];

// ─── Misc constant arrays ──────────────────────────────────────────────────────
export const GUIDE_PALETTE_SWATCHES = ['#D9791F', '#8F3E21', '#DFAE2B', '#6A4B2E', '#6F4A6E'];
export const FOOTER_DITHER_SWATCHES = ['#D9791F', '#C84A1B', '#DFAE2B', '#8F3E21', '#6A4B2E', '#1E1A17'];
export const HERO_DITHER_COLORS = ['#D9791F', '#C84A1B', '#DFAE2B', '#8F3E21', '#6A4B2E'];
export const TICKER_ITEMS = [{
  name: 'Onganda',
  role: 'Namibia AI Systems Lab',
  hex: '#D9791F'
}, {
  name: 'Oshini',
  role: 'Mill',
  hex: '#8F3E21'
}, {
  name: 'Ombiga',
  role: 'Vessel',
  hex: '#DFAE2B'
}, {
  name: 'Etiti',
  role: 'Surface',
  hex: '#6A4B2E'
}, {
  name: 'Oshitoo',
  role: 'Delivery',
  hex: '#6F4A6E'
}, {
  name: 'Okaanda',
  role: 'Namibia AI Systems Lab',
  hex: '#D9791F'
}, {
  name: 'Oshini',
  role: 'Mill',
  hex: '#8F3E21'
}, {
  name: 'Ombiga',
  role: 'Vessel',
  hex: '#DFAE2B'
}, {
  name: 'Etiti',
  role: 'Surface',
  hex: '#6A4B2E'
}, {
  name: 'Oshitoo',
  role: 'Delivery',
  hex: '#6F4A6E'
}];
export const DITHER_COLS = [{
  colors: ['#D9791F', '#C84A1B', '#D9791F', '#8F3E21', '#1E1A17', '#D9791F', '#DFAE2B', '#C84A1B'],
  delay: 0
}, {
  colors: ['#8F3E21', '#D9791F', '#1E1A17', '#C84A1B', '#DFAE2B', '#8F3E21', '#D9791F', '#1E1A17'],
  delay: 0.4
}, {
  colors: ['#DFAE2B', '#8F3E21', '#D9791F', '#1E1A17', '#C84A1B', '#DFAE2B', '#6A4B2E', '#D9791F'],
  delay: 0.8
}, {
  colors: ['#6A4B2E', '#DFAE2B', '#8F3E21', '#D9791F', '#1E1A17', '#6A4B2E', '#C84A1B', '#8F3E21'],
  delay: 1.2
}, {
  colors: ['#6F4A6E', '#6A4B2E', '#D9791F', '#8F3E21', '#DFAE2B', '#1E1A17', '#D9791F', '#6A4B2E'],
  delay: 0.2
}];
export const HERO_LINE_1_WORDS = [{
  text: 'A',
  color: '#1E1A17'
}, {
  text: 'workshop',
  color: '#1E1A17'
}];
export const HERO_LINE_2_WORDS = [{
  text: 'of',
  color: '#D9791F'
}, {
  text: 'intelligence.',
  color: '#D9791F'
}];
export const HERO_LINE_3_WORDS = [{
  text: 'Pixelated',
  color: '#1E1A17'
}, {
  text: 'by',
  color: '#1E1A17'
}, {
  text: 'design.',
  color: '#1E1A17'
}];
