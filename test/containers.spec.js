import dragula from '../dist/dragula';

import { test, expect } from 'vitest';

test('drake defaults to no containers', () => {
  const drake = dragula();
  expect(Array.isArray(drake.containers)).toBe(true);
  expect(drake.containers.length).toBe(0);
});

test('drake reads containers from array argument', () => {
  const el = document.createElement('div');
  const containers = [ el ];
  const drake = dragula(containers);
  expect(drake.containers).toBe(containers);
  expect(drake.containers.length).toBe(1);
});

test('drake reads containers from array in options', () => {
  const el = document.createElement('div');
  const containers = [ el ];
  const drake = dragula({ containers: containers });
  expect(drake.containers).toBe(containers);
  expect(drake.containers.length).toBe(1);
});

test('containers in options take precedent', () => {
  const el = document.createElement('div');
  const containers = [ el ];
  const drake = dragula([], { containers: containers });
  expect(drake.containers).toBe(containers);
  expect(drake.containers.length).toBe(1);
});
