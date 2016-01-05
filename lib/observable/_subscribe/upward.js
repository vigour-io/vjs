'use strict'
var upListeners = require('./listeners/upward')
var onUpRef = upListeners.reference
var onUp = upListeners.direct
var mergeListener = require('./merge')
var incDepth = require('./current/inc/depth')

exports.define = {
  subUp (data, event, obs, pattern, current, mapvalue, map) {
    var fulfilled = this.subObj(data, event, obs, pattern, current, mapvalue, map)
    if (fulfilled) {
      return true
    }
    let id = this.uid + '.' + pattern.patternPath + '.dir_up'
    if (!mergeListener(obs, 'parentEmitter', id, mapvalue)) {
      obs.on('parent', [onUp, this, pattern, current, mapvalue], id)
    }

    let parent = obs.parent
    if (parent) {
      map[obs.key] = mapvalue
      return this.subUp(data, event, parent, pattern, incDepth(current), map, {})
    }
  },
  subUpRef (data, event, obs, pattern, current, mapvalue, map, context) {
    var fulfilled = this.subObjRef(data, event, obs, pattern, current, mapvalue, map, context)
    if (fulfilled) {
      return true
    }
    let id = this.uid + '.' + pattern.patternPath + '.ref_up'
    if (!mergeListener(obs, 'parentEmitter', id, mapvalue)) {
      obs.on('parent', [onUpRef, this, pattern, current, mapvalue, map, context], id)
    }
    let parent = obs.parent
    if (parent) {
      return this.subUpRef(data, event, parent, pattern, incDepth(current), mapvalue, map, context)
    }
  }
}
