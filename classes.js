var cache = {};
var start = '(?:^|\\s)';
var end = '(?:\\s|$)';

export function lookupClass(className) {
  var cached = cache[className];
  if (cached) {
    cached.lastIndex = 0;
  } else {
    cache[className] = cached = new RegExp(start + className + end, 'g');
  }
  return cached;
}

export function addClass(el, className) {
  var current = el.className;
  if (!current.length) {
    el.className = className;
  } else if (!lookupClass(className).test(current)) {
    el.className += ' ' + className;
  }
}

export function rmClass(el, className) {
  el.className = el.className.replace(lookupClass(className), ' ').trim();
}

export default {
  add: addClass,
  rm: rmClass
};
