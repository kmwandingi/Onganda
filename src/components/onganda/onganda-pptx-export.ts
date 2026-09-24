// ─── Onganda Slide Deck → PowerPoint (.pptx) ──────────────────────────────────
// Maps DroppedBlocks to native, editable PowerPoint objects via pptxgenjs:
// real text boxes, shapes, and native charts — not an HTML blob. Every block
// type has a mapping; unknown types fall back to a labelled text box so an
// export never fails.
//
// Geometry: canvas positions are center-% of a 16:9 slide → inches on a
// 13.333in × 7.5in page. Blocks without explicit w/h use per-type defaults
// mirroring their intrinsic canvas size.

import PptxGenJSImport from 'pptxgenjs';
import { COLOR, SYSTEMS, TIMELINE_PHASES, FLOW_NODES, HEATMAP_CELLS, SLIDE_MARKET_DATA, SLIDE_BAR_DATA, SLIDE_RADAR_DATA } from './onganda-tokens';

// CJS/ESM interop: bundlers resolve the ESM default; node resolves the CJS
// module object whose constructor sits on .default.
type PptxGenJS = PptxGenJSImport;
const PptxGenJS = ((PptxGenJSImport as unknown as { default?: typeof PptxGenJSImport }).default ?? PptxGenJSImport);
import type { SlideEntry, DroppedBlock } from './onganda-block-types';

const PAGE_W = 13.333;
const PAGE_H = 7.5;
const FONT = 'Inter';

// pptxgenjs wants hex without '#'
const hx = (c: string) => c.replace('#', '');
const PAPER = 'FDFAF2';
const INK = hx(COLOR.charBlack);
const MUTED = '6B6259';

interface Box {
  x: number;
  y: number;
  w: number;
  h: number;
}

// Default block footprint in inches (w, h) when the block carries no w/h.
const DEFAULT_SIZE: Record<string, [number, number]> = {
  'text-headline': [10, 1.0],
  'text-body': [3.6, 1.2],
  'text-label': [3.2, 0.4],
  'text-quote': [3.8, 1.1],
  'divider-dither': [2.9, 0.08],
  'divider-dot': [1.2, 0.15],
  'stat-custom': [2.0, 1.35],
  'chart-market': [3.4, 2.2],
  'chart-progress': [3.2, 2.0],
  'chart-radar': [2.9, 2.1],
  'chart-heatmap': [3.0, 2.0],
  'chart-timeline': [2.6, 1.6],
  icon: [0.85, 1.05],
  'sys-card': [2.7, 1.15],
  timeline: [2.5, 1.7],
  'flow-node': [2.7, 1.2],
  fallback: [2.6, 0.6]
};

const sizeFor = (block: DroppedBlock): [number, number] => {
  if (block.w !== undefined && block.h !== undefined) {
    return [block.w / 100 * PAGE_W, block.h / 100 * PAGE_H];
  }
  if (block.type.startsWith('icon-') || block.type.startsWith('badge-')) return DEFAULT_SIZE.icon;
  if (block.type.startsWith('sys-card')) return DEFAULT_SIZE['sys-card'];
  if (block.type.startsWith('timeline')) return DEFAULT_SIZE.timeline;
  if (block.type.startsWith('flow-node')) return DEFAULT_SIZE['flow-node'];
  if (block.type.startsWith('stat-')) return DEFAULT_SIZE['stat-custom'];
  return DEFAULT_SIZE[block.type] ?? DEFAULT_SIZE.fallback;
};

// Center-% position + inch size → top-left box, clamped to the page.
const boxFor = (block: DroppedBlock): Box => {
  const [w, h] = sizeFor(block);
  const x = Math.max(0.1, Math.min(PAGE_W - w - 0.1, block.x / 100 * PAGE_W - w / 2));
  const y = Math.max(0.1, Math.min(PAGE_H - h - 0.1, block.y / 100 * PAGE_H - h / 2));
  return { x, y, w, h };
};

const systemForType = (type: string, idx?: number) => {
  const fromSuffix = ['okaanda', 'oshini', 'ombiga', 'etiti', 'oshitoo'].findIndex(n => type.endsWith(n));
  const i = idx ?? (fromSuffix >= 0 ? fromSuffix : parseInt(type.replace(/\D/g, ''), 10) || 0);
  return SYSTEMS[i % SYSTEMS.length];
};

const parseJson = <T,>(raw: string | undefined, fallback: T): T => {
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
};

type PptxSlide = ReturnType<PptxGenJS['addSlide']>;

const addBlock = (pptx: PptxGenJS, slide: PptxSlide, block: DroppedBlock) => {
  const b = boxFor(block);
  const t = block.type;
  const text = block.textContent ?? '';
  const fontSize = block.textSize;

  if (t === 'text-headline') {
    slide.addText(text || 'Headline', { ...b, fontFace: FONT, fontSize: fontSize ?? 30, bold: true, color: INK, align: 'center', valign: 'middle' });
    return;
  }
  if (t === 'text-body') {
    slide.addText(text || '', { ...b, fontFace: FONT, fontSize: fontSize ?? 12, color: MUTED, align: 'left', valign: 'top', lineSpacingMultiple: 1.35 });
    return;
  }
  if (t === 'text-label') {
    slide.addText((text || 'LABEL').toUpperCase(), { ...b, fontFace: FONT, fontSize: fontSize ?? 10, bold: true, color: hx(COLOR.ochreOrange), charSpacing: 2, align: 'left', valign: 'middle' });
    return;
  }
  if (t === 'text-quote') {
    slide.addShape('rect', { x: b.x, y: b.y, w: 0.04, h: b.h, fill: { color: hx(COLOR.ochreOrange) } });
    slide.addText(text || '', { x: b.x + 0.15, y: b.y, w: b.w - 0.15, h: b.h, fontFace: FONT, fontSize: fontSize ?? 13, italic: true, color: hx(COLOR.ochreOrange), valign: 'middle', lineSpacingMultiple: 1.3 });
    return;
  }
  if (t === 'divider-dither' || t === 'divider-dot') {
    slide.addShape('line', { x: b.x, y: b.y + b.h / 2, w: b.w, h: 0, line: { color: hx(COLOR.ochreOrange), width: 2, dashType: 'sysDash' } });
    return;
  }
  if (t.startsWith('stat-')) {
    const presets: Record<string, [string, string]> = {
      'stat-lab': ['1', 'Sovereign lab'],
      'stat-systems': ['5', 'Systems in the stack'],
      'stat-models': ['3', 'Model families adapted'],
      'stat-pilots': ['3', 'Sector pilots planned']
    };
    const [pv, pl] = presets[t] ?? ['—', ''];
    const value = block.statValue ?? pv;
    const label = block.statLabel ?? pl;
    const accent = hx(block.statHex ?? COLOR.ochreOrange);
    slide.addShape('rect', { ...b, fill: { color: PAPER }, line: { color: accent, width: 0.75 } });
    slide.addShape('rect', { x: b.x, y: b.y, w: b.w, h: 0.05, fill: { color: accent } });
    slide.addText([
      { text: value, options: { fontFace: FONT, fontSize: 28, bold: true, color: accent, breakLine: true } },
      { text: label, options: { fontFace: FONT, fontSize: 10, color: INK } }
    ], { x: b.x + 0.1, y: b.y + 0.1, w: b.w - 0.2, h: b.h - 0.2, align: 'center', valign: 'middle' });
    return;
  }
  if (t === 'chart-market') {
    const data = parseJson(block.marketData, SLIDE_MARKET_DATA);
    slide.addText((block.chartTitle ?? 'Market Growth').toUpperCase(), { x: b.x, y: b.y, w: b.w, h: 0.3, fontFace: FONT, fontSize: 9, bold: true, color: hx(COLOR.ochreOrange), charSpacing: 2 });
    slide.addChart('line', [{ name: block.chartTitle ?? 'Market', labels: data.map(d => d.year), values: data.map(d => d.value) }], {
      x: b.x, y: b.y + 0.3, w: b.w, h: b.h - 0.3,
      chartColors: [hx(COLOR.ochreOrange)], lineSize: 2,
      showLegend: false, catAxisLabelFontSize: 8, valAxisLabelFontSize: 8,
      catAxisLabelFontFace: FONT, valAxisLabelFontFace: FONT, valGridLine: { style: 'none' }
    });
    return;
  }
  if (t === 'chart-progress') {
    slide.addText((block.chartTitle ?? 'System Progress').toUpperCase(), { x: b.x, y: b.y, w: b.w, h: 0.3, fontFace: FONT, fontSize: 9, bold: true, color: hx(COLOR.barkRust), charSpacing: 2 });
    slide.addChart('bar', [{ name: 'Progress', labels: SLIDE_BAR_DATA.map(d => d.name), values: SLIDE_BAR_DATA.map(d => d.progress) }], {
      x: b.x, y: b.y + 0.3, w: b.w, h: b.h - 0.3,
      chartColors: [hx(COLOR.barkRust)],
      showLegend: false, catAxisLabelFontSize: 8, valAxisLabelFontSize: 8,
      catAxisLabelFontFace: FONT, valAxisLabelFontFace: FONT, valAxisMaxVal: 100, valGridLine: { style: 'none' }
    });
    return;
  }
  if (t === 'chart-radar') {
    const data = parseJson(block.radarData, SLIDE_RADAR_DATA);
    slide.addText('CAPABILITY RADAR', { x: b.x, y: b.y, w: b.w, h: 0.3, fontFace: FONT, fontSize: 9, bold: true, color: hx(COLOR.dyePlum), charSpacing: 2 });
    slide.addChart('radar', [{ name: 'Capability', labels: data.map(d => d.subject), values: data.map(d => d.value) }], {
      x: b.x, y: b.y + 0.3, w: b.w, h: b.h - 0.3,
      chartColors: [hx(COLOR.dyePlum)], radarStyle: 'filled',
      showLegend: false, catAxisLabelFontSize: 8, catAxisLabelFontFace: FONT
    });
    return;
  }
  if (t === 'chart-heatmap') {
    const cells = parseJson(block.heatmapData, HEATMAP_CELLS);
    const rows = Math.max(...cells.map(c => c.row)) + 1;
    const cols = Math.max(...cells.map(c => c.col)) + 1;
    const cw = b.w / cols;
    const ch = b.h / rows;
    const heat = (v: number) => v > 0.85 ? COLOR.firedRed : v > 0.65 ? COLOR.ochreOrange : v > 0.45 ? COLOR.mahanguGold : v > 0.25 ? COLOR.barkRust : v > 0.1 ? COLOR.mopaneBrown : COLOR.charBlack;
    cells.forEach(cell => {
      slide.addShape('rect', {
        x: b.x + cell.col * cw, y: b.y + cell.row * ch,
        w: cw * 0.9, h: ch * 0.85,
        fill: { color: hx(heat(cell.intensity)), transparency: Math.round((1 - Math.max(0.25, cell.intensity)) * 60) }
      });
    });
    return;
  }
  if (t === 'chart-timeline' || t.startsWith('timeline')) {
    const phase = TIMELINE_PHASES[(block.timelineIdx ?? 0) % TIMELINE_PHASES.length];
    const accent = hx(phase.hex);
    const name = block.customPhaseName ?? phase.english;
    const period = block.customPeriod ?? phase.period ?? '';
    const progress = block.customProgress ?? phase.progress;
    slide.addShape('rect', { ...b, fill: { color: PAPER }, line: { color: accent, width: 0.75 } });
    slide.addShape('rect', { x: b.x, y: b.y, w: 0.05, h: b.h, fill: { color: accent } });
    slide.addText([
      { text: `${phase.tag}  ${period}`, options: { fontFace: FONT, fontSize: 9, bold: true, color: accent, breakLine: true } },
      { text: name, options: { fontFace: FONT, fontSize: 12, bold: true, color: INK, breakLine: true } },
      { text: `${progress}%`, options: { fontFace: FONT, fontSize: 9, bold: true, color: accent } }
    ], { x: b.x + 0.15, y: b.y + 0.08, w: b.w - 0.3, h: b.h - 0.3, valign: 'top' });
    slide.addShape('rect', { x: b.x + 0.15, y: b.y + b.h - 0.16, w: (b.w - 0.3) * Math.min(1, progress / 100), h: 0.06, fill: { color: accent } });
    return;
  }
  if (t.startsWith('sys-card')) {
    const sys = systemForType(t, block.systemIdx);
    const accent = hx(sys.borderHex);
    const name = block.customName ?? sys.name;
    const role = block.customRole ?? sys.role ?? '';
    slide.addShape('rect', { ...b, fill: { color: PAPER }, line: { color: accent, width: 0.75 } });
    slide.addShape('rect', { x: b.x, y: b.y, w: 0.05, h: b.h, fill: { color: accent } });
    slide.addShape('rect', { x: b.x + 0.12, y: b.y + b.h / 2 - 0.14, w: 0.28, h: 0.28, fill: { color: accent } });
    slide.addText([
      { text: name, options: { fontFace: FONT, fontSize: 13, bold: true, color: INK, breakLine: true } },
      { text: role.toUpperCase(), options: { fontFace: FONT, fontSize: 8, bold: true, color: accent, charSpacing: 1.5 } }
    ], { x: b.x + 0.5, y: b.y, w: b.w - 0.6, h: b.h, valign: 'middle' });
    return;
  }
  if (t.startsWith('flow-node')) {
    const node = FLOW_NODES[(block.flowNodeIdx ?? parseInt(t.replace(/\D/g, ''), 10) ?? 0) % FLOW_NODES.length];
    const accent = hx(COLOR.ochreOrange);
    slide.addShape('rect', { ...b, fill: { color: PAPER }, line: { color: accent, width: 0.75 } });
    slide.addText([
      { text: (block.customNodeName ?? node.oshiwambo), options: { fontFace: FONT, fontSize: 12, bold: true, color: INK, breakLine: true } },
      { text: (block.customNodeRole ?? node.role ?? '').toUpperCase(), options: { fontFace: FONT, fontSize: 8, bold: true, color: accent, charSpacing: 1.5 } }
    ], { x: b.x + 0.15, y: b.y, w: b.w - 0.3, h: b.h, valign: 'middle' });
    return;
  }
  if (t.startsWith('icon-') || t.startsWith('badge-')) {
    const sys = systemForType(t);
    slide.addShape('rect', { x: b.x + b.w / 2 - 0.22, y: b.y, w: 0.44, h: 0.44, fill: { color: hx(sys.borderHex) } });
    slide.addText(sys.name.toUpperCase(), { x: b.x - 0.3, y: b.y + 0.5, w: b.w + 0.6, h: 0.3, fontFace: FONT, fontSize: 8, bold: true, color: hx(sys.borderHex), align: 'center', charSpacing: 1.5 });
    return;
  }
  // Unknown block type — emit a labelled placeholder rather than failing.
  slide.addText(block.label || t, { ...b, fontFace: FONT, fontSize: 10, color: MUTED, align: 'center', valign: 'middle' });
};

// Build the deck in memory. Separated from the download wrapper so it can be
// exercised in tests (write('nodebuffer')) as well as the browser.
export const buildDeckPptx = (
  deckTitle: string,
  slides: SlideEntry[],
  slideBlocks: Record<string, DroppedBlock[]>
): PptxGenJS => {
  const pptx = new PptxGenJS();
  pptx.defineLayout({ name: 'ONGANDA_16x9', width: PAGE_W, height: PAGE_H });
  pptx.layout = 'ONGANDA_16x9';
  pptx.author = 'Onganda — Namibia AI Systems Lab';
  pptx.title = deckTitle;

  slides.forEach((entry, idx) => {
    const slide = pptx.addSlide();
    slide.background = { color: PAPER };
    // Brand chrome: top accent bar + header band, mirroring the canvas
    slide.addShape('rect', { x: 0, y: 0, w: PAGE_W, h: 0.06, fill: { color: hx(COLOR.ochreOrange) } });
    slide.addShape('rect', { x: 0.35, y: 0.2, w: 0.22, h: 0.22, fill: { color: hx(COLOR.ochreOrange) } });
    slide.addText([
      { text: 'OKAANDA', options: { fontFace: FONT, fontSize: 10, bold: true, color: hx(COLOR.ochreOrange), charSpacing: 2 } },
      { text: `   ·   ${entry.customTitle ?? entry.title}`, options: { fontFace: FONT, fontSize: 10, color: MUTED } }
    ], { x: 0.68, y: 0.14, w: PAGE_W - 2, h: 0.35, valign: 'middle' });
    slide.addShape('rect', { x: PAGE_W - 0.75, y: 0.16, w: 0.4, h: 0.3, fill: { color: hx(COLOR.ochreOrange) } });
    slide.addText(entry.tag, { x: PAGE_W - 0.75, y: 0.16, w: 0.4, h: 0.3, fontFace: FONT, fontSize: 10, bold: true, color: PAPER, align: 'center', valign: 'middle' });

    (slideBlocks[entry.id] ?? []).forEach(block => addBlock(pptx, slide, block));

    slide.addText(`${idx + 1} / ${slides.length}`, { x: PAGE_W - 1.1, y: PAGE_H - 0.4, w: 0.9, h: 0.3, fontFace: FONT, fontSize: 8, color: MUTED, align: 'right' });
  });
  return pptx;
};

// Browser entry: builds and triggers the .pptx download.
export const exportDeckToPptx = async (
  deckTitle: string,
  slides: SlideEntry[],
  slideBlocks: Record<string, DroppedBlock[]>,
  fileName: string
): Promise<void> => {
  const pptx = buildDeckPptx(deckTitle, slides, slideBlocks);
  await pptx.writeFile({ fileName });
};
