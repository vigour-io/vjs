'use strict'

exports.define = {
  subscribe (path, type, val, fire) {
    let id = this.uid
    if (typeof path === 'string') {
      id += path
      path = path.split('.')
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
    if (typeof path === 'string') {
      id += path
      path = path.split('.')
    } else {
      id += path.join('.')
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
    if (!result && obs._input) {
      subscribe(obs._input, path, index, length, type, val, id, fire, origin)
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
