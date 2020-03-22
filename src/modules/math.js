/*
 * Copyright (c) 2020 Anton Bagdatyev (Tonix)
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
