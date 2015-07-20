"use strict";

var Base = require('../base')
var Event = require('../event')
var proto = Base.prototype

var set = proto.$set
var removeInternal = proto.$removeInternal
var addNewProperty = proto.addNewProperty
var removeUpdateParent = proto.$removeUpdateParent

var observable = new Base()

observable.inject( 
  require('./on'),
  require('./subscribe'),
  require('./stamp')
)

var Observable = module.exports = observable.$Constructor

observable.define({
  $ChildConstructor: Observable,
  $generateConstructor: function() {
    return (function derivedObservable( val, event, parent, key ) {
      if(this.$on) {
        this.$on.$newParent( this, event )
      }
      this.setParent( val, event, parent, key )
      if(val) {
        event = this.$set( val, event )
      }      
      this.$emit( '$new', event, this.__proto__ )
    })
  },
  $setValueInternal: function( val, event ) {
    if( val instanceof Base) {
      val.on( '$change', this )
      this.$emit( '$reference', event, this._$val )
    } else if( this._$val instanceof Base ) {
      this.$emit( '$reference', event, this._$val )
    }
    this._$val = val
  },
  $set: function( val, event ) {
    if( event === void 0 ) {
      event = new Event()
      event.$val = val
      event.$origin = this
    }
    if( set.call( this, val, event ) === true ) {
      return true
    }
    if(event) {
      this.$emit( '$change', event )
    }
    return event
  },
  $removeUpdateParent: function( parent, event ) {
    parent.$emit( '$change', event )
    parent.$emit( '$property', event, void 0, this._$key ) 
    removeUpdateParent.call( this, parent, event )
  },  
  $removeInternal: function( event ) {
    // console.error('!@#?')
    this.$emit( '$change', event, true )
    return removeInternal.call( this, event )
  },
  addNewProperty: function( key, val, property, event ) {
    addNewProperty.call( this, key, val, property, event )
    if(event) {
      this.$emit( '$property', event, key )
    }  
  }
})

