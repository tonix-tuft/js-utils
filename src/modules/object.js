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
 * Object-related utility functions.
 */

/**
 * @type {Function}
 */
const defaultObjectComparator = (a, b) => (a < b ? -1 : a > b ? 1 : 0);

/**
 * Finds the minimum value of an object.
 *
 * @param {Object} obj An object.
 * @param {Object} [options] An optional object with further options.
 * @param {(a: *, c: *) => number} [options.comparator] A comparator function receiving two values as arguments which must return a number less than 0 if the first
 *                                                      given value is the new minimum value.
 * @param {boolean} [options.returnAsKeyVal] True to return an object containing two properties `value` and `key`, namely the minimum value's key
 *                                           (`key` property) as well as the minimum value itself (`value` property).
 * @return {*} The minimum value or an object with the key and the minimum value if "returnAsKeyVal" is truthy.
 */
export const objectMin = (
  obj,
  { comparator = defaultObjectComparator, returnAsKeyVal = false } = {}
) => {
  const min = { key: void 0, value: void 0 };
  for (const key in obj) {
    const value = obj[key];
    if (typeof min.key === "undefined" || comparator(value, min.value) < 0) {
      min.key = key;
      min.value = value;
    }
  }
  return returnAsKeyVal ? min : min.value;
};
