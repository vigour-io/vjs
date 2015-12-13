'use strict'
var isEmpty = require('../util/is/empty')

exports.properties = {
  _queue: true
}

exports.define = {
  // totally not nessecary -- reuse the bind map
  //
  // REMOVE THIS!
  queue (event) {
    if (!this._queue || !this.hasOwnProperty('_queue')) {
      this._queue = {}
    }
    if (!this._queue[event.stamp]) {
      this._queue[event.stamp] = true
      return true
    }
    // return true
  },
  // rename to removeFromQueue or something -- clearer
  removeQueue (event) {
    if (this._queue) {
      if (this._queue[event.stamp]) {
        delete this._queue[event.stamp]
        if (isEmpty(this._queue)) {
          delete this._queue
        }
      }
    }
  }
}

// move this to event something goes wrong here now
