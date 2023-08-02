import draggle from '..';

import { test, describe, expect, vi } from 'vitest';

describe('cancel', () => {
  test('does not throw when not dragging - a single time', () => {
    const drake = draggle();
    expect(() => {
      drake.cancel();
    }).not.toThrow();
  });

  test('does not throw when not dragging - multiple times', () => {
    const drake = draggle();
    expect(() => {
      drake.cancel();
      drake.cancel();
      drake.cancel();
      drake.cancel();
    }).not.toThrow();
  });
});

describe('when dragging and cancel gets called, nothing happens', () => {
  test('nothing happens', () => {
    const div = document.createElement('div');
    const item = document.createElement('div');
    const drake = draggle([ div ]);
    div.appendChild(item);
    document.body.appendChild(div);
    drake.start(item);
    drake.cancel();
    expect(div.children.length).toBe(1);
    expect(drake.dragging).toBe(false);
  });
});

describe('when dragging and cancel gets called, cancel event is emitted', () => {
  test('cancel event is emitted', () => {
    const div = document.createElement('div');
    const item = document.createElement('div');
    const drake = draggle([ div ]);
    div.appendChild(item);
    document.body.appendChild(div);
    drake.start(item);

    const cancelMock = vi.fn((target, container) => {
      expect(target).toBe(item);
      expect(container).toBe(div);
    });

    drake.on('cancel', cancelMock);
    drake.on('dragend', () => {
      expect(cancelMock).toHaveBeenCalled();
    });

    drake.cancel();
  });
});

describe('when dragging a copy and cancel gets called, default does not revert', () => {
  test('default does not revert', () => {
    const div = document.createElement('div');
    const div2 = document.createElement('div');
    const item = document.createElement('div');
    const drake = draggle([ div, div2 ]);
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
    drake.on('dragend', () => {
      expect(dropMock).toHaveBeenCalled();
    });

    drake.cancel();
  });
});

describe('when dragging a copy and cancel gets called, revert is executed', () => {
  test('revert is executed', () => {
    const div = document.createElement('div');
    const div2 = document.createElement('div');
    const item = document.createElement('div');
    const drake = draggle([ div, div2 ]);
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
    drake.on('dragend', () => {
      expect(cancelMock).toHaveBeenCalled();
    });

    drake.cancel(true);
  });
});
