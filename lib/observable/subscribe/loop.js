"use strict";
var Base = require('../../base')
var encoded = require('./shared').encoded
var onParent = require('./on/parent')
var onProperty = require('./on/property')
var onReference = require('./on/reference')

exports.$define = {
  $loopSubsObject: function( obj, val, event, refLevel, level, meta, original ) {

    console.log('%cloopSubs --->','color:white;background:#333;', obj._$path, val)

    var addedPropertyListener
    var addedParentListener
    var addedUpwardListener
    var reference
    var property
    var value
    var self

    if(!original && refLevel > 1) {
      console.warn('dont have original -- do have refLevel!', obj._$path, refLevel)
    }

    for( var key in val ) {
      console.log(key)
      value = val[ key ]
      if( key === '&' ) { //deep
        // to dont
      } else if( key === '$val' ) {
        this.$subscribeToProperty( obj, val, key, event, refLevel, level, meta, original )
      } else { //property
        property = obj[ key ]
        if( property && property._$input !== null ) {
          this.$subscribeToProperty( property, val, key, event, refLevel, level, meta, original )
        } else {
          if( key === '$parent' ) { //parent
            //dont use ''$parent'' else contexts can become a huge problemo
            obj.on( '$addToParent', [ onParent, this, refLevel, level, val, original ] )
            addedParentListener = true
          } else if( key === '$upward' ) { //up the chain
            addedUpwardListener = this.$subscribeUpward( obj, value, event, refLevel, level, original )
          } else if( !addedPropertyListener ) {
            if( key === '*' ) {
              self = this
              obj.each( function( prop, key ) {
                val[ key ] = encoded( refLevel )
                self.$subscribeToProperty( prop, val, key, event, refLevel, level, original )
              } )
              obj.on( '$property', [ onProperty, this, refLevel, level, val, true, original ] )
            } else {
              console.log('%cloopSubs ---> $property','color:white;background:#333;', obj._$path)
              obj.on( '$property', [ onProperty, this, refLevel, level, val, void 0, original ] )
            }
            addedPropertyListener = true
          }
        }
      }
    }
    //if subscriptions have been fulfilled
    if( !addedPropertyListener && !addedParentListener && !addedUpwardListener ) {
      return true
    }
    //else check references
    if( ( reference = obj._$input ) && reference instanceof Base ) {
      obj.on( '$reference', [ onReference, this, ++refLevel, level, val, original || obj ] )
      this.$loopSubsObject( reference, val, event, refLevel, level, void 0 , original || obj )
    }
  }
}
