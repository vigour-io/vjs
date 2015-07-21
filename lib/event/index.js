"use strict"
var stamp = 0
var base = require('../base').prototype

var Event = module.exports = function Event(origin){
  this.$stamp = ++stamp
  this.$origin = origin
}

var event = Event.prototype
event.define = base.define

event.define({
  inject: base.inject,
  $postpone: function(emitter) {
    if(!this.$postponed) {
      this.$postponed = []
    }
    this.$postponed.push(emitter) 
  }
})

