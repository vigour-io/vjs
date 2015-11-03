'use strict'
var onRemove = require('./remove')
var getData = require('../../util/data')
module.exports = function onDataReference (data, event, emitter, pattern, mapValue, getSubscriber) {
  if (data === null) {
    onRemove.apply(this, arguments)
  }
  emitter.emit(getData(this, data), event, getSubscriber())
}