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
      if( !this.hasOwnProperty('__rPStamp') || this.__rPStamp !== event.$stamp ) {
        this.__rPStamp = event.$stamp
        //TODO: very slow optmize later!
        for(var key$ in this) {
          //better to ignore the normal ones
          if( key$ !== '_$input' && this[key$] instanceof Observable && key$ !== '_$parent' ) {
            this[key$].$emitRemoveProperties( event )
          }
        }

        var refUpdate
        if(this._$input instanceof Observable) {
          refUpdate = this._$input
        }
        this._$input = null
        if( refUpdate ) {
          this.emit( '$reference', event, refUpdate )
        }
        this.emit( '$change', event, true )
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

      var parent = this.$parent
      if( !noparent && !nocontext && this._$context ) {

        this.$removeFromInstances( event )

        emitParentRemoval( parent, this.$key, event )

        if( event ) {
          this.emit( '$change', event, true )
        }

        var ret = this.$removeUpdateParent( this.$parent, event, this._$context, true )

        return ret

      } else {

        if( !noparent && parent ) {
          emitParentRemoval( parent, this.$key, event )
        }

        if( event ) {
          // this.$clearContext()
          this.$emitRemoveProperties( event )
          this.$removeFromInstances( event )
          // this.emit( '$change', event, true )
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
  parent.emit( '$change', event )
  parent.emit( '$property', event, void 0, key )
}
