'use strict'
module.exports = function (current) {
  return (current >> 24) & 0xff
}
