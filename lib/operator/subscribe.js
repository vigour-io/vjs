'use strict'
var Operator = require('./')
var objectCache = require('./cache/object')
exports.inject = require('./val')
exports.properties = {
  $ (pattern) {
    if (typeof pattern === 'string') {
      pattern = pattern.replace(/...\//gi, 'upward.').replace(/..\//gi, 'parent.')
      let firstChar = pattern[0]
      if (firstChar !== '.') {
        let firstKey = pattern.substring(0, 6)
        if (firstKey !== 'parent' && firstKey !== 'upward') {
          pattern = 'upward.' + pattern
        }
      } else {
        pattern = pattern.substring(2)
      }

      let keys = pattern.split('.')
      let value = true
      for (let i = keys.length - 1; i >= 0; i--) {
        let key = keys[i]
        pattern = {}
        pattern[key] = value
        value = pattern
      }
    }
    if (!this.$subscribe) {
      this.setKey('$subscribe')
    }
    this.subscribe(pattern, onSubscribe).run()
  },
  $subscribe: new Operator({
    key: '$subscribe',
    operator (val, operator, origin) {
      var parsed = this.$subscribe.parseValue(val, origin)
      var cached = objectCache.call(this, parsed)
      if (cached) {
        // events etc to these sets!
        cached.clear()
        cached.set(parsed)
        return cached
        // return this.$subscribe.val
      } else {
        return parsed
      }
    }
  })
}

function onSubscribe (data, event) {
  var target = resolve(this)
  console.log('-----',target.$subscribe.path, '<--',data.origin.path)
  target.$subscribe.set(data.origin)
}

function resolve (target) {
  var _contextLevel = target._contextLevel
  if (_contextLevel) {
    let path = []
    while (_contextLevel) {
      path.push(target.key)
      target = target.parent
      _contextLevel--
    }
    for (let i = path.length - 1; i >= 0; i--) {
      target = target[path[i]]
    }
  }
  return target
}
