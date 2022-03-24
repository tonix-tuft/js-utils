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
 * Constraints and filtering utility functions.
 */

/**
 * Filters the given string so that it only includes digit (0-9)
 * and an optional leading sign ("+", which is removed if present, or "-"),
 * i.e. represents a valid integer parsable with "Number.parseInt()".
 *
 * @param {string} str The input string.
 * @return {string} The valid input string or an empty string if there isn't any digit.
 */
export function filterInt(str) {
  let filtered = str.replace(/[^0-9]/g, "");
  filtered = filtered.replace(/^[0]+([1-9])/, "$1");
  filtered = filtered.replace(/^[0]+$/, "0");
  if (str && filtered.length && str[0] === "-") {
    filtered = `-${filtered}`;
  }
  return filtered;
}

/**
 * Filters the given string so that it only includes digits (0-9), a decimal separator ("." character)
 * and an optional leading sign ("+", which is removed if present, or "-"),
 * i.e. represents a valid float parsable with "Number.parseFloat()".
 *
 * @param {string} str The input string.
 * @return {string} The valid float string or an empty string if there isn't any digit or decimal separator.
 *                  If there isn't any digit in the input string and there is a decimal separator ("." character),
 *                  the returned string will be "0.", i.e. a parsable "0." string.
 */
export function filterFloat(str) {
  let filtered = str.replace(/[^0-9.]/g, "");
  const regex = /(\..*)\./g;
  const replace = "$1";
  do {
    filtered = filtered.replace(regex, replace);
  } while (filtered != filtered.replace(regex, replace));
  filtered === "." ? (filtered = "0.") : filtered;
  filtered = filtered.replace(/^[0]+([1-9])/, "$1");
  filtered = filtered.replace(/^[0]+($|\.)/, "0$1");
  if (str && filtered.length && str[0] === "-") {
    filtered = `-${filtered}`;
  }
  return filtered;
}
