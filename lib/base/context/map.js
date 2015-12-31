'use strict'
exports.eachContext = function (fn, arg) {
  var contextUp = this._context
  var contextUpCache
  if (contextUp) {
    if (fn(this._contextLevel, contextUp, arg)) {
      return true
    }
  }
  while (contextUp) {
    contextUpCache = contextUp._context
    if (contextUpCache) {
      if (fn(contextUp._contextLevel, contextUpCache, arg)) {
        return true
      }
      contextUp = contextUpCache
    } else {
      contextUp = false
      let instances = contextUp.getInstances && contextUp.getInstances()
      if (instances) {
        for (let i = 0, length = instances.length; i < length; i++) {
          if (instances[i].eachContext(fn, arg)) {
            return true
          }
        }
      }
    }
  }
}

exports.contextMap = function (fn) {
  let cache = this._hashCache
  if (!this.hasOwnProperty('_hashCache')) {
    cache = this._hashCache = {}
  }
  this.eachContext(fn || walk, cache)
  return cache
}

function walk (level, cntxt, cache) {
  if (!cache[cntxt.uid]) {
    cache = cache[cntxt.uid] = {}
  }
}
