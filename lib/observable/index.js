"use strict";

var Base = require('../base')
var Event = require('../event')
var proto = Base.prototype

var set = proto.$set
var removeInternal = proto.$removeInternal
var addNewProperty = proto.addNewProperty
var removeUpdateParent = proto.$removeUpdateParent
var removeUpdateContextParent = proto.$removeUpdateContextParent

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
      this.$emit( '$new', event, Object.getPrototypeOf(this) )
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
      event = new Event( this )
      event.$val = val
    }
    if( set.call( this, val, event ) === true ) {
      return true
    }
    if(event) {
      this.$emit( '$change', event )
    }
    return event
  },
  $removeUpdateContextParent: function( parent, event ) {
    emitParentRemoval( parent, this._$key, event )
    removeUpdateContextParent.call( this, parent, event )
  },
  $removeUpdateParent: function( parent, instances, event ) {    
    emitParentRemoval( parent, this._$key, event )
    removeUpdateParent.call( this, parent, instances, event )
  },  
  $removeInternal: function( instances, event ) {
    console.log('removeInternal (observable)', this.$path)
    if( event === void 0 ) {
      console.log('create event')
      event = new Event( this )
      event.$val = null
    }
 
    if( event ) {
      this.$emit( '$change', event, true )
    }

    return removeInternal.call( this, instances, event )
  },
  addNewProperty: function( key, val, property, event ) {
    addNewProperty.call( this, key, val, property, event )
    if(event) {
      this.$emit( '$property', event, key )
    }  
  }
})

function emitParentRemoval( parent, key, event ) {
  parent.$emit( '$change', event )
  parent.$emit( '$property', event, void 0, key ) 
}