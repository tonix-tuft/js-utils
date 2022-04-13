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

import { trim } from "./string";

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

/**
 * Returns a UTC datetime in ISO `YYYY-MM-DD HH:ii:ss` format.
 *
 * @param {Object} [options] An optional object of options.
 * @param {boolean} [options.Y] True to return the year of the UTC datetime. Defaults to true.
 * @param {boolean} [options.m] True to return the month of the UTC datetime. Defaults to true.
 * @param {boolean} [options.d] True to return the day of the UTC datetime. Defaults to true.
 * @param {boolean} [options.H] True to return the hours of the UTC datetime. Defaults to true.
 * @param {boolean} [options.i] True to return the minutes of the UTC datetime. Defaults to true.
 * @param {boolean} [options.s] True to return the seconds of the UTC datetime. Defaults to true.
 * @param {Date|string} [options.date] A date or a string that will be passed to the `Date` constructor
 *                                     which represents the date on which to compute and return the UTC date.
 * @return {string} The UTC datetime.
 */
export const utcDate = ({
  Y = true,
  m = true,
  d = true,
  H = true,
  i = true,
  s = true,
  date = void 0,
} = []) => {
  const finalDate = date ? new Date(date) : new Date();
  const year = finalDate.getUTCFullYear();
  const month = (finalDate.getUTCMonth() + 1 + "").padStart(2, "0");
  const day = (finalDate.getUTCDate() + "").padStart(2, "0");
  const hours = (finalDate.getUTCHours() + "").padStart(2, "0");
  const minutes = (finalDate.getUTCMinutes() + "").padStart(2, "0");
  const seconds = (finalDate.getUTCSeconds() + "").padStart(2, "0");

  const UTCDate = trim(
    trim(
      `${Y ? year : ""}-${m && (Y || d || (!Y && !d)) ? month : ""}-${
        d ? day : ""
      }`,
      " -"
    ) +
      " " +
      trim(
        `${H ? hours : ""}:${i && (H || s || (!H && !s)) ? minutes : ""}:${
          s ? seconds : ""
        }`,
        " :"
      ),
    " "
  );

  let finalUTCDate = UTCDate.replace("--", "-");
  finalUTCDate = finalUTCDate.replace("::", ":");

  return finalUTCDate;
};
