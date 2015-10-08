'use strict'
var Observable = require('../observable')

var Config = new Observable({
  inject: [
    require('../methods/find'),
    require('../methods/serialize'),
    require('../methods/plain'),
    require('../methods/lookUp'),
    require('./merge'),
    require('./resolve'),
    require('./parseValue'),
    require('./params')
  ],
  ChildConstructor: 'Constructor'
}).Constructor

module.exports = new Config({
  _nameSpace: 'vigour',
  _argv: true,
  _findPackage: true,
  inject: require('./constructor')
}).Constructor
