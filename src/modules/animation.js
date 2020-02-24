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
 * Animation utility functions.
 */

import { gsap } from "gsap";
import { millisecToSec } from "./time";

/**
 * Fade in animation.
 *
 * @param {Element|Element[]} node DOM element or array of DOM elements.
 * @param {Object} options Options.
 * @return void
 */
export function fadeIn(node, options) {
  const opt = options || {};
  const secs = millisecToSec(opt.millisec || 300);
  const css = opt.css || {};
  gsap.fromTo(
    node,
    secs,
    {
      opacity: 0,
      display: css.display || "block",
      ...(opt.fromCSS || {})
    },
    {
      opacity: 1,
      ...(opt.toCSS || {}),
      onComplete: () => {
        opt.onComplete && opt.onComplete();
      }
    }
  );
}

/**
 * Fade out animation.
 *
 * @param {Element|Element[]} node DOM element or array of DOM elements.
 * @param {Object} options Options.
 * @return void
 */
export function fadeOut(node, options) {
  const opt = options || {};
  const secs = millisecToSec(opt.millisec || 300);
  const css = opt.css || {};
  gsap.fromTo(
    node,
    secs,
    {
      opacity: 1,
      display: css.display || "block",
      ...(opt.fromCSS || {})
    },
    {
      opacity: 0,
      ...(opt.toCSS || {}),
      onComplete: () => {
        gsap.set(node, {
          display: css.displayOnComplete || "none"
        });
        opt.onComplete && opt.onComplete();
      }
    }
  );
}
