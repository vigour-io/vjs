'use strict'
var Base = require('../base/')

module.exports = new Base({
  app: 'my app id',
  id: 'event',
  eventobject: {
    eventOriginator: '',
    eventType: '',
    stamp: ''
  }
}).Constructor
