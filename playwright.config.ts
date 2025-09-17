import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: 'tests/playwright',
  timeout: 30_000,
  use: {
    baseURL: process.env.HOST || 'http://localhost:8080',
    video: 'on',
    screenshot: 'on',
    trace: 'retain-on-failure'
  },
  reporter: [['list']]
});
