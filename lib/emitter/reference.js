'use strict'
var Emitter = require('./index.js')

module.exports = new Emitter({
  define: {
    executeQueue: true,
    // executeInstances: true,
    emit: function (event, bind, force) {
      if (this.lastStamp !== event.stamp || !this.hasOwnProperty('lastStamp')) {
        // var meta = this.meta
        if (!force) {
          this.queue(bind, event)
        } else {
          if (bind) {
            this.bind(bind, event)
          }
          this.exec(event)
        }
      } else if (this.meta) {
        console.warn(JSON.stringify(this.meta, false, 2), 'remove meta from property emitter double check if this ok!')
        // wont this remove meta of i call emit twice?
        this.meta = null
      }
    }
  }
}).Constructor
