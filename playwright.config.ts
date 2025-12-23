import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  timeout: 30 * 1000,
  expect: { toHaveScreenshot: { maxDiffPixels: 50 } },
  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL || `http://127.0.0.1:${process.env.PLAYWRIGHT_PORT || '3000'}`,
    headless: true,
    viewport: { width: 1280, height: 800 },
    actionTimeout: 10 * 1000,
    trace: 'on-first-retry',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  ],
  // If PLAYWRIGHT_NO_WEBSERVER is set, skip starting the dev server and assume it is already running.
  webServer: process.env.PLAYWRIGHT_NO_WEBSERVER ? undefined : {
    command: 'npm run dev',
    port: Number(process.env.PLAYWRIGHT_PORT || '3000'),
    timeout: 120 * 1000,
    reuseExistingServer: !process.env.CI,
  },
});
