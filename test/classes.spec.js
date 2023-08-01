import { add, rm } from '../src/classes';

import { test, expect } from 'vitest';

test('classes exports the expected api', () => {
  expect(typeof add).toBe('function');
  expect(typeof rm).toBe('function');
});

test('classes can add a class', () => {
  const el = document.createElement('div');
  add(el, 'gu-foo');
  expect(el.className).toBe('gu-foo');
});

test('classes can add a class to an element that already has classes', () => {
  const el = document.createElement('div');
  el.className = 'bar';
  add(el, 'gu-foo');
  expect(el.className).toBe('bar gu-foo');
});

test('add is a no-op if class already is in element', () => {
  const el = document.createElement('div');
  el.className = 'gu-foo';
  add(el, 'gu-foo');
  expect(el.className).toBe('gu-foo');
});

test('classes can remove a class', () => {
  const el = document.createElement('div');
  el.className = 'gu-foo';
  rm(el, 'gu-foo');
  expect(el.className).toBe('');
});

test('classes can remove a class from a list on the right', () => {
  const el = document.createElement('div');
  el.className = 'bar gu-foo';
  rm(el, 'gu-foo');
  expect(el.className).toBe('bar');
});

test('classes can remove a class from a list on the left', () => {
  const el = document.createElement('div');
  el.className = 'gu-foo bar';
  rm(el, 'gu-foo');
  expect(el.className).toBe('bar');
});

test('classes can remove a class from a list on the middle', () => {
  const el = document.createElement('div');
  el.className = 'foo gu-foo bar';
  rm(el, 'gu-foo');
  expect(el.className).toBe('foo bar');
});
