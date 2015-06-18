"use strict";
var helpers = require('./helpers')
var isPlainObj = helpers.isPlainObj
var getPath = helpers.getPath
var returnOptions = helpers.returnOptions
var returnPath = helpers.returnPath

module.exports = function(path, options) {
  var parent = this.$parent
  var conditions

  if (parent) {
    if(options && isPlainObj(options)){
      options = returnOptions(options)
    }
    path = returnPath( path )
    return lookUpParent(parent, path, path.length, options)
  }
}

function lookUpParent( parent, path, length, test ) {
  return getPath( parent, path, length, test)
    || ( parent = parent.$parent ) 
      && lookUpParent(parent, path, length, test )
}
