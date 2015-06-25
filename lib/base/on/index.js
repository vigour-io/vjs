"use strict";
var Base = require('../index.js')
var proto = Base.prototype
var define = Object.defineProperty
var Emitter = require('./emitter')
var util = require('../../util')
var Event = require('./event')

var on = new Base({
  $key:'$on',
  $strict:Emitter
})

define( on , '$ChildConstructor', {
  value:Emitter ,
  configurable:true
})

var On = on.$Constructor

proto.$flags = { $on: On }

on.$flags = {
  $property: require('./emitter/property')
}

module.exports = On
