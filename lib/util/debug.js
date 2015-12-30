'use strict'
exports.stack = function () {
  var arr = new Error().stack.match(/at ([a-zA-Z0-9\.]*?) /g)
  var r = []
  for (var i = 2; i < arr.length; i++) {
    r.push(arr[i].slice(3))
  }
  r.toString = function () {
    return '\n   ' + r.join('\n   ')
  }
  return r
}
