import draggle from '../dist/draggle';

import { test, expect } from 'vitest';

test('public api matches expectation', () => {
  expect(typeof draggle).toBe('function');
});
