'use strict'
exports.inject = require('./origin')
exports.properties = {
  $ (pattern, event) {
    if (typeof pattern === 'string') {
      pattern = pattern.replace(/...\//gi, '$upward.').replace(/..\//gi, 'parent.')
      let firstChar = pattern[0]
      if (firstChar !== '.') {
        let firstKey = pattern.substring(0, 6)
        if (firstKey !== 'parent' && firstKey !== '$upward') {
          pattern = '$upward.' + pattern
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
    if (!this.$origin) {
      this.setKey('$origin', {}, event)
    }

    var emitter = this.subscribe(pattern, onSubscribe)
    emitter.run(event)

    var child = this.ChildConstructor.prototype
    var ref = child._on && child._on.reference
    var attach = ref && ref.attach

    if (attach) {
      let pattern = emitter.pattern
      let set = {}

      attach.each(function (property, key) {
        let pattern = property[2][1]
        pattern.setKey('_ignore', true)
        set[key] = pattern
      })

      attachChildSub(pattern, set)
    }
  }
}

function onSubscribe (data, event) {
  var target = resolve(this)
  if (target._input !== null) {
    target.$origin.set(data[0].origin)//, event)
  }
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

function attachChildSub (pattern, set) {
  for (let i in pattern) {
    if (i[0] !== '_' && i !== 'key') {
      let property = pattern[i]
      if (property._input) {
        for (let i in set) {
          property.setKey('_childSub', set[i])
        }
      }
      attachChildSub(property, set)
    }
  }
}
