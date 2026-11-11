import bpmnIoPlugin from 'eslint-plugin-bpmn-io';

const files = {
  ignored: [
    'coverage',
    'dist',
    'example',
    'node_modules'
  ],
  browser: [
    'src/**/*.js',
    'test/**/*.js'
  ],
  build: [
    '*.js',
    '*.mjs'
  ]
};

export default [
  {
    ignores: files.ignored
  },
  ...bpmnIoPlugin.configs.browser.map(config => ({
    ...config,
    files: files.browser
  })),
  {
    files: [ 'src/**/*.js' ],
    languageOptions: {
      globals: {
        global: 'readonly'
      }
    }
  },
  ...bpmnIoPlugin.configs.node.map(config => ({
    ...config,
    files: files.build
  }))
];
