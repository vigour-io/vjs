'use strict'
var isNumberLike = require('./').isNumberLike
var isEmpty = require('./').isEmpty

module.exports = exports = toArray

function toArray (obj) {
  // var convertToArray = true

  if (!isEmpty(obj) && typeof obj === 'object') {
    var onlyNumbers = true
    var i
    for (i in obj) {
      if (!isNumberLike(i)) {
        onlyNumbers = false
        break
      }
    }
    if (onlyNumbers) {
      var keys = Object.keys(obj)
      keys.sort()
      var last = -1
      var ordered = true
      for (var j in keys) {
        if (keys[j] - last !== 1) {
          ordered = false
          break
        }
        last = keys[j]
      }
      if (!ordered) {
        // console.error(keys)
      } else {
        // this is an array
        var oldobj = obj
        obj = []
        for (i in keys) {
          obj.push(oldobj[keys[i]])
        }
      }
    }
  }
}
