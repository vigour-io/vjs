'use strict'
module.exports = function (parsed) {
  if (parsed instanceof Object) {
    let cache = this._cache
    if (!cache) {
      this.setKey('_cache', this)
      cache = this._cache
    }
    return cache
  }
}
