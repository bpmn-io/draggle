import draggle from '../dist/draggle';

import { test, expect } from 'vitest';

test('end does not throw when not dragging', () => {
  test('a single time', () => {
    const drake = draggle();
    expect(() => drake.end()).not.toThrow();
  });

  test('multiple times', () => {
    const drake = draggle();
    expect(() => {
      drake.end();
      drake.end();
      drake.end();
      drake.end();
    }).not.toThrow();
  });
});

test('when already dragging, .end() ends (cancels) previous drag', () => {
  const div = document.createElement('div');
  const item1 = document.createElement('div');
  const item2 = document.createElement('div');
  const drake = draggle([ div ]);
  div.appendChild(item1);
  div.appendChild(item2);
  document.body.appendChild(div);
  drake.start(item1);
  drake.on('dragend', (item) => {
    expect(item).toBe(item1);
  });
  drake.on('cancel', (item, source) => {
    expect(item).toBe(item1);
    expect(source).toBe(div);
  });
  drake.end();
  expect(drake.dragging).toBe(false);
});

test('when already dragged, ends (drops) previous drag', () => {
  const div = document.createElement('div');
  const div2 = document.createElement('div');
  const item1 = document.createElement('div');
  const item2 = document.createElement('div');
  const drake = draggle([ div, div2 ]);
  div.appendChild(item1);
  div.appendChild(item2);
  document.body.appendChild(div);
  document.body.appendChild(div2);
  drake.start(item1);
  div2.appendChild(item1);
  drake.on('dragend', (item) => {
    expect(item).toBe(item1);
  });
  drake.on('drop', (item, target, source) => {
    expect(item).toBe(item1);
    expect(source).toBe(div);
    expect(target).toBe(div2);
  });
  drake.end();
  expect(drake.dragging).toBe(false);
});
