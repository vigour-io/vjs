'use strict'
module.exports = function (parsed, event) {
  let cache = this._cache
  if (typeof parsed === 'object') {
    if (parsed === null) {
      if (cache) {
        cache.remove(event)
      }
      return
    }
    if (!cache) {
      let child = this.ChildConstructor.prototype
      // let on = child._on
      this.setKey('_cache', {
        ChildConstructor: child,
        val: this
      }, event)
      cache = this._cache
    }
    return cache
  } else if (cache) {
    cache.remove(event)
  }
}
