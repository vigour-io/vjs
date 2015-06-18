"use strict";
var helpers = require('./helpers')
var isPlainObj = helpers.isPlainObj
var getPath = helpers.getPath
var returnOptions = helpers.returnOptions
var returnPath = helpers.returnPath

module.exports = function( path, options ) {  
  path = returnPath( path )

  var cap
  var conditions
  var index = 0
  var length = path.length
  var results = []

  if( options && isPlainObj(options) ){
    cap = options.cap
    options = returnOptions( options )
  }
  
  function searchObj( obj ){
    var result = getPath( obj, path, length, options )
    if( result ){
      results[index++] = result
    }
    if( cap === void 0 || index < cap ){
      for(var key$ in obj){
        if (key$[0] !== '_') {
          searchObj(obj[key$])
        }
      }
    }
    return results
  }

  return searchObj(this)
}