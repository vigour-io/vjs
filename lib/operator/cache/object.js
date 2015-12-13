'use strict'
module.exports = function (parsed) {
  if (parsed instanceof Object) {
    console.log('??', arguments)
    let cache = this._cache
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
  }
}
