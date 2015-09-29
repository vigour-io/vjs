'use strict'
var ObservableDuplex = require('./duplex')

exports.define = {
  stream: {
    get: function () {
      if (!this._stream) {
        this._stream = new ObservableDuplex(this)
      }
      return this._stream
    }
  },
  pipe: {
    get: function () {
      if (!this.hasOwnProperty('_boundpipe')) {
        this._boundpipe = this.stream.pipe.bind(this._stream)
      }
      return this._boundpipe
    }
  }
}
