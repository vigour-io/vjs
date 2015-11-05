'use strict'
var trackingEmitter = require('./emitter')
var trackingObject = require('./properties')

/**
 * @function defaultTracking
 * passes information to datalayer to be send to tracking plugins
 * @param {Boolean | Object | Array | String}
 * @example
 */

function track (data, event, type, object = data) {
  let listener = this._on[event.type]
  if (listener) {
    if (data === null) { listener.key = event.type = 'remove' }
    let id = typeof type === 'string' ? type : listener.path.join('.')
    trackingEmitter.emit(object, event, this, listener.key, false, id)
  }
}

exports.properties = {
  track: trackingObject
}
