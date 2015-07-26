"use strict";

var Base = require( '../base' )
var Event = require( '../event' )
var proto = Base.prototype

var set = proto.$set
var removeInternal = proto.$removeInternal
var addNewProperty = proto.addNewProperty
var removeUpdateParent = proto.$removeUpdateParent
var removeUpdateContextParent = proto.$removeUpdateContextParent

var observable = new Base()

observable.inject( 
  require( './on' ),
  require( './emit' ),
  require( './removeListener' ),
  require( './subscribe' ),
  require( './stamp' )
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
        event = this.$set( val, event, true )
      }      
    
      this.$emit( 
        '$new', 
        event === true ? void 0 : event, 
        Object.getPrototypeOf( this ) 
      )
    
    })
  },
  $setValueInternal: function( val, event ) {
    if( val instanceof Observable) {
      val.on( '$change', this )
      this.$emit( '$reference', event, val )
    } else if( this._$val instanceof Observable ) {
      this._$val.removeListener( '$change', { $base: this })
      this.$emit( '$reference', event, val )
    }
    this.$emit( '$value', event, this._$val )    
    this._$val = val
  },
  $set: function( val, event, nocontext ) {
    if( event === void 0 ) {
      event = new Event( this )
      event.$val = val
    }
    if( set.call( this, val, event, nocontext ) === true ) {
      return true
    }
    if(event) {
      this.$emit( '$change', event )
    }
    return event
  },
  $removeUpdateParent: function( parent, event, context ) {    
    emitParentRemoval( parent, this._$key, event )
    removeUpdateParent.call( this, parent, event, context )
  },  
  $removeInternal: function( event, nocontext, noparent ) {
    
    if( event === void 0 ) {
      event = new Event( this )
      event.$val = null
    }

    //temp fix -- remove and use _$val null
    this._beingremoved = true
    //this is not enough

    //has to be cleaned up
    if( this.$on && this.$on._instances && this._$Constructor ) {
      // this.$clearContext()
      for( var i in this.$on._instances) {
        if( this.$on._instances[i] instanceof this._$Constructor ) {
          if(!this.$on._instances[i].hasOwnProperty('_beingremoved')) {
            this.$on._instances[i].remove( event, true )
          }
        }
      }
    }
    
    if( event ) {
      this.$emit( '$change', event, true )
    }

    return removeInternal.call( this, event, nocontext, noparent )
  },
  addNewProperty: function( key, val, property, event ) {

    var fireParentEvent = !this[key]

    addNewProperty.call( this, key, val, property, event )
    
    if( event ) {
      this.$emit( '$property', event, key )
    }

    //double check wtf is going on with event -- prop is false
    if( fireParentEvent && this[key] instanceof Observable ) {
      this[key].$emit( '$addToParent', event || void 0 ) //event
    }
    
  }
})

function emitParentRemoval( parent, key, event ) {
  console.log(event)
  parent.$emit( '$change', event )
  parent.$emit( '$property', event, void 0, key ) 
}