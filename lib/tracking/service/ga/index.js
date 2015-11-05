'use strict'

var tracker = require('./tracker')
var pageview = require('./pageview')
var sendEvent = require('./event')

module.exports = function (obj) {
  sendEvent(obj.eventObject.eventType.val, obj.id.val)
}
