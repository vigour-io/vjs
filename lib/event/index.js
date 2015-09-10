"use strict"

var stamp = 0
var base = require('../base').prototype

var Event = module.exports = function Event( origin, type ){
  this.$stamp = ++stamp
  this.$origin = origin
  this.$context = origin && origin._$context
  if(type) {
    this.$type = type
  }
}

var event = Event.prototype

Object.defineProperty( event, 'define', {
  value: base.define,
  configurable: true
})

event.define({
  inject: base.inject,
  $postpone: function( emitter ) {
    var postponed = this.$postponed || (this.$postponed = [])
    postponed.push( emitter )
  },
  loop: require('./loop.js')
})
