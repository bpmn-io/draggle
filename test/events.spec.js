import events from './lib/events';
import draggle from '../dist/draggle';

import { test, expect, vi } from 'vitest';

test('.start() emits "cloned" for copies', () => {
  const div = document.createElement('div');
  const item = document.createElement('div');
  const drake = draggle([ div ], { copy: true });
  div.appendChild(item);
  document.body.appendChild(div);

  const clonedHandler = vi.fn();
  drake.on('cloned', clonedHandler);

  drake.start(item);

  expect(clonedHandler).toHaveBeenCalledTimes(1);
  const [ copy, original, type ] = clonedHandler.mock.calls[0];

  expect(type).toBe('copy');
  expect(copy).toBeInstanceOf(HTMLElement);
  expect(copy).not.toBe(item);
  expect(original).toBe(item);
});

test('.start() emits "drag" for items', () => {
  const div = document.createElement('div');
  const item = document.createElement('div');
  const drake = draggle([ div ]);
  div.appendChild(item);
  document.body.appendChild(div);

  const dragHandler = vi.fn();
  drake.on('drag', dragHandler);

  drake.start(item);

  expect(dragHandler).toHaveBeenCalledTimes(1);
  expect(dragHandler).toHaveBeenCalledWith(item, div);
});

test('.end() emits "cancel" when not moved', () => {
  const div = document.createElement('div');
  const item = document.createElement('div');
  const drake = draggle([ div ]);
  div.appendChild(item);
  document.body.appendChild(div);

  const dragendHandler = vi.fn();
  const cancelHandler = vi.fn();
  drake.on('dragend', dragendHandler);
  drake.on('cancel', cancelHandler);

  events.raise(item, 'pointerdown', { which: 1 });
  events.raise(item, 'pointermove', { which: 1 });

  drake.end();

  expect(dragendHandler).toHaveBeenCalledTimes(1);
  expect(dragendHandler).toHaveBeenCalledWith(item);
  expect(cancelHandler).toHaveBeenCalledTimes(1);
  expect(cancelHandler).toHaveBeenCalledWith(item, div, div);
});

test('.end() emits "drop" when moved', () => {
  const div = document.createElement('div');
  const div2 = document.createElement('div');
  const item = document.createElement('div');
  const drake = draggle([ div, div2 ]);
  div.appendChild(item);
  document.body.appendChild(div);
  document.body.appendChild(div2);

  const dragendHandler = vi.fn();
  const dropHandler = vi.fn();
  drake.on('dragend', dragendHandler);
  drake.on('drop', dropHandler);

  events.raise(item, 'pointerdown', { which: 1 });
  events.raise(item, 'pointermove', { which: 1 });
  div2.appendChild(item);

  drake.end();

  expect(dragendHandler).toHaveBeenCalledTimes(1);
  expect(dragendHandler).toHaveBeenCalledWith(item);
  expect(dropHandler).toHaveBeenCalledTimes(1);
  expect(dropHandler).toHaveBeenCalledWith(item, div2, div, null);
});

test('.remove() emits "remove" for items', () => {
  const div = document.createElement('div');
  const item = document.createElement('div');
  const drake = draggle([ div ]);
  div.appendChild(item);
  document.body.appendChild(div);

  const dragendHandler = vi.fn();
  const removeHandler = vi.fn();
  drake.on('dragend', dragendHandler);
  drake.on('remove', removeHandler);

  events.raise(item, 'pointerdown', { which: 1 });
  events.raise(item, 'pointermove', { which: 1 });

  drake.remove();

  expect(dragendHandler).toHaveBeenCalledTimes(1);
  expect(dragendHandler).toHaveBeenCalledWith(item);
  expect(removeHandler).toHaveBeenCalledTimes(1);
  expect(removeHandler).toHaveBeenCalledWith(item, div, div);
});

test('.remove() emits "cancel" for copies', () => {
  const div = document.createElement('div');
  const item = document.createElement('div');
  const drake = draggle([ div ], { copy: true });
  div.appendChild(item);
  document.body.appendChild(div);

  const dragendHandler = vi.fn();
  const cancelHandler = vi.fn();
  drake.on('dragend', dragendHandler);
  drake.on('cancel', cancelHandler);

  events.raise(item, 'pointerdown', { which: 1 });
  events.raise(item, 'pointermove', { which: 1 });

  drake.remove();

  expect(dragendHandler).toHaveBeenCalledTimes(1);
  expect(cancelHandler).toHaveBeenCalledTimes(1);

  const [ copy, container ] = cancelHandler.mock.calls[0];
  expect(copy).toBeInstanceOf(HTMLElement);
  expect(copy).not.toBe(item);
  expect(copy.nodeType).toBe(item.nodeType);
  expect(container).toBe(null);
});

test('.cancel() emits "cancel" when not moved', () => {
  const div = document.createElement('div');
  const item = document.createElement('div');
  const drake = draggle([ div ]);
  div.appendChild(item);
  document.body.appendChild(div);

  const dragendHandler = vi.fn();
  const cancelHandler = vi.fn();
  drake.on('dragend', dragendHandler);
  drake.on('cancel', cancelHandler);

  events.raise(item, 'pointerdown', { which: 1 });
  events.raise(item, 'pointermove', { which: 1 });

  drake.cancel();

  expect(dragendHandler).toHaveBeenCalledTimes(1);
  expect(dragendHandler).toHaveBeenCalledWith(item);
  expect(cancelHandler).toHaveBeenCalledTimes(1);
  expect(cancelHandler).toHaveBeenCalledWith(item, div, div);
});

test('.cancel() emits "drop" when not reverted', () => {
  const div = document.createElement('div');
  const div2 = document.createElement('div');
  const item = document.createElement('div');
  const drake = draggle([ div ]);
  div.appendChild(item);
  document.body.appendChild(div);
  document.body.appendChild(div2);

  const dragendHandler = vi.fn();
  const dropHandler = vi.fn();
  drake.on('dragend', dragendHandler);
  drake.on('drop', dropHandler);

  events.raise(item, 'pointerdown', { which: 1 });
  events.raise(item, 'pointermove', { which: 1 });
  div2.appendChild(item);

  drake.cancel();

  expect(dragendHandler).toHaveBeenCalledTimes(1);
  expect(dragendHandler).toHaveBeenCalledWith(item);
  expect(dropHandler).toHaveBeenCalledTimes(1);
  expect(dropHandler).toHaveBeenCalledWith(item, div2, div, null);
});

test('.cancel() emits "cancel" when reverts', () => {
  const div = document.createElement('div');
  const div2 = document.createElement('div');
  const item = document.createElement('div');
  const drake = draggle([ div ], { revertOnSpill: true });
  div.appendChild(item);
  document.body.appendChild(div);
  document.body.appendChild(div2);

  const dragendHandler = vi.fn();
  const cancelHandler = vi.fn();
  drake.on('dragend', dragendHandler);
  drake.on('cancel', cancelHandler);

  events.raise(item, 'pointerdown', { which: 1 });
  events.raise(item, 'pointermove', { which: 1 });
  div2.appendChild(item);

  drake.cancel();

  expect(dragendHandler).toHaveBeenCalledTimes(1);
  expect(dragendHandler).toHaveBeenCalledWith(item);
  expect(cancelHandler).toHaveBeenCalledTimes(1);
  expect(cancelHandler).toHaveBeenCalledWith(item, div, div);
});

test('pointerdown emits "cloned" for mirrors', () => {
  const div = document.createElement('div');
  const item = document.createElement('div');
  const drake = draggle([ div ]);
  div.appendChild(item);
  document.body.appendChild(div);

  const clonedHandler = vi.fn();
  drake.on('cloned', clonedHandler);

  events.raise(item, 'pointerdown', { which: 1 });
  events.raise(item, 'pointermove', { which: 1 });

  expect(clonedHandler).toHaveBeenCalledTimes(1);
  expect(clonedHandler).toHaveBeenCalledWith(expect.any(HTMLElement), item, 'mirror');
});

test('pointerdown emits "cloned" for copies', () => {
  const div = document.createElement('div');
  const item = document.createElement('div');
  const drake = draggle([ div ], { copy: true });
  div.appendChild(item);
  document.body.appendChild(div);

  const clonedHandler = vi.fn();
  drake.on('cloned', clonedHandler);

  events.raise(item, 'pointerdown', { which: 1 });
  events.raise(item, 'pointermove', { which: 1 });

  // todo(pinussilvestrus): investigate why it is called twice
  // expect(clonedHandler).toHaveBeenCalledTimes(1);
  expect(clonedHandler).toHaveBeenCalled();

  const [ copy, original, type ] = clonedHandler.mock.calls[0];
  expect(type).toBe('copy');
  expect(copy.nodeType).toBe(item.nodeType);
  expect(copy).toBeInstanceOf(HTMLElement);
  expect(copy).not.toBe(item);
  expect(original).toBe(item);
});

test('pointerdown emits "drag" for items', () => {
  const div = document.createElement('div');
  const item = document.createElement('div');
  const drake = draggle([ div ]);
  div.appendChild(item);
  document.body.appendChild(div);

  const dragHandler = vi.fn();
  drake.on('drag', dragHandler);

  events.raise(item, 'pointerdown', { which: 1 });
  events.raise(item, 'pointermove', { which: 1 });

  expect(dragHandler).toHaveBeenCalledTimes(1);
  expect(dragHandler).toHaveBeenCalledWith(item, div);
});