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

function addTrackingListener (emitter, key, base, data, id) {
  base = base._parent
  id = (id) ? id = id : id = emitter.path.join('.');

  emitter.on(function (data, event) {
    trackingEmitter.emit(data, event, base, key, false, id)
  }, 'track')
}

function addMultipleListeners (emitter, key, base, data, id) {
  var observable = this
  var keyValue = base

  base = this._parent

  this.on(emitter, function (data, event) {
    id = this._on[emitter].path.join('.')
    data = keyValue
    trackingEmitter.emit(data, event, base, key, false, id)
  }, 'track')
}

function defaultTracking (event, val) {
  var observable = this

  if (observable._on) {
    observable._on.each(addTrackingListener, isEmitter)
  }

  if (val.constructor === Object) {
    for (var key in val) {
      if (val.hasOwnProperty(key)) {
        addMultipleListeners.call(this, key, event, val[key])
      }
    }
  }

  if (val.constructor === Array) {
    var el = val.length
    for (var i = 0; i < el; i++) {
      addMultipleListeners.call(this, val[i], event, void 0)
    }
  }

  if (typeof val === 'string') {
    addTrackingListener.call(this, this, event, val, void 0, val)
  }
}

exports.properties = {
  track: function (val, event) {
    var observable = this
      defaultTracking.call(this, event, val)
  }
}
