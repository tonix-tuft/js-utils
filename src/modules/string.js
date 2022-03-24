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
 * Utility functions for working with strings.
 */

import { isArray } from "./core";

/**
 * Escapes special characters for a JS regex.
 *
 * @see https://stackoverflow.com/questions/3115150/how-to-escape-regular-expression-special-characters-using-javascript#answer-9310752
 *
 * @param {string} text The string to escape.
 * @return {string} The same string with special regex characters escaped.
 */
export function escapeRegExp(text) {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}

/**
 * Trim characters from the beginning and end of a string.
 *
 * @param {string} str The string.
 * @param {string} characterMask Character mask.
 * @param {Object} options Options.
 * @param {Object.boolean} options.shouldTrimLeft "true" to trim left (defaults to "true" if omitted).
 * @param {Object.boolean} options.shouldTrimRight "true" to trim right (defaults to "true" if omitted).
 * @return {string} The trimmed string.
 */
export function trimCharacterMask(str, characterMask, options = {}) {
  if (typeof characterMask === "undefined") {
    characterMask = " ";
  }
  const escapedCharacterMask = escapeRegExp(characterMask);

  const shouldTrimLeft =
    typeof options.shouldTrimLeft === "undefined" || options.shouldTrimLeft;
  const shouldTrimRight =
    typeof options.shouldTrimRight === "undefined" || options.shouldTrimRight;

  const regexParts = [];
  if (shouldTrimLeft) {
    regexParts[regexParts.length] = "^[" + escapedCharacterMask + "]+";
  }
  if (shouldTrimRight) {
    regexParts[regexParts.length] = "[" + escapedCharacterMask + "]+$";
  }
  const regex = new RegExp(regexParts.join("|"), "gm");
  return str.replace(regex, "");
}

/**
 * Trim characters from the beginning and end of a string using an array
 * of regex characters.
 *
 * @param {string} str The string.
 * @param {string} regexCharacters Regex characters.
 * @param {string} additionalModifiers Additional regex modifiers.
 * @return {string} The trimmed string.
 */
export function trimCharacterRegex(str, regexCharacters, additionalModifiers) {
  if (typeof regexCharacters === "undefined") {
    regexCharacters = ["\\s"];
  }
  additionalModifiers = additionalModifiers || "";
  const regex = new RegExp(
    "(^(" +
      regexCharacters.join("|") +
      ")+)|((" +
      regexCharacters.join("|") +
      ")+$)",
    "g" + additionalModifiers
  );
  return str.replace(regex, "");
}

/**
 * Alias of "trimCharacterMask".
 * Trim characters from the beginning and end of a string.
 *
 * @param {string} str The string.
 * @param {string} characterMask Character mask.
 * @return {string} The trimmed string.
 */
export function trim(str, characterMask) {
  return trimCharacterMask(str, characterMask);
}

/**
 * Trim characters from the beginning of a string.
 *
 * @param {string} str The string.
 * @param {string} characterMask Character mask.
 * @return {string} The left-trimmed string.
 */
export function trimLeft(str, characterMask) {
  return trimCharacterMask(str, characterMask, {
    shouldTrimLeft: true,
    shouldTrimRight: false,
  });
}

/**
 * Trim characters from the end of a string.
 *
 * @param {string} str The string.
 * @param {string} characterMask Character mask.
 * @return {string} The right-trimmed string.
 */
export function trimRight(str, characterMask) {
  return trimCharacterMask(str, characterMask, {
    shouldTrimLeft: false,
    shouldTrimRight: true,
  });
}

/**
 * Concats the values of an array with an outer separator using an inner separator
 * for first nesting level arrays.
 *
 * E.g.:
 *
 *     concatWithInnerOuterSeparators(["a", "value", ["with", "nested", "value"], "etc"], " # ", " $ ")
 *     // Returns:
 *     "a # value # with $ nested $ value # etc"
 *
 * @param {Array<string>|Array<Array<string>>} arrayToConcat An array of strings or arrays or strings.
 * @param {string} outerSeparator Outer separator.
 * @param {string} innerSeparator Inner separator.
 * @return {string} The concatenated string.
 */
export function concatWithInnerOuterSeparators(
  arrayToConcat,
  outerSeparator = " ",
  innerSeparator = " "
) {
  const toConcatFinally = [];
  for (const value of arrayToConcat) {
    if (isArray(value)) {
      toConcatFinally[toConcatFinally.length] = trim(
        value.join(innerSeparator),
        innerSeparator
      );
    } else {
      toConcatFinally[toConcatFinally.length] = value;
    }
  }
  const ret = trim(toConcatFinally.join(outerSeparator), outerSeparator);
  return ret;
}

/**
 * Returns an array of options with a value and a label string.
 *
 * @param {Object} obj An object with parameters.
 * @param {Object[]} obj.arrayOfObjects An array of objects.
 * @param {string[]|Array.<string|string[]>} obj.concatObjectProps Properties, keys of each object to use for the label
 *                                                                 and to concat with "outerSeparator".
 *                                                                 A nested array of properties can be used to specify an inner
 *                                                                 part of the label to concat using the "innerSeparator".
 * @param {string} obj.valueProp Name of the property which value has to be used for the value property
 *                               of the returned array of objects.
 * @param {string} obj.outerSeparator Outer separator.
 * @param {string} obj.innerSeparator Inner separator.
 * @return {Object[]} Array of objects, each object with two properties:
 *
 *                        - "value": The value of the object;
 *                        - "label": The label of the object.
 *
 */
export function optionsValueLabel({
  arrayOfObjects,
  concatObjectProps,
  valueProp = "id",
  outerSeparator = " ",
  innerSeparator = " ",
}) {
  const options = [];
  for (const obj of arrayOfObjects) {
    const arrayToConcat = [];
    for (const prop of concatObjectProps) {
      if (isArray(prop)) {
        arrayToConcat[arrayToConcat.length] = prop.map(
          propName => obj[propName]
        );
      } else {
        arrayToConcat[arrayToConcat.length] = obj[prop];
      }
    }
    options[options.length] = {
      value: obj[valueProp],
      label: concatWithInnerOuterSeparators(
        arrayToConcat,
        outerSeparator,
        innerSeparator
      ),
    };
  }
  return options;
}

/**
 * Tests if a string starts with another
 *
 * @param {string} haystack The haystack string.
 * @param {string} needle The needle string.
 * @return {boolean} True if the haystack string starts with needle, false otherwise.
 */
export function startsWith(haystack, needle) {
  return haystack.indexOf(needle, 0) === 0;
}

/**
 * Makes the first character of the given string uppercase.
 *
 * @param {string} string A string.
 * @return {string} The string with its first character made uppercase.
 */
export function ucaseFirst(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

/**
 * Reverses a string.
 *
 * @param {string} string A string to reverse.
 * @return {string} The reversed string.
 */
export function reverseString(string) {
  return string.split("").reverse().join("");
}

/**
 * Given an integer, returns a string containing the same integer with additional thousands separators.
 *
 * @param {number} num An integer.
 * @param {string} [sep] The thousands separator to use.
 * @return {string} The same integer with thousands separators.
 */
export function separateIntThousands(num, sep = ",") {
  return num
    .toString()
    .split("")
    .reverse()
    .map((d, i, a) =>
      (i + 1) % 3 === 0 && i !== a.length - 1 ? `${sep}${d}` : d
    )
    .reverse()
    .join("");
}
