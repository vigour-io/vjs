"use strict";

var Base = require('./index.js')
var define = Object.defineProperty
var proto = Base.prototype
var util = require('../util')
var flags = require('./flags.js')
var Event = require('./on/event')

//make event second arg in new

define( proto, '$set', { 
  value: function( val, event ) {

    if( event === void 0 ) {
      event = new Event()
      event.$val = val
      event.$origin = this
    }

    if(util.isPlainObj(val)) {
      for( var key$ in val ) {
        if(key$==='$val') {
          this._$val = val[key$]
        } else {
          this.$setKey( key$, val[key$], event )
        }
      }
      this.$update( '$change', event )
    } else {

      //get those refs working!

      if(val instanceof Base) {
        console.info('better add a listener to this mofo!')
      }

      this._$val = val

      this.$update( '$change', event )
    }  
  }
})

proto.$flags = {
  $useVal:function(val) {
    this._$useVal = val
  },
  $key:function(val) {
    this._$key = val
  }
}

define( proto, '$setKeyInternal', {
  value:function( key, val, field, event ) {
    if(field) {
      if(field._$parent !== this) {
        this[key] = new field.$Constructor( val, event, this )
      } else {
        field.$set( val, event )
      }
    } else {
      //this is the spot to handle '$added' on event can become hard  
      var ready
      if(val !== void 0){
        var useVal = val._$useVal || val.$useVal
        if(useVal) {
          val = useVal === true
            ? val
            : useVal

          if( val instanceof Base ) {
            if(!val._$parent) {
              val._$key = key
              val._$parent = this
              this[key] = val
              ready = true
            }
          } else {
            this[key] = val
            ready = true
          }
        }
      }

      if(!ready) {
        this[key] = new this.$ChildConstructor( val, event, this, key )
      }

      if(this.hasOwnProperty( '_$Constructor' )) {
        this.$createContextGetter.call(this, key)
      }
    }

  }
})

define( proto, '$setKey', {
  value:function( key, value, event ) {
    //create event here if its not there yet extra check if a bit nasty
    if( this.$flags[key] ) {
      this.$flags[key].call( this, value, event )
    } else {
      this.$setKeyInternal( key, value, this[key], event )
    } 
  }
})





