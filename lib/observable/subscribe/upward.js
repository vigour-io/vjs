'use strict'
var upListeners = require('./listeners/upward')
var onUpRef = upListeners.reference
var onUp = upListeners.direct

exports.define = {
  subUp (data, event, obs, pattern, current, mapvalue, map) {
    if (this.subObj(data, event, obs, pattern, current, mapvalue, map)) {
      return true
    }
    let parent = obs.parent
    if (parent) {
      map[obs.key] = mapvalue
      return this.subUp(data, event, parent, pattern, current, map, {})
    }
    obs.on('parent', [onUp, this, pattern, current, mapvalue, map])
  },
  subUpRef (data, event, obs, pattern, current, mapvalue, map, context) {
    if (this.subObjRef(data, event, obs, pattern, current, mapvalue, map, context)) {
      return true
    }
    let parent = obs.parent
    if (parent) {
      map[obs.key] = mapvalue
      return this.subUpRef(data, event, parent, pattern, current, map, {}, context)
    }
    obs.on('parent', [onUpRef, this, pattern, current, mapvalue, map, context])
  }
}
