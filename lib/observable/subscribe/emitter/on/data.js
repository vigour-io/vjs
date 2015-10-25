'use strict'
var getLateral = require('../info').getLateral
var emit = require('../emit')

module.exports = function onData (data, event, emitter, pattern, info, mapvalue, context, test) {
  if (data === null) {
    if (context._input || mapvalue.parent) {
      pattern[this.key].val = true
      console.info('remove!',context.pattern)
      emitter.subscribe(data, event, context, context.pattern)
    }
  }
  data = {
    prevValue: data,
    origin: this
  }

  if (getLateral(info) > 0) {
    emitter.emit(data, event, context)
  } else {
    emit(data, event, this, mapvalue, emitter.key)
  }
}
