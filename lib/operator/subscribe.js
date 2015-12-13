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

    this.subscribe(pattern, onSubscribe).run(event)
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
