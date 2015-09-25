'use strict'
var Base = require('../base')

module.exports = new Base({
  ChildConstructor: 'Constructor',
  inject: [
    require('./on'),
    require('./emit'),
    require('./off'),
    require('./remove'),
    require('./set'),
    require('./constructor'),
    // require('./stream')
    require('./subscribe')
  ]
}).Constructor
