// ─── Onganda Design System — Primitives ──────────────────────────────────────
// All reusable atomic UI components: pixel SVGs, icons, context, section header,
// dither bar, stat card, swatch chip, terminal block, progress bar, flowchart
// node card, field app card, annotation panel, and dark-mode context.
// Import from this file in any Onganda project.

import React, { createContext, useContext } from 'react';
import { motion } from 'framer-motion';
import { WEAVE, COLOR, SystemEntry, FlowNodeEntry, StatEntry, SwatchEntry, TerminalBlock, TerminalLine, SectorApp, PrincipleEntry, GuideAnnotation, PixelRule, FooterLink, GUIDE_PALETTE_SWATCHES, FOOTER_DITHER_SWATCHES, FOOTER_LINKS } from './onganda-tokens';

// ─── Dark Mode Context ────────────────────────────────────────────────────────
export const DarkContext = createContext<{
  isDark: boolean;
  toggle: () => void;
}>({
  isDark: false,
  toggle: () => {}
});
export const useDark = () => useContext(DarkContext);

// ─── Px — pixel SVG primitive ─────────────────────────────────────────────────
// Usage: <Px size={48} viewBox="0 0 24 24">…rects…</Px>
export const Px = ({
  children,
  size = 48,
  viewBox = '0 0 24 24'
}: {
  children: React.ReactNode;
  size?: number;
  viewBox?: string;
}) => <svg width={size} height={size} viewBox={viewBox} fill="none" stroke="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    {children}
  </svg>;

// ─── PixelDot — single 2×2 or n×n pixel mark ─────────────────────────────────
// Usage: <PixelDot color="#D9791F" size={5} />
export const PixelDot = ({
  color,
  size = 4,
  opacity = 1
}: {
  color: string;
  size?: number;
  opacity?: number;
}) => <div aria-hidden="true" style={{
  width: size,
  height: size,
  background: color,
  opacity,
  flexShrink: 0
}} />;

// ─── DitherBar — horizontal pixel-dither accent bar ──────────────────────────
// Usage: <DitherBar color="#D9791F" segments={24} height={4} opacity={0.55} />
export const DitherBar = ({
  color,
  segments = 24,
  height = 4,
  opacity = 0.55,
  className = ''
}: {
  color: string;
  segments?: number;
  height?: number;
  opacity?: number;
  className?: string;
}) => <div aria-hidden="true" className={`flex ${className}`} style={{
  height
}}>
    {Array.from({
    length: segments
  }, (_, k) => <div key={`db-${k}`} className="flex-1 h-full" style={{
    background: k % 2 === 0 ? color : 'transparent',
    opacity
  }} />)}
  </div>;

// ─── DitherStrip — SVG dither strip used in section headers ──────────────────
// Usage: <DitherStrip color="#D9791F" opacity={0.3} />
export const DitherStrip = ({
  color = COLOR.ochreOrange,
  opacity = 0.18
}: {
  color?: string;
  opacity?: number;
}) => <Px size={64} viewBox="0 0 16 4">
    {[0, 2, 4, 6, 8, 10, 12, 14].map(x => <rect key={`d-${x}`} x={x} y="0" width="1" height="1" fill={color} fillOpacity={opacity * 2} />)}
    {[1, 3, 5, 7, 9, 11, 13].map(x => <rect key={`d2-${x}`} x={x} y="2" width="1" height="1" fill={color} fillOpacity={opacity} />)}
    {[0, 4, 8, 12].map(x => <rect key={`d3-${x}`} x={x} y="3" width="1" height="1" fill={color} fillOpacity={opacity * 0.5} />)}
  </Px>;

// ─── PixelTag — small coloured badge  ────────────────────────────────────────
// Usage: <PixelTag hex="#D9791F" label="01" />
export const PixelTag = ({
  hex,
  label
}: {
  hex: string;
  label: string;
}) => <div className="px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-[0.18em]" style={{
  background: hex,
  color: hex === COLOR.mahanguGold ? COLOR.charBlack : COLOR.dustLight
}}>
    {label}
  </div>;

// ─── PixelArrowDown — pixel-art downward arrow connector ─────────────────────
// Usage: <PixelArrowDown color="#D9791F" />
export const PixelArrowDown = ({
  color = COLOR.ochreOrange
}: {
  color?: string;
}) => <svg width="12" height="16" viewBox="0 0 6 8" fill="none" aria-hidden="true">
    <rect x="2" y="0" width="2" height="5" fill={color} fillOpacity="0.45" />
    <rect x="1" y="4" width="1" height="1" fill={color} fillOpacity="0.45" />
    <rect x="4" y="4" width="1" height="1" fill={color} fillOpacity="0.45" />
    <rect x="0" y="5" width="1" height="1" fill={color} fillOpacity="0.5" />
    <rect x="2" y="5" width="2" height="1" fill={color} fillOpacity="0.65" />
    <rect x="5" y="5" width="1" height="1" fill={color} fillOpacity="0.5" />
    <rect x="1" y="6" width="4" height="1" fill={color} fillOpacity="0.6" />
    <rect x="2" y="7" width="2" height="1" fill={color} fillOpacity="0.8" />
  </svg>;

// ─── SectionHeader — consistent section label + headline ─────────────────────
// Usage: <SectionHeader label="System Architecture" headline="Five tools. One workshop." />
export const SectionHeader = ({
  label,
  headline,
  isDark = false
}: {
  label: string;
  headline: string;
  isDark?: boolean;
}) => <div className="border-b pb-6 mb-12" style={{
  borderColor: isDark ? 'rgba(232,225,207,0.08)' : 'rgba(30,26,23,0.10)'
}}>
    <h2 className="text-xs font-bold uppercase tracking-[0.15em] mb-2" style={{
    color: isDark ? 'rgba(232,225,207,0.38)' : 'rgba(30,26,23,0.45)'
  }}>
      {label}
    </h2>
    <p className="text-2xl md:text-3xl font-medium tracking-tight" style={{
    color: isDark ? COLOR.milletClay : COLOR.charBlack
  }}>
      {headline}
    </p>
  </div>;

// ─── WeaveOverlay — Oshiwambo basket-weave texture overlay ───────────────────
// Usage: <WeaveOverlay isDark opacity={0.05} />
export const WeaveOverlay = ({
  isDark = false,
  opacity = 0.045
}: {
  isDark?: boolean;
  opacity?: number;
}) => <div aria-hidden="true" className="absolute inset-0 pointer-events-none" style={{
  backgroundImage: isDark ? WEAVE.dark : WEAVE.light,
  backgroundSize: WEAVE.size,
  opacity
}} />;

// ─── PixelCornerMarks — four pixel corner accents on a box ───────────────────
// Usage: <PixelCornerMarks hex="#D9791F" />  (wrap a relative-positioned parent)
export const PixelCornerMarks = ({
  hex,
  size = 10
}: {
  hex: string;
  size?: number;
}) => <>
    <div aria-hidden="true" className="absolute top-0 left-0" style={{
    width: size,
    height: size,
    background: hex
  }} />
    <div aria-hidden="true" className="absolute top-0 right-0" style={{
    width: size,
    height: size,
    background: hex
  }} />
    <div aria-hidden="true" className="absolute bottom-0 left-0" style={{
    width: size,
    height: size,
    background: hex,
    opacity: 0.5
  }} />
    <div aria-hidden="true" className="absolute bottom-0 right-0" style={{
    width: size,
    height: size,
    background: hex,
    opacity: 0.5
  }} />
  </>;

// ─── Canonical system icons ───────────────────────────────────────────────────
export const IconOkaanda = ({
  size = 48
}: {
  size?: number;
}) => <Px size={size}>
    <rect x="11" y="1" width="2" height="1" fill="#D9791F" />
    <rect x="10" y="2" width="4" height="1" fill="#D9791F" />
    <rect x="9" y="3" width="6" height="1" fill="#D9791F" />
    <rect x="8" y="4" width="8" height="1" fill="#C84A1B" />
    <rect x="7" y="5" width="10" height="1" fill="#8F3E21" />
    <rect x="8" y="6" width="8" height="8" fill="#D9791F" />
    <rect x="8" y="6" width="1" height="8" fill="#C84A1B" />
    <rect x="15" y="6" width="1" height="8" fill="#C84A1B" />
    <rect x="10" y="7" width="1" height="1" fill="#8F3E21" fillOpacity="0.6" />
    <rect x="13" y="8" width="1" height="1" fill="#8F3E21" fillOpacity="0.6" />
    <rect x="10" y="10" width="1" height="1" fill="#8F3E21" fillOpacity="0.6" />
    <rect x="13" y="11" width="1" height="1" fill="#8F3E21" fillOpacity="0.6" />
    <rect x="7" y="14" width="10" height="2" fill="#8F3E21" />
    <rect x="8" y="16" width="2" height="5" fill="#6A4B2E" />
    <rect x="11" y="16" width="1" height="4" fill="#6A4B2E" />
    <rect x="13" y="16" width="1" height="4" fill="#6A4B2E" />
    <rect x="14" y="16" width="2" height="5" fill="#6A4B2E" />
    <rect x="7" y="21" width="10" height="1" fill="#1E1A17" fillOpacity="0.18" />
  </Px>;
export const IconOshini = ({
  size = 48
}: {
  size?: number;
}) => <Px size={size}>
    <rect x="10" y="1" width="4" height="1" fill="#8F3E21" />
    <rect x="11" y="2" width="2" height="1" fill="#8F3E21" />
    <rect x="11" y="3" width="2" height="9" fill="#6A4B2E" />
    <rect x="9" y="11" width="6" height="1" fill="#8F3E21" />
    <rect x="10" y="12" width="4" height="2" fill="#8F3E21" />
    <rect x="5" y="14" width="14" height="1" fill="#8F3E21" />
    <rect x="5" y="15" width="2" height="6" fill="#8F3E21" />
    <rect x="17" y="15" width="2" height="6" fill="#8F3E21" />
    <rect x="7" y="15" width="10" height="6" fill="#DFAE2B" />
    <rect x="8" y="17" width="8" height="3" fill="#C84A1B" fillOpacity="0.30" />
    <rect x="6" y="21" width="12" height="1" fill="#6A4B2E" />
    <rect x="7" y="22" width="10" height="1" fill="#6A4B2E" />
    <rect x="6" y="23" width="12" height="1" fill="#1E1A17" fillOpacity="0.15" />
  </Px>;
export const IconOmbiga = ({
  size = 48
}: {
  size?: number;
}) => <Px size={size}>
    {/* Bail handle arc — two side posts */}
    <rect x="8" y="1" width="1" height="2" fill="#8F3E21" />
    <rect x="15" y="1" width="1" height="2" fill="#8F3E21" />
    {/* Lid — flat dome */}
    <rect x="9" y="3" width="6" height="1" fill="#DFAE2B" />
    <rect x="8" y="4" width="8" height="1" fill="#DFAE2B" />
    <rect x="11" y="2" width="2" height="2" fill="#DFAE2B" />
    {/* Lid knob */}
    <rect x="11" y="1" width="2" height="1" fill="#D9791F" />
    {/* Pot body — wide belly */}
    <rect x="7" y="5" width="10" height="1" fill="#D9791F" />
    <rect x="6" y="6" width="12" height="8" fill="#DFAE2B" />
    <rect x="6" y="6" width="1" height="8" fill="#D9791F" fillOpacity="0.55" />
    <rect x="17" y="6" width="1" height="8" fill="#D9791F" fillOpacity="0.55" />
    {/* Texture bands */}
    <rect x="6" y="8" width="12" height="1" fill="#8F3E21" fillOpacity="0.25" />
    <rect x="6" y="11" width="12" height="1" fill="#8F3E21" fillOpacity="0.25" />
    {/* Belly highlight dots */}
    <rect x="9" y="7" width="1" height="1" fill="#C84A1B" fillOpacity="0.35" />
    <rect x="14" y="9" width="1" height="1" fill="#C84A1B" fillOpacity="0.35" />
    {/* Lower taper */}
    <rect x="7" y="14" width="10" height="1" fill="#D9791F" />
    <rect x="8" y="15" width="8" height="1" fill="#8F3E21" />
    <rect x="9" y="16" width="6" height="1" fill="#8F3E21" />
    {/* Three legs */}
    <rect x="8" y="17" width="2" height="4" fill="#6A4B2E" />
    <rect x="11" y="17" width="2" height="4" fill="#6A4B2E" />
    <rect x="14" y="17" width="2" height="4" fill="#6A4B2E" />
    {/* Shadow */}
    <rect x="7" y="21" width="8" height="1" fill="#1E1A17" fillOpacity="0.15" />
  </Px>;
export const IconEtiti = ({
  size = 48
}: {
  size?: number;
}) => <Px size={size}>
    {/* Wide shallow bowl — open top */}
    <rect x="4" y="8" width="16" height="1" fill="#8F3E21" />
    {/* Inner cavity — deep open top */}
    <rect x="5" y="9" width="14" height="5" fill="#6A4B2E" fillOpacity="0.55" />
    {/* Bowl walls — ochre earthenware */}
    <rect x="3" y="9" width="2" height="6" fill="#D9791F" />
    <rect x="19" y="9" width="2" height="6" fill="#D9791F" />
    <rect x="5" y="9" width="14" height="1" fill="#D9791F" fillOpacity="0.6" />
    {/* Ochre texture swirls on exterior */}
    <rect x="5" y="12" width="14" height="3" fill="#D9791F" />
    <rect x="6" y="13" width="3" height="1" fill="#C84A1B" fillOpacity="0.4" />
    <rect x="11" y="12" width="4" height="1" fill="#8F3E21" fillOpacity="0.35" />
    <rect x="15" y="13" width="3" height="1" fill="#C84A1B" fillOpacity="0.4" />
    {/* Rim lip */}
    <rect x="3" y="15" width="18" height="1" fill="#8F3E21" />
    {/* Handle lugs — ear-style protrusions on each side */}
    <rect x="1" y="10" width="3" height="3" fill="#D9791F" />
    <rect x="20" y="10" width="3" height="3" fill="#D9791F" />
    <rect x="1" y="11" width="1" height="1" fill="#8F3E21" fillOpacity="0.4" />
    <rect x="22" y="11" width="1" height="1" fill="#8F3E21" fillOpacity="0.4" />
    {/* Flat base */}
    <rect x="5" y="16" width="14" height="1" fill="#6A4B2E" />
    <rect x="4" y="17" width="16" height="1" fill="#1E1A17" fillOpacity="0.15" />
  </Px>;
export const IconOshitoo = ({
  size = 48
}: {
  size?: number;
}) => <Px size={size}>
    {/* Narrow neck opening */}
    <rect x="10" y="1" width="4" height="1" fill="#6F4A6E" />
    <rect x="9" y="2" width="6" height="1" fill="#6F4A6E" />
    {/* Neck */}
    <rect x="9" y="3" width="6" height="2" fill="#6F4A6E" />
    <rect x="9" y="3" width="1" height="2" fill="#1E1A17" fillOpacity="0.2" />
    <rect x="14" y="3" width="1" height="2" fill="#1E1A17" fillOpacity="0.2" />
    {/* Shoulder — shoulders widening out */}
    <rect x="7" y="5" width="10" height="1" fill="#6F4A6E" />
    <rect x="6" y="6" width="12" height="1" fill="#6F4A6E" />
    {/* Round belly — widest point */}
    <rect x="5" y="7" width="14" height="7" fill="#6F4A6E" />
    <rect x="5" y="7" width="1" height="7" fill="#1E1A17" fillOpacity="0.22" />
    <rect x="18" y="7" width="1" height="7" fill="#1E1A17" fillOpacity="0.22" />
    {/* Kintsugi crack lines — gold repair marks */}
    <rect x="8" y="8" width="1" height="3" fill="#DFAE2B" fillOpacity="0.55" />
    <rect x="9" y="10" width="3" height="1" fill="#DFAE2B" fillOpacity="0.55" />
    <rect x="14" y="9" width="1" height="2" fill="#DFAE2B" fillOpacity="0.4" />
    <rect x="13" y="11" width="2" height="1" fill="#DFAE2B" fillOpacity="0.4" />
    {/* Lower belly taper */}
    <rect x="6" y="14" width="12" height="1" fill="#6F4A6E" />
    <rect x="7" y="15" width="10" height="1" fill="#8F3E21" fillOpacity="0.6" />
    <rect x="8" y="16" width="8" height="1" fill="#8F3E21" fillOpacity="0.5" />
    {/* Base */}
    <rect x="9" y="17" width="6" height="1" fill="#6A4B2E" />
    <rect x="10" y="18" width="4" height="1" fill="#6A4B2E" />
    {/* Shadow */}
    <rect x="8" y="19" width="8" height="1" fill="#1E1A17" fillOpacity="0.15" />
  </Px>;

// ─── SYSTEM_ICONS — lookup map for system name → icon node ───────────────────
export const SYSTEM_ICONS: Record<string, React.ReactNode> = {
  Okaanda: <IconOkaanda size={48} />,
  Oshini: <IconOshini size={48} />,
  Ombiga: <IconOmbiga size={48} />,
  Etiti: <IconEtiti size={48} />,
  Oshitoo: <IconOshitoo size={48} />
};

// ─── FlowNodeIcon — small icon for flowchart nodes ───────────────────────────
export const FlowNodeIcon = ({
  id,
  hex: _hex
}: {
  id: string;
  hex: string;
}) => {
  if (id === 'root' || id === 'granary') return <IconOkaanda size={28} />;
  if (id === 'mill') return <IconOshini size={28} />;
  if (id === 'vessel') return <IconOmbiga size={28} />;
  if (id === 'surface') return <IconEtiti size={28} />;
  if (id === 'delivery') return <IconOshitoo size={28} />;
  return <IconOkaanda size={28} />;
};

// ─── IconSun / IconMoon — dark mode toggle icons ─────────────────────────────
export const IconSun = () => <Px size={16} viewBox="0 0 12 12">
    <rect x="5" y="0" width="2" height="2" fill="currentColor" />
    <rect x="5" y="10" width="2" height="2" fill="currentColor" />
    <rect x="0" y="5" width="2" height="2" fill="currentColor" />
    <rect x="10" y="5" width="2" height="2" fill="currentColor" />
    <rect x="1" y="1" width="2" height="2" fill="currentColor" fillOpacity="0.6" />
    <rect x="9" y="1" width="2" height="2" fill="currentColor" fillOpacity="0.6" />
    <rect x="1" y="9" width="2" height="2" fill="currentColor" fillOpacity="0.6" />
    <rect x="9" y="9" width="2" height="2" fill="currentColor" fillOpacity="0.6" />
    <rect x="3" y="3" width="6" height="6" fill="currentColor" />
  </Px>;
export const IconMoon = () => <Px size={16} viewBox="0 0 12 12">
    <rect x="4" y="0" width="4" height="2" fill="currentColor" />
    <rect x="2" y="2" width="2" height="2" fill="currentColor" />
    <rect x="0" y="4" width="2" height="4" fill="currentColor" />
    <rect x="2" y="8" width="2" height="2" fill="currentColor" />
    <rect x="4" y="10" width="4" height="2" fill="currentColor" />
    <rect x="8" y="8" width="2" height="2" fill="currentColor" />
    <rect x="6" y="2" width="2" height="2" fill="currentColor" />
    <rect x="10" y="6" width="2" height="2" fill="currentColor" />
    <rect x="6" y="4" width="4" height="4" fill="currentColor" />
    <rect x="4" y="2" width="4" height="8" fill="currentColor" />
  </Px>;

// ─── OngandaLogoMark — brand pixel granary icon ───────────────────────────────
// Usage: <OngandaLogoMark size={28} />
export const OngandaLogoMark = ({
  size = 28
}: {
  size?: number;
}) => <Px size={size} viewBox="0 0 12 12">
    <rect x="5" y="0" width="2" height="1" fill="#D9791F" />
    <rect x="4" y="1" width="4" height="1" fill="#D9791F" />
    <rect x="3" y="2" width="6" height="1" fill="#C84A1B" />
    <rect x="4" y="3" width="4" height="4" fill="#D9791F" />
    <rect x="4" y="3" width="1" height="4" fill="#C84A1B" fillOpacity="0.5" />
    <rect x="7" y="3" width="1" height="4" fill="#C84A1B" fillOpacity="0.5" />
    <rect x="5" y="4" width="1" height="1" fill="#8F3E21" fillOpacity="0.6" />
    <rect x="3" y="7" width="6" height="1" fill="#8F3E21" />
    <rect x="4" y="8" width="1" height="3" fill="#6A4B2E" />
    <rect x="7" y="8" width="1" height="3" fill="#6A4B2E" />
    <rect x="3" y="11" width="6" height="1" fill="#1E1A17" fillOpacity="0.18" />
  </Px>;

// ─── PixelButton — primary/ghost pixel-style button ──────────────────────────
// Usage: <PixelButton variant="primary" onClick={…}>Label</PixelButton>
export const PixelButton = ({
  children,
  variant = 'primary',
  onClick,
  href,
  className = ''
}: {
  children: React.ReactNode;
  variant?: 'primary' | 'ghost';
  onClick?: () => void;
  href?: string;
  className?: string;
}) => {
  const base: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 8,
    padding: '10px 22px',
    fontSize: 13,
    fontWeight: 500,
    letterSpacing: '0.02em',
    textDecoration: 'none',
    cursor: 'pointer',
    transition: 'background 0.2s, border-color 0.2s, color 0.2s',
    border: 'none'
  };
  const primaryStyle: React.CSSProperties = {
    ...base,
    background: COLOR.charBlack,
    color: COLOR.milletClay
  };
  const ghostStyle: React.CSSProperties = {
    ...base,
    background: 'transparent',
    border: `1px solid rgba(30,26,23,0.2)`,
    color: COLOR.charBlack
  };
  const style = variant === 'primary' ? primaryStyle : ghostStyle;
  if (href) {
    return <a href={href} style={style} className={className} onMouseEnter={e => {
      e.currentTarget.style.background = variant === 'primary' ? COLOR.ochreOrange : 'transparent';
      if (variant === 'ghost') {
        e.currentTarget.style.borderColor = COLOR.ochreOrange;
        e.currentTarget.style.color = COLOR.ochreOrange;
      }
    }} onMouseLeave={e => {
      e.currentTarget.style.background = variant === 'primary' ? COLOR.charBlack : 'transparent';
      if (variant === 'ghost') {
        e.currentTarget.style.borderColor = 'rgba(30,26,23,0.2)';
        e.currentTarget.style.color = COLOR.charBlack;
      }
    }}>
        {children}
      </a>;
  }
  return <button onClick={onClick} style={{
    ...style,
    background: COLOR.ochreOrange,
    color: COLOR.milletClay
  }} className={`hover:bg-[#C84A1B] transition-colors duration-200 ${className}`}>
      {children}
    </button>;
};

// ─── StatCard — single stat in the research signals bar ──────────────────────
export const StatCard = ({
  stat
}: {
  stat: StatEntry;
}) => <motion.div initial={{
  opacity: 0,
  y: 8
}} whileInView={{
  opacity: 1,
  y: 0
}} viewport={{
  once: true
}} transition={{
  duration: 0.45
}} className="flex flex-col gap-1 px-6 py-8 md:px-10">
    <div className="flex items-end gap-2 mb-1">
      <span className="text-4xl font-semibold tracking-tighter leading-none" style={{
      color: stat.hex
    }}>{stat.value}</span>
      <PixelDot color={stat.hex} size={8} />
    </div>
    <p className="text-sm text-[#1E1A17]/65 leading-relaxed">{stat.label}</p>
    <p className="text-xs text-[#1E1A17]/45 mt-0.5">{stat.sub}</p>
  </motion.div>;

// ─── SwatchChip — single colour swatch with label ────────────────────────────
export const SwatchChip = ({
  swatch
}: {
  swatch: SwatchEntry;
}) => <div className="flex flex-col gap-2">
    <div className="w-full aspect-square border border-[#1E1A17]/10" style={{
    background: swatch.hex
  }} title={swatch.name} aria-label={swatch.name} />
    <div>
      <p className="text-[11px] font-semibold text-[#1E1A17] leading-tight">{swatch.name}</p>
      <p className="text-[10px] text-[#1E1A17]/50 mt-0.5">{swatch.desc}</p>
    </div>
  </div>;

// ─── TerminalCard — syntax-highlighted code block ────────────────────────────
export const TerminalCard = ({
  block
}: {
  block: TerminalBlock;
}) => {
  const colorMap: Record<TerminalLine['type'], string> = {
    comment: '#6A4B2E',
    keyword: '#D9791F',
    string: '#DFAE2B',
    plain: '#E8E1CF99',
    accent: '#C84A1B'
  };
  return <motion.div initial={{
    opacity: 0,
    y: 14
  }} whileInView={{
    opacity: 1,
    y: 0
  }} viewport={{
    once: true,
    margin: '-40px'
  }} transition={{
    duration: 0.5
  }} className="bg-[#1E1A17] overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b" style={{
      borderColor: `${block.tagHex}33`
    }}>
        <div className="flex items-center gap-2.5">
          <div className="flex gap-1.5" aria-hidden="true">
            <div className="w-2.5 h-2.5" style={{
            background: '#D9791F',
            opacity: 0.7
          }} />
            <div className="w-2.5 h-2.5" style={{
            background: '#C84A1B',
            opacity: 0.7
          }} />
            <div className="w-2.5 h-2.5" style={{
            background: '#DFAE2B',
            opacity: 0.7
          }} />
          </div>
          <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#E8E1CF]/30 ml-2">{block.title}</span>
        </div>
        <PixelTag hex={block.tagHex} label={block.tag} />
      </div>
      <div className="px-5 py-5 font-mono text-[12px] leading-6 overflow-x-auto">
        {block.lines.map((line, li) => <div key={`line-${block.tag}-${li}`} style={{
        color: colorMap[line.type],
        minHeight: '1.5rem'
      }}>
            <span>{line.text || '\u00A0'}</span>
          </div>)}
      </div>
      <DitherBar color={block.tagHex} segments={32} height={2} opacity={0.45} />
    </motion.div>;
};

// ─── SystemCard — system grid card with dark-mode support ─────────────────────
export const SystemCard = ({
  sys,
  idx
}: {
  sys: SystemEntry;
  idx: number;
}) => {
  const [hovered, setHovered] = React.useState(false);
  const {
    isDark
  } = useDark();
  const cardBg = isDark ? COLOR.darkCard : COLOR.dustLight;
  const cardBorder = isDark ? `${sys.borderHex}30` : 'rgba(30,26,23,0.10)';
  const titleColor = isDark ? COLOR.milletClay : COLOR.charBlack;
  const subColor = isDark ? 'rgba(232,225,207,0.55)' : 'rgba(30,26,23,0.45)';
  const descColor = isDark ? 'rgba(232,225,207,0.55)' : 'rgba(30,26,23,0.70)';
  const shadowHover = isDark ? `0 4px 28px 0 rgba(0,0,0,0.45), 0 0 0 1px ${sys.borderHex}40` : '0 4px 24px 0 rgba(30,26,23,0.10)';
  const shadowRest = isDark ? `0 1px 6px 0 rgba(0,0,0,0.30), 0 0 0 1px ${sys.borderHex}18` : '0 1px 4px 0 rgba(30,26,23,0.05)';
  return <motion.article initial={{
    opacity: 0,
    y: 16
  }} whileInView={{
    opacity: 1,
    y: 0
  }} viewport={{
    once: true,
    margin: '-40px'
  }} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} className="relative flex flex-col border p-8 cursor-default overflow-hidden" style={{
    background: cardBg,
    borderColor: cardBorder,
    transition: 'box-shadow 0.2s, background 0.35s, border-color 0.35s',
    boxShadow: hovered ? shadowHover : shadowRest
  }}>
      <WeaveOverlay isDark={isDark} opacity={isDark ? 0.045 : 0.04} />

      {isDark && <div aria-hidden="true" className="absolute left-0 top-0 bottom-0 w-[3px]" style={{
      background: sys.borderHex,
      opacity: hovered ? 0.85 : 0.4,
      transition: 'opacity 0.25s'
    }} />}

      <div className="w-14 h-14 flex items-center justify-center mb-7 shrink-0" style={isDark ? {
      background: `${sys.borderHex}18`,
      border: `1px solid ${sys.borderHex}40`
    } : {}}>
        {isDark ? SYSTEM_ICONS[sys.name] : <div className={`w-full h-full flex items-center justify-center border ${sys.accent}`}>{SYSTEM_ICONS[sys.name]}</div>}
      </div>

      <div className="mb-1">
        <h3 className="text-xl font-semibold tracking-tight mb-3" style={{
        color: titleColor
      }}>{sys.name}</h3>
        <p className="text-sm font-medium mt-0.5" style={{
        color: subColor
      }}>{sys.english}</p>
      </div>
      <div className="text-[10px] font-bold uppercase tracking-[0.15em] mb-5" style={{
      color: isDark ? sys.borderHex : COLOR.ochreOrange
    }}>{sys.role}</div>
      <p className="leading-relaxed text-sm flex-1" style={{
      color: descColor
    }}>{sys.desc}</p>

      <div className="mt-6 flex flex-wrap gap-3 text-xs font-semibold" style={{
      color: sys.borderHex,
      opacity: hovered ? 1 : 0,
      transform: hovered ? 'translateX(0)' : 'translateX(-6px)',
      transition: 'opacity 0.2s, transform 0.2s'
    }} aria-hidden="true">
        <span>Explore system</span>
        <Px size={12} viewBox="0 0 8 8">
          <rect x="0" y="3" width="6" height="2" fill="currentColor" />
          <rect x="4" y="1" width="2" height="2" fill="currentColor" />
          <rect x="4" y="5" width="2" height="2" fill="currentColor" />
        </Px>
      </div>

      <DitherBar color={sys.borderHex} segments={24} height={2} opacity={0.5} className={`absolute bottom-0 left-0 right-0 transition-opacity duration-300 ${hovered ? 'opacity-100' : 'opacity-0'}`} />
    </motion.article>;
};

// ─── FlowNodeCard — flowchart child node card ─────────────────────────────────
export const FlowNodeCard = ({
  node,
  isHovered
}: {
  node: FlowNodeEntry;
  isHovered: boolean;
}) => <div className="relative w-full bg-[#F3E8C3] overflow-hidden mb-4" style={{
  border: `1px solid ${node.hex}`,
  borderLeftWidth: 4,
  borderLeftColor: node.hex,
  boxShadow: isHovered ? `0 6px 24px rgba(30,26,23,0.13), -3px 0 0 0 ${node.hex}` : '0 2px 8px rgba(30,26,23,0.06)',
  transition: 'box-shadow 0.2s'
}}>
    <div aria-hidden="true" style={{
    height: 3,
    background: node.hex,
    opacity: isHovered ? 1 : 0.7,
    transition: 'opacity 0.2s'
  }} />
    <div aria-hidden="true" className="absolute top-[3px] left-0 w-2.5 h-2.5" style={{
    background: node.hex
  }} />
    <div className="p-5">
      <div className="flex items-center justify-between mb-4">
        <PixelTag hex={node.hex} label={node.pixelTag} />
        <FlowNodeIcon id={node.id} hex={node.hex} />
      </div>
      <p className="text-[17px] font-semibold tracking-tight text-[#1E1A17] leading-none">{node.oshiwambo}</p>
      <p className="text-xs text-[#1E1A17]/50 font-medium mb-3">{node.english}</p>
      <div className="flex items-center gap-1.5 min-w-0">
        <PixelDot color={node.hex} size={4} />
        <span className="text-[10px] font-bold uppercase tracking-[0.13em] truncate" style={{
        color: node.hex === COLOR.mahanguGold ? COLOR.mopaneBrown : node.hex
      }}>
          {node.role}
        </span>
      </div>
    </div>
    <DitherBar color={node.hex} segments={16} height={2} opacity={0.7} className={`absolute bottom-0 left-0 right-0 transition-opacity duration-200 ${isHovered ? 'opacity-100' : 'opacity-0'}`} />
  </div>;

// ─── FieldAppCard — field application card ────────────────────────────────────
export const FieldAppCard = ({
  app,
  idx
}: {
  app: SectorApp;
  idx: number;
}) => <motion.article initial={{
  opacity: 0,
  y: 16
}} whileInView={{
  opacity: 1,
  y: 0
}} viewport={{
  once: true,
  margin: '-30px'
}} transition={{
  delay: idx * 0.09,
  duration: 0.48
}} className="relative bg-[#F3E8C3] border border-[#1E1A17]/10 p-7 overflow-hidden group">
    <div className="flex items-start justify-between mb-6">
      <PixelTag hex={app.hex} label={app.tag} />
      <div className="flex gap-0.5" aria-hidden="true">
        <div className="w-2 h-2" style={{
        background: app.hex,
        opacity: 0.4
      }} />
        <div className="w-1 h-2" style={{
        background: app.hex,
        opacity: 0.2
      }} />
      </div>
    </div>
    <h3 className="text-lg font-semibold tracking-tight text-[#1E1A17] leading-none">{app.name}</h3>
    <p className="text-xs font-medium text-[#1E1A17]/45 mb-4">
      <span style={{
      color: app.hex
    }}>{app.oshiwambo}</span>
      <span className="mx-1.5 text-[#1E1A17]/25">·</span>
      <span>{app.sector}</span>
    </p>
    <p className="text-sm text-[#1E1A17]/65 leading-relaxed mb-6">{app.desc}</p>
    <div className="flex items-center gap-1.5">
      <PixelDot color={app.hex} size={6} />
      <span className="text-[10px] font-bold uppercase tracking-[0.15em]" style={{
      color: app.hex
    }}>Active pilot</span>
    </div>
    <div className="absolute left-0 top-0 bottom-0 w-[3px]" style={{
    background: app.hex
  }} aria-hidden="true" />
    <DitherBar color={app.hex} segments={20} height={2} opacity={1} className="absolute bottom-0 left-0 right-0 transition-opacity duration-200 opacity-0 group-hover:opacity-100" />
  </motion.article>;

// ─── AnnotationPanel — chart reading guide + pixel rules sidebar ──────────────
export const AnnotationPanel = ({
  annotations,
  rules
}: {
  annotations: GuideAnnotation[];
  rules: PixelRule[];
}) => <div className="lg:w-72 xl:w-80 shrink-0 flex flex-col gap-0">
    <div className="mb-8">
      <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#1E1A17]/40 mb-4">Reading the chart</p>
      <dl className="flex flex-col gap-0 divide-y divide-[#1E1A17]/10">
        {annotations.map(item => <div key={item.label} className="flex flex-col gap-0.5 py-4">
            <dt className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#D9791F]">{item.label}</dt>
            <dd className="text-sm text-[#1E1A17]/65 leading-relaxed">{item.note}</dd>
          </div>)}
      </dl>
    </div>
    <div className="border border-[#1E1A17]/12 bg-[#F3E8C3] p-5">
      <div className="flex items-center gap-2 mb-4" aria-hidden="true">
        {GUIDE_PALETTE_SWATCHES.map((c, i) => <div key={`guide-sw-${i}`} className="w-2.5 h-2.5" style={{
        background: c
      }} />)}
      </div>
      <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#1E1A17]/40 mb-3">Pixel rules</p>
      <ul className="flex flex-col gap-2">
        {rules.map(item => <li key={item.rule} className="flex items-start gap-2 text-xs text-[#1E1A17]/65 leading-snug">
            <div className="w-1 h-1 mt-1.5 shrink-0 bg-[#D9791F]" aria-hidden="true" />
            <span>{item.rule}</span>
          </li>)}
      </ul>
    </div>
  </div>;

// ─── PrinciplesRow — single brand principle row ───────────────────────────────
export const PrincipleRow = ({
  principle,
  idx
}: {
  principle: PrincipleEntry;
  idx: number;
}) => <motion.div initial={{
  opacity: 0,
  x: -10
}} whileInView={{
  opacity: 1,
  x: 0
}} viewport={{
  once: true
}} transition={{
  delay: idx * 0.07
}} className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-8 py-5">
    <dt className="text-xs font-bold uppercase tracking-[0.13em] text-[#D9791F] w-32 shrink-0">{principle.label}</dt>
    <dd className="text-[#1E1A17]/80 text-base">{principle.value}</dd>
  </motion.div>;

// ─── CodeSnippetBlock — section-bottom code snippet with copy button ──────────
// Usage: <CodeSnippetBlock label="SystemCard" code={...} accentHex="#D9791F" />
export interface CodeSnippetLine {
  type: 'comment' | 'keyword' | 'string' | 'plain' | 'accent' | 'import' | 'tag' | 'prop';
  text: string;
}
export const CodeSnippetBlock = ({
  label,
  lines,
  accentHex = COLOR.ochreOrange
}: {
  label: string;
  lines: CodeSnippetLine[];
  accentHex?: string;
}) => {
  const [copied, setCopied] = React.useState(false);
  const {
    isDark
  } = useDark();
  const colorMap: Record<CodeSnippetLine['type'], string> = {
    comment: isDark ? '#6A4B2E' : '#8F6840',
    keyword: COLOR.ochreOrange,
    string: COLOR.mahanguGold,
    plain: isDark ? 'rgba(232,225,207,0.6)' : 'rgba(232,225,207,0.75)',
    accent: COLOR.firedRed,
    import: COLOR.ochreOrange,
    tag: isDark ? 'rgba(232,225,207,0.9)' : 'rgba(232,225,207,0.95)',
    prop: COLOR.mahanguGold
  };
  const rawText = lines.map(l => l.text).join('\n');
  const handleCopy = () => {
    navigator.clipboard.writeText(rawText).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };
  return <motion.div initial={{
    opacity: 0,
    y: 10
  }} whileInView={{
    opacity: 1,
    y: 0
  }} viewport={{
    once: true,
    margin: '-20px'
  }} transition={{
    duration: 0.45
  }} style={{
    marginTop: 32,
    background: COLOR.charBlack,
    borderLeft: `3px solid ${accentHex}`,
    position: 'relative',
    overflow: 'hidden'
  }}>
      {/* Header bar */}
      <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '10px 16px',
      borderBottom: `1px solid ${accentHex}22`,
      background: `${accentHex}0a`
    }}>
        <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 10
      }}>
          {/* Traffic lights */}
          <div style={{
          display: 'flex',
          gap: 5
        }} aria-hidden="true">
            <div style={{
            width: 8,
            height: 8,
            background: COLOR.ochreOrange,
            opacity: 0.6
          }} />
            <div style={{
            width: 8,
            height: 8,
            background: COLOR.firedRed,
            opacity: 0.6
          }} />
            <div style={{
            width: 8,
            height: 8,
            background: COLOR.mahanguGold,
            opacity: 0.6
          }} />
          </div>
          <span style={{
          fontSize: 9,
          fontWeight: 700,
          letterSpacing: '0.16em',
          textTransform: 'uppercase',
          color: accentHex,
          opacity: 0.85
        }}>
            {label}
          </span>
          <span style={{
          fontSize: 9,
          fontWeight: 500,
          letterSpacing: '0.10em',
          textTransform: 'uppercase',
          color: 'rgba(232,225,207,0.25)'
        }}>
            snippet
          </span>
        </div>
        <motion.button onClick={handleCopy} whileTap={{
        scale: 0.92
      }} aria-label="Copy code snippet" style={{
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        padding: '4px 12px',
        background: copied ? `${accentHex}22` : 'transparent',
        border: `1px solid ${copied ? accentHex : 'rgba(232,225,207,0.15)'}`,
        color: copied ? accentHex : 'rgba(232,225,207,0.45)',
        fontSize: 9,
        fontWeight: 700,
        letterSpacing: '0.14em',
        textTransform: 'uppercase',
        cursor: 'pointer',
        transition: 'background 0.2s, border-color 0.2s, color 0.2s'
      }}>
          {/* Copy icon pixel */}
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
            {copied ? <>
                <rect x="1" y="5" width="3" height="2" fill="currentColor" />
                <rect x="2" y="7" width="2" height="1" fill="currentColor" />
                <rect x="3" y="4" width="2" height="2" fill="currentColor" />
                <rect x="5" y="2" width="2" height="3" fill="currentColor" />
              </> : <>
                <rect x="3" y="0" width="6" height="1" fill="currentColor" fillOpacity="0.7" />
                <rect x="3" y="0" width="1" height="7" fill="currentColor" fillOpacity="0.7" />
                <rect x="8" y="0" width="1" height="7" fill="currentColor" fillOpacity="0.7" />
                <rect x="3" y="6" width="6" height="1" fill="currentColor" fillOpacity="0.7" />
                <rect x="1" y="2" width="4" height="1" fill="currentColor" fillOpacity="0.5" />
                <rect x="1" y="2" width="1" height="7" fill="currentColor" fillOpacity="0.5" />
                <rect x="1" y="8" width="5" height="1" fill="currentColor" fillOpacity="0.5" />
                <rect x="5" y="8" width="1" height="1" fill="currentColor" fillOpacity="0.5" />
              </>}
          </svg>
          <span>{copied ? 'Copied!' : 'Copy'}</span>
        </motion.button>
      </div>

      {/* Code body */}
      <div style={{
      padding: '16px 20px',
      fontFamily: 'monospace',
      fontSize: 11,
      lineHeight: 1.75,
      overflowX: 'auto'
    }}>
        {lines.map((line, li) => <div key={`csl-${label}-${li}`} style={{
        color: colorMap[line.type],
        minHeight: '1.75em',
        whiteSpace: 'pre'
      }}>
            {line.text || '\u00A0'}
          </div>)}
      </div>

      <DitherBar color={accentHex} segments={32} height={2} opacity={0.45} />
    </motion.div>;
};

// ─── OngandaFooter — site-wide footer ────────────────────────────────────────
export const OngandaFooter = () => <footer className="w-full bg-[#1E1A17] text-[#E8E1CF] py-16 px-6 md:px-12 border-t-[3px] border-[#D9791F]">
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start gap-10 md:gap-0">
        <div>
          <div className="flex items-center gap-2.5 mb-3">
            <OngandaLogoMark size={22} />
            <span className="font-semibold tracking-tight text-base">
              <span className="text-[#D9791F]">Onganda</span>
              <span className="text-[#E8E1CF]/40 mx-1.5">·</span>
              <span className="text-[#E8E1CF]/70 font-normal text-sm">Namibia AI Systems Lab</span>
            </span>
          </div>
          <p className="text-sm text-[#E8E1CF]/45 max-w-xs leading-relaxed">
            A sovereign intelligence workshop. Pixelated by design. Material by palette. Oshiwambo by name. Calm by layout.
          </p>
        </div>
        <nav aria-label="Footer navigation" className="flex flex-col gap-3">
          <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#E8E1CF]/30 mb-1">Navigate</p>
          {FOOTER_LINKS.map(link => <a key={link.label} href={link.href} className="text-sm text-[#E8E1CF]/60 hover:text-[#D9791F] transition-colors duration-200">{link.label}</a>)}
        </nav>
      </div>
      <div className="mt-12 pt-6 border-t border-[#E8E1CF]/10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <p className="text-[11px] text-[#E8E1CF]/30">© Namibia AI Systems Lab. Names pending linguistic validation.</p>
        <div aria-hidden="true" className="flex gap-0.5">
          {FOOTER_DITHER_SWATCHES.map((c, i) => <div key={`foot-sw-${i}`} className="w-3 h-3" style={{
          background: c,
          opacity: 0.7
        }} />)}
        </div>
      </div>
    </div>
  </footer>;

export const OkaandaLogoMark = OngandaLogoMark;
export const OkaandaFooter = OngandaFooter;
