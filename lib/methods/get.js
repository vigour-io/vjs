"use strict";

var helpers = require('./shared')
var getPath = helpers.getPath
var returnPath = helpers.returnPath

/**
 * @function get
 * @memberOf Base#
 * @param  {string|string[]} path Path or field to get and/or set
 * @param  {*} [set] Value to set on path
 * @return {base}
 */
exports.$define = {
  get: function( path, set ){
    path = returnPath( path )
    var result = getPath( this, path, path.length, void 0, set )
    if( result ){
      return result
    }
  }
}