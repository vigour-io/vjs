'use strict'

var ref = require('../../util/get/reference')

exports.inject = require('./retrieve')

exports.define = {
  subscribe (path, type, val, fire) {
    let id = this.uid
    let pathType = typeof path
    if (path === true) {
      id = ''
      path = []
    } else if (pathType === 'string') {
      id += path
      path = path.split('.')
    } else if (pathType === 'number') {
      id += path
      path = [path]
    } else {
      id += path.join('.')
    }
    let index = 0
    let length = path.length

    // on remove unsubscribe
    this.on('remove', function () {
      unsubscribe(this, path, index, length, id)
    }, id)

    return subscribe(this, path, index, length, type, val, id, fire, this)
  },

  unsubscribe (path) {
    let id = this.uid
    let pathType = typeof path
    if (pathType === 'string') {
      id += path
      path = path.split('.')
    } else if (pathType === 'number') {
      id += path
      path = [path]
    } else {
      id += path.join('.')
    }

    let index = 0
    let length = path.length
    return unsubscribe(this, path, index, length, id)
  }
}

function subscribe (obs, path, index, length, type, val, id, fire, origin) {
  if (index === length) {
    obs.on('remove', function () {
      subscribe(origin, path, 0, length, type, val, id, false, origin)
    }, id)
    obs.on(type, val, id)
    if (fire) {
      obs.emit(type)
    }
    return obs
  } else {
    let key = path[index]
    let property = obs[key]
    let result

    if (property && property._input !== null) {
      result = subscribe(property, path, index + 1, length, type, val, id, fire, origin)
    } else {
      let listenerType = key === 'parent' ? key : 'property'
      let listener = function (data, event) {
        let property = obs[key]
        if (property) {
          obs.off(listenerType, id)
          subscribe(property, path, index + 1, length, type, val, id, true, origin)
        }
      }
      obs.on(listenerType, listener, id)
    }

    // if sub is not fulfilled look in the reference
    if (!result) {
      let reference = ref(obs)
      if(reference){
        subscribe(reference, path, index, length, type, val, id, fire, origin)
      }
    }
  }
}

function unsubscribe (obs, path, index, length, id) {
  obs.off(void 0, id)
  let key = path[index]
  let property = obs[key]
  if (property) {
    unsubscribe(property, path, index + 1, length, id)
  }
  let reference = ref(obs)
  if (reference) {
    unsubscribe(obs, path, index, length, id)
  }
}
