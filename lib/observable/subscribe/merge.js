'use strict'

function merge (a, b) {
  for (let key in b) {
    let aProp = a[key]
    a[key] = aProp ? merge(aProp, b[key]) : b[key]
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
          return true
        }
      }
    }
  }
}
