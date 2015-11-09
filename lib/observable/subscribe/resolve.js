'use strict'
module.exports = function resolvePattern (obs, map) {
  return resolve(obs, map, [], 0)
}

function resolve (obs, map, path, length) {
  if (typeof map !== 'object') {
    console.error('obs',obs, map)
    let pattern = obs.pattern
    console.error('obs',pattern, length)
    if (!length) {
      return pattern.upward || pattern
    }
    for (let i = length - 1; i >= 0; i--) {
      let key = path[i]
      if (key === 'sub_parent') {
        console.error('pattern',pattern)
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
          console.log('>>>',obs, next, JSON.stringify(mapValue,false,2), i,JSON.stringify(map,false,2))
          return resolve(next, mapValue, path, ++length)
        }
      }
    }
  }
}
