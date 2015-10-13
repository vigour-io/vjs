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
  console.log('?????', key)
  base = base._parent
  id = (id) ? id = id : id = emitter.path.join('.')

  emitter.on(function (data, event) {
    trackingEmitter.emit(data, event, base, key, false, id)
  }, 'track')
}

function addMultipleListeners (key, event) {
  var keyValue = key

  if (key === 'parent' || key === 'remove') {
    key = key + 'Emitter'
  }

  var base = this._parent

  console.log('hey key!', key)

  this.on(key, function (data, event) {
    var id = this._on[key].path.join('.')
    data = keyValue
    trackingEmitter.emit(data, event, base, key, false, id)
  }, 'track')
}

function defaultTracking (event, val) {
  var observable = this

  // @todo: this is still worng you dont always want to track everything
  // only do this when tru
  if (val === true && observable._on) {
    observable._on.each(addTrackingListener, isEmitter)
  }
  if (val instanceof Array) {
    let length = val.length
    for (let i = 0; i < length; i++) {
      addMultipleListeners.call(this, val[i], event, void 0)
    }
  } else {
    let type = typeof val
    if (type === 'object') {
      for (let key in val) {
        console.log('--->', val, key)
        addMultipleListeners.call(this, key, event, void 0, val[key])
      }
    } else if (type === 'string') {
      addTrackingListener.call(this, this, event, val, void 0, val)
    }
  }
}

exports.properties = {
  track: function (val, event) {
    defaultTracking.call(this, event, val)
  }
}
