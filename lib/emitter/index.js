'use strict'
var Base = require('../base')
var Event = require('../event')

/**
 * @namespace Emitter
 * @class
 * @augments base
 * @param  {*} val
 *  difference with base -- sets listeners for each key
 *  if there is a function will set a listener on fn val
 * @return {base}
 */
module.exports = new Base({
  inject: [
    require('./storage'),
    require('./condition'),
    require('./exec'),
    require('./bind'),
    require('./off'),
    require('./on')
  ],
  properties: {
    // properties true sets the default property handler (sets whatever you put in there)
    secondary: true
  },
  define: {
    useVal: true,
    executeQueue: true,
    instances: true,
    emit: function (event, bind, force, meta) {
      if (!event) {
        event = new Event(this, this.key)
      }
      if (meta) {
        this._meta = meta
      }
      if (this.lastStamp !== event.stamp || !this.hasOwnProperty('lastStamp')) {
        this._emitting = true
        if (bind && ((!force) &&
          (event.type !== this.key ||
            event.origin !== bind ||
            event.context !== bind._context))
        ) {
          this.push(bind, event)
        } else {
          if (bind || !force) {
            this.bind(bind, event)
          }
          if (!event.block) {
            this.exec(event)
          }
        }
      }
    }
  }
}).Constructor
