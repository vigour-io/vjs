'use strict'
var cnt = 100
function merge (a, b) {
  if (b === a) {
    return a
  }
  for (let key in b) {
    let aProp = a[key]
    // if(!cnt--){
    //   debugger
    //   return
    // }
    a[key] = aProp ? merge(aProp, b[key]) : b[key]
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
            attached[3] = merge(attached[3], mapvalue)
            return true
          }
        }
      }
    }
  }
}
