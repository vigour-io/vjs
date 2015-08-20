"use strict";

var Base = require( '../base' )
var Event = require( '../event' )

 module.exports = new Base({
  $ChildConstructor: '$Constructor',
  $inject: [
    require( './on' ),
    require( './emit' ),
    require( './off' ),
    require( './subscribe' ),
    require( './stamp' ),
    require( './remove' ),
    require( './set' )
  ],
  $define: {
    $generateConstructor: function() {
      return (function derivedObservable( val, event, parent, key ) {
        this.$clearContext()
        if( this.$trackInstances ) {
          this.$addToInstances( event )
        }
        //make this cleaner!
        if(this.$on) {
          this.$on.$newParent( this, event )
        }
        //----------------
        this.setParent( val, event, parent, key )
        if( val !== void 0 ) {
          if( event === void 0 ) {
            event = new Event( this, '$new' )
          }
          this.set( val, event, true )
        }
        //do this better when resolve context is done
        this.$emit( '$new', event === true ? void 0 : event )
      })
    }
  }
}).$Constructor
