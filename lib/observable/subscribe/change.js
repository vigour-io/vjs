"use strict";
var encoded = require('./shared').encoded
var keepListener = require('./shared').keepListener
var onChange = require('./on/change')

exports.$define = {
  $addChangeListener: function( property, val, key, event, refLevel, level, meta, original ) {
    //remove all related listeners
    var $listensOnAttach = this.$listensOnAttach
    var propPath = property.$path.join( '.' )
    var mygetPath = this.$resolvePath( property, original, refLevel )

    //mark the field as found, with refLvl and lvl
    val[ key ] = encoded( refLevel, level )
    if( $listensOnAttach ) {
      $listensOnAttach.each( function( p ) {
        var type = p.$key
          //remove redundant property and parent listeners
        if( type === '$property' || type === '$addToParent' ) {
          function removeRedundantListeners( prop, key ) {
            if( !keepListener( val, prop[ 2 ] ) ) {
              p.$attach.$removeProperty( prop, key )
            }
          }
          p.$attach.each( removeRedundantListeners )
            //remove change listeners which are listening for the same thing
        } else if( type === '$change' ) {
          //perhaps pass this path in attach
          p.$attach.each( function( prop, key ) {
            if( key === propPath ) {
              p.$attach.$removeProperty( prop, key )
            }
          })
        }
      })
    }

    //add the new change listener
    property.on( '$change', [ onChange, this, refLevel, level, mygetPath, original ], propPath )

    //if this came from a listener, fire the subscription
    if( meta ) {
      var temp = refLevel > 1 ? original : property
      var subsObs = this._$parent._$parent
      for(var i in mygetPath) {
        temp = temp[mygetPath[i]]
        if(!temp) {
          break;
        }
      }
      if(temp) {
        temp.emit(this.$key, event)
      }
    }

  }
}
