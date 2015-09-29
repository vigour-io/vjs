'use strict'
var trackingEmitter = require('./emitter')
var Emitter = require('../emitter')
/**
 * @function defaultTracking
 * passes information to datalayer to be send to tracking plugins
 * @param {Boolean | Object | Array | String}
 * @example
 */
function addTrackingListener (emitter, key, base, id) {
  base = base._parent
  emitter.on(function (data, event) {
    trackingEmitter.emit(data, event, base, key, false, id)
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
  var observable = this
  this.on('data', function (data, event) {
    // (data, event, bind, key, ignore, id)
    trackingEmitter.emit(data, event, observable, 'data', void 0, id)
  }, 'track')
}

function speshTracking (id, event) {
  if (this._on) {
    // console.log('yes')
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
