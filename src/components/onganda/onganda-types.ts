// ─── Onganda Design System — Interfaces ───────────────────────────────────────
// All TypeScript interfaces for the design system. Import from here or from
// onganda-tokens (barrel) when you need types alongside constants.

export interface SystemEntry {
  name: string;
  english: string;
  borderHex: string;
  // Only the card surfaces read these. A consumer feeding PixelTicker was
  // passing empty strings to satisfy the shape, which is the type telling a
  // lie about what the component needs.
  role?: string;
  desc?: string;
  line?: string;
  long?: string;
  accent?: string;
  iconColor?: string;
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
export interface DitherCol {
  colors: string[];
  delay: number;
}
export interface TickerItem {
  name: string;
  role: string;
  hex: string;
}
export interface HeroWord {
  text: string;
  color: string;
}
