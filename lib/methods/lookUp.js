"use strict";

var helpers = require('./shared')
var isPlainObj = helpers.isPlainObj
var getPath = helpers.getPath
var returnFilter = helpers.returnFilter
var returnPath = helpers.returnPath

/**
 * @function lookUp
 * @memberOf Base#
 * @param  {string|string[]} path Path or field to find in parent tree
 * @param  {*} [options] {regexp} Results will be tested using rexexp
 * <br>{base|string|boolean} Use options to compare with results
 * <br>{function} Call for each result, with result as param
 * <br>{object} Can contain the following:
 * @param  {object} options.conditions Results will be tested by these conditions
 * @return {object} result
 */
exports.$define = {
  lookUp: function( path, options ) {
    var parent = this.$parent
    var filter

    if( parent ) {
      filter = returnFilter( options )
      path = returnPath( path )
      return lookUpParent( parent, path, path.length, filter )
    }
  }
}

function lookUpParent( parent, path, length, filter ) {
  return getPath( parent, path, length, filter)
    || ( parent = parent.$parent ) 
      && lookUpParent( parent, path, length, filter )
}
