'use strict'

/**
 * @function keys
 * Returns all the keys for a specific object and ommit properties starting with '_'
 * @memberOf Base#
 * @return {string[]}
 */
exports.define = {
  keys: function () {
    var keys = []
    var index = 0
    for (var key$ in this) {
      if (key$[0] !== '_') {
        // also adds keys that are properties, think about this
        keys[index++] = key$
      }
    }
    return keys
  }
}
