// property.js
"use strict"
var Emitter = require('./index.js')
var propertyEmitter = new Emitter()
var define = Object.defineProperty

//find a nicer solution for this
propertyEmitter.$executePostponed = null

define( propertyEmitter , '$emit', {
  value:function( event, force, addedKey, removedKey ) {
    var meta = this._$meta
    if(!meta) {
      this._$meta = meta = {}
    }
    if(addedKey) {
      if(!meta.added) {
        meta.added = []
      }
      meta.added.push( addedKey )
    }
    if(removedKey) {
      if(!meta.removed) {
        meta.removed = []
      }
      meta.removed.push( removed )
    }
    if( this.$lastStamp === event.$stamp ) {
      return
    }
    var $bind = this.__$bind__ || this.$parent.$parent
    if(!force ) {
      if(this.$postPonedStamp === event.$stamp) {
        return
      }
      this.__$bind__ = $bind
      event.$postpone(this)
      this.$postPonedStamp = event.$stamp
      return
    }
    this.$exec( $bind, event )
    this.__$bind__ = null
  },
  configurable:true
})

module.exports = propertyEmitter.$Constructor

