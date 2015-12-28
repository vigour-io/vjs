'use strict'
var Emitter = require('./index.js')
var emitInternal = Emitter.prototype.emitInternal
module.exports = new Emitter({
  define: {
    emitInternal (data, event, bind) {
      // data system how to make this without impact...
      var dataStorage
      return emitInternal.call(this, dataStorage, event, bind)
    }
  }
}).Constructor
