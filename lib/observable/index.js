'use strict'
var Base = require('../base')

module.exports = new Base({
  inject: [
    require('./constructor'),
    require('./on'),
    require('./emit'),
    require('./off'),
    require('./remove'),
    require('./set'),
    require('./stream'),
    require('./subscribe')
  ],
  ChildConstructor: 'Constructor'
}).Constructor
