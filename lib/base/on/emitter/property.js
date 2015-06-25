// property.js
"use strict"
var Emitter = require('./index.js')
var propertyEmitter = new Emitter()
var define = Object.defineProperty

//find a nicer solution for this
propertyEmitter._$executePostponed = null

define( propertyEmitter , '$emit', {
  value:function( event, force, addedKey, removedKey ) {

    var meta = this._$meta
    
    if(addedKey) {
      if(!meta) {
        this._$meta = meta = {}
      }
      if(!meta.added) {
        meta.added = []
      }
      meta.added.push( addedKey )
    } else if(removedKey) {
      if(!meta) {
        this._$meta = meta = {}
      }
      if(!meta.removed) {
        meta.removed = []
      }
      meta.removed.push( removed )
    }

    if( this.$lastStamp !== event.$stamp ) {
      if(!force ) {
        this.$postpone( event )
      } else {
        this.$exec( this.$bind, event )
      }
    }

  },
  configurable:true
})

module.exports = propertyEmitter.$Constructor

