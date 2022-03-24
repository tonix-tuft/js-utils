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
 * Utility functions for callback handling (like debouncing, throttling).
 */

import { isUndefined } from "./core";

/**
 * Delays execution of a callback and cancels a previously registered callback if it wasn't executed yet.
 */
export const delay = (function () {
  let timer = 0;

  /**
   * Inner function.
   *
   * @param {Function} callback The callback to execute.
   * @param {number} ms Milliseconds to wait before executing the callback.
   * @return {undefined}
   */
  return function (callback, ms) {
    clearTimeout(timer);
    timer = setTimeout(function () {
      callback();
    }, ms);
  };
})();

/**
 * Debounces a function.
 *
 * @param {Function} fn A function.
 * @param {number} wait Wait interval in milliseconds.
 * @return {Function} A new function, debounced.
 */
export function debounce(fn, wait) {
  let timer = void 0;
  return function (...args) {
    !isUndefined(timer) && clearTimeout(timer);
    timer = setTimeout(function () {
      fn(...args);
    }, wait);
  };
}

/**
 * Throttles a function.
 *
 * @see https://www.sitepoint.com/throttle-scroll-events/
 *
 * @param {Function} fn A function.
 * @param {number} wait Wait interval in milliseconds.
 * @return {Function} A new function, throttled.
 */
export function throttle(fn, wait) {
  let time = Date.now();
  return function (...args) {
    if (time + wait - Date.now() < 0) {
      fn(...args);
      time = Date.now();
    }
  };
}
