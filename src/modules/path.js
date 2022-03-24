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
 * Utility functions for filenames and paths.
 */

/**
 * Returns the basename of a path.
 *
 * @param {string} path A path.
 * @return {string} The basename of the given path.
 */
export function basename(path) {
  return path.split(/[\\/]/).pop();
}

/**
 * Returns info about a path.
 *
 * @param {string} path The path.
 * @param {number} [options] Optioanl options flag.
 */
export function pathinfo(path, options) {
  //  discuss at: http://locutus.io/php/pathinfo/
  // original by: Nate
  //  revised by: Kevin van Zonneveld (http://kvz.io)
  // improved by: Brett Zamir (http://brett-zamir.me)
  // improved by: Dmitry Gorelenkov
  //    input by: Timo
  //      note 1: Inspired by actual PHP source: php5-5.2.6/ext/standard/string.c line #1559
  //      note 1: The way the bitwise arguments are handled allows for greater flexibility
  //      note 1: & compatability. We might even standardize this
  //      note 1: code and use a similar approach for
  //      note 1: other bitwise PHP functions
  //      note 1: Locutus tries very hard to stay away from a core.js
  //      note 1: file with global dependencies, because we like
  //      note 1: that you can just take a couple of functions and be on your way.
  //      note 1: But by way we implemented this function,
  //      note 1: if you want you can still declare the PATHINFO_*
  //      note 1: yourself, and then you can use:
  //      note 1: pathinfo('/www/index.html', PATHINFO_BASENAME | PATHINFO_EXTENSION);
  //      note 1: which makes it fully compliant with PHP syntax.
  //   example 1: pathinfo('/www/htdocs/index.html', 1)
  //   returns 1: '/www/htdocs'
  //   example 2: pathinfo('/www/htdocs/index.html', 'PATHINFO_BASENAME')
  //   returns 2: 'index.html'
  //   example 3: pathinfo('/www/htdocs/index.html', 'PATHINFO_EXTENSION')
  //   returns 3: 'html'
  //   example 4: pathinfo('/www/htdocs/index.html', 'PATHINFO_FILENAME')
  //   returns 4: 'index'
  //   example 5: pathinfo('/www/htdocs/index.html', 2 | 4)
  //   returns 5: {basename: 'index.html', extension: 'html'}
  //   example 6: pathinfo('/www/htdocs/index.html', 'PATHINFO_ALL')
  //   returns 6: {dirname: '/www/htdocs', basename: 'index.html', extension: 'html', filename: 'index'}
  //   example 7: pathinfo('/www/htdocs/index.html')
  //   returns 7: {dirname: '/www/htdocs', basename: 'index.html', extension: 'html', filename: 'index'}
  let opt = "";
  let realOpt = "";
  let optName = "";
  let optTemp = 0;
  const tmpArr = {};
  let cnt = 0;
  let i = 0;
  let haveBasename = false;
  let haveExtension = false;
  let haveFilename = false;
  // Input defaulting & sanitation
  if (!path) {
    return false;
  }
  if (!options) {
    options = "PATHINFO_ALL";
  }
  // Initialize binary arguments. Both the string & integer (constant) input is
  // allowed
  const OPTS = {
    PATHINFO_DIRNAME: 1,
    PATHINFO_BASENAME: 2,
    PATHINFO_EXTENSION: 4,
    PATHINFO_FILENAME: 8,
    PATHINFO_ALL: 0,
  };
  // PATHINFO_ALL sums up all previously defined PATHINFOs (could just pre-calculate)
  for (optName in OPTS) {
    if (Object.prototype.hasOwnProperty.call(OPTS, optName)) {
      OPTS.PATHINFO_ALL = OPTS.PATHINFO_ALL | OPTS[optName];
    }
  }
  if (typeof options !== "number") {
    // Allow for a single string or an array of string flags
    options = [].concat(options);
    for (i = 0; i < options.length; i++) {
      // Resolve string input to bitwise e.g. 'PATHINFO_EXTENSION' becomes 4
      if (OPTS[options[i]]) {
        optTemp = optTemp | OPTS[options[i]];
      }
    }
    options = optTemp;
  }
  // Internal Functions
  const _getExt = function (path) {
    const str = path + "";
    const dotP = str.lastIndexOf(".") + 1;
    return !dotP ? false : dotP !== str.length ? str.substr(dotP) : "";
  };
  // Gather path infos
  if (options & OPTS.PATHINFO_DIRNAME) {
    const dirName = path.replace(/\\/g, "/").replace(/\/[^/]*\/?$/, ""); // dirname
    tmpArr.dirname = dirName === path ? "." : dirName;
  }
  if (options & OPTS.PATHINFO_BASENAME) {
    if (haveBasename === false) {
      haveBasename = basename(path);
    }
    tmpArr.basename = haveBasename;
  }
  if (options & OPTS.PATHINFO_EXTENSION) {
    if (haveBasename === false) {
      haveBasename = basename(path);
    }
    if (haveExtension === false) {
      haveExtension = _getExt(haveBasename);
    }
    if (haveExtension !== false) {
      tmpArr.extension = haveExtension;
    }
  }
  if (options & OPTS.PATHINFO_FILENAME) {
    if (haveBasename === false) {
      haveBasename = basename(path);
    }
    if (haveExtension === false) {
      haveExtension = _getExt(haveBasename);
    }
    if (haveFilename === false) {
      haveFilename = haveBasename.slice(
        0,
        haveBasename.length -
          (haveExtension
            ? haveExtension.length + 1
            : haveExtension === false
            ? 0
            : 1)
      );
    }
    tmpArr.filename = haveFilename;
  }
  // If array contains only 1 element: return string
  cnt = 0;
  for (opt in tmpArr) {
    if (Object.prototype.hasOwnProperty.call(tmpArr, opt)) {
      cnt++;
      realOpt = opt;
    }
  }
  if (cnt === 1) {
    return tmpArr[realOpt];
  }
  // Return full-blown array
  return tmpArr;
}

/**
 * Returns the extension of a filename.
 *
 * @param {string} filename The filename.
 * @return {string} The extension of the given filename.
 */
export function filenameExtension(filename) {
  const extension = pathinfo(filename, "PATHINFO_EXTENSION");
  if (typeof extension !== "string") {
    return "";
  }
  return extension;
}

/**
 * Returns the dirname of a path.
 *
 * @param {string} path A path.
 * @return {string} The dirname of the given path.
 */
export function dirname(path) {
  //  discuss at: http://locutus.io/php/dirname/
  // original by: Ozh
  // improved by: XoraX (http://www.xorax.info)
  //   example 1: dirname('/etc/passwd')
  //   returns 1: '/etc'
  //   example 2: dirname('c:/Temp/x')
  //   returns 2: 'c:/Temp'
  //   example 3: dirname('/dir/test/')
  //   returns 3: '/dir'
  return path.replace(/\\/g, "/").replace(/\/[^/]*\/?$/, "");
}
