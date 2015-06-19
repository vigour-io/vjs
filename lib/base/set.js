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

    //waar exact de onchange listener fire? -- wat voor dingen meegven?

    //e.g. event met info zoals added:true (in setkey)

    //etc etc
    if( event === void 0 ) {

      //figure out how to lighten the shit out of this....

      //only do this when there are listeners somewhere

      //nooit event maken als er geen listener is
      //dit meot ff smarter (pas in update handelen bijvoorbeeld)
      //ik wil niet allemaal events maken voor kicks

      // console.error('MAKING EVENT', this.$path, val, this.$parent)
      event = new Event()
      event.$val = val
      event.$origin = this

      // if(val.$key === 'bla') {
      //   var t = this
      //   setTimeout(function() {
      //     // console.warn('?',t.$path, event.$origin.$path)
      //   })
      // }
    }

    if(util.isPlainObj(val)) {
      for( var key$ in val ) {
        if(key$==='$val') {
          //ook voor refs moet hier een functie voor komen
          this._$val = val[key$]
          // this.$update( '$change', event )
        } else {
          this.$setKey( key$, val[key$], event )
        }
      }
      this.$update( '$change', event )
    } else {
      //only if there is a change!
      //do all those things later
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
      //!!!! OPTMIZE THIS BULLSHIT ITS VERY DIRTY
        //apperently no impact on perf

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
      //!!!! OPTMIZE THIS!
    }

  }
})

define( proto, '$setKey', {
  value:function( key, value, event ) {
    //create event here if its not there yet
    if( this.$flags[key] ) {
      this.$flags[key].call( this, value, event )
    } else {
      this.$setKeyInternal( key, value, this[key], event )
    } 
  }
})





