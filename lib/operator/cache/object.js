'use strict'
var Cache = require('./')
module.exports = function (parsed) {
  if (parsed instanceof Object) {
    let cache = this._cache
    if (!cache) {
      this._cache = cache = new Cache(this)
    }
    return cache
  }
}
