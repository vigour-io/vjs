'use strict'
// var merge = require('../../util/merge')

module.exports = function mergeListener (obs, type, key, mapvalue) {
  if (typeof mapvalue === 'object') {
    let on = obs._on
    if (on) {
      let listener = on[type]
      if (listener) {
        let attach = listener.attach
        if (attach) {
          let attached = attach[key]
          if (attached) {
            console.log('attached:', JSON.stringify(attached[4], false, 2))
            console.log('mapvalue:', JSON.stringify(mapvalue, false, 2))
            attached[2][3] = merge(attached[4], mapvalue)
            console.log('result:', JSON.stringify(attached[2][3], false, 2))
            return true
          }
        }
      }
    }
  }
}

const OBJ = 'object'

function merge (a, b, checked) {
  if (typeof a !== OBJ) {
    a = { val: a }
  }
  for (let key in b) {
    let bProp = b[key]
    if (typeof bProp === OBJ) {
      let aProp = a[key]
      if (typeof aProp !== OBJ) {
        a[key] = aProp = aProp ? {val: aProp} : {}
      }
      merge(aProp, bProp)
    } else {
      a[key] = bProp
    }
  }
  return a
}
