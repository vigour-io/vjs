'use strict'
exports.define = {
  retrieve (path, fn) {
    let pathType = typeof path
    if (pathType === 'string') {
      path = path.split('.')
    } else if (pathType === 'number') {
      path = [path]
    }
    let index = 0
    let length = path.length
    return fn ? retrieveAndDo(this, path, index, length, fn) : retrieve(this, path, index, length)
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

function retrieveAndDo (obs, path, index, length, fn) {
  fn(obs)
  if (index === length) {
    return obs
  } else {
    let key = path[index]
    let property = obs[key]
    let found
    if (property) {
      found = retrieveAndDo(property, path, index + 1, length, fn)
    }
    if (!found && obs._input) {
      found = retrieveAndDo(obs._input, path, index, length, fn)
    }
    return found
  }
}
