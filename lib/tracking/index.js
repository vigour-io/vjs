'use strict'
var trackingEmitter = require('./emitter')
var Emitter = require('../emitter')
/**
 * @function defaultTracking
 * passes information to datalayer to be send to tracking plugins
 * @param {Boolean | Object | Array | String}
 * @example
 */

// make exclude like this if true then its ok
// makes it easy to use these kind of type checks
// exclude will be called condition then
// @todo replace exclude with include
function isEmitter (emitter) {
  return (emitter instanceof Emitter)
}

function defaultTracking (id, event) {
  var observable = this

  if (observable._on) {
    observable._on.each(addTrackingListener, isEmitter, id)
  }
  addTrackingListener (observable, 'data', event, id)
}

function addTrackingListener (emitter, key, base, data, id) {
  if (id === void 0) {
    id = emitter.path.join(' > ')
  }

  var keyValue = data
  base = base._parent

  emitter.on(function (data, event) {
    trackingEmitter.emit(data, event, base, key, false, id)
  }, 'track')

  emitter.on(key, function (data, event) {
    data = keyValue
    trackingEmitter.emit(data, event, base, key, false, id)
  }, 'track')
}

// function addListenerKey (observable, key, event, data, id) {
//   var keyValue = data
//   if (id === void 0) {
//     id = observable.path.join(' > ')
//   }
//   console.log('>>>>>>>>>>>>>>',observable)
//   observable.on(key, function (data, event) {
//     trackingEmitter.emit(keyValue, event, observable, key, void 0, id)
//   }, 'track')
// }

function arrayTracking (array, event) {
  var el = array.length
  var observable = this
  for (var i = 0; i < el; i++) {
    addTrackingListener (observable, array[i], event, void 0)
    // addListenerKey(observable, array[i], event, void 0)
  }
}

function objectTracking (object, event) {
  var observable = this
  for (var key in object) {
    if (object.hasOwnProperty(key)) {
      addTrackingListener(observable, key, event, object[key])
    }
  }
}

exports.properties = {
  track: function (val, event) {
    if (val.constructor === Object) {
      objectTracking.call(this, val, event)
    }
    if (val.constructor === Array) {
      arrayTracking.call(this, val, event)
    }
    if (val === true) {
      defaultTracking.call(this, this.path.join(' > '), event)
    }
    if (typeof val === 'string') {
      defaultTracking.call(this, val, event)
    }
  }
}
