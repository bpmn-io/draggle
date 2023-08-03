/**
 * Initializes the draggle options.
 *
 * @param {Object} options - User defined options.
 * @param {Array} initialContainers - Initial containers for draggle.
 * @returns {Object} - The initialized options.
 */
const initializeOptions = (options, initialContainers) => ({
  containers: initialContainers,
  moves: () => true,
  accepts: () => true,
  invalid: () => false,
  isContainer: () => false,
  transformOffset: (offset) => offset,
  copy: false,
  copySortSource: false,
  revertOnSpill: false,
  removeOnSpill: false,
  direction: 'vertical',
  ignoreInputTextSelection: true,
  mirrorContainer: document.body,
  ...options
});

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

/**
 * Calculates the offset of an element relative to the page.
 *
 * @param {Element} element - The element to be measured.
 * @returns {Object} - The offset { top, left }.
 */
const calculateOffset = (element) => {
  const rect = element.getBoundingClientRect();
  return {
    left: rect.left + getScrollValue('scrollLeft', 'pageXOffset'),
    top: rect.top + getScrollValue('scrollTop', 'pageYOffset')
  };
};

/**
 * Retrieves scroll value from window or body.
 *
 * @param {string} scrollProp - The scroll property.
 * @param {string} offsetProp - The offset property.
 * @returns {number} - The scroll value.
 */
const getScrollValue = (scrollProp, offsetProp) => {
  if (typeof global[offsetProp] !== 'undefined') {
    return global[offsetProp];
  }
  if (document.documentElement.clientHeight) {
    return document.documentElement[scrollProp];
  }
  return document.body[scrollProp];
};

/**
 * Returns the element behind a point.
 *
 * @param {HTMLElement} point - The element from where to start the search.
 * @param {number} x - The x-coordinate in the document.
 * @param {number} y - The y-coordinate in the document.
 * @returns {HTMLElement} - The element found at the specified point.
 */
const getElementBehindPoint = (point = {}, x, y) => {
  const originalClassName = point.className || '';
  point.className += ' gu-hide';
  const elementAtPoint = document.elementFromPoint(x, y);
  point.className = originalClassName;
  return elementAtPoint;
};

const getRectWidth = rect => rect.width || (rect.right - rect.left);
const getRectHeight = rect => rect.height || (rect.bottom - rect.top);
const getParent = element => element.parentNode === document ? null : element.parentNode;
const isInputField = element => [ 'INPUT', 'TEXTAREA', 'SELECT' ].includes(element.tagName) || isEditable(element);
const isEditable = (element) => {
  if (!element) return false;
  if (element.contentEditable === 'false') return false;
  if (element.contentEditable === 'true') return true;
  return isEditable(getParent(element));
};

/**
 * Returns the next sibling element of an element.
 *
 * @param {HTMLElement} element - The element to get the next sibling from.
 * @returns {HTMLElement} - The next sibling element.
 */
const getNextElement = (element) => {
  const getNextSiblingElement = () => {
    let sibling = element;
    do {
      sibling = sibling.nextSibling;
    } while (sibling && sibling.nodeType !== 1);
    return sibling;
  };
  return element.nextElementSibling || getNextSiblingElement();
};

export {
  initializeOptions,
  getElementBehindPoint,
  calculateOffset,
  getRectHeight,
  getRectWidth,
  getParent,
  isInputField,
  isEditable,
  getNextElement,
  whichMouseButton
};