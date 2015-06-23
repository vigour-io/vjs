"use strict"
// event.js
var stamp = 0
var Base = require('../../index.js')

var Event = module.exports = function Event(){
  this.$stamp = stamp++
}

require('./toString.js')
