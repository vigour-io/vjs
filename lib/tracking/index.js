'use strict'
var trackingEmitter = require('./emitter')
var Emitter = require('../emitter')
/**
 * @function defaultTracking
 * passes information to datalayer to be send to tracking plugins
 * @param {Boolean | Object | Array | String}
 * @example
 */
function addTrackingListener (emitter, key, id) {
  emitter.on(function (event, meta) {
    trackingEmitter.emit(event, false, false, key, this, meta, id)
  }, 'track')
}

// make exclude like this if true then its ok
// makes it easy to use these kind of type checks
// exclude will be called condition then
// @todo replace exclude with include
function isNotEmitter (emitter) {
  return !(emitter instanceof Emitter)
}

function defaultTracking (id, event) {
  if (this._on) {
    this._on.each(addTrackingListener, isNotEmitter, id)
  }
  this.on('change', function (event, removed) {
    trackingEmitter.emit(event, false, false, 'change', this, removed, id)
  }, 'track')
}

function speshTracking (id, event) {
  if (this._on) {
    console.log('yes')
  }
}

exports.properties = {
  track: function (val, event) {
    if (val === true) {
      defaultTracking.call(this, this.path.join(' > '), event)
    }
    if (val.constructor === Array) {
      console.error("THIS'-----", this)
    }
    if (val.constructor === Object) {
      console.error("THIS'-----", val)
      speshTracking.call(this, val, event)
    }
    if (typeof val === 'string') {
      defaultTracking.call(this, val, event)
    }
    if (typeof val === 'function') {
      console.error("THIS'-----", this)
    }
  }
}
