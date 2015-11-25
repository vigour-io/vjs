'use strict'
var resolvePattern = require('../resolve')

module.exports = {
  direct (data, event, emitter, current, mapvalue) {
    let pattern = resolvePattern(this, mapvalue)
    emitter.resubPartial(data, event, this, pattern, current, mapvalue)
  },
  reference (data, event, emitter, current, mapvalue, context) {
    let pattern = resolvePattern(context, mapvalue)
    emitter.resubPartial(data, event, context, pattern, current, mapvalue)
  }
}
