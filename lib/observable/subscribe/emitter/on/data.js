'use strict'
var getLateral = require('../info').getLateral
var emit = require('../emit')

module.exports = function onData (data, event, emitter, pattern, info, mapvalue) {
  console.error('on data!', this.path)
  if (data === null) {
    var subsOrigin = emitter._parent._parent
    if (subsOrigin._input || mapvalue['parent']) {
      pattern[this.key] = true
      emitter.subscribe(data, event, subsOrigin, emitter._pattern)
    }
  }
  data = {
    prevValue: data,
    origin: this
  }
  if (getLateral(info) > 0) {
    emitter._parent._parent.emit(emitter.key, data, event)
  } else {
    emit(data, event, this, mapvalue, emitter.key)
  }
}
