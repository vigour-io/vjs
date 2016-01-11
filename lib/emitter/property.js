'use strict'
var Emitter = require('./index.js')
var emitInternal = Emitter.prototype.emitInternal
module.exports = new Emitter({
  define: {
    emitInternal (data, event, bind) {
      // data system how to make this without impact...
      if (data === void 0) {
        console.error('WTF WTF WTF')
      }

      console.warn(data, bind.path, event.stamp)
      var myData = this.getData(event, bind)
      if (!myData) {
        myData = { added: [], removed: [] }
      }
      if (bind[data] && bind[data]._input !== null) {
        myData.added.push(data)
      } else {
        myData.removed.push(data)
      }
      return emitInternal.call(this, myData, event, bind)
    }
  }
}).Constructor
