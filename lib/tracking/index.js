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
function isEmitter (emitter) {
  return (emitter instanceof Emitter)
}

function defaultTracking (id, event) {
  if (this._on) {
    this._on.each(addTrackingListener, isEmitter, id)
  }
  var observable = this
  this.on('data', function (data, event) {
    trackingEmitter.emit(data, event, observable, 'data', void 0, id)
  }, 'track')
}

function addListenerKey (observable, key, event, property) {
  observable.on(key, function (data, event) {
    trackingEmitter.emit(data, event, observable, key, property)
  }, 'track')
}

function arrayTracking (array, event) {
  var el = array.length
  var observable = this
  for (var i = 0; i < el; i++) {
    addListenerKey(observable, array[i], event)
  }
}

//should work as arry but add function or string to event

function objectTracking (object, event) {
  var observable = this

  for (var key in object) {
    if (object.hasOwnProperty(key)) {
      addListenerKey(observable, key, event, object[key])
    }
  }
}

exports.properties = {
  track: function (val, event) {
    if (val === true) {
      defaultTracking.call(this, this.path.join(' > '), event)
    }
    if (val.constructor === Array) {
      arrayTracking.call(this, val, event)
    }
    if (val.constructor === Object) {
      objectTracking.call(this, val, event)
    }
    if (typeof val === 'string') {
      defaultTracking.call(this, val, event)
    }
    if (typeof val === 'function') {
    }
  }
}
