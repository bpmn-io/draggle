import { resolve } from 'node:path';

import { defineConfig } from 'vite';

export default defineConfig({
  test: {
    globals: true,
    setupFiles: [
      resolve(__dirname, 'test', 'setup.js')
    ],
    browser: {
      enabled: true,
      instances: [
        { browser: 'chromium' },
      ]
    }
  }
});
