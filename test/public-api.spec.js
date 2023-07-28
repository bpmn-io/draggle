import dragula from '../dist/dragula';

import { test, expect } from 'vitest';

test('public api matches expectation', () => {
  expect(typeof dragula).toBe('function');
});
