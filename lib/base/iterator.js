'use strict'
require('../util/regenerator')
/**
 * @property @@iterator
 * injectable for of support
 * @memberOf Base#
*/
module.exports = function (base) {
  // es6 iterator
  base[Symbol.iterator] = function * () {
    var properties = this._properties
    for (var i in this) {
      if (i[0] !== '_' && !properties[i] && this[i] !== null) {
        yield i
      }
    }
  }
}
