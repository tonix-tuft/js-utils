/*
 * Copyright (c) 2021 Anton Bagdatyev (Tonix)
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
 * Hashing-related utility functions.
 */

/**
 * Computes a hash of an array of strings (the order of strings does not matter).
 *
 * NOTE: An array with duplicate values given as parameter to this function
 *       may yield to a hash which would collide with other hashes computed
 *       on different arrays with this same function.
 *       Therefore is on behalf of the caller to be sure that "array" contains
 *       unique strings.
 *
 * @param {string[]} array An array of strings.
 * @return {number} A number representing the hash code of the array.
 */
export function stringHashArray(array) {
  let code = 0;
  for (let i = 0; i < array.length; i++) {
    let n = 0;
    for (let j = 0; j < array[i].length; j++) {
      n = (n * 251) ^ array[i].charCodeAt(j);
    }
    code ^= n;
  }
  return code;
}

/**
 * Returns the hash of a string.
 *
 * @see https://stackoverflow.com/questions/7616461/generate-a-hash-from-string-in-javascript#answer-7616484
 *
 * @param {string} str The string.
 * @return {number} The hash code of the string, represented as a number.
 */
export const hashString = str => {
  let hash = 0,
    i,
    chr;
  if (str.length === 0) {
    return hash;
  }
  for (i = 0; i < str.length; i++) {
    chr = str.charCodeAt(i);
    hash = (hash << 5) - hash + chr;
    hash |= 0; // Convert to 32 bit integer.
  }
  return hash;
};

/**
 * A one-pass algorithm to compute the hash of a series of unique strings incrementally.
 *
 * NOTE: Duplicate values given as parameter to this function
 *       may yield to a hash which would collide with other hashes computed
 *       on different string series with this same function.
 *       Therefore is on behalf of the caller to be sure that the series of strings will be unique
 *       while calling this function incrementally.
 *
 * @param {string} str The string.
 * @param {number} [hash] The previous hash computed with this same function if this call is the continuation
 *                        of the unique string series.
 * @return {number} The next hash.
 */
export function onePassStringHash(str, hash = 0) {
  let nextHash = hash;
  let n = 0;
  for (let j = 0; j < str.length; j++) {
    n = (n * 251) ^ str.charCodeAt(j);
  }
  nextHash ^= n;
  return nextHash;
}
