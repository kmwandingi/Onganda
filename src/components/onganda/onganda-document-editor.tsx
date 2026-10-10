// ─── Onganda Document Editor — Full Editing Shell ─────────────────────────────
// Block-based document editor: click any block to select, drag to reorder,
// double-click text to edit inline. All design-system components insertable,
// configurable, deletable. "New Document" = blank canvas, templates pre-filled.

import React, { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import { FONT } from './onganda-type';
import { motion, AnimatePresence } from 'framer-motion';
import { COLOR, EDITOR_SURFACE, PALETTE, PRINCIPLES, SWATCHES, statusFor, onColor, inkOn, contrast, STATS, TERMINAL_BLOCKS, TIMELINE_PHASES, SYSTEMS, HEATMAP_CELLS, HEATMAP_LABELS_X, HEATMAP_LABELS_Y, FLOW_NODES, paperAlpha, inkAlpha } from './onganda-tokens';
import { OngandaLogoMark, PixelDot, DitherBar, PixelTag, WeaveOverlay, useDark, IconOkaanda, IconOshini, IconOmbiga, IconEtiti, IconOshitoo, FlowNodeIcon } from './onganda-primitives';
import { ChartGallery } from './onganda-charts';
import { AiAuthoringPanel, regenerateDocBlock } from './onganda-ai-authoring';
import { DocBlockType, DocBlock, InsertPaletteItem, AiAuthoringResult } from './onganda-block-types';
import { DOC_INSERT_PALETTE, DOC_PALETTE_CATEGORIES } from './onganda-block-palette';
import type { DocumentExportPayload } from './onganda-export-api';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { followPalette } from './onganda-colors';


const docBlockFromAi = (block: NonNullable<AiAuthoringResult['blocks']>[number], idx: number): DocBlock => ({
  id: `ai-doc-${Date.now()}-${idx}-${Math.random().toString(36).slice(2, 6)}`,
  type: block.type,
  content: block.content,
  statHex: block.type === 'callout' ? COLOR.ochreOrange : undefined
});

const safeFileName = (name: string) => (name.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '').slice(0, 84).replace(/-$/g, '') || 'onganda-document');
const CURRENT_YEAR = new Date().getFullYear();
const AUTHOR_NAME = 'Kenneth Mwandingi';
const DOCUMENT_STATUS = 'Confidential draft';
const COPYRIGHT_NOTICE = `© ${CURRENT_YEAR} Onganda · Namibia AI Systems Lab. All rights reserved.`;
const DOCUMENT_BYLINE = `Prepared by ${AUTHOR_NAME}`;
const A4_PAGE_HEIGHT_MM = 297;
const A4_PAGE_HEIGHT_PX = 1122.52;
const PAGE_BREAK_PREVIEW_TOP_PX = 44;
const PAPER_BACKGROUNDS = followPalette(() => ([{
  id: 'white',
  label: 'White',
  hex: EDITOR_SURFACE.paperWhite
}, {
  id: 'warm',
  label: 'Soft',
  hex: EDITOR_SURFACE.paperWarm
}, {
  id: 'dust',
  label: PALETTE.swatches.surface[0],
  hex: COLOR.dustLight
}, {
  id: 'clay',
  label: PALETTE.swatches.canvas[0],
  hex: PALETTE.canvas
}] as const));
type PaperBackgroundId = typeof PAPER_BACKGROUNDS[number]['id'];
const paperBackgroundHex = (id: PaperBackgroundId) => PAPER_BACKGROUNDS.find(bg => bg.id === id)?.hex ?? PAPER_BACKGROUNDS[1].hex;

const downloadOfficeHtml = (filename: string, html: string, mime: string) => {
  const blob = new Blob(['\ufeff', html], { type: mime });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
};

const wrapWordDocument = (title: string, bodyHtml: string, paperBg: string) => `<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <title>${title}</title>
  <style>
    @page { size: A4 portrait; margin: 0; }
    html, body { margin: 0; background: ${COLOR.milletClay}; color: ${COLOR.charBlack}; font-family: Inter, Arial, sans-serif; }
    article { box-shadow: none !important; border: 0 !important; margin: 0 auto; width: 210mm !important; min-height: 297mm; box-sizing: border-box; background: ${paperBg}; print-color-adjust: exact; -webkit-print-color-adjust: exact; }
    [data-onganda-block] { outline: none !important; outline-offset: 0 !important; box-shadow: none !important; break-inside: auto; page-break-inside: auto; }
    [data-onganda-avoid-page-break="true"] { break-inside: avoid; page-break-inside: avoid; }
    [data-onganda-block-type="heading"] { break-after: avoid; page-break-after: avoid; }
    [data-onganda-block-type="signature"] { break-before: avoid; page-break-before: avoid; }
    [data-onganda-block] p, [data-onganda-block] li { orphans: 3; widows: 3; }
    [data-onganda-block-type="sources"] { margin-bottom: 6px !important; }
    [data-onganda-block-type="sources"] ol { gap: 6px !important; }
    [data-onganda-block-type="sources"] li { line-height: 1.45 !important; }
    [data-onganda-block-type="sources"] li { break-inside: avoid; page-break-inside: avoid; }
    [data-onganda-block-type="signature"] { margin-top: 0 !important; }
    [data-onganda-document-content] { box-decoration-break: clone; -webkit-box-decoration-break: clone; padding-top: 44px !important; }
    [data-onganda-page-break-before="true"] { break-before: page; page-break-before: always; margin-top: 0 !important; padding-top: ${PAGE_BREAK_PREVIEW_TOP_PX}px !important; }
    [data-onganda-paper-texture] { opacity: 0.024 !important; }
    button, input, textarea, [data-onganda-export-ui="true"] { display: none !important; }
    svg { max-width: 100%; }
  </style>
</head>
<body>${bodyHtml}</body>
</html>`;

// ─── Chart Data ───────────────────────────────────────────────────────────────
const DEFAULT_AI_MARKET_DATA = [{
  year: '2023',
  value: 189
}, {
  year: '2026',
  value: 1100
}, {
  year: '2030',
  value: 2900
}, {
  year: '2033',
  value: 4800
}];
const DEFAULT_BAR_DATA = [{
  name: 'Okaanda',
  progress: 100
}, {
  name: 'Oshini',
  progress: 78
}, {
  name: 'Ombiga',
  progress: 34
}, {
  name: 'Etiti',
  progress: 12
}, {
  name: 'Oshitoo',
  progress: 0
}];

const renderWithCitations = (text: string) => text.split(/(\[\d+\])/g).map((part, i) => {
  if (!/^\[\d+\]$/.test(part)) return part;
  const citationNumber = part.slice(1, -1);
  return <sup key={`cite-${i}`} style={{
    color: COLOR.barkRust,
    fontFamily: 'Inter, Arial, sans-serif',
    fontSize: '0.72em',
    fontWeight: 700,
    marginLeft: 2
  }}><a href={`#source-${citationNumber}`} style={{
    color: 'inherit',
    textDecoration: 'none'
  }}>{part}</a></sup>;
});

// ─── Template Blocks ──────────────────────────────────────────────────────────
const TEMPLATE_BLOCKS: DocBlock[] = followPalette(() => ([{
  id: 'b-title-heading',
  type: 'heading',
  content: 'A Namibia-Focused AI Capability and Tooling Platform'
}, {
  id: 'b-subtitle-body',
  type: 'body',
  content: 'A two-track model for local AI capability, applied tooling, and institutional deployment.'
}, {
  id: 'b-div0',
  type: 'divider',
  content: ''
}, {
  id: 'b-ctx',
  type: 'heading',
  content: 'Context'
}, {
  id: 'b-ctx-body',
  type: 'body',
  content: 'Artificial intelligence is becoming a major commercial and strategic layer of the digital economy. UNCTAD projects the global AI market to grow from $189 billion in 2023 to $4.8 trillion by 2033. McKinsey estimates that generative AI could unlock $61 billion to $103 billion annually across Africa. Namibia is therefore entering a period in which AI-driven software, cloud services, workflow tools, and sector applications will increasingly shape how institutions operate and where digital spending flows.'
}, {
  id: 'b-ctx-body2',
  type: 'body',
  content: 'Namibia already has relevant institutional movement. NCRST and UNESCO have completed the country\'s AI Readiness Assessment. NUST launched the Bank of Namibia-funded Artificial Intelligence and Robotics Accelerator in November 2024. UNAM\'s Namibia Green Hydrogen Research Institute provides a local template for a university-industry-government institute that combines research, infrastructure, incubation, and commercialization. Together, these developments show that the country has policy momentum, early institutional capacity, and a credible foundation for an applied AI platform.'
}, {
  id: 'b-chart-mkt',
  type: 'chart-market',
  content: 'Market Growth',
  chartTitle: 'Global AI Market Growth (USD Billions)'
}, {
  id: 'b-stat-africa',
  type: 'stat',
  content: 'Africa AI Opportunity',
  statValue: '$103B',
  statLabel: 'Africa Generative AI Potential',
  statSub: 'annually — McKinsey estimate',
  statHex: COLOR.ochreOrange
}, {
  id: 'b-div1',
  type: 'divider',
  content: ''
}, {
  id: 'b-model',
  type: 'heading',
  content: 'Operating Model'
}, {
  id: 'b-model-body',
  type: 'body',
  content: 'The platform is organized around two linked tracks. The first track is capability. This includes open-source model selection, fine-tuning, steering, evaluation, distillation, compression, local datasets, language and context tuning, and efficient deployment methods. The purpose of this track is to build a reusable AI systems base that fits Namibian operating conditions and produces domestic technical competence.'
}, {
  id: 'b-model-body2',
  type: 'body',
  content: 'The second track is tooling and deployment. This includes document intelligence, workflow assistants, knowledge systems, onboarding and training tools, planning systems, decision-support tools, and sector applications for government, NGOs, utilities, schools, hospitals, and firms. The purpose of this track is to convert technical capability into institutional use, operational value, and local commercial activity.'
}, {
  id: 'b-quote1',
  type: 'pullquote',
  content: 'Build the tools locally. Keep the contracts local. Train local talent.'
}, {
  id: 'b-model-body3',
  type: 'body',
  content: 'This sequencing has a strong external analogue. Mistral AI was founded in April 2023 and established technical credibility early through Mistral 7B in September 2023, added a platform layer through La Plateforme in December 2023, and later expanded into enterprise products and infrastructure. The relevant lesson is the order of moves: capability first, visible proof points second, platformization and broader deployment after that.'
}, {
  id: 'b-div2',
  type: 'divider',
  content: ''
}, {
  id: 'b-prob',
  type: 'heading',
  content: 'Problem Areas Addressed'
}, {
  id: 'b-prob-call',
  type: 'callout',
  content: 'UNESCO\'s Namibia AI Readiness Assessment identifies: absence of a formal AI regulatory framework · Data Protection Bill needs finalization · Limited electricity access in rural areas · Gaps in AI-related skills · Shortage of AI training data in Indigenous languages.'
}, {
  id: 'b-prob-body',
  type: 'body',
  content: 'The platform also addresses outward digital-spend leakage. IMF work using Namibian card data estimates that total digital-services imports rose from $34.4 million in 2020 to $111.2 million in 2024. Within that, software, cloud, and storage services rose from $4.7 million to $9.8 million, and applications from $3.2 million to $8.0 million. As AI is embedded into software and cloud products, a growing share of Namibia\'s digital expenditure will move through these channels. A local AI capability-and-tooling layer creates a basis for retaining part of that value through local systems, integrations, contracts, and products.'
}, {
  id: 'b-stat-imports',
  type: 'stat',
  content: 'Digital Import Growth',
  statValue: '$111.2M',
  statLabel: 'Digital-Services Imports',
  statSub: '2024 — up from $34.4M in 2020',
  statHex: COLOR.firedRed
}, {
  id: 'b-chart-bar',
  type: 'chart-bar',
  content: 'System Progress',
  barValues: JSON.stringify([{
    name: 'Software/Cloud',
    progress: 100
  }, {
    name: 'Applications',
    progress: 80
  }, {
    name: 'Other Digital',
    progress: 60
  }])
}, {
  id: 'b-labour-body',
  type: 'body',
  content: 'The labour-market case is equally important. Namibia\'s official unemployment rate reached 36.9% in 2023, and NDP6 targets an increase in the graduate employment rate from 66% to 74% by 2030. In this context, the platform contributes in two ways: through its own high-skill delivery work, and through the development of tools that help firms, public institutions, and NGOs onboard and train graduates faster into productive work.'
}, {
  id: 'b-stat-unemployment',
  type: 'stat',
  content: 'Unemployment',
  statValue: '36.9%',
  statLabel: 'Namibia Unemployment Rate',
  statSub: '2023 official rate',
  statHex: COLOR.barkRust
}, {
  id: 'b-div3',
  type: 'divider',
  content: ''
}, {
  id: 'b-delivery',
  type: 'heading',
  content: 'Delivery Sequence'
}, {
  id: 'b-delivery-list',
  type: 'list',
  content: 'Phase 1 — Core team, partner base, compute plan, and technical doctrine · Phase 2 — Model registry, evaluation harness, fine-tuning workflows, steering methods, distillation paths, deployment recipes, and domain datasets · Phase 3 — Tuned model families, benchmark results, local-language and local-domain systems, and demonstrator tools · Phase 4 — Repeatable modules and institutional deployments · Phase 5 — Paid pilots, public-sector and NGO deployments, enterprise contracts, training, and later spinouts'
}, {
  id: 'b-timeline1',
  type: 'timeline',
  content: 'Foundation Phase',
  timelinePhaseIdx: 0
}, {
  id: 'b-timeline2',
  type: 'timeline',
  content: 'Adaptation Phase',
  timelinePhaseIdx: 1
}, {
  id: 'b-heatmap',
  type: 'heatmap',
  content: 'Research Activity'
}, {
  id: 'b-div4',
  type: 'divider',
  content: ''
}, {
  id: 'b-sysarch',
  type: 'heading',
  content: 'System Architecture'
}, {
  id: 'b-sysarch-body',
  type: 'body',
  content: 'The platform is organized into five named systems, each corresponding to a layer of the capability and tooling stack.'
}, {
  id: 'b-sys0',
  type: 'systemcard',
  content: 'Okaanda',
  systemIdx: 0
}, {
  id: 'b-sys1',
  type: 'systemcard',
  content: 'Oshini',
  systemIdx: 1
}, {
  id: 'b-sys2',
  type: 'systemcard',
  content: 'Ombiga',
  systemIdx: 2
}, {
  id: 'b-sys3',
  type: 'systemcard',
  content: 'Etiti',
  systemIdx: 3
}, {
  id: 'b-sys4',
  type: 'systemcard',
  content: 'Oshitoo',
  systemIdx: 4
}, {
  id: 'b-flow1',
  type: 'flowchart',
  content: 'Granary Node',
  flowNodeIdx: 1
}, {
  id: 'b-terminal1',
  type: 'terminal',
  content: 'Oshini Pipeline',
  terminalIdx: 0
}, {
  id: 'b-div5',
  type: 'divider',
  content: ''
}, {
  id: 'b-principles',
  type: 'principles',
  content: 'Brand Principles'
}, {
  id: 'b-swatches',
  type: 'swatchrow',
  content: 'Material Palette'
}, {
  id: 'b-div6',
  type: 'divider',
  content: ''
}, {
  id: 'b-prop',
  type: 'heading',
  content: 'Core Proposition'
}, {
  id: 'b-prop-body',
  type: 'body',
  content: 'The platform creates a domestic AI capability base, a local tooling layer, and a practical route from research into deployment. Its value lies in converting Namibian demand for AI-enabled systems into Namibian capability, Namibian tools, and Namibian institutional learning.'
}, {
  id: 'b-prop-quote',
  type: 'pullquote',
  content: 'A local capability layer turns AI demand into local systems, local expertise, and local value.'
}, {
  id: 'b-sig',
  type: 'signature',
  content: `${DOCUMENT_BYLINE} · ${CURRENT_YEAR}`,
  sigAuthor: AUTHOR_NAME,
  sigYear: String(CURRENT_YEAR)
}]));

const MEMO_SECTIONS: Array<{ heading: string; paragraphs: string[] }> = [
  {
    heading: 'Purpose',
    paragraphs: [
      'This memo summarizes the concept for a Namibia-focused AI capability and tooling platform. The idea is to build a local institution that develops practical AI capability for Namibian contexts and converts that capability into tools for government, universities, NGOs, companies, and other institutions.',
      'The concept sits between a research lab, an applied technology studio, and a startup-paced delivery organization. Its role is to build domestic know-how in AI systems and then use that know-how to create useful tools. Namibia should not only consume AI systems designed elsewhere. It should develop the ability to understand, adapt, evaluate, deploy, and maintain AI systems for its own institutional and economic needs.',
      'This does not require Namibia to train frontier foundation models from scratch at the beginning. The realistic starting point is open-source model selection, fine-tuning, steering, evaluation, distillation, compression, local datasets, and efficient deployment. These capabilities can then become document intelligence, workflow assistants, onboarding systems, internal knowledge tools, public-service tools, sector-specific assistants, and decision-support systems.'
    ]
  },
  {
    heading: 'Core Thesis',
    paragraphs: [
      'Artificial intelligence is becoming a structural layer in software, public administration, education, business operations, health, finance, energy, logistics, and research. Countries and institutions that build local capability early will be better positioned to shape how these systems are used, how data is handled, how risks are managed, and how economic value is captured. Early computers occupied entire rooms and performed tasks that seem trivial by modern standards [12].',
      'For Namibia, the opportunity is specific. The country already has AI-related policy momentum, institutional activity, and research interest. Namibia has completed an AI Readiness Assessment through NCRST and UNESCO [1]. NUST has launched an AI and Robotics Accelerator with support from the Bank of Namibia [2]. UNAM\'s Green Hydrogen Research Institute provides a local precedent for a university-industry-government institute that links research, skills, infrastructure, piloting, and commercialization [3].',
      'The gap is the absence of a coordinated AI capability layer that can connect research, model adaptation, local datasets, deployment methods, governance, institutional use cases, and applied tooling. The proposed platform is intended to fill that gap.'
    ]
  },
  {
    heading: 'Why This Matters',
    paragraphs: [
      'The business and development case has several parts. The global AI market is growing rapidly [4], and Africa is expected to see substantial annual economic value from generative AI adoption [5]. Namibia will be part of this trend through the software, cloud, workflow, and sector tools its institutions adopt.',
      'AI spending will increasingly be embedded inside ordinary digital services. Organisations will buy software subscriptions, cloud systems, workflow platforms, document tools, analytics tools, enterprise copilots, and sector applications that include AI features. Without a local capability layer, much of this spending will flow outward to foreign technology providers [6].',
      'Namibia also has a labour-market and graduate-readiness problem [7]. The platform will not solve unemployment by hiring large numbers of people directly. Its wider role is to create tools and training environments that help institutions onboard graduates faster and make them productive sooner.',
      'The AI Readiness Assessment points to gaps around regulatory readiness, data protection, AI-related skills, public-sector capacity, local-language data, and implementation [1]. These are technical and institutional design issues as much as policy issues.'
    ]
  },
  {
    heading: 'Two-Track Operating Model',
    paragraphs: [
      'The first track is capability. This track builds the technical base: open-source model selection, fine-tuning, steering, evaluation, distillation, compression, local datasets, language and context tuning, deployment recipes, and model operations. The output is practical know-how for making AI work under Namibian constraints.',
      'The second track is tooling and deployment. This turns the capability layer into usable institutional systems: document intelligence, internal workflow tools, knowledge systems, planning tools, decision-support systems, onboarding and training tools, local-language systems, and sector-specific applications.',
      'Capability creates the know-how. Tooling converts that know-how into value. The first track prevents the platform from becoming a shallow services shop. The second track prevents it from becoming an isolated research group.'
    ]
  },
  {
    heading: 'Useful Analogues',
    paragraphs: [
      'Mistral AI is useful as a sequencing analogue: build technical credibility, create visible proof points, add a platform layer, then broaden into products and deployments [8].',
      'AI Singapore is useful as an institutional analogue because it combines national capability-building, engineering capacity, talent development, applied projects, and ecosystem development [9].',
      'AI Sweden is useful as a public-private operating model. It shows how applied AI capacity can be built through a shared ecosystem rather than a single isolated institution [10].',
      'Lelapa AI is useful as an African technical and product analogue because it focuses on resource-efficient language AI for African contexts [11]. UNAM\'s Namibia Green Hydrogen Research Institute is useful as a local institutional analogue for structuring research, workforce development, applied infrastructure, piloting, technology transfer, and commercialization [3].'
    ]
  },
  {
    heading: 'Possible Institutional Form',
    paragraphs: [
      'The platform should be university-linked, but startup-paced. It should have the credibility and public-interest orientation of an academic or national institute while operating with short build cycles, practical milestones, and delivery discipline.',
      'A plausible structure would include a core capability centre and a separate applied tooling or commercialization layer. The centre would focus on research, model work, evaluation, training, governance, datasets, and shared infrastructure. The applied layer would focus on paid pilots, institutional deployments, productization, training tools, and later spinouts where appropriate.'
    ]
  },
  {
    heading: 'Why Namibia',
    paragraphs: [
      'Namibia is small enough for a focused platform to matter, and complex enough to need contextual systems. It has public institutions that need better digital tools, companies that need productivity gains, universities that need stronger applied pathways, graduates who need better work-readiness routes, and sectors where AI can support decision-making, documentation, planning, training, and service delivery.',
      'The AI Readiness Assessment gives the platform a policy basis [1]. It identifies readiness gaps around governance, data protection, skills, infrastructure, and local-language data. A platform that builds model capability and tooling directly addresses these areas.',
      'As AI becomes embedded into global software and cloud services, Namibian institutions will increasingly pay for AI-enabled functionality whether or not local capacity exists [6]. The platform creates a pathway for Namibia to capture some of that value through local adaptation, implementation, support, and product development.'
    ]
  },
  {
    heading: 'Partners and Stakeholders',
    paragraphs: [
      'A Dutch university partner could support research design, AI evaluation, governance frameworks, technical supervision, student exchange, access to European research networks, and credibility with EU-facing funders. Its value should be practical: methods, reusable implementation patterns, governance templates, evaluation practices, and funded research pathways.',
      'A Namibian university partner is essential because the platform has to build local capability rather than operate as an external consultancy. NUST is relevant because of its AI and Robotics Accelerator, computing faculty, AI-related programmes, and emerging technology momentum [2]. UNAM is relevant because of its national reach and institute model [3].',
      'With government, the conversation should focus on national capability, implementation, governance, employability, and value retention. With business and investors, the conversation should focus on practical tools, paid pilots, productivity, internal training, and local service delivery.'
    ]
  },
  {
    heading: 'Early Focus Areas',
    paragraphs: [
      'The first visible use cases should be narrow enough to build and broad enough to matter. Good early candidates include document intelligence for public institutions and NGOs, internal knowledge assistants for organisations with large document stores, workflow copilots for operational teams, graduate onboarding and training tools, and local-language or local-context demonstrators.',
      'A second set of use cases can focus on energy, water, health, education, public administration, logistics, mining, and climate-related planning. Examples include climate and weather readiness systems for droughts, floods, and extreme weather events associated with El Niño cycles; wildfire and bushfire monitoring and response support [13]. These sectors already appear in Namibia’s AI readiness and development discussions, and they have institutional demand [14]. The platform should begin where data access is feasible, user workflows are clear, and outputs can be evaluated.'
    ]
  },
  {
    heading: 'Milestone Logic',
    paragraphs: [
      'The first milestone is a small founding group with a clear technical doctrine, institutional doctrine, partner map, and compute plan. The second milestone is a reusable AI stack: model registry, evaluation harness, fine-tuning workflows, steering methods, distillation paths, deployment recipes, and initial datasets.',
      'The third milestone is public proof: a tuned model family, a local benchmark or evaluation result, a local-language or local-domain demonstrator, and one or two working tools. The fourth milestone is applied tooling. The fifth milestone is platformization: repeatable modules, deployment templates, evaluation standards, and a pipeline for paid deployments and spinouts.'
    ]
  },
  {
    heading: 'Risks and Design Principles',
    paragraphs: [
      'The first risk is becoming too academic. The platform should produce research and training, but it should also build working systems. The second risk is becoming a consulting shop. The platform should solve problems for partners, but it should also build reusable capability and tools.',
      'The third risk is over-investing in hardware before workloads are clear. Compute matters, but the more important early assets are people, evaluation methods, partner access, data workflows, and deployment experience. The fourth risk is using sovereign AI as a slogan without operational meaning. In this concept, sovereignty means local capacity to choose, adapt, evaluate, deploy, and maintain AI systems.',
      'The guiding principles are straightforward: build capability before broad productization; use open models where appropriate; evaluate before deployment; design for local constraints; create tools from real institutional pain points; keep the team small and execution-oriented; and make each pilot contribute to the reusable stack.'
    ]
  },
  {
    heading: 'Summary',
    paragraphs: [
      'The proposed platform is a Namibia-based AI capability and tooling institution. It builds local expertise in model adaptation, evaluation, deployment, and governance, then converts that expertise into practical tools for institutions.',
      'The concept can speak to several audiences at once. For government, it is a capability, implementation, and employability platform. For universities, it is an applied research and training bridge. For a Dutch university, it is a responsible AI and international collaboration lighthouse. For companies and investors, it is a route to practical tools and local commercial value. For Namibian thought leaders, it is a way to participate in the AI era as builders, not only as buyers.',
      'The next step is to test the concept with a small number of serious stakeholders, refine the institutional structure, identify two or three early use cases, and define the first six-month capability build.'
    ]
  }
];

const MEMO_SOURCES = [
  {
    label: 'NCRST and UNESCO',
    detail: 'Namibia AI Readiness Assessment and related implementation agenda.',
    links: [
      { label: 'A', url: 'https://unesdoc.unesco.org/ark:/48223/pf0000394686' },
      { label: 'B', url: 'https://www.unesco.org/en/articles/namibia-launches-artificial-intelligence-readiness-assessment-report' },
      { label: 'C', url: 'https://www.unesco.org/ethics-ai/en/namibia' }
    ]
  },
  {
    label: 'NUST and Bank of Namibia',
    detail: 'AI and Robotics Accelerator reference point for local institutional momentum.',
    links: [
      { label: 'A', url: 'https://www.nust.na/nust-bank-namibia-partner-launch-ai-and-robotics-accelerator' },
      { label: 'B', url: 'https://www.bon.com.na/Informations/Media/Media-Releases/2024-Media-Releases/Articles/LAUNCH-OF-THE-BANK-OF-NAMIBIA-ARTIFICIAL-INTELLIGE.aspx' }
    ]
  },
  {
    label: 'UNAM Namibia Green Hydrogen Research Institute',
    detail: 'Local institute model for university-industry-government collaboration.',
    links: [
      { label: 'A', url: 'https://www.unam.edu.na/nghri' },
      { label: 'B', url: 'https://forumonline.unam.edu.na/unam-leads-the-establishment-of-namibias-green-hydrogen-research-institute/' },
      { label: 'C', url: 'https://neweralive.na/unam-leads-green-hydrogen-research-institute/' }
    ]
  },
  {
    label: 'International AI market estimates',
    detail: 'Global AI market growth context used for the business and development case.',
    links: [
      { label: 'A', url: 'https://unctad.org/news/ai-market-projected-hit-48-trillion-2033-emerging-dominant-frontier-technology' }
    ]
  },
  {
    label: 'McKinsey Africa generative AI estimate',
    detail: 'Africa annual generative AI value estimate used for the opportunity framing.',
    links: [
      { label: 'A', url: 'https://www.mckinsey.com/capabilities/quantumblack/our-insights/leading-not-lagging-africas-gen-ai-opportunity' }
    ]
  },
  {
    label: 'Namibia digital-services import analysis',
    detail: 'Outward software, cloud, application, and digital-services spending context.',
    links: [
      { label: 'A', url: 'https://www.imf.org/en/search#q=Harnessing%20Card%20Data%20to%20Measure%20Namibia%27s%20Cross-Border%20Digital%20Services%20Imports&sort=relevancy' }
    ]
  },
  {
    label: 'Namibia labour-market and graduate-readiness data',
    detail: 'Unemployment, graduate-employment targets, and graduate-readiness context for the employability case.',
    links: [
      { label: 'A', url: 'https://www.reuters.com/world/africa/namibias-unemployment-rate-rises-369-2025-01-29/' },
      { label: 'B', url: 'https://nsa.org.na/wp-content/uploads/2025/01/2023PHC-Labour-Force-Report-_Media-Statement.pdf' },
      { label: 'C', url: 'https://www.npc.gov.na/wp-content/uploads/2025/07/NDP6-Booklet.pdf' },
      { label: 'D', url: 'https://documents1.worldbank.org/curated/en/099081224051035127/pdf/P171994-2b4ffc58-d328-4002-a65a-8df0a178573e.pdf' },
      { label: 'E', url: 'https://www.ilo.org/media/358336/download' }
    ]
  },
  {
    label: 'Mistral AI',
    detail: 'Sequencing analogue: model credibility, platform layer, enterprise/product expansion.',
    links: [
      { label: 'A', url: 'https://mistral.ai/about/' },
      { label: 'B', url: 'https://mistral.ai/news/announcing-mistral-7b' },
      { label: 'C', url: 'https://mistral.ai/news/la-plateforme' },
      { label: 'D', url: 'https://mistral.ai/news/mistral-compute' }
    ]
  },
  {
    label: 'AI Singapore',
    detail: 'Institutional analogue for national AI capability-building and applied projects.',
    links: [
      { label: 'A', url: 'https://aisingapore.org/' },
      { label: 'B', url: 'https://aisingapore.org/innovation/100e/' },
      { label: 'C', url: 'https://aisingapore.org/research/' },
      { label: 'D', url: 'https://aisingapore.org/innovation/' }
    ]
  },
  {
    label: 'AI Sweden',
    detail: 'Public-private applied AI operating-model analogue.',
    links: [
      { label: 'A', url: 'https://www.ai.se/en/accelerating-applied-ai-sweden' }
    ]
  },
  {
    label: 'Lelapa AI',
    detail: 'African technical and product analogue for resource-efficient language AI.',
    links: [
      { label: 'A', url: 'https://lelapa.ai/' },
      { label: 'B', url: 'https://lelapa.ai/blog/the-future-of-ai-is-resource-efficient' },
      { label: 'C', url: 'https://arxiv.org/abs/2408.17024' }
    ]
  },
  {
    label: 'Early computing analogy',
    detail: 'Historical reference for room-sized early computers.',
    links: [
      { label: 'A', url: 'https://www.seas.upenn.edu/about/history-heritage/eniac/' }
    ]
  },
  {
    label: 'Namibia climate and weather risk context',
    detail: 'Droughts, floods, water scarcity, extreme heat, wildfires, and El Niño-related climate variability.',
    links: [
      { label: 'A', url: 'https://climateknowledgeportal.worldbank.org/sites/default/files/2021-08/15931-WB_Namibia%20Country%20Profile-WEB.pdf' },
      { label: 'B', url: 'https://www.climatecentre.org/wp-content/uploads/Climate-Profiles-of-Countries-in-Southern-Africa-Namibia.pdf' }
    ]
  },
  {
    label: 'Namibia AI priority sectors',
    detail: 'Sectoral basis for early focus areas.',
    links: [
      { label: 'A', url: 'https://www.unesco.org/ethics-ai/en/namibia' }
    ]
  }
];

const MEMO_TEMPLATE_BLOCKS: DocBlock[] = [
  {
    id: 'memo-title-heading',
    type: 'heading',
    content: 'Memo: Namibia AI Capability and Tooling Platform'
  },
  {
    id: 'memo-subtitle-body',
    type: 'body',
    content: 'A working paper for a Namibia-focused AI capability institution that connects research, model adaptation, local datasets, deployment methods, governance, institutional use cases, and applied tooling.'
  },
  {
    id: 'memo-div0',
    type: 'divider',
    content: ''
  },
  ...MEMO_SECTIONS.flatMap((section, sectionIdx) => [
    {
      id: `memo-h-${sectionIdx}`,
      type: 'heading' as const,
      content: section.heading
    },
    ...section.paragraphs.map((paragraph, paragraphIdx) => ({
      id: `memo-b-${sectionIdx}-${paragraphIdx}`,
      type: 'body' as const,
      content: paragraph
    }))
  ]),
  {
    id: 'memo-div-sources',
    type: 'divider',
    content: ''
  },
  {
    id: 'memo-sources',
    type: 'sources',
    content: 'Sources',
    sourcesData: JSON.stringify(MEMO_SOURCES)
  },
  {
    id: 'memo-sig',
    type: 'signature',
    content: `${DOCUMENT_BYLINE} · ${CURRENT_YEAR}`,
    sigAuthor: AUTHOR_NAME,
    sigYear: String(CURRENT_YEAR)
  }
];

const OLD_MEMO_CORE_THESIS = 'Artificial intelligence is becoming a structural layer in software, public administration, education, business operations, health, finance, energy, logistics, and research. Countries and institutions that build local capability early will be better positioned to shape how these systems are used, how data is handled, how risks are managed, and how economic value is captured.';
const NEW_MEMO_CORE_THESIS = MEMO_SECTIONS[1].paragraphs[0];
const OLD_MEMO_EARLY_FOCUS = 'A second set of use cases can focus on energy, water, health, education, public administration, logistics, mining, and climate-related planning. The platform should begin where data access is feasible, user workflows are clear, and outputs can be evaluated.';
const NEW_MEMO_EARLY_FOCUS = MEMO_SECTIONS[8].paragraphs[1];
const OLD_MEMO_SIGNATURE = `Prepared by ${AUTHOR_NAME} · Onganda · Namibia AI Systems Lab · ${CURRENT_YEAR}`;
const migrateMemoBlocks = (blocks: DocBlock[]) => blocks.map(block => {
  if (block.type === 'sources' && (block.id === 'memo-sources' || block.content === 'Sources')) {
    const sources = parseSources(block.sourcesData);
    const isOldMemoSources = sources.length <= 11 && sources.some(source => source.label === 'NCRST and UNESCO') && !sources.some(source => source.links?.length);
    if (isOldMemoSources) return { ...block, sourcesData: JSON.stringify(MEMO_SOURCES) };
  }
  if (block.type === 'body' && block.content === OLD_MEMO_CORE_THESIS) {
    return { ...block, content: NEW_MEMO_CORE_THESIS };
  }
  if (block.type === 'body' && block.content === OLD_MEMO_EARLY_FOCUS) {
    return { ...block, content: NEW_MEMO_EARLY_FOCUS };
  }
  if (block.type === 'signature' && block.content === OLD_MEMO_SIGNATURE) {
    return { ...block, content: `${DOCUMENT_BYLINE} · ${CURRENT_YEAR}`, sigAuthor: AUTHOR_NAME, sigYear: String(CURRENT_YEAR) };
  }
  return block;
});

// ─── Drag reorder state ───────────────────────────────────────────────────────
interface DragState {
  draggingId: string | null;
  overIdx: number | null;
}

// ─── Inline text area ────────────────────────────────────────────────────────
const InlineTextArea = ({
  value,
  onChange,
  onBlur,
  style
}: {
  value: string;
  onChange: (v: string) => void;
  onBlur: () => void;
  style: React.CSSProperties;
}) => {
  const ref = useRef<HTMLTextAreaElement>(null);
  useEffect(() => {
    ref.current?.focus();
    ref.current?.select();
  }, []);
  return <textarea ref={ref} value={value} onChange={e => onChange(e.target.value)} onBlur={onBlur} onKeyDown={e => {
    if (e.key === 'Escape') onBlur();
  }} style={{
    ...style,
    resize: 'vertical',
    whiteSpace: 'pre-wrap'
  }} />;
};
const InlineInput = ({
  value,
  onChange,
  onBlur,
  style
}: {
  value: string;
  onChange: (v: string) => void;
  onBlur: () => void;
  style: React.CSSProperties;
}) => {
  const ref = useRef<HTMLInputElement>(null);
  useEffect(() => {
    ref.current?.focus();
    ref.current?.select();
  }, []);
  return <input ref={ref} value={value} onChange={e => onChange(e.target.value)} onBlur={onBlur} onKeyDown={e => {
    if (e.key === 'Enter' || e.key === 'Escape') onBlur();
  }} style={style} />;
};

// ─── Stat Block ───────────────────────────────────────────────────────────────
const HEX_OPTIONS = followPalette(() => ([COLOR.ochreOrange, COLOR.firedRed, COLOR.mahanguGold, COLOR.barkRust, COLOR.mopaneBrown, COLOR.dyePlum]));
const StatBlock = ({
  block,
  isDark,
  isConfiguring,
  onEditChange
}: {
  block: DocBlock;
  isDark: boolean;
  isConfiguring: boolean;
  onEditChange: (u: Partial<DocBlock>) => void;
}) => {
  const hex = block.statHex ?? COLOR.ochreOrange;
  const fg = isDark ? COLOR.milletClay : COLOR.charBlack;
  const muted = isDark ? paperAlpha(0.55) : inkAlpha(0.66);
  const border = isDark ? paperAlpha(0.10) : inkAlpha(0.10);
  const fields = [{
    key: 'statValue',
    label: 'Value',
    val: block.statValue ?? '',
    fontSize: 18,
    color: hex
  }, {
    key: 'statLabel',
    label: 'Label',
    val: block.statLabel ?? '',
    fontSize: 11,
    color: fg
  }, {
    key: 'statSub',
    label: 'Sub',
    val: block.statSub ?? '',
    fontSize: 10,
    color: muted
  }];
  if (isConfiguring) {
    return <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: 10
    }}>
        <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr 1fr',
        gap: 8
      }}>
          {fields.map(f => <div key={f.key}>
              <label style={{
            fontSize: 9,
            fontWeight: 700,
            letterSpacing: '0.12em',
            textTransform: 'uppercase' as const,
            color: muted,
            display: 'block',
            marginBottom: 4
          }}>{f.label}</label>
              <input value={f.val} onChange={e => onEditChange({
            [f.key]: e.target.value
          })} style={{
            width: '100%',
            fontSize: f.fontSize,
            fontWeight: 700,
            color: f.color,
            background: 'transparent',
            border: `1px solid ${border}`,
            outline: 'none',
            padding: '6px 8px'
          }} />
            </div>)}
        </div>
        <div>
          <label style={{
          fontSize: 9,
          fontWeight: 700,
          letterSpacing: '0.12em',
          textTransform: 'uppercase' as const,
          color: muted,
          display: 'block',
          marginBottom: 6
        }}>Accent Colour</label>
          <div style={{
          display: 'flex',
          gap: 6
        }}>
            {HEX_OPTIONS.map((c, i) => <button key={`stat-hex-${i}`} onClick={() => onEditChange({
            statHex: c
          })} style={{
            width: 20,
            height: 20,
            background: c,
            border: `2px solid ${hex === c ? fg : 'transparent'}`,
            cursor: 'pointer'
          }} />)}
          </div>
        </div>
      </div>;
  }
  return <div data-onganda-export-ui="true" data-onganda-export-modal="true" style={{
    display: 'inline-flex',
    flexDirection: 'column',
    gap: 4,
    padding: '14px 20px',
    background: `${hex}12`,
    border: `1px solid ${hex}40`,
    borderTop: `3px solid ${hex}`,
    minWidth: 140
  }}>
      <span style={{
      fontSize: 30,
      fontWeight: 700,
      // Large text: the hue itself where it clears 3:1 on the paper.
      color: contrast(hex, isDark ? COLOR.darkCard : EDITOR_SURFACE.paperWarm) >= 3 ? hex : fg,
      lineHeight: 1
    }}>{block.statValue ?? '0'}</span>
      <span style={{
      fontSize: 12,
      fontWeight: 600,
      color: fg
    }}>{block.statLabel ?? 'Metric'}</span>
      <span style={{
      fontSize: 10,
      color: muted
    }}>{block.statSub ?? ''}</span>
    </div>;
};

// ─── Terminal Block ───────────────────────────────────────────────────────────
const TerminalBlock = ({
  block,
  isDark,
  isConfiguring,
  onEditChange
}: {
  block: DocBlock;
  isDark: boolean;
  isConfiguring: boolean;
  onEditChange: (u: Partial<DocBlock>) => void;
}) => {
  const idx = block.terminalIdx ?? 0;
  const terminal = TERMINAL_BLOCKS[idx % TERMINAL_BLOCKS.length];
  const muted = isDark ? paperAlpha(0.55) : inkAlpha(0.66);
  const colorMap: Record<string, string> = {
    comment: paperAlpha(0.55),
    keyword: COLOR.ochreOrange,
    string: COLOR.mahanguGold,
    plain: `${COLOR.milletClay}99`,
    accent: COLOR.ochreOrange
  };
  if (isConfiguring) {
    return <div>
        <label style={{
        fontSize: 9,
        fontWeight: 700,
        letterSpacing: '0.12em',
        textTransform: 'uppercase' as const,
        color: muted,
        display: 'block',
        marginBottom: 8
      }}>Choose Terminal Block</label>
        <div style={{
        display: 'flex',
        gap: 6,
        flexWrap: 'wrap' as const
      }}>
          {TERMINAL_BLOCKS.map((tb, i) => <button key={`tb-choice-${i}`} onClick={() => onEditChange({
          terminalIdx: i,
          content: tb.title
        })} style={{
          padding: '6px 12px',
          fontSize: 10,
          fontWeight: 600,
          cursor: 'pointer',
          border: `1px solid ${(block.terminalIdx ?? 0) === i ? tb.tagHex : inkAlpha(0.1)}`,
          background: (block.terminalIdx ?? 0) === i ? `${tb.tagHex}18` : 'transparent',
          color: (block.terminalIdx ?? 0) === i ? tb.tagHex : muted
        }}>
              {tb.title}
            </button>)}
        </div>
      </div>;
  }
  return <div data-onganda-export-ui="true" style={{
    background: COLOR.charBlack,
    overflow: 'hidden'
  }}>
      <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '10px 16px',
      borderBottom: `1px solid ${terminal.tagHex}33`
    }}>
        <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8
      }}>
          <div style={{
          display: 'flex',
          gap: 5
        }} aria-hidden="true">
            {[COLOR.ochreOrange, COLOR.firedRed, COLOR.mahanguGold].map((c, i) => <div key={`tc-dot-${i}`} style={{
            width: 8,
            height: 8,
            background: c,
            opacity: 0.6
          }} />)}
          </div>
          <span style={{
          fontSize: 9,
          fontWeight: 700,
          letterSpacing: '0.14em',
          textTransform: 'uppercase' as const,
          color: paperAlpha(0.55),
          marginLeft: 8
        }}>{terminal.title}</span>
        </div>
        <PixelTag hex={terminal.tagHex} label={terminal.tag} />
      </div>
      <div style={{
      padding: '16px 20px',
      fontFamily: FONT.mono,
      fontSize: 11,
      lineHeight: 1.7
    }}>
        {terminal.lines.map((line, li) => <div key={`tl-${li}`} style={{
        color: colorMap[line.type] ?? colorMap.plain,
        minHeight: '1.5rem'
      }}>
            <span>{line.text || '\u00A0'}</span>
          </div>)}
      </div>
    </div>;
};

// ─── Timeline Block ───────────────────────────────────────────────────────────
const TimelineBlock = ({
  block,
  isDark,
  isConfiguring,
  onEditChange
}: {
  block: DocBlock;
  isDark: boolean;
  isConfiguring: boolean;
  onEditChange: (u: Partial<DocBlock>) => void;
}) => {
  const idx = block.timelinePhaseIdx ?? 0;
  const phase = TIMELINE_PHASES[idx % TIMELINE_PHASES.length];
  const muted = isDark ? paperAlpha(0.55) : inkAlpha(0.66);
  const border = isDark ? paperAlpha(0.08) : inkAlpha(0.08);
  if (isConfiguring) {
    return <div>
        <label style={{
        fontSize: 9,
        fontWeight: 700,
        letterSpacing: '0.12em',
        textTransform: 'uppercase' as const,
        color: muted,
        display: 'block',
        marginBottom: 8
      }}>Choose Roadmap Phase</label>
        <div style={{
        display: 'flex',
        flexWrap: 'wrap' as const,
        gap: 6
      }}>
          {TIMELINE_PHASES.map((ph, i) => <button key={`ph-choice-${i}`} onClick={() => onEditChange({
          timelinePhaseIdx: i,
          content: ph.english
        })} style={{
          padding: '5px 10px',
          fontSize: 10,
          fontWeight: 600,
          cursor: 'pointer',
          border: `1px solid ${(block.timelinePhaseIdx ?? 0) === i ? ph.hex : inkAlpha(0.1)}`,
          background: (block.timelinePhaseIdx ?? 0) === i ? `${ph.hex}18` : 'transparent',
          color: (block.timelinePhaseIdx ?? 0) === i ? ph.hex : muted
        }}>
              {ph.tag} {ph.english}
            </button>)}
        </div>
      </div>;
  }
  return <div style={{
    border: `1px solid ${border}`,
    borderLeft: `3px solid ${phase.hex}`,
    padding: '16px 20px',
    background: isDark ? `${phase.hex}08` : `${phase.hex}06`
  }}>
      <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      marginBottom: 10
    }}>
        <PixelTag hex={phase.hex} label={phase.tag} />
        <div>
          <span style={{
          fontSize: 14,
          fontWeight: 700,
          color: isDark ? COLOR.milletClay : inkOn(phase.hex, EDITOR_SURFACE.paperWarm)
        }}>{phase.oshiwambo}</span>
          <span style={{
          fontSize: 11,
          color: muted,
          marginLeft: 8
        }}>{phase.english}</span>
        </div>
        <div style={{
        marginLeft: 'auto'
      }}>
          <span style={{
          fontSize: 10,
          fontWeight: 600,
          color: inkOn(phase.hex, isDark ? COLOR.darkCard : EDITOR_SURFACE.paperWarm, isDark)
        }}>{phase.progress}%</span>
          <span style={{
          fontSize: 9,
          color: muted,
          marginLeft: 4
        }}>{phase.period}</span>
        </div>
      </div>
      <p style={{
      fontSize: 12,
      color: isDark ? paperAlpha(0.65) : inkAlpha(0.65),
      lineHeight: 1.65,
      marginBottom: 10
    }}>{phase.desc}</p>
      <div style={{
      width: '100%',
      height: 6,
      background: isDark ? paperAlpha(0.08) : inkAlpha(0.08),
      marginBottom: 8
    }}>
        <div style={{
        height: '100%',
        width: `${phase.progress}%`,
        background: phase.hex
      }} />
      </div>
      <div style={{
      display: 'flex',
      flexWrap: 'wrap' as const,
      gap: 6
    }}>
        {phase.milestones.map(ms => <span key={`ms-block-${ms}`} style={{
        fontSize: 9,
        padding: '2px 8px',
        background: `${phase.hex}18`,
        border: `1px solid ${phase.hex}40`,
        color: inkOn(phase.hex, isDark ? COLOR.darkCard : EDITOR_SURFACE.paperWarm, isDark),
        fontWeight: 600,
        letterSpacing: '0.08em'
      }}>{ms}</span>)}
      </div>
    </div>;
};

// ─── System Card Block ────────────────────────────────────────────────────────
const SYSTEM_ICON_SMALL: Record<string, React.ReactNode> = {
  Okaanda: <IconOkaanda size={24} />,
  Oshini: <IconOshini size={24} />,
  Ombiga: <IconOmbiga size={24} />,
  Etiti: <IconEtiti size={24} />,
  Oshitoo: <IconOshitoo size={24} />
};
const SystemCardBlock = ({
  block,
  isDark,
  isConfiguring,
  onEditChange
}: {
  block: DocBlock;
  isDark: boolean;
  isConfiguring: boolean;
  onEditChange: (u: Partial<DocBlock>) => void;
}) => {
  const idx = block.systemIdx ?? 0;
  const sys = SYSTEMS[idx % SYSTEMS.length];
  const muted = isDark ? paperAlpha(0.55) : inkAlpha(0.66);
  const border = isDark ? paperAlpha(0.08) : inkAlpha(0.08);
  if (isConfiguring) {
    return <div>
        <label style={{
        fontSize: 9,
        fontWeight: 700,
        letterSpacing: '0.12em',
        textTransform: 'uppercase' as const,
        color: muted,
        display: 'block',
        marginBottom: 8
      }}>Choose System</label>
        <div style={{
        display: 'flex',
        flexWrap: 'wrap' as const,
        gap: 6
      }}>
          {SYSTEMS.map((s, i) => <button key={`sys-choice-${i}`} onClick={() => onEditChange({
          systemIdx: i,
          content: s.name
        })} style={{
          padding: '5px 12px',
          fontSize: 10,
          fontWeight: 600,
          cursor: 'pointer',
          border: `1px solid ${(block.systemIdx ?? 0) === i ? s.borderHex : inkAlpha(0.1)}`,
          background: (block.systemIdx ?? 0) === i ? `${s.borderHex}18` : 'transparent',
          color: (block.systemIdx ?? 0) === i ? s.borderHex : muted
        }}>
              {s.name}
            </button>)}
        </div>
      </div>;
  }
  return <div style={{
    display: 'flex',
    gap: 16,
    padding: '16px 20px',
    background: isDark ? COLOR.darkCard : EDITOR_SURFACE.emberBrown,
    border: `1px solid ${border}`,
    borderLeft: `3px solid ${sys.borderHex}`
  }}>
      <div style={{
      width: 48,
      height: 48,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: `${sys.borderHex}14`,
      border: `1px solid ${sys.borderHex}40`,
      flexShrink: 0
    }}>
        {SYSTEM_ICON_SMALL[sys.name]}
      </div>
      <div style={{
      flex: 1,
      minWidth: 0
    }}>
        <div style={{
        display: 'flex',
        alignItems: 'baseline',
        gap: 8,
        marginBottom: 4
      }}>
          <span style={{
          fontSize: 14,
          fontWeight: 700,
          // The panel is ember brown in light mode, which is a dark ground:
          // char black measures 1.13:1 on it. Paper, always.
          color: COLOR.milletClay
        }}>{sys.name}</span>
          <span style={{
          fontSize: 10,
          color: inkOn(sys.borderHex, isDark ? COLOR.darkCard : EDITOR_SURFACE.emberBrown, true),
          fontWeight: 700,
          letterSpacing: '0.12em',
          textTransform: 'uppercase' as const
        }}>{sys.role}</span>
        </div>
        <p style={{
        fontSize: 11,
        color: paperAlpha(0.78),
        lineHeight: 1.6
      }}>{sys.desc}</p>
      </div>
    </div>;
};

// ─── Flow Node Block ──────────────────────────────────────────────────────────
const FlowNodeBlock = ({
  block,
  isDark,
  isConfiguring,
  onEditChange
}: {
  block: DocBlock;
  isDark: boolean;
  isConfiguring: boolean;
  onEditChange: (u: Partial<DocBlock>) => void;
}) => {
  const idx = block.flowNodeIdx ?? 0;
  const node = FLOW_NODES[idx % FLOW_NODES.length];
  const muted = isDark ? paperAlpha(0.55) : inkAlpha(0.66);
  if (isConfiguring) {
    return <div>
        <label style={{
        fontSize: 9,
        fontWeight: 700,
        letterSpacing: '0.12em',
        textTransform: 'uppercase' as const,
        color: muted,
        display: 'block',
        marginBottom: 8
      }}>Choose Flow Node</label>
        <div style={{
        display: 'flex',
        flexWrap: 'wrap' as const,
        gap: 6
      }}>
          {FLOW_NODES.map((n, i) => <button key={`fn-choice-${i}`} onClick={() => onEditChange({
          flowNodeIdx: i,
          content: n.oshiwambo
        })} style={{
          padding: '5px 10px',
          fontSize: 10,
          fontWeight: 600,
          cursor: 'pointer',
          border: `1px solid ${(block.flowNodeIdx ?? 0) === i ? n.hex : inkAlpha(0.1)}`,
          background: (block.flowNodeIdx ?? 0) === i ? `${n.hex}18` : 'transparent',
          color: (block.flowNodeIdx ?? 0) === i ? n.hex : muted
        }}>
              {n.oshiwambo}
            </button>)}
        </div>
      </div>;
  }
  return <div style={{
    display: 'flex',
    alignItems: 'center',
    gap: 14,
    padding: '14px 18px',
    background: `${node.hex}0E`,
    border: `1px solid ${node.hex}`,
    borderLeft: `4px solid ${node.hex}`
  }}>
      <div style={{
      flexShrink: 0
    }}><FlowNodeIcon id={node.id} hex={node.hex} /></div>
      <div>
        <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        marginBottom: 3
      }}>
          <PixelTag hex={node.hex} label={node.pixelTag} />
          <span style={{
          fontSize: 14,
          fontWeight: 700,
          color: isDark ? COLOR.milletClay : COLOR.charBlack
        }}>{node.oshiwambo}</span>
          <span style={{
          fontSize: 10,
          color: inkAlpha(0.66)
        }}>{node.english}</span>
        </div>
        <span style={{
        fontSize: 9,
        fontWeight: 700,
        letterSpacing: '0.13em',
        textTransform: 'uppercase' as const,
        color: inkOn(node.hex, isDark ? COLOR.darkCard : EDITOR_SURFACE.paperWarm, isDark)
      }}>{node.role}</span>
      </div>
    </div>;
};

// ─── Heatmap Block ────────────────────────────────────────────────────────────
const HeatmapBlock = ({
  block,
  isDark,
  isConfiguring,
  onEditChange
}: {
  block: DocBlock;
  isDark: boolean;
  isConfiguring: boolean;
  onEditChange: (u: Partial<DocBlock>) => void;
}) => {
  const getHeatColor = (intensity: number) => {
    if (intensity > 0.85) return COLOR.firedRed;
    if (intensity > 0.65) return COLOR.ochreOrange;
    if (intensity > 0.45) return COLOR.mahanguGold;
    if (intensity > 0.25) return COLOR.barkRust;
    if (intensity > 0.1) return COLOR.mopaneBrown;
    return COLOR.charBlack;
  };
  const cells = block.heatmapData ? JSON.parse(block.heatmapData) as Array<{
    row: number;
    col: number;
    intensity: number;
  }> : HEATMAP_CELLS;
  const rowLabels = HEATMAP_LABELS_Y;
  const colLabels = HEATMAP_LABELS_X;
  const numRows = rowLabels.length;
  const numCols = colLabels.length;
  const getCell = (r: number, c: number) => cells.find(cell => cell.row === r && cell.col === c)?.intensity ?? 0;
  const updateCell = (r: number, c: number, val: number) => {
    const next = cells.map(cell => cell.row === r && cell.col === c ? {
      ...cell,
      intensity: val
    } : cell);
    onEditChange({
      heatmapData: JSON.stringify(next)
    });
  };
  if (isConfiguring) {
    return <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: 12
    }}>
        <label style={{
        fontSize: 9,
        fontWeight: 700,
        letterSpacing: '0.12em',
        textTransform: 'uppercase' as const,
        color: paperAlpha(0.55),
        display: 'block'
      }}>Edit Cell Intensities (0.0 – 1.0)</label>
        <div style={{
        background: COLOR.charBlack,
        padding: '12px 14px',
        overflowX: 'auto'
      }}>
          <div style={{
          display: 'flex',
          gap: 4,
          marginBottom: 6,
          paddingLeft: 58
        }}>
            {colLabels.map((lbl, ci) => <div key={`hcfg-x-${ci}`} style={{
            width: 36,
            textAlign: 'center',
            fontSize: 9,
            color: paperAlpha(0.55),
            fontWeight: 700
          }}>{lbl}</div>)}
          </div>
          {Array.from({
          length: numRows
        }, (_, ri) => <div key={`hcfg-row-${ri}`} style={{
          display: 'flex',
          alignItems: 'center',
          gap: 4,
          marginBottom: 4
        }}>
              <div style={{
            width: 72,
            fontSize: 9,
            color: paperAlpha(0.55),
            fontWeight: 700,
            textAlign: 'right',
            paddingRight: 6,
            flexShrink: 0
          }}>{rowLabels[ri]}</div>
              {Array.from({
            length: numCols
          }, (_, ci) => {
            const val = getCell(ri, ci);
            return <div key={`hcfg-cell-${ri}-${ci}`} style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 2
            }}>
                  <div style={{
                width: 36,
                height: 20,
                background: getHeatColor(val),
                cursor: 'pointer'
              }} />
                  <input type="number" min="0" max="1" step="0.05" value={val.toFixed(2)} onChange={e => updateCell(ri, ci, Math.max(0, Math.min(1, Number(e.target.value))))} style={{
                width: 36,
                fontSize: 9,
                background: 'transparent',
                border: `1px solid ${paperAlpha(0.1)}`,
                outline: 'none',
                padding: '2px 3px',
                color: paperAlpha(0.66),
                textAlign: 'center'
              }} />
                </div>;
          })}
            </div>)}
        </div>
        <p style={{
        fontSize: 9,
        color: paperAlpha(0.55),
        margin: 0
      }}>Enter values 0.0 (inactive) to 1.0 (maximum activity) for each cell.</p>
      </div>;
  }
  return <div style={{
    background: COLOR.charBlack,
    padding: '16px 20px'
  }}>
      <div style={{
      display: 'flex',
      gap: 6,
      marginBottom: 6,
      paddingLeft: 72
    }}>
        {colLabels.map((label, i) => <div key={`hx-doc-${i}`} style={{
        flex: 1,
        textAlign: 'center',
        fontSize: 9,
        fontWeight: 700,
        letterSpacing: '0.12em',
        textTransform: 'uppercase' as const,
        color: paperAlpha(0.55)
      }}>{label}</div>)}
      </div>
      {rowLabels.map((yLabel, rowIdx) => <div key={`hr-doc-${rowIdx}`} style={{
      display: 'flex',
      alignItems: 'center',
      gap: 6,
      marginBottom: 3
    }}>
          <div style={{
        width: 72,
        fontSize: 9,
        color: paperAlpha(0.55),
        fontWeight: 700,
        textAlign: 'right',
        paddingRight: 8,
        flexShrink: 0
      }}>{yLabel}</div>
          {cells.filter(c => c.row === rowIdx).map(cell => <div key={`hc-doc-${cell.row}-${cell.col}`} style={{
        flex: 1,
        aspectRatio: '1',
        background: getHeatColor(cell.intensity)
      }} />)}
        </div>)}
      <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: 6,
      marginTop: 8
    }}>
        <span style={{
        fontSize: 9,
        fontWeight: 700,
        letterSpacing: '0.12em',
        textTransform: 'uppercase' as const,
        color: paperAlpha(0.55)
      }}>Low</span>
        {[COLOR.charBlack, COLOR.mopaneBrown, COLOR.barkRust, COLOR.mahanguGold, COLOR.ochreOrange, COLOR.firedRed].map((c, i) => <div key={`hl-doc-${i}`} style={{
        width: 12,
        height: 12,
        background: c
      }} />)}
        <span style={{
        fontSize: 9,
        fontWeight: 700,
        letterSpacing: '0.12em',
        textTransform: 'uppercase' as const,
        color: paperAlpha(0.55)
      }}>High</span>
      </div>
    </div>;
};

// ─── Market Chart Block ───────────────────────────────────────────────────────
const MarketChartBlock = ({
  block,
  isDark,
  isConfiguring,
  onEditChange
}: {
  block: DocBlock;
  isDark: boolean;
  isConfiguring: boolean;
  onEditChange: (u: Partial<DocBlock>) => void;
}) => {
  const muted = isDark ? paperAlpha(0.55) : inkAlpha(0.66);
  const border = isDark ? paperAlpha(0.08) : inkAlpha(0.08);
  const chartTitle = block.chartTitle ?? 'Global AI Market Growth';
  const chartData = block.marketData ? JSON.parse(block.marketData) as Array<{
    year: string;
    value: number;
  }> : DEFAULT_AI_MARKET_DATA;
  if (isConfiguring) {
    return <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: 12
    }}>
        <div>
          <label style={{
          fontSize: 9,
          fontWeight: 700,
          letterSpacing: '0.12em',
          textTransform: 'uppercase' as const,
          color: muted,
          display: 'block',
          marginBottom: 4
        }}>Chart Title</label>
          <input value={chartTitle} onChange={e => onEditChange({
          chartTitle: e.target.value
        })} style={{
          width: '100%',
          fontSize: 12,
          color: isDark ? COLOR.milletClay : COLOR.charBlack,
          background: 'transparent',
          border: `1px solid ${border}`,
          outline: 'none',
          padding: '6px 8px'
        }} />
        </div>
        <div>
          <label style={{
          fontSize: 9,
          fontWeight: 700,
          letterSpacing: '0.12em',
          textTransform: 'uppercase' as const,
          color: muted,
          display: 'block',
          marginBottom: 8
        }}>Data Points</label>
          <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 6
        }}>
            {chartData.map((row, i) => <div key={`mkt-edit-${i}`} style={{
            display: 'flex',
            gap: 8,
            alignItems: 'center'
          }}>
                <input value={row.year} onChange={e => {
              const next = chartData.map((r, ri) => ri === i ? {
                ...r,
                year: e.target.value
              } : r);
              onEditChange({
                marketData: JSON.stringify(next)
              });
            }} style={{
              flex: 1,
              fontSize: 11,
              background: 'transparent',
              border: `1px solid ${border}`,
              outline: 'none',
              padding: '4px 8px',
              color: isDark ? COLOR.milletClay : COLOR.charBlack
            }} placeholder="Year" />
                <input type="number" value={row.value} onChange={e => {
              const next = chartData.map((r, ri) => ri === i ? {
                ...r,
                value: Number(e.target.value)
              } : r);
              onEditChange({
                marketData: JSON.stringify(next)
              });
            }} style={{
              flex: 1,
              fontSize: 11,
              background: 'transparent',
              border: `1px solid ${border}`,
              outline: 'none',
              padding: '4px 8px',
              color: COLOR.barkRust
            }} placeholder="$B" />
                <span style={{
              fontSize: 9,
              color: muted,
              flexShrink: 0
            }}>$B</span>
                <button onClick={() => {
              const next = chartData.filter((_, ri) => ri !== i);
              onEditChange({
                marketData: JSON.stringify(next)
              });
            }} style={{
              fontSize: 9,
              color: COLOR.firedRed,
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              flexShrink: 0,
              paddingTop: 6
            }}>✕</button>
              </div>)}
          </div>
          <button onClick={() => {
          const next = [...chartData, {
            year: 'Year',
            value: 0
          }];
          onEditChange({
            marketData: JSON.stringify(next)
          });
        }} style={{
          marginTop: 8,
          fontSize: 9,
          fontWeight: 600,
          color: COLOR.barkRust,
          background: 'transparent',
          border: `1px solid ${COLOR.ochreOrange}50`,
          cursor: 'pointer',
          padding: '4px 10px',
          alignSelf: 'flex-start'
        }}>
            + Add Point
          </button>
        </div>
      </div>;
  }
  return <div style={{
    background: isDark ? COLOR.darkCard : EDITOR_SURFACE.paperWarm,
    border: `1px solid ${isDark ? paperAlpha(0.1) : inkAlpha(0.1)}`,
    padding: '16px 20px'
  }}>
      <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      marginBottom: 12
    }}>
        <PixelDot color={COLOR.ochreOrange} size={5} />
        <span style={{
        fontSize: 9,
        fontWeight: 700,
        letterSpacing: '0.14em',
        textTransform: 'uppercase' as const,
        color: COLOR.barkRust
      }}>{chartTitle}</span>
        <span style={{
        fontSize: 9,
        color: muted,
        marginLeft: 'auto'
      }}>2023–2033 · USD Billions</span>
      </div>
      <div style={{
      width: '100%',
      height: 160
    }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{
          top: 4,
          right: 8,
          left: 0,
          bottom: 0
        }}>
            <defs>
              <linearGradient id="doc-area-grad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={COLOR.ochreOrange} stopOpacity={0.3} />
                <stop offset="95%" stopColor={COLOR.ochreOrange} stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <XAxis dataKey="year" tick={{
            fontSize: 9,
            fill: muted
          }} axisLine={false} tickLine={false} />
            <YAxis tick={{
            fontSize: 9,
            fill: muted
          }} axisLine={false} tickLine={false} tickFormatter={v => `$${v}B`} />
            <Tooltip contentStyle={{
            background: COLOR.charBlack,
            border: `1px solid ${COLOR.ochreOrange}40`,
            borderRadius: 0,
            fontSize: 10
          }} labelStyle={{
            color: COLOR.barkRust
          }} itemStyle={{
            color: COLOR.milletClay
          }} formatter={(v: number) => [`$${v}B`, 'Market Size']} />
            <Area type="monotone" dataKey="value" stroke={COLOR.ochreOrange} strokeWidth={2} fill="url(#doc-area-grad)" dot={{
            fill: COLOR.ochreOrange,
            r: 3,
            strokeWidth: 0
          }} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>;
};

// ─── Bar Chart Block ──────────────────────────────────────────────────────────
const BarChartBlock = ({
  block,
  isDark,
  isConfiguring,
  onEditChange
}: {
  block: DocBlock;
  isDark: boolean;
  isConfiguring: boolean;
  onEditChange: (u: Partial<DocBlock>) => void;
}) => {
  const muted = isDark ? paperAlpha(0.55) : inkAlpha(0.66);
  const border = isDark ? paperAlpha(0.08) : inkAlpha(0.08);
  const rawValues = block.barValues ? JSON.parse(block.barValues) as Array<{
    name: string;
    progress: number;
  }> : DEFAULT_BAR_DATA;
  if (isConfiguring) {
    return <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: 10
    }}>
        <label style={{
        fontSize: 9,
        fontWeight: 700,
        letterSpacing: '0.12em',
        textTransform: 'uppercase' as const,
        color: muted
      }}>Edit Bar Values</label>
        {rawValues.map((row, i) => <div key={`bar-edit-${i}`} style={{
        display: 'flex',
        gap: 8,
        alignItems: 'center'
      }}>
            <input value={row.name} onChange={e => {
          const next = rawValues.map((r, ri) => ri === i ? {
            ...r,
            name: e.target.value
          } : r);
          onEditChange({
            barValues: JSON.stringify(next)
          });
        }} style={{
          flex: 2,
          fontSize: 11,
          background: 'transparent',
          border: `1px solid ${border}`,
          outline: 'none',
          padding: '4px 8px',
          color: isDark ? COLOR.milletClay : COLOR.charBlack
        }} placeholder="Name" />
            <input type="number" value={row.progress} min={0} max={100} onChange={e => {
          const next = rawValues.map((r, ri) => ri === i ? {
            ...r,
            progress: Number(e.target.value)
          } : r);
          onEditChange({
            barValues: JSON.stringify(next)
          });
        }} style={{
          flex: 1,
          fontSize: 11,
          background: 'transparent',
          border: `1px solid ${border}`,
          outline: 'none',
          padding: '4px 8px',
          color: COLOR.barkRust
        }} placeholder="%" />
            <span style={{
          fontSize: 9,
          color: muted
        }}>%</span>
          </div>)}
        <button onClick={() => {
        const next = [...rawValues, {
          name: 'New System',
          progress: 0
        }];
        onEditChange({
          barValues: JSON.stringify(next)
        });
      }} style={{
        marginTop: 8,
        fontSize: 9,
        fontWeight: 600,
        color: COLOR.barkRust,
        background: 'transparent',
        border: `1px solid ${COLOR.ochreOrange}50`,
        cursor: 'pointer',
        padding: '4px 10px',
        alignSelf: 'flex-start'
      }}>
          + Add System
        </button>
      </div>;
  }
  return <div style={{
    background: isDark ? COLOR.darkCard : EDITOR_SURFACE.paperWarm,
    border: `1px solid ${isDark ? paperAlpha(0.1) : inkAlpha(0.1)}`,
    padding: '16px 20px'
  }}>
      <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      marginBottom: 12
    }}>
        <PixelDot color={COLOR.barkRust} size={5} />
        <span style={{
        fontSize: 9,
        fontWeight: 700,
        letterSpacing: '0.14em',
        textTransform: 'uppercase' as const,
        color: COLOR.barkRust
      }}>System Build Progress</span>
        <span style={{
        fontSize: 9,
        color: muted,
        marginLeft: 'auto'
      }}>% complete</span>
      </div>
      <div style={{
      width: '100%',
      height: 160
    }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={rawValues} margin={{
          top: 4,
          right: 8,
          left: 0,
          bottom: 0
        }}>
            <XAxis dataKey="name" tick={{
            fontSize: 9,
            fill: muted
          }} axisLine={false} tickLine={false} />
            <YAxis tick={{
            fontSize: 9,
            fill: muted
          }} axisLine={false} tickLine={false} domain={[0, 100]} tickFormatter={v => `${v}%`} />
            <Tooltip contentStyle={{
            background: COLOR.charBlack,
            border: `1px solid ${COLOR.barkRust}40`,
            borderRadius: 0,
            fontSize: 10
          }} labelStyle={{
            color: COLOR.barkRust
          }} itemStyle={{
            color: COLOR.milletClay
          }} formatter={(v: number) => [`${v}%`, 'Progress']} />
            <Bar dataKey="progress" fill={COLOR.barkRust} opacity={0.85} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>;
};

// ─── Principles Block ─────────────────────────────────────────────────────────
const PrinciplesBlock = ({
  block,
  isDark,
  isConfiguring,
  onEditChange
}: {
  block: DocBlock;
  isDark: boolean;
  isConfiguring: boolean;
  onEditChange: (u: Partial<DocBlock>) => void;
}) => {
  const border = isDark ? paperAlpha(0.10) : inkAlpha(0.10);
  const fg = isDark ? paperAlpha(0.80) : inkAlpha(0.80);
  const muted = isDark ? paperAlpha(0.55) : inkAlpha(0.66);
  const principles = block.principlesData ? JSON.parse(block.principlesData) as Array<{
    label: string;
    value: string;
  }> : PRINCIPLES;
  if (isConfiguring) {
    return <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: 10
    }}>
        <label style={{
        fontSize: 9,
        fontWeight: 700,
        letterSpacing: '0.12em',
        textTransform: 'uppercase' as const,
        color: muted,
        display: 'block'
      }}>Edit Principles — Label + Value</label>
        <div>
          <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 6
        }}>
            {principles.map((p, i) => <div key={`pr-edit-${i}`} style={{
            display: 'flex',
            gap: 8,
            alignItems: 'flex-start'
          }}>
                <input value={p.label} onChange={e => {
              const next = principles.map((pr, pi) => pi === i ? {
                ...pr,
                label: e.target.value
              } : pr);
              onEditChange({
                principlesData: JSON.stringify(next)
              });
            }} style={{
              width: 88,
              flexShrink: 0,
              fontSize: 9,
              fontWeight: 700,
              color: COLOR.barkRust,
              background: 'transparent',
              border: `1px solid ${border}`,
              outline: 'none',
              padding: '5px 8px'
            }} placeholder="Label" />
                <input value={p.value} onChange={e => {
              const next = principles.map((pr, pi) => pi === i ? {
                ...pr,
                value: e.target.value
              } : pr);
              onEditChange({
                principlesData: JSON.stringify(next)
              });
            }} style={{
              flex: 1,
              fontSize: 11,
              color: fg,
              background: 'transparent',
              border: `1px solid ${border}`,
              outline: 'none',
              padding: '5px 8px'
            }} placeholder="Value" />
                <button onClick={() => {
              const next = principles.filter((_, pi) => pi !== i);
              onEditChange({
                principlesData: JSON.stringify(next)
              });
            }} style={{
              fontSize: 9,
              color: COLOR.firedRed,
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              flexShrink: 0,
              paddingTop: 6
            }}>✕</button>
              </div>)}
          </div>
          <button onClick={() => {
          const next = [...principles, {
            label: 'New',
            value: 'New principle'
          }];
          onEditChange({
            principlesData: JSON.stringify(next)
          });
        }} style={{
          marginTop: 8,
          fontSize: 9,
          fontWeight: 600,
          color: COLOR.barkRust,
          background: 'transparent',
          border: `1px solid ${COLOR.ochreOrange}50`,
          cursor: 'pointer',
          padding: '4px 10px',
          alignSelf: 'flex-start'
        }}>
            + Add Row
          </button>
        </div>
      </div>;
  }
  return <dl style={{
    borderTop: `1px solid ${border}`
  }}>
      {principles.map(p => <div key={p.label} style={{
      display: 'flex',
      gap: 24,
      padding: '10px 0',
      borderBottom: `1px solid ${border}`
    }}>
          <dt style={{
        fontSize: 9,
        fontWeight: 700,
        letterSpacing: '0.14em',
        textTransform: 'uppercase' as const,
        color: COLOR.barkRust,
        width: 80,
        flexShrink: 0,
        paddingTop: 2
      }}>{p.label}</dt>
          <dd style={{
        fontSize: 12,
        color: fg,
        lineHeight: 1.65
      }}>{p.value}</dd>
        </div>)}
    </dl>;
};

// ─── Swatch Row Block ─────────────────────────────────────────────────────────
const SwatchRowBlock = ({
  block,
  isDark,
  isConfiguring,
  onEditChange
}: {
  block: DocBlock;
  isDark: boolean;
  isConfiguring: boolean;
  onEditChange: (u: Partial<DocBlock>) => void;
}) => {
  const muted = isDark ? paperAlpha(0.55) : inkAlpha(0.66);
  const border = isDark ? paperAlpha(0.08) : inkAlpha(0.08);
  const swatches = block.swatchData ? JSON.parse(block.swatchData) as Array<{
    name: string;
    hex: string;
  }> : SWATCHES.map(s => ({
    name: s.name,
    hex: s.hex
  }));
  if (isConfiguring) {
    return <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: 8
    }}>
        <label style={{
        fontSize: 9,
        fontWeight: 700,
        letterSpacing: '0.12em',
        textTransform: 'uppercase' as const,
        color: muted,
        display: 'block'
      }}>Edit Swatches</label>
        {swatches.map((sw, i) => <div key={`sw-edit-${i}`} style={{
        display: 'flex',
        gap: 8,
        alignItems: 'center'
      }}>
            <div style={{
          width: 28,
          height: 28,
          background: sw.hex,
          border: `1px solid ${border}`,
          flexShrink: 0
        }} />
            <input value={sw.hex} onChange={e => {
          const next = swatches.map((s, si) => si === i ? {
            ...s,
            hex: e.target.value
          } : s);
          onEditChange({
            swatchData: JSON.stringify(next)
          });
        }} style={{
          width: 80,
          fontSize: 10,
          background: 'transparent',
          border: `1px solid ${border}`,
          outline: 'none',
          padding: '4px 6px',
          color: isDark ? COLOR.milletClay : COLOR.charBlack,
          fontFamily: FONT.mono
        }} placeholder="#hex" />
            <input value={sw.name} onChange={e => {
          const next = swatches.map((s, si) => si === i ? {
            ...s,
            name: e.target.value
          } : s);
          onEditChange({
            swatchData: JSON.stringify(next)
          });
        }} style={{
          flex: 1,
          fontSize: 10,
          background: 'transparent',
          border: `1px solid ${border}`,
          outline: 'none',
          padding: '4px 6px',
          color: isDark ? COLOR.milletClay : COLOR.charBlack
        }} placeholder="Name" />
            <button onClick={() => {
          const next = swatches.filter((_, si) => si !== i);
          onEditChange({
            swatchData: JSON.stringify(next)
          });
        }} style={{
          fontSize: 9,
          color: COLOR.firedRed,
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
          flexShrink: 0
        }}>✕</button>
          </div>)}
        <button onClick={() => {
        const next = [...swatches, {
          name: 'New Colour',
          hex: EDITOR_SURFACE.smokeGray
        }];
        onEditChange({
          swatchData: JSON.stringify(next)
        });
      }} style={{
        fontSize: 9,
        fontWeight: 600,
        color: COLOR.barkRust,
        background: 'transparent',
        border: `1px solid ${COLOR.ochreOrange}50`,
        cursor: 'pointer',
        padding: '4px 10px',
        alignSelf: 'flex-start'
      }}>
            + Add Swatch
          </button>
      </div>;
  }
  return <div style={{
    display: 'flex',
    gap: 8,
    flexWrap: 'wrap' as const
  }}>
      {swatches.map(sw => <div key={sw.hex} style={{
      display: 'flex',
      flexDirection: 'column',
      gap: 4,
      minWidth: 52
    }}>
          <div style={{
        width: 52,
        height: 52,
        background: sw.hex,
        border: `1px solid ${inkAlpha(0.10)}`
      }} />
          <span style={{
        fontSize: 9,
        fontWeight: 600,
        color: isDark ? COLOR.milletClay : COLOR.charBlack,
        lineHeight: 1.2
      }}>{sw.name}</span>
          <span style={{
        fontSize: 9,
        color: muted
      }}>{sw.hex}</span>
        </div>)}
    </div>;
};

interface SourceLink {
  label: string;
  url: string;
}
interface SourceEntry {
  label: string;
  detail: string;
  url?: string;
  links?: SourceLink[];
}
const DEFAULT_SOURCES: SourceEntry[] = [
  { label: 'Source name', detail: 'What this source supports in the paper.', url: '' }
];
const sourceLinks = (source: SourceEntry): SourceLink[] => {
  if (source.links?.length) return source.links.filter(link => link.url.trim());
  if (!source.url?.trim()) return [];
  return source.url.split(/\s+/).filter(Boolean).map((url, idx) => ({
    label: String.fromCharCode(65 + idx),
    url
  }));
};
const parseSources = (sourcesData?: string): SourceEntry[] => {
  if (!sourcesData) return DEFAULT_SOURCES;
  try {
    const parsed = JSON.parse(sourcesData);
    return Array.isArray(parsed) && parsed.length ? parsed : DEFAULT_SOURCES;
  } catch {
    return DEFAULT_SOURCES;
  }
};

const SourcesBlock = ({
  block,
  isDark,
  isConfiguring,
  onEditChange
}: {
  block: DocBlock;
  isDark: boolean;
  isConfiguring: boolean;
  onEditChange: (u: Partial<DocBlock>) => void;
}) => {
  const muted = isDark ? paperAlpha(0.55) : inkAlpha(0.66);
  const fg = isDark ? paperAlpha(0.78) : inkAlpha(0.82);
  const border = isDark ? paperAlpha(0.10) : inkAlpha(0.10);
  const sources = parseSources(block.sourcesData);
  const updateSource = (idx: number, updates: Partial<(typeof sources)[number]>) => {
    onEditChange({
      sourcesData: JSON.stringify(sources.map((source, sourceIdx) => sourceIdx === idx ? {
        ...source,
        ...updates
      } : source))
    });
  };
  if (isConfiguring) {
    return <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: 10
    }}>
        <label style={{
        fontSize: 9,
        fontWeight: 700,
        letterSpacing: '0.12em',
        textTransform: 'uppercase' as const,
        color: muted
      }}>Edit Sources</label>
        <p style={{
        fontSize: 10,
        lineHeight: 1.45,
        color: muted,
        margin: 0
      }}>Use citation markers like [1]–[{sources.length}] in body text. The source order below controls the numbers.</p>
        {sources.map((source, i) => <div key={`source-edit-${i}`} style={{
        display: 'grid',
        gridTemplateColumns: '42px 1fr 1.3fr',
        gap: 8,
        padding: 10,
        border: `1px solid ${border}`
      }}>
            <div style={{
          fontSize: 10,
          fontWeight: 800,
          color: COLOR.barkRust,
          alignSelf: 'center'
        }}>{`[${i + 1}]`}</div>
            <input value={source.label} onChange={e => updateSource(i, {
          label: e.target.value
        })} style={{
          fontSize: 10,
          fontWeight: 700,
          color: COLOR.mopaneBrown,
          background: 'transparent',
          border: `1px solid ${border}`,
          outline: 'none',
          padding: '5px 7px'
        }} placeholder="Source name" />
            <input value={(source.links?.map(link => link.url).join(' ') || source.url) ?? ''} onChange={e => updateSource(i, {
          links: e.target.value.split(/\s+/).filter(Boolean).map((url, linkIdx) => ({
            label: String.fromCharCode(65 + linkIdx),
            url
          })),
          url: e.target.value
        })} style={{
          fontSize: 10,
          color: muted,
          background: 'transparent',
          border: `1px solid ${border}`,
          outline: 'none',
          padding: '5px 7px'
        }} placeholder="URL or citation" />
            <textarea value={source.detail} onChange={e => updateSource(i, {
          detail: e.target.value
        })} style={{
          gridColumn: '1 / -1',
          fontSize: 11,
          lineHeight: 1.55,
          color: fg,
          background: 'transparent',
          border: `1px solid ${border}`,
          outline: 'none',
          padding: '6px 8px',
          minHeight: 54,
          resize: 'vertical',
          whiteSpace: 'pre-wrap'
        }} placeholder="What this source supports" />
            <button onClick={() => onEditChange({
          sourcesData: JSON.stringify(sources.filter((_, sourceIdx) => sourceIdx !== i))
        })} style={{
          gridColumn: '1 / -1',
          justifySelf: 'start',
          fontSize: 9,
          color: COLOR.firedRed,
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
          padding: 0
        }}>Remove source</button>
          </div>)}
        <button onClick={() => onEditChange({
        sourcesData: JSON.stringify([...sources, {
          label: 'New source',
          detail: 'What this source supports.',
          links: []
        }])
      })} style={{
        fontSize: 9,
        fontWeight: 600,
        color: COLOR.barkRust,
        background: 'transparent',
        border: `1px solid ${COLOR.ochreOrange}50`,
        cursor: 'pointer',
        padding: '4px 10px',
        alignSelf: 'flex-start'
      }}>+ Add Source</button>
      </div>;
  }
  return <section style={{
    borderTop: `1px solid ${border}`,
    paddingTop: 14
  }}>
      <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      marginBottom: 10
    }}>
        <PixelDot color={COLOR.mopaneBrown} size={5} />
        <span style={{
        fontSize: 9,
        fontWeight: 700,
        letterSpacing: '0.16em',
        textTransform: 'uppercase' as const,
        color: COLOR.mopaneBrown
      }}>{block.content || 'Sources'}</span>
      </div>
      <p style={{
      fontSize: 10,
      lineHeight: 1.45,
      color: muted,
      margin: '0 0 10px'
    }}>Inline citations use bracket markers: [1]–[{sources.length}].</p>
      <ol style={{
      margin: 0,
      paddingLeft: 0,
      display: 'flex',
      flexDirection: 'column',
      gap: 8,
      listStyle: 'none'
    }}>
        {sources.map((source, i) => {
      const links = sourceLinks(source);
      return <li id={`source-${i + 1}`} key={`source-${i}`} style={{
        fontSize: 11,
        lineHeight: 1.55,
        color: fg,
        display: 'grid',
        gridTemplateColumns: '34px 1fr',
        gap: 8,
        whiteSpace: 'nowrap',
        scrollMarginTop: 24
      }}>
            <a href={`#source-${i + 1}`} style={{
          color: COLOR.barkRust,
          fontWeight: 800,
          fontFamily: 'Inter, Arial, sans-serif',
          textDecoration: 'none'
        }}>{`[${i + 1}]`}</a>
            <span style={{
          display: 'inline-flex',
          alignItems: 'baseline',
          maxWidth: '100%',
          minWidth: 0,
          overflow: 'hidden',
        }}>
              <span style={{
            minWidth: 0,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
          }}>
                <strong style={{ color: isDark ? COLOR.milletClay : COLOR.charBlack }}>{source.label}</strong>
                <span>{source.detail ? ` — ${source.detail}` : ''}</span>
              </span>
              {links.length > 0 && <span style={{
          display: 'inline-flex',
          flexShrink: 0,
          gap: 5,
          marginLeft: 8,
          verticalAlign: 'baseline'
        }}>{links.map(link => <a key={`${source.label}-${link.label}-${link.url}`} href={link.url} target="_blank" rel="noreferrer" title={link.url} style={{
            color: COLOR.barkRust,
            fontFamily: 'Inter, Arial, sans-serif',
            fontSize: 9,
            fontWeight: 800,
            textDecoration: 'none'
          }}>{link.label}</a>)}</span>}
            </span>
          </li>;
    })}
      </ol>
    </section>;
};

const SpacerBlock = ({
  block,
  isDark,
  isConfiguring,
  onEditChange
}: {
  block: DocBlock;
  isDark: boolean;
  isConfiguring: boolean;
  onEditChange: (u: Partial<DocBlock>) => void;
}) => {
  const height = block.spacerHeight ?? 48;
  const muted = isDark ? paperAlpha(0.55) : inkAlpha(0.66);
  const border = isDark ? paperAlpha(0.12) : inkAlpha(0.12);
  if (isConfiguring) {
    return <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: 8
    }}>
      <label style={{
        fontSize: 9,
        fontWeight: 700,
        letterSpacing: '0.12em',
        textTransform: 'uppercase' as const,
        color: muted
      }}>Spacer Height</label>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 10
      }}>
        <input type="range" min={12} max={180} step={4} value={height} onChange={e => onEditChange({
          spacerHeight: Number(e.target.value)
        })} style={{ flex: 1 }} />
        <input type="number" min={12} max={240} value={height} onChange={e => onEditChange({
          spacerHeight: Math.max(12, Math.min(240, Number(e.target.value) || 12))
        })} style={{
          width: 62,
          fontSize: 10,
          color: isDark ? COLOR.milletClay : COLOR.charBlack,
          background: 'transparent',
          border: `1px solid ${border}`,
          padding: '4px 6px'
        }} />
      </div>
    </div>;
  }
  return <div style={{
    height,
    position: 'relative'
  }}>
    <div data-onganda-export-ui="true" style={{
      position: 'absolute',
      inset: 0,
      borderTop: `1px solid ${COLOR.ochreOrange}55`,
      borderBottom: `1px solid ${COLOR.ochreOrange}30`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: muted,
      fontSize: 9,
      fontWeight: 700,
      letterSpacing: '0.12em',
      textTransform: 'uppercase' as const
    }}>{`${height}px space`}</div>
  </div>;
};

const SignatureBlock = ({
  block,
  isDark,
  isConfiguring,
  onEditChange,
  onStartEdit
}: {
  block: DocBlock;
  isDark: boolean;
  isConfiguring: boolean;
  onEditChange: (u: Partial<DocBlock>) => void;
  onStartEdit?: () => void;
}) => {
  const muted = isDark ? paperAlpha(0.55) : inkAlpha(0.66);
  const fg = isDark ? paperAlpha(0.78) : inkAlpha(0.82);
  const border = isDark ? paperAlpha(0.10) : inkAlpha(0.10);
  const author = block.sigAuthor ?? '';
  const year = block.sigYear ?? String(CURRENT_YEAR);
  if (isConfiguring) {
    return <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <label style={{
        fontSize: 9,
        fontWeight: 700,
        letterSpacing: '0.12em',
        textTransform: 'uppercase' as const,
        color: muted
      }}>Edit Attribution</label>
      <input value={author} onChange={e => onEditChange({
        sigAuthor: e.target.value,
        content: `Prepared by ${e.target.value} · ${year}`
      })} style={{
        fontSize: 11,
        color: fg,
        background: 'transparent',
        border: `1px solid ${border}`,
        outline: 'none',
        padding: '6px 8px',
        letterSpacing: '0.06em'
      }} placeholder="Author name" />
      <input value={year} onChange={e => onEditChange({
        sigYear: e.target.value,
        content: `Prepared by ${author} · ${e.target.value}`
      })} style={{
        fontSize: 11,
        color: fg,
        background: 'transparent',
        border: `1px solid ${border}`,
        outline: 'none',
        padding: '6px 8px',
        letterSpacing: '0.06em',
        width: 80
      }} placeholder="Year" />
    </div>;
  }
  const displayText = block.sigAuthor
    ? `Prepared by ${block.sigAuthor} · ${block.sigYear ?? CURRENT_YEAR}`
    : block.content;
  return <div style={{
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    padding: '12px 0'
  }}>
    <OngandaLogoMark size={18} />
    <span style={{
      fontSize: 11,
      color: muted,
      letterSpacing: '0.06em',
      cursor: 'text',
      whiteSpace: 'pre-wrap'
    }} onDoubleClick={() => onStartEdit?.()}>{displayText}</span>
  </div>;
};

const DEFAULT_LETTERHEAD = {
  title: 'Document Title',
  subtitle: 'A two-track model for local AI capability, applied tooling, and institutional deployment.',
  label: 'Concept Paper',
  status: DOCUMENT_STATUS,
  byline: DOCUMENT_BYLINE,
  year: String(CURRENT_YEAR)
};

const parseLetterhead = (data?: string) => {
  if (!data) return DEFAULT_LETTERHEAD;
  try { return { ...DEFAULT_LETTERHEAD, ...JSON.parse(data) }; }
  catch { return DEFAULT_LETTERHEAD; }
};

const LetterheadBlock = ({
  block,
  isDark,
  isConfiguring,
  onEditChange
}: {
  block: DocBlock;
  isDark: boolean;
  isConfiguring: boolean;
  onEditChange: (u: Partial<DocBlock>) => void;
}) => {
  const fg = isDark ? COLOR.milletClay : COLOR.charBlack;
  const muted = isDark ? paperAlpha(0.55) : inkAlpha(0.66);
  const border = isDark ? paperAlpha(0.10) : inkAlpha(0.10);
  const dotColors = [COLOR.ochreOrange, COLOR.firedRed, COLOR.mahanguGold, COLOR.mopaneBrown, COLOR.dyePlum];
  const lh = parseLetterhead(block.letterheadData);
  const update = (patch: Partial<typeof DEFAULT_LETTERHEAD>) => {
    const next = { ...lh, ...patch };
    onEditChange({ letterheadData: JSON.stringify(next) });
  };

  if (isConfiguring) {
    return <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <label style={{
        fontSize: 9, fontWeight: 700, letterSpacing: '0.12em',
        textTransform: 'uppercase' as const, color: muted
      }}>Edit Letterhead</label>
      <input value={lh.title} onChange={e => update({ title: e.target.value })} style={{
        fontSize: 14, fontWeight: 700, color: fg, background: 'transparent',
        border: `1px solid ${border}`, outline: 'none', padding: '6px 8px',
        letterSpacing: '-0.01em'
      }} placeholder="Title" />
      <input value={lh.subtitle} onChange={e => update({ subtitle: e.target.value })} style={{
        fontSize: 11, color: muted, background: 'transparent',
        border: `1px solid ${border}`, outline: 'none', padding: '6px 8px'
      }} placeholder="Subtitle" />
      <div style={{ display: 'flex', gap: 10 }}>
        <input value={lh.label} onChange={e => update({ label: e.target.value })} style={{
          flex: 1, fontSize: 10, fontWeight: 700, color: COLOR.barkRust,
          background: 'transparent', border: `1px solid ${border}`, outline: 'none',
          padding: '6px 8px', letterSpacing: '0.14em', textTransform: 'uppercase'
        }} placeholder="Label" />
        <input value={lh.status} onChange={e => update({ status: e.target.value })} style={{
          flex: 1, fontSize: 10, fontWeight: 700, color: muted,
          background: 'transparent', border: `1px solid ${border}`, outline: 'none',
          padding: '6px 8px', letterSpacing: '0.12em', textTransform: 'uppercase'
        }} placeholder="Status" />
      </div>
      <div style={{ display: 'flex', gap: 10 }}>
        <input value={lh.byline} onChange={e => update({ byline: e.target.value })} style={{
          flex: 2, fontSize: 11, color: muted, background: 'transparent',
          border: `1px solid ${border}`, outline: 'none', padding: '6px 8px',
          letterSpacing: '0.06em'
        }} placeholder="Byline" />
        <input value={lh.year} onChange={e => update({ year: e.target.value })} style={{
          width: 80, fontSize: 11, color: muted, background: 'transparent',
          border: `1px solid ${border}`, outline: 'none', padding: '6px 8px',
          letterSpacing: '0.06em'
        }} placeholder="Year" />
      </div>
    </div>;
  }

  return <div>
    <div style={{ height: 3, background: COLOR.ochreOrange, width: '100%' }} />
    <div style={{
      display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
      padding: '28px 56px 24px', borderBottom: `1px solid ${border}`, gap: 20
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <OngandaLogoMark size={32} />
        <div>
          <p style={{ fontSize: 14, fontWeight: 700, letterSpacing: '-0.01em', color: COLOR.barkRust, lineHeight: 1.1 }}>Onganda</p>
          <p style={{ fontSize: 10, color: muted, letterSpacing: '0.05em', marginTop: 2 }}>Namibia AI Systems Lab</p>
        </div>
      </div>
      <div style={{ textAlign: 'right' }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          padding: '3px 10px', border: `1px solid ${COLOR.ochreOrange}50`, marginBottom: 8
        }}>
          <PixelDot color={COLOR.ochreOrange} size={5} />
          <span style={{
            fontSize: 9, fontWeight: 700, letterSpacing: '0.18em',
            textTransform: 'uppercase' as const, color: COLOR.barkRust
          }}>{lh.label}</span>
        </div>
        <p style={{
          fontSize: 9, fontWeight: 700, color: muted,
          letterSpacing: '0.12em', textTransform: 'uppercase' as const
        }}>{lh.status}</p>
      </div>
    </div>
    <div style={{ padding: '36px 56px 28px' }}>
      <h1 style={{
        fontSize: 24, fontWeight: 700, letterSpacing: '-0.025em',
        color: fg, lineHeight: 1.2, marginBottom: 10, maxWidth: 600
      }}>{lh.title}</h1>
      <p style={{
        fontSize: 14, color: isDark ? paperAlpha(0.55) : inkAlpha(0.66),
        lineHeight: 1.6, maxWidth: 520, marginBottom: 22
      }}>{lh.subtitle}</p>
      <div style={{
        display: 'flex', flexWrap: 'wrap' as const,
        alignItems: 'center', gap: '7px 10px',
        color: muted, fontSize: 10, letterSpacing: '0.06em',
        marginTop: -10, marginBottom: 24
      }}>
        <span>{lh.byline}</span>
        <span aria-hidden="true">·</span>
        <span>{lh.year}</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        {dotColors.map((c, i) => <div key={`lh-dot-${i}`} style={{ width: 5, height: 5, background: c }} />)}
        <div style={{ flex: 1, height: 1, background: border }} />
      </div>
    </div>
  </div>;
};

const DesignChartGalleryBlock = ({ isDark }: { isDark: boolean }) => (
  <div style={{
    background: isDark ? COLOR.darkCard : COLOR.dustLight,
    border: `1px solid ${isDark ? paperAlpha(0.1) : inkAlpha(0.1)}`,
    overflow: 'hidden'
  }}>
    <div style={{
      padding: '14px 18px',
      borderBottom: `1px solid ${isDark ? paperAlpha(0.1) : inkAlpha(0.1)}`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 12
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <PixelDot color={COLOR.dyePlum} size={5} />
        <span style={{
          fontSize: 9,
          fontWeight: 700,
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
          color: COLOR.dyePlum
        }}>Reusable Chart System</span>
      </div>
      <span style={{
        fontSize: 9,
        color: isDark ? paperAlpha(0.55) : inkAlpha(0.66)
      }}>from @onganda/design-system</span>
    </div>
    <div style={{
      maxHeight: 760,
      overflow: 'auto',
      paddingTop: 22
    }}>
      <ChartGallery />
    </div>
  </div>
);

// ─── Block renderer ───────────────────────────────────────────────────────────
function DocBlockView({
  block,
  isDark,
  isSelected,
  isEditing,
  isConfiguring,
  dragState,
  citationCount,
  idx,
  onSelect,
  onStartEdit,
  onStopEdit,
  onEdit,
  onDelete,
  onDragStart,
  onDragOver,
  onDragEnd,
  onMoveUp,
  onMoveDown,
  onMoveToNextPage,
  onMoveToPreviousPage,
  onRegenerate,
  regenerating = false
}: {
  block: DocBlock;
  isDark: boolean;
  isSelected: boolean;
  isEditing: boolean;
  isConfiguring: boolean;
  dragState: DragState;
  citationCount: number;
  idx: number;
  onSelect: () => void;
  onStartEdit: () => void;
  onStopEdit: () => void;
  onEdit: (updates: Partial<DocBlock>) => void;
  onDelete: () => void;
  onDragStart: () => void;
  onDragOver: () => void;
  onDragEnd: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onMoveToNextPage: () => void;
  onMoveToPreviousPage: () => void;
  onRegenerate?: () => void;
  regenerating?: boolean;
}) {
  const fg = isDark ? COLOR.milletClay : COLOR.charBlack;
  const bodyColor = isDark ? paperAlpha(0.78) : inkAlpha(0.82);
  const muted = isDark ? paperAlpha(0.55) : inkAlpha(0.66);
  const border = isDark ? paperAlpha(0.10) : inkAlpha(0.10);
  const selBorder = `${COLOR.ochreOrange}60`;
  const ACCENT_COLORS = [COLOR.ochreOrange, COLOR.firedRed, COLOR.mahanguGold, COLOR.mopaneBrown, COLOR.dyePlum];
  const accent = ACCENT_COLORS[idx % ACCENT_COLORS.length];
  const isDesignBlock = ['stat', 'terminal', 'heatmap', 'timeline', 'systemcard', 'flowchart', 'principles', 'swatchrow', 'sources', 'spacer', 'chart-market', 'chart-bar', 'chart-gallery', 'signature', 'letterhead'].includes(block.type);
  const isTextBlock = ['heading', 'body', 'pullquote', 'callout', 'list'].includes(block.type);
  const isDragging = dragState.draggingId === block.id;
  const isDragOver = dragState.overIdx === idx && dragState.draggingId !== block.id;
  const sharedTextareaStyle: React.CSSProperties = {
    width: '100%',
    background: isDark ? paperAlpha(0.04) : inkAlpha(0.03),
    border: `1px solid ${COLOR.ochreOrange}60`,
    outline: 'none',
    padding: '8px 10px',
    fontFamily: 'Georgia, serif',
    minHeight: 80
  };
  const innerContent = (() => {
    if (block.type === 'stat') return <StatBlock block={block} isDark={isDark} isConfiguring={isConfiguring} onEditChange={onEdit} />;
    if (block.type === 'terminal') return <TerminalBlock block={block} isDark={isDark} isConfiguring={isConfiguring} onEditChange={onEdit} />;
    if (block.type === 'timeline') return <TimelineBlock block={block} isDark={isDark} isConfiguring={isConfiguring} onEditChange={onEdit} />;
    if (block.type === 'systemcard') return <SystemCardBlock block={block} isDark={isDark} isConfiguring={isConfiguring} onEditChange={onEdit} />;
    if (block.type === 'flowchart') return <FlowNodeBlock block={block} isDark={isDark} isConfiguring={isConfiguring} onEditChange={onEdit} />;
    if (block.type === 'heatmap') return <HeatmapBlock block={block} isDark={isDark} isConfiguring={isConfiguring} onEditChange={onEdit} />;
    if (block.type === 'principles') return <PrinciplesBlock block={block} isDark={isDark} isConfiguring={isConfiguring} onEditChange={onEdit} />;
    if (block.type === 'swatchrow') return <SwatchRowBlock block={block} isDark={isDark} isConfiguring={isConfiguring} onEditChange={onEdit} />;
    if (block.type === 'sources') return <SourcesBlock block={block} isDark={isDark} isConfiguring={isConfiguring} onEditChange={onEdit} />;
    if (block.type === 'spacer') return <SpacerBlock block={block} isDark={isDark} isConfiguring={isConfiguring} onEditChange={onEdit} />;
    if (block.type === 'chart-market') return <MarketChartBlock block={block} isDark={isDark} isConfiguring={isConfiguring} onEditChange={onEdit} />;
    if (block.type === 'chart-bar') return <BarChartBlock block={block} isDark={isDark} isConfiguring={isConfiguring} onEditChange={onEdit} />;
    if (block.type === 'chart-gallery') return <DesignChartGalleryBlock isDark={isDark} />;
    if (block.type === 'divider') {
      return <div style={{
        padding: '8px 0'
      }}><DitherBar color={COLOR.ochreOrange} segments={48} height={3} opacity={0.42} /></div>;
    }
    if (block.type === 'signature') {
      return <SignatureBlock block={block} isDark={isDark} isConfiguring={isConfiguring} onEditChange={onEdit} onStartEdit={onStartEdit} />;
    }
    if (block.type === 'letterhead') {
      return <LetterheadBlock block={block} isDark={isDark} isConfiguring={isConfiguring} onEditChange={onEdit} />;
    }
    if (block.type === 'heading') {
      // The cycling accent stays on the rule, which carries the variety. Only
      // the ordinal text falls back when its hue cannot be read on paper warm
      // (ochre is 3.0:1 there, mahangu gold 1.97:1).
      const headingAccent = ACCENT_COLORS[Math.floor(idx / 2) % ACCENT_COLORS.length];
      const headingInk = inkOn(headingAccent, EDITOR_SURFACE.paperWarm);
      return <div style={{
        display: 'flex',
        alignItems: 'baseline',
        gap: 12,
        paddingBottom: 14,
        borderBottom: `1px solid ${border}`
      }}>
          <span style={{
          fontSize: 9,
          fontWeight: 700,
          letterSpacing: '0.18em',
          textTransform: 'uppercase' as const,
          color: headingInk,
          minWidth: 20
        }}>
            {String(Math.floor(idx / 3) + 1).padStart(2, '0')}
          </span>
          {isEditing ? <InlineInput value={block.content} onChange={v => onEdit({
          content: v
        })} onBlur={onStopEdit} style={{
          flex: 1,
          fontSize: 14,
          fontWeight: 700,
          letterSpacing: '-0.01em',
          color: fg,
          background: 'transparent',
          border: 'none',
          borderBottom: `1px solid ${headingAccent}80`,
          outline: 'none'
        }} /> : <h2 style={{
          fontSize: 14,
          fontWeight: 700,
          letterSpacing: '-0.01em',
          color: fg,
          lineHeight: 1.2,
          flex: 1,
          margin: 0,
          cursor: 'text',
          whiteSpace: 'pre-wrap'
        }} onDoubleClick={() => {
          onStartEdit();
        }}>{renderWithCitations(block.content)}</h2>}
          <div style={{
          flex: 0.3,
          height: 1,
          background: headingAccent,
          opacity: 0.25,
          marginBottom: 3
        }} />
        </div>;
    }
    if (block.type === 'body') {
      return isEditing ? <InlineTextArea value={block.content} onChange={v => onEdit({
        content: v
      })} onBlur={onStopEdit} style={{
        ...sharedTextareaStyle,
        fontSize: 14,
        lineHeight: 1.85,
        color: bodyColor
      }} /> : <p style={{
        fontSize: 14,
        lineHeight: 1.85,
        color: bodyColor,
        margin: 0,
        fontFamily: 'Georgia, serif',
        cursor: 'text',
        whiteSpace: 'pre-wrap'
      }} onDoubleClick={() => {
        onStartEdit();
      }}>{renderWithCitations(block.content)}</p>;
    }
    if (block.type === 'pullquote') {
      return <div style={{
        borderLeft: `3px solid ${COLOR.ochreOrange}`,
        paddingLeft: 20,
        paddingTop: 4,
        paddingBottom: 4
      }}>
          {isEditing ? <InlineTextArea value={block.content} onChange={v => onEdit({
          content: v
        })} onBlur={onStopEdit} style={{
          ...sharedTextareaStyle,
          fontSize: 14,
          fontStyle: 'italic',
          fontWeight: 500,
          color: COLOR.barkRust,
          background: 'transparent',
          border: `1px solid ${COLOR.ochreOrange}40`,
          minHeight: 56
        }} /> : <p style={{
          fontSize: 14,
          fontStyle: 'italic',
          fontWeight: 500,
          color: COLOR.barkRust,
          lineHeight: 1.7,
          margin: 0,
          cursor: 'text',
          whiteSpace: 'pre-wrap'
        }} onDoubleClick={() => {
          onStartEdit();
        }}>{renderWithCitations(block.content)}</p>}
        </div>;
    }
    if (block.type === 'callout') {
      return <div style={{
        padding: '14px 18px',
        background: isDark ? `${COLOR.firedRed}0D` : `${COLOR.firedRed}08`,
        border: `1px solid ${COLOR.firedRed}35`,
        borderLeft: `3px solid ${COLOR.firedRed}`,
        display: 'flex',
        flexDirection: 'column',
        gap: 6
      }}>
          <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6
        }}>
            <PixelDot color={COLOR.firedRed} size={5} />
            <span style={{
            fontSize: 9,
            fontWeight: 700,
            letterSpacing: '0.16em',
            textTransform: 'uppercase' as const,
            color: inkOn(COLOR.firedRed, isDark ? COLOR.darkCard : EDITOR_SURFACE.paperWarm, isDark)
          }}>Note</span>
          </div>
          {isEditing ? <InlineTextArea value={block.content} onChange={v => onEdit({
          content: v
        })} onBlur={onStopEdit} style={{
          ...sharedTextareaStyle,
          fontSize: 12,
          lineHeight: 1.65,
          color: bodyColor,
          background: 'transparent',
          border: `1px solid ${COLOR.firedRed}40`,
          minHeight: 56
        }} /> : <p style={{
          fontSize: 12,
          lineHeight: 1.65,
          color: bodyColor,
          margin: 0,
          cursor: 'text',
          whiteSpace: 'pre-wrap'
        }} onDoubleClick={() => {
          onStartEdit();
        }}>{renderWithCitations(block.content)}</p>}
        </div>;
    }
    if (block.type === 'list') {
      const items = block.content.split(' · ').filter(Boolean);
      return <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 0
      }}>
          {isEditing ? <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 6
        }}>
                <InlineTextArea value={block.content} onChange={v => onEdit({
            content: v
          })} onBlur={onStopEdit} style={{
            ...sharedTextareaStyle,
            fontSize: 12,
            lineHeight: 1.7,
            color: bodyColor,
            minHeight: 80
          }} />
                <span style={{
            fontSize: 9,
            color: muted
          }}>Separate items with " · " (space · space)</span>
              </div> : <ul style={{
          margin: 0,
          padding: 0,
          listStyle: 'none',
          display: 'flex',
          flexDirection: 'column',
          gap: 6
        }}>
                {items.map((item, i) => <li key={`li-${block.id}-${i}`} style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: 10
          }} onDoubleClick={() => {
            onStartEdit();
          }}>
                    <div style={{
              width: 5,
              height: 5,
              background: accent,
              marginTop: 7,
              flexShrink: 0
            }} />
                    <span style={{
              fontSize: 14,
              lineHeight: 1.7,
              color: bodyColor,
              fontFamily: 'Georgia, serif',
              cursor: 'text',
              whiteSpace: 'pre-wrap'
            }}>{renderWithCitations(item)}</span>
                  </li>)}
              </ul>}
        </div>;
    }
    return null;
  })();
  const showToolbar = isSelected;
  const showDividerRemove = false;
  const baseMargin = block.type === 'heading' ? 14 : block.type === 'divider' ? 16 : block.type === 'spacer' ? 4 : 18;
  const marginBefore = block.pageBreakBefore ? block.marginBefore ?? 0 : 0;
  const marginAfter = block.marginAfter ?? 0;
  const canSplitAcrossPages = ['body', 'list', 'sources'].includes(block.type);
  const shouldAvoidPageBreak = block.pageBreakBefore || !canSplitAcrossPages;
  const toolbarButtonStyle: React.CSSProperties = {
    padding: '4px 8px',
    background: 'transparent',
    border: `1px solid ${border}`,
    cursor: 'pointer',
    fontSize: 9,
    fontWeight: 600,
    color: muted
  };
  const insertCitation = (citationNumber: number) => {
    const marker = `[${citationNumber}]`;
    const content = block.content.trimEnd();
    onEdit({
      content: content ? `${content} ${marker}` : marker
    });
  };
  return <div onDragOver={e => {
    e.preventDefault();
    e.stopPropagation();
    onDragOver();
  }} style={{
    position: 'relative',
    outline: isSelected ? `1.5px solid ${selBorder}` : isDragOver ? `1.5px solid ${COLOR.ochreOrange}90` : '1.5px solid transparent',
    outlineOffset: 2,
    padding: '4px 0',
    marginTop: marginBefore,
    marginBottom: baseMargin + marginAfter,
    cursor: 'default',
    transition: 'outline 0.15s',
    opacity: isDragging ? 0.35 : 1,
    background: isDragOver ? isDark ? paperAlpha(0.04) : inkAlpha(0.03) : 'transparent'
  }} data-onganda-block data-onganda-block-id={block.id} data-onganda-block-type={block.type} data-onganda-avoid-page-break={shouldAvoidPageBreak ? 'true' : undefined} data-onganda-page-break-before={block.pageBreakBefore ? 'true' : undefined} onClick={e => {
    e.stopPropagation();
    onSelect();
  }}>
      {/* Drag handle */}
      <div draggable data-onganda-drag-handle data-onganda-export-ui="true" style={{
      position: 'absolute',
      left: -28,
      top: '50%',
      transform: 'translateY(-50%)',
      width: 16,
      display: 'flex',
      flexDirection: 'column',
      gap: 2.5,
      alignItems: 'center',
      cursor: 'grab',
      opacity: isSelected ? 0.7 : 0,
      transition: 'opacity 0.15s',
      paddingTop: 2,
      paddingBottom: 2
    }} title="Drag to reorder" onDragStart={e => {
      e.stopPropagation();
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('text/plain', block.id);
      onDragStart();
    }} onDragEnd={e => {
      e.stopPropagation();
      onDragEnd();
    }} onMouseEnter={e => {
      (e.currentTarget as HTMLElement).style.opacity = '1';
    }} onMouseLeave={e => {
      (e.currentTarget as HTMLElement).style.opacity = isSelected ? '0.7' : '0';
    }}>
        {[0, 1, 2, 3, 4, 5].map(i => <div key={`dh-${i}`} style={{
        width: 3,
        height: 3,
        background: COLOR.ochreOrange,
        borderRadius: 0
      }} />)}
      </div>

      {isSelected && <div data-onganda-export-ui="true" style={{
      position: 'absolute',
      left: -16,
      top: 0,
      bottom: 0,
      width: 2,
      background: COLOR.ochreOrange
    }} />}

      {innerContent}
      {showDividerRemove && <div data-onganda-export-ui="true" style={{
      display: 'flex',
      justifyContent: 'flex-end',
      marginTop: 4
    }}>
        <button onClick={e => {
        e.stopPropagation();
        onDelete();
      }} style={{
        fontSize: 9,
        fontWeight: 600,
        cursor: 'pointer',
        background: 'transparent',
        border: `1px solid ${isDark ? paperAlpha(0.1) : inkAlpha(0.1)}`,
        color: muted,
        padding: '2px 8px',
        letterSpacing: '0.08em'
      }} onMouseEnter={e => {
        e.currentTarget.style.borderColor = COLOR.firedRed;
        e.currentTarget.style.color = COLOR.firedRed;
      }} onMouseLeave={e => {
        e.currentTarget.style.borderColor = isDark ? paperAlpha(0.15) : inkAlpha(0.15);
        e.currentTarget.style.color = muted;
      }}>✕ Remove</button>
      </div>}

      {showToolbar && <div data-onganda-export-ui="true" style={{
      display: 'flex',
      alignItems: 'center',
      gap: 6,
      marginTop: 8,
      flexWrap: 'wrap' as const
    }}>
          {isTextBlock && !isEditing && <button onClick={e => {
        e.stopPropagation();
        onStartEdit();
      }} style={{
        padding: '4px 10px',
        background: 'transparent',
        border: `1px solid ${border}`,
        cursor: 'pointer',
        fontSize: 9,
        fontWeight: 600,
        color: muted
      }} onMouseEnter={e => {
        e.currentTarget.style.borderColor = COLOR.ochreOrange;
        e.currentTarget.style.color = COLOR.barkRust;
      }} onMouseLeave={e => {
        e.currentTarget.style.borderColor = border;
        e.currentTarget.style.color = muted;
      }}>Edit</button>}
          {isTextBlock && !isEditing && !isConfiguring && citationCount > 0 && Array.from({
        length: Math.min(citationCount, 12)
      }, (_, citationIdx) => {
        const citationNumber = citationIdx + 1;
        return <button key={`cite-btn-${block.id}-${citationNumber}`} onClick={e => {
          e.stopPropagation();
          insertCitation(citationNumber);
        }} style={{
          ...toolbarButtonStyle,
          color: COLOR.barkRust,
          borderColor: `${COLOR.ochreOrange}45`,
          fontFamily: 'Inter, Arial, sans-serif',
          fontWeight: 800
        }} title={`Insert citation [${citationNumber}]`}>{`[${citationNumber}]`}</button>;
      })}
          {['heading','body','pullquote','callout','list','signature','chart-gallery'].includes(block.type) && !isEditing && !isConfiguring && onRegenerate && <button onClick={e => {
        e.stopPropagation();
        onRegenerate();
      }} disabled={regenerating} style={{
        padding: '4px 10px',
        background: 'transparent',
        border: `1px solid ${border}`,
        cursor: regenerating ? 'wait' : 'pointer',
        fontSize: 9,
        fontWeight: 600,
        color: regenerating ? COLOR.ochreOrange : muted,
        opacity: regenerating ? 0.7 : 1
      }} onMouseEnter={e => {
        if (!regenerating) { e.currentTarget.style.borderColor = COLOR.mahanguGold; e.currentTarget.style.color = COLOR.mahanguGold; }
      }} onMouseLeave={e => {
        e.currentTarget.style.borderColor = border; e.currentTarget.style.color = regenerating ? COLOR.ochreOrange : muted;
      }}>{regenerating ? '↺ …' : '↺ Regen'}</button>}
          {isDesignBlock && !isConfiguring && <button onClick={e => {
        e.stopPropagation();
        onStartEdit();
      }} style={{
        padding: '4px 10px',
        background: 'transparent',
        border: `1px solid ${border}`,
        cursor: 'pointer',
        fontSize: 9,
        fontWeight: 600,
        color: muted
      }} onMouseEnter={e => {
        e.currentTarget.style.borderColor = COLOR.ochreOrange;
        e.currentTarget.style.color = COLOR.barkRust;
      }} onMouseLeave={e => {
        e.currentTarget.style.borderColor = border;
        e.currentTarget.style.color = muted;
      }}>Configure</button>}
          {(isEditing || isConfiguring) && <button onClick={e => {
        e.stopPropagation();
        onStopEdit();
      }} style={{
        padding: '4px 10px',
        background: COLOR.ochreOrange,
        border: 'none',
        cursor: 'pointer',
        fontSize: 9,
        fontWeight: 700,
        color: COLOR.milletClay
      }}>Done</button>}
          {!isEditing && !isConfiguring && <button onClick={e => {
        e.stopPropagation();
        onMoveUp();
      }} style={{
        padding: '4px 8px',
        background: 'transparent',
        border: `1px solid ${border}`,
        cursor: 'pointer',
        fontSize: 9,
        color: muted
      }} title="Move up">↑</button>}
          {!isEditing && !isConfiguring && <button onClick={e => {
        e.stopPropagation();
        onMoveDown();
      }} style={{
        padding: '4px 8px',
        background: 'transparent',
        border: `1px solid ${border}`,
        cursor: 'pointer',
        fontSize: 9,
        color: muted
      }} title="Move down">↓</button>}
          {!isEditing && !isConfiguring && <button onClick={e => {
        e.stopPropagation();
        onEdit({
          marginAfter: Math.max(0, marginAfter - 8)
        });
      }} style={toolbarButtonStyle} title="Reduce space after this block">Gap -</button>}
          {!isEditing && !isConfiguring && <button onClick={e => {
        e.stopPropagation();
        onEdit({
          marginAfter: Math.min(160, marginAfter + 8)
        });
      }} style={toolbarButtonStyle} title="Add space after this block">Gap +</button>}
          {!isEditing && !isConfiguring && <button onClick={e => {
        e.stopPropagation();
        if (block.pageBreakBefore) {
          onMoveToPreviousPage();
        } else {
          onMoveToNextPage();
        }
      }} style={{
        ...toolbarButtonStyle,
        color: block.pageBreakBefore ? COLOR.ochreOrange : muted,
        borderColor: block.pageBreakBefore ? `${COLOR.ochreOrange}60` : border
      }} title={block.pageBreakBefore ? 'Flow this block back to the previous page' : 'Start this block on the next page'}>
        {block.pageBreakBefore ? 'Previous page' : 'Next page'}
      </button>}
          {!isEditing && !isConfiguring && <button onClick={e => {
        e.stopPropagation();
        onDelete();
      }} style={{
        padding: '4px 8px',
        background: 'transparent',
        border: `1px solid ${isDark ? paperAlpha(0.10) : inkAlpha(0.10)}`,
        cursor: 'pointer',
        fontSize: 9,
        fontWeight: 600,
        color: muted
      }} onMouseEnter={e => {
        e.currentTarget.style.borderColor = COLOR.firedRed;
        e.currentTarget.style.color = COLOR.firedRed;
      }} onMouseLeave={e => {
        e.currentTarget.style.borderColor = isDark ? paperAlpha(0.10) : inkAlpha(0.10);
        e.currentTarget.style.color = muted;
      }}>✕ Remove</button>}
          <span style={{
        fontSize: 9,
        color: muted,
        letterSpacing: '0.10em'
      }}>
            {isEditing ? 'Click Done or click outside to save' : isConfiguring ? 'Select option above, then Done' : isTextBlock ? `Double-click to edit · gap ${marginAfter}px` : `${block.type.toUpperCase()} · gap ${marginAfter}px`}
          </span>
        </div>}
    </div>;
}

// ─── Insert Palette ───────────────────────────────────────────────────────────
const InsertPanel = ({
  isDark,
  onInsert
}: {
  isDark: boolean;
  onInsert: (item: InsertPaletteItem) => void;
}) => {
  const [activeCat, setActiveCat] = useState<string>('Text');
  const panelBg = isDark ? COLOR.darkCard : EDITOR_SURFACE.dustPanel;
  const headerBg = isDark ? COLOR.darkCard : EDITOR_SURFACE.dustHeader;
  const border = isDark ? paperAlpha(0.08) : inkAlpha(0.10);
  const fg = isDark ? COLOR.milletClay : COLOR.charBlack;
  const muted = isDark ? paperAlpha(0.55) : inkAlpha(0.66);
  const itemBg = isDark ? paperAlpha(0.04) : 'rgba(255,255,255,0.6)';
  const itemHoverBg = isDark ? paperAlpha(0.08) : EDITOR_SURFACE.paperWarm;
  const filtered = DOC_INSERT_PALETTE.filter(item => item.category === activeCat);
  return <div style={{
    width: 210,
    flexShrink: 0,
    background: panelBg,
    borderRight: `1px solid ${border}`,
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
        gap: 6,
        marginBottom: 8
      }}>
          <PixelDot color={COLOR.ochreOrange} size={5} />
          <span style={{
          fontSize: 9,
          fontWeight: 700,
          letterSpacing: '0.16em',
          color: COLOR.barkRust,
          textTransform: 'uppercase' as const
        }}>Insert Block</span>
        </div>
        <div style={{
        display: 'flex',
        gap: 4,
        flexWrap: 'wrap' as const
      }}>
          {DOC_PALETTE_CATEGORIES.map(cat => <button key={`doc-cat-${cat}`} onClick={() => setActiveCat(cat)} style={{
          padding: '3px 8px',
          fontSize: 9,
          fontWeight: 700,
          letterSpacing: '0.12em',
          cursor: 'pointer',
          border: 'none',
          background: activeCat === cat ? COLOR.ochreOrange : 'transparent',
          color: activeCat === cat ? onColor(COLOR.ochreOrange) : muted,
          textTransform: 'uppercase' as const
        }}>{cat}</button>)}
        </div>
      </div>
      <div style={{
      flex: 1,
      overflowY: 'auto',
      padding: '10px 10px'
    }}>
        <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 6
      }}>
          {filtered.map(item => <button key={item.id} onClick={() => onInsert(item)} style={{
          background: itemBg,
          border: `1px solid ${border}`,
          padding: '10px 12px',
          cursor: 'pointer',
          textAlign: 'left',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          gap: 3
        }} onMouseEnter={e => {
          e.currentTarget.style.background = itemHoverBg;
          e.currentTarget.style.borderColor = `${item.hex}60`;
        }} onMouseLeave={e => {
          e.currentTarget.style.background = itemBg;
          e.currentTarget.style.borderColor = border;
        }}>
              <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6
          }}>
                <div style={{
              width: 8,
              height: 8,
              background: item.hex,
              flexShrink: 0
            }} />
                <span style={{
              fontSize: 11,
              fontWeight: 600,
              color: fg,
              lineHeight: 1.2
            }}>{item.label}</span>
              </div>
              <span style={{
            fontSize: 9,
            color: muted,
            lineHeight: 1.4
          }}>{item.desc}</span>
            </button>)}
        </div>
      </div>
    </div>;
};

// ─── Export Modal ─────────────────────────────────────────────────────────────
const DocExportModal = ({
  isDark,
  format,
  docTitle,
  blockCount,
  onGenerate,
  onClose
}: {
  isDark: boolean;
  format: 'PDF' | 'WORD';
  docTitle: string;
  blockCount: number;
  onGenerate: () => void;
  onClose: () => void;
}) => {
  const [phase, setPhase] = useState<'options' | 'exporting' | 'done'>('options');
  const [progress, setProgress] = useState(0);
  const handleExport = () => {
    setPhase('exporting');
    setProgress(0);
    const steps = [10, 25, 40, 58, 74, 88, 100];
    let i = 0;
    const tick = () => {
      if (i < steps.length) {
        setProgress(steps[i]);
        i++;
        setTimeout(tick, 200 + Math.random() * 200);
      } else setTimeout(() => {
        onGenerate();
        if (format !== 'PDF') setPhase('done');
      }, 300);
    };
    setTimeout(tick, 280);
  };
  const panelBg = isDark ? COLOR.darkCard : EDITOR_SURFACE.emberBrown;
  const borderC = paperAlpha(0.08);
  const fg = COLOR.milletClay;
  const muted = paperAlpha(0.55);
  const formatColor = format === 'PDF' ? COLOR.ochreOrange : COLOR.mahanguGold;
  const exportOpts = [{
    label: 'Pages',
    value: 'Auto-paginated'
  }, {
    label: 'Format',
    value: format === 'PDF' ? 'A4 Portrait · Print PDF' : 'Word-compatible .doc'
  }, {
    label: 'Blocks',
    value: `${blockCount} block${blockCount !== 1 ? 's' : ''}`
  }, {
    label: 'Document',
    value: docTitle
  }];
  const exportSteps = [{
    label: 'Composing document layout',
    done: progress >= 30
  }, {
    label: 'Rendering typography & brand',
    done: progress >= 60
  }, {
    label: format === 'PDF' ? 'Opening PDF print dialog' : 'Writing Word-compatible file',
    done: progress >= 90
  }];
  return <div style={{
    position: 'fixed',
    inset: 0,
    zIndex: 200,
    background: 'rgba(18,15,13,0.88)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  }}>
      <motion.div initial={{
      opacity: 0,
      scale: 0.96,
      y: 10
    }} animate={{
      opacity: 1,
      scale: 1,
      y: 0
    }} exit={{
      opacity: 0,
      scale: 0.96
    }} transition={{
      duration: 0.22
    }} style={{
      width: 420,
      background: panelBg,
      border: `1px solid ${borderC}`,
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden'
    }}>
        <div style={{
        padding: '18px 24px 16px',
        borderBottom: `1px solid ${borderC}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
          <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10
        }}>
            <OngandaLogoMark size={18} />
            <PixelTag hex={formatColor} label={format === 'PDF' ? 'Export PDF' : 'Export Word'} />
          </div>
          <button onClick={onClose} style={{
          background: 'transparent',
          border: `1px solid ${borderC}`,
          color: muted,
          cursor: 'pointer',
          fontSize: 11,
          padding: '5px 12px'
        }}>✕</button>
        </div>
        <div style={{
        padding: '24px 24px'
      }}>
          {phase === 'options' && <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 18
        }}>
              <div>
                <p style={{
              fontSize: 14,
              fontWeight: 600,
              color: fg,
              margin: '0 0 4px'
            }}>Export as {format === 'PDF' ? 'PDF' : 'Word'}</p>
                <p style={{
              fontSize: 12,
              color: muted,
              margin: 0,
              lineHeight: 1.6
            }}>
                  {format === 'PDF' ? 'Opens the browser PDF print flow with only the document canvas visible.' : 'Downloads a Word-compatible .doc file with the current Onganda document layout.'}
                </p>
              </div>
              <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 8
          }}>
                {exportOpts.map(row => <div key={`opt-${row.label}`} style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '8px 12px',
              background: paperAlpha(0.04),
              border: `1px solid ${borderC}`
            }}>
                    <span style={{
                fontSize: 11,
                color: muted
              }}>{row.label}</span>
                    <span style={{
                fontSize: 11,
                fontWeight: 600,
                color: fg
              }}>{row.value}</span>
                  </div>)}
              </div>
              <button onClick={handleExport} style={{
            width: '100%',
            padding: '12px',
            background: formatColor,
            border: 'none',
            cursor: 'pointer',
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: '0.10em',
            color: formatColor === COLOR.mahanguGold ? COLOR.charBlack : COLOR.milletClay,
            textTransform: 'uppercase' as const
          }} onMouseEnter={e => e.currentTarget.style.background = COLOR.firedRed} onMouseLeave={e => e.currentTarget.style.background = formatColor}>
                Generate {format === 'PDF' ? 'PDF' : 'Word'} →
              </button>
            </div>}
          {phase === 'exporting' && <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 20,
          alignItems: 'center',
          padding: '8px 0'
        }}>
              <div style={{
            width: 48,
            height: 48,
            background: `${formatColor}15`,
            border: `1px solid ${formatColor}40`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
                <OngandaLogoMark size={28} />
              </div>
              <div style={{
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            gap: 10
          }}>
                <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
                  <span style={{
                fontSize: 12,
                color: fg,
                fontWeight: 500
              }}>Generating {format === 'PDF' ? 'PDF' : 'Word'}…</span>
                  <span style={{
                fontSize: 11,
                color: formatColor,
                fontWeight: 700
              }}>{progress}%</span>
                </div>
                <div style={{
              width: '100%',
              height: 4,
              background: paperAlpha(0.08)
            }}>
                  <motion.div animate={{
                width: `${progress}%`
              }} transition={{
                duration: 0.3,
                ease: 'easeOut'
              }} style={{
                height: '100%',
                background: formatColor
              }} />
                </div>
                <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 4
            }}>
                  {exportSteps.map(step => <div key={`step-${step.label}`} style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8
              }}>
                      <div style={{
                  width: 8,
                  height: 8,
                  background: step.done ? COLOR.mahanguGold : paperAlpha(0.15)
                }} />
                      <span style={{
                  fontSize: 10,
                  color: step.done ? fg : muted
                }}>{step.label}</span>
                    </div>)}
                </div>
              </div>
            </div>}
          {phase === 'done' && <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 18,
          alignItems: 'center',
          textAlign: 'center',
          padding: '8px 0'
        }}>
              <div style={{
            width: 48,
            height: 48,
            background: `${COLOR.mahanguGold}20`,
            border: `1px solid ${COLOR.mahanguGold}50`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
                <span style={{
              fontSize: 24,
              color: COLOR.mahanguGold
            }}>✓</span>
              </div>
              <div>
                <p style={{
              fontSize: 14,
              fontWeight: 600,
              color: fg,
              margin: '0 0 6px'
            }}>Export complete</p>
                <p style={{
              fontSize: 11,
              color: muted,
              margin: 0,
              lineHeight: 1.6
            }}>{format === 'PDF' ? 'Use Save as PDF in the print dialog.' : 'Your Word-compatible document has downloaded.'}</p>
              </div>
              <div style={{
            display: 'flex',
            gap: 10,
            width: '100%'
          }}>
                <button onClick={onClose} style={{
              flex: 1,
              padding: '10px',
              background: 'transparent',
              border: `1px solid ${borderC}`,
              cursor: 'pointer',
              fontSize: 11,
              fontWeight: 500,
              color: muted
            }}>Close</button>
                <button onClick={onGenerate} style={{
              flex: 2,
              padding: '10px',
              background: COLOR.ochreOrange,
              border: 'none',
              cursor: 'pointer',
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: '0.08em',
              color: COLOR.charBlack,
              textTransform: 'uppercase' as const
            }}>{format === 'PDF' ? 'Open PDF Dialog' : '↓ Download Word'}</button>
              </div>
            </div>}
        </div>
      </motion.div>
    </div>;
};

// ─── Session storage keys ─────────────────────────────────────────────────────
const DOC_SESSION_KEY = 'onganda_doc_editor_session';
interface DocSession {
  stage: 'picker' | 'editor';
  blocks: DocBlock[];
  docTitle: string;
  paperBackground?: PaperBackgroundId;
}
function loadDocSession(): DocSession | null {
  try {
    const raw = localStorage.getItem(DOC_SESSION_KEY);
    if (!raw) return null;
    const session = JSON.parse(raw) as DocSession;
    return {
      ...session,
      blocks: migrateMemoBlocks(session.blocks ?? [])
    };
  } catch {
    return null;
  }
}
function saveDocSession(session: DocSession) {
  try {
    localStorage.setItem(DOC_SESSION_KEY, JSON.stringify(session));
  } catch {
    // storage unavailable — silently skip
  }
}

// ─── useDocHistory — undo/redo stack ─────────────────────────────────────────
function useDocHistory(initial: DocBlock[]) {
  const [stack, setStack] = useState<DocBlock[][]>([initial]);
  const [cursor, setCursor] = useState(0);
  const current = stack[cursor];
  const push = useCallback((next: DocBlock[]) => {
    setStack(prev => {
      const trimmed = prev.slice(0, cursor + 1);
      return [...trimmed, next].slice(-60); // keep last 60 states
    });
    setCursor(prev => Math.min(prev + 1, 59));
  }, [cursor]);
  const undo = useCallback(() => {
    setCursor(prev => Math.max(0, prev - 1));
  }, []);
  const redo = useCallback(() => {
    setCursor(prev => {
      setStack(s => {
        const max = s.length - 1;
        return s;
      });
      return cursor < stack.length - 1 ? cursor + 1 : cursor;
    });
  }, [cursor, stack.length]);
  const canUndo = cursor > 0;
  const canRedo = cursor < stack.length - 1;

  // Seed when initial changes externally (on template select)
  const reset = useCallback((blocks: DocBlock[]) => {
    setStack([blocks]);
    setCursor(0);
  }, []);
  // Silently patch the current history entry (no new undo step)
  const silentPatch = useCallback((updater: (prev: DocBlock[]) => DocBlock[]) => {
    setStack(prev => {
      const entry = prev[cursor] ?? [];
      const patched = updater(entry);
      const next = [...prev];
      next[cursor] = patched;
      return next;
    });
  }, [cursor]);
  return {
    current,
    push,
    undo,
    redo,
    canUndo,
    canRedo,
    reset,
    silentPatch
  };
}

// ─── Document Toolbar ─────────────────────────────────────────────────────────
const DocToolbar = ({
  onClose,
  isDark,
  blockCount,
  docTitle,
  onTitleChange,
  paperBackground,
  onPaperBackgroundChange,
  onExport,
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  sessionSaved,
  showAutoLetterhead,
  onToggleAutoLetterhead
}: {
  onClose: () => void;
  isDark: boolean;
  blockCount: number;
  docTitle: string;
  onTitleChange: (t: string) => void;
  paperBackground: PaperBackgroundId;
  onPaperBackgroundChange: (bg: PaperBackgroundId) => void;
  onExport: (fmt: 'PDF' | 'WORD') => void;
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
  sessionSaved: boolean;
  showAutoLetterhead: boolean;
  onToggleAutoLetterhead: () => void;
}) => {
  const [editingTitle, setEditingTitle] = useState(false);
  const bg = isDark ? COLOR.darkCard : COLOR.dustLight;
  const border = isDark ? paperAlpha(0.08) : inkAlpha(0.10);
  const fg = isDark ? COLOR.milletClay : COLOR.charBlack;
  const mutedFg = isDark ? paperAlpha(0.55) : inkAlpha(0.66);
  const fmtBtns: Array<'PDF' | 'WORD'> = ['PDF', 'WORD'];
  const btnBase: React.CSSProperties = {
    padding: '4px 10px',
    background: 'transparent',
    border: `1px solid ${border}`,
    cursor: 'pointer',
    fontSize: 10,
    fontWeight: 700,
    letterSpacing: '0.10em',
    color: mutedFg,
    display: 'flex',
    alignItems: 'center',
    gap: 4,
    transition: 'all 0.12s'
  };
  return <div style={{
    background: bg,
    borderBottom: `1px solid ${border}`,
    padding: '0 24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 16,
    height: 48,
    flexShrink: 0,
    position: 'sticky',
    top: 0,
    zIndex: 30
  }}>
      <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: 12
    }}>
        <button onClick={onClose} style={{
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        background: 'transparent',
        border: 'none',
        cursor: 'pointer',
        color: mutedFg,
        fontSize: 12,
        fontWeight: 500,
        padding: '4px 0'
      }} onMouseEnter={e => e.currentTarget.style.color = COLOR.barkRust} onMouseLeave={e => e.currentTarget.style.color = mutedFg}>
          <svg width="14" height="10" viewBox="0 0 7 5" fill="none" aria-hidden="true">
            <rect x="2" y="0" width="1" height="1" fill="currentColor" fillOpacity="0.7" />
            <rect x="1" y="1" width="1" height="1" fill="currentColor" fillOpacity="0.7" />
            <rect x="0" y="2" width="7" height="1" fill="currentColor" fillOpacity="0.9" />
            <rect x="1" y="3" width="1" height="1" fill="currentColor" fillOpacity="0.7" />
            <rect x="2" y="4" width="1" height="1" fill="currentColor" fillOpacity="0.7" />
          </svg>
          <span>Publications</span>
        </button>
        <span style={{
        color: border,
        fontSize: 14
      }}>/</span>
        <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8
      }}>
          <PixelTag hex={COLOR.ochreOrange} label="DOC" />
          {editingTitle ? <input value={docTitle} onChange={e => onTitleChange(e.target.value)} onBlur={() => setEditingTitle(false)} onKeyDown={e => {
          if (e.key === 'Enter' || e.key === 'Escape') setEditingTitle(false);
        }} autoFocus style={{
          fontSize: 12,
          fontWeight: 500,
          color: fg,
          background: 'transparent',
          border: 'none',
          borderBottom: `1px solid ${COLOR.ochreOrange}80`,
          outline: 'none',
          letterSpacing: '0.06em'
        }} /> : <span style={{
          fontSize: 12,
          fontWeight: 500,
          color: fg,
          cursor: 'text'
        }} onDoubleClick={() => {
          setEditingTitle(true);
        }} title="Double-click to rename">{docTitle}</span>}
        </div>
        <span style={{
        fontSize: 9,
        color: mutedFg,
        letterSpacing: '0.08em'
      }}>· {blockCount} block{blockCount !== 1 ? 's' : ''}</span>
        {/* Session saved indicator */}
        {sessionSaved && <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 4
      }}>
          <div style={{
          width: 5,
          height: 5,
          background: statusFor('settled', isDark),
          opacity: 0.7
        }} />
          <span style={{
          fontSize: 9,
          color: mutedFg,
          letterSpacing: '0.10em'
        }}>saved</span>
        </div>}
      </div>
      <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: 6
    }}>
        {/* Undo / Redo */}
        <button onClick={onUndo} disabled={!canUndo} title="Undo (Cmd+Z)" style={{
        ...btnBase,
        opacity: canUndo ? 1 : 0.35,
        cursor: canUndo ? 'pointer' : 'not-allowed'
      }} onMouseEnter={e => {
        if (canUndo) {
          e.currentTarget.style.borderColor = COLOR.ochreOrange;
          e.currentTarget.style.color = COLOR.barkRust;
        }
      }} onMouseLeave={e => {
        e.currentTarget.style.borderColor = border;
        e.currentTarget.style.color = mutedFg;
      }}>
          <span style={{
          fontSize: 14,
          lineHeight: 1
        }}>↩</span>
          <span>Undo</span>
        </button>
        <button onClick={onRedo} disabled={!canRedo} title="Redo (Cmd+Shift+Z)" style={{
        ...btnBase,
        opacity: canRedo ? 1 : 0.35,
        cursor: canRedo ? 'pointer' : 'not-allowed'
      }} onMouseEnter={e => {
        if (canRedo) {
          e.currentTarget.style.borderColor = COLOR.ochreOrange;
          e.currentTarget.style.color = COLOR.barkRust;
        }
      }} onMouseLeave={e => {
        e.currentTarget.style.borderColor = border;
        e.currentTarget.style.color = mutedFg;
      }}>
          <span style={{
          fontSize: 14,
          lineHeight: 1
        }}>↪</span>
          <span>Redo</span>
        </button>
        <div style={{
        width: 1,
        height: 20,
        background: border,
        margin: '0 2px'
      }} />
        <div data-onganda-export-ui="true" style={{
        display: 'flex',
        alignItems: 'center',
        gap: 4,
        padding: '2px 4px',
        border: `1px solid ${border}`
      }}>
          {PAPER_BACKGROUNDS.map(bgOpt => <button key={`paper-bg-${bgOpt.id}`} onClick={() => onPaperBackgroundChange(bgOpt.id)} title={`${bgOpt.label} paper`} style={{
          width: 18,
          height: 18,
          background: bgOpt.hex,
          border: `2px solid ${paperBackground === bgOpt.id ? COLOR.ochreOrange : border}`,
          cursor: 'pointer',
          padding: 0
        }} />)}
        </div>
        <button onClick={onToggleAutoLetterhead} title={showAutoLetterhead ? 'Hide auto letterhead' : 'Show auto letterhead'} style={{
        ...btnBase,
        // The active toggle keeps the ochre edge; the label takes the accent
        // ink, since ochre reads 2.56:1 on the dust-light toolbar.
        borderColor: showAutoLetterhead ? COLOR.ochreOrange : border,
        color: showAutoLetterhead ? COLOR.barkRust : mutedFg
      }}>
          <span style={{ fontSize: 11 }}>{showAutoLetterhead ? '⊟' : '⊞'}</span>
          <span>Letterhead</span>
        </button>
        {fmtBtns.map(fmt => <button key={`doc-export-${fmt}`} onClick={() => onExport(fmt)} style={{
        display: 'flex',
        alignItems: 'center',
        gap: 5,
        padding: '6px 14px',
        background: fmt === 'PDF' ? COLOR.ochreOrange : 'transparent',
        border: fmt === 'PDF' ? 'none' : `1px solid ${isDark ? paperAlpha(0.1) : inkAlpha(0.1)}`,
        cursor: 'pointer',
        fontSize: 10,
        fontWeight: 700,
        letterSpacing: '0.14em',
        textTransform: 'uppercase' as const,
        color: fmt === 'PDF' ? onColor(COLOR.ochreOrange) : mutedFg
      }} onMouseEnter={e => {
        // The accent recipe: ochre fill with char black, pressing into ink on
        // hover. Fired red cannot host this label at any size.
        if (fmt === 'PDF') {
          e.currentTarget.style.background = COLOR.charBlack;
          e.currentTarget.style.color = COLOR.milletClay;
        } else {
          e.currentTarget.style.borderColor = COLOR.barkRust;
          e.currentTarget.style.color = COLOR.barkRust;
        }
      }} onMouseLeave={e => {
        if (fmt === 'PDF') {
          e.currentTarget.style.background = COLOR.ochreOrange;
          e.currentTarget.style.color = onColor(COLOR.ochreOrange);
        } else {
          e.currentTarget.style.borderColor = isDark ? paperAlpha(0.15) : inkAlpha(0.15);
          e.currentTarget.style.color = mutedFg;
        }
      }}>
            <PixelDot color="currentColor" size={4} />
            <span>{fmt === 'PDF' ? 'Export PDF' : 'Export Word'}</span>
          </button>)}
      </div>
    </div>;
};

// ─── Document Letterhead ──────────────────────────────────────────────────────
const DocLetterhead = ({
  isDark,
  title
}: {
  isDark: boolean;
  title: string;
}) => {
  const fg = isDark ? COLOR.milletClay : COLOR.charBlack;
  const muted = isDark ? paperAlpha(0.55) : inkAlpha(0.66);
  const border = isDark ? paperAlpha(0.10) : inkAlpha(0.10);
  const dotColors = [COLOR.ochreOrange, COLOR.firedRed, COLOR.mahanguGold, COLOR.mopaneBrown, COLOR.dyePlum];
  return <div>
      <div style={{
      height: 3,
      background: COLOR.ochreOrange,
      width: '100%'
    }} />
      <div style={{
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      padding: '28px 56px 24px',
      borderBottom: `1px solid ${border}`,
      gap: 20
    }}>
        <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 10
      }}>
          <OngandaLogoMark size={32} />
          <div>
            <p style={{
            fontSize: 14,
            fontWeight: 700,
            letterSpacing: '-0.01em',
            color: COLOR.barkRust,
            lineHeight: 1.1
          }}>Onganda</p>
            <p style={{
            fontSize: 10,
            color: muted,
            letterSpacing: '0.05em',
            marginTop: 2
          }}>Namibia AI Systems Lab</p>
          </div>
        </div>
        <div style={{
        textAlign: 'right'
      }}>
          <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 6,
          padding: '3px 10px',
          border: `1px solid ${COLOR.ochreOrange}50`,
          marginBottom: 8
        }}>
            <PixelDot color={COLOR.ochreOrange} size={5} />
            <span style={{
            fontSize: 9,
            fontWeight: 700,
            letterSpacing: '0.18em',
            textTransform: 'uppercase' as const,
            color: COLOR.barkRust
          }}>Concept Paper</span>
          </div>
          <p style={{
          fontSize: 9,
          fontWeight: 700,
          color: muted,
          letterSpacing: '0.12em',
          textTransform: 'uppercase' as const
        }}>{DOCUMENT_STATUS}</p>
        </div>
      </div>
      <div style={{
      padding: '36px 56px 28px'
    }}>
        <h1 style={{
        fontSize: 24,
        fontWeight: 700,
        letterSpacing: '-0.025em',
        color: fg,
        lineHeight: 1.2,
        marginBottom: 10,
        maxWidth: 600
      }}>{title}</h1>
        <p style={{
        fontSize: 14,
        color: isDark ? paperAlpha(0.55) : inkAlpha(0.66),
        lineHeight: 1.6,
        maxWidth: 520,
        marginBottom: 22
      }}>
          A two-track model for local AI capability, applied tooling, and institutional deployment.
        </p>
        <div style={{
        display: 'flex',
        flexWrap: 'wrap' as const,
        alignItems: 'center',
        gap: '7px 10px',
        color: muted,
        fontSize: 10,
        letterSpacing: '0.06em',
        marginTop: -10,
        marginBottom: 24
      }}>
          <span>{DOCUMENT_BYLINE}</span>
          <span aria-hidden="true">·</span>
          <span>{CURRENT_YEAR}</span>
        </div>
        <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8
      }}>
          {dotColors.map((c, i) => <div key={`lh-dot-${i}`} style={{
          width: 5,
          height: 5,
          background: c
        }} />)}
          <div style={{
          flex: 1,
          height: 1,
          background: border
        }} />
        </div>
      </div>
    </div>;
};

// ─── Template Picker ──────────────────────────────────────────────────────────
const TEMPLATE_OPTIONS = followPalette(() => ([{
  id: 'blank',
  label: 'Blank Document',
  desc: 'Start from scratch with an empty canvas',
  icon: '□',
  color: COLOR.barkRust
}, {
  id: 'concept',
  label: 'Concept Paper',
  desc: 'Namibia AI Capability and Tooling Platform — full one-page concept with all sections',
  icon: '▣',
  color: COLOR.barkRust
}, {
  id: 'memo',
  label: 'Platform Memo',
  desc: 'Long-form stakeholder memo with sources section',
  icon: '▤',
  color: COLOR.mopaneBrown
}]));
const TemplatePicker = ({
  isDark,
  onSelect,
  onResume,
  onBack
}: {
  isDark: boolean;
  onSelect: (templateId: string, title: string) => void;
  onResume?: () => void;
  onBack: () => void;
}) => {
  const bg = isDark ? COLOR.darkBg : COLOR.milletClay;
  const cardBg = isDark ? COLOR.darkCard : EDITOR_SURFACE.paperWarm;
  const border = isDark ? paperAlpha(0.10) : inkAlpha(0.08);
  const fg = isDark ? COLOR.milletClay : COLOR.charBlack;
  const muted = isDark ? paperAlpha(0.55) : inkAlpha(0.66);
  return <div style={{
    minHeight: '100vh',
    background: bg,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40
  }}>
      <div style={{
      maxWidth: 600,
      width: '100%'
    }}>
        <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        marginBottom: 48
      }}>
          <OngandaLogoMark size={24} />
          <div style={{
          flex: 1
        }}>
            <p style={{
            fontSize: 10,
            color: COLOR.barkRust,
            fontWeight: 700,
            letterSpacing: '0.16em',
            textTransform: 'uppercase',
            margin: 0
          }}>Document Editor</p>
            <h1 style={{
            fontSize: 24,
            fontWeight: 700,
            color: fg,
            margin: 0,
            letterSpacing: '-0.02em'
          }}>Choose a starting point</h1>
          </div>
          <button onClick={onBack} style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          background: 'transparent',
          border: `1px solid ${isDark ? paperAlpha(0.1) : inkAlpha(0.1)}`,
          cursor: 'pointer',
          color: muted,
          fontSize: 11,
          fontWeight: 500,
          padding: '6px 14px',
          flexShrink: 0
        }} onMouseEnter={e => {
          e.currentTarget.style.borderColor = COLOR.ochreOrange;
          e.currentTarget.style.color = COLOR.barkRust;
        }} onMouseLeave={e => {
          e.currentTarget.style.borderColor = isDark ? paperAlpha(0.15) : inkAlpha(0.15);
          e.currentTarget.style.color = muted;
        }}>
            <svg width="14" height="10" viewBox="0 0 7 5" fill="none" aria-hidden="true">
              <rect x="2" y="0" width="1" height="1" fill="currentColor" fillOpacity="0.7" />
              <rect x="1" y="1" width="1" height="1" fill="currentColor" fillOpacity="0.7" />
              <rect x="0" y="2" width="7" height="1" fill="currentColor" fillOpacity="0.9" />
              <rect x="1" y="3" width="1" height="1" fill="currentColor" fillOpacity="0.7" />
              <rect x="2" y="4" width="1" height="1" fill="currentColor" fillOpacity="0.7" />
            </svg>
            <span>Back</span>
          </button>
        </div>
        {onResume && <button onClick={onResume} style={{
        width: '100%',
        background: isDark ? paperAlpha(0.04) : 'rgba(255,255,255,0.55)',
        border: `1px solid ${COLOR.ochreOrange}45`,
        color: fg,
        padding: '14px 16px',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 16,
        marginBottom: 16,
        textAlign: 'left'
      }}>
          <span style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 3
        }}>
            <strong style={{ fontSize: 12 }}>Resume last document</strong>
            <span style={{ fontSize: 10, color: muted }}>Continue the autosaved editor session.</span>
          </span>
          <span style={{
          color: COLOR.barkRust,
          fontSize: 9,
          fontWeight: 800,
          letterSpacing: '0.12em',
          textTransform: 'uppercase'
        }}>Open</span>
        </button>}
        <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 16,
        marginBottom: 32
      }}>
          {TEMPLATE_OPTIONS.map(opt => <button key={opt.id} onClick={() => onSelect(opt.id, opt.id === 'blank' ? 'Untitled Document' : opt.id === 'memo' ? 'Memo: Namibia AI Capability and Tooling Platform' : 'A Namibia-Focused AI Capability and Tooling Platform')} style={{
          background: cardBg,
          border: `1px solid ${border}`,
          padding: '28px 24px',
          cursor: 'pointer',
          textAlign: 'left',
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
          transition: 'border-color 0.15s'
        }} onMouseEnter={e => {
          e.currentTarget.style.borderColor = `${opt.color}60`;
          e.currentTarget.style.background = isDark ? paperAlpha(0.05) : inkAlpha(0.02);
        }} onMouseLeave={e => {
          e.currentTarget.style.borderColor = border;
          e.currentTarget.style.background = cardBg;
        }}>
              <div style={{
            width: 48,
            height: 48,
            background: `${opt.color}14`,
            border: `1px solid ${opt.color}40`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 18,
            color: opt.color
          }}>{opt.icon}</div>
              <div>
                <p style={{
              fontSize: 14,
              fontWeight: 700,
              color: fg,
              margin: '0 0 4px'
            }}>{opt.label}</p>
                <p style={{
              fontSize: 11,
              color: muted,
              margin: 0,
              lineHeight: 1.5
            }}>{opt.desc}</p>
              </div>
              <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            marginTop: 4
          }}>
                <div style={{
              width: 20,
              height: 2,
              background: opt.color
            }} />
                <span style={{
              fontSize: 9,
              fontWeight: 700,
              color: opt.color,
              letterSpacing: '0.12em',
              textTransform: 'uppercase'
            }}>
                  {opt.id === 'blank' ? 'Create' : 'Open template'}
                </span>
              </div>
            </button>)}
        </div>
      </div>
    </div>;
};

const PageGuideOverlay = ({
  pageCount,
  isDark
}: {
  pageCount: number;
  isDark: boolean;
}) => {
  const labelBg = isDark ? COLOR.darkCard : EDITOR_SURFACE.paperWarm;
  // Ochre is 3.0:1 on the paper ground; the accent ink reads there.
  const labelFg = COLOR.barkRust;
  return <div data-onganda-page-guide-overlay aria-hidden="true" style={{
    position: 'absolute',
    inset: 0,
    pointerEvents: 'none',
    zIndex: 1
  }}>
      {Array.from({
      length: Math.max(0, pageCount - 1)
    }, (_, i) => {
      const page = i + 1;
      return <div key={`page-guide-${page}`} data-onganda-page-guide-line style={{
        position: 'absolute',
        top: `${page * A4_PAGE_HEIGHT_MM}mm`,
        left: 0,
        width: '100%',
        borderTop: `1px solid ${COLOR.ochreOrange}80`
      }}>
          <span data-onganda-export-ui="true" style={{
          position: 'absolute',
          right: 12,
          top: -10,
          padding: '2px 8px',
          background: labelBg,
          border: `1px solid ${COLOR.ochreOrange}55`,
          color: labelFg,
          fontSize: 9,
          fontWeight: 700,
          letterSpacing: '0.12em',
          textTransform: 'uppercase' as const
        }}>{`Page ${page + 1} starts`}</span>
        </div>;
    })}
      {Array.from({
      length: pageCount
    }, (_, i) => <div key={`page-label-${i}`} data-onganda-page-guide-label style={{
      position: 'absolute',
      top: `${i * A4_PAGE_HEIGHT_MM}mm`,
      right: 10,
      paddingTop: 8,
      color: isDark ? paperAlpha(0.55) : inkAlpha(0.66),
      fontSize: 9,
      fontWeight: 700,
      letterSpacing: '0.12em',
      textTransform: 'uppercase' as const
    }}>{`Page ${i + 1}`}</div>)}
    </div>;
};

// ─── Main Export ──────────────────────────────────────────────────────────────
export const DocumentEditor = ({
  onClose
}: {
  onClose: () => void;
}) => {
  const {
    isDark
  } = useDark();

  // Session restore
  const savedSession = useMemo(() => loadDocSession(), []);
  // Always land on the picker — a saved session surfaces there as "Resume"
  const [stage, setStage] = useState<'picker' | 'editor'>('picker');
  const [docTitle, setDocTitle] = useState(savedSession?.docTitle ?? 'Untitled Document');
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const [editingBlockId, setEditingBlockId] = useState<string | null>(null);
  const [configuringBlockId, setConfiguringBlockId] = useState<string | null>(null);
  const [regeneratingBlockId, setRegeneratingBlockId] = useState<string | null>(null);
  const [exportModal, setExportModal] = useState<'PDF' | 'WORD' | null>(null);
  const [paperBackground, setPaperBackground] = useState<PaperBackgroundId>(savedSession?.paperBackground ?? 'warm');
  const [showAutoLetterhead, setShowAutoLetterhead] = useState(true);
  const [pageCount, setPageCount] = useState(1);
  const [dragState, setDragState] = useState<DragState>({
    draggingId: null,
    overIdx: null
  });
  const [sessionSaved, setSessionSaved] = useState(false);
  const documentPaperRef = useRef<HTMLElement | null>(null);
  const history = useDocHistory(savedSession?.blocks ?? []);
  const blocks = history.current;
  const setBlocks = useCallback((updater: DocBlock[] | ((prev: DocBlock[]) => DocBlock[])) => {
    const next = typeof updater === 'function' ? updater(blocks) : updater;
    history.push(next);
  }, [blocks, history]);

  // Fingerprint of content/structure only — excludes marginBefore so recalculation
  // doesn't re-trigger itself.
  const blockContentFingerprint = useMemo(
    () => blocks.map(b => `${b.id}:${b.type}:${b.content ?? ''}:${b.pageBreakBefore ? '1' : '0'}:${b.spacerHeight ?? ''}`).join('|'),
    [blocks]
  );

  // Dynamically keep marginBefore in sync with actual rendered block positions.
  // This ensures the editor simulation always matches what break-before:page produces
  // in print: if content is added/removed above a pageBreakBefore block, its natural
  // flow position changes, and this effect recalculates the fill-to-page-boundary margin.
  const marginRecalcTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    if (stage !== 'editor') return;
    if (marginRecalcTimerRef.current) clearTimeout(marginRecalcTimerRef.current);
    marginRecalcTimerRef.current = setTimeout(() => {
      const paperEl = documentPaperRef.current;
      if (!paperEl) return;
      const pbBlocks = blocks.filter(b => b.pageBreakBefore);
      if (pbBlocks.length === 0) return;

      const paperTop = paperEl.getBoundingClientRect().top;
      const updates: Record<string, number> = {};
      let cumulativeCurrentMargins = 0;
      let anyChanged = false;

      for (const block of pbBlocks) {
        const blockEl = paperEl.querySelector<HTMLElement>(`[data-onganda-block-id="${block.id}"]`);
        if (!blockEl) continue;
        const measured = blockEl.getBoundingClientRect().top - paperTop;
        const currentMargin = block.marginBefore ?? 0;
        // Subtract this block's own margin AND all pageBreakBefore margins above it
        // to recover the block's natural flow position (as if no forced breaks exist).
        const naturalTop = measured - currentMargin - cumulativeCurrentMargins;
        const pageOffset = ((naturalTop % A4_PAGE_HEIGHT_PX) + A4_PAGE_HEIGHT_PX) % A4_PAGE_HEIGHT_PX;
        const newMargin = pageOffset < 1
          ? PAGE_BREAK_PREVIEW_TOP_PX
          : Math.ceil(A4_PAGE_HEIGHT_PX - pageOffset + PAGE_BREAK_PREVIEW_TOP_PX);
        updates[block.id] = newMargin;
        cumulativeCurrentMargins += currentMargin;
        if (Math.abs(newMargin - currentMargin) > 1) anyChanged = true;
      }

      if (anyChanged) {
        history.silentPatch(prev => prev.map(b => updates[b.id] !== undefined ? { ...b, marginBefore: updates[b.id] } : b));
      }
    }, 150);
    return () => {
      if (marginRecalcTimerRef.current) clearTimeout(marginRecalcTimerRef.current);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [blockContentFingerprint, stage]);

  const persistSession = useCallback(() => {
    if (stage !== 'editor') return;
    saveDocSession({
      stage,
      blocks,
      docTitle,
      paperBackground
    });
  }, [blocks, docTitle, paperBackground, stage]);

  // Auto-save session to localStorage (debounced)
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    if (stage !== 'editor') return;
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(() => {
      persistSession();
      setSessionSaved(true);
      setTimeout(() => setSessionSaved(false), 1800);
    }, 800);
    return () => {
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    };
  }, [persistSession, stage]);

  useEffect(() => {
    if (stage !== 'editor') return;
    const flush = () => persistSession();
    const flushOnVisibilityChange = () => {
      if (document.visibilityState === 'hidden') flush();
    };
    window.addEventListener('beforeunload', flush);
    window.addEventListener('pagehide', flush);
    document.addEventListener('visibilitychange', flushOnVisibilityChange);
    return () => {
      window.removeEventListener('beforeunload', flush);
      window.removeEventListener('pagehide', flush);
      document.removeEventListener('visibilitychange', flushOnVisibilityChange);
    };
  }, [persistSession, stage]);

  useEffect(() => {
    if (stage !== 'editor' || !documentPaperRef.current) return;
    const paper = documentPaperRef.current;
    const updatePageCount = () => {
      setPageCount(Math.max(1, Math.ceil(paper.scrollHeight / A4_PAGE_HEIGHT_PX)));
    };
    updatePageCount();
    const observer = new ResizeObserver(updatePageCount);
    observer.observe(paper);
    return () => observer.disconnect();
  }, [blocks, docTitle, paperBackground, stage]);

  // Keyboard undo/redo
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      const mod = e.metaKey || e.ctrlKey;
      if (mod && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        history.undo();
      }
      if (mod && (e.key === 'y' || e.key === 'z' && e.shiftKey)) {
        e.preventDefault();
        history.redo();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [history]);
  const pageBg = isDark ? COLOR.darkBg : COLOR.milletClay;
  const paperBg = isDark ? COLOR.darkCard : paperBackgroundHex(paperBackground);
  const paperBorder = isDark ? paperAlpha(0.08) : inkAlpha(0.08);
  const citationCount = blocks.reduce((count, block) => block.type === 'sources' ? Math.max(count, parseSources(block.sourcesData).length) : count, 0);
  const handleTemplateSelect = (templateId: string, title: string) => {
    setDocTitle(title);
    const templateBlocks = templateId === 'memo' ? MEMO_TEMPLATE_BLOCKS : TEMPLATE_BLOCKS;
    const newBlocks = templateId === 'blank' ? [] : templateBlocks.map(b => ({
      ...b
    }));
    history.reset(newBlocks);
    setStage('editor');
    saveDocSession({
      stage: 'editor',
      blocks: newBlocks,
      docTitle: title,
      paperBackground
    });
  };
  const handleInsert = useCallback((item: InsertPaletteItem) => {
    const newBlock: DocBlock = {
      id: `block-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      type: item.type,
      content: item.defaultContent,
      statValue: item.type === 'stat' ? '0' : undefined,
      statLabel: item.type === 'stat' ? item.label : undefined,
      statSub: item.type === 'stat' ? 'metric' : undefined,
      statHex: item.type === 'stat' ? item.hex : undefined,
      terminalIdx: item.type === 'terminal' ? 0 : undefined,
      timelinePhaseIdx: item.type === 'timeline' ? 0 : undefined,
      systemIdx: item.type === 'systemcard' ? 0 : undefined,
      flowNodeIdx: item.type === 'flowchart' ? 0 : undefined,
      chartTitle: item.type === 'chart-market' ? 'Global AI Market Growth' : undefined,
      barValues: item.type === 'chart-bar' ? JSON.stringify(DEFAULT_BAR_DATA) : undefined,
      sourcesData: item.type === 'sources' ? JSON.stringify(DEFAULT_SOURCES) : undefined,
      spacerHeight: item.type === 'spacer' ? 48 : undefined,
      sigAuthor: item.type === 'signature' ? AUTHOR_NAME : undefined,
      sigYear: item.type === 'signature' ? String(CURRENT_YEAR) : undefined,
      letterheadData: item.type === 'letterhead' ? JSON.stringify({
        title: docTitle,
        subtitle: 'A two-track model for local AI capability, applied tooling, and institutional deployment.',
        label: 'Document',
        status: DOCUMENT_STATUS,
        byline: DOCUMENT_BYLINE,
        year: String(CURRENT_YEAR)
      }) : undefined
    };
    setBlocks(prev => [...prev, newBlock]);
    setSelectedBlockId(newBlock.id);
    const isDesign = ['stat', 'terminal', 'heatmap', 'timeline', 'systemcard', 'flowchart', 'principles', 'swatchrow', 'sources', 'spacer', 'chart-market', 'chart-bar', 'chart-gallery', 'signature', 'letterhead'].includes(item.type);
    if (isDesign) setConfiguringBlockId(newBlock.id);else if (['heading', 'body', 'pullquote', 'callout', 'list'].includes(item.type)) setEditingBlockId(newBlock.id);
  }, [setBlocks, docTitle]);
  const handleEdit = useCallback((id: string, updates: Partial<DocBlock>) => {
    setBlocks(prev => prev.map(b => b.id === id ? {
      ...b,
      ...updates
    } : b));
  }, [setBlocks]);
  const handleDelete = useCallback((id: string) => {
    setBlocks(prev => prev.filter(b => b.id !== id));
    setSelectedBlockId(null);
    setEditingBlockId(null);
    setConfiguringBlockId(null);
  }, [setBlocks]);
  const handleMoveUp = useCallback((id: string) => {
    setBlocks(prev => {
      const idx = prev.findIndex(b => b.id === id);
      if (idx <= 0) return prev;
      const next = [...prev];
      [next[idx - 1], next[idx]] = [next[idx], next[idx - 1]];
      return next;
    });
  }, [setBlocks]);
  const handleMoveDown = useCallback((id: string) => {
    setBlocks(prev => {
      const idx = prev.findIndex(b => b.id === id);
      if (idx < 0 || idx >= prev.length - 1) return prev;
      const next = [...prev];
      [next[idx], next[idx + 1]] = [next[idx + 1], next[idx]];
      return next;
    });
  }, [setBlocks]);
  const handleMoveToNextPage = useCallback((id: string) => {
    const blockEl = document.querySelector<HTMLElement>(`[data-onganda-block-id="${id}"]`);
    const paperEl = documentPaperRef.current;
    const y = blockEl && paperEl ? blockEl.getBoundingClientRect().top - paperEl.getBoundingClientRect().top : 0;
    const pageOffset = (y % A4_PAGE_HEIGHT_PX + A4_PAGE_HEIGHT_PX) % A4_PAGE_HEIGHT_PX;
    const marginBefore = Math.ceil(A4_PAGE_HEIGHT_PX - pageOffset + PAGE_BREAK_PREVIEW_TOP_PX);
    handleEdit(id, {
      pageBreakBefore: true,
      marginBefore
    });
  }, [handleEdit]);
  const handleMoveToPreviousPage = useCallback((id: string) => {
    handleEdit(id, {
      pageBreakBefore: false,
      marginBefore: 0
    });
  }, [handleEdit]);

  // Drag reorder
  const handleDragStart = useCallback((id: string) => {
    setDragState({
      draggingId: id,
      overIdx: null
    });
  }, []);
  const handleDragOver = useCallback((overIdx: number) => {
    setDragState(prev => ({
      ...prev,
      overIdx
    }));
  }, []);
  const handleDragEnd = useCallback(() => {
    setDragState(prev => {
      if (prev.draggingId && prev.overIdx !== null) {
        setBlocks(prevBlocks => {
          const fromIdx = prevBlocks.findIndex(b => b.id === prev.draggingId);
          if (fromIdx < 0 || fromIdx === prev.overIdx) return prevBlocks;
          const next = [...prevBlocks];
          const [moved] = next.splice(fromIdx, 1);
          next.splice(prev.overIdx!, 0, moved);
          return next;
        });
      }
      return {
        draggingId: null,
        overIdx: null
      };
    });
  }, [setBlocks]);
  const handleDeselect = () => {
    setSelectedBlockId(null);
    setEditingBlockId(null);
    setConfiguringBlockId(null);
  };
  const handleResume = useCallback(() => {
    if (!savedSession) return;
    setDocTitle(savedSession.docTitle ?? 'Untitled Document');
    setPaperBackground(savedSession.paperBackground ?? 'warm');
    history.reset(savedSession.blocks ?? []);
    setSelectedBlockId(null);
    setEditingBlockId(null);
    setConfiguringBlockId(null);
    setStage('editor');
  }, [history, savedSession]);
  const handleRegenerate = useCallback(async (id: string, block: DocBlock) => {
    const { type } = block;
    const aiTypes = ['heading','body','pullquote','callout','list','divider','signature','chart-gallery'] as const;
    if (!aiTypes.includes(type as typeof aiTypes[number])) return;
    setRegeneratingBlockId(id);
    try {
      const result = await regenerateDocBlock(type as typeof aiTypes[number], block.content);
      setBlocks(prev => prev.map(b => b.id === id ? { ...b, content: result.content } : b));
    } finally {
      setRegeneratingBlockId(null);
    }
  }, [setBlocks]);
  const handleGenerateExport = useCallback((format: DocumentExportPayload['format']) => {
    setSelectedBlockId(null);
    setEditingBlockId(null);
    setConfiguringBlockId(null);
    setExportModal(null);
    if (format === 'PDF') {
      window.requestAnimationFrame(() => window.requestAnimationFrame(() => {
        window.setTimeout(() => window.print(), 160);
      }));
      return;
    }
    window.setTimeout(() => {
      const paperHtml = documentPaperRef.current?.outerHTML ?? '';
      downloadOfficeHtml(`${safeFileName(docTitle)}.doc`, wrapWordDocument(docTitle, paperHtml, paperBg), 'application/msword;charset=utf-8');
    }, 80);
  }, [docTitle, paperBg]);
  const handleApplyAiResult = useCallback((result: AiAuthoringResult) => {
    const nextBlocks = (result.blocks ?? []).map(docBlockFromAi);
    if (!nextBlocks.length) return;
    setDocTitle(result.title);
    setBlocks(nextBlocks);
    setSelectedBlockId(null);
    setEditingBlockId(null);
    setConfiguringBlockId(null);
  }, [setBlocks]);
  if (stage === 'picker') {
    return <TemplatePicker isDark={isDark} onSelect={handleTemplateSelect} onResume={savedSession ? handleResume : undefined} onBack={onClose} />;
  }
  return <div style={{
    minHeight: '100vh',
    width: '100%',
    maxWidth: '100vw',
    background: pageBg,
    transition: 'background 0.35s',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden'
  }} data-onganda-document-editor>
      <style>{`
        @media print {
          @page { size: A4 portrait; margin: 0; }
          html, body {
            width: 210mm;
            min-height: 297mm;
            margin: 0 !important;
            background: ${COLOR.milletClay} !important;
            print-color-adjust: exact;
            -webkit-print-color-adjust: exact;
          }
          body * { visibility: hidden !important; }
          [data-onganda-document-editor] {
            display: block !important;
            width: 210mm !important;
            height: auto !important;
            min-height: 0 !important;
            overflow: visible !important;
            background: transparent !important;
          }
          [data-onganda-editor-layout],
          [data-onganda-editor-scroll],
          [data-onganda-paper-shell] {
            display: contents !important;
            visibility: visible !important;
            height: auto !important;
            min-height: 0 !important;
            overflow: visible !important;
            padding: 0 !important;
            margin: 0 !important;
          }
          [data-onganda-print-document], [data-onganda-print-document] * { visibility: visible !important; }
          [data-onganda-print-document] {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 210mm !important;
            min-height: 297mm !important;
            box-sizing: border-box !important;
            box-shadow: none !important;
            border: 0 !important;
            background: ${paperBg} !important;
            overflow: visible !important;
            print-color-adjust: exact;
            -webkit-print-color-adjust: exact;
          }
          [data-onganda-paper-texture] {
            opacity: 0.024 !important;
          }
          [data-onganda-page-guide-overlay],
          [data-onganda-page-guide-overlay] * {
            visibility: visible !important;
          }
          [data-onganda-block] {
            outline: none !important;
            outline-offset: 0 !important;
            box-shadow: none !important;
            break-inside: auto;
            page-break-inside: auto;
          }
          [data-onganda-avoid-page-break="true"] {
            break-inside: avoid;
            page-break-inside: avoid;
          }
          [data-onganda-block-type="heading"] {
            break-after: avoid;
            page-break-after: avoid;
          }
          [data-onganda-block-type="signature"] {
            break-before: avoid;
            page-break-before: avoid;
          }
          [data-onganda-block] p,
          [data-onganda-block] li {
            orphans: 3;
            widows: 3;
          }
          [data-onganda-block-type="sources"] {
            margin-bottom: 6px !important;
          }
          [data-onganda-block-type="sources"] ol {
            gap: 6px !important;
          }
          [data-onganda-block-type="sources"] li {
            line-height: 1.45 !important;
          }
          [data-onganda-block-type="sources"] li {
            break-inside: avoid;
            page-break-inside: avoid;
          }
          [data-onganda-block-type="signature"] {
            margin-top: 0 !important;
          }
          [data-onganda-document-content] {
            box-decoration-break: clone;
            -webkit-box-decoration-break: clone;
            padding-top: 44px !important;
          }
          [data-onganda-page-break-before="true"] {
            break-before: page;
            page-break-before: always;
            margin-top: 0 !important;
            padding-top: ${PAGE_BREAK_PREVIEW_TOP_PX}px !important;
          }
          [data-onganda-print-document] button,
          [data-onganda-print-document] input,
          [data-onganda-print-document] textarea {
            display: none !important;
            visibility: hidden !important;
          }
          [data-onganda-export-ui="true"], [data-onganda-export-ui="true"] * {
            display: none !important;
            visibility: hidden !important;
          }
        }
      `}</style>
      <DocToolbar onClose={onClose} isDark={isDark} blockCount={blocks.length} docTitle={docTitle} onTitleChange={setDocTitle} paperBackground={paperBackground} onPaperBackgroundChange={setPaperBackground} onExport={fmt => setExportModal(fmt)} canUndo={history.canUndo} canRedo={history.canRedo} onUndo={history.undo} onRedo={history.redo} sessionSaved={sessionSaved} showAutoLetterhead={showAutoLetterhead} onToggleAutoLetterhead={() => setShowAutoLetterhead(v => !v)} />

      <div data-onganda-editor-layout style={{
      display: 'flex',
      flex: 1,
      minHeight: 0,
      overflow: 'hidden'
    }}>
        <InsertPanel isDark={isDark} onInsert={handleInsert} />

        <div data-onganda-editor-scroll style={{
        flex: 1,
        overflow: 'auto',
        padding: '36px 24px 80px'
      }} onClick={handleDeselect}>
          <div data-onganda-paper-shell style={{
          width: '210mm',
          maxWidth: 'none',
          margin: '0 auto'
        }}>
            <motion.article ref={documentPaperRef} data-onganda-print-document initial={{
            opacity: 0,
            y: 20
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            duration: 0.5
          }} style={{
            background: paperBg,
            outline: `1px solid ${paperBorder}`,
            position: 'relative',
            overflow: 'hidden',
            width: '210mm',
            minHeight: '297mm'
          }} onClick={e => e.stopPropagation()}>
              <WeaveOverlay isDark={isDark} opacity={0.026} />
              <PageGuideOverlay pageCount={pageCount} isDark={isDark} />
              {showAutoLetterhead && !blocks.some(b => b.type === 'letterhead') && <DocLetterhead isDark={isDark} title={docTitle} />}
              {blocks.filter(b => b.type === 'letterhead').map(lhBlock => <DocBlockView key={lhBlock.id} block={lhBlock} idx={0} isDark={isDark} isSelected={selectedBlockId === lhBlock.id} isEditing={editingBlockId === lhBlock.id} isConfiguring={configuringBlockId === lhBlock.id} dragState={dragState} citationCount={citationCount} onSelect={() => setSelectedBlockId(lhBlock.id)} onStartEdit={() => {
                setSelectedBlockId(lhBlock.id);
                setConfiguringBlockId(lhBlock.id);
                setEditingBlockId(null);
              }} onStopEdit={() => {
                setEditingBlockId(null);
                setConfiguringBlockId(null);
              }} onEdit={updates => handleEdit(lhBlock.id, updates)} onDelete={() => handleDelete(lhBlock.id)} onDragStart={() => handleDragStart(lhBlock.id)} onDragOver={() => {}} onDragEnd={handleDragEnd} onMoveUp={() => handleMoveUp(lhBlock.id)} onMoveDown={() => handleMoveDown(lhBlock.id)} onMoveToNextPage={() => handleMoveToNextPage(lhBlock.id)} onMoveToPreviousPage={() => handleMoveToPreviousPage(lhBlock.id)} onRegenerate={() => handleRegenerate(lhBlock.id, lhBlock)} regenerating={regeneratingBlockId === lhBlock.id} />)}

              <div data-onganda-document-content style={{
              padding: '16px 56px 8px',
              position: 'relative',
              zIndex: 2
            }}>
                <AnimatePresence>
                  {blocks.filter(b => b.type !== 'letterhead').map((block, idx) => <DocBlockView key={block.id} block={block} idx={idx} isDark={isDark} isSelected={selectedBlockId === block.id} isEditing={editingBlockId === block.id} isConfiguring={configuringBlockId === block.id} dragState={dragState} citationCount={citationCount} onSelect={() => setSelectedBlockId(block.id)} onStartEdit={() => {
                  setSelectedBlockId(block.id);
                  const isDesign = ['stat', 'terminal', 'heatmap', 'timeline', 'systemcard', 'flowchart', 'principles', 'swatchrow', 'sources', 'spacer', 'chart-market', 'chart-bar', 'chart-gallery', 'signature', 'letterhead'].includes(block.type);
                  if (isDesign) {
                    setConfiguringBlockId(block.id);
                    setEditingBlockId(null);
                  } else {
                    setEditingBlockId(block.id);
                    setConfiguringBlockId(null);
                  }
                }} onStopEdit={() => {
                  setEditingBlockId(null);
                  setConfiguringBlockId(null);
                }} onEdit={updates => handleEdit(block.id, updates)} onDelete={() => handleDelete(block.id)} onDragStart={() => handleDragStart(block.id)} onDragOver={() => handleDragOver(idx)} onDragEnd={handleDragEnd} onMoveUp={() => handleMoveUp(block.id)} onMoveDown={() => handleMoveDown(block.id)} onMoveToNextPage={() => handleMoveToNextPage(block.id)} onMoveToPreviousPage={() => handleMoveToPreviousPage(block.id)} onRegenerate={() => handleRegenerate(block.id, block)} regenerating={regeneratingBlockId === block.id} />)}
                </AnimatePresence>

                {blocks.filter(b => b.type !== 'letterhead').length === 0 && <div style={{
                padding: '80px 0',
                textAlign: 'center'
              }}>
                    <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 16
                }}>
                      <div style={{
                    display: 'flex',
                    gap: 4
                  }}>
                        {[COLOR.ochreOrange, COLOR.barkRust, COLOR.mahanguGold].map((c, i) => <div key={`empty-dot-${i}`} style={{
                      width: 6,
                      height: 6,
                      background: c,
                      opacity: 0.5
                    }} />)}
                      </div>
                      <p style={{
                    fontSize: 14,
                    color: isDark ? paperAlpha(0.55) : inkAlpha(0.66),
                    letterSpacing: '0.06em',
                    margin: 0
                  }}>
                        <span>Document is empty.</span>
                      </p>
                      <p style={{
                    fontSize: 11,
                    color: isDark ? paperAlpha(0.55) : inkAlpha(0.66),
                    margin: 0
                  }}>
                        <span>Use the Insert panel on the left to add blocks.</span>
                      </p>
                    </div>
                  </div>}
              </div>

              <div style={{
              padding: '16px 56px 36px'
            }}>
                <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginTop: 12
              }}>
                  <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6
                }}>
                    <OngandaLogoMark size={14} />
                    <span style={{
                    fontSize: 9,
                    color: isDark ? paperAlpha(0.55) : inkAlpha(0.66),
                    letterSpacing: '0.08em'
                  }}>{COPYRIGHT_NOTICE}</span>
                  </div>
                  <span style={{
                  fontSize: 9,
                  color: isDark ? paperAlpha(0.55) : inkAlpha(0.66)
                }}>{DOCUMENT_STATUS}</span>
                </div>
              </div>
            </motion.article>
          </div>
        </div>
        <AiAuthoringPanel mode="document" isDark={isDark} onApply={handleApplyAiResult} />
      </div>

      <AnimatePresence>
        {exportModal && <DocExportModal isDark={isDark} format={exportModal} docTitle={docTitle} blockCount={blocks.length} onGenerate={() => handleGenerateExport(exportModal)} onClose={() => setExportModal(null)} />}
      </AnimatePresence>
    </div>;
};
