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
 * Statistics-related utility functions.
 */

import { sum, intDiv, isOdd } from "./math";
import { sortNums } from "./array";

/**
 * Computes the mean of the given numbers.
 *
 * @param {...number} numbers The numbers.
 * @return {number} The mean.
 */
export function mean(...numbers) {
  return sum(...numbers) / numbers.length;
}

/**
 * Computes the median of the given numbers.
 *
 * @param {...number} numbers The numbers.
 * @return {number} The median value.
 */
export function median(...numbers) {
  const sorted = sortNums(numbers);
  const middleIndex = intDiv(sorted.length, 2);
  return isOdd(sorted.length)
    ? sorted[middleIndex]
    : mean(sorted[middleIndex - 1], sorted[middleIndex]);
}

/**
 * Computes the min deviation from a value.
 *
 * @param {number} value A value.
 * @return {(...numbers: number[]) => number} A function receiving the numbers to use to compute the minimum deviation
 *                                            from "value".
 */
export const minAbsDeviationFromValue = value => (...numbers) => {
  let minAbsDeviation = Infinity;
  numbers.map(num => {
    const deviation = Math.abs(num - value);
    if (deviation < minAbsDeviation) {
      minAbsDeviation = deviation;
    }
  });
  return minAbsDeviation;
};

/**
 * Computes the min deviation from a value excluding that value from the numbers received.
 *
 * @param {number} value A value.
 * @return {(...numbers: number[]) => number} A function receiving the numbers to use to compute the minimum deviation
 *                                            from "value" exluding "value".
 */
export const minAbsDeviationFromExcludedValue = value => (...numbers) =>
  minAbsDeviationFromValue(value)(...numbers.filter(num => num !== value));
