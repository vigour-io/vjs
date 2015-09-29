'use strict'
var Emitter = require('./index.js')
var _emit = Emitter.prototype.emitInternal
// make more complex

module.exports = new Emitter({
  define: {
    emitInternal: function (event, bind, error, key, trigger, ignore) {
      // event, bind, meta, key, trigger, ignore
      // this --> de current instance van de error emitter

      console.log('???')
      if (!error) {
        var path = this.path
        if (path.length > 2) {
          path = path.slice(0, -2)
        }
        error = new Error('error on observable: "' + path.join('.') + '" ')
      }

      var meta = this.meta
      if (!meta) {
        meta = this.meta = error
      } else {
        if (!(meta instanceof Array)) {
          meta = this.meta = [ this.meta ]
        }
        meta.push(error)
      }

      return _emit.call(this, event, bind, meta, key, trigger, ignore)
    }
  }
}).Constructor
