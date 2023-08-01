import { initOptions } from '../src/util';

import { test, expect } from 'vitest';

test('drake has sensible default options', () => {
  const options = initOptions({});
  expect(typeof options.moves).toBe('function');
  expect(typeof options.accepts).toBe('function');
  expect(typeof options.invalid).toBe('function');
  expect(typeof options.isContainer).toBe('function');
  expect(options.copy).toBe(false);
  expect(options.revertOnSpill).toBe(false);
  expect(options.removeOnSpill).toBe(false);
  expect(options.direction).toBe('vertical');
  expect(options.mirrorContainer).toBe(document.body);
});
