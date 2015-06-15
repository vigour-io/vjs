//set.js
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

    if(val instanceof Object) {
      for( var key$ in val ) {
        this.$setKey( key$, val[key$] )
      }
    } else {
      this._$val = val
    }
  }
})