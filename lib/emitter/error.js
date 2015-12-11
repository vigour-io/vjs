'use strict'
var Emitter = require('./')

module.exports = new Emitter({
  define: {
    emitInternal: function (error, event, bind, key, trigger, ignore) {
      var bound = this.getBound(event, bind)
      var data = bound && bound.data
      var original = error
      if (
        (!error && (error = 'emit')) ||
        typeof error === 'string'
      ) {
        let path = this.path
        if (path.length > 2) {
          path = path.slice(0, -2)
        }
        error = new Error(path.join('.') + ' ' + error)
      }
      if (data !== error) {
        if (!data || data === original) {
          data = this.setBind(event, bind, error)
        } else {
          if (!(data instanceof Array)) {
            data = this.setBind(event, bind, [data]).data
          }
          data.push(error)
        }
      }
      return Emitter.prototype
        .emitInternal.call(this, data, event, bind, key, trigger, ignore)
    }
  }
}).Constructor
