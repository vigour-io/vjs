"use strict"

var stamp = 0
var base = require('../base').prototype

var Event = module.exports = function Event( origin ){
  this.$stamp = ++stamp
  this.$origin = origin
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
  $metaPostpone: function( emitter ) {
    if(!this.$metaPostponed) {
      this.$metaPostponed = []
    }
    this.$metaPostponed.push( emitter ) 
  }
})

