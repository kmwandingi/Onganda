// ─── Showcase "Copy code" — the inspector ────────────────────────────────────
// Only on /showcase. A toggle in the corner turns copy mode on; then every
// section carries a "Copy section" button, hovering outlines the nearest
// design-system component with its name, and a click opens its code. With the
// mode off nothing on the page changes.
//
// Hidden under automation unless the URL carries ?copy (the visual baselines
// screenshot the showcase, and a corner toggle would sit in some of them).

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import {
  AUTOMATED, FONT, ICON_SIZE, IconCopy, PixelButton, PixelDialog, PixelTag, roles, TYPE, useDark
} from '@onganda/design-system';
import { codeForElement, codeForSection, hostNodesOf, nearestComponent } from './copy-code';

type Picked = { title: string; code: string; sectionCode?: string; sectionLabel?: string };

const sectionLabel = (el: Element) =>
  el.querySelector('h2, h1')?.textContent?.trim() || el.id || 'Section';

/** The showcase's own sections: the children of its root that carry an id. */
const findSections = (): HTMLElement[] => {
  const root = document.querySelector('[data-onganda-showcase]');
  if (!root) return [];
  return [...root.querySelectorAll<HTMLElement>(':scope > section, :scope > div[id], :scope > [id]')]
    .filter((el, i, all) => all.indexOf(el) === i && !el.closest('[data-onganda-copy-ui]'));
};

export const CopyCodeInspector = () => {
  const { isDark } = useDark();
  const c = roles(isDark);
  const forced = typeof location !== 'undefined' && new URLSearchParams(location.search).has('copy');
  const [on, setOn] = useState(false);
  const [picked, setPicked] = useState<Picked | null>(null);
  const [hover, setHover] = useState<{ rect: DOMRect; name: string } | null>(null);
  const [copied, setCopied] = useState(false);
  const [sections, setSections] = useState<HTMLElement[]>([]);
  const [bars, setBars] = useState<HTMLElement[]>([]);
  const restore = useRef<{ el: HTMLElement; position: string }[]>([]);

  // Copy mode: a bar of buttons on every section.
  useEffect(() => {
    if (!on) return;
    const found = findSections();
    setSections(found);
    const made: HTMLElement[] = [];
    for (const el of found) {
      if (getComputedStyle(el).position === 'static') {
        restore.current.push({ el, position: el.style.position });
        el.style.position = 'relative';
      }
      const bar = document.createElement('div');
      bar.setAttribute('data-onganda-copy-ui', '');
      bar.style.cssText = 'position:absolute;top:8px;right:8px;z-index:40';
      el.appendChild(bar);
      made.push(bar);
    }
    setBars(made);
    return () => {
      made.forEach(b => b.remove());
      restore.current.forEach(({ el, position }) => { el.style.position = position; });
      restore.current = [];
      setBars([]);
      setHover(null);
    };
  }, [on]);

  const sectionOf = (node: Element) => sections.find(s => s.contains(node));

  const openSection = useCallback((el: HTMLElement) => {
    const label = sectionLabel(el);
    setPicked({ title: `Section · ${label}`, code: codeForSection(el, label) });
    setCopied(false);
  }, []);

  // Hover outline and click-to-pick, in the capture phase so the showcase's
  // own buttons and links do not fire while picking.
  useEffect(() => {
    if (!on || picked) return;
    const move = (e: MouseEvent) => {
      const t = e.target as Element;
      if (t.closest('[data-onganda-copy-ui]')) { setHover(null); return; }
      const hit = nearestComponent(t);
      if (!hit) { setHover(null); return; }
      const nodes = hostNodesOf(hit.fiber);
      if (!nodes.length) { setHover(null); return; }
      const r = nodes.map(n => n.getBoundingClientRect()).reduce((a, b) => {
        const x = Math.min(a.left, b.left), y = Math.min(a.top, b.top);
        return new DOMRect(x, y, Math.max(a.right, b.right) - x, Math.max(a.bottom, b.bottom) - y);
      });
      setHover({ rect: r, name: hit.name });
    };
    const click = (e: MouseEvent) => {
      const t = e.target as Element;
      if (t.closest('[data-onganda-copy-ui]') || t.closest('[role="dialog"]')) return;
      const hit = nearestComponent(t);
      if (!hit) return;
      e.preventDefault();
      e.stopPropagation();
      const section = sectionOf(t);
      const label = section ? sectionLabel(section) : undefined;
      setPicked({
        title: `<${hit.name}>`,
        code: codeForElement(hit.fiber, hit.name),
        sectionCode: section ? codeForSection(section, label!) : undefined,
        sectionLabel: label
      });
      setCopied(false);
      setHover(null);
    };
    const esc = (e: KeyboardEvent) => { if (e.key === 'Escape') setOn(false); };
    document.addEventListener('mousemove', move, true);
    document.addEventListener('click', click, true);
    document.addEventListener('keydown', esc);
    return () => {
      document.removeEventListener('mousemove', move, true);
      document.removeEventListener('click', click, true);
      document.removeEventListener('keydown', esc);
    };
  }, [on, picked, sections]);

  const copy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // Clipboard API unavailable (insecure origin): the old way.
      const ta = document.createElement('textarea');
      ta.value = text; document.body.appendChild(ta); ta.select();
      document.execCommand('copy'); ta.remove();
    }
    setCopied(true);
  };

  const label = useMemo(() => (TYPE.label), []);
  if (AUTOMATED && !forced) return null;

  return (
    <>
      {/* The toggle. */}
      <div data-onganda-copy-ui="" style={{ position: 'fixed', right: 20, bottom: 20, zIndex: 60 }}>
        <PixelButton variant={on ? 'primary' : 'accent'} lift aria-pressed={on} onClick={() => { setOn(o => !o); setPicked(null); }}
          data-testid="copy-toggle">
          {on ? 'Copy mode on — Esc to stop' : 'Copy code'} <IconCopy size={ICON_SIZE.inline} />
        </PixelButton>
      </div>

      {/* A "Copy section" button on every section. */}
      {on && bars.map((bar, i) => sections[i] && createPortal(
        <PixelButton variant="accent" lift onClick={() => openSection(sections[i])} data-testid="copy-section">
          Copy section <IconCopy size={ICON_SIZE.inline} />
        </PixelButton>,
        bar
      ))}

      {/* The hover outline and its name. */}
      {on && hover && !picked && (
        <div aria-hidden="true" data-onganda-copy-ui="" style={{
          position: 'fixed', left: hover.rect.left - 2, top: hover.rect.top - 2,
          width: hover.rect.width + 4, height: hover.rect.height + 4,
          border: `2px solid ${c.accentInk}`, pointerEvents: 'none', zIndex: 55
        }}>
          <span style={{
            position: 'absolute', left: -2, top: -22, padding: '3px 8px',
            background: c.accentInk, color: c.textOnInverse, fontSize: label.size,
            fontWeight: label.weight, letterSpacing: label.tracking, fontFamily: FONT.mono
          }}>{`<${hover.name}>`} · click to copy</span>
        </div>
      )}

      {/* The code. */}
      <PixelDialog open={!!picked} onClose={() => setPicked(null)} eyebrow="Copy code" title={picked?.title ?? ''} width={860}
        footer={<>
          {picked?.sectionCode && (
            <PixelButton variant="ghost" onClick={() => picked && setPicked({ title: `Section · ${picked.sectionLabel}`, code: picked.sectionCode! })}>
              Whole section instead
            </PixelButton>
          )}
          <PixelButton type="button" onClick={() => picked && copy(picked.code)} data-testid="copy-confirm">
            {copied ? 'Copied' : 'Copy to clipboard'} <IconCopy size={ICON_SIZE.inline} />
          </PixelButton>
        </>}
      >
        <div data-onganda-copy-ui="" className="mb-3 flex flex-wrap gap-2">
          <PixelTag label="Imports from @onganda/design-system" />
          <PixelTag label="Passes onganda-check" />
        </div>
        <pre data-testid="copy-code" style={{
          margin: 0, maxHeight: '55vh', overflow: 'auto', padding: 16,
          background: c.surfaceWell, border: `1px solid ${c.line}`, color: c.text,
          fontFamily: FONT.mono, fontSize: TYPE.code.size, lineHeight: 1.6, whiteSpace: 'pre'
        }}>{picked?.code}</pre>
      </PixelDialog>
    </>
  );
};
