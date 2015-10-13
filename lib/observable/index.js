'use strict'
var Base = require('../base')

module.exports = new Base({
  inject: [
    require('./on'),
    require('./emit'),
    require('./off'),
    require('./remove'),
    require('./set'),
    require('./stream'),
    require('./subscribe'),
    require('./constructor')
  ],
  ChildConstructor: 'Constructor'
}).Constructor
