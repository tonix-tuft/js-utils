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
 * Array-related utility functions.
 */

/**
 * Unshifts an array.
 *
 * @param {Array} arr The array.
 * @param {*} item The item to unshift.
 * @return {undefined}
 */
export function unshiftArray(arr, item) {
  let len = arr.length;
  while (len) {
    arr[len] = arr[len - 1];
    len--;
  }
  arr[0] = item;
}

/**
 * Clones an array.
 *
 * @param {Array} arr The array to clone.
 * @return {Array} The cloned array.
 */
export function cloneArray(arr) {
  return arr.slice(0);
}

/**
 * Gets a slice of an array from a value up until another.
 *
 * @param {Array} arr The input array.
 * @param {number} from The "from" lower value.
 * @param {number} to The "two" upper value.
 * @return {Array} The slice as a new array.
 */
export function arraySliceFromValueToValue(arr, from, to) {
  const ret = [];
  let include = false;
  for (const value of arr) {
    if (!include && value == from) {
      ret.push(value);
      include = true;
    } else if (include && value == to) {
      ret.push(value);
      break;
    } else if (include) {
      ret.push(value);
    }
  }
  return ret;
}

/**
 * Tests whether all the elements of an array are coercible to a number or not.
 *
 * @param {Array} array An array.
 * @return {boolean} True if all the elements are coercible to a number, false otherwise.
 */
export function areArrayItemsAllCoercibleToNumber(array) {
  const res = !array.some(isNaN);
  return res;
}

/**
 * Copies an array or converts an array-like object to a new array.
 *
 * @param {*} arg Array or array-like object.
 * @return {Array} An array.
 */
export function arrayOrArrayLike(arg) {
  return Array.prototype.slice.call(arg);
}

/**
 * Returns the last element of the given array.
 *
 * @param {Array} array An array.
 * @return {*} The last element of the array or undefined if there isn't one.
 */
export function lastOfArray(array) {
  return array[array.length - 1];
}

/**
 * Returns the first element of the given array.
 *
 * @param {Array} array An array.
 * @return {*} The first element of the array or undefined if there isn't one.
 */
export function firstOfArray(array) {
  return array[0];
}

/**
 * Like {@link Array.prototype.find}, but in reverse order.
 *
 * @param {Array} array An array.
 * @param {Function} fn Function to use for the test. The function will receive the array element as parameter.
 * @return {*} The first element which satisfies the test in the array by seeking for the element in reverse order
 *             (i.e. the last element of the array for which the test is satisfied).
 *             If no element satisfies the test, "undefined" is returned.
 */
export function arrayFindReverse(array, fn) {
  let l = array.length;

  let ret = void 0;
  while (l) {
    l--;
    if (fn(array[l])) {
      ret = array[l];
      break;
    }
  }
  return ret;
}

/**
 * Finds the maximum value of an array of numbers.
 *
 * @param {number[]} array An array of numbers.
 * @return {number|undefined} The maximum value of the array, or "undefined"
 *                            if the given array is empty.
 */
export const arrayMax = array =>
  array.length
    ? array.reduce(
        (carry, current) => (current > carry ? current : carry),
        -Infinity
      )
    : void 0;

/**
 * Finds the minimum value of an array of numbers.
 *
 * @param {number[]} array An array of numbers.
 * @return {number|undefined} The minimum value of the array, or "undefined"
 *                            if the given array is empty.
 */
export const arrayMin = array =>
  array.length
    ? array.reduce(
        (carry, current) => (current < carry ? current : carry),
        +Infinity
      )
    : void 0;

/**
 * Sorts an array of numbers returning a new array with the sorted
 * numbers (does not mutate the original).
 *
 * @param {number[]} arrayOfNums An array of numbers.
 * @param {boolean} [desc] True for descending order, false for ascending order (default).
 * @return {number[]} A new array with the sorted numbers.
 */
export const sortNums = (arrayOfNums, desc = false) =>
  [...arrayOfNums].sort((a, b) =>
    !desc // asc
      ? a - b
      : // desc
        b - a
  );
