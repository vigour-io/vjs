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
      aProp = merge(aProp, bProp)
    } else {
      if (typeof a[key] === OBJ) {
        a[key].val = bProp
      } else {
        a[key] = bProp
      }
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
            attached = attached[2]
            // console.log('a...',JSON.stringify(attached[3], false, 2))
            // console.log('b...',JSON.stringify(mapvalue, false, 2))
            attached[3] = merge(attached[3], mapvalue)
            // console.error('makes:',JSON.stringify(attached[3], false, 2))
            return true
          }
        }
      }
    }
  }
}
