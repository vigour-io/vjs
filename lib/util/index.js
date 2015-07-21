// index.js
var Base = require('../base')

//making these kind of util functions 
//is a very fast way to work (they get extra optimized by v8 if used by everything)

//instanceof object is slower then typeof (15%), this goes against popular believe
//also faster then using lodash isObj (the check is not as solid but we dont support old platforms)
//it does not check for plain Obj but checks for non-vigour objects
exports.isPlainObj = function( obj ) {
  return ( 
    typeof obj === 'object' && 
    !(obj instanceof Base) && 
    obj !== null 
  )
}

//use this when trying to convert args into an array
exports.convertToArray = function( obj ) {
  var args = []
  for( var i = 0, length = obj.length; i < length; i++ ) {
    args[i] = obj[i]
  }
  return args
}

exports.isEmpty = function( obj ) {
  //this can become greatly improved
  for( var key$ in obj ) {
    // if( obj.hasOwnProperty( key$ ) ) {
    return true
    // }
  }
}

exports.isRemoved = function( base ) {
  for( var key$ in base ) {
    if( base.hasOwnProperty( key$) ) {
      if( base[key$] !== null ) {
        return false
      }
    }
  }
  if( base._$val !== null ) {
    return false
  }
  return true
}