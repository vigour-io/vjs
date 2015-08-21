"use strict";

var Base = require( '../base' )
var Event = require( '../event' )
var proto = Base.prototype

var removeInternal = proto.$removeInternal
var removeUpdateParent = proto.$removeUpdateParent
var removeUpdateContextParent = proto.$removeUpdateContextParent

module.exports = function( observable ) {
  var Observable = observable.$Constructor
  observable.define({
    $emitRemoveProperties: function( event ) {

      //TODO: very slow optmize later!

      for(var key$ in this) {
        if( this[key$] instanceof Observable && key$ !== '_$parent' ) {
          // console.log('hey', key$)
          this[key$].$emitRemoveProperties( event )
          this[key$].$emit( '$change', event, true )
        }
      }

    },
    $removeUpdateParent: function( parent, event, context, ignore ) {
      if( !ignore ) {
        emitParentRemoval( parent, this.$key, event )
      }
      removeUpdateParent.call( this, parent, event, context )
    },
    $removeInternal: function( event, nocontext, noparent ) {

      if( event === void 0 ) {
        event = new Event( this, '$change' )
        event.$val = null
      }

      this.$removeFromInstances( event )

      var parent = this.$parent
      if( !noparent && !nocontext && this._$context ) {

        emitParentRemoval( parent, this.$key, event )

        if( event ) {
          this.$emit( '$change', event, true )
        }

        var ret = this.$removeUpdateParent( this.$parent, event, this._$context, true )

        return ret

      } else {

        if( !noparent && parent ) {
          emitParentRemoval( parent, this.$key, event )
        }

        if( event ) {
          this.$emitRemoveProperties( event )
          this.$emit( '$change', event, true )
        }

        if( !noparent && parent ) {
          this.$removeUpdateParent( parent, event, false, true )
        }

        this.$removeProperties(  event, nocontext, noparent )
      }

      return this
    }
  })

}

function emitParentRemoval( parent, key, event ) {
  //does not work?
  // event.$origin = parent
  // console.error('ok this is weird?', parent.$key, parent.$path)
  parent.$emit( '$change', event )
  parent.$emit( '$property', event, void 0, key )
}
