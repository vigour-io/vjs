"use strict";

var Base = require('./')
var util = require('../util')
var define = Object.defineProperty

function inject(val) {

  var injected = val._injected
  var target

  if( !val.hasOwnProperty( '_injected' ) ) {
    //does not get called in set (since non-enum)
    define( val, '_injected', {
      configurable:true,
      value:[]
    })
    injected = val._injected
  } else {
    for( var i = 0, length = injected.length; i < length; i++ ) {
      target = injected[i]

      if(
        this === target ||
        ( target.hasOwnProperty('_$Constructor') &&
          target._$Constructor &&
          ( this instanceof target._$Constructor )
        )
      )
      {
        // console.warn('already injected!', val, ' on ', target)
        return
      }
    }
  }

  injected.push( this )

  var isFn = typeof val === 'function'

  if( isFn && val.prototype instanceof Base ) {
    val = val.prototype
    isFn = null
  }

  // console.error('inject!', this instanceof Base)

  //has to become more optimzied ;/
  if( isFn ) {
    //maybe check if its a constructor then make a new combination?
    val( this )
  } else if( util.isPlainObj( val ) ) {
    if( this instanceof Base || this === Base.prototype ) {
      //maybe not false for event else x etc does not update (change)
      this.set( val )
    } else {
      if( this.define ) {
        this.define( val )
      } else {
        for( var key$ in val ) {
          this[key$] = val
        }
      }
    }
  } else if( val instanceof Base ) {
    throw new Error('!!!Base and inject is not yet supported!!!')
    //do this one later!
    //dificulties arise /w prop definitions and flags
  }

}

exports.inject = function() {
  for( var i = 0, length = arguments.length; i < length; i++ ) {
    inject.call( this, arguments[i] )
  }
  return this
}
