'use strict'
var Base = require('../base')

var Observable = module.exports = new Base({
  inject: [
    require('./constructor'),
    require('./on'),
    require('./emit'),
    require('./off'),
    require('./remove'),
    require('./set'),
    require('./subscribe')
  ],
  properties: {
    $: true
  },
  ChildConstructor: 'Constructor'
}).Constructor

Observable.prototype.inject(require('../operator/all'))
