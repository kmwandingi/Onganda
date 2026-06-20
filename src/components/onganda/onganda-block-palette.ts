// ─── Onganda Block Palette — Insert & Component Catalogue ─────────────────────
// Central registry of insertable block entries for both editors.
// Document editor imports DOC_INSERT_PALETTE; slide editor imports SLIDE_COMPONENT_PALETTE.

import { COLOR } from './onganda-colors';
import type { InsertPaletteItem, ComponentPaletteItem } from './onganda-block-types';

const CURRENT_YEAR = new Date().getFullYear();
const AUTHOR_NAME = 'Kenneth Mwandingi';

// ─── Document editor insert palette ──────────────────────────────────────────
export const DOC_INSERT_PALETTE: InsertPaletteItem[] = [
  { id: 'insert-heading',    label: 'Section Heading',  desc: 'Named section with dashed rule',          type: 'heading',      defaultContent: 'New Section',              hex: COLOR.ochreOrange, category: 'Text'   },
  { id: 'insert-body',       label: 'Body Paragraph',   desc: 'Editorial body text in Georgia',          type: 'body',         defaultContent: 'Start writing here…',  hex: COLOR.charBlack,  category: 'Text'   },
  { id: 'insert-pullquote',  label: 'Pull Quote',       desc: 'Highlighted branded quotation',           type: 'pullquote',    defaultContent: 'Build domestic AI capability first.', hex: COLOR.ochreOrange, category: 'Text' },
  { id: 'insert-callout',    label: 'Callout Box',      desc: 'Accented info or note block',             type: 'callout',      defaultContent: 'Note: Key finding.',       hex: COLOR.firedRed,   category: 'Text'   },
  { id: 'insert-list',       label: 'Bullet List',      desc: 'Pixel-dot list items',                    type: 'list',         defaultContent: 'First item · Second item · Third item', hex: COLOR.ochreOrange, category: 'Text' },
  { id: 'insert-divider',    label: 'Section Divider',  desc: 'Dither bar visual separator',             type: 'divider',      defaultContent: '',                         hex: COLOR.ochreOrange, category: 'Text'   },
  { id: 'insert-spacer',     label: 'Spacer',           desc: 'Adjustable blank space for page layout',   type: 'spacer',       defaultContent: 'Spacer',                   hex: COLOR.mahanguGold, category: 'Text'   },
  { id: 'insert-letterhead', label: 'Letterhead',       desc: 'Document title header with branding',     type: 'letterhead',   defaultContent: 'Letterhead',               hex: COLOR.ochreOrange, category: 'Text' },
  { id: 'insert-signature',  label: 'Signature Block',  desc: 'Author attribution footer',               type: 'signature',    defaultContent: `Prepared by ${AUTHOR_NAME} · ${CURRENT_YEAR}`, hex: COLOR.mopaneBrown, category: 'Text' },
  { id: 'insert-sources',    label: 'Sources',          desc: 'Editable references and citation links',   type: 'sources',      defaultContent: 'Sources',                  hex: COLOR.mopaneBrown, category: 'Text'   },
  { id: 'insert-stat',       label: 'Stat Card',        desc: 'Editable KPI / metric card',              type: 'stat',         defaultContent: 'New Metric',               hex: COLOR.ochreOrange, category: 'Data'   },
  { id: 'insert-chart-market', label: 'Market Chart',   desc: 'AI market growth area chart',             type: 'chart-market', defaultContent: 'Market Growth',            hex: COLOR.ochreOrange, category: 'Data'   },
  { id: 'insert-chart-bar',  label: 'Bar Chart',        desc: 'System progress bar chart',               type: 'chart-bar',    defaultContent: 'System Progress',          hex: COLOR.barkRust,   category: 'Data'   },
  { id: 'insert-chart-gallery', label: 'Chart Gallery', desc: 'Reusable design-system chart set',        type: 'chart-gallery',defaultContent: 'Design System Charts',     hex: COLOR.dyePlum,    category: 'Data'   },
  { id: 'insert-heatmap',    label: 'Research Heatmap', desc: 'Activity heatmap across systems',         type: 'heatmap',      defaultContent: 'Research Activity',        hex: COLOR.firedRed,   category: 'Data'   },
  { id: 'insert-terminal',   label: 'Code Terminal',    desc: 'Syntax-highlighted terminal block',       type: 'terminal',     defaultContent: 'Oshini Pipeline',          hex: COLOR.barkRust,   category: 'System' },
  { id: 'insert-timeline',   label: 'Roadmap Phase',    desc: 'Single roadmap timeline phase',           type: 'timeline',     defaultContent: 'Foundation Phase',         hex: COLOR.ochreOrange, category: 'System' },
  { id: 'insert-systemcard', label: 'System Card',      desc: 'One of the five named systems',           type: 'systemcard',   defaultContent: 'Okaanda',                  hex: COLOR.ochreOrange, category: 'System' },
  { id: 'insert-flowchart',  label: 'Flow Node',        desc: 'Pixel flowchart node card',               type: 'flowchart',    defaultContent: 'Granary',                  hex: COLOR.ochreOrange, category: 'System' },
  { id: 'insert-principles', label: 'Principles Table', desc: 'Brand principles definition list',        type: 'principles',   defaultContent: 'Brand Principles',         hex: COLOR.charBlack,  category: 'System' },
  { id: 'insert-swatchrow',  label: 'Swatch Row',       desc: 'Material colour palette strip',           type: 'swatchrow',    defaultContent: 'Material Palette',         hex: COLOR.mahanguGold, category: 'System' },
];
export const DOC_PALETTE_CATEGORIES: string[] = ['Text', 'Data', 'System'];

// ─── Slide editor component palette ──────────────────────────────────────────
export const SLIDE_COMPONENT_PALETTE: ComponentPaletteItem[] = [
  { id: 'icon-okaanda',    category: 'Icons',    label: 'Okaanda Icon',        desc: 'Granary system icon',              hex: COLOR.ochreOrange },
  { id: 'icon-oshini',     category: 'Icons',    label: 'Oshini Icon',         desc: 'Mill system icon',                 hex: COLOR.barkRust    },
  { id: 'icon-ombiga',     category: 'Icons',    label: 'Ombiga Icon',         desc: 'Vessel system icon',               hex: COLOR.mahanguGold },
  { id: 'icon-etiti',      category: 'Icons',    label: 'Etiti Icon',          desc: 'Surface system icon',              hex: COLOR.mopaneBrown },
  { id: 'icon-oshitoo',    category: 'Icons',    label: 'Oshitoo Icon',        desc: 'Delivery system icon',             hex: COLOR.dyePlum     },
  { id: 'stat-systems',    category: 'Stats',    label: 'Stat: 5 Systems',     desc: 'Active systems count',             hex: COLOR.ochreOrange },
  { id: 'stat-models',     category: 'Stats',    label: 'Stat: 3 Models',      desc: 'Adapted language models',          hex: COLOR.barkRust    },
  { id: 'stat-pilots',     category: 'Stats',    label: 'Stat: 12 Pilots',     desc: 'Sector pilots running',            hex: COLOR.mahanguGold },
  { id: 'stat-lab',        category: 'Stats',    label: 'Stat: 1 Lab',         desc: 'Sovereign lab location',           hex: COLOR.mopaneBrown },
  { id: 'stat-custom',     category: 'Stats',    label: 'Custom Stat',         desc: 'Editable KPI number',              hex: COLOR.dyePlum     },
  { id: 'chart-market',    category: 'Charts',   label: 'Market Growth Chart', desc: 'AI market area chart (2023–2033)', hex: COLOR.ochreOrange },
  { id: 'chart-progress',  category: 'Charts',   label: 'System Progress',     desc: 'Bar chart of system build progress', hex: COLOR.barkRust  },
  { id: 'chart-heatmap',   category: 'Charts',   label: 'Research Heatmap',    desc: 'Activity heatmap across systems',  hex: COLOR.firedRed    },
  { id: 'chart-radar',     category: 'Charts',   label: 'Capability Radar',    desc: 'Radar chart of AI capabilities',   hex: COLOR.dyePlum     },
  { id: 'chart-timeline',  category: 'Charts',   label: 'Phase Progress',      desc: 'Roadmap phase mini-bar',           hex: COLOR.mopaneBrown },
  { id: 'text-headline',   category: 'Text',     label: 'Headline',            desc: 'Large section heading',            hex: COLOR.charBlack   },
  { id: 'text-body',       category: 'Text',     label: 'Body Text',           desc: 'Paragraph text block',             hex: COLOR.charBlack   },
  { id: 'text-quote',      category: 'Text',     label: 'Pull Quote',          desc: 'Highlighted quotation',            hex: COLOR.ochreOrange },
  { id: 'text-label',      category: 'Text',     label: 'Pixel Label',         desc: 'Small uppercase label',            hex: COLOR.ochreOrange },
  { id: 'sys-card-0',      category: 'Systems',  label: 'Okaanda Card',        desc: 'Granary system card',              hex: COLOR.ochreOrange },
  { id: 'sys-card-1',      category: 'Systems',  label: 'Oshini Card',         desc: 'Mill system card',                 hex: COLOR.barkRust    },
  { id: 'sys-card-2',      category: 'Systems',  label: 'Ombiga Card',         desc: 'Vessel system card',               hex: COLOR.mahanguGold },
  { id: 'sys-card-3',      category: 'Systems',  label: 'Etiti Card',          desc: 'Surface system card',              hex: COLOR.mopaneBrown },
  { id: 'sys-card-4',      category: 'Systems',  label: 'Oshitoo Card',        desc: 'Delivery system card',             hex: COLOR.dyePlum     },
  { id: 'flow-node-0',     category: 'Systems',  label: 'Flow: Root',          desc: 'Root org node',                    hex: COLOR.ochreOrange },
  { id: 'flow-node-1',     category: 'Systems',  label: 'Flow: Granary',       desc: 'Data platform node',               hex: COLOR.ochreOrange },
  { id: 'flow-node-2',     category: 'Systems',  label: 'Flow: Mill',          desc: 'Adaptation node',                  hex: COLOR.barkRust    },
  { id: 'flow-node-3',     category: 'Systems',  label: 'Flow: Vessel',        desc: 'Container node',                   hex: COLOR.mahanguGold },
  { id: 'flow-node-4',     category: 'Systems',  label: 'Flow: Surface',       desc: 'Interface node',                   hex: COLOR.mopaneBrown },
  { id: 'flow-node-5',     category: 'Systems',  label: 'Flow: Delivery',      desc: 'Deployment node',                  hex: COLOR.dyePlum     },
  { id: 'timeline-0',      category: 'Timeline', label: 'Phase: Foundation',   desc: 'P–01 roadmap card',           hex: COLOR.ochreOrange },
  { id: 'timeline-1',      category: 'Timeline', label: 'Phase: Adaptation',   desc: 'P–02 roadmap card',           hex: COLOR.barkRust    },
  { id: 'timeline-2',      category: 'Timeline', label: 'Phase: Containment',  desc: 'P–03 roadmap card',           hex: COLOR.mahanguGold },
  { id: 'timeline-3',      category: 'Timeline', label: 'Phase: Surface',      desc: 'P–04 roadmap card',           hex: COLOR.mopaneBrown },
  { id: 'timeline-4',      category: 'Timeline', label: 'Phase: Delivery',     desc: 'P–05 roadmap card',           hex: COLOR.dyePlum     },
  { id: 'field-0',         category: 'Field',    label: 'OshitooHealth',       desc: 'Healthcare application',           hex: COLOR.dyePlum     },
  { id: 'field-1',         category: 'Field',    label: 'OshiniAgro',          desc: 'Agriculture application',          hex: COLOR.barkRust    },
  { id: 'field-2',         category: 'Field',    label: 'OkaandaEdu',          desc: 'Education application',            hex: COLOR.ochreOrange },
  { id: 'field-3',         category: 'Field',    label: 'EtitiGov',            desc: 'Public sector application',        hex: COLOR.mopaneBrown },
  { id: 'swatch-row',      category: 'Brand',    label: 'Swatch Row',          desc: 'Brand colour palette',             hex: COLOR.ochreOrange },
  { id: 'badge-okaanda',   category: 'Brand',    label: 'Badge: Okaanda',      desc: 'System name badge',                hex: COLOR.ochreOrange },
  { id: 'badge-oshini',    category: 'Brand',    label: 'Badge: Oshini',       desc: 'System name badge',                hex: COLOR.barkRust    },
  { id: 'divider-dither',  category: 'Brand',    label: 'Dither Divider',      desc: 'Pixel dither accent bar',          hex: COLOR.ochreOrange },
  { id: 'divider-dot',     category: 'Brand',    label: 'Dot Row',             desc: 'Pixel dot accent row',             hex: COLOR.ochreOrange },
  { id: 'terminal-0',      category: 'Brand',    label: 'Terminal: Oshini',    desc: 'Fine-tune pipeline code',          hex: COLOR.barkRust    },
  { id: 'terminal-1',      category: 'Brand',    label: 'Terminal: Okaanda',   desc: 'Granary query code',               hex: COLOR.ochreOrange },
];
export const SLIDE_PALETTE_CATEGORIES: string[] = ['Icons', 'Stats', 'Charts', 'Text', 'Systems', 'Timeline', 'Field', 'Brand'];
