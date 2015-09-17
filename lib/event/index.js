"use strict"

var stamp = 0
var base = require('../base').prototype
var Event = module.exports = function Event( origin, type ){
  this.$stamp = ++stamp
  //this has to become unfied and has to use source+timestamp
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
  loop: require('./loop.js'),
  clear: function() {
    this.$postponed = null
    this.$origin = null
    this.$resolving = null
    this.$inherited = null
    this.$executed = true
  }
})
