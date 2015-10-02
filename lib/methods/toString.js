'use strict'

/**
 * @function toString
 * @memberOf Base#
 * @param  {fn} exclude. Optional function to exclude properties. It defaults
 * to ignore keys that starts with ' (e.g.:key)
 * @return {string} String of the object, including stringified functions
 */
exports.define = {
  toString: function (filter, notPlain) {
    var result = this.convert({
      fnToString: true,
      filter: filter,
      plain: !notPlain
    })
    return JSON.stringify(result, false, 2)
  }
}
