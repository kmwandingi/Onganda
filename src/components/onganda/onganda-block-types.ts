// ─── Onganda Block Types — Shared Schema ──────────────────────────────────────
// Single source of truth for block type enumerations, block data shapes, and
// chart data schemas. Both the document editor and slide editor import from here.
// Adding a new block type: update DocBlockType, then DocBlock if it needs new
// optional fields, then InsertPaletteItem defaults in the relevant editor.

// ─── Document block types ─────────────────────────────────────────────────────
// Full union covering every block the document editor can hold.
export type DocBlockType =
  | 'heading'
  | 'body'
  | 'pullquote'
  | 'divider'
  | 'callout'
  | 'list'
  | 'signature'
  | 'letterhead'
  | 'spacer'
  | 'stat'
  | 'terminal'
  | 'heatmap'
  | 'timeline'
  | 'systemcard'
  | 'flowchart'
  | 'principles'
  | 'swatchrow'
  | 'sources'
  | 'chart-market'
  | 'chart-bar'
  | 'chart-gallery';

// Subset the AI authoring panel can generate for documents.
// (Richer block types like heatmap and timeline are excluded as the AI
//  generates text-driven content; those are inserted manually.)
export type AiGeneratableDocBlockType =
  | 'heading'
  | 'body'
  | 'pullquote'
  | 'callout'
  | 'list'
  | 'divider'
  | 'signature'
  | 'chart-gallery';

// ─── Shared document block ────────────────────────────────────────────────────
export interface DocBlock {
  id: string;
  type: DocBlockType;
  content: string;
  statValue?: string;
  statLabel?: string;
  statSub?: string;
  statHex?: string;
  marginBefore?: number;
  marginAfter?: number;
  pageBreakBefore?: boolean;
  spacerHeight?: number;
  timelinePhaseIdx?: number;
  systemIdx?: number;
  flowNodeIdx?: number;
  terminalIdx?: number;
  chartTitle?: string;
  marketData?: string;   // JSON: { year: string; value: number }[]
  barValues?: string;    // JSON: { name: string; progress: number }[]
  heatmapData?: string;  // JSON: { row: number; col: number; intensity: number }[]
  principlesData?: string; // JSON: { label: string; value: string }[]
  swatchData?: string;   // JSON: { name: string; hex: string }[]
  sourcesData?: string;  // JSON: { label: string; detail: string; url?: string; links?: { label: string; url: string }[] }[]
  sigAuthor?: string;
  sigYear?: string;
  letterheadData?: string; // JSON: { title?: string; subtitle?: string; label?: string; status?: string; byline?: string; year?: string }
}

// ─── Insert palette item (document editor) ───────────────────────────────────
export interface InsertPaletteItem {
  id: string;
  label: string;
  desc: string;
  type: DocBlockType;
  defaultContent: string;
  hex: string;
  category: string;
}

// ─── Component palette item (slide editor) ───────────────────────────────────
export interface ComponentPaletteItem {
  id: string;
  category: string;
  label: string;
  desc: string;
  hex: string;
}

// ─── Slide editor entity types ────────────────────────────────────────────────
// Shared between the slide editor canvas and the SlideInspector panel.

export interface SlideEntry {
  id: string;
  tag: string;
  title: string;
  subtitle?: string;
  customTitle?: string;
}

export interface DroppedBlock {
  id: string;
  type: string;
  label: string;
  x: number;
  y: number;
  selected: boolean;
  editingText: boolean;
  editingField?: string;
  w?: number;
  h?: number;
  statValue?: string;
  statLabel?: string;
  statSub?: string;
  statHex?: string;
  textContent?: string;
  textSize?: number;
  timelineIdx?: number;
  systemIdx?: number;
  flowNodeIdx?: number;
  terminalIdx?: number;
  sectorAppIdx?: number;
  marketData?: string;
  radarData?: string;
  heatmapData?: string;
  chartTitle?: string;
  customName?: string;
  customRole?: string;
  customDesc?: string;
  customEnglish?: string;
  customPhaseName?: string;
  customPeriod?: string;
  customProgress?: number;
  customAppName?: string;
  customSector?: string;
  customAppDesc?: string;
  customNodeName?: string;
  customNodeRole?: string;
}

// ─── Slide block types ────────────────────────────────────────────────────────
export type SlideBlockType =
  | 'text-headline'
  | 'text-body'
  | 'text-label'
  | 'text-quote'
  | 'system'
  | 'chart'
  | 'timeline'
  | 'heatmap'
  | 'divider'
  | 'stats'
  | 'custom-node';

// ─── AI-generated slide block (from authoring panel) ────────────────────────
// The AI uses simpler type names that aiBlockType() maps to SlideBlockType.
export type AiSlideRawType = 'headline' | 'body' | 'label' | 'quote' | 'system' | 'chart' | 'divider';

export interface AiSlideBlock {
  type: AiSlideRawType;
  content: string;
  systemName?: 'Okaanda' | 'Oshini' | 'Ombiga' | 'Etiti' | 'Oshitoo';
}

export interface AiSlide {
  title: string;
  subtitle?: string;
  blocks: AiSlideBlock[];
}

// ─── AI-generated document block (from authoring panel) ─────────────────────
export interface AiDocBlock {
  type: AiGeneratableDocBlockType;
  content: string;
}

// ─── AI authoring result ─────────────────────────────────────────────────────
export interface AiAuthoringResult {
  title: string;
  summary: string;
  blocks?: AiDocBlock[];
  slides?: AiSlide[];
}

// ─── Chart data schemas ───────────────────────────────────────────────────────
// One type per major chart family. Used by block editors to validate
// data before passing to Recharts components.

export interface BarChartDataPoint {
  name: string;
  value: number;
  [key: string]: string | number;
}
export type BarChartData = BarChartDataPoint[];

export interface LineChartDataPoint {
  name: string;
  value: number;
  [key: string]: string | number;
}
export type LineChartData = LineChartDataPoint[];

export interface AreaChartDataPoint {
  name: string;
  value: number;
  [key: string]: string | number;
}
export type AreaChartData = AreaChartDataPoint[];

export interface PieChartDataPoint {
  name: string;
  value: number;
}
export type PieChartData = PieChartDataPoint[];

export interface RadarChartDataPoint {
  subject: string;
  value: number;
  [key: string]: string | number;
}
export type RadarChartData = RadarChartDataPoint[];

export interface ScatterChartDataPoint {
  x: number;
  y: number;
  name?: string;
}
export type ScatterChartData = ScatterChartDataPoint[];

export interface TreemapDataPoint {
  name: string;
  size: number;
  [key: string]: string | number;
}
export type TreemapData = TreemapDataPoint[];

export interface FunnelDataPoint {
  name: string;
  value: number;
}
export type FunnelData = FunnelDataPoint[];

// Discriminated union for any chart block's data field.
export type ChartData =
  | { kind: 'bar'; data: BarChartData }
  | { kind: 'line'; data: LineChartData }
  | { kind: 'area'; data: AreaChartData }
  | { kind: 'pie'; data: PieChartData }
  | { kind: 'radar'; data: RadarChartData }
  | { kind: 'scatter'; data: ScatterChartData }
  | { kind: 'treemap'; data: TreemapData }
  | { kind: 'funnel'; data: FunnelData };
