"use strict"

var Emitter = require('./index.js')

var PropertyEmitter = module.exports = new Emitter({
  $define:{
    $executePostponed:false,
    $emitEvent: function( event, force, addedKey, removedKey ) {
      if( this.$lastStamp !== event.$stamp ) {
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

        if(!force ) {
          this.$postpone( event )
        } else {
          this.$exec( this.$bind, event )
        }
        
      } else if( this._$meta ) {
        console.warn(JSON.stringify(this._$meta,false,2), 'remove $meta from $property emitter double check if this ok!')
        this._$meta = null
      }
    }
  }
}).$Constructor
