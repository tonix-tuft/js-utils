/*
 * Copyright (c) 2022 Anton Bagdatyev (Tonix)
 *
 * Permission is hereby granted, free of charge, to any person
 * obtaining a copy of this software and associated documentation
 * files (the "Software"), to deal in the Software without
 * restriction, including without limitation the rights to use,
 * copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following
 * conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
 * OTHER DEALINGS IN THE SOFTWARE.
 */

/**
 * Web application (browser) utility functions.
 */

import { config, uniqueId, isEmpty, isJSONString, isPlainObject } from "./core";

/**
 * Builds a form data instance or object recursively.
 *
 * @see https://stackoverflow.com/questions/22783108/convert-js-object-to-form-data#answer-42483509
 *
 * @param {FormData|Object} formData Form data instance or JS POJO object.
 * @param {Array|Object} data JS POJO object or array with the form data to use to build the forma data.
 * @param {boolean} [shouldEncodeURIComponent] Optionally instructs the function if the parameters should be encoded
 *                                             (keys and values) using "encodeURIComponent".
 * @param {string} [parentKey] Parent key for nested parameters (used internally for recursion).
 * @return {undefined}
 */
function buildFormData(formData, data, shouldEncodeURIComponent, parentKey) {
  if (
    data &&
    typeof data === "object" &&
    !(data instanceof Date) &&
    !(data instanceof File)
  ) {
    Object.keys(data).forEach(key => {
      buildFormData(
        formData,
        data[key],
        shouldEncodeURIComponent,
        parentKey
          ? `${parentKey}[${key}]`
          : shouldEncodeURIComponent
          ? encodeURIComponent(key)
          : key
      );
    });
  } else {
    // Leaf value.
    const value =
      data == null
        ? ""
        : shouldEncodeURIComponent
        ? encodeURIComponent(data)
        : data;
    formData instanceof FormData
      ? formData.append(parentKey, value)
      : (formData[parentKey] = value);
  }
}

/**
 * Constructs a query string from the given data.
 * This method works with nested objects/arrays.
 *
 * @param {Array|Object} data The object.
 * @return {string} The query string.
 */
export function buildQueryString(data) {
  const formData = {};
  buildFormData(formData, data, true); // "true" instructs the function to encode URI parts (keys and values).
  const parts = [];
  for (const prop in formData) {
    parts.push(prop + "=" + formData[prop]);
  }
  return parts.join("&");
}

/**
 * Converts an object (array or JS POJO object) to a form data instance.
 *
 * @param {Array|Object} data The data (array or POJO object).
 * @return {FormData} A form data instance.
 */
export function formData(data) {
  const formData = new FormData();
  buildFormData(formData, data);
  return formData;
}

/**
 * Returns a new XMLHttpRequest or ActiveXObject object.
 *
 * @return {XMLHttpRequest|ActiveXObject}
 */
export const xhr = () =>
  (window.ActiveXObject && new window.ActiveXObject("Microsoft.XMLHTTP")) ||
  new XMLHttpRequest();

/**
 * Checks whether the network is reachable or not.
 *
 * @param {string} URI An eventual URI to use for the request.
 *                     NOTE: If omitted, then "config.checkNetworkURI" will be used,
 *                           or, if "config.checkNetworkURI" is not set,
 *                           the website's hostname will be used.
 *                           Also, in every case, A GET query string with a random parameter
 *                           is always appended to the URI.
 * @return {Promise} A promise which resolves to "true" if the network is reachable and to "false" otherwise.
 *                   Note that the returned promise always resolves to "true" when this code runs on localhost.
 */
export function checkNetwork(URI = null) {
  // Handle IE and more capable browsers.
  const xhrObj = xhr();

  return new Promise(resolve => {
    // Issue request and handle response.
    try {
      xhrObj.onreadystatechange = () => {
        if (xhrObj.readyState == 4) {
          resolve(
            xhrObj.status >= 200 &&
              (xhrObj.status < 300 || xhrObj.status === 304)
          );
        }
      };

      // Open new request as a HEAD to the root hostname with a random param to bust the cache.
      xhrObj.open(
        "HEAD",
        (URI ||
          config.checkNetworkURI ||
          "//" +
            window.location.hostname +
            (window.location.port != 80 ? ":" + window.location.port : "")) +
          "?rand=" +
          Math.floor((1 + Math.random()) * 0x10000), // 0x10000 = 2^16
        true
      );

      xhrObj.send();
    } catch (error) {
      resolve(false);
    }
  });
}

/**
 * Returns a promise which resolves when the network is available.
 *
 * NOTE: If the network is available, the promise will resolve almost immediately.
 *
 * @param {number} intervalMillisecs An interval in milliseconds to wait before the next network check.
 * @return {Promise} A promise.
 */
export function waitNetwork(intervalMillisecs = 3000) {
  return new Promise(resolve => {
    checkNetwork().then(isNetworkReachable => {
      if (isNetworkReachable) {
        resolve();
      } else {
        const interval = setInterval(() => {
          checkNetwork().then(isNetworkReachable => {
            if (isNetworkReachable) {
              clearInterval(interval);
              resolve();
            }
          });
        }, intervalMillisecs);
      }
    });
  });
}

/**
 * Sets a cookie value.
 *
 * @see https://www.w3schools.com/js/js_cookies.asp
 *
 * @param {string} cname The cookie name.
 * @param {string} cvalue The cookie value.
 * @param {number|undefined} exdays Number of days after which the cookie expires,
 *                                  or "undefined" to make the cookie expire at the end of the session.
 * @return {undefined}
 */
export function setCookie(cname, cvalue, exdays) {
  let expires = "";
  if (exdays) {
    const d = new Date();
    d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
    expires = "expires=" + d.toUTCString() + ";";
  }
  document.cookie = cname + "=" + cvalue + ";" + expires + "path=/";
}

/**
 * Gets a cookie value.
 *
 * @see https://www.w3schools.com/js/js_cookies.asp
 *
 * @param {string} cname The cookie name.
 * @return {string|undefined} The cookie value or "undefined", if not set.
 */
export function getCookie(cname) {
  const name = cname + "=";
  const ca = document.cookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == " ") {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return void 0;
}

/**
 * Unsets a cookie.
 *
 * @param {string} cname The cookie name.
 * @return {undefined}
 */
export function unsetCookie(cname) {
  setCookie(cname, "", -365);
}

/**
 * Tests whether a DOM element is in viewport or not.
 *
 * @param {Element} elem The DOM element.
 * @return {boolean} True if it is in viewport, false otherwise.
 */
export function isInViewport(elem) {
  const bounding = elem.getBoundingClientRect();
  return (
    bounding.top >= 0 &&
    bounding.left >= 0 &&
    bounding.bottom <=
      (window.innerHeight || document.documentElement.clientHeight) &&
    bounding.right <=
      (window.innerWidth || document.documentElement.clientWidth)
  );
}

/**
 * Tests if a DOM element is scrolled into the scrollable view of its parent scrollable container.
 *
 * @param {Element} elem The DOM element to test.
 * @param {Element} holder The DOM element of the scrollable container of the DOM element to test.
 * @param {number|Function} minPx Minimum number of pixels of the element's height which must be scrolled into the view
 *                                in order to consider the element to be scrolled into view.
 *                                If a function is given, it will receive the element's bounding client rect as the first argument
 *                                as well as the holder element's bounding client rect as the second argument and must return
 *                                the minimum number of pixels.
 * @return {boolean} True if the given element is scrolled into view, false otherwise.
 */
export function isScrolledIntoView(el, holder, minPx = 1) {
  const elRect = el.getBoundingClientRect();
  const holderRect = holder.getBoundingClientRect();
  const { top, bottom, height } = elRect;

  const minPxNumberFn = () =>
    typeof minPx === "function" ? minPx(elRect, holderRect) : minPx;
  let bottomDiff;
  return top <= holderRect.top
    ? holderRect.top - top + minPxNumberFn() <= height
    : (bottomDiff = bottom - holderRect.bottom) < 0
    ? true
    : holderRect.bottom >= top && minPx
    ? holderRect.bottom - top >= minPxNumberFn()
    : bottomDiff <= height;
}

/**
 * Tests if a DOM element has a vertical scrollbar.
 *
 * @param {Element} elem The DOM element.
 * @return {boolean} True it has a vertical scrollbar, false otherwise.
 */
export function hasVerticalScrollbar(elem) {
  const hasVerticalScrollbar = elem.scrollHeight > elem.clientHeight;
  return hasVerticalScrollbar;
}

/**
 * Tests if a DOM element has a horizontal scrollbar.
 *
 * @param {Element} elem The DOM element.
 * @return {boolean} True it has a horizontal scrollbar, false otherwise.
 */
export function hasHorizontalScrollbar(elem) {
  const hasHorizontalScrollbar = elem.scrollWidth > elem.clientWidth;
  return hasHorizontalScrollbar;
}

/**
 * Generates a unique ID which can be used for an element.
 *
 * @param {string|undefined} [elementUniqueIdPrefix] Local unique ID prefix which overrides the prefix
 *                                                   set on the "config" configuration object.
 * @return {string} The element unique ID.
 */
export function elementUniqueId(elementUniqueIdPrefix = void 0) {
  const uniqueElementIdSuffix = uniqueId();
  return (
    (elementUniqueIdPrefix || config.elementUniqueIdPrefix) +
    uniqueElementIdSuffix
  );
}

/**
 * Gets the computed style of an element.
 *
 * @param {Element} element DOM element.
 * @return {CSSStyleDeclaration} The computed style.
 */
export function getElementComputedStyle(element) {
  return window.getComputedStyle(element);
}

/**
 * Gets element's inner dimensions (height and width without padding).
 *
 * @param {Element} element An element.
 * @return {Object} An object with "width" and "height" properties.
 */
export function elementInnerDimensions(element) {
  const computedStyle = getElementComputedStyle(element);

  let elementHeight = element.clientHeight; // Height with padding.
  let elementWidth = element.clientWidth; // Width with padding

  elementHeight -=
    parseFloat(computedStyle.paddingTop) +
    parseFloat(computedStyle.paddingBottom);
  elementWidth -=
    parseFloat(computedStyle.paddingLeft) +
    parseFloat(computedStyle.paddingRight);
  return {
    width: elementWidth,
    height: elementHeight,
  };
}

/**
 * @type {HTMLTextAreaElement}
 */
let countTextareaLinesBuffer;

/**
 * Returns the number of lines in a textarea, including wrapped lines.
 *
 * @see https://stackoverflow.com/questions/28905965/textarea-how-to-count-wrapped-lines-rows#answer-45252226
 *
 * @param {HTMLTextAreaElement} textarea A textarea element. Note that the textarea should have an integer line height
 *                                       to avoid rounding errors.
 */
export function countTextareaLines(textarea) {
  if (countTextareaLinesBuffer == null) {
    countTextareaLinesBuffer = document.createElement("textarea");
    countTextareaLinesBuffer.style.border = "none";
    countTextareaLinesBuffer.style.height = "0";
    countTextareaLinesBuffer.style.overflow = "hidden";
    countTextareaLinesBuffer.style.padding = "0";
    countTextareaLinesBuffer.style.position = "absolute";
    countTextareaLinesBuffer.style.left = "0";
    countTextareaLinesBuffer.style.top = "0";
    countTextareaLinesBuffer.style.zIndex = "-1";
    document.body.appendChild(countTextareaLinesBuffer);
  }

  const cs = window.getComputedStyle(textarea);
  const pl = parseInt(cs.paddingLeft);
  const pr = parseInt(cs.paddingRight);
  let lh = parseInt(cs.lineHeight);

  // `cs.lineHeight` may return 'normal', which means line height = font size.
  if (isNaN(lh)) lh = parseInt(cs.fontSize);

  // Copy content width.
  countTextareaLinesBuffer.style.width = textarea.clientWidth - pl - pr + "px";

  // Copy text properties.
  countTextareaLinesBuffer.style.font = cs.font;
  countTextareaLinesBuffer.style.letterSpacing = cs.letterSpacing;
  countTextareaLinesBuffer.style.whiteSpace = cs.whiteSpace;
  countTextareaLinesBuffer.style.wordBreak = cs.wordBreak;
  countTextareaLinesBuffer.style.wordSpacing = cs.wordSpacing;
  countTextareaLinesBuffer.style.wordWrap = cs.wordWrap;

  // Copy value.
  countTextareaLinesBuffer.value = textarea.value;

  let result = Math.floor(countTextareaLinesBuffer.scrollHeight / lh);
  if (result == 0) {
    result = 1;
  }
  return result;
}

/**
 * Checks if the scroll of an element is on the bottom.
 *
 * @param {Element} DOMNode Element.
 * @return {boolean} True if the scroll is on the bottom, false otherwise.
 */
export function isScrollOnBottom(DOMNode) {
  const ret = DOMNode.scrollTop + DOMNode.offsetHeight >= DOMNode.scrollHeight;
  return ret;
}

/**
 * Returns the default browser's vertical scrollbar width.
 *
 * @return {Number} The scrollbar width.
 */
export function getVerticalScrollBarWidth() {
  const scrollDiv = document.createElement("div");
  scrollDiv.className = "vertical-scrollbar-measure";

  const sheet = document.createElement("style");
  sheet.innerHTML =
    "div.vertical-scrollbar-measure { width: 100px; height: 100px; overflow: scroll; position: absolute; top: -9999px; }";

  document.body.appendChild(sheet);
  document.body.appendChild(scrollDiv);

  const scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth;

  document.body.removeChild(scrollDiv);
  const sheetParent = sheet.parentNode;
  sheetParent.removeChild(sheet);

  return scrollbarWidth;
}

/**
 * Tests if an element with "text-overflow: ellipsis;" has the ellipsis active
 * and therefore its text is truncated.
 *
 * @param {Element} e The DOM element.
 * @return {boolean} True if ellipsis are present, false otherwise.
 */
export function isEllipsisActive(e) {
  return e.offsetWidth < e.scrollWidth;
}

/**
 * A fallback function to copy a text to clipboard.
 *
 * @param {string} text The text to copy.
 * @param {Function} [onSuccess] An optional callback to execute on success.
 * @param {Function} [onFailure] An optional callback to execute on failure.
 * @return {undefined}
 */
function fallbackCopyTextToClipboard(text, onSuccess, onFailure) {
  const bodyScrollTop =
    document.documentElement.scrollTop || document.body.scrollTop;
  const textArea = document.createElement("textarea");
  textArea.value = text;
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();

  try {
    const successful = document.execCommand("copy");
    if (successful) {
      onSuccess && onSuccess();
    } else {
      onFailure && onFailure();
    }
  } catch (err) {
    onFailure && onFailure(err);
  }

  (document.body.removeChild(textArea) &&
    document.documentElement.scrollTop &&
    (document.documentElement.scrollTop = bodyScrollTop)) ||
    (document.body.scrollTop = bodyScrollTop);
}

/**
 * Copies a text to clipboard.
 *
 * @param {string} text The text to copy.
 * @param {Function} [onSuccess] An optional callback to execute on success.
 * @param {Function} [onFailure] An optional callback to execute on failure.
 * @return {undefined}
 */
export function copyTextToClipboard(text, onSuccess, onFailure) {
  if (!navigator.clipboard) {
    fallbackCopyTextToClipboard(text, onSuccess, onFailure);
    return;
  }
  navigator.clipboard.writeText(text).then(
    function () {
      onSuccess && onSuccess();
    },
    function (err) {
      onFailure && onFailure(err);
    }
  );
}

/**
 * Asynchronously invokes a callback multiple times, each in its own animation frame.
 *
 * @param {number} n The number of times the callback should be invoked.
 * @param {Function} callback The callback to invoke.
 * @return {*} The identifier of the first animation frame or "n" if it is falsy during the outermost call.
 */
export const rAFLooper = (n, callback) =>
  n &&
  window.requestAnimationFrame(() => (callback(), rAFLooper(--n, callback)));

/**
 * Requests a predefined number of animation frames and executes a callback after.
 *
 * @param {number} count The number of animation frames to request before executing the callback.
 * @param {Function} callback The callback to execute after "count" animation frames have been requested.
 * @return {number} The identifier of the first animation frame.
 */
export const nestedRAF = (count, callback) => {
  let c = count || 1;
  const innerCallback = () => {
    c--;
    if (!c) {
      callback();
      return;
    }
    window.requestAnimationFrame(innerCallback);
  };
  return window.requestAnimationFrame(innerCallback);
};

/**
 * Returns the raw contents of the URI fragment (i.e. everything after the hash ("#") character).
 *
 * @param {string} URIFragment The URI fragment.
 * @return {string} The raw contents of the URI fragment.
 */
export function getRawURIFragment(URIFragment) {
  const fragment = (URIFragment || window.location.hash).replace(/^#/, "");
  return fragment;
}

/**
 * Returns the decoded contents of a URI fragment (i.e. everything after the hash ("#") character).
 *
 * @param {string} URIFragment The URI fragment.
 * @return {string} The contents of the URI fragment, decoded.
 */
export function getDecodedURIFragment(URIFragment) {
  const fragment = decodeURIComponent(getRawURIFragment(URIFragment));
  return fragment;
}

/**
 * Appends an encoded JSON fragment to a URI.
 *
 * @param {string} URI The URI.
 * @param {*} data Data to encode in JSON format.
 */
export function appendEncodedJSONFragmentToURI(URI, data) {
  return URI + "#" + encodeURIComponent(JSON.stringify(data));
}

/**
 * Returnes the decoded JSON data eventually stored in the URI fragment.
 *
 * @param {*} defaultData Default data to return if either the URI fragment is missing or
 *                        the content of the URI fragment is not a valid JSON-encoded string.
 * @return {*} The decoded JSON data or "defaultData".
 */
export function getDecodedJSONFromFragmentURI(defaultData = null) {
  const fragment = window.location.hash;
  if (!isEmpty(fragment)) {
    const decodedFragment = getDecodedURIFragment(fragment);
    if (isJSONString(decodedFragment)) {
      return JSON.parse(decodedFragment);
    }
  }
  return defaultData;
}
/**
 * Parses a multidimensional query string and returns an object with the parsed args.
 *
 * @see https://stackoverflow.com/questions/8648892/convert-url-parameters-to-a-javascript-object#answer-44713056
 *
 * @param {string} str The query string.
 * @param {Object} [array] The base object to use (or a new object if omitted or falsy).
 * @return {Object} The object with the parsed data.
 */
export function parseQueryStringArgsMultiDim(str, array) {
  if (!str) {
    str = window.location.search.substr(1);
  }
  let i,
    j,
    ct,
    p,
    lastObj,
    obj,
    undef,
    chr,
    tmp,
    key,
    value,
    postLeftBracketPos,
    keys,
    keysLen;
  const strArr = String(str).replace(/^&/, "").replace(/&$/, "").split("&"),
    sal = strArr.length,
    fixStr = function (str) {
      return decodeURIComponent(str.replace(/\+/g, "%20"));
    };

  if (!array) {
    array = {};
  }

  for (i = 0; i < sal; i++) {
    tmp = strArr[i].split("=");
    key = fixStr(tmp[0]);
    value = tmp.length < 2 ? "" : fixStr(tmp[1]);

    while (key.charAt(0) === " ") {
      key = key.slice(1);
    }
    if (key.indexOf("\x00") > -1) {
      key = key.slice(0, key.indexOf("\x00"));
    }
    if (key && key.charAt(0) !== "[") {
      keys = [];
      postLeftBracketPos = 0;
      for (j = 0; j < key.length; j++) {
        if (key.charAt(j) === "[" && !postLeftBracketPos) {
          postLeftBracketPos = j + 1;
        } else if (key.charAt(j) === "]") {
          if (postLeftBracketPos) {
            if (!keys.length) {
              keys.push(key.slice(0, postLeftBracketPos - 1));
            }
            keys.push(key.substr(postLeftBracketPos, j - postLeftBracketPos));
            postLeftBracketPos = 0;
            if (key.charAt(j + 1) !== "[") {
              break;
            }
          }
        }
      }
      if (!keys.length) {
        keys = [key];
      }
      for (j = 0; j < keys[0].length; j++) {
        chr = keys[0].charAt(j);
        if (chr === " " || chr === "." || chr === "[") {
          keys[0] = keys[0].substr(0, j) + "_" + keys[0].substr(j + 1);
        }
        if (chr === "[") {
          break;
        }
      }

      obj = array;
      for (j = 0, keysLen = keys.length; j < keysLen; j++) {
        key = keys[j].replace(/^['"]/, "").replace(/['"]$/, "");
        lastObj = obj;
        if ((key !== "" && key !== " ") || j === 0) {
          if (obj[key] === undef) {
            obj[key] = {};
          }
          obj = obj[key];
        } else {
          // To insert new dimension
          ct = -1;
          for (p in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, p)) {
              if (+p > ct && p.match(/^\d+$/g)) {
                ct = +p;
              }
            }
          }
          key = ct + 1;
        }
      }
      lastObj[key] = value;
    }
  }

  /* ===== */
  /*
   * This code converts the object properties to arrays if they are objects with consecutive integer keys
   * from 0 to n, where n is the number of properties of that object minus one
   * (i.e. it converts meaningful objects which are to be interpreted as arrays to arrays).
   */
  const fnNormalizeObjToArrayIfPropsAreConsecutiveIntsFrom0 = function (obj) {
    const keys = Object.keys(obj);
    const truthMap = {};
    for (let i = 0; i < keys.length; i++) {
      truthMap[i] = true;
    }

    const array = [];
    for (let i = 0; i < keys.length; i++) {
      const prop = keys[i] + "";
      if (!prop.match(/^[0-9]+$/)) {
        return obj;
      }
      const intProp = Number(prop);
      if (truthMap[intProp]) {
        array[intProp] = obj[prop];
        delete truthMap[intProp];
      } else {
        return obj;
      }
    }

    if (Object.keys(truthMap).length === 0) {
      return array;
    } else {
      return obj;
    }
  };

  const fnNormalizeToArrayIfNeeded = function fnNormalizeToArrayIfNeeded(obj) {
    for (const prop in obj) {
      if (isPlainObject(obj[prop])) {
        obj[prop] = fnNormalizeObjToArrayIfPropsAreConsecutiveIntsFrom0(
          obj[prop]
        );
        fnNormalizeToArrayIfNeeded(obj[prop]);
      }
    }
  };
  /* /===== */

  fnNormalizeToArrayIfNeeded(array);

  return array;
}

/**
 * Gets the query string arguments of the current location in a multidimensional fashion
 * (multidimension-aware).
 *
 * @return {Object} An object representing the query string arguments.
 */
export function getQueryStringArgsMultiDim() {
  const obj = {};
  parseQueryStringArgsMultiDim(location.search.substring(1), obj);
  return obj;
}

/**
 * Focuses an input without scrolling.
 *
 * @see https://stackoverflow.com/questions/4963053/focus-to-input-without-scrolling
 *
 * @param {Element} elem The DOM element.
 */
export const cursorFocus = function (elem) {
  let x, y;
  // More sources for scroll x, y offset.
  if (typeof window.pageXOffset !== "undefined") {
    x = window.pageXOffset;
    y = window.pageYOffset;
  } else if (typeof window.scrollX !== "undefined") {
    x = window.scrollX;
    y = window.scrollY;
  } else if (
    document.documentElement &&
    typeof document.documentElement.scrollLeft !== "undefined"
  ) {
    x = document.documentElement.scrollLeft;
    y = document.documentElement.scrollTop;
  } else {
    x = document.body.scrollLeft;
    y = document.body.scrollTop;
  }

  elem.focus();

  if (typeof x !== "undefined") {
    window.scrollTo(x, y);
  }
};

/**
 * Detects wrapped elements.
 *
 * @param {string|Element[]} classNameOrElements A class name (with or without the leading dot) or the DOM elements to check.
 * @return {Element[]} The wrapped DOM elements.
 */
export function detectWrapped(classNameOrElements) {
  let elements;
  if (typeof classNameOrElements === "string") {
    classNameOrElements = classNameOrElements.replace(/^\./, "");
    elements = document.getElementsByClassName(classNameOrElements);
  } else {
    elements = classNameOrElements;
  }
  const wrapped = [];
  let prev = {};
  let curr = {};
  for (let i = 0; i < elements.length; i++) {
    const element = elements[i];
    curr = element.getBoundingClientRect();
    if (prev && prev.top < curr.top) {
      wrapped.push(element);
    }
    prev = i === 0 ? curr : prev;
  }
  return wrapped;
}

/**
 * Gets the maximum nesting level of an element (or of the whole DOM if "document.body" is given as parameter).abs
 *
 * @param {Element} elem The DOM element from which to start identifying the maximum nesting level.
 * @return {number} The maximum nesting level, starting from 0 if the given element has no children.
 */
export function maxNestingLevel(el) {
  if (!el.children) {
    return 0;
  }
  let max = -1;
  for (let i = 0; i < el.children.length; i++) {
    const nestingLevel = maxNestingLevel(el.children[i]);
    if (nestingLevel > max) {
      max = nestingLevel;
    }
  }
  return max + 1;
}

/**
 * @type {RegExp}
 */
const REGEXP_SCROLL_PARENT = /^(visible|hidden)/;

/**
 * Get the first scrollable ancestor of an element.
 *
 * @param {Element} el The element to use as the base from which to determine its first scrollable ancestor.
 * @return {Element} The first scrollable ancestor element scroll, or the document body.
 */
export const getScrollableAncestor = el =>
  !(el instanceof HTMLElement) || typeof window.getComputedStyle !== "function"
    ? null
    : el.scrollHeight >= el.clientHeight &&
      !REGEXP_SCROLL_PARENT.test(
        window.getComputedStyle(el).overflowY || "visible"
      )
    ? el
    : getScrollableAncestor(el.parentElement) ||
      document.scrollingElement ||
      document.body;

/**
 * Smoothly scrolls to the top of a scrollable element or the browser's window.
 *
 * @param {Element} [el] The element. Defaults to "window".
 * @return {undefined}
 */
export const smoothScrollToTop = (el = window) =>
  el.scroll({
    top: 0,
    behavior: "smooth",
  });

/**
 * Downloads a file without opening a new browser's tab.
 *
 * @see https://stackoverflow.com/questions/1066452/easiest-way-to-open-a-download-window-without-navigating-away-from-the-page#answer-43523297
 *
 * @param {string} fileURI The URI of the file to download.
 * @return {undefined}
 */
export function downloadFile(fileURI) {
  var link = document.createElement("a");
  link.href = fileURI;
  link.download = fileURI.substr(fileURI.lastIndexOf("/") + 1);
  link.click();
}
