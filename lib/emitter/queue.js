'use strict'
var isEmpty = require('../util/is/empty')

exports.properties = {
  _queue: true
}

exports.define = {
  queue: function (event) {
    if (!this._queue || !this.hasOwnProperty('_queue')) {
      this._queue = {}
    }
    if (!this._queue[event.stamp]) {
      this._queue[event.stamp] = true
      return true
    }
  },
  removeQueue: function (event) {
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
