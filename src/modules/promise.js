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
 * Promise-related utility functions.
 */

import { uniqueId, isArray, noOpFn } from "./core";

/**
 * Creates a new timeout promise which will resolve after the given milliseconds timeout.
 *
 * @param {number} delayMs Delay in milliseconds after which the promise will resolve.
 * @param {*} [value] Optional value to resolve with.
 * @return {Promise} A new promise which resolves right after "delayMs" have elapsed.
 */
export function timeout(delayMs, value) {
  return new Promise(resolve => setTimeout(resolve, delayMs, value));
}

/**
 * Creates a new promise with a minimum delay before it is fulfilled.
 *
 * @param {Promise} promise A promise.
 * @param {number} minDelay Minumum delay in milliseconds.
 * @return {Promise} A new promise which resolves with the given value of the given promise
 *                   or rejects with the rejected value of the promise if it rejects.
 */
export function minDelayPromise(promise, minDelay) {
  return Promise.all([promise, timeout(minDelay)])
    .then(([value]) => {
      return value;
    })
    .catch(e => {
      throw e;
    });
}

/**
 * Resolves a promise with an optional fallback which fires if the promise does not resolve
 * under a certain time constraint.
 *
 * @param {Object} obj An object.
 * @param {Promise} obj.promise A promise.
 * @param {number} obj.maxDelayMs Max delay in milliseconds to wait before executing "onFallback" code if the time elapses.
 * @param {Function} obj.onFallback Function to execute if the given "promise" takes more than "maxDelayMs" to resolve.
 * @param {number} obj.fallbackMinDelayMs Number of milliseconds to wait if the fallback code gets executed before resolving the promise.
 * @return {Promise} A promise which resolves with the value of "promise" or rejects with the error of the given "promise".
 */
export function maxDelayFallbackPromise({
  promise,
  maxDelayMs,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onFallback = () => {},
  fallbackMinDelayMs,
} = {}) {
  const uniqueIdentifier = uniqueId();
  return Promise.race([
    promise,
    timeout(maxDelayMs).then(() => uniqueIdentifier),
  ]).then(value => {
    if (value === uniqueIdentifier) {
      onFallback();
      return minDelayPromise(promise, fallbackMinDelayMs);
    } else {
      return value;
    }
  });
}

/**
 * Applies an async operation to a promise returning a new one.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises#Composition
 *
 * @param {Promise} acc A promise.
 * @param {Function} onfulfilled Fulfilled callback.
 * @param {Function} onrejected Rejected callback.
 * @return {Promise} A new promise.
 */
export const applyAsync = (acc, onfulfilled, onrejected) => {
  return typeof onrejected !== "undefined"
    ? acc.then(onfulfilled, onrejected)
    : acc.then(onfulfilled);
};

/**
 * Composes functions which are run subsequently
 * (sequential composition) using promises.
 *
 * This function is useful when a chain of operations is known ahead of time
 * and they must be executed subsequently.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises#Composition
 *
 * @param {...(Function|Array)} funcs The functions (fulfilled callbacks). An array can be given and it MUST have
 *                                    the fulfilled callback at index 0 and the reject callback at index 1.
 * @return {Function} A new function that accepts an initial value to be passed through the composition pipeline.
 *                    If the returned function is called, it will return a Promise which represents the chain formed
 *                    by the promises composed subsequently.
 */
export const composeAsync = (...funcs) => x => {
  return funcs.reduce((acc, func) => {
    let promise;
    if (isArray(func)) {
      // Item at index 0 is the fulfilled callback,
      // while the item at index 1 is the reject callback.
      promise = applyAsync(acc, func[0], func[1]);
    } else {
      promise = applyAsync(acc, func);
    }
    return promise;
  }, Promise.resolve(x));
};

/**
 * Returns a promise which resolves as soon as at least some of the promises given as parameter are fulfilled,
 * and rejects if the minimum number of resolved promises ("minNumberOfFulfilledPromises") is not reached after all the given promises are settled.
 *
 * @param {Promise[]} promises An array of promises. If an empty array is given, then the returned promise will never resolve (will remain in pending state forever).
 * @param {number} minNumberOfFulfilledPromises The minimum number of the given promises that must be fulfilled to consider the returned promise fulfilled
 *                                              (e.g. at least 3 of the given promises must be fulfilled).
 *                                              Defaults to 1.
 *                                              If "minNumberOfFulfilledPromises" is less than 0, then it is treated as if it was 1.
 *                                              If "minNumberOfFulfilledPromises" is greater than the number of the given promises "promises",
 *                                              then "minNumberOfFulfilledPromises" is treated as if it was "promises.length".
 * @return {Promise} A new promise. The promise either fulfills or rejects with an object having the following properties:
 *
 *                       - fulfilled: An array, each element being an object having the following properties:
 *
 *                           - promise: The fulfilled promise of the array of promises "promises";
 *                           - value: The value that the promise has resolved with;
 *                           - index: The positional index of the given array of promises "promises";
 *
 *                       - rejected: An array, each element being an object having the following properties:
 *
 *                           - promise: The rejected promise of the array of promises "promises";
 *                           - reason: The reason that the promise has rejected with;
 *                           - index: The positional index of the given array of promises "promises";
 *
 *                   The "fulfilled" array will have "minNumberOfFulfilledPromises" elements.
 */
export const asSoonAtLeastSomeFulfilled = (
  promises,
  minNumberOfFulfilledPromises = 1
) => {
  const length = promises.length;
  const unresolvablePromise = new Promise(noOpFn);
  let promiseToReturn = unresolvablePromise;
  if (minNumberOfFulfilledPromises < 0) {
    minNumberOfFulfilledPromises = 1;
  } else if (minNumberOfFulfilledPromises > length) {
    minNumberOfFulfilledPromises = length;
  }
  if (length > 0) {
    let settledCount = 0;
    let isPromiseSettled = false;
    promiseToReturn = new Promise((resolve, reject) => {
      const fulfilled = [];
      const rejected = [];
      promises.map((promise, index) => {
        let isFulfilled = false;
        promise
          .then(value => {
            if (!isPromiseSettled) {
              isFulfilled = true;
              settledCount++;
              fulfilled.push({
                promise,
                index,
                value,
              });
              if (fulfilled.length === minNumberOfFulfilledPromises) {
                isPromiseSettled = true;
                resolve({ fulfilled, rejected });
              }
            }
          })
          .catch(reason => {
            if (!isPromiseSettled) {
              if (!isFulfilled) {
                settledCount++;
                rejected.push({ promise, index, reason });
                if (settledCount === length) {
                  isPromiseSettled = true;
                  reject({ fulfilled, rejected });
                }
              }
            }
          });
      });
    });
  }
  return promiseToReturn;
};
