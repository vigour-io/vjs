var timestamp = require('monotonic-timestamp')
var isNode = require('./is/node')
var hash = require('./hash')
var rand = ~~(Math.random()*10000)
var stamp = timestamp()
var uuid
if (isNode) {
  uuid = 'n-' + process.pid + '-' + stamp + '-' + rand
} else {
  uuid = 'b-' +  + '-' + stamp + '-' + rand
}
module.exports = hash(uuid)
