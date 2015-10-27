'use strict'
var onRemove = require('./remove')
var emit = require('../../util/emit')
var getData = require('../../util/data')
module.exports = function onDataDirect (data, event, emitter, pattern, mapValue, subscriber) {
  if (data === null) {
    onRemove.apply(this, arguments)
  }
  emit(getData(this, data), event, this, mapValue, emitter.key)
}
