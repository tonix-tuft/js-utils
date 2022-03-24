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
 * Bitwise utility functions.
 */

/**
 * Turns nth bit off.
 *
 * @param {number} num A number.
 * @param {number} nth Nth bit to turn off (starting from 1 for the rightmost bit).
 * @return {number} New number with the nth bit turned off.
 */
export const turnNthBitOff = (num, nth) => num & ~(1 << (nth - 1));

/**
 * Turns nth bit on.
 *
 * @param {number} num A number.
 * @param {number} nth Nth bit to turn on (starting from 1 for the rightmost bit).
 * @return {number} New number with the nth bit turned off.
 */
export const turnNthBitOn = (num, nth) => num | (1 << (nth - 1));

/**
 * Toggles nth bit.
 *
 * @param {number} num A number.
 * @param {number} nth Nth bit to toggle (starting from 1 for the rightmost bit).
 * @return {number} New number with the nth bit toggled.
 */
export const toggleNthBit = (num, nth) => num ^ (1 << (nth - 1));

/**
 * Checks if nth bit is on.
 *
 * @param {number} num A number.
 * @param {number} nth Nth bit to check.
 * @param {number} 0 if the nth bit is off, otherwise a number greater than 0 if the nth bit is on.
 */
export const checkNthBitOn = (num, nth) => num & (1 << (nth - 1));
