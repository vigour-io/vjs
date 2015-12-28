'use strict'
var Emitter = require('./index.js')
var emitInternal = Emitter.prototype.emitInternal
module.exports = new Emitter({
  define: {
    emitInternal (data, event, bind) {
      console.log('yo push dat')
      var dataStorage
      return emitInternal.call(this, dataStorage, event, bind)
    }
  }
}).Constructor
