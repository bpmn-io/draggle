import { resolve } from 'path';

import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    outDir: 'dist',
    lib: {
      entry: resolve(__dirname, 'dragula.js'),
      name: 'dragula',
      fileName: 'dragula',
    },
    commonjsOptions: {
      transformMixedEsModules: true
    },
    define: {
      global: {}
    },
    rollupOptions: {
      external: [
        'contra',
        'crossvent'
      ]
    }
  },
  test: {
    globals: true,
    environment: 'jsdom'
  }
});