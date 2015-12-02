'use strict'
module.exports = function resolvePattern (obs, map, emitterkey) {
  return resolve(obs, map, [], 0, emitterkey)
}

function resolve (obs, map, path, length, emitterkey) {
  if (typeof map !== 'object') {
    let pattern = obs._on[emitterkey].pattern
    if (!length) {
      return pattern.upward || pattern
    }
    for (let i = length - 1; i >= 0; i--) {
      let key = path[i]
      if (key === 'sub_parent') {
        pattern = pattern.sub_parent || pattern.upward || pattern
      } else {
        pattern = pattern[key]
      }
    }
    return pattern
  } else {
    for (let i in map) {
      let mapValue = map[i]
      if (mapValue) {
        let next = obs[i]
        if (next) {
          if (i === 'parent') {
            path.push(obs.key)
          } else {
            path.push('sub_parent')
          }
          return resolve(next, mapValue, path, ++length, emitterkey)
        }
      }
    }
  }
}
