'use strict'
var isPlainObj = require('../../util/is/plainobj')
// the problem is -- has own property is not the case here its about comparing with yourself!
module.exports = function (origin, instance, data, key) {
  if (key === 'data') {
    if (isPlainObj(data)) {
      let pass
      // if (data.val) {
      //   if (instance._input !== origin._input) {
      //     pass = true
      //   }
      // }
      for (let i in data) {
        if (i === 'val') {
          if (data.val && instance._input === origin._input) {
            pass = true
            break
          }
        }
        // context is not correct -- should not happen
        else if (
          // problem instance is allready set
          !instance.hasOwnProperty(i)
          // instance[i] !== origin[i]
          // instance property is not the same thats whats going wrong
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
