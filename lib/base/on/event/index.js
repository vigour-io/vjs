"use strict"
// event.js
var stamp = 0
var Base = require('../../index.js')
var define = Object.defineProperty

var Event = module.exports = function Event(){
  this.$stamp = stamp++
  console.error( 'create new event', this.$stamp )
}

define( Event.prototype, '$postpone', { 
  value: function( dispatcher ) {
    if(!this.$postponed) {
      this.$postponed = []
    }
    this.$postponed.push(dispatcher) 
  }
})

//this is added for logging wil later be moved to dev/event as an injectable
require('./toString.js')
