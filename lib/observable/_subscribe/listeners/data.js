'use strict'
var createData = require('../createdata')

module.exports = {
  direct (data, event, emitter, pattern, current, mapvalue) {
    pattern.setKey('_stamp', this._lastStamp)
    // check if removed
    if (data === null) {
      pattern.set(true)
      emitter.resub(data, event, this, mapvalue)
    }
    // emit
    data = createData(this, data)
    // uses the map to find the subscriber(s)
    emitter.findEmit(data, event, this, mapvalue)
  },

  reference (data, event, emitter, pattern, current, mapvalue, context) {
    pattern.setKey('_stamp', this._lastStamp)
    if (data === null) {
      let patternContext = pattern._context
      patternContext = patternContext &&
        patternContext._parent &&
        patternContext._parent._parent
      let instances = patternContext &&
        patternContext._instances
      if (instances) {
        let path = []
        while (pattern !== patternContext) {
          path.push(pattern.key)
          pattern = pattern.parent
        }
        for (let i = instances.length - 1; i >= 0; i--) {
          pattern = instances[i]
          for (let i = path.length - 1; i >= 0; i--) {
            let key = path[i]
            if (key === '$parent') {
              pattern = pattern.$parent || pattern.$upward || pattern
            } else {
              pattern = pattern[key]
            }
          }
          pattern.set(true)
        }
      } else {
        pattern.set(true)
      }

      emitter.resub(data, event, context, mapvalue)
    }

    data = createData(this, data)

    if (context._instances) {
      emitter.findEmitContext(data, event, context, mapvalue)
    } else if (context._context) {
      context.clearContext()
      emitter.findEmitInstances(data, event, context, mapvalue)
    } else {
      emitter.findEmit(data, event, context, mapvalue)
    }
  }
}
