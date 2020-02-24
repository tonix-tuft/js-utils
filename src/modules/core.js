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
 * Core utility functions.
 */

/**
 * Optional configuration with useful properties.
 *
 * @type {Object}
 */
export const config = {
  uniqueIdPrefix: "",
  elementUniqueIdPrefix: "",
  checkNetworkURI: null
};

/**
 * Tests if an object is empty.
 *
 * @param {Object} obj The object to test.
 * @return {boolean} "true" if the given object is empty (does not have own properties), "false" otherwise.
 */
export function isObjectEmpty(obj) {
  for (const prop in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, prop)) {
      return false;
    }
  }
  return true;
}

/**
 * @type {string}
 */
const objPrototypeToString = Object.prototype.toString.call({});

/**
 * Tests if a variable is an object.
 *
 * @param {*} obj The variable to test.
 * @return {boolean} "true" if "obj" is indeed an object, "false" otherwise.
 */
export const isObject = function(obj) {
  return objPrototypeToString === Object.prototype.toString.call(obj);
};

/**
 * Tests if a variable is empty returning true for empty strings and empty arrays.
 *
 * @param {*} data The variable to test.
 * @return {boolean} True if the variable is empty, false otherwise.
 */
export function isEmpty(data) {
  return !data || data.length === 0;
}

/**
 * Tests if a variable is empty or 0 ("0" string) returning true for empty strings,
 * empty arrays, the "0" string and empty values.
 *
 * @param {*} data The variable to test.
 * @return {boolean} True if the variable is empty or "0", false otherwise.
 */
export function isEmptyOr0(data) {
  return !data || data === "0" || data.length === 0;
}

/**
 * @type {number}
 */
let uniqueIdCounter = 0;

/**
 * Generates a unique ID which can be used as an "id" attribute.
 *
 * @return {string} The unique ID.
 */
export function uniqueId() {
  uniqueIdCounter++;
  const uniqueId = config.uniqueIdPrefix + uniqueIdCounter;
  return uniqueId;
}

/**
 * Compares two arrays deeply.
 *
 * @param {Array} arr1 First array.
 * @param {Array} arr2 Second array.
 * @return {boolean} True if they are equal (same indexes and same values), false otherwise.
 */
export function deepArrayCompare(arr1, arr2) {
  if (arr1.length != arr2.length) {
    return false;
  }
  const toString = Object.prototype.toString,
    objectToStringStr = toString.call({});
  const arrayToStringStr = toString.call([]);
  for (let i = 0; i < arr1.length; i++) {
    if (!(i in arr2)) {
      return false;
    } else if (objectToStringStr === toString.call(arr1[i])) {
      if (
        objectToStringStr !== toString.call(arr2[i]) ||
        // eslint-disable-next-line @typescript-eslint/no-use-before-define
        !deepObjectCompare(arr1[i], arr2[i])
      ) {
        return false;
      }
    } else if (arrayToStringStr === toString.call(arr1[i])) {
      if (
        arrayToStringStr !== toString.call(arr2[i]) ||
        !deepArrayCompare(arr1[i], arr2[i])
      ) {
        return false;
      }
    } else {
      if (arr1[i] !== arr2[i]) {
        return false;
      }
    }
  }
  return true;
}

/**
 * Compare two objects deeply.
 *
 * @param {Object} obj1 First object.
 * @param {Object} obj2 Second object.
 * @return {boolean} True if they are equal (same properties and same values), false otherwise.
 */
export function deepObjectCompare(obj1, obj2) {
  const toString = Object.prototype.toString,
    objectToStringStr = toString.call({});
  const arrayToStringStr = toString.call([]);
  for (const property in obj1) {
    if (!(property in obj2)) {
      // `obj2[property]` does not contain the property of `obj1`.
      return false;
    } else if (objectToStringStr === toString.call(obj1[property])) {
      // `obj1[property]` is an object.
      if (
        objectToStringStr !== toString.call(obj2[property]) ||
        !deepObjectCompare(obj1[property], obj2[property])
      ) {
        // `obj2[property]` is not an object or the branches are different.
        return false;
      }
    } else if (arrayToStringStr === toString.call(obj1[property])) {
      // `obj1[property]` is an array.
      if (
        arrayToStringStr !== toString.call(obj2[property]) ||
        !deepArrayCompare(obj1[property], obj2[property])
      ) {
        // `obj2[property]` is not an array or the two objects are different.
        return false;
      }
    } else {
      // `obj1[property]` is not an object and is not an array.
      if (obj1[property] !== obj2[property]) {
        return false;
      }
    }
  }
  // `obj1` equals `obj2` (has the same properties and the same values).
  return true;
}

/**
 * Nests the properties of an object using an array of props definitions and defaults.
 * Returns the leaf.
 * Example:
 *
 *      var obj = {};
 *      var nest = [{a: {}}, {b: {}}, {c: {}}, {d: {}}, {e: {}}, {f: {}}, {g: {}}, {h: {}} ];
 *      var leaf = nestedObjectConstructValue(obj, nest);
 *      leaf.i = 'i';
 *      leaf.l = { m: "m" };
 *      JSON.stringify(obj); // {"a":{"b":{"c":{"d":{"e":{"f":{"g":{"h":{"i":"i","l":{"m":"m"}}}}}}}}}}
 *      nest = nest.concat([ {n: {}}, {o: {}}, {p: {}} ]);
 *      var pLeaf = nestedObjectConstructValue(obj, nest);
 *      pLeaf.q = 'q';
 *      nest = nest.concat([ {q: {}} ]);
 *      nestedObjectConstructValue(obj, nest); // 'q'
 *
 * @param {Object} root The root object.
 * @param {Array} nestedPropsDef The nexted props definitions.
 * @param {boolean} [isRootArrayIfRootFalsy] True if the root should be an array if the first argument "root" is falsy.
 * @return {*} The leaf.
 */
export function nestedObjectConstructValue(
  root,
  nestedPropsDef,
  isRootArrayIfRootFalsy
) {
  root = root || (isRootArrayIfRootFalsy ? [] : {});
  let leaf = root;
  for (let i = 0; i < nestedPropsDef.length; i++) {
    const propDef = nestedPropsDef[i];
    const propKey = Object.keys(propDef)[0];
    const propDefault = propDef[propKey];
    leaf[propKey] = leaf[propKey] || propDefault;
    leaf = leaf[propKey];
  }
  return leaf;
}

/**
 * Clones an object deeply using the JSON API.
 *
 * @param {Object} obj The object to clone.
 * @return {Object} The cloned object.
 */
export function cloneDeeplyJSON(obj) {
  return JSON.parse(JSON.stringify(obj));
}

/**
 * Tests whether the given value is a reference type or not.
 *
 * @param {*} value Any value which can be an object or a primitive type.
 * @return {boolean} True if the given value is a reference type, false otherwise.
 */
export function isReferenceType(value) {
  return new Object(value) === value;
}

/**
 * Tests whether the given value is a primitive type or not.
 *
 * @param {*} value Any value which can be an object or a primitive type.
 * @return {boolean} True if the given value is a primitive type, false otherwise.
 */
export function isPrimitiveType(value) {
  return new Object(value) !== value;
}

/**
 * Checks whether an object has a cyclic reference or not.
 *
 * @param {Object} obj The object to check for a cyclic reference.
 * @return {boolean} True if the object has a cyclic reference, false otherwise.
 */
export function hasCyclicReference(obj) {
  const stackSet = [];
  let detected = false;

  function detect(obj) {
    if (detected) {
      return;
    }

    if (typeof obj !== "object") {
      return;
    }

    const indexOfObj = stackSet.indexOf(obj);
    if (indexOfObj !== -1) {
      detected = true;
      return;
    }

    stackSet.push(obj);
    for (const k in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, k)) {
        detect(obj[k]);
      }
    }

    stackSet.splice(indexOfObj, 1);
    return;
  }
  detect(obj);
  return detected;
}

/**
 * Converts a type to its string representation.
 *
 * @param {*} type A variable.
 * @return {string} The string representation of "type".
 */
export function typeToStr(type) {
  return Object.prototype.toString.call(type);
}

/**
 * Clones an object deeply and returns the clone.
 *
 * @param {Object} object The object to clone.
 * @return {Object} The clone.
 * @throws {Error} If a circular reference if even only one property is of an unkown type
 *                 (this should never happen) or a circular reference is detected.
 */
export function cloneObjDeeply(object) {
  const newObject = new object.constructor();
  for (const prop in object) {
    // If the property is defined on the prototype, ignore it. We don't want to assign it for each clone instance.
    if (!Object.prototype.hasOwnProperty.call(object, prop)) {
      continue;
    }

    const property = object[prop];
    if (isPrimitiveType(property)) {
      newObject[prop] = property;
    } else if (isReferenceType(property)) {
      if (!hasCyclicReference(property)) {
        const clone = cloneObjDeeply(property);
        newObject[prop] = clone;
      } else {
        throw new Error(
          "Circular reference detected inside of property '" +
            prop +
            "' (" +
            typeToStr(property) +
            ") in object (" +
            typeToStr(object) +
            ")"
        );
      }
    } else {
      throw new Error(
        "Oops! Unknown type for property '" +
          prop +
          "' (" +
          typeToStr(property) +
          ") in object (" +
          typeToStr(object) +
          ")"
      );
    }
  }
  return newObject;
}

/**
 * Deep object extension implementation.
 * Nothing is returned, but the destination object will be modified and merged with the source object
 * so that properties of the source object which are objects will recursively merge with the corresponding
 * destination property while the other properties with all the other types will replace the properties of the
 * destination object.
 * Note that this method should not be used for inheritance via the Prototypal Combination Inheritance pattern.
 * Also, this method doesn't perform a deep object cloning, it just extends the destinationObject by adding properties
 * it doesn't have in a deep way.
 *
 * @param {Object} destinationObject The destination object which will be modified and merged with the source object.
 * @param {Object} sourceObject The source object which will be used to extend the destination object.
 * @return {undefined}
 */
export function deepObjectExtend(destinationObject, sourceObject) {
  const toString = Object.prototype.toString,
    objectToStringStr = toString.call({});
  for (const property in sourceObject) {
    if (
      sourceObject[property] &&
      objectToStringStr === toString.call(sourceObject[property])
    ) {
      destinationObject[property] = destinationObject[property] || {};
      deepObjectExtend(destinationObject[property], sourceObject[property]);
    } else {
      destinationObject[property] = sourceObject[property];
    }
  }
}

/**
 * Deep object cloning extension implementation. If the source objects contain a property with a reference type, a clone object
 * of the same type of that property will be created and then merged with the property object of the destination object.
 *
 * @param {Object} destinationObject The destination object which will be modified and merged with the source object.
 * @param {...Object} sourceObject One or more objects which will be used to extend the destination object.
 * @return {undefined}
 */
export function deepObjectCloningExtend(...args) {
  const destinationObject = args[0];
  let sourceObject;
  const toString = Object.prototype.toString,
    objectToStringStr = toString.call({});
  for (let i = 1; args[i]; i++) {
    sourceObject = args[i];
    for (const property in sourceObject) {
      if (
        sourceObject[property] &&
        objectToStringStr === toString.call(sourceObject[property])
      ) {
        destinationObject[property] = destinationObject[property] || {};
        deepObjectExtend(
          destinationObject[property],
          cloneObjDeeply(sourceObject[property])
        );
      } else {
        destinationObject[property] = sourceObject[property];
      }
    }
  }
}

/**
 * Extends a destination object with the provided source objects.
 *
 * @param {Object} destinationObj The destination object.
 * @param {...Object} sourceObjects The source objects.
 * @return Object The destination object "destinationObj" given as parameter after extension.
 */
export function extend(destinationObj, ...sourceObjects) {
  for (const sourceObject of sourceObjects) {
    deepObjectExtend(destinationObj, sourceObject);
  }
  return destinationObj;
}

/**
 * Like "Array.prototype.includes", but with type coercion.
 *
 * @param {Array} array The array.
 * @param {Anything} value The value.
 * @return {boolean} True if the value is included within the array (checking with type coercion`==`).
 */
export function includesTypeCoercion(array, value) {
  for (const valueOfArray of array) {
    if (valueOfArray == value) {
      return true;
    }
  }
  return false;
}

/**
 * Gets a nested value of an object given an array of nested property names (keys).
 *
 * @param {Object} data JS POJO object.
 * @param {Array} props Array of object nested keys.
 * @return {*} The leaf value.
 */
export function nestedPropertyValue(data, props) {
  let root = data;
  for (let i = 0; i < props.length; i++) {
    const prop = props[i];
    root = root[prop];
  }
  return root;
}

/**
 * Checks if a nested value of an object given an array of nested property names (keys) exists.
 *
 * @param {Object} data JS POJO object.
 * @param {Array} props Array of object nested keys.
 * @return {boolean} True if the nested key exists, false otherwise.
 */
export function hasNestedPropertyValue(data, props) {
  if (!props.length) {
    return false;
  }
  let root = data;
  for (let i = 0; i < props.length; i++) {
    const prop = props[i];
    if (!root[prop]) {
      return false;
    }
    root = root[prop];
  }
  return true;
}

/**
 * Sets a nested value of an object given an array of nested property names (keys).
 *
 * @param {Object} data JS POJO object.
 * @param {Array} props Array of object nested keys.
 * @param {*} value Leaf value.
 * @return {undefined}
 */
export function setNestedPropertyValue(data, props, value) {
  if (!props.length) {
    return;
  }
  let root = data;
  let prev = null;
  for (let i = 0; i < props.length; i++) {
    const prop = props[i];
    if (typeof root[prop] !== "object") {
      root[prop] = {};
    }
    prev = root;
    root = root[prop];
  }
  if (prev) {
    prev[props[props.length - 1]] = value;
  }
}

/**
 * Tests whether a value is undefined or not.
 *
 * @param {*} value A value
 * @return {boolean} True value is undefined, false otherwise.
 */
export function isUndefined(value) {
  return typeof value === "undefined";
}

/**
 * Tests if the given value is an int.
 *
 * @param {*} value The value.
 * @return {boolean} True if value is an int, false otherwise.
 */
export function isInt(value) {
  return Number.isInteger(value);
}

/**
 * Tests if the given string is an integer string.
 *
 * @param {*} a The string.
 * @return {boolean} True if the given string is an integer string, false otherwise.
 */
export function ctypeDigit(a) {
  return Boolean(a.match(/^[0-9]+$/));
}

/**
 * Tests if the given value is an int or an integer string.
 *
 * @param {*} a The value.
 * @return {boolean} True if the value is an int or an integer string, false otherwise.
 */
export function isIntegerOrIntegerStr(a) {
  return Number.isInteger(a) || ctypeDigit(a);
}

/**
 * Tests if the given value is callable.
 *
 * @param {*} v The value.
 * @return {boolean} True if callable, false otherwise.
 */
export function isCallable(v) {
  return typeof v === "function";
}

/**
 * Finds the index of a value in an array without type juggling
 * (i.e. like "Array.prototype.indexOf", but using "==" for equality comparison).
 *
 * @param {Array} array An array.
 * @param {*} value A value.
 * @return {number} -1 if the value is not in array, otherwise the index of value in array.
 */
export function findIndex(array, value) {
  return array.findIndex(el => el == value);
}

/**
 * Returns the first value of the first property of an object.
 *
 * @param {Object} obj The object.
 * @return {*} The value of the first property of the given object.
 */
export function firstPropValue(obj) {
  let prop;
  for (prop in obj) {
    break;
  }
  return obj[prop];
}

/**
 * Tests if a value is strictly a boolean "true".
 *
 * @param {*} value A value.
 * @return {boolean} "true" if the value is a boolean "true", "false" otherwise.
 */
export function isStrictlyTrue(value) {
  return value === true;
}

/**
 * Tests if a value is truthy or not.
 *
 * @param {*} value The value.
 * @return {boolean} "true" if the value is truthy (evaluates to boolean "true"), "false" otherwise.
 */
export function isTruthy(value) {
  return Boolean(value);
}

/**
 * Tests if all the given values are truthy.
 *
 * @param {...*} values The values.
 * @return {boolean} "true" if and only if all the values are truthy.
 */
export function allTruthy(...values) {
  return values.every(isTruthy);
}

/**
 * Tests if all the given values are not undefined.
 *
 * @param {...*} values The values.
 * @return {boolean} "true" if and only if all the values are not undefined.
 */
export function allNotUndefined(...values) {
  return values.every(value => typeof value !== "undefined");
}

/**
 * Tests if a string is a valid JSON string.
 *
 * @param {string} str A string.
 * @return {boolean} "true" if the string represents a valid JSON string, "false" otherwise.
 */
export function isJSONString(str) {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
}

/**
 * No-op function.
 *
 * @return void
 */
// eslint-disable-next-line @typescript-eslint/no-empty-function
export function noOpFn() {}

/**
 * Copyright (c) 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @typechecks
 *
 */

/**
 * @type {Function}
 */
const hasOwnProperty = Object.prototype.hasOwnProperty;

/**
 * Function implementing "Object.is" behaviour.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is
 *
 * @param {*} x The first value to compare.
 * @param {*} y The second value to compare.
 * @return {boolean} A boolean indicating whether or not the two arguments are the same value.
 */
export function is(x, y) {
  // SameValue algorithm
  if (x === y) {
    // Steps 1-5, 7-10
    // Steps 6.b-6.e: +0 != -0
    return x !== 0 || 1 / x === 1 / y;
  } else {
    // Step 6.a: NaN == NaN
    return x !== x && y !== y;
  }
}

/**
 * Checks whether a prop of an object equals in the other object (shallow comparison).
 *
 * @param {Object} objA The first object.
 * @param {Object} objB The second object.
 * @param {string} prop The name of the property.
 * @return {boolean} True if the value of "prop" in "objA" is shallowly equal to the value of "prop" in "objB".
 */
function objectPropEqual(objA, objB, prop) {
  return hasOwnProperty.call(objB, prop) && is(objA[prop], objB[prop]);
}

/**
 * Performs equality by iterating through keys on an object and returning "false"
 * when any key has values which are not strictly equal between the arguments.
 * Returns "true" when the values of all keys are strictly equal.
 *
 * @see https://stackoverflow.com/questions/22266826/how-can-i-do-a-shallow-comparison-of-the-properties-of-two-objects-with-javascri#answer-37636728
 *
 * @param {Object} objA First object.
 * @param {Object} objB Second object.
 * @return {boolean}
 */
export function shallowEqual(objA, objB) {
  if (is(objA, objB)) {
    return true;
  }

  if (
    typeof objA !== "object" ||
    objA === null ||
    typeof objB !== "object" ||
    objB === null
  ) {
    return false;
  }

  const keysA = Object.keys(objA);
  const keysB = Object.keys(objB);

  if (keysA.length !== keysB.length) {
    return false;
  }

  // Test for A's keys different from B.
  for (let i = 0; i < keysA.length; i++) {
    const prop = keysA[i];
    if (!objectPropEqual(objA, objB, prop)) {
      return false;
    }
  }

  return true;
}

/**
 * Tests if a partial object is a subset of another object.
 *
 * @param {Object} obj An object.
 * @param {Object} partialObj A partial object which may not have all the keys of "obj"
 *                            or may even have different keys, or keys with different values.
 * @return {boolean} False if "partialObj" has a key which is not in "obj",
 *                   or has at least one key which is also in "obj" but with a different value
 *                   (shallow comparison), true otherwise.
 */
export function partialShallowEqual(obj, partialObj) {
  return shallowEqual(
    Object.keys(partialObj).reduce((carry, key) => {
      carry[key] = obj[key];
      return carry;
    }, {}),
    partialObj
  );
}

/**
 * Returns a shallow object diff, returning an object with two keys "objA" and "objB",
 * each containing an object with all the properties of one of the two objects which are not within
 * the other object, respectively.
 * If a property is on both objects but each object has a different value for that same property
 * (using shallow equality comparison), the returned property will be set on both objects with their
 * respective values.
 *
 * @param {Object} objA First object.
 * @param {Object} objB Second object.
 * @return {Object} An object containing the shallow diff, with two keys "objA" and "objB".
 */
export function shallowObjectDiff(objA, objB) {
  const diff = {
    objA: {},
    objB: {}
  };
  if (shallowEqual(objA, objB)) {
    return diff;
  }
  const keysA = Object.keys(objA);
  const keysB = Object.keys(objB);
  for (let i = 0; i < keysA.length; i++) {
    const prop = keysA[i];
    if (!objectPropEqual(objA, objB, prop)) {
      diff.objA[prop] = objA[prop];
      if (hasOwnProperty.call(objB, prop)) {
        diff.objB[prop] = objB[prop];
      }
    }
  }
  for (let i = 0; i < keysB.length; i++) {
    const prop = keysB[i];
    if (!objectPropEqual(objB, objA, prop)) {
      diff.objB[prop] = objB[prop];
      if (hasOwnProperty.call(objA, prop)) {
        diff.objA[prop] = objA[prop];
      }
    }
  }
  return diff;
}

/**
 * Tests if a map has the given nested keys.
 *
 * @param {Map|WeakMap} map A map or weak map.
 * @param {Array} keys Array of keys to check. Each key represents a nested map.
 * @return {boolean} "true" if all the nested keys exist, false otherwise.
 */
export const nestedMapHas = (map, keys) => {
  let current = map;
  let i = 0;
  while (
    (current instanceof Map || current instanceof WeakMap) &&
    current.has(keys[i])
  ) {
    current = current.get(keys[i]);
    i++;
  }
  return i == keys.length;
};

/**
 * Sets a nested value on a nested map.
 *
 * @param {Map|WeakMap} map A map or weak map.
 * @param {Array} keys Array of keys to traverse. Each key will lead to a nested map.
 * @param {*} value The value to set at the inner key.
 * @return {undefined}
 */
export const nestedMapSet = (map, keys, value) => {
  let i = 0;
  let current = map;
  while (i < keys.length - 1) {
    const key = keys[i];
    const nested = current.get(key);
    if (nested instanceof Map || nested instanceof WeakMap) {
      current = nested;
    } else {
      const newMap = new Map();
      current.set(key, newMap);
      current = newMap;
    }
    i++;
  }
  current.set(keys[i], value);
};

/**
 * Yields values of an array mapping the yielded value.
 *
 * @param {Array} items An array of items.
 * @param {*} fn The function to call.
 *               The function will receive, in order the nth item,
 *               the index of the item in the array of items and the whole items array
 *               as parameters.
 * @param {*} thisArg Optional this arg of the called function (defaults to undefined).
 * @yields {*} The next yielded mapped item.
 */
export function* mapYield(items, fn, thisArg = void 0) {
  items.map();
  const boundFn = fn.bind(thisArg);
  for (let i = 0; i < items.length; i++) {
    yield boundFn(items[i], i, items);
  }
}

/**
 * Casts a value to a string.
 *
 * @param {*} v A value.
 * @return {string} The string representation of the value.
 */
export function str(v) {
  return "" + v;
}

/**
 * Maps an object, executing a function on each of its properties
 * returning a new mapped object.
 *
 * @param {Object} obj The object to map.
 * @param {Function} fn The function to use for the mapping.
 * @return {Object} The new mapped object.
 */
export const mapObject = (obj, fn) =>
  Object.fromEntries(
    Object.entries(obj).map(([key, value], index) => [
      key,
      fn(value, key, index)
    ])
  );

/**
 * Selects the truthy properties of an object or the properties of an object
 * passing a test specified with a callback function.
 *
 * @param {Object} obj The input object.
 * @param {Function} fn A function which will receive two parameters:
 *
 *                          - value: The current value of the input object for a given property;
 *                          - prop: The name of the current property of the input object.
 *
 *                      The function will have to return a boolean "true" indicating that this value
 *                      and property has to be included in the returned object, or "false" otherwise.
 *
 * @return {Object} An object having only the properties which passed the test
 *                  implemented by the "fn" callback function.
 */
export const propSelection = (obj, fn = isTruthy) =>
  Object.keys(obj).reduce((carry, key) => {
    if (fn(obj[key], key)) {
      carry[key] = obj[key];
    }
    return carry;
  }, {});
