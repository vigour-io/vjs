'use strict'

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
    return subscribe(this, path, index, length, type, val, id, fire)

    // on remove unsubscribe
    this.on('remove', function () {
      unsubscribe(this, path, index, length, id)
    }, id)
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
    return unsubscribe(this, path, index, length, id)
  },

  retrieve (path) {
    if (typeof path === 'string') {
      path = path.split('.')
    }
    let index = 0
    let length = path.length
    return retrieve(this, path, index, length)
  }
}

function retrieve (obs, path, index, length) {
  if (index === length) {
    return obs
  } else {
    let key = path[index]
    let property = obs[key]
    let found
    if (property) {
      found = retrieve(property, path, index + 1, length)
    }
    if (!found && obs._input) {
      found = retrieve(obs._input, path, index, length)
    }
    return found
  }
}

function subscribe (obs, path, index, length, type, val, id, fire) {
  if (index === length) {
    obs.on('remove', function () {

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

    if (property) {
      result = subscribe(property, path, index + 1, length, type, val, id, fire)
    } else {
      let listenerType = key === 'parent' ? key : 'property'
      let listener = function (data, event) {
        let property = obs[key]
        if (property) {
          obs.off(listenerType, id)
          subscribe(property, path, index + 1, length, type, val, id, true)
        }
      }
      obs.on(listenerType, listener, id)
    }

    // if sub is not fulfilled look in the reference
    if (!result && obs._input) {
      subscribe(obs._input, path, index, length, type, val, id, fire)
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
  // if ref unsubscribe ref
  if (obs._input) {
    unsubscribe(obs, path, index, length, id)
  }
}
