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
 * Public API exposed to client code.
 */

export {
  config,
  isObjectEmpty,
  isObject,
  isPlainObject,
  isArray,
  isEmpty,
  isEmptyOr0,
  getGlobalObject,
  uniqueId,
  deepArrayCompare,
  deepObjectCompare,
  nestedObjectConstructValue,
  cloneDeeplyJSON,
  isReferenceType,
  isPrimitiveType,
  hasCyclicReference,
  typeToStr,
  cloneObjDeeply,
  deepObjectExtend,
  deepObjectCloningExtend,
  extend,
  extendDecorate,
  shallowExtend,
  includesTypeCoercion,
  nestedPropertyValue,
  getNestedPropertyValue,
  hasNestedPropertyValue,
  setNestedPropertyValue,
  isUndefined,
  isInt,
  ctypeDigit,
  isIntegerOrIntegerStr,
  isCallable,
  findIndex,
  firstPropValue,
  isStrictlyTrue,
  isTruthy,
  allTruthy,
  allNotUndefined,
  isJSONString,
  noOpFn,
  is,
  shallowEqual,
  objectPropEqual,
  partialShallowEqual,
  shallowObjectDiff,
  nestedMapSet,
  nestedMapHas,
  nestedMapGet,
  nestedTreeMapSet,
  nestedTreeMapHas,
  nestedTreeMapGet,
  mapYield,
  str,
  mapObject,
  mapToObject,
  propSelection,
  prototypeChainProperties,
  prop,
  defineProperty,
  completeObjectAssign,
} from "./modules/core";
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
  converge,
  execIfPOJOHas,
  execWithExistentProps,
  forGen,
  flatten,
  flattenDeep,
  cartesianProduct,
  identityFn,
  identityArgsFn,
  chain,
} from "./modules/fn";
export {
  stringHashArray,
  hashString,
  onePassStringHash,
  intSumHash,
} from "./modules/hash";
export {
  timeout,
  minDelayPromise,
  maxDelayFallbackPromise,
  applyAsync,
  composeAsync,
  asSoonAtLeastSomeFulfilled,
} from "./modules/promise";
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
  cursorFocus,
  parseQueryStringArgsMultiDim,
  detectWrapped,
  maxNestingLevel,
  getScrollableAncestor,
  smoothScrollToTop,
  downloadFile,
} from "./modules/web";
export {
  randomInt,
  randomFloat,
  randomStr,
  randomString,
  randomDifferentFromValue,
  randomArrayShuffle,
  uuid,
  noncanonicalUUID,
} from "./modules/rand";
export {
  time,
  msToTime,
  millisecToSec,
  secondsToTimeString,
} from "./modules/time";
export {
  escapeRegExp,
  trimCharacterMask,
  trimCharacterRegex,
  trim,
  trimLeft,
  trimRight,
  concatWithInnerOuterSeparators,
  optionsValueLabel,
  startsWith,
  ucaseFirst,
  reverseString,
  separateIntThousands,
} from "./modules/string";
export { googleMapBestZoomLevelFromBounds } from "./modules/google";
export { delay, debounce, throttle } from "./modules/callback";
export { basename, pathinfo, filenameExtension, dirname } from "./modules/path";
export { b2d, d2b } from "./modules/convert";
export {
  turnNthBitOff,
  turnNthBitOn,
  toggleNthBit,
  checkNthBitOn,
} from "./modules/bitwise";
export {
  getLuminance,
  intToRGBHexString,
  colorFromString,
} from "./modules/color";
export {
  yieldCombinationsWithoutRepetition,
  uniqueProgressiveIncrementalCombinations,
  yieldUniqueProgressiveIncrementalCombinations,
  yieldAllSubsequences,
  yieldUniqueSubsequences,
  yieldPermutations,
} from "./modules/combinatorics";
export { round, sum, intDiv, isEven, isOdd, proportion } from "./modules/math";
export {
  unshiftArray,
  cloneArray,
  arraySliceFromValueToValue,
  areArrayItemsAllCoercibleToNumber,
  arrayOrArrayLike,
  lastOfArray,
  firstOfArray,
  arrayFindReverse,
  arrayMax,
  arrayMin,
  sortNums,
} from "./modules/array";
export { objectMin } from "./modules/object";
export {
  mean,
  median,
  minAbsDeviationFromValue,
  minAbsDeviationFromExcludedValue,
} from "./modules/stats";
export {
  clampLat,
  wrapLng,
  normalizeLat,
  normalizeLng,
} from "./modules/map-coordinates";
export { xrange } from "./modules/iterator";
export { isValidDate, isValidDateTimeStr, utcDate } from "./modules/date";
export { filterInt, filterFloat } from "./modules/constraint";
export { isValidHttpUrl } from "./modules/validate";
