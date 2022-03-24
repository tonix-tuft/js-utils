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
 * Utility functions related to iterators, generators and iterations.
 */

/**
 * Yields all the numbers of the specified range
 * (including "start" and "limit" if they fall in the range while stepping
 * with "step").
 *
 * @generator
 * @param {number} start An int specifying the start of the range.
 * @param {number} limit An int specifying the limit of the range.
 * @param {number} step An int specifying the step to take within each value of the range.
 * @yield {number} The next number of the range.
 */
export function* xrange(start, limit, step = 1) {
  if (start < limit) {
    if (step <= 0) {
      throw new RangeError("Step must be a positive int greater than 0.");
    }
    for (let i = start; i <= limit; i += step) {
      yield i;
    }
  } else {
    if (step >= 0) {
      throw new RangeError("Step must be a negative int greater than 0.");
    }
    for (let i = start; i >= limit; i += step) {
      yield i;
    }
  }
}
