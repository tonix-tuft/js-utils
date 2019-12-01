/*
 * Copyright (c) 2019 Anton Bagdatyev (Tonix-Tuft)
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
 * Combinatorics utility functions.
 */

import { arrayOrArrayLike } from "./core";

/**
 * Yields all the combinations of an array without repetitions (binomial coefficient).
 *
 * @generator
 * @param {Array} items An array.
 * @param {number} numberOfItemsPerCombination The number of elements in each combination
 *                                             (this function assumes it to be less than "items.length"
 *                                             and greater than 0).
 * @param {bool} yieldCopy True if the yielded combination should be a copy (default) or
 *                         the internal array used during the generation of the current combination.
 * @yields {Array} The next combination.
 */
export const yieldCombinationsWithoutRepetition = function*(
  items,
  numberOfItemsPerCombination,
  yieldCopy = true
) {
  const l = items.length;
  const prefix = [];

  const recurse = function* recurse(
    items,
    l,
    prefix,
    numberOfItemsPerCombination,
    nextIndex = 0
  ) {
    // Same as:
    // if (nextIndex === numberOfItemsPerCombination) {
    if (prefix.length === numberOfItemsPerCombination) {
      // Base case:
      yield yieldCopy ? arrayOrArrayLike(prefix) : prefix;
    } else {
      // Recurrent case:
      for (
        let i = nextIndex;
        i < l &&
        // Remaining needed items
        numberOfItemsPerCombination - prefix.length <=
          // Remaining available items
          l - i;
        i++
      ) {
        prefix.push(items[i]);
        yield* recurse(items, l, prefix, numberOfItemsPerCombination, i + 1);
        prefix.pop();
      }
    }
  };

  yield* recurse(items, l, prefix, numberOfItemsPerCombination);
};

/**
 * Generate unique, progressive and incremental combinations.
 *
 * @param {Array} items An array of items.
 * @return {Array[]} An array of arrays, each representing a unique progressive incremental combination.
 *                   An empty array is returned if the items array is empty.
 */
export const uniqueProgressiveIncrementalCombinations = items => {
  const len = items.length;
  if (len === 0) {
    return [];
  }

  const last = arrayOrArrayLike(items); // Shallow copy/clone of the given array.
  if (len === 1) {
    // [1] => [[1]]
    return [last];
  }

  const ret = [];
  // [1], [2], [3], ..., [n]
  items.map(item => ret.push([item]));

  if (len > 2) {
    // There  are at least three items.
    for (
      let numberOfItemsPerCombination = 2;
      numberOfItemsPerCombination < len;
      numberOfItemsPerCombination++
    ) {
      for (const combination of yieldCombinationsWithoutRepetition(
        items,
        numberOfItemsPerCombination
      )) {
        ret.push(combination);
      }
    }
  }

  ret.push(last);
  return ret;
};
