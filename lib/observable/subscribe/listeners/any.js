'use strict'
var resolvePattern = require('../resolve')
module.exports = {
  direct (data, event, emitter, pattern, current, mapvalue, map) {
    if (data) {
      let added = data.added
      let found
      if (added) {
        pattern = resolvePattern(this, mapvalue, emitter.key)
        for (let i = added.length - 1; i >= 0; i--) {
          let key = added[i]
          pattern.setKey(key, pattern.$any)
          let field = pattern[key]
          map.parent = mapvalue
          found = emitter.subField(data, event, this[key], field, current, map)
        }
        if (pattern._emitProperty && !found) {
          let obj = {}
          for (let i = added.length - 1; i >= 0; i--) {
            let key = added[i]
            obj[key] = {}
          }
          emitter.findEmit({
            origin: this,
            data: obj
          }, event, this, mapvalue)
        }
      } else if (pattern._emitProperty) {
        let obj = {}
        let removed = data.removed
        for (let i = removed.length - 1; i >= 0; i--) {
          let key = removed[i]
          obj[key] = null
        }
        emitter.findEmit({
          origin: this,
          data: obj
        }, event, this, mapvalue)
      }
    }
  },
  reference (data, event, emitter, pattern, current, mapvalue, map, context) {
    if (data) {
      let added = data.added
      if (added) {
        for (let i = added.length - 1; i >= 0; i--) {
          let key = added[i]
          pattern.setKey(key, pattern.$any)
          let field = pattern[key]
          emitter.subFieldRef(data, event, this[key], field, current, mapvalue, map, context)
        }
      }
    }
  }
}
