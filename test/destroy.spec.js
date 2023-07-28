import dragula from '..';

import { test, expect, vi } from 'vitest';

test('destroy does not throw when not dragging, destroyed, or whatever', () => {
  test('a single time', () => {
    const drake = dragula();
    expect(() => {
      drake.destroy();
    }).not.toThrow();
  });

  test('multiple times', () => {
    const drake = dragula();
    expect(() => {
      drake.destroy();
      drake.destroy();
      drake.destroy();
      drake.destroy();
    }).not.toThrow();
  });
});

test('when dragging and destroy gets called, nothing happens', () => {
  const div = document.createElement('div');
  const item = document.createElement('div');
  const drake = dragula([ div ]);
  div.appendChild(item);
  document.body.appendChild(div);
  drake.start(item);
  drake.destroy();
  expect(div.children.length).toBe(1);
  expect(drake.dragging).toBe(false);
});

test('when dragging and destroy gets called, dragend event is emitted gracefully', () => {
  const div = document.createElement('div');
  const item = document.createElement('div');
  const drake = dragula([ div ]);
  div.appendChild(item);
  document.body.appendChild(div);
  drake.start(item);

  const dragendMock = vi.fn(() => {
    expect(dragendMock).toHaveBeenCalled();
  });

  drake.on('dragend', dragendMock);
  drake.destroy();
});

test('when dragging a copy and destroy gets called, default does not revert', () => {
  const div = document.createElement('div');
  const div2 = document.createElement('div');
  const item = document.createElement('div');
  const drake = dragula([ div, div2 ]);
  div.appendChild(item);
  document.body.appendChild(div);
  document.body.appendChild(div2);
  drake.start(item);
  div2.appendChild(item);

  const dropMock = vi.fn((target, parent, source) => {
    expect(target).toBe(item);
    expect(parent).toBe(div2);
    expect(source).toBe(div);
  });

  drake.on('drop', dropMock);
  drake.destroy();
});

test('when dragging a copy and destroy gets called, revert is executed', () => {
  const div = document.createElement('div');
  const div2 = document.createElement('div');
  const item = document.createElement('div');
  const drake = dragula([ div, div2 ], { revertOnSpill: true });
  div.appendChild(item);
  document.body.appendChild(div);
  document.body.appendChild(div2);
  drake.start(item);
  div2.appendChild(item);

  const cancelMock = vi.fn((target, container) => {
    expect(target).toBe(item);
    expect(container).toBe(div);
  });

  drake.on('cancel', cancelMock);
  drake.destroy();
});
