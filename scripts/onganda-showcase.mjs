#!/usr/bin/env node
// ─── Onganda Design System — the showcase, from inside a product ────────────
// The guidance says "open /showcase before you build", but a product that
// installs the package had no showcase to open — only the screenshots of it.
// The built showcase and consumer test pages ship in dist/showcase; this
// serves them.
//
//   npx onganda-showcase            → http://127.0.0.1:4174/showcase
//   npx onganda-showcase --port 5000

import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'dist', 'showcase');
const portFlag = process.argv.indexOf('--port');
const port = portFlag === -1 ? 4174 : Number(process.argv[portFlag + 1]);

try {
  await stat(path.join(root, 'index.html'));
} catch {
  console.error(`onganda-showcase: no build at ${root}. Reinstall the package, or run \`npm run build:showcase\` in the Onganda repo.`);
  process.exit(1);
}

const TYPES = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css',
  '.svg': 'image/svg+xml', '.png': 'image/png', '.woff2': 'font/woff2', '.json': 'application/json'
};

createServer(async (req, res) => {
  const rel = decodeURIComponent((req.url ?? '/').split('?')[0]);
  const file = path.normalize(path.join(root, rel));
  // Only files inside the build; every route falls back to the app shell.
  const target = file.startsWith(root) && path.extname(file) ? file : path.join(root, 'index.html');
  try {
    const body = await readFile(target);
    res.writeHead(200, { 'content-type': TYPES[path.extname(target)] ?? 'application/octet-stream' });
    res.end(body);
  } catch {
    res.writeHead(404).end('not found');
  }
}).listen(port, '127.0.0.1', () => {
  const base = `http://127.0.0.1:${port}`;
  console.log(`Onganda showcase on ${base}\n`);
  for (const [route, what] of [
    ['/showcase', 'every primitive and pattern, both modes'],
    ['/test/studio', 'a media tool screen, built only from the package'],
    ['/test/app', 'a product screen: table, inspector, dialog'],
    ['/test/dashboard', 'stat band, charts, status table'],
    ['/test/form', 'every control in every state'],
    ['/test/landing', 'an editorial page'],
    ['/test/launch', 'a second landing page, the dials set differently'],
    ['/', 'the public site']
  ]) console.log(`  ${base}${route}`.padEnd(46) + what);
});
