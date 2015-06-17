"use strict";

var Base = require('./index.js')
var define = Object.defineProperty
var proto = Base.prototype
var util = require('../util')

//extend (merged settings in een ander object komt later!)
define( proto, '$set', { 
  value: function( val ) {
    //merge it --- dit is al een merge
    //clear achtig ding
    //handle references! 
    if(util.isPlainObj(val)) {
      for( var key$ in val ) {
        //hier moeten eigenlijk alle extended props in (de niet getter props)
        //how to do? mischien toch special define met een prop iets
        //dit word flags -- wil dat flag
        this.$setKey( key$, val[key$] )
      }
    } else {
      //now lets determine what kind of val? or just put it in here and do nojting else saves mem and perf 
      this._$val = val
    }
  
  }
})

define( proto, '$setKeyInternal', {
  value:function( key, value, field ) {
    if(field) {
      if(field._$parent !== this) {
        this[key] = new field.$Constructor( value, this )
      } else {
        field.$set( value )
      }
    } else {
      this[key] = new this.$children.$Constructor( value, this )
      this[key]._$key = key 
      //adds 3% extra slowness (purely for the check)
      //try to remove constructor when instance is created and check if a normal if(!) is faster
      if(this.hasOwnProperty( '_$Constructor' )) {
        //this can be optimized
        this.$createContextGetter.call(this, key)
      }

    }
  }
})

define( proto, '$setKey', {
  value:function( key, value ) {

    if(this.$flags[key]) {
      //maybe seperate into 2 functions---
      // console.log('do something with the flag', key)
      this.$flags[key].call( this, value )

    } else {
      var privateField = '_'+key
      var field = this[ privateField ]
      if(field) {
        this.$setKeyInternal( privateField, value, field )
      } else {
        this.$setKeyInternal( key, value, this[key] )
      }
    } 
  }
})


//resolve $flags <-- better name for flags later...
//i want this prottype to be able to do new etc (it is nested what i need is)
//bla.$flags.gurk = true
//nu wul ik dat dit 
//operators word ook een ding 
//flags kunnen ook objecten hebben?
//hoe anders operators te doen?

//of als je een operator add ook ff toevogegen aan flags

//hoe dit emt proto te doen? maybe just add new isntance?


var Flags = function(){}

Flags.prototype.$flags = function( val ) {
  if(!util.isPlainObj( val )) {
    throw new Error('$flags needs to be set with a plain object')
  }
  for( var key$ in val ) {
    this[key$] = val[key$]
  }
}

define( proto, '$flags', {
  value: new Flags() 
})





