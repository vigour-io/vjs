'use strict'
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
            merge(attached[4], mapvalue)
            return true
          }
        }
      }
    }
  }
}

const OBJ = 'object'

function merge (a, b) {
  if (typeof a !== OBJ) {
    return
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
  return
}
