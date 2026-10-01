// ─── Showcase "Copy code" — generate consumer code from what is on screen ──
// The showcase is the reference, and agents copy it. Hand-written snippets
// drift the moment a section changes, so the code is generated from the live
// React tree instead: every rendered DOM node carries its fiber, and from a
// fiber we can read the components and props that built it.
//
//   • An ELEMENT is the nearest design-system component above what you click,
//     written as JSX with the props it was given.
//   • A SECTION is everything a showcase section renders, written as JSX that
//     stops at each design-system component (it does not expand PixelPanel
//     into divs) and inlines the showcase's own private helpers.
//
// Values are translated back into the system's vocabulary before they are
// written: a role's colour becomes `c.textMuted`, a peer accent becomes
// `accentFor(0)`, a palette colour `COLOR.ochreOrange`. The output is a
// complete component that imports from '@onganda/design-system' — paste it,
// and it renders, type-checks and passes `onganda-check`.

import * as DS from '@onganda/design-system';
import { motion } from 'framer-motion';
import * as RC from 'recharts';
import * as SECTIONS from '../components/onganda/onganda-sections';
import * as PUBLICATIONS from '../components/onganda/onganda-publications';
import * as SITES from '../components/onganda/onganda-public-sites';
import * as HUB from '../components/onganda/NamibiaAISystemsHub';

type Fiber = {
  tag: number;
  type: unknown;
  elementType: unknown;
  memoizedProps: Record<string, unknown> | string | null;
  child: Fiber | null;
  sibling: Fiber | null;
  return: Fiber | null;
  stateNode: unknown;
};

// ── Who is who ───────────────────────────────────────────────────────────────
type Origin = { name: string; from: string };
// Every table here is built on first use, not at load: the showcase hub
// imports this module, and this module reads namespaces that include the hub.
const KNOWN = new Map<unknown, Origin>();
const add = (mod: Record<string, unknown>, from: string) => {
  for (const [name, v] of Object.entries(mod)) {
    if (!/^[A-Z]/.test(name)) continue;
    const isComponent = typeof v === 'function' || (!!v && typeof v === 'object' && '$$typeof' in (v as object));
    if (isComponent && !KNOWN.has(v)) KNOWN.set(v, { name, from });
  }
};
let known = false;
const ensureKnown = () => {
  if (known) return;
  known = true;
  add(DS as Record<string, unknown>, '@onganda/design-system');
  add(RC as Record<string, unknown>, 'recharts');
  for (const tag of ['div', 'section', 'article', 'span', 'button', 'a', 'p', 'li', 'ul', 'nav', 'header', 'h2', 'h3', 'svg', 'rect', 'path', 'g']) {
    const m = (motion as unknown as Record<string, unknown>)[tag];
    if (m) KNOWN.set(m, { name: `motion.${tag}`, from: 'framer-motion' });
  }
};

// Whole showcase sections are exported too, but `<ProductSurface />` is not
// the code behind a section — its composition is. These are expanded, never
// written as a tag.
// Built on first use, not at load: these modules import each other, and
// reading a namespace mid-cycle throws.
let pageLevel: Set<unknown> | null = null;
const PAGE_LEVEL = () => {
  if (pageLevel) return pageLevel;
  pageLevel = new Set<unknown>();
  for (const mod of [SECTIONS, PUBLICATIONS, SITES, HUB] as Record<string, unknown>[]) {
    for (const v of Object.values(mod)) if (typeof v === 'function') pageLevel.add(v);
  }
  for (const n of ['ChartGallery', 'DocumentEditor', 'SlideEditor', 'AiAuthoringPanel', 'OngandaPublicSite', 'NamibiaAISystemsHub']) {
    const v = (DS as Record<string, unknown>)[n];
    if (v) pageLevel.add(v);
  }
  return pageLevel;
};

const originOf = (type: unknown): Origin | null => {
  ensureKnown();
  return PAGE_LEVEL().has(type) ? null : KNOWN.get(type) ?? null;
};

// ── Colour → vocabulary ──────────────────────────────────────────────────────
// 0.10 and 0.1 are the same alpha; compare colours with their numbers canonical.
const norm = (v: string) => v.toLowerCase().replace(/\s+/g, '').replace(/(\d*\.\d*?)0+(?=[,)])/g, '$1').replace(/\.(?=[,)])/g, '');
let palette: { roleByValue: Map<string, string[]>; accentIndex: Map<string, number>; colorName: Map<string, string> } | null = null;
const PALETTE = () => {
  if (palette) return palette;
  const roleByValue = new Map<string, string[]>();
  for (const [role, value] of Object.entries(DS.roles(false))) {
    if (typeof value !== 'string') continue;
    const key = norm(value);
    roleByValue.set(key, [...(roleByValue.get(key) ?? []), role]);
  }
  palette = {
    roleByValue,
    accentIndex: new Map(DS.ACCENT_CYCLE.map((hex, i) => [norm(hex), i] as [string, number])),
    colorName: new Map(Object.entries(DS.COLOR).map(([k, v]) => [norm(v), k] as [string, string]))
  };
  return palette;
};

const PREFER: [RegExp, string[]][] = [
  [/^(background|backgroundColor|fill)$/i, ['surface', 'canvas', 'surfaceWell', 'inverse', 'actionBg', 'accentBg', 'controlOn', 'dangerBg']],
  [/^(color)$/i, ['text', 'textBody', 'textMuted', 'textFaint', 'textOnInverse', 'accentInk', 'actionFg']],
  [/border|outline|stroke/i, ['line', 'lineStrong', 'fieldBorder', 'accentInk', 'controlOnBorder']]
];

type Uses = { ds: Set<string>; recharts: Set<string>; motion: boolean; roles: boolean };

/** A colour as code, or null when the value is not a colour we know. */
const colourExpr = (raw: string, key: string, uses: Uses): string | null => {
  const v = norm(raw);
  const { roleByValue: ROLE_BY_VALUE, accentIndex: ACCENT_INDEX, colorName: COLOR_NAME } = PALETTE();
  // Peer accents read as accentFor(i) — on a hex-valued accent/hex/colour prop.
  if (/^(accent|hex|color|fill|stroke)$/i.test(key) && ACCENT_INDEX.has(v)) {
    uses.ds.add('accentFor');
    return `accentFor(${ACCENT_INDEX.get(v)})`;
  }
  const roles = ROLE_BY_VALUE.get(v);
  if (roles) {
    const pref = PREFER.find(([re]) => re.test(key))?.[1] ?? [];
    const role = pref.find(r => roles.includes(r)) ?? roles[0];
    uses.roles = true;
    return `c.${role}`;
  }
  // Brand ink or paper at an opacity no role uses: the nearest role of the
  // same kind, so the paste stays on the ALPHA ramp.
  const ink = v.match(/^rgba\((30,26,23|232,225,207),([\d.]+)\)$/);
  if (ink) {
    const a = Number(ink[2]);
    const candidates = /border|outline|stroke/i.test(key)
      ? ['line', 'lineStrong', 'fieldBorder']
      : /background|fill/i.test(key) ? ['line', 'lineStrong'] : ['textFaint', 'textMuted', 'textBody'];
    const light = DS.roles(false) as unknown as Record<string, string>;
    const alphaOf = (s: string) => Number((s.match(/,([\d.]+)\)$/) ?? [])[1] ?? 1);
    const best = candidates.reduce((x, y) => Math.abs(alphaOf(light[y]) - a) < Math.abs(alphaOf(light[x]) - a) ? y : x);
    uses.roles = true;
    return `c.${best}`;
  }
  if (ACCENT_INDEX.has(v)) { uses.ds.add('accentFor'); return `accentFor(${ACCENT_INDEX.get(v)})`; }
  if (COLOR_NAME.has(v)) { uses.ds.add('COLOR'); return `COLOR.${COLOR_NAME.get(v)}`; }
  return null;
};

const COLOUR_IN_STRING = /#[0-9a-f]{6}\b|rgba?\([^)]*\)/gi;

/** A string value as code: a plain string, a colour expression, or a template
 *  literal when colours sit inside it (`1px solid ${c.line}`). */
const stringExpr = (s: string, key: string, uses: Uses): { code: string; isLiteral: boolean } => {
  const whole = colourExpr(s, key, uses);
  if (whole) return { code: whole, isLiteral: false };
  if (COLOUR_IN_STRING.test(s)) {
    COLOUR_IN_STRING.lastIndex = 0;
    let changed = false;
    const body = s.replace(/[`\\$]/g, ch => `\\${ch}`).replace(COLOUR_IN_STRING, m => {
      const e = colourExpr(m, key, uses);
      if (!e) return m;
      changed = true;
      return `\${${e}}`;
    });
    COLOUR_IN_STRING.lastIndex = 0;
    if (changed) return { code: `\`${body}\``, isLiteral: false };
  }
  return { code: JSON.stringify(s), isLiteral: true };
};

// ── Serialising values ───────────────────────────────────────────────────────
const isElement = (v: unknown): v is { type: unknown; props: Record<string, unknown> } =>
  !!v && typeof v === 'object' && '$$typeof' in (v as object) && 'props' in (v as object);

const SKIP_PROPS = new Set(['key', 'ref', '__self', '__source', 'data-testid']);
const MAX_ITEMS = 12;

const valueExpr = (v: unknown, key: string, uses: Uses, depth: number): string | null => {
  if (v === undefined || v === null) return null;
  if (typeof v === 'string') return stringExpr(v, key, uses).code;
  if (typeof v === 'number' || typeof v === 'boolean') return String(v);
  if (typeof v === 'function') {
    // A component passed as a value (PixelNav's `icon`) is written by name.
    const o = originOf(v);
    if (o) { if (o.from === '@onganda/design-system') uses.ds.add(o.name); else if (o.from === 'recharts') uses.recharts.add(o.name); return o.name; }
    // Handlers are stubbed for the product to wire. A row key must return a
    // string. Any other function is a render callback the showcase wrote for
    // itself: omitted, so the component falls back to its own default.
    if (/^on[A-Z]/.test(key) || key === 'onFiles') return '() => {}';
    if (key === 'rowKey') return '(r: Record<string, unknown>, i: number) => String(r.id ?? i)';
    return null;
  }
  if (isElement(v)) return elementToJsx(v, uses, depth + 1);
  if (Array.isArray(v)) {
    const items = v.slice(0, MAX_ITEMS).map(x => valueExpr(x, key, uses, depth + 1) ?? 'null');
    const more = v.length > MAX_ITEMS ? `, /* …${v.length - MAX_ITEMS} more */` : '';
    return `[${items.join(', ')}${more}]`;
  }
  if (typeof v === 'object' && v && '__code' in (v as object)) return String((v as { __code: string }).__code);
  if (typeof v === 'object') {
    const obj = v as Record<string, unknown>;
    const parts: string[] = [];
    for (const [k, x] of Object.entries(obj)) {
      // A table column's render function cannot be read back; render the
      // field the column is keyed on, which is what most columns show.
      if (k === 'render' && typeof x === 'function' && typeof obj.key === 'string') {
        parts.push(`render: (r: Record<string, unknown>) => String(r[${JSON.stringify(obj.key)}] ?? '')`);
        continue;
      }
      const e = valueExpr(x, k, uses, depth + 1);
      if (e !== null) parts.push(`${/^[A-Za-z_$][\w$]*$/.test(k) ? k : JSON.stringify(k)}: ${e}`);
    }
    return `{ ${parts.join(', ')} }`;
  }
  return null;
};

const attr = (key: string, v: unknown, uses: Uses, depth: number): string | null => {
  if (SKIP_PROPS.has(key) || key === 'children') return null;
  if (v === undefined || v === null) return null;
  // Components read the theme from DarkProvider; the showcase passes isDark
  // only because its sections switch mode locally. Kept when true — a control
  // on an inverse band genuinely needs the dark set.
  if (key === 'isDark' && v !== true) return null;
  if (v === true) return key;
  // false is written out: a required boolean (selected, isHovered) must be
  // present, and an explicit false is clearer than an absent prop.
  if (v === false) return `${key}={false}`;
  if (v === '' && key.startsWith('data-onganda-')) return `${key}=""`;
  if (typeof v === 'string') {
    const s = stringExpr(v, key, uses);
    return s.isLiteral && !/["{}\n]/.test(v) ? `${key}=${s.code}` : `${key}={${s.code}}`;
  }
  // A private showcase element as a prop (a chart's custom tooltip) cannot be
  // written; leave the prop out so the component uses its default.
  if (isElement(v) && typeof v.type !== 'string' && v.type !== FRAGMENT && !originOf(v.type)) return null;
  const e = valueExpr(v, key, uses, depth);
  return e === null ? null : `${key}={${e}}`;
};

const INDENT = '  ';
const pad = (n: number) => INDENT.repeat(n);

const tagFor = (type: unknown, uses: Uses): string | null => {
  if (typeof type === 'string') return type;
  const o = originOf(type);
  if (!o) return null;
  if (o.from === '@onganda/design-system') uses.ds.add(o.name);
  else if (o.from === 'recharts') uses.recharts.add(o.name);
  else if (o.from === 'framer-motion') uses.motion = true;
  return o.name;
};

const wrapJsx = (tag: string, attrs: string[], children: string[], depth: number): string => {
  const head = attrs.length ? ` ${attrs.join(' ')}` : '';
  const oneLine = `<${tag}${head}`;
  const multi = oneLine.length + depth * 2 > 96 && attrs.length > 1;
  const open = multi
    ? `<${tag}\n${attrs.map(a => pad(depth + 1) + a).join('\n')}\n${pad(depth)}`
    : oneLine;
  if (!children.length) return multi ? `${open}/>` : `${open} />`;
  if (children.length === 1 && !children[0].includes('\n') && (open.length + children[0].length) < 90) {
    return `${open}>${children[0]}</${tag}>`;
  }
  return `${open}>\n${children.map(ch => pad(depth + 1) + ch).join('\n')}\n${pad(depth)}</${tag}>`;
};

const textChild = (s: string) => (/[{}<>]/.test(s) ? `{${JSON.stringify(s)}}` : s.replace(/\s+/g, ' ').trim());

/** A React element (from props) as JSX. Private showcase helpers inside props
 *  cannot be expanded without rendering, so they become a marked comment. */
const SYSTEM_ICONS = new Set(['IconOkaanda', 'IconOshini', 'IconOmbiga', 'IconEtiti', 'IconOshitoo']);
const SIZE_NAME: Record<number, string> = { 12: 'inline', 24: 'control', 36: 'feature', 48: 'hero', 96: 'display' };
const MOTION_PROPS = new Set(['initial', 'animate', 'whileInView', 'viewport', 'transition', 'exit', 'variants', 'whileHover', 'whileTap', 'whileFocus', 'layout', 'custom']);

const FRAGMENT = Symbol.for('react.fragment');

function elementToJsx(el: { type: unknown; props: Record<string, unknown> }, uses: Uses, depth: number): string {
  if (el.type === FRAGMENT) {
    const kids = childrenOf(el.props.children, uses, depth);
    return kids.length ? `<>\n${kids.map(k => pad(depth + 1) + k).join('\n')}\n${pad(depth)}</>` : '<></>';
  }
  // A framer element is written as the system's own motion: a plain tag with
  // the data attributes style.css animates. Copying the showcase's private
  // whileInView entrances would hand a product exactly the scroll reveal the
  // guard forbids.
  const o0 = typeof el.type === 'string' ? null : originOf(el.type);
  if (o0?.from === 'framer-motion') {
    const p = el.props;
    const host = o0.name.replace('motion.', '');
    const extra: Record<string, unknown> = {};
    if (p.whileInView || p.initial) extra['data-onganda-enter'] = '';
    if (p.variants && (p.initial === 'hidden' || p.whileInView === 'visible')) extra['data-onganda-stagger'] = '';
    if (p.whileHover) extra['data-onganda-lift'] = '';
    if (p.whileTap) extra['data-onganda-press'] = '';
    const rest = Object.fromEntries(Object.entries(p).filter(([k]) => !MOTION_PROPS.has(k)));
    return elementToJsx({ type: host, props: { ...rest, ...extra } }, uses, depth);
  }
  // An icon is written at the size it renders: Px snaps to the grid.
  const iconName = KNOWN.get(el.type)?.name;
  if (iconName && /^Icon[A-Z]/.test(iconName) && typeof el.props.size === 'number') {
    const grid = SYSTEM_ICONS.has(iconName) ? 24 : 12;
    const snapped = Math.max(1, Math.round(el.props.size / grid)) * grid;
    if (SIZE_NAME[snapped]) {
      uses.ds.add('ICON_SIZE');
      el = { type: el.type, props: { ...el.props, size: { __code: `ICON_SIZE.${SIZE_NAME[snapped]}` } } };
    } else el = { type: el.type, props: { ...el.props, size: snapped } };
  }
  const tag = tagFor(el.type, uses);
  if (!tag) {
    const name = (el.type as { name?: string })?.name || 'Helper';
    return `{/* showcase helper <${name}> — replace with your own content */}`;
  }
  const attrs = Object.entries(el.props).map(([k, v]) => attr(k, v, uses, depth)).filter((a): a is string => !!a);
  const kids = childrenOf(el.props.children, uses, depth);
  return wrapJsx(tag, attrs, kids, depth);
}

function childrenOf(children: unknown, uses: Uses, depth: number): string[] {
  const list = Array.isArray(children) ? children.flat(Infinity) : [children];
  const out: string[] = [];
  for (const ch of list) {
    if (ch === null || ch === undefined || ch === false || ch === true) continue;
    if (typeof ch === 'string' || typeof ch === 'number') { const t = textChild(String(ch)); if (t) out.push(t); continue; }
    if (isElement(ch)) out.push(elementToJsx(ch, uses, depth + 1));
  }
  return out;
}

// ── Serialising a rendered subtree (for sections) ────────────────────────────
const HOST = 5, TEXT = 6;
// data-* attributes are the system's own hooks (data-onganda-*) or tests'; a
// paste needs neither, except the motion hooks a product may want to keep.
const HOST_ATTRS = /^(className|style|id|href|role|title|alt|src|type|aria-[\w-]+|data-onganda-(enter|stagger|lift|press|nudge|depth|live)|width|height|viewBox|x|y|fill|stroke|d|points|htmlFor|tabIndex|rel|target)$/;

function fiberChildren(f: Fiber): Fiber[] {
  const out: Fiber[] = [];
  for (let c = f.child; c; c = c.sibling) out.push(c);
  return out;
}

// Framer writes its animation state into the style it renders — mid-entrance
// that is opacity 0 — and a paste would freeze it there. These belong to the
// motion, not to the design.
const ANIMATED_STYLE = new Set(['opacity', 'transform', 'scale', 'x', 'y', 'rotate', 'translateX', 'translateY', 'willChange']);
const stripAnimated = (props: Record<string, unknown>) => {
  const s = props.style as Record<string, unknown> | undefined;
  if (!s) return props;
  return { ...props, style: Object.fromEntries(Object.entries(s).filter(([k]) => !ANIMATED_STYLE.has(k))) };
};

/** A <div> styled as a card — the surface with a hairline — IS PixelPanel.
 *  The showcase still has a few written by hand; copying them would hand a
 *  product the exact pattern `hand-rolled-card` rejects. */
const isHandCard = (type: unknown, props: Record<string, unknown>) => {
  if (typeof type !== 'string') return false;
  const s = props.style as Record<string, unknown> | undefined;
  if (!s) return false;
  const light = DS.roles(false);
  const bg = typeof s.background === 'string' ? norm(s.background) : typeof s.backgroundColor === 'string' ? norm(s.backgroundColor) : '';
  const border = typeof s.border === 'string' ? norm(s.border) : '';
  return bg === norm(light.surface) && (border.includes(norm(light.line)) || border.includes(norm(light.lineStrong)));
};

/** JSX for a fiber and what it renders. Design-system components are written
 *  as tags with their props; host nodes as tags with their attributes; private
 *  helpers and providers are expanded into what they render. */
function fiberToJsx(f: Fiber, uses: Uses, depth: number, budget: { lines: number }): string[] {
  if (budget.lines <= 0) return [];
  if (f.tag === TEXT) {
    const t = textChild(String(f.memoizedProps ?? ''));
    return t ? [t] : [];
  }
  const props = (f.memoizedProps && typeof f.memoizedProps === 'object' ? f.memoizedProps : {}) as Record<string, unknown>;
  const o = typeof f.type === 'string' ? null : originOf(f.type);
  // A framer element in a rendered section: write the host element it rendered,
  // with the system's motion attributes in place of framer's props.
  if (o?.from === 'framer-motion') {
    let host: Fiber | null = f.child;
    while (host && !(host.tag === HOST && typeof host.type === 'string')) host = host.child;
    if (host) {
      const extra: Record<string, unknown> = {};
      if (props.whileInView || props.initial) extra['data-onganda-enter'] = '';
      if (props.variants && (props.initial === 'hidden' || props.whileInView === 'visible')) extra['data-onganda-stagger'] = '';
      if (props.whileHover) extra['data-onganda-lift'] = '';
      if (props.whileTap) extra['data-onganda-press'] = '';
      const hostProps = { ...stripAnimated(host.memoizedProps as Record<string, unknown>), ...extra };
      return fiberToJsx({ ...host, memoizedProps: hostProps } as Fiber, uses, depth, budget);
    }
  }
  if (o) {
    const jsx = elementToJsx({ type: f.type, props }, uses, depth);
    budget.lines -= jsx.split('\n').length;
    return [jsx];
  }
  if (f.tag === HOST && typeof f.type === 'string' && isHandCard(f.type, props)) {
    uses.ds.add('PixelPanel');
    const cls = typeof props.className === 'string' && props.className ? [`className=${JSON.stringify(props.className)}`] : [];
    const kids = fiberChildren(f).flatMap(c => fiberToJsx(c, uses, depth + 1, budget));
    budget.lines -= 1;
    return [wrapJsx('PixelPanel', ['emphasis="quiet"', ...cls], kids, depth)];
  }
  if (f.tag === HOST && typeof f.type === 'string') {
    const attrs = Object.entries(props)
      .filter(([k]) => HOST_ATTRS.test(k))
      .map(([k, v]) => attr(k, v, uses, depth))
      .filter((a): a is string => !!a);
    // A lone text child is a prop, not a fiber of its own.
    const ownText = typeof props.children === 'string' || typeof props.children === 'number'
      ? [textChild(String(props.children))].filter(Boolean)
      : [];
    const kids = ownText.length ? ownText : fiberChildren(f).flatMap(c => fiberToJsx(c, uses, depth + 1, budget));
    budget.lines -= 1;
    return [wrapJsx(f.type, attrs, kids, depth)];
  }
  // Fragments, providers, private helpers: what they render.
  return fiberChildren(f).flatMap(c => fiberToJsx(c, uses, depth, budget));
}

// ── Entry points ─────────────────────────────────────────────────────────────
export const fiberOf = (node: Element | null): Fiber | null => {
  if (!node) return null;
  const key = Object.keys(node).find(k => k.startsWith('__reactFiber$'));
  return key ? ((node as unknown as Record<string, Fiber>)[key] ?? null) : null;
};

/** The nearest design-system component that rendered `node`. */
export const nearestComponent = (node: Element | null): { fiber: Fiber; name: string } | null => {
  for (let f = fiberOf(node); f; f = f.return) {
    if (typeof f.type === 'string') continue;
    const o = originOf(f.type);
    if (o && o.from === '@onganda/design-system') return { fiber: f, name: o.name };
  }
  return null;
};

/** The DOM nodes a fiber rendered at its top level — for the highlight box. */
export const hostNodesOf = (fiber: Fiber): Element[] => {
  const out: Element[] = [];
  const walk = (f: Fiber | null) => {
    for (let c = f; c; c = c.sibling) {
      if (c.tag === HOST && c.stateNode instanceof Element) out.push(c.stateNode);
      else walk(c.child);
    }
  };
  walk(fiber.child);
  return out;
};

const finish = (name: string, jsx: string, uses: Uses, note: string): string => {
  if (uses.roles) { uses.ds.add('roles'); uses.ds.add('useDark'); }
  const imports: string[] = [];
  if (uses.ds.size) imports.push(`import { ${[...uses.ds].sort().join(', ')} } from '@onganda/design-system';`);
  if (uses.recharts.size) imports.push(`import { ${[...uses.recharts].sort().join(', ')} } from 'recharts';`);
  if (uses.motion) imports.push(`import { motion } from 'framer-motion';`);
  const body = jsx.split('\n').map(l => pad(2) + l).join('\n');
  const hooks = uses.roles ? `  const { isDark } = useDark();\n  const c = roles(isDark);\n` : '';
  return `// ${note}
// Generated from the live showcase. Event handlers and state are stubbed:
// wire them to your own data. Requires @onganda/design-system/style.css.
${imports.join('\n')}

export function ${name}() {
${hooks}  return (
${body}
  );
}
`;
};

const pascal = (s: string) =>
  s.replace(/(^|[^A-Za-z0-9]+)([A-Za-z0-9])/g, (_, __, ch: string) => ch.toUpperCase())
    .replace(/[^A-Za-z0-9]/g, '').replace(/^[^A-Za-z]+/, '').slice(0, 48) || 'Snippet';

/** Code for one design-system element. */
export const codeForElement = (fiber: Fiber, name: string): string => {
  const uses: Uses = { ds: new Set(), recharts: new Set(), motion: false, roles: false };
  const props = (fiber.memoizedProps ?? {}) as Record<string, unknown>;
  const jsx = elementToJsx({ type: fiber.type, props }, uses, 0);
  return finish(`${name}Example`, jsx, uses, `<${name}> from /showcase`);
};

/** Code for everything a showcase section renders. */
export const codeForSection = (sectionNode: Element, label: string): string => {
  const uses: Uses = { ds: new Set(), recharts: new Set(), motion: false, roles: false };
  const f = fiberOf(sectionNode);
  if (!f) return '// Could not read this section.';
  const budget = { lines: 900 };
  const parts = fiberToJsx(f, uses, 0, budget);
  const truncated = budget.lines <= 0 ? '\n{/* …truncated: this section is larger than a paste. Copy its elements one by one. */}' : '';
  const jsx = parts.length === 1 ? parts[0] + truncated : `<>\n${parts.map(p => INDENT + p).join('\n')}${truncated}\n</>`;
  return finish(`${pascal(label)}Section`, jsx, uses, `The "${label}" section of /showcase`);
};
