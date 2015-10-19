'use strict'
var getLateral = require('../info').getLateral
var emit = require('../emit')

module.exports = function onData (data, event, emitter, pattern, info, mapvalue, context) {
  if (data === null) {
    if (context._input || mapvalue['parent']) {
      console.warn('--removing', this.key)
      pattern[this.key] = true
      emitter.subscribe(data, event, context, emitter._pattern)
    }
  }
  data = {
    prevValue: data,
    origin: this
  }
  if (getLateral(info) > 0) {
    context.emit(emitter.key, data, event)
  } else {
    emit(data, event, this, mapvalue, emitter.key)
  }
}
