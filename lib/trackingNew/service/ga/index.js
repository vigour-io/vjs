'use strict'

var initialze = require('./initialze')
var pageview = require('./pageview')
var sendEvent = require('./event')

module.exports = function (obj) {
  sendEvent(obj.eventObject.eventType.val, obj.id.val)
}
