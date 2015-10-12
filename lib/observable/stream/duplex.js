'use strict'
var stream = require('stream')
var Event = require('../../event/')
var Base = require('../../base/')

module.exports = function ObservableDuplex (observable) {
  var observableStream = new stream.Duplex({
    objectMode: true,
    read: function (size) {},
    write: function (chunk, encoding, callback) {
      var streamEvent = new Event(observable, 'data')
      streamEvent.fromStream = true
      observable.emit('data', chunk, streamEvent)
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
