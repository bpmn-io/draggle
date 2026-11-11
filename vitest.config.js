import { resolve } from 'node:path';

import { playwright } from '@vitest/browser-playwright';
import { preview } from '@vitest/browser-preview';
import { defineConfig } from 'vite';

const HEADLESS = !!process.env.HEADLESS;

const TEST_BROWSERS = (process.env.TEST_BROWSERS || 'chrome').split(',');

export default defineConfig({
  test: {
    globals: true,
    setupFiles: [
      resolve(__dirname, 'test', 'setup.js')
    ],
    browser: {
      enabled: true,
      headless: HEADLESS,
      provider: HEADLESS ? playwright() : preview(),
      instances: TEST_BROWSERS.map(
        browser => ({ browser })
      )
    }
  }
});
