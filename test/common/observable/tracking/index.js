// var Observable = require('../../../../lib/observable/')
// var tracking = require('../../../../lib/tracking/')
var trackerEmitter = require('../../../../lib/tracking/emitter')
var Event = require('../../../../lib/event/')

// trackerEmitter.inject(require('../../../../lib/tracking/service/log'))
// this is just to log stuff (.toString yields nicer result for events)
// trackerEmitter.inject(require('../../../../lib/tracking/service/log'))
Event.prototype.inject(require('../../../../lib/event/toString'))
// parent and error are still weird

Event.prototype.inject(require('../../../../lib/event/toString'))
describe('Direct tracking', function () {
  describe('Default', function () {
    require('./default.js')
  })
  describe('Objects', function () {
    require('./object.js')
  })
  describe('Arrays', function () {
    require('./array.js')
  })
  describe('Strings', function () {
    require('./string.js')
  })
})
