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
 * Public API exposed to client code.
 */

export {
  config,
  isObjectEmpty,
  isObject,
  isEmpty,
  isEmptyOr0,
  uniqueId,
  deepArrayCompare,
  deepObjectCompare,
  nestedObjectConstructValue,
  unshiftArray,
  cloneDeeplyJSON,
  isReferenceType,
  isPrimitiveType,
  hasCyclicReference,
  typeToStr,
  cloneObjDeeply,
  deepObjectExtend,
  deepObjectCloningExtend,
  extend,
  cloneArray,
  arraySliceFromValueToValue,
  includesTypeCoercion,
  isArray,
  areArrayItemsAllCoercibleToNumber,
  nestedPropertyValue,
  hasNestedPropertyValue,
  setNestedPropertyValue,
  arrayOrArrayLike,
  isUndefined,
  lastOfArray,
  firstOfArray,
  isInt,
  ctypeDigit,
  isIntegerOrIntegerStr,
  isCallable,
  findIndex,
  firstPropValue,
  isStrictlyTrue,
  arrayFindReverse,
  isTruthy,
  allTruthy,
  allNotUndefined,
  isJSONString,
  noOpFn,
  is,
  shallowEqual,
  partialShallowEqual,
  shallowObjectDiff,
  nestedMapHas,
  nestedMapSet,
  mapYield,
  str,
  mapObject,
  propSelection
} from "./core";
export {
  _,
  proceedCallingFn,
  curry,
  POJOCurry,
  compose,
  pipe,
  pick,
  liftBinaryFn,
  juxt,
  converge
} from "./fn";
export { stringHashArray, hashString, onePassStringHash } from "./hash";
export {
  timeout,
  minDelayPromise,
  maxDelayFallbackPromise,
  applyAsync,
  composeAsync
} from "./promise";
export {
  buildQueryString,
  formData,
  xhr,
  checkNetwork,
  waitNetwork,
  setCookie,
  getCookie,
  unsetCookie,
  isInViewport,
  isScrolledIntoView,
  hasVerticalScrollbar,
  hasHorizontalScrollbar,
  elementUniqueId,
  getElementComputedStyle,
  elementInnerDimensions,
  countTextareaLines,
  isScrollOnBottom,
  getVerticalScrollBarWidth,
  isEllipsisActive,
  copyTextToClipboard,
  rAFLooper,
  nestedRAF,
  getRawURIFragment,
  getDecodedURIFragment,
  appendEncodedJSONFragmentToURI,
  getDecodedJSONFromFragmentURI,
  getQueryStringArgsMultiDim,
  cursorFocus
} from "./web";
export { randomInt, randomStr, randomDifferentFromValue } from "./rand";
export { time, msToTime, millisecToSec } from "./time";
export {
  escapeRegExp,
  trimCharacterMask,
  trimCharacterRegex,
  trim,
  trimLeft,
  trimRight,
  concatWithInnerOuterSeparators,
  optionsValueLabel
} from "./string";
export { googleMapBestZoomLevelFromBounds } from "./google";
export { delay, debounce, throttle } from "./callback";
export { basename, pathinfo, filenameExtension, dirname } from "./path";
export { b2d, d2b } from "./convert";
export {
  turnNthBitOff,
  turnNthBitOn,
  toggleNthBit,
  checkNthBitOn
} from "./bitwise";
export { getLuminance } from "./color";
export {
  yieldCombinationsWithoutRepetition,
  uniqueProgressiveIncrementalCombinations,
  yieldUniqueProgressiveIncrementalCombinations,
  yieldAllSubsequences,
  yieldUniqueSubsequences
} from "./combinatorics";
export { round } from "./number";
