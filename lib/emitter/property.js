'use strict'
var Emitter = require('./index.js')

module.exports = new Emitter({
  triggerEvent: false,
  define: {
    emitInternal: function (event, bind, meta, key, trigger, ignore) {
      var metaStorage
      if (meta && bind) {
        metaStorage = this.meta
        if (typeof metaStorage !== 'object') {
          metaStorage = this.meta = {}
        }
        // console.error('\n\n\n\n\nremived!', meta, bind && bind[meta])

        if (bind[meta]) {
          if (bind[meta]._input === null) {
            console.error('\n\n\n\n\nremived!')
            if (!metaStorage.removed) {
              metaStorage.removed = []
            }
            metaStorage.removed.push(meta)
          } else {
            if (!metaStorage.added) {
              metaStorage.added = []
            }
            metaStorage.added.push(meta)
          }
        }
        return Emitter.prototype.emitInternal.call(this, event, bind, metaStorage, key, trigger, ignore)
      }
    }
  }
}).Constructor
