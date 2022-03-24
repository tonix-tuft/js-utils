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
 * Utility functions related to the coordinates of a map.
 */

/**
 * Clamps a latitude value so that it is always between -90 and 90.
 *
 * Latitude ranges between -90 and 90 degrees, inclusive.
 * Values above or below this range will be clamped to the range [-90, 90].
 * This means that if the value specified is less than -90, it will be set to -90.
 * And if the value is greater than 90, it will be set to 90.
 *
 * @param {number|string} lat Latitude. Either a number or a string which can be casted to a number.
 * @return {number} Latitude, clamped.
 */
export const clampLat = lat => Number(lat < -90 ? -90 : lat > 90 ? 90 : lat);

/**
 * Wraps a longitude value so that it is always between -180 and 180.
 *
 * Longitude ranges between -180 and 180 degrees, inclusive.
 * Values above or below this range will be wrapped so that they fall within the range.
 * For example, a value of -190 will be converted to 170.
 * A value of 190 will be converted to -170.
 * This reflects the fact that longitudes wrap around the globe.
 *
 * @param {number|string} lng Longitude. Either a number or a string which can be casted to a number.
 * @return {number} lng Longitude, wrapped.
 */
export const wrapLng = lng => {
  lng = Number(lng);
  while (lng > 180) {
    lng -= 360;
  }
  while (lng < -180) {
    lng += 360;
  }
  return lng;
};

/**
 * Normalizes a latitude so that it is within the range [0, 180].
 *
 * 1. normalizeLat(90) === 0;
 * 2. normalizeLat(0) === 90;
 * 3. normalizeLat(-90) === 180;
 *
 * @param {number|string} lat Latitude. Either a number or a string which can be casted to a number.
 * @return {number} Latitude, normalized.
 */
export const normalizeLat = lat => {
  lat = clampLat(lat);
  if (lat >= 0) {
    // 1. + 2.
    return 90 - lat;
  } else {
    // 3.
    return 90 + Math.abs(lat);
  }
};

/**
 * Normalizes a longitude so that it is within the range [0, 360].
 *
 * 1. normalizeLng(-180) === 0;
 * 2. normalizeLng(0) === 180;
 * 3. normalizeLng(180) === 360;
 *
 * @param {number} lng Longitude. Either a number or a string which can be casted to a number.
 * @return {number} Longitude, normalized.
 */
export const normalizeLng = lng => {
  lng = wrapLng(lng);
  return lng + 180;
};
