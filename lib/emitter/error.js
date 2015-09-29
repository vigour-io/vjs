'use strict'
var Emitter = require('./index.js')

module.exports = new Emitter({
  define: {
    emitInternal: function (error, event, bind, key, trigger, ignore) {
      // event, bind, meta, key, trigger, ignore
      // this --> de current instance van de error emitter
      if (!error) {
        var path = this.path
        if (path.length > 2) {
          path = path.slice(0, -2)
        }
        error = new Error('error - observable: "' + path.join('.') + '" ')
      }

      var data = this.data
      if (!data) {
        data = this.data = error
      } else {
        if (!(data instanceof Array)) {
          data = this.data = [ this.data ]
        }
        data.push(error)
      }

      return Emitter.prototype
        .emitInternal.call(this, data, event, bind, key, trigger, ignore)
    }
  }
}).Constructor
