'use strict'
var resolvePattern = require('../resolve')

module.exports = {
  direct (data, event, emitter, current, mapvalue) {
    let pattern = resolvePattern(this, mapvalue, emitter.key)
    console.log('----',JSON.stringify(mapvalue))
    emitter.resubPartial(data, event, this, pattern, current, mapvalue)
  },
  reference (data, event, emitter, current, mapvalue, context) {
    console.log('----',JSON.stringify(mapvalue))
    let pattern = resolvePattern(context, mapvalue, emitter.key)
    emitter.resubPartial(data, event, context, pattern, current, mapvalue)
  }
}
