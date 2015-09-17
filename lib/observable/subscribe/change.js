"use strict";
var encoded = require('./shared').encoded
var keepListener = require('./shared').keepListener
var onChange = require('./on/change')

exports.$define = {
  $addChangeListener: function( property, val, key, event, refLevel, level, meta, original ) {
    //remove all related listeners

    console.log('%caddChangeListener --->','color:white;background:#333;', property._$path)

    var $listensOnAttach = this.$listensOnAttach
    var propPath = property._$path //this is wrong!

    if(refLevel > 1 && level) {
      var find = original
      for(var i = 1; i < refLevel; i++) {
        find = find._$input
      }
      if(propPath[0]=== find.$key) {
        console.error('ref key are we sure? bit weird...', propPath, refLevel, level)
        propPath.shift()
      }
    }

    propPath = propPath.join('.')

    var mygetPath = this.$resolvePath( property, original, refLevel )

    //mark the field as found, with refLvl and lvl
    val[ key ] = encoded( refLevel, level )
    if( $listensOnAttach ) {
      $listensOnAttach.each( function( p ) {
        var type = p.$key
          //remove redundant property and parent listeners
        if( type === '$property' || type === '$addToParent' ) {
          console.log('hello!2', property._$path)

          // function removeRedundantListeners( prop, key ) {
          //   console.log('remove that redundant', prop, p._$path)
          //   if( !keepListener( val, prop[ 2 ] ) ) {
          //     p.$attach.$removeProperty( prop, key )
          //   }
          // }
          p.$attach.each( function removeRedundantListeners( prop, key ) {
            console.log('remove that redundant', prop, p._$path)
            if( !keepListener( val, prop[ 2 ] ) ) {
              p.$attach.$removeProperty( prop, key )
            }
          } )
            //remove change listeners which are listening for the same thing
        } else if( type === '$change' ) {
          console.log('hello!3', property._$path)

          //perhaps pass this path in attach
          p.$attach.each( function( prop, key ) {
            console.log(key, propPath)

            //proppath does not work has to be nested field as well
            //the refs themself can have a listener as well

            if( key === propPath ) {
              console.log('should remove...', key)
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
