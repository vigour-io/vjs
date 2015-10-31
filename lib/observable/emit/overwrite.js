'use strict'
var isPlainObj = require('vjs/lib/util/is/plainobj')

exports.instance = function (instance, data, key) {
  if (key === 'data') {
    console.log(data)
    if (isPlainObj(data)) {
      var pass
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
  }
}
