// ─── Onganda Slide Inspector — Block Property Panel ──────────────────────────

import React from 'react';
import { COLOR, SYSTEMS, FLOW_NODES, TIMELINE_PHASES, HEATMAP_CELLS, HEATMAP_LABELS_Y, SECTOR_APPS, SLIDE_MARKET_DATA, SLIDE_RADAR_DATA } from './onganda-tokens';
import { PixelDot } from './onganda-primitives';
import type { DroppedBlock, SlideEntry } from './onganda-block-types';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, RadarChart, Radar, PolarGrid, PolarAngleAxis } from 'recharts';

// ─── Inspector Panel ──────────────────────────────────────────────────────────
export const SlideInspector = ({
  isDark,
  selectedBlock,
  onUpdateBlock,
  onDeleteBlock,
  activeSlide,
  onUpdateSlideTitle
}: {
  isDark: boolean;
  selectedBlock: DroppedBlock | null;
  onUpdateBlock: (id: string, updates: Partial<DroppedBlock>) => void;
  onDeleteBlock: (id: string) => void;
  activeSlide: SlideEntry | null;
  onUpdateSlideTitle: (slideId: string, title: string) => void;
}) => {
  const panelBg = isDark ? COLOR.darkCard : '#E0D8C6';
  const headerBg = isDark ? COLOR.darkCard : '#D5CEBB';
  const border = isDark ? 'rgba(232,225,207,0.08)' : 'rgba(30,26,23,0.10)';
  const fg = isDark ? COLOR.milletClay : COLOR.charBlack;
  const muted = isDark ? 'rgba(232,225,207,0.55)' : 'rgba(30,26,23,0.66)';
  const inputStyle: React.CSSProperties = {
    width: '100%',
    fontSize: 11,
    fontWeight: 500,
    color: fg,
    background: isDark ? 'rgba(232,225,207,0.05)' : 'rgba(255,255,255,0.04)',
    border: `1px solid ${border}`,
    outline: 'none',
    padding: '5px 8px'
  };
  const labelStyle: React.CSSProperties = {
    fontSize: 8,
    fontWeight: 700,
    letterSpacing: '0.12em',
    textTransform: 'uppercase' as const,
    color: muted,
    display: 'block',
    marginBottom: 4
  };
  const textareaStyle: React.CSSProperties = {
    ...inputStyle,
    resize: 'vertical' as const,
    minHeight: 64,
    lineHeight: 1.5
  };
  const HEX_OPTIONS = [COLOR.ochreOrange, COLOR.firedRed, COLOR.mahanguGold, COLOR.barkRust, COLOR.mopaneBrown, COLOR.dyePlum];
  const renderEditor = () => {
    if (!selectedBlock) return null;
    const t = selectedBlock.type;
    if (t === 'text-headline' || t === 'text-body' || t === 'text-quote' || t === 'text-label') {
      return <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 10
      }}>
        <div>
          <label style={labelStyle}>Content</label>
          <textarea value={selectedBlock.textContent ?? ''} onChange={e => onUpdateBlock(selectedBlock.id, {
            textContent: e.target.value
          })} style={textareaStyle} />
        </div>
        <p style={{
          fontSize: 9,
          color: muted,
          margin: 0
        }}>Tip: double-click the block on canvas to edit inline.</p>
      </div>;
    }
    if (t === 'stat-custom' || t.startsWith('stat-')) {
      return <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 10
      }}>
        <div>
          <label style={labelStyle}>Value</label>
          <input value={selectedBlock.statValue ?? ''} onChange={e => onUpdateBlock(selectedBlock.id, {
            statValue: e.target.value
          })} style={inputStyle} />
        </div>
        <div>
          <label style={labelStyle}>Label</label>
          <input value={selectedBlock.statLabel ?? ''} onChange={e => onUpdateBlock(selectedBlock.id, {
            statLabel: e.target.value
          })} style={inputStyle} />
        </div>
        <div>
          <label style={labelStyle}>Sub-text</label>
          <input value={selectedBlock.statSub ?? ''} onChange={e => onUpdateBlock(selectedBlock.id, {
            statSub: e.target.value
          })} style={inputStyle} />
        </div>
        <div>
          <label style={labelStyle}>Accent Colour</label>
          <div style={{
            display: 'flex',
            gap: 5,
            flexWrap: 'wrap' as const
          }}>
            {HEX_OPTIONS.map((c, i) => <button key={`hi-${i}`} onClick={() => onUpdateBlock(selectedBlock.id, {
              statHex: c
            })} style={{
              width: 18,
              height: 18,
              background: c,
              border: `2px solid ${selectedBlock.statHex === c ? fg : 'transparent'}`,
              cursor: 'pointer'
            }} />)}
          </div>
        </div>
      </div>;
    }
    if (t === 'chart-market') {
      const chartData = selectedBlock.marketData ? JSON.parse(selectedBlock.marketData) as Array<{
        year: string;
        value: number;
      }> : SLIDE_MARKET_DATA;
      const chartTitle = selectedBlock.chartTitle ?? 'AI Market Growth';
      return <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 10
      }}>
        <div>
          <label style={labelStyle}>Chart Title</label>
          <input value={chartTitle} onChange={e => onUpdateBlock(selectedBlock.id, {
            chartTitle: e.target.value
          })} style={inputStyle} />
        </div>
        <div>
          <label style={labelStyle}>Data Points (Year / $B)</label>
          {chartData.map((row, i) => <div key={`mkt-slide-${i}`} style={{
            display: 'flex',
            gap: 4,
            marginBottom: 4
          }}>
            <input value={row.year} onChange={e => {
              const next = chartData.map((r, ri) => ri === i ? {
                ...r,
                year: e.target.value
              } : r);
              onUpdateBlock(selectedBlock.id, {
                marketData: JSON.stringify(next)
              });
            }} style={{
              ...inputStyle,
              flex: 1
            }} placeholder="Year" />
            <input type="number" value={row.value} onChange={e => {
              const next = chartData.map((r, ri) => ri === i ? {
                ...r,
                value: Number(e.target.value)
              } : r);
              onUpdateBlock(selectedBlock.id, {
                marketData: JSON.stringify(next)
              });
            }} style={{
              ...inputStyle,
              flex: 1,
              color: COLOR.barkRust
            }} placeholder="$B" />
            <button onClick={() => {
              const next = chartData.filter((_, ri) => ri !== i);
              onUpdateBlock(selectedBlock.id, {
                marketData: JSON.stringify(next)
              });
            }} style={{
              fontSize: 9,
              color: COLOR.firedRed,
              background: 'transparent',
              border: 'none',
              cursor: 'pointer'
            }}>✕</button>
          </div>)}
          <button onClick={() => {
            const next = [...chartData, {
              year: 'Year',
              value: 0
            }];
            onUpdateBlock(selectedBlock.id, {
              marketData: JSON.stringify(next)
            });
          }} style={{
            fontSize: 9,
            fontWeight: 600,
            color: COLOR.barkRust,
            background: 'transparent',
            border: `1px solid ${COLOR.ochreOrange}50`,
            cursor: 'pointer',
            padding: '3px 8px',
            marginTop: 4
          }}>+ Add</button>
        </div>
      </div>;
    }
    if (t === 'chart-radar') {
      const radarChartData = selectedBlock.radarData ? JSON.parse(selectedBlock.radarData) as Array<{
        subject: string;
        value: number;
      }> : SLIDE_RADAR_DATA;
      return <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 10
      }}>
        <label style={labelStyle}>Radar Values (Subject / 0–100)</label>
        {radarChartData.map((row, i) => <div key={`radar-slide-${i}`} style={{
          display: 'flex',
          gap: 4,
          marginBottom: 4
        }}>
          <input value={row.subject} onChange={e => {
            const next = radarChartData.map((r, ri) => ri === i ? {
              ...r,
              subject: e.target.value
            } : r);
            onUpdateBlock(selectedBlock.id, {
              radarData: JSON.stringify(next)
            });
          }} style={{
            ...inputStyle,
            flex: 2
          }} placeholder="Subject" />
          <input type="number" value={row.value} min={0} max={100} onChange={e => {
            const next = radarChartData.map((r, ri) => ri === i ? {
              ...r,
              value: Number(e.target.value)
            } : r);
            onUpdateBlock(selectedBlock.id, {
              radarData: JSON.stringify(next)
            });
          }} style={{
            ...inputStyle,
            flex: 1,
            color: COLOR.dyePlum
          }} placeholder="Val" />
          <button onClick={() => {
            const next = radarChartData.filter((_, ri) => ri !== i);
            onUpdateBlock(selectedBlock.id, {
              radarData: JSON.stringify(next)
            });
          }} style={{
            fontSize: 9,
            color: COLOR.firedRed,
            background: 'transparent',
            border: 'none',
            cursor: 'pointer'
          }}>✕</button>
        </div>)}
        <button onClick={() => {
          const next = [...radarChartData, {
            subject: 'New',
            value: 50
          }];
          onUpdateBlock(selectedBlock.id, {
            radarData: JSON.stringify(next)
          });
        }} style={{
          fontSize: 9,
          fontWeight: 600,
          color: COLOR.dyePlum,
          background: 'transparent',
          border: `1px solid ${COLOR.dyePlum}50`,
          cursor: 'pointer',
          padding: '3px 8px'
        }}>+ Add Axis</button>
      </div>;
    }
    if (t === 'chart-heatmap') {
      const heatCells = selectedBlock.heatmapData ? JSON.parse(selectedBlock.heatmapData) as Array<{
        row: number;
        col: number;
        intensity: number;
      }> : HEATMAP_CELLS;
      const getHeatColor = (intensity: number) => {
        if (intensity > 0.85) return COLOR.firedRed;
        if (intensity > 0.65) return COLOR.ochreOrange;
        if (intensity > 0.45) return COLOR.mahanguGold;
        if (intensity > 0.25) return COLOR.barkRust;
        if (intensity > 0.1) return COLOR.mopaneBrown;
        return COLOR.charBlack;
      };
      return <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 8
      }}>
        <label style={labelStyle}>Cell Intensities (0.0–1.0)</label>
        <div style={{
          background: '#1E1A17',
          padding: '8px',
          overflowX: 'auto'
        }}>
          {HEATMAP_LABELS_Y.slice(0, 4).map((rowLabel, ri) => <div key={`hmcfg-row-${ri}`} style={{
            display: 'flex',
            gap: 3,
            marginBottom: 4,
            alignItems: 'center'
          }}>
            <span style={{
              fontSize: 7,
              color: 'rgba(232,225,207,0.55)',
              width: 36,
              flexShrink: 0,
              textAlign: 'right',
              paddingRight: 3
            }}>{rowLabel.slice(0, 5)}</span>
            {heatCells.filter(c => c.row === ri).map(cell => <div key={`hmcfg-cell-${cell.row}-${cell.col}`} style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 2
            }}>
              <div style={{
                width: 16,
                height: 10,
                background: getHeatColor(cell.intensity)
              }} />
              <input type="number" min={0} max={1} step={0.1} value={cell.intensity.toFixed(1)} onChange={e => {
                const next = heatCells.map(c => c.row === cell.row && c.col === cell.col ? {
                  ...c,
                  intensity: Math.max(0, Math.min(1, Number(e.target.value)))
                } : c);
                onUpdateBlock(selectedBlock.id, {
                  heatmapData: JSON.stringify(next)
                });
              }} style={{
                width: 24,
                fontSize: 7,
                background: 'transparent',
                border: 'none',
                outline: 'none',
                padding: '1px 2px',
                color: 'rgba(232,225,207,0.7)',
                textAlign: 'center'
              }} />
            </div>)}
          </div>)}
        </div>
        <p style={{
          fontSize: 8,
          color: muted,
          margin: 0
        }}>Shows rows 1–4. Enter 0.0–1.0.</p>
      </div>;
    }
    if (t.startsWith('timeline-') || t === 'chart-timeline') {
      const current = selectedBlock.timelineIdx ?? (t.startsWith('timeline-') ? parseInt(t.replace('timeline-', ''), 10) : 0);
      return <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 8
      }}>
        <label style={labelStyle}>Phase Template</label>
        {TIMELINE_PHASES.map((ph, i) => <button key={`ph-ins-${i}`} onClick={() => onUpdateBlock(selectedBlock.id, {
          timelineIdx: i,
          label: ph.english
        })} style={{
          padding: '4px 8px',
          fontSize: 9,
          fontWeight: 600,
          cursor: 'pointer',
          textAlign: 'left',
          border: `1px solid ${current === i ? ph.hex : border}`,
          background: current === i ? `${ph.hex}18` : 'transparent',
          color: current === i ? ph.hex : muted
        }}>
          {ph.tag} — {ph.english}
        </button>)}
        <div style={{
          height: 1,
          background: border,
          margin: '4px 0'
        }} />
        <label style={labelStyle}>Custom Overrides</label>
        <div>
          <label style={{
            ...labelStyle,
            marginBottom: 3
          }}>Phase Name</label>
          <input value={selectedBlock.customPhaseName ?? ''} onChange={e => onUpdateBlock(selectedBlock.id, {
            customPhaseName: e.target.value
          })} placeholder={TIMELINE_PHASES[current % TIMELINE_PHASES.length].english} style={inputStyle} />
        </div>
        <div>
          <label style={{
            ...labelStyle,
            marginBottom: 3
          }}>Period</label>
          <input value={selectedBlock.customPeriod ?? ''} onChange={e => onUpdateBlock(selectedBlock.id, {
            customPeriod: e.target.value
          })} placeholder={TIMELINE_PHASES[current % TIMELINE_PHASES.length].period} style={inputStyle} />
        </div>
        <div>
          <label style={{
            ...labelStyle,
            marginBottom: 3
          }}>Progress %</label>
          <input type="number" min={0} max={100} value={selectedBlock.customProgress ?? ''} onChange={e => onUpdateBlock(selectedBlock.id, {
            customProgress: e.target.value === '' ? undefined : Number(e.target.value)
          })} placeholder={String(TIMELINE_PHASES[current % TIMELINE_PHASES.length].progress)} style={inputStyle} />
        </div>
        <div>
          <label style={{
            ...labelStyle,
            marginBottom: 3
          }}>Description</label>
          <textarea value={selectedBlock.customDesc ?? ''} onChange={e => onUpdateBlock(selectedBlock.id, {
            customDesc: e.target.value
          })} placeholder="Phase description…" style={{
            ...textareaStyle,
            minHeight: 48
          }} />
        </div>
        <button onClick={() => onUpdateBlock(selectedBlock.id, {
          customPhaseName: undefined,
          customPeriod: undefined,
          customProgress: undefined,
          customDesc: undefined
        })} style={{
          fontSize: 9,
          color: muted,
          background: 'transparent',
          border: `1px solid ${border}`,
          cursor: 'pointer',
          padding: '3px 8px'
        }}>Reset to defaults</button>
      </div>;
    }
    if (t.startsWith('sys-card-') || t.startsWith('flow-node-')) {
      const isSys = t.startsWith('sys-card-');
      const items = isSys ? SYSTEMS.map((s, i) => ({
        label: s.name,
        hex: s.borderHex,
        idx: i
      })) : FLOW_NODES.map((n, i) => ({
        label: n.oshiwambo,
        hex: n.hex,
        idx: i
      }));
      const currentIdx = isSys ? selectedBlock.systemIdx ?? parseInt(t.replace('sys-card-', ''), 10) : selectedBlock.flowNodeIdx ?? parseInt(t.replace('flow-node-', ''), 10);
      const updateKey = isSys ? 'systemIdx' : 'flowNodeIdx';
      const currentItem = isSys ? SYSTEMS[currentIdx % SYSTEMS.length] : FLOW_NODES[currentIdx % FLOW_NODES.length];
      return <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 8
      }}>
        <label style={labelStyle}>{isSys ? 'System Template' : 'Node Template'}</label>
        {items.map(item => <button key={`sc-${item.idx}`} onClick={() => onUpdateBlock(selectedBlock.id, {
          [updateKey]: item.idx,
          label: item.label
        })} style={{
          padding: '4px 8px',
          fontSize: 9,
          fontWeight: 600,
          cursor: 'pointer',
          textAlign: 'left',
          border: `1px solid ${currentIdx === item.idx ? item.hex : border}`,
          background: currentIdx === item.idx ? `${item.hex}18` : 'transparent',
          color: currentIdx === item.idx ? item.hex : muted
        }}>
          {item.label}
        </button>)}
        <div style={{
          height: 1,
          background: border,
          margin: '4px 0'
        }} />
        <label style={labelStyle}>Custom Overrides</label>
        <div>
          <label style={{
            ...labelStyle,
            marginBottom: 3
          }}>{isSys ? 'System Name' : 'Node Name'}</label>
          <input value={isSys ? selectedBlock.customName ?? '' : selectedBlock.customNodeName ?? ''} onChange={e => onUpdateBlock(selectedBlock.id, isSys ? {
            customName: e.target.value
          } : {
            customNodeName: e.target.value
          })} placeholder={isSys ? (currentItem as typeof SYSTEMS[0]).name : (currentItem as typeof FLOW_NODES[0]).oshiwambo} style={inputStyle} />
        </div>
        <div>
          <label style={{
            ...labelStyle,
            marginBottom: 3
          }}>Role</label>
          <input value={isSys ? selectedBlock.customRole ?? '' : selectedBlock.customNodeRole ?? ''} onChange={e => onUpdateBlock(selectedBlock.id, isSys ? {
            customRole: e.target.value
          } : {
            customNodeRole: e.target.value
          })} placeholder={(currentItem as typeof SYSTEMS[0]).role} style={inputStyle} />
        </div>
        <button onClick={() => onUpdateBlock(selectedBlock.id, isSys ? {
          customName: undefined,
          customRole: undefined
        } : {
          customNodeName: undefined,
          customNodeRole: undefined
        })} style={{
          fontSize: 9,
          color: muted,
          background: 'transparent',
          border: `1px solid ${border}`,
          cursor: 'pointer',
          padding: '3px 8px'
        }}>Reset to defaults</button>
      </div>;
    }
    if (t.startsWith('field-')) {
      const currentIdx = selectedBlock.sectorAppIdx ?? parseInt(t.replace('field-', ''), 10);
      const currentApp = SECTOR_APPS[currentIdx % SECTOR_APPS.length];
      return <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 8
      }}>
        <label style={labelStyle}>Application Template</label>
        {SECTOR_APPS.map((app, i) => <button key={`fa-${i}`} onClick={() => onUpdateBlock(selectedBlock.id, {
          sectorAppIdx: i,
          label: app.name
        })} style={{
          padding: '4px 8px',
          fontSize: 9,
          fontWeight: 600,
          cursor: 'pointer',
          textAlign: 'left',
          border: `1px solid ${currentIdx === i ? app.hex : border}`,
          background: currentIdx === i ? `${app.hex}18` : 'transparent',
          color: currentIdx === i ? app.hex : muted
        }}>
          {app.name} — {app.sector}
        </button>)}
        <div style={{
          height: 1,
          background: border,
          margin: '4px 0'
        }} />
        <label style={labelStyle}>Custom Overrides</label>
        <div>
          <label style={{
            ...labelStyle,
            marginBottom: 3
          }}>App Name</label>
          <input value={selectedBlock.customAppName ?? ''} onChange={e => onUpdateBlock(selectedBlock.id, {
            customAppName: e.target.value
          })} placeholder={currentApp.name} style={inputStyle} />
        </div>
        <div>
          <label style={{
            ...labelStyle,
            marginBottom: 3
          }}>Sector</label>
          <input value={selectedBlock.customSector ?? ''} onChange={e => onUpdateBlock(selectedBlock.id, {
            customSector: e.target.value
          })} placeholder={currentApp.sector} style={inputStyle} />
        </div>
        <div>
          <label style={{
            ...labelStyle,
            marginBottom: 3
          }}>Description</label>
          <textarea value={selectedBlock.customAppDesc ?? ''} onChange={e => onUpdateBlock(selectedBlock.id, {
            customAppDesc: e.target.value
          })} placeholder={currentApp.desc} style={{
            ...textareaStyle,
            minHeight: 48
          }} />
        </div>
        <button onClick={() => onUpdateBlock(selectedBlock.id, {
          customAppName: undefined,
          customSector: undefined,
          customAppDesc: undefined
        })} style={{
          fontSize: 9,
          color: muted,
          background: 'transparent',
          border: `1px solid ${border}`,
          cursor: 'pointer',
          padding: '3px 8px'
        }}>Reset to defaults</button>
      </div>;
    }
    return <p style={{
      fontSize: 10,
      color: muted,
      lineHeight: 1.6,
      margin: 0
    }}>This component has no editable properties. Select a text, stat, system, or timeline block to configure it.</p>;
  };
  return <div style={{
    width: 200,
    flexShrink: 0,
    background: panelBg,
    borderLeft: `1px solid ${border}`,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden'
  }}>
    <div style={{
      background: headerBg,
      borderBottom: `1px solid ${border}`,
      padding: '12px 14px',
      flexShrink: 0
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 6
      }}>
        <PixelDot color={COLOR.dyePlum} size={5} />
        <span style={{
          fontSize: 9,
          fontWeight: 700,
          letterSpacing: '0.16em',
          color: COLOR.dyePlum,
          textTransform: 'uppercase' as const
        }}>Inspector</span>
      </div>
    </div>
    <div style={{
      flex: 1,
      padding: '14px',
      overflowY: 'auto'
    }}>
      {selectedBlock ? <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 14
      }}>
        <div>
          <p style={{
            fontSize: 14,
            fontWeight: 600,
            color: fg,
            margin: '0 0 4px'
          }}>Selected</p>
          <p style={{
            fontSize: 11,
            fontWeight: 600,
            color: fg,
            margin: 0
          }}>{selectedBlock.label}</p>
          <p style={{
            fontSize: 9,
            color: muted,
            margin: '2px 0 0'
          }}>x: {selectedBlock.x.toFixed(1)}% · y: {selectedBlock.y.toFixed(1)}%</p>
          {(selectedBlock.w !== undefined || selectedBlock.h !== undefined) && <div style={{
            marginTop: 6
          }}>
            <p style={{
              fontSize: 9,
              color: muted,
              margin: '0 0 4px'
            }}>
              w: {(selectedBlock.w ?? 20).toFixed(1)}% · h: {(selectedBlock.h ?? 20).toFixed(1)}%
            </p>
            <button onClick={() => onUpdateBlock(selectedBlock.id, {
              w: undefined,
              h: undefined
            })} style={{
              fontSize: 8,
              fontWeight: 600,
              cursor: 'pointer',
              letterSpacing: '0.08em',
              background: 'transparent',
              border: `1px solid ${border}`,
              color: muted,
              padding: '2px 8px'
            }} onMouseEnter={e => {
              e.currentTarget.style.borderColor = COLOR.ochreOrange;
              e.currentTarget.style.color = COLOR.barkRust;
            }} onMouseLeave={e => {
              e.currentTarget.style.borderColor = border;
              e.currentTarget.style.color = muted;
            }}>
              Reset size
            </button>
          </div>}
        </div>
        <div style={{
          height: 1,
          background: border,
          margin: '4px 0'
        }} />
        <div>
          <p style={{
            fontSize: 9,
            fontWeight: 700,
            letterSpacing: '0.14em',
            color: COLOR.barkRust,
            textTransform: 'uppercase' as const,
            margin: '0 0 8px'
          }}>Properties</p>
          {renderEditor()}
        </div>
        <div style={{
          height: 1,
          background: border,
          margin: '4px 0'
        }} />
        <button onClick={() => onDeleteBlock(selectedBlock.id)} style={{
          padding: '7px',
          background: 'transparent',
          border: `1px solid ${COLOR.firedRed}50`,
          cursor: 'pointer',
          fontSize: 10,
          fontWeight: 600,
          color: COLOR.firedRed
        }} onMouseEnter={e => {
          e.currentTarget.style.background = `${COLOR.firedRed}15`;
        }} onMouseLeave={e => {
          e.currentTarget.style.background = 'transparent';
        }}>
          Remove Block
        </button>
      </div> : <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
        paddingTop: 8
      }}>
        <div style={{
          width: '100%',
          height: 1,
          background: border
        }} />
        {activeSlide && <div style={{
          marginBottom: 6
        }}>
          <p style={{
            fontSize: 9,
            fontWeight: 700,
            letterSpacing: '0.14em',
            color: COLOR.barkRust,
            textTransform: 'uppercase' as const,
            margin: '0 0 8px'
          }}>Slide Title</p>
          <input value={activeSlide.customTitle ?? activeSlide.title} onChange={e => onUpdateSlideTitle(activeSlide.id, e.target.value)} style={{
            width: '100%',
            fontSize: 11,
            fontWeight: 600,
            color: fg,
            background: isDark ? 'rgba(232,225,207,0.05)' : 'rgba(255,255,255,0.04)',
            border: `1px solid ${border}`,
            outline: 'none',
            padding: '5px 8px'
          }} placeholder="Slide title…" />
          <p style={{
            fontSize: 8,
            color: muted,
            margin: '4px 0 0',
            lineHeight: 1.6
          }}>Edit the title shown in the slide header and sidebar.</p>
        </div>}
        <div style={{
          width: '100%',
          height: 1,
          background: border
        }} />
        <p style={{
          fontSize: 10,
          color: muted,
          lineHeight: 1.6,
          margin: 0
        }}>Select a component on the slide to edit it.</p>
        <div style={{
          marginTop: 8
        }}>
          <p style={{
            fontSize: 9,
            fontWeight: 700,
            letterSpacing: '0.14em',
            color: muted,
            textTransform: 'uppercase' as const,
            margin: '0 0 8px'
          }}>Slide notes</p>
          <textarea placeholder="Add speaker notes…" style={{
            width: '100%',
            background: isDark ? 'rgba(232,225,207,0.04)' : 'rgba(30,26,23,0.04)',
            border: `1px solid ${border}`,
            padding: '8px 10px',
            fontSize: 9,
            color: muted,
            lineHeight: 1.6,
            resize: 'vertical',
            minHeight: 64,
            outline: 'none'
          }} />
        </div>
      </div>}
    </div>
  </div>;
};
