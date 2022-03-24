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

import { isIntegerOrIntegerStr } from "./core";
import { intDiv } from "./math";

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

/**
 * Converts seconds to a `minutes:seconds` or `hours:minutes:seconds` time string
 * (if the second parameter is an object with `includeHours` set to a truthy value),
 * e.g. `123` becomes `"02:03"`, or `"00:02:03"` if `includeHours` is truthy.
 *
 * @param {number} secs The number of seconds.
 * @param {Object} options Options.
 * @param {Object.boolean} options.includeHours "true" to include hours (defaults to "false" if omitted).
 * @return {string} The time string.
 */
export const secondsToTimeString = (secs, { includeHours = false } = {}) => {
  if (!secs || !isIntegerOrIntegerStr(secs)) {
    return includeHours ? "00:00:00" : "00:00";
  }
  let hours = "";
  let minutes = intDiv(secs, 60);
  if (includeHours) {
    hours = `${(intDiv(secs, 60 * 60) + "").padStart(2, "0")}:`;
    minutes = minutes % 60;
  }
  minutes += "";
  const seconds = (secs % 60) + "";
  return `${hours}${minutes.padStart(2, "0")}:${seconds.padStart(2, "0")}`;
};
