#!/usr/bin/env node
// ─── Onganda Design System — version stamp ──────────────────────────────────
// The package is installed from a git commit, not a registry, so its version
// stayed 1.x.y across every commit. Bundlers key their dependency caches on
// the version: a consumer bumping the pin got the new code on disk and the
// OLD bundle from cache, which showed up as a blank page when a newly
// exported token was missing at runtime.
//
// `prepare` runs inside the clone npm makes when installing a git dependency,
// so the commit is available here. Stamping it into the version gives every
// commit a distinct version and makes those caches invalidate on their own.
//
// It is a no-op outside a git checkout, so a tarball install is unaffected.

import { readFileSync, writeFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const file = path.join(root, 'package.json');

let sha;
try {
  sha = execFileSync('git', ['rev-parse', '--short=7', 'HEAD'], { cwd: root, stdio: ['ignore', 'pipe', 'ignore'] })
    .toString().trim();
} catch {
  process.exit(0); // not a checkout; nothing to stamp
}
if (!/^[0-9a-f]{7}$/.test(sha)) process.exit(0);

const pkg = JSON.parse(readFileSync(file, 'utf8'));
const base = pkg.version.split('+')[0];
const stamped = `${base}+${sha}`;
if (pkg.version === stamped) process.exit(0);

pkg.version = stamped;
writeFileSync(file, JSON.stringify(pkg, null, 2) + '\n');
console.log(`version ${stamped}`);
