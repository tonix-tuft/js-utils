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
 * Utility functions for functional programming.
 */

import { isObjectEmpty } from "./core";

/**
 * Curry function placeholder.
 *
 * @type Object
 */
export const _ = {};

/**
 * Return value of "onFnCall" to call the curried function and return its value.
 */
export const proceedCallingFn = {};

/**
 * Curries a function.
 *
 * @see https://medium.com/@kj_huang/implementation-of-lodash-curry-function-8b1024d71e3b
 *
 * @param {Function} fn A function to curry in order to return the curried version of the function.
 * @param {Object} [obj] An optional object with further properties to tweak the currying behaviour
 *                       and execute code while collecting the arguments of the curried function.
 * @param {number|undefined} [obj.arity] The arity of the function, i.e. its number of arguments.
 *                                       If omitted, "fn.length" will be used.
 * @param {Function|undefined} [obj.onEffectiveArgAdded] An optional callback to execute whenever a new effective argument
 *                                                       (not a placeholder) is added to the curried function.
 *                                                       The callback will receive an object with the following properties as argument:
 *
 *                                                           - addedArg: The effective argument added;
 *                                                           - args: An array with all the previously arguments collected so far
 *                                                                   without considering "addedArg";
 *                                                           - fn: The function "fn";
 *                                                           - curriedFn: The current curried function;
 *
 *                                                       The return value of the function is ignored.
 * @param {Function|undefined} [obj.onPlaceholder] An optional callback to execute whenever a new placeholder is added to the curried function.
 *                                                 The callback will receive an object with the following properties as argument:
 *
 *                                                     - args: An array with all the previously arguments collected so far
 *                                                             without considering "addedArg";
 *                                                     - fn: The function "fn";
 *                                                     - curriedFn: The current curried function;
 *
 *                                                 The return value of the function is ignored.
 * @param {Function|undefined} [obj.onFnCall] An optional callback to execute just before calling the "fn" function
 *                                            (i.e. when the "fn" function is ready to be called and all its arguments have been collected).
 *
 *                                            The callback will receive an object with the following properties as argument:
 *
 *                                                - args: The array of the effective arguments of the "fn" function;
 *                                                - fn: The function "fn" which was initially passed to "curry";
 *                                                - curriedFn: The current curried function;
 *
 *                                            This way, the code of the callback may decide what to do and may even call the function on its own
 *                                            and prevent the call from the caller side (i.e. within the "curry" function).
 *
 *                                            The callback must explicitly tell "curry" to call the function by returing "proceedCallingFn".
 *                                            If the callback returns any other value, then "fn" will not be called in "curry" and the return value
 *                                            of this callback will be returned.
 * @param {Function|undefined} [obj.onCurriedFnFirstCall] An optional callback to execute only the first time when the first curried function returned by "curry"
 *                                                        is invoked for the very first time with the very first argument or arguments.
 *
 *                                                        The callback will receive an object with the following properties as argument:
 *
 *                                                            - addedArgs: The arguments provided by the caller;
 *                                                            - fn: The "fn" function;
 *                                                            - curriedFn: The current curried function;
 *
 * @param {Function|undefined} [obj.onNewCurriedFn] An optional callback to execute initially and each time a new curried function is going to be returned.
 *
 *                                                  The callback will an object with the following properties as argument:
 *
 *                                                      - curriedFn: The current curried function (same as "newCurriedFn" when this callback is invoked
 *                                                                   for the very first time);
 *                                                      - newCurriedFn: The new curried function (will be the same as "curriedFn" when this callback is invoked
 *                                                                      for the very first time);
 *
 *
 * @return {Function} The curried version of the function.
 */
export const curry = (
  fn,
  {
    arity = void 0,
    onEffectiveArgAdded = void 0,
    onPlaceholder = void 0,
    onFnCall = void 0,
    onCurriedFnFirstCall = void 0,
    onNewCurriedFn = void 0
  } = {}
) => {
  let curriedFnFirstCall = true;

  const expectedNumberOfArgs = typeof arity !== "undefined" ? arity : fn.length;
  const nextParameterIndex = 0;
  const placeholdersIndices = [];

  const curriedInner = (
    expectedNumberOfArgs,
    nextParameterIndex,
    placeholdersIndices,
    ...args
  ) =>
    function curriedFn(...addedArgs) {
      let newExpectedNumberOfArgs = expectedNumberOfArgs;
      let newNextParameterIndex = nextParameterIndex;
      let newPlaceholdersIndices = null;
      let argsRequiredChange = false;
      curriedFnFirstCall &&
        ((onCurriedFnFirstCall &&
          onCurriedFnFirstCall({ addedArgs, fn, curriedFn })) ||
          true) &&
        (curriedFnFirstCall = false);
      let numberOfConsumablePlaceholders = placeholdersIndices.length;
      for (const addedArg of addedArgs) {
        !argsRequiredChange && (args = [...args]);
        argsRequiredChange = true;
        // "addedArg" may be either a placeholder or an effective argument.
        const isPlaceholder = addedArg === _;
        if (numberOfConsumablePlaceholders > 0 && !isPlaceholder) {
          // Argument is an effective argument consuming a previously set placeholder.
          onEffectiveArgAdded &&
            onEffectiveArgAdded({ addedArg, args, fn, curriedFn });
          let argIndex;
          if (newPlaceholdersIndices === null) {
            const [firstIndex, ...rest] = placeholdersIndices;
            argIndex = firstIndex;
            newPlaceholdersIndices = rest;
          } else {
            argIndex = newPlaceholdersIndices.shift();
          }
          args[argIndex] = addedArg;
          numberOfConsumablePlaceholders--;
          newExpectedNumberOfArgs--;
        } else {
          if (isPlaceholder) {
            // Argument is a new placeholder.
            if (newPlaceholdersIndices === null) {
              newPlaceholdersIndices = placeholdersIndices.concat(
                newNextParameterIndex
              );
            } else {
              newPlaceholdersIndices.push(newNextParameterIndex);
            }
            onPlaceholder && onPlaceholder({ args, fn, curriedFn });
          } else {
            // Argument is an effective argument.
            newExpectedNumberOfArgs--;
            onEffectiveArgAdded &&
              onEffectiveArgAdded({ addedArg, args, fn, curriedFn });
          }
          args[newNextParameterIndex] = addedArg;
          newNextParameterIndex++;
        }
      }
      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      return curried.call(
        null,
        curriedFn,
        newExpectedNumberOfArgs,
        newNextParameterIndex,
        newPlaceholdersIndices === null
          ? [...placeholdersIndices]
          : newPlaceholdersIndices,
        ...args
      );
    };

  const curried = (
    curriedFn,
    expectedNumberOfArgs,
    nextParameterIndex,
    placeholdersIndices,
    ...args
  ) => {
    if (expectedNumberOfArgs <= 0) {
      if (onFnCall) {
        const shouldCallCurriedFn = onFnCall({ args, fn, curriedFn });
        if (shouldCallCurriedFn === proceedCallingFn) {
          return fn(...args);
        } else {
          return shouldCallCurriedFn;
        }
      } else {
        return fn(...args);
      }
    } else {
      const newCurried = curriedInner(
        expectedNumberOfArgs,
        nextParameterIndex,
        placeholdersIndices,
        ...args
      );
      onNewCurriedFn && onNewCurriedFn({ curriedFn, newCurriedFn: newCurried });
      return newCurried;
    }
  };

  const newCurried = curriedInner(
    expectedNumberOfArgs,
    nextParameterIndex,
    placeholdersIndices
  );
  onNewCurriedFn &&
    onNewCurriedFn({ curriedFn: newCurried, newCurriedFn: newCurried });
  return newCurried;
};

/**
 * Curries a POJO function, i.e. a function having only a single POJO (Plain Old JavaScript Object)
 * as parameter (a function with named arguments).
 *
 * Each object passed to the returned curried function will be merged with the final object
 * to pass to the function "fn" when finally calling it.
 *
 * @param {Function} fn A function to curry in order to return the curried version of the function.
 * @param {Object} [obj] An optional object with further properties to tweak the currying behaviour
 *                       and execute code while collecting the POJO objects which will construct
 *                       the final POJO object to pass to the curried function after plugging the curried POJO function.
 * @param {string} [obj.plugPropertyName] The name of the property which instructs that it's time to call the function.
 * @param {boolean} [obj.plugPropertyMustBeTruthy] By default, it is enough that the property with "obj.plugPropertyName" name
 *                                                 is set on the object passed to the curried function to instruct it to call
 *                                                 "fn".
 *                                                 If this property is set to "true", the property with "plugPropertyName" name
 *                                                 will also have to be truthy.
 * @param {Function} [obj.onPOJOArgMerged] An optional callback to execute right after merging the next POJO argument with the so far accumulated POJO object.
 *                                         The callback will an object with the following properties as argument:
 *
 *                                             - POJOArg: The given POJO argument;
 *                                             - POJO: the so far merged POJO object merged with the given "POJOArg";
 *                                             - fn: The "fn" function;
 *                                             - curriedFn: The current curried function;
 *
 * @param {Function} [obj.onFnCall] An optional callback to execute just before calling the "fn" function
 *                                  (i.e. when the "fn" function is ready to be called and has been plugged and all
 *                                  of its POJO object argument properties have been collected).
 *
 *                                  The callback will receive an object with the following properties as argument:
 *
 *                                      - POJO: The callback will receive the function "fn" POJO argument (an object) as its first argument;
 *                                      - fn: The "fn" function;
 *                                      - curriedFn: The current curried function;
 *
 *                                  This way, the code of the callback may decide what to do and may even call the function on its own
 *                                  and prevent the call from the caller side (i.e. within the "POJOCurry" function).
 *
 *                                  The callback must explicitly tell "POJOCurry" to call the function by returing "proceedCallingFn"
 *                                  If the callback returns any other value, then "fn" will not be called in "POJOCurry" and the return value
 *                                  of this callback will be returned.
 * @param {Function|undefined} [obj.onCurriedFnFirstCall] An optional callback to execute only the first time when the first curried function returned by "curry"
 *                                                        is invoked for the very first time with the very first POJO argument.
 *
 *                                                        The callback will receive an object with the following properties as argument:
 *
 *                                                            - POJOArg: The given POJO argument yet to merge with the internal final POJO;
 *                                                            - fn: The "fn" function;
 *                                                            - curriedFn: The current curried function;
 *
 * @param {Function|undefined} [obj.onNewCurriedFn] An optional callback to execute initially and each time a new curried function is going to be returned.
 *
 *                                                  The callback will receive an object with the following properties as argument:
 *
 *                                                      - curriedFn: The current curried function (same as "newCurriedFn" when this callback is invoked
 *                                                                   for the very first time);
 *                                                      - newCurriedFn: The new curried function (will be the same as "curriedFn" when this callback is invoked
 *                                                                      for the very first time);
 *
 * @return {Function} The curried version of the function.
 */
export const POJOCurry = (
  fn,
  {
    plugPropertyName = "plugCurried",
    plugPropertyMustBeTruthy = false,
    onPOJOArgMerged = void 0,
    onFnCall = void 0,
    onCurriedFnFirstCall = void 0,
    onNewCurriedFn = void 0
  } = {}
) => {
  const POJO = {};
  let curriedFnFirstCall = true;

  const curriedInner = accPOJO =>
    function curriedFn(POJOArg) {
      curriedFnFirstCall &&
        ((onCurriedFnFirstCall &&
          onCurriedFnFirstCall({ POJOArg, fn, curriedFn })) ||
          true) &&
        (curriedFnFirstCall = false);
      let POJO = Object.assign({}, accPOJO, POJOArg || {});
      if (
        Object.prototype.hasOwnProperty.call(POJO, plugPropertyName) &&
        (!plugPropertyMustBeTruthy || POJO[plugPropertyName])
      ) {
        const { [plugPropertyName]: POJOArgIgnoredProperty, ...rest } = POJOArg;
        const { [plugPropertyName]: POJOIgnoredProperty, ...POJORest } = POJO;
        POJO = POJORest;
        if (!isObjectEmpty(rest)) {
          onPOJOArgMerged &&
            onPOJOArgMerged({ POJOArg: rest, POJO, fn, curriedFn });
        }
        let shouldCallCurriedFn = true;
        let ret = void 0;
        if (onFnCall) {
          ret = onFnCall({ POJO, fn, curriedFn });
          shouldCallCurriedFn = ret === proceedCallingFn;
        }

        if (shouldCallCurriedFn) {
          return fn(POJO);
        } else {
          return ret;
        }
      } else {
        onPOJOArgMerged && onPOJOArgMerged({ POJOArg, POJO, fn, curriedFn });
        const newCurried = curriedInner(POJO);
        onNewCurriedFn &&
          onNewCurriedFn({ curriedFn, newCurriedFn: newCurried });
        return newCurried;
      }
    };

  const newCurried = curriedInner(POJO);
  onNewCurriedFn &&
    onNewCurriedFn({ curriedFn: newCurried, newCurriedFn: newCurried });
  return newCurried;
};

/**
 * A utility function which composes functions, higher order functions or HOCs.
 *
 * @param  {...Function} fns A list of higher order functions or HOCs to compose.
 * @return {Function|undefined} A function composed of all the functions, higher order functions or HOCs
 *                              used for composition.
 *                              If no functions are given, "undefined" will be returned.
 */
export const compose = (...fns) => (...args) => {
  let outerArgs = args;
  let hoFn = void 0;
  for (let i = fns.length - 1; i >= 0; i--) {
    const fn = fns[i];
    hoFn = fn(...outerArgs);
    outerArgs = [hoFn];
  }
  return hoFn;
};

/**
 * A utility function which pipes functions.
 *
 * @param  {...Function} fns A list of functions to pipe.
 * @return {Function} A function representing the pipe.
 *                    If not functions are given, "undefined" will be returned.
 */
export const pipe = (...functions) => (...args) => {
  return functions.length
    ? functions.reduce((arg, fn) => [fn(...arg)], args)[0]
    : void 0;
};

/**
 * Returns a function which lets picking the properties of an object.
 *
 * @param {...string|...number} props The properties to pick.
 * @return {Function} A function which if called picks the "props" properties from its argument object
 *                    and returns a new object with the picked properties.
 */
export const pick = (...props) => o =>
  props.reduce((a, e) => ({ ...a, [e]: o[e] }), {});

/**
 * Lifts two functions using a binary function which takes their results as arguments.
 *
 * @param {Function} binaryFn A binary function (i.e. a function which takes two arguments).
 * @return {Function} A higher order function which has to be called with the first function as argument ("firstFn")
 *                    and returns another higher order function which has to be called with the second function as argument ("secondFn").
 *                    Then, the returned function will take the parameters to pass to the two functions ("firstFn" and "secondFn")
 *                    and return the result of calling "binaryFn" with the result of those functions given as parameters.
 */
export const liftBinaryFn = binaryFn => firstFn => secondFn => (...params) =>
  binaryFn(firstFn(...params), secondFn(...params));

/**
 * Applies an array of functions to a list of values.
 *
 * @param {Function[]} fns An array of functions.
 * @return {Function} A function which if called with a list of values, will pass the list to each function of "fns"
 *                    and return an array with the values after applying each of the original "fns" to its parameters.
 */
export const juxt = fns => (...values) => fns.map(fn => fn(...values));

/**
 * Converges a multi-arg function.
 *
 * @param {Function} multiArgFn A multi-arg function.
 * @param {Function[]} fns An array of functions to converge.
 *                         Each function will receive the parameter passed to the function returned
 *                         by this higher order function (i.e. "params").
 * @return {Function} A function which, if called, will pass its arguments to each of the functions in "fns"
 *                    and pass each result of those functions to the multi-arg function "multiArgFn",
 *                    returning its result.
 */
export const converge = (multiArgFn, fns) => (...params) =>
  multiArgFn(...fns.map(fn => fn(...params)));
