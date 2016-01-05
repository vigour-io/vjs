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
    subscribe(this, path, index, length, type, val, id, fire)

    // on remove unsubscribe
    this.on('remove', function () {
      unsubscribe(this, path, index, length, id)
    }, id)
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
    unsubscribe(this, path, index, length, id)
  }
}

function subscribe (obs, path, index, length, type, val, id, fire) {
  if (index === length) {
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
      obs.on(listenerType, function (data, event) {
        let property = obs[key]
        if (property) {
          obs.off(listenerType, id)
          subscribe(property, path, index + 1, length, type, val, id, true)
        }
      }, id)
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
