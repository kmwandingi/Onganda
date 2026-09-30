import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { COLOR } from './onganda-tokens';
import { OngandaLogoMark, PixelDot, PixelTag } from './onganda-primitives';
import { IconCheck, IconRefresh, IconSettings, IconTerminal } from './onganda-icons';
import type { AiDocBlock, AiSlideBlock, AiSlide, AiAuthoringResult, AiGeneratableDocBlockType } from './onganda-block-types';

export type AuthoringMode = 'document' | 'deck';
export type { AiDocBlock, AiSlideBlock, AiSlide, AiAuthoringResult } from './onganda-block-types';

const CURRENT_YEAR = new Date().getFullYear();
const AUTHOR_NAME = 'Kenneth Mwandingi';

interface EndpointConfig {
  provider: 'openai-compatible' | 'gemini-rest' | 'custom-json';
  endpoint: string;
  model: string;
  apiKey: string;
}

interface ChatMessage {
  role: 'assistant' | 'user' | 'system';
  text: string;
}

const STORAGE_KEY = 'onganda_ai_authoring_endpoint';
const QUESTIONS = [
  'What is the topic and working title?',
  'Who is this for?',
  'What should the reader or audience do after seeing it?',
  'What facts, constraints, or source points must be included?',
  'Should it feel like a concise brief, a persuasive pitch, or a technical concept note?'
];

const defaultConfig: EndpointConfig = {
  provider: 'openai-compatible',
  endpoint: 'http://localhost:11434/v1/chat/completions',
  model: 'qwen3:8b',
  apiKey: ''
};

const loadConfig = (): EndpointConfig => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? { ...defaultConfig, ...JSON.parse(raw) } : defaultConfig;
  } catch {
    return defaultConfig;
  }
};

const saveConfig = (config: EndpointConfig) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
};

const extractJson = (text: string): AiAuthoringResult => {
  const trimmed = text.trim();
  const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i)?.[1];
  const candidate = fenced ?? trimmed.match(/\{[\s\S]*\}/)?.[0] ?? trimmed;
  return JSON.parse(candidate) as AiAuthoringResult;
};

const cleanResult = (result: AiAuthoringResult, mode: AuthoringMode): AiAuthoringResult => {
  const title = result.title?.trim() || (mode === 'document' ? 'Generated Onganda Document' : 'Generated Onganda Deck');
  const summary = result.summary?.trim() || 'Generated from the Onganda authoring assistant.';
  if (mode === 'document') {
    const blocks = (result.blocks ?? []).filter(block => block.content?.trim()).slice(0, 18);
    return { title, summary, blocks: blocks.length ? blocks : offlineDraft(mode, summary).blocks };
  }
  const slides = (result.slides ?? []).filter(slide => slide.title?.trim()).slice(0, 12);
  return { title, summary, slides: slides.length ? slides : offlineDraft(mode, summary).slides };
};

const shortTitle = (brief: string, fallback: string) => {
  const first = brief.split(/[.\n]/)[0]
    ?.replace(/^about\s+/i, '')
    .replace(/^(create|write|draft|generate)\s+(a|an)?\s*/i, '')
    .replace(/^(\d+|one|two|three|four|five|six|seven|eight|nine|ten)\s+/i, '')
    .replace(/^(slide|slides|page|pages)\s+/i, '')
    .replace(/^(partner|public|internal|short|concise)\s+/i, '')
    .replace(/^(deck|presentation|document|brief|report|memo)\s+(for|about|on)\s+/i, '')
    .replace(/^(deck|presentation|document|brief|report|memo)\s+/i, '')
    .replace(/^for\s+/i, '')
    .trim();
  if (!first) return fallback;
  return first.length > 74 ? first.slice(0, 74).trim() : first;
};

const requiredGaps = (brief: string, mode: AuthoringMode) => {
  const text = brief.toLowerCase();
  const gaps: string[] = [];
  if (brief.trim().length < 60) gaps.push('topic and context');
  if (!/(for|audience|partner|investor|institution|team|public|government|ministry|lab)/.test(text)) gaps.push('audience');
  if (!/(goal|purpose|convince|explain|request|propose|brief|pitch|report|document|presentation|deck)/.test(text)) gaps.push('purpose');
  if (mode === 'deck' && !/(slide|deck|presentation|pitch|talk)/.test(text)) gaps.push('deck shape');
  if (mode === 'document' && !/(brief|memo|report|letter|concept|paper|document)/.test(text)) gaps.push('document shape');
  return gaps;
};

const buildPrompt = (mode: AuthoringMode, brief: string) => `You are Onganda's authoring assistant.
Return only valid JSON. Do not include markdown.

Task:
Create a ${mode === 'document' ? 'structured editable document' : 'structured editable presentation deck'} for the Onganda editor.

Design and product constraints:
- Onganda is the project and Namibia AI Systems Lab.
- Okaanda is only one system inside Onganda: the Granary / model and data platform.
- Keep the tone calm, precise, specific, and non-generic.
- Prefer sovereignty, control, capability, evaluation, deployment, interfaces, and useful systems.
- Output must be editable inside the existing editor, so use short blocks and clear section titles.
- For decks, use "less is more" presentation writing: one idea per slide, no dense paragraphs, large phrases, deliberate whitespace, and at most 1-3 blocks per slide.
- Deck headlines should be 2-8 words. Body blocks should be one short sentence. Never make bullet-heavy or paragraph-heavy slides.
- Deck slides should vary tastefully: a title slide, a section/number slide, a chart-focused slide, a system-focused slide, and a closing ask when appropriate.

Allowed document block types:
heading, body, pullquote, callout, list, divider, signature, chart-gallery.

Allowed deck block types:
headline, body, label, quote, system, chart, divider.

Required JSON shape for document:
{
  "title": "string",
  "summary": "string",
  "blocks": [{"type":"heading|body|pullquote|callout|list|divider|signature|chart-gallery","content":"string"}]
}

Required JSON shape for deck:
{
  "title": "string",
  "summary": "string",
  "slides": [{"title":"string","subtitle":"string","blocks":[{"type":"headline|body|label|quote|system|chart|divider","content":"string","systemName":"Okaanda|Oshini|Ombiga|Etiti|Oshitoo"}]}]
}

User brief:
${brief}`;

const endpointHeaders = (config: EndpointConfig) => ({
  'Content-Type': 'application/json',
  ...(config.apiKey ? { Authorization: `Bearer ${config.apiKey}` } : {})
});

const callEndpoint = async (mode: AuthoringMode, brief: string, config: EndpointConfig): Promise<AiAuthoringResult> => {
  const prompt = buildPrompt(mode, brief);
  if (!config.endpoint.trim()) throw new Error('No endpoint configured.');
  if (config.provider === 'gemini-rest') {
    const url = config.apiKey && !config.endpoint.includes('key=') ? `${config.endpoint}${config.endpoint.includes('?') ? '&' : '?'}key=${config.apiKey}` : config.endpoint;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
    });
    if (!response.ok) throw new Error(`Endpoint returned ${response.status}`);
    const json = await response.json();
    const text = json.candidates?.[0]?.content?.parts?.map((part: { text?: string }) => part.text ?? '').join('\n') ?? '';
    return cleanResult(extractJson(text), mode);
  }
  const body = config.provider === 'custom-json' ? {
    mode,
    prompt,
    schema: mode === 'document' ? 'onganda-document-v1' : 'onganda-deck-v1'
  } : {
    model: config.model,
    messages: [
      { role: 'system', content: 'Return only strict JSON matching the requested schema.' },
      { role: 'user', content: prompt }
    ],
    temperature: 0.45,
    response_format: { type: 'json_object' }
  };
  const response = await fetch(config.endpoint, {
    method: 'POST',
    headers: endpointHeaders(config),
    body: JSON.stringify(body)
  });
  if (!response.ok) throw new Error(`Endpoint returned ${response.status}`);
  const json = await response.json();
  const text = json.choices?.[0]?.message?.content ?? json.output ?? json.result ?? JSON.stringify(json);
  return cleanResult(typeof text === 'string' ? extractJson(text) : text, mode);
};

const offlineDraft = (mode: AuthoringMode, brief: string): AiAuthoringResult => {
  const topic = shortTitle(brief, mode === 'document' ? 'Onganda AI Capability Brief' : 'Onganda Partner Deck');
  if (mode === 'document') {
    return {
      title: topic,
      summary: 'Offline scaffold prepared from the current brief.',
      blocks: [
        { type: 'heading', content: topic },
        { type: 'body', content: 'Onganda is building domestic capability to adapt, evaluate, deploy, and turn AI systems into useful tools.' },
        { type: 'pullquote', content: 'Useful AI capability begins when systems can be shaped, tested, and run locally.' },
        { type: 'heading', content: 'Why this matters' },
        { type: 'body', content: 'The work connects model readiness, adaptation workflows, containers, interfaces, and delivered applications into one practical stack.' },
        { type: 'callout', content: 'Use the assistant endpoint to replace this scaffold with a model-generated version once the local or hosted endpoint is configured.' },
        { type: 'chart-gallery', content: 'Reusable chart system' },
        { type: 'signature', content: `Prepared by ${AUTHOR_NAME} · ${CURRENT_YEAR}` }
      ]
    };
  }
  return {
    title: topic,
    summary: 'Offline deck scaffold prepared from the current brief.',
    slides: [
      { title: topic, subtitle: 'Namibia AI Systems Lab', blocks: [{ type: 'label', content: 'Onganda' }, { type: 'headline', content: topic }, { type: 'body', content: 'AI systems Namibia can shape, run, and build on.' }] },
      { title: '01', subtitle: 'Why this exists', blocks: [{ type: 'label', content: '01' }, { type: 'headline', content: 'Capability before dependency.' }] },
      { title: 'Readiness', subtitle: 'What needs to be built', blocks: [{ type: 'label', content: 'System readiness' }, { type: 'chart', content: 'Adaptation, evaluation, deployment, and delivery.' }] },
      { title: 'Five systems', subtitle: 'One compound', blocks: [{ type: 'system', content: 'Granary', systemName: 'Okaanda' }, { type: 'system', content: 'Mill', systemName: 'Oshini' }, { type: 'system', content: 'Surface', systemName: 'Etiti' }] },
      { title: 'Next', subtitle: 'Collaboration', blocks: [{ type: 'quote', content: 'Start with one serious pilot conversation.' }] }
    ]
  };
};

// ─── Single-block regeneration ────────────────────────────────────────────────
// Regenerates a single doc block in isolation. Uses the same endpoint config
// as the main authoring panel. Falls back to a branded offline block when no
// endpoint is configured. The document editor calls this from its toolbar.

const OFFLINE_REGEN: Record<string, string> = {
  heading:     'Onganda — AI Systems for Namibia',
  body:        'Onganda connects model readiness, adaptation, containers, interfaces, and delivery into one sovereign AI capability stack.',
  pullquote:   'Useful AI begins when the people who need it can shape, test, and run it themselves.',
  callout:     'Configure an AI endpoint in the Authoring Panel to generate context-specific content.',
  list:        'Sovereign data · Domestic adaptation · Secure containers · Local interfaces · Field delivery',
  divider:     '',
  signature:   `Prepared by ${AUTHOR_NAME} · ${CURRENT_YEAR}`,
  'chart-gallery': 'Reusable chart system',
};

export const regenerateDocBlock = async (
  blockType: AiGeneratableDocBlockType,
  currentContent: string
): Promise<AiDocBlock> => {
  const config = loadConfig();
  if (config.endpoint.trim()) {
    try {
      const brief = `Rewrite or improve this single "${blockType}" block for an Onganda document. Keep it concise, calm, and specific to Namibia's sovereign AI capability. Current content: "${currentContent}"`;
      const prompt = `${buildPrompt('document', brief)}\n\nIMPORTANT: Return a JSON object containing ONLY ONE block of type "${blockType}": {"title":"","summary":"","blocks":[{"type":"${blockType}","content":"..."}]}`;
      const result = await callEndpoint('document', brief, { ...config, endpoint: config.endpoint });
      const block = result.blocks?.find(b => b.type === blockType) ?? result.blocks?.[0];
      if (block?.content?.trim()) return { type: blockType, content: block.content.trim() };
    } catch {
      // fall through to offline
    }
  }
  return {
    type: blockType,
    content: OFFLINE_REGEN[blockType] ?? currentContent
  };
};

export type { AiGeneratableDocBlockType } from './onganda-block-types';

const inputStyle = (isDark: boolean): React.CSSProperties => ({
  width: '100%',
  background: isDark ? COLOR.darkBg : COLOR.dustLight,
  border: `1px solid ${isDark ? 'rgba(232,225,207,0.1)' : 'rgba(30,26,23,0.12)'}`,
  color: isDark ? COLOR.milletClay : COLOR.charBlack,
  padding: '9px 10px',
  fontSize: 11,
  outline: 'none'
});

export const AiAuthoringPanel = ({
  mode,
  isDark,
  onApply
}: {
  mode: AuthoringMode;
  isDark: boolean;
  onApply: (result: AiAuthoringResult) => void;
}) => {
  const [open, setOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [brief, setBrief] = useState('');
  const [config, setConfig] = useState<EndpointConfig>(() => loadConfig());
  const [messages, setMessages] = useState<ChatMessage[]>([{
    role: 'assistant',
    text: `Tell me what ${mode === 'document' ? 'document' : 'presentation'} you need. I will ask for missing context before generating editable Onganda content.`
  }]);
  const [result, setResult] = useState<AiAuthoringResult | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const gaps = useMemo(() => requiredGaps(brief, mode), [brief, mode]);
  const fg = isDark ? COLOR.milletClay : COLOR.charBlack;
  const muted = isDark ? 'rgba(232,225,207,0.55)' : 'rgba(30,26,23,0.66)';
  const bg = isDark ? COLOR.darkCard : COLOR.dustLight;
  const border = isDark ? 'rgba(232,225,207,0.12)' : 'rgba(30,26,23,0.12)';

  const updateConfig = (updates: Partial<EndpointConfig>) => {
    const next = { ...config, ...updates };
    setConfig(next);
    saveConfig(next);
  };

  const askForContext = () => {
    const selected = gaps.length ? gaps : ['final constraints'];
    setMessages(prev => [...prev, { role: 'user', text: brief || 'I want to generate content.' }, {
      role: 'assistant',
      text: `Before generation, clarify: ${selected.map(gap => QUESTIONS.find(q => q.toLowerCase().includes(gap.split(' ')[0])) ?? gap).join(' ')}`
    }]);
  };

  const generate = async (useEndpoint: boolean) => {
    setBusy(true);
    setError(null);
    setResult(null);
    try {
      const next = useEndpoint ? await callEndpoint(mode, brief, config) : cleanResult(offlineDraft(mode, brief), mode);
      setResult(next);
      setMessages(prev => [...prev, {
        role: 'assistant',
        text: `Draft ready: ${next.title}. Review it, then apply it into the editor as normal editable ${mode === 'document' ? 'blocks' : 'slides'}.`
      }]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Generation failed.');
    } finally {
      setBusy(false);
    }
  };

  return <div data-onganda-ai-authoring style={{
    width: open ? 330 : 54,
    flexShrink: 0,
    borderLeft: `1px solid ${border}`,
    background: isDark ? COLOR.darkCardAlt : COLOR.milletClay,
    transition: 'width 0.25s ease',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column'
  }}>
    <button onClick={() => setOpen(prev => !prev)} style={{
      height: 54,
      border: 0,
      borderBottom: `1px solid ${border}`,
      background: COLOR.charBlack,
      color: COLOR.milletClay,
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: open ? 'space-between' : 'center',
      padding: open ? '0 14px' : 0
    }}>
      {open ? <><span style={{ display: 'flex', alignItems: 'center', gap: 9 }}><OngandaLogoMark size={18} /><span style={{ fontSize: 10, fontWeight: 800, letterSpacing: '0.16em', textTransform: 'uppercase' }}>AI Authoring</span></span><PixelDot color={COLOR.ochreOrange} size={5} /></> : <IconTerminal size={18} color={COLOR.milletClay} />}
    </button>
    <AnimatePresence initial={false}>
      {open && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{
        padding: 14,
        overflowY: 'auto',
        minHeight: 0
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <PixelTag hex={COLOR.ochreOrange} label={mode === 'document' ? 'Generate Document' : 'Generate Deck'} />
          <button onClick={() => setSettingsOpen(prev => !prev)} style={{ border: 0, background: 'transparent', cursor: 'pointer' }} title="Endpoint settings">
            <IconSettings size={16} color={muted} />
          </button>
        </div>
        {settingsOpen && <div style={{ marginTop: 12, padding: 12, background: bg, border: `1px solid ${border}` }}>
          <label style={{ fontSize: 9, color: muted, letterSpacing: '0.14em', textTransform: 'uppercase', fontWeight: 800 }}>Provider</label>
          <select value={config.provider} onChange={e => updateConfig({ provider: e.target.value as EndpointConfig['provider'] })} style={{ ...inputStyle(isDark), marginTop: 6 }}>
            <option value="openai-compatible">OpenAI-compatible</option>
            <option value="gemini-rest">Gemini REST</option>
            <option value="custom-json">Custom JSON endpoint</option>
          </select>
          <label style={{ display: 'block', marginTop: 10, fontSize: 9, color: muted, letterSpacing: '0.14em', textTransform: 'uppercase', fontWeight: 800 }}>Endpoint</label>
          <input value={config.endpoint} onChange={e => updateConfig({ endpoint: e.target.value })} style={{ ...inputStyle(isDark), marginTop: 6 }} />
          <label style={{ display: 'block', marginTop: 10, fontSize: 9, color: muted, letterSpacing: '0.14em', textTransform: 'uppercase', fontWeight: 800 }}>Model</label>
          <input value={config.model} onChange={e => updateConfig({ model: e.target.value })} style={{ ...inputStyle(isDark), marginTop: 6 }} />
          <label style={{ display: 'block', marginTop: 10, fontSize: 9, color: muted, letterSpacing: '0.14em', textTransform: 'uppercase', fontWeight: 800 }}>API key</label>
          <input value={config.apiKey} onChange={e => updateConfig({ apiKey: e.target.value })} type="password" placeholder="Optional for local endpoints" style={{ ...inputStyle(isDark), marginTop: 6 }} />
        </div>}
        <div style={{ display: 'grid', gap: 8, marginTop: 12 }}>
          {messages.slice(-3).map((message, idx) => <div key={`ai-msg-${idx}`} style={{
            padding: '9px 10px',
            background: message.role === 'assistant' ? bg : 'transparent',
            border: `1px solid ${message.role === 'assistant' ? border : 'transparent'}`,
            color: message.role === 'assistant' ? fg : muted,
            fontSize: 11,
            lineHeight: 1.5
          }}>{message.text}</div>)}
        </div>
        <textarea value={brief} onChange={e => setBrief(e.target.value)} placeholder={mode === 'document' ? 'Example: A concept note for a Namibian ministry about why Onganda matters, with systems, risks, and next steps.' : 'Example: A 7-slide partner deck introducing Onganda, the five systems, and a pilot conversation.'} style={{
          ...inputStyle(isDark),
          minHeight: 138,
          resize: 'vertical',
          marginTop: 12,
          lineHeight: 1.5
        }} />
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 10 }}>
          {gaps.length ? gaps.map(gap => <span key={gap} style={{ fontSize: 9, fontWeight: 800, letterSpacing: '0.10em', textTransform: 'uppercase', color: COLOR.barkRust, border: `1px solid ${COLOR.barkRust}40`, padding: '4px 6px' }}>{gap}</span>) : <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 9, color: COLOR.barkRust }}><IconCheck size={12} color={COLOR.ochreOrange} /> Enough context to draft</span>}
        </div>
        {error && <p style={{ color: COLOR.firedRed, fontSize: 11, lineHeight: 1.5 }}>{error}</p>}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginTop: 12 }}>
          <button onClick={askForContext} disabled={busy} style={{ padding: 10, border: `1px solid ${border}`, background: 'transparent', color: fg, cursor: 'pointer', fontSize: 10, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Ask</button>
          <button onClick={() => generate(true)} disabled={busy || !brief.trim()} style={{ padding: 10, border: 0, background: COLOR.ochreOrange, color: COLOR.milletClay, cursor: busy || !brief.trim() ? 'not-allowed' : 'pointer', fontSize: 10, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{busy ? 'Working' : 'Generate'}</button>
        </div>
        <button onClick={() => generate(false)} disabled={busy || !brief.trim()} style={{ width: '100%', marginTop: 8, padding: 9, border: `1px dashed ${border}`, background: 'transparent', color: muted, cursor: busy || !brief.trim() ? 'not-allowed' : 'pointer', fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          <IconRefresh size={11} color={muted} /> Offline scaffold
        </button>
        {result && <div style={{ marginTop: 12, padding: 12, border: `1px solid ${COLOR.ochreOrange}50`, background: bg }}>
          <p style={{ margin: 0, color: fg, fontSize: 14, fontWeight: 700 }}>{result.title}</p>
          <p style={{ margin: '6px 0 12px', color: muted, fontSize: 11, lineHeight: 1.5 }}>{result.summary}</p>
          <button onClick={() => onApply(result)} style={{ width: '100%', padding: 11, border: 0, background: COLOR.charBlack, color: COLOR.milletClay, cursor: 'pointer', fontSize: 10, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.10em' }}>
            Apply to editor
          </button>
        </div>}
      </motion.div>}
    </AnimatePresence>
  </div>;
};
