"use strict";
var helpers = require('./helpers')
var getPath = helpers.getPath
var returnPath = helpers.returnPath

module.exports = function( path, set ){
  path = returnPath( path )
  var result = getPath( this, path, path.length, void 0, set)
  if(result){
    return result
  }
}