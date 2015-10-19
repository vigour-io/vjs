'use strict'
const OBJ = 'object'

module.exports = function merge (a, b) {
  for (let key in b) {
    let bProp = b[key]
    if (typeof bProp === OBJ) {
      let aProp = a[key]
      if (typeof aProp !== OBJ) {
        a[key] = aProp = {}
      }
      merge(aProp, bProp)
    } else {
      a[key] = bProp
    }
  }
}
