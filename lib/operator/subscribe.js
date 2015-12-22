'use strict'
exports.inject = require('./origin')

var hash = require('../util/hash')
var SubsEmitter = require('../observable/subscribe/constructor')

var CustomSubsEmitter = new SubsEmitter({
  define: {
    subField (data, event, obs, field, current, mapvalue) {
      if (!field._input) {
        return this.subObj(data, event, obs, field, current, mapvalue, {})
      }
    }
  }
}).Constructor

exports.define = {
  customSubscribe (pattern, val, key, unique, event) {
    // TODO cache the stringified
    var self = this
    var stringified = JSON.stringify(pattern)
    var hashed = hash(stringified)
    var emitter = self._on && self._on[hashed]

    if (!emitter) {
      self = self.set({
        on: {
          [hashed]: new CustomSubsEmitter({
            pattern: pattern
          })
        }
      }, event) || this
      emitter = self._on[hashed]
    }

    self.on(hashed, val, key, unique, event)

    self.on('remove', [ function (data, event, emitter) {
      var onRemove = emitter.onRemove
      if (onRemove) {
        for (let i = onRemove.length - 1; i >= 0; i--) {
          onRemove[i].onSubRemove(emitter, event)
        }
      }
    }, emitter])

    emitter.subField(false, event, this, emitter.pattern, 1, { val: true }, {})

    return emitter
  }
}

exports.properties = {
  $ (val, event) {
    var pattern = parsePattern(val)
    var emitter = this.customSubscribe(pattern, onSubscribe)
    var child = this.ChildConstructor.prototype
    var on = child._on
    if (on) {
      let ref = on.reference
      if (ref) {
        let attach = ref.attach
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

function onSubscribe (data, event) {
  var target = resolve(this)
  if (target._input !== null) {
    // console.log(data.length, data[0].origin.path.join('.'),'-->',target.path.join('.'))
    target.$origin.set(data[0].origin) //event needed
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
        property.setKey('_childSub', {})
        for (let i in set) {
          property._childSub.setKey(i, set[i])
        }
      }
      attachChildSub(property, set)
    }
  }
}
