'use strict'
exports.inject = require('./origin')
exports.properties = {

  // temp solution for data without $origin operator
  $bind (val, event) {
    var pattern = parsePattern(val)
    var emitter = this.subscribe(pattern, onBind)
    emitter.run(event)
  },

  $ (val, event) {
    var pattern = parsePattern(val)
    var emitter = this.subscribe(pattern, onSubscribe)
    var child = this.ChildConstructor.prototype
    var on = child._on
    if (on) {
      let ref = on.reference
      if (ref) {
        let attach = ref.attach
        if (attach) {
          let pattern = emitter.pattern
          let set = {}
          let childSub = {}
          attach.each(function (property, key) {
            let attached = property[2]
            let pattern = attached[1]
            pattern.setKey('_ignore', true)
            set[key] = pattern
            
            childSub[key] = {
              pattern: pattern.serialize(),
              map: attached[3]
            }

            // property[1].remove(event)
          })
          attachChildSub(pattern, set, event)
          this.setKey('_childSub', childSub, event)
        }
      }
    }

    if (!this.$origin) {
      this.setKey('$origin', {}, event)
    }
    emitter.run(event)
  }
}

function parsePattern (val) {
  if (typeof val === 'string') {
    val = val
      .replace(/\.\.\.\//gi, '$upward.')
      .replace(/\.\.\//gi, 'parent.')

    let firstChar = val[0]
    if (firstChar !== '.') {
      let firstKey = val.substring(0, 6)
      if (firstKey !== 'parent' && firstKey !== '$upward') {
        val = '$upward.' + val
      }
    } else {
      val = val.substring(2)
    }
    let keys = val.split('.')
    let value = true
    for (let i = keys.length - 1; i >= 0; i--) {
      let key = keys[i]
      val = {}
      val[key] = value
      value = val
    }
  }
  return val
}

function onBind (data, event) {
  this.set(data[0].origin)
}

function onSubscribe (data, event) {
  this.$origin.set(data[0].origin)
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

function attachChildSub (pattern, set, event) {
  for (let i in pattern) {
    if (i[0] !== '_' && i !== 'key') {
      let property = pattern[i]
      if (property._input) {
        property.setKey('_childSub', {})
        for (let i in set) {
          property._childSub.setKey(i, set[i], event)
        }
      }
      attachChildSub(property, set, event)
    }
  }
}
