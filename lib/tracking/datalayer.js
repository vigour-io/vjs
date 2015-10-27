'use strict'
var Base = require('../base/')
Base.prototype.inject(
  require('../methods/plain')
)

// Event.prototype.inject(require('../../../../lib/event/toString'))


module.exports = new Base({
  app: 'my app id',
  id: '',
  eventobject: {
    eventOriginator: '',
    eventType: '',
    stamp: ''
  }
}).Constructor
