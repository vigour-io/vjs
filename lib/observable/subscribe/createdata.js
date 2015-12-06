'use strict'
module.exports = function createData (origin, data) {
  if (data && typeof data === 'object') {
    data.origin = origin
  } else {
    data = {
      origin: origin,
      previous: data
    }
  }
  return data
}
