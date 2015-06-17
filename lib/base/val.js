"use strict";

var Base = require('./index.js')
var define = Object.defineProperty
var proto = Base.prototype

//ff ergens anders doen? in val meensen ik ben een operator doe het zo?
//functie van een operator iets anders?
var Operator = require('./operator.js')

define( proto, '_$bind', {
  writable:true,
  configurable:true
})

define( proto, '$origin', {
  get:function() {
    var reference = this
    while( reference._$val instanceof Base ) {
      reference = reference._$val
    }
    return reference
  }
})

//logica van operator execution hier
define( proto, '$parseValue', {
  value:function() { 

    //now -- parsse operators by checking instance of or just check for $operator

    var val = this._$val
    if(val) {
      //special flag dat functie niet geget moet worden
      //dit is voor methods
      if(typeof val === 'function') {
        //make this into a funciton e.g. $execGetterFunction
        var context = this._$bind && this._$bind._$val || this
        if(context) {
          if(context === '$parent') { 
            //this will be replaced with a general path functionality (that includes)
            context = this.$parent
          } else if(typeof context === 'function' ) {
            context = context.call(this)
          } else {
            context = this
          }
        }
        return val.call(context)
      } else if( val instanceof Base ) {
        return val.$val
      } else {
        return this._$val
      }
      
    } else {
      return this
    }
  }
})

define( proto , '$val', {
  get:function() {
    return this.$parseValue()
  },
  set:function( val ) {
    this.$set( val )
  }
})

proto.$flags = {
  $val: function(val) {
    this._$val = val
  }
}


