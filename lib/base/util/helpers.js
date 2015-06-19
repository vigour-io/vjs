"use strict";

var evaluate = require('../../util/test')
var isPlainObj = require('../../util').isPlainObj

module.exports = {
  getPath:getPath,
  createPath:createPath,
  isPlainObj:isPlainObj,
  returnPath:returnPath,
  returnOptions:returnOptions
}

function getPath( obj, path, length, test, set ) {
  var i = 0
  var result = obj[path[0]]
  while (result) {
    if (++i === length) {
      if( test === void 0
        || typeof test === 'function'
          && test(result)
        || result === test 
        || result._$val === test
      ){
        return result
      }
    }
    if(typeof result === 'function'){
      return result.call(obj,path.splice(i), test)
    }
    obj = result
    result = result[path[i]]
  }
  if(set !== void 0){
    return createPath(obj, path.splice(i), length - i, set)
  }
}

function createPath( obj, path, length, set ){
  var setObj = {}
  var i = 0
  var field = path[0]
  while(field){
    if (++i === length) {
      if(set !== void 0){
        setObj[field] = set    
      }
      obj.$set(setObj)
      return getPath( obj, path, length )
    }
    setObj[field] = {}
    field = path[i]
  }
}

//options for $find, $lookDown and $lookUp
function returnOptions( options ){
  var conditions = options.conditions
  if(conditions){
    return function( result ){
      return evaluate( result, conditions )
    }
  }
  if(options instanceof RegExp){
    return function( result ){
      return options.test(result)
    }
  }
  return options
}

function returnPath( path ){
  return typeof path === 'string' ? path.split('.') : path
}