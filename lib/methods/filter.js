"use strict";

var Base = require('../base')
var evaluate = require('../util/test')
var helpers = require('./helpers')
var clean = helpers.clean
var returnFilter = helpers.returnFilter

/**
 * @function filter
 * @memberOf Base#
 * @param  {*} options
 * @return {base}
 */
exports.$define = {
  filter: function( options ) {
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

    return clean( results, index )
  }
}