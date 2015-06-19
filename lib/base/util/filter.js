"use strict";

var Base = require('../')
var evaluate = require('../../util/test')
var helpers = require('./helpers')
var returnFilter = helpers.returnFilter

/**
 * @function $filter
 * @memberOf Base#
 * @param  {*} options
 * @return {base}
 */
module.exports = exports = function( options ) {
  var results = options.results || []
  var filter = returnFilter( options )
  var isBase = results && results instanceof Base
  var index = 0

  for( var key$ in this ) {
    if( key$[0] !== '_' ) {
      var child = this[key$]
      if( filter === void 0 || filter( child ) ){
        if(isBase){
          results.$setKeyInternal(index++,child)
        }else{
          results[index++] = child
        }
      }
    }
  }

  //this has to go wrong so many times
  while(results[index]){
    if(results.constructor === Array){
      results = results.splice(0,index)
    }else{
      delete results[index]
    }
    index++
  }

  return results
}