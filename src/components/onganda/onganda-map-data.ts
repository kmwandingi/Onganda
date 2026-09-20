import type { OngandaMapPoint, OngandaMapRoute } from './onganda-maps';

export const NAMIBIA_MAP_POINTS = [
  {
    id: 'windhoek',
    position: [-22.5609, 17.0658],
    label: 'Windhoek',
    eyebrow: 'Coordination',
    description: 'Illustrative national research and delivery signal.',
    accent: 'ochre',
  },
  {
    id: 'oshakati',
    position: [-17.7883, 15.7044],
    label: 'Oshakati',
    eyebrow: 'Language systems',
    description: 'Illustrative northern data and language signal.',
    accent: 'gold',
  },
  {
    id: 'rundu',
    position: [-17.9253, 19.7532],
    label: 'Rundu',
    eyebrow: 'Field delivery',
    description: 'Illustrative Kavango deployment signal.',
    accent: 'plum',
  },
  {
    id: 'walvis-bay',
    position: [-22.9576, 14.5053],
    label: 'Walvis Bay',
    eyebrow: 'Logistics',
    description: 'Illustrative port and operations signal.',
    accent: 'red',
  },
  {
    id: 'keetmanshoop',
    position: [-26.5738, 18.1298],
    label: 'Keetmanshoop',
    eyebrow: 'Climate systems',
    description: 'Illustrative southern climate and field signal.',
    accent: 'rust',
  },
] as const satisfies readonly OngandaMapPoint[];

export const NAMIBIA_MAP_ROUTES = [
  {
    id: 'north-network',
    positions: [
      [-22.5609, 17.0658],
      [-17.7883, 15.7044],
      [-17.9253, 19.7532],
    ],
    label: 'Northern network',
    accent: 'ochre',
  },
  {
    id: 'south-west-network',
    positions: [
      [-22.9576, 14.5053],
      [-22.5609, 17.0658],
      [-26.5738, 18.1298],
    ],
    label: 'South-west network',
    accent: 'brown',
  },
] as const satisfies readonly OngandaMapRoute[];
