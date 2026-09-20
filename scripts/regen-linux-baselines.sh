#!/usr/bin/env bash
# Regenerate the Linux visual baselines in the Playwright container that
# matches CI. Font rasterisation is per-OS, so a macOS baseline can never
# satisfy a Linux run — both sets live in tests/browser/__screenshots__/.
#
#   ./scripts/regen-linux-baselines.sh
#
# Requires Docker. The repo is copied into the container rather than mounted,
# so the host's node_modules is never replaced with Linux binaries.
set -euo pipefail

VERSION="$(node -p "require('./node_modules/@playwright/test/package.json').version")"
IMAGE="mcr.microsoft.com/playwright:v${VERSION}-noble"

echo "Using ${IMAGE}"
docker run --rm -v "$PWD":/work "$IMAGE" bash -c '
set -e
cd /work
mkdir -p /app
tar -cf - --exclude=node_modules --exclude=dist --exclude=test-results --exclude=.git . | (cd /app && tar -xf -)
cd /app
echo "== install =="
npm ci --ignore-scripts --no-audit --no-fund >/dev/null 2>&1
npm run build:showcase >/dev/null 2>&1
echo "== regenerating linux baselines =="
npx playwright test --update-snapshots --reporter=line 2>&1 | tail -3
mkdir -p /work/tests/browser/__screenshots__/linux
cp /app/tests/browser/__screenshots__/linux/*.png /work/tests/browser/__screenshots__/linux/
echo "== verifying with no updates =="
npx playwright test --reporter=line 2>&1 | tail -3
'
