'use strict'
var Emitter = require('./index.js')
var include = require('../util/include')
var ADDED = 'added'
var REMOVED = 'removed'

module.exports = new Emitter({
  triggerEvent: false,
  define: {
    emitInternal: function (event, bind, meta, key, trigger, ignore) {

      console.error(meta)

      return Emitter.prototype.emitInternal.apply(this, arguments)
    }
  }
}).Constructor
