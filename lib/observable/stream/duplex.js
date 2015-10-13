'use strict'
var stream = require('stream')
var Event = require('../../event/')
var Base = require('../../base/')
var util = require('util')

function StreamEvent () {
  Event.apply(this, arguments)
}
StreamEvent.prototype.fromStream = true
util.inherits(StreamEvent, Event)

module.exports = function ObservableDuplex (observable) {
  var observableStream = new stream.Duplex({
    objectMode: true,
    read: function (size) {},
    write: function (chunk, encoding, callback) {
      var event = new StreamEvent(observable, 'data')
      observable.emit('data', chunk, event)
    }
  })

  // removal of streams has to be supported!
  observable.on('data', function (data, event) {
    if (this.val !== this) {
      if (this.val instanceof Base) {
        console.warn('now we should convert this badboy or something...', this.val)
      }
      observableStream.push(this.val)
    } else {
      console.warn('.val is myself', this.path)
    }
  })
  return observableStream
}
