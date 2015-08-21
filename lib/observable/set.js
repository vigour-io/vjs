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

      var oldVal = this._$val
      var valIsObservable = val instanceof Observable

      this._$val = val

      if( valIsObservable ) {
        val.on( '$change', this )
        this.emit( '$reference', event, oldVal )
      }

      if( oldVal instanceof Observable ) {
        oldVal.off( '$change', { $base: this })
        if( !valIsObservable ){
          this.emit( '$reference', event, oldVal )
        }
      }

      this.emit( '$value', event, oldVal )

      return this
    },
    set: function( val, event, nocontext ) {

      if( event === void 0 ) {
        event = new Event( this, '$change' )
        event.$val = val
      }

      var base = set.call( this, val, event, nocontext )

      //TODO: how to do this in emitter since its just an event that starts from an orignator
      if( event ) {
        if( !base ) {

          //context is resolved no base returned (no update on this it self)
          //however we need to send the new base since we are resolving!

          //only do this when i am origin?
          this.$emitPostponed( '$change', event )
          // return
        } else {
          base.emit( '$change', event )
        }
      }
      return base
    },
    $addNewProperty: function( key, val, property, event ) {
      var fireParentEvent = !this[key]
      addNewProperty.call( this, key, val, property, event )
      if( event ) {
        this.emit( '$property', event, key )
      }
      //double check wtf is going on with event -- prop is false
      if( fireParentEvent && this[key] instanceof Observable ) {
        this[key].emit( '$addToParent', event || void 0 ) //event
      }
    }
  })
}
