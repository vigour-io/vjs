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
