'use strict'
var isPlainObj = require('../../util/is/plainobj')

exports.instance = function (instance, data, key) {
  if (key === 'data') {
    if (isPlainObj(data)) {
      let pass
      if (data.val) {
        if (instance.hasOwnProperty('_input')) {
          return true
        }
      }
      for (let i in data) {
        if (!instance.hasOwnProperty(i)) {
          pass = true
          break
        }
      }
      if (!pass) {
        return true
      }
    } else if (instance.hasOwnProperty('_input')) {
      return true
    }
  } else if (key === 'property') {
    if (
      instance.hasOwnProperty(data) ||
      instance.hasOwnProperty('_' + data) // check underscores for removes
    ) {
      return true
    }
  }
}
