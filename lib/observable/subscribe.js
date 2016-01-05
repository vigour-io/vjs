'use strict'

// obs.subscribe('a', ...)
exports.define = {
  subscribe (path, type, val, fire) {
    let id = this.uid
    if (path instanceof Array) {
      // hashedpath
      id += path.join('.')
    } else {
      id += path
    }
    let index = 0
    let length = path.length
    subscribe(this, path, index, length, type, val, id, fire)
  },

  unsubscribe (path) {
    let id = this.uid
    if (path instanceof Array) {
      // hashedpath
      id += path.join('.')
    } else {
      id += path
    }
    let index = 0
    let length = path.length
    unsubscribe(this, path, index, length, id)
  }
}

function subscribe (obs, path, index, length, type, val, id, fire) {
  if (index === length) {
    obs.on(type, val, id)
    if (fire) {
      obs.emit(type)
    }
  } else {
    let key = path[index++]
    let property = obs[key]
    if (property) {
      subscribe(property, path, index, length, type, val, id, fire)
    } else {
      let listenerType = key === 'parent' ? key : 'property'
      obs.on(listenerType, function (data, event) {
        let property = obs[key]
        if (property) {
          subscribe(property, path, index, length, type, val, id, true)
          obs.off(listenerType, id)
        }
      }, id)
    }
  }
}

function unsubscribe (obs, path, index, length, id) {
  if (index !== length) {
    obs.off(void 0, id)
    let key = path[index++]
    let property = obs[key]
    if (property) {
      unsubscribe(property, path, index, length, id)
    }
  }
}
