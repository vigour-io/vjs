'use strict'
module.exports = function (parsed) {
  if (parsed instanceof Object) {
    let cache = this._cache
    if (!cache) {
      this.setKey('_cache', {
        ChildConstructor: this.ChildConstructor,
        val: this
      })

      cache = this._cache
    }
    return cache
  }
}
