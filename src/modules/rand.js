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
 * Utility functions providing random functionality.
 */

/**
 * Generates a random string.
 *
 * @param {number} length The length of the string to return.
 * @return {string} The random string.
 */
export function randomStr(length) {
  let result = "";
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

/**
 * Generates a random int between min and max (both included).
 *
 * @param {number} min Min int value.
 * @param {number} max Max int value.
 * @return {number} A random int between min and max.
 */
export function randomInt(min = 0, max = Number.MAX_SAFE_INTEGER) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Generates a random float between min and max integers (both included).
 *
 * @param {number} min Min int value.
 * @param {number} max Max int value.
 * @return {number} A random float between min and max.
 */
export function randomFloat(min = 0, max = 562949953421311) {
  const randInt = randomInt(min, max);
  if (randInt >= max) {
    return randInt;
  }
  return randInt + Math.random();
}

/**
 * Returns a random float (using "Math.random()") not equal to the given value.
 *
 * @param {number} value The given value.
 * @return {number} A random float not equal to value.
 */
export function randomDifferentFromValue(value) {
  let ret = Math.random();
  while (value == ret) {
    ret = Math.random();
  }
  return ret;
}

/**
 * @type {Array}
 */
let noncanonicalUUIDCounter = 1;

/**
 * Generates a new UUID.
 *
 * @see https://github.com/tastejs/todomvc/blob/gh-pages/examples/react/js/utils.js
 *
 * @return {string} The UUID.
 */
export function uuid() {
  let i, random;
  let uuid = "";

  for (i = 0; i < 32; i++) {
    random = (Math.random() * 16) | 0;
    if (i === 8 || i === 12 || i === 16 || i === 20) {
      uuid += "-";
    }
    uuid += (i === 12 ? 4 : i === 16 ? (random & 3) | 8 : random).toString(16);
  }

  return uuid;
}

/**
 * Generates a new noncanonical UUID. This noncanonical UUID has a further
 * int prefixed by "-" which is concatenated to a canonical UUID at the end
 * of the canonical UUID before returning this noncanonical UUID.
 * The int starts with 1 and increments every time this function is called.
 *
 * @return {string} A noncanonical UUID.
 */
export function noncanonicalUUID() {
  const UUID = uuid();
  return UUID + "-" + noncanonicalUUIDCounter++;
}

/**
 * Shuffles an array randomly modifing the given array.
 *
 * @param {Array} array The input array.
 * @return {Array} A reference to the same array given as input,
 *                 but with its elements randomly shuffled.
 */
const shuffleArrayRandomly = array => {
  let i = array.length,
    temporaryValue,
    randomIndex;
  while (0 !== i) {
    randomIndex = Math.floor(Math.random() * i);
    i--;
    temporaryValue = array[i];
    array[i] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }
  return array;
};

/**
 * Returns an array with the elements of the given array randomly shuffled.
 *
 * @param {Array} array An array.
 * @return {Array} A new array with the same elements of the input array, but randomly shuffled.
 */
export function randomArrayShuffle(array) {
  return shuffleArrayRandomly(Object.keys(array)).map(i => array[i]);
}

/**
 * Generates a random string.
 *
 * @return {string} A random string.
 */
export const randomString = () => Math.random().toString(36).substr(2);
