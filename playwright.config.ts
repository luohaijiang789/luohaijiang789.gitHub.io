import { defineConfig } from '@playwright/test';
export default defineConfig({
  testDir: './tests/browser',
  fullyParallel: true,
  retries: process.env.CI ? 1 : 0,
  reporter: 'list',
  use: { baseURL: 'http://127.0.0.1:4321', trace: 'retain-on-failure' },
  webServer: { command: 'npm run preview -- --ignore-lock --port 4321', url: 'http://127.0.0.1:4321', reuseExistingServer: !process.env.CI },
});
