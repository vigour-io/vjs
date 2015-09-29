'use strict'
exports.generateId = function (base) {
  var val = (base._id ? (++base._id) : (base._id = 1))
  return val
}

exports.removeKeyFromOtherStores = function (key, type, emitter) {
  // clean this up later
  var types = {
    fn: true,
    base: true,
    attach: true
  }
  for (var type$ in types) {
    if (type$ !== type) {
      if (emitter[type$] && emitter[type$][key]) {
        emitter[type$].removeProperty(emitter[type$][key], key)
      }
    }
  }
}
