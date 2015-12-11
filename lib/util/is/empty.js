'use strict'
module.exports = function isEmpty (obj) {
  var found
  if (obj.each) {
    obj.each(function (property, key) {
      if (property._input !== null) {
        return (found = true)
      }
    })
  } else {
    for (var key in obj) { // eslint-disable-line
      return false
    }
  }
  return !found
}
