// ─── Onganda Design System — Document viewer with region overlays ───────────
// A product that checks documents needs to show WHERE a finding lives: the
// net-pay box on a payslip, the altered line on a statement. The viewer draws
// the page (an image, or children for a synthetic page) and lays one
// focusable region per finding over it. Tab reaches every region; focusing
// or activating one reports it through `onRegionActivate`, so the finding
// beside the viewer can light up the same moment. `activeRegionId` makes the
// reverse direction work: hover a finding, its region lights up.
//
// A region's status is carried by the hue AND its label text — never by hue
// alone. Regions with no status render in the neutral line tone; that is the
// "could not check" register, not a missing style.
//
// Usage:
//   <PixelDocumentViewer
//     src="/report/payslip.png" alt="Payslip, page 1"
//     regions={[{ id: 'r1', x: 0.6, y: 0.42, w: 0.3, h: 0.06,
//                 label: 'Net pay', status: 'critical', findingId: 'f1' }]}
//     activeRegionId={active} onRegionActivate={r => setActive(r.id)} />
//
// Regions are buttons: Tab reaches each in reading order, Enter or Space
// activates it. Keep `regions` to what the report found — a page tiled in
// boxes is noise.

import React, { useState } from 'react';
import { roles, statusFor, StatusName } from './onganda-tokens';
import { TYPE } from './onganda-type';
import { useIsDark, PixelCornerMarks, type MotionConflicting } from './onganda-primitives';

export type DocumentRegion = {
  id: string;
  /** box as a fraction of the page, each 0–1 */
  x: number;
  y: number;
  w: number;
  h: number;
  /** what the box marks — announced and shown on the active region's chip */
  label: string;
  /** the finding this region belongs to */
  findingId?: string;
  /** hue from statusFor(); unset renders the neutral "could not check" line */
  status?: StatusName;
};

export const PixelDocumentViewer = ({
  src,
  alt = '',
  regions,
  activeRegionId,
  onRegionActivate,
  isDark: isDarkProp,
  className = '',
  children,
  ...rest
}: {
  /** the page image; omit it and pass `children` for a synthetic page */
  src?: string;
  alt?: string;
  regions: DocumentRegion[];
  /** the lit region, controlled by the finding list */
  activeRegionId?: string | null;
  /** called on focus and on Enter/Space, so the finding can light up too */
  onRegionActivate?: (region: DocumentRegion) => void;
  isDark?: boolean;
  className?: string;
  children?: React.ReactNode;
} & Omit<React.HTMLAttributes<HTMLElement>, 'title' | 'style' | MotionConflicting> & { style?: React.CSSProperties }) => {
  const isDark = useIsDark(isDarkProp);
  const c = roles(isDark);
  const [internal, setInternal] = useState<string | null>(null);
  const active = activeRegionId !== undefined ? activeRegionId : internal;

  const activate = (region: DocumentRegion) => {
    if (activeRegionId === undefined) setInternal(region.id);
    onRegionActivate?.(region);
  };

  return (
    <figure
      {...rest}
      role="group"
      aria-label={rest['aria-label'] ?? 'Document page with marked regions'}
      className={`relative m-0 ${className}`}
      // A recessed page ground, not a card: the page is content, like a field.
      style={{ background: c.canvas, border: `1px solid ${c.line}`, ...rest.style }}
      data-onganda-viewer=""
    >
      {src
        ? <img src={src} alt={alt} className="block w-full" draggable={false} />
        : <div className="w-full" style={{ aspectRatio: '1 / 1.4142' }}>{children}</div>}
      {regions.map((region) => {
        const on = active === region.id;
        const hue = region.status ? statusFor(region.status, isDark) : c.lineStrong;
        return (
          <button
            key={region.id}
            type="button"
            data-region-id={region.id}
            data-finding-id={region.findingId}
            aria-pressed={on}
            aria-label={`${region.label}${region.status ? ` — ${region.status}` : ''}`}
            className="onganda-focus absolute"
            style={{
              // The button reaches 12px past the box on every side, so a small
              // region still meets the 24px pointer target. The marked box is
              // drawn by the inner span and keeps the region's exact bounds.
              left: `calc(${region.x * 100}% - 12px)`,
              top: `calc(${region.y * 100}% - 12px)`,
              width: `calc(${region.w * 100}% + 24px)`,
              height: `calc(${region.h * 100}% + 24px)`,
              padding: 0,
              cursor: 'pointer',
              background: 'transparent',
              border: 'none',
              ['--onganda-focus' as string]: c.focusRing
            } as React.CSSProperties}
            onFocus={() => activate(region)}
            onClick={() => activate(region)}
          >
            <span
              aria-hidden="true"
              className="absolute"
              style={{
                inset: 12,
                // A 2px status edge plus a 1px `line` ring outside it, so a hue
                // under 3:1 still delineates on the page (the palette's
                // caution/active marks carry this ring for the same reason).
                background: on ? `${hue}26` : 'transparent',
                border: `2px solid ${hue}`,
                boxShadow: `0 0 0 1px ${c.line}`
              }}
            />
            <span aria-hidden="true" className="absolute" style={{ inset: 12 }}>
              {on && <PixelCornerMarks hex={hue} size={8} />}
              {on && (
                <span
                  className="absolute whitespace-nowrap"
                  style={{
                    left: 0,
                    top: -2,
                    transform: 'translateY(-100%)',
                    fontSize: TYPE.tag.size,
                    fontWeight: TYPE.tag.weight,
                    letterSpacing: TYPE.tag.tracking,
                    textTransform: 'uppercase',
                    color: c.text,
                    background: c.surface,
                    border: `1px solid ${hue}`,
                    padding: '2px 6px'
                  }}
                >
                  {region.label}
                </span>
              )}
            </span>
          </button>
        );
      })}
    </figure>
  );
};
