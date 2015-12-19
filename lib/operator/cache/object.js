'use strict'
module.exports = function (parsed) {
  let cache = this._cache
  if (typeof parsed === 'object') {
    if (parsed === null) {
      if (cache) {
        cache.remove()
      }
      return
    }
    if (!cache) {
      this.setKey('_cache', {
        // TODO this messes things up, think of better way to do this
        // properties: this.properties,
        ChildConstructor: this.ChildConstructor,
        val: this
      })
      cache = this._cache
    }
    return cache
  }else if(cache) {
    cache.remove()
  }
}
