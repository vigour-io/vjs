"use strict";

var Base = require('../')
var define = Object.defineProperty
var proto = Base.prototype

define(proto, '$each', {
  value:require('./each')
} )
define(proto, '$convert', {
  value: require('./convert')
})
define(proto, '$setWithPath', { //not really needed perhaps?
  value:require('./setWithPath')
})
define(proto, '$get', {
  value:require('./get')
})
define(proto, '$keys', {
  get: require('./keys')
})
define(proto, '$lookUp', {
  value: require('./lookUp')
})
define(proto, '$lookDown', {
  value: require('./lookDown')
})
define(proto, '$toString', {
  value:require('./toString')
})
define(proto, '$find', {
  value:require('./find')
})