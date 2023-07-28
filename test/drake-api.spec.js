import dragula from '../dist/dragula';

import { test, expect } from 'vitest';

test('drake can be instantiated without throwing', () => {
  function drakeFactory() {
    return dragula();
  }
  expect(drakeFactory).not.toThrow('calling dragula() without arguments does not throw');
});

test('drake has expected api properties', () => {
  const drake = dragula();
  expect(drake).not.toBeNull();
  expect(typeof drake).toBe('object');
  expect(Array.isArray(drake.containers)).toBe(true);
  expect(typeof drake.start).toBe('function');
  expect(typeof drake.end).toBe('function');
  expect(typeof drake.cancel).toBe('function');
  expect(typeof drake.remove).toBe('function');
  expect(typeof drake.destroy).toBe('function');
  expect(typeof drake.dragging).toBe('boolean');
  expect(drake.dragging).toBe(false);
});
