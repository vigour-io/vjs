"use strict";

var Base = require( '../base' )
var Event = require( '../event' )
var proto = Base.prototype
var set = proto.set
var addNewProperty = proto.$addNewProperty
var ReadableStream = require('stream').Readable

module.exports = function( observable ) {
  var Observable = observable.$Constructor
  observable.define({
    $setValueInternal: function( val, event ) {

      //TODO: optmize!!!
      var oldVal = this._$input
      var valIsObservable = val instanceof Observable

      this._$input = val

      if( valIsObservable ) {
        // console.error('wtf wtf wtf wtf!!@#!@#', this._$path)
        //type, val, key, unique, event
        this._$input = val.on( '$change', this, void 0, void 0, event )
        this.emit( '$reference', event, oldVal )
      } else if(val instanceof ReadableStream) {
        console.error('this is a stream!')
        var obs = this
        this.__stream__ = {
          chunk: function(chunk) {
            // console.log('????', chunk)
            obs.emit( '$change', void 0, chunk )
          },
          error: function(err) {
            obs.emit('$error', void 0, err )
          },
          end: function() {
            //dit moet clearen denk ik...
            obs.emit('$end', void 0, 'end' )
          }
        }
        val.on('data', this.__stream__.chunk)
        val.on('error', this.__stream__.error)
        val.once('end', this.__stream__.end)
      }

      if( oldVal instanceof Observable ) {
        oldVal.off( '$change', { $base: this })
        if( !valIsObservable ){
          this.emit( '$reference', event, oldVal )
        }
      } else if( oldVal instanceof ReadableStream ) {
        oldVal.removeListener('error', this.__stream__.error)
        oldVal.removeListener('data', this.__stream__.chunk)
        oldVal.removeListener('end', this.__stream__.end)
        delete this.__stream__
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
          // console.error('here is problem')
          //postponed allready check if this was the origin
          this.$emitPostponed( '$change', event )
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
