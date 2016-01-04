'use strict'
var Emitter = require('./index.js')
var emitInternal = Emitter.prototype.emitInternal
module.exports = new Emitter({
  define: {
    emitInternal (data, event, bind) {
      // data system how to make this without impact...
      console.log('hello', data, this._path)
      if (!this.__data) {
        // add emit type maybe?
        // add event stamp as well
        this.__data = { added: [], removed: [] }
        let emitter = this
        event.on('close', function () {
          emitter.__data = null
        })
      }
      if (bind[data] && bind[data]._input !== null) {
        this.__data.added.push(data)
      } else {
        this.__data.removed.push(data)
      }
      var dataStorage = this.__data
      console.log('datax', dataStorage)
      var ret = emitInternal.call(this, dataStorage, event, bind)
      return ret
    }
  }
}).Constructor
