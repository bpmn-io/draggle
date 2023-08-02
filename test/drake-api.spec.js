import draggle from '../dist/draggle';

import { test, expect } from 'vitest';

test('drake can be instantiated without throwing', () => {
  function drakeFactory() {
    return draggle();
  }
  expect(drakeFactory).not.toThrow('calling draggle() without arguments does not throw');
});

test('drake has expected api properties', () => {
  const drake = draggle();
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
