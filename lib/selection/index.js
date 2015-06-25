"use strict";
var Base = require('../base')
var define = Object.defineProperty
var Selection = module.exports = new Base().$Constructor
var proto = Selection.prototype

define( proto , '$include', {
  value:function( options ){
    if(options === void 0){ // little slow
      options = {}
    }
    options.results = this
    return Base.prototype.$filter.call(this._$val, options)
  }
})

define( proto , '$query', {
  value:function( path, options ){
    if( options === void 0 ){ // little slow
      options = {}
    }
    options.results = this
    return Base.prototype.$find.call(this._$val, path, options)
  }
})