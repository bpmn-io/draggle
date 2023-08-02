import { resolve } from 'path';

import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    outDir: 'dist',
    lib: {
      entry: resolve(__dirname, 'index.js'),
      name: 'draggle',
      fileName: 'draggle',
    },
    commonjsOptions: {
      transformMixedEsModules: true
    },
    define: {
      global: {}
    },
    rollupOptions: {
      external: [
        'contra'
      ]
    }
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: [
      resolve(__dirname, 'test', 'setup.js')
    ],
    browser: {
      enabled: true,
      headless: true,
      name: 'chrome'
    }
  }
});