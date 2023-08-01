const doc = document;
const docElement = doc.documentElement;

function initOptions(options, initialContainers) {
  return {
    moves: () => true,
    accepts: () => true,
    invalid: () => false,
    containers: initialContainers,
    isContainer: () => false,
    copy: false,
    copySortSource: false,
    revertOnSpill: false,
    removeOnSpill: false,
    direction: 'vertical',
    ignoreInputTextSelection: true,
    mirrorContainer: doc.body,
    ...options
  };
}

function whichMouseButton(e) {
  if (e.touches !== void 0) { return e.touches.length; }
  if (e.which !== void 0 && e.which !== 0) { return e.which; } // see https://github.com/bevacqua/dragula/issues/261
  if (e.buttons !== void 0) { return e.buttons; }
  const button = e.button;
  if (button !== void 0) { // see https://github.com/jquery/jquery/blob/99e8ff1baa7ae341e94bb89c3e84570c7c3ad9ea/src/event.js#L573-L575

    // eslint-disable-next-line no-bitwise
    return button & 1 ? 1 : button & 2 ? 3 : (button & 4 ? 2 : 0);
  }
}

function getOffset(el) {
  const rect = el.getBoundingClientRect();
  return {
    left: rect.left + getScroll('scrollLeft', 'pageXOffset'),
    top: rect.top + getScroll('scrollTop', 'pageYOffset')
  };
}

function getScroll(scrollProp, offsetProp) {
  if (typeof global[offsetProp] !== 'undefined') {
    return global[offsetProp];
  }
  if (docElement.clientHeight) {
    return docElement[scrollProp];
  }
  return doc.body[scrollProp];
}

function getElementBehindPoint(point, x, y) {
  point = point || {};
  const state = point.className || '';
  let el;
  point.className += ' gu-hide';
  el = doc.elementFromPoint(x, y);
  point.className = state;
  return el;
}

function getRectWidth(rect) { return rect.width || (rect.right - rect.left); }
function getRectHeight(rect) { return rect.height || (rect.bottom - rect.top); }
function getParent(el) { return el.parentNode === doc ? null : el.parentNode; }
function isInput(el) { return el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.tagName === 'SELECT' || isEditable(el); }
function isEditable(el) {
  if (!el) { return false; } // no parents were editable
  if (el.contentEditable === 'false') { return false; } // stop the lookup
  if (el.contentEditable === 'true') { return true; } // found a contentEditable element in the chain
  return isEditable(getParent(el)); // contentEditable is set to 'inherit'
}

function nextEl(el) {
  return el.nextElementSibling || manually();
  function manually() {
    let sibling = el;
    do {
      sibling = sibling.nextSibling;
    } while (sibling && sibling.nodeType !== 1);
    return sibling;
  }
}

export { initOptions, getElementBehindPoint, getOffset, getRectHeight, getRectWidth, getParent, isInput, isEditable, nextEl, whichMouseButton };