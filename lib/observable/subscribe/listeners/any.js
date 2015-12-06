'use strict'
var resolvePattern = require('../resolve')

module.exports = {
  direct (data, event, emitter, pattern, current, mapvalue, map) {
    if (data) {
      let added = data.added
      if (added) {
        // TODO remove pattern from arguments
        pattern = resolvePattern(this, mapvalue, emitter.key)
        for (let i = added.length - 1; i >= 0; i--) {
          let key = added[i]
          pattern.setKey(key, pattern.$any)
          let field = pattern[key]
          map.parent = mapvalue
          emitter.subField(data, event, this[key], field, current, map)
        }
      }
    }
  },
  reference (data, event, emitter, pattern, current, mapvalue, map, context) {
    if (data) {
      let added = data.added
      if (added) {
        // TODO remove pattern from arguments
        pattern = resolvePattern(this, mapvalue, emitter.key)
        for (let i = added.length - 1; i >= 0; i--) {
          let key = added[i]
          pattern.setKey(key, pattern.$any)
          let field = pattern[key]
          map.parent = mapvalue
          emitter.subFieldRef(data, event, this[key], field, current, map, context)
        }
      }
    }
  }
}
