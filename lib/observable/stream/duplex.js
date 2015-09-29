'use strict'
var stream = require('stream')
var Event = require('../../event/')
var Base = require('../../base/')

module.exports = function ObservableDuplex (observable) {
  var observableStream = new stream.Duplex({
    objectMode: true
    // write
    // read
  })

  // reuse!
  observableStream._read = function (size) {}

  observableStream._write = function (chunk, encoding, callback) {
    // think of reusing events or something....
    var streamEvent = new Event(observable, 'data')
    // if(chunk === null) {
    //   observable.emit( '$end', streamEvent )
    // }
    streamEvent.fromStream = true
    observable.emit('data', chunk, streamEvent)
  }

  // removal of streams has to be supported!
  observable.on('data', function (data, event) {
    // cannot do object yet!
    if (this.val !== this) {
      // if observable
      if (this.val instanceof Base) {
        console.warn('now we should convert this badboy or something...', this.val)
      }


      observableStream.push(this.val)
    } else {
      console.warn('.val is myself', this.path)
    }
  })

  // observable.on('$end', function( event, meta ) {
  //   observableStream.push(null)
  // })

  return observableStream
}
