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
 * Mathematical utility functions.
 */

/**
 * Rounds a number.
 *
 * @param {number} number The number to round.
 * @param {number} precision The decimal precision.
 * @return {number} The rounded number.
 */
export function round(number, precision = 0) {
  const factor = 10 ** precision;
  return Math.round(number * factor) / factor;
}

/**
 * Sums two or more numbers.
 *
 * @param {...number} numbers The numbers to sum.
 * @return {number} The sum.
 */
export function sum(...numbers) {
  return numbers.reduce((carry, num) => carry + num);
}

/**
 * Integer division (without decimal part).
 *
 * @param {number} num A number.
 * @param {number} divideBy The number by which to divide "num".
 * @return {number} The result of the integer division.
 */
export function intDiv(num, divideBy) {
  return Math.floor(num / divideBy);
}

/**
 * Tests if a number is even.
 *
 * @param {number} num A number.
 * @return {boolean} True if even, false if odd.
 */
export function isEven(num) {
  return num % 2 === 0;
}

/**
 * Tests if a number is odd.
 *
 * @param {number} num A number.
 * @return {boolean} True if odd, false if even.
 */
export function isOdd(num) {
  return !isEven(num);
}

/**
 * Converts a source value of a source range to a value that is proportional
 * in another destination range.
 *
 * @param {number[]} sourceTuple The source range tuple, i.e. a tuple of two values, the starting value of the range at index 0 and the ending value of the range at index 1,
 *                               respectively.
 *                               This function assumes that both the starting and ending values are positive numbers (the starting value can be 0).
 * @return {(destRange: number[]) => (sourceValue: number) => number} A function receiving the destination range tuple as argument (having the same shape as the source range)
 *                                                                    returning a function taking the source value as argument returning the value proportional
 *                                                                    in the destination range.
 */
export const proportion = ([sourceFrom, sourceTo]) => ([
  destFrom,
  destTo,
]) => sourceValue =>
  (sourceValue - sourceFrom) * ((destTo - destFrom) / (sourceTo - sourceFrom)) +
  destFrom;
