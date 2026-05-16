// ─── Okaanda Design System — Icon Bank ───────────────────────────────────────
// All pixel-art icons in the Okaanda system. Every icon follows the same rules:
//   · Built on the Px primitive (rect-only SVG, 12×12 or 16×16 grid)
//   · currentColor for monochrome; can be overridden with color prop
//   · size prop scales uniformly (default 16)
//   · No strokes — only filled rects, consistent with the Okaanda pixel language
//
// Categories mirror ShadCN icon needs:
//   Navigation, Actions, Status, Data, Media, Communication, System, Brand

import React from 'react';
import { Px } from './okaanda-primitives';

// ─── Shared prop type ─────────────────────────────────────────────────────────
export interface IconProps {
  size?: number;
  color?: string;
  opacity?: number;
}
const ic = (color?: string, opacity?: number): React.CSSProperties => color ? {
  color,
  opacity
} : opacity !== undefined ? {
  opacity
} : {};

// ════════════════════════════════════════════════════════════════════════════════
// NAVIGATION
// ════════════════════════════════════════════════════════════════════════════════

/** Arrow right — pixel chevron pointing right */
export const IconArrowRight = ({
  size = 16,
  color,
  opacity
}: IconProps) => <Px size={size} viewBox="0 0 12 12">
    <rect x="1" y="5" width="7" height="2" fill="currentColor" style={ic(color, opacity)} />
    <rect x="7" y="3" width="2" height="2" fill="currentColor" style={ic(color, opacity)} />
    <rect x="7" y="7" width="2" height="2" fill="currentColor" style={ic(color, opacity)} />
    <rect x="9" y="5" width="2" height="2" fill="currentColor" style={ic(color, opacity)} />
  </Px>;

/** Arrow left — pixel chevron pointing left */
export const IconArrowLeft = ({
  size = 16,
  color,
  opacity
}: IconProps) => <Px size={size} viewBox="0 0 12 12">
    <rect x="4" y="5" width="7" height="2" fill="currentColor" style={ic(color, opacity)} />
    <rect x="3" y="3" width="2" height="2" fill="currentColor" style={ic(color, opacity)} />
    <rect x="3" y="7" width="2" height="2" fill="currentColor" style={ic(color, opacity)} />
    <rect x="1" y="5" width="2" height="2" fill="currentColor" style={ic(color, opacity)} />
  </Px>;

/** Arrow up */
export const IconArrowUp = ({
  size = 16,
  color,
  opacity
}: IconProps) => <Px size={size} viewBox="0 0 12 12">
    <rect x="5" y="1" width="2" height="2" fill="currentColor" style={ic(color, opacity)} />
    <rect x="3" y="3" width="2" height="2" fill="currentColor" style={ic(color, opacity)} />
    <rect x="7" y="3" width="2" height="2" fill="currentColor" style={ic(color, opacity)} />
    <rect x="5" y="3" width="2" height="7" fill="currentColor" style={ic(color, opacity)} />
  </Px>;

/** Arrow down */
export const IconArrowDown = ({
  size = 16,
  color,
  opacity
}: IconProps) => <Px size={size} viewBox="0 0 12 12">
    <rect x="5" y="2" width="2" height="7" fill="currentColor" style={ic(color, opacity)} />
    <rect x="3" y="7" width="2" height="2" fill="currentColor" style={ic(color, opacity)} />
    <rect x="7" y="7" width="2" height="2" fill="currentColor" style={ic(color, opacity)} />
    <rect x="5" y="9" width="2" height="2" fill="currentColor" style={ic(color, opacity)} />
  </Px>;

/** Menu / hamburger */
export const IconMenu = ({
  size = 16,
  color,
  opacity
}: IconProps) => <Px size={size} viewBox="0 0 12 12">
    <rect x="1" y="2" width="10" height="2" fill="currentColor" style={ic(color, opacity)} />
    <rect x="1" y="5" width="10" height="2" fill="currentColor" style={ic(color, opacity)} />
    <rect x="1" y="8" width="10" height="2" fill="currentColor" style={ic(color, opacity)} />
  </Px>;

/** Close / X */
export const IconClose = ({
  size = 16,
  color,
  opacity
}: IconProps) => <Px size={size} viewBox="0 0 12 12">
    <rect x="1" y="1" width="2" height="2" fill="currentColor" style={ic(color, opacity)} />
    <rect x="3" y="3" width="2" height="2" fill="currentColor" style={ic(color, opacity)} />
    <rect x="5" y="5" width="2" height="2" fill="currentColor" style={ic(color, opacity)} />
    <rect x="7" y="3" width="2" height="2" fill="currentColor" style={ic(color, opacity)} />
    <rect x="9" y="1" width="2" height="2" fill="currentColor" style={ic(color, opacity)} />
    <rect x="3" y="7" width="2" height="2" fill="currentColor" style={ic(color, opacity)} />
    <rect x="7" y="7" width="2" height="2" fill="currentColor" style={ic(color, opacity)} />
    <rect x="1" y="9" width="2" height="2" fill="currentColor" style={ic(color, opacity)} />
    <rect x="9" y="9" width="2" height="2" fill="currentColor" style={ic(color, opacity)} />
  </Px>;

/** External link */
export const IconExternalLink = ({
  size = 16,
  color,
  opacity
}: IconProps) => <Px size={size} viewBox="0 0 12 12">
    <rect x="2" y="4" width="6" height="1" fill="currentColor" style={ic(color, opacity)} />
    <rect x="2" y="9" width="6" height="1" fill="currentColor" style={ic(color, opacity)} />
    <rect x="2" y="4" width="1" height="6" fill="currentColor" style={ic(color, opacity)} />
    <rect x="7" y="4" width="1" height="6" fill="currentColor" style={ic(color, opacity)} />
    <rect x="6" y="1" width="4" height="1" fill="currentColor" style={ic(color, opacity)} />
    <rect x="9" y="1" width="1" height="4" fill="currentColor" style={ic(color, opacity)} />
    <rect x="5" y="4" width="2" height="1" fill="currentColor" style={ic(color, opacity)} />
    <rect x="7" y="2" width="2" height="2" fill="currentColor" style={ic(color, opacity)} />
  </Px>;

/** Home */
export const IconHome = ({
  size = 16,
  color,
  opacity
}: IconProps) => <Px size={size} viewBox="0 0 12 12">
    <rect x="5" y="1" width="2" height="2" fill="currentColor" style={ic(color, opacity)} />
    <rect x="3" y="3" width="2" height="2" fill="currentColor" style={ic(color, opacity)} />
    <rect x="7" y="3" width="2" height="2" fill="currentColor" style={ic(color, opacity)} />
    <rect x="1" y="5" width="2" height="2" fill="currentColor" style={ic(color, opacity)} />
    <rect x="9" y="5" width="2" height="2" fill="currentColor" style={ic(color, opacity)} />
    <rect x="2" y="6" width="8" height="5" fill="currentColor" style={ic(color, opacity)} />
    <rect x="4" y="8" width="1" height="3" fill="currentColor" style={ic(color, opacity)} opacity="0.4" />
    <rect x="7" y="8" width="1" height="3" fill="currentColor" style={ic(color, opacity)} opacity="0.4" />
  </Px>;

/** Chevron up — compact directional */
export const IconChevronUp = ({
  size = 16,
  color,
  opacity
}: IconProps) => <Px size={size} viewBox="0 0 12 12">
    <rect x="5" y="3" width="2" height="2" fill="currentColor" style={ic(color, opacity)} />
    <rect x="3" y="5" width="2" height="2" fill="currentColor" style={ic(color, opacity)} />
    <rect x="7" y="5" width="2" height="2" fill="currentColor" style={ic(color, opacity)} />
    <rect x="1" y="7" width="2" height="2" fill="currentColor" style={ic(color, opacity)} />
    <rect x="9" y="7" width="2" height="2" fill="currentColor" style={ic(color, opacity)} />
  </Px>;

/** Chevron down — compact directional */
export const IconChevronDown = ({
  size = 16,
  color,
  opacity
}: IconProps) => <Px size={size} viewBox="0 0 12 12">
    <rect x="1" y="3" width="2" height="2" fill="currentColor" style={ic(color, opacity)} />
    <rect x="9" y="3" width="2" height="2" fill="currentColor" style={ic(color, opacity)} />
    <rect x="3" y="5" width="2" height="2" fill="currentColor" style={ic(color, opacity)} />
    <rect x="7" y="5" width="2" height="2" fill="currentColor" style={ic(color, opacity)} />
    <rect x="5" y="7" width="2" height="2" fill="currentColor" style={ic(color, opacity)} />
  </Px>;

/** Back / return arrow */
export const IconBack = ({
  size = 16,
  color,
  opacity
}: IconProps) => <Px size={size} viewBox="0 0 12 12">
    <rect x="1" y="5" width="2" height="2" fill="currentColor" style={ic(color, opacity)} />
    <rect x="3" y="3" width="2" height="2" fill="currentColor" style={ic(color, opacity)} />
    <rect x="3" y="7" width="2" height="2" fill="currentColor" style={ic(color, opacity)} />
    <rect x="5" y="5" width="5" height="2" fill="currentColor" style={ic(color, opacity)} />
    <rect x="8" y="3" width="2" height="2" fill="currentColor" style={ic(color, opacity)} />
    <rect x="10" y="5" width="1" height="4" fill="currentColor" style={ic(color, opacity)} />
    <rect x="8" y="9" width="2" height="1" fill="currentColor" style={ic(color, opacity)} />
  </Px>;

// ════════════════════════════════════════════════════════════════════════════════
// ACTIONS
// ════════════════════════════════════════════════════════════════════════════════

/** Search / magnifier */
export const IconSearch = ({
  size = 16,
  color,
  opacity
}: IconProps) => <Px size={size} viewBox="0 0 12 12">
    <rect x="2" y="2" width="6" height="1" fill="currentColor" style={ic(color, opacity)} />
    <rect x="1" y="3" width="1" height="4" fill="currentColor" style={ic(color, opacity)} />
    <rect x="7" y="3" width="1" height="4" fill="currentColor" style={ic(color, opacity)} />
    <rect x="2" y="7" width="6" height="1" fill="currentColor" style={ic(color, opacity)} />
    <rect x="7" y="7" width="2" height="2" fill="currentColor" style={ic(color, opacity)} />
    <rect x="9" y="9" width="2" height="2" fill="currentColor" style={ic(color, opacity)} />
  </Px>;

/** Plus / add */
export const IconPlus = ({
  size = 16,
  color,
  opacity
}: IconProps) => <Px size={size} viewBox="0 0 12 12">
    <rect x="5" y="1" width="2" height="10" fill="currentColor" style={ic(color, opacity)} />
    <rect x="1" y="5" width="10" height="2" fill="currentColor" style={ic(color, opacity)} />
  </Px>;

/** Minus / remove */
export const IconMinus = ({
  size = 16,
  color,
  opacity
}: IconProps) => <Px size={size} viewBox="0 0 12 12">
    <rect x="1" y="5" width="10" height="2" fill="currentColor" style={ic(color, opacity)} />
  </Px>;

/** Trash / delete */
export const IconTrash = ({
  size = 16,
  color,
  opacity
}: IconProps) => <Px size={size} viewBox="0 0 12 12">
    <rect x="4" y="1" width="4" height="1" fill="currentColor" style={ic(color, opacity)} />
    <rect x="3" y="2" width="6" height="1" fill="currentColor" style={ic(color, opacity)} />
    <rect x="1" y="3" width="10" height="1" fill="currentColor" style={ic(color, opacity)} />
    <rect x="2" y="4" width="1" height="7" fill="currentColor" style={ic(color, opacity)} />
    <rect x="9" y="4" width="1" height="7" fill="currentColor" style={ic(color, opacity)} />
    <rect x="3" y="4" width="6" height="7" fill="currentColor" style={ic(color, opacity)} fillOpacity="0.45" />
    <rect x="5" y="5" width="1" height="5" fill="currentColor" style={ic(color, opacity)} />
    <rect x="7" y="5" width="1" height="5" fill="currentColor" style={ic(color, opacity)} />
    <rect x="2" y="11" width="8" height="1" fill="currentColor" style={ic(color, opacity)} />
  </Px>;

/** Edit / pencil */
export const IconEdit = ({
  size = 16,
  color,
  opacity
}: IconProps) => <Px size={size} viewBox="0 0 12 12">
    <rect x="8" y="1" width="2" height="2" fill="currentColor" style={ic(color, opacity)} />
    <rect x="7" y="3" width="2" height="1" fill="currentColor" style={ic(color, opacity)} />
    <rect x="1" y="8" width="1" height="2" fill="currentColor" style={ic(color, opacity)} />
    <rect x="2" y="7" width="1" height="1" fill="currentColor" style={ic(color, opacity)} />
    <rect x="3" y="6" width="1" height="1" fill="currentColor" style={ic(color, opacity)} />
    <rect x="4" y="5" width="1" height="1" fill="currentColor" style={ic(color, opacity)} />
    <rect x="5" y="4" width="1" height="1" fill="currentColor" style={ic(color, opacity)} />
    <rect x="6" y="3" width="2" height="6" fill="currentColor" style={ic(color, opacity)} fillOpacity="0.5" />
    <rect x="6" y="3" width="2" height="1" fill="currentColor" style={ic(color, opacity)} />
    <rect x="1" y="10" width="3" height="1" fill="currentColor" style={ic(color, opacity)} />
    <rect x="1" y="11" width="4" height="1" fill="currentColor" style={ic(color, opacity)} fillOpacity="0.35" />
  </Px>;

/** Copy */
export const IconCopy = ({
  size = 16,
  color,
  opacity
}: IconProps) => <Px size={size} viewBox="0 0 12 12">
    <rect x="4" y="1" width="7" height="1" fill="currentColor" style={ic(color, opacity)} />
    <rect x="3" y="2" width="1" height="1" fill="currentColor" style={ic(color, opacity)} />
    <rect x="10" y="2" width="1" height="7" fill="currentColor" style={ic(color, opacity)} />
    <rect x="4" y="2" width="6" height="6" fill="currentColor" style={ic(color, opacity)} fillOpacity="0.18" />
    <rect x="4" y="8" width="6" height="1" fill="currentColor" style={ic(color, opacity)} />
    <rect x="1" y="4" width="7" height="1" fill="currentColor" style={ic(color, opacity)} />
    <rect x="1" y="5" width="1" height="6" fill="currentColor" style={ic(color, opacity)} />
    <rect x="7" y="5" width="1" height="6" fill="currentColor" style={ic(color, opacity)} />
    <rect x="1" y="11" width="7" height="1" fill="currentColor" style={ic(color, opacity)} />
    <rect x="2" y="5" width="5" height="6" fill="currentColor" style={ic(color, opacity)} fillOpacity="0.18" />
  </Px>;

/** Download */
export const IconDownload = ({
  size = 16,
  color,
  opacity
}: IconProps) => <Px size={size} viewBox="0 0 12 12">
    <rect x="5" y="1" width="2" height="6" fill="currentColor" style={ic(color, opacity)} />
    <rect x="3" y="5" width="2" height="2" fill="currentColor" style={ic(color, opacity)} />
    <rect x="7" y="5" width="2" height="2" fill="currentColor" style={ic(color, opacity)} />
    <rect x="5" y="7" width="2" height="2" fill="currentColor" style={ic(color, opacity)} />
    <rect x="1" y="10" width="10" height="1" fill="currentColor" style={ic(color, opacity)} />
  </Px>;

/** Upload */
export const IconUpload = ({
  size = 16,
  color,
  opacity
}: IconProps) => <Px size={size} viewBox="0 0 12 12">
    <rect x="5" y="3" width="2" height="2" fill="currentColor" style={ic(color, opacity)} />
    <rect x="3" y="3" width="2" height="2" fill="currentColor" style={ic(color, opacity)} />
    <rect x="7" y="3" width="2" height="2" fill="currentColor" style={ic(color, opacity)} />
    <rect x="5" y="1" width="2" height="2" fill="currentColor" style={ic(color, opacity)} />
    <rect x="5" y="5" width="2" height="5" fill="currentColor" style={ic(color, opacity)} />
    <rect x="1" y="10" width="10" height="1" fill="currentColor" style={ic(color, opacity)} />
  </Px>;

/** Share */
export const IconShare = ({
  size = 16,
  color,
  opacity
}: IconProps) => <Px size={size} viewBox="0 0 12 12">
    <rect x="8" y="1" width="3" height="3" fill="currentColor" style={ic(color, opacity)} />
    <rect x="8" y="8" width="3" height="3" fill="currentColor" style={ic(color, opacity)} />
    <rect x="1" y="4" width="3" height="3" fill="currentColor" style={ic(color, opacity)} />
    <rect x="4" y="5" width="4" height="1" fill="currentColor" style={ic(color, opacity)} />
    <rect x="7" y="3" width="1" height="2" fill="currentColor" style={ic(color, opacity)} />
    <rect x="6" y="4" width="1" height="1" fill="currentColor" style={ic(color, opacity)} />
    <rect x="7" y="7" width="1" height="2" fill="currentColor" style={ic(color, opacity)} />
    <rect x="6" y="7" width="1" height="1" fill="currentColor" style={ic(color, opacity)} />
  </Px>;

/** Refresh / reload */
export const IconRefresh = ({
  size = 16,
  color,
  opacity
}: IconProps) => <Px size={size} viewBox="0 0 12 12">
    <rect x="4" y="1" width="4" height="1" fill="currentColor" style={ic(color, opacity)} />
    <rect x="2" y="2" width="2" height="2" fill="currentColor" style={ic(color, opacity)} />
    <rect x="8" y="2" width="2" height="2" fill="currentColor" style={ic(color, opacity)} />
    <rect x="1" y="4" width="1" height="4" fill="currentColor" style={ic(color, opacity)} />
    <rect x="10" y="4" width="1" height="4" fill="currentColor" style={ic(color, opacity)} />
    <rect x="2" y="8" width="2" height="2" fill="currentColor" style={ic(color, opacity)} />
    <rect x="8" y="8" width="2" height="2" fill="currentColor" style={ic(color, opacity)} />
    <rect x="4" y="10" width="4" height="1" fill="currentColor" style={ic(color, opacity)} />
    <rect x="7" y="1" width="3" height="1" fill="currentColor" style={ic(color, opacity)} />
    <rect x="9" y="2" width="1" height="2" fill="currentColor" style={ic(color, opacity)} />
  </Px>;

/** Pin / bookmark */
export const IconPin = ({
  size = 16,
  color,
  opacity
}: IconProps) => <Px size={size} viewBox="0 0 12 12">
    <rect x="4" y="1" width="4" height="1" fill="currentColor" style={ic(color, opacity)} />
    <rect x="3" y="2" width="6" height="4" fill="currentColor" style={ic(color, opacity)} fillOpacity="0.5" />
    <rect x="3" y="2" width="1" height="4" fill="currentColor" style={ic(color, opacity)} />
    <rect x="8" y="2" width="1" height="4" fill="currentColor" style={ic(color, opacity)} />
    <rect x="3" y="6" width="6" height="1" fill="currentColor" style={ic(color, opacity)} />
    <rect x="2" y="7" width="8" height="1" fill="currentColor" style={ic(color, opacity)} />
    <rect x="5" y="8" width="2" height="3" fill="currentColor" style={ic(color, opacity)} />
  </Px>;

/** Maximize / expand */
export const IconMaximize = ({
  size = 16,
  color,
  opacity
}: IconProps) => <Px size={size} viewBox="0 0 12 12">
    <rect x="1" y="1" width="4" height="1" fill="currentColor" style={ic(color, opacity)} />
    <rect x="1" y="1" width="1" height="4" fill="currentColor" style={ic(color, opacity)} />
    <rect x="7" y="1" width="4" height="1" fill="currentColor" style={ic(color, opacity)} />
    <rect x="10" y="1" width="1" height="4" fill="currentColor" style={ic(color, opacity)} />
    <rect x="1" y="7" width="1" height="4" fill="currentColor" style={ic(color, opacity)} />
    <rect x="1" y="10" width="4" height="1" fill="currentColor" style={ic(color, opacity)} />
    <rect x="10" y="7" width="1" height="4" fill="currentColor" style={ic(color, opacity)} />
    <rect x="7" y="10" width="4" height="1" fill="currentColor" style={ic(color, opacity)} />
  </Px>;

/** Minimize / collapse */
export const IconMinimize = ({
  size = 16,
  color,
  opacity
}: IconProps) => <Px size={size} viewBox="0 0 12 12">
    <rect x="1" y="5" width="4" height="1" fill="currentColor" style={ic(color, opacity)} />
    <rect x="4" y="2" width="1" height="4" fill="currentColor" style={ic(color, opacity)} />
    <rect x="7" y="5" width="4" height="1" fill="currentColor" style={ic(color, opacity)} />
    <rect x="7" y="2" width="1" height="4" fill="currentColor" style={ic(color, opacity)} />
    <rect x="1" y="7" width="4" height="1" fill="currentColor" style={ic(color, opacity)} />
    <rect x="4" y="7" width="1" height="4" fill="currentColor" style={ic(color, opacity)} />
    <rect x="7" y="7" width="4" height="1" fill="currentColor" style={ic(color, opacity)} />
    <rect x="7" y="7" width="1" height="4" fill="currentColor" style={ic(color, opacity)} />
  </Px>;

// ════════════════════════════════════════════════════════════════════════════════
// STATUS & FEEDBACK
// ════════════════════════════════════════════════════════════════════════════════

/** Check / success */
export const IconCheck = ({
  size = 16,
  color,
  opacity
}: IconProps) => <Px size={size} viewBox="0 0 12 12">
    <rect x="1" y="5" width="2" height="2" fill="currentColor" style={ic(color, opacity)} />
    <rect x="3" y="7" width="2" height="2" fill="currentColor" style={ic(color, opacity)} />
    <rect x="5" y="5" width="2" height="2" fill="currentColor" style={ic(color, opacity)} />
    <rect x="7" y="3" width="2" height="2" fill="currentColor" style={ic(color, opacity)} />
    <rect x="9" y="1" width="2" height="2" fill="currentColor" style={ic(color, opacity)} />
  </Px>;

/** Alert / warning triangle */
export const IconAlert = ({
  size = 16,
  color,
  opacity
}: IconProps) => <Px size={size} viewBox="0 0 12 12">
    <rect x="5" y="1" width="2" height="1" fill="currentColor" style={ic(color, opacity)} />
    <rect x="4" y="2" width="1" height="1" fill="currentColor" style={ic(color, opacity)} />
    <rect x="7" y="2" width="1" height="1" fill="currentColor" style={ic(color, opacity)} />
    <rect x="3" y="3" width="1" height="1" fill="currentColor" style={ic(color, opacity)} />
    <rect x="8" y="3" width="1" height="1" fill="currentColor" style={ic(color, opacity)} />
    <rect x="2" y="4" width="1" height="5" fill="currentColor" style={ic(color, opacity)} />
    <rect x="9" y="4" width="1" height="5" fill="currentColor" style={ic(color, opacity)} />
    <rect x="3" y="9" width="6" height="1" fill="currentColor" style={ic(color, opacity)} />
    <rect x="5" y="4" width="2" height="3" fill="currentColor" style={ic(color, opacity)} />
    <rect x="5" y="8" width="2" height="1" fill="currentColor" style={ic(color, opacity)} />
  </Px>;

/** Info */
export const IconInfo = ({
  size = 16,
  color,
  opacity
}: IconProps) => <Px size={size} viewBox="0 0 12 12">
    <rect x="2" y="2" width="8" height="1" fill="currentColor" style={ic(color, opacity)} />
    <rect x="1" y="3" width="1" height="6" fill="currentColor" style={ic(color, opacity)} />
    <rect x="10" y="3" width="1" height="6" fill="currentColor" style={ic(color, opacity)} />
    <rect x="2" y="9" width="8" height="1" fill="currentColor" style={ic(color, opacity)} />
    <rect x="5" y="4" width="2" height="1" fill="currentColor" style={ic(color, opacity)} />
    <rect x="5" y="6" width="2" height="3" fill="currentColor" style={ic(color, opacity)} />
  </Px>;

/** Spinner / loading (static representation) */
export const IconLoader = ({
  size = 16,
  color,
  opacity
}: IconProps) => <Px size={size} viewBox="0 0 12 12">
    <rect x="5" y="1" width="2" height="2" fill="currentColor" style={ic(color, opacity)} />
    <rect x="8" y="2" width="2" height="2" fill="currentColor" style={ic(color, opacity)} fillOpacity="0.75" />
    <rect x="9" y="5" width="2" height="2" fill="currentColor" style={ic(color, opacity)} fillOpacity="0.6" />
    <rect x="8" y="8" width="2" height="2" fill="currentColor" style={ic(color, opacity)} fillOpacity="0.45" />
    <rect x="5" y="9" width="2" height="2" fill="currentColor" style={ic(color, opacity)} fillOpacity="0.3" />
    <rect x="2" y="8" width="2" height="2" fill="currentColor" style={ic(color, opacity)} fillOpacity="0.2" />
    <rect x="1" y="5" width="2" height="2" fill="currentColor" style={ic(color, opacity)} fillOpacity="0.15" />
    <rect x="2" y="2" width="2" height="2" fill="currentColor" style={ic(color, opacity)} fillOpacity="0.1" />
  </Px>;

/** Error / X in circle */
export const IconError = ({
  size = 16,
  color,
  opacity
}: IconProps) => <Px size={size} viewBox="0 0 12 12">
    <rect x="3" y="1" width="6" height="1" fill="currentColor" style={ic(color, opacity)} />
    <rect x="1" y="3" width="1" height="6" fill="currentColor" style={ic(color, opacity)} />
    <rect x="10" y="3" width="1" height="6" fill="currentColor" style={ic(color, opacity)} />
    <rect x="3" y="10" width="6" height="1" fill="currentColor" style={ic(color, opacity)} />
    <rect x="2" y="2" width="1" height="1" fill="currentColor" style={ic(color, opacity)} />
    <rect x="9" y="2" width="1" height="1" fill="currentColor" style={ic(color, opacity)} />
    <rect x="2" y="9" width="1" height="1" fill="currentColor" style={ic(color, opacity)} />
    <rect x="9" y="9" width="1" height="1" fill="currentColor" style={ic(color, opacity)} />
    <rect x="3" y="3" width="2" height="2" fill="currentColor" style={ic(color, opacity)} />
    <rect x="7" y="3" width="2" height="2" fill="currentColor" style={ic(color, opacity)} />
    <rect x="5" y="5" width="2" height="2" fill="currentColor" style={ic(color, opacity)} />
    <rect x="3" y="7" width="2" height="2" fill="currentColor" style={ic(color, opacity)} />
    <rect x="7" y="7" width="2" height="2" fill="currentColor" style={ic(color, opacity)} />
  </Px>;

/** Success / check in circle */
export const IconSuccess = ({
  size = 16,
  color,
  opacity
}: IconProps) => <Px size={size} viewBox="0 0 12 12">
    <rect x="3" y="1" width="6" height="1" fill="currentColor" style={ic(color, opacity)} />
    <rect x="1" y="3" width="1" height="6" fill="currentColor" style={ic(color, opacity)} />
    <rect x="10" y="3" width="1" height="6" fill="currentColor" style={ic(color, opacity)} />
    <rect x="3" y="10" width="6" height="1" fill="currentColor" style={ic(color, opacity)} />
    <rect x="2" y="2" width="1" height="1" fill="currentColor" style={ic(color, opacity)} />
    <rect x="9" y="2" width="1" height="1" fill="currentColor" style={ic(color, opacity)} />
    <rect x="2" y="9" width="1" height="1" fill="currentColor" style={ic(color, opacity)} />
    <rect x="9" y="9" width="1" height="1" fill="currentColor" style={ic(color, opacity)} />
    <rect x="2" y="6" width="2" height="2" fill="currentColor" style={ic(color, opacity)} />
    <rect x="4" y="8" width="2" height="2" fill="currentColor" style={ic(color, opacity)} />
    <rect x="6" y="6" width="2" height="2" fill="currentColor" style={ic(color, opacity)} />
    <rect x="8" y="4" width="2" height="2" fill="currentColor" style={ic(color, opacity)} />
  </Px>;

// ════════════════════════════════════════════════════════════════════════════════
// DATA & CONTENT
// ════════════════════════════════════════════════════════════════════════════════

/** File / document */
export const IconFile = ({
  size = 16,
  color,
  opacity
}: IconProps) => <Px size={size} viewBox="0 0 12 12">
    <rect x="2" y="1" width="6" height="1" fill="currentColor" style={ic(color, opacity)} />
    <rect x="2" y="2" width="1" height="9" fill="currentColor" style={ic(color, opacity)} />
    <rect x="9" y="4" width="1" height="7" fill="currentColor" style={ic(color, opacity)} />
    <rect x="2" y="11" width="8" height="1" fill="currentColor" style={ic(color, opacity)} />
    <rect x="3" y="2" width="5" height="9" fill="currentColor" style={ic(color, opacity)} fillOpacity="0.12" />
    <rect x="7" y="2" width="2" height="2" fill="currentColor" style={ic(color, opacity)} />
    <rect x="4" y="5" width="4" height="1" fill="currentColor" style={ic(color, opacity)} fillOpacity="0.45" />
    <rect x="4" y="7" width="4" height="1" fill="currentColor" style={ic(color, opacity)} fillOpacity="0.45" />
    <rect x="4" y="9" width="3" height="1" fill="currentColor" style={ic(color, opacity)} fillOpacity="0.45" />
  </Px>;

/** Folder */
export const IconFolder = ({
  size = 16,
  color,
  opacity
}: IconProps) => <Px size={size} viewBox="0 0 12 12">
    <rect x="1" y="3" width="4" height="1" fill="currentColor" style={ic(color, opacity)} />
    <rect x="1" y="4" width="10" height="1" fill="currentColor" style={ic(color, opacity)} />
    <rect x="1" y="5" width="1" height="6" fill="currentColor" style={ic(color, opacity)} />
    <rect x="10" y="5" width="1" height="6" fill="currentColor" style={ic(color, opacity)} />
    <rect x="2" y="11" width="8" height="1" fill="currentColor" style={ic(color, opacity)} />
    <rect x="2" y="5" width="8" height="6" fill="currentColor" style={ic(color, opacity)} fillOpacity="0.15" />
  </Px>;

/** Database */
export const IconDatabase = ({
  size = 16,
  color,
  opacity
}: IconProps) => <Px size={size} viewBox="0 0 12 12">
    <rect x="2" y="1" width="8" height="2" fill="currentColor" style={ic(color, opacity)} />
    <rect x="1" y="3" width="10" height="2" fill="currentColor" style={ic(color, opacity)} fillOpacity="0.7" />
    <rect x="1" y="5" width="1" height="2" fill="currentColor" style={ic(color, opacity)} />
    <rect x="10" y="5" width="1" height="2" fill="currentColor" style={ic(color, opacity)} />
    <rect x="2" y="7" width="8" height="1" fill="currentColor" style={ic(color, opacity)} fillOpacity="0.5" />
    <rect x="1" y="7" width="1" height="2" fill="currentColor" style={ic(color, opacity)} />
    <rect x="10" y="7" width="1" height="2" fill="currentColor" style={ic(color, opacity)} />
    <rect x="2" y="9" width="8" height="2" fill="currentColor" style={ic(color, opacity)} fillOpacity="0.7" />
  </Px>;

/** Chart / bar graph */
export const IconChart = ({
  size = 16,
  color,
  opacity
}: IconProps) => <Px size={size} viewBox="0 0 12 12">
    <rect x="1" y="9" width="2" height="2" fill="currentColor" style={ic(color, opacity)} />
    <rect x="4" y="6" width="2" height="5" fill="currentColor" style={ic(color, opacity)} />
    <rect x="7" y="3" width="2" height="8" fill="currentColor" style={ic(color, opacity)} />
    <rect x="10" y="1" width="1" height="10" fill="currentColor" style={ic(color, opacity)} fillOpacity="0.4" />
    <rect x="1" y="11" width="10" height="1" fill="currentColor" style={ic(color, opacity)} />
  </Px>;

/** Tag / label */
export const IconTag = ({
  size = 16,
  color,
  opacity
}: IconProps) => <Px size={size} viewBox="0 0 12 12">
    <rect x="1" y="1" width="5" height="5" fill="currentColor" style={ic(color, opacity)} fillOpacity="0.2" />
    <rect x="1" y="1" width="5" height="1" fill="currentColor" style={ic(color, opacity)} />
    <rect x="1" y="5" width="5" height="1" fill="currentColor" style={ic(color, opacity)} />
    <rect x="1" y="1" width="1" height="5" fill="currentColor" style={ic(color, opacity)} />
    <rect x="3" y="3" width="2" height="2" fill="currentColor" style={ic(color, opacity)} />
    <rect x="6" y="2" width="2" height="2" fill="currentColor" style={ic(color, opacity)} />
    <rect x="8" y="4" width="2" height="2" fill="currentColor" style={ic(color, opacity)} />
    <rect x="7" y="6" width="2" height="2" fill="currentColor" style={ic(color, opacity)} />
    <rect x="5" y="8" width="2" height="2" fill="currentColor" style={ic(color, opacity)} />
    <rect x="3" y="7" width="2" height="2" fill="currentColor" style={ic(color, opacity)} />
  </Px>;

/** Filter / funnel */
export const IconFilter = ({
  size = 16,
  color,
  opacity
}: IconProps) => <Px size={size} viewBox="0 0 12 12">
    <rect x="1" y="1" width="10" height="2" fill="currentColor" style={ic(color, opacity)} />
    <rect x="2" y="3" width="1" height="1" fill="currentColor" style={ic(color, opacity)} />
    <rect x="9" y="3" width="1" height="1" fill="currentColor" style={ic(color, opacity)} />
    <rect x="3" y="4" width="6" height="2" fill="currentColor" style={ic(color, opacity)} />
    <rect x="4" y="6" width="1" height="1" fill="currentColor" style={ic(color, opacity)} />
    <rect x="7" y="6" width="1" height="1" fill="currentColor" style={ic(color, opacity)} />
    <rect x="5" y="7" width="2" height="3" fill="currentColor" style={ic(color, opacity)} />
  </Px>;

/** Sort */
export const IconSort = ({
  size = 16,
  color,
  opacity
}: IconProps) => <Px size={size} viewBox="0 0 12 12">
    <rect x="1" y="2" width="10" height="1" fill="currentColor" style={ic(color, opacity)} />
    <rect x="1" y="5" width="7" height="1" fill="currentColor" style={ic(color, opacity)} />
    <rect x="1" y="8" width="4" height="1" fill="currentColor" style={ic(color, opacity)} />
  </Px>;

/** Table / spreadsheet */
export const IconTable = ({
  size = 16,
  color,
  opacity
}: IconProps) => <Px size={size} viewBox="0 0 12 12">
    <rect x="1" y="1" width="10" height="2" fill="currentColor" style={ic(color, opacity)} />
    <rect x="1" y="3" width="1" height="8" fill="currentColor" style={ic(color, opacity)} />
    <rect x="10" y="3" width="1" height="8" fill="currentColor" style={ic(color, opacity)} />
    <rect x="1" y="11" width="10" height="1" fill="currentColor" style={ic(color, opacity)} />
    <rect x="1" y="4" width="10" height="1" fill="currentColor" style={ic(color, opacity)} fillOpacity="0.4" />
    <rect x="1" y="7" width="10" height="1" fill="currentColor" style={ic(color, opacity)} fillOpacity="0.4" />
    <rect x="1" y="5" width="10" height="1" fill="currentColor" style={ic(color, opacity)} fillOpacity="0.4" />
    <rect x="1" y="7" width="10" height="1" fill="currentColor" style={ic(color, opacity)} fillOpacity="0.4" />
    <rect x="1" y="9" width="10" height="1" fill="currentColor" style={ic(color, opacity)} fillOpacity="0.4" />
  </Px>;

/** API / code brackets */
export const IconApi = ({
  size = 16,
  color,
  opacity
}: IconProps) => <Px size={size} viewBox="0 0 12 12">
    <rect x="1" y="4" width="2" height="2" fill="currentColor" style={ic(color, opacity)} />
    <rect x="1" y="6" width="1" height="2" fill="currentColor" style={ic(color, opacity)} />
    <rect x="2" y="6" width="2" height="2" fill="currentColor" style={ic(color, opacity)} />
    <rect x="9" y="4" width="2" height="2" fill="currentColor" style={ic(color, opacity)} />
    <rect x="10" y="6" width="1" height="2" fill="currentColor" style={ic(color, opacity)} />
    <rect x="8" y="6" width="2" height="2" fill="currentColor" style={ic(color, opacity)} />
    <rect x="5" y="2" width="2" height="8" fill="currentColor" style={ic(color, opacity)} fillOpacity="0.35" />
    <rect x="4" y="2" width="1" height="1" fill="currentColor" style={ic(color, opacity)} />
    <rect x="7" y="9" width="1" height="1" fill="currentColor" style={ic(color, opacity)} />
  </Px>;

/** Layers / stack */
export const IconLayers = ({
  size = 16,
  color,
  opacity
}: IconProps) => <Px size={size} viewBox="0 0 12 12">
    <rect x="2" y="1" width="8" height="2" fill="currentColor" style={ic(color, opacity)} />
    <rect x="1" y="3" width="10" height="1" fill="currentColor" style={ic(color, opacity)} fillOpacity="0.5" />
    <rect x="2" y="4" width="8" height="2" fill="currentColor" style={ic(color, opacity)} />
    <rect x="1" y="6" width="10" height="1" fill="currentColor" style={ic(color, opacity)} fillOpacity="0.5" />
    <rect x="2" y="7" width="8" height="2" fill="currentColor" style={ic(color, opacity)} />
    <rect x="1" y="9" width="10" height="1" fill="currentColor" style={ic(color, opacity)} fillOpacity="0.5" />
  </Px>;

// ════════════════════════════════════════════════════════════════════════════════
// COMMUNICATION
// ════════════════════════════════════════════════════════════════════════════════

/** Bell / notification */
export const IconBell = ({
  size = 16,
  color,
  opacity
}: IconProps) => <Px size={size} viewBox="0 0 12 12">
    <rect x="5" y="1" width="2" height="1" fill="currentColor" style={ic(color, opacity)} />
    <rect x="3" y="2" width="6" height="1" fill="currentColor" style={ic(color, opacity)} />
    <rect x="2" y="3" width="1" height="5" fill="currentColor" style={ic(color, opacity)} />
    <rect x="9" y="3" width="1" height="5" fill="currentColor" style={ic(color, opacity)} />
    <rect x="3" y="8" width="1" height="1" fill="currentColor" style={ic(color, opacity)} />
    <rect x="8" y="8" width="1" height="1" fill="currentColor" style={ic(color, opacity)} />
    <rect x="1" y="8" width="2" height="1" fill="currentColor" style={ic(color, opacity)} />
    <rect x="9" y="8" width="2" height="1" fill="currentColor" style={ic(color, opacity)} />
    <rect x="1" y="9" width="10" height="1" fill="currentColor" style={ic(color, opacity)} />
    <rect x="4" y="10" width="4" height="1" fill="currentColor" style={ic(color, opacity)} />
  </Px>;

/** Mail / envelope */
export const IconMail = ({
  size = 16,
  color,
  opacity
}: IconProps) => <Px size={size} viewBox="0 0 12 12">
    <rect x="1" y="2" width="10" height="1" fill="currentColor" style={ic(color, opacity)} />
    <rect x="1" y="9" width="10" height="1" fill="currentColor" style={ic(color, opacity)} />
    <rect x="1" y="3" width="1" height="6" fill="currentColor" style={ic(color, opacity)} />
    <rect x="10" y="3" width="1" height="6" fill="currentColor" style={ic(color, opacity)} />
    <rect x="2" y="3" width="3" height="3" fill="currentColor" style={ic(color, opacity)} fillOpacity="0.3" />
    <rect x="7" y="3" width="3" height="3" fill="currentColor" style={ic(color, opacity)} fillOpacity="0.3" />
    <rect x="5" y="5" width="2" height="2" fill="currentColor" style={ic(color, opacity)} />
    <rect x="4" y="4" width="1" height="2" fill="currentColor" style={ic(color, opacity)} fillOpacity="0.6" />
    <rect x="7" y="4" width="1" height="2" fill="currentColor" style={ic(color, opacity)} fillOpacity="0.6" />
  </Px>;

/** Message / chat bubble */
export const IconMessage = ({
  size = 16,
  color,
  opacity
}: IconProps) => <Px size={size} viewBox="0 0 12 12">
    <rect x="1" y="1" width="10" height="1" fill="currentColor" style={ic(color, opacity)} />
    <rect x="1" y="8" width="8" height="1" fill="currentColor" style={ic(color, opacity)} />
    <rect x="1" y="2" width="1" height="6" fill="currentColor" style={ic(color, opacity)} />
    <rect x="10" y="2" width="1" height="6" fill="currentColor" style={ic(color, opacity)} />
    <rect x="2" y="2" width="8" height="6" fill="currentColor" style={ic(color, opacity)} fillOpacity="0.1" />
    <rect x="3" y="4" width="6" height="1" fill="currentColor" style={ic(color, opacity)} fillOpacity="0.5" />
    <rect x="3" y="6" width="4" height="1" fill="currentColor" style={ic(color, opacity)} fillOpacity="0.5" />
    <rect x="1" y="9" width="1" height="1" fill="currentColor" style={ic(color, opacity)} />
    <rect x="2" y="10" width="1" height="1" fill="currentColor" style={ic(color, opacity)} />
    <rect x="3" y="9" width="1" height="1" fill="currentColor" style={ic(color, opacity)} />
  </Px>;

/** Phone / call */
export const IconPhone = ({
  size = 16,
  color,
  opacity
}: IconProps) => <Px size={size} viewBox="0 0 12 12">
    <rect x="2" y="1" width="4" height="1" fill="currentColor" style={ic(color, opacity)} />
    <rect x="1" y="2" width="1" height="4" fill="currentColor" style={ic(color, opacity)} />
    <rect x="5" y="2" width="1" height="4" fill="currentColor" style={ic(color, opacity)} />
    <rect x="2" y="5" width="4" height="1" fill="currentColor" style={ic(color, opacity)} />
    <rect x="3" y="3" width="2" height="2" fill="currentColor" style={ic(color, opacity)} fillOpacity="0.4" />
    <rect x="4" y="6" width="1" height="2" fill="currentColor" style={ic(color, opacity)} />
    <rect x="5" y="7" width="2" height="1" fill="currentColor" style={ic(color, opacity)} />
    <rect x="6" y="6" width="4" height="1" fill="currentColor" style={ic(color, opacity)} />
    <rect x="9" y="7" width="1" height="4" fill="currentColor" style={ic(color, opacity)} />
    <rect x="6" y="10" width="4" height="1" fill="currentColor" style={ic(color, opacity)} />
    <rect x="6" y="7" width="1" height="4" fill="currentColor" style={ic(color, opacity)} />
    <rect x="7" y="8" width="2" height="2" fill="currentColor" style={ic(color, opacity)} fillOpacity="0.4" />
  </Px>;

/** Broadcast / signal */
export const IconBroadcast = ({
  size = 16,
  color,
  opacity
}: IconProps) => <Px size={size} viewBox="0 0 12 12">
    <rect x="5" y="5" width="2" height="2" fill="currentColor" style={ic(color, opacity)} />
    <rect x="3" y="3" width="1" height="1" fill="currentColor" style={ic(color, opacity)} />
    <rect x="8" y="3" width="1" height="1" fill="currentColor" style={ic(color, opacity)} />
    <rect x="3" y="8" width="1" height="1" fill="currentColor" style={ic(color, opacity)} />
    <rect x="8" y="8" width="1" height="1" fill="currentColor" style={ic(color, opacity)} />
    <rect x="1" y="1" width="1" height="1" fill="currentColor" style={ic(color, opacity)} fillOpacity="0.5" />
    <rect x="10" y="1" width="1" height="1" fill="currentColor" style={ic(color, opacity)} fillOpacity="0.5" />
    <rect x="1" y="10" width="1" height="1" fill="currentColor" style={ic(color, opacity)} fillOpacity="0.5" />
    <rect x="10" y="10" width="1" height="1" fill="currentColor" style={ic(color, opacity)} fillOpacity="0.5" />
    <rect x="5" y="7" width="2" height="3" fill="currentColor" style={ic(color, opacity)} />
    <rect x="4" y="10" width="4" height="1" fill="currentColor" style={ic(color, opacity)} />
  </Px>;

// ════════════════════════════════════════════════════════════════════════════════
// SYSTEM / SETTINGS
// ════════════════════════════════════════════════════════════════════════════════

/** Settings / cog */
export const IconSettings = ({
  size = 16,
  color,
  opacity
}: IconProps) => <Px size={size} viewBox="0 0 12 12">
    <rect x="5" y="1" width="2" height="1" fill="currentColor" style={ic(color, opacity)} />
    <rect x="5" y="10" width="2" height="1" fill="currentColor" style={ic(color, opacity)} />
    <rect x="1" y="5" width="1" height="2" fill="currentColor" style={ic(color, opacity)} />
    <rect x="10" y="5" width="1" height="2" fill="currentColor" style={ic(color, opacity)} />
    <rect x="2" y="2" width="1" height="1" fill="currentColor" style={ic(color, opacity)} />
    <rect x="9" y="2" width="1" height="1" fill="currentColor" style={ic(color, opacity)} />
    <rect x="2" y="9" width="1" height="1" fill="currentColor" style={ic(color, opacity)} />
    <rect x="9" y="9" width="1" height="1" fill="currentColor" style={ic(color, opacity)} />
    <rect x="3" y="3" width="6" height="6" fill="currentColor" style={ic(color, opacity)} fillOpacity="0.2" />
    <rect x="4" y="4" width="4" height="4" fill="currentColor" style={ic(color, opacity)} fillOpacity="0.5" />
    <rect x="5" y="5" width="2" height="2" fill="currentColor" style={ic(color, opacity)} />
  </Px>;

/** Lock / security */
export const IconLock = ({
  size = 16,
  color,
  opacity
}: IconProps) => <Px size={size} viewBox="0 0 12 12">
    <rect x="4" y="1" width="4" height="1" fill="currentColor" style={ic(color, opacity)} />
    <rect x="3" y="2" width="1" height="3" fill="currentColor" style={ic(color, opacity)} />
    <rect x="8" y="2" width="1" height="3" fill="currentColor" style={ic(color, opacity)} />
    <rect x="2" y="5" width="8" height="1" fill="currentColor" style={ic(color, opacity)} />
    <rect x="2" y="6" width="1" height="5" fill="currentColor" style={ic(color, opacity)} />
    <rect x="9" y="6" width="1" height="5" fill="currentColor" style={ic(color, opacity)} />
    <rect x="2" y="11" width="8" height="1" fill="currentColor" style={ic(color, opacity)} />
    <rect x="3" y="6" width="6" height="5" fill="currentColor" style={ic(color, opacity)} fillOpacity="0.18" />
    <rect x="5" y="8" width="2" height="2" fill="currentColor" style={ic(color, opacity)} />
  </Px>;

/** Unlock */
export const IconUnlock = ({
  size = 16,
  color,
  opacity
}: IconProps) => <Px size={size} viewBox="0 0 12 12">
    <rect x="7" y="1" width="4" height="1" fill="currentColor" style={ic(color, opacity)} />
    <rect x="10" y="2" width="1" height="3" fill="currentColor" style={ic(color, opacity)} />
    <rect x="2" y="5" width="8" height="1" fill="currentColor" style={ic(color, opacity)} />
    <rect x="2" y="6" width="1" height="5" fill="currentColor" style={ic(color, opacity)} />
    <rect x="9" y="6" width="1" height="5" fill="currentColor" style={ic(color, opacity)} />
    <rect x="2" y="11" width="8" height="1" fill="currentColor" style={ic(color, opacity)} />
    <rect x="3" y="6" width="6" height="5" fill="currentColor" style={ic(color, opacity)} fillOpacity="0.18" />
    <rect x="5" y="8" width="2" height="2" fill="currentColor" style={ic(color, opacity)} />
  </Px>;

/** User / person */
export const IconUser = ({
  size = 16,
  color,
  opacity
}: IconProps) => <Px size={size} viewBox="0 0 12 12">
    <rect x="4" y="1" width="4" height="1" fill="currentColor" style={ic(color, opacity)} />
    <rect x="3" y="2" width="6" height="3" fill="currentColor" style={ic(color, opacity)} fillOpacity="0.6" />
    <rect x="3" y="2" width="1" height="3" fill="currentColor" style={ic(color, opacity)} />
    <rect x="8" y="2" width="1" height="3" fill="currentColor" style={ic(color, opacity)} />
    <rect x="4" y="5" width="4" height="1" fill="currentColor" style={ic(color, opacity)} />
    <rect x="2" y="7" width="8" height="1" fill="currentColor" style={ic(color, opacity)} />
    <rect x="1" y="8" width="10" height="3" fill="currentColor" style={ic(color, opacity)} fillOpacity="0.35" />
    <rect x="1" y="8" width="1" height="3" fill="currentColor" style={ic(color, opacity)} />
    <rect x="10" y="8" width="1" height="3" fill="currentColor" style={ic(color, opacity)} />
    <rect x="1" y="11" width="10" height="1" fill="currentColor" style={ic(color, opacity)} />
  </Px>;

/** Eye / visible */
export const IconEye = ({
  size = 16,
  color,
  opacity
}: IconProps) => <Px size={size} viewBox="0 0 12 12">
    <rect x="1" y="5" width="2" height="2" fill="currentColor" style={ic(color, opacity)} />
    <rect x="3" y="3" width="2" height="2" fill="currentColor" style={ic(color, opacity)} />
    <rect x="9" y="3" width="2" height="2" fill="currentColor" style={ic(color, opacity)} />
    <rect x="5" y="2" width="2" height="1" fill="currentColor" style={ic(color, opacity)} />
    <rect x="3" y="7" width="2" height="2" fill="currentColor" style={ic(color, opacity)} />
    <rect x="9" y="7" width="2" height="2" fill="currentColor" style={ic(color, opacity)} />
    <rect x="5" y="9" width="2" height="1" fill="currentColor" style={ic(color, opacity)} />
    <rect x="7" y="2" width="2" height="1" fill="currentColor" style={ic(color, opacity)} />
    <rect x="7" y="9" width="2" height="1" fill="currentColor" style={ic(color, opacity)} />
    <rect x="9" y="5" width="2" height="2" fill="currentColor" style={ic(color, opacity)} />
    <rect x="5" y="4" width="2" height="4" fill="currentColor" style={ic(color, opacity)} />
    <rect x="4" y="5" width="4" height="2" fill="currentColor" style={ic(color, opacity)} />
  </Px>;

/** Eye off / hidden */
export const IconEyeOff = ({
  size = 16,
  color,
  opacity
}: IconProps) => <Px size={size} viewBox="0 0 12 12">
    <rect x="1" y="1" width="2" height="2" fill="currentColor" style={ic(color, opacity)} />
    <rect x="3" y="3" width="2" height="2" fill="currentColor" style={ic(color, opacity)} />
    <rect x="5" y="5" width="2" height="2" fill="currentColor" style={ic(color, opacity)} />
    <rect x="7" y="7" width="2" height="2" fill="currentColor" style={ic(color, opacity)} />
    <rect x="9" y="9" width="2" height="2" fill="currentColor" style={ic(color, opacity)} />
    <rect x="1" y="5" width="2" height="2" fill="currentColor" style={ic(color, opacity)} fillOpacity="0.4" />
    <rect x="9" y="5" width="2" height="2" fill="currentColor" style={ic(color, opacity)} fillOpacity="0.4" />
    <rect x="3" y="7" width="2" height="2" fill="currentColor" style={ic(color, opacity)} fillOpacity="0.4" />
    <rect x="7" y="3" width="2" height="2" fill="currentColor" style={ic(color, opacity)} fillOpacity="0.4" />
  </Px>;

/** Key */
export const IconKey = ({
  size = 16,
  color,
  opacity
}: IconProps) => <Px size={size} viewBox="0 0 12 12">
    <rect x="1" y="3" width="6" height="1" fill="currentColor" style={ic(color, opacity)} />
    <rect x="1" y="4" width="1" height="4" fill="currentColor" style={ic(color, opacity)} />
    <rect x="6" y="4" width="1" height="4" fill="currentColor" style={ic(color, opacity)} />
    <rect x="2" y="4" width="4" height="4" fill="currentColor" style={ic(color, opacity)} fillOpacity="0.2" />
    <rect x="1" y="8" width="6" height="1" fill="currentColor" style={ic(color, opacity)} />
    <rect x="7" y="5" width="4" height="1" fill="currentColor" style={ic(color, opacity)} />
    <rect x="9" y="6" width="2" height="2" fill="currentColor" style={ic(color, opacity)} fillOpacity="0.5" />
    <rect x="3" y="5" width="2" height="2" fill="currentColor" style={ic(color, opacity)} />
  </Px>;

/** Users / team */
export const IconUsers = ({
  size = 16,
  color,
  opacity
}: IconProps) => <Px size={size} viewBox="0 0 12 12">
    <rect x="1" y="1" width="4" height="1" fill="currentColor" style={ic(color, opacity)} />
    <rect x="1" y="2" width="1" height="3" fill="currentColor" style={ic(color, opacity)} />
    <rect x="4" y="2" width="1" height="3" fill="currentColor" style={ic(color, opacity)} />
    <rect x="1" y="5" width="4" height="1" fill="currentColor" style={ic(color, opacity)} />
    <rect x="1" y="7" width="5" height="1" fill="currentColor" style={ic(color, opacity)} />
    <rect x="1" y="8" width="1" height="3" fill="currentColor" style={ic(color, opacity)} />
    <rect x="5" y="8" width="1" height="3" fill="currentColor" style={ic(color, opacity)} />
    <rect x="1" y="11" width="5" height="1" fill="currentColor" style={ic(color, opacity)} />
    <rect x="7" y="2" width="4" height="1" fill="currentColor" style={ic(color, opacity)} />
    <rect x="7" y="3" width="1" height="3" fill="currentColor" style={ic(color, opacity)} />
    <rect x="10" y="3" width="1" height="3" fill="currentColor" style={ic(color, opacity)} />
    <rect x="7" y="6" width="4" height="1" fill="currentColor" style={ic(color, opacity)} />
    <rect x="6" y="8" width="6" height="1" fill="currentColor" style={ic(color, opacity)} fillOpacity="0.6" />
    <rect x="6" y="9" width="1" height="2" fill="currentColor" style={ic(color, opacity)} fillOpacity="0.6" />
    <rect x="11" y="9" width="1" height="2" fill="currentColor" style={ic(color, opacity)} fillOpacity="0.6" />
  </Px>;

/** Shield / protection */
export const IconShield = ({
  size = 16,
  color,
  opacity
}: IconProps) => <Px size={size} viewBox="0 0 12 12">
    <rect x="2" y="1" width="8" height="1" fill="currentColor" style={ic(color, opacity)} />
    <rect x="1" y="2" width="1" height="5" fill="currentColor" style={ic(color, opacity)} />
    <rect x="10" y="2" width="1" height="5" fill="currentColor" style={ic(color, opacity)} />
    <rect x="2" y="7" width="1" height="2" fill="currentColor" style={ic(color, opacity)} />
    <rect x="9" y="7" width="1" height="2" fill="currentColor" style={ic(color, opacity)} />
    <rect x="3" y="9" width="1" height="1" fill="currentColor" style={ic(color, opacity)} />
    <rect x="8" y="9" width="1" height="1" fill="currentColor" style={ic(color, opacity)} />
    <rect x="4" y="10" width="1" height="1" fill="currentColor" style={ic(color, opacity)} />
    <rect x="7" y="10" width="1" height="1" fill="currentColor" style={ic(color, opacity)} />
    <rect x="5" y="11" width="2" height="1" fill="currentColor" style={ic(color, opacity)} />
    <rect x="2" y="2" width="8" height="6" fill="currentColor" style={ic(color, opacity)} fillOpacity="0.15" />
    <rect x="4" y="4" width="2" height="2" fill="currentColor" style={ic(color, opacity)} />
    <rect x="6" y="6" width="2" height="2" fill="currentColor" style={ic(color, opacity)} />
  </Px>;

/** Terminal / console */
export const IconTerminal = ({
  size = 16,
  color,
  opacity
}: IconProps) => <Px size={size} viewBox="0 0 12 12">
    <rect x="1" y="1" width="10" height="1" fill="currentColor" style={ic(color, opacity)} />
    <rect x="1" y="2" width="1" height="9" fill="currentColor" style={ic(color, opacity)} />
    <rect x="10" y="2" width="1" height="9" fill="currentColor" style={ic(color, opacity)} />
    <rect x="1" y="11" width="10" height="1" fill="currentColor" style={ic(color, opacity)} />
    <rect x="2" y="2" width="8" height="9" fill="currentColor" style={ic(color, opacity)} fillOpacity="0.1" />
    <rect x="2" y="4" width="2" height="2" fill="currentColor" style={ic(color, opacity)} />
    <rect x="4" y="6" width="2" height="2" fill="currentColor" style={ic(color, opacity)} />
    <rect x="6" y="7" width="4" height="1" fill="currentColor" style={ic(color, opacity)} fillOpacity="0.5" />
  </Px>;

/** Cloud */
export const IconCloud = ({
  size = 16,
  color,
  opacity
}: IconProps) => <Px size={size} viewBox="0 0 12 12">
    <rect x="3" y="3" width="6" height="1" fill="currentColor" style={ic(color, opacity)} />
    <rect x="2" y="4" width="1" height="1" fill="currentColor" style={ic(color, opacity)} />
    <rect x="9" y="4" width="1" height="1" fill="currentColor" style={ic(color, opacity)} />
    <rect x="1" y="5" width="1" height="3" fill="currentColor" style={ic(color, opacity)} />
    <rect x="10" y="5" width="1" height="3" fill="currentColor" style={ic(color, opacity)} />
    <rect x="2" y="8" width="1" height="1" fill="currentColor" style={ic(color, opacity)} />
    <rect x="9" y="8" width="1" height="1" fill="currentColor" style={ic(color, opacity)} />
    <rect x="3" y="9" width="6" height="1" fill="currentColor" style={ic(color, opacity)} />
    <rect x="2" y="5" width="8" height="3" fill="currentColor" style={ic(color, opacity)} fillOpacity="0.2" />
    <rect x="4" y="2" width="4" height="1" fill="currentColor" style={ic(color, opacity)} />
    <rect x="3" y="3" width="1" height="1" fill="currentColor" style={ic(color, opacity)} />
  </Px>;

/** CPU / processor */
export const IconCpu = ({
  size = 16,
  color,
  opacity
}: IconProps) => <Px size={size} viewBox="0 0 12 12">
    <rect x="3" y="3" width="6" height="6" fill="currentColor" style={ic(color, opacity)} fillOpacity="0.2" />
    <rect x="3" y="3" width="6" height="1" fill="currentColor" style={ic(color, opacity)} />
    <rect x="3" y="8" width="6" height="1" fill="currentColor" style={ic(color, opacity)} />
    <rect x="3" y="3" width="1" height="6" fill="currentColor" style={ic(color, opacity)} />
    <rect x="8" y="3" width="1" height="6" fill="currentColor" style={ic(color, opacity)} />
    <rect x="5" y="5" width="2" height="2" fill="currentColor" style={ic(color, opacity)} />
    <rect x="1" y="4" width="2" height="1" fill="currentColor" style={ic(color, opacity)} />
    <rect x="1" y="7" width="2" height="1" fill="currentColor" style={ic(color, opacity)} />
    <rect x="9" y="4" width="2" height="1" fill="currentColor" style={ic(color, opacity)} />
    <rect x="9" y="7" width="2" height="1" fill="currentColor" style={ic(color, opacity)} />
    <rect x="4" y="1" width="1" height="2" fill="currentColor" style={ic(color, opacity)} />
    <rect x="7" y="1" width="1" height="2" fill="currentColor" style={ic(color, opacity)} />
    <rect x="4" y="9" width="1" height="2" fill="currentColor" style={ic(color, opacity)} />
    <rect x="7" y="9" width="1" height="2" fill="currentColor" style={ic(color, opacity)} />
  </Px>;

// ════════════════════════════════════════════════════════════════════════════════
// MEDIA & CONTENT
// ════════════════════════════════════════════════════════════════════════════════

/** Play */
export const IconPlay = ({
  size = 16,
  color,
  opacity
}: IconProps) => <Px size={size} viewBox="0 0 12 12">
    <rect x="3" y="2" width="2" height="2" fill="currentColor" style={ic(color, opacity)} />
    <rect x="5" y="4" width="2" height="2" fill="currentColor" style={ic(color, opacity)} />
    <rect x="7" y="5" width="2" height="2" fill="currentColor" style={ic(color, opacity)} />
    <rect x="5" y="7" width="2" height="2" fill="currentColor" style={ic(color, opacity)} />
    <rect x="3" y="9" width="2" height="2" fill="currentColor" style={ic(color, opacity)} />
  </Px>;

/** Pause */
export const IconPause = ({
  size = 16,
  color,
  opacity
}: IconProps) => <Px size={size} viewBox="0 0 12 12">
    <rect x="2" y="2" width="3" height="8" fill="currentColor" style={ic(color, opacity)} />
    <rect x="7" y="2" width="3" height="8" fill="currentColor" style={ic(color, opacity)} />
  </Px>;

/** Stop */
export const IconStop = ({
  size = 16,
  color,
  opacity
}: IconProps) => <Px size={size} viewBox="0 0 12 12">
    <rect x="2" y="2" width="8" height="8" fill="currentColor" style={ic(color, opacity)} fillOpacity="0.5" />
    <rect x="2" y="2" width="8" height="1" fill="currentColor" style={ic(color, opacity)} />
    <rect x="2" y="9" width="8" height="1" fill="currentColor" style={ic(color, opacity)} />
    <rect x="2" y="2" width="1" height="8" fill="currentColor" style={ic(color, opacity)} />
    <rect x="9" y="2" width="1" height="8" fill="currentColor" style={ic(color, opacity)} />
  </Px>;

/** Skip forward */
export const IconSkipForward = ({
  size = 16,
  color,
  opacity
}: IconProps) => <Px size={size} viewBox="0 0 12 12">
    <rect x="1" y="2" width="2" height="2" fill="currentColor" style={ic(color, opacity)} />
    <rect x="3" y="4" width="2" height="2" fill="currentColor" style={ic(color, opacity)} />
    <rect x="5" y="5" width="2" height="2" fill="currentColor" style={ic(color, opacity)} />
    <rect x="3" y="7" width="2" height="2" fill="currentColor" style={ic(color, opacity)} />
    <rect x="1" y="9" width="2" height="2" fill="currentColor" style={ic(color, opacity)} />
    <rect x="9" y="2" width="2" height="8" fill="currentColor" style={ic(color, opacity)} />
  </Px>;

/** Image / photo */
export const IconImage = ({
  size = 16,
  color,
  opacity
}: IconProps) => <Px size={size} viewBox="0 0 12 12">
    <rect x="1" y="1" width="10" height="1" fill="currentColor" style={ic(color, opacity)} />
    <rect x="1" y="10" width="10" height="1" fill="currentColor" style={ic(color, opacity)} />
    <rect x="1" y="2" width="1" height="8" fill="currentColor" style={ic(color, opacity)} />
    <rect x="10" y="2" width="1" height="8" fill="currentColor" style={ic(color, opacity)} />
    <rect x="3" y="3" width="2" height="2" fill="currentColor" style={ic(color, opacity)} />
    <rect x="2" y="7" width="3" height="3" fill="currentColor" style={ic(color, opacity)} fillOpacity="0.5" />
    <rect x="5" y="6" width="3" height="4" fill="currentColor" style={ic(color, opacity)} fillOpacity="0.5" />
    <rect x="8" y="4" width="3" height="6" fill="currentColor" style={ic(color, opacity)} fillOpacity="0.5" />
  </Px>;

/** Link / chain */
export const IconLink = ({
  size = 16,
  color,
  opacity
}: IconProps) => <Px size={size} viewBox="0 0 12 12">
    <rect x="1" y="5" width="4" height="2" fill="currentColor" style={ic(color, opacity)} fillOpacity="0.5" />
    <rect x="1" y="4" width="4" height="1" fill="currentColor" style={ic(color, opacity)} />
    <rect x="1" y="7" width="4" height="1" fill="currentColor" style={ic(color, opacity)} />
    <rect x="1" y="5" width="1" height="2" fill="currentColor" style={ic(color, opacity)} />
    <rect x="7" y="5" width="4" height="2" fill="currentColor" style={ic(color, opacity)} fillOpacity="0.5" />
    <rect x="7" y="4" width="4" height="1" fill="currentColor" style={ic(color, opacity)} />
    <rect x="7" y="7" width="4" height="1" fill="currentColor" style={ic(color, opacity)} />
    <rect x="10" y="5" width="1" height="2" fill="currentColor" style={ic(color, opacity)} />
    <rect x="5" y="5" width="2" height="2" fill="currentColor" style={ic(color, opacity)} />
  </Px>;

/** Star / favourite */
export const IconStar = ({
  size = 16,
  color,
  opacity
}: IconProps) => <Px size={size} viewBox="0 0 12 12">
    <rect x="5" y="1" width="2" height="2" fill="currentColor" style={ic(color, opacity)} />
    <rect x="1" y="4" width="10" height="2" fill="currentColor" style={ic(color, opacity)} />
    <rect x="5" y="6" width="2" height="4" fill="currentColor" style={ic(color, opacity)} />
    <rect x="2" y="4" width="2" height="2" fill="currentColor" style={ic(color, opacity)} />
    <rect x="8" y="4" width="2" height="2" fill="currentColor" style={ic(color, opacity)} />
    <rect x="3" y="6" width="2" height="2" fill="currentColor" style={ic(color, opacity)} />
    <rect x="7" y="6" width="2" height="2" fill="currentColor" style={ic(color, opacity)} />
    <rect x="2" y="8" width="2" height="2" fill="currentColor" style={ic(color, opacity)} />
    <rect x="8" y="8" width="2" height="2" fill="currentColor" style={ic(color, opacity)} />
  </Px>;

/** Video / film */
export const IconVideo = ({
  size = 16,
  color,
  opacity
}: IconProps) => <Px size={size} viewBox="0 0 12 12">
    <rect x="1" y="3" width="7" height="6" fill="currentColor" style={ic(color, opacity)} fillOpacity="0.2" />
    <rect x="1" y="3" width="7" height="1" fill="currentColor" style={ic(color, opacity)} />
    <rect x="1" y="8" width="7" height="1" fill="currentColor" style={ic(color, opacity)} />
    <rect x="1" y="3" width="1" height="6" fill="currentColor" style={ic(color, opacity)} />
    <rect x="7" y="3" width="1" height="6" fill="currentColor" style={ic(color, opacity)} />
    <rect x="8" y="4" width="2" height="2" fill="currentColor" style={ic(color, opacity)} />
    <rect x="10" y="5" width="1" height="2" fill="currentColor" style={ic(color, opacity)} />
    <rect x="8" y="7" width="2" height="2" fill="currentColor" style={ic(color, opacity)} />
  </Px>;

/** Mic / microphone */
export const IconMic = ({
  size = 16,
  color,
  opacity
}: IconProps) => <Px size={size} viewBox="0 0 12 12">
    <rect x="4" y="1" width="4" height="1" fill="currentColor" style={ic(color, opacity)} />
    <rect x="3" y="2" width="1" height="5" fill="currentColor" style={ic(color, opacity)} />
    <rect x="8" y="2" width="1" height="5" fill="currentColor" style={ic(color, opacity)} />
    <rect x="4" y="7" width="4" height="1" fill="currentColor" style={ic(color, opacity)} />
    <rect x="4" y="2" width="4" height="5" fill="currentColor" style={ic(color, opacity)} fillOpacity="0.3" />
    <rect x="2" y="5" width="1" height="3" fill="currentColor" style={ic(color, opacity)} />
    <rect x="9" y="5" width="1" height="3" fill="currentColor" style={ic(color, opacity)} />
    <rect x="3" y="8" width="6" height="1" fill="currentColor" style={ic(color, opacity)} />
    <rect x="5" y="9" width="2" height="2" fill="currentColor" style={ic(color, opacity)} />
    <rect x="4" y="11" width="4" height="1" fill="currentColor" style={ic(color, opacity)} />
  </Px>;

// ════════════════════════════════════════════════════════════════════════════════
// LAYOUT & INTERFACE
// ════════════════════════════════════════════════════════════════════════════════

/** Grid / app launcher */
export const IconGrid = ({
  size = 16,
  color,
  opacity
}: IconProps) => <Px size={size} viewBox="0 0 12 12">
    <rect x="1" y="1" width="4" height="4" fill="currentColor" style={ic(color, opacity)} fillOpacity="0.6" />
    <rect x="7" y="1" width="4" height="4" fill="currentColor" style={ic(color, opacity)} fillOpacity="0.6" />
    <rect x="1" y="7" width="4" height="4" fill="currentColor" style={ic(color, opacity)} fillOpacity="0.6" />
    <rect x="7" y="7" width="4" height="4" fill="currentColor" style={ic(color, opacity)} fillOpacity="0.6" />
    <rect x="2" y="2" width="2" height="2" fill="currentColor" style={ic(color, opacity)} />
    <rect x="8" y="2" width="2" height="2" fill="currentColor" style={ic(color, opacity)} />
    <rect x="2" y="8" width="2" height="2" fill="currentColor" style={ic(color, opacity)} />
    <rect x="8" y="8" width="2" height="2" fill="currentColor" style={ic(color, opacity)} />
  </Px>;

/** List / lines */
export const IconList = ({
  size = 16,
  color,
  opacity
}: IconProps) => <Px size={size} viewBox="0 0 12 12">
    <rect x="1" y="2" width="2" height="2" fill="currentColor" style={ic(color, opacity)} />
    <rect x="4" y="3" width="7" height="1" fill="currentColor" style={ic(color, opacity)} />
    <rect x="1" y="5" width="2" height="2" fill="currentColor" style={ic(color, opacity)} />
    <rect x="4" y="6" width="7" height="1" fill="currentColor" style={ic(color, opacity)} />
    <rect x="1" y="8" width="2" height="2" fill="currentColor" style={ic(color, opacity)} />
    <rect x="4" y="9" width="7" height="1" fill="currentColor" style={ic(color, opacity)} />
  </Px>;

/** Sidebar / panel */
export const IconSidebar = ({
  size = 16,
  color,
  opacity
}: IconProps) => <Px size={size} viewBox="0 0 12 12">
    <rect x="1" y="1" width="10" height="10" fill="currentColor" style={ic(color, opacity)} fillOpacity="0.1" />
    <rect x="1" y="1" width="10" height="1" fill="currentColor" style={ic(color, opacity)} />
    <rect x="1" y="10" width="10" height="1" fill="currentColor" style={ic(color, opacity)} />
    <rect x="1" y="1" width="1" height="10" fill="currentColor" style={ic(color, opacity)} />
    <rect x="10" y="1" width="1" height="10" fill="currentColor" style={ic(color, opacity)} />
    <rect x="4" y="2" width="1" height="8" fill="currentColor" style={ic(color, opacity)} fillOpacity="0.5" />
    <rect x="2" y="3" width="2" height="1" fill="currentColor" style={ic(color, opacity)} fillOpacity="0.6" />
    <rect x="2" y="5" width="2" height="1" fill="currentColor" style={ic(color, opacity)} fillOpacity="0.4" />
    <rect x="2" y="7" width="2" height="1" fill="currentColor" style={ic(color, opacity)} fillOpacity="0.4" />
  </Px>;

/** Columns / split view */
export const IconColumns = ({
  size = 16,
  color,
  opacity
}: IconProps) => <Px size={size} viewBox="0 0 12 12">
    <rect x="1" y="1" width="4" height="10" fill="currentColor" style={ic(color, opacity)} fillOpacity="0.25" />
    <rect x="1" y="1" width="4" height="1" fill="currentColor" style={ic(color, opacity)} />
    <rect x="1" y="10" width="4" height="1" fill="currentColor" style={ic(color, opacity)} fillOpacity="0.25" />
    <rect x="1" y="1" width="1" height="10" fill="currentColor" style={ic(color, opacity)} />
    <rect x="4" y="1" width="1" height="10" fill="currentColor" style={ic(color, opacity)} />
    <rect x="7" y="1" width="4" height="10" fill="currentColor" style={ic(color, opacity)} fillOpacity="0.25" />
    <rect x="7" y="1" width="4" height="1" fill="currentColor" style={ic(color, opacity)} />
    <rect x="7" y="10" width="4" height="1" fill="currentColor" style={ic(color, opacity)} />
    <rect x="7" y="1" width="1" height="10" fill="currentColor" style={ic(color, opacity)} />
    <rect x="10" y="1" width="1" height="10" fill="currentColor" style={ic(color, opacity)} />
  </Px>;

/** Dashboard / overview */
export const IconDashboard = ({
  size = 16,
  color,
  opacity
}: IconProps) => <Px size={size} viewBox="0 0 12 12">
    <rect x="1" y="1" width="4" height="5" fill="currentColor" style={ic(color, opacity)} fillOpacity="0.35" />
    <rect x="1" y="1" width="4" height="1" fill="currentColor" style={ic(color, opacity)} />
    <rect x="1" y="5" width="4" height="1" fill="currentColor" style={ic(color, opacity)} />
    <rect x="1" y="1" width="1" height="5" fill="currentColor" style={ic(color, opacity)} />
    <rect x="4" y="1" width="1" height="5" fill="currentColor" style={ic(color, opacity)} />
    <rect x="7" y="1" width="4" height="5" fill="currentColor" style={ic(color, opacity)} fillOpacity="0.35" />
    <rect x="7" y="1" width="4" height="1" fill="currentColor" style={ic(color, opacity)} />
    <rect x="7" y="5" width="4" height="1" fill="currentColor" style={ic(color, opacity)} />
    <rect x="7" y="1" width="1" height="5" fill="currentColor" style={ic(color, opacity)} />
    <rect x="10" y="1" width="1" height="5" fill="currentColor" style={ic(color, opacity)} />
    <rect x="1" y="7" width="10" height="4" fill="currentColor" style={ic(color, opacity)} fillOpacity="0.2" />
    <rect x="1" y="7" width="10" height="1" fill="currentColor" style={ic(color, opacity)} />
    <rect x="1" y="10" width="10" height="1" fill="currentColor" style={ic(color, opacity)} />
    <rect x="1" y="7" width="1" height="4" fill="currentColor" style={ic(color, opacity)} />
    <rect x="10" y="7" width="1" height="4" fill="currentColor" style={ic(color, opacity)} />
  </Px>;

/** Notification dot / badge */
export const IconBadge = ({
  size = 16,
  color,
  opacity
}: IconProps) => <Px size={size} viewBox="0 0 12 12">
    <rect x="4" y="1" width="4" height="1" fill="currentColor" style={ic(color, opacity)} />
    <rect x="2" y="2" width="8" height="8" fill="currentColor" style={ic(color, opacity)} fillOpacity="0.15" />
    <rect x="2" y="2" width="2" height="1" fill="currentColor" style={ic(color, opacity)} />
    <rect x="8" y="2" width="2" height="1" fill="currentColor" style={ic(color, opacity)} />
    <rect x="1" y="3" width="1" height="6" fill="currentColor" style={ic(color, opacity)} />
    <rect x="10" y="3" width="1" height="6" fill="currentColor" style={ic(color, opacity)} />
    <rect x="2" y="9" width="2" height="1" fill="currentColor" style={ic(color, opacity)} />
    <rect x="8" y="9" width="2" height="1" fill="currentColor" style={ic(color, opacity)} />
    <rect x="4" y="10" width="4" height="1" fill="currentColor" style={ic(color, opacity)} />
    <rect x="5" y="4" width="2" height="1" fill="currentColor" style={ic(color, opacity)} />
    <rect x="5" y="6" width="2" height="3" fill="currentColor" style={ic(color, opacity)} />
  </Px>;

// ════════════════════════════════════════════════════════════════════════════════
// FINANCE & BUSINESS
// ════════════════════════════════════════════════════════════════════════════════

/** Currency / coin */
export const IconCurrency = ({
  size = 16,
  color,
  opacity
}: IconProps) => <Px size={size} viewBox="0 0 12 12">
    <rect x="3" y="1" width="6" height="1" fill="currentColor" style={ic(color, opacity)} />
    <rect x="1" y="3" width="1" height="6" fill="currentColor" style={ic(color, opacity)} />
    <rect x="10" y="3" width="1" height="6" fill="currentColor" style={ic(color, opacity)} />
    <rect x="3" y="10" width="6" height="1" fill="currentColor" style={ic(color, opacity)} />
    <rect x="2" y="2" width="1" height="1" fill="currentColor" style={ic(color, opacity)} />
    <rect x="9" y="2" width="1" height="1" fill="currentColor" style={ic(color, opacity)} />
    <rect x="2" y="9" width="1" height="1" fill="currentColor" style={ic(color, opacity)} />
    <rect x="9" y="9" width="1" height="1" fill="currentColor" style={ic(color, opacity)} />
    <rect x="5" y="3" width="2" height="1" fill="currentColor" style={ic(color, opacity)} />
    <rect x="4" y="4" width="4" height="1" fill="currentColor" style={ic(color, opacity)} />
    <rect x="4" y="5" width="2" height="2" fill="currentColor" style={ic(color, opacity)} />
    <rect x="4" y="7" width="4" height="1" fill="currentColor" style={ic(color, opacity)} />
    <rect x="5" y="8" width="2" height="1" fill="currentColor" style={ic(color, opacity)} />
  </Px>;

/** Wallet */
export const IconWallet = ({
  size = 16,
  color,
  opacity
}: IconProps) => <Px size={size} viewBox="0 0 12 12">
    <rect x="1" y="3" width="9" height="1" fill="currentColor" style={ic(color, opacity)} />
    <rect x="1" y="4" width="1" height="7" fill="currentColor" style={ic(color, opacity)} />
    <rect x="10" y="4" width="1" height="7" fill="currentColor" style={ic(color, opacity)} />
    <rect x="1" y="11" width="10" height="1" fill="currentColor" style={ic(color, opacity)} />
    <rect x="2" y="3" width="8" height="7" fill="currentColor" style={ic(color, opacity)} fillOpacity="0.15" />
    <rect x="7" y="6" width="3" height="3" fill="currentColor" style={ic(color, opacity)} />
    <rect x="8" y="7" width="1" height="1" fill="currentColor" style={ic(color, opacity)} fillOpacity="0" />
    <rect x="3" y="2" width="6" height="1" fill="currentColor" style={ic(color, opacity)} fillOpacity="0.5" />
  </Px>;

/** Receipt */
export const IconReceipt = ({
  size = 16,
  color,
  opacity
}: IconProps) => <Px size={size} viewBox="0 0 12 12">
    <rect x="2" y="1" width="8" height="1" fill="currentColor" style={ic(color, opacity)} />
    <rect x="2" y="2" width="1" height="9" fill="currentColor" style={ic(color, opacity)} />
    <rect x="10" y="2" width="1" height="9" fill="currentColor" style={ic(color, opacity)} />
    <rect x="3" y="2" width="6" height="9" fill="currentColor" style={ic(color, opacity)} fillOpacity="0.1" />
    <rect x="2" y="11" width="1" height="1" fill="currentColor" style={ic(color, opacity)} />
    <rect x="10" y="11" width="1" height="1" fill="currentColor" style={ic(color, opacity)} />
    <rect x="3" y="4" width="6" height="1" fill="currentColor" style={ic(color, opacity)} fillOpacity="0.5" />
    <rect x="3" y="6" width="6" height="1" fill="currentColor" style={ic(color, opacity)} fillOpacity="0.5" />
    <rect x="3" y="8" width="4" height="1" fill="currentColor" style={ic(color, opacity)} fillOpacity="0.5" />
    <rect x="7" y="8" width="2" height="1" fill="currentColor" style={ic(color, opacity)} />
  </Px>;

/** Trending up */
export const IconTrendingUp = ({
  size = 16,
  color,
  opacity
}: IconProps) => <Px size={size} viewBox="0 0 12 12">
    <rect x="1" y="9" width="2" height="2" fill="currentColor" style={ic(color, opacity)} />
    <rect x="3" y="7" width="2" height="2" fill="currentColor" style={ic(color, opacity)} />
    <rect x="5" y="5" width="2" height="2" fill="currentColor" style={ic(color, opacity)} />
    <rect x="7" y="3" width="2" height="2" fill="currentColor" style={ic(color, opacity)} />
    <rect x="9" y="3" width="2" height="1" fill="currentColor" style={ic(color, opacity)} />
    <rect x="9" y="1" width="2" height="2" fill="currentColor" style={ic(color, opacity)} />
    <rect x="7" y="3" width="4" height="1" fill="currentColor" style={ic(color, opacity)} />
  </Px>;

/** Trending down */
export const IconTrendingDown = ({
  size = 16,
  color,
  opacity
}: IconProps) => <Px size={size} viewBox="0 0 12 12">
    <rect x="1" y="2" width="2" height="2" fill="currentColor" style={ic(color, opacity)} />
    <rect x="3" y="4" width="2" height="2" fill="currentColor" style={ic(color, opacity)} />
    <rect x="5" y="6" width="2" height="2" fill="currentColor" style={ic(color, opacity)} />
    <rect x="7" y="8" width="2" height="2" fill="currentColor" style={ic(color, opacity)} />
    <rect x="9" y="8" width="2" height="1" fill="currentColor" style={ic(color, opacity)} />
    <rect x="9" y="9" width="2" height="2" fill="currentColor" style={ic(color, opacity)} />
    <rect x="7" y="9" width="4" height="1" fill="currentColor" style={ic(color, opacity)} />
  </Px>;

/** Target / goal */
export const IconTarget = ({
  size = 16,
  color,
  opacity
}: IconProps) => <Px size={size} viewBox="0 0 12 12">
    <rect x="4" y="1" width="4" height="1" fill="currentColor" style={ic(color, opacity)} fillOpacity="0.5" />
    <rect x="2" y="2" width="2" height="1" fill="currentColor" style={ic(color, opacity)} fillOpacity="0.5" />
    <rect x="8" y="2" width="2" height="1" fill="currentColor" style={ic(color, opacity)} fillOpacity="0.5" />
    <rect x="1" y="4" width="1" height="4" fill="currentColor" style={ic(color, opacity)} fillOpacity="0.5" />
    <rect x="10" y="4" width="1" height="4" fill="currentColor" style={ic(color, opacity)} fillOpacity="0.5" />
    <rect x="4" y="10" width="4" height="1" fill="currentColor" style={ic(color, opacity)} fillOpacity="0.5" />
    <rect x="4" y="3" width="4" height="1" fill="currentColor" style={ic(color, opacity)} />
    <rect x="3" y="4" width="6" height="1" fill="currentColor" style={ic(color, opacity)} />
    <rect x="3" y="7" width="6" height="1" fill="currentColor" style={ic(color, opacity)} />
    <rect x="4" y="8" width="4" height="1" fill="currentColor" style={ic(color, opacity)} />
    <rect x="2" y="5" width="1" height="2" fill="currentColor" style={ic(color, opacity)} />
    <rect x="9" y="5" width="1" height="2" fill="currentColor" style={ic(color, opacity)} />
    <rect x="5" y="5" width="2" height="2" fill="currentColor" style={ic(color, opacity)} />
  </Px>;

// ════════════════════════════════════════════════════════════════════════════════
// TIME & CALENDAR
// ════════════════════════════════════════════════════════════════════════════════

/** Clock */
export const IconClock = ({
  size = 16,
  color,
  opacity
}: IconProps) => <Px size={size} viewBox="0 0 12 12">
    <rect x="4" y="1" width="4" height="1" fill="currentColor" style={ic(color, opacity)} />
    <rect x="2" y="2" width="2" height="1" fill="currentColor" style={ic(color, opacity)} />
    <rect x="8" y="2" width="2" height="1" fill="currentColor" style={ic(color, opacity)} />
    <rect x="1" y="4" width="1" height="4" fill="currentColor" style={ic(color, opacity)} />
    <rect x="10" y="4" width="1" height="4" fill="currentColor" style={ic(color, opacity)} />
    <rect x="2" y="8" width="2" height="1" fill="currentColor" style={ic(color, opacity)} />
    <rect x="8" y="8" width="2" height="1" fill="currentColor" style={ic(color, opacity)} />
    <rect x="4" y="9" width="4" height="1" fill="currentColor" style={ic(color, opacity)} />
    <rect x="5" y="3" width="1" height="3" fill="currentColor" style={ic(color, opacity)} />
    <rect x="5" y="5" width="3" height="1" fill="currentColor" style={ic(color, opacity)} />
    <rect x="5" y="5" width="1" height="2" fill="currentColor" style={ic(color, opacity)} />
  </Px>;

/** Calendar */
export const IconCalendar = ({
  size = 16,
  color,
  opacity
}: IconProps) => <Px size={size} viewBox="0 0 12 12">
    <rect x="3" y="1" width="1" height="2" fill="currentColor" style={ic(color, opacity)} />
    <rect x="8" y="1" width="1" height="2" fill="currentColor" style={ic(color, opacity)} />
    <rect x="1" y="2" width="10" height="1" fill="currentColor" style={ic(color, opacity)} />
    <rect x="1" y="3" width="1" height="8" fill="currentColor" style={ic(color, opacity)} />
    <rect x="10" y="3" width="1" height="8" fill="currentColor" style={ic(color, opacity)} />
    <rect x="1" y="11" width="10" height="1" fill="currentColor" style={ic(color, opacity)} />
    <rect x="1" y="4" width="10" height="1" fill="currentColor" style={ic(color, opacity)} fillOpacity="0.5" />
    <rect x="3" y="6" width="2" height="2" fill="currentColor" style={ic(color, opacity)} fillOpacity="0.6" />
    <rect x="5" y="6" width="2" height="2" fill="currentColor" style={ic(color, opacity)} fillOpacity="0.4" />
    <rect x="7" y="6" width="2" height="2" fill="currentColor" style={ic(color, opacity)} fillOpacity="0.4" />
    <rect x="3" y="9" width="2" height="1" fill="currentColor" style={ic(color, opacity)} fillOpacity="0.4" />
    <rect x="5" y="9" width="2" height="1" fill="currentColor" style={ic(color, opacity)} fillOpacity="0.4" />
  </Px>;

/** Timer / stopwatch */
export const IconTimer = ({
  size = 16,
  color,
  opacity
}: IconProps) => <Px size={size} viewBox="0 0 12 12">
    <rect x="4" y="1" width="4" height="1" fill="currentColor" style={ic(color, opacity)} />
    <rect x="3" y="3" width="6" height="1" fill="currentColor" style={ic(color, opacity)} />
    <rect x="2" y="4" width="1" height="6" fill="currentColor" style={ic(color, opacity)} />
    <rect x="9" y="4" width="1" height="6" fill="currentColor" style={ic(color, opacity)} />
    <rect x="3" y="10" width="6" height="1" fill="currentColor" style={ic(color, opacity)} />
    <rect x="2" y="3" width="1" height="1" fill="currentColor" style={ic(color, opacity)} />
    <rect x="9" y="3" width="1" height="1" fill="currentColor" style={ic(color, opacity)} />
    <rect x="5" y="5" width="1" height="2" fill="currentColor" style={ic(color, opacity)} />
    <rect x="5" y="6" width="2" height="1" fill="currentColor" style={ic(color, opacity)} />
    <rect x="10" y="2" width="1" height="2" fill="currentColor" style={ic(color, opacity)} />
  </Px>;

/** History / recent */
export const IconHistory = ({
  size = 16,
  color,
  opacity
}: IconProps) => <Px size={size} viewBox="0 0 12 12">
    <rect x="1" y="5" width="2" height="2" fill="currentColor" style={ic(color, opacity)} />
    <rect x="3" y="3" width="2" height="2" fill="currentColor" style={ic(color, opacity)} />
    <rect x="3" y="7" width="2" height="2" fill="currentColor" style={ic(color, opacity)} />
    <rect x="5" y="2" width="2" height="1" fill="currentColor" style={ic(color, opacity)} />
    <rect x="5" y="9" width="2" height="1" fill="currentColor" style={ic(color, opacity)} />
    <rect x="7" y="2" width="2" height="1" fill="currentColor" style={ic(color, opacity)} />
    <rect x="9" y="3" width="1" height="2" fill="currentColor" style={ic(color, opacity)} />
    <rect x="9" y="7" width="1" height="2" fill="currentColor" style={ic(color, opacity)} />
    <rect x="7" y="9" width="2" height="1" fill="currentColor" style={ic(color, opacity)} />
    <rect x="5" y="5" width="1" height="3" fill="currentColor" style={ic(color, opacity)} />
    <rect x="5" y="7" width="3" height="1" fill="currentColor" style={ic(color, opacity)} />
  </Px>;

// ════════════════════════════════════════════════════════════════════════════════
// FORMS & INPUT
// ════════════════════════════════════════════════════════════════════════════════

/** Text / type */
export const IconText = ({
  size = 16,
  color,
  opacity
}: IconProps) => <Px size={size} viewBox="0 0 12 12">
    <rect x="1" y="2" width="10" height="1" fill="currentColor" style={ic(color, opacity)} />
    <rect x="5" y="3" width="2" height="7" fill="currentColor" style={ic(color, opacity)} />
    <rect x="3" y="9" width="6" height="1" fill="currentColor" style={ic(color, opacity)} />
    <rect x="1" y="2" width="1" height="3" fill="currentColor" style={ic(color, opacity)} />
    <rect x="10" y="2" width="1" height="3" fill="currentColor" style={ic(color, opacity)} />
  </Px>;

/** Toggle / switch */
export const IconToggle = ({
  size = 16,
  color,
  opacity
}: IconProps) => <Px size={size} viewBox="0 0 12 12">
    <rect x="1" y="4" width="10" height="4" fill="currentColor" style={ic(color, opacity)} fillOpacity="0.2" />
    <rect x="1" y="4" width="10" height="1" fill="currentColor" style={ic(color, opacity)} />
    <rect x="1" y="7" width="10" height="1" fill="currentColor" style={ic(color, opacity)} />
    <rect x="1" y="4" width="1" height="4" fill="currentColor" style={ic(color, opacity)} />
    <rect x="10" y="4" width="1" height="4" fill="currentColor" style={ic(color, opacity)} />
    <rect x="7" y="4" width="4" height="4" fill="currentColor" style={ic(color, opacity)} />
  </Px>;

/** Checkbox / tick box */
export const IconCheckbox = ({
  size = 16,
  color,
  opacity
}: IconProps) => <Px size={size} viewBox="0 0 12 12">
    <rect x="1" y="1" width="10" height="1" fill="currentColor" style={ic(color, opacity)} />
    <rect x="1" y="10" width="10" height="1" fill="currentColor" style={ic(color, opacity)} />
    <rect x="1" y="2" width="1" height="8" fill="currentColor" style={ic(color, opacity)} />
    <rect x="10" y="2" width="1" height="8" fill="currentColor" style={ic(color, opacity)} />
    <rect x="2" y="6" width="2" height="2" fill="currentColor" style={ic(color, opacity)} />
    <rect x="4" y="8" width="2" height="2" fill="currentColor" style={ic(color, opacity)} />
    <rect x="6" y="4" width="2" height="2" fill="currentColor" style={ic(color, opacity)} />
    <rect x="8" y="2" width="2" height="2" fill="currentColor" style={ic(color, opacity)} />
  </Px>;

/** Slider / range */
export const IconSlider = ({
  size = 16,
  color,
  opacity
}: IconProps) => <Px size={size} viewBox="0 0 12 12">
    <rect x="1" y="3" width="10" height="1" fill="currentColor" style={ic(color, opacity)} fillOpacity="0.4" />
    <rect x="3" y="2" width="2" height="3" fill="currentColor" style={ic(color, opacity)} />
    <rect x="1" y="8" width="10" height="1" fill="currentColor" style={ic(color, opacity)} fillOpacity="0.4" />
    <rect x="7" y="7" width="2" height="3" fill="currentColor" style={ic(color, opacity)} />
  </Px>;

/** Radio / option */
export const IconRadio = ({
  size = 16,
  color,
  opacity
}: IconProps) => <Px size={size} viewBox="0 0 12 12">
    <rect x="3" y="1" width="6" height="1" fill="currentColor" style={ic(color, opacity)} />
    <rect x="1" y="3" width="1" height="6" fill="currentColor" style={ic(color, opacity)} />
    <rect x="10" y="3" width="1" height="6" fill="currentColor" style={ic(color, opacity)} />
    <rect x="3" y="10" width="6" height="1" fill="currentColor" style={ic(color, opacity)} />
    <rect x="2" y="2" width="1" height="1" fill="currentColor" style={ic(color, opacity)} />
    <rect x="9" y="2" width="1" height="1" fill="currentColor" style={ic(color, opacity)} />
    <rect x="2" y="9" width="1" height="1" fill="currentColor" style={ic(color, opacity)} />
    <rect x="9" y="9" width="1" height="1" fill="currentColor" style={ic(color, opacity)} />
    <rect x="4" y="4" width="4" height="4" fill="currentColor" style={ic(color, opacity)} />
  </Px>;

// ════════════════════════════════════════════════════════════════════════════════
// MAPS & LOCATION
// ════════════════════════════════════════════════════════════════════════════════

/** Location pin */
export const IconLocation = ({
  size = 16,
  color,
  opacity
}: IconProps) => <Px size={size} viewBox="0 0 12 12">
    <rect x="4" y="1" width="4" height="1" fill="currentColor" style={ic(color, opacity)} />
    <rect x="2" y="2" width="2" height="1" fill="currentColor" style={ic(color, opacity)} />
    <rect x="8" y="2" width="2" height="1" fill="currentColor" style={ic(color, opacity)} />
    <rect x="1" y="3" width="1" height="4" fill="currentColor" style={ic(color, opacity)} />
    <rect x="10" y="3" width="1" height="4" fill="currentColor" style={ic(color, opacity)} />
    <rect x="2" y="7" width="2" height="1" fill="currentColor" style={ic(color, opacity)} />
    <rect x="8" y="7" width="2" height="1" fill="currentColor" style={ic(color, opacity)} />
    <rect x="3" y="8" width="2" height="1" fill="currentColor" style={ic(color, opacity)} />
    <rect x="7" y="8" width="2" height="1" fill="currentColor" style={ic(color, opacity)} />
    <rect x="4" y="9" width="1" height="1" fill="currentColor" style={ic(color, opacity)} />
    <rect x="7" y="9" width="1" height="1" fill="currentColor" style={ic(color, opacity)} />
    <rect x="5" y="10" width="2" height="1" fill="currentColor" style={ic(color, opacity)} />
    <rect x="4" y="3" width="4" height="4" fill="currentColor" style={ic(color, opacity)} fillOpacity="0.2" />
    <rect x="5" y="4" width="2" height="2" fill="currentColor" style={ic(color, opacity)} />
  </Px>;

/** Map / territory */
export const IconMap = ({
  size = 16,
  color,
  opacity
}: IconProps) => <Px size={size} viewBox="0 0 12 12">
    <rect x="1" y="2" width="1" height="8" fill="currentColor" style={ic(color, opacity)} />
    <rect x="2" y="2" width="3" height="1" fill="currentColor" style={ic(color, opacity)} />
    <rect x="2" y="9" width="3" height="1" fill="currentColor" style={ic(color, opacity)} />
    <rect x="4" y="1" width="1" height="1" fill="currentColor" style={ic(color, opacity)} fillOpacity="0.5" />
    <rect x="5" y="2" width="1" height="8" fill="currentColor" style={ic(color, opacity)} fillOpacity="0.5" />
    <rect x="5" y="3" width="3" height="1" fill="currentColor" style={ic(color, opacity)} />
    <rect x="5" y="10" width="3" height="1" fill="currentColor" style={ic(color, opacity)} />
    <rect x="7" y="2" width="1" height="1" fill="currentColor" style={ic(color, opacity)} fillOpacity="0.5" />
    <rect x="8" y="1" width="1" height="1" fill="currentColor" style={ic(color, opacity)} />
    <rect x="8" y="3" width="1" height="8" fill="currentColor" style={ic(color, opacity)} />
    <rect x="9" y="2" width="2" height="1" fill="currentColor" style={ic(color, opacity)} />
    <rect x="10" y="3" width="1" height="6" fill="currentColor" style={ic(color, opacity)} />
    <rect x="9" y="9" width="2" height="1" fill="currentColor" style={ic(color, opacity)} />
  </Px>;

/** Globe / world */
export const IconGlobe = ({
  size = 16,
  color,
  opacity
}: IconProps) => <Px size={size} viewBox="0 0 12 12">
    <rect x="4" y="1" width="4" height="1" fill="currentColor" style={ic(color, opacity)} />
    <rect x="2" y="2" width="2" height="1" fill="currentColor" style={ic(color, opacity)} />
    <rect x="8" y="2" width="2" height="1" fill="currentColor" style={ic(color, opacity)} />
    <rect x="1" y="4" width="1" height="4" fill="currentColor" style={ic(color, opacity)} />
    <rect x="10" y="4" width="1" height="4" fill="currentColor" style={ic(color, opacity)} />
    <rect x="2" y="8" width="2" height="1" fill="currentColor" style={ic(color, opacity)} />
    <rect x="8" y="8" width="2" height="1" fill="currentColor" style={ic(color, opacity)} />
    <rect x="4" y="9" width="4" height="1" fill="currentColor" style={ic(color, opacity)} />
    <rect x="5" y="1" width="2" height="9" fill="currentColor" style={ic(color, opacity)} />
    <rect x="2" y="5" width="8" height="1" fill="currentColor" style={ic(color, opacity)} fillOpacity="0.5" />
    <rect x="2" y="3" width="8" height="1" fill="currentColor" style={ic(color, opacity)} fillOpacity="0.3" />
    <rect x="2" y="7" width="8" height="1" fill="currentColor" style={ic(color, opacity)} fillOpacity="0.3" />
  </Px>;

/** Compass / direction */
export const IconCompass = ({
  size = 16,
  color,
  opacity
}: IconProps) => <Px size={size} viewBox="0 0 12 12">
    <rect x="4" y="1" width="4" height="1" fill="currentColor" style={ic(color, opacity)} />
    <rect x="2" y="2" width="2" height="1" fill="currentColor" style={ic(color, opacity)} />
    <rect x="8" y="2" width="2" height="1" fill="currentColor" style={ic(color, opacity)} />
    <rect x="1" y="4" width="1" height="4" fill="currentColor" style={ic(color, opacity)} />
    <rect x="10" y="4" width="1" height="4" fill="currentColor" style={ic(color, opacity)} />
    <rect x="2" y="8" width="2" height="1" fill="currentColor" style={ic(color, opacity)} />
    <rect x="8" y="8" width="2" height="1" fill="currentColor" style={ic(color, opacity)} />
    <rect x="4" y="9" width="4" height="1" fill="currentColor" style={ic(color, opacity)} />
    <rect x="5" y="3" width="2" height="2" fill="currentColor" style={ic(color, opacity)} />
    <rect x="7" y="7" width="2" height="2" fill="currentColor" style={ic(color, opacity)} fillOpacity="0.5" />
    <rect x="5" y="6" width="1" height="1" fill="currentColor" style={ic(color, opacity)} />
    <rect x="6" y="5" width="1" height="1" fill="currentColor" style={ic(color, opacity)} />
  </Px>;

// ════════════════════════════════════════════════════════════════════════════════
// DEVELOPMENT & CODE
// ════════════════════════════════════════════════════════════════════════════════

/** Code / angle brackets */
export const IconCode = ({
  size = 16,
  color,
  opacity
}: IconProps) => <Px size={size} viewBox="0 0 12 12">
    <rect x="1" y="5" width="2" height="2" fill="currentColor" style={ic(color, opacity)} />
    <rect x="3" y="3" width="2" height="2" fill="currentColor" style={ic(color, opacity)} />
    <rect x="3" y="7" width="2" height="2" fill="currentColor" style={ic(color, opacity)} />
    <rect x="9" y="5" width="2" height="2" fill="currentColor" style={ic(color, opacity)} />
    <rect x="7" y="3" width="2" height="2" fill="currentColor" style={ic(color, opacity)} />
    <rect x="7" y="7" width="2" height="2" fill="currentColor" style={ic(color, opacity)} />
    <rect x="5" y="2" width="2" height="1" fill="currentColor" style={ic(color, opacity)} fillOpacity="0.4" />
    <rect x="5" y="9" width="2" height="1" fill="currentColor" style={ic(color, opacity)} fillOpacity="0.4" />
  </Px>;

/** Git branch */
export const IconGitBranch = ({
  size = 16,
  color,
  opacity
}: IconProps) => <Px size={size} viewBox="0 0 12 12">
    <rect x="3" y="1" width="2" height="2" fill="currentColor" style={ic(color, opacity)} />
    <rect x="3" y="3" width="1" height="4" fill="currentColor" style={ic(color, opacity)} />
    <rect x="3" y="7" width="2" height="2" fill="currentColor" style={ic(color, opacity)} />
    <rect x="3" y="9" width="1" height="2" fill="currentColor" style={ic(color, opacity)} />
    <rect x="4" y="4" width="3" height="1" fill="currentColor" style={ic(color, opacity)} />
    <rect x="7" y="3" width="2" height="2" fill="currentColor" style={ic(color, opacity)} />
    <rect x="9" y="3" width="1" height="4" fill="currentColor" style={ic(color, opacity)} />
    <rect x="7" y="7" width="2" height="2" fill="currentColor" style={ic(color, opacity)} />
    <rect x="8" y="9" width="1" height="2" fill="currentColor" style={ic(color, opacity)} fillOpacity="0.5" />
  </Px>;

/** Package / box */
export const IconPackage = ({
  size = 16,
  color,
  opacity
}: IconProps) => <Px size={size} viewBox="0 0 12 12">
    <rect x="2" y="1" width="8" height="2" fill="currentColor" style={ic(color, opacity)} />
    <rect x="1" y="3" width="1" height="8" fill="currentColor" style={ic(color, opacity)} />
    <rect x="10" y="3" width="1" height="8" fill="currentColor" style={ic(color, opacity)} />
    <rect x="1" y="11" width="10" height="1" fill="currentColor" style={ic(color, opacity)} />
    <rect x="2" y="3" width="8" height="8" fill="currentColor" style={ic(color, opacity)} fillOpacity="0.12" />
    <rect x="5" y="3" width="2" height="4" fill="currentColor" style={ic(color, opacity)} />
    <rect x="4" y="4" width="1" height="1" fill="currentColor" style={ic(color, opacity)} fillOpacity="0.5" />
    <rect x="7" y="4" width="1" height="1" fill="currentColor" style={ic(color, opacity)} fillOpacity="0.5" />
  </Px>;

/** Webhook / api connect */
export const IconWebhook = ({
  size = 16,
  color,
  opacity
}: IconProps) => <Px size={size} viewBox="0 0 12 12">
    <rect x="2" y="2" width="2" height="2" fill="currentColor" style={ic(color, opacity)} />
    <rect x="2" y="4" width="1" height="2" fill="currentColor" style={ic(color, opacity)} />
    <rect x="3" y="6" width="2" height="1" fill="currentColor" style={ic(color, opacity)} />
    <rect x="5" y="6" width="1" height="2" fill="currentColor" style={ic(color, opacity)} />
    <rect x="5" y="8" width="2" height="1" fill="currentColor" style={ic(color, opacity)} />
    <rect x="7" y="7" width="1" height="2" fill="currentColor" style={ic(color, opacity)} />
    <rect x="8" y="6" width="2" height="1" fill="currentColor" style={ic(color, opacity)} />
    <rect x="9" y="4" width="1" height="2" fill="currentColor" style={ic(color, opacity)} />
    <rect x="8" y="2" width="2" height="2" fill="currentColor" style={ic(color, opacity)} />
    <rect x="5" y="4" width="2" height="2" fill="currentColor" style={ic(color, opacity)} />
  </Px>;

// ════════════════════════════════════════════════════════════════════════════════
// ICON REGISTRY — all icons with metadata for the showcase section
// ════════════════════════════════════════════════════════════════════════════════

export interface IconRegistryEntry {
  id: string;
  name: string;
  category: string;
  component: React.FC<IconProps>;
}
export const ICON_REGISTRY: IconRegistryEntry[] = [
// Navigation
{
  id: 'arrow-right',
  name: 'ArrowRight',
  category: 'Navigation',
  component: IconArrowRight
}, {
  id: 'arrow-left',
  name: 'ArrowLeft',
  category: 'Navigation',
  component: IconArrowLeft
}, {
  id: 'arrow-up',
  name: 'ArrowUp',
  category: 'Navigation',
  component: IconArrowUp
}, {
  id: 'arrow-down',
  name: 'ArrowDown',
  category: 'Navigation',
  component: IconArrowDown
}, {
  id: 'chevron-up',
  name: 'ChevronUp',
  category: 'Navigation',
  component: IconChevronUp
}, {
  id: 'chevron-down',
  name: 'ChevronDown',
  category: 'Navigation',
  component: IconChevronDown
}, {
  id: 'back',
  name: 'Back',
  category: 'Navigation',
  component: IconBack
}, {
  id: 'menu',
  name: 'Menu',
  category: 'Navigation',
  component: IconMenu
}, {
  id: 'close',
  name: 'Close',
  category: 'Navigation',
  component: IconClose
}, {
  id: 'external-link',
  name: 'ExternalLink',
  category: 'Navigation',
  component: IconExternalLink
}, {
  id: 'home',
  name: 'Home',
  category: 'Navigation',
  component: IconHome
},
// Actions
{
  id: 'search',
  name: 'Search',
  category: 'Actions',
  component: IconSearch
}, {
  id: 'plus',
  name: 'Plus',
  category: 'Actions',
  component: IconPlus
}, {
  id: 'minus',
  name: 'Minus',
  category: 'Actions',
  component: IconMinus
}, {
  id: 'trash',
  name: 'Trash',
  category: 'Actions',
  component: IconTrash
}, {
  id: 'edit',
  name: 'Edit',
  category: 'Actions',
  component: IconEdit
}, {
  id: 'copy',
  name: 'Copy',
  category: 'Actions',
  component: IconCopy
}, {
  id: 'download',
  name: 'Download',
  category: 'Actions',
  component: IconDownload
}, {
  id: 'upload',
  name: 'Upload',
  category: 'Actions',
  component: IconUpload
}, {
  id: 'share',
  name: 'Share',
  category: 'Actions',
  component: IconShare
}, {
  id: 'refresh',
  name: 'Refresh',
  category: 'Actions',
  component: IconRefresh
}, {
  id: 'pin',
  name: 'Pin',
  category: 'Actions',
  component: IconPin
}, {
  id: 'maximize',
  name: 'Maximize',
  category: 'Actions',
  component: IconMaximize
}, {
  id: 'minimize',
  name: 'Minimize',
  category: 'Actions',
  component: IconMinimize
},
// Status
{
  id: 'check',
  name: 'Check',
  category: 'Status',
  component: IconCheck
}, {
  id: 'alert',
  name: 'Alert',
  category: 'Status',
  component: IconAlert
}, {
  id: 'info',
  name: 'Info',
  category: 'Status',
  component: IconInfo
}, {
  id: 'loader',
  name: 'Loader',
  category: 'Status',
  component: IconLoader
}, {
  id: 'error',
  name: 'Error',
  category: 'Status',
  component: IconError
}, {
  id: 'success',
  name: 'Success',
  category: 'Status',
  component: IconSuccess
},
// Data
{
  id: 'file',
  name: 'File',
  category: 'Data',
  component: IconFile
}, {
  id: 'folder',
  name: 'Folder',
  category: 'Data',
  component: IconFolder
}, {
  id: 'database',
  name: 'Database',
  category: 'Data',
  component: IconDatabase
}, {
  id: 'chart',
  name: 'Chart',
  category: 'Data',
  component: IconChart
}, {
  id: 'tag',
  name: 'Tag',
  category: 'Data',
  component: IconTag
}, {
  id: 'filter',
  name: 'Filter',
  category: 'Data',
  component: IconFilter
}, {
  id: 'sort',
  name: 'Sort',
  category: 'Data',
  component: IconSort
}, {
  id: 'table',
  name: 'Table',
  category: 'Data',
  component: IconTable
}, {
  id: 'api',
  name: 'Api',
  category: 'Data',
  component: IconApi
}, {
  id: 'layers',
  name: 'Layers',
  category: 'Data',
  component: IconLayers
},
// Communication
{
  id: 'bell',
  name: 'Bell',
  category: 'Communication',
  component: IconBell
}, {
  id: 'mail',
  name: 'Mail',
  category: 'Communication',
  component: IconMail
}, {
  id: 'message',
  name: 'Message',
  category: 'Communication',
  component: IconMessage
}, {
  id: 'phone',
  name: 'Phone',
  category: 'Communication',
  component: IconPhone
}, {
  id: 'broadcast',
  name: 'Broadcast',
  category: 'Communication',
  component: IconBroadcast
},
// System
{
  id: 'settings',
  name: 'Settings',
  category: 'System',
  component: IconSettings
}, {
  id: 'lock',
  name: 'Lock',
  category: 'System',
  component: IconLock
}, {
  id: 'unlock',
  name: 'Unlock',
  category: 'System',
  component: IconUnlock
}, {
  id: 'user',
  name: 'User',
  category: 'System',
  component: IconUser
}, {
  id: 'users',
  name: 'Users',
  category: 'System',
  component: IconUsers
}, {
  id: 'shield',
  name: 'Shield',
  category: 'System',
  component: IconShield
}, {
  id: 'eye',
  name: 'Eye',
  category: 'System',
  component: IconEye
}, {
  id: 'eye-off',
  name: 'EyeOff',
  category: 'System',
  component: IconEyeOff
}, {
  id: 'key',
  name: 'Key',
  category: 'System',
  component: IconKey
}, {
  id: 'terminal',
  name: 'Terminal',
  category: 'System',
  component: IconTerminal
}, {
  id: 'cloud',
  name: 'Cloud',
  category: 'System',
  component: IconCloud
}, {
  id: 'cpu',
  name: 'Cpu',
  category: 'System',
  component: IconCpu
},
// Media
{
  id: 'play',
  name: 'Play',
  category: 'Media',
  component: IconPlay
}, {
  id: 'pause',
  name: 'Pause',
  category: 'Media',
  component: IconPause
}, {
  id: 'stop',
  name: 'Stop',
  category: 'Media',
  component: IconStop
}, {
  id: 'skip-forward',
  name: 'SkipForward',
  category: 'Media',
  component: IconSkipForward
}, {
  id: 'image',
  name: 'Image',
  category: 'Media',
  component: IconImage
}, {
  id: 'video',
  name: 'Video',
  category: 'Media',
  component: IconVideo
}, {
  id: 'mic',
  name: 'Mic',
  category: 'Media',
  component: IconMic
}, {
  id: 'link',
  name: 'Link',
  category: 'Media',
  component: IconLink
}, {
  id: 'star',
  name: 'Star',
  category: 'Media',
  component: IconStar
},
// Layout
{
  id: 'grid',
  name: 'Grid',
  category: 'Layout',
  component: IconGrid
}, {
  id: 'list',
  name: 'List',
  category: 'Layout',
  component: IconList
}, {
  id: 'sidebar',
  name: 'Sidebar',
  category: 'Layout',
  component: IconSidebar
}, {
  id: 'columns',
  name: 'Columns',
  category: 'Layout',
  component: IconColumns
}, {
  id: 'dashboard',
  name: 'Dashboard',
  category: 'Layout',
  component: IconDashboard
}, {
  id: 'badge',
  name: 'Badge',
  category: 'Layout',
  component: IconBadge
},
// Finance
{
  id: 'currency',
  name: 'Currency',
  category: 'Finance',
  component: IconCurrency
}, {
  id: 'wallet',
  name: 'Wallet',
  category: 'Finance',
  component: IconWallet
}, {
  id: 'receipt',
  name: 'Receipt',
  category: 'Finance',
  component: IconReceipt
}, {
  id: 'trending-up',
  name: 'TrendingUp',
  category: 'Finance',
  component: IconTrendingUp
}, {
  id: 'trending-down',
  name: 'TrendingDown',
  category: 'Finance',
  component: IconTrendingDown
}, {
  id: 'target',
  name: 'Target',
  category: 'Finance',
  component: IconTarget
},
// Time
{
  id: 'clock',
  name: 'Clock',
  category: 'Time',
  component: IconClock
}, {
  id: 'calendar',
  name: 'Calendar',
  category: 'Time',
  component: IconCalendar
}, {
  id: 'timer',
  name: 'Timer',
  category: 'Time',
  component: IconTimer
}, {
  id: 'history',
  name: 'History',
  category: 'Time',
  component: IconHistory
},
// Forms
{
  id: 'text',
  name: 'Text',
  category: 'Forms',
  component: IconText
}, {
  id: 'toggle',
  name: 'Toggle',
  category: 'Forms',
  component: IconToggle
}, {
  id: 'checkbox',
  name: 'Checkbox',
  category: 'Forms',
  component: IconCheckbox
}, {
  id: 'slider',
  name: 'Slider',
  category: 'Forms',
  component: IconSlider
}, {
  id: 'radio',
  name: 'Radio',
  category: 'Forms',
  component: IconRadio
},
// Maps
{
  id: 'location',
  name: 'Location',
  category: 'Maps',
  component: IconLocation
}, {
  id: 'map',
  name: 'Map',
  category: 'Maps',
  component: IconMap
}, {
  id: 'globe',
  name: 'Globe',
  category: 'Maps',
  component: IconGlobe
}, {
  id: 'compass',
  name: 'Compass',
  category: 'Maps',
  component: IconCompass
},
// Development
{
  id: 'code',
  name: 'Code',
  category: 'Development',
  component: IconCode
}, {
  id: 'git-branch',
  name: 'GitBranch',
  category: 'Development',
  component: IconGitBranch
}, {
  id: 'package',
  name: 'Package',
  category: 'Development',
  component: IconPackage
}, {
  id: 'webhook',
  name: 'Webhook',
  category: 'Development',
  component: IconWebhook
}];
export const ICON_CATEGORIES = ['Navigation', 'Actions', 'Status', 'Data', 'Communication', 'System', 'Media', 'Layout', 'Finance', 'Time', 'Forms', 'Maps', 'Development'] as const;
export type IconCategory = typeof ICON_CATEGORIES[number];