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

    if(util.isObj(val)) {
      for( var key$ in val ) {
        this.$setKey( key$, val[key$] )
      }
    } else {
      //now lets determine what kind of val? or just put it in here and do nojting else saves mem and perf 
      this._$val = val
    }
  }
})