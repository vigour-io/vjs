"use strict";

var evaluate = require('../../util/test')
var isPlainObj = require('../../util').isPlainObj

module.exports = {
  clean:clean,
  getPath:getPath,
  createPath:createPath,
  isPlainObj:isPlainObj,
  returnPath:returnPath,
  returnFilter:returnFilter
}

function clean( obj, index ){
  if(obj.constructor === Array){
    return obj.splice(0,index)
  }
  while(obj[index]){
    delete obj[index++]
  }
  return obj
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

function getPath( obj, path, length, filter, set ) {
  console.log('ok bur', path)
  var i = 0
  var result = obj[path[0]]

  while (result) {
    console.log('yes got something', result && result.$val)
    if (++i === length) {
      if( filter === void 0 || filter(result) ){
        console.log('length reached, return dat result')
        return result
      }
    }
    if(typeof result === 'function'){
      return result.call(obj,path.splice(i), filter)
    }
    obj = result
    result = result[path[i]]
  }

  if(set !== void 0){
    return createPath(obj, path.splice(i), length - i, set)
  }
}

function returnFilter( options ){
  if(options !== void 0){
    var conditions
    var filter
    
    if(typeof options === 'function'){
      return options
    }
    
    if(isPlainObj(options)){
      conditions = options.conditions

      if(conditions){
        return function( subject ){
            return evaluate( subject, conditions )
          }
      }

      if(options instanceof RegExp){
        return function( subject ){
          return options.test (subject )
        }
      }

      if(options.contructor === Array){
        var length = options.length
        return function( subject ){
          for (var i = length - 1; i >= 0; i--) {
            var value = options[i]
            if(subject === value || subject._$val === value){
              return true
            }
          }
        }
      }

    }else{

      return function( subject ){
        return subject === options || subject._$val === options
      }

    }
  }
}

function returnPath( path ){
  return typeof path === 'string' ? path.split('.') : path
}