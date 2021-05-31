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
 * Time-related utility functions.
 */

/**
 * Returns the current Unix time in seconds.
 *
 * @return {number} Current Unix time in seconds.
 */
export function time() {
  const d = new Date();
  const seconds = Math.round(d.getTime() / 1000);
  return seconds;
}

/**
 * Returns the time string approximated to the nearest microsecond
 * corresponding the given Unix timestamp in milliseconds
 * in the format "HH:mm:ss.ms".
 *
 * @param {number} [ms] The time in microseconds to convert into a string.
 *                      If omitted, the current time will be used.
 * @return {string} The time string.
 */
export function msToTime(ms) {
  const date = new Date(ms || new Date().getTime());
  const isoDate = new Date(
    date.getTime() - date.getTimezoneOffset() * 60000
  ).toISOString();
  return isoDate.slice(11, -1);
}

/**
 * Converts milliseconds to seconds.
 *
 * @param {number} millisec Number of milliseconds.
 * @return {number} The milliseconds in seconds.
 */
export function millisecToSec(millisec) {
  return millisec * 0.001;
}
