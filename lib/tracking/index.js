'use strict'
var trackingEmitter = require('./emitter')
var Emitter = require('../emitter')

/**
 * @function passes information to datalayer to be send to tracking plugins
 * @param  {Boolean}
 * @param  {Object}
 * @param  {Array}
 * @param  {String}
 * @example
 */

function defaultTracking (id, event) {
  if (this.$on) {
    for (var i in this.$on) {
      if (i[0] !== '_' && this.$on[i] instanceof Emitter && i !== '$change') {
        loopdingetje(this.$on[i], i)
      }
    }
    function loopdingetje (emitter, key) {
      emitter.on(function (event, meta) {
        trackingEmitter.emit(event, false, false, key, this, meta, id)
      }, 'track')
    }
  }
  this.on('$change', function (event, removed) {
    trackingEmitter.emit(event, false, false, '$change', this, removed, id)
  }, 'track')
}

function speshTracking (obj) {
  console.log('spesh!', obj)
}

exports.$flags = {
  $track: function (val, event) {
    if (val === true) {
      defaultTracking.call(this, this.$path.join(' > '), event)
    }
    if (val.constructor === Array) {
      console.error('THIS\'-----', this)
    }
    if (val.constructor === Object) {
      console.error('THIS\'-----', this)
    }
    if (typeof val === 'string') {
      // defaultTracking.call( this, 'hahah', event)
      defaultTracking.call(this, val, event)
    }
    if (typeof val === 'function') {
      console.error('THIS\'-----', this)
    }
  }
}
