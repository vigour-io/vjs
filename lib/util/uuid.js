var isNode = require('./is/node')
var hash = require('./hash')
// var murmurHash3 = require('murmurhash3js')
var rand = ~~(Math.random() * 10000)
var stamp = Date.now()
exports.val = hash(
  isNode
  ? 'n-' + process.pid + '-' + stamp + '-' + rand
  : 'b-' + stamp + '-' + rand
)
