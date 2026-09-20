import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests/browser',
  timeout: 30_000,
  // Font rasterisation differs per OS, so a macOS baseline will never match a
  // Linux CI run. Give each platform its own file instead of a guaranteed
  // pixel diff. Generate a platform's baselines once with:
  //   npx playwright test appearance --update-snapshots
  snapshotPathTemplate: '{testDir}/__screenshots__/{platform}/{arg}{ext}',
  use: {
    baseURL: 'http://127.0.0.1:4173',
    trace: 'retain-on-failure',
  },
  webServer: {
    command: 'npm run preview -- --host 127.0.0.1 --port 4173',
    url: 'http://127.0.0.1:4173',
    reuseExistingServer: true,
  },
});
