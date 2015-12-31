'use strict'
exports.eachContext = function (fn) {
  var contextUp = this._context
  var contextUpCache
  if (contextUp) {
    fn(this._contextLevel, contextUp)
  }
  while (contextUp) {
    contextUpCache = contextUp._context
    if (contextUpCache) {
      fn(contextUp._contextLevel, contextUpCache)
      contextUp = contextUpCache
    } else {
      contextUp = false
      let instances = contextUp.getInstances && contextUp.getInstances()
      if (instances) {
        for (let i = 0, length = instances.length; i < length; i++) {
          instances[i].eachContext(fn)
        }
      }
    }
  }
}
