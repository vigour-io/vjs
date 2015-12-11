'use strict'
module.exports = function createData (origin, data) {
  if (data.constructor === Array) {
    return data
  }
  return {
    origin: origin,
    data: data
  }
}
