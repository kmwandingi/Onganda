// ─── Onganda Design System — Library Entry ─────────────────────────────────────
// Published npm package entry point.
//
// Consumers:
//   import { COLOR, PixelDot, DitherBar, ... } from '@onganda/design-system';
//   import '@onganda/design-system/style.css';   ← design tokens (import separately)

// ─── Color tokens ─────────────────────────────────────────────────────────────
export {
  COLOR,
  COLOR_CSS_VARS,
  WEAVE,
  SWATCHES,
  GUIDE_PALETTE_SWATCHES,
  FOOTER_DITHER_SWATCHES,
  HERO_DITHER_COLORS,
  DITHER_COLS,
} from '../components/onganda/onganda-colors';

// ─── Content / data tokens ───────────────────────────────────────────────────
export {
  SYSTEMS,
  STATS,
  TERMINAL_BLOCKS,
  TIMELINE_PHASES,
  FLOW_NODES,
  HEATMAP_CELLS,
  HEATMAP_LABELS_X,
  HEATMAP_LABELS_Y,
  SECTOR_APPS,
  PRINCIPLES,
  GUIDE_ANNOTATIONS,
  PIXEL_RULES,
  FOOTER_LINKS,
  DIAGRAM_NODES,
  CONNECTION_EDGES,
  DIAGRAM_NODE_TOOLTIPS,
  SLIDE_MARKET_DATA,
  SLIDE_BAR_DATA,
  SLIDE_RADAR_DATA,
} from '../components/onganda/onganda-content';

// ─── TypeScript interfaces ────────────────────────────────────────────────────
export type {
  SystemEntry,
  StatEntry,
  TerminalBlock,
  TerminalLine,
  TimelinePhase,
  FlowNodeEntry,
  SectorApp,
  HeatCell,
  SwatchEntry,
  PrincipleEntry,
  GuideAnnotation,
  PixelRule,
  FooterLink,
  DiagramNode,
  ConnectionEdge,
  NodeTooltipData,
  DitherCol,
} from '../components/onganda/onganda-types';

// ─── Block types ──────────────────────────────────────────────────────────────
export type {
  DocBlockType,
  AiGeneratableDocBlockType,
  DocBlock,
  InsertPaletteItem,
  ComponentPaletteItem,
  SlideEntry,
  DroppedBlock,
  SlideBlockType,
  AiSlideRawType,
  AiSlideBlock,
  AiSlide,
  AiDocBlock,
  AiAuthoringResult,
  BarChartData,
  BarChartDataPoint,
  LineChartData,
  LineChartDataPoint,
  AreaChartData,
  AreaChartDataPoint,
  PieChartData,
  PieChartDataPoint,
  RadarChartData,
  RadarChartDataPoint,
  ScatterChartData,
  ScatterChartDataPoint,
  TreemapData,
  TreemapDataPoint,
  FunnelData,
  FunnelDataPoint,
  ChartData,
} from '../components/onganda/onganda-block-types';

// ─── Block palettes ───────────────────────────────────────────────────────────
export {
  DOC_INSERT_PALETTE,
  DOC_PALETTE_CATEGORIES,
  SLIDE_COMPONENT_PALETTE,
  SLIDE_PALETTE_CATEGORIES,
} from '../components/onganda/onganda-block-palette';

// ─── Export API types ─────────────────────────────────────────────────────────
export type {
  DocumentExportFormat,
  DocumentExportPayload,
  DeckExportFormat,
  DeckSlideBlock,
  DeckSlide,
  DeckExportPayload,
} from '../components/onganda/onganda-export-api';

// ─── Motion & spacing tokens ──────────────────────────────────────────────────
export { MOTION, SPACE } from '../components/onganda/onganda-motion';

// ─── Primitives ───────────────────────────────────────────────────────────────
export {
  DarkContext,
  DarkProvider,
  useDark,
  Px,
  PixelDot,
  DitherBar,
  DitherStrip,
  PixelTag,
  PixelArrowDown,
  SectionHeader,
  WeaveOverlay,
  PixelCornerMarks,
  IconOkaanda,
  IconOshini,
  IconOmbiga,
  IconEtiti,
  IconOshitoo,
  OngandaLogoMark,
  systemIconForName,
  FlowNodeIcon,
  PixelButton,
  PixelInput,
  PixelTextarea,
  PixelSelect,
  SystemCard,
  StatCard,
  SwatchChip,
  TerminalCard,
  FlowNodeCard,
  FieldAppCard,
  AnnotationPanel,
  PrincipleRow,
  CodeSnippetBlock,
  OngandaFooter,
} from '../components/onganda/onganda-primitives';

// ─── Icons ────────────────────────────────────────────────────────────────────
export * from '../components/onganda/onganda-icons';

// ─── Icon factory (data-driven pixel icons) ───────────────────────────────────
export { createPixelIcon, validatePixelIconDef, pixelIconToSvgString } from '../components/onganda/onganda-icon-factory';
export type { PixelRect, PixelIconDef } from '../components/onganda/onganda-icon-factory';

// ─── Charts ───────────────────────────────────────────────────────────────────
export { ChartGallery } from '../components/onganda/onganda-charts';

// ─── Block renderer ───────────────────────────────────────────────────────────
export { DocBlockDisplay, BlockRenderer } from '../components/onganda/onganda-block-renderer';

// ─── Page sections ────────────────────────────────────────────────────────────
export {
  OngandaNav,
  OngandaHero,
  ResearchSignals,
  SystemConnectionDiagram,
  PixelHeatmap,
  RoadmapTimeline,
  FieldApplications,
  PixelFlowchart,
  IconShowcase,
} from '../components/onganda/onganda-sections';

// ─── Publications section ─────────────────────────────────────────────────────
export { Publications } from '../components/onganda/onganda-publications';

// ─── AI authoring ─────────────────────────────────────────────────────────────
export { AiAuthoringPanel, regenerateDocBlock } from '../components/onganda/onganda-ai-authoring';

// ─── Public sites ─────────────────────────────────────────────────────────────
export { OngandaPublicSite } from '../components/onganda/onganda-public-sites';

// ─── Stateful editor shells ───────────────────────────────────────────────────
export { DocumentEditor } from '../components/onganda/onganda-document-editor';
export { SlideEditor } from '../components/onganda/onganda-slide-editor';
export { SlideInspector } from '../components/onganda/onganda-slide-inspector';
