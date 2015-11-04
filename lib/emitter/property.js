'use strict'
var Emitter = require('./index.js')

module.exports = new Emitter({
  triggerEvent: false,
  handleData: false,
  define: {
    emitInternal: function (data, event, bind, key, trigger, ignore) {
      var dataStorage
      if (data && bind) {
        dataStorage = this.getData(event, bind)
        console.error('1dataStorage',dataStorage)
        if (typeof dataStorage !== 'object') {
          dataStorage = this.storeData(event, {}, bind)
        }
        if (bind[data]) {
          if (bind[data]._input === null) {
            if (!dataStorage.removed) {
              dataStorage.removed = []
            }
            dataStorage.removed.push(data)
          } else {
            console.error('2dataStorage',dataStorage)
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
