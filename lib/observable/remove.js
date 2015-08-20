"use strict";

var Base = require( '../base' )
var Event = require( '../event' )
var proto = Base.prototype

var removeInternal = proto.$removeInternal
var removeUpdateParent = proto.$removeUpdateParent
var removeUpdateContextParent = proto.$removeUpdateContextParent

exports.$define = {
  $removeUpdateParent: function( parent, event, context, ignore ) {
    if( !ignore ) {
      emitParentRemoval( parent, this.$key, event )
    }
    removeUpdateParent.call( this, parent, event, context )
  },
  $removeInternal: function( event, nocontext, noparent ) {
    // console.error('\n\nlets remove it!', this.$path, '\n\n')
    if( event === void 0 ) {
      event = new Event( this, '$change' )
      event.$val = null
    }
    // console.log('remove', this.$path)
    this.$removeFromInstances( event )
    // console.log('done with instances')

    //context thing
    var parent = this.$parent
    if( !noparent && !nocontext && this._$context ) {

      emitParentRemoval( parent, this.$key, event )

      if( event ) {
        // console.log('emit one - context')
        this.$emit( '$change', event, true )
      }

      // console.error('---> remove update parent')

      var ret = this.$removeUpdateParent( this.$parent, event, this._$context, true )

      return ret

    } else {

      if( !noparent && parent ) {
        emitParentRemoval( parent, this.$key, event )
      }

      //what goes wrong ? on remove this thing is nulled
      if( event ) {
        // console.group()
        // console.error('emit two - no context', this.$path)
        // this.$clearContext()
        this.$emit( '$change', event, true )
        // console.error('emit two - done - no context', this.$path)
        // console.groupEnd()

      }

      if( !noparent && parent ) {
        // console.error('---> remove update parent -----')

        this.$removeUpdateParent( parent, event, false, true )
      }

      // console.log('this should remove not before!', this)
      this.$removeProperties(  event, nocontext, noparent )
    }
    // var ret = removeInternal.call( this, event, nocontext, noparent )
    return this
  }
}

function emitParentRemoval( parent, key, event ) {
  //does not work?
  // event.$origin = parent
  // console.error('ok this is weird?', parent.$key, parent.$path)
  parent.$emit( '$change', event )
  parent.$emit( '$property', event, void 0, key )
}
