"use strict";

var stream = require('stream')
var Event = require('../../event/')
var Base = require('../../base/')

module.exports = function ObservableDuplex( observable ) {
  var observableStream = new stream.Duplex({
    objectMode: true
  })

  //reuse!
  observableStream._read = function(size) {
    // console.log('read it!', size)
  }

  observableStream._write = function(chunk, encoding, callback) {
    //think of reusing events or something....
    // console.error('write it!', chunk)
    var streamEvent = new Event( observable, '$change')
    // if(chunk === null) {
    //   observable.emit( '$end', streamEvent )
    // }
    streamEvent.$fromStream = true
    observable.emit('$change', streamEvent, chunk)
  }

  //removal of streams has to be supported!
  observable.on('$change', function( event, meta ) {
    //cannot do object yet!
    if(this.$val !== this) {
      //if observable
      if(this.$val instanceof Base) {
        console.warn('now we should convert this badboy or something...', this.$val)
      }
      observableStream.push(this.$val)
    } else {
      console.warn('.$val is myself', this.$path)
    }
  })

  // observable.on('$end', function( event, meta ) {
  //   observableStream.push(null)
  // })

  return observableStream
}
