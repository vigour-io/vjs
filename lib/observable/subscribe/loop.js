"use strict";
var Base = require('../../base')
var encoded = require('./shared').encoded
var onParent = require('./on/parent')
var onProperty = require('./on/property')
var onReference = require('./on/reference')

exports.$define = {
  $loopSubsObject: function( obj, val, event, refLevel, level, meta, original ) {
    var addedPropertyListener
    var addedParentListener
    var addedUpwardListener
    var reference
    var property
    var value
    var self

    if(!original) {
      console.error('dont have original!', obj._$path)
    }

    for( var key in val ) {
      value = val[ key ]
      if( key === '&' ) { //deep
        // to dont
      } else if( key === '$val' ) {
        this.$subscribeToProperty( obj, val, key, event, refLevel, level, meta, original )
      } else { //property
        property = obj[ key ]
        if( property && property._$val !== null ) {
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
    if( ( reference = obj._$val ) && reference instanceof Base ) {
      obj.on( '$reference', [ onReference, this, ++refLevel, level, val, original || obj ] )
      this.$loopSubsObject( reference, val, event, refLevel, level, void 0 , original || obj )
    }
  }
}