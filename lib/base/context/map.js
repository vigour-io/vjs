'use strict'
exports.eachContext = function (fn) {
  var context = this._context
  var contextUp = context
  var contextUpCache
  while (contextUp) {
    contextUpCache = contextUp._context
    if (contextUpCache) {
      fn(this._contextLevel, context)
    }
    contextUp = contextUpCache
  }
}
