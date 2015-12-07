'use strict'
var isPlainObj = require('../../util/is/plainobj')

module.exports = function createData (origin, data) {
  if (isPlainObj(data)) {
    data.origin = origin
  } else {
    data = {
      origin: origin,
      data: data
    }
  }
  return data
}
