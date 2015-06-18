"use strict";
var helpers = require('./helpers')
var createPath = helpers.createPath
var returnPath = helpers.returnPath

module.exports = function( path, set ){
  path = returnPath( path )
  return createPath( this, path, path.length, set)
}