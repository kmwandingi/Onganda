import { useEffect, useRef, useState, type CSSProperties } from 'react';
import type { LatLngExpression, Map as LeafletMap, Marker as LeafletMarker } from 'leaflet';
import { COLOR } from './onganda-colors';
import { IconMap } from './onganda-icons';
import { PixelCornerMarks, PixelTag, WeaveOverlay, useDark } from './onganda-primitives';

export type OngandaMapPosition = readonly [latitude: number, longitude: number];
export type OngandaMapAccent = 'ochre' | 'gold' | 'rust' | 'brown' | 'plum' | 'red';
export type OngandaMapGlyph = 'signal' | 'warehouse' | 'water' | 'people' | 'action' | 'source' | 'allocation';

export interface OngandaMapPoint {
  id: string;
  position: OngandaMapPosition;
  label: string;
  eyebrow?: string;
  description?: string;
  accent?: OngandaMapAccent;
  glyph?: OngandaMapGlyph;
}

export interface OngandaMapRoute {
  id: string;
  positions: readonly OngandaMapPosition[];
  label?: string;
  accent?: OngandaMapAccent;
}

export interface OngandaMapArea {
  id: string;
  label: string;
  polygons: readonly (readonly (readonly OngandaMapPosition[])[])[];
  eyebrow?: string;
  description?: string;
  accent?: OngandaMapAccent;
  fillOpacity?: number;
}

export interface OngandaMapProps {
  center?: OngandaMapPosition;
  zoom?: number;
  points?: readonly OngandaMapPoint[];
  routes?: readonly OngandaMapRoute[];
  areas?: readonly OngandaMapArea[];
  height?: CSSProperties['height'];
  title?: string;
  label?: string;
  description?: string;
  ariaLabel?: string;
  tileUrl?: string | null;
  attribution?: string;
  showLegend?: boolean;
  fitBounds?: boolean;
  className?: string;
  onPointSelect?: (point: OngandaMapPoint) => void;
  onAreaSelect?: (area: OngandaMapArea) => void;
}

const ACCENT_COLOR: Record<OngandaMapAccent, string> = {
  ochre: COLOR.ochreOrange,
  gold: COLOR.mahanguGold,
  rust: COLOR.barkRust,
  brown: COLOR.mopaneBrown,
  plum: COLOR.dyePlum,
  red: COLOR.firedRed,
};

const DEFAULT_CENTER: OngandaMapPosition = [-22.1, 17.1];
const DEFAULT_TILE_URL = 'https://tile.openstreetmap.org/{z}/{x}/{y}.png';
const DEFAULT_ATTRIBUTION = '&copy; OpenStreetMap contributors';
const EMPTY_POINTS: readonly OngandaMapPoint[] = [];
const EMPTY_ROUTES: readonly OngandaMapRoute[] = [];
const EMPTY_AREAS: readonly OngandaMapArea[] = [];

const MAP_STYLES = `
  .onganda-map-shell .leaflet-container {
    background: ${COLOR.dustLight};
    color: ${COLOR.charBlack};
    font-family: Inter, Arial, sans-serif;
  }
  .onganda-map-shell[data-theme='dark'] .leaflet-container {
    background: ${COLOR.darkCardAlt};
    color: ${COLOR.milletClay};
  }
  .onganda-map-shell .leaflet-tile-pane {
    filter: sepia(.28) saturate(.72) contrast(.9) brightness(1.06);
  }
  .onganda-map-shell[data-theme='dark'] .leaflet-tile-pane {
    filter: grayscale(.35) sepia(.35) saturate(.55) brightness(.58) contrast(1.25);
  }
  .onganda-map-shell .leaflet-control-zoom,
  .onganda-map-shell .leaflet-control-attribution,
  .onganda-map-shell .leaflet-popup-content-wrapper,
  .onganda-map-shell .leaflet-popup-tip {
    border-radius: 0;
    box-shadow: none;
  }
  .onganda-map-shell .leaflet-control-zoom {
    border: 1px solid rgba(30, 26, 23, 0.25);
    margin: 16px 16px 0 0;
  }
  .onganda-map-shell[data-theme='dark'] .leaflet-control-zoom {
    border-color: rgba(232, 225, 207, 0.25);
  }
  .onganda-map-shell .leaflet-control-zoom a {
    width: 34px;
    height: 34px;
    border: 0;
    border-bottom: 1px solid rgba(30, 26, 23, .14);
    border-radius: 0 !important;
    background: ${COLOR.milletClay};
    color: ${COLOR.charBlack};
    font: 600 18px/34px Inter, Arial, sans-serif;
  }
  .onganda-map-shell[data-theme='dark'] .leaflet-control-zoom a {
    border-color: rgba(232, 225, 207, 0.1);
    background: ${COLOR.darkCard};
    color: ${COLOR.milletClay};
  }
  .onganda-map-shell .leaflet-control-zoom a:hover,
  .onganda-map-shell .leaflet-control-zoom a:focus-visible {
    background: ${COLOR.ochreOrange};
    color: ${COLOR.dustLight};
  }
  .onganda-map-shell .leaflet-control-attribution {
    padding: 3px 6px;
    background: rgba(243, 232, 195, .88);
    color: ${COLOR.mopaneBrown};
    font-size: 9px;
    letter-spacing: .02em;
  }
  .onganda-map-shell[data-theme='dark'] .leaflet-control-attribution {
    background: rgba(18, 15, 13, .86);
    color: ${COLOR.milletClay};
  }
  .onganda-map-shell .leaflet-control-attribution a {
    color: inherit;
    text-decoration: underline;
    text-underline-offset: 2px;
  }
  .onganda-map-shell .onganda-map-marker-host {
    border: 0;
    background: transparent;
  }
  .onganda-map-shell .onganda-map-marker-host:focus-visible {
    outline: 3px solid ${COLOR.charBlack};
    outline-offset: 4px;
  }
  .onganda-map-shell .onganda-map-area:focus-visible {
    outline: 3px solid ${COLOR.charBlack};
    outline-offset: 2px;
    stroke-width: 3px;
  }
  .onganda-map-shell[data-theme='dark'] .onganda-map-marker-host:focus-visible {
    outline-color: ${COLOR.milletClay};
  }
  .onganda-map-shell .onganda-map-marker-shape {
    position: relative;
    display: block;
    width: 30px;
    height: 30px;
    border: 4px solid ${COLOR.dustLight};
    background: var(--onganda-map-accent);
    box-shadow: 4px 4px 0 rgba(30, 26, 23, .42);
    transition: transform 140ms ease, box-shadow 140ms ease;
  }
  .onganda-map-shell .onganda-map-marker-shape::before,
  .onganda-map-shell .onganda-map-marker-shape::after {
    display: none;
  }
  .onganda-map-shell .onganda-map-marker-pixels {
    position: absolute;
    inset: 3px;
    display: grid;
    grid-template-columns: repeat(5, 3px);
    grid-auto-rows: 3px;
    place-content: center;
  }
  .onganda-map-shell .onganda-map-marker-pixel {
    width: 3px;
    height: 3px;
    background: ${COLOR.charBlack};
  }
  .onganda-map-shell .onganda-map-marker-host:hover .onganda-map-marker-shape,
  .onganda-map-shell .onganda-map-marker-host:focus-visible .onganda-map-marker-shape {
    transform: translateY(-3px);
    box-shadow: 4px 7px 0 rgba(30, 26, 23, .34);
  }
  .onganda-map-shell .leaflet-popup-content-wrapper {
    border: 1px solid rgba(30, 26, 23, 0.2);
    background: ${COLOR.dustLight};
    color: ${COLOR.charBlack};
  }
  .onganda-map-shell[data-theme='dark'] .leaflet-popup-content-wrapper {
    border-color: rgba(232, 225, 207, 0.2);
    background: ${COLOR.darkCard};
    color: ${COLOR.milletClay};
  }
  .onganda-map-shell .leaflet-popup-tip {
    background: ${COLOR.dustLight};
  }
  .onganda-map-shell[data-theme='dark'] .leaflet-popup-tip {
    background: ${COLOR.darkCard};
  }
  .onganda-map-shell .leaflet-popup-content {
    width: 210px !important;
    margin: 16px;
    line-height: 1.45;
  }
  .onganda-map-shell .onganda-map-popup-eyebrow {
    margin-bottom: 6px;
    color: ${COLOR.barkRust};
    font-size: 9px;
    font-weight: 700;
    letter-spacing: .15em;
    text-transform: uppercase;
  }
  .onganda-map-shell[data-theme='dark'] .onganda-map-popup-eyebrow {
    color: ${COLOR.mahanguGold};
  }
  .onganda-map-shell .onganda-map-popup-title {
    display: block;
    margin-bottom: 5px;
    font-size: 15px;
    letter-spacing: -.01em;
  }
  .onganda-map-shell .onganda-map-popup-description {
    margin: 0;
    color: ${COLOR.mopaneBrown};
    font-size: 12px;
  }
  .onganda-map-shell[data-theme='dark'] .onganda-map-popup-description {
    color: rgba(232, 225, 207, .65);
  }
  .onganda-map-shell .onganda-map-canvas:focus-visible {
    outline: 3px solid ${COLOR.ochreOrange};
    outline-offset: -3px;
  }
  @media (prefers-reduced-motion: reduce) {
    .onganda-map-shell .onganda-map-marker-shape {
      transition: none;
    }
  }
`;

const GLYPH_PIXELS: Record<OngandaMapGlyph, readonly string[]> = {
  signal: ['00100', '01110', '11111', '01110', '00100'],
  warehouse: ['00100', '01110', '11111', '10101', '11111'],
  water: ['00100', '01110', '01110', '11111', '01110'],
  people: ['01010', '01010', '11111', '10101', '10101'],
  action: ['00100', '00100', '00100', '00000', '00100'],
  source: ['11110', '10000', '11110', '10000', '11110'],
  allocation: ['00100', '00010', '11111', '00010', '00100'],
};

const makeMarkerElement = (accent: OngandaMapAccent, glyph: OngandaMapGlyph) => {
  const marker = document.createElement('span');
  marker.className = 'onganda-map-marker-shape';
  marker.style.setProperty('--onganda-map-accent', ACCENT_COLOR[accent]);
  marker.dataset.glyph = glyph;
  const pixels = document.createElement('span');
  pixels.className = 'onganda-map-marker-pixels';
  GLYPH_PIXELS[glyph].join('').split('').forEach(value => {
    const pixel = document.createElement('span');
    if (value === '1') pixel.className = 'onganda-map-marker-pixel';
    pixels.append(pixel);
  });
  marker.append(pixels);
  marker.setAttribute('aria-hidden', 'true');
  return marker;
};

const makePopupElement = (point: Pick<OngandaMapPoint, 'label' | 'eyebrow' | 'description'>) => {
  const popup = document.createElement('div');

  if (point.eyebrow) {
    const eyebrow = document.createElement('div');
    eyebrow.className = 'onganda-map-popup-eyebrow';
    eyebrow.textContent = point.eyebrow;
    popup.append(eyebrow);
  }

  const title = document.createElement('strong');
  title.className = 'onganda-map-popup-title';
  title.textContent = point.label;
  popup.append(title);

  if (point.description) {
    const description = document.createElement('p');
    description.className = 'onganda-map-popup-description';
    description.textContent = point.description;
    popup.append(description);
  }

  return popup;
};

export const OngandaMap = ({
  center = DEFAULT_CENTER,
  zoom = 5,
  points = EMPTY_POINTS,
  routes = EMPTY_ROUTES,
  areas = EMPTY_AREAS,
  height = 'clamp(360px, 58vw, 560px)',
  title = 'Spatial intelligence',
  label = 'Geospatial surface',
  description = 'Explore place-based signals through the Onganda visual language.',
  ariaLabel = 'Interactive map',
  tileUrl = DEFAULT_TILE_URL,
  attribution = DEFAULT_ATTRIBUTION,
  showLegend = true,
  fitBounds = true,
  className = '',
  onPointSelect,
  onAreaSelect,
}: OngandaMapProps) => {
  const { isDark } = useDark();
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<LeafletMap | null>(null);
  const markerRefs = useRef(new Map<string, LeafletMarker>());
  const onPointSelectRef = useRef(onPointSelect);
  const onAreaSelectRef = useRef(onAreaSelect);
  const reducedMotionRef = useRef(false);
  const [activePointId, setActivePointId] = useState<string | null>(null);
  const [mapState, setMapState] = useState<'loading' | 'ready' | 'error'>('loading');

  useEffect(() => {
    onPointSelectRef.current = onPointSelect;
  }, [onPointSelect]);

  useEffect(() => {
    onAreaSelectRef.current = onAreaSelect;
  }, [onAreaSelect]);

  useEffect(() => {
    let disposed = false;
    let map: LeafletMap | null = null;
    const container = containerRef.current;
    const markers = markerRefs.current;

    if (!container) return;

    setMapState('loading');
    reducedMotionRef.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    void import('leaflet')
      .then(L => {
        if (disposed) return;

        map = L.map(container, {
          center: [center[0], center[1]],
          zoom,
          zoomControl: false,
          scrollWheelZoom: false,
          keyboard: true,
          zoomAnimation: !reducedMotionRef.current,
          fadeAnimation: !reducedMotionRef.current,
          markerZoomAnimation: !reducedMotionRef.current,
        });
        mapRef.current = map;
        map.attributionControl.setPrefix('Leaflet');
        L.control.zoom({ position: 'topright' }).addTo(map);

        if (tileUrl) {
          L.tileLayer(tileUrl, {
            attribution,
            minZoom: 3,
            maxZoom: 19,
            crossOrigin: true,
          }).addTo(map);
        }

        const areaLayers = areas.map(area => {
          const positions = area.polygons.map(polygon => polygon.map(ring => ring.map(position => [position[0], position[1]]))) as LatLngExpression[][][];
          const layer = L.polygon(
            positions,
            {
              className: 'onganda-map-area',
              color: ACCENT_COLOR[area.accent ?? 'brown'],
              weight: 1.5,
              opacity: isDark ? .82 : .72,
              fillColor: ACCENT_COLOR[area.accent ?? 'brown'],
              fillOpacity: area.fillOpacity ?? (isDark ? .2 : .14),
              lineCap: 'square',
              lineJoin: 'miter',
            }
          ).addTo(map!);
          layer.bindPopup(makePopupElement(area), { closeButton: false });
          layer.on('click', () => {
            setActivePointId(area.id);
            onAreaSelectRef.current?.(area);
          });
          const element = layer.getElement();
          element?.setAttribute('role', 'button');
          element?.setAttribute('tabindex', '0');
          element?.setAttribute('aria-label', `Show ${area.label}`);
          element?.addEventListener('keydown', event => {
            const key = (event as KeyboardEvent).key;
            if (key !== 'Enter' && key !== ' ') return;
            event.preventDefault();
            layer.openPopup();
            setActivePointId(area.id);
            onAreaSelectRef.current?.(area);
          });
          return layer;
        });

        routes.forEach(route => {
          if (route.positions.length < 2) return;
          L.polyline(
            route.positions.map(position => [position[0], position[1]]),
            {
              color: ACCENT_COLOR[route.accent ?? 'brown'],
              weight: 3,
              opacity: isDark ? 0.72 : 0.58,
              dashArray: '7 9',
              lineCap: 'square',
              lineJoin: 'miter',
              interactive: false,
            }
          ).addTo(map!);
        });

        markers.clear();
        points.forEach(point => {
          const icon = L.divIcon({
            className: 'onganda-map-marker-host',
            html: makeMarkerElement(point.accent ?? 'ochre', point.glyph ?? 'signal'),
            iconSize: [30, 30],
            iconAnchor: [15, 15],
            popupAnchor: [0, -18],
          });
          const marker = L.marker([point.position[0], point.position[1]], {
            icon,
            keyboard: true,
            title: point.label,
            alt: point.label,
            riseOnHover: true,
            autoPanOnFocus: true,
          }).addTo(map!);

          marker.bindPopup(makePopupElement(point), {
            closeButton: false,
            offset: [0, -2],
          });
          marker.on('click', () => {
            setActivePointId(point.id);
            onPointSelectRef.current?.(point);
          });
          const element = marker.getElement();
          element?.setAttribute('role', 'button');
          element?.setAttribute('aria-label', `Show ${point.label}`);
          markers.set(point.id, marker);
        });

        if (fitBounds && areaLayers.length > 0) {
          const bounds = L.featureGroup(areaLayers).getBounds();
          if (bounds.isValid()) map.fitBounds(bounds, { padding: [44, 44], animate: false });
        } else if (fitBounds && points.length > 1) {
          map.fitBounds(
            L.latLngBounds(points.map(point => [point.position[0], point.position[1]])),
            { padding: [44, 44], animate: false }
          );
        }

        requestAnimationFrame(() => map?.invalidateSize(false));
        setMapState('ready');
      })
      .catch(() => {
        if (!disposed) setMapState('error');
      });

    return () => {
      disposed = true;
      markers.clear();
      if (mapRef.current === map) mapRef.current = null;
      map?.remove();
    };
  }, [areas, attribution, center, fitBounds, isDark, points, routes, tileUrl, zoom]);

  const selectPoint = (point: OngandaMapPoint) => {
    const map = mapRef.current;
    const marker = markerRefs.current.get(point.id);
    if (!map || !marker) return;

    map.setView([point.position[0], point.position[1]], Math.max(map.getZoom(), 7), {
      animate: !reducedMotionRef.current,
    });
    map.closePopup();
    marker.openPopup();
    setActivePointId(point.id);
    onPointSelectRef.current?.(point);
  };

  const status =
    mapState === 'loading'
      ? 'Loading map'
      : mapState === 'ready'
        ? `${areas.length || points.length} ${areas.length ? 'areas' : points.length === 1 ? 'signal' : 'signals'} mapped`
        : 'Map unavailable';

  return (
    <section
      className={`onganda-map-shell relative overflow-hidden border ${className}`.trim()}
      data-onganda-map
      data-theme={isDark ? 'dark' : 'light'}
      style={{
        borderColor: isDark ? 'rgba(232,225,207,0.1)' : 'rgba(30,26,23,0.14)',
        background: isDark ? COLOR.darkCard : COLOR.dustLight,
        color: isDark ? COLOR.milletClay : COLOR.charBlack,
      }}
    >
      <style>{MAP_STYLES}</style>
      <WeaveOverlay isDark={isDark} opacity={0.026} />
      <PixelCornerMarks hex={COLOR.ochreOrange} size={8} />

      <header className="relative grid gap-5 p-6 md:grid-cols-[1fr_auto] md:items-end md:p-8">
        <div className="flex items-start gap-4">
          <div
            className="flex h-12 w-12 shrink-0 items-center justify-center"
            style={{ background: COLOR.ochreOrange, color: COLOR.dustLight }}
            aria-hidden="true"
          >
            <IconMap size={24} color={COLOR.dustLight} />
          </div>
          <div>
            <div className="flex">
              <PixelTag hex={COLOR.mahanguGold} label={label} />
            </div>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight md:text-3xl">{title}</h2>
            <p
              className="mt-2 max-w-2xl text-sm leading-relaxed md:text-base"
              style={{ color: isDark ? 'rgba(232,225,207,0.65)' : 'rgba(30,26,23,0.66)' }}
            >
              {description}
            </p>
          </div>
        </div>
        <p
          aria-live="polite"
          className="text-[10px] font-bold uppercase tracking-[0.15em]"
          data-map-state={mapState}
          style={{ color: isDark ? 'rgba(232,225,207,0.55)' : 'rgba(30,26,23,0.66)' }}
        >
          {status}
        </p>
      </header>

      <div
        className="relative border-y"
        style={{ borderColor: isDark ? 'rgba(232,225,207,0.1)' : 'rgba(30,26,23,0.14)' }}
      >
        <div
          ref={containerRef}
          className="onganda-map-canvas w-full"
          data-onganda-map-canvas
          role="region"
          aria-label={ariaLabel}
          tabIndex={0}
          style={{ height }}
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute bottom-4 left-4 z-[500] flex items-end gap-1"
        >
          {[18, 10, 26, 14, 34].map((barHeight, index) => (
            <span
              key={barHeight}
              style={{
                width: 3,
                height: barHeight,
                background: index === 4 ? COLOR.ochreOrange : COLOR.charBlack,
                opacity: index === 4 ? 0.9 : isDark ? 0.42 : 0.58,
              }}
            />
          ))}
        </div>
      </div>

      {showLegend && points.length > 0 && (
        <div
          className="relative grid gap-px sm:grid-cols-2 lg:grid-cols-3"
          data-onganda-map-legend
          style={{ background: isDark ? 'rgba(232,225,207,0.12)' : 'rgba(30,26,23,0.12)' }}
        >
          {points.map((point, index) => {
            const active = activePointId === point.id;
            return (
              <button
                key={point.id}
                type="button"
                className="group flex min-h-16 items-center gap-3 px-5 py-4 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px]"
                data-onganda-map-point={point.id}
                aria-pressed={active}
                onClick={() => selectPoint(point)}
                style={{
                  background: active
                    ? isDark
                      ? COLOR.darkCardAlt
                      : COLOR.milletClay
                    : isDark
                      ? COLOR.darkCard
                      : COLOR.dustLight,
                  outlineColor: COLOR.ochreOrange,
                }}
              >
                <span
                  aria-hidden="true"
                  className="h-3 w-3 shrink-0"
                  style={{ background: ACCENT_COLOR[point.accent ?? 'ochre'] }}
                />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-semibold">{point.label}</span>
                  {point.eyebrow && (
                    <span
                      className="mt-0.5 block truncate text-[9px] font-bold uppercase tracking-[0.13em]"
                      style={{ color: isDark ? 'rgba(232,225,207,0.55)' : 'rgba(30,26,23,0.66)' }}
                    >
                      {point.eyebrow}
                    </span>
                  )}
                </span>
                <span
                  aria-hidden="true"
                  className="text-[10px] font-bold tabular-nums"
                  style={{ color: isDark ? 'rgba(232,225,207,0.55)' : 'rgba(30,26,23,0.66)' }}
                >
                  {String(index + 1).padStart(2, '0')}
                </span>
              </button>
            );
          })}
        </div>
      )}
    </section>
  );
};
