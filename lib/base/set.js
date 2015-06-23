"use strict";

var Base = require('./index.js')
var define = Object.defineProperty
var proto = Base.prototype
var util = require('../util')
var flags = require('./flags.js')
var Event = require('./on/event')

define( proto, '$setValue' , {
  value: function(val, event) {
    if(val instanceof Base) {

      //have to make this a lot better!
      
      //3 arrays etc etc

      //inheritability

      val.$set({ $on: { $change: this } }, false)
      //also add to listens
    }
    this._$val = val
  }
})

define( proto, '$set', { 
  value: function( val, event ) {

    //only do this if there is nothing made yet
    if( event === void 0 ) {
      event = new Event()
      event.$val = val
      event.$origin = this
      // this._$lastChange = event.$stamp
      // if(event) {
        //lezztry it! very heavy but see if works
        //check if really a change!
        //very important to not set anything if the same and not execute update for it
      
        // console.error('set $lastChange', event.$stamp) //this[key]._$lastChange)
      // }
    }


    console.error('\n\nset stamp', event.$stamp, this.$path)


    if(util.isPlainObj(val)) {
      for( var key$ in val ) {
        if(key$==='$val') {
          this.$setValue( val[key$], event )
        } else {
          this.$setKey( key$, val[key$], event )
        }
      }
    } else {
      //get those refs working!
      this.$setValue( val, event )
    }
    //nice to have it returend somehow...

    if(event) {

      //if it really did updates --- very important! 'truly changed'

      this._$lastChange = event.$stamp

      // console.error('UPDATE LEZZZGO!', event.$stamp)
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

define(proto, '$key', {
  get:function() {
    return this._$key
  }
})

define( proto, '$setKeyInternal', {
  value:function( key, val, field, event ) {
    if(field) {
      
      if(field._$parent !== this) {
        this[key] = new field.$Constructor( val, event, this )
      } else {
        // if(event) {
        //   console.error('set las change!')
        //   // field._$lastChange = event.$stamp
        // }
        //very important to not set anything if the same and not execute update for it
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
    //create event here if its not there yet extra check feels bit nasty
    if( this.$flags[key] ) {
      this.$flags[key].call( this, value, event )
    } else {
      this.$setKeyInternal( key, value, this[key], event )
    } 
  }
})





