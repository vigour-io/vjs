'use strict'

var ref = require('../../util/get/reference')

exports.inject = require('./retrieve')

exports.define = {
  subscribe (path, type, val, key, fire, event) {
    let id = this.uid
    if (key) {
      id += '.' + key
    }
    let pathType = typeof path
    if (path === true) {
      path = [] // make faster
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
    // unsubs will not work now
    this.on('remove', function () {
      unsubscribe(this, path, index, length, id)
    }, id)
    return subscribe(this, path, index, length, type, val, id, fire, this, event)
  },

  // test and make better -- the uid is crap now
  unsubscribe (path, key) {
    let id = this.uid
    if (key) {
      id += '.' + key
    }
    // make shared shit
    let pathType = typeof path
    if (path === true) {
      path = [] // make faster
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
    return unsubscribe(this, path, index, length, id)
  }
}

// subscriptions have to take care of references
// we have to add walking over the refs here

function subscribe (obs, path, index, length, type, val, id, fire, origin, event) {
  if (index === length) {
    obs.on('remove', function () {
      // null
      subscribe(origin, path, 0, length, type, val, id, false, origin)
    }, id)
    obs.on(type, val, id)
    if (fire) {
      // need to have some godamn arguments
      if (typeof val === 'function') {
        val.call(obs, void 0, event)
      } else {
        val = val[0]
        val.call(obs, void 0, event, val[1])
      }
      // val.call(obs, event, )
      // obs.emit(type, void 0, event)
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
      if (reference) {
        subscribe(reference, path, index, length, type, val, id, fire, origin)
      }
    }
  }
}

function unsubscribe (obs, path, index, length, id) {
  console.log('REMOVE!')
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
