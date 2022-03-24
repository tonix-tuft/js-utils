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
 * Combinatorics utility functions.
 */

import { nestedMapSet, nestedMapHas, mapYield } from "./core";
import { arrayOrArrayLike } from "./array";

/**
 * Yields all the combinations of an array without repetitions (binomial coefficient).
 *
 * @generator
 * @param {Array} items An array.
 * @param {number} numberOfItemsPerCombination The number of elements in each combination
 *                                             (this function assumes it to be less than "items.length"
 *                                             and greater than 0).
 * @param {boolean} yieldCopy True if the yielded combination should be a copy (default) or
 *                            the internal array used during the generation of the current combination.
 * @yields {Array} The next combination.
 */
export const yieldCombinationsWithoutRepetition = function* (
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
 *                   An empty array is returned if the given items array is empty.
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

/**
 * Yields unique, progressive and incremental combinations.
 *
 * @generator
 * @param {Array} items An array of items.
 * @param {boolean} yieldCopy True if some of the yielded combinations should be a copy (default)
 *                         of the corresponding internal array used during the generation of the current combination
 *                         or that same array should be returned (if "yieldCopy" is "false").
 * @yields {Array} An array, each representing the next unique progressive incremental combination.
 *                 An empty array is yielded if the given items array is empty.
 */
export const yieldUniqueProgressiveIncrementalCombinations = function* (
  items,
  yieldCopy = true
) {
  const len = items.length;
  if (len === 0) {
    return;
  }

  const last = yieldCopy ? arrayOrArrayLike(items) : items; // Shallow copy/clone of the given array.
  if (len === 1) {
    // [1] => [[1]]
    yield last;
    return;
  }

  // [1], [2], [3], ..., [n]
  yield* mapYield(items, item => [item]);

  if (len > 2) {
    // There  are at least three items.
    for (
      let numberOfItemsPerCombination = 2;
      numberOfItemsPerCombination < len;
      numberOfItemsPerCombination++
    ) {
      for (const combination of yieldCombinationsWithoutRepetition(
        items,
        numberOfItemsPerCombination,
        yieldCopy
      )) {
        yield combination;
      }
    }
  }

  yield last;
};

/**
 * Yields all the subsequences of the given array of items.
 *
 * @generator
 * @param {Array} items An array of items to use to yield subsequences.
 * @yields {Array} The next subsequence.
 */
export const yieldAllSubsequences = function* (items) {
  const l = items.length;
  for (let i = 0; i <= l; i++) {
    for (const combination of yieldCombinationsWithoutRepetition(items, i)) {
      yield combination;
    }
  }
};

/**
 * Yields only the unique subsequences of the given array of items.
 *
 * @generator
 * @param {Array} items An array of items to use to yield subsequences.
 * @yields {Array} The next unique subsequence.
 */
export const yieldUniqueSubsequences = function* (items) {
  const map = new Map();
  yield [];
  for (const subsequence of yieldAllSubsequences(items)) {
    if (!nestedMapHas(map, subsequence)) {
      nestedMapSet(map, subsequence, true);
      yield subsequence;
    }
  }
};

/**
 * Yields all the permutations of the given array of items.
 *
 * @generator
 * @param {Array} items An array of items to use to yield permutations.
 * @param {boolean} yieldCopy True if the yielded permutation should be a copy (default) or
 *                            the internal array used during the generation of the current permutation.
 * @yields {Array} The next permutation.
 */
export const yieldPermutations = function* (items, yieldCopy = true) {
  const currentPermutationPrefix = [];
  const currentPermutationIndicesMap = {};
  const permute = function* () {
    if (currentPermutationPrefix.length === items.length) {
      yield yieldCopy
        ? arrayOrArrayLike(currentPermutationPrefix)
        : currentPermutationPrefix;
    } else {
      for (let i = 0; i < items.length; i++) {
        if (currentPermutationIndicesMap[i]) {
          continue;
        }
        currentPermutationPrefix.push(items[i]);
        currentPermutationIndicesMap[i] = true;
        yield* permute();
        delete currentPermutationIndicesMap[i];
        currentPermutationPrefix.pop();
      }
    }
  };
  yield* permute();
};
