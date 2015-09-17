"use strict";
var Base = require('../base')
var isNumber = require('lodash/lang/isNumber')
var Readable = require('stream').Readable
//making these kind of util functions
//is a very fast way to work (they get extra optimized by v8 if used by everything)

//utils can become seperate files (cleaner)

//instanceof object is slower then typeof (15%), this goes against popular believe
//also faster then using lodash isObj (the check is not as solid but we dont support old platforms)
//it does not check for plain Obj but checks for non-vigour objects
exports.isPlainObj = function( obj ) {
  return (
    typeof obj === 'object' &&
    !(obj instanceof Base) &&
    !(obj instanceof Readable) &&
    obj !== null
  )
}

//use this when trying to convert args into an array
exports.convertToArray = function( obj, index ) {
  var args = []
  for( var i = index || 0, length = obj.length; i < length; i++ ) {
    // args[i] = obj[i]
    args.push(obj[i])
  }
  return args
}

exports.isNumber = isNumber

exports.isLikeNumber = function( val ) {
  if( val === null ) {
    return;
  }
  var length = val.length
  if( !length ) {
    return isNumber( val )
  }
  var i = 0;
  //charAt is faster in v8
  if( val.charAt(0) === '-' ) {
    if( length === 1 ) {
      return;
    }
    i = 1
  }
  for ( ;i < length; i++ ) {
    var c = val.charAt(i)
    //bit range is outside number range
    if (c <= '/' || c >= ':') {
      return;
    }
  }
  return true
}

exports.isEmpty = function( obj ) {
  //this can become greatly improved
  //weird stuff going on -- find something better
  //hasOwnproperty is not good though...
  //do perf tests here...
  //eg. on emitters this does not work (emitters use $)
  //maybe remove $ remove in emitters?
  //maybe make .isEmpty as a method - that is configurable?
  for( var key$ in obj ) {
    if( key$[0] !== '_' && key$[0] !== '$' && obj[key$] !== null ) {
      // console.log('hello?', key$, obj[key$] )
      return false
    }
  }
  return true
}

exports.isRemoved = function( base ) {
  for( var key$ in base ) {
    if( base.hasOwnProperty( key$) ) {
      //temp fix -- should become configurable
      //this thing is only used in tests however
      if( base[key$] !== null
          && key$ !== '$key'
          && key$ !== '$lastStamp'
      ) {
        return false
      }
    }
  }
  if( base._$input !== null ) {
    return false
  }
  return true
}
