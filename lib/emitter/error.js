'use strict'
var Emitter = require('./')

module.exports = new Emitter({
  handleData: false,
  define: {
    emitInternal: function (error, event, bind, key, trigger, ignore) {
      var data = this.getData(event, bind)
      console.log('--->', data)
      var original = error
      if (
        (!error && (error = 'emit')) ||
        typeof error === 'string'
      ) {
        let path = this.path
        if (path.length > 2) {
          path = path.slice(0, -2)
        }
        console.log('error maker', error)

        error = new Error(path.join('.') + ' ' + error)
      }

      if (data !== error) {
        console.log('2error maker', error, original, data)

        if (!data || data === original) {
          data = this.storeData(event, error, bind)
        } else {
          if (!(data instanceof Array)) {
            data = this.storeData(event, [data], bind)
          }
          data.push(error)
        }
      }

      return Emitter.prototype
        .emitInternal.call(this, data, event, bind, key, trigger, ignore)
    }
  }
}).Constructor
