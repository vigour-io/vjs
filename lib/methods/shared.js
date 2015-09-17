"use strict";

var evaluate = require('../util/test')
var isPlainObj = require('../util').isPlainObj
var createPath
var getPath

exports.clean = function( obj, index ){
  if(obj.constructor === Array){
    return obj.splice(0,index)
  }
  while(obj[index]){
    delete obj[index++]
  }
  return obj
}

exports.createPath = createPath = function( obj, path, length, set ){
  var setObj = {}
  var nextObj = setObj
  var i = 0
  var field
  for(;i < length - 1; i++ ) {
    field = path[i]
    nextObj[field] = {}
    nextObj = nextObj[field]
  }
  if(set !== void 0){
    nextObj[path[i]] = set
  }else{
    nextObj[path[i]] = {}
  }
  obj.set(setObj)
  return getPath( obj, path, length )
}

exports.getPath = getPath = function( obj, path, length, filter, set ) {
  var i = 0
  var result = obj[path[0]]

  while( result ) {
    if ( ++i === length ) {
      if( filter === void 0 || filter(result, obj) ){
        return result
      }
    }
    if( typeof result === 'function' ){
      return result.call( obj,path.splice(i), filter )
    }
    obj = result
    result = result[path[i]]
  }

  if(set !== void 0){
    return createPath(obj, path.splice(i), length - i, set)
  }
}

exports.returnFilter = function( options ){
  if( options !== void 0 ){
    var conditions
    var filter

    if( typeof options === 'function' ){
      return options
    }

    if( isPlainObj( options ) ){
      conditions = options.conditions

      if( conditions ){
        return function( subject ){
          return evaluate( subject, conditions )
        }
      }

      if( options instanceof RegExp ){
        return function( subject ){
          return options.test ( subject )
        }
      }

      if( options.constructor === Array ){
        var length = options.length
        return function( subject ){
          for( var i = length - 1; i >= 0; i-- ) {
            var value = options[i]
            if( subject === value || subject._$input === value ){
              return true
            }
          }
        }
      }

    } else {
      return function( subject ){
        return subject === options || subject._$input === options
      }
    }
  }
}

exports.returnPath = function( path ){
  return typeof path === 'string' ? path.split('.') : path
}
