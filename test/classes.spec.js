import classes from '../classes';

import { test, expect } from 'vitest';

test('classes exports the expected api', () => {
  expect(typeof classes.add).toBe('function');
  expect(typeof classes.rm).toBe('function');
});

test('classes can add a class', () => {
  const el = document.createElement('div');
  classes.add(el, 'gu-foo');
  expect(el.className).toBe('gu-foo');
});

test('classes can add a class to an element that already has classes', () => {
  const el = document.createElement('div');
  el.className = 'bar';
  classes.add(el, 'gu-foo');
  expect(el.className).toBe('bar gu-foo');
});

test('classes.add is a no-op if class already is in element', () => {
  const el = document.createElement('div');
  el.className = 'gu-foo';
  classes.add(el, 'gu-foo');
  expect(el.className).toBe('gu-foo');
});

test('classes can remove a class', () => {
  const el = document.createElement('div');
  el.className = 'gu-foo';
  classes.rm(el, 'gu-foo');
  expect(el.className).toBe('');
});

test('classes can remove a class from a list on the right', () => {
  const el = document.createElement('div');
  el.className = 'bar gu-foo';
  classes.rm(el, 'gu-foo');
  expect(el.className).toBe('bar');
});

test('classes can remove a class from a list on the left', () => {
  const el = document.createElement('div');
  el.className = 'gu-foo bar';
  classes.rm(el, 'gu-foo');
  expect(el.className).toBe('bar');
});

test('classes can remove a class from a list on the middle', () => {
  const el = document.createElement('div');
  el.className = 'foo gu-foo bar';
  classes.rm(el, 'gu-foo');
  expect(el.className).toBe('foo bar');
});
