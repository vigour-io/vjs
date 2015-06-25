"use strict";

var Base = require('../index.js')
var proto = Base.prototype
var define = Object.defineProperty
var Emitter = require('./emitter')
var util = require('../../util')
var Event = require('./event')

//FIRST UPDATE FIX IT!

var On = module.exports = new Base({
  $key:'$on',
  $define: {
    $ChildConstructor: Emitter,
    $strictType: function(val) {
      return (val instanceof Emitter) || (val instanceof On)
    }
  },
  $flags: {
    $property: require('./emitter/property')
  }
}).$Constructor

//----binding it, replace with something else later---
proto.$flags = { $on: On }

