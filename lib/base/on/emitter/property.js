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
    
    if(!force ) {
      this.$postpone( event )
    } else {
      this.$emitInternal( event )
    }

  },
  configurable:true
})

module.exports = propertyEmitter.$Constructor

