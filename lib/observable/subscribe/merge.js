'use strict'
const OBJ = 'object'

function merge (a, b, checked) {
  if (typeof a !== OBJ) {
    a = { val: a }
  }
  for (let key in b) {
    let bProp = b[key]
    if (typeof bProp === OBJ) {
      let aProp = a[key]
      if (aProp === void 0) {
        a[key] = aProp = {}
      }
      merge(aProp, bProp)
    } else {
      a[key] = bProp
    }
  }
  return a
}

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
            attached[2][3] = merge(attached[4], mapvalue)
            return true
          }
        }
      }
    }
  }
}
