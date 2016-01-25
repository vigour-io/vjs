'use strict'

/**
 * @function keys
 * Returns all the keys for a specific object and ommit properties starting with '_'
 * @memberOf Base#
 * @return {string[]}
 */
exports.define = {
  keys () {
    var keys = []
    for (let key in this) {
      if (key[0] !== '_' && !this.properties[key] && this[key] !== null) {
        // also adds keys that are properties, think about this
        keys.push(key)
      }
    }
    return keys
  }
}
