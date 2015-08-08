"use strict";

var Base = require( '../base' )
var Event = require( '../event' )
var proto = Base.prototype

var set = proto.set
var removeInternal = proto.$removeInternal
var addNewProperty = proto.$addNewProperty
var removeUpdateParent = proto.$removeUpdateParent
var removeUpdateContextParent = proto.$removeUpdateContextParent

var observable = new Base()

observable.inject(
  require( './on' ),
  require( './emit' ),
  require( './off' ),
  require( './subscribe' ),
  require( './stamp' )
)

var Observable = module.exports = observable.$Constructor

observable.define({
  $ChildConstructor: Observable,
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
  },
  $setValueInternal: function( val, event ) {
    //TODO: optmize!!!
    if( val instanceof Observable ) {
      val.on( '$change', this )
      this.$emit( '$reference', event, val )
    }

    if( this._$val instanceof Observable ) {
      this._$val.off( '$change', { $base: this })
      this.$emit( '$reference', event, val )
    }

    this.$emit( '$value', event, this._$val )
    this._$val = val
    return this
  },
  set: function( val, event, nocontext ) {
    if( event === void 0 ) {
      event = new Event( this, '$change' )
      event.$val = val
    }

    var base = set.call( this, val, event, nocontext )

    // console.log(base, val, this)
    //TODO: how to do this in emitter since its just an event that starts from an orignator

    if( !base ) {
      this.$emitPostponed( '$change', event )
      return;
    }
    if( event ) {
      // event.$origin = base
      base.$emit( '$change', event )
    }
    return base
  },
  $removeUpdateParent: function( parent, event, context ) {
    emitParentRemoval( parent, this.$key, event )
    removeUpdateParent.call( this, parent, event, context )
  },
  $removeInternal: function( event, nocontext, noparent ) {

    if( event === void 0 ) {
      event = new Event( this, '$change' )
      event.$val = null
    }

    this.$removeFromInstances( event )

    var parent = this._$parent
    if( !noparent && !nocontext && this._$context ) {
      var ret = this.$removeUpdateParent( this.$parent, event, this._$context )
      if( event ) {
        this.$emit( '$change', event, true )
      }
      return ret
    } else {
      if( !noparent && parent ) {
        this.$removeUpdateParent( parent, event )
      }
      if( event ) {
        this.$emit( '$change', event, true )
      }
      this.$removeInternalBody(  event, nocontext, noparent )
    }

    // var ret = removeInternal.call( this, event, nocontext, noparent )

    return this
  },
  $addNewProperty: function( key, val, property, event ) {
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
  //does not work?
  // event.$origin = parent
  parent.$emit( '$change', event )
  parent.$emit( '$property', event, void 0, key )
}
