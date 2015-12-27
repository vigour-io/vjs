'use strict'
var Event = require('../event')
exports.Data = function DataEvent () {
  Event.apply(this, arguments)
}
exports.Data.prototype = new Event()
exports.Data.prototype.type = 'data'
