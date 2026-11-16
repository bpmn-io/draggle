import { afterEach, beforeEach, expect, test, vi } from 'vitest';

import events from './lib/events';
import draggle from '../dist/draggle';
import '../draggle.css';

let fixture, source, target, item, drake;

beforeEach(() => {
  vi.useFakeTimers();
  fixture = document.createElement('div');
  fixture.innerHTML = `
    <div style="position:fixed;left:0;top:0;width:200px;height:300px;overflow:auto">
      <div style="height:100px">Card <a href="#link"><span>Link</span></a>
        <button>Button</button><input value="Note"><div contenteditable="true">Editable</div>
      </div>
      <div style="height:100px">Another card</div>
    </div>
    <div style="position:fixed;left:250px;top:0;width:200px;height:300px"></div>`;
  document.body.appendChild(fixture);
  [ source, target ] = fixture.children;
  item = source.firstElementChild;
});

afterEach(() => {
  drake?.destroy();
  fixture.remove();
  vi.useRealTimers();
});

test('touch holds before pickup, tolerates jitter, then drops without a click', () => {
  drake = draggle([ source, target ]);
  const drop = vi.fn();
  drake.on('drop', drop);
  expect(pointer('pointerdown').defaultPrevented).toBe(false);
  pointer('pointermove', { clientX: 53 });
  vi.advanceTimersByTime(100);
  expect(drake.dragging).toBe(false);
  vi.advanceTimersByTime(900);
  expect(drake.dragging).toBe(true);
  pointer('pointermove', { clientX: 300 });
  expect(item.parentNode).toBe(target);
  pointer('pointerup', { clientX: 300 });
  expect(drake.dragging).toBe(false);
  expect(drop).toHaveBeenCalledOnce();
  expect(events.raise(item, 'click', { detail: 1 }).defaultPrevented).toBe(true);
});

test('movement before the hold expires leaves scrolling to the browser', () => {
  drake = draggle([ source, target ]);
  pointer('pointerdown');
  expect(pointer('pointermove', { clientY: 70 }).defaultPrevented).toBe(false);
  vi.advanceTimersByTime(1000);
  expect(drake.dragging).toBe(false);
  expect(touchMove().defaultPrevented).toBe(false);
});

test.each([ 'pointerup', 'pointercancel' ])('%s clears a pending hold', type => {
  drake = draggle([ source ]);
  pointer('pointerdown');
  pointer(type);
  vi.advanceTimersByTime(1000);
  expect(drake.dragging).toBe(false);
  expect(item.classList.contains('gu-touch-drag')).toBe(false);
});

test('pointer cancellation reverts an active drag', () => {
  drake = draggle([ source, target ]);
  const drop = vi.fn();
  drake.on('drop', drop);
  pointer('pointerdown');
  vi.advanceTimersByTime(1000);
  pointer('pointermove', { clientX: 300 });
  pointer('pointercancel');
  expect(item.parentNode).toBe(source);
  expect(drop).not.toHaveBeenCalled();
  expect(drake.dragging).toBe(false);
  expect(document.querySelector('.gu-mirror')).toBeNull();
});

test.each([ false, true ])('a second touch cancels a hold or active drag (picked up: %s)', pickedUp => {
  drake = draggle([ source, target ]);
  pointer('pointerdown');
  if (pickedUp) {
    vi.advanceTimersByTime(1000);
    pointer('pointermove', { clientX: 300 });
  }
  pointer('pointerdown', { pointerId: 2, isPrimary: false });
  expect(item.classList.contains('gu-touch-drag')).toBe(false);
  pointer('pointerdown', { pointerId: 3, isPrimary: false });
  vi.advanceTimersByTime(1000);
  expect(drake.dragging).toBe(false);
  expect(item.parentNode).toBe(source);
  expect(document.querySelector('.gu-mirror')).toBeNull();
});

test('a non-primary touch cannot start a hold', () => {
  drake = draggle([ source, target ]);
  pointer('pointerdown', {}, target);
  pointer('pointerdown', { pointerId: 2, isPrimary: false });
  expect(item.classList.contains('gu-touch-drag')).toBe(false);
  vi.advanceTimersByTime(1000);
  expect(drake.dragging).toBe(false);
});

test('touch dragging a copy does not copy touch styles', () => {
  drake = draggle([ source, target ], { copy: true });
  let copiedWithTouchClass;
  drake.on('cloned', (clone, original, type) => {
    if (type === 'copy') {
      copiedWithTouchClass = clone.classList.contains('gu-touch-drag');
    }
  });
  pointer('pointerdown');
  vi.advanceTimersByTime(1000);
  pointer('pointermove', { clientX: 300 });
  pointer('pointerup', { clientX: 300 });
  const copy = target.firstElementChild;
  expect(copy).not.toBeNull();
  expect(copy).not.toBe(item);
  expect(copiedWithTouchClass).toBe(false);
  expect(copy.classList.contains('gu-touch-drag')).toBe(false);
});

test('only an active touch drag prevents native touch movement', () => {
  drake = draggle([ source ]);
  pointer('pointerdown');
  expect(touchMove().defaultPrevented).toBe(false);
  vi.advanceTimersByTime(1000);
  expect(touchMove().defaultPrevented).toBe(true);
  pointer('pointerup');
  expect(touchMove().defaultPrevented).toBe(false);
});

test('scroll prevention is registered before a touch gesture and removed on destroy', () => {
  const root = document.documentElement;
  const addListener = vi.spyOn(root, 'addEventListener');
  const removeListener = vi.spyOn(root, 'removeEventListener');
  try {
    drake = draggle([ source ]);
    const registration = addListener.mock.calls.find(([ type ]) => type === 'touchmove');
    expect(registration).toEqual([ 'touchmove', expect.any(Function), { capture: true, passive: false } ]);
    drake.destroy();
    expect(removeListener).toHaveBeenCalledWith(...registration);
  } finally {
    addListener.mockRestore();
    removeListener.mockRestore();
  }
});

test('long press replaces native selection and menus until release', () => {
  drake = draggle([ source ]);
  pointer('pointerdown');
  expect(item.classList.contains('gu-touch-drag')).toBe(true);
  expect(events.raise(item, 'contextmenu').defaultPrevented).toBe(true);
  vi.advanceTimersByTime(1000);
  pointer('pointerup');
  expect(item.classList.contains('gu-touch-drag')).toBe(false);
  expect(events.raise(item, 'contextmenu').defaultPrevented).toBe(false);
});

test.each([ 'a span', 'button' ])('long press on %s drags the item', selector => {
  drake = draggle([ source ]);
  pointer('pointerdown', {}, item.querySelector(selector));
  vi.advanceTimersByTime(1000);
  expect(drake.dragging).toBe(true);
});

test('invalid keeps native long press behavior', () => {
  drake = draggle([ source ], { invalid: (el, handle) => handle === item });
  pointer('pointerdown');
  expect(item.classList.contains('gu-touch-drag')).toBe(false);
  expect(events.raise(item, 'contextmenu').defaultPrevented).toBe(false);
  vi.advanceTimersByTime(1000);
  expect(drake.dragging).toBe(false);
});

test.each([ true, false ])('touch dragging from an input respects ignoreInputTextSelection: %s', ignoreInputTextSelection => {
  drake = draggle([ source, target ], { ignoreInputTextSelection });
  pointer('pointerdown', {}, item.querySelector('input'));
  vi.advanceTimersByTime(1000);
  expect(drake.dragging).toBe(!ignoreInputTextSelection);
});

test('touch pickup does not suppress keyboard clicks or clicks outside the item', () => {
  drake = draggle([ source, target ]);
  pointer('pointerdown');
  vi.advanceTimersByTime(1000);
  pointer('pointerup');
  expect(events.raise(item, 'click', { detail: 0 }).defaultPrevented).toBe(false);
  expect(events.raise(target, 'click', { detail: 1 }).defaultPrevented).toBe(false);
});

test('touch pickup after programmatic start keeps the touch drag', () => {
  drake = draggle([ source ]);
  drake.start(item);
  pointer('pointerdown');
  vi.advanceTimersByTime(1000);
  expect(drake.dragging).toBe(true);
  expect(touchMove().defaultPrevented).toBe(true);
  expect(item.classList.contains('gu-touch-drag')).toBe(true);
});

test('removing the item during a hold abandons pickup', () => {
  drake = draggle([ source, target ]);
  pointer('pointerdown');
  item.remove();
  vi.advanceTimersByTime(1000);
  expect(drake.dragging).toBe(false);
  expect(item.classList.contains('gu-touch-drag')).toBe(false);
});

test('mouse dragging remains immediate', () => {
  drake = draggle([ source ]);
  pointer('pointerdown', { pointerType: 'mouse', clientY: 10 });
  pointer('pointermove', { pointerType: 'mouse', clientY: 10, clientX: 55 });
  expect(drake.dragging).toBe(true);
});

function pointer(type, options = {}, element = item) {
  const pointerOptions = {
    pointerType: 'touch',
    pointerId: 1,
    isPrimary: true,
    buttons: type === 'pointerup' || type === 'pointercancel' ? 0 : 1,
    clientX: 50,
    clientY: 50,
    ...options
  };
  return events.raise(element, type, {
    ...pointerOptions,
    pageX: pointerOptions.clientX,
    pageY: pointerOptions.clientY
  });
}

function touchMove() {
  return events.raise(item, 'touchmove', {
    touches: [ { identifier: 1, target: item, clientX: 50, clientY: 50 } ]
  });
}
