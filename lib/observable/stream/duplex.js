'use strict'
var stream = require('stream')
var Event = require('../../event/')
var Base = require('../../base/')

class StreamEvent extends Event {
  constructor () {
    super()
  }
}

StreamEvent.prototype.fromStream = true

module.exports = function ObservableDuplex (observable) {
  var observableStream = new stream.Duplex({
    objectMode: true,
    read (size) {},
    write (chunk, encoding, callback) {
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
