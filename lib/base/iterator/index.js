'use strict'
/**
 * @property @@iterator
 * injectable es6 for of support
 * @memberOf Base#
*/
module.exports = function (base) {
  base[Symbol.iterator] = function * () {
    var properties = this._properties
    for (var i in this) {
      if (i[0] !== '_' && !properties[i] && this[i] !== null) {
        yield i
      }
    }
  }
}
