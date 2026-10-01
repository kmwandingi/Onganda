#!/usr/bin/env node
// ─── Onganda Design System — agent docs for other tools ─────────────────────
// Windsurf, ChatGPT/Codex and the Claude slash command each used to carry
// their own copy of the design system: hand-written re-implementations of the
// components, frozen at whatever the system looked like when they were
// written. Every change since — the ochre primary, flat cards, the retired
// dotted rule, the pixel grid — left them behind, and an agent handed one of
// them built the old system by hand.
//
// They are now GENERATED: a short header saying how that tool uses the file,
// then SKILL.md verbatim. One source, so they cannot drift.
//
//   node scripts/build-agent-docs.mjs          write
//   node scripts/build-agent-docs.mjs --check  fail when stale

import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const skill = readFileSync(path.join(root, 'skills/onganda-design-system/SKILL.md'), 'utf8')
  // Drop the skill's front matter; each target carries its own header.
  .replace(/^---\n[\s\S]*?\n---\n+/, '');

const INSTALL = `Use the package, never a copy of it:

    npm install @onganda/design-system@github:kmwandingi/Onganda#main --force

Then import components from '@onganda/design-system' and the stylesheet
'@onganda/design-system/style.css'. Do not re-implement PixelButton,
PixelPanel or any other primitive by hand — a hand-written copy is how a
product ends up with an older, cheaper version of the system. The files this
guide refers to (SKILL.md, reference/, screenshots/test-pages/, src/test-pages/)
ship inside the installed package at node_modules/@onganda/design-system/.`;

const GENERATED = '<!-- GENERATED from skills/onganda-design-system/SKILL.md by scripts/build-agent-docs.mjs. Do not edit; edit SKILL.md and run `npm run build:agent-docs`. -->';

const TARGETS = [
  ['skills/windsurf-rules.md', `# Windsurf Rules — Onganda Design System
# Save this as \`.windsurfrules\` at the root of a project that uses Onganda.
# Windsurf reads it as persistent context for Cascade.

${GENERATED}

${INSTALL}

---

`],
  ['skills/chatgpt-codex-system-prompt.md', `# System Prompt — Onganda Design System
# Paste everything below the line into ChatGPT's "System" field, or the
# \`system\` message for the OpenAI API / Codex.

${GENERATED}

---

You are a senior React + TypeScript engineer building interfaces with the
Onganda design system. Follow the guide below exactly.

${INSTALL}

`],
  ['.claude/commands/pixel-design-system.md', `# Onganda Design System
# Usage: /pixel-design-system [describe what you're building]
# Apply every rule below to the task. Read the referenced files in the
# installed package before writing code.

${GENERATED}

${INSTALL}

---

`]
];

const stale = [];
for (const [rel, header] of TARGETS) {
  const file = path.join(root, rel);
  const body = header + skill;
  if (process.argv.includes('--check')) {
    if (!existsSync(file) || readFileSync(file, 'utf8') !== body) stale.push(rel);
  } else {
    writeFileSync(file, body);
  }
}
if (stale.length) {
  console.error(`${stale.join(', ')} stale — SKILL.md changed. Run \`npm run build:agent-docs\` and commit.`);
  process.exit(1);
}
console.log(process.argv.includes('--check')
  ? `Agent docs are current — ${TARGETS.length} generated from SKILL.md.`
  : `Wrote ${TARGETS.length} agent docs from SKILL.md.`);
