import events from './lib/events';
import dragula from '../dist/dragula';

import { test, expect, vi } from 'vitest';


test('remove does not throw when not dragging', () => {
  test('a single time', () => {
    const drake = dragula();
    expect(() => {
      drake.remove();
    }).not.toThrow('dragula ignores a single call to drake.remove');
  });

  test('multiple times', () => {
    const drake = dragula();
    expect(() => {
      drake.remove();
      drake.remove();
      drake.remove();
      drake.remove();
    }).not.toThrow('dragula ignores multiple calls to drake.remove');
  });
});

test('when dragging and remove gets called, element is removed', () => {
  const div = document.createElement('div');
  const item = document.createElement('div');
  const drake = dragula([ div ]);
  div.appendChild(item);
  document.body.appendChild(div);
  drake.start(item);
  drake.remove();
  expect(div.children.length).toBe(0);
  expect(drake.dragging).toBe(false);
});

test('when dragging and remove gets called, remove event is emitted', () => {
  const div = document.createElement('div');
  const item = document.createElement('div');
  const drake = dragula([ div ]);
  div.appendChild(item);
  document.body.appendChild(div);
  drake.start(item);

  const removeHandler = vi.fn();
  const dragendHandler = vi.fn();
  drake.on('remove', removeHandler);
  drake.on('dragend', dragendHandler);

  drake.remove();

  expect(dragendHandler).toHaveBeenCalledTimes(1);
  expect(removeHandler).toHaveBeenCalledTimes(1);
  expect(removeHandler).toHaveBeenCalledWith(item, div, div);
});

test('when dragging a copy and remove gets called, cancel event is emitted', () => {
  const div = document.createElement('div');
  const item = document.createElement('div');
  const drake = dragula([ div ], { copy: true });
  div.appendChild(item);
  document.body.appendChild(div);

  events.raise(item, 'pointerdown', { which: 1 });
  events.raise(item, 'pointermove', { which: 1 });

  const cancelHandler = vi.fn();
  const dragendHandler = vi.fn();
  drake.on('cancel', cancelHandler);
  drake.on('dragend', dragendHandler);

  drake.remove();

  expect(dragendHandler).toHaveBeenCalledTimes(1);
  expect(cancelHandler).toHaveBeenCalledTimes(1);

  const removeItem = cancelHandler.mock.calls[0][0];
  expect(removeItem).not.toBe(item);
  expect(cancelHandler).toHaveBeenCalledWith(removeItem, null, div);
});
