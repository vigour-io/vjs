'use strict'
var resolvePattern = require('../resolve')

module.exports = {
  direct (data, event, emitter, mapvalue, current) {
    let pattern = resolvePattern(this, mapvalue, emitter.key)
    if (pattern) {
      emitter.resubPartial(data, event, this, pattern, current, mapvalue)
    }
  },
  reference (data, event, emitter, mapvalue, current, context) {
    let pattern = resolvePattern(context, mapvalue, emitter.key)
    if (pattern) {
      emitter.resubPartial(data, event, context, pattern, current, mapvalue)
    }
  }
}
