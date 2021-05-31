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
 * Tests if the given value is a valid date.
 *
 * @param {*} value The value to test.
 * @return {boolean} True if it is a valid date, false otherwise.
 */
export function isValidDate(value) {
  return (
    Object.prototype.toString.call(value) === "[object Date]" &&
    !isNaN(value.getTime())
  );
}

/**
 * Tests if the given string is a valid datetime string (e.g. in ISO "YYYY-MM-DD HH:ii:ss" format).
 *
 * @param {string} str The given string.
 * @return {boolean} True if it is a valid datetime string, false otherwise.
 */
export function isValidDateTimeStr(str) {
  return isValidDate(new Date(str));
}
