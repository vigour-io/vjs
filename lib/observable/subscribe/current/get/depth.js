'use strict'
module.exports = function (current) {
  return (current >> 16) & 0xff
}
