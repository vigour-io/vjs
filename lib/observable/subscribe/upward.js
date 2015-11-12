'use strict'
var upListeners = require('./listeners/upward')
var onUpRef = upListeners.reference
var onUp = upListeners.direct

exports.define = {
  subUp (data, event, obs, pattern, current, mapvalue, map) {
    var found = this.subObj(data, event, obs, pattern, current, mapvalue, map)
    if (found) {
      return true
    }
    let parent = obs.parent
    if (parent) {
      map[obs.key] = mapvalue
      return this.subUp(data, event, parent, pattern, current, map, {})
    }
    let on = obs._on
    if (on) {
      let listener = on.parentEmitter
      if (listener) {
        let attach = listener.attach
        if (attach) {
          let hash = this.key
          let haveThisListener = attach.each((prop, key) => {
            if (prop[0] === onUp && key === hash) {
              merge(prop[4], mapvalue)
              return true
            }
          })
          if (haveThisListener) {
            return
          }
        }
      }
    }
    obs.on('parent', [onUp, this, pattern, current, mapvalue, map], this.key)
  },
  subUpRef (data, event, obs, pattern, current, mapvalue, map, context) {
    if (this.subObjRef(data, event, obs, pattern, current, mapvalue, map, context)) {
      return true
    }
    let parent = obs.parent
    if (parent) {
      return this.subUpRef(data, event, parent, pattern, current, mapvalue, map, context)
    }
    obs.on('parent', [onUpRef, this, pattern, current, mapvalue, map, context], this.key)
  }
}

function merge (obj1, obj2) {
  for (var p in obj2) {
    let prop2 = obj2[p]
    let prop1 = obj1[p]
    if (prop1 && typeof prop2 === 'object') {
      obj1[p] = merge(prop1, prop2)
    } else {
      obj1[p] = prop2
    }
  }
  return obj1
}