// ─── Onganda Export API — payload type contracts ──────────────────────────────
// These interfaces define the shape of data that would be sent to a backend
// export endpoint. Currently both editors export locally (browser print / Blob
// download). When a server-side renderer is added, wire the export handlers to
// POST these payloads to the corresponding routes.
//
// TODO endpoints (to be implemented when server-side export is ready):
//   POST /api/export/document  → returns PDF binary or signed S3 URL
//   POST /api/export/deck      → returns PPT/PDF binary or signed S3 URL

import type { DocBlock } from './onganda-block-types';

// ─── Document export ──────────────────────────────────────────────────────────
export type DocumentExportFormat = 'PDF' | 'WORD';

export interface DocumentExportPayload {
  title: string;
  format: DocumentExportFormat;
  blocks: DocBlock[];
  isDark: boolean;
}

// ─── Deck (slide) export ──────────────────────────────────────────────────────
export type DeckExportFormat = 'PDF' | 'PPT';

export interface DeckSlideBlock {
  id: string;
  type: string;
  label: string;
  x: number;
  y: number;
  w?: number;
  h?: number;
  textContent?: string;
  textSize?: number;
  statValue?: string;
  statLabel?: string;
  statSub?: string;
  statHex?: string;
  chartTitle?: string;
  marketData?: string;
  radarData?: string;
  heatmapData?: string;
  timelineIdx?: number;
  systemIdx?: number;
  flowNodeIdx?: number;
  terminalIdx?: number;
  sectorAppIdx?: number;
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

export interface DeckSlide {
  id: string;
  tag: string;
  title: string;
  subtitle?: string;
  customTitle?: string;
  blocks: DeckSlideBlock[];
}

export interface DeckExportPayload {
  title: string;
  format: DeckExportFormat;
  slideCount: number;
  slides: DeckSlide[];
}
