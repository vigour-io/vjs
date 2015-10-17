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
  id = (id) ? id = id : id = emitter.path.join('.')
  emitter.on(function (data, event) {
    trackingEmitter.emit(data, event, base, key, false, id)
  }, 'track')
}

function addMultipleListeners (key, event) {
  var keyValue = key
  var base = this._parent

  if (key === 'parent' || key === 'remove') {
    key = key + 'Emitter'
  }
  this.on(key, function (data, event) {
    var id = this._on[key].path.join('.')
    data = keyValue
    trackingEmitter.emit(data, event, base, key, false, id)
  }, 'track')
}


function defaultTracking (event, val) {
  var observable = this
  if (observable._on) {
    observable._on.each(addTrackingListener, isEmitter)
  }
}

function arrayTracking (event, val) {
  let length = val.length
  for (let i = 0; i < length; i++) {
    addMultipleListeners.call(this, val[i], event, void 0)
  }
}

function objectTracking (event, val) {
  for (let key in val) {
    addMultipleListeners.call(this, key, event, void 0, val[key])
  }
}

exports.properties = {
  track: function (val, event) {
    if (val === true) {
      defaultTracking.call(this, event)
    }
    if (val instanceof Array) {
      arrayTracking.call(this, event, val)
    } else {
      let type = typeof val
      if (type === 'object') {
        objectTracking.call(this, event, val)
      }
      else if (type === 'string') {
        addTrackingListener.call(this, this, event, val, void 0, val)
      }
    }
  }
}
