// ─── Onganda Design System — Pixel Icon Factory ───────────────────────────────
// Data-driven path for authoring pixel icons: define rects on an integer grid,
// get a ready component. Replaces hand-written per-rect JSX for new icons.
//
//   const ICON_DEFS = {
//     Granary: { grid: 12, rects: [{ x: 5, y: 1, w: 2, h: 2 }, …] },
//   } satisfies Record<string, PixelIconDef>;
//   export const IconGranary = createPixelIcon(ICON_DEFS.Granary);
//
// Color is set once on the SVG root (currentColor cascade), so per-rect fill
// overrides stay possible via `fill` but are rarely needed.

import React from 'react';
import type { IconProps } from './onganda-icons';
import { COLOR } from './onganda-colors';

export interface PixelRect {
  x: number;
  y: number;
  w: number;
  h: number;
  /** 0–1; use 0.25–0.65 for texture/shadow marks */
  opacity?: number;
  /** override fill for multi-color brand icons; omit for currentColor */
  fill?: string;
}

export interface PixelIconDef {
  /** grid side length — 12 for interface icons, 24 for brand/system icons */
  grid: number;
  rects: PixelRect[];
}

// Returns human-readable problems; empty array = valid. Run in tests or a
// build check when adding icons.
export const validatePixelIconDef = (name: string, def: PixelIconDef): string[] => {
  const problems: string[] = [];
  if (!Number.isInteger(def.grid) || def.grid <= 0) problems.push(`${name}: grid must be a positive integer`);
  if (def.rects.length === 0) problems.push(`${name}: no rects`);
  if (def.rects.length > 35) problems.push(`${name}: ${def.rects.length} rects — keep icons pixel-sparse (max 35)`);
  def.rects.forEach((r, i) => {
    if (![r.x, r.y, r.w, r.h].every(Number.isInteger)) problems.push(`${name} rect ${i}: non-integer coordinates`);
    if (r.w <= 0 || r.h <= 0) problems.push(`${name} rect ${i}: non-positive size`);
    if (r.x < 0 || r.y < 0 || r.x + r.w > def.grid || r.y + r.h > def.grid) problems.push(`${name} rect ${i}: outside ${def.grid}×${def.grid} grid`);
    if (r.opacity !== undefined && (r.opacity < 0 || r.opacity > 1)) problems.push(`${name} rect ${i}: opacity out of range`);
  });
  return problems;
};

export const createPixelIcon = (def: PixelIconDef) => {
  const PixelIcon = ({
    size = 16,
    color,
    opacity,
    className,
    'aria-label': ariaLabel
  }: IconProps) => {
  // Snapped to a whole multiple of the grid, like every Px icon.
  const px = Math.max(1, Math.round(size / def.grid)) * def.grid;
  return <svg width={px} height={px} shapeRendering="crispEdges" viewBox={`0 0 ${def.grid} ${def.grid}`} fill="none" stroke="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden={ariaLabel ? undefined : true} aria-label={ariaLabel} role={ariaLabel ? 'img' : undefined} style={color || opacity !== undefined ? {
    color,
    opacity
  } : undefined}>
      {def.rects.map((r, i) => <rect key={i} x={r.x} y={r.y} width={r.w} height={r.h} fill={r.fill ?? 'currentColor'} fillOpacity={r.opacity} />)}
    </svg>;
  };
  return PixelIcon;
};

// Renders a def to a standalone SVG string — for exporting icons to .svg
// files, docs, or Figma import.
export const pixelIconToSvgString = (def: PixelIconDef, color = COLOR.charBlack): string => {
  const rects = def.rects.map(r => `<rect x="${r.x}" y="${r.y}" width="${r.w}" height="${r.h}" fill="${r.fill ?? color}"${r.opacity !== undefined ? ` fill-opacity="${r.opacity}"` : ''}/>`).join('');
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${def.grid} ${def.grid}" fill="none">${rects}</svg>`;
};
