'use strict'

// var flatten = require('../../util/flatten')

function merge (a, b) {
  if (a !== b) {
    for (let key in b) {
      // if (key !== 'parent') {
        let aProp = a[key]
        a[key] = aProp ? merge(aProp, b[key]) : b[key]
      // }
    }
  }
  return a
}

module.exports = function mergeListener (obs, type, key, mapvalue) {
  let on = obs._on
  if (on) {
    let listener = on[type]
    if (listener) {
      let attach = listener.attach
      if (attach) {
        let attached = attach[key]
        if (attached) {
          attached = attached[2]
          attached[3] = merge(attached[3], mapvalue)
          // console.log(obs.path.join('.'), type, JSON.stringify(attached[3], false, 2))
          // try {
          //   console.log(obs.path.join('.'))
          //   console.log(JSON.stringify( flatten(attached[3]), false, 2 ))
          // } catch (e) {
          //   console.error(obs.path.join('.'), attached[3])
          // }
          // console.log(':::',obs.path)
          // console.log(JSON.stringify(flatten(attached[3]), false, 2))
          return true
        }
      }
    }
  }
}
