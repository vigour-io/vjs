'use strict'
var isReadable = require('../../util/isstream').readable

exports.setStream = function (val, obs) {
  if (isReadable(val)) {
    obs.__stream__ = {
      chunk: function (chunk) {
        obs.emit('data', chunk)
      },
      error: function (err) {
        obs.emit('error', err)
      },
      end: function (chunk) {
        // needs to becom ebetter
        obs.emit('end', chunk)
      }
    }
    val.on('data', obs.__stream__.chunk)
    val.on('error', obs.__stream__.error)
    val.once('end', obs.__stream__.end)
  }
}

exports.removeStream = function (val, obs) {
  // something is still wrong here
  if (isReadable(val)) {
    obs.removeListener('error', obs.__stream__.error)
    obs.removeListener('data', obs.__stream__.chunk)
    obs.removeListener('end', obs.__stream__.end)
    delete obs.__stream__
  }
}
