import { resolve } from 'node:path';

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
  }
});
