'use strict'
const OBJ = 'object'

module.exports = function merge (a, b, skipCheck) {
  if (!skipCheck && typeof a !== OBJ) {
    return a
  }
  for (let key in b) {
    let bProp = b[key]
    if (typeof bProp === OBJ) {
      let aProp = a[key]
      if (typeof aProp !== OBJ) {
        a[key] = aProp = {}
      } else {
        merge(aProp, bProp, true)
      }
    } else {
      a[key] = bProp
    }
  }
  return a
}
