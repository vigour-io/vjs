"use strict";

var Base = require('../')
var define = Object.defineProperty
var proto = Base.prototype

define(proto, '$convert', {
  value: require('./convert')
})

define(proto, '$each', {
  value:require('./each')
} )

define(proto, '$find', {
  value:require('./find')
})

define(proto, '$get', {
  value:require('./get')
})

define(proto, '$keys', {
  get: require('./keys')
})

define(proto, '$lookDown', {
  value: require('./lookDown')
})

define(proto, '$lookUp', {
  value: require('./lookUp')
})

define(proto, '$setWithPath', {
  value:require('./setWithPath')
})

define(proto, '$toString', {
  value:require('./toString')
})