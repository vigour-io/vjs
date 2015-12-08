'use strict'
var upListeners = require('./listeners/upward')
var onUpRef = upListeners.reference
var onUp = upListeners.direct
var mergeListener = require('./merge')
exports.define = {
  subUp (data, event, obs, pattern, current, mapvalue, map) {
    // console.log('- - subup:', obs.path, '\n',JSON.stringify(mapvalue,false,2))
    var found = this.subObj(data, event, obs, pattern, current, mapvalue, map)
    if (found) {
      return true
    }

    // TODO remove Math.random()!
    if (!mergeListener(obs, 'parentEmitter', this.uid, mapvalue)) {
      obs.on('parent', [onUp, this, pattern, current, mapvalue], this.uid)
    }

    let parent = obs.parent
    if (parent) {
      map[obs.key] = mapvalue
      return this.subUp(data, event, parent, pattern, current, map, {})
    }
  },
  subUpRef (data, event, obs, pattern, current, mapvalue, map, context) {
    var found = this.subObjRef(data, event, obs, pattern, current, mapvalue, map, context)
    if (found) return true
    let parent = obs.parent

    obs.on('parent', [onUpRef, this, pattern, current, mapvalue, map, context], this.uid)

    if (parent) {
      return this.subUpRef(data, event, parent, pattern, current, mapvalue, map, context)
    }
  }
}

