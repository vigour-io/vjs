'use strict'
var getLateral = require('../info').getLateral
var emit = require('../emit')

module.exports = function onData (data, event, emitter, pattern, info, mapvalue) {
  if (data === null) {
    var subsOrigin = emitter._parent._parent
    if (subsOrigin._input || mapvalue['parent']) {
      pattern[this.key] = true
      emitter.subscribe(data, event, subsOrigin, emitter._pattern)
    }
  }

  if (getLateral(info) > 0) {
    emitter._parent._parent.emit(emitter.key, data, event)
  } else {
    data = {
      prevValue: data,
      origin: this
    }
    emit(data, event, this, mapvalue, emitter.key)
  }
}
