var timestamp = require('monotonic-timestamp')
var isNode = require('./is/node')
var hash = require('./hash')
var rand = ~~(Math.random() * 10000)
var stamp = timestamp()
exports.val = hash(
  isNode
  ? 'n-' + process.pid + '-' + stamp + '-' + rand
  : 'b-' + stamp + '-' + rand
)

// exports.val = parseInt( exports.val, 32)

//
// var string = exports.val
// var result = []
//
// for (var i in string) {
//   result.push(string.charCodeAt(i))
// }
//
// console.log(string)
// var nr = result.join('')
// exports.val = nr
