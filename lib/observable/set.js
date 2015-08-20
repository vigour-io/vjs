"use strict";

var Base = require( '../base' )
var Event = require( '../event' )
var proto = Base.prototype

var set = proto.set
var addNewProperty = proto.$addNewProperty

module.exports = function( observable ) {
  var Observable = observable.$Constructor
  observable.define({
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
        // console.log('%ccreate new event!', 'font-weight:bold;background:pink;', event.toString())
      }

      var base = set.call( this, val, event, nocontext )

      // console.log(base, val, this)
      //TODO: how to do this in emitter since its just an event that starts from an orignator

      if( !base ) {
        this.$emitPostponed( '$change', event )
        return;
      }
      if( event ) {
        // console.log('%cemit event!', 'font-weight:bold;background:pink;', base._$path)
        // event.$origin = base
        base.$emit( '$change', event )
      }
      return base
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

}
