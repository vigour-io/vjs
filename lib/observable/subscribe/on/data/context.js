'use strict'
var onRemove = require('./remove')
var getData = require('../../util/data')
module.exports = function onDataReference (data, event, emitter, pattern, mapValue, getSubscriber) {
  if (data === null) {
    onRemove.apply(this, arguments)
  }
  let subscriber = getSubscriber()
  console.error(subscriber, data, this.path)
  if(subscriber){
  	emitter.emit(getData(this, data), event, subscriber)
  }
}
