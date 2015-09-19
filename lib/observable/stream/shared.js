"use strict";

exports.setStream = function( val, obs ) {
  obs.__stream__ = {
    chunk: function(chunk) {
  
      obs.emit( '$change', void 0, chunk )
    },
    error: function(err) {
      obs.emit('$error', void 0, err )
    },
    end: function(chunk) {
      //dit moet clearen denk ik...
      obs.emit('$end', void 0, chunk )
    }
  }
  val.on('data', obs.__stream__.chunk)
  val.on('error', obs.__stream__.error)
  val.once('end', obs.__stream__.end)
}

exports.removeStream = function( val, obs ) {
  obs.removeListener('error', obs.__stream__.error)
  obs.removeListener('data', obs.__stream__.chunk)
  obs.removeListener('end', obs.__stream__.end)
  delete obs.__stream__
}
