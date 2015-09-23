var OBJ = 'object'

module.exports = function merge (a, b) {
  for (var key in b) {
    var bProp = b[key]
    if (typeof bProp === OBJ) {
      var aProp = a[key]
      if (typeof aProp !== OBJ) {
        a[key] = aProp = {}
      }
      merge(aProp, bProp)
    } else {
      a[key] = bProp
    }
  }
}
