'use strict'
var isPlainObj = require('../../util/is/plainobj')

// the problem is -- has own property is not the case here its about comparing with yourself!

module.exports = function (origin, instance, data, key) {
  if (key === 'data') {
    if (isPlainObj(data)) {
      let pass
      if (data.val) {
        if (instance._input !== origin._input) {
          return true
        }
      }
      // this part!
      for (let i in data) {
        // needs to change for context
        // get underscore properties first
        // use underscores
        if (
          !instance.hasOwnProperty(i)
        ) {
          pass = true
          break
        }
      }
      if (!pass) {
        return true
      }
    } else if (instance._input !== origin._input) {
      return true
    }
  } else if (key === 'property') {
    if (
      // needs to change for context
      // instance[data] !== origin[data]
      instance.hasOwnProperty(data) ||
      instance.hasOwnProperty('_' + data) // check underscores for removes
    ) {
      return true
    }
  }
}
