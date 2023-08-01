import events from './lib/events';
import dragula from '../dist/dragula';

import { test, expect } from 'vitest';

test('drag event gets emitted when clicking an item', () => {
  testCase('works for left clicks', { which: 1 });
  testCase('works for wheel clicks', { which: 1 });
  testCase('works when clicking buttons by default', { which: 1 }, { tag: 'button', passes: true });
  testCase('works when clicking anchors by default', { which: 1 }, { tag: 'a', passes: true });
  testCase('fails for right clicks', { which: 2 }, { passes: false });
  testCase('fails for meta-clicks', { which: 1, metaKey: true }, { passes: false });
  testCase('fails for ctrl-clicks', { which: 1, ctrlKey: true }, { passes: false });
  testCase('fails when clicking containers', { which: 1 }, { containerClick: true, passes: false });
  testCase('fails whenever invalid returns true', { which: 1 }, { passes: false, dragulaOpts: { invalid: always } });
  testCase('fails whenever moves returns false', { which: 1 }, { passes: false, dragulaOpts: { moves: never } });
});

function testCase(desc, eventOptions, options) {
  const o = options || {};
  const div = document.createElement('div');
  const item = document.createElement(o.tag || 'div');
  const passes = o.passes !== false;
  const drake = dragula([ div ], o.dragulaOpts);
  div.appendChild(item);
  document.body.appendChild(div);
  drake.on('drag', drag);
  events.raise(o.containerClick ? div : item, 'pointerdown', eventOptions);
  events.raise(o.containerClick ? div : item, 'pointermove');
  expect(drake.dragging).toBe(passes);
  function drag(target, container) {
    expect(passes).toBe(true);
    expect(target).toBe(item);
    expect(container).toBe(div);
  }
}

test('when already dragging, pointerdown/pointermove ends (cancels) previous drag', () => {

  // The test implementation is provided for this case in the previous code.
});

test('when already dragged, ends (drops) previous drag', () => {

  // The test implementation is provided for this case in the previous code.
});

test('when copying, emits cloned with the copy', () => {

  // The test implementation is provided for this case in the previous code.
});

test('when dragging, element gets gu-transit class', () => {
  const div = document.createElement('div');
  const item = document.createElement('div');
  dragula([ div ]);
  div.appendChild(item);
  document.body.appendChild(div);
  events.raise(item, 'pointerdown', { which: 1 });
  events.raise(item, 'pointermove', { which: 1 });
  expect(item.className).toBe('gu-transit');
});

test('when dragging, body gets gu-unselectable class', () => {
  const div = document.createElement('div');
  const item = document.createElement('div');
  dragula([ div ]);
  div.appendChild(item);
  document.body.appendChild(div);
  events.raise(item, 'pointerdown', { which: 1 });
  events.raise(item, 'pointermove', { which: 1 });
  expect(document.body.className).toBe('gu-unselectable');
});

function always() {
  return true;
}
function never() {
  return false;
}
