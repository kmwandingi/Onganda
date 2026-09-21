// ─── Onganda Publications — Document & Presentation Formats ──────────────────
// Section presenting the two publication creation tools: Oshitaandwa (Document)
// and Oshilongifano (Presentation). Uses only existing design-system primitives
// and tokens — no new design decisions introduced.

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { COLOR, inkOn, PUBLICATION_FORMATS, PublicationFormat } from './onganda-tokens';
import { Px, PixelDot, DitherBar, PixelTag, PixelCornerMarks, WeaveOverlay, SectionHeader, useDark } from './onganda-primitives';

// ─── Document mockup — pixel-art A4 page preview ──────────────────────────────
const DocumentMockup = ({
  hex,
  hovered
}: {
  hex: string;
  hovered: boolean;
}) => <div aria-hidden="true" style={{
  width: '100%',
  maxWidth: 200,
  aspectRatio: '1 / 1.414',
  background: COLOR.dustLight,
  border: `1px solid ${hex}55`,
  position: 'relative',
  overflow: 'hidden',
  transition: 'box-shadow 0.25s, transform 0.25s',
  // The ring stays; the blur does not. Onganda has no elevation.
  boxShadow: hovered ? `0 0 0 2px ${hex}44` : 'none',
  transform: hovered ? 'translateY(-4px) rotate(-0.5deg)' : 'none'
}}>
    {/* Letterhead strip */}
    <div style={{
    height: 3,
    background: hex,
    width: '100%'
  }} />
    <div style={{
    padding: '10px 12px'
  }}>
      {/* Logo row */}
      <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: 6,
      marginBottom: 8
    }}>
        <div style={{
        width: 8,
        height: 8,
        background: hex
      }} />
        <div style={{
        height: 4,
        width: 40,
        background: hex,
        opacity: 0.6
      }} />
        <div style={{
        flex: 1
      }} />
        <div style={{
        height: 3,
        width: 24,
        background: hex,
        opacity: 0.25
      }} />
      </div>
      {/* Title block */}
      <div style={{
      height: 6,
      width: '80%',
      background: COLOR.charBlack,
      opacity: 0.75,
      marginBottom: 4
    }} />
      <div style={{
      height: 3,
      width: '55%',
      background: COLOR.charBlack,
      opacity: 0.25,
      marginBottom: 10
    }} />
      {/* Divider */}
      <div style={{
      height: 1,
      background: hex,
      opacity: 0.35,
      marginBottom: 8
    }} />
      {/* Body lines */}
      {[100, 90, 95, 70, 88, 60].map((w, i) => <div key={`doc-line-${i}`} style={{
      height: 2.5,
      width: `${w}%`,
      background: COLOR.charBlack,
      opacity: 0.18,
      marginBottom: i === 2 ? 6 : 3
    }} />)}
      {/* Subhead */}
      <div style={{
      height: 4,
      width: '45%',
      background: hex,
      opacity: 0.55,
      marginBottom: 5
    }} />
      {[85, 92, 65, 78].map((w, i) => <div key={`doc-line2-${i}`} style={{
      height: 2.5,
      width: `${w}%`,
      background: COLOR.charBlack,
      opacity: 0.18,
      marginBottom: 3
    }} />)}
    </div>
    {/* Bottom DitherBar hint */}
    <div style={{
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 4,
    display: 'flex',
    opacity: hovered ? 0.9 : 0.4,
    transition: 'opacity 0.25s'
  }}>
      {Array.from({
      length: 20
    }, (_, k) => <div key={`dm-${k}`} style={{
      flex: 1,
      background: k % 2 === 0 ? hex : 'transparent'
    }} />)}
    </div>
  </div>;

// ─── Presentation mockup — pixel-art 16:9 slide preview ───────────────────────
const PresentationMockup = ({
  hex,
  hovered
}: {
  hex: string;
  hovered: boolean;
}) => <div aria-hidden="true" style={{
  width: '100%',
  maxWidth: 240,
  aspectRatio: '16 / 9',
  background: COLOR.charBlack,
  border: `1px solid ${hex}55`,
  position: 'relative',
  overflow: 'hidden',
  transition: 'box-shadow 0.25s, transform 0.25s',
  boxShadow: hovered ? `0 0 0 2px ${hex}55` : 'none',
  transform: hovered ? 'translateY(-4px) rotate(0.5deg)' : 'none'
}}>
    <WeaveOverlay isDark opacity={0.05} />
    {/* Top bar */}
    <div style={{
    height: 2,
    background: hex,
    width: '100%'
  }} />
    <div style={{
    padding: '8px 10px',
    position: 'relative'
  }}>
      {/* Slide header */}
      <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: 5,
      marginBottom: 6
    }}>
        <div style={{
        width: 5,
        height: 5,
        background: hex
      }} />
        <div style={{
        height: 3,
        width: 20,
        background: hex,
        opacity: 0.5
      }} />
        <div style={{
        flex: 1
      }} />
        <div style={{
        height: 2,
        width: 14,
        background: COLOR.milletClay,
        opacity: 0.1
      }} />
      </div>
      {/* Big title block */}
      <div style={{
      height: 7,
      width: '70%',
      background: COLOR.milletClay,
      opacity: 0.8,
      marginBottom: 3
    }} />
      <div style={{
      height: 3,
      width: '42%',
      background: hex,
      opacity: 0.55,
      marginBottom: 8
    }} />
      {/* Content cols */}
      <div style={{
      display: 'flex',
      gap: 6
    }}>
        <div style={{
        flex: 1
      }}>
          {[90, 80, 95, 60].map((w, i) => <div key={`sl-l-${i}`} style={{
          height: 2,
          width: `${w}%`,
          background: COLOR.milletClay,
          opacity: 0.22,
          marginBottom: 3
        }} />)}
        </div>
        {/* Small chart placeholder */}
        <div style={{
        width: 28,
        display: 'flex',
        alignItems: 'flex-end',
        gap: 2,
        paddingBottom: 1
      }}>
          {[60, 80, 45, 100, 70].map((h, i) => <div key={`bar-${i}`} style={{
          flex: 1,
          height: `${h * 0.14}px`,
          background: hex,
          opacity: 0.5 + i * 0.1
        }} />)}
        </div>
      </div>
    </div>
    {/* Bottom strip */}
    <div style={{
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 3,
    display: 'flex',
    opacity: hovered ? 1 : 0.45,
    transition: 'opacity 0.25s'
  }}>
      {Array.from({
      length: 24
    }, (_, k) => <div key={`pm-${k}`} style={{
      flex: 1,
      background: k % 2 === 0 ? hex : 'transparent'
    }} />)}
    </div>
  </div>;

// ─── PublicationCard — one format card ────────────────────────────────────────
const PublicationCard = ({
  fmt,
  idx,
  onOpen
}: {
  fmt: PublicationFormat;
  idx: number;
  onOpen: () => void;
}) => {
  const [hovered, setHovered] = useState(false);
  const {
    isDark
  } = useDark();
  const cardBg = isDark ? COLOR.darkCard : COLOR.dustLight;
  const borderColor = hovered ? fmt.hex : isDark ? `${fmt.hex}28` : 'rgba(30,26,23,0.10)';
  const titleColor = isDark ? COLOR.milletClay : COLOR.charBlack;
  const subColor = isDark ? 'rgba(232,225,207,0.55)' : 'rgba(30,26,23,0.66)';
  const descColor = isDark ? 'rgba(232,225,207,0.60)' : 'rgba(30,26,23,0.65)';
  const hintColor = inkOn(fmt.hex, isDark ? COLOR.darkCard : COLOR.dustLight, isDark);
  return <motion.article initial={{
    opacity: 0,
    y: 20
  }} whileInView={{
    opacity: 1,
    y: 0
  }} viewport={{
    once: true,
    margin: '-40px'
  }} transition={{
    delay: idx * 0.12,
    duration: 0.55
  }} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} style={{
    position: 'relative',
    background: cardBg,
    border: `1px solid ${borderColor}`,
    transition: 'border-color 0.25s, box-shadow 0.25s, background 0.35s',
    boxShadow: hovered ? `0 0 0 1px ${fmt.hex}33` : 'none',
    overflow: 'hidden'
  }}>
      <WeaveOverlay isDark={isDark} opacity={isDark ? 0.04 : 0.03} />

      {/* Left accent bar */}
      <div aria-hidden="true" style={{
      position: 'absolute',
      left: 0,
      top: 0,
      bottom: 0,
      width: 3,
      background: fmt.hex,
      opacity: hovered ? 1 : 0.45,
      transition: 'opacity 0.25s'
    }} />

      <div style={{
      padding: '32px 32px 28px 40px'
    }}>
        {/* Header row */}
        <div style={{
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        marginBottom: 24,
        gap: 16
      }}>
          <div style={{
          flex: 1,
          minWidth: 0
        }}>
            <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            marginBottom: 10
          }}>
              <PixelTag hex={fmt.hex} label={fmt.tag} />
              <span style={{
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              color: subColor
            }}>
                {fmt.english}
              </span>
            </div>
            <h3 style={{
            fontSize: 24,
            fontWeight: 600,
            letterSpacing: '-0.02em',
            color: titleColor,
            lineHeight: 1.1,
            marginBottom: 4
          }}>
              {fmt.oshiwambo}
            </h3>
            <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            marginBottom: 12
          }}>
              <PixelDot color={fmt.hex} size={5} />
              <span style={{
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: '0.13em',
              textTransform: 'uppercase',
              color: inkOn(fmt.hex, isDark ? COLOR.darkCard : COLOR.dustLight, isDark)
            }}>
                {fmt.role}
              </span>
            </div>
            <p style={{
            fontSize: 14,
            lineHeight: 1.7,
            color: descColor,
            maxWidth: 440
          }}>
              {fmt.desc}
            </p>
          </div>

          {/* Mockup preview */}
          <div style={{
          flexShrink: 0,
          width: fmt.id === 'presentation' ? 180 : 130,
          display: 'flex',
          justifyContent: 'center'
        }}>
            {fmt.id === 'document' ? <DocumentMockup hex={fmt.hex} hovered={hovered} /> : <PresentationMockup hex={fmt.hex} hovered={hovered} />}
          </div>
        </div>

        {/* Use-cases row */}
        <div style={{
        marginBottom: 20
      }}>
          <p style={{
          fontSize: 9,
          fontWeight: 700,
          letterSpacing: '0.15em',
          textTransform: 'uppercase',
          color: subColor,
          marginBottom: 8
        }}>
            Use cases
          </p>
          <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 6
        }}>
            {fmt.useCases.map(uc => <span key={`uc-${fmt.id}-${uc}`} style={{
            fontSize: 10,
            fontWeight: 600,
            letterSpacing: '0.08em',
            padding: '3px 10px',
            background: `${fmt.hex}14`,
            border: `1px solid ${fmt.hex}30`,
            color: inkOn(fmt.hex, isDark ? COLOR.darkCard : COLOR.dustLight, isDark)
          }}>
                {uc}
              </span>)}
          </div>
        </div>

        {/* Exports + CTA row */}
        <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 12,
        flexWrap: 'wrap'
      }}>
          {/* Export badges */}
          <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8
        }}>
            <span style={{
            fontSize: 9,
            fontWeight: 700,
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: subColor
          }}>
              Export
            </span>
            {fmt.exports.map(exp => <div key={`exp-${fmt.id}-${exp}`} style={{
            display: 'flex',
            alignItems: 'center',
            gap: 4,
            padding: '2px 8px',
            background: isDark ? `${fmt.hex}18` : COLOR.charBlack,
            border: `1px solid ${isDark ? `${fmt.hex}40` : 'transparent'}`
          }}>
                <div style={{
              width: 4,
              height: 4,
              background: fmt.hex,
              flexShrink: 0
            }} />
                <span style={{
              fontSize: 9,
              fontWeight: 700,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color: isDark ? fmt.hex : COLOR.milletClay
            }}>
                  {exp}
                </span>
              </div>)}
          </div>

          {/* CTA button */}
          <motion.button whileTap={{
          scale: 0.97
        }} onClick={onOpen} style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          padding: '9px 20px',
          background: hovered ? fmt.hex : 'transparent',
          border: `1px solid ${fmt.hex}`,
          color: hovered ? fmt.id === 'document' ? COLOR.charBlack : COLOR.milletClay : inkOn(fmt.hex, isDark ? COLOR.darkCard : COLOR.dustLight, isDark),
          fontSize: 11,
          fontWeight: 600,
          letterSpacing: '0.08em',
          cursor: 'pointer',
          transition: 'background 0.2s, color 0.2s'
        }}>
            <span>
              {fmt.id === 'document' ? 'Create document' : 'Build presentation'}
            </span>
            <Px size={10} viewBox="0 0 8 8">
              <rect x="0" y="3" width="6" height="2" fill="currentColor" />
              <rect x="4" y="1" width="2" height="2" fill="currentColor" />
              <rect x="4" y="5" width="2" height="2" fill="currentColor" />
            </Px>
          </motion.button>
        </div>
      </div>

      {/* Hint line at the bottom edge */}
      <div style={{
      padding: '9px 40px',
      borderTop: `1px solid ${isDark ? `${fmt.hex}18` : 'rgba(30,26,23,0.1)'}`,
      background: isDark ? `${fmt.hex}08` : `${fmt.hex}07`
    }}>
        <p style={{
        fontSize: 10,
        fontWeight: 500,
        letterSpacing: '0.04em',
        color: hintColor,
        opacity: 0.8
      }}>
          {fmt.hint}
        </p>
      </div>

      <DitherBar color={fmt.hex} segments={28} height={3} opacity={1} className={`absolute bottom-0 left-0 right-0 transition-opacity duration-300 ${hovered ? 'opacity-100' : 'opacity-0'}`} />
    </motion.article>;
};

// ─── Publications — main section export ───────────────────────────────────────
export const Publications = ({
  onOpenDocument,
  onOpenSlides
}: {
  onOpenDocument?: () => void;
  onOpenSlides?: () => void;
}) => {
  const {
    isDark
  } = useDark();
  const borderColor = isDark ? 'rgba(232,225,207,0.08)' : 'rgba(30,26,23,0.10)';
  const subColor = isDark ? 'rgba(232,225,207,0.55)' : 'rgba(30,26,23,0.66)';
  const headlineColor = isDark ? COLOR.milletClay : COLOR.charBlack;
  return <section id="publications" className="max-w-7xl mx-auto px-6 pb-24 md:px-12">
      {/* Section header */}
      <div style={{
      borderBottom: `1px solid ${borderColor}`,
      paddingBottom: 24,
      marginBottom: 40
    }}>
        <div style={{
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        gap: 16,
        flexWrap: 'wrap'
      }}>
          <div>
            <h2 className="text-xs font-bold uppercase tracking-[0.15em] mb-2" style={{
            color: subColor
          }}>
              Publications
            </h2>
            <p className="text-2xl md:text-3xl font-medium tracking-tight" style={{
            color: headlineColor
          }}>
              Author once. Publish anywhere.
            </p>
          </div>
          {/* Pixel legend */}
          <div aria-hidden="true" style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          paddingBottom: 4
        }}>
            {[COLOR.ochreOrange, COLOR.dyePlum, COLOR.mahanguGold].map((c, i) => <div key={`pub-legend-${i}`} style={{
            width: 6,
            height: 6,
            background: c,
            opacity: 0.4 + i * 0.2
          }} />)}
          </div>
        </div>
        <p className="mt-4 text-sm leading-relaxed max-w-2xl" style={{
        color: isDark ? 'rgba(232,225,207,0.55)' : 'rgba(30,26,23,0.66)'
      }}>
          Two authoring formats — structured documents and slide decks — both living natively on the website with the full Onganda design language, and both exportable to standard formats whenever you need to share offline.
        </p>
      </div>

      {/* Format cards */}
      <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: 16
    }}>
        {PUBLICATION_FORMATS.map((fmt, idx) => <PublicationCard key={fmt.id} fmt={fmt} idx={idx} onOpen={fmt.id === 'document' ? onOpenDocument ?? (() => {}) : onOpenSlides ?? (() => {})} />)}
      </div>

      {/* Footnote rule */}
      <motion.div initial={{
      opacity: 0
    }} whileInView={{
      opacity: 1
    }} viewport={{
      once: true
    }} transition={{
      duration: 0.5,
      delay: 0.35
    }} style={{
      display: 'flex',
      alignItems: 'center',
      gap: 16,
      marginTop: 20
    }}>
        <div style={{
        flex: 1,
        height: 1,
        background: borderColor
      }} />
        <span style={{
        fontSize: 9,
        fontWeight: 700,
        letterSpacing: '0.15em',
        textTransform: 'uppercase',
        color: subColor,
        whiteSpace: 'normal',
        textAlign: 'center'
      }}>
          Oshitaandwa · Oshilongifano · PDF · Word · PPT
        </span>
        <div style={{
        flex: 1,
        height: 1,
        background: borderColor
      }} />
      </motion.div>
    </section>;
};