/*
 * Copyright (c) 2020 Anton Bagdatyev (Tonix-Tuft)
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
 * CSS-in-JS utility functions.
 */

import { prefix } from "inline-style-prefixer";
import { cssifyObject, resolveArrayValue } from "css-in-js-utils";
import { isArray } from "./core";
import { gsap } from "gsap";

/**
 * Parses CSS text and converts it to a CSS-in-JS object.
 *
 * @see https://stackoverflow.com/questions/8987550/convert-css-text-to-javascript-object#answer-43012849
 *
 * @param {string} cssText CSS string to parse;
 * @return {Object} An object with three properties:
 *
 *                      - cssText: The given CSS text;
 *                      - ruleName: The CSS rule name (if any);
 *                      - style: The CSS-in-JS style object.
 *
 */
export function parseCSSText(cssText) {
  cssText = cssText || "";
  const cssTxt = cssText.replace(/\/\*(.|\s)*?\*\//g, " ").replace(/\s+/g, " ");
  const style = {},
    // eslint-disable-next-line no-sparse-arrays
    [, ruleName, rule] = cssTxt.match(/ ?(.*?) ?{([^}]*)}/) || [, , cssTxt];
  const cssToJs = s =>
    s.replace(/\W+\w/g, match => match.slice(-1).toUpperCase());
  const properties = rule
    .split(";")
    .map(o => o.split(":").map(x => x && x.trim()));
  for (const [property, value] of properties) {
    style[cssToJs(property)] = value;
  }
  !style[""] && delete style[""];
  return { cssText, ruleName, style };
}

/**
 * Returns a style POJO from the given styles with autoprefixing.
 *
 * @param {...Object} styles The styles defined as objects, with keys identifying
 *                            the style properties and values identifying the style values.
 *                            Subsequent style objects will override the style property value
 *                            of the previous style object for the same key.
 * @return {Object} A new POJO style object for the given styles.
 */
export function stylePOJO(...styles) {
  const prefixedStyles = prefix(Object.assign({}, ...styles));
  return Object.keys(prefixedStyles).reduce((carry, currentCSSJSProp) => {
    carry[currentCSSJSProp] = isArray(prefixedStyles[currentCSSJSProp])
      ? resolveArrayValue(currentCSSJSProp, prefixedStyles[currentCSSJSProp])
      : prefixedStyles[currentCSSJSProp];
    return carry;
  }, {});
}

/**
 * Returns an inline style string for the given styles with autoprefixing.
 *
 * @param {...Object} styles The styles defined as objects, with keys identifying
 *                            the style properties and values identifying the style values.
 *                            Subsequent style objects will override the style property value
 *                            of the previous style object for the same key.
 * @return {string} The style string.
 */
export function styleStr(...styles) {
  const POJOStyles = stylePOJO(...styles);
  const finalStyleStr = cssifyObject(POJOStyles);
  return finalStyleStr;
}

/**
 * Adds inline styles to an element with autoprefixing.
 *
 * @param {Element} element The DOM element to style.
 * @param {...Object} styles The styles defined as objects, with keys identifying
 *                            the style properties and values identifying the style values.
 *                            Subsequent style objects will override the style property value
 *                            of the previous style object for the same key.
 * @return {void}
 */
export function style(element, ...styles) {
  const finalStyles = styleStr(...styles);
  element.style.cssText = `${
    element.style.cssText ? `${element.style.cssText} ` : ""
  } ${finalStyles}`;
}

/**
 * Applies transform rules to an element with autoprefixing.
 *
 * @see https://gist.github.com/lunelson/7d83ca0c8bdfab170dd3
 *
 * @param {Element} element The DOM element to style.
 * @param {...Object} transforms The transforms defined as objects, with keys identifying
 *                                the transform property to apply and values identifying
 *                                the transform property value.
 *                                The transforms objects MUST have the properties
 *                                specified in this GreenSock cheat sheet:
 *
 *                                    https://gist.github.com/lunelson/7d83ca0c8bdfab170dd3
 *
 *                                Subsequent transform objects will override the transform property value
 *                                of the previous transform object for the same key.
 */
export function transform(element, ...transforms) {
  gsap.set(element, Object.assign({}, ...transforms));
}
