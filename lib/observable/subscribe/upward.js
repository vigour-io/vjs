'use strict'
var upListeners = require('./listeners/upward')
var onUpRef = upListeners.reference
var onUp = upListeners.direct

exports.define = {
  subUp (data, event, obs, pattern, current, mapvalue, map) {
    var found = this.subObj(data, event, obs, pattern, current, mapvalue, map)
    if (found) return true
    let parent = obs.parent
    if (parent) {
      map[obs.key] = mapvalue
      return this.subUp(data, event, parent, pattern, current, map, {})
    }

    obs.on('parent', [onUp, this, pattern, current, mapvalue], this.uid)
  },
  subUpRef (data, event, obs, pattern, current, mapvalue, map, context) {
    var found = this.subObjRef(data, event, obs, pattern, current, mapvalue, map, context)
    if (found) return true
    let parent = obs.parent
    if (parent) {
      return this.subUpRef(data, event, parent, pattern, current, mapvalue, map, context)
    }
    obs.on('parent', [onUpRef, this, pattern, current, mapvalue, map, context], this.uid)
  }
}

