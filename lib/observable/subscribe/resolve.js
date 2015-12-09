'use strict'
module.exports = function resolvePattern (obs, map, emitterkey) {
  return resolve(obs, map, [], 0, emitterkey)
}

function resolve (obs, map, path, length, emitterkey) {
  if (typeof map !== 'object') {
    let pattern = obs._on[emitterkey].pattern
    if (!length) {
      return pattern.$upward || pattern
    }
    for (let i = length - 1; i >= 0; i--) {
      let key = path[i]
      if (key === '$parent') {
        pattern = pattern.$parent || pattern.$upward || pattern
      } else {
        pattern = pattern[key] || pattern.$upward && pattern.$upward[key]
      }
    }
    return pattern
  } else {
    for (let i in map) {
      let mapValue = map[i]
      if (i === 'val') {
        return resolve(obs, mapValue, path, length, emitterkey)
      } else {
        let next = obs[i]
        if (next) {
          if (i === 'parent') {
            path.push(obs.key)
          } else {
            path.push('$parent')
          }
          return resolve(next, mapValue, path, ++length, emitterkey)
        }
      }
    }
  }
}
