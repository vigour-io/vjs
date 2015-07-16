"use strict";
/**
 * @memberOf Base#
 * @readonly
 * @name  keys
 * @type {array}
 */
exports.$define = {
  keys: function() {
    var keys = []
    var index = 0
    for (var key$ in this) {
      if (key$[0] !== '_') {
        keys[index++] = key$
      }
    }
    return keys
  }
}