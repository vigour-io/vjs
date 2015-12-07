'use strict'
var Emitter = require('./index.js')

module.exports = new Emitter({
  triggerEvent: false,
  handleData: false,
  define: {
    emitInternal (data, event, bind, key, trigger, ignore) {
      var dataStorage
      if (data && bind) {
        let bound = this.getBind(event, bind, 'val')
        // clean this up
        if (!bound) {
          dataStorage = {}
          bound = this.setBind(event, bind, dataStorage)
        }
        dataStorage = bound.data
        if (typeof dataStorage !== 'object') {
          bound.data = dataStorage = {}
        }
        // clean it
        if (bind[data]) {
          if (bind[data]._input === null) {
            if (!dataStorage.removed) {
              dataStorage.removed = []
            }
            dataStorage.removed.push(data)
          } else {
            if (!dataStorage.added) {
              dataStorage.added = []
            }
            dataStorage.added.push(data)
          }
        }
      }
      return Emitter.prototype
        .emitInternal.call(this, dataStorage, event, bind, key, trigger, ignore)
    }
  }
}).Constructor
