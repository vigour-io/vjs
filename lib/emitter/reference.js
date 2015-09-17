"use strict"

var Emitter = require('./index.js')

module.exports = new Emitter({
  $define:{
    $executePostponed:false,
    $emit: function( event, bind, force, addedKey, removedKey, metaOverwrite ) {

      if( this.$lastStamp !== event.$stamp || !this.hasOwnProperty('$lastStamp') ) {

        var meta = this._$meta

        if( !force ) {
          this.$postpone( bind, event )
        } else {
          if( bind ) {
            this.$pushBind( bind, event )
          }
          this.$exec( event )
        }

      } else if( this._$meta ) {
        console.warn(JSON.stringify(this._$meta,false,2), 'remove $meta from $property emitter double check if this ok!')
        // wont this remove meta of i call emit twice?
        this._$meta = null
      }
    }
  }
}).$Constructor

function unify(to, key, from) {
  var toval = to[key]
  var fromval = from[key]
  if(toval !== void 0) {
    if(fromval && fromval !== toval) {
      if(!(toval instanceof Array)) {
        to[key] = [ toval ]
      }
      include(toval, fromval)
    }
  } else if(fromval) {
    meta[key] = fromval
  }
}
