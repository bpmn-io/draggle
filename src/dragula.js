import emitter from 'contra/emitter';
import { add, rm } from './classes';
import {
  initializeOptions,
  getElementBehindPoint,
  calculateOffset,
  getRectHeight,
  getRectWidth,
  getParent,
  isInputField,
  getNextElement,
  whichMouseButton
} from './util';

window.global ||= window;

const doc = document;
const docElement = doc.documentElement;

/**
 * Setup dragula.
 *
 * @param {Array} initialContainers - The initial set of containers
 * @param {Object} options - Configuration options
 */
function dragula(initialContainers = [], options = {}) {

  // if only options is provided
  if (!Array.isArray(initialContainers)) {
    options = initialContainers;
    initialContainers = [];
  }

  let _mirror, _source, _item, _offsetX, _offsetY, _moveX, _moveY, _initialSibling,
      _currentSibling, _copy, _renderTimer, _lastDropTarget, _grabbed;

  const o = initializeOptions(options, initialContainers);

  const drake = emitter({
    containers: o.containers,
    start: manualStart,
    end,
    cancel,
    remove,
    destroy,
    canMove,
    dragging: false
  });

  if (o.removeOnSpill) {
    drake.on('over', spillOver).on('out', spillOut);
  }

  events();

  return drake;

  function isContainer(el) {
    return drake.containers.indexOf(el) !== -1 || o.isContainer(el);
  }

  function events(cancel) {
    const op = cancel ? 'removeEventListener' : 'addEventListener';
    docElement[op]('pointerdown', grab, true);
    docElement[op]('pointerup', release, true);
  }

  function eventualMovements(cancel) {
    docElement[cancel ? 'removeEventListener' : 'addEventListener']('pointermove', startBecauseMouseMoved, true);
  }

  function movements(cancel) {
    docElement[cancel ? 'removeEventListener' : 'addEventListener']('click', preventGrabbed, true);
  }

  function destroy() {
    events(true);
    release({});
  }

  function preventGrabbed(e) {
    if (_grabbed) {
      e.preventDefault();
    }
  }

  function grab(e) {
    _moveX = e.clientX;
    _moveY = e.clientY;

    const isNotSimpleMouseClick = whichMouseButton(e) !== 1 || e.metaKey || e.ctrlKey;
    if (isNotSimpleMouseClick) {
      return; // we only care about honest-to-god left clicks and touch events
    }
    const item = e.target;
    const context = canStart(item);
    if (!context) {
      return;
    }
    _grabbed = context;
    eventualMovements();
    if (e.type === 'pointerdown') {
      if (isInputField(item)) { // see also: https://github.com/bevacqua/dragula/issues/208
        item.focus(); // fixes https://github.com/bevacqua/dragula/issues/176
      } else {
        e.preventDefault(); // fixes https://github.com/bevacqua/dragula/issues/155
      }
    }
  }

  function startBecauseMouseMoved(e) {
    if (!_grabbed) {
      return;
    }
    if (whichMouseButton(e) === 0) {
      release({});
      return; // when text is selected on an input and then dragged, mouseup doesn't fire. this is our only hope
    }

    // truthy check fixes #239, equality fixes #207, fixes #501
    if ((e.clientX !== void 0 && Math.abs(e.clientX - _moveX) <= (o.slideFactorX || 0)) &&
      (e.clientY !== void 0 && Math.abs(e.clientY - _moveY) <= (o.slideFactorY || 0))) {
      return;
    }

    if (o.ignoreInputTextSelection) {
      const {
        clientX = 0,
        clientY = 0
      } = e;

      const elementBehindCursor = doc.elementFromPoint(clientX, clientY);
      if (isInputField(elementBehindCursor)) {
        return;
      }
    }

    const grabbed = _grabbed; // call to end() unsets _grabbed
    eventualMovements(true);
    movements();
    end();
    start(grabbed);

    const offset = calculateOffset(_item);

    const {
      pageX = 0,
      pageY = 0
    } = e;

    _offsetX = pageX - offset.left;
    _offsetY = pageY - offset.top;

    add(_copy || _item, 'gu-transit');
    renderMirrorImage();
    drag(e);
  }

  function canStart(item) {
    if (drake.dragging && _mirror) {
      return;
    }
    if (isContainer(item)) {
      return; // don't drag container itself
    }
    const handle = item;
    while (getParent(item) && isContainer(getParent(item)) === false) {
      if (o.invalid(item, handle)) {
        return;
      }
      item = getParent(item); // drag target should be a top element
      if (!item) {
        return;
      }
    }
    const source = getParent(item);
    if (!source) {
      return;
    }
    if (o.invalid(item, handle)) {
      return;
    }

    const movable = o.moves(item, source, handle, getNextElement(item));
    if (!movable) {
      return;
    }

    return {
      item: item,
      source: source
    };
  }

  function canMove(item) {
    return !!canStart(item);
  }

  function manualStart(item) {
    const context = canStart(item);
    if (context) {
      start(context);
    }
  }

  function start(context) {
    if (isCopy(context.item, context.source)) {
      _copy = context.item.cloneNode(true);
      drake.emit('cloned', _copy, context.item, 'copy');
    }

    _source = context.source;
    _item = context.item;
    _initialSibling = _currentSibling = getNextElement(context.item);

    drake.dragging = true;
    drake.emit('drag', _item, _source);
  }

  function end() {
    if (!drake.dragging) {
      return;
    }
    const item = _copy || _item;
    drop(item, getParent(item));
  }

  function ungrab() {
    _grabbed = false;
    eventualMovements(true);
    movements(true);
  }

  function release(e) {
    ungrab();

    if (!drake.dragging) {
      return;
    }
    const item = _copy || _item;
    const {
      clientX = 0,
      clientY = 0
    } = e;

    const elementBehindCursor = getElementBehindPoint(_mirror, clientX, clientY);
    const dropTarget = findDropTarget(elementBehindCursor, clientX, clientY);
    if (dropTarget && ((_copy && o.copySortSource) || (!_copy || dropTarget !== _source))) {
      drop(item, dropTarget);
    } else if (o.removeOnSpill) {
      remove();
    } else {
      cancel();
    }
  }

  function drop(item, target) {
    const parent = getParent(item);
    if (_copy && o.copySortSource && target === _source) {
      parent.removeChild(_item);
    }
    if (isInitialPlacement(target)) {
      drake.emit('cancel', item, _source, _source);
    } else {
      drake.emit('drop', item, target, _source, _currentSibling);
    }
    cleanup();
  }

  function remove() {
    if (!drake.dragging) {
      return;
    }
    const item = _copy || _item;
    const parent = getParent(item);
    if (parent) {
      parent.removeChild(item);
    }
    drake.emit(_copy ? 'cancel' : 'remove', item, parent, _source);
    cleanup();
  }

  function cancel(revert) {
    if (!drake.dragging) {
      return;
    }
    const reverts = arguments.length > 0 ? revert : o.revertOnSpill;
    const item = _copy || _item;
    const parent = getParent(item);
    const initial = isInitialPlacement(parent);
    if (initial === false && reverts) {
      if (_copy) {
        if (parent) {
          parent.removeChild(_copy);
        }
      } else {
        _source.insertBefore(item, _initialSibling);
      }
    }
    if (initial || reverts) {
      drake.emit('cancel', item, _source, _source);
    } else {
      drake.emit('drop', item, parent, _source, _currentSibling);
    }
    cleanup();
  }

  function cleanup() {
    const item = _copy || _item;
    ungrab();
    removeMirrorImage();
    if (item) {
      rm(item, 'gu-transit');
    }
    if (_renderTimer) {
      clearTimeout(_renderTimer);
    }
    drake.dragging = false;
    if (_lastDropTarget) {
      drake.emit('out', item, _lastDropTarget, _source);
    }
    drake.emit('dragend', item);
    _source = _item = _copy = _initialSibling = _currentSibling = _renderTimer = _lastDropTarget = null;
  }

  function isInitialPlacement(target, s) {
    let sibling;
    if (s !== void 0) {
      sibling = s;
    } else if (_mirror) {
      sibling = _currentSibling;
    } else {
      sibling = getNextElement(_copy || _item);
    }
    return target === _source && sibling === _initialSibling;
  }

  function findDropTarget(elementBehindCursor, clientX, clientY) {
    let target = elementBehindCursor;
    while (target && !accepted()) {
      target = getParent(target);
    }
    return target;

    function accepted() {
      const droppable = isContainer(target);
      if (droppable === false) {
        return false;
      }

      const immediate = getImmediateChild(target, elementBehindCursor);
      const reference = getReference(target, immediate, clientX, clientY);
      const initial = isInitialPlacement(target, reference);
      if (initial) {
        return true; // should always be able to drop it right back where it was
      }
      return o.accepts(_item, target, _source, reference);
    }
  }

  function drag(e) {
    if (!_mirror) {
      return;
    }
    e.preventDefault();

    const {
      clientX = 0,
      clientY = 0
    } = e;

    const x = clientX - _offsetX;
    const y = clientY - _offsetY;

    _mirror.style.left = x + 'px';
    _mirror.style.top = y + 'px';

    const item = _copy || _item;
    const elementBehindCursor = getElementBehindPoint(_mirror, clientX, clientY);
    let dropTarget = findDropTarget(elementBehindCursor, clientX, clientY);
    const changed = dropTarget !== null && dropTarget !== _lastDropTarget;
    if (changed || dropTarget === null) {
      out();
      _lastDropTarget = dropTarget;
      over();
    }
    const parent = getParent(item);
    if (dropTarget === _source && _copy && !o.copySortSource) {
      if (parent) {
        parent.removeChild(item);
      }
      return;
    }
    let reference;
    const immediate = getImmediateChild(dropTarget, elementBehindCursor);
    if (immediate !== null) {
      reference = getReference(dropTarget, immediate, clientX, clientY);
    } else if (o.revertOnSpill === true && !_copy) {
      reference = _initialSibling;
      dropTarget = _source;
    } else {
      if (_copy && parent) {
        parent.removeChild(item);
      }
      return;
    }
    if (
      (reference === null && changed) ||
      reference !== item &&
      reference !== getNextElement(item)
    ) {
      _currentSibling = reference;
      dropTarget.insertBefore(item, reference);
      drake.emit('shadow', item, dropTarget, _source);
    }
    function moved(type) { drake.emit(type, item, _lastDropTarget, _source); }
    function over() { if (changed) { moved('over'); } }
    function out() { if (_lastDropTarget) { moved('out'); } }
  }

  function spillOver(el) {
    rm(el, 'gu-hide');
  }

  function spillOut(el) {
    if (drake.dragging) { add(el, 'gu-hide'); }
  }

  function renderMirrorImage() {
    if (_mirror) {
      return;
    }
    const rect = _item.getBoundingClientRect();
    _mirror = _item.cloneNode(true);
    _mirror.style.width = getRectWidth(rect) + 'px';
    _mirror.style.height = getRectHeight(rect) + 'px';
    rm(_mirror, 'gu-transit');
    add(_mirror, 'gu-mirror');
    o.mirrorContainer.appendChild(_mirror);
    docElement.addEventListener('pointermove', drag);
    add(o.mirrorContainer, 'gu-unselectable');
    drake.emit('cloned', _mirror, _item, 'mirror');
  }

  function removeMirrorImage() {
    if (_mirror) {
      rm(o.mirrorContainer, 'gu-unselectable');
      docElement.removeEventListener('pointermove', drag);
      getParent(_mirror).removeChild(_mirror);
      _mirror = null;
    }
  }

  function getImmediateChild(dropTarget, target) {
    let immediate = target;
    while (immediate !== dropTarget && getParent(immediate) !== dropTarget) {
      immediate = getParent(immediate);
    }
    if (immediate === docElement) {
      return null;
    }
    return immediate;
  }

  function getReference(dropTarget, target, x, y) {

    // cf. https://github.com/bevacqua/dragula/pull/336
    const horizontal = (typeof o.direction === 'function' ? o.direction(_item, dropTarget, _source) : o.direction) === 'horizontal';
    const reference = target !== dropTarget ? inside() : outside();
    return reference;

    function outside() { // slower, but able to figure out any position
      const len = dropTarget.children.length;
      let i, el, rect;
      for (i = 0; i < len; i++) {
        el = dropTarget.children[i];
        rect = el.getBoundingClientRect();
        if (horizontal && (rect.left + rect.width / 2) > x) { return el; }
        if (!horizontal && (rect.top + rect.height / 2) > y) { return el; }
      }
      return null;
    }

    function inside() { // faster, but only available if dropped inside a child element
      const rect = target.getBoundingClientRect();
      if (horizontal) {
        return resolve(x > rect.left + getRectWidth(rect) / 2);
      }
      return resolve(y > rect.top + getRectHeight(rect) / 2);
    }

    function resolve(after) {
      return after ? getNextElement(target) : target;
    }
  }

  function isCopy(item, container) {
    return typeof o.copy === 'boolean' ? o.copy : o.copy(item, container);
  }
}

export default dragula;
